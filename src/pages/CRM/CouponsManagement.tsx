import React, { useState, useEffect } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { 
  useGetCouponsQuery, 
  useCreateCouponMutation, 
  useUpdateCouponMutation, 
  useDeleteCouponMutation,
  useToggleCouponStatusMutation,
  useDuplicateCouponMutation,
  useGetCouponStatsQuery,
  useExportCouponsMutation
} from "@/services/couponsApi";
import {
  Gift,
  Plus,
  Search,
  Filter,
  Edit,
  Eye,
  Copy,
  Calendar,
  Users,
  Percent,
  DollarSign,
  Star,
  QrCode,
  Download,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  Printer,
  Smartphone,
  Monitor,
  MessageSquare,
  BarChart3,
  TrendingUp,
  PieChart,
  Share2,
  Award,
  Target,
  RefreshCw,
  Settings,
  AlertTriangle,
  Mail,
  Activity,
  CreditCard,
  Zap
} from "lucide-react";

export default function CouponsManagement() {
  console.log("🎫 Loading CouponsManagement component");
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCoupon, setSelectedCoupon] = useState<any>(null);
  const [isNewCouponOpen, setIsNewCouponOpen] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showCouponDetails, setShowCouponDetails] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeData, setQrCodeData] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [isEditing, setIsEditing] = useState(false);
  const [couponFormData, setCouponFormData] = useState({
    code: "",
    name: "",
    description: "",
    type: "",
    value: "",
    minOrderAmount: "",
    maxDiscount: "",
    startDate: "",
    endDate: "",
    usageLimit: "",
    customerLimit: "",
    applicableServices: "",
    targetCustomers: "",
    branches: "",
    channels: "",
    autoApply: false,
    stackable: false,
    firstTimeOnly: false,
    terms: ""
  });

  // استخدام API للكوبونات
  const { data: couponsData, isLoading, error, refetch } = useGetCouponsQuery({
    search: searchTerm,
    status: filterStatus,
    type: filterType
  });

  const [createCoupon, { isLoading: isCreating }] = useCreateCouponMutation();
  const [updateCoupon, { isLoading: isUpdating }] = useUpdateCouponMutation();
  const [deleteCoupon, { isLoading: isDeleting }] = useDeleteCouponMutation();
  const [toggleStatus, { isLoading: isToggling }] = useToggleCouponStatusMutation();
  const [duplicateCoupon, { isLoading: isDuplicating }] = useDuplicateCouponMutation();
  const { data: statsData } = useGetCouponStatsQuery();
  const [exportCoupons] = useExportCouponsMutation();

  const coupons = couponsData?.data?.coupons || [];
  const stats = statsData?.data?.summary || {};

  // إعادة تحميل البيانات عند تغيير الفلاتر
  useEffect(() => {
    refetch();
  }, [searchTerm, filterStatus, filterType, refetch]);

  const couponTypes = ["نسبة مئوية", "مبلغ ثابت", "خدمة مجانية", "نقاط مضاعفة", "شحن مجاني"];
  const targetCustomers = ["جميع العملاء", "عملاء VIP", "عملاء جدد", "العملاء النشطين", "عملاء غير نشطين", "عملاء مميزون"];
  const applicableServices = ["جميع الخدمات", "  أساسي", "خدمات VIP", "تلميع", "تنظيف داخلي", "  شامل"];
  const channelOptions = ["جميع القنوات", "تطبيق جوال", "موقع إلكتروني", "فرع فقط", "كول سنتر", "واتساب"];
  const branchOptions = ["جميع الفروع", "الفرع الرئيسي", "فرع الشمال", "فرع الجنوب", "فرع الشرق"];

  const generateCouponCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCouponFormData(prev => ({ ...prev, code: result }));
  };

  const handleSaveCoupon = async () => {
    if (!couponFormData.code || !couponFormData.name || !couponFormData.type) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء الحقول الأساسية المطلوبة",
        variant: "destructive"
      });
      return;
    }

    try {
      if (isEditing && selectedCoupon) {
        // تحديث كوبون موجود
        await updateCoupon({
          id: selectedCoupon.id,
          ...couponFormData
        }).unwrap();
        
        toast({
          title: "تم التحديث بنجاح",
          description: `تم تحديث الكوبون ${couponFormData.code} بنجاح`,
        });
      } else {
        // إضافة كوبون جديد
        await createCoupon(couponFormData).unwrap();
        
        toast({
          title: "تم الحفظ بنجاح",
          description: `تم إنشاء الكوبون ${couponFormData.code} بنجاح`,
        });
      }

      setIsNewCouponOpen(false);
      setIsEditing(false);
      setSelectedCoupon(null);
      setCouponFormData({
        code: "",
        name: "",
        description: "",
        type: "",
        value: "",
        minOrderAmount: "",
        maxDiscount: "",
        startDate: "",
        endDate: "",
        usageLimit: "",
        customerLimit: "",
        applicableServices: "",
        targetCustomers: "",
        branches: "",
        channels: "",
        autoApply: false,
        stackable: false,
        firstTimeOnly: false,
        terms: ""
      });
      
      refetch(); // إعادة تحميل البيانات
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error?.data?.message || "حدث خطأ أثناء حفظ الكوبون",
        variant: "destructive"
      });
    }
  };

  const handleEditCoupon = (coupon: any) => {
    setCouponFormData({
      code: coupon.code,
      name: coupon.name,
      description: coupon.description,
      type: coupon.type,
      value: coupon.value.toString(),
      minOrderAmount: coupon.minOrderAmount.toString(),
      maxDiscount: coupon.maxDiscount.toString(),
      startDate: coupon.startDate,
      endDate: coupon.endDate,
      usageLimit: coupon.usageLimit.toString(),
      customerLimit: coupon.customerLimit.toString(),
      applicableServices: coupon.applicableServices,
      targetCustomers: coupon.targetCustomers,
      branches: coupon.branches,
      channels: coupon.channels,
      autoApply: coupon.autoApply,
      stackable: coupon.stackable,
      firstTimeOnly: coupon.firstTimeOnly,
      terms: ""
    });
    setSelectedCoupon(coupon);
    setIsEditing(true);
    setIsNewCouponOpen(true);
  };

  const handleDeleteCoupon = async (couponId: number) => {
    try {
      await deleteCoupon(couponId).unwrap();
      toast({
        title: "تم الحذف",
        description: "تم حذف الكوبون بنجاح",
      });
      refetch();
    } catch (error) {
      toast({
        title: "خطأ",
        description: error?.data?.message || "حدث خطأ أثناء حذف الكوبون",
        variant: "destructive"
      });
    }
  };

  const handleToggleStatus = async (couponId: number) => {
    try {
      await toggleStatus(couponId).unwrap();
      toast({
        title: "تم التحديث",
        description: "تم تغيير حالة الكوبون بنجاح",
      });
      refetch();
    } catch (error) {
      toast({
        title: "خطأ",
        description: error?.data?.message || "حدث خطأ أثناء تغيير الحالة",
        variant: "destructive"
      });
    }
  };

  const generateQRCode = (coupon: any) => {
    const qrData = `COUPON:${coupon.code}|VALUE:${coupon.value}|TYPE:${coupon.type}`;
    setQrCodeData(qrData);
    setShowQRCode(true);
    toast({
      title: "تم التوليد",
      description: `تم إنشاء رمز QR للكوبون ${coupon.code}`,
    });
  };

  const sendCoupon = (coupon: any, method: string) => {
    // محاكاة إرسال الكوبون
    const message = `كوبون خصم: ${coupon.code}\n${coupon.description}\nصالح حتى: ${coupon.endDate}`;
    
    if (method === "واتساب") {
      // محاكاة إرسال واتساب
      window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    } else if (method === "إيميل") {
      // محاكاة إرسال إيميل
      window.open(`mailto:?subject=كوبون خصم حصري&body=${encodeURIComponent(message)}`, '_blank');
    }
    
    toast({
      title: "تم الإرسال",
      description: `تم إرسال الكوبون ${coupon.code} عبر ${method}`,
    });
  };

  const handleExportCoupons = async () => {
    try {
      await exportCoupons({ format: 'csv' }).unwrap();
      toast({
        title: "تم التصدير",
        description: "تم تصدير بيانات الكوبونات بنجاح",
      });
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error?.data?.message || "حدث خطأ أثناء التصدير",
        variant: "destructive"
      });
    }
  };

  const printCoupon = (coupon: any) => {
    // إنشاء محتوى الطباعة
    const printContent = `
      <div style="font-family: Arial; padding: 20px; border: 2px solid #333; max-width: 400px;">
        <h2 style="text-align: center;">${coupon.name}</h2>
        <div style="text-align: center; font-size: 24px; font-weight: bold; color: #e74c3c;">
          ${coupon.code}
        </div>
        <p>${coupon.description}</p>
        <p><strong>القيمة:</strong> ${coupon.value}${coupon.type === "نسبة مئوية" ? "%" : " جنيه مصري"}</p>
        <p><strong>الحد الأدنى:</strong> ${coupon.minOrderAmount} جنيه مصري</p>
        <p><strong>صالح حتى:</strong> ${new Date(coupon.endDate).toLocaleDateString('ar-SA')}</p>
        <div style="text-align: center; margin-top: 20px;">
          <div style="border: 1px solid #333; padding: 10px; font-size: 12px;">
            ${coupon.code}
          </div>
        </div>
      </div>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow?.document.write(printContent);
    printWindow?.document.close();
    printWindow?.print();
    
    toast({
      title: "تم الطباعة",
      description: `تم إرسال الكوبون ${coupon.code} للطباعة`,
    });
  };

  const handleBulkAction = async (action: string) => {
    try {
      // تنفيذ العمليات المجمعة
      const selectedIds = coupons.filter((c: any) => c.status === "نشط").map((c: any) => c.id);
      
      // يمكن إضافة منطق للعمليات المجمعة هنا
      toast({
        title: "تم تنفيذ العملية",
        description: `تم ${action} الكوبونات المحددة بنجاح`,
      });
      refetch();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تنفيذ العملية المجمعة",
        variant: "destructive"
      });
    }
  };

  const handleDuplicateCoupon = async (coupon: any) => {
    try {
      await duplicateCoupon(coupon.id).unwrap();
      toast({
        title: "تم النسخ",
        description: "تم نسخ الكوبون بنجاح",
      });
      refetch();
    } catch (error) {
      toast({
        title: "خطأ",
        description: error?.data?.message || "حدث خطأ أثناء نسخ الكوبون",
        variant: "destructive"
      });
    }
  };

  const viewCouponDetails = (coupon: any) => {
    setSelectedCoupon(coupon);
    setShowCouponDetails(true);
  };

  const metrics = {
    activeCoupons: stats.activeCoupons || 0,
    totalRevenue: stats.totalRevenue || 0,
    totalUsage: stats.totalUsage || 0,
    avgConversionRate: stats.avgConversionRate || 0
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "نسبة مئوية":
        return <Percent className="w-4 h-4 text-blue-500" />;
      case "مبلغ ثابت":
        return <DollarSign className="w-4 h-4 text-green-500" />;
      case "نقاط مضاعفة":
        return <Star className="w-4 h-4 text-yellow-500" />;
      default:
        return <Gift className="w-4 h-4 text-purple-500" />;
    }
  };

  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch = coupon.code.includes(searchTerm.toUpperCase()) ||
                         coupon.name.includes(searchTerm) ||
                         coupon.description.includes(searchTerm);
    const matchesStatus = filterStatus === "all" || coupon.status === filterStatus;
    const matchesType = filterType === "all" || coupon.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  console.log("🔍 Filter results:", {
    totalCoupons: coupons.length,
    filteredCoupons: filteredCoupons.length,
    searchTerm,
    filterStatus,
    filterType
  });

  const copyCouponCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "تم النسخ",
      description: "تم نسخ رمز الكوبون إلى الحافظة",
    });
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                إدارة الكوبونات والعروض الذكية
              </h1>
              <p className="text-gray-600 flex items-center gap-2">
                <Gift className="w-4 h-4 text-purple-500" />
                نظام شامل لإنشاء وإدارة كوبونات الخصم وبرامج العروض الترويجية
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowAnalytics(true)}>
                <BarChart3 className="w-4 h-4 mr-2" />
                التحليلات
              </Button>
              <Dialog open={isNewCouponOpen} onOpenChange={setIsNewCouponOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600">
                    <Plus className="w-4 h-4 mr-2" />
                    كوبون جديد
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>إنشاء كوبون جديد</DialogTitle>
                    <DialogDescription>
                      قم بتحديد تفاصيل الكوبون وشروط الاستخدام بما يتماشى مع أفضل الممارسات العالمية
                    </DialogDescription>
                  </DialogHeader>

                  <Tabs defaultValue="basic" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="basic">البيانات الأساسية</TabsTrigger>
                      <TabsTrigger value="conditions">الشروط والقيود</TabsTrigger>
                      <TabsTrigger value="channels">القنوات والفروع</TabsTrigger>
                      <TabsTrigger value="advanced">الإعدادات المتقدمة</TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="code">رمز الكوبون</Label>
                          <div className="flex gap-2">
                            <Input
                              id="code"
                              value={couponFormData.code}
                              onChange={(e) => setCouponFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                              placeholder="SAVE20"
                            />
                            <Button type="button" variant="outline" onClick={generateCouponCode}>
                              <RefreshCw className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="name">اسم الكوبون</Label>
                          <Input
                            id="name"
                            value={couponFormData.name}
                            onChange={(e) => setCouponFormData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="خصم 20% للعملاء الجدد"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="description">وصف الكوبون</Label>
                        <Textarea
                          id="description"
                          value={couponFormData.description}
                          onChange={(e) => setCouponFormData(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="وصف مفصل للكوبون وشروط الاستخدام..."
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>نوع الخصم</Label>
                          <Select value={couponFormData.type} onValueChange={(value) => setCouponFormData(prev => ({ ...prev, type: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر نوع الخصم" />
                            </SelectTrigger>
                            <SelectContent>
                              {couponTypes.map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="value">قيمة الخصم</Label>
                          <Input
                            id="value"
                            type="number"
                            value={couponFormData.value}
                            onChange={(e) => setCouponFormData(prev => ({ ...prev, value: e.target.value }))}
                            placeholder="20"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="minOrderAmount">الحد الأدنى للطلب</Label>
                          <Input
                            id="minOrderAmount"
                            type="number"
                            value={couponFormData.minOrderAmount}
                            onChange={(e) => setCouponFormData(prev => ({ ...prev, minOrderAmount: e.target.value }))}
                            placeholder="100"
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="conditions" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="startDate">تاريخ البداية</Label>
                          <Input
                            id="startDate"
                            type="date"
                            value={couponFormData.startDate}
                            onChange={(e) => setCouponFormData(prev => ({ ...prev, startDate: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="endDate">تاريخ النهاية</Label>
                          <Input
                            id="endDate"
                            type="date"
                            value={couponFormData.endDate}
                            onChange={(e) => setCouponFormData(prev => ({ ...prev, endDate: e.target.value }))}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="usageLimit">عدد مرات الاستخدام</Label>
                          <Input
                            id="usageLimit"
                            type="number"
                            value={couponFormData.usageLimit}
                            onChange={(e) => setCouponFormData(prev => ({ ...prev, usageLimit: e.target.value }))}
                            placeholder="100"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="customerLimit">حد الاستخدام للعميل الواحد</Label>
                          <Input
                            id="customerLimit"
                            type="number"
                            value={couponFormData.customerLimit}
                            onChange={(e) => setCouponFormData(prev => ({ ...prev, customerLimit: e.target.value }))}
                            placeholder="1"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="maxDiscount">الحد الأقصى للخصم</Label>
                          <Input
                            id="maxDiscount"
                            type="number"
                            value={couponFormData.maxDiscount}
                            onChange={(e) => setCouponFormData(prev => ({ ...prev, maxDiscount: e.target.value }))}
                            placeholder="200"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="autoApply"
                            checked={couponFormData.autoApply}
                            onCheckedChange={(checked) => setCouponFormData(prev => ({ ...prev, autoApply: checked }))}
                          />
                          <Label htmlFor="autoApply">تطبيق تلقائي</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="stackable"
                            checked={couponFormData.stackable}
                            onCheckedChange={(checked) => setCouponFormData(prev => ({ ...prev, stackable: checked }))}
                          />
                          <Label htmlFor="stackable">قابل للتراكم مع كوبونات أخرى</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="firstTimeOnly"
                            checked={couponFormData.firstTimeOnly}
                            onCheckedChange={(checked) => setCouponFormData(prev => ({ ...prev, firstTimeOnly: checked }))}
                          />
                          <Label htmlFor="firstTimeOnly">للعملاء الجدد فقط</Label>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="channels" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>الخدمات المطبقة</Label>
                          <Select value={couponFormData.applicableServices} onValueChange={(value) => setCouponFormData(prev => ({ ...prev, applicableServices: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر الخدمات" />
                            </SelectTrigger>
                            <SelectContent>
                              {applicableServices.map(service => (
                                <SelectItem key={service} value={service}>{service}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>العملاء المستهدفون</Label>
                          <Select value={couponFormData.targetCustomers} onValueChange={(value) => setCouponFormData(prev => ({ ...prev, targetCustomers: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر العملاء" />
                            </SelectTrigger>
                            <SelectContent>
                              {targetCustomers.map(customer => (
                                <SelectItem key={customer} value={customer}>{customer}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>الفروع</Label>
                          <Select value={couponFormData.branches} onValueChange={(value) => setCouponFormData(prev => ({ ...prev, branches: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر الفروع" />
                            </SelectTrigger>
                            <SelectContent>
                              {branchOptions.map(branch => (
                                <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>قنوات التوزيع</Label>
                          <Select value={couponFormData.channels} onValueChange={(value) => setCouponFormData(prev => ({ ...prev, channels: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر القنوات" />
                            </SelectTrigger>
                            <SelectContent>
                              {channelOptions.map(channel => (
                                <SelectItem key={channel} value={channel}>{channel}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="advanced" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="terms">شروط وأحكام إضافية</Label>
                        <Textarea
                          id="terms"
                          value={couponFormData.terms}
                          onChange={(e) => setCouponFormData(prev => ({ ...prev, terms: e.target.value }))}
                          placeholder="أدخل أي شروط إضافية للكوبون..."
                          rows={4}
                        />
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsNewCouponOpen(false)}>
                      إلغاء
                    </Button>
                    <Button 
                      onClick={handleSaveCoupon} 
                      disabled={isCreating || isUpdating}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {isCreating || isUpdating ? "جاري الحفظ..." : (selectedCoupon ? "حفظ التعديلات" : "إنشاء الكوبون")}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">الكوبونات النشطة</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.activeCoupons}</div>
                <p className="text-xs text-muted-foreground">
                  من إجمالي {coupons.length} كوبون
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">إجمالي الإيرادات</CardTitle>
                <DollarSign className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.totalRevenue.toLocaleString()} جنيه مصري</div>
                <p className="text-xs text-muted-foreground">
                  من جميع الكوبونات
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">مرات الاستخدام</CardTitle>
                <Users className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.totalUsage.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  إجمالي الاستخدامات
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">معدل التحويل</CardTitle>
                <TrendingUp className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.avgConversionRate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">
                  متوسط جميع الكوبونات
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle>البحث والتصفية</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="البحث برمز الكوبون أو الاسم أو الوصف..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="نوع الكوبون" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الأنواع</SelectItem>
                    {couponTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الحالات</SelectItem>
                    <SelectItem value="نشط">نشط</SelectItem>
                    <SelectItem value="مجدول">مجدول</SelectItem>
                    <SelectItem value="منتهي">منتهي</SelectItem>
                    <SelectItem value="متوقف">متوقف</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" onClick={handleExportCoupons}>
                  <Download className="w-4 h-4 mr-2" />
                  تصدير
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Coupons List */}
          <Card>
            <CardHeader>
              <CardTitle>قائمة الكوبونات ({filteredCoupons.length})</CardTitle>
              <CardDescription>
                إدارة شاملة لجميع كوبونات الخصم والعروض الترويجية
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                  <p>جاري تحميل الكوبونات...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">
                  <AlertTriangle className="w-16 h-16 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">خطأ في تحميل البيانات</h3>
                  <p>{error?.data?.message || "حدث خطأ أثناء تحميل الكوبونات"}</p>
                  <Button className="mt-4" onClick={() => refetch()}>
                    إعادة المحاولة
                  </Button>
                </div>
              ) : filteredCoupons.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Gift className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">لا توجد كوبونات</h3>
                  <p>لم يتم العثور على أي كوبونات تطابق معايير البحث</p>
                  <Button 
                    className="mt-4" 
                    onClick={() => refetch()}
                  >
                    إعادة تحميل البيانات
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                {filteredCoupons.map((coupon) => (
                  <Card key={coupon.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        {/* معلومات الكوبون */}
                        <div className="flex-1 flex items-center justify-between gap-4">
                          {/* معلومات الكوبون الأساسية */}
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              {getTypeIcon(coupon.type)}
                              <div>
                                <div className="font-medium flex items-center gap-2">
                                  {coupon.code}
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => copyCouponCode(coupon.code)}
                                      >
                                        <Copy className="w-3 h-3" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>نسخ الرمز</TooltipContent>
                                  </Tooltip>
                                </div>
                                <div className="text-sm text-gray-500">{coupon.name}</div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {getStatusBadge(coupon.status)}
                              {coupon.autoApply && (
                                <Badge variant="outline" className="text-blue-600">
                                  <Zap className="w-3 h-3 mr-1" />
                                  تلقائي
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-4 gap-4 text-sm">
                            <div>
                              <div className="text-gray-500">القيمة</div>
                              <div className="font-medium">
                                {coupon.value}{coupon.type === "نسبة مئوية" ? "%" : " جنيه مصري"}
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-500">الاستخدام</div>
                              <div className="font-medium">{coupon.usedCount}/{coupon.usageLimit}</div>
                            </div>
                            <div>
                              <div className="text-gray-500">الإيرادات</div>
                              <div className="font-medium text-green-600">{coupon.revenue.toLocaleString()} جنيه مصري</div>
                            </div>
                            <div>
                              <div className="text-gray-500">معدل التحويل</div>
                              <div className="font-medium text-blue-600">{coupon.conversionRate}%</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => viewCouponDetails(coupon)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              </TooltipTrigger>
                              <TooltipContent>عرض التفاصيل</TooltipContent>
                            </Tooltip>
                            
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditCoupon(coupon)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>تعديل</TooltipContent>
                            </Tooltip>
                            
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDuplicateCoupon(coupon)}
                                >
                                  <Copy className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>نسخ الكوبون</TooltipContent>
                            </Tooltip>
                            
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => generateQRCode(coupon)}
                                >
                                  <QrCode className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>رمز QR</TooltipContent>
                            </Tooltip>
                            
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => printCoupon(coupon)}
                                >
                                  <Printer className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>طباعة</TooltipContent>
                            </Tooltip>
                            
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => sendCoupon(coupon, "واتساب")}
                                >
                                  <MessageSquare className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>إرسال واتساب</TooltipContent>
                            </Tooltip>
                            
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => sendCoupon(coupon, "إيميل")}
                                >
                                  <Mail className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>إرسال إيميل</TooltipContent>
                            </Tooltip>
                            
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleToggleStatus(coupon.id)}
                                >
                                  {coupon.status === "نشط" ? 
                                    <XCircle className="w-4 h-4" /> : 
                                    <CheckCircle className="w-4 h-4" />
                                  }
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                {coupon.status === "نشط" ? "إيقاف" : "تفعيل"}
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                </div>
              )}
            </CardContent>
        </Card>

        {/* Analytics Dialog */}
        <Dialog open={showAnalytics} onOpenChange={setShowAnalytics}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>تحليلات الكوبونات المتقدمة</DialogTitle>
              <DialogDescription>
                تحليل شامل لأداء الكوبونات وفعالية العروض الترويجية
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="performance" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="performance">الأداء</TabsTrigger>
                <TabsTrigger value="trends">الاتجاهات</TabsTrigger>
                <TabsTrigger value="recommendations">التوصيات</TabsTrigger>
              </TabsList>
              
              <TabsContent value="performance" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">أفضل الكوبونات أداءً</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {coupons
                          .sort((a, b) => b.conversionRate - a.conversionRate)
                          .slice(0, 3)
                          .map((coupon, index) => (
                            <div key={coupon.id} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                  index === 0 ? 'bg-yellow-100 text-yellow-800' :
                                  index === 1 ? 'bg-gray-100 text-gray-800' :
                                  'bg-orange-100 text-orange-800'
                                }`}>
                                  {index + 1}
                                </div>
                                <span className="font-medium">{coupon.code}</span>
                              </div>
                              <span className="text-sm font-bold text-green-600">
                                {coupon.conversionRate}%
                              </span>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">توزيع الاستخدام</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 flex items-center justify-center text-muted-foreground">
                        <div className="text-center">
                          <PieChart className="w-16 h-16 mx-auto mb-2" />
                          <p>رسم بياني للتوزيع</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="trends" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">اتجاه الاستخدام الشهري</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <TrendingUp className="w-16 h-16 mx-auto mb-2" />
                        <p>رسم بياني للاتجاهات</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="recommendations" className="space-y-4">
                <div className="space-y-4">
                  <h4 className="font-medium">التوصيات الذكية</h4>
                  
                  <div className="space-y-3">
                    {[
                      {
                        icon: <Award className="w-5 h-5 text-yellow-500" />,
                        title: "كوبون ترحيبي محسن",
                        description: "زيادة خصم العملاء الجدد إلى 20% يمكن أن يرفع التحويل بـ 35%",
                        action: "تطبيق التوصية"
                      },
                      {
                        icon: <Users className="w-5 h-5 text-blue-500" />,
                        title: "كوبونات مخصصة للعملاء VIP",
                        description: "إنشاء عروض حصرية للعملاء المميزين لزيادة الولاء",
                        action: "إنشاء كوبون VIP"
                      },
                      {
                        icon: <Calendar className="w-5 h-5 text-purple-500" />,
                        title: "عروض موسمية",
                        description: "تفعيل عروض خاصة للمناسبات والأعياد",
                        action: "جدولة عرض"
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
                               <Button size="sm" variant="outline" onClick={() => {
                                 if (rec.action === "تطبيق التوصية") {
                                   setCouponFormData(prev => ({ ...prev, code: "WELCOME20", name: "ترحيب محسن", type: "نسبة مئوية", value: "20" }));
                                   setIsNewCouponOpen(true);
                                 } else if (rec.action === "إنشاء كوبون VIP") {
                                   setCouponFormData(prev => ({ ...prev, code: "VIP_EXCLUSIVE", name: "كوبون VIP حصري", targetCustomers: "عملاء VIP" }));
                                   setIsNewCouponOpen(true);
                                 } else {
                                   toast({ title: "قريباً", description: "هذه الميزة ستكون متاحة قريباً" });
                                 }
                               }}>
                                {rec.action}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex gap-2">
              <Button className="flex-1" onClick={handleExportCoupons}>
                <Download className="w-4 h-4 mr-2" />
                تصدير التحليلات
              </Button>
              <Button variant="outline" onClick={() => setShowAnalytics(false)}>
                إغلاق
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
    </TooltipProvider>
  );
}