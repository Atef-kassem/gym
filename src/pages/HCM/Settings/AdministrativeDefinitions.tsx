import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, Edit, Trash2, Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const AdministrativeDefinitions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newItem, setNewItem] = useState({ name: "", code: "", status: "نشط" });

  // بيانات التعريفات حسب الفئة (قابلة للتعديل)
  const [definitionsData, setDefinitionsData] = useState({
    // البيانات الشخصية
    nationalities: [
      { id: 1, name: "مصري", code: "SA", status: "نشط" },
      { id: 2, name: "مصري", code: "EG", status: "نشط" },
      { id: 3, name: "أردني", code: "JO", status: "نشط" },
      { id: 4, name: "لبناني", code: "LB", status: "نشط" }
    ],
    genders: [
      { id: 1, name: "ذكر", code: "M", status: "نشط" },
      { id: 2, name: "أنثى", code: "F", status: "نشط" }
    ],
    maritalStatus: [
      { id: 1, name: "أعزب", code: "S", status: "نشط" },
      { id: 2, name: "متزوج", code: "M", status: "نشط" },
      { id: 3, name: "مطلق", code: "D", status: "نشط" },
      { id: 4, name: "أرمل", code: "W", status: "نشط" }
    ],
    regions: [
      { id: 1, name: "منطقة الرياض", code: "RY", status: "نشط" },
      { id: 2, name: "منطقة مكة المكرمة", code: "MK", status: "نشط" },
      { id: 3, name: "المنطقة الشرقية", code: "EP", status: "نشط" }
    ],
    education: [
      { id: 1, name: "ابتدائي", code: "PRIM", status: "نشط" },
      { id: 2, name: "متوسط", code: "MID", status: "نشط" },
      { id: 3, name: "ثانوي", code: "SEC", status: "نشط" },
      { id: 4, name: "بكالوريوس", code: "BAC", status: "نشط" }
    ],
    
    // التوظيف والوظائف
    employment: [
      { id: 1, name: "دوام كامل", code: "FT", status: "نشط" },
      { id: 2, name: "دوام جزئي", code: "PT", status: "نشط" },
      { id: 3, name: "مؤقت", code: "TEMP", status: "نشط" },
      { id: 4, name: "متعاقد", code: "CONT", status: "نشط" }
    ],
    jobTitles: [
      { id: 1, name: "محاسب", code: "ACC", status: "نشط" },
      { id: 2, name: "مهندس", code: "ENG", status: "نشط" },
      { id: 3, name: "مطور", code: "DEV", status: "نشط" },
      { id: 4, name: "مدير", code: "MGR", status: "نشط" }
    ],
    jobGrades: [
      { id: 1, name: "درجة أولى", code: "G1", status: "نشط" },
      { id: 2, name: "درجة ثانية", code: "G2", status: "نشط" },
      { id: 3, name: "درجة ثالثة", code: "G3", status: "نشط" }
    ],
    departments: [
      { id: 1, name: "الموارد البشرية", code: "HR", status: "نشط" },
      { id: 2, name: "المالية", code: "FIN", status: "نشط" },
      { id: 3, name: "التقنية", code: "IT", status: "نشط" },
      { id: 4, name: "المبيعات", code: "SALES", status: "نشط" }
    ],
    
    // الرواتب والمالية
    allowanceTypes: [
      { id: 1, name: "بدل نقل", code: "TRANS", status: "نشط" },
      { id: 2, name: "بدل سكن", code: "HOUSE", status: "نشط" },
      { id: 3, name: "بدل وجبات", code: "MEAL", status: "نشط" },
      { id: 4, name: "بدل هاتف", code: "PHONE", status: "نشط" }
    ],
    deductionTypes: [
      { id: 1, name: "تأمينات اجتماعية", code: "SOC", status: "نشط" },
      { id: 2, name: "ضريبة دخل", code: "TAX", status: "نشط" },
      { id: 3, name: "غياب", code: "ABS", status: "نشط" }
    ],
    paymentMethods: [
      { id: 1, name: "حوالة بنكية", code: "BANK", status: "نشط" },
      { id: 2, name: "شيك", code: "CHECK", status: "نشط" },
      { id: 3, name: "نقدي", code: "CASH", status: "نشط" }
    ],
    banks: [
      { id: 1, name: "البنك الأهلي المصري", code: "NCB", status: "نشط" },
      { id: 2, name: "بنك الراجحي", code: "RAJ", status: "نشط" },
      { id: 3, name: "بنك الرياض", code: "RIY", status: "نشط" }
    ],
    
    // الإجازات والحضور
    leaveTypes: [
      { id: 1, name: "إجازة سنوية", code: "ANNUAL", status: "نشط" },
      { id: 2, name: "إجازة مرضية", code: "SICK", status: "نشط" },
      { id: 3, name: "إجازة أمومة", code: "MATERNITY", status: "نشط" },
      { id: 4, name: "إجازة طارئة", code: "EMERGENCY", status: "نشط" }
    ],
    shiftTypes: [
      { id: 1, name: "وردية صباحية", code: "MORNING", status: "نشط" },
      { id: 2, name: "وردية مسائية", code: "EVENING", status: "نشط" },
      { id: 3, name: "وردية ليلية", code: "NIGHT", status: "نشط" }
    ],
    workLocation: [
      { id: 1, name: "المقر الرئيسي", code: "HQ", status: "نشط" },
      { id: 2, name: "فرع الرياض", code: "RYD", status: "نشط" },
      { id: 3, name: "العمل من المنزل", code: "WFH", status: "نشط" }
    ],
    
    // التدريب والتطوير
    trainingTypes: [
      { id: 1, name: "تدريب تقني", code: "TECH", status: "نشط" },
      { id: 2, name: "تدريب إداري", code: "ADMIN", status: "نشط" },
      { id: 3, name: "تدريب لغوي", code: "LANG", status: "نشط" }
    ],
    certificationTypes: [
      { id: 1, name: "شهادة مهنية", code: "PROF", status: "نشط" },
      { id: 2, name: "شهادة تقنية", code: "TECH", status: "نشط" },
      { id: 3, name: "شهادة لغة", code: "LANG", status: "نشط" }
    ],
    
    // نهاية الخدمة
    terminationReasons: [
      { id: 1, name: "استقالة", code: "RESIGN", status: "نشط" },
      { id: 2, name: "انتهاء عقد", code: "CONTRACT_END", status: "نشط" },
      { id: 3, name: "فصل", code: "TERMINATION", status: "نشط" },
      { id: 4, name: "تقاعد", code: "RETIREMENT", status: "نشط" }
    ],
    
    // الوثائق والمستندات
    documents: [
      { id: 1, name: "هوية وطنية", code: "ID", status: "نشط" },
      { id: 2, name: "جواز سفر", code: "PASS", status: "نشط" },
      { id: 3, name: "شهادة تعليمية", code: "EDU", status: "نشط" },
      { id: 4, name: "عقد عمل", code: "CONTRACT", status: "نشط" }
    ]
  });

  const categories = [
    // البيانات الشخصية
    { id: "nationalities", title: "الجنسيات", description: "جنسيات الموظفين", icon: "🌍", color: "bg-blue-500", count: definitionsData.nationalities.length },
    { id: "genders", title: "الجنس", description: "أنواع الجنس", icon: "👤", color: "bg-green-500", count: definitionsData.genders.length },
    { id: "maritalStatus", title: "الحالة الاجتماعية", description: "الحالات الاجتماعية", icon: "💑", color: "bg-pink-500", count: definitionsData.maritalStatus.length },
    { id: "regions", title: "المناطق", description: "المناطق الجغرافية", icon: "📍", color: "bg-purple-500", count: definitionsData.regions.length },
    { id: "education", title: "المستوى التعليمي", description: "مستويات التعليم", icon: "🎓", color: "bg-orange-500", count: definitionsData.education.length },
    
    // التوظيف والوظائف
    { id: "employment", title: "أنواع التوظيف", description: "أنماط العمل", icon: "💼", color: "bg-indigo-500", count: definitionsData.employment.length },
    { id: "jobTitles", title: "المسميات الوظيفية", description: "الوظائف المتاحة", icon: "🏷️", color: "bg-cyan-500", count: definitionsData.jobTitles.length },
    { id: "jobGrades", title: "الدرجات الوظيفية", description: "درجات الوظائف", icon: "🏆", color: "bg-yellow-500", count: definitionsData.jobGrades.length },
    { id: "departments", title: "الإدارات", description: "إدارات الشركة", icon: "🏢", color: "bg-red-500", count: definitionsData.departments.length },
    
    // الرواتب والمالية
    { id: "allowanceTypes", title: "أنواع البدلات", description: "بدلات الموظفين", icon: "💰", color: "bg-emerald-500", count: definitionsData.allowanceTypes.length },
    { id: "deductionTypes", title: "أنواع الخصومات", description: "خصومات الرواتب", icon: "💸", color: "bg-rose-500", count: definitionsData.deductionTypes.length },
    { id: "paymentMethods", title: "طرق الدفع", description: "طرق دفع الرواتب", icon: "💳", color: "bg-violet-500", count: definitionsData.paymentMethods.length },
    { id: "banks", title: "البنوك", description: "البنوك المعتمدة", icon: "🏦", color: "bg-teal-500", count: definitionsData.banks.length },
    
    // الإجازات والحضور
    { id: "leaveTypes", title: "أنواع الإجازات", description: "إجازات الموظفين", icon: "🏖️", color: "bg-amber-500", count: definitionsData.leaveTypes.length },
    { id: "shiftTypes", title: "أنواع الورديات", description: "ورديات العمل", icon: "⏰", color: "bg-lime-500", count: definitionsData.shiftTypes.length },
    { id: "workLocation", title: "مواقع العمل", description: "أماكن العمل", icon: "📍", color: "bg-sky-500", count: definitionsData.workLocation.length },
    
    // التدريب والتطوير
    { id: "trainingTypes", title: "أنواع التدريب", description: "برامج التدريب", icon: "📚", color: "bg-fuchsia-500", count: definitionsData.trainingTypes.length },
    { id: "certificationTypes", title: "أنواع الشهادات", description: "الشهادات المهنية", icon: "🏅", color: "bg-stone-500", count: definitionsData.certificationTypes.length },
    
    // نهاية الخدمة
    { id: "terminationReasons", title: "أسباب ترك العمل", description: "أسباب نهاية الخدمة", icon: "🚪", color: "bg-gray-500", count: definitionsData.terminationReasons.length },
    
    // الوثائق
    { id: "documents", title: "أنواع الوثائق", description: "المستندات المطلوبة", icon: "📄", color: "bg-slate-500", count: definitionsData.documents.length }
  ];

  // وظائف إدارة البيانات
  const getCurrentCategoryData = () => {
    if (!selectedCategory) return [];
    return definitionsData[selectedCategory as keyof typeof definitionsData] || [];
  };

  const getCurrentCategory = () => {
    return categories.find(cat => cat.id === selectedCategory);
  };

  const getFilteredData = () => {
    const data = getCurrentCategoryData();
    if (!searchTerm) return data;
    return data.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleAddItem = () => {
    if (!selectedCategory || !newItem.name || !newItem.code) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    const currentData = getCurrentCategoryData();
    const newId = Math.max(...currentData.map(item => item.id), 0) + 1;
    const itemToAdd = { ...newItem, id: newId };

    setDefinitionsData(prev => ({
      ...prev,
      [selectedCategory]: [...currentData, itemToAdd]
    }));

    setNewItem({ name: "", code: "", status: "نشط" });
    setIsAddDialogOpen(false);
    
    toast({
      title: "تم بنجاح",
      description: "تم إضافة العنصر الجديد بنجاح"
    });
  };

  const handleEditItem = (item: any) => {
    setEditingItem({ ...item });
    setIsEditDialogOpen(true);
  };

  const handleUpdateItem = () => {
    if (!selectedCategory || !editingItem || !editingItem.name || !editingItem.code) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    const currentData = getCurrentCategoryData();
    const updatedData = currentData.map(item => 
      item.id === editingItem.id ? editingItem : item
    );

    setDefinitionsData(prev => ({
      ...prev,
      [selectedCategory]: updatedData
    }));

    setEditingItem(null);
    setIsEditDialogOpen(false);
    
    toast({
      title: "تم بنجاح",
      description: "تم تحديث العنصر بنجاح"
    });
  };

  const handleDeleteItem = (itemId: number) => {
    if (!selectedCategory) return;

    const currentData = getCurrentCategoryData();
    const updatedData = currentData.filter(item => item.id !== itemId);

    setDefinitionsData(prev => ({
      ...prev,
      [selectedCategory]: updatedData
    }));
    
    toast({
      title: "تم بنجاح",
      description: "تم حذف العنصر بنجاح"
    });
  };

  const resetAndGoBack = () => {
    setSelectedCategory(null);
    setSearchTerm("");
    setNewItem({ name: "", code: "", status: "نشط" });
    setEditingItem(null);
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
  };

  const renderCategoryManagement = () => {
    const currentCategory = getCurrentCategory();
    const currentData = getCurrentCategoryData();

    if (!currentCategory) return null;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="icon"
              onClick={resetAndGoBack}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-lg ${currentCategory.color} text-white text-2xl`}>
                {currentCategory.icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{currentCategory.title}</h2>
                <p className="text-muted-foreground">{currentCategory.description}</p>
              </div>
            </div>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="ml-2 h-4 w-4" />
                إضافة جديد
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>إضافة {currentCategory.title}</DialogTitle>
                <DialogDescription>
                  إضافة عنصر جديد لفئة {currentCategory.title}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">الاسم</Label>
                  <Input 
                    id="name" 
                    placeholder={`اسم ${currentCategory.title}`}
                    value={newItem.name}
                    onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="code">الرمز</Label>
                  <Input 
                    id="code" 
                    placeholder="رمز التعريف"
                    value={newItem.code}
                    onChange={(e) => setNewItem(prev => ({ ...prev, code: e.target.value }))}
                  />
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1" onClick={handleAddItem}>
                    حفظ
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    إلغاء
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
          <Card>
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={`البحث في ${currentCategory.title}...`}
                  className="pr-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

        <Card>
          <CardHeader>
            <CardTitle>{currentCategory.title}</CardTitle>
            <CardDescription>
              إدارة {currentCategory.title} ({getFilteredData().length} عنصر)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الاسم</TableHead>
                  <TableHead>الرمز</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
            <TableBody>
              {getFilteredData().map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.code}</Badge>
                  </TableCell>
                    <TableCell>
                      <Badge variant={item.status === "نشط" ? "default" : "secondary"}>
                        {item.status}
                      </Badge>
                    </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditItem(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          </Card>

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>تعديل {currentCategory.title}</DialogTitle>
                <DialogDescription>
                  تعديل بيانات العنصر المحدد
                </DialogDescription>
              </DialogHeader>
              {editingItem && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edit-name">الاسم</Label>
                    <Input 
                      id="edit-name" 
                      value={editingItem.name}
                      onChange={(e) => setEditingItem(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-code">الرمز</Label>
                    <Input 
                      id="edit-code" 
                      value={editingItem.code}
                      onChange={(e) => setEditingItem(prev => ({ ...prev, code: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-status">الحالة</Label>
                    <Select 
                      value={editingItem.status} 
                      onValueChange={(value) => setEditingItem(prev => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="نشط">نشط</SelectItem>
                        <SelectItem value="معطل">معطل</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1" onClick={handleUpdateItem}>
                      حفظ التغييرات
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setIsEditDialogOpen(false)}
                    >
                      إلغاء
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Category Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{getCurrentCategoryData().length}</div>
                  <div className="text-sm text-muted-foreground">إجمالي العناصر</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {getCurrentCategoryData().filter(item => item.status === "نشط").length}
                  </div>
                  <div className="text-sm text-muted-foreground">العناصر النشطة</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-500">
                    {getCurrentCategoryData().filter(item => item.status === "معطل").length}
                  </div>
                  <div className="text-sm text-muted-foreground">العناصر المعطلة</div>
                </div>
              </CardContent>
            </Card>
          </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6" dir="rtl">
      {selectedCategory ? (
        renderCategoryManagement()
      ) : (
        <>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => navigate("/hcm/settings")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold">التعريفات الإدارية</h1>
                <p className="text-muted-foreground mt-2">
                  إدارة البيانات المرجعية والقوائم المنسدلة المستخدمة في النظام
                </p>
              </div>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {categories.map((category) => (
              <Card 
                key={category.id} 
                className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                onClick={() => setSelectedCategory(category.id)}
              >
                <CardContent className="p-3">
                  <div className="text-center space-y-2">
                    <div className={`w-12 h-12 mx-auto rounded-full ${category.color} flex items-center justify-center text-white text-lg`}>
                      {category.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm leading-tight">{category.title}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">{category.description}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {category.count}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Overall Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>إحصائيات عامة</CardTitle>
              <CardDescription>
                نظرة عامة على جميع التعريفات في النظام
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {Object.values(definitionsData).reduce((total, categoryData) => total + categoryData.length, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">إجمالي التعريفات</div>
                </div>
                <div className="text-center p-4 bg-green-100 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {categories.length}
                  </div>
                  <div className="text-sm text-muted-foreground">فئات التعريفات</div>
                </div>
                <div className="text-center p-4 bg-blue-100 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {categories.filter(cat => cat.id.includes('employment') || cat.id.includes('job')).length}
                  </div>
                  <div className="text-sm text-muted-foreground">تعريفات التوظيف</div>
                </div>
                <div className="text-center p-4 bg-purple-100 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {categories.filter(cat => cat.id.includes('allowance') || cat.id.includes('deduction') || cat.id.includes('payment')).length}
                  </div>
                  <div className="text-sm text-muted-foreground">تعريفات مالية</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default AdministrativeDefinitions;