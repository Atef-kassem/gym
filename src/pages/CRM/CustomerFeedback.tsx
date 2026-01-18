import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import SurveyCreationDialog from "@/components/CRM/SurveyCreationDialog";
import CustomerFeedbackSettingsDialog from "@/components/CRM/CustomerFeedbackSettingsDialog";
import {
  Star,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  Heart,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Filter,
  Search,
  Download,
  Upload,
  BarChart3,
  PieChart,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Smile,
  Frown,
  Meh,
  Target,
  Activity,
  Zap,
  Settings,
  Share2,
  Send,
  Bot,
  Brain,
  Globe,
  Smartphone,
  Monitor,
  QrCode,
  Link,
  Gift,
  Award,
  FileText,
  UserCheck,
  Lightbulb,
  Reply,
  Plus,
  User,
  RefreshCw,
  ChevronRight,
  MoreHorizontal
} from "lucide-react";
import { useGetFeedbacksQuery, useUpdateFeedbackMutation } from "@/services/feedbackApi";

export default function CustomerFeedback() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSource, setFilterSource] = useState("all");
  const [filterRating, setFilterRating] = useState("all");
  const [filterBranch, setFilterBranch] = useState("all");
  const [filterTimeRange, setFilterTimeRange] = useState("week");
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null);
  const [showResponseDialog, setShowResponseDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showAnalyticsDialog, setShowAnalyticsDialog] = useState(false);
  const [showSurveyDialog, setShowSurveyDialog] = useState(false);
  const [surveys, setSurveys] = useState<any[]>([]);

  // محاور التقييم الأساسية
  const evaluationCriteria = [
    { key: 'service_quality', name: 'جودة الخدمة', icon: Star, color: 'text-blue-500' },
    { key: 'wait_time', name: 'وقت الانتظار', icon: Clock, color: 'text-orange-500' },
    { key: 'cleanliness', name: 'النظافة العامة', icon: CheckCircle, color: 'text-green-500' },
    { key: 'staff_interaction', name: 'تعامل الموظفين', icon: Users, color: 'text-purple-500' },
    { key: 'value_for_money', name: 'السعر مقابل الخدمة', icon: Target, color: 'text-yellow-500' },
    { key: 'recommendation', name: 'التوصية', icon: Heart, color: 'text-red-500' }
  ];

  // مصادر التقييمات
  const feedbackSources = [
    { key: 'internal', name: 'النظام الداخلي', icon: Monitor, color: 'bg-blue-100 text-blue-600' },
    { key: 'sms', name: 'رسائل SMS', icon: Phone, color: 'bg-green-100 text-green-600' },
    { key: 'whatsapp', name: 'واتساب', icon: MessageSquare, color: 'bg-emerald-100 text-emerald-600' },
    { key: 'mobile_app', name: 'تطبيق الجوال', icon: Smartphone, color: 'bg-purple-100 text-purple-600' },
    { key: 'google_reviews', name: 'مراجعات جوجل', icon: Globe, color: 'bg-red-100 text-red-600' },
    { key: 'pos_terminal', name: 'نقاط البيع', icon: QrCode, color: 'bg-orange-100 text-orange-600' },
    { key: 'call_center', name: 'مراكز الاتصال', icon: Phone, color: 'bg-cyan-100 text-cyan-600' }
  ];

  // جلب التقييمات من API
  const { data: feedbackResp } = useGetFeedbacksQuery({});
  const feedbackData = useMemo(() => (feedbackResp?.data ?? []).map((f: any) => ({
    ...f,
    customer: f.customer || { name: "", phone: "", isVIP: false, totalVisits: 0, membershipLevel: "" },
    tags: f.tags || [],
    criteriaRatings: f.criteriaRatings || {},
    service: f.service ?? "",
    branch: f.branch ?? "",
    comment: f.comment ?? "",
    sentiment: f.sentiment ?? "neutral",
    responseStatus: f.responseStatus ?? "pending",
  })), [feedbackResp]);

  // إحصائيات شاملة
  const calculateAnalytics = () => {
    const totalFeedback = feedbackData.length;
    if (!totalFeedback) {
      return {
        totalFeedback: 0,
        overallRating: 0,
        npsScore: 0,
        positiveCount: 0,
        negativeCount: 0,
        neutralCount: 0,
        responseRate: 0,
        totalRevenue: 0,
        totalReferrals: 0,
      };
    }
    const overallRating = feedbackData.reduce((sum, f) => sum + (Number(f.overallRating) || 0), 0) / totalFeedback;
    const npsScore = feedbackData.reduce((sum, f) => sum + (Number(f.npsScore) || 0), 0) / totalFeedback;
    
    const positiveCount = feedbackData.filter((f: any) => f.sentiment === 'positive').length;
    const negativeCount = feedbackData.filter((f: any) => f.sentiment === 'negative').length;
    const neutralCount = feedbackData.filter((f: any) => f.sentiment === 'neutral').length;
    
    const respondedCount = feedbackData.filter((f: any) => f.responseStatus === 'responded').length;
    const responseRate = (respondedCount / totalFeedback) * 100;
    const totalRevenue = feedbackData.reduce((sum: number, f: any) => sum + (Number(f.revenue) || 0), 0);
    const totalReferrals = feedbackData.reduce((sum: number, f: any) => sum + (Number(f.referrals) || 0), 0);
    
    return {
      totalFeedback,
      overallRating,
      npsScore,
      positiveCount,
      negativeCount,
      neutralCount,
      responseRate,
      totalRevenue,
      totalReferrals
    };
  };

  const analytics = useMemo(() => calculateAnalytics(), [feedbackData]);

  // Helper functions
  const getSourceIcon = (source: string) => {
    const sourceData = feedbackSources.find(s => s.key === source);
    if (!sourceData) return <Monitor className="w-4 h-4" />;
    const IconComponent = sourceData.icon;
    return <IconComponent className="w-4 h-4" />;
  };

  const getSourceBadge = (source: string) => {
    const sourceData = feedbackSources.find(s => s.key === source);
    if (!sourceData) return <Badge variant="outline">غير محدد</Badge>;
    return (
      <Badge className={`${sourceData.color} border-0`}>
        {sourceData.name}
      </Badge>
    );
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <Smile className="w-4 h-4 text-green-500" />;
      case 'negative': return <Frown className="w-4 h-4 text-red-500" />;
      case 'neutral': return <Meh className="w-4 h-4 text-yellow-500" />;
      default: return <Meh className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-700 border-red-200">عالية</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">متوسطة</Badge>;
      case 'normal':
        return <Badge className="bg-green-100 text-green-700 border-green-200">عادية</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const [updateFeedback] = useUpdateFeedbackMutation();
  const handleResponse = (feedbackId: number) => {
    const feedback = feedbackData.find((f: any) => f.id === feedbackId);
    setSelectedFeedback(feedback);
    setShowResponseDialog(true);
  };

  const handleSendResponse = async () => {
    if (selectedFeedback?.id) {
      await updateFeedback({ id: selectedFeedback.id, responseStatus: 'responded', responseDate: new Date().toISOString() });
    }
    toast({
      title: "تم إرسال الرد",
      description: "تم إرسال ردكم للعميل بنجاح وسيتم إشعاره عبر الوسيلة المفضلة",
    });
    setShowResponseDialog(false);
    setSelectedFeedback(null);
  };

  const handleViewDetails = (feedbackId: number) => {
    const feedback = feedbackData.find((f: any) => f.id === feedbackId);
    if (feedback) {
      toast({
        title: "عرض تفاصيل التقييم",
        description: `تفاصيل تقييم العميل: ${feedback.customer.name}`,
      });
    }
  };

  const handleFollowUp = async (feedbackId: number) => {
    const feedback = feedbackData.find((f: any) => f.id === feedbackId);
    if (feedback) {
      await updateFeedback({ id: feedback.id, followUpRequired: false });
      toast({
        title: "تم إنشاء تذكرة متابعة",
        description: `تم إنشاء تذكرة متابعة للعميل: ${feedback.customer.name}`,
      });
    }
  };

  const handleExportData = () => {
    toast({
      title: "تصدير البيانات",
      description: "جاري تحضير ملف Excel بتقييمات العملاء...",
    });
  };

  const handleSendSurvey = () => {
    setShowSurveyDialog(true);
  };

  // دالة لإضافة استبيان جديد
  const addSurvey = (newSurvey: any) => {
    setSurveys(prev => [...prev, newSurvey]);
    toast({
      title: "تم إنشاء الاستبيان",
      description: `تم إنشاء استبيان "${newSurvey.title}" بنجاح وسيتم إرساله للعملاء المستهدفين`,
    });
  };

  const handleAdvancedAnalytics = () => {
    setShowAnalyticsDialog(true);
  };

  const handleSaveSettings = () => {
    toast({
      title: "تم حفظ الإعدادات",
      description: "تم حفظ إعدادات نظام التقييم بنجاح",
    });
    setShowSettingsDialog(false);
  };

  const handleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
    toast({
      title: autoRefresh ? "تم إيقاف التحديث التلقائي" : "تم تفعيل التحديث التلقائي",
      description: autoRefresh ? "سيتم التحديث يدوياً فقط" : "سيتم تحديث البيانات كل 30 ثانية",
    });
  };

  // Filtered data
  const filteredFeedback = feedbackData.filter((feedback: any) => {
    const name = feedback?.customer?.name ?? "";
    const comment = feedback?.comment ?? "";
    const serviceVal = feedback?.service ?? "";
    const matchesSearch = name.includes(searchTerm) || comment.includes(searchTerm) || serviceVal.includes(searchTerm);
    const matchesSource = filterSource === "all" || feedback.source === filterSource;
    const matchesRating = filterRating === "all" || String(feedback.overallRating) === filterRating;
    const matchesBranch = filterBranch === "all" || feedback.branch === filterBranch;
    return matchesSearch && matchesSource && matchesRating && matchesBranch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              تقييمات العملاء الذكية
            </h1>
            <p className="text-gray-600 flex items-center gap-2">
              <Brain className="w-4 h-4 text-blue-500" />
              منصة شاملة لإدارة وتحليل آراء العملاء وتحسين جودة الخدمة
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={handleExportData}
            >
              <Download className="w-4 h-4 mr-2" />
              تصدير البيانات
            </Button>
            <Button 
              variant="outline"
              onClick={handleAdvancedAnalytics}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              التحليلات المتقدمة
            </Button>
            <Button 
              variant="outline"
              onClick={() => setShowSettingsDialog(true)}
            >
              <Settings className="w-4 h-4 mr-2" />
              إعدادات النظام
            </Button>
            <Button 
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              onClick={handleSendSurvey}
            >
              <Send className="w-4 h-4 mr-2" />
              إنشاء استبيان جديد
            </Button>
          </div>
        </div>

        {/* Main Tabs Navigation */}
        <Card>
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5 h-14 bg-gradient-to-r from-blue-50 to-purple-50">
                <TabsTrigger 
                  value="overview" 
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  نظرة عامة
                </TabsTrigger>
                <TabsTrigger 
                  value="reviews" 
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  التقييمات المفصلة
                </TabsTrigger>
                <TabsTrigger 
                  value="analytics" 
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-2"
                >
                  <Activity className="w-4 h-4" />
                  التحليلات المتقدمة
                </TabsTrigger>
                <TabsTrigger 
                  value="reports" 
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  التقارير
                </TabsTrigger>
                <TabsTrigger 
                  value="settings" 
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  الإعدادات
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6 p-6">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-yellow-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">متوسط التقييم العام</CardTitle>
                      <Star className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{analytics.overallRating.toFixed(1)}/5</div>
                      <div className="flex items-center gap-1 mt-1">
                        {getRatingStars(Math.round(analytics.overallRating))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        من {analytics.totalFeedback} تقييم
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">مؤشر NPS</CardTitle>
                      <Target className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{analytics.npsScore.toFixed(1)}</div>
                      <Progress value={analytics.npsScore * 10} className="h-2 mt-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        صافي نقاط التوصية
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">معدل الاستجابة</CardTitle>
                      <Reply className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{analytics.responseRate.toFixed(1)}%</div>
                      <Progress value={analytics.responseRate} className="h-2 mt-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        تم الرد على التقييمات
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">التأثير على الإيرادات</CardTitle>
                      <TrendingUp className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{analytics.totalRevenue.toLocaleString()} جنيه مصري</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {analytics.totalReferrals} إحالة جديدة
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Sentiment Analysis */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-green-600">
                        <Smile className="w-5 h-5" />
                        تقييمات إيجابية
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-600">{analytics.positiveCount}</div>
                      <Progress value={(analytics.positiveCount / analytics.totalFeedback) * 100} className="h-3 mt-2" />
                      <p className="text-sm text-muted-foreground mt-2">
                        {((analytics.positiveCount / analytics.totalFeedback) * 100).toFixed(1)}% من إجمالي التقييمات
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-yellow-600">
                        <Meh className="w-5 h-5" />
                        تقييمات محايدة
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-yellow-600">{analytics.neutralCount}</div>
                      <Progress value={(analytics.neutralCount / analytics.totalFeedback) * 100} className="h-3 mt-2" />
                      <p className="text-sm text-muted-foreground mt-2">
                        {((analytics.neutralCount / analytics.totalFeedback) * 100).toFixed(1)}% من إجمالي التقييمات
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-red-600">
                        <Frown className="w-5 h-5" />
                        تقييمات سلبية
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-red-600">{analytics.negativeCount}</div>
                      <Progress value={(analytics.negativeCount / analytics.totalFeedback) * 100} className="h-3 mt-2" />
                      <p className="text-sm text-muted-foreground mt-2">
                        {((analytics.negativeCount / analytics.totalFeedback) * 100).toFixed(1)}% من إجمالي التقييمات
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Feedback Sources */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-blue-500" />
                      مصادر التقييمات
                    </CardTitle>
                    <CardDescription>
                      توزيع التقييمات حسب القنوات المختلفة
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                      {feedbackSources.map((source) => {
                        const count = feedbackData.filter(f => f.source === source.key).length;
                        const percentage = (count / feedbackData.length) * 100;
                        const IconComponent = source.icon;
                        
                        return (
                          <div key={source.key} className="text-center space-y-2">
                            <div className={`w-12 h-12 rounded-lg ${source.color} flex items-center justify-center mx-auto`}>
                              <IconComponent className="w-6 h-6" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{source.name}</p>
                              <p className="text-2xl font-bold">{count}</p>
                              <p className="text-xs text-muted-foreground">{percentage.toFixed(1)}%</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-4">
                  <Button 
                    variant="outline"
                    onClick={handleExportData}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    تصدير البيانات
                  </Button>
                  <Button 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                    onClick={handleSendSurvey}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    إنشاء استبيان جديد
                  </Button>
                </div>
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="space-y-6 p-6">
                {/* Filters and Search */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row gap-4">
                      <div className="relative flex-1">
                        <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="البحث في التقييمات والتعليقات والعملاء..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pr-10"
                        />
                      </div>
                      
                      <Select value={filterSource} onValueChange={setFilterSource}>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="مصدر التقييم" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border shadow-lg z-50">
                          <SelectItem value="all">جميع المصادر</SelectItem>
                          {feedbackSources.map((source) => (
                            <SelectItem key={source.key} value={source.key}>
                              {source.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select value={filterRating} onValueChange={setFilterRating}>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="التقييم" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border shadow-lg z-50">
                          <SelectItem value="all">جميع التقييمات</SelectItem>
                          <SelectItem value="5">5 نجوم</SelectItem>
                          <SelectItem value="4">4 نجوم</SelectItem>
                          <SelectItem value="3">3 نجوم</SelectItem>
                          <SelectItem value="2">2 نجوم</SelectItem>
                          <SelectItem value="1">1 نجمة</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={filterBranch} onValueChange={setFilterBranch}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="الفرع" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border shadow-lg z-50">
                          <SelectItem value="all">جميع الفروع</SelectItem>
                          <SelectItem value="الفرع الرئيسي">الفرع الرئيسي</SelectItem>
                          <SelectItem value="فرع الشمال">فرع الشمال</SelectItem>
                          <SelectItem value="فرع الجنوب">فرع الجنوب</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button variant="outline" size="icon" onClick={() => {
                        setSearchTerm("");
                        setFilterSource("all");
                        setFilterRating("all");
                        setFilterBranch("all");
                      }}>
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Feedback Cards */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      التقييمات المفصلة ({filteredFeedback.length} من {feedbackData.length})
                    </h3>
                  </div>
                  
                  <ScrollArea className="h-[600px]">
                    <div className="space-y-4">
                      {filteredFeedback.map((feedback) => (
                        <Card key={feedback.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex flex-col lg:flex-row gap-6">
                              {/* Customer Info */}
                              <div className="flex-1 space-y-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                      {feedback.customer.name.charAt(0)}
                                    </div>
                                    <div>
                                      <h4 className="font-semibold text-lg">{feedback.customer.name}</h4>
                                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Phone className="w-3 h-3" />
                                        {feedback.customer.phone}
                                        {feedback.customer.isVIP && (
                                          <Badge className="bg-yellow-100 text-yellow-800 ml-2">VIP</Badge>
                                        )}
                                        <Badge variant="outline" className="ml-2">
                                          {feedback.customer.membershipLevel}
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-2">
                                    {getSourceBadge(feedback.source)}
                                    {getPriorityBadge(feedback.priority)}
                                  </div>
                                </div>

                                {/* Service Details */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                    <div>
                                      <Label className="text-muted-foreground">الخدمة</Label>
                                      <p className="font-medium">{feedback.service}</p>
                                    </div>
                                    <div>
                                      <Label className="text-muted-foreground">الفرع</Label>
                                      <p className="font-medium">{feedback.branch}</p>
                                    </div>
                                    <div>
                                      <Label className="text-muted-foreground">التاريخ</Label>
                                      <p className="font-medium">
                                        {new Date(feedback.date).toLocaleString('ar-SA')}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* Overall Rating */}
                                <div className="flex items-center gap-4">
                                  <div className="flex items-center gap-2">
                                    <span className="text-lg font-bold">{feedback.overallRating}</span>
                                    <div className="flex items-center gap-1">
                                      {getRatingStars(feedback.overallRating)}
                                    </div>
                                  </div>
                                  {getSentimentIcon(feedback.sentiment)}
                                  <Badge className="bg-blue-100 text-blue-700">
                                    NPS: {feedback.npsScore}
                                  </Badge>
                                </div>

                                {/* Criteria Ratings */}
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium">تفاصيل التقييم:</Label>
                                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                                    {evaluationCriteria.map((criteria) => {
                                      const rating = feedback.criteriaRatings[criteria.key];
                                      const IconComponent = criteria.icon;
                                      return (
                                        <div key={criteria.key} className="flex items-center gap-2">
                                          <IconComponent className={`w-4 h-4 ${criteria.color}`} />
                                          <span className="text-sm">{criteria.name}:</span>
                                          <div className="flex items-center gap-1">
                                            {Array.from({ length: rating }, (_, i) => (
                                              <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                                            ))}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>

                                {/* Comment */}
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium">التعليق:</Label>
                                  <p className="text-sm bg-white p-3 rounded-lg border">
                                    "{feedback.comment}"
                                  </p>
                                </div>

                                {/* Tags */}
                                {feedback.tags && feedback.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-2">
                                    {feedback.tags.map((tag, index) => (
                                      <Badge key={index} variant="outline" className="text-xs">
                                        #{tag}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Actions */}
                              <div className="space-y-3 lg:w-48">
                                <Button 
                                  className="w-full" 
                                  onClick={() => handleResponse(feedback.id)}
                                  disabled={feedback.responseStatus === 'responded'}
                                >
                                  <Reply className="w-4 h-4 mr-2" />
                                  {feedback.responseStatus === 'responded' ? 'تم الرد' : 'رد على العميل'}
                                </Button>
                                
                                <Button 
                                  variant="outline" 
                                  className="w-full"
                                  onClick={() => handleViewDetails(feedback.id)}
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  عرض التفاصيل
                                </Button>
                                
                                {feedback.followUpRequired && (
                                  <Button 
                                    variant="outline" 
                                    className="w-full text-red-600 border-red-200"
                                    onClick={() => handleFollowUp(feedback.id)}
                                  >
                                    <AlertTriangle className="w-4 h-4 mr-2" />
                                    متابعة فورية
                                  </Button>
                                )}
                                
                                <div className="text-xs text-muted-foreground space-y-1 pt-2">
                                  <p>الإيرادات: {feedback.revenue} جنيه مصري</p>
                                  {feedback.referrals && feedback.referrals > 0 && (
                                    <p>الإحالات: {feedback.referrals}</p>
                                  )}
                                  <p>الزيارات: {feedback.customer.totalVisits}</p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-6 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">اتجاه التقييمات الشهرية</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 flex items-center justify-center text-muted-foreground">
                        <div className="text-center">
                          <BarChart3 className="w-16 h-16 mx-auto mb-2" />
                          <p>رسم بياني لاتجاه التقييمات</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">توزيع المشاعر</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 flex items-center justify-center text-muted-foreground">
                        <div className="text-center">
                          <PieChart className="w-16 h-16 mx-auto mb-2" />
                          <p>توزيع دائري للمشاعر</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">مقارنة الفروع</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['الفرع الرئيسي', 'فرع الشمال', 'فرع الجنوب'].map((branch) => (
                      <Card key={branch}>
                        <CardHeader>
                          <CardTitle className="text-base">{branch}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>متوسط التقييم</span>
                              <span className="font-bold">4.2/5</span>
                            </div>
                            <div className="flex justify-between">
                              <span>عدد التقييمات</span>
                              <span className="font-bold">156</span>
                            </div>
                            <div className="flex justify-between">
                              <span>معدل الاستجابة</span>
                              <span className="font-bold">89%</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Reports Tab */}
              <TabsContent value="reports" className="space-y-6 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">تقرير التقييمات الشهري</h3>
                          <p className="text-sm text-muted-foreground">تحليل شامل للتقييمات خلال الشهر</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <TrendingUp className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">تقرير الأداء بالفروع</h3>
                          <p className="text-sm text-muted-foreground">مقارنة أداء الفروع المختلفة</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Users className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">تقرير رضا العملاء</h3>
                          <p className="text-sm text-muted-foreground">مستوى رضا العملاء وتوصياتهم</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                          <AlertTriangle className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">تقرير الشكاوى والمتابعة</h3>
                          <p className="text-sm text-muted-foreground">الشكاوى وحالة المتابعة</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                          <Target className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">تقرير مؤشر NPS</h3>
                          <p className="text-sm text-muted-foreground">صافي نقاط التوصية وتحليلها</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <Activity className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">تقرير التحليل الذكي</h3>
                          <p className="text-sm text-muted-foreground">تحليل ذكي بالذكاء الاصطناعي</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex gap-4">
                  <Button onClick={handleExportData} className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    تصدير جميع التقارير
                  </Button>
                  <Button variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    جدولة التقارير
                  </Button>
                </div>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-6 p-6">
                <Tabs defaultValue="collection" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="collection">طرق الجمع</TabsTrigger>
                    <TabsTrigger value="analysis">التحليل</TabsTrigger>
                    <TabsTrigger value="automation">الأتمتة</TabsTrigger>
                    <TabsTrigger value="notifications">الإشعارات</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="collection" className="space-y-4">
                    <div className="space-y-4">
                      <h4 className="font-medium">تفعيل مصادر التقييم:</h4>
                      {feedbackSources.map((source) => {
                        const IconComponent = source.icon;
                        return (
                          <div key={source.key} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <IconComponent className="w-5 h-5" />
                              <span>{source.name}</span>
                            </div>
                            <Switch defaultChecked />
                          </div>
                        );
                      })}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="analysis" className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>تحليل المشاعر التلقائي</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>استخراج الكلمات المفتاحية</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>تصنيف التقييمات التلقائي</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>حساب مؤشر NPS</Label>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="automation" className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>إرسال شكر تلقائي للتقييمات الإيجابية</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>تنبيه فوري للتقييمات السلبية</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>إنشاء تذكرة متابعة للشكاوى</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>مكافآت الولاء للتقييمات المتكررة</Label>
                        <Switch />
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="notifications" className="space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>إشعار الإدارة عند تقييم أقل من:</Label>
                        <Select defaultValue="3">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white border shadow-lg z-50">
                            <SelectItem value="2">2 نجوم</SelectItem>
                            <SelectItem value="3">3 نجوم</SelectItem>
                            <SelectItem value="4">4 نجوم</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label>إشعارات البريد الإلكتروني</Label>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label>إشعارات الهاتف الجوال</Label>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="flex gap-2">
                  <Button className="flex-1" onClick={handleSaveSettings}>
                    <Settings className="w-4 h-4 mr-2" />
                    حفظ الإعدادات
                  </Button>
                  <Button variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    إعادة تعيين
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Response Dialog */}
        <Dialog open={showResponseDialog} onOpenChange={setShowResponseDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>الرد على تقييم العميل</DialogTitle>
              <DialogDescription>
                إرسال رد مخصص للعميل: {selectedFeedback?.customer.name}
              </DialogDescription>
            </DialogHeader>
            
            {selectedFeedback && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium mb-2">تقييم العميل:</p>
                  <div className="flex items-center gap-2 mb-2">
                    {getRatingStars(selectedFeedback.overallRating)}
                    <span className="text-sm">({selectedFeedback.overallRating}/5)</span>
                  </div>
                  <p className="text-sm">"{selectedFeedback.comment}"</p>
                </div>
                
                <div className="space-y-2">
                  <Label>ردكم على العميل:</Label>
                  <Textarea 
                    placeholder="اكتب ردكم المخصص للعميل هنا..."
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>إجراءات إضافية:</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="follow-up" />
                      <Label htmlFor="follow-up" className="text-sm">
                        إضافة العميل لقائمة المتابعة الخاصة
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="discount" />
                      <Label htmlFor="discount" className="text-sm">
                        إرسال كوبون خصم تعويضي
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="escalate" />
                      <Label htmlFor="escalate" className="text-sm">
                        تصعيد للإدارة العليا
                      </Label>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={handleSendResponse} className="flex-1">
                    <Send className="w-4 h-4 mr-2" />
                    إرسال الرد
                  </Button>
                  <Button variant="outline" onClick={() => setShowResponseDialog(false)}>
                    إلغاء
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Survey Creation Dialog */}
        <SurveyCreationDialog
          open={showSurveyDialog}
          onOpenChange={setShowSurveyDialog}
          onSurveyCreated={addSurvey}
        />

        {/* Advanced Analytics Dialog */}
        <Dialog open={showAnalyticsDialog} onOpenChange={setShowAnalyticsDialog}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>التحليلات المتقدمة لتقييمات العملاء</DialogTitle>
              <DialogDescription>
                تحليل شامل ومتقدم لأداء الخدمات ورضا العملاء
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="trends" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="trends">الاتجاهات</TabsTrigger>
                <TabsTrigger value="comparison">المقارنات</TabsTrigger>
                <TabsTrigger value="predictions">التوقعات</TabsTrigger>
                <TabsTrigger value="recommendations">التوصيات</TabsTrigger>
              </TabsList>
              
              <TabsContent value="trends" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">اتجاه التقييمات الشهرية</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 flex items-center justify-center text-muted-foreground">
                        <div className="text-center">
                          <BarChart3 className="w-16 h-16 mx-auto mb-2" />
                          <p>رسم بياني لاتجاه التقييمات</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">توزيع المشاعر</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 flex items-center justify-center text-muted-foreground">
                        <div className="text-center">
                          <PieChart className="w-16 h-16 mx-auto mb-2" />
                          <p>توزيع دائري للمشاعر</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="comparison" className="space-y-4">
                <div className="space-y-4">
                  <h4 className="font-medium">مقارنة الفروع</h4>
                  {(() => {
                    const groups: Record<string, any[]> = {};
                    feedbackData.forEach((f: any) => {
                      const b = f.branch || "غير محدد";
                      if (!groups[b]) groups[b] = [];
                      groups[b].push(f);
                    });
                    const entries = Object.entries(groups);
                    return (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {entries.map(([branch, list]) => {
                          const total = list.length;
                          const avg = total ? list.reduce((s: number, f: any) => s + (Number(f.overallRating) || 0), 0) / total : 0;
                          const responded = list.filter((f: any) => f.responseStatus === 'responded').length;
                          const rate = total ? (responded / total) * 100 : 0;
                          return (
                            <Card key={branch}>
                              <CardHeader>
                                <CardTitle className="text-base">{branch}</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span>متوسط التقييم</span>
                                    <span className="font-bold">{avg.toFixed(1)}/5</span>
                                  </div>
                                  <div className="flex justifyBetween">
                                    <span>عدد التقييمات</span>
                                    <span className="font-bold">{total}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>معدل الاستجابة</span>
                                    <span className="font-bold">{rate.toFixed(0)}%</span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              </TabsContent>
              
              <TabsContent value="predictions" className="space-y-4">
                <div className="space-y-4">
                  <Alert>
                    <Brain className="h-4 w-4" />
                    <AlertDescription>
                      <Label className="font-medium">تحليل ذكي بالذكاء الاصطناعي</Label>
                      <p className="text-sm mt-1">
                        بناءً على البيانات الحالية، نتوقع:
                      </p>
                    </AlertDescription>
                  </Alert>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <TrendingUp className="w-8 h-8 text-green-500" />
                          <div>
                            <p className="font-medium">تحسن التقييمات</p>
                            <p className="text-sm text-muted-foreground">
                              زيادة متوقعة بنسبة 12% الشهر القادم
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Target className="w-8 h-8 text-blue-500" />
                          <div>
                            <p className="font-medium">هدف NPS</p>
                            <p className="text-sm text-muted-foreground">
                              قابل للوصول إلى 8.5 خلال 3 أشهر
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="recommendations" className="space-y-4">
                <div className="space-y-4">
                  <h4 className="font-medium">التوصيات الذكية</h4>
                  
                  <div className="space-y-3">
                    {[
                      {
                        icon: <Lightbulb className="w-5 h-5 text-yellow-500" />,
                        title: "تحسين وقت الانتظار",
                        description: "67% من التقييمات السلبية تشير لطول وقت الانتظار",
                        action: "زيادة عدد المحطات في الفرع الشمالي"
                      },
                      {
                        icon: <Users className="w-5 h-5 text-blue-500" />,
                        title: "تدريب الموظفين",
                        description: "تحسين تفاعل الموظفين يمكن أن يرفع التقييم بـ 0.8 نقطة",
                        action: "برنامج تدريبي لمهارات التواصل"
                      },
                      {
                        icon: <Gift className="w-5 h-5 text-purple-500" />,
                        title: "برنامج ولاء",
                        description: "العملاء المخلصون يقدمون تقييمات أفضل بـ 40%",
                        action: "تطوير نظام مكافآت متقدم"
                      }
                    ].map((rec, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            {rec.icon}
                            <div className="flex-1">
                              <h5 className="font-medium">{rec.title}</h5>
                              <p className="text-sm text-muted-foreground mb-2">
                                {rec.description}
                              </p>
                              <p className="text-sm font-medium text-blue-600">
                                إجراء مقترح: {rec.action}
                              </p>
                            </div>
                            <Button size="sm" variant="outline">
                              تطبيق
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex gap-2">
              <Button className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                تصدير التحليلات
              </Button>
              <Button variant="outline" onClick={() => setShowAnalyticsDialog(false)}>
                إغلاق
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Customer Feedback Settings Dialog */}
        <CustomerFeedbackSettingsDialog 
          open={showSettingsDialog} 
          onOpenChange={setShowSettingsDialog}
        />
      </div>
    </div>
  );
}
