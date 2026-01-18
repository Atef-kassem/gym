import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp,
  Gift,
  Flower2,
  ChevronLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ServicesMarketingSettings = () => {
  const navigate = useNavigate();

  const servicesMarketingSettings = [
    {
      title: "إعدادات خدمات SPA",
      description: "تعريف الخدمات والأسعار",
      icon: Flower2,
      path: "/gym/settings/spa-services-settings",
      color: "bg-purple-500"
    },
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

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/gym/spa-services")}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">إعدادات الخدمات والتسويق</h1>
          <p className="text-muted-foreground">إدارة جميع إعدادات الخدمات والتسويق</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {servicesMarketingSettings.map((setting, index) => (
          <Card
            key={index}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate(setting.path)}
          >
            <CardHeader>
              <div className={`w-12 h-12 rounded-lg ${setting.color} flex items-center justify-center mb-4`}>
                <setting.icon className="h-6 w-6 text-white" />
              </div>
              <CardTitle>{setting.title}</CardTitle>
              <CardDescription>{setting.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ServicesMarketingSettings;

