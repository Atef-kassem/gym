import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { CalendarIcon, Download, ArrowDown, ArrowUp, Wallet, Loader2 } from "lucide-react";
import { useGetTrialBalanceQuery, useGetAllJournalEntriesQuery } from "@/services/accountingApi";
import { useGetExpensesQuery } from "@/store/expensesApi";
import { useGetAllSubscriptionsQuery } from "@/services/subscriptionsApi";

const CashFlow = () => {
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

  // جلب القيود المحاسبية للفترة المحددة
  const { data: journalEntriesData, isLoading: journalEntriesLoading } = useGetAllJournalEntriesQuery({
    startDate: startDateStr,
    endDate: endDateStr,
    status: "posted",
  });

  // جلب المصروفات النقدية
  const { data: expensesData, isLoading: expensesLoading } = useGetExpensesQuery({
    startDate: startDateStr,
    endDate: endDateStr,
    paymentStatus: "مدفوع",
    limit: 1000,
  }, {
    skip: !localStorage.getItem("authToken")
  });

  // جلب الإيرادات من الاشتراكات
  const { data: subscriptionsData, isLoading: subscriptionsLoading } = useGetAllSubscriptionsQuery({}, {
    skip: !localStorage.getItem("authToken")
  });

  const isLoading = trialBalanceLoading || journalEntriesLoading || expensesLoading || subscriptionsLoading;

  // حساب التدفق النقدي من البيانات الحقيقية
  const data = useMemo(() => {
    const trialBalance = trialBalanceData?.data || [];
    const journalEntries = journalEntriesData?.data || [];
    const expenses = expensesData?.data?.expenses || [];
    const subscriptions = Array.isArray(subscriptionsData?.data) 
      ? subscriptionsData.data 
      : Array.isArray(subscriptionsData) 
        ? subscriptionsData 
        : [];

    // ===== الأنشطة التشغيلية =====
    
    // التدفقات الداخلة: الإيرادات من الاشتراكات (المدفوعة)
    const subscriptionRevenues = subscriptions
      .filter((sub: any) => {
        if (!sub.subscriptionStartDate) return false;
        try {
          const subDate = new Date(sub.subscriptionStartDate);
          if (isNaN(subDate.getTime())) return false;
          const start = startDateStr ? new Date(startDateStr) : new Date(0);
          const end = endDateStr ? new Date(endDateStr) : new Date();
          subDate.setHours(0, 0, 0, 0);
          start.setHours(0, 0, 0, 0);
          end.setHours(23, 59, 59, 999);
          return subDate >= start && subDate <= end;
        } catch {
          return false;
        }
      })
      .map((sub: any) => ({
        name: `إيرادات اشتراك ${sub.isSpecial ? "خاص" : "عادي"}`,
        amount: parseFloat(sub.paidAmount || sub.subscriptionValue || 0),
      }))
      .filter((item: any) => item.amount > 0);

    // تجميع إيرادات الاشتراكات
    const subscriptionRevenuesMap = new Map<string, number>();
    subscriptionRevenues.forEach((item: any) => {
      const key = item.name;
      subscriptionRevenuesMap.set(key, (subscriptionRevenuesMap.get(key) || 0) + item.amount);
    });

    const operatingInflows = Array.from(subscriptionRevenuesMap.entries()).map(([name, amount]) => ({
      name,
      amount,
    }));

    // التدفقات الخارجة: المصروفات النقدية
    const cashExpenses = expenses
      .filter((exp: any) => {
        if (!exp.expenseDate) return false;
        try {
          const expDate = new Date(exp.expenseDate);
          if (isNaN(expDate.getTime())) return false;
          const start = startDateStr ? new Date(startDateStr) : new Date(0);
          const end = endDateStr ? new Date(endDateStr) : new Date();
          expDate.setHours(0, 0, 0, 0);
          start.setHours(0, 0, 0, 0);
          end.setHours(23, 59, 59, 999);
          return expDate >= start && expDate <= end;
        } catch {
          return false;
        }
      })
      .map((exp: any) => ({
        name: `${exp.category || "مصروف"} - ${exp.vendor || exp.description || "غير محدد"}`,
        amount: parseFloat(exp.totalAmount || exp.amount || 0),
      }))
      .filter((item: any) => item.amount > 0);

    // تجميع المصروفات حسب الفئة
    const expensesMap = new Map<string, number>();
    cashExpenses.forEach((item: any) => {
      const category = item.name.split(" - ")[0];
      expensesMap.set(category, (expensesMap.get(category) || 0) + item.amount);
    });

    const operatingOutflows = Array.from(expensesMap.entries()).map(([name, amount]) => ({
      name,
      amount,
    }));

    // ===== الأنشطة الاستثمارية =====
    
    // التدفقات الداخلة: بيع الأصول (من القيود المحاسبية)
    const assetSales: { name: string; amount: number }[] = [];
    // يمكن إضافة منطق لبيع الأصول من القيود المحاسبية لاحقاً

    // التدفقات الخارجة: شراء الأصول (من القيود المحاسبية)
    const assetPurchases: { name: string; amount: number }[] = [];
    // يمكن إضافة منطق لشراء الأصول من القيود المحاسبية لاحقاً

    // ===== الأنشطة التمويلية =====
    
    // التدفقات الداخلة: القروض (من الخصوم)
    const loans: { name: string; amount: number }[] = [];
    const loanAccounts = trialBalance.filter((item: any) => {
      const name = (item.name || "").toLowerCase();
      return item.type === "liability" && (
        name.includes("قرض") || 
        name.includes("loan") ||
        name.includes("تمويل")
      );
    });
    
    loanAccounts.forEach((item: any) => {
      const amount = parseFloat(item.credit || 0);
      if (amount > 0) {
        loans.push({
          name: item.name,
          amount: amount,
        });
      }
    });

    // التدفقات الخارجة: سداد القروض (من القيود المحاسبية)
    const loanPayments: { name: string; amount: number }[] = [];
    // يمكن إضافة منطق لسداد القروض من القيود المحاسبية لاحقاً

    return {
      operating: {
        inflows: operatingInflows,
        outflows: operatingOutflows,
      },
      investing: {
        inflows: assetSales.length > 0 ? assetSales : [{ name: "بيع الأصول", amount: 0 }],
        outflows: assetPurchases.length > 0 ? assetPurchases : [{ name: "شراء الأصول", amount: 0 }],
      },
      financing: {
        inflows: loans.length > 0 ? loans : [{ name: "القروض", amount: 0 }],
        outflows: loanPayments.length > 0 ? loanPayments : [{ name: "سداد القروض", amount: 0 }],
      },
    };
  }, [trialBalanceData, journalEntriesData, expensesData, subscriptionsData, startDateStr, endDateStr]);

  const calcSectionTotal = (section: { inflows: { name: string; amount: number }[]; outflows: { name: string; amount: number }[] }) => {
    const inflows = section.inflows.reduce((sum: number, item: { name: string; amount: number }) => sum + item.amount, 0);
    const outflows = section.outflows.reduce((sum: number, item: { name: string; amount: number }) => sum + item.amount, 0);
    return { inflows, outflows, net: inflows - outflows };
  };

  const operating = calcSectionTotal(data.operating);
  const investing = calcSectionTotal(data.investing);
  const financing = calcSectionTotal(data.financing);
  const netCashFlow = operating.net + investing.net + financing.net;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">قائمة التدفق النقدي</h1>
            <p className="text-gray-600 mt-1">تتبع التدفقات النقدية الداخلة والخارجة</p>
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
            <CardTitle>قائمة التدفق النقدي</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : (
              <div className="space-y-6">
                {/* الأنشطة التشغيلية */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">الأنشطة التشغيلية</h3>
                  <div className="space-y-2">
                    <div className="pr-4">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <ArrowDown className="w-4 h-4 text-green-600" />
                        التدفقات الداخلة
                      </h4>
                      {data.operating.inflows.length > 0 ? (
                        data.operating.inflows.map((item: { name: string; amount: number }, index: number) => (
                          <div key={index} className="flex justify-between py-1 pr-4">
                            <span>{item.name}</span>
                            <span className="font-semibold text-green-600">{item.amount.toLocaleString()} ج.م</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-gray-500 py-2">لا توجد تدفقات داخلة</div>
                      )}
                    </div>
                    <div className="pr-4">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <ArrowUp className="w-4 h-4 text-red-600" />
                        التدفقات الخارجة
                      </h4>
                      {data.operating.outflows.length > 0 ? (
                        data.operating.outflows.map((item: { name: string; amount: number }, index: number) => (
                          <div key={index} className="flex justify-between py-1 pr-4">
                            <span>{item.name}</span>
                            <span className="font-semibold text-red-600">-{item.amount.toLocaleString()} ج.م</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-gray-500 py-2">لا توجد تدفقات خارجة</div>
                      )}
                    </div>
                    <div className="flex justify-between py-2 font-bold border-t-2 mt-2">
                      <span>صافي التدفق النقدي من الأنشطة التشغيلية</span>
                      <span className={operating.net >= 0 ? "text-green-600" : "text-red-600"}>{operating.net.toLocaleString()} ج.م</span>
                    </div>
                  </div>
                </div>

                {/* الأنشطة الاستثمارية */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">الأنشطة الاستثمارية</h3>
                  <div className="space-y-2">
                    <div className="pr-4">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <ArrowDown className="w-4 h-4 text-green-600" />
                        التدفقات الداخلة
                      </h4>
                      {data.investing.inflows.length > 0 && data.investing.inflows[0].amount > 0 ? (
                        data.investing.inflows.map((item: { name: string; amount: number }, index: number) => (
                          <div key={index} className="flex justify-between py-1 pr-4">
                            <span>{item.name}</span>
                            <span className="font-semibold text-green-600">{item.amount.toLocaleString()} ج.م</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-gray-500 py-2">لا توجد تدفقات داخلة</div>
                      )}
                    </div>
                    <div className="pr-4">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <ArrowUp className="w-4 h-4 text-red-600" />
                        التدفقات الخارجة
                      </h4>
                      {data.investing.outflows.length > 0 && data.investing.outflows[0].amount > 0 ? (
                        data.investing.outflows.map((item: { name: string; amount: number }, index: number) => (
                          <div key={index} className="flex justify-between py-1 pr-4">
                            <span>{item.name}</span>
                            <span className="font-semibold text-red-600">-{item.amount.toLocaleString()} ج.م</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-gray-500 py-2">لا توجد تدفقات خارجة</div>
                      )}
                    </div>
                    <div className="flex justify-between py-2 font-bold border-t-2 mt-2">
                      <span>صافي التدفق النقدي من الأنشطة الاستثمارية</span>
                      <span className={investing.net >= 0 ? "text-green-600" : "text-red-600"}>{investing.net.toLocaleString()} ج.م</span>
                    </div>
                  </div>
                </div>

                {/* الأنشطة التمويلية */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">الأنشطة التمويلية</h3>
                  <div className="space-y-2">
                    <div className="pr-4">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <ArrowDown className="w-4 h-4 text-green-600" />
                        التدفقات الداخلة
                      </h4>
                      {data.financing.inflows.length > 0 && data.financing.inflows[0].amount > 0 ? (
                        data.financing.inflows.map((item: { name: string; amount: number }, index: number) => (
                          <div key={index} className="flex justify-between py-1 pr-4">
                            <span>{item.name}</span>
                            <span className="font-semibold text-green-600">{item.amount.toLocaleString()} ج.م</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-gray-500 py-2">لا توجد تدفقات داخلة</div>
                      )}
                    </div>
                    <div className="pr-4">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <ArrowUp className="w-4 h-4 text-red-600" />
                        التدفقات الخارجة
                      </h4>
                      {data.financing.outflows.length > 0 && data.financing.outflows[0].amount > 0 ? (
                        data.financing.outflows.map((item: { name: string; amount: number }, index: number) => (
                          <div key={index} className="flex justify-between py-1 pr-4">
                            <span>{item.name}</span>
                            <span className="font-semibold text-red-600">-{item.amount.toLocaleString()} ج.م</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-gray-500 py-2">لا توجد تدفقات خارجة</div>
                      )}
                    </div>
                    <div className="flex justify-between py-2 font-bold border-t-2 mt-2">
                      <span>صافي التدفق النقدي من الأنشطة التمويلية</span>
                      <span className={financing.net >= 0 ? "text-green-600" : "text-red-600"}>{financing.net.toLocaleString()} ج.م</span>
                    </div>
                  </div>
                </div>

                {/* صافي التدفق النقدي */}
                <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold flex items-center gap-2">
                      <Wallet className="w-6 h-6" />
                      صافي الزيادة/النقص في النقدية
                    </span>
                    <span className={`text-2xl font-bold ${netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {netCashFlow.toLocaleString()} ج.م
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

export default CashFlow;

