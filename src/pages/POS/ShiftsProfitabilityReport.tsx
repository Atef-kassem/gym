import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Calculator, 
  DollarSign, 
  Percent, 
  Download, 
  Printer,
  Search,
  ArrowRight,
  Target,
  BarChart3
} from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for shift profitability
const shiftProfitability = [
  {
    id: 1,
    shiftId: 'S001',
    date: '2024-01-15',
    cashierName: 'أحمد محمد',
    startTime: '08:00',
    endTime: '16:00',
    totalSales: 2450,
    totalCost: 1470,
    grossProfit: 980,
    expenses: 120,
    netProfit: 860,
    profitMargin: 35.1,
    servicesCount: 18,
    avgOrderValue: 136.11,
    status: 'مكتملة'
  },
  {
    id: 2,
    shiftId: 'S002',
    date: '2024-01-15',
    cashierName: 'فاطمة أحمد',
    startTime: '16:00',
    endTime: '24:00',
    totalSales: 1980,
    totalCost: 1188,
    grossProfit: 792,
    expenses: 80,
    netProfit: 712,
    profitMargin: 36.0,
    servicesCount: 14,
    avgOrderValue: 141.43,
    status: 'مكتملة'
  },
  {
    id: 3,
    shiftId: 'S003',
    date: '2024-01-16',
    cashierName: 'محمد علي',
    startTime: '08:00',
    endTime: '16:00',
    totalSales: 3200,
    totalCost: 1920,
    grossProfit: 1280,
    expenses: 150,
    netProfit: 1130,
    profitMargin: 35.3,
    servicesCount: 22,
    avgOrderValue: 145.45,
    status: 'مكتملة'
  },
  {
    id: 4,
    shiftId: 'S004',
    date: '2024-01-16',
    cashierName: 'نورا خالد',
    startTime: '16:00',
    endTime: '24:00',
    totalSales: 1750,
    totalCost: 1050,
    grossProfit: 700,
    expenses: 90,
    netProfit: 610,
    profitMargin: 34.9,
    servicesCount: 12,
    avgOrderValue: 145.83,
    status: 'مكتملة'
  }
];

const profitabilityTrends = [
  { name: 'الإثنين', profit: 1572, margin: 35.1 },
  { name: 'الثلاثاء', profit: 1890, margin: 36.2 },
  { name: 'الأربعاء', profit: 2100, margin: 37.1 },
  { name: 'الخميس', profit: 1650, margin: 34.8 },
  { name: 'الجمعة', profit: 2450, margin: 38.2 },
  { name: 'السبت', profit: 2200, margin: 36.9 },
  { name: 'الأحد', profit: 1800, margin: 35.5 }
];

