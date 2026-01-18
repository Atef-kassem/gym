import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Search,
  Filter,
  Download,
  Printer,
  RefreshCw,
  BarChart3,
  PieChart,
  Clock,
  DollarSign,
  Users,
  FileText,
  ChevronDown,
  ChevronUp,
  Calculator,
  TrendingUp,
  CreditCard,
  Banknote,
  Smartphone,
  Eye,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { PieChart as RechartsPieChart, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Pie, LineChart, Line } from 'recharts';
import { useNavigate } from 'react-router-dom';

// Mock data for shifts sales
const mockShiftsData = [
  {
    id: 'SHIFT-001',
    shiftName: 'الوردية الصباحية',
    employeeName: 'أحمد محمد الكاشير',
    employeeId: 'EMP-001',
    startTime: '2024-01-20T08:00:00',
    endTime: '2024-01-20T16:00:00',
    totalOperations: 45,
    totalSales: 13500.00,
    totalDiscounts: 675.00,
    taxes: 2025.00,
    paymentMethods: {
      cash: 8100.00,
      card: 4500.00,
      transfer: 900.00
    },
    shiftRevenue: 13500.00,
    status: 'مكتملة',
    notes: 'وردية عادية - أداء ممتاز',
    performance: 'ممتاز'
  },
  {
    id: 'SHIFT-002',
    shiftName: 'الوردية المسائية',
    employeeName: 'سارة علي الكاشير',
    employeeId: 'EMP-002',
    startTime: '2024-01-20T16:00:00',
    endTime: '2024-01-21T00:00:00',
    totalOperations: 38,
    totalSales: 11400.00,
    totalDiscounts: 570.00,
    taxes: 1710.00,
    paymentMethods: {
      cash: 5700.00,
      card: 4560.00,
      transfer: 1140.00
    },
    shiftRevenue: 11400.00,
    status: 'مكتملة',
    notes: 'وردية مسائية هادئة',
    performance: 'جيد'
  },
  {
    id: 'SHIFT-003',
    shiftName: 'الوردية الليلية',
    employeeName: 'محمد خالد الموظف',
    employeeId: 'EMP-003',
    startTime: '2024-01-21T00:00:00',
    endTime: '2024-01-21T08:00:00',
    totalOperations: 18,
    totalSales: 5400.00,
    totalDiscounts: 270.00,
    taxes: 810.00,
    paymentMethods: {
      cash: 2700.00,
      card: 2160.00,
      transfer: 540.00
    },
    shiftRevenue: 5400.00,
    status: 'مكتملة',
    notes: 'وردية ليلية - حركة قليلة',
    performance: 'مقبول'
  },
  {
    id: 'SHIFT-004',
    shiftName: 'وردية نهاية الأسبوع',
    employeeName: 'نورا أحمد المشرف',
    employeeId: 'EMP-004',
    startTime: '2024-01-19T10:00:00',
    endTime: '2024-01-19T18:00:00',
    totalOperations: 67,
    totalSales: 20100.00,
    totalDiscounts: 1005.00,
    taxes: 3015.00,
    paymentMethods: {
      cash: 10050.00,
      card: 8040.00,
      transfer: 2010.00
    },
    shiftRevenue: 20100.00,
    status: 'مكتملة',
    notes: 'نهاية الأسبوع - ذروة العمل',
    performance: 'ممتاز'
  },
  {
    id: 'SHIFT-005',
    shiftName: 'الوردية الصباحية المبكرة',
    employeeName: 'علي حسن الكاشير',
    employeeId: 'EMP-005',
    startTime: '2024-01-20T06:00:00',
    endTime: '2024-01-20T14:00:00',
    totalOperations: 32,
    totalSales: 9600.00,
    totalDiscounts: 480.00,
    taxes: 1440.00,
    paymentMethods: {
      cash: 4800.00,
      card: 3840.00,
      transfer: 960.00
    },
    shiftRevenue: 9600.00,
    status: 'مكتملة',
    notes: 'وردية مبكرة - عملاء الصباح',
    performance: 'جيد'
  },
  {
    id: 'SHIFT-006',
    shiftName: 'الوردية الحالية',
    employeeName: 'ليلى محمد الكاشير',
    employeeId: 'EMP-006',
    startTime: '2024-01-21T14:00:00',
    endTime: null,
    totalOperations: 15,
    totalSales: 4500.00,
    totalDiscounts: 225.00,
    taxes: 675.00,
    paymentMethods: {
      cash: 2250.00,
      card: 1800.00,
      transfer: 450.00
    },
    shiftRevenue: 4500.00,
    status: 'نشطة',
    notes: 'وردية جارية',
    performance: 'جيد'
  }
];

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

