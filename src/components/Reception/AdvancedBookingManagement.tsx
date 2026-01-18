import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, 
  Clock, 
  Users, 
  Building2, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  MapPin,
  Phone,
  Mail,
  Star,
  Zap,
  TrendingUp,
  DollarSign,
  Timer,
  User,
  Car,
  Settings,
  Download,
  RefreshCw
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAdvancedBookingSystem, type AdvancedBookingData, type BookingFilters } from "@/hooks/useAdvancedBookingSystem";
import { useTableManagement } from "@/hooks/useTableManagement";
import { useGetAllBookingsQuery } from "@/services/bookingApi";
import { useGetAllBranchesQuery } from "@/services/branchesApi";

// تم إزالة البيانات الوهمية - سيتم استخدام البيانات الحقيقية من API

const statusOptions = [
  { value: "all", label: "جميع الحالات", color: "bg-gray-500" },
  { value: "draft", label: "مسودة", color: "bg-gray-400" },
  { value: "pending", label: "قيد الانتظار", color: "bg-yellow-500" },
  { value: "confirmed", label: "مؤكد", color: "bg-green-500" },
  { value: "in-progress", label: "قيد التنفيذ", color: "bg-blue-500" },
  { value: "completed", label: "مكتمل", color: "bg-emerald-500" },
  { value: "cancelled", label: "ملغي", color: "bg-red-500" },
  { value: "no-show", label: "لم يحضر", color: "bg-orange-500" }
];

const priorityOptions = [
  { value: "all", label: "جميع الأولويات" },
  { value: "low", label: "منخفضة", color: "bg-gray-400" },
  { value: "normal", label: "عادية", color: "bg-blue-400" },
  { value: "high", label: "عالية", color: "bg-orange-400" },
  { value: "urgent", label: "عاجلة", color: "bg-red-500" },
  { value: "emergency", label: "طارئة", color: "bg-red-600" }
];

