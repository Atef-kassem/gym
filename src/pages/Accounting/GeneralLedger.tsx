import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { CalendarIcon, Download, BookOpen, Loader2 } from "lucide-react";
import { useGetAllJournalEntriesQuery, useGetAllAccountsQuery } from "@/services/accountingApi";

const GeneralLedger = () => {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(new Date().getFullYear(), 0, 1));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());

  const startDateStr = startDate ? format(startDate, "yyyy-MM-dd") : undefined;
  const endDateStr = endDate ? format(endDate, "yyyy-MM-dd") : undefined;

  // جلب القيود المحاسبية في الفترة المحددة
  const { data: journalEntriesData, isLoading: journalEntriesLoading } = useGetAllJournalEntriesQuery({
    startDate: startDateStr,
    endDate: endDateStr,
    status: "posted", // فقط القيود المرحلة
  });

  // جلب جميع الحسابات
  const { data: accountsData, isLoading: accountsLoading } = useGetAllAccountsQuery({
    endDate: endDateStr, // للحصول على الرصيد حتى تاريخ التقرير
  });

  const isLoading = journalEntriesLoading || accountsLoading;

  // دالة لتسطيح الحسابات المتداخلة
  const flattenAccounts = (accountsList: any[]): any[] => {
    let result: any[] = [];
    for (const account of accountsList) {
      result.push(account);
      if (account.children && Array.isArray(account.children)) {
        result = result.concat(flattenAccounts(account.children));
      }
    }
    return result;
  };

  // تجميع القيود حسب الحساب
  const ledgerEntries = useMemo(() => {
    if (!journalEntriesData?.data || !accountsData) {
      return [];
    }

    const journalEntries = journalEntriesData.data;
    
    // تسطيح الحسابات
    let allAccountsFlat: any[] = [];
    if (Array.isArray(accountsData?.data?.flat)) {
      allAccountsFlat = accountsData.data.flat;
    } else if (Array.isArray(accountsData?.flat)) {
      allAccountsFlat = accountsData.flat;
    } else if (Array.isArray(accountsData?.data)) {
      allAccountsFlat = flattenAccounts(accountsData.data);
    }

    // إنشاء خريطة للحسابات للوصول السريع
    const accountsMap = new Map<number, any>();
    allAccountsFlat.forEach((acc: any) => {
      accountsMap.set(acc.id, acc);
    });

    // تجميع القيود حسب الحساب
    interface AccountLedgerData {
      accountCode: string;
      accountName: string;
      accountId: number;
      entries: Array<{
        date: string;
        description: string;
        reference: string;
        debit: number;
        credit: number;
        entryId: number;
      }>;
    }
    const accountEntriesMap = new Map<string, AccountLedgerData>();

    journalEntries.forEach((entry: any) => {
      if (!entry.items || !Array.isArray(entry.items)) {
        return;
      }

      entry.items.forEach((item: any) => {
        if (!item.account) {
          return;
        }

        const accountId = item.account.id;
        const account = accountsMap.get(accountId);
        
        if (!account) {
          return;
        }

        const accountKey = `${account.code}-${account.name}`;
        
        if (!accountEntriesMap.has(accountKey)) {
          accountEntriesMap.set(accountKey, {
            accountCode: account.code || "",
            accountName: account.name || "",
            accountId: account.id,
            entries: [],
          });
        }

        const accountData = accountEntriesMap.get(accountKey);
        if (accountData) {
          accountData.entries.push({
            date: entry.entryDate || entry.createdAt,
            description: entry.description || "",
            reference: entry.entryNumber || entry.id,
            debit: parseFloat(item.debit || 0),
            credit: parseFloat(item.credit || 0),
            entryId: entry.id,
          });
        }
      });
    });

    // تحويل الخريطة إلى مصفوفة وترتيب القيود حسب التاريخ
    const result: AccountLedgerData[] = Array.from(accountEntriesMap.values()).map((accountData) => {
      // ترتيب القيود حسب التاريخ
      accountData.entries.sort((a: any, b: any) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        if (dateA !== dateB) {
          return dateA - dateB;
        }
        // إذا كان التاريخ نفسه، ترتيب حسب رقم القيد
        return (a.reference || "").localeCompare(b.reference || "");
      });
      return accountData;
    });

    // ترتيب الحسابات حسب الكود
    result.sort((a, b) => (a.accountCode || "").localeCompare(b.accountCode || ""));

    return result;
  }, [journalEntriesData, accountsData]);

  const calculateBalance = (entries: any[]) => {
    return entries.reduce((sum: number, entry: any) => sum + entry.debit - entry.credit, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-8 h-8 text-indigo-600" />
              دفتر الأستاذ العام
            </h1>
            <p className="text-gray-600 mt-1">عرض جميع القيود المحاسبية منظمة حسب الحسابات</p>
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

        {isLoading ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600 ml-3" />
              <span className="text-gray-600">جاري تحميل البيانات...</span>
            </CardContent>
          </Card>
        ) : ledgerEntries.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <BookOpen className="w-12 h-12 text-gray-400 ml-3" />
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">لا توجد بيانات</p>
                <p className="text-gray-600">لا توجد قيود محاسبية في الفترة المحددة</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {ledgerEntries.map((account, accountIndex) => {
              const balance = calculateBalance(account.entries);
              const totalDebit = account.entries.reduce((sum: number, e: any) => sum + e.debit, 0);
              const totalCredit = account.entries.reduce((sum: number, e: any) => sum + e.credit, 0);
              
              return (
                <Card key={accountIndex}>
                  <CardHeader className="bg-blue-50 border-b">
                    <CardTitle className="flex items-center justify-between">
                      <div>
                        <span className="text-lg">{account.accountCode} - {account.accountName}</span>
                      </div>
                      <div className="text-left">
                        <span className="text-sm text-gray-600">الرصيد: </span>
                        <span className="font-bold text-lg">{balance.toLocaleString()} ج.م</span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b bg-gray-50">
                            <th className="text-right py-3 px-4 font-semibold">التاريخ</th>
                            <th className="text-right py-3 px-4 font-semibold">الوصف</th>
                            <th className="text-right py-3 px-4 font-semibold">رقم القيد</th>
                            <th className="text-right py-3 px-4 font-semibold">مدين</th>
                            <th className="text-right py-3 px-4 font-semibold">دائن</th>
                            <th className="text-right py-3 px-4 font-semibold">الرصيد</th>
                          </tr>
                        </thead>
                        <tbody>
                          {account.entries.map((entry: any, entryIndex: number) => {
                            const runningBalance = account.entries.slice(0, entryIndex + 1)
                              .reduce((sum: number, e: any) => sum + e.debit - e.credit, 0);
                            
                            return (
                              <tr key={entryIndex} className="border-b hover:bg-gray-50">
                                <td className="py-3 px-4">
                                  {entry.date ? format(new Date(entry.date), "PPP", { locale: ar }) : "-"}
                                </td>
                                <td className="py-3 px-4">{entry.description || "-"}</td>
                                <td className="py-3 px-4 font-medium">{entry.reference || "-"}</td>
                                <td className="py-3 px-4 text-right">
                                  {entry.debit > 0 ? <span className="font-semibold">{entry.debit.toLocaleString()} ج.م</span> : "-"}
                                </td>
                                <td className="py-3 px-4 text-right">
                                  {entry.credit > 0 ? <span className="font-semibold">{entry.credit.toLocaleString()} ج.م</span> : "-"}
                                </td>
                                <td className="py-3 px-4 text-right font-bold">{runningBalance.toLocaleString()} ج.م</td>
                              </tr>
                            );
                          })}
                        </tbody>
                        <tfoot className="bg-gray-50">
                          <tr className="border-t-2 font-bold">
                            <td colSpan={3} className="py-3 px-4 text-right">الإجمالي</td>
                            <td className="py-3 px-4 text-right">{totalDebit.toLocaleString()} ج.م</td>
                            <td className="py-3 px-4 text-right">{totalCredit.toLocaleString()} ج.م</td>
                            <td className="py-3 px-4 text-right">{balance.toLocaleString()} ج.م</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneralLedger;

