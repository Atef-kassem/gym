import { useState, useMemo } from "react";
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
import { useGetAllBranchesQuery } from "@/services/branchesApi";
import {
  Plus, Save, Search, Edit, Trash2, Dumbbell,
  Filter, Download, TrendingUp, Activity, Award,
  CheckCircle, XCircle, Target, Zap, User
} from "lucide-react";

const StrengthTraining = () => {
  const { toast } = useToast();
  const { data: branchesData } = useGetAllBranchesQuery(undefined as any);
  const branches = Array.isArray(branchesData?.data) ? branchesData.data : [];

  const [exercises, setExercises] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMuscleGroup, setFilterMuscleGroup] = useState<string>("all");
  const [filterEquipment, setFilterEquipment] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    muscleGroup: "",
    equipment: "",
    difficulty: "",
    sets: "",
    reps: "",
    weight: "",
    restTime: "",
    instructions: "",
    notes: ""
  });

  // فلترة التمارين
  const filteredExercises = useMemo(() => {
    return exercises.filter(exercise => {
      const matchesSearch = !searchQuery ||
        exercise.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.muscleGroup?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesMuscleGroup = filterMuscleGroup === "all" || exercise.muscleGroup === filterMuscleGroup;
      const matchesEquipment = filterEquipment === "all" || exercise.equipment === filterEquipment;
      
      return matchesSearch && matchesMuscleGroup && matchesEquipment;
    });
  }, [exercises, searchQuery, filterMuscleGroup, filterEquipment]);

  // إحصائيات
  const stats = useMemo(() => {
    const total = exercises.length;
    const upperBody = exercises.filter(e => e.muscleGroup === "upper").length;
    const lowerBody = exercises.filter(e => e.muscleGroup === "lower").length;
    const core = exercises.filter(e => e.muscleGroup === "core").length;

    return { total, upperBody, lowerBody, core };
  }, [exercises]);

  const muscleGroups = Array.from(new Set(exercises.map(e => e.muscleGroup)));
  const equipmentTypes = Array.from(new Set(exercises.map(e => e.equipment)));

  const handleAdd = () => {
    setFormData({
      name: "",
      muscleGroup: "",
      equipment: "",
      difficulty: "",
      sets: "",
      reps: "",
      weight: "",
      restTime: "",
      instructions: "",
      notes: ""
    });
    setIsAddDialogOpen(true);
  };

  const handleEdit = (exercise: any) => {
    setSelectedExercise(exercise);
    setFormData({
      name: exercise.name || "",
      muscleGroup: exercise.muscleGroup || "",
      equipment: exercise.equipment || "",
      difficulty: exercise.difficulty || "",
      sets: exercise.sets || "",
      reps: exercise.reps || "",
      weight: exercise.weight || "",
      restTime: exercise.restTime || "",
      instructions: exercise.instructions || "",
      notes: exercise.notes || ""
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (exercise: any) => {
    setSelectedExercise(exercise);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveAdd = () => {
    if (!formData.name || !formData.muscleGroup || !formData.equipment) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    const newExercise = {
      id: exercises.length + 1,
      ...formData
    };

    setExercises([...exercises, newExercise]);
    setIsAddDialogOpen(false);
    toast({
      title: "نجح",
      description: "تم إضافة التمرين بنجاح"
    });

    setFormData({
      name: "",
      muscleGroup: "",
      equipment: "",
      difficulty: "",
      sets: "",
      reps: "",
      weight: "",
      restTime: "",
      instructions: "",
      notes: ""
    });
  };

  const handleSaveEdit = () => {
    if (!formData.name || !formData.muscleGroup || !formData.equipment) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    setExercises(exercises.map(e =>
      e.id === selectedExercise.id
        ? { ...formData }
        : e
    ));

    setIsEditDialogOpen(false);
    setSelectedExercise(null);
    toast({
      title: "نجح",
      description: "تم تحديث التمرين بنجاح"
    });
  };

  const handleConfirmDelete = () => {
    setExercises(exercises.filter(e => e.id !== selectedExercise.id));
    setIsDeleteDialogOpen(false);
    setSelectedExercise(null);
    toast({
      title: "نجح",
      description: "تم حذف التمرين بنجاح"
    });
  };

  const getDifficultyBadge = (difficulty: string) => {
    if (difficulty === "beginner") {
      return <Badge className="bg-green-500">مبتدئ</Badge>;
    } else if (difficulty === "intermediate") {
      return <Badge className="bg-blue-500">متوسط</Badge>;
    } else {
      return <Badge className="bg-red-500">متقدم</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* العنوان والبحث */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">تمارين القوة</h1>
            <p className="text-gray-600 mt-1">إدارة تمارين القوة واللياقة البدنية</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="البحث عن تمرين..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              فلتر
              {(filterMuscleGroup !== "all" || filterEquipment !== "all") && (
                <Badge className="bg-blue-500">{[filterMuscleGroup, filterEquipment].filter(f => f !== "all").length}</Badge>
              )}
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              تصدير
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAdd}>
              <Plus className="w-5 h-5 ml-2" />
              إضافة تمرين جديد
            </Button>
          </div>
        </div>

        {/* البطاقات الإحصائية */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>إجمالي التمارين</span>
                <Dumbbell className="w-5 h-5 text-blue-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>الجزء العلوي</span>
                <Target className="w-5 h-5 text-orange-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{stats.upperBody}</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>الجزء السفلي</span>
                <Activity className="w-5 h-5 text-green-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.lowerBody}</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>البطن</span>
                <Zap className="w-5 h-5 text-purple-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{stats.core}</div>
            </CardContent>
          </Card>
        </div>

        {/* الفلاتر */}
        {showFilters && (
          <Card className="border-2 border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-blue-600" />
                  الفلاتر
                </span>
                <Button variant="ghost" size="sm" onClick={() => {
                  setFilterMuscleGroup("all");
                  setFilterEquipment("all");
                }}>
                  <XCircle className="w-4 h-4 ml-1" />
                  إعادة تعيين
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>المجموعة العضلية</Label>
                  <Select value={filterMuscleGroup} onValueChange={setFilterMuscleGroup}>
                    <SelectTrigger>
                      <SelectValue placeholder="جميع المجموعات" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع المجموعات</SelectItem>
                      {muscleGroups.map(group => (
                        <SelectItem key={group} value={group}>
                          {group === "upper" ? "الجزء العلوي" : group === "lower" ? "الجزء السفلي" : group === "core" ? "البطن" : group}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>المعدات</Label>
                  <Select value={filterEquipment} onValueChange={setFilterEquipment}>
                    <SelectTrigger>
                      <SelectValue placeholder="جميع المعدات" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع المعدات</SelectItem>
                      {equipmentTypes.map(eq => (
                        <SelectItem key={eq} value={eq}>{eq}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* عرض الجدول */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Dumbbell className="w-5 h-5" />
                قائمة التمارين ({filteredExercises.length})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">اسم التمرين</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">المجموعة العضلية</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">المعدات</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">المستوى</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">المجموعات</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">التكرارات</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">الوزن</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">وقت الراحة</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExercises.map((exercise) => (
                    <tr key={exercise.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 font-semibold whitespace-nowrap">{exercise.name}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm">
                        {exercise.muscleGroup === "upper" ? "الجزء العلوي" : 
                         exercise.muscleGroup === "lower" ? "الجزء السفلي" : 
                         exercise.muscleGroup === "core" ? "البطن" : exercise.muscleGroup}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm">{exercise.equipment}</td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {getDifficultyBadge(exercise.difficulty)}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm">{exercise.sets || "-"}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm">{exercise.reps || "-"}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm">{exercise.weight || "-"}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm">{exercise.restTime || "-"}</td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex gap-2 justify-end">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(exercise)} title="تعديل" className="hover:bg-blue-50">
                            <Edit className="w-4 h-4 text-blue-600" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(exercise)} title="حذف" className="hover:bg-red-50">
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredExercises.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Dumbbell className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>لا توجد نتائج مطابقة</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialog إضافة تمرين جديد */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>إضافة تمرين قوة جديد</DialogTitle>
              <DialogDescription>
                أدخل بيانات التمرين الجديد
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">اسم التمرين *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="أدخل اسم التمرين"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="muscleGroup">المجموعة العضلية *</Label>
                  <Select
                    value={formData.muscleGroup}
                    onValueChange={(value) => setFormData({ ...formData, muscleGroup: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المجموعة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upper">الجزء العلوي</SelectItem>
                      <SelectItem value="lower">الجزء السفلي</SelectItem>
                      <SelectItem value="core">البطن</SelectItem>
                      <SelectItem value="full">كامل الجسم</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="equipment">المعدات *</Label>
                  <Select
                    value={formData.equipment}
                    onValueChange={(value) => setFormData({ ...formData, equipment: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المعدات" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dumbbells">أثقال</SelectItem>
                      <SelectItem value="barbell">بار</SelectItem>
                      <SelectItem value="machine">آلة</SelectItem>
                      <SelectItem value="bodyweight">وزن الجسم</SelectItem>
                      <SelectItem value="cables">كابلات</SelectItem>
                      <SelectItem value="resistance">مقاومة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">المستوى</Label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المستوى" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">مبتدئ</SelectItem>
                      <SelectItem value="intermediate">متوسط</SelectItem>
                      <SelectItem value="advanced">متقدم</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sets">عدد المجموعات</Label>
                  <Input
                    id="sets"
                    type="number"
                    value={formData.sets}
                    onChange={(e) => setFormData({ ...formData, sets: e.target.value })}
                    placeholder="3"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reps">عدد التكرارات</Label>
                  <Input
                    id="reps"
                    type="number"
                    value={formData.reps}
                    onChange={(e) => setFormData({ ...formData, reps: e.target.value })}
                    placeholder="10-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">الوزن (كجم)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    placeholder="20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="restTime">وقت الراحة (ثواني)</Label>
                  <Input
                    id="restTime"
                    type="number"
                    value={formData.restTime}
                    onChange={(e) => setFormData({ ...formData, restTime: e.target.value })}
                    placeholder="60"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructions">التعليمات</Label>
                <Textarea
                  id="instructions"
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  placeholder="أدخل تعليمات التمرين"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">ملاحظات</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="أدخل ملاحظات إضافية"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={handleSaveAdd} className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 ml-2" />
                حفظ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog تعديل تمرين */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>تعديل تمرين القوة</DialogTitle>
              <DialogDescription>
                قم بتعديل بيانات التمرين
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {/* نفس الحقول كما في الإضافة */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">اسم التمرين *</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="أدخل اسم التمرين"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-muscleGroup">المجموعة العضلية *</Label>
                  <Select
                    value={formData.muscleGroup}
                    onValueChange={(value) => setFormData({ ...formData, muscleGroup: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المجموعة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upper">الجزء العلوي</SelectItem>
                      <SelectItem value="lower">الجزء السفلي</SelectItem>
                      <SelectItem value="core">البطن</SelectItem>
                      <SelectItem value="full">كامل الجسم</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-equipment">المعدات *</Label>
                  <Select
                    value={formData.equipment}
                    onValueChange={(value) => setFormData({ ...formData, equipment: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المعدات" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dumbbells">أثقال</SelectItem>
                      <SelectItem value="barbell">بار</SelectItem>
                      <SelectItem value="machine">آلة</SelectItem>
                      <SelectItem value="bodyweight">وزن الجسم</SelectItem>
                      <SelectItem value="cables">كابلات</SelectItem>
                      <SelectItem value="resistance">مقاومة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-difficulty">المستوى</Label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المستوى" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">مبتدئ</SelectItem>
                      <SelectItem value="intermediate">متوسط</SelectItem>
                      <SelectItem value="advanced">متقدم</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-sets">عدد المجموعات</Label>
                  <Input
                    id="edit-sets"
                    type="number"
                    value={formData.sets}
                    onChange={(e) => setFormData({ ...formData, sets: e.target.value })}
                    placeholder="3"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-reps">عدد التكرارات</Label>
                  <Input
                    id="edit-reps"
                    type="number"
                    value={formData.reps}
                    onChange={(e) => setFormData({ ...formData, reps: e.target.value })}
                    placeholder="10-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-weight">الوزن (كجم)</Label>
                  <Input
                    id="edit-weight"
                    type="number"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    placeholder="20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-restTime">وقت الراحة (ثواني)</Label>
                  <Input
                    id="edit-restTime"
                    type="number"
                    value={formData.restTime}
                    onChange={(e) => setFormData({ ...formData, restTime: e.target.value })}
                    placeholder="60"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-instructions">التعليمات</Label>
                <Textarea
                  id="edit-instructions"
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  placeholder="أدخل تعليمات التمرين"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-notes">ملاحظات</Label>
                <Textarea
                  id="edit-notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="أدخل ملاحظات إضافية"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={handleSaveEdit} className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 ml-2" />
                حفظ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog حذف تمرين */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>تأكيد الحذف</DialogTitle>
              <DialogDescription>
                هل أنت متأكد من حذف تمرين {selectedExercise?.name}؟ هذا الإجراء لا يمكن التراجع عنه.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                إلغاء
              </Button>
              <Button variant="destructive" onClick={handleConfirmDelete}>
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

export default StrengthTraining;

