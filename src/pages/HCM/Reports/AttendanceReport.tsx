import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Clock, 
  ArrowLeft,
  Download,
  CheckCircle,
  XCircle,
  Calendar,
  Timer,
  Coffee,
  Zap
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
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface AttendanceRecord {
  employeeId: string;
  name: string;
  department: string;
  date: string;
  checkIn: string;
  checkOut: string;
  totalHours: number;
  status: 'present' | 'absent' | 'late' | 'early_leave';
  overtimeHours: number;
  breakTime: number;
}

export default function AttendanceReport() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  // Mock data
  const attendanceData: AttendanceRecord[] = [
    {
      employeeId: 'EMP001',
      name: 'أحمد محمد العتيبي',
      department: 'التقنية',
      date: '2024-01-15',
      checkIn: '08:00',
      checkOut: '17:30',
      totalHours: 8.5,
      status: 'present',
      overtimeHours: 1.5,
      breakTime: 1
    },
    {
      employeeId: 'EMP002',
      name: 'فاطمة علي الأحمدي',
      department: 'المبيعات',
      date: '2024-01-15',
      checkIn: '08:15',
      checkOut: '17:00',
      totalHours: 7.75,
      status: 'late',
      overtimeHours: 0,
      breakTime: 1
    },
    {
      employeeId: 'EMP003',
      name: 'محمد سعد القحطاني',
      department: 'العمليات',
      date: '2024-01-15',
      checkIn: '-',
      checkOut: '-',
      totalHours: 0,
      status: 'absent',
      overtimeHours: 0,
      breakTime: 0
    }
  ];

  const weeklyAttendance = [
    { day: 'السبت', present: 95, absent: 5, late: 12 },
    { day: 'الأحد', present: 98, absent: 2, late: 8 },
    { day: 'الاثنين', present: 92, absent: 8, late: 15 },
    { day: 'الثلاثاء', present: 96, absent: 4, late: 10 },
    { day: 'الأربعاء', present: 94, absent: 6, late: 14 },
    { day: 'الخميس', present: 89, absent: 11, late: 18 }
  ];

  const attendanceStats = [
    { name: 'حاضر', value: 89, color: '#10b981' },
    { name: 'غائب', value: 6, color: '#ef4444' },
    { name: 'متأخر', value: 5, color: '#f59e0b' }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />حاضر</Badge>;
      case 'absent':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />غائب</Badge>;
      case 'late':
        return <Badge className="bg-orange-100 text-orange-800"><Timer className="h-3 w-3 mr-1" />متأخر</Badge>;
      case 'early_leave':
        return <Badge className="bg-yellow-100 text-yellow-800"><Calendar className="h-3 w-3 mr-1" />مغادرة مبكرة</Badge>;
      default:
        return <Badge variant="secondary">غير محدد</Badge>;
    }
  };

  const handleExportAttendance = () => {
    toast({
      title: "تصدير تقرير الحضور",
      description: "جاري تصدير تقرير الحضور بصيغة Excel...",
    });
  };

  const filteredAttendance = selectedDepartment === 'all' 
    ? attendanceData 
    : attendanceData.filter(a => a.department === selectedDepartment);

  const totalPresent = filteredAttendance.filter(a => a.status === 'present').length;
  const totalAbsent = filteredAttendance.filter(a => a.status === 'absent').length;
  const totalLate = filteredAttendance.filter(a => a.status === 'late').length;
  const averageHours = filteredAttendance.reduce((sum, a) => sum + a.totalHours, 0) / filteredAttendance.length;

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
              <Clock className="h-8 w-8 text-orange-600" />
              <div>
                <h1 className="text-3xl font-bold">تقرير الحضور والإجازات</h1>
                <p className="text-muted-foreground">تتبع الحضور والغياب وأوقات العمل</p>
              </div>
            </div>
          </div>
          <Button onClick={handleExportAttendance} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            تصدير تقرير الحضور
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">إجمالي الحضور</p>
                  <p className="text-2xl font-bold text-green-600">{totalPresent}</p>
                  <p className="text-sm text-green-600">89% معدل الحضور</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">إجمالي الغياب</p>
                  <p className="text-2xl font-bold text-red-600">{totalAbsent}</p>
                  <p className="text-sm text-red-600">6% معدل الغياب</p>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">التأخير</p>
                  <p className="text-2xl font-bold text-orange-600">{totalLate}</p>
                  <p className="text-sm text-orange-600">5% معدل التأخير</p>
                </div>
                <Timer className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">متوسط ساعات العمل</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {averageHours.toFixed(1)} ساعة
                  </p>
                  <p className="text-sm text-blue-600">يومياً</p>
                </div>
                <Clock className="h-8 w-8 text-blue-500" />
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
              <SelectItem value="week">هذا الأسبوع</SelectItem>
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
                الحضور الأسبوعي
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyAttendance}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="present" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    name="حاضر"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="late" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    name="متأخر"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-500" />
                إحصائيات الحضور
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={attendanceStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({name, value}) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {attendanceStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Details Table */}
        <Card>
          <CardHeader>
            <CardTitle>سجل الحضور اليومي</CardTitle>
            <CardDescription>
              تفاصيل حضور الموظفين وأوقات الدخول والخروج
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>رقم الموظف</TableHead>
                  <TableHead>الاسم</TableHead>
                  <TableHead>القسم</TableHead>
                  <TableHead>التاريخ</TableHead>
                  <TableHead>وقت الدخول</TableHead>
                  <TableHead>وقت الخروج</TableHead>
                  <TableHead>إجمالي الساعات</TableHead>
                  <TableHead>الساعات الإضافية</TableHead>
                  <TableHead>وقت الاستراحة</TableHead>
                  <TableHead>الحالة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAttendance.map((record) => (
                  <TableRow key={`${record.employeeId}-${record.date}`}>
                    <TableCell className="font-medium">{record.employeeId}</TableCell>
                    <TableCell>{record.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{record.department}</Badge>
                    </TableCell>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {record.checkIn}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {record.checkOut}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {record.totalHours} ساعة
                    </TableCell>
                    <TableCell className="text-blue-600">
                      {record.overtimeHours > 0 ? `+${record.overtimeHours} ساعة` : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Coffee className="h-3 w-3" />
                        {record.breakTime} ساعة
                      </div>
                    </TableCell>
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