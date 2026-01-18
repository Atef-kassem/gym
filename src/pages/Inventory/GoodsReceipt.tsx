import { useEffect, useState } from "react";
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
  Package, Search, Calendar, Users, DollarSign, CheckCircle, Clock, 
  AlertCircle, Upload, Download, Edit, Eye, Truck, MapPin, Camera,
  FileText, User, Signature, AlertTriangle, ShieldCheck, TrendingUp,
  BarChart3, Bell, Star, Filter, Printer, RefreshCw, X, Check, Save
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useListPurchaseOrdersQuery, useUpdatePurchaseOrderMutation } from "@/services/purchaseOrdersApi";
import { useListGoodsReceiptsQuery, useCreateGoodsReceiptMutation, useUpdateGoodsReceiptMutation } from "@/services/goodsReceiptApi";
import { useGetUsersQuery } from "@/services/userApi";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const GoodsReceipt = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("tracking");
  const [goodsReceipt, setGoodsReceipt] = useState({
    grnNumber: "GRN-2024-001",
    poNumber: "",
    receiverName: "",
    receiptDate: new Date().toISOString().split('T')[0],
    receiptTime: new Date().toTimeString().slice(0, 5),
    notes: "",
    status: "مكتمل",
    signature: "",
    items: [
      { id: 1, name: "", orderedQty: "", receivedQty: "", unit: "", condition: "", notes: "", rejected: false }
    ],
    rejectedItems: [],
    attachments: []
  });

  const { data: poList, refetch: refetchPOs } = useListPurchaseOrdersQuery({});
  const { data: usersData } = useGetUsersQuery({ page: 1, limit: 1000 });
  
  // جلب المستخدمين الحقيقيين
  const users = usersData?.users || [];
  
  const purchaseOrders = (poList || []).map((po: any) => ({
    id: String(po.id),
    poNumber: po.poNumber,
    supplier: po.supplier?.name_ar || po.supplier?.name_en || po.supplier?.company_name || "",
    date: (po.createdDate || '').toString(),
    expectedDelivery: (po.expectedDeliveryDate || '').toString(),
    actualDelivery: po.receivedDate || null,
    status: po.status === 'confirmed' ? 'مؤكد' : 
            po.status === 'in_progress' ? 'قيد التنفيذ' : 
            po.status === 'completed' ? 'تم التسليم' : 
            po.status === 'sent' ? 'مرسل' : 
            po.status === 'cancelled' ? 'ملغي' : 
            po.status === 'received' ? 'تم الاستلام' :
            po.status === 'in_receipt' ? 'قيد الاستلام' :
            'مسودة',
    trackingStatus: po.status === 'received' ? '✅ تم الاستلام' : 
                   po.status === 'in_receipt' ? '📦 قيد الاستلام' : '—',
    total: Number(po.totalAmount || 0),
    items: (po.items || []).map((it: any) => ({ 
      id: it.id,
      name: it.name, 
      orderedQty: it.quantity, 
      receivedQty: it.receivedQty || 0, // استخدام الكمية المستلمة الفعلية
      unit: it.unit 
    })),
    location: '',
    delay: 0,
    receivedDate: po.receivedDate,
    receivedBy: po.receivedBy,
    receiptNotes: po.receiptNotes
  }));

  const { data: grnList, refetch: refetchGRNs } = useListGoodsReceiptsQuery({});
  const [updateGoodsReceipt] = useUpdateGoodsReceiptMutation();
  const [updatePurchaseOrder] = useUpdatePurchaseOrderMutation();
  type GoodsReceiptRow = { id: number; grnNumber: string; poNumber: string; supplier: string; receiver: string; date: string; time: string; status: string; totalItems: number; rejectedItems: number; condition: string };
  const goodsReceiptList: GoodsReceiptRow[] = (grnList || []).map((g: any) => ({
    id: g.id,
    grnNumber: g.grnNumber,
    poNumber: g.purchaseOrder?.poNumber || String(g.purchaseOrderId),
    supplier: g.purchaseOrder?.supplier?.name_ar || g.purchaseOrder?.supplier?.name_en || '',
    receiver: g.receiverName,
    date: (g.receiptDate || '').toString(),
    time: g.receiptTime || '',
    status: g.status === 'completed' ? 'مكتمل' : g.status === 'partial' ? 'جزئي' : g.status === 'rejected' ? 'مرفوض' : 'مسودة',
    totalItems: (g.items || []).length,
    rejectedItems: (g.items || []).filter((it: any) => it.rejected).length,
    condition: '—',
  }));

  // Dialog state for viewing/editing a goods receipt
  const [viewOpen, setViewOpen] = useState(false);
  const [viewId, setViewId] = useState<number | null>(null);
  const selectedView = Array.isArray(grnList) ? grnList.find((g: any) => g.id === viewId) : null;
  const [viewForm, setViewForm] = useState<any | null>(null);
  
  // Dialog state for quality inspection
  const [qualityInspectionOpen, setQualityInspectionOpen] = useState(false);
  const [qualityInspectionItem, setQualityInspectionItem] = useState<any | null>(null);
  const [qualityForm, setQualityForm] = useState({
    condition: '',
    notes: '',
    rejected: false
  });
  
  // Local state for immediate UI updates
  const [localGRNList, setLocalGRNList] = useState<any[]>([]);
  const [localPurchaseOrders, setLocalPurchaseOrders] = useState<any[]>([]);

  useEffect(() => {
    if (viewOpen && selectedView) {
      setViewForm({
        receiverName: selectedView.receiverName || "",
        receiptDate: selectedView.receiptDate || "",
        receiptTime: selectedView.receiptTime || "",
        status: selectedView.status || "مسودة",
        notes: selectedView.notes || "",
        items: (selectedView.items || []).map((it: any) => ({
          id: it.id,
          name: it.name || "",
          orderedQty: it.orderedQty || 0,
          receivedQty: it.receivedQty || 0,
          unit: it.unit || "",
          condition: it.condition || "",
          notes: it.notes || "",
          rejected: Boolean(it.rejected),
        })),
      });
    }
  }, [viewOpen, viewId, selectedView]);
  
  // تحديث نموذج فحص الجودة عند فتح النافذة
  useEffect(() => {
    if (qualityInspectionOpen && qualityInspectionItem) {
      setQualityForm({
        condition: qualityInspectionItem.item.condition || '',
        notes: qualityInspectionItem.item.notes || '',
        rejected: Boolean(qualityInspectionItem.item.rejected)
      });
    }
  }, [qualityInspectionOpen, qualityInspectionItem]);
  
  // تحديث القائمة المحلية عند تغيير grnList
  useEffect(() => {
    if (grnList) {
      setLocalGRNList(Array.isArray(grnList) ? grnList : []);
    }
  }, [grnList]);
  
  // تحديث قائمة أوامر الشراء المحلية
  useEffect(() => {
    if (purchaseOrders) {
      setLocalPurchaseOrders([...purchaseOrders]);
    }
  }, [purchaseOrders]);

  const addItem = () => {
    setGoodsReceipt({
      ...goodsReceipt,
      items: [...goodsReceipt.items, { 
        id: Date.now(), 
        name: "", 
        orderedQty: "", 
        receivedQty: "", 
        unit: "",
        condition: "",
        notes: "",
        rejected: false
      }]
    });
  };

  const removeItem = (id: number) => {
    setGoodsReceipt({
      ...goodsReceipt,
      items: goodsReceipt.items.filter(item => item.id !== id)
    });
  };

  const updateItem = (id: number, field: string, value: string | boolean) => {
    setGoodsReceipt({
      ...goodsReceipt,
      items: goodsReceipt.items.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    });
  };

  const [createGoodsReceipt] = useCreateGoodsReceiptMutation();
  const handleSaveReceipt = async () => {
    if (!goodsReceipt.poNumber) {
      toast({ title: 'بيانات ناقصة', description: 'اختر أمر الشراء', variant: 'destructive' });
      return;
    }
    const poIdNum = Number(goodsReceipt.poNumber);
    if (!poIdNum || Number.isNaN(poIdNum)) {
      toast({ title: 'رقم أمر شراء غير صالح', description: 'اختر أمر شراء صحيح', variant: 'destructive' });
      return;
    }
    const ts = new Date();
    const grnNumber = `GRN-${ts.getFullYear()}${String(ts.getMonth()+1).padStart(2,'0')}${String(ts.getDate()).padStart(2,'0')}-${String(ts.getHours()).padStart(2,'0')}${String(ts.getMinutes()).padStart(2,'0')}${String(ts.getSeconds()).padStart(2,'0')}`;
    try {
      const payload: any = {
        grnNumber,
        purchaseOrderId: poIdNum,
        receiverName: goodsReceipt.receiverName || 'المستلم',
        receiptDate: goodsReceipt.receiptDate,
        receiptTime: goodsReceipt.receiptTime,
        notes: goodsReceipt.notes || null,
        status: 'draft',
        signature: goodsReceipt.signature || null,
        items: goodsReceipt.items.filter((it: any) => (it.name||'').trim() !== '').map((it: any) => ({
          name: it.name,
          orderedQty: it.orderedQty || 0,
          receivedQty: it.receivedQty || 0,
          unit: it.unit || '',
          condition: it.condition || '',
          notes: it.notes || '',
          rejected: Boolean(it.rejected),
        })),
      };
      await createGoodsReceipt(payload).unwrap();
      
      // تحديث حالة أمر الشراء إلى "قيد الاستلام" عند حفظ المسودة
      try {
        await updatePurchaseOrder({
          id: poIdNum,
          body: {
            status: 'in_receipt', // حالة جديدة: قيد الاستلام
            receiptInProgress: true,
            lastReceiptDate: goodsReceipt.receiptDate
          }
        }).unwrap();
        
        toast({ 
          title: '📝 تم الحفظ', 
          description: `تم إنشاء سند الاستلام ${grnNumber} وتحديث حالة أمر الشراء` 
        });
      } catch (updateError: any) {
        console.error('خطأ في تحديث أمر الشراء:', updateError);
        toast({ 
          title: '📝 تم الحفظ', 
          description: `تم إنشاء سند الاستلام ${grnNumber}` 
        });
      }
      
      await refetchGRNs();
      await refetchPOs(); // تحديث قائمة أوامر الشراء
      setActiveTab('history');
    } catch (e: any) {
      toast({ title: '❌ خطأ', description: e?.data?.message || 'تعذر الحفظ', variant: 'destructive' });
    }
  };

  const handleQualityInspectionSave = async () => {
    if (!qualityInspectionItem) return;
    
    try {
      const { receiptId, itemIndex, receipt } = qualityInspectionItem;
      
      // تحديث الصنف المحدد
      const updatedItems = receipt.items.map((it: any, idx: number) => 
        idx === itemIndex ? { 
          ...it, 
          condition: qualityForm.condition,
          notes: qualityForm.notes,
          rejected: qualityForm.rejected
        } : it
      );
      
      // تحديث سند الاستلام
      const result = await updateGoodsReceipt({
        id: receiptId,
        body: { items: updatedItems }
      }).unwrap();
      
      console.log('نتيجة حفظ فحص الجودة:', result);
      
      toast({ 
        title: '✅ تم حفظ نتائج الفحص', 
        description: `تم تحديث حالة الصنف ${qualityInspectionItem.item.name}` 
      });
      
      // تحديث البيانات المحلية فوراً
      setLocalGRNList(prev => prev.map((g: any) => 
        g.id === receiptId ? { ...g, items: updatedItems } : g
      ));
      
      // تحديث من الخادم
      await refetchGRNs();
      await refetchPOs();
      
      setQualityInspectionOpen(false);
      setQualityInspectionItem(null);
      setQualityForm({ condition: '', notes: '', rejected: false });
      
    } catch (error: any) {
      toast({ 
        title: '❌ خطأ', 
        description: error?.data?.message || 'فشل حفظ نتائج الفحص', 
        variant: 'destructive' 
      });
    }
  };

  const handleCompleteReceipt = async () => {
    if (!goodsReceipt.poNumber) {
      toast({ title: 'بيانات ناقصة', description: 'اختر أمر الشراء', variant: 'destructive' });
      return;
    }
    const poIdNum = Number(goodsReceipt.poNumber);
    if (!poIdNum || Number.isNaN(poIdNum)) {
      toast({ title: 'رقم أمر شراء غير صالح', description: 'اختر أمر شراء صحيح', variant: 'destructive' });
      return;
    }
    const ts = new Date();
    const grnNumber = `GRN-${ts.getFullYear()}${String(ts.getMonth()+1).padStart(2,'0')}${String(ts.getDate()).padStart(2,'0')}-${String(ts.getHours()).padStart(2,'0')}${String(ts.getMinutes()).padStart(2,'0')}${String(ts.getSeconds()).padStart(2,'0')}`;
    try {
      const payload: any = {
        grnNumber,
        purchaseOrderId: poIdNum,
        receiverName: goodsReceipt.receiverName || 'المستلم',
        receiptDate: goodsReceipt.receiptDate,
        receiptTime: goodsReceipt.receiptTime,
        notes: goodsReceipt.notes || null,
        status: 'completed',
        signature: goodsReceipt.signature || null,
        items: goodsReceipt.items.filter((it: any) => (it.name||'').trim() !== '').map((it: any) => ({
          name: it.name,
          orderedQty: it.orderedQty || 0,
          receivedQty: it.receivedQty || 0,
          unit: it.unit || '',
          condition: it.condition || '',
          notes: it.notes || '',
          rejected: Boolean(it.rejected),
        })),
      };
      await createGoodsReceipt(payload).unwrap();
      
      // تحديث حالة أمر الشراء والكميات المستلمة تلقائياً
      try {
        const selectedPO = purchaseOrders.find((po: any) => po.id === goodsReceipt.poNumber);
        if (selectedPO) {
          // تحديث الكميات المستلمة بناءً على الكميات المعتمدة
          const updatedItems = selectedPO.items.map((poItem: any) => {
            const grnItem = goodsReceipt.items.find((grnIt: any) => grnIt.name === poItem.name);
            if (grnItem) {
              return {
                ...poItem,
                receivedQty: Number(grnItem.receivedQty) || 0
              };
            }
            return poItem;
          });
          
          // تحديث أمر الشراء - تغيير الحالة إلى "تم الاستلام" وتحديث الكميات
          await updatePurchaseOrder({
            id: poIdNum,
            body: {
              status: 'received', // تغيير الحالة إلى "تم الاستلام"
              items: updatedItems,
              // إضافة معلومات الاستلام
              receivedDate: goodsReceipt.receiptDate,
              receivedBy: goodsReceipt.receiverName,
              receiptNotes: goodsReceipt.notes
            }
          }).unwrap();
          
          toast({ 
            title: '✅ تم تحديث أمر الشراء تلقائياً', 
            description: 'تم تغيير الحالة إلى "تم الاستلام" وتحديث الكميات المستلمة' 
          });
        }
      } catch (updateError: any) {
        console.error('خطأ في تحديث أمر الشراء:', updateError);
        toast({ 
          title: '⚠️ تنبيه', 
          description: 'تم إنشاء سند الاستلام ولكن فشل تحديث أمر الشراء. يرجى تحديثه يدوياً.', 
          variant: 'destructive' 
        });
      }
      
      toast({ title: '🎉 اكتمل الاستلام', description: `تم إكمال سند الاستلام ${grnNumber}` });
      await refetchGRNs();
      await refetchPOs(); // تحديث قائمة أوامر الشراء
      setActiveTab('history');
      
      // مسح النموذج بعد الإكمال
      clearForm();
      
      // window.print() يمكن إضافتها إذا رغبت
    } catch (e: any) {
      toast({ title: '❌ خطأ', description: e?.data?.message || 'تعذر الإكمال', variant: 'destructive' });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      "بانتظار شحن": "secondary",
      "قيد النقل": "default",
      "في الطريق": "default", 
      "وصل جزئياً": "default",
      "تم التسليم": "default",
      "مكتمل": "default",
      "متأخر": "destructive"
    };

    const icons = {
      "بانتظار شحن": <Clock className="w-3 h-3 mr-1" />,
      "قيد النقل": <Truck className="w-3 h-3 mr-1" />,
      "في الطريق": <Truck className="w-3 h-3 mr-1" />,
      "وصل جزئياً": <Package className="w-3 h-3 mr-1" />,
      "تم التسليم": <CheckCircle className="w-3 h-3 mr-1" />,
      "مكتمل": <CheckCircle className="w-3 h-3 mr-1" />,
      "متأخر": <AlertTriangle className="w-3 h-3 mr-1" />
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] as "default" | "destructive" | "secondary"}>
        {icons[status as keyof typeof icons]}
        {status}
      </Badge>
    );
  };

  const getConditionBadge = (condition: string) => {
    const colors = {
      "ممتاز": "bg-green-100 text-green-800",
      "جيد": "bg-blue-100 text-blue-800", 
      "مقبول": "bg-yellow-100 text-yellow-800",
      "غير مطابق": "bg-red-100 text-red-800"
    };

    return (
      <Badge className={colors[condition as keyof typeof colors] || "bg-gray-100 text-gray-800"}>
        {condition}
      </Badge>
    );
  };

  // Auto-fill goods receipt when PO is selected
  const handlePOSelection = (poId: string) => {
    const selectedPO = purchaseOrders.find((po: any) => po.id === poId);
    if (selectedPO) {
      // Auto-fill basic information
      setGoodsReceipt(prev => ({
        ...prev,
        poNumber: poId,
        // Auto-fill items from the selected PO
        items: (selectedPO.items || []).map((item: any, index: number) => ({
          id: Date.now() + index,
          name: item.name || "",
          orderedQty: item.orderedQty || item.receivedQty || "0",
          receivedQty: "0", // Start with 0 received
          unit: item.unit || "",
          condition: "",
          notes: "",
          rejected: false
        }))
      }));
    }
  };

  // Clear form when PO changes
  const clearForm = () => {
    setGoodsReceipt({
      grnNumber: "GRN-2024-001",
      poNumber: "",
      receiverName: "",
      receiptDate: new Date().toISOString().split('T')[0],
      receiptTime: new Date().toTimeString().slice(0, 5),
      notes: "",
      status: "مكتمل",
      signature: "",
      items: [
        { id: 1, name: "", orderedQty: "", receivedQty: "", unit: "", condition: "", notes: "", rejected: false }
      ],
      rejectedItems: [],
      attachments: []
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">متابعة واستلام البضائع</h1>
          <p className="text-muted-foreground">
            تتبع الشحنات واستلام البضائع وإدارة سندات الاستلام
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="tracking">
            <Truck className="ml-2 h-4 w-4" />
            تتبع الشحنات
          </TabsTrigger>
          <TabsTrigger value="receipt">
            <Package className="ml-2 h-4 w-4" />
            استلام البضائع
          </TabsTrigger>
          <TabsTrigger value="history">
            <FileText className="ml-2 h-4 w-4" />
            سجل الاستلام
          </TabsTrigger>
          <TabsTrigger value="quality">
            <ShieldCheck className="ml-2 h-4 w-4" />
            مراقبة الجودة
          </TabsTrigger>
          <TabsTrigger value="reports">
            <BarChart3 className="ml-2 h-4 w-4" />
            التقارير
          </TabsTrigger>
        </TabsList>

        {/* تبويب تتبع الشحنات */}
        <TabsContent value="tracking" className="space-y-6">
          {/* إحصائيات سريعة */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">قيد النقل</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {purchaseOrders.filter((po: { status: string }) => po.status === "قيد النقل").length}
                    </p>
                  </div>
                  <Truck className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">تم التسليم</p>
                    <p className="text-2xl font-bold text-green-600">
                      {purchaseOrders.filter((po: { status: string }) => po.status === "تم التسليم").length}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">متأخر</p>
                    <p className="text-2xl font-bold text-red-600">
                      {purchaseOrders.filter((po: { status: string }) => po.status === "متأخر").length}
                    </p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">إجمالي القيم</p>
                    <p className="text-lg font-bold text-green-600">
                      {purchaseOrders.reduce((total: number, po: { total: number }) => total + po.total, 0).toLocaleString()} جنيه مصري
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* التنبيهات الاستباقية */}
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center text-red-800">
                <Bell className="ml-2 h-5 w-5" />
                تنبيهات مهمة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {purchaseOrders
                  .filter((po: { delay: number }) => po.delay > 0)
                  .map((po: { id: string; delay: number; supplier: string; date: string; expectedDelivery: string; actualDelivery: string | null; total: number; items: Array<{ name: string; receivedQty: number; orderedQty: number; unit: string }>; location: string; status: string }) => (
                    <div key={po.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        <div>
                          <p className="font-medium text-red-800">أمر الشراء {po.id} متأخر {po.delay} أيام</p>
                          <p className="text-sm text-red-600">المورد: {po.supplier}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        تواصل مع المورد
                      </Button>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* لوحة تتبع الطلبات */}
          <Card>
            <CardHeader>
              <CardTitle>لوحة تتبع الطلبات</CardTitle>
              <CardDescription>حالة جميع أوامر الشراء والشحنات الحالية</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input 
                        placeholder="البحث في الطلبات..." 
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="حالة الشحنة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الحالات</SelectItem>
                      <SelectItem value="shipping">بانتظار شحن</SelectItem>
                      <SelectItem value="transit">قيد النقل</SelectItem>
                      <SelectItem value="delivered">تم التسليم</SelectItem>
                      <SelectItem value="delayed">متأخر</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    variant="outline"
                    onClick={async () => {
                      try {
                        console.log('تحديث البيانات...');
                        await refetchPOs();
                        await refetchGRNs();
                        toast({ 
                          title: '🔄 تم التحديث', 
                          description: 'تم تحديث جميع البيانات' 
                        });
                      } catch (error: any) {
                        console.error('خطأ في التحديث:', error);
                        toast({ 
                          title: '❌ خطأ', 
                          description: 'فشل تحديث البيانات', 
                          variant: 'destructive' 
                        });
                      }
                    }}
                  >
                    <RefreshCw className="ml-2 h-4 w-4" />
                    تحديث
                  </Button>
                </div>

                <div className="grid gap-4">
                  {localPurchaseOrders.map((po: { id: string; delay: number; supplier: string; date: string; expectedDelivery: string; actualDelivery: string | null; total: number; items: Array<{ id?: string; name: string; receivedQty: number; orderedQty: number; unit: string }>; location: string; status: string; trackingStatus?: string; receivedBy?: string; receiptNotes?: string }) => (
                    <Card key={po.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <Badge variant="outline" className="font-mono">
                                {po.id}
                              </Badge>
                              {getStatusBadge(po.status)}
                              {po.trackingStatus !== '—' && (
                                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                                  {po.trackingStatus}
                                </Badge>
                              )}
                              {po.delay > 0 && (
                                <Badge variant="destructive">
                                  متأخر {po.delay} أيام
                                </Badge>
                              )}
                            </div>
                            
                            <h3 className="text-lg font-semibold mb-2">{po.supplier}</h3>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                              <div>
                                <p className="text-sm text-muted-foreground">تاريخ الطلب</p>
                                <p className="font-medium">{po.date}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">التسليم المتوقع</p>
                                <p className="font-medium">{po.expectedDelivery}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">التسليم الفعلي</p>
                                <p className="font-medium">
                                  {po.actualDelivery ? (
                                    <span className="text-green-600 font-semibold">
                                      ✅ {po.actualDelivery}
                                      {po.receivedBy && (
                                        <span className="block text-xs text-gray-500">
                                          بواسطة: {po.receivedBy}
                                        </span>
                                      )}
                                    </span>
                                  ) : (
                                    "لم يتم بعد"
                                  )}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">القيمة</p>
                                <p className="font-medium text-green-600">{po.total.toLocaleString()} جنيه مصري</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 mb-4">
                              <MapPin className="w-4 h-4 text-blue-600" />
                              <span className="text-sm">{po.location}</span>
                            </div>
                            
                            {/* عرض معلومات الاستلام إذا كانت متاحة */}
                            {po.receiptNotes && (
                              <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                                <div className="flex items-center gap-2 mb-2">
                                  <Package className="w-4 h-4 text-green-600" />
                                  <span className="text-sm font-medium text-green-800">ملاحظات الاستلام:</span>
                                </div>
                                <p className="text-sm text-green-700">{po.receiptNotes}</p>
                              </div>
                            )}

                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                              <p className="text-sm font-medium">الأصناف:</p>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={async () => {
                                    try {
                                      console.log('حفظ التغييرات لأمر الشراء:', po.id);
                                      console.log('الأصناف المحدثة:', po.items);
                                      
                                      await updatePurchaseOrder({
                                        id: po.id,
                                        body: { items: po.items }
                                      }).unwrap();
                                      
                                      toast({ 
                                        title: '✅ تم الحفظ', 
                                        description: 'تم حفظ جميع التغييرات في الكميات المستلمة' 
                                      });
                                      
                                      // تحديث القائمة المحلية
                                      setLocalPurchaseOrders(prev => prev.map((p: any) => 
                                        p.id === po.id ? { ...p, items: po.items } : p
                                      ));
                                      
                                      await refetchPOs();
                                    } catch (error: any) {
                                      console.error('خطأ في حفظ التغييرات:', error);
                                      toast({ 
                                        title: '❌ خطأ', 
                                        description: error?.data?.message || 'فشل حفظ التغييرات', 
                                        variant: 'destructive' 
                                      });
                                    }
                                  }}
                                >
                                  <Save className="ml-2 h-4 w-4" />
                                  حفظ التغييرات
                                </Button>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {po.items.map((item: { id: string; name: string; receivedQty: number; orderedQty: number; unit: string }, index: number) => (
                                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                    <span className="text-sm">{item.name}</span>
                                    <div className="flex items-center gap-2">
                                      <Input
                                        type="number"
                                        min="0"
                                        max={item.orderedQty}
                                        value={item.receivedQty || 0}
                                        onChange={async (e) => {
                                          const newValue = Number(e.target.value);
                                          console.log('تحديث الكمية المستلمة:', item.name, 'من', item.receivedQty, 'إلى', newValue);
                                          
                                          // تحديث القائمة المحلية فوراً
                                          setLocalPurchaseOrders(prev => prev.map((p: any) => {
                                            if (p.id === po.id) {
                                              const updatedItems = p.items.map((it: any, idx: number) => 
                                                idx === index ? { ...it, receivedQty: newValue } : it
                                              );
                                              return { ...p, items: updatedItems };
                                            }
                                            return p;
                                          }));
                                          
                                          // تحديث API في الخلفية
                                          try {
                                            await updatePurchaseOrder({
                                              id: po.id,
                                              body: { 
                                                items: po.items.map((it: any, idx: number) => 
                                                  idx === index ? { ...it, receivedQty: newValue } : it
                                                )
                                              }
                                            }).unwrap();
                                            
                                            console.log('تم تحديث الكمية في API');
                                          } catch (error: any) {
                                            console.error('خطأ في تحديث الكمية:', error);
                                            toast({ 
                                              title: '⚠️ تنبيه', 
                                              description: 'تم تحديث الكمية محلياً ولكن فشل الحفظ في الخادم', 
                                              variant: 'destructive' 
                                            });
                                          }
                                        }}
                                        className="w-16 h-8 text-xs"
                                        placeholder="0"
                                      />
                                    <span className="text-sm font-medium">
                                        /{item.orderedQty} {item.unit}
                                    </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="ml-2 h-4 w-4" />
                              التفاصيل
                            </Button>
                            
                            {/* تحديث حالة الطلب */}
                            <Select
                              value={po.status}
                              onValueChange={async (newStatus) => {
                                try {
                                  console.log('تحديث حالة الطلب:', po.id, 'من', po.status, 'إلى', newStatus);
                                  
                                  const statusMap: Record<string, string> = {
                                    'مسودة': 'draft',
                                    'مؤكد': 'confirmed',
                                    'قيد التنفيذ': 'in_progress',
                                    'مرسل': 'sent',
                                    'تم التسليم': 'completed',
                                    'قيد الاستلام': 'in_receipt',
                                    'تم الاستلام': 'received',
                                    'ملغي': 'cancelled'
                                  };
                                  
                                  await updatePurchaseOrder({
                                    id: po.id,
                                    body: { status: statusMap[newStatus] || 'draft' }
                                  }).unwrap();
                                  
                                  // تحديث القائمة المحلية فوراً
                                  setLocalPurchaseOrders(prev => prev.map((p: any) => 
                                    p.id === po.id ? { ...p, status: newStatus } : p
                                  ));
                                  
                                  toast({ 
                                    title: '✅ تم التحديث', 
                                    description: `تم تحديث حالة الطلب إلى ${newStatus}` 
                                  });
                                  
                                  await refetchPOs();
                                } catch (error: any) {
                                  console.error('خطأ في تحديث الحالة:', error);
                                  toast({ 
                                    title: '❌ خطأ', 
                                    description: error?.data?.message || 'فشل تحديث الحالة', 
                                    variant: 'destructive' 
                                  });
                                }
                              }}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="مسودة">مسودة</SelectItem>
                                <SelectItem value="مؤكد">مؤكد</SelectItem>
                                <SelectItem value="قيد التنفيذ">قيد التنفيذ</SelectItem>
                                <SelectItem value="مرسل">مرسل</SelectItem>
                                <SelectItem value="تم التسليم">تم التسليم</SelectItem>
                                <SelectItem value="قيد الاستلام">قيد الاستلام</SelectItem>
                                <SelectItem value="تم الاستلام">تم الاستلام</SelectItem>
                                <SelectItem value="ملغي">ملغي</SelectItem>
                              </SelectContent>
                            </Select>
                            
                            {po.status === "تم التسليم" && (
                              <Button size="sm" onClick={() => setActiveTab("receipt")}>
                                <Package className="ml-2 h-4 w-4" />
                                استلام البضائع
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* تبويب استلام البضائع */}
        <TabsContent value="receipt" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>سند استلام البضائع (GRN)</CardTitle>
              <CardDescription>إنشاء سند استلام جديد وتسجيل البضائع المستلمة</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* المعلومات الأساسية */}
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="grnNumber">رقم سند الاستلام</Label>
                  <Input 
                    id="grnNumber" 
                    value={goodsReceipt.grnNumber}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="poNumber">رقم أمر الشراء</Label>
                  <Select 
                    value={goodsReceipt.poNumber}
                    onValueChange={(value) => handlePOSelection(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر أمر الشراء" />
                    </SelectTrigger>
                    <SelectContent>
                      {purchaseOrders.map((po: { id: string; poNumber?: string; supplier: string }) => (
                        <SelectItem key={po.id} value={po.id}>
                          {(po.poNumber || po.id)} - {po.supplier}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Display selected PO details */}
                {goodsReceipt.poNumber && (() => {
                  const selectedPO = purchaseOrders.find((po: any) => po.id === goodsReceipt.poNumber);
                  return selectedPO ? (
                    <div className="col-span-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-blue-800">المورد:</span>
                          <p className="text-blue-700">{selectedPO.supplier}</p>
                        </div>
                        <div>
                          <span className="font-medium text-blue-800">تاريخ الطلب:</span>
                          <p className="text-blue-700">{selectedPO.date}</p>
                        </div>
                        <div>
                          <span className="font-medium text-blue-800">التسليم المتوقع:</span>
                          <p className="text-blue-700">{selectedPO.expectedDelivery}</p>
                        </div>
                        <div>
                          <span className="font-medium text-blue-800">القيمة الإجمالية:</span>
                          <p className="text-blue-700 font-bold">{selectedPO.total.toLocaleString()} جنيه مصري</p>
                        </div>
                      </div>
                      
                      {/* Summary of items */}
                      <div className="mt-4 pt-4 border-t border-blue-200">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-blue-800">ملخص الأصناف:</span>
                          <span className="text-sm text-blue-600">
                            {selectedPO.items?.length || 0} أصناف
                          </span>
                        </div>
                        <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2">
                          {selectedPO.items?.map((item: any, index: number) => (
                            <div key={index} className="text-xs bg-blue-100 p-2 rounded">
                              <span className="font-medium">{item.name}</span>
                              <br />
                              <span className="text-blue-600">
                                {item.orderedQty || item.receivedQty || 0} {item.unit}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : null;
                })()}
                <div className="space-y-2">
                  <Label htmlFor="receiptDate">تاريخ الاستلام</Label>
                  <Input 
                    id="receiptDate" 
                    type="date"
                    value={goodsReceipt.receiptDate}
                    onChange={(e) => setGoodsReceipt({...goodsReceipt, receiptDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="receiptTime">وقت الاستلام</Label>
                  <Input 
                    id="receiptTime" 
                    type="time"
                    value={goodsReceipt.receiptTime}
                    onChange={(e) => setGoodsReceipt({...goodsReceipt, receiptTime: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="receiverName">اسم المستلم</Label>
                <Select 
                  value={goodsReceipt.receiverName}
                  onValueChange={(value) => setGoodsReceipt({...goodsReceipt, receiverName: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المستلم" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user: any) => (
                      <SelectItem key={user.id} value={user.name}>
                        {user.name} - {user.role || 'مستخدم'} - {user.department || 'قسم عام'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* الأصناف المستلمة */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">الأصناف المستلمة</h3>
                    {goodsReceipt.poNumber && (
                      <p className="text-sm text-blue-600 mt-1">
                        تم تحميل الأصناف تلقائياً من أمر الشراء المحدد
                      </p>
                    )}
                  </div>
                  <Button onClick={addItem} variant="outline" size="sm">
                    <Package className="ml-2 h-4 w-4" />
                    إضافة صنف
                  </Button>
                </div>

                <div className="space-y-4">
                  {goodsReceipt.items.map((item, index) => (
                    <Card key={item.id} className="p-4">
                      <div className="grid grid-cols-6 gap-4">
                        <div className="space-y-2">
                          <Label>اسم الصنف</Label>
                          <Input 
                            placeholder="اسم المادة"
                            value={item.name}
                            onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                            className={item.name ? "bg-blue-50 border-blue-200" : ""}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>الكمية المطلوبة</Label>
                          <Input 
                            type="number"
                            placeholder="0"
                            value={item.orderedQty}
                            onChange={(e) => updateItem(item.id, 'orderedQty', e.target.value)}
                            className="bg-gray-50"
                            readOnly
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>الكمية المستلمة</Label>
                          <Input 
                            type="number"
                            placeholder="0"
                            value={item.receivedQty}
                            onChange={(e) => updateItem(item.id, 'receivedQty', e.target.value)}
                            className={item.receivedQty && Number(item.receivedQty) > 0 ? "bg-green-50 border-green-200" : ""}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>الوحدة</Label>
                          <Input 
                            value={item.unit}
                            onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                            className="bg-gray-50"
                            readOnly
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>حالة الجودة</Label>
                          <Select 
                            value={item.condition}
                            onValueChange={(value) => updateItem(item.id, 'condition', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="الحالة" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ممتاز">ممتاز</SelectItem>
                              <SelectItem value="جيد">جيد</SelectItem>
                              <SelectItem value="مقبول">مقبول</SelectItem>
                              <SelectItem value="غير مطابق">غير مطابق</SelectItem>
                              <SelectItem value="تحت الفحص">تحت الفحص</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>مرفوض</Label>
                          <div className="flex items-center space-x-2 pt-2">
                            <Checkbox 
                              id={`rejected-${item.id}`}
                              checked={item.rejected}
                              onCheckedChange={(checked) => updateItem(item.id, 'rejected', checked)}
                            />
                            <Label htmlFor={`rejected-${item.id}`} className="text-sm">
                              صنف مرفوض
                            </Label>
                          </div>
                        </div>
                        <div className="flex items-end">
                          {goodsReceipt.items.length > 1 && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="mt-4 space-y-2">
                        <Label>ملاحظات</Label>
                        <Textarea 
                          placeholder="أي ملاحظات على الصنف"
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
                <h3 className="text-lg font-medium">صور ومرفقات الاستلام</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                    <Camera className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        صور البضائع المستلمة
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
                        محاضر تسليم ومستندات
                      </p>
                      <Button variant="outline" size="sm">
                        <Upload className="ml-2 h-4 w-4" />
                        رفع ملفات
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* التوقيع والملاحظات */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="notes">ملاحظات عامة</Label>
                  <Textarea 
                    id="notes"
                    placeholder="أي ملاحظات أو تعليقات على عملية الاستلام"
                    value={goodsReceipt.notes}
                    onChange={(e) => setGoodsReceipt({...goodsReceipt, notes: e.target.value})}
                  />
                </div>
                <div className="space-y-4">
                  <Label>توقيع المستلم</Label>
                  <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                    <Signature className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        توقيع إلكتروني أو كود تأكيد
                      </p>
                      <Button variant="outline" size="sm">
                        <Signature className="ml-2 h-4 w-4" />
                        إضافة توقيع
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* أزرار الإجراء */}
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={clearForm} className="text-gray-600 hover:text-gray-700">
                  <RefreshCw className="ml-2 h-4 w-4" />
                  مسح النموذج
                </Button>
                <Button variant="outline" onClick={handleSaveReceipt}>
                  <FileText className="ml-2 h-4 w-4" />
                  حفظ مسودة
                </Button>
                <Button variant="outline">
                  <Printer className="ml-2 h-4 w-4" />
                  طباعة سند
                </Button>
                <Button onClick={handleCompleteReceipt}>
                  <CheckCircle className="ml-2 h-4 w-4" />
                  إكمال الاستلام
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* تبويب سجل الاستلام */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>سجل عمليات الاستلام</CardTitle>
              <CardDescription>جميع سندات الاستلام والعمليات المكتملة</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input 
                        placeholder="البحث في سندات الاستلام..." 
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="حالة الاستلام" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الحالات</SelectItem>
                      <SelectItem value="complete">مكتمل</SelectItem>
                      <SelectItem value="partial">جزئي</SelectItem>
                      <SelectItem value="rejected">مرفوض</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>رقم السند</TableHead>
                      <TableHead>رقم أمر الشراء</TableHead>
                      <TableHead>المورد</TableHead>
                      <TableHead>المستلم</TableHead>
                      <TableHead>التاريخ والوقت</TableHead>
                      <TableHead>حالة الاستلام</TableHead>
                      <TableHead>عدد الأصناف</TableHead>
                      <TableHead>الأصناف المرفوضة</TableHead>
                      <TableHead>الحالة العامة</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {goodsReceiptList.map((receipt: { id: number; grnNumber: string; poNumber: string; supplier: string; receiver: string; date: string; time: string; status: string; totalItems: number; rejectedItems: number; condition: string }) => (
                      <TableRow key={receipt.id}>
                        <TableCell className="font-medium">{receipt.grnNumber}</TableCell>
                        <TableCell>{receipt.poNumber}</TableCell>
                        <TableCell>{receipt.supplier}</TableCell>
                        <TableCell>{receipt.receiver}</TableCell>
                        <TableCell>{receipt.date} - {receipt.time}</TableCell>
                        <TableCell>{getStatusBadge(receipt.status)}</TableCell>
                        <TableCell>{receipt.totalItems}</TableCell>
                        <TableCell>
                          {receipt.rejectedItems > 0 ? (
                            <Badge variant="destructive">{receipt.rejectedItems}</Badge>
                          ) : (
                            <Badge variant="outline">0</Badge>
                          )}
                        </TableCell>
                        <TableCell>{getConditionBadge(receipt.condition)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setViewId(receipt.id as number);
                                setViewOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => window.print()}>
                              <Printer className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const data = Array.isArray(grnList) ? grnList.find((g: any) => g.id === receipt.id) : receipt;
                                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `${receipt.grnNumber || 'GRN'}.json`;
                                a.click();
                                URL.revokeObjectURL(url);
                              }}
                            >
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
          <Dialog open={viewOpen} onOpenChange={setViewOpen}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>تفاصيل سند الاستلام</DialogTitle>
                <DialogDescription>عرض البيانات الكاملة لسند الاستلام</DialogDescription>
              </DialogHeader>
              {selectedView && viewForm ? (
                <div className="space-y-4 text-sm">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-muted-foreground">رقم السند:</span> {selectedView.grnNumber}
                    </div>
                    <div>
                      <span className="text-muted-foreground">أمر الشراء:</span> {selectedView.purchaseOrder?.poNumber || selectedView.purchaseOrderId}
                    </div>
                    <div>
                      <span className="text-muted-foreground">المورد:</span> {selectedView.purchaseOrder?.supplier?.name_ar || selectedView.purchaseOrder?.supplier?.name_en || ""}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label>اسم المستلم</Label>
                      <Input value={viewForm.receiverName} onChange={(e) => setViewForm({ ...viewForm, receiverName: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                      <Label>تاريخ الاستلام</Label>
                      <Input type="date" value={viewForm.receiptDate} onChange={(e) => setViewForm({ ...viewForm, receiptDate: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                      <Label>وقت الاستلام</Label>
                      <Input type="time" value={viewForm.receiptTime} onChange={(e) => setViewForm({ ...viewForm, receiptTime: e.target.value })} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label>ملاحظات</Label>
                    <Textarea value={viewForm.notes} onChange={(e) => setViewForm({ ...viewForm, notes: e.target.value })} />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-muted-foreground">الأصناف</span>
                      <Button variant="outline" size="sm" onClick={() => setViewForm({ ...viewForm, items: [...viewForm.items, { id: Date.now(), name: "", orderedQty: 0, receivedQty: 0, unit: "", condition: "", notes: "", rejected: false }] })}>
                        إضافة صنف
                      </Button>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>الاسم</TableHead>
                          <TableHead>المطلوب</TableHead>
                          <TableHead>المستلم</TableHead>
                          <TableHead>الوحدة</TableHead>
                          <TableHead>الحالة</TableHead>
                          <TableHead>مرفوض</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {viewForm.items.map((it: any) => (
                          <TableRow key={it.id}>
                            <TableCell>
                              <Input value={it.name} onChange={(e) => setViewForm({ ...viewForm, items: viewForm.items.map((x: any) => x.id === it.id ? { ...x, name: e.target.value } : x) })} />
                            </TableCell>
                            <TableCell>
                              <Input type="number" value={it.orderedQty} onChange={(e) => setViewForm({ ...viewForm, items: viewForm.items.map((x: any) => x.id === it.id ? { ...x, orderedQty: Number(e.target.value) } : x) })} />
                            </TableCell>
                            <TableCell>
                              <Input type="number" value={it.receivedQty} onChange={(e) => setViewForm({ ...viewForm, items: viewForm.items.map((x: any) => x.id === it.id ? { ...x, receivedQty: Number(e.target.value) } : x) })} />
                            </TableCell>
                            <TableCell>
                              <Input value={it.unit} onChange={(e) => setViewForm({ ...viewForm, items: viewForm.items.map((x: any) => x.id === it.id ? { ...x, unit: e.target.value } : x) })} />
                            </TableCell>
                            <TableCell>
                              <Select value={it.condition} onValueChange={(v) => setViewForm({ ...viewForm, items: viewForm.items.map((x: any) => x.id === it.id ? { ...x, condition: v } : x) })}>
                                <SelectTrigger>
                                  <SelectValue placeholder="الحالة" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="ممتاز">ممتاز</SelectItem>
                                  <SelectItem value="جيد">جيد</SelectItem>
                                  <SelectItem value="مقبول">مقبول</SelectItem>
                                  <SelectItem value="غير مطابق">غير مطابق</SelectItem>
                                  <SelectItem value="تحت الفحص">تحت الفحص</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Checkbox checked={it.rejected} onCheckedChange={(checked) => setViewForm({ ...viewForm, items: viewForm.items.map((x: any) => x.id === it.id ? { ...x, rejected: Boolean(checked) } : x) })} />
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm" onClick={() => setViewForm({ ...viewForm, items: viewForm.items.filter((x: any) => x.id !== it.id) })}>حذف</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      onClick={async () => {
                        try {
                          const statusMap: Record<string, string> = { "مسودة": "draft", "مكتمل": "completed", "جزئي": "partial", "مرفوض": "rejected" };
                          const body: any = {
                            receiverName: viewForm.receiverName,
                            receiptDate: viewForm.receiptDate,
                            receiptTime: viewForm.receiptTime,
                            notes: viewForm.notes,
                            status: statusMap[viewForm.status] || "draft",
                            items: viewForm.items.map((it: any) => ({
                              name: it.name,
                              orderedQty: it.orderedQty || 0,
                              receivedQty: it.receivedQty || 0,
                              unit: it.unit || "",
                              condition: it.condition || "",
                              notes: it.notes || "",
                              rejected: Boolean(it.rejected),
                            })),
                          };
                          await updateGoodsReceipt({ id: selectedView.id, body }).unwrap();
                          toast({ title: 'تم الحفظ', description: 'تم تحديث بيانات السند' });
                          await refetchGRNs();
                          setViewOpen(false);
                        } catch (e: any) {
                          toast({ title: 'خطأ', description: e?.data?.message || 'تعذر التحديث', variant: 'destructive' });
                        }
                      }}
                    >
                      <Edit className="ml-2 h-4 w-4" /> حفظ التغييرات
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">لا توجد بيانات للعرض</div>
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* تبويب مراقبة الجودة */}
        <TabsContent value="quality" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShieldCheck className="ml-2 h-5 w-5" />
                  إحصائيات الجودة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(() => {
                    // حساب الإحصائيات من البيانات الحقيقية
                    let totalItems = 0;
                    let excellentItems = 0;
                    let goodItems = 0;
                    let acceptableItems = 0;
                    let rejectedItems = 0;
                    let unInspectedItems = 0;
                    
                    // جمع البيانات من جميع سندات الاستلام
                    if (Array.isArray(grnList)) {
                      grnList.forEach((receipt: any) => {
                        if (receipt.items && Array.isArray(receipt.items)) {
                          receipt.items.forEach((item: any) => {
                            totalItems++;
                            if (item.condition === 'ممتاز') excellentItems++;
                            else if (item.condition === 'جيد') goodItems++;
                            else if (item.condition === 'مقبول') acceptableItems++;
                            else if (item.rejected || item.condition === 'غير مطابق') rejectedItems++;
                            else unInspectedItems++;
                          });
                        }
                      });
                    }
                    
                    const complianceRate = totalItems > 0 ? Math.round(((excellentItems + goodItems + acceptableItems) / totalItems) * 100) : 0;
                    
                    return (
                      <>
                  <div className="flex justify-between">
                    <span>معدل المطابقة</span>
                          <span className="font-semibold text-green-600">{complianceRate}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>أصناف ممتازة</span>
                          <span className="font-semibold text-green-600">{excellentItems}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>أصناف جيدة</span>
                          <span className="font-semibold text-blue-600">{goodItems}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>أصناف مقبولة</span>
                          <span className="font-semibold text-yellow-600">{acceptableItems}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>أصناف مرفوضة</span>
                          <span className="font-semibold text-red-600">{rejectedItems}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>تحت الفحص</span>
                          <span className="font-semibold text-gray-600">{unInspectedItems}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{width: `${complianceRate}%`}}
                          ></div>
                  </div>
                      </>
                    );
                  })()}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="ml-2 h-5 w-5" />
                  مشاكل الجودة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(() => {
                    // حساب مشاكل الجودة من البيانات الحقيقية
                    let specMismatch = 0;
                    let damagedItems = 0;
                    let quantityIssues = 0;
                    let expiredItems = 0;
                    
                    // جمع البيانات من جميع سندات الاستلام
                    if (Array.isArray(grnList)) {
                      grnList.forEach((receipt: any) => {
                        if (receipt.items && Array.isArray(receipt.items)) {
                          receipt.items.forEach((item: any) => {
                            if (item.condition === 'غير مطابق') specMismatch++;
                            if (item.notes && item.notes.includes('تلف')) damagedItems++;
                            if (item.notes && item.notes.includes('نقص')) quantityIssues++;
                            if (item.notes && item.notes.includes('انتهاء')) expiredItems++;
                          });
                        }
                      });
                    }
                    
                    return (
                      <>
                  <div className="flex justify-between">
                    <span>عدم مطابقة المواصفات</span>
                          <span className="font-semibold text-red-600">{specMismatch}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>تلف أثناء النقل</span>
                          <span className="font-semibold text-orange-600">{damagedItems}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>نقص في الكمية</span>
                          <span className="font-semibold text-yellow-600">{quantityIssues}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>انتهاء صلاحية</span>
                          <span className="font-semibold text-red-600">{expiredItems}</span>
                  </div>
                        {specMismatch + damagedItems + quantityIssues + expiredItems === 0 && (
                          <div className="text-center py-2 text-green-600 text-sm">
                            ✅ لا توجد مشاكل جودة مسجلة
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="ml-2 h-5 w-5" />
                  تقييم الموردين
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(() => {
                    // حساب تقييم الموردين من البيانات الحقيقية
                    const supplierRatings: { [key: string]: { total: number; count: number; items: any[] } } = {};
                    
                    // جمع البيانات من جميع سندات الاستلام
                    if (Array.isArray(grnList)) {
                      grnList.forEach((receipt: any) => {
                        const supplierName = receipt.purchaseOrder?.supplier?.name_ar || 
                                           receipt.purchaseOrder?.supplier?.name_en || 
                                           receipt.supplier || 'مورد غير محدد';
                        
                        if (!supplierRatings[supplierName]) {
                          supplierRatings[supplierName] = { total: 0, count: 0, items: [] };
                        }
                        
                        if (receipt.items && Array.isArray(receipt.items)) {
                          receipt.items.forEach((item: any) => {
                            let rating = 0;
                            if (item.condition === 'ممتاز') rating = 5;
                            else if (item.condition === 'جيد') rating = 4;
                            else if (item.condition === 'مقبول') rating = 3;
                            else if (item.condition === 'غير مطابق' || item.rejected) rating = 1;
                            else rating = 2; // تحت الفحص
                            
                            supplierRatings[supplierName].total += rating;
                            supplierRatings[supplierName].count++;
                            supplierRatings[supplierName].items.push(item);
                          });
                        }
                      });
                    }
                    
                    // حساب المتوسط وتصنيف الموردين
                    const sortedSuppliers = Object.entries(supplierRatings)
                      .map(([name, data]) => ({
                        name,
                        averageRating: data.count > 0 ? (data.total / data.count).toFixed(1) : 0,
                        totalItems: data.count,
                        excellentItems: data.items.filter(item => item.condition === 'ممتاز').length,
                        rejectedItems: data.items.filter(item => item.rejected || item.condition === 'غير مطابق').length
                      }))
                      .sort((a, b) => Number(b.averageRating) - Number(a.averageRating))
                      .slice(0, 5); // أعلى 5 موردين
                    
                    if (sortedSuppliers.length === 0) {
                      return (
                        <div className="text-center py-4 text-gray-500">
                          لا توجد بيانات تقييم متاحة
                    </div>
                      );
                    }
                    
                    return sortedSuppliers.map((supplier, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{supplier.name}</div>
                          <div className="text-xs text-gray-500">
                            {supplier.totalItems} أصناف • {supplier.excellentItems} ممتاز • {supplier.rejectedItems} مرفوض
                  </div>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                          <span className="font-semibold">{supplier.averageRating}</span>
                    </div>
                  </div>
                    ));
                  })()}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>تقرير مراقبة الجودة التفصيلي</CardTitle>
              <CardDescription>تفاصيل فحص الجودة للشحنات المستلمة</CardDescription>
            </CardHeader>
            <CardContent>
              {goodsReceiptList.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>رقم السند</TableHead>
                    <TableHead>الصنف</TableHead>
                    <TableHead>المورد</TableHead>
                    <TableHead>حالة الفحص</TableHead>
                    <TableHead>ملاحظات الجودة</TableHead>
                    <TableHead>المفتش</TableHead>
                    <TableHead>التاريخ</TableHead>
                    <TableHead>الإجراء</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                    {goodsReceiptList.map((receipt: any) => {
                      // البحث عن سند الاستلام الكامل للحصول على تفاصيل الأصناف
                      const fullReceipt = localGRNList.find((g: any) => g.id === receipt.id) || 
                                        (Array.isArray(grnList) ? grnList.find((g: any) => g.id === receipt.id) : null);
                      const items = fullReceipt?.items || [];
                      
                      return items.map((item: any, itemIndex: number) => (
                        <TableRow key={`${receipt.id}-${itemIndex}`}>
                          <TableCell className="font-medium">{receipt.grnNumber}</TableCell>
                          <TableCell>{item.name || 'غير محدد'}</TableCell>
                          <TableCell>{receipt.supplier}</TableCell>
                    <TableCell>
                            {item.condition ? (
                              <Badge className={
                                item.condition === 'ممتاز' ? 'bg-green-100 text-green-800' :
                                item.condition === 'جيد' ? 'bg-blue-100 text-blue-800' :
                                item.condition === 'مقبول' ? 'bg-yellow-100 text-yellow-800' :
                                item.condition === 'غير مطابق' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }>
                                {item.condition}
                      </Badge>
                            ) : (
                              <Badge className="bg-gray-100 text-gray-800">
                                لم يتم الفحص
                              </Badge>
                            )}
                    </TableCell>
                    <TableCell>
                            {item.notes || item.condition ? 
                              `${item.condition || ''} ${item.notes || ''}`.trim() : 
                              'لا توجد ملاحظات'
                            }
                    </TableCell>
                          <TableCell>{receipt.receiver}</TableCell>
                          <TableCell>{receipt.date}</TableCell>
                    <TableCell>
                            <div className="flex gap-2">
                              {item.rejected ? (
                                <Badge variant="destructive" className="text-xs">
                                  مرفوض
                      </Badge>
                              ) : item.condition === 'غير مطابق' ? (
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={async () => {
                                    try {
                                      // تحديث حالة الصنف إلى مرفوض
                                      const updatedItems = fullReceipt.items.map((it: any, idx: number) => 
                                        idx === itemIndex ? { ...it, rejected: true, condition: 'غير مطابق' } : it
                                      );
                                      
                                      // تحديث سند الاستلام
                                      const result = await updateGoodsReceipt({
                                        id: receipt.id,
                                        body: { items: updatedItems }
                                      }).unwrap();
                                      
                                      console.log('نتيجة رفض الصنف:', result);
                                      
                                      toast({ 
                                        title: '✅ تم الرفض', 
                                        description: `تم رفض الصنف ${item.name}` 
                                      });
                                      
                                      // تحديث البيانات المحلية فوراً
                                      setLocalGRNList(prev => prev.map((g: any) => 
                                        g.id === receipt.id ? { ...g, items: updatedItems } : g
                                      ));
                                      
                                      // تحديث من الخادم
                                      await refetchGRNs();
                                      await refetchPOs();
                                    } catch (error: any) {
                                      toast({ 
                                        title: '❌ خطأ', 
                                        description: error?.data?.message || 'فشل رفض الصنف', 
                                        variant: 'destructive' 
                                      });
                                    }
                                  }}
                                >
                        رفض
                      </Button>
                              ) : item.condition && item.condition !== 'لم يتم الفحص' ? (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="text-green-600"
                                  onClick={async () => {
                                    try {
                                      console.log('جاري تحديث الصنف:', item.name);
                                      console.log('البيانات الأصلية:', fullReceipt.items);
                                      
                                      // تحديث حالة الصنف إلى ممتاز
                                      const updatedItems = fullReceipt.items.map((it: any, idx: number) => 
                                        idx === itemIndex ? { ...it, condition: 'ممتاز', rejected: false } : it
                                      );
                                      
                                      console.log('البيانات المحدثة:', updatedItems);
                                      
                                      // تحديث سند الاستلام
                                      const result = await updateGoodsReceipt({
                                        id: receipt.id,
                                        body: { items: updatedItems }
                                      }).unwrap();
                                      
                                      console.log('نتيجة التحديث:', result);
                                      
                                      toast({ 
                                        title: '✅ تمت الموافقة', 
                                        description: `تم اعتماد الصنف ${item.name} بجودة ممتازة` 
                                      });
                                      
                                      // تحديث البيانات المحلية فوراً
                                      setLocalGRNList(prev => prev.map((g: any) => 
                                        g.id === receipt.id ? { ...g, items: updatedItems } : g
                                      ));
                                      
                                      console.log('تم تحديث القائمة المحلية');
                                      
                                      // تحديث من الخادم
                                      await refetchGRNs();
                                      await refetchPOs();
                                      
                                      // رسالة تأكيد إضافية
                                      setTimeout(() => {
                                        toast({ 
                                          title: '🔄 تم التحديث', 
                                          description: 'تم تحديث البيانات في الواجهة' 
                                        });
                                      }, 1000);
                                      
                                    } catch (error: any) {
                                      console.error('خطأ في التحديث:', error);
                                      toast({ 
                                        title: '❌ خطأ', 
                                        description: error?.data?.message || 'فشل اعتماد الصنف', 
                                        variant: 'destructive' 
                                      });
                                    }
                                  }}
                                >
                                  موافقة
                                </Button>
                              ) : (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    // فتح نافذة فحص الجودة
                                    setQualityInspectionOpen(true);
                                    setQualityInspectionItem({
                                      receiptId: receipt.id,
                                      itemIndex: itemIndex,
                                      item: item,
                                      receipt: fullReceipt
                                    });
                                  }}
                                >
                                  فحص
                                </Button>
                              )}
                            </div>
                    </TableCell>
                  </TableRow>
                      ));
                    })}
                </TableBody>
              </Table>
              ) : (
                <div className="text-center py-8">
                  <Package className="mx-auto h-12 w-12 text-gray-400 mb-400" />
                  <p className="text-gray-500">لا توجد بيانات جودة متاحة</p>
                  <p className="text-sm text-gray-400">قم بإنشاء سندات استلام أولاً</p>
                </div>
              )}
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
                    <span>إجمالي الاستلامات</span>
                    <span className="font-semibold">48</span>
                  </div>
                  <div className="flex justify-between">
                    <span>معدل الاستلام في الوقت</span>
                    <span className="font-semibold text-green-600">92%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>متوسط وقت المعالجة</span>
                    <span className="font-semibold">45 دقيقة</span>
                  </div>
                  <div className="flex justify-between">
                    <span>معدل الجودة</span>
                    <span className="font-semibold text-green-600">95%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="ml-2 h-5 w-5" />
                  كفاءة العمليات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>استلامات مكتملة</span>
                    <span className="font-semibold text-green-600">42</span>
                  </div>
                  <div className="flex justify-between">
                    <span>استلامات جزئية</span>
                    <span className="font-semibold text-yellow-600">4</span>
                  </div>
                  <div className="flex justify-between">
                    <span>مرفوضة</span>
                    <span className="font-semibold text-red-600">2</span>
                  </div>
                  <div className="flex justify-between">
                    <span>تحت المراجعة</span>
                    <span className="font-semibold text-blue-600">3</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="ml-2 h-5 w-5" />
                  القيم المالية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>قيمة البضائع المستلمة</span>
                    <span className="font-semibold text-green-600">1,250,000 جنيه مصري</span>
                  </div>
                  <div className="flex justify-between">
                    <span>قيمة البضائع المرفوضة</span>
                    <span className="font-semibold text-red-600">15,000 جنيه مصري</span>
                  </div>
                  <div className="flex justify-between">
                    <span>وفورات من الرفض</span>
                    <span className="font-semibold text-green-600">8,500 جنيه مصري</span>
                  </div>
                  <div className="flex justify-between">
                    <span>تكلفة المعالجة</span>
                    <span className="font-semibold">2,200 جنيه مصري</span>
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
                  <Package className="h-6 w-6 mb-2" />
                  تقرير الاستلام
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <ShieldCheck className="h-6 w-6 mb-2" />
                  تقرير الجودة
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <TrendingUp className="h-6 w-6 mb-2" />
                  تقرير الكفاءة
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Users className="h-6 w-6 mb-2" />
                  تقرير الموردين
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* نافذة فحص الجودة */}
      <Dialog open={qualityInspectionOpen} onOpenChange={setQualityInspectionOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>فحص جودة الصنف</DialogTitle>
            <DialogDescription>
              فحص جودة الصنف: {qualityInspectionItem?.item?.name}
            </DialogDescription>
          </DialogHeader>
          
          {qualityInspectionItem && (
            <div className="space-y-4">
              {/* معلومات الصنف */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <span className="text-sm font-medium text-gray-600">اسم الصنف:</span>
                  <p className="font-medium">{qualityInspectionItem.item.name}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">الكمية المستلمة:</span>
                  <p className="font-medium">{qualityInspectionItem.item.receivedQty} {qualityInspectionItem.item.unit}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">رقم سند الاستلام:</span>
                  <p className="font-medium">{qualityInspectionItem.receipt.grnNumber}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">المورد:</span>
                  <p className="font-medium">{qualityInspectionItem.receipt.purchaseOrder?.supplier?.name_ar || qualityInspectionItem.receipt.purchaseOrder?.supplier?.name_en || 'غير محدد'}</p>
                </div>
              </div>
              
              {/* نموذج فحص الجودة */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>حالة الجودة</Label>
                  <Select 
                    value={qualityForm.condition}
                    onValueChange={(value) => setQualityForm(prev => ({ ...prev, condition: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر حالة الجودة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ممتاز">ممتاز</SelectItem>
                      <SelectItem value="جيد">جيد</SelectItem>
                      <SelectItem value="مقبول">مقبول</SelectItem>
                      <SelectItem value="غير مطابق">غير مطابق</SelectItem>
                      <SelectItem value="تحت الفحص">تحت الفحص</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>ملاحظات الفحص</Label>
                  <Textarea 
                    placeholder="أدخل ملاحظات فحص الجودة..."
                    value={qualityForm.notes}
                    onChange={(e) => setQualityForm(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="rejected"
                    checked={qualityForm.rejected}
                    onCheckedChange={(checked) => setQualityForm(prev => ({ ...prev, rejected: Boolean(checked) }))}
                  />
                  <Label htmlFor="rejected">صنف مرفوض</Label>
                </div>
              </div>
              
              {/* أزرار الإجراء */}
              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setQualityInspectionOpen(false);
                    setQualityInspectionItem(null);
                    setQualityForm({ condition: '', notes: '', rejected: false });
                  }}
                >
                  إلغاء
                </Button>
                <Button 
                  onClick={handleQualityInspectionSave}
                  disabled={!qualityForm.condition}
                >
                  حفظ نتائج الفحص
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GoodsReceipt;