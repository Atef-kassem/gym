import { useState } from "react";
import { Bot, Send, Sparkles, TrendingUp, AlertTriangle, Package, BarChart3, RefreshCw, Clock, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface AIInsight {
  type: 'warning' | 'info' | 'success';
  icon: any;
  title: string;
  description: string;
  action?: string;
}

export function AIInventoryAssistant() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'مرحباً! أنا مساعدك الذكي للمخزون. يمكنني مساعدتك في تحليل المخزون، التنبؤ بالاحتياجات، وإدارة المستودعات.',
      timestamp: new Date(),
      suggestions: ['تحليل الأصناف الحرجة', 'توقع احتياجات الشهر القادم', 'أفضل المستودعات أداءً']
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const insights: AIInsight[] = [
    {
      type: 'warning',
      icon: AlertTriangle,
      title: 'تنبيه مخزون حرج',
      description: '12 صنف وصل للحد الأدنى',
      action: 'عرض التفاصيل'
    },
    {
      type: 'info',
      icon: TrendingUp,
      title: 'توقع زيادة الطلب',
      description: 'زيت المحرك متوقع زيادة 25% الأسبوع القادم',
      action: 'زيادة المخزون'
    },
    {
      type: 'success',
      icon: Package,
      title: 'كفاءة المستودع',
      description: 'المستودع الرئيسي يحقق كفاءة 95%',
      action: 'عرض التقرير'
    }
  ];

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI processing
    setTimeout(() => {
      const aiResponse = generateAIResponse(input);
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 2000);
  };

  const generateAIResponse = (query: string): ChatMessage => {
    // Simple AI response simulation
    let response = "";
    let suggestions: string[] = [];

    if (query.includes('حرج') || query.includes('الحد الأدنى')) {
      response = "وجدت 12 صنف وصل للحد الأدنى:\n• زيت محرك شل 5W-30 (5 لتر)\n• صابون مركز (2 عبوة)\n• فوطة ميكروفايبر (15   )\n\nأنصح بطلب مخزون إضافي خلال 3 أيام.";
      suggestions = ['طلب مخزون الآن', 'تحليل أسباب النقص', 'إعداد تنبيهات مبكرة'];
    } else if (query.includes('توقع') || query.includes('احتياج')) {
      response = "بناءً على تحليل البيانات التاريخية، الاحتياجات المتوقعة للشهر القادم:\n• زيت المحرك: زيادة 25%\n• مواد التنظيف: زيادة 15%\n• إكسسوارات  الكافية: ثابت";
      suggestions = ['زيادة المخزون', 'تحليل الاتجاهات', 'إعداد خطة الشراء'];
    } else if (query.includes('أداء') || query.includes('مستودع')) {
      response = "تحليل أداء المستودعات:\n• المستودع الرئيسي: 95% كفاءة\n• مستودع قطع   : 87% كفاءة\n• مستودع المستهلكات: 92% كفاءة\n\nالمستودع الرئيسي يحقق أفضل أداء.";
      suggestions = ['تحسين الأداء', 'مقارنة المستودعات', 'تحليل الاختناقات'];
    } else {
      response = "فهمت استفسارك. دعني أحلل البيانات المتاحة وأعطيك إجابة مفصلة. هل تريد معلومات أكثر تفصيلاً حول نقطة معينة؟";
      suggestions = ['تحليل المخزون', 'التنبؤ بالطلب', 'تحسين الكفاءة'];
    }

    return {
      id: Date.now().toString() + '_ai',
      type: 'assistant',
      content: response,
      timestamp: new Date(),
      suggestions
    };
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'warning': return 'border-warning bg-warning/5';
      case 'success': return 'border-success bg-success/5';
      default: return 'border-primary bg-primary/5';
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((insight, index) => {
          const IconComponent = insight.icon;
          return (
            <Card 
              key={index}
              className={`hover-scale transition-all duration-300 ${getInsightColor(insight.type)} border-2 cursor-pointer group`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    insight.type === 'warning' ? 'bg-warning/20' :
                    insight.type === 'success' ? 'bg-success/20' : 'bg-primary/20'
                  }`}>
                    <IconComponent className={`w-4 h-4 ${
                      insight.type === 'warning' ? 'text-warning' :
                      insight.type === 'success' ? 'text-success' : 'text-primary'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm mb-1 group-hover:text-primary transition-colors">
                      {insight.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mb-2">
                      {insight.description}
                    </p>
                    {insight.action && (
                      <Button size="sm" variant="outline" className="text-xs h-6 px-2">
                        {insight.action}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Chat Interface */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary animate-pulse" />
            محادثة المساعد الذكي
            <Badge variant="outline" className="ml-auto">
              <Sparkles className="w-3 h-3 mr-1" />
              ذكي
            </Badge>
          </CardTitle>
          <CardDescription>
            اسأل عن أي شيء متعلق بإدارة المخزون والمستودعات
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Messages */}
          <ScrollArea className="h-80 w-full rounded-lg border p-4 bg-muted/30">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-background border shadow-sm'
                  } animate-slide-up`}>
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString('ar-SA')}
                    </p>
                    
                    {/* Suggestions */}
                    {message.suggestions && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {message.suggestions.map((suggestion, idx) => (
                          <Button
                            key={idx}
                            size="sm"
                            variant="outline"
                            className="text-xs h-6 px-2 hover-scale"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-background border shadow-sm rounded-lg p-3 max-w-[80%]">
                    <div className="flex items-center gap-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-xs text-muted-foreground">جاري التحليل...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="flex gap-2">
            <Input
              placeholder="اسأل عن المخزون، التوقعات، أو أي شيء متعلق بالمستودعات..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 focus:ring-2 focus:ring-primary/20"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className="gap-2 hover-scale bg-gradient-to-r from-primary to-primary/80"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              className="gap-1 hover-scale"
              onClick={() => setInput("ما هي الأصناف الحرجة الآن؟")}
            >
              <AlertTriangle className="w-3 h-3" />
              الأصناف الحرجة
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="gap-1 hover-scale"
              onClick={() => setInput("توقع احتياجات الشهر القادم")}
            >
              <TrendingUp className="w-3 h-3" />
              توقعات الطلب
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="gap-1 hover-scale"
              onClick={() => setInput("تحليل أداء المستودعات")}
            >
              <BarChart3 className="w-3 h-3" />
              تحليل الأداء
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}