import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, 
  Download, 
  Filter, 
  Calendar,
  Users,
  DollarSign,
  Clock,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Target,
  AlertTriangle,
  CheckCircle,
  Eye,
  Printer,
  Mail,
  Share
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';

interface ReportSummary {
  title: string;
  description: string;
  icon: any;
  route: string;
  color: string;
  dataPoints: number;
  lastUpdated: string;
  category: 'general' | 'payroll' | 'attendance' | 'recruitment' | 'performance';
}

export default function HCMReports() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isExporting, setIsExporting] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  // Mock data
  const reportSummaries: ReportSummary[] = [
    {
      title: "تقرير شامل للموظفين",
      description: "إحصائيات ومعلومات تفصيلية عن جميع الموظفين",
      icon: Users,
      route: "/hcm/reports/employees",
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
      dataPoints: 324,
      lastUpdated: "منذ ساعة",
      category: "general"
    },
    {
      title: "تقرير الرواتب والمستحقات",
      description: "تفاصيل الرواتب والحوافز والاستقطاعات",
      icon: DollarSign,
      route: "/hcm/reports/payroll",
      color: "bg-gradient-to-r from-green-500 to-green-600",
      dataPoints: 2450000,
      lastUpdated: "منذ يوم",
      category: "payroll"
    },
    {
      title: "تقرير الحضور والإجازات",
      description: "إحصائيات الحضور والغياب وطلبات الإجازات",
      icon: Clock,
      route: "/hcm/reports/attendance",
      color: "bg-gradient-to-r from-orange-500 to-orange-600",
      dataPoints: 1250,
      lastUpdated: "منذ ساعتين",
      category: "attendance"
    },
    {
      title: "تقرير التوظيف",
      description: "إحصائيات التوظيف والمرشحين والمقابلات",
      icon: Target,
      route: "/hcm/reports/recruitment",
      color: "bg-gradient-to-r from-purple-500 to-purple-600",
      dataPoints: 45,
      lastUpdated: "منذ 3 ساعات",
      category: "recruitment"
    },
    {
      title: "تقرير تقييم الأداء",
      description: "نتائج تقييمات الأداء والحوافز والمكافآت",
      icon: TrendingUp,
      route: "/hcm/reports/performance",
      color: "bg-gradient-to-r from-indigo-500 to-indigo-600",
      dataPoints: 298,
      lastUpdated: "منذ 4 ساعات",
      category: "performance"
    },
    {
      title: "تقرير نهاية الخدمة",
      description: "إحصائيات المغادرين وأسباب ترك العمل",
      icon: AlertTriangle,
      route: "/hcm/reports/offboarding",
      color: "bg-gradient-to-r from-red-500 to-red-600",
      dataPoints: 12,
      lastUpdated: "منذ يوم",
      category: "general"
    }
  ];

  const kpiData = [
    { name: "إجمالي الموظفين", value: 324, change: +8, color: "text-blue-600" },
    { name: "معدل الحضور", value: 94.5, change: +2.1, color: "text-green-600" },
    { name: "الرواتب الشهرية", value: 2450000, change: +5.2, color: "text-emerald-600" },
    { name: "معدل دوران الموظفين", value: 3.2, change: -0.8, color: "text-orange-600" }
  ];

  const attendanceData = [
    { month: 'يناير', attendance: 95.2, absence: 4.8 },
    { month: 'فبراير', attendance: 94.8, absence: 5.2 },
    { month: 'مارس', attendance: 96.1, absence: 3.9 },
    { month: 'أبريل', attendance: 93.5, absence: 6.5 },
    { month: 'مايو', attendance: 94.7, absence: 5.3 },
    { month: 'يونيو', attendance: 95.3, absence: 4.7 }
  ];

  const departmentData = [
    { name: 'الإدارة العامة', employees: 45, percentage: 13.9 },
    { name: 'المبيعات', employees: 89, percentage: 27.5 },
    { name: 'التشغيل', employees: 124, percentage: 38.3 },
    { name: 'التقنية', employees: 38, percentage: 11.7 },
    { name: 'الأخرى', employees: 28, percentage: 8.6 }
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const filteredReports = selectedCategory === 'all' 
    ? reportSummaries 
    : reportSummaries.filter(report => report.category === selectedCategory);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}م`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}ك`;
    return num.toString();
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'general': return 'عام';
      case 'payroll': return 'الرواتب';
      case 'attendance': return 'الحضور';
      case 'recruitment': return 'التوظيف';
      case 'performance': return 'الأداء';
      default: return 'الكل';
    }
  };

  // Handler functions
  const handleViewReport = (report: ReportSummary) => {
    toast({
      title: "فتح التقرير",
      description: `جاري فتح ${report.title}...`,
    });
    
    // Navigate to specific report
    setTimeout(() => {
      navigate(report.route);
    }, 1000);
  };

  const handleDownloadReport = (report: ReportSummary) => {
    toast({
      title: "تحميل التقرير",
      description: `جاري تحميل ${report.title} بصيغة PDF...`,
    });
    
    // Simulate download
    setTimeout(() => {
      toast({
        title: "تم التحميل بنجاح",
        description: `تم تحميل ${report.title} إلى مجلد التحميلات`,
      });
    }, 2000);
  };

  const handleShareReport = (report: ReportSummary) => {
    navigator.clipboard.writeText(`${window.location.origin}${report.route}`);
    toast({
      title: "تم نسخ الرابط",
      description: `تم نسخ رابط ${report.title} إلى الحافظة`,
    });
  };

  const handleExportAll = async () => {
    setIsExporting(true);
    toast({
      title: "جاري التصدير",
      description: "جاري تصدير جميع التقارير...",
    });
    
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      toast({
        title: "تم التصدير بنجاح",
        description: "تم تصدير جميع التقارير بنجاح",
      });
    }, 3000);
  };

  const handleApplyFilter = () => {
    setIsFiltering(true);
    toast({
      title: "تطبيق الفلاتر",
      description: `جاري تطبيق فلتر ${getCategoryLabel(selectedCategory)} للفترة المحددة...`,
    });
    
    setTimeout(() => {
      setIsFiltering(false);
      toast({
        title: "تم التطبيق",
        description: "تم تطبيق الفلاتر بنجاح",
      });
    }, 1500);
  };

  const handlePrintReports = () => {
    toast({
      title: "جاري التحضير للطباعة",
      description: "جاري تحضير التقارير للطباعة...",
    });
    
    setTimeout(() => {
      window.print();
      toast({
        title: "جاهز للطباعة",
        description: "تم فتح نافذة الطباعة",
      });
    }, 1000);
  };

  const handleEmailReports = () => {
    toast({
      title: "إرسال بالبريد الإلكتروني",
      description: "جاري إعداد التقارير للإرسال...",
    });
    
    setTimeout(() => {
      toast({
        title: "تم الإرسال",
        description: "تم إرسال التقارير إلى البريد الإلكتروني المحدد",
      });
    }, 2000);
  };

  const handleScheduleReports = () => {
    toast({
      title: "جدولة التقارير",
      description: "تم تفعيل الجدولة التلقائية للتقارير",
    });
  };

  const handleShareAll = () => {
    navigator.clipboard.writeText(`${window.location.origin}/hcm/reports`);
    toast({
      title: "تم نسخ رابط الصفحة",
      description: "تم نسخ رابط صفحة التقارير للمشاركة",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="p-6 rounded-xl border shadow-lg bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-primary animate-pulse" />
              <div>
                <h1 className="text-3xl font-bold">تقارير الموارد البشرية</h1>
                <p className="text-muted-foreground mt-2">
                  تقارير شاملة ومفصلة لجميع أنشطة إدارة الموارد البشرية
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={handleApplyFilter}
                disabled={isFiltering}
              >
                <Filter className="h-4 w-4" />
                {isFiltering ? 'جاري التطبيق...' : 'تصفية'}
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={handleExportAll}
                disabled={isExporting}
              >
                <Download className="h-4 w-4" />
                {isExporting ? 'جاري التصدير...' : 'تصدير'}
              </Button>
            </div>
          </div>
        </div>

        {/* KPI Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {kpiData.map((kpi, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{kpi.name}</p>
                    <p className={`text-2xl font-bold ${kpi.color}`}>
                      {kpi.name.includes('الرواتب') ? `${formatNumber(kpi.value)} جنيه مصري` :
                       kpi.name.includes('معدل') ? `${kpi.value}%` : formatNumber(kpi.value)}
                    </p>
                    <div className={`flex items-center gap-1 text-sm mt-1 ${
                      kpi.change > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {kpi.change > 0 ? 
                        <TrendingUp className="h-3 w-3" /> : 
                        <TrendingUp className="h-3 w-3 rotate-180" />
                      }
                      {kpi.change > 0 ? '+' : ''}{kpi.change}%
                    </div>
                  </div>
                  <Activity className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="اختر الفترة الزمنية" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">هذا الأسبوع</SelectItem>
              <SelectItem value="month">هذا الشهر</SelectItem>
              <SelectItem value="quarter">هذا الربع</SelectItem>
              <SelectItem value="year">هذا العام</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="فئة التقرير" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع التقارير</SelectItem>
              <SelectItem value="general">تقارير عامة</SelectItem>
              <SelectItem value="payroll">تقارير الرواتب</SelectItem>
              <SelectItem value="attendance">تقارير الحضور</SelectItem>
              <SelectItem value="recruitment">تقارير التوظيف</SelectItem>
              <SelectItem value="performance">تقارير الأداء</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="reports" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              التقارير
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              التحليلات
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              الرؤى والاتجاهات
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredReports.map((report, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className={`p-2 rounded-lg ${report.color} text-white`}>
                        <report.icon className="h-5 w-5" />
                      </div>
                      <Badge variant="secondary">
                        {getCategoryLabel(report.category)}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{report.title}</CardTitle>
                    <CardDescription>{report.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">نقاط البيانات:</span>
                        <span className="font-medium">{formatNumber(report.dataPoints)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">آخر تحديث:</span>
                        <span className="font-medium">{report.lastUpdated}</span>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleViewReport(report)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          عرض
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDownloadReport(report)}
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleShareReport(report)}
                        >
                          <Share className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Attendance Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-orange-500" />
                    معدلات الحضور الشهرية
                  </CardTitle>
                  <CardDescription>
                    تطور معدلات الحضور والغياب خلال الأشهر الماضية
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={attendanceData}>
                      <defs>
                        <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="attendance"
                        stroke="#10b981"
                        fillOpacity={1}
                        fill="url(#colorAttendance)"
                        name="الحضور %"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Department Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-blue-500" />
                    توزيع الموظفين حسب القسم
                  </CardTitle>
                  <CardDescription>
                    التوزيع الحالي للموظفين على الأقسام المختلفة
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={departmentData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({name, percentage}) => `${name}: ${percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="employees"
                      >
                        {departmentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Department Details */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>تفاصيل الأقسام</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departmentData.map((dept, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: COLORS[index] }}
                        ></div>
                        <span className="font-medium">{dept.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                          {dept.employees} موظف
                        </span>
                        <span className="font-bold text-blue-600">
                          {dept.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    رؤى إيجابية
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 border rounded-lg bg-green-50">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-semibold text-green-800">تحسن معدل الحضور</span>
                    </div>
                    <p className="text-sm text-green-700">
                      ارتفع معدل الحضور بنسبة 2.1% مقارنة بالشهر السابق
                    </p>
                  </div>
                  
                  <div className="p-3 border rounded-lg bg-blue-50">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span className="font-semibold text-blue-800">نمو الفريق</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      تم توظيف 12 موظف جديد هذا الشهر بزيادة 8% عن الشهر السابق
                    </p>
                  </div>
                  
                  <div className="p-3 border rounded-lg bg-purple-50">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4 text-purple-600" />
                      <span className="font-semibold text-purple-800">أداء متميز</span>
                    </div>
                    <p className="text-sm text-purple-700">
                      89% من الموظفين حققوا أهدافهم الشهرية أو تجاوزوها
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    نقاط تحتاج انتباه
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 border rounded-lg bg-orange-50">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-orange-600" />
                      <span className="font-semibold text-orange-800">طلبات إجازة معلقة</span>
                    </div>
                    <p className="text-sm text-orange-700">
                      هناك 23 طلب إجازة في انتظار الموافقة، يحتاج متابعة
                    </p>
                  </div>
                  
                  <div className="p-3 border rounded-lg bg-yellow-50">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-yellow-600" />
                      <span className="font-semibold text-yellow-800">التدريب المطلوب</span>
                    </div>
                    <p className="text-sm text-yellow-700">
                      45 موظف بحاجة لاستكمال برامج التدريب الإلزامية
                    </p>
                  </div>
                  
                  <div className="p-3 border rounded-lg bg-red-50">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="font-semibold text-red-800">مراجعة عاجلة</span>
                    </div>
                    <p className="text-sm text-red-700">
                      5 ملفات موظفين تحتاج مراجعة ناقصة المستندات
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Button 
            variant="outline" 
            className="flex items-center gap-2 h-20"
            onClick={handlePrintReports}
          >
            <Printer className="h-6 w-6" />
            <div className="text-left">
              <div className="font-medium">طباعة التقارير</div>
              <div className="text-xs text-muted-foreground">طباعة مجمعة</div>
            </div>
          </Button>

          <Button 
            variant="outline" 
            className="flex items-center gap-2 h-20"
            onClick={handleEmailReports}
          >
            <Mail className="h-6 w-6" />
            <div className="text-left">
              <div className="font-medium">إرسال بالبريد</div>
              <div className="text-xs text-muted-foreground">جدولة الإرسال</div>
            </div>
          </Button>

          <Button 
            variant="outline" 
            className="flex items-center gap-2 h-20"
            onClick={handleScheduleReports}
          >
            <Calendar className="h-6 w-6" />
            <div className="text-left">
              <div className="font-medium">تقارير مجدولة</div>
              <div className="text-xs text-muted-foreground">تقارير دورية</div>
            </div>
          </Button>

          <Button 
            variant="outline" 
            className="flex items-center gap-2 h-20"
            onClick={handleShareAll}
          >
            <Share className="h-6 w-6" />
            <div className="text-left">
              <div className="font-medium">مشاركة</div>
              <div className="text-xs text-muted-foreground">رابط مشاركة</div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}