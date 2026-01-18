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
  GraduationCap, Search, Filter, Calendar, Users, BookOpen, Award,
  Plus, Edit, Trash2, Clock, CheckCircle, XCircle, Download, Loader2
} from "lucide-react";
import { useGetAllEmployeesQuery } from "@/services/employeesApi";
import { format } from "date-fns";

const Training = () => {
  const [activeTab, setActiveTab] = useState("programs");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const { data: employeesResponse } = useGetAllEmployeesQuery({});
  const employees = Array.isArray(employeesResponse?.data) ? employeesResponse.data : [];

  // استخدام localStorage
  const [trainingPrograms, setTrainingPrograms] = useState<any[]>(() => {
    const stored = localStorage.getItem('hr_training_programs');
    return stored ? JSON.parse(stored) : [];
  });

  const [trainingSessions, setTrainingSessions] = useState<any[]>(() => {
    const stored = localStorage.getItem('hr_training_sessions');
    return stored ? JSON.parse(stored) : [];
  });

  const [certifications, setCertifications] = useState<any[]>(() => {
    const stored = localStorage.getItem('hr_certifications');
    return stored ? JSON.parse(stored) : [];
  });

  const [isProgramDialogOpen, setIsProgramDialogOpen] = useState(false);
  const [isSessionDialogOpen, setIsSessionDialogOpen] = useState(false);
  const [isCertificationDialogOpen, setIsCertificationDialogOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<any>(null);
  const [selectedSession, setSelectedSession] = useState<any>(null);

  const [programFormData, setProgramFormData] = useState({
    title: "",
    description: "",
    category: "",
    duration: "",
    cost: "",
    status: "نشط"
  });

  const [sessionFormData, setSessionFormData] = useState({
    programId: "",
    trainer: "",
    date: "",
    time: "",
    location: "",
    participants: [] as string[],
    status: "مجدولة"
  });

  const [certificationFormData, setCertificationFormData] = useState({
    employeeId: "",
    programId: "",
    certificateName: "",
    issueDate: "",
    expiryDate: "",
    certificateNumber: "",
    issuingOrganization: ""
  });

  const saveToStorage = (key: string, data: any[]) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const filteredPrograms = useMemo(() => {
    return trainingPrograms.filter((program: any) =>
      !searchQuery || program.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [trainingPrograms, searchQuery]);

  const filteredSessions = useMemo(() => {
    return trainingSessions.filter((session: any) => {
      const program = trainingPrograms.find((p: any) => p.id === parseInt(session.programId));
      return !searchQuery || program?.title?.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [trainingSessions, trainingPrograms, searchQuery]);

  const filteredCertifications = useMemo(() => {
    return certifications.filter((cert: any) => {
      const employee = employees.find((e: any) => e.id === parseInt(cert.employeeId));
      return !searchQuery || employee?.arabicName?.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [certifications, employees, searchQuery]);

  const handleAddProgram = () => {
    setProgramFormData({
      title: "",
      description: "",
      category: "",
      duration: "",
      cost: "",
      status: "نشط"
    });
    setSelectedProgram(null);
    setIsProgramDialogOpen(true);
  };

  const handleSaveProgram = () => {
    if (!programFormData.title) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    if (selectedProgram) {
      const updated = trainingPrograms.map((p: any) =>
        p.id === selectedProgram.id ? { ...p, ...programFormData, updatedAt: new Date().toISOString() } : p
      );
      setTrainingPrograms(updated);
      saveToStorage('hr_training_programs', updated);
      toast({ title: "نجح", description: "تم تحديث البرنامج بنجاح" });
    } else {
      const newProgram = {
        id: Date.now(),
        ...programFormData,
        createdAt: new Date().toISOString()
      };
      const updated = [...trainingPrograms, newProgram];
      setTrainingPrograms(updated);
      saveToStorage('hr_training_programs', updated);
      toast({ title: "نجح", description: "تم إضافة البرنامج بنجاح" });
    }
    setIsProgramDialogOpen(false);
  };

  const handleAddSession = () => {
    setSessionFormData({
      programId: "",
      trainer: "",
      date: "",
      time: "",
      location: "",
      participants: [],
      status: "مجدولة"
    });
    setSelectedSession(null);
    setIsSessionDialogOpen(true);
  };

  const handleSaveSession = () => {
    if (!sessionFormData.programId || !sessionFormData.date) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    if (selectedSession) {
      const updated = trainingSessions.map((s: any) =>
        s.id === selectedSession.id ? { ...s, ...sessionFormData, updatedAt: new Date().toISOString() } : s
      );
      setTrainingSessions(updated);
      saveToStorage('hr_training_sessions', updated);
      toast({ title: "نجح", description: "تم تحديث الجلسة بنجاح" });
    } else {
      const newSession = {
        id: Date.now(),
        ...sessionFormData,
        createdAt: new Date().toISOString()
      };
      const updated = [...trainingSessions, newSession];
      setTrainingSessions(updated);
      saveToStorage('hr_training_sessions', updated);
      toast({ title: "نجح", description: "تم إضافة الجلسة بنجاح" });
    }
    setIsSessionDialogOpen(false);
  };

  const handleAddCertification = () => {
    setCertificationFormData({
      employeeId: "",
      programId: "",
      certificateName: "",
      issueDate: "",
      expiryDate: "",
      certificateNumber: "",
      issuingOrganization: ""
    });
    setIsCertificationDialogOpen(true);
  };

  const handleSaveCertification = () => {
    if (!certificationFormData.employeeId || !certificationFormData.certificateName) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    const newCert = {
      id: Date.now(),
      ...certificationFormData,
      createdAt: new Date().toISOString()
    };
    const updated = [...certifications, newCert];
    setCertifications(updated);
    saveToStorage('hr_certifications', updated);
    setIsCertificationDialogOpen(false);
    toast({ title: "نجح", description: "تم إضافة الشهادة بنجاح" });
  };

  const stats = useMemo(() => {
    return {
      totalPrograms: trainingPrograms.length,
      activePrograms: trainingPrograms.filter((p: any) => p.status === "نشط").length,
      totalSessions: trainingSessions.length,
      completedSessions: trainingSessions.filter((s: any) => s.status === "مكتملة").length,
      totalCertifications: certifications.length,
      expiringSoon: certifications.filter((c: any) => {
        if (!c.expiryDate) return false;
        const expiry = new Date(c.expiryDate);
        const daysUntilExpiry = Math.ceil((expiry.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry > 0 && daysUntilExpiry <= 30;
      }).length
    };
  }, [trainingPrograms, trainingSessions, certifications]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <GraduationCap className="w-8 h-8 text-purple-600" />
              التدريب والتطوير
            </h1>
            <p className="text-gray-600 mt-1">إدارة برامج التدريب والجلسات والشهادات</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>برامج التدريب</span>
                <BookOpen className="w-5 h-5 text-purple-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{stats.totalPrograms}</div>
              <p className="text-sm text-gray-500 mt-1">{stats.activePrograms} برنامج نشط</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>جلسات التدريب</span>
                <Calendar className="w-5 h-5 text-blue-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.totalSessions}</div>
              <p className="text-sm text-gray-500 mt-1">{stats.completedSessions} مكتملة</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>الشهادات</span>
                <Award className="w-5 h-5 text-green-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.totalCertifications}</div>
              <p className="text-sm text-gray-500 mt-1">{stats.expiringSoon} تنتهي قريباً</p>
            </CardContent>
          </Card>
        </div>

        {/* التبويبات */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="programs">برامج التدريب</TabsTrigger>
            <TabsTrigger value="sessions">جلسات التدريب</TabsTrigger>
            <TabsTrigger value="certifications">الشهادات</TabsTrigger>
          </TabsList>

          {/* تبويب البرامج */}
          <TabsContent value="programs" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>برامج التدريب</CardTitle>
                <Button onClick={handleAddProgram} className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة برنامج
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredPrograms.map((program: any) => (
                    <Card key={program.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-2">{program.title}</h3>
                            <Badge className={program.status === "نشط" ? "bg-green-500" : "bg-gray-500"}>
                              {program.status}
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => {
                              setSelectedProgram(program);
                              setProgramFormData(program);
                              setIsProgramDialogOpen(true);
                            }}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => {
                              const updated = trainingPrograms.filter((p: any) => p.id !== program.id);
                              setTrainingPrograms(updated);
                              saveToStorage('hr_training_programs', updated);
                              toast({ title: "نجح", description: "تم حذف البرنامج" });
                            }}>
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {program.duration}
                          </div>
                          {program.cost && (
                            <div className="flex items-center gap-2">
                              <Award className="w-4 h-4" />
                              {program.cost} ج.م
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {filteredPrograms.length === 0 && (
                    <div className="col-span-2 text-center py-12 text-gray-500">
                      <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg">لا توجد برامج تدريب</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* تبويب الجلسات */}
          <TabsContent value="sessions" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>جلسات التدريب</CardTitle>
                <Button onClick={handleAddSession} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة جلسة
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredSessions.map((session: any) => {
                    const program = trainingPrograms.find((p: any) => p.id === parseInt(session.programId));
                    return (
                      <Card key={session.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold">{program?.title || "غير محدد"}</h3>
                                <Badge className={
                                  session.status === "مكتملة" ? "bg-green-500" :
                                  session.status === "مجدولة" ? "bg-blue-500" : "bg-gray-500"
                                }>
                                  {session.status}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4" />
                                  {session.date}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4" />
                                  {session.time}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Users className="w-4 h-4" />
                                  {session.participants?.length || 0} مشارك
                                </div>
                                <div className="flex items-center gap-2">
                                  <GraduationCap className="w-4 h-4" />
                                  {session.trainer}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                  {filteredSessions.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg">لا توجد جلسات تدريب</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* تبويب الشهادات */}
          <TabsContent value="certifications" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>الشهادات</CardTitle>
                <Button onClick={handleAddCertification} className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة شهادة
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-right py-3 px-4 font-semibold">الموظف</th>
                        <th className="text-right py-3 px-4 font-semibold">اسم الشهادة</th>
                        <th className="text-right py-3 px-4 font-semibold">تاريخ الإصدار</th>
                        <th className="text-right py-3 px-4 font-semibold">تاريخ الانتهاء</th>
                        <th className="text-right py-3 px-4 font-semibold">المنظمة</th>
                        <th className="text-right py-3 px-4 font-semibold">الحالة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCertifications.map((cert: any) => {
                        const employee = employees.find((e: any) => e.id === parseInt(cert.employeeId));
                        const isExpiring = cert.expiryDate && new Date(cert.expiryDate) <= new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000);
                        const isExpired = cert.expiryDate && new Date(cert.expiryDate) < new Date();
                        return (
                          <tr key={cert.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4 font-semibold">{employee?.arabicName || employee?.name || "-"}</td>
                            <td className="py-3 px-4">{cert.certificateName}</td>
                            <td className="py-3 px-4">{cert.issueDate}</td>
                            <td className="py-3 px-4">{cert.expiryDate || "لا ينتهي"}</td>
                            <td className="py-3 px-4">{cert.issuingOrganization}</td>
                            <td className="py-3 px-4">
                              <Badge className={
                                isExpired ? "bg-red-500" :
                                isExpiring ? "bg-amber-500" : "bg-green-500"
                              }>
                                {isExpired ? "منتهية" : isExpiring ? "تنتهي قريباً" : "نشطة"}
                              </Badge>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {filteredCertifications.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <Award className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg">لا توجد شهادات</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dialogs */}
        <Dialog open={isProgramDialogOpen} onOpenChange={setIsProgramDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedProgram ? "تعديل البرنامج" : "إضافة برنامج تدريب جديد"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>عنوان البرنامج *</Label>
                  <Input value={programFormData.title} onChange={(e) => setProgramFormData({...programFormData, title: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>الفئة</Label>
                  <Select value={programFormData.category} onValueChange={(value) => setProgramFormData({...programFormData, category: value})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="تقني">تقني</SelectItem>
                      <SelectItem value="إداري">إداري</SelectItem>
                      <SelectItem value="قيادي">قيادي</SelectItem>
                      <SelectItem value="لغة">لغة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>المدة</Label>
                  <Input value={programFormData.duration} onChange={(e) => setProgramFormData({...programFormData, duration: e.target.value})} placeholder="مثال: 40 ساعة" />
                </div>
                <div className="space-y-2">
                  <Label>التكلفة</Label>
                  <Input type="number" value={programFormData.cost} onChange={(e) => setProgramFormData({...programFormData, cost: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>الوصف</Label>
                <Textarea value={programFormData.description} onChange={(e) => setProgramFormData({...programFormData, description: e.target.value})} rows={4} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsProgramDialogOpen(false)}>إلغاء</Button>
              <Button onClick={handleSaveProgram} className="bg-purple-600 hover:bg-purple-700">حفظ</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isSessionDialogOpen} onOpenChange={setIsSessionDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedSession ? "تعديل الجلسة" : "إضافة جلسة تدريب جديدة"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>البرنامج *</Label>
                  <Select value={sessionFormData.programId} onValueChange={(value) => setSessionFormData({...sessionFormData, programId: value})}>
                    <SelectTrigger><SelectValue placeholder="اختر البرنامج" /></SelectTrigger>
                    <SelectContent>
                      {trainingPrograms.map((p: any) => (
                        <SelectItem key={p.id} value={p.id.toString()}>{p.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>المدرب</Label>
                  <Input value={sessionFormData.trainer} onChange={(e) => setSessionFormData({...sessionFormData, trainer: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>التاريخ *</Label>
                  <Input type="date" value={sessionFormData.date} onChange={(e) => setSessionFormData({...sessionFormData, date: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>الوقت</Label>
                  <Input type="time" value={sessionFormData.time} onChange={(e) => setSessionFormData({...sessionFormData, time: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>المكان</Label>
                <Input value={sessionFormData.location} onChange={(e) => setSessionFormData({...sessionFormData, location: e.target.value})} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsSessionDialogOpen(false)}>إلغاء</Button>
              <Button onClick={handleSaveSession} className="bg-blue-600 hover:bg-blue-700">حفظ</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isCertificationDialogOpen} onOpenChange={setIsCertificationDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>إضافة شهادة جديدة</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>الموظف *</Label>
                  <Select value={certificationFormData.employeeId} onValueChange={(value) => setCertificationFormData({...certificationFormData, employeeId: value})}>
                    <SelectTrigger><SelectValue placeholder="اختر الموظف" /></SelectTrigger>
                    <SelectContent>
                      {employees.map((e: any) => (
                        <SelectItem key={e.id} value={e.id.toString()}>{e.arabicName || e.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>اسم الشهادة *</Label>
                  <Input value={certificationFormData.certificateName} onChange={(e) => setCertificationFormData({...certificationFormData, certificateName: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>تاريخ الإصدار</Label>
                  <Input type="date" value={certificationFormData.issueDate} onChange={(e) => setCertificationFormData({...certificationFormData, issueDate: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>تاريخ الانتهاء</Label>
                  <Input type="date" value={certificationFormData.expiryDate} onChange={(e) => setCertificationFormData({...certificationFormData, expiryDate: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>رقم الشهادة</Label>
                  <Input value={certificationFormData.certificateNumber} onChange={(e) => setCertificationFormData({...certificationFormData, certificateNumber: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>المنظمة المصدرة</Label>
                  <Input value={certificationFormData.issuingOrganization} onChange={(e) => setCertificationFormData({...certificationFormData, issuingOrganization: e.target.value})} />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCertificationDialogOpen(false)}>إلغاء</Button>
              <Button onClick={handleSaveCertification} className="bg-green-600 hover:bg-green-700">حفظ</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Training;

