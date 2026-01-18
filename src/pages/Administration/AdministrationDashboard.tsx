import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Archive,
  Settings,
  Building,
  FileText,
  Users,
  Wrench,
  BarChart3,
  Bell,
  Search,
  Plus,
  Filter,
  Download,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Star,
  Zap
} from "lucide-react";

interface ServiceMetric {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "stable";
  icon: any;
  color: string;
}

interface DepartmentCard {
  title: string;
  description: string;
  icon: any;
  route: string;
  color: string;
  metrics: {
    total: number;
    active: number;
    pending: number;
    completion: number;
  };
  features: string[];
}

const AdministrationDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const serviceMetrics: ServiceMetric[] = [
    {
      title: "إجمالي الوثائق المؤرشفة",
      value: "15,847",
      change: "+12%",
      trend: "up",
      icon: FileText,
      color: "text-blue-500"
    },
    {
      title: "طلبات الخدمات النشطة",
      value: "234",
      change: "+8%",
      trend: "up",
      icon: Settings,
      color: "text-green-500"
    },
    {
      title: "أوامر الصيانة",
      value: "89",
      change: "-5%",
      trend: "down",
      icon: Wrench,
      color: "text-orange-500"
    },
    {
      title: "معدل الإنجاز",
      value: "94.8%",
      change: "+2.1%",
      trend: "up",
      icon: CheckCircle,
      color: "text-emerald-500"
    }
  ];

  const departments: DepartmentCard[] = [
    {
      title: "إدارة الأرشفة والوثائق",
      description: "نظام شامل لإدارة الوثائق والأرشفة الرقمية مع تقنيات الذكاء الاصطناعي",
      icon: Archive,
      route: "/administration/documents",
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
      metrics: {
        total: 15847,
        active: 1256,
        pending: 89,
        completion: 96
      },
      features: [
        "الأرشفة الرقمية المتقدمة",
        "تصنيف الوثائق بالذكاء الاصطناعي",
        "البحث الذكي في الوثائق",
        "إدارة دورة حياة الوثائق",
        "النسخ الاحتياطي الآمن"
      ]
    },
    {
      title: "إدارة الخدمات العامة",
      description: "إدارة شاملة للخدمات العامة وطلبات الموظفين مع أتمتة العمليات",
      icon: Users,
      route: "/administration/services",
      color: "bg-gradient-to-r from-green-500 to-green-600",
      metrics: {
        total: 1847,
        active: 234,
        pending: 45,
        completion: 89
      },
      features: [
        "إدارة طلبات الخدمات",
        "تتبع حالة الطلبات",
        "التوجيه الذكي للطلبات",
        "إحصائيات الأداء",
        "تقييم جودة الخدمة"
      ]
    },
    {
      title: "إدارة الممتلكات والصيانة",
      description: "نظام متكامل لإدارة الممتلكات وجدولة الصيانة الوقائية والعلاجية",
      icon: Building,
      route: "/administration/property",
      color: "bg-gradient-to-r from-orange-500 to-orange-600",
      metrics: {
        total: 456,
        active: 89,
        pending: 23,
        completion: 92
      },
      features: [
        "جرد الممتلكات والأصول",
        "الصيانة الوقائية المجدولة",
        "إدارة طلبات الصيانة",
        "تتبع تكاليف الصيانة",
        "تقارير الأصول التفصيلية"
      ]
    }
  ];

  const recentActivities = [
    {
      type: "document",
      title: "تم أرشفة 25 وثيقة جديدة",
      time: "منذ ساعتين",
      user: "أحمد محمد",
      priority: "normal"
    },
    {
      type: "service",
      title: "طلب خدمة IT جديد",
      time: "منذ 3 ساعات",
      user: "فاطمة علي",
      priority: "high"
    },
    {
      type: "maintenance",
      title: "اكتمال صيانة المصاعد",
      time: "منذ 4 ساعات",
      user: "خالد أحمد",
      priority: "normal"
    }
  ];

  const aiInsights = [
    {
      title: "توقع زيادة طلبات الصيانة",
      description: "النماذج تتوقع زيادة 15% في طلبات الصيانة الشهر القادم",
      impact: "high",
      recommendation: "زيادة فريق الصيانة المؤقت"
    },
    {
      title: "تحسين كفاءة الأرشفة",
      description: "يمكن تحسين عملية الأرشفة بنسبة 25% باستخدام التصنيف التلقائي",
      impact: "medium",
      recommendation: "تطبيق نظام التصنيف الذكي"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
              <Settings className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                إدارة الشؤون الإدارية والخدمات
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                نظام شامل لإدارة العمليات الإدارية والخدمات المؤسسية المدعوم بالذكاء الاصطناعي
              </p>
            </div>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {serviceMetrics.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        {metric.title}
                      </p>
                      <p className="text-3xl font-bold">{metric.value}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant={metric.trend === "up" ? "default" : "secondary"}>
                          {metric.change}
                        </Badge>
                        <span className="text-xs text-muted-foreground">مقارنة بالشهر الماضي</span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-xl ${metric.color} bg-opacity-10`}>
                      <IconComponent className={`h-6 w-6 ${metric.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* AI Insights */}
        <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <Zap className="h-5 w-5" />
              رؤى الذكاء الاصطناعي
            </CardTitle>
            <CardDescription>
              تحليلات ذكية وتوصيات لتحسين الأداء
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiInsights.map((insight, index) => (
                <div key={index} className="p-4 bg-white rounded-lg border shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      insight.impact === 'high' ? 'bg-red-500' : 
                      insight.impact === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`} />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">{insight.title}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{insight.description}</p>
                      <Badge variant="outline" className="text-xs">
                        {insight.recommendation}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Departments Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {departments.map((dept, index) => {
            const IconComponent = dept.icon;
            return (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-500 border-0 overflow-hidden">
                <div className={`h-2 ${dept.color}`}></div>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-xl text-white ${dept.color}`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{dept.title}</CardTitle>
                      <CardDescription className="text-sm leading-relaxed">
                        {dept.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-slate-50 rounded-lg">
                      <div className="text-2xl font-bold text-slate-800">{dept.metrics.total.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">المجموع</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{dept.metrics.active}</div>
                      <div className="text-xs text-muted-foreground">نشط</div>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>معدل الإنجاز</span>
                      <span className="font-medium">{dept.metrics.completion}%</span>
                    </div>
                    <Progress value={dept.metrics.completion} className="h-2" />
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-slate-700">الميزات الرئيسية:</h4>
                    <div className="space-y-1">
                      {dept.features.slice(0, 3).map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          {feature}
                        </div>
                      ))}
                      {dept.features.length > 3 && (
                        <div className="text-xs text-muted-foreground">
                          +{dept.features.length - 3} ميزة أخرى
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button 
                    onClick={() => navigate(dept.route)}
                    className="w-full group-hover:scale-105 transition-transform duration-300"
                    size="lg"
                  >
                    <Settings className="h-4 w-4 ml-2" />
                    دخول النظام
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              الأنشطة الحديثة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                  <div className={`w-3 h-3 rounded-full ${
                    activity.priority === 'high' ? 'bg-red-500' : 'bg-green-500'
                  }`} />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{activity.title}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{activity.time}</span>
                      <span>•</span>
                      <span>{activity.user}</span>
                    </div>
                  </div>
                  <Badge variant={activity.priority === 'high' ? 'destructive' : 'secondary'}>
                    {activity.priority === 'high' ? 'عالي' : 'عادي'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdministrationDashboard;