import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useGetAllBranchesQuery } from "@/services/branchesApi";
import { useGetAllMembersQuery } from "@/services/membersApi";
import {
  useGetAllSubscriptionsQuery,
  useCreateSubscriptionMutation,
  useUpdateSubscriptionMutation,
  useDeleteSubscriptionMutation,
  useGetSubscriptionStatisticsQuery,
  useGetSubscriptionTypesQuery,
} from "@/services/subscriptionsApi";
import { useGetTrainersQuery } from "@/services/employeesApi";
import {
  Plus, Save, Calendar as CalendarIcon, Search, Edit, Trash2, Receipt,
  Filter, Download, FileText, TrendingUp, DollarSign,
  CheckCircle, XCircle, Clock, Building, CreditCard,
  User, BarChart3, Tag, Activity, Award
} from "lucide-react";

const Subscriptions = () => {
  const { toast } = useToast();
  
  // State declarations
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBranch, setFilterBranch] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  
  // جلب الفروع
  const { data: branchesData, isLoading: branchesLoading } = useGetAllBranchesQuery(undefined as any);
  const branches = Array.isArray(branchesData?.data) ? branchesData.data : [];

  // جلب الأعضاء لاستخدامهم كعملاء في الاشتراك
  const { data: membersData } = useGetAllMembersQuery({} as any);
  const members = Array.isArray(membersData?.data) ? membersData.data : [];

  // جلب الاشتراكات من API (العادية فقط)
  const { data: subscriptionsData, isLoading: subscriptionsLoading, refetch: refetchSubscriptions } = useGetAllSubscriptionsQuery({
    search: searchQuery,
    branchId: filterBranch !== "all" ? filterBranch : undefined,
    subscriptionType: filterType !== "all" ? filterType : undefined,
    status: filterStatus !== "all" ? filterStatus : undefined,
    isSpecial: false,
  });
  const subscriptions = Array.isArray(subscriptionsData?.data) ? subscriptionsData.data : [];

  // جلب الكباتن/الموظفين من جدول الموظفين
  const { data: trainersData } = useGetTrainersQuery(undefined as any);
  const trainers = Array.isArray(trainersData?.data) ? trainersData.data : [];

  // جلب الإحصائيات (للاشتراكات العادية فقط)
  const { data: statisticsData } = useGetSubscriptionStatisticsQuery({ isSpecial: false });
  const statistics = statisticsData?.data || {};

  // Mutations
  const [createSubscription] = useCreateSubscriptionMutation();
  const [updateSubscription] = useUpdateSubscriptionMutation();
  const [deleteSubscription] = useDeleteSubscriptionMutation();

  // جلب أنواع الاشتراك من إعدادات أنواع الاشتراكات
  const { data: subscriptionTypesData } = useGetSubscriptionTypesQuery(undefined);
  const subscriptionTypes: any[] = Array.isArray(subscriptionTypesData?.data) ? subscriptionTypesData.data : [];
  const subscriptionTypeNames: string[] = subscriptionTypes.map((t) => t.name as string);
  
  const [showFilters, setShowFilters] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<any>(null);

  // دالة لتوليد رقم إيصال تلقائياً
  const generateReceiptNumber = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `SUB-${year}${month}${day}-${random}`;
  };

  const [formData, setFormData] = useState({
    registrationDate: "",
    branchId: "",
    customerName: "",
    memberId: "",
    memberCode: "",
    subscriptionType: "",
    subscriptionStartDate: "",
    subscriptionEndDate: "",
    subscriptionValue: "",
    discountEnabled: false,
    discountValue: "0",
    gender: "",
    employeeId: "",
    paymentMethod: "",
    paidAmount: "",
    remainingAmount: "0",
    receiptNumber: ""
  });

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [registrationDateInput, setRegistrationDateInput] = useState("");

  // تحويل Date إلى yyyy-mm-dd
  const convertDateToISO = (date: Date | string | undefined): string => {
    if (!date) return "";
    if (date instanceof Date) {
      return format(date, "yyyy-MM-dd");
    }
    // صيغة dd/mm/yyyy القادمة من حقل الإدخال
    const parts = date.split("/");
    if (parts.length === 3) {
      const [day, month, year] = parts;
      const parsed = new Date(Number(year), Number(month) - 1, Number(day));
      if (!isNaN(parsed.getTime())) {
        return format(parsed, "yyyy-MM-dd");
      }
    }
    return "";
  };

  // تحويل yyyy-mm-dd إلى Date
  const convertDateFromISO = (dateStr: string): Date | undefined => {
    if (!dateStr) return undefined;
    try {
      return new Date(dateStr);
    } catch {
      return undefined;
    }
  };

  // حساب تاريخ الانتهاء بناءً على عدد الأيام في نوع الاشتراك
  const calculateEndDateByDays = (start: Date | undefined, days?: number | string): Date | undefined => {
    if (!start) return undefined;
    const numericDays = Number(days);
    if (!numericDays || Number.isNaN(numericDays) || numericDays <= 0) return undefined;
    const result = new Date(start);
    // نضيف (عدد الأيام - 1) ليكون نفس يوم البدء محسوب ضمن المدة
    result.setDate(result.getDate() + (numericDays - 1));
    return result;
  };

  // حساب الباقي
  useEffect(() => {
    const value = parseFloat(formData.subscriptionValue) || 0;
    const discount = formData.discountEnabled ? (parseFloat(formData.discountValue) || 0) : 0;
    const paid = parseFloat(formData.paidAmount) || 0;
    const finalValue = value - discount;
    const remaining = finalValue - paid;
    setFormData((prev) => ({ ...prev, remainingAmount: remaining > 0 ? remaining.toString() : "0" }));
  }, [formData.subscriptionValue, formData.discountEnabled, formData.discountValue, formData.paidAmount]);

  // حساب حالة الاشتراك
  const getSubscriptionStatus = (startDate: string, endDate: string): string => {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (today < start) return "قادم";
    if (today > end) return "منتهي";
    return "نشط";
  };

  // فلترة الاشتراكات - يتم في API
  const filteredSubscriptions = subscriptions;

  // إحصائيات - يتم جلبها من API
  const stats = {
    total: statistics.total || 0,
    active: statistics.active || 0,
    expired: statistics.expired || 0,
    totalValue: statistics.totalValue || 0,
    paidValue: statistics.totalPaid || 0,
    remainingValue: statistics.totalRemaining || 0,
    monthly: statistics.monthlyCount || 0,
    annual: statistics.yearlyCount || 0,
  };

  // قائمة الحالات للفلترة
  const statuses = ["active", "expired", "upcoming"];

  const handleAdd = () => {
    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;
    const autoReceiptNumber = generateReceiptNumber();
    
    setFormData({
      registrationDate: "",
      branchId: "",
      customerName: "",
      memberId: "",
      memberCode: "",
      subscriptionType: "",
      subscriptionStartDate: "",
      subscriptionEndDate: "",
      subscriptionValue: "",
      discountEnabled: false,
      discountValue: "0",
      gender: "",
      employeeId: "",
      paymentMethod: "",
      paidAmount: "",
      remainingAmount: "0",
      receiptNumber: autoReceiptNumber
    });
    setRegistrationDateInput(formattedDate);
    setStartDate(undefined);
    setEndDate(undefined);
    setIsAddDialogOpen(true);
  };

  const handleEdit = (subscription: any) => {
    setSelectedSubscription(subscription);
    setFormData({
      registrationDate: subscription.registrationDate || "",
      branchId: subscription.branchId || "",
      customerName: subscription.customerName || "",
      memberId: (subscription as any).memberId || "",
      memberCode: (subscription as any).memberCode || (subscription as any).member?.memberCode || "",
      subscriptionType: subscription.subscriptionType || "",
      subscriptionStartDate: subscription.subscriptionStartDate || "",
      subscriptionEndDate: subscription.subscriptionEndDate || "",
      subscriptionValue: subscription.subscriptionValue || "",
      discountEnabled: subscription.discountEnabled || false,
      discountValue: subscription.discountValue || "0",
      gender: subscription.gender || "",
      employeeId: subscription.employeeId || "",
      paymentMethod: subscription.paymentMethod || "",
      paidAmount: subscription.paidAmount || "",
      remainingAmount: subscription.remainingAmount || "0",
      receiptNumber: subscription.receiptNumber || ""
    });
    if (subscription.registrationDate) {
      setRegistrationDateInput(subscription.registrationDate.includes('/') ? subscription.registrationDate : convertDateFromISO(subscription.registrationDate));
    }
    if (subscription.subscriptionStartDate) {
      setStartDate(convertDateFromISO(subscription.subscriptionStartDate));
    } else {
      setStartDate(undefined);
    }
    if (subscription.subscriptionEndDate) {
      setEndDate(convertDateFromISO(subscription.subscriptionEndDate));
    } else {
      setEndDate(undefined);
    }
    setIsEditDialogOpen(true);
  };

  const handleDelete = (subscription: any) => {
    setSelectedSubscription(subscription);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveAdd = async () => {
    // التحقق من الحقول المطلوبة
    if (!formData.branchId || !formData.memberId || !formData.subscriptionType ||
      !formData.subscriptionStartDate || !formData.subscriptionEndDate ||
      !formData.subscriptionValue || !formData.paymentMethod) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    try {
      const subscriptionData = {
        registrationDate: convertDateToISO(registrationDateInput),
        branchId: formData.branchId,
        customerName: formData.customerName,
        memberId: formData.memberId ? parseInt(formData.memberId as any, 10) : null,
        subscriptionType: formData.subscriptionType,
        subscriptionStartDate: convertDateToISO(startDate),
        subscriptionEndDate: convertDateToISO(endDate),
        subscriptionValue: formData.subscriptionValue,
        discountEnabled: formData.discountEnabled,
        discountValue: formData.discountValue,
        gender: formData.gender,
        employeeId: formData.employeeId || null,
        paymentMethod: formData.paymentMethod,
        paidAmount: formData.paidAmount || "0",
        receiptNumber: formData.receiptNumber,
      };

      await createSubscription(subscriptionData).unwrap();
      toast({
        title: "نجح",
        description: "تم إضافة الاشتراك بنجاح"
      });
      setIsAddDialogOpen(false);
      refetchSubscriptions();
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error?.data?.message || "حدث خطأ أثناء إضافة الاشتراك",
        variant: "destructive"
      });
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedSubscription) return;

    try {
      const subscriptionData = {
        registrationDate: convertDateToISO(registrationDateInput),
        branchId: formData.branchId,
        customerName: formData.customerName,
        memberId: formData.memberId ? parseInt(formData.memberId as any, 10) : null,
        subscriptionType: formData.subscriptionType,
        subscriptionStartDate: convertDateToISO(startDate),
        subscriptionEndDate: convertDateToISO(endDate),
        subscriptionValue: formData.subscriptionValue,
        discountEnabled: formData.discountEnabled,
        discountValue: formData.discountValue,
        gender: formData.gender,
        employeeId: formData.employeeId || null,
        paymentMethod: formData.paymentMethod,
        paidAmount: formData.paidAmount || "0",
        receiptNumber: formData.receiptNumber,
      };

      await updateSubscription({ id: selectedSubscription.id, data: subscriptionData }).unwrap();
      toast({
        title: "نجح",
        description: "تم تحديث الاشتراك بنجاح"
      });
      setIsEditDialogOpen(false);
      setSelectedSubscription(null);
      refetchSubscriptions();
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error?.data?.message || "حدث خطأ أثناء تحديث الاشتراك",
        variant: "destructive"
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedSubscription) return;

    try {
      await deleteSubscription(selectedSubscription.id).unwrap();
      toast({
        title: "نجح",
        description: "تم حذف الاشتراك بنجاح"
      });
      setIsDeleteDialogOpen(false);
      setSelectedSubscription(null);
      refetchSubscriptions();
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error?.data?.message || "حدث خطأ أثناء حذف الاشتراك",
        variant: "destructive"
      });
    }
  };


  const getStatusBadge = (startDate: string, endDate: string) => {
    const status = getSubscriptionStatus(startDate, endDate);
    if (status === "نشط") {
      return <Badge className="bg-green-500">نشط</Badge>;
    } else if (status === "منتهي") {
      return <Badge variant="destructive">منتهي</Badge>;
    } else {
      return <Badge className="bg-blue-500">قادم</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* العنوان والبحث */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">إدارة الاشتراكات</h1>
            <p className="text-gray-600 mt-1">إدارة الاشتراكات والمدفوعات</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="البحث عن اشتراك..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              فلتر
              {(filterBranch !== "all" || filterType !== "all" || filterStatus !== "all") && (
                <Badge className="bg-blue-500">{[filterBranch, filterType, filterStatus].filter(f => f !== "all").length}</Badge>
              )}
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              تصدير
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAdd}>
              <Plus className="w-5 h-5 ml-2" />
              إضافة اشتراك جديد
            </Button>
          </div>
        </div>

        {/* البطاقات الإحصائية */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>إجمالي الاشتراكات</span>
                <Receipt className="w-5 h-5 text-blue-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-green-500">{stats.active} نشط</Badge>
                <Badge variant="destructive">{stats.expired} منتهي</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>الاشتراكات النشطة</span>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.active}</div>
              <div className="mt-3">
                <Progress value={stats.total > 0 ? (stats.active / stats.total) * 100 : 0} className="h-2" />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                <TrendingUp className="w-3 h-3 inline ml-1" />
                {stats.total > 0 ? ((stats.active / stats.total) * 100).toFixed(1) : 0}% من إجمالي الاشتراكات
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>إجمالي القيمة</span>
                <DollarSign className="w-5 h-5 text-orange-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{stats.totalValue.toLocaleString()}</div>
              <p className="text-sm text-gray-500 mt-1">جنية مصري</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>المتبقي</span>
                <CreditCard className="w-5 h-5 text-purple-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{stats.remainingValue.toLocaleString()}</div>
              <p className="text-sm text-gray-500 mt-1">جنية مصري</p>
            </CardContent>
          </Card>
        </div>

        {/* بطاقات إضافية */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-l-4 border-l-cyan-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>المدفوع</span>
                <CheckCircle className="w-5 h-5 text-cyan-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cyan-600">{stats.paidValue.toLocaleString()}</div>
              <p className="text-sm text-gray-500 mt-1">جنية مصري</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-indigo-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>الاشتراكات الشهرية</span>
                <CalendarIcon className="w-5 h-5 text-indigo-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-600">{stats.monthly}</div>
              <p className="text-sm text-gray-500 mt-1">اشتراك</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-pink-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>الاشتراكات السنوية</span>
                <Award className="w-5 h-5 text-pink-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pink-600">{stats.annual}</div>
              <p className="text-sm text-gray-500 mt-1">اشتراك</p>
            </CardContent>
          </Card>
        </div>

        {/* الفلاتر */}
        {showFilters && (
          <Card className="border-2 border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-blue-600" />
                  الفلاتر
                </span>
                <Button variant="ghost" size="sm" onClick={() => {
                  setFilterBranch("all");
                  setFilterType("all");
                  setFilterStatus("all");
                }}>
                  <XCircle className="w-4 h-4 ml-1" />
                  إعادة تعيين
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>الفرع</Label>
                  <Select value={filterBranch} onValueChange={setFilterBranch}>
                    <SelectTrigger>
                      <SelectValue placeholder="جميع الفروع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الفروع</SelectItem>
                      {branches.map((branch: any) => (
                        <SelectItem key={branch.id} value={branch.id}>
                          {branch.arabicName || branch.englishName || branch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>نوع الاشتراك</Label>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger>
                      <SelectValue placeholder="جميع الأنواع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الأنواع</SelectItem>
                      {subscriptionTypeNames.map((type: string) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>الحالة</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="جميع الحالات" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الحالات</SelectItem>
                      {statuses.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* عرض الجدول */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Receipt className="w-5 h-5" />
                قائمة الاشتراكات ({filteredSubscriptions.length})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">تاريخ التسجيل</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">الفرع</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">اسم العميل</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">نوع الاشتراك</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">من</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">إلى</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">قيمة الاشتراك</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">المدفوع</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">الباقي</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">الحالة</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubscriptions.map((subscription: any) => (
                    <tr key={subscription.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 whitespace-nowrap text-sm">
                        {subscription.registrationDate ? (
                          subscription.registrationDate.includes('/') 
                            ? subscription.registrationDate 
                            : (() => {
                                const date = convertDateFromISO(subscription.registrationDate);
                                return date ? format(date, "PPP", { locale: ar }) : "-";
                              })()
                        ) : "-"}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm">
                        {branches.find((b: any) => b.id === subscription.branchId)?.arabicName ||
                          branches.find((b: any) => b.id === subscription.branchId)?.englishName ||
                          branches.find((b: any) => b.id === subscription.branchId)?.name || "-"}
                      </td>
                      <td className="py-3 px-4 font-semibold whitespace-nowrap">{subscription.customerName}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm">
                        {subscription.subscriptionType === "monthly" ? "شهري" :
                          subscription.subscriptionType === "quarterly" ? "ربع سنوي" :
                            subscription.subscriptionType === "semi-annual" ? "نصف سنوي" :
                              subscription.subscriptionType === "annual" ? "سنوي" :
                                subscription.subscriptionType}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm">
                        {subscription.subscriptionStartDate ? (
                          subscription.subscriptionStartDate.includes('/') 
                            ? subscription.subscriptionStartDate 
                            : (() => {
                                const date = convertDateFromISO(subscription.subscriptionStartDate);
                                return date ? format(date, "PPP", { locale: ar }) : "-";
                              })()
                        ) : "-"}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm">
                        {subscription.subscriptionEndDate ? (
                          subscription.subscriptionEndDate.includes('/') 
                            ? subscription.subscriptionEndDate 
                            : (() => {
                                const date = convertDateFromISO(subscription.subscriptionEndDate);
                                return date ? format(date, "PPP", { locale: ar }) : "-";
                              })()
                        ) : "-"}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm">{parseFloat(subscription.subscriptionValue || 0).toLocaleString()}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm text-green-600 font-semibold">{parseFloat(subscription.paidAmount || 0).toLocaleString()}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm text-red-600 font-semibold">{parseFloat(subscription.remainingAmount || 0).toLocaleString()}</td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {getStatusBadge(subscription.subscriptionStartDate, subscription.subscriptionEndDate)}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex gap-2 justify-end">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(subscription)} title="تعديل" className="hover:bg-blue-50">
                            <Edit className="w-4 h-4 text-blue-600" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(subscription)} title="حذف" className="hover:bg-red-50">
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredSubscriptions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Receipt className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>لا توجد نتائج مطابقة</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialog إضافة اشتراك جديد */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>إضافة اشتراك جديد</DialogTitle>
              <DialogDescription>
                أدخل جميع بيانات الاشتراك الجديد
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* تاريخ تسجيل الإشتراك */}
              <div className="space-y-2">
                <Label htmlFor="registrationDate">تاريخ تسجيل الإشتراك</Label>
                <Input
                  id="registrationDate"
                  value={registrationDateInput}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, "");
                    if (value.length >= 2) {
                      value = value.substring(0, 2) + "/" + value.substring(2);
                    }
                    if (value.length >= 5) {
                      value = value.substring(0, 5) + "/" + value.substring(5, 9);
                    }
                    setRegistrationDateInput(value);
                    const isoDate = convertDateToISO(value);
                    if (isoDate) {
                      setFormData({ ...formData, registrationDate: isoDate });
                    }
                  }}
                  placeholder="dd/mm/yyyy"
                  maxLength={10}
                />
              </div>

              {/* الفرع */}
              <div className="space-y-2">
                <Label htmlFor="branchId">الفرع *</Label>
                {branchesLoading ? (
                  <div className="text-sm text-muted-foreground">جاري تحميل الفروع...</div>
                ) : (
                  <Select
                    value={formData.branchId}
                    onValueChange={(value) => setFormData({ ...formData, branchId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الفرع" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map((branch: any) => (
                        <SelectItem key={branch.id} value={branch.id}>
                          {branch.arabicName || branch.englishName || branch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* إسم العميل (من جدول الأعضاء) */}
              <div className="space-y-2">
                <Label htmlFor="memberId">إسم العميل *</Label>
                <Select
                  value={formData.memberId}
                  onValueChange={(value) => {
                    const selectedMember = members.find((m: any) => m.id === value);
                    setFormData({
                      ...formData,
                      memberId: value,
                      customerName: selectedMember?.name || "",
                      memberCode: selectedMember?.memberCode || "",
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر العضو" />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((member: any) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name} {member.memberCode ? `(${member.memberCode})` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* كود العضو - عرض فقط */}
              <div className="space-y-2">
                <Label htmlFor="memberCode">كود العضو</Label>
                <Input
                  id="memberCode"
                  value={formData.memberCode || "سيتم إنشاؤه تلقائياً"}
                  disabled
                  className="bg-gray-100 text-gray-600 cursor-not-allowed"
                  placeholder="سيتم إنشاؤه تلقائياً"
                />
              </div>

              {/* نوع الإشتراك */}
              <div className="space-y-2">
                <Label htmlFor="subscriptionType">نوع الإشتراك *</Label>
                <Select
                value={formData.subscriptionType}
                onValueChange={(value) => {
                  const selectedType = subscriptionTypes.find((t) => t.name === value);
                  const updates: any = { ...formData, subscriptionType: value };
                  if (selectedType?.price !== undefined) {
                    updates.subscriptionValue = String(selectedType.price);
                  }
                  if (startDate && selectedType?.days) {
                    const calculatedEnd = calculateEndDateByDays(startDate, selectedType.days);
                    setEndDate(calculatedEnd);
                    updates.subscriptionEndDate = calculatedEnd ? convertDateToISO(calculatedEnd) : "";
                  }
                  setFormData(updates);
                }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع الاشتراك" />
                  </SelectTrigger>
                  <SelectContent>
                    {subscriptionTypeNames.map((type: string) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* مدة الإشتراك من */}
              <div className="space-y-2">
                <Label htmlFor="subscriptionStartDate">مدة الإشتراك من *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-right font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="ml-2 h-4 w-4" />
                      {startDate ? (
                        format(startDate, "PPP", { locale: ar })
                      ) : (
                        <span>اختر تاريخ البدء</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => {
                        setStartDate(date);
                        const selectedType = subscriptionTypes.find((t) => t.name === formData.subscriptionType);
                        const updates: any = { ...formData, subscriptionStartDate: date ? convertDateToISO(date) : "" };
                        if (date && selectedType?.days) {
                          const calculatedEnd = calculateEndDateByDays(date, selectedType.days);
                          setEndDate(calculatedEnd);
                          updates.subscriptionEndDate = calculatedEnd ? convertDateToISO(calculatedEnd) : "";
                        }
                        setFormData(updates);
                      }}
                      initialFocus
                      locale={ar}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* مدة الإشتراك إلى */}
              <div className="space-y-2">
                <Label htmlFor="subscriptionEndDate">مدة الإشتراك إلى *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-right font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="ml-2 h-4 w-4" />
                      {endDate ? (
                        format(endDate, "PPP", { locale: ar })
                      ) : (
                        <span>اختر تاريخ الانتهاء</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => {
                        setEndDate(date);
                        if (date) {
                          setFormData({ ...formData, subscriptionEndDate: convertDateToISO(date) });
                        }
                      }}
                      disabled={(date) => startDate ? date < startDate : false}
                      initialFocus
                      locale={ar}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* قيمة الإشتراك */}
              <div className="space-y-2">
                <Label htmlFor="subscriptionValue">قيمة الإشتراك *</Label>
                <Input
                  id="subscriptionValue"
                  type="number"
                  value={formData.subscriptionValue}
                  onChange={(e) => {
                    setFormData({ ...formData, subscriptionValue: e.target.value });
                  }}
                  placeholder="0"
                />
              </div>

              {/* حالة الخصم */}
              <div className="space-y-2 flex items-center gap-4 pt-6">
                <Switch
                  checked={formData.discountEnabled}
                  onCheckedChange={(checked) => {
                    setFormData({ ...formData, discountEnabled: checked });
                  }}
                />
                <Label htmlFor="discountEnabled">حالة الخصم</Label>
              </div>

              {/* قيمة الخصم */}
              <div className="space-y-2">
                <Label htmlFor="discountValue">قيمة الخصم</Label>
                <Input
                  id="discountValue"
                  type="number"
                  value={formData.discountValue}
                  onChange={(e) => {
                    setFormData({ ...formData, discountValue: e.target.value });
                  }}
                  placeholder="0"
                  disabled={!formData.discountEnabled}
                />
              </div>

              {/* رجالي-حريمي */}
              <div className="space-y-2">
                <Label htmlFor="gender">رجالي-حريمي</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => setFormData({ ...formData, gender: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">رجالي</SelectItem>
                    <SelectItem value="female">حريمي</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* الكابتن / الموظف */}
              {/* <div className="space-y-2">
                <Label htmlFor="employeeId">الكابتن / الموظف</Label>
                <Select
                  value={formData.employeeId}
                  onValueChange={(value) => setFormData({ ...formData, employeeId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الموظف" />
                  </SelectTrigger>
                  <SelectContent>
                    {trainers.map((employee: any) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.arabicName || employee.englishName || employee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div> */}

              {/* طريقة الدفع */}
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">طريقة الدفع *</Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر طريقة الدفع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">نقدي</SelectItem>
                    <SelectItem value="card">بطاقة</SelectItem>
                    <SelectItem value="bank">تحويل بنكي</SelectItem>
                    <SelectItem value="online">دفع إلكتروني</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* المدفوع */}
              <div className="space-y-2">
                <Label htmlFor="paidAmount">المدفوع *</Label>
                <Input
                  id="paidAmount"
                  type="number"
                  value={formData.paidAmount}
                  onChange={(e) => {
                    setFormData({ ...formData, paidAmount: e.target.value });
                  }}
                  placeholder="0"
                />
              </div>

              {/* الباقي */}
              <div className="space-y-2">
                <Label htmlFor="remainingAmount">الباقي</Label>
                <Input
                  id="remainingAmount"
                  type="number"
                  value={formData.remainingAmount}
                  readOnly
                  className="bg-gray-100"
                />
              </div>

              {/* رقم الايصال - تلقائي */}
              <div className="space-y-2 md:col-span-3">
                <Label htmlFor="receiptNumber">رقم الايصال</Label>
                <Input
                  id="receiptNumber"
                  value={formData.receiptNumber}
                  readOnly
                  className="bg-gray-100 text-gray-600 cursor-not-allowed"
                  placeholder="سيتم توليده تلقائياً"
                />
                <p className="text-xs text-gray-500">سيتم توليد رقم الإيصال تلقائياً</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={handleSaveAdd} className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 ml-2" />
                حفظ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog تعديل اشتراك */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>تعديل الاشتراك</DialogTitle>
              <DialogDescription>
                قم بتعديل بيانات الاشتراك
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* نفس الحقول كما في الإضافة */}
              <div className="space-y-2">
                <Label htmlFor="edit-registrationDate">تاريخ تسجيل الإشتراك</Label>
                <Input
                  id="edit-registrationDate"
                  value={registrationDateInput}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, "");
                    if (value.length >= 2) {
                      value = value.substring(0, 2) + "/" + value.substring(2);
                    }
                    if (value.length >= 5) {
                      value = value.substring(0, 5) + "/" + value.substring(5, 9);
                    }
                    setRegistrationDateInput(value);
                    const isoDate = convertDateToISO(value);
                    if (isoDate) {
                      setFormData({ ...formData, registrationDate: isoDate });
                    }
                  }}
                  placeholder="dd/mm/yyyy"
                  maxLength={10}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-branchId">الفرع *</Label>
                <Select
                  value={formData.branchId}
                  onValueChange={(value) => setFormData({ ...formData, branchId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الفرع" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branch: any) => (
                      <SelectItem key={branch.id} value={branch.id}>
                        {branch.arabicName || branch.englishName || branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-customerName">إسم العميل *</Label>
                <Input
                  id="edit-customerName"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="أدخل اسم العميل"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-memberCode">كود العضو</Label>
                <Input
                  id="edit-memberCode"
                  value={formData.memberCode || "غير متوفر"}
                  disabled
                  className="bg-gray-100 text-gray-600 cursor-not-allowed"
                />
              </div>

              {/* باقي الحقول مثل الإضافة */}
              <div className="space-y-2">
                <Label htmlFor="edit-subscriptionType">نوع الإشتراك *</Label>
                <Select
                value={formData.subscriptionType}
                onValueChange={(value) => {
                  const selectedType = subscriptionTypes.find((t) => t.name === value);
                  const updates: any = { ...formData, subscriptionType: value };
                  if (selectedType?.price !== undefined) {
                    updates.subscriptionValue = String(selectedType.price);
                  }
                  if (startDate && selectedType?.days) {
                    const calculatedEnd = calculateEndDateByDays(startDate, selectedType.days);
                    setEndDate(calculatedEnd);
                    updates.subscriptionEndDate = calculatedEnd ? convertDateToISO(calculatedEnd) : "";
                  }
                  setFormData(updates);
                }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع الاشتراك" />
                  </SelectTrigger>
                  <SelectContent>
                    {subscriptionTypeNames.map((type: string) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-subscriptionStartDate">مدة الإشتراك من *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-right font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="ml-2 h-4 w-4" />
                      {startDate ? (
                        format(startDate, "PPP", { locale: ar })
                      ) : (
                        <span>اختر تاريخ البدء</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => {
                        setStartDate(date);
                        const selectedType = subscriptionTypes.find((t) => t.name === formData.subscriptionType);
                        const updates: any = { ...formData, subscriptionStartDate: date ? convertDateToISO(date) : "" };
                        if (date && selectedType?.days) {
                          const calculatedEnd = calculateEndDateByDays(date, selectedType.days);
                          setEndDate(calculatedEnd);
                          updates.subscriptionEndDate = calculatedEnd ? convertDateToISO(calculatedEnd) : "";
                        }
                        setFormData(updates);
                      }}
                      initialFocus
                      locale={ar}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-subscriptionEndDate">مدة الإشتراك إلى *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-right font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="ml-2 h-4 w-4" />
                      {endDate ? (
                        format(endDate, "PPP", { locale: ar })
                      ) : (
                        <span>اختر تاريخ الانتهاء</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => {
                        setEndDate(date);
                        if (date) {
                          setFormData({ ...formData, subscriptionEndDate: convertDateToISO(date) });
                        }
                      }}
                      disabled={(date) => startDate ? date < startDate : false}
                      initialFocus
                      locale={ar}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-subscriptionValue">قيمة الإشتراك *</Label>
                <Input
                  id="edit-subscriptionValue"
                  type="number"
                  value={formData.subscriptionValue}
                  onChange={(e) => {
                    setFormData({ ...formData, subscriptionValue: e.target.value });
                  }}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2 flex items-center gap-4 pt-6">
                <Switch
                  checked={formData.discountEnabled}
                  onCheckedChange={(checked) => {
                    setFormData({ ...formData, discountEnabled: checked });
                  }}
                />
                <Label htmlFor="edit-discountEnabled">حالة الخصم</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-discountValue">قيمة الخصم</Label>
                <Input
                  id="edit-discountValue"
                  type="number"
                  value={formData.discountValue}
                  onChange={(e) => {
                    setFormData({ ...formData, discountValue: e.target.value });
                  }}
                  placeholder="0"
                  disabled={!formData.discountEnabled}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-gender">رجالي-حريمي</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => setFormData({ ...formData, gender: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">رجالي</SelectItem>
                    <SelectItem value="female">حريمي</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-employeeId">الكابتن / الموظف</Label>
                <Select
                  value={formData.employeeId}
                  onValueChange={(value) => setFormData({ ...formData, employeeId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الموظف" />
                  </SelectTrigger>
                  <SelectContent>
                    {trainers.map((employee: any) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.arabicName || employee.englishName || employee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-paymentMethod">طريقة الدفع *</Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر طريقة الدفع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">نقدي</SelectItem>
                    <SelectItem value="card">بطاقة</SelectItem>
                    <SelectItem value="bank">تحويل بنكي</SelectItem>
                    <SelectItem value="online">دفع إلكتروني</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-paidAmount">المدفوع *</Label>
                <Input
                  id="edit-paidAmount"
                  type="number"
                  value={formData.paidAmount}
                  onChange={(e) => {
                    setFormData({ ...formData, paidAmount: e.target.value });
                  }}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-remainingAmount">الباقي</Label>
                <Input
                  id="edit-remainingAmount"
                  type="number"
                  value={formData.remainingAmount}
                  readOnly
                  className="bg-gray-100"
                />
              </div>

              <div className="space-y-2 md:col-span-3">
                <Label htmlFor="edit-receiptNumber">رقم الايصال</Label>
                <Input
                  id="edit-receiptNumber"
                  value={formData.receiptNumber || "غير متوفر"}
                  readOnly
                  className="bg-gray-100 text-gray-600 cursor-not-allowed"
                  placeholder="رقم الإيصال"
                />
                <p className="text-xs text-gray-500">رقم الإيصال غير قابل للتعديل</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={handleSaveEdit} className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 ml-2" />
                حفظ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog حذف اشتراك */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>تأكيد الحذف</DialogTitle>
              <DialogDescription>
                هل أنت متأكد من حذف اشتراك {selectedSubscription?.customerName}؟ هذا الإجراء لا يمكن التراجع عنه.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                إلغاء
              </Button>
              <Button variant="destructive" onClick={handleConfirmDelete}>
                <Trash2 className="w-4 h-4 ml-2" />
                حذف
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Subscriptions;
