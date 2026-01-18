import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar,
  Building,
  UserCircle,
  Clock,
  ChevronLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const SchedulingSettings = () => {
  const navigate = useNavigate();

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

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/gym/scheduling")}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">إعدادات الجدولة والبيع</h1>
          <p className="text-muted-foreground">إدارة جميع إعدادات الجدولة والبيع</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schedulingSettings.map((setting, index) => (
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

export default SchedulingSettings;

