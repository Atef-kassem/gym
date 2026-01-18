import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Download, 
  PieChart, 
  BarChart3,
  TrendingUp,
  Calendar,
  Filter,
  Share,
  Printer,
  Mail
} from 'lucide-react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';

interface FinancialReport {
  id: string;
  title: string;
  type: 'balance_sheet' | 'income_statement' | 'cash_flow' | 'ratios';
  period: string;
  status: 'draft' | 'final' | 'published';
  lastUpdated: string;
}

interface ReportData {
  category: string;
  current: number;
  previous: number;
  change: number;
}

export function FinancialReporting() {
  const [selectedPeriod, setSelectedPeriod] = useState('Q2-2024');
  const [selectedReport, setSelectedReport] = useState('income_statement');

  // Mock data
  const reports: FinancialReport[] = [
    {
      id: '1',
      title: 'قائمة الدخل - الربع الثاني 2024',
      type: 'income_statement',
      period: 'Q2-2024',
      status: 'final',
      lastUpdated: '2024-07-15'
    },
    {
      id: '2',
      title: 'الميزانية العمومية - الربع الثاني 2024',
      type: 'balance_sheet',
      period: 'Q2-2024',
      status: 'final',
      lastUpdated: '2024-07-15'
    },
    {
      id: '3',
      title: 'قائمة التدفقات النقدية - الربع الثاني 2024',
      type: 'cash_flow',
      period: 'Q2-2024',
      status: 'final',
      lastUpdated: '2024-07-15'
    },
    {
      id: '4',
      title: 'النسب المالية - الربع الثاني 2024',
      type: 'ratios',
      period: 'Q2-2024',
      status: 'draft',
      lastUpdated: '2024-07-20'
    }
  ];

  const incomeStatementData: ReportData[] = [
    { category: 'الإيرادات', current: 2500000, previous: 2200000, change: 13.6 },
    { category: 'تكلفة البضاعة المباعة', current: 1500000, previous: 1350000, change: 11.1 },
    { category: 'إجمالي الربح', current: 1000000, previous: 850000, change: 17.6 },
    { category: 'المصروفات التشغيلية', current: 600000, previous: 550000, change: 9.1 },
    { category: 'صافي الربح', current: 400000, previous: 300000, change: 33.3 }
  ];

  const balanceSheetData = [
    { category: 'الأصول المتداولة', amount: 1800000, percentage: 45 },
    { category: 'الأصول الثابتة', amount: 1500000, percentage: 37.5 },
    { category: 'الاستثمارات', amount: 700000, percentage: 17.5 }
  ];

  const cashFlowData = [
    { month: 'يناير', operating: 150000, investing: -50000, financing: 30000 },
    { month: 'فبراير', operating: 180000, investing: -30000, financing: 20000 },
    { month: 'مارس', operating: 200000, investing: -80000, financing: 50000 },
    { month: 'أبريل', operating: 170000, investing: -20000, financing: 10000 },
    { month: 'مايو', operating: 220000, investing: -100000, financing: 40000 },
    { month: 'يونيو', operating: 250000, investing: -60000, financing: 25000 }
  ];

  const financialRatios = [
    { name: 'نسبة السيولة الجارية', current: 2.1, benchmark: 2.0, status: 'good' },
    { name: 'نسبة الدين إلى حقوق الملكية', current: 0.65, benchmark: 0.8, status: 'excellent' },
    { name: 'معدل العائد على الأصول', current: 0.15, benchmark: 0.12, status: 'excellent' },
    { name: 'معدل العائد على حقوق الملكية', current: 0.22, benchmark: 0.18, status: 'good' },
    { name: 'هامش الربح الإجمالي', current: 0.40, benchmark: 0.35, status: 'excellent' },
    { name: 'هامش الربح الصافي', current: 0.16, benchmark: 0.12, status: 'excellent' }
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'final': return 'bg-green-100 text-green-800';
      case 'published': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'مسودة';
      case 'final': return 'نهائي';
      case 'published': return 'منشور';
      default: return status;
    }
  };

  const getRatioStatus = (status: string) => {
    switch (status) {
      case 'excellent': return { color: 'text-green-600', bg: 'bg-green-100', text: 'ممتاز' };
      case 'good': return { color: 'text-blue-600', bg: 'bg-blue-100', text: 'جيد' };
      case 'average': return { color: 'text-yellow-600', bg: 'bg-yellow-100', text: 'متوسط' };
      case 'poor': return { color: 'text-red-600', bg: 'bg-red-100', text: 'ضعيف' };
      default: return { color: 'text-gray-600', bg: 'bg-gray-100', text: 'غير محدد' };
    }
  };

  const formatCurrency = (value: number) => {
    return `${(value / 1000000).toFixed(1)}م جنيه مصري`;
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Report Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="اختر الفترة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Q1-2024">الربع الأول 2024</SelectItem>
              <SelectItem value="Q2-2024">الربع الثاني 2024</SelectItem>
              <SelectItem value="Q3-2024">الربع الثالث 2024</SelectItem>
              <SelectItem value="Q4-2024">الربع الرابع 2024</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedReport} onValueChange={setSelectedReport}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="نوع التقرير" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="income_statement">قائمة الدخل</SelectItem>
              <SelectItem value="balance_sheet">الميزانية العمومية</SelectItem>
              <SelectItem value="cash_flow">التدفقات النقدية</SelectItem>
              <SelectItem value="ratios">النسب المالية</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            تصفية
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            تصدير
          </Button>
          <Button className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            تقرير جديد
          </Button>
        </div>
      </div>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-500" />
            التقارير المالية
          </CardTitle>
          <CardDescription>
            قائمة بالتقارير المالية المتاحة وحالتها
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{report.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      آخر تحديث: {report.lastUpdated}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Badge className={getStatusColor(report.status)}>
                    {getStatusText(report.status)}
                  </Badge>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline">
                      <Download className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Share className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Printer className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Report Details */}
      <Tabs value={selectedReport} onValueChange={setSelectedReport} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="income_statement">قائمة الدخل</TabsTrigger>
          <TabsTrigger value="balance_sheet">الميزانية العمومية</TabsTrigger>
          <TabsTrigger value="cash_flow">التدفقات النقدية</TabsTrigger>
          <TabsTrigger value="ratios">النسب المالية</TabsTrigger>
        </TabsList>

        <TabsContent value="income_statement" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>قائمة الدخل - {selectedPeriod}</CardTitle>
                <CardDescription>
                  مقارنة الأداء مع الفترة السابقة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {incomeStatementData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{item.category}</h4>
                        <p className="text-sm text-muted-foreground">
                          السابق: {formatCurrency(item.previous)}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">
                          {formatCurrency(item.current)}
                        </div>
                        <div className={`text-sm ${item.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatPercentage(item.change)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>تطور الإيرادات والأرباح</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={incomeStatementData.slice(0, 3)}>
                    <defs>
                      <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="category" />
                    <YAxis tickFormatter={formatCurrency} />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Area
                      type="monotone"
                      dataKey="current"
                      stroke="#3b82f6"
                      fillOpacity={1}
                      fill="url(#colorCurrent)"
                      name="الفترة الحالية"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="balance_sheet" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>توزيع الأصول</CardTitle>
                <CardDescription>
                  التوزيع الحالي للأصول حسب الفئات
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={balanceSheetData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({name, percentage}) => `${name}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="amount"
                    >
                      {balanceSheetData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>تفاصيل الأصول</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {balanceSheetData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: COLORS[index] }}
                        ></div>
                        <span className="font-medium">{item.category}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">
                          {formatCurrency(item.amount)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {item.percentage}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cash_flow" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                قائمة التدفقات النقدية
              </CardTitle>
              <CardDescription>
                تتبع التدفقات النقدية التشغيلية والاستثمارية والتمويلية
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={cashFlowData}>
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `${value/1000}ك`} />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip formatter={(value: number) => `${value.toLocaleString()} جنيه مصري`} />
                  <Bar dataKey="operating" fill="#10b981" name="التشغيلية" />
                  <Bar dataKey="investing" fill="#ef4444" name="الاستثمارية" />
                  <Bar dataKey="financing" fill="#3b82f6" name="التمويلية" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ratios" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-500" />
                النسب المالية الرئيسية
              </CardTitle>
              <CardDescription>
                مقارنة النسب المالية مع المعايير المرجعية
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {financialRatios.map((ratio, index) => {
                  const statusInfo = getRatioStatus(ratio.status);
                  return (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{ratio.name}</h4>
                        <Badge className={`${statusInfo.bg} ${statusInfo.color}`}>
                          {statusInfo.text}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">القيمة الحالية</div>
                          <div className="text-lg font-bold">{ratio.current}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">المعيار المرجعي</div>
                          <div className="text-lg font-bold text-muted-foreground">{ratio.benchmark}</div>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span>0</span>
                          <span>{Math.max(ratio.current, ratio.benchmark)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(ratio.current / Math.max(ratio.current, ratio.benchmark)) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Button variant="outline" className="flex items-center gap-2 h-20">
          <Mail className="h-6 w-6" />
          <div className="text-left">
            <div className="font-medium">إرسال تقرير</div>
            <div className="text-xs text-muted-foreground">إرسال عبر البريد</div>
          </div>
        </Button>

        <Button variant="outline" className="flex items-center gap-2 h-20">
          <Calendar className="h-6 w-6" />
          <div className="text-left">
            <div className="font-medium">جدولة التقارير</div>
            <div className="text-xs text-muted-foreground">تقارير دورية</div>
          </div>
        </Button>

        <Button variant="outline" className="flex items-center gap-2 h-20">
          <Download className="h-6 w-6" />
          <div className="text-left">
            <div className="font-medium">تصدير شامل</div>
            <div className="text-xs text-muted-foreground">جميع التقارير</div>
          </div>
        </Button>

        <Button variant="outline" className="flex items-center gap-2 h-20">
          <Share className="h-6 w-6" />
          <div className="text-left">
            <div className="font-medium">مشاركة</div>
            <div className="text-xs text-muted-foreground">رابط مشاركة</div>
          </div>
        </Button>
      </div>
    </div>
  );
}