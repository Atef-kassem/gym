import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BarChart3, TrendingUp, TrendingDown, DollarSign, PieChart } from "lucide-react";
import { useGetExpenseStatisticsQuery } from "@/store/expensesApi";
import { useGetRevenueStatisticsQuery } from "@/store/revenuesApi";

const FinancialAnalysis = () => {
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
  const netProfit = totalRevenue - totalExpense;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-6 h-6" />
              التحليل المالي
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

            <div className="grid grid-cols-3 gap-6">
              <Card className="border-l-4 border-l-green-500">
                <CardContent className="pt-6">
                  <TrendingUp className="w-8 h-8 text-green-600 mb-2" />
                  <div className="text-3xl font-bold text-green-600">{totalRevenue.toLocaleString()} ج.م</div>
                  <p className="text-sm text-gray-500">إجمالي الإيرادات</p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-red-500">
                <CardContent className="pt-6">
                  <TrendingDown className="w-8 h-8 text-red-600 mb-2" />
                  <div className="text-3xl font-bold text-red-600">{totalExpense.toLocaleString()} ج.م</div>
                  <p className="text-sm text-gray-500">إجمالي المصروفات</p>
                </CardContent>
              </Card>
              <Card className={`border-l-4 ${netProfit >= 0 ? 'border-l-blue-500' : 'border-l-orange-500'}`}>
                <CardContent className="pt-6">
                  <DollarSign className={`w-8 h-8 mb-2 ${netProfit >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
                  <div className={`text-3xl font-bold ${netProfit >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                    {netProfit.toLocaleString()} ج.م
                  </div>
                  <p className="text-sm text-gray-500">صافي الربح/الخسارة</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinancialAnalysis;

