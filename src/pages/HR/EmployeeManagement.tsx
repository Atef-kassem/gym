import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  Users, Plus, Search, Edit, Trash2, Save, UserCog, Mail, Phone, Calendar, Briefcase,
  Download, Filter, X, Eye, MoreVertical, FileText, TrendingUp, Award, Clock,
  MapPin, CreditCard, Building, GraduationCap, DollarSign, CheckCircle
} from "lucide-react";
import {
  useGetAllEmployeesQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
  useGetDepartmentsQuery,
  useGetPositionsQuery,
  useCreateDepartmentMutation,
} from "@/services/employeesApi";

const EmployeeManagement = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDepartment, setFilterDepartment] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPosition, setFilterPosition] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const { toast } = useToast();

  // جلب الموظفين الحقيقيين من API
  const {
    data: employeesResponse,
    isLoading: isEmployeesLoading,
    isError: isEmployeesError,
  } = useGetAllEmployeesQuery({});
  const employees = Array.isArray(employeesResponse?.data)
    ? employeesResponse.data
    : [];

  // جلب الأقسام والمناصب من API
  const { data: departmentsResponse } = useGetDepartmentsQuery(undefined as any);
  const { data: positionsResponse } = useGetPositionsQuery(undefined as any);

  const departmentsFromApi: string[] = Array.isArray(
    (departmentsResponse as any)?.data
  )
    ? (departmentsResponse as any).data.map(
        (d: any) => d.name || d.arabicName || d.englishName
      )
    : [];
  const positionsFromApi: string[] = Array.isArray(
    (positionsResponse as any)?.data
  )
    ? (positionsResponse as any).data.map(
        (p: any) => p.name || p.arabicName || p.englishName
      )
    : [];
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [isAddDepartmentDialogOpen, setIsAddDepartmentDialogOpen] = useState(false);
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    department: "",
    email: "",
    phone: "",
    hireDate: "",
    salary: "",
    notes: ""
  });

  // Mutations حقيقية مع الـ backend
  const [createEmployee] = useCreateEmployeeMutation();
  const [updateEmployee] = useUpdateEmployeeMutation();
  const [deleteEmployee] = useDeleteEmployeeMutation();
  const [createDepartment] = useCreateDepartmentMutation();

  const handleAdd = () => {
    setFormData({
      name: "",
      position: "",
      department: "",
      email: "",
      phone: "",
      hireDate: "",
      salary: "",
      notes: ""
    });
    setIsAddDialogOpen(true);
  };

  const handleEdit = (employee: any) => {
    setSelectedEmployee(employee);
    
    // استخراج القسم والمنصب بشكل صحيح (قد يكونان كائنات أو نصوص)
    const departmentName = typeof employee.department === 'string' 
      ? employee.department 
      : employee.department?.name 
      ? employee.department.name 
      : employee.Department?.name || "";
    
    const positionName = typeof employee.position === 'string' 
      ? employee.position 
      : employee.position?.name 
      ? employee.position.name 
      : employee.Position?.name || "";
    
    setFormData({
      name: employee.arabicName || employee.name,
      position: positionName,
      department: departmentName,
      email: employee.email || "",
      phone: employee.phoneNumber || employee.phone || "",
      hireDate: employee.hireDate || "",
      salary: (employee.basicSalary ?? employee.salary ?? "").toString(),
      notes: employee.notes || employee.bio || ""
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (employee: any) => {
    setSelectedEmployee(employee);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveAdd = async () => {
    if (!formData.name || !formData.position || !formData.department || !formData.email) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    try {
      const payload: any = {
        arabicName: formData.name,
        email: formData.email,
        phone: formData.phone || "-", // مطلوب في الموديل ولا يقبل null
        hireDate: formData.hireDate || null,
        salary: formData.salary ? parseFloat(formData.salary) : 0,
        notes: formData.notes || null,
        employeeType: "employee",
        isActive: true,
      };

      // ربط الموظف بفرع المستخدم الحالي إن وجد
      if (user?.branchId) {
        payload.branchId = user.branchId;
      }

      await createEmployee(payload).unwrap();

      setIsAddDialogOpen(false);
      toast({
        title: "نجح",
        description: "تم إضافة الموظف بنجاح"
      });
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error?.data?.message || "حدث خطأ أثناء إضافة الموظف",
        variant: "destructive"
      });
    }
  };

  const handleSaveEdit = async () => {
    if (!formData.name || !formData.position || !formData.department || !formData.email) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    try {
      const payload: any = {
        arabicName: formData.name,
        email: formData.email,
        phone: formData.phone || "-",
        hireDate: formData.hireDate || null,
        salary: formData.salary ? parseFloat(formData.salary) : 0,
        notes: formData.notes || null,
      };

      if (user?.branchId) {
        payload.branchId = user.branchId;
      }

      await updateEmployee({ id: selectedEmployee.id, formData: payload }).unwrap();

      setIsEditDialogOpen(false);
      setSelectedEmployee(null);
      toast({
        title: "نجح",
        description: "تم تحديث بيانات الموظف بنجاح"
      });
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error?.data?.message || "حدث خطأ أثناء تحديث بيانات الموظف",
        variant: "destructive"
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedEmployee) return;
    try {
      await deleteEmployee(selectedEmployee.id).unwrap();
      setIsDeleteDialogOpen(false);
      setSelectedEmployee(null);
      toast({
        title: "نجح",
        description: "تم حذف الموظف بنجاح"
      });
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error?.data?.message || "حدث خطأ أثناء حذف الموظف",
        variant: "destructive"
      });
    }
  };

  // إضافة قسم جديد
  const handleSaveDepartment = async () => {
    const name = newDepartmentName.trim();
    if (!name) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال اسم القسم",
        variant: "destructive",
      });
      return;
    }

    try {
      await createDepartment({ name }).unwrap();
      setNewDepartmentName("");
      setIsAddDepartmentDialogOpen(false);
      toast({
        title: "نجح",
        description: "تم إضافة القسم بنجاح",
      });
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error?.data?.message || "حدث خطأ أثناء إضافة القسم",
        variant: "destructive",
      });
    }
  };

  // فلترة الموظفين
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp: any) => {
      // استخراج أسماء القسم والمنصب بشكل صحيح
      const departmentName = typeof emp.department === 'string' 
        ? emp.department 
        : emp.department?.name 
        ? emp.department.name 
        : emp.Department?.name || '';
      
      const positionName = typeof emp.position === 'string' 
        ? emp.position 
        : emp.position?.name 
        ? emp.position.name 
        : emp.Position?.name || '';
      
      const matchesSearch = !searchQuery || 
        (emp.arabicName || emp.name || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (emp.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (emp.phoneNumber || emp.phone || "").includes(searchQuery) ||
        positionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        departmentName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const statusValue = emp.status || emp.employmentStatus;

      const matchesDepartment =
        filterDepartment === "all" || departmentName === filterDepartment;
      const matchesStatus = filterStatus === "all" || statusValue === filterStatus;
      const matchesPosition =
        filterPosition === "all" || positionName === filterPosition;
      
      return matchesSearch && matchesDepartment && matchesStatus && matchesPosition;
    });
  }, [employees, searchQuery, filterDepartment, filterStatus, filterPosition]);

  // إحصائيات سريعة
  const stats = useMemo(() => {
    const active = employees.filter((e: any) => (e.status || e.employmentStatus) === "نشط").length;
    const onLeave = employees.filter((e: any) => (e.status || e.employmentStatus) === "إجازة").length;
    const resigned = employees.filter((e: any) => (e.status || e.employmentStatus) === "مستقيل").length;
    const totalSalary = employees.reduce(
      (sum: number, e: any) => sum + (e.basicSalary || e.salary || 0),
      0
    );
    const avgSalary = employees.length > 0 ? totalSalary / employees.length : 0;
    const avgPerformance =
      employees.length > 0
        ? employees.reduce((sum: number, e: any) => sum + (e.performance || 0), 0) /
          employees.length
        : 0;

    return { active, onLeave, resigned, totalSalary, avgSalary, avgPerformance };
  }, [employees]);

  const departments: string[] =
    departmentsFromApi.length > 0
      ? departmentsFromApi
      : Array.from(
          new Set(
            employees.map(
              (e: any) => (e.department || e.Department?.name) as string | undefined
            )
          )
        ).filter((v): v is string => Boolean(v));
  const positions: string[] =
    positionsFromApi.length > 0
      ? positionsFromApi
      : Array.from(
          new Set(
            employees.map(
              (e: any) => (e.position || e.Position?.name) as string | undefined
            )
          )
        ).filter((v): v is string => Boolean(v));
  const statuses: string[] = Array.from(
    new Set(
      employees.map(
        (e: any) => (e.status || e.employmentStatus) as string | undefined
      )
    )
  ).filter((v): v is string => Boolean(v));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* العنوان والأزرار */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">إدارة الموظفين</h1>
            <p className="text-gray-600 mt-1">إدارة بيانات الموظفين والمعلومات الأساسية</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="البحث عن موظف..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              فلتر
              {(filterDepartment !== "all" || filterStatus !== "all" || filterPosition !== "all") && (
                <Badge className="bg-blue-500">{[filterDepartment, filterStatus, filterPosition].filter(f => f !== "all").length}</Badge>
              )}
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              تصدير
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAdd}>
              <Plus className="w-5 h-5 ml-2" />
              إضافة موظف
            </Button>
          </div>
        </div>

        {/* البطاقات الإحصائية */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>إجمالي الموظفين</span>
                <Users className="w-5 h-5 text-blue-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{employees.length}</div>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Badge className="bg-green-500">{stats.active} نشط</Badge>
                <Badge className="bg-amber-500">{stats.onLeave} إجازة</Badge>
                {stats.resigned > 0 && <Badge variant="destructive">{stats.resigned} مستقيل</Badge>}
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>متوسط الراتب</span>
                <DollarSign className="w-5 h-5 text-green-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{Math.round(stats.avgSalary).toLocaleString()} ج.م</div>
              <p className="text-sm text-gray-500 mt-1">إجمالي: {stats.totalSalary.toLocaleString()} ج.م</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>متوسط الأداء</span>
                <Award className="w-5 h-5 text-purple-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{Math.round(stats.avgPerformance)}%</div>
              <p className="text-sm text-gray-500 mt-1">تقييم الأداء الشهري</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>الأقسام</span>
                <Building className="w-5 h-5 text-amber-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">{departments.length}</div>
              <p className="text-sm text-gray-500 mt-1">قسم نشط</p>
            </CardContent>
          </Card>
        </div>

        {/* الفلاتر */}
        {showFilters && (
          <Card className="border-2 border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-blue-600" />
                  الفلاتر
                </span>
                <Button variant="ghost" size="sm" onClick={() => {
                  setFilterDepartment("all");
                  setFilterStatus("all");
                  setFilterPosition("all");
                }}>
                  <X className="w-4 h-4 ml-1" />
                  إعادة تعيين
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>القسم</Label>
                  <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                    <SelectTrigger>
                      <SelectValue placeholder="جميع الأقسام" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">جميع الأقسام</SelectItem>
                        {departments.map((dept: string) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>الحالة</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="جميع الحالات" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">جميع الحالات</SelectItem>
                        {statuses.map((status: string) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>المنصب</Label>
                  <Select value={filterPosition} onValueChange={setFilterPosition}>
                    <SelectTrigger>
                      <SelectValue placeholder="جميع المناصب" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">جميع المناصب</SelectItem>
                        {positions.map((position: string) => (
                          <SelectItem key={position} value={position}>
                            {position}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* إحصائيات إضافية */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>النتائج المطابقة</span>
                <FileText className="w-5 h-5 text-blue-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{filteredEmployees.length}</div>
              <p className="text-sm text-gray-500 mt-1">من أصل {employees.length} موظف</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>متوسط الخبرة</span>
                <Clock className="w-5 h-5 text-amber-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">
                {employees.length > 0 
                  ? Math.round(employees.reduce((sum: number, e: any) => {
                      // experience يمكن أن يكون رقم أو نص
                      const exp = typeof e.experience === 'number' 
                        ? e.experience 
                        : typeof e.experience === 'string' 
                          ? parseInt(e.experience.replace(/[^\d]/g, '') || '0')
                          : 0;
                      return sum + exp;
                    }, 0) / employees.length)
                  : 0} سنوات
              </div>
              <p className="text-sm text-gray-500 mt-1">متوسط سنوات الخبرة</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>متوسط الحضور</span>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {employees.length > 0 
                  ? Math.round(
                      employees.reduce(
                        (sum: number, e: any) => sum + (e.attendance || 0),
                        0
                      ) / employees.length
                    )
                  : 0}%
              </div>
              <p className="text-sm text-gray-500 mt-1">معدل الحضور الشهري</p>
            </CardContent>
          </Card>
        </div>

        {/* عرض الجدول أو الكروت */}
        <Tabs defaultValue="table" className="space-y-4">
          <TabsList>
            <TabsTrigger value="table" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              عرض الجدول
            </TabsTrigger>
            <TabsTrigger value="cards" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              عرض الكروت
            </TabsTrigger>
          </TabsList>

          <TabsContent value="table" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    قائمة الموظفين ({filteredEmployees.length})
                  </span>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>عرض</span>
                    <Select defaultValue="10">
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-right py-3 px-4 font-semibold">الاسم</th>
                        <th className="text-right py-3 px-4 font-semibold">المنصب</th>
                        <th className="text-right py-3 px-4 font-semibold">القسم</th>
                        <th className="text-right py-3 px-4 font-semibold">البريد</th>
                        <th className="text-right py-3 px-4 font-semibold">الهاتف</th>
                        <th className="text-right py-3 px-4 font-semibold">الراتب</th>
                        <th className="text-right py-3 px-4 font-semibold">الأداء</th>
                        <th className="text-right py-3 px-4 font-semibold">الحضور</th>
                        <th className="text-right py-3 px-4 font-semibold">الحالة</th>
                        <th className="text-right py-3 px-4 font-semibold">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEmployees.map((employee: any) => (
                        <tr key={employee.id} className="border-b hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex flex-col">
                              <span className="font-semibold">
                                {employee.arabicName || employee.name}
                              </span>
                              <span className="text-xs text-gray-500">
                                {employee.email || "-"}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Briefcase className="w-4 h-4 text-gray-400" />
                              <span>
                                {typeof employee.position === 'string' 
                                  ? employee.position 
                                  : employee.position?.name 
                                  ? employee.position.name 
                                  : employee.Position?.name 
                                  ? employee.Position.name 
                                  : '-'}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant="outline" className="flex items-center w-fit gap-1">
                              <Building className="w-3 h-3" />
                              {typeof employee.department === 'string' 
                                ? employee.department 
                                : employee.department?.name 
                                ? employee.department.name 
                                : employee.Department?.name 
                                ? employee.Department.name 
                                : '-'}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1 text-sm">
                              <Mail className="w-3 h-3 text-gray-400" />
                              <span className="truncate max-w-[150px]">
                                {employee.email || "-"}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1 text-sm">
                              <Phone className="w-3 h-3 text-gray-400" />
                              <span>{employee.phoneNumber || employee.phone || "-"}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-bold text-green-600">
                              {(employee.basicSalary || employee.salary || 0).toLocaleString()} ج.م
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Award className={`w-4 h-4 ${
                                (employee.performance || 0) >= 90 ? "text-green-500" :
                                (employee.performance || 0) >= 80 ? "text-amber-500" : "text-red-500"
                              }`} />
                              <span className={`font-semibold ${
                                (employee.performance || 0) >= 90 ? "text-green-600" :
                                (employee.performance || 0) >= 80 ? "text-amber-600" : "text-red-600"
                              }`}>
                                {employee.performance || 0}%
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <CheckCircle className={`w-4 h-4 ${
                                (employee.attendance || 0) >= 95 ? "text-green-500" :
                                (employee.attendance || 0) >= 85 ? "text-amber-500" : "text-red-500"
                              }`} />
                              <span className="text-sm font-semibold">
                                {employee.attendance || 0}%
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={
                              (employee.status || employee.employmentStatus) === "نشط" ? "bg-green-500" :
                              (employee.status || employee.employmentStatus) === "إجازة" ? "bg-amber-500" :
                              (employee.status || employee.employmentStatus) === "مستقيل" ? "bg-red-500" : "bg-gray-500"
                            }>
                              {employee.status || employee.employmentStatus || "غير محدد"}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2 justify-end">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleEdit(employee)} 
                                title="تعديل"
                                className="hover:bg-blue-50"
                              >
                                <Edit className="w-4 h-4 text-blue-600" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleDelete(employee)} 
                                title="حذف"
                                className="hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredEmployees.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>لا توجد نتائج مطابقة</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cards" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEmployees.map((employee: any) => (
                <Card key={employee.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
                          {(employee.arabicName || employee.name || "?")
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")
                            .substring(0, 2)}
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {employee.arabicName || employee.name}
                          </CardTitle>
                          <p className="text-sm text-gray-500">
                            {typeof employee.position === 'string' 
                              ? employee.position 
                              : employee.position?.name 
                              ? employee.position.name 
                              : employee.Position?.name 
                              ? employee.Position.name 
                              : '-'}
                          </p>
                        </div>
                      </div>
                      <Badge className={
                        (employee.status || employee.employmentStatus) === "نشط" ? "bg-green-500" :
                        (employee.status || employee.employmentStatus) === "إجازة" ? "bg-amber-500" :
                        (employee.status || employee.employmentStatus) === "مستقيل" ? "bg-red-500" : "bg-gray-500"
                      }>
                        {employee.status || employee.employmentStatus || "غير محدد"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Building className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">القسم:</span>
                        <Badge variant="outline">
                          {typeof employee.department === 'string' 
                            ? employee.department 
                            : employee.department?.name 
                            ? employee.department.name 
                            : employee.Department?.name 
                            ? employee.Department.name 
                            : '-'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="truncate">{employee.email || "-"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{employee.phoneNumber || employee.phone || "-"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>تاريخ التعيين: {employee.hireDate || "-"}</span>
                      </div>
                      {employee.experience && (
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span>
                            الخبرة: {
                              typeof employee.experience === 'number' 
                                ? `${employee.experience} سنوات` 
                                : typeof employee.experience === 'string'
                                  ? employee.experience
                                  : '-'
                            }
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">
                          {(employee.basicSalary || employee.salary || 0).toLocaleString()} ج.م
                        </div>
                        <p className="text-xs text-gray-500">الراتب</p>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-600">
                          {employee.performance || 0}%
                        </div>
                        <p className="text-xs text-gray-500">الأداء</p>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2 border-t">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleEdit(employee)}
                      >
                        <Edit className="w-4 h-4 ml-1" />
                        تعديل
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleDelete(employee)}
                      >
                        <Trash2 className="w-4 h-4 ml-1 text-red-500" />
                        حذف
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {filteredEmployees.length === 0 && (
              <Card>
                <CardContent className="text-center py-12 text-gray-500">
                  <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium">لا توجد نتائج مطابقة</p>
                  <p className="text-sm mt-2">جرب تغيير الفلاتر أو البحث</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Dialog إضافة قسم */}
        <Dialog
          open={isAddDepartmentDialogOpen}
          onOpenChange={setIsAddDepartmentDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>إضافة قسم جديد</DialogTitle>
              <DialogDescription>
                أدخل اسم القسم الجديد ليظهر في قائمة الأقسام ويمكن ربطه بالموظفين
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="new-department">اسم القسم *</Label>
                <Input
                  id="new-department"
                  value={newDepartmentName}
                  onChange={(e) => setNewDepartmentName(e.target.value)}
                  placeholder="مثال: الموارد البشرية، المبيعات، التسويق..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDepartmentDialogOpen(false)}
              >
                إلغاء
              </Button>
              <Button
                onClick={handleSaveDepartment}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="w-4 h-4 ml-2" /> حفظ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>إضافة موظف جديد</DialogTitle>
              <DialogDescription>أدخل بيانات الموظف الجديد</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">الاسم الكامل *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="الاسم الكامل"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="position">المنصب *</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => setFormData({...formData, position: e.target.value})}
                    placeholder="المنصب"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <Label htmlFor="department">القسم *</Label>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-7 px-2 text-xs"
                      onClick={() => setIsAddDepartmentDialogOpen(true)}
                    >
                      إضافة قسم
                    </Button>
                  </div>
                  <Select
                    value={formData.department}
                    onValueChange={(value) =>
                      setFormData({ ...formData, department: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر القسم" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept: string) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="البريد الإلكتروني"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="رقم الهاتف"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hireDate">تاريخ التعيين</Label>
                  <Input
                    id="hireDate"
                    type="date"
                    value={formData.hireDate}
                    onChange={(e) => setFormData({...formData, hireDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salary">الراتب</Label>
                  <Input
                    id="salary"
                    type="number"
                    value={formData.salary}
                    onChange={(e) => setFormData({...formData, salary: e.target.value})}
                    placeholder="الراتب بالجنيه"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">ملاحظات</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="ملاحظات إضافية"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>إلغاء</Button>
              <Button onClick={handleSaveAdd} className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 ml-2" /> حفظ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>تعديل بيانات الموظف</DialogTitle>
              <DialogDescription>قم بتعديل بيانات الموظف</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">الاسم الكامل *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="الاسم الكامل"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-position">المنصب *</Label>
                  <Input
                    id="edit-position"
                    value={formData.position}
                    onChange={(e) => setFormData({...formData, position: e.target.value})}
                    placeholder="المنصب"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <Label htmlFor="edit-department">القسم *</Label>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-7 px-2 text-xs"
                      onClick={() => setIsAddDepartmentDialogOpen(true)}
                    >
                      إضافة قسم
                    </Button>
                  </div>
                  <Select
                    value={formData.department}
                    onValueChange={(value) =>
                      setFormData({ ...formData, department: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر القسم" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept: string) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-email">البريد الإلكتروني *</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="البريد الإلكتروني"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">رقم الهاتف</Label>
                  <Input
                    id="edit-phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="رقم الهاتف"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-hireDate">تاريخ التعيين</Label>
                  <Input
                    id="edit-hireDate"
                    type="date"
                    value={formData.hireDate}
                    onChange={(e) => setFormData({...formData, hireDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-salary">الراتب</Label>
                  <Input
                    id="edit-salary"
                    type="number"
                    value={formData.salary}
                    onChange={(e) => setFormData({...formData, salary: e.target.value})}
                    placeholder="الراتب بالجنيه"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-notes">ملاحظات</Label>
                <Textarea
                  id="edit-notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="ملاحظات إضافية"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>إلغاء</Button>
              <Button onClick={handleSaveEdit} className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 ml-2" /> حفظ التغييرات
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>تأكيد الحذف</DialogTitle>
              <DialogDescription>
                هل أنت متأكد من حذف الموظف "{selectedEmployee?.name}"؟ هذا الإجراء لا يمكن التراجع عنه.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>إلغاء</Button>
              <Button variant="destructive" onClick={handleConfirmDelete}>
                <Trash2 className="w-4 h-4 ml-2" /> حذف
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default EmployeeManagement;

