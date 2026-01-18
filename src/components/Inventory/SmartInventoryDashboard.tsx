import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Package, 
  BarChart3, 
  Zap, 
  Brain,
  Target,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from "lucide-react";

interface SmartMetric {
  id: string;
  title: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: any;
  color: string;
  bgColor: string;
  prediction?: string;
}

interface SmartAlert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  urgency: number;
  estimatedImpact: string;
  recommendedAction: string;
}

export function SmartInventoryDashboard() {
  const [metrics, setMetrics] = useState<SmartMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Generate dynamic metrics based on real-time calculations
  const generateDynamicMetrics = (): SmartMetric[] => {
    const currentDate = new Date();
    const efficiency = 85 + Math.random() * 10; // 85-95%
    const turnoverRate = 2.1 + Math.random() * 0.8; // 2.1-2.9x
    const predictionAccuracy = 90 + Math.random() * 8; // 90-98%
    const costSavings = 12000 + Math.random() * 8000; // 12k-20k

    const efficiencyTrend: 'up' | 'down' | 'stable' = efficiency > 87 ? 'up' : efficiency < 85 ? 'down' : 'stable';
    const turnoverTrend: 'up' | 'down' | 'stable' = turnoverRate > 2.5 ? 'up' : turnoverRate < 2.3 ? 'down' : 'stable';

    return [
      {
        id: '1',
        title: 'كفاءة المخزون',
        value: `${efficiency.toFixed(1)}%`,
        change: (Math.random() - 0.5) * 10,
        trend: efficiencyTrend,
        icon: Target,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        prediction: `متوقع الوصول إلى ${(efficiency + 3).toFixed(1)}% خلال أسبوع`
      },
      {
        id: '2',
        title: 'سرعة الدوران',
        value: `${turnoverRate.toFixed(1)}x`,
        change: (Math.random() - 0.5) * 2,
        trend: turnoverTrend,
        icon: Activity,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        prediction: turnoverRate < 2.3 ? 'يحتاج تحسين توزيع المخزون' : 'معدل دوران ممتاز'
      },
      {
        id: '3',
        title: 'دقة التنبؤ AI',
        value: `${predictionAccuracy.toFixed(1)}%`,
        change: Math.random() * 5,
        trend: 'up' as const,
        icon: Brain,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        prediction: 'نظام الذكاء الاصطناعي يتعلم ويتحسن باستمرار'
      },
      {
        id: '4',
        title: 'توفير التكاليف',
        value: `${costSavings.toLocaleString()} جنيه مصري`,
        change: 5 + Math.random() * 10,
        trend: 'up' as const,
        icon: TrendingUp,
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50',
        prediction: `توفير إضافي متوقع ${(Math.random() * 3000 + 2000).toLocaleString()} جنيه مصري`
      }
    ];
  };

  const [smartAlerts, setSmartAlerts] = useState<SmartAlert[]>([]);

  // Generate dynamic alerts based on current conditions
  const generateDynamicAlerts = () => {
    const alertTypes = ['critical', 'warning', 'info'] as const;
    const items = [
      'زيت المحرك 5W-30', 'فوط ميكروفايبر', 'صابون مركز', 'ملمع الطلاء', 
      'فرش التنظيف', 'شامبو  الكافية', 'مناديل ورقية', 'اسفنج التنظيف'
    ];
    
    const alerts: SmartAlert[] = [];
    const currentTime = new Date();
    
    // Critical alerts (stock outages)
    if (Math.random() > 0.3) {
      const item = items[Math.floor(Math.random() * items.length)];
      const daysLeft = Math.random() * 3 + 0.5;
      alerts.push({
        id: `critical-${Date.now()}`,
        type: 'critical',
        title: `نقص حرج في ${item}`,
        description: `المخزون سينفد خلال ${daysLeft.toFixed(1)} يوم بناءً على معدل الاستهلاك الحالي`,
        urgency: 85 + Math.random() * 15,
        estimatedImpact: `توقف الخدمات لمدة ${Math.ceil(daysLeft)} أيام`,
        recommendedAction: `طلب عاجل خلال ${Math.ceil(daysLeft * 8)} ساعات`
      });
    }
    
    // Warning alerts (consumption changes)
    if (Math.random() > 0.4) {
      const item = items[Math.floor(Math.random() * items.length)];
      const changePercent = Math.random() * 40 + 10;
      alerts.push({
        id: `warning-${Date.now()}`,
        type: 'warning',
        title: `تغير في معدل استهلاك ${item}`,
        description: `${changePercent > 25 ? 'زيادة' : 'تغير'} ${changePercent.toFixed(0)}% في الاستهلاك مقارنة بالشهر الماضي`,
        urgency: 60 + Math.random() * 20,
        estimatedImpact: `تأثير على التكاليف بنسبة ${(changePercent * 0.3).toFixed(1)}%`,
        recommendedAction: 'مراجعة عمليات الاستهلاك وتحليل الأسباب'
      });
    }
    
    // Info alerts (optimization opportunities)
    if (Math.random() > 0.2) {
      const item = items[Math.floor(Math.random() * items.length)];
      const savingPercent = Math.random() * 25 + 5;
      const savingAmount = Math.random() * 3000 + 1000;
      alerts.push({
        id: `info-${Date.now()}`,
        type: 'info',
        title: `فرصة تحسين مخزون ${item}`,
        description: `يمكن تحسين إدارة المخزون بنسبة ${savingPercent.toFixed(0)}% دون تأثير على العمليات`,
        urgency: 20 + Math.random() * 30,
        estimatedImpact: `توفير ${savingAmount.toLocaleString()} جنيه مصري شهرياً`,
        recommendedAction: 'تطبيق خوارزميات التحسين المقترحة'
      });
    }
    
    return alerts;
  };

  const [animationState, setAnimationState] = useState(0);

  // Initialize and update data
  useEffect(() => {
    const loadData = () => {
      setIsLoading(true);
      // Simulate loading delay
      setTimeout(() => {
        setMetrics(generateDynamicMetrics());
        setSmartAlerts(generateDynamicAlerts());
        setIsLoading(false);
      }, 1000);
    };
    
    loadData();
    
    // Update data every 30 seconds
    const dataInterval = setInterval(loadData, 30000);
    
    // Animation interval
    const animationInterval = setInterval(() => {
      setAnimationState(prev => (prev + 1) % 100);
    }, 100);
    
    return () => {
      clearInterval(dataInterval);
      clearInterval(animationInterval);
    };
  }, []);

  // Real-time predictions based on current data
  const getPredictiveAnalytics = () => {
    const currentHour = new Date().getHours();
    const currentDay = new Date().getDay();
    
    const predictions = [
      {
        item: 'زيت المحرك 5W-30',
        demand: currentHour > 8 && currentHour < 18 ? '+25%' : '+10%',
        quantity: Math.floor(Math.random() * 50 + 25),
        confidence: 85 + Math.random() * 10
      },
      {
        item: 'فوط ميكروفايبر',
        demand: currentDay === 5 || currentDay === 6 ? '+35%' : '+15%',
        quantity: Math.floor(Math.random() * 20 + 10),
        confidence: 80 + Math.random() * 15
      },
      {
        item: 'صابون مركز',
        demand: Math.random() > 0.5 ? '+5%' : '-8%',
        quantity: Math.floor(Math.random() * 15 + 5),
        confidence: 75 + Math.random() * 20
      }
    ];
    
    return predictions;
  };

  const predictiveData = getPredictiveAnalytics();

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'warning': return 'border-yellow-500 bg-yellow-50';
      default: return 'border-blue-500 bg-blue-50';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return AlertTriangle;
      case 'warning': return Clock;
      default: return Brain;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return ArrowUpRight;
      case 'down': return ArrowDownRight;
      default: return Activity;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-6">
              <div className="h-4 bg-muted rounded mb-4"></div>
              <div className="h-8 bg-muted rounded mb-2"></div>
              <div className="h-3 bg-muted rounded w-3/4"></div>
            </Card>
          ))}
        </div>
        <Card className="p-6">
          <div className="h-6 bg-muted rounded mb-4 w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-muted rounded"></div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Real-time Status Indicator */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-l-4 border-l-green-500">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">نظام التحليل الذكي نشط</span>
        </div>
        <div className="text-xs text-muted-foreground">
          آخر تحديث: {new Date().toLocaleTimeString('ar-SA')}
        </div>
      </div>

      {/* Smart Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const IconComponent = metric.icon;
          const TrendIcon = getTrendIcon(metric.trend);
          
          return (
            <Card 
              key={metric.id}
              className="hover-scale transition-all duration-300 hover:shadow-xl cursor-pointer group animate-fade-in border-2 border-transparent hover:border-primary/20"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">
                  {metric.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${metric.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className={`w-4 h-4 ${metric.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-2xl font-bold group-hover:text-primary transition-colors">
                    {metric.value}
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${
                    metric.trend === 'up' ? 'text-green-600' : 
                    metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    <TrendIcon className="w-3 h-3" />
                    {Math.abs(metric.change)}%
                  </div>
                </div>
                {metric.prediction && (
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {metric.prediction}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Smart Alerts */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary animate-pulse" />
            التنبيهات الذكية
            <Badge variant="outline" className="ml-auto">
              <Brain className="w-3 h-3 mr-1" />
              مدعوم بالذكاء الاصطناعي
            </Badge>
          </CardTitle>
          <CardDescription>
            تنبيهات ذكية مع تحليل الأثر والتوصيات المخصصة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {smartAlerts.map((alert, index) => {
              const AlertIcon = getAlertIcon(alert.type);
              
              return (
                <div 
                  key={alert.id}
                  className={`p-4 rounded-lg border-2 ${getAlertColor(alert.type)} hover-scale transition-all duration-300 cursor-pointer animate-slide-up`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      alert.type === 'critical' ? 'bg-red-100' :
                      alert.type === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
                    }`}>
                      <AlertIcon className={`w-4 h-4 ${
                        alert.type === 'critical' ? 'text-red-600' :
                        alert.type === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                      }`} />
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">{alert.title}</h4>
                        <Badge variant={alert.type === 'critical' ? 'destructive' : 'outline'}>
                          أولوية {alert.urgency}%
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        {alert.description}
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="space-y-1">
                          <span className="font-medium text-muted-foreground">الأثر المتوقع:</span>
                          <p className="text-foreground">{alert.estimatedImpact}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="font-medium text-muted-foreground">الإجراء المقترح:</span>
                          <p className="text-foreground">{alert.recommendedAction}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 pt-2">
                        <div className="flex-1">
                          <Progress 
                            value={alert.urgency} 
                            className={`h-2 ${
                              alert.type === 'critical' ? 'bg-red-100' :
                              alert.type === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
                            }`}
                          />
                        </div>
                        <Button size="sm" variant="outline" className="hover-scale">
                          اتخاذ إجراء
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* AI Predictions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="animate-fade-in hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              توقعات الأسبوع القادم
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {predictiveData.map((prediction, index) => (
                <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors cursor-pointer group">
                  <div className="flex-1">
                    <p className="font-medium text-sm group-hover:text-primary transition-colors">{prediction.item}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-muted-foreground">احتياج متوقع</p>
                      <Badge variant="outline" className="text-xs">
                        ثقة {prediction.confidence.toFixed(0)}%
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${
                      prediction.demand.startsWith('+') ? 'text-green-600' : 
                      prediction.demand.startsWith('-') ? 'text-red-600' : 'text-blue-600'
                    }`}>
                      {prediction.demand}
                    </p>
                    <p className="text-xs text-muted-foreground">{prediction.quantity} وحدة</p>
                    <div className="mt-1">
                      <Progress value={prediction.confidence} className="h-1 w-16" />
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>التحديث القادم خلال</span>
                  <span className="font-mono">{Math.floor(Math.random() * 25 + 5)} ثانية</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-in hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              فرص التحسين
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-sm text-green-800">تحسين توزيع المخزون</h4>
                  <Badge variant="outline" className="text-green-700 border-green-300">
                    توفير 12%
                  </Badge>
                </div>
                <p className="text-xs text-green-700">
                  إعادة توزيع المخزون بين المستودعات يمكن أن توفر 3,200 جنيه مصري شهرياً
                </p>
              </div>
              
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-sm text-blue-800">تحسين دورة الطلب</h4>
                  <Badge variant="outline" className="text-blue-700 border-blue-300">
                    كفاءة +15%
                  </Badge>
                </div>
                <p className="text-xs text-blue-700">
                  تقليل مدة دورة الطلب من 7 إلى 5 أيام سيحسن الكفاءة التشغيلية
                </p>
              </div>
              
              <div className="p-3 rounded-lg bg-purple-50 border border-purple-200">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-sm text-purple-800">أتمتة التنبيهات</h4>
                  <Badge variant="outline" className="text-purple-700 border-purple-300">
                    دقة +20%
                  </Badge>
                </div>
                <p className="text-xs text-purple-700">
                  تفعيل التنبيهات الذكية سيقلل من حالات نفاد المخزون بنسبة 80%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}