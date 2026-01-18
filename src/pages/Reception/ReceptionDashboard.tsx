import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Car,
  Calendar,
  MessageSquare,
  Star,
  Phone,
  UserPlus,
  ClipboardList,
  Bell,
  BarChart3,
  Activity,
  Target,
  Zap,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Eye,
  RefreshCw
} from 'lucide-react';
import { useReceptionData } from '@/hooks/useReceptionData';
import { ReceptionBookingIntegration } from '@/components/Reception/ReceptionBookingIntegration';
import { toast } from '@/hooks/use-toast';
import { BranchSelector } from '@/components/BranchSelector';

export default function ReceptionDashboard() {
  const navigate = useNavigate();
  const {
    customers,
    workOrders,
    bookings,
    complaints,
    getWorkOrdersByStatus,
    getTodayBookings,
    getActiveComplaints
  } = useReceptionData();

  const [selectedTimeframe, setSelectedTimeframe] = useState<'today' | 'week' | 'month'>('today');
  const [realTimeData, setRealTimeData] = useState({
    currentQueue: 0,
    averageWaitTime: 0,
    completedToday: 0,
    customerSatisfaction: 0
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Real-time data simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData({
        currentQueue: getWorkOrdersByStatus('منتظر').length + getWorkOrdersByStatus('قيد التنفيذ').length,
        averageWaitTime: Math.floor(Math.random() * 20) + 5,
        completedToday: getWorkOrdersByStatus('مكتمل').length + Math.floor(Math.random() * 5),
        customerSatisfaction: 4.2 + Math.random() * 0.6
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [getWorkOrdersByStatus]);

  const todayBookings = getTodayBookings();
  const activeComplaints = getActiveComplaints();
  const waitingOrders = getWorkOrdersByStatus('منتظر');
  const inProgressOrders = getWorkOrdersByStatus('قيد التنفيذ');
  const completedOrders = getWorkOrdersByStatus('مكتمل');

  // Statistics calculations
  const stats = {
    totalCustomers: customers.length,
    todayBookings: todayBookings.length,
    activeOrders: waitingOrders.length + inProgressOrders.length,
    completedOrders: completedOrders.length,
    pendingComplaints: activeComplaints.length,
    averageRating: customers.reduce((sum, c) => sum + c.rating, 0) / customers.length || 0,
    vipCustomers: customers.filter(c => c.membershipType === 'VIP').length,
    newCustomersToday: customers.filter(c => 
      new Date(c.lastVisit).toDateString() === new Date().toDateString()
    ).length
  };

  const handleAIRecommendation = (recommendation: any) => {
    toast({
      title: "توصية من الذكاء الاصطناعي",
      description: "تم تحليل البيانات وإرسال التوصيات",
    });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
    toast({
      title: "تم تحديث البيانات",
      description: "تم تحديث جميع البيانات بنجاح",
    });
  };

  const kpiCards = [
    {
      title: "العملاء النشطين",
      value: realTimeData.currentQueue,
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
      borderColor: "border-blue-200",
      glowColor: "shadow-blue-500/20",
      description: "في الطابور حالياً"
    },
    {
      title: "متوسط وقت الانتظار",
      value: `${realTimeData.averageWaitTime} دقيقة`,
      change: "-8%",
      trend: "down",
      icon: Clock,
      color: "text-green-500",
      bgColor: "bg-gradient-to-br from-green-50 to-green-100",
      borderColor: "border-green-200",
      glowColor: "shadow-green-500/20",
      description: "انخفاض عن الأمس"
    },
    {
      title: "الطلبات المكتملة",
      value: realTimeData.completedToday,
      change: "+15%",
      trend: "up",
      icon: CheckCircle,
      color: "text-emerald-500",
      bgColor: "bg-gradient-to-br from-emerald-50 to-emerald-100",
      borderColor: "border-emerald-200",
      glowColor: "shadow-emerald-500/20",
      description: "مكتمل اليوم"
    },
    {
      title: "تقييم الخدمة",
      value: realTimeData.customerSatisfaction.toFixed(1),
      change: "+5%",
      trend: "up",
      icon: Star,
      color: "text-yellow-500",
      bgColor: "bg-gradient-to-br from-yellow-50 to-yellow-100",
      borderColor: "border-yellow-200",
      glowColor: "shadow-yellow-500/20",
      description: "من 5.0"
    }
  ];

  const quickActions = [
    {
      title: "عميل جديد",
      description: "تسجيل عميل جديد",
      icon: UserPlus,
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
      hoverColor: "hover:from-blue-600 hover:to-blue-700",
      action: () => {
        navigate('/crm/customer-management');
        toast({ 
          title: "تم التوجه لإدارة العملاء",
          description: "يمكنك الآن إضافة عميل جديد"
        });
      }
    },
    {
      title: "حجز سريع",
      description: "إنشاء حجز جديد",
      icon: Calendar,
      color: "bg-gradient-to-r from-green-500 to-green-600",
      hoverColor: "hover:from-green-600 hover:to-green-700",
      action: () => {
        navigate('/reception/create-booking');
        toast({ 
          title: "تم التوجه لإنشاء حجز",
          description: "يمكنك الآن إنشاء حجز جديد"
        });
      }
    },
    {
      title: "أمر عمل",
      description: "إنشاء أمر عمل جديد",
      icon: ClipboardList,
      color: "bg-gradient-to-r from-purple-500 to-purple-600",
      hoverColor: "hover:from-purple-600 hover:to-purple-700",
      action: () => {
        navigate('/reception/operations-management/work-orders');
        toast({ 
          title: "تم التوجه لأوامر العمل",
          description: "يمكنك الآن إنشاء أمر عمل جديد"
        });
      }
    },
    {
      title: "مركز التحكم المباشر",
      description: "إدارة العمليات النشطة",
      icon: Activity,
      color: "bg-gradient-to-r from-red-500 to-red-600",
      hoverColor: "hover:from-red-600 hover:to-red-700",
      action: () => {
        navigate('/reception/live-control-center');
        toast({ 
          title: "تم التوجه لمركز التحكم المباشر",
          description: "يمكنك الآن إدارة العمليات النشطة"
        });
      }
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: "order_completed",
      title: "تم إتمام أمر العمل #1001",
      description: "  شامل - أحمد محمد",
      time: "منذ 5 دقائق",
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-50"
    },
    {
      id: 2,
      type: "new_booking",
      title: "حجز جديد",
      description: "فاطمة أحمد - غداً 2:00 م",
      time: "منذ 12 دقيقة",
      icon: Calendar,
      color: "text-blue-500",
      bgColor: "bg-blue-50"
    },
    {
      id: 3,
      type: "complaint",
      title: "شكوى جديدة",
      description: "وقت انتظار طويل - محمد علي",
      time: "منذ 25 دقيقة",
      icon: AlertTriangle,
      color: "text-orange-500",
      bgColor: "bg-orange-50"
    },
    {
      id: 4,
      type: "new_customer",
      title: "عميل جديد",
      description: "سارة أحمد - عضوية VIP",
      time: "منذ 45 دقيقة",
      icon: UserPlus,
      color: "text-purple-500",
      bgColor: "bg-purple-50"
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6 animate-fade-in">
      {/* Branch Selector */}
      <BranchSelector />
      {/* Header */}
      <div className="flex items-center justify-between animate-slide-in-right">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            لوحة تحكم الاستقبال
          </h1>
          <p className="text-muted-foreground text-lg">
            إدارة شاملة للاستقبال وخدمة العملاء
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="flex items-center gap-2 px-3 py-1 animate-pulse">
            <Activity className="w-4 h-4 text-green-500" />
            <span className="text-green-500 font-medium">مباشر</span>
          </Badge>
          <Button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transform transition-all duration-300 hover:scale-105 hover:shadow-lg ${
              isRefreshing ? 'animate-spin' : ''
            }`}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            تحديث البيانات
          </Button>
        </div>
      </div>

      {/* Real-time KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => (
          <Card 
            key={index} 
            className={`relative overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-xl ${kpi.glowColor} border-2 ${kpi.borderColor} ${kpi.bgColor} animate-scale-in`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
                  <div className="flex items-center gap-3">
                    <p className="text-3xl font-bold text-foreground">{kpi.value}</p>
                    <Badge 
                      variant={kpi.trend === 'up' ? 'default' : 'secondary'}
                      className={`text-xs animate-bounce ${
                        kpi.trend === 'up' 
                          ? 'bg-green-100 text-green-700 border-green-200' 
                          : 'bg-red-100 text-red-700 border-red-200'
                      }`}
                    >
                      {kpi.trend === 'up' ? 
                        <ArrowUp className="w-3 h-3 mr-1" /> : 
                        <ArrowDown className="w-3 h-3 mr-1" />
                      }
                      {kpi.change}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{kpi.description}</p>
                </div>
                <div className={`p-4 rounded-2xl ${kpi.bgColor} border-2 ${kpi.borderColor} transform transition-transform duration-300 hover:rotate-12`}>
                  <kpi.icon className={`w-8 h-8 ${kpi.color}`} />
                </div>
              </div>
              
              {/* Animated background effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content - Single Column */}
      <div className="space-y-6">
        {/* Quick Actions */}
        <Card className="overflow-hidden animate-slide-in-right" style={{ animationDelay: '200ms' }}>
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              إجراءات سريعة
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className={`h-auto p-4 flex flex-col items-center gap-3 border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${action.hoverColor} animate-scale-in`}
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={action.action}
                >
                  <div className={`p-3 rounded-xl ${action.color} text-white shadow-lg transform transition-transform duration-300 hover:rotate-6`}>
                    <action.icon className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-sm">{action.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">{action.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Statistics */}
        <Card className="animate-slide-in-right" style={{ animationDelay: '300ms' }}>
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              إحصائيات تفصيلية
            </CardTitle>
            <CardDescription>نظرة شاملة على أداء الاستقبال</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center space-y-2 p-4 rounded-lg bg-blue-50 border border-blue-200 transform transition-all duration-300 hover:scale-105">
                <div className="text-3xl font-bold text-blue-600 animate-bounce">{stats.totalCustomers}</div>
                <div className="text-sm text-muted-foreground">إجمالي العملاء</div>
              </div>
              <div className="text-center space-y-2 p-4 rounded-lg bg-green-50 border border-green-200 transform transition-all duration-300 hover:scale-105">
                <div className="text-3xl font-bold text-green-600 animate-bounce">{stats.todayBookings}</div>
                <div className="text-sm text-muted-foreground">حجوزات اليوم</div>
              </div>
              <div className="text-center space-y-2 p-4 rounded-lg bg-purple-50 border border-purple-200 transform transition-all duration-300 hover:scale-105">
                <div className="text-3xl font-bold text-purple-600 animate-bounce">{stats.vipCustomers}</div>
                <div className="text-sm text-muted-foreground">عملاء VIP</div>
              </div>
              <div className="text-center space-y-2 p-4 rounded-lg bg-orange-50 border border-orange-200 transform transition-all duration-300 hover:scale-105">
                <div className="text-3xl font-bold text-orange-600 animate-bounce">{stats.newCustomersToday}</div>
                <div className="text-sm text-muted-foreground">عملاء جدد اليوم</div>
              </div>
            </div>

            <div className="mt-8 space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">معدل إتمام الطلبات</span>
                  <span className="font-bold text-green-600">85%</span>
                </div>
                <Progress value={85} className="h-3 bg-gray-200">
                  <div className="bg-gradient-to-r from-green-400 to-green-600 h-full rounded-full transition-all duration-1000 ease-out"></div>
                </Progress>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">رضا العملاء</span>
                  <span className="font-bold text-blue-600">{(stats.averageRating * 20).toFixed(0)}%</span>
                </div>
                <Progress value={stats.averageRating * 20} className="h-3 bg-gray-200">
                  <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-full rounded-full transition-all duration-1000 ease-out"></div>
                </Progress>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">كفاءة الموظفين</span>
                  <span className="font-bold text-purple-600">92%</span>
                </div>
                <Progress value={92} className="h-3 bg-gray-200">
                  <div className="bg-gradient-to-r from-purple-400 to-purple-600 h-full rounded-full transition-all duration-1000 ease-out"></div>
                </Progress>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="animate-slide-in-right" style={{ animationDelay: '400ms' }}>
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-500" />
              الأنشطة الأخيرة
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div 
                  key={activity.id} 
                  className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300 group animate-slide-in-right"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`p-3 rounded-full ${activity.bgColor} border border-gray-200 transform transition-all duration-300 group-hover:scale-110`}>
                    <activity.icon className={`w-5 h-5 ${activity.color}`} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h4 className="font-semibold text-sm group-hover:text-blue-600 transition-colors duration-300">
                      {activity.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground font-medium">
                      {activity.time}
                    </p>
                  </div>
                  <Eye className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}