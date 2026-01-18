import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useToast } from "@/hooks/use-toast";
import {
  Plus, Save, Search, Edit, Trash2, ChevronRight, ChevronDown,
  Building2, Wallet, TrendingUp, TrendingDown, Users, FileText, FolderTree, Loader2, Download, FileDown, Sparkles, Upload
} from "lucide-react";
import * as XLSX from "xlsx";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  useGetAllAccountsQuery,
  useCreateAccountMutation,
  useUpdateAccountMutation,
  useDeleteAccountMutation,
} from "@/services/accountingApi";

interface Account {
  id: number;
  code: string;
  name: string;
  type: "asset" | "liability" | "equity" | "revenue" | "expense";
  category: string;
  accountLevel: "main" | "sub-main" | "sub";
  parentId?: number;
  balance: number;
  children?: Account[];
  isActive?: boolean;
}

const ChartOfAccounts = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedAccounts, setExpandedAccounts] = useState<Set<number>>(new Set());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState<number | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: accountsData, isLoading, refetch } = useGetAllAccountsQuery({});
  const [createAccount] = useCreateAccountMutation();
  const [updateAccount] = useUpdateAccountMutation();
  const [deleteAccount] = useDeleteAccountMutation();

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    type: "asset" as Account["type"],
    category: "",
    parentId: "",
    accountLevel: "main" as Account["accountLevel"],
    description: "",
  });

  // Handle both flat array and response structure
  const accounts: Account[] = Array.isArray(accountsData?.data?.flat) 
    ? accountsData.data.flat 
    : Array.isArray(accountsData?.data)
    ? accountsData.data
    : [];

  const accountTypes = [
    { value: "asset", label: "الأصول", icon: Building2, color: "text-green-600" },
    { value: "liability", label: "الخصوم", icon: Wallet, color: "text-red-600" },
    { value: "equity", label: "حقوق الملكية", icon: Users, color: "text-blue-600" },
    { value: "revenue", label: "الإيرادات", icon: TrendingUp, color: "text-cyan-600" },
    { value: "expense", label: "المصروفات", icon: TrendingDown, color: "text-orange-600" },
  ];

  const accountLevels = [
    { value: "main", label: "حساب رئيسي", description: "الحساب الرئيسي في الشجرة" },
    { value: "sub-main", label: "حساب رئيسي فرعي", description: "حساب فرعي للحساب الرئيسي" },
    { value: "sub", label: "حساب فرعي", description: "حساب فرعي للحساب الرئيسي الفرعي" },
  ];

  useEffect(() => {
    if (accountsData?.data?.tree) {
      // Expand first level by default
      const firstLevelIds = accountsData.data.tree
        .filter((acc: Account) => acc.accountLevel === "main")
        .map((acc: Account) => acc.id);
      setExpandedAccounts(new Set(firstLevelIds));
    }
  }, [accountsData]);

  const toggleExpand = (accountId: number) => {
    const newExpanded = new Set(expandedAccounts);
    if (newExpanded.has(accountId)) {
      newExpanded.delete(accountId);
    } else {
      newExpanded.add(accountId);
    }
    setExpandedAccounts(newExpanded);
  };

  const getAccountTypeInfo = (type: Account["type"]) => {
    return accountTypes.find(t => t.value === type) || accountTypes[0];
  };

  const getAccountLevelInfo = (level: Account["accountLevel"]) => {
    return accountLevels.find(l => l.value === level) || accountLevels[0];
  };

  const getAccountLevelBadgeVariant = (level: Account["accountLevel"]) => {
    switch (level) {
      case "main":
        return "default";
      case "sub-main":
        return "secondary";
      case "sub":
        return "outline";
      default:
        return "outline";
    }
  };

  const handleAddAccount = (parentId?: number) => {
    setSelectedParentId(parentId || null);
    if (parentId) {
      const parentAccount = findAccountById(accounts, parentId);
      if (parentAccount) {
        let newLevel: Account["accountLevel"] = "sub-main";
        if (parentAccount.accountLevel === "main") {
          newLevel = "sub-main";
        } else if (parentAccount.accountLevel === "sub-main") {
          newLevel = "sub";
        }
        
        setFormData({
          code: "",
          name: "",
          type: parentAccount.type,
          category: parentAccount.category || "",
          parentId: String(parentId),
          accountLevel: newLevel,
          description: "",
        });
      }
    } else {
      setFormData({
        code: "",
        name: "",
        type: "asset",
        category: "",
        parentId: "",
        accountLevel: "main",
        description: "",
      });
    }
    setIsAddDialogOpen(true);
  };

  const handleEditAccount = (account: Account) => {
    setSelectedAccount(account);
    setFormData({
      code: account.code,
      name: account.name,
      type: account.type,
      category: account.category || "",
      parentId: account.parentId ? String(account.parentId) : "",
      accountLevel: account.accountLevel,
      description: (account as any).description || "",
    });
    setIsEditDialogOpen(true);
  };

  const findAccountById = (accountsList: Account[], id: number): Account | null => {
    for (const account of accountsList) {
      if (account.id === id) return account;
      if (account.children) {
        const found = findAccountById(account.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const getAllAccountsFlat = (accountsList: Account[]): Account[] => {
    let result: Account[] = [];
    for (const account of accountsList) {
      result.push(account);
      if (account.children) {
        result = result.concat(getAllAccountsFlat(account.children));
      }
    }
    return result;
  };

  const handleSave = async () => {
    if (!formData.name) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال اسم الحساب",
        variant: "destructive"
      });
      return;
    }

    try {
      const accountData: any = {
        // Only send code if editing (for new accounts, it will be auto-generated)
        ...(isEditDialogOpen && formData.code ? { code: formData.code } : {}),
        name: formData.name,
        type: formData.type,
        category: formData.category,
        accountLevel: formData.accountLevel,
        description: formData.description,
      };

      if (formData.parentId && formData.accountLevel !== "main") {
        accountData.parentId = parseInt(formData.parentId);
      }

      if (isEditDialogOpen && selectedAccount) {
        await updateAccount({ id: selectedAccount.id, ...accountData }).unwrap();
        toast({
          title: "نجح",
          description: "تم تحديث الحساب بنجاح"
        });
        setIsEditDialogOpen(false);
      } else {
        await createAccount(accountData).unwrap();
        toast({
          title: "نجح",
          description: "تم إضافة الحساب بنجاح"
        });
        setIsAddDialogOpen(false);
      }

      setSelectedParentId(null);
      setSelectedAccount(null);
      setFormData({ code: "", name: "", type: "asset", category: "", parentId: "", accountLevel: "main", description: "" });
      refetch();
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error?.data?.message || "حدث خطأ أثناء حفظ الحساب",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (account: Account) => {
    if (!confirm(`هل أنت متأكد من حذف الحساب "${account.name}"؟`)) {
      return;
    }

    try {
      await deleteAccount(account.id).unwrap();
      toast({
        title: "نجح",
        description: "تم حذف الحساب بنجاح"
      });
      refetch();
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error?.data?.message || "حدث خطأ أثناء حذف الحساب",
        variant: "destructive"
      });
    }
  };

  const handleExportToExcel = () => {
    try {
      // الحصول على البيانات الحالية
      const currentFilteredAccounts = Array.isArray(accountsData?.data?.tree) 
        ? accountsData.data.tree 
        : Array.isArray(accountsData?.data) && accountsData.data.length > 0 && accountsData.data[0]?.children
        ? accountsData.data
        : [];
      
      const currentAllAccountsFlat = getAllAccountsFlat(currentFilteredAccounts);
      
      // تحويل البيانات الهرمية إلى مصفوفة مسطحة مع الحفاظ على التدرج
      const exportData: any[] = [];
      
      const flattenAccountsForExport = (accounts: Account[], level: number = 0, parentPath: string = "") => {
        accounts.forEach((account) => {
          const currentPath = parentPath ? `${parentPath} > ${account.name}` : account.name;
          const indent = "  ".repeat(level);
          
          exportData.push({
            "رمز الحساب": account.code,
            "اسم الحساب": `${indent}${account.name}`,
            "المسار الكامل": currentPath,
            "المستوى": getAccountLevelInfo(account.accountLevel).label,
            "نوع الحساب": getAccountTypeInfo(account.type).label,
            "التصنيف": account.category || "",
            "الرصيد": parseFloat(account.balance?.toString() || "0").toLocaleString(),
            "الحساب الأب": account.parentId ? findAccountById(currentAllAccountsFlat, account.parentId)?.name || "" : "",
            "الحالة": account.isActive !== false ? "نشط" : "غير نشط"
          });

          if (account.children && account.children.length > 0) {
            flattenAccountsForExport(account.children, level + 1, currentPath);
          }
        });
      };

      flattenAccountsForExport(currentFilteredAccounts);

      // إنشاء ورقة عمل Excel
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      
      // تحديد عرض الأعمدة
      const columnWidths = [
        { wch: 15 }, // رمز الحساب
        { wch: 40 }, // اسم الحساب
        { wch: 50 }, // المسار الكامل
        { wch: 20 }, // المستوى
        { wch: 15 }, // نوع الحساب
        { wch: 20 }, // التصنيف
        { wch: 15 }, // الرصيد
        { wch: 30 }, // الحساب الأب
        { wch: 10 }  // الحالة
      ];
      worksheet['!cols'] = columnWidths;

      // إنشاء مصنف جديد
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "شجرة الحسابات");

      // تصدير الملف
      const fileName = `شجرة_الحسابات_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);

      toast({
        title: "نجح",
        description: "تم تصدير شجرة الحسابات إلى Excel بنجاح"
      });
    } catch (error: any) {
      console.error("Error exporting to Excel:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تصدير البيانات إلى Excel",
        variant: "destructive"
      });
    }
  };

  const handleDownloadFullTree = async () => {
    try {
      toast({
        title: "جاري التحميل",
        description: "جاري تحضير شجرة الحسابات الكاملة..."
      });

      // الحصول على عنصر شجرة الحسابات
      const treeElement = document.getElementById("accounts-tree-container");
      if (!treeElement) {
        toast({
          title: "خطأ",
          description: "لم يتم العثور على شجرة الحسابات",
          variant: "destructive"
        });
        return;
      }

      // توسيع جميع الحسابات أولاً لعرض الشجرة كاملة
      const allAccountIds = new Set<number>();
      const collectAllIds = (accounts: Account[]) => {
        accounts.forEach((account) => {
          allAccountIds.add(account.id);
          if (account.children && account.children.length > 0) {
            collectAllIds(account.children);
          }
        });
      };
      
      const currentFilteredAccounts = Array.isArray(accountsData?.data?.tree) 
        ? accountsData.data.tree 
        : Array.isArray(accountsData?.data) && accountsData.data.length > 0 && accountsData.data[0]?.children
        ? accountsData.data
        : [];
      
      collectAllIds(currentFilteredAccounts);
      setExpandedAccounts(allAccountIds);

      // انتظار قليل لضمان توسيع جميع الحسابات
      await new Promise(resolve => setTimeout(resolve, 500));

      // التقاط صورة للشجرة
      const canvas = await html2canvas(treeElement, {
        useCORS: true,
        logging: false,
        background: "#ffffff",
      });

      // إنشاء PDF
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 297; // عرض A4 بالعرض
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // إضافة الصورة الأولى
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= 210; // ارتفاع صفحة A4

      // إضافة صفحات إضافية إذا كانت الصورة أطول من صفحة واحدة
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= 210;
      }

      // حفظ الملف
      const fileName = `شجرة_الحسابات_الكاملة_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

      toast({
        title: "نجح",
        description: "تم تحميل شجرة الحسابات الكاملة بنجاح"
      });
    } catch (error: any) {
      console.error("Error downloading full tree:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحميل شجرة الحسابات",
        variant: "destructive"
      });
    }
  };

  const handleCreateFullTree = async () => {
    if (!confirm("هل أنت متأكد من إنشاء شجرة الحسابات الكاملة؟ سيتم إنشاء جميع الحسابات الأساسية.")) {
      return;
    }

    try {
      toast({
        title: "جاري الإنشاء",
        description: "جاري إنشاء شجرة الحسابات الكاملة..."
      });

      // تعريف شجرة الحسابات الكاملة (حسب الصورة المرفقة)
      const fullTreeStructure = [
        // الأصول (1)
        {
          name: "الأصول",
          type: "asset" as const,
          category: "الأصول",
          accountLevel: "main" as const,
          children: [
            {
              name: "أصول غير متداولة",
              type: "asset" as const,
              category: "أصول غير متداولة",
              accountLevel: "sub-main" as const,
              children: [
                { name: "أراضي", type: "asset" as const, category: "أصول غير متداولة", accountLevel: "sub" as const },
                { name: "مباني", type: "asset" as const, category: "أصول غير متداولة", accountLevel: "sub" as const },
                {
                  name: "أجهزة الجيم",
                  type: "asset" as const,
                  category: "أصول غير متداولة",
                  accountLevel: "sub-main" as const,
                  children: [
                    { name: "أجهزة كارديو", type: "asset" as const, category: "أجهزة الجيم", accountLevel: "sub" as const },
                    { name: "أجهزة حديد", type: "asset" as const, category: "أجهزة الجيم", accountLevel: "sub" as const },
                  ]
                },
                { name: "أثاث", type: "asset" as const, category: "أصول غير متداولة", accountLevel: "sub" as const },
                { name: "سيارات", type: "asset" as const, category: "أصول غير متداولة", accountLevel: "sub" as const },
                { name: "تحسينات على المكان", type: "asset" as const, category: "أصول غير متداولة", accountLevel: "sub" as const },
                {
                  name: "مجمع الإهلاك",
                  type: "asset" as const,
                  category: "الإهلاك",
                  accountLevel: "sub-main" as const,
                  children: [
                    { name: "مجمع الإهلاك المباني", type: "asset" as const, category: "الإهلاك", accountLevel: "sub" as const },
                    {
                      name: "مجمع الإهلاك أجهزة الجيم",
                      type: "asset" as const,
                      category: "الإهلاك",
                      accountLevel: "sub-main" as const,
                      children: [
                        { name: "مجمع الإهلاك أجهزة الكارديو", type: "asset" as const, category: "الإهلاك", accountLevel: "sub" as const },
                        { name: "مجمع الإهلاك الأجهزة الحديد", type: "asset" as const, category: "الإهلاك", accountLevel: "sub" as const },
                      ]
                    },
                    { name: "مجمع الإهلاك الأثاث", type: "asset" as const, category: "الإهلاك", accountLevel: "sub" as const },
                    { name: "مجمع الإهلاك السيارات", type: "asset" as const, category: "الإهلاك", accountLevel: "sub" as const },
                    { name: "مجمع الإهلاك تحسينات الأماكن", type: "asset" as const, category: "الإهلاك", accountLevel: "sub" as const },
                  ]
                },
              ]
            },
            {
              name: "أصول متداولة",
              type: "asset" as const,
              category: "أصول متداولة",
              accountLevel: "sub-main" as const,
              children: [
                { name: "صندوق", type: "asset" as const, category: "النقدية", accountLevel: "sub" as const },
                { name: "بنك", type: "asset" as const, category: "البنوك", accountLevel: "sub" as const },
                { name: "عملاء", type: "asset" as const, category: "الذمم المدينة", accountLevel: "sub" as const },
                { name: "أوراق القبض", type: "asset" as const, category: "الأوراق المالية", accountLevel: "sub" as const },
                { name: "مدينون", type: "asset" as const, category: "الذمم المدينة", accountLevel: "sub" as const },
                { name: "شيكات تحت التحصيل", type: "asset" as const, category: "الشيكات", accountLevel: "sub" as const },
                { name: "مخزون", type: "asset" as const, category: "المخزون", accountLevel: "sub" as const },
                { name: "مصروفات مقدمة", type: "asset" as const, category: "المصروفات المقدمة", accountLevel: "sub" as const },
                { name: "تأمينات", type: "asset" as const, category: "التأمين", accountLevel: "sub" as const },
                { name: "ضرائب محتجزة لدي الغير", type: "asset" as const, category: "الضرائب", accountLevel: "sub" as const },
              ]
            },
            {
              name: "أصول ثابتة",
              type: "asset" as const,
              category: "أصول ثابتة",
              accountLevel: "sub-main" as const,
              children: [
                { name: "سيارات", type: "asset" as const, category: "أصول ثابتة", accountLevel: "sub" as const },
                { name: "معدات", type: "asset" as const, category: "أصول ثابتة", accountLevel: "sub" as const },
                { name: "مجمع إهلاك السيارات", type: "asset" as const, category: "الإهلاك", accountLevel: "sub" as const },
                { name: "مجمع إهلاك المعدات", type: "asset" as const, category: "الإهلاك", accountLevel: "sub" as const },
              ]
            },
            {
              name: "أصول غير ملموسة",
              type: "asset" as const,
              category: "أصول غير ملموسة",
              accountLevel: "sub-main" as const,
              children: [
                { name: "شهرة محل", type: "asset" as const, category: "أصول غير ملموسة", accountLevel: "sub" as const },
                { name: "براءات اختراع", type: "asset" as const, category: "أصول غير ملموسة", accountLevel: "sub" as const },
              ]
            }
          ]
        },
        // الخصوم (2)
        {
          name: "الخصوم",
          type: "liability" as const,
          category: "الخصوم",
          accountLevel: "main" as const,
          children: [
            {
              name: "التزامات متداولة",
              type: "liability" as const,
              category: "التزامات متداولة",
              accountLevel: "sub-main" as const,
              children: [
                { name: "موردون", type: "liability" as const, category: "الذمم الدائنة", accountLevel: "sub" as const },
                { name: "أوراق الدفع", type: "liability" as const, category: "أوراق الدفع", accountLevel: "sub" as const },
                { name: "مصروفات مستحقة", type: "liability" as const, category: "المصروفات المستحقة", accountLevel: "sub" as const },
                { name: "رواتب مستحقة", type: "liability" as const, category: "المرتبات", accountLevel: "sub" as const },
                { name: "ضرائب مستحقة", type: "liability" as const, category: "الضرائب", accountLevel: "sub" as const },
                { name: "اشتراكات محصلة مقدماً", type: "liability" as const, category: "الإيرادات المستحقة", accountLevel: "sub" as const },
                { name: "الإيرادات المستحقة", type: "liability" as const, category: "الإيرادات المستحقة", accountLevel: "sub" as const },
              ]
            },
            {
              name: "التزامات غير متداولة",
              type: "liability" as const,
              category: "التزامات غير متداولة",
              accountLevel: "sub-main" as const,
              children: [
                { name: "قروض طويلة الأجل", type: "liability" as const, category: "القروض", accountLevel: "sub" as const },
              ]
            }
          ]
        },
        // حقوق الملكية (3)
        {
          name: "حقوق الملكية",
          type: "equity" as const,
          category: "حقوق الملكية",
          accountLevel: "main" as const,
          children: [
            { name: "رأس المال", type: "equity" as const, category: "رأس المال", accountLevel: "sub-main" as const },
            { name: "الأرباح المحتجزة", type: "equity" as const, category: "الأرباح", accountLevel: "sub-main" as const },
            { name: "الأرباح الحالية", type: "equity" as const, category: "الأرباح", accountLevel: "sub-main" as const },
            { name: "الاحتياطيات", type: "equity" as const, category: "الاحتياطيات", accountLevel: "sub-main" as const },
          ]
        },
        // الإيرادات (4)
        {
          name: "الإيرادات",
          type: "revenue" as const,
          category: "الإيرادات",
          accountLevel: "main" as const,
          children: [
            {
              name: "إيرادات التشغيل",
              type: "revenue" as const,
              category: "إيرادات التشغيل",
              accountLevel: "sub-main" as const,
              children: [
                { name: "إيرادات المبيعات", type: "revenue" as const, category: "المبيعات", accountLevel: "sub" as const },
                { name: "إيرادات الخدمات", type: "revenue" as const, category: "الخدمات", accountLevel: "sub" as const },
                { name: "إيرادات الاشتراكات", type: "revenue" as const, category: "الاشتراكات", accountLevel: "sub" as const },
                {
                  name: "إيرادات تدريب",
                  type: "revenue" as const,
                  category: "إيرادات تدريب",
                  accountLevel: "sub-main" as const,
                  children: [
                    { name: "تدريب شخصي", type: "revenue" as const, category: "تدريب شخصي", accountLevel: "sub" as const },
                    { name: "تدريب جماعي", type: "revenue" as const, category: "تدريب جماعي", accountLevel: "sub" as const },
                    { name: "تدريب أونلاين", type: "revenue" as const, category: "تدريب أونلاين", accountLevel: "sub" as const },
                  ]
                },
                {
                  name: "إيرادات خدمات إضافية",
                  type: "revenue" as const,
                  category: "إيرادات خدمات إضافية",
                  accountLevel: "sub-main" as const,
                  children: [
                    { name: "حصص خاصة", type: "revenue" as const, category: "حصص خاصة", accountLevel: "sub" as const },
                    { name: "تقييم لياقة", type: "revenue" as const, category: "تقييم لياقة", accountLevel: "sub" as const },
                    { name: "استخدام مرافق خاصة", type: "revenue" as const, category: "مرافق خاصة", accountLevel: "sub" as const },
                  ]
                },
                {
                  name: "إيرادات مبيعات",
                  type: "revenue" as const,
                  category: "إيرادات مبيعات",
                  accountLevel: "sub-main" as const,
                  children: [
                    {
                      name: "مبيعات مكملات غذائية",
                      type: "revenue" as const,
                      category: "مكملات غذائية",
                      accountLevel: "sub-main" as const,
                      children: [
                        { name: "بروتينات", type: "revenue" as const, category: "بروتينات", accountLevel: "sub" as const },
                        { name: "فيتامينات", type: "revenue" as const, category: "فيتامينات", accountLevel: "sub" as const },
                        { name: "منتجات طاقة", type: "revenue" as const, category: "منتجات طاقة", accountLevel: "sub" as const },
                      ]
                    },
                    {
                      name: "مبيعات ملابس رياضية",
                      type: "revenue" as const,
                      category: "ملابس رياضية",
                      accountLevel: "sub-main" as const,
                      children: [
                        { name: "تيشيرتات", type: "revenue" as const, category: "تيشيرتات", accountLevel: "sub" as const },
                      ]
                    },
                  ]
                },
                { name: "إيرادات أخرى", type: "revenue" as const, category: "إيرادات أخرى", accountLevel: "sub" as const },
              ]
            },
            {
              name: "إيرادات غير التشغيل",
              type: "revenue" as const,
              category: "إيرادات غير التشغيل",
              accountLevel: "sub-main" as const,
              children: [
                { name: "إيرادات الفوائد", type: "revenue" as const, category: "الفوائد", accountLevel: "sub" as const },
                { name: "إيرادات الاستثمارات", type: "revenue" as const, category: "الاستثمارات", accountLevel: "sub" as const },
              ]
            }
          ]
        },
        // المصروفات (5)
        {
          name: "المصروفات",
          type: "expense" as const,
          category: "المصروفات",
          accountLevel: "main" as const,
          children: [
            {
              name: "مصروفات التشغيل",
              type: "expense" as const,
              category: "مصروفات التشغيل",
              accountLevel: "sub-main" as const,
              children: [
                { name: "تكلفة المبيعات", type: "expense" as const, category: "تكلفة المبيعات", accountLevel: "sub" as const },
                {
                  name: "مصروفات المكان",
                  type: "expense" as const,
                  category: "مصروفات المكان",
                  accountLevel: "sub-main" as const,
                  children: [
                    { name: "إيجار", type: "expense" as const, category: "الإيجار", accountLevel: "sub" as const },
                    { name: "صيانة عامة", type: "expense" as const, category: "الصيانة", accountLevel: "sub" as const },
                    { name: "كهرباء ومياه", type: "expense" as const, category: "المرافق", accountLevel: "sub" as const },
                    { name: "نظافة", type: "expense" as const, category: "النظافة", accountLevel: "sub" as const },
                  ]
                },
                {
                  name: "مصروفات الأجهزة",
                  type: "expense" as const,
                  category: "مصروفات الأجهزة",
                  accountLevel: "sub-main" as const,
                  children: [
                    { name: "صيانة أجهزة كارديو", type: "expense" as const, category: "صيانة الأجهزة", accountLevel: "sub" as const },
                    { name: "صيانة أجهزة حديد", type: "expense" as const, category: "صيانة الأجهزة", accountLevel: "sub" as const },
                    { name: "قطع غيار", type: "expense" as const, category: "قطع غيار", accountLevel: "sub" as const },
                  ]
                },
                {
                  name: "مصروفات رواتب وأجور",
                  type: "expense" as const,
                  category: "المرتبات",
                  accountLevel: "sub-main" as const,
                  children: [
                    { name: "رواتب", type: "expense" as const, category: "المرتبات", accountLevel: "sub" as const },
                    { name: "رواتب مدربين", type: "expense" as const, category: "المرتبات", accountLevel: "sub" as const },
                    { name: "رواتب إداريين", type: "expense" as const, category: "المرتبات", accountLevel: "sub" as const },
                    { name: "رواتب عمال", type: "expense" as const, category: "المرتبات", accountLevel: "sub" as const },
                    {
                      name: "حوافز وعمولات",
                      type: "expense" as const,
                      category: "الحوافز",
                      accountLevel: "sub-main" as const,
                      children: [
                        { name: "عمولات تدريب شخصي", type: "expense" as const, category: "العمولات", accountLevel: "sub" as const },
                        { name: "حوافز مبيعات", type: "expense" as const, category: "الحوافز", accountLevel: "sub" as const },
                      ]
                    },
                  ]
                },
                {
                  name: "مصروفات تسويق ومبيعات",
                  type: "expense" as const,
                  category: "التسويق",
                  accountLevel: "sub-main" as const,
                  children: [
                    { name: "تسويق", type: "expense" as const, category: "التسويق", accountLevel: "sub" as const },
                    { name: "إعلانات سوشيال ميديا", type: "expense" as const, category: "الإعلان", accountLevel: "sub" as const },
                    { name: "تصميم وطباعة", type: "expense" as const, category: "التصميم", accountLevel: "sub" as const },
                    { name: "عروض وخصومات", type: "expense" as const, category: "العروض", accountLevel: "sub" as const },
                  ]
                },
                { name: "التأمين", type: "expense" as const, category: "التأمين", accountLevel: "sub" as const },
                { name: "الاتصالات", type: "expense" as const, category: "الاتصالات", accountLevel: "sub" as const },
                { name: "النقل", type: "expense" as const, category: "النقل", accountLevel: "sub" as const },
                { name: "القرطاسية", type: "expense" as const, category: "القرطاسية", accountLevel: "sub" as const },
              ]
            },
            {
              name: "مصروفات الإدارة",
              type: "expense" as const,
              category: "مصروفات الإدارة",
              accountLevel: "sub-main" as const,
              children: [
                { name: "رواتب الإدارة", type: "expense" as const, category: "المرتبات", accountLevel: "sub" as const },
                { name: "مصروفات المكتب", type: "expense" as const, category: "مصروفات المكتب", accountLevel: "sub" as const },
                { name: "استشارات قانونية", type: "expense" as const, category: "الاستشارات", accountLevel: "sub" as const },
              ]
            },
            {
              name: "مصروفات إدارية وعمومية",
              type: "expense" as const,
              category: "مصروفات إدارية",
              accountLevel: "sub-main" as const,
              children: [
                {
                  name: "مصروفات إدارية",
                  type: "expense" as const,
                  category: "مصروفات إدارية",
                  accountLevel: "sub-main" as const,
                  children: [
                    { name: "مستلزمات مكتبية", type: "expense" as const, category: "مستلزمات مكتبية", accountLevel: "sub" as const },
                    { name: "إنترنت واتصالات", type: "expense" as const, category: "الاتصالات", accountLevel: "sub" as const },
                    { name: "مصروفات قانونية", type: "expense" as const, category: "المصروفات القانونية", accountLevel: "sub" as const },
                  ]
                },
              ]
            },
            {
              name: "مصروفات مالية وضريبية",
              type: "expense" as const,
              category: "مصروفات مالية",
              accountLevel: "sub-main" as const,
              children: [
                {
                  name: "مصروفات بنكية",
                  type: "expense" as const,
                  category: "مصروفات بنكية",
                  accountLevel: "sub-main" as const,
                  children: [
                    { name: "عمولات بنكية", type: "expense" as const, category: "العمولات", accountLevel: "sub" as const },
                    { name: "مصروفات تحويل", type: "expense" as const, category: "مصروفات تحويل", accountLevel: "sub" as const },
                  ]
                },
                { name: "فوائد القروض", type: "expense" as const, category: "الفوائد", accountLevel: "sub" as const },
                { name: "مصروفات أخرى", type: "expense" as const, category: "مصروفات أخرى", accountLevel: "sub" as const },
              ]
            },
            {
              name: "مصروفات الإهلاك",
              type: "expense" as const,
              category: "الإهلاك",
              accountLevel: "sub-main" as const,
              children: [
                { name: "مصروف إهلاك المباني", type: "expense" as const, category: "الإهلاك", accountLevel: "sub" as const },
                { name: "مصروف إهلاك أجهزة الجيم", type: "expense" as const, category: "الإهلاك", accountLevel: "sub" as const },
                { name: "مصروف إهلاك أجهزة كارديو", type: "expense" as const, category: "الإهلاك", accountLevel: "sub" as const },
                { name: "مصروف إهلاك أجهزة حديد", type: "expense" as const, category: "الإهلاك", accountLevel: "sub" as const },
                { name: "مصروف إهلاك الأثاث", type: "expense" as const, category: "الإهلاك", accountLevel: "sub" as const },
                { name: "مصروف إهلاك السيارات", type: "expense" as const, category: "الإهلاك", accountLevel: "sub" as const },
                { name: "مصروف إهلاك تحسينات المكان", type: "expense" as const, category: "الإهلاك", accountLevel: "sub" as const },
              ]
            },
            {
              name: "مصروفات ضرائب",
              type: "expense" as const,
              category: "الضرائب",
              accountLevel: "sub-main" as const,
              children: [
                { name: "مصروف ضريبة الدخل", type: "expense" as const, category: "الضرائب", accountLevel: "sub" as const },
                { name: "مصروف ضرائب أخرى", type: "expense" as const, category: "الضرائب", accountLevel: "sub" as const },
              ]
            },
            {
              name: "خسائر أصول",
              type: "expense" as const,
              category: "خسائر أصول",
              accountLevel: "sub-main" as const,
            },
            {
              name: "فروق عملة",
              type: "expense" as const,
              category: "فروق عملة",
              accountLevel: "sub-main" as const,
            },
            {
              name: "مصروفات غير متكررة",
              type: "expense" as const,
              category: "مصروفات غير متكررة",
              accountLevel: "sub-main" as const,
            }
          ]
        }
      ];

      // دالة لحساب عدد الحسابات
      const countAccounts = (accountData: any): number => {
        let count = 1; // الحساب نفسه
        if (accountData.children && accountData.children.length > 0) {
          accountData.children.forEach((child: any) => {
            count += countAccounts(child);
          });
        }
        return count;
      };

      // حساب العدد الإجمالي
      let totalAccountsCount = 0;
      fullTreeStructure.forEach((account) => {
        totalAccountsCount += countAccounts(account);
      });

      // دالة مساعدة لإنشاء الحسابات بشكل متسلسل
      const createAccountRecursively = async (accountData: any, parentId?: number, createdCount?: { value: number }): Promise<void> => {
        const accountToCreate: any = {
          name: accountData.name,
          type: accountData.type,
          category: accountData.category,
          accountLevel: accountData.accountLevel,
          description: accountData.description || "",
        };

        if (parentId && accountData.accountLevel !== "main") {
          accountToCreate.parentId = parentId;
        }

        try {
          const result = await createAccount(accountToCreate).unwrap();
          const createdAccountId = result?.data?.id || result?.id;
          
          if (createdCount) {
            createdCount.value++;
          }

          // إنشاء الحسابات الفرعية إذا وجدت
          if (accountData.children && accountData.children.length > 0 && createdAccountId) {
            for (const child of accountData.children) {
              await createAccountRecursively(child, createdAccountId, createdCount);
              // تأخير بسيط لتجنب مشاكل الخادم
              await new Promise(resolve => setTimeout(resolve, 100));
            }
          }
        } catch (error: any) {
          // تجاهل الأخطاء إذا كان الحساب موجوداً بالفعل
          if (error?.data?.message?.includes("موجود") || error?.data?.message?.includes("exists") || error?.data?.message?.includes("duplicate")) {
            // الحساب موجود بالفعل، نعتبره منشأ
            if (createdCount) {
              createdCount.value++;
            }
            // محاولة الحصول على ID الحساب الموجود للاستمرار في إنشاء الحسابات الفرعية
            try {
              const currentFilteredAccounts = Array.isArray(accountsData?.data?.tree) 
                ? accountsData.data.tree 
                : Array.isArray(accountsData?.data) && accountsData.data.length > 0 && accountsData.data[0]?.children
                ? accountsData.data
                : [];
              const existingAccounts = getAllAccountsFlat(currentFilteredAccounts);
              const existingAccount = existingAccounts.find(
                (acc: Account) => acc.name === accountData.name && acc.type === accountData.type
              );
              if (existingAccount && accountData.children && accountData.children.length > 0) {
                for (const child of accountData.children) {
                  await createAccountRecursively(child, existingAccount.id, createdCount);
                  await new Promise(resolve => setTimeout(resolve, 100));
                }
              }
            } catch (e) {
              // تجاهل الأخطاء
            }
          } else {
            console.error(`Error creating account ${accountData.name}:`, error);
          }
        }
      };

      // إنشاء جميع الحسابات
      const createdCount = { value: 0 };
      for (const mainAccount of fullTreeStructure) {
        await createAccountRecursively(mainAccount, undefined, createdCount);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      toast({
        title: "نجح",
        description: `تم إنشاء شجرة الحسابات الكاملة بنجاح (${createdCount.value} حساب من أصل ${totalAccountsCount} حساب متوقع)`
      });

      // إعادة تحميل البيانات
      refetch();
    } catch (error: any) {
      console.error("Error creating full tree:", error);
      toast({
        title: "خطأ",
        description: error?.data?.message || "حدث خطأ أثناء إنشاء شجرة الحسابات",
        variant: "destructive"
      });
    }
  };

  const handleImportExcel = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // التحقق من نوع الملف
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      toast({
        title: "خطأ في نوع الملف",
        description: "يرجى اختيار ملف Excel (.xlsx أو .xls)",
        variant: "destructive",
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    setIsImporting(true);
    toast({
      title: "جاري الاستيراد",
      description: "جاري قراءة ملف Excel وإنشاء الحسابات..."
    });

    try {
      // قراءة ملف Excel
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

          // تخطي الصف الأول (العناوين)
          const headers = jsonData[0] || [];
          const dataRows = jsonData.slice(1);

          // البحث عن أعمدة البيانات
          const nameIndex = headers.findIndex((h: any) => 
            String(h).toLowerCase().includes('اسم') || 
            String(h).toLowerCase().includes('name')
          );
          const typeIndex = headers.findIndex((h: any) => 
            String(h).toLowerCase().includes('نوع') || 
            String(h).toLowerCase().includes('type')
          );
          const categoryIndex = headers.findIndex((h: any) => 
            String(h).toLowerCase().includes('تصنيف') || 
            String(h).toLowerCase().includes('category')
          );
          const levelIndex = headers.findIndex((h: any) => 
            String(h).toLowerCase().includes('مستوى') || 
            String(h).toLowerCase().includes('level')
          );
          const parentIndex = headers.findIndex((h: any) => 
            String(h).toLowerCase().includes('أب') || 
            String(h).toLowerCase().includes('parent')
          );
          const descriptionIndex = headers.findIndex((h: any) => 
            String(h).toLowerCase().includes('وصف') || 
            String(h).toLowerCase().includes('description')
          );

          if (nameIndex === -1) {
            throw new Error("لم يتم العثور على عمود اسم الحساب");
          }

          // خريطة لتخزين الحسابات المنشأة
          const createdAccountsMap = new Map<string, number>();
          const accountsToCreate: any[] = [];

          // معالجة البيانات وإنشاء قائمة الحسابات
          for (let i = 0; i < dataRows.length; i++) {
            const row = dataRows[i];
            if (!row || !row[nameIndex]) continue;

            const accountName = String(row[nameIndex]).trim();
            if (!accountName) continue;

            const accountType = row[typeIndex] 
              ? String(row[typeIndex]).trim().toLowerCase() 
              : 'asset';
            
            // تحويل نوع الحساب
            let mappedType: Account["type"] = "asset";
            if (accountType.includes('أصول') || accountType.includes('asset')) {
              mappedType = "asset";
            } else if (accountType.includes('خصوم') || accountType.includes('liability')) {
              mappedType = "liability";
            } else if (accountType.includes('ملكية') || accountType.includes('equity')) {
              mappedType = "equity";
            } else if (accountType.includes('إيراد') || accountType.includes('revenue')) {
              mappedType = "revenue";
            } else if (accountType.includes('مصروف') || accountType.includes('expense')) {
              mappedType = "expense";
            }

            const category = row[categoryIndex] ? String(row[categoryIndex]).trim() : "";
            const level = row[levelIndex] 
              ? String(row[levelIndex]).trim().toLowerCase() 
              : 'main';
            
            // تحويل مستوى الحساب
            let mappedLevel: Account["accountLevel"] = "main";
            if (level.includes('رئيسي') || level.includes('main')) {
              mappedLevel = "main";
            } else if (level.includes('فرعي') || level.includes('sub-main')) {
              mappedLevel = "sub-main";
            } else if (level.includes('sub')) {
              mappedLevel = "sub";
            }

            const parentName = row[parentIndex] ? String(row[parentIndex]).trim() : "";
            const description = row[descriptionIndex] ? String(row[descriptionIndex]).trim() : "";

            accountsToCreate.push({
              name: accountName,
              type: mappedType,
              category: category,
              accountLevel: mappedLevel,
              parentName: parentName,
              description: description,
              rowIndex: i
            });
          }

          // فرز الحسابات حسب المستوى (رئيسي أولاً، ثم فرعي، ثم فرعي فرعي)
          accountsToCreate.sort((a, b) => {
            const levelOrder: Record<string, number> = { main: 0, "sub-main": 1, sub: 2 };
            return (levelOrder[a.accountLevel] || 0) - (levelOrder[b.accountLevel] || 0);
          });

          // إنشاء الحسابات
          let successCount = 0;
          let errorCount = 0;

          for (const accountData of accountsToCreate) {
            try {
              const accountToCreate: any = {
                name: accountData.name,
                type: accountData.type,
                category: accountData.category,
                accountLevel: accountData.accountLevel,
                description: accountData.description,
              };

              // الحسابات الفرعية تحتاج إلى parentId
              if (accountData.accountLevel !== "main") {
                let parentId: number | undefined;
                
                // البحث عن الحساب الأب من الاسم المحدد
                if (accountData.parentName) {
                  parentId = createdAccountsMap.get(accountData.parentName);
                  
                  // إذا لم يتم العثور عليه في الحسابات الجديدة، ابحث في الحسابات الموجودة
                  if (!parentId) {
                    const currentFilteredAccounts = Array.isArray(accountsData?.data?.tree) 
                      ? accountsData.data.tree 
                      : Array.isArray(accountsData?.data) && accountsData.data.length > 0 && accountsData.data[0]?.children
                      ? accountsData.data
                      : [];
                    const existingAccounts = getAllAccountsFlat(currentFilteredAccounts);
                    const parentAccount = existingAccounts.find(
                      (acc: Account) => acc.name === accountData.parentName
                    );
                    if (parentAccount) {
                      parentId = parentAccount.id;
                    }
                  }
                }
                
                // إذا لم يتم العثور على parentId، حاول البحث تلقائياً بناءً على المستوى
                if (!parentId) {
                  const currentFilteredAccounts = Array.isArray(accountsData?.data?.tree) 
                    ? accountsData.data.tree 
                    : Array.isArray(accountsData?.data) && accountsData.data.length > 0 && accountsData.data[0]?.children
                    ? accountsData.data
                    : [];
                  const existingAccounts = getAllAccountsFlat(currentFilteredAccounts);
                  
                  if (accountData.accountLevel === "sub-main") {
                    // ابحث عن الحساب الرئيسي من نفس النوع
                    const mainAccount = existingAccounts.find(
                      (acc: Account) => acc.accountLevel === "main" && acc.type === accountData.type
                    );
                    if (mainAccount) {
                      parentId = mainAccount.id;
                    }
                  } else if (accountData.accountLevel === "sub") {
                    // ابحث عن الحساب الفرعي الرئيسي من نفس النوع
                    const subMainAccount = existingAccounts.find(
                      (acc: Account) => acc.accountLevel === "sub-main" && acc.type === accountData.type
                    );
                    if (subMainAccount) {
                      parentId = subMainAccount.id;
                    }
                  }
                }
                
                // إذا لم يتم العثور على parentId بعد كل المحاولات، تخطى الحساب
                if (!parentId) {
                  console.warn(`Skipping account ${accountData.name}: Parent not found. Please ensure parent account exists or specify parent name in Excel.`);
                  errorCount++;
                  continue;
                }
                
                accountToCreate.parentId = parentId;
              }

              const result = await createAccount(accountToCreate).unwrap();
              const createdAccountId = result?.data?.id || result?.id;
              
              if (createdAccountId) {
                createdAccountsMap.set(accountData.name, createdAccountId);
                successCount++;
              }

              // تأخير بسيط لتجنب إرهاق الخادم
              await new Promise(resolve => setTimeout(resolve, 100));
            } catch (error: any) {
              // تجاهل الأخطاء إذا كان الحساب موجوداً بالفعل
              if (!error?.data?.message?.includes("موجود") && 
                  !error?.data?.message?.includes("exists") &&
                  !error?.data?.message?.includes("duplicate")) {
                errorCount++;
                console.error(`Error creating account ${accountData.name}:`, error?.data?.message || error?.message || error);
              } else {
                successCount++; // نعتبره نجاح إذا كان موجوداً
              }
            }
          }

          if (errorCount > 0) {
            toast({
              title: "تم الاستيراد مع بعض الأخطاء",
              description: `تم إنشاء ${successCount} حساب بنجاح، ${errorCount} حساب فشل في الإنشاء. تأكد من أن الحسابات الفرعية تحتوي على اسم الحساب الأب في عمود "الحساب الأب"`,
              variant: errorCount > successCount ? "destructive" : "default"
            });
          } else {
            toast({
              title: "تم الاستيراد بنجاح",
              description: `تم إنشاء ${successCount} حساب بنجاح`
            });
          }

          // إعادة تحميل البيانات
          refetch();
        } catch (error: any) {
          console.error("Error processing Excel file:", error);
          toast({
            title: "خطأ في الاستيراد",
            description: error?.message || "حدث خطأ أثناء معالجة ملف Excel",
            variant: "destructive"
          });
        } finally {
          setIsImporting(false);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
      };

      reader.onerror = () => {
        toast({
          title: "خطأ في القراءة",
          description: "حدث خطأ أثناء قراءة ملف Excel",
          variant: "destructive"
        });
        setIsImporting(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      };

      reader.readAsBinaryString(file);
    } catch (error: any) {
      console.error("Error reading file:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء قراءة الملف",
        variant: "destructive"
      });
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const renderAccount = (account: Account, level: number = 0) => {
    const hasChildren = account.children && account.children.length > 0;
    const isExpanded = expandedAccounts.has(account.id);
    const typeInfo = getAccountTypeInfo(account.type);
    const levelInfo = getAccountLevelInfo(account.accountLevel);
    const Icon = typeInfo.icon;

    return (
      <div key={account.id}>
        <div
          className={`flex items-center gap-2 p-3 hover:bg-gray-50 border-b transition-colors ${level > 0 ? "bg-gray-50/50" : ""}`}
          style={{ paddingRight: `${level * 2 + 0.5}rem` }}
        >
          {hasChildren && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleExpand(account.id)}
              className="w-6 h-6 p-0"
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Button>
          )}
          {!hasChildren && <div className="w-6" />}
          <Icon className={`w-5 h-5 ${typeInfo.color}`} />
          <span className="font-medium w-20">{account.code}</span>
          <span className="flex-1 font-medium">{account.name}</span>
          <Badge variant={getAccountLevelBadgeVariant(account.accountLevel)} className="w-32 text-xs">
            {levelInfo.label}
          </Badge>
          <Badge variant={account.type === "asset" || account.type === "expense" ? "default" : "secondary"} className="w-24 text-xs">
            {typeInfo.label}
          </Badge>
          <span className="font-semibold w-32 text-left">{parseFloat(account.balance?.toString() || "0").toLocaleString()} ج.م</span>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleAddAccount(account.id)}
              title="إضافة حساب فرعي"
              className="h-7 w-7 p-0"
            >
              <Plus className="w-3.5 h-3.5 text-blue-600" />
            </Button>
            <Button variant="ghost" size="sm" title="تعديل" className="h-7 w-7 p-0" onClick={() => handleEditAccount(account)}>
              <Edit className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="sm" title="حذف" className="h-7 w-7 p-0" onClick={() => handleDelete(account)}>
              <Trash2 className="w-3.5 h-3.5 text-red-500" />
            </Button>
          </div>
        </div>
        {hasChildren && isExpanded && account.children?.map(child => renderAccount(child, level + 1))}
      </div>
    );
  };

  const filteredAccounts = Array.isArray(accountsData?.data?.tree) 
    ? accountsData.data.tree 
    : Array.isArray(accountsData?.data) && accountsData.data.length > 0 && accountsData.data[0]?.children
    ? accountsData.data
    : [];
  const allAccountsFlat = getAllAccountsFlat(filteredAccounts);

  const parentOptions = Array.isArray(accounts) ? accounts.filter(acc => 
    acc.accountLevel !== "sub" || !selectedParentId
  ) : [];

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
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <FolderTree className="w-8 h-8 text-indigo-600" />
              شجرة الحسابات
            </h1>
            <p className="text-gray-600 mt-1">إدارة الحسابات المحاسبية وتصنيفها الهرمي</p>
          </div>
          <div className="flex gap-3">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="البحث عن حساب..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            {/* <Button 
              variant="outline" 
              onClick={handleExportToExcel}
              className="border-green-600 text-green-600 hover:bg-green-50"
            >
              <Download className="w-5 h-5 ml-2" />
              تصدير Excel
            </Button>
            <Button 
              variant="outline" 
              onClick={handleDownloadFullTree}
              className="border-purple-600 text-purple-600 hover:bg-purple-50"
            >
              <FileDown className="w-5 h-5 ml-2" />
              تحميل الشجرة الكاملة
            </Button> */}
            <Button 
              variant="outline" 
              onClick={handleCreateFullTree}
              className="border-indigo-600 text-indigo-600 hover:bg-indigo-50"
            >
              <Sparkles className="w-5 h-5 ml-2" />
              إنشاء شجرة الحسابات الكاملة
            </Button>
            <Button 
              variant="outline" 
              onClick={handleImportExcel}
              disabled={isImporting}
              className="border-orange-600 text-orange-600 hover:bg-orange-50"
            >
              {isImporting ? (
                <Loader2 className="w-5 h-5 ml-2 animate-spin" />
              ) : (
                <Upload className="w-5 h-5 ml-2" />
              )}
              استيراد من Excel
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => handleAddAccount()}>
              <Plus className="w-5 h-5 ml-2" />
              إضافة حساب رئيسي
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>شجرة الحسابات</span>
              <Badge variant="outline" className="text-lg px-3 py-1">
                {allAccountsFlat.length} حساب
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div id="accounts-tree-container" className="border rounded-lg overflow-hidden bg-white">
              <div className="bg-gray-50 border-b p-3 grid grid-cols-12 gap-2 font-semibold text-sm">
                <div className="col-span-1">#</div>
                <div className="col-span-1">رمز</div>
                <div className="col-span-3">اسم الحساب</div>
                <div className="col-span-2">المستوى</div>
                <div className="col-span-2">النوع</div>
                <div className="col-span-2">الرصيد</div>
                <div className="col-span-1">الإجراءات</div>
              </div>
              <div className="max-h-[600px] overflow-y-auto">
                {filteredAccounts
                  .filter((account: Account) => 
                    !searchQuery || 
                    account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    account.code.includes(searchQuery)
                  )
                  .map((account: Account) => renderAccount(account))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Dialog open={isAddDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          setIsEditDialogOpen(open);
          if (!open) {
            setSelectedParentId(null);
            setSelectedAccount(null);
          }
        }}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{isEditDialogOpen ? "تعديل حساب" : "إضافة حساب جديد"}</DialogTitle>
              <DialogDescription>
                {selectedParentId 
                  ? "أدخل بيانات الحساب الفرعي الجديد" 
                  : "أدخل بيانات الحساب الرئيسي الجديد"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>رمز الحساب *</Label>
                  <Input 
                    value={formData.code} 
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })} 
                    placeholder="سيتم توليده تلقائياً" 
                    disabled={!isEditDialogOpen}
                    className={!isEditDialogOpen ? "bg-gray-100" : ""}
                  />
                  {!isEditDialogOpen && (
                    <p className="text-xs text-gray-500">سيتم توليد الرمز تلقائياً عند الحفظ</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>اسم الحساب *</Label>
                  <Input 
                    value={formData.name} 
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                    placeholder="اسم الحساب" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>نوع الحساب *</Label>
                  <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {accountTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>مستوى الحساب *</Label>
                  <Select 
                    value={formData.accountLevel} 
                    onValueChange={(value: any) => setFormData({ ...formData, accountLevel: value })}
                    disabled={!!selectedParentId}
                  >
                    <SelectTrigger>
                      <SelectValue/>
                    </SelectTrigger>
                    <SelectContent>
                      {accountLevels.map(level => (
                        <SelectItem key={level.value} value={level.value}>
                          <div>
                            <div className="font-medium">{level.label}</div>
                            <div className="text-xs text-gray-500">{level.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.accountLevel !== "main" && (
                <div className="space-y-2">
                  <Label>الحساب الأب</Label>
                  <Select 
                    value={formData.parentId} 
                    onValueChange={(value) => setFormData({ ...formData, parentId: value })}
                    disabled={!!selectedParentId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الحساب الأب" />
                    </SelectTrigger>
                    <SelectContent>
                      {parentOptions.map(acc => (
                        <SelectItem key={acc.id} value={String(acc.id)}>
                          {acc.code} - {acc.name} ({getAccountLevelInfo(acc.accountLevel).label})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label>التصنيف</Label>
                <Input 
                  value={formData.category} 
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })} 
                  placeholder="التصنيف" 
                />
              </div>

              <div className="space-y-2">
                <Label>الوصف</Label>
                <Input 
                  value={formData.description} 
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                  placeholder="الوصف (اختياري)" 
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsAddDialogOpen(false);
                setIsEditDialogOpen(false);
                setSelectedParentId(null);
                setSelectedAccount(null);
              }}>
                إلغاء
              </Button>
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 ml-2" />
                حفظ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ChartOfAccounts;
