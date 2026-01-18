import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { 
  FileText, 
  Search, 
  Plus, 
  Edit, 
  Eye, 
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Building2,
  User,
  Calendar as CalendarIcon,
  DollarSign,
  FileCheck,
  Filter,
  MoreVertical,
  Send,
  Copy,
  Archive,
  Trash2,
  Bell
} from "lucide-react";
import { cn } from "@/lib/utils";

const ContractManagement = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [selectedContract, setSelectedContract] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [contractType, setContractType] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  // Sample contract data following global best practices
  const contracts = [
    {
      id: "CON-2024-001",
      employeeName: "أحمد محمد العتيبي",
      employeeId: "EMP001",
      contractType: "دائم",
      position: "فني صيانة سيارات",
      department: "الصيانة",
      startDate: "2024-01-15",
      endDate: "2026-01-14",
      baseSalary: 8500,
      allowances: 2000,
      totalCompensation: 10500,
      probationPeriod: 90,
      noticePeriod: 60,
      status: "نشط",
      renewalStatus: "تجديد تلقائي",
      workingHours: "8 ساعات يوميا",
      workingDays: "الأحد - الخميس",
      location: "الفرع الرئيسي - الرياض",
      reportingManager: "محمد السعيد",
      lastUpdated: "2024-01-15",
      signedBy: "إدارة الموارد البشرية",
      contractLanguage: "العربية",
      legalCompliance: "نظام العمل المصري",
      benefits: ["تأمين طبي", "إجازة سنوية", "مكافأة نهاية الخدمة"],
      restrictionsAndClauses: ["عدم منافسة", "سرية المعلومات", "حقوق الملكية الفكرية"],
      amendmentHistory: []
    },
    {
      id: "CON-2024-002",
      employeeName: "فاطمة علي الأحمدي",
      employeeId: "EMP002",
      contractType: "مؤقت",
      position: "مستقبل عملاء",
      department: "الاستقبال",
      startDate: "2024-03-01",
      endDate: "2024-12-31",
      baseSalary: 6000,
      allowances: 1500,
      totalCompensation: 7500,
      probationPeriod: 30,
      noticePeriod: 30,
      status: "نشط",
      renewalStatus: "يحتاج مراجعة",
      workingHours: "8 ساعات يوميا",
      workingDays: "الأحد - الخميس",
      location: "الفرع الرئيسي - الرياض",
      reportingManager: "نورا الشمري",
      lastUpdated: "2024-03-01",
      signedBy: "إدارة الموارد البشرية",
      contractLanguage: "العربية",
      legalCompliance: "نظام العمل المصري",
      benefits: ["تأمين طبي", "إجازة سنوية"],
      restrictionsAndClauses: ["سرية المعلومات"],
      amendmentHistory: []
    },
    {
      id: "CON-2024-003",
      employeeName: "محمد سعد القحطاني",
      employeeId: "EMP003",
      contractType: "دائم",
      position: "محاسب",
      department: "المالية",
      startDate: "2023-06-20",
      endDate: "2025-06-19",
      baseSalary: 12000,
      allowances: 3000,
      totalCompensation: 15000,
      probationPeriod: 90,
      noticePeriod: 90,
      status: "نشط",
      renewalStatus: "تم التجديد",
      workingHours: "8 ساعات يوميا",
      workingDays: "الأحد - الخميس",
      location: "الفرع الرئيسي - الرياض",
      reportingManager: "سارة العتيبي",
      lastUpdated: "2023-06-20",
      signedBy: "إدارة الموارد البشرية",
      contractLanguage: "العربية/الإنجليزية",
      legalCompliance: "نظام العمل المصري + IFRS",
      benefits: ["تأمين طبي شامل", "إجازة سنوية", "مكافأة نهاية الخدمة", "تدريب مهني"],
      restrictionsAndClauses: ["عدم منافسة", "سرية المعلومات", "حقوق الملكية الفكرية"],
      amendmentHistory: [
        { date: "2024-01-01", type: "زيادة راتب", details: "زيادة الراتب الأساسي بنسبة 10%" }
      ]
    }
  ];

  // Contract statistics
  const contractStats = [
    { title: "إجمالي العقود", value: "324", icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "العقود النشطة", value: "298", icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
    { title: "تنتهي خلال 30 يوم", value: "8", icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
    { title: "تحتاج تجديد", value: "18", icon: RefreshCw, color: "text-orange-600", bg: "bg-orange-50" },
    { title: "العقود المؤقتة", value: "45", icon: Clock, color: "text-purple-600", bg: "bg-purple-50" },
    { title: "متوسط الراتب", value: "9,800 جنيه", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" }
  ];

  // Contract templates based on global best practices
  const contractTemplates = [
    {
      id: "TEMP-001",
      name: "عقد عمل دائم - موظف مصري",
      description: "قالب للموظفين المصريين بعقود دائمة",
      language: "العربية",
      type: "دائم",
      compliance: "نظام العمل المصري",
      lastUpdated: "2024-01-01"
    },
    {
      id: "TEMP-002",
      name: "عقد عمل مؤقت - مشروع محدد",
      description: "قالب للمشاريع المؤقتة والمحددة المدة",
      language: "العربية/الإنجليزية",
      type: "مؤقت",
      compliance: "نظام العمل المصري",
      lastUpdated: "2024-01-01"
    },
    {
      id: "TEMP-003",
      name: "عقد عمل إداري - مناصب قيادية",
      description: "قالب للمناصب الإدارية والقيادية",
      language: "العربية/الإنجليزية",
      type: "دائم",
      compliance: "نظام العمل المصري + حوكمة الشركات",
      lastUpdated: "2024-01-01"
    },
    {
      id: "TEMP-004",
      name: "عقد عمل عن بُعد",
      description: "قالب للعمل عن بُعد والعمل المرن",
      language: "العربية/الإنجليزية",
      type: "مرن",
      compliance: "نظام العمل المصري + لوائح العمل عن بُعد",
      lastUpdated: "2024-01-01"
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "نشط": { color: "bg-green-100 text-green-800", icon: CheckCircle },
      "منتهي": { color: "bg-red-100 text-red-800", icon: Clock },
      "معلق": { color: "bg-yellow-100 text-yellow-800", icon: AlertTriangle },
      "مسودة": { color: "bg-gray-100 text-gray-800", icon: Edit }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig["نشط"];
    return (
      <Badge className={config.color}>
        <config.icon className="w-3 h-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const getRenewalBadge = (renewal: string) => {
    const renewalConfig = {
      "تجديد تلقائي": { color: "bg-green-100 text-green-800", icon: RefreshCw },
      "يحتاج مراجعة": { color: "bg-orange-100 text-orange-800", icon: AlertTriangle },
      "تم التجديد": { color: "bg-blue-100 text-blue-800", icon: CheckCircle },
      "لا يجدد": { color: "bg-red-100 text-red-800", icon: Clock }
    };
    
    const config = renewalConfig[renewal as keyof typeof renewalConfig] || renewalConfig["يحتاج مراجعة"];
    return (
      <Badge className={config.color}>
        <config.icon className="w-3 h-3 mr-1" />
        {renewal}
      </Badge>
    );
  };

  const handleCreateContract = () => {
    setShowCreateDialog(true);
    toast({
      title: "إنشاء عقد جديد",
      description: "جاري فتح نموذج إنشاء عقد العمل الجديد"
    });
  };

  const handleViewContract = (contract: any) => {
    setSelectedContract(contract);
    toast({
      title: "عرض العقد",
      description: `جاري عرض عقد ${contract.employeeName}`
    });
  };

  const handleRenewContract = (contract: any) => {
    toast({
      title: "تجديد العقد",
      description: `جاري تجديد عقد ${contract.employeeName}`,
    });
  };

  const handleTerminateContract = (contract: any) => {
    toast({
      title: "إنهاء العقد",
      description: `جاري إنهاء عقد ${contract.employeeName}`,
      variant: "destructive"
    });
  };

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || contract.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <div className="p-2 bg-emerald-50 rounded-xl">
              <FileText className="w-6 h-6 text-emerald-600" />
            </div>
            إدارة عقود العمل الذكية
          </h2>
          <p className="text-slate-600 mt-1">إدارة شاملة لعقود العمل وفق أفضل الممارسات العالمية والامتثال التنظيمي</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowTemplateDialog(true)}
            variant="outline"
            className="hover:bg-emerald-50 hover:text-emerald-600"
          >
            <FileCheck className="w-4 h-4 mr-2" />
            قوالب العقود
          </Button>
          <Button
            onClick={handleCreateContract}
            className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
          >
            <Plus className="w-4 h-4 mr-2" />
            إنشاء عقد جديد
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {contractStats.map((stat, index) => (
          <Card 
            key={index} 
            className="border-0 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm font-medium text-slate-600">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="active">العقود النشطة</TabsTrigger>
          <TabsTrigger value="expiring">العقود المنتهية</TabsTrigger>
          <TabsTrigger value="templates">قوالب العقود</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Search and Filters */}
            <Card className="lg:col-span-3 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  البحث والتصفية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="search">البحث</Label>
                    <Input
                      id="search"
                      placeholder="ابحث عن موظف أو رقم عقد..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">حالة العقد</Label>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الحالة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع الحالات</SelectItem>
                        <SelectItem value="نشط">نشط</SelectItem>
                        <SelectItem value="منتهي">منتهي</SelectItem>
                        <SelectItem value="معلق">معلق</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="type">نوع العقد</Label>
                    <Select value={contractType} onValueChange={setContractType}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر النوع" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع الأنواع</SelectItem>
                        <SelectItem value="دائم">دائم</SelectItem>
                        <SelectItem value="مؤقت">مؤقت</SelectItem>
                        <SelectItem value="مرن">مرن</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button className="w-full">
                      <Filter className="w-4 h-4 mr-2" />
                      تطبيق التصفية
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contracts Table */}
            <Card className="lg:col-span-3 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  قائمة العقود ({filteredContracts.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>رقم العقد</TableHead>
                        <TableHead>اسم الموظف</TableHead>
                        <TableHead>المنصب</TableHead>
                        <TableHead>نوع العقد</TableHead>
                        <TableHead>تاريخ البداية</TableHead>
                        <TableHead>تاريخ النهاية</TableHead>
                        <TableHead>الراتب الإجمالي</TableHead>
                        <TableHead>الحالة</TableHead>
                        <TableHead>حالة التجديد</TableHead>
                        <TableHead>الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredContracts.map((contract) => (
                        <TableRow key={contract.id} className="hover:bg-slate-50">
                          <TableCell className="font-medium">{contract.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-slate-400" />
                              {contract.employeeName}
                            </div>
                          </TableCell>
                          <TableCell>{contract.position}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{contract.contractType}</Badge>
                          </TableCell>
                          <TableCell>{contract.startDate}</TableCell>
                          <TableCell>{contract.endDate}</TableCell>
                          <TableCell className="font-semibold">
                            {contract.totalCompensation.toLocaleString()} جنيه
                          </TableCell>
                          <TableCell>{getStatusBadge(contract.status)}</TableCell>
                          <TableCell>{getRenewalBadge(contract.renewalStatus)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewContract(contract)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRenewContract(contract)}
                              >
                                <RefreshCw className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Active Contracts Tab */}
        <TabsContent value="active">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>العقود النشطة</CardTitle>
              <CardDescription>
                عرض تفصيلي للعقود النشطة حاليا
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-slate-500 py-8">سيتم عرض العقود النشطة هنا</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Expiring Contracts Tab */}
        <TabsContent value="expiring">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>العقود المنتهية</CardTitle>
              <CardDescription>
                العقود التي تنتهي قريبا أو انتهت صلاحيتها
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-slate-500 py-8">سيتم عرض العقود المنتهية هنا</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {contractTemplates.map((template) => (
              <Card key={template.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">النوع:</span>
                      <Badge variant="outline">{template.type}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">اللغة:</span>
                      <span className="text-sm">{template.language}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">آخر تحديث:</span>
                      <span className="text-sm">{template.lastUpdated}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      عرض
                    </Button>
                    <Button size="sm" variant="outline">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Contract Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>إنشاء عقد عمل جديد</DialogTitle>
            <DialogDescription>
              املأ البيانات التالية لإنشاء عقد عمل جديد وفق الأنظمة واللوائح
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="employee">الموظف</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الموظف" />
                </SelectTrigger>
                <SelectContent>
                  {contracts.map((contract) => (
                    <SelectItem key={contract.employeeId} value={contract.employeeId}>
                      {contract.employeeName} - {contract.employeeId}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="template">قالب العقد</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="اختر القالب" />
                </SelectTrigger>
                <SelectContent>
                  {contractTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="contractType">نوع العقد</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع العقد" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="دائم">دائم</SelectItem>
                  <SelectItem value="مؤقت">مؤقت</SelectItem>
                  <SelectItem value="مرن">مرن</SelectItem>
                  <SelectItem value="تجريبي">تجريبي</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="startDate">تاريخ بداية العقد</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP", { locale: ar }) : "اختر التاريخ"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="endDate">تاريخ نهاية العقد</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP", { locale: ar }) : "اختر التاريخ"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="baseSalary">الراتب الأساسي</Label>
              <Input
                id="baseSalary"
                type="number"
                placeholder="0.00"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              إلغاء
            </Button>
            <Button onClick={() => setShowCreateDialog(false)}>
              إنشاء العقد
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Templates Dialog */}
      <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>قوالب عقود العمل</DialogTitle>
            <DialogDescription>
              مجموعة شاملة من قوالب العقود المعتمدة وفق الأنظمة المصرية والممارسات العالمية
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contractTemplates.map((template) => (
              <Card key={template.id} className="border shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-emerald-600" />
                    {template.name}
                  </CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-slate-600">النوع:</span>
                      <Badge variant="outline">{template.type}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-slate-600">اللغة:</span>
                      <span className="text-sm">{template.language}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-slate-600">الامتثال:</span>
                      <span className="text-xs text-green-600">{template.compliance}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-slate-600">آخر تحديث:</span>
                      <span className="text-sm">{template.lastUpdated}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      معاينة
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      تحميل
                    </Button>
                    <Button size="sm" variant="outline">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={() => setShowTemplateDialog(false)}>
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContractManagement;