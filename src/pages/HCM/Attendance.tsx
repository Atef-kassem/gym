import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { toast } from "@/hooks/use-toast";
import { 
  Clock, 
  Search, 
  Filter, 
  Calendar, 
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Plus,
  FileCheck,
  UserCheck
} from "lucide-react";

const Attendance = () => {
  const [activeTab, setActiveTab] = useState("today");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLeaveCalendar = () => {
    toast({
      title: "تقويم الإجازات",
      description: "جاري فتح تقويم الإجازات التفاعلي...",
    });
  };

  const handleNewLeaveRequest = () => {
    setIsLoading(true);
    toast({
      title: "طلب إجازة جديد",
      description: "جاري فتح نموذج طلب الإجازة...",
    });
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "تم بنجاح ✅",
        description: "تم فتح نموذج طلب الإجازة",
      });
    }, 1500);
  };

  const handleApproveLeave = (employee: string) => {
    toast({
      title: "تمت الموافقة ✅",
      description: `تمت الموافقة على طلب إجازة ${employee}`,
    });
  };

  const handleRejectLeave = (employee: string) => {
    toast({
      title: "تم الرفض ❌",
      description: `تم رفض طلب إجازة ${employee}`,
    });
  };

  const handleGenerateReport = (reportType: string) => {
    toast({
      title: "إنشاء التقرير",
      description: `جاري إنشاء ${reportType}...`,
    });
  };

  const stats = [
    { title: "الحضور اليوم", value: "298/324", icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
    { title: "التأخيرات", value: "12", icon: AlertTriangle, color: "text-orange-600", bg: "bg-orange-50" },
    { title: "الغيابات", value: "14", icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
    { title: "ساعات العمل الإضافي", value: "45", icon: Clock, color: "text-blue-600", bg: "bg-blue-50" },
  ];

  const todayAttendance = [
    { 
      id: 1, 
      empId: "EMP001",
      name: "أحمد محمد العتيبي", 
      department: "الصيانة",
      checkIn: "07:45",
      checkOut: "17:30",
      workHours: "08:45",
      overtime: "00:30",
      status: "حاضر"
    },
    { 
      id: 2, 
      empId: "EMP002",
      name: "فاطمة علي الأحمدي", 
      department: "الاستقبال",
      checkIn: "08:15",
      checkOut: "-",
      workHours: "07:45",
      overtime: "00:00",
      status: "متأخر"
    },
    { 
      id: 3, 
      empId: "EMP003",
      name: "محمد سعد القحطاني", 
      department: "المالية",
      checkIn: "-",
      checkOut: "-",
      workHours: "00:00",
      overtime: "00:00",
      status: "غائب"
    },
  ];

  const leaveRequests = [
    { 
      id: 1,
      employee: "نورا خالد الشمري",
      type: "إجازة سنوية",
      from: "2024-02-01",
      to: "2024-02-05",
      days: 5,
      status: "معلق",
      submittedDate: "2024-01-25"
    },
    { 
      id: 2,
      employee: "علي محمد الزهراني",
      type: "إجازة مرضية",
      from: "2024-01-28",
      to: "2024-01-30",
      days: 3,
      status: "موافق",
      submittedDate: "2024-01-27"
    },
    { 
      id: 3,
      employee: "سارة أحمد القحطاني",
      type: "إذن خاص",
      from: "2024-01-29",
      to: "2024-01-29",
      days: 1,
      status: "مرفوض",
      submittedDate: "2024-01-28"
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "حاضر": { color: "bg-green-100 text-green-800" },
      "متأخر": { color: "bg-orange-100 text-orange-800" },
      "غائب": { color: "bg-red-100 text-red-800" },
      "معلق": { color: "bg-yellow-100 text-yellow-800" },
      "موافق": { color: "bg-green-100 text-green-800" },
      "مرفوض": { color: "bg-red-100 text-red-800" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig["حاضر"];
    return <Badge className={config.color}>{status}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">الحضور والإجازات</h1>
            <p className="text-slate-600 mt-2">متابعة الحضور وإدارة طلبات الإجازات</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleLeaveCalendar}
              className="hover:scale-105 hover:bg-blue-50 transition-all duration-300"
            >
              <Calendar className="w-4 h-4 mr-2" />
              تقويم الإجازات
            </Button>
            <Button 
              onClick={handleNewLeaveRequest}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Plus className="w-4 h-4 mr-2 animate-bounce" />
              )}
              طلب إجازة جديد
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
                  إدارة الحضور والإجازات
                </CardTitle>
                <CardDescription>
                  متابعة الحضور اليومي وطلبات الإجازات
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
                <TabsTrigger value="today">الحضور اليوم</TabsTrigger>
                <TabsTrigger value="leaves">طلبات الإجازة</TabsTrigger>
                <TabsTrigger value="reports">التقارير</TabsTrigger>
              </TabsList>

              <TabsContent value="today" className="mt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الرقم الوظيفي</TableHead>
                      <TableHead>اسم الموظف</TableHead>
                      <TableHead>القسم</TableHead>
                      <TableHead>وقت الحضور</TableHead>
                      <TableHead>وقت الانصراف</TableHead>
                      <TableHead>ساعات العمل</TableHead>
                      <TableHead>الإضافي</TableHead>
                      <TableHead>الحالة</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {todayAttendance.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.empId}</TableCell>
                        <TableCell>{record.name}</TableCell>
                        <TableCell>{record.department}</TableCell>
                        <TableCell>{record.checkIn}</TableCell>
                        <TableCell>{record.checkOut}</TableCell>
                        <TableCell>{record.workHours}</TableCell>
                        <TableCell className="text-blue-600">{record.overtime}</TableCell>
                        <TableCell>{getStatusBadge(record.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="leaves" className="mt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>اسم الموظف</TableHead>
                      <TableHead>نوع الإجازة</TableHead>
                      <TableHead>من تاريخ</TableHead>
                      <TableHead>إلى تاريخ</TableHead>
                      <TableHead>عدد الأيام</TableHead>
                      <TableHead>تاريخ التقديم</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaveRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.employee}</TableCell>
                        <TableCell>{request.type}</TableCell>
                        <TableCell>{request.from}</TableCell>
                        <TableCell>{request.to}</TableCell>
                        <TableCell>{request.days}</TableCell>
                        <TableCell>{request.submittedDate}</TableCell>
                        <TableCell>{getStatusBadge(request.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-green-600 hover:bg-green-50 hover:scale-110 transition-all duration-300"
                              onClick={() => handleApproveLeave(request.employee)}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              موافق
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-600 hover:bg-red-50 hover:scale-110 transition-all duration-300"
                              onClick={() => handleRejectLeave(request.employee)}
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

              <TabsContent value="reports" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="group border border-slate-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer bg-gradient-to-br from-white to-blue-50/30 animate-fade-in">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-xl bg-blue-50 group-hover:scale-110 group-hover:bg-blue-100 transition-all duration-300">
                          <TrendingUp className="h-6 w-6 text-blue-600 group-hover:animate-pulse" />
                        </div>
                        <h3 className="font-bold text-slate-900 group-hover:text-blue-800 transition-colors duration-300">تقرير الحضور الشهري</h3>
                      </div>
                      <p className="text-sm text-slate-600 mb-4 group-hover:text-slate-700 transition-colors duration-300">إحصائيات الحضور والغياب</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full group-hover:bg-blue-50 group-hover:border-blue-300 hover:scale-105 transition-all duration-300"
                        onClick={() => handleGenerateReport("تقرير الحضور الشهري")}
                      >
                        <FileCheck className="w-4 h-4 mr-2" />
                        عرض التقرير
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-xl bg-green-50">
                          <Calendar className="h-6 w-6 text-green-600" />
                        </div>
                        <h3 className="font-bold text-slate-900">تقرير الإجازات</h3>
                      </div>
                      <p className="text-sm text-slate-600 mb-4">ملخص الإجازات والأرصدة</p>
                      <Button variant="outline" size="sm" className="w-full">
                        عرض التقرير
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-xl bg-orange-50">
                          <Clock className="h-6 w-6 text-orange-600" />
                        </div>
                        <h3 className="font-bold text-slate-900">تقرير العمل الإضافي</h3>
                      </div>
                      <p className="text-sm text-slate-600 mb-4">تفاصيل الساعات الإضافية</p>
                      <Button variant="outline" size="sm" className="w-full">
                        عرض التقرير
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

export default Attendance;