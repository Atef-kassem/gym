import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { CalendarIcon, Download, Scale, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useGetTrialBalanceQuery } from "@/services/accountingApi";

const TrialBalance = () => {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(new Date().getFullYear(), 0, 1));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());

  const { data: trialBalanceData, isLoading, refetch } = useGetTrialBalanceQuery({
    startDate: startDate ? format(startDate, "yyyy-MM-dd") : undefined,
    endDate: endDate ? format(endDate, "yyyy-MM-dd") : undefined,
  });

  const data = trialBalanceData?.data || [];
  const summary = trialBalanceData?.summary || {
    totalDebit: 0,
    totalCredit: 0,
    difference: 0,
    isBalanced: true,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-6 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Scale className="w-8 h-8 text-indigo-600" />
              ميزان المراجعة
            </h1>
            <p className="text-gray-600 mt-1">عرض أرصدة جميع الحسابات وتوازنها</p>
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
            <Button onClick={() => refetch()}>
              <Download className="w-4 h-4 ml-2" />
              تحديث
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>ميزان المراجعة</span>
              <div className="flex items-center gap-2">
                {summary.isBalanced ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-green-600 font-medium">متوازن</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-500" />
                    <span className="text-red-600 font-medium">غير متوازن</span>
                  </>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-right py-3 px-4 font-semibold">رمز الحساب</th>
                    <th className="text-right py-3 px-4 font-semibold">اسم الحساب</th>
                    <th className="text-right py-3 px-4 font-semibold">مدين</th>
                    <th className="text-right py-3 px-4 font-semibold">دائن</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item: any, index: number) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{item.code}</td>
                      <td className="py-3 px-4">{item.name}</td>
                      <td className="py-3 px-4 text-right">
                        {item.debit > 0 ? <span className="font-semibold">{item.debit.toLocaleString()} ج.م</span> : "-"}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {item.credit > 0 ? <span className="font-semibold">{item.credit.toLocaleString()} ج.م</span> : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr className="border-t-2 font-bold">
                    <td colSpan={2} className="py-3 px-4 text-right">الإجمالي</td>
                    <td className="py-3 px-4 text-right text-lg">{summary.totalDebit.toLocaleString()} ج.م</td>
                    <td className="py-3 px-4 text-right text-lg">{summary.totalCredit.toLocaleString()} ج.م</td>
                  </tr>
                  {!summary.isBalanced && (
                    <tr className="bg-red-50">
                      <td colSpan={2} className="py-2 px-4 text-right text-red-600 font-semibold">الفرق</td>
                      <td colSpan={2} className="py-2 px-4 text-right text-red-600 font-bold">
                        {summary.difference.toLocaleString()} ج.م
                      </td>
                    </tr>
                  )}
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrialBalance;
