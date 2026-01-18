import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { 
  Brain, 
  Bot, 
  FileText, 
  TrendingUp,
  Search,
  Lightbulb,
  Cpu,
  Zap,
  Sparkles,
  Activity,
  BarChart3,
  MessageSquare,
  Upload,
  Download,
  Settings,
  RefreshCw
} from "lucide-react";

// AI Components
import AIAssistant from "@/components/HCM/AIAssistant";
import DocumentProcessor from "@/components/HCM/DocumentProcessor";
import AIAnalytics from "@/components/HCM/AIAnalytics";
import SmartSearch from "@/components/HCM/SmartSearch";
import SmartRecommendations from "@/components/HCM/SmartRecommendations";

const AIManagement = () => {
  const [activeTab, setActiveTab] = useState("assistant");
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

  // Sample employees data for AI components
  const employees = [
    { 
      id: 1, 
      empId: "EMP001",
      photo: "/placeholder.svg",
      name: "أحمد محمد العتيبي",
      nameEn: "Ahmed Mohammed Al-Otaibi",
      gender: "ذكر",
      nationality: "مصري",
      nationalId: "1234567890",
      birthDate: "1985-03-15",
      maritalStatus: "متزوج",
      position: "فني صيانة سيارات", 
      department: "الصيانة",
      branch: "الفرع الرئيسي",
      manager: "محمد السعيد",
      hireDate: "2020-01-15",
      status: "نشط",
      fileStatus: "مكتمل",
      completionPercentage: 95,
      phone: "+966501234567",
      email: "ahmed@company.com",
      address: "الرياض، حي الملقا، شارع الملك فهد",
      emergencyContact: "فاطمة العتيبي - الزوجة - +966501234568",
      basicSalary: 8500,
      allowances: 2000,
      bankAccount: "SA1234567890123456789012",
      documentsCount: 12,
      passportNumber: "A12345678",
      passportExpiry: "2026-05-20",
      residenceId: "2345678901",
      residenceExpiry: "2025-03-10",
      workPermit: "WP123456",
      workPermitExpiry: "2025-12-31",
      vacationBalance: 25,
      performanceRating: 4.5,
      assetsCount: 3
    },
    { 
      id: 2, 
      empId: "EMP002",
      photo: "/placeholder.svg",
      name: "فاطمة علي الأحمدي",
      nameEn: "Fatima Ali Al-Ahmadi",
      gender: "أنثى",
      nationality: "مصرية",
      nationalId: "1234567891",
      birthDate: "1992-07-22",
      maritalStatus: "أعزب",
      position: "مستقبل عملاء", 
      department: "الاستقبال",
      branch: "الفرع الرئيسي",
      manager: "نورا الشمري",
      hireDate: "2021-03-10",
      status: "نشط",
      fileStatus: "ناقص",
      completionPercentage: 78,
      phone: "+966501234568",
      email: "fatima@company.com",
      address: "الرياض، حي النخيل، شارع العليا",
      emergencyContact: "علي الأحمدي - الوالد - +966501234569",
      basicSalary: 6000,
      allowances: 1500,
      bankAccount: "SA1234567890123456789013",
      documentsCount: 8,
      passportNumber: "B87654321",
      passportExpiry: "2025-12-15",
      residenceId: "2345678902",
      residenceExpiry: "2024-11-20",
      workPermit: "WP123457",
      workPermitExpiry: "2024-10-15",
      vacationBalance: 18,
      performanceRating: 4.2,
      assetsCount: 2
    },
    { 
      id: 3, 
      empId: "EMP003",
      photo: "/placeholder.svg",
      name: "محمد سعد القحطاني",
      nameEn: "Mohammed Saad Al-Qahtani",
      gender: "ذكر",
      nationality: "مصري",
      nationalId: "1234567892",
      birthDate: "1988-11-08",
      maritalStatus: "متزوج",
      position: "محاسب", 
      department: "المالية",
      branch: "الفرع الرئيسي",
      manager: "سارة العتيبي",
      hireDate: "2019-06-20",
      status: "نشط",
      fileStatus: "مكتمل",
      completionPercentage: 100,
      phone: "+966501234570",
      email: "mohammed@company.com",
      address: "الرياض، حي المروج، شارع التحلية",
      emergencyContact: "هند القحطاني - الزوجة - +966501234571",
      basicSalary: 12000,
      allowances: 3000,
      bankAccount: "SA1234567890123456789014",
      documentsCount: 15,
      passportNumber: "C13579246",
      passportExpiry: "2027-01-30",
      residenceId: "2345678903",
      residenceExpiry: "2026-08-15",
      workPermit: "WP123458",
      workPermitExpiry: "2026-12-31",
      vacationBalance: 22,
      performanceRating: 4.8,
      assetsCount: 5
    },
  ];

  const aiFeatures = [
    { 
      title: "المساعد الذكي", 
      description: "مساعد ذكي للإجابة على الاستفسارات وتقديم المساعدة",
      icon: Bot, 
      color: "text-blue-600", 
      bg: "bg-blue-50",
      status: "نشط",
      usage: "استخدام عالي"
    },
    { 
      title: "معالج الوثائق", 
      description: "استخراج وتحليل البيانات من الوثائق تلقائياً",
      icon: FileText, 
      color: "text-green-600", 
      bg: "bg-green-50",
      status: "نشط",
      usage: "استخدام متوسط"
    },
    { 
      title: "التحليلات الذكية", 
      description: "تحليل البيانات والتنبؤ بالاتجاهات",
      icon: TrendingUp, 
      color: "text-purple-600", 
      bg: "bg-purple-50",
      status: "نشط",
      usage: "استخدام منخفض"
    },
    { 
      title: "البحث الذكي", 
      description: "بحث متقدم مع اقتراحات ذكية",
      icon: Search, 
      color: "text-orange-600", 
      bg: "bg-orange-50",
      status: "نشط",
      usage: "استخدام عالي"
    },
    { 
      title: "التوصيات الذكية", 
      description: "اقتراحات مخصصة بناءً على البيانات",
      icon: Lightbulb, 
      color: "text-yellow-600", 
      bg: "bg-yellow-50",
      status: "تجريبي",
      usage: "استخدام منخفض"
    },
  ];

  const handleViewEmployee = (employee: any) => {
    setSelectedEmployee(employee);
    toast({
      title: "عرض الملف الوظيفي",
      description: `جاري عرض ملف ${employee.name}`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 p-4 md:p-6 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-200/30 to-blue-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-100/20 to-purple-100/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "4s" }}></div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* Enhanced Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-white/50 shadow-lg">
                  <Brain className="w-10 h-10 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
              نظام الذكاء الاصطناعي للموارد البشرية
            </h1>
            <p className="text-slate-700 text-lg leading-relaxed max-w-2xl">
              إدارة وتشغيل مكونات الذكاء الاصطناعي المتقدمة لتحسين العمليات وزيادة الكفاءة
            </p>
            <div className="flex items-center gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>متصل</span>
              </div>
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4" />
                <span>أداء عالي</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>5 نماذج نشطة</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="relative group overflow-hidden bg-white/50 backdrop-blur-sm border-blue-200 hover:border-blue-300 hover:bg-blue-50/50 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
              <Settings className="w-5 h-5 mr-2 relative z-10 group-hover:rotate-90 transition-transform duration-300" />
              <span className="relative z-10">إعدادات الذكاء الاصطناعي</span>
            </Button>
            <Button
              className="relative group overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl border-0"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-100 transition-transform duration-700"></div>
              <Zap className="w-5 h-5 mr-2 relative z-10 group-hover:animate-pulse" />
              <span className="relative z-10">تحديث النماذج</span>
            </Button>
          </div>
        </div>

        {/* Enhanced AI Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {aiFeatures.map((feature, index) => (
            <Card 
              key={index} 
              className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl hover:-translate-y-3 transition-all duration-700 cursor-pointer animate-fade-in bg-white/90 backdrop-blur-sm"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Floating Particles Effect */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-400/20 rounded-full animate-ping group-hover:animate-pulse"></div>
                <div className="absolute top-1/2 -left-1 w-2 h-2 bg-purple-400/20 rounded-full animate-ping" style={{ animationDelay: "1s" }}></div>
                <div className="absolute -bottom-1 left-1/2 w-3 h-3 bg-blue-300/20 rounded-full animate-ping" style={{ animationDelay: "2s" }}></div>
              </div>

              <CardContent className="relative z-10 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="relative">
                    <div className={`p-3 rounded-xl ${feature.bg} group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-lg group-hover:shadow-xl`}>
                      <feature.icon className={`h-6 w-6 ${feature.color} group-hover:animate-bounce`} />
                    </div>
                    {/* Glow Effect */}
                    <div className={`absolute inset-0 ${feature.bg} rounded-xl blur-sm opacity-0 group-hover:opacity-60 transition-opacity duration-500`}></div>
                  </div>
                  <Badge 
                    variant={feature.status === "نشط" ? "default" : "secondary"} 
                    className={`text-xs px-3 py-1 rounded-full font-medium ${
                      feature.status === "نشط" 
                        ? "bg-green-100 text-green-700 group-hover:bg-green-200" 
                        : "bg-orange-100 text-orange-700 group-hover:bg-orange-200"
                    } transition-colors duration-300`}
                  >
                    {feature.status}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-700 group-hover:scale-105 transition-all duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed group-hover:text-slate-800 transition-colors duration-300">
                    {feature.description}
                  </p>
                  
                  {/* Usage Indicator with Animation */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Activity className="w-4 h-4 text-green-500 group-hover:animate-pulse" />
                        <div className="absolute inset-0 bg-green-400 rounded-full blur-sm opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                      </div>
                      <span className="text-sm text-green-600 font-medium group-hover:text-green-700 transition-colors duration-300">
                        {feature.usage}
                      </span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r transition-all duration-1000 group-hover:w-full ${
                          feature.usage === "استخدام عالي" ? "from-green-400 to-green-600 w-4/5" :
                          feature.usage === "استخدام متوسط" ? "from-yellow-400 to-yellow-600 w-3/5" :
                          "from-blue-400 to-blue-600 w-2/5"
                        }`}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
              
              {/* Border Glow Effect */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-200/50 rounded-lg transition-all duration-500"></div>
            </Card>
          ))}
        </div>

        {/* Enhanced Main AI Components */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8 bg-white/90 backdrop-blur-sm border border-white/20 shadow-lg rounded-2xl p-2">
            <TabsTrigger 
              value="assistant" 
              className="flex items-center gap-2 px-4 py-3 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <Bot className="w-5 h-5" />
              <span className="hidden sm:inline">المساعد الذكي</span>
            </TabsTrigger>
            <TabsTrigger 
              value="processing" 
              className="flex items-center gap-2 px-4 py-3 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <FileText className="w-5 h-5" />
              <span className="hidden sm:inline">معالج الوثائق</span>
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="flex items-center gap-2 px-4 py-3 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <BarChart3 className="w-5 h-5" />
              <span className="hidden sm:inline">التحليلات الذكية</span>
            </TabsTrigger>
            <TabsTrigger 
              value="search" 
              className="flex items-center gap-2 px-4 py-3 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <Search className="w-5 h-5" />
              <span className="hidden sm:inline">البحث الذكي</span>
            </TabsTrigger>
            <TabsTrigger 
              value="recommendations" 
              className="flex items-center gap-2 px-4 py-3 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-yellow-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <Sparkles className="w-5 h-5" />
              <span className="hidden sm:inline">التوصيات الذكية</span>
            </TabsTrigger>
          </TabsList>

          {/* Enhanced AI Assistant Tab */}
          <TabsContent value="assistant" className="space-y-6 animate-fade-in">
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-white via-blue-50/20 to-white backdrop-blur-sm overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
              <CardHeader className="relative z-10 bg-gradient-to-r from-blue-50/50 to-transparent border-b border-blue-100/50">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  المساعد الذكي للموارد البشرية
                </CardTitle>
                <CardDescription className="text-slate-700 text-base leading-relaxed mt-2">
                  مساعد ذكي متقدم للإجابة على الاستفسارات وتقديم المساعدة في إدارة الموارد البشرية
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10 p-6">
                <AIAssistant />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Document Processing Tab */}
          <TabsContent value="processing" className="space-y-6 animate-fade-in">
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-white via-green-50/20 to-white backdrop-blur-sm overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5"></div>
              <CardHeader className="relative z-10 bg-gradient-to-r from-green-50/50 to-transparent border-b border-green-100/50">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  معالج الوثائق بالذكاء الاصطناعي
                </CardTitle>
                <CardDescription className="text-slate-700 text-base leading-relaxed mt-2">
                  استخراج وتحليل البيانات من الوثائق تلقائياً باستخدام تقنيات الذكاء الاصطناعي المتقدمة
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10 p-6">
                <DocumentProcessor />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced AI Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6 animate-fade-in">
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-white via-purple-50/20 to-white backdrop-blur-sm overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-violet-500/5"></div>
              <CardHeader className="relative z-10 bg-gradient-to-r from-purple-50/50 to-transparent border-b border-purple-100/50">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  التحليلات والتنبؤات الذكية
                </CardTitle>
                <CardDescription className="text-slate-700 text-base leading-relaxed mt-2">
                  تحليل البيانات والتنبؤ بالاتجاهات باستخدام خوارزميات التعلم الآلي
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10 p-6">
                <AIAnalytics />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Smart Search Tab */}
          <TabsContent value="search" className="space-y-6 animate-fade-in">
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-white via-orange-50/20 to-white backdrop-blur-sm overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-amber-500/5"></div>
              <CardHeader className="relative z-10 bg-gradient-to-r from-orange-50/50 to-transparent border-b border-orange-100/50">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg">
                    <Search className="w-6 h-6 text-white" />
                  </div>
                  البحث الذكي المتقدم
                </CardTitle>
                <CardDescription className="text-slate-700 text-base leading-relaxed mt-2">
                  بحث متطور مع اقتراحات ذكية وفهم اللغة الطبيعية
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10 p-6">
                <SmartSearch 
                  employees={employees} 
                  onEmployeeSelect={handleViewEmployee}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Smart Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-6 animate-fade-in">
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-white via-yellow-50/20 to-white backdrop-blur-sm overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-amber-500/5"></div>
              <CardHeader className="relative z-10 bg-gradient-to-r from-yellow-50/50 to-transparent border-b border-yellow-100/50">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-800 bg-clip-text text-transparent flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl shadow-lg">
                    <Lightbulb className="w-6 h-6 text-white" />
                  </div>
                  التوصيات والاقتراحات الذكية
                </CardTitle>
                <CardDescription className="text-slate-700 text-base leading-relaxed mt-2">
                  اقتراحات مخصصة وتوصيات ذكية بناءً على تحليل البيانات
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10 p-6">
                <SmartRecommendations employees={employees} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AIManagement;