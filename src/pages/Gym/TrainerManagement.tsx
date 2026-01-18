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
  UserCog, Plus, Search, Edit, Trash2, DollarSign, Save,
  Star, Users, Calendar, Loader2
} from "lucide-react";
import {
  useGetAllTrainersQuery,
  useCreateTrainerMutation,
  useUpdateTrainerMutation,
  useDeleteTrainerMutation,
} from "@/services/trainersApi";
import { Checkbox } from "@/components/ui/checkbox";

const TrainerManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { toast } = useToast();
  
  // جلب جميع المدربين من جدول AppTrainers
  const { data: trainersData, isLoading: isLoadingTrainers, error: trainersError, refetch: refetchTrainers } = useGetAllTrainersQuery({});
  
  // Debug: طباعة البيانات المستلمة
  useEffect(() => {
    if (trainersData) {
      console.log('📦 Trainers data received:', trainersData);
      console.log('📦 Trainers count:', trainersData?.data?.length || 0);
      if (trainersData?.data && trainersData.data.length > 0) {
        console.log('📦 First trainer sample:', trainersData.data[0]);
      }
    }
  }, [trainersData]);
  
  // Mutations
  const [createTrainer, { isLoading: isCreating }] = useCreateTrainerMutation();
  const [updateTrainer, { isLoading: isUpdating }] = useUpdateTrainerMutation();
  const [deleteTrainer, { isLoading: isDeleting }] = useDeleteTrainerMutation();

  // تحويل البيانات إلى الشكل المطلوب
  const trainers = useMemo(() => {
    // التحقق من بنية البيانات المختلفة
    let allTrainers = [];
    
    if (trainersData) {
      // دعم عدة أشكال للبيانات
      if (Array.isArray(trainersData)) {
        allTrainers = trainersData;
      } else if (trainersData.data && Array.isArray(trainersData.data)) {
        allTrainers = trainersData.data;
      } else if (trainersData.trainers && Array.isArray(trainersData.trainers)) {
        allTrainers = trainersData.trainers;
      }
    }
    
    console.log('📊 Trainers data structure:', {
      hasData: !!trainersData,
      isArray: Array.isArray(trainersData),
      hasDataProp: !!trainersData?.data,
      trainersCount: allTrainers.length
    });
    
    if (allTrainers.length === 0) {
      console.log('📊 No trainers found. Full response:', trainersData);
      return [];
    }
    
    // تحويل البيانات إلى الشكل المطلوب
    return allTrainers.map((trainer: any) => {
      return {
        id: trainer.id,
        name: trainer.name || '',
        specialization: trainer.specialization || 'غير محدد',
        experience: trainer.experience 
          ? (typeof trainer.experience === 'number' 
              ? `${trainer.experience} سنوات` 
              : `${trainer.experience}`)
          : 'غير محدد',
        rating: 0, // سيتم إضافته لاحقاً
        students: 0, // سيتم إضافته لاحقاً
        status: trainer.isActive ? 'نشط' : 'غير نشط',
        salary: 0, // لا يوجد حقل salary في AppTrainer
        phone: trainer.phone || '',
        email: trainer.email || '',
        notes: trainer.bio || '',
        branch: trainer.employee?.arabicName || '',
        department: '',
        employeeCode: '',
        employeeType: 'trainer',
        departmentId: null,
        branchId: null,
        employeeId: trainer.employeeId,
      };
    });
  }, [trainersData]);

  // تصفية المدربين حسب البحث
  const filteredTrainers = useMemo(() => {
    if (!searchQuery) return trainers;
    const query = searchQuery.toLowerCase();
    return trainers.filter((trainer: any) =>
      trainer.name.toLowerCase().includes(query) ||
      trainer.specialization.toLowerCase().includes(query) ||
      trainer.employeeCode.toLowerCase().includes(query) ||
      (trainer.phone && trainer.phone.includes(query)) ||
      (trainer.email && trainer.email.toLowerCase().includes(query))
    );
  }, [trainers, searchQuery]);

  // حساب الإحصائيات
  const statistics = useMemo(() => {
    const active = trainers.filter((t: any) => t.status === 'نشط').length;
    const total = trainers.length;
    const avgRating = trainers.length > 0 
      ? trainers.reduce((sum: number, t: any) => sum + (t.rating || 0), 0) / trainers.length 
      : 0;
    const totalStudents = trainers.reduce((sum: number, t: any) => sum + (t.students || 0), 0);
    
    return { total, active, inactive: total - active, avgRating, totalStudents };
  }, [trainers]);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    isTrainer: false,
    specialization: "",
    experience: "",
    salary: "",
    phone: "",
    email: "",
    notes: "",
    departmentId: "",
    branchId: ""
  });

  const handleAdd = () => {
    setFormData({
      name: "",
      isTrainer: true,
      specialization: "",
      experience: "",
      salary: "",
      phone: "",
      email: "",
      notes: "",
      departmentId: "",
      branchId: ""
    });
    setIsAddDialogOpen(true);
  };

  const handleEdit = (trainer: any) => {
    setSelectedTrainer(trainer);
    
    // استخراج سنوات الخبرة من النص
    const experienceYears = typeof trainer.experience === 'string' && trainer.experience.includes('سنوات')
      ? trainer.experience.replace(' سنوات', '').replace('سنوات', '').trim()
      : typeof trainer.experience === 'number'
      ? trainer.experience.toString()
      : trainer.experience || "";
    
    setFormData({
      name: trainer.name,
      isTrainer: true,
      specialization: trainer.specialization || "",
      experience: experienceYears,
      salary: "",
      phone: trainer.phone || "",
      email: trainer.email || "",
      notes: trainer.notes || "",
      departmentId: "",
      branchId: ""
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (trainer: any) => {
    setSelectedTrainer(trainer);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveAdd = async () => {
    if (!formData.name || !formData.phone) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة (الاسم، رقم الهاتف)",
        variant: "destructive"
      });
      return;
    }

    // التحقق من الحقول المطلوبة للمدرب
    if (!formData.specialization || !formData.experience) {
      toast({
        title: "خطأ",
        description: "يرجى ملء التخصص وعدد سنوات الخبرة للمدرب",
        variant: "destructive"
      });
      return;
    }

    try {
      const experienceYears = parseInt(formData.experience) || 0;
      const trainerData = {
      name: formData.name,
        phone: formData.phone || '',
        email: formData.email || '',
      specialization: formData.specialization,
        experience: experienceYears,
        bio: formData.notes || '',
        isActive: true,
        employeeId: formData.departmentId || null, // يمكن استخدام employeeId لربط المدرب بموظف
      };
      
      await createTrainer(trainerData).unwrap();
      
    setIsAddDialogOpen(false);
      setFormData({
        name: "",
        isTrainer: false,
        specialization: "",
        experience: "",
        salary: "",
        phone: "",
        email: "",
        notes: "",
        departmentId: "",
        branchId: ""
      });
      refetchTrainers();
    toast({
      title: "نجح",
      description: "تم إضافة المدرب بنجاح"
    });
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error?.data?.message || "فشل إضافة المدرب",
        variant: "destructive"
      });
    }
  };

  const handleSaveEdit = async () => {
    if (!formData.name || !formData.phone) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة (الاسم، رقم الهاتف)",
        variant: "destructive"
      });
      return;
    }

    // التحقق من الحقول المطلوبة للمدرب
    if (!formData.specialization || !formData.experience) {
      toast({
        title: "خطأ",
        description: "يرجى ملء التخصص وعدد سنوات الخبرة للمدرب",
        variant: "destructive"
      });
      return;
    }

    if (!selectedTrainer) return;

    try {
      const experienceYears = parseInt(formData.experience) || 0;
      const trainerData = {
            name: formData.name,
        phone: formData.phone || '',
        email: formData.email || '',
            specialization: formData.specialization,
        experience: experienceYears,
        bio: formData.notes || '',
        employeeId: formData.departmentId || selectedTrainer.employeeId || null,
      };
      
      await updateTrainer({ id: selectedTrainer.id, ...trainerData }).unwrap();
    
    setIsEditDialogOpen(false);
    setSelectedTrainer(null);
      refetchTrainers();
    toast({
      title: "نجح",
      description: "تم تحديث بيانات المدرب بنجاح"
    });
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error?.data?.message || "فشل تحديث بيانات المدرب",
        variant: "destructive"
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedTrainer) return;

    try {
      await deleteTrainer(selectedTrainer.id).unwrap();
      
    setIsDeleteDialogOpen(false);
    setSelectedTrainer(null);
      refetchTrainers();
    toast({
      title: "نجح",
      description: "تم حذف المدرب بنجاح"
    });
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error?.data?.message || "فشل حذف المدرب",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-blue-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* العنوان */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">إدارة المدربين</h1>
            <p className="text-gray-600 mt-1">إدارة المدربين والمستحقات</p>
          </div>
          <div className="flex gap-3">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="البحث عن مدرب..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={handleAdd}>
              <Plus className="w-5 h-5 ml-2" />
              إضافة مدرب
            </Button>
          </div>
        </div>

        {/* إحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-indigo-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">إجمالي المدربين</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-indigo-600">{statistics.total}</div>
              <p className="text-sm text-gray-500 mt-1">مدرب مسجل</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">المدربون النشطون</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{statistics.active}</div>
              <p className="text-sm text-gray-500 mt-1">مدرب نشط</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">متوسط التقييم</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{statistics.avgRating.toFixed(1)}</div>
              <p className="text-sm text-gray-500 mt-1">من 5 نجوم</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">إجمالي المتدربين</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{statistics.totalStudents}</div>
              <p className="text-sm text-gray-500 mt-1">متدرب نشط</p>
            </CardContent>
          </Card>
        </div>

        {/* قائمة المدربين */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCog className="w-5 h-5" />
              قائمة المدربين
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingTrainers ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                <p className="mr-3 text-gray-600">جاري تحميل البيانات...</p>
              </div>
            ) : trainersError ? (
              <div className="text-center py-12 text-red-600">
                <p>حدث خطأ في تحميل البيانات</p>
                <p className="text-sm text-gray-500 mt-2">
                  {'data' in trainersError 
                    ? (trainersError.data as any)?.message || 'خطأ في الاتصال بالخادم'
                    : 'message' in trainersError
                    ? trainersError.message
                    : 'خطأ غير معروف'}
                </p>
                <Button onClick={() => refetchTrainers()} variant="outline" className="mt-4">
                  إعادة المحاولة
                </Button>
              </div>
            ) : filteredTrainers.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <UserCog className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="font-semibold mb-2">لا يوجد مدربين</p>
                <p className="text-sm text-gray-400 mb-4">
                  {trainersData?.data?.length === 0 
                    ? 'لا يوجد مدربين مسجلين في النظام'
                    : 'لا يوجد نتائج مطابقة'}
                </p>
                <Button onClick={handleAdd} variant="outline" className="mt-4">
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة مدرب جديد
                </Button>
              </div>
            ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-right py-3 px-4 font-semibold">الاسم</th>
                    <th className="text-right py-3 px-4 font-semibold">التخصص</th>
                    <th className="text-right py-3 px-4 font-semibold">الخبرة</th>
                    <th className="text-right py-3 px-4 font-semibold">التقييم</th>
                    <th className="text-right py-3 px-4 font-semibold">المتدربون</th>
                    <th className="text-right py-3 px-4 font-semibold">الحالة</th>
                    <th className="text-right py-3 px-4 font-semibold">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                    {filteredTrainers.map((trainer: any) => (
                    <tr key={trainer.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-semibold">{trainer.name}</td>
                      <td className="py-3 px-4">{trainer.specialization}</td>
                      <td className="py-3 px-4">{trainer.experience}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{trainer.rating}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-gray-500" />
                          {trainer.students}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={trainer.status === "نشط" ? "bg-green-500" : "bg-gray-500"}>
                          {trainer.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2 justify-end">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(trainer)} title="تعديل">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" title="الأجور">
                            <DollarSign className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" title="التقييمات">
                            <Star className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(trainer)} title="حذف">
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            )}
          </CardContent>
        </Card>

        {/* خيارات إضافية */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                أجور المدربين
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">إدارة مستحقات المدربين</p>
              <Button variant="outline" className="mt-4 w-full">
                عرض الأجور
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-600" />
                تقييمات المدربين
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">تقييمات أداء المدربين</p>
              <Button variant="outline" className="mt-4 w-full">
                عرض التقييمات
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Dialog إضافة موظف/مدرب جديد */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>إضافة موظف جديد</DialogTitle>
              <DialogDescription>
                أدخل بيانات الموظف الجديد
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">الاسم *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="اسم الموظف"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">رقم الهاتف *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="رقم الهاتف"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="البريد الإلكتروني"
                  />
                </div>
              </div>
              
              {/* حقل هل الموظف مدرب */}
              <div className="flex items-center space-x-2 space-x-reverse p-4 border rounded-lg">
                <Checkbox
                  id="isTrainer"
                  checked={formData.isTrainer}
                  onCheckedChange={(checked) => setFormData({...formData, isTrainer: checked === true})}
                />
                <Label htmlFor="isTrainer" className="text-base font-medium cursor-pointer">
                  هل الموظف مدرب؟
                </Label>
              </div>

              {/* حقول المدرب - تظهر فقط إذا كان مدرباً */}
              {formData.isTrainer && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="specialization">التخصص *</Label>
                      <Select value={formData.specialization} onValueChange={(value) => setFormData({...formData, specialization: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر التخصص" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="تمارين القوة">تمارين القوة</SelectItem>
                          <SelectItem value="اللياقة البدنية">اللياقة البدنية</SelectItem>
                          <SelectItem value="اليوغا">اليوغا</SelectItem>
                          <SelectItem value="الكارديو">الكارديو</SelectItem>
                          <SelectItem value="التدريب الشخصي">التدريب الشخصي</SelectItem>
                          <SelectItem value="تمارين المرونة">تمارين المرونة</SelectItem>
                          <SelectItem value="التدريب الوظيفي">التدريب الوظيفي</SelectItem>
                          <SelectItem value="تدريب الإصابات">تدريب الإصابات</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="experience">عدد سنوات الخبرة *</Label>
                      <Input
                        id="experience"
                        type="number"
                        min="0"
                        value={formData.experience}
                        onChange={(e) => setFormData({...formData, experience: e.target.value})}
                        placeholder="عدد السنوات"
                      />
                    </div>
                  </div>
                </>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="notes">ملاحظات</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="ملاحظات إضافية"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                إلغاء
              </Button>
              <Button 
                onClick={handleSaveAdd} 
                className="bg-indigo-600 hover:bg-indigo-700"
                disabled={isCreating}
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                <Save className="w-4 h-4 ml-2" />
                حفظ
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog تعديل موظف/مدرب */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>تعديل بيانات الموظف</DialogTitle>
              <DialogDescription>
                قم بتعديل بيانات الموظف
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">الاسم *</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="اسم المدرب"
                  />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">رقم الهاتف *</Label>
                  <Input
                    id="edit-phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="رقم الهاتف"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">البريد الإلكتروني</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="البريد الإلكتروني"
                  />
                </div>
              </div>
              
              {/* حقل هل الموظف مدرب */}
              <div className="flex items-center space-x-2 space-x-reverse p-4 border rounded-lg">
                <Checkbox
                  id="edit-isTrainer"
                  checked={formData.isTrainer}
                  onCheckedChange={(checked) => setFormData({...formData, isTrainer: checked === true})}
                />
                <Label htmlFor="edit-isTrainer" className="text-base font-medium cursor-pointer">
                  هل الموظف مدرب؟
                </Label>
              </div>

              {/* حقول المدرب - تظهر فقط إذا كان مدرباً */}
              {formData.isTrainer && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-specialization">التخصص *</Label>
                      <Select value={formData.specialization} onValueChange={(value) => setFormData({...formData, specialization: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر التخصص" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="تمارين القوة">تمارين القوة</SelectItem>
                          <SelectItem value="اللياقة البدنية">اللياقة البدنية</SelectItem>
                          <SelectItem value="اليوغا">اليوغا</SelectItem>
                          <SelectItem value="الكارديو">الكارديو</SelectItem>
                          <SelectItem value="التدريب الشخصي">التدريب الشخصي</SelectItem>
                          <SelectItem value="تمارين المرونة">تمارين المرونة</SelectItem>
                          <SelectItem value="التدريب الوظيفي">التدريب الوظيفي</SelectItem>
                          <SelectItem value="تدريب الإصابات">تدريب الإصابات</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-experience">عدد سنوات الخبرة *</Label>
                      <Input
                        id="edit-experience"
                        type="number"
                        min="0"
                        value={formData.experience}
                        onChange={(e) => setFormData({...formData, experience: e.target.value})}
                        placeholder="عدد السنوات"
                      />
                    </div>
                  </div>
                </>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="edit-notes">ملاحظات</Label>
                <Textarea
                  id="edit-notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="ملاحظات إضافية"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                إلغاء
              </Button>
              <Button 
                onClick={handleSaveEdit} 
                className="bg-indigo-600 hover:bg-indigo-700"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                <Save className="w-4 h-4 ml-2" />
                حفظ التغييرات
                  </>
                )}
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
                هل أنت متأكد من حذف المدرب "{selectedTrainer?.name}"؟ هذا الإجراء لا يمكن التراجع عنه.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                إلغاء
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    جاري الحذف...
                  </>
                ) : (
                  <>
                <Trash2 className="w-4 h-4 ml-2" />
                حذف
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
};

export default TrainerManagement;

