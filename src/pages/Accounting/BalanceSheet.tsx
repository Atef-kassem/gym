import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { CalendarIcon, Download, Building2, Wallet, Users, Loader2 } from "lucide-react";
import { useGetTrialBalanceQuery, useGetAllAccountsQuery } from "@/services/accountingApi";

const BalanceSheet = () => {
  const [reportDate, setReportDate] = useState<Date | undefined>(new Date());

  // تحويل التاريخ إلى صيغة API
  const reportDateStr = reportDate ? format(reportDate, "yyyy-MM-dd") : undefined;

  // جلب الميزانية التجريبية حتى تاريخ التقرير (للحصول على الرصيد الختامي)
  const { data: trialBalanceData, isLoading: trialBalanceLoading } = useGetTrialBalanceQuery({
    endDate: reportDateStr,
  });

  // جلب جميع الحسابات للحصول على معلومات التصنيف
  const { data: accountsData, isLoading: accountsLoading } = useGetAllAccountsQuery({});

  const isLoading = trialBalanceLoading || accountsLoading;

  // تصنيف البيانات من الميزانية التجريبية (التي تحتوي على الرصيد الختامي)
  const data = useMemo(() => {
    const trialBalance = trialBalanceData?.data || [];
    
    // الحصول على جميع الحسابات المسطحة للتصنيف
    let allAccountsFlat: any[] = [];
    if (Array.isArray(accountsData?.data?.flat)) {
      allAccountsFlat = accountsData.data.flat;
    } else if (Array.isArray(accountsData?.flat)) {
      allAccountsFlat = accountsData.flat;
    } else if (Array.isArray(accountsData?.data)) {
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

    // إنشاء خريطة للحسابات للوصول السريع
    const accountsMap = new Map();
    allAccountsFlat.forEach((acc: any) => {
      accountsMap.set(acc.id, acc);
    });

    // تصنيف الأصول - استخدام الرصيد الختامي من الميزانية التجريبية
    const allAssets = trialBalance
      .filter((item: any) => item.type === "asset" && (item.debit > 0 || item.credit > 0))
      .map((item: any) => {
        const account = accountsMap.get(item.id);
        // للأصول: الرصيد الختامي يكون في عمود debit
        const closingBalance = parseFloat(item.debit || 0);
        return {
          id: item.id,
          name: item.name,
          amount: closingBalance,
          category: account?.category || item.category || "",
          code: item.code || account?.code || "",
        };
      })
      .filter((item: any) => item.amount > 0);

    // تصنيف الأصول إلى ثابتة ومتداولة بناءً على الكود أولاً ثم الفئة
    const fixedAssets = allAssets.filter((item: any) => {
      const category = (item.category || "").toLowerCase();
      const name = (item.name || "").toLowerCase();
      const code = item.code || "";
      
      // التصنيف حسب الكود (الأكثر دقة)
      // الأصول الثابتة عادة تبدأ بـ 1-2 أو 12 أو 1-3 أو 13
      if (code.startsWith("1-2") || code.startsWith("12") || 
          code.startsWith("1-3") || code.startsWith("13") ||
          code.startsWith("1.2") || code.startsWith("1.3")) {
        return true;
      }
      
      // إذا كانت الفئة تحتوي على كلمات محددة
      if (
        category.includes("ثابت") ||
        category.includes("fixed") ||
        category.includes("أصول ثابتة")
      ) {
        return true;
      }
      
      // إذا كان الاسم يحتوي على كلمات محددة
      if (
        name.includes("أرض") ||
        name.includes("مباني") ||
        name.includes("معدات") ||
        name.includes("آلات") ||
        name.includes("سيارات") ||
        name.includes("أثاث") ||
        name.includes("إنشاءات")
      ) {
        return true;
      }
      
      return false;
    });

    const currentAssets = allAssets.filter((item: any) => {
      // كل ما ليس أصل ثابت يعتبر متداول
      return !fixedAssets.some((fa: any) => fa.id === item.id);
    });

    // تصنيف الخصوم - استخدام الرصيد الختامي من الميزانية التجريبية
    const allLiabilities = trialBalance
      .filter((item: any) => item.type === "liability" && (item.credit > 0 || item.debit > 0))
      .map((item: any) => {
        const account = accountsMap.get(item.id);
        // للخصوم: الرصيد الختامي يكون في عمود credit
        const closingBalance = parseFloat(item.credit || 0);
        return {
          id: item.id,
          name: item.name,
          amount: closingBalance,
          category: account?.category || item.category || "",
          code: item.code || account?.code || "",
        };
      })
      .filter((item: any) => item.amount > 0);

    // تصنيف الخصوم إلى قصيرة الأجل وطويلة الأجل بناءً على الكود أولاً ثم الفئة
    const shortTermLiabilities = allLiabilities.filter((item: any) => {
      const category = (item.category || "").toLowerCase();
      const name = (item.name || "").toLowerCase();
      const code = item.code || "";
      
      // التصنيف حسب الكود (الأكثر دقة)
      // الخصوم قصيرة الأجل عادة تبدأ بـ 2-1 أو 21
      if (code.startsWith("2-1") || code.startsWith("21") || code.startsWith("2.1")) {
        return true;
      }
      
      // إذا كانت الفئة تحتوي على كلمات محددة
      if (
        category.includes("قصير") ||
        category.includes("short") ||
        category.includes("متداول") ||
        category.includes("current") ||
        category.includes("خصوم متداولة")
      ) {
        return true;
      }
      
      // إذا كان الاسم يحتوي على كلمات محددة
      if (
        name.includes("دائن") ||
        name.includes("مدين") ||
        name.includes("مورد") ||
        name.includes("مستحقات") ||
        name.includes("دائنين") ||
        name.includes("مستحقة")
      ) {
        return true;
      }
      
      return false;
    });

    const longTermLiabilities = allLiabilities.filter((item: any) => {
      // كل ما ليس خصم قصير الأجل يعتبر طويل الأجل
      return !shortTermLiabilities.some((st: any) => st.id === item.id);
    });

    // حقوق الملكية - استخدام الرصيد الختامي من الميزانية التجريبية
    const equity = trialBalance
      .filter((item: any) => item.type === "equity" && (item.credit > 0 || item.debit > 0))
      .map((item: any) => {
        // لحقوق الملكية: الرصيد الختامي يكون في عمود credit
        const closingBalance = parseFloat(item.credit || 0);
        return {
          name: item.name,
          amount: closingBalance,
        };
      })
      .filter((item: any) => item.amount > 0);

    return {
      assets: {
        fixed: fixedAssets,
        current: currentAssets,
      },
      liabilities: {
        shortTerm: shortTermLiabilities,
        longTerm: longTermLiabilities,
      },
      equity,
    };
  }, [trialBalanceData, accountsData]);

  const totalFixedAssets = data.assets.fixed.reduce((sum: number, item: { name: string; amount: number }) => sum + item.amount, 0);
  const totalCurrentAssets = data.assets.current.reduce((sum: number, item: { name: string; amount: number }) => sum + item.amount, 0);
  const totalAssets = totalFixedAssets + totalCurrentAssets;

  const totalShortTermLiabilities = data.liabilities.shortTerm.reduce((sum: number, item: { name: string; amount: number }) => sum + item.amount, 0);
  const totalLongTermLiabilities = data.liabilities.longTerm.reduce((sum: number, item: { name: string; amount: number }) => sum + item.amount, 0);
  const totalLiabilities = totalShortTermLiabilities + totalLongTermLiabilities;

  const totalEquity = data.equity.reduce((sum: number, item: { name: string; amount: number }) => sum + item.amount, 0);
  const totalLiabilitiesAndEquity = totalLiabilities + totalEquity;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">الميزانية العمومية</h1>
            <p className="text-gray-600 mt-1">عرض الأصول والخصوم وحقوق الملكية</p>
          </div>
          <div className="flex gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-[200px] justify-start text-right font-normal", !reportDate && "text-muted-foreground")}>
                  <CalendarIcon className="ml-2 h-4 w-4" />
                  {reportDate ? format(reportDate, "PPP", { locale: ar }) : <span>تاريخ التقرير</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={reportDate} onSelect={setReportDate} locale={ar} />
              </PopoverContent>
            </Popover>
            <Button>
              <Download className="w-4 h-4 ml-2" />
              تصدير
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* الأصول */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-green-600" />
                  الأصول
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">الأصول الثابتة</h4>
                    {data.assets.fixed.length > 0 ? (
                      <>
                        {data.assets.fixed.map((item: { name: string; amount: number }, index: number) => (
                          <div key={index} className="flex justify-between py-2 border-b">
                            <span className="pr-4">{item.name}</span>
                            <span className="font-semibold">{item.amount.toLocaleString()} ج.م</span>
                          </div>
                        ))}
                        <div className="flex justify-between py-2 font-bold border-t-2 mt-2">
                          <span>إجمالي الأصول الثابتة</span>
                          <span>{totalFixedAssets.toLocaleString()} ج.م</span>
                        </div>
                      </>
                    ) : (
                      <div className="text-center text-gray-500 py-4">لا توجد أصول ثابتة</div>
                    )}
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">الأصول المتداولة</h4>
                    {data.assets.current.length > 0 ? (
                      <>
                        {data.assets.current.map((item: { name: string; amount: number }, index: number) => (
                          <div key={index} className="flex justify-between py-2 border-b">
                            <span className="pr-4">{item.name}</span>
                            <span className="font-semibold">{item.amount.toLocaleString()} ج.م</span>
                          </div>
                        ))}
                        <div className="flex justify-between py-2 font-bold border-t-2 mt-2">
                          <span>إجمالي الأصول المتداولة</span>
                          <span>{totalCurrentAssets.toLocaleString()} ج.م</span>
                        </div>
                      </>
                    ) : (
                      <div className="text-center text-gray-500 py-4">لا توجد أصول متداولة</div>
                    )}
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold">إجمالي الأصول</span>
                      <span className="text-2xl font-bold text-green-600">{totalAssets.toLocaleString()} ج.م</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* الخصوم وحقوق الملكية */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-red-600" />
                  الخصوم وحقوق الملكية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">الخصوم قصيرة الأجل</h4>
                    {data.liabilities.shortTerm.length > 0 ? (
                      <>
                        {data.liabilities.shortTerm.map((item: { name: string; amount: number }, index: number) => (
                          <div key={index} className="flex justify-between py-2 border-b">
                            <span className="pr-4">{item.name}</span>
                            <span className="font-semibold">{item.amount.toLocaleString()} ج.م</span>
                          </div>
                        ))}
                        <div className="flex justify-between py-2 font-bold border-t-2 mt-2">
                          <span>إجمالي الخصوم قصيرة الأجل</span>
                          <span>{totalShortTermLiabilities.toLocaleString()} ج.م</span>
                        </div>
                      </>
                    ) : (
                      <div className="text-center text-gray-500 py-4">لا توجد خصوم قصيرة الأجل</div>
                    )}
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">الخصوم طويلة الأجل</h4>
                    {data.liabilities.longTerm.length > 0 ? (
                      <>
                        {data.liabilities.longTerm.map((item: { name: string; amount: number }, index: number) => (
                          <div key={index} className="flex justify-between py-2 border-b">
                            <span className="pr-4">{item.name}</span>
                            <span className="font-semibold">{item.amount.toLocaleString()} ج.م</span>
                          </div>
                        ))}
                        <div className="flex justify-between py-2 font-bold border-t-2 mt-2">
                          <span>إجمالي الخصوم طويلة الأجل</span>
                          <span>{totalLongTermLiabilities.toLocaleString()} ج.م</span>
                        </div>
                      </>
                    ) : (
                      <div className="text-center text-gray-500 py-4">لا توجد خصوم طويلة الأجل</div>
                    )}
                  </div>

                  <div className="flex justify-between py-2 font-bold border-t-2 border-b-2 mt-2">
                    <span>إجمالي الخصوم</span>
                    <span>{totalLiabilities.toLocaleString()} ج.م</span>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      حقوق الملكية
                    </h4>
                    {data.equity.length > 0 ? (
                      <>
                        {data.equity.map((item: { name: string; amount: number }, index: number) => (
                          <div key={index} className="flex justify-between py-2 border-b">
                            <span className="pr-4">{item.name}</span>
                            <span className="font-semibold">{item.amount.toLocaleString()} ج.م</span>
                          </div>
                        ))}
                        <div className="flex justify-between py-2 font-bold border-t-2 mt-2">
                          <span>إجمالي حقوق الملكية</span>
                          <span>{totalEquity.toLocaleString()} ج.م</span>
                        </div>
                      </>
                    ) : (
                      <div className="text-center text-gray-500 py-4">لا توجد حقوق ملكية</div>
                    )}
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold">إجمالي الخصوم وحقوق الملكية</span>
                      <span className="text-2xl font-bold text-blue-600">{totalLiabilitiesAndEquity.toLocaleString()} ج.م</span>
                    </div>
                    {Math.abs(totalAssets - totalLiabilitiesAndEquity) < 0.01 && (
                      <p className="text-sm text-green-600 mt-2">✓ متوازنة</p>
                    )}
                    {Math.abs(totalAssets - totalLiabilitiesAndEquity) >= 0.01 && (
                      <p className="text-sm text-red-600 mt-2">
                        الفرق: {(totalAssets - totalLiabilitiesAndEquity).toLocaleString()} ج.م
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default BalanceSheet;

