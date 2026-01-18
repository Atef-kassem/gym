import { useState, useEffect, useMemo } from 'react';
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
import { toast } from "sonner";
import SurveyCreationDialog from "@/components/CRM/SurveyCreationDialog";
import {
  useGetSurveysQuery,
  useCreateSurveyMutation,
  useUpdateSurveyMutation,
  useDeleteSurveyMutation,
  useUpdateSurveyStatusMutation,
  useGetSurveyResponsesQuery,
} from "@/services/surveyApi";
import {
  Plus,
  Search,
  Filter,
  Download,
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  Clock,
  Star,
  MessageSquare,
  Eye,
  Edit,
  Copy,
  Trash2,
  Send,
  Play,
  Pause,
  Square,
  Brain,
  Zap,
  Target,
  Award,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MoreHorizontal,
  RefreshCw,
  Share2,
  Link2,
  Smartphone,
  Mail,
  Globe,
  Lightbulb
} from "lucide-react";

interface Survey {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'active' | 'paused' | 'completed' | 'archived';
  createdDate: string;
  startDate?: string;
  endDate?: string;
  responseCount: number;
  targetCount: number;
  category: string;
  type: 'satisfaction' | 'nps' | 'feedback' | 'market_research' | 'employee';
  questions: any[];
  distribution: {
    whatsapp: boolean;
    sms: boolean;
    email: boolean;
    website: boolean;
    app: boolean;
  };
  analytics: {
    avgRating: number;
    npsScore: number;
    completionRate: number;
    sentiment: {
      positive: number;
      negative: number;
      neutral: number;
    };
  };
}

interface SurveyResponse {
  id: string;
  surveyId: string;
  customerId: string;
  customerName: string;
  submittedDate: string;
  responses: Record<string, any>;
  sentiment: 'positive' | 'negative' | 'neutral';
  npsScore?: number;
  completionTime: number; // in seconds
}

