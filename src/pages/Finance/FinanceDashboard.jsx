import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  DollarSign, TrendingUp, TrendingDown, BarChart3, PieChart,
  Calendar, ArrowUp, ArrowDown, Plus, FileText
} from "lucide-react";
import { useGetExpenseStatisticsQuery } from "@/store/expensesApi";
import { useGetRevenueStatisticsQuery } from "@/store/revenuesApi";

const FinanceDashboard = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  const { data: expenseStats } = useGetExpenseStatisticsQuery(dateRange, {
    skip: !localStorage.getItem("authToken")
  });

  const { data: revenueStats } = useGetRevenueStatisticsQuery(dateRange, {
    skip: !localStorage.getItem("authToken")
  });

  const expenses = expenseStats?.data || {};
  const revenues = revenueStats?.data || {};

  const totalRevenue = revenues.totalAmount || 0;
  const totalExpense = expenses.totalAmount || 0;
  const netProfit = totalRevenue - totalExpense;
  const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(2) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* الإحصائيات الرئيسية */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">إجمالي الإيرادات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-green-600">
                    {totalRevenue.toLocaleString()} ج.م
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{revenues.totalRevenues || 0} إيراد</p>
                </div>
                <TrendingUp className="w-10 h-10 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">إجمالي المصروفات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-red-600">
                    {totalExpense.toLocaleString()} ج.م
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{expenses.totalExpenses || 0} مصروف</p>
                </div>
                <TrendingDown className="w-10 h-10 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className={`border-l-4 ${netProfit >= 0 ? 'border-l-blue-500' : 'border-l-orange-500'} hover:shadow-lg transition-shadow`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">صافي الربح</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className={`text-3xl font-bold ${netProfit >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                    {netProfit.toLocaleString()} ج.م
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    {netProfit >= 0 ? (
                      <ArrowUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <ArrowDown className="w-4 h-4 text-red-500" />
                    )}
                    <span className="text-sm text-gray-500">{profitMargin}% هامش</span>
                  </div>
                </div>
                <DollarSign className="w-10 h-10 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">نسبة التحصيل</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {totalRevenue > 0 ? ((totalRevenue / (totalRevenue + totalExpense)) * 100).toFixed(1) : 0}%
              </div>
              <p className="text-sm text-gray-500 mt-1">من إجمالي الحركة</p>
            </CardContent>
          </Card>
        </div>

        {/* إجراءات سريعة */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-red-600" />
                المصروفات
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-start gap-3 bg-gradient-to-r from-red-50 to-orange-50 border-red-200 hover:bg-red-100"
                variant="outline"
                onClick={() => navigate("/finance/expenses")}
              >
                <FileText className="w-5 h-5" />
                إدارة المصروفات
              </Button>
              <Button 
                className="w-full justify-start gap-3 bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200 hover:bg-orange-100"
                variant="outline"
                onClick={() => navigate("/finance/expense-reports")}
              >
                <BarChart3 className="w-5 h-5" />
                تقارير المصروفات
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                الإيرادات
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-start gap-3 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 hover:bg-green-100"
                variant="outline"
                onClick={() => navigate("/finance/revenues")}
              >
                <FileText className="w-5 h-5" />
                إدارة الإيرادات
              </Button>
              <Button 
                className="w-full justify-start gap-3 bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 hover:bg-emerald-100"
                variant="outline"
                onClick={() => navigate("/finance/revenue-reports")}
              >
                <BarChart3 className="w-5 h-5" />
                تقارير الإيرادات
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* التحليل المالي */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              توزيع المصروفات حسب الفئة
            </CardTitle>
          </CardHeader>
          <CardContent>
            {expenses.expensesByCategory && expenses.expensesByCategory.length > 0 ? (
              <div className="space-y-3">
                {expenses.expensesByCategory.map((cat, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">{cat.category}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500">{cat.count} مصروف</span>
                      <span className="font-bold text-red-600">{parseFloat(cat.total || 0).toLocaleString()} ج.م</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">لا توجد بيانات</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              توزيع الإيرادات حسب المصدر
            </CardTitle>
          </CardHeader>
          <CardContent>
            {revenues.revenuesBySource && revenues.revenuesBySource.length > 0 ? (
              <div className="space-y-3">
                {revenues.revenuesBySource.map((src, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">{src.source}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500">{src.count} إيراد</span>
                      <span className="font-bold text-green-600">{parseFloat(src.total || 0).toLocaleString()} ج.م</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">لا توجد بيانات</p>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default FinanceDashboard;

