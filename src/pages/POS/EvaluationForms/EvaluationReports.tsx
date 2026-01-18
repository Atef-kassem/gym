import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Download, 
  TrendingUp, 
  TrendingDown, 
  Star, 
  Users, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Target,
  Award,
  Calendar as CalendarIcon,
  BarChart3,
  PieChart,
  LineChart,
  Filter,
  RefreshCw,
  Share2,
  Printer,
  MessageCircle,
  Repeat,
  ThumbsUp,
  Zap,
  Shield,
  Camera,
  Timer,
  Phone,
  TrendingDown as ChurnIcon
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format, addDays } from "date-fns";
import { ar } from "date-fns/locale";
import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart as RechartsBarChart,
  Bar,
  Legend,
  Area,
  AreaChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";

// بيانات شاملة للتقارير بناءً على أفضل الممارسات العالمية

// 1. جودة التنفيذ (Service Quality)
const serviceQualityData = [
  { service: "  عادي", excellentRate: 85, complaints: 12, reworkCount: 3, avgRating: 4.2, beforeAfterPhotos: 156, qualityScore: 88 },
  { service: "  شامل", excellentRate: 92, complaints: 5, reworkCount: 1, avgRating: 4.5, beforeAfterPhotos: 89, qualityScore: 94 },
  { service: "تنظيف داخلي", excellentRate: 88, complaints: 8, reworkCount: 2, avgRating: 4.3, beforeAfterPhotos: 67, qualityScore: 90 },
  { service: "تلميع", excellentRate: 94, complaints: 3, reworkCount: 0, avgRating: 4.6, beforeAfterPhotos: 45, qualityScore: 96 },
  { service: "حماية", excellentRate: 90, complaints: 4, reworkCount: 1, avgRating: 4.4, beforeAfterPhotos: 23, qualityScore: 92 }
];

// 2. سرعة الاستجابة (Responsiveness)
const responsivenessData = [
  { service: "  عادي", avgWaitTime: 8, targetTime: 15, actualTime: 14, complaintsResponseTime: 45, efficiency: 93 },
  { service: "  شامل", avgWaitTime: 12, targetTime: 45, actualTime: 42, complaintsResponseTime: 35, efficiency: 93 },
  { service: "تنظيف داخلي", avgWaitTime: 10, targetTime: 30, actualTime: 28, complaintsResponseTime: 40, efficiency: 93 },
  { service: "تلميع", avgWaitTime: 15, targetTime: 60, actualTime: 58, complaintsResponseTime: 30, efficiency: 97 },
  { service: "حماية", avgWaitTime: 20, targetTime: 90, actualTime: 85, complaintsResponseTime: 25, efficiency: 94 }
];

// 3. مستوى التواصل (Communication)
const communicationData = [
  { employee: "أحمد محمد", communicationRating: 4.7, clarityScore: 95, misunderstandings: 2, responseRate: 98, customerSatisfaction: 96 },
  { employee: "محمد عبدالله", communicationRating: 4.5, clarityScore: 90, misunderstandings: 5, responseRate: 95, customerSatisfaction: 92 },
  { employee: "عبدالرحمن سالم", communicationRating: 4.3, clarityScore: 88, misunderstandings: 8, responseRate: 92, customerSatisfaction: 89 },
  { employee: "سالم أحمد", communicationRating: 4.2, clarityScore: 85, misunderstandings: 10, responseRate: 90, customerSatisfaction: 87 },
  { employee: "خالد محمد", communicationRating: 4.4, clarityScore: 87, misunderstandings: 6, responseRate: 94, customerSatisfaction: 90 }
];

// 4. تكرار الزيارات والولاء (Repeat Visits & Loyalty)
const loyaltyData = [
  { month: "يناير", repeatRate: 65, newCustomers: 245, returningCustomers: 456, churnRate: 8, loyaltyScore: 72 },
  { month: "فبراير", repeatRate: 68, newCustomers: 267, returningCustomers: 478, churnRate: 7, loyaltyScore: 75 },
  { month: "مارس", repeatRate: 70, newCustomers: 298, returningCustomers: 512, churnRate: 6, loyaltyScore: 78 },
  { month: "أبريل", repeatRate: 72, newCustomers: 312, returningCustomers: 534, churnRate: 5, loyaltyScore: 81 },
  { month: "مايو", repeatRate: 75, newCustomers: 356, returningCustomers: 567, churnRate: 4, loyaltyScore: 84 },
  { month: "يونيو", repeatRate: 78, newCustomers: 389, returningCustomers: 598, churnRate: 3, loyaltyScore: 87 }
];

