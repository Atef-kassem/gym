import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import {
  Users, TrendingUp, Activity, Calendar, DollarSign,
  BarChart3, CreditCard, Award, Star, CheckCircle, TrendingDown,
  Filter, Download, AlertCircle, Clock, MapPin, ShoppingCart,
  Package, UserPlus, FileText, PieChart, Target, Zap
} from "lucide-react";

const GymDashboard = () => {
  const navigate = useNavigate();

  // بيانات وهمية للإحصائيات
  const stats = {
    totalMembers: 1250,
    activeMembers: 890,
    inactiveMembers: 360,
    newMembersThisMonth: 45,
    expiredMembers: 23,
    monthlyRevenue: 250000,
    monthlyExpenses: 180000,
    netProfit: 70000,
    classesToday: 24,
    bookedClasses: 18,
    availableSlots: 6,
    trainers: 15,
    activeTrainers: 13,
    facilities: 8,
    attendanceRate: 78.5,
    retentionRate: 85,
    customerSatisfaction: 4.8,
    avgMonthlyMembership: 450,
    pendingRenewals: 12,
    upcomingClasses: 8
  };

  const quickActions = [
    {
      title: "إدارة العضوية",
      description: "عرض وإدارة الأعضاء",
      icon: Users,
      color: "bg-blue-500",
      path: "/gym/memberships"
    },
    {
      title: "الاشتراكات",
      description: "إدارة الاشتراكات والمدفوعات",
      icon: CreditCard,
      color: "bg-green-500",
      path: "/gym/subscriptions"
    },
    {
      title: "البرامج التدريبية",
      description: "إدارة البرامج والتمارين",
      icon: Activity,
      color: "bg-purple-500",
      path: "/gym/workout-programs"
    },
    {
      title: "الجدولة",
      description: "جدولة الحصص والبيع",
      icon: Calendar,
      color: "bg-orange-500",
      path: "/gym/scheduling"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* العنوان الرئيسي */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">لوحة تحكم النادي الرياضي</h1>
            <p className="text-gray-600 mt-1">نظرة شاملة على أداء النادي الرياضي والموارد</p>
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
            <Badge variant="outline" className="text-lg px-4 py-2">
              <Activity className="w-5 h-5 mr-2" />
              نشط
            </Badge>
          </div>
        </div>

        {/* الإحصائيات الرئيسية */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>إجمالي الأعضاء</span>
                <Users className="w-5 h-5 text-blue-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {stats.totalMembers.toLocaleString()}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-green-500">{stats.activeMembers} نشط</Badge>
                <Badge variant="outline">{stats.inactiveMembers} غير نشط</Badge>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                <TrendingUp className="w-3 h-3 inline ml-1" />
                {stats.newMembersThisMonth} عضو جديد هذا الشهر
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>الإيرادات الشهرية</span>
                <DollarSign className="w-5 h-5 text-green-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {stats.monthlyRevenue.toLocaleString()} ج.م
              </div>
              <p className="text-sm text-gray-500 mt-1">الشهر الحالي</p>
              <p className="text-xs text-gray-500 mt-2">
                <TrendingUp className="w-3 h-3 inline ml-1 text-green-500" />
                زيادة 8.5% عن الشهر الماضي
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>الحصص اليوم</span>
                <Calendar className="w-5 h-5 text-purple-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {stats.classesToday}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-green-500">{stats.bookedClasses} محجوز</Badge>
                <Badge className="bg-amber-500">{stats.availableSlots} متاح</Badge>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                <Clock className="w-3 h-3 inline ml-1" />
                {stats.upcomingClasses} حصة قادمة
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>نسبة الحضور</span>
                <CheckCircle className="w-5 h-5 text-orange-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">
                {stats.attendanceRate}%
              </div>
              <div className="mt-3">
                <Progress value={stats.attendanceRate} className="h-2" />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                <TrendingUp className="w-3 h-3 inline ml-1" />
                زيادة 2.3% عن الشهر السابق
              </p>
            </CardContent>
          </Card>
        </div>

        {/* بطاقات إضافية */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-emerald-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>صافي الربح</span>
                <TrendingUp className="w-5 h-5 text-emerald-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">{stats.netProfit.toLocaleString()} ج.م</div>
              <p className="text-sm text-gray-500 mt-1">هذا الشهر</p>
              <div className="mt-2">
                <Progress value={(stats.netProfit / stats.monthlyRevenue) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-indigo-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>المدربون</span>
                <Award className="w-5 h-5 text-indigo-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-600">{stats.trainers}</div>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-green-500">{stats.activeTrainers} نشط</Badge>
                <Badge variant="outline">{stats.trainers - stats.activeTrainers} غير نشط</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-pink-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>المرافق</span>
                <MapPin className="w-5 h-5 text-pink-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pink-600">{stats.facilities}</div>
              <p className="text-sm text-gray-500 mt-1">منشأة نشطة</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-cyan-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>متوسط الاشتراك</span>
                <CreditCard className="w-5 h-5 text-cyan-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cyan-600">{stats.avgMonthlyMembership.toLocaleString()} ج.م</div>
              <p className="text-sm text-gray-500 mt-1">شهرياً</p>
            </CardContent>
          </Card>
        </div>

        {/* إحصائيات الأداء */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                الوضع المالي
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">الإيرادات</span>
                <span className="font-bold text-green-600">{stats.monthlyRevenue.toLocaleString()} ج.م</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">المصروفات</span>
                <span className="font-bold text-red-600">{stats.monthlyExpenses.toLocaleString()} ج.م</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-gray-900 font-semibold">صافي الربح</span>
                <span className="font-bold text-blue-600">{stats.netProfit.toLocaleString()} ج.م</span>
              </div>
              <Progress value={(stats.netProfit / stats.monthlyRevenue) * 100} className="h-2 mt-2" />
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-500" />
                مؤشرات الأداء
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">معدل التجديد</span>
                <Badge className="bg-blue-500">{stats.retentionRate}%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">رضا العملاء</span>
                <Badge className="bg-purple-500">{stats.customerSatisfaction}/5</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">الأعضاء الجدد</span>
                <Badge className="bg-green-500">{stats.newMembersThisMonth} عضو</Badge>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-gray-600">تجديدات معلقة</span>
                <Badge variant="destructive">{stats.pendingRenewals}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-orange-500" />
                التنبيهات
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center p-2 rounded-lg bg-red-50">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-gray-600">اشتراكات منتهية</span>
                </div>
                <Badge variant="destructive">{stats.expiredMembers}</Badge>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-amber-50">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span className="text-gray-600">تجديدات معلقة</span>
                </div>
                <Badge className="bg-amber-500">{stats.pendingRenewals}</Badge>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-green-50">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-green-500" />
                  <span className="text-gray-600">أعضاء جدد</span>
                </div>
                <Badge className="bg-green-500">{stats.newMembersThisMonth}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* الإجراءات السريعة */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>الإجراءات السريعة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-start hover:bg-gray-50"
                  onClick={() => navigate(action.path)}
                >
                  <div className={`${action.color} p-3 rounded-lg mb-3`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right w-full">
                    <div className="font-semibold">{action.title}</div>
                    <div className="text-sm text-gray-500 mt-1">{action.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* الأنشطة الأخيرة */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                الأنشطة الأخيرة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { id: 1, type: "عضوية", member: "أحمد محمد", action: "تم تسجيل عضو جديد", date: "2024-01-25", time: "10:30", icon: UserPlus, color: "bg-green-100", iconColor: "text-green-600" },
                  { id: 2, type: "دفعة", member: "فاطمة علي", action: "تم استلام دفعة 500 ج.م", date: "2024-01-25", time: "09:15", icon: CreditCard, color: "bg-blue-100", iconColor: "text-blue-600" },
                  { id: 3, type: "حجز", member: "محمد حسن", action: "تم حجز حصة تدريبية", date: "2024-01-24", time: "18:00", icon: Calendar, color: "bg-purple-100", iconColor: "text-purple-600" },
                  { id: 4, type: "تجديد", member: "سارة أحمد", action: "تم تجديد الاشتراك", date: "2024-01-24", time: "14:20", icon: Zap, color: "bg-amber-100", iconColor: "text-amber-600" }
                ].map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.color}`}>
                      <activity.icon className={`w-5 h-5 ${activity.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm">{activity.member}</span>
                        <span className="text-xs text-gray-500">{activity.date} {activity.time}</span>
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

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-blue-500" />
                توزيع أنواع الاشتراكات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "شهري", count: 560, percentage: 44.8, color: "bg-blue-500" },
                  { name: "ربع سنوي", count: 340, percentage: 27.2, color: "bg-green-500" },
                  { name: "نصف سنوي", count: 210, percentage: 16.8, color: "bg-purple-500" },
                  { name: "سنوي", count: 140, percentage: 11.2, color: "bg-orange-500" }
                ].map((plan, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${plan.color}`}></div>
                        <span className="font-medium">{plan.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{plan.count}</span>
                        <span className="text-gray-500 text-xs">({plan.percentage}%)</span>
                      </div>
                    </div>
                    <Progress value={plan.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default GymDashboard;

