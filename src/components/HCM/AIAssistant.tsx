import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { 
  MessageCircle, 
  Send, 
  Mic, 
  MicOff, 
  Bot, 
  User, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Users,
  Calendar,
  Brain,
  Sparkles,
  Settings,
  Volume2,
  VolumeX
} from "lucide-react";

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  data?: any;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: any;
  action: string;
}

const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'مرحباً! أنا مساعدك الذكي لإدارة الملفات الوظيفية. يمكنني مساعدتك في:\n\n• البحث عن معلومات الموظفين\n• تحليل البيانات والتقارير\n• تتبع انتهاء الوثائق\n• اقتراح التحديثات المطلوبة\n• الإجابة على أسئلتك\n\nكيف يمكنني مساعدتك اليوم؟',
      timestamp: new Date(),
      suggestions: [
        'عرض الموظفين الذين تنتهي وثائقهم قريباً',
        'تحليل معدل اكتمال الملفات',
        'البحث عن موظف معين',
        'إنشاء تقرير شامل'
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickActions: QuickAction[] = [
    {
      id: 'expiring-docs',
      title: 'الوثائق المنتهية',
      description: 'عرض الوثائق التي تنتهي قريباً',
      icon: AlertTriangle,
      action: 'show_expiring_documents'
    },
    {
      id: 'completion-rate',
      title: 'معدل الإكمال',
      description: 'تحليل معدل اكتمال الملفات',
      icon: TrendingUp,
      action: 'analyze_completion_rate'
    },
    {
      id: 'employee-search',
      title: 'البحث عن موظف',
      description: 'البحث السريع في بيانات الموظفين',
      icon: Users,
      action: 'search_employee'
    },
    {
      id: 'generate-report',
      title: 'إنشاء تقرير',
      description: 'توليد تقرير مخصص',
      icon: FileText,
      action: 'generate_report'
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message?: string) => {
    const messageToSend = message || inputMessage.trim();
    if (!messageToSend) return;

    setIsLoading(true);
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageToSend,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Simulate AI processing
    setTimeout(() => {
      const response = generateAIResponse(messageToSend);
      setMessages(prev => [...prev, response]);
      setIsLoading(false);
      
      // Play response if voice is enabled
      if (voiceEnabled) {
        speakText(response.content);
      }
    }, 1500);
  };

  const generateAIResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase();
    
    let response = '';
    let suggestions: string[] = [];
    let data: any = null;

    if (lowerMessage.includes('وثائق') || lowerMessage.includes('منتهي') || lowerMessage.includes('انتهاء')) {
      response = `تم العثور على 8 وثائق تنتهي خلال الـ 30 يوماً القادمة:

🔴 **عاجل (15 يوم أو أقل):**
• أحمد العتيبي - الإقامة (15 يوم)
• سارة الغامدي - تصريح العمل (10 أيام)

🟠 **قريب (16-30 يوم):**
• نورا الشمري - رخصة القيادة (20 يوم)
• محمد الزهراني - جواز السفر (30 يوم)

هل تريد إرسال تنبيهات للموظفين أم إنشاء تقرير مفصل؟`;
      
      suggestions = [
        'إرسال تنبيهات للموظفين',
        'إنشاء تقرير الوثائق المنتهية',
        'عرض تفاصيل أكثر',
        'جدولة التجديدات'
      ];
      
      data = {
        expiring_documents: [
          { employee: 'أحمد العتيبي', document: 'الإقامة', days: 15, urgency: 'عاجل' },
          { employee: 'سارة الغامدي', document: 'تصريح العمل', days: 10, urgency: 'عاجل' },
          { employee: 'نورا الشمري', document: 'رخصة القيادة', days: 20, urgency: 'قريب' },
          { employee: 'محمد الزهراني', document: 'جواز السفر', days: 30, urgency: 'قريب' }
        ]
      };
    } else if (lowerMessage.includes('معدل') || lowerMessage.includes('إكمال') || lowerMessage.includes('تحليل')) {
      response = `📊 **تحليل معدل اكتمال الملفات:**

**المتوسط العام:** 91% ✅

**توزيع الإكمال:**
• ملفات مكتملة (95-100%): 298 موظف (72%)
• ملفات جيدة (80-94%): 89 موظف (21%)
• ملفات ناقصة (أقل من 80%): 29 موظف (7%)

**أهم النواقص:**
• الشهادات العلمية: 45 موظف
• الخبرات السابقة: 32 موظف
• الفحص الطبي: 28 موظف

**التوصية:** التركيز على جمع الوثائق الناقصة للـ 29 موظف`;
      
      suggestions = [
        'عرض قائمة الموظفين الناقصين',
        'إرسال تذكيرات للموظفين',
        'تحليل حسب الأقسام',
        'إنشاء خطة تحسين'
      ];
      
      data = {
        completion_stats: {
          average: 91,
          complete: 298,
          good: 89,
          incomplete: 29,
          missing_docs: {
            'الشهادات العلمية': 45,
            'الخبرات السابقة': 32,
            'الفحص الطبي': 28
          }
        }
      };
    } else if (lowerMessage.includes('بحث') || lowerMessage.includes('موظف')) {
      response = `🔍 **نتائج البحث في قاعدة بيانات الموظفين:**

**إجمالي الموظفين:** 324 موظف نشط

**التوزيع حسب الأقسام:**
• الصيانة: 146 موظف (45%)
• الاستقبال: 81 موظف (25%)
• المالية: 65 موظف (20%)
• الإدارة: 32 موظف (10%)

يمكنك البحث عن موظف محدد بكتابة اسمه أو رقمه الوظيفي.`;
      
      suggestions = [
        'البحث بالاسم',
        'البحث بالرقم الوظيفي',
        'عرض موظفي قسم معين',
        'البحث المتقدم'
      ];
    } else if (lowerMessage.includes('تقرير')) {
      response = `📋 **أنواع التقارير المتاحة:**

**1. التقارير الأساسية:**
• تقرير الملفات الشامل
• تقرير الوثائق المنتهية
• تقرير معدل الإكمال

**2. التقارير التحليلية:**
• تحليل الأداء الوظيفي
• تحليل الحضور والإجازات
• تقرير التوزيع الجغرافي

**3. التقارير التنبؤية:**
• توقع احتياجات التجديد
• تحليل اتجاهات البيانات
• تقرير المخاطر المحتملة

أي تقرير تريد إنشاؤه؟`;
      
      suggestions = [
        'تقرير شامل للملفات',
        'تقرير الوثائق المنتهية',
        'تحليل الأداء',
        'تقرير مخصص'
      ];
    } else {
      response = `شكراً لسؤالك! أفهم أنك تسأل عن "${userMessage}".

يمكنني مساعدتك في العديد من المهام المتعلقة بإدارة الملفات الوظيفية. إليك بعض الأمثلة على ما يمكنني فعله:

• **تحليل البيانات:** معدلات الإكمال، الإحصائيات، الاتجاهات
• **إدارة الوثائق:** تتبع الانتهاء، التحقق من الصحة
• **البحث والاستعلام:** العثور على معلومات محددة
• **التقارير:** إنشاء تقارير مخصصة وتحليلية
• **التوصيات:** اقتراحات لتحسين العمليات

هل يمكنك توضيح طلبك أكثر أو اختيار من الاقتراحات أدناه؟`;
      
      suggestions = [
        'عرض إحصائيات سريعة',
        'البحث عن موظف',
        'تحليل الوثائق',
        'إنشاء تقرير'
      ];
    }

    return {
      id: Date.now().toString(),
      type: 'assistant',
      content: response,
      timestamp: new Date(),
      suggestions,
      data
    };
  };

  const handleQuickAction = (action: QuickAction) => {
    let message = '';
    switch (action.action) {
      case 'show_expiring_documents':
        message = 'عرض الوثائق التي تنتهي قريباً';
        break;
      case 'analyze_completion_rate':
        message = 'تحليل معدل اكتمال الملفات';
        break;
      case 'search_employee':
        message = 'البحث في بيانات الموظفين';
        break;
      case 'generate_report':
        message = 'إنشاء تقرير شامل';
        break;
      default:
        message = action.title;
    }
    handleSendMessage(message);
    
    toast({
      title: "تم تنفيذ الإجراء",
      description: `تم تنفيذ: ${action.title}`,
    });
  };

  const handleVoiceToggle = () => {
    if (!isListening) {
      startListening();
    } else {
      stopListening();
    }
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'ar-SA';
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onstart = () => {
        setIsListening(true);
        toast({
          title: "بدء الاستماع",
          description: "تحدث الآن...",
        });
      };
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        toast({
          title: "تم التعرف على الصوت",
          description: `تم سماع: ${transcript}`,
        });
      };
      
      recognition.onerror = () => {
        toast({
          title: "خطأ في التعرف على الصوت",
          description: "يرجى المحاولة مرة أخرى",
          variant: "destructive",
        });
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
    } else {
      toast({
        title: "غير مدعوم",
        description: "التعرف على الصوت غير مدعوم في هذا المتصفح",
        variant: "destructive",
      });
    }
  };

  const stopListening = () => {
    setIsListening(false);
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">المساعد الذكي</h2>
            <p className="text-sm text-slate-600">مدعوم بالذكاء الاصطناعي</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={voiceEnabled ? "bg-green-50 text-green-600 border-green-200" : ""}
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            متصل
          </Badge>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b bg-white/50">
        <h3 className="text-sm font-medium text-slate-700 mb-3">إجراءات سريعة</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {quickActions.map((action) => (
            <Button
              key={action.id}
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction(action)}
              className="h-auto p-3 flex flex-col items-center gap-2 hover:bg-blue-50 hover:border-blue-200 transition-all duration-200"
            >
              <action.icon className="w-4 h-4 text-blue-600" />
              <div className="text-center">
                <div className="text-xs font-medium">{action.title}</div>
                <div className="text-xs text-slate-500">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="space-y-3">
              <div className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    {message.type === 'assistant' ? (
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                        <Bot className="w-4 h-4" />
                      </AvatarFallback>
                    ) : (
                      <AvatarFallback className="bg-slate-200 text-slate-600">
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  
                  <div className={`flex flex-col gap-2 ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`p-3 rounded-2xl ${
                      message.type === 'user' 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' 
                        : 'bg-white border shadow-sm'
                    }`}>
                      <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Clock className="w-3 h-3" />
                      {message.timestamp.toLocaleTimeString('ar-SA', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                      {message.type === 'assistant' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => speakText(message.content)}
                          className="h-auto p-1 hover:bg-slate-100"
                        >
                          <Volume2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Suggestions */}
              {message.suggestions && message.suggestions.length > 0 && (
                <div className="ml-11 space-y-2">
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    اقتراحات
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {message.suggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-xs h-auto py-1.5 px-3 hover:bg-blue-50 hover:border-blue-200"
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                  <Bot className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-white border shadow-sm p-3 rounded-2xl">
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span className="text-sm text-slate-500">جاري التفكير...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t bg-white/80 backdrop-blur-sm">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="اكتب رسالتك هنا..."
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              className="pr-12"
              disabled={isLoading}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleVoiceToggle}
              className={`absolute left-1 top-1 h-8 w-8 p-0 ${
                isListening ? 'text-red-500 animate-pulse' : 'text-slate-400'
              }`}
              disabled={isLoading}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
          </div>
          <Button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !inputMessage.trim()}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;