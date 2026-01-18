import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { 
  TrendingUp, 
  TrendingDown, 
  Brain, 
  Target, 
  AlertTriangle, 
  CheckCircle,
  Calendar,
  Users,
  FileText,
  Activity,
  BarChart3,
  LineChart,
  PieChart,
  Zap,
  Eye,
  Download,
  RefreshCw,
  Lightbulb,
  Shield,
  Clock,
  Award,
  ArrowUp,
  ArrowDown,
  Minus
} from "lucide-react";

interface AnalyticsData {
  metric: string;
  current: number;
  previous: number;
  trend: 'up' | 'down' | 'stable';
  prediction: number;
  confidence: number;
  insights: string[];
  recommendations: string[];
}

interface RiskAssessment {
  employee: string;
  department: string;
  riskLevel: 'high' | 'medium' | 'low';
  factors: string[];
  score: number;
  recommendations: string[];
}

interface PredictionModel {
  name: string;
  accuracy: number;
  lastUpdated: string;
  predictions: {
    metric: string;
    timeframe: string;
    value: number;
    confidence: number;
  }[];
}

const AIAnalytics = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [timeframe, setTimeframe] = useState("monthly");
  const [isLoading, setIsLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [riskAssessments, setRiskAssessments] = useState<RiskAssessment[]>([]);
  const [predictionModels, setPredictionModels] = useState<PredictionModel[]>([]);

  useEffect(() => {
    loadAnalyticsData();
  }, [timeframe]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    
    // Simulate AI analytics processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockAnalytics: AnalyticsData[] = [
      {
        metric: "معدل اكتمال الملفات",
        current: 91,
        previous: 87,
        trend: 'up',
        prediction: 94,
        confidence: 89,
        insights: [
          "زيادة 4% في معدل الإكمال خلال الشهر الماضي",
          "أعلى نسبة تحسن في قسم الصيانة (+8%)",
          "انخفاض طفيف في قسم الاستقبال (-2%)"
        ],
        recommendations: [
          "تكثيف جهود جمع الوثائق في قسم الاستقبال",
          "تطبيق نفس استراتيجية قسم الصيانة في الأقسام الأخرى",
          "إرسال تذكيرات أسبوعية للموظفين الجدد"
        ]
      },
      {
        metric: "انتهاء الوثائق",
        current: 8,
        previous: 12,
        trend: 'down',
        prediction: 5,
        confidence: 92,
        insights: [
          "انخفاض 33% في عدد الوثائق المنتهية",
          "فعالية نظام التنبيهات المبكرة",
          "تحسن في معدل التجديد المبكر"
        ],
        recommendations: [
          "مواصلة تطبيق نظام التنبيهات المبكرة",
          "توسيع فترة التنبيه إلى 60 يوماً للوثائق الحساسة",
          "إنشاء نظام تجديد تلقائي حيث أمكن"
        ]
      },
      {
        metric: "معدل دقة البيانات",
        current: 95,
        previous: 92,
        trend: 'up',
        prediction: 97,
        confidence: 87,
        insights: [
          "تحسن كبير في دقة إدخال البيانات",
          "انخفاض الأخطاء البشرية بنسبة 15%",
          "فعالية نظام التحقق التلقائي"
        ],
        recommendations: [
          "توسيع استخدام أدوات التحقق التلقائي",
          "تدريب إضافي للموظفين على إدخال البيانات",
          "تطبيق مراجعة مزدوجة للبيانات الحساسة"
        ]
      },
      {
        metric: "وقت معالجة الطلبات",
        current: 2.5,
        previous: 4.2,
        trend: 'down',
        prediction: 1.8,
        confidence: 85,
        insights: [
          "تحسن 40% في سرعة معالجة الطلبات",
          "أتمتة العمليات وفرت 1.7 يوم في المتوسط",
          "انخفاض الطلبات المعلقة بنسبة 60%"
        ],
        recommendations: [
          "أتمتة المزيد من العمليات الروتينية",
          "تحسين تدفق العمل بين الأقسام",
          "تطبيق نظام أولويات ذكي للطلبات"
        ]
      }
    ];

    const mockRiskAssessments: RiskAssessment[] = [
      {
        employee: "أحمد محمد العتيبي",
        department: "الصيانة",
        riskLevel: 'high',
        score: 78,
        factors: [
          "انتهاء الإقامة خلال 15 يوم",
          "تأخر في تجديد رخصة القيادة",
          "ملف طبي غير محدث"
        ],
        recommendations: [
          "التواصل الفوري لتجديد الإقامة",
          "جدولة موعد للفحص الطبي",
          "متابعة إجراءات تجديد الرخصة"
        ]
      },
      {
        employee: "فاطمة علي الأحمدي",
        department: "الاستقبال",
        riskLevel: 'medium',
        score: 45,
        factors: [
          "نقص في الشهادات العلمية",
          "عدم توفر بيانات الخبرة السابقة",
          "ملف شخصي غير مكتمل بنسبة 78%"
        ],
        recommendations: [
          "طلب تقديم الشهادات الناقصة",
          "جمع بيانات الخبرة السابقة",
          "تحديث البيانات الشخصية"
        ]
      },
      {
        employee: "محمد سعد القحطاني",
        department: "المالية",
        riskLevel: 'low',
        score: 15,
        factors: [
          "جميع الوثائق محدثة",
          "ملف مكتمل 100%",
          "تقييم أداء ممتاز"
        ],
        recommendations: [
          "لا توجد إجراءات مطلوبة حالياً",
          "مراجعة دورية كل 6 أشهر"
        ]
      }
    ];

    const mockPredictionModels: PredictionModel[] = [
      {
        name: "نموذج التنبؤ بانتهاء الوثائق",
        accuracy: 94.5,
        lastUpdated: "2024-01-27",
        predictions: [
          { metric: "وثائق تنتهي الشهر القادم", timeframe: "30 يوم", value: 12, confidence: 91 },
          { metric: "وثائق تنتهي خلال 3 أشهر", timeframe: "90 يوم", value: 35, confidence: 87 },
          { metric: "ذروة انتهاء الوثائق", timeframe: "6 أشهر", value: 89, confidence: 83 }
        ]
      },
      {
        name: "نموذج تحليل معدل الإكمال",
        accuracy: 91.2,
        lastUpdated: "2024-01-26",
        predictions: [
          { metric: "معدل الإكمال المتوقع", timeframe: "شهر", value: 94, confidence: 89 },
          { metric: "عدد الملفات الناقصة", timeframe: "شهر", value: 18, confidence: 85 },
          { metric: "وقت الوصول لـ 95%", timeframe: "3 أشهر", value: 85, confidence: 82 }
        ]
      }
    ];

    setAnalyticsData(mockAnalytics);
    setRiskAssessments(mockRiskAssessments);
    setPredictionModels(mockPredictionModels);
    setIsLoading(false);

    toast({
      title: "تم تحديث التحليلات ✅",
      description: "تم تحليل البيانات وإنتاج التوقعات الجديدة",
    });
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <ArrowDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-slate-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return "text-green-600";
      case 'down':
        return "text-red-600";
      default:
        return "text-slate-600";
    }
  };

  const getRiskBadge = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800">عالي</Badge>;
      case 'medium':
        return <Badge className="bg-orange-100 text-orange-800">متوسط</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800">منخفض</Badge>;
      default:
        return <Badge variant="secondary">غير محدد</Badge>;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-green-600";
    if (confidence >= 70) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-indigo-50 to-purple-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">التحليلات الذكية والتنبؤات</CardTitle>
                <CardDescription className="text-lg">
                  تحليل متقدم للبيانات وتوقعات مستقبلية بالذكاء الاصطناعي
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">يومي</SelectItem>
                  <SelectItem value="weekly">أسبوعي</SelectItem>
                  <SelectItem value="monthly">شهري</SelectItem>
                  <SelectItem value="quarterly">ربع سنوي</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                onClick={loadAnalyticsData}
                disabled={isLoading}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                تحديث
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Analytics */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="predictions">التنبؤات</TabsTrigger>
          <TabsTrigger value="risks">تحليل المخاطر</TabsTrigger>
          <TabsTrigger value="insights">الرؤى الذكية</TabsTrigger>
          <TabsTrigger value="models">النماذج التنبؤية</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {analyticsData.map((data, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-sm text-slate-600">{data.metric}</h3>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(data.trend)}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-3xl font-bold text-slate-900">
                        {data.metric.includes('وقت') ? `${data.current} يوم` : 
                         data.metric.includes('معدل') ? `${data.current}%` : data.current}
                      </div>
                      <div className={`text-sm flex items-center gap-1 ${getTrendColor(data.trend)}`}>
                        {data.trend === 'up' ? '+' : data.trend === 'down' ? '-' : ''}
                        {Math.abs(data.current - data.previous)}
                        {data.metric.includes('معدل') ? '%' : ''}
                        <span className="text-slate-500">من الفترة السابقة</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">التنبؤ القادم:</span>
                        <span className="font-medium">
                          {data.metric.includes('وقت') ? `${data.prediction} يوم` : 
                           data.metric.includes('معدل') ? `${data.prediction}%` : data.prediction}
                        </span>
                      </div>
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                          <span>دقة التنبؤ</span>
                          <span>{data.confidence}%</span>
                        </div>
                        <Progress value={data.confidence} className="h-1" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Insights */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                الرؤى السريعة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium text-green-600">✅ نقاط القوة</h4>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li>• تحسن مستمر في معدل اكتمال الملفات (+4%)</li>
                    <li>• انخفاض كبير في الوثائق المنتهية (-33%)</li>
                    <li>• تحسن في سرعة معالجة الطلبات (-40% في الوقت)</li>
                    <li>• ارتفاع دقة البيانات إلى 95%</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium text-orange-600">⚠️ نقاط تحتاج تحسين</h4>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li>• قسم الاستقبال يحتاج دعم إضافي</li>
                    <li>• 8 وثائق ما زالت تنتهي قريباً</li>
                    <li>• بعض الملفات تحتاج تحديث البيانات</li>
                    <li>• فرصة لأتمتة المزيد من العمليات</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Predictions Tab */}
        <TabsContent value="predictions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {predictionModels.map((model, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{model.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-purple-100 text-purple-800">
                        دقة {model.accuracy}%
                      </Badge>
                      <Badge variant="outline">
                        {model.lastUpdated}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {model.predictions.map((prediction, predIndex) => (
                      <div key={predIndex} className="p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">{prediction.metric}</h4>
                          <Badge variant="outline">{prediction.timeframe}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-2xl font-bold text-purple-600">
                            {prediction.value}
                          </div>
                          <div className={`text-sm ${getConfidenceColor(prediction.confidence)}`}>
                            ثقة {prediction.confidence}%
                          </div>
                        </div>
                        <Progress value={prediction.confidence} className="h-1 mt-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Risk Analysis Tab */}
        <TabsContent value="risks" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-500" />
                تحليل المخاطر والتنبيهات
              </CardTitle>
              <CardDescription>
                تحليل ذكي للمخاطر المحتملة والإجراءات الوقائية المطلوبة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {riskAssessments.map((risk, index) => (
                  <Card key={index} className="border-l-4 border-l-red-500 hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{risk.employee}</h3>
                          <p className="text-slate-600">{risk.department}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          {getRiskBadge(risk.riskLevel)}
                          <div className="text-right">
                            <div className="text-2xl font-bold text-red-600">{risk.score}</div>
                            <div className="text-xs text-slate-500">درجة المخاطر</div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-2 text-red-600">عوامل المخاطر:</h4>
                          <ul className="space-y-1 text-sm">
                            {risk.factors.map((factor, factorIndex) => (
                              <li key={factorIndex} className="flex items-center gap-2">
                                <AlertTriangle className="w-3 h-3 text-red-500" />
                                {factor}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2 text-blue-600">الإجراءات المطلوبة:</h4>
                          <ul className="space-y-1 text-sm">
                            {risk.recommendations.map((rec, recIndex) => (
                              <li key={recIndex} className="flex items-center gap-2">
                                <CheckCircle className="w-3 h-3 text-blue-500" />
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {analyticsData.map((data, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">{data.metric}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Eye className="w-4 h-4 text-blue-500" />
                        الرؤى المكتشفة
                      </h4>
                      <ul className="space-y-2">
                        {data.insights.map((insight, insightIndex) => (
                          <li key={insightIndex} className="text-sm text-slate-600 flex items-start gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            {insight}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Target className="w-4 h-4 text-green-500" />
                        التوصيات الذكية
                      </h4>
                      <ul className="space-y-2">
                        {data.recommendations.map((rec, recIndex) => (
                          <li key={recIndex} className="text-sm text-slate-600 flex items-start gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Models Tab */}
        <TabsContent value="models" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">نموذج التصنيف</h3>
                    <p className="text-sm text-slate-600">تصنيف الوثائق تلقائياً</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>الدقة</span>
                    <span className="font-medium">96.2%</span>
                  </div>
                  <Progress value={96.2} className="h-2" />
                  <div className="text-xs text-slate-500">آخر تحديث: اليوم</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <LineChart className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">نموذج التنبؤ</h3>
                    <p className="text-sm text-slate-600">توقع الاتجاهات المستقبلية</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>الدقة</span>
                    <span className="font-medium">89.7%</span>
                  </div>
                  <Progress value={89.7} className="h-2" />
                  <div className="text-xs text-slate-500">آخر تحديث: أمس</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <PieChart className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">نموذج المخاطر</h3>
                    <p className="text-sm text-slate-600">تحليل وتقييم المخاطر</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>الدقة</span>
                    <span className="font-medium">92.4%</span>
                  </div>
                  <Progress value={92.4} className="h-2" />
                  <div className="text-xs text-slate-500">آخر تحديث: منذ ساعتين</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Model Performance */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                أداء النماذج التنبؤية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-green-800">أداء ممتاز</h4>
                    <Badge className="bg-green-100 text-green-800">+2.1%</Badge>
                  </div>
                  <p className="text-sm text-green-700">
                    تحسن في دقة النماذج بنسبة 2.1% خلال الأسبوع الماضي. جميع النماذج تعمل بكفاءة عالية.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">847</div>
                    <div className="text-sm text-slate-600">تنبؤات صحيحة</div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">94.2%</div>
                    <div className="text-sm text-slate-600">متوسط الدقة</div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">1.2s</div>
                    <div className="text-sm text-slate-600">متوسط وقت المعالجة</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          تصدير التحليلات
        </Button>
        <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 flex items-center gap-2">
          <Zap className="w-4 h-4" />
          تشغيل تحليل شامل
        </Button>
      </div>
    </div>
  );
};

export default AIAnalytics;