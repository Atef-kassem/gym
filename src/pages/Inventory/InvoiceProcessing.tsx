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
import { Checkbox } from "@/components/ui/checkbox";
import { 
  FileText, Search, Calendar, DollarSign, CheckCircle, Clock, 
  AlertCircle, Upload, Download, Edit, Eye, CreditCard, Building2,
  Scan, Mail, Phone, Package, Filter, Printer, Star, TrendingUp,
  BarChart3, Bell, Shield, Zap, RefreshCw, X, Check, AlertTriangle,
  Receipt, Banknote, Calculator, FileCheck, Users, Settings, Plus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// API configuration
  const API_BASE_URL = (import.meta as any)?.env?.VITE_API_BASE_URL || "https://metagym.metacodecx.com";

// Types
interface Invoice {
  id: number;
  invoiceNumber: string;
  invoiceDate: string;
  supplierId: number;
  purchaseOrderId?: number;
  goodsReceiptId?: number;
  invoiceAmount: number;
  dueDate?: string;
  paymentMethod?: string;
  actualPaymentDate?: string;
  status: string;
  matchingStatus: string;
  notes?: string;
  items: InvoiceItem[];
  attachments: any[];
  supplier?: Supplier | null;
  purchaseOrder?: PurchaseOrder | null;
  goodsReceipt?: GoodsReceipt | null;
}

interface InvoiceItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  total: number;
  poQuantity?: number;
  grnQuantity?: number;
  variance: number;
}

interface Supplier {
  id?: number;
  supplier_id?: number;
  name_ar?: string;
  name_en?: string;
  company_name?: string;
}

interface PurchaseOrder {
  id: number;
  poNumber?: string;
  totalAmount?: number;
  supplier?: Supplier | null;
  items?: POItem[];
  status?: string;
}

interface POItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  price?: number;
}

interface GoodsReceipt {
  id: number;
  grnNumber?: string;
  purchaseOrderId?: number;
  items?: GRNItem[];
}

interface GRNItem {
  id: number;
  name: string;
  receivedQty: number;
  unit: string;
}

interface PaymentSchedule {
  id: number;
  purchaseInvoiceId: number;
  amount: number;
  scheduledDate: string;
  paymentMethod: string;
  status: string;
  invoice?: Invoice;
}

