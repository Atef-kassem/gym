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
  Package,
  DollarSign,
  Percent,
  FileText,
  ChevronDown,
  ChevronUp,
  Target,
  Calculator,
  TrendingUp,
  Eye,
  Star
} from 'lucide-react';
import { PieChart as RechartsPieChart, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Pie } from 'recharts';
import { useNavigate } from 'react-router-dom';

// Mock data for products and services sales
const mockProductsData = [
  {
    id: 'PRD-001',
    name: '  خارجي عادي',
    category: '   الكافية',
    code: 'WA001',
    barcode: '1234567890001',
    salesCount: 85,
    quantitySold: 85,
    totalSales: 12750.00,
    discountsApplied: 850.00,
    taxes: 1912.50,
    avgSalePrice: 150.00,
    salesPercentage: 18.5,
    topSelling: true
  },
  {
    id: 'PRD-002',
    name: '  شامل VIP',
    category: '   الكافية',
    code: 'WA002',
    barcode: '1234567890002',
    salesCount: 45,
    quantitySold: 45,
    totalSales: 13500.00,
    discountsApplied: 675.00,
    taxes: 2025.00,
    avgSalePrice: 300.00,
    salesPercentage: 19.6,
    topSelling: true
  },
  {
    id: 'PRD-003',
    name: 'تلميع وتشميع',
    category: 'تلميع وتشميع',
    code: 'PO001',
    barcode: '1234567890003',
    salesCount: 67,
    quantitySold: 67,
    totalSales: 13400.00,
    discountsApplied: 670.00,
    taxes: 2010.00,
    avgSalePrice: 200.00,
    salesPercentage: 19.4,
    topSelling: true
  },
  {
    id: 'PRD-004',
    name: 'تنظيف المقاعد الجلدية',
    category: 'تنظيف المقاعد',
    code: 'SC001',
    barcode: '1234567890004',
    salesCount: 38,
    quantitySold: 38,
    totalSales: 7600.00,
    discountsApplied: 380.00,
    taxes: 1140.00,
    avgSalePrice: 200.00,
    salesPercentage: 11.0,
    topSelling: false
  },
  {
    id: 'PRD-005',
    name: 'معطر المشروب الفاخر',
    category: 'خدمات إضافية',
    code: 'FR001',
    barcode: '1234567890005',
    salesCount: 156,
    quantitySold: 156,
    totalSales: 7800.00,
    discountsApplied: 390.00,
    taxes: 1170.00,
    avgSalePrice: 50.00,
    salesPercentage: 11.3,
    topSelling: false
  },
  {
    id: 'PRD-006',
    name: 'حماية الطلاء الخزفية',
    category: 'خدمات إضافية',
    code: 'CP001',
    barcode: '1234567890006',
    salesCount: 12,
    quantitySold: 12,
    totalSales: 7200.00,
    discountsApplied: 360.00,
    taxes: 1080.00,
    avgSalePrice: 600.00,
    salesPercentage: 10.4,
    topSelling: false
  },
  {
    id: 'PRD-007',
    name: 'تنظيف المحرك',
    category: 'خدمات إضافية',
    code: 'EN001',
    barcode: '1234567890007',
    salesCount: 23,
    quantitySold: 23,
    totalSales: 6900.00,
    discountsApplied: 345.00,
    taxes: 1035.00,
    avgSalePrice: 300.00,
    salesPercentage: 10.0,
    topSelling: false
  }
];

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#EC4899'];

