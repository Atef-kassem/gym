/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Building2,
  TrendingUp,
  BarChart3,
  MapPin,
  DollarSign,
  Users,
  Star,
  Activity,
  Target,
  Clock,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  Cell,
} from "recharts";

const branchComparisonData = [
  {
    name: "العليا",
    dailySales: 28200,
    monthlySales: 720000,
    customers: 1250,
    employees: 12,
    rating: 4.8,
    performance: 95,
    services: 89,
    color: "#22c55e",
  },
  {
    name: "الشفا",
    dailySales: 12420,
    monthlySales: 350000,
    customers: 680,
    employees: 8,
    rating: 4.6,
    performance: 87,
    services: 42,
    color: "#3b82f6",
  },
  {
    name: "القصيم",
    dailySales: 4700,
    monthlySales: 145000,
    customers: 320,
    employees: 6,
    rating: 4.2,
    performance: 75,
    services: 25,
    color: "#f59e0b",
  },
];

const monthlyPerformanceData = [
  { month: "يناير", العليا: 680000, الشفا: 320000, القصيم: 120000 },
  { month: "فبراير", العليا: 720000, الشفا: 340000, القصيم: 130000 },
  { month: "مارس", العليا: 750000, الشفا: 350000, القصيم: 145000 },
  { month: "أبريل", العليا: 690000, الشفا: 330000, القصيم: 135000 },
  { month: "مايو", العليا: 780000, الشفا: 370000, القصيم: 155000 },
  { month: "يونيو", العليا: 820000, الشفا: 380000, القصيم: 160000 },
];

const performanceDistribution = [
  { name: "ممتاز (90%+)", value: 1, fill: "#22c55e" },
  { name: "جيد (70-89%)", value: 1, fill: "#3b82f6" },
  { name: "يحتاج تحسين (<70%)", value: 1, fill: "#f59e0b" },
];

