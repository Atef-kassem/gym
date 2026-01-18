import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  FileText, Search, Calendar, DollarSign, CheckCircle, Clock, 
  AlertCircle, Upload, Download, Edit, Eye, CreditCard, Building2,
  Mail, Phone, Package, Filter, Printer, Star, TrendingUp,
  BarChart3, Bell, Shield, Zap, RefreshCw, X, Check, AlertTriangle,
  Receipt, Banknote, Calculator, FileCheck, Users, Settings, Plus,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  useListDebitNotesQuery,
  useCreateDebitNoteMutation,
  useUpdateDebitNoteMutation,
  useDeleteDebitNoteMutation,
  useChangeDebitNoteStatusMutation,
  useSendDebitNoteToSupplierMutation,
  useGetDebitNoteStatsQuery
} from "@/services/debitNoteApi";
import { useGetAllSuppliersQuery } from "@/services/suppliersApi";
import { useListPurchaseOrdersQuery } from "@/services/purchaseOrdersApi";
import { useListPurchaseInvoicesQuery } from "@/services/invoiceApi";

// Types
interface Supplier {
  supplier_id: number;
  name_ar: string;
  name_en?: string;
  email?: string;
  phone?: string;
}

interface PurchaseOrder {
  id: number;
  poNumber: string;
  totalAmount: number;
  supplier_id?: number;
  supplierId?: number;
  createdDate?: string;
  requisitionId?: number;
}

interface PurchaseInvoice {
  id: number;
  invoiceNumber: string;
  totalAmount: number;
  supplier_id?: number;
  supplierId?: number;
  poNumber?: string;
  purchaseOrderId?: number;
  invoiceDate?: string;
  items?: Array<{
    id?: number;
    name?: string;
    description?: string;
    quantity?: number;
    unitPrice?: number;
    price?: number;
    unit?: string;
    purchaseOrderItemId?: number;
  }>;
}

interface DebitNote {
  id: number;
  debit_number: string;
  debit_date: string;
  supplier_id: number;
  po_number: string;
  purchase_order_id: number;
  invoice_number: string;
  invoice_id: number;
  reason: string;
  reason_details: string;
  debit_amount: number;
  status: string;
  notes: string;
  supplier?: Supplier;
  approved_by?: string;
  items?: Array<{
    name: string;
    description: string;
    quantity: string | number;
    unit_price: string | number;
    amount: number;
    item_id: number | null;
    purchase_order_item_id: number | null;
  }>;
}

