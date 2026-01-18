import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Enhanced Employee Form Components
import PersonalInfoTab from "@/components/HCM/EmployeeForm/PersonalInfoTab";
import LegalInfoTab from "@/components/HCM/EmployeeForm/LegalInfoTab";
import EmploymentInfoTab from "@/components/HCM/EmployeeForm/EmploymentInfoTab";
import FinancialInfoTab from "@/components/HCM/EmployeeForm/FinancialInfoTab";
import AttendanceLeaveTab from "@/components/HCM/EmployeeForm/AttendanceLeaveTab";
import PerformanceTab from "@/components/HCM/EmployeeForm/PerformanceTab";
import AssetsTab from "@/components/HCM/EmployeeForm/AssetsTab";
import DocumentsTab from "@/components/HCM/EmployeeForm/DocumentsTab";
import MedicalTab from "@/components/HCM/EmployeeForm/MedicalTab";
import OffboardingTab from "@/components/HCM/EmployeeForm/OffboardingTab";

// AI Components - Temporarily Disabled to fix calendar issue
// import AIAssistant from "@/components/HCM/AIAssistant";
// import DocumentProcessor from "@/components/HCM/DocumentProcessor";
// import AIAnalytics from "@/components/HCM/AIAnalytics";
// import SmartSearch from "@/components/HCM/SmartSearch";
// import SmartRecommendations from "@/components/HCM/SmartRecommendations";

import { toast } from "@/hooks/use-toast";
import { 
  FileText, 
  Search, 
  Filter, 
  Eye, 
  Download, 
  Upload,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  Shield,
  FileCheck,
  Plus,
  Edit,
  Trash2,
  Star,
  Calendar as CalendarIcon,
  MapPin,
  Phone,
  Mail,
  User,
  Building2,
  Briefcase,
  CreditCard,
  BookOpen,
  Award,
  Heart,
  Camera,
  Settings,
  Bell,
  Activity,
  DollarSign,
  Package,
  TrendingUp,
  Archive,
  RefreshCw,
  Save,
  X,
  AlertCircle,
  IdCard,
  FileImage,
  Printer,
  Send,
  History,
  ChevronRight,
  UserCheck
} from "lucide-react";

