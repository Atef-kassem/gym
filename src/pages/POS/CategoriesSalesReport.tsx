import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Search,
  Filter,
  Calendar as CalendarIcon,
  Download,
  Printer,
  RefreshCw,
  BarChart3,
  PieChart,
  TrendingUp,
  Package,
  DollarSign,
  Percent,
  FileText,
  Eye,
  ChevronDown,
  ChevronUp,
  Target,
  Calculator,
  Timer
} from 'lucide-react';
import { PieChart as RechartsPieChart, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Pie } from 'recharts';
import { useNavigate } from 'react-router-dom';

// Mock data for categories sales
const mockCategoriesData = [
  {
    id: 'CAT-001',
    name: '   الكافية',
    operationsCount: 145,
    totalQuantity: 145,
    totalSales: 26100.00,
    percentage: 42.5,
    taxesCollected: 3915.00,
    avgUnitPrice: 180.00,
    subCategories: [
      { name: '  خارجي', sales: 12500.00, count: 65 },
      { name: '  داخلي', sales: 8200.00, count: 48 },
      { name: '  شامل', sales: 5400.00, count: 32 }
    ]
  },
  {
    id: 'CAT-002',
    name: 'تلميع وتشميع',
    operationsCount: 89,
    totalQuantity: 89,
    totalSales: 17800.00,
    percentage: 29.0,
    taxesCollected: 2670.00,
    avgUnitPrice: 200.00,
    subCategories: [
      { name: 'تلميع عادي', sales: 8900.00, count: 45 },
      { name: 'تلميع فاخر', sales: 5600.00, count: 28 },
      { name: 'تشميع', sales: 3300.00, count: 16 }
    ]
  },
  {
    id: 'CAT-003',
    name: 'تنظيف المقاعد',
    operationsCount: 67,
    totalQuantity: 67,
    totalSales: 10050.00,
    percentage: 16.4,
    taxesCollected: 1507.50,
    avgUnitPrice: 150.00,
    subCategories: [
      { name: 'تنظيف جلد', sales: 6000.00, count: 40 },
      { name: 'تنظيف قماش', sales: 4050.00, count: 27 }
    ]
  },
  {
    id: 'CAT-004',
    name: 'خدمات إضافية',
    operationsCount: 34,
    totalQuantity: 34,
    totalSales: 7480.00,
    percentage: 12.1,
    taxesCollected: 1122.00,
    avgUnitPrice: 220.00,
    subCategories: [
      { name: 'تنظيف المحرك', sales: 4200.00, count: 21 },
      { name: 'معطر المشروب', sales: 1680.00, count: 8 },
      { name: 'حماية طلاء', sales: 1600.00, count: 5 }
    ]
  }
];

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

