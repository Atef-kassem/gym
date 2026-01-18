import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  BarChart, Download, Calendar, TrendingUp, TrendingDown,
  DollarSign, FileText, Filter, RefreshCw
} from "lucide-react";
import { useGetRevenueStatisticsQuery } from "@/store/revenuesApi";
import { useGetExpenseStatisticsQuery } from "@/store/expensesApi";
import { useGetRevenuesQuery } from "@/store/revenuesApi";
import { useGetExpensesQuery } from "@/store/expensesApi";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const FinancialReports = () => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  // جلب الإحصائيات
  const { data: revenueStatsData, isLoading: revenueStatsLoading, refetch: refetchRevenueStats } = useGetRevenueStatisticsQuery(dateRange, {
    skip: !localStorage.getItem("authToken")
  });

  const { data: expenseStatsData, isLoading: expenseStatsLoading, refetch: refetchExpenseStats } = useGetExpenseStatisticsQuery(dateRange, {
    skip: !localStorage.getItem("authToken")
  });

  // جلب البيانات التفصيلية
  const { data: revenuesData, isLoading: revenuesLoading } = useGetRevenuesQuery({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  }, {
    skip: !localStorage.getItem("authToken")
  });

  const { data: expensesData, isLoading: expensesLoading } = useGetExpensesQuery({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  }, {
    skip: !localStorage.getItem("authToken")
  });

  const revenueStats = revenueStatsData?.data || {};
  const expenseStats = expenseStatsData?.data || {};
  const revenues = Array.isArray(revenuesData?.data) ? revenuesData.data : (Array.isArray(revenuesData) ? revenuesData : []);
  const expenses = Array.isArray(expensesData?.data) ? expensesData.data : (Array.isArray(expensesData) ? expensesData : []);

  // حساب الإحصائيات
  const totalRevenue = parseFloat(revenueStats.totalAmount || 0);
  const totalExpense = parseFloat(expenseStats.totalAmount || 0);
  const netProfit = totalRevenue - totalExpense;
  const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : 0;

  // حساب الإيرادات الشهرية للمخطط
  const monthlyRevenueData = useMemo(() => {
    const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    const data: { [key: string]: { month: string; revenue: number; expense: number } } = {};

    if (Array.isArray(revenues)) {
      revenues.forEach((revenue: any) => {
        if (revenue.date) {
          const date = new Date(revenue.date);
          const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
          if (!data[monthKey]) {
            data[monthKey] = {
              month: months[date.getMonth()],
              revenue: 0,
              expense: 0
            };
          }
          data[monthKey].revenue += parseFloat(revenue.amount || 0);
        }
      });
    }

    if (Array.isArray(expenses)) {
      expenses.forEach((expense: any) => {
        if (expense.date) {
          const date = new Date(expense.date);
          const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
          if (!data[monthKey]) {
            data[monthKey] = {
              month: months[date.getMonth()],
              revenue: 0,
              expense: 0
            };
          }
          data[monthKey].expense += parseFloat(expense.amount || 0);
        }
      });
    }

    return Object.values(data).slice(-6); // آخر 6 أشهر
  }, [revenues, expenses]);

  // بيانات الإيرادات حسب المصدر
  const revenueBySourceData = useMemo(() => {
    if (!revenueStats.revenuesBySource || !Array.isArray(revenueStats.revenuesBySource)) return [];
    return revenueStats.revenuesBySource.map((src: any) => ({
      name: src.source || 'غير محدد',
      value: parseFloat(src.total || 0),
      count: src.count || 0
    }));
  }, [revenueStats]);

  // بيانات المصروفات حسب الفئة
  const expenseByCategoryData = useMemo(() => {
    if (!expenseStats.expensesByCategory || !Array.isArray(expenseStats.expensesByCategory)) return [];
    return expenseStats.expensesByCategory.map((cat: any) => ({
      name: cat.category || 'غير محدد',
      value: parseFloat(cat.total || 0),
      count: cat.count || 0
    }));
  }, [expenseStats]);

  // بيانات قائمة الدخل
  const incomeStatementData = [
    { name: 'الإيرادات', value: totalRevenue, color: '#10b981' },
    { name: 'المصروفات', value: totalExpense, color: '#ef4444' },
    { name: 'صافي الربح', value: netProfit, color: netProfit >= 0 ? '#3b82f6' : '#f59e0b' },
  ];

  const COLORS = ['#10b981', '#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'];

  const handleFilter = () => {
    refetchRevenueStats();
    refetchExpenseStats();
  };

  const isLoading = revenueStatsLoading || expenseStatsLoading || revenuesLoading || expensesLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* العنوان */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">التقارير المالية</h1>
            <p className="text-gray-600 mt-1">تقارير الإيرادات والمصروفات</p>
          </div>
          <div className="flex gap-3">
            <div className="flex gap-2">
              <Input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
                className="w-40"
              />
              <Input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
                className="w-40"
              />
            </div>
            <Button variant="outline" onClick={handleFilter}>
              <Filter className="w-5 h-5 ml-2" />
              تصفية
            </Button>
            <Button variant="outline" onClick={() => { refetchRevenueStats(); refetchExpenseStats(); }}>
              <RefreshCw className="w-5 h-5 ml-2" />
              تحديث
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">جاري تحميل البيانات...</p>
          </div>
        ) : (
          <>
            {/* إحصائيات */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">إجمالي الإيرادات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{totalRevenue.toLocaleString('ar-SA')} جم</div>
                  <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    {revenueStats.totalRevenues || 0} إيراد
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-red-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">إجمالي المصروفات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600">{totalExpense.toLocaleString('ar-SA')} جم</div>
                  <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                    <TrendingDown className="w-4 h-4 text-red-500" />
                    {expenseStats.totalExpenses || 0} مصروف
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">صافي الربح</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-3xl font-bold ${netProfit >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                    {netProfit.toLocaleString('ar-SA')} جم
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {netProfit >= 0 ? 'ربح' : 'خسارة'}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">هامش الربح</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">{profitMargin}%</div>
                  <p className="text-sm text-gray-500 mt-1">نسبة الربحية</p>
                </CardContent>
              </Card>
            </div>

            {/* مخططات */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>الإيرادات والمصروفات الشهرية</CardTitle>
                </CardHeader>
                <CardContent>
                  {monthlyRevenueData.length > 0 ? (
                    <ChartContainer config={{}}>
                      <ResponsiveContainer width="100%" height={300}>
                        <RechartsBarChart data={monthlyRevenueData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Legend />
                          <Bar dataKey="revenue" fill="#10b981" name="الإيرادات" />
                          <Bar dataKey="expense" fill="#ef4444" name="المصروفات" />
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <BarChart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>لا توجد بيانات للعرض</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>قائمة الدخل</CardTitle>
                </CardHeader>
                <CardContent>
                  {incomeStatementData.length > 0 ? (
                    <ChartContainer config={{}}>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={incomeStatementData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value }) => `${name}: ${value.toLocaleString('ar-SA')} جم`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {incomeStatementData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <DollarSign className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>لا توجد بيانات للعرض</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* التقارير التفصيلية */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* تقرير الإيرادات */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    تقرير الإيرادات
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                      <span className="font-medium">إجمالي الإيرادات</span>
                      <Badge variant="outline" className="text-green-600 font-bold">
                        {totalRevenue.toLocaleString('ar-SA')} جم
                      </Badge>
                    </div>
                    {revenueBySourceData.length > 0 ? (
                      <>
                        <div className="space-y-2">
                          {revenueBySourceData.map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <span className="text-sm">{item.name}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">{item.count} إيراد</span>
                                <span className="font-medium text-green-600">{item.value.toLocaleString('ar-SA')} جم</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        {revenueStats.totalTax > 0 && (
                          <div className="flex justify-between items-center p-2 border-t">
                            <span className="text-sm text-gray-600">الضرائب</span>
                            <span className="font-medium">{parseFloat(revenueStats.totalTax || 0).toLocaleString('ar-SA')} جم</span>
                          </div>
                        )}
                        {revenueStats.totalDiscount > 0 && (
                          <div className="flex justify-between items-center p-2 border-t">
                            <span className="text-sm text-gray-600">الخصومات</span>
                            <span className="font-medium">{parseFloat(revenueStats.totalDiscount || 0).toLocaleString('ar-SA')} جم</span>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-center text-gray-500 py-4">لا توجد بيانات إيرادات</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* تقرير المصروفات */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-red-600" />
                    تقرير المصروفات
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                      <span className="font-medium">إجمالي المصروفات</span>
                      <Badge variant="outline" className="text-red-600 font-bold">
                        {totalExpense.toLocaleString('ar-SA')} جم
                      </Badge>
                    </div>
                    {expenseByCategoryData.length > 0 ? (
                      <div className="space-y-2">
                        {expenseByCategoryData.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm">{item.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">{item.count} مصروف</span>
                              <span className="font-medium text-red-600">{item.value.toLocaleString('ar-SA')} جم</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-4">لا توجد بيانات مصروفات</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* قائمة الدخل */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="w-5 h-5 text-blue-600" />
                  قائمة الدخل
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-4 bg-green-50 rounded">
                    <span className="font-semibold text-lg">الإيرادات</span>
                    <span className="font-bold text-green-600 text-lg">{totalRevenue.toLocaleString('ar-SA')} جم</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-red-50 rounded">
                    <span className="font-semibold text-lg">المصروفات</span>
                    <span className="font-bold text-red-600 text-lg">{totalExpense.toLocaleString('ar-SA')} جم</span>
                  </div>
                  <div className={`flex justify-between items-center p-4 rounded ${netProfit >= 0 ? 'bg-blue-50' : 'bg-orange-50'}`}>
                    <span className="font-semibold text-lg">صافي الربح / الخسارة</span>
                    <span className={`font-bold text-lg ${netProfit >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                      {netProfit.toLocaleString('ar-SA')} جم
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-purple-50 rounded">
                    <span className="font-semibold text-lg">هامش الربح</span>
                    <span className="font-bold text-purple-600 text-lg">{profitMargin}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* جدول الإيرادات التفصيلي */}
            {Array.isArray(revenues) && revenues.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    قائمة الإيرادات التفصيلية
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-right p-2">التاريخ</th>
                          <th className="text-right p-2">المصدر</th>
                          <th className="text-right p-2">الوصف</th>
                          <th className="text-right p-2">المبلغ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {revenues.slice(0, 10).map((revenue: any) => (
                          <tr key={revenue.id} className="border-b hover:bg-gray-50">
                            <td className="p-2">{new Date(revenue.date || revenue.createdAt).toLocaleDateString('ar-SA')}</td>
                            <td className="p-2">{revenue.source || 'غير محدد'}</td>
                            <td className="p-2">{revenue.description || '-'}</td>
                            <td className="p-2 font-medium text-green-600">{parseFloat(revenue.amount || 0).toLocaleString('ar-SA')} جم</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {revenues.length > 10 && (
                      <p className="text-center text-sm text-gray-500 mt-4">
                        عرض 10 من {revenues.length} إيراد
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* جدول المصروفات التفصيلي */}
            {Array.isArray(expenses) && expenses.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    قائمة المصروفات التفصيلية
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-right p-2">التاريخ</th>
                          <th className="text-right p-2">الفئة</th>
                          <th className="text-right p-2">الوصف</th>
                          <th className="text-right p-2">المبلغ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {expenses.slice(0, 10).map((expense: any) => (
                          <tr key={expense.id} className="border-b hover:bg-gray-50">
                            <td className="p-2">{new Date(expense.date || expense.createdAt).toLocaleDateString('ar-SA')}</td>
                            <td className="p-2">{expense.category || 'غير محدد'}</td>
                            <td className="p-2">{expense.description || '-'}</td>
                            <td className="p-2 font-medium text-red-600">{parseFloat(expense.amount || 0).toLocaleString('ar-SA')} جم</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {expenses.length > 10 && (
                      <p className="text-center text-sm text-gray-500 mt-4">
                        عرض 10 من {expenses.length} مصروف
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FinancialReports;
