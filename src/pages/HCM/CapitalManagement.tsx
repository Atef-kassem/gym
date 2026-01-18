import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Target, 
  PieChart, 
  BarChart3, 
  LineChart,
  Brain,
  Shield,
  Calculator,
  Eye,
  Plus,
  RefreshCw
} from 'lucide-react';
import { AICapitalDashboard } from '@/components/HCM/Capital/AICapitalDashboard';
import { InvestmentAnalysis } from '@/components/HCM/Capital/InvestmentAnalysis';
import { RiskManagement } from '@/components/HCM/Capital/RiskManagement';
import { ProfitLossForecasting } from '@/components/HCM/Capital/ProfitLossForecasting';
import { FinancialReporting } from '@/components/HCM/Capital/FinancialReporting';
import { EarlyWarningSystem } from '@/components/HCM/Capital/EarlyWarningSystem';

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

interface AIInsight {
  id: string;
  type: 'recommendation' | 'warning' | 'opportunity';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  priority: number;
}

export default function CapitalManagement() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock data - في التطبيق الحقيقي سيأتي من API
  const capitalMetrics: CapitalMetrics = {
    totalAssets: 2500000,
    totalLiabilities: 1200000,
    netWorth: 1300000,
    currentRatio: 2.1,
    debtToEquity: 0.92,
    roi: 15.7,
    riskScore: 32,
    liquidityRatio: 1.8
  };

  const aiInsights: AIInsight[] = [
    {
      id: '1',
      type: 'recommendation',
      title: 'تحسين السيولة النقدية',
      description: 'يُنصح بزيادة السيولة النقدية بنسبة 15% لتحسين المرونة المالية',
      impact: 'medium',
      confidence: 87,
      priority: 2
    },
    {
      id: '2',
      type: 'warning',
      title: 'تركز مخاطر الاستثمار',
      description: 'هناك تركز عالي في قطاع واحد قد يزيد المخاطر',
      impact: 'high',
      confidence: 92,
      priority: 1
    },
    {
      id: '3',
      type: 'opportunity',
      title: 'فرصة استثمارية واعدة',
      description: 'تم رصد فرصة استثمارية جديدة في القطاع التقني',
      impact: 'high',
      confidence: 78,
      priority: 1
    }
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // محاكاة تحديث البيانات
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'recommendation': return <Target className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'opportunity': return <TrendingUp className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'recommendation': return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'warning': return 'bg-red-500/10 text-red-600 border-red-200';
      case 'opportunity': return 'bg-green-500/10 text-green-600 border-green-200';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="p-6 rounded-xl border shadow-lg bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="h-8 w-8 text-primary animate-pulse" />
              <div>
                <h1 className="text-3xl font-bold">إدارة ج.م المال الذكية</h1>
                <p className="text-muted-foreground mt-2">
                  نظام ذكي متطور لإدارة ج.م المال مدعوم بالذكاء الاصطناعي للتحليل والتنبؤ واتخاذ القرارات المالية
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                تحديث البيانات
              </Button>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                إضافة استثمار جديد
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">إجمالي الأصول</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {capitalMetrics.totalAssets.toLocaleString()} جنيه مصري
              </div>
              <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
                <TrendingUp className="h-3 w-3" />
                +8.2% من الشهر السابق
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">إجمالي الخصوم</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {capitalMetrics.totalLiabilities.toLocaleString()} جنيه مصري
              </div>
              <div className="flex items-center gap-1 text-sm text-red-600 mt-1">
                <TrendingDown className="h-3 w-3" />
                -2.1% من الشهر السابق
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">صافي القيمة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {capitalMetrics.netWorth.toLocaleString()} جنيه مصري
              </div>
              <div className="flex items-center gap-1 text-sm text-blue-600 mt-1">
                <TrendingUp className="h-3 w-3" />
                +12.5% من الشهر السابق
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">عائد الاستثمار</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {capitalMetrics.roi}%
              </div>
              <div className="flex items-center gap-1 text-sm text-purple-600 mt-1">
                <TrendingUp className="h-3 w-3" />
                +1.8% من الشهر السابق
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              رؤى الذكاء الاصطناعي
            </CardTitle>
            <CardDescription>
              تحليلات وتوصيات ذكية مدعومة بالذكاء الاصطناعي
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {aiInsights.map((insight) => (
                <div 
                  key={insight.id}
                  className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}
                >
                  <div className="flex items-start gap-3">
                    {getInsightIcon(insight.type)}
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{insight.title}</h4>
                      <p className="text-xs mt-1 opacity-80">{insight.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          ثقة {insight.confidence}%
                        </Badge>
                        <Badge 
                          variant={insight.impact === 'high' ? 'destructive' : insight.impact === 'medium' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {insight.impact === 'high' ? 'تأثير عالي' : insight.impact === 'medium' ? 'تأثير متوسط' : 'تأثير منخفض'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              لوحة التحكم
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <LineChart className="h-4 w-4" />
              تحليل الاستثمارات
            </TabsTrigger>
            <TabsTrigger value="risk" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              إدارة المخاطر
            </TabsTrigger>
            <TabsTrigger value="forecasting" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              التنبؤ المالي
            </TabsTrigger>
            <TabsTrigger value="reporting" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              التقارير المالية
            </TabsTrigger>
            <TabsTrigger value="warnings" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              الإنذار المبكر
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            <AICapitalDashboard metrics={capitalMetrics} />
          </TabsContent>

          <TabsContent value="analysis" className="mt-6">
            <InvestmentAnalysis />
          </TabsContent>

          <TabsContent value="risk" className="mt-6">
            <RiskManagement riskScore={capitalMetrics.riskScore} />
          </TabsContent>

          <TabsContent value="forecasting" className="mt-6">
            <ProfitLossForecasting />
          </TabsContent>

          <TabsContent value="reporting" className="mt-6">
            <FinancialReporting />
          </TabsContent>

          <TabsContent value="warnings" className="mt-6">
            <EarlyWarningSystem insights={aiInsights} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}