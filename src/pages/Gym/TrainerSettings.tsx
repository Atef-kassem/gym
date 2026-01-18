import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  UserCircle,
  CreditCard,
  TrendingUp,
  ChevronLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const TrainerSettings = () => {
  const navigate = useNavigate();

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

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/gym/trainers")}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">إعدادات إدارة المدربين</h1>
          <p className="text-muted-foreground">إدارة جميع إعدادات المدربين</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainerSettings.map((setting, index) => (
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

export default TrainerSettings;

