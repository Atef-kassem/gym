import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dumbbell,
  FileText,
  TrendingUp,
  Activity,
  ChevronLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const WorkoutProgramsSettings = () => {
  const navigate = useNavigate();

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

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/gym/workout-programs")}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">إعدادات البرامج التدريبية واللياقة</h1>
          <p className="text-muted-foreground">إدارة جميع إعدادات البرامج التدريبية</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workoutProgramSettings.map((setting, index) => (
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

export default WorkoutProgramsSettings;

