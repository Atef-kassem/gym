import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
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
  Plus, Save, Search, Edit, Trash2, FileText,
  Filter, Download, TrendingUp, Activity, Award,
  CheckCircle, XCircle, Clock, Target, Dumbbell
} from "lucide-react";

const WorkoutTemplates = () => {
  const { toast } = useToast();
  const { data: branchesData, isLoading: branchesLoading } = useGetAllBranchesQuery(undefined as any);
  const branches = Array.isArray(branchesData?.data) ? branchesData.data : [];

  const [templates, setTemplates] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterDifficulty, setFilterDifficulty] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    difficulty: "",
    duration: "",
    description: "",
    exercises: [] as string[],
    instructions: ""
  });

  const [exerciseInput, setExerciseInput] = useState("");

  // فلترة القوالب
  const filteredTemplates = useMemo(() => {
    return templates.filter(template => {
      const matchesSearch = !searchQuery ||
        template.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = filterCategory === "all" || template.category === filterCategory;
      const matchesDifficulty = filterDifficulty === "all" || template.difficulty === filterDifficulty;
      
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [templates, searchQuery, filterCategory, filterDifficulty]);

  // إحصائيات
  const stats = useMemo(() => {
    const total = templates.length;
    const beginner = templates.filter(t => t.difficulty === "beginner").length;
    const intermediate = templates.filter(t => t.difficulty === "intermediate").length;
    const advanced = templates.filter(t => t.difficulty === "advanced").length;

    return { total, beginner, intermediate, advanced };
  }, [templates]);

  const categories = Array.from(new Set(templates.map(t => t.category)));

  const handleAdd = () => {
    setFormData({
      name: "",
      category: "",
      difficulty: "",
      duration: "",
      description: "",
      exercises: [],
      instructions: ""
    });
    setExerciseInput("");
    setIsAddDialogOpen(true);
  };

  const handleEdit = (template: any) => {
    setSelectedTemplate(template);
    setFormData({
      name: template.name || "",
      category: template.category || "",
      difficulty: template.difficulty || "",
      duration: template.duration || "",
      description: template.description || "",
      exercises: template.exercises || [],
      instructions: template.instructions || ""
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (template: any) => {
    setSelectedTemplate(template);
    setIsDeleteDialogOpen(true);
  };

  const handleAddExercise = () => {
    if (exerciseInput.trim()) {
      setFormData({
        ...formData,
        exercises: [...formData.exercises, exerciseInput.trim()]
      });
      setExerciseInput("");
    }
  };

  const handleRemoveExercise = (index: number) => {
    setFormData({
      ...formData,
      exercises: formData.exercises.filter((_, i) => i !== index)
    });
  };

  const handleSaveAdd = () => {
    if (!formData.name || !formData.category || !formData.difficulty) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    const newTemplate = {
      id: templates.length + 1,
      ...formData
    };

    setTemplates([...templates, newTemplate]);
    setIsAddDialogOpen(false);
    toast({
      title: "نجح",
      description: "تم إضافة قالب التمرين بنجاح"
    });

    setFormData({
      name: "",
      category: "",
      difficulty: "",
      duration: "",
      description: "",
      exercises: [],
      instructions: ""
    });
  };

  const handleSaveEdit = () => {
    if (!formData.name || !formData.category || !formData.difficulty) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    setTemplates(templates.map(t =>
      t.id === selectedTemplate.id
        ? { ...formData }
        : t
    ));

    setIsEditDialogOpen(false);
    setSelectedTemplate(null);
    toast({
      title: "نجح",
      description: "تم تحديث قالب التمرين بنجاح"
    });
  };

  const handleConfirmDelete = () => {
    setTemplates(templates.filter(t => t.id !== selectedTemplate.id));
    setIsDeleteDialogOpen(false);
    setSelectedTemplate(null);
    toast({
      title: "نجح",
      description: "تم حذف قالب التمرين بنجاح"
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
            <h1 className="text-3xl font-bold text-gray-900">قوالب التمارين</h1>
            <p className="text-gray-600 mt-1">إدارة قوالب التمارين الجاهزة</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="البحث عن قالب..."
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
              {(filterCategory !== "all" || filterDifficulty !== "all") && (
                <Badge className="bg-blue-500">{[filterCategory, filterDifficulty].filter(f => f !== "all").length}</Badge>
              )}
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              تصدير
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAdd}>
              <Plus className="w-5 h-5 ml-2" />
              إضافة قالب جديد
            </Button>
          </div>
        </div>

        {/* البطاقات الإحصائية */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>إجمالي القوالب</span>
                <FileText className="w-5 h-5 text-blue-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>مبتدئ</span>
                <Target className="w-5 h-5 text-green-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.beginner}</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>متوسط</span>
                <Activity className="w-5 h-5 text-blue-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.intermediate}</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>متقدم</span>
                <Award className="w-5 h-5 text-red-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{stats.advanced}</div>
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
                  setFilterCategory("all");
                  setFilterDifficulty("all");
                }}>
                  <XCircle className="w-4 h-4 ml-1" />
                  إعادة تعيين
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>الفئة</Label>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="جميع الفئات" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الفئات</SelectItem>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>المستوى</Label>
                  <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
                    <SelectTrigger>
                      <SelectValue placeholder="جميع المستويات" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع المستويات</SelectItem>
                      <SelectItem value="beginner">مبتدئ</SelectItem>
                      <SelectItem value="intermediate">متوسط</SelectItem>
                      <SelectItem value="advanced">متقدم</SelectItem>
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
                <FileText className="w-5 h-5" />
                قائمة القوالب ({filteredTemplates.length})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">اسم القالب</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">الفئة</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">المستوى</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">المدة</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">عدد التمارين</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">الوصف</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTemplates.map((template) => (
                    <tr key={template.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 font-semibold whitespace-nowrap">{template.name}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm">{template.category}</td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {getDifficultyBadge(template.difficulty)}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm">{template.duration || "-"}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm">{template.exercises?.length || 0}</td>
                      <td className="py-3 px-4 text-sm max-w-xs truncate" title={template.description || ""}>
                        {template.description || "-"}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex gap-2 justify-end">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(template)} title="تعديل" className="hover:bg-blue-50">
                            <Edit className="w-4 h-4 text-blue-600" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(template)} title="حذف" className="hover:bg-red-50">
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredTemplates.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>لا توجد نتائج مطابقة</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialog إضافة قالب جديد */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>إضافة قالب تمرين جديد</DialogTitle>
              <DialogDescription>
                أدخل بيانات قالب التمرين الجديد
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">اسم القالب *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="أدخل اسم القالب"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">الفئة *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الفئة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cardio">كارديو</SelectItem>
                      <SelectItem value="strength">قوة</SelectItem>
                      <SelectItem value="flexibility">مرونة</SelectItem>
                      <SelectItem value="hiit">HIIT</SelectItem>
                      <SelectItem value="yoga">يوجا</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">المستوى *</Label>
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
                  <Label htmlFor="duration">المدة (دقائق)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="30"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">الوصف</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="أدخل وصف القالب"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="exercises">التمارين</Label>
                <div className="flex gap-2">
                  <Input
                    id="exercises"
                    value={exerciseInput}
                    onChange={(e) => setExerciseInput(e.target.value)}
                    placeholder="أدخل اسم التمرين"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddExercise();
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddExercise}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.exercises.map((exercise, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {exercise}
                      <XCircle
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => handleRemoveExercise(index)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructions">التعليمات</Label>
                <Textarea
                  id="instructions"
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  placeholder="أدخل تعليمات القالب"
                  rows={4}
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

        {/* Dialog تعديل قالب */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>تعديل قالب التمرين</DialogTitle>
              <DialogDescription>
                قم بتعديل بيانات قالب التمرين
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {/* نفس الحقول كما في الإضافة */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">اسم القالب *</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="أدخل اسم القالب"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-category">الفئة *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الفئة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cardio">كارديو</SelectItem>
                      <SelectItem value="strength">قوة</SelectItem>
                      <SelectItem value="flexibility">مرونة</SelectItem>
                      <SelectItem value="hiit">HIIT</SelectItem>
                      <SelectItem value="yoga">يوجا</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-difficulty">المستوى *</Label>
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
                  <Label htmlFor="edit-duration">المدة (دقائق)</Label>
                  <Input
                    id="edit-duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="30"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">الوصف</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="أدخل وصف القالب"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-exercises">التمارين</Label>
                <div className="flex gap-2">
                  <Input
                    id="edit-exercises"
                    value={exerciseInput}
                    onChange={(e) => setExerciseInput(e.target.value)}
                    placeholder="أدخل اسم التمرين"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddExercise();
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddExercise}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.exercises.map((exercise, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {exercise}
                      <XCircle
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => handleRemoveExercise(index)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-instructions">التعليمات</Label>
                <Textarea
                  id="edit-instructions"
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  placeholder="أدخل تعليمات القالب"
                  rows={4}
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

        {/* Dialog حذف قالب */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>تأكيد الحذف</DialogTitle>
              <DialogDescription>
                هل أنت متأكد من حذف قالب {selectedTemplate?.name}؟ هذا الإجراء لا يمكن التراجع عنه.
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

export default WorkoutTemplates;

