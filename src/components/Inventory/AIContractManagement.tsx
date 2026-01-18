import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Brain,
  FileText,
  AlertTriangle,
  CheckCircle,
  Star,
  Zap,
  Target,
  Activity,
  BarChart3,
  Scale,
  Shield,
  Clock,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Eye,
  Search,
  Lightbulb,
  Cpu,
  Bot,
  Sparkles,
  Award,
  Users,
  MessageSquare,
  RefreshCw,
  Upload,
  Download,
  Edit,
  Trash2,
  Plus,
  X,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Info,
  Bookmark,
  Flag,
  Gavel,
  PenTool,
  ClipboardCheck,
  Bell
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContractAnalysis {
  id: string;
  contractName: string;
  supplierName: string;
  analysisDate: Date;
  overallScore: number;
  riskLevel: "منخفض" | "متوسط" | "مرتفع" | "حرج";
  compliance: number;
  clarity: number;
  fairness: number;
  completeness: number;
  keyFindings: ContractFinding[];
  recommendations: ContractRecommendation[];
  risks: ContractRisk[];
  missingClauses: string[];
  strengths: string[];
}

interface ContractFinding {
  id: string;
  type: "risk" | "opportunity" | "issue" | "strength";
  category: string;
  title: string;
  description: string;
  severity: "منخفض" | "متوسط" | "مرتفع" | "حرج";
  clause: string;
  suggestion: string;
  confidence: number;
}

interface ContractRecommendation {
  id: string;
  type: "amendment" | "addition" | "removal" | "clarification";
  priority: "عاجل" | "مرتفع" | "متوسط" | "منخفض";
  title: string;
  description: string;
  rationale: string;
  impact: string;
  implementation: string;
}

interface ContractRisk {
  id: string;
  category: "مالي" | "قانوني" | "تشغيلي" | "سمعة" | "امتثال";
  title: string;
  description: string;
  probability: number;
  impact: number;
  riskScore: number;
  mitigation: string[];
  timeline: string;
}

interface SmartAlert {
  id: string;
  type: "renewal" | "payment" | "milestone" | "compliance" | "performance";
  title: string;
  description: string;
  priority: "عاجل" | "مرتفع" | "متوسط" | "منخفض";
  dueDate: Date;
  contractId: string;
  actions: string[];
  automated: boolean;
}

