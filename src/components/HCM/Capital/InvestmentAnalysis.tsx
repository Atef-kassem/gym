import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  BarChart3,
  Target,
  Zap,
  AlertTriangle,
  CheckCircle,
  XCircle
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
  ScatterChart,
  Scatter,
  BarChart,
  Bar
} from 'recharts';

interface Investment {
  id: string;
  name: string;
  type: 'stocks' | 'bonds' | 'real_estate' | 'commodities' | 'crypto';
  amount: number;
  currentValue: number;
  roi: number;
  risk: 'low' | 'medium' | 'high';
  duration: number;
  status: 'active' | 'matured' | 'pending';
}

interface Portfolio {
  totalValue: number;
  totalInvested: number;
  totalReturn: number;
  riskScore: number;
  diversificationScore: number;
}

export function InvestmentAnalysis() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('6m');

  // Mock data
  const portfolio: Portfolio = {
    totalValue: 3500000,
    totalInvested: 3000000,
    totalReturn: 500000,
    riskScore: 35,
    diversificationScore: 78
  };

  const investments: Investment[] = [
    {
      id: '1',
      name: 'صندوق الأسهم المصرية',
      type: 'stocks',
      amount: 1000000,
      currentValue: 1200000,
      roi: 20,
      risk: 'medium',
      duration: 12,
      status: 'active'
    },
    {
      id: '2',
      name: 'سندات حكومية',
      type: 'bonds',
      amount: 800000,
      currentValue: 840000,
      roi: 5,
      risk: 'low',
      duration: 24,
      status: 'active'
    },
    {
      id: '3',
      name: 'استثمار عقاري',
      type: 'real_estate',
      amount: 1200000,
      currentValue: 1460000,
      roi: 21.7,
      risk: 'medium',
      duration: 36,
      status: 'active'
    }
  ];

  const performanceData = [
    { month: 'يناير', portfolio: 3000000, market: 3000000 },
    { month: 'فبراير', portfolio: 3100000, market: 3050000 },
    { month: 'مارس', portfolio: 3200000, market: 3100000 },
    { month: 'أبريل', portfolio: 3350000, market: 3200000 },
    { month: 'مايو', portfolio: 3400000, market: 3250000 },
    { month: 'يونيو', portfolio: 3500000, market: 3300000 },
  ];

  const riskReturnData = investments.map(inv => ({
    name: inv.name,
    risk: inv.risk === 'low' ? 20 : inv.risk === 'medium' ? 50 : 80,
    return: inv.roi,
    amount: inv.currentValue
  }));

  const sectorAnalysis = [
    { sector: 'التقنية', allocation: 30, performance: 15.2, recommendation: 'زيادة' },
    { sector: 'العقارات', allocation: 25, performance: 12.8, recommendation: 'احتفاظ' },
    { sector: 'البنوك', allocation: 20, performance: 8.5, recommendation: 'تقليل' },
    { sector: 'الطاقة', allocation: 15, performance: 18.3, recommendation: 'زيادة' },
    { sector: 'أخرى', allocation: 10, performance: 5.2, recommendation: 'تقليل' },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'stocks': return <TrendingUp className="h-4 w-4" />;
      case 'bonds': return <Target className="h-4 w-4" />;
      case 'real_estate': return <DollarSign className="h-4 w-4" />;
      default: return <PieChart className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'stocks': return 'bg-blue-100 text-blue-800';
      case 'bonds': return 'bg-green-100 text-green-800';
      case 'real_estate': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'low': return <Badge className="bg-green-100 text-green-800">منخفض</Badge>;
      case 'medium': return <Badge className="bg-yellow-100 text-yellow-800">متوسط</Badge>;
      case 'high': return <Badge className="bg-red-100 text-red-800">عالي</Badge>;
      default: return <Badge>غير محدد</Badge>;
    }
  };

  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation) {
      case 'زيادة': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'تقليل': return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'احتفاظ': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const formatCurrency = (value: number) => {
    return `${(value / 1000000).toFixed(1)}م جنيه مصري`;
  };

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">القيمة الإجمالية</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(portfolio.totalValue)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">إجمالي العوائد</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(portfolio.totalReturn)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">مستوى المخاطر</p>
                <p className={`text-2xl font-bold ${getRiskColor('medium')}`}>
                  {portfolio.riskScore}%
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">درجة التنويع</p>
                <p className="text-2xl font-bold text-purple-600">
                  {portfolio.diversificationScore}%
                </p>
              </div>
              <PieChart className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">الأداء</TabsTrigger>
          <TabsTrigger value="portfolio">المحفظة</TabsTrigger>
          <TabsTrigger value="analysis">التحليل القطاعي</TabsTrigger>
          <TabsTrigger value="recommendations">التوصيات</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>أداء المحفظة مقابل السوق</CardTitle>
                <CardDescription>
                  مقارنة أداء المحفظة مع مؤشر السوق العام
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={formatCurrency} />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Line 
                      type="monotone" 
                      dataKey="portfolio" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      name="المحفظة"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="market" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="السوق"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>تحليل المخاطر والعوائد</CardTitle>
                <CardDescription>
                  توزيع الاستثمارات حسب مستوى المخاطر والعوائد
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart data={riskReturnData}>
                    <XAxis dataKey="risk" name="مستوى المخاطر" />
                    <YAxis dataKey="return" name="العائد %" />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'return' ? `${value}%` : value,
                        name === 'return' ? 'العائد' : 'المخاطر'
                      ]}
                    />
                    <Scatter 
                      data={riskReturnData} 
                      fill="#3b82f6"
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="portfolio" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>تفاصيل المحفظة الاستثمارية</CardTitle>
              <CardDescription>
                قائمة شاملة بجميع الاستثمارات وأدائها الحالي
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {investments.map((investment) => (
                  <div key={investment.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${getTypeColor(investment.type)}`}>
                          {getTypeIcon(investment.type)}
                        </div>
                        <div>
                          <h3 className="font-semibold">{investment.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            مدة الاستثمار: {investment.duration} شهر
                          </p>
                        </div>
                      </div>
                      <div className="text-left">
                        <div className="text-lg font-bold">
                          {formatCurrency(investment.currentValue)}
                        </div>
                        <div className={`text-sm ${investment.roi > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {investment.roi > 0 ? '+' : ''}{investment.roi}%
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <span>المبلغ المستثمر: {formatCurrency(investment.amount)}</span>
                        <span>المخاطر: {getRiskBadge(investment.risk)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={Math.abs(investment.roi)} 
                          className="w-20"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>التحليل القطاعي</CardTitle>
              <CardDescription>
                توزيع الاستثمارات وأداء القطاعات المختلفة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sectorAnalysis.map((sector, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <h4 className="font-semibold">{sector.sector}</h4>
                        <p className="text-sm text-muted-foreground">
                          التخصيص: {sector.allocation}%
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">
                          +{sector.performance}%
                        </div>
                        <div className="text-xs text-muted-foreground">الأداء</div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {getRecommendationIcon(sector.recommendation)}
                        <span className="text-sm font-medium">
                          {sector.recommendation}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sectorAnalysis}>
                    <XAxis dataKey="sector" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Bar dataKey="allocation" fill="#3b82f6" name="التخصيص %" />
                    <Bar dataKey="performance" fill="#10b981" name="الأداء %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  توصيات ذكية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 border rounded-lg bg-green-50">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="font-semibold text-green-800">فرصة استثمارية</span>
                  </div>
                  <p className="text-sm text-green-700">
                    يُنصح بزيادة الاستثمار في قطاع التقنية بنسبة 10% لتحسين العوائد
                  </p>
                </div>
                
                <div className="p-3 border rounded-lg bg-yellow-50">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="font-semibold text-yellow-800">تحذير</span>
                  </div>
                  <p className="text-sm text-yellow-700">
                    تركز عالي في القطاع العقاري، يُنصح بإعادة التوازن
                  </p>
                </div>
                
                <div className="p-3 border rounded-lg bg-blue-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-blue-600" />
                    <span className="font-semibold text-blue-800">تحسين</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    إضافة استثمارات دولية لتحسين التنويع الجغرافي
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>خطة التحسين المقترحة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">زيادة التقنية</span>
                    <span className="text-sm font-medium text-green-600">+10%</span>
                  </div>
                  <Progress value={70} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">تقليل العقارات</span>
                    <span className="text-sm font-medium text-red-600">-5%</span>
                  </div>
                  <Progress value={30} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">إضافة دولي</span>
                    <span className="text-sm font-medium text-blue-600">+15%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                
                <Button className="w-full mt-4">
                  تطبيق التوصيات
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}