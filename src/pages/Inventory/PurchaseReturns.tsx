import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { EnhancedTabs, TabsContent } from "@/components/ui/enhanced-tabs";
import { EnhancedStatsCard } from "@/components/ui/enhanced-stats-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Package, Search, Calendar, DollarSign, CheckCircle, Clock, 
  AlertCircle, Upload, Download, Edit, Eye, ArrowLeft, Building2,
  Camera, Mail, Phone, FileText, Filter, Printer, Star, TrendingUp,
  BarChart3, Bell, Shield, Zap, RefreshCw, X, Check, AlertTriangle,
  Receipt, Banknote, Calculator, FileCheck, Users, Settings, Undo2
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useListPurchaseReturnsQuery, useCreatePurchaseReturnMutation, useUpdatePurchaseReturnMutation } from "@/services/purchaseReturnsApi";
import { useListPurchaseOrdersQuery } from "@/services/purchaseOrdersApi";
import { useListGoodsReceiptsQuery } from "@/services/goodsReceiptApi";
import { useBranch } from '@/contexts/BranchContext';
import { PurchaseReturn } from "@/types/purchaseReturn";

const PurchaseReturns = () => {
  const { toast } = useToast();
  const API_BASE_URL = (import.meta as any)?.env?.VITE_API_BASE_URL || "https://metagym.metacodecx.com";
  const { selectedBranch } = useBranch();
  const { data: returnsData, refetch: refetchReturns } = useListPurchaseReturnsQuery({});
  const { data: poData } = useListPurchaseOrdersQuery({});
  const { data: grnData } = useListGoodsReceiptsQuery({});
  const [createPurchaseReturn] = useCreatePurchaseReturnMutation();
  const [updatePurchaseReturn] = useUpdatePurchaseReturnMutation();
  const existingReturns = Array.isArray((returnsData as any)?.data) ? (returnsData as any).data : (Array.isArray(returnsData as any) ? (returnsData as any) : []);
  
  // State for financial settlements
  const [financialSettlements, setFinancialSettlements] = useState<any[]>([]);
  const [isLoadingSettlements, setIsLoadingSettlements] = useState(false);
  
  const purchaseOrders: any[] = Array.isArray((poData as any)?.data) ? (poData as any).data : (Array.isArray(poData as any) ? (poData as any) : []);
  const goodsReceipts: any[] = Array.isArray((grnData as any)?.data) ? (grnData as any).data : (Array.isArray(grnData as any) ? (grnData as any) : []);
  const [purchaseReturn, setPurchaseReturn] = useState({
    returnNumber: `PR-${new Date().getFullYear()}-${String(existingReturns.length + 1).padStart(3, '0')}`,
    returnDate: new Date().toISOString().split('T')[0],
    poNumber: "",
    grnNumber: "",
    supplier: "",
    department: "",
    status: "بانتظار الموافقة" as const,
    notes: "",
    approver: "",
    supplierReceiptNumber: "",
    branchId: selectedBranch?.id || "",
    branchName: selectedBranch?.name || "",
    items: [
      { 
        id: 1, 
        name: "", 
        returnedQty: "", 
        unit: "", 
        batchNumber: "", 
        condition: "", 
        reason: "", 
        notes: "", 
        maxQty: "",
        price: 0,
        total: 0
      }
    ],
    attachments: []
  });
  useEffect(() => {
    try {
      const poId = String(purchaseReturn.poNumber || "");
      const filtered = (Array.isArray(goodsReceipts) ? goodsReceipts : []).filter((grn: any) => {
        const direct = String(grn.purchaseOrderId || grn.purchase_order_id || "");
        const assoc = grn.purchaseOrder && String(grn.purchaseOrder.id);
        return poId && (direct === poId || assoc === poId);
      });
      console.log("[PurchaseReturns] GRN raw list:", goodsReceipts);
      console.log("[PurchaseReturns] Selected PO:", purchaseReturn.poNumber);
      console.log("[PurchaseReturns] GRN filtered list:", filtered);
    } catch (e) {
      console.log("[PurchaseReturns] GRN log error:", e);
    }
  }, [goodsReceipts, purchaseReturn.poNumber]);
  const getReturnsStats = () => {
    const totalReturns = existingReturns.length;
    const pendingReturns = existingReturns.filter((r: any) => r.status === "بانتظار الموافقة").length;
    const approvedReturns = existingReturns.filter((r: any) => r.status === "معتمد" || r.status === "مكتمل").length;
    const totalValue = existingReturns.reduce((sum: number, r: any) => sum + Number(r.totalValue || 0), 0);
    return { totalReturns, pendingReturns, approvedReturns, totalValue };
  };
  
  const [activeTab, setActiveTab] = useState("new-return");
  useEffect(() => { document.title = "مرتجع المشتريات | إدارة المخزون"; }, []);
  
  // دالة لجلب بيانات التسوية المالية
  const fetchFinancialSettlements = async () => {
    try {
      setIsLoadingSettlements(true);
      const res = await fetch(`${API_BASE_URL}/api/v1/purchase-returns?include=supplier&status=معتمد`);
      if (res.ok) {
        const data = await res.json();
        let returns = [];
        if (Array.isArray(data)) {
          returns = data;
        } else if (data?.data) {
          returns = Array.isArray(data.data) ? data.data : [];
        }
        
        // تحويل المرتجعات المعتمدة إلى تسويات مالية
        const settlements = returns
          .filter((ret: any) => ret.status === 'معتمد')
          .map((ret: any) => ({
            id: ret.id,
            returnNumber: ret.returnNumber || ret.return_number || `RT-${ret.id}`,
            supplier: getSupplierDisplayName(ret.supplier),
            returnValue: ret.totalValue || ret.total_value || 0,
            creditNoteNumber: ret.creditNoteNumber || ret.credit_note_number || `CN-${ret.id}`,
            settlementDate: ret.settlementDate || ret.settlement_date || null,
            paymentMethod: ret.paymentMethod || ret.payment_method || 'خصم من ايصال مستقبلية',
            status: ret.settlementStatus || ret.settlement_status || 'بانتظار التسوية',
            returnData: ret
          }));
        
        setFinancialSettlements(settlements);
      } else {
        console.error('Failed to fetch financial settlements:', res.status);
        toast({ title: "خطأ", description: "فشل في جلب بيانات التسوية المالية", variant: "destructive" });
      }
    } catch (error) {
      console.error('Error fetching financial settlements:', error);
      toast({ title: "خطأ", description: "حدث خطأ أثناء جلب بيانات التسوية المالية", variant: "destructive" });
    } finally {
      setIsLoadingSettlements(false);
    }
  };

  // جلب بيانات التسوية المالية عند تحميل الصفحة
  useEffect(() => {
    fetchFinancialSettlements();
  }, []);
  
  const stats = getReturnsStats();

  // دالة مساعدة لاستخراج اسم المورد من البيانات
  const getSupplierDisplayName = (supplier: any): string => {
    if (typeof supplier === 'string') {
      return supplier;
    } else if (supplier && typeof supplier === 'object') {
      return supplier.name_ar || supplier.name_en || supplier.name || supplier.supplier_name || 'مورد غير محدد';
    }
    return 'مورد غير محدد';
  };

  // Dialog states and actions for settlements
  const [showCreditDialog, setShowCreditDialog] = useState(false);
  const [previewSettlement, setPreviewSettlement] = useState<null | (typeof financialSettlements[number])>(null); // settlement preview
  const [newCredit, setNewCredit] = useState({
    returnNumber: "",
    creditNoteNumber: `CN-${new Date().getFullYear()}-${String(financialSettlements.length + 1).padStart(3, '0')}`,
    paymentMethod: "خصم من ايصال مستقبلية",
    returnValue: 0,
  });

  const handleOpenCreditDialog = () => setShowCreditDialog(true);
  const handleCloseCreditDialog = () => setShowCreditDialog(false);

  const handleDownloadCreditNote = (settlement: typeof financialSettlements[number]) => {
    const rows = [
      ["رقم المرتجع","المورد","قيمة المرتجع","رقم إشعار الائتمان","تاريخ التسوية","طريقة التسوية","الحالة"],
      [settlement.returnNumber, settlement.supplier, `${settlement.returnValue} جنيه مصري`, settlement.creditNoteNumber || "-", settlement.settlementDate || "-", settlement.paymentMethod, settlement.status]
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `credit_note_${settlement.creditNoteNumber || settlement.returnNumber}.csv`;
    link.click();
  };

  const handlePrintCreditNote = (settlement: typeof financialSettlements[number]) => {
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`<!doctype html><html dir="rtl"><head><meta charset="utf-8"><title>إشعار ائتمان</title><style>body{font-family: system-ui; padding:24px} h1{margin-bottom:12px} table{width:100%;border-collapse:collapse} td,th{border:1px solid #ddd;padding:8px;text-align:right}</style></head><body><h1>إشعار ائتمان</h1><table><tr><th>رقم المرتجع</th><td>${settlement.returnNumber}</td></tr><tr><th>المورد</th><td>${settlement.supplier}</td></tr><tr><th>القيمة</th><td>${settlement.returnValue} جنيه مصري</td></tr><tr><th>رقم الإشعار</th><td>${settlement.creditNoteNumber || '-'}</td></tr><tr><th>التاريخ</th><td>${settlement.settlementDate || '-'}</td></tr><tr><th>الطريقة</th><td>${settlement.paymentMethod}</td></tr></table></body></html>`);
    w.document.close();
    w.focus();
    w.print();
    w.close();
  };

  const handleCreateCreditNote = () => {
    if (!newCredit.returnNumber) {
      toast({ title: "يرجى اختيار رقم المرتجع", variant: "destructive" });
      return;
    }
    
    // البحث عن المرتجع المختار
    const selectedReturn = existingReturns.find((ret: any) => String(ret.returnNumber || ret.return_number) === newCredit.returnNumber);
    
    if (selectedReturn) {
      // إنشاء تسوية مالية جديدة
      const newSettlement = {
        id: Date.now(), // ID مؤقت
        returnNumber: newCredit.returnNumber,
        supplier: getSupplierDisplayName(selectedReturn.supplier),
        returnValue: newCredit.returnValue,
        creditNoteNumber: newCredit.creditNoteNumber,
        settlementDate: new Date().toISOString().split('T')[0],
        paymentMethod: newCredit.paymentMethod,
        status: 'مكتمل',
        returnData: selectedReturn
      };
      
      // إضافة التسوية الجديدة إلى القائمة
      setFinancialSettlements(prev => [...prev, newSettlement]);
      
      // تحديث رقم إشعار الائتمان التالي
      setNewCredit(prev => ({
        ...prev,
        creditNoteNumber: `CN-${new Date().getFullYear()}-${String(financialSettlements.length + 2).padStart(3, '0')}`,
        returnNumber: "",
        returnValue: 0
      }));
      
      toast({ title: 'تم إنشاء إشعار الائتمان', description: `تم إنشاء ${newCredit.creditNoteNumber} بنجاح` });
    } else {
      toast({ title: "خطأ", description: "لم يتم العثور على المرتجع المختار", variant: "destructive" });
      return;
    }
    
    setShowCreditDialog(false);
  };

  // Return list actions
  const [showReturnPreview, setShowReturnPreview] = useState<string | number | null>(null);
  const handleDownloadReturn = (ret: PurchaseReturn) => {
    const rows = [
      ["رقم المرتجع","المورد","أمر الشراء","التاريخ","عدد الأصناف","القيمة","الحالة"],
      [ret.returnNumber, ret.supplier, ret.poNumber, ret.returnDate, String(ret.totalItems ?? ret.items?.length ?? 0), `${ret.totalValue ?? 0} جنيه مصري`, ret.status]
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `purchase_return_${ret.returnNumber}.csv`;
    link.click();
  };

  const handlePrintReturn = (ret: PurchaseReturn) => {
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`<!doctype html><html dir="rtl"><head><meta charset="utf-8"><title>مرتجع مشتريات</title><style>body{font-family: system-ui; padding:24px} h1{margin-bottom:12px} table{width:100%;border-collapse:collapse} td,th{border:1px solid #ddd;padding:8px;text-align:right}</style></head><body><h1>مرتجع مشتريات</h1><table><tr><th>رقم المرتجع</th><td>${ret.returnNumber}</td></tr><tr><th>المورد</th><td>${ret.supplier}</td></tr><tr><th>أمر الشراء</th><td>${ret.poNumber}</td></tr><tr><th>التاريخ</th><td>${ret.returnDate}</td></tr><tr><th>عدد الأصناف</th><td>${ret.totalItems ?? ret.items?.length ?? 0}</td></tr><tr><th>القيمة</th><td>${ret.totalValue ?? 0} جنيه مصري</td></tr><tr><th>الحالة</th><td>${ret.status}</td></tr></table></body></html>`);
    w.document.close();
    w.focus();
    w.print();
    w.close();
  };


  const addItem = () => {
    setPurchaseReturn({
      ...purchaseReturn,
      items: [...purchaseReturn.items, { 
        id: Date.now(), 
        name: "", 
        returnedQty: "", 
        unit: "", 
        batchNumber: "",
        condition: "",
        reason: "",
        notes: "",
        maxQty: "",
        price: 0,
        total: 0
      }]
    });
  };

  const removeItem = (id: number) => {
    setPurchaseReturn({
      ...purchaseReturn,
      items: purchaseReturn.items.filter(item => item.id !== id)
    });
  };

  const updateItem = (id: number, field: string, value: string) => {
    setPurchaseReturn({
      ...purchaseReturn,
      items: purchaseReturn.items.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          
          // حساب الكمية المرتجعة تلقائياً
          if (field === 'returnedQty') {
            const returnedQty = Number(value) || 0;
            const maxQty = Number(item.maxQty) || 0;
            
            // التحقق من أن الكمية المرتجعة لا تتجاوز الحد الأقصى
            if (returnedQty > maxQty) {
              toast({ 
                title: "تنبيه", 
                description: `الكمية المرتجعة (${returnedQty}) تتجاوز الكمية المتاحة (${maxQty})`, 
                variant: "destructive" 
              });
            }
            
            // حساب السعر الإجمالي
            const price = Number(item.price) || 0;
            updatedItem.total = returnedQty * price;
          }
          
          return updatedItem;
        }
        return item;
      })
    });
  };

  const handleSaveReturn = async () => {
    const totalItems = (Array.isArray(purchaseReturn.items) ? purchaseReturn.items : []).filter((item) => item.name).length;
    const totalValue = (Array.isArray(purchaseReturn.items) ? purchaseReturn.items : []).reduce((sum, item) => {
      const qty = typeof item.returnedQty === 'string' ? parseInt(item.returnedQty as any) || 0 : (item.returnedQty as any) || 0;
      const price = Number((item as any).price || 0);
      return sum + (qty * price);
    }, 0);
    
    // الحصول على supplierId من أمر الشراء
    let supplierId = null;
    if (purchaseReturn.poNumber) {
      const po = (Array.isArray(purchaseOrders) ? purchaseOrders : []).find((p: any) => String(p.id) === String(purchaseReturn.poNumber));
      if (po) {
        supplierId = getSupplierId(po);
      }
    }
    
    const body: any = {
      returnNumber: purchaseReturn.returnNumber,
      returnDate: purchaseReturn.returnDate,
      purchaseOrderId: purchaseReturn.poNumber ? Number((purchaseReturn.poNumber as any).toString().replace(/\D/g, "")) : null,
      goodsReceiptId: purchaseReturn.grnNumber ? Number((purchaseReturn.grnNumber as any).toString().replace(/\D/g, "")) : null,
      supplierId: supplierId,
      department: purchaseReturn.department,
      status: purchaseReturn.status,
      notes: purchaseReturn.notes,
      branchId: purchaseReturn.branchId,
      branchName: purchaseReturn.branchName,
      totalItems,
      totalValue,
      items: (purchaseReturn.items || []).map((it) => ({
        name: it.name,
        itemCode: (it as any).itemCode || null,
        returnedQty: Number(it.returnedQty || 0),
        unit: it.unit || null,
        batchNumber: it.batchNumber || null,
        condition: it.condition || null,
        reason: it.reason || null,
        price: Number((it as any).price || 0),
        total: Number((it as any).total || 0),
        notes: it.notes || null,
      })),
    };
    
    console.log("Sending purchase return data:", body);
    
    try {
      await createPurchaseReturn(body).unwrap();
      await refetchReturns();
      toast({ title: "تم حفظ المرتجع" });
    } catch (e: any) {
      toast({ title: "فشل حفظ المرتجع", description: String(e?.data?.message || e?.error || e), variant: "destructive" });
    }
  };

  const handleSubmitForApproval = () => {
    handleSaveReturn();
    toast({
      title: "تم إرسال طلب الموافقة",
      description: "تم إرسال طلب المرتجع للموافقة",
    });
  };

  const handleApproveReturn = async (returnId: string | number) => {
    try {
      await updatePurchaseReturn({ id: returnId, status: "معتمد" } as any).unwrap();
      await refetchReturns();
      toast({ title: "تم اعتماد المرتجع" });
    } catch (e) {
      toast({ title: "فشل الاعتماد", variant: "destructive" });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      "بانتظار الموافقة": "secondary",
      "معتمد": "default",
      "مرفوض": "destructive",
      "مكتمل": "default",
      "تحت التسوية المالية": "default",
      "مسوى": "default"
    };

    const icons = {
      "بانتظار الموافقة": <Clock className="w-3 h-3 mr-1" />,
      "معتمد": <CheckCircle className="w-3 h-3 mr-1" />,
      "مرفوض": <X className="w-3 h-3 mr-1" />,
      "مكتمل": <CheckCircle className="w-3 h-3 mr-1" />,
      "تحت التسوية المالية": <DollarSign className="w-3 h-3 mr-1" />,
      "مسوى": <CheckCircle className="w-3 h-3 mr-1" />
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] as "default" | "destructive" | "secondary"}>
        {icons[status as keyof typeof icons]}
        {status}
      </Badge>
    );
  };

  const getReasonBadge = (reason: string) => {
    const colors = {
      "عيب في التصنيع": "bg-red-100 text-red-800",
      "كمية زائدة": "bg-blue-100 text-blue-800",
      "عدم مطابقة المواصفات": "bg-orange-100 text-orange-800",
      "تلف أثناء النقل": "bg-yellow-100 text-yellow-800",
      "انتهاء صلاحية": "bg-purple-100 text-purple-800"
    };

    return (
      <Badge className={colors[reason as keyof typeof colors] || "bg-gray-100 text-gray-800"}>
        {reason}
      </Badge>
    );
  };

  // دالة مساعدة لاستخراج ID المورد من بيانات أمر الشراء
  const getSupplierId = (po: any): number | null => {
    console.log("Getting supplier ID for PO:", po?.id || "unknown");
    
    // طرق مختلفة للوصول لـ ID المورد
    const possibleIds = [
      po?.supplier?.id,
      po?.supplier?.supplier_id,
      po?.supplierId,
      po?.supplier_id,
    ];
    
    // البحث عن أول قيمة صحيحة
    for (const id of possibleIds) {
      if (id && typeof id === 'number' && id > 0) {
        console.log("Found supplier ID:", id);
        return id;
      }
      // محاولة تحويل string إلى number
      if (id && typeof id === 'string' && !isNaN(Number(id))) {
        const numId = Number(id);
        if (numId > 0) {
          console.log("Found supplier ID (converted):", numId);
          return numId;
        }
      }
    }
    
    console.log("No supplier ID found for PO:", po?.id);
    return null;
  };

  // دالة مساعدة لاستخراج اسم المورد من بيانات أمر الشراء
  const getSupplierName = (po: any): string => {
    console.log("Getting supplier name for PO:", po?.id || "unknown");
    
    // طرق مختلفة للوصول لاسم المورد
    const possiblePaths = [
      // من كائن supplier
      po?.supplier?.name_ar,
      po?.supplier?.name_en, 
      po?.supplier?.name,
      po?.supplier?.supplier_name,
      po?.supplier?.company_name,
      
      // من الحقول المباشرة
      po?.supplier_name,
      po?.supplierName,
      po?.supplierNameAr,
      po?.supplierNameEn,
      
      // من البيانات المدمجة
      po?.supplierData?.name_ar,
      po?.supplierData?.name_en,
      po?.supplierData?.name,
    ];
    
    // البحث عن أول قيمة صحيحة
    for (const path of possiblePaths) {
      if (path && typeof path === 'string' && path.trim()) {
        console.log("Found supplier name:", path);
        return path.trim();
      }
    }
    
    console.log("No supplier name found for PO:", po?.id);
    return "";
  };

  return (
    <div className="space-y-6">
      <div className="relative animate-fade-in">
      <Card className="bg-card/90 backdrop-blur-sm rounded-2xl border border-border shadow-lg">
        <CardHeader className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl">مرتجع المشتريات</CardTitle>
              <CardDescription>إدارة مرتجعات المشتريات والتسوية المالية مع الموردين</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <EnhancedStatsCard
              title="إجمالي المرتجعات"
              value={stats.totalReturns}
              icon={Undo2}
              color="blue"
              index={0}
            />
            <EnhancedStatsCard
              title="بانتظار الموافقة"
              value={stats.pendingReturns}
              icon={Clock}
              color="orange"
              index={1}
            />
            <EnhancedStatsCard
              title="معتمدة/مكتملة"
              value={stats.approvedReturns}
              icon={CheckCircle}
              color="green"
              index={2}
            />
            <EnhancedStatsCard
              title="القيمة الإجمالية"
              value={`${stats.totalValue.toLocaleString()} جنيه مصري`}
              icon={DollarSign}
              color="purple"
              index={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>

      <EnhancedTabs
        items={[
          { value: "new-return", label: "مرتجع جديد", icon: Undo2, color: "blue" },
          { value: "returns-list", label: "قائمة المرتجعات", icon: FileText, color: "indigo" },
          { value: "approval", label: "موافقة المرتجعات", icon: Shield, color: "green" },
          { value: "settlement", label: "التسوية المالية", icon: DollarSign, color: "teal" },
          { value: "reports", label: "التقارير", icon: BarChart3, color: "purple" },
        ]}
        value={activeTab}
        onValueChange={setActiveTab}
        defaultValue="new-return"
        className="space-y-4"
      >

        {/* تبويب مرتجع جديد */}
        <TabsContent value="new-return" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>إنشاء طلب مرتجع مشتريات</CardTitle>
              <CardDescription>إنشاء طلب إرجاع المواد للمورد مع توثيق الأسباب</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* المعلومات الأساسية */}
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="returnNumber">رقم مرتجع المشتريات</Label>
                  <Input 
                    id="returnNumber" 
                    value={purchaseReturn.returnNumber}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="returnDate">تاريخ المرتجع</Label>
                  <Input 
                    id="returnDate" 
                    type="date"
                    value={purchaseReturn.returnDate}
                    onChange={(e) => setPurchaseReturn({...purchaseReturn, returnDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="poNumber">رقم أمر الشراء</Label>
                  <Select 
                    value={purchaseReturn.poNumber}
                    onValueChange={(value) => {
                      const next = { ...purchaseReturn, poNumber: value, grnNumber: "" } as any;
                      const po = (Array.isArray(purchaseOrders) ? purchaseOrders : []).find((p: any) => String(p.id) === String(value));
                      
                      console.log("Selected PO:", po);
                      
                      if (po) {
                        // ملء بيانات المورد باستخدام الدالة المساعدة
                        const supplierName = getSupplierName(po);
                        console.log("Final supplier name for form:", supplierName);
                        
                        if (supplierName) {
                          next.supplier = supplierName;
                          console.log("Updated supplier in next state:", next.supplier);
                        }
                        
                        // ملء المنتجات من أمر الشراء
                        if (po.items && Array.isArray(po.items) && po.items.length > 0) {
                          console.log("Found items in PO:", po.items);
                          next.items = po.items.map((item: any, index: number) => ({
                            id: Date.now() + index,
                            name: item.name || item.itemName || item.productName || "",
                            returnedQty: "",
                            unit: item.unit || "piece",
                            batchNumber: "",
                            condition: "",
                            reason: "",
                            notes: "",
                            maxQty: String(item.quantity || item.qty || 0),
                            price: item.price || item.unitPrice || 0,
                            total: 0
                          }));
                          console.log("Updated items:", next.items);
                        } else {
                          console.log("No items found in PO");
                        }
                      }
                      
                      console.log("Setting purchase return state:", next);
                      setPurchaseReturn(next);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر أمر الشراء" />
                    </SelectTrigger>
                    <SelectContent className="z-50 bg-card border border-border shadow-lg">
                      {(purchaseOrders as any[]).map((po: any) => {
                        const label = po.poNumber || `PO-${po.id}`;
                        const supplierName = getSupplierName(po);
                        return (
                          <SelectItem key={po.id} value={String(po.id)}>
                            {label} - {supplierName || "بدون مورد"}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grnNumber">رقم سند الاستلام</Label>
                  <Select 
                    value={purchaseReturn.grnNumber}
                    onValueChange={(value) => {
                      const grn = (Array.isArray(goodsReceipts) ? goodsReceipts : []).find((g: any) => String(g.id) === String(value));
                      const poId = grn?.purchaseOrderId || grn?.purchase_order_id || grn?.purchaseOrder?.id;
                      const po = (Array.isArray(purchaseOrders) ? purchaseOrders : []).find((p: any) => String(p.id) === String(poId));
                      const supplierName = po?.supplier?.name || po?.supplier?.supplier_name || po?.supplierName || "";
                      setPurchaseReturn({
                        ...purchaseReturn,
                        grnNumber: value,
                        poNumber: poId ? String(poId) : purchaseReturn.poNumber,
                        supplier: supplierName || purchaseReturn.supplier,
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={(() => {
                        const count = (Array.isArray(goodsReceipts) ? goodsReceipts : [])
                          .filter((grn: any) => String(grn.purchaseOrderId || grn.purchase_order_id || grn?.purchaseOrder?.id || "") === String(purchaseReturn.poNumber))
                          .length;
                        return count > 0 ? `وجد ${count} سند/سندات` : "اختج.مند الاستلام";
                      })()} />
                    </SelectTrigger>
                    <SelectContent className="z-50 bg-card border border-border shadow-lg">
                      {(() => {
                        const poId = String(purchaseReturn.poNumber || "");
                        const filtered = (Array.isArray(goodsReceipts) ? goodsReceipts : []).filter((grn: any) => {
                          const direct = String(grn.purchaseOrderId || grn.purchase_order_id || "");
                          const assoc = grn.purchaseOrder && String(grn.purchaseOrder.id);
                          return poId && (direct === poId || assoc === poId);
                        });
                        const listToShow = filtered.length > 0 ? filtered : (Array.isArray(goodsReceipts) ? goodsReceipts : []);
                        return listToShow.map((grn: any, idx: number) => {
                          const label = grn.grnNumber || grn.grn_number || `GRN-${grn.id}`;
                          const poRef = grn.purchaseOrderId || grn.purchase_order_id || grn?.purchaseOrder?.id;
                          return (
                            <SelectItem key={grn.id ?? `${label}-${idx}`} value={String(grn.id)}>
                              {label}{poRef ? ` (PO #${poRef})` : ""}
                            </SelectItem>
                          );
                        });
                      })()}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supplier">اسم المورد</Label>
                  <Input 
                    id="supplier"
                    value={purchaseReturn.supplier}
                    onChange={(e) => setPurchaseReturn({...purchaseReturn, supplier: e.target.value})}
                    placeholder="سيتم سحبه تلقائياً من أمر الشراء"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">الجهة/الموقع</Label>
                  <Select 
                    value={purchaseReturn.department}
                    onValueChange={(value) => setPurchaseReturn({...purchaseReturn, department: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الجهة" />
                    </SelectTrigger>
                    <SelectContent className="z-50 bg-card border border-border shadow-lg">
                      <SelectItem value="warehouse">المستودع الرئيسي</SelectItem>
                      <SelectItem value="maintenance">قسم الصيانة</SelectItem>
                      <SelectItem value="operations">العمليات</SelectItem>
                      <SelectItem value="branch1">فرع الرياض</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* الأصناف المرتجعة */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">الأصناف المرتجعة</h3>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">إجمالي القيمة</p>
                      <p className="text-xl font-bold text-red-600">
                        {purchaseReturn.items.reduce((sum, item) => sum + (Number(item.total) || 0), 0).toLocaleString()} جنيه مصري
                      </p>
                    </div>
                    <Button onClick={addItem} variant="outline" size="sm">
                      <Package className="ml-2 h-4 w-4" />
                      إضافة صنف
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {purchaseReturn.items.map((item, index) => (
                    <Card key={item.id} className="p-4 hover:shadow-lg transition-all duration-300 animate-fade-in">
                      <div className="grid grid-cols-10 gap-4">
                        <div className="space-y-2">
                          <Label>اسم الصنف</Label>
                          <Input 
                            placeholder="اسم المادة"
                            value={item.name}
                            onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>الكمية المرتجعة</Label>
                          <Input 
                            type="number"
                            placeholder="0"
                            value={item.returnedQty}
                            onChange={(e) => updateItem(item.id, 'returnedQty', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>الكمية المتاحة</Label>
                          <Input 
                            type="number"
                            placeholder="0"
                            value={item.maxQty}
                            onChange={(e) => updateItem(item.id, 'maxQty', e.target.value)}
                            disabled
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>السعر</Label>
                          <Input 
                            type="number"
                            placeholder="0"
                            value={item.price || 0}
                            onChange={(e) => updateItem(item.id, 'price', e.target.value)}
                            disabled
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>السعر الإجمالي</Label>
                          <Input 
                            type="number"
                            placeholder="0"
                            value={item.total || 0}
                            disabled
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>الوحدة</Label>
                          <Select 
                            value={item.unit}
                            onValueChange={(value) => updateItem(item.id, 'unit', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="الوحدة" />
                            </SelectTrigger>
                            <SelectContent className="z-50 bg-card border border-border shadow-lg">
                              <SelectItem value="piece">  </SelectItem>
                              <SelectItem value="liter">لتر</SelectItem>
                              <SelectItem value="kg">كيلوجرام</SelectItem>
                              <SelectItem value="meter">متر</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>رقم التشغيلة</Label>
                          <Input 
                            placeholder="Batch #"
                            value={item.batchNumber}
                            onChange={(e) => updateItem(item.id, 'batchNumber', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>حالة المرتجع</Label>
                          <Select 
                            value={item.condition}
                            onValueChange={(value) => updateItem(item.id, 'condition', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="الحالة" />
                            </SelectTrigger>
                             <SelectContent className="z-50 bg-card border border-border shadow-lg">
                              <SelectItem value="damaged">تالف</SelectItem>
                              <SelectItem value="defective">معيب</SelectItem>
                              <SelectItem value="expired">منتهي الصلاحية</SelectItem>
                              <SelectItem value="surplus">زائد عن الحاجة</SelectItem>
                              <SelectItem value="non-conforming">غير مطابق</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>سبب المرتجع</Label>
                          <Select 
                            value={item.reason}
                            onValueChange={(value) => updateItem(item.id, 'reason', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="السبب" />
                            </SelectTrigger>
                             <SelectContent className="z-50 bg-card border border-border shadow-lg">
                              <SelectItem value="عيب في التصنيع">عيب في التصنيع</SelectItem>
                              <SelectItem value="تلف أثناء النقل">تلف أثناء النقل</SelectItem>
                              <SelectItem value="عدم مطابقة المواصفات">عدم مطابقة المواصفات</SelectItem>
                              <SelectItem value="كمية زائدة">كمية زائدة</SelectItem>
                              <SelectItem value="انتهاء صلاحية">انتهاء صلاحية</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-end">
                          {purchaseReturn.items.length > 1 && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => removeItem(item.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="mt-4 space-y-2">
                        <Label>ملاحظات الصنف</Label>
                        <Textarea 
                          placeholder="تفاصيل إضافية عن حالة الصنف أو سبب الإرجاع"
                          value={item.notes}
                          onChange={(e) => updateItem(item.id, 'notes', e.target.value)}
                        />
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* المرفقات والصور */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">مرفقات/صور توضيحية</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                    <Camera className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        صور توضح العيب أو سبب المرتجع
                      </p>
                      <p className="text-xs text-red-500">
                        (إلزامي للمرتجعات التالفة)
                      </p>
                      <Button variant="outline" size="sm">
                        <Camera className="ml-2 h-4 w-4" />
                        التقاط صور
                      </Button>
                    </div>
                  </div>
                  <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        مستندات إضافية
                      </p>
                      <Button variant="outline" size="sm">
                        <Upload className="ml-2 h-4 w-4" />
                        رفع ملفات
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* الملاحظات */}
              <div className="space-y-2">
                <Label htmlFor="notes">ملاحظات عامة</Label>
                <Textarea 
                  id="notes"
                  placeholder="أي شروحات إضافية أو تعليمات خاصة بالمرتجع"
                  value={purchaseReturn.notes}
                  onChange={(e) => setPurchaseReturn({...purchaseReturn, notes: e.target.value})}
                />
              </div>

              {/* أزرار الإجراء */}
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={handleSaveReturn}>
                  <FileText className="ml-2 h-4 w-4" />
                  حفظ مسودة
                </Button>
                <Button onClick={handleSubmitForApproval}>
                  <CheckCircle className="ml-2 h-4 w-4" />
                  إرسال للموافقة
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* تبويب قائمة المرتجعات */}
        <TabsContent value="returns-list" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>قائمة مرتجعات المشتريات</CardTitle>
              <CardDescription>جميع طلبات مرتجع المشتريات وحالتها</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input 
                        placeholder="البحث في المرتجعات..." 
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="حالة المرتجع" />
                    </SelectTrigger>
                    <SelectContent className="z-50 bg-card border border-border shadow-lg">
                      <SelectItem value="all">جميع الحالات</SelectItem>
                      <SelectItem value="pending">بانتظار الموافقة</SelectItem>
                      <SelectItem value="approved">معتمد</SelectItem>
                      <SelectItem value="completed">مكتمل</SelectItem>
                      <SelectItem value="settlement">تحت التسوية المالية</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <RefreshCw className="ml-2 h-4 w-4" />
                    تحديث
                  </Button>
                </div>

                <Table className="shadow-card rounded-xl overflow-hidden">
                  <TableHeader className="bg-muted/80">
                    <TableRow>
                      <TableHead>رقم المرتجع</TableHead>
                      <TableHead>المورد</TableHead>
                      <TableHead>رقم أمر الشراء</TableHead>
                      <TableHead>التاريخ</TableHead>
                      <TableHead>عدد الأصناف</TableHead>
                      <TableHead>القيمة الإجمالية</TableHead>
                      <TableHead>السبب الرئيسي</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>المُعتمِد</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(existingReturns as any[]).map((returnItem: any) => (
                      <TableRow key={returnItem.id}>
                        <TableCell className="font-medium">{returnItem.returnNumber}</TableCell>
                        <TableCell>{getSupplierDisplayName(returnItem.supplier)}</TableCell>
                        <TableCell>{returnItem.poNumber}</TableCell>
                        <TableCell>{returnItem.returnDate}</TableCell>
                        <TableCell>{returnItem.totalItems}</TableCell>
                        <TableCell>
                          {(() => {
                            // التعامل مع totalValue سواء كان number أو string
                            const value = returnItem.totalValue;
                            if (typeof value === 'number') {
                              return value.toLocaleString() + ' جنيه مصري';
                            } else if (typeof value === 'string') {
                              const numValue = parseFloat(value);
                              if (!isNaN(numValue)) {
                                return numValue.toLocaleString() + ' جنيه مصري';
                              }
                            }
                            return '0 جنيه مصري';
                          })()}
                        </TableCell>
                        <TableCell>{getReasonBadge(returnItem.items[0]?.reason || "غير محدد")}</TableCell>
                        <TableCell>{getStatusBadge(returnItem.status)}</TableCell>
                        <TableCell>{returnItem.approvedBy || "-"}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => setShowReturnPreview(returnItem.id!)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handlePrintReturn(returnItem)}>
                              <Printer className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDownloadReturn(returnItem)}>
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* تبويب موافقة المرتجعات */}
        <TabsContent value="approval" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>موافقة طلبات المرتجع</CardTitle>
              <CardDescription>مراجعة واعتماد طلبات مرتجع المشتريات</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* الطلبات المعلقة للموافقة */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">طلبات بانتظار الموافقة</h3>
                  
                  {(existingReturns as any[])
                    .filter((ret: any) => ret.status === "بانتظار الموافقة")
                    .map((returnItem: any) => (
                      <Card key={returnItem.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="grid grid-cols-4 gap-4 flex-1">
                            <div>
                              <p className="text-sm font-medium">رقم المرتجع</p>
                              <p className="text-lg">{returnItem.returnNumber}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">المورد</p>
                              <p>{getSupplierDisplayName(returnItem.supplier)}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">السبب</p>
                              <p>{returnItem.items[0]?.reason || "غير محدد"}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">القيمة</p>
                              <p className="text-lg font-bold text-red-600">
                                {returnItem.totalValue.toLocaleString()} جنيه مصري
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => setShowReturnPreview(returnItem.id!)}>
                              <Eye className="ml-2 h-4 w-4" />
                              مراجعة
                            </Button>
                            <Button size="sm" onClick={() => handleApproveReturn(returnItem.id!)}>
                              <CheckCircle className="ml-2 h-4 w-4" />
                              موافقة
                            </Button>
                            <Button variant="destructive" size="sm" onClick={async () => { try { await updatePurchaseReturn({ id: returnItem.id!, status: "مرفوض" } as any).unwrap(); await refetchReturns(); toast({ title: "تم الرفض", description: `تم رفض مرتجع ${returnItem.returnNumber}` }); } catch (e) { toast({ title: "فشل الرفض", variant: "destructive" }); } }}>
                              <X className="ml-2 h-4 w-4" />
                              رفض
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                </div>

                {/* سجل الموافقات */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">سجل الموافقات</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>رقم المرتجع</TableHead>
                          <TableHead>المورد</TableHead>
                          <TableHead>القيمة</TableHead>
                          <TableHead>المُوافِق</TableHead>
                          <TableHead>تاريخ الموافقة</TableHead>
                          <TableHead>الملاحظات</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(existingReturns as any[])
                          .filter((ret: any) => ret.approvedBy)
                          .map((returnItem: any) => (
                            <TableRow key={returnItem.id}>
                              <TableCell className="font-medium">{returnItem.returnNumber}</TableCell>
                              <TableCell>{returnItem.supplier}</TableCell>
                              <TableCell>{returnItem.totalValue.toLocaleString()} جنيه مصري</TableCell>
                              <TableCell>{returnItem.approvedBy}</TableCell>
                              <TableCell>{returnItem.returnDate}</TableCell>
                              <TableCell>موافقة طبيعية</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* تبويب التسوية المالية */}
        <TabsContent value="settlement" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>التسوية المالية للمرتجعات</CardTitle>
              <CardDescription>إدارة التسويات المالية وإشعارات الائتمان</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* إحصائيات التسوية */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <EnhancedStatsCard title="مسوى" value={2} icon={DollarSign} color="green" index={0} subtitle={<span>3,600 جنيه مصري</span>} />
                  <EnhancedStatsCard title="بانتظار التسوية" value={1} icon={Clock} color="orange" index={1} subtitle={<span>1,200 جنيه مصري</span>} />
                  <EnhancedStatsCard title="إشعارات ائتمان" value={3} icon={Receipt} color="indigo" index={2} subtitle={<span>4,800 جنيه مصري</span>} />
                  <EnhancedStatsCard title="متوسط وقت التسوية" value={5} icon={TrendingUp} color="purple" index={3} subtitle={<span>أيام</span>} />
                </div>

                {/* جدول التسويات */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">سجل التسويات المالية</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={fetchFinancialSettlements} disabled={isLoadingSettlements} className="gap-2">
                        <RefreshCw className={`ml-2 h-4 w-4 ${isLoadingSettlements ? 'animate-spin' : ''}`} />
                        {isLoadingSettlements ? 'جاري التحميل...' : 'تحديث'}
                      </Button>
                      <Button onClick={handleOpenCreditDialog} className="gap-2">
                        <Receipt className="ml-2 h-4 w-4" />
                        إنشاء إشعار ائتمان
                      </Button>
                    </div>
                  </div>
                  
                  <Table className="shadow-card rounded-xl overflow-hidden">
                    <TableHeader className="bg-muted/80">
                      <TableRow>
                        <TableHead>رقم المرتجع</TableHead>
                        <TableHead>المورد</TableHead>
                        <TableHead>قيمة المرتجع</TableHead>
                        <TableHead>رقم إشعار الائتمان</TableHead>
                        <TableHead>تاريخ التسوية</TableHead>
                        <TableHead>طريقة التسوية</TableHead>
                        <TableHead>الحالة</TableHead>
                        <TableHead>الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {financialSettlements.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                            {isLoadingSettlements ? (
                              <div className="flex items-center justify-center gap-2">
                                <RefreshCw className="h-5 w-5 animate-spin" />
                                جاري تحميل بيانات التسوية المالية...
                              </div>
                            ) : (
                              <div className="text-center">
                                <Receipt className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                                <p className="text-lg font-medium mb-2">لا توجد تسويات مالية</p>
                                <p className="text-sm text-muted-foreground mb-4">
                                  قم بإنشاء إشعار ائتمان جديد أو تأكد من وجود مرتجعات معتمدة
                                </p>
                                <Button onClick={handleOpenCreditDialog} variant="outline" size="sm">
                                  <Receipt className="ml-2 h-4 w-4" />
                                  إنشاء إشعار ائتمان
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ) : (
                        financialSettlements.map((settlement) => (
                          <TableRow key={settlement.id}>
                            <TableCell className="font-medium">{settlement.returnNumber}</TableCell>
                            <TableCell>{settlement.supplier}</TableCell>
                            <TableCell>{settlement.returnValue.toLocaleString()} جنيه مصري</TableCell>
                            <TableCell>{settlement.creditNoteNumber}</TableCell>
                            <TableCell>{settlement.settlementDate || "لم يتم بعد"}</TableCell>
                            <TableCell>{settlement.paymentMethod}</TableCell>
                            <TableCell>{getStatusBadge(settlement.status)}</TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm" onClick={() => setPreviewSettlement(settlement)}>
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button variant="outline" size="sm" onClick={() => handlePrintCreditNote(settlement)}>
                                    <Printer className="h-4 w-4" />
                                  </Button>
                                  <Button variant="outline" size="sm" onClick={() => handleDownloadCreditNote(settlement)}>
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* تبويب التقارير */}
        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="ml-2 h-5 w-5" />
                  إحصائيات عامة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>إجمالي المرتجعات</span>
                    <span className="font-semibold">24</span>
                  </div>
                  <div className="flex justify-between">
                    <span>قيمة المرتجعات</span>
                    <span className="font-semibold text-red-600">48,000 جنيه مصري</span>
                  </div>
                  <div className="flex justify-between">
                    <span>معدل الموافقة</span>
                    <span className="font-semibold text-green-600">92%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>متوسط وقت المعالجة</span>
                    <span className="font-semibold">3.5 يوم</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="ml-2 h-5 w-5" />
                  أسباب المرتجعات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>عيب في التصنيع</span>
                    <span className="font-semibold">35%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>عدم مطابقة المواصفات</span>
                    <span className="font-semibold">25%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>تلف أثناء النقل</span>
                    <span className="font-semibold">20%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>كمية زائدة</span>
                    <span className="font-semibold">15%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>انتهاء صلاحية</span>
                    <span className="font-semibold">5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="ml-2 h-5 w-5" />
                  أداء الموردين
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>شركة التوريدات المتقدمة</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-red-500 mr-1" />
                      <span className="font-semibold">3.2</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>شركة الرياض التجارية</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="font-semibold">4.1</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>مؤسسة الخليج للمواد</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-green-500 mr-1" />
                      <span className="font-semibold">4.6</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>تقارير تفصيلية</CardTitle>
              <CardDescription>إنتاج وتصدير التقارير المتخصصة</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex-col">
                  <Undo2 className="h-6 w-6 mb-2" />
                  تقرير المرتجعات
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <DollarSign className="h-6 w-6 mb-2" />
                  تقرير التسويات
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Users className="h-6 w-6 mb-2" />
                  تقرير أداء الموردين
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <BarChart3 className="h-6 w-6 mb-2" />
                  تحليل الأسباب
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </EnhancedTabs>

      {/* Dialog: Settlement Preview */}
      <Dialog open={!!previewSettlement} onOpenChange={(open) => { if (!open) setPreviewSettlement(null); }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>معاينة إشعار الائتمان</DialogTitle>
            <DialogDescription>تفاصيل التسوية المالية للمرتجع</DialogDescription>
          </DialogHeader>
          {previewSettlement && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">رقم المرتجع:</span> <span className="font-medium">{previewSettlement.returnNumber}</span></div>
                <div><span className="text-muted-foreground">المورد:</span> <span className="font-medium">{previewSettlement.supplier}</span></div>
                <div><span className="text-muted-foreground">القيمة:</span> <span className="font-medium">{previewSettlement.returnValue.toLocaleString()} جنيه مصري</span></div>
                <div><span className="text-muted-foreground">رقم الإشعار:</span> <span className="font-medium">{previewSettlement.creditNoteNumber}</span></div>
                <div><span className="text-muted-foreground">التاريخ:</span> <span className="font-medium">{previewSettlement.settlementDate || "-"}</span></div>
                <div><span className="text-muted-foreground">الطريقة:</span> <span className="font-medium">{previewSettlement.paymentMethod}</span></div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => handleDownloadCreditNote(previewSettlement)}>
                  <Download className="ml-2 h-4 w-4" /> تنزيل
                </Button>
                <Button onClick={() => handlePrintCreditNote(previewSettlement)}>
                  <Printer className="ml-2 h-4 w-4" /> طباعة
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog: Create Credit Note */}
      <Dialog open={showCreditDialog} onOpenChange={setShowCreditDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>إنشاء إشعار ائتمان</DialogTitle>
            <DialogDescription>اختَر المرتجع واملأ بيانات الإشعار</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>رقم المرتجع</Label>
              <Select value={newCredit.returnNumber} onValueChange={(v) => {
                const selectedReturn = existingReturns.find((r: any) => String(r.returnNumber || r.return_number) === v);
                setNewCredit({ 
                  ...newCredit, 
                  returnNumber: v,
                  returnValue: selectedReturn ? (selectedReturn.totalValue || selectedReturn.total_value || 0) : 0
                });
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر المرتجع" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-card border border-border shadow-lg">
                  {(existingReturns as any[])
                    .filter((r: any) => r.status === 'معتمد')
                    .map((r: any) => (
                      <SelectItem key={r.id} value={String(r.returnNumber || r.return_number)}>
                        {r.returnNumber || r.return_number} - {getSupplierDisplayName(r.supplier)} - {(r.totalValue || r.total_value || 0).toLocaleString()} جنيه مصري
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>رقم إشعار الائتمان</Label>
                <Input value={newCredit.creditNoteNumber} onChange={(e) => setNewCredit({ ...newCredit, creditNoteNumber: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>قيمة المرتجع</Label>
                <Input type="number" value={newCredit.returnValue} onChange={(e) => setNewCredit({ ...newCredit, returnValue: Number(e.target.value) })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>طريقة التسوية</Label>
              <Select value={newCredit.paymentMethod} onValueChange={(v) => setNewCredit({ ...newCredit, paymentMethod: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الطريقة" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-card border border-border shadow-lg">
                  <SelectItem value="خصم من ايصال مستقبلية">خصم من ايصال مستقبلية</SelectItem>
                  <SelectItem value="تحويل بنكي">تحويل بنكي</SelectItem>
                  <SelectItem value="نقدًا">نقدًا</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleCloseCreditDialog}>إلغاء</Button>
            <Button onClick={handleCreateCreditNote}>إنشاء</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Return Preview */}
      <Dialog open={showReturnPreview !== null} onOpenChange={(open) => { if (!open) setShowReturnPreview(null); }}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>معاينة مرتجع المشتريات</DialogTitle>
            <DialogDescription>تفاصيل المرتجع المختار</DialogDescription>
          </DialogHeader>
          {(() => {
            const ret = (existingReturns as any[]).find((r: any) => r.id === showReturnPreview);
            if (!ret) return <div className="text-sm text-muted-foreground">لم يتم العثور على المرتجع</div>;
            return (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-muted-foreground">رقم المرتجع:</span> <span className="font-medium">{ret.returnNumber}</span></div>
                  <div><span className="text-muted-foreground">المورد:</span> <span className="font-medium">{ret.supplier}</span></div>
                  <div><span className="text-muted-foreground">أمر الشراء:</span> <span className="font-medium">{ret.poNumber}</span></div>
                  <div><span className="text-muted-foreground">التاريخ:</span> <span className="font-medium">{ret.returnDate}</span></div>
                  <div><span className="text-muted-foreground">الحالة:</span> <span className="font-medium">{ret.status}</span></div>
                  <div><span className="text-muted-foreground">القيمة:</span> <span className="font-medium">{(ret.totalValue ?? 0).toLocaleString()} جنيه مصري</span></div>
                </div>
                <div className="rounded-md border border-border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>الصنف</TableHead>
                        <TableHead>الكمية المرتجعة</TableHead>
                        <TableHead>الوحدة</TableHead>
                        <TableHead>السبب</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(ret.items as any[]).map((it: any, idx: number) => (
                        <TableRow key={idx}>
                          <TableCell>{it.name || '-'}</TableCell>
                          <TableCell>{String(it.returnedQty || '-')}</TableCell>
                          <TableCell>{it.unit || '-'}</TableCell>
                          <TableCell>{it.reason || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => handleDownloadReturn(ret)}>
                    <Download className="ml-2 h-4 w-4" /> تنزيل
                  </Button>
                  <Button onClick={() => handlePrintReturn(ret)}>
                    <Printer className="ml-2 h-4 w-4" /> طباعة
                  </Button>
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default PurchaseReturns;