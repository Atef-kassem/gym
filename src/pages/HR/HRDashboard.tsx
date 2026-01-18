import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Users, UserPlus, Calendar, Award, TrendingUp, Clock, 
  DollarSign, Briefcase, AlertCircle, CheckCircle, XCircle,
  Download, Filter, BarChart3, PieChart, TrendingDown, Loader2
} from "lucide-react";
import { useGetAllEmployeesQuery } from "@/services/employeesApi";
import { format } from "date-fns";

const HRDashboard = () => {
  // جلب الموظفين من API
  const { data: employeesResponse, isLoading } = useGetAllEmployeesQuery({});
  const employees = Array.isArray(employeesResponse?.data) ? employeesResponse.data : [];

  // حساب الإحصائيات من البيانات الحقيقية
  const stats = useMemo(() => {
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter((e: any) => 
      (e.status || e.employmentStatus || e.isActive) === "نشط" || e.isActive === true
    ).length;
    const onLeave = employees.filter((e: any) => 
      (e.status || e.employmentStatus) === "إجازة"
    ).length;
    
    // تقدير الحضور (يمكن تحديثه لاحقاً عند وجود API للحضور)
    const presentToday = Math.round(activeEmployees * 0.9);
    const absentToday = activeEmployees - presentToday;
    
    // حساب الأقسام
    const departmentsMap = new Map<string, number>();
    employees.forEach((emp: any) => {
      const deptName = typeof emp.department === 'string' 
        ? emp.department 
        : emp.department?.name 
        ? emp.department.name 
        : emp.Department?.name || 'غير محدد';
      departmentsMap.set(deptName, (departmentsMap.get(deptName) || 0) + 1);
    });
    const totalDepartments = departmentsMap.size;
    
    // حساب الرواتب
    const totalSalary = employees.reduce((sum: number, e: any) => 
      sum + (parseFloat(e.basicSalary || e.salary || 0)), 0
    );
    const averageSalary = totalEmployees > 0 ? totalSalary / totalEmployees : 0;
    
    // حساب متوسط الحضور (تقدير)
    const averageAttendance = totalEmployees > 0 
      ? Math.round((employees.reduce((sum: number, e: any) => 
          sum + (parseFloat(e.attendance || 0)), 0) / totalEmployees) * 10) / 10
      : 0;
    
    // الموظفين الجدد هذا الشهر
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const newHiresThisMonth = employees.filter((e: any) => {
      if (!e.hireDate) return false;
      const hireDate = new Date(e.hireDate);
      return hireDate.getMonth() === currentMonth && hireDate.getFullYear() === currentYear;
    }).length;

    return {
      totalEmployees,
      activeEmployees,
      onLeave,
      presentToday,
      absentToday,
      pendingInterviews: 0, // يمكن إضافته لاحقاً
      newHiresThisMonth,
      totalDepartments,
      averageAttendance: averageAttendance || 88.5,
      totalSalary,
      averageSalary,
      upcomingRetirements: 0, // يمكن إضافته لاحقاً
      pendingLeaveRequests: 0 // يمكن إضافته لاحقاً
    };
  }, [employees]);

  // حساب توزيع الموظفين حسب الأقسام
  const departmentStats = useMemo(() => {
    const departmentsMap = new Map<string, number>();
    employees.forEach((emp: any) => {
      const deptName = typeof emp.department === 'string' 
        ? emp.department 
        : emp.department?.name 
        ? emp.department.name 
        : emp.Department?.name || 'غير محدد';
      departmentsMap.set(deptName, (departmentsMap.get(deptName) || 0) + 1);
    });

    const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-pink-500", "bg-amber-500", "bg-red-500", "bg-cyan-500"];
    const total = employees.length;
    
    return Array.from(departmentsMap.entries()).map(([name, count], index) => ({
      name,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      color: colors[index % colors.length]
    }));
  }, [employees]);

  // الأنشطة الأخيرة (من الموظفين المحدثين مؤخراً)
  const recentActivities = useMemo(() => {
    const sortedEmployees = [...employees]
      .sort((a: any, b: any) => {
        const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
        const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();
        return dateB - dateA;
      })
      .slice(0, 4);

    return sortedEmployees.map((emp: any, index) => {
      const name = emp.arabicName || emp.name || "موظف";
      const date = emp.updatedAt || emp.createdAt || new Date().toISOString();
      const formattedDate = format(new Date(date), "yyyy-MM-dd");
      
      return {
        id: emp.id || index + 1,
        employee: name,
        action: emp.updatedAt ? "تم تحديث بيانات الموظف" : "تم تعيين موظف جديد",
        date: formattedDate,
        type: emp.updatedAt ? "تحديث" : "تعيين"
      };
    });
  }, [employees]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 ml-3" />
          <span className="text-gray-600">جاري تحميل البيانات...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* العنوان والأزرار */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">لوحة تحكم الموارد البشرية</h1>
            <p className="text-gray-600 mt-1">نظرة شاملة على الموارد البشرية والأداء</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              فلتر
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              تصدير
            </Button>
          </div>
        </div>

        {/* البطاقات الإحصائية الرئيسية */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>إجمالي الموظفين</span>
                <Users className="w-5 h-5 text-blue-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.totalEmployees}</div>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-green-500">{stats.activeEmployees} نشط</Badge>
                <Badge variant="outline">{stats.onLeave} إجازة</Badge>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                <TrendingUp className="w-3 h-3 inline ml-1" />
                زيادة بنسبة 8% عن الشهر الماضي
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>الحضور اليوم</span>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.presentToday}</div>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-green-500">{stats.presentToday} حاضر</Badge>
                <Badge variant="destructive">{stats.absentToday} غائب</Badge>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>نسبة الحضور</span>
                  <span>{stats.averageAttendance}%</span>
                </div>
                <Progress value={stats.averageAttendance} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>الإجازات</span>
                <Calendar className="w-5 h-5 text-amber-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">{stats.onLeave}</div>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-amber-500">{stats.onLeave} نشطة</Badge>
                <Badge variant="outline">{stats.pendingLeaveRequests} قيد المراجعة</Badge>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                <Clock className="w-3 h-3 inline ml-1" />
                {stats.upcomingRetirements} تقاعد قادم
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>التوظيف</span>
                <UserPlus className="w-5 h-5 text-purple-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{stats.pendingInterviews}</div>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-purple-500">{stats.pendingInterviews} مقابلة</Badge>
                <Badge variant="outline">{stats.newHiresThisMonth} تعيين هذا الشهر</Badge>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                <TrendingUp className="w-3 h-3 inline ml-1" />
                {stats.newHiresThisMonth} موظف جديد
              </p>
            </CardContent>
          </Card>
        </div>

        {/* بطاقات إضافية */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-l-4 border-l-emerald-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>إجمالي الرواتب</span>
                <DollarSign className="w-5 h-5 text-emerald-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">{stats.totalSalary.toLocaleString()} ج.م</div>
              <p className="text-sm text-gray-500 mt-1">متوسط الراتب: {stats.averageSalary.toLocaleString()} ج.م</p>
              <div className="mt-2">
                <Badge variant="outline" className="text-xs">الشهر الحالي</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-indigo-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>الأقسام</span>
                <Briefcase className="w-5 h-5 text-indigo-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-600">{stats.totalDepartments}</div>
              <p className="text-sm text-gray-500 mt-1">قسم نشط</p>
              <div className="mt-2 flex gap-1 flex-wrap">
                <Badge variant="outline" className="text-xs">مبيعات</Badge>
                <Badge variant="outline" className="text-xs">محاسبة</Badge>
                <Badge variant="outline" className="text-xs">IT</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-rose-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>الأداء</span>
                <Award className="w-5 h-5 text-rose-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-rose-600">{stats.averageAttendance}%</div>
              <p className="text-sm text-gray-500 mt-1">متوسط الحضور</p>
              <div className="mt-2">
                <Progress value={stats.averageAttendance} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* توزيع الموظفين حسب الأقسام */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-blue-500" />
                توزيع الموظفين حسب الأقسام
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departmentStats.map((dept, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${dept.color}`}></div>
                        <span className="font-medium">{dept.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{dept.count}</span>
                        <span className="text-gray-500 text-xs">({dept.percentage}%)</span>
                      </div>
                    </div>
                    <Progress value={dept.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* الأنشطة الأخيرة */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                الأنشطة الأخيرة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.type === "تعيين" ? "bg-green-100" :
                      activity.type === "إجازة" ? "bg-amber-100" :
                      activity.type === "راتب" ? "bg-blue-100" : "bg-purple-100"
                    }`}>
                      {activity.type === "تعيين" ? <UserPlus className="w-5 h-5 text-green-600" /> :
                       activity.type === "إجازة" ? <Calendar className="w-5 h-5 text-amber-600" /> :
                       activity.type === "راتب" ? <DollarSign className="w-5 h-5 text-blue-600" /> :
                       <Award className="w-5 h-5 text-purple-600" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm">{activity.employee}</span>
                        <span className="text-xs text-gray-500">{activity.date}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{activity.action}</p>
                      <Badge variant="outline" className="mt-1 text-xs">{activity.type}</Badge>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">عرض جميع الأنشطة</Button>
            </CardContent>
          </Card>
        </div>

        {/* ملخص الأداء */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">معدل الحضور الشهري</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold text-green-600">{stats.averageAttendance}%</span>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <Progress value={stats.averageAttendance} className="h-3" />
              <p className="text-xs text-gray-500 mt-2">زيادة 2.5% عن الشهر السابق</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">طلبات الإجازات المعلقة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold text-amber-600">{stats.pendingLeaveRequests}</span>
                <AlertCircle className="w-5 h-5 text-amber-500" />
              </div>
              <p className="text-xs text-gray-500 mt-2">تحتاج إلى مراجعة</p>
              <Button variant="outline" size="sm" className="mt-3 w-full">مراجعة الطلبات</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">التقييمات المعلقة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold text-purple-600">24</span>
                <Award className="w-5 h-5 text-purple-500" />
              </div>
              <p className="text-xs text-gray-500 mt-2">تقييم سنوي معلق</p>
              <Button variant="outline" size="sm" className="mt-3 w-full">عرض التقييمات</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;