export default function ProductsServicesReport() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [productsData, setProductsData] = useState(mockProductsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('الكل');
  const [periodFilter, setPeriodFilter] = useState('اليوم');
  const [branchFilter, setBranchFilter] = useState('الكل');
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState('totalSales');
  const [sortOrder, setSortOrder] = useState('desc');

  // Calculate totals
  const totals = {
    totalSalesCount: productsData.reduce((sum, prod) => sum + prod.salesCount, 0),
    totalQuantity: productsData.reduce((sum, prod) => sum + prod.quantitySold, 0),
    totalSales: productsData.reduce((sum, prod) => sum + prod.totalSales, 0),
    totalDiscounts: productsData.reduce((sum, prod) => sum + prod.discountsApplied, 0),
    totalTaxes: productsData.reduce((sum, prod) => sum + prod.taxes, 0),
    avgSalePrice: productsData.reduce((sum, prod) => sum + prod.totalSales, 0) / 
                  productsData.reduce((sum, prod) => sum + prod.quantitySold, 0)
  };

  // Filter and sort data
  const filteredData = productsData
    .filter(prod => {
      const matchesSearch = searchTerm === '' || 
        prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prod.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prod.barcode.includes(searchTerm);
      const matchesCategory = categoryFilter === 'الكل' || prod.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
    });

  // Chart data
  const pieChartData = filteredData.slice(0, 8).map(prod => ({
    name: prod.name.substring(0, 15) + '...',
    value: prod.totalSales,
    percentage: prod.salesPercentage
  }));

  const barChartData = filteredData.slice(0, 6).map(prod => ({
    name: prod.name.substring(0, 12) + '...',
    مبيعات: prod.totalSales,
    كمية: prod.quantitySold * 100, // Scale for visibility
    خصومات: prod.discountsApplied
  }));

  // Get unique categories
  const uniqueCategories = [...new Set(productsData.map(prod => prod.category))];

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const exportData = (format) => {
    setIsLoading(true);
    
    setTimeout(() => {
      const exportData = filteredData.map(prod => ({
        'اسم المنتج/الخدمة': prod.name,
        'التصنيف': prod.category,
        'الكود': prod.code,
        'الباركود': prod.barcode,
        'عدد مرات البيع': prod.salesCount,
        'الكمية المباعة': prod.quantitySold,
        'إجمالي المبيعات': `${prod.totalSales.toLocaleString()} جنيه مصري`,
        'الخصومات المطبقة': `${prod.discountsApplied.toLocaleString()} جنيه مصري`,
        'الضرائب': `${prod.taxes.toLocaleString()} جنيه مصري`,
        'متوسط سعر البيع': `${prod.avgSalePrice.toLocaleString()} جنيه مصري`,
        'نسبة المنتج من المبيعات': `${prod.salesPercentage}%`
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
        link.setAttribute('download', `products-services-report-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      setIsLoading(false);
      toast({
        title: "تم التصدير بنجاح",
        description: `تم تصدير تقرير مبيعات المنتجات والخدمات`,
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
            <title>تقرير إجمالي مبيعات المنتجات والخدمات</title>
            <style>
              body { font-family: Arial, sans-serif; direction: rtl; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }
              th { background-color: #f2f2f2; }
              .header { text-align: center; margin-bottom: 20px; }
              .totals { background-color: #f8f9fa; font-weight: bold; }
              .top-selling { background-color: #dcfce7; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>تقرير إجمالي مبيعات المنتجات والخدمات</h1>
              <p>فترة التقرير: ${periodFilter}</p>
              <p>تاريخ التقرير: ${new Date().toLocaleDateString('ar-SA')}</p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>اسم المنتج/الخدمة</th>
                  <th>التصنيف</th>
                  <th>الكود</th>
                  <th>عدد مرات البيع</th>
                  <th>إجمالي المبيعات</th>
                  <th>النسبة</th>
                  <th>متوسط السعر</th>
                </tr>
              </thead>
              <tbody>
                ${filteredData.map(prod => `
                  <tr class="${prod.topSelling ? 'top-selling' : ''}">
                    <td>${prod.name}</td>
                    <td>${prod.category}</td>
                    <td>${prod.code}</td>
                    <td>${prod.salesCount}</td>
                    <td>${prod.totalSales.toLocaleString()} جنيه مصري</td>
                    <td>${prod.salesPercentage}%</td>
                    <td>${prod.avgSalePrice.toLocaleString()} جنيه مصري</td>
                  </tr>
                `).join('')}
                <tr class="totals">
                  <td colspan="3">الإجمالي</td>
                  <td>${totals.totalSalesCount}</td>
                  <td>${totals.totalSales.toLocaleString()} جنيه مصري</td>
                  <td>100%</td>
                  <td>${totals.avgSalePrice.toFixed(2)} جنيه مصري</td>
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
        description: "يتم الآن طباعة تقرير مبيعات المنتجات والخدمات",
      });
    }, 1000);
  };

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setProductsData([...mockProductsData]);
      setIsLoading(false);
      toast({
        title: "تم تحديث البيانات",
        description: "تم تحديث بيانات تقرير مبيعات المنتجات والخدمات",
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">تقرير إجمالي مبيعات المنتجات والخدمات</h1>
            <p className="text-gray-600">تحليل شامل ومفصل لمبيعات كل منتج وخدمة</p>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">إجمالي مرات البيع</p>
                <p className="text-2xl font-bold text-blue-900">{totals.totalSalesCount}</p>
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
                <p className="text-sm font-medium text-purple-600">الكمية المباعة</p>
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
                <p className="text-sm font-medium text-orange-600">إجمالي الخصومات</p>
                <p className="text-2xl font-bold text-orange-900">{totals.totalDiscounts.toLocaleString()}</p>
                <p className="text-xs text-orange-700">جنيه مصري</p>
              </div>
              <Percent className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">إجمالي الضرائب</p>
                <p className="text-2xl font-bold text-red-900">{totals.totalTaxes.toLocaleString()}</p>
                <p className="text-xs text-red-700">جنيه مصري</p>
              </div>
              <Calculator className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-indigo-50 to-indigo-100 border-indigo-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-indigo-600">متوسط سعر البيع</p>
                <p className="text-2xl font-bold text-indigo-900">{totals.avgSalePrice.toFixed(0)}</p>
                <p className="text-xs text-indigo-700">جنيه مصري</p>
              </div>
              <TrendingUp className="w-8 h-8 text-indigo-600" />
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
                placeholder="البحث في المنتجات (اسم، كود، باركود)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="التصنيف" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="الكل">جميع التصنيفات</SelectItem>
                {uniqueCategories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
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
                setCategoryFilter('الكل');
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
              <CardTitle>تفاصيل مبيعات المنتجات والخدمات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead 
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('name')}
                      >
                        <div className="flex items-center gap-2">
                          اسم المنتج/الخدمة
                          {sortBy === 'name' && (
                            sortOrder === 'desc' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead>التصنيف</TableHead>
                      <TableHead>الكود/الباركود</TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('salesCount')}
                      >
                        <div className="flex items-center gap-2">
                          عدد مرات البيع
                          {sortBy === 'salesCount' && (
                            sortOrder === 'desc' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('quantitySold')}
                      >
                        <div className="flex items-center gap-2">
                          الكمية المباعة
                          {sortBy === 'quantitySold' && (
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
                      <TableHead>الخصومات المطبقة</TableHead>
                      <TableHead>الضرائب</TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('avgSalePrice')}
                      >
                        <div className="flex items-center gap-2">
                          متوسط سعر البيع
                          {sortBy === 'avgSalePrice' && (
                            sortOrder === 'desc' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('salesPercentage')}
                      >
                        <div className="flex items-center gap-2">
                          نسبة المنتج
                          {sortBy === 'salesPercentage' && (
                            sortOrder === 'desc' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />
                          )}
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((product) => (
                      <TableRow 
                        key={product.id} 
                        className={cn(
                          "hover:bg-gray-50",
                          product.topSelling && "bg-green-50 border-green-200"
                        )}
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {product.topSelling && (
                              <Star className="w-4 h-4 text-yellow-500" />
                            )}
                            {product.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{product.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm font-mono">{product.code}</div>
                            <div className="text-xs text-gray-500 font-mono">{product.barcode}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center font-semibold">{product.salesCount}</TableCell>
                        <TableCell className="text-center">{product.quantitySold}</TableCell>
                        <TableCell className="font-bold text-green-600">
                          {product.totalSales.toLocaleString()} جنيه مصري
                        </TableCell>
                        <TableCell className="text-orange-600">
                          {product.discountsApplied.toLocaleString()} جنيه مصري
                        </TableCell>
                        <TableCell className="text-blue-600">
                          {product.taxes.toLocaleString()} جنيه مصري
                        </TableCell>
                        <TableCell className="text-purple-600 font-semibold">
                          {product.avgSalePrice.toLocaleString()} جنيه مصري
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${Math.min(product.salesPercentage * 5, 100)}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{product.salesPercentage}%</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    
                    {/* Totals Row */}
                    <TableRow className="bg-blue-50 font-bold border-t-2 border-blue-200">
                      <TableCell colSpan={3}>الإجمالي</TableCell>
                      <TableCell className="text-center">{totals.totalSalesCount}</TableCell>
                      <TableCell className="text-center">{totals.totalQuantity}</TableCell>
                      <TableCell className="text-green-700">
                        {totals.totalSales.toLocaleString()} جنيه مصري
                      </TableCell>
                      <TableCell className="text-orange-700">
                        {totals.totalDiscounts.toLocaleString()} جنيه مصري
                      </TableCell>
                      <TableCell className="text-blue-700">
                        {totals.totalTaxes.toLocaleString()} جنيه مصري
                      </TableCell>
                      <TableCell className="text-purple-700">
                        {totals.avgSalePrice.toFixed(0)} جنيه مصري
                      </TableCell>
                      <TableCell>100%</TableCell>
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
              <CardTitle>توزيع المبيعات حسب المنتجات والخدمات</CardTitle>
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
              <CardTitle>مقارنة المبيعات والكمية والخصومات</CardTitle>
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
                        if (name === 'كمية') return [Math.round(Number(value) / 100), 'الكمية المباعة'];
                        return [`${value.toLocaleString()} جنيه مصري`, name];
                      }}
                    />
                    <Legend />
                    <Bar dataKey="مبيعات" fill="#3B82F6" />
                    <Bar dataKey="كمية" fill="#10B981" />
                    <Bar dataKey="خصومات" fill="#F59E0B" />
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