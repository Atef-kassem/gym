import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Building,
  Dumbbell,
  Settings,
  ChevronLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const FacilitySettings = () => {
  const navigate = useNavigate();

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

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/gym/facilities")}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">إعدادات المرافق والمعدات</h1>
          <p className="text-muted-foreground">إدارة جميع إعدادات المرافق والمعدات</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {facilitySettings.map((setting, index) => (
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

export default FacilitySettings;

