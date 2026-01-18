import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  Download, 
  Calendar as CalendarIcon, 
  TrendingUp, 
  Users, 
  Clock, 
  Star,
  AlertCircle,
  CheckCircle,
  Filter,
  BarChart3,
  PieChart as PieChartIcon,
  FileText
} from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

const customerSatisfactionData = [
  { month: "يناير", rating: 4.2, responses: 120 },
  { month: "فبراير", rating: 4.5, responses: 135 },
  { month: "مارس", rating: 4.3, responses: 142 },
  { month: "أبريل", rating: 4.7, responses: 156 },
  { month: "مايو", rating: 4.6, responses: 168 },
  { month: "يونيو", rating: 4.8, responses: 175 }
];

const waitTimeData = [
  { day: "السبت", avgWaitTime: 15, peakTime: 25 },
  { day: "الأحد", avgWaitTime: 12, peakTime: 20 },
  { day: "الإثنين", avgWaitTime: 18, peakTime: 30 },
  { day: "الثلاثاء", avgWaitTime: 14, peakTime: 22 },
  { day: "الأربعاء", avgWaitTime: 16, peakTime: 28 },
  { day: "الخميس", avgWaitTime: 20, peakTime: 35 },
  { day: "الجمعة", avgWaitTime: 25, peakTime: 40 }
];

const serviceDistributionData = [
  { name: "  خارجي", value: 45, color: "#8884d8" },
  { name: "  شامل", value: 30, color: "#82ca9d" },
  { name: "  VIP", value: 15, color: "#ffc658" },
  { name: "تنظيف داخلي", value: 10, color: "#ff7300" }
];

const complaintCategoriesData = [
  { category: "جودة الخدمة", count: 25, trend: "+15%" },
  { category: "وقت الانتظار", count: 18, trend: "-8%" },
  { category: "مشاكل الإيصالات", count: 12, trend: "+5%" },
  { category: "سلوك الموظفين", count: 8, trend: "-12%" },
  { category: "أخرى", count: 5, trend: "0%" }
];

const employeePerformanceData = [
  { name: "أحمد محمد", customersServed: 45, avgRating: 4.8, efficiency: 92 },
  { name: "فاطمة علي", customersServed: 38, avgRating: 4.6, efficiency: 88 },
  { name: "محمد خالد", customersServed: 42, avgRating: 4.7, efficiency: 90 },
  { name: "سارة أحمد", customersServed: 35, avgRating: 4.9, efficiency: 95 }
];

