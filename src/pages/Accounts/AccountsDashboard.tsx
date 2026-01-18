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
  Area,
  AreaChart
} from 'recharts';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpDown,
  FileText,
  Users,
  CreditCard,
  Plus,
  Search,
  Download,
  Calendar,
  Eye,
  Edit,
  Trash2,
  Filter,
  Building,
  Banknote,
  Receipt,
  Target,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import accountsData from '@/data/accountsData.json';

const AccountsDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('current_month');

  // إحصائيات من البيانات
  const totalAssets = accountsData.chartOfAccounts.find(acc => acc.id === '1')?.balance || 470000;
  const totalLiabilities = accountsData.chartOfAccounts.find(acc => acc.id === '2')?.balance || 65000;
  const totalEquity = accountsData.chartOfAccounts.find(acc => acc.id === '3')?.balance || 200000;
  const netIncome = accountsData.financialReports.profitAndLoss.netIncome;

  // بيانات الرسوم البيانية
  const cashFlowData = [
    { month: 'يناير', operating: 45000, investing: -15000, financing: 5000 },
    { month: 'فبراير', operating: 52000, investing: -8000, financing: 0 },
    { month: 'مارس', operating: 48000, investing: -12000, financing: 10000 },
    { month: 'أبريل', operating: 55000, investing: -5000, financing: -2000 },
  ];

  const accountsDistribution = [
    { name: 'الأصول المتداولة', value: 270000, color: '#3b82f6' },
    { name: 'الأصول الثابتة', value: 200000, color: '#06b6d4' },
    { name: 'الخصوم المتداولة', value: 65000, color: '#f59e0b' },
    { name: 'حقوق الملكية', value: 405000, color: '#10b981' },
  ];

  const revenueExpenseData = [
    { category: 'إيرادات الخدمات', amount: 125000, type: 'revenue' },
    { category: 'إيرادات المنتجات', amount: 25000, type: 'revenue' },
    { category: 'الرواتب والأجور', amount: 45000, type: 'expense' },
    { category: 'الإيجار', amount: 24000, type: 'expense' },
    { category: 'المرافق العامة', amount: 8000, type: 'expense' },
  ];

  // فلترة شجرة الحسابات
  const filteredAccounts = accountsData.chartOfAccounts.filter(account =>
    account.nameAr.includes(searchTerm) || account.code.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* الج.م */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">إدارة الحسابات</h1>
            <p className="text-gray-600 mt-2">نظام شامل لإدارة الحسابات والأمور المالية</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 ml-2" />
              تصدير التقارير
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 ml-2" />
              قيد جديد
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
                  <p className="text-2xl font-bold text-blue-600">{totalAssets.toLocaleString()} جنيه مصري</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600">+8.2%</span>
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
                  <p className="text-sm font-medium text-gray-600">إجمالي الخصوم</p>
                  <p className="text-2xl font-bold text-orange-600">{totalLiabilities.toLocaleString()} جنيه مصري</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingDown className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-red-600">-3.1%</span>
                  </div>
                </div>
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">حقوق الملكية</p>
                  <p className="text-2xl font-bold text-green-600">{(totalAssets - totalLiabilities).toLocaleString()} جنيه مصري</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600">+12.5%</span>
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
                  <p className="text-sm font-medium text-gray-600">صافي الربح</p>
                  <p className="text-2xl font-bold text-purple-600">{netIncome.toLocaleString()} جنيه مصري</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600">+15.8%</span>
                  </div>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-purple-600" />
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
            <TabsTrigger value="chart-of-accounts" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              شجرة الحسابات
            </TabsTrigger>
            <TabsTrigger value="journal-entries" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              قيود اليومية
            </TabsTrigger>
            <TabsTrigger value="accounts-receivable" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              الذمم المدينة
            </TabsTrigger>
            <TabsTrigger value="accounts-payable" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              الذمم الدائنة
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              التقارير المالية
            </TabsTrigger>
          </TabsList>

          {/* نظرة عامة */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* توزيع الحسابات */}
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">توزيع الحسابات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={accountsDistribution}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {accountsDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value.toLocaleString()} جنيه مصري`, 'القيمة']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* التدفق النقدي */}
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">التدفق النقدي</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={cashFlowData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value.toLocaleString()} جنيه مصري`, '']} />
                        <Bar dataKey="operating" fill="#3b82f6" name="التشغيلي" />
                        <Bar dataKey="investing" fill="#f59e0b" name="الاستثماري" />
                        <Bar dataKey="financing" fill="#10b981" name="التمويلي" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* تحليل الحسابات */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">تحليل الحسابات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueExpenseData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="category" type="category" width={120} />
                      <Tooltip formatter={(value) => [`${value.toLocaleString()} جنيه مصري`, 'المبلغ']} />
                      <Bar dataKey="amount">
                        {revenueExpenseData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.type === 'revenue' ? '#10b981' : '#f59e0b'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* شجرة الحسابات */}
          <TabsContent value="chart-of-accounts" className="space-y-6">
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <CardTitle className="text-lg font-semibold text-gray-900">شجرة الحسابات</CardTitle>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="البحث في الحسابات..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pr-10 w-64"
                      />
                    </div>
                    <Button size="sm">
                      <Plus className="h-4 w-4 ml-2" />
                      حساب جديد
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {filteredAccounts.map((account) => (
                    <div key={account.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge variant={
                            account.accountType === 'asset' ? 'default' :
                            account.accountType === 'liability' ? 'secondary' :
                            account.accountType === 'equity' ? 'outline' :
                            account.accountType === 'revenue' ? 'default' : 'destructive'
                          }>
                            {account.code}
                          </Badge>
                          <div>
                            <h4 className="font-medium text-gray-900">{account.nameAr}</h4>
                            <p className="text-sm text-gray-500">{account.nameEn}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-gray-900">
                            {account.balance?.toLocaleString()} جنيه مصري
                          </span>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      {/* الحسابات الفرعية */}
                      {account.children && account.children.length > 0 && (
                        <div className="mt-4 mr-6 space-y-2">
                          {account.children.map((subAccount) => (
                            <div key={subAccount.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {subAccount.code}
                                </Badge>
                                <span className="text-sm font-medium">{subAccount.nameAr}</span>
                              </div>
                              <span className="text-sm font-semibold">
                                {subAccount.balance?.toLocaleString()} جنيه مصري
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* قيود اليومية */}
          <TabsContent value="journal-entries" className="space-y-6">
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <CardTitle className="text-lg font-semibold text-gray-900">قيود اليومية</CardTitle>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 ml-2" />
                      فلترة
                    </Button>
                    <Button size="sm">
                      <Plus className="h-4 w-4 ml-2" />
                      قيد جديد
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {accountsData.journalEntries.map((entry) => (
                    <div key={entry.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">{entry.id}</Badge>
                          <span className="font-medium text-gray-900">{entry.description}</span>
                          <Badge className={
                            entry.status === 'posted' ? 'bg-green-100 text-green-800' : 
                            'bg-yellow-100 text-yellow-800'
                          }>
                            {entry.status === 'posted' ? 'مُرحل' : 'مسودة'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">{entry.date}</span>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-2">الجانب المدين</h5>
                          {entry.entries.filter(e => e.debit > 0).map((e, index) => (
                            <div key={index} className="flex justify-between py-1">
                              <span className="text-sm text-gray-600">{e.accountName}</span>
                              <span className="text-sm font-medium">{e.debit.toLocaleString()} جنيه مصري</span>
                            </div>
                          ))}
                        </div>
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-2">الجانب الدائن</h5>
                          {entry.entries.filter(e => e.credit > 0).map((e, index) => (
                            <div key={index} className="flex justify-between py-1">
                              <span className="text-sm text-gray-600">{e.accountName}</span>
                              <span className="text-sm font-medium">{e.credit.toLocaleString()} جنيه مصري</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between">
                        <span className="text-sm text-gray-500">المصدر: {entry.source}</span>
                        <span className="text-sm font-semibold">
                          الإجمالي: {entry.totalDebit.toLocaleString()} جنيه مصري
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* الذمم المدينة */}
          <TabsContent value="accounts-receivable" className="space-y-6">
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">الذمم المدينة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {accountsData.customers.map((customer) => (
                    <div key={customer.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{customer.name}</h4>
                          <p className="text-sm text-gray-500">{customer.email}</p>
                          <p className="text-sm text-gray-500">{customer.phone}</p>
                        </div>
                        <div className="text-left">
                          <p className="text-sm text-gray-500">الرصيد الحالي</p>
                          <p className="text-lg font-semibold text-red-600">
                            {customer.currentBalance.toLocaleString()} جنيه مصري
                          </p>
                          <p className="text-sm text-gray-500">
                            الحد الائتماني: {customer.creditLimit.toLocaleString()} جنيه مصري
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* الذمم الدائنة */}
          <TabsContent value="accounts-payable" className="space-y-6">
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">الذمم الدائنة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {accountsData.suppliers.map((supplier) => (
                    <div key={supplier.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{supplier.name}</h4>
                          <p className="text-sm text-gray-500">{supplier.email}</p>
                          <p className="text-sm text-gray-500">{supplier.phone}</p>
                        </div>
                        <div className="text-left">
                          <p className="text-sm text-gray-500">الرصيد المستحق</p>
                          <p className="text-lg font-semibold text-orange-600">
                            {supplier.currentBalance.toLocaleString()} جنيه مصري
                          </p>
                          <p className="text-sm text-gray-500">
                            شروط الدفع: {supplier.paymentTerms}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* التقارير المالية */}
          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">قائمة الدخل</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">الإيرادات</span>
                      <span className="font-semibold text-green-600">
                        {accountsData.financialReports.profitAndLoss.revenue.toLocaleString()} جنيه مصري
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">المصروفات</span>
                      <span className="font-semibold text-red-600">
                        {accountsData.financialReports.profitAndLoss.expenses.toLocaleString()} جنيه مصري
                      </span>
                    </div>
                    <hr />
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900">صافي الربح</span>
                      <span className="font-semibold text-blue-600">
                        {accountsData.financialReports.profitAndLoss.netIncome.toLocaleString()} جنيه مصري
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">الميزانية العمومية</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">إجمالي الأصول</span>
                      <span className="font-semibold text-blue-600">
                        {accountsData.financialReports.balanceSheet.totalAssets.toLocaleString()} جنيه مصري
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">إجمالي الخصوم</span>
                      <span className="font-semibold text-orange-600">
                        {accountsData.financialReports.balanceSheet.totalLiabilities.toLocaleString()} جنيه مصري
                      </span>
                    </div>
                    <hr />
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900">حقوق الملكية</span>
                      <span className="font-semibold text-green-600">
                        {accountsData.financialReports.balanceSheet.totalEquity.toLocaleString()} جنيه مصري
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">ضريبة القيمة المضافة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">ضريبة الإخراج</span>
                      <span className="font-semibold text-green-600">
                        {accountsData.financialReports.vatReport.vatOutput.toLocaleString()} جنيه مصري
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ضريبة الإدخال</span>
                      <span className="font-semibold text-blue-600">
                        {accountsData.financialReports.vatReport.vatInput.toLocaleString()} جنيه مصري
                      </span>
                    </div>
                    <hr />
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900">المستحق</span>
                      <span className="font-semibold text-red-600">
                        {accountsData.financialReports.vatReport.vatDue.toLocaleString()} جنيه مصري
                      </span>
                    </div>
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

export default AccountsDashboard;