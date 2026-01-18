import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Sparkles,
  TrendingUp,
  Users,
  Target,
  BarChart3,
  Lightbulb
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  message: string;
  timestamp: Date;
  suggestions?: string[];
}

interface AIAnalysis {
  metric: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
  insight: string;
}

const initialMessages: ChatMessage[] = [
  {
    id: '1',
    type: 'ai',
    message: 'مرحباً! أنا مساعدك الذكي لتحليل بيانات CRM. يمكنني مساعدتك في تحليل أداء العملاء، التنبؤ بالاتجاهات، وتقديم توصيات ذكية. كيف يمكنني مساعدتك اليوم؟',
    timestamp: new Date(),
    suggestions: [
      'تحليل أداء العملاء هذا الشهر',
      'توقع نمو المبيعات',
      'اقتراحات لتحسين الحملات التسويقية',
      'تحليل سلوك العملاء الجدد'
    ]
  }
];

const aiAnalysisData: AIAnalysis[] = [
  {
    metric: 'معدل نمو العملاء',
    value: '+23%',
    trend: 'up',
    insight: 'نمو قوي مقارنة بالشهر الماضي'
  },
  {
    metric: 'معدل الاحتفاظ',
    value: '87%',
    trend: 'stable',
    insight: 'مستقر ضمن المعدل الطبيعي'
  },
  {
    metric: 'قيمة العميل',
    value: '2,450 جنيه مصري',
    trend: 'up',
    insight: 'زيادة 15% في متوسط الإنفاق'
  },
  {
    metric: 'رضا العملاء',
    value: '4.6/5',
    trend: 'up',
    insight: 'تحسن ملحوظ في التقييمات'
  }
];

export function AIAssistantChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // محاكاة استجابة الذكاء الاصطناعي
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const generateAIResponse = (userInput: string): ChatMessage => {
    const responses = {
      'تحليل': 'بناءً على تحليل البيانات الحالية، لاحظت زيادة 23% في العملاء الجدد هذا الشهر. معدل التحويل من الزوار الجدد إلى عملاء دائمين هو 34%، وهو أعلى من المتوسط بـ 8%.',
      'توقع': 'التنبؤات تشير إلى نمو محتمل بنسبة 18% في الأسابيع الثلاثة القادمة. أنصح بزيادة المخزون وتحضير فريق خدمة العملاء لزيادة الطلب.',
      'حملات': 'أقترح إطلاق حملة مخصصة للعملاء الذين لم يزوروا منذ 30 يوم. معدل الاستجابة المتوقع 42% مع ROI محتمل 3.2x.',
      'default': 'شكراً لسؤالك! دعني أحلل البيانات المتاحة وأقدم لك إجابة شاملة. هل تريد تفاصيل أكثر حول أي موضوع محدد؟'
    };

    const responseKey = Object.keys(responses).find(key => 
      userInput.toLowerCase().includes(key) || userInput.includes(key)
    ) || 'default';

    return {
      id: Date.now().toString(),
      type: 'ai',
      message: responses[responseKey as keyof typeof responses],
      timestamp: new Date(),
      suggestions: [
        'اطلب المزيد من التفاصيل',
        'اقترح خطة عمل',
        'حلل البيانات التاريخية',
        'احسب ROI المتوقع'
      ]
    };
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
      default:
        return <BarChart3 className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* AI Chat Interface */}
      <Card className="lg:col-span-2 hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-blue-50/50 to-purple-50/50 border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-blue-600" />
            المساعد الذكي لـ CRM
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              AI Chat
            </Badge>
          </CardTitle>
          <CardDescription>
            احصل على تحليلات ذكية وتوصيات مخصصة لبيانات CRM
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            
            {/* Messages */}
            <div className="h-96 overflow-y-auto space-y-3 p-4 bg-gray-50 rounded-lg">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div className={`flex gap-2 max-w-[80%] ${
                    message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                      {message.type === 'user' ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                    </div>
                    <div
                      className={`p-3 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-white border shadow-sm'
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                      <span className="text-xs opacity-70 mt-1 block">
                        {message.timestamp.toLocaleTimeString('ar-SA')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-white border shadow-sm p-3 rounded-lg">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Suggestions */}
            {messages[messages.length - 1]?.suggestions && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">اقتراحات سريعة:</p>
                <div className="flex flex-wrap gap-2">
                  {messages[messages.length - 1].suggestions!.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-xs hover:bg-blue-50 hover:border-blue-300"
                    >
                      <Lightbulb className="w-3 h-3 mr-1" />
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="flex gap-2">
              <Input
                placeholder="اسأل عن تحليل البيانات، التوقعات، أو التوصيات..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage}
                disabled={isTyping || !inputMessage.trim()}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Analytics Summary */}
      <Card className="hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-green-50/50 to-blue-50/50 border-l-4 border-l-green-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-green-600" />
            التحليل السريع
          </CardTitle>
          <CardDescription>
            ملخص ذكي لأهم المؤشرات
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {aiAnalysisData.map((analysis, index) => (
              <div
                key={analysis.metric}
                className="p-3 bg-white rounded-lg border hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{analysis.metric}</span>
                  {getTrendIcon(analysis.trend)}
                </div>
                <div className="text-xl font-bold text-blue-600 mb-1">
                  {analysis.value}
                </div>
                <p className="text-xs text-gray-600">{analysis.insight}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-900">نصيحة ذكية</span>
            </div>
            <p className="text-sm text-blue-700">
              بناءً على الاتجاهات الحالية، أنصح بالتركيز على العملاء الجدد هذا الأسبوع لتعظيم النمو.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}