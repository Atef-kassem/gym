import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Gift, Search, Filter, DollarSign, Heart, Shield, Home,
  Plus, Edit, Trash2, Calendar, CheckCircle, Download, Users
} from "lucide-react";
import { useGetAllEmployeesQuery } from "@/services/employeesApi";

const Benefits = () => {
  const [activeTab, setActiveTab] = useState("benefits");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const { data: employeesResponse } = useGetAllEmployeesQuery({});
  const employees = Array.isArray(employeesResponse?.data) ? employeesResponse.data : [];

  // استخدام localStorage
  const [benefits, setBenefits] = useState<any[]>(() => {
    const stored = localStorage.getItem('hr_benefits');
    return stored ? JSON.parse(stored) : [];
  });

  const [employeeBenefits, setEmployeeBenefits] = useState<any[]>(() => {
    const stored = localStorage.getItem('hr_employee_benefits');
    return stored ? JSON.parse(stored) : [];
  });

  const [isBenefitDialogOpen, setIsBenefitDialogOpen] = useState(false);
  const [isEmployeeBenefitDialogOpen, setIsEmployeeBenefitDialogOpen] = useState(false);
  const [selectedBenefit, setSelectedBenefit] = useState<any>(null);

  const [benefitFormData, setBenefitFormData] = useState({
    name: "",
    type: "",
    description: "",
    cost: "",
    coverage: "",
    status: "نشط"
  });

  const [employeeBenefitFormData, setEmployeeBenefitFormData] = useState({
    employeeId: "",
    benefitId: "",
    startDate: "",
    endDate: "",
    amount: "",
    status: "نشط"
  });

  const saveToStorage = (key: string, data: any[]) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const filteredBenefits = useMemo(() => {
    return benefits.filter((benefit: any) =>
      !searchQuery || benefit.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [benefits, searchQuery]);

  const filteredEmployeeBenefits = useMemo(() => {
    return employeeBenefits.filter((eb: any) => {
      const employee = employees.find((e: any) => e.id === parseInt(eb.employeeId));
      return !searchQuery || employee?.arabicName?.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [employeeBenefits, employees, searchQuery]);

  const handleAddBenefit = () => {
    setBenefitFormData({
      name: "",
      type: "",
      description: "",
      cost: "",
      coverage: "",
      status: "نشط"
    });
    setSelectedBenefit(null);
    setIsBenefitDialogOpen(true);
  };

  const handleSaveBenefit = () => {
    if (!benefitFormData.name || !benefitFormData.type) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    if (selectedBenefit) {
      const updated = benefits.map((b: any) =>
        b.id === selectedBenefit.id ? { ...b, ...benefitFormData, updatedAt: new Date().toISOString() } : b
      );
      setBenefits(updated);
      saveToStorage('hr_benefits', updated);
      toast({ title: "نجح", description: "تم تحديث الميزة بنجاح" });
    } else {
      const newBenefit = {
        id: Date.now(),
        ...benefitFormData,
        createdAt: new Date().toISOString()
      };
      const updated = [...benefits, newBenefit];
      setBenefits(updated);
      saveToStorage('hr_benefits', updated);
      toast({ title: "نجح", description: "تم إضافة الميزة بنجاح" });
    }
    setIsBenefitDialogOpen(false);
  };

  const handleAddEmployeeBenefit = () => {
    setEmployeeBenefitFormData({
      employeeId: "",
      benefitId: "",
      startDate: "",
      endDate: "",
      amount: "",
      status: "نشط"
    });
    setIsEmployeeBenefitDialogOpen(true);
  };

  const handleSaveEmployeeBenefit = () => {
    if (!employeeBenefitFormData.employeeId || !employeeBenefitFormData.benefitId) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    const newEmployeeBenefit = {
      id: Date.now(),
      ...employeeBenefitFormData,
      createdAt: new Date().toISOString()
    };
    const updated = [...employeeBenefits, newEmployeeBenefit];
    setEmployeeBenefits(updated);
    saveToStorage('hr_employee_benefits', updated);
    setIsEmployeeBenefitDialogOpen(false);
    toast({ title: "نجح", description: "تم إضافة الميزة للموظف بنجاح" });
  };

  const stats = useMemo(() => {
    return {
      totalBenefits: benefits.length,
      activeBenefits: benefits.filter((b: any) => b.status === "نشط").length,
      totalEmployeeBenefits: employeeBenefits.length,
      totalCost: employeeBenefits.reduce((sum: number, eb: any) => sum + parseFloat(eb.amount || 0), 0)
    };
  }, [benefits, employeeBenefits]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Gift className="w-8 h-8 text-pink-600" />
              إدارة المزايا
            </h1>
            <p className="text-gray-600 mt-1">إدارة مزايا الموظفين والبدلات</p>
          </div>
          <div className="flex gap-3">
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
          </div>
        </div>

        {/* الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-pink-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>إجمالي المزايا</span>
                <Gift className="w-5 h-5 text-pink-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-pink-600">{stats.totalBenefits}</div>
              <p className="text-sm text-gray-500 mt-1">{stats.activeBenefits} نشطة</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>مزايا الموظفين</span>
                <Users className="w-5 h-5 text-blue-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.totalEmployeeBenefits}</div>
              <p className="text-sm text-gray-500 mt-1">ميزة مفعلة</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>إجمالي التكلفة</span>
                <DollarSign className="w-5 h-5 text-green-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.totalCost.toLocaleString()}</div>
              <p className="text-sm text-gray-500 mt-1">ج.م شهرياً</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>التأمين الصحي</span>
                <Heart className="w-5 h-5 text-purple-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {employeeBenefits.filter((eb: any) => {
                  const benefit = benefits.find((b: any) => b.id === parseInt(eb.benefitId));
                  return benefit?.type === "تأمين صحي";
                }).length}
              </div>
              <p className="text-sm text-gray-500 mt-1">موظف مؤمن</p>
            </CardContent>
          </Card>
        </div>

        {/* التبويبات */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="benefits">المزايا</TabsTrigger>
            <TabsTrigger value="employee-benefits">مزايا الموظفين</TabsTrigger>
          </TabsList>

          {/* تبويب المزايا */}
          <TabsContent value="benefits" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>المزايا المتاحة</CardTitle>
                <Button onClick={handleAddBenefit} className="bg-pink-600 hover:bg-pink-700">
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة ميزة
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredBenefits.map((benefit: any) => (
                    <Card key={benefit.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {benefit.type === "تأمين صحي" && <Heart className="w-5 h-5 text-red-500" />}
                              {benefit.type === "بدل سكن" && <Home className="w-5 h-5 text-blue-500" />}
                              {benefit.type === "بدل مواصلات" && <DollarSign className="w-5 h-5 text-green-500" />}
                              {benefit.type === "تأمين" && <Shield className="w-5 h-5 text-purple-500" />}
                              <h3 className="text-lg font-semibold">{benefit.name}</h3>
                            </div>
                            <Badge className={benefit.status === "نشط" ? "bg-green-500" : "bg-gray-500"}>
                              {benefit.status}
                            </Badge>
                            <p className="text-sm text-gray-600 mt-2">{benefit.description}</p>
                            <div className="mt-3 space-y-1 text-sm">
                              {benefit.cost && (
                                <div className="flex items-center gap-2">
                                  <DollarSign className="w-4 h-4" />
                                  <span>التكلفة: {benefit.cost} ج.م</span>
                                </div>
                              )}
                              {benefit.coverage && (
                                <div className="flex items-center gap-2">
                                  <Shield className="w-4 h-4" />
                                  <span>التغطية: {benefit.coverage}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => {
                              setSelectedBenefit(benefit);
                              setBenefitFormData(benefit);
                              setIsBenefitDialogOpen(true);
                            }}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => {
                              const updated = benefits.filter((b: any) => b.id !== benefit.id);
                              setBenefits(updated);
                              saveToStorage('hr_benefits', updated);
                              toast({ title: "نجح", description: "تم حذف الميزة" });
                            }}>
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {filteredBenefits.length === 0 && (
                    <div className="col-span-3 text-center py-12 text-gray-500">
                      <Gift className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg">لا توجد مزايا</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* تبويب مزايا الموظفين */}
          <TabsContent value="employee-benefits" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>مزايا الموظفين</CardTitle>
                <Button onClick={handleAddEmployeeBenefit} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة ميزة لموظف
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-right py-3 px-4 font-semibold">الموظف</th>
                        <th className="text-right py-3 px-4 font-semibold">الميزة</th>
                        <th className="text-right py-3 px-4 font-semibold">من تاريخ</th>
                        <th className="text-right py-3 px-4 font-semibold">إلى تاريخ</th>
                        <th className="text-right py-3 px-4 font-semibold">المبلغ</th>
                        <th className="text-right py-3 px-4 font-semibold">الحالة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEmployeeBenefits.map((eb: any) => {
                        const employee = employees.find((e: any) => e.id === parseInt(eb.employeeId));
                        const benefit = benefits.find((b: any) => b.id === parseInt(eb.benefitId));
                        return (
                          <tr key={eb.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4 font-semibold">{employee?.arabicName || employee?.name || "-"}</td>
                            <td className="py-3 px-4">{benefit?.name || "-"}</td>
                            <td className="py-3 px-4">{eb.startDate}</td>
                            <td className="py-3 px-4">{eb.endDate || "مستمر"}</td>
                            <td className="py-3 px-4">{eb.amount} ج.م</td>
                            <td className="py-3 px-4">
                              <Badge className={eb.status === "نشط" ? "bg-green-500" : "bg-gray-500"}>
                                {eb.status}
                              </Badge>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {filteredEmployeeBenefits.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg">لا توجد مزايا للموظفين</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dialogs */}
        <Dialog open={isBenefitDialogOpen} onOpenChange={setIsBenefitDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedBenefit ? "تعديل الميزة" : "إضافة ميزة جديدة"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>اسم الميزة *</Label>
                  <Input value={benefitFormData.name} onChange={(e) => setBenefitFormData({...benefitFormData, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>نوع الميزة *</Label>
                  <Select value={benefitFormData.type} onValueChange={(value) => setBenefitFormData({...benefitFormData, type: value})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="تأمين صحي">تأمين صحي</SelectItem>
                      <SelectItem value="بدل سكن">بدل سكن</SelectItem>
                      <SelectItem value="بدل مواصلات">بدل مواصلات</SelectItem>
                      <SelectItem value="تأمين">تأمين</SelectItem>
                      <SelectItem value="مكافأة">مكافأة</SelectItem>
                      <SelectItem value="أخرى">أخرى</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>الوصف</Label>
                <Textarea value={benefitFormData.description} onChange={(e) => setBenefitFormData({...benefitFormData, description: e.target.value})} rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>التكلفة</Label>
                  <Input type="number" value={benefitFormData.cost} onChange={(e) => setBenefitFormData({...benefitFormData, cost: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>التغطية</Label>
                  <Input value={benefitFormData.coverage} onChange={(e) => setBenefitFormData({...benefitFormData, coverage: e.target.value})} />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsBenefitDialogOpen(false)}>إلغاء</Button>
              <Button onClick={handleSaveBenefit} className="bg-pink-600 hover:bg-pink-700">حفظ</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEmployeeBenefitDialogOpen} onOpenChange={setIsEmployeeBenefitDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>إضافة ميزة لموظف</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>الموظف *</Label>
                  <Select value={employeeBenefitFormData.employeeId} onValueChange={(value) => setEmployeeBenefitFormData({...employeeBenefitFormData, employeeId: value})}>
                    <SelectTrigger><SelectValue placeholder="اختر الموظف" /></SelectTrigger>
                    <SelectContent>
                      {employees.map((e: any) => (
                        <SelectItem key={e.id} value={e.id.toString()}>{e.arabicName || e.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>الميزة *</Label>
                  <Select value={employeeBenefitFormData.benefitId} onValueChange={(value) => setEmployeeBenefitFormData({...employeeBenefitFormData, benefitId: value})}>
                    <SelectTrigger><SelectValue placeholder="اختر الميزة" /></SelectTrigger>
                    <SelectContent>
                      {benefits.filter((b: any) => b.status === "نشط").map((b: any) => (
                        <SelectItem key={b.id} value={b.id.toString()}>{b.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>من تاريخ</Label>
                  <Input type="date" value={employeeBenefitFormData.startDate} onChange={(e) => setEmployeeBenefitFormData({...employeeBenefitFormData, startDate: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>إلى تاريخ</Label>
                  <Input type="date" value={employeeBenefitFormData.endDate} onChange={(e) => setEmployeeBenefitFormData({...employeeBenefitFormData, endDate: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>المبلغ</Label>
                <Input type="number" value={employeeBenefitFormData.amount} onChange={(e) => setEmployeeBenefitFormData({...employeeBenefitFormData, amount: e.target.value})} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEmployeeBenefitDialogOpen(false)}>إلغاء</Button>
              <Button onClick={handleSaveEmployeeBenefit} className="bg-blue-600 hover:bg-blue-700">حفظ</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Benefits;

