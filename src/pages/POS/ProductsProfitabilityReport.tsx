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
  Calculator, 
  Package, 
  Star, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Download, 
  Printer,
  Search,
  ArrowRight,
  Crown,
  AlertTriangle,
  BarChart3,
  Target
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, ScatterChart, Scatter } from 'recharts';

// Mock data for product profitability
const productProfitability = [
  {
    id: 1,
    name: '  مشروب صغيرة',
    category: '   الكافية',
    barcode: 'CAR001',
    salesCount: 85,
    totalSales: 4250,
    totalCost: 2550,
    grossProfit: 1700,
    profitMargin: 40.0,
    avgSellingPrice: 50,
    avgCost: 30,
    profitPerUnit: 20,
    rank: 1,
    performance: 'top',
    trend: 'up'
  },
  {
    id: 2,
    name: 'تشميع سيراميك',
    category: 'تشميع  الكافية',
    barcode: 'WAX001',
    salesCount: 24,
    totalSales: 7200,
    totalCost: 4320,
    grossProfit: 2880,
    profitMargin: 40.0,
    avgSellingPrice: 300,
    avgCost: 180,
    profitPerUnit: 120,
    rank: 2,
    performance: 'top',
    trend: 'up'
  },
  {
    id: 3,
    name: '  متقدم',
    category: '   الكافية',
    barcode: 'CAR002',
    salesCount: 45,
    totalSales: 5400,
    totalCost: 3240,
    grossProfit: 2160,
    profitMargin: 40.0,
    avgSellingPrice: 120,
    avgCost: 72,
    profitPerUnit: 48,
    rank: 3,
    performance: 'high',
    trend: 'up'
  },
  {
    id: 4,
    name: 'تنظيف داخلي شامل',
    category: 'تنظيف داخلي',
    barcode: 'INT001',
    salesCount: 38,
    totalSales: 4560,
    totalCost: 3192,
    grossProfit: 1368,
    profitMargin: 30.0,
    avgSellingPrice: 120,
    avgCost: 84,
    profitPerUnit: 36,
    rank: 4,
    performance: 'high',
    trend: 'stable'
  },
  {
    id: 5,
    name: 'تشميع عادي',
    category: 'تشميع  الكافية',
    barcode: 'WAX002',
    salesCount: 32,
    totalSales: 4800,
    totalCost: 3360,
    grossProfit: 1440,
    profitMargin: 30.0,
    avgSellingPrice: 150,
    avgCost: 105,
    profitPerUnit: 45,
    rank: 5,
    performance: 'medium',
    trend: 'stable'
  },
  {
    id: 6,
    name: 'إصلاح إطار',
    category: 'إصلاح الإطارات',
    barcode: 'TIRE001',
    salesCount: 28,
    totalSales: 2800,
    totalCost: 2240,
    grossProfit: 560,
    profitMargin: 20.0,
    avgSellingPrice: 100,
    avgCost: 80,
    profitPerUnit: 20,
    rank: 6,
    performance: 'medium',
    trend: 'down'
  },
  {
    id: 7,
    name: 'تغيير زيت محرك',
    category: 'تغيير الزيت',
    barcode: 'OIL001',
    salesCount: 55,
    totalSales: 5500,
    totalCost: 4675,
    grossProfit: 825,
    profitMargin: 15.0,
    avgSellingPrice: 100,
    avgCost: 85,
    profitPerUnit: 15,
    rank: 7,
    performance: 'low',
    trend: 'down'
  },
  {
    id: 8,
    name: 'معطر مشروب',
    category: 'خدمات إضافية',
    barcode: 'ACC001',
    salesCount: 67,
    totalSales: 2010,
    totalCost: 1407,
    grossProfit: 603,
    profitMargin: 30.0,
    avgSellingPrice: 30,
    avgCost: 21,
    profitPerUnit: 9,
    rank: 8,
    performance: 'medium',
    trend: 'up'
  }
];

const profitabilityTrends = [
  { name: 'يناير', topPerformers: 3500, mediumPerformers: 2800, lowPerformers: 1200 },
  { name: 'فبراير', topPerformers: 3800, mediumPerformers: 3100, lowPerformers: 1100 },
  { name: 'مارس', topPerformers: 4200, mediumPerformers: 3300, lowPerformers: 1000 },
  { name: 'أبريل', topPerformers: 3900, mediumPerformers: 3000, lowPerformers: 1150 },
  { name: 'مايو', topPerformers: 4500, mediumPerformers: 3400, lowPerformers: 950 },
  { name: 'يونيو', topPerformers: 4800, mediumPerformers: 3600, lowPerformers: 900 }
];

