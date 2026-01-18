import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calculator, 
  TrendingUp, 
  TrendingDown, 
  Brain,
  Target,
  BarChart3,
  LineChart,
  Zap,
  Calendar,
  DollarSign
} from 'lucide-react';
import {
  LineChart as RechartsLineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Bar,
  ScatterChart,
  Scatter
} from 'recharts';

interface ForecastData {
  period: string;
  actual?: number;
  conservative: number;
  optimistic: number;
  pessimistic: number;
  aiPrediction: number;
}

interface ScenarioAnalysis {
  name: string;
  probability: number;
  expectedReturn: number;
  variance: number;
  risk: 'low' | 'medium' | 'high';
}

export function ProfitLossForecasting() {
  const [forecastPeriod, setForecastPeriod] = useState('12');
  const [selectedModel, setSelectedModel] = useState('ai');

  // Mock data for forecasting
  const forecastData: ForecastData[] = [
    { period: 'يناير', actual: 150000, conservative: 145000, optimistic: 180000, pessimistic: 120000, aiPrediction: 165000 },
    { period: 'فبراير', actual: 165000, conservative: 160000, optimistic: 195000, pessimistic: 135000, aiPrediction: 175000 },
    { period: 'مارس', actual: 142000, conservative: 148000, optimistic: 182000, pessimistic: 125000, aiPrediction: 158000 },
    { period: 'أبريل', conservative: 155000, optimistic: 188000, pessimistic: 130000, aiPrediction: 168000 },
    { period: 'مايو', conservative: 162000, optimistic: 195000, pessimistic: 138000, aiPrediction: 175000 },
    { period: 'يونيو', conservative: 158000, optimistic: 192000, pessimistic: 135000, aiPrediction: 172000 },
    { period: 'يوليو', conservative: 170000, optimistic: 205000, pessimistic: 145000, aiPrediction: 185000 },
    { period: 'أغسطس', conservative: 165000, optimistic: 200000, pessimistic: 140000, aiPrediction: 180000 },
    { period: 'سبتمبر', conservative: 175000, optimistic: 210000, pessimistic: 150000, aiPrediction: 190000 },
    { period: 'أكتوبر', conservative: 180000, optimistic: 218000, pessimistic: 155000, aiPrediction: 195000 },
    { period: 'نوفمبر', conservative: 172000, optimistic: 208000, pessimistic: 148000, aiPrediction: 188000 },
    { period: 'ديسمبر', conservative: 185000, optimistic: 225000, pessimistic: 160000, aiPrediction: 200000 }
  ];

  const scenarioAnalysis: ScenarioAnalysis[] = [
    {
      name: 'نمو اقتصادي قوي',
      probability: 35,
      expectedReturn: 22.5,
      variance: 8.2,
      risk: 'medium'
    },
    {
      name: 'استقرار اقتصادي',
      probability: 45,
      expectedReturn: 15.3,
      variance: 4.1,
      risk: 'low'
    },
    {
      name: 'تباطؤ اقتصادي',
      probability: 15,
      expectedReturn: 5.8,
      variance: 12.5,
      risk: 'high'
    },
    {
      name: 'ركود اقتصادي',
      probability: 5,
      expectedReturn: -8.2,
      variance: 18.3,
      risk: 'high'
    }
  ];

  const performanceMetrics = {
    accuracy: 87.5,
    confidence: 92.3,
    volatility: 15.8,
    sharpeRatio: 1.42
  };

  const keyDrivers = [
    { name: 'أداء السوق', impact: 35, trend: 'positive' },
    { name: 'السياسة النقدية', impact: 25, trend: 'neutral' },
    { name: 'التضخم', impact: 20, trend: 'negative' },
    { name: 'أسعار النفط', impact: 15, trend: 'positive' },
    { name: 'عوامل جيوسياسية', impact: 5, trend: 'negative' }
  ];

  const formatCurrency = (value: number) => {
    return `${(value / 1000).toFixed(0)}ك جنيه مصري`;
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'positive': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'negative': return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'neutral': return <Target className="h-4 w-4 text-gray-500" />;
      default: return null;
    }
  };

  const calculateTotalPrediction = () => {
    const futurePredictions = forecastData.filter(d => !d.actual);
    return futurePredictions.reduce((sum, d) => sum + d.aiPrediction, 0);
  };

  return (
    <div className="space-y-6">
      {/* Forecasting Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={forecastPeriod} onValueChange={setForecastPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="فترة التنبؤ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6">6 أشهر</SelectItem>
              <SelectItem value="12">12 شهر</SelectItem>
              <SelectItem value="24">24 شهر</SelectItem>
              <SelectItem value="36">36 شهر</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="نموذج التنبؤ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ai">الذكاء الاصطناعي</SelectItem>
              <SelectItem value="statistical">إحصائي</SelectItem>
              <SelectItem value="hybrid">مختلط</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button className="flex items-center gap-2">
          <Calculator className="h-4 w-4" />
          إعادة حساب التنبؤات
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">التنبؤ السنوي</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(calculateTotalPrediction())}
                </p>
              </div>
              <Brain className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">دقة النموذج</p>
                <p className="text-2xl font-bold text-green-600">
                  {performanceMetrics.accuracy}%
                </p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">مستوى الثقة</p>
                <p className="text-2xl font-bold text-purple-600">
                  {performanceMetrics.confidence}%
                </p>
              </div>
              <Zap className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">نسبة شارب</p>
                <p className="text-2xl font-bold text-orange-600">
                  {performanceMetrics.sharpeRatio}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="forecast" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="forecast">التنبؤات</TabsTrigger>
          <TabsTrigger value="scenarios">السيناريوهات</TabsTrigger>
          <TabsTrigger value="drivers">المحركات الرئيسية</TabsTrigger>
          <TabsTrigger value="validation">التحقق من الصحة</TabsTrigger>
        </TabsList>

        <TabsContent value="forecast" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-blue-500" />
                  تنبؤات الربح والخسارة
                </CardTitle>
                <CardDescription>
                  تنبؤات متعددة السيناريوهات باستخدام الذكاء الاصطناعي
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart data={forecastData}>
                    <XAxis dataKey="period" />
                    <YAxis tickFormatter={formatCurrency} />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    
                    {/* Actual data as bars */}
                    <Bar dataKey="actual" fill="#10b981" name="القيم الفعلية" />
                    
                    {/* Forecast scenarios as lines */}
                    <Line 
                      type="monotone" 
                      dataKey="aiPrediction" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      name="تنبؤ الذكاء الاصطناعي"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="optimistic" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="السيناريو المتفائل"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="pessimistic" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="السيناريو المتشائم"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="conservative" 
                      stroke="#f59e0b" 
                      strokeWidth={2}
                      strokeDasharray="3 3"
                      name="السيناريو المحافظ"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Forecast Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">السيناريو المتفائل</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 mb-2">
                  +25.8%
                </div>
                <p className="text-sm text-muted-foreground">
                  نمو قوي في جميع القطاعات مع تحسن الظروف الاقتصادية
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">التنبؤ الأساسي</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  +16.2%
                </div>
                <p className="text-sm text-muted-foreground">
                  نمو متوسط مع استقرار الأوضاع الاقتصادية العامة
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">السيناريو المتشائم</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600 mb-2">
                  +5.3%
                </div>
                <p className="text-sm text-muted-foreground">
                  نمو محدود مع تحديات اقتصادية وزيادة التقلبات
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scenarios" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-500" />
                تحليل السيناريوهات
              </CardTitle>
              <CardDescription>
                السيناريوهات الاقتصادية المحتملة وتأثيرها على العوائد
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scenarioAnalysis.map((scenario, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-lg">{scenario.name}</h4>
                      <Badge className={getRiskColor(scenario.risk)}>
                        {scenario.risk === 'low' ? 'مخاطر منخفضة' :
                         scenario.risk === 'medium' ? 'مخاطر متوسطة' : 'مخاطر عالية'}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">الاحتمالية</div>
                        <div className="text-xl font-bold text-blue-600">
                          {scenario.probability}%
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">العائد المتوقع</div>
                        <div className={`text-xl font-bold ${scenario.expectedReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {scenario.expectedReturn > 0 ? '+' : ''}{scenario.expectedReturn}%
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">التقلبات</div>
                        <div className="text-xl font-bold text-orange-600">
                          {scenario.variance}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart data={scenarioAnalysis}>
                    <XAxis dataKey="expectedReturn" name="العائد المتوقع" />
                    <YAxis dataKey="probability" name="الاحتمالية" />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Scatter data={scenarioAnalysis} fill="#3b82f6" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drivers" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                المحركات الرئيسية للأداء
              </CardTitle>
              <CardDescription>
                العوامل الاقتصادية والمالية المؤثرة على التنبؤات
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {keyDrivers.map((driver, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getTrendIcon(driver.trend)}
                      <div>
                        <h4 className="font-semibold">{driver.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          تأثير: {driver.impact}%
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-32">
                        <div className="flex justify-between text-xs mb-1">
                          <span>0%</span>
                          <span>{driver.impact}%</span>
                          <span>50%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(driver.impact / 50) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <Badge 
                        className={
                          driver.trend === 'positive' ? 'bg-green-100 text-green-800' :
                          driver.trend === 'negative' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }
                      >
                        {driver.trend === 'positive' ? 'إيجابي' :
                         driver.trend === 'negative' ? 'سلبي' : 'محايد'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="validation" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>أداء النموذج التاريخي</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>دقة التنبؤ</span>
                    <span className="font-bold text-green-600">{performanceMetrics.accuracy}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>مستوى الثقة</span>
                    <span className="font-bold text-blue-600">{performanceMetrics.confidence}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>التقلبات</span>
                    <span className="font-bold text-orange-600">{performanceMetrics.volatility}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>نسبة شارب</span>
                    <span className="font-bold text-purple-600">{performanceMetrics.sharpeRatio}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>توصيات التحسين</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 border rounded-lg bg-blue-50">
                  <h5 className="font-medium text-blue-800">تحسين البيانات</h5>
                  <p className="text-sm text-blue-700">إضافة مؤشرات اقتصادية جديدة لتحسين الدقة</p>
                </div>
                <div className="p-3 border rounded-lg bg-green-50">
                  <h5 className="font-medium text-green-800">التحديث المستمر</h5>
                  <p className="text-sm text-green-700">إعادة تدريب النموذج شهرياً بالبيانات الجديدة</p>
                </div>
                <div className="p-3 border rounded-lg bg-yellow-50">
                  <h5 className="font-medium text-yellow-800">التحقق المتقاطع</h5>
                  <p className="text-sm text-yellow-700">مقارنة النتائج مع نماذج بديلة</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}