export function BranchComparison() {
  const [selectedMetric, setSelectedMetric] = useState("sales");

  const getMetricValue = (branch: any, metric: string) => {
    switch (metric) {
      case "sales":
        return branch.dailySales;
      case "customers":
        return branch.customers;
      case "employees":
        return branch.employees;
      case "services":
        return branch.services;
      case "rating":
        return branch.rating;
      default:
        return branch.performance;
    }
  };

  const getMetricLabel = (metric: string) => {
    switch (metric) {
      case "sales":
        return "المبيعات اليومية";
      case "customers":
        return "عدد العملاء";
      case "employees":
        return "عدد الموظفين";
      case "services":
        return "عدد الخدمات";
      case "rating":
        return "التقييم";
      default:
        return "الأداء العام";
    }
  };

  const getMetricUnit = (metric: string) => {
    switch (metric) {
      case "sales":
        return "جنيه مصري";
      case "customers":
        return "عميل";
      case "employees":
        return "موظف";
      case "services":
        return "خدمة";
      case "rating":
        return "⭐";
      default:
        return "%";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between p-6 rounded-xl border shadow-lg bg-card">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-primary" />
            مقارنة أداء الفروع
          </h1>
          <p className="text-muted-foreground">
            تحليل شامل ومقارنة تفصيلية لأداء جميع الفروع
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="sales">المبيعات</TabsTrigger>
          <TabsTrigger value="performance">الأداء</TabsTrigger>
          <TabsTrigger value="detailed">تحليل مفصل</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Comparison Cards */}
          <div className="grid gap-6 md:grid-cols-3">
            {branchComparisonData.map((branch, index) => (
              <Card
                key={branch.name}
                className="group hover:shadow-lg transition-all duration-200 relative overflow-hidden"
              >
                <div
                  className="absolute top-0 left-0 w-full h-1"
                  style={{ backgroundColor: branch.color }}
                />
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Building2
                        className="h-5 w-5"
                        style={{ color: branch.color }}
                      />
                      فرع {branch.name}
                    </CardTitle>
                    <Badge
                      className={`${
                        index === 0
                          ? "bg-yellow-500"
                          : index === 1
                          ? "bg-gray-400"
                          : "bg-orange-500"
                      } text-white`}
                    >
                      #{index + 1}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center p-3 bg-primary/5 rounded-lg">
                      <div className="text-lg font-bold text-primary">
                        {branch.dailySales.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        مبيعات اليوم
                      </div>
                    </div>
                    <div className="text-center p-3 bg-secondary/5 rounded-lg">
                      <div className="text-lg font-bold text-secondary">
                        {branch.services}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        خدمات اليوم
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        الأداء العام
                      </span>
                      <span
                        className="font-bold"
                        style={{ color: branch.color }}
                      >
                        {branch.performance}%
                      </span>
                    </div>
                    <Progress value={branch.performance} className="h-2" />
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{branch.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      <span>{branch.customers} عميل</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Performance Overview Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                مقارنة شاملة للمؤشرات
              </CardTitle>
              <CardDescription>
                مقارنة جميع المؤشرات المهمة بين الفروع
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={branchComparisonData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                    />
                    <XAxis
                      dataKey="name"
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip />
                    <Bar
                      dataKey="dailySales"
                      fill="#22c55e"
                      radius={[4, 4, 0, 0]}
                      name="المبيعات اليومية"
                    />
                    <Bar
                      dataKey="services"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                      name="عدد الخدمات"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales" className="space-y-6">
          {/* Monthly Sales Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                مقارنة المبيعات الشهرية
              </CardTitle>
              <CardDescription>
                تطور المبيعات خلال الأشهر الماضية
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyPerformanceData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                    />
                    <XAxis
                      dataKey="month"
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="العليا"
                      stroke="#22c55e"
                      strokeWidth={3}
                      name="فرع العليا"
                    />
                    <Line
                      type="monotone"
                      dataKey="الشفا"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      name="فرع الشفا"
                    />
                    <Line
                      type="monotone"
                      dataKey="القصيم"
                      stroke="#f59e0b"
                      strokeWidth={3}
                      name="فرع القصيم"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Sales Summary */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  إجمالي المبيعات الشهرية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">
                  1,215,000 جنيه مصري
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  <TrendingUp className="h-4 w-4 inline text-green-500" /> +8.5%
                  من الشهر الماضي
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  متوسط المبيعات اليومية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-secondary">
                  15,107 جنيه مصري
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  بين جميع الفروع
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">أفضل فرع هذا الشهر</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">العليا</div>
                <p className="text-sm text-muted-foreground mt-2">
                  720,000 جنيه مصري (59% من الإجمالي)
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* Performance Distribution */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  توزيع مستويات الأداء
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={performanceDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} (${(percent * 100).toFixed(0)}%)`
                        }
                      >
                        {performanceDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  مؤشرات الأداء الرئيسية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="font-medium">متوسط الأداء العام</span>
                    <span className="font-bold text-green-600">85.7%</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="font-medium">متوسط التقييم</span>
                    <span className="font-bold text-blue-600">4.5 ⭐</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="font-medium">إجمالي العملاء</span>
                    <span className="font-bold text-purple-600">2,250</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <span className="font-medium">إجمالي الموظفين</span>
                    <span className="font-bold text-orange-600">26</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Ranking */}
          <Card>
            <CardHeader>
              <CardTitle>ترتيب الفروع حسب الأداء</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {branchComparisonData
                  .sort((a, b) => b.performance - a.performance)
                  .map((branch, index) => (
                    <div
                      key={branch.name}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                            index === 0
                              ? "bg-yellow-500"
                              : index === 1
                              ? "bg-gray-400"
                              : "bg-orange-500"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-semibold">فرع {branch.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {branch.customers} عميل • {branch.employees} موظف
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className="font-bold text-lg"
                          style={{ color: branch.color }}
                        >
                          {branch.performance}%
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {branch.rating}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-6">
          {/* Detailed Metrics Table */}
          <Card>
            <CardHeader>
              <CardTitle>جدول المقارنة التفصيلي</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-right p-3">الفرع</th>
                      <th className="text-right p-3">المبيعات اليومية</th>
                      <th className="text-right p-3">المبيعات الشهرية</th>
                      <th className="text-right p-3">العملاء</th>
                      <th className="text-right p-3">الموظفين</th>
                      <th className="text-right p-3">الخدمات</th>
                      <th className="text-right p-3">التقييم</th>
                      <th className="text-right p-3">الأداء</th>
                    </tr>
                  </thead>
                  <tbody>
                    {branchComparisonData.map((branch) => (
                      <tr
                        key={branch.name}
                        className="border-b hover:bg-muted/50"
                      >
                        <td className="p-3 font-medium">فرع {branch.name}</td>
                        <td className="p-3">
                          {branch.dailySales.toLocaleString()} جنيه مصري
                        </td>
                        <td className="p-3">
                          {branch.monthlySales.toLocaleString()} جنيه مصري
                        </td>
                        <td className="p-3">{branch.customers}</td>
                        <td className="p-3">{branch.employees}</td>
                        <td className="p-3">{branch.services}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            {branch.rating}
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge
                            style={{
                              backgroundColor: branch.color,
                              color: "white",
                            }}
                          >
                            {branch.performance}%
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                توصيات التحسين
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="font-semibold text-green-600">نقاط القوة</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      فرع العليا يحقق أداءً ممتازاً (95%)
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      تقييمات عملاء مرتفعة في جميع الفروع
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      نمو مستمر في المبيعات الشهرية
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-orange-600">
                    مجالات التحسين
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full" />
                      فرع القصيم يحتاج دعم إضافي
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full" />
                      زيادة عدد الموظفين في الفروع النشطة
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full" />
                      تحسين استراتيجيات التسويق المحلي
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
