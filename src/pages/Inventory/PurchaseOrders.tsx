import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { 
  Plus, Save, Send, FileText, Search, Calendar, Users, DollarSign, 
  CheckCircle, Clock, AlertCircle, Upload, Eye, Mail, Phone, Package, 
  Printer, Star, TrendingUp, BarChart3, Building2, Truck, Shield, 
  Award, ShoppingCart, CreditCard, FileCheck, MapPin, Activity,
  Calculator, Trash2, Edit, Archive
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useGetAllSuppliersQuery } from "@/services/suppliersApi";
import { useListRequisitionsQuery, useGetRequisitionQuery } from "@/services/procurementApi";
import { useListPurchaseOrdersQuery, useCreatePurchaseOrderMutation } from "@/services/purchaseOrdersApi";

const PurchaseOrders = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("new");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewPO, setPreviewPO] = useState<any | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  useEffect(() => {
    const update = () => {
      const container = listRef.current;
      if (!container) return;
      const active = container.querySelector('[role="tab"][data-state="active"]') as HTMLElement | null;
      if (!active) return;
      const left = active.offsetLeft - container.scrollLeft;
      const width = active.offsetWidth;
      setIndicator({ left, width });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [activeTab]);

  const [purchaseOrder, setPurchaseOrder] = useState({
    poNumber: `PO-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
    requisitionId: undefined as number | undefined,
    supplierId: undefined as number | undefined,
    createdDate: new Date().toISOString().split('T')[0],
    expectedDeliveryDate: "",
    paymentTerms: "",
    deliveryTerms: "",
    notes: "",
    status: "draft" as "draft" | "sent" | "confirmed" | "in_progress" | "completed" | "cancelled",
    totalAmount: 0,
    items: [
      { id: 1, name: "", quantity: "", unit: "", price: "", specifications: "", total: 0 }
    ]
  });

  // أوامر الشراء المخزنة محلياً والعقود
  const [localPOs, setLocalPOs] = useState<any[]>([]);
  const [contracts, setContracts] = useState<any[]>([]);

  // Backend data
  const { data: suppliersData } = useGetAllSuppliersQuery(undefined);
  const { data: requisitionsData } = useListRequisitionsQuery({ limit: 100 });
  const { data: purchaseOrdersData, refetch: refetchPOs } = useListPurchaseOrdersQuery({});
  const [createPurchaseOrder, { isLoading: isCreatingPO }] = useCreatePurchaseOrderMutation();

  // Normalize backend responses
  const normalizeArray = (data: any, key: string): any[] => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (data.data && Array.isArray(data.data)) return data.data;
    if (data.data && Array.isArray(data.data[key])) return data.data[key];
    if (data[key] && Array.isArray(data[key])) return data[key];
    return [];
  };
  const suppliers = normalizeArray(suppliersData, "suppliers");
  const purchaseRequests = normalizeArray(requisitionsData, "data");
  const backendPOs = normalizeArray(purchaseOrdersData, "");

  // إضافة console.log للتشخيص
  console.log('بيانات الموردين:', suppliersData);
  console.log('بيانات طلبات الشراء:', requisitionsData);
  console.log('طلبات الشراء المعالجة:', purchaseRequests);
  if (purchaseRequests.length > 0) {
    console.log('أول طلب شراء:', purchaseRequests[0]);
    console.log('مفاتيح أول طلب شراء:', Object.keys(purchaseRequests[0]));
    console.log('جميع بيانات أول طلب شراء:', JSON.stringify(purchaseRequests[0], null, 2));
  }

  // Requisition details fetch when selected
  const [selectedReqId, setSelectedReqId] = useState<number | undefined>(undefined);
  const { data: selectedReqData } = useGetRequisitionQuery(selectedReqId as number, { skip: !selectedReqId });

  // معالجة البيانات عند تغيير selectedReqData
  useEffect(() => {
    if (selectedReqData && selectedReqId) {
      console.log('تم جلب بيانات الطلب من API:', selectedReqData);
      console.log('الأصناف من API:', selectedReqData.items);
      console.log('مفاتيح البيانات من API:', Object.keys(selectedReqData));
      
      // فحص وجود الأصناف في البيانات
      let itemsToProcess: any[] = [];
      
      if (selectedReqData.items && Array.isArray(selectedReqData.items)) {
        itemsToProcess = selectedReqData.items;
      } else if (selectedReqData.items && typeof selectedReqData.items === 'object') {
        // إذا كان items كائن وليس array
        itemsToProcess = Object.values(selectedReqData.items);
      } else if (selectedReqData.data && selectedReqData.data.items) {
        // إذا كانت البيانات في حقل data
        itemsToProcess = Array.isArray(selectedReqData.data.items) ? selectedReqData.data.items : [];
      }
      
      console.log('الأصناف المعالجة:', itemsToProcess);
      
      if (itemsToProcess.length > 0) {
        const mappedItems = itemsToProcess.map((it: any, idx: number) => {
          const quantity = Number(it.quantity || 0);
          const price = Number(it.estimatedPrice || it.price || 0);
          return {
            id: it.id || Date.now() + idx,
            name: it.name || "",
            quantity: String(quantity || 0),
            unit: it.unit || "",
            price: String(price || 0),
            specifications: it.specifications || "",
            total: Number((quantity || 0) * (price || 0)),
          };
        });
        const totalAmount = mappedItems.reduce((s: number, x: any) => s + Number(x.total || 0), 0);
        
        setPurchaseOrder(prev => ({
          ...prev,
          items: mappedItems,
          totalAmount
        }));
        
        toast({ 
          title: "✅ تم تحميل الأصناف", 
          description: `تم تحميل ${mappedItems.length} صنفًا من API` 
        });
      } else {
        console.log('لا توجد أصناف في البيانات من API');
        toast({ 
          title: "⚠️ تنبيه", 
          description: "لم يتم العثور على أصناف في هذا الطلب", 
          variant: "destructive" 
        });
      }
    }
  }, [selectedReqData, selectedReqId]);

  // Helpers
  const generatePoNumber = () => {
    const year = new Date().getFullYear();
    return `PO-${year}-${Date.now().toString().slice(-6)}`;
  };

  const isCompleteItem = (it: any) => {
    const nameOk = Boolean(it.name && String(it.name).trim().length > 0);
    const unitOk = Boolean(it.unit && String(it.unit).trim().length > 0);
    const quantityOk = Number(it.quantity) > 0;
    const priceOk = Number(it.price) >= 0;
    return nameOk && unitOk && quantityOk && priceOk;
  };

  // تحميل البيانات من التخزين المحلي عند الفتح
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('purchase_orders') || '[]');
      setLocalPOs(Array.isArray(saved) ? saved : []);
      const savedContracts = JSON.parse(localStorage.getItem('contracts') || '[]');
      setContracts(Array.isArray(savedContracts) ? savedContracts : []);
    } catch (e) {
      setLocalPOs([]);
      setContracts([]);
    }
  }, []);

  // حفظ أمر شراء محلياً وتحديث الحالة
  const savePOToLocal = (po: any) => {
    const saved = JSON.parse(localStorage.getItem('purchase_orders') || '[]');
    const next = [...saved, po];
    localStorage.setItem('purchase_orders', JSON.stringify(next));
    setLocalPOs(next);
  };

  // تحديث حالة أمر شراء حسب المعرّف
  const updatePOStatus = (id: number | string, status: string) => {
    const saved = JSON.parse(localStorage.getItem('purchase_orders') || '[]');
    const next = saved.map((p: any) => p.id === id ? { ...p, status } : p);
    localStorage.setItem('purchase_orders', JSON.stringify(next));
    setLocalPOs(next);
  };

  // إضافة عقد جديد وتحديث التخزين المحلي
  const addContract = () => {
    const newContract = {
      id: Date.now(),
      code: `CT-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
      supplier: (suppliers && suppliers[0]?.name_ar) || "مورد جديد",
      type: "عقد سنوي",
      startDate: new Date().toISOString().slice(0,10),
      endDate: new Date(Date.now() + 1000*60*60*24*180).toISOString().slice(0,10),
      value: 100000,
      status: "نشط"
    };
    const next = [...contracts, newContract];
    setContracts(next);
    localStorage.setItem('contracts', JSON.stringify(next));
    toast({ title: "✅ تم إضافة عقد جديد", description: `تم إنشاء ${newContract.code}` });
  };

  // جميع الأوامر من الواجهة الخلفية
  const getAllOrders = () => {
    const orders = (backendPOs || []).map((o: any) => ({
      id: o.id,
      poNumber: o.poNumber,
      prNumber: o.requisition?.requestNumber || '-',
      supplier: o.supplier?.name_ar || o.supplier?.name_en || '-',
      date: o.createdDate,
      deliveryDate: o.expectedDeliveryDate || '-',
      total: Number(o.totalAmount || 0),
      status: o.status,
      items: Array.isArray(o.items) ? o.items : [],
      paymentTerms: o.paymentTerms || '-'
    }));
    return orders;
  };

  // ضمان وجود الأمر في التخزين المحلي والتحديث حسب رقم الأمر
  const upsertLocalOrder = (po: any) => {
    const saved: any[] = JSON.parse(localStorage.getItem('purchase_orders') || '[]');
    const idx = saved.findIndex(p => p.poNumber === po.poNumber);
    if (idx >= 0) saved[idx] = { ...saved[idx], ...po };
    else saved.push(po);
    localStorage.setItem('purchase_orders', JSON.stringify(saved));
    setLocalPOs(saved);
  };

  // معاينة أي أمر (من القائمة)
  const previewOrder = (po: any) => {
    setPreviewPO(po);
    setPreviewOpen(true);
  };

  const handlePreview = () => {
    const supplierName = suppliers.find((s: any) => s.supplier_id === purchaseOrder.supplierId)?.name_ar || '';
    const mapped = {
      poNumber: purchaseOrder.poNumber,
      supplier: supplierName,
      date: purchaseOrder.createdDate,
      items: purchaseOrder.items,
      total: purchaseOrder.totalAmount,
    };
    setPreviewPO(mapped);
    setPreviewOpen(true);
  };


  // حذف بيانات الموردين الوهمية واستبدالها ببيانات الخلفية (suppliers)

  // حذف قائمة أوامر الشراء الوهمية

  // حذف طلبات الشراء الوهمية (سيتم استخدام بيانات الخلفية من requisitions)

  // === تقارير وتحليلات ===
  const getOrdersAnalytics = () => {
    const orders = getAllOrders();
    const count = orders.length;
    const total = orders.reduce((s: number, o: any) => s + (Number(o.total) || 0), 0);
    const avg = count ? Math.round(total / count) : 0;
    const executed = orders.filter((o: any) => o.status && o.status !== 'draft').length;
    const executionRate = count ? Math.round((executed / count) * 100) : 0;

    const bySupplier: Record<string, { supplier: string; count: number; total: number }>
      = orders.reduce((acc: Record<string, { supplier: string; count: number; total: number }>, o: any) => {
        const key = o.supplier || '-';
        if (!acc[key]) acc[key] = { supplier: key, count: 0, total: 0 };
        acc[key].count += 1;
        acc[key].total += Number(o.total) || 0;
        return acc;
      }, {});
    const suppliersPerf = Object.values(bySupplier).sort((a, b) => b.count - a.count).slice(0, 3);

    const prMap = new Map(purchaseRequests.map((pr: any) => [pr.requestNumber, Number(pr.estimatedValue) || 0]));
    const withPR = orders.filter((o: any) => o.prNumber && o.prNumber !== '-');
    const prTotal = withPR.reduce((s: number, o: any) => s + (prMap.get(o.prNumber) || 0), 0);
    const poTotal = withPR.reduce((s: number, o: any) => s + (Number(o.total) || 0), 0);
    const savings = Math.max(0, prTotal - poTotal);
    const savingsRate = prTotal ? Math.round((savings / prTotal) * 100) : 0;

    return { count, total, avg, executionRate, suppliersPerf, savings, prTotal, poTotal, savingsRate };
  };

  const downloadCSV = (filename: string, rows: (string | number)[][]) => {
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportOrdersReport = () => {
    const orders = getAllOrders();
    const rows: (string | number)[][] = [
      ['PO Number', 'PR Number', 'Supplier', 'Date', 'Delivery Date', 'Total', 'Status']
    ];
    orders.forEach((o: any) => {
      rows.push([o.poNumber, o.prNumber, o.supplier, o.date, o.deliveryDate, Number(o.total) || 0, o.status]);
    });
    downloadCSV('purchase-orders.csv', rows);
  };

  const exportSuppliersReport = () => {
    const { suppliersPerf } = getOrdersAnalytics();
    const rows: (string | number)[][] = [['Supplier', 'Orders', 'Total']];
    suppliersPerf.forEach((s) => rows.push([s.supplier, s.count, s.total]));
    downloadCSV('suppliers-performance.csv', rows);
  };

  const exportSavingsReport = () => {
    const { prTotal, poTotal, savings, savingsRate } = getOrdersAnalytics();
    const rows: (string | number)[][] = [['PR Total', 'PO Total', 'Savings', 'Savings %'], [prTotal, poTotal, savings, `${savingsRate}%`]];
    downloadCSV('savings.csv', rows);
  };

  const exportContractsReport = () => {
    const rows: (string | number)[][] = [['Code', 'Supplier', 'Type', 'Start', 'End', 'Value', 'Status']];
    contracts.forEach((c: any) => rows.push([c.code, c.supplier, c.type, c.startDate, c.endDate, Number(c.value) || 0, c.status]));
    downloadCSV('contracts.csv', rows);
  };

  const addItem = () => {
    setPurchaseOrder({
      ...purchaseOrder,
      items: [...purchaseOrder.items, { 
        id: Date.now(), 
        name: "", 
        quantity: "", 
        unit: "", 
        price: "",
        specifications: "",
        total: 0
      }]
    });
  };

  const removeItem = (id: number) => {
    setPurchaseOrder({
      ...purchaseOrder,
      items: purchaseOrder.items.filter(item => item.id !== id)
    });
  };

  const updateItem = (id: number, field: string, value: string) => {
    const updatedItems = purchaseOrder.items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'price') {
          const quantity = parseFloat(updatedItem.quantity) || 0;
          const price = parseFloat(updatedItem.price) || 0;
          updatedItem.total = quantity * price;
        }
        return updatedItem;
      }
      return item;
    });
    
    const totalAmount = updatedItems.reduce((sum, item) => sum + item.total, 0);
    
    setPurchaseOrder({
      ...purchaseOrder,
      items: updatedItems,
      totalAmount
    });
  };

  const handleSave = async () => {
    try {
      // Generate a fresh PO number to avoid unique conflicts
      const poNumberLocal = purchaseOrder.poNumber && purchaseOrder.poNumber.trim().length > 0 ? purchaseOrder.poNumber : generatePoNumber();
      const cleanItems = (purchaseOrder.items || []).filter(isCompleteItem).map((it: any) => ({
        name: it.name,
        quantity: Number(it.quantity || 0),
        unit: it.unit || "",
        price: Number(it.price || 0),
        specifications: it.specifications || "",
        total: Number(it.total || 0),
      }));
      const totalCalculated = cleanItems.reduce((s: number, x: any) => s + Number(x.total || 0), 0);
      if (!purchaseOrder.supplierId) {
        toast({ title: "❌ خطأ في البيانات", description: "يجب اختيار مورد", variant: "destructive" });
        return;
      }
      const body = {
        poNumber: poNumberLocal,
        requisitionId: purchaseOrder.requisitionId || null,
        supplierId: purchaseOrder.supplierId,
        createdDate: purchaseOrder.createdDate,
        expectedDeliveryDate: purchaseOrder.expectedDeliveryDate || null,
        paymentTerms: purchaseOrder.paymentTerms || null,
        deliveryTerms: purchaseOrder.deliveryTerms || null,
        notes: purchaseOrder.notes || null,
        status: "draft",
        totalAmount: Number(totalCalculated || purchaseOrder.totalAmount || 0),
        items: cleanItems,
      };
      try {
        await createPurchaseOrder(body).unwrap();
      } catch (err: any) {
        const msg = err?.data?.message || err?.error || "";
        if (typeof msg === "string" && msg.toLowerCase().includes("unique")) {
          // Retry once with a new number in case of unique key collision
          const retryBody = { ...body, poNumber: generatePoNumber() };
          await createPurchaseOrder(retryBody).unwrap();
        } else {
          throw err;
        }
      }
      toast({ title: "✅ تم حفظ أمر الشراء", description: "تم حفظ أمر الشراء كمسودة في النظام" });
      refetchPOs();
    } catch (e: any) {
      const details = e?.data?.message || e?.error || "";
      toast({ title: "❌ فشل الحفظ", description: details ? String(details) : "تعذر حفظ أمر الشراء في قاعدة البيانات.", variant: "destructive" });
    }
  };

  const handleSend = async () => {
    if (!purchaseOrder.supplierId) {
      toast({ title: "❌ خطأ في البيانات", description: "يجب اختيار مورد لإرسال أمر الشراء", variant: "destructive" });
      return;
    }
    if (!purchaseOrder.expectedDeliveryDate || !purchaseOrder.paymentTerms || purchaseOrder.totalAmount <= 0) {
      toast({ title: "❌ بيانات ناقصة", description: "يجب تعبئة تاريخ التسليم وشروط الدفع والمبلغ الإجمالي", variant: "destructive" });
      return;
    }
    try {
      const poNumberLocal = purchaseOrder.poNumber && purchaseOrder.poNumber.trim().length > 0 ? purchaseOrder.poNumber : generatePoNumber();
      const cleanItems = (purchaseOrder.items || []).filter(isCompleteItem).map((it: any) => ({
        name: it.name,
        quantity: Number(it.quantity || 0),
        unit: it.unit || "",
        price: Number(it.price || 0),
        specifications: it.specifications || "",
        total: Number(it.total || 0),
      }));
      const totalCalculated = cleanItems.reduce((s: number, x: any) => s + Number(x.total || 0), 0);
      const body = {
        poNumber: poNumberLocal,
        requisitionId: purchaseOrder.requisitionId || null,
        supplierId: purchaseOrder.supplierId,
        createdDate: purchaseOrder.createdDate,
        expectedDeliveryDate: purchaseOrder.expectedDeliveryDate || null,
        paymentTerms: purchaseOrder.paymentTerms || null,
        deliveryTerms: purchaseOrder.deliveryTerms || null,
        notes: purchaseOrder.notes || null,
        status: "sent",
        totalAmount: Number(totalCalculated || purchaseOrder.totalAmount || 0),
        items: cleanItems,
      };
      try {
        await createPurchaseOrder(body).unwrap();
      } catch (err: any) {
        const msg = err?.data?.message || err?.error || "";
        if (typeof msg === "string" && msg.toLowerCase().includes("unique")) {
          const retryBody = { ...body, poNumber: generatePoNumber() };
          await createPurchaseOrder(retryBody).unwrap();
        } else {
          throw err;
        }
      }
      const supplier = suppliers.find((s: any) => s.supplier_id === purchaseOrder.supplierId);
      toast({ title: "✅ تم إرسال أمر الشراء", description: `تم إرسال ${purchaseOrder.poNumber} إلى ${supplier?.name_ar || supplier?.name_en || ''}` });
      refetchPOs();
      setPurchaseOrder({
        poNumber: `PO-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
        requisitionId: undefined,
        supplierId: undefined,
        createdDate: new Date().toISOString().split('T')[0],
        expectedDeliveryDate: "",
        paymentTerms: "",
        deliveryTerms: "",
        notes: "",
        status: "draft",
        totalAmount: 0,
        items: [
          { id: 1, name: "", quantity: "", unit: "", price: "", specifications: "", total: 0 }
        ]
      });
    } catch (e: any) {
      const details = e?.data?.message || e?.error || "";
      toast({ title: "❌ فشل الإرسال", description: details ? String(details) : "تعذر إنشاء أمر الشراء في قاعدة البيانات.", variant: "destructive" });
    }
  };

  const getStatusBadge = (status: string) => {
    const toArabic: Record<string, string> = {
      draft: "مسودة",
      sent: "مرسل",
      confirmed: "مؤكد",
      in_progress: "قيد التنفيذ",
      completed: "مكتمل",
      cancelled: "ملغي",
    };
    const arabic = toArabic[status] || status;
    const variants = {
      "مسودة": "secondary",
      "مرسل": "default",
      "مؤكد": "default",
      "قيد التنفيذ": "default",
      "مكتمل": "default",
      "ملغي": "destructive"
    } as const;
    const icons = {
      "مسودة": <Edit className="w-3 h-3 mr-1" />,
      "مرسل": <Send className="w-3 h-3 mr-1" />,
      "مؤكد": <CheckCircle className="w-3 h-3 mr-1" />,
      "قيد التنفيذ": <Clock className="w-3 h-3 mr-1" />,
      "مكتمل": <CheckCircle className="w-3 h-3 mr-1" />,
      "ملغي": <AlertCircle className="w-3 h-3 mr-1" />
    } as const;
    return (
      <Badge variant={variants[arabic as keyof typeof variants]}>
        {icons[arabic as keyof typeof icons]}
        {arabic}
      </Badge>
    );
  };

  const getSupplierRecommendation = (supplierId: number | undefined) => {
    const supplier: any = suppliers.find((s: any) => s.supplier_id === supplierId);
    if (!supplier) return null;
    
    return (
      <div className="mt-3 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-blue-900">تقييم المورد المتقدم</span>
          </div>
          <Badge variant="outline" className="bg-white/60 border-blue-300 text-blue-700">
            {supplier.reliability}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium">{supplier.rating}/5.0</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-green-600" />
              <span className="text-xs text-muted-foreground">{supplier.avgDeliveryTime}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-blue-600" />
              <span className="text-xs text-muted-foreground">{supplier.totalOrders} طلب سابق</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-xs text-muted-foreground">التسليم في الوقت: {supplier.onTimeDelivery}%</span>
            </div>
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t border-blue-200">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-medium text-purple-700">{supplier.contractType}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">أوامر الشراء</h1>
          <p className="text-muted-foreground">
            إصدار ومتابعة أوامر الشراء والتعاقدات مع الموردين وفق أفضل الممارسات
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList ref={listRef} className="relative w-full grid grid-flow-col sm:grid-flow-row auto-cols-[minmax(160px,1fr)] sm:auto-cols-auto sm:grid-cols-6 gap-1 rounded-2xl border border-border bg-background/60 supports-[backdrop-filter]:bg-background/50 backdrop-blur p-1 shadow-sm overflow-x-auto animate-fade-in">
          <span
            className="pointer-events-none absolute bottom-0 h-1 rounded-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-300"
            style={{ left: indicator.left, width: indicator.width }}
          />
          <TabsTrigger value="new" className="relative py-2 px-3 text-sm font-medium text-muted-foreground hover:text-primary data-[state=active]:text-primary data-[state=active]:bg-primary/10 rounded-lg transition-all hover-scale focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
            <Plus className="ml-2 h-4 w-4" />
            أمر شراء جديد
          </TabsTrigger>
          <TabsTrigger value="requests" className="relative py-2 px-3 text-sm font-medium text-muted-foreground hover:text-primary data-[state=active]:text-primary data-[state=active]:bg-primary/10 rounded-lg transition-all hover-scale focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
            <FileText className="ml-2 h-4 w-4" />
            طلبات الشراء
          </TabsTrigger>
          <TabsTrigger value="list" className="relative py-2 px-3 text-sm font-medium text-muted-foreground hover:text-primary data-[state=active]:text-primary data-[state=active]:bg-primary/10 rounded-lg transition-all hover-scale focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
            <Package className="ml-2 h-4 w-4" />
            قائمة الأوامر
          </TabsTrigger>
          <TabsTrigger value="tracking" className="relative py-2 px-3 text-sm font-medium text-muted-foreground hover:text-primary data-[state=active]:text-primary data-[state=active]:bg-primary/10 rounded-lg transition-all hover-scale focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
            <Truck className="ml-2 h-4 w-4" />
            التتبع والمراقبة
          </TabsTrigger>
          <TabsTrigger value="contracts" className="relative py-2 px-3 text-sm font-medium text-muted-foreground hover:text-primary data-[state=active]:text-primary data-[state=active]:bg-primary/10 rounded-lg transition-all hover-scale focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
            <Shield className="ml-2 h-4 w-4" />
            العقود والاتفاقيات
          </TabsTrigger>
          <TabsTrigger value="reports" className="relative py-2 px-3 text-sm font-medium text-muted-foreground hover:text-primary data-[state=active]:text-primary data-[state=active]:bg-primary/10 rounded-lg transition-all hover-scale focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
            <BarChart3 className="ml-2 h-4 w-4" />
            التقارير والتحليلات
          </TabsTrigger>
        </TabsList>

        {/* تبويب إنشاء أمر شراء جديد */}
        <TabsContent value="new" className="space-y-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50/50">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ShoppingCart className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-xl text-blue-900">إصدار أمر شراء جديد</CardTitle>
                  <CardDescription className="text-blue-700/70">تحويل طلب الشراء المعتمد إلى أمر شراء رسمي وفق أفضل الممارسات</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* المعلومات الأساسية */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FileText className="w-5 h-5 ml-2 text-blue-600" />
                  المعلومات الأساسية
                </h3>
                <div className="grid grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="poNumber" className="text-sm font-medium text-gray-700 flex items-center">
                      <Package className="w-4 h-4 ml-1 text-blue-500" />
                      رقم أمر الشراء
                    </Label>
                    <Input 
                      id="poNumber" 
                      value={purchaseOrder.poNumber}
                      disabled
                      className="bg-gray-100 border-gray-300 font-medium text-gray-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prNumber" className="text-sm font-medium text-gray-700 flex items-center">
                      <FileCheck className="w-4 h-4 ml-1 text-green-500" />
                      رقم طلب الشراء
                    </Label>
                    <Select 
                      value={purchaseOrder.requisitionId ? String(purchaseOrder.requisitionId) : ""}
                      onValueChange={(value) => {
                        const idNum = Number(value);
                        setSelectedReqId(idNum);
                        // إذا كانت لدينا عناصر الطلب المختارة ضمن بيانات الطلب المختار، نقوم بتحميلها للأمر
                        const selected = (purchaseRequests || []).find((p: any) => p.id === idNum);
                        console.log('الطلب المختار:', selected);
                        console.log('الأصناف في الطلب المختار:', selected?.items);
                        
                        if (selected) {
                          // تعبئة requisitionId أولاً
                          setPurchaseOrder(prev => ({ ...prev, requisitionId: idNum }));
                          
                          // محاولة جلب البيانات من API
                          setSelectedReqId(idNum);
                          
                          toast({ 
                            title: "⏳ جاري جلب البيانات", 
                            description: "سيتم جلب تفاصيل الأصناف من API..." 
                          });
                        } else {
                          setPurchaseOrder({ ...purchaseOrder, requisitionId: idNum });
                        }
                      }}
                    >
                      <SelectTrigger className="hover:border-green-400 transition-colors">
                        <SelectValue placeholder="اختر طلب الشراء" />
                      </SelectTrigger>
                      <SelectContent>
                        {purchaseRequests.map((pr: any) => (
                          <SelectItem key={pr.id} value={String(pr.id)} className="hover:bg-green-50">
                            <div className="flex flex-col">
                              <span className="font-medium">{pr.requestNumber} - {pr.requestingDepartment}</span>
                              <span className="text-xs text-muted-foreground">{(Number(pr.estimatedValue||0)).toLocaleString()} جنيه</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="createdDate" className="text-sm font-medium text-gray-700 flex items-center">
                      <Calendar className="w-4 h-4 ml-1 text-purple-500" />
                      تاريخ الإنشاء
                    </Label>
                    <Input 
                      id="createdDate" 
                      type="date"
                      value={purchaseOrder.createdDate}
                      disabled
                      className="bg-gray-100 border-gray-300 font-medium text-gray-600"
                    />
                  </div>
                </div>
              </div>

              {/* اختيار المورد مع التوصيات الذكية */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Users className="w-5 h-5 ml-2 text-indigo-600" />
                  اختيار المورد والشروط
                </h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="supplier" className="text-sm font-medium text-gray-700 flex items-center">
                      <Building2 className="w-4 h-4 ml-1 text-indigo-500" />
                      المورد المطلوب
                    </Label>
                    <Select 
                      value={purchaseOrder.supplierId ? String(purchaseOrder.supplierId) : ""}
                      onValueChange={(value) => {
                        const idNum = Number(value);
                        setPurchaseOrder({ ...purchaseOrder, supplierId: idNum });
                        const supplier: any = suppliers.find((s: any) => s.supplier_id === idNum);
                        toast({
                          title: "✅ تم اختيار المورد",
                          description: `تم اختيار ${supplier?.name_ar || supplier?.name_en || ''} بنجاح`,
                        });
                      }}
                    >
                      <SelectTrigger className="hover:border-indigo-400 transition-colors">
                        <SelectValue placeholder="اختر المورد المناسب" />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers.map((supplier: any) => (
                          <SelectItem key={supplier.supplier_id} value={String(supplier.supplier_id)} className="hover:bg-indigo-50">
                            <div className="flex items-center justify-between w-full">
                              <div className="flex flex-col items-start">
                                <span className="font-medium">{supplier.name_ar || supplier.name_en}</span>
                                <span className="text-xs text-muted-foreground">{supplier.contact_person || "—"} - {supplier.phone || supplier.mobile || "—"}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                <span className="text-xs font-medium">{supplier.rating || 4.5}</span>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {purchaseOrder.supplierId && getSupplierRecommendation(Number(purchaseOrder.supplierId))}
                  </div>

                  {/* شروط الدفع والتسليم */}
                  <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="expectedDeliveryDate" className="text-sm font-medium text-gray-700 flex items-center">
                        <Truck className="w-4 h-4 ml-1 text-blue-500" />
                        تاريخ التسليم المتوقع
                      </Label>
                      <Input 
                        id="expectedDeliveryDate" 
                        type="date"
                        value={purchaseOrder.expectedDeliveryDate}
                        onChange={(e) => {
                          setPurchaseOrder({...purchaseOrder, expectedDeliveryDate: e.target.value});
                          toast({
                            title: "📅 تم تحديد تاريخ التسليم",
                            description: `التسليم المتوقع: ${e.target.value}`,
                          });
                        }}
                        className="hover:border-blue-400 transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="paymentTerms" className="text-sm font-medium text-gray-700 flex items-center">
                        <CreditCard className="w-4 h-4 ml-1 text-green-500" />
                        شروط الدفع
                      </Label>
                      <Select 
                        value={purchaseOrder.paymentTerms}
                        onValueChange={(value) => {
                          setPurchaseOrder({...purchaseOrder, paymentTerms: value});
                          toast({
                            title: "💳 تم تحديد شروط الدفع",
                            description: `شروط الدفع: ${value}`,
                          });
                        }}
                      >
                        <SelectTrigger className="hover:border-green-400 transition-colors">
                          <SelectValue placeholder="اختر شروط الدفع" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="advance" className="hover:bg-green-50">مسبق (دفع مقدم)</SelectItem>
                          <SelectItem value="credit30" className="hover:bg-green-50">آجل 30 يوم</SelectItem>
                          <SelectItem value="credit60" className="hover:bg-green-50">آجل 60 يوم</SelectItem>
                          <SelectItem value="installments" className="hover:bg-green-50">دفعات متعددة</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deliveryTerms" className="text-sm font-medium text-gray-700 flex items-center">
                        <MapPin className="w-4 h-4 ml-1 text-red-500" />
                        موقع التسليم
                      </Label>
                      <Input 
                        placeholder="عنوان الفرع أو موقع التسليم"
                        value={purchaseOrder.deliveryTerms}
                        onChange={(e) => setPurchaseOrder({...purchaseOrder, deliveryTerms: e.target.value})}
                        className="hover:border-red-400 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* الأصناف والمواد */}
              <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-xl border border-green-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <Package className="w-5 h-5 ml-2 text-green-600" />
                    أصناف الطلب
                  </h3>
                  <Button 
                    onClick={() => {
                      addItem();
                      toast({
                        title: "✅ تم إضافة صنف جديد",
                        description: "يمكنك الآن تعبئة بيانات الصنف",
                      });
                    }} 
                    variant="outline" 
                    size="sm"
                    className="bg-white hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-all duration-200 shadow-sm"
                  >
                    <Plus className="ml-2 h-4 w-4" />
                    إضافة صنف جديد
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="bg-white rounded-lg border border-green-200 overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gradient-to-r from-green-100 to-teal-100">
                          <TableHead className="font-semibold text-green-800">اسم الصنف</TableHead>
                          <TableHead className="font-semibold text-green-800">الكمية</TableHead>
                          <TableHead className="font-semibold text-green-800">الوحدة</TableHead>
                          <TableHead className="font-semibold text-green-800">السعر (جنيه)</TableHead>
                          <TableHead className="font-semibold text-green-800">الإجمالي (جنيه)</TableHead>
                          <TableHead className="font-semibold text-green-800">المواصفات</TableHead>
                          <TableHead className="font-semibold text-green-800 text-center">الإجراءات</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {purchaseOrder.items.map((item, index) => (
                          <TableRow key={item.id} className="hover:bg-green-50 transition-colors">
                            <TableCell>
                              <Input 
                                placeholder="اسم المادة أو المنتج"
                                value={item.name}
                                onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                                className="border-0 bg-transparent hover:bg-white hover:border-green-300 transition-all"
                              />
                            </TableCell>
                            <TableCell>
                              <Input 
                                type="number"
                                placeholder="0"
                                value={item.quantity}
                                onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                                className="border-0 bg-transparent hover:bg-white hover:border-green-300 transition-all w-20"
                              />
                            </TableCell>
                            <TableCell>
                              <Select 
                                value={item.unit}
                                onValueChange={(value) => updateItem(item.id, 'unit', value)}
                              >
                                <SelectTrigger className="border-0 bg-transparent hover:bg-white hover:border-green-300 transition-all w-24">
                                  <SelectValue placeholder="وحدة" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="piece">  </SelectItem>
                                  <SelectItem value="meter">متر</SelectItem>
                                  <SelectItem value="liter">لتر</SelectItem>
                                  <SelectItem value="kg">كيلوجرام</SelectItem>
                                  <SelectItem value="box">صندوق</SelectItem>
                                  <SelectItem value="carton">كرتون</SelectItem>
                                  <SelectItem value="bottle">زجاجة</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Input 
                                type="number"
                                placeholder="0.00"
                                value={item.price}
                                onChange={(e) => updateItem(item.id, 'price', e.target.value)}
                                className="border-0 bg-transparent hover:bg-white hover:border-orange-300 transition-all w-24"
                              />
                            </TableCell>
                            <TableCell>
                              <div className="font-bold text-indigo-700 bg-indigo-50 rounded px-2 py-1 text-center">
                                {item.total.toFixed(2)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Textarea 
                                placeholder="المواصفات والوصف"
                                value={item.specifications}
                                onChange={(e) => updateItem(item.id, 'specifications', e.target.value)}
                                className="border-0 bg-transparent hover:bg-white hover:border-gray-300 transition-all min-h-[60px] resize-none"
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              {purchaseOrder.items.length > 1 && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    removeItem(item.id);
                                    toast({
                                      title: "🗑️ تم حذف الصنف",
                                      description: "تم حذف الصنف من القائمة",
                                    });
                                  }}
                                  className="text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* إجمالي أمر الشراء */}
                <Card className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-100 border-blue-300 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Calculator className="w-6 h-6 text-blue-600" />
                        <span className="text-lg font-medium text-blue-900">الإجمالي النهائي:</span>
                      </div>
                      <span className="text-3xl font-bold text-blue-800">
                        {purchaseOrder.totalAmount.toLocaleString()} جنيه
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* المرفقات والملاحظات */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Upload className="w-5 h-5 ml-2 text-orange-600" />
                  المرفقات والملاحظات
                </h3>
                
                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="notes" className="text-sm font-medium text-gray-700 flex items-center">
                      <FileText className="w-4 h-4 ml-1 text-orange-500" />
                      ملاحظات وتعليمات إضافية
                    </Label>
                    <Textarea 
                      id="notes"
                      placeholder="أي تعليمات خاصة، شروط إضافية، أو ملاحظات مهمة للمورد"
                      value={purchaseOrder.notes}
                      onChange={(e) => setPurchaseOrder({...purchaseOrder, notes: e.target.value})}
                      className="min-h-[120px] hover:border-orange-400 transition-colors"
                    />
                  </div>

                  <div className="space-y-4">
                    <Label className="text-sm font-medium text-gray-700 flex items-center">
                      <Upload className="w-4 h-4 ml-1 text-red-500" />
                      إرفاق المستندات
                    </Label>
                    <div className="border-2 border-dashed border-orange-300 rounded-lg p-4 text-center bg-white hover:bg-orange-50 transition-colors cursor-pointer">
                      <Upload className="mx-auto h-8 w-8 text-orange-500 mb-2" />
                      <p className="text-sm text-orange-700 font-medium mb-1">
                        اسحب الملفات هنا
                      </p>
                      <p className="text-xs text-orange-600">
                        PDF, DOC, JPG (أقل من 5MB)
                      </p>
                      <Button variant="outline" size="sm" className="mt-2 hover:bg-orange-100 hover:border-orange-300">
                        <Upload className="ml-2 h-3 w-3" />
                        اختيار ملفات
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* أزرار الإجراء */}
              <div className="flex gap-3 justify-end p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200">
                <Button variant="outline" onClick={handleSave} className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200">
                  <Save className="ml-2 h-4 w-4" />
                  حفظ كمسودة
                </Button>
                <Button variant="outline" onClick={handlePreview} className="hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-all duration-200">
                  <Eye className="ml-2 h-4 w-4" />
                  معاينة PDF
                </Button>
                <Button onClick={handleSend} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200">
                  <Send className="ml-2 h-4 w-4" />
                  إرسال للمورد
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* تبويب طلبات الشراء المعتمدة */}
        <TabsContent value="requests" className="space-y-6">
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg border-b border-green-100">
              <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                طلبات الشراء المعتمدة
              </CardTitle>
              <CardDescription className="text-slate-600 text-lg">
                تحويل طلبات الشراء المعتمدة إلى أوامر شراء رسمية
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              {/* شريط البحث والفلاتر */}
              <div className="flex flex-col lg:flex-row items-center gap-4 mb-8 p-6 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex-1 w-full">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input 
                      placeholder="البحث في طلبات الشراء..." 
                      className="pl-10 border-slate-200 focus:border-green-500 transition-colors"
                    />
                  </div>
                </div>
                <Select>
                  <SelectTrigger className="w-48 border-slate-200 focus:border-green-500 transition-colors">
                    <SelectValue placeholder="حالة الطلب" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الحالات</SelectItem>
                    <SelectItem value="approved">معتمد</SelectItem>
                    <SelectItem value="pending">بانتظار الموافقة</SelectItem>
                    <SelectItem value="draft">مسودة</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-48 border-slate-200 focus:border-green-500 transition-colors">
                    <SelectValue placeholder="القسم" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الأقسام</SelectItem>
                    <SelectItem value="maintenance">قسم الصيانة</SelectItem>
                    <SelectItem value="sales">قسم المبيعات</SelectItem>
                    <SelectItem value="admin">الإدارة العامة</SelectItem>
                    <SelectItem value="operations">العمليات</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* جدول طلبات الشراء */}
              <div className="overflow-hidden rounded-xl border border-slate-200">
              <Table>
                <TableHeader>
                    <TableRow className="bg-gradient-to-r from-slate-50 to-green-50 hover:bg-slate-100">
                      <TableHead className="text-slate-700 font-semibold">رقم الطلب</TableHead>
                      <TableHead className="text-slate-700 font-semibold">رقم الطلب المرجعي</TableHead>
                      <TableHead className="text-slate-700 font-semibold">القسم</TableHead>
                      <TableHead className="text-slate-700 font-semibold">التاريخ</TableHead>
                      <TableHead className="text-slate-700 font-semibold">المبلغ التقديري</TableHead>
                      <TableHead className="text-slate-700 font-semibold">عدد الأصناف</TableHead>
                      <TableHead className="text-slate-700 font-semibold">الحالة</TableHead>
                      <TableHead className="text-slate-700 font-semibold">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                    {purchaseRequests && purchaseRequests.length > 0 ? (
                      purchaseRequests.map((request) => (
                        <TableRow key={request.id} className="hover:bg-slate-50 transition-colors">
                          <TableCell className="font-medium text-slate-800">
                            <div className="flex items-center gap-2">
                              <div className="p-2 bg-blue-100 rounded-full">
                                <FileText className="w-4 h-4 text-blue-600" />
                              </div>
                              {request.id}
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-700 font-medium">
                            {request.requestNumber || `PR-${request.id}`}
                          </TableCell>
                      <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="p-2 bg-green-100 rounded-full">
                                <Building2 className="w-4 h-4 text-green-600" />
                              </div>
                              {request.requestingDepartment || 'غير محدد'}
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-700">
                            {request.createdAt ? new Date(request.createdAt).toISOString().split('T')[0] : 'غير محدد'}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <div className="p-1 bg-green-100 rounded-full">
                                <DollarSign className="h-4 w-4 text-green-600" />
                              </div>
                              <span className="font-medium text-green-700">
                                {Number(request.estimatedValue || 0).toLocaleString()} جنيه
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <div className="p-1 bg-blue-100 rounded-full">
                                <Package className="h-4 w-4 text-blue-600" />
                              </div>
                              <span className="font-medium">
                                {(() => {
                                  // إضافة console.log للتشخيص
                                  console.log('بيانات الطلب:', request);
                                  console.log('الأصناف:', request.items);
                                  console.log('نوع البيانات:', typeof request.items);
                                  console.log('هل هو array:', Array.isArray(request.items));
                                  
                                  if (Array.isArray(request.items)) {
                                    return request.items.length;
                                  } else if (request.items && typeof request.items === 'object') {
                                    // إذا كان items كائن وليس array
                                    return Object.keys(request.items).length;
                                  } else if (request.itemsCount) {
                                    // إذا كان هناك حقل itemsCount منفصل
                                    return request.itemsCount;
                                  } else {
                                    return 0;
                                  }
                                })()}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {request.status === 'approved' ? (
                              <Badge className="bg-green-100 text-green-800 border-green-300 font-medium">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                معتمد
                        </Badge>
                            ) : request.status === 'pending' ? (
                              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 font-medium">
                                <Clock className="w-3 h-3 mr-1" />
                                بانتظار الموافقة
                              </Badge>
                            ) : request.status === 'draft' ? (
                              <Badge className="bg-slate-100 text-slate-800 border-slate-300 font-medium">
                                <Edit className="w-3 h-3 mr-1" />
                                مسودة
                              </Badge>
                            ) : (
                              <Badge className="bg-slate-100 text-slate-800 border-slate-300 font-medium">
                                {request.status || 'غير محدد'}
                              </Badge>
                            )}
                      </TableCell>
                      <TableCell>
                            <Button 
                              size="sm" 
                              onClick={() => {
                                // تعبئة بيانات الطلب في نموذج أمر الشراء
                                console.log('جاري تحميل طلب الشراء:', request);
                                console.log('الأصناف في الطلب:', request.items);
                                console.log('مفاتيح الطلب:', Object.keys(request));
                                
                                // جلب تفاصيل الطلب من API مباشرة
                                console.log('جلب تفاصيل الطلب من API...');
                                setSelectedReqId(request.id);
                                
                                // تعبئة البيانات الأساسية أولاً
                                setPurchaseOrder(prev => ({
                                  ...prev,
                                  requisitionId: request.id
                                }));
                                
                                // الانتقال لتبويب أمر الشراء
                                setActiveTab("new");
                                
                                toast({ 
                                  title: "⏳ جاري جلب البيانات", 
                                  description: "سيتم جلب تفاصيل الأصناف من API..." 
                                });
                                
                                // سيتم تحميل الأصناف تلقائياً عبر useEffect عند وصول selectedReqData
                              }}
                              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                          <Plus className="ml-2 h-4 w-4" />
                          تحويل لأمر شراء
                        </Button>
                      </TableCell>
                    </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          <div className="flex flex-col items-center gap-3 text-slate-500">
                            <FileText className="h-12 w-12 text-slate-400" />
                            <div>
                              <p className="text-lg font-medium text-slate-900 mb-1">لا توجد طلبات شراء</p>
                              <p className="text-sm">لم يتم العثور على طلبات شراء في النظام</p>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                </TableBody>
              </Table>
              </div>

              {/* معلومات إضافية */}
              <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-200 rounded-full">
                    <span className="text-green-700 text-lg">💡</span>
                  </div>
                  <div>
                    <p className="text-green-800 font-medium mb-1">كيفية التحويل:</p>
                    <p className="text-green-700 text-sm leading-relaxed">
                      1. اختر طلب الشراء المعتمد من القائمة أعلاه
                      2. اضغط على "تحويل لأمر شراء" 
                      3. سيتم تحميل جميع الأصناف تلقائياً في نموذج أمر الشراء
                      4. أكمل باقي البيانات وأرسل الأمر للمورد
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* تبويب قائمة أوامر الشراء */}
        <TabsContent value="list" className="space-y-6">
          {/* إحصائيات سريعة */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 font-medium">إجمالي الأوامر</p>
                    <p className="text-2xl font-bold text-blue-900">{getAllOrders().length}</p>
                  </div>
                  <Package className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 font-medium">مكتملة</p>
                    <p className="text-2xl font-bold text-green-900">
                      {getAllOrders().filter(po => po.status === "completed").length}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-yellow-600 font-medium">قيد التنفيذ</p>
                    <p className="text-2xl font-bold text-yellow-900">
                      {getAllOrders().filter(po => po.status === "in_progress").length}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-600 font-medium">القيمة الإجمالية</p>
                    <p className="text-2xl font-bold text-purple-900">
                      {getAllOrders().reduce((sum, po) => sum + (Number(po.total) || 0), 0).toLocaleString()}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-blue-900">قائمة أوامر الشراء</CardTitle>
                  <CardDescription className="text-blue-700/70">جميع أوامر الشراء المُصدرة ومتابعة حالتها بالتفصيل</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input 
                        placeholder="البحث في أوامر الشراء..." 
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="حالة الأمر" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الحالات</SelectItem>
                      <SelectItem value="draft">مسودة</SelectItem>
                      <SelectItem value="sent">مرسل</SelectItem>
                      <SelectItem value="confirmed">مؤكد</SelectItem>
                      <SelectItem value="inprogress">قيد التنفيذ</SelectItem>
                      <SelectItem value="completed">مكتمل</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>رقم الأمر</TableHead>
                      <TableHead>رقم الطلب</TableHead>
                      <TableHead>المورد</TableHead>
                      <TableHead>التاريخ</TableHead>
                      <TableHead>التسليم</TableHead>
                      <TableHead>المبلغ</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getAllOrders().map((po) => (
                      <TableRow key={po.id}>
                        <TableCell className="font-medium">{po.poNumber}</TableCell>
                        <TableCell>{po.prNumber}</TableCell>
                        <TableCell>{po.supplier}</TableCell>
                        <TableCell>{po.date}</TableCell>
                        <TableCell>{po.deliveryDate}</TableCell>
                        <TableCell>{Number(po.total).toLocaleString()} جنيه</TableCell>
                        <TableCell>{getStatusBadge(po.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => previewOrder(po)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => previewOrder(po)}>
                              <Printer className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => {
                              toast({ title: '📧 إرسال', description: 'استخدم شاشة التفاصيل لتحديث الحالة (ميزة قادمة).' });
                            }}>
                              <Mail className="h-4 w-4" />
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

        {/* تبويب التتبع والمراقبة */}
        <TabsContent value="tracking" className="space-y-6">
          {/* مؤشرات الأداء الرئيسية */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 font-medium">معدل التأكيد</p>
                    <p className="text-3xl font-bold text-green-900">87%</p>
                    <p className="text-xs text-green-600 mt-1">+5% من الشهر الماضي</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <Progress value={87} className="mt-2 h-2" />
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-100 border-blue-200 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 font-medium">التسليم في الوقت</p>
                    <p className="text-3xl font-bold text-blue-900">92%</p>
                    <p className="text-xs text-blue-600 mt-1">+3% من الشهر الماضي</p>
                  </div>
                  <Truck className="w-8 h-8 text-blue-600" />
                </div>
                <Progress value={92} className="mt-2 h-2" />
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-violet-100 border-purple-200 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-600 font-medium">رضا الموردين</p>
                    <p className="text-3xl font-bold text-purple-900">4.6</p>
                    <p className="text-xs text-purple-600 mt-1">من أصل 5.0</p>
                  </div>
                  <Star className="w-8 h-8 text-purple-600 fill-current" />
                </div>
                <div className="flex items-center mt-2">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className={`w-3 h-3 ${star <= 4.6 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-orange-50 to-amber-100 border-orange-200 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-orange-600 font-medium">متوسط وقت المعالجة</p>
                    <p className="text-3xl font-bold text-orange-900">2.4</p>
                    <p className="text-xs text-orange-600 mt-1">أيام</p>
                  </div>
                  <Activity className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* تفاصيل التتبع */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="shadow-lg border-l-4 border-l-blue-500">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardTitle className="flex items-center text-blue-900">
                  <Mail className="ml-2 h-5 w-5 text-blue-600" />
                  سجل الإرسال المتقدم
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4 bg-blue-50 p-3 rounded-r-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-blue-900">PO-2024-001</p>
                        <p className="text-sm text-blue-700">أُرسل إلى شركة التوريدات</p>
                      </div>
                      <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">اليوم 10:30</span>
                    </div>
                    <div className="mt-2">
                      <Badge variant="outline" className="text-xs bg-green-100 text-green-800 border-green-300">
                        ✅ تم فتح الإيميل
                      </Badge>
                    </div>
                  </div>
                  <div className="border-l-4 border-yellow-500 pl-4 bg-yellow-50 p-3 rounded-r-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-yellow-900">PO-2024-002</p>
                        <p className="text-sm text-yellow-700">أُرسل إلى مؤسسة الخليج</p>
                      </div>
                      <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded">أمس 14:20</span>
                    </div>
                    <div className="mt-2">
                      <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800 border-yellow-300">
                        ⏳ في انتظار التأكيد
                      </Badge>
                    </div>
                  </div>
                  
                  <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700" onClick={() => {
                    toast({
                      title: "📧 تم تحديث سجل الإرسال",
                      description: "تم تحديث جميع حالات الإرسال بنجاح",
                    });
                  }}>
                    <Mail className="ml-2 h-4 w-4" />
                    تحديث سجل الإرسال
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-l-4 border-l-green-500">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                <CardTitle className="flex items-center text-green-900">
                  <CheckCircle className="ml-2 h-5 w-5 text-green-600" />
                  تحليل حالة التأكيد
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="font-medium text-green-800">أوامر مؤكدة</span>
                    <span className="font-bold text-green-700 text-xl">8</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                    <span className="font-medium text-yellow-800">في انتظار التأكيد</span>
                    <span className="font-bold text-yellow-700 text-xl">3</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <span className="font-medium text-red-800">مرفوضة</span>
                    <span className="font-bold text-red-700 text-xl">1</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full shadow-inner" style={{width: '67%'}}></div>
                  </div>
                  <p className="text-sm text-green-700 font-medium text-center">معدل التأكيد: 67%</p>
                  
                  <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => {
                    toast({
                      title: "✅ تم تحديث حالات التأكيد",
                      description: "تم مزامنة جميع حالات التأكيد مع الموردين",
                    });
                  }}>
                    <CheckCircle className="ml-2 h-4 w-4" />
                    تحديث حالات التأكيد
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-l-4 border-l-purple-500">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50">
                <CardTitle className="flex items-center text-purple-900">
                  <Truck className="ml-2 h-5 w-5 text-purple-600" />
                  تتبع التسليم والجودة
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="font-medium text-green-800">تم التسليم</span>
                    <span className="font-bold text-green-700 text-xl">6</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="font-medium text-blue-800">قيد التوريد</span>
                    <span className="font-bold text-blue-700 text-xl">4</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <span className="font-medium text-red-800">متأخر</span>
                    <span className="font-bold text-red-700 text-xl">2</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full shadow-inner" style={{width: '75%'}}></div>
                  </div>
                  <p className="text-sm text-purple-700 font-medium text-center">معدل التسليم في الوقت: 75%</p>
                  
                  <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={() => {
                    toast({
                      title: "🚚 تم تحديث حالات التسليم",
                      description: "تم تحديث مواقع وحالات جميع الشحنات",
                    });
                  }}>
                    <Truck className="ml-2 h-4 w-4" />
                    تتبع الشحنات
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* جدول التتبع التفصيلي */}
          <Card className="shadow-lg bg-gradient-to-br from-white to-gray-50">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Activity className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-blue-900">تفاصيل التتبع الشامل</CardTitle>
                  <CardDescription className="text-blue-700/70">متابعة تفصيلية ومتقدمة لحالة كل أمر شراء مع تحليل الأداء</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead className="font-bold">رقم الأمر</TableHead>
                    <TableHead className="font-bold">المورد</TableHead>
                    <TableHead className="font-bold">حالة الإرسال</TableHead>
                    <TableHead className="font-bold">حالة التأكيد</TableHead>
                    <TableHead className="font-bold">حالة التوريد</TableHead>
                    <TableHead className="font-bold">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="hover:bg-blue-50 transition-colors">
                    <TableCell className="font-medium">PO-2024-001</TableCell>
                    <TableCell>شركة التوريدات المتقدمة</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800 border-green-300">
                        ✅ تم الإرسال
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800 border-green-300">
                        ✅ مؤكد
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                        🚚 قيد التوريد
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => {
                          toast({
                            title: "📞 تم الاتصال بالمورد",
                            description: "تم الاتصال بشركة التوريدات المتقدمة",
                          });
                        }}>
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => {
                          toast({
                            title: "📧 تم إرسال رسالة متابعة",
                            description: "تم إرسال رسالة متابعة للمورد",
                          });
                        }}>
                          <Mail className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-blue-50 transition-colors">
                    <TableCell className="font-medium">PO-2024-002</TableCell>
                    <TableCell>مؤسسة الخليج للمواد</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800 border-green-300">
                        ✅ تم الإرسال
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                        ⏳ في انتظار التأكيد
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-gray-100 text-gray-800 border-gray-300">
                        ⏸️ معلق
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => {
                          toast({
                            title: "📞 تم الاتصال بالمورد",
                            description: "تم الاتصال بمؤسسة الخليج للمواد",
                          });
                        }}>
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => {
                          toast({
                            title: "📧 تم إرسال رسالة متابعة",
                            description: "تم إرسال رسالة متابعة للمورد",
                          });
                        }}>
                          <Mail className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* تبويب العقود والاتفاقيات */}
        <TabsContent value="contracts" className="space-y-6">
          {/* إحصائيات العقود */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-indigo-50 to-purple-100 border-indigo-200 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-indigo-600 font-medium">العقود النشطة</p>
                    <p className="text-3xl font-bold text-indigo-900">12</p>
                    <p className="text-xs text-indigo-600 mt-1">من أصل 15 عقد</p>
                  </div>
                  <Shield className="w-8 h-8 text-indigo-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 font-medium">قيمة العقود</p>
                    <p className="text-2xl font-bold text-green-900">2.5M</p>
                    <p className="text-xs text-green-600 mt-1">جنيه مصري</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-orange-50 to-amber-100 border-orange-200 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-orange-600 font-medium">تنتهي قريباً</p>
                    <p className="text-3xl font-bold text-orange-900">3</p>
                    <p className="text-xs text-orange-600 mt-1">خلال 30 يوم</p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-100 border-blue-200 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 font-medium">معدل الالتزام</p>
                    <p className="text-3xl font-bold text-blue-900">94%</p>
                    <p className="text-xs text-blue-600 mt-1">+2% هذا الشهر</p>
                  </div>
                  <Award className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* إدارة العقود */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Shield className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <CardTitle className="text-indigo-900">العقود والاتفاقيات السنوية</CardTitle>
                    <CardDescription className="text-indigo-700/70">إدارة العقود طويلة المدى والاتفاقيات المجمعة مع الموردين</CardDescription>
                  </div>
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={addContract}>
                  <Plus className="ml-2 h-4 w-4" />
                  إضافة عقد جديد
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-bold">رقم العقد</TableHead>
                    <TableHead className="font-bold">المورد</TableHead>
                    <TableHead className="font-bold">نوع العقد</TableHead>
                    <TableHead className="font-bold">تاريخ البداية</TableHead>
                    <TableHead className="font-bold">تاريخ الانتهاء</TableHead>
                    <TableHead className="font-bold">القيمة</TableHead>
                    <TableHead className="font-bold">الحالة</TableHead>
                    <TableHead className="font-bold">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contracts && contracts.length > 0 ? (
                    contracts.map((ct) => (
                      <TableRow key={ct.id} className="hover:bg-indigo-50 transition-colors">
                        <TableCell className="font-medium">{ct.code}</TableCell>
                        <TableCell>{ct.supplier}</TableCell>
                        <TableCell>{ct.type}</TableCell>
                        <TableCell>{ct.startDate}</TableCell>
                        <TableCell>{ct.endDate}</TableCell>
                        <TableCell>{Number(ct.value).toLocaleString()} جنيه</TableCell>
                        <TableCell>
                          <Badge className={ct.status === 'نشط' ? 'bg-green-100 text-green-800 border-green-300' : 'bg-yellow-100 text-yellow-800 border-yellow-300'}>
                            {ct.status === 'نشط' ? '🟢 نشط' : ct.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => {
                              toast({ title: '👁️ عرض تفاصيل العقد', description: `جاري فتح تفاصيل ${ct.code}` });
                            }}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => {
                              const win = window.open('', '_blank');
                              if (!win) return;
                              win.document.write(`<html dir='rtl'><head><title>${ct.code}</title></head><body><h1>تفاصيل ${ct.code}</h1><p>المورد: ${ct.supplier}</p><p>الفترة: ${ct.startDate} - ${ct.endDate}</p><p>القيمة: ${ct.value}</p><script>window.print()</script></body></html>`);
                              win.document.close();
                            }}>
                              <Printer className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground">لا توجد عقود</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* أدوات إضافية */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-lg border-l-4 border-l-blue-500">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
                <CardTitle className="flex items-center text-blue-900">
                  <Calendar className="ml-2 h-5 w-5 text-blue-600" />
                  تذكيرات العقود
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="font-medium text-orange-800">عقد CT-2024-003 ينتهي خلال 45 يوم</p>
                    <p className="text-sm text-orange-600">شركة الرياض التجارية</p>
                  </div>
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="font-medium text-yellow-800">مراجعة عقد CT-2024-001 مطلوبة</p>
                    <p className="text-sm text-yellow-600">مراجعة سنوية مستحقة</p>
                  </div>
                </div>
                <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700" onClick={() => {
                  toast({
                    title: "🔔 إعداد التذكيرات",
                    description: "تم تحديث جميع تذكيرات العقود",
                  });
                }}>
                  <Calendar className="ml-2 h-4 w-4" />
                  إدارة التذكيرات
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-l-4 border-l-green-500">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                <CardTitle className="flex items-center text-green-900">
                  <BarChart3 className="ml-2 h-5 w-5 text-green-600" />
                  تحليل أداء العقود
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">معدل الالتزام بالمواعيد</span>
                    <span className="font-bold text-green-700">94%</span>
                  </div>
                  <Progress value={94} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">جودة التنفيذ</span>
                    <span className="font-bold text-blue-700">89%</span>
                  </div>
                  <Progress value={89} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">رضا الأداء</span>
                    <span className="font-bold text-purple-700">91%</span>
                  </div>
                  <Progress value={91} className="h-2" />
                </div>
                <Button className="w-full mt-4 bg-green-600 hover:bg-green-700" onClick={() => {
                  toast({
                    title: "📊 تقرير الأداء",
                    description: "جاري إنشاء تقرير مفصل عن أداء العقود",
                  });
                }}>
                  <BarChart3 className="ml-2 h-4 w-4" />
                  تقرير مفصل
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* تبويب التقارير والتحليلات */}
        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">إجمالي أوامر الشراء</p>
                    <p className="text-3xl font-bold text-gray-900">{getOrdersAnalytics().count}</p>
                    <p className="text-xs text-gray-600 mt-1">متوسط قيمة الأمر {Number(getOrdersAnalytics().avg).toLocaleString()} جنيه</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-gray-700" />
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="text-sm">
                    <span className="text-gray-600">القيمة الإجمالية</span>
                    <div className="font-bold text-green-700">{Number(getOrdersAnalytics().total).toLocaleString()} جنيه</div>
                  </div>
                  <div className="text-sm text-right">
                    <span className="text-gray-600">معدل التنفيذ</span>
                    <div className="font-bold text-blue-700">{getOrdersAnalytics().executionRate}%</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-indigo-50 to-purple-100 border-indigo-200 shadow-lg">
              <CardContent className="p-4">
                <p className="text-sm text-indigo-700 font-medium mb-2">أداء الموردين</p>
                <ul className="space-y-1">
                  {getOrdersAnalytics().suppliersPerf.map((s) => (
                    <li key={s.supplier} className="flex items-center justify-between">
                      <span className="text-indigo-900">{s.supplier}</span>
                      <span className="text-sm text-indigo-700">{s.count} أمر • {Number(s.total).toLocaleString()} جنيه</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200 shadow-lg">
              <CardContent className="p-4">
                <p className="text-sm text-emerald-700 font-medium mb-1">الوفرات المحققة</p>
                <p className="text-3xl font-bold text-emerald-900">{Number(getOrdersAnalytics().savings).toLocaleString()} جنيه</p>
                <p className="text-xs text-emerald-700">نسبة التوفير {getOrdersAnalytics().savingsRate}%</p>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-900">تقارير تفصيلية</CardTitle>
              <CardDescription>إنتاج وتصدير التقارير المتخصصة</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Button variant="outline" className="justify-start" onClick={exportContractsReport}>
                  <FileText className="ml-2 h-4 w-4" /> تقرير العقود
                </Button>
                <Button variant="outline" className="justify-start" onClick={exportSavingsReport}>
                  <DollarSign className="ml-2 h-4 w-4" /> تقرير الوفورات
                </Button>
                <Button variant="outline" className="justify-start" onClick={exportSuppliersReport}>
                  <Users className="ml-2 h-4 w-4" /> تقرير أداء الموردين
                </Button>
                <Button variant="outline" className="justify-start" onClick={exportOrdersReport}>
                  <FileText className="ml-2 h-4 w-4" /> تقرير أوامر الشراء
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PurchaseOrders;