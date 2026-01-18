import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  UserPlus, 
  DollarSign, 
  Clock, 
  TrendingUp, 
  FileText,
  LogOut,
  Settings,
  Grid3X3,
  Activity,
  Brain,
  BarChart3
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const HCMDashboard = () => {
  const navigate = useNavigate();

  const handleModuleClick = (route: string, moduleName: string) => {
    // إضافة تأثير loading قبل التنقل
    const button = document.querySelector(`[data-module="${moduleName}"]`);
    if (button) {
      button.classList.add('animate-pulse');
      setTimeout(() => {
        navigate(route);
      }, 300);
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'add-employee':
        navigate('/hcm/employee-files');
        break;
      case 'view-payroll':
        navigate('/hcm/payroll');
        break;
      case 'attendance-report':
        navigate('/hcm/attendance');
        break;
      case 'performance-review':
        navigate('/hcm/performance');
        break;
      case 'capital-management':
        navigate('/hcm/capital-management');
        break;
      default:
        console.log(`Action: ${action}`);
    }
  };

  const stats = [
    { title: "إجمالي الموظفين", value: "324", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "التوظيف الجديد هذا الشهر", value: "12", icon: UserPlus, color: "text-green-600", bg: "bg-green-50" },
    { title: "إجمالي الرواتب", value: "2,450,000 جنيه", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "الإجازات المعلقة", value: "23", icon: Clock, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  const modules = [
    {
      title: "وحدة التوظيف",
      description: "إدارة عمليات التوظيف والاستقطاب",
      icon: UserPlus,
      route: "/hcm/recruitment",
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      features: ["استقطاب المواهب", "تقييم المتقدمين", "إدارة المقابلات"]
    },
    {
      title: "الملف الوظيفي الشامل",
      description: "إدارة ملفات الموظفين والوثائق",
      icon: FileText,
      route: "/hcm/employee-files",
      color: "bg-gradient-to-br from-green-500 to-green-600",
      features: ["البيانات الشخصية", "الوثائق", "السجل الوظيفي"]
    },
    {
      title: "إدارة الرواتب",
      description: "نظام الرواتب ومسيرات الأجور",
      icon: DollarSign,
      route: "/hcm/payroll",
      color: "bg-gradient-to-br from-emerald-500 to-emerald-600",
      features: ["احتساب الرواتب", "حماية الأجور", "التأمينات"]
    },
    {
      title: "الحضور والإجازات",
      description: "متابعة الحضور وإدارة الإجازات",
      icon: Clock,
      route: "/hcm/attendance",
      color: "bg-gradient-to-br from-orange-500 to-orange-600",
      features: ["تسجيل الحضور", "طلبات الإجازة", "العمل الإضافي"]
    },
    {
      title: "تقييم الأداء",
      description: "قياس الأداء والحوافز",
      icon: TrendingUp,
      route: "/hcm/performance",
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
      features: ["مؤشرات الأداء", "الحوافز", "التقييم الدوري"]
    },
    {
      title: "إخلاء الطرف",
      description: "إدارة نهاية الخدمة",
      icon: LogOut,
      route: "/hcm/offboarding",
      color: "bg-gradient-to-br from-red-500 to-red-600",
      features: ["حساب المستحقات", "إخلاء الطرف", "تسليم العهد"]
    },
    {
      title: "الخدمة الذاتية",
      description: "بوابة الموظفين الذاتية",
      icon: Settings,
      route: "/hcm/self-service",
      color: "bg-gradient-to-br from-indigo-500 to-indigo-600",
      features: ["طلبات الموظف", "تحديث البيانات", "قسائم الراتب"]
    },
    {
      title: "إدارة ج.م المال الذكية",
      description: "نظام ذكي متطور لإدارة ج.م المال مدعوم بالذكاء الاصطناعي",
      icon: Brain,
      route: "/hcm/capital-management",
      color: "bg-gradient-to-br from-cyan-500 to-blue-600",
      features: ["تحليل ذكي", "توقعات مالية", "إدارة المخاطر"],
      badge: "جديد"
    }
  ];

  const recentActivities = [
    { action: "تم توظيف موظف جديد", employee: "أحمد محمد العتيبي", time: "منذ ساعة", type: "recruitment" },
    { action: "طلب إجازة معلق", employee: "فاطمة علي الأحمدي", time: "منذ ساعتين", type: "leave" },
    { action: "تم صرف راتب", employee: "محمد سعد القحطاني", time: "منذ 3 ساعات", type: "payroll" },
    { action: "تقييم أداء جديد", employee: "نورا خالد الشمري", time: "منذ 4 ساعات", type: "performance" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              إدارة ج.م المال البشري
            </h1>
            <p className="text-slate-600 mt-2">
              نظام شامل لإدارة الموارد البشرية والموظفين
            </p>
          </div>
        </div>

        {/* Enhanced Stats Cards with Advanced Visual Effects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card 
              key={index} 
              className="group relative border-0 shadow-elegant hover:shadow-glow hover:-translate-y-3 transition-all duration-500 cursor-pointer bg-card overflow-hidden animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Animated Background Effects */}
              <div className={`absolute inset-0 ${stat.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>
              <div className={`absolute -inset-1 bg-gradient-to-br ${stat.color.replace('text-', 'from-')} to-transparent rounded-lg opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-500`}></div>
              
              {/* Floating Particles */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                <div className="absolute top-4 right-4 w-2 h-2 bg-primary/40 rounded-full animate-ping"></div>
                <div className="absolute bottom-6 left-6 w-1 h-1 bg-secondary/60 rounded-full animate-pulse"></div>
                <div className="absolute top-1/2 left-4 w-1.5 h-1.5 bg-accent/50 rounded-full animate-bounce"></div>
              </div>
              
              <CardContent className="relative p-6 z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors duration-300">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-foreground mt-2 group-hover:scale-110 group-hover:text-primary transition-all duration-300">
                      {stat.value}
                    </p>
                  </div>
                  <div className="relative">
                    <div className={`p-3 rounded-xl ${stat.bg} group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-md group-hover:shadow-glow`}>
                      <stat.icon className={`h-6 w-6 ${stat.color} group-hover:animate-pulse transition-colors duration-300`} strokeWidth={2.5} />
                    </div>
                    {/* Rotating Ring */}
                    <div className={`absolute inset-0 rounded-xl border-2 ${stat.color.replace('text-', 'border-')} opacity-0 group-hover:opacity-100 group-hover:animate-spin transition-opacity duration-500`}></div>
                  </div>
                </div>
                
                {/* Progress Bar Animation */}
                <div className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${stat.color.replace('text-', 'from-')} to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs Section */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-900">
              نظرة عامة
            </CardTitle>
            <CardDescription>
              وحدات النظام والنشاطات الأخيرة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="modules" className="w-full">
              {/* Enhanced TabsList with Advanced Visual Effects */}
              <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-muted/50 to-muted/30 p-1 rounded-xl shadow-elegant border border-border/40 backdrop-blur-sm">
                <TabsTrigger 
                  value="modules" 
                  className="group relative flex items-center gap-2 px-6 py-3 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-white data-[state=active]:shadow-glow transition-all duration-500 hover:scale-105 data-[state=active]:scale-105 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 group-data-[state=active]:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-data-[state=active]:translate-x-full transition-transform duration-1000"></div>
                  <div className="absolute top-1 right-1 w-1 h-1 bg-primary/60 rounded-full opacity-0 group-data-[state=active]:opacity-100 group-data-[state=active]:animate-ping"></div>
                  <Grid3X3 className="h-4 w-4 relative z-10 group-data-[state=active]:animate-pulse" />
                  <span className="relative z-10">وحدات النظام</span>
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-primary to-primary/60 scale-x-0 group-data-[state=active]:scale-x-100 transition-transform duration-500 origin-center"></div>
                </TabsTrigger>
                <TabsTrigger 
                  value="activities" 
                  className="group relative flex items-center gap-2 px-6 py-3 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-secondary data-[state=active]:to-secondary/80 data-[state=active]:text-white data-[state=active]:shadow-glow transition-all duration-500 hover:scale-105 data-[state=active]:scale-105 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-secondary/5 opacity-0 group-hover:opacity-100 group-data-[state=active]:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-data-[state=active]:translate-x-full transition-transform duration-1000"></div>
                  <div className="absolute top-1 right-1 w-1 h-1 bg-secondary/60 rounded-full opacity-0 group-data-[state=active]:opacity-100 group-data-[state=active]:animate-ping"></div>
                  <Activity className="h-4 w-4 relative z-10 group-data-[state=active]:animate-pulse" />
                  النشاطات الأخيرة
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="modules" className="mt-6 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {modules.map((module, index) => (
                    <Card 
                      key={index}
                      data-module={module.title}
                      className="border border-slate-200 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 transition-all duration-500 cursor-pointer group relative overflow-hidden animate-fade-in"
                      style={{ animationDelay: `${index * 150}ms` }}
                      onClick={() => handleModuleClick(module.route, module.title)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      }}
                    >
                      {/* Background gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0" />
                      
                       <CardContent className="p-6 relative z-10">
                         <div className="flex items-start justify-between mb-4">
                           <div className={`p-3 rounded-xl ${module.color} text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg group-hover:shadow-xl`}>
                             <module.icon className="h-6 w-6 group-hover:animate-pulse" strokeWidth={2.5} />
                           </div>
                           <div className="flex items-center gap-2">
                             {module.badge && (
                               <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs animate-pulse">
                                 {module.badge}
                               </Badge>
                             )}
                             <Button 
                               variant="ghost" 
                               size="sm"
                               className="opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/20 hover:scale-110"
                               onClick={(e) => {
                                 e.stopPropagation();
                                 handleModuleClick(module.route, module.title);
                               }}
                             >
                               <span className="font-semibold">فتح</span>
                             </Button>
                           </div>
                         </div>
                        <h3 className="font-bold text-slate-900 mb-2 group-hover:text-slate-800 transition-colors">
                          {module.title}
                        </h3>
                        <p className="text-sm text-slate-600 mb-3 group-hover:text-slate-700 transition-colors">
                          {module.description}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {module.features.map((feature, idx) => (
                            <Badge 
                              key={idx} 
                              variant="secondary" 
                              className="text-xs hover:scale-105 transition-transform duration-200 group-hover:bg-slate-200"
                            >
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {/* Quick Actions */}
                <div className="mt-8 p-6 bg-gradient-to-r from-slate-50 to-white rounded-xl border border-slate-200">
                  <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    إجراءات سريعة
                  </h4>
                   <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                     <Button
                       variant="outline"
                       className="flex flex-col items-center gap-2 h-auto py-4 hover:bg-blue-50 hover:border-blue-300 hover:scale-105 transition-all duration-300 group"
                       onClick={() => handleQuickAction('add-employee')}
                     >
                       <UserPlus className="h-5 w-5 text-blue-600 group-hover:animate-bounce" />
                       <span className="text-sm font-medium">إضافة موظف</span>
                     </Button>
                     <Button
                       variant="outline"
                       className="flex flex-col items-center gap-2 h-auto py-4 hover:bg-green-50 hover:border-green-300 hover:scale-105 transition-all duration-300 group"
                       onClick={() => handleQuickAction('view-payroll')}
                     >
                       <DollarSign className="h-5 w-5 text-green-600 group-hover:animate-bounce" />
                       <span className="text-sm font-medium">عرض الرواتب</span>
                     </Button>
                     <Button
                       variant="outline"
                       className="flex flex-col items-center gap-2 h-auto py-4 hover:bg-orange-50 hover:border-orange-300 hover:scale-105 transition-all duration-300 group"
                       onClick={() => handleQuickAction('attendance-report')}
                     >
                       <Clock className="h-5 w-5 text-orange-600 group-hover:animate-bounce" />
                       <span className="text-sm font-medium">تقرير الحضور</span>
                     </Button>
                     <Button
                       variant="outline"
                       className="flex flex-col items-center gap-2 h-auto py-4 hover:bg-purple-50 hover:border-purple-300 hover:scale-105 transition-all duration-300 group"
                       onClick={() => handleQuickAction('performance-review')}
                     >
                       <TrendingUp className="h-5 w-5 text-purple-600 group-hover:animate-bounce" />
                       <span className="text-sm font-medium">تقييم الأداء</span>
                     </Button>
                     <Button
                       variant="outline"
                       className="flex flex-col items-center gap-2 h-auto py-4 hover:bg-cyan-50 hover:border-cyan-300 hover:scale-105 transition-all duration-300 group"
                       onClick={() => handleQuickAction('capital-management')}
                     >
                       <Brain className="h-5 w-5 text-cyan-600 group-hover:animate-bounce" />
                       <span className="text-sm font-medium">إدارة ج.م المال</span>
                     </Button>
                   </div>
                </div>
              </TabsContent>
              
              <TabsContent value="activities" className="mt-6 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recentActivities.map((activity, index) => (
                    <Card 
                      key={index} 
                      className="border border-slate-200 hover:shadow-xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 cursor-pointer group animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <CardContent className="p-6 relative">
                        {/* Notification pulse effect */}
                        <div className={`absolute top-2 right-2 w-2 h-2 rounded-full animate-pulse ${
                          activity.type === 'recruitment' ? 'bg-blue-500' :
                          activity.type === 'leave' ? 'bg-orange-500' :
                          activity.type === 'payroll' ? 'bg-green-500' : 'bg-purple-500'
                        }`} />
                        
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
                            activity.type === 'recruitment' ? 'bg-blue-100 text-blue-600' :
                            activity.type === 'leave' ? 'bg-orange-100 text-orange-600' :
                            activity.type === 'payroll' ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'
                          }`}>
                            {activity.type === 'recruitment' && <UserPlus className="h-5 w-5" />}
                            {activity.type === 'leave' && <Clock className="h-5 w-5" />}
                            {activity.type === 'payroll' && <DollarSign className="h-5 w-5" />}
                            {activity.type === 'performance' && <TrendingUp className="h-5 w-5" />}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900 mb-1 group-hover:text-slate-800 transition-colors">
                              {activity.action}
                            </p>
                            <p className="text-sm text-slate-700 mb-3 group-hover:text-slate-600 transition-colors">
                              {activity.employee}
                            </p>
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant="outline" 
                                className={`text-xs transition-all duration-200 hover:scale-105 ${
                                  activity.type === 'recruitment' ? 'border-blue-200 text-blue-700 hover:bg-blue-50' :
                                  activity.type === 'leave' ? 'border-orange-200 text-orange-700 hover:bg-orange-50' :
                                  activity.type === 'payroll' ? 'border-green-200 text-green-700 hover:bg-green-50' : 'border-purple-200 text-purple-700 hover:bg-purple-50'
                                }`}
                              >
                                {activity.type === 'recruitment' ? 'توظيف' :
                                 activity.type === 'leave' ? 'إجازة' :
                                 activity.type === 'payroll' ? 'راتب' : 'أداء'}
                              </Badge>
                              <span className="text-xs text-slate-500 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {activity.time}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Action button */}
                        <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full hover:scale-105 transition-transform duration-200"
                            onClick={() => {
                              // Navigate based on activity type
                              switch (activity.type) {
                                case 'recruitment':
                                  navigate('/hcm/recruitment');
                                  break;
                                case 'leave':
                                  navigate('/hcm/attendance');
                                  break;
                                case 'payroll':
                                  navigate('/hcm/payroll');
                                  break;
                                case 'performance':
                                  navigate('/hcm/performance');
                                  break;
                              }
                            }}
                          >
                            عرض التفاصيل
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {/* Activities Summary */}
                <div className="mt-6 p-4 bg-gradient-to-r from-slate-100 to-white rounded-lg border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Activity className="h-5 w-5 text-slate-600" />
                      <span className="text-sm font-medium text-slate-900">
                        إجمالي النشاطات اليوم: {recentActivities.length}
                      </span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="hover:scale-105 transition-transform duration-200"
                      onClick={() => navigate('/hcm/reports')}
                    >
                      عرض جميع التقارير
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HCMDashboard;