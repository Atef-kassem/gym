import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  useGetAllGroupsQuery,
  useCreateGroupMutation,
  useUpdateGroupMutation,
  useDeleteGroupMutation,
  useGetGroupStatisticsQuery,
  useGetAllCategoriesQuery,
  useCreateCategoryMutation,
} from "@/services/groupsApi";
import {
  Users, Plus, Search, Edit, Trash2, Tag, Save
} from "lucide-react";

const GroupsCategories = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // جلب المجموعات من الـ API
  const { data: groupsData, isLoading: groupsLoading, refetch: refetchGroups } = useGetAllGroupsQuery({
    search: searchQuery || undefined,
  });
  const groups = Array.isArray(groupsData?.data) ? groupsData.data : [];

  // جلب الفئات من الـ API
  const { data: categoriesData, isLoading: categoriesLoading, refetch: refetchCategories } =
    useGetAllCategoriesQuery(undefined);
  const apiCategories = Array.isArray(categoriesData?.data)
    ? categoriesData.data.map((c: any) => c.name as string)
    : [];
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    trainer: "",
    schedule: ""
  });
  const [newCategoryName, setNewCategoryName] = useState("");
  const [localCategories, setLocalCategories] = useState<string[]>([]);

  // Mutations
  const [createGroup] = useCreateGroupMutation();
  const [updateGroup] = useUpdateGroupMutation();
  const [deleteGroup] = useDeleteGroupMutation();
  const [createCategory] = useCreateCategoryMutation();

  // إحصائيات من الـ API
  const { data: statsData } = useGetGroupStatisticsQuery(undefined);
  const apiStats = statsData?.data;
  const { toast } = useToast();

  // مزامنة الفئات المحلية مع الفئات القادمة من الـ API
  useEffect(() => {
    if (apiCategories.length > 0) {
      setLocalCategories(apiCategories);
    }
  }, [categoriesData]);

  const handleAdd = () => {
    setFormData({
      name: "",
      category: "",
      trainer: "",
      schedule: ""
    });
    setIsAddDialogOpen(true);
  };

  const handleEdit = (group: any) => {
    setSelectedGroup(group);
    setFormData({
      name: group.name,
      category: group.category,
      trainer: group.trainer,
      schedule: group.schedule
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (group: any) => {
    setSelectedGroup(group);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveAdd = async () => {
    if (!formData.name || !formData.category || !formData.trainer) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    try {
      await createGroup({
        name: formData.name,
        category: formData.category,
        trainerName: formData.trainer,
        schedule: formData.schedule,
      }).unwrap();

      await refetchGroups();
      setIsAddDialogOpen(false);
      toast({
        title: "نجح",
        description: "تم إضافة المجموعة بنجاح",
      });
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error?.data?.message || "حدث خطأ أثناء إضافة المجموعة",
        variant: "destructive",
      });
    }
  };

  const handleSaveEdit = async () => {
    if (!formData.name || !formData.category || !formData.trainer) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    try {
      await updateGroup({
        id: selectedGroup.id,
        data: {
          name: formData.name,
          category: formData.category,
          trainerName: formData.trainer,
          schedule: formData.schedule,
        },
      }).unwrap();

      await refetchGroups();
      setIsEditDialogOpen(false);
      setSelectedGroup(null);
      toast({
        title: "نجح",
        description: "تم تحديث المجموعة بنجاح",
      });
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error?.data?.message || "حدث خطأ أثناء تحديث المجموعة",
        variant: "destructive",
      });
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteGroup(selectedGroup.id).unwrap();
      await refetchGroups();
      setIsDeleteDialogOpen(false);
      setSelectedGroup(null);
      toast({
        title: "نجح",
        description: "تم حذف المجموعة بنجاح",
      });
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error?.data?.message || "حدث خطأ أثناء حذف المجموعة",
        variant: "destructive",
      });
    }
  };

  // حفظ فئة جديدة
  const handleSaveCategory = async () => {
    const name = newCategoryName.trim();
    if (!name) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال اسم الفئة",
        variant: "destructive"
      });
      return;
    }

    if (localCategories.includes(name)) {
      toast({
        title: "تنبيه",
        description: "هذه الفئة موجودة بالفعل",
        variant: "destructive"
      });
      return;
    }

    try {
      await createCategory({ name }).unwrap();
      await refetchCategories();
      // تحديث الحالة المحلية مباشرة لعرض الفئة فوراً
      setLocalCategories((prev) =>
        prev.includes(name) ? prev : [...prev, name]
      );
      setNewCategoryName("");
      setIsAddCategoryDialogOpen(false);
      toast({
        title: "نجح",
        description: "تم إضافة الفئة بنجاح",
      });
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error?.data?.message || "حدث خطأ أثناء إضافة الفئة",
        variant: "destructive",
      });
    }
  };

  // إحصائيات حقيقية تعتمد على البيانات الحالية
  const totalGroups = apiStats?.total ?? groups.length;
  const totalCategories = apiStats?.categories ?? localCategories.length;
  const totalMembers = apiStats?.totalMembers ?? 0;
  const totalTrainers = apiStats?.trainers ?? 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-yellow-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* العنوان */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">المجموعات والفئات</h1>
            <p className="text-gray-600 mt-1">إدارة مجموعات وفئات الأعضاء</p>
          </div>
          <div className="flex gap-3">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="البحث عن مجموعة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            <Button className="bg-amber-600 hover:bg-amber-700" onClick={handleAdd}>
              <Plus className="w-5 h-5 ml-2" />
              إضافة مجموعة
            </Button>
          </div>
        </div>

        {/* إحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-amber-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">إجمالي المجموعات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">{totalGroups}</div>
              <p className="text-sm text-gray-500 mt-1">مجموعة نشطة</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">الفئات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{totalCategories}</div>
              <p className="text-sm text-gray-500 mt-1">فئة مختلفة</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">الأعضاء</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{totalMembers}</div>
              <p className="text-sm text-gray-500 mt-1">عضو في مجموعات</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">المدربون</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{totalTrainers}</div>
              <p className="text-sm text-gray-500 mt-1">مدرب نشط</p>
            </CardContent>
          </Card>
        </div>

        {/* قائمة المجموعات */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              قائمة المجموعات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groups.map((group: any) => (
                <Card key={group.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{group.name}</CardTitle>
                      <Badge variant="outline">{group.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{group.members} عضو</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Tag className="w-4 h-4" />
                      <span>{group.trainer}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {group.schedule}
                    </div>
                    <div className="flex gap-2 pt-2 border-t">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(group)}>
                        <Edit className="w-4 h-4 ml-2" />
                        تعديل
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => handleDelete(group)}>
                        <Trash2 className="w-4 h-4 ml-2 text-red-500" />
                        حذف
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* الفئات */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="w-5 h-5" />
              الفئات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {localCategories.map((category: string) => (
                <Badge
                  key={category}
                  className="bg-blue-500 text-white px-4 py-2 text-sm cursor-pointer hover:bg-blue-600"
                >
                  {category}
                </Badge>
              ))}
              <Button variant="outline" size="sm" onClick={() => setIsAddCategoryDialogOpen(true)}>
                <Plus className="w-4 h-4 ml-2" />
                إضافة فئة
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Dialog إضافة فئة */}
        <Dialog open={isAddCategoryDialogOpen} onOpenChange={setIsAddCategoryDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>إضافة فئة جديدة</DialogTitle>
              <DialogDescription>أدخل اسم الفئة التي تريد استخدامها في المجموعات</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="category-name">اسم الفئة *</Label>
                <Input
                  id="category-name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="مثال: لياقة، قوة..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddCategoryDialogOpen(false)}>إلغاء</Button>
              <Button onClick={handleSaveCategory} className="bg-amber-600 hover:bg-amber-700">
                <Save className="w-4 h-4 ml-2" /> حفظ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog إضافة مجموعة */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>إضافة مجموعة جديدة</DialogTitle>
              <DialogDescription>أدخل بيانات المجموعة</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">اسم المجموعة *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="اسم المجموعة"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">الفئة *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الفئة" />
                    </SelectTrigger>
                      <SelectContent>
                        {localCategories.map((category: string) => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trainer">المدرب *</Label>
                  <Input
                    id="trainer"
                    value={formData.trainer}
                    onChange={(e) => setFormData({...formData, trainer: e.target.value})}
                    placeholder="اسم المدرب"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="schedule">الجدول</Label>
                <Input
                  id="schedule"
                  value={formData.schedule}
                  onChange={(e) => setFormData({...formData, schedule: e.target.value})}
                  placeholder="مثال: أيام الإثنين والأربعاء - 18:00"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>إلغاء</Button>
              <Button onClick={handleSaveAdd} className="bg-amber-600 hover:bg-amber-700">
                <Save className="w-4 h-4 ml-2" /> حفظ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog تعديل مجموعة */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>تعديل المجموعة</DialogTitle>
              <DialogDescription>قم بتعديل بيانات المجموعة</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">اسم المجموعة *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="اسم المجموعة"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-category">الفئة *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الفئة" />
                    </SelectTrigger>
                    <SelectContent>
                      {localCategories.map((category: string) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-trainer">المدرب *</Label>
                  <Input
                    id="edit-trainer"
                    value={formData.trainer}
                    onChange={(e) => setFormData({...formData, trainer: e.target.value})}
                    placeholder="اسم المدرب"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-schedule">الجدول</Label>
                <Input
                  id="edit-schedule"
                  value={formData.schedule}
                  onChange={(e) => setFormData({...formData, schedule: e.target.value})}
                  placeholder="مثال: أيام الإثنين والأربعاء - 18:00"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>إلغاء</Button>
              <Button onClick={handleSaveEdit} className="bg-amber-600 hover:bg-amber-700">
                <Save className="w-4 h-4 ml-2" /> حفظ التغييرات
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog تأكيد الحذف */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>تأكيد الحذف</DialogTitle>
              <DialogDescription>
                هل أنت متأكد من حذف المجموعة "{selectedGroup?.name}"؟ هذا الإجراء لا يمكن التراجع عنه.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>إلغاء</Button>
              <Button variant="destructive" onClick={handleConfirmDelete}>
                <Trash2 className="w-4 h-4 ml-2" /> حذف
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
};

export default GroupsCategories;