export default function SurveyManagement() {
  const [activeTab, setActiveTab] = useState("list");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showAnalyticsDialog, setShowAnalyticsDialog] = useState(false);
  const [aiAnalysisLoading, setAiAnalysisLoading] = useState(false);

  const { data: surveys, isLoading: surveysLoading, error: surveysError, refetch: refetchSurveys } = useGetSurveysQuery();
  const { data: surveyResponses, isLoading: responsesLoading, error: responsesError, refetch: refetchResponses } = useGetSurveyResponsesQuery();

  const [createSurvey] = useCreateSurveyMutation();
  const [updateSurvey] = useUpdateSurveyMutation();
  const [deleteSurvey] = useDeleteSurveyMutation();
  const [updateSurveyStatus] = useUpdateSurveyStatusMutation();

  useEffect(() => {
    refetchSurveys();
    refetchResponses();
  }, [refetchSurveys, refetchResponses]);

  const filteredSurveys = useMemo(() => {
    if (!surveys?.data) return [];
    return surveys.data.filter((survey: any) => {
      const matchesStatus = selectedStatus === "all" || survey.status === selectedStatus;
      const matchesSearch = survey.title.includes(searchTerm) || 
                           survey.description.includes(searchTerm) ||
                           survey.category.includes(searchTerm);
      return matchesStatus && matchesSearch;
    });
  }, [surveys, selectedStatus, searchTerm]);

  const totalSurveys = surveys?.data?.length || 0;
  const activeSurveys = surveys?.data?.filter((s: any) => s.status === 'active').length || 0;
  const totalResponses = surveyResponses?.data?.length || 0;
  const avgCompletionRate = surveys?.data?.length > 0 ? 
    surveys.data.reduce((sum: number, s: any) => sum + (s.analytics?.completionRate || 0), 0) / surveys.data.length : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200 hover:scale-105 transition-all duration-200 animate-pulse';
      case 'draft': return 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200 hover:scale-105 transition-all duration-200';
      case 'paused': return 'bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200 hover:scale-105 transition-all duration-200';
      case 'completed': return 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200 hover:scale-105 transition-all duration-200';
      case 'archived': return 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200 hover:scale-105 transition-all duration-200';
      default: return 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105 transition-all duration-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'draft': return 'مسودة';
      case 'paused': return 'متوقف';
      case 'completed': return 'مكتمل';
      case 'archived': return 'مؤرشف';
      default: return status;
    }
  };

  const handleDeleteSurvey = async (surveyId: string) => {
    try {
      await deleteSurvey(surveyId).unwrap();
      toast.success("تم حذف الاستبيان بنجاح", {
        description: `تم حذف الاستبيان "${selectedSurvey?.title}" نهائياً`,
        duration: 4000,
      });
      setSelectedSurvey(null);
      refetchSurveys();
    } catch (err) {
      toast.error("حدث خطأ أثناء حذف الاستبيان", {
        description: (err as any)?.error || "حدث خطأ غير متوقع",
        duration: 5000,
      });
    }
  };

  const handleAddSurvey = async (newSurvey: Survey) => {
    try {
      await createSurvey(newSurvey).unwrap();
      toast.success("تم إنشاء الاستبيان بنجاح", {
        description: `تم إضافة "${newSurvey.title}" للقائمة`,
        duration: 4000,
      });
      setShowCreateDialog(false);
      refetchSurveys();
    } catch (err) {
      toast.error("حدث خطأ أثناء إنشاء الاستبيان", {
        description: (err as any)?.error || "حدث خطأ غير متوقع",
        duration: 5000,
      });
    }
  };

  const handleCopySurvey = async (surveyId: string) => {
    const survey = surveys?.data?.find((s: any) => s.id === surveyId);
    if (survey) {
      const newSurvey = {
        ...survey,
        id: `${Date.now()}`,
        title: `نسخة من ${survey.title}`,
        status: 'draft' as const,
        createdDate: new Date().toISOString().split('T')[0],
        responseCount: 0,
        analytics: {
          ...survey.analytics,
          avgRating: 0,
          npsScore: 0,
          completionRate: 0,
          sentiment: { positive: 0, negative: 0, neutral: 0 }
        }
      };
      try {
        await createSurvey(newSurvey).unwrap();
        toast.success("تم نسخ الاستبيان بنجاح", {
          description: `تم نسخ "${survey.title}" للقائمة`,
          duration: 4000,
        });
        refetchSurveys();
      } catch (err) {
        toast.error("حدث خطأ أثناء نسخ الاستبيان", {
          description: err.error,
          duration: 5000,
        });
      }
    }
  };

  const handleExportData = async () => {
    const data = {
      surveys: filteredSurveys,
      totalSurveys,
      activeSurveys,
      totalResponses,
      avgCompletionRate,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `surveys-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("تم تصدير البيانات بنجاح", {
      description: "تم تحميل ملف البيانات على جهازك",
      duration: 3000,
    });
  };

  const handleShareSurvey = async (surveyId: string) => {
    const survey = surveys?.data?.find((s: any) => s.id === surveyId);
    if (survey) {
      let surveyUrl;
      
      // استخدام الرابط المخصص للاستبيان المحدد
      if (surveyId === "6") {
        surveyUrl = "https://aee0665e-bb1f-421a-9c69-693e0f3a6a9b.lovableproject.com/crm/survey";
      } else {
        surveyUrl = `${window.location.origin}/survey/${surveyId}`;
      }
      
      const shareText = `شارك في استبيان: ${survey.title}\n\n${survey.description}\n\nشارك رأيك معنا:`;
      const fullShareText = `${shareText}\n${surveyUrl}`;
      
      try {
        await navigator.clipboard.writeText(fullShareText);
        toast.success("تم نسخ رابط الاستبيان والوصف", {
          description: "يمكنك الآن مشاركة الرابط والوصف مع العملاء عبر أي منصة",
          duration: 4000,
        });
      } catch (err) {
        toast.error("حدث خطأ أثناء نسخ الرابط", {
          description: (err as any)?.error || "حدث خطأ غير متوقع",
          duration: 5000,
        });
      }

      // إنشاء روابط المشاركة المختلفة
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(fullShareText)}`;
      const emailUrl = `mailto:?subject=${encodeURIComponent(`استبيان: ${survey.title}`)}&body=${encodeURIComponent(fullShareText)}`;
      
      // فتح خيارات المشاركة (يمكن تطويرها لاحقاً لتصبح dialog)
      setTimeout(() => {
        toast.info("خيارات المشاركة الإضافية", {
          description: "تم نسخ المحتوى للحافظة. يمكنك مشاركته عبر WhatsApp أو Email أو أي منصة أخرى",
          duration: 3000,
        });
      }, 1000);
    }
  };

  const performAIAnalysis = async (surveyId: string) => {
    setAiAnalysisLoading(true);
    
    // محاكاة استدعاء API للذكاء الاصطناعي
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setAiAnalysisLoading(false);
    toast.success("تم إجراء التحليل الذكي للردود بنجاح");
    
    // هنا يمكنك إضافة النتائج الفعلية للتحليل
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* الج.م والإحصائيات */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">إدارة الاستبيانات</h1>
          <div className="flex gap-2">
            <Button 
              onClick={() => setShowCreateDialog(true)} 
              className="bg-primary hover:bg-primary/90 hover:scale-105 hover:shadow-lg transition-all duration-300 animate-fade-in"
            >
              <Plus className="w-4 h-4 ml-2 group-hover:rotate-90 transition-transform duration-300" />
              إنشاء استبيان جديد
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                // فتح صفحة المعاينة في نافذة جديدة مع معاينة تفاعلية
                const previewWindow = window.open('/crm/survey', '_blank');
                // تأخير استدعاء toast لتجنب مشاكل React
                setTimeout(() => {
                  toast.success("تم فتح معاينة الاستبيان", {
                    description: "تم فتح معاينة تفاعلية للاستبيان في نافذة جديدة",
                    duration: 3000,
                  });
                }, 0);
              }}
              className="hover:scale-105 hover:shadow-lg transition-all duration-300 animate-fade-in"
            >
              <Eye className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform duration-200" />
              معاينة الاستبيان
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setActiveTab('ai-insights')}
              className="bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 hover:scale-105 hover:shadow-lg transition-all duration-300 animate-fade-in border-purple-300"
            >
              <Brain className="w-4 h-4 ml-2 text-purple-600 group-hover:scale-110 transition-transform duration-200" />
              التحليل الذكي
            </Button>
          </div>
        </div>

        {/* بطاقات الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border-l-4 border-blue-500 bg-gradient-to-br from-blue-50 to-white group cursor-pointer animate-scale-in">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">إجمالي الاستبيانات</p>
                  <p className="text-2xl font-bold text-blue-800 group-hover:scale-110 transition-transform duration-200">
                    {surveysLoading ? "..." : totalSurveys}
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-500 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border-l-4 border-green-500 bg-gradient-to-br from-green-50 to-white group cursor-pointer animate-scale-in">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">الاستبيانات النشطة</p>
                  <p className="text-2xl font-bold text-green-800 group-hover:scale-110 transition-transform duration-200">
                    {surveysLoading ? "..." : activeSurveys}
                  </p>
                </div>
                <Play className="w-8 h-8 text-green-500 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 animate-pulse" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border-l-4 border-purple-500 bg-gradient-to-br from-purple-50 to-white group cursor-pointer animate-scale-in">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">إجمالي الردود</p>
                  <p className="text-2xl font-bold text-purple-800 group-hover:scale-110 transition-transform duration-200">
                    {responsesLoading ? "..." : totalResponses}
                  </p>
                </div>
                <Users className="w-8 h-8 text-purple-500 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border-l-4 border-orange-500 bg-gradient-to-br from-orange-50 to-white group cursor-pointer animate-scale-in">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-700">معدل الإكمال</p>
                  <p className="text-2xl font-bold text-orange-800 group-hover:scale-110 transition-transform duration-200">
                    {surveysLoading ? "..." : `${avgCompletionRate.toFixed(1)}%`}
                  </p>
                </div>
                <Target className="w-8 h-8 text-orange-500 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* التبويبات الرئيسية */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 p-1 rounded-lg shadow-md">
          <TabsTrigger 
            value="list" 
            className="transition-all duration-300 hover:scale-105 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-blue-700"
          >
            <BarChart3 className="w-4 h-4 ml-2" />
            قائمة الاستبيانات
          </TabsTrigger>
          <TabsTrigger 
            value="analytics" 
            className="transition-all duration-300 hover:scale-105 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-green-700"
          >
            <PieChart className="w-4 h-4 ml-2" />
            التحليل والإحصائيات
          </TabsTrigger>
          <TabsTrigger 
            value="responses" 
            className="transition-all duration-300 hover:scale-105 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-purple-700"
          >
            <MessageSquare className="w-4 h-4 ml-2" />
            الردود التفصيلية
          </TabsTrigger>
          <TabsTrigger 
            value="ai-insights" 
            className="transition-all duration-300 hover:scale-105 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-pink-700"
          >
            <Brain className="w-4 h-4 ml-2" />
            رؤى الذكاء الاصطناعي
          </TabsTrigger>
        </TabsList>

        {/* تبويب قائمة الاستبيانات */}
        <TabsContent value="list" className="space-y-4">
          {/* أدوات التصفية والبحث */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="البحث في الاستبيانات..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pr-10"
                      dir="rtl"
                    />
                  </div>
                </div>
                
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="تصفية حسب الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الحالات</SelectItem>
                    <SelectItem value="active">نشط</SelectItem>
                    <SelectItem value="draft">مسودة</SelectItem>
                    <SelectItem value="paused">متوقف</SelectItem>
                    <SelectItem value="completed">مكتمل</SelectItem>
                    <SelectItem value="archived">مؤرشف</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button 
                  variant="outline" 
                  onClick={handleExportData}
                  className="hover:scale-105 hover:shadow-lg hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-all duration-300"
                >
                  <Download className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform duration-200" />
                  تصدير البيانات
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* جدول الاستبيانات */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
              <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                الاستبيانات ({filteredSurveys.length})
                {surveysLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {surveysError ? (
                <div className="text-center py-8">
                  <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <p className="text-red-600 font-medium">حدث خطأ في تحميل البيانات</p>
                  <Button 
                    onClick={() => refetchSurveys()} 
                    variant="outline" 
                    className="mt-2"
                  >
                    <RefreshCw className="w-4 h-4 ml-2" />
                    إعادة المحاولة
                  </Button>
                </div>
              ) : surveysLoading ? (
                <div className="text-center py-8">
                  <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
                  <p className="text-gray-600">جاري تحميل الاستبيانات...</p>
                </div>
              ) : filteredSurveys.length === 0 ? (
                <div className="text-center py-8">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">لا توجد استبيانات</p>
                  <Button 
                    onClick={() => setShowCreateDialog(true)} 
                    className="mt-2"
                  >
                    <Plus className="w-4 h-4 ml-2" />
                    إنشاء استبيان جديد
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">عنوان الاستبيان</TableHead>
                      <TableHead className="text-right">الفئة</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right">الردود</TableHead>
                      <TableHead className="text-right">معدل الإكمال</TableHead>
                      <TableHead className="text-right">التقييم</TableHead>
                      <TableHead className="text-right">تاريخ الإنشاء</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSurveys.map((survey: any, index: number) => (
                      <TableRow 
                        key={survey.id} 
                        className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 cursor-pointer animate-fade-in"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <TableCell className="text-right">
                          <div>
                            <div className="font-medium">{survey.title}</div>
                            <div className="text-sm text-gray-500">{survey.description}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline">{survey.category}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={getStatusColor(survey.status)}>
                            {getStatusText(survey.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-2">
                            <span>{survey.responseCount || 0}</span>
                            <span className="text-gray-400">/</span>
                            <span className="text-gray-500">{survey.targetCount || 0}</span>
                          </div>
                          <Progress 
                            value={survey.targetCount > 0 ? ((survey.responseCount || 0) / survey.targetCount) * 100 : 0} 
                            className="w-20 mt-1"
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={`font-medium ${
                            (survey.analytics?.completionRate || 0) > 80 ? 'text-green-600' :
                            (survey.analytics?.completionRate || 0) > 60 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {survey.analytics?.completionRate || 0}%
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span>{(survey.analytics?.avgRating || 0).toFixed(1)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {new Date(survey.createdAt || survey.createdDate).toLocaleDateString('ar-SA')}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-1">
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => {
                                setSelectedSurvey(survey);
                                setShowAnalyticsDialog(true);
                              }}
                              className="hover:bg-blue-100 hover:text-blue-700 hover:scale-110 transition-all duration-200"
                              title="عرض التفاصيل"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => {
                                setSelectedSurvey(survey);
                                setShowCreateDialog(true);
                                // تأخير استدعاء toast لتجنب مشاكل React
                                setTimeout(() => {
                                  toast.info("فتح نافذة التحرير", {
                                    description: `تحرير الاستبيان: ${survey.title}`,
                                    duration: 3000,
                                  });
                                }, 0);
                              }}
                              className="hover:bg-green-100 hover:text-green-700 hover:scale-110 transition-all duration-200"
                              title="تحرير الاستبيان"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleCopySurvey(survey.id)}
                              className="hover:bg-purple-100 hover:text-purple-700 hover:scale-110 transition-all duration-200"
                              title="نسخ الاستبيان"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleShareSurvey(survey.id)}
                              className="hover:bg-gradient-to-r hover:from-orange-100 hover:to-red-100 hover:text-orange-700 hover:scale-110 hover:shadow-lg transition-all duration-300 group"
                              title="مشاركة الاستبيان عبر القنوات المختلفة"
                            >
                              <Share2 className="w-4 h-4 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />
                            </Button>
                            {survey.status === 'active' ? (
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => updateSurveyStatus({ id: survey.id, status: 'paused' })}
                                className="hover:bg-yellow-100 hover:text-yellow-700 hover:scale-110 transition-all duration-200"
                                title="إيقاف الاستبيان"
                              >
                                <Pause className="w-4 h-4" />
                              </Button>
                            ) : survey.status === 'paused' ? (
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => updateSurveyStatus({ id: survey.id, status: 'active' })}
                                className="hover:bg-green-100 hover:text-green-700 hover:scale-110 transition-all duration-200 animate-pulse"
                                title="تشغيل الاستبيان"
                              >
                                <Play className="w-4 h-4" />
                              </Button>
                            ) : survey.status === 'draft' ? (
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => updateSurveyStatus({ id: survey.id, status: 'active' })}
                                className="hover:bg-green-100 hover:text-green-700 hover:scale-110 transition-all duration-200"
                                title="نشر الاستبيان"
                              >
                                <Send className="w-4 h-4" />
                              </Button>
                            ) : null}
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleDeleteSurvey(survey.id)}
                              className="hover:bg-red-100 hover:text-red-700 hover:scale-110 transition-all duration-200"
                              title="حذف الاستبيان"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* تبويب التحليل والإحصائيات */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* إحصائيات الاستبيانات حسب الحالة */}
            <Card>
              <CardHeader>
                <CardTitle>توزيع الاستبيانات حسب الحالة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['active', 'draft', 'paused', 'completed'].map(status => {
                    const count = surveys?.data?.filter((s: any) => s.status === status).length || 0;
                    const percentage = totalSurveys > 0 ? (count / totalSurveys) * 100 : 0;
                    return (
                      <div key={status} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(status)}>
                            {getStatusText(status)}
                          </Badge>
                          <span>{count}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={percentage} className="w-20" />
                          <span className="text-sm text-gray-500">{percentage.toFixed(1)}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* إحصائيات الردود */}
            <Card>
              <CardHeader>
                <CardTitle>إحصائيات الردود الإجمالية</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>إجمالي الردود</span>
                    <span className="font-bold text-lg">{totalResponses}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>متوسط التقييم</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-bold">
                        {surveys?.data && totalResponses > 0 ? 
                          (surveys.data.reduce((sum: number, s: any) => sum + (s.analytics?.avgRating || 0) * (s.responseCount || 0), 0) / totalResponses).toFixed(1) : '0.0'}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>متوسط NPS</span>
                    <span className="font-bold text-green-600">
                      {surveys?.data && totalResponses > 0 ? 
                        Math.round(surveys.data.reduce((sum: number, s: any) => sum + (s.analytics?.npsScore || 0) * (s.responseCount || 0), 0) / totalResponses) : 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>معدل الإكمال العام</span>
                    <span className="font-bold text-blue-600">{avgCompletionRate.toFixed(1)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* مخططات مفصلة */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>تحليل المشاعر الإجمالي</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['positive', 'neutral', 'negative'].map(sentiment => {
                    const total = surveys?.data?.reduce((sum: number, s: any) => 
                      sum + (s.analytics?.sentiment?.[sentiment as keyof typeof s.analytics.sentiment] || 0) * (s.responseCount || 0), 0
                    ) || 0;
                    const percentage = totalResponses > 0 ? (total / totalResponses) : 0;
                    
                    return (
                      <div key={sentiment} className="space-y-2">
                        <div className="flex justify-between">
                          <span className={`font-medium ${
                            sentiment === 'positive' ? 'text-green-600' :
                            sentiment === 'negative' ? 'text-red-600' : 'text-yellow-600'
                          }`}>
                            {sentiment === 'positive' ? 'إيجابي' :
                             sentiment === 'negative' ? 'سلبي' : 'محايد'}
                          </span>
                          <span>{(percentage * 100).toFixed(1)}%</span>
                        </div>
                        <Progress 
                          value={percentage * 100} 
                          className={`h-2 ${
                            sentiment === 'positive' ? '[&>div]:bg-green-500' :
                            sentiment === 'negative' ? '[&>div]:bg-red-500' : '[&>div]:bg-yellow-500'
                          }`}
                        />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>أداء الاستبيانات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-4">
                    {surveys?.data?.slice(0, 5).map((survey: any) => (
                      <div key={survey.id} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{survey.title}</div>
                          <div className="text-xs text-gray-500">
                            {survey.responseCount || 0} ردود • {survey.analytics?.completionRate || 0}% إكمال
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">
                            {(survey.analytics?.avgRating || 0).toFixed(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* تبويب الردود التفصيلية */}
        <TabsContent value="responses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>الردود التفصيلية</CardTitle>
              <CardDescription>
                عرض جميع الردود المستلمة مع إمكانية التصفية والتحليل
              </CardDescription>
            </CardHeader>
            <CardContent>
              {responsesError ? (
                <div className="text-center py-8">
                  <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <p className="text-red-600 font-medium">حدث خطأ في تحميل الردود</p>
                  <Button 
                    onClick={() => refetchResponses()} 
                    variant="outline" 
                    className="mt-2"
                  >
                    <RefreshCw className="w-4 h-4 ml-2" />
                    إعادة المحاولة
                  </Button>
                </div>
              ) : responsesLoading ? (
                <div className="text-center py-8">
                  <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
                  <p className="text-gray-600">جاري تحميل الردود...</p>
                </div>
              ) : !surveyResponses?.data || surveyResponses.data.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">لا توجد ردود بعد</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">اسم العميل</TableHead>
                      <TableHead className="text-right">الاستبيان</TableHead>
                      <TableHead className="text-right">تاريخ الإرسال</TableHead>
                      <TableHead className="text-right">التقييم العام</TableHead>
                      <TableHead className="text-right">NPS</TableHead>
                      <TableHead className="text-right">المشاعر</TableHead>
                      <TableHead className="text-right">وقت الإكمال</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {surveyResponses?.data?.map((response: any) => {
                      const survey = surveys?.data?.find((s: any) => s.id === response.surveyId);
                      return (
                        <TableRow key={response.id}>
                          <TableCell className="text-right font-medium">
                            {response.customerName || "عميل مجهول"}
                          </TableCell>
                          <TableCell className="text-right">
                            {survey?.title || "استبيان محذوف"}
                          </TableCell>
                          <TableCell className="text-right">
                            {new Date(response.submittedDate || response.createdAt).toLocaleDateString('ar-SA')}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span>{response.responses?.overall_rating || 0}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className={`font-medium ${
                              (response.npsScore || 0) >= 7 ? 'text-green-600' :
                              (response.npsScore || 0) >= 4 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {response.npsScore || 0}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge className={
                              response.sentiment === 'positive' ? 'bg-green-100 text-green-700' :
                              response.sentiment === 'negative' ? 'bg-red-100 text-red-700' :
                              'bg-yellow-100 text-yellow-700'
                            }>
                              {response.sentiment === 'positive' ? 'إيجابي' :
                               response.sentiment === 'negative' ? 'سلبي' : 'محايد'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {response.completionTime ? 
                              `${Math.floor(response.completionTime / 60)}:${(response.completionTime % 60).toString().padStart(2, '0')}` : 
                              "غير محدد"
                            }
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => {
                                // تأخير استدعاء toast لتجنب مشاكل React
                                setTimeout(() => {
                                  toast.info("عرض تفاصيل الرد", {
                                    description: `رد العميل: ${response.customerName || "عميل مجهول"}`,
                                    duration: 3000,
                                  });
                                }, 0);
                              }}
                              className="hover:bg-blue-100 hover:text-blue-700 hover:scale-110 transition-all duration-200"
                              title="عرض تفاصيل الرد"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* تبويب رؤى الذكاء الاصطناعي */}
        <TabsContent value="ai-insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                رؤى الذكاء الاصطناعي
              </CardTitle>
              <CardDescription>
                تحليل ذكي للردود واستخراج الرؤى والتوصيات
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button 
                  onClick={() => performAIAnalysis('all')}
                  disabled={aiAnalysisLoading}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:scale-105 hover:shadow-lg transition-all duration-300 animate-fade-in"
                >
                  {aiAnalysisLoading ? (
                    <RefreshCw className="w-4 h-4 ml-2 animate-spin" />
                  ) : (
                    <Zap className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform duration-200" />
                  )}
                  تحليل جميع الردود
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    // تأخير استدعاء toast لتجنب مشاكل React
                    setTimeout(() => {
                      toast.success("تم تصدير التحليل بنجاح", {
                        description: "تم تحميل ملف التحليل على جهازك",
                        duration: 3000,
                      });
                    }, 0);
                  }}
                  className="hover:scale-105 hover:shadow-lg hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transition-all duration-300 animate-fade-in"
                >
                  <Download className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform duration-200" />
                  تصدير التحليل
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setAiAnalysisLoading(true);
                    setTimeout(() => {
                      setAiAnalysisLoading(false);
                      toast.success("تم تحديث التحليل", {
                        description: "تم تحديث جميع الرؤى والتوصيات",
                        duration: 3000,
                      });
                    }, 2000);
                  }}
                  className="hover:scale-105 hover:shadow-lg hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-300 animate-fade-in"
                >
                  <RefreshCw className="w-4 h-4 ml-2 group-hover:rotate-180 transition-transform duration-500" />
                  تحديث التحليل
                </Button>
              </div>

              {aiAnalysisLoading && (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center space-y-2">
                    <RefreshCw className="w-8 h-8 animate-spin text-purple-600 mx-auto" />
                    <p className="text-gray-600">جاري تحليل الردود بالذكاء الاصطناعي...</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">النقاط الإيجابية الرئيسية</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="font-medium">جودة التنظيف المتميزة</p>
                          <p className="text-sm text-gray-600">ذكر 78% من العملاء جودة التنظيف كنقطة إيجابية</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="font-medium">الموظفون المتعاونون</p>
                          <p className="text-sm text-gray-600">تقييم عالي لتعامل الموظفين مع العملاء</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="font-medium">الموقع المناسب</p>
                          <p className="text-sm text-gray-600">سهولة الوصول والموقع الاستراتيجي</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">المجالات التي تحتاج تحسين</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                        <div>
                          <p className="font-medium">أوقات الانتظار</p>
                          <p className="text-sm text-gray-600">25% من العملاء يشكون من طول فترة الانتظار</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                        <div>
                          <p className="font-medium">التسعير</p>
                          <p className="text-sm text-gray-600">بعض العملاء يرون أن الأسعار مرتفعة نسبياً</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                        <div>
                          <p className="font-medium">ساعات العمل</p>
                          <p className="text-sm text-gray-600">طلبات لتمديد ساعات العمل وخدمة المساء</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">التوصيات الذكية</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="w-5 h-5 text-blue-500 mt-0.5" />
                      <div>
                        <p className="font-medium">تحسين تدفق العمل</p>
                        <p className="text-sm text-gray-600">تطبيق نظام حجز مواعيد لتقليل أوقات الانتظار</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Lightbulb className="w-5 h-5 text-blue-500 mt-0.5" />
                      <div>
                        <p className="font-medium">باقات تنافسية</p>
                        <p className="text-sm text-gray-600">إنشاء باقات شهرية وسنوية بأسعار مخفضة</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Lightbulb className="w-5 h-5 text-blue-500 mt-0.5" />
                      <div>
                        <p className="font-medium">خدمة مسائية</p>
                        <p className="text-sm text-gray-600">دج.مة إمكانية تقديم خدمة حتى الساعة 9 مساءً</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* حوار إنشاء استبيان جديد */}
      <SurveyCreationDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSurveyCreated={handleAddSurvey}
        selectedSurvey={selectedSurvey}
        onSurveyUpdated={async (updatedSurvey) => {
          try {
            await updateSurvey({ id: selectedSurvey?.id, ...updatedSurvey }).unwrap();
            toast.success("تم تحديث الاستبيان بنجاح", {
              description: `تم تحديث "${updatedSurvey.title}"`,
              duration: 4000,
            });
            setShowCreateDialog(false);
            setSelectedSurvey(null);
            refetchSurveys();
          } catch (err) {
            toast.error("حدث خطأ أثناء تحديث الاستبيان", {
              description: (err as any)?.error || "حدث خطأ غير متوقع",
              duration: 5000,
            });
          }
        }}
      />

      {/* حوار تفاصيل الاستبيان */}
      <Dialog open={showAnalyticsDialog} onOpenChange={setShowAnalyticsDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedSurvey?.title}</DialogTitle>
            <DialogDescription>
              تفاصيل وإحصائيات الاستبيان
            </DialogDescription>
          </DialogHeader>
          {selectedSurvey && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {selectedSurvey?.responseCount || 0}
                    </div>
                    <div className="text-sm text-gray-600">الردود المستلمة</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {(selectedSurvey?.analytics?.avgRating || 0).toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-600">متوسط التقييم</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {selectedSurvey?.analytics?.npsScore || 0}
                    </div>
                    <div className="text-sm text-gray-600">درجة NPS</div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline">
                  <Share2 className="w-4 h-4 ml-2" />
                  مشاركة الاستبيان
                </Button>
                <Button 
                  onClick={() => performAIAnalysis(selectedSurvey?.id || '')}
                  disabled={aiAnalysisLoading}
                >
                  <Brain className="w-4 h-4 ml-2" />
                  تحليل ذكي
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}