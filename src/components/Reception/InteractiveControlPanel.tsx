import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings, 
  Download, 
  Upload, 
  RefreshCw, 
  Filter,
  BarChart3,
  PieChart,
  TrendingUp,
  Calendar,
  Clock,
  Users,
  DollarSign,
  Star,
  Activity,
  Bell,
  Eye,
  Target,
  Zap,
  CheckCircle2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function InteractiveControlPanel() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("quick-actions");

  const quickActions = [
    {
      title: "تحديث البيانات",
      description: "تحديث جميع البيانات من الخادم",
      icon: RefreshCw,
      action: () => {
        toast({
          title: "تم تحديث البيانات",
          description: "تم تحديث جميع البيانات بنجاح",
          className: "toast-success"
        });
      },
      color: "text-blue-600 bg-blue-100"
    },
    {
      title: "تصدير التقارير",
      description: "تصدير التقارير الحالية إلى Excel",
      icon: Download,
      action: () => {
        toast({
          title: "تصدير التقارير",
          description: "جاري تحضير ملف التقرير...",
          className: "toast-warning"
        });
      },
      color: "text-green-600 bg-green-100"
    },
    {
      title: "استيراد البيانات",
      description: "استيراد بيانات جديدة من ملف",
      icon: Upload,
      action: () => {
        toast({
          title: "استيراد البيانات",
          description: "سيتم فتح نافذة اختيار الملف",
        });
      },
      color: "text-purple-600 bg-purple-100"
    },
    {
      title: "تطبيق المرشحات",
      description: "تطبيق مرشحات متقدمة على البيانات",
      icon: Filter,
      action: () => {
        toast({
          title: "المرشحات المتقدمة",
          description: "تم تطبيق مرشحات ذكية على البيانات",
          className: "toast-success"
        });
      },
      color: "text-orange-600 bg-orange-100"
    }
  ];

  const analyticsTools = [
    {
      title: "تحليل الاتجاهات",
      description: "تحليل الاتجاهات الزمنية للبيانات",
      icon: TrendingUp,
      action: () => {
        toast({
          title: "تحليل الاتجاهات",
          description: "تم بدء تحليل الاتجاهات الزمنية",
        });
      }
    },
    {
      title: "التحليل الإحصائي",
      description: "تحليل إحصائي شامل للبيانات",
      icon: BarChart3,
      action: () => {
        toast({
          title: "التحليل الإحصائي",
          description: "جاري إنشاء التحليل الإحصائي...",
        });
      }
    },
    {
      title: "توزيع البيانات",
      description: "عرض توزيع البيانات بالرسوم البيانية",
      icon: PieChart,
      action: () => {
        toast({
          title: "توزيع البيانات",
          description: "تم إنشاء مخططات التوزيع",
          className: "toast-success"
        });
      }
    },
    {
      title: "تقرير شامل",
      description: "إنشاء تقرير شامل لجميع البيانات",
      icon: Activity,
      action: () => {
        toast({
          title: "التقرير الشامل",
          description: "جاري إنشاء التقرير الشامل...",
        });
      }
    }
  ];

  const systemSettings = [
    {
      title: "إعدادات النظام",
      description: "إعدادات عامة للنظام",
      icon: Settings,
      action: () => {
        toast({
          title: "إعدادات النظام",
          description: "سيتم فتح إعدادات النظام",
        });
      }
    },
    {
      title: "إعدادات الإشعارات",
      description: "تخصيص الإشعارات والتنبيهات",
      icon: Bell,
      action: () => {
        toast({
          title: "إعدادات الإشعارات",
          description: "تم فتح إعدادات الإشعارات",
        });
      }
    },
    {
      title: "أهداف الأداء",
      description: "تحديد أهداف الأداء المطلوبة",
      icon: Target,
      action: () => {
        toast({
          title: "أهداف الأداء",
          description: "تم فتح إعدادات أهداف الأداء",
        });
      }
    },
    {
      title: "تحسين الأداء",
      description: "تشغيل أدوات تحسين الأداء",
      icon: Zap,
      action: () => {
        toast({
          title: "تحسين الأداء",
          description: "جاري تحسين أداء النظام...",
          className: "toast-success"
        });
      }
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">لوحة التحكم التفاعلية</h2>
        <p className="text-muted-foreground">جميع الأدوات والوظائف في مكان واحد</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 glass-effect">
          <TabsTrigger value="quick-actions">
            الإجراءات السريعة
          </TabsTrigger>
          <TabsTrigger value="analytics">
            أدوات التحليل
          </TabsTrigger>
          <TabsTrigger value="settings">
            إعدادات النظام
          </TabsTrigger>
        </TabsList>

        <TabsContent value="quick-actions" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <Card 
                key={index} 
                className="hover:shadow-lg transition-all duration-200 cursor-pointer"
                onClick={action.action}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${action.color}`}>
                      <action.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{action.title}</CardTitle>
                      <CardDescription>{action.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {analyticsTools.map((tool, index) => (
              <Card 
                key={index} 
                className="hover:shadow-lg transition-all duration-200 cursor-pointer"
                onClick={tool.action}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-blue-100">
                      <tool.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{tool.title}</CardTitle>
                      <CardDescription>{tool.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>تقدم التحليل</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>تحليل البيانات</span>
                  <span>85%</span>
                </div>
                <Progress value={85} className="h-3" />
                <div className="flex justify-between">
                  <span>إنشاء التقارير</span>
                  <span>92%</span>
                </div>
                <Progress value={92} className="h-3" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {systemSettings.map((setting, index) => (
              <Card 
                key={index} 
                className="hover:shadow-lg transition-all duration-200 cursor-pointer"
                onClick={setting.action}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-purple-100">
                      <setting.icon className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{setting.title}</CardTitle>
                      <CardDescription>{setting.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>حالة النظام</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg bg-green-50">
                  <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="font-medium">النظام نشط</div>
                  <div className="text-sm text-muted-foreground">جميع الخدمات تعمل</div>
                </div>
                <div className="text-center p-4 border rounded-lg bg-blue-50">
                  <Activity className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="font-medium">الأداء ممتاز</div>
                  <div className="text-sm text-muted-foreground">98% كفاءة</div>
                </div>
                <div className="text-center p-4 border rounded-lg bg-yellow-50">
                  <Eye className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <div className="font-medium">المراقبة نشطة</div>
                  <div className="text-sm text-muted-foreground">24/7 متاح</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}