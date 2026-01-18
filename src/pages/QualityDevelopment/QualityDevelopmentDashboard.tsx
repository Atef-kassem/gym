import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Target, 
  FileCheck, 
  Rocket, 
  Video, 
  MessageSquare, 
  Shield, 
  BarChart3,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Award,
  Eye,
  Plus,
  Filter,
  Download
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

// Mock data for KPIs
const kpiData = {
  totalPolicies: 45,
  activePolicies: 42,
  policyCompliance: 92,
  improvementProjects: 18,
  completedProjects: 12,
  ongoingProjects: 6,
  upcomingMeetings: 8,
  completedMeetings: 24,
  openComplaints: 7,
  resolvedComplaints: 89,
  riskAssessments: 15,
  highRisks: 3,
  mediumRisks: 8,
  lowRisks: 4
};

const recentActivities = [
  {
    id: 1,
    type: "policy",
    title: "تحديث سياسة إدارة الوثائق",
    description: "تم تحديث سياسة إدارة الوثائق الإلكترونية وإضافة إجراءات جديدة",
    timestamp: "منذ ساعتين",
    status: "completed",
    icon: FileCheck,
    color: "text-blue-500"
  },
  {
    id: 2,
    type: "meeting",
    title: "اجتماع لجنة التحسين المستمر",
    description: "مناقشة مبادرات التطوير للربع الثالث",
    timestamp: "منذ 4 ساعات",
    status: "ongoing",
    icon: Video,
    color: "text-orange-500"
  },
  {
    id: 3,
    type: "complaint",
    title: "شكوى جديدة في قسم الخدمات",
    description: "تأخير في تسليم الخدمات للعملاء",
    timestamp: "منذ 6 ساعات",
    status: "pending",
    icon: MessageSquare,
    color: "text-red-500"
  },
  {
    id: 4,
    type: "project",
    title: "إنجاز مشروع تحسين جودة الخدمة",
    description: "تم إنجاز 85% من مشروع تحسين جودة خدمة العملاء",
    timestamp: "منذ يوم واحد",
    status: "completed",
    icon: Rocket,
    color: "text-green-500"
  }
];

const improvementMetrics = [
  {
    title: "مؤشر رضا العملاء",
    value: 4.2,
    maxValue: 5,
    change: "+0.3",
    trend: "up",
    description: "تحسن ملحوظ في رضا العملاء"
  },
  {
    title: "معدل تنفيذ التوصيات",
    value: 87,
    maxValue: 100,
    change: "+5%",
    trend: "up",
    description: "زيادة في تنفيذ توصيات التحسين"
  },
  {
    title: "وقت معالجة الشكاوى",
    value: 2.1,
    maxValue: 5,
    change: "-0.5",
    trend: "down",
    description: "تحسن في سرعة معالجة الشكاوى (بالأيام)"
  },
  {
    title: "نسبة الامتثال للسياسات",
    value: 92,
    maxValue: 100,
    change: "+3%",
    trend: "up",
    description: "التزام عالي بالسياسات المؤسسية"
  }
];

const quickActions = [
  {
    title: "إنشاء سياسة جديدة",
    description: "إضافة سياسة أو إجراء جديد",
    icon: FileCheck,
    color: "bg-blue-500",
    action: "/quality-development/policies"
  },
  {
    title: "تسجيل اجتماع",
    description: "إضافة اجتماع أو جلسة تطويرية",
    icon: Video,
    color: "bg-orange-500",
    action: "/quality-development/meetings"
  },
  {
    title: "تسجيل شكوى",
    description: "إضافة شكوى أو مقترح تحسين",
    icon: MessageSquare,
    color: "bg-red-500",
    action: "/quality-development/complaints"
  },
  {
    title: "مشروع تحسين",
    description: "إنشاء مشروع تحسين جديد",
    icon: Rocket,
    color: "bg-green-500",
    action: "/quality-development/improvement-programs"
  }
];

