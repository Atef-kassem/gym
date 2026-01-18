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
  UserPlus, Search, Filter, Calendar, Briefcase, MapPin, DollarSign,
  Plus, Edit, Trash2, Eye, CheckCircle, XCircle, Clock, FileText,
  Mail, Phone, GraduationCap, Award, Download, Loader2
} from "lucide-react";
import { useGetAllEmployeesQuery } from "@/services/employeesApi";
import { format } from "date-fns";

const Recruitment = () => {
  const [activeTab, setActiveTab] = useState("jobs");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const { toast } = useToast();
  const { data: employeesResponse } = useGetAllEmployeesQuery({});

  // استخدام localStorage كحل مؤقت
  const [jobPostings, setJobPostings] = useState<any[]>(() => {
    const stored = localStorage.getItem('hr_job_postings');
    return stored ? JSON.parse(stored) : [];
  });

  const [candidates, setCandidates] = useState<any[]>(() => {
    const stored = localStorage.getItem('hr_candidates');
    return stored ? JSON.parse(stored) : [];
  });

  const [interviews, setInterviews] = useState<any[]>(() => {
    const stored = localStorage.getItem('hr_interviews');
    return stored ? JSON.parse(stored) : [];
  });

  const [isJobDialogOpen, setIsJobDialogOpen] = useState(false);
  const [isCandidateDialogOpen, setIsCandidateDialogOpen] = useState(false);
  const [isInterviewDialogOpen, setIsInterviewDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);

  const [jobFormData, setJobFormData] = useState({
    title: "",
    department: "",
    position: "",
    location: "",
    salary: "",
    type: "",
    description: "",
    requirements: "",
    status: "مفتوحة"
  });

  const [candidateFormData, setCandidateFormData] = useState({
    name: "",
    email: "",
    phone: "",
    jobId: "",
    experience: "",
    education: "",
    skills: "",
    resume: "",
    coverLetter: "",
    status: "جديد"
  });

  const [interviewFormData, setInterviewFormData] = useState({
    candidateId: "",
    jobId: "",
    interviewerId: "",
    date: "",
    time: "",
    type: "",
    location: "",
    notes: "",
    status: "مجدولة"
  });

  // حفظ في localStorage
  const saveToStorage = (key: string, data: any[]) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // فلترة الوظائف
  const filteredJobs = useMemo(() => {
    return jobPostings.filter((job) => {
      const matchesSearch = !searchQuery ||
        job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.department?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === "all" || job.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [jobPostings, searchQuery, filterStatus]);

  // فلترة المرشحين
  const filteredCandidates = useMemo(() => {
    return candidates.filter((candidate) => {
      const matchesSearch = !searchQuery ||
        candidate.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.email?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === "all" || candidate.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [candidates, searchQuery, filterStatus]);

  // فلترة المقابلات
  const filteredInterviews = useMemo(() => {
    return interviews.filter((interview) => {
      const candidate = candidates.find((c: any) => c.id === interview.candidateId);
      const matchesSearch = !searchQuery ||
        candidate?.name?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === "all" || interview.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [interviews, candidates, searchQuery, filterStatus]);

  const handleAddJob = () => {
    setJobFormData({
      title: "",
      department: "",
      position: "",
      location: "",
      salary: "",
      type: "",
      description: "",
      requirements: "",
      status: "مفتوحة"
    });
    setSelectedJob(null);
    setIsJobDialogOpen(true);
  };

  const handleSaveJob = () => {
    if (!jobFormData.title || !jobFormData.department) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    if (selectedJob) {
      const updated = jobPostings.map((job: any) =>
        job.id === selectedJob.id ? { ...job, ...jobFormData, updatedAt: new Date().toISOString() } : job
      );
      setJobPostings(updated);
      saveToStorage('hr_job_postings', updated);
      toast({ title: "نجح", description: "تم تحديث الوظيفة بنجاح" });
    } else {
      const newJob = {
        id: Date.now(),
        ...jobFormData,
        createdAt: new Date().toISOString(),
        applicationsCount: 0
      };
      const updated = [...jobPostings, newJob];
      setJobPostings(updated);
      saveToStorage('hr_job_postings', updated);
      toast({ title: "نجح", description: "تم إضافة الوظيفة بنجاح" });
    }
    setIsJobDialogOpen(false);
  };

  const handleAddCandidate = () => {
    setCandidateFormData({
      name: "",
      email: "",
      phone: "",
      jobId: "",
      experience: "",
      education: "",
      skills: "",
      resume: "",
      coverLetter: "",
      status: "جديد"
    });
    setSelectedCandidate(null);
    setIsCandidateDialogOpen(true);
  };

  const handleSaveCandidate = () => {
    if (!candidateFormData.name || !candidateFormData.email || !candidateFormData.jobId) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    if (selectedCandidate) {
      const updated = candidates.map((c: any) =>
        c.id === selectedCandidate.id ? { ...c, ...candidateFormData, updatedAt: new Date().toISOString() } : c
      );
      setCandidates(updated);
      saveToStorage('hr_candidates', updated);
      toast({ title: "نجح", description: "تم تحديث المرشح بنجاح" });
    } else {
      const newCandidate = {
        id: Date.now(),
        ...candidateFormData,
        createdAt: new Date().toISOString()
      };
      const updated = [...candidates, newCandidate];
      setCandidates(updated);
      saveToStorage('hr_candidates', updated);
      
      // تحديث عدد المتقدمين للوظيفة
      const job = jobPostings.find((j: any) => j.id === parseInt(candidateFormData.jobId));
      if (job) {
        const updatedJobs = jobPostings.map((j: any) =>
          j.id === job.id ? { ...j, applicationsCount: (j.applicationsCount || 0) + 1 } : j
        );
        setJobPostings(updatedJobs);
        saveToStorage('hr_job_postings', updatedJobs);
      }
      
      toast({ title: "نجح", description: "تم إضافة المرشح بنجاح" });
    }
    setIsCandidateDialogOpen(false);
  };

  const handleAddInterview = () => {
    setInterviewFormData({
      candidateId: "",
      jobId: "",
      interviewerId: "",
      date: "",
      time: "",
      type: "",
      location: "",
      notes: "",
      status: "مجدولة"
    });
    setIsInterviewDialogOpen(true);
  };

  const handleSaveInterview = () => {
    if (!interviewFormData.candidateId || !interviewFormData.jobId || !interviewFormData.date) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    const newInterview = {
      id: Date.now(),
      ...interviewFormData,
      createdAt: new Date().toISOString()
    };
    const updated = [...interviews, newInterview];
    setInterviews(updated);
    saveToStorage('hr_interviews', updated);
    setIsInterviewDialogOpen(false);
    toast({ title: "نجح", description: "تم جدولة المقابلة بنجاح" });
  };

  const stats = useMemo(() => {
    return {
      totalJobs: jobPostings.length,
      openJobs: jobPostings.filter((j: any) => j.status === "مفتوحة").length,
      totalCandidates: candidates.length,
      newCandidates: candidates.filter((c: any) => c.status === "جديد").length,
      scheduledInterviews: interviews.filter((i: any) => i.status === "مجدولة").length,
      completedInterviews: interviews.filter((i: any) => i.status === "مكتملة").length
    };
  }, [jobPostings, candidates, interviews]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <UserPlus className="w-8 h-8 text-blue-600" />
              التوظيف والاستقطاب
            </h1>
            <p className="text-gray-600 mt-1">إدارة الوظائف الشاغرة والمرشحين والمقابلات</p>
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
          </div>
        </div>

        {/* الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>إجمالي الوظائف</span>
                <Briefcase className="w-5 h-5 text-blue-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.totalJobs}</div>
              <p className="text-sm text-gray-500 mt-1">{stats.openJobs} وظيفة مفتوحة</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>المرشحين</span>
                <UserPlus className="w-5 h-5 text-green-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.totalCandidates}</div>
              <p className="text-sm text-gray-500 mt-1">{stats.newCandidates} مرشح جديد</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>المقابلات</span>
                <Calendar className="w-5 h-5 text-purple-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{stats.scheduledInterviews}</div>
              <p className="text-sm text-gray-500 mt-1">{stats.completedInterviews} مكتملة</p>
            </CardContent>
          </Card>
        </div>

        {/* التبويبات */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="jobs">الوظائف الشاغرة</TabsTrigger>
            <TabsTrigger value="candidates">المرشحين</TabsTrigger>
            <TabsTrigger value="interviews">المقابلات</TabsTrigger>
          </TabsList>

          {/* تبويب الوظائف */}
          <TabsContent value="jobs" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>الوظائف الشاغرة</CardTitle>
                <Button onClick={handleAddJob} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة وظيفة
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredJobs.map((job: any) => (
                    <Card key={job.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold">{job.title}</h3>
                              <Badge className={job.status === "مفتوحة" ? "bg-green-500" : "bg-gray-500"}>
                                {job.status}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Briefcase className="w-4 h-4" />
                                {job.department}
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                {job.location}
                              </div>
                              <div className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4" />
                                {job.salary} ج.م
                              </div>
                              <div className="flex items-center gap-2">
                                <UserPlus className="w-4 h-4" />
                                {job.applicationsCount || 0} متقدم
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => {
                              setSelectedJob(job);
                              setJobFormData(job);
                              setIsJobDialogOpen(true);
                            }}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => {
                              const updated = jobPostings.filter((j: any) => j.id !== job.id);
                              setJobPostings(updated);
                              saveToStorage('hr_job_postings', updated);
                              toast({ title: "نجح", description: "تم حذف الوظيفة" });
                            }}>
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {filteredJobs.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg">لا توجد وظائف شاغرة</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* تبويب المرشحين */}
          <TabsContent value="candidates" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>المرشحين</CardTitle>
                <Button onClick={handleAddCandidate} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة مرشح
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-right py-3 px-4 font-semibold">الاسم</th>
                        <th className="text-right py-3 px-4 font-semibold">البريد</th>
                        <th className="text-right py-3 px-4 font-semibold">الهاتف</th>
                        <th className="text-right py-3 px-4 font-semibold">الوظيفة</th>
                        <th className="text-right py-3 px-4 font-semibold">الحالة</th>
                        <th className="text-right py-3 px-4 font-semibold">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCandidates.map((candidate: any) => {
                        const job = jobPostings.find((j: any) => j.id === parseInt(candidate.jobId));
                        return (
                          <tr key={candidate.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4 font-semibold">{candidate.name}</td>
                            <td className="py-3 px-4">{candidate.email}</td>
                            <td className="py-3 px-4">{candidate.phone}</td>
                            <td className="py-3 px-4">{job?.title || "-"}</td>
                            <td className="py-3 px-4">
                              <Badge className={
                                candidate.status === "جديد" ? "bg-blue-500" :
                                candidate.status === "مقبول" ? "bg-green-500" :
                                candidate.status === "مرفوض" ? "bg-red-500" : "bg-gray-500"
                              }>
                                {candidate.status}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex gap-2 justify-end">
                                <Button variant="ghost" size="sm" onClick={() => {
                                  setSelectedCandidate(candidate);
                                  setCandidateFormData(candidate);
                                  setIsCandidateDialogOpen(true);
                                }}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => {
                                  handleAddInterview();
                                  setInterviewFormData(prev => ({
                                    ...prev,
                                    candidateId: candidate.id.toString(),
                                    jobId: candidate.jobId
                                  }));
                                }}>
                                  <Calendar className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {filteredCandidates.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <UserPlus className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg">لا يوجد مرشحين</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* تبويب المقابلات */}
          <TabsContent value="interviews" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>المقابلات</CardTitle>
                <Button onClick={handleAddInterview} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 ml-2" />
                  جدولة مقابلة
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredInterviews.map((interview: any) => {
                    const candidate = candidates.find((c: any) => c.id === parseInt(interview.candidateId));
                    const job = jobPostings.find((j: any) => j.id === parseInt(interview.jobId));
                    return (
                      <Card key={interview.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold">{candidate?.name || "غير محدد"}</h3>
                                <Badge className={
                                  interview.status === "مجدولة" ? "bg-blue-500" :
                                  interview.status === "مكتملة" ? "bg-green-500" :
                                  interview.status === "ملغاة" ? "bg-red-500" : "bg-gray-500"
                                }>
                                  {interview.status}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                  <Briefcase className="w-4 h-4" />
                                  {job?.title || "-"}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4" />
                                  {interview.date}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4" />
                                  {interview.time}
                                </div>
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4" />
                                  {interview.location}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                  {filteredInterviews.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg">لا توجد مقابلات</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dialog إضافة/تعديل وظيفة */}
        <Dialog open={isJobDialogOpen} onOpenChange={setIsJobDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedJob ? "تعديل الوظيفة" : "إضافة وظيفة جديدة"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>عنوان الوظيفة *</Label>
                  <Input value={jobFormData.title} onChange={(e) => setJobFormData({...jobFormData, title: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>القسم *</Label>
                  <Input value={jobFormData.department} onChange={(e) => setJobFormData({...jobFormData, department: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>المنصب</Label>
                  <Input value={jobFormData.position} onChange={(e) => setJobFormData({...jobFormData, position: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>المكان</Label>
                  <Input value={jobFormData.location} onChange={(e) => setJobFormData({...jobFormData, location: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>الراتب</Label>
                  <Input type="number" value={jobFormData.salary} onChange={(e) => setJobFormData({...jobFormData, salary: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>نوع الوظيفة</Label>
                  <Select value={jobFormData.type} onValueChange={(value) => setJobFormData({...jobFormData, type: value})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="دوام كامل">دوام كامل</SelectItem>
                      <SelectItem value="دوام جزئي">دوام جزئي</SelectItem>
                      <SelectItem value="عقد">عقد</SelectItem>
                      <SelectItem value="عن بُعد">عن بُعد</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>الوصف</Label>
                <Textarea value={jobFormData.description} onChange={(e) => setJobFormData({...jobFormData, description: e.target.value})} rows={4} />
              </div>
              <div className="space-y-2">
                <Label>المتطلبات</Label>
                <Textarea value={jobFormData.requirements} onChange={(e) => setJobFormData({...jobFormData, requirements: e.target.value})} rows={4} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsJobDialogOpen(false)}>إلغاء</Button>
              <Button onClick={handleSaveJob} className="bg-blue-600 hover:bg-blue-700">حفظ</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog إضافة/تعديل مرشح */}
        <Dialog open={isCandidateDialogOpen} onOpenChange={setIsCandidateDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedCandidate ? "تعديل المرشح" : "إضافة مرشح جديد"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>الاسم الكامل *</Label>
                  <Input value={candidateFormData.name} onChange={(e) => setCandidateFormData({...candidateFormData, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>البريد الإلكتروني *</Label>
                  <Input type="email" value={candidateFormData.email} onChange={(e) => setCandidateFormData({...candidateFormData, email: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>رقم الهاتف</Label>
                  <Input value={candidateFormData.phone} onChange={(e) => setCandidateFormData({...candidateFormData, phone: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>الوظيفة المطلوبة *</Label>
                  <Select value={candidateFormData.jobId} onValueChange={(value) => setCandidateFormData({...candidateFormData, jobId: value})}>
                    <SelectTrigger><SelectValue placeholder="اختر الوظيفة" /></SelectTrigger>
                    <SelectContent>
                      {jobPostings.filter((j: any) => j.status === "مفتوحة").map((job: any) => (
                        <SelectItem key={job.id} value={job.id.toString()}>{job.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>الخبرة</Label>
                  <Input value={candidateFormData.experience} onChange={(e) => setCandidateFormData({...candidateFormData, experience: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>التعليم</Label>
                  <Input value={candidateFormData.education} onChange={(e) => setCandidateFormData({...candidateFormData, education: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>المهارات</Label>
                <Textarea value={candidateFormData.skills} onChange={(e) => setCandidateFormData({...candidateFormData, skills: e.target.value})} rows={3} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCandidateDialogOpen(false)}>إلغاء</Button>
              <Button onClick={handleSaveCandidate} className="bg-blue-600 hover:bg-blue-700">حفظ</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog جدولة مقابلة */}
        <Dialog open={isInterviewDialogOpen} onOpenChange={setIsInterviewDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>جدولة مقابلة</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>المرشح *</Label>
                  <Select value={interviewFormData.candidateId} onValueChange={(value) => setInterviewFormData({...interviewFormData, candidateId: value})}>
                    <SelectTrigger><SelectValue placeholder="اختر المرشح" /></SelectTrigger>
                    <SelectContent>
                      {candidates.map((c: any) => (
                        <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>الوظيفة *</Label>
                  <Select value={interviewFormData.jobId} onValueChange={(value) => setInterviewFormData({...interviewFormData, jobId: value})}>
                    <SelectTrigger><SelectValue placeholder="اختر الوظيفة" /></SelectTrigger>
                    <SelectContent>
                      {jobPostings.map((job: any) => (
                        <SelectItem key={job.id} value={job.id.toString()}>{job.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>التاريخ *</Label>
                  <Input type="date" value={interviewFormData.date} onChange={(e) => setInterviewFormData({...interviewFormData, date: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>الوقت *</Label>
                  <Input type="time" value={interviewFormData.time} onChange={(e) => setInterviewFormData({...interviewFormData, time: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>نوع المقابلة</Label>
                  <Select value={interviewFormData.type} onValueChange={(value) => setInterviewFormData({...interviewFormData, type: value})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="شخصية">شخصية</SelectItem>
                      <SelectItem value="هاتفية">هاتفية</SelectItem>
                      <SelectItem value="فيديو">فيديو</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>المكان</Label>
                  <Input value={interviewFormData.location} onChange={(e) => setInterviewFormData({...interviewFormData, location: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>ملاحظات</Label>
                <Textarea value={interviewFormData.notes} onChange={(e) => setInterviewFormData({...interviewFormData, notes: e.target.value})} rows={3} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsInterviewDialogOpen(false)}>إلغاء</Button>
              <Button onClick={handleSaveInterview} className="bg-blue-600 hover:bg-blue-700">حفظ</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Recruitment;

