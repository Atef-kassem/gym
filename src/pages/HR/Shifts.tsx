import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Clock, Search, Filter, Calendar, Users, RotateCcw, CheckCircle,
  Plus, Edit, Trash2, Download, AlertCircle, XCircle
} from "lucide-react";
import { useGetAllEmployeesQuery } from "@/services/employeesApi";
import { format } from "date-fns";

const Shifts = () => {
  const [activeTab, setActiveTab] = useState("shifts");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const { data: employeesResponse } = useGetAllEmployeesQuery({});
  const employees = Array.isArray(employeesResponse?.data) ? employeesResponse.data : [];

  // استخدام localStorage
  const [shifts, setShifts] = useState<any[]>(() => {
    const stored = localStorage.getItem('hr_shifts');
    return stored ? JSON.parse(stored) : [];
  });

  const [shiftTemplates, setShiftTemplates] = useState<any[]>(() => {
    const stored = localStorage.getItem('hr_shift_templates');
    return stored ? JSON.parse(stored) : [
      { id: 1, name: "وردية صباحية", startTime: "08:00", endTime: "16:00", breakDuration: "60" },
      { id: 2, name: "وردية مسائية", startTime: "16:00", endTime: "00:00", breakDuration: "60" },
      { id: 3, name: "وردية ليلية", startTime: "00:00", endTime: "08:00", breakDuration: "60" }
    ];
  });

  const [shiftRequests, setShiftRequests] = useState<any[]>(() => {
    const stored = localStorage.getItem('hr_shift_requests');
    return stored ? JSON.parse(stored) : [];
  });

  const [isShiftDialogOpen, setIsShiftDialogOpen] = useState(false);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState<any>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  const [shiftFormData, setShiftFormData] = useState({
    employeeId: "",
    templateId: "",
    date: "",
    startTime: "",
    endTime: "",
    breakDuration: "",
    status: "مجدولة"
  });

  const [templateFormData, setTemplateFormData] = useState({
    name: "",
    startTime: "",
    endTime: "",
    breakDuration: "",
    description: ""
  });

  const [requestFormData, setRequestFormData] = useState({
    employeeId: "",
    currentShiftId: "",
    requestedShiftId: "",
    reason: "",
    status: "قيد المراجعة"
  });

  const saveToStorage = (key: string, data: any[]) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const filteredShifts = useMemo(() => {
    return shifts.filter((shift: any) => {
      const employee = employees.find((e: any) => e.id === parseInt(shift.employeeId));
      return !searchQuery ||
        employee?.arabicName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shift.date?.includes(searchQuery);
    });
  }, [shifts, employees, searchQuery]);

  const filteredRequests = useMemo(() => {
    return shiftRequests.filter((req: any) => {
      const employee = employees.find((e: any) => e.id === parseInt(req.employeeId));
      return !searchQuery || employee?.arabicName?.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [shiftRequests, employees, searchQuery]);

  const handleAddShift = () => {
    setShiftFormData({
      employeeId: "",
      templateId: "",
      date: "",
      startTime: "",
      endTime: "",
      breakDuration: "",
      status: "مجدولة"
    });
    setSelectedShift(null);
    setIsShiftDialogOpen(true);
  };

  const handleSaveShift = () => {
    if (!shiftFormData.employeeId || !shiftFormData.date) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    if (selectedShift) {
      const updated = shifts.map((s: any) =>
        s.id === selectedShift.id ? { ...s, ...shiftFormData, updatedAt: new Date().toISOString() } : s
      );
      setShifts(updated);
      saveToStorage('hr_shifts', updated);
      toast({ title: "نجح", description: "تم تحديث المناوبة بنجاح" });
    } else {
      const newShift = {
        id: Date.now(),
        ...shiftFormData,
        createdAt: new Date().toISOString()
      };
      const updated = [...shifts, newShift];
      setShifts(updated);
      saveToStorage('hr_shifts', updated);
      toast({ title: "نجح", description: "تم إضافة المناوبة بنجاح" });
    }
    setIsShiftDialogOpen(false);
  };

  const handleAddTemplate = () => {
    setTemplateFormData({
      name: "",
      startTime: "",
      endTime: "",
      breakDuration: "",
      description: ""
    });
    setSelectedTemplate(null);
    setIsTemplateDialogOpen(true);
  };

  const handleSaveTemplate = () => {
    if (!templateFormData.name || !templateFormData.startTime || !templateFormData.endTime) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    if (selectedTemplate) {
      const updated = shiftTemplates.map((t: any) =>
        t.id === selectedTemplate.id ? { ...t, ...templateFormData, updatedAt: new Date().toISOString() } : t
      );
      setShiftTemplates(updated);
      saveToStorage('hr_shift_templates', updated);
      toast({ title: "نجح", description: "تم تحديث القالب بنجاح" });
    } else {
      const newTemplate = {
        id: Date.now(),
        ...templateFormData,
        createdAt: new Date().toISOString()
      };
      const updated = [...shiftTemplates, newTemplate];
      setShiftTemplates(updated);
      saveToStorage('hr_shift_templates', updated);
      toast({ title: "نجح", description: "تم إضافة القالب بنجاح" });
    }
    setIsTemplateDialogOpen(false);
  };

  const handleAddRequest = () => {
    setRequestFormData({
      employeeId: "",
      currentShiftId: "",
      requestedShiftId: "",
      reason: "",
      status: "قيد المراجعة"
    });
    setIsRequestDialogOpen(true);
  };

  const handleSaveRequest = () => {
    if (!requestFormData.employeeId || !requestFormData.currentShiftId || !requestFormData.requestedShiftId) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    const newRequest = {
      id: Date.now(),
      ...requestFormData,
      createdAt: new Date().toISOString()
    };
    const updated = [...shiftRequests, newRequest];
    setShiftRequests(updated);
    saveToStorage('hr_shift_requests', updated);
    setIsRequestDialogOpen(false);
    toast({ title: "نجح", description: "تم إرسال طلب التبادل بنجاح" });
  };

  const handleApproveRequest = (request: any) => {
    const updated = shiftRequests.map((r: any) =>
      r.id === request.id ? { ...r, status: "موافق" } : r
    );
    setShiftRequests(updated);
    saveToStorage('hr_shift_requests', updated);
    toast({ title: "نجح", description: "تمت الموافقة على الطلب" });
  };

  const handleRejectRequest = (request: any) => {
    const updated = shiftRequests.map((r: any) =>
      r.id === request.id ? { ...r, status: "مرفوض" } : r
    );
    setShiftRequests(updated);
    saveToStorage('hr_shift_requests', updated);
    toast({ title: "نجح", description: "تم رفض الطلب" });
  };

  const stats = useMemo(() => {
    return {
      totalShifts: shifts.length,
      scheduledShifts: shifts.filter((s: any) => s.status === "مجدولة").length,
      completedShifts: shifts.filter((s: any) => s.status === "مكتملة").length,
      pendingRequests: shiftRequests.filter((r: any) => r.status === "قيد المراجعة").length
    };
  }, [shifts, shiftRequests]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Clock className="w-8 h-8 text-orange-600" />
              إدارة المناوبات
            </h1>
            <p className="text-gray-600 mt-1">إدارة مناوبات الموظفين وطلبات التبادل</p>
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
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>إجمالي المناوبات</span>
                <Clock className="w-5 h-5 text-orange-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{stats.totalShifts}</div>
              <p className="text-sm text-gray-500 mt-1">مناوبة إجمالي</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>مجدولة</span>
                <Calendar className="w-5 h-5 text-blue-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.scheduledShifts}</div>
              <p className="text-sm text-gray-500 mt-1">مناوبة مجدولة</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>مكتملة</span>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.completedShifts}</div>
              <p className="text-sm text-gray-500 mt-1">مناوبة مكتملة</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>طلبات معلقة</span>
                <AlertCircle className="w-5 h-5 text-amber-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">{stats.pendingRequests}</div>
              <p className="text-sm text-gray-500 mt-1">طلب قيد المراجعة</p>
            </CardContent>
          </Card>
        </div>

        {/* التبويبات */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="shifts">المناوبات</TabsTrigger>
            <TabsTrigger value="templates">قوالب المناوبات</TabsTrigger>
            <TabsTrigger value="requests">طلبات التبادل</TabsTrigger>
          </TabsList>

          {/* تبويب المناوبات */}
          <TabsContent value="shifts" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>جدول المناوبات</CardTitle>
                <Button onClick={handleAddShift} className="bg-orange-600 hover:bg-orange-700">
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة مناوبة
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-right py-3 px-4 font-semibold">الموظف</th>
                        <th className="text-right py-3 px-4 font-semibold">التاريخ</th>
                        <th className="text-right py-3 px-4 font-semibold">وقت البداية</th>
                        <th className="text-right py-3 px-4 font-semibold">وقت النهاية</th>
                        <th className="text-right py-3 px-4 font-semibold">مدة الراحة</th>
                        <th className="text-right py-3 px-4 font-semibold">الحالة</th>
                        <th className="text-right py-3 px-4 font-semibold">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredShifts.map((shift: any) => {
                        const employee = employees.find((e: any) => e.id === parseInt(shift.employeeId));
                        return (
                          <tr key={shift.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4 font-semibold">{employee?.arabicName || employee?.name || "-"}</td>
                            <td className="py-3 px-4">{shift.date}</td>
                            <td className="py-3 px-4">{shift.startTime}</td>
                            <td className="py-3 px-4">{shift.endTime}</td>
                            <td className="py-3 px-4">{shift.breakDuration} دقيقة</td>
                            <td className="py-3 px-4">
                              <Badge className={
                                shift.status === "مكتملة" ? "bg-green-500" :
                                shift.status === "مجدولة" ? "bg-blue-500" :
                                shift.status === "ملغاة" ? "bg-red-500" : "bg-gray-500"
                              }>
                                {shift.status}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex gap-2 justify-end">
                                <Button variant="ghost" size="sm" onClick={() => {
                                  setSelectedShift(shift);
                                  setShiftFormData(shift);
                                  setIsShiftDialogOpen(true);
                                }}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => {
                                  const updated = shifts.filter((s: any) => s.id !== shift.id);
                                  setShifts(updated);
                                  saveToStorage('hr_shifts', updated);
                                  toast({ title: "نجح", description: "تم حذف المناوبة" });
                                }}>
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {filteredShifts.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <Clock className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg">لا توجد مناوبات</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* تبويب قوالب المناوبات */}
          <TabsContent value="templates" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>قوالب المناوبات</CardTitle>
                <Button onClick={handleAddTemplate} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة قالب
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {shiftTemplates.map((template: any) => (
                    <Card key={template.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-2">{template.name}</h3>
                            <div className="space-y-1 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                {template.startTime} - {template.endTime}
                              </div>
                              <div className="flex items-center gap-2">
                                <RotateCcw className="w-4 h-4" />
                                راحة: {template.breakDuration} دقيقة
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => {
                              setSelectedTemplate(template);
                              setTemplateFormData(template);
                              setIsTemplateDialogOpen(true);
                            }}>
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* تبويب طلبات التبادل */}
          <TabsContent value="requests" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>طلبات تبادل المناوبات</CardTitle>
                <Button onClick={handleAddRequest} className="bg-amber-600 hover:bg-amber-700">
                  <Plus className="w-4 h-4 ml-2" />
                  طلب تبادل
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredRequests.map((request: any) => {
                    const employee = employees.find((e: any) => e.id === parseInt(request.employeeId));
                    const currentShift = shifts.find((s: any) => s.id === parseInt(request.currentShiftId));
                    const requestedShift = shifts.find((s: any) => s.id === parseInt(request.requestedShiftId));
                    return (
                      <Card key={request.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold">{employee?.arabicName || employee?.name || "غير محدد"}</h3>
                                <Badge className={
                                  request.status === "موافق" ? "bg-green-500" :
                                  request.status === "مرفوض" ? "bg-red-500" :
                                  request.status === "قيد المراجعة" ? "bg-amber-500" : "bg-gray-500"
                                }>
                                  {request.status}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                <div>
                                  <span className="font-medium">المناوبة الحالية:</span>
                                  <p>{currentShift?.date || "-"} ({currentShift?.startTime} - {currentShift?.endTime})</p>
                                </div>
                                <div>
                                  <span className="font-medium">المناوبة المطلوبة:</span>
                                  <p>{requestedShift?.date || "-"} ({requestedShift?.startTime} - {requestedShift?.endTime})</p>
                                </div>
                              </div>
                              {request.reason && (
                                <p className="text-sm text-gray-600 mt-2">السبب: {request.reason}</p>
                              )}
                            </div>
                            {request.status === "قيد المراجعة" && (
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm" onClick={() => handleApproveRequest(request)}>
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleRejectRequest(request)}>
                                  <XCircle className="w-4 h-4 text-red-500" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                  {filteredRequests.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <RotateCcw className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg">لا توجد طلبات تبادل</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dialogs */}
        <Dialog open={isShiftDialogOpen} onOpenChange={setIsShiftDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedShift ? "تعديل المناوبة" : "إضافة مناوبة جديدة"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>الموظف *</Label>
                  <Select value={shiftFormData.employeeId} onValueChange={(value) => setShiftFormData({...shiftFormData, employeeId: value})}>
                    <SelectTrigger><SelectValue placeholder="اختر الموظف" /></SelectTrigger>
                    <SelectContent>
                      {employees.map((e: any) => (
                        <SelectItem key={e.id} value={e.id.toString()}>{e.arabicName || e.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>التاريخ *</Label>
                  <Input type="date" value={shiftFormData.date} onChange={(e) => setShiftFormData({...shiftFormData, date: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>وقت البداية</Label>
                  <Input type="time" value={shiftFormData.startTime} onChange={(e) => setShiftFormData({...shiftFormData, startTime: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>وقت النهاية</Label>
                  <Input type="time" value={shiftFormData.endTime} onChange={(e) => setShiftFormData({...shiftFormData, endTime: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>مدة الراحة (بالدقائق)</Label>
                <Input type="number" value={shiftFormData.breakDuration} onChange={(e) => setShiftFormData({...shiftFormData, breakDuration: e.target.value})} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsShiftDialogOpen(false)}>إلغاء</Button>
              <Button onClick={handleSaveShift} className="bg-orange-600 hover:bg-orange-700">حفظ</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedTemplate ? "تعديل القالب" : "إضافة قالب مناوبة جديد"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>اسم القالب *</Label>
                <Input value={templateFormData.name} onChange={(e) => setTemplateFormData({...templateFormData, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>وقت البداية *</Label>
                  <Input type="time" value={templateFormData.startTime} onChange={(e) => setTemplateFormData({...templateFormData, startTime: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>وقت النهاية *</Label>
                  <Input type="time" value={templateFormData.endTime} onChange={(e) => setTemplateFormData({...templateFormData, endTime: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>مدة الراحة (بالدقائق)</Label>
                <Input type="number" value={templateFormData.breakDuration} onChange={(e) => setTemplateFormData({...templateFormData, breakDuration: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>الوصف</Label>
                <Input value={templateFormData.description} onChange={(e) => setTemplateFormData({...templateFormData, description: e.target.value})} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsTemplateDialogOpen(false)}>إلغاء</Button>
              <Button onClick={handleSaveTemplate} className="bg-blue-600 hover:bg-blue-700">حفظ</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>طلب تبادل مناوبة</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>الموظف *</Label>
                <Select value={requestFormData.employeeId} onValueChange={(value) => setRequestFormData({...requestFormData, employeeId: value})}>
                  <SelectTrigger><SelectValue placeholder="اختر الموظف" /></SelectTrigger>
                  <SelectContent>
                    {employees.map((e: any) => (
                      <SelectItem key={e.id} value={e.id.toString()}>{e.arabicName || e.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>المناوبة الحالية *</Label>
                  <Select value={requestFormData.currentShiftId} onValueChange={(value) => setRequestFormData({...requestFormData, currentShiftId: value})}>
                    <SelectTrigger><SelectValue placeholder="اختر المناوبة" /></SelectTrigger>
                    <SelectContent>
                      {shifts.filter((s: any) => s.employeeId === requestFormData.employeeId).map((s: any) => (
                        <SelectItem key={s.id} value={s.id.toString()}>{s.date} ({s.startTime} - {s.endTime})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>المناوبة المطلوبة *</Label>
                  <Select value={requestFormData.requestedShiftId} onValueChange={(value) => setRequestFormData({...requestFormData, requestedShiftId: value})}>
                    <SelectTrigger><SelectValue placeholder="اختر المناوبة" /></SelectTrigger>
                    <SelectContent>
                      {shifts.filter((s: any) => s.employeeId !== requestFormData.employeeId).map((s: any) => (
                        <SelectItem key={s.id} value={s.id.toString()}>{s.date} ({s.startTime} - {s.endTime})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>السبب</Label>
                <Input value={requestFormData.reason} onChange={(e) => setRequestFormData({...requestFormData, reason: e.target.value})} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsRequestDialogOpen(false)}>إلغاء</Button>
              <Button onClick={handleSaveRequest} className="bg-amber-600 hover:bg-amber-700">إرسال</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Shifts;

