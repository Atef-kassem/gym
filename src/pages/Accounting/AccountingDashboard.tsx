import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  DollarSign, TrendingUp, TrendingDown, BarChart3, PieChart,
  Calendar, ArrowUp, ArrowDown, Plus, FileText, BookOpen,
  Receipt, CreditCard, Wallet, Building2, Users, Loader2
} from "lucide-react";
import { 
  useGetAllJournalEntriesQuery, 
  useGetAllAccountsQuery
} from "@/services/accountingApi";
import { useGetRevenueStatisticsQuery } from "@/store/revenuesApi";
import { useGetExpenseStatisticsQuery } from "@/store/expensesApi";
import { format } from "date-fns";

const AccountingDashboard = () => {
  const navigate = useNavigate();

  // حساب التواريخ
  const today = new Date();
  const todayStr = format(today, "yyyy-MM-dd");
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startOfMonthStr = format(startOfMonth, "yyyy-MM-dd");
  const endOfMonthStr = format(today, "yyyy-MM-dd");

  // جلب القيود المحاسبية
  const { data: allEntriesData, isLoading: entriesLoading } = useGetAllJournalEntriesQuery({});
  const { data: dailyEntriesData, isLoading: dailyEntriesLoading } = useGetAllJournalEntriesQuery({
    startDate: todayStr,
    endDate: todayStr,
  });
  const { data: monthlyEntriesData, isLoading: monthlyEntriesLoading } = useGetAllJournalEntriesQuery({
    startDate: startOfMonthStr,
    endDate: endOfMonthStr,
  });

  // جلب الحسابات
  const { data: accountsData, isLoading: accountsLoading } = useGetAllAccountsQuery({});

  // لا نحتاج إلى الميزانية التجريبية بعد الآن - سنحسب من الحسابات مباشرة

  // جلب إحصائيات الإيرادات والمصروفات
  const { data: revenueStatsData, isLoading: revenueLoading } = useGetRevenueStatisticsQuery({
    startDate: startOfMonthStr,
    endDate: endOfMonthStr,
  }, {
    skip: !localStorage.getItem("authToken")
  });

  const { data: expenseStatsData, isLoading: expenseLoading } = useGetExpenseStatisticsQuery({
    startDate: startOfMonthStr,
    endDate: endOfMonthStr,
  }, {
    skip: !localStorage.getItem("authToken")
  });

  // حساب الإحصائيات من البيانات الحقيقية
  const stats = useMemo(() => {
    // حساب القيود
    const allEntries = allEntriesData?.data || [];
    const dailyEntries = dailyEntriesData?.data || [];
    const monthlyEntries = monthlyEntriesData?.data || [];

    // حساب عدد الحسابات
    // API يعيد: { success: true, data: tree, flat: [...], count: ... }
    let totalAccounts = 0;
    if (accountsData?.count !== undefined) {
      totalAccounts = accountsData.count;
    } else if (Array.isArray(accountsData?.data?.flat)) {
      totalAccounts = accountsData.data.flat.length;
    } else if (Array.isArray(accountsData?.flat)) {
      totalAccounts = accountsData.flat.length;
    } else if (Array.isArray(accountsData?.data)) {
      // إذا كانت البيانات في شكل شجري، نحتاج إلى حساب جميع الحسابات
      const flattenAccounts = (accounts: any[]): number => {
        let count = 0;
        accounts.forEach((acc: any) => {
          count++;
          if (acc.children && Array.isArray(acc.children)) {
            count += flattenAccounts(acc.children);
          }
        });
        return count;
      };
      totalAccounts = flattenAccounts(accountsData.data);
    }

    // حساب الأصول والخصوم وحقوق الملكية من الحسابات مباشرة
    // نحتاج إلى الحصول على جميع الحسابات المسطحة
    let allAccountsFlat: any[] = [];
    if (Array.isArray(accountsData?.data?.flat)) {
      allAccountsFlat = accountsData.data.flat;
    } else if (Array.isArray(accountsData?.flat)) {
      allAccountsFlat = accountsData.flat;
    } else if (Array.isArray(accountsData?.data)) {
      // إذا كانت البيانات في شكل شجري، نحتاج إلى تسطيحها
      const flattenAccounts = (accounts: any[]): any[] => {
        let result: any[] = [];
        accounts.forEach((acc: any) => {
          result.push(acc);
          if (acc.children && Array.isArray(acc.children)) {
            result = result.concat(flattenAccounts(acc.children));
          }
        });
        return result;
      };
      allAccountsFlat = flattenAccounts(accountsData.data);
    }

    // حساب مجموع الأرصدة حسب النوع
    let totalAssets = 0;
    let totalLiabilities = 0;
    let totalEquity = 0;

    allAccountsFlat.forEach((account: any) => {
      const balance = parseFloat(account.balance || 0);
      if (account.type === "asset") {
        totalAssets += balance;
      } else if (account.type === "liability") {
        totalLiabilities += balance;
      } else if (account.type === "equity") {
        totalEquity += balance;
      }
    });

    // حساب الإيرادات والمصروفات
    const totalRevenue = parseFloat(revenueStatsData?.data?.totalAmount || 0);
    const totalExpenses = parseFloat(expenseStatsData?.data?.totalAmount || 0);
    const netProfit = totalRevenue - totalExpenses;

    return {
      totalEntries: allEntries.length,
      dailyEntries: dailyEntries.length,
      monthlyEntries: monthlyEntries.length,
      totalAccounts,
      totalAssets,
      totalLiabilities,
      totalEquity,
      totalRevenue,
      totalExpenses,
      netProfit,
    };
  }, [
    allEntriesData,
    dailyEntriesData,
    monthlyEntriesData,
    accountsData,
    revenueStatsData,
    expenseStatsData,
  ]);

  const isLoading = entriesLoading || dailyEntriesLoading || monthlyEntriesLoading || 
                   accountsLoading || revenueLoading || expenseLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* العنوان */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">المحاسبة المالية</h1>
            <p className="text-gray-600 mt-1">لوحة تحكم شاملة للمحاسبة المالية</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => navigate("/accounting/journal-entries/create")} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-5 h-5 ml-2" />
              إضافة قيد محاسبي
            </Button>
          </div>
        </div>

        {/* الإحصائيات الرئيسية */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/accounting/journal-entries")}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>إجمالي القيود</span>
                <BookOpen className="w-5 h-5 text-blue-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                </div>
              ) : (
                <>
                  <div className="text-3xl font-bold text-blue-600">{stats.totalEntries.toLocaleString()}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className="bg-green-500">{stats.dailyEntries} يومي</Badge>
                    <Badge className="bg-purple-500">{stats.monthlyEntries} شهري</Badge>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/accounting/chart-of-accounts")}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>إجمالي الأصول</span>
                <Building2 className="w-5 h-5 text-green-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin text-green-500" />
                </div>
              ) : (
                <>
                  <div className="text-3xl font-bold text-green-600">{stats.totalAssets.toLocaleString()}</div>
                  <p className="text-sm text-gray-500 mt-1">جنية مصري</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/accounting/balance-sheet")}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>إجمالي الخصوم</span>
                <CreditCard className="w-5 h-5 text-red-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin text-red-500" />
                </div>
              ) : (
                <>
                  <div className="text-3xl font-bold text-red-600">{stats.totalLiabilities.toLocaleString()}</div>
                  <p className="text-sm text-gray-500 mt-1">جنية مصري</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className={`border-l-4 ${stats.netProfit >= 0 ? 'border-l-emerald-500' : 'border-l-orange-500'} hover:shadow-lg transition-shadow cursor-pointer`} onClick={() => navigate("/accounting/income-statement")}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>صافي الربح</span>
                <DollarSign className="w-5 h-5 text-emerald-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                </div>
              ) : (
                <>
                  <div className={`text-3xl font-bold ${stats.netProfit >= 0 ? 'text-emerald-600' : 'text-orange-600'}`}>
                    {stats.netProfit.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    {stats.netProfit >= 0 ? (
                      <ArrowUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <ArrowDown className="w-4 h-4 text-red-500" />
                    )}
                    <span className="text-sm text-gray-500">جنية مصري</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* بطاقات إضافية */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/accounting/chart-of-accounts")}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>شجرة الحسابات</span>
                <FileText className="w-5 h-5 text-purple-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold text-purple-600">{stats.totalAccounts.toLocaleString()}</div>
                  <p className="text-sm text-gray-500 mt-1">حساب محاسبي</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-cyan-500 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/accounting/income-statement")}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>إجمالي الإيرادات</span>
                <TrendingUp className="w-5 h-5 text-cyan-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin text-cyan-500" />
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold text-cyan-600">{stats.totalRevenue.toLocaleString()}</div>
                  <p className="text-sm text-gray-500 mt-1">جنية مصري</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/accounting/income-statement")}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>إجمالي المصروفات</span>
                <TrendingDown className="w-5 h-5 text-orange-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold text-orange-600">{stats.totalExpenses.toLocaleString()}</div>
                  <p className="text-sm text-gray-500 mt-1">جنية مصري</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* الروابط السريعة */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/accounting/journal-entries")}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                القيود المحاسبية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">إدارة القيود اليومية والشهرية والسنوية</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/accounting/chart-of-accounts")}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                شجرة الحسابات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">إدارة الحسابات المحاسبية وتصنيفها</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/accounting/income-statement")}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-green-600" />
                قائمة الدخل
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">عرض الإيرادات والمصروفات وصافي الربح</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/accounting/balance-sheet")}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <PieChart className="w-5 h-5 text-red-600" />
                الميزانية العمومية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">عرض الأصول والخصوم وحقوق الملكية</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/accounting/cash-flow")}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Wallet className="w-5 h-5 text-cyan-600" />
                التدفق النقدي
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">تتبع التدفقات النقدية الداخلة والخارجة</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/accounting/journal-entries?type=daily")}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-600" />
                القيود اليومية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">إدارة القيود اليومية</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/accounting/journal-entries?type=monthly")}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Receipt className="w-5 h-5 text-pink-600" />
                القيود الشهرية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">إدارة القيود الشهرية</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/accounting/settings")}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-600" />
                إعدادات المحاسبة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">إعدادات النظام المحاسبي</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AccountingDashboard;

