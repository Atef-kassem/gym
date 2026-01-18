import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Smartphone, 
  Star, 
  Bell, 
  MessageSquare, 
  Download, 
  Upload,
  Users,
  BarChart3,
  Settings,
  Share2,
  Eye,
  Zap,
  Globe,
  Shield,
  TrendingUp,
  Activity,
  DollarSign,
  Calendar,
  Clock,
  Target,
  Loader2,
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Line, LineChart, Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";
import { useMobileWashData } from "@/hooks/useMobileWashData";

// Mock data for mobile app management
const appMetrics = {
  totalDownloads: 15420,
  activeUsers: 8750,
  averageRating: 4.6,
  dailyBookings: 245,
  userRetention: 78,
  appVersion: "2.1.5"
};

const userFeedback = [
  {
    id: "AF001",
    userName: "أحمد محمد",
    rating: 5,
    review: "التطبيق ممتاز ومفيد جداً، سهل الاستخدام والحجز سريع",
    date: "2024-01-25",
    platform: "iOS"
  },
  {
    id: "AF002",
    userName: "سارة علي",
    rating: 4,
    review: "التطبيق جيد لكن أتمنى إضافة المزيد من أوقات الحجز",
    date: "2024-01-24",
    platform: "Android"
  },
  {
    id: "AF003",
    userName: "محمد خالد",
    rating: 5,
    review: "خدمة رائعة وموظفين محترفين، التطبيق يسهل كل شيء",
    date: "2024-01-23",
    platform: "iOS"
  }
];

const appAnalytics = [
  { month: "نوفمبر", downloads: 1200, activeUsers: 7800, bookings: 2100 },
  { month: "ديسمبر", downloads: 1450, activeUsers: 8200, bookings: 2350 },
  { month: "يناير", downloads: 1650, activeUsers: 8750, bookings: 2600 }
];

const platformDistribution = [
  { name: "iOS", value: 60, color: "#8884d8" },
  { name: "Android", value: 40, color: "#82ca9d" }
];

const notifications = [
  {
    id: "N001",
    title: "عرض خاص",
    message: "خصم 20% على جميع الخدمات لفترة محدودة",
    audience: "جميع المستخدمين",
    sent: true,
    date: "2024-01-25"
  },
  {
    id: "N002",
    title: "تذكير بالموعد",
    message: "لديك موعد غداً في تمام الساعة 10:00 صباحاً",
    audience: "العملاء المحجوزين",
    sent: true,
    date: "2024-01-24"
  },
  {
    id: "N003",
    title: "ميزة جديدة",
    message: "تم إضافة خدمة التتبع المباشر للمركبات",
    audience: "جميع المستخدمين",
    sent: false,
    date: "2024-01-23"
  }
];