const EmployeeFiles = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [showEmployeeDialog, setShowEmployeeDialog] = useState(false);
  const [showDocumentDialog, setShowDocumentDialog] = useState(false);
  const [showAddEmployeeDialog, setShowAddEmployeeDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<any>({
    address: {},
    emergencyContact: {},
    banking: {},
    insurance: {},
    allowances: [],
    deductions: []
  });
  

  // Enhanced employee data with comprehensive fields
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

  const stats = [
    { title: "إجمالي الموظفين", value: "324", icon: Users, color: "text-blue-600", bg: "bg-blue-50", trend: "+12%" },
    { title: "الملفات المكتملة", value: "298", icon: CheckCircle, color: "text-green-600", bg: "bg-green-50", trend: "+8%" },
    { title: "وثائق تنتهي خلال 30 يوم", value: "8", icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50", trend: "-3%" },
    { title: "ملفات تحتاج تحديث", value: "18", icon: Clock, color: "text-orange-600", bg: "bg-orange-50", trend: "+2%" },
    { title: "الموظفين النشطين", value: "312", icon: UserCheck, color: "text-emerald-600", bg: "bg-emerald-50", trend: "+5%" },
    { title: "متوسط نسبة الإكمال", value: "91%", icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50", trend: "+4%" },
  ];

  const expiringDocuments = [
    { employee: "أحمد محمد العتيبي", document: "الإقامة", expiryDate: "2024-02-15", daysLeft: 15, urgency: "عاجل" },
    { employee: "نورا خالد الشمري", document: "رخصة القيادة", expiryDate: "2024-02-20", daysLeft: 20, urgency: "قريب" },
    { employee: "محمد علي الزهراني", document: "جواز السفر", expiryDate: "2024-03-01", daysLeft: 30, urgency: "تذكير" },
    { employee: "سارة أحمد الغامدي", document: "تصريح العمل", expiryDate: "2024-02-10", daysLeft: 10, urgency: "عاجل" },
  ];

  const documentTypes = [
    { name: "الهوية الوطنية", icon: IdCard, required: true },
    { name: "الإقامة", icon: IdCard, required: true },
    { name: "جواز السفر", icon: FileImage, required: true },
    { name: "تصريح العمل", icon: FileCheck, required: true },
    { name: "العقد الوظيفي", icon: FileText, required: true },
    { name: "الشهادات العلمية", icon: Award, required: false },
    { name: "الخبرات السابقة", icon: Briefcase, required: false },
    { name: "الفحص الطبي", icon: Heart, required: false },
    { name: "صورة شخصية", icon: Camera, required: false },
  ];

  const recentActivities = [
    { action: "تحديث بيانات", employee: "أحمد العتيبي", time: "منذ ساعتين", type: "update" },
    { action: "رفع وثيقة جديدة", employee: "فاطمة الأحمدي", time: "منذ 3 ساعات", type: "upload" },
    { action: "تجديد تصريح العمل", employee: "محمد القحطاني", time: "منذ يوم", type: "renewal" },
    { action: "إضافة موظف جديد", employee: "سارة الزهراني", time: "منذ يومين", type: "add" },
  ];

  const handleViewEmployee = (employee: any) => {
    setSelectedEmployee(employee);
    setShowEmployeeDialog(true);
    toast({
      title: "عرض الملف الوظيفي",
      description: `جاري عرض ملف ${employee.name}`,
    });
  };

  const handleEditEmployee = (employee: any) => {
    setSelectedEmployee(employee);
    setShowAddEmployeeDialog(true);
    toast({
      title: "تعديل الملف الوظيفي",
      description: `جاري تعديل ملف ${employee.name}`,
    });
  };

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setShowAddEmployeeDialog(true);
    toast({
      title: "إضافة موظف جديد",
      description: "فتح نموذج إضافة موظف جديد",
    });
  };

  const handleUploadDocuments = () => {
    setShowDocumentDialog(true);
    toast({
      title: "رفع الوثائق",
      description: "جاري فتح نموذج رفع الوثائق...",
    });
  };

  const handleSaveEmployee = () => {
    setShowAddEmployeeDialog(false);
    toast({
      title: "تم الحفظ بنجاح ✅",
      description: selectedEmployee ? "تم تحديث بيانات الموظف" : "تم إضافة الموظف الجديد",
    });
  };

  const handleDeleteEmployee = (employee: any) => {
    toast({
      title: "حذف الموظف",
      description: `تم حذف ملف ${employee.name}`,
      variant: "destructive",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "نشط": { color: "bg-green-100 text-green-800", icon: CheckCircle },
      "غير نشط": { color: "bg-gray-100 text-gray-800", icon: Clock },
      "مجاز": { color: "bg-blue-100 text-blue-800", icon: CalendarIcon },
      "منتهي الخدمة": { color: "bg-red-100 text-red-800", icon: X },
      "مكتمل": { color: "bg-green-100 text-green-800", icon: CheckCircle },
      "ناقص": { color: "bg-red-100 text-red-800", icon: AlertCircle },
      "قيد المراجعة": { color: "bg-orange-100 text-orange-800", icon: Clock },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig["نشط"];
    return (
      <Badge className={config.color}>
        <config.icon className="w-3 h-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const getUrgencyBadge = (urgency: string) => {
    const urgencyConfig = {
      "عاجل": { color: "bg-red-100 text-red-800", icon: AlertTriangle },
      "قريب": { color: "bg-orange-100 text-orange-800", icon: Clock },
      "تذكير": { color: "bg-yellow-100 text-yellow-800", icon: Bell },
    };
    
    const config = urgencyConfig[urgency as keyof typeof urgencyConfig] || urgencyConfig["تذكير"];
    return (
      <Badge className={config.color}>
        <config.icon className="w-3 h-3 mr-1" />
        {urgency}
      </Badge>
    );
  };

  const getCompletionColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 70) return "text-orange-600";
    return "text-red-600";
  };

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.empId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-xl">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              نظام الملفات الوظيفية الشامل
            </h1>
            <p className="text-slate-600 mt-2">إدارة ملفات الموظفين والوثائق الرسمية وفق أفضل الممارسات العالمية</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleUploadDocuments}
              variant="outline"
              className="hover:bg-blue-50 hover:text-blue-600 hover:scale-105 transition-all duration-300"
            >
              <Upload className="w-4 h-4 mr-2" />
              رفع وثائق
            </Button>
            <Button
              onClick={handleAddEmployee}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-4 h-4 mr-2" />
              إضافة موظف جديد
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {stats.map((stat, index) => (
            <Card 
              key={index} 
              className="group border-0 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer animate-fade-in bg-gradient-to-br from-white to-slate-50/30 backdrop-blur-sm"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg ${stat.bg} group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                    <stat.icon className={`h-5 w-5 ${stat.color} group-hover:animate-pulse`} />
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-green-600 font-medium">{stat.trend}</p>
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 group-hover:scale-110 transition-transform duration-300">{stat.value}</p>
                  <p className="text-sm font-medium text-slate-600 group-hover:text-slate-800 transition-colors duration-300">{stat.title}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="list">قائمة الموظفين</TabsTrigger>
            <TabsTrigger value="documents">الوثائق المنتهية</TabsTrigger>
            <TabsTrigger value="reports">التقارير</TabsTrigger>
            <TabsTrigger value="activity">النشاط الحديث</TabsTrigger>
            <TabsTrigger value="analytics">التحليلات الذكية</TabsTrigger>
          </TabsList>

          {/* Employee List Tab */}
          <TabsContent value="list" className="space-y-6">
            {/* Smart Search Component - Temporarily Disabled */}
            {/* <SmartSearch 
              employees={employees} 
              onEmployeeSelect={handleViewEmployee}
            /> */}

            {/* Smart Recommendations - Temporarily Disabled */}
            {/* <SmartRecommendations employees={employees} /> */}

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      ملفات الموظفين ({filteredEmployees.length})
                    </CardTitle>
                    <CardDescription>
                      إدارة البيانات الشخصية والوثائق الرسمية لجميع الموظفين
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input 
                        placeholder="البحث في ملفات الموظفين..." 
                        className="pl-10 w-80" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="تصفية حسب القسم" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع الأقسام</SelectItem>
                        <SelectItem value="maintenance">الصيانة</SelectItem>
                        <SelectItem value="sales">المبيعات</SelectItem>
                        <SelectItem value="admin">الإدارة</SelectItem>
                        <SelectItem value="hr">الموارد البشرية</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="حالة الملف" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع الحالات</SelectItem>
                        <SelectItem value="complete">مكتمل</SelectItem>
                        <SelectItem value="incomplete">ناقص</SelectItem>
                        <SelectItem value="expired">وثائق منتهية</SelectItem>
                        <SelectItem value="review">قيد المراجعة</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="hover:bg-slate-50"
                      onClick={() => {
                        toast({
                          title: "تحديث البيانات",
                          description: "تم تحديث قائمة الموظفين",
                        });
                      }}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredEmployees.map((employee, index) => (
                    <Card 
                      key={employee.id} 
                      className="group hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer border-0 shadow-md bg-gradient-to-r from-white to-slate-50/50"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <Avatar className="w-12 h-12 ring-2 ring-blue-100 group-hover:ring-blue-200 transition-all duration-300">
                              <AvatarImage src={employee.photo} alt={employee.name} />
                              <AvatarFallback className="bg-blue-100 text-blue-600 font-bold">
                                {employee.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className="font-bold text-slate-900">{employee.name}</h3>
                                {getStatusBadge(employee.status)}
                                {getStatusBadge(employee.fileStatus)}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-slate-600">
                                <span>{employee.position}</span>
                                <span className="text-slate-400">•</span>
                                <span>{employee.department}</span>
                                <span className="text-slate-400">•</span>
                                <span>{employee.empId}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-6">
                            <div className="text-center">
                              <div className="flex items-center gap-1 text-xs text-slate-500 mb-1">
                                <FileText className="w-3 h-3" />
                                {employee.documentsCount} وثيقة
                              </div>
                              <div className="flex items-center gap-1 text-xs text-slate-500">
                                <CalendarIcon className="w-3 h-3" />
                                {employee.hireDate}
                              </div>
                            </div>
                            
                            <div className="text-center min-w-[80px]">
                              <div className={`text-sm font-bold ${getCompletionColor(employee.completionPercentage)} mb-1`}>
                                {employee.completionPercentage}%
                              </div>
                              <Progress value={employee.completionPercentage} className="h-2 w-20" />
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleViewEmployee(employee)}
                                className="hover:bg-blue-50 hover:text-blue-600 transition-all duration-300"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                عرض
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEditEmployee(employee)}
                                className="hover:bg-green-50 hover:text-green-600 transition-all duration-300"
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                تعديل
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  window.print();
                                  toast({
                                    title: "طباعة الملف",
                                    description: `تم إرسال ملف ${employee.name} للطباعة`,
                                  });
                                }}
                                className="hover:bg-purple-50 hover:text-purple-600 transition-all duration-300"
                              >
                                <Printer className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleDeleteEmployee(employee)}
                                className="hover:bg-red-50 hover:text-red-600 transition-all duration-300"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Expiring Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-orange-500" />
                      الوثائق منتهية الصلاحية
                    </CardTitle>
                    <CardDescription>
                      وثائق تحتاج إلى تجديد أو متابعة
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {expiringDocuments.map((doc, index) => (
                        <Card key={index} className="group hover:shadow-md transition-all duration-300 border-r-4 border-orange-500">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <Avatar className="w-10 h-10">
                                  <AvatarFallback className="bg-orange-100 text-orange-600 text-sm">
                                    {doc.employee.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h4 className="font-medium text-slate-900">{doc.employee}</h4>
                                  <p className="text-sm text-slate-600">{doc.document}</p>
                                </div>
                              </div>
                              {getUrgencyBadge(doc.urgency)}
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1 text-slate-500">
                                  <CalendarIcon className="w-4 h-4" />
                                  تنتهي في: {doc.expiryDate}
                                </div>
                                <div className="flex items-center gap-1 text-red-600">
                                  <Clock className="w-4 h-4" />
                                  {doc.daysLeft} يوم متبقي
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button size="sm" variant="outline" className="hover:bg-blue-50">
                                  <Bell className="w-3 h-3 mr-1" />
                                  تذكير
                                </Button>
                                <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                                  <RefreshCw className="w-3 h-3 mr-1" />
                                  تجديد
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-slate-900">
                      إحصائيات سريعة
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg cursor-pointer hover:bg-green-100 transition-colors">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="font-medium">ملفات مكتملة</span>
                        </div>
                        <span className="text-green-600 font-bold">298</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors">
                        <div className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-blue-600" />
                          <span className="font-medium">موظفين نشطين</span>
                        </div>
                        <span className="text-blue-600 font-bold">312</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg cursor-pointer hover:bg-purple-100 transition-colors">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-purple-600" />
                          <span className="font-medium">متوسط الأداء</span>
                        </div>
                        <span className="text-purple-600 font-bold">4.3/5</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg cursor-pointer hover:bg-red-100 transition-colors">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-red-600" />
                          <span className="font-medium">وثائق منتهية</span>
                        </div>
                        <span className="text-red-600 font-bold">8</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg cursor-pointer hover:bg-orange-100 transition-colors">
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-orange-600" />
                          <span className="font-medium">تحتاج تحديث</span>
                        </div>
                        <span className="text-orange-600 font-bold">18</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">تقرير الملفات الشامل</h3>
                      <p className="text-sm text-gray-500">جميع بيانات الموظفين</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">تقرير الوثائق المكتملة</h3>
                      <p className="text-sm text-gray-500">الملفات المكتملة بالوثائق</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">تقرير الوثائق المنتهية</h3>
                      <p className="text-sm text-gray-500">الوثائق التي تحتاج تجديد</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  النشاط الحديث
                </CardTitle>
                <CardDescription>
                  آخر التحديثات والعمليات على ملفات الموظفين
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        {activity.type === "update" && <Edit className="w-4 h-4 text-blue-600" />}
                        {activity.type === "upload" && <Upload className="w-4 h-4 text-green-600" />}
                        {activity.type === "renewal" && <RefreshCw className="w-4 h-4 text-orange-600" />}
                        {activity.type === "add" && <Plus className="w-4 h-4 text-purple-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{activity.action}</p>
                        <p className="text-sm text-slate-600">{activity.employee}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-slate-900">
                    توزيع الموظفين حسب الأقسام
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>الصيانة</span>
                      <span className="font-bold">45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span>الاستقبال</span>
                      <span className="font-bold">25%</span>
                    </div>
                    <Progress value={25} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span>المالية</span>
                      <span className="font-bold">20%</span>
                    </div>
                    <Progress value={20} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span>الإدارة</span>
                      <span className="font-bold">10%</span>
                    </div>
                    <Progress value={10} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-slate-900">
                    معدل اكتمال الملفات
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-600 mb-2">91%</div>
                      <p className="text-sm text-slate-600">متوسط اكتمال الملفات</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="font-bold text-green-600">298</div>
                        <div className="text-slate-600">ملف مكتمل</div>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <div className="font-bold text-red-600">26</div>
                        <div className="text-slate-600">ملف ناقص</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-slate-900">
                    حالة التبويبات العشرة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: "البيانات الشخصية", completion: 98, color: "bg-green-500" },
                      { name: "البيانات القانونية", completion: 89, color: "bg-blue-500" },
                      { name: "البيانات الوظيفية", completion: 95, color: "bg-green-500" },
                      { name: "البيانات المالية", completion: 87, color: "bg-yellow-500" },
                      { name: "الحضور والإجازات", completion: 92, color: "bg-green-500" },
                      { name: "الأداء", completion: 78, color: "bg-orange-500" },
                      { name: "العهد", completion: 85, color: "bg-blue-500" },
                      { name: "الوثائق", completion: 94, color: "bg-green-500" },
                      { name: "البيانات الطبية", completion: 76, color: "bg-orange-500" },
                      { name: "إنهاء الخدمة", completion: 100, color: "bg-green-500" }
                    ].map((tab, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{tab.name}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${tab.color} transition-all duration-500`}
                              style={{ width: `${tab.completion}%` }}
                            />
                          </div>
                          <span className="text-sm font-bold">{tab.completion}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-slate-900">
                    أداء الموظفين
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span>ممتاز (4.5-5.0)</span>
                      <span className="font-bold text-green-600">45%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span>جيد جداً (4.0-4.4)</span>
                      <span className="font-bold text-blue-600">35%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                      <span>جيد (3.5-3.9)</span>
                      <span className="font-bold text-yellow-600">15%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                      <span>يحتاج تحسين</span>
                      <span className="font-bold text-red-600">5%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-slate-900">
                    الوثائق والتواريخ
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span>وثائق صالحة</span>
                      <span className="font-bold text-green-600">2,156</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                      <span>تنتهي خلال 90 يوم</span>
                      <span className="font-bold text-orange-600">45</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                      <span>منتهية الصلاحية</span>
                      <span className="font-bold text-red-600">8</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span>تم التجديد هذا الشهر</span>
                      <span className="font-bold text-blue-600">23</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Employee Details Dialog */}
        <Dialog open={showEmployeeDialog} onOpenChange={setShowEmployeeDialog}>
          <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={selectedEmployee?.photo} alt={selectedEmployee?.name} />
                  <AvatarFallback className="bg-blue-100 text-blue-600 font-bold">
                    {selectedEmployee?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div>{selectedEmployee?.name}</div>
                  <div className="text-sm font-normal text-slate-600">{selectedEmployee?.empId}</div>
                </div>
              </DialogTitle>
              <DialogDescription>
                الملف الوظيفي الشامل - {selectedEmployee?.position}
              </DialogDescription>
            </DialogHeader>

            {selectedEmployee && (
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid w-full grid-cols-8">
                  <TabsTrigger value="personal">البيانات الشخصية</TabsTrigger>
                  <TabsTrigger value="legal">البيانات القانونية</TabsTrigger>
                  <TabsTrigger value="employment">البيانات الوظيفية</TabsTrigger>
                  <TabsTrigger value="financial">البيانات المالية</TabsTrigger>
                  <TabsTrigger value="documents">الوثائق</TabsTrigger>
                  <TabsTrigger value="attendance">الحضور والإجازات</TabsTrigger>
                  <TabsTrigger value="performance">الأداء</TabsTrigger>
                  <TabsTrigger value="assets">العهد</TabsTrigger>
                </TabsList>

                {/* Personal Information Tab */}
                <TabsContent value="personal" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        البيانات الشخصية الأساسية
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-600">الاسم بالعربية</Label>
                          <div className="p-3 bg-slate-50 rounded-lg">{selectedEmployee.name}</div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-600">الاسم بالإنجليزية</Label>
                          <div className="p-3 bg-slate-50 rounded-lg">{selectedEmployee.nameEn}</div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-600">الجنس</Label>
                          <div className="p-3 bg-slate-50 rounded-lg">{selectedEmployee.gender}</div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-600">الجنسية</Label>
                          <div className="p-3 bg-slate-50 rounded-lg">{selectedEmployee.nationality}</div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-600">تاريخ الميلاد</Label>
                          <div className="p-3 bg-slate-50 rounded-lg">{selectedEmployee.birthDate}</div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-600">الحالة الاجتماعية</Label>
                          <div className="p-3 bg-slate-50 rounded-lg">{selectedEmployee.maritalStatus}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Phone className="w-5 h-5" />
                        بيانات الاتصال
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-600">رقم الجوال</Label>
                          <div className="p-3 bg-slate-50 rounded-lg flex items-center gap-2">
                            <Phone className="w-4 h-4 text-slate-500" />
                            {selectedEmployee.phone}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-600">البريد الإلكتروني</Label>
                          <div className="p-3 bg-slate-50 rounded-lg flex items-center gap-2">
                            <Mail className="w-4 h-4 text-slate-500" />
                            {selectedEmployee.email}
                          </div>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label className="text-sm font-medium text-slate-600">العنوان</Label>
                          <div className="p-3 bg-slate-50 rounded-lg flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-slate-500" />
                            {selectedEmployee.address}
                          </div>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label className="text-sm font-medium text-slate-600">جهة الاتصال للطوارئ</Label>
                          <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                            <div className="flex items-center gap-2 text-red-700">
                              <AlertCircle className="w-4 h-4" />
                              {selectedEmployee.emergencyContact}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Legal Information Tab */}
                <TabsContent value="legal" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <IdCard className="w-5 h-5" />
                        الوثائق الرسمية
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-600">رقم الهوية الوطنية</Label>
                          <div className="p-3 bg-slate-50 rounded-lg">{selectedEmployee.nationalId}</div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-600">رقم الإقامة</Label>
                          <div className="p-3 bg-slate-50 rounded-lg">{selectedEmployee.residenceId}</div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-600">انتهاء الإقامة</Label>
                          <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                            <div className="flex items-center gap-2 text-orange-700">
                              <CalendarIcon className="w-4 h-4" />
                              {selectedEmployee.residenceExpiry}
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-600">رقم الجواز</Label>
                          <div className="p-3 bg-slate-50 rounded-lg">{selectedEmployee.passportNumber}</div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-600">انتهاء الجواز</Label>
                          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex items-center gap-2 text-green-700">
                              <CalendarIcon className="w-4 h-4" />
                              {selectedEmployee.passportExpiry}
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-600">تصريح العمل</Label>
                          <div className="p-3 bg-slate-50 rounded-lg">{selectedEmployee.workPermit}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Employment Information Tab */}
                <TabsContent value="employment" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Briefcase className="w-5 h-5" />
                        البيانات الوظيفية
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-600">الرقم الوظيفي</Label>
                          <div className="p-3 bg-blue-50 rounded-lg font-mono">{selectedEmployee.empId}</div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-600">المسمى الوظيفي</Label>
                          <div className="p-3 bg-slate-50 rounded-lg">{selectedEmployee.position}</div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-600">القسم</Label>
                          <div className="p-3 bg-slate-50 rounded-lg">{selectedEmployee.department}</div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-600">الفرع</Label>
                          <div className="p-3 bg-slate-50 rounded-lg">{selectedEmployee.branch}</div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-600">المدير المباشر</Label>
                          <div className="p-3 bg-slate-50 rounded-lg">{selectedEmployee.manager}</div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-600">تاريخ التعيين</Label>
                          <div className="p-3 bg-green-50 rounded-lg">{selectedEmployee.hireDate}</div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-600">حالة الموظف</Label>
                          <div className="p-3 bg-slate-50 rounded-lg">
                            {getStatusBadge(selectedEmployee.status)}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-600">تقييم الأداء</Label>
                          <div className="p-3 bg-yellow-50 rounded-lg flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-500" />
                            {selectedEmployee.performanceRating}/5
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Financial Information Tab */}
                <TabsContent value="financial" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5" />
                        البيانات المالية
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-600">الراتب الأساسي</Label>
                          <div className="p-3 bg-green-50 rounded-lg font-bold text-green-700">
                            {selectedEmployee.basicSalary.toLocaleString()} جنيه
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-600">البدلات</Label>
                          <div className="p-3 bg-blue-50 rounded-lg font-bold text-blue-700">
                            {selectedEmployee.allowances.toLocaleString()} جنيه
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-600">إجمالي الراتب</Label>
                          <div className="p-3 bg-purple-50 rounded-lg font-bold text-purple-700">
                            {(selectedEmployee.basicSalary + selectedEmployee.allowances).toLocaleString()} جنيه
                          </div>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label className="text-sm font-medium text-slate-600">رقم الحساب البنكي (IBAN)</Label>
                          <div className="p-3 bg-slate-50 rounded-lg font-mono text-sm">
                            {selectedEmployee.bankAccount}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Documents Tab */}
                <TabsContent value="documents" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        الوثائق والأرشفة
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {documentTypes.map((docType, index) => (
                          <Card key={index} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <docType.icon className="w-5 h-5 text-slate-600" />
                                  <span className="font-medium">{docType.name}</span>
                                </div>
                                {docType.required && (
                                  <Badge className="bg-red-100 text-red-800 text-xs">مطلوب</Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <Button size="sm" variant="outline" className="flex-1">
                                  <Eye className="w-3 h-3 mr-1" />
                                  عرض
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Download className="w-3 h-3" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Upload className="w-3 h-3" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Attendance & Leave Tab */}
                <TabsContent value="attendance" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CalendarIcon className="w-5 h-5" />
                        الحضور والإجازات
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-600">رصيد الإجازات السنوية</Label>
                          <div className="p-3 bg-blue-50 rounded-lg font-bold text-blue-700">
                            {selectedEmployee.vacationBalance} يوم
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-600">الإجازات المستخدمة</Label>
                          <div className="p-3 bg-orange-50 rounded-lg font-bold text-orange-700">
                            {30 - selectedEmployee.vacationBalance} يوم
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-600">معدل الحضور</Label>
                          <div className="p-3 bg-green-50 rounded-lg font-bold text-green-700">
                            96%
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Performance Tab */}
                <TabsContent value="performance" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Star className="w-5 h-5" />
                        الأداء والتقييمات
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-600">التقييم العام</Label>
                          <div className="p-3 bg-yellow-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Star className="w-5 h-5 text-yellow-500" />
                              <span className="font-bold text-yellow-700">
                                {selectedEmployee.performanceRating}/5.0
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-600">آخر تقييم</Label>
                          <div className="p-3 bg-slate-50 rounded-lg">
                            ديسمبر 2023
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Assets Tab */}
                <TabsContent value="assets" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        العهد والممتلكات
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-blue-600" />
                            <span>جهاز كمبيوتر محمول</span>
                          </div>
                          <Badge className="bg-green-100 text-green-800">مُسلم</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Phone className="w-5 h-5 text-blue-600" />
                            <span>هاتف محمول للعمل</span>
                          </div>
                          <Badge className="bg-green-100 text-green-800">مُسلم</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <IdCard className="w-5 h-5 text-blue-600" />
                            <span>بطاقة دخول</span>
                          </div>
                          <Badge className="bg-green-100 text-green-800">مُسلم</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setShowEmployeeDialog(false)}>
                إغلاق
              </Button>
              <Button onClick={() => {
                setShowEmployeeDialog(false);
                handleEditEmployee(selectedEmployee);
              }}>
                <Edit className="w-4 h-4 mr-2" />
                تعديل
              </Button>
              <Button onClick={() => {
                toast({
                  title: "تم طباعة الملف ✅",
                  description: "تم إرسال الملف للطباعة",
                });
              }}>
                <Printer className="w-4 h-4 mr-2" />
                طباعة
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add/Edit Employee Dialog */}
        <Dialog open={showAddEmployeeDialog} onOpenChange={setShowAddEmployeeDialog}>
          <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedEmployee ? "تعديل ملف الموظف" : "إضافة موظف جديد"}
              </DialogTitle>
              <DialogDescription>
                {selectedEmployee ? "تعديل بيانات الموظف الحالي" : "إنشاء ملف وظيفي جديد شامل"}
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="personal" className="w-full">
              {/* Enhanced Employee Master File with 10 comprehensive tabs */}
              <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10">
                <TabsTrigger value="personal">الشخصية</TabsTrigger>
                <TabsTrigger value="legal">القانونية</TabsTrigger>
                <TabsTrigger value="employment">الوظيفية</TabsTrigger>
                <TabsTrigger value="financial">المالية</TabsTrigger>
                <TabsTrigger value="attendance">الحضور</TabsTrigger>
                <TabsTrigger value="performance">الأداء</TabsTrigger>
                <TabsTrigger value="assets">العهد</TabsTrigger>
                <TabsTrigger value="documents">الوثائق</TabsTrigger>
                <TabsTrigger value="medical">الطبية</TabsTrigger>
                <TabsTrigger value="offboarding">إنهاء الخدمة</TabsTrigger>
              </TabsList>

              <TabsContent value="personal">
                <PersonalInfoTab formData={formData} setFormData={setFormData} />
              </TabsContent>
              
              <TabsContent value="legal">
                <LegalInfoTab formData={formData} setFormData={setFormData} />
              </TabsContent>
              
              <TabsContent value="employment">
                <EmploymentInfoTab formData={formData} setFormData={setFormData} />
              </TabsContent>
              
              <TabsContent value="financial">
                <FinancialInfoTab formData={formData} setFormData={setFormData} />
              </TabsContent>

              <TabsContent value="attendance">
                <AttendanceLeaveTab formData={formData} setFormData={setFormData} />
              </TabsContent>

              <TabsContent value="performance">
                <PerformanceTab formData={formData} setFormData={setFormData} />
              </TabsContent>

              <TabsContent value="assets">
                <AssetsTab formData={formData} setFormData={setFormData} />
              </TabsContent>

              <TabsContent value="documents">
                <DocumentsTab formData={formData} setFormData={setFormData} />
              </TabsContent>

              <TabsContent value="medical">
                <MedicalTab formData={formData} setFormData={setFormData} />
              </TabsContent>

              <TabsContent value="offboarding">
                <OffboardingTab formData={formData} setFormData={setFormData} />
              </TabsContent>
            </Tabs>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setShowAddEmployeeDialog(false)}>
                إلغاء
              </Button>
              <Button variant="outline" onClick={() => {
                toast({
                  title: "تم حفظ المسودة",
                  description: "تم حفظ البيانات كمسودة",
                });
              }}>
                <Save className="w-4 h-4 mr-2" />
                حفظ كمسودة
              </Button>
              <Button onClick={handleSaveEmployee}>
                <CheckCircle className="w-4 h-4 mr-2" />
                {selectedEmployee ? "تحديث البيانات" : "إضافة الموظف"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Upload Documents Dialog */}
        <Dialog open={showDocumentDialog} onOpenChange={setShowDocumentDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>رفع الوثائق</DialogTitle>
              <DialogDescription>
                رفع وثائق جديدة أو تحديث الوثائق الموجودة
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="employee-select">اختر الموظف</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الموظف" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.empId}>
                        {employee.name} - {employee.empId}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="document-type">نوع الوثيقة</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع الوثيقة" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentTypes.map((docType, index) => (
                      <SelectItem key={index} value={docType.name}>
                        {docType.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>رفع الملف</Label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                  <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 mb-2">اسحب الملفات هنا أو انقر للاختيار</p>
                  <p className="text-sm text-slate-500">PDF, DOC, DOCX, JPG, PNG (حد أقصى 10MB)</p>
                  <Button variant="outline" className="mt-4">
                    اختيار الملفات
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">ملاحظات</Label>
                <Textarea id="notes" placeholder="أي ملاحظات إضافية حول الوثيقة..." />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setShowDocumentDialog(false)}>
                إلغاء
              </Button>
              <Button onClick={() => {
                setShowDocumentDialog(false);
                toast({
                  title: "تم رفع الوثيقة بنجاح ✅",
                  description: "تم حفظ الوثيقة وربطها بملف الموظف",
                });
              }}>
                <Upload className="w-4 h-4 mr-2" />
                رفع الوثيقة
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default EmployeeFiles;