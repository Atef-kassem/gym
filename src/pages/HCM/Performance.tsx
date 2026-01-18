import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { toast } from "@/hooks/use-toast";
import { 
  TrendingUp, 
  Search, 
  Filter, 
  Award, 
  Target,
  Star,
  Gift,
  BarChart3,
  Users,
  DollarSign,
  CheckCircle,
  XCircle,
  PlusCircle
} from "lucide-react";

const Performance = () => {
  const [activeTab, setActiveTab] = useState("evaluations");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePerformanceReports = () => {
    toast({
      title: "تقارير الأداء",
      description: "جاري فتح تقارير الأداء التفصيلية...",
    });
  };

  const handleNewEvaluation = () => {
    setIsLoading(true);
    toast({
      title: "تقييم جديد",
      description: "جاري فتح نموذج التقييم...",
    });
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "تم بنجاح ✅",
        description: "تم فتح نموذج التقييم",
      });
    }, 1500);
  };

  const handleViewPerformance = (name: string) => {
    toast({
      title: "عرض الأداء",
      description: `جاري عرض تفاصيل أداء ${name}`,
    });
  };

  const handleGiveIncentive = (name: string) => {
    toast({
      title: "منح حافز",
      description: `جاري فتح نموذج منح حافز لـ ${name}`,
    });
  };

  const handleApproveIncentive = (employee: string) => {
    toast({
      title: "تمت الموافقة ✅",
      description: `تمت الموافقة على حافز ${employee}`,
    });
  };

  const handleRejectIncentive = (employee: string) => {
    toast({
      title: "تم الرفض ❌",
      description: `تم رفض حافز ${employee}`,
    });
  };

  const handleViewAnalytics = (type: string) => {
    toast({
      title: "عرض التحليل",
      description: `جاري عرض ${type}...`,
    });
  };

  const stats = [
    { title: "متوسط تقييم الأداء", value: "4.2/5", icon: Star, color: "text-yellow-600", bg: "bg-yellow-50" },
    { title: "التقييمات المكتملة", value: "285/324", icon: Target, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "حوافز مصروفة هذا الشهر", value: "125,000 جنيه", icon: DollarSign, color: "text-green-600", bg: "bg-green-50" },
    { title: "موظفين بأداء ممتاز", value: "12", icon: Award, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  const evaluations = [
    { 
      id: 1, 
      empId: "EMP001",
      name: "أحمد محمد العتيبي", 
      position: "فني صيانة",
      department: "الصيانة",
      lastEvaluation: "2024-01-15",
      overallScore: 4.5,
      kpiScores: {
        quality: 90,
        speed: 85,
        customerSatisfaction: 95,
        attendance: 88
      },
      status: "ممتاز"
    },
    { 
      id: 2, 
      empId: "EMP002",
      name: "فاطمة علي الأحمدي", 
      position: "مستقبل عملاء",
      department: "الاستقبال",
      lastEvaluation: "2024-01-20",
      overallScore: 4.2,
      kpiScores: {
        quality: 88,
        speed: 82,
        customerSatisfaction: 92,
        attendance: 85
      },
      status: "جيد جداً"
    },
    { 
      id: 3, 
      empId: "EMP003",
      name: "محمد سعد القحطاني", 
      position: "محاسب",
      department: "المالية",
      lastEvaluation: "2024-01-10",
      overallScore: 3.8,
      kpiScores: {
        quality: 85,
        speed: 75,
        customerSatisfaction: 80,
        attendance: 90
      },
      status: "جيد"
    },
  ];

  const incentives = [
    { 
      id: 1,
      employee: "أحمد محمد العتيبي",
      type: "حافز أداء",
      amount: 2000,
      reason: "تميز في خدمة العملاء",
      date: "2024-01-25",
      status: "مصروف"
    },
    { 
      id: 2,
      employee: "نورا خالد الشمري",
      type: "عمولة مبيعات",
      amount: 1500,
      reason: "تحقيق هدف المبيعات",
      date: "2024-01-26",
      status: "معلق"
    },
    { 
      id: 3,
      employee: "علي محمد الزهراني",
      type: "مكافأة حضور",
      amount: 500,
      reason: "عدم غياب لمدة 3 أشهر",
      date: "2024-01-24",
      status: "مصروف"
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "ممتاز": { color: "bg-green-100 text-green-800" },
      "جيد جداً": { color: "bg-blue-100 text-blue-800" },
      "جيد": { color: "bg-yellow-100 text-yellow-800" },
      "يحتاج تحسين": { color: "bg-orange-100 text-orange-800" },
      "ضعيف": { color: "bg-red-100 text-red-800" },
      "مصروف": { color: "bg-green-100 text-green-800" },
      "معلق": { color: "bg-orange-100 text-orange-800" },
      "مرفوض": { color: "bg-red-100 text-red-800" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig["جيد"];
    return <Badge className={config.color}>{status}</Badge>;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">تقييم الأداء والحوافز</h1>
            <p className="text-slate-600 mt-2">قياس الأداء وإدارة نظام الحوافز</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handlePerformanceReports}
              className="hover:scale-105 hover:bg-purple-50 transition-all duration-300"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              تقارير الأداء
            </Button>
            <Button 
              onClick={handleNewEvaluation}
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Award className="w-4 h-4 mr-2 animate-bounce" />
              )}
              تقييم جديد
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card 
              key={index} 
              className="group border-0 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer animate-fade-in bg-gradient-to-br from-white to-slate-50/30 backdrop-blur-sm"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 group-hover:text-slate-800 transition-colors duration-300">{stat.title}</p>
                    <p className="text-2xl font-bold text-slate-900 mt-2 group-hover:scale-110 transition-transform duration-300">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bg} group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                    <stat.icon className={`h-6 w-6 ${stat.color} group-hover:animate-pulse`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-slate-900">
                  إدارة الأداء والحوافز
                </CardTitle>
                <CardDescription>
                  متابعة تقييمات الأداء ونظام الحوافز
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input 
                    placeholder="البحث..." 
                    className="pl-10 w-64" 
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="evaluations">تقييمات الأداء</TabsTrigger>
                <TabsTrigger value="incentives">الحوافز والمكافآت</TabsTrigger>
                <TabsTrigger value="analytics">التحليلات</TabsTrigger>
              </TabsList>

              <TabsContent value="evaluations" className="mt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الرقم الوظيفي</TableHead>
                      <TableHead>اسم الموظف</TableHead>
                      <TableHead>المسمى الوظيفي</TableHead>
                      <TableHead>آخر تقييم</TableHead>
                      <TableHead>النتيجة الإجمالية</TableHead>
                      <TableHead>مؤشرات الأداء</TableHead>
                      <TableHead>التقدير</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {evaluations.map((evaluation) => (
                      <TableRow key={evaluation.id}>
                        <TableCell className="font-medium">{evaluation.empId}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{evaluation.name}</p>
                            <p className="text-sm text-slate-600">{evaluation.department}</p>
                          </div>
                        </TableCell>
                        <TableCell>{evaluation.position}</TableCell>
                        <TableCell>{evaluation.lastEvaluation}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-500" />
                            {evaluation.overallScore}/5
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs w-16">الجودة:</span>
                              <Progress value={evaluation.kpiScores.quality} className="h-2 flex-1" />
                              <span className={`text-xs font-medium ${getScoreColor(evaluation.kpiScores.quality)}`}>
                                {evaluation.kpiScores.quality}%
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs w-16">السرعة:</span>
                              <Progress value={evaluation.kpiScores.speed} className="h-2 flex-1" />
                              <span className={`text-xs font-medium ${getScoreColor(evaluation.kpiScores.speed)}`}>
                                {evaluation.kpiScores.speed}%
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(evaluation.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleViewPerformance(evaluation.name)}
                              className="hover:bg-purple-50 hover:text-purple-600 hover:scale-110 transition-all duration-300"
                            >
                              <TrendingUp className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleGiveIncentive(evaluation.name)}
                              className="hover:bg-green-50 hover:text-green-600 hover:scale-110 transition-all duration-300"
                            >
                              <Gift className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="incentives" className="mt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>اسم الموظف</TableHead>
                      <TableHead>نوع الحافز</TableHead>
                      <TableHead>المبلغ</TableHead>
                      <TableHead>السبب</TableHead>
                      <TableHead>التاريخ</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {incentives.map((incentive) => (
                      <TableRow key={incentive.id}>
                        <TableCell className="font-medium">{incentive.employee}</TableCell>
                        <TableCell>{incentive.type}</TableCell>
                        <TableCell className="text-green-600 font-medium">
                          {incentive.amount.toLocaleString()} جنيه
                        </TableCell>
                        <TableCell>{incentive.reason}</TableCell>
                        <TableCell>{incentive.date}</TableCell>
                        <TableCell>{getStatusBadge(incentive.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-green-600 hover:bg-green-50 hover:scale-110 transition-all duration-300"
                              onClick={() => handleApproveIncentive(incentive.employee)}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              موافق
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-600 hover:bg-red-50 hover:scale-110 transition-all duration-300"
                              onClick={() => handleRejectIncentive(incentive.employee)}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              رفض
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="analytics" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="group border border-slate-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer bg-gradient-to-br from-white to-purple-50/30 animate-fade-in">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-xl bg-purple-50 group-hover:scale-110 group-hover:bg-purple-100 transition-all duration-300">
                          <BarChart3 className="h-6 w-6 text-purple-600 group-hover:animate-pulse" />
                        </div>
                        <h3 className="font-bold text-slate-900 group-hover:text-purple-800 transition-colors duration-300">تحليل الأداء</h3>
                      </div>
                      <p className="text-sm text-slate-600 mb-4 group-hover:text-slate-700 transition-colors duration-300">مؤشرات الأداء حسب القسم</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full group-hover:bg-purple-50 group-hover:border-purple-300 hover:scale-105 transition-all duration-300"
                        onClick={() => handleViewAnalytics("تحليل الأداء")}
                      >
                        <BarChart3 className="w-4 h-4 mr-2" />
                        عرض التحليل
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-xl bg-green-50">
                          <Award className="h-6 w-6 text-green-600" />
                        </div>
                        <h3 className="font-bold text-slate-900">تقرير الحوافز</h3>
                      </div>
                      <p className="text-sm text-slate-600 mb-4">إجمالي الحوافز المصروفة</p>
                      <Button variant="outline" size="sm" className="w-full">
                        عرض التقرير
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-xl bg-blue-50">
                          <Users className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="font-bold text-slate-900">الموظف المثالي</h3>
                      </div>
                      <p className="text-sm text-slate-600 mb-4">أفضل الموظفين أداءً</p>
                      <Button variant="outline" size="sm" className="w-full">
                        عرض القائمة
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Performance;