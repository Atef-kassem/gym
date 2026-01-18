import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  useGetAllExercisesQuery,
  useCreateExerciseMutation,
  useUpdateExerciseMutation,
  useDeleteExerciseMutation,
  useUploadAppImageMutation,
} from "@/services/appManagementApi";
import { useGetAllExerciseCategoriesQuery } from "@/services/appManagementApi";
import {
  Plus, Search, Edit, Trash2, Activity, Download, Save
} from "lucide-react";

const AppExercises = () => {
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<any>(null);

  // جلب التمارين من API
  const { data: exercisesData, isLoading, refetch: refetchExercises } = useGetAllExercisesQuery({
    search: searchQuery,
    categoryId: filterCategory !== "all" ? filterCategory : undefined,
  });
  const exercises = Array.isArray(exercisesData?.data) ? exercisesData.data : [];

  // جلب التصنيفات
  const { data: categoriesData } = useGetAllExerciseCategoriesQuery();
  const categories = Array.isArray(categoriesData?.data) ? categoriesData.data : [];

  // Mutations
  const [createExercise] = useCreateExerciseMutation();
  const [updateExercise] = useUpdateExerciseMutation();
  const [deleteExercise] = useDeleteExerciseMutation();
  const [uploadAppImage] = useUploadAppImageMutation();

  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    description: "",
    instructions: "",
    duration: "",
    difficulty: ""
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const filteredExercises = exercises;

  const handleSave = async () => {
    if (!formData.name || !formData.categoryId) {
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

      const exerciseData: any = {
        name: formData.name,
        categoryId: parseInt(formData.categoryId),
        description: formData.description || null,
        instructions: formData.instructions || null,
        duration: formData.duration ? parseInt(formData.duration) : null,
        difficulty: formData.difficulty || null,
      };
      if (imageUrl) {
        exerciseData.imageUrl = imageUrl;
      }

      if (selectedExercise) {
        await updateExercise({ id: selectedExercise.id, data: exerciseData }).unwrap();
        toast({
          title: "نجح",
          description: "تم تحديث التمرين بنجاح"
        });
        setIsEditDialogOpen(false);
      } else {
        await createExercise(exerciseData).unwrap();
        toast({
          title: "نجح",
          description: "تم إضافة التمرين بنجاح"
        });
        setIsAddDialogOpen(false);
      }
      
      setFormData({ name: "", categoryId: "", description: "", instructions: "", duration: "", difficulty: "" });
      setSelectedExercise(null);
      setImageFile(null);
      setImagePreview(null);
      refetchExercises();
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error?.data?.message || `حدث خطأ أثناء ${selectedExercise ? 'تحديث' : 'إضافة'} التمرين`,
        variant: "destructive"
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteExercise(selectedExercise.id).unwrap();
      toast({
        title: "نجح",
        description: "تم حذف التمرين بنجاح"
      });
      setIsDeleteDialogOpen(false);
      setSelectedExercise(null);
      refetchExercises();
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error?.data?.message || "حدث خطأ أثناء حذف التمرين",
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
              <Activity className="w-8 h-8 text-blue-600" />
              إدارة التمارين
            </h1>
            <p className="text-gray-600 mt-1">إدارة تمارين التطبيق</p>
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
              إضافة تمرين
            </Button>
          </div>
        </div>

        {/* البطاقات الإحصائية */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">إجمالي التمارين</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{exercises.length}</div>
          </CardContent>
        </Card>

        {/* الجدول */}
        <Card>
          <CardHeader>
            <CardTitle>قائمة التمارين ({filteredExercises.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">اسم التمرين</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">التصنيف</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">المدة</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">الصعوبة</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExercises.map((exercise) => (
                    <tr key={exercise.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-semibold whitespace-nowrap">{exercise.name}</td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {categories.find(c => c.id === exercise.categoryId)?.name || "-"}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">{exercise.duration || "-"}</td>
                      <td className="py-3 px-4 whitespace-nowrap">{exercise.difficulty || "-"}</td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex gap-2 justify-end">
                          <Button variant="ghost" size="sm" onClick={() => {
                            setSelectedExercise(exercise);
                            setFormData(exercise);
                            setImagePreview(exercise.imageUrl || null);
                            setIsEditDialogOpen(true);
                          }} className="hover:bg-blue-50">
                            <Edit className="w-4 h-4 text-blue-600" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => {
                            setSelectedExercise(exercise);
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
              {filteredExercises.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p>لا توجد تمارين</p>
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
            setFormData({ name: "", categoryId: "", description: "", instructions: "", duration: "", difficulty: "" });
            setSelectedExercise(null);
          }
        }}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedExercise ? "تعديل تمرين" : "إضافة تمرين جديد"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">اسم التمرين *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="أدخل اسم التمرين"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoryId">التصنيف *</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => setFormData({...formData, categoryId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر التصنيف" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">المدة (دقائق)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="difficulty">الصعوبة</Label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={(value) => setFormData({...formData, difficulty: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الصعوبة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">سهل</SelectItem>
                      <SelectItem value="medium">متوسط</SelectItem>
                      <SelectItem value="hard">صعب</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">الوصف</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="أدخل وصف التمرين"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instructions">التعليمات</Label>
                <Textarea
                  id="instructions"
                  value={formData.instructions}
                  onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                  placeholder="أدخل تعليمات التمرين"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exerciseImage">صورة التمرين (اختيارية)</Label>
                <Input
                  id="exerciseImage"
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
                      alt="معاينة صورة التمرين"
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
                هل أنت متأكد من حذف التمرين "{selectedExercise?.name}"؟ هذا الإجراء لا يمكن التراجع عنه.
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

export default AppExercises;

