import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Brain,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  Activity,
  PieChart,
  LineChart,
  Sparkles,
  Zap,
  Eye,
  Search,
  Filter,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Star,
  Users,
  DollarSign,
  Package,
  Clock,
  FileText,
  Lightbulb,
  Cpu,
  Bot,
  Award,
  Calendar,
  Mail,
  Printer,
  Share2,
  Settings,
  Bookmark,
  Flag,
  Info,
  MessageSquare,
  Shield,
  MousePointer,
  Layers,
  Compass,
  Database,
  Radar,
  Gauge
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AIInsight {
  id: string;
  type: "trend" | "anomaly" | "prediction" | "recommendation" | "risk";
  title: string;
  description: string;
  data: any;
  confidence: number;
  impact: "عالي" | "متوسط" | "منخفض";
  category: string;
  actionable: boolean;
  priority: "عاجل" | "مرتفع" | "متوسط" | "منخفض";
  timestamp: Date;
}

interface SmartMetric {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  change: number;
  changeType: "increase" | "decrease" | "stable";
  unit: string;
  description: string;
  target: number;
  status: "good" | "warning" | "critical";
  prediction: number;
}

interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  impact: string;
  effort: "سهل" | "متوسط" | "صعب";
  timeline: string;
  category: string;
  priority: "عاجل" | "مرتفع" | "متوسط" | "منخفض";
  expectedROI: number;
  actions: string[];
}

interface AutomatedAlert {
  id: string;
  type: "performance" | "cost" | "quality" | "delivery" | "compliance";
  title: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low";
  supplierId?: string;
  supplierName?: string;
  metric: string;
  threshold: number;
  currentValue: number;
  timestamp: Date;
  suggestions: string[];
}