const InvoiceProcessing = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("processing");
  const [isLoading, setIsLoading] = useState(false);
  
  // Data states
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [goodsReceipts, setGoodsReceipts] = useState<GoodsReceipt[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [paymentSchedules, setPaymentSchedules] = useState<PaymentSchedule[]>([]);
  
  // Invoice form state
  const [invoice, setInvoice] = useState<Partial<Invoice>>({
    invoiceNumber: "",
    invoiceDate: new Date().toISOString().split('T')[0],
    supplierId: 0,
    purchaseOrderId: undefined,
    goodsReceiptId: undefined,
    invoiceAmount: 0,
    dueDate: "",
    paymentMethod: "",
    actualPaymentDate: "",
    status: "بانتظار مطابقة",
    matchingStatus: "تحت المراجعة",
    notes: "",
    items: [],
    attachments: [],
  });

  // Review state
  const [reviewInvoiceId, setReviewInvoiceId] = useState<number | null>(null);
  const [reviewInvoice, setReviewInvoice] = useState<Invoice | null>(null);

  // File upload
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleUploadClick = () => fileInputRef.current?.click();

  // Auto-fill invoice when PO or GRN is selected
  const handlePOSelection = (poId: number) => {
    const selectedPO = purchaseOrders.find(po => po.id === poId);
    if (selectedPO) {
      console.log('Selected PO:', selectedPO); // للتأكد من البيانات
      console.log('PO supplier:', selectedPO.supplier); // للتأكد من المورد
      console.log('PO supplier ID:', selectedPO.supplier?.id); // للتأكد من معرف المورد
      
      setInvoice(prev => {
        const supplierId = selectedPO.supplier?.supplier_id || selectedPO.supplier?.id;
        console.log('PO supplier ID from PO:', supplierId, 'type:', typeof supplierId);
        
        const updated = {
          ...prev,
          purchaseOrderId: poId,
          supplierId: supplierId || prev.supplierId || 0,
          items: (selectedPO.items || []).map((item, index) => ({
            id: Date.now() + index,
            name: item.name || "",
            quantity: 0,
            price: Number(item.price) || 0,
            total: 0,
            poQuantity: Number(item.quantity) || 0,
            grnQuantity: 0,
            variance: 0
          }))
        };
        
        console.log('Updated invoice state after PO selection:', updated); // للتأكد من التحديث
        console.log('Final supplierId:', updated.supplierId, 'type:', typeof updated.supplierId);
        return updated;
      });
      
      // إشعار المستخدم
      toast({ 
        title: "تم اختيار أمر الشراء", 
        description: `تم تحميل ${selectedPO.items?.length || 0} صنف من أمر الشراء ${selectedPO.poNumber || poId}` 
      });
    }
  };

  const handleGRNSelection = (grnId: number) => {
    const selectedGRN = goodsReceipts.find(grn => grn.id === grnId);
    if (selectedGRN) {
      console.log('Selected GRN:', selectedGRN); // للتأكد من البيانات
      setInvoice(prev => ({
        ...prev,
        goodsReceiptId: grnId,
        items: prev.items?.map(item => {
          const grnItem = selectedGRN.items?.find(gi => gi.name === item.name);
          return {
            ...item,
            grnQuantity: Number(grnItem?.receivedQty) || 0,
            variance: Math.abs((item.quantity || 0) - (Number(grnItem?.receivedQty) || 0)) * (item.price || 0)
          };
        }) || prev.items
      }));
      
      // إشعار المستخدم
      toast({ 
        title: "تم اختياج.مند الاستلام", 
        description: `تم تحديث الكميات المستلمة من سند الاستلام ${selectedGRN.grnNumber || grnId}` 
      });
    }
  };

  // Fetch data functions
  const fetchSuppliers = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/v1/suppliers`);
      if (!res.ok) throw new Error("فشل جلب الموردين");
      const json = await res.json();
      const list: Supplier[] = json?.data?.suppliers || [];
      setSuppliers(list);
      
      // للتأكد من البيانات
      console.log('Suppliers fetched:', list);
      console.log('Suppliers count:', list.length);
      console.log('First supplier:', list[0]);
      console.log('First supplier ID:', list[0]?.id, 'type:', typeof list[0]?.id);
      console.log('First supplier supplier_id:', list[0]?.supplier_id, 'type:', typeof list[0]?.supplier_id);
    } catch (e: any) {
      toast({ title: "خطأ", description: e.message || "تعذر تحميل الموردين", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPurchaseOrders = async () => {
    try {
      setIsLoading(true);
      // جلب أوامر الشراء مع العلاقات
      const res = await fetch(`${API_BASE_URL}/api/v1/purchase-orders`);
      if (!res.ok) throw new Error("فشل جلب أوامر الشراء");
      const json = await res.json();
      
      // البيانات تأتي مباشرة من الخادم
      const list: PurchaseOrder[] = Array.isArray(json) ? json : [];
      
      // معالجة البيانات للتأكد من وجود العلاقات
      const processedList = list.map(po => ({
        ...po,
        supplier: po.supplier || null,
        items: po.items || [],
        // إضافة حقول إضافية إذا لم تكن موجودة
        poNumber: po.poNumber || `PO-${po.id}`,
        totalAmount: po.totalAmount || 0,
        status: po.status || 'draft'
      }));
      
      setPurchaseOrders(processedList);
      
      // للتأكد من البيانات
      console.log('Purchase Orders fetched:', processedList);
      console.log('First PO supplier:', processedList[0]?.supplier);
      console.log('First PO supplier ID:', processedList[0]?.supplier?.id);
      console.log('First PO supplier supplier_id:', processedList[0]?.supplier?.supplier_id);
    } catch (e: any) {
      toast({ title: "خطأ", description: e.message || "تعذر تحميل أوامر الشراء", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGoodsReceipts = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/v1/goods-receipts`);
      if (!res.ok) throw new Error("فشل جلب سندات الاستلام");
      const json = await res.json();
      
      // البيانات تأتي مباشرة من الخادم
      const list: GoodsReceipt[] = Array.isArray(json) ? json : [];
      
      // معالجة البيانات للتأكد من وجود العلاقات
      const processedList = list.map(grn => ({
        ...grn,
        items: grn.items || [],
        // إضافة حقول إضافية إذا لم تكن موجودة
        grnNumber: grn.grnNumber || `GRN-${grn.id}`,
        purchaseOrderId: grn.purchaseOrderId
      }));
      
      setGoodsReceipts(processedList);
      
      // للتأكد من البيانات
      console.log('Goods Receipts fetched:', processedList);
    } catch (e: any) {
      toast({ title: "خطأ", description: e.message || "تعذر تحميل سندات الاستلام", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      // جلب الإيصالات مع العلاقات الأساسية
      const res = await fetch(`${API_BASE_URL}/api/v1/purchase-invoices?include=supplier,purchaseOrder`);
      if (!res.ok) throw new Error("فشل جلب الإيصالات");
      const json = await res.json();
      const list: Invoice[] = json?.data?.purchaseInvoices || json?.data || [];
      
      // التأكد من أن البيانات تحتوي على العلاقات
      const processedList = list.map(inv => ({
        ...inv,
        purchaseOrder: inv.purchaseOrder || null,
        supplier: inv.supplier || null
      }));
      
      console.log('Fetched invoices from server:', processedList);
      console.log('Invoices count:', processedList.length);
      if (processedList.length > 0) {
        console.log('First invoice:', processedList[0]);
        console.log('First invoice ID:', processedList[0]?.id);
        console.log('First invoice status:', processedList[0]?.status);
        console.log('First invoice supplier:', processedList[0]?.supplier);
        console.log('First invoice supplierId:', processedList[0]?.supplierId);
      }
      
      // البحث عن الإيصالات في حالة "بانتظار الدفع" أو "بانتظار الموافقة"
      const pendingInvoices = processedList.filter((inv: any) => 
        inv.status === "بانتظار الدفع" || inv.status === "بانتظار الموافقة"
      );
      console.log('Pending invoices found:', pendingInvoices);
      console.log('Pending invoices count:', pendingInvoices.length);
      
      setInvoices(processedList);
    } catch (e: any) {
      toast({ title: "خطأ", description: e.message || "تعذر تحميل الإيصالات", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPaymentSchedules = async () => {
    try {
      setIsLoading(true);
      // جلب جدول الدفعات من المسار الصحيح
      const res = await fetch(`${API_BASE_URL}/api/v1/supplier-payment-schedules`);
      console.log('Payment schedules API response status:', res.status);
      console.log('Payment schedules API response ok:', res.ok);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Payment schedules API error:', errorText);
        throw new Error("فشل جلب جدول الدفعات");
      }
      
      const json = await res.json();
      console.log('Payment schedules response:', json);
      console.log('Payment schedules response structure:', JSON.stringify(json, null, 2));
      
      // التعامل مع response format المختلف
      let list: PaymentSchedule[] = [];
      if (Array.isArray(json)) {
        // إذا كان response array مباشر
        list = json;
      } else if (json?.data?.supplierPaymentSchedules) {
        // إذا كان response يحتوي على wrapper
        list = json.data.supplierPaymentSchedules;
      } else if (json?.data) {
        // إذا كان response يحتوي على data فقط
        list = Array.isArray(json.data) ? json.data : [];
      }
      
      console.log('Payment schedules list:', list);
      console.log('Payment schedules count:', list.length);
      
      // إذا لم تكن هناك دفعات مجدولة، ننشئها من الإيصالات في حالة "بانتظار الدفع" أو "بانتظار الموافقة"
      if (!list.length) {
        console.log('No payment schedules found, checking for pending invoices...');
        console.log('Available invoices:', invoices);
        console.log('Invoices count:', invoices.length);
        const pendingInvoices = invoices.filter((inv: any) => 
          inv.status === "بانتظار الدفع" || inv.status === "بانتظار الموافقة"
        );
        console.log('Pending invoices:', pendingInvoices);
        
                                        if (pendingInvoices.length > 0) {
          console.log('Creating payment schedules for pending invoices...');
          // إنشاء جداول دفع تلقائياً للإيصالات المعلقة
          for (const invoice of pendingInvoices) {
            // التأكد من أن الايصال تحتوي على معرف صحيح
            if (!invoice.id) {
              console.error('Invoice missing ID:', invoice);
              continue;
            }
            try {
              const paymentScheduleData = {
                purchaseInvoiceId: Number(invoice.id),
                scheduledDate: invoice.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                amount: Number(invoice.invoiceAmount || 0),
                paymentMethod: invoice.paymentMethod === 'transfer' ? 'تحويل_بنكي' : 
                               invoice.paymentMethod === 'check' ? 'شيك' :
                               invoice.paymentMethod === 'cash' ? 'نقد' :
                               invoice.paymentMethod === 'credit' ? 'بطاقة_ائتمان' : 'تحويل_بنكي',
                status: 'مجدول'
              };
              
              // التحقق من صحة البيانات قبل الإرسال
              if (!paymentScheduleData.purchaseInvoiceId || !paymentScheduleData.scheduledDate || !paymentScheduleData.amount) {
                console.error('Invalid payment schedule data:', paymentScheduleData);
                console.error('Invoice data:', invoice);
                continue; // تخطي هذا الايصال
              }
              
              // التأكد من أن المبلغ أكبر من صفر
              if (paymentScheduleData.amount <= 0) {
                console.error('Invalid amount for invoice:', invoice.id, paymentScheduleData.amount);
                continue; // تخطي هذا الايصال
              }
              
              console.log('Creating payment schedule for invoice:', invoice.id, paymentScheduleData);
              
              const paymentRes = await fetch(`${API_BASE_URL}/api/v1/supplier-payment-schedules`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(paymentScheduleData),
              });
              
              if (paymentRes.ok) {
                console.log('Payment schedule created for invoice:', invoice.id);
              } else {
                console.error('Failed to create payment schedule for invoice:', invoice.id);
              }
            } catch (e) {
              console.error('Error creating payment schedule for invoice:', invoice.id, e);
            }
          }
          
          // إعادة جلب جدول الدفعات بعد الإنشاء
          const refreshRes = await fetch(`${API_BASE_URL}/api/v1/supplier-payment-schedules`);
          if (refreshRes.ok) {
            const refreshJson = await refreshRes.json();
            // التعامل مع response format المختلف
            let refreshList: PaymentSchedule[] = [];
            if (Array.isArray(refreshJson)) {
              refreshList = refreshJson;
            } else if (refreshJson?.data?.supplierPaymentSchedules) {
              refreshList = refreshJson.data.supplierPaymentSchedules;
            } else if (refreshJson?.data) {
              refreshList = Array.isArray(refreshJson.data) ? refreshJson.data : [];
            }
            console.log('Refreshed payment schedules:', refreshList);
            setPaymentSchedules(Array.isArray(refreshList) ? refreshList : []);
          }
        }
      } else {
        setPaymentSchedules(Array.isArray(list) ? list : []);
      }
    } catch (e: any) {
      console.error('Error fetching payment schedules:', e);
      toast({ title: "خطأ", description: e.message || "تعذر تحميل جدول الدفعات", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReviewInvoice = async (id: number) => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/v1/purchase-invoices/${id}`);
      if (!res.ok) throw new Error("فشل جلب بيانات الايصال");
      const json = await res.json();
      const invoiceData: Invoice = json?.data?.purchaseInvoice || json?.data;
      setReviewInvoice(invoiceData);
    } catch (e: any) {
      toast({ title: "خطأ", description: e.message || "تعذر تحميل بيانات الايصال", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    console.log('Component mounted, fetching data...');
    const loadData = async () => {
      try {
        // تحميل الموردين أولاً لأن الإيصالات تحتاجهم
        console.log('Loading suppliers first...');
        await fetchSuppliers();
        
        console.log('Loading purchase orders...');
        await fetchPurchaseOrders();
        
        console.log('Loading goods receipts...');
        await fetchGoodsReceipts();
        
        console.log('Loading invoices...');
        await fetchInvoices();
        
        console.log('Invoices loaded, now fetching payment schedules...');
        await fetchPaymentSchedules();
      } catch (e) {
        console.error('Error loading data:', e);
      }
    };
    loadData();
  }, []);

  // Load review invoice when ID changes
  useEffect(() => {
    if (reviewInvoiceId) {
      fetchReviewInvoice(reviewInvoiceId);
    }
  }, [reviewInvoiceId]);
  
  // Monitor invoice ID changes
  useEffect(() => {
    console.log('Invoice ID changed to:', invoice.id);
  }, [invoice.id]);

  // Monitor payment schedules changes
  useEffect(() => {
    console.log('Payment schedules changed:', paymentSchedules);
    console.log('Payment schedules count:', paymentSchedules.length);
  }, [paymentSchedules]);

  // Monitor invoices changes
  useEffect(() => {
    console.log('Invoices changed:', invoices);
    console.log('Invoices count:', invoices.length);
    const pendingInvoices = invoices.filter((inv: any) => 
      inv.status === "بانتظار الدفع" || inv.status === "بانتظار الموافقة"
    );
    console.log('Pending invoices in useEffect:', pendingInvoices);
    console.log('Pending invoices count in useEffect:', pendingInvoices.length);
  }, [invoices]);

  // File upload handler
  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    console.log('Attempting to upload files for invoice:', invoice);
    console.log('Invoice ID:', invoice.id, 'type:', typeof invoice.id);
    
    if (!invoice.id) {
      toast({ title: "يجب حفظ الايصال أولاً", variant: "destructive" });
      return;
    }
    try {
      const form = new FormData();
      Array.from(files).forEach((file, idx) => {
        if (idx === 0) form.append("invoice_file", file);
        else form.append("supporting_doc", file);
      });
      const res = await fetch(`${API_BASE_URL}/api/v1/purchase-invoices/${invoice.id}/attachments`, {
        method: "POST",
        body: form,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      toast({ title: "تم رفع الملفات بنجاح" });
      await fetchInvoices(); // Refresh data
    } catch (err: any) {
      console.error("[InvoiceProcessing] Upload failed:", err);
      toast({ title: "فشل رفع الملفات", description: String(err?.message || err), variant: "destructive" });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Misc actions
  const handleImportFromEmail = () => {
    setInvoice(prev => ({ ...prev, invoiceNumber: `INV-EMAIL-${Date.now()}` }));
    toast({ title: "تم الاستيراد من البريد", description: "تم تعبئة رقم الايصال تلقائياً" });
  };

  const handleManualEntry = () => {
    toast({ title: "وضع الإدخال اليدوي", description: "يمكنك تعديل الحقول يدوياً" });
  };

  // Invoice item management
  const addItem = () => {
    setInvoice(prev => ({
      ...prev,
      items: [...(prev.items || []), { 
        id: Date.now(), 
        name: "", 
        quantity: 0, 
        price: 0, 
        total: 0,
        poQuantity: 0,
        grnQuantity: 0,
        variance: 0
      }]
    }));
  };

  const removeItem = (id: number) => {
    setInvoice(prev => ({
      ...prev,
      items: (prev.items || []).filter(item => item.id !== id)
    }));
  };

  const updateItem = (id: number, field: string, value: string | number) => {
    const currentItems = invoice.items || [];
    const updatedItems = currentItems.map(item => {
      if (item.id === id) {
        const updatedItem: any = { ...item, [field]: value };
        if (field === 'quantity' || field === 'price') {
          const quantity = parseFloat(String(updatedItem.quantity)) || 0;
          const price = parseFloat(String(updatedItem.price)) || 0;
          updatedItem.total = quantity * price;
          const grnQty = parseFloat(String(updatedItem.grnQuantity)) || 0;
          updatedItem.variance = Math.abs(quantity - grnQty) * price;
        }
        
        // التأكد من أن total و variance دائماً أرقام
        if (typeof updatedItem.total !== 'number' || isNaN(updatedItem.total)) {
          updatedItem.total = 0;
        }
        if (typeof updatedItem.variance !== 'number' || isNaN(updatedItem.variance)) {
          updatedItem.variance = 0;
        }
        
        return updatedItem;
      }
      return item;
    });
    const totalAmount = updatedItems.reduce((sum: number, item: any) => sum + (item.total || 0), 0);
    setInvoice(prev => ({
      ...prev,
      items: updatedItems,
      invoiceAmount: totalAmount
    }));
  };

  // Three-way matching
  const performThreeWayMatch = async () => {
    console.log('Attempting three-way match for invoice:', invoice);
    console.log('Invoice ID:', invoice.id, 'type:', typeof invoice.id);
    
    if (!invoice.id) {
      toast({ title: "احفظ الايصال أولاً", variant: "destructive" });
      return;
    }

    console.log('Invoice items for matching:', invoice.items);
    console.log('Items length:', invoice.items?.length);
    
    const hasDiscrepancies = invoice.items?.some(item => item.variance > 0);
    console.log('Has discrepancies:', hasDiscrepancies);
    
    try {
      const newStatus = hasDiscrepancies ? "تحت المراجعة" : "بانتظار الموافقة";
      const newMatchingStatus = hasDiscrepancies ? "غير مطابق" : "مطابق";
      
      console.log('New status:', newStatus);
      console.log('New matching status:', newMatchingStatus);
      
      const updateData = {
        status: newStatus,
        matchingStatus: newMatchingStatus
      };
      
      console.log('Sending update data:', updateData);
      console.log('Update URL:', `${API_BASE_URL}/api/v1/purchase-invoices/${invoice.id}`);
      
      const res = await fetch(`${API_BASE_URL}/api/v1/purchase-invoices/${invoice.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      console.log('Update response status:', res.status);
      console.log('Update response ok:', res.ok);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Update failed with response:', errorText);
        throw new Error(`فشل تحديث حالة الايصال: ${res.status} - ${errorText}`);
      }
      
      const updateResponse = await res.json();
      console.log('Update response:', updateResponse);

      setInvoice(prev => ({
        ...prev,
        matchingStatus: newMatchingStatus,
        status: newStatus
      }));

      if (hasDiscrepancies) {
      toast({
        title: "تم اكتشاف عدم تطابق",
        description: "توجد فروقات بين الايصال وسند الاستلام",
        variant: "destructive"
      });
    } else {
      toast({
        title: "تمت المطابقة بنجاح",
        description: "الايصال متطابقة مع أمر الشراء وسند الاستلام",
      });
    }

      await fetchInvoices(); // Refresh data
    } catch (e: any) {
      toast({ title: "فشل تنفيذ المطابقة", description: e.message, variant: "destructive" });
    }
  };

  // Matching actions
  const handleConvertToReview = async () => {
    console.log('Attempting to convert to review for invoice:', invoice);
    console.log('Invoice ID:', invoice.id, 'type:', typeof invoice.id);
    
    if (!invoice.id) {
      toast({ title: "احفظ الايصال أولاً", variant: "destructive" });
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/purchase-invoices/${invoice.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "تحت المراجعة" }),
      });
      if (!res.ok) throw new Error("فشل تحديث حالة الايصال");
      
      setInvoice(prev => ({ ...prev, status: "تحت المراجعة" }));
      await fetchInvoices();
      toast({ title: "تم تحديث حالة الايصال" });
    } catch (e: any) {
      toast({ title: "فشل التحديث", description: e.message, variant: "destructive" });
    }
  };
  
  const handleContactSupplier = () => toast({ title: "تم إشعار المورد", description: "تم تسجيل محاولة التواصل" });
  
  const handleAcceptWithNotes = async () => {
    console.log('Attempting to accept with notes for invoice:', invoice);
    console.log('Invoice ID:', invoice.id, 'type:', typeof invoice.id);
    
    if (!invoice.id) {
      toast({ title: "احفظ الايصال أولاً", variant: "destructive" });
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/purchase-invoices/${invoice.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchingStatus: "مطابق", status: "بانتظار الموافقة" }),
      });
      if (!res.ok) throw new Error("فشل تحديث حالة الايصال");
      
      setInvoice(prev => ({ ...prev, matchingStatus: "مطابق", status: "بانتظار الموافقة" }));
      await fetchInvoices();
      toast({ title: "تم تحديث حالة الايصال" });
    } catch (e: any) {
      toast({ title: "فشل التحديث", description: e.message, variant: "destructive" });
    }
  };
  
  const handleRejectInvoice = async () => {
    console.log('Attempting to reject invoice:', invoice);
    console.log('Invoice ID:', invoice.id, 'type:', typeof invoice.id);
    
    if (!invoice.id) {
      toast({ title: "احفظ الايصال أولاً", variant: "destructive" });
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/purchase-invoices/${invoice.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "مرفوضة", matchingStatus: "غير مطابق" }),
      });
      if (!res.ok) throw new Error("فشل تحديث حالة الايصال");
      
      setInvoice(prev => ({ ...prev, status: "مرفوضة", matchingStatus: "غير مطابق" }));
      await fetchInvoices();
      toast({ title: "تم تحديث حالة الايصال" });
    } catch (e: any) {
      toast({ title: "فشل التحديث", description: e.message, variant: "destructive" });
    }
  };

  // OCR simulation
  const handleOCRScan = () => {
    toast({
      title: "تم بدء المسح الضوئي",
      description: "جاري قراءة وتحليل الايصال...",
    });
    
    // Simulate OCR processing
    setTimeout(() => {
      setInvoice(prev => ({
        ...prev,
        invoiceNumber: "INV-OCR-" + Date.now(),
        invoiceAmount: 15000
      }));
      toast({
        title: "تم المسح بنجاح",
        description: "تم استخراج بيانات الايصال تلقائياً",
      });
    }, 2000);
  };

  // Approval actions
  const handleApprovePayment = async (id: number) => {
    try {
      // تحديث حالة الايصال
      const res = await fetch(`${API_BASE_URL}/api/v1/purchase-invoices/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "بانتظار الدفع" }),
      });

      if (!res.ok) throw new Error("فشل تحديث حالة الايصال");

      // البحث عن الايصال لإنشاء جدول دفع
      const invoice = invoices.find(inv => inv.id === id);
      if (invoice && invoice.id) {
        // إنشاء جدول دفع تلقائياً
        const paymentScheduleData = {
          purchaseInvoiceId: Number(id),
          scheduledDate: invoice.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          amount: Number(invoice.invoiceAmount || 0),
          paymentMethod: invoice.paymentMethod === 'transfer' ? 'تحويل_بنكي' : 
                         invoice.paymentMethod === 'check' ? 'شيك' :
                         invoice.paymentMethod === 'cash' ? 'نقد' :
                         invoice.paymentMethod === 'credit' ? 'بطاقة_ائتمان' : 'تحويل_بنكي',
          status: 'مجدول'
        };
        
        // التأكد من أن البيانات صحيحة
        console.log('Invoice data for payment schedule:', {
          id: invoice.id,
          dueDate: invoice.dueDate,
          invoiceAmount: invoice.invoiceAmount,
          paymentMethod: invoice.paymentMethod
        });
        
        console.log('Payment schedule data to send:', paymentScheduleData);
        
        // التحقق من صحة البيانات قبل الإرسال
        if (!paymentScheduleData.purchaseInvoiceId || !paymentScheduleData.scheduledDate || !paymentScheduleData.amount) {
          console.error('Invalid payment schedule data:', paymentScheduleData);
          throw new Error('بيانات جدول الدفع غير صحيحة');
        }
        
        // التأكد من أن المبلغ أكبر من صفر
        if (paymentScheduleData.amount <= 0) {
          console.error('Invalid amount for invoice:', invoice.id, paymentScheduleData.amount);
          throw new Error('مبلغ الايصال غير صحيح');
        }

        console.log('Creating payment schedule:', paymentScheduleData);

        const paymentRes = await fetch(`${API_BASE_URL}/api/v1/supplier-payment-schedules`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(paymentScheduleData),
        });

        console.log('Payment schedule creation response status:', paymentRes.status);
        console.log('Payment schedule creation response ok:', paymentRes.ok);

        if (paymentRes.ok) {
          console.log('Payment schedule created successfully');
          const createdPayment = await paymentRes.json();
          console.log('Created payment schedule response:', createdPayment);
          
          // إعادة جلب جدول الدفعات مباشرة بعد الإنشاء
          console.log('Refreshing payment schedules after creation...');
          await fetchPaymentSchedules();
        } else {
          const errorText = await paymentRes.text();
          console.error('Failed to create payment schedule:', errorText);
          throw new Error(`فشل إنشاء جدول الدفع: ${errorText}`);
        }
      } else {
        console.error('Invoice not found in local state:', id);
        console.log('Available invoices:', invoices);
      }

      toast({ title: "تمت الموافقة على الدفع", description: "تم إرسال الايصال لجدولة الدفع" });
      
      // تحديث البيانات
      await Promise.all([fetchInvoices(), fetchPaymentSchedules()]);
    } catch (e: any) {
      console.error('Error in handleApprovePayment:', e);
      toast({ title: "خطأ في الموافقة", description: e.message, variant: "destructive" });
    }
  };

  const handleListReview = (id: number) => setReviewInvoiceId(id);
  
  const handleListReject = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/purchase-invoices/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "مرفوضة" }),
      });

      if (!res.ok) throw new Error("فشل رفض الايصال");

      toast({ title: "تم الرفض" });
      await fetchInvoices(); // Refresh data
    } catch (e: any) {
      toast({ title: "فشل الرفض", description: e.message, variant: "destructive" });
    }
  };

  // Payment actions
  const handleMakePaymentAction = async () => {
    try {
      const pending = paymentSchedules
        .filter((p: any) => p.status !== 'مدفوعة')
        .sort((a: any, b: any) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());
      
      if (pending.length === 0) {
        toast({ title: "لا توجد دفعات قيد الانتظار" });
        return;
      }

      const payment = pending[0];
      const res = await fetch(`${API_BASE_URL}/api/v1/supplier-payment-schedules/${payment.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: 'مدفوعة' }),
      });

      if (!res.ok) throw new Error("فشل تحديث حالة الدفعة");

      if (payment.purchaseInvoiceId) {
        await fetch(`${API_BASE_URL}/api/v1/purchase-invoices/${payment.purchaseInvoiceId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            status: 'مدفوعة', 
            actualPaymentDate: new Date().toISOString().split('T')[0] 
          }),
        });
      }

      await Promise.all([fetchPaymentSchedules(), fetchInvoices()]);
      toast({ title: "تم تنفيذ الدفعة" });
    } catch (e: any) {
      toast({ title: "فشل تنفيذ الدفعة", description: e.message, variant: 'destructive' });
    }
  };

  // History actions
  const handleHistoryPrint = () => window.print();
  
  const handleHistoryDownload = (inv: any) => {
    const blob = new Blob([JSON.stringify(inv, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${inv.invoiceNumber || `invoice-${inv.id}`}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  const handleHistoryView = (id: number) => setReviewInvoiceId(id);

  // Save invoice
  const handleSaveDraft = async () => {
    try {
      console.log('Current invoice state:', invoice); // للتأكد من البيانات
      console.log('supplierId:', invoice.supplierId, 'type:', typeof invoice.supplierId);
      const supplierId = Number(invoice.supplierId);
      console.log('supplierId isNaN:', isNaN(supplierId));
      console.log('supplierId === 0:', supplierId === 0);
      
      if (!supplierId || supplierId === 0 || isNaN(supplierId)) {
        toast({ title: "الرجاء اختيار المورد", variant: "destructive" });
        return;
      }

      const generatedNumber = invoice.invoiceNumber || `INV-${Date.now()}`;
      const todayStr = new Date().toISOString().split('T')[0];
      
      const body: any = {
        invoiceNumber: generatedNumber,
        invoiceDate: invoice.invoiceDate || todayStr,
        supplierId: invoice.supplierId,
        purchaseOrderId: invoice.purchaseOrderId || null,
        goodsReceiptId: invoice.goodsReceiptId || null,
        dueDate: invoice.dueDate || null,
        paymentMethod: invoice.paymentMethod || null,
        actualPaymentDate: invoice.actualPaymentDate || null,
        status: invoice.status || "بانتظار مطابقة",
        matchingStatus: invoice.matchingStatus || "تحت المراجعة",
        notes: invoice.notes || null,
        invoiceAmount: Number(invoice.invoiceAmount || 0),
        items: (invoice.items || []).map((it) => ({
          name: it.name,
          quantity: parseFloat(String(it.quantity)) || 0,
          price: parseFloat(String(it.price)) || 0,
          total: it.total || 0,
          poQuantity: parseFloat(String(it.poQuantity)) || 0,
          grnQuantity: parseFloat(String(it.grnQuantity)) || 0,
          variance: it.variance || 0,
        })),
      };
      
      console.log('Request body:', body); // للتأكد من البيانات المرسلة
      console.log('Request body JSON:', JSON.stringify(body, null, 2)); // للتأكد من JSON

      const res = await fetch(`${API_BASE_URL}/api/v1/purchase-invoices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error?.message || "فشل إنشاء الايصال");
      }

      const created = await res.json();
      console.log('Server response:', created); // للتأكد من استجابة الخادم
      console.log('Response structure:', JSON.stringify(created, null, 2)); // للتأكد من هيكل البيانات
      
      // محاولة استخراج المعرف بطرق مختلفة
      let newId = created?.data?.purchaseInvoice?.id || 
                  created?.data?.id || 
                  created?.id || 
                  created?.purchaseInvoice?.id ||
                  created?.invoice?.id;
      
      console.log('Extracted newId:', newId, 'type:', typeof newId); // للتأكد من المعرف المستخرج

      // إذا لم يتم استلام المعرف، نحاول استخراجه من URL
      if (!newId) {
        console.log('No ID in response, trying to extract from URL...');
        
        // محاولة استخراج المعرف من Location header إذا كان موجود
        const locationHeader = res.headers.get('Location');
        if (locationHeader) {
          const urlParts = locationHeader.split('/');
          newId = parseInt(urlParts[urlParts.length - 1]);
          console.log('Extracted ID from Location header:', newId);
        }
      }
      
      // إذا كان لدينا المعرف من الاستجابة، نستخدمه مباشرة
      if (newId && !isNaN(newId)) {
        console.log('Using ID from response:', newId);
      } else {
        console.log('No valid ID found, creating will fail');
        throw new Error('لم يتم استلام معرف الايصال من الخادم');
      }

      if (newId) {
        console.log('Setting invoice ID to:', newId);
        setInvoice(prev => {
          const updated = { ...prev, id: newId };
          console.log('Updated invoice state with ID:', updated);
          return updated;
        });
        
        // استخدام البيانات المستلمة من الخادم مباشرة
        const savedInvoice = created?.data?.purchaseInvoice;
        if (savedInvoice) {
          console.log('Using saved invoice from server response:', savedInvoice);
          setInvoice(savedInvoice);
        }
        
        // تحديث قائمة الإيصالات في الخلفية
        setTimeout(async () => {
          console.log('Refreshing invoices list...');
          await fetchInvoices();
        }, 100);
        
        toast({ title: "تم الحفظ", description: "تم حفظ الايصال كمسودة" });
      } else {
        console.error('Failed to extract ID from response:', created);
        toast({ title: "تم الحفظ جزئياً", description: "تم إنشاء الايصال لكن لم يتم استلام المعرف", variant: "destructive" });
      }
    } catch (e: any) {
      console.error("[InvoiceProcessing] Save invoice failed:", e);
      toast({ title: "فشل حفظ الايصال", description: String(e?.message || e), variant: "destructive" });
    }
  };

  // Helper function to get supplier name
  const getSupplierName = (supplierId: number | undefined, supplier: any) => {
    if (supplier) {
      return supplier.name_ar || 
             supplier.name_en || 
             supplier.company_name || 
             `مورد #${supplier.id}`;
    }
    
    if (supplierId) {
      const foundSupplier = suppliers.find(s => 
        s.id === supplierId || 
        s.supplier_id === supplierId
      );
      if (foundSupplier) {
        return foundSupplier.name_ar || 
               foundSupplier.name_en || 
               foundSupplier.company_name || 
               `مورد #${foundSupplier.id || foundSupplier.supplier_id}`;
      }
      return `مورد #${supplierId}`;
    }
    
    return 'غير محدد';
  };

  // Status badge helper
  const getStatusBadge = (status: string) => {
    const variants = {
      "بانتظار مطابقة": "secondary",
      "مطابق": "default",
      "غير مطابق": "destructive",
      "تحت المراجعة": "secondary",
      "بانتظار الموافقة": "default",
      "بانتظار الدفع": "default",
      "مدفوعة": "default",
      "مرفوضة": "destructive",
      "مجدول": "default",
      "مسودة": "secondary",
      "مؤكد": "default",
      "مدفوع": "default",
      "جزئي": "secondary",
      "معلق": "secondary",
      "متأخر": "destructive",
      "ملغي": "destructive"
    };

    const icons = {
      "بانتظار مطابقة": <Clock className="w-3 h-3 mr-1" />,
      "مطابق": <CheckCircle className="w-3 h-3 mr-1" />,
      "غير مطابق": <AlertTriangle className="w-3 h-3 mr-1" />,
      "تحت المراجعة": <Search className="w-3 h-3 mr-1" />,
      "بانتظار الموافقة": <Clock className="w-3 h-3 mr-1" />,
      "بانتظار الدفع": <CreditCard className="w-3 h-3 mr-1" />,
      "مدفوعة": <CheckCircle className="w-3 h-3 mr-1" />,
      "مرفوضة": <X className="w-3 h-3 mr-1" />,
      "مجدول": <Calendar className="w-3 h-3 mr-1" />,
      "مسودة": <Clock className="w-3 h-3 mr-1" />,
      "مؤكد": <CheckCircle className="w-3 h-3 mr-1" />,
      "مدفوع": <CheckCircle className="w-3 h-3 mr-1" />,
      "جزئي": <AlertTriangle className="w-3 h-3 mr-1" />,
      "معلق": <Clock className="w-3 h-3 mr-1" />,
      "متأخر": <AlertTriangle className="w-3 h-3 mr-1" />,
      "ملغي": <X className="w-3 h-3 mr-1" />
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] as "default" | "destructive" | "secondary"}>
        {icons[status as keyof typeof icons]}
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            معالجة الدفع
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            المطابقة الثلاثية الذكية ومعالجة دفعات الموردين مع أحدث التقنيات
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isLoading && (
            <div className="flex items-center gap-2 text-blue-600">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span className="text-sm">جاري التحميل...</span>
            </div>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              fetchSuppliers();
              fetchPurchaseOrders();
              fetchGoodsReceipts();
              fetchInvoices();
              fetchPaymentSchedules();
            }}
            disabled={isLoading}
            className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            تحديث البيانات
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-1 rounded-xl shadow-sm">
          <TabsTrigger 
            value="processing"
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-600 data-[state=active]:font-semibold transition-all duration-200 rounded-lg hover:bg-blue-50"
          >
            <FileText className="ml-2 h-4 w-4" />
            معالجة الإيصالات
          </TabsTrigger>
          <TabsTrigger 
            value="matching"
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-600 data-[state=active]:font-semibold transition-all duration-200 rounded-lg hover:bg-blue-50"
          >
            <FileCheck className="ml-2 h-4 w-4" />
            المطابقة الثلاثية
          </TabsTrigger>
          <TabsTrigger 
            value="approval"
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-600 data-[state=active]:font-semibold transition-all duration-200 rounded-lg hover:bg-blue-50"
          >
            <Shield className="ml-2 h-4 w-4" />
            موافقة الدفع
          </TabsTrigger>
          <TabsTrigger 
            value="payment"
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-600 data-[state=active]:font-semibold transition-all duration-200 rounded-lg hover:bg-blue-50"
          >
            <CreditCard className="ml-2 h-4 w-4" />
            جدولة الدفع
          </TabsTrigger>
          <TabsTrigger 
            value="history"
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-600 data-[state=active]:font-semibold transition-all duration-200 rounded-lg hover:bg-blue-50"
          >
            <Receipt className="ml-2 h-4 w-4" />
            سجل الإيصالات
          </TabsTrigger>
          <TabsTrigger 
            value="reports"
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-600 data-[state=active]:font-semibold transition-all duration-200 rounded-lg hover:bg-blue-50"
          >
            <BarChart3 className="ml-2 h-4 w-4" />
            التقارير
          </TabsTrigger>
        </TabsList>

        {/* تبويب معالجة الإيصالات */}
        <TabsContent value="processing" className="space-y-6">
          <Card className="border-2 border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle className="text-xl text-gray-800">إدخال ايصال جديدة</CardTitle>
              <CardDescription className="text-gray-600">إدخال وقراءة الإيصالات مع المسح الضوئي الذكي</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* خيارات الإدخال */}
              <div className="grid grid-cols-3 gap-6">
                <Card className="p-6 cursor-pointer hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
                  <div className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <Scan className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-lg text-gray-800">مسح ضوئي ذكي</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">قراءة الايصال تلقائياً باستخدام تقنية OCR المتقدمة</p>
                    <Button onClick={handleOCRScan} size="sm" className="w-full bg-blue-600 hover:bg-blue-700 shadow-md">
                      <Scan className="ml-2 h-4 w-4" />
                      بدء المسح
                    </Button>
                  </div>
                </Card>
                <Card className="p-6 cursor-pointer hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
                  <div className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <Mail className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-lg text-gray-800">من البريد الإلكتروني</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">استيراد الإيصالات مباشرة من إيميل المورد</p>
                    <Button variant="outline" size="sm" className="w-full border-green-300 text-green-700 hover:bg-green-50" onClick={handleImportFromEmail}>
                      <Mail className="ml-2 h-4 w-4" />
                      استيراد
                    </Button>
                  </div>
                </Card>
                <Card className="p-6 cursor-pointer hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50">
                  <div className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                      <Edit className="h-8 w-8 text-orange-600" />
                    </div>
                    <h3 className="font-semibold text-lg text-gray-800">إدخال يدوي</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">كتابة بيانات الايصال يدوياً مع التحقق التلقائي</p>
                    <Button variant="outline" size="sm" className="w-full border-orange-300 text-orange-700 hover:bg-orange-50" onClick={handleManualEntry}>
                      <Edit className="ml-2 h-4 w-4" />
                      إدخال يدوي
                    </Button>
                  </div>
                </Card>
              </div>

              {/* المعلومات الأساسية */}
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="invoiceNumber">رقم الايصال</Label>
                  <Input 
                    id="invoiceNumber"
                    placeholder="INV-2024-001"
                    value={invoice.invoiceNumber}
                    onChange={(e) => setInvoice({...invoice, invoiceNumber: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invoiceDate">تاريخ الايصال</Label>
                  <Input 
                    id="invoiceDate" 
                    type="date"
                    value={invoice.invoiceDate}
                    onChange={(e) => setInvoice({...invoice, invoiceDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplier">اسم المورد</Label>
                  <Select 
                    value={invoice.supplierId ? String(invoice.supplierId) : ""}
                    onValueChange={(value) => {
                      console.log('Selected supplier value:', value, 'type:', typeof value); // للتأكد من القيمة
                      console.log('Available suppliers:', suppliers); // للتأكد من الموردين المتاحين
                      
                      // التأكد من أن القيمة صحيحة
                      if (!value || value === "") {
                        console.log('Empty value, setting supplierId to 0');
                        setInvoice(prev => ({ ...prev, supplierId: 0 }));
                        return;
                      }
                      
                      const numeric = Number(value);
                      console.log('Converted to numeric:', numeric, 'type:', typeof numeric); // للتأكد من التحويل
                      
                      // التأكد من أن الرقم صحيح
                      if (isNaN(numeric)) {
                        console.log('Invalid numeric value, setting supplierId to 0');
                        setInvoice(prev => ({ ...prev, supplierId: 0 }));
                        return;
                      }
                      
                      setInvoice(prev => {
                        const updated = { ...prev, supplierId: numeric };
                        console.log('Updated invoice state:', updated); // للتأكد من التحديث
                        return updated;
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المورد" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map((s: Supplier) => {
                        const supplierId = s.supplier_id || s.id;
                        const name = s.name_ar || s.name_en || s.company_name || `مورد #${supplierId}`;
                        console.log('Creating SelectItem for supplier:', s, 'supplierId:', supplierId, 'name:', name);
                          return (
                          <SelectItem key={supplierId} value={String(supplierId)}>
                              {name}
                            </SelectItem>
                          );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invoiceAmount">مبلغ الايصال</Label>
                  <Input 
                    id="invoiceAmount"
                    type="number"
                    placeholder="0.00"
                    value={invoice.invoiceAmount}
                    onChange={(e) => setInvoice({...invoice, invoiceAmount: parseFloat(e.target.value) || 0})}
                  />
                </div>
              </div>

              {/* ربط أمر الشراء وسند الاستلام */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="poNumber">رقم أمر الشراء</Label>
                  <Select 
                    value={invoice.purchaseOrderId ? String(invoice.purchaseOrderId) : ""}
                    onValueChange={(value) => handlePOSelection(Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر أمر الشراء" />
                    </SelectTrigger>
                    <SelectContent>
                      {purchaseOrders.map((po: any, idx: number) => (
                        <SelectItem key={po.id ?? `${po.poNumber ?? 'po'}-${idx}`} value={String(po.id)}>
                          {(po.poNumber || `PO-${po.id}`)} - {(po.supplier?.name_ar || po.supplier?.name_en || po.supplier?.company_name || "")} ({Number(po.totalAmount || 0).toLocaleString()} جنيه مصري)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grnNumber">رقم سند الاستلام</Label>
                  <Select 
                    value={invoice.goodsReceiptId ? String(invoice.goodsReceiptId) : ""}
                    onValueChange={(value) => handleGRNSelection(Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={(() => {
                        const count = goodsReceipts
                        .filter((grn: any) => String(grn.purchaseOrderId || "") === String(invoice.purchaseOrderId))
                          .length;
                        return count > 0 ? `وجد ${count} سند/سندات` : "اختج.مند الاستلام";
                      })()} />
                    </SelectTrigger>
                    <SelectContent>
                      {(() => {
                        const poId = String(invoice.purchaseOrderId || "");
                        const filtered = (goodsReceipts as any[]).filter((grn: any) => {
                          const direct = String(grn.purchaseOrderId || "");
                          const assoc = grn.purchaseOrder && String(grn.purchaseOrder.id);
                          return poId && (direct === poId || assoc === poId);
                        });
                        const listToShow = filtered.length > 0 ? filtered : goodsReceipts;
                        return listToShow.map((grn: any, idx: number) => {
                          const label = grn.grnNumber || `GRN-${grn.id}`;
                          const poRef = grn.purchaseOrderId;
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

              {/* الأصناف بالايصال */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">الأصناف بالايصال</h3>
                  <Button onClick={addItem} variant="outline" size="sm">
                    <FileText className="ml-2 h-4 w-4" />
                    إضافة صنف
                  </Button>
                </div>

                <div className="space-y-4">
                  {(invoice.items || []).map((item, index) => (
                    <Card key={item.id} className="p-4">
                      <div className="grid grid-cols-8 gap-4">
                        <div className="space-y-2">
                          <Label>اسم الصنف</Label>
                          <Input 
                            placeholder="اسم المادة"
                            value={item.name}
                            onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>كمية الايصال</Label>
                          <Input 
                            type="number"
                            placeholder="0"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>السعر</Label>
                          <Input 
                            type="number"
                            placeholder="0.00"
                            value={item.price}
                            onChange={(e) => updateItem(item.id, 'price', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>الإجمالي</Label>
                          <Input 
                            value={typeof item.total === 'number' ? item.total.toFixed(2) : '0.00'}
                            disabled
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>كمية أمر الشراء</Label>
                          <Input 
                            type="number"
                            placeholder="0"
                            value={item.poQuantity}
                            onChange={(e) => updateItem(item.id, 'poQuantity', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>كمية الاستلام</Label>
                          <Input 
                            type="number"
                            placeholder="0"
                            value={item.grnQuantity}
                            onChange={(e) => updateItem(item.id, 'grnQuantity', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>الفرق</Label>
                          <Input 
                            value={typeof item.variance === 'number' ? item.variance.toFixed(2) : '0.00'}
                            disabled
                            className={typeof item.variance === 'number' && item.variance > 0 ? "text-red-600" : "text-green-600"}
                          />
                        </div>
                        <div className="flex items-end">
                          {(invoice.items || []).length > 1 && (
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
                    </Card>
                  ))}
                </div>
              </div>

              {/* شروط الدفع */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dueDate">تاريخ الاستحقاق</Label>
                  <Input 
                    id="dueDate" 
                    type="date"
                    value={invoice.dueDate}
                    onChange={(e) => setInvoice({...invoice, dueDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">طريقة الدفع</Label>
                  <Select 
                    value={invoice.paymentMethod}
                    onValueChange={(value) => setInvoice({...invoice, paymentMethod: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر طريقة الدفع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="transfer">تحويل بنكي</SelectItem>
                      <SelectItem value="check">شيك</SelectItem>
                      <SelectItem value="cash">نقدي</SelectItem>
                      <SelectItem value="credit">بطاقة ائتمان</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="actualPaymentDate">تاريخ الدفع الفعلي</Label>
                  <Input 
                    id="actualPaymentDate" 
                    type="date"
                    value={invoice.actualPaymentDate}
                    onChange={(e) => setInvoice({...invoice, actualPaymentDate: e.target.value})}
                  />
                </div>
              </div>

              {/* المرفقات والملاحظات */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="notes">ملاحظات/اختلافات</Label>
                  <Textarea 
                    id="notes"
                    placeholder="أي ملاحظات على الايصال، خصومات، غرامات تأخير..."
                    value={invoice.notes}
                    onChange={(e) => setInvoice({...invoice, notes: e.target.value})}
                  />
                </div>
                <div className="space-y-4">
                  <Label>مرفقات الايصال</Label>
                  <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        صورة الايصال، مستندات إثبات
                      </p>
                      <input ref={fileInputRef} type="file" multiple hidden onChange={handleFilesSelected} />
                      <Button variant="outline" size="sm" onClick={handleUploadClick}>
                        <Upload className="ml-2 h-4 w-4" />
                        رفع ملفات
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* أزرار الإجراء */}
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={handleSaveDraft}>
                  <FileText className="ml-2 h-4 w-4" />
                  حفظ مسودة
                </Button>
                <Button onClick={performThreeWayMatch}>
                  <Zap className="ml-2 h-4 w-4" />
                  تنفيذ المطابقة الثلاثية
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* تبويب المطابقة الثلاثية */}
        <TabsContent value="matching" className="space-y-6">
          <Card className="border-2 border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
              <CardTitle className="text-xl text-gray-800">المطابقة الثلاثية الذكية</CardTitle>
              <CardDescription className="text-gray-600">مراجعة مطابقة الايصال مع أمر الشراء وسند الاستلام</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* حالة المطابقة */}
                <div className="grid grid-cols-3 gap-6">
                  {(() => {
                    const po = purchaseOrders.find((p: any) => String(p.id) === String(invoice.purchaseOrderId));
                    const grn = goodsReceipts.find((g: any) => String(g.id) === String(invoice.goodsReceiptId));
                    const hasAnyVariance = (invoice.items || []).some((it: any) => Number(it.variance || 0) > 0);
                    const poMismatch = (invoice.items || []).some((it: any) => {
                      const poItem = (po?.items || []).find((pi: any) => pi.name === it.name);
                      const poQty = Number(poItem?.quantity || 0);
                      const poPrice = Number(poItem?.price || 0);
                      const invQty = Number(it.quantity || 0);
                      const invPrice = Number(it.price || 0);
                      return poQty !== invQty || poPrice !== invPrice;
                    });
                    const grnMismatch = (invoice.items || []).some((it: any) => {
                      const grnQty = Number(it.grnQuantity || 0);
                      const invQty = Number(it.quantity || 0);
                      return grnQty !== invQty;
                    });
                    return (
                      <>
                        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-200 hover:shadow-lg transition-all duration-300">
                          <div className="text-center space-y-3">
                            <div className="mx-auto w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center">
                              <Package className="h-8 w-8 text-blue-700" />
                            </div>
                            <h3 className="font-semibold text-gray-800 text-lg">أمر الشراء</h3>
                            <p className="text-sm text-blue-600 font-medium">{po?.poNumber || (po?.id ? `PO-${po.id}` : "-")}</p>
                            <div className="transform scale-110">
                              {getStatusBadge(poMismatch ? "غير مطابق" : "مطابق")}
                            </div>
                          </div>
                        </Card>
                        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-200 hover:shadow-lg transition-all duration-300">
                          <div className="text-center space-y-3">
                            <div className="mx-auto w-16 h-16 bg-green-200 rounded-full flex items-center justify-center">
                              <Receipt className="h-8 w-8 text-green-700" />
                            </div>
                            <h3 className="font-semibold text-gray-800 text-lg">سند الاستلام</h3>
                            <p className="text-sm text-green-600 font-medium">{grn?.grnNumber || (grn?.id ? `GRN-${grn.id}` : "-")}</p>
                            <div className="transform scale-110">
                              {getStatusBadge(grnMismatch ? "غير مطابق" : "مطابق")}
                            </div>
                          </div>
                        </Card>
                        <Card className="p-6 bg-gradient-to-br from-orange-50 to-amber-100 border-2 border-orange-200 hover:shadow-lg transition-all duration-300">
                          <div className="text-center space-y-3">
                            <div className="mx-auto w-16 h-16 bg-orange-200 rounded-full flex items-center justify-center">
                              <FileText className="h-8 w-8 text-orange-700" />
                            </div>
                            <h3 className="font-semibold text-gray-800 text-lg">الايصال</h3>
                            <p className="text-sm text-orange-600 font-medium">{invoice.invoiceNumber || (invoice.id ? `INV-${invoice.id}` : "-")}</p>
                            <div className="transform scale-110">
                              {getStatusBadge(invoice.matchingStatus || (hasAnyVariance ? "غير مطابق" : "مطابق"))}
                            </div>
                          </div>
                        </Card>
                      </>
                    );
                  })()}
                </div>

                {/* تفاصيل المطابقة */}
                <Card className="border-2 border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50">
                    <CardTitle className="text-lg text-gray-800">تفاصيل المطابقة</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gradient-to-r from-blue-50 to-indigo-50 hover:bg-blue-100">
                          <TableHead className="font-semibold text-gray-800">الصنف</TableHead>
                          <TableHead className="font-semibold text-gray-800">كمية أمر الشراء</TableHead>
                          <TableHead className="font-semibold text-gray-800">كمية الاستلام</TableHead>
                          <TableHead className="font-semibold text-gray-800">كمية الايصال</TableHead>
                          <TableHead className="font-semibold text-gray-800">سعر أمر الشراء</TableHead>
                          <TableHead className="font-semibold text-gray-800">سعر الايصال</TableHead>
                          <TableHead className="font-semibold text-gray-800">الفرق</TableHead>
                          <TableHead className="font-semibold text-gray-800">الحالة</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(() => {
                          const po = purchaseOrders.find((p: any) => String(p.id) === String(invoice.purchaseOrderId));
                          const items = invoice.items || [];
                          if (!items.length) {
                            return (
                              <TableRow>
                                <TableCell colSpan={8} className="text-center text-muted-foreground">لا توجد أصناف</TableCell>
                              </TableRow>
                            );
                          }
                          return items.map((it: any) => {
                            const poItem = (po?.items || []).find((pi: any) => pi.name === it.name);
                            const poQty = Number(poItem?.quantity || 0);
                            const poPrice = Number(poItem?.price || 0);
                            const grnQty = Number(it.grnQuantity || 0);
                            const invQty = Number(it.quantity || 0);
                            const invPrice = Number(it.price || 0);
                            const variance = Number(it.variance || 0);
                            const rowStatus = variance > 0 ? "غير مطابق" : "مطابق";
                            return (
                              <TableRow key={it.id} className="hover:bg-gray-50 transition-colors">
                                <TableCell className="font-medium text-gray-800">{it.name || '-'}</TableCell>
                                <TableCell className="text-center">{poQty}</TableCell>
                                <TableCell className="text-center">{grnQty}</TableCell>
                                <TableCell className="text-center font-semibold">{invQty}</TableCell>
                                <TableCell className="text-center text-blue-600">{poPrice ? `${poPrice.toLocaleString()} جنيه مصري` : '-'}</TableCell>
                                <TableCell className="text-center text-green-600">{invPrice ? `${invPrice.toLocaleString()} جنيه مصري` : '-'}</TableCell>
                                <TableCell className={`text-center font-semibold ${variance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                  {`${variance.toLocaleString()} جنيه مصري`}
                                </TableCell>
                                <TableCell className="text-center">{getStatusBadge(rowStatus)}</TableCell>
                              </TableRow>
                            );
                          });
                        })()}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                {/* إجراءات المطابقة */}
                <div className="flex gap-4 justify-center">
                  <Button variant="outline" onClick={handleConvertToReview} className="border-orange-300 text-orange-700 hover:bg-orange-50 hover:border-orange-400 transition-all duration-200">
                    <AlertCircle className="ml-2 h-4 w-4" />
                    تحويل للمراجعة
                  </Button>
                  <Button variant="outline" onClick={handleContactSupplier} className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 transition-all duration-200">
                    <Phone className="ml-2 h-4 w-4" />
                    التواصل مع المورد
                  </Button>
                  <Button onClick={handleAcceptWithNotes} className="bg-green-600 hover:bg-green-700 shadow-md transition-all duration-200">
                    <CheckCircle className="ml-2 h-4 w-4" />
                    قبول مع الملاحظات
                  </Button>
                  <Button variant="destructive" onClick={handleRejectInvoice} className="bg-red-600 hover:bg-red-700 shadow-md transition-all duration-200">
                    <X className="ml-2 h-4 w-4" />
                    رفض الايصال
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* تبويب موافقة الدفع */}
        <TabsContent value="approval" className="space-y-6">
          <Card className="border-2 border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50">
              <CardTitle className="text-xl text-gray-800">دورة موافقة الدفع</CardTitle>
              <CardDescription className="text-gray-600">مراجعة وموافقة الإيصالات للدفع</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* الإيصالات المعلقة للموافقة */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">الإيصالات بانتظار الموافقة</h3>
                  
                  {invoices
                    .filter((inv: any) => inv.status === "بانتظار الموافقة" || inv.status === "بانتظار الدفع")
                    .map((invoice: any) => (
                      <Card key={invoice.id} className="p-6 border-2 border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-white to-blue-50">
                        <div className="flex items-center justify-between">
                          <div className="grid grid-cols-4 gap-6 flex-1">
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-gray-600">رقم الايصال</p>
                              <p className="text-lg font-semibold text-gray-800">{invoice.invoiceNumber}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-gray-600">المورد</p>
                              <p className="text-lg font-medium text-blue-700">{getSupplierName(invoice.supplierId, invoice.supplier)}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-gray-600">المبلغ</p>
                              <p className="text-xl font-bold text-green-600">
                                {Number(invoice.invoiceAmount || 0).toLocaleString()} جنيه مصري
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-gray-600">تاريخ الاستحقاق</p>
                              <p className="text-lg font-medium text-gray-800">{invoice.dueDate}</p>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <Button variant="outline" size="sm" onClick={() => handleListReview(invoice.id)} className="border-blue-300 text-blue-700 hover:bg-blue-50">
                              <Eye className="ml-2 h-4 w-4" />
                              مراجعة
                            </Button>
                            <Button size="sm" onClick={() => handleApprovePayment(invoice.id)} className="bg-green-600 hover:bg-green-700 shadow-md">
                              <CheckCircle className="ml-2 h-4 w-4" />
                              موافقة
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleListReject(invoice.id)} className="bg-red-600 hover:bg-red-700 shadow-md">
                              <X className="ml-2 h-4 w-4" />
                              رفض
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                </div>

                {/* سجل الموافقات */}
                <Card className="border-2 border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                    <CardTitle className="text-lg text-gray-800">سجل الموافقات</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gradient-to-r from-green-50 to-emerald-50 hover:bg-green-100">
                          <TableHead className="font-semibold text-gray-800">رقم الايصال</TableHead>
                          <TableHead className="font-semibold text-gray-800">المورد</TableHead>
                          <TableHead className="font-semibold text-gray-800">المبلغ</TableHead>
                          <TableHead className="font-semibold text-gray-800">المُوافِق</TableHead>
                          <TableHead className="font-semibold text-gray-800">تاريخ الموافقة</TableHead>
                          <TableHead className="font-semibold text-gray-800">الملاحظات</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(() => {
                          const approved = invoices.filter((inv: any) => ["بانتظار الموافقة", "بانتظار الدفع", "مدفوعة", "مرفوضة"].includes(inv.status));
                          if (!approved.length) {
                            return (
                              <TableRow>
                                <TableCell colSpan={6} className="text-center text-muted-foreground">لا توجد بيانات</TableCell>
                              </TableRow>
                            );
                          }
                          return approved.map((inv: any) => (
                            <TableRow key={inv.id} className="hover:bg-green-50 transition-colors">
                              <TableCell className="font-medium text-gray-800">{inv.invoiceNumber}</TableCell>
                              <TableCell className="text-blue-700 font-medium">{getSupplierName(inv.supplierId, inv.supplier)}</TableCell>
                              <TableCell className="text-green-600 font-semibold">{Number(inv.invoiceAmount || 0).toLocaleString()} جنيه مصري</TableCell>
                              <TableCell className="text-gray-700">{inv.approvedBy || '-'}</TableCell>
                              <TableCell className="text-gray-600">{inv.updatedAt || inv.invoiceDate || '-'}</TableCell>
                              <TableCell className="text-gray-600">{inv.notes || '-'}</TableCell>
                            </TableRow>
                          ));
                        })()}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* تبويب جدولة الدفع */}
        <TabsContent value="payment" className="space-y-6">
          <Card className="border-2 border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50">
              <CardTitle className="text-xl text-gray-800">جدولة الدفعات</CardTitle>
              <CardDescription className="text-gray-600">تنظيم وجدولة دفعات الموردين</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* إحصائيات الدفع */}
                <div className="grid grid-cols-4 gap-6">
                  <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-200 hover:shadow-lg transition-all duration-300">
                    <div className="text-center space-y-3">
                      <div className="mx-auto w-14 h-14 bg-blue-200 rounded-full flex items-center justify-center">
                        <Calendar className="h-7 w-7 text-blue-700" />
                      </div>
                      <h3 className="font-semibold text-gray-800">مجدول اليوم</h3>
                      {(() => {
                        const today = new Date().toISOString().split('T')[0];
                        const list = (Array.isArray(paymentSchedules) ? paymentSchedules : []).filter((p: any) => p.scheduledDate === today);
                        const sum = list.reduce((s: number, p: any) => s + Number(p.amount || 0), 0);
                        return <>
                          <p className="text-3xl font-bold text-blue-700">{list.length}</p>
                          <p className="text-sm text-blue-600 font-medium">{sum.toLocaleString()} جنيه مصري</p>
                        </>;
                      })()}
                    </div>
                  </Card>
                  <Card className="p-6 bg-gradient-to-br from-yellow-50 to-amber-100 border-2 border-yellow-200 hover:shadow-lg transition-all duration-300">
                    <div className="text-center space-y-3">
                      <div className="mx-auto w-14 h-14 bg-yellow-200 rounded-full flex items-center justify-center">
                        <Clock className="h-7 w-7 text-yellow-700" />
                      </div>
                      <h3 className="font-semibold text-gray-800">مستحق هذا الأسبوع</h3>
                      {(() => {
                        const today = new Date();
                        const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                        const end = new Date(start);
                        end.setDate(start.getDate() + 7);
                        const list = (Array.isArray(paymentSchedules) ? paymentSchedules : []).filter((p: any) => {
                          const d = new Date(p.scheduledDate);
                          return d >= start && d <= end && p.status !== 'مدفوعة';
                        });
                        const sum = list.reduce((s: number, p: any) => s + Number(p.amount || 0), 0);
                        return <>
                          <p className="text-3xl font-bold text-yellow-700">{list.length}</p>
                          <p className="text-sm text-yellow-600 font-medium">{sum.toLocaleString()} جنيه مصري</p>
                        </>;
                      })()}
                    </div>
                  </Card>
                  <Card className="p-6 bg-gradient-to-br from-red-50 to-pink-100 border-2 border-red-200 hover:shadow-lg transition-all duration-300">
                    <div className="text-center space-y-3">
                      <div className="mx-auto w-14 h-14 bg-red-200 rounded-full flex items-center justify-center">
                        <AlertTriangle className="h-7 w-7 text-red-700" />
                      </div>
                      <h3 className="font-semibold text-gray-800">متأخر</h3>
                      {(() => {
                        const today = new Date();
                        const list = (Array.isArray(paymentSchedules) ? paymentSchedules : []).filter((p: any) => new Date(p.scheduledDate) < today && p.status !== 'مدفوعة');
                        const sum = list.reduce((s: number, p: any) => s + Number(p.amount || 0), 0);
                        return <>
                          <p className="text-3xl font-bold text-red-700">{list.length}</p>
                          <p className="text-sm text-red-600 font-medium">{sum.toLocaleString()} جنيه مصري</p>
                        </>;
                      })()}
                    </div>
                  </Card>
                  <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-200 hover:shadow-lg transition-all duration-300">
                    <div className="text-center space-y-3">
                      <div className="mx-auto w-14 h-14 bg-green-200 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-7 w-7 text-green-700" />
                      </div>
                      <h3 className="font-semibold text-gray-800">مدفوع اليوم</h3>
                      {(() => {
                        const today = new Date().toISOString().split('T')[0];
                        const list = (Array.isArray(paymentSchedules) ? paymentSchedules : []).filter((p: any) => p.status === 'مدفوعة' && p.scheduledDate === today);
                        const sum = list.reduce((s: number, p: any) => s + Number(p.amount || 0), 0);
                        return <>
                          <p className="text-3xl font-bold text-green-700">{list.length}</p>
                          <p className="text-sm text-green-600 font-medium">{sum.toLocaleString()} جنيه مصري</p>
                        </>;
                      })()}
                    </div>
                  </Card>
                </div>

                {/* جدول الدفعات المجدولة */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-800">الدفعات المجدولة</h3>
                    <div className="flex gap-3">
                      <Button variant="outline" onClick={fetchPaymentSchedules} className="border-blue-300 text-blue-700 hover:bg-blue-50">
                        <RefreshCw className="ml-2 h-4 w-4" />
                        تحديث
                      </Button>
                      <Button variant="outline" onClick={async () => {
                        console.log('Manually creating payment schedules for pending invoices...');
                        const pendingInvoices = invoices.filter((inv: any) => 
                          inv.status === "بانتظار الدفع" || inv.status === "بانتظار الموافقة"
                        );
                        console.log('Found pending invoices:', pendingInvoices);
                        
                        if (pendingInvoices.length === 0) {
                          toast({ title: "لا توجد إيصالات في انتظار الدفع أو الموافقة", variant: "destructive" });
                          return;
                        }
                        
                        for (const invoice of pendingInvoices) {
                          try {
                            const paymentScheduleData = {
                              purchaseInvoiceId: Number(invoice.id),
                              scheduledDate: invoice.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                              amount: Number(invoice.invoiceAmount || 0),
                              paymentMethod: invoice.paymentMethod === 'transfer' ? 'تحويل_بنكي' : 
                                             invoice.paymentMethod === 'check' ? 'شيك' :
                                             invoice.paymentMethod === 'cash' ? 'نقد' :
                                             invoice.paymentMethod === 'credit' ? 'بطاقة_ائتمان' : 'تحويل_بنكي',
                              status: 'مجدول'
                            };
                            
                            // التحقق من صحة البيانات قبل الإرسال
                            if (!paymentScheduleData.purchaseInvoiceId || !paymentScheduleData.scheduledDate || !paymentScheduleData.amount) {
                              console.error('Invalid payment schedule data:', paymentScheduleData);
                              console.error('Invoice data:', invoice);
                              continue; // تخطي هذا الايصال
                            }
                            
                            console.log('Creating payment schedule for invoice:', invoice.id, paymentScheduleData);
                            
                            const paymentRes = await fetch(`${API_BASE_URL}/api/v1/supplier-payment-schedules`, {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify(paymentScheduleData),
                            });
                            
                            console.log('Payment schedule creation response status for invoice', invoice.id, ':', paymentRes.status);
                            console.log('Payment schedule creation response ok for invoice', invoice.id, ':', paymentRes.ok);
                            
                            if (paymentRes.ok) {
                              console.log('Payment schedule created for invoice:', invoice.id);
                              const createdPayment = await paymentRes.json();
                              console.log('Created payment schedule response for invoice', invoice.id, ':', createdPayment);
                            } else {
                              const errorText = await paymentRes.text();
                              console.error('Failed to create payment schedule for invoice:', invoice.id, 'Error:', errorText);
                            }
                          } catch (e) {
                            console.error('Error creating payment schedule for invoice:', invoice.id, e);
                          }
                        }
                        
                        // إعادة جلب جدول الدفعات
                        await fetchPaymentSchedules();
                        toast({ title: "تم إنشاء جداول الدفع", description: `تم إنشاء ${pendingInvoices.length} جدول دفع` });
                      }} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                        <Plus className="ml-2 h-4 w-4" />
                        إنشاء جداول دفع
                      </Button>
                      <Button onClick={handleMakePaymentAction} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                        <CreditCard className="ml-2 h-4 w-4" />
                        إجراء دفعة
                      </Button>
                    </div>
                  </div>
                  
                  <Table className="border-2 border-gray-100 rounded-lg overflow-hidden shadow-sm">
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-purple-50 to-indigo-50 hover:bg-purple-100">
                        <TableHead className="font-semibold text-gray-800">رقم الايصال</TableHead>
                        <TableHead className="font-semibold text-gray-800">المورد</TableHead>
                        <TableHead className="font-semibold text-gray-800">المبلغ</TableHead>
                        <TableHead className="font-semibold text-gray-800">تاريخ الاستحقاق</TableHead>
                        <TableHead className="font-semibold text-gray-800">تاريخ الدفع المجدول</TableHead>
                        <TableHead className="font-semibold text-gray-800">طريقة الدفع</TableHead>
                        <TableHead className="font-semibold text-gray-800">الحالة</TableHead>
                        <TableHead className="font-semibold text-gray-800">الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(() => {
                        const schedules = Array.isArray(paymentSchedules) ? paymentSchedules : [];
                        if (!schedules.length) {
                          return (
                            <TableRow>
                              <TableCell colSpan={8} className="text-center text-muted-foreground">
                                لا توجد دفعات مجدولة
                              </TableCell>
                            </TableRow>
                          );
                        }
                        return schedules.map((payment: any) => (
                          <TableRow key={payment.id} className="hover:bg-purple-50 transition-colors">
                            <TableCell className="font-medium text-gray-800">{payment.invoice?.invoiceNumber || `INV-${payment.purchaseInvoiceId}`}</TableCell>
                            <TableCell className="text-blue-700 font-medium">{getSupplierName(payment.invoice?.supplierId, payment.invoice?.supplier)}</TableCell>
                            <TableCell className="text-green-600 font-semibold">{Number(payment.amount || 0).toLocaleString()} جنيه مصري</TableCell>
                            <TableCell className="text-gray-600">{payment.invoice?.dueDate || "-"}</TableCell>
                            <TableCell className="text-purple-600 font-medium">{payment.scheduledDate}</TableCell>
                            <TableCell className="text-gray-700">{payment.paymentMethod}</TableCell>
                            <TableCell>{getStatusBadge(payment.status)}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button size="sm" onClick={async () => {
                                  try {
                                    const res = await fetch(`${API_BASE_URL}/api/v1/supplier-payment-schedules/${payment.id}`, {
                                      method: "PUT",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({ status: 'مدفوعة' }),
                                    });
                                    if (!res.ok) throw new Error("فشل تحديث حالة الدفعة");

                                    if (payment.purchaseInvoiceId) {
                                      await fetch(`${API_BASE_URL}/api/v1/purchase-invoices/${payment.purchaseInvoiceId}`, {
                                        method: "PUT",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ 
                                          status: 'مدفوعة', 
                                          actualPaymentDate: new Date().toISOString().split('T')[0] 
                                        }),
                                      });
                                    }
                                    await Promise.all([fetchPaymentSchedules(), fetchInvoices()]);
                                    toast({ title: 'تم الدفع بنجاح' });
                                  } catch (e: any) {
                                    toast({ title: 'فشل تنفيذ الدفع', description: e.message, variant: 'destructive' });
                                  }
                                }} className="bg-green-600 hover:bg-green-700 shadow-md">
                                  <CreditCard className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ));
                      })()}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* تبويب سجل الإيصالات */}
        <TabsContent value="history" className="space-y-6">
          <Card className="border-2 border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50">
              <CardTitle className="text-xl text-gray-800">سجل الإيصالات</CardTitle>
              <CardDescription className="text-gray-600">جميع الإيصالات المعالجة وحالتها</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input 
                        placeholder="البحث في الإيصالات..." 
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="حالة الايصال" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الحالات</SelectItem>
                      <SelectItem value="pending">بانتظار المطابقة</SelectItem>
                      <SelectItem value="matched">مطابقة</SelectItem>
                      <SelectItem value="approved">موافق عليها</SelectItem>
                      <SelectItem value="paid">مدفوعة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>رقم الايصال</TableHead>
                      <TableHead>المورد</TableHead>
                      <TableHead>رقم أمر الشراء</TableHead>
                      <TableHead>التاريخ</TableHead>
                      <TableHead>المبلغ</TableHead>
                      <TableHead>حالة المطابقة</TableHead>
                      <TableHead>حالة الدفع</TableHead>
                      <TableHead>الفرق</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((inv: Invoice) => (
                      <TableRow key={inv.id}>
                        <TableCell className="font-medium">{inv.invoiceNumber}</TableCell>
                        <TableCell>{getSupplierName(inv.supplierId, inv.supplier)}</TableCell>
                                                    <TableCell>
                              {(() => {
                                // محاولة الوصول لرقم أمر الشراء بطرق مختلفة
                                if (inv.purchaseOrder) {
                                  const poNumber = inv.purchaseOrder.poNumber || 
                                                 inv.purchaseOrder.id;
                                  return poNumber ? `PO-${poNumber}` : "-";
                                }
                                // إذا لم يكن هناك purchaseOrder، استخدم purchaseOrderId
                                return inv.purchaseOrderId ? `PO-${inv.purchaseOrderId}` : "-";
                              })()}
                            </TableCell>
                        <TableCell>{inv.invoiceDate}</TableCell>
                        <TableCell>{Number(inv.invoiceAmount || 0).toLocaleString()} جنيه مصري</TableCell>
                        <TableCell>{getStatusBadge(inv.matchingStatus)}</TableCell>
                        <TableCell>{getStatusBadge(inv.status)}</TableCell>
                        <TableCell>
                          {/* Using sum of item variances if present */}
                          {(() => {
                            const variance = (inv.items || []).reduce((s: number, it: InvoiceItem) => s + Number(it.variance || 0), 0);
                            return variance > 0 ? (
                              <span className="text-red-600 font-medium">{variance.toLocaleString()} جنيه مصري</span>
                            ) : (
                              <span className="text-green-600">0 جنيه مصري</span>
                            );
                          })()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleHistoryView(inv.id)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleHistoryPrint}>
                              <Printer className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleHistoryDownload(inv)}>
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

        {/* تبويب التقارير */}
        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-2 border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-blue-50 to-indigo-100">
              <CardHeader className="bg-gradient-to-r from-blue-100 to-indigo-200">
                <CardTitle className="flex items-center text-blue-800">
                  <TrendingUp className="ml-2 h-5 w-5" />
                  إحصائيات عامة
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                    <span className="text-gray-700">إجمالي الإيصالات</span>
                    <span className="font-bold text-blue-600 text-lg">156</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                    <span className="text-gray-700">معدل المطابقة</span>
                    <span className="font-bold text-green-600 text-lg">94%</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                    <span className="text-gray-700">متوسط وقت المعالجة</span>
                    <span className="font-bold text-orange-600 text-lg">2.5 يوم</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                    <span className="text-gray-700">إجمالي المدفوعات</span>
                    <span className="font-bold text-green-600 text-lg">2,450,000 جنيه مصري</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-green-50 to-emerald-100">
              <CardHeader className="bg-gradient-to-r from-green-100 to-emerald-200">
                <CardTitle className="flex items-center text-green-800">
                  <FileCheck className="ml-2 h-5 w-5" />
                  كفاءة المطابقة
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                    <span className="text-gray-700">مطابقة تلقائية</span>
                    <span className="font-bold text-green-600 text-lg">78%</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                    <span className="text-gray-700">مطابقة يدوية</span>
                    <span className="font-bold text-blue-600 text-lg">16%</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                    <span className="text-gray-700">إيصالات مرفوضة</span>
                    <span className="font-bold text-red-600 text-lg">6%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500" style={{width: '78%'}}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-purple-50 to-indigo-100">
              <CardHeader className="bg-gradient-to-r from-purple-100 to-indigo-200">
                <CardTitle className="flex items-center text-purple-800">
                  <CreditCard className="ml-2 h-5 w-5" />
                  أداء المدفوعات
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                    <span className="text-gray-700">دفع في الوقت</span>
                    <span className="font-bold text-green-600 text-lg">89%</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                    <span className="text-gray-700">دفع مبكر</span>
                    <span className="font-bold text-blue-600 text-lg">7%</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                    <span className="text-gray-700">دفع متأخر</span>
                    <span className="font-bold text-red-600 text-lg">4%</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                    <span className="text-gray-700">متوسط الخصم المحقق</span>
                    <span className="font-bold text-green-600 text-lg">2.3%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-2 border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
              <CardTitle className="text-xl text-gray-800">تقارير تفصيلية</CardTitle>
              <CardDescription className="text-gray-600">إنتاج وتصدير التقارير المالية</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex-col">
                  <FileText className="h-6 w-6 mb-2" />
                  تقرير الإيصالات
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Calculator className="h-6 w-6 mb-2" />
                  تقرير المطابقة
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <CreditCard className="h-6 w-6 mb-2" />
                  تقرير المدفوعات
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <TrendingUp className="h-6 w-6 mb-2" />
                  تحليل الأداء
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InvoiceProcessing;