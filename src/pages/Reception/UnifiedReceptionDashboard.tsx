import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  RefreshCw,
  ShoppingCart,
  DollarSign,
  User,
  MapPin,
  Search,
  Plus,
  Settings,
  AlertCircle,
  XCircle,
  Edit,
  Trash2,
  Filter,
  Download,
  Award
} from 'lucide-react';
import { useReceptionData } from '@/hooks/useReceptionData';
import { useBookingSystem } from '@/hooks/useBookingSystem';
import { useCustomerStore } from '@/hooks/useCustomerStore';
import { ReceptionBookingIntegration } from '@/components/Reception/ReceptionBookingIntegration';
import { toast } from '@/hooks/use-toast';
import { BranchSelector } from '@/components/BranchSelector';

export default function UnifiedReceptionDashboard() {
  const navigate = useNavigate();
  
  // Reception data
  const {
    customers: receptionCustomers,
    workOrders,
    bookings: receptionBookings,
    complaints,
    getWorkOrdersByStatus,
    getTodayBookings,
    getActiveComplaints
  } = useReceptionData();

  // POS data
  const { bookings: posBookings, addBooking, updateBooking } = useBookingSystem();
  const { customers: posCustomers, addCustomer } = useCustomerStore();

  const [selectedTimeframe, setSelectedTimeframe] = useState<'today' | 'week' | 'month'>('today');
  const [realTimeData, setRealTimeData] = useState({
    currentQueue: 0,
    averageWaitTime: 0,
    completedToday: 0,
    customerSatisfaction: 0
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // POS state
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<any>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);

  // Combine customers from both sources (remove duplicates)
  const allCustomers = [
    ...receptionCustomers,
    ...posCustomers.filter(pc => !receptionCustomers.find(rc => rc.id === pc.id))
  ];

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

  // Unified statistics
  const unifiedStats = {
    totalCustomers: allCustomers.length,
    todayBookings: todayBookings.length,
    activeOrders: waitingOrders.length + inProgressOrders.length,
    completedOrders: completedOrders.length,
    pendingComplaints: activeComplaints.length,
    averageRating: allCustomers.reduce((sum, c) => sum + ((c as any).rating || 0), 0) / allCustomers.length || 0,
    vipCustomers: allCustomers.filter(c => (c as any).membershipType === 'VIP').length,
    newCustomersToday: allCustomers.filter(c => 
      new Date(c.lastVisit).toDateString() === new Date().toDateString()
    ).length,
    totalRevenue: 8450,
    averageServiceTime: 35,
    customerSatisfaction: 4.8,
    completedServices: completedOrders.length + 15,
    pendingBookings: waitingOrders.length + 5
  };

  // Services data
  const services = [
    { id: "S001", name: "  خارجي", price: 50, duration: 20, category: " " },
    { id: "S002", name: "  داخلي", price: 60, duration: 25, category: " " },
    { id: "S003", name: "  شامل", price: 150, duration: 45, category: " " },
    { id: "S004", name: "تلميع", price: 120, duration: 40, category: "تلميع" },
    { id: "S005", name: "تعقيم", price: 80, duration: 30, category: "تعقيم" },
    { id: "S006", name: "تشحيم", price: 100, duration: 35, category: "صيانة" },
    { id: "S007", name: "تغيير زيت", price: 180, duration: 45, category: "صيانة" }
  ];

  const recentTransactions = [
    {
      id: "T001",
      customerName: "أحمد محمد",
      service: "  شامل",
      amount: 150,
      time: "10:30",
      status: "completed"
    },
    {
      id: "T002", 
      customerName: "سارة أحمد",
      service: "تلميع +  ",
      amount: 220,
      time: "11:15",
      status: "in-progress"
    },
    {
      id: "T003",
      customerName: "محمد خالد", 
      service: "  سريع",
      amount: 80,
      time: "12:00",
      status: "pending"
    }
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
    toast({
      title: "تم تحديث البيانات",
      description: "تم تحديث جميع البيانات بنجاح",
    });
  };

  const handleAddToCart = (service: any) => {
    setCartItems([...cartItems, { ...service, quantity: 1 }]);
    toast({
      title: "تم إضافة الخدمة",
      description: `تم إضافة ${service.name} إلى السلة`,
    });
  };

  const handleProcessPayment = async () => {
    setIsProcessingPayment(true);
    
    setTimeout(() => {
      setIsProcessingPayment(false);
      setCartItems([]);
      toast({
        title: "تم الدفع بنجاح",
        description: "تم معالجة المعاملة وطباعة الايصال",
      });
    }, 2000);
  };

  const totalCartAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        
        {/* Branch Selector */}
        <BranchSelector />

        {/* Enhanced Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 p-8 text-white">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="space-y-3">
              <h1 className="text-4xl font-bold animate-fade-in">
                لوحة تحكم الاستقبال المتكاملة
              </h1>
              <p className="text-blue-100 text-lg animate-fade-in">
                نظام شامل للاستقبال مع نقاط البيع وإدارة العملاء والبيع
              </p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>النظام متصل</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  <span>{unifiedStats.totalCustomers} عميل اليوم</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant="outline" className="flex items-center gap-2 px-3 py-1 animate-pulse border-white/30 text-white">
                <Activity className="w-4 h-4 text-green-400" />
                <span className="text-green-400 font-medium">مباشر</span>
              </Badge>
              <Button 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className={`bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 transform transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                  isRefreshing ? 'animate-spin' : ''
                }`}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                تحديث البيانات
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Real-time KPIs */}
          {kpiCards.map((kpi, index) => (
            <Card 
              key={index} 
              className={`relative overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-xl ${kpi.glowColor} border-2 ${kpi.borderColor} ${kpi.bgColor} animate-scale-in`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">{kpi.title}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                      <Badge 
                        variant={kpi.trend === 'up' ? 'default' : 'secondary'}
                        className={`text-xs animate-bounce ${
                          kpi.trend === 'up' 
                            ? 'bg-green-100 text-green-700 border-green-200' 
                            : 'bg-red-100 text-red-700 border-red-200'
                        }`}
                      >
                        {kpi.trend === 'up' ? 
                          <ArrowUp className="w-2 h-2 mr-1" /> : 
                          <ArrowDown className="w-2 h-2 mr-1" />
                        }
                        {kpi.change}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{kpi.description}</p>
                  </div>
                  <div className={`p-2 rounded-xl ${kpi.bgColor} border ${kpi.borderColor} transform transition-transform duration-300 hover:rotate-12`}>
                    <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Additional stats from IntegratedDesk */}
          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 hover:scale-105 transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-200 dark:bg-purple-800 rounded-full -mr-10 -mt-10 opacity-20"></div>
            <CardHeader className="pb-2 relative z-10">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-medium text-purple-700 dark:text-purple-300">إيرادات اليوم</CardTitle>
                <DollarSign className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-2xl font-bold text-purple-900 dark:text-purple-100 animate-fade-in">
                {unifiedStats.totalRevenue.toLocaleString()} جنيه مصري
              </div>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-600 font-medium">+22%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900 hover:scale-105 transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-200 dark:bg-indigo-800 rounded-full -mr-10 -mt-10 opacity-20"></div>
            <CardHeader className="pb-2 relative z-10">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-medium text-indigo-700 dark:text-indigo-300">رضا العملاء</CardTitle>
                <Star className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-2xl font-bold text-indigo-900 dark:text-indigo-100 animate-fade-in">
                {unifiedStats.customerSatisfaction}/5
              </div>
              <div className="flex items-center gap-1 mt-1">
                <Award className="h-3 w-3 text-indigo-500" />
                <span className="text-xs text-indigo-600 font-medium">ممتاز</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white dark:bg-gray-900 shadow-lg rounded-xl border-0 p-2">
            <TabsTrigger value="overview" className="text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white transition-all duration-300">
              <BarChart3 className="h-4 w-4 ml-2" />
              نظرة عامة
            </TabsTrigger>
            <TabsTrigger value="pos" className="text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-teal-500 data-[state=active]:text-white transition-all duration-300">
              <ShoppingCart className="h-4 w-4 ml-2" />
              نقطة البيع
            </TabsTrigger>
            <TabsTrigger value="bookings" className="text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white transition-all duration-300">
              <Calendar className="h-4 w-4 ml-2" />
              البيع
            </TabsTrigger>
            <TabsTrigger value="customers" className="text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white transition-all duration-300">
              <Users className="h-4 w-4 ml-2" />
              العملاء
            </TabsTrigger>
            <TabsTrigger value="transactions" className="text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white transition-all duration-300">
              <DollarSign className="h-4 w-4 ml-2" />
              المعاملات
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <Card className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    إجراءات سريعة
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-4">
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

              {/* Recent Activities */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-500" />
                    الأنشطة الحديثة
                  </CardTitle>
                  <CardDescription>آخر الأحداث والعمليات</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivities.map((activity) => (
                      <div 
                        key={activity.id} 
                        className={`flex items-start gap-3 p-3 rounded-lg ${activity.bgColor} border transition-all duration-300 hover:shadow-md animate-slide-in-right`}
                      >
                        <div className={`p-2 rounded-full bg-white shadow-sm`}>
                          <activity.icon className={`w-4 h-4 ${activity.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm">{activity.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1">{activity.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Statistics */}
            <Card>
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
                    <div className="text-3xl font-bold text-blue-600 animate-bounce">{unifiedStats.totalCustomers}</div>
                    <div className="text-sm text-muted-foreground">إجمالي العملاء</div>
                  </div>
                  <div className="text-center space-y-2 p-4 rounded-lg bg-green-50 border border-green-200 transform transition-all duration-300 hover:scale-105">
                    <div className="text-3xl font-bold text-green-600 animate-bounce">{unifiedStats.todayBookings}</div>
                    <div className="text-sm text-muted-foreground">حجوزات اليوم</div>
                  </div>
                  <div className="text-center space-y-2 p-4 rounded-lg bg-purple-50 border border-purple-200 transform transition-all duration-300 hover:scale-105">
                    <div className="text-3xl font-bold text-purple-600 animate-bounce">{unifiedStats.vipCustomers}</div>
                    <div className="text-sm text-muted-foreground">عملاء VIP</div>
                  </div>
                  <div className="text-center space-y-2 p-4 rounded-lg bg-orange-50 border border-orange-200 transform transition-all duration-300 hover:scale-105">
                    <div className="text-3xl font-bold text-orange-600 animate-bounce">{unifiedStats.newCustomersToday}</div>
                    <div className="text-sm text-muted-foreground">عملاء جدد اليوم</div>
                  </div>
                </div>

                <div className="mt-8 space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">معدل إتمام الطلبات</span>
                      <span className="font-bold text-green-600">85%</span>
                    </div>
                    <Progress value={85} className="h-3" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">رضا العملاء</span>
                      <span className="font-bold text-blue-600">{(unifiedStats.averageRating * 20).toFixed(0)}%</span>
                    </div>
                    <Progress value={unifiedStats.averageRating * 20} className="h-3" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">كفاءة الموظفين</span>
                      <span className="font-bold text-purple-600">92%</span>
                    </div>
                    <Progress value={92} className="h-3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* POS Tab */}
          <TabsContent value="pos" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Services Selection */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5 text-green-500" />
                      قائمة الخدمات
                    </CardTitle>
                    <CardDescription>اختر الخدمات المطلوبة</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {services.map((service) => (
                        <Card key={service.id} className="hover:shadow-lg transition-all duration-300 hover:scale-105">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h3 className="font-semibold">{service.name}</h3>
                                <Badge variant="outline" className="text-xs mt-1">
                                  {service.category}
                                </Badge>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold text-green-600">{service.price} جنيه مصري</div>
                                <div className="text-xs text-muted-foreground">{service.duration} دقيقة</div>
                              </div>
                            </div>
                            <Button 
                              onClick={() => handleAddToCart(service)}
                              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                              size="sm"
                            >
                              <Plus className="w-4 h-4 ml-2" />
                              إضافة للسلة
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Cart and Customer */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-500" />
                      العميل الحالي
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Input 
                        placeholder="ابحث عن عميل..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <Button size="sm" variant="outline">
                        <Search className="w-4 h-4" />
                      </Button>
                    </div>
                    {currentCustomer && (
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="font-semibold">{currentCustomer.name}</h4>
                        <p className="text-sm text-muted-foreground">{currentCustomer.phone}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5 text-green-500" />
                        السلة
                      </div>
                      <Badge variant="outline">{cartItems.length} عنصر</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {cartItems.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        السلة فارغة
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {cartItems.map((item, index) => (
                          <div key={index} className="flex justify-between items-center p-2 border rounded">
                            <div>
                              <div className="font-medium text-sm">{item.name}</div>
                              <div className="text-xs text-muted-foreground">x{item.quantity}</div>
                            </div>
                            <div className="font-bold text-green-600">
                              {(item.price * item.quantity).toLocaleString()} جنيه مصري
                            </div>
                          </div>
                        ))}
                        <div className="border-t pt-3 mt-3">
                          <div className="flex justify-between items-center text-lg font-bold">
                            <span>المجموع:</span>
                            <span className="text-green-600">{totalCartAmount.toLocaleString()} جنيه مصري</span>
                          </div>
                        </div>
                        <Button 
                          onClick={handleProcessPayment}
                          disabled={isProcessingPayment}
                          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                        >
                          {isProcessingPayment ? (
                            <RefreshCw className="w-4 h-4 ml-2 animate-spin" />
                          ) : (
                            <DollarSign className="w-4 h-4 ml-2" />
                          )}
                          {isProcessingPayment ? 'جاري المعالجة...' : 'معالجة الدفع'}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6 animate-fade-in">
            <ReceptionBookingIntegration />
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers" className="space-y-6 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  إدارة العملاء
                </CardTitle>
                <CardDescription>قائمة جميع العملاء المسجلين</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allCustomers.slice(0, 6).map((customer, index) => (
                    <Card key={customer.id} className="hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                            {customer.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-semibold">{customer.name}</h3>
                            <p className="text-sm text-muted-foreground">{customer.phone}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">عضوية:</span>
                            <Badge variant={(customer as any).membershipType === 'VIP' ? 'default' : 'outline'}>
                              {(customer as any).membershipType || 'عادي'}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">التقييم:</span>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-500 fill-current" />
                              <span className="text-sm font-medium">{(customer as any).rating || 0}</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full mt-3">
                          <Eye className="w-4 h-4 ml-2" />
                          عرض التفاصيل
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-500" />
                  المعاملات المالية
                </CardTitle>
                <CardDescription>سجل جميع المعاملات المالية</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTransactions.map((transaction) => (
                    <Card key={transaction.id} className="hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              transaction.status === 'completed' ? 'bg-green-100 text-green-600' :
                              transaction.status === 'in-progress' ? 'bg-yellow-100 text-yellow-600' :
                              'bg-blue-100 text-blue-600'
                            }`}>
                              {transaction.status === 'completed' ? <CheckCircle className="w-5 h-5" /> :
                               transaction.status === 'in-progress' ? <Clock className="w-5 h-5" /> :
                               <AlertCircle className="w-5 h-5" />}
                            </div>
                            <div>
                              <h3 className="font-semibold">{transaction.customerName}</h3>
                              <p className="text-sm text-muted-foreground">{transaction.service}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-600">{transaction.amount} جنيه مصري</div>
                            <div className="text-sm text-muted-foreground">{transaction.time}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}