const profitDistribution = [
  { name: 'الوردية الصباحية', value: 45, profit: 1990 },
  { name: 'الوردية المسائية', value: 35, profit: 1322 },
  { name: 'الوردية الليلية', value: 20, profit: 850 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function ShiftsProfitabilityReport() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [selectedCashier, setSelectedCashier] = useState('all');

  const filteredShifts = shiftProfitability.filter(shift => {
    const matchesSearch = shift.cashierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shift.shiftId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCashier = selectedCashier === 'all' || shift.cashierName === selectedCashier;
    
    return matchesSearch && matchesCashier;
  });

  const totalProfitability = {
    totalSales: filteredShifts.reduce((sum, shift) => sum + shift.totalSales, 0),
    totalCost: filteredShifts.reduce((sum, shift) => sum + shift.totalCost, 0),
    totalProfit: filteredShifts.reduce((sum, shift) => sum + shift.netProfit, 0),
    avgMargin: filteredShifts.reduce((sum, shift) => sum + shift.profitMargin, 0) / filteredShifts.length
  };

  const exportToCSV = () => {
    const headers = ['رقم الوردية', 'التاريخ', 'الكاشير', 'إجمالي المبيعات', 'التكلفة', 'الربح الإجمالي', 'المصروفات', 'صافي الربح', 'هامش الربح', 'عدد الخدمات'];
    const csvContent = [
      headers.join(','),
      ...filteredShifts.map(shift => [
        shift.shiftId,
        shift.date,
        shift.cashierName,
        shift.totalSales,
        shift.totalCost,
        shift.grossProfit,
        shift.expenses,
        shift.netProfit,
        shift.profitMargin + '%',
        shift.servicesCount
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'shifts_profitability_report.csv';
    link.click();
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/pos/reports')}
            className="flex items-center gap-2"
          >
            <ArrowRight className="w-4 h-4" />
            العودة للتقارير
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">تقرير ربحية الورديات</h1>
            <p className="text-gray-600 mt-2">معرفة صافي ربح كل وردية مع تكلفة المنتجات</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportToCSV} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            تصدير CSV
          </Button>
          <Button onClick={printReport} variant="outline">
            <Printer className="w-4 h-4 mr-2" />
            طباعة
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            فلاتر البحث
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="البحث في الورديات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger>
                <SelectValue placeholder="اختر الفترة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">اليوم</SelectItem>
                <SelectItem value="week">هذا الأسبوع</SelectItem>
                <SelectItem value="month">هذا الشهر</SelectItem>
                <SelectItem value="quarter">هذا الربع</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedCashier} onValueChange={setSelectedCashier}>
              <SelectTrigger>
                <SelectValue placeholder="اختر الكاشير" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الكاشيرين</SelectItem>
                <SelectItem value="أحمد محمد">أحمد محمد</SelectItem>
                <SelectItem value="فاطمة أحمد">فاطمة أحمد</SelectItem>
                <SelectItem value="محمد علي">محمد علي</SelectItem>
                <SelectItem value="نورا خالد">نورا خالد</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setSelectedPeriod('today');
              setSelectedCashier('all');
            }}>
              إعادة تعيين
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-green-50 to-green-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">إجمالي الأرباح</p>
                <p className="text-2xl font-bold text-green-900">{totalProfitability.totalProfit.toLocaleString()} جنيه</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">إجمالي المبيعات</p>
                <p className="text-2xl font-bold text-blue-900">{totalProfitability.totalSales.toLocaleString()} جنيه</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">متوسط هامش الربح</p>
                <p className="text-2xl font-bold text-purple-900">{totalProfitability.avgMargin.toFixed(1)}%</p>
              </div>
              <Percent className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">إجمالي التكلفة</p>
                <p className="text-2xl font-bold text-orange-900">{totalProfitability.totalCost.toLocaleString()} جنيه</p>
              </div>
              <Calculator className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              اتجاه الربحية الأسبوعية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={profitabilityTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'profit' ? `${value} جنيه` : `${value}%`,
                    name === 'profit' ? 'الربح' : 'هامش الربح'
                  ]}
                />
                <Bar dataKey="profit" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              توزيع الأرباح حسب الوردية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={profitDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {profitDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'النسبة']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Profitability Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            جدول ربحية الورديات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>رقم الوردية</TableHead>
                  <TableHead>التاريخ</TableHead>
                  <TableHead>الكاشير</TableHead>
                  <TableHead>المبيعات</TableHead>
                  <TableHead>التكلفة</TableHead>
                  <TableHead>الربح الإجمالي</TableHead>
                  <TableHead>المصروفات</TableHead>
                  <TableHead>صافي الربح</TableHead>
                  <TableHead>هامش الربح</TableHead>
                  <TableHead>عدد الخدمات</TableHead>
                  <TableHead>متوسط قيمة الطلب</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredShifts.map((shift) => (
                  <TableRow key={shift.id}>
                    <TableCell>
                      <Badge variant="outline">{shift.shiftId}</Badge>
                    </TableCell>
                    <TableCell>{shift.date}</TableCell>
                    <TableCell>{shift.cashierName}</TableCell>
                    <TableCell className="font-semibold">
                      {shift.totalSales.toLocaleString()} جنيه
                    </TableCell>
                    <TableCell className="text-red-600">
                      {shift.totalCost.toLocaleString()} جنيه
                    </TableCell>
                    <TableCell className="text-green-600 font-semibold">
                      {shift.grossProfit.toLocaleString()} جنيه
                    </TableCell>
                    <TableCell className="text-orange-600">
                      {shift.expenses.toLocaleString()} جنيه
                    </TableCell>
                    <TableCell className="text-green-600 font-bold">
                      {shift.netProfit.toLocaleString()} جنيه
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={shift.profitMargin} className="w-16 h-2" />
                        <span className="text-sm font-medium">{shift.profitMargin.toFixed(1)}%</span>
                      </div>
                    </TableCell>
                    <TableCell>{shift.servicesCount}</TableCell>
                    <TableCell>{shift.avgOrderValue.toFixed(2)} جنيه</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">أفضل وردية (ربحية)</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-2">
              <Badge className="bg-green-100 text-green-800 text-lg px-4 py-2">
                {shiftProfitability[2].shiftId}
              </Badge>
              <p className="text-2xl font-bold text-green-600">
                {shiftProfitability[2].netProfit.toLocaleString()} جنيه
              </p>
              <p className="text-sm text-gray-600">
                هامش الربح: {shiftProfitability[2].profitMargin}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">أعلى هامش ربح</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-2">
              <Badge className="bg-blue-100 text-blue-800 text-lg px-4 py-2">
                {shiftProfitability[1].shiftId}
              </Badge>
              <p className="text-2xl font-bold text-blue-600">
                {shiftProfitability[1].profitMargin}%
              </p>
              <p className="text-sm text-gray-600">
                صافي الربح: {shiftProfitability[1].netProfit.toLocaleString()} جنيه
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">متوسط الربح اليومي</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-2">
              <Badge className="bg-purple-100 text-purple-800 text-lg px-4 py-2">
                متوسط عام
              </Badge>
              <p className="text-2xl font-bold text-purple-600">
                {(totalProfitability.totalProfit / 2).toLocaleString()} جنيه
              </p>
              <p className="text-sm text-gray-600">
                متوسط هامش الربح: {totalProfitability.avgMargin.toFixed(1)}%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}