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
  Target, 
  TrendingUp, 
  TrendingDown, 
  Package, 
  Percent, 
  Download, 
  Printer,
  Search,
  ArrowRight,
  Star,
  AlertTriangle,
  BarChart3
} from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

// Mock data for category profitability
const categoryProfitability = [
  {
    id: 1,
    categoryName: '   الكافية',
    subcategories: ['  أساسي', '  متقدم', '  بالبخار'],
    totalSales: 15600,
    totalCost: 9360,
    grossProfit: 6240,
    profitMargin: 40.0,
    itemsSold: 156,
    avgSellingPrice: 100,
    avgCost: 60,
    profitPerItem: 40,
    performance: 'excellent',
    trend: 'up'
  },
  {
    id: 2,
    categoryName: 'تشميع  الكافية',
    subcategories: ['تشميع عادي', 'تشميع متقدم', 'تشميع سيراميك'],
    totalSales: 12800,
    totalCost: 8960,
    grossProfit: 3840,
    profitMargin: 30.0,
    itemsSold: 64,
    avgSellingPrice: 200,
    avgCost: 140,
    profitPerItem: 60,
    performance: 'good',
    trend: 'up'
  },
  {
    id: 3,
    categoryName: 'تنظيف داخلي',
    subcategories: ['تنظيف أساسي', 'تنظيف شامل', 'تعقيم متقدم'],
    totalSales: 8900,
    totalCost: 6230,
    grossProfit: 2670,
    profitMargin: 30.0,
    itemsSold: 89,
    avgSellingPrice: 100,
    avgCost: 70,
    profitPerItem: 30,
    performance: 'good',
    trend: 'stable'
  },
  {
    id: 4,
    categoryName: 'إصلاح الإطارات',
    subcategories: ['ترقيع', 'توازن', 'محاذاة'],
    totalSales: 5400,
    totalCost: 4320,
    grossProfit: 1080,
    profitMargin: 20.0,
    itemsSold: 54,
    avgSellingPrice: 100,
    avgCost: 80,
    profitPerItem: 20,
    performance: 'average',
    trend: 'down'
  },
  {
    id: 5,
    categoryName: 'تغيير الزيت',
    subcategories: ['زيت عادي', 'زيت مصنع', 'زيت سينثيتك'],
    totalSales: 7200,
    totalCost: 6120,
    grossProfit: 1080,
    profitMargin: 15.0,
    itemsSold: 72,
    avgSellingPrice: 100,
    avgCost: 85,
    profitPerItem: 15,
    performance: 'poor',
    trend: 'down'
  },
  {
    id: 6,
    categoryName: 'خدمات إضافية',
    subcategories: ['معطرات', 'حماية طلاء', 'تنظيف محرك'],
    totalSales: 3600,
    totalCost: 2520,
    grossProfit: 1080,
    profitMargin: 30.0,
    itemsSold: 36,
    avgSellingPrice: 100,
    avgCost: 70,
    profitPerItem: 30,
    performance: 'good',
    trend: 'up'
  }
];

const monthlyTrends = [
  { month: 'يناير', profit: 14210 },
  { month: 'فبراير', profit: 15680 },
  { month: 'مارس', profit: 16890 },
  { month: 'أبريل', profit: 15200 },
  { month: 'مايو', profit: 17450 },
  { month: 'يونيو', profit: 16820 }
];

