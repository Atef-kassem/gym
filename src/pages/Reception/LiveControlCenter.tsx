import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings,
  Activity,
  Bell,
  Eye,
  Target,
  Zap,
  CheckCircle2,
  Users,
  Clock,
  Car,
  AlertTriangle,
  Calendar,
  ClipboardList,
  ArrowLeft,
  Monitor,
  Command,
  Sparkles,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ReceptionBookingIntegration } from '@/components/Reception/ReceptionBookingIntegration';
import { InteractiveControlPanel } from '@/components/Reception/InteractiveControlPanel';
import { useReceptionData } from '@/hooks/useReceptionData';

export default function LiveControlCenter() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    workOrders,
    bookings,
    complaints,
    getWorkOrdersByStatus,
    getTodayBookings,
    getActiveComplaints
  } = useReceptionData();

  const [activeTab, setActiveTab] = useState("operations");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [realTimeData, setRealTimeData] = useState({
    activeOrders: 0,
    waitingQueue: 0,
    completedToday: 0,
    alerts: 0
  });

  // Real-time data simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData({
        activeOrders: getWorkOrdersByStatus('قيد التنفيذ').length,
        waitingQueue: getWorkOrdersByStatus('منتظر').length,
        completedToday: getWorkOrdersByStatus('مكتمل').length,
        alerts: getActiveComplaints().length
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [getWorkOrdersByStatus, getActiveComplaints]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
    toast({
      title: "تم تحديث البيانات",
      description: "تم تحديث جميع بيانات مركز التحكم",
    });
  };

  const controlMetrics = [
    {
      title: "العمليات النشطة",
      value: realTimeData.activeOrders,
      icon: Activity,
      color: "text-blue-500",
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
      borderColor: "border-blue-200",
      description: "قيد التنفيذ حالياً"
    },
    {
      title: "قائمة الانتظار",
      value: realTimeData.waitingQueue,
      icon: Clock,
      color: "text-orange-500",
      bgColor: "bg-gradient-to-br from-orange-50 to-orange-100",
      borderColor: "border-orange-200",
      description: "في انتظار المعالجة"
    },
    {
      title: "مكتمل اليوم",
      value: realTimeData.completedToday,
      icon: CheckCircle2,
      color: "text-green-500",
      bgColor: "bg-gradient-to-br from-green-50 to-green-100",
      borderColor: "border-green-200",
      description: "تم إنجازها اليوم"
    },
    {
      title: "التنبيهات",
      value: realTimeData.alerts,
      icon: AlertTriangle,
      color: "text-red-500",
      bgColor: "bg-gradient-to-br from-red-50 to-red-100",
      borderColor: "border-red-200",
      description: "تحتاج متابعة"
    }
  ];

  const quickControlActions = [
    {
      title: "تشغيل عملية جديدة",
      description: "بدء عملية عمل جديدة",
      icon: Zap,
      color: "bg-gradient-to-r from-green-500 to-green-600",
      action: () => {
        navigate('/reception/operations-management/work-orders');
        toast({ 
          title: "تم التوجه لأوامر العمل",
          description: "يمكنك الآن بدء عملية جديدة"
        });
      }
    },
    {
      title: "مراقبة العمليات",
      description: "متابعة العمليات الجارية",
      icon: Monitor,
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
      action: () => {
        navigate('/reception/operations-management/work-orders');
        toast({ 
          title: "تم التوجه لمراقبة العمليات",
          description: "يمكنك الآن متابعة جميع العمليات"
        });
      }
    },
    {
      title: "إدارة الطوارئ",
      description: "التعامل مع الحالات العاجلة",
      icon: Bell,
      color: "bg-gradient-to-r from-red-500 to-red-600",
      action: () => {
        navigate('/reception/customer-service');
        toast({ 
          title: "تم التوجه لإدارة الطوارئ",
          description: "يمكنك الآن التعامل مع الحالات العاجلة"
        });
      }
    },
    {
      title: "تحليلات متقدمة",
      description: "عرض تحليلات الأداء",
      icon: Target,
      color: "bg-gradient-to-r from-purple-500 to-purple-600",
      action: () => {
        navigate('/reception/booking-analytics');
        toast({ 
          title: "تم التوجه للتحليلات",
          description: "يمكنك الآن عرض تحليلات الأداء"
        });
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="p-6 rounded-xl border shadow-lg bg-gradient-to-r from-primary/5 to-primary/10 animate-fade-in">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => navigate('/reception/dashboard')}
                className="hover:bg-primary/10 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                العودة للوحة التحكم
              </Button>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-full">
                  <Command className="h-6 w-6 text-primary" />
                  <Sparkles className="h-5 w-5 text-primary/70" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    مركز التحكم المباشر
                  </h1>
                  <p className="text-muted-foreground mt-2 text-lg">
                    إدارة احترافية للحجوزات والعمليات النشطة
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="flex items-center gap-2 px-3 py-1 animate-pulse">
                <Activity className="w-4 h-4 text-green-500" />
                <span className="text-green-500 font-medium">مباشر</span>
              </Badge>
              <Button 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="bg-gradient-to-r from-primary/80 to-primary hover:from-primary hover:to-primary/80"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                تحديث
              </Button>
            </div>
          </div>
        </div>

        {/* Control Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {controlMetrics.map((metric, index) => (
            <Card 
              key={index} 
              className={`relative overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-xl border-2 ${metric.borderColor} ${metric.bgColor} animate-scale-in`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                    <div className="text-4xl font-bold text-foreground animate-pulse">
                      {metric.value}
                    </div>
                    <p className="text-xs text-muted-foreground">{metric.description}</p>
                  </div>
                  <div className={`p-4 rounded-2xl ${metric.bgColor} border-2 ${metric.borderColor}`}>
                    <metric.icon className={`w-8 h-8 ${metric.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Control Actions */}
        <Card className="animate-slide-in-right">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
            <CardTitle className="flex items-center gap-2">
              <Command className="w-5 w-5 text-primary" />
              أوامر التحكم السريع
            </CardTitle>
            <CardDescription>عمليات سريعة لإدارة النشاطات الجارية</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickControlActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-3 border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg animate-scale-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={action.action}
                >
                  <div className={`p-3 rounded-xl ${action.color} text-white shadow-lg`}>
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

        {/* Main Control Tabs */}
        <Card className="animate-slide-in-right" style={{ animationDelay: '200ms' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="w-5 h-5 text-primary" />
              وحدات التحكم المتقدمة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="operations" className="flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  العمليات المباشرة
                </TabsTrigger>
                <TabsTrigger value="control-panel" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  لوحة التحكم التفاعلية
                </TabsTrigger>
              </TabsList>

              <TabsContent value="operations" className="space-y-6">
                <ReceptionBookingIntegration />
              </TabsContent>

              <TabsContent value="control-panel" className="space-y-6">
                <InteractiveControlPanel />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}