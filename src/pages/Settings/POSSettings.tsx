import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Monitor, 
  CreditCard, 
  FileText, 
  Shield, 
  Package, 
  Bell, 
  BarChart3,
  Settings,
  ChevronLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const POSSettings = () => {
  const navigate = useNavigate();

  const settingsCategories = [
    {
      title: "إعدادات الأجهزة ونقاط البيع",
      description: "تعريف الفروع والأجهزة وربطها بالمخازن والصناديق",
      icon: Monitor,
      path: "/settings/pos-devices",
      badge: "أساسي"
    },
    {
      title: "إعدادات طرق الدفع",
      description: "تحديد وسائل الدفع المتاحة والحدود المالية",
      icon: CreditCard,
      path: "/settings/pos-payment",
      badge: "مهم"
    },
    {
      title: "إعدادات الإيصالات",
      description: "قوالب الطباعة والترقيم والإيصالات الإلكترونية",
      icon: FileText,
      path: "/settings/pos-invoice",
      badge: "ضروري"
    },
    {
      title: "إعدادات الأمان ونقاط البيع",
      description: "صلاحيات المستخدمين وسياسات الأمان",
      icon: Shield,
      path: "/settings/pos-security",
      badge: "حماية"
    },
    {
      title: "إعدادات المخزون للنقاط",
      description: "سياسات البيع والخصومات والعروض الترويجية",
      icon: Package,
      path: "/settings/pos-inventory",
      badge: "تحكم"
    },
    {
      title: "إعدادات الإشعارات",
      description: "تنبيهات العمليات والمراقبة والتحكم",
      icon: Bell,
      path: "/settings/pos-notifications",
      badge: "مراقبة"
    },
    {
      title: "إعدادات التقارير",
      description: "تخصيص وتصدير تقارير نقاط البيع",
      icon: BarChart3,
      path: "/settings/pos-reports",
      badge: "تحليل"
    }
  ];

  const getBadgeVariant = (badge: string) => {
    switch (badge) {
      case "أساسي": return "default";
      case "مهم": return "secondary";
      case "ضروري": return "destructive";
      case "حماية": return "outline";
      default: return "default";
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6" dir="rtl">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          العودة
        </Button>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Settings className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">إعدادات نقاط البيع</h1>
            <p className="text-muted-foreground">إدارة وتخصيص جميع إعدادات نظام نقاط البيع</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingsCategories.map((category) => (
          <Card 
            key={category.path}
            className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-primary/50"
            onClick={() => navigate(category.path)}
          >
            <CardHeader className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <category.icon className="h-6 w-6 text-primary" />
                </div>
                <Badge variant={getBadgeVariant(category.badge)} className="text-xs">
                  {category.badge}
                </Badge>
              </div>
              <CardTitle className="text-lg leading-tight">
                {category.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {category.description}
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
              >
                إدارة الإعدادات
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            نصائح مهمة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <strong className="text-primary">التكامل المركزي:</strong>
              <p className="mt-1 text-muted-foreground">تحديث إعدادات جميع نقاط البيع من مكان واحد</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/5 border border-secondary/20">
              <strong className="text-secondary-foreground">التخصيص المحلي:</strong>
              <p className="mt-1 text-muted-foreground">إمكانية تخصيص إعدادات خاصة لكل فرع</p>
            </div>
            <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
              <strong className="text-accent-foreground">الأمان المتقدم:</strong>
              <p className="mt-1 text-muted-foreground">مراقبة جميع العمليات الحساسة وتسجيلها</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 border border-muted">
              <strong className="text-foreground">التوافق المحلي:</strong>
              <p className="mt-1 text-muted-foreground">دعم الإيصالات الإلكترونية المصرية ZATCA</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default POSSettings;