import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Target, 
  ArrowLeft,
  Download,
  UserPlus,
  Users,
  Calendar,
  MessageCircle,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface RecruitmentRecord {
  id: string;
  position: string;
  department: string;
  applicants: number;
  interviewed: number;
  hired: number;
  rejected: number;
  datePosted: string;
  status: 'open' | 'closed' | 'on_hold';
  hiringManager: string;
  salary: string;
}

export default function RecruitmentReport() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState('quarter');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  // Mock data
  const recruitmentData: RecruitmentRecord[] = [
    {
      id: 'REC001',
      position: 'مطور برمجيات أول',
      department: 'التقنية',
      applicants: 25,
      interviewed: 8,
      hired: 2,
      rejected: 15,
      datePosted: '2024-01-10',
      status: 'closed',
      hiringManager: 'خالد السعد',
      salary: '8000-12000'
    },
    {
      id: 'REC002',
      position: 'مسؤول مبيعات',
      department: 'المبيعات',
      applicants: 18,
      interviewed: 6,
      hired: 1,
      rejected: 11,
      datePosted: '2024-01-15',
      status: 'open',
      hiringManager: 'سعد الملك',
      salary: '6000-9000'
    },
    {
      id: 'REC003',
      position: 'محاسب مالي',
      department: 'المالية',
      applicants: 12,
      interviewed: 4,
      hired: 1,
      rejected: 7,
      datePosted: '2024-02-01',
      status: 'closed',
      hiringManager: 'مها الزهراني',
      salary: '5000-7000'
    }
  ];

  const monthlyRecruitment = [
    { month: 'يناير', applicants: 45, hired: 3, interviews: 18 },
    { month: 'فبراير', applicants: 38, hired: 2, interviews: 15 },
    { month: 'مارس', applicants: 52, hired: 4, interviews: 22 },
    { month: 'أبريل', applicants: 41, hired: 3, interviews: 17 },
    { month: 'مايو', applicants: 35, hired: 2, interviews: 14 },
    { month: 'يونيو', applicants: 29, hired: 1, interviews: 12 }
  ];

  const departmentRecruitment = [
    { department: 'التقنية', open: 3, filled: 2 },
    { department: 'المبيعات', open: 2, filled: 4 },
    { department: 'العمليات', open: 1, filled: 3 },
    { department: 'المالية', open: 2, filled: 1 },
    { department: 'الموارد البشرية', open: 1, filled: 1 }
  ];

  const recruitmentStats = [
    { name: 'تم التوظيف', value: 35, color: '#10b981' },
    { name: 'في المقابلة', value: 25, color: '#3b82f6' },
    { name: 'مرفوض', value: 40, color: '#ef4444' }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-green-100 text-green-800"><UserPlus className="h-3 w-3 mr-1" />مفتوح</Badge>;
      case 'closed':
        return <Badge className="bg-gray-100 text-gray-800"><CheckCircle className="h-3 w-3 mr-1" />مغلق</Badge>;
      case 'on_hold':
        return <Badge className="bg-orange-100 text-orange-800"><Clock className="h-3 w-3 mr-1" />معلق</Badge>;
      default:
        return <Badge variant="secondary">غير محدد</Badge>;
    }
  };

  const handleExportRecruitment = () => {
    toast({
      title: "تصدير تقرير التوظيف",
      description: "جاري تصدير تقرير التوظيف بصيغة Excel...",
    });
  };

  const filteredRecruitment = selectedDepartment === 'all' 
    ? recruitmentData 
    : recruitmentData.filter(r => r.department === selectedDepartment);

  const totalPositions = filteredRecruitment.length;
  const totalApplicants = filteredRecruitment.reduce((sum, r) => sum + r.applicants, 0);
  const totalHired = filteredRecruitment.reduce((sum, r) => sum + r.hired, 0);
  const hireRate = totalApplicants > 0 ? (totalHired / totalApplicants * 100) : 0;

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
              <Target className="h-8 w-8 text-purple-600" />
              <div>
                <h1 className="text-3xl font-bold">تقرير التوظيف والاستقطاب</h1>
                <p className="text-muted-foreground">إحصائيات شاملة لعمليات التوظيف والمرشحين</p>
              </div>
            </div>
          </div>
          <Button onClick={handleExportRecruitment} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            تصدير تقرير التوظيف
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">إجمالي الوظائف</p>
                  <p className="text-2xl font-bold text-blue-600">{totalPositions}</p>
                  <p className="text-sm text-blue-600">منصب مختلف</p>
                </div>
                <Target className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">إجمالي المتقدمين</p>
                  <p className="text-2xl font-bold text-purple-600">{totalApplicants}</p>
                  <p className="text-sm text-purple-600">مرشح</p>
                </div>
                <Users className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">تم التوظيف</p>
                  <p className="text-2xl font-bold text-green-600">{totalHired}</p>
                  <p className="text-sm text-green-600">موظف جديد</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">معدل التوظيف</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {hireRate.toFixed(1)}%
                  </p>
                  <p className="text-sm text-emerald-600">من المتقدمين</p>
                </div>
                <UserPlus className="h-8 w-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="الفترة الزمنية" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">هذا الشهر</SelectItem>
              <SelectItem value="quarter">هذا الربع</SelectItem>
              <SelectItem value="year">هذا العام</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="القسم" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الأقسام</SelectItem>
              <SelectItem value="التقنية">التقنية</SelectItem>
              <SelectItem value="المبيعات">المبيعات</SelectItem>
              <SelectItem value="العمليات">العمليات</SelectItem>
              <SelectItem value="المالية">المالية</SelectItem>
              <SelectItem value="الموارد البشرية">الموارد البشرية</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                اتجاه التوظيف الشهري
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyRecruitment}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="applicants" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    name="المتقدمين"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="hired" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="تم التوظيف"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-green-500" />
                حالة المتقدمين
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={recruitmentStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({name, value}) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {recruitmentStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Department Recruitment Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-500" />
              التوظيف حسب القسم
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentRecruitment}>
                <XAxis dataKey="department" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Bar dataKey="open" fill="#f59e0b" name="وظائف مفتوحة" />
                <Bar dataKey="filled" fill="#10b981" name="وظائف مُشغلة" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recruitment Details Table */}
        <Card>
          <CardHeader>
            <CardTitle>تفاصيل عمليات التوظيف</CardTitle>
            <CardDescription>
              قائمة بجميع الوظائف المعلنة وحالة التقديم والتوظيف
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>رقم الوظيفة</TableHead>
                  <TableHead>المنصب</TableHead>
                  <TableHead>القسم</TableHead>
                  <TableHead>المتقدمين</TableHead>
                  <TableHead>المقابلات</TableHead>
                  <TableHead>تم التوظيف</TableHead>
                  <TableHead>المرفوضين</TableHead>
                  <TableHead>تاريخ الإعلان</TableHead>
                  <TableHead>المدير المسؤول</TableHead>
                  <TableHead>نطاق الراتب</TableHead>
                  <TableHead>الحالة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecruitment.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.id}</TableCell>
                    <TableCell>{record.position}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{record.department}</Badge>
                    </TableCell>
                    <TableCell className="text-blue-600 font-medium">
                      {record.applicants}
                    </TableCell>
                    <TableCell className="text-orange-600">
                      {record.interviewed}
                    </TableCell>
                    <TableCell className="text-green-600 font-medium">
                      {record.hired}
                    </TableCell>
                    <TableCell className="text-red-600">
                      {record.rejected}
                    </TableCell>
                    <TableCell>{record.datePosted}</TableCell>
                    <TableCell>{record.hiringManager}</TableCell>
                    <TableCell>{record.salary} جنيه مصري</TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
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