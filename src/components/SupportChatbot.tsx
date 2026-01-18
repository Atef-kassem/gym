import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Message {
  id: string;
  content: string;
  type: 'user' | 'bot';
  timestamp: Date;
}

const SupportChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'مرحباً! أنا مساعدك الذكي للدعم الفني المدعوم بالذكاء الاصطناعي. يرجى إدخال مفتاح Perplexity API أولاً.',
      type: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAIResponse = async (userMessage: string): Promise<string> => {
    if (!apiKey) {
      return 'يرجى إدخال مفتاح Perplexity API أولاً لتفعيل الردود الذكية.';
    }

    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: 'أنت مساعد ذكي للدعم الفني لنظام إدارة الأعمال. ترد باللغة العربية وتقدم المساعدة في المشاكل التقنية وإدارة النظام. كن مختصراً ومفيداً.'
            },
            {
              role: 'user',
              content: userMessage
            }
          ],
          temperature: 0.2,
          top_p: 0.9,
          max_tokens: 500,
          return_images: false,
          return_related_questions: false,
          frequency_penalty: 1,
          presence_penalty: 0
        }),
      });

      if (!response.ok) {
        throw new Error('فشل في الاتصال بخدمة الذكاء الاصطناعي');
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'عذراً، لم أتمكن من معالجة طلبك. يرجى المحاولة مرة أخرى.';
    } catch (error) {
      return 'عذراً، حدث خطأ في الاتصال بخدمة الذكاء الاصطناعي. يرجى التحقق من صحة مفتاح API والمحاولة مرة أخرى.';
    }
  };

  const handleApiKeySubmit = () => {
    if (apiKey.trim()) {
      setShowApiKeyInput(false);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        content: 'تم تفعيل الذكاء الاصطناعي بنجاح! الآن يمكنني مساعدتك بردود ذكية ومتطورة. ما الذي تحتاج مساعدة فيه؟',
        type: 'bot',
        timestamp: new Date()
      }]);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      type: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToProcess = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await getAIResponse(messageToProcess);
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        type: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: 'عذراً، حدث خطأ في معالجة طلبك. يرجى المحاولة مرة أخرى.',
        type: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 left-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full shadow-elegant hover:shadow-glow transition-all duration-300 bg-gradient-primary hover:scale-110"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
        <Badge className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground animate-pulse">
          AI
        </Badge>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <Card className={`w-80 transition-all duration-300 shadow-elegant ${
        isMinimized ? 'h-14' : 'h-96'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-primary text-primary-foreground rounded-t-lg">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Bot className="h-5 w-5" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">مساعد الدعم الفني</h3>
              <p className="text-xs opacity-90">متصل الآن</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-white/20 text-primary-foreground"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-white/20 text-primary-foreground"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <ScrollArea className="h-64 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-2 ${
                      message.type === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.type === 'bot' && (
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    <div
                      className={`max-w-[70%] p-3 rounded-lg text-sm ${
                        message.type === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {message.content}
                    </div>
                    {message.type === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex gap-2 justify-start">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                    <div className="bg-muted p-3 rounded-lg">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-pulse" />
                        <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-pulse delay-100" />
                        <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-pulse delay-200" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t">
              {showApiKeyInput ? (
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground text-center">
                    أدخل مفتاح Perplexity API لتفعيل الردود الذكية
                  </p>
                  <div className="flex gap-2">
                    <Input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="أدخل مفتاح API هنا..."
                      className="flex-1"
                      dir="ltr"
                    />
                    <Button
                      onClick={handleApiKeySubmit}
                      size="icon"
                      disabled={!apiKey.trim()}
                      className="bg-gradient-primary hover:bg-gradient-primary/90"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="اكتب رسالتك هنا..."
                    className="flex-1"
                    dir="rtl"
                  />
                  <Button
                    onClick={handleSendMessage}
                    size="icon"
                    disabled={!inputValue.trim() || isTyping}
                    className="bg-gradient-primary hover:bg-gradient-primary/90"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default SupportChatbot;