export default function MobileAppManagement() {
  const { 
    analytics, 
    loading, 
    error 
  } = useMobileWashData();
  const [selectedMetric, setSelectedMetric] = useState("overview");
  const [isNotificationDialogOpen, setIsNotificationDialogOpen] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    audience: "all"
  });
  const { toast } = useToast();

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? "text-yellow-500 fill-current" : "text-gray-300"}`}
      />
    ));
  };

  const handleSendNotification = () => {
    if (!newNotification.title || !newNotification.message) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "تم إرسال الإشعار",
      description: "تم إرسال الإشعار بنجاح إلى جميع المستخدمين",
    });

    setIsNotificationDialogOpen(false);
    setNewNotification({
      title: "",
      message: "",
      audience: "all"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Enhanced Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 p-8 text-white">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="space-y-3">
              <h1 className="text-4xl font-bold animate-fade-in">
                إدارة التطبيق المحمول
              </h1>
              <p className="text-blue-100 text-lg animate-fade-in">
                متابعة شاملة لأداء التطبيق وتفاعل المستخدمين مع التحليلات المتقدمة
              </p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>التطبيق متصل</span>
                </div>
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  <span>آخر تحديث: منذ دقيقتين</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Dialog open={isNotificationDialogOpen} onOpenChange={setIsNotificationDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 transition-all duration-300 hover-scale">
                    <Bell className="h-4 w-4 ml-2" />
                    إرسال إشعار
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-right">إرسال إشعار جديد</DialogTitle>
                    <DialogDescription className="text-right">
                      أرسل إشعاراً مخصصاً لجميع مستخدمي التطبيق
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="notificationTitle" className="text-right">عنوان الإشعار</Label>
                      <Input
                        id="notificationTitle"
                        value={newNotification.title}
                        onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                        placeholder="أدخل عنوان الإشعار"
                        className="text-right"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notificationMessage" className="text-right">محتوى الإشعار</Label>
                      <Input
                        id="notificationMessage"
                        value={newNotification.message}
                        onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                        placeholder="أدخل محتوى الإشعار"
                        className="text-right"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="audience" className="text-right">الجمهور المستهدف</Label>
                      <Select value={newNotification.audience} onValueChange={(value) => setNewNotification({...newNotification, audience: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الجمهور" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">جميع المستخدمين</SelectItem>
                          <SelectItem value="active">المستخدمين النشطين</SelectItem>
                          <SelectItem value="booked">العملاء المحجوزين</SelectItem>
                          <SelectItem value="vip">العملاء المميزين</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={() => setIsNotificationDialogOpen(false)}>
                      إلغاء
                    </Button>
                    <Button onClick={handleSendNotification} className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                      إرسال الإشعار
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button variant="outline" className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 transition-all duration-300 hover-scale">
                <Download className="h-4 w-4 ml-2" />
                تحديث التطبيق
              </Button>
              
              <Button variant="outline" className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 transition-all duration-300 hover-scale">
                <Settings className="h-4 w-4 ml-2" />
                إعدادات متقدمة
              </Button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <Card className="shadow-lg border-0">
            <CardContent className="flex items-center justify-center p-12">
              <div className="text-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">جاري تحميل بيانات التطبيق</h3>
                  <p className="text-muted-foreground">يرجى الانتظار بينما نحضر أحدث البيانات</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Card className="shadow-lg border-red-200">
            <CardContent className="flex items-center justify-center p-12">
              <div className="text-center space-y-4">
                <AlertTriangle className="h-12 w-12 mx-auto text-red-500" />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-red-600">حدث خطأ في تحميل البيانات</h3>
                  <p className="text-muted-foreground">{error}</p>
                  <Button variant="outline" className="mt-4">
                    إعادة المحاولة
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced App Metrics */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
            <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 hover-scale transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200 dark:bg-blue-800 rounded-full -mr-10 -mt-10 opacity-20"></div>
              <CardHeader className="pb-2 relative z-10">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">إجمالي التحميلات</CardTitle>
                  <Download className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-3xl font-bold text-blue-900 dark:text-blue-100 animate-fade-in">
                  {appMetrics.totalDownloads.toLocaleString()}
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 font-medium">+12% هذا الشهر</span>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 hover-scale transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-green-200 dark:bg-green-800 rounded-full -mr-10 -mt-10 opacity-20"></div>
              <CardHeader className="pb-2 relative z-10">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">المستخدمين النشطين</CardTitle>
                  <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-3xl font-bold text-green-900 dark:text-green-100 animate-fade-in">
                  {appMetrics.activeUsers.toLocaleString()}
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 font-medium">+8% هذا الأسبوع</span>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 hover-scale transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-200 dark:bg-yellow-800 rounded-full -mr-10 -mt-10 opacity-20"></div>
              <CardHeader className="pb-2 relative z-10">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-yellow-700 dark:text-yellow-300">التقييم</CardTitle>
                  <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-3xl font-bold text-yellow-900 dark:text-yellow-100 animate-fade-in">
                  {appMetrics.averageRating}/5
                </div>
                <div className="flex mt-2">
                  {renderStars(Math.round(appMetrics.averageRating))}
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 hover-scale transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-purple-200 dark:bg-purple-800 rounded-full -mr-10 -mt-10 opacity-20"></div>
              <CardHeader className="pb-2 relative z-10">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">البيع اليومية</CardTitle>
                  <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-3xl font-bold text-purple-900 dark:text-purple-100 animate-fade-in">
                  {appMetrics.dailyBookings}
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 font-medium">+15% عن الأمس</span>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-950 dark:to-cyan-900 hover-scale transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-200 dark:bg-cyan-800 rounded-full -mr-10 -mt-10 opacity-20"></div>
              <CardHeader className="pb-2 relative z-10">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-cyan-700 dark:text-cyan-300">معدل الاحتفاظ</CardTitle>
                  <Target className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-3xl font-bold text-cyan-900 dark:text-cyan-100 animate-fade-in">
                  {appMetrics.userRetention}%
                </div>
                <p className="text-sm text-cyan-600 mt-2">معدل شهري</p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900 hover-scale transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-200 dark:bg-indigo-800 rounded-full -mr-10 -mt-10 opacity-20"></div>
              <CardHeader className="pb-2 relative z-10">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-indigo-700 dark:text-indigo-300">إصدار التطبيق</CardTitle>
                  <Smartphone className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-3xl font-bold text-indigo-900 dark:text-indigo-100 animate-fade-in">
                  {appMetrics.appVersion}
                </div>
                <p className="text-sm text-indigo-600 mt-2">الإصدار الحالي</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Enhanced Main App Management Tabs */}
        {!loading && !error && (
          <Tabs defaultValue="analytics" className="space-y-8">
            <TabsList className="grid w-full grid-cols-6 bg-white dark:bg-gray-900 shadow-lg rounded-xl border-0 p-2">
              <TabsTrigger value="analytics" className="text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white transition-all duration-300">
                <BarChart3 className="h-4 w-4 ml-2" />
                التحليلات
              </TabsTrigger>
              <TabsTrigger value="users" className="text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-teal-500 data-[state=active]:text-white transition-all duration-300">
                <Users className="h-4 w-4 ml-2" />
                المستخدمين
              </TabsTrigger>
              <TabsTrigger value="notifications" className="text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white transition-all duration-300">
                <Bell className="h-4 w-4 ml-2" />
                الإشعارات
              </TabsTrigger>
              <TabsTrigger value="feedback" className="text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white transition-all duration-300">
                <MessageSquare className="h-4 w-4 ml-2" />
                التقييمات
              </TabsTrigger>
              <TabsTrigger value="updates" className="text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white transition-all duration-300">
                <Upload className="h-4 w-4 ml-2" />
                التحديثات
              </TabsTrigger>
              <TabsTrigger value="settings" className="text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-gray-500 data-[state=active]:to-gray-600 data-[state=active]:text-white transition-all duration-300">
                <Settings className="h-4 w-4 ml-2" />
                الإعدادات
              </TabsTrigger>
            </TabsList>

            <TabsContent value="analytics" className="space-y-8 animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Enhanced Downloads Chart */}
                <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-950">
                  <CardHeader className="border-b border-blue-100 dark:border-blue-800">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <Download className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">التحميلات الشهرية</CardTitle>
                        <CardDescription>تحليل مفصل لعدد التحميلات خلال آخر 4 أشهر</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart data={appAnalytics}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis dataKey="month" className="text-sm" />
                        <YAxis className="text-sm" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: 'none', 
                            borderRadius: '12px',
                            boxShadow: '0 10px 30px -10px rgba(0,0,0,0.2)' 
                          }} 
                        />
                        <Bar dataKey="downloads" fill="url(#downloadsGradient)" radius={[4, 4, 0, 0]} />
                        <defs>
                          <linearGradient id="downloadsGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3B82F6" />
                            <stop offset="100%" stopColor="#1E40AF" />
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Enhanced Platform Distribution */}
                <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-green-50 dark:from-gray-900 dark:to-green-950">
                  <CardHeader className="border-b border-green-100 dark:border-green-800">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                        <Globe className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">توزيع المنصات</CardTitle>
                        <CardDescription>نسبة المستخدمين حسب نظام التشغيل</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ResponsiveContainer width="100%" height={350}>
                      <PieChart>
                        <Pie
                          data={platformDistribution}
                          cx="50%"
                          cy="50%"
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                          label={({name, value}) => `${name}: ${value}%`}
                        >
                          {platformDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: 'none', 
                            borderRadius: '12px',
                            boxShadow: '0 10px 30px -10px rgba(0,0,0,0.2)' 
                          }} 
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Enhanced Active Users Chart */}
                <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-950">
                  <CardHeader className="border-b border-purple-100 dark:border-purple-800">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                        <Activity className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">المستخدمين النشطين</CardTitle>
                        <CardDescription>تطور عدد المستخدمين النشطين يومياً</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ResponsiveContainer width="100%" height={350}>
                      <LineChart data={appAnalytics}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis dataKey="month" className="text-sm" />
                        <YAxis className="text-sm" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: 'none', 
                            borderRadius: '12px',
                            boxShadow: '0 10px 30px -10px rgba(0,0,0,0.2)' 
                          }} 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="activeUsers" 
                          stroke="#8B5CF6" 
                          strokeWidth={3} 
                          dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 6 }}
                          activeDot={{ r: 8, fill: '#7C3AED' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Enhanced Bookings Chart */}
                <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-orange-50 dark:from-gray-900 dark:to-orange-950">
                  <CardHeader className="border-b border-orange-100 dark:border-orange-800">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                        <Calendar className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">البيع عبر التطبيق</CardTitle>
                        <CardDescription>إحصائيات البيع الشهرية مع معدل النمو</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart data={appAnalytics}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis dataKey="month" className="text-sm" />
                        <YAxis className="text-sm" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: 'none', 
                            borderRadius: '12px',
                            boxShadow: '0 10px 30px -10px rgba(0,0,0,0.2)' 
                          }} 
                        />
                        <Bar dataKey="bookings" fill="url(#bookingsGradient)" radius={[4, 4, 0, 0]} />
                        <defs>
                          <linearGradient id="bookingsGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#F59E0B" />
                            <stop offset="100%" stopColor="#D97706" />
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-8 animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Enhanced User Statistics */}
                <Card className="lg:col-span-3 shadow-lg border-0 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
                  <CardHeader className="border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">إحصائيات المستخدمين التفصيلية</CardTitle>
                        <CardDescription>تحليل شامل لسلوك المستخدمين ومقاييس الأداء</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                      <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-2xl">
                        <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                          {appMetrics.activeUsers.toLocaleString()}
                        </div>
                        <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">مستخدم نشط</p>
                        <div className="flex items-center justify-center gap-1 mt-2">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span className="text-xs text-green-600">+8% هذا الأسبوع</span>
                        </div>
                      </div>
                      
                      <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-2xl">
                        <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">92%</div>
                        <p className="text-sm text-green-700 dark:text-green-300 font-medium">معدل الرضا</p>
                        <div className="flex items-center justify-center gap-1 mt-2">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span className="text-xs text-green-600">+3% عن الشهر الماضي</span>
                        </div>
                      </div>
                      
                      <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 rounded-2xl">
                        <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">4.2</div>
                        <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">متوسط الجلسات اليومية</p>
                        <div className="flex items-center justify-center gap-1 mt-2">
                          <Clock className="h-4 w-4 text-purple-500" />
                          <span className="text-xs text-purple-600">12 دقيقة متوسط الجلسة</span>
                        </div>
                      </div>
                      
                      <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 rounded-2xl">
                        <div className="text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2">78%</div>
                        <p className="text-sm text-orange-700 dark:text-orange-300 font-medium">معدل الاستبقاء</p>
                        <div className="flex items-center justify-center gap-1 mt-2">
                          <Target className="h-4 w-4 text-orange-500" />
                          <span className="text-xs text-orange-600">معدل شهري ممتاز</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-8 animate-fade-in">
              <Card className="shadow-lg border-0">
                <CardHeader className="border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                        <Bell className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">إدارة الإشعارات</CardTitle>
                        <CardDescription>الإشعارات الأخيرة والرسائل المرسلة للمستخدمين</CardDescription>
                      </div>
                    </div>
                    <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                      <Bell className="h-4 w-4 ml-2" />
                      إشعار جديد
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {notifications.map((notification, index) => (
                      <div key={index} className="flex items-center justify-between p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:shadow-lg transition-all duration-300 hover-scale">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-lg">{notification.title}</h4>
                            <Badge variant={notification.sent ? "default" : "secondary"} className="text-xs">
                              {notification.sent ? "مُرسل" : "في الانتظار"}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-3">{notification.message}</p>
                          <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              <span>{notification.audience}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>{notification.date}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button size="sm" variant="outline" className="hover-scale">
                            <Eye className="h-4 w-4 ml-1" />
                            عرض
                          </Button>
                          <Button size="sm" variant="outline" className="hover-scale">
                            <Share2 className="h-4 w-4 ml-1" />
                            إعادة إرسال
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="feedback" className="space-y-8 animate-fade-in">
              <Card className="shadow-lg border-0">
                <CardHeader className="border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-pink-100 dark:bg-pink-900 rounded-lg">
                      <MessageSquare className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">تقييمات المستخدمين</CardTitle>
                      <CardDescription>آراء وتقييمات العملاء حول التطبيق</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {userFeedback.map((feedback, index) => (
                      <div key={index} className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:shadow-lg transition-all duration-300 hover-scale">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                              {feedback.userName.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-semibold text-lg">{feedback.userName}</h4>
                              <div className="flex items-center gap-2">
                                <div className="flex">
                                  {renderStars(feedback.rating)}
                                </div>
                                <span className="text-sm text-muted-foreground">({feedback.rating}/5)</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline">{feedback.platform}</Badge>
                            <p className="text-sm text-muted-foreground mt-1">{feedback.date}</p>
                          </div>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">{feedback.review}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="updates" className="space-y-8 animate-fade-in">
              <Card className="shadow-lg border-0">
                <CardHeader className="border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                        <Upload className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">تحديثات التطبيق</CardTitle>
                        <CardDescription>إدارة الإصدارات والتحديثات الجديدة</CardDescription>
                      </div>
                    </div>
                    <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600">
                      <Upload className="h-4 w-4 ml-2" />
                      رفع تحديث جديد
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="p-6 border border-green-200 dark:border-green-700 rounded-xl bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white">
                            <Zap className="h-6 w-6" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-lg">الإصدار {appMetrics.appVersion}</h4>
                            <p className="text-muted-foreground">آخر إصدار متاح - نشط حالياً</p>
                          </div>
                        </div>
                        <Badge className="bg-green-500 text-white">نشط</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        تحسينات في الأداء وإصلاح أخطاء بسيطة + ميزة التتبع المباشر الجديدة
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span>تاريخ الإصدار: 2024-01-20</span>
                        <span>معدل التحديث: 89%</span>
                        <span>التقييم: 4.8/5</span>
                      </div>
                    </div>

                    <div className="p-6 border border-blue-200 dark:border-blue-700 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white">
                            <Clock className="h-6 w-6" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-lg">الإصدار 2.2.0</h4>
                            <p className="text-muted-foreground">قيد التطوير - قريباً</p>
                          </div>
                        </div>
                        <Badge variant="outline">قيد التطوير</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        ميزات جديدة: دفع إلكتروني متقدم، تتبع GPS محسن، واجهة مستخدم محدثة
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span>الإصدار المتوقع: 2024-02-15</span>
                        <span>نسبة الإنجاز: 75%</span>
                        <span>الميزات الجديدة: 8</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-8 animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="shadow-lg border-0">
                  <CardHeader className="border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">إعدادات عامة</CardTitle>
                        <CardDescription>تخصيص سلوك التطبيق والإشعارات</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">الإشعارات الفورية</h4>
                          <p className="text-sm text-muted-foreground">إرسال إشعارات للمستخدمين</p>
                        </div>
                        <Button variant="outline" size="sm">تفعيل</Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">التحديث التلقائي</h4>
                          <p className="text-sm text-muted-foreground">تحديث التطبيق تلقائياً</p>
                        </div>
                        <Button variant="outline" size="sm">تفعيل</Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">وضع الصيانة</h4>
                          <p className="text-sm text-muted-foreground">إيقاف التطبيق مؤقتاً</p>
                        </div>
                        <Button variant="outline" size="sm">إلغاء تفعيل</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-0">
                  <CardHeader className="border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                        <Shield className="h-5 w-5 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">الأمان والخصوصية</CardTitle>
                        <CardDescription>إدارة إعدادات الأمان</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">التحقق بخطوتين</h4>
                          <p className="text-sm text-muted-foreground">حماية إضافية للحسابات</p>
                        </div>
                        <Button variant="outline" size="sm">تفعيل</Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">تشفير البيانات</h4>
                          <p className="text-sm text-muted-foreground">حماية بيانات المستخدمين</p>
                        </div>
                        <Button variant="outline" size="sm">نشط</Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">سياسة الخصوصية</h4>
                          <p className="text-sm text-muted-foreground">آخر تحديث للسياسات</p>
                        </div>
                        <Button variant="outline" size="sm">عرض</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}