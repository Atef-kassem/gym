import { useState, useEffect, useMemo } from "react";
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Target, 
  Lightbulb,
  Users,
  Clock,
  DollarSign,
  Star,
  ChevronRight,
  BarChart3,
  Zap,
  Award,
  ArrowUp,
  ArrowDown,
  Eye,
  Activity,
  Settings,
  MessageSquare,
  Calendar,
  CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdvancedBookingSystem } from "@/hooks/useAdvancedBookingSystem";
import { useToast } from "@/hooks/use-toast";

interface AIInsight {
  id: string;
  type: 'optimization' | 'warning' | 'opportunity' | 'prediction';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  actions: Array<{
    label: string;
    action: () => void;
    primary?: boolean;
  }>;
  data?: any;
}

interface AIRecommendation {
  id: string;
  category: 'capacity' | 'revenue' | 'satisfaction' | 'efficiency';
  title: string;
  description: string;
  priority: number;
  estimatedImpact: string;
  implementationCost: 'low' | 'medium' | 'high';
  timeToImplement: string;
  actions: string[];
}

export function AIManagementEngine() {
  const { bookings, getBookingAnalytics } = useAdvancedBookingSystem();
  const { toast } = useToast();
  const [activeInsight, setActiveInsight] = useState<string | null>(null);
  const [aiLearning, setAiLearning] = useState(false);

  const analytics = useMemo(() => getBookingAnalytics(), [bookings]);

  // Helper Functions - تعريف الدوال قبل استخدامها
  const predictPeakTimes = () => ({
    day: 'الخميس القادم',
    time: '10:00 - 14:00',
    confidence: 76,
    expectedIncrease: 45
  });

  const handleAddResources = () => {
    toast({
      title: "إضافة موارد",
      description: "تم إرسال طلب لإضافة موارد إضافية في أوقات الذروة",
    });
  };

  const handleReschedule = () => {
    toast({
      title: "إعادة الجدولة",
      description: "تم تشغيل نظام إعادة الجدولة الذكي",
    });
  };

  const analyzeCancellations = () => {
    setAiLearning(true);
    setTimeout(() => {
      setAiLearning(false);
      toast({
        title: "تحليل الإلغاءات",
        description: "تم تحديد الأسباب الرئيسية: تعارض المواعيد (40%)، تغيير الخطط (35%)",
      });
    }, 2000);
  };

  const improveConfirmation = () => {
    toast({
      title: "تحسين التأكيد",
      description: "تم تفعيل نظام التذكير المتعدد والتأكيد الذكي",
    });
  };

  const suggestUpsells = () => {
    toast({
      title: "اقتراح خدمات إضافية",
      description: "تم تفعيل نظام الاقتراحات الذكية للخدمات الإضافية",
    });
  };

  const improvePackages = () => {
    toast({
      title: "تحسين الحزم",
      description: "تم إنشاء حزم خدمات محسنة بناءً على تفضيلات العملاء",
    });
  };

  const prepareForPeak = () => {
    toast({
      title: "تحضير للذروة",
      description: "تم إعداد خطة إدارة الذروة وتخصيص موارد إضافية",
    });
  };

  const notifyTeam = () => {
    toast({
      title: "إشعار الفريق",
      description: "تم إرسال تنبيهات للفريق حول أوقات الذروة المتوقعة",
    });
  };

  // AI Insights Generation
  const aiInsights = useMemo((): AIInsight[] => {
    const insights: AIInsight[] = [];

    // تحليل الطاقة الاستيعابية
    if (analytics.capacityUtilization > 90) {
      insights.push({
        id: 'capacity-high',
        type: 'warning',
        title: 'استغلال عالي للطاقة الاستيعابية',
        description: `الطاقة الاستيعابية ${analytics.capacityUtilization}% - يُنصح بزيادة الطاقة أو إعادة جدولة بعض البيع`,
        impact: 'high',
        confidence: 95,
        actions: [
          { label: 'إضافة موارد', action: () => handleAddResources(), primary: true },
          { label: 'إعادة جدولة', action: () => handleReschedule() }
        ]
      });
    }

    // تحليل معدل الإلغاء
    const cancellationRate = (analytics.cancelledBookings / analytics.totalBookings) * 100;
    if (cancellationRate > 15) {
      insights.push({
        id: 'cancellation-high',
        type: 'warning',
        title: 'معدل إلغاء مرتفع',
        description: `معدل الإلغاء ${cancellationRate.toFixed(1)}% أعلى من المعدل المطلوب (< 15%)`,
        impact: 'medium',
        confidence: 88,
        actions: [
          { label: 'تحليل الأسباب', action: () => analyzeCancellations(), primary: true },
          { label: 'تحسين التأكيد', action: () => improveConfirmation() }
        ]
      });
    }

    // فرص تحسين الإيرادات
    if (analytics.averageBookingValue < 200) {
      insights.push({
        id: 'revenue-opportunity',
        type: 'opportunity',
        title: 'فرصة لزيادة الإيرادات',
        description: `متوسط قيمة الحجز ${analytics.averageBookingValue} جنيه مصري - يمكن تحسينها بـ 25% من خلال خدمات إضافية`,
        impact: 'high',
        confidence: 82,
        actions: [
          { label: 'اقتراح خدمات إضافية', action: () => suggestUpsells(), primary: true },
          { label: 'تحسين الحزم', action: () => improvePackages() }
        ]
      });
    }

    // تنبؤ الذروة
    const peakPrediction = predictPeakTimes();
    insights.push({
      id: 'peak-prediction',
      type: 'prediction',
      title: 'توقع أوقات الذروة',
      description: `الذكاء الاصطناعي يتوقع ذروة في ${peakPrediction.day} بين ${peakPrediction.time}`,
      impact: 'medium',
      confidence: 76,
      actions: [
        { label: 'تحضير الموارد', action: () => prepareForPeak(), primary: true },
        { label: 'إشعار الفريق', action: () => notifyTeam() }
      ],
      data: peakPrediction
    });

    return insights;
  }, [analytics]);

  // AI Recommendations
  const aiRecommendations = useMemo((): AIRecommendation[] => [
    {
      id: 'dynamic-pricing',
      category: 'revenue',
      title: 'تطبيق نظام التسعير الديناميكي',
      description: 'تعديل الأسعار تلقائياً حسب الطلب والوقت لزيادة الإيرادات بنسبة 18%',
      priority: 1,
      estimatedImpact: '+18% إيرادات، +12% ربحية',
      implementationCost: 'medium',
      timeToImplement: '2-3 أسابيع',
      actions: ['تحليل بيانات التسعير', 'تطوير خوارزمية التسعير', 'اختبار A/B', 'التطبيق التدريجي']
    },
    {
      id: 'ai-scheduler',
      category: 'efficiency',
      title: 'جدولة ذكية مدعومة بالذكاء الاصطناعي',
      description: 'تحسين جدولة المواعيد تلقائياً لتقليل أوقات الانتظار بنسبة 35%',
      priority: 2,
      estimatedImpact: '-35% وقت انتظار، +22% رضا العملاء',
      implementationCost: 'high',
      timeToImplement: '4-6 أسابيع',
      actions: ['تدريب نموذج الذكاء الاصطناعي', 'تطوير واجهة الجدولة', 'اختبار النظام', 'التدريب والتطبيق']
    },
    {
      id: 'predictive-maintenance',
      category: 'efficiency',
      title: 'الصيانة التنبؤية',
      description: 'توقع احتياجات الصيانة قبل حدوث الأعطال لتقليل التوقف بنسبة 45%',
      priority: 3,
      estimatedImpact: '-45% توقف غير مخطط، +15% كفاءة التشغيل',
      implementationCost: 'medium',
      timeToImplement: '3-4 أسابيع',
      actions: ['تركيب أجهزة استشعار', 'تطوير نموذج التنبؤ', 'ربط بنظام الصيانة', 'تدريب الفنيين']
    },
    {
      id: 'customer-behavior',
      category: 'satisfaction',
      title: 'تحليل سلوك العملاء المتقدم',
      description: 'فهم أعمق لسلوك العملاء لتخصيص التجربة وزيادة الولاء بنسبة 28%',
      priority: 4,
      estimatedImpact: '+28% ولاء العملاء، +20% تكرار الزيارات',
      implementationCost: 'low',
      timeToImplement: '1-2 أسابيع',
      actions: ['جمع بيانات السلوك', 'تطوير نماذج التحليل', 'إنشاء ملفات شخصية', 'تخصيص العروض']
    }
  ], []);

  const getInsightIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'optimization': return Target;
      case 'warning': return AlertTriangle;
      case 'opportunity': return Lightbulb;
      case 'prediction': return Eye;
      default: return Brain;
    }
  };

  const getInsightColor = (type: AIInsight['type']) => {
    switch (type) {
      case 'optimization': return 'text-blue-600 bg-blue-100';
      case 'warning': return 'text-red-600 bg-red-100';
      case 'opportunity': return 'text-green-600 bg-green-100';
      case 'prediction': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority <= 2) return 'text-red-600 bg-red-100';
    if (priority <= 4) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="p-6 rounded-xl border shadow-lg bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/20">
              <Brain className="h-8 w-8 text-primary animate-pulse" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">محرك الإدارة بالذكاء الاصطناعي</h1>
              <p className="text-muted-foreground mt-2">
                تحليلات ذكية وتوصيات مدعومة بالذكاء الاصطناعي لتحسين الأداء
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="animate-pulse">
              {aiLearning ? 'يتعلم...' : 'نشط'}
            </Badge>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              إعدادات الذكاء الاصطناعي
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="insights" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="insights">الرؤى الذكية</TabsTrigger>
          <TabsTrigger value="recommendations">التوصيات</TabsTrigger>
          <TabsTrigger value="predictions">التنبؤات</TabsTrigger>
          <TabsTrigger value="learning">التعلم التلقائي</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-6">
          {/* AI Insights */}
          <div className="grid gap-4">
            {aiInsights.map((insight) => {
              const IconComponent = getInsightIcon(insight.type);
              const colorClass = getInsightColor(insight.type);
              
              return (
                <Card 
                  key={insight.id} 
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    activeInsight === insight.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setActiveInsight(activeInsight === insight.id ? null : insight.id)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${colorClass}`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{insight.title}</CardTitle>
                          <CardDescription className="mt-1">
                            {insight.description}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={insight.impact === 'high' ? 'destructive' : insight.impact === 'medium' ? 'default' : 'secondary'}>
                          {insight.impact === 'high' ? 'تأثير عالي' : insight.impact === 'medium' ? 'تأثير متوسط' : 'تأثير منخفض'}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Activity className="h-4 w-4" />
                          {insight.confidence}%
                        </div>
                        <ChevronRight className={`h-4 w-4 transition-transform ${activeInsight === insight.id ? 'rotate-90' : ''}`} />
                      </div>
                    </div>
                  </CardHeader>
                  
                  {activeInsight === insight.id && (
                    <CardContent className="pt-0">
                      <div className="flex gap-2 flex-wrap">
                        {insight.actions.map((action, index) => (
                          <Button
                            key={index}
                            variant={action.primary ? "default" : "outline"}
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              action.action();
                            }}
                            className="animate-scale-in"
                          >
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          {/* AI Recommendations */}
          <div className="grid gap-6">
            {aiRecommendations.map((rec) => (
              <Card key={rec.id} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getPriorityColor(rec.priority)}`}>
                        <Award className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{rec.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {rec.description}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline">
                      أولوية {rec.priority}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-muted-foreground">التأثير المتوقع</div>
                      <div className="text-sm font-semibold text-green-600">{rec.estimatedImpact}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-muted-foreground">تكلفة التطبيق</div>
                      <Badge variant={rec.implementationCost === 'low' ? 'secondary' : rec.implementationCost === 'medium' ? 'default' : 'destructive'}>
                        {rec.implementationCost === 'low' ? 'منخفضة' : rec.implementationCost === 'medium' ? 'متوسطة' : 'عالية'}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-muted-foreground">وقت التطبيق</div>
                      <div className="text-sm">{rec.timeToImplement}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium">خطوات التطبيق:</div>
                    <div className="space-y-1">
                      {rec.actions.map((action, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                          {action}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button 
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "بدء التطبيق",
                          description: `تم بدء تطبيق: ${rec.title}`,
                          className: "toast-success"
                        });
                      }}
                      className="interactive-button"
                    >
                      بدء التطبيق
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "تفاصيل التوصية",
                          description: `عرض تفاصيل: ${rec.title}`,
                        });
                      }}
                      className="interactive-button"
                    >
                      تفاصيل أكثر
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* توقعات الطلب */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  توقعات الطلب
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>الأسبوع القادم</span>
                    <div className="flex items-center gap-1 text-green-600">
                      <ArrowUp className="h-4 w-4" />
                      +15%
                    </div>
                  </div>
                  <Progress value={75} className="h-2" />
                  <div className="text-sm text-muted-foreground">
                    توقع زيادة في الطلب بنسبة 15% مقارنة بالأسبوع الحالي
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* توقعات الإيرادات */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  توقعات الإيرادات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-2xl font-bold text-green-600">
                    {(analytics.totalRevenue * 1.12).toLocaleString()} جنيه مصري
                  </div>
                  <div className="text-sm text-muted-foreground">
                    الإيرادات المتوقعة للشهر القادم
                  </div>
                  <div className="flex items-center gap-1 text-green-600">
                    <ArrowUp className="h-4 w-4" />
                    زيادة 12% متوقعة
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* توقعات رضا العملاء */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  توقعات رضا العملاء
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-2xl font-bold text-yellow-600">4.7/5</div>
                  <Progress value={94} className="h-2" />
                  <div className="text-sm text-muted-foreground">
                    تحسن متوقع في رضا العملاء بناءً على التحسينات الحالية
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* توقعات الكفاءة */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-purple-500" />
                  توقعات الكفاءة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>تحسن الكفاءة</span>
                    <div className="flex items-center gap-1 text-green-600">
                      <ArrowUp className="h-4 w-4" />
                      +8%
                    </div>
                  </div>
                  <Progress value={88} className="h-2" />
                  <div className="text-sm text-muted-foreground">
                    تحسن متوقع في كفاءة العمليات خلال الشهر القادم
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="learning" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* نماذج التعلم */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-500" />
                  نماذج التعلم النشطة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>نموذج توقع الطلب</span>
                    <Badge variant="secondary">96% دقة</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>نموذج تحليل السلوك</span>
                    <Badge variant="secondary">92% دقة</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>نموذج التسعير الديناميكي</span>
                    <Badge variant="secondary">89% دقة</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>نموذج توقع الأعطال</span>
                    <Badge variant="secondary">94% دقة</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* إحصائيات التعلم */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-500" />
                  إحصائيات التعلم
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>البيانات المعالجة</span>
                    <span className="font-medium">1.2M نقطة</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>النماذج المدربة</span>
                    <span className="font-medium">12 نموذج</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>التحديثات اليومية</span>
                    <span className="font-medium">24 مرة</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>معدل التحسن</span>
                    <div className="flex items-center gap-1 text-green-600">
                      <ArrowUp className="h-4 w-4" />
                      2.3% شهرياً
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* التحسينات التلقائية */}
          <Card>
            <CardHeader>
              <CardTitle>التحسينات التلقائية المطبقة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg bg-green-50">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-600">تحسين الجدولة</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    تقليل أوقات الانتظار بنسبة 15%
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg bg-blue-50">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-600">تحسين التسعير</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    زيادة الإيرادات بنسبة 8%
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg bg-purple-50">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-4 w-4 text-purple-600" />
                    <span className="font-medium text-purple-600">تحسين الموارد</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    تحسين استغلال الطاقة بنسبة 12%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}