// 5. معالجة الشكاوى (Complaints Handling)
const complaintsData = [
  { type: "جودة التنفيذ", count: 45, avgResolutionTime: 2.5, resolvedRate: 95, recurring: 8, severity: "عالية" },
  { type: "سرعة الخدمة", count: 32, avgResolutionTime: 1.8, resolvedRate: 98, recurring: 5, severity: "متوسطة" },
  { type: "التواصل", count: 18, avgResolutionTime: 1.2, resolvedRate: 100, recurring: 2, severity: "منخفضة" },
  { type: "الأسعار", count: 12, avgResolutionTime: 3.0, resolvedRate: 85, recurring: 4, severity: "متوسطة" },
  { type: "تلفيات", count: 8, avgResolutionTime: 4.5, resolvedRate: 90, recurring: 1, severity: "عالية" }
];

// بيانات الرادار للعناصر الخمسة الرئيسية
const coreMetricsRadar = [
  {
    metric: "جودة التنفيذ",
    current: 90,
    target: 95,
    benchmark: 85
  },
  {
    metric: "سرعة الاستجابة", 
    current: 94,
    target: 95,
    benchmark: 88
  },
  {
    metric: "مستوى التواصل",
    current: 92,
    target: 95,
    benchmark: 82
  },
  {
    metric: "تكرار الزيارات",
    current: 78,
    target: 85,
    benchmark: 70
  },
  {
    metric: "معالجة الشكاوى",
    current: 95,
    target: 98,
    benchmark: 90
  }
];

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

// المؤشرات الذكية الرئيسية (Enhanced KPIs)
const enhancedKPIs = [
  { 
    title: "مؤشر جودة التنفيذ", 
    value: "90%", 
    change: "+5%", 
    trend: "up", 
    icon: Star, 
    color: "text-yellow-600",
    description: "نسبة التقييمات الممتازة",
    target: 95,
    current: 90
  },
  { 
    title: "سرعة الاستجابة", 
    value: "14د", 
    change: "-2د", 
    trend: "up", 
    icon: Zap, 
    color: "text-blue-600",
    description: "متوسط زمن إتمام الخدمة",
    target: 15,
    current: 14
  },
  { 
    title: "مستوى التواصل", 
    value: "4.4/5", 
    change: "+0.3", 
    trend: "up", 
    icon: MessageCircle, 
    color: "text-green-600",
    description: "تقييم مهارات التواصل",
    target: 4.5,
    current: 4.4
  },
  { 
    title: "معدل الولاء", 
    value: "78%", 
    change: "+13%", 
    trend: "up", 
    icon: Repeat, 
    color: "text-purple-600",
    description: "نسبة تكرار الزيارات",
    target: 85,
    current: 78
  },
  { 
    title: "حل الشكاوى", 
    value: "95%", 
    change: "+3%", 
    trend: "up", 
    icon: Shield, 
    color: "text-orange-600",
    description: "معدل حل الشكاوى",
    target: 98,
    current: 95
  },
  { 
    title: "معدل الهجر", 
    value: "3%", 
    change: "-5%", 
    trend: "up", 
    icon: ChurnIcon, 
    color: "text-red-600",
    description: "نسبة العملاء المنقطعين",
    target: 2,
    current: 3
  }
];

