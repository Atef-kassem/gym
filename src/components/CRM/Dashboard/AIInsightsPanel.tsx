import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  TrendingUp, 
  Users, 
  Target, 
  AlertTriangle, 
  CheckCircle,
  Lightbulb,
  Zap,
  BarChart3
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AIInsight {
  id: string;
  type: 'prediction' | 'recommendation' | 'alert' | 'opportunity';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  action?: string;
  actionRoute?: string;
}

const mockAIInsights: AIInsight[] = [
  {
    id: '1',
    type: 'prediction',
    title: 'توقع زيادة العملاء الجدد',
    description: 'يتوقع النموذج زيادة 23% في العملاء الجدد خلال الأسبوعين القادمين بناءً على اتجاهات السوق الحالية',
    confidence: 87,
    impact: 'high',
    action: 'تحضير خطة استقبال',
    actionRoute: '/crm/customers'
  },
  {
    id: '2',
    type: 'recommendation',
    title: 'حملة تسويقية مخصصة',
    description: 'يُنصح بإطلاق حملة للعملاء الذين لم يزوروا منذ 30 يوم - معدل الاستجابة المتوقع 34%',
    confidence: 92,
    impact: 'high',
    action: 'إنشاء حملة',
    actionRoute: '/crm/campaigns/new'
  },
  {
    id: '3',
    type: 'alert',
    title: 'انخفاض رضا العملاء المؤقت',
    description: 'تم رصد انخفاض طفيف في تقييمات العملاء في الأسبوع الماضي، يُنصح بالمتابعة',
    confidence: 78,
    impact: 'medium',
    action: 'مراجعة التقييمات',
    actionRoute: '/crm/feedback'
  },
  {
    id: '4',
    type: 'opportunity',
    title: 'فرصة لتحسين برنامج الولاء',
    description: '45% من العملاء المميزين لديهم نقاط غير مستخدمة - فرصة لزيادة التفاعل',
    confidence: 85,
    impact: 'medium',
    action: 'تفعيل العروض',
    actionRoute: '/crm/loyalty'
  }
];

const getInsightIcon = (type: string) => {
  switch (type) {
    case 'prediction':
      return <TrendingUp className="w-5 h-5 text-blue-500" />;
    case 'recommendation':
      return <Lightbulb className="w-5 h-5 text-yellow-500" />;
    case 'alert':
      return <AlertTriangle className="w-5 h-5 text-red-500" />;
    case 'opportunity':
      return <Target className="w-5 h-5 text-green-500" />;
    default:
      return <Brain className="w-5 h-5 text-purple-500" />;
  }
};

const getImpactColor = (impact: string) => {
  switch (impact) {
    case 'high':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export function AIInsightsPanel() {
  const [insights, setInsights] = useState<AIInsight[]>(mockAIInsights);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const runAIAnalysis = async () => {
    setIsAnalyzing(true);
    
    // محاكاة تحليل الذكاء الاصطناعي
    setTimeout(() => {
      setIsAnalyzing(false);
      toast({
        title: "تم إكمال التحليل الذكي",
        description: "تم تحديث التوصيات والتنبؤات بناءً على أحدث البيانات",
      });
    }, 3000);
  };

  useEffect(() => {
    // محاكاة تحديث دوري للبيانات
    const interval = setInterval(() => {
      // تحديث معدلات الثقة بشكل عشوائي
      setInsights(prev => prev.map(insight => ({
        ...insight,
        confidence: Math.max(70, Math.min(95, insight.confidence + (Math.random() - 0.5) * 5))
      })));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50/50 to-blue-50/50 border-l-4 border-l-purple-500 animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-purple-600 animate-pulse" />
          رؤى الذكاء الاصطناعي
          <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
            AI
          </Badge>
        </CardTitle>
        <CardDescription>
          تحليل ذكي للبيانات مع توصيات وتنبؤات مدعومة بالذكاء الاصطناعي
        </CardDescription>
        <Button 
          onClick={runAIAnalysis}
          disabled={isAnalyzing}
          className="w-fit bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
        >
          <Zap className="w-4 h-4 mr-2" />
          {isAnalyzing ? 'جاري التحليل...' : 'تشغيل التحليل الذكي'}
        </Button>
      </CardHeader>
      <CardContent>
        {isAnalyzing && (
          <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center gap-3 mb-2">
              <Brain className="w-5 h-5 text-purple-600 animate-spin" />
              <span className="font-medium text-purple-900">جاري تحليل البيانات...</span>
            </div>
            <Progress value={66} className="h-2 bg-purple-100" />
            <p className="text-sm text-purple-600 mt-2">تحليل سلوك العملاء وأنماط الشراء</p>
          </div>
        )}

        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div
              key={insight.id}
              className="p-4 border rounded-lg hover:shadow-md hover:scale-[1.02] transition-all duration-300 bg-white/70 backdrop-blur-sm animate-scale-in group"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1 group-hover:scale-110 transition-transform duration-200">
                  {getInsightIcon(insight.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
                      {insight.title}
                    </h4>
                    <Badge className={`text-xs ${getImpactColor(insight.impact)}`}>
                      {insight.impact === 'high' ? 'عالي' : insight.impact === 'medium' ? 'متوسط' : 'منخفض'}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">
                    {insight.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-500">معدل الثقة:</span>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={insight.confidence} 
                          className="w-20 h-2" 
                        />
                        <span className="text-xs font-bold text-purple-600">
                          {Math.round(insight.confidence)}%
                        </span>
                      </div>
                    </div>
                    
                    {insight.action && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 group-hover:scale-105 transition-all duration-200"
                        onClick={() => {
                          toast({
                            title: "تم تنفيذ الإجراء",
                            description: `تم تنفيذ: ${insight.action}`,
                          });
                        }}
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {insight.action}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-blue-900">ملخص الأداء الذكي</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="font-bold text-blue-600">4</div>
              <div className="text-blue-700">رؤى نشطة</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-green-600">87%</div>
              <div className="text-green-700">دقة التنبؤ</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-purple-600">12</div>
              <div className="text-purple-700">توصيات مطبقة</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-orange-600">23%</div>
              <div className="text-orange-700">تحسن الأداء</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}