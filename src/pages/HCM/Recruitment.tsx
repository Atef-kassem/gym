import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { 
  UserPlus, 
  Search, 
  Filter, 
  Eye, 
  Calendar, 
  FileText,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  Plus,
  Edit,
  Trash2,
  Star,
  Download,
  Upload,
  AlertCircle,
  Target,
  Award,
  BarChart3,
  Send,
  Building2,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  Save,
  User,
  GraduationCap,
  Settings,
  Heart,
  X,
  Globe
} from "lucide-react";

const Recruitment = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // حالات الـ dialogs
  const [showJobRequisitionDialog, setShowJobRequisitionDialog] = useState(false);
  const [showApplicationDialog, setShowApplicationDialog] = useState(false);
  const [showRequisitionViewDialog, setShowRequisitionViewDialog] = useState(false);
  const [showRequisitionEditDialog, setShowRequisitionEditDialog] = useState(false);
  const [selectedRequisition, setSelectedRequisition] = useState(null);
  const [showJobViewDialog, setShowJobViewDialog] = useState(false);
  const [showJobEditDialog, setShowJobEditDialog] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showNewJobDialog, setShowNewJobDialog] = useState(false);
  const [showInterviewDialog, setShowInterviewDialog] = useState(false);
  const [showInterviewDetailsDialog, setShowInterviewDetailsDialog] = useState(false);
  const [showEditInterviewDialog, setShowEditInterviewDialog] = useState(false);
  const [showOfferDialog, setShowOfferDialog] = useState(false);
  const [showAssessmentDialog, setShowAssessmentDialog] = useState(false);
  const [showReportsDialog, setShowReportsDialog] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState("");
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [selectedInterview, setSelectedInterview] = useState<any>(null);
  
  // بيانات النماذج
  const [jobRequisition, setJobRequisition] = useState({
    requestId: "",
    department: "",
    position: "",
    justification: "",
    budget: "",
    urgency: "",
    requiredSkills: "",
    approvalStatus: "pending"
  });

  const [assessmentForm, setAssessmentForm] = useState({
    education: 0,
    experience: 0,
    language: 0,
    technical: 0,
    presence: 0,
    cultural: 0,
    motivation: 0,
    notes: ""
  });

  const [newJobForm, setNewJobForm] = useState({
    title: "",
    department: "",
    location: "",
    type: "دوام كامل",
    experience: "",
    salary: "",
    description: "",
    requirements: "",
    deadline: "",
    platforms: []
  });

  const [offerForm, setOfferForm] = useState({
    position: "",
    department: "",
    baseSalary: "",
    allowances: "",
    startDate: "",
    manager: "",
    details: ""
  });

  // إحصائيات لوحة التحكم
  const dashboardStats = [
    { title: "طلبات الاحتياج النشطة", value: "12", icon: FileText, color: "text-blue-600", bg: "bg-blue-50", trend: "+15%" },
    { title: "المتقدمين الجدد هذا الشهر", value: "186", icon: Users, color: "text-green-600", bg: "bg-green-50", trend: "+22%" },
    { title: "المقابلات المجدولة", value: "24", icon: Calendar, color: "text-orange-600", bg: "bg-orange-50", trend: "+8%" },
    { title: "العروض المقدمة", value: "8", icon: Award, color: "text-purple-600", bg: "bg-purple-50", trend: "+12%" },
    { title: "التعيينات المكتملة", value: "15", icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50", trend: "+25%" },
    { title: "متوسط وقت التوظيف", value: "18 يوم", icon: Clock, color: "text-red-600", bg: "bg-red-50", trend: "-3 أيام" },
  ];

  // بيانات طلبات الاحتياج الوظيفي
  const jobRequisitions = [
    { id: "REQ-001", department: "التشغيل", position: "فني صيانة", urgency: "عالية", status: "معتمد", budget: "6000", requestDate: "2024-01-15" },
    { id: "REQ-002", department: "الاستقبال", position: "مستقبل عملاء", urgency: "متوسطة", status: "قيد المراجعة", budget: "4500", requestDate: "2024-01-18" },
    { id: "REQ-003", department: "المالية", position: "محاسب أول", urgency: "منخفضة", status: "مسودة", budget: "8000", requestDate: "2024-01-20" },
  ];

  // بيانات الوظائف المنشورة
  const publishedJobs = [
    {
      id: "JOB-001",
      title: "فني صيانة سيارات",
      department: "التشغيل",
      location: "الرياض - الفرع الرئيسي",
      type: "دوام كامل",
      experience: "3-5 سنوات",
      salary: "5000-7000 جنيه",
      publishedDate: "2024-01-20",
      deadline: "2024-02-20",
      status: "نشط",
      applications: 25,
      views: 312,
      platforms: ["موقع الشركة", "بيت.كوم", "لينكد إن"],
      description: "نبحث عن فني صيانة سيارات ذو خبرة للانضمام لفريقنا المتميز",
      requirements: ["دبلوم في صيانة  الكافية", "خبرة لا تقل عن 3 سنوات", "إتقان اللغة الإنجليزية"]
    },
    {
      id: "JOB-002", 
      title: "مستقبل عملاء",
      department: "الاستقبال",
      location: "جدة - فرع الكورنيش",
      type: "دوام كامل",
      experience: "1-3 سنوات",
      salary: "3500-5000 جنيه",
      publishedDate: "2024-01-22",
      deadline: "2024-02-22",
      status: "نشط",
      applications: 18,
      views: 205,
      platforms: ["موقع الشركة", "تنقيب"],
      description: "مطلوب مستقبل عملاء للعمل في فرع جدة",
      requirements: ["بكالوريوس في أي تخصص", "مهارات تواصل ممتازة", "خبرة في خدمة العملاء"]
    },
    {
      id: "JOB-003",
      title: "محاسب أول",
      department: "المالية", 
      location: "الرياض - المكتب الإداري",
      type: "دوام كامل",
      experience: "5+ سنوات",
      salary: "7000-9000 جنيه",
      publishedDate: "2024-01-18",
      deadline: "2024-02-18",
      status: "مغلق",
      applications: 42,
      views: 568,
      platforms: ["موقع الشركة", "بيت.كوم", "لينكد إن", "تنقيب"],
      description: "مطلوب محاسب أول للإشراف على العمليات المحاسبية",
      requirements: ["بكالوريوس محاسبة", "شهادة CPA مفضلة", "خبرة في برامج ERP"]
    },
    {
      id: "JOB-004",
      title: "مدير علاقات عملاء",
      department: "التسويق",
      location: "الدمام - فرع الخليج",
      type: "دوام كامل", 
      experience: "4-6 سنوات",
      salary: "8000-10000 جنيه",
      publishedDate: "2024-01-25",
      deadline: "2024-02-25",
      status: "نشط",
      applications: 12,
      views: 156,
      platforms: ["موقع الشركة", "لينكد إن"],
      description: "نبحث عن مدير علاقات عملاء متميز لإدارة محفظة العملاء الكبار",
      requirements: ["ماجستير في التسويق أو إدارة الأعمال", "خبرة في إدارة العملاء", "مهارات قيادية متقدمة"]
    }
  ];

  // بيانات المتقدمين
  const applications = [
    { 
      id: "APP-001", 
      applicationNumber: "10001",
      name: "أحمد محمد العتيبي", 
      nationality: "مصري",
      idNumber: "1234567890",
      phone: "+966501234567",
      email: "ahmed@email.com",
      position: "فني صيانة سيارات", 
      status: "مقابلة مجدولة", 
      overallScore: 85,
      appliedDate: "2024-01-25",
      source: "موقع الشركة",
      education: "دبلوم",
      experience: "5 سنوات",
      interviewDate: "2024-02-01",
      documents: ["CV", "الهوية", "الشهادات"],
      assessmentScores: { education: 4, experience: 5, language: 3, technical: 4, presence: 4, cultural: 5, motivation: 5 }
    },
    { 
      id: "APP-002", 
      applicationNumber: "10002",
      name: "فاطمة علي الأحمدي", 
      nationality: "مصرية",
      idNumber: "1234567891",
      phone: "+966502345678",
      email: "fatima@email.com",
      position: "مستقبل عملاء", 
      status: "مقابلة مجدولة", 
      overallScore: 92,
      appliedDate: "2024-01-26",
      source: "بيت.كوم",
      education: "بكالوريوس",
      experience: "3 سنوات",
      interviewDate: "2024-02-03",
      documents: ["CV", "الهوية"],
      assessmentScores: { education: 5, experience: 4, language: 5, technical: 4, presence: 5, cultural: 4, motivation: 5 }
    },
    { 
      id: "APP-003", 
      applicationNumber: "10003",
      name: "خالد سعد الغامدي", 
      nationality: "مصري",
      idNumber: "1234567892",
      phone: "+966503456789",
      email: "khalid@email.com",
      position: "محاسب أول", 
      status: "مقابلة مجدولة", 
      overallScore: 88,
      appliedDate: "2024-01-27",
      source: "لينكد إن",
      education: "بكالوريوس محاسبة",
      experience: "7 سنوات",
      interviewDate: "2024-02-05",
      documents: ["CV", "الهوية", "الشهادات"],
      assessmentScores: { education: 5, experience: 5, language: 4, technical: 4, presence: 4, cultural: 4, motivation: 4 }
    },
  ];

  // بيانات المقابلات المجدولة
  const scheduledInterviews = [
    {
      id: "INT-001",
      candidateName: "أحمد محمد العتيبي",
      position: "فني صيانة سيارات",
      department: "التشغيل",
      date: "2024-02-01",
      time: "10:00 ص",
      interviewer: "م. سعد الأحمد",
      location: "قاعة الاجتماعات الرئيسية",
      type: "مقابلة فنية",
      status: "مؤكد",
      duration: "45 دقيقة",
      notes: "التركيز على الخبرة العملية"
    },
    {
      id: "INT-002",
      candidateName: "فاطمة علي الأحمدي",
      position: "مستقبل عملاء",
      department: "الاستقبال",
      date: "2024-02-03",
      time: "02:00 م",
      interviewer: "أ. منى السعد",
      location: "مكتب الموارد البشرية",
      type: "مقابلة عامة",
      status: "مؤكد",
      duration: "30 دقيقة",
      notes: "تقييم مهارات التواصل"
    },
    {
      id: "INT-003",
      candidateName: "خالد سعد الغامدي",
      position: "محاسب أول",
      department: "المالية",
      date: "2024-02-05",
      time: "11:30 ص",
      interviewer: "د. أحمد الراشد",
      location: "مكتب المدير المالي",
      type: "مقابلة تخصصية",
      status: "مؤكد",
      duration: "60 دقيقة",
      notes: "مراجعة الخبرة المحاسبية"
    },
  ];

  // معالجات الأحداث - مبسطة وتعمل بشكل مضمون
  const handleCreateRequisition = (e?: React.MouseEvent) => {
    e?.preventDefault();
    console.log("Creating job requisition...");
    
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setShowJobRequisitionDialog(false);
      
      // إعادة تعيين النموذج
      setJobRequisition({
        requestId: "",
        department: "",
        position: "",
        justification: "",
        budget: "",
        urgency: "",
        requiredSkills: "",
        approvalStatus: "pending"
      });
      
      toast({
        title: "تم إنشاء طلب الاحتياج بنجاح ✅",
        description: "تم إرسال الطلب للمراجعة والاعتماد",
      });
    }, 500);
  };

  const handleViewApplication = (e: React.MouseEvent, application: any) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("🔍 CLICKED VIEW APPLICATION BUTTON!");
    console.log("📄 Application data:", application);
    console.log("✅ Setting selected application...");
    
    setSelectedApplication(application);
    console.log("✅ Opening dialog...");
    setShowApplicationDialog(true);
    console.log("✅ Dialog state should be true now");
    
    toast({
      title: "عرض السيرة الذاتية",
      description: `تم فتح ملف ${application.name}`,
    });
    console.log("✅ Toast shown, function complete");
  };

  const handleScheduleInterview = (e: React.MouseEvent, application: any) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("📅 CLICKED SCHEDULE INTERVIEW BUTTON!");
    console.log("👤 Application:", application.name);
    
    setSelectedApplication(application);
    setShowInterviewDialog(true);
    console.log("✅ Interview dialog opened");
    
    toast({
      title: "جدولة مقابلة",
      description: `جدولة مقابلة مع ${application.name}`,
    });
  };

  const handleStartAssessment = (e: React.MouseEvent, application: any) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Starting assessment for:", application.name);
    setSelectedApplication(application);
    setAssessmentForm({
      education: 0,
      experience: 0,
      language: 0,
      technical: 0,
      presence: 0,
      cultural: 0,
      motivation: 0,
      notes: ""
    });
    setShowAssessmentDialog(true);
    toast({
      title: "بدء التقييم",
      description: `تقييم ${application.name}`,
    });
  };

  const handleMakeOffer = (e: React.MouseEvent, application: any) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Making offer for:", application.name);
    setSelectedApplication(application);
    setOfferForm({
      position: application.position,
      department: "غير محدد",
      baseSalary: "",
      allowances: "",
      startDate: "",
      manager: "",
      details: ""
    });
    setShowOfferDialog(true);
    toast({
      title: "إرسال عرض عمل",
      description: `إنشاء عرض عمل لـ ${application.name}`,
    });
  };

  const handleSaveAssessment = () => {
    if (assessmentForm.education === 0 || assessmentForm.experience === 0) {
      toast({
        title: "تقييم ناقص ❌",
        description: "يرجى تعبئة جميع نقاط التقييم",
        variant: "destructive"
      });
      return;
    }
    
    setShowAssessmentDialog(false);
    toast({
      title: "تم حفظ التقييم بنجاح ✅",
      description: `تم تسجيل تقييم ${selectedApplication?.name}`,
    });
  };

  const handleSendOffer = () => {
    if (!offerForm.baseSalary || !offerForm.startDate) {
      toast({
        title: "بيانات ناقصة ❌",
        description: "يرجى تعبئة الراتب وتاريخ البدء",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowOfferDialog(false);
      toast({
        title: "تم إرسال العرض بنجاح ✅",
        description: `تم إرسال عرض العمل إلى ${selectedApplication?.name}`,
      });
    }, 1500);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "جديد": { color: "bg-blue-100 text-blue-800" },
      "مقابلة مجدولة": { color: "bg-orange-100 text-orange-800" },
      "تحت التقييم": { color: "bg-yellow-100 text-yellow-800" },
      "مقبول": { color: "bg-green-100 text-green-800" },
      "مرفوض": { color: "bg-red-100 text-red-800" },
      "عرض مقدم": { color: "bg-purple-100 text-purple-800" },
      "معتمد": { color: "bg-green-100 text-green-800" },
      "قيد المراجعة": { color: "bg-orange-100 text-orange-800" },
      "مسودة": { color: "bg-gray-100 text-gray-800" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig["جديد"];
    return <Badge className={config.color}>{status}</Badge>;
  };

  const getUrgencyBadge = (urgency: string) => {
    const urgencyConfig = {
      "عالية": { color: "bg-red-100 text-red-800" },
      "متوسطة": { color: "bg-orange-100 text-orange-800" },
      "منخفضة": { color: "bg-green-100 text-green-800" },
    };
    
    const config = urgencyConfig[urgency as keyof typeof urgencyConfig] || urgencyConfig["متوسطة"];
    return <Badge className={config.color}>{urgency}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">نظام التوظيف الذكي</h1>
            <p className="text-slate-600 mt-2">إدارة دورة التوظيف الكاملة من الاحتياج إلى التعيين</p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              onClick={() => {
                console.log("Main create button clicked!");
                setShowJobRequisitionDialog(true);
                toast({
                  title: "إنشاء طلب احتياج",
                  description: "فتح نموذج طلب احتياج وظيفي جديد",
                });
              }}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-4 h-4 mr-2" />
              طلب احتياج وظيفي
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard">لوحة التحكم</TabsTrigger>
            <TabsTrigger value="requisitions">طلبات الاحتياج</TabsTrigger>
            <TabsTrigger value="applications">بنك المتقدمين</TabsTrigger>
            <TabsTrigger value="jobs">الوظائف المنشورة</TabsTrigger>
            <TabsTrigger value="interviews">المقابلات</TabsTrigger>
            <TabsTrigger value="reports">التقارير</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="mt-6 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardStats.map((stat, index) => (
                <Card 
                  key={index} 
                  className="group border-0 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer animate-fade-in bg-gradient-to-br from-white to-slate-50/30 backdrop-blur-sm"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-600 group-hover:text-slate-800 transition-colors duration-300">{stat.title}</p>
                        <p className="text-2xl font-bold text-slate-900 mt-2 group-hover:scale-110 transition-transform duration-300">{stat.value}</p>
                        <p className="text-xs text-green-600 mt-1">{stat.trend}</p>
                      </div>
                      <div className={`p-3 rounded-xl ${stat.bg} group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                        <stat.icon className={`h-6 w-6 ${stat.color} group-hover:animate-pulse`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>الإجراءات السريعة</CardTitle>
                <CardDescription>الوظائف المطلوبة بشكل متكرر</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button 
                    onClick={() => {
                      console.log("Quick create requisition clicked!");
                      setShowJobRequisitionDialog(true);
                      toast({
                        title: "إنشاء طلب احتياج سريع",
                        description: "فتح نموذج طلب احتياج جديد",
                      });
                    }}
                    variant="outline" 
                    className="h-20 flex-col"
                  >
                    <Plus className="w-6 h-6 mb-2" />
                    طلب احتياج
                  </Button>
                  <Button 
                    onClick={() => {
                      setActiveTab("applications");
                      toast({
                        title: "بنك المتقدمين",
                        description: "عرض جميع المتقدمين",
                      });
                    }}
                    variant="outline" 
                    className="h-20 flex-col"
                  >
                    <Users className="w-6 h-6 mb-2" />
                    بنك المتقدمين
                  </Button>
                  <Button 
                    onClick={() => {
                      setActiveTab("interviews");
                      toast({
                        title: "المقابلات المجدولة",
                        description: "عرض المقابلات المجدولة",
                      });
                    }}
                    variant="outline" 
                    className="h-20 flex-col"
                  >
                    <Calendar className="w-6 h-6 mb-2" />
                    المقابلات
                  </Button>
                  <Button 
                    onClick={() => {
                      setActiveTab("reports");
                      toast({
                        title: "التقارير",
                        description: "عرض تقارير التوظيف",
                      });
                    }}
                    variant="outline" 
                    className="h-20 flex-col"
                  >
                    <BarChart3 className="w-6 h-6 mb-2" />
                    التقارير
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Job Requisitions Tab */}
          <TabsContent value="requisitions" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>طلبات الاحتياج الوظيفي</CardTitle>
                    <CardDescription>إدارة ومتابعة طلبات الاحتياج من الأقسام</CardDescription>
                  </div>
                  <Button onClick={() => {
                    console.log("Tab create button clicked!");
                    setShowJobRequisitionDialog(true);
                    toast({
                      title: "إنشاء طلب احتياج",
                      description: "فتح نموذج طلب احتياج وظيفي جديد",
                    });
                  }}>
                    <Plus className="w-4 h-4 mr-2" />
                    طلب احتياج جديد
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>رقم الطلب</TableHead>
                      <TableHead>القسم</TableHead>
                      <TableHead>المسمى الوظيفي</TableHead>
                      <TableHead>الأولوية</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>الميزانية</TableHead>
                      <TableHead>تاريخ الطلب</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {jobRequisitions.map((req) => (
                      <TableRow key={req.id}>
                        <TableCell className="font-medium">{req.id}</TableCell>
                        <TableCell>{req.department}</TableCell>
                        <TableCell>{req.position}</TableCell>
                        <TableCell>{getUrgencyBadge(req.urgency)}</TableCell>
                        <TableCell>{getStatusBadge(req.status)}</TableCell>
                        <TableCell>{req.budget} جنيه</TableCell>
                        <TableCell>{req.requestDate}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={(e) => {
                                console.log("🚀🚀🚀 PREVIEW BUTTON CLICKED!");
                                e.preventDefault();
                                e.stopPropagation();
                                setSelectedRequisition(req);
                                setShowRequisitionViewDialog(true);
                                toast({
                                  title: "معاينة طلب الاحتياج",
                                  description: `عرض تفاصيل طلب رقم ${req.id}`,
                                });
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={(e) => {
                                console.log("🚀🚀🚀 EDIT BUTTON CLICKED!");
                                e.preventDefault();
                                e.stopPropagation();
                                setSelectedRequisition(req);
                                setShowRequisitionEditDialog(true);
                                toast({
                                  title: "تعديل طلب الاحتياج",
                                  description: `فتح نموذج تعديل الطلب رقم ${req.id}`,
                                });
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>بنك المتقدمين</CardTitle>
                    <CardDescription>إدارة ومتابعة المتقدمين للوظائف ({applications.length} متقدم)</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      تصدير
                    </Button>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      تصفية
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>رقم الطلب</TableHead>
                      <TableHead>اسم المتقدم</TableHead>
                      <TableHead>المسمى الوظيفي</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>التقييم العام</TableHead>
                      <TableHead>تاريخ التقديم</TableHead>
                      <TableHead>مصدر التقديم</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map((application) => (
                      <TableRow key={application.id}>
                        <TableCell className="font-medium">{application.applicationNumber}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{application.name}</div>
                            <div className="text-sm text-gray-500">{application.nationality}</div>
                          </div>
                        </TableCell>
                        <TableCell>{application.position}</TableCell>
                        <TableCell>{getStatusBadge(application.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{application.overallScore}%</span>
                            <Progress value={application.overallScore} className="w-16 h-2" />
                          </div>
                        </TableCell>
                        <TableCell>{application.appliedDate}</TableCell>
                        <TableCell>{application.source}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={(e) => {
                                console.log("🔍 VIEW BUTTON CLICKED FOR:", application.name);
                                handleViewApplication(e, application);
                              }}
                              className="text-blue-600 border-blue-300 hover:bg-blue-50 hover:border-blue-400"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              معاينة
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={(e) => {
                                console.log("📅 INTERVIEW BUTTON CLICKED FOR:", application.name);
                                handleScheduleInterview(e, application);
                              }}
                              className="text-green-600 border-green-300 hover:bg-green-50 hover:border-green-400"
                            >
                              <Calendar className="w-4 h-4 mr-1" />
                              مقابلة
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={(e) => {
                                console.log("⭐ ASSESSMENT BUTTON CLICKED FOR:", application.name);
                                handleStartAssessment(e, application);
                              }}
                              className="text-purple-600 border-purple-300 hover:bg-purple-50 hover:border-purple-400"
                            >
                              <Star className="w-4 h-4 mr-1" />
                              تقييم
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={(e) => {
                                console.log("🏆 OFFER BUTTON CLICKED FOR:", application.name);
                                handleMakeOffer(e, application);
                              }}
                              className="text-orange-600 border-orange-300 hover:bg-orange-50 hover:border-orange-400"
                            >
                              <Award className="w-4 h-4 mr-1" />
                              عرض
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Jobs Tab */}
          <TabsContent value="jobs" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>الوظائف المنشورة</CardTitle>
                    <CardDescription>إدارة الوظائف المنشورة على المواقع والمنصات ({publishedJobs.length} وظيفة)</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      تصدير
                    </Button>
                    <Button onClick={() => {
                      console.log("➕ إنشاء وظيفة جديدة");
                      setShowNewJobDialog(true);
                      toast({
                        title: "إنشاء وظيفة جديدة",
                        description: "فتح نموذج نشر وظيفة جديدة",
                      });
                    }}>
                      <Plus className="w-4 h-4 mr-2" />
                      نشر وظيفة جديدة
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {publishedJobs.map((job) => (
                    <Card key={job.id} className="border-l-4 border-l-primary">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h3 className="text-lg font-semibold">{job.title}</h3>
                              <Badge variant={job.status === "نشط" ? "default" : "secondary"}>
                                {job.status}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Building2 className="w-4 h-4" />
                                <span>{job.department}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="w-4 h-4" />
                                <span>{job.location}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                <span>{job.type}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <DollarSign className="w-4 h-4" />
                                <span>{job.salary}</span>
                              </div>
                            </div>

                            <p className="text-sm text-muted-foreground mb-4">{job.description}</p>

                            <div className="flex flex-wrap gap-2 mb-4">
                              {job.platforms.map((platform) => (
                                <Badge key={platform} variant="outline" className="text-xs">
                                  {platform}
                                </Badge>
                              ))}
                            </div>

                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="font-medium text-muted-foreground">التقديمات:</span>
                                <span className="ml-2 text-primary font-semibold">{job.applications}</span>
                              </div>
                              <div>
                                <span className="font-medium text-muted-foreground">المشاهدات:</span>
                                <span className="ml-2">{job.views}</span>
                              </div>
                              <div>
                                <span className="font-medium text-muted-foreground">ينتهي في:</span>
                                <span className="ml-2">{job.deadline}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2 ml-4">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                console.log("🔍 معاينة الوظيفة:", job.title);
                                setSelectedJob(job);
                                setShowJobViewDialog(true);
                                toast({
                                  title: "معاينة الوظيفة",
                                  description: `عرض تفاصيل وظيفة ${job.title}`,
                                });
                              }}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              معاينة
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                console.log("✏️ تعديل الوظيفة:", job.title);
                                setSelectedJob(job);
                                setShowJobEditDialog(true);
                                toast({
                                  title: "تعديل الوظيفة",
                                  description: `فتح نموذج تعديل وظيفة ${job.title}`,
                                });
                              }}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              تعديل
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-600 border-red-300 hover:bg-red-50"
                              onClick={() => {
                                console.log("⏹️ إيقاف الوظيفة:", job.title);
                                toast({
                                  title: "إيقاف نشر الوظيفة",
                                  description: `تم إيقاف نشر وظيفة ${job.title}`,
                                });
                              }}
                            >
                              <X className="w-4 h-4 mr-2" />
                              إيقاف
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

          {/* Interviews Tab */}
          <TabsContent value="interviews" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>إدارة المقابلات</CardTitle>
                    <CardDescription>جدولة ومتابعة المقابلات ({scheduledInterviews.length} مقابلة مجدولة)</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      تصدير الجدولة
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => {
                        setShowInterviewDialog(true);
                        toast({
                          title: "جدولة مقابلة جديدة",
                          description: "فتح نموذج جدولة مقابلة",
                        });
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      جدولة مقابلة
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scheduledInterviews.map((interview) => (
                    <Card key={interview.id} className="hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-50 rounded-xl">
                              <Calendar className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">{interview.candidateName}</h3>
                              <p className="text-gray-600 mb-1">{interview.position} - {interview.department}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {interview.date}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {interview.time}
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {interview.location}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-700">{interview.interviewer}</p>
                              <p className="text-xs text-gray-500">{interview.type}</p>
                              <div className="mt-2">
                                {interview.status === "مؤكد" ? (
                                  <Badge className="bg-green-100 text-green-800">مؤكد</Badge>
                                ) : (
                                  <Badge className="bg-orange-100 text-orange-800">{interview.status}</Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  setSelectedInterview(interview);
                                  setShowInterviewDetailsDialog(true);
                                  toast({
                                    title: "تفاصيل المقابلة",
                                    description: `عرض تفاصيل مقابلة ${interview.candidateName}`,
                                  });
                                }}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                التفاصيل
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  setSelectedInterview(interview);
                                  setShowEditInterviewDialog(true);
                                  toast({
                                    title: "تعديل المقابلة",
                                    description: `تعديل موعد مقابلة ${interview.candidateName}`,
                                  });
                                }}
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                تعديل
                              </Button>
                            </div>
                          </div>
                        </div>
                        {interview.notes && (
                          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">
                              <strong>ملاحظات:</strong> {interview.notes}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => {
                  setSelectedReportType("efficiency");
                  setShowReportsDialog(true);
                  toast({
                    title: "تقرير كفاءة التوظيف 📊",
                    description: "جاري تحضير التقرير...",
                  });
                }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <BarChart3 className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">تقرير كفاءة التوظيف</h3>
                      <p className="text-sm text-gray-500">معدلات النجاح والأوقات</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => {
                  setSelectedReportType("sources");
                  setShowReportsDialog(true);
                  toast({
                    title: "تحليل مصادر التوظيف 📈",
                    description: "جاري تحليل أداء قنوات الاستقطاب...",
                  });
                }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">تحليل مصادر التوظيف</h3>
                      <p className="text-sm text-gray-500">أداء قنوات الاستقطاب</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => {
                  setSelectedReportType("quality");
                  setShowReportsDialog(true);
                  toast({
                    title: "تقرير جودة المرشحين 🎯",
                    description: "جاري تحليل نتائج التقييمات...",
                  });
                }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">تقرير جودة المرشحين</h3>
                      <p className="text-sm text-gray-500">نتائج التقييمات والاختبارات</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Job Requisition Dialog */}
        <Dialog open={showJobRequisitionDialog} onOpenChange={setShowJobRequisitionDialog}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>طلب احتياج وظيفي جديد</DialogTitle>
              <DialogDescription>
                إنشاء طلب احتياج وظيفي جديد للمراجعة والاعتماد من الإدارة العليا
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">القسم الطالب</Label>
                  <Select 
                    value={jobRequisition.department} 
                    onValueChange={(value) => setJobRequisition({...jobRequisition, department: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر القسم" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="operations">التشغيل</SelectItem>
                      <SelectItem value="reception">الاستقبال</SelectItem>
                      <SelectItem value="finance">المالية</SelectItem>
                      <SelectItem value="hr">الموارد البشرية</SelectItem>
                      <SelectItem value="maintenance">الصيانة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">المسمى الوظيفي</Label>
                  <Input
                    id="position"
                    value={jobRequisition.position}
                    onChange={(e) => setJobRequisition({...jobRequisition, position: e.target.value})}
                    placeholder="مثال: فني صيانة أول"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budget">الميزانية المخصصة (شهريًا)</Label>
                  <Input
                    id="budget"
                    value={jobRequisition.budget}
                    onChange={(e) => setJobRequisition({...jobRequisition, budget: e.target.value})}
                    placeholder="5000"
                    type="number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="urgency">مستوى الأولوية</Label>
                  <Select 
                    value={jobRequisition.urgency} 
                    onValueChange={(value) => setJobRequisition({...jobRequisition, urgency: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الأولوية" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">عالية - خلال أسبوع</SelectItem>
                      <SelectItem value="medium">متوسطة - خلال شهر</SelectItem>
                      <SelectItem value="low">منخفضة - خلال 3 أشهر</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="justification">مبرر الاحتياج</Label>
                <Textarea
                  id="justification"
                  value={jobRequisition.justification}
                  onChange={(e) => setJobRequisition({...jobRequisition, justification: e.target.value})}
                  placeholder="اذكر أسباب الحاجة لهذه الوظيفة..."
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="requiredSkills">المهارات المطلوبة</Label>
                <Textarea
                  id="requiredSkills"
                  value={jobRequisition.requiredSkills}
                  onChange={(e) => setJobRequisition({...jobRequisition, requiredSkills: e.target.value})}
                  placeholder="اذكر المهارات والمؤهلات المطلوبة..."
                  rows={4}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowJobRequisitionDialog(false)}>
                إلغاء
              </Button>
              <Button onClick={handleCreateRequisition} disabled={isLoading || !jobRequisition.position}>
                {isLoading && <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />}
                إرسال للاعتماد
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Application Details Dialog */}
        <Dialog open={showApplicationDialog} onOpenChange={setShowApplicationDialog}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>تفاصيل المتقدم</DialogTitle>
              <DialogDescription>
                معلومات شاملة عن {selectedApplication?.name}
              </DialogDescription>
            </DialogHeader>
            
            {selectedApplication && (
              <div className="grid gap-6 py-4">
                <div className="grid grid-cols-2 gap-6">
                  {/* معلومات شخصية */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">المعلومات الشخصية</h3>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">الاسم الكامل</Label>
                        <p className="text-sm">{selectedApplication.name}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">الجنسية</Label>
                        <p className="text-sm">{selectedApplication.nationality}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">رقم الهوية</Label>
                        <p className="text-sm">{selectedApplication.idNumber}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">الهاتف</Label>
                        <p className="text-sm">{selectedApplication.phone}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">البريد الإلكتروني</Label>
                        <p className="text-sm">{selectedApplication.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* معلومات الوظيفة */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">معلومات الوظيفة</h3>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">المسمى الوظيفي</Label>
                        <p className="text-sm">{selectedApplication.position}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">المؤهل العلمي</Label>
                        <p className="text-sm">{selectedApplication.education}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">سنوات الخبرة</Label>
                        <p className="text-sm">{selectedApplication.experience}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">مصدر التقديم</Label>
                        <p className="text-sm">{selectedApplication.source}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">تاريخ التقديم</Label>
                        <p className="text-sm">{selectedApplication.appliedDate}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* الوثائق المرفقة */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">الوثائق المرفقة</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedApplication.documents?.map((doc: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-sm">
                        {doc}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowApplicationDialog(false)}>
                إغلاق
              </Button>
              <Button onClick={(e) => {
                setShowApplicationDialog(false);
                handleScheduleInterview(e, selectedApplication);
              }}>
                <Calendar className="w-4 h-4 mr-2" />
                جدولة مقابلة
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Interview Scheduling Dialog */}
        <Dialog open={showInterviewDialog} onOpenChange={setShowInterviewDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>جدولة مقابلة</DialogTitle>
              <DialogDescription>
                تحديد موعد ووقت المقابلة مع {selectedApplication?.name}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="interview-date">تاريخ المقابلة</Label>
                  <Input
                    id="interview-date"
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interview-time">وقت المقابلة</Label>
                  <Input
                    id="interview-time"
                    type="time"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="interview-type">نوع المقابلة</Label>
                  <Select defaultValue="in-person">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in-person">حضورية</SelectItem>
                      <SelectItem value="online">عبر الإنترنت</SelectItem>
                      <SelectItem value="phone">هاتفية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interviewer">المحاور</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المحاور" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hr-manager">مدير الموارد البشرية</SelectItem>
                      <SelectItem value="dept-manager">مدير القسم</SelectItem>
                      <SelectItem value="technical-lead">المختص التقني</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">مكان المقابلة / رابط الاجتماع</Label>
                <Input
                  id="location"
                  placeholder="مكتب الموارد البشرية - الدور الأول"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">ملاحظات إضافية</Label>
                <Textarea
                  id="notes"
                  placeholder="أي تعليمات أو ملاحظات خاصة بالمقابلة..."
                  rows={3}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowInterviewDialog(false)}>
                إلغاء
              </Button>
              <Button onClick={() => {
                setShowInterviewDialog(false);
                toast({
                  title: "تم جدولة المقابلة بنجاح ✅",
                  description: `تم إرسال دعوة المقابلة إلى ${selectedApplication?.name}`,
                });
              }}>
                <Send className="w-4 h-4 mr-2" />
                إرسال دعوة المقابلة
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Assessment Dialog */}
        <Dialog open={showAssessmentDialog} onOpenChange={setShowAssessmentDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">نموذج تقييم المرشح</DialogTitle>
              <DialogDescription>
                تقييم شامل لـ {selectedApplication?.name} - {selectedApplication?.position}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              {/* معلومات المرشح */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="w-5 h-5" />
                    معلومات المرشح
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-muted-foreground">الاسم:</span>
                      <span className="ml-2">{selectedApplication?.name}</span>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">المنصب:</span>
                      <span className="ml-2">{selectedApplication?.position}</span>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">الخبرة:</span>
                      <span className="ml-2">{selectedApplication?.experience}</span>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">التعليم:</span>
                      <span className="ml-2">{selectedApplication?.education}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* المؤهلات الأساسية */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    المؤهلات الأساسية
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { key: 'education', label: 'المؤهل العلمي', description: 'مدى ملائمة المؤهل العلمي للوظيفة' },
                    { key: 'experience', label: 'الخبرة العملية', description: 'جودة وصلة الخبرات السابقة' }
                  ].map((criteria) => (
                    <div key={criteria.key} className="p-4 bg-muted/30 rounded-lg">
                      <div className="mb-3">
                        <Label className="text-sm font-semibold">{criteria.label}</Label>
                        <p className="text-xs text-muted-foreground mt-1">{criteria.description}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <Button
                              key={rating}
                              variant={Number(assessmentForm[criteria.key as keyof typeof assessmentForm]) >= rating ? "default" : "outline"}
                              size="sm"
                              className="w-10 h-10 rounded-full"
                              onClick={() => setAssessmentForm({
                                ...assessmentForm,
                                [criteria.key]: rating
                              })}
                            >
                              {rating}
                            </Button>
                          ))}
                        </div>
                        <div className="text-sm font-medium">
                          <span className="text-primary">
                            {Number(assessmentForm[criteria.key as keyof typeof assessmentForm]) || 0}
                          </span>
                          <span className="text-muted-foreground">/5</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* المهارات التقنية والتواصل */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    المهارات التقنية والتواصل
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { key: 'language', label: 'اللغة والتواصل', description: 'مهارات التواصل والتعبير' },
                    { key: 'technical', label: 'الكفاءة الفنية', description: 'المعرفة التقنية والمهارات المطلوبة' }
                  ].map((criteria) => (
                    <div key={criteria.key} className="p-4 bg-muted/30 rounded-lg">
                      <div className="mb-3">
                        <Label className="text-sm font-semibold">{criteria.label}</Label>
                        <p className="text-xs text-muted-foreground mt-1">{criteria.description}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <Button
                              key={rating}
                              variant={Number(assessmentForm[criteria.key as keyof typeof assessmentForm]) >= rating ? "default" : "outline"}
                              size="sm"
                              className="w-10 h-10 rounded-full"
                              onClick={() => setAssessmentForm({
                                ...assessmentForm,
                                [criteria.key]: rating
                              })}
                            >
                              {rating}
                            </Button>
                          ))}
                        </div>
                        <div className="text-sm font-medium">
                          <span className="text-primary">
                            {Number(assessmentForm[criteria.key as keyof typeof assessmentForm]) || 0}
                          </span>
                          <span className="text-muted-foreground">/5</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* السمات الشخصية */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    السمات الشخصية والثقافية
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { key: 'presence', label: 'الحضور والثقة', description: 'الانطباع العام ومستوى الثقة' },
                    { key: 'cultural', label: 'الملائمة الثقافية', description: 'التوافق مع بيئة وثقافة العمل' },
                    { key: 'motivation', label: 'الدافعية والرغبة', description: 'مستوى الحماس والرغبة في العمل' }
                  ].map((criteria) => (
                    <div key={criteria.key} className="p-4 bg-muted/30 rounded-lg">
                      <div className="mb-3">
                        <Label className="text-sm font-semibold">{criteria.label}</Label>
                        <p className="text-xs text-muted-foreground mt-1">{criteria.description}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <Button
                              key={rating}
                              variant={Number(assessmentForm[criteria.key as keyof typeof assessmentForm]) >= rating ? "default" : "outline"}
                              size="sm"
                              className="w-10 h-10 rounded-full"
                              onClick={() => setAssessmentForm({
                                ...assessmentForm,
                                [criteria.key]: rating
                              })}
                            >
                              {rating}
                            </Button>
                          ))}
                        </div>
                        <div className="text-sm font-medium">
                          <span className="text-primary">
                            {Number(assessmentForm[criteria.key as keyof typeof assessmentForm]) || 0}
                          </span>
                          <span className="text-muted-foreground">/5</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* ملاحظات إضافية */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    ملاحظات وتعليقات
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={assessmentForm.notes}
                    onChange={(e) => setAssessmentForm({...assessmentForm, notes: e.target.value})}
                    placeholder="أي ملاحظات أو تعليقات خاصة بالتقييم..."
                    rows={4}
                    className="resize-none"
                  />
                </CardContent>
              </Card>

              {/* ملخص التقييم */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    ملخص التقييم
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-primary/10 rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {Math.round(
                          (Number(assessmentForm.education) + 
                           Number(assessmentForm.experience) + 
                           Number(assessmentForm.language) + 
                           Number(assessmentForm.technical) + 
                           Number(assessmentForm.presence) + 
                           Number(assessmentForm.cultural) + 
                           Number(assessmentForm.motivation)) / 7 * 10
                        ) / 10}
                      </div>
                      <div className="text-sm text-muted-foreground">المعدل العام</div>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold">
                        {Number(assessmentForm.education) + 
                         Number(assessmentForm.experience) + 
                         Number(assessmentForm.language) + 
                         Number(assessmentForm.technical) + 
                         Number(assessmentForm.presence) + 
                         Number(assessmentForm.cultural) + 
                         Number(assessmentForm.motivation)}
                      </div>
                      <div className="text-sm text-muted-foreground">مجموع النقاط / 35</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setShowAssessmentDialog(false)}>
                إلغاء
              </Button>
              <Button onClick={handleSaveAssessment} className="bg-primary">
                <Star className="w-4 h-4 mr-2" />
                حفظ التقييم
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Job Offer Dialog */}
        <Dialog open={showOfferDialog} onOpenChange={setShowOfferDialog}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>إنشاء عرض عمل</DialogTitle>
              <DialogDescription>
                إعداد عرض عمل رسمي لـ {selectedApplication?.name}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="offer-position">المسمى الوظيفي</Label>
                  <Input
                    id="offer-position"
                    value={offerForm.position}
                    onChange={(e) => setOfferForm({...offerForm, position: e.target.value})}
                    placeholder="المسمى الوظيفي"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="offer-department">القسم</Label>
                  <Select value={offerForm.department} onValueChange={(value) => setOfferForm({...offerForm, department: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر القسم" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="operations">التشغيل</SelectItem>
                      <SelectItem value="reception">الاستقبال</SelectItem>
                      <SelectItem value="finance">المالية</SelectItem>
                      <SelectItem value="hr">الموارد البشرية</SelectItem>
                      <SelectItem value="maintenance">الصيانة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="base-salary">الراتب الأساسي (شهريًا)</Label>
                  <Input
                    id="base-salary"
                    value={offerForm.baseSalary}
                    onChange={(e) => setOfferForm({...offerForm, baseSalary: e.target.value})}
                    placeholder="5000"
                    type="number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="allowances">البدلات والمزايا</Label>
                  <Input
                    id="allowances"
                    value={offerForm.allowances}
                    onChange={(e) => setOfferForm({...offerForm, allowances: e.target.value})}
                    placeholder="بدل مواصلات، تأمين طبي..."
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">تاريخ بدء العمل</Label>
                  <Input
                    id="start-date"
                    value={offerForm.startDate}
                    onChange={(e) => setOfferForm({...offerForm, startDate: e.target.value})}
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manager">المدير المباشر</Label>
                  <Input
                    id="manager"
                    value={offerForm.manager}
                    onChange={(e) => setOfferForm({...offerForm, manager: e.target.value})}
                    placeholder="اسم المدير المباشر"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="offer-details">تفاصيل إضافية</Label>
                <Textarea
                  id="offer-details"
                  value={offerForm.details}
                  onChange={(e) => setOfferForm({...offerForm, details: e.target.value})}
                  placeholder="أي تفاصيل إضافية عن العرض، المهام، أو شروط العمل..."
                  rows={4}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowOfferDialog(false)}>
                إلغاء
              </Button>
              <Button onClick={handleSendOffer} disabled={isLoading || !offerForm.position || !offerForm.baseSalary}>
                {isLoading && <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />}
                <Send className="w-4 h-4 mr-2" />
                إرسال العرض
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog معاينة طلب الاحتياج */}
        <Dialog open={showRequisitionViewDialog} onOpenChange={setShowRequisitionViewDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>معاينة طلب الاحتياج الوظيفي</DialogTitle>
              <DialogDescription>
                تفاصيل طلب الاحتياج رقم {selectedRequisition?.id}
              </DialogDescription>
            </DialogHeader>
            
            {selectedRequisition && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">رقم الطلب</Label>
                    <p className="text-sm">{selectedRequisition.id}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">القسم</Label>
                    <p className="text-sm">{selectedRequisition.department}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">المنصب</Label>
                    <p className="text-sm">{selectedRequisition.position}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">الأولوية</Label>
                    <p className="text-sm">{selectedRequisition.urgency}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">الحالة</Label>
                    <p className="text-sm">{selectedRequisition.status}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">الميزانية</Label>
                    <p className="text-sm">{selectedRequisition.budget} جنيه</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">تاريخ الطلب</Label>
                    <p className="text-sm">{selectedRequisition.requestDate}</p>
                  </div>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowRequisitionViewDialog(false)}>
                إغلاق
              </Button>
              <Button onClick={() => {
                setShowRequisitionViewDialog(false);
                setShowRequisitionEditDialog(true);
              }}>
                <Edit className="w-4 h-4 mr-2" />
                تعديل
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog تعديل طلب الاحتياج */}
        <Dialog open={showRequisitionEditDialog} onOpenChange={setShowRequisitionEditDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>تعديل طلب الاحتياج الوظيفي</DialogTitle>
              <DialogDescription>
                تعديل تفاصيل طلب الاحتياج رقم {selectedRequisition?.id}
              </DialogDescription>
            </DialogHeader>
            
            {selectedRequisition && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-department">القسم</Label>
                    <Input
                      id="edit-department"
                      defaultValue={selectedRequisition.department}
                      placeholder="اسم القسم"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-position">المنصب</Label>
                    <Input
                      id="edit-position"
                      defaultValue={selectedRequisition.position}
                      placeholder="المنصب المطلوب"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-urgency">الأولوية</Label>
                    <Select defaultValue={selectedRequisition.urgency}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الأولوية" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="عالية">عالية</SelectItem>
                        <SelectItem value="متوسطة">متوسطة</SelectItem>
                        <SelectItem value="منخفضة">منخفضة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-budget">الميزانية</Label>
                    <Input
                      id="edit-budget"
                      defaultValue={selectedRequisition.budget}
                      placeholder="الميزانية بالجنيه"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-justification">مبرر الطلب</Label>
                  <Textarea
                    id="edit-justification"
                    placeholder="اكتب مبررات طلب التوظيف..."
                    rows={3}
                  />
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowRequisitionEditDialog(false)}>
                إلغاء
              </Button>
              <Button onClick={() => {
                setShowRequisitionEditDialog(false);
                toast({
                  title: "تم حفظ التعديلات",
                  description: "تم تحديث طلب الاحتياج بنجاح",
                });
              }}>
                <Save className="w-4 h-4 mr-2" />
                حفظ التعديلات
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog معاينة الوظيفة */}
        <Dialog open={showJobViewDialog} onOpenChange={setShowJobViewDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">معاينة الوظيفة المنشورة</DialogTitle>
              <DialogDescription>
                تفاصيل شاملة لوظيفة {selectedJob?.title}
              </DialogDescription>
            </DialogHeader>
            
            {selectedJob && (
              <div className="space-y-6 py-4">
                {/* ج.م الوظيفة */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">{selectedJob.title}</CardTitle>
                        <p className="text-muted-foreground">{selectedJob.department} - {selectedJob.location}</p>
                      </div>
                      <Badge variant={selectedJob.status === "نشط" ? "default" : "secondary"} className="text-sm px-3 py-1">
                        {selectedJob.status}
                      </Badge>
                    </div>
                  </CardHeader>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* المعلومات الأساسية */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Building2 className="w-5 h-5" />
                        المعلومات الأساسية
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 gap-3">
                        <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                          <span className="font-medium text-muted-foreground">نوع الدوام:</span>
                          <span className="font-semibold">{selectedJob.type}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                          <span className="font-medium text-muted-foreground">سنوات الخبرة:</span>
                          <span className="font-semibold">{selectedJob.experience}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                          <span className="font-medium text-muted-foreground">الراتب:</span>
                          <span className="font-semibold text-primary">{selectedJob.salary}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                          <span className="font-medium text-muted-foreground">تاريخ النشر:</span>
                          <span className="font-semibold">{selectedJob.publishedDate}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                          <span className="font-medium text-muted-foreground">ينتهي في:</span>
                          <span className="font-semibold">{selectedJob.deadline}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* الإحصائيات */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        إحصائيات الأداء
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/20">
                          <div className="text-3xl font-bold text-primary">{selectedJob.applications}</div>
                          <div className="text-sm text-muted-foreground">متقدم للوظيفة</div>
                        </div>
                        <div className="text-center p-4 bg-muted/30 rounded-lg">
                          <div className="text-3xl font-bold">{selectedJob.views}</div>
                          <div className="text-sm text-muted-foreground">مشاهدة للإعلان</div>
                        </div>
                        <div className="text-center p-4 bg-muted/30 rounded-lg">
                          <div className="text-3xl font-bold">{selectedJob.platforms?.length || 0}</div>
                          <div className="text-sm text-muted-foreground">منصة نشر</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* وصف الوظيفة */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      وصف الوظيفة
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <p className="text-sm leading-relaxed">{selectedJob.description}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* المتطلبات */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      متطلبات الوظيفة
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedJob.requirements?.map((req, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                          <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center mt-0.5">
                            <div className="w-2 h-2 bg-primary rounded-full" />
                          </div>
                          <span className="text-sm flex-1">{req}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* منصات النشر */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Globe className="w-5 h-5" />
                      منصات النشر
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      {selectedJob.platforms?.map((platform) => (
                        <div key={platform} className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          <span className="text-sm font-medium">{platform}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowJobViewDialog(false)}>
                إغلاق
              </Button>
              <Button onClick={() => {
                setShowJobViewDialog(false);
                setShowJobEditDialog(true);
              }}>
                <Edit className="w-4 h-4 mr-2" />
                تعديل
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog تعديل الوظيفة */}
        <Dialog open={showJobEditDialog} onOpenChange={setShowJobEditDialog}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>تعديل الوظيفة المنشورة</DialogTitle>
              <DialogDescription>
                تعديل تفاصيل وظيفة {selectedJob?.title}
              </DialogDescription>
            </DialogHeader>
            
            {selectedJob && (
              <div className="space-y-6">
                {/* معلومات أساسية */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">المعلومات الأساسية</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-job-title">المسمى الوظيفي</Label>
                        <Input
                          id="edit-job-title"
                          defaultValue={selectedJob.title}
                          placeholder="المسمى الوظيفي"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-job-department">القسم</Label>
                        <Select defaultValue={selectedJob.department}>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر القسم" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="التشغيل">التشغيل</SelectItem>
                            <SelectItem value="الاستقبال">الاستقبال</SelectItem>
                            <SelectItem value="المالية">المالية</SelectItem>
                            <SelectItem value="التسويق">التسويق</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-job-location">الموقع</Label>
                        <Input
                          id="edit-job-location"
                          defaultValue={selectedJob.location}
                          placeholder="موقع العمل"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-job-salary">الراتب</Label>
                        <Input
                          id="edit-job-salary"
                          defaultValue={selectedJob.salary}
                          placeholder="نطاق الراتب"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* وصف الوظيفة */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">وصف الوظيفة</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      defaultValue={selectedJob.description}
                      placeholder="وصف مفصل للوظيفة والمهام المطلوبة..."
                      rows={4}
                      className="resize-none"
                    />
                  </CardContent>
                </Card>

                {/* المتطلبات */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">متطلبات الوظيفة</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      defaultValue={selectedJob.requirements?.join('\n')}
                      placeholder="اكتب كل متطلب في سطر منفصل..."
                      rows={5}
                      className="resize-none"
                    />
                  </CardContent>
                </Card>

                {/* تواريخ مهمة */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">التواريخ المهمة</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-job-deadline">تاريخ انتهاء التقديم</Label>
                        <Input
                          id="edit-job-deadline"
                          type="date"
                          defaultValue={selectedJob.deadline}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-job-status">حالة الوظيفة</Label>
                        <Select defaultValue={selectedJob.status}>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر الحالة" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="نشط">نشط</SelectItem>
                            <SelectItem value="مغلق">مغلق</SelectItem>
                            <SelectItem value="مؤقت">متوقف مؤقتاً</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setShowJobEditDialog(false)}>
                إلغاء
              </Button>
              <Button onClick={() => {
                setShowJobEditDialog(false);
                toast({
                  title: "تم حفظ التعديلات",
                  description: "تم تحديث تفاصيل الوظيفة بنجاح",
                });
              }}>
                <Save className="w-4 h-4 mr-2" />
                حفظ التعديلات
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog إنشاء وظيفة جديدة */}
        <Dialog open={showNewJobDialog} onOpenChange={setShowNewJobDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">نشر وظيفة جديدة</DialogTitle>
              <DialogDescription>
                إنشاء إعلان وظيفي جديد ونشره على المنصات المحددة
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              {/* المعلومات الأساسية */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    المعلومات الأساسية
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-job-title">المسمى الوظيفي *</Label>
                      <Input
                        id="new-job-title"
                        value={newJobForm.title}
                        onChange={(e) => setNewJobForm({...newJobForm, title: e.target.value})}
                        placeholder="مثال: فني صيانة سيارات"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-job-department">القسم *</Label>
                      <Select 
                        value={newJobForm.department} 
                        onValueChange={(value) => setNewJobForm({...newJobForm, department: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر القسم" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="التشغيل">التشغيل</SelectItem>
                          <SelectItem value="الاستقبال">الاستقبال</SelectItem>
                          <SelectItem value="المالية">المالية</SelectItem>
                          <SelectItem value="التسويق">التسويق</SelectItem>
                          <SelectItem value="الموارد البشرية">الموارد البشرية</SelectItem>
                          <SelectItem value="تقنية المعلومات">تقنية المعلومات</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-job-location">الموقع *</Label>
                      <Input
                        id="new-job-location"
                        value={newJobForm.location}
                        onChange={(e) => setNewJobForm({...newJobForm, location: e.target.value})}
                        placeholder="مثال: الرياض - الفرع الرئيسي"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-job-type">نوع الدوام *</Label>
                      <Select 
                        value={newJobForm.type} 
                        onValueChange={(value) => setNewJobForm({...newJobForm, type: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="دوام كامل">دوام كامل</SelectItem>
                          <SelectItem value="دوام جزئي">دوام جزئي</SelectItem>
                          <SelectItem value="مؤقت">مؤقت</SelectItem>
                          <SelectItem value="تدريب">تدريب</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-job-experience">سنوات الخبرة *</Label>
                      <Input
                        id="new-job-experience"
                        value={newJobForm.experience}
                        onChange={(e) => setNewJobForm({...newJobForm, experience: e.target.value})}
                        placeholder="مثال: 3-5 سنوات"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-job-salary">نطاق الراتب *</Label>
                      <Input
                        id="new-job-salary"
                        value={newJobForm.salary}
                        onChange={(e) => setNewJobForm({...newJobForm, salary: e.target.value})}
                        placeholder="مثال: 5000-7000 جنيه"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* وصف الوظيفة */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    وصف الوظيفة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="new-job-description">الوصف التفصيلي *</Label>
                    <Textarea
                      id="new-job-description"
                      value={newJobForm.description}
                      onChange={(e) => setNewJobForm({...newJobForm, description: e.target.value})}
                      placeholder="اكتب وصفاً شاملاً للوظيفة والمهام والمسؤوليات المطلوبة..."
                      rows={5}
                      className="resize-none"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* متطلبات الوظيفة */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    متطلبات الوظيفة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="new-job-requirements">المتطلبات والمؤهلات *</Label>
                    <Textarea
                      id="new-job-requirements"
                      value={newJobForm.requirements}
                      onChange={(e) => setNewJobForm({...newJobForm, requirements: e.target.value})}
                      placeholder="اكتب كل متطلب في سطر منفصل:&#10;- بكالوريوس في التخصص المطلوب&#10;- خبرة لا تقل عن 3 سنوات&#10;- إتقان اللغة الإنجليزية"
                      rows={6}
                      className="resize-none"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* إعدادات النشر */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    إعدادات النشر
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-job-deadline">تاريخ انتهاء التقديم *</Label>
                    <Input
                      id="new-job-deadline"
                      type="date"
                      value={newJobForm.deadline}
                      onChange={(e) => setNewJobForm({...newJobForm, deadline: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label>منصات النشر *</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        "موقع الشركة",
                        "بيت.كوم",
                        "لينكد إن",
                        "تنقيب",
                        "مهارات",
                        "وظائف.كوم"
                      ].map((platform) => (
                        <div key={platform} className="flex items-center space-x-2 space-x-reverse">
                          <input
                            type="checkbox"
                            id={platform}
                            className="rounded border-gray-300"
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewJobForm({
                                  ...newJobForm, 
                                  platforms: [...newJobForm.platforms, platform]
                                });
                              } else {
                                setNewJobForm({
                                  ...newJobForm,
                                  platforms: newJobForm.platforms.filter(p => p !== platform)
                                });
                              }
                            }}
                          />
                          <Label htmlFor={platform} className="text-sm cursor-pointer">
                            {platform}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setShowNewJobDialog(false)}>
                إلغاء
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  console.log("💾 حفظ كمسودة");
                  toast({
                    title: "تم حفظ المسودة",
                    description: "تم حفظ الوظيفة كمسودة بنجاح",
                  });
                }}
              >
                <Save className="w-4 h-4 mr-2" />
                حفظ كمسودة
              </Button>
              <Button 
                onClick={() => {
                  if (!newJobForm.title || !newJobForm.department || !newJobForm.description) {
                    toast({
                      title: "بيانات ناقصة ❌",
                      description: "يرجى تعبئة جميع الحقول المطلوبة",
                    });
                    return;
                  }
                  
                  setShowNewJobDialog(false);
                  setNewJobForm({
                    title: "",
                    department: "",
                    location: "",
                    type: "دوام كامل",
                    experience: "",
                    salary: "",
                    description: "",
                    requirements: "",
                    deadline: "",
                    platforms: []
                  });
                  
                  toast({
                    title: "تم نشر الوظيفة بنجاح ✅",
                    description: "تم نشر الوظيفة على المنصات المحددة",
                  });
                }}
                disabled={!newJobForm.title || !newJobForm.department || !newJobForm.description}
              >
                <Send className="w-4 h-4 mr-2" />
                نشر الوظيفة
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Interview Details Dialog */}
        <Dialog open={showInterviewDetailsDialog} onOpenChange={setShowInterviewDetailsDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>تفاصيل المقابلة</DialogTitle>
              <DialogDescription>
                عرض تفاصيل مقابلة {selectedInterview?.candidateName}
              </DialogDescription>
            </DialogHeader>
            
            {selectedInterview && (
              <div className="space-y-6 py-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="w-5 h-5" />
                      معلومات المرشح
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="font-medium text-muted-foreground">الاسم:</span>
                        <span className="ml-2">{selectedInterview.candidateName}</span>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">المنصب:</span>
                        <span className="ml-2">{selectedInterview.position}</span>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">القسم:</span>
                        <span className="ml-2">{selectedInterview.department}</span>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">المقابل:</span>
                        <span className="ml-2">{selectedInterview.interviewer}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      تفاصيل المقابلة
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="font-medium text-muted-foreground">التاريخ:</span>
                        <span className="ml-2">{selectedInterview.date}</span>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">الوقت:</span>
                        <span className="ml-2">{selectedInterview.time}</span>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">المكان:</span>
                        <span className="ml-2">{selectedInterview.location}</span>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">نوع المقابلة:</span>
                        <span className="ml-2">{selectedInterview.type}</span>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">الحالة:</span>
                        <span className="ml-2">
                          {selectedInterview.status === "مؤكد" ? (
                            <Badge className="bg-green-100 text-green-800">مؤكد</Badge>
                          ) : (
                            <Badge className="bg-orange-100 text-orange-800">{selectedInterview.status}</Badge>
                          )}
                        </span>
                      </div>
                    </div>
                    {selectedInterview.notes && (
                      <div className="mt-4 p-3 bg-muted rounded-lg">
                        <p className="text-sm">
                          <strong>ملاحظات:</strong> {selectedInterview.notes}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowInterviewDetailsDialog(false)}>
                إغلاق
              </Button>
              <Button onClick={() => {
                setShowInterviewDetailsDialog(false);
                setShowEditInterviewDialog(true);
              }}>
                <Edit className="w-4 h-4 mr-2" />
                تعديل المقابلة
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Interview Dialog */}
        <Dialog open={showEditInterviewDialog} onOpenChange={setShowEditInterviewDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>تعديل المقابلة</DialogTitle>
              <DialogDescription>
                تعديل موعد وتفاصيل مقابلة {selectedInterview?.candidateName}
              </DialogDescription>
            </DialogHeader>
            
            {selectedInterview && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-date">التاريخ</Label>
                    <Input
                      id="edit-date"
                      type="date"
                      defaultValue={selectedInterview.date}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-time">الوقت</Label>
                    <Input
                      id="edit-time"
                      type="time"
                      defaultValue={selectedInterview.time}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-location">المكان</Label>
                    <Input
                      id="edit-location"
                      defaultValue={selectedInterview.location}
                      placeholder="قاعة الاجتماعات الرئيسية"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-interviewer">المقابل</Label>
                    <Select defaultValue={selectedInterview.interviewer}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المقابل" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="أحمد السعيد">أحمد السعيد</SelectItem>
                        <SelectItem value="فاطمة الزهراني">فاطمة الزهراني</SelectItem>
                        <SelectItem value="محمد الأحمدي">محمد الأحمدي</SelectItem>
                        <SelectItem value="سارة العتيبي">سارة العتيبي</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-type">نوع المقابلة</Label>
                    <Select defaultValue={selectedInterview.type}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر نوع المقابلة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="مقابلة تقنية">مقابلة تقنية</SelectItem>
                        <SelectItem value="مقابلة شخصية">مقابلة شخصية</SelectItem>
                        <SelectItem value="مقابلة نهائية">مقابلة نهائية</SelectItem>
                        <SelectItem value="مقابلة جماعية">مقابلة جماعية</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-status">الحالة</Label>
                    <Select defaultValue={selectedInterview.status}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الحالة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="مؤكد">مؤكد</SelectItem>
                        <SelectItem value="مؤجل">مؤجل</SelectItem>
                        <SelectItem value="ملغي">ملغي</SelectItem>
                        <SelectItem value="مكتمل">مكتمل</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-notes">ملاحظات</Label>
                  <Textarea
                    id="edit-notes"
                    defaultValue={selectedInterview.notes}
                    placeholder="أي ملاحظات إضافية..."
                    rows={3}
                  />
                </div>
              </div>
            )}
            
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setShowEditInterviewDialog(false)}>
                إلغاء
              </Button>
              <Button onClick={() => {
                setShowEditInterviewDialog(false);
                toast({
                  title: "تم تحديث المقابلة بنجاح ✅",
                  description: `تم تحديث موعد مقابلة ${selectedInterview?.candidateName}`,
                });
              }}>
                <Save className="w-4 h-4 mr-2" />
                حفظ التغييرات
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reports Dialog */}
        <Dialog open={showReportsDialog} onOpenChange={setShowReportsDialog}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedReportType === "efficiency" && "تقرير كفاءة التوظيف"}
                {selectedReportType === "sources" && "تحليل مصادر التوظيف"}
                {selectedReportType === "quality" && "تقرير جودة المرشحين"}
              </DialogTitle>
              <DialogDescription>
                {selectedReportType === "efficiency" && "تحليل شامل لمعدلات النجاح وأوقات التوظيف"}
                {selectedReportType === "sources" && "تحليل أداء قنوات الاستقطاب المختلفة"}
                {selectedReportType === "quality" && "تقييم شامل لجودة المرشحين ونتائج التقييمات"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Efficiency Report */}
              {selectedReportType === "efficiency" && (
                <div className="space-y-6">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">18</div>
                          <div className="text-sm text-muted-foreground">متوسط أيام التوظيف</div>
                          <div className="text-xs text-green-600">-3 يوم عن الشهر الماضي</div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">85%</div>
                          <div className="text-sm text-muted-foreground">معدل نجاح التوظيف</div>
                          <div className="text-xs text-green-600">+12% عن الشهر الماضي</div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-600">24</div>
                          <div className="text-sm text-muted-foreground">مقابلات مجدولة</div>
                          <div className="text-xs text-orange-600">+8% عن الشهر الماضي</div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">15</div>
                          <div className="text-sm text-muted-foreground">تعيينات مكتملة</div>
                          <div className="text-xs text-green-600">+25% عن الشهر الماضي</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Monthly Progress */}
                  <Card>
                    <CardHeader>
                      <CardTitle>تقدم التوظيف الشهري</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>طلبات الاحتياج المرسلة</span>
                          <span className="font-bold">12 / 15</span>
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{width: '80%'}}></div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>المقابلات المكتملة</span>
                          <span className="font-bold">24 / 30</span>
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div className="bg-green-600 h-2 rounded-full" style={{width: '80%'}}></div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>العروض المقدمة</span>
                          <span className="font-bold">8 / 12</span>
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div className="bg-orange-600 h-2 rounded-full" style={{width: '67%'}}></div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>التعيينات المؤكدة</span>
                          <span className="font-bold">15 / 20</span>
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div className="bg-purple-600 h-2 rounded-full" style={{width: '75%'}}></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Sources Report */}
              {selectedReportType === "sources" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>أداء قنوات الاستقطاب</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Globe className="w-5 h-5 text-blue-600" />
                              <span>موقع الشركة</span>
                            </div>
                            <div className="text-right">
                              <div className="font-bold">45%</div>
                              <div className="text-sm text-muted-foreground">84 متقدم</div>
                            </div>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Users className="w-5 h-5 text-green-600" />
                              <span>لينكد إن</span>
                            </div>
                            <div className="text-right">
                              <div className="font-bold">28%</div>
                              <div className="text-sm text-muted-foreground">52 متقدم</div>
                            </div>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Building2 className="w-5 h-5 text-orange-600" />
                              <span>مكاتب التوظيف</span>
                            </div>
                            <div className="text-right">
                              <div className="font-bold">15%</div>
                              <div className="text-sm text-muted-foreground">28 متقدم</div>
                            </div>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <User className="w-5 h-5 text-purple-600" />
                              <span>الترشيحات الداخلية</span>
                            </div>
                            <div className="text-right">
                              <div className="font-bold">12%</div>
                              <div className="text-sm text-muted-foreground">22 متقدم</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>معدل التحويل حسب المصدر</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-2">
                              <span>موقع الشركة</span>
                              <span>22%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-600 h-2 rounded-full" style={{width: '22%'}}></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between mb-2">
                              <span>لينكد إن</span>
                              <span>18%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-green-600 h-2 rounded-full" style={{width: '18%'}}></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between mb-2">
                              <span>مكاتب التوظيف</span>
                              <span>32%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-orange-600 h-2 rounded-full" style={{width: '32%'}}></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between mb-2">
                              <span>الترشيحات الداخلية</span>
                              <span>45%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-purple-600 h-2 rounded-full" style={{width: '45%'}}></div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* Quality Report */}
              {selectedReportType === "quality" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>متوسط درجات التقييم</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span>المؤهل العلمي</span>
                            <span className="font-bold">4.2/5</span>
                          </div>
                          <div className="flex justify-between">
                            <span>الخبرة العملية</span>
                            <span className="font-bold">3.8/5</span>
                          </div>
                          <div className="flex justify-between">
                            <span>المهارات التقنية</span>
                            <span className="font-bold">3.9/5</span>
                          </div>
                          <div className="flex justify-between">
                            <span>التواصل</span>
                            <span className="font-bold">4.1/5</span>
                          </div>
                          <div className="flex justify-between">
                            <span>السمات الشخصية</span>
                            <span className="font-bold">4.0/5</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>توزيع المرشحين</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span>ممتاز (4.5-5)</span>
                            <Badge className="bg-green-100 text-green-800">25%</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>جيد جداً (4-4.4)</span>
                            <Badge className="bg-blue-100 text-blue-800">35%</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>جيد (3.5-3.9)</span>
                            <Badge className="bg-orange-100 text-orange-800">28%</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>مقبول (3-3.4)</span>
                            <Badge className="bg-yellow-100 text-yellow-800">10%</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>ضعيف (أقل من 3)</span>
                            <Badge className="bg-red-100 text-red-800">2%</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>المناصب الأكثر طلباً</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span>فني صيانة</span>
                            <span className="font-bold">45 متقدم</span>
                          </div>
                          <div className="flex justify-between">
                            <span>موظف استقبال</span>
                            <span className="font-bold">38 متقدم</span>
                          </div>
                          <div className="flex justify-between">
                            <span>محاسب</span>
                            <span className="font-bold">28 متقدم</span>
                          </div>
                          <div className="flex justify-between">
                            <span>مشرف تشغيل</span>
                            <span className="font-bold">22 متقدم</span>
                          </div>
                          <div className="flex justify-between">
                            <span>مساعد إداري</span>
                            <span className="font-bold">18 متقدم</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setShowReportsDialog(false)}>
                إغلاق
              </Button>
              <Button onClick={() => {
                toast({
                  title: "تم تصدير التقرير ✅",
                  description: "تم تصدير التقرير بصيغة PDF بنجاح",
                });
              }}>
                <Download className="w-4 h-4 mr-2" />
                تصدير PDF
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Recruitment;