const scatterData = productProfitability.map(product => ({
  name: product.name,
  salesVolume: product.salesCount,
  profitMargin: product.profitMargin,
  profit: product.grossProfit
}));

export default function ProductsProfitabilityReport() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPerformance, setSelectedPerformance] = useState('all');
  const [sortBy, setSortBy] = useState('rank');

  const filteredProducts = productProfitability
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.barcode.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesPerformance = selectedPerformance === 'all' || product.performance === selectedPerformance;
      return matchesSearch && matchesCategory && matchesPerformance;
    })
    .sort((a, b) => {
      if (sortBy === 'rank') return a.rank - b.rank;
      if (sortBy === 'profitMargin') return b.profitMargin - a.profitMargin;
      if (sortBy === 'totalSales') return b.totalSales - a.totalSales;
      if (sortBy === 'grossProfit') return b.grossProfit - a.grossProfit;
      return 0;
    });

  const totalMetrics = {
    totalSales: productProfitability.reduce((sum, prod) => sum + prod.totalSales, 0),
    totalCost: productProfitability.reduce((sum, prod) => sum + prod.totalCost, 0),
    totalProfit: productProfitability.reduce((sum, prod) => sum + prod.grossProfit, 0),
    avgMargin: productProfitability.reduce((sum, prod) => sum + prod.profitMargin, 0) / productProfitability.length
  };

  const getPerformanceBadge = (performance: string) => {
    switch (performance) {
      case 'top':
        return <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
          <Crown className="w-3 h-3" />
          الأفضل
        </Badge>;
      case 'high':
        return <Badge className="bg-blue-100 text-blue-800">مرتفع</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">متوسط</Badge>;
      case 'low':
        return <Badge className="bg-red-100 text-red-800">منخفض</Badge>;
      default:
        return <Badge variant="outline">غير محدد</Badge>;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank <= 3) {
      return <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
        <Star className="w-3 h-3" />
        #{rank}
      </Badge>;
    }
    return <Badge variant="outline">#{rank}</Badge>;
  };

  const exportToCSV = () => {
    const headers = ['المنتج/الخدمة', 'التصنيف', 'الباركود', 'عدد المبيعات', 'إجمالي المبيعات', 'التكلفة', 'إجمالي الربح', 'هامش الربح', 'الترتيب'];
    const csvContent = [
      headers.join(','),
      ...filteredProducts.map(prod => [
        prod.name,
        prod.category,
        prod.barcode,
        prod.salesCount,
        prod.totalSales,
        prod.totalCost,
        prod.grossProfit,
        prod.profitMargin + '%',
        prod.rank
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'products_profitability_report.csv';
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
            <h1 className="text-3xl font-bold text-gray-900">تقرير ربحية المنتجات والخدمات</h1>
            <p className="text-gray-600 mt-2">قياس ربحية كل منتج وخدمة لتحديد الأفضل والأضعف</p>
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
            فلاتر البحث والترتيب
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Input
              placeholder="البحث في المنتجات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="اختر التصنيف" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع التصنيفات</SelectItem>
                <SelectItem value="   الكافية">   الكافية</SelectItem>
                <SelectItem value="تشميع  الكافية">تشميع  الكافية</SelectItem>
                <SelectItem value="تنظيف داخلي">تنظيف داخلي</SelectItem>
                <SelectItem value="إصلاح الإطارات">إصلاح الإطارات</SelectItem>
                <SelectItem value="تغيير الزيت">تغيير الزيت</SelectItem>
                <SelectItem value="خدمات إضافية">خدمات إضافية</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedPerformance} onValueChange={setSelectedPerformance}>
              <SelectTrigger>
                <SelectValue placeholder="مستوى الأداء" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المستويات</SelectItem>
                <SelectItem value="top">الأفضل</SelectItem>
                <SelectItem value="high">مرتفع</SelectItem>
                <SelectItem value="medium">متوسط</SelectItem>
                <SelectItem value="low">منخفض</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="ترتيب حسب" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rank">الترتيب</SelectItem>
                <SelectItem value="profitMargin">هامش الربح</SelectItem>
                <SelectItem value="totalSales">إجمالي المبيعات</SelectItem>
                <SelectItem value="grossProfit">إجمالي الربح</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedPerformance('all');
              setSortBy('rank');
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
                <p className="text-2xl font-bold text-green-900">{totalMetrics.totalProfit.toLocaleString()} جنيه</p>
              </div>
              <Calculator className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">إجمالي المبيعات</p>
                <p className="text-2xl font-bold text-blue-900">{totalMetrics.totalSales.toLocaleString()} جنيه</p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">متوسط هامش الربح</p>
                <p className="text-2xl font-bold text-purple-900">{totalMetrics.avgMargin.toFixed(1)}%</p>
              </div>
              <Target className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">عدد المنتجات</p>
                <p className="text-2xl font-bold text-orange-900">{productProfitability.length}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-orange-600" />
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
              اتجاه أداء المنتجات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={profitabilityTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="topPerformers" name="الأفضل أداءً" fill="#22c55e" />
                <Bar dataKey="mediumPerformers" name="متوسط الأداء" fill="#3b82f6" />
                <Bar dataKey="lowPerformers" name="ضعيف الأداء" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              مصفوفة حجم المبيعات مقابل هامش الربح
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart data={scatterData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="salesVolume" name="حجم المبيعات" />
                <YAxis dataKey="profitMargin" name="هامش الربح %" />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'profitMargin' ? `${value}%` : value,
                    name === 'profitMargin' ? 'هامش الربح' : 'حجم المبيعات'
                  ]}
                  labelFormatter={(label) => `المنتج: ${label}`}
                />
                <Scatter dataKey="profitMargin" fill="#8884d8" />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Products Profitability Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            جدول ربحية المنتجات والخدمات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الترتيب</TableHead>
                  <TableHead>المنتج/الخدمة</TableHead>
                  <TableHead>التصنيف</TableHead>
                  <TableHead>الباركود</TableHead>
                  <TableHead>عدد المبيعات</TableHead>
                  <TableHead>إجمالي المبيعات</TableHead>
                  <TableHead>التكلفة</TableHead>
                  <TableHead>إجمالي الربح</TableHead>
                  <TableHead>هامش الربح</TableHead>
                  <TableHead>الربح/الوحدة</TableHead>
                  <TableHead>الأداء</TableHead>
                  <TableHead>الاتجاه</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      {getRankBadge(product.rank)}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {product.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {product.barcode}
                      </code>
                    </TableCell>
                    <TableCell>{product.salesCount}</TableCell>
                    <TableCell className="font-semibold">
                      {product.totalSales.toLocaleString()} جنيه
                    </TableCell>
                    <TableCell className="text-red-600">
                      {product.totalCost.toLocaleString()} جنيه
                    </TableCell>
                    <TableCell className="text-green-600 font-semibold">
                      {product.grossProfit.toLocaleString()} جنيه
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={product.profitMargin} className="w-16 h-2" />
                        <span className="text-sm font-medium">{product.profitMargin}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-green-600 font-semibold">
                      {product.profitPerUnit} جنيه
                    </TableCell>
                    <TableCell>
                      {getPerformanceBadge(product.performance)}
                    </TableCell>
                    <TableCell>
                      {getTrendIcon(product.trend)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Performance Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <Crown className="w-5 h-5 text-yellow-500" />
              أفضل منتج ربحاً
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-2">
              <Badge className="bg-green-100 text-green-800 text-lg px-4 py-2">
                {productProfitability[1].name}
              </Badge>
              <p className="text-2xl font-bold text-green-600">
                {productProfitability[1].grossProfit.toLocaleString()} جنيه
              </p>
              <p className="text-sm text-gray-600">
                هامش الربح: {productProfitability[1].profitMargin}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              أعلى مبيعات
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-2">
              <Badge className="bg-blue-100 text-blue-800 text-lg px-4 py-2">
                {productProfitability[6].name}
              </Badge>
              <p className="text-2xl font-bold text-blue-600">
                {productProfitability[6].salesCount} مبيعة
              </p>
              <p className="text-sm text-gray-600">
                قيمة: {productProfitability[6].totalSales.toLocaleString()} جنيه
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              يحتاج تحسين
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-2">
              <Badge className="bg-red-100 text-red-800 text-lg px-4 py-2">
                {productProfitability[6].name}
              </Badge>
              <p className="text-2xl font-bold text-red-600">
                {productProfitability[6].profitMargin}%
              </p>
              <p className="text-sm text-gray-600">
                ربح: {productProfitability[6].grossProfit.toLocaleString()} جنيه
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}