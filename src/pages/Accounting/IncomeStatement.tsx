import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { CalendarIcon, Download, TrendingUp, TrendingDown, DollarSign, Loader2 } from "lucide-react";
import { useGetTrialBalanceQuery } from "@/services/accountingApi";
import { useGetExpensesQuery } from "@/store/expensesApi";
import { useGetAllSubscriptionsQuery } from "@/services/subscriptionsApi";

const IncomeStatement = () => {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(new Date().getFullYear(), 0, 1));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());

  // تحويل التواريخ إلى صيغة API
  const startDateStr = startDate ? format(startDate, "yyyy-MM-dd") : undefined;
  const endDateStr = endDate ? format(endDate, "yyyy-MM-dd") : undefined;

  // جلب الميزانية التجريبية للفترة المحددة
  const { data: trialBalanceData, isLoading: trialBalanceLoading } = useGetTrialBalanceQuery({
    startDate: startDateStr,
    endDate: endDateStr,
  });

  // جلب المصروفات من نظام المصروفات
  const { data: expensesData, isLoading: expensesLoading } = useGetExpensesQuery({
    startDate: startDateStr,
    endDate: endDateStr,
    limit: 1000,
  }, {
    skip: !localStorage.getItem("authToken")
  });

  // جلب الإيرادات من الاشتراكات (العادية والخاصة)
  const { data: subscriptionsData, isLoading: subscriptionsLoading } = useGetAllSubscriptionsQuery({}, {
    skip: !localStorage.getItem("authToken")
  });

  const isLoading = trialBalanceLoading || expensesLoading || subscriptionsLoading;

  // حساب الإيرادات والمصروفات من جميع المصادر
  const data = useMemo(() => {
    const trialBalance = trialBalanceData?.data || [];
    const expenses = expensesData?.data?.expenses || [];
    const subscriptions = subscriptionsData?.data || [];
    
    // الإيرادات من الميزانية التجريبية (حسابات revenue)
    const trialRevenues = trialBalance
      .filter((item: any) => item.type === "revenue" && (item.credit > 0 || item.debit > 0))
      .map((item: any) => ({
        name: item.name,
        amount: parseFloat(item.credit || 0),
        source: "محاسبة",
      }))
      .filter((item: any) => item.amount > 0);

    // الإيرادات من الاشتراكات (العادية والخاصة)
    const allSubscriptions = Array.isArray(subscriptions) 
      ? subscriptions 
      : Array.isArray(subscriptionsData?.data) 
        ? subscriptionsData.data 
        : [];
    
    const subscriptionRevenues = allSubscriptions
      .filter((sub: any) => {
        // فلترة حسب تاريخ بداية الاشتراك
        if (!sub.subscriptionStartDate) return false;
        try {
          const subDate = new Date(sub.subscriptionStartDate);
          if (isNaN(subDate.getTime())) return false;
          
          const start = startDateStr ? new Date(startDateStr) : new Date(0);
          const end = endDateStr ? new Date(endDateStr) : new Date();
          
          // تعيين الوقت إلى منتصف الليل للمقارنة الصحيحة
          subDate.setHours(0, 0, 0, 0);
          start.setHours(0, 0, 0, 0);
          end.setHours(23, 59, 59, 999);
          
          return subDate >= start && subDate <= end;
        } catch {
          return false;
        }
      })
      .map((sub: any) => {
        // استخدام الحقول الصحيحة: subscriptionValue أو paidAmount أو totalAmount
        const amount = parseFloat(
          sub.subscriptionValue || 
          sub.paidAmount || 
          sub.totalAmount || 
          sub.price || 
          0
        );
        
        const memberName = sub.customerName || 
                          sub.memberName || 
                          sub.member?.arabicName || 
                          sub.member?.name || 
                          "غير محدد";
        
        const subscriptionType = sub.isSpecial ? "خاص" : "عادي";
        
        return {
          name: `اشتراك ${subscriptionType} - ${memberName}`,
          amount: amount,
          source: "اشتراكات",
        };
      })
      .filter((item: any) => item.amount > 0);

    // دمج الإيرادات وتجميعها
    // تجميع إيرادات الاشتراكات حسب النوع
    const subscriptionRevenuesByType = new Map<string, number>();
    subscriptionRevenues.forEach((item: any) => {
      const type = item.name.includes("خاص") ? "اشتراكات خاصة" : "اشتراكات عادية";
      const existing = subscriptionRevenuesByType.get(type) || 0;
      subscriptionRevenuesByType.set(type, existing + item.amount);
    });

    // إضافة إيرادات الاشتراكات المجمعة
    const aggregatedSubscriptionRevenues = Array.from(subscriptionRevenuesByType.entries()).map(([name, amount]) => ({
      name,
      amount,
      source: "اشتراكات",
    }));

    // دمج جميع الإيرادات
    const revenuesMap = new Map<string, { name: string; amount: number; source: string }>();
    
    // إضافة إيرادات الميزانية التجريبية
    trialRevenues.forEach((item: any) => {
      const existing = revenuesMap.get(item.name);
      if (existing) {
        existing.amount += item.amount;
      } else {
        revenuesMap.set(item.name, { ...item });
      }
    });

    // إضافة إيرادات الاشتراكات المجمعة
    aggregatedSubscriptionRevenues.forEach((item: any) => {
      const existing = revenuesMap.get(item.name);
      if (existing) {
        existing.amount += item.amount;
      } else {
        revenuesMap.set(item.name, { ...item });
      }
    });

    const revenues = Array.from(revenuesMap.values());

    // المصروفات من الميزانية التجريبية (حسابات expense)
    const trialExpenses = trialBalance
      .filter((item: any) => item.type === "expense" && (item.debit > 0 || item.credit > 0))
      .map((item: any) => ({
        name: item.name,
        amount: parseFloat(item.debit || 0),
        source: "محاسبة",
      }))
      .filter((item: any) => item.amount > 0);

    // المصروفات من نظام المصروفات
    const systemExpenses = expenses
      .filter((exp: any) => {
        if (!exp.expenseDate) return false;
        const expDate = new Date(exp.expenseDate);
        const start = startDateStr ? new Date(startDateStr) : new Date(0);
        const end = endDateStr ? new Date(endDateStr) : new Date();
        return expDate >= start && expDate <= end;
      })
      .map((exp: any) => ({
        name: `${exp.category || "مصروف"} - ${exp.vendor || exp.description || "غير محدد"}`,
        amount: parseFloat(exp.totalAmount || exp.amount || 0),
        source: "نظام المصروفات",
      }))
      .filter((item: any) => item.amount > 0);

    // دمج المصروفات وتجميعها حسب الفئة
    const expensesMap = new Map<string, { name: string; amount: number; source: string }>();
    
    [...trialExpenses, ...systemExpenses].forEach((item: any) => {
      // استخراج الفئة من الاسم
      const category = item.name.split(" - ")[0];
      const existing = expensesMap.get(category);
      if (existing) {
        existing.amount += item.amount;
      } else {
        expensesMap.set(category, { name: category, amount: item.amount, source: item.source });
      }
    });

    const expensesList = Array.from(expensesMap.values());

    return { revenues, expenses: expensesList };
  }, [trialBalanceData, expensesData, subscriptionsData, startDateStr, endDateStr]);

  const totalRevenue = data.revenues.reduce((sum: number, item: { name: string; amount: number }) => sum + item.amount, 0);
  const totalExpenses = data.expenses.reduce((sum: number, item: { name: string; amount: number }) => sum + item.amount, 0);
  
  // البحث عن تكلفة البضاعة المباعة (عادة تكون أول مصروف أو مصروف باسم معين)
  const costOfGoodsSold = data.expenses.find((e: { name: string; amount: number }) => 
    e.name.includes("تكلفة") || e.name.includes("بضاعة") || e.name.includes("مباعة")
  )?.amount || 0;
  
  const grossProfit = totalRevenue - costOfGoodsSold;
  const netIncome = totalRevenue - totalExpenses;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">قائمة الدخل</h1>
            <p className="text-gray-600 mt-1">عرض الإيرادات والمصروفات وصافي الربح</p>
          </div>
          <div className="flex gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-[200px] justify-start text-right font-normal", !startDate && "text-muted-foreground")}>
                  <CalendarIcon className="ml-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP", { locale: ar }) : <span>من تاريخ</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={startDate} onSelect={setStartDate} locale={ar} />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-[200px] justify-start text-right font-normal", !endDate && "text-muted-foreground")}>
                  <CalendarIcon className="ml-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP", { locale: ar }) : <span>إلى تاريخ</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={endDate} onSelect={setEndDate} locale={ar} />
              </PopoverContent>
            </Popover>
            <Button>
              <Download className="w-4 h-4 ml-2" />
              تصدير
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>قائمة الدخل</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : (
              <div className="space-y-6">
                {/* الإيرادات */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    الإيرادات
                  </h3>
                  <div className="space-y-2">
                    {data.revenues.length > 0 ? (
                      <>
                        {data.revenues.map((item: { name: string; amount: number }, index: number) => (
                          <div key={index} className="flex justify-between items-center py-2 border-b">
                            <span>{item.name}</span>
                            <span className="font-semibold">{item.amount.toLocaleString()} ج.م</span>
                          </div>
                        ))}
                        <div className="flex justify-between items-center py-2 font-bold text-lg border-t-2 mt-2">
                          <span>إجمالي الإيرادات</span>
                          <span className="text-green-600">{totalRevenue.toLocaleString()} ج.م</span>
                        </div>
                      </>
                    ) : (
                      <div className="text-center text-gray-500 py-4">لا توجد إيرادات في الفترة المحددة</div>
                    )}
                  </div>
                </div>

                {/* المصروفات */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-red-600" />
                    المصروفات
                  </h3>
                  <div className="space-y-2">
                    {data.expenses.length > 0 ? (
                      <>
                        {data.expenses.map((item: { name: string; amount: number }, index: number) => (
                          <div key={index} className="flex justify-between items-center py-2 border-b">
                            <span>{item.name}</span>
                            <span className="font-semibold">{item.amount.toLocaleString()} ج.م</span>
                          </div>
                        ))}
                        <div className="flex justify-between items-center py-2 font-bold text-lg border-t-2 mt-2">
                          <span>إجمالي المصروفات</span>
                          <span className="text-red-600">{totalExpenses.toLocaleString()} ج.م</span>
                        </div>
                      </>
                    ) : (
                      <div className="text-center text-gray-500 py-4">لا توجد مصروفات في الفترة المحددة</div>
                    )}
                  </div>
                </div>

                {/* صافي الدخل */}
                <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold flex items-center gap-2">
                      <DollarSign className="w-6 h-6" />
                      صافي الدخل
                    </span>
                    <span className={`text-2xl font-bold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {netIncome.toLocaleString()} ج.م
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IncomeStatement;

