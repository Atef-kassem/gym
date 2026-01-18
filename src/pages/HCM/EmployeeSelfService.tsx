import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { 
  User, 
  FileText, 
  Calendar, 
  DollarSign, 
  Upload, 
  Download, 
  Edit3,
  Bell,
  CheckCircle,
  Clock,
  AlertCircle,
  Save,
  Camera
} from "lucide-react";

export default function EmployeeSelfService() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);

  const handleNotifications = () => {
    toast({
      title: "الإشعارات",
      description: "جاري فتح مركز الإشعارات...",
    });
  };

  const handleUpdatePhoto = () => {
    toast({
      title: "تحديث الصورة",
      description: "جاري فتح أداة تحديث الصورة الشخصية...",
    });
  };

  const handleSaveChanges = () => {
    setIsLoading(true);
    toast({
      title: "حفظ التغييرات",
      description: "جاري حفظ التعديلات...",
    });
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "تم بنجاح ✅",
        description: "تم حفظ جميع التغييرات",
      });
    }, 1500);
  };

  const handleNewRequest = () => {
    toast({
      title: "طلب جديد",
      description: "جاري فتح نموذج الطلبات...",
    });
  };

  const handleUploadDocument = () => {
    toast({
      title: "رفع وثيقة",
      description: "جاري فتح أداة رفع الوثائق...",
    });
  };

  const handleRequestCertificate = () => {
    toast({
      title: "طلب شهادة",
      description: "جاري إرسال طلب الشهادة...",
    });
  };

  const handleNewLeaveRequest = () => {
    toast({
      title: "طلب إجازة جديد",
      description: "جاري فتح نموذج طلب الإجازة...",
    });
  };

  const handleDownloadPayslip = (month: string) => {
    toast({
      title: "تحميل القسيمة",
      description: `جاري تحميل قسيمة راتب ${month}`,
    });
  };

  const handleDownloadAnnualReport = () => {
    toast({
      title: "تحميل كشف سنوي",
      description: "جاري تحميل الكشف السنوي للرواتب...",
    });
  };

  const handleDownloadDocument = (doc: string) => {
    toast({
      title: "تحميل الوثيقة",
      description: `جاري تحميل ${doc}`,
    });
  };

  const employee = {
    name: "أحمد محمد علي",
    id: "EMP001",
    department: "الفنيين",
    position: "فني أول",
    email: "ahmed.ali@company.com",
    phone: "+966501234567",
    salary: 8500,
    leaveBalance: {
      annual: 15,
      sick: 10,
      emergency: 3
    }
  };

  const requests = [
    {
      id: "REQ001",
      type: "إجازة سنوية",
      startDate: "2024-02-01",
      endDate: "2024-02-05",
      status: "موافق",
      submittedDate: "2024-01-15"
    },
    {
      id: "REQ002",
      type: "سلفة مالية",
      amount: 2000,
      status: "في المراجعة",
      submittedDate: "2024-01-20"
    }
  ];

  const payslips = [
    {
      month: "يناير 2024",
      basicSalary: 8500,
      allowances: 1500,
      overtime: 500,
      deductions: 850,
      netSalary: 9650
    },
    {
      month: "ديسمبر 2023",
      basicSalary: 8500,
      allowances: 1500,
      overtime: 300,
      deductions: 850,
      netSalary: 9450
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "موافق": return "bg-green-500";
      case "في المراجعة": return "bg-yellow-500";
      case "مرفوض": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "موافق": return <CheckCircle className="h-4 w-4" />;
      case "في المراجعة": return <Clock className="h-4 w-4" />;
      case "مرفوض": return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">الخدمة الذاتية للموظفين</h1>
            <p className="text-slate-600 mt-2">إدارة بياناتك وطلباتك الشخصية</p>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="outline"
              onClick={handleNotifications}
              className="hover:scale-105 hover:bg-blue-50 transition-all duration-300"
            >
              <Bell className="ml-2 h-4 w-4 animate-pulse" />
              الإشعارات
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="group border-0 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer animate-fade-in bg-gradient-to-br from-white to-blue-50/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium group-hover:text-blue-800 transition-colors duration-300">الإجازات المتبقية</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground group-hover:text-blue-600 group-hover:animate-pulse transition-colors duration-300" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold group-hover:scale-110 transition-transform duration-300">{employee.leaveBalance.annual}</div>
              <p className="text-xs text-muted-foreground group-hover:text-blue-600 transition-colors duration-300">يوم إجازة سنوية</p>
            </CardContent>
          </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الراتب الحالي</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employee.salary.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">جنيه مصري</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الطلبات المعلقة</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">في انتظار المراجعة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">تقييم الأداء</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2</div>
            <p className="text-xs text-muted-foreground">من 5.0</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">الملف الشخصي</TabsTrigger>
          <TabsTrigger value="requests">الطلبات</TabsTrigger>
          <TabsTrigger value="payroll">الرواتب</TabsTrigger>
          <TabsTrigger value="documents">الوثائق</TabsTrigger>
          <TabsTrigger value="leave">الإجازات</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>البيانات الشخصية</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="/avatars/employee.jpg" />
                    <AvatarFallback>أح</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{employee.name}</h3>
                    <p className="text-muted-foreground">{employee.position}</p>
                    <p className="text-sm text-muted-foreground">{employee.department}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="mr-auto hover:scale-105 hover:bg-blue-50 transition-all duration-300"
                    onClick={handleUpdatePhoto}
                  >
                    <Camera className="ml-2 h-4 w-4" />
                    تحديث الصورة
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="employee-name">الاسم الكامل</Label>
                    <Input id="employee-name" value={employee.name} />
                  </div>
                  <div>
                    <Label htmlFor="employee-id">الرقم الوظيفي</Label>
                    <Input id="employee-id" value={employee.id} disabled />
                  </div>
                  <div>
                    <Label htmlFor="employee-email">البريد الإلكتروني</Label>
                    <Input id="employee-email" value={employee.email} />
                  </div>
                  <div>
                    <Label htmlFor="employee-phone">رقم الجوال</Label>
                    <Input id="employee-phone" value={employee.phone} />
                  </div>
                  <div>
                    <Label htmlFor="employee-department">القسم</Label>
                    <Input id="employee-department" value={employee.department} disabled />
                  </div>
                  <div>
                    <Label htmlFor="employee-position">المنصب</Label>
                    <Input id="employee-position" value={employee.position} disabled />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button 
                    onClick={handleSaveChanges}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    {isLoading ? (
                      <div className="ml-2 w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <Save className="ml-2 h-4 w-4" />
                    )}
                    حفظ التغييرات
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">طلباتي</h3>
            <Button 
              onClick={handleNewRequest}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:scale-105 transition-all duration-300"
            >
              <FileText className="ml-2 h-4 w-4 animate-pulse" />
              طلب جديد
            </Button>
          </div>

          <Card>
            <CardContent className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>رقم الطلب</TableHead>
                    <TableHead>نوع الطلب</TableHead>
                    <TableHead>التفاصيل</TableHead>
                    <TableHead>تاريخ التقديم</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.id}</TableCell>
                      <TableCell>{request.type}</TableCell>
                      <TableCell>
                        {request.type === "إجازة سنوية" ? 
                          `${request.startDate} إلى ${request.endDate}` : 
                          `${request.amount} جنيه`
                        }
                      </TableCell>
                      <TableCell>{request.submittedDate}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(request.status)}>
                          {getStatusIcon(request.status)}
                          <span className="mr-1">{request.status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          عرض التفاصيل
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payroll" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">قسائم الرواتب</h3>
            <Button 
              variant="outline"
              onClick={handleDownloadAnnualReport}
              className="hover:scale-105 hover:bg-green-50 transition-all duration-300"
            >
              <Download className="ml-2 h-4 w-4" />
              تحميل كشف سنوي
            </Button>
          </div>

          <div className="space-y-4">
            {payslips.map((payslip, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{payslip.month}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">الراتب الأساسي</p>
                      <p className="text-lg font-semibold">{payslip.basicSalary.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">البدلات</p>
                      <p className="text-lg font-semibold text-green-600">+{payslip.allowances.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">العمل الإضافي</p>
                      <p className="text-lg font-semibold text-green-600">+{payslip.overtime.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">الاستقطاعات</p>
                      <p className="text-lg font-semibold text-red-600">-{payslip.deductions.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">صافي الراتب</p>
                      <p className="text-xl font-bold">{payslip.netSalary.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button variant="outline" size="sm">
                      <Download className="ml-2 h-4 w-4" />
                      تحميل القسيمة
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">الوثائق</h3>
            <Button 
              onClick={handleUploadDocument}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 hover:scale-105 transition-all duration-300"
            >
              <Upload className="ml-2 h-4 w-4 animate-bounce" />
              رفع وثيقة
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>طلب الشهادات</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="certificate-type">نوع الشهادة</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر نوع الشهادة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="salary-certificate">تعريف راتب</SelectItem>
                      <SelectItem value="experience-certificate">شهادة خبرة</SelectItem>
                      <SelectItem value="employment-certificate">شهادة عمل</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="certificate-purpose">الغرض من الشهادة</Label>
                  <Textarea id="certificate-purpose" placeholder="اذكر الغرض من طلب الشهادة..." />
                </div>
                <Button 
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 hover:scale-105 transition-all duration-300"
                  onClick={handleRequestCertificate}
                >
                  <FileText className="ml-2 h-4 w-4" />
                  طلب الشهادة
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>الوثائق المرفوعة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">الهوية الوطنية</p>
                      <p className="text-sm text-muted-foreground">تاريخ الانتهاء: 2025-12-31</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">شهادة التدريب الفني</p>
                      <p className="text-sm text-muted-foreground">تاريخ الإصدار: 2023-06-15</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="leave" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>الإجازة السنوية</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{employee.leaveBalance.annual}</div>
                  <p className="text-muted-foreground">يوم متبقي</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>الإجازة المرضية</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{employee.leaveBalance.sick}</div>
                  <p className="text-muted-foreground">يوم متبقي</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>الإجازة الطارئة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">{employee.leaveBalance.emergency}</div>
                  <p className="text-muted-foreground">يوم متبقي</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>طلب إجازة جديدة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="leave-type">نوع الإجازة</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر نوع الإجازة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="annual">إجازة سنوية</SelectItem>
                      <SelectItem value="sick">إجازة مرضية</SelectItem>
                      <SelectItem value="emergency">إجازة طارئة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="leave-duration">عدد الأيام</Label>
                  <Input id="leave-duration" type="number" placeholder="0" />
                </div>
                <div>
                  <Label htmlFor="leave-start">تاريخ البداية</Label>
                  <Input id="leave-start" type="date" />
                </div>
                <div>
                  <Label htmlFor="leave-end">تاريخ النهاية</Label>
                  <Input id="leave-end" type="date" />
                </div>
              </div>
              <div>
                <Label htmlFor="leave-reason">سبب الإجازة</Label>
                <Textarea id="leave-reason" placeholder="اذكج.مبب طلب الإجازة..." />
              </div>
              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:scale-105 transition-all duration-300"
                onClick={handleNewLeaveRequest}
              >
                <Calendar className="ml-2 h-4 w-4" />
                تقديم طلب الإجازة
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}