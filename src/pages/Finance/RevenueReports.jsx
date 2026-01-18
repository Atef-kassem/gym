import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BarChart3, TrendingUp, Users } from "lucide-react";
import { useGetRevenueStatisticsQuery, useGetTopCustomersQuery } from "@/store/revenuesApi";

const RevenueReports = () => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  const { data: statsData } = useGetRevenueStatisticsQuery(dateRange, {
    skip: !localStorage.getItem("authToken")
  });
  
  const { data: topCustomersData } = useGetTopCustomersQuery({
    ...dateRange,
    limit: 10
  }, {
    skip: !localStorage.getItem("authToken")
  });

  const stats = statsData?.data || {};
  const topCustomers = topCustomersData?.data || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/30 to-emerald-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-6 h-6" />
              تقارير الإيرادات
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

            <div className="grid grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-green-600">{(stats.totalAmount || 0).toLocaleString()} ج.م</div>
                  <p className="text-sm text-gray-500">إجمالي الإيرادات</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{stats.totalRevenues || 0}</div>
                  <p className="text-sm text-gray-500">عدد الإيرادات</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-blue-600">{(stats.totalTax || 0).toLocaleString()} ج.م</div>
                  <p className="text-sm text-gray-500">الضرائب</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-orange-600">{(stats.totalDiscount || 0).toLocaleString()} ج.م</div>
                  <p className="text-sm text-gray-500">الخصومات</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>الإيرادات حسب المصدر</CardTitle>
              </CardHeader>
              <CardContent>
                {stats.revenuesBySource && stats.revenuesBySource.length > 0 ? (
                  <div className="space-y-2">
                    {stats.revenuesBySource.map((src, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
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

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  أفضل العملاء
                </CardTitle>
              </CardHeader>
              <CardContent>
                {topCustomers && topCustomers.length > 0 ? (
                  <div className="space-y-2">
                    {topCustomers.map((customer, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded">
                        <div>
                          <p className="font-semibold">{customer.customerName || 'غير محدد'}</p>
                          <p className="text-sm text-gray-500">{customer.count} معاملة</p>
                        </div>
                        <div className="text-lg font-bold text-green-600">
                          {parseFloat(customer.total || 0).toLocaleString()} ج.م
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
                <CardTitle>الإيرادات الشهرية</CardTitle>
              </CardHeader>
              <CardContent>
                {stats.monthlyRevenues && stats.monthlyRevenues.length > 0 ? (
                  <div className="space-y-2">
                    {stats.monthlyRevenues.map((month, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <span className="font-medium">{month.month}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-500">{month.count} إيراد</span>
                          <span className="font-bold text-green-600">{parseFloat(month.total || 0).toLocaleString()} ج.م</span>
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

export default RevenueReports;

