import { useMemo, useState } from "react";
import { BranchSelector } from "@/components/BranchSelector";
import { useAdvancedBookingSystem } from "@/hooks/useAdvancedBookingSystem";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Users, 
  Clock, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Star,
  DollarSign,
  UserCheck,
  Activity,
  Brain,
  BarChart3,
  Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AIManagementEngine } from "@/components/Reception/AIManagementEngine";
import { BookingAnalyticsDashboard } from "@/components/Reception/BookingAnalyticsDashboard";
import { SmartNotificationCenter } from "@/components/Reception/SmartNotificationCenter";
import { InteractiveControlPanel } from "@/components/Reception/InteractiveControlPanel";
import { AdvancedSettingsDialog } from "@/components/Reception/AdvancedSettingsDialog";
import { CurrentShiftIndicator } from "@/components/Shifts/CurrentShiftIndicator";

export default function BookingDashboard() {
  const { bookings, getBookingAnalytics } = useAdvancedBookingSystem();
  const { toast } = useToast();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const analytics = useMemo(() => getBookingAnalytics(), [bookings]);

  const kpis = [
    {
      title: "إجمالي البيع",
      value: analytics.totalBookings,
      change: "+12%",
      icon: Calendar,
      color: "text-blue-500",
      description: "هذا الشهر"
    },
    {
      title: "البيع المؤكدة",
      value: analytics.confirmedBookings,
      change: "+8%", 
      icon: CheckCircle2,
      color: "text-green-500",
      description: "نسبة التأكيد 85%"
    },
    {
      title: "الإيرادات المتوقعة",
      value: `${analytics.totalRevenue.toLocaleString()} جنيه مصري`,
      change: "+15%",
      icon: DollarSign,
      color: "text-emerald-500",
      description: "الشهر الحالي"
    },
    {
      title: "رضا العملاء",
      value: "4.5/5",
      change: "+0.2",
      icon: Star,
      color: "text-yellow-500", 
      description: "متوسط التقييم"
    }
  ];

  const statusAnalysis = [
    { status: "confirmed", count: analytics.confirmedBookings, color: "bg-green-500", label: "مؤكدة" },
    { status: "pending", count: bookings.filter(b => b.status === 'pending').length, color: "bg-yellow-500", label: "في الانتظار" },
    { status: "completed", count: analytics.completedBookings, color: "bg-blue-500", label: "مكتملة" },
    { status: "cancelled", count: analytics.cancelledBookings, color: "bg-red-500", label: "ملغية" },
    { status: "no-show", count: bookings.filter(b => b.status === 'no-show').length, color: "bg-gray-500", label: "لم يحضر" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Branch Selector */}
        <BranchSelector />
        
        {/* مؤشر الوردية الحالية */}
        <CurrentShiftIndicator />
        
        {/* Header */}
        <div className="p-6 rounded-xl border shadow-lg bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">لوحة تحكم البيع</h1>
                <p className="text-muted-foreground mt-2">
                  نظرة عامة شاملة على إحصائيات وأداء نظام البيع
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  toast({
                    title: "تم تحديث البيانات",
                    description: "تم تحديث بيانات لوحة التحكم بنجاح"
                  });
                }}
                className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <Activity className="h-4 w-4 mr-2" />
                تحديث البيانات
              </Button>
              <Button 
                variant="default" 
                size="sm"
                onClick={() => setSettingsOpen(true)}
                className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <Settings className="h-4 w-4 mr-2" />
                الإعدادات
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced KPIs Grid with Advanced Visual Effects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi, index) => (
            <Card 
              key={index} 
              className="group relative border-0 shadow-elegant hover:shadow-glow hover:-translate-y-3 transition-all duration-500 cursor-pointer bg-card overflow-hidden animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Animated Background Effects */}
              <div className={`absolute inset-0 ${kpi.color.includes('blue') ? 'bg-blue-50 dark:bg-blue-950/20' : 
                kpi.color.includes('green') ? 'bg-green-50 dark:bg-green-950/20' : 
                kpi.color.includes('emerald') ? 'bg-emerald-50 dark:bg-emerald-950/20' : 'bg-yellow-50 dark:bg-yellow-950/20'} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>
              <div className={`absolute -inset-1 bg-gradient-to-br ${kpi.color.replace('text-', 'from-')} to-transparent rounded-lg opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-500`}></div>
              
              {/* Floating Particles */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                <div className="absolute top-4 right-4 w-2 h-2 bg-primary/40 rounded-full animate-ping"></div>
                <div className="absolute bottom-6 left-6 w-1 h-1 bg-secondary/60 rounded-full animate-pulse"></div>
                <div className="absolute top-1/2 left-4 w-1.5 h-1.5 bg-accent/50 rounded-full animate-bounce"></div>
              </div>
              
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2 z-10">
                <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors duration-300">{kpi.title}</CardTitle>
                <div className="relative">
                  <div className={`p-2 rounded-lg ${kpi.color.includes('blue') ? 'bg-blue-100 dark:bg-blue-950/20' : 
                    kpi.color.includes('green') ? 'bg-green-100 dark:bg-green-950/20' : 
                    kpi.color.includes('emerald') ? 'bg-emerald-100 dark:bg-emerald-950/20' : 'bg-yellow-100 dark:bg-yellow-950/20'} group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-md group-hover:shadow-glow`}>
                    <kpi.icon className={`h-5 w-5 ${kpi.color} group-hover:animate-pulse transition-colors duration-300`} />
                  </div>
                  {/* Rotating Ring */}
                  <div className={`absolute inset-0 rounded-lg border-2 ${kpi.color.replace('text-', 'border-')} opacity-0 group-hover:opacity-100 group-hover:animate-spin transition-opacity duration-500`}></div>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-2xl font-bold group-hover:scale-110 group-hover:text-primary transition-all duration-300">{kpi.value}</div>
                <p className="text-xs text-muted-foreground group-hover:text-primary/70 transition-colors duration-300">
                  <span className="text-green-500">{kpi.change}</span> {kpi.description}
                </p>
              </CardContent>
              
              {/* Progress Bar Animation */}
              <div className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${kpi.color.replace('text-', 'from-')} to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          {/* Enhanced TabsList with Advanced Visual Effects */}
          <TabsList className="grid w-full grid-cols-8 bg-gradient-to-r from-background/80 via-muted/60 to-background/80 backdrop-blur-md shadow-elegant border border-border/40 rounded-2xl p-2 gap-1 overflow-hidden">
            <TabsTrigger 
              value="overview" 
              className="group relative flex items-center gap-1 text-xs px-2 py-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-glow transition-all duration-500 hover:scale-105 data-[state=active]:scale-105 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 group-data-[state=active]:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-data-[state=active]:translate-x-full transition-transform duration-1000"></div>
              <div className="absolute top-1 right-1 w-1 h-1 bg-blue-400/60 rounded-full opacity-0 group-data-[state=active]:opacity-100 group-data-[state=active]:animate-ping"></div>
              <Activity className="h-4 w-4 relative z-10 group-data-[state=active]:animate-pulse" />
              <span className="relative z-10 text-xs">نظرة عامة</span>
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 scale-x-0 group-data-[state=active]:scale-x-100 transition-transform duration-500 origin-center"></div>
            </TabsTrigger>
            <TabsTrigger 
              value="status" 
              className="group relative flex items-center gap-1 text-xs px-2 py-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-glow transition-all duration-500 hover:scale-105 data-[state=active]:scale-105 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 group-data-[state=active]:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-data-[state=active]:translate-x-full transition-transform duration-1000"></div>
              <div className="absolute top-1 right-1 w-1 h-1 bg-green-400/60 rounded-full opacity-0 group-data-[state=active]:opacity-100 group-data-[state=active]:animate-ping"></div>
              <CheckCircle2 className="h-4 w-4 relative z-10 group-data-[state=active]:animate-pulse" />
              <span className="relative z-10 text-xs">حالة البيع</span>
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 scale-x-0 group-data-[state=active]:scale-x-100 transition-transform duration-500 origin-center"></div>
            </TabsTrigger>
            <TabsTrigger 
              value="performance" 
              className="group relative flex items-center gap-1 text-xs px-2 py-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-glow transition-all duration-500 hover:scale-105 data-[state=active]:scale-105 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 group-data-[state=active]:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-data-[state=active]:translate-x-full transition-transform duration-1000"></div>
              <div className="absolute top-1 right-1 w-1 h-1 bg-purple-400/60 rounded-full opacity-0 group-data-[state=active]:opacity-100 group-data-[state=active]:animate-ping"></div>
              <TrendingUp className="h-4 w-4 relative z-10 group-data-[state=active]:animate-pulse" />
              <span className="relative z-10 text-xs">الأداء</span>
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 scale-x-0 group-data-[state=active]:scale-x-100 transition-transform duration-500 origin-center"></div>
            </TabsTrigger>
            <TabsTrigger 
              value="alerts" 
              className="group relative flex items-center gap-1 text-xs px-2 py-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-glow transition-all duration-500 hover:scale-105 data-[state=active]:scale-105 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 group-data-[state=active]:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-data-[state=active]:translate-x-full transition-transform duration-1000"></div>
              <div className="absolute top-1 right-1 w-1 h-1 bg-orange-400/60 rounded-full opacity-0 group-data-[state=active]:opacity-100 group-data-[state=active]:animate-ping"></div>
              <AlertCircle className="h-4 w-4 relative z-10 group-data-[state=active]:animate-pulse" />
              <span className="relative z-10 text-xs">التنبيهات</span>
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-orange-500 to-red-500 scale-x-0 group-data-[state=active]:scale-x-100 transition-transform duration-500 origin-center"></div>
            </TabsTrigger>
            <TabsTrigger 
              value="ai-engine" 
              className="group relative flex items-center gap-1 text-xs px-2 py-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white data-[state=active]:shadow-glow transition-all duration-500 hover:scale-105 data-[state=active]:scale-105 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-rose-500/10 opacity-0 group-hover:opacity-100 group-data-[state=active]:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-data-[state=active]:translate-x-full transition-transform duration-1000"></div>
              <div className="absolute top-1 right-1 w-1 h-1 bg-pink-400/60 rounded-full opacity-0 group-data-[state=active]:opacity-100 group-data-[state=active]:animate-ping"></div>
              <Brain className="h-4 w-4 relative z-10 group-data-[state=active]:animate-pulse" />
              <span className="relative z-10 text-xs">الذكاء الاصطناعي</span>
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-pink-500 to-rose-500 scale-x-0 group-data-[state=active]:scale-x-100 transition-transform duration-500 origin-center"></div>
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="group relative flex items-center gap-1 text-xs px-2 py-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-amber-500 data-[state=active]:text-white data-[state=active]:shadow-glow transition-all duration-500 hover:scale-105 data-[state=active]:scale-105 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 opacity-0 group-hover:opacity-100 group-data-[state=active]:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-data-[state=active]:translate-x-full transition-transform duration-1000"></div>
              <div className="absolute top-1 right-1 w-1 h-1 bg-yellow-400/60 rounded-full opacity-0 group-data-[state=active]:opacity-100 group-data-[state=active]:animate-ping"></div>
              <BarChart3 className="h-4 w-4 relative z-10 group-data-[state=active]:animate-pulse" />
              <span className="relative z-10 text-xs">تحليلات متقدمة</span>
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-yellow-500 to-amber-500 scale-x-0 group-data-[state=active]:scale-x-100 transition-transform duration-500 origin-center"></div>
            </TabsTrigger>
            <TabsTrigger 
              value="notifications" 
              className="group relative flex items-center gap-1 text-xs px-2 py-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-glow transition-all duration-500 hover:scale-105 data-[state=active]:scale-105 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 group-data-[state=active]:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-data-[state=active]:translate-x-full transition-transform duration-1000"></div>
              <div className="absolute top-1 right-1 w-1 h-1 bg-teal-400/60 rounded-full opacity-0 group-data-[state=active]:opacity-100 group-data-[state=active]:animate-ping"></div>
              <Calendar className="h-4 w-4 relative z-10 group-data-[state=active]:animate-pulse" />
              <span className="relative z-10 text-xs">الإشعارات الذكية</span>
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-teal-500 to-cyan-500 scale-x-0 group-data-[state=active]:scale-x-100 transition-transform duration-500 origin-center"></div>
            </TabsTrigger>
            <TabsTrigger 
              value="control-panel" 
              className="group relative flex items-center gap-1 text-xs px-2 py-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-500 data-[state=active]:to-gray-600 data-[state=active]:text-white data-[state=active]:shadow-glow transition-all duration-500 hover:scale-105 data-[state=active]:scale-105 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-slate-500/10 to-gray-600/10 opacity-0 group-hover:opacity-100 group-data-[state=active]:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-data-[state=active]:translate-x-full transition-transform duration-1000"></div>
              <div className="absolute top-1 right-1 w-1 h-1 bg-slate-400/60 rounded-full opacity-0 group-data-[state=active]:opacity-100 group-data-[state=active]:animate-ping"></div>
              <Settings className="h-4 w-4 relative z-10 group-data-[state=active]:animate-pulse" />
              <span className="relative z-10 text-xs">لوحة التحكم</span>
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-slate-500 to-gray-600 scale-x-0 group-data-[state=active]:scale-x-100 transition-transform duration-500 origin-center"></div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-500" />
                    البيع اليوم
                  </CardTitle>
                  <CardDescription>
                  إجمالي {bookings.filter(b => 
                    new Date(b.date).toDateString() === new Date().toDateString()
                  ).length} حجز لليوم
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>الساعات الذروة</span>
                      <Badge>10:00 - 14:00</Badge>
                    </div>
                    <div className="relative">
                      <Progress value={75} className="h-3" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      75% من الطاقة الاستيعابية مستغلة
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-500" />
                    العملاء النشطون
                  </CardTitle>
                  <CardDescription>
                    عملاء لديهم حجوزات نشطة
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-3xl font-bold">
                      {new Set(bookings.filter(b => b.status === 'confirmed').map(b => b.customerId)).size}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">عملاء جدد</span>
                      <Badge variant="secondary">+15</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">عملاء مخلصون</span>
                      <Badge variant="secondary">24</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="status" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>توزيع حالات البيع</CardTitle>
                <CardDescription>
                  تحليل مفصل لحالات جميع البيع
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {statusAnalysis.map((item) => (
                    <div key={item.status} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${item.color}`} />
                        <span>{item.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.count}</span>
                        <Badge variant="outline">
                          {analytics.totalBookings > 0 
                            ? Math.round((item.count / analytics.totalBookings) * 100)
                            : 0}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">معدل التأكيد</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold text-green-500">
                    {analytics.totalBookings > 0 
                      ? Math.round((analytics.confirmedBookings / analytics.totalBookings) * 100)
                      : 0}%
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    من إجمالي البيع
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-center">معدل الإلغاء</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold text-red-500">
                    {analytics.totalBookings > 0 
                      ? Math.round((analytics.cancelledBookings / analytics.totalBookings) * 100)
                      : 0}%
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    من إجمالي البيع
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-center">معدل عدم الحضور</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold text-orange-500">
                    {analytics.totalBookings > 0 
                      ? Math.round((analytics.noShowBookings / analytics.totalBookings) * 100)
                      : 0}%
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    من إجمالي البيع
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-600">
                    <AlertCircle className="h-5 w-5" />
                    تنبيهات مهمة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <span className="text-sm">حجوزات تحتاج تأكيد</span>
                      <Badge variant="destructive">{bookings.filter(b => b.status === 'pending').length}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <span className="text-sm">عدم حضور متكرر</span>
                      <Badge variant="destructive">{bookings.filter(b => b.status === 'no-show').length}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="h-5 w-5" />
                    إنجازات
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm">حجوزات مكتملة بنجاح</span>
                      <Badge variant="secondary">{analytics.completedBookings}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm">متوسط رضا العملاء</span>
                      <Badge variant="secondary">4.5/5</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ai-engine" className="space-y-6">
            <AIManagementEngine />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <BookingAnalyticsDashboard />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <SmartNotificationCenter />
          </TabsContent>

          <TabsContent value="control-panel" className="space-y-6">
            <InteractiveControlPanel />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* نافذة الإعدادات */}
      <AdvancedSettingsDialog 
        open={settingsOpen} 
        onOpenChange={setSettingsOpen} 
      />
    </div>
  );
}