const AIContractManagement = () => {
  const { toast } = useToast();
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [selectedContract, setSelectedContract] = useState("");
  const [contractAnalysis, setContractAnalysis] = useState<ContractAnalysis | null>(null);
  const [smartAlerts, setSmartAlerts] = useState<SmartAlert[]>([]);
  const [activeTab, setActiveTab] = useState("analysis");
  const [contractText, setContractText] = useState("");

  // Sample contracts data
  const contracts = [
    { id: "CONT-001", name: "عقد توريد المواد الكيميائية 2024", supplier: "شركة الأولى للمواد الكيميائية" },
    { id: "CONT-002", name: "اتفاقية قطع    السنوية", supplier: "مؤسسة النجاح لقطع   " },
    { id: "CONT-003", name: "عقد توريد الزيوت والمواد", supplier: "شركة التميز للزيوت" },
  ];

  // Sample analysis data
  const sampleAnalysis: ContractAnalysis = {
    id: "ANALYSIS-001",
    contractName: "عقد توريد المواد الكيميائية 2024",
    supplierName: "شركة الأولى للمواد الكيميائية",
    analysisDate: new Date(),
    overallScore: 7.8,
    riskLevel: "متوسط",
    compliance: 8.5,
    clarity: 7.2,
    fairness: 8.0,
    completeness: 7.5,
    keyFindings: [
      {
        id: "F001",
        type: "risk",
        category: "شروط الدفع",
        title: "مخاطر في شروط الدفع",
        description: "شروط الدفع المتأخرة قد تؤثر على سيولة المورد",
        severity: "متوسط",
        clause: "البند 4.2 - شروط الدفع",
        suggestion: "تقليل فترة الدفع إلى 30 يوم بدلاً من 60 يوم",
        confidence: 85
      },
      {
        id: "F002",
        type: "strength",
        category: "الجودة",
        title: "معايير جودة واضحة",
        description: "العقد يحتوي على معايير جودة محددة ومفصلة",
        severity: "منخفض",
        clause: "البند 3.1 - معايير الجودة",
        suggestion: "الحفاظ على هذه المعايير في العقود المستقبلية",
        confidence: 92
      }
    ],
    recommendations: [
      {
        id: "R001",
        type: "amendment",
        priority: "مرتفع",
        title: "تعديل شروط إنهاء العقد",
        description: "إضافة شروط واضحة لإنهاء العقد في حالات عدم الامتثال",
        rationale: "حماية مصالح الشركة وضمان مرونة أكبر",
        impact: "تقليل المخاطر القانونية بنسبة 30%",
        implementation: "إضافة بند جديد في القسم 8 من العقد"
      },
      {
        id: "R002",
        type: "addition",
        priority: "متوسط",
        title: "إضافة بند حماية البيانات",
        description: "إضافة بند شامل لحماية البيانات والمعلومات الحساسة",
        rationale: "الامتثال للوائح حماية البيانات المحلية والدولية",
        impact: "ضمان الامتثال القانوني 100%",
        implementation: "إدراج بند جديد في القسم 7"
      }
    ],
    risks: [
      {
        id: "RISK001",
        category: "مالي",
        title: "مخاطر التقلبات السعرية",
        description: "عدم وجود آلية لحماية من التقلبات السعرية في السوق",
        probability: 70,
        impact: 60,
        riskScore: 4.2,
        mitigation: [
          "إضافة بند لمراجعة الأسعار ربع سنوياً",
          "تحديد حد أقصى للزيادات السعرية",
          "ربط الأسعار بمؤشرات السوق المعترف بها"
        ],
        timeline: "3 أشهر"
      }
    ],
    missingClauses: [
      "بند حل النزاعات البديل",
      "شروط القوة القاهرة المحدثة",
      "آلية مراجعة الأداء الدورية"
    ],
    strengths: [
      "معايير جودة واضحة ومفصلة",
      "شروط تسليم محددة",
      "آليات ضمان الأداء"
    ]
  };

  const sampleAlerts: SmartAlert[] = [
    {
      id: "ALERT001",
      type: "renewal",
      title: "تجديد عقد المواد الكيميائية",
      description: "عقد توريد المواد الكيميائية ينتهي خلال 30 يوم",
      priority: "مرتفع",
      dueDate: new Date(2024, 4, 15),
      contractId: "CONT-001",
      actions: ["بدء مفاوضات التجديد", "مراجعة الأداء", "تحديث الشروط"],
      automated: true
    },
    {
      id: "ALERT002",
      type: "compliance",
      title: "مراجعة الامتثال الربع سنوية",
      description: "حان وقت مراجعة امتثال المورد للمعايير المتفق عليها",
      priority: "متوسط",
      dueDate: new Date(2024, 3, 30),
      contractId: "CONT-002",
      actions: ["إجراء تقييم الامتثال", "إعداد التقرير", "تحديد خطة التحسين"],
      automated: false
    }
  ];

  const runContractAnalysis = async () => {
    if (!selectedContract) {
      toast({
        title: "يرجى اختيار عقد",
        description: "اختر عقداً لبدء التحليل بالذكاء الاصطناعي",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);

    // Simulate AI analysis progress
    const progressSteps = [
      { progress: 15, message: "تحليل نص العقد..." },
      { progress: 30, message: "استخراج البنود الرئيسية..." },
      { progress: 45, message: "تقييم المخاطر القانونية..." },
      { progress: 60, message: "مراجعة الامتثال..." },
      { progress: 75, message: "تحليل الشروط التجارية..." },
      { progress: 90, message: "إنشاء التوصيات..." },
      { progress: 100, message: "اكتمل التحليل!" }
    ];

    for (const step of progressSteps) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setAnalysisProgress(step.progress);
    }

    setContractAnalysis(sampleAnalysis);
    setSmartAlerts(sampleAlerts);
    setIsAnalyzing(false);

    toast({
      title: "اكتمل تحليل العقد",
      description: "تم إنشاء تحليل شامل للعقد مع التوصيات والمخاطر",
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "منخفض": return "bg-green-100 text-green-800 border-green-200";
      case "متوسط": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "مرتفع": return "bg-orange-100 text-orange-800 border-orange-200";
      case "حرج": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getFindingIcon = (type: string) => {
    switch (type) {
      case "risk": return AlertTriangle;
      case "opportunity": return Target;
      case "issue": return XCircle;
      case "strength": return CheckCircle;
      default: return Info;
    }
  };

  const getFindingColor = (type: string) => {
    switch (type) {
      case "risk": return "from-red-500 to-red-600";
      case "opportunity": return "from-blue-500 to-blue-600";
      case "issue": return "from-orange-500 to-orange-600";
      case "strength": return "from-green-500 to-green-600";
      default: return "from-gray-500 to-gray-600";
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

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "renewal": return Calendar;
      case "payment": return DollarSign;
      case "milestone": return Target;
      case "compliance": return Shield;
      case "performance": return BarChart3;
      default: return Bell;
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Contract Analysis Header */}
      <Card className="border-0 shadow-xl bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl">
              <Scale className="w-6 h-6 text-white" />
            </div>
            تحليل العقود بالذكاء الاصطناعي
          </CardTitle>
          <CardDescription className="text-base">
            تحليل شامل ومتقدم للعقود والاتفاقيات باستخدام تقنيات الذكاء الاصطناعي والمراجعة القانونية التلقائية
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contract">اختيار العقد للتحليل</Label>
              <select
                id="contract"
                value={selectedContract}
                onChange={(e) => setSelectedContract(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
              >
                <option value="">اختر عقداً للتحليل</option>
                {contracts.map((contract) => (
                  <option key={contract.id} value={contract.id}>
                    {contract.name} - {contract.supplier}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end gap-2">
              <Button
                onClick={runContractAnalysis}
                disabled={isAnalyzing || !selectedContract}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    جاري التحليل...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    تحليل ذكي
                  </>
                )}
              </Button>
              <Button variant="outline" className="px-4">
                <Upload className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Contract Text Input */}
          <div>
            <Label htmlFor="contractText">نص العقد (اختياري)</Label>
            <Textarea
              id="contractText"
              value={contractText}
              onChange={(e) => setContractText(e.target.value)}
              placeholder="يمكنك لصق نص العقد هنا للحصول على تحليل أدق..."
              rows={4}
              className="bg-white"
            />
          </div>

          {isAnalyzing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>تقدم التحليل</span>
                <span>{analysisProgress}%</span>
              </div>
              <Progress value={analysisProgress} className="h-3" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {contractAnalysis && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-white shadow-lg rounded-xl">
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              التحليل العام
            </TabsTrigger>
            <TabsTrigger value="findings" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              النتائج والمخاطر
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              التوصيات
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              التنبيهات الذكية
            </TabsTrigger>
            <TabsTrigger value="compliance" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              الامتثال
            </TabsTrigger>
          </TabsList>

          {/* Analysis Overview Tab */}
          <TabsContent value="analysis" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Overall Score */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#e5e7eb"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#8b5cf6"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${(contractAnalysis.overallScore / 10) * 251.2} 251.2`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-purple-600">
                        {contractAnalysis.overallScore}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-1">التقييم الإجمالي</h3>
                  <p className="text-sm text-gray-600">من 10</p>
                  <Badge className={`mt-2 ${getRiskLevelColor(contractAnalysis.riskLevel)}`}>
                    مستوى المخاطر: {contractAnalysis.riskLevel}
                  </Badge>
                </CardContent>
              </Card>

              {/* Score Breakdown */}
              <Card className="border-0 shadow-lg md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                    تفصيل النقاط
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: "الامتثال", value: contractAnalysis.compliance, icon: Shield },
                    { label: "الوضوح", value: contractAnalysis.clarity, icon: Eye },
                    { label: "العدالة", value: contractAnalysis.fairness, icon: Scale },
                    { label: "الاكتمال", value: contractAnalysis.completeness, icon: CheckCircle }
                  ].map((metric) => (
                    <div key={metric.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <metric.icon className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium">{metric.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={(metric.value / 10) * 100} className="w-24 h-2" />
                        <span className={`text-sm font-bold ${getScoreColor(metric.value)}`}>
                          {metric.value}
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Quick Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                    <div>
                      <h4 className="font-bold text-green-800">نقاط القوة</h4>
                      <p className="text-sm text-green-600">{contractAnalysis.strengths.length} نقطة</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-50 to-red-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-8 h-8 text-orange-600" />
                    <div>
                      <h4 className="font-bold text-orange-800">المخاطر</h4>
                      <p className="text-sm text-orange-600">{contractAnalysis.risks.length} مخاطر محددة</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Lightbulb className="w-8 h-8 text-blue-600" />
                    <div>
                      <h4 className="font-bold text-blue-800">التوصيات</h4>
                      <p className="text-sm text-blue-600">{contractAnalysis.recommendations.length} توصية</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Findings and Risks Tab */}
          <TabsContent value="findings" className="space-y-4">
            <div className="grid gap-4">
              {contractAnalysis.keyFindings.map((finding) => {
                const IconComponent = getFindingIcon(finding.type);
                
                return (
                  <Card key={finding.id} className="border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${getFindingColor(finding.type)}`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-lg text-gray-900">{finding.title}</h3>
                            <Badge className={getRiskLevelColor(finding.severity)}>
                              {finding.severity}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-3">{finding.description}</p>
                          <div className="bg-gray-50 rounded-lg p-3 mb-3">
                            <p className="text-sm text-gray-700">
                              <strong>البند المرجعي:</strong> {finding.clause}
                            </p>
                          </div>
                          <div className="bg-blue-50 rounded-lg p-3">
                            <p className="text-sm text-blue-700">
                              <strong>الاقتراح:</strong> {finding.suggestion}
                            </p>
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <span className="text-sm text-gray-500">{finding.category}</span>
                            <div className="flex items-center gap-1">
                              <span className="text-sm text-gray-500">الثقة:</span>
                              <span className="text-sm font-medium">{finding.confidence}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-4">
            <div className="grid gap-4">
              {contractAnalysis.recommendations.map((recommendation) => (
                <Card key={recommendation.id} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-lg text-gray-900">{recommendation.title}</h3>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(recommendation.priority)}>
                          {recommendation.priority}
                        </Badge>
                        <Badge variant="outline">
                          {recommendation.type === "amendment" ? "تعديل" :
                           recommendation.type === "addition" ? "إضافة" :
                           recommendation.type === "removal" ? "حذف" : "توضيح"}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{recommendation.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-yellow-50 rounded-lg p-3">
                        <h4 className="font-medium text-yellow-800 mb-1">المبرر:</h4>
                        <p className="text-sm text-yellow-700">{recommendation.rationale}</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3">
                        <h4 className="font-medium text-green-800 mb-1">التأثير المتوقع:</h4>
                        <p className="text-sm text-green-700">{recommendation.impact}</p>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 rounded-lg p-3">
                      <h4 className="font-medium text-blue-800 mb-1">طريقة التنفيذ:</h4>
                      <p className="text-sm text-blue-700">{recommendation.implementation}</p>
                    </div>
                    
                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        عرض التفاصيل
                      </Button>
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        تطبيق التوصية
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Smart Alerts Tab */}
          <TabsContent value="alerts" className="space-y-4">
            <div className="grid gap-4">
              {smartAlerts.map((alert) => {
                const IconComponent = getAlertIcon(alert.type);
                
                return (
                  <Card key={alert.id} className="border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-600">
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-lg text-gray-900">{alert.title}</h3>
                            <div className="flex items-center gap-2">
                              <Badge className={getPriorityColor(alert.priority)}>
                                {alert.priority}
                              </Badge>
                              {alert.automated && (
                                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                  تلقائي
                                </Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-gray-600 mb-3">{alert.description}</p>
                          <div className="flex items-center gap-2 mb-3">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">
                              تاريخ الاستحقاق: {alert.dueDate.toLocaleDateString('ar-SA')}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {alert.actions.map((action, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {action}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm">
                              تأجيل
                            </Button>
                            <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                              اتخاذ إجراء
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Missing Clauses */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-600" />
                    البنود المفقودة
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {contractAnalysis.missingClauses.map((clause, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-red-700">{clause}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Strengths */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    نقاط القوة
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {contractAnalysis.strengths.map((strength, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-700">{strength}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default AIContractManagement;