import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  AlertTriangle, 
  TrendingDown, 
  Target,
  Activity,
  Gauge,
  Zap,
  Eye,
  CheckCircle,
  XCircle
} from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar
} from 'recharts';

interface RiskMetric {
  category: string;
  current: number;
  threshold: number;
  status: 'safe' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
}

interface RiskScenario {
  id: string;
  name: string;
  probability: number;
  impact: number;
  mitigation: string;
  status: 'active' | 'monitored' | 'resolved';
}

interface RiskManagementProps {
  riskScore: number;
}

export function RiskManagement({ riskScore }: RiskManagementProps) {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

  // Mock data
  const riskMetrics: RiskMetric[] = [
    {
      category: 'مخاطر السوق',
      current: 35,
      threshold: 40,
      status: 'safe',
      trend: 'down'
    },
    {
      category: 'مخاطر السيولة',
      current: 25,
      threshold: 30,
      status: 'safe',
      trend: 'stable'
    },
    {
      category: 'مخاطر الائتمان',
      current: 45,
      threshold: 50,
      status: 'warning',
      trend: 'up'
    },
    {
      category: 'مخاطر التشغيل',
      current: 30,
      threshold: 35,
      status: 'safe',
      trend: 'down'
    },
    {
      category: 'مخاطر الامتثال',
      current: 20,
      threshold: 25,
      status: 'safe',
      trend: 'stable'
    },
    {
      category: 'مخاطر الاستراتيجية',
      current: 40,
      threshold: 45,
      status: 'warning',
      trend: 'up'
    }
  ];

  const riskScenarios: RiskScenario[] = [
    {
      id: '1',
      name: 'انهيار السوق المالي',
      probability: 15,
      impact: 85,
      mitigation: 'تنويع المحفظة وزيادة السيولة',
      status: 'monitored'
    },
    {
      id: '2',
      name: 'تغييرات تنظيمية',
      probability: 30,
      impact: 60,
      mitigation: 'مراقبة التشريعات والامتثال المستمر',
      status: 'active'
    },
    {
      id: '3',
      name: 'عدم استقرار العملة',
      probability: 25,
      impact: 70,
      mitigation: 'التحوط من مخاطر العملة',
      status: 'monitored'
    },
    {
      id: '4',
      name: 'مخاطر الطرف المقابل',
      probability: 20,
      impact: 50,
      mitigation: 'تقييم دوري للجهات المقابلة',
      status: 'active'
    }
  ];

  const historicalRisk = [
    { month: 'يناير', risk: 28, volatility: 15 },
    { month: 'فبراير', risk: 32, volatility: 18 },
    { month: 'مارس', risk: 35, volatility: 22 },
    { month: 'أبريل', risk: 30, volatility: 16 },
    { month: 'مايو', risk: 32, volatility: 19 },
    { month: 'يونيو', risk: 35, volatility: 20 },
  ];

  const stressTestResults = [
    { scenario: 'الركود الاقتصادي', impact: -25, probability: 20 },
    { scenario: 'أزمة مصرفية', impact: -35, probability: 10 },
    { scenario: 'تضخم مرتفع', impact: -15, probability: 30 },
    { scenario: 'انهيار أسعار النفط', impact: -40, probability: 15 },
    { scenario: 'أزمة جيوسياسية', impact: -30, probability: 25 },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'safe': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'critical': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Shield className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingDown className="h-3 w-3 text-red-500 rotate-180" />;
      case 'down': return <TrendingDown className="h-3 w-3 text-green-500" />;
      case 'stable': return <Activity className="h-3 w-3 text-blue-500" />;
      default: return null;
    }
  };

  const getRiskLevel = (score: number) => {
    if (score <= 30) return { level: 'منخفض', color: 'text-green-600', bg: 'bg-green-100' };
    if (score <= 60) return { level: 'متوسط', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { level: 'عالي', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const riskInfo = getRiskLevel(riskScore);

  const radarData = riskMetrics.map(metric => ({
    category: metric.category.replace('مخاطر ', ''),
    current: metric.current,
    threshold: metric.threshold
  }));

  return (
    <div className="space-y-6">
      {/* Risk Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">مستوى المخاطر الإجمالي</p>
                <p className={`text-2xl font-bold ${riskInfo.color}`}>
                  {riskScore}%
                </p>
                <Badge className={`mt-1 ${riskInfo.bg} ${riskInfo.color}`}>
                  {riskInfo.level}
                </Badge>
              </div>
              <Gauge className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">السيناريوهات النشطة</p>
                <p className="text-2xl font-bold text-green-600">
                  {riskScenarios.filter(s => s.status === 'active').length}
                </p>
              </div>
              <Eye className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">تحذيرات المخاطر</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {riskMetrics.filter(m => m.status === 'warning').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">معدل التقلبات</p>
                <p className="text-2xl font-bold text-purple-600">18.5%</p>
              </div>
              <Activity className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="scenarios">السيناريوهات</TabsTrigger>
          <TabsTrigger value="stress">اختبارات الضغط</TabsTrigger>
          <TabsTrigger value="mitigation">التخفيف</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Risk Radar Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  خريطة المخاطر
                </CardTitle>
                <CardDescription>
                  توزيع المخاطر حسب الفئات المختلفة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="category" />
                    <PolarRadiusAxis domain={[0, 100]} />
                    <Radar
                      name="المستوى الحالي"
                      dataKey="current"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.3}
                    />
                    <Radar
                      name="الحد الأقصى"
                      dataKey="threshold"
                      stroke="#ef4444"
                      fill="transparent"
                      strokeDasharray="5 5"
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Historical Risk Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-500" />
                  تطور المخاطر التاريخي
                </CardTitle>
                <CardDescription>
                  تتبع مستوى المخاطر والتقلبات عبر الوقت
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={historicalRisk}>
                    <defs>
                      <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="risk"
                      stroke="#ef4444"
                      fillOpacity={1}
                      fill="url(#colorRisk)"
                      name="مستوى المخاطر"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Risk Metrics Details */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>تفاصيل مؤشرات المخاطر</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {riskMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(metric.status)}
                      <div>
                        <h4 className="font-semibold">{metric.category}</h4>
                        <p className="text-sm text-muted-foreground">
                          الحد الأقصى: {metric.threshold}%
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-32">
                        <Progress 
                          value={metric.current} 
                          className="h-2"
                        />
                        <div className="flex justify-between text-xs mt-1">
                          <span>0%</span>
                          <span>{metric.current}%</span>
                          <span>100%</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        {getTrendIcon(metric.trend)}
                        <Badge className={getStatusColor(metric.status)}>
                          {metric.status === 'safe' ? 'آمن' : 
                           metric.status === 'warning' ? 'تحذير' : 'حرج'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scenarios" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>سيناريوهات المخاطر</CardTitle>
              <CardDescription>
                تحليل السيناريوهات المحتملة وتأثيرها على المحفظة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {riskScenarios.map((scenario) => (
                  <div 
                    key={scenario.id} 
                    className="border rounded-lg p-4 cursor-pointer hover:bg-muted/50"
                    onClick={() => setSelectedScenario(
                      selectedScenario === scenario.id ? null : scenario.id
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge 
                          className={
                            scenario.status === 'active' ? 'bg-red-100 text-red-800' :
                            scenario.status === 'monitored' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }
                        >
                          {scenario.status === 'active' ? 'نشط' :
                           scenario.status === 'monitored' ? 'مراقب' : 'محلول'}
                        </Badge>
                        <h4 className="font-semibold">{scenario.name}</h4>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-sm font-medium">الاحتمالية</div>
                          <div className="text-lg font-bold text-blue-600">
                            {scenario.probability}%
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium">التأثير</div>
                          <div className="text-lg font-bold text-red-600">
                            {scenario.impact}%
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {selectedScenario === scenario.id && (
                      <div className="mt-4 pt-4 border-t">
                        <h5 className="font-medium mb-2">استراتيجية التخفيف:</h5>
                        <p className="text-sm text-muted-foreground">
                          {scenario.mitigation}
                        </p>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" variant="outline">
                            تحديث الاستراتيجية
                          </Button>
                          <Button size="sm" variant="outline">
                            تشغيل محاكاة
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stress" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-orange-500" />
                اختبارات الضغط
              </CardTitle>
              <CardDescription>
                تقييم أداء المحفظة في ظل ظروف السوق القاسية
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={stressTestResults} layout="horizontal">
                  <XAxis type="number" domain={[-50, 0]} />
                  <YAxis dataKey="scenario" type="category" width={150} />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Bar dataKey="impact" fill="#ef4444" name="التأثير %" />
                </BarChart>
              </ResponsiveContainer>
              
              <div className="mt-6">
                <Button className="w-full">
                  <Zap className="h-4 w-4 mr-2" />
                  تشغيل اختبار ضغط جديد
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mitigation" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>استراتيجيات التخفيف الفعالة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 border rounded-lg bg-green-50">
                  <h4 className="font-semibold text-green-800 mb-2">تنويع المحفظة</h4>
                  <p className="text-sm text-green-700">
                    توزيع الاستثمارات عبر قطاعات ومناطق جغرافية متنوعة
                  </p>
                  <Progress value={85} className="mt-2" />
                </div>
                
                <div className="p-3 border rounded-lg bg-blue-50">
                  <h4 className="font-semibold text-blue-800 mb-2">إدارة السيولة</h4>
                  <p className="text-sm text-blue-700">
                    الاحتفاظ بمستوى كافٍ من السيولة لمواجهة الظروف الطارئة
                  </p>
                  <Progress value={70} className="mt-2" />
                </div>
                
                <div className="p-3 border rounded-lg bg-purple-50">
                  <h4 className="font-semibold text-purple-800 mb-2">التحوط</h4>
                  <p className="text-sm text-purple-700">
                    استخدام أدوات التحوط لحماية المحفظة من التقلبات
                  </p>
                  <Progress value={60} className="mt-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>خطة إدارة المخاطر</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">مراجعة دورية للمخاطر</span>
                    <Badge className="bg-green-100 text-green-800">مكتمل</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">تحديث نماذج التقييم</span>
                    <Badge className="bg-yellow-100 text-yellow-800">قيد التنفيذ</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">تدريب فريق المخاطر</span>
                    <Badge className="bg-blue-100 text-blue-800">مجدول</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">مراجعة حدود التعرض</span>
                    <Badge className="bg-red-100 text-red-800">متأخر</Badge>
                  </div>
                </div>
                
                <Button className="w-full mt-4">
                  <Shield className="h-4 w-4 mr-2" />
                  تحديث خطة إدارة المخاطر
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}