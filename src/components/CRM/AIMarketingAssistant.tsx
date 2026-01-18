import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  Bot,
  Brain,
  Zap,
  Target,
  TrendingUp,
  Users,
  Clock,
  Star,
  Lightbulb,
  BarChart3,
  MessageSquare,
  Sparkles,
  Settings,
  Play,
  Pause,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Calendar,
  Hash,
  AtSign,
  Image as ImageIcon,
  Video,
  FileText,
  Eye,
  Heart,
  Share2
} from "lucide-react";

interface AIRecommendation {
  id: string;
  type: "content" | "timing" | "audience" | "optimization";
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  effort: "low" | "medium" | "high";
  confidence: number;
  action: string;
}

interface AIInsight {
  id: string;
  category: string;
  insight: string;
  metric: string;
  change: number;
  trend: "up" | "down" | "stable";
}

export function AIMarketingAssistant() {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [autoOptimization, setAutoOptimization] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");

  const [recommendations] = useState<AIRecommendation[]>([
    {
      id: "1",
      type: "content",
      title: "تحسين محتوى الحملة",
      description: "إضافة عناصر بصرية ونداءات للعمل أكثر فعالية",
      impact: "high",
      effort: "low",
      confidence: 92,
      action: "تطبيق التوصية"
    },
    {
      id: "2",
      type: "timing",
      title: "أفضل وقت للنشر",
      description: "النشر في الساعة 7:30 مساءً يحقق أفضل معدل تفاعل",
      impact: "medium",
      effort: "low",
      confidence: 85,
      action: "جدولة تلقائية"
    },
    {
      id: "3",
      type: "audience",
      title: "توسيع الجمهور المستهدف",
      description: "إضافة فئة العملاء الذين لم يتفاعلوا مؤخراً",
      impact: "high",
      effort: "medium",
      confidence: 78,
      action: "إضافة الفئة"
    },
    {
      id: "4",
      type: "optimization",
      title: "تحسين معدل التحويل",
      description: "تعديل نص الحملة لزيادة معدل النقر بنسبة 23%",
      impact: "high",
      effort: "low",
      confidence: 88,
      action: "تطبيق الآن"
    }
  ]);

  const [insights] = useState<AIInsight[]>([
    {
      id: "1",
      category: "التفاعل",
      insight: "زيادة في معدل التفاعل بعد استخدام الهاشتاجات",
      metric: "معدل التفاعل",
      change: 15.3,
      trend: "up"
    },
    {
      id: "2",
      category: "التوقيت",
      insight: "أفضل أوقات النشر هي المساء من 7-9 مساءً",
      metric: "معدل المشاهدة",
      change: 28.5,
      trend: "up"
    },
    {
      id: "3",
      category: "المحتوى",
      insight: "المحتوى المرئي يحقق تفاعل أكبر بـ 3 مرات",
      metric: "معدل النقر",
      change: 12.7,
      trend: "up"
    },
    {
      id: "4",
      category: "الجمهور",
      insight: "الفئة العمرية 25-35 هي الأكثر استجابة",
      metric: "معدل التحويل",
      change: -5.2,
      trend: "down"
    }
  ]);

  const contentPrompts = [
    "إنشاء إعلان جذاب لخدمة    الكافية",
    "كتابة منشور لوسائل التواصل الاجتماعي",
    "إنشاء عرض ترويجي مقنع",
    "كتابة رسالة واتساب تسويقية",
    "إنشاء محتوى لحملة بريد إلكتروني"
  ];

  const runAIAnalysis = async () => {
    setIsAnalyzing(true);
    
    toast({
      title: "بدء التحليل",
      description: "الذكاء الاصطناعي يحلل بيانات الحملات",
    });

    // محاكاة تحليل بالذكاء الاصطناعي
    setTimeout(() => {
      setIsAnalyzing(false);
      toast({
        title: "تم التحليل بنجاح",
        description: "تم إنشاء توصيات جديدة لتحسين الأداء",
      });
    }, 3000);
  };

  const generateContent = async () => {
    if (!selectedPrompt && !customPrompt) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار أو كتابة نوع المحتوى المطلوب",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "جاري إنشاء المحتوى",
      description: "الذكاء الاصطناعي يعمل على إنشاء محتوى مخصص",
    });

    // محاكاة إنشاء محتوى
    setTimeout(() => {
      toast({
        title: "تم إنشاء المحتوى",
        description: "تم إنشاء محتوى تسويقي مخصص بنجاح",
      });
    }, 2000);
  };

  const applyRecommendation = (recommendation: AIRecommendation) => {
    toast({
      title: "تم تطبيق التوصية",
      description: `تم تطبيق: ${recommendation.title}`,
    });
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case "low": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "high": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "down": return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
      case "stable": return <span className="w-4 h-4 bg-gray-400 rounded-full" />;
      default: return null;
    }
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case "content": return <FileText className="w-5 h-5 text-blue-500" />;
      case "timing": return <Clock className="w-5 h-5 text-green-500" />;
      case "audience": return <Users className="w-5 h-5 text-purple-500" />;
      case "optimization": return <Zap className="w-5 h-5 text-orange-500" />;
      default: return <Brain className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Control Panel */}
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-purple-500" />
              <CardTitle>مساعد التسويق الذكي</CardTitle>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="ai-enabled">تفعيل الذكاء الاصطناعي</Label>
                <Switch
                  id="ai-enabled"
                  checked={aiEnabled}
                  onCheckedChange={setAiEnabled}
                />
              </div>
              <Button 
                onClick={runAIAnalysis} 
                disabled={isAnalyzing || !aiEnabled}
                className="bg-gradient-to-r from-purple-500 to-indigo-500"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    جاري التحليل...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    تحليل ذكي
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {isAnalyzing && (
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>تحليل البيانات...</span>
                <span>75%</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
          </CardContent>
        )}
      </Card>

      <Tabs defaultValue="recommendations" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="recommendations">التوصيات</TabsTrigger>
          <TabsTrigger value="insights">الإحصائيات</TabsTrigger>
          <TabsTrigger value="content">إنشاء المحتوى</TabsTrigger>
          <TabsTrigger value="automation">الأتمتة</TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {recommendations.map((rec) => (
              <Card key={rec.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getRecommendationIcon(rec.type)}
                      <CardTitle className="text-base">{rec.title}</CardTitle>
                    </div>
                    <div className="flex gap-1">
                      <Badge className={getImpactColor(rec.impact)} variant="secondary">
                        تأثير {rec.impact === "high" ? "عالي" : rec.impact === "medium" ? "متوسط" : "منخفض"}
                      </Badge>
                      <Badge className={getEffortColor(rec.effort)} variant="secondary">
                        جهد {rec.effort === "low" ? "قليل" : rec.effort === "medium" ? "متوسط" : "عالي"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">معدل الثقة:</span>
                      <div className="flex items-center gap-1">
                        <Progress value={rec.confidence} className="w-16 h-2" />
                        <span className="text-xs font-medium">{rec.confidence}%</span>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => applyRecommendation(rec)}
                      className="bg-gradient-to-r from-green-500 to-emerald-500"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {rec.action}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {insights.map((insight) => (
              <Card key={insight.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{insight.category}</Badge>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(insight.trend)}
                      <span className={`text-sm font-medium ${
                        insight.trend === "up" ? "text-green-600" : 
                        insight.trend === "down" ? "text-red-600" : "text-gray-600"
                      }`}>
                        {insight.change > 0 ? "+" : ""}{insight.change}%
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-2">{insight.insight}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <BarChart3 className="w-3 h-3" />
                    <span>{insight.metric}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                مولد المحتوى الذكي
              </CardTitle>
              <CardDescription>
                استخدم الذكاء الاصطناعي لإنشاء محتوى تسويقي مخصص
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>اختر نوع المحتوى</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {contentPrompts.map((prompt, index) => (
                    <Button
                      key={index}
                      variant={selectedPrompt === prompt ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedPrompt(prompt)}
                      className="justify-start h-auto p-3 text-right"
                    >
                      {prompt}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom-prompt">أو اكتب طلباً مخصصاً</Label>
                <Textarea
                  id="custom-prompt"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="مثال: إنشاء إعلان لخدمة    الكافية المتنقلة يستهدف أصحاب  الكافية الفاخرة"
                  rows={3}
                />
              </div>

              <Button onClick={generateContent} className="w-full">
                <Sparkles className="w-4 h-4 mr-2" />
                إنشاء المحتوى
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-500" />
                  التحسين التلقائي
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-optimization">تحسين تلقائي للحملات</Label>
                    <p className="text-xs text-muted-foreground">تحسين الحملات تلقائياً بناءً على الأداء</p>
                  </div>
                  <Switch
                    id="auto-optimization"
                    checked={autoOptimization}
                    onCheckedChange={setAutoOptimization}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>إعدادات التحسين</Label>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>تحسين التوقيت</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex justify-between">
                      <span>تحسين المحتوى</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex justify-between">
                      <span>تحسين الجمهور</span>
                      <Switch />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-500" />
                  الجدولة الذكية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>أوقات النشر المثلى</Label>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>الأحد - الثلاثاء</span>
                      <span className="text-muted-foreground">7:30 - 9:00 مساءً</span>
                    </div>
                    <div className="flex justify-between">
                      <span>الأربعاء - الخميس</span>
                      <span className="text-muted-foreground">8:00 - 10:00 مساءً</span>
                    </div>
                    <div className="flex justify-between">
                      <span>الجمعة - السبت</span>
                      <span className="text-muted-foreground">2:00 - 4:00 مساءً</span>
                    </div>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full">
                  <Settings className="w-4 h-4 mr-2" />
                  تخصيص الأوقات
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}