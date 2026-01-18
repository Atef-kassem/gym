import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from "recharts";
import { 
  FileText, 
  Download, 
  Share2, 
  Calendar, 
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  DollarSign,
  Activity,
  Target,
  Briefcase
} from "lucide-react";

const FinancialReportsDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedPeriod, setSelectedPeriod] = useState("2024");
  const [reportType, setReportType] = useState("monthly");

  // Mock data for financial reports
  const profitLossData = [
    { month: "يناير", revenue: 450000, expenses: 320000, profit: 130000 },
    { month: "فبراير", revenue: 520000, expenses: 380000, profit: 140000 },
    { month: "مارس", revenue: 480000, expenses: 350000, profit: 130000 },
    { month: "أبريل", revenue: 590000, expenses: 420000, profit: 170000 },
    { month: "مايو", revenue: 630000, expenses: 450000, profit: 180000 },
    { month: "يونيو", revenue: 680000, expenses: 480000, profit: 200000 },
  ];

  const cashFlowData = [
    { month: "يناير", inflow: 500000, outflow: 420000, net: 80000 },
    { month: "فبراير", inflow: 580000, outflow: 460000, net: 120000 },
    { month: "مارس", inflow: 520000, outflow: 440000, net: 80000 },
    { month: "أبريل", inflow: 650000, outflow: 520000, net: 130000 },
    { month: "مايو", inflow: 720000, outflow: 580000, net: 140000 },
    { month: "يونيو", inflow: 780000, outflow: 620000, net: 160000 },
  ];

  const expenseBreakdown = [
    { name: "الرواتب والأجور", value: 35, amount: 280000, color: "#0088FE" },
    { name: "الإيجارات", value: 15, amount: 120000, color: "#00C49F" },
    { name: "المواد والخدمات", value: 25, amount: 200000, color: "#FFBB28" },
    { name: "التسويق", value: 10, amount: 80000, color: "#FF8042" },
    { name: "المصاريف الإدارية", value: 15, amount: 120000, color: "#8884D8" },
  ];

  const revenueGrowthData = [
    { quarter: "Q1 2023", growth: 12 },
    { quarter: "Q2 2023", growth: 18 },
    { quarter: "Q3 2023", growth: 15 },
    { quarter: "Q4 2023", growth: 22 },
    { quarter: "Q1 2024", growth: 28 },
    { quarter: "Q2 2024", growth: 35 },
  ];

  const financialRatios = {
    liquidity: {
      currentRatio: 2.5,
      quickRatio: 1.8,
      cashRatio: 0.9
    },
    profitability: {
      grossMargin: 45.2,
      netMargin: 18.5,
      roe: 15.8
    },
    efficiency: {
      assetTurnover: 1.2,
      inventoryTurnover: 8.5,
      receivablesTurnover: 12.3
    }
  };

  const reportsList = [
    {
      id: 1,
      name: "قائمة الدخل",
      description: "تقرير الأرباح والخسائر الشهري",
      type: "profit-loss",
      lastGenerated: "2024-12-15",
      status: "updated"
    },
    {
      id: 2,
      name: "الميزانية العمومية",
      description: "تقرير المركز المالي",
      type: "balance-sheet",
      lastGenerated: "2024-12-15",
      status: "updated"
    },
    {
      id: 3,
      name: "قائمة التدفقات النقدية",
      description: "تحليل التدفقات النقدية",
      type: "cash-flow",
      lastGenerated: "2024-12-14",
      status: "updated"
    },
    {
      id: 4,
      name: "تحليل النسب المالية",
      description: "النسب المالية والمؤشرات",
      type: "ratios",
      lastGenerated: "2024-12-13",
      status: "pending"
    },
    {
      id: 5,
      name: "تقرير الضريبة المضافة",
      description: "ملخص الضريبة المضافة",
      type: "vat",
      lastGenerated: "2024-12-12",
      status: "updated"
    }
  ];

  const handleGenerateReport = (reportId: number) => {
    console.log(`Generating report: ${reportId}`);
  };

  const handleDownloadReport = (reportId: number) => {
    console.log(`Downloading report: ${reportId}`);
  };

  const handleShareReport = (reportId: number) => {
    console.log(`Sharing report: ${reportId}`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">التقارير والتحليل المالي</h1>
          <p className="text-muted-foreground">تحليل الأداء المالي والتقارير المالية المفصلة</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            مشاركة التقارير
          </Button>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            تقرير جديد
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المبيعات</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,350,000 جنيه مصري</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +12.5% من العام الماضي
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">صافي الربح</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">950,000 جنيه مصري</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +18.3% من العام الماضي
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">هامش الربح</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28.4%</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +2.1% من العام الماضي
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">معدل السيولة</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.5</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              صحي ومستقر
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-end">
        <div className="space-y-2">
          <Label>الفترة الزمنية</Label>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>نوع التقرير</Label>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">شهري</SelectItem>
              <SelectItem value="quarterly">ربع سنوي</SelectItem>
              <SelectItem value="yearly">سنوي</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="profit-loss">الأرباح والخسائر</TabsTrigger>
          <TabsTrigger value="cash-flow">التدفقات النقدية</TabsTrigger>
          <TabsTrigger value="ratios">النسب المالية</TabsTrigger>
          <TabsTrigger value="reports">التقارير</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Growth Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LineChartIcon className="h-5 w-5 mr-2" />
                  نمو المبيعات
                </CardTitle>
                <CardDescription>نسبة نمو المبيعات الربعية</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="quarter" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, 'نسبة النمو']} />
                    <Area type="monotone" dataKey="growth" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Expense Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChartIcon className="h-5 w-5 mr-2" />
                  توزيع المصروفات
                </CardTitle>
                <CardDescription>توزيع المصروفات حسب الفئة</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={expenseBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {expenseBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Quick Financial Summary */}
          <Card>
            <CardHeader>
              <CardTitle>الملخص المالي السريع</CardTitle>
              <CardDescription>أهم المؤشرات المالية للفترة الحالية</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-lg font-bold text-green-600">2.5</div>
                  <div className="text-sm text-muted-foreground">نسبة السيولة الحالية</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-lg font-bold text-blue-600">15.8%</div>
                  <div className="text-sm text-muted-foreground">العائد على الاستثمار</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-lg font-bold text-purple-600">45.2%</div>
                  <div className="text-sm text-muted-foreground">هامش الربح الإجمالي</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-lg font-bold text-orange-600">1.2</div>
                  <div className="text-sm text-muted-foreground">دوران الأصول</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profit-loss" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                قائمة الدخل - المبيعات والمصروفات
              </CardTitle>
              <CardDescription>تحليل المبيعات والمصروفات والأرباح</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={profitLossData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [value.toLocaleString() + ' جنيه مصري', '']} />
                  <Bar dataKey="revenue" fill="#8884d8" name="المبيعات" />
                  <Bar dataKey="expenses" fill="#82ca9d" name="المصروفات" />
                  <Bar dataKey="profit" fill="#ffc658" name="صافي الربح" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cash-flow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                قائمة التدفقات النقدية
              </CardTitle>
              <CardDescription>تحليل التدفقات النقدية الداخلة والخارجة</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={cashFlowData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [value.toLocaleString() + ' جنيه مصري', '']} />
                  <Line type="monotone" dataKey="inflow" stroke="#8884d8" name="التدفقات الداخلة" strokeWidth={2} />
                  <Line type="monotone" dataKey="outflow" stroke="#82ca9d" name="التدفقات الخارجة" strokeWidth={2} />
                  <Line type="monotone" dataKey="net" stroke="#ffc658" name="صافي التدفق" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ratios" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Liquidity Ratios */}
            <Card>
              <CardHeader>
                <CardTitle>نسب السيولة</CardTitle>
                <CardDescription>قدرة الشركة على سداد التزاماتها</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>نسبة السيولة الحالية</span>
                  <span className="font-bold">{financialRatios.liquidity.currentRatio}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>نسبة السيولة السريعة</span>
                  <span className="font-bold">{financialRatios.liquidity.quickRatio}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>نسبة السيولة النقدية</span>
                  <span className="font-bold">{financialRatios.liquidity.cashRatio}</span>
                </div>
              </CardContent>
            </Card>

            {/* Profitability Ratios */}
            <Card>
              <CardHeader>
                <CardTitle>نسب الربحية</CardTitle>
                <CardDescription>قدرة الشركة على تحقيق الأرباح</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>هامش الربح الإجمالي</span>
                  <span className="font-bold">{financialRatios.profitability.grossMargin}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>هامش الربح الصافي</span>
                  <span className="font-bold">{financialRatios.profitability.netMargin}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>العائد على الاستثمار</span>
                  <span className="font-bold">{financialRatios.profitability.roe}%</span>
                </div>
              </CardContent>
            </Card>

            {/* Efficiency Ratios */}
            <Card>
              <CardHeader>
                <CardTitle>نسب الكفاءة</CardTitle>
                <CardDescription>كفاءة استخدام الموارد</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>دوران الأصول</span>
                  <span className="font-bold">{financialRatios.efficiency.assetTurnover}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>دوران المخزون</span>
                  <span className="font-bold">{financialRatios.efficiency.inventoryTurnover}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>دوران المدينين</span>
                  <span className="font-bold">{financialRatios.efficiency.receivablesTurnover}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>إدارة التقارير المالية</CardTitle>
              <CardDescription>إنشاء وإدارة التقارير المالية</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportsList.map((report) => (
                  <div key={report.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h4 className="font-medium">{report.name}</h4>
                        <p className="text-sm text-muted-foreground">{report.description}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant={report.status === "updated" ? "default" : "secondary"}>
                            {report.status === "updated" ? "محدث" : "معلق"}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            آخر إنشاء: {report.lastGenerated}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleGenerateReport(report.id)}
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          إنشاء
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDownloadReport(report.id)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          تحميل
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleShareReport(report.id)}
                        >
                          <Share2 className="h-4 w-4 mr-1" />
                          مشاركة
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialReportsDashboard;