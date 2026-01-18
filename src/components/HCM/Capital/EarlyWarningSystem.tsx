import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { 
  AlertTriangle, 
  Eye, 
  Bell, 
  Settings,
  TrendingDown,
  TrendingUp,
  Shield,
  Zap,
  Target,
  Activity,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

interface AIInsight {
  id: string;
  type: 'recommendation' | 'warning' | 'opportunity';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  priority: number;
}

interface Alert {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: 'liquidity' | 'market' | 'credit' | 'operational';
  timestamp: string;
  status: 'active' | 'acknowledged' | 'resolved';
  threshold: number;
  current: number;
}

interface EarlyWarningSystemProps {
  insights: AIInsight[];
}

export function EarlyWarningSystem({ insights }: EarlyWarningSystemProps) {
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null);

  // Mock data for alerts
  const alerts: Alert[] = [
    {
      id: '1',
      title: 'انخفاض السيولة النقدية',
      description: 'انخفضت السيولة النقدية دون الحد الأدنى المطلوب',
      severity: 'high',
      category: 'liquidity',
      timestamp: '2024-07-20 14:30',
      status: 'active',
      threshold: 500000,
      current: 420000
    },
    {
      id: '2',
      title: 'تقلبات عالية في السوق',
      description: 'زيادة غير طبيعية في تقلبات السوق قد تؤثر على المحفظة',
      severity: 'medium',
      category: 'market',
      timestamp: '2024-07-20 11:15',
      status: 'acknowledged',
      threshold: 20,
      current: 28
    },
    {
      id: '3',
      title: 'تركز مخاطر الائتمان',
      description: 'تركز عالي في التعرض الائتماني لطرف واحد',
      severity: 'critical',
      category: 'credit',
      timestamp: '2024-07-20 09:45',
      status: 'active',
      threshold: 15,
      current: 22
    },
    {
      id: '4',
      title: 'انحراف في الأداء التشغيلي',
      description: 'انحراف ملحوظ في مؤشرات الأداء التشغيلي',
      severity: 'low',
      category: 'operational',
      timestamp: '2024-07-19 16:20',
      status: 'resolved',
      threshold: 95,
      current: 88
    }
  ];

  const monitoringMetrics = [
    { name: 'مراقبة السيولة', enabled: true, threshold: 500000, current: 420000, status: 'warning' },
    { name: 'تتبع التقلبات', enabled: true, threshold: 20, current: 28, status: 'alert' },
    { name: 'مراقبة التركز', enabled: true, threshold: 15, current: 22, status: 'critical' },
    { name: 'أداء المحفظة', enabled: false, threshold: 10, current: 8, status: 'normal' },
    { name: 'مخاطر الطرف المقابل', enabled: true, threshold: 25, current: 18, status: 'normal' },
    { name: 'الامتثال التنظيمي', enabled: true, threshold: 100, current: 95, status: 'normal' }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <XCircle className="h-4 w-4" />;
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <Clock className="h-4 w-4" />;
      case 'low': return <CheckCircle className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'liquidity': return <Activity className="h-4 w-4" />;
      case 'market': return <TrendingUp className="h-4 w-4" />;
      case 'credit': return <Shield className="h-4 w-4" />;
      case 'operational': return <Settings className="h-4 w-4" />;
      default: return <Eye className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-100 text-red-800';
      case 'acknowledged': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'acknowledged': return 'مُقر به';
      case 'resolved': return 'محلول';
      default: return status;
    }
  };

  const getMonitoringStatus = (status: string) => {
    switch (status) {
      case 'critical': return { color: 'text-red-600', bg: 'bg-red-100', icon: <XCircle className="h-4 w-4" /> };
      case 'alert': return { color: 'text-orange-600', bg: 'bg-orange-100', icon: <AlertTriangle className="h-4 w-4" /> };
      case 'warning': return { color: 'text-yellow-600', bg: 'bg-yellow-100', icon: <Clock className="h-4 w-4" /> };
      case 'normal': return { color: 'text-green-600', bg: 'bg-green-100', icon: <CheckCircle className="h-4 w-4" /> };
      default: return { color: 'text-gray-600', bg: 'bg-gray-100', icon: <Eye className="h-4 w-4" /> };
    }
  };

  const handleAcknowledgeAlert = (alertId: string) => {
    // Here you would update the alert status
    console.log('Alert acknowledged:', alertId);
  };

  const handleResolveAlert = (alertId: string) => {
    // Here you would resolve the alert
    console.log('Alert resolved:', alertId);
  };

  const activeAlertsCount = alerts.filter(alert => alert.status === 'active').length;
  const criticalAlertsCount = alerts.filter(alert => alert.severity === 'critical' && alert.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Warning System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">تنبيهات نشطة</p>
                <p className="text-2xl font-bold text-red-600">
                  {activeAlertsCount}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">تنبيهات حرجة</p>
                <p className="text-2xl font-bold text-orange-600">
                  {criticalAlertsCount}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">مؤشرات المراقبة</p>
                <p className="text-2xl font-bold text-blue-600">
                  {monitoringMetrics.filter(m => m.enabled).length}
                </p>
              </div>
              <Eye className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">النظام</p>
                <p className="text-sm font-bold text-green-600">
                  {alertsEnabled ? 'مفعل' : 'معطل'}
                </p>
                <Switch 
                  checked={alertsEnabled}
                  onCheckedChange={setAlertsEnabled}
                  className="mt-1"
                />
              </div>
              <Shield className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-red-500" />
            التنبيهات النشطة
          </CardTitle>
          <CardDescription>
            قائمة بجميع التنبيهات النشطة التي تتطلب اهتماماً فورياً
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.filter(alert => alert.status === 'active').map((alert) => (
              <div 
                key={alert.id} 
                className={`p-4 border rounded-lg ${getSeverityColor(alert.severity)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center gap-2">
                      {getSeverityIcon(alert.severity)}
                      {getCategoryIcon(alert.category)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{alert.title}</h4>
                      <p className="text-sm mt-1 opacity-80">{alert.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs">
                        <span>وقت التنبيه: {alert.timestamp}</span>
                        <span>الحد المطلوب: {alert.threshold.toLocaleString()}</span>
                        <span>القيمة الحالية: {alert.current.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleAcknowledgeAlert(alert.id)}
                    >
                      إقرار
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => handleResolveAlert(alert.id)}
                    >
                      حل
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Insights Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            رؤى الذكاء الاصطناعي
          </CardTitle>
          <CardDescription>
            تحليلات وتوصيات ذكية لاكتشاف المخاطر المحتملة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {insights.map((insight) => (
              <div 
                key={insight.id}
                className={`p-4 rounded-lg border ${
                  insight.type === 'warning' ? 'bg-red-50 border-red-200' :
                  insight.type === 'recommendation' ? 'bg-blue-50 border-blue-200' :
                  'bg-green-50 border-green-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  {insight.type === 'warning' ? <AlertTriangle className="h-4 w-4 text-red-600" /> :
                   insight.type === 'recommendation' ? <Target className="h-4 w-4 text-blue-600" /> :
                   <TrendingUp className="h-4 w-4 text-green-600" />}
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

      {/* Monitoring Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-purple-500" />
            مؤشرات المراقبة
          </CardTitle>
          <CardDescription>
            المؤشرات الرئيسية التي يتم مراقبتها لاكتشاف المخاطر المبكر
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {monitoringMetrics.map((metric, index) => {
              const statusInfo = getMonitoringStatus(metric.status);
              return (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${statusInfo.bg}`}>
                      {statusInfo.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold">{metric.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        الحد المطلوب: {metric.threshold.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold">{metric.current.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">القيمة الحالية</div>
                    </div>
                    
                    <div className="w-32">
                      <Progress 
                        value={(metric.current / metric.threshold) * 100} 
                        className="h-2"
                      />
                    </div>
                    
                    <Switch 
                      checked={metric.enabled}
                      disabled={!alertsEnabled}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Alert History */}
      <Card>
        <CardHeader>
          <CardTitle>سجل التنبيهات</CardTitle>
          <CardDescription>
            جميع التنبيهات السابقة وحالتها الحالية
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getSeverityIcon(alert.severity)}
                  <div>
                    <h4 className="font-medium">{alert.title}</h4>
                    <p className="text-sm text-muted-foreground">{alert.timestamp}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Badge className={getSeverityColor(alert.severity)}>
                    {alert.severity === 'critical' ? 'حرج' :
                     alert.severity === 'high' ? 'عالي' :
                     alert.severity === 'medium' ? 'متوسط' : 'منخفض'}
                  </Badge>
                  <Badge className={getStatusColor(alert.status)}>
                    {getStatusText(alert.status)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}