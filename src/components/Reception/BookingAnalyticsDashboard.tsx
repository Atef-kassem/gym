import { useState, useMemo } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Clock, 
  Users, 
  DollarSign,
  Star,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Timer,
  Building2,
  Target,
  Zap
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdvancedBookingSystem } from "@/hooks/useAdvancedBookingSystem";

export function BookingAnalyticsDashboard() {
  const { bookings, getBookingAnalytics } = useAdvancedBookingSystem();
  const [timeRange, setTimeRange] = useState("week");
  const [selectedBranch, setSelectedBranch] = useState("all");

  const analytics = useMemo(() => {
    const filters = selectedBranch !== "all" ? { branches: [selectedBranch] } : undefined;
    return getBookingAnalytics(filters);
  }, [getBookingAnalytics, selectedBranch]);

  const branches = [
    { id: "all", name: "جميع الفروع" },
    { id: "BR001", name: "فرع العليا" },
    { id: "BR002", name: "فرع الشفا" },
    { id: "BR003", name: "فرع القصيم" }
  ];

  // تحليل الحالات
  const statusAnalysis = useMemo(() => {
    const statusCounts = bookings.reduce((acc, booking) => {
      acc[booking.status] = (acc[booking.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { status: "confirmed", count: statusCounts.confirmed || 0, label: "مؤكدة", color: "bg-green-500" },
      { status: "pending", count: statusCounts.pending || 0, label: "قيد الانتظار", color: "bg-yellow-500" },
      { status: "completed", count: statusCounts.completed || 0, label: "مكتملة", color: "bg-blue-500" },
      { status: "cancelled", count: statusCounts.cancelled || 0, label: "ملغية", color: "bg-red-500" },
      { status: "no-show", count: statusCounts["no-show"] || 0, label: "لم يحضر", color: "bg-orange-500" }
    ];
  }, [bookings]);

  // تحليل الخدمات الأكثر طلباً
  const popularServices = useMemo(() => {
    const serviceCounts: Record<string, number> = {};
    
    bookings.forEach(booking => {
      booking.services.forEach(service => {
        serviceCounts[service.name] = (serviceCounts[service.name] || 0) + 1;
      });
    });

    return Object.entries(serviceCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [bookings]);

  // تحليل الأوقات المزدحمة
  const peakHoursAnalysis = useMemo(() => {
    const hourCounts: Record<string, number> = {};
    
    bookings.forEach(booking => {
      const hour = booking.time.split(':')[0];
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });

    return Object.entries(hourCounts)
      .map(([hour, count]) => ({ hour: `${hour}:00`, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [bookings]);

  // مؤشرات الأداء الرئيسية
  const kpis = [
    {
      title: "معدل التأكيد",
      value: `${((analytics.confirmedBookings / analytics.totalBookings) * 100).toFixed(1)}%`,
      trend: "+5.2%",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "معدل الإلغاء",
      value: `${((analytics.cancelledBookings / analytics.totalBookings) * 100).toFixed(1)}%`,
      trend: "-2.1%",
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-100"
    },
    {
      title: "معدل عدم الحضور",
      value: `${((analytics.noShowBookings / analytics.totalBookings) * 100).toFixed(1)}%`,
      trend: "-1.8%",
      icon: AlertTriangle,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      title: "استغلال الطاقة",
      value: `${analytics.capacityUtilization}%`,
      trend: "+3.4%",
      icon: Target,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            تحليلات البيع
          </h2>
          <p className="text-muted-foreground">
            رؤى شاملة حول أداء نظام البيع
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedBranch} onValueChange={setSelectedBranch}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {branches.map((branch) => (
                <SelectItem key={branch.id} value={branch.id}>
                  {branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">اليوم</SelectItem>
              <SelectItem value="week">الأسبوع</SelectItem>
              <SelectItem value="month">الشهر</SelectItem>
              <SelectItem value="quarter">ربع سنة</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
                    <p className="text-2xl font-bold">{kpi.value}</p>
                    <p className={`text-xs ${kpi.color} flex items-center gap-1 mt-1`}>
                      <TrendingUp className="h-3 w-3" />
                      {kpi.trend}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${kpi.bgColor}`}>
                    <Icon className={`h-6 w-6 ${kpi.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="status">تحليل الحالات</TabsTrigger>
          <TabsTrigger value="services">الخدمات</TabsTrigger>
          <TabsTrigger value="performance">الأداء</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* إجمالي البيع */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  إجمالي البيع
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{analytics.totalBookings}</div>
                <p className="text-sm text-muted-foreground">حجز في الفترة المحددة</p>
              </CardContent>
            </Card>

            {/* إجمالي الإيرادات */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  إجمالي الإيرادات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {analytics.totalRevenue.toLocaleString()} جنيه مصري
                </div>
                <p className="text-sm text-muted-foreground">
                  متوسط القيمة: {Math.round(analytics.averageBookingValue)} جنيه مصري
                </p>
              </CardContent>
            </Card>

            {/* رضا العملاء */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  رضا العملاء
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600">
                  {analytics.customerSatisfactionScore.toFixed(1)}/5
                </div>
                <div className="flex mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= analytics.customerSatisfactionScore
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* الأوقات المزدحمة */}
          <Card>
            <CardHeader>
              <CardTitle>الأوقات الأكثر ازدحاماً</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {peakHoursAnalysis.map((peak, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{peak.hour}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${(peak.count / Math.max(...peakHoursAnalysis.map(p => p.count))) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8">{peak.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* توزيع الحالات */}
            <Card>
              <CardHeader>
                <CardTitle>توزيع حالات البيع</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {statusAnalysis.map((status, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{status.label}</span>
                        <span className="text-sm text-muted-foreground">
                          {status.count} ({((status.count / analytics.totalBookings) * 100).toFixed(1)}%)
                        </span>
                      </div>
                      <Progress 
                        value={(status.count / analytics.totalBookings) * 100} 
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* الحالات الحرجة */}
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">تنبيهات وحالات حرجة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg border-red-200 bg-red-50">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium">حجوزات لم يحضر العملاء</span>
                    </div>
                    <Badge variant="destructive">{analytics.noShowBookings}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg border-orange-200 bg-orange-50">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-orange-600" />
                      <span className="text-sm font-medium">حجوزات ملغية</span>
                    </div>
                    <Badge variant="secondary">{analytics.cancelledBookings}</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg border-yellow-200 bg-yellow-50">
                    <div className="flex items-center gap-2">
                      <Timer className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium">في انتظار التأكيد</span>
                    </div>
                    <Badge variant="outline">
                      {statusAnalysis.find(s => s.status === "pending")?.count || 0}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>الخدمات الأكثر طلباً</CardTitle>
              <CardDescription>تحليل الخدمات الأكثر شيوعاً بين العملاء</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {popularServices.map((service, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Zap className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium">{service.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${(service.count / Math.max(...popularServices.map(s => s.count))) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8">{service.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">متوسط وقت الانتظار</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {analytics.averageWaitTime} دقيقة
                </div>
                <p className="text-sm text-muted-foreground">تحسن بنسبة 12% عن الشهر الماضي</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">متوسط وقت الخدمة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  {analytics.averageServiceTime} دقيقة
                </div>
                <p className="text-sm text-muted-foreground">ضمن المعدل المطلوب</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">معدل العملاء المتكررين</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {analytics.repeatCustomerRate}%
                </div>
                <p className="text-sm text-muted-foreground">زيادة 8% عن الربع الماضي</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}