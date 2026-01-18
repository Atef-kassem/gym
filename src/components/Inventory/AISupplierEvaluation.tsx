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
  Bot,
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Star,
  Zap,
  Target,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  Sparkles,
  Award,
  ThumbsUp,
  ThumbsDown,
  Clock,
  Calendar,
  DollarSign,
  Package,
  Shield,
  Users,
  MessageSquare,
  FileText,
  Search,
  Lightbulb,
  Cpu,
  Eye,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AIInsight {
  id: string;
  type: "performance" | "risk" | "opportunity" | "prediction" | "recommendation";
  title: string;
  description: string;
  confidence: number;
  impact: "high" | "medium" | "low";
  category: string;
  trend: "up" | "down" | "stable";
  value?: number;
  recommendation?: string;
  priority: "urgent" | "high" | "medium" | "low";
}

interface AIEvaluationScore {
  criterion: string;
  currentScore: number;
  aiRecommendedScore: number;
  reasoning: string;
  confidence: number;
  factors: string[];
}

interface SupplierRiskAssessment {
  overall: number;
  financial: number;
  operational: number;
  compliance: number;
  market: number;
  factors: string[];
  mitigation: string[];
}

interface PredictiveAnalysis {
  nextQuarterPerformance: number;
  contractRenewalLikelihood: number;
  riskTrend: "increasing" | "decreasing" | "stable";
  keyFactors: string[];
}

