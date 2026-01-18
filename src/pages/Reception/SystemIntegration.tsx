import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings, 
  Zap, 
  Database, 
  Link, 
  CheckCircle, 
  AlertTriangle,
  Users,
  ShoppingCart,
  BarChart3,
  MessageSquare,
  Smartphone,
  CreditCard,
  Cloud,
  Monitor,
  RefreshCw,
  Play,
  Pause,
  Eye,
  Edit,
  Trash2,
  Plus
} from "lucide-react";

const integrationModules = [
  {
    id: "pos",
    name: "نظام نقاط البيع",
    description: "التكامل مع نظام POS لإدارة المدفوعات والإيصالات",
    icon: ShoppingCart,
    status: "connected",
    lastSync: "2024-01-15T10:30:00",
    features: ["إنشاء إيصالات", "معالجة مدفوعات", "إدارة المخزون"],
    health: 98
  },
  {
    id: "crm",
    name: "إدارة علاقات العملاء",
    description: "ربط بيانات العملاء والمركبات",
    icon: Users,
    status: "connected",
    lastSync: "2024-01-15T10:25:00",
    features: ["ملفات العملاء", "تاريخ الخدمات", "البرامج الولاء"],
    health: 95
  },
  {
    id: "operations",
    name: "إدارة العمليات",
    description: "تنسيق مسارات الخدمة ومراقبة الأداء",
    icon: Monitor,
    status: "connected",
    lastSync: "2024-01-15T10:28:00",
    features: ["تتبع المسارات", "مراقبة الجودة", "إدارة الموارد"],
    health: 92
  },
  {
    id: "notifications",
    name: "نظام الإشعارات",
    description: "إرسال الرسائل والتنبيهات للعملاء",
    icon: MessageSquare,
    status: "connected",
    lastSync: "2024-01-15T10:32:00",
    features: ["SMS", "واتساب", "بريد إلكتروني"],
    health: 100
  },
  {
    id: "analytics",
    name: "نظام التحليلات",
    description: "تحليل البيانات وإنتاج التقارير",
    icon: BarChart3,
    status: "disconnected",
    lastSync: null,
    features: ["تقارير الأداء", "تحليل الاتجاهات", "مؤشرات KPI"],
    health: 0
  },
  {
    id: "payment",
    name: "بوابات الدفع",
    description: "معالجة المدفوعات الإلكترونية",
    icon: CreditCard,
    status: "maintenance",
    lastSync: "2024-01-15T09:45:00",
    features: ["فيزا", "ماستركارد", "مدى"],
    health: 75
  }
];

const syncRules = [
  {
    id: "customer_data",
    name: "بيانات العملاء",
    description: "مزامنة ملفات العملاء بين الأنظمة",
    enabled: true,
    frequency: "real-time",
    lastExecution: "2024-01-15T10:30:00",
    status: "success"
  },
  {
    id: "service_orders",
    name: "أوامر الخدمة",
    description: "نقل أوامر العمل لأنظمة التشغيل",
    enabled: true,
    frequency: "immediate",
    lastExecution: "2024-01-15T10:28:00",
    status: "success"
  },
  {
    id: "payment_transactions",
    name: "المعاملات المالية",
    description: "مزامنة بيانات المدفوعات",
    enabled: true,
    frequency: "hourly",
    lastExecution: "2024-01-15T10:00:00",
    status: "pending"
  },
  {
    id: "customer_feedback",
    name: "تقييمات العملاء",
    description: "نقل التقييمات والملاحظات",
    enabled: false,
    frequency: "daily",
    lastExecution: "2024-01-14T23:00:00",
    status: "disabled"
  }
];

const apiEndpoints = [
  {
    id: "customer_api",
    name: "Customer Management API",
    url: "/api/v1/customers",
    method: "GET/POST",
    status: "active",
    responseTime: "125ms",
    requests: 1250
  },
  {
    id: "orders_api",
    name: "Work Orders API",
    url: "/api/v1/work-orders",
    method: "GET/POST/PUT",
    status: "active",
    responseTime: "98ms",
    requests: 850
  },
  {
    id: "notifications_api",
    name: "Notifications API",
    url: "/api/v1/notifications",
    method: "POST",
    status: "active",
    responseTime: "76ms",
    requests: 420
  }
];

export default function SystemIntegration() {
  const [integrations, setIntegrations] = useState(integrationModules);
  const [rules, setRules] = useState(syncRules);
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();

  const handleToggleIntegration = (moduleId: string) => {
    setIntegrations(prev =>
      prev.map(integration =>
        integration.id === moduleId
          ? {
              ...integration,
              status: integration.status === "connected" ? "disconnected" : "connected"
            }
          : integration
      )
    );

    toast({
      title: "تم تحديث حالة التكامل",
      description: "تم تغيير حالة التكامل بنجاح"
    });
  };

  const handleToggleRule = (ruleId: string) => {
    setRules(prev =>
      prev.map(rule =>
        rule.id === ruleId
          ? { ...rule, enabled: !rule.enabled }
          : rule
      )
    );

    toast({
      title: "تم تحديث قاعدة المزامنة",
      description: "تم تغيير إعدادات المزامنة بنجاح"
    });
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      connected: { label: "متصل", color: "bg-green-100 text-green-800", icon: CheckCircle },
      disconnected: { label: "غير متصل", color: "bg-red-100 text-red-800", icon: AlertTriangle },
      maintenance: { label: "صيانة", color: "bg-yellow-100 text-yellow-800", icon: Settings }
    };
    return configs[status] || configs.disconnected;
  };

  const getHealthColor = (health: number) => {
    if (health >= 90) return "text-green-600";
    if (health >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const connectedModules = integrations.filter(m => m.status === "connected").length;
  const totalHealth = integrations.reduce((sum, m) => sum + m.health, 0) / integrations.length;

  return (
    <div className="container mx-auto p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center animate-slide-in-right">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            تكامل الأنظمة
          </h1>
          <p className="text-muted-foreground animate-fade-in" style={{animationDelay: '200ms'}}>
            إدارة ومراقبة التكامل مع الأنظمة والخدمات الخارجية
          </p>
        </div>
        
        <div className="flex gap-3 animate-scale-in">
          <Button variant="outline" className="hover-scale shadow-md hover:shadow-lg transition-all duration-300 hover:border-primary/50">
            <RefreshCw className="h-4 w-4 ml-2" />
            فحص الاتصال
          </Button>
          <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-primary/30 transition-all duration-300 hover-scale">
            <Plus className="h-4 w-4 ml-2" />
            إضافة تكامل
          </Button>
        </div>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-scale-in">
        <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200/50 animate-fade-in">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">الأنظمة المتصلة</p>
                <p className="text-2xl font-bold text-blue-700">{connectedModules}/{integrations.length}</p>
              </div>
              <Link className="h-8 w-8 text-blue-500 animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">متوسط الصحة</p>
                <p className={`text-2xl font-bold ${getHealthColor(totalHealth)}`}>
                  {Math.round(totalHealth)}%
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">طلبات API اليوم</p>
                <p className="text-2xl font-bold">2,520</p>
              </div>
              <Database className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">وقت الاستجابة</p>
                <p className="text-2xl font-bold">99ms</p>
              </div>
              <Zap className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="modules">الوحدات</TabsTrigger>
          <TabsTrigger value="sync">قواعد المزامنة</TabsTrigger>
          <TabsTrigger value="api">واجهات API</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Monitor className="h-5 w-5 ml-2" />
                  حالة الأنظمة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {integrations.map((integration) => {
                  const statusConfig = getStatusBadge(integration.status);
                  const StatusIcon = statusConfig.icon;
                  
                  return (
                    <div key={integration.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <integration.icon className="h-6 w-6 text-muted-foreground" />
                        <div>
                          <h4 className="font-medium">{integration.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            آخر مزامنة: {integration.lastSync ? 
                              new Date(integration.lastSync).toLocaleString('ar-SA') : 
                              'لم يتم بعد'
                            }
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`text-sm font-medium ${getHealthColor(integration.health)}`}>
                          {integration.health}%
                        </div>
                        <Badge className={statusConfig.color}>
                          <StatusIcon className="h-3 w-3 ml-1" />
                          {statusConfig.label}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 ml-2" />
                  الأنشطة الأخيرة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">مزامنة بيانات العملاء</p>
                        <p className="text-sm text-muted-foreground">منذ دقيقتين</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">نجح</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Database className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">تحديث واجهة API</p>
                        <p className="text-sm text-muted-foreground">منذ 5 دقائق</p>
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">مكتمل</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      <div>
                        <p className="font-medium">صيانة بوابة الدفع</p>
                        <p className="text-sm text-muted-foreground">منذ 15 دقيقة</p>
                      </div>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">جاري</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="modules" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {integrations.map((integration) => {
              const statusConfig = getStatusBadge(integration.status);
              const StatusIcon = statusConfig.icon;
              
              return (
                <Card key={integration.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <integration.icon className="h-8 w-8 text-primary" />
                        <div>
                          <CardTitle className="text-lg">{integration.name}</CardTitle>
                          <CardDescription>{integration.description}</CardDescription>
                        </div>
                      </div>
                      <Badge className={statusConfig.color}>
                        <StatusIcon className="h-3 w-3 ml-1" />
                        {statusConfig.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>صحة النظام</span>
                        <span className={getHealthColor(integration.health)}>
                          {integration.health}%
                        </span>
                      </div>
                      <Progress value={integration.health} className="h-2" />
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">المميزات المتاحة:</h4>
                      <div className="flex flex-wrap gap-1">
                        {integration.features.map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 ml-1" />
                        عرض
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 ml-1" />
                        تعديل
                      </Button>
                      <Button 
                        size="sm"
                        variant={integration.status === "connected" ? "destructive" : "default"}
                        onClick={() => handleToggleIntegration(integration.id)}
                      >
                        {integration.status === "connected" ? (
                          <>
                            <Pause className="h-4 w-4 ml-1" />
                            فصل
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 ml-1" />
                            اتصال
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="sync" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>قواعد المزامنة</CardTitle>
              <CardDescription>
                إعدادات تزامن البيانات بين الأنظمة المختلفة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rules.map((rule) => (
                  <Card key={rule.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold">{rule.name}</h4>
                            <Badge variant={rule.enabled ? "default" : "secondary"}>
                              {rule.enabled ? "مفعل" : "معطل"}
                            </Badge>
                            <Badge variant="outline">{rule.frequency}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{rule.description}</p>
                          <p className="text-xs text-muted-foreground">
                            آخر تنفيذ: {new Date(rule.lastExecution).toLocaleString('ar-SA')}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge 
                            className={rule.status === "success" ? "bg-green-100 text-green-800" : 
                                     rule.status === "pending" ? "bg-yellow-100 text-yellow-800" : 
                                     "bg-gray-100 text-gray-800"}
                          >
                            {rule.status === "success" ? "نجح" : 
                             rule.status === "pending" ? "معلق" : "معطل"}
                          </Badge>
                          <Switch 
                            checked={rule.enabled}
                            onCheckedChange={() => handleToggleRule(rule.id)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>واجهات برمجة التطبيقات</CardTitle>
              <CardDescription>
                مراقبة أداء واستخدام واجهات API
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {apiEndpoints.map((endpoint) => (
                  <Card key={endpoint.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold">{endpoint.name}</h4>
                          <p className="text-sm text-muted-foreground font-mono">{endpoint.url}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <Badge variant="outline">{endpoint.method}</Badge>
                            <span className="text-sm text-muted-foreground">
                              {endpoint.requests} طلب اليوم
                            </span>
                          </div>
                        </div>
                        <div className="text-left">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="text-sm font-medium">{endpoint.status}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {endpoint.responseTime}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Alerts */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          نظام بوابات الدفع قيد الصيانة المجدولة. قد تتأثر المعاملات المالية مؤقتاً.
        </AlertDescription>
      </Alert>
    </div>
  );
}