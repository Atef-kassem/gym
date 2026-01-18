import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  BarChart3, Search, Filter, Calendar, Download, TrendingUp, TrendingDown,
  Users, DollarSign, Clock, Award, FileText, PieChart, LineChart
} from "lucide-react";
import { useGetAllEmployeesQuery } from "@/services/employeesApi";
import { format } from "date-fns";

const Reports = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const { toast } = useToast();
  const { data: employeesResponse } = useGetAllEmployeesQuery({});
  const employees = Array.isArray(employeesResponse?.data) ? employeesResponse.data : [];

  // جلب البيانات من localStorage
  const attendanceData = JSON.parse(localStorage.getItem('hr_attendance') || '[]');
  const leavesData = JSON.parse(localStorage.getItem('hr_leaves') || '[]');
  const payrollsData = JSON.parse(localStorage.getItem('hr_payrolls') || '[]');
  const performanceReviews = JSON.parse(localStorage.getItem('hr_performance_reviews') || '[]');
  const trainingSessions = JSON.parse(localStorage.getItem('hr_training_sessions') || '[]');

  // حساب الإحصائيات العامة
  const overviewStats = useMemo(() => {
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter((e: any) => 
      (e.status || e.employmentStatus || e.isActive) === "نشط" || e.isActive === true
    ).length;
    
    const departmentsMap = new Map<string, number>();
    employees.forEach((emp: any) => {
      const deptName = typeof emp.department === 'string' 
        ? emp.department 
        : emp.department?.name 
        ? emp.department.name 
        : emp.Department?.name || 'غير محدد';
      departmentsMap.set(deptName, (departmentsMap.get(deptName) || 0) + 1);
    });

    const totalSalary = employees.reduce((sum: number, e: any) => 
      sum + (parseFloat(e.basicSalary || e.salary || 0)), 0
    );
    const avgSalary = totalEmployees > 0 ? totalSalary / totalEmployees : 0;

    const avgPerformance = performanceReviews.length > 0
      ? performanceReviews.reduce((sum: number, r: any) => sum + parseFloat(r.overallRating || 0), 0) / performanceReviews.length
      : 0;

    const attendanceRate = attendanceData.length > 0
      ? (attendanceData.filter((a: any) => a.status === "حاضر").length / attendanceData.length) * 100
      : 0;

    return {
      totalEmployees,
      activeEmployees,
      totalDepartments: departmentsMap.size,
      totalSalary,
      avgSalary,
      avgPerformance,
      attendanceRate
    };
  }, [employees, attendanceData, performanceReviews]);

  // تقرير الحضور
  const attendanceReport = useMemo(() => {
    const filtered = attendanceData.filter((a: any) => {
      if (startDate && a.date < startDate) return false;
      if (endDate && a.date > endDate) return false;
      return true;
    });

    const present = filtered.filter((a: any) => a.status === "حاضر").length;
    const absent = filtered.filter((a: any) => a.status === "غائب").length;
    const total = filtered.length;
    const rate = total > 0 ? (present / total) * 100 : 0;

    return { present, absent, total, rate };
  }, [attendanceData, startDate, endDate]);

  // تقرير الإجازات
  const leavesReport = useMemo(() => {
    const filtered = leavesData.filter((l: any) => {
      if (startDate && l.startDate < startDate) return false;
      if (endDate && l.endDate > endDate) return false;
      return true;
    });

    const approved = filtered.filter((l: any) => l.status === "موافق").length;
    const pending = filtered.filter((l: any) => l.status === "قيد المراجعة").length;
    const rejected = filtered.filter((l: any) => l.status === "مرفوض").length;
    const totalDays = filtered.reduce((sum: number, l: any) => sum + (l.days || 0), 0);

    return { approved, pending, rejected, totalDays, total: filtered.length };
  }, [leavesData, startDate, endDate]);

  // تقرير الرواتب
  const payrollReport = useMemo(() => {
    const filtered = payrollsData.filter((p: any) => {
      if (startDate && p.month < startDate) return false;
      if (endDate && p.month > endDate) return false;
      return true;
    });

    const totalSalary = filtered.reduce((sum: number, p: any) => sum + (p.netSalary || 0), 0);
    const totalDeductions = filtered.reduce((sum: number, p: any) => sum + (p.deductions || 0), 0);
    const totalAllowances = filtered.reduce((sum: number, p: any) => sum + (p.allowances || 0), 0);

    return { totalSalary, totalDeductions, totalAllowances, count: filtered.length };
  }, [payrollsData, startDate, endDate]);

  // تقرير الأداء
  const performanceReport = useMemo(() => {
    const filtered = performanceReviews.filter((r: any) => {
      if (startDate && r.reviewDate < startDate) return false;
      if (endDate && r.reviewDate > endDate) return false;
      return true;
    });

    const avgRating = filtered.length > 0
      ? filtered.reduce((sum: number, r: any) => sum + parseFloat(r.overallRating || 0), 0) / filtered.length
      : 0;

    const excellent = filtered.filter((r: any) => parseFloat(r.overallRating || 0) >= 4.5).length;
    const good = filtered.filter((r: any) => {
      const rating = parseFloat(r.overallRating || 0);
      return rating >= 3.5 && rating < 4.5;
    }).length;
    const needsImprovement = filtered.filter((r: any) => parseFloat(r.overallRating || 0) < 3.5).length;

    return { avgRating, excellent, good, needsImprovement, total: filtered.length };
  }, [performanceReviews, startDate, endDate]);

  // تقرير التدريب
  const trainingReport = useMemo(() => {
    const filtered = trainingSessions.filter((s: any) => {
      if (startDate && s.date < startDate) return false;
      if (endDate && s.date > endDate) return false;
      return true;
    });

    const completed = filtered.filter((s: any) => s.status === "مكتملة").length;
    const scheduled = filtered.filter((s: any) => s.status === "مجدولة").length;
    const totalParticipants = filtered.reduce((sum: number, s: any) => sum + (s.participants?.length || 0), 0);

    return { completed, scheduled, totalParticipants, total: filtered.length };
  }, [trainingSessions, startDate, endDate]);

  const handleExport = (reportType: string) => {
    toast({
      title: "تصدير التقرير",
      description: `جاري تصدير تقرير ${reportType}...`
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-8 h-8 text-indigo-600" />
              التقارير والتحليلات
            </h1>
            <p className="text-gray-600 mt-1">تقارير شاملة عن الموارد البشرية</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              تصدير الكل
            </Button>
          </div>
        </div>

        {/* الفلاتر */}
        <Card>
          <CardHeader>
            <CardTitle>الفلاتر</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>من تاريخ</Label>
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>إلى تاريخ</Label>
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>القسم</Label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الأقسام</SelectItem>
                    {Array.from(new Set(employees.map((e: any) => 
                      typeof e.department === 'string' ? e.department : e.department?.name || e.Department?.name
                    ).filter(Boolean))).map((dept: string) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <Button variant="outline" className="w-full" onClick={() => {
                  setStartDate("");
                  setEndDate("");
                  setSelectedDepartment("all");
                }}>
                  إعادة تعيين
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* التبويبات */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="attendance">الحضور</TabsTrigger>
            <TabsTrigger value="leaves">الإجازات</TabsTrigger>
            <TabsTrigger value="payroll">الرواتب</TabsTrigger>
            <TabsTrigger value="performance">الأداء</TabsTrigger>
            <TabsTrigger value="training">التدريب</TabsTrigger>
          </TabsList>

          {/* تبويب النظرة العامة */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                    <span>إجمالي الموظفين</span>
                    <Users className="w-5 h-5 text-blue-500" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">{overviewStats.totalEmployees}</div>
                  <p className="text-sm text-gray-500 mt-1">{overviewStats.activeEmployees} نشط</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                    <span>متوسط الراتب</span>
                    <DollarSign className="w-5 h-5 text-green-500" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{Math.round(overviewStats.avgSalary).toLocaleString()}</div>
                  <p className="text-sm text-gray-500 mt-1">ج.م</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                    <span>متوسط الأداء</span>
                    <Award className="w-5 h-5 text-purple-500" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">{overviewStats.avgPerformance.toFixed(1)}</div>
                  <p className="text-sm text-gray-500 mt-1">من 5.0</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-amber-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                    <span>معدل الحضور</span>
                    <Clock className="w-5 h-5 text-amber-500" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-amber-600">{overviewStats.attendanceRate.toFixed(1)}%</div>
                  <p className="text-sm text-gray-500 mt-1">نسبة الحضور</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* تبويب الحضور */}
          <TabsContent value="attendance" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>تقرير الحضور</CardTitle>
                <Button variant="outline" onClick={() => handleExport("الحضور")}>
                  <Download className="w-4 h-4 ml-2" />
                  تصدير
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{attendanceReport.present}</div>
                    <p className="text-sm text-gray-600">حاضر</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{attendanceReport.absent}</div>
                    <p className="text-sm text-gray-600">غائب</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-600">{attendanceReport.total}</div>
                    <p className="text-sm text-gray-600">إجمالي</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{attendanceReport.rate.toFixed(1)}%</div>
                    <p className="text-sm text-gray-600">نسبة الحضور</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* تبويب الإجازات */}
          <TabsContent value="leaves" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>تقرير الإجازات</CardTitle>
                <Button variant="outline" onClick={() => handleExport("الإجازات")}>
                  <Download className="w-4 h-4 ml-2" />
                  تصدير
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{leavesReport.approved}</div>
                    <p className="text-sm text-gray-600">موافق</p>
                  </div>
                  <div className="text-center p-4 bg-amber-50 rounded-lg">
                    <div className="text-2xl font-bold text-amber-600">{leavesReport.pending}</div>
                    <p className="text-sm text-gray-600">قيد المراجعة</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{leavesReport.rejected}</div>
                    <p className="text-sm text-gray-600">مرفوض</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{leavesReport.totalDays}</div>
                    <p className="text-sm text-gray-600">إجمالي الأيام</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-600">{leavesReport.total}</div>
                    <p className="text-sm text-gray-600">إجمالي الطلبات</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* تبويب الرواتب */}
          <TabsContent value="payroll" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>تقرير الرواتب</CardTitle>
                <Button variant="outline" onClick={() => handleExport("الرواتب")}>
                  <Download className="w-4 h-4 ml-2" />
                  تصدير
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{payrollReport.totalSalary.toLocaleString()}</div>
                    <p className="text-sm text-gray-600">إجمالي الرواتب</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{payrollReport.totalAllowances.toLocaleString()}</div>
                    <p className="text-sm text-gray-600">إجمالي البدلات</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{payrollReport.totalDeductions.toLocaleString()}</div>
                    <p className="text-sm text-gray-600">إجمالي الخصومات</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-600">{payrollReport.count}</div>
                    <p className="text-sm text-gray-600">عدد الكشوف</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* تبويب الأداء */}
          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>تقرير الأداء</CardTitle>
                <Button variant="outline" onClick={() => handleExport("الأداء")}>
                  <Download className="w-4 h-4 ml-2" />
                  تصدير
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{performanceReport.avgRating.toFixed(1)}</div>
                    <p className="text-sm text-gray-600">متوسط التقييم</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{performanceReport.excellent}</div>
                    <p className="text-sm text-gray-600">ممتاز (4.5+)</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{performanceReport.good}</div>
                    <p className="text-sm text-gray-600">جيد (3.5-4.5)</p>
                  </div>
                  <div className="text-center p-4 bg-amber-50 rounded-lg">
                    <div className="text-2xl font-bold text-amber-600">{performanceReport.needsImprovement}</div>
                    <p className="text-sm text-gray-600">يحتاج تحسين</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-600">{performanceReport.total}</div>
                    <p className="text-sm text-gray-600">إجمالي التقييمات</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* تبويب التدريب */}
          <TabsContent value="training" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>تقرير التدريب</CardTitle>
                <Button variant="outline" onClick={() => handleExport("التدريب")}>
                  <Download className="w-4 h-4 ml-2" />
                  تصدير
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{trainingReport.completed}</div>
                    <p className="text-sm text-gray-600">مكتملة</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{trainingReport.scheduled}</div>
                    <p className="text-sm text-gray-600">مجدولة</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{trainingReport.totalParticipants}</div>
                    <p className="text-sm text-gray-600">إجمالي المشاركين</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-600">{trainingReport.total}</div>
                    <p className="text-sm text-gray-600">إجمالي الجلسات</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Reports;