const AISupplierEvaluation = () => {
  const { toast } = useToast();
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [aiScores, setAiScores] = useState<AIEvaluationScore[]>([]);
  const [riskAssessment, setRiskAssessment] = useState<SupplierRiskAssessment | null>(null);
  const [predictiveAnalysis, setPredictiveAnalysis] = useState<PredictiveAnalysis | null>(null);
  const [activeAnalysisTab, setActiveAnalysisTab] = useState("insights");

  // Sample data
  const suppliers = [
    { id: "1", name: "شركة الأولى للمواد الكيميائية", category: "مواد كيميائية" },
    { id: "2", name: "مؤسسة النجاح لقطع   ", category: "مشروب ومنتجات" },
    { id: "3", name: "شركة التميز للزيوت", category: "زيوت ومواد تشحيم" },
  ];

  // Sample AI insights
  const sampleInsights: AIInsight[] = [
    {
      id: "1",
      type: "performance",
      title: "تحسن ملحوظ في الأداء",
      description: "المورد يظهر تحسناً مستمراً في جودة المنتجات خلال الأشهر الثلاثة الماضية",
      confidence: 92,
      impact: "high",
      category: "جودة المنتجات",
      trend: "up",
      value: 4.3,
      priority: "medium"
    },
    {
      id: "2",
      type: "risk",
      title: "مخاطر التأخير في التسليم",
      description: "تم رصد زيادة في التأخيرات خلال الشهر الماضي قد تؤثر على العمليات",
      confidence: 87,
      impact: "medium",
      category: "الالتزام بالمواعيد",
      trend: "down",
      value: 2.8,
      priority: "high"
    },
    {
      id: "3",
      type: "opportunity",
      title: "فرصة تحسين الأسعار",
      description: "إمكانية التفاوض للحصول على أسعار أفضل بناءً على حجم الطلبات",
      confidence: 78,
      impact: "high",
      category: "الأسعار والتكلفة",
      trend: "stable",
      recommendation: "بدء مفاوضات الأسعار",
      priority: "medium"
    },
    {
      id: "4",
      type: "prediction",
      title: "توقع استقرار الأداء",
      description: "النماذج تتوقع استقرار الأداء الحالي للمورد خلال الربع القادم",
      confidence: 85,
      impact: "medium",
      category: "التنبؤات",
      trend: "stable",
      value: 4.1,
      priority: "low"
    }
  ];

  const sampleAIScores: AIEvaluationScore[] = [
    {
      criterion: "جودة المنتجات/الخدمة",
      currentScore: 3.5,
      aiRecommendedScore: 4.2,
      reasoning: "بناءً على تحليل شكاوى العملاء وتقارير الجودة، يُنصح برفع التقييم",
      confidence: 89,
      factors: ["انخفاض الشكاوى 30%", "تحسن معايير الجودة", "شهادات جودة جديدة"]
    },
    {
      criterion: "الالتزام بالمواعيد",
      currentScore: 4.0,
      aiRecommendedScore: 3.2,
      reasoning: "زيادة في التأخيرات خلال الشهر الماضي تستدعي خفض التقييم",
      confidence: 92,
      factors: ["تأخير 15% من الطلبات", "مشاكل في سلسلة التوريد", "عوامل خارجية"]
    },
    {
      criterion: "الأسعار والتكلفة",
      currentScore: 3.0,
      aiRecommendedScore: 3.8,
      reasoning: "مقارنة بالسوق، الأسعار تبدو تنافسية أكثر من التقييم الحالي",
      confidence: 76,
      factors: ["أسعار أقل من المتوسط 12%", "شروط دفع مرنة", "خصومات الكمية"]
    }
  ];

  const sampleRiskAssessment: SupplierRiskAssessment = {
    overall: 3.2,
    financial: 4.1,
    operational: 2.8,
    compliance: 4.5,
    market: 2.9,
    factors: [
      "تذبذب في الأداء التشغيلي",
      "تغيرات في السوق المحلي",
      "اعتماد على مورد واحد للمواد الخام"
    ],
    mitigation: [
      "تنويع قاعدة الموردين",
      "وضع خطط طوارئ",
      "مراقبة دورية للأداء"
    ]
  };

  const samplePredictiveAnalysis: PredictiveAnalysis = {
    nextQuarterPerformance: 4.3,
    contractRenewalLikelihood: 85,
    riskTrend: "stable",
    keyFactors: [
      "استقرار الطلب",
      "تحسن في العمليات الداخلية",
      "علاقات جيدة مع العملاء"
    ]
  };

  const runAIAnalysis = async () => {
    if (!selectedSupplier) {
      toast({
        title: "يرجى اختيار مورد",
        description: "اختر مورداً لبدء التحليل بالذكاء الاصطناعي",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);

    // Simulate AI analysis progress
    const progressSteps = [
      { progress: 20, message: "تحليل البيانات التاريخية..." },
      { progress: 40, message: "تقييم المخاطر..." },
      { progress: 60, message: "تحليل الاتجاهات..." },
      { progress: 80, message: "إنشاء التوصيات..." },
      { progress: 100, message: "اكتمل التحليل!" }
    ];

    for (const step of progressSteps) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setAnalysisProgress(step.progress);
    }

    // Set analysis results
    setAiInsights(sampleInsights);
    setAiScores(sampleAIScores);
    setRiskAssessment(sampleRiskAssessment);
    setPredictiveAnalysis(samplePredictiveAnalysis);
    setIsAnalyzing(false);

    toast({
      title: "اكتمل التحليل بنجاح",
      description: "تم إنشاء تحليل شامل بالذكاء الاصطناعي للمورد المختار",
    });
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "performance": return TrendingUp;
      case "risk": return AlertTriangle;
      case "opportunity": return Target;
      case "prediction": return Brain;
      case "recommendation": return Lightbulb;
      default: return Activity;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case "performance": return "from-green-500 to-emerald-600";
      case "risk": return "from-red-500 to-pink-600";
      case "opportunity": return "from-blue-500 to-cyan-600";
      case "prediction": return "from-purple-500 to-violet-600";
      case "recommendation": return "from-yellow-500 to-orange-600";
      default: return "from-gray-500 to-slate-600";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return TrendingUp;
      case "down": return TrendingDown;
      default: return Activity;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-100 text-red-800 border-red-200";
      case "high": return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Analysis Header */}
      <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <Brain className="w-6 h-6 text-white" />
            </div>
            تحليل المورد بالذكاء الاصطناعي
          </CardTitle>
          <CardDescription className="text-base">
            تحليل شامل ومتقدم لأداء المورد باستخدام تقنيات الذكاء الاصطناعي والتعلم الآلي
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="supplier">اختيار المورد</Label>
              <select
                id="supplier"
                value={selectedSupplier}
                onChange={(e) => setSelectedSupplier(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">اختر مورداً للتحليل</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name} - {supplier.category}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={runAIAnalysis}
                disabled={isAnalyzing || !selectedSupplier}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    جاري التحليل...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    بدء التحليل الذكي
                  </>
                )}
              </Button>
            </div>
          </div>

          {isAnalyzing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>تقدم التحليل</span>
                <span>{analysisProgress}%</span>
              </div>
              <Progress value={analysisProgress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Analysis Results */}
      {aiInsights.length > 0 && (
        <Tabs value={activeAnalysisTab} onValueChange={setActiveAnalysisTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              الرؤى الذكية
            </TabsTrigger>
            <TabsTrigger value="scores" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              التقييم الذكي
            </TabsTrigger>
            <TabsTrigger value="risks" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              تقييم المخاطر
            </TabsTrigger>
            <TabsTrigger value="predictions" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              التنبؤات
            </TabsTrigger>
          </TabsList>

          {/* AI Insights Tab */}
          <TabsContent value="insights" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiInsights.map((insight) => {
                const IconComponent = getInsightIcon(insight.type);
                const TrendIconComponent = getTrendIcon(insight.trend);
                
                return (
                  <Card key={insight.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${getInsightColor(insight.type)}`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getPriorityColor(insight.priority)}>
                            {insight.priority === "urgent" ? "عاجل" : 
                             insight.priority === "high" ? "مرتفع" :
                             insight.priority === "medium" ? "متوسط" : "منخفض"}
                          </Badge>
                          <TrendIconComponent className={`w-4 h-4 ${
                            insight.trend === "up" ? "text-green-500" :
                            insight.trend === "down" ? "text-red-500" : "text-gray-500"
                          }`} />
                        </div>
                      </div>
                      
                      <h3 className="font-bold text-lg text-gray-900 mb-2">
                        {insight.title}
                      </h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {insight.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">الثقة:</span>
                          <div className="flex items-center gap-1">
                            <Progress value={insight.confidence} className="w-16 h-2" />
                            <span className="text-sm font-medium">{insight.confidence}%</span>
                          </div>
                        </div>
                        {insight.value && (
                          <div className="text-right">
                            <span className="text-2xl font-bold text-gray-900">{insight.value}</span>
                            <span className="text-sm text-gray-500 mr-1">من 5</span>
                          </div>
                        )}
                      </div>
                      
                      {insight.recommendation && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Lightbulb className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-800">التوصية:</span>
                          </div>
                          <p className="text-sm text-blue-700">{insight.recommendation}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* AI Scores Tab */}
          <TabsContent value="scores" className="space-y-4">
            <div className="grid gap-4">
              {aiScores.map((score, index) => (
                <Card key={index} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-lg text-gray-900">{score.criterion}</h3>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Cpu className="w-3 h-3" />
                        الثقة: {score.confidence}%
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-500 mb-1">التقييم الحالي</p>
                        <div className="text-3xl font-bold text-blue-600">{score.currentScore}</div>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-500 mb-1">التقييم المقترح بالذكاء الاصطناعي</p>
                        <div className={`text-3xl font-bold ${
                          score.aiRecommendedScore > score.currentScore ? "text-green-600" : 
                          score.aiRecommendedScore < score.currentScore ? "text-red-600" : "text-gray-600"
                        }`}>
                          {score.aiRecommendedScore}
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-500 mb-1">الفرق</p>
                        <div className={`text-2xl font-bold ${
                          score.aiRecommendedScore > score.currentScore ? "text-green-600" : 
                          score.aiRecommendedScore < score.currentScore ? "text-red-600" : "text-gray-600"
                        }`}>
                          {score.aiRecommendedScore > score.currentScore ? "+" : ""}
                          {(score.aiRecommendedScore - score.currentScore).toFixed(1)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        تفسير الذكاء الاصطناعي:
                      </h4>
                      <p className="text-gray-700">{score.reasoning}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        العوامل المؤثرة:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {score.factors.map((factor, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {factor}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Risk Assessment Tab */}
          <TabsContent value="risks" className="space-y-4">
            {riskAssessment && (
              <div className="grid gap-6">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-red-600" />
                      تقييم المخاطر الشامل
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div className="text-center">
                        <div className="relative w-24 h-24 mx-auto mb-3">
                          <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full opacity-20"></div>
                          <div className="flex items-center justify-center w-full h-full">
                            <span className="text-2xl font-bold text-red-600">
                              {riskAssessment.overall.toFixed(1)}
                            </span>
                          </div>
                        </div>
                        <p className="font-medium text-gray-900">المخاطر الإجمالية</p>
                        <p className="text-sm text-gray-500">من 5</p>
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-900">تفصيل المخاطر:</h4>
                        <div className="space-y-2">
                          {[
                            { label: "مالية", value: riskAssessment.financial },
                            { label: "تشغيلية", value: riskAssessment.operational },
                            { label: "امتثال", value: riskAssessment.compliance },
                            { label: "سوقية", value: riskAssessment.market }
                          ].map((risk) => (
                            <div key={risk.label} className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">{risk.label}</span>
                              <div className="flex items-center gap-2">
                                <Progress value={(risk.value / 5) * 100} className="w-20 h-2" />
                                <span className="text-sm font-medium w-8">{risk.value}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-900">عوامل المخاطر:</h4>
                        <div className="space-y-1">
                          {riskAssessment.factors.map((factor, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <AlertTriangle className="w-3 h-3 text-orange-500" />
                              <span className="text-xs text-gray-600">{factor}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        استراتيجيات التخفيف:
                      </h4>
                      <div className="space-y-1">
                        {riskAssessment.mitigation.map((strategy, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-green-600" />
                            <span className="text-sm text-green-700">{strategy}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Predictions Tab */}
          <TabsContent value="predictions" className="space-y-4">
            {predictiveAnalysis && (
              <div className="grid gap-6">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="w-5 h-5 text-purple-600" />
                      التحليل التنبؤي والتوقعات
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                        <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <div className="text-3xl font-bold text-blue-600 mb-1">
                          {predictiveAnalysis.nextQuarterPerformance}
                        </div>
                        <p className="text-sm text-gray-600">الأداء المتوقع للربع القادم</p>
                      </div>
                      
                      <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                        <Award className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <div className="text-3xl font-bold text-green-600 mb-1">
                          {predictiveAnalysis.contractRenewalLikelihood}%
                        </div>
                        <p className="text-sm text-gray-600">احتمالية تجديد العقد</p>
                      </div>
                      
                      <div className="text-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl">
                        <Activity className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                        <div className="text-xl font-bold text-orange-600 mb-1">
                          {predictiveAnalysis.riskTrend === "stable" ? "مستقر" : 
                           predictiveAnalysis.riskTrend === "increasing" ? "متزايد" : "متناقص"}
                        </div>
                        <p className="text-sm text-gray-600">اتجاه المخاطر</p>
                      </div>
                    </div>
                    
                    <div className="bg-purple-50 rounded-lg p-4">
                      <h4 className="font-medium text-purple-800 mb-3 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" />
                        العوامل الرئيسية المؤثرة:
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {predictiveAnalysis.keyFactors.map((factor, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-purple-600" />
                            <span className="text-sm text-purple-700">{factor}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default AISupplierEvaluation;