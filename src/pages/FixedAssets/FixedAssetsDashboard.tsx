import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import {
  Building,
  Car,
  Monitor,
  Wrench,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Plus,
  Search,
  Download,
  Eye,
  Edit,
  Trash2,
  Filter,
  FileText,
  MapPin,
  Clock,
  Shield,
  Calculator,
  BarChart3
} from 'lucide-react';
import fixedAssetsData from '@/data/fixedAssetsData.json';

const FixedAssetsDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // حساب الإحصائيات
  const totalAssets = fixedAssetsData.fixedAssets.length;
  const totalValue = fixedAssetsData.reports.assetRegister.totalAssets;
  const totalDepreciation = fixedAssetsData.reports.assetRegister.totalDepreciation;
  const netBookValue = fixedAssetsData.reports.assetRegister.netBookValue;

  // بيانات الرسوم البيانية
  const categoryData = fixedAssetsData.reports.assetRegister.byCategory.map(cat => ({
    name: cat.category,
    value: cat.value,
    count: cat.count
  }));

  const depreciationTrend = [
    { year: '2022', depreciation: 18000, netValue: 192000 },
    { year: '2023', depreciation: 22000, netValue: 180000 },
    { year: '2024', depreciation: 24000, netValue: 174000 },
    { year: '2025', depreciation: 26000, netValue: 168000 }
  ];

  const maintenanceData = [
    { month: 'يناير', planned: 800, actual: 750 },
    { month: 'فبراير', planned: 600, actual: 680 },
    { month: 'مارس', planned: 900, actual: 850 },
    { month: 'أبريل', planned: 700, actual: 0 }
  ];

  // فلترة الأصول
  const filteredAssets = fixedAssetsData.fixedAssets.filter(asset => {
    const matchesSearch = asset.nameAr.includes(searchTerm) || asset.code.includes(searchTerm);
    const matchesCategory = selectedCategory === 'all' || asset.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // ألوان الرسوم البيانية
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'retired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'equipment': return <Wrench className="h-5 w-5" />;
      case 'vehicles': return <Car className="h-5 w-5" />;
      case 'technology': return <Monitor className="h-5 w-5" />;
      case 'furniture': return <Building className="h-5 w-5" />;
      default: return <Building className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* الج.م */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">إدارة الأصول الثابتة</h1>
            <p className="text-gray-600 mt-2">نظام شامل لإدارة ومتابعة الأصول الثابتة والاستهلاك</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 ml-2" />
              تصدير التقارير
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 ml-2" />
              أصل جديد
            </Button>
          </div>
        </div>

        {/* المؤشرات الرئيسية */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">إجمالي الأصول</p>
                  <p className="text-2xl font-bold text-blue-600">{totalAssets}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600">+2 هذا الشهر</span>
                  </div>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">القيمة الإجمالية</p>
                  <p className="text-2xl font-bold text-green-600">{totalValue.toLocaleString()} جنيه مصري</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600">+5.2%</span>
                  </div>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">الاستهلاك المتراكم</p>
                  <p className="text-2xl font-bold text-orange-600">{totalDepreciation.toLocaleString()} جنيه مصري</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingDown className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-red-600">+8.5%</span>
                  </div>
                </div>
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Calculator className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">القيمة الدفترية</p>
                  <p className="text-2xl font-bold text-purple-600">{netBookValue.toLocaleString()} جنيه مصري</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600">+3.1%</span>
                  </div>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* التبويبات الرئيسية */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white border border-gray-200 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              نظرة عامة
            </TabsTrigger>
            <TabsTrigger value="assets" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              سجل الأصول
            </TabsTrigger>
            <TabsTrigger value="depreciation" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              الاستهلاك
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              الصيانة
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              التقارير
            </TabsTrigger>
          </TabsList>

          {/* نظرة عامة */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* توزيع الأصول حسب الفئة */}
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">توزيع الأصول حسب الفئة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value.toLocaleString()} جنيه مصري`, 'القيمة']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* اتجاه الاستهلاك */}
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">اتجاه الاستهلاك والقيمة الدفترية</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={depreciationTrend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value.toLocaleString()} جنيه مصري`, '']} />
                        <Area 
                          type="monotone" 
                          dataKey="netValue" 
                          stackId="1" 
                          stroke="#3b82f6" 
                          fill="#3b82f6" 
                          fillOpacity={0.6}
                          name="القيمة الدفترية"
                        />
                        <Area 
                          type="monotone" 
                          dataKey="depreciation" 
                          stackId="2" 
                          stroke="#f59e0b" 
                          fill="#f59e0b" 
                          fillOpacity={0.6}
                          name="الاستهلاك المتراكم"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* تكاليف الصيانة */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">تكاليف الصيانة المخططة مقابل الفعلية</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={maintenanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value.toLocaleString()} جنيه مصري`, '']} />
                      <Bar dataKey="planned" fill="#3b82f6" name="المخطط" />
                      <Bar dataKey="actual" fill="#10b981" name="الفعلي" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* سجل الأصول */}
          <TabsContent value="assets" className="space-y-6">
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <CardTitle className="text-lg font-semibold text-gray-900">سجل الأصول الثابتة</CardTitle>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="البحث في الأصول..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pr-10 w-64"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 ml-2" />
                      فلترة
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredAssets.map((asset) => (
                    <div key={asset.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            {getCategoryIcon(asset.category)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-gray-900">{asset.nameAr}</h4>
                              <Badge variant="outline">{asset.code}</Badge>
                              <Badge className={getStatusColor(asset.status)}>
                                {asset.status === 'active' ? 'نشط' : 
                                 asset.status === 'maintenance' ? 'تحت الصيانة' : 'متقاعد'}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500">{asset.nameEn}</p>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-sm text-gray-500">
                                <MapPin className="h-4 w-4 inline ml-1" />
                                {asset.location}
                              </span>
                              <span className="text-sm text-gray-500">
                                <Calendar className="h-4 w-4 inline ml-1" />
                                {asset.purchaseDate}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-left">
                          <p className="text-lg font-semibold text-gray-900">
                            {asset.currentValue.toLocaleString()} جنيه مصري
                          </p>
                          <p className="text-sm text-gray-500">
                            القيمة الأصلية: {asset.purchasePrice.toLocaleString()} جنيه مصري
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Wrench className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* الاستهلاك */}
          <TabsContent value="depreciation" className="space-y-6">
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">حسابات الاستهلاك</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {fixedAssetsData.depreciationCalculations.map((calc, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">الأصل</p>
                          <p className="font-medium">{calc.assetId}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">السنة</p>
                          <p className="font-medium">{calc.year}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">القيمة الافتتاحية</p>
                          <p className="font-medium">{calc.openingValue.toLocaleString()} جنيه مصري</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">الاستهلاك</p>
                          <p className="font-medium text-red-600">{calc.depreciationAmount.toLocaleString()} جنيه مصري</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">القيمة الختامية</p>
                          <p className="font-medium text-blue-600">{calc.closingValue.toLocaleString()} جنيه مصري</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* الصيانة */}
          <TabsContent value="maintenance" className="space-y-6">
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">جدول الصيانة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {fixedAssetsData.maintenanceSchedule.map((maintenance, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-gray-900">{maintenance.description}</h4>
                            <Badge className={
                              maintenance.status === 'completed' ? 'bg-green-100 text-green-800' :
                              maintenance.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }>
                              {maintenance.status === 'completed' ? 'مكتمل' :
                               maintenance.status === 'scheduled' ? 'مجدول' : 'قيد التنفيذ'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500">الأصل: {maintenance.assetId}</p>
                          <p className="text-sm text-gray-500">
                            المسؤول: {maintenance.assignedTechnician || maintenance.technician}
                          </p>
                        </div>
                        <div className="text-left">
                          <p className="text-sm text-gray-500">
                            {maintenance.scheduledDate ? `المجدول: ${maintenance.scheduledDate}` : 
                             `المكتمل: ${maintenance.completedDate}`}
                          </p>
                          <p className="font-semibold text-gray-900">
                            {(maintenance.estimatedCost || maintenance.actualCost)?.toLocaleString()} جنيه مصري
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* التقارير */}
          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">سجل الأصول</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">إجمالي الأصول</span>
                      <span className="font-semibold">{totalAssets}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">القيمة الإجمالية</span>
                      <span className="font-semibold text-blue-600">
                        {totalValue.toLocaleString()} جنيه مصري
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">الاستهلاك المتراكم</span>
                      <span className="font-semibold text-red-600">
                        {totalDepreciation.toLocaleString()} جنيه مصري
                      </span>
                    </div>
                    <hr />
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900">القيمة الدفترية</span>
                      <span className="font-semibold text-green-600">
                        {netBookValue.toLocaleString()} جنيه مصري
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">تكاليف الصيانة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">السنة الحالية</span>
                      <span className="font-semibold text-orange-600">
                        {fixedAssetsData.reports.maintenanceCosts.currentYear.toLocaleString()} جنيه مصري
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">السنة السابقة</span>
                      <span className="font-semibold text-gray-600">
                        {fixedAssetsData.reports.maintenanceCosts.previousYear.toLocaleString()} جنيه مصري
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">المخطط</span>
                      <span className="font-semibold text-blue-600">
                        {fixedAssetsData.reports.maintenanceCosts.planned.toLocaleString()} جنيه مصري
                      </span>
                    </div>
                    <hr />
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900">الانحراف</span>
                      <span className="font-semibold text-green-600">
                        {(fixedAssetsData.reports.maintenanceCosts.planned - 
                          fixedAssetsData.reports.maintenanceCosts.actual).toLocaleString()} جنيه مصري
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">إجراءات سريعة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full justify-start" variant="outline">
                      <FileText className="h-4 w-4 ml-2" />
                      تصديج.مجل الأصول
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Calculator className="h-4 w-4 ml-2" />
                      تقرير الاستهلاك
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Wrench className="h-4 w-4 ml-2" />
                      جدول الصيانة
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <BarChart3 className="h-4 w-4 ml-2" />
                      تحليل الأداء
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FixedAssetsDashboard;