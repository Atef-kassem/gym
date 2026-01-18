import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, X, AlertCircle, Calendar, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: number;
  type: 'alert' | 'reminder' | 'info';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

const initialNotifications: Notification[] = [
  {
    id: 1,
    type: 'alert',
    title: 'تنبيه مهم',
    message: 'عدد العملاء الجدد تجاوز المعدل المتوقع بنسبة 25%',
    time: 'منذ 5 دقائق',
    isRead: false
  },
  {
    id: 2,
    type: 'reminder',
    title: 'تذكير',
    message: 'موعد مراجعة الحملات التسويقية اليوم في الساعة 2:00 م',
    time: 'منذ ساعة',
    isRead: false
  },
  {
    id: 3,
    type: 'info',
    title: 'إحصائية',
    message: 'ارتفاع معدل رضا العملاء إلى 4.6/5 هذا الشهر',
    time: 'منذ ساعتين',
    isRead: true
  }
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'alert':
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    case 'reminder':
      return <Calendar className="w-4 h-4 text-blue-500" />;
    case 'info':
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    default:
      return <Bell className="w-4 h-4 text-gray-500" />;
  }
};

export function DashboardNotifications() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const { toast } = useToast();

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const dismissNotification = (id: number) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    toast({
      title: "تم إخفاء الإشعار",
      description: "تم إخفاء الإشعار بنجاح",
    });
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (notifications.length === 0) return null;

  return (
    <Card className="hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-blue-50/30 to-white animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-500" />
          الإشعارات
          {unreadCount > 0 && (
            <Badge className="bg-red-500 text-white">
              {unreadCount}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {notifications.map((notification, index) => (
            <div
              key={notification.id}
              className={`flex items-start gap-3 p-3 rounded-lg border transition-all duration-200 hover:shadow-md animate-scale-in ${
                notification.isRead 
                  ? 'bg-gray-50 border-gray-200' 
                  : 'bg-white border-blue-200 shadow-sm'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mt-1">
                {getNotificationIcon(notification.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className={`text-sm font-medium ${
                    notification.isRead ? 'text-gray-700' : 'text-gray-900'
                  }`}>
                    {notification.title}
                  </h4>
                  {!notification.isRead && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
                <p className={`text-xs ${
                  notification.isRead ? 'text-gray-500' : 'text-gray-600'
                }`}>
                  {notification.message}
                </p>
                <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
              </div>
              
              <div className="flex items-center gap-1">
                {!notification.isRead && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => markAsRead(notification.id)}
                    className="h-6 w-6 p-0 hover:bg-blue-100"
                  >
                    <span className="sr-only">وضع علامة كمقروء</span>
                    •
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => dismissNotification(notification.id)}
                  className="h-6 w-6 p-0 hover:bg-red-100"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}