import { useState } from 'react';
import { Bot, MessageCircle, Send, Sparkles, Brain, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';

interface AIMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
  suggestions?: string[];
}

interface AIReceptionAssistantProps {
  onRecommendation?: (recommendation: any) => void;
}

export function AIReceptionAssistant({ onRecommendation }: AIReceptionAssistantProps) {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: 'مرحباً! أنا مساعد الذكاء الاصطناعي لإدارة الاستقبال. كيف يمكنني مساعدتك اليوم؟',
      timestamp: new Date().toISOString(),
      suggestions: [
        'تحليل أوقات الانتظار',
        'اقتراح تحسينات للخدمة',
        'تحليل رضا العملاء',
        'توقع الذروة اليومية'
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const aiResponses = {
    'تحليل أوقات الانتظار': {
      content: `📊 تحليل أوقات الانتظار:

• متوسط وقت الانتظار: 12 دقيقة
• الذروة: 10:00 - 12:00 صباحاً (25 دقيقة)
• أقل انتظار: 14:00 - 16:00 (5 دقائق)

💡 توصيات:
- إضافة موظف إضافي في فترة الذروة
- تفعيل نظام الحجز المسبق
- إرسال تحديثات للعملاء عن وقت الانتظار المتوقع`,
      suggestions: ['تطبيق التوصيات', 'تحليل تفصيلي أكثر', 'مقارنة بالأسبوع الماضي']
    },
    'اقتراح تحسينات للخدمة': {
      content: `🚀 اقتراحات لتحسين الخدمة:

1. **تحسين تجربة العميل:**
   - شاشات عرض لحالة الطلبات
   - منطقة انتظار مريحة مع WiFi
   - مشروبات مجانية

2. **تحسين العمليات:**
   - نظام QR للطلبات السريعة
   - تطبيق جوال للحجوزات
   - نظام إشعارات SMS

3. **تدريب الموظفين:**
   - دورات خدمة العملاء
   - التعامل مع الشكاوى
   - استخدام الأنظمة الجديدة`,
      suggestions: ['تنفيذ الاقتراح الأول', 'المزيد من التفاصيل', 'تقدير التكلفة']
    },
    'تحليل رضا العملاء': {
      content: `📈 تحليل رضا العملاء:

• التقييم العام: 4.3/5 ⭐
• نسبة الرضا: 86%
• العملاء المتكررون: 72%

📋 تفصيل التقييمات:
- جودة الخدمة: 4.5/5
- وقت الانتظار: 3.8/5
- تعامل الموظفين: 4.6/5
- نظافة المكان: 4.4/5

🎯 نقاط التحسين:
- تقليل وقت الانتظار
- تحسين التواصل مع العملاء`,
      suggestions: ['خطة تحسين الانتظار', 'تدريب إضافي للموظفين', 'استبيان مفصل']
    },
    'توقع الذروة اليومية': {
      content: `⏰ توقعات الذروة اليومية:

📅 **اليوم (${new Date().toLocaleDateString('ar-SA')}):**
- الذروة الأولى: 09:00 - 11:00 (45 عميل متوقع)
- الذروة الثانية: 15:00 - 17:00 (38 عميل متوقع)

📊 **التوزيع المتوقع:**
- صباحاً: 40% من العملاء
- ظهراً: 25% من العملاء  
- مساءً: 35% من العملاء

💪 **التوصيات:**
- 3 موظفين في الذروة الصباحية
- 2 موظفين في الذروة المسائية
- تأكيد البيع المسبقة`,
      suggestions: ['تعديل جدول الموظفين', 'إرسال تذكيرات للحجوزات', 'تحضير مواد إضافية']
    }
  };

  const handleSendMessage = async (message: string = inputMessage) => {
    if (!message.trim()) return;

    const newUserMessage: AIMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const response = aiResponses[message as keyof typeof aiResponses] || {
        content: `شكراً لسؤالك حول "${message}". أنا أعمل على تحليل البيانات وسأقدم لك إجابة مفصلة قريباً. في الوقت الحالي، يمكنني مساعدتك في:

• تحليل أداء الاستقبال
• تحسين تجربة العملاء  
• إدارة أوقات الانتظار
• تحليل البيانات والإحصائيات

هل تريد المساعدة في أي من هذه النقاط؟`,
        suggestions: ['تحليل أوقات الانتظار', 'اقتراح تحسينات للخدمة', 'تحليل رضا العملاء']
      };

      const aiMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response.content,
        timestamp: new Date().toISOString(),
        suggestions: response.suggestions
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);

      // Send recommendation if callback provided
      if (onRecommendation && message.includes('تحليل')) {
        onRecommendation({
          type: 'analysis',
          content: response.content,
          actionable: true
        });
      }
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0 pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
            <Brain className="w-5 h-5 text-white" />
          </div>
          مساعد الذكاء الاصطناعي
          <Badge variant="secondary" className="mr-auto">
            <Sparkles className="w-3 h-3 mr-1" />
            متطور
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-blue-500 text-white ml-2'
                      : 'bg-gray-100 text-gray-900 mr-2'
                  }`}
                >
                  {message.type === 'ai' && (
                    <div className="flex items-center gap-2 mb-2">
                      <Bot className="w-4 h-4 text-blue-500" />
                      <span className="text-xs font-medium text-blue-500">AI Assistant</span>
                    </div>
                  )}
                  <div className="whitespace-pre-line text-sm">{message.content}</div>
                  
                  {message.suggestions && (
                    <div className="mt-3 space-y-1">
                      <div className="text-xs text-gray-500 mb-2">اقتراحات سريعة:</div>
                      <div className="flex flex-wrap gap-1">
                        {message.suggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="h-7 text-xs hover:bg-blue-50"
                          >
                            <Zap className="w-3 h-3 mr-1" />
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3 mr-2">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-blue-500" />
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex-shrink-0 p-4 border-t bg-gray-50">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="اكتب سؤالك أو طلبك هنا..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button 
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim() || isTyping}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex gap-1 mt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSuggestionClick('تحليل أوقات الانتظار')}
              className="text-xs h-7"
            >
              تحليل سريع
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSuggestionClick('توقع الذروة اليومية')}
              className="text-xs h-7"
            >
              توقعات اليوم
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}