const AISupplierReports = () => {
  const { toast } = useToast();
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [selectedTimeframe, setSelectedTimeframe] = useState("6months");
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [smartMetrics, setSmartMetrics] = useState<SmartMetric[]>([]);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [automatedAlerts, setAutomatedAlerts] = useState<AutomatedAlert[]>([]);
  const [activeTab, setActiveTab] = useState("overview");

  // Sample AI insights
  const sampleInsights: AIInsight[] = [
    {
      id: "INS001",
      type: "trend",
      title: "اتجاه تحسن في أداء الموردين",
      description: "تحسن ملحوظ في متوسط تقييم الموردين بنسبة 15% خلال الربع الأخير",
      data: { previousQuarter: 3.8, currentQuarter: 4.4, trend: "improving" },
      confidence: 92,
      impact: "عالي",
      category: "الأداء العام",
      actionable: true,
      priority: "متوسط",
      timestamp: new Date()
    },
    {
      id: "INS002",
      type: "anomaly",
      title: "انحراف في تكاليف المواد الكيميائية",
      description: "زيادة غير مبررة في تكاليف المواد الكيميائية بنسبة 22% عن المتوقع",
      data: { expectedCost: 850000, actualCost: 1037000, variance: 22 },
      confidence: 87,
      impact: "عالي",
      category: "التكاليف",
      actionable: true,
      priority: "عاجل",
      timestamp: new Date()
    },
    {
      id: "INS003",
      type: "prediction",
      title: "توقع انخفاض الأداء للربع القادم",
      description: "نماذج التنبؤ تشير لانخفاض محتمل في أداء 3 موردين رئيسيين",
      data: { affectedSuppliers: 3, predictedDrop: 12, confidence: 78 },
      confidence: 78,
      impact: "متوسط",
      category: "التنبؤات",
      actionable: true,
      priority: "مرتفع",
      timestamp: new Date()
    },
    {
      id: "INS004",
      type: "recommendation",
      title: "فرصة تحسين شروط الدفع",
      description: "إمكانية توفير 8% من التكاليف عبر إعادة التفاوض على شروط الدفع",
      data: { potentialSavings: 680000, affectedContracts: 5 },
      confidence: 85,
      impact: "عالي",
      category: "التحسين",
      actionable: true,
      priority: "مرتفع",
      timestamp: new Date()
    }
  ];

  const sampleSmartMetrics: SmartMetric[] = [
    {
      id: "MET001",
      name: "متوسط تقييم الموردين",
      value: 4.2,
      previousValue: 3.8,
      change: 10.5,
      changeType: "increase",
      unit: "/5",
      description: "متوسط تقييم جميع الموردين النشطين",
      target: 4.5,
      status: "good",
      prediction: 4.3
    },
    {
      id: "MET002",
      name: "معدل التسليم في الموعد",
      value: 88,
      previousValue: 92,
      change: -4.3,
      changeType: "decrease",
      unit: "%",
      description: "نسبة الطلبات المسلمة في الموعد المحدد",
      target: 95,
      status: "warning",
      prediction: 90
    },
    {
      id: "MET003",
      name: "التوفير في التكاليف",
      value: 1200000,
      previousValue: 950000,
      change: 26.3,
      changeType: "increase",
      unit: "جنيه مصري",
      description: "إجمالي التوفير المحقق من مفاوضات الأسعار",
      target: 1500000,
      status: "good",
      prediction: 1350000
    },
    {
      id: "MET004",
      name: "معدل الشكاوى",
      value: 2.1,
      previousValue: 3.5,
      change: -40,
      changeType: "decrease",
      unit: "%",
      description: "نسبة الطلبات التي تم تسجيل شكاوى عليها",
      target: 1.5,
      status: "good",
      prediction: 1.8
    }
  ];

  const sampleRecommendations: AIRecommendation[] = [
    {
      id: "REC001",
      title: "تطبيق نظام تقييم آلي",
      description: "تطبيق نظام تقييم تلقائي للموردين يعتمد على البيانات الفعلية",
      impact: "تحسين دقة التقييم بنسبة 35% وتوفير 20 ساعة عمل أسبوعياً",
      effort: "متوسط",
      timeline: "3-4 أشهر",
      category: "التقييم والمراقبة",
      priority: "مرتفع",
      expectedROI: 250000,
      actions: [
        "تحديد معايير التقييم الآلي",
        "تطوير خوارزميات التقييم",
        "اختبار النظام مع عينة من الموردين",
        "التطبيق الكامل والتدريب"
      ]
    },
    {
      id: "REC002",
      title: "إعادة تفاوض العقود عالية التكلفة",
      description: "مراجعة وإعادة تفاوض 7 عقود تظهر تكاليف مرتفعة غير مبررة",
      impact: "توفير متوقع 680,000 جنيه مصري سنوياً",
      effort: "سهل",
      timeline: "6-8 أسابيع",
      category: "إدارة التكاليف",
      priority: "عاجل",
      expectedROI: 680000,
      actions: [
        "تحليل العقود عالية التكلفة",
        "إعداد استراتيجية التفاوض",
        "بدء المفاوضات مع الموردين",
        "توقيع العقود المحدثة"
      ]
    },
    {
      id: "REC003",
      title: "تنويع قاعدة الموردين",
      description: "إضافة موردين بديلين للمواد الحساسة لتقليل المخاطر",
      impact: "تقليل مخاطر انقطاع التوريد بنسبة 60%",
      effort: "صعب",
      timeline: "4-6 أشهر",
      category: "إدارة المخاطر",
      priority: "مرتفع",
      expectedROI: 450000,
      actions: [
        "تحديد المواد الحساسة",
        "البحث عن موردين بديلين",
        "تقييم الموردين الجدد",
        "إنشاء عقود احتياطية"
      ]
    }
  ];

  const sampleAlerts: AutomatedAlert[] = [
    {
      id: "ALT001",
      type: "performance",
      title: "تراجع أداء مورد رئيسي",
      description: "انخفاض تقييم شركة الأولى للمواد الكيميائية إلى 3.2 من 4.5",
      severity: "high",
      supplierId: "SUP001",
      supplierName: "شركة الأولى للمواد الكيميائية",
      metric: "التقييم العام",
      threshold: 4.0,
      currentValue: 3.2,
      timestamp: new Date(),
      suggestions: [
        "إجراء اجتماع عاجل مع المورد",
        "مراجعة أسباب تراجع الأداء",
        "وضع خطة تحسين فورية"
      ]
    },
    {
      id: "ALT002",
      type: "cost",
      title: "تجاوز الميزانية المحددة",
      description: "تجاوز ميزانية قطع    للربع الحالي بنسبة 15%",
      severity: "medium",
      metric: "التكلفة الربع سنوية",
      threshold: 500000,
      currentValue: 575000,
      timestamp: new Date(),
      suggestions: [
        "مراجعة عمليات الشراء الحالية",
        "تأجيل الطلبات غير العاجلة",
        "البحث عن بدائل أقل تكلفة"
      ]
    }
  ];

  const runAIAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);

    const analysisSteps = [
      { progress: 15, message: "تحليل بيانات الموردين..." },
      { progress: 30, message: "استخراج الاتجاهات والأنماط..." },
      { progress: 45, message: "تحديد الانحرافات والشذوذ..." },
      { progress: 60, message: "إنشاء التنبؤات..." },
      { progress: 75, message: "توليد التوصيات..." },
      { progress: 90, message: "إنشاء التنبيهات الذكية..." },
      { progress: 100, message: "اكتمل التحليل!" }
    ];

    for (const step of analysisSteps) {
      await new Promise(resolve => setTimeout(resolve, 700));
      setAnalysisProgress(step.progress);
    }

    setInsights(sampleInsights);
    setSmartMetrics(sampleSmartMetrics);
    setRecommendations(sampleRecommendations);
    setAutomatedAlerts(sampleAlerts);
    setIsAnalyzing(false);

    toast({
      title: "اكتمل التحليل الذكي",
      description: "تم إنشاء تقرير شامل مع التوصيات والتنبيهات",
    });
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "trend": return TrendingUp;
      case "anomaly": return AlertTriangle;
      case "prediction": return Brain;
      case "recommendation": return Lightbulb;
      case "risk": return Shield;
      default: return Info;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case "trend": return "from-blue-500 to-cyan-600";
      case "anomaly": return "from-red-500 to-orange-600";
      case "prediction": return "from-purple-500 to-violet-600";
      case "recommendation": return "from-green-500 to-emerald-600";
      case "risk": return "from-yellow-500 to-orange-500";
      default: return "from-gray-500 to-slate-600";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "عاجل": return "bg-red-100 text-red-800 border-red-200";
      case "مرتفع": return "bg-orange-100 text-orange-800 border-orange-200";
      case "متوسط": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "منخفض": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getMetricStatusColor = (status: string) => {
    switch (status) {
      case "good": return "text-green-600";
      case "warning": return "text-yellow-600";
      case "critical": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-100 text-red-800 border-red-200";
      case "high": return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-white via-blue-50/80 to-purple-50/60 p-8 rounded-3xl border border-white/60 shadow-2xl backdrop-blur-md">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-200/30 to-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-200/30 to-blue-200/20 rounded-full blur-2xl"></div>
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
              <div className="relative p-4 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 rounded-2xl shadow-xl">
                <Brain className="w-8 h-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-2">
                تقارير الموردين الذكية
              </h1>
              <p className="text-lg text-gray-600 font-medium max-w-2xl">
                تحليلات متقدمة وتقارير ذكية مدعومة بالذكاء الاصطناعي لاتخاذ قرارات أفضل
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="bg-white/80 backdrop-blur-sm border-blue-200 hover:bg-blue-50"
            >
              <Settings className="w-4 h-4 mr-2" />
              إعدادات التحليل
            </Button>
            <Button
              onClick={runAIAnalysis}
              disabled={isAnalyzing}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  جاري التحليل...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  تحليل ذكي شامل
                </>
              )}
            </Button>
          </div>
        </div>

        {isAnalyzing && (
          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>تقدم التحليل الذكي</span>
              <span>{analysisProgress}%</span>
            </div>
            <Progress value={analysisProgress} className="h-3" />
          </div>
        )}
      </div>

      {/* AI Analysis Results */}
      {insights.length > 0 && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-white shadow-lg rounded-2xl p-1">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Gauge className="w-4 h-4" />
              نظرة عامة
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              الرؤى الذكية
            </TabsTrigger>
            <TabsTrigger value="metrics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              المؤشرات الذكية
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              التوصيات
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              التنبيهات الذكية
            </TabsTrigger>
            <TabsTrigger value="export" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              التصدير
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {smartMetrics.map((metric) => (
                <Card key={metric.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">{metric.name}</h3>
                      <div className={`text-2xl font-bold ${getMetricStatusColor(metric.status)}`}>
                        {metric.changeType === "increase" ? "↗" : 
                         metric.changeType === "decrease" ? "↘" : "→"}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-gray-900">
                          {metric.value.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500">{metric.unit}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className={`${
                          metric.changeType === "increase" ? "bg-green-100 text-green-800" :
                          metric.changeType === "decrease" ? "bg-red-100 text-red-800" :
                          "bg-gray-100 text-gray-800"
                        }`}>
                          {metric.changeType === "increase" ? "+" : ""}{metric.change.toFixed(1)}%
                        </Badge>
                        <span className="text-xs text-gray-500">من الفترة السابقة</span>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>التقدم نحو الهدف</span>
                          <span>{((metric.value / metric.target) * 100).toFixed(0)}%</span>
                        </div>
                        <Progress value={(metric.value / metric.target) * 100} className="h-2" />
                      </div>
                      
                      <p className="text-xs text-gray-500">{metric.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Insights Summary */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  ملخص الرؤى السريعة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600 mb-1">{insights.length}</div>
                    <div className="text-sm text-blue-700">رؤى ذكية جديدة</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-xl">
                    <div className="text-2xl font-bold text-green-600 mb-1">{recommendations.length}</div>
                    <div className="text-sm text-green-700">توصيات قابلة للتطبيق</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-xl">
                    <div className="text-2xl font-bold text-orange-600 mb-1">{automatedAlerts.length}</div>
                    <div className="text-sm text-orange-700">تنبيهات تتطلب اهتماماً</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-xl">
                    <div className="text-2xl font-bold text-purple-600 mb-1">85%</div>
                    <div className="text-sm text-purple-700">دقة التنبؤات</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-4">
            <div className="grid gap-4">
              {insights.map((insight) => {
                const IconComponent = getInsightIcon(insight.type);
                
                return (
                  <Card key={insight.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${getInsightColor(insight.type)}`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-lg text-gray-900">{insight.title}</h3>
                            <Badge className={getPriorityColor(insight.priority)}>
                              {insight.priority}
                            </Badge>
                            <Badge variant="outline">
                              {insight.type === "trend" ? "اتجاه" :
                               insight.type === "anomaly" ? "شذوذ" :
                               insight.type === "prediction" ? "توقع" :
                               insight.type === "recommendation" ? "توصية" : "مخاطر"}
                            </Badge>
                          </div>
                          
                          <p className="text-gray-600 mb-3">{insight.description}</p>
                          
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <span className="text-sm text-gray-500">الثقة:</span>
                                <div className="flex items-center gap-1">
                                  <Progress value={insight.confidence} className="w-16 h-2" />
                                  <span className="text-sm font-medium">{insight.confidence}%</span>
                                </div>
                              </div>
                              <Badge variant="secondary">
                                التأثير: {insight.impact}
                              </Badge>
                            </div>
                            <span className="text-xs text-gray-500">{insight.category}</span>
                          </div>
                          
                          {insight.actionable && (
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4 mr-1" />
                                التفاصيل
                              </Button>
                              <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                                <Target className="w-4 h-4 mr-1" />
                                اتخاذ إجراء
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Smart Metrics Tab */}
          <TabsContent value="metrics" className="space-y-4">
            <div className="grid gap-6">
              {smartMetrics.map((metric) => (
                <Card key={metric.id} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900">{metric.name}</h3>
                      <div className="flex items-center gap-2">
                        <Badge className={`${getMetricStatusColor(metric.status)} bg-opacity-20`}>
                          {metric.status === "good" ? "جيد" : 
                           metric.status === "warning" ? "تحذير" : "حرج"}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900 mb-1">
                          {metric.value.toLocaleString()}{metric.unit}
                        </div>
                        <div className="text-sm text-gray-500">القيمة الحالية</div>
                      </div>
                      
                      <div className="text-center">
                        <div className={`text-2xl font-bold mb-1 ${
                          metric.changeType === "increase" ? "text-green-600" :
                          metric.changeType === "decrease" ? "text-red-600" : "text-gray-600"
                        }`}>
                          {metric.changeType === "increase" ? "+" : ""}{metric.change.toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-500">التغيير</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 mb-1">
                          {metric.target.toLocaleString()}{metric.unit}
                        </div>
                        <div className="text-sm text-gray-500">الهدف</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600 mb-1">
                          {metric.prediction.toLocaleString()}{metric.unit}
                        </div>
                        <div className="text-sm text-gray-500">التوقع</div>
                      </div>
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>التقدم نحو الهدف</span>
                        <span>{((metric.value / metric.target) * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={(metric.value / metric.target) * 100} className="h-3" />
                    </div>
                    
                    <p className="mt-4 text-sm text-gray-600">{metric.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-4">
            <div className="grid gap-4">
              {recommendations.map((recommendation) => (
                <Card key={recommendation.id} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{recommendation.title}</h3>
                        <p className="text-gray-600">{recommendation.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(recommendation.priority)}>
                          {recommendation.priority}
                        </Badge>
                        <Badge variant="outline">
                          {recommendation.effort}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-green-50 rounded-lg p-3">
                        <div className="text-sm text-green-700 mb-1">التأثير المتوقع</div>
                        <div className="text-sm font-medium text-green-800">{recommendation.impact}</div>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="text-sm text-blue-700 mb-1">المدة الزمنية</div>
                        <div className="text-sm font-medium text-blue-800">{recommendation.timeline}</div>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-3">
                        <div className="text-sm text-purple-700 mb-1">العائد المتوقع</div>
                        <div className="text-sm font-medium text-purple-800">
                          {recommendation.expectedROI.toLocaleString()} جنيه مصري
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">خطوات التنفيذ:</h4>
                      <div className="space-y-1">
                        {recommendation.actions.map((action, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-medium flex items-center justify-center">
                              {index + 1}
                            </div>
                            <span className="text-sm text-gray-700">{action}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        تأجيل
                      </Button>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        بدء التنفيذ
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="space-y-4">
            <div className="grid gap-4">
              {automatedAlerts.map((alert) => (
                <Card key={alert.id} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-600">
                        <AlertTriangle className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-lg text-gray-900">{alert.title}</h3>
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity === "critical" ? "حرج" :
                             alert.severity === "high" ? "مرتفع" :
                             alert.severity === "medium" ? "متوسط" : "منخفض"}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{alert.description}</p>
                        
                        {alert.supplierName && (
                          <div className="bg-gray-50 rounded-lg p-3 mb-3">
                            <div className="text-sm text-gray-700">
                              <strong>المورد:</strong> {alert.supplierName}
                            </div>
                            <div className="text-sm text-gray-700">
                              <strong>المؤشر:</strong> {alert.metric}
                            </div>
                            <div className="text-sm text-gray-700">
                              <strong>الحد المطلوب:</strong> {alert.threshold}
                            </div>
                            <div className="text-sm text-gray-700">
                              <strong>القيمة الحالية:</strong> {alert.currentValue}
                            </div>
                          </div>
                        )}
                        
                        <div className="mb-3">
                          <h4 className="font-medium text-gray-900 mb-2">الاقتراحات:</h4>
                          <div className="space-y-1">
                            {alert.suggestions.map((suggestion, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className="text-sm text-gray-700">{suggestion}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">
                            تجاهل
                          </Button>
                          <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                            معالجة
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Export Tab */}
          <TabsContent value="export" className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5 text-blue-600" />
                  تصدير التقارير والبيانات
                </CardTitle>
                <CardDescription>
                  تصدير التقارير بصيغ مختلفة مع إمكانية الجدولة التلقائية
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="border border-blue-200">
                    <CardContent className="p-4 text-center">
                      <FileText className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                      <h3 className="font-semibold mb-2">تقرير PDF شامل</h3>
                      <p className="text-sm text-gray-600 mb-4">تقرير مفصل مع الرسوم البيانية</p>
                      <Button className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        تصدير PDF
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-green-200">
                    <CardContent className="p-4 text-center">
                      <Database className="w-8 h-8 text-green-600 mx-auto mb-3" />
                      <h3 className="font-semibold mb-2">بيانات Excel</h3>
                      <p className="text-sm text-gray-600 mb-4">جداول بيانات للتحليل المتقدم</p>
                      <Button variant="outline" className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        تصدير Excel
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-purple-200">
                    <CardContent className="p-4 text-center">
                      <Mail className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                      <h3 className="font-semibold mb-2">إرسال مجدول</h3>
                      <p className="text-sm text-gray-600 mb-4">جدولة التقارير الدورية</p>
                      <Button variant="outline" className="w-full">
                        <Calendar className="w-4 h-4 mr-2" />
                        جدولة
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default AISupplierReports;