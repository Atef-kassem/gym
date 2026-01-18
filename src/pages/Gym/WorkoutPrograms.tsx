import { useState } from "react";
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
  Activity, Plus, Search, Edit, Trash2, Users, Save,
  Target, TrendingUp, Clock
} from "lucide-react";

const WorkoutPrograms = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [programs, setPrograms] = useState([
    {
      id: 1,
      name: "برنامج إنقاص الوزن",
      duration: "12 أسبوع",
      participants: 45,
      trainer: "أحمد محمود",
      status: "نشط",
      difficulty: "متوسط"
    },
    {
      id: 2,
      name: "برنامج بناء العضلات",
      duration: "16 أسبوع",
      participants: 32,
      trainer: "محمد علي",
      status: "نشط",
      difficulty: "متقدم"
    },
    {
      id: 3,
      name: "برنامج اللياقة العامة",
      duration: "8 أسابيع",
      participants: 28,
      trainer: "سارة أحمد",
      status: "منتهي",
      difficulty: "مبتدئ"
    }
  ]);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    duration: "",
    trainer: "",
    difficulty: "",
    description: ""
  });
  const { toast } = useToast();

  const getDifficultyBadge = (difficulty: string) => {
    const colors: Record<string, string> = {
      "مبتدئ": "bg-green-500",
      "متوسط": "bg-yellow-500",
      "متقدم": "bg-red-500"
    };
    return <Badge className={colors[difficulty] || "bg-gray-500"}>{difficulty}</Badge>;
  };

  const handleAdd = () => {
    setFormData({
      name: "",
      duration: "",
      trainer: "",
      difficulty: "",
      description: ""
    });
    setIsAddDialogOpen(true);
  };

  const handleEdit = (program: any) => {
    setSelectedProgram(program);
    setFormData({
      name: program.name,
      duration: program.duration,
      trainer: program.trainer,
      difficulty: program.difficulty,
      description: program.description || ""
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (program: any) => {
    setSelectedProgram(program);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveAdd = () => {
    if (!formData.name || !formData.duration || !formData.trainer || !formData.difficulty) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    const newProgram = {
      id: programs.length + 1,
      ...formData,
      participants: 0,
      status: "نشط"
    };
    
    setPrograms([...programs, newProgram]);
    setIsAddDialogOpen(false);
    toast({
      title: "نجح",
      description: "تم إضافة البرنامج بنجاح"
    });
  };

  const handleSaveEdit = () => {
    if (!formData.name || !formData.duration || !formData.trainer || !formData.difficulty) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    setPrograms(programs.map(p => 
      p.id === selectedProgram.id 
        ? { ...p, ...formData }
        : p
    ));
    
    setIsEditDialogOpen(false);
    setSelectedProgram(null);
    toast({
      title: "نجح",
      description: "تم تحديث البرنامج بنجاح"
    });
  };

  const handleConfirmDelete = () => {
    setPrograms(programs.filter(p => p.id !== selectedProgram.id));
    setIsDeleteDialogOpen(false);
    setSelectedProgram(null);
    toast({
      title: "نجح",
      description: "تم حذف البرنامج بنجاح"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* العنوان */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">البرامج التدريبية واللياقة</h1>
            <p className="text-gray-600 mt-1">إدارة البرامج التدريبية واللياقة البدنية</p>
          </div>
          <div className="flex gap-3">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="البحث عن برنامج..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleAdd}>
              <Plus className="w-5 h-5 ml-2" />
              برنامج جديد
            </Button>
          </div>
        </div>

        {/* إحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">إجمالي البرامج</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">24</div>
              <p className="text-sm text-gray-500 mt-1">برنامج متاح</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">البرامج النشطة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">18</div>
              <p className="text-sm text-gray-500 mt-1">برنامج نشط</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">المشاركون</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">320</div>
              <p className="text-sm text-gray-500 mt-1">عضو مشارك</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">معدل الإنجاز</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">78%</div>
              <p className="text-sm text-gray-500 mt-1">متوسط الإنجاز</p>
            </CardContent>
          </Card>
        </div>

        {/* قائمة البرامج */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              قائمة البرامج التدريبية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-right py-3 px-4 font-semibold">اسم البرنامج</th>
                    <th className="text-right py-3 px-4 font-semibold">المدة</th>
                    <th className="text-right py-3 px-4 font-semibold">المشاركون</th>
                    <th className="text-right py-3 px-4 font-semibold">المدرب</th>
                    <th className="text-right py-3 px-4 font-semibold">المستوى</th>
                    <th className="text-right py-3 px-4 font-semibold">الحالة</th>
                    <th className="text-right py-3 px-4 font-semibold">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {programs.map((program) => (
                    <tr key={program.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-semibold">{program.name}</td>
                      <td className="py-3 px-4">{program.duration}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-gray-500" />
                          {program.participants}
                        </div>
                      </td>
                      <td className="py-3 px-4">{program.trainer}</td>
                      <td className="py-3 px-4">{getDifficultyBadge(program.difficulty)}</td>
                      <td className="py-3 px-4">
                        <Badge className={program.status === "نشط" ? "bg-green-500" : "bg-gray-500"}>
                          {program.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2 justify-end">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(program)} title="تعديل">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" title="المشاركون">
                            <Users className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(program)} title="حذف">
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* قوالب سريعة */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600" />
                قوالب التمارين
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">عرض وإدارة قوالب التمارين الجاهزة</p>
              <Button variant="outline" className="mt-4 w-full">
                عرض القوالب
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                تتبع التقدم
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">متابعة تقدم الأعضاء في البرامج</p>
              <Button variant="outline" className="mt-4 w-full">
                عرض التقارير
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                التقييمات البدنية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">تقييمات اللياقة البدنية للأعضاء</p>
              <Button variant="outline" className="mt-4 w-full">
                عرض التقييمات
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Dialog إضافة برنامج جديد */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>إضافة برنامج جديد</DialogTitle>
              <DialogDescription>
                أدخل بيانات البرنامج التدريبي الجديد
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">اسم البرنامج *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="اسم البرنامج"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">المدة *</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    placeholder="مثال: 12 أسبوع"
                  />
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
                <Label htmlFor="difficulty">المستوى *</Label>
                <Select value={formData.difficulty} onValueChange={(value) => setFormData({...formData, difficulty: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المستوى" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="مبتدئ">مبتدئ</SelectItem>
                    <SelectItem value="متوسط">متوسط</SelectItem>
                    <SelectItem value="متقدم">متقدم</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">الوصف</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="وصف البرنامج"
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={handleSaveAdd} className="bg-purple-600 hover:bg-purple-700">
                <Save className="w-4 h-4 ml-2" />
                حفظ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog تعديل برنامج */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>تعديل البرنامج</DialogTitle>
              <DialogDescription>
                قم بتعديل بيانات البرنامج
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">اسم البرنامج *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="اسم البرنامج"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-duration">المدة *</Label>
                  <Input
                    id="edit-duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    placeholder="مثال: 12 أسبوع"
                  />
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
                <Label htmlFor="edit-difficulty">المستوى *</Label>
                <Select value={formData.difficulty} onValueChange={(value) => setFormData({...formData, difficulty: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المستوى" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="مبتدئ">مبتدئ</SelectItem>
                    <SelectItem value="متوسط">متوسط</SelectItem>
                    <SelectItem value="متقدم">متقدم</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">الوصف</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="وصف البرنامج"
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={handleSaveEdit} className="bg-purple-600 hover:bg-purple-700">
                <Save className="w-4 h-4 ml-2" />
                حفظ التغييرات
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
                هل أنت متأكد من حذف البرنامج "{selectedProgram?.name}"؟ هذا الإجراء لا يمكن التراجع عنه.
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

export default WorkoutPrograms;