export default function CategoriesSalesReport() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [categoriesData, setCategoriesData] = useState(mockCategoriesData);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [periodFilter, setPeriodFilter] = useState('اليوم');
  const [branchFilter, setBranchFilter] = useState('الكل');
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState('totalSales');
  const [sortOrder, setSortOrder] = useState('desc');
  const [expandedRows, setExpandedRows] = useState(new Set());

  // Calculate totals
  const totals = {
    totalOperations: categoriesData.reduce((sum, cat) => sum + cat.operationsCount, 0),
    totalQuantity: categoriesData.reduce((sum, cat) => sum + cat.totalQuantity, 0),
    totalSales: categoriesData.reduce((sum, cat) => sum + cat.totalSales, 0),
    totalTaxes: categoriesData.reduce((sum, cat) => sum + cat.taxesCollected, 0),
    avgUnitPrice: categoriesData.reduce((sum, cat) => sum + cat.totalSales, 0) / 
                  categoriesData.reduce((sum, cat) => sum + cat.totalQuantity, 0)
  };

  // Filter and sort data
  const filteredData = categoriesData
    .filter(cat => cat.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
    });

  // Chart data
  const pieChartData = filteredData.map(cat => ({
    name: cat.name,
    value: cat.totalSales,
    percentage: cat.percentage
  }));

  const barChartData = filteredData.map(cat => ({
    name: cat.name.substring(0, 10) + '...',
    مبيعات: cat.totalSales,
    عمليات: cat.operationsCount * 100, // Scale for visibility
    ضرائب: cat.taxesCollected
  }));

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const toggleRowExpansion = (categoryId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedRows(newExpanded);
  };

  const exportData = (format) => {
    setIsLoading(true);
    
    setTimeout(() => {
      const exportData = filteredData.map(cat => ({
        'اسم التصنيف': cat.name,
        'عدد العمليات': cat.operationsCount,
        'إجمالي الكمية': cat.totalQuantity,
        'إجمالي المبيعات': `${cat.totalSales.toLocaleString()} جنيه مصري`,
        'النسبة من المبيعات': `${cat.percentage}%`,
        'الضرائب المحصلة': `${cat.taxesCollected.toLocaleString()} جنيه مصري`,
        'متوسط سعر الوحدة': `${cat.avgUnitPrice.toLocaleString()} جنيه مصري`
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
        link.setAttribute('download', `categories-sales-report-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      setIsLoading(false);
      toast({
        title: "تم التصدير بنجاح",
        description: `تم تصدير تقرير مبيعات التصنيفات`,
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
            <title>تقرير إجمالي مبيعات التصنيفات</title>
            <style>
              body { font-family: Arial, sans-serif; direction: rtl; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }
              th { background-color: #f2f2f2; }
              .header { text-align: center; margin-bottom: 20px; }
              .totals { background-color: #f8f9fa; font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>تقرير إجمالي مبيعات التصنيفات</h1>
              <p>فترة التقرير: ${periodFilter}</p>
              <p>تاريخ التقرير: ${new Date().toLocaleDateString('ar-SA')}</p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>اسم التصنيف</th>
                  <th>عدد العمليات</th>
                  <th>إجمالي المبيعات</th>
                  <th>النسبة</th>
                  <th>الضرائب</th>
                  <th>متوسط السعر</th>
                </tr>
              </thead>
              <tbody>
                ${filteredData.map(cat => `
                  <tr>
                    <td>${cat.name}</td>
                    <td>${cat.operationsCount}</td>
                    <td>${cat.totalSales.toLocaleString()} جنيه مصري</td>
                    <td>${cat.percentage}%</td>
                    <td>${cat.taxesCollected.toLocaleString()} جنيه مصري</td>
                    <td>${cat.avgUnitPrice.toLocaleString()} جنيه مصري</td>
                  </tr>
                `).join('')}
                <tr class="totals">
                  <td>الإجمالي</td>
                  <td>${totals.totalOperations}</td>
                  <td>${totals.totalSales.toLocaleString()} جنيه مصري</td>
                  <td>100%</td>
                  <td>${totals.totalTaxes.toLocaleString()} جنيه مصري</td>
                  <td>${totals.avgUnitPrice.toFixed(2)} جنيه مصري</td>
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
        description: "يتم الآن طباعة تقرير مبيعات التصنيفات",
      });
    }, 1000);
  };

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setCategoriesData([...mockCategoriesData]);
      setIsLoading(false);
      toast({
        title: "تم تحديث البيانات",
        description: "تم تحديث بيانات تقرير مبيعات التصنيفات",
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">تقرير إجمالي مبيعات التصنيفات</h1>
            <p className="text-gray-600">تحليل شامل لمبيعات التصنيفات مع النسب والإحصائيات</p>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">إجمالي العمليات</p>
                <p className="text-2xl font-bold text-blue-900">{totals.totalOperations}</p>
              </div>
              <Target className="w-8 h-8 text-blue-600" />
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
                <p className="text-sm font-medium text-purple-600">إجمالي الكمية</p>
                <p className="text-2xl font-bold text-purple-900">{totals.totalQuantity}</p>
              </div>
              <Package className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">الضرائب المحصلة</p>
                <p className="text-2xl font-bold text-orange-900">{totals.totalTaxes.toLocaleString()}</p>
                <p className="text-xs text-orange-700">جنيه مصري</p>
              </div>
              <Percent className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-indigo-50 to-indigo-100 border-indigo-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-indigo-600">متوسط سعر الوحدة</p>
                <p className="text-2xl font-bold text-indigo-900">{totals.avgUnitPrice.toFixed(0)}</p>
                <p className="text-xs text-indigo-700">جنيه مصري</p>
              </div>
              <Calculator className="w-8 h-8 text-indigo-600" />
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="البحث في التصنيفات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>

            <Select value={periodFilter} onValueChange={setPeriodFilter}>
              <SelectTrigger>
                <SelectValue placeholder="فترة التقرير" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="اليوم">اليوم</SelectItem>
                <SelectItem value="الأسبوع">الأسبوع</SelectItem>
                <SelectItem value="الشهر">الشهر</SelectItem>
                <SelectItem value="الربع">الربع</SelectItem>
                <SelectItem value="السنة">السنة</SelectItem>
                <SelectItem value="مخصص">فترة مخصصة</SelectItem>
              </SelectContent>
            </Select>

            <Select value={branchFilter} onValueChange={setBranchFilter}>
              <SelectTrigger>
                <SelectValue placeholder="الفرع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="الكل">جميع الفروع</SelectItem>
                <SelectItem value="الرياض">فرع الرياض</SelectItem>
                <SelectItem value="جدة">فرع جدة</SelectItem>
                <SelectItem value="الدمام">فرع الدمام</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={() => {
                setSearchTerm('');
                setPeriodFilter('اليوم');
                setBranchFilter('الكل');
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="table" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            جدول البيانات
          </TabsTrigger>
          <TabsTrigger value="pie-chart" className="flex items-center gap-2">
            <PieChart className="w-4 h-4" />
            الرسم الدائري
          </TabsTrigger>
          <TabsTrigger value="bar-chart" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            الرسم البياني
          </TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>تفاصيل مبيعات التصنيفات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-8"></TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('name')}
                      >
                        <div className="flex items-center gap-2">
                          اسم التصنيف
                          {sortBy === 'name' && (
                            sortOrder === 'desc' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('operationsCount')}
                      >
                        <div className="flex items-center gap-2">
                          عدد العمليات
                          {sortBy === 'operationsCount' && (
                            sortOrder === 'desc' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('totalQuantity')}
                      >
                        <div className="flex items-center gap-2">
                          إجمالي الكمية
                          {sortBy === 'totalQuantity' && (
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
                      <TableHead 
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('percentage')}
                      >
                        <div className="flex items-center gap-2">
                          النسبة من المبيعات
                          {sortBy === 'percentage' && (
                            sortOrder === 'desc' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('taxesCollected')}
                      >
                        <div className="flex items-center gap-2">
                          الضرائب المحصلة
                          {sortBy === 'taxesCollected' && (
                            sortOrder === 'desc' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('avgUnitPrice')}
                      >
                        <div className="flex items-center gap-2">
                          متوسط سعر الوحدة
                          {sortBy === 'avgUnitPrice' && (
                            sortOrder === 'desc' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />
                          )}
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                     {filteredData.map((category) => (
                       <>
                         <TableRow key={category.id} className="hover:bg-gray-50">
                           <TableCell>
                             <Button
                               variant="ghost"
                               size="sm"
                               onClick={() => toggleRowExpansion(category.id)}
                             >
                               {expandedRows.has(category.id) ? 
                                 <ChevronUp className="w-4 h-4" /> : 
                                 <ChevronDown className="w-4 h-4" />
                               }
                             </Button>
                           </TableCell>
                           <TableCell className="font-medium">{category.name}</TableCell>
                           <TableCell>{category.operationsCount}</TableCell>
                           <TableCell>{category.totalQuantity}</TableCell>
                           <TableCell className="font-bold text-green-600">
                             {category.totalSales.toLocaleString()} جنيه مصري
                           </TableCell>
                           <TableCell>
                             <div className="flex items-center gap-2">
                               <div className="w-16 bg-gray-200 rounded-full h-2">
                                 <div 
                                   className="bg-blue-600 h-2 rounded-full" 
                                   style={{ width: `${category.percentage}%` }}
                                 ></div>
                               </div>
                               <span className="text-sm font-medium">{category.percentage}%</span>
                             </div>
                           </TableCell>
                           <TableCell className="text-orange-600">
                             {category.taxesCollected.toLocaleString()} جنيه مصري
                           </TableCell>
                           <TableCell className="text-purple-600">
                             {category.avgUnitPrice.toLocaleString()} جنيه مصري
                           </TableCell>
                         </TableRow>
                         
                         {expandedRows.has(category.id) && (
                           <TableRow className="bg-gray-50">
                             <TableCell colSpan={8}>
                               <div className="p-4">
                                 <h4 className="font-semibold mb-3 text-gray-700">التصنيفات الفرعية:</h4>
                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                   {category.subCategories.map((subCat, index) => (
                                     <div key={index} className="bg-white p-3 rounded-lg border">
                                       <h5 className="font-medium text-gray-900">{subCat.name}</h5>
                                       <p className="text-sm text-gray-600">العمليات: {subCat.count}</p>
                                       <p className="text-sm font-semibold text-green-600">
                                         المبيعات: {subCat.sales.toLocaleString()} جنيه مصري
                                       </p>
                                     </div>
                                   ))}
                                 </div>
                               </div>
                             </TableCell>
                           </TableRow>
                         )}
                       </>
                     ))}
                    
                    {/* Totals Row */}
                    <TableRow className="bg-blue-50 font-bold border-t-2 border-blue-200">
                      <TableCell></TableCell>
                      <TableCell>الإجمالي</TableCell>
                      <TableCell>{totals.totalOperations}</TableCell>
                      <TableCell>{totals.totalQuantity}</TableCell>
                      <TableCell className="text-green-700">
                        {totals.totalSales.toLocaleString()} جنيه مصري
                      </TableCell>
                      <TableCell>100%</TableCell>
                      <TableCell className="text-orange-700">
                        {totals.totalTaxes.toLocaleString()} جنيه مصري
                      </TableCell>
                      <TableCell className="text-purple-700">
                        {totals.avgUnitPrice.toFixed(0)} جنيه مصري
                      </TableCell>
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
              <CardTitle>توزيع المبيعات حسب التصنيفات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value.toLocaleString()} جنيه مصري`, 'المبيعات']} />
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
              <CardTitle>مقارنة المبيعات والعمليات والضرائب</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData}>
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
                    <Bar dataKey="ضرائب" fill="#F59E0B" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}