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
  FileText, Plus, Search, Edit, Trash2, BarChart, Save,
  Users, CheckCircle, Calendar
} from "lucide-react";

const Surveys = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [surveys, setSurveys] = useState([
    {
      id: 1,
      title: "استبيان رضا العملاء",
      type: "رضا",
      responses: 245,
      status: "نشط",
      createdDate: "2024-01-01",
      endDate: "2024-02-01"
    },
    {
      id: 2,
      title: "استبيان الخدمات",
      type: "خدمات",
      responses: 180,
      status: "نشط",
      createdDate: "2024-01-15",
      endDate: "2024-02-15"
    },
    {
      id: 3,
      title: "استبيان المدربين",
      type: "تقييم",
      responses: 320,
      status: "منتهي",
      createdDate: "2023-12-01",
      endDate: "2024-01-01"
    }
  ]);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    startDate: "",
    endDate: "",
    description: ""
  });
  const { toast } = useToast();

  const handleAdd = () => {
    setFormData({
      title: "",
      type: "",
      startDate: "",
      endDate: "",
      description: ""
    });
    setIsAddDialogOpen(true);
  };

  const handleEdit = (survey: any) => {
    setSelectedSurvey(survey);
    setFormData({
      title: survey.title,
      type: survey.type,
      startDate: survey.createdDate,
      endDate: survey.endDate,
      description: survey.description || ""
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (survey: any) => {
    setSelectedSurvey(survey);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveAdd = () => {
    if (!formData.title || !formData.type || !formData.endDate) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    const newSurvey = {
      id: surveys.length + 1,
      title: formData.title,
      type: formData.type,
      responses: 0,
      status: "نشط",
      createdDate: formData.startDate || new Date().toISOString().split('T')[0],
      endDate: formData.endDate
    };
    
    setSurveys([...surveys, newSurvey]);
    setIsAddDialogOpen(false);
    toast({
      title: "نجح",
      description: "تم إضافة الاستبيان بنجاح"
    });
  };

  const handleSaveEdit = () => {
    if (!formData.title || !formData.type || !formData.endDate) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    setSurveys(surveys.map(s => 
      s.id === selectedSurvey.id 
        ? { ...s, title: formData.title, type: formData.type, endDate: formData.endDate }
        : s
    ));
    
    setIsEditDialogOpen(false);
    setSelectedSurvey(null);
    toast({
      title: "نجح",
      description: "تم تحديث الاستبيان بنجاح"
    });
  };

  const handleConfirmDelete = () => {
    setSurveys(surveys.filter(s => s.id !== selectedSurvey.id));
    setIsDeleteDialogOpen(false);
    setSelectedSurvey(null);
    toast({
      title: "نجح",
      description: "تم حذف الاستبيان بنجاح"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* العنوان */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">الاستبيانات</h1>
            <p className="text-gray-600 mt-1">إدارة الاستبيانات والاستطلاعات</p>
          </div>
          <div className="flex gap-3">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="البحث عن استبيان..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleAdd}>
              <Plus className="w-5 h-5 ml-2" />
              استبيان جديد
            </Button>
          </div>
        </div>

        {/* إحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">إجمالي الاستبيانات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">24</div>
              <p className="text-sm text-gray-500 mt-1">استبيان منشور</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">الاستبيانات النشطة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">8</div>
              <p className="text-sm text-gray-500 mt-1">استبيان نشط</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">إجمالي الردود</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">1,245</div>
              <p className="text-sm text-gray-500 mt-1">رد تم استلامه</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">معدل الاستجابة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">68%</div>
              <p className="text-sm text-gray-500 mt-1">متوسط الاستجابة</p>
            </CardContent>
          </Card>
        </div>

        {/* قائمة الاستبيانات */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              قائمة الاستبيانات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-right py-3 px-4 font-semibold">العنوان</th>
                    <th className="text-right py-3 px-4 font-semibold">النوع</th>
                    <th className="text-right py-3 px-4 font-semibold">الردود</th>
                    <th className="text-right py-3 px-4 font-semibold">الحالة</th>
                    <th className="text-right py-3 px-4 font-semibold">تاريخ الإنشاء</th>
                    <th className="text-right py-3 px-4 font-semibold">تاريخ الانتهاء</th>
                    <th className="text-right py-3 px-4 font-semibold">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {surveys.map((survey) => (
                    <tr key={survey.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-semibold">{survey.title}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{survey.type}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-gray-500" />
                          {survey.responses}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={survey.status === "نشط" ? "bg-green-500" : "bg-gray-500"}>
                          {survey.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">{survey.createdDate}</td>
                      <td className="py-3 px-4">{survey.endDate}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2 justify-end">
                          <Button variant="ghost" size="sm" title="التقارير">
                            <BarChart className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(survey)} title="تعديل">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(survey)} title="حذف">
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

        {/* قوالب الاستبيانات */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                استبيان رضا العملاء
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">استبيان لقياس رضا العملاء</p>
              <Button variant="outline" className="w-full">
                استخدام القالب
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="w-5 h-5 text-blue-600" />
                استبيان الخدمات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">استبيان لتقييم الخدمات</p>
              <Button variant="outline" className="w-full">
                استخدام القالب
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                استبيان المدربين
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">استبيان لتقييم المدربين</p>
              <Button variant="outline" className="w-full">
                استخدام القالب
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Dialog إضافة استبيان جديد */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>إضافة استبيان جديد</DialogTitle>
              <DialogDescription>أدخل بيانات الاستبيان</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">عنوان الاستبيان *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="عنوان الاستبيان"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">النوع *</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر النوع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="رضا">رضا</SelectItem>
                      <SelectItem value="خدمات">خدمات</SelectItem>
                      <SelectItem value="تقييم">تقييم</SelectItem>
                      <SelectItem value="عام">عام</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">تاريخ البدء</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">تاريخ الانتهاء *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">الوصف</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="وصف الاستبيان"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>إلغاء</Button>
              <Button onClick={handleSaveAdd} className="bg-purple-600 hover:bg-purple-700">
                <Save className="w-4 h-4 ml-2" /> حفظ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog تعديل استبيان */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>تعديل الاستبيان</DialogTitle>
              <DialogDescription>قم بتعديل بيانات الاستبيان</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">عنوان الاستبيان *</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="عنوان الاستبيان"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-type">النوع *</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر النوع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="رضا">رضا</SelectItem>
                      <SelectItem value="خدمات">خدمات</SelectItem>
                      <SelectItem value="تقييم">تقييم</SelectItem>
                      <SelectItem value="عام">عام</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-startDate">تاريخ البدء</Label>
                  <Input
                    id="edit-startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-endDate">تاريخ الانتهاء *</Label>
                <Input
                  id="edit-endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">الوصف</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="وصف الاستبيان"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>إلغاء</Button>
              <Button onClick={handleSaveEdit} className="bg-purple-600 hover:bg-purple-700">
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
                هل أنت متأكد من حذف الاستبيان "{selectedSurvey?.title}"؟ هذا الإجراء لا يمكن التراجع عنه.
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

export default Surveys;