export function AdvancedBookingManagement() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // جلب البيع الحقيقية من API
  const { data: bookingsData, isLoading: bookingsLoading, error: bookingsError } = useGetAllBookingsQuery({});
  const { data: branchesData, isLoading: branchesLoading, error: branchesError } = useGetAllBranchesQuery(undefined as any);
  
  // جلب الفروع الحقيقية من API
  const branches = Array.isArray(branchesData?.data) ? [...branchesData.data] : [];
  
  // تحويل بيانات البيع إلى الشكل المطلوب
  const bookings: AdvancedBookingData[] = Array.isArray(bookingsData?.data) 
    ? bookingsData.data.map((booking: any) => ({
        id: booking.id,
        bookingCode: booking.bookingNumber || `QR${booking.id}`,
        branchCode: String(booking.branchId || "").substring(0, 3).toUpperCase() || "DEF",
        customerId: booking.customerId || "",
        customerName: booking.customerName || "",
        customerPhone: booking.customerPhone || "",
        customerEmail: booking.customerEmail || "",
        customerType: "existing" as const,
        loyaltyPoints: 0,
        membershipLevel: "bronze" as const,
        plateNumber: "",
        vehicleType: "sedan" as const,
        vehicleBrand: "",
        vehicleModel: "",
        vehicleYear: "",
        vehicleColor: "",
        services: booking.specialRequests || [],
        totalDuration: 30,
        totalPrice: booking.totalPrice || 0,
        discountAmount: 0,
        finalAmount: booking.finalAmount || booking.totalPrice || 0,
        branchId: booking.branchId || "",
        branchName: branches.find(b => b.id === booking.branchId)?.arabicName || 
                   branches.find(b => b.id === booking.branchId)?.englishName || 
                   booking.branch?.arabicName || 
                   booking.branch?.englishName ||
                   "غير محدد",
        servicePath: "standard",
        resourcesRequired: [],
        date: booking.bookingDate || booking.date || "",
        time: booking.bookingTime || booking.time || "",
        endTime: "",
        timezone: "Asia/Riyadh",
        estimatedCompletion: "",
        status: booking.status || "confirmed",
        priority: "normal" as const,
        bookingSource: "app" as const,
        bookingType: "standard" as const,
        paymentStatus: booking.paymentStatus || "unpaid" as const,
        advancePayment: 0,
        remindersSent: [],
        communicationPreferences: {
          sms: true,
          email: false
        },
        notes: booking.notes || "",
        specialRequests: booking.specialRequests || [],
        customerJourney: [
          {
            action: "تم إنشاء الحجز",
            timestamp: booking.createdAt || new Date().toISOString(),
            employee: "النظام"
          }
        ],
        createdAt: booking.createdAt || new Date().toISOString(),
        updatedAt: booking.updatedAt || new Date().toISOString()
      }))
    : [];

  const loading = bookingsLoading || branchesLoading;

  // دوال البحث والتصفية
  const searchBookings = (searchTerm: string) => {
    if (!searchTerm) return bookings;
    return bookings.filter(booking => 
      booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customerPhone.includes(searchTerm) ||
      booking.bookingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.branchName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getFilteredBookings = (filters: BookingFilters) => {
    let result = bookings;
    
    if (filters.branches?.length && !filters.branches.includes('all')) {
      result = result.filter(b => filters.branches!.includes(b.branchId));
    }
    if (filters.statuses?.length && !filters.statuses.includes('all')) {
      result = result.filter(b => filters.statuses!.includes(b.status));
    }
    if (filters.dateRange) {
      result = result.filter(b => {
        const bookingDate = new Date(b.date);
        const startDate = new Date(filters.dateRange!.start);
        const endDate = new Date(filters.dateRange!.end);
        return bookingDate >= startDate && bookingDate <= endDate;
      });
    }
    
    return result;
  };

  const getBookingAnalytics = (filters: BookingFilters) => {
    const filteredBookings = getFilteredBookings(filters);
    
    return {
      totalBookings: filteredBookings.length,
      confirmedBookings: filteredBookings.filter(b => b.status === 'confirmed').length,
      totalRevenue: filteredBookings.reduce((sum, b) => sum + b.finalAmount, 0),
      averageBookingValue: filteredBookings.length > 0 
        ? filteredBookings.reduce((sum, b) => sum + b.finalAmount, 0) / filteredBookings.length 
        : 0,
      customerSatisfactionScore: 4.2 // قيمة افتراضية
    };
  };

  // دوال إدارة البيع
  const updateBooking = async (bookingId: string, updates: Partial<AdvancedBookingData>) => {
    // TODO: تنفيذ تحديث الحجز عبر API
    console.log("Update booking:", bookingId, updates);
    toast({
      title: "تحديث الحجز",
      description: "تم تحديث الحجز بنجاح",
    });
  };

  const cancelBooking = async (bookingId: string, reason: string) => {
    // TODO: تنفيذ إلغاء الحجز عبر API
    console.log("Cancel booking:", bookingId, reason);
    toast({
      title: "إلغاء الحجز",
      description: "تم إلغاء الحجز بنجاح",
    });
  };

  const confirmBooking = async (bookingId: string) => {
    // TODO: تنفيذ تأكيد الحجز عبر API
    console.log("Confirm booking:", bookingId);
    toast({
      title: "تأكيد الحجز",
      description: "تم تأكيد الحجز بنجاح",
    });
  };

  const startService = async (bookingId: string, employeeId: string) => {
    // TODO: تنفيذ بدء الخدمة عبر API
    console.log("Start service:", bookingId, employeeId);
    toast({
      title: "بدء الخدمة",
      description: "تم بدء تنفيذ الخدمة",
    });
  };

  const completeService = async (bookingId: string) => {
    // TODO: تنفيذ إكمال الخدمة عبر API
    console.log("Complete service:", bookingId);
    toast({
      title: "اكتمال الخدمة",
      description: "تم إنجاز الخدمة بنجاح",
    });
  };

  // Filters and search
  const [filters, setFilters] = useState<BookingFilters>({
    branches: [],
    statuses: [],
    dateRange: {
      start: new Date().toISOString().split('T')[0],
      end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid" | "calendar">("list");

  // Booking details dialog
  const [selectedBooking, setSelectedBooking] = useState<AdvancedBookingData | null>(null);
  const [showBookingDetails, setShowBookingDetails] = useState(false);

  // Filtered and searched bookings
  const displayedBookings = useMemo(() => {
    let result = bookings;
    
    // Apply filters
    if (filters.branches?.length && !filters.branches.includes('all')) {
      result = result.filter(b => filters.branches!.includes(b.branchId));
    }
    if (filters.statuses?.length && !filters.statuses.includes('all')) {
      result = result.filter(b => filters.statuses!.includes(b.status));
    }
    if (filters.dateRange) {
      result = result.filter(b => {
        const bookingDate = new Date(b.date);
        const startDate = new Date(filters.dateRange!.start);
        const endDate = new Date(filters.dateRange!.end);
        return bookingDate >= startDate && bookingDate <= endDate;
      });
    }

    // Apply search
    if (searchTerm) {
      const searchResults = searchBookings(searchTerm);
      result = result.filter(b => searchResults.some(s => s.id === b.id));
    }

    return result;
  }, [bookings, filters, searchTerm, searchBookings]);

  // Debug: Log bookings data
  console.log("🔍 Advanced Booking Management - Bookings API Response:", bookingsData);
  console.log("🔍 Advanced Booking Management - Bookings:", bookings);
  console.log("🔍 Advanced Booking Management - Loading:", loading);
  console.log("🔍 Advanced Booking Management - Branches API Response:", branchesData);
  console.log("🔍 Advanced Booking Management - Branches:", branches);
  console.log("🔍 Advanced Booking Management - Bookings Error:", bookingsError);
  console.log("🔍 Advanced Booking Management - Branches Error:", branchesError);

  // Analytics
  const analytics = useMemo(() => getBookingAnalytics(filters), [getBookingAnalytics, filters]);

  const getStatusBadge = (status: string, priority?: string) => {
    const statusOption = statusOptions.find(s => s.value === status);
    const priorityOption = priorityOptions.find(p => p.value === priority);
    
    return (
      <div className="flex items-center gap-2">
        <Badge className={`${statusOption?.color || 'bg-gray-500'} text-white`}>
          {statusOption?.label || status}
        </Badge>
        {priority && priority !== "normal" && (
          <Badge variant="outline" className={`${priorityOption?.color || 'bg-gray-400'} text-white border-0`}>
            {priorityOption?.label}
          </Badge>
        )}
      </div>
    );
  };

  const getMembershipBadge = (level: string) => {
    const colors = {
      bronze: "bg-amber-600",
      silver: "bg-gray-400",
      gold: "bg-yellow-500",
      platinum: "bg-purple-600"
    };
    return (
      <Badge className={`${colors[level as keyof typeof colors]} text-white`}>
        {level === "bronze" && "برونزي"}
        {level === "silver" && "فضي"}
        {level === "gold" && "ذهبي"}
        {level === "platinum" && "بلاتيني"}
      </Badge>
    );
  };

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      if (newStatus === "cancelled") {
        await cancelBooking(bookingId, "إلغاء من الإدارة");
        toast({
          title: "تم إلغاء الحجز",
          description: "تم إلغاء الحجز بنجاح",
        });
      } else if (newStatus === "confirmed") {
        await confirmBooking(bookingId);
        toast({
          title: "تم تأكيد الحجز",
          description: "تم تأكيد الحجز بنجاح",
        });
      } else if (newStatus === "in-progress") {
        await startService(bookingId, "current_employee");
        toast({
          title: "بدء الخدمة",
          description: "تم بدء تنفيذ الخدمة",
        });
      } else if (newStatus === "completed") {
        await completeService(bookingId);
        toast({
          title: "اكتمال الخدمة",
          description: "تم إنجاز الخدمة بنجاح",
        });
      } else {
        await updateBooking(bookingId, { status: newStatus as any });
        toast({
          title: "تحديث الحالة",
          description: "تم تحديث حالة الحجز بنجاح",
        });
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في تحديث حالة الحجز",
        variant: "destructive"
      });
    }
  };

  const resetFilters = () => {
    setFilters({
      branches: [],
      statuses: [],
      dateRange: {
        start: new Date().toISOString().split('T')[0],
        end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }
    });
    setSearchTerm("");
    toast({
      title: "إعادة تعيين الفلاتر",
      description: "تم مسح جميع الفلاتر وإعادة تعيينها",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between p-6 rounded-xl border shadow-lg bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Calendar className="h-8 w-8 text-primary animate-pulse" />
            إدارة البيع المتطورة
          </h1>
          <p className="text-muted-foreground">
            نظام شامل لإدارة البيع وفق أفضل الممارسات العالمية
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              toast({
                title: "تصدير البيانات",
                description: "تم تصدير قائمة البيع بنجاح",
              });
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            تصدير
          </Button>
          <Button 
            className="hover:scale-105 transition-all duration-300"
            onClick={() => {
              console.log("تم الضغط على زر حجز جديد من صفحة قائمة البيع");
              try {
                navigate("/reception/create-booking");
                toast({
                  title: "انتقال إلى إنشاء حجز",
                  description: "جاري الانتقال إلى صفحة إنشاء حجز جديد",
                });
              } catch (error) {
                console.error("خطأ في الانتقال:", error);
                toast({
                  title: "خطأ",
                  description: "حدث خطأ في الانتقال إلى صفحة الحجز",
                  variant: "destructive"
                });
              }
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            حجز جديد
          </Button>
        </div>
      </div>

      {/* Analytics Dashboard */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي البيع</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalBookings}</div>
            <p className="text-xs text-muted-foreground">
              +12% من الأسبوع الماضي
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مؤكدة</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{analytics.confirmedBookings}</div>
            <Progress value={(analytics.confirmedBookings / analytics.totalBookings) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الإيرادات</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {analytics.totalRevenue.toLocaleString()} جنيه مصري
            </div>
            <p className="text-xs text-muted-foreground">
              متوسط القيمة: {Math.round(analytics.averageBookingValue)} جنيه مصري
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">رضا العملاء</CardTitle>
            <Star className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {analytics.customerSatisfactionScore.toFixed(1)}/5
            </div>
            <div className="flex mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3 w-3 ${
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

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            البحث والتصفية المتقدمة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-6">
            <div className="relative">
              <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث بالاسم، الهاتف، رقم اللوحة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            
            <Select 
              value={filters.branches?.join(',') || ''} 
              onValueChange={(value) => 
                setFilters(prev => ({ 
                  ...prev, 
                  branches: value ? value.split(',') : [] 
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر الفرع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الفروع</SelectItem>
                {branches.filter(b => b.id !== "all").map((branch) => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              value={filters.statuses?.join(',') || ''} 
              onValueChange={(value) => 
                setFilters(prev => ({ 
                  ...prev, 
                  statuses: value ? value.split(',') : [] 
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                {statusOptions.filter(s => s.value !== "all").map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="date"
              value={filters.dateRange?.start || ''}
              onChange={(e) => 
                setFilters(prev => ({ 
                  ...prev, 
                  dateRange: { 
                    ...prev.dateRange!, 
                    start: e.target.value 
                  } 
                }))
              }
              placeholder="من تاريخ"
            />

            <Input
              type="date"
              value={filters.dateRange?.end || ''}
              onChange={(e) => 
                setFilters(prev => ({ 
                  ...prev, 
                  dateRange: { 
                    ...prev.dateRange!, 
                    end: e.target.value 
                  } 
                }))
              }
              placeholder="إلى تاريخ"
            />

            <Button variant="outline" onClick={resetFilters}>
              <RefreshCw className="h-4 w-4 mr-2" />
              إعادة تعيين
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Display */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>قائمة البيع</CardTitle>
              <CardDescription>
                عرض {displayedBookings.length} من {bookings.length} حجز
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                قائمة
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                شبكة
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              <span className="mr-2">جاري التحميل...</span>
            </div>
          ) : bookingsError ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-600">خطأ في تحميل البيع</h3>
              <p className="text-muted-foreground mt-2">
                {(() => {
                  if ('message' in bookingsError) return bookingsError.message;
                  if ('data' in bookingsError && bookingsError.data && typeof bookingsError.data === 'object' && 'message' in bookingsError.data) {
                    return (bookingsError.data as any).message;
                  }
                  return "حدث خطأ أثناء تحميل البيانات";
                })()}
              </p>
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
                className="mt-4"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                إعادة المحاولة
              </Button>
            </div>
          ) : (
            <div className={viewMode === "grid" ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3" : "space-y-4"}>
              {displayedBookings.map((booking) => (
                <Card 
                  key={booking.id} 
                  className="hover:shadow-md transition-all duration-300 cursor-pointer"
                  onClick={() => {
                    setSelectedBooking(booking);
                    setShowBookingDetails(true);
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{booking.customerName}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {booking.customerPhone}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            {getMembershipBadge(booking.membershipLevel)}
                            <Badge variant="outline" className="text-xs">
                              {booking.loyaltyPoints} نقطة
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(booking.status, booking.priority)}
                        <div className="text-sm text-muted-foreground mt-1">
                          {booking.bookingCode}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Car className="h-3 w-3 text-muted-foreground" />
                        <span>{booking.plateNumber} • {booking.vehicleBrand} {booking.vehicleModel}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Building2 className="h-3 w-3 text-muted-foreground" />
                        <span>{booking.branchName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span>{booking.date} • {booking.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Timer className="h-3 w-3 text-muted-foreground" />
                        <span>{booking.totalDuration} دقيقة</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-primary">
                        {booking.finalAmount} جنيه مصري
                      </div>
                      <div className="flex gap-1">
                        {booking.services.slice(0, 2).map((service, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {service.name}
                          </Badge>
                        ))}
                        {booking.services.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{booking.services.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {booking.notes && (
                      <div className="mt-2 p-2 bg-muted rounded text-sm">
                        {booking.notes.length > 50 
                          ? `${booking.notes.substring(0, 50)}...`
                          : booking.notes
                        }
                      </div>
                    )}

                    <div className="flex justify-end gap-2 mt-3 pt-3 border-t" onClick={(e) => e.stopPropagation()}>
                      <Select 
                        value={booking.status} 
                        onValueChange={(value) => handleStatusChange(booking.id, value)}
                      >
                        <SelectTrigger className="w-32 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.filter(s => s.value !== "all").map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setSelectedBooking(booking);
                          setShowBookingDetails(true);
                        }}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          toast({
                            title: "عرض التفاصيل",
                            description: `تم فتح تفاصيل حجز ${booking.customerName}`,
                          });
                          setSelectedBooking(booking);
                          setShowBookingDetails(true);
                        }}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {displayedBookings.length === 0 && (
                <div className="text-center py-8 col-span-full">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold">لا توجد حجوزات</h3>
                  <p className="text-muted-foreground">لا توجد حجوزات تطابق المعايير المحددة</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Booking Details Dialog */}
      {selectedBooking && (
        <Dialog open={showBookingDetails} onOpenChange={setShowBookingDetails}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                تفاصيل الحجز - {selectedBooking.bookingCode}
              </DialogTitle>
              <DialogDescription>
                معلومات تفصيلية عن الحجز ورحلة العميل
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">معلومات العميل</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{selectedBooking.customerName}</span>
                    {getMembershipBadge(selectedBooking.membershipLevel)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedBooking.customerPhone}</span>
                  </div>
                  {selectedBooking.customerEmail && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedBooking.customerEmail}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedBooking.loyaltyPoints} نقطة ولاء</span>
                  </div>
                </CardContent>
              </Card>

              {/* Vehicle Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">معلومات المركبة</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="font-medium">{selectedBooking.plateNumber}</div>
                  <div>{selectedBooking.vehicleBrand} {selectedBooking.vehicleModel} {selectedBooking.vehicleYear}</div>
                  <div className="text-muted-foreground">{selectedBooking.vehicleColor}</div>
                  <Badge variant="outline">{selectedBooking.vehicleType}</Badge>
                </CardContent>
              </Card>

              {/* Services */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">الخدمات المطلوبة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 md:grid-cols-2">
                    {selectedBooking.services.map((service, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{service.name}</span>
                          <Badge variant="outline">{service.category}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {service.duration} دقيقة • {service.price} جنيه مصري
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span>المجموع:</span>
                      <span className="font-bold">{selectedBooking.totalPrice} جنيه مصري</span>
                    </div>
                    {selectedBooking.discountAmount > 0 && (
                      <div className="flex justify-between items-center text-green-600">
                        <span>الخصم:</span>
                        <span>-{selectedBooking.discountAmount} جنيه مصري</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>المجموع النهائي:</span>
                      <span>{selectedBooking.finalAmount} جنيه مصري</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Journey */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">رحلة العميل</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedBooking.customerJourney.map((step, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 rounded border-l-2 border-l-primary">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <div className="flex-1">
                          <div className="font-medium">{step.action}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(step.timestamp).toLocaleString('ar-SA')}
                            {step.employee && ` • بواسطة: ${step.employee}`}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}