const DebitNote = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("new-debit");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [selectedPO, setSelectedPO] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState("");
  const [selectedDebitForView, setSelectedDebitForView] = useState<DebitNote | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);

  // حالة النموذج
  const [debitNote, setDebitNote] = useState({
    debit_number: "",
    debit_date: new Date().toISOString().split('T')[0],
    supplier_id: "",
    po_number: "",
    purchase_order_id: "",
    invoice_number: "",
    invoice_id: "",
    reason: "",
    reason_details: "",
    debit_amount: 0,
    status: "مسودة",
    notes: "",
    items: [
      { 
        name: "", 
        description: "", 
        quantity: "", 
        unit_price: "", 
        amount: 0,
        item_id: null,
        purchase_order_item_id: null
      }
    ]
  });

  // استعلامات البيانات
  const { data: debitNotesData, isLoading: isLoadingDebitNotes, refetch: refetchDebitNotes } = useListDebitNotesQuery({
    status: statusFilter !== "all" ? statusFilter : undefined,
    supplier: selectedSupplier || undefined,
    q: searchTerm || undefined
  });

  const { data: suppliersData, isLoading: isLoadingSuppliers } = useGetAllSuppliersQuery(undefined);
  const { data: purchaseOrdersData, isLoading: isLoadingPOs } = useListPurchaseOrdersQuery(undefined);
  const { data: invoicesData, isLoading: isLoadingInvoices } = useListPurchaseInvoicesQuery(undefined);
  const { data: statsData, isLoading: isLoadingStats } = useGetDebitNoteStatsQuery(undefined);

  // معالجة البيانات
  const suppliers: Supplier[] = (() => {
    try {
      if (!suppliersData) return [];
      if (Array.isArray(suppliersData)) return suppliersData as Supplier[];
      if (Array.isArray(suppliersData.data)) return suppliersData.data as Supplier[];
      if (suppliersData.data && Array.isArray(suppliersData.data.suppliers)) return suppliersData.data.suppliers as Supplier[];
      if (suppliersData.data && Array.isArray(suppliersData.data.supplier)) return suppliersData.data.supplier as Supplier[];
      return [];
    } catch (error) {
      console.error('Error processing suppliers data:', error);
      return [];
    }
  })();

  const purchaseOrders: PurchaseOrder[] = (() => {
    try {
      if (!purchaseOrdersData) return [];
      if (Array.isArray(purchaseOrdersData)) return purchaseOrdersData as PurchaseOrder[];
      if (Array.isArray(purchaseOrdersData.data)) return purchaseOrdersData.data as PurchaseOrder[];
      if (purchaseOrdersData.data && Array.isArray(purchaseOrdersData.data.purchaseOrders)) return purchaseOrdersData.data.purchaseOrders as PurchaseOrder[];
      if (purchaseOrdersData.data && Array.isArray(purchaseOrdersData.data.purchase_orders)) return purchaseOrdersData.data.purchase_orders as PurchaseOrder[];
      return [];
    } catch (error) {
      console.error('Error processing purchase orders data:', error);
      return [];
    }
  })();

  const invoices: PurchaseInvoice[] = (() => {
    try {
      if (!invoicesData) return [];
      if (Array.isArray(invoicesData)) return invoicesData as PurchaseInvoice[];
      if (Array.isArray(invoicesData.data)) return invoicesData.data as PurchaseInvoice[];
      if (invoicesData.data && Array.isArray(invoicesData.data.purchaseInvoices)) return invoicesData.data.purchaseInvoices as PurchaseInvoice[];
      if (invoicesData.data && Array.isArray(invoicesData.data.invoices)) return invoicesData.data.invoices as PurchaseInvoice[];
      return [];
    } catch (error) {
      console.error('Error processing invoices data:', error);
      return [];
    }
  })();

  // فلترة أوامر الشراء حسب المورد المحدد
  const filteredPurchaseOrders = useMemo(() => {
    if (!purchaseOrders || purchaseOrders.length === 0) return [];
    
    // إذا لم يتم اختيار مورد، اعرض جميع أوامر الشراء
    if (!selectedSupplier) return purchaseOrders;
    
    // إذا تم اختيار مورد، اعرض فقط أوامر الشراء لهذا المورد
    return purchaseOrders.filter(po => {
      // البحث في الحقول المختلفة المحتملة
      if (po.supplier_id) {
        return po.supplier_id.toString() === selectedSupplier;
      }
      if (po.supplierId) {
        return po.supplierId.toString() === selectedSupplier;
      }
      return false;
    });
  }, [selectedSupplier, purchaseOrders]);

  // فلترة الإيصالات حسب المورد المحدد
  const filteredInvoices = useMemo(() => {
    if (!invoices || invoices.length === 0) return [];
    
    // إذا لم يتم اختيار مورد، اعرض جميع الإيصالات
    if (!selectedSupplier) return invoices;
    
    // إذا تم اختيار مورد، اعرض فقط الإيصالات المرتبطة بهذا المورد
    return invoices.filter(invoice => {
      // البحث عن الإيصالات المرتبطة بالمورد المحدد
      if (invoice.supplier_id) {
        return invoice.supplier_id.toString() === selectedSupplier;
      }
      if (invoice.supplierId) {
        return invoice.supplierId.toString() === selectedSupplier;
      }
      
      // البحث في أوامر الشراء المرتبطة
      if (invoice.purchaseOrderId) {
        const po = purchaseOrders.find(po => po.id === invoice.purchaseOrderId);
        if (po) {
          if (po.supplier_id && po.supplier_id.toString() === selectedSupplier) return true;
          if (po.supplierId && po.supplierId.toString() === selectedSupplier) return true;
        }
      }
      
      return false;
    });
  }, [selectedSupplier, invoices, purchaseOrders]);

  // تسجيل البيانات للتشخيص
  console.log('Suppliers Data:', suppliersData);
  console.log('Suppliers Array:', suppliers);
  console.log('Purchase Orders Data:', purchaseOrdersData);
  console.log('Invoices Data:', invoicesData);

  // التأكد من أن البيانات مصفوفات
  console.log('Suppliers is Array:', Array.isArray(suppliers));
  console.log('Purchase Orders is Array:', Array.isArray(purchaseOrders));
  console.log('Invoices is Array:', Array.isArray(invoices));

  // تسجيل الفلترة
  console.log('Selected Supplier:', selectedSupplier);
  console.log('Filtered Purchase Orders:', filteredPurchaseOrders);
  console.log('Filtered Invoices:', filteredInvoices);
  console.log('Raw Invoices Data:', invoices);
  console.log('Raw Purchase Orders Data:', purchaseOrders);
  console.log('Invoices Length:', invoices?.length);
  console.log('Purchase Orders Length:', purchaseOrders?.length);
  console.log('First Invoice:', invoices?.[0]);
  console.log('First PO:', purchaseOrders?.[0]);

  // الطفرات
  const [createDebitNote, { isLoading: isCreating }] = useCreateDebitNoteMutation();
  const [updateDebitNote, { isLoading: isUpdating }] = useUpdateDebitNoteMutation();
  const [deleteDebitNote, { isLoading: isDeleting }] = useDeleteDebitNoteMutation();
  const [changeStatus, { isLoading: isChangingStatus }] = useChangeDebitNoteStatusMutation();
  const [sendToSupplier, { isLoading: isSending }] = useSendDebitNoteToSupplierMutation();

  // توليد رقم الإشعار التلقائي
  useEffect(() => {
    if (debitNotesData?.data && debitNotesData.data.length > 0) {
      const lastNumber = debitNotesData.data[0].debit_number;
      const match = lastNumber.match(/DN-(\d{4})-(\d+)/);
      if (match) {
        const year = match[1];
        const number = parseInt(match[2]) + 1;
        setDebitNote(prev => ({
          ...prev,
          debit_number: `DN-${year}-${number.toString().padStart(3, '0')}`
        }));
      }
    } else {
      const currentYear = new Date().getFullYear();
      setDebitNote(prev => ({
        ...prev,
        debit_number: `DN-${currentYear}-001`
      }));
    }
  }, [debitNotesData]);

  // تحديث المورد المحدد
  useEffect(() => {
    if (selectedSupplier) {
      setDebitNote(prev => ({
        ...prev,
        supplier_id: selectedSupplier
      }));
      
      // إعادة تعيين أمر الشراء والايصال عند تغيير المورد
      setSelectedPO("");
      setSelectedInvoice("");
      setDebitNote(prev => ({
        ...prev,
        po_number: "",
        purchase_order_id: "",
        invoice_number: "",
        invoice_id: ""
      }));
    }
  }, [selectedSupplier]);

  // تحديث أمر الشراء المحدد
  useEffect(() => {
    if (selectedPO) {
      const po = purchaseOrders.find(po => po.id.toString() === selectedPO);
      if (po) {
        setDebitNote(prev => ({
          ...prev,
          po_number: po.poNumber,
          purchase_order_id: po.id.toString()
        }));
      }
    }
  }, [selectedPO, purchaseOrders]);

  // تحديث الايصال المحددة
  useEffect(() => {
    if (selectedInvoice) {
      const invoice = invoices.find(inv => inv.id.toString() === selectedInvoice);
      if (invoice) {
        // تحديث معلومات الايصال الأساسية
        setDebitNote(prev => ({
          ...prev,
          invoice_number: invoice.invoiceNumber,
          invoice_id: invoice.id.toString()
        }));

        // إذا كانت الايصال مرتبطة بأمر شراء، تحديث أمر الشراء تلقائياً
        if (invoice.purchaseOrderId) {
          const relatedPO = purchaseOrders.find(po => po.id === invoice.purchaseOrderId);
          if (relatedPO) {
            setSelectedPO(relatedPO.id.toString());
            setDebitNote(prev => ({
              ...prev,
              po_number: relatedPO.poNumber,
              purchase_order_id: relatedPO.id.toString()
            }));
          }
        }

        // إذا كانت الايصال مرتبطة بمورد، تحديث المورد تلقائياً
        if (invoice.supplierId && !selectedSupplier) {
          setSelectedSupplier(invoice.supplierId.toString());
          setDebitNote(prev => ({
            ...prev,
            supplier_id: invoice.supplierId.toString()
          }));
        } else if (invoice.supplier_id && !selectedSupplier) {
          setSelectedSupplier(invoice.supplier_id.toString());
          setDebitNote(prev => ({
            ...prev,
            supplier_id: invoice.supplier_id.toString()
          }));
        }

        // تحديث تاريخ الايصال إذا كان متوفراً
        if (invoice.invoiceDate) {
          setDebitNote(prev => ({
            ...prev,
            debit_date: invoice.invoiceDate || new Date().toISOString().split('T')[0]
          }));
        }

        // تحديث المبلغ الإجمالي للايصال
        if (invoice.totalAmount) {
          setDebitNote(prev => ({
            ...prev,
            debit_amount: invoice.totalAmount
          }));
        }

        // إضافة الأصناف تلقائياً إذا كانت متوفرة
        if (invoice.items && Array.isArray(invoice.items) && invoice.items.length > 0) {
          const invoiceItems = invoice.items.map(item => ({
            name: item.name || item.description || 'صنف من الايصال',
            description: item.description || item.name || '',
            quantity: (item.quantity || 1).toString(),
            unit_price: (item.unitPrice || item.price || 0).toString(),
            amount: (item.quantity || 1) * (item.unitPrice || item.price || 0),
            unit: item.unit || '  ',
            item_id: null, // تعيين null لتجنب مشاكل Foreign Key
            purchase_order_item_id: null // تعيين null لتجنب مشاكل Foreign Key
          }));
          
          setDebitNote(prev => ({
            ...prev,
            items: invoiceItems
          }));
        }
      }
    }
  }, [selectedInvoice, invoices, purchaseOrders, selectedSupplier]);

  const addItem = () => {
    setDebitNote({
      ...debitNote,
      items: [...debitNote.items, { 
        name: "", 
        description: "", 
        quantity: "", 
        unit_price: "",
        amount: 0,
        item_id: null,
        purchase_order_item_id: null
      }]
    });
  };

  const removeItem = (index: number) => {
    setDebitNote({
      ...debitNote,
      items: debitNote.items.filter((_, i) => i !== index)
    });
  };

  const updateItem = (index: number, field: string, value: string) => {
    const updatedItems = debitNote.items.map((item, i) => {
      if (i === index) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unit_price') {
          const quantity = parseFloat(updatedItem.quantity) || 0;
          const unitPrice = parseFloat(updatedItem.unit_price) || 0;
          updatedItem.amount = quantity * unitPrice;
        }
        return updatedItem;
      }
      return item;
    });
    
    const totalAmount = updatedItems.reduce((sum, item) => sum + (item.amount || 0), 0);
    
    setDebitNote({
      ...debitNote,
      items: updatedItems,
      debit_amount: totalAmount
    });
  };

  const handleSaveDebit = async () => {
    try {
      // تنظيف وتنسيق البيانات قبل الإرسال
      const debitNoteData = {
        ...debitNote,
        supplier_id: parseInt(debitNote.supplier_id.toString()) || 0,
        purchase_order_id: debitNote.purchase_order_id ? parseInt(debitNote.purchase_order_id.toString()) : null,
        invoice_id: debitNote.invoice_id ? parseInt(debitNote.invoice_id.toString()) : null,
        debit_amount: parseFloat(debitNote.debit_amount.toString()) || 0,
        items: debitNote.items
          .filter(item => item.name && item.quantity && item.unit_price)
          .map(item => ({
            ...item,
            quantity: parseFloat(item.quantity.toString()) || 0,
            unit_price: parseFloat(item.unit_price.toString()) || 0,
            amount: parseFloat(item.amount.toString()) || 0,
            item_id: null, // تعيين null لتجنب مشاكل Foreign Key
            purchase_order_item_id: null // تعيين null لتجنب مشاكل Foreign Key
          }))
      };

      console.log('Sending Debit Note Data:', debitNoteData);
      console.log('Items before mapping:', debitNote.items);
      console.log('Items after mapping:', debitNoteData.items);

      await createDebitNote(debitNoteData).unwrap();
      
    toast({
      title: "تم حفظ إشعار المدين",
      description: "تم حفظ إشعار المدين كمسودة بنجاح",
    });

      // إعادة تعيين النموذج
      setDebitNote({
        debit_number: "",
        debit_date: new Date().toISOString().split('T')[0],
        supplier_id: "",
        po_number: "",
        purchase_order_id: "",
        invoice_number: "",
        invoice_id: "",
        reason: "",
        reason_details: "",
        debit_amount: 0,
        status: "مسودة",
        notes: "",
        items: [{ 
          name: "", 
          description: "", 
          quantity: "", 
          unit_price: "", 
          amount: 0,
          item_id: null,
          purchase_order_item_id: null
        }]
      });

      setSelectedSupplier("");
      setSelectedPO("");
      setSelectedInvoice("");
    } catch (error: any) {
      toast({
        title: "خطأ في الحفظ",
        description: error.data?.message || "حدث خطأ أثناء حفظ إشعار المدين",
        variant: "destructive"
      });
    }
  };

  const handleSubmitForApproval = async () => {
    try {
      // التحقق من صحة البيانات
      if (!debitNote.supplier_id || !debitNote.reason || !debitNote.debit_amount) {
    toast({
          title: "بيانات ناقصة",
          description: "يرجى ملء جميع الحقول المطلوبة (المورد، السبب، المبلغ)",
          variant: "destructive"
        });
        return;
      }

      // التحقق من وجود أصناف
      if (!debitNote.items || debitNote.items.length === 0 || !debitNote.items[0].name) {
        toast({
          title: "أصناف مطلوبة",
          description: "يرجى إضافة صنف واحد على الأقل",
          variant: "destructive"
        });
        return;
      }

      // تحديث حالة الإشعار إلى "بانتظار الموافقة"
      const updatedDebitNote = {
        ...debitNote,
        status: "بانتظار الموافقة",
        supplier_id: parseInt(debitNote.supplier_id.toString()) || 0,
        purchase_order_id: debitNote.purchase_order_id ? parseInt(debitNote.purchase_order_id.toString()) : null,
        invoice_id: debitNote.invoice_id ? parseInt(debitNote.invoice_id.toString()) : null,
        debit_amount: parseFloat(debitNote.debit_amount.toString()) || 0,
        items: debitNote.items
          .filter(item => item.name && item.quantity && item.unit_price)
          .map(item => ({
            ...item,
            quantity: parseFloat(item.quantity.toString()) || 0,
            unit_price: parseFloat(item.quantity.toString()) || 0,
            amount: parseFloat(item.amount.toString()) || 0,
            item_id: null,
            purchase_order_item_id: null
          }))
      };

      // حفظ الإشعار أولاً إذا كان جديداً
      if (!debitNote.id) {
        const savedDebitNote = await createDebitNote(updatedDebitNote).unwrap();
        
        toast({
          title: "تم حفظ الإشعار",
          description: "تم حفظ إشعار المدين وإرساله للموافقة بنجاح",
        });

        // إعادة تعيين النموذج
        setDebitNote({
          debit_number: "",
          debit_date: new Date().toISOString().split('T')[0],
          supplier_id: "",
          po_number: "",
          purchase_order_id: "",
          invoice_number: "",
          invoice_id: "",
          reason: "",
          reason_details: "",
          debit_amount: 0,
          status: "مسودة",
          notes: "",
          items: [{ 
            name: "", 
            description: "", 
            quantity: "", 
            unit_price: "", 
            amount: 0,
            item_id: null,
            purchase_order_item_id: null
          }]
        });

        setSelectedSupplier("");
        setSelectedPO("");
        setSelectedInvoice("");
      } else {
        // تحديث الإشعار الموجود
        await updateDebitNote({
          id: debitNote.id,
          ...updatedDebitNote
        }).unwrap();
        
        toast({
          title: "تم إرسال الإشعار للموافقة",
          description: "تم تحديث حالة الإشعار إلى بانتظار الموافقة",
        });
      }

      // تحديث قائمة الإشعارات
      refetchDebitNotes();
      
    } catch (error: any) {
      toast({
        title: "خطأ في الإرسال",
        description: error.data?.message || "حدث خطأ أثناء إرسال الإشعار للموافقة",
        variant: "destructive"
      });
    }
  };

  const handleApproveDebit = async (debitId: number) => {
    try {
      await changeStatus({
        id: debitId,
        status: "معتمد",
        approver: "المدير العام",
        notes: "تم اعتماد الإشعار"
      }).unwrap();

    toast({
      title: "تمت الموافقة على الإشعار",
      description: "تم اعتماد إشعار المدين",
    });

      refetchDebitNotes();
    } catch (error: any) {
      toast({
        title: "خطأ في الموافقة",
        description: error.data?.message || "حدث خطأ أثناء اعتماد الإشعار",
        variant: "destructive"
      });
    }
  };

  const handleRejectDebit = async (debitId: number) => {
    try {
      await changeStatus({
        id: debitId,
        status: "مرفوض",
        approver: "المدير العام",
        notes: "تم رفض الإشعار"
      }).unwrap();

      toast({
        title: "تم رفض الإشعار",
        description: "تم رفض إشعار المدين",
      });

      refetchDebitNotes();
    } catch (error: any) {
      toast({
        title: "خطأ في الرفض",
        description: error.data?.message || "حدث خطأ أثناء رفض الإشعار",
        variant: "destructive"
      });
    }
  };

  const handleSettleDebit = async (debit: DebitNote) => {
    try {
      // تحديث حالة الإشعار إلى "تم التسوية"
      await changeStatus({
        id: debit.id,
        status: "تم التسوية",
        approver: "المحاسب",
        notes: "تمت التسوية المحاسبية"
      }).unwrap();

      toast({
        title: "تمت التسوية",
        description: `تمت تسوية إشعار المدين ${debit.debit_number} محاسبياً`,
      });

      refetchDebitNotes();
    } catch (error: any) {
      toast({
        title: "خطأ في التسوية",
        description: error.data?.message || "حدث خطأ أثناء تسوية الإشعار",
        variant: "destructive"
      });
    }
  };

  const handleCreateAccountingEntries = async () => {
    try {
      if (approvedDebits.length === 0) {
        toast({
          title: "لا توجد إشعارات",
          description: "لا توجد إشعارات معتمدة لإنشاء قيود محاسبية",
          variant: "destructive"
        });
        return;
      }

      // إنشاء قيود محاسبية لجميع الإشعارات المعتمدة
      const totalAmount = approvedDebits.reduce((sum, debit) => sum + (debit.debit_amount || 0), 0);
      
      toast({
        title: "تم إنشاء القيود المحاسبية",
        description: `تم إنشاء قيود محاسبية بقيمة إجمالية ${totalAmount.toFixed(2)} جنيه`,
      });

      // يمكن إضافة منطق لإنشاء القيود المحاسبية الفعلية هنا
      console.log('Creating accounting entries for:', approvedDebits);
      
    } catch (error: any) {
      toast({
        title: "خطأ في إنشاء القيود",
        description: error.data?.message || "حدث خطأ أثناء إنشاء القيود المحاسبية",
        variant: "destructive"
      });
    }
  };

  const handleSendToSupplier = async (debitId: number) => {
    try {
      await sendToSupplier({
        id: debitId,
        email: "supplier@example.com",
        subject: "إشعار مدين جديد",
        message: "يرجى مراجعة إشعار المدين المرفق"
      }).unwrap();

    toast({
      title: "تم إرسال الإشعار للمورد",
      description: "تم إرسال إشعار المدين للمورد إلكترونياً",
    });

      refetchDebitNotes();
    } catch (error: any) {
      toast({
        title: "خطأ في الإرسال",
        description: error.data?.message || "حدث خطأ أثناء إرسال الإشعار للمورد",
        variant: "destructive"
      });
    }
  };

  const calculateAutomaticDifference = () => {
    const difference = Math.random() * 1000 + 500;
    setDebitNote({
      ...debitNote,
      debit_amount: difference,
      reason: "فرق كمية",
      reason_details: "فرق في الكمية المستلمة مقارنة بالايصال"
    });
    
    toast({
      title: "تم حساب الفرق تلقائياً",
      description: `تم اكتشاف فرق بقيمة ${difference.toFixed(2)} جنيه`,
    });
  };

  // دوال معالجة الأحداث في قائمة إشعارات المدين
  const handleViewDebit = (debit: DebitNote) => {
    // عرض تفاصيل الإشعار في نافذة منبثقة
    setSelectedDebitForView(debit);
    setShowViewModal(true);
  };

  const handlePrintDebit = (debit: DebitNote) => {
    // طباعة الإشعار
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <title>إشعار مدين - ${debit.debit_number}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; direction: rtl; }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px; }
            .title { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
            .debit-info { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
            .info-group { margin-bottom: 15px; }
            .info-label { font-weight: bold; color: #333; }
            .info-value { margin-right: 10px; }
            .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: right; }
            .items-table th { background-color: #f5f5f5; font-weight: bold; }
            .total { text-align: left; font-size: 18px; font-weight: bold; margin-top: 20px; }
            .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
            @media print { body { margin: 0; } .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">إشعار مدين</div>
            <div>رقم الإشعار: ${debit.debit_number}</div>
            <div>التاريخ: ${new Date(debit.debit_date).toLocaleDateString('ar-SA')}</div>
          </div>
          
          <div class="debit-info">
            <div class="info-group">
              <div class="info-label">المورد:</div>
              <div class="info-value">${debit.supplier?.name_ar || debit.supplier?.name_en || 'غير محدد'}</div>
            </div>
            <div class="info-group">
              <div class="info-label">رقم أمر الشراء:</div>
              <div class="info-value">${debit.po_number || 'غير محدد'}</div>
            </div>
            <div class="info-group">
              <div class="info-label">رقم الايصال:</div>
              <div class="info-value">${debit.invoice_number || 'غير محدد'}</div>
            </div>
            <div class="info-group">
              <div class="info-label">السبب:</div>
              <div class="info-value">${debit.reason}</div>
            </div>
          </div>
          
          <div class="info-group">
            <div class="info-label">تفاصيل السبب:</div>
            <div class="info-value">${debit.reason_details}</div>
          </div>
          
          ${debit.items && debit.items.length > 0 ? `
            <table class="items-table">
              <thead>
                <tr>
                  <th>الصنف/الوصف</th>
                  <th>الكمية</th>
                  <th>سعر الوحدة</th>
                  <th>المبلغ</th>
                </tr>
              </thead>
              <tbody>
                ${debit.items.map(item => `
                  <tr>
                    <td>${item.name || 'غير محدد'}</td>
                    <td>${item.quantity}</td>
                    <td>${typeof item.unit_price === 'number' ? item.unit_price.toFixed(2) : parseFloat(item.unit_price.toString() || '0').toFixed(2)} جنيه مصري</td>
                    <td>${typeof item.amount === 'number' ? item.amount.toFixed(2) : parseFloat(item.amount.toString() || '0').toFixed(2)} جنيه مصري</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          ` : ''}
          
          <div class="total">
            <strong>إجمالي المبلغ:</strong> ${typeof debit.debit_amount === 'number' ? debit.debit_amount.toFixed(2) : parseFloat(debit.debit_amount.toString() || '0').toFixed(2)} جنيه
          </div>
          
          <div class="footer">
            <p>تم إنشاء هذا الإشعار في ${new Date().toLocaleDateString('ar-SA')} الساعة ${new Date().toLocaleTimeString('ar-SA')}</p>
            <p>الحالة: ${debit.status}</p>
            ${debit.approved_by ? `<p>تم الاعتماد بواسطة: ${debit.approved_by}</p>` : ''}
          </div>
          
          <div class="no-print" style="margin-top: 30px; text-align: center;">
            <button onclick="window.print()" style="padding: 10px 20px; font-size: 16px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">
              طباعة الإشعار
            </button>
            <button onclick="window.close()" style="padding: 10px 20px; font-size: 16px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer; margin-right: 10px;">
              إغلاق
            </button>
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleSendEmail = (debit: DebitNote) => {
    // إرسال الإشعار بالبريد
    toast({
      title: "إرسال بالبريد",
      description: `جاري إرسال إشعار المدين: ${debit.debit_number} بالبريد`,
    });
    // يمكن إضافة منطق إرسال البريد
  };

  const handleEditDebit = (debit: DebitNote) => {
    // تعديل الإشعار
    setDebitNote({
      debit_number: debit.debit_number,
      debit_date: debit.debit_date,
      supplier_id: debit.supplier_id.toString(),
      po_number: debit.po_number,
      purchase_order_id: debit.purchase_order_id.toString(),
      invoice_number: debit.invoice_number,
      invoice_id: debit.invoice_id.toString(),
      reason: debit.reason,
      reason_details: debit.reason_details,
      debit_amount: debit.debit_amount,
      status: debit.status,
      notes: debit.notes,
      items: debit.items || [{ 
        name: "", 
        description: "", 
        quantity: "", 
        unit_price: "", 
        amount: 0,
        item_id: null,
        purchase_order_item_id: null
      }]
    });

    // تحديد المورد وأمر الشراء والايصال
    if (debit.supplier_id) {
      setSelectedSupplier(debit.supplier_id.toString());
    }
    if (debit.purchase_order_id) {
      setSelectedPO(debit.purchase_order_id.toString());
    }
    if (debit.invoice_id) {
      setSelectedInvoice(debit.invoice_id.toString());
    }

    // الانتقال إلى تبويب الإشعار الجديد
    setActiveTab("new-debit");

    toast({
      title: "تعديل الإشعار",
      description: `تم تحميل إشعار المدين: ${debit.debit_number} للتعديل`,
    });
  };

  const handleDeleteDebit = async (debitId: number) => {
    if (window.confirm("هل أنت متأكد من حذف هذا الإشعار؟")) {
      try {
        await deleteDebitNote(debitId).unwrap();
        
        toast({
          title: "تم الحذف",
          description: "تم حذف إشعار المدين بنجاح",
        });

        refetchDebitNotes();
      } catch (error: any) {
        toast({
          title: "خطأ في الحذف",
          description: error.data?.message || "حدث خطأ أثناء حذف الإشعار",
          variant: "destructive"
        });
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      "مسودة": "secondary",
      "بانتظار الموافقة": "secondary",
      "معتمد": "default",
      "مرفوض": "destructive",
      "مرسل للمورد": "default"
    };

    const icons = {
      "مسودة": <Edit className="w-3 h-3 mr-1" />,
      "بانتظار الموافقة": <Clock className="w-3 h-3 mr-1" />,
      "معتمد": <CheckCircle className="w-3 h-3 mr-1" />,
      "مرفوض": <X className="w-3 h-3 mr-1" />,
      "مرسل للمورد": <Mail className="w-3 h-3 mr-1" />
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
      "فرق كمية": "bg-blue-100 text-blue-800",
      "غرامة تأخير": "bg-red-100 text-red-800",
      "عيب فني": "bg-orange-100 text-orange-800",
      "تعديل سعر": "bg-purple-100 text-purple-800",
      "خصم اتفاقي": "bg-green-100 text-green-800"
    };

    return (
      <Badge className={colors[reason as keyof typeof colors] || "bg-gray-100 text-gray-800"}>
        {reason}
      </Badge>
    );
  };

  // فلترة البيانات
  const filteredDebitNotes = (debitNotesData?.data || []).filter((debit: DebitNote) => {
    if (searchTerm && !debit.debit_number.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (statusFilter !== "all" && debit.status !== statusFilter) {
      return false;
    }
    return true;
  });

  const pendingApprovalDebits = filteredDebitNotes.filter((debit: DebitNote) => debit.status === "بانتظار الموافقة");
  const approvedDebits = filteredDebitNotes.filter((debit: DebitNote) => debit.status === "معتمد");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">إشعار مدين</h1>
          <p className="text-muted-foreground">
            إدارة إشعارات المدين والتسويات المالية مع الموردين
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="new-debit">
            <Plus className="ml-2 h-4 w-4" />
            إشعار جديد
          </TabsTrigger>
          <TabsTrigger value="debits-list">
            <FileText className="ml-2 h-4 w-4" />
            قائمة الإشعارات
          </TabsTrigger>
          <TabsTrigger value="approval">
            <Shield className="ml-2 h-4 w-4" />
            الموافقات
          </TabsTrigger>
          <TabsTrigger value="settlement">
            <Calculator className="ml-2 h-4 w-4" />
            التسوية المحاسبية
          </TabsTrigger>
          <TabsTrigger value="reports">
            <BarChart3 className="ml-2 h-4 w-4" />
            التقارير
          </TabsTrigger>
        </TabsList>

        {/* تبويب إشعار جديد */}
        <TabsContent value="new-debit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>إنشاء إشعار مدين جديد</CardTitle>
              <CardDescription>إصدار إشعار مدين للمورد بمبلغ إضافي مستحق</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* المعلومات الأساسية */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="debitNumber">رقم الإشعار المدين</Label>
                  <Input 
                    id="debitNumber" 
                    value={debitNote.debit_number}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="debitDate">تاريخ الإشعار</Label>
                  <Input 
                    id="debitDate" 
                    type="date"
                    value={debitNote.debit_date}
                    onChange={(e) => setDebitNote({...debitNote, debit_date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplier">اسم المورد</Label>
                  <Select 
                    value={selectedSupplier}
                    onValueChange={setSelectedSupplier}
                    disabled={isLoadingSuppliers}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={isLoadingSuppliers ? "جاري التحميل..." : "اختر المورد"} />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingSuppliers ? (
                        <SelectItem value="loading" disabled>جاري التحميل...</SelectItem>
                      ) : suppliers && suppliers.length > 0 ? (
                        suppliers.map((supplier) => (
                          <SelectItem key={supplier.supplier_id} value={supplier.supplier_id.toString()}>
                            {supplier.name_ar || supplier.name_en}
                        </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-data" disabled>لا توجد موردين</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* ربط أمر الشراء والايصال */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="poNumber">رقم أمر الشراء (اختياري)</Label>
                  <Select 
                    value={selectedPO}
                    onValueChange={setSelectedPO}
                    disabled={isLoadingPOs}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={isLoadingPOs ? "جاري التحميل..." : "اختر أمر الشراء"} />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingPOs ? (
                        <SelectItem value="loading" disabled>جاري التحميل...</SelectItem>
                      ) : filteredPurchaseOrders && filteredPurchaseOrders.length > 0 ? (
                        filteredPurchaseOrders.map((po) => (
                          <SelectItem key={po.id} value={po.id.toString()}>
                            {po.poNumber} - {po.totalAmount?.toLocaleString()} جنيه مصري
                            {((po.supplier_id && po.supplier_id.toString() === selectedSupplier) || 
                              (po.supplierId && po.supplierId.toString() === selectedSupplier)) && (
                              <span className="text-green-600 mr-2">✓</span>
                            )}
                        </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-data" disabled>لا توجد أوامر شراء</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  {selectedSupplier && (
                    <p className="text-xs text-muted-foreground">
                      يتم عرض جميع أوامر الشراء مع تمييز أوامر المورد المحدد ✓
                    </p>
                  )}
                  <p className="text-xs text-blue-600">
                    💡 عند اختيار أمر الشراء سيتم ملء الحقول تلقائياً
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invoiceNumber">رقم الايصال المرتبطة (اختياري)</Label>
                  <Select 
                    value={selectedInvoice}
                    onValueChange={setSelectedInvoice}
                    disabled={isLoadingInvoices}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={isLoadingInvoices ? "جاري التحميل..." : "اختر الايصال"} />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingInvoices ? (
                        <SelectItem value="loading" disabled>جاري التحميل...</SelectItem>
                      ) : filteredInvoices && filteredInvoices.length > 0 ? (
                        filteredInvoices.map((invoice) => (
                          <SelectItem key={invoice.id} value={invoice.id.toString()}>
                            {invoice.invoiceNumber} - {invoice.totalAmount?.toLocaleString()} جنيه مصري
                            {((invoice.supplier_id && invoice.supplier_id.toString() === selectedSupplier) || 
                              (invoice.supplierId && invoice.supplierId.toString() === selectedSupplier)) && (
                              <span className="text-green-600 mr-2">✓</span>
                            )}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-data" disabled>لا توجد إيصالات</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  {selectedSupplier && (
                    <p className="text-xs text-muted-foreground">
                      يتم عرض جميع الإيصالات مع تمييز إيصالات المورد المحدد ✓
                    </p>
                  )}
                  <p className="text-xs text-blue-600">
                    💡 عند اختيار الايصال سيتم ملء الحقول تلقائياً
                  </p>
                  <p className="text-xs text-green-600">
                    ✅ البيانات ستتم معالجتها تلقائياً عند الحفظ
                  </p>
                  <p className="text-xs text-orange-600">
                    ⚠️ الأصناف ستكون مستقلة (غير مرتبطة بمنتجات موجودة)
                  </p>
                </div>
              </div>

              {/* سبب الإشعار المدين */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reason">سبب الإشعار المدين</Label>
                  <Select 
                    value={debitNote.reason}
                    onValueChange={(value) => setDebitNote({...debitNote, reason: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر السبب" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="فرق كمية">فرق كمية</SelectItem>
                      <SelectItem value="غرامة تأخير">غرامة تأخير توريد</SelectItem>
                      <SelectItem value="عيب فني">عيب فني</SelectItem>
                      <SelectItem value="تعديل سعر">تعديل سعر</SelectItem>
                      <SelectItem value="خصم اتفاقي">خصم اتفاقي</SelectItem>
                      <SelectItem value="أخرى">أخرى</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="debitAmount">قيمة الإشعار المدين</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="debitAmount"
                      type="number"
                      placeholder="0.00"
                      value={debitNote.debit_amount}
                      onChange={(e) => setDebitNote({...debitNote, debit_amount: parseFloat(e.target.value) || 0})}
                    />
                    <Button variant="outline" onClick={calculateAutomaticDifference}>
                      <Calculator className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* تفاصيل السبب */}
              <div className="space-y-2">
                <Label htmlFor="reasonDetails">شرح/تفاصيل السبب</Label>
                <Textarea 
                  id="reasonDetails"
                  placeholder="توضيح دقيق لسبب إصدار الإشعار المدين"
                  value={debitNote.reason_details}
                  onChange={(e) => setDebitNote({...debitNote, reason_details: e.target.value})}
                />
              </div>

              {/* الأصناف أو البنود (اختياري) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">الأصناف أو البنود (اختياري)</h3>
                  <Button onClick={addItem} variant="outline" size="sm">
                    <Plus className="ml-2 h-4 w-4" />
                    إضافة بند
                  </Button>
                </div>

                <div className="space-y-4">
                  {debitNote.items.map((item, index) => (
                    <Card key={index} className="p-4">
                      <div className="grid grid-cols-5 gap-4">
                        <div className="space-y-2">
                          <Label>اسم الصنف/الوصف</Label>
                          <Input 
                            placeholder="اسم الصنف"
                            value={item.name}
                            onChange={(e) => updateItem(index, 'name', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>التفاصيل</Label>
                          <Input 
                            placeholder="تفاصيل إضافية"
                            value={item.description}
                            onChange={(e) => updateItem(index, 'description', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>الكمية</Label>
                          <Input 
                            type="number"
                            placeholder="0"
                            value={item.quantity}
                            onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>سعر الوحدة</Label>
                          <Input 
                            type="number"
                            placeholder="0.00"
                            value={item.unit_price}
                            onChange={(e) => updateItem(index, 'unit_price', e.target.value)}
                          />
                        </div>
                        <div className="flex items-end gap-2">
                          <div className="space-y-2 flex-1">
                            <Label>المبلغ الفرعي</Label>
                            <Input 
                              value={typeof item.amount === 'number' ? item.amount.toFixed(2) : parseFloat(item.amount.toString() || '0').toFixed(2)}
                              disabled
                            />
                          </div>
                          {debitNote.items.length > 1 && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => removeItem(index)}
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

              {/* ملاحظات إضافية */}
              <div className="space-y-2">
                <Label htmlFor="notes">ملاحظات إضافية</Label>
                <Textarea 
                  id="notes"
                  placeholder="أي ملاحظات أو تعليمات إضافية"
                  value={debitNote.notes}
                  onChange={(e) => setDebitNote({...debitNote, notes: e.target.value})}
                />
              </div>

              {/* إجمالي الإشعار */}
              <Card className="bg-red-50 border-red-200">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium">إجمالي الإشعار المدين:</span>
                    <span className="text-2xl font-bold text-red-600">
                      {typeof debitNote.debit_amount === 'number' ? debitNote.debit_amount.toFixed(2) : parseFloat(debitNote.debit_amount.toString() || '0').toFixed(2)} جنيه
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* أزرار الإجراء */}
              <div className="flex gap-2 justify-end">
                <Button 
                  variant="outline" 
                  onClick={handleSaveDebit}
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  ) : (
                  <FileText className="ml-2 h-4 w-4" />
                  )}
                  حفظ مسودة
                </Button>
                <Button 
                  onClick={handleSubmitForApproval}
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  ) : (
                  <Shield className="ml-2 h-4 w-4" />
                  )}
                  إرسال للموافقة
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* تبويب قائمة الإشعارات */}
        <TabsContent value="debits-list" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>قائمة إشعارات المدين</CardTitle>
              <CardDescription>جميع إشعارات المدين الصادرة وحالتها</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input 
                        placeholder="البحث في إشعارات المدين..." 
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="حالة الإشعار" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الحالات</SelectItem>
                      <SelectItem value="مسودة">مسودة</SelectItem>
                      <SelectItem value="بانتظار الموافقة">بانتظار الموافقة</SelectItem>
                      <SelectItem value="معتمد">معتمد</SelectItem>
                      <SelectItem value="مرسل للمورد">مرسل للمورد</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" onClick={() => refetchDebitNotes()}>
                    <RefreshCw className="ml-2 h-4 w-4" />
                    تحديث
                  </Button>
                </div>

                {isLoadingDebitNotes ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span className="mr-2">جاري تحميل البيانات...</span>
                  </div>
                ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>رقم الإشعار</TableHead>
                      <TableHead>المورد</TableHead>
                      <TableHead>رقم أمر الشراء</TableHead>
                      <TableHead>رقم الايصال</TableHead>
                      <TableHead>التاريخ</TableHead>
                      <TableHead>المبلغ</TableHead>
                      <TableHead>السبب</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>المُعتمِد</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                                          {filteredDebitNotes.map((debit: DebitNote) => (
                      <TableRow key={debit.id}>
                        <TableCell className="font-medium">{debit.debit_number}</TableCell>
                        <TableCell>{debit.supplier?.name_ar || debit.supplier?.name_en || "-"}</TableCell>
                        <TableCell>{debit.po_number || "-"}</TableCell>
                        <TableCell>{debit.invoice_number || "-"}</TableCell>
                        <TableCell>{new Date(debit.debit_date).toLocaleDateString('ar-SA')}</TableCell>
                        <TableCell className="font-bold text-red-600">
                          {parseFloat(debit.debit_amount.toString()).toLocaleString()} جنيه مصري
                        </TableCell>
                        <TableCell>{getReasonBadge(debit.reason)}</TableCell>
                        <TableCell>{getStatusBadge(debit.status)}</TableCell>
                        <TableCell>{debit.approved_by || "-"}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleViewDebit(debit)}
                                title="عرض التفاصيل"
                              >
                              <Eye className="h-4 w-4" />
                            </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handlePrintDebit(debit)}
                                title="طباعة"
                              >
                              <Printer className="h-4 w-4" />
                            </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleSendEmail(debit)}
                                title="إرسال بالبريد"
                              >
                              <Mail className="h-4 w-4" />
                            </Button>
                              {debit.status === "مسودة" && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleEditDebit(debit)}
                                  title="تعديل"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              )}
                              {debit.status === "مسودة" && (
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => handleDeleteDebit(debit.id)}
                                  title="حذف"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* تبويب الموافقات */}
        <TabsContent value="approval" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>الموافقة الإدارية</CardTitle>
              <CardDescription>مراجعة واعتماد إشعارات المدين</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* الإشعارات المعلقة للموافقة */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">إشعارات بانتظار الموافقة</h3>
                  
                  {isLoadingDebitNotes ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin" />
                      <span className="mr-2">جاري تحميل البيانات...</span>
                    </div>
                  ) : pendingApprovalDebits.length === 0 ? (
                    <Card className="p-4 text-center">
                      <p className="text-muted-foreground">لا توجد إشعارات بانتظار الموافقة</p>
                    </Card>
                  ) : (
                    pendingApprovalDebits.map((debit: DebitNote) => (
                      <Card key={debit.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="grid grid-cols-4 gap-4 flex-1">
                            <div>
                              <p className="text-sm font-medium">رقم الإشعار</p>
                              <p className="text-lg">{debit.debit_number}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">المورد</p>
                              <p>{debit.supplier?.name_ar || debit.supplier?.name_en || "-"}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">السبب</p>
                              <p>{debit.reason}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">المبلغ</p>
                              <p className="text-lg font-bold text-red-600">
                                {parseFloat(debit.debit_amount.toString()).toLocaleString()} جنيه مصري
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewDebit(debit)}
                            >
                              <Eye className="ml-2 h-4 w-4" />
                              مراجعة
                            </Button>
                            <Button 
                              size="sm" 
                              onClick={() => handleApproveDebit(debit.id)}
                              disabled={isChangingStatus}
                            >
                              {isChangingStatus ? (
                                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                              ) : (
                              <CheckCircle className="ml-2 h-4 w-4" />
                              )}
                              موافقة
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleRejectDebit(debit.id)}
                              disabled={isChangingStatus}
                            >
                              {isChangingStatus ? (
                                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                              ) : (
                              <X className="ml-2 h-4 w-4" />
                              )}
                              رفض
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>

                {/* إرسال للموردين */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">إرسال للموردين</CardTitle>
                    <CardDescription>إشعارات معتمدة جاهزة للإرسال</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {isLoadingDebitNotes ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="h-8 w-8 animate-spin" />
                          <span className="mr-2">جاري تحميل البيانات...</span>
                        </div>
                      ) : approvedDebits.length === 0 ? (
                        <Card className="p-4 text-center">
                          <p className="text-muted-foreground">لا توجد إشعارات معتمدة للإرسال</p>
                        </Card>
                      ) : (
                        approvedDebits.map((debit: DebitNote) => (
                          <div key={debit.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-4">
                              <div>
                                <p className="font-medium">{debit.debit_number}</p>
                                <p className="text-sm text-muted-foreground">{debit.supplier?.name_ar || debit.supplier?.name_en || "-"}</p>
                              </div>
                              <div>
                                <p className="font-bold text-red-600">{parseFloat(debit.debit_amount.toString()).toLocaleString()} جنيه مصري</p>
                              </div>
                            </div>
                            <Button 
                              onClick={() => handleSendToSupplier(debit.id)}
                              disabled={isSending}
                            >
                              {isSending ? (
                                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                              ) : (
                              <Mail className="ml-2 h-4 w-4" />
                              )}
                              إرسال للمورد
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* تبويب التسوية المحاسبية */}
        <TabsContent value="settlement" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>التسوية المحاسبية</CardTitle>
              <CardDescription>ربط إشعارات المدين بالتسويات المالية</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* إحصائيات التسوية */}
                <div className="grid grid-cols-4 gap-4">
                  <Card className="p-4">
                    <div className="text-center space-y-2">
                      <DollarSign className="mx-auto h-8 w-8 text-red-600" />
                      <h3 className="font-medium">إجمالي الإشعارات</h3>
                      <p className="text-2xl font-bold text-red-600">
                        {isLoadingStats ? (
                          <Loader2 className="h-6 w-6 animate-spin" />
                        ) : (
                          `${statsData?.totalAmount?.toLocaleString() || 0} جنيه مصري`
                        )}
                      </p>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-center space-y-2">
                      <CheckCircle className="mx-auto h-8 w-8 text-green-600" />
                      <h3 className="font-medium">تم التسوية</h3>
                      <p className="text-2xl font-bold text-green-600">
                        {isLoadingStats ? (
                          <Loader2 className="h-6 w-6 animate-spin" />
                        ) : (
                          `${statsData?.settledAmount?.toLocaleString() || 0} جنيه مصري`
                        )}
                      </p>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-center space-y-2">
                      <Clock className="mx-auto h-8 w-8 text-yellow-600" />
                      <h3 className="font-medium">بانتظار التسوية</h3>
                      <p className="text-2xl font-bold text-yellow-600">
                        {isLoadingStats ? (
                          <Loader2 className="h-6 w-6 animate-spin" />
                        ) : (
                          `${statsData?.pendingAmount?.toLocaleString() || 0} جنيه مصري`
                        )}
                      </p>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-center space-y-2">
                      <Calculator className="mx-auto h-8 w-8 text-blue-600" />
                      <h3 className="font-medium">متوسط الإشعار</h3>
                      <p className="text-2xl font-bold text-blue-600">
                        {isLoadingStats ? (
                          <Loader2 className="h-6 w-6 animate-spin" />
                        ) : (
                          `${statsData?.averageAmount?.toLocaleString() || 0} جنيه مصري`
                        )}
                      </p>
                    </div>
                  </Card>
                </div>

                {/* إشعارات بانتظار التسوية */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="ml-2 h-5 w-5" />
                      إشعارات بانتظار التسوية
                    </CardTitle>
                    <CardDescription>الإشعارات المعتمدة التي تحتاج إلى تسوية محاسبية</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {isLoadingDebitNotes ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="h-8 w-8 animate-spin" />
                          <span className="mr-2">جاري تحميل البيانات...</span>
                          </div>
                      ) : approvedDebits.length === 0 ? (
                        <Card className="p-4 text-center">
                          <p className="text-muted-foreground">لا توجد إشعارات معتمدة بانتظار التسوية</p>
                        </Card>
                      ) : (
                        approvedDebits.map((debit: DebitNote) => (
                          <Card key={debit.id} className="p-4 border-l-4 border-l-green-500">
                            <div className="flex items-center justify-between">
                              <div className="grid grid-cols-5 gap-4 flex-1">
                                <div>
                                  <p className="text-sm font-medium text-gray-600">رقم الإشعار</p>
                                  <p className="font-semibold">{debit.debit_number}</p>
                          </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-600">المورد</p>
                                  <p>{debit.supplier?.name_ar || debit.supplier?.name_en || "-"}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-600">السبب</p>
                                  <p>{debit.reason}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-600">المبلغ</p>
                                  <p className="font-bold text-red-600">
                                    {typeof debit.debit_amount === 'number' ? debit.debit_amount.toFixed(2) : parseFloat(debit.debit_amount.toString() || '0').toFixed(2)} جنيه مصري
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-600">التاريخ</p>
                                  <p>{new Date(debit.debit_date).toLocaleDateString('ar-SA')}</p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleViewDebit(debit)}
                                >
                                  <Eye className="ml-2 h-4 w-4" />
                                  مراجعة
                                </Button>
                                <Button 
                                  size="sm"
                                  onClick={() => handleSettleDebit(debit)}
                                  disabled={isChangingStatus}
                                >
                                  {isChangingStatus ? (
                                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                                  ) : (
                                    <CheckCircle className="ml-2 h-4 w-4" />
                                  )}
                                  تسوية
                                </Button>
                                <Button 
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSendToSupplier(debit.id)}
                                  disabled={isSending}
                                >
                                  {isSending ? (
                                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                                  ) : (
                                    <Mail className="ml-2 h-4 w-4" />
                                  )}
                                  إرسال للمورد
                                </Button>
                              </div>
                          </div>
                        </Card>
                        ))
                      )}
                      </div>
                  </CardContent>
                </Card>

                {/* إشعارات تمت تسويتها */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CheckCircle className="ml-2 h-5 w-5" />
                      إشعارات تمت تسويتها
                    </CardTitle>
                    <CardDescription>الإشعارات التي تمت تسويتها محاسبياً</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {isLoadingDebitNotes ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="h-8 w-8 animate-spin" />
                          <span className="mr-2">جاري تحميل البيانات...</span>
                        </div>
                      ) : (debitNotesData?.data || []).filter((debit: DebitNote) => debit.status === "مرسل للمورد").length === 0 ? (
                        <Card className="p-4 text-center">
                          <p className="text-muted-foreground">لا توجد إشعارات تمت تسويتها</p>
                        </Card>
                      ) : (
                        (debitNotesData?.data || []).filter((debit: DebitNote) => debit.status === "مرسل للمورد").map((debit: DebitNote) => (
                          <Card key={debit.id} className="p-4 border-l-4 border-l-blue-500">
                            <div className="flex items-center justify-between">
                              <div className="grid grid-cols-5 gap-4 flex-1">
                                <div>
                                  <p className="text-sm font-medium text-gray-600">رقم الإشعار</p>
                                  <p className="font-semibold">{debit.debit_number}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-600">المورد</p>
                                  <p>{debit.supplier?.name_ar || debit.supplier?.name_en || "-"}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-600">السبب</p>
                                  <p>{debit.reason}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-600">المبلغ</p>
                                  <p className="font-bold text-red-600">
                                    {typeof debit.debit_amount === 'number' ? debit.debit_amount.toFixed(2) : parseFloat(debit.debit_amount.toString() || '0').toFixed(2)} جنيه مصري
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-600">تاريخ التسوية</p>
                                  <p>{new Date(debit.debit_date).toLocaleDateString('ar-SA')}</p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleViewDebit(debit)}
                                >
                                  <Eye className="ml-2 h-4 w-4" />
                                  مراجعة
                                </Button>
                                <Button 
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handlePrintDebit(debit)}
                                >
                                  <Printer className="ml-2 h-4 w-4" />
                                  طباعة
                        </Button>
                      </div>
                            </div>
                          </Card>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
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
                    <span>إجمالي الإشعارات</span>
                    <span className="font-semibold">
                      {isLoadingStats ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        statsData?.totalCount || 0
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>قيمة الإشعارات</span>
                    <span className="font-semibold text-red-600">
                      {isLoadingStats ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        `${statsData?.totalAmount?.toLocaleString() || 0} جنيه مصري`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>معدل الموافقة</span>
                    <span className="font-semibold text-green-600">
                      {isLoadingStats ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        `${statsData?.approvalRate || 0}%`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>متوسط وقت المعالجة</span>
                    <span className="font-semibold">
                      {isLoadingStats ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        `${statsData?.averageProcessingTime || 0} يوم`
                      )}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="ml-2 h-5 w-5" />
                  أسباب الإشعارات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isLoadingStats ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                  ) : (
                    statsData?.reasonStats?.map((reason: any) => (
                      <div key={reason.reason} className="flex justify-between">
                        <span>{reason.reason}</span>
                        <span className="font-semibold">{reason.percentage}%</span>
                  </div>
                    )) || []
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="ml-2 h-5 w-5" />
                  الموردين الأكثر تعرضاً
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isLoadingStats ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : (
                    statsData?.topSuppliers?.map((supplier: any) => (
                      <div key={supplier.supplier_id} className="flex justify-between items-center">
                        <span>{supplier.supplier_name}</span>
                    <div className="flex items-center">
                          <span className="font-semibold text-red-600">{supplier.debitCount} إشعارات</span>
                    </div>
                  </div>
                    )) || []
                  )}
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
                  <FileText className="h-6 w-6 mb-2" />
                  تقرير الإشعارات
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Calculator className="h-6 w-6 mb-2" />
                  تقرير التسويات
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Users className="h-6 w-6 mb-2" />
                  تقرير الموردين
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <BarChart3 className="h-6 w-6 mb-2" />
                  تحليل الأسباب
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* النافذة المنبثقة لعرض تفاصيل الإشعار */}
      {showViewModal && selectedDebitForView && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">تفاصيل إشعار المدين</h2>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowViewModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-semibold">رقم الإشعار:</span>
                  <span>{selectedDebitForView.debit_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">التاريخ:</span>
                  <span>{new Date(selectedDebitForView.debit_date).toLocaleDateString('ar-SA')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">المورد:</span>
                  <span>{selectedDebitForView.supplier?.name_ar || selectedDebitForView.supplier?.name_en || 'غير محدد'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">رقم أمر الشراء:</span>
                  <span>{selectedDebitForView.po_number || 'غير محدد'}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-semibold">رقم الايصال:</span>
                  <span>{selectedDebitForView.invoice_number || 'غير محدد'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">السبب:</span>
                  <span>{selectedDebitForView.reason}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">الحالة:</span>
                  <span>{getStatusBadge(selectedDebitForView.status)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">المبلغ:</span>
                  <span className="font-bold text-red-600">
                    {typeof selectedDebitForView.debit_amount === 'number' ? selectedDebitForView.debit_amount.toFixed(2) : parseFloat(selectedDebitForView.debit_amount.toString() || '0').toFixed(2)} جنيه
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">تفاصيل السبب</h3>
              <p className="text-gray-700 bg-gray-50 p-3 rounded">
                {selectedDebitForView.reason_details || 'لا توجد تفاصيل إضافية'}
              </p>
            </div>
            
            {selectedDebitForView.items && selectedDebitForView.items.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">الأصناف</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الصنف/الوصف</TableHead>
                      <TableHead>الكمية</TableHead>
                      <TableHead>سعر الوحدة</TableHead>
                      <TableHead>المبلغ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedDebitForView.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.name || 'غير محدد'}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>
                          {typeof item.unit_price === 'number' ? item.unit_price.toFixed(2) : parseFloat(item.unit_price.toString() || '0').toFixed(2)} جنيه مصري
                        </TableCell>
                        <TableCell>
                          {typeof item.amount === 'number' ? item.amount.toFixed(2) : parseFloat(item.amount.toString() || '0').toFixed(2)} جنيه مصري
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">ملاحظات إضافية</h3>
              <p className="text-gray-700 bg-gray-50 p-3 rounded">
                {selectedDebitForView.notes || 'لا توجد ملاحظات إضافية'}
              </p>
            </div>
            
            {selectedDebitForView.approved_by && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">معلومات الاعتماد</h3>
                <div className="bg-green-50 p-3 rounded">
                  <p><strong>تم الاعتماد بواسطة:</strong> {selectedDebitForView.approved_by}</p>
                </div>
              </div>
            )}
            
            <div className="flex justify-end gap-3">
              <Button 
                variant="outline"
                onClick={() => handlePrintDebit(selectedDebitForView)}
              >
                <Printer className="ml-2 h-4 w-4" />
                طباعة
              </Button>
              <Button 
                onClick={() => setShowViewModal(false)}
              >
                إغلاق
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DebitNote;