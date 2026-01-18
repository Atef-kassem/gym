import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  useGetAllTrainersQuery,
  useCreateTrainerMutation,
  useUpdateTrainerMutation,
  useDeleteTrainerMutation,
  useUploadAppImageMutation,
} from "@/services/appManagementApi";
import { useGetAllEmployeesQuery } from "@/services/employeesApi";
import {
  Plus, Search, Edit, Trash2, User, Filter, Download, Save
} from "lucide-react";

const AppTrainers = () => {
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState<any>(null);

  // جلب المدربين من API
  const { data: trainersData, isLoading, refetch: refetchTrainers } = useGetAllTrainersQuery({
    search: searchQuery,
  });
  const trainers = Array.isArray(trainersData?.data) ? trainersData.data : [];

  // جلب الموظفين من HR للربط
  const { data: employeesData } = useGetAllEmployeesQuery({ employeeType: "trainer" });
  const employees = Array.isArray(employeesData?.data) ? employeesData.data : [];

  // Mutations
  const [createTrainer] = useCreateTrainerMutation();
  const [updateTrainer] = useUpdateTrainerMutation();
  const [deleteTrainer] = useDeleteTrainerMutation();
  const [uploadAppImage] = useUploadAppImageMutation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    experience: "",
    bio: "",
    employeeId: "",
    isActive: true
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const filteredTrainers = trainers;

  const stats = useMemo(() => {
    const total = trainers.length;
    const active = trainers.filter(t => t.isActive).length;
    return { total, active };
  }, [trainers]);

  const handleSave = async () => {
    if (!formData.name) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    try {
      // رفع الصورة إذا تم اختيار ملف
      let imageUrl = (formData as any).imageUrl || null;
      if (imageFile) {
        const uploadRes = await uploadAppImage(imageFile).unwrap();
        imageUrl = uploadRes?.data?.link || uploadRes?.link || imageUrl;
      }

      const trainerData: any = {
        name: formData.name,
        email: formData.email || null,
        phone: formData.phone || null,
        specialization: formData.specialization || null,
        experience: formData.experience ? parseInt(formData.experience) : null,
        bio: formData.bio || null,
        employeeId: formData.employeeId || null,
        isActive: formData.isActive,
      };
      if (imageUrl) {
        trainerData.imageUrl = imageUrl;
      }

      if (selectedTrainer) {
        await updateTrainer({ id: selectedTrainer.id, data: trainerData }).unwrap();
        toast({
          title: "نجح",
          description: "تم تحديث المدرب بنجاح"
        });
        setIsEditDialogOpen(false);
      } else {
        await createTrainer(trainerData).unwrap();
        toast({
          title: "نجح",
          description: "تم إضافة المدرب بنجاح"
        });
        setIsAddDialogOpen(false);
      }
      
      setFormData({ name: "", email: "", phone: "", specialization: "", experience: "", bio: "", employeeId: "", isActive: true });
      setSelectedTrainer(null);
      setImageFile(null);
      setImagePreview(null);
      refetchTrainers();
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error?.data?.message || `حدث خطأ أثناء ${selectedTrainer ? 'تحديث' : 'إضافة'} المدرب`,
        variant: "destructive"
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTrainer(selectedTrainer.id).unwrap();
      toast({
        title: "نجح",
        description: "تم حذف المدرب بنجاح"
      });
      setIsDeleteDialogOpen(false);
      setSelectedTrainer(null);
      refetchTrainers();
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error?.data?.message || "حدث خطأ أثناء حذف المدرب",
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
              <User className="w-8 h-8 text-blue-600" />
              إدارة المدربين
            </h1>
            <p className="text-gray-600 mt-1">إدارة مدربين التطبيق</p>
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
              إضافة مدرب
            </Button>
          </div>
        </div>

        {/* البطاقات الإحصائية */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">إجمالي المدربين</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">المدربين النشطين</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.active}</div>
            </CardContent>
          </Card>
        </div>

        {/* الجدول */}
        <Card>
          <CardHeader>
            <CardTitle>قائمة المدربين ({filteredTrainers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">الاسم</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">البريد الإلكتروني</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">الهاتف</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">التخصص</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">الخبرة</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">الحالة</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTrainers.map((trainer) => (
                    <tr key={trainer.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-semibold whitespace-nowrap">{trainer.name}</td>
                      <td className="py-3 px-4 whitespace-nowrap">{trainer.email}</td>
                      <td className="py-3 px-4 whitespace-nowrap">{trainer.phone}</td>
                      <td className="py-3 px-4 whitespace-nowrap">{trainer.specialization}</td>
                      <td className="py-3 px-4 whitespace-nowrap">{trainer.experience} سنة</td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {trainer.isActive ? <Badge className="bg-green-500">نشط</Badge> : <Badge variant="outline">غير نشط</Badge>}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex gap-2 justify-end">
                          <Button variant="ghost" size="sm" onClick={() => {
                            setSelectedTrainer(trainer);
                            setFormData(trainer);
                            setImagePreview(trainer.imageUrl || null);
                            setIsEditDialogOpen(true);
                          }} className="hover:bg-blue-50">
                            <Edit className="w-4 h-4 text-blue-600" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => {
                            setSelectedTrainer(trainer);
                            setIsDeleteDialogOpen(true);
                          }} className="hover:bg-red-50">
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredTrainers.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <User className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p>لا يوجد مدربين</p>
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
            setFormData({ name: "", email: "", phone: "", specialization: "", experience: "", bio: "", employeeId: "", isActive: true });
            setSelectedTrainer(null);
            setImageFile(null);
            setImagePreview(null);
          }
        }}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedTrainer ? "تعديل مدرب" : "إضافة مدرب جديد"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">الاسم *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="أدخل الاسم"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="email@example.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">الهاتف</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+1234567890"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialization">التخصص</Label>
                  <Input
                    id="specialization"
                    value={formData.specialization}
                    onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                    placeholder="أدخل التخصص"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="experience">الخبرة (سنوات)</Label>
                  <Input
                    id="experience"
                    type="number"
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2 flex items-center gap-4 pt-6">
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                  />
                  <Label htmlFor="isActive">نشط</Label>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">السيرة الذاتية</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  placeholder="أدخل السيرة الذاتية"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="trainerImage">صورة المدرب (اختيارية)</Label>
                <Input
                  id="trainerImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setImageFile(file);
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setImagePreview(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    } else {
                      setImagePreview(null);
                    }
                  }}
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="معاينة صورة المدرب"
                      className="max-h-40 rounded-md border"
                    />
                  </div>
                )}
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

        {/* Dialog حذف */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>تأكيد الحذف</DialogTitle>
              <DialogDescription>
                هل أنت متأكد من حذف المدرب "{selectedTrainer?.name}"؟ هذا الإجراء لا يمكن التراجع عنه.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                إلغاء
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="w-4 h-4 ml-2" />
                حذف
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AppTrainers;