export default function ShiftsSalesReport() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [shiftsData, setShiftsData] = useState(mockShiftsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('الكل');
  const [employeeFilter, setEmployeeFilter] = useState('الكل');
  const [periodFilter, setPeriodFilter] = useState('اليوم');
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState('totalSales');
  const [sortOrder, setSortOrder] = useState('desc');

  // Calculate totals
  const totals = {
    totalShifts: shiftsData.length,
    totalOperations: shiftsData.reduce((sum, shift) => sum + shift.totalOperations, 0),
    totalSales: shiftsData.reduce((sum, shift) => sum + shift.totalSales, 0),
    totalDiscounts: shiftsData.reduce((sum, shift) => sum + shift.totalDiscounts, 0),
    totalTaxes: shiftsData.reduce((sum, shift) => sum + shift.taxes, 0),
    totalRevenue: shiftsData.reduce((sum, shift) => sum + shift.shiftRevenue, 0),
    avgSalesPerShift: shiftsData.reduce((sum, shift) => sum + shift.totalSales, 0) / shiftsData.length,
    totalCash: shiftsData.reduce((sum, shift) => sum + shift.paymentMethods.cash, 0),
    totalCard: shiftsData.reduce((sum, shift) => sum + shift.paymentMethods.card, 0),
    totalTransfer: shiftsData.reduce((sum, shift) => sum + shift.paymentMethods.transfer, 0)
  };

  // Filter and sort data
  const filteredData = shiftsData
    .filter(shift => {
      const matchesSearch = searchTerm === '' || 
        shift.shiftName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shift.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shift.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'الكل' || shift.status === statusFilter;
      const matchesEmployee = employeeFilter === 'الكل' || shift.employeeName === employeeFilter;
      return matchesSearch && matchesStatus && matchesEmployee;
    })
    .sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
    });

  // Chart data
  const salesChartData = filteredData.map(shift => ({
    name: shift.shiftName.substring(0, 10) + '...',
    مبيعات: shift.totalSales,
    عمليات: shift.totalOperations * 100, // Scale for visibility
    خصومات: shift.totalDiscounts
  }));

  const paymentMethodsData = [
    { name: 'نقدي', value: totals.totalCash, color: '#10B981' },
    { name: 'بطاقة ائتمان', value: totals.totalCard, color: '#3B82F6' },
    { name: 'تحويل', value: totals.totalTransfer, color: '#F59E0B' }
  ];

  const performanceData = filteredData.map(shift => ({
    name: shift.employeeName.substring(0, 10) + '...',
    المبيعات: shift.totalSales,
    العمليات: shift.totalOperations,
    الأداء: shift.performance === 'ممتاز' ? 100 : shift.performance === 'جيد' ? 75 : 50
  }));

  // Get unique values for filters
  const uniqueStatuses = [...new Set(shiftsData.map(shift => shift.status))];
  const uniqueEmployees = [...new Set(shiftsData.map(shift => shift.employeeName))];

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'جارية';
    const date = new Date(timeString);
    return date.toLocaleTimeString('ar-SA', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDuration = (start, end) => {
    if (!end) return 'جارية';
    const startTime = new Date(start);
    const endTime = new Date(end);
    const duration = (Number(endTime) - Number(startTime)) / (1000 * 60 * 60); // hours
    return `${duration.toFixed(1)} ساعة`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'مكتملة': return 'bg-green-100 text-green-800';
      case 'نشطة': return 'bg-blue-100 text-blue-800';
      case 'متوقفة': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPerformanceColor = (performance) => {
    switch (performance) {
      case 'ممتاز': return 'text-green-600';
      case 'جيد': return 'text-blue-600';
      case 'مقبول': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const exportData = (format) => {
    setIsLoading(true);
    
    setTimeout(() => {
      const exportData = filteredData.map(shift => ({
        'رقم/اسم الوردية': shift.shiftName,
        'اسم الموظف/الكاشير': shift.employeeName,
        'وقت البدء': formatTime(shift.startTime),
        'وقت الانتهاء': formatTime(shift.endTime),
        'إجمالي العمليات': shift.totalOperations,
        'إجمالي المبيعات': `${shift.totalSales.toLocaleString()} جنيه مصري`,
        'إجمالي الخصومات': `${shift.totalDiscounts.toLocaleString()} جنيه مصري`,
        'الضرائب': `${shift.taxes.toLocaleString()} جنيه مصري`,
        'نقدي': `${shift.paymentMethods.cash.toLocaleString()} جنيه مصري`,
        'بطاقة': `${shift.paymentMethods.card.toLocaleString()} جنيه مصري`,
        'تحويل': `${shift.paymentMethods.transfer.toLocaleString()} جنيه مصري`,
        'إيرادات الوردية': `${shift.shiftRevenue.toLocaleString()} جنيه مصري`,
        'الحالة': shift.status,
        'ملاحظات': shift.notes
      }));

      if (format === 'csv') {
        const csvContent = [
          Object.keys(exportData[0]).join(','),
          ...exportData.map(row => Object.values(row).join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `shifts-sales-report-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      setIsLoading(false);
      toast({
        title: "تم التصدير بنجاح",
        description: `تم تصدير تقرير مبيعات الورديات`,
      });
    }, 1500);
  };

  const printReport = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>تقرير مبيعات الورديات</title>
            <style>
              body { font-family: Arial, sans-serif; direction: rtl; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }
              th { background-color: #f2f2f2; }
              .header { text-align: center; margin-bottom: 20px; }
              .totals { background-color: #f8f9fa; font-weight: bold; }
              .active { background-color: #dbeafe; }
              .completed { background-color: #dcfce7; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>تقرير مبيعات الورديات</h1>
              <p>فترة التقرير: ${periodFilter}</p>
              <p>تاريخ التقرير: ${new Date().toLocaleDateString('ar-SA')}</p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>اسم الوردية</th>
                  <th>اسم الكاشير</th>
                  <th>المدة</th>
                  <th>العمليات</th>
                  <th>المبيعات</th>
                  <th>الخصومات</th>
                  <th>الحالة</th>
                </tr>
              </thead>
              <tbody>
                ${filteredData.map(shift => `
                  <tr class="${shift.status === 'نشطة' ? 'active' : 'completed'}">
                    <td>${shift.shiftName}</td>
                    <td>${shift.employeeName}</td>
                    <td>${formatDuration(shift.startTime, shift.endTime)}</td>
                    <td>${shift.totalOperations}</td>
                    <td>${shift.totalSales.toLocaleString()} جنيه مصري</td>
                    <td>${shift.totalDiscounts.toLocaleString()} جنيه مصري</td>
                    <td>${shift.status}</td>
                  </tr>
                `).join('')}
                <tr class="totals">
                  <td colspan="3">الإجمالي</td>
                  <td>${totals.totalOperations}</td>
                  <td>${totals.totalSales.toLocaleString()} جنيه مصري</td>
                  <td>${totals.totalDiscounts.toLocaleString()} جنيه مصري</td>
                  <td>${totals.totalShifts} وردية</td>
                </tr>
              </tbody>
            </table>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
      
      setIsLoading(false);
      toast({
        title: "تم إرسال التقرير للطابعة",
        description: "يتم الآن طباعة تقرير مبيعات الورديات",
      });
    }, 1000);
  };

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setShiftsData([...mockShiftsData]);
      setIsLoading(false);
      toast({
        title: "تم تحديث البيانات",
        description: "تم تحديث بيانات تقرير مبيعات الورديات",
      });
    }, 1000);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/pos/reports')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            العودة للتقارير
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">تقرير مبيعات الورديات</h1>
            <p className="text-gray-600">تحليل شامل لأداء كل وردية ومبيعات كل كاشير</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={refreshData}
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            تحديث
          </Button>
          <Button
            onClick={printReport}
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            <Printer className="w-4 h-4 mr-2" />
            طباعة
          </Button>
          <Button
            onClick={() => exportData('csv')}
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            <Download className="w-4 h-4 mr-2" />
            تصدير Excel
          </Button>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">إجمالي الورديات</p>
                <p className="text-2xl font-bold text-blue-900">{totals.totalShifts}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">إجمالي المبيعات</p>
                <p className="text-2xl font-bold text-green-900">{totals.totalSales.toLocaleString()}</p>
                <p className="text-xs text-green-700">جنيه مصري</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">إجمالي العمليات</p>
                <p className="text-2xl font-bold text-purple-900">{totals.totalOperations}</p>
              </div>
              <Calculator className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">متوسط المبيعات</p>
                <p className="text-2xl font-bold text-orange-900">{totals.avgSalesPerShift.toFixed(0)}</p>
                <p className="text-xs text-orange-700">جنيه مصري/وردية</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">إجمالي النقدي</p>
                <p className="text-xl font-bold text-green-900">{totals.totalCash.toLocaleString()}</p>
                <p className="text-xs text-green-700">جنيه مصري</p>
              </div>
              <Banknote className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">إجمالي البطاقات</p>
                <p className="text-xl font-bold text-blue-900">{totals.totalCard.toLocaleString()}</p>
                <p className="text-xs text-blue-700">جنيه مصري</p>
              </div>
              <CreditCard className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">إجمالي التحويلات</p>
                <p className="text-xl font-bold text-yellow-900">{totals.totalTransfer.toLocaleString()}</p>
                <p className="text-xs text-yellow-700">جنيه مصري</p>
              </div>
              <Smartphone className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            الفلاتر والتحكم
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="البحث في الورديات (اسم، موظف، رقم)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="حالة الوردية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="الكل">جميع الحالات</SelectItem>
                {uniqueStatuses.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={employeeFilter} onValueChange={setEmployeeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="الموظف" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="الكل">جميع الموظفين</SelectItem>
                {uniqueEmployees.map(employee => (
                  <SelectItem key={employee} value={employee}>{employee}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={periodFilter} onValueChange={setPeriodFilter}>
              <SelectTrigger>
                <SelectValue placeholder="فترة التقرير" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="اليوم">اليوم</SelectItem>
                <SelectItem value="الأسبوع">الأسبوع</SelectItem>
                <SelectItem value="الشهر">الشهر</SelectItem>
                <SelectItem value="مخصص">فترة مخصصة</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('الكل');
                setEmployeeFilter('الكل');
                setPeriodFilter('اليوم');
              }}
              variant="outline"
            >
              مسح الفلاتر
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Charts and Data */}
      <Tabs defaultValue="table" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="table" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            جدول البيانات
          </TabsTrigger>
          <TabsTrigger value="pie-chart" className="flex items-center gap-2">
            <PieChart className="w-4 h-4" />
            طرق الدفع
          </TabsTrigger>
          <TabsTrigger value="bar-chart" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            مقارنة الورديات
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            أداء الموظفين
          </TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>تفاصيل مبيعات الورديات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead 
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('shiftName')}
                      >
                        <div className="flex items-center gap-2">
                          رقم/اسم الوردية
                          {sortBy === 'shiftName' && (
                            sortOrder === 'desc' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('employeeName')}
                      >
                        <div className="flex items-center gap-2">
                          اسم الموظف/الكاشير
                          {sortBy === 'employeeName' && (
                            sortOrder === 'desc' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead>توقيت الوردية</TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('totalOperations')}
                      >
                        <div className="flex items-center gap-2">
                          إجمالي العمليات
                          {sortBy === 'totalOperations' && (
                            sortOrder === 'desc' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('totalSales')}
                      >
                        <div className="flex items-center gap-2">
                          إجمالي المبيعات
                          {sortBy === 'totalSales' && (
                            sortOrder === 'desc' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead>طرق الدفع</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>الأداء</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((shift) => (
                      <TableRow 
                        key={shift.id} 
                        className={cn(
                          "hover:bg-gray-50",
                          shift.status === 'نشطة' && "bg-blue-50"
                        )}
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {shift.status === 'نشطة' ? (
                              <AlertCircle className="w-4 h-4 text-blue-500" />
                            ) : (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            )}
                            <div>
                              <div className="font-semibold">{shift.shiftName}</div>
                              <div className="text-xs text-gray-500">{shift.id}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{shift.employeeName}</div>
                            <div className="text-xs text-gray-500">{shift.employeeId}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">
                              <span className="text-gray-600">من:</span> {formatTime(shift.startTime)}
                            </div>
                            <div className="text-sm">
                              <span className="text-gray-600">إلى:</span> {formatTime(shift.endTime)}
                            </div>
                            <div className="text-xs text-blue-600 font-medium">
                              المدة: {formatDuration(shift.startTime, shift.endTime)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center font-semibold text-purple-600">
                          {shift.totalOperations}
                        </TableCell>
                        <TableCell className="font-bold text-green-600">
                          {shift.totalSales.toLocaleString()} جنيه مصري
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1 text-xs">
                            <div className="flex items-center gap-1">
                              <Banknote className="w-3 h-3 text-green-600" />
                              <span>{shift.paymentMethods.cash.toLocaleString()} جنيه مصري</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <CreditCard className="w-3 h-3 text-blue-600" />
                              <span>{shift.paymentMethods.card.toLocaleString()} جنيه مصري</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Smartphone className="w-3 h-3 text-yellow-600" />
                              <span>{shift.paymentMethods.transfer.toLocaleString()} جنيه مصري</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(shift.status)}>
                            {shift.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className={cn("font-medium", getPerformanceColor(shift.performance))}>
                            {shift.performance}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                    
                    {/* Totals Row */}
                    <TableRow className="bg-blue-50 font-bold border-t-2 border-blue-200">
                      <TableCell colSpan={3}>الإجمالي</TableCell>
                      <TableCell className="text-center text-purple-700">
                        {totals.totalOperations}
                      </TableCell>
                      <TableCell className="text-green-700">
                        {totals.totalSales.toLocaleString()} جنيه مصري
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-xs">
                          <div>نقدي: {totals.totalCash.toLocaleString()} جنيه مصري</div>
                          <div>بطاقة: {totals.totalCard.toLocaleString()} جنيه مصري</div>
                          <div>تحويل: {totals.totalTransfer.toLocaleString()} جنيه مصري</div>
                        </div>
                      </TableCell>
                      <TableCell colSpan={2}>{totals.totalShifts} وردية</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pie-chart" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>توزيع طرق الدفع في الورديات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={paymentMethodsData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value.toLocaleString()} جنيه مصري`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {paymentMethodsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value.toLocaleString()} جنيه مصري`, 'المبلغ']} />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bar-chart" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>مقارنة مبيعات الورديات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => {
                        if (name === 'عمليات') return [Math.round(Number(value) / 100), 'عدد العمليات'];
                        return [`${value.toLocaleString()} جنيه مصري`, name];
                      }}
                    />
                    <Legend />
                    <Bar dataKey="مبيعات" fill="#3B82F6" />
                    <Bar dataKey="عمليات" fill="#10B981" />
                    <Bar dataKey="خصومات" fill="#F59E0B" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>أداء الموظفين في الورديات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => {
                        if (name === 'الأداء') return [`${value}%`, 'مستوى الأداء'];
                        if (name === 'العمليات') return [value, 'عدد العمليات'];
                        return [`${value.toLocaleString()} جنيه مصري`, name];
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="المبيعات" stroke="#3B82F6" strokeWidth={3} />
                    <Line type="monotone" dataKey="العمليات" stroke="#10B981" strokeWidth={3} />
                    <Line type="monotone" dataKey="الأداء" stroke="#F59E0B" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}