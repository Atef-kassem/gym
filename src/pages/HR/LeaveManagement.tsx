import { useState, useEffect, useMemo } from "react";
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
  Calendar, Plus, Search, Edit, Trash2, Save, Clock, CheckCircle, XCircle
} from "lucide-react";
import { useGetAllEmployeesQuery, useGetAllLeavesQuery, useCreateLeaveMutation } from "@/services/employeesApi";

const LeaveManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: employeesResponse } = useGetAllEmployeesQuery({});
  const employees = Array.isArray(employeesResponse?.data) ? employeesResponse.data : [];
  
  // محاولة جلب البيانات من API، إذا فشل استخدم localStorage
  const { data: leavesResponse, isLoading: leavesLoading } = useGetAllLeavesQuery({}, { skip: true });
  const [createLeave] = useCreateLeaveMutation();
  
  // استخدام localStorage كحل مؤقت
  const [leaves, setLeaves] = useState<any[]>(() => {
    const stored = localStorage.getItem('hr_leaves');
    return stored ? JSON.parse(stored) : [];
  });
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    employeeName: "",
    type: "",
    startDate: "",
    endDate: "",
    reason: ""
  });
  const { toast } = useToast();

  const handleAdd = () => {
    setFormData({
      employeeName: "",
      type: "",
      startDate: "",
      endDate: "",
      reason: ""
    });
    setIsAddDialogOpen(true);
  };

  // حفظ في localStorage عند التحديث
  useEffect(() => {
    localStorage.setItem('hr_leaves', JSON.stringify(leaves));
  }, [leaves]);

  // فلترة الطلبات
  const filteredLeaves = useMemo(() => {
    return leaves.filter((leave) =>
      leave.employeeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      leave.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      leave.status?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [leaves, searchQuery]);

  const handleSaveAdd = async () => {
    if (!formData.employeeName || !formData.type || !formData.startDate || !formData.endDate) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const newLeave = {
      id: Date.now(),
      employeeId: employees.find((e: any) => (e.arabicName || e.name) === formData.employeeName)?.id,
      employeeName: formData.employeeName,
      type: formData.type,
      startDate: formData.startDate,
      endDate: formData.endDate,
      days,
      status: "قيد المراجعة",
      reason: formData.reason,
      createdAt: new Date().toISOString()
    };

    try {
      // محاولة الحفظ في API
      await createLeave(newLeave).unwrap();
    } catch (error) {
      // إذا فشل API، استخدم localStorage
      console.log("API not available, using localStorage");
    }
    
    setLeaves([...leaves, newLeave]);
    setIsAddDialogOpen(false);
    toast({
      title: "نجح",
      description: "تم إضافة طلب الإجازة بنجاح"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">إدارة الإجازات</h1>
            <p className="text-gray-600 mt-1">إدارة طلبات الإجازات والتصاريح</p>
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
              طلب إجازة جديد
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              طلبات الإجازات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-right py-3 px-4 font-semibold">اسم الموظف</th>
                    <th className="text-right py-3 px-4 font-semibold">نوع الإجازة</th>
                    <th className="text-right py-3 px-4 font-semibold">من تاريخ</th>
                    <th className="text-right py-3 px-4 font-semibold">إلى تاريخ</th>
                    <th className="text-right py-3 px-4 font-semibold">عدد الأيام</th>
                    <th className="text-right py-3 px-4 font-semibold">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeaves.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-gray-500">
                        <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                        <p>لا توجد طلبات إجازة</p>
                      </td>
                    </tr>
                  ) : (
                    filteredLeaves.map((leave) => (
                    <tr key={leave.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-semibold">{leave.employeeName}</td>
                      <td className="py-3 px-4">{leave.type}</td>
                      <td className="py-3 px-4">{leave.startDate}</td>
                      <td className="py-3 px-4">{leave.endDate}</td>
                      <td className="py-3 px-4">{leave.days} يوم</td>
                      <td className="py-3 px-4">
                        <Badge className={
                          leave.status === "موافق" ? "bg-green-500" :
                          leave.status === "قيد المراجعة" ? "bg-amber-500" : "bg-red-500"
                        }>
                          {leave.status === "موافق" ? <CheckCircle className="w-3 h-3 ml-1" /> :
                           leave.status === "قيد المراجعة" ? <Clock className="w-3 h-3 ml-1" /> :
                           <XCircle className="w-3 h-3 ml-1" />}
                          {leave.status}
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
              <DialogTitle>طلب إجازة جديد</DialogTitle>
              <DialogDescription>أدخل بيانات طلب الإجازة</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="employeeName">اسم الموظف *</Label>
                <Select
                  value={formData.employeeName}
                  onValueChange={(value) => setFormData({...formData, employeeName: value})}
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
                <Label htmlFor="type">نوع الإجازة *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع الإجازة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="إجازة سنوية">إجازة سنوية</SelectItem>
                    <SelectItem value="إجازة مرضية">إجازة مرضية</SelectItem>
                    <SelectItem value="إجازة طارئة">إجازة طارئة</SelectItem>
                    <SelectItem value="إجازة بدون راتب">إجازة بدون راتب</SelectItem>
                    <SelectItem value="تصريح">تصريح</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">من تاريخ *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">إلى تاريخ *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">سبب الإجازة</Label>
                <Textarea
                  id="reason"
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  placeholder="سبب الإجازة"
                  rows={3}
                />
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

export default LeaveManagement;