const profitDistribution = [
  { name: '   الكافية', value: 39.1, profit: 6240 },
  { name: 'تشميع  الكافية', value: 24.1, profit: 3840 },
  { name: 'تنظيف داخلي', value: 16.7, profit: 2670 },
  { name: 'إصلاح الإطارات', value: 6.8, profit: 1080 },
  { name: 'تغيير الزيت', value: 6.8, profit: 1080 },
  { name: 'خدمات إضافية', value: 6.8, profit: 1080 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function CategoriesProfitabilityReport() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPerformance, setSelectedPerformance] = useState('all');
  const [sortBy, setSortBy] = useState('profitMargin');

  const filteredCategories = categoryProfitability
    .filter(category => {
      const matchesSearch = category.categoryName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPerformance = selectedPerformance === 'all' || category.performance === selectedPerformance;
      return matchesSearch && matchesPerformance;
    })
    .sort((a, b) => {
      if (sortBy === 'profitMargin') return b.profitMargin - a.profitMargin;
      if (sortBy === 'totalSales') return b.totalSales - a.totalSales;
      if (sortBy === 'grossProfit') return b.grossProfit - a.grossProfit;
      return 0;
    });

  const totalMetrics = {
    totalSales: categoryProfitability.reduce((sum, cat) => sum + cat.totalSales, 0),
    totalCost: categoryProfitability.reduce((sum, cat) => sum + cat.totalCost, 0),
    totalProfit: categoryProfitability.reduce((sum, cat) => sum + cat.grossProfit, 0),
    avgMargin: categoryProfitability.reduce((sum, cat) => sum + cat.profitMargin, 0) / categoryProfitability.length
  };

  const getPerformanceBadge = (performance: string) => {
    switch (performance) {
      case 'excellent':
        return <Badge className="bg-green-100 text-green-800">ممتاز</Badge>;
      case 'good':
        return <Badge className="bg-blue-100 text-blue-800">جيد</Badge>;
      case 'average':
        return <Badge className="bg-yellow-100 text-yellow-800">متوسط</Badge>;
      case 'poor':
        return <Badge className="bg-red-100 text-red-800">ضعيف</Badge>;
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
        return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  const exportToCSV = () => {
    const headers = ['التصنيف', 'إجمالي المبيعات', 'التكلفة', 'إجمالي الربح', 'هامش الربح', 'عدد   المباعة', 'متوسط سعر البيع', 'الأداء'];
    const csvContent = [
      headers.join(','),
      ...filteredCategories.map(cat => [
        cat.categoryName,
        cat.totalSales,
        cat.totalCost,
        cat.grossProfit,
        cat.profitMargin + '%',
        cat.itemsSold,
        cat.avgSellingPrice,
        cat.performance
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'categories_profitability_report.csv';
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
            <h1 className="text-3xl font-bold text-gray-900">تقرير ربحية التصنيفات</h1>
            <p className="text-gray-600 mt-2">تحليل هامش الربح حسب كل تصنيف رئيسي وفرعي</p>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="البحث في التصنيفات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={selectedPerformance} onValueChange={setSelectedPerformance}>
              <SelectTrigger>
                <SelectValue placeholder="مستوى الأداء" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المستويات</SelectItem>
                <SelectItem value="excellent">ممتاز</SelectItem>
                <SelectItem value="good">جيد</SelectItem>
                <SelectItem value="average">متوسط</SelectItem>
                <SelectItem value="poor">ضعيف</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="ترتيب حسب" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="profitMargin">هامش الربح</SelectItem>
                <SelectItem value="totalSales">إجمالي المبيعات</SelectItem>
                <SelectItem value="grossProfit">إجمالي الربح</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setSelectedPerformance('all');
              setSortBy('profitMargin');
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
              <Target className="w-8 h-8 text-green-600" />
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
              <Percent className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">عدد التصنيفات</p>
                <p className="text-2xl font-bold text-orange-900">{categoryProfitability.length}</p>
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
              <PieChart className="w-5 h-5" />
              توزيع الأرباح حسب التصنيف
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              اتجاه الأرباح الشهرية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} جنيه`, 'الربح']} />
                <Line type="monotone" dataKey="profit" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Categories Profitability Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            جدول ربحية التصنيفات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>التصنيف</TableHead>
                  <TableHead>التصنيفات الفرعية</TableHead>
                  <TableHead>إجمالي المبيعات</TableHead>
                  <TableHead>التكلفة</TableHead>
                  <TableHead>إجمالي الربح</TableHead>
                  <TableHead>هامش الربح</TableHead>
                  <TableHead>عدد  </TableHead>
                  <TableHead>متوسط سعر البيع</TableHead>
                  <TableHead>الربح لكل   </TableHead>
                  <TableHead>الأداء</TableHead>
                  <TableHead>الاتجاه</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-semibold">
                      {category.categoryName}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {category.subcategories.slice(0, 2).map((sub, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {sub}
                          </Badge>
                        ))}
                        {category.subcategories.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{category.subcategories.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {category.totalSales.toLocaleString()} جنيه
                    </TableCell>
                    <TableCell className="text-red-600">
                      {category.totalCost.toLocaleString()} جنيه
                    </TableCell>
                    <TableCell className="text-green-600 font-semibold">
                      {category.grossProfit.toLocaleString()} جنيه
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={category.profitMargin} className="w-16 h-2" />
                        <span className="text-sm font-medium">{category.profitMargin}%</span>
                      </div>
                    </TableCell>
                    <TableCell>{category.itemsSold}</TableCell>
                    <TableCell>{category.avgSellingPrice} جنيه</TableCell>
                    <TableCell className="text-green-600 font-semibold">
                      {category.profitPerItem} جنيه
                    </TableCell>
                    <TableCell>
                      {getPerformanceBadge(category.performance)}
                    </TableCell>
                    <TableCell>
                      {getTrendIcon(category.trend)}
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
              <Star className="w-5 h-5 text-yellow-500" />
              أفضل تصنيف ربحاً
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-2">
              <Badge className="bg-green-100 text-green-800 text-lg px-4 py-2">
                {categoryProfitability[0].categoryName}
              </Badge>
              <p className="text-2xl font-bold text-green-600">
                {categoryProfitability[0].grossProfit.toLocaleString()} جنيه
              </p>
              <p className="text-sm text-gray-600">
                هامش الربح: {categoryProfitability[0].profitMargin}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              أعلى هامش ربح
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-2">
              <Badge className="bg-blue-100 text-blue-800 text-lg px-4 py-2">
                {categoryProfitability[0].categoryName}
              </Badge>
              <p className="text-2xl font-bold text-blue-600">
                {categoryProfitability[0].profitMargin}%
              </p>
              <p className="text-sm text-gray-600">
                ربح: {categoryProfitability[0].grossProfit.toLocaleString()} جنيه
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
                {categoryProfitability[4].categoryName}
              </Badge>
              <p className="text-2xl font-bold text-red-600">
                {categoryProfitability[4].profitMargin}%
              </p>
              <p className="text-sm text-gray-600">
                ربح: {categoryProfitability[4].grossProfit.toLocaleString()} جنيه
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}