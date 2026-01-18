import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  useGetAllExerciseCategoriesQuery,
  useCreateExerciseCategoryMutation,
  useUpdateExerciseCategoryMutation,
  useDeleteExerciseCategoryMutation,
} from "@/services/appManagementApi";
import {
  Plus, Search, Edit, Trash2, FolderTree, Download, Save
} from "lucide-react";

const ExerciseCategories = () => {
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  // جلب التصنيفات من API
  const { data: categoriesData, isLoading, refetch: refetchCategories } = useGetAllExerciseCategoriesQuery();
  const categories = Array.isArray(categoriesData?.data) ? categoriesData.data : [];

  // Mutations
  const [createExerciseCategory] = useCreateExerciseCategoryMutation();
  const [updateExerciseCategory] = useUpdateExerciseCategoryMutation();
  const [deleteExerciseCategory] = useDeleteExerciseCategoryMutation();

  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });

  const filteredCategories = categories.filter(cat => {
    return !searchQuery ||
      cat.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleSave = async () => {
    if (!formData.name) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال اسم التصنيف",
        variant: "destructive"
      });
      return;
    }

    try {
      if (selectedCategory) {
        await updateExerciseCategory({ id: selectedCategory.id, data: formData }).unwrap();
        setIsEditDialogOpen(false);
      } else {
        await createExerciseCategory(formData).unwrap();
        setIsAddDialogOpen(false);
      }
      
      setFormData({ name: "", description: "" });
      setSelectedCategory(null);
      refetchCategories();
      toast({
        title: "نجح",
        description: `تم ${selectedCategory ? 'تحديث' : 'إضافة'} التصنيف بنجاح`
      });
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error?.data?.message || `حدث خطأ أثناء ${selectedCategory ? 'تحديث' : 'إضافة'} التصنيف`,
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (category: any) => {
    try {
      await deleteExerciseCategory(category.id).unwrap();
      toast({
        title: "نجح",
        description: "تم حذف التصنيف بنجاح"
      });
      refetchCategories();
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error?.data?.message || "حدث خطأ أثناء حذف التصنيف",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FolderTree className="w-8 h-8 text-blue-600" />
              إدارة تصنيفات التمارين
            </h1>
            <p className="text-gray-600 mt-1">إدارة تصنيفات التمارين في التطبيق</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="البحث..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              تصدير
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="w-5 h-5 ml-2" />
              إضافة تصنيف
            </Button>
          </div>
        </div>

        {/* البطاقات الإحصائية */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">إجمالي التصنيفات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{categories.length}</div>
          </CardContent>
        </Card>

        {/* الجدول */}
        <Card>
          <CardHeader>
            <CardTitle>قائمة التصنيفات ({filteredCategories.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">اسم التصنيف</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">الوصف</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.map((category) => (
                    <tr key={category.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-semibold whitespace-nowrap">{category.name}</td>
                      <td className="py-3 px-4 whitespace-nowrap max-w-xs truncate">{category.description || "-"}</td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex gap-2 justify-end">
                          <Button variant="ghost" size="sm" onClick={() => {
                            setSelectedCategory(category);
                            setFormData(category);
                            setIsEditDialogOpen(true);
                          }} className="hover:bg-blue-50">
                            <Edit className="w-4 h-4 text-blue-600" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => {
                            handleDelete(category);
                          }} className="hover:bg-red-50">
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredCategories.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <FolderTree className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p>لا توجد تصنيفات</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Dialog إضافة/تعديل */}
        <Dialog open={isAddDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          setIsEditDialogOpen(open);
          if (!open) {
            setFormData({ name: "", description: "" });
            setSelectedCategory(null);
          }
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedCategory ? "تعديل تصنيف" : "إضافة تصنيف جديد"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">اسم التصنيف *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="أدخل اسم التصنيف"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">الوصف</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="أدخل وصف التصنيف"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsAddDialogOpen(false);
                setIsEditDialogOpen(false);
              }}>
                إلغاء
              </Button>
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 ml-2" />
                حفظ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ExerciseCategories;

