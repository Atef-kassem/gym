import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useGetAllMembersQuery } from "@/services/membersApi";
import { useGetAllSubscriptionsQuery } from "@/services/subscriptionsApi";
import { useGetAllBranchesQuery } from "@/services/branchesApi";
import {
  useCheckInMutation,
  useGetAttendanceRecordsQuery,
} from "@/services/memberAttendanceApi";
import {
  Search, Barcode, User, Calendar, CreditCard, Clock,
  CheckCircle, XCircle, Phone, Mail, MapPin, Building,
  TrendingUp, Award, Activity, Users, FileText, AlertCircle,
  LogIn, LogOut, Filter, RefreshCw, History
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, differenceInDays, isAfter, isBefore } from "date-fns";
import { ar } from "date-fns/locale";

const BarcodeSearch = () => {
  const { toast } = useToast();
  const [barcode, setBarcode] = useState("");
  const [searchedMember, setSearchedMember] = useState<any>(null);
  const [memberSubscriptions, setMemberSubscriptions] = useState<any[]>([]);
  const [attendanceFilters, setAttendanceFilters] = useState({
    memberId: null as number | null,
    branchId: "",
    startDate: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    status: "",
  });
  
  // فلاتر البحث الكامل (لجميع عمليات المسح)
  const [globalAttendanceFilters, setGlobalAttendanceFilters] = useState({
    branchId: "",
    startDate: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    status: "",
    search: "",
  });
  
  const [lastCheckIn, setLastCheckIn] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"search" | "history">("search");

  // جلب الفروع
  const { data: branchesData } = useGetAllBranchesQuery(undefined as any);
  const branches = Array.isArray(branchesData?.data) ? branchesData.data : [];

  // البحث عن العضو بالباركود
  const { data: membersData, refetch: refetchMembers } = useGetAllMembersQuery({
    search: barcode,
  }, { skip: !barcode });

  // جلب جميع الاشتراكات ثم فلترتها حسب العضو
  const { data: subscriptionsData, refetch: refetchSubscriptions } = useGetAllSubscriptionsQuery({}, { skip: !searchedMember?.id });

  // API للحضور
  const [checkIn, { isLoading: isCheckingIn }] = useCheckInMutation();
  
  // سجل الحضور للعضو المحدد
  const { data: attendanceRecordsData, refetch: refetchAttendance } = useGetAttendanceRecordsQuery({
    memberId: attendanceFilters.memberId || undefined,
    branchId: attendanceFilters.branchId || undefined,
    startDate: attendanceFilters.startDate,
    endDate: attendanceFilters.endDate,
    status: attendanceFilters.status || undefined,
  }, { skip: false });
  
  // سجل الحضور الكامل (لجميع الأعضاء) للبحث بالفترة
  const { data: allAttendanceRecordsData, refetch: refetchAllAttendance } = useGetAttendanceRecordsQuery({
    branchId: globalAttendanceFilters.branchId || undefined,
    startDate: globalAttendanceFilters.startDate,
    endDate: globalAttendanceFilters.endDate,
    status: globalAttendanceFilters.status || undefined,
  }, { skip: activeTab !== "history" });
  
  const attendanceRecords = Array.isArray(attendanceRecordsData) ? attendanceRecordsData : [];
  
  // فلترة سجل الحضور الكامل بالبحث
  const allAttendanceRecords = useMemo(() => {
    if (!allAttendanceRecordsData) return [];
    let records = Array.isArray(allAttendanceRecordsData) ? allAttendanceRecordsData : [];
    
    // فلترة بالبحث النصي
    if (globalAttendanceFilters.search.trim()) {
      const searchLower = globalAttendanceFilters.search.toLowerCase();
      records = records.filter((record: any) =>
        record.memberName?.toLowerCase().includes(searchLower) ||
        record.memberCode?.toLowerCase().includes(searchLower) ||
        record.member?.name?.toLowerCase().includes(searchLower) ||
        record.member?.memberCode?.toLowerCase().includes(searchLower)
      );
    }
    
    return records;
  }, [allAttendanceRecordsData, globalAttendanceFilters.search]);

  useEffect(() => {
    if (membersData?.data && Array.isArray(membersData.data) && membersData.data.length > 0) {
      // البحث عن العضو الذي يطابق الباركود بالضبط
      const member = membersData.data.find((m: any) => 
        m.memberCode === barcode || 
        m.cardNumber === barcode ||
        m.idNumber === barcode
      );
      
      if (member) {
        setSearchedMember(member);
        // تسجيل الحضور تلقائياً
        handleAutoCheckIn(member);
      } else if (membersData.data.length === 1) {
        // إذا كان هناك عضو واحد فقط، استخدمه
        const foundMember = membersData.data[0];
        setSearchedMember(foundMember);
        // تسجيل الحضور تلقائياً
        handleAutoCheckIn(foundMember);
      } else {
        setSearchedMember(null);
        toast({
          title: "لم يتم العثور على العضو",
          description: "يرجى التحقق من الباركود",
          variant: "destructive"
        });
      }
    } else if (barcode && membersData?.data && membersData.data.length === 0) {
      setSearchedMember(null);
      toast({
        title: "لم يتم العثور على العضو",
        description: "يرجى التحقق من الباركود",
        variant: "destructive"
      });
    }
  }, [membersData, barcode, toast]);

  useEffect(() => {
    if (searchedMember?.id && subscriptionsData?.data) {
      const subscriptions = Array.isArray(subscriptionsData.data) 
        ? subscriptionsData.data.filter((sub: any) => 
            sub.memberId === searchedMember.id || 
            (sub as any).member?.id === searchedMember.id ||
            (sub as any).customerId === searchedMember.id
          )
        : [];
      setMemberSubscriptions(subscriptions);
    } else {
      setMemberSubscriptions([]);
    }
  }, [subscriptionsData, searchedMember]);

  // تحديث فلاتر الحضور عند تغيير العضو
  useEffect(() => {
    if (searchedMember?.id) {
      setAttendanceFilters(prev => ({
        ...prev,
        memberId: searchedMember.id,
      }));
      refetchAttendance();
    }
  }, [searchedMember]);

  // تسجيل الحضور تلقائياً
  const handleAutoCheckIn = async (member: any) => {
    try {
      const result = await checkIn({
        memberId: member.id,
        memberCode: member.memberCode,
        branchId: member.branchId,
      }).unwrap();

      if (result.success) {
        setLastCheckIn(result.data);
        toast({
          title: "تم تسجيل الدخول",
          description: `تم تسجيل دخول ${member.name} بنجاح`,
          variant: "default",
        });
        refetchAttendance();
      }
    } catch (error: any) {
      // إذا كان الخطأ هو أن العضو مسجل دخول بالفعل، لا نعرض رسالة خطأ
      if (error?.data?.message?.includes("مسجل دخول بالفعل")) {
        setLastCheckIn(error.data.data);
      } else {
        console.error("Error checking in:", error);
      }
    }
  };

  const handleSearch = () => {
    if (!barcode.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال الباركود",
        variant: "destructive"
      });
      return;
    }
    refetchMembers();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // حساب حالة الاشتراك
  const getSubscriptionStatus = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return { status: "unknown", days: 0, color: "gray" };
    
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isBefore(today, start)) {
      return { status: "upcoming", days: differenceInDays(start, today), color: "blue" };
    } else if (isAfter(today, end)) {
      return { status: "expired", days: differenceInDays(today, end), color: "red" };
    } else {
      return { status: "active", days: differenceInDays(end, today), color: "green" };
    }
  };

  // تحويل التاريخ
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    try {
      const date = new Date(dateStr);
      return format(date, "PPP", { locale: ar });
    } catch {
      return dateStr;
    }
  };

  // الحصول على أحدث اشتراك نشط
  const getActiveSubscription = () => {
    if (!memberSubscriptions.length) return null;
    
    const today = new Date();
    const activeSubs = memberSubscriptions.filter((sub: any) => {
      if (!sub.subscriptionStartDate || !sub.subscriptionEndDate) return false;
      const start = new Date(sub.subscriptionStartDate);
      const end = new Date(sub.subscriptionEndDate);
      return isAfter(today, start) && isBefore(today, end);
    });
    
    if (activeSubs.length > 0) {
      // ترتيب حسب تاريخ الانتهاء (الأحدث أولاً)
      activeSubs.sort((a: any, b: any) => {
        const dateA = new Date(a.subscriptionEndDate);
        const dateB = new Date(b.subscriptionEndDate);
        return dateB.getTime() - dateA.getTime();
      });
      return activeSubs[0];
    }
    
    // إذا لم يكن هناك اشتراك نشط، أرجع أحدث اشتراك
    const sorted = [...memberSubscriptions].sort((a: any, b: any) => {
      const dateA = new Date(a.subscriptionEndDate || 0);
      const dateB = new Date(b.subscriptionEndDate || 0);
      return dateB.getTime() - dateA.getTime();
    });
    return sorted[0];
  };

  const activeSubscription = getActiveSubscription();
  const subscriptionStatus = activeSubscription 
    ? getSubscriptionStatus(activeSubscription.subscriptionStartDate, activeSubscription.subscriptionEndDate)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* العنوان */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Barcode className="w-8 h-8 text-blue-600" />
              البحث بالباركود
            </h1>
            <p className="text-gray-600 mt-1">ابحث عن العضو باستخدام الباركود أو كود العضو</p>
          </div>
        </div>

        {/* التبويبات */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "search" | "history")} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="search">بحث عن عضو</TabsTrigger>
            <TabsTrigger value="history">سجل عمليات المسح</TabsTrigger>
          </TabsList>

          {/* تبويب البحث عن عضو */}
          <TabsContent value="search" className="space-y-6">

        {/* حقل البحث */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-600" />
              إدخال الباركود
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  placeholder="أدخل الباركود أو كود العضو..."
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="text-lg"
                  autoFocus
                />
              </div>
              <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
                <Search className="w-5 h-5 ml-2" />
                بحث
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* نتائج البحث */}
        {searchedMember && (
          <div className="space-y-6">
            {/* معلومات العضو الأساسية */}
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  معلومات العضو
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-600">الاسم</Label>
                    <p className="text-lg font-bold">{searchedMember.name}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-600">كود العضو</Label>
                    <p className="text-lg font-mono">{searchedMember.memberCode || "-"}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-600">رقم البطاقة</Label>
                    <p className="text-lg font-mono">{searchedMember.cardNumber || searchedMember.idNumber || "-"}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-600">رقم الموبايل</Label>
                    <p className="text-lg flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {searchedMember.phone || "-"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-600">البريد الإلكتروني</Label>
                    <p className="text-lg flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {searchedMember.email || "-"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-600">الفرع</Label>
                    <p className="text-lg flex items-center gap-2">
                      <Building className="w-4 h-4 text-gray-400" />
                      {branches.find((b: any) => b.id === searchedMember.branchId)?.arabicName || 
                       branches.find((b: any) => b.id === searchedMember.branchId)?.englishName || 
                       branches.find((b: any) => b.id === searchedMember.branchId)?.name || "-"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-600">الجنس</Label>
                    <p className="text-lg">
                      {searchedMember.gender === "male" ? "ذكر" : searchedMember.gender === "female" ? "أنثى" : "-"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-600">تاريخ الميلاد</Label>
                    <p className="text-lg flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {searchedMember.dateOfBirth ? formatDate(searchedMember.dateOfBirth) : "-"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-600">العنوان</Label>
                    <p className="text-lg flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {searchedMember.address || "-"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* حالة الاشتراك الحالي */}
            {activeSubscription && subscriptionStatus && (
              <Card className={`border-l-4 ${
                subscriptionStatus.color === "green" 
                  ? "border-l-green-500 bg-green-50/50" 
                  : subscriptionStatus.color === "red"
                  ? "border-l-red-500 bg-red-50/50"
                  : "border-l-blue-500 bg-blue-50/50"
              }`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {subscriptionStatus.color === "green" ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : subscriptionStatus.color === "red" ? (
                      <XCircle className="w-5 h-5 text-red-600" />
                    ) : (
                      <Clock className="w-5 h-5 text-blue-600" />
                    )}
                    حالة الاشتراك الحالي
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">نوع الاشتراك</p>
                        <p className="text-lg font-bold">{activeSubscription.subscriptionType || "-"}</p>
                      </div>
                      <Badge className={
                        subscriptionStatus.color === "green" 
                          ? "bg-green-500" 
                          : subscriptionStatus.color === "red"
                          ? "bg-red-500"
                          : "bg-blue-500"
                      }>
                        {subscriptionStatus.status === "active" ? "نشط" : 
                         subscriptionStatus.status === "expired" ? "منتهي" : 
                         subscriptionStatus.status === "upcoming" ? "قادم" : "غير معروف"}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">تاريخ البدء</p>
                        <p className="text-lg font-semibold">{formatDate(activeSubscription.subscriptionStartDate)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">تاريخ الانتهاء</p>
                        <p className="text-lg font-semibold">{formatDate(activeSubscription.subscriptionEndDate)}</p>
                      </div>
                    </div>

                    {subscriptionStatus.status === "active" && (
                      <div className="bg-green-100 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <p className="font-semibold text-green-800">الاشتراك نشط</p>
                        </div>
                        <p className="text-green-700">
                          متبقي {subscriptionStatus.days} يوم على انتهاء الاشتراك
                        </p>
                        <Progress 
                          value={(subscriptionStatus.days / 365) * 100} 
                          className="mt-2 h-2"
                        />
                      </div>
                    )}

                    {subscriptionStatus.status === "expired" && (
                      <div className="bg-red-100 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <XCircle className="w-5 h-5 text-red-600" />
                          <p className="font-semibold text-red-800">الاشتراك منتهي</p>
                        </div>
                        <p className="text-red-700">
                          انتهى الاشتراك منذ {subscriptionStatus.days} يوم
                        </p>
                      </div>
                    )}

                    {subscriptionStatus.status === "upcoming" && (
                      <div className="bg-blue-100 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-5 h-5 text-blue-600" />
                          <p className="font-semibold text-blue-800">الاشتراك قادم</p>
                        </div>
                        <p className="text-blue-700">
                          سيبدأ الاشتراك بعد {subscriptionStatus.days} يوم
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* جميع الاشتراكات */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  جميع الاشتراكات ({memberSubscriptions.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {memberSubscriptions.length > 0 ? (
                  <div className="space-y-4">
                    {memberSubscriptions.map((subscription: any) => {
                      const status = getSubscriptionStatus(
                        subscription.subscriptionStartDate,
                        subscription.subscriptionEndDate
                      );
                      return (
                        <Card 
                          key={subscription.id}
                          className={`border-l-4 ${
                            status.color === "green" 
                              ? "border-l-green-500" 
                              : status.color === "red"
                              ? "border-l-red-500"
                              : "border-l-blue-500"
                          }`}
                        >
                          <CardContent className="pt-6">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2 flex-1">
                                <div className="flex items-center gap-2">
                                  <Badge className={
                                    status.color === "green" 
                                      ? "bg-green-500" 
                                      : status.color === "red"
                                      ? "bg-red-500"
                                      : "bg-blue-500"
                                  }>
                                    {status.status === "active" ? "نشط" : 
                                     status.status === "expired" ? "منتهي" : 
                                     status.status === "upcoming" ? "قادم" : "غير معروف"}
                                  </Badge>
                                  <span className="font-semibold">{subscription.subscriptionType || "-"}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <p className="text-gray-600">من:</p>
                                    <p className="font-semibold">{formatDate(subscription.subscriptionStartDate)}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-600">إلى:</p>
                                    <p className="font-semibold">{formatDate(subscription.subscriptionEndDate)}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4 text-sm">
                                  <div>
                                    <p className="text-gray-600">القيمة:</p>
                                    <p className="font-semibold">{parseFloat(subscription.subscriptionValue || 0).toLocaleString()} جنيه</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-600">المدفوع:</p>
                                    <p className="font-semibold text-green-600">{parseFloat(subscription.paidAmount || 0).toLocaleString()} جنيه</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-600">الباقي:</p>
                                    <p className="font-semibold text-red-600">{parseFloat(subscription.remainingAmount || 0).toLocaleString()} جنيه</p>
                                  </div>
                                </div>
                                {status.status === "active" && (
                                  <div className="mt-2">
                                    <p className="text-sm text-green-700">
                                      متبقي {status.days} يوم
                                    </p>
                                  </div>
                                )}
                                {status.status === "expired" && (
                                  <div className="mt-2">
                                    <p className="text-sm text-red-700">
                                      انتهى منذ {status.days} يوم
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <CreditCard className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>لا توجد اشتراكات مسجلة</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* سجل الحضور والانصراف */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-600" />
                    سجل الحضور والانصراف
                  </CardTitle>
                  <Button variant="outline" size="sm" onClick={() => refetchAttendance()}>
                    <RefreshCw className="w-4 h-4 ml-2" />
                    تحديث
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* فلاتر */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <Label>الفرع</Label>
                    <Select
                      value={attendanceFilters.branchId || undefined}
                      onValueChange={(value) =>
                        setAttendanceFilters((prev) => ({ ...prev, branchId: value || "" }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="جميع الفروع" />
                      </SelectTrigger>
                      <SelectContent>
                        {branches.map((branch: any) => (
                          <SelectItem key={branch.id} value={branch.id.toString()}>
                            {branch.arabicName || branch.englishName || branch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>من تاريخ</Label>
                    <Input
                      type="date"
                      value={attendanceFilters.startDate}
                      onChange={(e) =>
                        setAttendanceFilters((prev) => ({ ...prev, startDate: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <Label>إلى تاريخ</Label>
                    <Input
                      type="date"
                      value={attendanceFilters.endDate}
                      onChange={(e) =>
                        setAttendanceFilters((prev) => ({ ...prev, endDate: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <Label>الحالة</Label>
                    <Select
                      value={attendanceFilters.status || undefined}
                      onValueChange={(value) =>
                        setAttendanceFilters((prev) => ({ ...prev, status: value || "" }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="جميع الحالات" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="checked_in">داخل</SelectItem>
                        <SelectItem value="checked_out">خارج</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* آخر تسجيل دخول */}
                {lastCheckIn && (
                  <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <LogIn className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-800">آخر تسجيل دخول</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">الوقت:</span>
                        <span className="font-medium mr-2">
                          {format(new Date(lastCheckIn.checkInTime), "PPpp", { locale: ar })}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">الحالة:</span>
                        <Badge className={lastCheckIn.status === "checked_in" ? "bg-green-500 ml-2" : "bg-gray-500 ml-2"}>
                          {lastCheckIn.status === "checked_in" ? "داخل" : "خارج"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}

                {/* جدول سجل الحضور */}
                {attendanceRecords.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>التاريخ</TableHead>
                          <TableHead>اسم العضو</TableHead>
                          <TableHead>كود العضو</TableHead>
                          <TableHead>وقت الدخول</TableHead>
                          <TableHead>وقت الخروج</TableHead>
                          <TableHead>المدة</TableHead>
                          <TableHead>الحالة</TableHead>
                          <TableHead>الفرع</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {attendanceRecords.map((record: any) => (
                          <TableRow key={record.id}>
                            <TableCell>
                              {format(new Date(record.attendanceDate || record.checkInTime), "PPP", { locale: ar })}
                            </TableCell>
                            <TableCell className="font-medium">{record.memberName || record.member?.name || "-"}</TableCell>
                            <TableCell className="font-mono">{record.memberCode || record.member?.memberCode || "-"}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 text-green-600">
                                <LogIn className="w-4 h-4" />
                                {format(new Date(record.checkInTime), "p", { locale: ar })}
                              </div>
                            </TableCell>
                            <TableCell>
                              {record.checkOutTime ? (
                                <div className="flex items-center gap-1 text-red-600">
                                  <LogOut className="w-4 h-4" />
                                  {format(new Date(record.checkOutTime), "p", { locale: ar })}
                                </div>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {record.duration ? (
                                <span className="font-medium">
                                  {Math.floor(record.duration / 60)} ساعة {record.duration % 60} دقيقة
                                </span>
                              ) : record.status === "checked_in" ? (
                                <span className="text-green-600">جاري...</span>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge className={record.status === "checked_in" ? "bg-green-500" : "bg-gray-500"}>
                                {record.status === "checked_in" ? "داخل" : "خارج"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {record.branch?.arabicName || record.branch?.englishName || record.branch?.name || "-"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>لا توجد سجلات حضور</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* رسالة عند عدم وجود نتائج */}
        {barcode && !searchedMember && membersData && (
          <Card>
            <CardContent className="text-center py-12">
              <AlertCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-semibold text-gray-700">لم يتم العثور على العضو</p>
              <p className="text-gray-500 mt-2">يرجى التحقق من الباركود والمحاولة مرة أخرى</p>
            </CardContent>
          </Card>
        )}
          </TabsContent>

          {/* تبويب سجل عمليات المسح */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <History className="w-5 h-5 text-blue-600" />
                    سجل عمليات المسح بالباركود
                  </CardTitle>
                  <Button variant="outline" size="sm" onClick={() => refetchAllAttendance()}>
                    <RefreshCw className="w-4 h-4 ml-2" />
                    تحديث
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* فلاتر البحث */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                  <div>
                    <Label>البحث</Label>
                    <div className="relative">
                      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="اسم أو كود العضو..."
                        value={globalAttendanceFilters.search}
                        onChange={(e) =>
                          setGlobalAttendanceFilters((prev) => ({ ...prev, search: e.target.value }))
                        }
                        className="pr-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>الفرع</Label>
                    <Select
                      value={globalAttendanceFilters.branchId || "all"}
                      onValueChange={(value) =>
                        setGlobalAttendanceFilters((prev) => ({ ...prev, branchId: value === "all" ? "" : value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="جميع الفروع" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع الفروع</SelectItem>
                        {branches.map((branch: any) => (
                          <SelectItem key={branch.id} value={branch.id.toString()}>
                            {branch.arabicName || branch.englishName || branch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>من تاريخ</Label>
                    <Input
                      type="date"
                      value={globalAttendanceFilters.startDate}
                      onChange={(e) =>
                        setGlobalAttendanceFilters((prev) => ({ ...prev, startDate: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <Label>إلى تاريخ</Label>
                    <Input
                      type="date"
                      value={globalAttendanceFilters.endDate}
                      onChange={(e) =>
                        setGlobalAttendanceFilters((prev) => ({ ...prev, endDate: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <Label>الحالة</Label>
                    <Select
                      value={globalAttendanceFilters.status || "all"}
                      onValueChange={(value) =>
                        setGlobalAttendanceFilters((prev) => ({ ...prev, status: value === "all" ? "" : value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="جميع الحالات" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع الحالات</SelectItem>
                        <SelectItem value="checked_in">داخل</SelectItem>
                        <SelectItem value="checked_out">خارج</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* جدول سجل عمليات المسح */}
                {allAttendanceRecords.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>التاريخ</TableHead>
                          <TableHead>اسم العضو</TableHead>
                          <TableHead>كود العضو / الباركود</TableHead>
                          <TableHead>وقت الدخول</TableHead>
                          <TableHead>وقت الخروج</TableHead>
                          <TableHead>المدة</TableHead>
                          <TableHead>الحالة</TableHead>
                          <TableHead>الفرع</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {allAttendanceRecords.map((record: any) => (
                          <TableRow key={record.id}>
                            <TableCell>
                              {format(new Date(record.attendanceDate || record.checkInTime), "PPP", { locale: ar })}
                            </TableCell>
                            <TableCell className="font-medium">{record.memberName || record.member?.name || "-"}</TableCell>
                            <TableCell className="font-mono">
                              <Badge variant="outline" className="font-mono">
                                {record.memberCode || record.member?.memberCode || "-"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 text-green-600">
                                <LogIn className="w-4 h-4" />
                                {format(new Date(record.checkInTime), "p", { locale: ar })}
                              </div>
                            </TableCell>
                            <TableCell>
                              {record.checkOutTime ? (
                                <div className="flex items-center gap-1 text-red-600">
                                  <LogOut className="w-4 h-4" />
                                  {format(new Date(record.checkOutTime), "p", { locale: ar })}
                                </div>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {record.duration ? (
                                <span className="font-medium">
                                  {Math.floor(record.duration / 60)} ساعة {record.duration % 60} دقيقة
                                </span>
                              ) : record.status === "checked_in" ? (
                                <span className="text-green-600">جاري...</span>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge className={record.status === "checked_in" ? "bg-green-500" : "bg-gray-500"}>
                                {record.status === "checked_in" ? "داخل" : "خارج"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {record.branch?.arabicName || record.branch?.englishName || record.branch?.name || "-"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Activity className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p className="text-lg font-medium">لا توجد سجلات حضور</p>
                    <p className="text-sm mt-2">جرب تغيير الفترة أو الفلاتر</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BarcodeSearch;

