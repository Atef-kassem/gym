import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Volume2, 
  VolumeX, 
  Bot, 
  Sparkles, 
  Settings,
  X,
  Phone,
  PhoneOff,
  MessageSquare
} from 'lucide-react';

interface AIVehicleAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIVehicleAssistant({ isOpen, onClose }: AIVehicleAssistantProps) {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [messages, setMessages] = useState<Array<{text: string, type: 'user' | 'ai', timestamp: Date}>>([
    {
      text: "مرحباً! أنا مساعدك الذكي لإدارة المركبات. يمكنني مساعدتك في البحث عن المركبات، إضافة مركبات جديدة، وعرض الإحصائيات. كيف يمكنني مساعدتك؟",
      type: 'ai',
      timestamp: new Date()
    }
  ]);

  const handleStartConversation = async () => {
    toast({
      title: "بدء المحادثة",
      description: "لتفعيل المساعد الصوتي، يرجى إضافة ElevenLabs API Key في الإعدادات"
    });
    setIsConnected(true);
    
    // محاكاة رد من المساعد
    setTimeout(() => {
      setMessages(prev => [...prev, {
        text: "تم الاتصال بنجاح! يمكنك الآن طرح الأسئلة حول المركبات.",
        type: 'ai',
        timestamp: new Date()
      }]);
    }, 1000);
  };

  const handleEndConversation = () => {
    setIsConnected(false);
    setIsSpeaking(false);
    toast({
      title: "تم إنهاء المحادثة",
      description: "شكراً لاستخدام المساعد الذكي"
    });
  };

  const simulateUserQuestion = () => {
    const questions = [
      "كم عدد المركبات الإجمالي؟",
      "أريد إضافة مركبة جديدة",
      "ما هي المركبات التي تحتاج صيانة؟",
      "ابحث عن مركبة تويوتا كامري"
    ];
    
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    
    setMessages(prev => [...prev, {
      text: randomQuestion,
      type: 'user',
      timestamp: new Date()
    }]);

    // محاكاة رد المساعد
    setTimeout(() => {
      setIsSpeaking(true);
      let response = "";
      
      if (randomQuestion.includes("عدد المركبات")) {
        response = "إجمالي المركبات المسجلة: 156 مركبة، منها 142 نشطة، 8 تحت الصيانة، و6 تحتاج صيانة قريباً.";
      } else if (randomQuestion.includes("إضافة مركبة")) {
        response = "سأقوم بفتح نموذج إضافة مركبة جديدة لك. يرجى ملء البيانات المطلوبة.";
      } else if (randomQuestion.includes("تحتاج صيانة")) {
        response = "هناك 6 مركبات تحتاج صيانة خلال الأيام القادمة. سأعرض لك قائمة بها.";
      } else {
        response = "تم العثور على 3 مركبات تويوتا كامري في النظام. هل تريد عرض تفاصيلها؟";
      }
      
      setMessages(prev => [...prev, {
        text: response,
        type: 'ai',
        timestamp: new Date()
      }]);
      
      setTimeout(() => setIsSpeaking(false), 2000);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="fixed right-4 top-4 bottom-4 w-96 bg-white rounded-xl shadow-2xl animate-slide-in-right">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Bot className="h-8 w-8" />
                  <Sparkles className="h-4 w-4 absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold">المساعد الذكي</h3>
                  <p className="text-sm opacity-90">مساعد إدارة المركبات</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Status */}
          <div className="p-4 border-b bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant={isConnected ? 'default' : 'secondary'}>
                  {isConnected ? 'متصل' : 'غير متصل'}
                </Badge>
                {isSpeaking && (
                  <Badge variant="outline" className="animate-pulse">
                    <Volume2 className="h-3 w-3 mr-1" />
                    يتحدث
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setVolume(volume === 0 ? 0.7 : 0)}
                >
                  {volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-16"
                />
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg transition-all duration-300 hover:scale-105 ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                      : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString('ar-SA')}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="p-4 border-t bg-gray-50">
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                {!isConnected ? (
                  <Button
                    onClick={handleStartConversation}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transition-all duration-300"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    بدء المحادثة
                  </Button>
                ) : (
                  <Button
                    onClick={handleEndConversation}
                    variant="destructive"
                    className="flex-1 hover:scale-105 transition-transform duration-200"
                  >
                    <PhoneOff className="h-4 w-4 mr-2" />
                    إنهاء المحادثة
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="hover:scale-110 transition-transform duration-200"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
              
              {isConnected && (
                <Button
                  onClick={simulateUserQuestion}
                  variant="outline"
                  className="w-full hover:bg-blue-50 transition-all duration-300"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  طرح سؤال تجريبي
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}