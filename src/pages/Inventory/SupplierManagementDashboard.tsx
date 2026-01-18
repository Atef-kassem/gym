import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { 
  useGetSupplierStatsQuery,
  useGetTopSuppliersQuery,
  useGetSupplierActivityQuery,
  useGetSupplierPerformanceQuery,
  useGetSupplierAlertsQuery,
  useGetActiveContractsQuery,
  useGetSupplierPaymentsQuery,
  useExportSuppliersMutation
} from "@/services/supplierDashboardApi";
import { 
  Users, 
  TrendingUp, 
  Package, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  MapPin,
  Star,
  Activity,
  ArrowUp,
  ArrowDown,
  BarChart3,
  Target,
  Calendar,
  ShoppingCart,
  FileText,
  Eye,
  Building,
  Phone,
  Mail,
  Plus,
  Settings,
  CreditCard,
  RefreshCw,
  Loader2
} from "lucide-react";
import { useEffect, useState } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard = ({ title, value, subtitle, icon, color, trend }: StatCardProps) => (
  <Card className={`relative hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-l-4 bg-gradient-to-br from-white/90 to-gray-50/80 backdrop-blur-md ${color} overflow-hidden group`}>
    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
      <CardTitle className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
        {title}
      </CardTitle>
      <div className="p-3 rounded-xl bg-gradient-to-br from-white/90 to-gray-100/70 shadow-lg group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
    </CardHeader>
    <CardContent className="relative z-10">
      <div className="text-3xl font-bold text-gray-900 mb-2 group-hover:scale-105 transition-transform duration-300">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      <div className="flex items-center gap-3">
        <p className="text-sm text-gray-600 font-medium">{subtitle}</p>
        {trend && (
          <Badge 
            variant={trend.isPositive ? "default" : "destructive"}
            className="text-xs shadow-md"
          >
            {trend.isPositive ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
            {trend.value}%
          </Badge>
        )}
      </div>
    </CardContent>
  </Card>
);

interface TopSupplierProps {
  id: number;
  name: string;
  category: string;
  totalAmount: string;
  rating: number;
  status: string;
}

const TopSupplierCard = ({ name, category, totalAmount, rating, status }: TopSupplierProps) => {
  const statusColors = {
    'نشط': "bg-green-100 text-green-800 border-green-200",
    'معلق': "bg-yellow-100 text-yellow-800 border-yellow-200", 
    'غير نشط': "bg-red-100 text-red-800 border-red-200",
    'محظور': "bg-gray-100 text-gray-800 border-gray-200"
  };

  const statusText = {
    'نشط': "نشط",
    'معلق': "معلق",
    'غير نشط': "غير نشط",
    'محظور': "محظور"
  };

  return (
    <Card className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-0 bg-gradient-to-r from-white/90 to-gray-50/80 backdrop-blur-sm">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{name}</h4>
          <Badge className={`text-xs border ${statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800 border-gray-200'} shadow-sm`}>
            {statusText[status as keyof typeof statusText] || status}
          </Badge>
        </div>
        <p className="text-sm text-gray-600 mb-3 font-medium">{category}</p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold bg-gradient-to-r from-primary to-secondary-blue bg-clip-text text-transparent">{totalAmount}</span>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm font-semibold text-gray-700">{rating}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const SupplierManagementDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // استخدام البيانات الحقيقية من API
  const { data: statsData, isLoading: statsLoading, error: statsError } = useGetSupplierStatsQuery(undefined, {
    skip: !localStorage.getItem("authToken")
  });

  const { data: topSuppliersData, isLoading: topSuppliersLoading, error: topSuppliersError } = useGetTopSuppliersQuery(4, {
    skip: !localStorage.getItem("authToken")
  });

  const { data: activityData, isLoading: activityLoading, error: activityError } = useGetSupplierActivityQuery({ days: 30 }, {
    skip: !localStorage.getItem("authToken")
  });

  const { data: performanceData, isLoading: performanceLoading, error: performanceError } = useGetSupplierPerformanceQuery({ period: 'month' }, {
    skip: !localStorage.getItem("authToken")
  });

  const { data: alertsData, isLoading: alertsLoading, error: alertsError } = useGetSupplierAlertsQuery(undefined, {
    skip: !localStorage.getItem("authToken")
  });

  const { data: contractsData, isLoading: contractsLoading, error: contractsError } = useGetActiveContractsQuery({ status: 'نشط' }, {
    skip: !localStorage.getItem("authToken")
  });

  const { data: paymentsData, isLoading: paymentsLoading, error: paymentsError } = useGetSupplierPaymentsQuery({ status: 'معلق' }, {
    skip: !localStorage.getItem("authToken")
  });

  // استخدام API التصدير
  const [exportSuppliers, { isLoading: exportLoading }] = useExportSuppliersMutation();

  // استخراج البيانات من API مع معالجة أفضل
  const stats = statsData?.data || {};
  const topSuppliers = topSuppliersData?.data || [];
  const activities = activityData?.data || [];
  const performance = performanceData?.data || {};
  const alerts = alertsData?.data || [];
  const contracts = contractsData?.data || [];
  const payments = paymentsData?.data || [];

  // دوال مساعدة لمعالجة البيانات
  const formatNumber = (value: any, defaultValue = 0) => {
    if (value === null || value === undefined || isNaN(value)) return defaultValue;
    return typeof value === 'number' ? value.toLocaleString() : defaultValue;
  };

  const formatPercentage = (value: any, defaultValue = 0) => {
    if (value === null || value === undefined || isNaN(value)) return defaultValue;
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return isNaN(numValue) ? defaultValue : Math.round(numValue);
  };

  const formatCurrency = (value: any, defaultValue = 0) => {
    if (value === null || value === undefined || isNaN(value)) return defaultValue;
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return defaultValue;
    return `${numValue.toLocaleString()} جنيه مصري`;
  };

  const getSafeValue = (obj: any, key: string, defaultValue: any = null) => {
    if (!obj || typeof obj !== 'object') return defaultValue;
    const value = obj[key];
    return value !== null && value !== undefined ? value : defaultValue;
  };

  const hasData = (data: any) => {
    if (Array.isArray(data)) return data.length > 0;
    if (typeof data === 'object') return Object.keys(data).length > 0;
    return !!data;
  };

  // Handle functions
  const handleRefreshData = () => {
    setLastUpdate(new Date());
    toast({
      title: "تم تحديث البيانات",
      description: "تم تحديث جميع بيانات الموردين بنجاح",
    });
  };

  const handleAddSupplier = () => {
    navigate("/suppliers?tab=suppliers");
  };

  const handleCreatePurchaseOrder = () => {
    navigate("/purchase-orders");
  };

  const handleQuickPurchaseOrder = () => {
    navigate("/quick-purchase-orders");
  };

  const handleSupplierEvaluation = () => {
    navigate("/suppliers?tab=evaluation");
  };

  const handleViewReports = () => {
    navigate("/suppliers?tab=reports");
  };

  const handleViewSettings = () => {
    navigate("/suppliers?tab=settings");
  };

  const handleViewPayments = () => {
    navigate("/suppliers?tab=payments");
  };

  const handleViewContracts = () => {
    navigate("/suppliers?tab=contracts");
  };

  const handleViewAlerts = () => {
    toast({
      title: "عرض التنبيهات",
      description: "سيتم عرض جميع التنبيهات المعلقة",
    });
  };

  const handleExportData = async () => {
    try {
      await exportSuppliers({
        format: 'xlsx',
        includeStats: true
      }).unwrap();
      
      toast({
        title: "تم التصدير بنجاح",
        description: "تم تصدير بيانات الموردين",
      });
    } catch (error) {
      toast({
        title: "خطأ في التصدير",
        description: "حدث خطأ أثناء تصدير البيانات",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 font-cairo">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        
        {/* Quick Actions Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="lg" 
              className="gap-3 bg-white/80 backdrop-blur-sm border-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 transform hover:scale-105 shadow-lg"
              onClick={handleRefreshData}
              disabled={statsLoading}
            >
              {statsLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
              <Activity className="w-5 h-5 text-blue-600" />
              )}
              تحديث البيانات
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="gap-3 bg-white/80 backdrop-blur-sm border-2 border-green-200 hover:bg-green-50 hover:border-green-300 transition-all duration-300 transform hover:scale-105 shadow-lg"
              onClick={handleExportData}
              disabled={exportLoading}
            >
              {exportLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <FileText className="w-5 h-5 text-green-600" />
              )}
              تصدير البيانات
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="gap-2 px-4 py-2 bg-green-100 text-green-800 border border-green-200 shadow-md">
              <CheckCircle className="w-4 h-4" />
              محدث الآن
            </Badge>
            <div className="text-sm text-gray-600">
              آخر تحديث: {lastUpdate.toLocaleTimeString('ar-SA')}
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid with Real Data */}
        {statsError ? (
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <p className="text-red-600 text-lg font-semibold">خطأ في تحميل الإحصائيات</p>
            <p className="text-sm text-gray-500 mt-2">سيتم عرض البيانات عند توفرها</p>
          </div>
        ) : !hasData(stats) && !statsLoading ? (
          <div className="text-center py-8">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-semibold">لا توجد بيانات إحصائية</p>
            <p className="text-sm text-gray-500 mt-2">سيتم عرض البيانات عند توفرها</p>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="group relative animate-bounce-in" style={{ animationDelay: '0.1s' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
            <StatCard
              title="إجمالي الموردين"
                value={statsLoading ? '...' : formatNumber(getSafeValue(stats, 'totalSuppliers', 0))}
              subtitle="مورد مسجل"
              icon={<Users className="w-6 h-6 text-blue-600" />}
              color="border-l-blue-500"
                trend={statsLoading ? undefined : { 
                  value: formatPercentage(getSafeValue(stats, 'growthRate', 0)), 
                  isPositive: formatPercentage(getSafeValue(stats, 'growthRate', 0)) >= 0 
                }}
            />
          </div>
          
          <div className="group relative animate-bounce-in" style={{ animationDelay: '0.2s' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
            <StatCard
              title="الموردين النشطين"
                value={statsLoading ? '...' : formatNumber(getSafeValue(stats, 'activeSuppliers', 0))}
              subtitle="يعملون حالياً"
              icon={<CheckCircle className="w-6 h-6 text-green-600" />}
              color="border-l-green-500"
                trend={statsLoading ? undefined : { 
                  value: formatPercentage(getSafeValue(stats, 'activeGrowthRate', 0)), 
                  isPositive: formatPercentage(getSafeValue(stats, 'activeGrowthRate', 0)) >= 0 
                }}
            />
          </div>
          
          <div className="group relative animate-bounce-in" style={{ animationDelay: '0.3s' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
            <StatCard
              title="إجمالي المشتريات"
                value={statsLoading ? '...' : formatCurrency(getSafeValue(stats, 'totalPurchases', 0))}
              subtitle="هذا الشهر"
              icon={<DollarSign className="w-6 h-6 text-purple-600" />}
              color="border-l-purple-500"
                trend={statsLoading ? undefined : { 
                  value: formatPercentage(getSafeValue(stats, 'purchasesGrowthRate', 0)), 
                  isPositive: formatPercentage(getSafeValue(stats, 'purchasesGrowthRate', 0)) >= 0 
                }}
            />
          </div>
          
          <div className="group relative animate-bounce-in" style={{ animationDelay: '0.4s' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
            <StatCard
              title="طلبات معلقة"
                value={statsLoading ? '...' : formatNumber(getSafeValue(stats, 'pendingRequests', 0))}
              subtitle="تحتاج موافقة"
              icon={<Clock className="w-6 h-6 text-orange-600" />}
              color="border-l-orange-500"
            />
          </div>
        </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Dashboard */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Performance Metrics with Real Data */}
            <div className="relative animate-slide-up" style={{ animationDelay: '0.5s' }}>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-200/20 via-indigo-200/10 to-purple-200/20 rounded-3xl blur-xl"></div>
              <Card className="relative bg-white/80 backdrop-blur-md border-0 shadow-2xl rounded-3xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
                <CardHeader className="bg-gradient-to-r from-blue-50/80 via-indigo-50/60 to-purple-50/80 backdrop-blur-sm p-6">
                  <CardTitle className="flex items-center gap-4 text-gray-800">
                    <div className="relative">
                      <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-md opacity-30 animate-pulse"></div>
                      <div className="relative p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                        <BarChart3 className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">مؤشرات الأداء الرئيسية</h3>
                      <p className="text-gray-600 mt-1 font-medium">تحليل شامل لأداء الموردين وجودة الخدمات</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  {performanceLoading ? (
                    <div className="flex items-center justify-center h-32">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    </div>
                  ) : performanceError ? (
                    <div className="text-center py-8">
                      <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-4" />
                      <p className="text-red-600">خطأ في تحميل مؤشرات الأداء</p>
                      <p className="text-sm text-gray-500 mt-2">سيتم عرض البيانات عند توفرها</p>
                    </div>
                  ) : !hasData(performance) ? (
                    <div className="text-center py-8">
                      <BarChart3 className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">لا توجد بيانات مؤشرات الأداء</p>
                      <p className="text-sm text-gray-500 mt-2">سيتم عرض البيانات عند توفرها</p>
                    </div>
                  ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center group">
                      <div className="relative mb-4">
                          <div className="text-4xl font-bold text-green-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                            {formatPercentage(getSafeValue(performance, 'onTimeDelivery', 0))}%
                          </div>
                        <div className="text-sm text-gray-600 font-semibold">معدل الالتزام بالمواعيد</div>
                      </div>
                      <div className="relative">
                          <Progress value={formatPercentage(getSafeValue(performance, 'onTimeDelivery', 0))} className="h-3 bg-gray-200 rounded-full overflow-hidden" />
                          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full" style={{ width: `${formatPercentage(getSafeValue(performance, 'onTimeDelivery', 0))}%` }}></div>
                        </div>
                    </div>
                    <div className="text-center group">
                      <div className="relative mb-4">
                          <div className="text-4xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                            {formatPercentage(getSafeValue(performance, 'averageRating', 0), 1)}
                          </div>
                        <div className="text-sm text-gray-600 font-semibold">متوسط التقييم</div>
                      </div>
                      <div className="relative">
                          <Progress value={(formatPercentage(getSafeValue(performance, 'averageRating', 0), 1)) * 20} className="h-3 bg-gray-200 rounded-full overflow-hidden" />
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-500 h-3 rounded-full" style={{ width: `${(formatPercentage(getSafeValue(performance, 'averageRating', 0), 1)) * 20}%` }}></div>
                        </div>
                    </div>
                    <div className="text-center group">
                      <div className="relative mb-4">
                          <div className="text-4xl font-bold text-purple-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                            {formatPercentage(getSafeValue(performance, 'qualityRate', 0))}%
                          </div>
                        <div className="text-sm text-gray-600 font-semibold">معدل جودة المنتجات</div>
                      </div>
                      <div className="relative">
                          <Progress value={formatPercentage(getSafeValue(performance, 'qualityRate', 0))} className="h-3 bg-gray-200 rounded-full overflow-hidden" />
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-500 h-3 rounded-full" style={{ width: `${formatPercentage(getSafeValue(performance, 'qualityRate', 0))}%` }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Recent Activities with Real Data */}
            <div className="relative animate-slide-up" style={{ animationDelay: '0.7s' }}>
              <div className="absolute inset-0 bg-gradient-to-r from-green-200/20 via-blue-200/10 to-indigo-200/20 rounded-3xl blur-xl"></div>
              <Card className="relative bg-white/90 backdrop-blur-md border-0 shadow-2xl rounded-3xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-blue-500 to-indigo-500"></div>
                <CardHeader className="bg-gradient-to-r from-green-50/80 via-blue-50/60 to-indigo-50/80 backdrop-blur-sm p-6">
                  <CardTitle className="flex items-center gap-4 text-gray-800">
                    <div className="relative">
                      <div className="absolute inset-0 bg-green-500 rounded-2xl blur-md opacity-30 animate-pulse"></div>
                      <div className="relative p-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl shadow-lg">
                        <Activity className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-green-700 to-blue-700 bg-clip-text text-transparent">الأنشطة الحديثة</h3>
                      <p className="text-gray-600 mt-1 font-medium">آخر التحديثات والعمليات المهمة</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {activityLoading ? (
                    <div className="flex items-center justify-center h-32">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    </div>
                  ) : activityError ? (
                    <div className="text-center py-8">
                      <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-4" />
                      <p className="text-red-600">خطأ في تحميل الأنشطة</p>
                      <p className="text-sm text-gray-500 mt-2">سيتم عرض البيانات عند توفرها</p>
                    </div>
                  ) : !hasData(activities) ? (
                    <div className="text-center py-8">
                      <Activity className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">لا توجد أنشطة حديثة</p>
                      <p className="text-sm text-gray-500 mt-2">سيتم عرض البيانات عند توفرها</p>
                    </div>
                  ) : (
                    activities.slice(0, 3).map((activity: any, index: number) => (
                      <div key={index} className="group flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-blue-100">
                    <div className="relative">
                          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                          <div className="absolute inset-0 w-3 h-3 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: `${index * 0.5}s` }}></div>
                    </div>
                    <div className="flex-1">
                          <p className="font-semibold text-gray-900">{getSafeValue(activity, 'description', 'نشاط جديد')}</p>
                          <p className="text-sm text-gray-600">{getSafeValue(activity, 'timeAgo', 'منذ لحظات')}</p>
                    </div>
                        <Badge variant="default" className="bg-blue-100 text-blue-800 border border-blue-200">
                          {getSafeValue(activity, 'type', 'نشاط')}
                        </Badge>
                  </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

          </div>

          {/* Right Sidebar - Enhanced Cards */}
          <div className="space-y-8">
            
            {/* Top Suppliers with Real Data */}
            <div className="relative animate-slide-up" style={{ animationDelay: '0.9s' }}>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-200/20 via-orange-200/10 to-red-200/20 rounded-3xl blur-xl"></div>
              <Card className="relative bg-white/90 backdrop-blur-md border-0 shadow-2xl rounded-3xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500"></div>
                <CardHeader className="bg-gradient-to-r from-yellow-50/80 via-orange-50/60 to-red-50/80 backdrop-blur-sm p-6">
                  <CardTitle className="flex items-center gap-4 text-gray-800">
                    <div className="relative">
                      <div className="absolute inset-0 bg-yellow-500 rounded-2xl blur-md opacity-30 animate-pulse"></div>
                      <div className="relative p-3 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl shadow-lg">
                        <Star className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-700 to-orange-700 bg-clip-text text-transparent">أفضل الموردين</h3>
                      <p className="text-gray-600 mt-1 font-medium">الموردين الأعلى تقييماً وأداءً</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {topSuppliersLoading ? (
                    <div className="flex items-center justify-center h-32">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    </div>
                  ) : topSuppliersError ? (
                    <div className="text-center py-8">
                      <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-4" />
                      <p className="text-red-600">خطأ في تحميل أفضل الموردين</p>
                      <p className="text-sm text-gray-500 mt-2">سيتم عرض البيانات عند توفرها</p>
                    </div>
                  ) : !hasData(topSuppliers) ? (
                    <div className="text-center py-8">
                      <Star className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">لا توجد بيانات للموردين</p>
                      <p className="text-sm text-gray-500 mt-2">سيتم عرض البيانات عند توفرها</p>
                    </div>
                  ) : (
                    topSuppliers.map((supplier: any, index: number) => (
                      <div key={supplier.id || index} style={{ animationDelay: `${(index + 1) * 0.1}s` }} className="animate-slide-up">
                        <TopSupplierCard 
                          id={supplier.id || index}
                          name={String(getSafeValue(supplier, 'name_ar') || getSafeValue(supplier, 'supplierName') || 'غير محدد')}
                          category={String(getSafeValue(supplier, 'supplierCategory') || 'غير محدد')}
                          totalAmount={formatCurrency(getSafeValue(supplier, 'totalAmount', 0))}
                          rating={formatPercentage(getSafeValue(supplier, 'supplierRating', 0), 1)}
                          status={getSafeValue(supplier, 'status') || 'نشط'}
                        />
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats with Real Data */}
            <div className="relative animate-slide-up" style={{ animationDelay: '1.1s' }}>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-200/20 via-purple-200/10 to-pink-200/20 rounded-3xl blur-xl"></div>
              <Card className="relative bg-white/90 backdrop-blur-md border-0 shadow-2xl rounded-3xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                <CardHeader className="bg-gradient-to-r from-indigo-50/80 via-purple-50/60 to-pink-50/80 backdrop-blur-sm p-6">
                  <CardTitle className="flex items-center gap-4 text-gray-800">
                    <div className="relative">
                      <div className="absolute inset-0 bg-indigo-500 rounded-2xl blur-md opacity-30 animate-pulse"></div>
                      <div className="relative p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
                        <Target className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">إحصائيات سريعة</h3>
                      <p className="text-gray-600 mt-1 font-medium">معلومات مهمة وسريعة</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl hover:shadow-md transition-all duration-300 group">
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-700 transition-colors">المناطق المغطاة</span>
                    <Badge 
                      variant="outline" 
                      className="flex items-center gap-2 cursor-pointer hover:bg-blue-100 hover:border-blue-300 transition-all duration-300 shadow-sm"
                      onClick={() => navigate("/suppliers?tab=settings")}
                    >
                      <MapPin className="w-3 h-3" />
                      {formatNumber(getSafeValue(stats, 'coveredRegions', 0))} منطقة
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:shadow-md transition-all duration-300 group">
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-green-700 transition-colors">العقود النشطة</span>
                    <Badge 
                      variant="outline" 
                      className="flex items-center gap-2 cursor-pointer hover:bg-green-100 hover:border-green-300 transition-all duration-300 shadow-sm"
                      onClick={handleViewContracts}
                    >
                      <FileText className="w-3 h-3" />
                      {formatNumber(contracts.length || 0)} عقد
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl hover:shadow-md transition-all duration-300 group">
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-red-700 transition-colors">التنبيهات المعلقة</span>
                    <Badge 
                      variant="destructive" 
                      className="flex items-center gap-2 cursor-pointer hover:bg-red-600 transition-all duration-300 shadow-sm"
                      onClick={handleViewAlerts}
                    >
                      <AlertTriangle className="w-3 h-3" />
                      {formatNumber(alerts.length || 0)} تنبيهات
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions with Enhanced Design */}
            <div className="relative animate-slide-up" style={{ animationDelay: '1.3s' }}>
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200/20 via-slate-200/10 to-zinc-200/20 rounded-3xl blur-xl"></div>
              <Card className="relative bg-white/90 backdrop-blur-md border-0 shadow-2xl rounded-3xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-500 via-slate-500 to-zinc-500"></div>
                <CardHeader className="bg-gradient-to-r from-gray-50/80 via-slate-50/60 to-zinc-50/80 backdrop-blur-sm p-6">
                  <CardTitle className="text-xl font-bold text-gray-800">إجراءات سريعة</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 hover:bg-gradient-to-r hover:from-blue-100 hover:to-cyan-100 hover:border-blue-300 hover:text-blue-700 transition-all duration-300 transform hover:scale-[1.02] shadow-sm"
                    onClick={handleAddSupplier}
                  >
                    <Users className="w-5 h-5" />
                    إضافة مورد جديد
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 hover:bg-gradient-to-r hover:from-green-100 hover:to-emerald-100 hover:border-green-300 hover:text-green-700 transition-all duration-300 transform hover:scale-[1.02] shadow-sm"
                    onClick={handleCreatePurchaseOrder}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    إنشاء طلب شراء
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start gap-3 p-4 bg-gradient-to-r from-teal-50 to-cyan-50 border-teal-200 hover:bg-gradient-to-r hover:from-teal-100 hover:to-cyan-100 hover:border-teal-300 hover:text-teal-700 transition-all duration-300 transform hover:scale-[1.02] shadow-sm"
                    onClick={handleQuickPurchaseOrder}
                  >
                    <Plus className="w-5 h-5" />
                    أمر شراء سريع
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start gap-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 hover:bg-gradient-to-r hover:from-yellow-100 hover:to-orange-100 hover:border-yellow-300 hover:text-yellow-700 transition-all duration-300 transform hover:scale-[1.02] shadow-sm"
                    onClick={handleSupplierEvaluation}
                  >
                    <Star className="w-5 h-5" />
                    تقييم موردين
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 hover:border-purple-300 hover:text-purple-700 transition-all duration-300 transform hover:scale-[1.02] shadow-sm"
                    onClick={handleViewReports}
                  >
                    <BarChart3 className="w-5 h-5" />
                    تقارير شاملة
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start gap-3 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200 hover:bg-gradient-to-r hover:from-indigo-100 hover:to-blue-100 hover:border-indigo-300 hover:text-indigo-700 transition-all duration-300 transform hover:scale-[1.02] shadow-sm"
                    onClick={handleViewPayments}
                  >
                    <CreditCard className="w-5 h-5" />
                    مدفوعات الموردين
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start gap-3 p-4 bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200 hover:bg-gradient-to-r hover:from-gray-100 hover:to-slate-100 hover:border-gray-300 hover:text-gray-700 transition-all duration-300 transform hover:scale-[1.02] shadow-sm"
                    onClick={handleViewSettings}
                  >
                    <Settings className="w-5 h-5" />
                    إعدادات الموردين
                  </Button>
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierManagementDashboard;