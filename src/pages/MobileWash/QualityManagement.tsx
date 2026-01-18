import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { EnhancedStatsCard } from "@/components/ui/enhanced-stats-card";
import { EnhancedTabs, TabsContent as EnhancedTabsContent } from "@/components/ui/enhanced-tabs";
import { 
  Award, 
  Star, 
  MessageSquare, 
  TrendingUp, 
  Users, 
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  Phone,
  Mail,
  Plus,
  Search,
  Filter,
  Eye,
  ThumbsUp,
  ThumbsDown,
  BarChart3,
  Target,
  Calendar,
  Loader2,
  Heart,
  Smile,
  Frown,
  Meh,
  Zap,
  Shield,
  Gauge,
  Trophy,
  TrendingDown,
  Activity,
  FileText,
  Settings,
  Truck
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Line, LineChart, Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, Area, AreaChart } from "recharts";
import { useMobileWashData } from "@/hooks/useMobileWashData";

export default function QualityManagement() {
  const { 
    quality, 
    bookings,
    loading, 
    error 
  } = useMobileWashData();
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [isViewFeedbackOpen, setIsViewFeedbackOpen] = useState(false);
  const [liveUpdate, setLiveUpdate] = useState(0);
  const { toast } = useToast();

  // Auto refresh for live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveUpdate(prev => prev + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Sample data for charts when quality data is not available
  const sampleSatisfactionTrend = [
    { month: 'يناير', rating: 4.2, complaints: 12 },
    { month: 'فبراير', rating: 4.4, complaints: 8 },
    { month: 'مارس', rating: 4.6, complaints: 6 },
    { month: 'أبريل', rating: 4.5, complaints: 9 },
    { month: 'مايو', rating: 4.7, complaints: 4 },
    { month: 'يونيو', rating: 4.8, complaints: 3 }
  ];

  const sampleFeedbackCategories = [
    { name: 'ممتاز', value: 45, color: '#10b981' },
    { name: 'جيد جداً', value: 30, color: '#3b82f6' },
    { name: 'جيد', value: 15, color: '#f59e0b' },
    { name: 'مقبول', value: 7, color: '#ef4444' },
    { name: 'ضعيف', value: 3, color: '#6b7280' }
  ];

  const getRatingBadge = (rating: number) => {
    const ratingConfig = {
      5: { color: "from-green-500 to-emerald-600", text: "ممتاز", icon: Trophy, pulse: true },
      4: { color: "from-blue-500 to-cyan-600", text: "جيد جداً", icon: ThumbsUp, pulse: false },
      3: { color: "from-yellow-500 to-orange-500", text: "جيد", icon: Meh, pulse: false },
      2: { color: "from-orange-500 to-red-500", text: "مقبول", icon: Frown, pulse: false },
      1: { color: "from-red-500 to-red-600", text: "ضعيف", icon: ThumbsDown, pulse: true }
    };
    const config = ratingConfig[rating] || { color: "from-gray-500 to-gray-600", text: "غير محدد", icon: Star, pulse: false };
    const Icon = config.icon;
    
    return (
      <Badge className={`bg-gradient-to-r ${config.color} text-white border-0 shadow-lg ${config.pulse ? 'animate-pulse' : ''}`}>
        <Icon className="h-3 w-3 ml-1" />
        {config.text}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "reviewed": { color: "from-green-500 to-green-600", text: "تمت المراجعة", icon: CheckCircle, pulse: false },
      "pending": { color: "from-yellow-500 to-orange-500", text: "في الانتظار", icon: Clock, pulse: true },
      "escalated": { color: "from-red-500 to-red-600", text: "مُصعد", icon: AlertTriangle, pulse: true },
      "resolved": { color: "from-blue-500 to-blue-600", text: "تم الحل", icon: Shield, pulse: false }
    };
    const config = statusConfig[status] || { color: "from-gray-500 to-gray-600", text: "غير محدد", icon: Clock, pulse: false };
    const Icon = config.icon;
    
    return (
      <Badge className={`bg-gradient-to-r ${config.color} text-white border-0 shadow-lg ${config.pulse ? 'animate-pulse' : ''}`}>
        <Icon className="h-3 w-3 ml-1" />
        {config.text}
      </Badge>
    );
  };

  const renderAnimatedStars = (rating: number, size = "h-4 w-4") => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`${size} transition-all duration-300 ${
          i < rating 
            ? "text-yellow-500 fill-current animate-pulse" 
            : "text-gray-300 hover:text-yellow-400"
        }`}
        style={{
          animationDelay: `${i * 100}ms`
        }}
      />
    ));
  };

  const handleUpdateFeedbackStatus = (feedbackId: string, newStatus: string) => {
    toast({
      title: "✅ تم تحديث حالة التقييم",
      description: `تم تحديث حالة التقييم ${feedbackId} بنجاح`,
    });
  };

  const handleNewQualityReport = () => {
    toast({
      title: "📊 تقرير جودة جديد",
      description: "سيتم إنشاء تقرير جودة شامل...",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Enhanced Header with Live Indicators */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-background border border-primary/20 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-50" />
          <div className="relative p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Award className="h-8 w-8 text-primary" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping" />
                  </div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    إدارة الجودة ورضا العملاء
                  </h1>
                  <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-700 border-green-500/30 animate-pulse">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
                    نظام متقدم
                  </Badge>
                </div>
                <p className="text-muted-foreground">
                  متابعة شاملة لجودة الخدمات وتحليل آراء العملاء بالذكاء الاصطناعي
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Activity className="h-3 w-3" />
                    تحديث مباشر
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    تحليل ذكي
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    معايير عالمية
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleNewQualityReport}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Plus className="h-4 w-4 ml-2" />
                تقرير جودة جديد
              </Button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <Card className="animate-fade-in">
            <CardContent className="flex items-center justify-center p-12">
              <div className="text-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
                <div className="space-y-2">
                  <p className="text-lg font-medium">جاري تحميل بيانات الجودة</p>
                  <p className="text-sm text-muted-foreground">تحليل آراء العملاء وإحصائيات الجودة...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Card className="border-red-200 bg-red-50/50 animate-fade-in">
            <CardContent className="flex items-center justify-center p-8">
              <div className="text-center space-y-4">
                <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
                <div className="space-y-2">
                  <p className="text-lg font-medium text-red-700">حدث خطأ في تحميل البيانات</p>
                  <p className="text-sm text-red-600">{error}</p>
                  <Button variant="outline" className="mt-4">
                    إعادة المحاولة
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Quality Metrics with Advanced Visual Effects */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
            <EnhancedStatsCard
              title="التقييم العام"
              value={quality?.metrics?.averageRating ? `${quality.metrics.averageRating}/5` : "4.8/5"}
              subtitle={
                <div className="flex">
                  {renderAnimatedStars(Math.round(quality?.metrics?.averageRating || 4.8))}
                </div>
              }
              icon={Star}
              color="yellow"
              index={0}
            />
            <EnhancedStatsCard
              title="إجمالي التقييمات"
              value={quality?.metrics?.totalFeedbacks?.toLocaleString() || "2,847"}
              subtitle={<span><span className="text-green-600 font-semibold">+{quality?.trends?.monthlyGrowth || "23"}%</span> هذا الشهر</span>}
              icon={MessageSquare}
              color="blue"
              index={1}
            />
            <EnhancedStatsCard
              title="معدل الرضا"
              value={`${quality?.metrics?.satisfactionRate || "96"}%`}
              subtitle="من العملاء راضون"
              icon={Heart}
              color="green"
              index={2}
            />
            <EnhancedStatsCard
              title="معدل الشكاوى"
              value={`${quality?.metrics?.complaintRate || "2.1"}%`}
              subtitle={<span><span className="text-green-600 font-semibold">{quality?.trends?.complaintTrend || "-1.2"}%</span> تحسن</span>}
              icon={AlertTriangle}
              color="orange"
              index={3}
            />
            <EnhancedStatsCard
              title="زمن الاستجابة"
              value={`${quality?.metrics?.responseTime || "8"} دقيقة`}
              subtitle="متوسط الرد"
              icon={Clock}
              color="purple"
              index={4}
            />
            <EnhancedStatsCard
              title="معدل الحل"
              value={`${quality?.metrics?.resolutionRate || "98"}%`}
              subtitle="نسبة حل المشاكل"
              icon={CheckCircle}
              color="emerald"
              index={5}
            />
          </div>
        )}

        {/* Enhanced Search and Filter Controls */}
        {!loading && !error && (
          <Card className="animate-fade-in border-0 bg-gradient-to-r from-card to-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-primary" />
                البحث والتصفية الذكية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="البحث في آراء العملاء..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10 transition-all duration-300 focus:scale-105"
                  />
                </div>
                <Select value={ratingFilter} onValueChange={setRatingFilter}>
                  <SelectTrigger className="transition-all duration-300 hover:scale-105">
                    <SelectValue placeholder="تصفية حسب التقييم" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع التقييمات</SelectItem>
                    <SelectItem value="5">⭐⭐⭐⭐⭐ ممتاز</SelectItem>
                    <SelectItem value="4">⭐⭐⭐⭐ جيد جداً</SelectItem>
                    <SelectItem value="3">⭐⭐⭐ جيد</SelectItem>
                    <SelectItem value="2">⭐⭐ مقبول</SelectItem>
                    <SelectItem value="1">⭐ ضعيف</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="transition-all duration-300 hover:scale-105">
                    <SelectValue placeholder="حالة المعالجة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الحالات</SelectItem>
                    <SelectItem value="pending">في الانتظار</SelectItem>
                    <SelectItem value="reviewed">تمت المراجعة</SelectItem>
                    <SelectItem value="resolved">تم الحل</SelectItem>
                    <SelectItem value="escalated">مُصعد</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  className="hover:scale-105 transition-all duration-300 hover:shadow-lg"
                >
                  <Eye className="h-4 w-4 ml-2" />
                  عرض متقدم
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Main Quality Management Interface */}
        {!loading && !error && (
          <EnhancedTabs
            items={[
              { value: "feedback", label: "آراء العملاء", icon: MessageSquare, color: "blue" },
              { value: "analytics", label: "تحليلات الجودة", icon: BarChart3, color: "purple" },
              { value: "inspections", label: "فحوصات الجودة", icon: CheckCircle, color: "green" },
              { value: "trends", label: "اتجاهات الرضا", icon: TrendingUp, color: "orange" },
              { value: "reports", label: "تقارير شاملة", icon: FileText, color: "indigo" }
            ]}
            defaultValue="feedback"
            className="animate-fade-in"
          >

            <EnhancedTabsContent value="feedback" className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sample feedback cards with enhanced design */}
                {[
                  {
                    id: "FB001",
                    customerName: "أحمد محمد",
                    rating: 5,
                    comment: "خدمة ممتازة وسرعة في التنفيذ. السائق كان مهذب جداً والنتيجة رائعة.",
                    date: "2024-01-15",
                    status: "reviewed",
                    serviceType: "  شامل",
                    vehicleType: "سيدان"
                  },
                  {
                    id: "FB002", 
                    customerName: "فاطمة أحمد",
                    rating: 4,
                    comment: "خدمة جيدة بشكل عام، لكن التأخير في الوصول كان مزعج قليلاً.",
                    date: "2024-01-14",
                    status: "pending",
                    serviceType: "  عادي",
                    vehicleType: "SUV"
                  },
                  {
                    id: "FB003",
                    customerName: "خالد سعد", 
                    rating: 5,
                    comment: "تجربة رائعة! الخدمة احترافية والأسعار معقولة. سأكرر التجربة بالتأكيد.",
                    date: "2024-01-13",
                    status: "resolved",
                    serviceType: "  تفصيلي",
                    vehicleType: "كوبيه"
                  }
                ].map((feedback, index) => (
                  <Card 
                    key={feedback.id} 
                    className="group hover:shadow-xl transition-all duration-500 hover:scale-[1.02] border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm animate-fade-in"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                            <Users className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-lg group-hover:text-primary transition-colors">
                              {feedback.customerName}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2">
                              <Calendar className="h-3 w-3" />
                              {feedback.date}
                            </CardDescription>
                          </div>
                        </div>
                        {getRatingBadge(feedback.rating)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Enhanced Rating Display */}
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <div className="flex">
                          {renderAnimatedStars(feedback.rating)}
                        </div>
                        <span className="text-sm font-medium">{feedback.rating}/5</span>
                      </div>

                      {/* Service Details */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Target className="h-3 w-3 text-primary" />
                          <span>{feedback.serviceType}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Truck className="h-3 w-3 text-primary" />
                          <span>{feedback.vehicleType}</span>
                        </div>
                      </div>

                      {/* Customer Comment */}
                      <div className="border-l-4 border-primary rounded-lg p-3 bg-primary/5 backdrop-blur-sm">
                        <p className="text-sm italic">"{feedback.comment}"</p>
                      </div>

                      {/* Status and Actions */}
                      <div className="flex items-center justify-between">
                        {getStatusBadge(feedback.status)}
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="hover:scale-105 transition-all duration-300"
                          >
                            <Eye className="h-3 w-3 ml-1" />
                            عرض
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="hover:scale-105 transition-all duration-300"
                          >
                            <MessageSquare className="h-3 w-3 ml-1" />
                            رد
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </EnhancedTabsContent>

            <EnhancedTabsContent value="analytics" className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Enhanced Satisfaction Trend Chart */}
                <Card className="border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      اتجاه الرضا الشهري
                    </CardTitle>
                    <CardDescription>تطور معدل رضا العملاء خلال الأشهر الماضية</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={sampleSatisfactionTrend}>
                        <defs>
                          <linearGradient id="satisfactionGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="month" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                            border: 'none', 
                            borderRadius: '8px',
                            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="rating" 
                          stroke="#10b981" 
                          strokeWidth={3}
                          fill="url(#satisfactionGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Enhanced Feedback Distribution */}
                <Card className="border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-blue-500" />
                      توزيع التقييمات
                    </CardTitle>
                    <CardDescription>نسبة التقييمات حسب عدد النجوم</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={sampleFeedbackCategories}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={120}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {sampleFeedbackCategories.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                            border: 'none', 
                            borderRadius: '8px',
                            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Quality Metrics Progress */}
                <Card className="border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gauge className="h-5 w-5 text-purple-500" />
                      مؤشرات الجودة الرئيسية
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">رضا العملاء</span>
                        <span className="text-sm font-bold text-green-600">96%</span>
                      </div>
                      <Progress value={96} className="h-3" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">جودة الخدمة</span>
                        <span className="text-sm font-bold text-blue-600">94%</span>
                      </div>
                      <Progress value={94} className="h-3" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">سرعة الاستجابة</span>
                        <span className="text-sm font-bold text-orange-600">89%</span>
                      </div>
                      <Progress value={89} className="h-3" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">احترافية الفريق</span>
                        <span className="text-sm font-bold text-purple-600">98%</span>
                      </div>
                      <Progress value={98} className="h-3" />
                    </div>
                  </CardContent>
                </Card>

                {/* Complaints Analysis */}
                <Card className="border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-orange-500" />
                      تحليل الشكاوى
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={sampleSatisfactionTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="month" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                            border: 'none', 
                            borderRadius: '8px',
                            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Bar dataKey="complaints" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </EnhancedTabsContent>

            <EnhancedTabsContent value="inspections" className="space-y-6 animate-fade-in">
              <Card className="border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    فحوصات الجودة
                  </CardTitle>
                  <CardDescription>تقارير فحص الجودة الميدانية والمعايير</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4 animate-pulse" />
                    <p className="text-lg font-medium">فحوصات الجودة الميدانية</p>
                    <p className="text-muted-foreground mt-2">
                      سيتم إضافة نظام فحوصات الجودة التفصيلية هنا
                    </p>
                    <Button className="mt-4" variant="outline">
                      <Plus className="h-4 w-4 ml-2" />
                      إنشاء فحص جديد
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </EnhancedTabsContent>

            <EnhancedTabsContent value="trends" className="space-y-6 animate-fade-in">
              <Card className="border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-orange-500" />
                    اتجاهات الرضا والجودة
                  </CardTitle>
                  <CardDescription>تحليل الاتجاهات طويلة المدى لرضا العملاء</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <TrendingUp className="h-16 w-16 mx-auto text-orange-500 mb-4 animate-bounce" />
                    <p className="text-lg font-medium">تحليل الاتجاهات المتقدم</p>
                    <p className="text-muted-foreground mt-2">
                      سيتم إضافة تحليلات متقدمة للاتجاهات والتنبؤات هنا
                    </p>
                  </div>
                </CardContent>
              </Card>
            </EnhancedTabsContent>

            <EnhancedTabsContent value="reports" className="space-y-6 animate-fade-in">
              <Card className="border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-indigo-500" />
                    التقارير الشاملة
                  </CardTitle>
                  <CardDescription>تقارير مفصلة عن جودة الخدمات والأداء</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 mx-auto text-indigo-500 mb-4" />
                    <p className="text-lg font-medium">نظام التقارير المتقدم</p>
                    <p className="text-muted-foreground mt-2">
                      سيتم إضافة نظام التقارير التفصيلية والتحليلات المتقدمة هنا
                    </p>
                    <div className="flex gap-3 justify-center mt-6">
                      <Button variant="outline">
                        <BarChart3 className="h-4 w-4 ml-2" />
                        تقرير الأداء
                      </Button>
                      <Button variant="outline">
                        <Heart className="h-4 w-4 ml-2" />
                        تقرير الرضا
                      </Button>
                      <Button variant="outline">
                        <Shield className="h-4 w-4 ml-2" />
                        تقرير الجودة
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </EnhancedTabsContent>
          </EnhancedTabs>
        )}
      </div>
    </div>
  );
}