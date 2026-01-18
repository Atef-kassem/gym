import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  Plus, Save, Calendar as CalendarIcon, Search, Edit, Trash2,
  Filter, Download, FileText, BookOpen, Receipt, CheckCircle, Loader2
} from "lucide-react";
import {
  useGetAllJournalEntriesQuery,
  useCreateJournalEntryMutation,
  useUpdateJournalEntryMutation,
  useDeleteJournalEntryMutation,
  usePostJournalEntryMutation,
} from "@/services/accountingApi";
import {
  useGetAllAccountsQuery,
} from "@/services/accountingApi";

interface JournalEntryItem {
  accountId: number;
  debit: number;
  credit: number;
  description?: string;
  reference?: string;
}

interface JournalEntry {
  id: number;
  entryNumber: string;
  entryDate: string;
  entryType: "daily" | "monthly" | "annual" | "opening" | "closing" | "adjusting";
  description: string;
  reference?: string;
  status: "draft" | "posted" | "cancelled";
  totalDebit: number;
  totalCredit: number;
  items?: Array<JournalEntryItem & { account?: { id: number; code: string; name: string } }>;
}

const convertDateToISO = (date: Date | string | undefined): string => {
  if (!date) return "";
  if (typeof date === "string") return date;
  return format(date, "yyyy-MM-dd");
};

