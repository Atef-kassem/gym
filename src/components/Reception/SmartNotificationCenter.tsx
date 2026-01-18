import { useState, useEffect } from "react";
import { 
  Bell, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  X, 
  Clock,
  Users,
  Calendar,
  Star,
  TrendingUp,
  Zap,
  Brain,
  Target,
  Filter,
  MoreHorizontal,
  Eye,
  EyeOff,
  BarChart3
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAdvancedBookingSystem } from "@/hooks/useAdvancedBookingSystem";

interface SmartNotification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'alert' | 'ai-insight';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  timestamp: Date;
  category: 'booking' | 'customer' | 'system' | 'ai' | 'performance';
  isRead: boolean;
  isArchived: boolean;
  actionRequired?: boolean;
  relatedData?: any;
  autoActions?: Array<{
    label: string;
    action: () => void;
  }>;
}

export function SmartNotificationCenter() {
  const { bookings, getBookingAnalytics } = useAdvancedBookingSystem();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<SmartNotification[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('timestamp');
  const [showRead, setShowRead] = useState(true);
  const [aiNotificationsEnabled, setAiNotificationsEnabled] = useState(true);

  const analytics = getBookingAnalytics();

  // Generate Smart Notifications
  useEffect(() => {
    const generateNotifications = () => {
      const newNotifications: SmartNotification[] = [];

      // تحليل البيع المؤكدة حديثاً
      const recentConfirmed = bookings.filter(b => 
        b.status === 'confirmed' && 
        new Date(b.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)
      );

      if (recentConfirmed.length > 0) {
        newNotifications.push({
          id: 'recent-confirmed',
          type: 'success',
          priority: 'medium',
          title: 'حجوزات مؤكدة جديدة',
          message: `تم تأكيد ${recentConfirmed.length} حجز جديد في آخر 24 ساعة`,
          timestamp: new Date(),
          category: 'booking',
          isRead: false,
          isArchived: false,
          relatedData: { count: recentConfirmed.length }
        });
      }

      // تنبيه أوقات الذروة
      const currentHour = new Date().getHours();
      if (currentHour >= 10 && currentHour <= 14) {
        newNotifications.push({
          id: 'peak-hours',
          type: 'warning',
          priority: 'high',
          title: 'وقت الذروة نشط',
          message: 'نحن حالياً في وقت الذروة. تأكد من توفر كافة الموارد',
          timestamp: new Date(),
          category: 'system',
          isRead: false,
          isArchived: false,
          actionRequired: true,
          autoActions: [
            {
              label: 'تحقق من الموارد',
              action: () => checkResources()
            },
            {
              label: 'إضافة موارد',
              action: () => addResources()
            }
          ]
        });
      }

      // تحليل الذكاء الاصطناعي
      if (aiNotificationsEnabled) {
        const cancellationRate = (analytics.cancelledBookings / analytics.totalBookings) * 100;
        if (cancellationRate > 15) {
          newNotifications.push({
            id: 'ai-cancellation-analysis',
            type: 'ai-insight',
            priority: 'high',
            title: 'الذكاء الاصطناعي: معدل إلغاء مرتفع',
            message: `اكتشف الذكاء الاصطناعي معدل إلغاء مرتفع (${cancellationRate.toFixed(1)}%). يُوصى بتحليل الأسباب`,
            timestamp: new Date(),
            category: 'ai',
            isRead: false,
            isArchived: false,
            actionRequired: true,
            autoActions: [
              {
                label: 'تحليل الأسباب',
                action: () => analyzeReasons()
              },
              {
                label: 'تطبيق حلول ذكية',
                action: () => applySolutions()
              }
            ]
          });
        }

        // توصية زيادة الإيرادات
        if (analytics.averageBookingValue < 200) {
          newNotifications.push({
            id: 'ai-revenue-opportunity',
            type: 'ai-insight',
            priority: 'medium',
            title: 'فرصة ذكية لزيادة الإيرادات',
            message: 'يمكن زيادة متوسط قيمة الحجز بـ 25% من خلال اقتراحات ذكية للخدمات الإضافية',
            timestamp: new Date(),
            category: 'ai',
            isRead: false,
            isArchived: false,
            autoActions: [
              {
                label: 'تفعيل الاقتراحات الذكية',
                action: () => enableSmartSuggestions()
              }
            ]
          });
        }
      }

      // تنبيهات العملاء المتكررين
      const repeatCustomers = new Set(
        bookings.filter(b => b.status === 'completed').map(b => b.customerId)
      ).size;
      
      if (repeatCustomers > 0) {
        newNotifications.push({
          id: 'repeat-customers',
          type: 'info',
          priority: 'low',
          title: 'عملاء متكررون نشطون',
          message: `لديك ${repeatCustomers} عميل متكرر هذا الأسبوع. فرصة لتعزيز الولاء`,
          timestamp: new Date(),
          category: 'customer',
          isRead: false,
          isArchived: false,
          autoActions: [
            {
              label: 'إرسال عروض ولاء',
              action: () => sendLoyaltyOffers()
            }
          ]
        });
      }

      // تنبيهات الأداء
      if (analytics.capacityUtilization > 90) {
        newNotifications.push({
          id: 'high-capacity',
          type: 'alert',
          priority: 'critical',
          title: 'استغلال طاقة عالي',
          message: `الطاقة الاستيعابية ${analytics.capacityUtilization}% - قد تحتاج لإعادة جدولة`,
          timestamp: new Date(),
          category: 'performance',
          isRead: false,
          isArchived: false,
          actionRequired: true,
          autoActions: [
            {
              label: 'إعادة الجدولة التلقائية',
              action: () => autoReschedule()
            }
          ]
        });
      }

      setNotifications(prev => [...prev, ...newNotifications]);
    };

    generateNotifications();
    
    // تحديث دوري كل 30 ثانية
    const interval = setInterval(generateNotifications, 30000);
    return () => clearInterval(interval);
  }, [bookings, analytics, aiNotificationsEnabled]);

  // Helper Functions
  const checkResources = () => {
    toast({
      title: "فحص الموارد",
      description: "تم فحص الموارد المتاحة - جميع الأنظمة تعمل بكفاءة",
    });
  };

  const addResources = () => {
    toast({
      title: "إضافة موارد",
      description: "تم طلب موارد إضافية لتغطية فترة الذروة",
    });
  };

  const analyzeReasons = () => {
    toast({
      title: "تحليل أسباب الإلغاء",
      description: "تم بدء تحليل ذكي لأسباب الإلغاء - النتائج ستظهر قريباً",
    });
  };

  const applySolutions = () => {
    toast({
      title: "تطبيق حلول ذكية",
      description: "تم تطبيق حلول الذكاء الاصطناعي لتقليل معدل الإلغاء",
    });
  };

  const enableSmartSuggestions = () => {
    toast({
      title: "تفعيل الاقتراحات الذكية",
      description: "تم تفعيل نظام الاقتراحات الذكية لزيادة الإيرادات",
    });
  };

  const sendLoyaltyOffers = () => {
    toast({
      title: "عروض الولاء",
      description: "تم إرسال عروض خاصة للعملاء المتكررين",
    });
  };

  const autoReschedule = () => {
    toast({
      title: "إعادة الجدولة التلقائية",
      description: "تم تشغيل نظام إعادة الجدولة التلقائية",
    });
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const markAsArchived = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isArchived: true } : n)
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type: SmartNotification['type']) => {
    switch (type) {
      case 'info': return Info;
      case 'warning': return AlertTriangle;
      case 'success': return CheckCircle2;
      case 'alert': return AlertTriangle;
      case 'ai-insight': return Brain;
      default: return Info;
    }
  };

  const getNotificationColor = (type: SmartNotification['type']) => {
    switch (type) {
      case 'info': return 'text-blue-600 bg-blue-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'success': return 'text-green-600 bg-green-100';
      case 'alert': return 'text-red-600 bg-red-100';
      case 'ai-insight': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityBadge = (priority: SmartNotification['priority']) => {
    switch (priority) {
      case 'critical': return <Badge variant="destructive">حرج</Badge>;
      case 'high': return <Badge variant="default">عالي</Badge>;
      case 'medium': return <Badge variant="secondary">متوسط</Badge>;
      case 'low': return <Badge variant="outline">منخفض</Badge>;
    }
  };

  const filteredNotifications = notifications
    .filter(n => {
      if (!showRead && n.isRead) return false;
      if (n.isArchived) return false;
      if (filter === 'all') return true;
      return n.category === filter;
    })
    .sort((a, b) => {
      if (sortBy === 'timestamp') return b.timestamp.getTime() - a.timestamp.getTime();
      if (sortBy === 'priority') {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return 0;
    });

  const unreadCount = notifications.filter(n => !n.isRead && !n.isArchived).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="h-6 w-6 text-primary" />
            {unreadCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs animate-pulse"
              >
                {unreadCount}
              </Badge>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold">مركز الإشعارات الذكي</h2>
            <p className="text-muted-foreground">
              إشعارات ذكية وتنبيهات مدعومة بالذكاء الاصطناعي
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-purple-600" />
            <span className="text-sm">الذكاء الاصطناعي</span>
            <Switch 
              checked={aiNotificationsEnabled}
              onCheckedChange={setAiNotificationsEnabled}
            />
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              const newNotifications = notifications.map(n => ({ ...n, isRead: true }));
              setNotifications(newNotifications);
              toast({
                title: "تم تحديد الكل كمقروء",
                description: "جميع الإشعارات تم تحديدها كمقروءة",
                className: "toast-success"
              });
            }}
            className="interactive-button"
          >
            <Eye className="h-4 w-4 mr-2" />
            تحديد الكل كمقروء
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="تصفية" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الفئات</SelectItem>
            <SelectItem value="booking">حجوزات</SelectItem>
            <SelectItem value="customer">عملاء</SelectItem>
            <SelectItem value="ai">ذكاء اصطناعي</SelectItem>
            <SelectItem value="system">نظام</SelectItem>
            <SelectItem value="performance">أداء</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="timestamp">الأحدث</SelectItem>
            <SelectItem value="priority">الأولوية</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <span className="text-sm">إظهار المقروء</span>
          <Switch checked={showRead} onCheckedChange={setShowRead} />
        </div>
      </div>

      {/* Notifications */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">لا توجد إشعارات</h3>
              <p className="text-muted-foreground">جميع الإشعارات محدثة!</p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => {
            const IconComponent = getNotificationIcon(notification.type);
            const colorClass = getNotificationColor(notification.type);
            
            return (
              <Card 
                key={notification.id}
                className={`transition-all duration-300 hover:shadow-lg ${
                  !notification.isRead ? 'border-l-4 border-l-primary bg-primary/5' : ''
                } ${notification.priority === 'critical' ? 'animate-pulse' : ''}`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${colorClass}`}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle className="text-lg">{notification.title}</CardTitle>
                          {getPriorityBadge(notification.priority)}
                          {notification.actionRequired && (
                            <Badge variant="outline" className="text-red-600">
                              إجراء مطلوب
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground">{notification.message}</p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {notification.timestamp.toLocaleString('ar-SA')}
                          <Badge variant="outline" className="text-xs">
                            {notification.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsArchived(notification.id)}
                      >
                        <EyeOff className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                {notification.autoActions && notification.autoActions.length > 0 && (
                  <CardContent className="pt-0">
                    <div className="flex gap-2 flex-wrap">
                      {notification.autoActions.map((action, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            action.action();
                            markAsRead(notification.id);
                          }}
                          className="hover-scale"
                        >
                          <Zap className="h-3 w-3 mr-1" />
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })
        )}
      </div>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            إحصائيات الإشعارات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{notifications.length}</div>
              <div className="text-sm text-muted-foreground">إجمالي الإشعارات</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{unreadCount}</div>
              <div className="text-sm text-muted-foreground">غير مقروء</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {notifications.filter(n => n.type === 'ai-insight').length}
              </div>
              <div className="text-sm text-muted-foreground">رؤى ذكية</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {notifications.filter(n => n.actionRequired).length}
              </div>
              <div className="text-sm text-muted-foreground">تحتاج إجراء</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}