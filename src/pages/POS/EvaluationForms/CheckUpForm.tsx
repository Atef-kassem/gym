import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { 
  ClipboardCheck, 
  Star, 
  ArrowLeft, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  User,
  Car,
  CreditCard,
  MessageSquare,
  Send,
  Save,
  FileText,
  Signature,
  Info,
  Eye,
  Play,
  MoreHorizontal,
  ChevronRight,
  Timer,
  Receipt,
  Phone,
  Banknote,
  Wrench,
  Award,
  Sparkles,
  Calendar,
  Users
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CheckUpForm {
  // أمر العمل المختار
  selectedWorkOrder: any;
  
  // البيانات الأساسية
  invoiceNumber: string;
  plateNumber: string;
  carType: string;
  customerName: string;
  customerPhone: string;
  servicePath: string;
  paymentStatus: string;
  
  // بيانات الموظفين
  employees: string[];
  supervisor: string;
  
  // التقييم العام
  overallRating: string;
  ratingNotes: string;
  
  // تقييم جودة الأجزاء
  partEvaluations: {
    glass: string;
    interior: string;
    tires: string;
    tiresLining: string;
    exterior: string;
    engine: string;
  };
  
  // معلومات إضافية
  additionalNotes: string;
  customerSignature: boolean;
  photosUploaded: string[];
  checkupTime: string;
  estimatedDuration: number;
}

const employees = [
  "محمد أحمد",
  "علي محمد", 
  "فهد الخالد",
  "سارة محمد",
  "نورا علي",
  "عبدالله الزهراني",
  "أمل الشهري",
  "خالد الأحمد",
  "فاطمة السليم",
  "عمر البدري"
];

const servicePaths = [
  { id: "quick-wash", name: "مسار ال  السريع", duration: 30, color: "bg-blue-500", icon: "⚡" },
  { id: "full-wash", name: "مسار ال  الشامل", duration: 60, color: "bg-purple-500", icon: "🧽" },
  { id: "vip", name: "مسار VIP", duration: 90, color: "bg-amber-500", icon: "👑" },
  { id: "maintenance", name: "مسار الصيانة", duration: 120, color: "bg-green-500", icon: "🔧" },
  { id: "detailing", name: "مسار التفصيل الكامل", duration: 180, color: "bg-red-500", icon: "✨" }
];

const serviceAreas = [
  { key: "glass", label: "زجاج المشروب", icon: "🪟", color: "text-blue-600" },
  { key: "interior", label: "الديكور الداخلي", icon: "🪑", color: "text-amber-600" },
  { key: "tires", label: "الكفرات", icon: "🛞", color: "text-gray-600" },
  { key: "tiresLining", label: "بطانة الكفرات", icon: "⚫", color: "text-slate-600" },
  { key: "exterior", label: "الهيكل الخارجي", icon: "🚗", color: "text-green-600" },
  { key: "engine", label: "المحرك", icon: "⚙️", color: "text-red-600" }
];

const ratings = [
  { value: "excellent", label: "ممتاز", color: "text-green-600", bgColor: "bg-green-50 border-green-200 hover:bg-green-100", icon: "⭐⭐⭐⭐⭐" },
  { value: "good", label: "جيد", color: "text-blue-600", bgColor: "bg-blue-50 border-blue-200 hover:bg-blue-100", icon: "⭐⭐⭐⭐" },
  { value: "acceptable", label: "مقبول", color: "text-yellow-600", bgColor: "bg-yellow-50 border-yellow-200 hover:bg-yellow-100", icon: "⭐⭐⭐" },
  { value: "poor", label: "سيئ", color: "text-red-600", bgColor: "bg-red-50 border-red-200 hover:bg-red-100", icon: "⭐⭐" },
  { value: "very-poor", label: "سيئ جداً", color: "text-red-800", bgColor: "bg-red-100 border-red-300 hover:bg-red-150", icon: "⭐" }
];

// بيانات وهمية محسنة لأوامر العمل المنتهية
const completedWorkOrders = [
  {
    id: "WO-2024-001",
    invoiceNumber: "INV-2024-001",
    plateNumber: "أ ب ج 1234",
    carType: "كامري 2023",
    customerName: "أحمد محمد علي",
    customerPhone: "0501234567",
    servicePath: "vip",
    paymentStatus: "paid",
    completedAt: "2024-01-15T14:30:00",
    assignedEmployees: ["محمد أحمد", "علي محمد"],
    totalAmount: 350,
    services: ["  شامل", "تلميع", "تنظيف المحرك"],
    priority: "high",
    waitingTime: "5 دقائق"
  },
  {
    id: "WO-2024-002",
    invoiceNumber: "INV-2024-002",
    plateNumber: "د هـ و 5678",
    carType: "أكورد 2022",
    customerName: "فاطمة أحمد السالم",
    customerPhone: "0509876543",
    servicePath: "full-wash",
    paymentStatus: "paid",
    completedAt: "2024-01-15T15:45:00",
    assignedEmployees: ["فهد الخالد", "سارة محمد"],
    totalAmount: 180,
    services: ["  كامل", "تنظيف داخلي"],
    priority: "medium",
    waitingTime: "2 دقيقة"
  },
  {
    id: "WO-2024-003",
    invoiceNumber: "INV-2024-003",
    plateNumber: "ز ح ط 9876",
    carType: "لاندكروزر 2024",
    customerName: "خالد عبدالله الأحمد",
    customerPhone: "0551112233",
    servicePath: "quick-wash",
    paymentStatus: "unpaid",
    completedAt: "2024-01-15T16:20:00",
    assignedEmployees: ["نورا علي"],
    totalAmount: 85,
    services: ["  سريع"],
    priority: "low",
    waitingTime: "15 دقيقة"
  },
  {
    id: "WO-2024-004",
    invoiceNumber: "INV-2024-004",
    plateNumber: "م ن س 4567",
    carType: "بي ام دبليو X5",
    customerName: "منى سعد الحربي",
    customerPhone: "0544445555",
    servicePath: "detailing",
    paymentStatus: "partial",
    completedAt: "2024-01-15T17:10:00",
    assignedEmployees: ["عبدالله الزهراني", "أمل الشهري", "خالد الأحمد"],
    totalAmount: 650,
    services: ["تفصيل كامل", "حماية الطلاء", "تنظيف المحرك"],
    priority: "high",
    waitingTime: "1 دقيقة"
  }
];

export default function CheckUpForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [checkUpForm, setCheckUpForm] = useState<CheckUpForm>({
    // أمر العمل المختار
    selectedWorkOrder: null,
    
    // البيانات الأساسية
    invoiceNumber: "",
    plateNumber: "",
    carType: "",
    customerName: "",
    customerPhone: "",
    servicePath: "",
    paymentStatus: "",
    
    // بيانات الموظفين
    employees: [],
    supervisor: "المشرف الحالي",
    
    // التقييم العام
    overallRating: "",
    ratingNotes: "",
    
    // تقييم جودة الأجزاء
    partEvaluations: {
      glass: "",
      interior: "",
      tires: "",
      tiresLining: "",
      exterior: "",
      engine: ""
    },
    
    // معلومات إضافية
    additionalNotes: "",
    customerSignature: false,
    photosUploaded: [],
    checkupTime: new Date().toISOString(),
    estimatedDuration: 30
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedWorkOrderDetails, setSelectedWorkOrderDetails] = useState<any>(null);
  const totalSteps = 6;

  // تحديث الإعدادات التلقائية
  useEffect(() => {
    const selectedPath = servicePaths.find(path => path.id === checkUpForm.servicePath);
    if (selectedPath) {
      setCheckUpForm(prev => ({ ...prev, estimatedDuration: selectedPath.duration }));
    }
  }, [checkUpForm.servicePath]);

  // وظيفة اختيار أمر العمل وتعبئة البيانات تلقائياً
  const selectWorkOrder = (workOrder: any) => {
    setCheckUpForm(prev => ({
      ...prev,
      selectedWorkOrder: workOrder,
      invoiceNumber: workOrder.invoiceNumber,
      plateNumber: workOrder.plateNumber,
      carType: workOrder.carType,
      customerName: workOrder.customerName,
      customerPhone: workOrder.customerPhone,
      servicePath: workOrder.servicePath,
      paymentStatus: workOrder.paymentStatus,
      employees: workOrder.assignedEmployees,
      estimatedDuration: servicePaths.find(p => p.id === workOrder.servicePath)?.duration || 30
    }));
    
    toast({
      title: "✅ تم اختيار أمر العمل",
      description: `تم تحديد أمر العمل ${workOrder.invoiceNumber} وتعبئة البيانات تلقائياً`,
      duration: 3000
    });
    
    // انتقال سلس للخطوة التالية مع تأخير قصير للتأثير البصري
    setTimeout(() => {
      setCurrentStep(1);
    }, 500);
  };

  const viewWorkOrderDetails = (workOrder: any) => {
    setSelectedWorkOrderDetails(workOrder);
  };

  const handleFormChange = (field: string, value: any) => {
    if (field.startsWith('partEvaluations.')) {
      const partKey = field.split('.')[1];
      setCheckUpForm(prev => ({
        ...prev,
        partEvaluations: { ...prev.partEvaluations, [partKey]: value }
      }));
    } else if (field === 'employees') {
      setCheckUpForm(prev => ({ ...prev, employees: value }));
    } else {
      setCheckUpForm(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmitCheckUp = async () => {
    // التحقق من الحقول المطلوبة
    if (!checkUpForm.invoiceNumber || !checkUpForm.overallRating) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة (رقم الايصال والتقييم العام)",
        variant: "destructive"
      });
      return;
    }

    // التحقق من إلزامية الملاحظات للتقييمات السلبية
    if ((checkUpForm.overallRating === "acceptable" || checkUpForm.overallRating === "poor" || checkUpForm.overallRating === "very-poor") && !checkUpForm.ratingNotes) {
      toast({
        title: "ملاحظة مطلوبة",
        description: "يجب كتابة ملاحظة مفصلة عند اختيار تقييم مقبول أو سيئ لتحسين الخدمة",
        variant: "destructive"
      });
      return;
    }

    // التحقق من وجود موظفين مكلفين
    if (checkUpForm.employees.length === 0) {
      toast({
        title: "موظف مطلوب",
        description: "يجب اختيار موظف واحد على الأقل المسؤول عن الخدمة",
        variant: "destructive"
      });
      return;
    }

    try {
      // عرض تأثير التحميل
      toast({
        title: "⏳ جار حفظ التقييم...",
        description: "يتم معالجة البيانات وتنفيذ الإجراءات التلقائية",
        duration: 2000
      });

      // محاكاة الحفظ في قاعدة البيانات
      await new Promise(resolve => setTimeout(resolve, 2000));

      // تنفيذ الإجراءات الذكية
      const actions = [];
      
      // إرسال رسالة للعميل
      if (checkUpForm.customerPhone) {
        actions.push("تم إرسال رسالة تأكيد للعميل");
      }
      
      // إخفاء المشروب من شاشة الانتظار
      actions.push("تم إخفاء المشروب من شاشة الانتظار");
      
      // تسجيل في سجل الأداء
      actions.push("تم تسجيل التقييم في سجل أداء الموظفين");
      
      // تنبيه الإدارة للتقييمات السلبية
      if (checkUpForm.overallRating === "poor" || checkUpForm.overallRating === "very-poor") {
        actions.push("تم إرسال تنبيه للإدارة للمراجعة الفورية");
      }

      toast({
        title: "🎉 تم حفظ التقييم بنجاح",
        description: actions.join(" • "),
        duration: 5000
      });

      // إعادة تعيين النموذج
      resetForm();
      
    } catch (error) {
      toast({
        title: "خطأ في الحفظ",
        description: "حدث خطأ أثناء حفظ البيانات. يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setCheckUpForm({
      selectedWorkOrder: null,
      invoiceNumber: "",
      plateNumber: "",
      carType: "",
      customerName: "",
      customerPhone: "",
      servicePath: "",
      paymentStatus: "",
      employees: [],
      supervisor: "المشرف الحالي",
      overallRating: "",
      ratingNotes: "",
      partEvaluations: {
        glass: "",
        interior: "",
        tires: "",
        tiresLining: "",
        exterior: "",
        engine: ""
      },
      additionalNotes: "",
      customerSignature: false,
      photosUploaded: [],
      checkupTime: new Date().toISOString(),
      estimatedDuration: 30
    });
    setCurrentStep(0);
  };

  const getCompletionPercentage = () => {
    if (currentStep === 0) return 0;
    
    const requiredFields = [
      checkUpForm.selectedWorkOrder,
      checkUpForm.invoiceNumber,
      checkUpForm.plateNumber,
      checkUpForm.customerName,
      checkUpForm.servicePath,
      checkUpForm.overallRating,
      checkUpForm.employees.length > 0
    ];
    const completedFields = requiredFields.filter(Boolean).length;
    return Math.round((completedFields / requiredFields.length) * 100);
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 0: return checkUpForm.selectedWorkOrder !== null;
      case 1: return checkUpForm.invoiceNumber && checkUpForm.plateNumber && checkUpForm.customerName;
      case 2: return checkUpForm.servicePath && checkUpForm.paymentStatus;
      case 3: return checkUpForm.employees.length > 0;
      case 4: return checkUpForm.overallRating && (
        checkUpForm.overallRating === "excellent" || 
        checkUpForm.overallRating === "good" || 
        checkUpForm.ratingNotes
      );
      default: return true;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return '🔥';
      case 'medium': return '⚠️';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto p-4 space-y-6">
        {/* Header with Enhanced Design */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-cyan-600/10 animate-gradient-x"></div>
          <Card className="relative border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate("/pos/evaluation-management")}
                  className="hover:scale-105 transition-all duration-200 hover:shadow-md"
                >
                  <ArrowLeft className="h-4 w-4 ml-2" />
                  العودة
                </Button>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        نموذج فحص وتقييم الخدمة
                      </h1>
                      <p className="text-muted-foreground text-lg">نموذج شامل متقدم لتقييم جودة الخدمة ورضا العميل</p>
                    </div>
                    {currentStep > 0 && (
                      <div className="text-right animate-fade-in">
                        <div className="text-sm text-muted-foreground">اكتمال النموذج</div>
                        <div className="text-3xl font-bold text-primary animate-pulse">{getCompletionPercentage()}%</div>
                      </div>
                    )}
                  </div>
                  
                  {/* Enhanced Progress Steps */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border">
                    <div className="flex items-center justify-between">
                      {[0, 1, 2, 3, 4, 5].map((step) => (
                        <div key={step} className="flex items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                            step === currentStep ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-110" :
                            step < currentStep ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md" :
                            "bg-slate-200 text-slate-500"
                          }`}>
                            {step < currentStep ? <CheckCircle className="h-5 w-5" /> : step + 1}
                          </div>
                          {step < 5 && (
                            <div className={`flex-1 h-2 mx-3 rounded-full transition-all duration-500 ${
                              step < currentStep ? "bg-gradient-to-r from-green-400 to-emerald-400" : "bg-slate-200"
                            }`} />
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-between text-xs text-muted-foreground mt-3 font-medium">
                      <span>اختيار أمر العمل</span>
                      <span>البيانات الأساسية</span>
                      <span>بيانات الخدمة</span>
                      <span>الموظفين</span>
                      <span>التقييم</span>
                      <span>المراجعة النهائية</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Form Content with Enhanced Design */}
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <ClipboardCheck className="h-6 w-6 text-blue-600" />
              </div>
              {currentStep === 0 && "🎯 اختيار أمر العمل المنتهي"}
              {currentStep === 1 && "📝 البيانات الأساسية والعميل"}
              {currentStep === 2 && "🛠️ تفاصيل الخدمة والمسار"}
              {currentStep === 3 && "👥 الموظفين والمشرفين"}
              {currentStep === 4 && "⭐ تقييم جودة الخدمة"}
              {currentStep === 5 && "✅ المراجعة النهائية والتأكيد"}
            </CardTitle>
            <CardDescription className="text-base">
              {currentStep === 0 && "اختر أمر العمل المنتهي الذي تريد إجراء تقييم له"}
              {currentStep === 1 && "مراجعة وتأكيد البيانات الأساسية للايصال والعميل"}
              {currentStep === 2 && "مراجعة تفاصيل الخدمة المقدمة والمسار المتبع"}
              {currentStep === 3 && "مراجعة الموظفين المسؤولين عن تقديم الخدمة"}
              {currentStep === 4 && "قم بتقييم جودة الخدمة ورضا العميل"}
              {currentStep === 5 && "راجع جميع البيانات قبل الحفظ النهائي"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-6 space-y-6">
            {/* Step 0: Work Order Selection - Enhanced Design */}
            {currentStep === 0 && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                      أوامر العمل المنتهية في انتظار التقييم
                    </h3>
                    <p className="text-muted-foreground">اختر أمر العمل الذي تريد إجراء تقييم له من القائمة أدناه</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-lg px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                      <Users className="h-4 w-4 ml-2" />
                      {completedWorkOrders.length} أمر عمل
                    </Badge>
                  </div>
                </div>

                <div className="grid gap-3">
                  {completedWorkOrders.map((workOrder, index) => (
                    <Card 
                      key={workOrder.id}
                      className={`group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-2 ${
                        checkUpForm.selectedWorkOrder?.id === workOrder.id 
                          ? "border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg" 
                          : "border-gray-200 hover:border-blue-300 bg-white hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50"
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            {/* Header Row */}
                            <div className="flex items-center gap-4 mb-3">
                              <div className="flex items-center gap-2">
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                  <Receipt className="h-5 w-5 text-blue-600" />
                                </div>
                                <span className="font-bold text-lg text-blue-700">{workOrder.invoiceNumber}</span>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Car className="h-4 w-4 text-slate-600" />
                                <span className="font-semibold bg-slate-100 px-3 py-1 rounded-full text-sm">
                                  {workOrder.plateNumber}
                                </span>
                              </div>
                              
                              <Badge className={`${getPriorityColor(workOrder.priority)} font-medium`}>
                                {getPriorityIcon(workOrder.priority)} 
                                {workOrder.priority === 'high' ? 'عاجل' : workOrder.priority === 'medium' ? 'متوسط' : 'عادي'}
                              </Badge>
                              
                              <Badge variant={workOrder.paymentStatus === "paid" ? "default" : workOrder.paymentStatus === "partial" ? "secondary" : "destructive"} className="font-medium">
                                <Banknote className="h-3 w-3 ml-1" />
                                {workOrder.paymentStatus === "paid" ? "مدفوع" : workOrder.paymentStatus === "partial" ? "جزئي" : "غير مدفوع"}
                              </Badge>
                            </div>
                            
                            {/* Main Info Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <User className="h-3 w-3" />
                                  العميل
                                </div>
                                <p className="font-semibold text-sm">{workOrder.customerName}</p>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Phone className="h-3 w-3" />
                                  {workOrder.customerPhone}
                                </div>
                              </div>
                              
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Car className="h-3 w-3" />
                                  المشروب
                                </div>
                                <p className="font-semibold text-sm">{workOrder.carType}</p>
                              </div>
                              
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Wrench className="h-3 w-3" />
                                  المسار
                                </div>
                                <div className="flex items-center gap-2">
                                  {servicePaths.find(p => p.id === workOrder.servicePath) && (
                                    <>
                                      <span className="text-lg">{servicePaths.find(p => p.id === workOrder.servicePath)?.icon}</span>
                                      <span className="font-semibold text-sm">{servicePaths.find(p => p.id === workOrder.servicePath)?.name}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                              
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Banknote className="h-3 w-3" />
                                  المبلغ
                                </div>
                                <p className="font-bold text-lg text-green-600">{workOrder.totalAmount} جنيه</p>
                              </div>
                            </div>
                            
                            {/* Services and Time Info */}
                            <div className="flex items-center justify-between">
                              <div className="flex flex-wrap gap-1">
                                {workOrder.services.slice(0, 3).map((service, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs bg-white">
                                    {service}
                                  </Badge>
                                ))}
                                {workOrder.services.length > 3 && (
                                  <Badge variant="outline" className="text-xs bg-white">
                                    +{workOrder.services.length - 3} أخرى
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Timer className="h-3 w-3" />
                                  انتظار: {workOrder.waitingTime}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(workOrder.completedAt).toLocaleTimeString('ar-SA', { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex flex-col gap-2 mr-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                viewWorkOrderDetails(workOrder);
                              }}
                              className="hover:scale-105 transition-all duration-200 hover:bg-blue-50"
                            >
                              <Eye className="h-4 w-4 ml-2" />
                              التفاصيل
                            </Button>
                            
                            <Button
                              onClick={() => selectWorkOrder(workOrder)}
                              className="hover:scale-105 transition-all duration-200 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                              size="sm"
                            >
                              <Play className="h-4 w-4 ml-2" />
                              بدء التقييم
                            </Button>
                            
                            {checkUpForm.selectedWorkOrder?.id === workOrder.id && (
                              <div className="flex items-center justify-center">
                                <CheckCircle className="h-6 w-6 text-green-500 animate-pulse" />
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {completedWorkOrders.length === 0 && (
                  <div className="text-center py-12 animate-fade-in">
                    <div className="p-4 bg-slate-100 rounded-full w-24 h-24 mx-auto flex items-center justify-center mb-4">
                      <AlertTriangle className="h-12 w-12 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-medium text-slate-600 mb-2">لا توجد أوامر عمل منتهية</h3>
                    <p className="text-slate-500">لا توجد أوامر عمل منتهية في انتظار التقييم حالياً</p>
                  </div>
                )}
              </div>
            )}

            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="invoiceNumber" className="text-base font-medium">رقم الايصال *</Label>
                    <Input
                      id="invoiceNumber"
                      value={checkUpForm.invoiceNumber}
                      onChange={(e) => handleFormChange('invoiceNumber', e.target.value)}
                      className="text-lg"
                      placeholder="INV-2024-001"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="plateNumber" className="text-base font-medium">رقم اللوحة *</Label>
                    <Input
                      id="plateNumber"
                      value={checkUpForm.plateNumber}
                      onChange={(e) => handleFormChange('plateNumber', e.target.value)}
                      className="text-lg"
                      placeholder="أ ب ج 1234"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="carType" className="text-base font-medium">نوع المشروب</Label>
                    <Input
                      id="carType"
                      value={checkUpForm.carType}
                      onChange={(e) => handleFormChange('carType', e.target.value)}
                      className="text-lg"
                      placeholder="كامري 2023"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="customerName" className="text-base font-medium">اسم العميل *</Label>
                    <Input
                      id="customerName"
                      value={checkUpForm.customerName}
                      onChange={(e) => handleFormChange('customerName', e.target.value)}
                      className="text-lg"
                      placeholder="أحمد محمد علي"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="customerPhone" className="text-base font-medium">رقم الهاتف</Label>
                    <Input
                      id="customerPhone"
                      value={checkUpForm.customerPhone}
                      onChange={(e) => handleFormChange('customerPhone', e.target.value)}
                      className="text-lg"
                      placeholder="0501234567"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Service Details */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="servicePath" className="text-base font-medium">مسار الخدمة *</Label>
                    <Select value={checkUpForm.servicePath} onValueChange={(value) => handleFormChange('servicePath', value)}>
                      <SelectTrigger className="text-lg">
                        <SelectValue placeholder="اختر مسار الخدمة" />
                      </SelectTrigger>
                      <SelectContent>
                        {servicePaths.map((path) => (
                          <SelectItem key={path.id} value={path.id}>
                            <div className="flex items-center gap-2">
                              <span>{path.icon}</span>
                              <span>{path.name}</span>
                              <Badge variant="outline" className="mr-2">
                                {path.duration} دقيقة
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="paymentStatus" className="text-base font-medium">حالة الدفع *</Label>
                    <Select value={checkUpForm.paymentStatus} onValueChange={(value) => handleFormChange('paymentStatus', value)}>
                      <SelectTrigger className="text-lg">
                        <SelectValue placeholder="اختر حالة الدفع" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="paid">مدفوع</SelectItem>
                        <SelectItem value="partial">مدفوع جزئياً</SelectItem>
                        <SelectItem value="unpaid">غير مدفوع</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Employees */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div className="space-y-4">
                  <Label className="text-base font-medium">الموظفين المسؤولين عن الخدمة *</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {employees.map((employee) => (
                      <div key={employee} className="flex items-center space-x-2 space-x-reverse">
                        <input
                          type="checkbox"
                          id={employee}
                          checked={checkUpForm.employees.includes(employee)}
                          onChange={(e) => {
                            const newEmployees = e.target.checked
                              ? [...checkUpForm.employees, employee]
                              : checkUpForm.employees.filter(emp => emp !== employee);
                            handleFormChange('employees', newEmployees);
                          }}
                          className="rounded"
                        />
                        <Label htmlFor={employee} className="text-sm font-medium cursor-pointer">
                          {employee}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Rating */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-fade-in">
                <div className="space-y-4">
                  <Label className="text-base font-medium">التقييم العام للخدمة *</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {ratings.map((rating) => (
                      <Card
                        key={rating.value}
                        className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                          checkUpForm.overallRating === rating.value
                            ? `${rating.bgColor} border-2`
                            : "hover:shadow-md"
                        }`}
                        onClick={() => handleFormChange('overallRating', rating.value)}
                      >
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl mb-2">{rating.icon}</div>
                          <div className={`font-semibold ${rating.color}`}>{rating.label}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {(checkUpForm.overallRating === "acceptable" || checkUpForm.overallRating === "poor" || checkUpForm.overallRating === "very-poor") && (
                  <div className="space-y-2">
                    <Label htmlFor="ratingNotes" className="text-base font-medium">ملاحظات التقييم (مطلوبة للتقييمات السلبية) *</Label>
                    <Textarea
                      id="ratingNotes"
                      value={checkUpForm.ratingNotes}
                      onChange={(e) => handleFormChange('ratingNotes', e.target.value)}
                      placeholder="يرجى كتابة ملاحظات مفصلة حول أسباب التقييم السلبي لتحسين الخدمة..."
                      className="min-h-[100px]"
                    />
                  </div>
                )}

                <div className="space-y-4">
                  <Label className="text-base font-medium">تقييم أجزاء المشروب</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {serviceAreas.map((area) => (
                      <div key={area.key} className="space-y-2">
                        <Label className={`text-sm font-medium flex items-center gap-2 ${area.color}`}>
                          <span className="text-lg">{area.icon}</span>
                          {area.label}
                        </Label>
                        <Select 
                          value={checkUpForm.partEvaluations[area.key as keyof typeof checkUpForm.partEvaluations]} 
                          onValueChange={(value) => handleFormChange(`partEvaluations.${area.key}`, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="اختر التقييم" />
                          </SelectTrigger>
                          <SelectContent>
                            {ratings.map((rating) => (
                              <SelectItem key={rating.value} value={rating.value}>
                                <div className="flex items-center gap-2">
                                  <span>{rating.icon}</span>
                                  <span>{rating.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Final Review */}
            {currentStep === 5 && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    مراجعة البيانات النهائية
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="font-medium">رقم الايصال:</span>
                        <span>{checkUpForm.invoiceNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">رقم اللوحة:</span>
                        <span>{checkUpForm.plateNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">العميل:</span>
                        <span>{checkUpForm.customerName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">مسار الخدمة:</span>
                        <span>{servicePaths.find(p => p.id === checkUpForm.servicePath)?.name}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="font-medium">التقييم العام:</span>
                        <span className="flex items-center gap-2">
                          {ratings.find(r => r.value === checkUpForm.overallRating)?.icon}
                          {ratings.find(r => r.value === checkUpForm.overallRating)?.label}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">عدد الموظفين:</span>
                        <span>{checkUpForm.employees.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">وقت التقييم:</span>
                        <span>{new Date(checkUpForm.checkupTime).toLocaleString('ar-SA')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalNotes" className="text-base font-medium">ملاحظات إضافية</Label>
                  <Textarea
                    id="additionalNotes"
                    value={checkUpForm.additionalNotes}
                    onChange={(e) => handleFormChange('additionalNotes', e.target.value)}
                    placeholder="أي ملاحظات إضافية أو توصيات..."
                    className="min-h-[100px]"
                  />
                </div>

                <div className="flex items-center space-x-2 space-x-reverse">
                  <Switch
                    id="customerSignature"
                    checked={checkUpForm.customerSignature}
                    onCheckedChange={(checked) => handleFormChange('customerSignature', checked)}
                  />
                  <Label htmlFor="customerSignature" className="text-base font-medium cursor-pointer">
                    تم الحصول على توقيع العميل
                  </Label>
                </div>
              </div>
            )}

            {/* Enhanced Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t border-gray-200">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="hover:scale-105 transition-all duration-200 hover:shadow-md"
              >
                <ArrowLeft className="h-4 w-4 ml-2" />
                السابق
              </Button>
              
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/pos/evaluation-management")}
                  className="hover:scale-105 transition-all duration-200"
                >
                  إلغاء
                </Button>
                
                {currentStep < totalSteps - 1 ? (
                  <Button 
                    onClick={() => setCurrentStep(currentStep + 1)}
                    disabled={!canProceedToNext()}
                    className="hover:scale-105 transition-all duration-200 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  >
                    التالي
                    <ChevronRight className="h-4 w-4 mr-2" />
                  </Button>
                ) : (
                  <Button 
                    onClick={handleSubmitCheckUp} 
                    disabled={!canProceedToNext()}
                    className="hover:scale-105 transition-all duration-200 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg"
                  >
                    <Sparkles className="h-4 w-4 ml-2" />
                    حفظ التقييم النهائي
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