export default function ReceptionReports() {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: new Date(2024, 0, 1),
    to: new Date()
  });
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [reportType, setReportType] = useState("summary");

  const handleExportReport = (type: string) => {
    // Export report functionality
  };

  return (
    <div className="container mx-auto p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center animate-slide-in-right">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            تقارير الاستقبال
          </h1>
          <p className="text-muted-foreground animate-fade-in" style={{animationDelay: '200ms'}}>
            تحليلات مفصلة عن أداء إدارة الاستقبال وخدمة العملاء
          </p>
        </div>
        
        <div className="flex gap-3 animate-scale-in">
          <Button variant="outline" onClick={() => handleExportReport("pdf")} className="hover-scale shadow-md hover:shadow-lg transition-all duration-300 hover:border-primary/50">
            <Download className="h-4 w-4 ml-2" />
            تصدير PDF
          </Button>
          <Button variant="outline" onClick={() => handleExportReport("excel")} className="hover-scale shadow-md hover:shadow-lg transition-all duration-300 hover:border-primary/50">
            <Download className="h-4 w-4 ml-2" />
            تصدير Excel
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">فلاتر التقرير:</span>
            </div>
            
            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="اختر الفرع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الفروع</SelectItem>
                <SelectItem value="main">الفرع الرئيسي</SelectItem>
                <SelectItem value="branch2">الفرع الثاني</SelectItem>
                <SelectItem value="branch3">الفرع الثالث</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[280px]">
                  <CalendarIcon className="h-4 w-4 ml-2" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "dd/MM/yyyy", { locale: ar })} - {" "}
                        {format(dateRange.to, "dd/MM/yyyy", { locale: ar })}
                      </>
                    ) : (
                      format(dateRange.from, "dd/MM/yyyy", { locale: ar })
                    )
                  ) : (
                    "اختر الفترة الزمنية"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={{ from: dateRange.from, to: dateRange.to }}
                  onSelect={(range) => {
                    if (range) {
                      setDateRange({
                        from: range.from,
                        to: range.to
                      });
                    }
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>

            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="نوع التقرير" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="summary">ملخص</SelectItem>
                <SelectItem value="detailed">تفصيلي</SelectItem>
                <SelectItem value="comparative">مقارن</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-scale-in">
        <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200/50 animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي العملاء</CardTitle>
            <Users className="h-4 w-4 text-blue-500 animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">1,234</div>
            <p className="text-xs text-green-600">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +12% من الشهر الماضي
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">متوسط وقت الانتظار</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">16 دقيقة</div>
            <p className="text-xs text-green-600">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              تحسن بـ 2 دقيقة
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">رضا العملاء</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center">
              4.7
              <Star className="h-4 w-4 text-yellow-500 mr-1 fill-current" />
            </div>
            <p className="text-xs text-green-600">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +0.3 من الشهر الماضي
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">معدل حل الشكاوى</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">95%</div>
            <p className="text-xs text-green-600">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +3% من الشهر الماضي
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <Tabs defaultValue="satisfaction" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="satisfaction">رضا العملاء</TabsTrigger>
          <TabsTrigger value="waittime">أوقات الانتظار</TabsTrigger>
          <TabsTrigger value="services">توزيع الخدمات</TabsTrigger>
          <TabsTrigger value="complaints">الشكاوى</TabsTrigger>
          <TabsTrigger value="performance">أداء الموظفين</TabsTrigger>
        </TabsList>

        <TabsContent value="satisfaction" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="h-5 w-5 ml-2" />
                تطور رضا العملاء
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={customerSatisfactionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === "rating" ? `${value} نجمة` : `${value} استجابة`,
                      name === "rating" ? "التقييم" : "عدد الاستجابات"
                    ]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="rating" 
                    stroke="#8884d8" 
                    strokeWidth={3}
                    dot={{ fill: "#8884d8", strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="waittime" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 ml-2" />
                متوسط أوقات الانتظار حسب الأيام
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={waitTimeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} دقيقة`, ""]} />
                  <Bar dataKey="avgWaitTime" fill="#8884d8" name="متوسط الانتظار" />
                  <Bar dataKey="peakTime" fill="#82ca9d" name="ذروة الانتظار" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChartIcon className="h-5 w-5 ml-2" />
                توزيع الخدمات المطلوبة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={serviceDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {serviceDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                
                <div className="space-y-3">
                  {serviceDistributionData.map((service, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: service.color }}
                        />
                        <span className="font-medium">{service.name}</span>
                      </div>
                      <Badge variant="outline">{service.value}%</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="complaints" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="h-5 w-5 ml-2" />
                تصنيف الشكاوى والاتجاهات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complaintCategoriesData.map((complaint, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">{complaint.category}</h4>
                      <p className="text-sm text-muted-foreground">{complaint.count} شكوى هذا الشهر</p>
                    </div>
                    <div className="text-left">
                      <Badge 
                        variant={complaint.trend.startsWith('+') ? "destructive" : "default"}
                        className={complaint.trend.startsWith('-') ? "bg-green-100 text-green-800" : ""}
                      >
                        {complaint.trend}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 ml-2" />
                أداء موظفي الاستقبال
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {employeePerformanceData.map((employee, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">{employee.name}</h4>
                      <p className="text-sm text-muted-foreground">موظف استقبال</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{employee.customersServed}</div>
                      <p className="text-xs text-muted-foreground">عميل مخدوم</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold flex items-center justify-center">
                        {employee.avgRating}
                        <Star className="h-4 w-4 text-yellow-500 mr-1 fill-current" />
                      </div>
                      <p className="text-xs text-muted-foreground">متوسط التقييم</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{employee.efficiency}%</div>
                      <p className="text-xs text-muted-foreground">كفاءة الأداء</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Detailed Reports Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 ml-2" />
            تقارير تفصيلية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <BarChart3 className="h-6 w-6" />
              <span>تقرير الأداء اليومي</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Users className="h-6 w-6" />
              <span>تقرير رضا العملاء</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Clock className="h-6 w-6" />
              <span>تقرير أوقات الخدمة</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <AlertCircle className="h-6 w-6" />
              <span>تقرير الشكاوى</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <CheckCircle className="h-6 w-6" />
              <span>تقرير حل المشاكل</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <TrendingUp className="h-6 w-6" />
              <span>تقرير مقارن شهري</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}