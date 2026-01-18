import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Building, Users, DollarSign, Clock, Shield, FileText, TrendingUp, Globe, Database } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HCMSettings = () => {
  const navigate = useNavigate();

  const coreSettings = [
    {
      title: "الهيكل التنظيمي",
      description: "رسم شجري للإدارات والفروع والأقسام",
      icon: Building,
      path: "/hcm/settings/organizational-structure",
      color: "bg-blue-500"
    },
    {
      title: "الوظائف والمسميات",
      description: "قائمة مركزية لجميع المسميات والدرجات",
      icon: Users,
      path: "/hcm/settings/job-definitions",
      color: "bg-green-500"
    },
    {
      title: "جداول الرواتب",
      description: "تحديد السلالم والجداول للرواتب والبدلات",
      icon: DollarSign,
      path: "/hcm/settings/salary-scales",
      color: "bg-yellow-500"
    },
    {
      title: "إعداد الورديات",
      description: "جداول العمل ونظام الشفتات",
      icon: Clock,
      path: "/hcm/settings/work-shifts",
      color: "bg-purple-500"
    },
    {
      title: "التعريفات الإدارية",
      description: "إدارة البيانات المرجعية والقوائم المنسدلة",
      icon: Database,
      path: "/hcm/settings/administrative-definitions",
      color: "bg-teal-500"
    },
    {
      title: "التأمينات الاجتماعية",
      description: "إعدادات التأمينات حسب النظام المصري",
      icon: Shield,
      path: "/hcm/settings/social-insurance",
      color: "bg-emerald-500"
    }
  ];

  const policySettings = [
    {
      title: "سياسات الإجازات",
      description: "تعريف أنواع الإجازات وشروطها",
      icon: FileText,
      path: "/hcm/settings/leave-policies",
      color: "bg-indigo-500"
    },
    {
      title: "سياسات التأخيرات",
      description: "آلية احتساب التأخير والاستقطاعات",
      icon: Clock,
      path: "/hcm/settings/attendance-policies",
      color: "bg-orange-500"
    },
    {
      title: "سياسات العمل الإضافي",
      description: "تعريف الحالات ومعادلات الاحتساب",
      icon: TrendingUp,
      path: "/hcm/settings/overtime-policies",
      color: "bg-teal-500"
    },
    {
      title: "تنبيهات الوثائق",
      description: "إعداد تنبيهات انتهاء الوثائق",
      icon: FileText,
      path: "/hcm/settings/document-alerts",
      color: "bg-pink-500"
    }
  ];

  const operationalPolicies = [
    {
      title: "سياسات التوظيف",
      description: "شروط وآليات الاستقطاب والتوظيف",
      path: "/hcm/settings/recruitment-policies"
    },
    {
      title: "سياسات الترقيات",
      description: "شروط وضوابط الترقية والتنقلات",
      path: "/hcm/settings/promotion-policies"
    },
    {
      title: "سياسات الرواتب",
      description: "جداول الرواتب والاستحقاقات",
      path: "/hcm/settings/salary-policies"
    },
    {
      title: "سياسات التقييم",
      description: "دورية التقييم ومعايير الأداء",
      path: "/hcm/settings/performance-policies"
    },
    {
      title: "سياسات نهاية الخدمة",
      description: "إجراءات الاستقالة وإخلاء الطرف",
      path: "/hcm/settings/exit-policies"
    },
    {
      title: "الصحة والسلامة",
      description: "سياسات الكشف الطبي والتأمين",
      path: "/hcm/settings/health-safety"
    }
  ];

  const advancedSettings = [
    {
      title: "قوالب الوثائق",
      description: "إعداد قوالب العقود والوثائق التلقائية",
      path: "/hcm/settings/document-templates"
    },
    {
      title: "الخدمة الذاتية",
      description: "تخصيص شاشات الخدمة الذاتية",
      path: "/hcm/settings/self-service"
    },
    {
      title: "سير العمل الآلي",
      description: "إدارة سياسات الاعتماد الآلي",
      path: "/hcm/settings/workflow-automation"
    },
    {
      title: "الأرشيف الرقمي",
      description: "سياسة الاحتفاظ بالملفات",
      path: "/hcm/settings/digital-archive"
    },
    {
      title: "المؤشرات التحليلية",
      description: "إعداد مؤشرات إدارة ج.م المال البشري",
      path: "/hcm/settings/analytics-indicators"
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Settings className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">إعدادات وسياسات HCM</h1>
            <p className="text-muted-foreground">إدارة شاملة لإعدادات وسياسات إدارة ج.م المال البشري</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="core" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="core">الإعدادات الأساسية</TabsTrigger>
          <TabsTrigger value="policies">سياسات النظام</TabsTrigger>
          <TabsTrigger value="operational">السياسات التشغيلية</TabsTrigger>
          <TabsTrigger value="advanced">الإعدادات المتقدمة</TabsTrigger>
        </TabsList>

        {/* الإعدادات الأساسية */}
        <TabsContent value="core" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                الإعدادات الأساسية للنظام
              </CardTitle>
              <CardDescription>
                الإعدادات الجوهرية التي تحكم عمل نظام إدارة الموارد البشرية
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {coreSettings.map((setting, index) => {
                  const IconComponent = setting.icon;
                  return (
                    <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${setting.color}`}>
                            <IconComponent className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-sm mb-1">{setting.title}</h3>
                            <p className="text-xs text-muted-foreground mb-2">{setting.description}</p>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="w-full"
                              onClick={() => navigate(setting.path)}
                            >
                              إعداد
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* سياسات النظام */}
        <TabsContent value="policies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                سياسات النظام
              </CardTitle>
              <CardDescription>
                السياسات التي تحكم الإجراءات والعمليات اليومية
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {policySettings.map((setting, index) => {
                  const IconComponent = setting.icon;
                  return (
                    <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${setting.color}`}>
                            <IconComponent className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-sm mb-1">{setting.title}</h3>
                            <p className="text-xs text-muted-foreground mb-2">{setting.description}</p>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="w-full"
                              onClick={() => navigate(setting.path)}
                            >
                              إدارة
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* السياسات التشغيلية */}
        <TabsContent value="operational" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                السياسات التشغيلية والإجرائية
              </CardTitle>
              <CardDescription>
                السياسات التشغيلية التي تحكم دورة حياة الموظف
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {operationalPolicies.map((policy, index) => (
                  <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-sm mb-1">{policy.title}</h3>
                      <p className="text-xs text-muted-foreground mb-2">{policy.description}</p>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full"
                        onClick={() => navigate(policy.path)}
                      >
                        تكوين
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* الإعدادات المتقدمة */}
        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                الإعدادات المتقدمة
              </CardTitle>
              <CardDescription>
                أدوات متقدمة للأتمتة والتحليل والتطوير
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {advancedSettings.map((setting, index) => (
                  <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-sm mb-1">{setting.title}</h3>
                      <p className="text-xs text-muted-foreground mb-2">{setting.description}</p>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full"
                        onClick={() => navigate(setting.path)}
                      >
                        إعداد
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HCMSettings;