import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BarChart3, PieChart, TrendingDown, Calendar, Download } from "lucide-react";
import { useGetExpenseStatisticsQuery, useGetExpensesQuery } from "@/store/expensesApi";
import { useToast } from "@/hooks/use-toast";

const ExpenseReports = () => {
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  const { data: statsData } = useGetExpenseStatisticsQuery(dateRange, {
    skip: !localStorage.getItem("authToken")
  });
  
  const { data: expensesData } = useGetExpensesQuery({
    ...dateRange,
    limit: 1000
  }, {
    skip: !localStorage.getItem("authToken")
  });

  const stats = statsData?.data || {};
  const expenses = expensesData?.data?.expenses || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/30 to-orange-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-6 h-6" />
              تقارير المصروفات
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

            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-red-600">{(stats.totalAmount || 0).toLocaleString()} ج.م</div>
                  <p className="text-sm text-gray-500">إجمالي المصروفات</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{stats.totalExpenses || 0}</div>
                  <p className="text-sm text-gray-500">عدد المصروفات</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-orange-600">
                    {stats.expensesByCategory ? stats.expensesByCategory.length : 0}
                  </div>
                  <p className="text-sm text-gray-500">فئات مختلفة</p>
                </CardContent>
              </Card>
            </div>

            {/* المصروفات حسب الفئة */}
            <Card>
              <CardHeader>
                <CardTitle>المصروفات حسب الفئة</CardTitle>
              </CardHeader>
              <CardContent>
                {stats.expensesByCategory && stats.expensesByCategory.length > 0 ? (
                  <div className="space-y-2">
                    {stats.expensesByCategory.map((cat, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <span className="font-medium">{cat.category}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-500">{cat.count} مصروف</span>
                          <span className="font-bold">{parseFloat(cat.total || 0).toLocaleString()} ج.م</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">لا توجد بيانات</p>
                )}
              </CardContent>
            </Card>

            {/* المصروفات الشهرية */}
            <Card>
              <CardHeader>
                <CardTitle>المصروفات الشهرية</CardTitle>
              </CardHeader>
              <CardContent>
                {stats.monthlyExpenses && stats.monthlyExpenses.length > 0 ? (
                  <div className="space-y-2">
                    {stats.monthlyExpenses.map((month, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <span className="font-medium">{month.month}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-500">{month.count} مصروف</span>
                          <span className="font-bold">{parseFloat(month.total || 0).toLocaleString()} ج.م</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">لا توجد بيانات</p>
                )}
              </CardContent>
            </Card>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default ExpenseReports;

