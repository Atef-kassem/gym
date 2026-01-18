import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ClipboardCheck, 
  Star, 
  TrendingUp, 
  Users, 
  Clock, 
  MessageSquare,
  BarChart3,
  PieChart,
  FileText,
  Plus,
  Award
} from "lucide-react";
import { useNavigate } from "react-router-dom";


const performanceKPIs = [
  { 
    name: "متوسط تقييم العملاء", 
    current: 4.2, 
    target: 4.5, 
    unit: "/5",
    trend: "+0.2",
    color: "text-green-600",
    icon: Star
  },
  { 
    name: "عدد التقييمات اليوم", 
    current: 45, 
    target: 50, 
    unit: "تقييم",
    trend: "+5",
    color: "text-blue-600",
    icon: ClipboardCheck
  },
  { 
    name: "نسبة الرضا", 
    current: 85, 
    target: 90, 
    unit: "%",
    trend: "+3%",
    color: "text-green-600",
    icon: TrendingUp
  },
  { 
    name: "متوسط وقت الخدمة", 
    current: 25, 
    target: 20, 
    unit: "دقيقة",
    trend: "-2",
    color: "text-red-600",
    icon: Clock
  }
];

export default function EvaluationManagement() {
  const navigate = useNavigate();

  // التوجيه التلقائي إلى صفحة Check Up إذا كان هناك tab=checkup في URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('tab') === 'checkup') {
      navigate('/pos/evaluation-forms/checkup');
    }
  }, [navigate]);

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">إدارة التقييم والمتابعة</h1>
          <p className="text-muted-foreground">العقل التحليلي للنظام - تقييم شامل لجودة الخدمات ورضا العملاء</p>
        </div>
      </div>

      {/* KPIs Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceKPIs.map((kpi, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.name}</CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.current}{kpi.unit}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <span>الهدف: {kpi.target}{kpi.unit}</span>
                <span className={kpi.color}>({kpi.trend})</span>
              </div>
              <div className="mt-2 w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${getProgressPercentage(kpi.current, kpi.target)}%` }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => navigate("/pos/evaluation-forms/checkup")}>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
              <ClipboardCheck className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-lg">نموذج Check Up</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center">
              تقييم شامل لجودة الخدمة ورضا العميل
            </p>
            <Button className="w-full mt-4" variant="outline">
              <Plus className="h-4 w-4 ml-2" />
              إنشاء تقييم جديد
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => navigate("/pos/evaluation-forms/history")}>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-2">
              <MessageSquare className="h-6 w-6 text-blue-500" />
            </div>
            <CardTitle className="text-lg">سجل التقييمات</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center">
              تاريخ وسجل جميع تقييمات العملاء
            </p>
            <Button className="w-full mt-4" variant="outline">
              <FileText className="h-4 w-4 ml-2" />
              عرض السجل
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-accent/50 transition-colors hover-scale"
              onClick={() => navigate("/pos/customer-satisfaction-analysis")}>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center mb-2 hover:scale-110 transition-transform">
              <BarChart3 className="h-6 w-6 text-green-500" />
            </div>
            <CardTitle className="text-lg">تحليل رضا العملاء</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center mb-3">
              نظام تقييم ذكي شامل للعناصر الخمسة الرئيسية لجودة الخدمة
            </p>
            <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>5 عناصر رئيسية</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>أفضل الممارسات</span>
              </div>
            </div>
            <Button className="w-full mt-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600" variant="default">
              <PieChart className="h-4 w-4 ml-2" />
              تحليل رضا العملاء
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-2">
              <Award className="h-6 w-6 text-purple-500" />
            </div>
            <CardTitle className="text-lg">الإعدادات</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center">
              إعدادات التقييم والتنبيهات
            </p>
            <Button className="w-full mt-4" variant="outline">
              إعداد النظام
            </Button>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}