import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  AlertTriangle, 
  ArrowLeft,
  Download,
  UserMinus,
  Users,
  Calendar,
  MessageCircle,
  TrendingDown,
  FileText,
  DollarSign
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

interface OffboardingRecord {
  employeeId: string;
  name: string;
  department: string;
  position: string;
  hireDate: string;
  lastWorkingDay: string;
  reason: string;
  reasonCategory: 'resignation' | 'termination' | 'retirement' | 'end_contract';
  manager: string;
  exitInterview: boolean;
  clearanceComplete: boolean;
  finalSettlement: number;
}

export default function OffboardingReport() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState('year');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  // Mock data
  const offboardingData: OffboardingRecord[] = [
    {
      employeeId: 'EMP105',
      name: 'خالد أحمد المطيري',
      department: 'المبيعات',
      position: 'مندوب مبيعات',
      hireDate: '2022-03-15',
      lastWorkingDay: '2024-01-20',
      reason: 'فرصة عمل أفضل',
      reasonCategory: 'resignation',
      manager: 'سعد الملك',
      exitInterview: true,
      clearanceComplete: true,
      finalSettlement: 8500
    },
    {
      employeeId: 'EMP098',
      name: 'نوال سعد الغامدي',
      department: 'المالية',
      position: 'محاسبة',
      hireDate: '2021-08-10',
      lastWorkingDay: '2024-02-15',
      reason: 'ظروف شخصية',
      reasonCategory: 'resignation',
      manager: 'مها الزهراني',
      exitInterview: true,
      clearanceComplete: false,
      finalSettlement: 12000
    },
    {
      employeeId: 'EMP089',
      name: 'عبدالعزيز الشهراني',
      department: 'العمليات',
      position: 'فني صيانة',
      hireDate: '2020-01-20',
      lastWorkingDay: '2024-03-10',
      reason: 'انتهاء عقد',
      reasonCategory: 'end_contract',
      manager: 'محمد القحطاني',
      exitInterview: false,
      clearanceComplete: true,
      finalSettlement: 15000
    }
  ];

  const monthlyTurnover = [
    { month: 'يناير', departures: 2, hires: 5, netChange: 3 },
    { month: 'فبراير', departures: 3, hires: 4, netChange: 1 },
    { month: 'مارس', departures: 1, hires: 6, netChange: 5 },
    { month: 'أبريل', departures: 4, hires: 3, netChange: -1 },
    { month: 'مايو', departures: 2, hires: 7, netChange: 5 },
    { month: 'يونيو', departures: 3, hires: 4, netChange: 1 }
  ];

  const departmentTurnover = [
    { department: 'المبيعات', departures: 8, rate: 9.0 },
    { department: 'العمليات', departures: 5, rate: 4.0 },
    { department: 'التقنية', departures: 2, rate: 5.3 },
    { department: 'المالية', departures: 3, rate: 6.7 },
    { department: 'الموارد البشرية', departures: 1, rate: 3.6 }
  ];

  const reasonsStats = [
    { name: 'استقالة', value: 65, color: '#3b82f6' },
    { name: 'انتهاء عقد', value: 20, color: '#10b981' },
    { name: 'فصل', value: 10, color: '#ef4444' },
    { name: 'تقاعد', value: 5, color: '#f59e0b' }
  ];

  const getReasonBadge = (category: string) => {
    switch (category) {
      case 'resignation':
        return <Badge className="bg-blue-100 text-blue-800">استقالة</Badge>;
      case 'termination':
        return <Badge className="bg-red-100 text-red-800">فصل</Badge>;
      case 'retirement':
        return <Badge className="bg-green-100 text-green-800">تقاعد</Badge>;
      case 'end_contract':
        return <Badge className="bg-orange-100 text-orange-800">انتهاء عقد</Badge>;
      default:
        return <Badge variant="secondary">غير محدد</Badge>;
    }
  };

  const handleExportOffboarding = () => {
    toast({
      title: "تصدير تقرير نهاية الخدمة",
      description: "جاري تصدير تقرير نهاية الخدمة بصيغة Excel...",
    });
  };

  const filteredOffboarding = selectedDepartment === 'all' 
    ? offboardingData 
    : offboardingData.filter(o => o.department === selectedDepartment);

  const totalDepartures = filteredOffboarding.length;
  const averageSettlement = filteredOffboarding.reduce((sum, o) => sum + o.finalSettlement, 0) / filteredOffboarding.length;
  const completedInterviews = filteredOffboarding.filter(o => o.exitInterview).length;
  const completedClearance = filteredOffboarding.filter(o => o.clearanceComplete).length;

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
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div>
                <h1 className="text-3xl font-bold">تقرير نهاية الخدمة</h1>
                <p className="text-muted-foreground">إحصائيات المغادرين وأسباب ترك العمل</p>
              </div>
            </div>
          </div>
          <Button onClick={handleExportOffboarding} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            تصدير تقرير نهاية الخدمة
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">إجمالي المغادرين</p>
                  <p className="text-2xl font-bold text-red-600">{totalDepartures}</p>
                  <p className="text-sm text-red-600">موظف</p>
                </div>
                <UserMinus className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">معدل دوران الموظفين</p>
                  <p className="text-2xl font-bold text-orange-600">6.2%</p>
                  <p className="text-sm text-orange-600">سنوياً</p>
                </div>
                <TrendingDown className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">متوسط التسوية</p>
                  <p className="text-2xl font-bold text-green-600">
                    {Math.round(averageSettlement).toLocaleString()} جنيه مصري
                  </p>
                  <p className="text-sm text-green-600">للموظف</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">مقابلات الخروج</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {Math.round((completedInterviews / totalDepartures) * 100)}%
                  </p>
                  <p className="text-sm text-blue-600">{completedInterviews} من {totalDepartures}</p>
                </div>
                <MessageCircle className="h-8 w-8 text-blue-500" />
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
              <SelectItem value="quarter">هذا الربع</SelectItem>
              <SelectItem value="year">هذا العام</SelectItem>
              <SelectItem value="all">جميع الفترات</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="القسم" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الأقسام</SelectItem>
              <SelectItem value="المبيعات">المبيعات</SelectItem>
              <SelectItem value="العمليات">العمليات</SelectItem>
              <SelectItem value="التقنية">التقنية</SelectItem>
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
                دوران الموظفين الشهري
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyTurnover}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="departures" 
                    stroke="#ef4444" 
                    strokeWidth={3}
                    name="المغادرين"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="hires" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="التوظيف الجديد"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-500" />
                أسباب ترك العمل
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={reasonsStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({name, value}) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {reasonsStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Department Turnover */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-orange-500" />
              دوران الموظفين حسب القسم
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentTurnover}>
                <XAxis dataKey="department" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Bar dataKey="departures" fill="#ef4444" name="عدد المغادرين" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Offboarding Details Table */}
        <Card>
          <CardHeader>
            <CardTitle>تفاصيل نهاية الخدمة</CardTitle>
            <CardDescription>
              قائمة بالموظفين المغادرين وتفاصيل إجراءات نهاية الخدمة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>رقم الموظف</TableHead>
                  <TableHead>الاسم</TableHead>
                  <TableHead>القسم</TableHead>
                  <TableHead>المنصب</TableHead>
                  <TableHead>تاريخ التعيين</TableHead>
                  <TableHead>آخر يوم عمل</TableHead>
                  <TableHead>سبب المغادرة</TableHead>
                  <TableHead>نوع المغادرة</TableHead>
                  <TableHead>مقابلة الخروج</TableHead>
                  <TableHead>إخلاء الطرف</TableHead>
                  <TableHead>التسوية النهائية</TableHead>
                  <TableHead>المدير المسؤول</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOffboarding.map((record) => (
                  <TableRow key={record.employeeId}>
                    <TableCell className="font-medium">{record.employeeId}</TableCell>
                    <TableCell>{record.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{record.department}</Badge>
                    </TableCell>
                    <TableCell>{record.position}</TableCell>
                    <TableCell>{record.hireDate}</TableCell>
                    <TableCell>{record.lastWorkingDay}</TableCell>
                    <TableCell>{record.reason}</TableCell>
                    <TableCell>{getReasonBadge(record.reasonCategory)}</TableCell>
                    <TableCell>
                      {record.exitInterview ? (
                        <Badge className="bg-green-100 text-green-800">
                          <MessageCircle className="h-3 w-3 mr-1" />مكتملة
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800">
                          <AlertTriangle className="h-3 w-3 mr-1" />غير مكتملة
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {record.clearanceComplete ? (
                        <Badge className="bg-green-100 text-green-800">
                          <FileText className="h-3 w-3 mr-1" />مكتمل
                        </Badge>
                      ) : (
                        <Badge className="bg-orange-100 text-orange-800">
                          <AlertTriangle className="h-3 w-3 mr-1" />معلق
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="font-medium text-green-600">
                      {record.finalSettlement.toLocaleString()} جنيه مصري
                    </TableCell>
                    <TableCell>{record.manager}</TableCell>
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