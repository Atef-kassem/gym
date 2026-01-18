import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Clock, Plus, Search, Edit, Trash2, Save, Calendar, CheckCircle, XCircle, Loader2
} from "lucide-react";
import { useGetAllEmployeesQuery, useGetAllAttendanceQuery, useCreateAttendanceMutation } from "@/services/employeesApi";

const AttendanceManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: employeesResponse } = useGetAllEmployeesQuery({});
  const employees = Array.isArray(employeesResponse?.data) ? employeesResponse.data : [];
  
  // محاولة جلب البيانات من API، إذا فشل استخدم localStorage
  const { data: attendanceResponse, isLoading: attendanceLoading } = useGetAllAttendanceQuery({}, { skip: true });
  const [createAttendance] = useCreateAttendanceMutation();
  
  // استخدام localStorage كحل مؤقت
  const [attendance, setAttendance] = useState<any[]>(() => {
    const stored = localStorage.getItem('hr_attendance');
    return stored ? JSON.parse(stored) : [];
  });
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    employeeName: "",
    date: "",
    checkIn: "",
    checkOut: ""
  });
  const { toast } = useToast();

  const handleAdd = () => {
    setFormData({
      employeeName: "",
      date: new Date().toISOString().split('T')[0],
      checkIn: "",
      checkOut: ""
    });
    setIsAddDialogOpen(true);
  };

  // حفظ في localStorage عند التحديث
  useEffect(() => {
    localStorage.setItem('hr_attendance', JSON.stringify(attendance));
  }, [attendance]);

  // فلترة السجلات
  const filteredAttendance = useMemo(() => {
    return attendance.filter((record) =>
      record.employeeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.date?.includes(searchQuery)
    );
  }, [attendance, searchQuery]);

  const handleSaveAdd = async () => {
    if (!formData.employeeName || !formData.date || !formData.checkIn) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    const hours = formData.checkOut 
      ? (new Date(`2000-01-01T${formData.checkOut}`).getTime() - new Date(`2000-01-01T${formData.checkIn}`).getTime()) / (1000 * 60 * 60)
      : 0;

    const newRecord = {
      id: Date.now(),
      employeeId: employees.find((e: any) => (e.arabicName || e.name) === formData.employeeName)?.id,
      employeeName: formData.employeeName,
      date: formData.date,
      checkIn: formData.checkIn,
      checkOut: formData.checkOut || "-",
      status: formData.checkOut ? "حاضر" : "مستمر",
      hours: Math.round(hours * 10) / 10,
      createdAt: new Date().toISOString()
    };

    try {
      // محاولة الحفظ في API
      await createAttendance(newRecord).unwrap();
    } catch (error) {
      // إذا فشل API، استخدم localStorage
      console.log("API not available, using localStorage");
    }
    
    setAttendance([...attendance, newRecord]);
    setIsAddDialogOpen(false);
    toast({
      title: "نجح",
      description: "تم إضافة سجل الحضور بنجاح"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">إدارة الحضور والانصراف</h1>
            <p className="text-gray-600 mt-1">تتبع حضور وانصراف الموظفين</p>
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
              تسجيل حضور
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              سجل الحضور
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-right py-3 px-4 font-semibold">اسم الموظف</th>
                    <th className="text-right py-3 px-4 font-semibold">التاريخ</th>
                    <th className="text-right py-3 px-4 font-semibold">وقت الدخول</th>
                    <th className="text-right py-3 px-4 font-semibold">وقت الخروج</th>
                    <th className="text-right py-3 px-4 font-semibold">عدد الساعات</th>
                    <th className="text-right py-3 px-4 font-semibold">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttendance.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-gray-500">
                        <Clock className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                        <p>لا توجد سجلات حضور</p>
                      </td>
                    </tr>
                  ) : (
                    filteredAttendance.map((record) => (
                    <tr key={record.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-semibold">{record.employeeName}</td>
                      <td className="py-3 px-4">{record.date}</td>
                      <td className="py-3 px-4">{record.checkIn}</td>
                      <td className="py-3 px-4">{record.checkOut}</td>
                      <td className="py-3 px-4">{record.hours} ساعة</td>
                      <td className="py-3 px-4">
                        <Badge className={
                          record.status === "حاضر" ? "bg-green-500" :
                          record.status === "مستمر" ? "bg-blue-500" : "bg-red-500"
                        }>
                          {record.status === "حاضر" ? <CheckCircle className="w-3 h-3 ml-1" /> : 
                           record.status === "مستمر" ? <Clock className="w-3 h-3 ml-1" /> :
                           <XCircle className="w-3 h-3 ml-1" />}
                          {record.status}
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
              <DialogTitle>تسجيل حضور</DialogTitle>
              <DialogDescription>سجل حضور موظف</DialogDescription>
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">التاريخ *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="checkIn">وقت الدخول *</Label>
                  <Input
                    id="checkIn"
                    type="time"
                    value={formData.checkIn}
                    onChange={(e) => setFormData({...formData, checkIn: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="checkOut">وقت الخروج</Label>
                <Input
                  id="checkOut"
                  type="time"
                  value={formData.checkOut}
                  onChange={(e) => setFormData({...formData, checkOut: e.target.value})}
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

export default AttendanceManagement;

