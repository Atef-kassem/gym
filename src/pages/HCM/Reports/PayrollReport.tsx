import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  DollarSign, 
  ArrowLeft,
  Download,
  TrendingUp,
  TrendingDown,
  Calculator,
  PiggyBank,
  CreditCard,
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
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

interface PayrollData {
  employeeId: string;
  name: string;
  department: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  overtimeHours: number;
  overtimePay: number;
  bonuses: number;
}

export default function PayrollReport() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedMonth, setSelectedMonth] = useState('2024-01');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  // Mock data
  const payrollData: PayrollData[] = [
    {
      employeeId: 'EMP001',
      name: 'أحمد محمد العتيبي',
      department: 'التقنية',
      basicSalary: 12000,
      allowances: 2000,
      deductions: 1200,
      netSalary: 12800,
      overtimeHours: 15,
      overtimePay: 750,
      bonuses: 1000
    },
    {
      employeeId: 'EMP002',
      name: 'فاطمة علي الأحمدي',
      department: 'المبيعات',
      basicSalary: 8500,
      allowances: 1500,
      deductions: 850,
      netSalary: 9150,
      overtimeHours: 8,
      overtimePay: 400,
      bonuses: 500
    },
    {
      employeeId: 'EMP003',
      name: 'محمد سعد القحطاني',
      department: 'العمليات',
      basicSalary: 15000,
      allowances: 3000,
      deductions: 1800,
      netSalary: 16200,
      overtimeHours: 12,
      overtimePay: 900,
      bonuses: 2000
    }
  ];

  const monthlyTrend = [
    { month: 'يناير', totalPayroll: 2450000, employees: 324 },
    { month: 'فبراير', totalPayroll: 2380000, employees: 318 },
    { month: 'مارس', totalPayroll: 2520000, employees: 330 },
    { month: 'أبريل', totalPayroll: 2680000, employees: 340 },
    { month: 'مايو', totalPayroll: 2750000, employees: 345 },
    { month: 'يونيو', totalPayroll: 2800000, employees: 350 }
  ];

  const departmentPayroll = [
    { department: 'التقنية', amount: 450000, employees: 38 },
    { department: 'المبيعات', amount: 890000, employees: 89 },
    { department: 'العمليات', amount: 1240000, employees: 124 },
    { department: 'المالية', amount: 315000, employees: 45 },
    { department: 'الموارد البشرية', amount: 180000, employees: 28 }
  ];

  const handleExportPayroll = () => {
    toast({
      title: "تصدير كشف المرتبات",
      description: "جاري تصدير كشف المرتبات بصيغة Excel...",
    });
  };

  const filteredPayroll = selectedDepartment === 'all' 
    ? payrollData 
    : payrollData.filter(p => p.department === selectedDepartment);

  const totalBasicSalaries = filteredPayroll.reduce((sum, p) => sum + p.basicSalary, 0);
  const totalAllowances = filteredPayroll.reduce((sum, p) => sum + p.allowances, 0);
  const totalDeductions = filteredPayroll.reduce((sum, p) => sum + p.deductions, 0);
  const totalNetSalaries = filteredPayroll.reduce((sum, p) => sum + p.netSalary, 0);

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
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-3xl font-bold">تقرير الرواتب والمستحقات</h1>
                <p className="text-muted-foreground">تفاصيل كشف المرتبات والمستحقات المالية</p>
              </div>
            </div>
          </div>
          <Button onClick={handleExportPayroll} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            تصدير كشف المرتبات
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">إجمالي الرواتب الأساسية</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {totalBasicSalaries.toLocaleString()} جنيه مصري
                  </p>
                </div>
                <Calculator className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">إجمالي البدلات</p>
                  <p className="text-2xl font-bold text-green-600">
                    {totalAllowances.toLocaleString()} جنيه مصري
                  </p>
                </div>
                <PiggyBank className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">إجمالي الاستقطاعات</p>
                  <p className="text-2xl font-bold text-red-600">
                    {totalDeductions.toLocaleString()} جنيه مصري
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">صافي المرتبات</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {totalNetSalaries.toLocaleString()} جنيه مصري
                  </p>
                </div>
                <CreditCard className="h-8 w-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="اختر الشهر" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024-01">يناير 2024</SelectItem>
              <SelectItem value="2024-02">فبراير 2024</SelectItem>
              <SelectItem value="2024-03">مارس 2024</SelectItem>
              <SelectItem value="2024-04">أبريل 2024</SelectItem>
              <SelectItem value="2024-05">مايو 2024</SelectItem>
              <SelectItem value="2024-06">يونيو 2024</SelectItem>
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
                <TrendingUp className="h-5 w-5 text-blue-500" />
                اتجاه المرتبات الشهرية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyTrend}>
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `${value/1000000}م`} />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip formatter={(value: number) => [`${value.toLocaleString()} جنيه مصري`, 'إجمالي المرتبات']} />
                  <Line 
                    type="monotone" 
                    dataKey="totalPayroll" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5 text-green-500" />
                المرتبات حسب القسم
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departmentPayroll}>
                  <XAxis dataKey="department" />
                  <YAxis tickFormatter={(value) => `${value/1000}ك`} />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip formatter={(value: number) => [`${value.toLocaleString()} جنيه مصري`, 'المرتبات']} />
                  <Bar dataKey="amount" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Payroll Details Table */}
        <Card>
          <CardHeader>
            <CardTitle>تفاصيل كشف المرتبات</CardTitle>
            <CardDescription>
              كشف مفصل بمرتبات الموظفين والبدلات والاستقطاعات
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>رقم الموظف</TableHead>
                  <TableHead>الاسم</TableHead>
                  <TableHead>القسم</TableHead>
                  <TableHead>الراتب الأساسي</TableHead>
                  <TableHead>البدلات</TableHead>
                  <TableHead>ساعات إضافية</TableHead>
                  <TableHead>أجر الساعات الإضافية</TableHead>
                  <TableHead>الحوافز</TableHead>
                  <TableHead>الاستقطاعات</TableHead>
                  <TableHead>صافي الراتب</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayroll.map((payroll) => (
                  <TableRow key={payroll.employeeId}>
                    <TableCell className="font-medium">{payroll.employeeId}</TableCell>
                    <TableCell>{payroll.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{payroll.department}</Badge>
                    </TableCell>
                    <TableCell>{payroll.basicSalary.toLocaleString()} جنيه مصري</TableCell>
                    <TableCell className="text-green-600">
                      +{payroll.allowances.toLocaleString()} جنيه مصري
                    </TableCell>
                    <TableCell>{payroll.overtimeHours} ساعة</TableCell>
                    <TableCell className="text-blue-600">
                      +{payroll.overtimePay.toLocaleString()} جنيه مصري
                    </TableCell>
                    <TableCell className="text-purple-600">
                      +{payroll.bonuses.toLocaleString()} جنيه مصري
                    </TableCell>
                    <TableCell className="text-red-600">
                      -{payroll.deductions.toLocaleString()} جنيه مصري
                    </TableCell>
                    <TableCell className="font-bold text-emerald-600">
                      {payroll.netSalary.toLocaleString()} جنيه مصري
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