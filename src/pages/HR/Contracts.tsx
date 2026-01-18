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
import {
  FileText, Search, Filter, Calendar, Users, AlertTriangle,
  Plus, Edit, Trash2, Download, CheckCircle, XCircle, Clock
} from "lucide-react";
import { useGetAllEmployeesQuery } from "@/services/employeesApi";
import { format } from "date-fns";

const Contracts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const { toast } = useToast();
  const { data: employeesResponse } = useGetAllEmployeesQuery({});
  const employees = Array.isArray(employeesResponse?.data) ? employeesResponse.data : [];

  // استخدام localStorage
  const [contracts, setContracts] = useState<any[]>(() => {
    const stored = localStorage.getItem('hr_contracts');
    return stored ? JSON.parse(stored) : [];
  });

  const [isContractDialogOpen, setIsContractDialogOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<any>(null);

  const [contractFormData, setContractFormData] = useState({
    employeeId: "",
    contractType: "",
    startDate: "",
    endDate: "",
    salary: "",
    position: "",
    department: "",
    workingHours: "",
    probationPeriod: "",
    noticePeriod: "",
    terms: "",
    status: "نشط"
  });

  const saveToStorage = (key: string, data: any[]) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const filteredContracts = useMemo(() => {
    return contracts.filter((contract: any) => {
      const employee = employees.find((e: any) => e.id === parseInt(contract.employeeId));
      const matchesSearch = !searchQuery ||
        employee?.arabicName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contract.contractType?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === "all" || contract.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [contracts, employees, searchQuery, filterStatus]);

  const handleAddContract = () => {
    setContractFormData({
      employeeId: "",
      contractType: "",
      startDate: "",
      endDate: "",
      salary: "",
      position: "",
      department: "",
      workingHours: "",
      probationPeriod: "",
      noticePeriod: "",
      terms: "",
      status: "نشط"
    });
    setSelectedContract(null);
    setIsContractDialogOpen(true);
  };

  const handleSaveContract = () => {
    if (!contractFormData.employeeId || !contractFormData.startDate || !contractFormData.contractType) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    if (selectedContract) {
      const updated = contracts.map((c: any) =>
        c.id === selectedContract.id ? { ...c, ...contractFormData, updatedAt: new Date().toISOString() } : c
      );
      setContracts(updated);
      saveToStorage('hr_contracts', updated);
      toast({ title: "نجح", description: "تم تحديث العقد بنجاح" });
    } else {
      const newContract = {
        id: Date.now(),
        ...contractFormData,
        contractNumber: `CONTRACT-${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      const updated = [...contracts, newContract];
      setContracts(updated);
      saveToStorage('hr_contracts', updated);
      toast({ title: "نجح", description: "تم إضافة العقد بنجاح" });
    }
    setIsContractDialogOpen(false);
  };

  const handleRenewContract = (contract: any) => {
    setSelectedContract(contract);
    setContractFormData({
      ...contract,
      startDate: contract.endDate || new Date().toISOString().split('T')[0],
      endDate: "",
      status: "نشط"
    });
    setIsContractDialogOpen(true);
  };

  const handleTerminateContract = (contract: any) => {
    const updated = contracts.map((c: any) =>
      c.id === contract.id ? { ...c, status: "منتهي", endDate: new Date().toISOString().split('T')[0] } : c
    );
    setContracts(updated);
    saveToStorage('hr_contracts', updated);
    toast({ title: "نجح", description: "تم إنهاء العقد" });
  };

  const stats = useMemo(() => {
    const expiringSoon = contracts.filter((c: any) => {
      if (!c.endDate || c.status !== "نشط") return false;
      const endDate = new Date(c.endDate);
      const daysUntilExpiry = Math.ceil((endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry > 0 && daysUntilExpiry <= 30;
    }).length;

    return {
      totalContracts: contracts.length,
      activeContracts: contracts.filter((c: any) => c.status === "نشط").length,
      expiredContracts: contracts.filter((c: any) => c.status === "منتهي").length,
      expiringSoon
    };
  }, [contracts]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-8 h-8 text-indigo-600" />
              إدارة العقود
            </h1>
            <p className="text-gray-600 mt-1">إدارة عقود العمل والاتفاقيات</p>
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
              <Filter className="w-4 h-4" />
              فلتر
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              تصدير
            </Button>
            <Button onClick={handleAddContract} className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="w-4 h-4 ml-2" />
              إضافة عقد
            </Button>
          </div>
        </div>

        {/* الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-indigo-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>إجمالي العقود</span>
                <FileText className="w-5 h-5 text-indigo-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-indigo-600">{stats.totalContracts}</div>
              <p className="text-sm text-gray-500 mt-1">عقد إجمالي</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>العقود النشطة</span>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.activeContracts}</div>
              <p className="text-sm text-gray-500 mt-1">عقد نشط</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>العقود المنتهية</span>
                <XCircle className="w-5 h-5 text-red-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{stats.expiredContracts}</div>
              <p className="text-sm text-gray-500 mt-1">عقد منتهي</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>تنتهي قريباً</span>
                <AlertTriangle className="w-5 h-5 text-amber-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">{stats.expiringSoon}</div>
              <p className="text-sm text-gray-500 mt-1">عقد خلال 30 يوم</p>
            </CardContent>
          </Card>
        </div>

        {/* قائمة العقود */}
        <Card>
          <CardHeader>
            <CardTitle>قائمة العقود</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-right py-3 px-4 font-semibold">رقم العقد</th>
                    <th className="text-right py-3 px-4 font-semibold">الموظف</th>
                    <th className="text-right py-3 px-4 font-semibold">نوع العقد</th>
                    <th className="text-right py-3 px-4 font-semibold">من تاريخ</th>
                    <th className="text-right py-3 px-4 font-semibold">إلى تاريخ</th>
                    <th className="text-right py-3 px-4 font-semibold">الراتب</th>
                    <th className="text-right py-3 px-4 font-semibold">الحالة</th>
                    <th className="text-right py-3 px-4 font-semibold">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContracts.map((contract: any) => {
                    const employee = employees.find((e: any) => e.id === parseInt(contract.employeeId));
                    const isExpiringSoon = contract.endDate && contract.status === "نشط" && 
                      new Date(contract.endDate) <= new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000);
                    return (
                      <tr key={contract.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{contract.contractNumber}</td>
                        <td className="py-3 px-4 font-semibold">{employee?.arabicName || employee?.name || "-"}</td>
                        <td className="py-3 px-4">{contract.contractType}</td>
                        <td className="py-3 px-4">{contract.startDate}</td>
                        <td className="py-3 px-4">{contract.endDate || "غير محدد"}</td>
                        <td className="py-3 px-4">{contract.salary} ج.م</td>
                        <td className="py-3 px-4">
                          <Badge className={
                            contract.status === "نشط" ? "bg-green-500" :
                            contract.status === "منتهي" ? "bg-red-500" :
                            contract.status === "معلق" ? "bg-amber-500" : "bg-gray-500"
                          }>
                            {contract.status}
                            {isExpiringSoon && <AlertTriangle className="w-3 h-3 ml-1" />}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2 justify-end">
                            <Button variant="ghost" size="sm" onClick={() => {
                              setSelectedContract(contract);
                              setContractFormData(contract);
                              setIsContractDialogOpen(true);
                            }}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            {contract.status === "نشط" && (
                              <>
                                <Button variant="ghost" size="sm" onClick={() => handleRenewContract(contract)}>
                                  <Clock className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleTerminateContract(contract)}>
                                  <XCircle className="w-4 h-4 text-red-500" />
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filteredContracts.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg">لا توجد عقود</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Dialog إضافة/تعديل عقد */}
        <Dialog open={isContractDialogOpen} onOpenChange={setIsContractDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedContract ? "تعديل العقد" : "إضافة عقد جديد"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>الموظف *</Label>
                  <Select value={contractFormData.employeeId} onValueChange={(value) => {
                    const employee = employees.find((e: any) => e.id === parseInt(value));
                    setContractFormData({
                      ...contractFormData,
                      employeeId: value,
                      position: employee?.position?.name || employee?.Position?.name || "",
                      department: typeof employee?.department === 'string' ? employee.department : employee?.department?.name || employee?.Department?.name || ""
                    });
                  }}>
                    <SelectTrigger><SelectValue placeholder="اختر الموظف" /></SelectTrigger>
                    <SelectContent>
                      {employees.map((e: any) => (
                        <SelectItem key={e.id} value={e.id.toString()}>{e.arabicName || e.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>نوع العقد *</Label>
                  <Select value={contractFormData.contractType} onValueChange={(value) => setContractFormData({...contractFormData, contractType: value})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="دائم">دائم</SelectItem>
                      <SelectItem value="محدد المدة">محدد المدة</SelectItem>
                      <SelectItem value="مؤقت">مؤقت</SelectItem>
                      <SelectItem value="تدريب">تدريب</SelectItem>
                      <SelectItem value="استشاري">استشاري</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>من تاريخ *</Label>
                  <Input type="date" value={contractFormData.startDate} onChange={(e) => setContractFormData({...contractFormData, startDate: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>إلى تاريخ</Label>
                  <Input type="date" value={contractFormData.endDate} onChange={(e) => setContractFormData({...contractFormData, endDate: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>المنصب</Label>
                  <Input value={contractFormData.position} onChange={(e) => setContractFormData({...contractFormData, position: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>القسم</Label>
                  <Input value={contractFormData.department} onChange={(e) => setContractFormData({...contractFormData, department: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>الراتب</Label>
                  <Input type="number" value={contractFormData.salary} onChange={(e) => setContractFormData({...contractFormData, salary: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>ساعات العمل</Label>
                  <Input value={contractFormData.workingHours} onChange={(e) => setContractFormData({...contractFormData, workingHours: e.target.value})} placeholder="مثال: 40 ساعة/أسبوع" />
                </div>
                <div className="space-y-2">
                  <Label>فترة التجربة</Label>
                  <Input value={contractFormData.probationPeriod} onChange={(e) => setContractFormData({...contractFormData, probationPeriod: e.target.value})} placeholder="مثال: 3 أشهر" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>فترة الإشعار</Label>
                <Input value={contractFormData.noticePeriod} onChange={(e) => setContractFormData({...contractFormData, noticePeriod: e.target.value})} placeholder="مثال: 30 يوم" />
              </div>
              <div className="space-y-2">
                <Label>الشروط والأحكام</Label>
                <Textarea value={contractFormData.terms} onChange={(e) => setContractFormData({...contractFormData, terms: e.target.value})} rows={5} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsContractDialogOpen(false)}>إلغاء</Button>
              <Button onClick={handleSaveContract} className="bg-indigo-600 hover:bg-indigo-700">حفظ</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Contracts;

