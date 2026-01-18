import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings, 
  Users, 
  CreditCard, 
  FileText, 
  Calendar,
  UserCircle,
  Building,
  Dumbbell,
  Flower2,
  TrendingUp,
  Smartphone,
  BarChart3,
  Gift,
  Shield,
  Clock,
  Activity,
  ChevronLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const GymSettings = () => {
  const navigate = useNavigate();

  // إعدادات إدارة العضوية
  const membershipSettings = [
    {
      title: "إعدادات العضوية",
      description: "أنواع العضوية والأسعار والشروط",
      icon: Users,
      path: "/gym/settings/membership-settings",
      color: "bg-blue-500"
    },
    {
      title: "إعدادات بطاقات العضوية",
      description: "تصميم البطاقات وتخصيصها",
      icon: CreditCard,
      path: "/gym/settings/membership-cards-settings",
      color: "bg-green-500"
    },
    {
      title: "إعدادات الحضور",
      description: "قواعد الحضور والانصراف",
      icon: Clock,
      path: "/gym/settings/attendance-settings",
      color: "bg-yellow-500"
    },
    {
      title: "إعدادات المجموعات والفئات",
      description: "تعريف الفئات والمجموعات",
      icon: Users,
      path: "/gym/settings/groups-categories-settings",
      color: "bg-purple-500"
    },
    {
      title: "إعدادات الاستبيانات",
      description: "تخصيص الاستبيانات والتقييمات",
      icon: FileText,
      path: "/gym/settings/surveys-settings",
      color: "bg-teal-500"
    }
  ];

  // إعدادات الاشتراكات والمدفوعات
  const subscriptionPaymentSettings = [
    {
      title: "إعدادات الاشتراكات",
      description: "خطط الاشتراك والتجديد الآلي",
      icon: CreditCard,
      path: "/gym/settings/subscription-settings",
      color: "bg-indigo-500"
    },
    
    {
      title: "إعدادات الإيصالات",
      description: "قوالب الترقيم",
      icon: FileText,
      path: "/gym/settings/invoice-settings",
      color: "bg-orange-500"
    },
    {
      title: "إعدادات التقارير المالية",
      description: "تخصيص التقارير المالية",
      icon: BarChart3,
      path: "/gym/settings/financial-reports-settings",
      color: "bg-pink-500"
    },
    {
      title: "إعدادات الخصومات والعروض",
      description: "قواعد الخصومات والعروض الترويجية",
      icon: Gift,
      path: "/gym/settings/discounts-settings",
      color: "bg-red-500"
    }
  ];

  // إعدادات البرامج التدريبية
  const workoutProgramSettings = [
    {
      title: "إعدادات البرامج التدريبية",
      description: "أنواع البرامج والمستويات",
      icon: Dumbbell,
      path: "/gym/settings/workout-programs-settings",
      color: "bg-blue-500"
    },
    {
      title: "إعدادات قوالب التمارين",
      description: "قوالب التمارين الجاهزة",
      icon: FileText,
      path: "/gym/settings/workout-templates-settings",
      color: "bg-green-500"
    },
    {
      title: "إعدادات تتبع التقدم",
      description: "معايير التقييم والتتبع",
      icon: TrendingUp,
      path: "/gym/settings/progress-tracking-settings",
      color: "bg-yellow-500"
    },
    {
      title: "إعدادات التقييمات البدنية",
      description: "أنواع التقييمات والقياسات",
      icon: Activity,
      path: "/gym/settings/assessments-settings",
      color: "bg-purple-500"
    }
  ];

  // إعدادات الجدولة والبيع
  const schedulingSettings = [
    {
      title: "إعدادات الجدولة",
      description: "قواعد الجدولة والفترات الزمنية",
      icon: Calendar,
      path: "/gym/settings/scheduling-settings",
      color: "bg-indigo-500"
    },
    {
      title: "إعدادات حجز الحصص",
      description: "قواعد حجز الحصص الجماعية",
      icon: Calendar,
      path: "/gym/settings/class-booking-settings",
      color: "bg-emerald-500"
    },
    {
      title: "إعدادات حجوزات القاعات",
      description: "قواعد حجز القاعات والمرافق",
      icon: Building,
      path: "/gym/settings/room-booking-settings",
      color: "bg-orange-500"
    },
    {
      title: "إعدادات المواعيد الشخصية",
      description: "قواعد الحصص الشخصية مع المدربين",
      icon: UserCircle,
      path: "/gym/settings/personal-sessions-settings",
      color: "bg-pink-500"
    }
  ];

  // إعدادات المدربين
  const trainerSettings = [
    {
      title: "إعدادات المدربين",
      description: "تعريف المدربين والاختصاصات",
      icon: UserCircle,
      path: "/gym/settings/trainer-settings",
      color: "bg-blue-500"
    },
    {
      title: "إعدادات أجور المدربين",
      description: "أنظمة الدفع والعمولات",
      icon: CreditCard,
      path: "/gym/settings/trainer-payments-settings",
      color: "bg-green-500"
    },
    {
      title: "إعدادات تقييمات المدربين",
      description: "معايير التقييم والتصنيف",
      icon: TrendingUp,
      path: "/gym/settings/trainer-ratings-settings",
      color: "bg-yellow-500"
    }
  ];

  // إعدادات المرافق
  const facilitySettings = [
    {
      title: "إعدادات المرافق",
      description: "تعريف المرافق والأقسام",
      icon: Building,
      path: "/gym/settings/facility-settings",
      color: "bg-indigo-500"
    },
    {
      title: "إعدادات جرد المعدات",
      description: "أنواع المعدات وخصائصها",
      icon: Dumbbell,
      path: "/gym/settings/equipment-inventory-settings",
      color: "bg-emerald-500"
    },
    {
      title: "إعدادات صيانة المعدات",
      description: "جداول الصيانة والإشعارات",
      icon: Settings,
      path: "/gym/settings/equipment-maintenance-settings",
      color: "bg-orange-500"
    }
  ];

  // إعدادات خدمات SPA
  const spaSettings = [
    {
      title: "إعدادات خدمات SPA",
      description: "تعريف الخدمات والأسعار",
      icon: Flower2,
      path: "/gym/settings/spa-services-settings",
      color: "bg-purple-500"
    }
  ];

  // إعدادات المبيعات والتسويق
  const salesMarketingSettings = [
    {
      title: "إعدادات المبيعات",
      description: "قواعد المبيعات والعمليات التجارية",
      icon: TrendingUp,
      path: "/gym/settings/sales-settings",
      color: "bg-blue-500"
    },
    {
      title: "إعدادات التسويق",
      description: "الحملات والإعلانات",
      icon: TrendingUp,
      path: "/gym/settings/marketing-settings",
      color: "bg-green-500"
    },
    {
      title: "إعدادات برامج الولاء",
      description: "نقاط الولاء والعروض",
      icon: Gift,
      path: "/gym/settings/loyalty-programs-settings",
      color: "bg-yellow-500"
    }
  ];

  // إعدادات التقارير والتحليلات
  const reportsAnalyticsSettings = [
    {
      title: "إعدادات التقارير",
      description: "تخصيص التقارير والتصدير",
      icon: BarChart3,
      path: "/gym/settings/reports-settings",
      color: "bg-indigo-500"
    },
    {
      title: "إعدادات التحليلات",
      description: "المؤشرات والقياسات",
      icon: TrendingUp,
      path: "/gym/settings/analytics-settings",
      color: "bg-emerald-500"
    }
  ];

  // إعدادات التطبيق المحمول
  const mobileAppSettings = [
    {
      title: "إعدادات التطبيق المحمول",
      description: "تخصيص التطبيق والإشعارات",
      icon: Smartphone,
      path: "/gym/settings/mobile-app-settings",
      color: "bg-purple-500"
    }
  ];

  // الإعدادات العامة
  const generalSettings = [
    {
      title: "الإعدادات العامة للنادي",
      description: "بيانات النادي والإعدادات الأساسية",
      icon: Settings,
      path: "/gym/settings/general-settings",
      color: "bg-blue-500"
    },
    {
      title: "إعدادات الأمان والصلاحيات",
      description: "إدارة الصلاحيات والأدوار",
      icon: Shield,
      path: "/gym/settings/security-settings",
      color: "bg-red-500"
    },
    {
      title: "إعدادات الإشعارات",
      description: "تنبيهات وإشعارات النظام",
      icon: Settings,
      path: "/gym/settings/notifications-settings",
      color: "bg-green-500"
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/gym")}
            className="h-9 w-9"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Settings className="h-8 w-8 text-primary" />
              إعدادات النادي الرياضي
            </h1>
            <p className="text-muted-foreground mt-1">
              إدارة وتخصيص جميع إعدادات النادي الرياضي
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="membership" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 lg:grid-cols-10 h-auto p-1">
          <TabsTrigger value="membership" className="text-xs">
            <Users className="h-4 w-4 ml-1" />
            العضوية
          </TabsTrigger>
          <TabsTrigger value="subscription" className="text-xs">
            <CreditCard className="h-4 w-4 ml-1" />
            الاشتراكات
          </TabsTrigger>
          <TabsTrigger value="workout" className="text-xs">
            <Dumbbell className="h-4 w-4 ml-1" />
            البرامج
          </TabsTrigger>
          <TabsTrigger value="scheduling" className="text-xs">
            <Calendar className="h-4 w-4 ml-1" />
            الجدولة
          </TabsTrigger>
          <TabsTrigger value="trainer" className="text-xs">
            <UserCircle className="h-4 w-4 ml-1" />
            المدربين
          </TabsTrigger>
          <TabsTrigger value="facility" className="text-xs">
            <Building className="h-4 w-4 ml-1" />
            المرافق
          </TabsTrigger>
          <TabsTrigger value="spa" className="text-xs">
            <Flower2 className="h-4 w-4 ml-1" />
            SPA
          </TabsTrigger>
          <TabsTrigger value="sales" className="text-xs">
            <TrendingUp className="h-4 w-4 ml-1" />
            المبيعات
          </TabsTrigger>
          <TabsTrigger value="reports" className="text-xs">
            <BarChart3 className="h-4 w-4 ml-1" />
            التقارير
          </TabsTrigger>
          <TabsTrigger value="general" className="text-xs">
            <Settings className="h-4 w-4 ml-1" />
            عام
          </TabsTrigger>
        </TabsList>

        {/* إعدادات إدارة العضوية */}
        <TabsContent value="membership" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {membershipSettings.map((setting, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => navigate(setting.path)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-lg ${setting.color} bg-opacity-10 group-hover:bg-opacity-20 transition-colors`}>
                      <setting.icon className={`h-6 w-6 ${setting.color.replace('bg-', 'text-')}`} />
                    </div>
                  </div>
                  <CardTitle className="mt-4">{setting.title}</CardTitle>
                  <CardDescription>{setting.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    فتح الإعدادات
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* إعدادات الاشتراكات والمدفوعات */}
        <TabsContent value="subscription" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subscriptionPaymentSettings.map((setting, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => navigate(setting.path)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-lg ${setting.color} bg-opacity-10 group-hover:bg-opacity-20 transition-colors`}>
                      <setting.icon className={`h-6 w-6 ${setting.color.replace('bg-', 'text-')}`} />
                    </div>
                  </div>
                  <CardTitle className="mt-4">{setting.title}</CardTitle>
                  <CardDescription>{setting.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    فتح الإعدادات
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* إعدادات البرامج التدريبية */}
        <TabsContent value="workout" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workoutProgramSettings.map((setting, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => navigate(setting.path)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-lg ${setting.color} bg-opacity-10 group-hover:bg-opacity-20 transition-colors`}>
                      <setting.icon className={`h-6 w-6 ${setting.color.replace('bg-', 'text-')}`} />
                    </div>
                  </div>
                  <CardTitle className="mt-4">{setting.title}</CardTitle>
                  <CardDescription>{setting.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    فتح الإعدادات
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* إعدادات الجدولة والبيع */}
        <TabsContent value="scheduling" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {schedulingSettings.map((setting, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => navigate(setting.path)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-lg ${setting.color} bg-opacity-10 group-hover:bg-opacity-20 transition-colors`}>
                      <setting.icon className={`h-6 w-6 ${setting.color.replace('bg-', 'text-')}`} />
                    </div>
                  </div>
                  <CardTitle className="mt-4">{setting.title}</CardTitle>
                  <CardDescription>{setting.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    فتح الإعدادات
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* إعدادات المدربين */}
        <TabsContent value="trainer" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trainerSettings.map((setting, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => navigate(setting.path)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-lg ${setting.color} bg-opacity-10 group-hover:bg-opacity-20 transition-colors`}>
                      <setting.icon className={`h-6 w-6 ${setting.color.replace('bg-', 'text-')}`} />
                    </div>
                  </div>
                  <CardTitle className="mt-4">{setting.title}</CardTitle>
                  <CardDescription>{setting.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    فتح الإعدادات
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* إعدادات المرافق */}
        <TabsContent value="facility" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {facilitySettings.map((setting, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => navigate(setting.path)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-lg ${setting.color} bg-opacity-10 group-hover:bg-opacity-20 transition-colors`}>
                      <setting.icon className={`h-6 w-6 ${setting.color.replace('bg-', 'text-')}`} />
                    </div>
                  </div>
                  <CardTitle className="mt-4">{setting.title}</CardTitle>
                  <CardDescription>{setting.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    فتح الإعدادات
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* إعدادات خدمات SPA */}
        <TabsContent value="spa" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {spaSettings.map((setting, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => navigate(setting.path)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-lg ${setting.color} bg-opacity-10 group-hover:bg-opacity-20 transition-colors`}>
                      <setting.icon className={`h-6 w-6 ${setting.color.replace('bg-', 'text-')}`} />
                    </div>
                  </div>
                  <CardTitle className="mt-4">{setting.title}</CardTitle>
                  <CardDescription>{setting.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    فتح الإعدادات
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* إعدادات المبيعات والتسويق */}
        <TabsContent value="sales" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {salesMarketingSettings.map((setting, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => navigate(setting.path)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-lg ${setting.color} bg-opacity-10 group-hover:bg-opacity-20 transition-colors`}>
                      <setting.icon className={`h-6 w-6 ${setting.color.replace('bg-', 'text-')}`} />
                    </div>
                  </div>
                  <CardTitle className="mt-4">{setting.title}</CardTitle>
                  <CardDescription>{setting.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    فتح الإعدادات
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* إعدادات التقارير والتحليلات */}
        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportsAnalyticsSettings.map((setting, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => navigate(setting.path)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-lg ${setting.color} bg-opacity-10 group-hover:bg-opacity-20 transition-colors`}>
                      <setting.icon className={`h-6 w-6 ${setting.color.replace('bg-', 'text-')}`} />
                    </div>
                  </div>
                  <CardTitle className="mt-4">{setting.title}</CardTitle>
                  <CardDescription>{setting.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    فتح الإعدادات
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* الإعدادات العامة */}
        <TabsContent value="general" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {generalSettings.map((setting, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => navigate(setting.path)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-lg ${setting.color} bg-opacity-10 group-hover:bg-opacity-20 transition-colors`}>
                      <setting.icon className={`h-6 w-6 ${setting.color.replace('bg-', 'text-')}`} />
                    </div>
                  </div>
                  <CardTitle className="mt-4">{setting.title}</CardTitle>
                  <CardDescription>{setting.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    فتح الإعدادات
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GymSettings;