export default function QualityDevelopmentDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-700 border-green-200">مكتمل</Badge>;
      case "ongoing":
        return <Badge className="bg-orange-100 text-orange-700 border-orange-200">جاري</Badge>;
      case "pending":
        return <Badge className="bg-red-100 text-red-700 border-red-200">معلق</Badge>;
      default:
        return <Badge variant="secondary">غير محدد</Badge>;
    }
  };

  const getTrendIcon = (trend: string) => {
    return trend === "up" ? 
      <TrendingUp className="h-4 w-4 text-green-500" /> : 
      <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">إدارة الجودة والتطوير المؤسسي</h1>
          <p className="text-muted-foreground">
            نظام شامل لإدارة الجودة والتطوير المستمر وفق أفضل الممارسات العالمية
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            تصفية
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            تصدير التقرير
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">السياسات النشطة</CardTitle>
            <FileCheck className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{kpiData.activePolicies}</div>
            <p className="text-xs text-muted-foreground">
              من أصل {kpiData.totalPolicies} سياسة
            </p>
            <Progress value={(kpiData.activePolicies / kpiData.totalPolicies) * 100} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مشاريع التحسين</CardTitle>
            <Rocket className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{kpiData.improvementProjects}</div>
            <p className="text-xs text-muted-foreground">
              {kpiData.completedProjects} مكتمل، {kpiData.ongoingProjects} جاري
            </p>
            <Progress value={(kpiData.completedProjects / kpiData.improvementProjects) * 100} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الاجتماعات</CardTitle>
            <Video className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{kpiData.upcomingMeetings}</div>
            <p className="text-xs text-muted-foreground">
              اجتماعات قادمة، {kpiData.completedMeetings} مكتملة
            </p>
            <Progress value={75} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الشكاوى المفتوحة</CardTitle>
            <MessageSquare className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{kpiData.openComplaints}</div>
            <p className="text-xs text-muted-foreground">
              {kpiData.resolvedComplaints} تم حلها
            </p>
            <Progress value={(kpiData.resolvedComplaints / (kpiData.resolvedComplaints + kpiData.openComplaints)) * 100} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-4">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="metrics">المؤشرات</TabsTrigger>
          <TabsTrigger value="activities">الأنشطة</TabsTrigger>
          <TabsTrigger value="actions">إجراءات سريعة</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Improvement Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-500" />
                  مؤشرات التحسين الرئيسية
                </CardTitle>
                <CardDescription>أهم مؤشرات الأداء للجودة والتطوير</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {improvementMetrics.map((metric, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{metric.title}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-bold">{metric.value}/{metric.maxValue}</span>
                        {getTrendIcon(metric.trend)}
                        <span className={`text-xs ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                          {metric.change}
                        </span>
                      </div>
                    </div>
                    <Progress value={(metric.value / metric.maxValue) * 100} className="h-2" />
                    <p className="text-xs text-muted-foreground">{metric.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Risk Assessment Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-yellow-500" />
                  ملخص تقييم المخاطر
                </CardTitle>
                <CardDescription>حالة المخاطر المؤسسية الحالية</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium">مخاطر عالية</span>
                    </div>
                    <Badge variant="destructive">{kpiData.highRisks}</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-orange-500" />
                      <span className="text-sm font-medium">مخاطر متوسطة</span>
                    </div>
                    <Badge className="bg-orange-100 text-orange-700">{kpiData.mediumRisks}</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">مخاطر منخفضة</span>
                    </div>
                    <Badge className="bg-green-100 text-green-700">{kpiData.lowRisks}</Badge>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => navigate("/quality-development/risk-compliance")}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  عرض التفاصيل
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {improvementMetrics.map((metric, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-base">{metric.title}</CardTitle>
                  <CardDescription>{metric.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold">{metric.value}</span>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(metric.trend)}
                      <span className={`text-sm ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {metric.change}
                      </span>
                    </div>
                  </div>
                  <Progress value={(metric.value / metric.maxValue) * 100} className="h-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>الأنشطة الأخيرة</CardTitle>
              <CardDescription>آخر الأنشطة والتحديثات في النظام</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 p-4 border border-border rounded-lg">
                    <div className={`p-2 rounded-full bg-gray-100`}>
                      <activity.icon className={`h-4 w-4 ${activity.color}`} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">{activity.title}</h4>
                        {getStatusBadge(activity.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(action.action)}>
                <CardHeader className="text-center">
                  <div className={`w-12 h-12 ${action.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-base">{action.title}</CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    إنشاء جديد
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}