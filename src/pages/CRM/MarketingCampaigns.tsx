import { useState, useMemo } from "react";
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
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { SocialMediaIntegration } from "@/components/CRM/SocialMediaIntegration";
import { AIMarketingAssistant } from "@/components/CRM/AIMarketingAssistant";
import { 
  useGetCampaignsQuery,
  useCreateCampaignMutation,
  useUpdateCampaignMutation,
  useDeleteCampaignMutation,
} from "@/services/campaignsApi";
import { useCustomerStore } from "@/hooks/useCustomerStore";
import {
  Target,
  Plus,
  Search,
  Filter,
  Edit,
  Eye,
  Play,
  Pause,
  Users,
  MessageSquare,
  Mail,
  Calendar,
  TrendingUp,
  BarChart3,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  Gift,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Bot,
  Zap,
  Brain,
  Smartphone,
  Globe,
  PieChart,
  Activity,
  Repeat,
  Star,
  Settings,
  Download,
  Upload,
  Share2,
  Copy,
  CalendarDays,
  MapPin,
  Tag,
  Hash,
  AtSign,
  Image as ImageIcon,
  Video,
  FileText,
  MoreHorizontal,
  ChevronDown,
  Sparkles,
  Lightbulb
} from "lucide-react";

export default function MarketingCampaigns() {
  const { toast } = useToast();
  const { customers } = useCustomerStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [isNewCampaignOpen, setIsNewCampaignOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState("campaigns");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterChannel, setFilterChannel] = useState("all");
  const { data: campaignsResp } = useGetCampaignsQuery({ limit: 500 });
  const campaigns = (campaignsResp?.data as any[]) || [];
  const [createCampaign] = useCreateCampaignMutation();
  const [updateCampaign] = useUpdateCampaignMutation();
  const [deleteCampaign] = useDeleteCampaignMutation();
  const [editingCampaignId, setEditingCampaignId] = useState<number | null>(null);
  const [campaignFormData, setCampaignFormData] = useState({
    name: "",
    description: "",
    targetAudience: "",
    message: "",
    channel: "",
    startDate: "",
    endDate: "",
    discount: "",
    discountType: "",
    budget: "",
    aiGenerated: false,
    socialMediaPlatforms: [] as string[],
    autoSchedule: false,
    aiOptimization: false,
    contentType: "text",
    hashtags: "",
    location: "",
    ageRange: "",
    interests: [] as string[],
    customerIds: [] as string[],
  });

  // Data arrays moved here for better organization

  const audiences = [
    "جميع العملاء",
    "عملاء VIP",
    "عملاء جدد",
    "عملاء غير نشطين",
    "حسب المدينة",
    "حسب نوع المشروب"
  ];

  const channels = [
    "واتساب",
    "SMS",
    "بريد إلكتروني",
    "إشعار التطبيق",
    "فيسبوك",
    "انستقرام",
    "تويتر",
    "لينكدان",
    "يوتيوب",
    "واتساب + SMS",
    "وسائل التواصل الاجتماعي",
    "جميع القنوات"
  ];

  const socialMediaPlatforms = [
    { id: "facebook", name: "فيسبوك", icon: Facebook, color: "text-blue-600" },
    { id: "instagram", name: "انستقرام", icon: Instagram, color: "text-pink-600" },
    { id: "twitter", name: "تويتر", icon: Twitter, color: "text-blue-400" },
    { id: "linkedin", name: "لينكدان", icon: Linkedin, color: "text-blue-700" },
    { id: "youtube", name: "يوتيوب", icon: Youtube, color: "text-red-600" }
  ];

  const contentTypes = [
    { id: "text", name: "نص", icon: FileText },
    { id: "image", name: "صورة", icon: ImageIcon },
    { id: "video", name: "فيديو", icon: Video },
    { id: "carousel", name: "معرض صور", icon: ImageIcon }
  ];

  const aiFeatures = [
    { id: "content", name: "إنشاء المحتوى", description: "ذكاء اصطناعي لكتابة المحتوى" },
    { id: "targeting", name: "استهداف ذكي", description: "تحديد الجمهور المناسب" },
    { id: "timing", name: "توقيت مثالي", description: "أفضل وقت للنشر" },
    { id: "optimization", name: "تحسين تلقائي", description: "تحسين الأداء باستمرار" }
  ];

  const discountTypes = ["نسبة مئوية", "مبلغ ثابت", "خدمة مجانية", "نقاط مضاعفة"];

  // Aggregated stats from real API data (no mock values)
  const aggStats = useMemo(() => {
    const list = (campaigns as any[]) || [];
    const total = list.length;
    const active = list.filter((c) => c?.status === 'نشط').length;
    const totalRevenue = list.reduce((sum, c) => sum + (Number(c?.revenue) || 0), 0);
    const totalTargets = list.reduce((sum, c) => sum + (Number(c?.totalTargets) || 0), 0);
    const sent = list.reduce((sum, c) => sum + (Number(c?.sentCount) || 0), 0);
    const responded = list.reduce((sum, c) => sum + (Number(c?.respondedCount) || 0), 0);
    const responseRate = sent > 0 ? (responded / sent) * 100 : 0;
    return { total, active, totalRevenue, totalTargets, responseRate };
  }, [campaigns]);

  const handleSaveCampaign = async () => {
    if (!campaignFormData.name || !campaignFormData.targetAudience || !campaignFormData.message) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء الحقول الأساسية المطلوبة",
        variant: "destructive"
      });
      return;
    }

    try {
      if (editingCampaignId) {
        await updateCampaign({ id: editingCampaignId, ...campaignFormData }).unwrap();
        toast({ title: "تم الحفظ", description: "تم تحديث الحملة بنجاح" });
      } else {
        await createCampaign({
          ...campaignFormData,
          status: "مجدول",
          totalTargets: 0,
          sentCount: 0,
          openedCount: 0,
          respondedCount: 0,
          conversionRate: 0,
          revenue: 0,
          budget: parseInt(campaignFormData.budget) || 0,
          spent: 0,
        }).unwrap();
        toast({ title: "تم الحفظ بنجاح", description: "تم إنشاء الحملة التسويقية بنجاح" });
      }
    } catch (e) {
      toast({ title: "فشل الحفظ", description: "حدث خطأ أثناء الحفظ", variant: "destructive" });
      return;
    }

    setIsNewCampaignOpen(false);
    setEditingCampaignId(null);
    setCampaignFormData({
      name: "",
      description: "",
      targetAudience: "",
      message: "",
      channel: "",
      startDate: "",
      endDate: "",
      discount: "",
      discountType: "",
      budget: "",
      aiGenerated: false,
      socialMediaPlatforms: [],
      autoSchedule: false,
      aiOptimization: false,
      contentType: "text",
      hashtags: "",
      location: "",
      ageRange: "",
      interests: []
    });
  };

  const handleEditCampaign = (campaign: any) => {
    setCampaignFormData({
      name: campaign.name,
      description: campaign.description,
      targetAudience: campaign.targetAudience,
      message: "",
      channel: campaign.channel,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      discount: campaign.discount,
      discountType: "",
      budget: campaign.budget.toString(),
      aiGenerated: false,
      socialMediaPlatforms: [],
      autoSchedule: false,
      aiOptimization: false,
      contentType: "text",
      hashtags: "",
      location: "",
      ageRange: "",
      interests: []
    });
    setEditingCampaignId(campaign.id);
    setIsNewCampaignOpen(true);
    
    toast({
      title: "فتح محرر الحملة",
      description: "تم تحميل بيانات الحملة للتعديل",
    });
  };

  const handleToggleCampaign = async (campaign: any) => {
    const newStatus = campaign.status === "نشط" ? "متوقف" : "نشط";
    try {
      await updateCampaign({ id: campaign.id, status: newStatus }).unwrap();
      toast({
        title: newStatus === "نشط" ? "تم تشغيل الحملة" : "تم إيقاف الحملة",
        description: `تم ${newStatus === "نشط" ? "تشغيل" : "إيقاف"} حملة ${campaign.name}`,
      });
    } catch (e) {
      toast({ title: "فشل التحديث", variant: "destructive" });
    }
  };

  const handleDeleteCampaign = async (campaign: any) => {
    try {
      await deleteCampaign(campaign.id).unwrap();
      toast({ title: "تم حذف الحملة", description: `تم حذف حملة ${campaign.name} بنجاح` });
    } catch (e) {
      toast({ title: "فشل الحذف", variant: "destructive" });
    }
  };

  const handleDuplicateCampaign = async (campaign: any) => {
    try {
      await createCampaign({
        ...campaign,
        id: undefined,
        name: `نسخة من ${campaign.name}`,
        status: "مجدول",
      }).unwrap();
      toast({ title: "تم نسخ الحملة", description: `تم إنشاء نسخة من حملة ${campaign.name}` });
    } catch (e) {
      toast({ title: "فشل النسخ", variant: "destructive" });
    }
  };

  const handleLaunchCampaign = async (campaign: any) => {
    try {
      await updateCampaign({ id: campaign.id, status: "نشط" }).unwrap();
      toast({ title: "تم إطلاق الحملة", description: `تم إطلاق حملة ${campaign.name} بنجاح` });
    } catch (e) {
      toast({ title: "فشل الإطلاق", variant: "destructive" });
    }
  };

  const handleViewAnalytics = (campaign: any) => {
    setSelectedCampaign(campaign);
    toast({
      title: "عرض التحليلات",
      description: `فتح تحليلات مفصلة لحملة ${campaign.name}`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "نشط":
        return <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">نشط</Badge>;
      case "مجدول":
        return <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">مجدول</Badge>;
      case "منتهي":
        return <Badge variant="outline">منتهي</Badge>;
      case "متوقف":
        return <Badge variant="destructive">متوقف</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getChannelIcon = (channel?: string) => {
    const ch = channel || "";
    if (ch.includes("واتساب")) return <MessageSquare className="w-4 h-4 text-green-500" />;
    if (ch.includes("بريد")) return <Mail className="w-4 h-4 text-blue-500" />;
    if (ch.includes("SMS")) return <MessageSquare className="w-4 h-4 text-purple-500" />;
    if (ch.includes("فيسبوك")) return <Facebook className="w-4 h-4 text-blue-600" />;
    if (ch.includes("انستقرام")) return <Instagram className="w-4 h-4 text-pink-600" />;
    if (ch.includes("تويتر")) return <Twitter className="w-4 h-4 text-blue-400" />;
    if (ch.includes("لينكدان")) return <Linkedin className="w-4 h-4 text-blue-700" />;
    if (ch.includes("يوتيوب")) return <Youtube className="w-4 h-4 text-red-600" />;
    return <Send className="w-4 h-4 text-gray-500" />;
  };

  const generateAIContent = async () => {
    toast({
      title: "جاري إنشاء المحتوى",
      description: "الذكاء الاصطناعي يعمل على إنشاء محتوى مخصص للحملة",
    });
    
    // محاكاة توليد محتوى بالذكاء الاصطناعي
    setTimeout(() => {
      const aiGeneratedContent = `🌟 عرض خاص ومحدود! 🌟
      
خصم ${campaignFormData.discount}% على جميع خدمات    الكافية
✨ احجز الآن واستفد من العرض
🚗 خدمة عالية الجودة وأسعار لا تقاوم
⏰ العرض ساري حتى ${campaignFormData.endDate}

# _سيارات #عروض_خاصة #جودة_عالية`;

      setCampaignFormData(prev => ({ 
        ...prev, 
        message: aiGeneratedContent,
        aiGenerated: true 
      }));
      
      toast({
        title: "تم إنشاء المحتوى",
        description: "تم إنشاء محتوى مخصص باستخدام الذكاء الاصطناعي",
      });
    }, 2000);
  };

  const optimizeCampaign = () => {
    toast({
      title: "جاري تحسين الحملة",
      description: "الذكاء الاصطناعي يحلل البيانات لتحسين الأداء",
    });
  };

  const filteredCampaigns = campaigns.filter((campaign: any) => {
    const name = (campaign?.name ?? "");
    const desc = (campaign?.description ?? "");
    const audience = (campaign?.targetAudience ?? "");
    const channel = (campaign?.channel ?? "");
    const q = searchTerm || "";
    const matchesSearch = name.toString().includes(q) || desc.toString().includes(q) || audience.toString().includes(q);
    const matchesStatus = filterStatus === "all" || campaign?.status === filterStatus;
    const matchesChannel = filterChannel === "all" || channel.toString().includes(filterChannel || "");
    return matchesSearch && matchesStatus && matchesChannel;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              الحملات التسويقية الذكية
            </h1>
            <p className="text-gray-600 flex items-center gap-2">
              <Bot className="w-4 h-4 text-purple-500" />
              إطلاق وإدارة الحملات التسويقية بالذكاء الاصطناعي ووسائل التواصل الاجتماعي
            </p>
          </div>
          <Dialog open={isNewCampaignOpen} onOpenChange={setIsNewCampaignOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600">
                <Plus className="w-4 h-4 mr-2" />
                حملة جديدة
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>إنشاء حملة تسويقية جديدة</DialogTitle>
                <DialogDescription>
                  قم بتحديد تفاصيل الحملة والجمهور المستهدف
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="basic" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">البيانات الأساسية</TabsTrigger>
                  <TabsTrigger value="content">المحتوى</TabsTrigger>
                  <TabsTrigger value="settings">الإعدادات</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">اسم الحملة *</Label>
                      <Input
                        id="name"
                        value={campaignFormData.name}
                        onChange={(e) => setCampaignFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="مثال: عرض نهاية الأسبوع"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">وصف الحملة</Label>
                      <Textarea
                        id="description"
                        value={campaignFormData.description}
                        onChange={(e) => setCampaignFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="وصف مختصر للحملة التسويقية"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>اختيار العملاء المستهدفين</Label>
                        <div className="max-h-48 overflow-y-auto border rounded-lg p-2 bg-white">
                          {customers.map((c) => (
                            <label key={c.id} className="flex items-center gap-2 py-1 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={(campaignFormData.customerIds || []).includes(c.id)}
                                onChange={(e) => {
                                  setCampaignFormData((prev) => ({
                                    ...prev,
                                    customerIds: e.target.checked
                                      ? [...prev.customerIds, c.id]
                                      : prev.customerIds.filter((id) => id !== c.id),
                                  }));
                                }}
                              />
                              <span className="text-sm">{c.name}</span>
                              <span dir="ltr" className="text-xs text-gray-500">{c.phone}</span>
                            </label>
                          ))}
                          {customers.length === 0 && (
                            <div className="text-xs text-gray-500">لا يوجد عملاء حالياً</div>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="targetAudience">الجمهور المستهدف *</Label>
                        <Select value={campaignFormData.targetAudience} onValueChange={(value) => setCampaignFormData(prev => ({ ...prev, targetAudience: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر الجمهور المستهدف" />
                          </SelectTrigger>
                          <SelectContent>
                            {audiences.map((audience) => (
                              <SelectItem key={audience} value={audience}>{audience}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="channel">قناة التواصل *</Label>
                        <Select value={campaignFormData.channel} onValueChange={(value) => setCampaignFormData(prev => ({ ...prev, channel: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر قناة التواصل" />
                          </SelectTrigger>
                          <SelectContent>
                            {channels.map((channel) => (
                              <SelectItem key={channel} value={channel}>{channel}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDate">تاريخ البداية</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={campaignFormData.startDate}
                          onChange={(e) => setCampaignFormData(prev => ({ ...prev, startDate: e.target.value }))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="endDate">تاريخ النهاية</Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={campaignFormData.endDate}
                          onChange={(e) => setCampaignFormData(prev => ({ ...prev, endDate: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                  <TabsContent value="content" className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="message">نص الرسالة التسويقية *</Label>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={generateAIContent}
                          className="flex items-center gap-1"
                        >
                          <Bot className="w-3 h-3" />
                          إنشاء بالذكاء الاصطناعي
                        </Button>
                      </div>
                      <Textarea
                        id="message"
                        value={campaignFormData.message}
                        onChange={(e) => setCampaignFormData(prev => ({ ...prev, message: e.target.value }))}
                        placeholder="مثال: خصم 20% على جميع خدماتنا بمناسبة نهاية الأسبوع! احجز الآن واستفد من العرض المحدود."
                        rows={4}
                        className={campaignFormData.aiGenerated ? "border-purple-300 bg-purple-50/50" : ""}
                      />
                      {campaignFormData.aiGenerated && (
                        <div className="flex items-center gap-1 text-xs text-purple-600">
                          <Sparkles className="w-3 h-3" />
                          تم إنشاء هذا المحتوى بالذكاء الاصطناعي
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="contentType">نوع المحتوى</Label>
                        <Select value={campaignFormData.contentType} onValueChange={(value) => setCampaignFormData(prev => ({ ...prev, contentType: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر نوع المحتوى" />
                          </SelectTrigger>
                          <SelectContent>
                            {contentTypes.map((type) => (
                              <SelectItem key={type.id} value={type.id}>
                                <div className="flex items-center gap-2">
                                  <type.icon className="w-4 h-4" />
                                  {type.name}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="hashtags">الهاشتاجات</Label>
                        <Input
                          id="hashtags"
                          value={campaignFormData.hashtags}
                          onChange={(e) => setCampaignFormData(prev => ({ ...prev, hashtags: e.target.value }))}
                          placeholder="مثال: # _سيارات #عروض_خاصة"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>منصات التواصل الاجتماعي</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {socialMediaPlatforms.map((platform) => (
                          <div key={platform.id} className="flex items-center space-x-2 space-x-reverse">
                            <input
                              type="checkbox"
                              id={platform.id}
                              checked={(campaignFormData.socialMediaPlatforms || []).includes(platform.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setCampaignFormData(prev => ({
                                    ...prev,
                                    socialMediaPlatforms: [...prev.socialMediaPlatforms, platform.id]
                                  }));
                                } else {
                                  setCampaignFormData(prev => ({
                                    ...prev,
                                    socialMediaPlatforms: prev.socialMediaPlatforms.filter(p => p !== platform.id)
                                  }));
                                }
                              }}
                              className="rounded border-gray-300"
                            />
                            <label htmlFor={platform.id} className="flex items-center gap-1 text-sm cursor-pointer">
                              <platform.icon className={`w-4 h-4 ${platform.color}`} />
                              {platform.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="discountType">نوع العرض</Label>
                        <Select value={campaignFormData.discountType} onValueChange={(value) => setCampaignFormData(prev => ({ ...prev, discountType: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر نوع العرض" />
                          </SelectTrigger>
                          <SelectContent>
                            {discountTypes.map((type) => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="discount">قيمة العرض</Label>
                        <Input
                          id="discount"
                          value={campaignFormData.discount}
                          onChange={(e) => setCampaignFormData(prev => ({ ...prev, discount: e.target.value }))}
                          placeholder="مثال: 20 أو 100"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="budget">الميزانية المخصصة (جنيه مصري)</Label>
                        <Input
                          id="budget"
                          type="number"
                          value={campaignFormData.budget}
                          onChange={(e) => setCampaignFormData(prev => ({ ...prev, budget: e.target.value }))}
                          placeholder="مثال: 5000"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location">الموقع الجغرافي</Label>
                        <Input
                          id="location"
                          value={campaignFormData.location}
                          onChange={(e) => setCampaignFormData(prev => ({ ...prev, location: e.target.value }))}
                          placeholder="مثال: الرياض، جدة"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="autoSchedule">الجدولة التلقائية</Label>
                          <p className="text-xs text-muted-foreground">نشر تلقائي في أفضل الأوقات</p>
                        </div>
                        <Switch
                          id="autoSchedule"
                          checked={campaignFormData.autoSchedule}
                          onCheckedChange={(checked) => setCampaignFormData(prev => ({ ...prev, autoSchedule: checked }))}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="aiOptimization">التحسين بالذكاء الاصطناعي</Label>
                          <p className="text-xs text-muted-foreground">تحسين الحملة تلقائياً لتحقيق أفضل النتائج</p>
                        </div>
                        <Switch
                          id="aiOptimization"
                          checked={campaignFormData.aiOptimization}
                          onCheckedChange={(checked) => setCampaignFormData(prev => ({ ...prev, aiOptimization: checked }))}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* AI Features */}
                      <div className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                        <h4 className="font-medium text-purple-900 mb-2 flex items-center gap-2">
                          <Brain className="w-4 h-4" />
                          ميزات الذكاء الاصطناعي
                        </h4>
                        <div className="space-y-2">
                          {aiFeatures.map((feature) => (
                            <div key={feature.id} className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-purple-800">{feature.name}</p>
                                <p className="text-xs text-purple-600">{feature.description}</p>
                              </div>
                              <Switch defaultChecked />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Tips */}
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                          <Lightbulb className="w-4 h-4" />
                          نصائح للحملة الناجحة
                        </h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• استخدم رسائل واضحة ومباشرة</li>
                          <li>• حدد فترة زمنية محدودة لخلق الإلحاح</li>
                          <li>• اختر التوقيت المناسب للإرسال</li>
                          <li>• تابع النتائج وقم بالتحسين</li>
                          <li>• استفد من الذكاء الاصطناعي للتحسين</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex gap-2">
                <Button onClick={handleSaveCampaign} className="flex-1">
                  <Plus className="w-4 h-4 mr-2" />
                  إنشاء الحملة
                </Button>
                <Button variant="outline" onClick={() => setIsNewCampaignOpen(false)}>
                  إلغاء
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي الحملات</CardTitle>
              <Target className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{campaigns.length}</div>
              <p className="text-xs text-muted-foreground">
                {campaigns.filter(c => c.status === "نشط").length} حملة نشطة
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">معدل الاستجابة</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{aggStats.responseRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                متوسط الاستجابة لجميع الحملات
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي الإيرادات</CardTitle>
              <BarChart3 className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{aggStats.totalRevenue.toLocaleString()} جنيه مصري</div>
              <p className="text-xs text-muted-foreground">
                إيرادات الحملات هذا الشهر
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-yellow-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">العملاء المستهدفون</CardTitle>
              <Users className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{aggStats.totalTargets}</div>
              <p className="text-xs text-muted-foreground">
                عميل تم استهدافهم عبر الحملات
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="البحث في الحملات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">كل الحالات</SelectItem>
                  <SelectItem value="نشط">نشط</SelectItem>
                  <SelectItem value="مجدول">مجدول</SelectItem>
                  <SelectItem value="منتهي">منتهي</SelectItem>
                  <SelectItem value="متوقف">متوقف</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterChannel} onValueChange={setFilterChannel}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="القناة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">كل القنوات</SelectItem>
                  {channels.map((channel) => (
                    <SelectItem key={channel} value={channel}>{channel}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button variant="outline" onClick={() => {
                setSearchTerm("");
                setFilterStatus("all");
                setFilterChannel("all");
                toast({ title: "تم مسح الفلاتر", description: "تم إعادة تعيين جميع الفلاتر" });
              }}>
                <Filter className="w-4 h-4 mr-2" />
                مسح الفلاتر
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-2 mb-4">
          <Button 
            variant="outline" 
            onClick={() => {
              const activeCampaigns = campaigns.filter(c => c.status === "نشط");
              toast({ 
                title: "تقرير الحملات النشطة", 
                description: `عدد الحملات النشطة: ${activeCampaigns.length}` 
              });
            }}
          >
            <Activity className="w-4 h-4 mr-2" />
            الحملات النشطة ({campaigns.filter(c => c.status === "نشط").length})
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => {
              const totalRevenue = campaigns.reduce((sum, c) => sum + c.revenue, 0);
              toast({ 
                title: "إجمالي الإيرادات", 
                description: `${totalRevenue.toLocaleString()} جنيه مصري من جميع الحملات` 
              });
            }}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            تقرير الإيرادات
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => {
              toast({ 
                title: "تصدير التقرير", 
                description: "تم تصدير تقرير شامل لجميع الحملات" 
              });
            }}
          >
            <Download className="w-4 h-4 mr-2" />
            تصدير التقرير
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-500" />
              قائمة الحملات التسويقية
            </CardTitle>
            <CardDescription>
              {filteredCampaigns.length} حملة من أصل {campaigns.length} حملة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">الحملة</TableHead>
                  <TableHead className="text-right">الجمهور المستهدف</TableHead>
                  <TableHead className="text-right">القناة</TableHead>
                  <TableHead className="text-right">الإحصائيات</TableHead>
                  <TableHead className="text-right">النتائج</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCampaigns.map((campaign) => (
                  <TableRow key={campaign.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{campaign.name}</p>
                        <p className="text-sm text-muted-foreground">{campaign.description}</p>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs">{campaign.startDate} - {campaign.endDate}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{campaign.targetAudience}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{campaign.totalTargets} عميل مستهدف</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getChannelIcon(campaign.channel)}
                        <span className="text-sm">{campaign.channel}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Send className="w-3 h-3 text-blue-500" />
                          <span className="text-xs">{campaign.sentCount} مرسل</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3 text-green-500" />
                          <span className="text-xs">{campaign.openedCount} مفتوح</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-purple-500" />
                          <span className="text-xs">{campaign.respondedCount} استجابة</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{campaign.conversionRate}% معدل التحويل</p>
                        <p className="text-sm text-green-600">{campaign.revenue.toLocaleString()} جنيه مصري إيرادات</p>
                        <Progress value={campaign.conversionRate} className="h-1" />
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(campaign.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewAnalytics(campaign)}
                          title="عرض التفاصيل"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleEditCampaign(campaign)}
                          title="تعديل الحملة"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        {campaign.status === "نشط" ? (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleToggleCampaign(campaign)}
                            title="إيقاف الحملة"
                          >
                            <Pause className="w-4 h-4" />
                          </Button>
                        ) : campaign.status === "مجدول" ? (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleLaunchCampaign(campaign)}
                            title="إطلاق الحملة"
                            className="text-green-600 hover:text-green-700"
                          >
                            <Play className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleToggleCampaign(campaign)}
                            title="إعادة تشغيل الحملة"
                          >
                            <Play className="w-4 h-4" />
                          </Button>
                        )}
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button size="sm" variant="outline" title="المزيد من الخيارات">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-48">
                            <div className="space-y-2">
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="w-full justify-start"
                                onClick={() => handleDuplicateCampaign(campaign)}
                              >
                                <Copy className="w-4 h-4 mr-2" />
                                نسخ الحملة
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="w-full justify-start"
                                onClick={() => {
                                  toast({ 
                                    title: "تصدير البيانات", 
                                    description: "تم تصدير بيانات الحملة" 
                                  });
                                }}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                تصدير البيانات
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="w-full justify-start text-red-600 hover:text-red-700"
                                onClick={() => handleDeleteCampaign(campaign)}
                              >
                                <AlertCircle className="w-4 h-4 mr-2" />
                                حذف الحملة
                              </Button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Campaign Details Dialog */}
        {selectedCampaign && (
          <Dialog open={!!selectedCampaign} onOpenChange={() => setSelectedCampaign(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Target className="w-6 h-6 text-purple-500" />
                  {selectedCampaign.name}
                  {getStatusBadge(selectedCampaign.status)}
                </DialogTitle>
                <DialogDescription>
                  تفاصيل شاملة عن الحملة التسويقية ونتائجها
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="overview" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
                  <TabsTrigger value="performance">الأداء</TabsTrigger>
                  <TabsTrigger value="analytics">التحليلات</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">معلومات الحملة</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span>الجمهور المستهدف:</span>
                          <span className="font-medium">{selectedCampaign.targetAudience}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>قناة التواصل:</span>
                          <span className="font-medium">{selectedCampaign.channel}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>فترة الحملة:</span>
                          <span className="font-medium">{selectedCampaign.startDate} - {selectedCampaign.endDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>العرض:</span>
                          <span className="font-medium">{selectedCampaign.discount}</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">الميزانية والتكلفة</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span>الميزانية المخصصة:</span>
                          <span className="font-medium">{selectedCampaign.budget.toLocaleString()} جنيه مصري</span>
                        </div>
                        <div className="flex justify-between">
                          <span>المبلغ المستخدم:</span>
                          <span className="font-medium">{selectedCampaign.spent.toLocaleString()} جنيه مصري</span>
                        </div>
                        <div className="flex justify-between">
                          <span>المتبقي:</span>
                          <span className="font-medium">{(selectedCampaign.budget - selectedCampaign.spent).toLocaleString()} جنيه مصري</span>
                        </div>
                        <Progress value={(selectedCampaign.spent / selectedCampaign.budget) * 100} className="h-2" />
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="performance" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">إجمالي المستهدفين</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{selectedCampaign.totalTargets}</div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">تم الإرسال</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{selectedCampaign.sentCount}</div>
                        <p className="text-xs text-muted-foreground">
                          {((selectedCampaign.sentCount / selectedCampaign.totalTargets) * 100).toFixed(1)}%
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">تم الفتح</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-600">{selectedCampaign.openedCount}</div>
                        <p className="text-xs text-muted-foreground">
                          {selectedCampaign.sentCount > 0 ? ((selectedCampaign.openedCount / selectedCampaign.sentCount) * 100).toFixed(1) : 0}%
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">الاستجابات</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-purple-600">{selectedCampaign.respondedCount}</div>
                        <p className="text-xs text-muted-foreground">
                          {selectedCampaign.conversionRate}% معدل التحويل
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>الإيرادات والعائد على الاستثمار</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">{selectedCampaign.revenue.toLocaleString()} جنيه مصري</p>
                          <p className="text-sm text-muted-foreground">إجمالي الإيرادات</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-600">{(selectedCampaign.revenue / selectedCampaign.spent).toFixed(1)}x</p>
                          <p className="text-sm text-muted-foreground">العائد على الاستثمار</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-purple-600">{(selectedCampaign.revenue / selectedCampaign.respondedCount).toFixed(0)} جنيه مصري</p>
                          <p className="text-sm text-muted-foreground">متوسط الايصال</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>تحليل الأداء</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span>معدل الفتح</span>
                            <span>{((selectedCampaign.openedCount / selectedCampaign.sentCount) * 100).toFixed(1)}%</span>
                          </div>
                          <Progress value={(selectedCampaign.openedCount / selectedCampaign.sentCount) * 100} className="h-2" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-2">
                            <span>معدل الاستجابة</span>
                            <span>{selectedCampaign.conversionRate}%</span>
                          </div>
                          <Progress value={selectedCampaign.conversionRate} className="h-2" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-2">
                            <span>استخدام الميزانية</span>
                            <span>{((selectedCampaign.spent / selectedCampaign.budget) * 100).toFixed(1)}%</span>
                          </div>
                          <Progress value={(selectedCampaign.spent / selectedCampaign.budget) * 100} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}