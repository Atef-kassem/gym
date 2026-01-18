import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Bot,
  Send,
  Sparkles,
  TrendingUp,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  Brain,
  MessageSquare,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Settings,
  Lightbulb,
  Target,
  BarChart3,
  Zap,
  Star,
  ArrowUp,
  ArrowDown,
  Activity,
  Heart,
  Smile
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useReceptionData } from '@/hooks/useReceptionData';

interface AIMessage {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    type?: 'suggestion' | 'alert' | 'analysis' | 'recommendation' | 'system';
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    category?: string;
    actions?: Array<{
      label: string;
      action: () => void;
      variant?: 'default' | 'destructive' | 'outline';
    }>;
  };
}

interface AIInsight {
  id: string;
  title: string;
  description: string;
  type: 'optimization' | 'alert' | 'opportunity' | 'performance';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  metrics?: {
    current: number;
    target: number;
    change: number;
  };
  recommendations: string[];
  icon: any;
  color: string;
  bgColor: string;
}

export function EnhancedAIReceptionAssistant() {
  const { toast } = useToast();
  const { customers, workOrders } = useReceptionData();
  
  // Mock stats function since getSystemStats doesn't exist
  const getSystemStats = () => ({
    totalCustomers: customers.length,
    activeWorkOrders: workOrders.filter(w => ['منتظر', 'قيد التنفيذ'].includes(w.status)).length,
    totalRevenue: 15420,
    totalInvoices: 156
  });
  
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [activeInsightType, setActiveInsightType] = useState<string>('all');
  const [aiPersonality, setAiPersonality] = useState<'professional' | 'friendly' | 'analytical'>('friendly');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const speechRecognition = useRef<any>(null);

  // Initialize AI with welcome message
  useEffect(() => {
    const welcomeMessage: AIMessage = {
      id: 'welcome',
      type: 'ai',
      content: `مرحباً! أنا مساعدك الذكي في إدارة الاستقبال 🤖✨\n\nيمكنني مساعدتك في:\n📊 تحليل الأداء والإحصائيات\n🎯 تحسين تجربة العملاء\n⚡ اقتراح حلول سريعة\n📈 توقع الاتجاهات\n\nما الذي تود معرفته اليوم؟`,
      timestamp: new Date(),
      metadata: {
        type: 'system',
        priority: 'medium'
      }
    };
    setMessages([welcomeMessage]);
    generateAIInsights();
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Generate AI insights
  const generateAIInsights = () => {
    const stats = getSystemStats();
    const newInsights: AIInsight[] = [
      {
        id: 'queue-optimization',
        title: 'تحسين إدارة الطابور',
        description: 'يمكن تقليل أوقات الانتظار بنسبة 25% من خلال إعادة ترتيب المسارات',
        type: 'optimization',
        priority: 'high',
        metrics: {
          current: 15,
          target: 11,
          change: -26.7
        },
        recommendations: [
          'تفعيل مسار الخدمة السريعة في أوقات الذروة',
          'إعادة توزيع الموظفين حسب الأولوية',
          'تطبيق نظام الحجز المسبق للخدمات الطويلة'
        ],
        icon: Clock,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50'
      },
      {
        id: 'customer-satisfaction',
        title: 'فرصة تحسين رضا العملاء',
        description: 'اكتشفت نمطاً في شكاوى العملاء يمكن معالجته بسهولة',
        type: 'opportunity',
        priority: 'medium',
        metrics: {
          current: 4.2,
          target: 4.7,
          change: 11.9
        },
        recommendations: [
          'تحسين التواصل مع العملاء أثناء الانتظار',
          'توفير مرطبات مجانية في منطقة الانتظار',
          'إرسال تحديثات SMS عن حالة الخدمة'
        ],
        icon: Heart,
        color: 'text-pink-600',
        bgColor: 'bg-pink-50'
      },
      {
        id: 'revenue-opportunity',
        title: 'فرصة زيادة الإيرادات',
        description: 'يمكن زيادة الإيرادات بنسبة 18% من خلال الخدمات الإضافية',
        type: 'opportunity',
        priority: 'high',
        metrics: {
          current: 15420,
          target: 18200,
          change: 18.0
        },
        recommendations: [
          'اقتراح خدمات إضافية للعملاء المنتظرين',
          'تطبيق عروض مجمعة للخدمات المتكاملة',
          'برنامج ولاء أكثر جاذبية للعملاء VIP'
        ],
        icon: TrendingUp,
        color: 'text-green-600',
        bgColor: 'bg-green-50'
      },
      {
        id: 'efficiency-alert',
        title: 'تنبيه: انخفاض الكفاءة',
        description: 'لوحظ انخفاض في سرعة الخدمة في الساعات الأخيرة',
        type: 'alert',
        priority: 'urgent',
        recommendations: [
          'فحص أداء الموظفين في الوردية الحالية',
          'التأكد من توفر جميع المعدات اللازمة',
          'مراجعة توزيع المهام والأولويات'
        ],
        icon: AlertTriangle,
        color: 'text-red-600',
        bgColor: 'bg-red-50'
      }
    ];
    
    setInsights(newInsights);
  };

  // Handle sending messages
  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: currentMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);

    // Simulate AI processing
    setTimeout(() => {
      const aiResponse = generateAIResponse(currentMessage);
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  // Generate AI response based on user input
  const generateAIResponse = (userInput: string): AIMessage => {
    const input = userInput.toLowerCase();
    let response = '';
    let metadata: AIMessage['metadata'] = {
      type: 'analysis',
      priority: 'medium'
    };

    if (input.includes('إحصائيات') || input.includes('تقرير') || input.includes('أداء')) {
      const stats = getSystemStats();
      response = `📊 إليك تحليل الأداء الحالي:\n\n✅ إجمالي العملاء: ${stats.totalCustomers}\n🎯 أوامر العمل النشطة: ${stats.activeWorkOrders}\n💰 الإيرادات: ${stats.totalRevenue.toLocaleString()} جنيه\n\n📈 النصائح:\n• أداء ممتاز في خدمة العملاء\n• يمكن تحسين سرعة الخدمة بنسبة 15%\n• فرصة زيادة الإيرادات من الخدمات الإضافية`;
      
      metadata.actions = [
        {
          label: 'عرض تقرير مفصل',
          action: () => toast({ title: 'جاري إعداد التقرير المفصل...' }),
          variant: 'default'
        },
        {
          label: 'تحسين الأداء',
          action: () => toast({ title: 'جاري تطبيق تحسينات الأداء...' }),
          variant: 'outline'
        }
      ];
    } else if (input.includes('طابور') || input.includes('انتظار') || input.includes('وقت')) {
      response = `⏰ تحليل الطابور الحالي:\n\n🔍 متوسط وقت الانتظار: 12 دقيقة\n👥 العملاء في الطابور: ${workOrders.filter(w => w.status === 'منتظر').length}\n🚀 الحالة: مستقرة\n\n💡 اقتراحات التحسين:\n• تفعيل الخدمة السريعة للطلبات البسيطة\n• إعادة توزيع الموظفين على المسارات\n• إرسال تحديثات للعملاء عبر SMS`;
      
      metadata.type = 'suggestion';
      metadata.actions = [
        {
          label: 'تطبيق التحسينات',
          action: () => {
            toast({ 
              title: 'تم تطبيق التحسينات', 
              description: 'تم تحسين إدارة الطابور بنجاح' 
            });
          }
        }
      ];
    } else if (input.includes('عملاء') || input.includes('رضا') || input.includes('خدمة')) {
      response = `👥 تحليل رضا العملاء:\n\n⭐ متوسط التقييم: 4.3/5\n📈 نسبة الرضا: 87%\n🔄 معدل العودة: 78%\n\n🎯 نقاط القوة:\n• سرعة الاستجابة\n• جودة الخدمة\n• الاحترافية\n\n⚠️ نقاط التحسين:\n• تقليل أوقات الانتظار\n• تحسين التواصل\n• توسيع الخدمات`;
      
      metadata.type = 'recommendation';
    } else if (input.includes('مشكلة') || input.includes('خطأ') || input.includes('مساعدة')) {
      response = `🔧 أنا هنا للمساعدة!\n\nيمكنني مساعدتك في:\n\n🛠️ حل المشاكل التقنية\n📋 إدارة الطوابير\n👥 التعامل مع العملاء\n📊 تحليل البيانات\n💡 تحسين العمليات\n\nما هي المشكلة التي تواجهها تحديداً؟`;
      
      metadata.type = 'system';
      metadata.priority = 'high';
    } else {
      response = `🤖 فهمت استفسارك!\n\nبناءً على تحليل البيانات الحالية، إليك ما يمكنني اقتراحه:\n\n✨ التركيز على تحسين تجربة العملاء\n🚀 تطبيق التقنيات الذكية في الخدمة\n📈 مراقبة المؤشرات الرئيسية\n\nهل تود معلومات أكثر تفصيلاً حول أي من هذه النقاط؟`;
    }

    return {
      id: Date.now().toString(),
      type: 'ai',
      content: response,
      timestamp: new Date(),
      metadata
    };
  };

  // Handle voice input
  const toggleVoiceInput = () => {
    if (isListening) {
      speechRecognition.current?.stop();
      setIsListening(false);
    } else {
      if ('webkitSpeechRecognition' in window) {
        speechRecognition.current = new (window as any).webkitSpeechRecognition();
        speechRecognition.current.lang = 'ar-SA';
        speechRecognition.current.continuous = false;
        speechRecognition.current.interimResults = false;

        speechRecognition.current.onstart = () => setIsListening(true);
        speechRecognition.current.onend = () => setIsListening(false);
        speechRecognition.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setCurrentMessage(transcript);
        };

        speechRecognition.current.start();
      } else {
        toast({
          title: 'غير مدعوم',
          description: 'التعرف على الصوت غير مدعوم في هذا المتصفح',
          variant: 'destructive'
        });
      }
    }
  };

  // Text-to-speech
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    }
  };

  const filteredInsights = insights.filter(insight => 
    activeInsightType === 'all' || insight.type === activeInsightType
  );

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'optimization': return Target;
      case 'alert': return AlertTriangle;
      case 'opportunity': return TrendingUp;
      case 'performance': return BarChart3;
      default: return Lightbulb;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      default: return 'border-green-500 bg-green-50';
    }
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* AI Header */}
      <Card className="bg-gradient-to-r from-purple-500 to-blue-600 text-white animate-fade-in">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg animate-pulse">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span>المساعد الذكي للاستقبال</span>
                <Badge className="bg-white/20 text-white border-white/30 animate-bounce">
                  <Activity className="h-3 w-3 mr-1" />
                  نشط
                </Badge>
              </div>
              <p className="text-sm text-white/80 mt-1">
                مدعوم بالذكاء الاصطناعي المتقدم ومعالجة اللغة الطبيعية
              </p>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* AI Insights */}
      <Card className="animate-slide-in-right">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            رؤى ذكية وتوصيات
          </CardTitle>
          <div className="flex gap-2 mt-3">
            {['all', 'optimization', 'alert', 'opportunity', 'performance'].map((type) => (
              <Button
                key={type}
                variant={activeInsightType === type ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveInsightType(type)}
                className="transition-all duration-300 hover:scale-105"
              >
                {type === 'all' ? 'الكل' :
                 type === 'optimization' ? 'تحسين' :
                 type === 'alert' ? 'تنبيه' :
                 type === 'opportunity' ? 'فرصة' : 'أداء'}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-64 overflow-y-auto">
            {filteredInsights.map((insight, index) => {
              const IconComponent = insight.icon;
              return (
                <div
                  key={insight.id}
                  className={`p-4 rounded-lg border-l-4 transition-all duration-500 hover:scale-105 hover:shadow-md animate-scale-in ${getPriorityColor(insight.priority)}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${insight.bgColor}`}>
                      <IconComponent className={`h-5 w-5 ${insight.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{insight.title}</h4>
                        <Badge variant={insight.priority === 'urgent' ? 'destructive' : 'secondary'}>
                          {insight.priority === 'urgent' ? 'عاجل' :
                           insight.priority === 'high' ? 'مهم' :
                           insight.priority === 'medium' ? 'متوسط' : 'منخفض'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                      
                      {insight.metrics && (
                        <div className="flex items-center gap-4 text-sm mb-3">
                          <span>الحالي: <strong>{insight.metrics.current}</strong></span>
                          <span>الهدف: <strong>{insight.metrics.target}</strong></span>
                          <span className={`flex items-center gap-1 ${insight.metrics.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {insight.metrics.change > 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                            {Math.abs(insight.metrics.change)}%
                          </span>
                        </div>
                      )}
                      
                      <div className="space-y-1">
                        {insight.recommendations.slice(0, 2).map((rec, i) => (
                          <div key={i} className="text-xs text-muted-foreground flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {rec}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card className="flex-1 flex flex-col animate-fade-in">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              محادثة مع المساعد الذكي
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => speakText('مرحباً، كيف يمكنني مساعدتك اليوم؟')}
                disabled={isSpeaking}
                className="transition-all duration-300 hover:scale-105"
              >
                {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="transition-all duration-300 hover:scale-105">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>إعدادات المساعد الذكي</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">شخصية المساعد</label>
                      <select
                        value={aiPersonality}
                        onChange={(e) => setAiPersonality(e.target.value as any)}
                        className="w-full mt-1 p-2 border rounded-lg"
                      >
                        <option value="professional">مهني</option>
                        <option value="friendly">ودود</option>
                        <option value="analytical">تحليلي</option>
                      </select>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 pr-4 mb-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-lg transition-all duration-300 hover:scale-105 ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : message.type === 'ai'
                        ? 'bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200'
                        : 'bg-yellow-50 border border-yellow-200'
                    }`}
                  >
                    {message.type !== 'user' && (
                      <div className="flex items-center gap-2 mb-2">
                        <Bot className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-600">
                          المساعد الذكي
                        </span>
                        {message.metadata?.type && (
                          <Badge variant="outline" className="text-xs">
                            {message.metadata.type === 'suggestion' ? 'اقتراح' :
                             message.metadata.type === 'alert' ? 'تنبيه' :
                             message.metadata.type === 'analysis' ? 'تحليل' : 'توصية'}
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    <div className="whitespace-pre-line text-sm leading-relaxed">
                      {message.content}
                    </div>
                    
                    {message.metadata?.actions && (
                      <div className="flex gap-2 mt-3">
                        {message.metadata.actions.map((action, index) => (
                          <Button
                            key={index}
                            variant={action.variant || 'outline'}
                            size="sm"
                            onClick={action.action}
                            className="transition-all duration-300 hover:scale-105"
                          >
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    )}
                    
                    <div className="text-xs opacity-60 mt-2">
                      {message.timestamp.toLocaleTimeString('ar-SA')}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start animate-pulse">
                  <div className="bg-gray-100 rounded-lg p-4 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-600 animate-spin" />
                    <span className="text-sm text-gray-600">جاري التفكير...</span>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          <div className="flex gap-2">
            <Input
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              placeholder="اكتب رسالتك هنا..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={toggleVoiceInput}
              variant="outline"
              disabled={isLoading}
              className={`transition-all duration-300 hover:scale-105 ${isListening ? 'bg-red-100 border-red-300' : ''}`}
            >
              {isListening ? <MicOff className="h-4 w-4 text-red-600" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={!currentMessage.trim() || isLoading}
              className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 transition-all duration-300 hover:scale-105"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}