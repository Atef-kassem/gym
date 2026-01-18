import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  Target,
  Activity,
  Gauge
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
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';

interface CapitalMetrics {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  currentRatio: number;
  debtToEquity: number;
  roi: number;
  riskScore: number;
  liquidityRatio: number;
}

interface AICapitalDashboardProps {
  metrics: CapitalMetrics;
}

export function AICapitalDashboard({ metrics }: AICapitalDashboardProps) {
  // Mock data for charts
  const performanceData = [
    { month: 'يناير', assets: 2200000, liabilities: 1100000, netWorth: 1100000 },
    { month: 'فبراير', assets: 2300000, liabilities: 1150000, netWorth: 1150000 },
    { month: 'مارس', assets: 2400000, liabilities: 1180000, netWorth: 1220000 },
    { month: 'أبريل', assets: 2450000, liabilities: 1200000, netWorth: 1250000 },
    { month: 'مايو', assets: 2500000, liabilities: 1200000, netWorth: 1300000 },
  ];

  const assetAllocation = [
    { name: 'العقارات', value: 40, color: '#3b82f6' },
    { name: 'الاستثمارات المالية', value: 30, color: '#10b981' },
    { name: 'النقد والأرصدة', value: 20, color: '#f59e0b' },
    { name: 'أصول أخرى', value: 10, color: '#ef4444' },
  ];

  const riskMetrics = [
    { name: 'السيولة', score: 85, benchmark: 80 },
    { name: 'الربحية', score: 92, benchmark: 85 },
    { name: 'الاستقرار', score: 78, benchmark: 75 },
    { name: 'النمو', score: 88, benchmark: 80 },
  ];

  const getRiskLevel = (score: number) => {
    if (score <= 30) return { level: 'منخفض', color: 'text-green-600', bg: 'bg-green-100' };
    if (score <= 60) return { level: 'متوسط', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { level: 'عالي', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const riskInfo = getRiskLevel(metrics.riskScore);

  const formatCurrency = (value: number) => {
    return `${(value / 1000000).toFixed(1)}م جنيه مصري`;
  };

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              أداء ج.م المال
            </CardTitle>
            <CardDescription>
              تطور الأصول والخصوم وصافي القيمة خلال الأشهر الماضية
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorAssets" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorNetWorth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" />
                <YAxis tickFormatter={formatCurrency} />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Area
                  type="monotone"
                  dataKey="assets"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorAssets)"
                  name="الأصول"
                />
                <Area
                  type="monotone"
                  dataKey="netWorth"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorNetWorth)"
                  name="صافي القيمة"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-500" />
              توزيع الأصول
            </CardTitle>
            <CardDescription>
              التوزيع الحالي للأصول حسب الفئات
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={assetAllocation}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({name, value}) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {assetAllocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Financial Ratios */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">نسبة السيولة الجارية</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{metrics.currentRatio}</div>
            <Progress value={metrics.currentRatio * 20} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.currentRatio > 2 ? 'ممتاز' : metrics.currentRatio > 1.5 ? 'جيد' : 'يحتاج تحسين'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">نسبة الدين إلى حقوق الملكية</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{metrics.debtToEquity}</div>
            <Progress value={(1 - metrics.debtToEquity) * 100} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.debtToEquity < 1 ? 'مستوى آمن' : 'يحتاج مراجعة'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">مستوى المخاطر</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${riskInfo.color}`}>
              {metrics.riskScore}%
            </div>
            <Progress value={metrics.riskScore} className="mt-2" />
            <Badge className={`mt-2 ${riskInfo.bg} ${riskInfo.color}`}>
              {riskInfo.level}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* AI Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gauge className="h-5 w-5 text-orange-500" />
            مؤشرات الأداء الذكية
          </CardTitle>
          <CardDescription>
            تقييم شامل للأداء المالي مقارنة بالمعايير المرجعية
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={riskMetrics} layout="horizontal">
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="name" type="category" width={80} />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Bar dataKey="score" fill="#3b82f6" name="الأداء الحالي" />
              <Bar dataKey="benchmark" fill="#10b981" name="المعيار المرجعي" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-4 text-center">
            <Zap className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <h3 className="font-semibold text-sm">تحليل سريع</h3>
            <p className="text-xs text-muted-foreground">تحليل فوري للوضع المالي</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <h3 className="font-semibold text-sm">توقعات النمو</h3>
            <p className="text-xs text-muted-foreground">نمذجة سيناريوهات النمو</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-4 text-center">
            <DollarSign className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <h3 className="font-semibold text-sm">تحسين الاستثمار</h3>
            <p className="text-xs text-muted-foreground">اقتراحات لتحسين العوائد</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-4 text-center">
            <TrendingDown className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <h3 className="font-semibold text-sm">تقليل المخاطر</h3>
            <p className="text-xs text-muted-foreground">استراتيجيات تقليل المخاطر</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}