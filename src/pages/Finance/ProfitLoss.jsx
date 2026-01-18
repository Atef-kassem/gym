import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, TrendingUp, TrendingDown } from "lucide-react";
import { useGetExpenseStatisticsQuery } from "@/store/expensesApi";
import { useGetRevenueStatisticsQuery } from "@/store/revenuesApi";

const ProfitLoss = () => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
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
  const grossProfit = totalRevenue - totalExpense;
  const profitMargin = totalRevenue > 0 ? ((grossProfit / totalRevenue) * 100).toFixed(2) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-6 h-6" />
              قائمة الأرباح والخسائر
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>من تاريخ</Label>
                <Input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div>
                <Label>إلى تاريخ</Label>
                <Input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-gray-700">الإيرادات</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">{totalRevenue.toLocaleString()} ج.م</span>
                </div>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-red-600" />
                    <span className="font-semibold text-gray-700">المصروفات</span>
                  </div>
                  <span className="text-2xl font-bold text-red-600">({totalExpense.toLocaleString()}) ج.م</span>
                </div>
              </div>

              <div className="h-px bg-gray-300"></div>

              <div className={`${grossProfit >= 0 ? 'bg-blue-50' : 'bg-orange-50'} p-6 rounded-lg`}>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xl text-gray-800">صافي الربح/الخسارة</span>
                    <p className="text-sm text-gray-500 mt-1">هامش الربح: {profitMargin}%</p>
                  </div>
                  <span className={`text-4xl font-bold ${grossProfit >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                    {grossProfit.toLocaleString()} ج.م
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfitLoss;