const JournalEntries = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [entryDate, setEntryDate] = useState<Date | undefined>(new Date());

  const { data: entriesData, isLoading, refetch } = useGetAllJournalEntriesQuery({
    search: searchQuery || undefined,
    entryType: filterType !== "all" ? filterType : undefined,
    status: filterStatus !== "all" ? filterStatus : undefined,
  });

  const { data: accountsData } = useGetAllAccountsQuery({});
  const [createJournalEntry] = useCreateJournalEntryMutation();
  const [updateJournalEntry] = useUpdateJournalEntryMutation();
  const [deleteJournalEntry] = useDeleteJournalEntryMutation();
  const [postJournalEntry] = usePostJournalEntryMutation();

  // Helper function to flatten nested account structure
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

  // Handle both flat array and response structure - Filter to show only sub accounts (leaf accounts)
  let allAccounts: any[] = [];
  
  if (Array.isArray(accountsData?.data?.flat)) {
    allAccounts = accountsData.data.flat;
  } else if (Array.isArray(accountsData?.data?.tree)) {
    // If data comes as tree, flatten it first
    allAccounts = flattenAccounts(accountsData.data.tree);
  } else if (Array.isArray(accountsData?.data)) {
    // If data is array but might be nested
    allAccounts = flattenAccounts(accountsData.data);
  }
  
  // Filter to show only sub accounts (leaf accounts that can be used in journal entries)
  const accounts = allAccounts.filter((acc: any) => {
    return acc.accountLevel === "sub";
  });

  const [formData, setFormData] = useState({
    entryDate: "",
    entryType: "daily" as "daily" | "monthly" | "annual",
    description: "",
    reference: "",
    // Old structure (for backward compatibility)
    debitAccountId: "",
    debitAmount: "",
    debitDescription: "",
    creditAccountId: "",
    creditAmount: "",
    creditDescription: "",
    // New structure
    items: [] as Array<{ 
      accountId: string; 
      debit: string; 
      credit: string; 
      description: string;
      type: "debit" | "credit";
    }>,
  });

  const entries: JournalEntry[] = entriesData?.data || [];

  // حساب إجمالي المدين والدائن
  const calculateTotals = () => {
    // Check if using items array (new structure) - prioritize this
    if (formData.items && formData.items.length > 0) {
      const totalDebit = formData.items
        .filter(item => item.type === "debit" && item.debit && parseFloat(item.debit) > 0)
        .reduce((sum, item) => sum + (parseFloat(item.debit) || 0), 0);
      const totalCredit = formData.items
        .filter(item => item.type === "credit" && item.credit && parseFloat(item.credit) > 0)
        .reduce((sum, item) => sum + (parseFloat(item.credit) || 0), 0);
      return { totalDebit, totalCredit };
    }
    // Old structure - single debit and credit
    const totalDebit = parseFloat(formData.debitAmount || "0") || 0;
    const totalCredit = parseFloat(formData.creditAmount || "0") || 0;
    return { totalDebit, totalCredit };
  };
  
  // Check if we're using items array or old structure
  const usingItemsArray = formData.items && formData.items.length > 0;
  const debitItems = usingItemsArray ? formData.items.filter(item => item.type === "debit") : [];
  const creditItems = usingItemsArray ? formData.items.filter(item => item.type === "credit") : [];

  const { totalDebit, totalCredit } = calculateTotals();
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01 && totalDebit > 0 && totalCredit > 0;

  const handleAdd = () => {
    setFormData({
      entryDate: "",
      entryType: "daily",
      description: "",
      reference: "",
      // Old structure (for backward compatibility)
      debitAccountId: "",
      debitAmount: "",
      debitDescription: "",
      creditAccountId: "",
      creditAmount: "",
      creditDescription: "",
      // New structure
      items: [
        { accountId: "", debit: "", credit: "", description: "", type: "debit" },
        { accountId: "", debit: "", credit: "", description: "", type: "credit" },
      ],
    });
    setEntryDate(new Date());
    setSelectedEntry(null);
    setIsAddDialogOpen(true);
  };

  const handleEdit = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    
    // Convert entry items to form items
    const formItems = (entry.items || []).map(item => ({
      accountId: String(item.accountId),
      debit: item.debit > 0 ? String(item.debit) : "",
      credit: item.credit > 0 ? String(item.credit) : "",
      description: item.description || "",
      type: item.debit > 0 ? "debit" as const : "credit" as const,
    }));
    
    setFormData({
      entryDate: entry.entryDate || "",
      entryType: entry.entryType || "daily",
      description: entry.description || "",
      reference: entry.reference || "",
      // Old structure (for backward compatibility)
      debitAccountId: "",
      debitAmount: "",
      debitDescription: "",
      creditAccountId: "",
      creditAmount: "",
      creditDescription: "",
      // New structure
      items: formItems.length > 0 ? formItems : [
        { accountId: "", debit: "", credit: "", description: "", type: "debit" },
        { accountId: "", debit: "", credit: "", description: "", type: "credit" },
      ],
    });
    setEntryDate(new Date(entry.entryDate));
    setIsEditDialogOpen(true);
  };

  const handleSave = async () => {
    if (!isBalanced) {
      toast({
        title: "خطأ",
        description: "يجب أن يتساوى إجمالي المدين مع إجمالي الدائن",
        variant: "destructive"
      });
      return;
    }

    if (!entryDate || !formData.description) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    // Check if using old form structure or new structure
    let items: any[] = [];
    
    if (formData.debitAccountId || formData.creditAccountId) {
      // Old structure - single debit and credit
      if (!formData.debitAccountId || !formData.creditAccountId) {
        toast({
          title: "خطأ",
          description: "يرجى اختيار حساب المدين وحساب الدائن",
          variant: "destructive"
        });
        return;
      }
      
      if (!formData.debitAmount || !formData.creditAmount) {
        toast({
          title: "خطأ",
          description: "يرجى إدخال مبلغ المدين والدائن",
          variant: "destructive"
        });
        return;
      }
      
      const debitAccountId = parseInt(formData.debitAccountId);
      const creditAccountId = parseInt(formData.creditAccountId);
      const debitAmount = parseFloat(formData.debitAmount || "0") || 0;
      const creditAmount = parseFloat(formData.creditAmount || "0") || 0;
      
      if (isNaN(debitAccountId) || isNaN(creditAccountId)) {
        toast({
          title: "خطأ",
          description: "يرجى اختيار حسابات صحيحة",
          variant: "destructive"
        });
        return;
      }
      
      if (debitAmount <= 0 || creditAmount <= 0) {
        toast({
          title: "خطأ",
          description: "يجب أن يكون المبلغ أكبر من صفر",
          variant: "destructive"
        });
        return;
      }
      
      items = [
        {
          accountId: debitAccountId,
          debit: debitAmount,
          credit: 0,
          description: formData.debitDescription || "",
        },
        {
          accountId: creditAccountId,
          debit: 0,
          credit: creditAmount,
          description: formData.creditDescription || "",
        },
      ];
    } else {
      // New structure - items array
      const debitItems = formData.items.filter(item => item.type === "debit" && item.accountId && item.debit);
      const creditItems = formData.items.filter(item => item.type === "credit" && item.accountId && item.credit);
      
      if (debitItems.length === 0 || creditItems.length === 0) {
        toast({
          title: "خطأ",
          description: "يرجى إضافة حساب مدين وحساب دائن على الأقل",
          variant: "destructive"
        });
        return;
      }

      items = formData.items
        .filter(item => item.accountId && ((item.type === "debit" && item.debit) || (item.type === "credit" && item.credit)))
        .map(item => ({
          accountId: parseInt(item.accountId),
          debit: item.type === "debit" ? parseFloat(item.debit) || 0 : 0,
          credit: item.type === "credit" ? parseFloat(item.credit) || 0 : 0,
          description: item.description,
        }));
    }

    try {
      // Validate items before sending
      if (!items || items.length < 2) {
        toast({
          title: "خطأ",
          description: "يجب أن يكون هناك حساب مدين وحساب دائن على الأقل",
          variant: "destructive"
        });
        return;
      }

      // Validate all account IDs are valid numbers
      for (const item of items) {
        if (!item.accountId || isNaN(parseInt(item.accountId))) {
          toast({
            title: "خطأ",
            description: "يرجى اختيار حسابات صحيحة",
            variant: "destructive"
          });
          return;
        }
        if ((!item.debit || item.debit <= 0) && (!item.credit || item.credit <= 0)) {
          toast({
            title: "خطأ",
            description: "يجب أن يكون لكل حساب مبلغ أكبر من صفر",
            variant: "destructive"
          });
          return;
        }
      }

      const entryData = {
        entryDate: convertDateToISO(entryDate),
        entryType: formData.entryType,
        description: formData.description,
        reference: formData.reference || "",
        items: items.map(item => ({
          accountId: parseInt(item.accountId),
          debit: parseFloat(item.debit || "0"),
          credit: parseFloat(item.credit || "0"),
          description: item.description || "",
        })),
      };
      
      console.log("Sending entry data:", entryData);

      if (isEditDialogOpen && selectedEntry) {
        await updateJournalEntry({ id: selectedEntry.id, ...entryData }).unwrap();
        toast({
          title: "نجح",
          description: "تم تحديث القيد بنجاح"
        });
        setIsEditDialogOpen(false);
      } else {
        await createJournalEntry(entryData).unwrap();
        toast({
          title: "نجح",
          description: "تم إضافة القيد بنجاح"
        });
        setIsAddDialogOpen(false);
      }

      refetch();
    } catch (error: any) {
      console.error("Error saving journal entry:", error);
      const errorMessage = error?.data?.message || error?.data?.error || error?.message || "حدث خطأ أثناء حفظ القيد";
      toast({
        title: "خطأ",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (entry: JournalEntry) => {
    if (entry.status === "posted") {
      toast({
        title: "خطأ",
        description: "لا يمكن حذف قيد مرحل",
        variant: "destructive"
      });
      return;
    }

    if (!confirm(`هل أنت متأكد من حذف القيد "${entry.entryNumber}"؟`)) {
      return;
    }

    try {
      await deleteJournalEntry(entry.id).unwrap();
      toast({
        title: "نجح",
        description: "تم حذف القيد بنجاح"
      });
      refetch();
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error?.data?.message || "حدث خطأ أثناء حذف القيد",
        variant: "destructive"
      });
    }
  };

  const handlePost = async (entry: JournalEntry) => {
    if (entry.status === "posted") {
      toast({
        title: "تحذير",
        description: "القيد مرحل بالفعل"
      });
      return;
    }

    try {
      await postJournalEntry({ id: entry.id, postedBy: 1 }).unwrap(); // TODO: Get user ID from context
      toast({
        title: "نجح",
        description: "تم ترحيل القيد بنجاح"
      });
      refetch();
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error?.data?.message || "حدث خطأ أثناء ترحيل القيد",
        variant: "destructive"
      });
    }
  };

  const addItem = (type: "debit" | "credit") => {
    // Convert old structure to new structure if needed
    let currentItems = [...(formData.items || [])];
    
    // If we're using old structure (debitAccountId/creditAccountId), convert it to items first
    const hasOldDebitData = formData.debitAccountId && formData.debitAmount;
    const hasOldCreditData = formData.creditAccountId && formData.creditAmount;
    
    // Check if old debit data exists and is not already in items
    if (hasOldDebitData && !currentItems.some(item => item.type === "debit" && item.accountId === formData.debitAccountId && item.debit === formData.debitAmount)) {
      currentItems.push({
        accountId: formData.debitAccountId,
        debit: formData.debitAmount,
        credit: "",
        description: formData.debitDescription || "",
        type: "debit" as const,
      });
    }
    
    // Check if old credit data exists and is not already in items
    if (hasOldCreditData && !currentItems.some(item => item.type === "credit" && item.accountId === formData.creditAccountId && item.credit === formData.creditAmount)) {
      currentItems.push({
        accountId: formData.creditAccountId,
        debit: "",
        credit: formData.creditAmount,
        description: formData.creditDescription || "",
        type: "credit" as const,
      });
    }
    
    // Add new empty item
    currentItems.push({ accountId: "", debit: "", credit: "", description: "", type });
    
    // Update form data - clear old structure and use items
    setFormData({
      ...formData,
      items: currentItems,
      // Clear old structure to avoid confusion
      debitAccountId: "",
      debitAmount: "",
      debitDescription: "",
      creditAccountId: "",
      creditAmount: "",
      creditDescription: "",
    });
  };

  const removeItem = (index: number) => {
    if (formData.items.length <= 2) {
      toast({
        title: "تحذير",
        description: "يجب أن يكون هناك حساب مدين وحساب دائن على الأقل",
        variant: "destructive"
      });
      return;
    }
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index)
    });
  };

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  // Auto-sync amounts when one changes (for backward compatibility with old form structure)
  const handleDebitAmountChange = (value: string) => {
    setFormData({
      ...formData,
      debitAmount: value,
      creditAmount: value, // Auto-sync credit with debit
    });
  };

  const handleCreditAmountChange = (value: string) => {
    setFormData({
      ...formData,
      creditAmount: value,
      debitAmount: value, // Auto-sync debit with credit
    });
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.entryNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || entry.entryType === filterType;
    const matchesStatus = filterStatus === "all" || entry.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-6 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">القيود المحاسبية</h1>
            <p className="text-gray-600 mt-1">إدارة القيود اليومية والشهرية والسنوية</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="البحث عن قيد..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="نوع القيد" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                <SelectItem value="daily">يومي</SelectItem>
                <SelectItem value="monthly">شهري</SelectItem>
                <SelectItem value="annual">سنوي</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="draft">مسودة</SelectItem>
                <SelectItem value="posted">مرحلة</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAdd}>
              <Plus className="w-5 h-5 ml-2" />
              إضافة قيد جديد
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>قائمة القيود ({filteredEntries.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-right py-3 px-4 font-semibold">رقم القيد</th>
                    <th className="text-right py-3 px-4 font-semibold">التاريخ</th>
                    <th className="text-right py-3 px-4 font-semibold">النوع</th>
                    <th className="text-right py-3 px-4 font-semibold">الوصف</th>
                    <th className="text-right py-3 px-4 font-semibold">المبلغ</th>
                    <th className="text-right py-3 px-4 font-semibold">الحالة</th>
                    <th className="text-right py-3 px-4 font-semibold">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEntries.map((entry) => (
                    <tr key={entry.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{entry.entryNumber}</td>
                      <td className="py-3 px-4">{format(new Date(entry.entryDate), "PPP", { locale: ar })}</td>
                      <td className="py-3 px-4">
                        <Badge variant={entry.entryType === "daily" ? "default" : entry.entryType === "monthly" ? "secondary" : "outline"}>
                          {entry.entryType === "daily" ? "يومي" : entry.entryType === "monthly" ? "شهري" : "سنوي"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">{entry.description}</td>
                      <td className="py-3 px-4 font-semibold">{entry.totalDebit.toLocaleString()} ج.م</td>
                      <td className="py-3 px-4">
                        <Badge className={entry.status === "posted" ? "bg-green-500" : entry.status === "cancelled" ? "bg-red-500" : "bg-yellow-500"}>
                          {entry.status === "posted" ? "مرحلة" : entry.status === "cancelled" ? "ملغاة" : "مسودة"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2 justify-end">
                          <Button variant="ghost" size="sm" onClick={() => {
                            setSelectedEntry(entry);
                            setIsViewDialogOpen(true);
                          }} title="عرض التفاصيل">
                            <FileText className="w-4 h-4 text-blue-600" />
                          </Button>
                          {entry.status === "draft" && (
                            <>
                              <Button variant="ghost" size="sm" onClick={() => handlePost(entry)} title="ترحيل">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleEdit(entry)} title="تعديل">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDelete(entry)} title="حذف">
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Dialog open={isAddDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
          if (!open) {
            setIsAddDialogOpen(false);
            setIsEditDialogOpen(false);
            setSelectedEntry(null);
          }
        }}>
          <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto w-[95vw]">
            <DialogHeader>
              <DialogTitle>{isAddDialogOpen ? "إضافة قيد محاسبي جديد" : "تعديل القيد المحاسبي"}</DialogTitle>
              <DialogDescription>
                أدخل تفاصيل القيد المحاسبي مع التأكد من تساوي المدين والدائن
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>تاريخ القيد *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full justify-start text-right font-normal", !entryDate && "text-muted-foreground")}>
                        <CalendarIcon className="ml-2 h-4 w-4" />
                        {entryDate ? format(entryDate, "PPP", { locale: ar }) : <span>اختر التاريخ</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={entryDate} onSelect={setEntryDate} locale={ar} />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>نوع القيد *</Label>
                  <Select value={formData.entryType} onValueChange={(value: any) => setFormData({ ...formData, entryType: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">يومي</SelectItem>
                      <SelectItem value="monthly">شهري</SelectItem>
                      <SelectItem value="annual">سنوي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>رقم المرجع</Label>
                  <Input
                    value={formData.reference}
                    onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                    placeholder="رقم المرجع (اختياري)"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>الوصف *</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="أدخل وصف القيد"
                  rows={3}
                />
              </div>

              {/* حساب المدين */}
              <div className="space-y-4 border p-4 rounded-lg bg-blue-50/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-8 bg-blue-600 rounded"></div>
                    <Label className="text-lg font-bold">حسابات المدين *</Label>
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => addItem("debit")}
                  >
                    <Plus className="w-4 h-4 ml-2" />
                    إضافة مدين
                  </Button>
                </div>
                
                {usingItemsArray ? (
                  // Display items array
                  <div className="space-y-3">
                    {debitItems.map((item, index) => {
                      const actualIndex = formData.items.findIndex((i, idx) => i === item && idx === formData.items.indexOf(item));
                      const selectedAccount = accounts.find((a: any) => String(a.id) === item.accountId);
                      return (
                        <div key={`debit-${actualIndex}`} className="p-3 bg-white rounded border border-blue-200 space-y-2">
                          <div className="grid grid-cols-12 gap-2">
                            <div className="col-span-5 space-y-1">
                              <Label className="text-xs">الحساب *</Label>
                              <Select
                                value={item.accountId}
                                onValueChange={(value) => updateItem(actualIndex, "accountId", value)}
                              >
                                <SelectTrigger className="h-8 text-sm">
                                  <SelectValue placeholder="اختر" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Array.isArray(accounts) && accounts.length > 0 ? (
                                    accounts.map(acc => (
                                      <SelectItem key={acc.id} value={String(acc.id)}>
                                        <span className="font-bold text-blue-600">{acc.code}</span> - {acc.name}
                                      </SelectItem>
                                    ))
                                  ) : (
                                    <div className="px-2 py-1.5 text-xs text-gray-500 text-center">
                                      لا توجد حسابات
                                    </div>
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="col-span-4 space-y-1">
                              <Label className="text-xs">المبلغ *</Label>
                              <Input
                                type="number"
                                placeholder="0.00"
                                value={item.debit}
                                onChange={(e) => updateItem(actualIndex, "debit", e.target.value)}
                                className="h-8 text-sm"
                              />
                            </div>
                            <div className="col-span-2 space-y-1">
                              <Label className="text-xs">&nbsp;</Label>
                              {debitItems.length > 1 && (
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => removeItem(actualIndex)} 
                                  className="h-8 w-full p-0"
                                >
                                  <Trash2 className="w-3 h-3 text-red-500" />
                                </Button>
                              )}
                            </div>
                            <div className="col-span-12 space-y-1">
                              <Input
                                placeholder="وصف (اختياري)"
                                value={item.description}
                                onChange={(e) => updateItem(actualIndex, "description", e.target.value)}
                                className="h-8 text-xs"
                              />
                            </div>
                          </div>
                          {selectedAccount && (
                            <div className="mt-2 p-2 bg-blue-50 rounded text-xs grid grid-cols-2 gap-2">
                              <div><span className="text-gray-600">رقم:</span> <span className="font-bold text-blue-600">{selectedAccount.code}</span></div>
                              <div><span className="text-gray-600">الاسم:</span> <span className="font-medium">{selectedAccount.name}</span></div>
                              <div><span className="text-gray-600">النوع:</span> 
                                <Badge variant="outline" className="mr-1 text-xs">
                                  {selectedAccount.type === "asset" ? "أصول" :
                                   selectedAccount.type === "liability" ? "خصوم" :
                                   selectedAccount.type === "equity" ? "حقوق ملكية" :
                                   selectedAccount.type === "revenue" ? "إيرادات" : "مصروفات"}
                                </Badge>
                              </div>
                              <div><span className="text-gray-600">الرصيد:</span> <span className="font-semibold">{parseFloat(selectedAccount.balance || "0").toLocaleString()} ج.م</span></div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  // Old structure - single debit field
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 md:col-span-4 space-y-2">
                      <Label className="text-sm">الحساب *</Label>
                      <Select
                        value={formData.debitAccountId}
                        onValueChange={(value) => setFormData({ ...formData, debitAccountId: value })}
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="اختر" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.isArray(accounts) && accounts.length > 0 ? (
                            accounts.map(acc => (
                              <SelectItem key={acc.id} value={String(acc.id)}>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-blue-600">{acc.code}</span>
                                  <span>-</span>
                                  <span>{acc.name}</span>
                                </div>
                              </SelectItem>
                            ))
                          ) : (
                            <div className="px-2 py-1.5 text-sm text-gray-500 text-center">
                              لا توجد حسابات فرعية متاحة
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-12 md:col-span-3 space-y-2">
                      <Label className="text-sm">المبلغ *</Label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={formData.debitAmount}
                        onChange={(e) => handleDebitAmountChange(e.target.value)}
                        className="h-9 text-sm"
                      />
                    </div>
                    <div className="col-span-12 md:col-span-4 space-y-2">
                      <Label className="text-sm">الوصف</Label>
                      <Input
                        placeholder="وصف (اختياري)"
                        value={formData.debitDescription}
                        onChange={(e) => setFormData({ ...formData, debitDescription: e.target.value })}
                        className="h-9 text-sm"
                      />
                    </div>
                    {formData.debitAccountId && (
                      <div className="col-span-12 p-3 bg-white rounded border">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm text-gray-600">رقم الحساب:</span>
                            <span className="font-bold text-blue-600 mr-2">
                              {accounts.find((a: any) => String(a.id) === formData.debitAccountId)?.code}
                            </span>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">اسم الحساب:</span>
                            <span className="font-medium mr-2">
                              {accounts.find((a: any) => String(a.id) === formData.debitAccountId)?.name}
                            </span>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">نوع الحساب:</span>
                            <Badge variant="outline" className="mr-2">
                              {accounts.find((a: any) => String(a.id) === formData.debitAccountId)?.type === "asset" ? "أصول" :
                               accounts.find((a: any) => String(a.id) === formData.debitAccountId)?.type === "liability" ? "خصوم" :
                               accounts.find((a: any) => String(a.id) === formData.debitAccountId)?.type === "equity" ? "حقوق ملكية" :
                               accounts.find((a: any) => String(a.id) === formData.debitAccountId)?.type === "revenue" ? "إيرادات" : "مصروفات"}
                            </Badge>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">الرصيد الحالي:</span>
                            <span className="font-semibold mr-2">
                              {parseFloat(accounts.find((a: any) => String(a.id) === formData.debitAccountId)?.balance || "0").toLocaleString()} ج.م
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* حساب الدائن */}
              <div className="space-y-4 border p-4 rounded-lg bg-green-50/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-8 bg-green-600 rounded"></div>
                    <Label className="text-lg font-bold">حسابات الدائن *</Label>
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => addItem("credit")}
                  >
                    <Plus className="w-4 h-4 ml-2" />
                    إضافة دائن
                  </Button>
                </div>
                
                {usingItemsArray ? (
                  // Display items array
                  <div className="space-y-3">
                    {creditItems.map((item, index) => {
                      const actualIndex = formData.items.findIndex((i, idx) => i === item && idx === formData.items.indexOf(item));
                      const selectedAccount = accounts.find((a: any) => String(a.id) === item.accountId);
                      return (
                        <div key={`credit-${actualIndex}`} className="p-3 bg-white rounded border border-green-200 space-y-2">
                          <div className="grid grid-cols-12 gap-2">
                            <div className="col-span-5 space-y-1">
                              <Label className="text-xs">الحساب *</Label>
                              <Select
                                value={item.accountId}
                                onValueChange={(value) => updateItem(actualIndex, "accountId", value)}
                              >
                                <SelectTrigger className="h-8 text-sm">
                                  <SelectValue placeholder="اختر" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Array.isArray(accounts) && accounts.length > 0 ? (
                                    accounts.map(acc => (
                                      <SelectItem key={acc.id} value={String(acc.id)}>
                                        <span className="font-bold text-green-600">{acc.code}</span> - {acc.name}
                                      </SelectItem>
                                    ))
                                  ) : (
                                    <div className="px-2 py-1.5 text-xs text-gray-500 text-center">
                                      لا توجد حسابات
                                    </div>
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="col-span-4 space-y-1">
                              <Label className="text-xs">المبلغ *</Label>
                              <Input
                                type="number"
                                placeholder="0.00"
                                value={item.credit}
                                onChange={(e) => updateItem(actualIndex, "credit", e.target.value)}
                                className="h-8 text-sm"
                              />
                            </div>
                            <div className="col-span-2 space-y-1">
                              <Label className="text-xs">&nbsp;</Label>
                              {creditItems.length > 1 && (
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => removeItem(actualIndex)} 
                                  className="h-8 w-full p-0"
                                >
                                  <Trash2 className="w-3 h-3 text-red-500" />
                                </Button>
                              )}
                            </div>
                            <div className="col-span-12 space-y-1">
                              <Input
                                placeholder="وصف (اختياري)"
                                value={item.description}
                                onChange={(e) => updateItem(actualIndex, "description", e.target.value)}
                                className="h-8 text-xs"
                              />
                            </div>
                          </div>
                          {selectedAccount && (
                            <div className="mt-2 p-2 bg-green-50 rounded text-xs grid grid-cols-2 gap-2">
                              <div><span className="text-gray-600">رقم:</span> <span className="font-bold text-green-600">{selectedAccount.code}</span></div>
                              <div><span className="text-gray-600">الاسم:</span> <span className="font-medium">{selectedAccount.name}</span></div>
                              <div><span className="text-gray-600">النوع:</span> 
                                <Badge variant="outline" className="mr-1 text-xs">
                                  {selectedAccount.type === "asset" ? "أصول" :
                                   selectedAccount.type === "liability" ? "خصوم" :
                                   selectedAccount.type === "equity" ? "حقوق ملكية" :
                                   selectedAccount.type === "revenue" ? "إيرادات" : "مصروفات"}
                                </Badge>
                              </div>
                              <div><span className="text-gray-600">الرصيد:</span> <span className="font-semibold">{parseFloat(selectedAccount.balance || "0").toLocaleString()} ج.م</span></div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  // Old structure - single credit field
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 md:col-span-4 space-y-2">
                      <Label className="text-sm">الحساب *</Label>
                      <Select
                        value={formData.creditAccountId}
                        onValueChange={(value) => setFormData({ ...formData, creditAccountId: value })}
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="اختر" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.isArray(accounts) && accounts.length > 0 ? (
                            accounts.map(acc => (
                              <SelectItem key={acc.id} value={String(acc.id)}>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-green-600">{acc.code}</span>
                                  <span>-</span>
                                  <span>{acc.name}</span>
                                </div>
                              </SelectItem>
                            ))
                          ) : (
                            <div className="px-2 py-1.5 text-sm text-gray-500 text-center">
                              لا توجد حسابات فرعية متاحة
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-12 md:col-span-3 space-y-2">
                      <Label className="text-sm">المبلغ *</Label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={formData.creditAmount}
                        onChange={(e) => handleCreditAmountChange(e.target.value)}
                        className="h-9 text-sm"
                      />
                    </div>
                    <div className="col-span-12 md:col-span-4 space-y-2">
                      <Label className="text-sm">الوصف</Label>
                      <Input
                        placeholder="وصف (اختياري)"
                        value={formData.creditDescription}
                        onChange={(e) => setFormData({ ...formData, creditDescription: e.target.value })}
                        className="h-9 text-sm"
                      />
                    </div>
                    {formData.creditAccountId && (
                      <div className="col-span-12 p-3 bg-white rounded border">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm text-gray-600">رقم الحساب:</span>
                            <span className="font-bold text-green-600 mr-2">
                              {accounts.find((a: any) => String(a.id) === formData.creditAccountId)?.code}
                            </span>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">اسم الحساب:</span>
                            <span className="font-medium mr-2">
                              {accounts.find((a: any) => String(a.id) === formData.creditAccountId)?.name}
                            </span>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">نوع الحساب:</span>
                            <Badge variant="outline" className="mr-2">
                              {accounts.find((a: any) => String(a.id) === formData.creditAccountId)?.type === "asset" ? "أصول" :
                               accounts.find((a: any) => String(a.id) === formData.creditAccountId)?.type === "liability" ? "خصوم" :
                               accounts.find((a: any) => String(a.id) === formData.creditAccountId)?.type === "equity" ? "حقوق ملكية" :
                               accounts.find((a: any) => String(a.id) === formData.creditAccountId)?.type === "revenue" ? "إيرادات" : "مصروفات"}
                            </Badge>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">الرصيد الحالي:</span>
                            <span className="font-semibold mr-2">
                              {parseFloat(accounts.find((a: any) => String(a.id) === formData.creditAccountId)?.balance || "0").toLocaleString()} ج.م
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ملخص القيد */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg border-2 ${isBalanced ? "bg-green-50 border-green-300" : "bg-red-50 border-red-300"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-700">إجمالي المدين:</span>
                    <span className="font-bold text-lg text-blue-600">
                      {totalDebit.toLocaleString()} ج.م
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-700">إجمالي الدائن:</span>
                    <span className="font-bold text-lg text-green-600">
                      {totalCredit.toLocaleString()} ج.م
                    </span>
                  </div>
                </div>
                <div className={`p-4 rounded-lg border-2 ${isBalanced ? "bg-green-50 border-green-300" : "bg-red-50 border-red-300"}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-700">الفرق:</span>
                    <span className={`font-bold text-xl ${isBalanced ? "text-green-600" : "text-red-600"}`}>
                      {(totalDebit - totalCredit).toLocaleString()} ج.م
                    </span>
                  </div>
                  {isBalanced ? (
                    <div className="flex items-center gap-2 mt-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-green-700">القيد متوازن</span>
                    </div>
                  ) : (
                    <p className="text-sm text-red-600 mt-3">⚠️ يجب أن يتساوى إجمالي المدين مع إجمالي الدائن</p>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsAddDialogOpen(false);
                setIsEditDialogOpen(false);
                setSelectedEntry(null);
              }}>
                إلغاء
              </Button>
              <Button onClick={handleSave} disabled={!isBalanced} className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 ml-2" />
                حفظ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>تفاصيل القيد المحاسبي</DialogTitle>
              <DialogDescription>
                عرض كامل لتفاصيل القيد المحاسبي
              </DialogDescription>
            </DialogHeader>
            {selectedEntry && (
              <div className="space-y-6">
                {/* Header Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label className="text-sm text-gray-600">رقم القيد</Label>
                    <p className="font-bold text-lg">{selectedEntry.entryNumber}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">تاريخ القيد</Label>
                    <p className="font-medium">{format(new Date(selectedEntry.entryDate), "yyyy-MM-dd", { locale: ar })}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">نوع القيد</Label>
                    <Badge variant="outline" className="mt-1">
                      {selectedEntry.entryType === "daily" ? "يومي" :
                       selectedEntry.entryType === "monthly" ? "شهري" :
                       selectedEntry.entryType === "annual" ? "سنوي" :
                       selectedEntry.entryType === "opening" ? "افتتاحي" :
                       selectedEntry.entryType === "closing" ? "ختامي" :
                       selectedEntry.entryType === "adjusting" ? "تسوية" : selectedEntry.entryType}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">الحالة</Label>
                    <Badge 
                      className={`mt-1 ${
                        selectedEntry.status === "posted" ? "bg-green-500" :
                        selectedEntry.status === "draft" ? "bg-yellow-500" :
                        "bg-red-500"
                      }`}
                    >
                      {selectedEntry.status === "posted" ? "مرحل" :
                       selectedEntry.status === "draft" ? "مسودة" :
                       "ملغي"}
                    </Badge>
                  </div>
                  {selectedEntry.reference && (
                    <div>
                      <Label className="text-sm text-gray-600">المرجع</Label>
                      <p className="font-medium">{selectedEntry.reference}</p>
                    </div>
                  )}
                  <div className="md:col-span-3">
                    <Label className="text-sm text-gray-600">الوصف</Label>
                    <p className="font-medium mt-1">{selectedEntry.description}</p>
                  </div>
                </div>

                {/* Debit and Credit Items */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Debit Items */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-6 bg-blue-600 rounded"></div>
                      <Label className="font-bold text-lg text-blue-700">حسابات المدين</Label>
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-blue-50">
                          <tr>
                            <th className="px-4 py-2 text-right text-sm font-semibold">رقم الحساب</th>
                            <th className="px-4 py-2 text-right text-sm font-semibold">اسم الحساب</th>
                            <th className="px-4 py-2 text-right text-sm font-semibold">المبلغ</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedEntry.items?.filter(item => item.debit > 0).map((item, index) => (
                            <tr key={index} className="border-t">
                              <td className="px-4 py-2 text-sm font-medium text-blue-600">
                                {item.account?.code || item.accountId}
                              </td>
                              <td className="px-4 py-2 text-sm">{item.account?.name || "غير معروف"}</td>
                              <td className="px-4 py-2 text-sm font-bold">{parseFloat(item.debit).toLocaleString()} ج.م</td>
                            </tr>
                          ))}
                          <tr className="bg-blue-50 font-bold">
                            <td colSpan={2} className="px-4 py-2 text-right">الإجمالي</td>
                            <td className="px-4 py-2">
                              {selectedEntry.items?.filter(item => item.debit > 0)
                                .reduce((sum, item) => sum + parseFloat(item.debit), 0)
                                .toLocaleString()} ج.م
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    {selectedEntry.items?.filter(item => item.debit > 0).some(item => item.description) && (
                      <div className="space-y-2">
                        {selectedEntry.items?.filter(item => item.debit > 0).map((item, index) => (
                          item.description && (
                            <div key={index} className="p-2 bg-blue-50 rounded text-sm">
                              <span className="font-medium text-blue-600">{item.account?.code || item.accountId}:</span> {item.description}
                            </div>
                          )
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Credit Items */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-6 bg-green-600 rounded"></div>
                      <Label className="font-bold text-lg text-green-700">حسابات الدائن</Label>
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-green-50">
                          <tr>
                            <th className="px-4 py-2 text-right text-sm font-semibold">رقم الحساب</th>
                            <th className="px-4 py-2 text-right text-sm font-semibold">اسم الحساب</th>
                            <th className="px-4 py-2 text-right text-sm font-semibold">المبلغ</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedEntry.items?.filter(item => item.credit > 0).map((item, index) => (
                            <tr key={index} className="border-t">
                              <td className="px-4 py-2 text-sm font-medium text-green-600">
                                {item.account?.code || item.accountId}
                              </td>
                              <td className="px-4 py-2 text-sm">{item.account?.name || "غير معروف"}</td>
                              <td className="px-4 py-2 text-sm font-bold">{parseFloat(item.credit).toLocaleString()} ج.م</td>
                            </tr>
                          ))}
                          <tr className="bg-green-50 font-bold">
                            <td colSpan={2} className="px-4 py-2 text-right">الإجمالي</td>
                            <td className="px-4 py-2">
                              {selectedEntry.items?.filter(item => item.credit > 0)
                                .reduce((sum, item) => sum + parseFloat(item.credit), 0)
                                .toLocaleString()} ج.م
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    {selectedEntry.items?.filter(item => item.credit > 0).some(item => item.description) && (
                      <div className="space-y-2">
                        {selectedEntry.items?.filter(item => item.credit > 0).map((item, index) => (
                          item.description && (
                            <div key={index} className="p-2 bg-green-50 rounded text-sm">
                              <span className="font-medium text-green-600">{item.account?.code || item.accountId}:</span> {item.description}
                            </div>
                          )
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Summary */}
                <div className="p-4 bg-gray-50 rounded-lg border-2 border-green-300">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-700">إجمالي المدين:</span>
                    <span className="font-bold text-lg text-blue-600">
                      {parseFloat(selectedEntry.totalDebit || "0").toLocaleString()} ج.م
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-700">إجمالي الدائن:</span>
                    <span className="font-bold text-lg text-green-600">
                      {parseFloat(selectedEntry.totalCredit || "0").toLocaleString()} ج.م
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="font-semibold text-gray-700">الفرق:</span>
                    <span className={`font-bold text-xl ${
                      Math.abs(parseFloat(selectedEntry.totalDebit || "0") - parseFloat(selectedEntry.totalCredit || "0")) < 0.01
                        ? "text-green-600"
                        : "text-red-600"
                    }`}>
                      {(parseFloat(selectedEntry.totalDebit || "0") - parseFloat(selectedEntry.totalCredit || "0")).toLocaleString()} ج.م
                    </span>
                  </div>
                </div>

                {/* Additional Information */}
                {(selectedEntry.createdByUser || selectedEntry.postedByUser) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    {selectedEntry.createdByUser && (
                      <div>
                        <Label className="text-sm text-gray-600">أنشئ بواسطة</Label>
                        <p className="font-medium">{selectedEntry.createdByUser.arabicName || selectedEntry.createdByUser.englinshName || "غير معروف"}</p>
                      </div>
                    )}
                    {selectedEntry.postedByUser && (
                      <div>
                        <Label className="text-sm text-gray-600">مرحل بواسطة</Label>
                        <p className="font-medium">{selectedEntry.postedByUser.arabicName || selectedEntry.postedByUser.englinshName || "غير معروف"}</p>
                      </div>
                    )}
                    {selectedEntry.createdAt && (
                      <div>
                        <Label className="text-sm text-gray-600">تاريخ الإنشاء</Label>
                        <p className="font-medium">{format(new Date(selectedEntry.createdAt), "yyyy-MM-dd HH:mm", { locale: ar })}</p>
                      </div>
                    )}
                    {selectedEntry.updatedAt && (
                      <div>
                        <Label className="text-sm text-gray-600">آخر تحديث</Label>
                        <p className="font-medium">{format(new Date(selectedEntry.updatedAt), "yyyy-MM-dd HH:mm", { locale: ar })}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                إغلاق
              </Button>
              {selectedEntry && selectedEntry.status === "draft" && (
                <Button onClick={() => {
                  setIsViewDialogOpen(false);
                  handleEdit(selectedEntry);
                }} className="bg-blue-600 hover:bg-blue-700">
                  <Edit className="w-4 h-4 ml-2" />
                  تعديل
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default JournalEntries;
