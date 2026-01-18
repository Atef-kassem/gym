import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Shield, Calculator, Users, Save, TrendingUp, Plus, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const SocialInsuranceSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();


  // حدود الراتب الخاضع للتأمينات
  const [salaryLimits, setSalaryLimits] = useState({
    minimumSalary: 400,
    maximumSalary: 45000,
    minimumContribution: 49,
    maximumContribution: 5512.5
  });

  // إعدادات التأمين الطبي
  const [medicalInsurance, setMedicalInsurance] = useState({
    enabled: true,
    employeeRate: 0,
    employerRate: 4,
    minimumSalary: 500,
    maximumSalary: 4000
  });

  // إعدادات صندوق التنمية العقارية
  const [housingFund, setHousingFund] = useState({
    enabled: true,
    employeeRate: 0,
    employerRate: 1,
    applicableToSaudiOnly: true
  });

  // الزيادة التدريجية لنسب اشتراك المصريين
  const gradualIncreaseSchedule = [
    {
      date: "3 يوليو 2024",
      year: "2024",
      employeeRate: 9,
      employerRate: 9,
      increaseRate: "لا توجد زيادة",
      status: "مطبق"
    },
    {
      date: "1 يوليو 2025", 
      year: "2025",
      employeeRate: 9.5,
      employerRate: 9.5,
      increaseRate: "0.5%",
      status: "مجدول"
    },
    {
      date: "1 يوليو 2026",
      year: "2026", 
      employeeRate: 10,
      employerRate: 10,
      increaseRate: "0.5%",
      status: "مجدول"
    },
    {
      date: "1 يوليو 2027",
      year: "2027",
      employeeRate: 10.5,
      employerRate: 10.5,
      increaseRate: "0.5%",
      status: "مجدول"
    },
    {
      date: "1 يوليو 2028",
      year: "2028",
      employeeRate: 11,
      employerRate: 11,
      increaseRate: "0.5%",
      status: "مجدول"
    }
  ];

  // فئات الموظفين المختلفة
  const [employeeCategories, setEmployeeCategories] = useState([
    {
      id: 1,
      name: "الموظفين المصريين - عادي",
      nationality: "saudi",
      employee: {
        occupationalHazards: 0,
        unemployment: 1,
        pensions: 11.25,
        total: 12.25
      },
      employer: {
        occupationalHazards: 2,
        unemployment: 1,
        pensions: 11.25,
        total: 14.25
      }
    },
    {
      id: 2,
      name: "الموظفين المصريين - تدرج جديد",
      nationality: "saudi",
      employee: {
        occupationalHazards: 0,
        unemployment: 1,
        pensions: 9, // نسبة التدرج الجديد
        total: 10
      },
      employer: {
        occupationalHazards: 2,
        unemployment: 1,
        pensions: 9, // نسبة التدرج الجديد
        total: 12
      }
    },
    {
      id: 3,
      name: "الموظفين غير المصريين",
      nationality: "non-saudi",
      employee: {
        occupationalHazards: 0,
        unemployment: 0,
        pensions: 0,
        total: 0
      },
      employer: {
        occupationalHazards: 2,
        unemployment: 0,
        pensions: 0,
        total: 2
      }
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState(employeeCategories[0]);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isScheduled, setIsScheduled] = useState(false);
  const [isScheduledEdit, setIsScheduledEdit] = useState(false);

  const handleSaveSettings = () => {
    toast({
      title: "تم الحفظ بنجاح",
      description: "تم حفظ إعدادات التأمينات الاجتماعية بنجاح"
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6" dir="rtl">
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
            <h1 className="text-3xl font-bold">إعدادات التأمينات الاجتماعية</h1>
            <p className="text-muted-foreground mt-2">
              إعدادات التأمينات الاجتماعية وفقاً لنظام العمل المصري
            </p>
          </div>
        </div>
        <Button onClick={handleSaveSettings}>
          <Save className="ml-2 h-4 w-4" />
          حفظ الإعدادات
        </Button>
      </div>

      <Tabs defaultValue="employee-categories" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="employee-categories">فئات الموظفين</TabsTrigger>
          <TabsTrigger value="gradual-increase">الزيادة التدريجية</TabsTrigger>
          <TabsTrigger value="salary-limits">حدود الراتب</TabsTrigger>
          <TabsTrigger value="medical-insurance">التأمين الطبي</TabsTrigger>
        </TabsList>


        {/* فئات الموظفين */}
        <TabsContent value="employee-categories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  فئات الموظفين ونسب الاشتراك
                </div>
                <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="ml-2 h-4 w-4" />
                      إضافة فئة جديدة
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>إضافة فئة موظفين جديدة</DialogTitle>
                      <DialogDescription>
                        إنشاء فئة جديدة من الموظفين بنسب اشتراك مخصصة
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>اسم الفئة</Label>
                        <Input placeholder="مثال: موظفين مؤقتين" />
                      </div>
                      <div>
                        <Label>الجنسية</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر الجنسية" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="saudi">مصري</SelectItem>
                            <SelectItem value="non-saudi">غير مصري</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    {/* خيار المجدول */}
                    <div className="space-y-4 mt-4">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Switch 
                          id="scheduled" 
                          checked={isScheduled}
                          onCheckedChange={setIsScheduled}
                        />
                        <Label htmlFor="scheduled">مجدول</Label>
                      </div>
                      
                      {isScheduled && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <div>
                            <Label>تاريخ البداية</Label>
                            <Input type="date" />
                          </div>
                          <div>
                            <Label>تاريخ النهاية</Label>
                            <Input type="date" />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                      <div className="space-y-3">
                        <h4 className="font-semibold">نسبة الموظف</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label>أخطار مهنية (%)</Label>
                            <Input type="number" className="w-20" defaultValue="0" />
                          </div>
                          <div className="flex justify-between">
                            <Label>التعطل (ساند) (%)</Label>
                            <Input type="number" className="w-20" defaultValue="1" />
                          </div>
                          <div className="flex justify-between">
                            <Label>المعاشات (%)</Label>
                            <Input type="number" className="w-20" defaultValue="11.25" />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-semibold">نسبة صاحب العمل</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label>أخطار مهنية (%)</Label>
                            <Input type="number" className="w-20" defaultValue="2" />
                          </div>
                          <div className="flex justify-between">
                            <Label>التعطل (ساند) (%)</Label>
                            <Input type="number" className="w-20" defaultValue="1" />
                          </div>
                          <div className="flex justify-between">
                            <Label>المعاشات (%)</Label>
                            <Input type="number" className="w-20" defaultValue="11.25" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-6">
                      <Button className="flex-1" onClick={() => setIsAddCategoryOpen(false)}>
                        حفظ الفئة
                      </Button>
                      <Button variant="outline" className="flex-1" onClick={() => setIsAddCategoryOpen(false)}>
                        إلغاء
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardTitle>
              <CardDescription>
                إدارة فئات الموظفين المختلفة ونسب اشتراكاتهم في التأمينات الاجتماعية
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {employeeCategories.map((category) => (
                  <Card key={category.id} className="border-2 hover:border-primary/50 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{category.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {category.nationality === "saudi" ? "موظف مصري" : "موظف غير مصري"}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => {
                            setEditingCategory(category);
                            setIsEditCategoryOpen(true);
                          }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* نسبة الموظف */}
                        <div className="space-y-3">
                          <h4 className="font-semibold text-center bg-blue-50 p-2 rounded">نسبة الموظف</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                              <span className="text-sm">أخطار مهنية (%)</span>
                              <span className="font-semibold">{category.employee.occupationalHazards}%</span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                              <span className="text-sm">التعطل عن العمل (ساند) (%)</span>
                              <span className="font-semibold">{category.employee.unemployment}%</span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                              <span className="text-sm">المعاشات (%)</span>
                              <span className="font-semibold">{category.employee.pensions}%</span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-blue-100 rounded border-2 border-blue-200">
                              <span className="font-semibold">الإجمالي (%)</span>
                              <span className="font-bold text-blue-600">{category.employee.total}%</span>
                            </div>
                          </div>
                        </div>

                        {/* نسبة صاحب العمل */}
                        <div className="space-y-3">
                          <h4 className="font-semibold text-center bg-green-50 p-2 rounded">نسبة صاحب العمل</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                              <span className="text-sm">أخطار مهنية (%)</span>
                              <span className="font-semibold">{category.employer.occupationalHazards}%</span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                              <span className="text-sm">التعطل عن العمل (ساند) (%)</span>
                              <span className="font-semibold">{category.employer.unemployment}%</span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                              <span className="text-sm">المعاشات (%)</span>
                              <span className="font-semibold">{category.employer.pensions}%</span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-green-100 rounded border-2 border-green-200">
                              <span className="font-semibold">الإجمالي (%)</span>
                              <span className="font-bold text-green-600">{category.employer.total}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* حوار تعديل الفئة */}
          <Dialog open={isEditCategoryOpen} onOpenChange={setIsEditCategoryOpen}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>تعديل فئة الموظفين</DialogTitle>
                <DialogDescription>
                  تعديل نسب اشتراك الفئة المحددة
                </DialogDescription>
              </DialogHeader>
              {editingCategory && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label>اسم الفئة</Label>
                      <Input defaultValue={editingCategory.name} />
                    </div>
                    <div>
                      <Label>الجنسية</Label>
                      <Select defaultValue={editingCategory.nationality}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="saudi">مصري</SelectItem>
                          <SelectItem value="non-saudi">غير مصري</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {/* خيار المجدول في التعديل */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Switch 
                        id="scheduled-edit" 
                        checked={isScheduledEdit}
                        onCheckedChange={setIsScheduledEdit}
                      />
                      <Label htmlFor="scheduled-edit">مجدول</Label>
                    </div>
                    
                    {isScheduledEdit && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div>
                          <Label>تاريخ البداية</Label>
                          <Input type="date" />
                        </div>
                        <div>
                          <Label>تاريخ النهاية</Label>
                          <Input type="date" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold">نسبة الموظف</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label>أخطار مهنية (%)</Label>
                          <Input type="number" className="w-20" defaultValue={editingCategory.employee.occupationalHazards} />
                        </div>
                        <div className="flex justify-between">
                          <Label>التعطل (ساند) (%)</Label>
                          <Input type="number" className="w-20" defaultValue={editingCategory.employee.unemployment} />
                        </div>
                        <div className="flex justify-between">
                          <Label>المعاشات (%)</Label>
                          <Input type="number" className="w-20" defaultValue={editingCategory.employee.pensions} />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold">نسبة صاحب العمل</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label>أخطار مهنية (%)</Label>
                          <Input type="number" className="w-20" defaultValue={editingCategory.employer.occupationalHazards} />
                        </div>
                        <div className="flex justify-between">
                          <Label>التعطل (ساند) (%)</Label>
                          <Input type="number" className="w-20" defaultValue={editingCategory.employer.unemployment} />
                        </div>
                        <div className="flex justify-between">
                          <Label>المعاشات (%)</Label>
                          <Input type="number" className="w-20" defaultValue={editingCategory.employer.pensions} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1" onClick={() => setIsEditCategoryOpen(false)}>
                      حفظ التغييرات
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={() => setIsEditCategoryOpen(false)}>
                      إلغاء
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* الزيادة التدريجية */}
        <TabsContent value="gradual-increase" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                آلية تطبيق الزيادة التدريجية في نسب الاشتراكات
              </CardTitle>
              <CardDescription>
                تطبق الزيادة التدريجية على المشمولين بنظام التأمينات الاجتماعية الجديد 1445هـ ممن ليس لديهم مدد اشتراك قبل تاريخ سريان النظام، وذلك في فرع المعاشات فقط.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold mb-2">ملاحظة مهمة:</h4>
                <p className="text-sm text-blue-800">
                  تبدأ الزيادة التدريجية من السنة الثانية لتاريخ سريان النظام وحى السنة الخامسة بنسبة 0.5% لكل سنة وزيادة إجمالية 2% لتصل إلى 11% بدلاً من 9% لكل من المشترك وصاحب العمل.
                </p>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">التاريخ</TableHead>
                    <TableHead className="text-center">نسبة الزيادة</TableHead>
                    <TableHead className="text-center">نسبة الاشتراك للمؤسسة</TableHead>
                    <TableHead className="text-center">نسبة الاشتراك للمشترك</TableHead>
                    <TableHead className="text-center">الحالة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gradualIncreaseSchedule.map((item, index) => (
                    <TableRow key={index} className={item.status === "مطبق" ? "bg-green-50" : ""}>
                      <TableCell className="text-center font-medium text-green-600">
                        {item.date}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={item.increaseRate === "لا توجد زيادة" ? "secondary" : "default"}>
                          {item.increaseRate}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center font-semibold">
                        {item.employerRate}%
                      </TableCell>
                      <TableCell className="text-center font-semibold">
                        {item.employeeRate}%
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={item.status === "مطبق" ? "default" : "outline"}>
                          {item.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">2024</div>
                      <div className="text-sm text-blue-800">السنة الأولى</div>
                      <div className="text-lg font-semibold mt-2">9% + 9%</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">2025-2027</div>
                      <div className="text-sm text-green-800">زيادة تدريجية</div>
                      <div className="text-lg font-semibold mt-2">+0.5% سنوياً</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-purple-50 border-purple-200">
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">2028</div>
                      <div className="text-sm text-purple-800">النسبة النهائية</div>
                      <div className="text-lg font-semibold mt-2">11% + 11%</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <h4 className="font-semibold mb-2 text-amber-800">يجب على صاحب العمل:</h4>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• مراجعة وتهيئة الأنظمة الداخلية للمنشأة لتطبيق نسب الزيادة التدريجية</li>
                  <li>• تطبيق النسب الجديدة وفق ما نص عليه النظام</li>
                  <li>• التأكد من تطبيق النسب الصحيحة في التواريخ المحددة</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="salary-limits" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                حدود الراتب الخاضع للتأمينات
              </CardTitle>
              <CardDescription>
                الحد الأدنى والأقصى للراتب الخاضع لاشتراكات التأمينات الاجتماعية
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="min-salary">الحد الأدنى للراتب (جنيه)</Label>
                    <Input 
                      id="min-salary"
                      type="number" 
                      value={salaryLimits.minimumSalary}
                      onChange={(e) => setSalaryLimits(prev => ({ ...prev, minimumSalary: Number(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="max-salary">الحد الأقصى للراتب (جنيه)</Label>
                    <Input 
                      id="max-salary"
                      type="number" 
                      value={salaryLimits.maximumSalary}
                      onChange={(e) => setSalaryLimits(prev => ({ ...prev, maximumSalary: Number(e.target.value) }))}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="min-contribution">الحد الأدنى للاشتراك (جنيه)</Label>
                    <Input 
                      id="min-contribution"
                      type="number" 
                      value={salaryLimits.minimumContribution}
                      onChange={(e) => setSalaryLimits(prev => ({ ...prev, minimumContribution: Number(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="max-contribution">الحد الأقصى للاشتراك (جنيه)</Label>
                    <Input 
                      id="max-contribution"
                      type="number" 
                      value={salaryLimits.maximumContribution}
                      onChange={(e) => setSalaryLimits(prev => ({ ...prev, maximumContribution: Number(e.target.value) }))}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* التأمين الطبي */}
        <TabsContent value="medical-insurance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                إعدادات التأمين الطبي
              </CardTitle>
              <CardDescription>
                إعدادات التأمين الطبي للموظفين وفقاً لنظام التأمين الصحي
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">تفعيل التأمين الطبي</Label>
                    <p className="text-sm text-muted-foreground">تطبيق التأمين الطبي على جميع الموظفين</p>
                  </div>
                  <Switch 
                    checked={medicalInsurance.enabled}
                    onCheckedChange={(checked) => setMedicalInsurance(prev => ({ ...prev, enabled: checked }))}
                  />
                </div>

                {medicalInsurance.enabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="employee-medical-rate">نسبة الموظف (%)</Label>
                        <Input 
                          id="employee-medical-rate"
                          type="number" 
                          value={medicalInsurance.employeeRate}
                          onChange={(e) => setMedicalInsurance(prev => ({ ...prev, employeeRate: Number(e.target.value) }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="employer-medical-rate">نسبة صاحب العمل (%)</Label>
                        <Input 
                          id="employer-medical-rate"
                          type="number" 
                          value={medicalInsurance.employerRate}
                          onChange={(e) => setMedicalInsurance(prev => ({ ...prev, employerRate: Number(e.target.value) }))}
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="medical-min-salary">الحد الأدنى للراتب (جنيه)</Label>
                        <Input 
                          id="medical-min-salary"
                          type="number" 
                          value={medicalInsurance.minimumSalary}
                          onChange={(e) => setMedicalInsurance(prev => ({ ...prev, minimumSalary: Number(e.target.value) }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="medical-max-salary">الحد الأقصى للراتب (جنيه)</Label>
                        <Input 
                          id="medical-max-salary"
                          type="number" 
                          value={medicalInsurance.maximumSalary}
                          onChange={(e) => setMedicalInsurance(prev => ({ ...prev, maximumSalary: Number(e.target.value) }))}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* صندوق التنمية العقارية */}
          <Card>
            <CardHeader>
              <CardTitle>صندوق التنمية العقارية</CardTitle>
              <CardDescription>
                إعدادات اشتراك صندوق التنمية العقارية
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">تفعيل صندوق التنمية العقارية</Label>
                    <p className="text-sm text-muted-foreground">تطبيق اشتراك صندوق التنمية العقارية</p>
                  </div>
                  <Switch 
                    checked={housingFund.enabled}
                    onCheckedChange={(checked) => setHousingFund(prev => ({ ...prev, enabled: checked }))}
                  />
                </div>

                {housingFund.enabled && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="housing-employee-rate">نسبة الموظف (%)</Label>
                      <Input 
                        id="housing-employee-rate"
                        type="number" 
                        value={housingFund.employeeRate}
                        onChange={(e) => setHousingFund(prev => ({ ...prev, employeeRate: Number(e.target.value) }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="housing-employer-rate">نسبة صاحب العمل (%)</Label>
                      <Input 
                        id="housing-employer-rate"
                        type="number" 
                        value={housingFund.employerRate}
                        onChange={(e) => setHousingFund(prev => ({ ...prev, employerRate: Number(e.target.value) }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">المصريين فقط</Label>
                        <p className="text-xs text-muted-foreground">تطبيق على المصريين فقط</p>
                      </div>
                      <Switch 
                        checked={housingFund.applicableToSaudiOnly}
                        onCheckedChange={(checked) => setHousingFund(prev => ({ ...prev, applicableToSaudiOnly: checked }))}
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SocialInsuranceSettings;