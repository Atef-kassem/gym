import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Search, 
  Filter, 
  Download,
  ArrowLeft,
  Eye,
  Edit,
  MoreHorizontal,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Briefcase,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  hireDate: string;
  salary: number;
  status: 'active' | 'inactive' | 'vacation';
  location: string;
  manager: string;
}

export default function EmployeesReport() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data
  const employees: Employee[] = [
    {
      id: 'EMP001',
      name: 'أحمد محمد العتيبي',
      position: 'مطور برمجيات أول',
      department: 'التقنية',
      email: 'ahmed.alotaibi@company.com',
      phone: '+966501234567',
      hireDate: '2023-01-15',
      salary: 12000,
      status: 'active',
      location: 'الرياض',
      manager: 'خالد السعد'
    },
    {
      id: 'EMP002',
      name: 'فاطمة علي الأحمدي',
      position: 'مسؤولة المبيعات',
      department: 'المبيعات',
      email: 'fatima.alahmadi@company.com',
      phone: '+966509876543',
      hireDate: '2022-06-20',
      salary: 8500,
      status: 'vacation',
      location: 'جدة',
      manager: 'سعد الملك'
    },
    {
      id: 'EMP003',
      name: 'محمد سعد القحطاني',
      position: 'مدير العمليات',
      department: 'العمليات',
      email: 'mohammed.alqahtani@company.com',
      phone: '+966507654321',
      hireDate: '2021-03-10',
      salary: 15000,
      status: 'active',
      location: 'الدمام',
      manager: 'عبدالله الراشد'
    },
    {
      id: 'EMP004',
      name: 'نورا خالد الشمري',
      position: 'محاسبة',
      department: 'المالية',
      email: 'nora.alshammari@company.com',
      phone: '+966503456789',
      hireDate: '2023-09-01',
      salary: 7000,
      status: 'active',
      location: 'الرياض',
      manager: 'مها الزهراني'
    },
    {
      id: 'EMP005',
      name: 'عبدالرحمن الغامدي',
      position: 'أخصائي موارد بشرية',
      department: 'الموارد البشرية',
      email: 'abdulrahman.alghamdi@company.com',
      phone: '+966502345678',
      hireDate: '2022-11-15',
      salary: 9000,
      status: 'inactive',
      location: 'أبها',
      manager: 'ريم العمري'
    }
  ];

  const departments = ['الكل', 'التقنية', 'المبيعات', 'العمليات', 'المالية', 'الموارد البشرية'];
  const statuses = ['الكل', 'نشط', 'إجازة', 'غير نشط'];

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || employee.department === filterDepartment;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'نشط' && employee.status === 'active') ||
                         (filterStatus === 'إجازة' && employee.status === 'vacation') ||
                         (filterStatus === 'غير نشط' && employee.status === 'inactive');
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />نشط</Badge>;
      case 'vacation':
        return <Badge className="bg-orange-100 text-orange-800"><Calendar className="h-3 w-3 mr-1" />إجازة</Badge>;
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />غير نشط</Badge>;
      default:
        return <Badge variant="secondary">غير محدد</Badge>;
    }
  };

  const handleViewEmployee = (employee: Employee) => {
    toast({
      title: "عرض الملف الشخصي",
      description: `جاري فتح ملف ${employee.name}...`,
    });
  };

  const handleEditEmployee = (employee: Employee) => {
    toast({
      title: "تحرير الموظف",
      description: `جاري فتح نموذج تحرير ${employee.name}...`,
    });
  };

  const handleExportReport = () => {
    toast({
      title: "تصدير التقرير",
      description: "جاري تصدير تقرير الموظفين بصيغة Excel...",
    });
  };

  const totalSalaries = employees.reduce((sum, emp) => sum + emp.salary, 0);
  const averageSalary = totalSalaries / employees.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/hcm/reports')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              العودة للتقارير
            </Button>
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold">تقرير الموظفين</h1>
                <p className="text-muted-foreground">قائمة شاملة بجميع الموظفين ومعلوماتهم</p>
              </div>
            </div>
          </div>
          <Button onClick={handleExportReport} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            تصدير Excel
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">إجمالي الموظفين</p>
                  <p className="text-2xl font-bold text-blue-600">{employees.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">الموظفين النشطين</p>
                  <p className="text-2xl font-bold text-green-600">
                    {employees.filter(emp => emp.status === 'active').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">متوسط الراتب</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {Math.round(averageSalary).toLocaleString()} جنيه مصري
                  </p>
                </div>
                <Briefcase className="h-8 w-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">في إجازة</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {employees.filter(emp => emp.status === 'vacation').length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>البحث والتصفية</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="البحث بالاسم، المنصب، أو البريد الإلكتروني..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="القسم" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept === 'الكل' ? 'all' : dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="الحالة" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map(status => (
                    <SelectItem key={status} value={status === 'الكل' ? 'all' : status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Employees Table */}
        <Card>
          <CardHeader>
            <CardTitle>قائمة الموظفين ({filteredEmployees.length})</CardTitle>
            <CardDescription>
              تفاصيل الموظفين المصفين حسب المعايير المحددة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>رقم الموظف</TableHead>
                  <TableHead>الاسم</TableHead>
                  <TableHead>المنصب</TableHead>
                  <TableHead>القسم</TableHead>
                  <TableHead>البريد الإلكتروني</TableHead>
                  <TableHead>الهاتف</TableHead>
                  <TableHead>تاريخ التعيين</TableHead>
                  <TableHead>الراتب</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>المدينة</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.id}</TableCell>
                    <TableCell>
                      <div className="font-medium">{employee.name}</div>
                      <div className="text-sm text-muted-foreground">{employee.manager}</div>
                    </TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{employee.department}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {employee.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {employee.phone}
                      </div>
                    </TableCell>
                    <TableCell>{employee.hireDate}</TableCell>
                    <TableCell className="font-medium">
                      {employee.salary.toLocaleString()} جنيه مصري
                    </TableCell>
                    <TableCell>{getStatusBadge(employee.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {employee.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewEmployee(employee)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEditEmployee(employee)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}