export default function EvaluationReports() {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({
    from: new Date(),
    to: addDays(new Date(), 7)
  });
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [selectedService, setSelectedService] = useState("all");

  const handleExport = (type: string) => {
    console.log(`Exporting ${type} report...`);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "عالية": return "bg-red-100 text-red-800 border-red-200";
      case "متوسطة": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "منخفضة": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPerformanceBadge = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage >= 95) return { variant: "default", text: "ممتاز", color: "bg-green-100 text-green-800" };
    if (percentage >= 85) return { variant: "secondary", text: "جيد جداً", color: "bg-blue-100 text-blue-800" };
    if (percentage >= 75) return { variant: "outline", text: "جيد", color: "bg-yellow-100 text-yellow-800" };
    return { variant: "destructive", text: "يحتاج تحسين", color: "bg-red-100 text-red-800" };
  };

  return (
    <div className="container mx-auto p-6 space-y-6 animate-fade-in">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/pos/evaluation-management")}
            className="hover-scale"
          >
            <ArrowLeft className="h-4 w-4 ml-2" />
            العودة
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              تحليل رضا العملاء - أفضل الممارسات العالمية
            </h1>
            <p className="text-muted-foreground">نظام تقييم ذكي شامل للعناصر الخمسة الرئيسية لجودة الخدمة</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport("refresh")} className="hover-scale">
            <RefreshCw className="h-4 w-4 ml-2" />
            تحديث
          </Button>
          <Button variant="outline" onClick={() => handleExport("share")} className="hover-scale">
            <Share2 className="h-4 w-4 ml-2" />
            مشاركة
          </Button>
          <Button variant="outline" onClick={() => handleExport("print")} className="hover-scale">
            <Printer className="h-4 w-4 ml-2" />
            طباعة
          </Button>
          <Button onClick={() => handleExport("excel")} className="hover-scale">
            <Download className="h-4 w-4 ml-2" />
            تصدير Excel
          </Button>
        </div>
      </div>

      {/* Enhanced Filters */}
      <Card className="border-0 bg-gradient-to-r from-background to-muted/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            المرشحات الذكية والتحكم المتقدم
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">الفرع</label>
              <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الفرع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الفروع</SelectItem>
                  <SelectItem value="branch1">الفرع الرئيسي</SelectItem>
                  <SelectItem value="branch2">فرع الملز</SelectItem>
                  <SelectItem value="branch3">فرع العليا</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">نوع الخدمة</label>
              <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الخدمة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الخدمات</SelectItem>
                  <SelectItem value="wash"> </SelectItem>
                  <SelectItem value="polish">تلميع</SelectItem>
                  <SelectItem value="protection">حماية</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">المؤشر الرئيسي</label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="اختر المؤشر" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع المؤشرات</SelectItem>
                  <SelectItem value="quality">جودة التنفيذ</SelectItem>
                  <SelectItem value="responsiveness">سرعة الاستجابة</SelectItem>
                  <SelectItem value="communication">مستوى التواصل</SelectItem>
                  <SelectItem value="loyalty">تكرار الزيارات</SelectItem>
                  <SelectItem value="complaints">معالجة الشكاوى</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">تاريخ البداية</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="h-4 w-4 ml-2" />
                    {dateRange?.from ? format(dateRange.from, "PPP", { locale: ar }) : "اختر التاريخ"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateRange?.from}
                    onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">تاريخ النهاية</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="h-4 w-4 ml-2" />
                    {dateRange?.to ? format(dateRange.to, "PPP", { locale: ar }) : "اختر التاريخ"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateRange?.to}
                    onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced KPIs Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {enhancedKPIs.map((kpi, index) => {
          const performance = getPerformanceBadge(kpi.current, kpi.target);
          return (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover-scale border-0 bg-gradient-to-br from-background to-muted/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg bg-primary/10 ${kpi.color}`}>
                    <kpi.icon className="h-5 w-5" />
                  </div>
                  <Badge className={performance.color} variant="outline">
                    {performance.text}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">{kpi.title}</p>
                  <p className="text-xl font-bold">{kpi.value}</p>
                  <p className="text-xs text-muted-foreground">{kpi.description}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-medium ${kpi.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                      {kpi.change}
                    </span>
                    {kpi.trend === "up" ? (
                      <TrendingUp className="h-3 w-3 text-green-600" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-600" />
                    )}
                  </div>
                  <Progress 
                    value={(kpi.current / kpi.target) * 100} 
                    className="h-1"
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Core Metrics Radar Chart */}
      <Card className="border-0 bg-gradient-to-br from-background to-muted/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            العناصر الخمسة الرئيسية لجودة الخدمة - مخطط الرادار
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={coreMetricsRadar}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar
                name="الأداء الحالي"
                dataKey="current"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Radar
                name="الهدف المطلوب"
                dataKey="target"
                stroke="#10b981"
                fill="transparent"
                strokeWidth={2}
                strokeDasharray="5 5"
              />
              <Radar
                name="المعيار العالمي"
                dataKey="benchmark"
                stroke="#f59e0b"
                fill="transparent"
                strokeWidth={1}
                strokeDasharray="3 3"
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Enhanced Reports Tabs */}
      <Tabs defaultValue="quality" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-muted/50">
          <TabsTrigger value="quality" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            جودة التنفيذ
          </TabsTrigger>
          <TabsTrigger value="responsiveness" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            سرعة الاستجابة
          </TabsTrigger>
          <TabsTrigger value="communication" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            مستوى التواصل
          </TabsTrigger>
          <TabsTrigger value="loyalty" className="flex items-center gap-2">
            <Repeat className="h-4 w-4" />
            الولاء والتكرار
          </TabsTrigger>
          <TabsTrigger value="complaints" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            معالجة الشكاوى
          </TabsTrigger>
        </TabsList>

        {/* 1. جودة التنفيذ Tab */}
        <TabsContent value="quality" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 bg-gradient-to-br from-background to-muted/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  نسبة التقييمات الممتازة حسب الخدمة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsBarChart data={serviceQualityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="service" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="excellentRate" fill="#10b981" name="نسبة الامتياز %" />
                    <Bar dataKey="avgRating" fill="#3b82f6" name="متوسط التقييم" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-background to-muted/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  مؤشرات الجودة التفصيلية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {serviceQualityData.map((service, index) => (
                    <div key={index} className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium">{service.service}</span>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-100 text-green-800">
                            {service.excellentRate}% ممتاز
                          </Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-1">
                          <span className="text-muted-foreground">الشكاوى:</span>
                          <span className="font-medium text-red-600"> {service.complaints}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-muted-foreground">إعادة العمل:</span>
                          <span className="font-medium text-orange-600"> {service.reworkCount}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-muted-foreground">الصور التوثيقية:</span>
                          <span className="font-medium text-blue-600"> {service.beforeAfterPhotos}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-muted-foreground">نقاط الجودة:</span>
                          <span className="font-medium text-green-600"> {service.qualityScore}/100</span>
                        </div>
                      </div>
                      <Progress 
                        value={service.excellentRate} 
                        className="h-2 mt-3"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 2. سرعة الاستجابة Tab */}
        <TabsContent value="responsiveness" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 bg-gradient-to-br from-background to-muted/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Timer className="h-5 w-5" />
                  تحليل أوقات الخدمة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsBarChart data={responsivenessData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="service" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="targetTime" fill="#f59e0b" name="الوقت المستهدف (دقيقة)" />
                    <Bar dataKey="actualTime" fill="#3b82f6" name="الوقت الفعلي (دقيقة)" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-background to-muted/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  مؤشرات سرعة الاستجابة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {responsivenessData.map((service, index) => (
                    <div key={index} className="p-4 rounded-lg bg-muted/30">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium">{service.service}</span>
                        <Badge className="bg-blue-100 text-blue-800">
                          {service.efficiency}% كفاءة
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">وقت الانتظار: </span>
                          <span className="font-medium">{service.avgWaitTime} دقيقة</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">وقت الاستجابة للشكاوى: </span>
                          <span className="font-medium">{service.complaintsResponseTime} دقيقة</span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span>الأداء</span>
                          <span>{service.actualTime} / {service.targetTime} دقيقة</span>
                        </div>
                        <Progress 
                          value={(service.targetTime - service.actualTime + service.targetTime) / service.targetTime * 50} 
                          className="h-2"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 3. مستوى التواصل Tab */}
        <TabsContent value="communication" className="space-y-6">
          <Card className="border-0 bg-gradient-to-br from-background to-muted/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                تقييم مهارات التواصل للموظفين
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {communicationData.map((employee, index) => (
                  <div key={index} className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <MessageCircle className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{employee.employee}</h3>
                          <p className="text-sm text-muted-foreground">موظف استقبال</p>
                        </div>
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-1 mb-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="font-bold">{employee.communicationRating}/5</span>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          {employee.customerSatisfaction}% رضا
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-2 bg-blue-50 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">{employee.clarityScore}%</div>
                        <div className="text-xs text-muted-foreground">وضوح الشرح</div>
                      </div>
                      <div className="text-center p-2 bg-green-50 rounded-lg">
                        <div className="text-lg font-bold text-green-600">{employee.responseRate}%</div>
                        <div className="text-xs text-muted-foreground">معدل الرد</div>
                      </div>
                      <div className="text-center p-2 bg-orange-50 rounded-lg">
                        <div className="text-lg font-bold text-orange-600">{employee.misunderstandings}</div>
                        <div className="text-xs text-muted-foreground">سوء فهم</div>
                      </div>
                      <div className="text-center p-2 bg-purple-50 rounded-lg">
                        <div className="text-lg font-bold text-purple-600">{employee.customerSatisfaction}%</div>
                        <div className="text-xs text-muted-foreground">رضا العملاء</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>مهارات التواصل الإجمالية</span>
                        <span>{Math.round((employee.communicationRating / 5) * 100)}%</span>
                      </div>
                      <Progress value={(employee.communicationRating / 5) * 100} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 4. الولاء والتكرار Tab */}
        <TabsContent value="loyalty" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 bg-gradient-to-br from-background to-muted/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Repeat className="h-5 w-5" />
                  اتجاه معدل التكرار والولاء
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsLineChart data={loyaltyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="repeatRate" stroke="#10b981" strokeWidth={3} name="معدل التكرار %" />
                    <Line type="monotone" dataKey="churnRate" stroke="#ef4444" strokeWidth={2} name="معدل الهجر %" />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-background to-muted/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  تحليل قاعدة العملاء
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={loyaltyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="newCustomers" stackId="1" stroke="#3b82f6" fill="#3b82f6" name="عملاء جدد" />
                    <Area type="monotone" dataKey="returningCustomers" stackId="1" stroke="#10b981" fill="#10b981" name="عملاء عائدون" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 bg-gradient-to-br from-background to-muted/30">
            <CardHeader>
              <CardTitle>إحصائيات تفصيلية للولاء</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {loyaltyData.slice(-3).map((month, index) => (
                  <div key={index} className="p-4 rounded-lg bg-muted/30">
                    <h3 className="font-medium mb-3">{month.month}</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">معدل التكرار</span>
                        <span className="font-medium text-green-600">{month.repeatRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">عملاء جدد</span>
                        <span className="font-medium">{month.newCustomers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">عملاء عائدون</span>
                        <span className="font-medium">{month.returningCustomers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">معدل الهجر</span>
                        <span className="font-medium text-red-600">{month.churnRate}%</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="text-sm font-medium">نقاط الولاء</span>
                        <span className="font-bold text-purple-600">{month.loyaltyScore}/100</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 5. معالجة الشكاوى Tab */}
        <TabsContent value="complaints" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 bg-gradient-to-br from-background to-muted/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  توزيع أنواع الشكاوى
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={complaintsData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      label
                    >
                      {complaintsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-background to-muted/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  أوقات حل الشكاوى
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsBarChart data={complaintsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="avgResolutionTime" fill="#f59e0b" name="متوسط وقت الحل (ساعة)" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 bg-gradient-to-br from-background to-muted/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                تحليل الشكاوى التفصيلي
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complaintsData.map((complaint, index) => (
                  <div key={index} className="p-4 rounded-lg bg-muted/30">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5 text-orange-500" />
                        <span className="font-medium">{complaint.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getSeverityColor(complaint.severity)}>
                          {complaint.severity}
                        </Badge>
                        <span className="text-sm font-medium">{complaint.count} حالة</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-2 bg-blue-50 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">{complaint.avgResolutionTime}س</div>
                        <div className="text-xs text-muted-foreground">متوسط وقت الحل</div>
                      </div>
                      <div className="text-center p-2 bg-green-50 rounded-lg">
                        <div className="text-lg font-bold text-green-600">{complaint.resolvedRate}%</div>
                        <div className="text-xs text-muted-foreground">معدل الحل</div>
                      </div>
                      <div className="text-center p-2 bg-orange-50 rounded-lg">
                        <div className="text-lg font-bold text-orange-600">{complaint.recurring}</div>
                        <div className="text-xs text-muted-foreground">شكاوى متكررة</div>
                      </div>
                      <div className="text-center p-2 bg-purple-50 rounded-lg">
                        <div className="text-lg font-bold text-purple-600">{complaint.count - complaint.recurring}</div>
                        <div className="text-xs text-muted-foreground">حالات جديدة</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>معدل الحل النهائي</span>
                        <span>{complaint.resolvedRate}%</span>
                      </div>
                      <Progress 
                        value={complaint.resolvedRate} 
                        className="h-2"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Insights and Recommendations */}
      <Card className="border-0 bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ThumbsUp className="h-5 w-5" />
            رؤى ذكية وتوصيات استباقية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-green-50 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800">نقاط القوة</span>
              </div>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• معدل حل الشكاوى ممتاز (95%)</li>
                <li>• تحسن مستمر في الولاء (+13%)</li>
                <li>• سرعة استجابة عالية</li>
              </ul>
            </div>
            
            <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <span className="font-medium text-yellow-800">نقاط التحسين</span>
              </div>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• رفع جودة التنفيذ إلى 95%</li>
                <li>• تقليل معدل الهجر إلى 2%</li>
                <li>• تحسين مهارات التواصل</li>
              </ul>
            </div>
            
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-800">إجراءات مقترحة</span>
              </div>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• تدريب متقدم على جودة التنفيذ</li>
                <li>• برنامج ولاء للعملاء الدائمين</li>
                <li>• نظام تنبيهات ذكي للشكاوى</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}