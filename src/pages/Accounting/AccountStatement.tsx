import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { CalendarIcon, Download, FileText, Search, Loader2 } from "lucide-react";
import { useGetAccountStatementQuery } from "@/services/accountingApi";
import { useGetAllAccountsQuery } from "@/services/accountingApi";

interface Account {
  id: number;
  code: string;
  name: string;
  accountLevel: "main" | "sub-main" | "sub";
  parentId?: number | null;
}

const AccountStatement = () => {
  const [selectedAccount, setSelectedAccount] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(new Date().getFullYear(), 0, 1));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());

  const { data: accountsData } = useGetAllAccountsQuery({});
  
  // Handle both flat array and response structure (same as ChartOfAccounts.tsx)
  // Backend returns: { success: true, data: tree, flat: [...], count: ... }
  // But RTK Query might wrap it, so we check multiple structures
  const allAccountsFlat = useMemo(() => {
    // First check: nested structure accountsData.data.flat (most common in this codebase)
    if (Array.isArray(accountsData?.data?.flat)) {
      return accountsData.data.flat;
    }
    // Second check: flat at root level accountsData.flat
    if (Array.isArray(accountsData?.flat)) {
      return accountsData.flat;
    }
    // Third check: data itself is flat array
    if (Array.isArray(accountsData?.data)) {
      return accountsData.data;
    }
    return [];
  }, [accountsData]);

  // Get tree structure (for hierarchical display)
  const accountsTree = useMemo(() => {
    // Check if data is a tree structure (has children property)
    if (Array.isArray(accountsData?.data)) {
      const firstItem = accountsData.data[0];
      // If first item has children, it's a tree structure
      if (firstItem && firstItem.children !== undefined) {
        return accountsData.data;
      }
    }
    // Check if tree is nested in data.tree
    if (Array.isArray(accountsData?.data?.tree)) {
      return accountsData.data.tree;
    }
    return [];
  }, [accountsData]);

  // Determine if selected account is a parent (main or sub-main)
  const selectedAccountObj = useMemo(() => {
    return allAccountsFlat.find((acc: Account) => String(acc.id) === selectedAccount);
  }, [selectedAccount, allAccountsFlat]);

  const shouldIncludeChildren = selectedAccountObj && (selectedAccountObj.accountLevel === "main" || selectedAccountObj.accountLevel === "sub-main");

  const { data: statementData, isLoading, refetch } = useGetAccountStatementQuery(
    {
      accountId: selectedAccount || "0",
      startDate: startDate ? format(startDate, "yyyy-MM-dd") : undefined,
      endDate: endDate ? format(endDate, "yyyy-MM-dd") : undefined,
      includeChildren: shouldIncludeChildren ? "true" : "false",
    },
    { skip: !selectedAccount }
  );

  // Flatten accounts for dropdown with hierarchy info
  const flattenAccountsForDropdown = (accounts: any[], level = 0, result: any[] = []): any[] => {
    accounts.forEach((acc: any) => {
      result.push({ ...acc, displayLevel: level });
      if (acc.children && Array.isArray(acc.children) && acc.children.length > 0) {
        flattenAccountsForDropdown(acc.children, level + 1, result);
      }
    });
    return result;
  };

  const accountsForDropdown = useMemo(() => {
    if (accountsTree.length > 0) {
      return flattenAccountsForDropdown(accountsTree);
    }
    // Fallback to flat array if tree is not available
    if (allAccountsFlat.length > 0) {
      return allAccountsFlat.map((acc: any) => ({ ...acc, displayLevel: 0 }));
    }
    return [];
  }, [accountsTree, allAccountsFlat]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-6 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const account = statementData?.data?.account;
  const childAccounts = statementData?.data?.childAccounts || [];
  const transactions = statementData?.data?.transactions || [];
  const openingBalance = statementData?.data?.openingBalance || 0;
  const closingBalance = statementData?.data?.closingBalance || openingBalance;
  const totals = statementData?.data?.totals || { debit: 0, credit: 0 };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-8 h-8 text-indigo-600" />
              كشف حساب
            </h1>
            <p className="text-gray-600 mt-1">عرض جميع حركات حساب محاسبي معين</p>
          </div>
          <Button>
            <Download className="w-4 h-4 ml-2" />
            تصدير
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>كشف حساب</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">اختر الحساب *</label>
                <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الحساب" />
                  </SelectTrigger>
                  <SelectContent>
                    {accountsForDropdown.length > 0 ? (
                      accountsForDropdown.map((acc: any) => (
                        <SelectItem key={acc.id} value={String(acc.id)}>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400">
                              {"  ".repeat(acc.displayLevel || 0)}
                              {acc.displayLevel > 0 && "└─ "}
                            </span>
                            <span className="font-mono text-sm">{acc.code}</span>
                            <span>-</span>
                            <span>{acc.name}</span>
                            {(acc.accountLevel === "main" || acc.accountLevel === "sub-main") && (
                              <span className="text-xs text-blue-600 mr-2">(يشمل الأبناء)</span>
                            )}
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <div className="px-2 py-1.5 text-sm text-gray-500 text-center">
                        لا توجد حسابات متاحة
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">من تاريخ</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-right font-normal", !startDate && "text-muted-foreground")}>
                      <CalendarIcon className="ml-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP", { locale: ar }) : <span>اختر التاريخ</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={startDate} onSelect={setStartDate} locale={ar} />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">إلى تاريخ</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-right font-normal", !endDate && "text-muted-foreground")}>
                      <CalendarIcon className="ml-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP", { locale: ar }) : <span>اختر التاريخ</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={endDate} onSelect={setEndDate} locale={ar} />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex items-end">
                <Button className="w-full" disabled={!selectedAccount} onClick={() => refetch()}>
                  <Search className="w-4 h-4 ml-2" />
                  عرض الكشف
                </Button>
              </div>
            </div>

            {selectedAccount && account && (
              <div className="border rounded-lg overflow-hidden mt-6">
                <div className="bg-blue-50 p-4 border-b">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-lg">{account.name}</h3>
                      <p className="text-sm text-gray-600">رمز الحساب: {account.code}</p>
                      {shouldIncludeChildren && childAccounts.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-500 mb-1">يشمل الحسابات الفرعية:</p>
                          <div className="flex flex-wrap gap-2">
                            {childAccounts.map((child: any) => (
                              <span key={child.id} className="text-xs bg-white px-2 py-1 rounded border">
                                {child.code} - {child.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-gray-600">الرصيد الافتتاحي</p>
                      <p className="text-lg font-bold">{openingBalance.toLocaleString()} ج.م</p>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-right py-3 px-4 font-semibold">التاريخ</th>
                        <th className="text-right py-3 px-4 font-semibold">الوصف</th>
                        {shouldIncludeChildren && (
                          <th className="text-right py-3 px-4 font-semibold">الحساب</th>
                        )}
                        <th className="text-right py-3 px-4 font-semibold">مدين</th>
                        <th className="text-right py-3 px-4 font-semibold">دائن</th>
                        <th className="text-right py-3 px-4 font-semibold">الرصيد</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b bg-blue-50">
                        <td colSpan={shouldIncludeChildren ? 5 : 4} className="py-2 px-4 font-semibold text-right">الرصيد الافتتاحي</td>
                        <td className="py-2 px-4 font-bold text-right">{openingBalance.toLocaleString()} ج.م</td>
                      </tr>
                      {transactions.map((trans: any, index: number) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{format(new Date(trans.date), "PPP", { locale: ar })}</td>
                          <td className="py-3 px-4">{trans.description}</td>
                          {shouldIncludeChildren && (
                            <td className="py-3 px-4 text-sm text-gray-600">
                              {trans.accountCode && trans.accountName ? (
                                <span>{trans.accountCode} - {trans.accountName}</span>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                          )}
                          <td className="py-3 px-4 text-right">
                            {trans.debit > 0 ? <span className="font-semibold">{trans.debit.toLocaleString()} ج.م</span> : "-"}
                          </td>
                          <td className="py-3 px-4 text-right">
                            {trans.credit > 0 ? <span className="font-semibold">{trans.credit.toLocaleString()} ج.م</span> : "-"}
                          </td>
                          <td className="py-3 px-4 text-right font-bold">{trans.balance.toLocaleString()} ج.م</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr className="border-t-2 font-bold">
                        <td colSpan={shouldIncludeChildren ? 3 : 2} className="py-3 px-4 text-right">الإجمالي</td>
                        <td className="py-3 px-4 text-right">
                          {totals.debit.toLocaleString()} ج.م
                        </td>
                        <td className="py-3 px-4 text-right">
                          {totals.credit.toLocaleString()} ج.م
                        </td>
                        <td className="py-3 px-4 text-right">{closingBalance.toLocaleString()} ج.م</td>
                      </tr>
                      <tr className="bg-green-50">
                        <td colSpan={shouldIncludeChildren ? 5 : 4} className="py-3 px-4 text-right font-bold text-green-700">الرصيد الختامي</td>
                        <td className="py-3 px-4 text-right font-bold text-green-700 text-lg">{closingBalance.toLocaleString()} ج.م</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AccountStatement;
