import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { 
  FileBarChart,
  TrendingUp,
  TrendingDown,
  Star,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Package,
  Users,
  Calendar as CalendarIcon,
  Download,
  Filter,
  BarChart3,
  PieChart,
  LineChart,
  RefreshCw,
  Search,
  Eye,
  Printer,
  Mail,
  Brain,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AISupplierReports from "@/components/Inventory/AISupplierReports";
import {
  useGetSupplierReportsQuery,
  useGetSupplierReportStatsQuery,
  useGetSupplierPerformanceReportQuery,
  useGetSupplierPaymentsReportQuery,
  useGetSupplierOrdersReportQuery,
  useGetSupplierComplaintsReportQuery,
  useGetSupplierRisksReportQuery,
  useExportSupplierReportMutation,
} from "@/services/supplierReportsApi";

// دوال معالجة البيانات
const formatNumber = (value: any, defaultValue = 0) => {
  if (value === null || value === undefined || isNaN(value)) return defaultValue;
  return Number(value).toLocaleString();
};

const formatPercentage = (value: any, defaultValue = 0) => {
  if (value === null || value === undefined || isNaN(value)) return defaultValue;
  return `${Math.round(Number(value))}%`;
};

const formatCurrency = (value: any, defaultValue = 0) => {
  if (value === null || value === undefined || isNaN(value)) return defaultValue;
  return `${(Number(value) / 1000).toFixed(1)}k جنيه مصري`;
};

const getSafeValue = (obj: any, key: string, defaultValue: any = null) => {
  if (!obj || typeof obj !== 'object') return defaultValue;
  return obj[key] !== undefined && obj[key] !== null ? obj[key] : defaultValue;
};

const hasData = (data: any) => {
  if (!data) return false;
  if (Array.isArray(data)) return data.length > 0;
  if (typeof data === 'object') return Object.keys(data).length > 0;
  return true;
};

const safeSort = (array: any[], compareFn: (a: any, b: any) => number): any[] => {
  if (!Array.isArray(array)) return [];
  try {
    return [...array].sort(compareFn);
  } catch (error) {
    console.warn('Error sorting array:', error);
    return array;
  }
};

const SupplierReports = () => {
  const { toast } = useToast();

  // Filter states
  const [dateFrom, setDateFrom] = useState<Date>(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 6);
    return date;
  });
  const [dateTo, setDateTo] = useState<Date>(new Date());
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [selectedStatus, setSelectedStatus] = useState("الكل");
  const [searchTerm, setSearchTerm] = useState("");

  // API calls
  const { data: reportsData, isLoading: isLoadingReports, error: reportsError } = useGetSupplierReportsQuery({
    dateFrom: dateFrom.toISOString(),
    dateTo: dateTo.toISOString(),
    category: selectedCategory !== "الكل" ? selectedCategory : undefined,
    status: selectedStatus !== "الكل" ? selectedStatus : undefined,
    search: searchTerm || undefined,
  }, {
    skip: !localStorage.getItem("authToken")
  });

  const { data: statsData, isLoading: isLoadingStats, error: statsError } = useGetSupplierReportStatsQuery({
    dateFrom: dateFrom.toISOString(),
    dateTo: dateTo.toISOString(),
    category: selectedCategory !== "الكل" ? selectedCategory : undefined,
    status: selectedStatus !== "الكل" ? selectedStatus : undefined,
  }, {
    skip: !localStorage.getItem("authToken")
  });

  const { data: performanceData, isLoading: isLoadingPerformance, error: performanceError } = useGetSupplierPerformanceReportQuery({
    dateFrom: dateFrom.toISOString(),
    dateTo: dateTo.toISOString(),
    category: selectedCategory !== "الكل" ? selectedCategory : undefined,
  }, {
    skip: !localStorage.getItem("authToken")
  });

  const { data: paymentsData, isLoading: isLoadingPayments, error: paymentsError } = useGetSupplierPaymentsReportQuery({
    dateFrom: dateFrom.toISOString(),
    dateTo: dateTo.toISOString(),
    status: selectedStatus !== "الكل" ? selectedStatus : undefined,
  }, {
    skip: !localStorage.getItem("authToken")
  });

  const { data: ordersData, isLoading: isLoadingOrders, error: ordersError } = useGetSupplierOrdersReportQuery({
    dateFrom: dateFrom.toISOString(),
    dateTo: dateTo.toISOString(),
    category: selectedCategory !== "الكل" ? selectedCategory : undefined,
  }, {
    skip: !localStorage.getItem("authToken")
  });

  const { data: complaintsData, isLoading: isLoadingComplaints, error: complaintsError } = useGetSupplierComplaintsReportQuery({
    dateFrom: dateFrom.toISOString(),
    dateTo: dateTo.toISOString(),
    category: selectedCategory !== "الكل" ? selectedCategory : undefined,
  }, {
    skip: !localStorage.getItem("authToken")
  });

  const { data: risksData, isLoading: isLoadingRisks, error: risksError } = useGetSupplierRisksReportQuery({
    dateFrom: dateFrom.toISOString(),
    dateTo: dateTo.toISOString(),
  }, {
    skip: !localStorage.getItem("authToken")
  });

  const [exportReport, exportResult] = useExportSupplierReportMutation();



  // Calculate statistics
  const stats = statsData?.data || {};
  const totalSuppliers = getSafeValue(stats, 'totalSuppliers', 0);
  const activeSuppliers = getSafeValue(stats, 'activeSuppliers', 0);
  const totalOrderValue = getSafeValue(stats, 'totalOrderValue', 0);
  const averageRating = getSafeValue(stats, 'averageRating', 0);
  const averageOnTime = getSafeValue(stats, 'averageOnTime', 0);

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "متميز": return "bg-green-100 text-green-800";
      case "نشط": return "bg-blue-100 text-blue-800";
      case "تحت المراقبة": return "bg-yellow-100 text-yellow-800";
      case "موقوف": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Get performance indicator
  const getPerformanceIndicator = (rating: number) => {
    if (rating >= 4.5) return { icon: TrendingUp, color: "text-green-600", label: "ممتاز" };
    if (rating >= 4.0) return { icon: TrendingUp, color: "text-blue-600", label: "جيد جداً" };
    if (rating >= 3.5) return { icon: RefreshCw, color: "text-yellow-600", label: "جيد" };
    if (rating >= 3.0) return { icon: TrendingDown, color: "text-orange-600", label: "مقبول" };
    return { icon: TrendingDown, color: "text-red-600", label: "ضعيف" };
  };

  // Export report
  const handleExportReport = async (type: string) => {
    try {
      await exportReport({
        type,
        params: {
          dateFrom: dateFrom.toISOString(),
          dateTo: dateTo.toISOString(),
          category: selectedCategory !== "الكل" ? selectedCategory : undefined,
          status: selectedStatus !== "الكل" ? selectedStatus : undefined,
          search: searchTerm || undefined,
        },
        format: 'xlsx'
      }).unwrap();
      
      toast({
        title: "تم تصدير التقرير",
        description: `تم تصدير ${type} بنجاح`,
      });
    } catch (error) {
      toast({
        title: "خطأ في التصدير",
        description: "حدث خطأ أثناء تصدير التقرير",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary-blue bg-clip-text text-transparent">
            تقارير الموردين
          </h1>
          <p className="text-muted-foreground">تحليلات شاملة وتقارير ذكية لأداء الموردين</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="gap-2" 
            onClick={() => handleExportReport("excel")}
            disabled={!hasData(reportsData?.data)}
          >
            <Download className="w-4 h-4" />
            تصدير Excel
          </Button>
          <Button 
            variant="outline" 
            className="gap-2" 
            onClick={() => handleExportReport("pdf")}
            disabled={!hasData(reportsData?.data)}
          >
            <Printer className="w-4 h-4" />
            طباعة PDF
          </Button>
          <Button className="gap-2">
            <Mail className="w-4 h-4" />
            جدولة التقرير
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" />
            فلاتر التقارير
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <Label>من تاريخ</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(dateFrom, "yyyy-MM-dd")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateFrom}
                    onSelect={(date) => date && setDateFrom(date)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label>إلى تاريخ</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(dateTo, "yyyy-MM-dd")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateTo}
                    onSelect={(date) => date && setDateTo(date)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label>التصنيف</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="الكل">جميع التصنيفات</SelectItem>
                  <SelectItem value="مواد كيميائية">مواد كيميائية</SelectItem>
                  <SelectItem value="مشروب ومنتجات">مشروب ومنتجات</SelectItem>
                  <SelectItem value="زيوت ومواد تشحيم">زيوت ومواد تشحيم</SelectItem>
                  <SelectItem value="معدات صناعية">معدات صناعية</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>الحالة</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="الكل">جميع الحالات</SelectItem>
                  <SelectItem value="متميز">متميز</SelectItem>
                  <SelectItem value="نشط">نشط</SelectItem>
                  <SelectItem value="تحت المراقبة">تحت المراقبة</SelectItem>
                  <SelectItem value="موقوف">موقوف</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>البحث</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="اسم المورد..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">إجمالي الموردين</p>
                {isLoadingStats ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm">جاري التحميل...</span>
                  </div>
                ) : statsError ? (
                  <p className="text-sm text-red-600">خطأ في التحميل</p>
                ) : (
                  <p className="text-2xl font-bold">{formatNumber(totalSuppliers)}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">موردين نشطين</p>
                {isLoadingStats ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm">جاري التحميل...</span>
                  </div>
                ) : statsError ? (
                  <p className="text-sm text-red-600">خطأ في التحميل</p>
                ) : (
                  <p className="text-2xl font-bold">{formatNumber(activeSuppliers)}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">إجمالي المشتريات</p>
                {isLoadingStats ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm">جاري التحميل...</span>
                  </div>
                ) : statsError ? (
                  <p className="text-sm text-red-600">خطأ في التحميل</p>
                ) : (
                  <p className="text-2xl font-bold">{formatCurrency(totalOrderValue)}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Star className="w-8 h-8 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">متوسط التقييم</p>
                {isLoadingStats ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm">جاري التحميل...</span>
                  </div>
                ) : statsError ? (
                  <p className="text-sm text-red-600">خطأ في التحميل</p>
                ) : (
                  <p className="text-2xl font-bold">{Number(averageRating || 0).toFixed(1)}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">الالتزام بالموعد</p>
                {isLoadingStats ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm">جاري التحميل...</span>
                  </div>
                ) : statsError ? (
                  <p className="text-sm text-red-600">خطأ في التحميل</p>
                ) : (
                  <p className="text-2xl font-bold">{formatPercentage(averageOnTime)}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="ai-reports" className="w-full">
        <TabsList className="grid w-full grid-cols-7 p-1 bg-gradient-to-r from-card to-card/80 border shadow-lg rounded-2xl">
          <TabsTrigger 
            value="ai-reports" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white transition-all duration-300 rounded-xl"
          >
            <Brain className="w-4 h-4" />
            التقارير الذكية
          </TabsTrigger>
          <TabsTrigger 
            value="performance" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary-blue data-[state=active]:text-white transition-all duration-300 rounded-xl"
          >
            <BarChart3 className="w-4 h-4" />
            تقييم الأداء
          </TabsTrigger>
          <TabsTrigger 
            value="payments" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary-blue data-[state=active]:text-white transition-all duration-300 rounded-xl"
          >
            <DollarSign className="w-4 h-4" />
            المدفوعات
          </TabsTrigger>
          <TabsTrigger 
            value="orders" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary-blue data-[state=active]:text-white transition-all duration-300 rounded-xl"
          >
            <Package className="w-4 h-4" />
            الطلبيات
          </TabsTrigger>
          <TabsTrigger 
            value="complaints" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary-blue data-[state=active]:text-white transition-all duration-300 rounded-xl"
          >
            <AlertTriangle className="w-4 h-4" />
            الشكاوى والمرتجعات
          </TabsTrigger>
          <TabsTrigger 
            value="analysis" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary-blue data-[state=active]:text-white transition-all duration-300 rounded-xl"
          >
            <PieChart className="w-4 h-4" />
            التحليل المتقدم
          </TabsTrigger>
          <TabsTrigger 
            value="risks" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary-blue data-[state=active]:text-white transition-all duration-300 rounded-xl"
          >
            <AlertTriangle className="w-4 h-4" />
            تقرير المخاطر
          </TabsTrigger>
        </TabsList>

        {/* التقارير الذكية بالذكاء الاصطناعي */}
        <TabsContent value="ai-reports">
          <AISupplierReports />
        </TabsContent>

        {/* تقييم الأداء */}
        <TabsContent value="performance">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                تقرير تقييم أداء الموردين
              </CardTitle>
              <CardDescription>مقارنة شاملة لأداء الموردين عبر معايير متعددة</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingPerformance ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <span className="ml-2">جاري تحميل بيانات الأداء...</span>
                </div>
              ) : performanceError ? (
                <div className="text-center py-8 text-red-600">
                  <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
                  <p>خطأ في تحميل بيانات الأداء</p>
                  <p className="text-sm text-muted-foreground">سيتم عرض البيانات عند توفرها</p>
                </div>
              ) : !hasData(performanceData?.data) ? (
                <div className="text-center py-8 text-muted-foreground">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4" />
                  <p>لا توجد بيانات أداء متاحة</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {performanceData.data.map((supplier: any) => {
                    const performance = getPerformanceIndicator(supplier.rating);
                    const PerformanceIcon = performance.icon;
                    
                    return (
                      <div key={supplier.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <h3 className="font-semibold text-lg">{supplier.name}</h3>
                              <Badge className={getStatusColor(supplier.status || 'غير محدد')}>
                                {supplier.status || 'غير محدد'}
                              </Badge>
                              <div className="flex items-center gap-1">
                                <PerformanceIcon className={`w-4 h-4 ${performance.color}`} />
                                <span className={`text-sm font-medium ${performance.color}`}>
                                  {performance.label}
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">{supplier.category}</p>
                            
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <Star className="w-4 h-4 text-yellow-500" />
                                <span>التقييم: {supplier.rating}/5</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-blue-500" />
                                <span>الالتزام: {formatPercentage(supplier.onTimeDelivery || 0)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Package className="w-4 h-4 text-green-500" />
                                <span>الطلبيات: {formatNumber(supplier.totalOrders || 0)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-green-600" />
                                <span>القيمة: {formatCurrency(supplier.totalValue || 0)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-red-500" />
                                <span>الشكاوى: {formatNumber(supplier.complaints || 0)}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right space-y-2">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= Math.round(supplier.rating || 0)
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-lg font-bold">{(supplier.rating || 0).toFixed(1)}/5</p>
                            <Button variant="outline" size="sm" className="gap-2">
                              <Eye className="w-4 h-4" />
                              تفاصيل
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* تقرير المدفوعات */}
        <TabsContent value="payments">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                تقرير المدفوعات للموردين
              </CardTitle>
              <CardDescription>تحليل الوضع المالي والمدفوعات المنجزة والمتبقية</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingPayments ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <span className="ml-2">جاري تحميل بيانات المدفوعات...</span>
                </div>
              ) : paymentsError ? (
                <div className="text-center py-8 text-red-600">
                  <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
                  <p>خطأ في تحميل بيانات المدفوعات</p>
                  <p className="text-sm text-muted-foreground">سيتم عرض البيانات عند توفرها</p>
                </div>
              ) : !hasData(paymentsData?.data) ? (
                <div className="text-center py-8 text-muted-foreground">
                  <DollarSign className="w-12 h-12 mx-auto mb-4" />
                  <p>لا توجد بيانات مدفوعات متاحة</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {paymentsData.data.map((supplier: any) => (
                    <div key={supplier.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <h3 className="font-semibold">{supplier.name || 'مورد غير محدد'}</h3>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">إجمالي الإيصالات</p>
                              <p className="font-semibold text-blue-600">
                                {formatCurrency(supplier.totalValue || 0)}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">إجمالي المدفوعات</p>
                              <p className="font-semibold text-green-600">
                                {formatCurrency(supplier.totalPayments || 0)}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">الرصيد المتبقي</p>
                              <p className={`font-semibold ${(supplier.remainingBalance || 0) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                {formatCurrency(supplier.remainingBalance || 0)}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">نسبة السداد</p>
                              <p className="font-semibold">
                                {supplier.totalValue && supplier.totalPayments ? 
                                  ((Number(supplier.totalPayments) / Number(supplier.totalValue)) * 100).toFixed(1) : 0}%
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          {(supplier.remainingBalance || 0) > 0 ? (
                            <Badge variant="destructive">مستحق</Badge>
                          ) : (
                            <Badge className="bg-green-100 text-green-800">مسدد</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* تقرير الطلبيات */}
        <TabsContent value="orders">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                تقرير التوريدات والطلبيات
              </CardTitle>
              <CardDescription>استعراض الكميات والمبالغ المنفذة لكل مورد</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingOrders ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <span className="ml-2">جاري تحميل بيانات الطلبيات...</span>
                </div>
              ) : ordersError ? (
                <div className="text-center py-8 text-red-600">
                  <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
                  <p>خطأ في تحميل بيانات الطلبيات</p>
                  <p className="text-sm text-muted-foreground">سيتم عرض البيانات عند توفرها</p>
                </div>
              ) : !hasData(ordersData?.data) ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="w-12 h-12 mx-auto mb-4" />
                  <p>لا توجد بيانات طلبيات متاحة</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {safeSort(ordersData.data, (a: any, b: any) => (b.totalOrders || 0) - (a.totalOrders || 0))
                    .map((supplier: any, index: number) => (
                      <div key={supplier.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full text-sm font-bold">
                              {index + 1}
                            </div>
                            <div className="space-y-1">
                              <h3 className="font-semibold">{supplier.name || 'مورد غير محدد'}</h3>
                              <p className="text-sm text-muted-foreground">{supplier.category || 'غير محدد'}</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                            <div>
                              <p className="text-sm text-muted-foreground">عدد الطلبيات</p>
                              <p className="text-xl font-bold text-blue-600">{supplier.totalOrders || 0}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">إجمالي القيمة</p>
                              <p className="text-xl font-bold text-green-600">
                                {formatCurrency(supplier.totalValue || 0)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">آخر طلبية</p>
                              <p className="text-sm font-medium">
                                {supplier.lastOrder && supplier.lastOrder !== 'Invalid Date' ? 
                                  format(new Date(supplier.lastOrder), "yyyy-MM-dd") : 'غير محدد'}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">متوسط الطلبية</p>
                              <p className="text-lg font-bold">
                                {supplier.totalValue && supplier.totalOrders ? 
                                  formatCurrency((Number(supplier.totalValue) / Number(supplier.totalOrders)) || 0) : 
                                  formatCurrency(0)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* تقرير الشكاوى والمرتجعات */}
        <TabsContent value="complaints">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-primary" />
                تقرير الشكاوى والمرتجعات
              </CardTitle>
              <CardDescription>كشف الموردين ذوي الأداء الأقل ومعالجة المشاكل التكرارية</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingComplaints ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <span className="ml-2">جاري تحميل بيانات الشكاوى...</span>
                </div>
              ) : complaintsError ? (
                <div className="text-center py-8 text-red-600">
                  <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
                  <p>خطأ في تحميل بيانات الشكاوى</p>
                  <p className="text-sm text-muted-foreground">سيتم عرض البيانات عند توفرها</p>
                </div>
              ) : !hasData(complaintsData?.data) ? (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
                  <p>لا توجد بيانات شكاوى متاحة</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {safeSort(complaintsData.data, (a: any, b: any) => ((b.complaints || 0) + (b.returns || 0)) - ((a.complaints || 0) + (a.returns || 0)))
                    .map((supplier: any) => {
                      const totalIssues = (supplier.complaints || 0) + (supplier.returns || 0);
                      const returnRate = supplier.totalOrders ? ((Number(supplier.returns || 0) / Number(supplier.totalOrders)) * 100).toFixed(1) : '0';
                      const complaintRate = supplier.totalOrders ? ((Number(supplier.complaints || 0) / Number(supplier.totalOrders)) * 100).toFixed(1) : '0';
                      
                      return (
                        <div key={supplier.id} className={`p-4 border rounded-lg ${
                          totalIssues > 5 ? 'bg-red-50 border-red-200' : 
                          totalIssues > 2 ? 'bg-yellow-50 border-yellow-200' : 
                          'bg-green-50 border-green-200'
                        }`}>
                          <div className="flex items-center justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                <h3 className="font-semibold">{supplier.name || 'مورد غير محدد'}</h3>
                                {totalIssues > 5 && (
                                  <Badge variant="destructive" className="gap-1">
                                    <AlertTriangle className="w-3 h-3" />
                                    عالي المخاطر
                                  </Badge>
                                )}
                                {totalIssues > 2 && totalIssues <= 5 && (
                                  <Badge className="bg-yellow-100 text-yellow-800 gap-1">
                                    <AlertTriangle className="w-3 h-3" />
                                    تحت المراقبة
                                  </Badge>
                                )}
                                {totalIssues <= 2 && (
                                  <Badge className="bg-green-100 text-green-800 gap-1">
                                    <CheckCircle className="w-3 h-3" />
                                    مستقر
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <p className="text-muted-foreground">عدد الشكاوى</p>
                                  <p className="font-semibold text-red-600">{supplier.complaints || 0}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">عدد المرتجعات</p>
                                  <p className="font-semibold text-orange-600">{supplier.returns || 0}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">نسبة المرتجعات</p>
                                  <p className="font-semibold">{returnRate}%</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">نسبة الشكاوى</p>
                                  <p className="font-semibold">{complaintRate}%</p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <p className="text-2xl font-bold text-red-600">{totalIssues}</p>
                              <p className="text-sm text-muted-foreground">إجمالي المشاكل</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* التحليل المتقدم */}
        <TabsContent value="analysis">
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-primary" />
                    توزيع الموردين حسب الأداء
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!hasData(reportsData?.data) ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <PieChart className="w-12 h-12 mx-auto mb-4" />
                      <p>لا توجد بيانات متاحة للتحليل</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>موردين متميزين (4.5+)</span>
                        <span className="font-bold text-green-600">
                          {reportsData.data.filter((s: any) => (s.rating || 0) >= 4.5).length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>موردين جيدين (3.5-4.4)</span>
                        <span className="font-bold text-blue-600">
                          {reportsData.data.filter((s: any) => (s.rating || 0) >= 3.5 && (s.rating || 0) < 4.5).length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>موردين مقبولين (2.5-3.4)</span>
                        <span className="font-bold text-yellow-600">
                          {reportsData.data.filter((s: any) => (s.rating || 0) >= 2.5 && (s.rating || 0) < 3.5).length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>موردين ضعاف (أقل من 2.5)</span>
                        <span className="font-bold text-red-600">
                          {reportsData.data.filter((s: any) => (s.rating || 0) < 2.5).length}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="w-5 h-5 text-primary" />
                    الموردين الأعلى قيمة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!hasData(reportsData?.data) ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <LineChart className="w-12 h-12 mx-auto mb-4" />
                      <p>لا توجد بيانات متاحة للتحليل</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {safeSort(reportsData.data, (a: any, b: any) => (b.totalValue || 0) - (a.totalValue || 0))
                        .slice(0, 5)
                        .map((supplier: any, index: number) => (
                          <div key={supplier.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center w-6 h-6 bg-primary text-white rounded-full text-xs font-bold">
                                {index + 1}
                              </div>
                              <span className="font-medium">{supplier.name || 'مورد غير محدد'}</span>
                            </div>
                            <span className="font-bold text-green-600">
                              {formatCurrency(supplier.totalValue || 0)}
                            </span>
                          </div>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  تحليل الالتزام بالمواعيد
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!hasData(reportsData?.data) ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4" />
                    <p>لا توجد بيانات متاحة للتحليل</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {safeSort(reportsData.data, (a: any, b: any) => (b.onTimeDelivery || 0) - (a.onTimeDelivery || 0))
                      .map((supplier: any) => (
                        <div key={supplier.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{supplier.name || 'مورد غير محدد'}</span>
                            <span className="font-bold">{supplier.onTimeDelivery || 0}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                (supplier.onTimeDelivery || 0) >= 90 ? 'bg-green-600' :
                                (supplier.onTimeDelivery || 0) >= 80 ? 'bg-yellow-600' :
                                'bg-red-600'
                              }`}
                              style={{ width: `${supplier.onTimeDelivery || 0}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* تقرير المخاطر */}
        <TabsContent value="risks">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-primary" />
                تقرير المخاطر والتنبيهات
              </CardTitle>
              <CardDescription>إنذار الإدارة حول موردين في قائمة سوداء أو تكرار مشاكل</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingRisks ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <span className="ml-2">جاري تحميل بيانات المخاطر...</span>
                </div>
              ) : risksError ? (
                <div className="text-center py-8 text-red-600">
                  <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
                  <p>خطأ في تحميل بيانات المخاطر</p>
                  <p className="text-sm text-muted-foreground">سيتم عرض البيانات عند توفرها</p>
                </div>
              ) : !hasData(risksData?.data) ? (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
                  <p>لا توجد بيانات مخاطر متاحة</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* موردين عالي المخاطر */}
                  <div>
                    <h3 className="text-lg font-semibold text-red-600 mb-4">موردين عالي المخاطر</h3>
                    <div className="space-y-3">
                      {risksData.data
                        .filter((s: any) => (s.rating || 0) < 3 || (s.complaints || 0) > 3 || (s.onTimeDelivery || 0) < 70)
                        .map((supplier: any) => (
                          <div key={supplier.id} className="p-4 border border-red-200 bg-red-50 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <h4 className="font-semibold text-red-800">{supplier.name || 'مورد غير محدد'}</h4>
                                <div className="flex flex-wrap gap-2">
                                  {(supplier.rating || 0) < 3 && (
                                    <Badge variant="destructive">تقييم منخفض ({(supplier.rating || 0).toFixed(1)})</Badge>
                                  )}
                                  {(supplier.complaints || 0) > 3 && (
                                    <Badge variant="destructive">شكاوى عالية ({supplier.complaints || 0})</Badge>
                                  )}
                                  {(supplier.onTimeDelivery || 0) < 70 && (
                                    <Badge variant="destructive">تأخيرات متكررة ({(supplier.onTimeDelivery || 0).toFixed(1)}%)</Badge>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-muted-foreground">الإجراء المقترح</p>
                                <Badge className="bg-red-100 text-red-800">مراجعة فورية</Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* موردين تحت المراقبة */}
                  <div>
                    <h3 className="text-lg font-semibold text-yellow-600 mb-4">موردين تحت المراقبة</h3>
                    <div className="space-y-3">
                      {risksData.data
                        .filter((s: any) => s.status === "تحت المراقبة" || ((s.rating || 0) >= 3 && (s.rating || 0) < 3.5))
                        .map((supplier: any) => (
                          <div key={supplier.id} className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <h4 className="font-semibold text-yellow-800">{supplier.name || 'مورد غير محدد'}</h4>
                                <p className="text-sm text-muted-foreground">
                                  تقييم: {(supplier.rating || 0).toFixed(1)} | الالتزام: {(supplier.onTimeDelivery || 0).toFixed(1)}%
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-muted-foreground">الإجراء المقترح</p>
                                <Badge className="bg-yellow-100 text-yellow-800">متابعة دورية</Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* موردين خاملين */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-600 mb-4">موردين خاملين (لم يحدث تعامل لأكثر من 3 أشهر)</h3>
                    <div className="space-y-3">
                      {risksData.data
                        .filter((s: any) => {
                          if (!s.lastOrder) return false;
                          const monthsAgo = new Date();
                          monthsAgo.setMonth(monthsAgo.getMonth() - 3);
                          return new Date(s.lastOrder) < monthsAgo;
                        })
                        .map((supplier: any) => (
                          <div key={supplier.id} className="p-4 border border-gray-200 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <h4 className="font-semibold text-gray-800">{supplier.name || 'مورد غير محدد'}</h4>
                                                                 <p className="text-sm text-muted-foreground">
                                   آخر طلبية: {supplier.lastOrder && supplier.lastOrder !== 'Invalid Date' ? 
                                     format(new Date(supplier.lastOrder), "yyyy-MM-dd") : 'غير محدد'}
                                 </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-muted-foreground">الإجراء المقترح</p>
                                <Badge variant="outline">مراجعة الحاجة</Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupplierReports;