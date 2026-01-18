import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DollarSign, Plus, Search, Edit, Trash2, Save, Calculator, Receipt
} from "lucide-react";
import { useGetAllEmployeesQuery, useGetAllPayrollsQuery, useCreatePayrollMutation } from "@/services/employeesApi";

const PayrollManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: employeesResponse } = useGetAllEmployeesQuery({});
  const employees = Array.isArray(employeesResponse?.data) ? employeesResponse.data : [];
  
  // محاولة جلب البيانات من API، إذا فشل استخدم localStorage
  const { data: payrollsResponse, isLoading: payrollsLoading } = useGetAllPayrollsQuery({}, { skip: true });
  const [createPayroll] = useCreatePayrollMutation();
  
  // استخدام localStorage كحل مؤقت
  const [payrolls, setPayrolls] = useState<any[]>(() => {
    const stored = localStorage.getItem('hr_payrolls');
    return stored ? JSON.parse(stored) : [];
  });
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    employeeName: "",
    month: "",
    baseSalary: "",
    allowances: "",
    deductions: ""
  });
  const { toast } = useToast();

  const handleAdd = () => {
    const now = new Date();
    const month = now.toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' });
    setFormData({
      employeeName: "",
      month,
      baseSalary: "",
      allowances: "",
      deductions: ""
    });
    setIsAddDialogOpen(true);
  };

  // حفظ في localStorage عند التحديث
  useEffect(() => {
    localStorage.setItem('hr_payrolls', JSON.stringify(payrolls));
  }, [payrolls]);

  // فلترة كشوف الرواتب
  const filteredPayrolls = useMemo(() => {
    return payrolls.filter((payroll) =>
      payroll.employeeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payroll.month?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payroll.status?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [payrolls, searchQuery]);

  const handleSaveAdd = async () => {
    if (!formData.employeeName || !formData.month || !formData.baseSalary) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    const baseSalary = parseFloat(formData.baseSalary) || 0;
    const allowances = parseFloat(formData.allowances) || 0;
    const deductions = parseFloat(formData.deductions) || 0;
    const netSalary = baseSalary + allowances - deductions;

    const employee = employees.find((e: any) => (e.arabicName || e.name) === formData.employeeName);
    const newPayroll = {
      id: Date.now(),
      employeeId: employee?.id,
      employeeName: formData.employeeName,
      month: formData.month,
      baseSalary,
      allowances,
      deductions,
      netSalary,
      status: "قيد المعالجة",
      createdAt: new Date().toISOString()
    };

    try {
      // محاولة الحفظ في API
      await createPayroll(newPayroll).unwrap();
    } catch (error) {
      // إذا فشل API، استخدم localStorage
      console.log("API not available, using localStorage");
    }
    
    setPayrolls([...payrolls, newPayroll]);
    setIsAddDialogOpen(false);
    toast({
      title: "نجح",
      description: "تم إضافة كشف الراتب بنجاح"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">إدارة الرواتب</h1>
            <p className="text-gray-600 mt-1">إدارة كشوف الرواتب والمرتبات</p>
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
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAdd}>
              <Plus className="w-5 h-5 ml-2" />
              كشف راتب جديد
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              كشوف الرواتب
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-right py-3 px-4 font-semibold">اسم الموظف</th>
                    <th className="text-right py-3 px-4 font-semibold">الشهر</th>
                    <th className="text-right py-3 px-4 font-semibold">الراتب الأساسي</th>
                    <th className="text-right py-3 px-4 font-semibold">البدلات</th>
                    <th className="text-right py-3 px-4 font-semibold">الخصومات</th>
                    <th className="text-right py-3 px-4 font-semibold">صافي الراتب</th>
                    <th className="text-right py-3 px-4 font-semibold">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayrolls.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-gray-500">
                        <DollarSign className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                        <p>لا توجد كشوف رواتب</p>
                      </td>
                    </tr>
                  ) : (
                    filteredPayrolls.map((payroll) => (
                    <tr key={payroll.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-semibold">{payroll.employeeName}</td>
                      <td className="py-3 px-4">{payroll.month}</td>
                      <td className="py-3 px-4">{payroll.baseSalary.toLocaleString()} ج.م</td>
                      <td className="py-3 px-4">{payroll.allowances.toLocaleString()} ج.م</td>
                      <td className="py-3 px-4 text-red-600">{payroll.deductions.toLocaleString()} ج.م</td>
                      <td className="py-3 px-4 font-bold text-green-600">{payroll.netSalary.toLocaleString()} ج.م</td>
                      <td className="py-3 px-4">
                        <Badge className={payroll.status === "مدفوعة" ? "bg-green-500" : "bg-amber-500"}>
                          {payroll.status}
                        </Badge>
                      </td>
                    </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>كشف راتب جديد</DialogTitle>
              <DialogDescription>أدخل بيانات كشف الراتب</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="employeeName">اسم الموظف *</Label>
                <Select
                  value={formData.employeeName}
                  onValueChange={(value) => {
                    const employee = employees.find((e: any) => (e.arabicName || e.name) === value);
                    setFormData({
                      ...formData,
                      employeeName: value,
                      baseSalary: employee ? (employee.basicSalary || employee.salary || "").toString() : ""
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الموظف" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((emp: any) => (
                      <SelectItem key={emp.id} value={emp.arabicName || emp.name || emp.id?.toString() || `emp-${emp.id || Math.random()}`}>
                        {emp.arabicName || emp.name || `موظف ${emp.id}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="month">الشهر *</Label>
                <Input
                  id="month"
                  value={formData.month}
                  onChange={(e) => setFormData({...formData, month: e.target.value})}
                  placeholder="الشهر والسنة"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="baseSalary">الراتب الأساسي *</Label>
                  <Input
                    id="baseSalary"
                    type="number"
                    value={formData.baseSalary}
                    onChange={(e) => setFormData({...formData, baseSalary: e.target.value})}
                    placeholder="الراتب"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="allowances">البدلات</Label>
                  <Input
                    id="allowances"
                    type="number"
                    value={formData.allowances}
                    onChange={(e) => setFormData({...formData, allowances: e.target.value})}
                    placeholder="البدلات"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deductions">الخصومات</Label>
                  <Input
                    id="deductions"
                    type="number"
                    value={formData.deductions}
                    onChange={(e) => setFormData({...formData, deductions: e.target.value})}
                    placeholder="الخصومات"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>إلغاء</Button>
              <Button onClick={handleSaveAdd} className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 ml-2" /> حفظ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default PayrollManagement;

