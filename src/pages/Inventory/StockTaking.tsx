/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  Tabs, 
  TabsList, 
  TabsTrigger,
  TabsContent 
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import {
  BarChart3,
  Package,
  Brain,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  Edit,
  PlusCircle,
  ListChecks,
  Settings,
  Zap,
  Clock,
  Target,
  Users
} from 'lucide-react';
import { useGetAllProductsQuery, useUpdateProductStockMutation } from '@/services/productApi';
import { useGetAllConsumablesQuery, useUpdateConsumableStockMutation } from '@/services/consumableApi';
import { useCreateBulkCountItemsMutation } from '@/services/stockTakingApi';
import {
  useGetAllSessionsQuery,
  useCreateSessionMutation,
  useUpdateSessionMutation,
  useDeleteSessionMutation,
  useGetAllCountItemsQuery,
  useGetAllCountItemsFromAllSessionsQuery,
  useCreateCountItemMutation,
  useUpdateCountItemMutation,
  useGetAllAdjustmentsQuery,
  useCreateAdjustmentMutation,
  useUpdateAdjustmentMutation,
  useApproveAdjustmentMutation,
  useGetSessionStatisticsQuery,
} from '@/services/stockTakingApi';
import { useGetAllWarehousesQuery, useGetWarehouseInventoryQuery } from "@/services/warehouseApi";

// Types
interface StockCountSession {
  id: string;
  sessionNumber: string;
  warehouseId: number;
  warehouse?: { name_ar: string }; 
  countType: string;
  date: string;
  status: "جاري" | "مكتمل" | "معتمد" | "ملغي" | "معلق";
  teamMembers: string[];
  itemsCount: number;
  discrepanciesCount: number;
  totalValue: number;
  notes?: string;
  accuracy?: number;
  riskLevel?: string;
  priority?: number;
}
interface CountItem {
  id: string;
  itemCode: string;
  itemName: string;
  bookStock: number;
  physicalStock: number;
  variance: number;
  variancePercentage: number;
  unitCost: number;
  totalVarianceValue: number;
  reason?: string;
  location: string;
  status: string;
  category?: string;
  aiConfidence?: number;
  verificationMethod?: string;
}

const StockTaking: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showSessionDialog, setShowSessionDialog] = useState(false);
  const [showAdjustmentDialog, setShowAdjustmentDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditItemDialog, setShowEditItemDialog] = useState(false);
  const [showCountingInterface, setShowCountingInterface] = useState(false);
  const [selectedItemTypes, setSelectedItemTypes] = useState<{products: boolean; consumables: boolean}>({ products: true, consumables: false });
  const [selectedItemCodes, setSelectedItemCodes] = useState<string[]>([]);
  const [selectedSession, setSelectedSession] =
    useState<StockCountSession | null>(null);
  const [selectedAdjustment, setSelectedAdjustment] = useState<any>(null);
  const [selectedItem, setSelectedItem] = useState<CountItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [currentCountingSession, setCurrentCountingSession] =
    useState<StockCountSession | null>(null);
  const [newSessionData, setNewSessionData] = useState({
    warehouseId: "",
    countType: "",
    teamMembers: [] as string[],
    notes: "",
  });
  const [countingWarehouseId, setCountingWarehouseId] = useState<string>("");
  const [editedPhysicalStock, setEditedPhysicalStock] = useState("");

  const { toast } = useToast();
  // تعديل طريقة استخراج البيانات من الـ API
  const {
    data: warehousesData = { data: { warehouses: [] } },
    isLoading: isLoadingWarehouses,
  } = useGetAllWarehousesQuery(undefined);
  const warehouses = warehousesData.data?.warehouses || [];
  React.useEffect((): void => {
    if (selectedSession?.warehouseId) setCountingWarehouseId(String(selectedSession.warehouseId));
    if (currentCountingSession?.warehouseId) setCountingWarehouseId(String(currentCountingSession.warehouseId));
  }, [selectedSession, currentCountingSession]);

  const { data: warehouseInventoryResp, isLoading: isLoadingWarehouseInv } = useGetWarehouseInventoryQuery(
    countingWarehouseId,
    { skip: !countingWarehouseId }
  );
  const warehouseInventory = (warehouseInventoryResp as any)?.data?.inventory || [];
  // اجلب مخزون المستودع المختار في شاشة إنشاء الجلسة
  const { data: selectedWarehouseInvResp } = useGetWarehouseInventoryQuery(
    newSessionData.warehouseId,
    { skip: !newSessionData.warehouseId }
  );
  const selectedWarehouseInventory = (selectedWarehouseInvResp as any)?.data?.inventory || [];
  const { data: productsData = {} as any } = useGetAllProductsQuery(undefined as any);
  const products: any[] = Array.isArray((productsData as any)?.data?.products)
    ? (productsData as any).data.products
    : Array.isArray(productsData)
    ? (productsData as any)
    : [];

  const { data: consumablesData = {} as any } = useGetAllConsumablesQuery(undefined as any);
  const consumables: any[] = Array.isArray((consumablesData as any)?.data)
    ? (consumablesData as any).data
    : Array.isArray((consumablesData as any)?.data?.consumables)
    ? (consumablesData as any).data.consumables
    : Array.isArray(consumablesData)
    ? (consumablesData as any)
    : [];
  const [createBulkItems] = useCreateBulkCountItemsMutation();
  const [updateProductStock] = useUpdateProductStockMutation();
  const [updateConsumableStock] = useUpdateConsumableStockMutation();

  const {
    data: stockSessionsData = { data: { sessions: [] } },
    isLoading: isLoadingSessions,
  } = useGetAllSessionsQuery(undefined as any);
  const stockSessions: any[] = stockSessionsData.data?.sessions || [];

  const {
    data: countItemsData = { data: { items: [] } },
    isLoading: isLoadingCountItems,
  } = useGetAllCountItemsQuery(selectedSession?.id as any, {
    skip: !(selectedSession && selectedSession.id),
  });
  const countItems: any[] = countItemsData.data?.items || [];

  // جلب جميع الأصناف من جميع الجلسات لصفحة النتائج
  const { data: allCountItemsData, isLoading: isLoadingAllCountItems } = useGetAllCountItemsFromAllSessionsQuery(
    undefined as any,
    { 
      skip: false,
      refetchOnMountOrArgChange: true 
    }
  );
  const allCountItems: any[] = (allCountItemsData as any)?.data?.items || [];

  // إضافة console.log للتأكد من بيانات جميع الأصناف
  console.log("📊 بيانات جميع الأصناف:", {
    allCountItemsData,
    allCountItems: allCountItems.length,
    isLoadingAllCountItems
  });

  // Live count items for current session in live interface
  const { data: liveCountItemsData, refetch: refetchLiveItems } = useGetAllCountItemsQuery(
    (currentCountingSession && currentCountingSession.id ? currentCountingSession.id : undefined) as any,
    { 
      skip: !(currentCountingSession && currentCountingSession.id),
      refetchOnMountOrArgChange: true 
    }
  );
  const liveCountItems: any[] = (liveCountItemsData as any)?.data?.items || [];

  // إضافة console.log للتأكد من البيانات
  console.log("🔍 بيانات الجلسة الحالية:", {
    currentCountingSession,
    currentCountingSessionId: currentCountingSession?.id,
    liveCountItemsData,
    liveCountItems: liveCountItems.length,
    countItems: countItems.length,
    skip: !(currentCountingSession && currentCountingSession.id)
  });

  // إضافة console.log للتأكد من بيانات المستودع
  console.log("🏪 بيانات المستودع:", {
    newSessionData: newSessionData,
    warehouseId: newSessionData.warehouseId,
    selectedWarehouseInvResp: selectedWarehouseInvResp,
    selectedWarehouseInventory: selectedWarehouseInventory,
    products: products.length,
    consumables: consumables.length
  });

  const {
    data: adjustmentsData = { data: { adjustments: [] } },
    isLoading: isLoadingAdjustments,
  } = useGetAllAdjustmentsQuery(undefined as any);
  const adjustments = adjustmentsData.data?.adjustments || [];

  const [createSession] = useCreateSessionMutation();
  const [updateSession] = useUpdateSessionMutation();
  const [deleteSession] = useDeleteSessionMutation();
  const [createCountItem] = useCreateCountItemMutation();
  const [updateCountItem] = useUpdateCountItemMutation();
  const [createAdjustment] = useCreateAdjustmentMutation();
  const [updateAdjustment] = useUpdateAdjustmentMutation();
  const [approveAdjustment] = useApproveAdjustmentMutation();

  const enhancedStatistics = React.useMemo(() => {
    const sessionsArray = Array.isArray(stockSessions) ? stockSessions : [];
    const itemsArray = Array.isArray(allCountItems) ? allCountItems : [];
    const totalSessions = sessionsArray.length;
    const activeSessions = sessionsArray.filter(
      (s) => s.status === "جاري"
    ).length;
    const totalItems = itemsArray.length;
    const accurateItems = itemsArray.filter(
      (item) => item.variance === 0
    ).length;
    const discrepancyItems = itemsArray.filter(
      (item) => item.variance !== 0
    ).length;
    const averageAccuracy =
      totalItems > 0 ? (accurateItems / totalItems) * 100 : 0;
    const totalValue = sessionsArray.reduce(
      (sum, session) => sum + (session.totalValue || 0),
      0
    );
    const totalVarianceValue = itemsArray.reduce(
      (sum, item) => sum + (item.totalVarianceValue || 0),
      0
    );
    const aiGeneratedAdjustments = itemsArray.filter(
      (item) => item.aiConfidence && item.aiConfidence > 90
    ).length;
    return {
      totalSessions,
      activeSessions,
      totalItems,
      accurateItems,
      discrepancyItems,
      averageAccuracy,
      totalValue,
      totalVarianceValue,
      aiGeneratedAdjustments,
    };
  }, [stockSessions, allCountItems]);

  // Filter data based on search and selections
  const filteredSessions = Array.isArray(stockSessions)
    ? stockSessions.filter((session) => {
        return (
          (searchTerm === "" ||
            session.sessionNumber
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            (session.warehouse?.name_ar || "")
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) &&
          (selectedWarehouse === "" ||
            (session.warehouse?.name_ar || "") === selectedWarehouse) &&
          (selectedStatus === "" || session.status === selectedStatus)
        );
      })
    : [];

  const filteredItems = allCountItems.filter(
    (item: { itemCode: string; itemName: string }) => {
      return (
        searchTerm === "" ||
        item.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  );

const filteredAdjustments = Array.isArray(adjustments)
  ? adjustments.filter((adjustment) => {
      return (
        searchTerm === "" ||
        adjustment.adjustmentNumber
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        adjustment.itemName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
  : [];

const validateSessionData = (data: typeof newSessionData) => {
  if (!data.warehouseId) {
    return { isValid: false, message: "يرجى تحديد المستودع" };
  }

  if (!data.countType) {
    return { isValid: false, message: "يرجى تحديد نوع الجرد" };
  }

  const warehouseId = parseInt(data.warehouseId);
  if (isNaN(warehouseId)) {
    return { isValid: false, message: "معرف المستودع غير صالح" };
  }

  return { isValid: true };
};
// Functions
const startNewSession = async () => {
  if (!newSessionData.warehouseId || !newSessionData.countType) {
    toast({
      title: "بيانات ناقصة",
      description: "يرجى تحديد المستودع ونوع الجرد أولاً",
      variant: "destructive",
    });
    return;
  }

  try {
    const warehouseId = parseInt(newSessionData.warehouseId);

    if (isNaN(warehouseId)) {
      toast({
        title: "بيانات غير صالحة",
        description: "معرف المستودع غير صالح",
        variant: "destructive",
      });
      return;
    }

    const timestamp = Date.now();
    const sessionNumber = `ST-${new Date().getFullYear()}-${String(
      timestamp
    ).slice(-6)}`;

    const sessionPayload = {
      warehouseId,
      countType: newSessionData.countType,
      teamMembers: newSessionData.teamMembers,
      notes: newSessionData.notes,
      sessionNumber,
      date: new Date().toISOString().split("T")[0],
      status: "جاري",
      itemsCount: 0,
      discrepanciesCount: 0,
      totalValue: 0,
      accuracy: 0,
    };

    const createdResp = await createSession(sessionPayload).unwrap();
    const createdSession: any = createdResp?.data?.session || createdResp?.session || createdResp;
    const sessionId: string = String(createdSession?.id || createdSession?._id || "");
    if (!sessionId) {
      throw new Error("لم يتم إنشاء الجلسة بشكل صحيح (sessionId غير متوفر)");
    }

    // Build initial items, preferring products tied to the selected warehouse inventory
    const pool: Array<{ code: string; type: string; name: string; unitCost: number; bookStock?: number }> = [];
    
    console.log("🔍 بناء قائمة الأصناف:", {
      selectedItemTypes,
      selectedItemCodes,
      selectedWarehouseInventory: selectedWarehouseInventory.length,
      products: products.length,
      consumables: consumables.length
    });

    console.log("🔍 تفاصيل selectedItemTypes:", {
      products: selectedItemTypes.products,
      consumables: selectedItemTypes.consumables
    });

    console.log("📋 تفاصيل البيانات:", {
      products: products,
      consumables: consumables
    });

    // تفاصيل أكثر للمنتجات
    console.log("🔍 تفاصيل المنتجات:", products.map((p: any) => ({
      product_id: p.product_id,
      name_ar: p.name_ar,
      warehouse_id: p.warehouse_id,
      current_stock: p.current_stock
    })));

    // عرض البيانات الخام
    console.log("📊 البيانات الخام:", {
      productsRaw: products,
      consumablesRaw: consumables,
      selectedWarehouseInventoryRaw: selectedWarehouseInventory
    });

    if (selectedItemTypes.products) {
      console.log("🏪 جلب المنتجات من المستودع:", warehouseId);
      
      // جلب المنتجات التي تنتمي للمستودع المختار
      const warehouseProducts = products.filter((p: any) => {
        const productWarehouseId = Number(p.warehouse_id || 0);
        const selectedWarehouseId = Number(warehouseId);
        const matches = productWarehouseId === selectedWarehouseId;
        
        console.log(`🔍 المنتج ${p.product_id}: warehouse_id=${productWarehouseId}, المختار=${selectedWarehouseId}, متطابق=${matches}`);
        
        return matches;
      });
      
      // إذا لم توجد منتجات في المستودع المختار، استخدم جميع المنتجات
      if (warehouseProducts.length === 0) {
        console.log("⚠️ لا توجد منتجات في المستودع المختار، استخدام جميع المنتجات");
        warehouseProducts.push(...products);
      }
      
      console.log("📦 المنتجات في المستودع المختار:", warehouseProducts);
      
      if (warehouseProducts.length > 0) {
        console.log("✅ تم العثور على منتجات في المستودع");
        for (const p of warehouseProducts) {
          const code = String(p.product_id || '');
          if (!code) {
            console.log("⚠️ تخطي منتج بدون product_id:", p);
            continue;
          }
          if (selectedItemCodes.length === 0 || selectedItemCodes.includes(code)) {
            const item = {
              code,
              type: 'product',
              name: p.name_ar || p.name_en || '',
              unitCost: Number(p.cost_price || 0),
              bookStock: Number(p.current_stock || 0),
            };
            pool.push(item);
            console.log("✅ تم إضافة منتج للقائمة:", item);
          } else {
            console.log("⚠️ المنتج غير مدرج في selectedItemCodes:", code);
          }
        }
      } else {
        // fallback to all products if no products in selected warehouse
        console.warn("⚠️ لا توجد منتجات في المستودع المختار، استخدام جميع المنتجات المتاحة");
        console.log("📋 جميع المنتجات المتاحة:", products);
        
        for (const p of products) {
          const code = String(p.product_id || '');
          if (!code) continue;
          if (selectedItemCodes.length === 0 || selectedItemCodes.includes(code)) {
            const item = { 
              code, 
              type: 'product',
              name: p.name_ar || p.name_en || '', 
              unitCost: Number(p.cost_price || 0),
              bookStock: Number(p.current_stock || 0)
            };
            pool.push(item);
            console.log("✅ تم إضافة منتج للقائمة (fallback):", item);
          }
        }
      }
      
      console.log("📋 حجم القائمة بعد إضافة المنتجات:", pool.length);
    }
    if (selectedItemTypes.consumables) {
      console.log("🧴 جلب المستهلكات من المستودع:", warehouseId);
      
      // جلب المستهلكات التي تنتمي للمستودع المختار
      const warehouseConsumables = consumables.filter((c: any) => {
        const consumableWarehouseId = Number(c.warehouse_id);
        const selectedWarehouseId = Number(warehouseId);
        const matches = consumableWarehouseId === selectedWarehouseId;
        
        console.log(`🔍 المستهلك ${c.id}: warehouse_id=${consumableWarehouseId}, المختار=${selectedWarehouseId}, متطابق=${matches}`);
        
        return matches;
      });
      
      console.log("🧴 المستهلكات في المستودع المختار:", warehouseConsumables);
      
      for (const c of warehouseConsumables) {
        const code = String(c.id || c.code || '');
        if (!code) continue;
        if (selectedItemCodes.length === 0 || selectedItemCodes.includes(code)) {
          pool.push({ 
            code, 
            type: 'consumable',
            name: c.name_ar || c.name_en || c.name || '', 
            unitCost: Number(c.unitCost || 0),
            bookStock: Number(c.currentStock || 0)
          });
        }
      }
    }

    if (pool.length > 0) {
      try {
        console.log("🔍 إنشاء الأصناف:", {
          poolLength: pool.length,
          pool: pool,
          sessionId: sessionId,
          warehouseId: warehouseId
        });

        const itemsData = pool.map((it) => ({
          itemCode: it.code,
          itemType: it.type, // إضافة نوع الصنف
          itemName: it.name,
          bookStock: typeof it.bookStock === 'number' ? it.bookStock : 0,
          physicalStock: 0,
          variance: 0,
          variancePercentage: 0,
          unitCost: it.unitCost,
          totalVarianceValue: 0,
          status: 'مطابق',
          location: `WH-${warehouseId}`
        }));

        console.log("📋 بيانات الأصناف المراد إنشاؤها:", itemsData);

        const result = await createBulkItems({ sessionId, itemsData }).unwrap();
        console.log("✅ تم إنشاء الأصناف:", result);
        console.log(`✅ تم إنشاء ${itemsData.length} صنف للجلسة`);
      } catch (error: any) {
        console.error("❌ فشل في إنشاء الأصناف:", error);
        console.error("❌ تفاصيل الخطأ:", {
          error: error,
          data: error?.data,
          message: error?.message
        });
        
        // إذا فشل إنشاء الأصناف، اعرض رسالة للمستخدم
        toast({
          title: "تحذير",
          description: "فشل في إنشاء الأصناف تلقائياً، سيتم إنشاؤها يدوياً",
          variant: "destructive",
        });
      }
    } else {
      console.warn("⚠️ لا توجد أصناف متاحة لإنشاء جلسة الجرد");
      console.log("🔍 سبب عدم وجود أصناف:", {
        selectedItemTypes,
        selectedItemCodes,
        products: products.length,
        consumables: consumables.length
      });
      
      // إذا لم توجد أصناف، اعرض رسالة للمستخدم
      toast({
        title: "تحذير",
        description: "لا توجد أصناف متاحة، سيتم إنشاؤها يدوياً",
        variant: "destructive",
      });
    }

    // البحث عن بيانات المستودع من القائمة المحلية
    const warehouse = warehouses.find((w: any) => w.warehouse_id === warehouseId);

    // إنشاء كائن جديد بدلاً من تعديل الكائن الأصلي
    const sessionWithWarehouse = {
      ...createdSession,
      id: sessionId, // استخدام sessionId مباشرة
      warehouse: warehouse
        ? { name_ar: warehouse.name_ar }
        : { name_ar: "غير محدد" },
    };

    console.log("🔍 إنشاء الجلسة:", {
      createdSession,
      sessionId,
      sessionWithWarehouse,
      pool: pool.length
    });

    setCurrentCountingSession(sessionWithWarehouse);
    setShowCountingInterface(true);
    setActiveTab("sessions");

    toast({
      title: "تم بدء الجلسة",
      description: `تم إنشاء جلسة جرد جديدة برقم ${createdSession.sessionNumber || sessionWithWarehouse.sessionNumber}`,
    });
  } catch (error: any) {
    console.error("خطأ في إنشاء الجلسة:", error);

    let errorMessage = "فشل في إنشاء جلسة الجرد";
    if (error.data) {
      errorMessage = error.data.message || error.data.error || errorMessage;
    } else if (error.message) {
      errorMessage = error.message;
    }

    toast({
      title: "خطأ",
      description: errorMessage,
      variant: "destructive",
    });
  }
};

  const viewSession = (session: StockCountSession) => {
    setSelectedSession(session);
    setShowSessionDialog(true);
  };

  const editSession = (session: StockCountSession) => {
    setSelectedSession(session);
    setNewSessionData({
      warehouseId: session.warehouseId?.toString() || "",
      countType: session.countType,
      teamMembers: session.teamMembers,
      notes: session.notes || "",
    });
    setShowSessionDialog(true);
  };

  const viewItemDetails = (item: CountItem) => {
    setSelectedItem(item);
    setEditedPhysicalStock(item.physicalStock.toString());
    setShowEditItemDialog(true);
  };

  const handleUpdateItem = async () => {
    if (!selectedItem) return;

    try {
      const newPhysicalStock = parseInt(editedPhysicalStock);
      const variance = newPhysicalStock - selectedItem.bookStock;
      const variancePercentage = selectedItem.bookStock
        ? (variance / selectedItem.bookStock) * 100
        : 0;
      const totalVarianceValue = variance * selectedItem.unitCost;

      await updateCountItem({
        id: selectedItem.id,
        itemData: {
          physicalStock: newPhysicalStock,
          variance,
          variancePercentage,
          totalVarianceValue,
          status:
            variance === 0 ? "مطابق" : variance > 0 ? "فرق موجب" : "فرق سالب",
        },
      }).unwrap();

      // التسويات سيتم إنشاؤها تلقائياً عند إكمال الجلسة

      toast({
        title: "تم تحديث الصنف",
        description: "تم حفظ التغييرات بنجاح",
      });
      setShowEditItemDialog(false);
      setSelectedItem(null);
      setEditedPhysicalStock("");
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث الصنف",
        variant: "destructive",
      });
    }
  };

  const handleApproveAdjustment = async (adjustmentId: string) => {
    try {
      // البحث عن التسوية لمعرفة تفاصيلها
      const adjustment = adjustments.find((adj: any) => adj.id === adjustmentId);
      
      if (adjustment) {
        // تحديث كمية المنتج/المستهلكة بناءً على التسوية
        const countItem = allCountItems.find((item: any) => item.itemCode === adjustment.itemCode);
        
        if (countItem) {
          const newQuantity = countItem.physicalStock; // الكمية الفعلية المجردة
          
          if (countItem.itemType === 'product') {
            await updateProductStock({
              id: countItem.itemCode,
              warehouseId: adjustment.warehouseId || countItem.location?.replace('WH-', ''),
              quantity: newQuantity
            }).unwrap();
          } else if (countItem.itemType === 'consumable') {
            await updateConsumableStock({
              id: countItem.itemCode,
              quantity: newQuantity
            }).unwrap();
          }
        }
      }
      
      await approveAdjustment(adjustmentId).unwrap();
      toast({
        title: "تم اعتماد التسوية",
        description: `تم اعتماد التسوية وتحديث كمية الصنف`,
      });
    } catch (error: any) {
      console.error("خطأ في اعتماد التسوية:", error);
      toast({
        title: "خطأ",
        description: "فشل في اعتماد التسوية",
        variant: "destructive",
      });
    }
  };

  const handleViewAdjustment = (adjustment: any) => {
    setSelectedAdjustment(adjustment);
    setShowAdjustmentDialog(true);
  };

  const handleEditAdjustment = (adjustment: any) => {
    setSelectedAdjustment(adjustment);
    setShowAdjustmentDialog(true);
  };

  const handleDeleteSession = async () => {
    if (itemToDelete) {
      try {
        await deleteSession(itemToDelete).unwrap();
        setShowDeleteDialog(false);
        setItemToDelete(null);
        toast({
          title: "تم حذف الجلسة",
          description: "تم حذف جلسة الجرد بنجاح",
        });
      } catch (error: any) {
        toast({
          title: "خطأ",
          description: "فشل في حذف جلسة الجرد",
          variant: "destructive",
        });
      }
    }
  };

  const handleExportAdjustments = async () => {
    // Implementation for exporting adjustments
    toast({
      title: "تم تصدير التسويات",
      description: "تم تصدير جميع التسويات بصيغة Excel",
    });
  };

  const handleImportResults = async () => {
    // Implementation for importing results
    toast({
      title: "تم استيراد النتائج",
      description: "تم استيراد نتائج الجرد من ملف Excel",
    });
  };

  const handleExportItemsList = async () => {
    // Implementation for exporting items list
    toast({
      title: "تم تصدير قائمة الأصناف",
      description: "تم تصدير قائمة الأصناف بصيغة Excel",
    });
  };

  const handleSaveAsDraft = async () => {
    if (selectedSession) {
      try {
        await updateSession({
          id: selectedSession.id,
          sessionData: { ...selectedSession, status: "معلق" },
        }).unwrap();
        toast({
          title: "تم حفظ المسودة",
          description: "تم حفظ إعدادات الجلسة كمسودة",
        });
      } catch (error: any) {
        toast({
          title: "خطأ",
          description: "فشل في حفظ المسودة",
          variant: "destructive",
        });
      }
    }
  };

  const handleDuplicateSession = async (sessionId: string) => {
    const sessionsArray = Array.isArray(stockSessions) ? stockSessions : [];
    const originalSession = sessionsArray.find(
      (session) => session.id === sessionId
    );
    if (originalSession) {
      try {
        const newSession = await createSession({
          ...originalSession,
          sessionNumber: `ST-${String(sessionsArray.length + 1).padStart(
            4,
            "0"
          )}`,
          status: "جاري",
          date: new Date().toISOString().split("T")[0],
        }).unwrap();
        toast({
          title: "تم نسخ الجلسة",
          description: `تم إنشاء نسخة جديدة برقم ${newSession.sessionNumber}`,
        });
      } catch (error: any) {
        toast({
          title: "خطأ",
          description: "فشل في نسخ الجلسة",
          variant: "destructive",
        });
      }
    }
  };

  const handleArchiveSession = async (sessionId: string) => {
    try {
      await updateSession({
        id: sessionId,
        sessionData: { status: "ملغي" },
      }).unwrap();
      toast({
        title: "تم أرشفة الجلسة",
        description: "تم نقل الجلسة إلى الأرشيف",
      });
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: "فشل في أرشفة الجلسة",
        variant: "destructive",
      });
    }
  };

  const handlePrintSession = (sessionId: string) => {
    toast({
      title: "طباعة الجلسة",
      description: "سيتم فتح نافذة الطباعة",
    });
    window.print();
  };

  const runAIAnalysis = async () => {
    // Implementation for AI analysis
    toast({
      title: "تحليل ذكي مكتمل",
      description: "تم إنجاز التحليل وتوليد توصيات جديدة",
    });
  };

  const handleBulkExport = async () => {
    // Implementation for bulk export
    toast({
      title: "تم التصدير بنجاح",
      description: "تم تصدير جميع بيانات الجرد",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      جاري: "bg-yellow-50 text-yellow-700 border-yellow-200",
      مكتمل: "bg-blue-50 text-blue-700 border-blue-200",
      معتمد: "bg-green-50 text-green-700 border-green-200",
      ملغي: "bg-red-50 text-red-700 border-red-200",
      معلق: "bg-orange-50 text-orange-700 border-orange-200",
      مطابق: "bg-green-50 text-green-700 border-green-200",
      "فرق موجب": "bg-blue-50 text-blue-700 border-blue-200",
      "فرق سالب": "bg-red-50 text-red-700 border-red-200",
    };

    return (
      <Badge
        className={`border ${
          statusColors[status as keyof typeof statusColors] ||
          "bg-gray-50 text-gray-700 border-gray-200"
        }`}
      >
        {status}
      </Badge>
    );
  };

  const getVarianceIcon = (variance: number) => {
    if (variance > 0) return <TrendingUp className="h-4 w-4 text-blue-600" />;
    if (variance < 0) return <AlertTriangle className="h-4 w-4 text-red-600" />;
    return <CheckCircle className="h-4 w-4 text-green-600" />;
  };

  return (
    <div className="container mx-auto p-6 space-y-6 bg-gradient-to-br from-slate-50 to-white min-h-screen">
      {/* Enhanced Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-500 p-8 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">إدارة جرد المخزون</h1>
              <p className="text-blue-100 text-lg">
                نظام ذكي متقدم لإدارة ومراقبة جرد المخزون
              </p>
            </div>
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {enhancedStatistics.activeSessions}
                </div>
                <div className="text-xs text-blue-100">جلسات نشطة</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {enhancedStatistics.averageAccuracy.toFixed(1)}%
                </div>
                <div className="text-xs text-blue-100">دقة الجرد</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">جلسات الجرد</p>
                <p className="text-3xl font-bold text-blue-900">
                  {enhancedStatistics.totalSessions}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  نشط: {enhancedStatistics.activeSessions}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">دقة الجرد</p>
                <p className="text-3xl font-bold text-blue-900">
                  {enhancedStatistics.averageAccuracy.toFixed(1)}%
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  مُحسن بالذكاء الاصطناعي
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-cyan-50 to-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-cyan-700">
                  إجمالي الأصناف
                </p>
                <p className="text-3xl font-bold text-cyan-900">
                  {enhancedStatistics.totalItems}
                </p>
                <p className="text-xs text-cyan-600 mt-1">
                  فروقات: {enhancedStatistics.discrepancyItems}
                </p>
              </div>
              <div className="p-3 bg-cyan-100 rounded-full">
                <Target className="h-6 w-6 text-cyan-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-50 to-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">
                  قيمة إجمالية
                </p>
                <p className="text-2xl font-bold text-purple-900">
                  {enhancedStatistics.totalValue.toLocaleString()} جنيه
                </p>
                <p className="text-xs text-purple-600 mt-1">
                  تسويات ذكية: {enhancedStatistics.aiGeneratedAdjustments}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Search and Filters */}
      <Card className="shadow-lg border-0">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="البحث في الجرد..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>

            <Select
              value={selectedWarehouse}
              onValueChange={setSelectedWarehouse}
            >
              <SelectTrigger>
                <SelectValue placeholder="المستودع" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                <SelectItem value="all">جميع المستودعات</SelectItem>
                          {Array.isArray(warehouses) &&
                   warehouses.map((warehouse: any) => (
                    <SelectItem
                      key={warehouse.warehouse_id}
                      value={warehouse.name_ar || ""}
                    >
                      {warehouse.name_ar || "غير محدد"}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="جاري">جاري</SelectItem>
                <SelectItem value="مكتمل">مكتمل</SelectItem>
                <SelectItem value="معتمد">معتمد</SelectItem>
                <SelectItem value="معلق">معلق</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={runAIAnalysis}
              disabled={
                isLoadingSessions || isLoadingCountItems || isLoadingAdjustments
              }
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Brain className="h-4 w-4 ml-1" />
              تحليل ذكي
            </Button>

            <Button
              onClick={handleBulkExport}
              disabled={
                isLoadingSessions || isLoadingCountItems || isLoadingAdjustments
              }
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Download className="h-4 w-4 ml-1" />
              تصدير
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <TabsList className="grid w-full max-w-4xl grid-cols-5 bg-slate-100 p-1">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-white"
            >
              لوحة المعلومات
            </TabsTrigger>
            <TabsTrigger
              value="sessions"
              className="data-[state=active]:bg-white"
            >
              جلسات الجرد
            </TabsTrigger>
            <TabsTrigger
              value="new-session"
              className="data-[state=active]:bg-white"
            >
              بدء جلسة جديدة
            </TabsTrigger>
            <TabsTrigger
              value="results"
              className="data-[state=active]:bg-white"
            >
              نتائج الجرد
            </TabsTrigger>
            <TabsTrigger
              value="adjustments"
              className="data-[state=active]:bg-white"
            >
              التسويات
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b">
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 ml-2 text-blue-600" />
                  نشاط الجرد الحالي
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {isLoadingSessions ? (
                  <div>جاري التحميل...</div>
                ) : (
                  <div className="space-y-4">
                {Array.isArray(filteredSessions) &&
                      filteredSessions.map((session: any) => (
                        <div
                          key={session.id}
                          className="p-4 bg-slate-50 rounded-lg"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">
                              {session.sessionNumber}
                            </h4>
                            {getStatusBadge(session.status)}
                          </div>
                          <p className="text-sm text-slate-600">
                            {session.warehouse?.name_ar || "غير محدد"}
                          </p>
                          <div className="flex items-center mt-2 space-x-4 rtl:space-x-reverse text-xs">
                            <span>أصناف: {session.itemsCount}</span>
                            <span>فروق: {session.discrepanciesCount}</span>
                            {session.accuracy && (
                              <span className="text-green-600">
                                دقة: {session.accuracy}%
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b">
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 ml-2 text-purple-600" />
                  تحليلات الذكاء الاصطناعي
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center mb-2">
                      <Zap className="h-4 w-4 text-blue-600 ml-1" />
                      <span className="text-sm font-medium text-blue-800">
                        توصية ذكية
                      </span>
                    </div>
                    <p className="text-xs text-blue-600">
                      يُنصح بجرد مفاجئ لفرع الرياض بسبب الفروقات المتكررة
                    </p>
                  </div>

                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex items-center mb-2">
                      <AlertTriangle className="h-4 w-4 text-orange-600 ml-1" />
                      <span className="text-sm font-medium text-orange-800">
                        تنبيه
                      </span>
                    </div>
                    <p className="text-xs text-orange-600">
                      ارتفاع في نسبة الفروقات السالبة لفئة التقنية
                    </p>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600 ml-1" />
                      <span className="text-sm font-medium text-green-800">
                        إنجاز
                      </span>
                    </div>
                    <p className="text-xs text-green-600">
                      تحسن دقة الجرد بنسبة 15% مقارنة بالشهر الماضي
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sessions">
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 ml-2" />
                  جلسات الجرد المتقدمة
                </CardTitle>
                <Button
                  onClick={() => setActiveTab("new-session")}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <PlusCircle className="h-4 w-4 ml-1" />
                  جلسة جديدة
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                <Table>
                  <TableHeader className="sticky top-0 bg-white shadow-sm">
                    <TableRow>
                      <TableHead className="text-right font-semibold">
                        رقم الجلسة
                      </TableHead>
                      <TableHead className="text-right font-semibold">
                        المستودع
                      </TableHead>
                      <TableHead className="text-right font-semibold">
                        النوع
                      </TableHead>
                      <TableHead className="text-right font-semibold">
                        التاريخ
                      </TableHead>
                      <TableHead className="text-right font-semibold">
                        الحالة
                      </TableHead>
                      <TableHead className="text-right font-semibold">
                        عدد الأصناف
                      </TableHead>
                      <TableHead className="text-right font-semibold">
                        الفروقات
                      </TableHead>
                      <TableHead className="text-right font-semibold">
                        القيمة الإجمالية
                      </TableHead>
                      <TableHead className="text-right font-semibold">
                        إجراءات
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.isArray(filteredSessions) &&
                      filteredSessions.map((session) => (
                        <TableRow
                          key={session.id}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <TableCell className="font-medium">
                            {session.sessionNumber}
                          </TableCell>
                          <TableCell>
                            {session.warehouse?.name_ar || "غير محدد"}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                session.countType === "ذكي"
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {session.countType}
                            </Badge>
                          </TableCell>
                          <TableCell>{session.date}</TableCell>
                          <TableCell>
                            {getStatusBadge(session.status)}
                          </TableCell>
                          <TableCell>
                            <div className="text-center">
                              <div className="font-medium">
                                {session.itemsCount}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-center">
                              <div className="font-medium text-red-600">
                                {session.discrepanciesCount}
                              </div>
                              {session.discrepanciesCount > 0 && (
                                <div className="text-xs text-slate-500">
                                  يتطلب تسوية
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-center">
                              <div className="font-medium text-purple-600">
                                {session.totalValue.toLocaleString()} جنيه
                              </div>
                              {session.accuracy && (
                                <div className="text-xs text-slate-500">
                                  دقة: {session.accuracy}%
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1 rtl:space-x-reverse">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => viewSession(session)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => editSession(session)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handlePrintSession(session.id)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleDuplicateSession(session.id)
                                }
                              >
                                <PlusCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setItemToDelete(session.id);
                                  setShowDeleteDialog(true);
                                }}
                                className="text-red-600 hover:text-red-800"
                              >
                                <AlertTriangle className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="new-session">
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b">
              <CardTitle className="flex items-center">
                <PlusCircle className="h-5 w-5 ml-2 text-blue-600" />
                بدء جلسة جرد جديدة
              </CardTitle>
              <CardDescription>
                إعداد وإنشاء جلسة جرد جديدة مع إعدادات مرونة تراعي تعدد الفروع
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Panel - Basic Settings */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-800 flex items-center">
                      <Package className="h-5 w-5 ml-2 text-blue-600" />
                      الإعدادات الأساسية
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="warehouse">المستودع / الفرع *</Label>
                        <Select
                          value={newSessionData.warehouseId}
                          onValueChange={(value) =>
                            setNewSessionData({
                              ...newSessionData,
                              warehouseId: value,
                            })
                          }
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="اختر المستودع" />
                          </SelectTrigger>
                          <SelectContent className="bg-white z-50">
                          {Array.isArray(warehouses) &&
                               warehouses.map((warehouse: any) => (
                                <SelectItem
                                  key={warehouse.warehouse_id}
                                  value={warehouse.warehouse_id.toString()}
                                >
                                  {warehouse.name_ar}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="count-type">نوع الجرد *</Label>
                        <Select
                          value={newSessionData.countType}
                          onValueChange={(value) =>
                            setNewSessionData({
                              ...newSessionData,
                              countType: value,
                            })
                          }
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="اختر نوع الجرد" />
                          </SelectTrigger>
                          <SelectContent className="bg-white z-50">
                            <SelectItem value="دوري">دوري</SelectItem>
                            <SelectItem value="مستمر">مستمر</SelectItem>
                            <SelectItem value="مفاجئ">مفاجئ</SelectItem>
                            <SelectItem value="ذكي">ذكي (AI)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="start-date">تاريخ بدء الجرد</Label>
                      <Input
                        type="date"
                        className="mt-2"
                        defaultValue={new Date().toISOString().split("T")[0]}
                      />
                    </div>

                     <div>
                      <Label htmlFor="team-members">أعضاء فريق الجرد</Label>
                      <Select
                        onValueChange={(value) =>
                          setNewSessionData({
                            ...newSessionData,
                            teamMembers: [...newSessionData.teamMembers, value],
                          })
                        }
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="اختر أعضاء الفريق" />
                        </SelectTrigger>
                        <SelectContent className="bg-white z-50">
                          <SelectItem value="ahmed">أحمد السعيد</SelectItem>
                          <SelectItem value="fatima">فاطمة الزهراني</SelectItem>
                          <SelectItem value="mohamed">محمد العتيبي</SelectItem>
                          <SelectItem value="sara">سارة الأحمدي</SelectItem>
                          <SelectItem value="khalid">خالد المطيري</SelectItem>
                          <SelectItem value="ali">علي الشمري</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {newSessionData.teamMembers.map((member, index) => (
                          <Badge key={index} variant="secondary">
                            {member}
                          </Badge>
                        ))}
                      </div>

                    <div className="p-4 bg-slate-50 rounded-lg border space-y-3">
                      <h4 className="font-medium">مصادر الأصناف للجرد</h4>
                      <div className="grid grid-cols-2 md:grid-cols-2 gap-2 text-sm">
                        <label className="flex items-center gap-2"><input type="checkbox" checked={selectedItemTypes.products} onChange={(e)=>setSelectedItemTypes(v=>({...v,products:e.target.checked}))}/> منتجات</label>
                        <label className="flex items-center gap-2"><input type="checkbox" checked={selectedItemTypes.consumables} onChange={(e)=>setSelectedItemTypes(v=>({...v,consumables:e.target.checked}))}/> مستهلكات</label>
                      </div>
                      <div className="text-xs text-slate-600">
                        المستودع المحدد: {warehouses.find((w:any)=>String(w.warehouse_id)===newSessionData.warehouseId)?.name_ar || 'غير محدد'}
                      </div>
                      <div className="max-h-40 overflow-auto border rounded-md p-2 bg-white">
                        <div className="text-sm font-medium mb-2">أصناف هذا المستودع</div>
                        <ul className="space-y-1 text-sm">
                          {Array.isArray(selectedWarehouseInventory) && selectedWarehouseInventory.length>0 ? (
                            selectedWarehouseInventory.map((inv: any)=> (
                              <li key={inv.inventory_id || inv.product_id} className="flex items-center justify-between">
                                <span>{inv.product?.name_ar || inv.product?.name_en || inv.product_id}</span>
                                <span className="text-slate-500">رصيد: {inv.quantity || inv.current_stock || 0}</span>
                              </li>
                            ))
                          ) : (
                            <li className="text-slate-400">لا توجد أصناف مسجلة لهذا المستودع</li>
                          )}
                        </ul>
                      </div>
                      <div>
                        <Label className="text-sm">تحديد أكواد بعينها (اختياري)</Label>
                        <Input className="mt-2" placeholder="أدخل أكواد مفصولة بفواصل مثل: PRD-001,SRV-10" onBlur={(e)=>{
                          const codes = e.target.value.split(',').map(s=>s.trim()).filter(Boolean);
                          setSelectedItemCodes(codes);
                        }}/>
                      </div>
                    </div>
                    </div>

                    <div>
                      <Label htmlFor="notes">ملاحظات حول جلسة الجرد</Label>
                      <Textarea
                        placeholder="أدخل أي ملاحظات حول جلسة الجرد..."
                        className="mt-2 min-h-[100px]"
                        value={newSessionData.notes}
                        onChange={(e) =>
                          setNewSessionData({
                            ...newSessionData,
                            notes: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Right Panel - Advanced Settings */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-800 flex items-center">
                      <Brain className="h-5 w-5 ml-2 text-purple-600" />
                      الإعدادات المتقدمة
                    </h3>

                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between mb-3">
                        <Label className="text-sm font-medium">
                          تفعيل الذكاء الاصطناعي
                        </Label>
                        <Switch defaultChecked />
                      </div>
                      <p className="text-xs text-blue-600">
                        استخدام الذكاء الاصطناعي لتحليل الفروقات وتوليد التوصيات
                        تلقائياً
                      </p>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between mb-3">
                        <Label className="text-sm font-medium">
                          التحديث المباشر
                        </Label>
                        <Switch defaultChecked />
                      </div>
                      <p className="text-xs text-green-600">
                        تحديث البيانات في الوقت الفعلي أثناء عملية الجرد
                      </p>
                    </div>

                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="flex items-center justify-between mb-3">
                        <Label className="text-sm font-medium">
                          التنبيهات الذكية
                        </Label>
                        <Switch />
                      </div>
                      <p className="text-xs text-orange-600">
                        إرسال تنبيهات فورية عند اكتشاف فروقات كبيرة
                      </p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">نطاق الجرد</Label>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <input
                            type="radio"
                            name="scope"
                            id="full"
                            defaultChecked
                          />
                          <Label htmlFor="full" className="text-sm">
                            جرد شامل للمستودع
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <input type="radio" name="scope" id="partial" />
                          <Label htmlFor="partial" className="text-sm">
                            جرد جزئي (فئات محددة)
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <input type="radio" name="scope" id="sample" />
                          <Label htmlFor="sample" className="text-sm">
                            جرد عينة عشوائية
                          </Label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">
                        مستوى الأولوية
                      </Label>
                      <Select>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="اختر مستوى الأولوية" />
                        </SelectTrigger>
                        <SelectContent className="bg-white z-50">
                          <SelectItem value="urgent">عاجل</SelectItem>
                          <SelectItem value="high">عالي</SelectItem>
                          <SelectItem value="medium">متوسط</SelectItem>
                          <SelectItem value="low">منخفض</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Preview Panel */}
                  <div className="p-4 bg-slate-50 rounded-lg border">
                    <h4 className="font-medium text-slate-800 mb-3">
                      معاينة الجلسة
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">رقم الجلسة:</span>
                        <span className="font-medium">
                          ST-2024-
                          {String(
                            (Array.isArray(stockSessions)
                              ? stockSessions.length
                              : 0) + 1
                          ).padStart(3, "0")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">المستودع:</span>
                        <span className="font-medium">
                          {Array.isArray(warehouses)
                            ? warehouses.find(
                                (w) =>
                                  w.warehouse_id.toString() ===
                                  newSessionData.warehouseId
                              )?.name_ar || "غير محدد"
                            : "غير محدد"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">النوع:</span>
                        <span className="font-medium">
                          {newSessionData.countType || "غير محدد"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">أعضاء الفريق:</span>
                        <span className="font-medium">
                          {newSessionData.teamMembers.length || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">التاريخ:</span>
                        <span className="font-medium">
                          {new Date().toLocaleDateString("ar-SA")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between pt-6 border-t">
                <Button
                  variant="outline"
                  className="px-8"
                  onClick={handleExportItemsList}
                  disabled={isLoadingSessions}
                >
                  تصدير قائمة الأصناف
                </Button>
                <div className="flex space-x-3 rtl:space-x-reverse">
                  <Button
                    variant="outline"
                    className="px-8"
                    onClick={handleSaveAsDraft}
                  >
                    حفظ كمسودة
                  </Button>
                  <Button
                    onClick={startNewSession}
                    className="px-8 bg-blue-600 hover:bg-blue-700"
                    disabled={isLoadingSessions}
                  >
                    <PlusCircle className="h-4 w-4 ml-2" />
                    بدء جلسة الجرد
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results">
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 ml-2 text-purple-600" />
                  نتائج الجرد
                </CardTitle>
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <Badge variant="outline" className="px-3 py-1">
                    إجمال ومراجعة نتائج الجرد المخزني
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleImportResults}
                    disabled={isLoadingCountItems}
                  >
                    <Download className="h-4 w-4 ml-1" />
                    استيراد نتائج
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader className="sticky top-0 bg-white shadow-sm">
                    <TableRow>
                      <TableHead className="text-right font-semibold">
                        كود الصنف
                      </TableHead>
                      <TableHead className="text-right font-semibold">
                        اسم الصنف
                      </TableHead>
                      <TableHead className="text-right font-semibold">
                        الرصيد المفتري
                      </TableHead>
                      <TableHead className="text-right font-semibold">
                        الرصيد الفعلي
                      </TableHead>
                      <TableHead className="text-right font-semibold">
                        الفرق
                      </TableHead>
                      <TableHead className="text-right font-semibold">
                        النسبة المئوية
                      </TableHead>
                      <TableHead className="text-right font-semibold">
                        قيمة الفرق
                      </TableHead>
                      <TableHead className="text-right font-semibold">
                        الحالة
                      </TableHead>
                      <TableHead className="text-right font-semibold">
                        إجراءات
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => (
                      <TableRow
                        key={item.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <TableCell className="font-medium text-blue-600">
                          {item.itemCode}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{item.itemName}</div>
                          {item.category && (
                            <Badge variant="outline" className="mt-1 text-xs">
                              {item.category}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-center font-medium">
                          {item.bookStock}
                        </TableCell>
                        <TableCell className="text-center font-medium">
                          {item.physicalStock}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center">
                            {getVarianceIcon(item.variance)}
                            <span
                              className={`ml-1 font-bold ${
                                item.variance > 0
                                  ? "text-blue-600"
                                  : item.variance < 0
                                  ? "text-red-600"
                                  : "text-green-600"
                              }`}
                            >
                              {item.variance > 0 ? "+" : ""}
                              {item.variance}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <span
                              className={`font-medium ${
                                Number(item.variancePercentage) > 0
                                  ? "text-blue-600"
                                  : Number(item.variancePercentage) < 0
                                  ? "text-red-600"
                                  : "text-green-600"
                              }`}
                            >
                              {Number(item.variancePercentage) > 0 ? "+" : ""}
                              {(Number(item.variancePercentage) || 0).toFixed(1)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <span
                              className={`font-bold ${
                                item.totalVarianceValue > 0
                                  ? "text-blue-600"
                                  : item.totalVarianceValue < 0
                                  ? "text-red-600"
                                  : "text-green-600"
                              }`}
                            >
                              {item.totalVarianceValue > 0 ? "+" : ""}
                              {item.totalVarianceValue.toLocaleString()} جنيه
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center">
                            {getStatusBadge(item.status)}
                            {item.status === "فرق سالب" && (
                              <AlertTriangle className="h-4 w-4 text-red-500 mr-1" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1 rtl:space-x-reverse">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => viewItemDetails(item)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => viewItemDetails(item)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>

              {/* Results Summary */}
              <div className="p-6 border-t bg-slate-50">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-800">
                      {countItems.length}
                    </div>
                    <div className="text-sm text-slate-600">إجمالي الأصناف</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {
                        countItems.filter((item) => item.status === "مطابق")
                          .length
                      }
                    </div>
                    <div className="text-sm text-slate-600">أصناف مطابقة</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {
                        countItems.filter((item) => item.status === "فرق سالب")
                          .length
                      }
                    </div>
                    <div className="text-sm text-slate-600">فروقات سالبة</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {
                        countItems.filter((item) => item.status === "فرق موجب")
                          .length
                      }
                    </div>
                    <div className="text-sm text-slate-600">فروقات موجبة</div>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <div className="text-lg font-semibold text-slate-800 mb-2">
                    القيمة الإجمالية للفروقات
                  </div>
                  <div
                    className={`text-3xl font-bold ${
                      countItems.reduce(
                        (sum, item) => sum + item.totalVarianceValue,
                        0
                      ) >= 0
                        ? "text-blue-600"
                        : "text-red-600"
                    }`}
                  >
                    {countItems.reduce(
                      (sum, item) => sum + item.totalVarianceValue,
                      0
                    ) > 0
                      ? "+"
                      : ""}
                    {countItems
                      .reduce((sum, item) => sum + item.totalVarianceValue, 0)
                      .toLocaleString()}{" "}
                    جنيه
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="adjustments">
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 ml-2 text-blue-600" />
                    التسويات الجردية
                  </CardTitle>
                  <CardDescription className="mt-1">
                    مراجعة واعتماد التسويات الجردية
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportAdjustments}
                  >
                    <Download className="h-4 w-4 ml-1" />
                    تصدير التسويات
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-6">
                <div className="relative max-w-md">
                  <Search className="absolute right-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="البحث في التسويات..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead className="text-right font-semibold">
                        رقم التسوية
                      </TableHead>
                      <TableHead className="text-right font-semibold">
                        التاريخ
                      </TableHead>
                      <TableHead className="text-right font-semibold">
                        النوع
                      </TableHead>
                      <TableHead className="text-right font-semibold">
                        كود الصنف
                      </TableHead>
                      <TableHead className="text-right font-semibold">
                        اسم الصنف
                      </TableHead>
                      <TableHead className="text-right font-semibold">
                        الكمية المسموح
                      </TableHead>
                      <TableHead className="text-right font-semibold">
                        القيمة المسموح
                      </TableHead>

                      <TableHead className="text-right font-semibold">
                        الحالة
                      </TableHead>
                      <TableHead className="text-right font-semibold">
                        الإجراءات
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.isArray(filteredAdjustments) &&
                      filteredAdjustments.map((adjustment) => (
                        <TableRow
                          key={adjustment.id}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <TableCell className="font-medium text-blue-600">
                            {adjustment.adjustmentNumber}
                          </TableCell>
                          <TableCell>
                            {new Date(adjustment.createdAt).toLocaleDateString(
                              "ar-SA"
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                adjustment.adjustmentType === "أقفل"
                                  ? "destructive"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {adjustment.adjustmentType}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            {adjustment.itemCode}
                          </TableCell>
                          <TableCell>{adjustment.itemName}</TableCell>
                          <TableCell>
                            <span
                              className={`font-medium ${
                                adjustment.quantity > 0
                                  ? "text-blue-600"
                                  : "text-red-600"
                              }`}
                            >
                              {adjustment.quantity > 0 ? "+" : ""}
                              {adjustment.quantity}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`font-bold ${
                                adjustment.value > 0
                                  ? "text-blue-600"
                                  : "text-red-600"
                              }`}
                            >
                              {adjustment.value > 0 ? "+" : ""}
                              {adjustment.value.toLocaleString()} جنيه
                            </span>
                          </TableCell>

                          <TableCell>
                            {getStatusBadge(adjustment.status)}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1 rtl:space-x-reverse">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewAdjustment(adjustment)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {adjustment.status !== "معتمد" && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleEditAdjustment(adjustment)
                                    }
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleApproveAdjustment(adjustment.id)
                                    }
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {Array.isArray(adjustments) ? adjustments.length : 0}
                    </div>
                    <div className="text-sm text-blue-700">إجمالي التسويات</div>
                  </div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {Array.isArray(adjustments)
                        ? adjustments.filter((a) => a.status === "معتمد").length
                        : 0}
                    </div>
                    <div className="text-sm text-green-700">معتمدة</div>
                  </div>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {Array.isArray(adjustments)
                        ? adjustments.filter((a) => a.status === "معلقة").length
                        : 0}
                    </div>
                    <div className="text-sm text-orange-700">معلقة</div>
                  </div>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {Array.isArray(adjustments)
                        ? adjustments.filter((a) => a.status === "قيد المراجعة")
                            .length
                        : 0}
                    </div>
                    <div className="text-sm text-yellow-700">قيد المراجعة</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-6 bg-slate-50 rounded-lg border">
                <div className="text-center">
                  <div className="text-lg font-semibold text-slate-800 mb-2">
                    إجمالي قيمة التسويات
                  </div>
                  <div
                    className={`text-3xl font-bold ${
                      Array.isArray(adjustments) &&
                      adjustments.reduce((sum, adj) => sum + adj.value, 0) >= 0
                        ? "text-blue-600"
                        : "text-red-600"
                    }`}
                  >
                    {Array.isArray(adjustments)
                      ? adjustments
                          .reduce((sum, adj) => sum + adj.value, 0)
                          .toLocaleString()
                      : "0"}{" "}
                    جنيه
                  </div>
                  <div className="text-sm text-slate-600 mt-1">
                    صافي قيمة التسويات الجردية
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Session Details Dialog */}
      <Dialog open={showSessionDialog} onOpenChange={setShowSessionDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>تفاصيل جلسة الجرد</DialogTitle>
            <DialogDescription>
              {selectedSession
                ? `جلسة رقم ${selectedSession.sessionNumber}`
                : ""}
            </DialogDescription>
          </DialogHeader>
          {selectedSession && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>رقم الجلسة</Label>
                  <Input value={selectedSession.sessionNumber} readOnly />
                </div>
                <div>
                  <Label>المستودع</Label>
                  <Input
                    value={selectedSession?.warehouse?.name_ar || "غير محدد"}
                    readOnly
                  />
                </div>
                <div>
                  <Label>نوع الجرد</Label>
                  <Input value={selectedSession.countType} readOnly />
                </div>
                <div>
                  <Label>التاريخ</Label>
                  <Input value={selectedSession.date} readOnly />
                </div>
                <div>
                  <Label>عدد الأصناف</Label>
                  <Input
                    value={selectedSession.itemsCount.toString()}
                    readOnly
                  />
                </div>
                <div>
                  <Label>الفروقات</Label>
                  <Input
                    value={selectedSession.discrepanciesCount.toString()}
                    readOnly
                  />
                </div>
              </div>
              <div>
                <Label>الملاحظات</Label>
                <Textarea value={selectedSession.notes || ""} readOnly />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowSessionDialog(false)}
            >
              إغلاق
            </Button>
            <Button
              onClick={() => {
                setShowSessionDialog(false);
                if (selectedSession) editSession(selectedSession);
              }}
            >
              تعديل
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={showEditItemDialog} onOpenChange={setShowEditItemDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تعديل الصنف</DialogTitle>
            <DialogDescription>
              {selectedItem ? selectedItem.itemName : ""}
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>كود الصنف</Label>
                  <Input value={selectedItem.itemCode} readOnly />
                </div>
                <div>
                  <Label>الرصيد النظري</Label>
                  <Input value={selectedItem.bookStock.toString()} readOnly />
                </div>
              </div>
              <div>
                <Label>الرصيد الفعلي</Label>
                <Input
                  type="number"
                  value={editedPhysicalStock}
                  onChange={(e) => setEditedPhysicalStock(e.target.value)}
                  placeholder="أدخل الرصيد الفعلي"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowEditItemDialog(false);
                setSelectedItem(null);
                setEditedPhysicalStock("");
              }}
            >
              إلغاء
            </Button>
            <Button onClick={handleUpdateItem}>حفظ التغييرات</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف هذه الجلسة؟ هذا الإجراء لا يمكن التراجع عنه.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setShowDeleteDialog(false);
                setItemToDelete(null);
              }}
            >
              إلغاء
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSession}
              className="bg-red-600 hover:bg-red-700"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Adjustment Details Dialog */}
      <Dialog
        open={showAdjustmentDialog}
        onOpenChange={setShowAdjustmentDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تفاصيل التسوية</DialogTitle>
            <DialogDescription>
              {selectedAdjustment
                ? `تسوية رقم ${selectedAdjustment.adjustmentNumber}`
                : ""}
            </DialogDescription>
          </DialogHeader>
          {selectedAdjustment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>رقم التسوية</Label>
                  <Input value={selectedAdjustment.adjustmentNumber} readOnly />
                </div>
                <div>
                  <Label>كود الصنف</Label>
                  <Input value={selectedAdjustment.itemCode} readOnly />
                </div>
                <div>
                  <Label>اسم الصنف</Label>
                  <Input value={selectedAdjustment.itemName} readOnly />
                </div>
                <div>
                  <Label>نوع التسوية</Label>
                  <Input value={selectedAdjustment.adjustmentType} readOnly />
                </div>
                <div>
                  <Label>الكمية</Label>
                  <Input value={selectedAdjustment.quantity} readOnly />
                </div>
                <div>
                  <Label>القيمة</Label>
                  <Input
                    value={selectedAdjustment.value.toLocaleString() + " جنيه"}
                    readOnly
                  />
                </div>

              </div>
              <div>
                <Label>السبب</Label>
                <Textarea value={selectedAdjustment.reason || ""} readOnly />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAdjustmentDialog(false)}
            >
              إغلاق
            </Button>
            {selectedAdjustment?.status !== "معتمد" && (
              <Button
                onClick={() => {
                  handleApproveAdjustment(selectedAdjustment.id);
                  setShowAdjustmentDialog(false);
                }}
              >
                اعتماد التسوية
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Live Counting Interface */}
      <Dialog
        open={showCountingInterface}
        onOpenChange={setShowCountingInterface}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Package className="h-5 w-5 ml-2 text-blue-600" />
              جلسة الجرد النشطة
            </DialogTitle>
              <DialogDescription>
                {currentCountingSession
                  ? `جلسة رقم ${currentCountingSession.sessionNumber} - ${currentCountingSession.warehouse?.name_ar || ''}`
                  : ""}
              </DialogDescription>
          </DialogHeader>

          {currentCountingSession && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">
                    {currentCountingSession.sessionNumber}
                  </div>
                  <div className="text-sm text-blue-700">رقم الجلسة</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">
                    {currentCountingSession?.warehouse?.name_ar || warehouses.find((w:any)=>w.warehouse_id===currentCountingSession?.warehouseId)?.name_ar || "غير محدد"}
                  </div>
                  <div className="text-sm text-blue-700">المستودع</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">
                    {currentCountingSession.countType}
                  </div>
                  <div className="text-sm text-blue-700">نوع الجرد</div>
                </div>
              </div>

              <div className="border rounded-lg">
                <div className="p-4 bg-slate-50 border-b">
                  <h3 className="font-semibold">الأصناف المطلوب جردها</h3>
                </div>
                <div className="space-y-2 p-4">
                  {(() => {
                    const itemsToShow = Array.isArray(liveCountItems) && liveCountItems.length > 0 
                      ? liveCountItems 
                      : Array.isArray(countItems) && countItems.length > 0 
                      ? countItems 
                      : [];
                    
                    console.log("🔍 الأصناف المعروضة:", {
                      liveCountItems: liveCountItems.length,
                      countItems: countItems.length,
                      itemsToShow: itemsToShow.length,
                    });
                    
                    if (itemsToShow.length === 0) {
                      return (
                        <div className="text-center py-8 text-slate-500">
                          <Package className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                          <p className="text-lg font-medium">لا توجد أصناف للجرد</p>
                          <p className="text-sm">يتم إنشاء الأصناف تلقائياً عند بدء الجلسة</p>
                        </div>
                      );
                    }
                    
                    return itemsToShow.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 border rounded-lg bg-white"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{item.itemName}</div>
                        <div className="text-sm text-slate-600">
                          {item.itemCode} - {item.location}
                        </div>
                        <div className="text-sm text-slate-500">
                          رصيد نظري: {item.bookStock}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <div className="text-center">
                          <Label className="text-xs">الرصيد الفعلي</Label>
                          <Input
                            type="number"
                            className="w-20 text-center"
                            defaultValue={item.physicalStock}
                            onChange={async (e) => {
                              const newValue = parseInt(e.target.value) || 0;
                              const variance = newValue - item.bookStock;
                              const variancePercentage = item.bookStock
                                ? (variance / item.bookStock) * 100
                                : 0;
                              const totalVarianceValue =
                                variance * item.unitCost;

                              try {
                                // تحديث الصنف في جدول الجرد فقط
                                // لا نحدث كمية المنتج الفعلية إلا بعد اعتماد التسوية
                                await updateCountItem({
                                  id: item.id,
                                  itemData: {
                                    physicalStock: newValue,
                                    variance,
                                    variancePercentage,
                                    totalVarianceValue,
                                    status:
                                      variance === 0
                                        ? "مطابق"
                                        : variance > 0
                                        ? "فرق موجب"
                                        : "فرق سالب",
                                  },
                                }).unwrap();

                                // لا نحدث الكمية الفعلية الآن
                                // سيتم تحديثها عند اعتماد التسوية

                                // التسويات سيتم إنشاؤها تلقائياً عند إكمال الجلسة
                              } catch (error: any) {
                                console.error("خطأ في تحديث الصنف:", error);
                                toast({
                                  title: "خطأ",
                                  description: "فشل في تحديث الصنف",
                                  variant: "destructive",
                                });
                              }
                            }}
                          />
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-slate-600">الفرق</div>
                          <div
                            className={`font-bold ${
                              item.variance > 0
                                ? "text-blue-600"
                                : item.variance < 0
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          >
                            {item.variance > 0 ? "+" : ""}
                            {item.variance}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant={
                            item.physicalStock === item.bookStock
                              ? "default"
                              : "secondary"
                          }
                        >
                          {item.physicalStock === item.bookStock
                            ? "مطابق"
                            : "فرق"}
                        </Button>
                      </div>
                    </div>
                  ));
                  })()}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg text-center">
                  <div className="text-lg font-bold text-blue-600">
                    {countItems.length}
                  </div>
                  <div className="text-xs text-blue-700">إجمالي الأصناف</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg text-center">
                  <div className="text-lg font-bold text-green-600">
                    {countItems.filter((item) => item.variance === 0).length}
                  </div>
                  <div className="text-xs text-green-700">مطابقة</div>
                </div>
                <div className="p-3 bg-red-50 rounded-lg text-center">
                  <div className="text-lg font-bold text-red-600">
                    {countItems.filter((item) => item.variance < 0).length}
                  </div>
                  <div className="text-xs text-red-700">فروقات سالبة</div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg text-center">
                  <div className="text-lg font-bold text-blue-600">
                    {countItems.filter((item) => item.variance > 0).length}
                  </div>
                  <div className="text-xs text-blue-700">فروقات موجبة</div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border">
                <h4 className="font-medium text-slate-800 mb-3">ملخص الجرد</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-slate-600">
                      إجمالي الأصناف المجردة
                    </div>
                    <div className="text-lg font-bold text-slate-800">
                      {countItems.length}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600">نسبة الإكمال</div>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={
                          (countItems.length /
                            (currentCountingSession.itemsCount || 1)) *
                          100
                        }
                        className="w-32"
                      />
                      <span className="text-sm font-medium">
                        {(
                          (countItems.length /
                            (currentCountingSession.itemsCount || 1)) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600">
                      إجمالي قيمة الفروقات
                    </div>
                    <div
                      className={`text-lg font-bold ${
                        countItems.reduce(
                          (sum, item) => sum + item.totalVarianceValue,
                          0
                        ) >= 0
                          ? "text-blue-600"
                          : "text-red-600"
                      }`}
                    >
                      {countItems.reduce(
                        (sum, item) => sum + item.totalVarianceValue,
                        0
                      ) > 0
                        ? "+"
                        : ""}
                      {countItems
                        .reduce((sum, item) => sum + item.totalVarianceValue, 0)
                        .toLocaleString()}{" "}
                      جنيه
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600">دقة الجرد</div>
                    <div className="text-lg font-bold text-green-600">
                      {enhancedStatistics.averageAccuracy.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCountingInterface(false);
                    handleSaveAsDraft();
                  }}
                >
                  حفظ وإغلاق
                </Button>
                <div className="flex space-x-3 rtl:space-x-reverse">
                  <Button
                    variant="outline"
                    onClick={handleExportItemsList}
                    disabled={isLoadingCountItems}
                  >
                    <Download className="h-4 w-4 ml-1" />
                    تصدير النتائج
                  </Button>
                  <Button
                    onClick={async () => {
                      try {
                        console.log("🔍 بداية إكمال الجلسة:", {
                          currentCountingSession,
                          sessionStatus: currentCountingSession?.status,
                          liveCountItems: liveCountItems.length,
                          countItems: countItems.length
                        });

                        // إنشاء التسويات فقط عند إكمال الجلسة
                        if (currentCountingSession && currentCountingSession.status !== "مكتمل") {
                          const itemsForAdjustments = (Array.isArray(liveCountItems) && liveCountItems.length > 0)
                            ? liveCountItems
                            : countItems;
                          
                          console.log("📦 الأصناف المستخدمة للتسويات:", itemsForAdjustments);
                          
                          const itemsWithVariance = Array.isArray(itemsForAdjustments)
                            ? itemsForAdjustments.filter((it: any) => Number(it.variance) !== 0)
                            : [];

                          console.log("📋 إنشاء التسويات:", {
                            sessionId: currentCountingSession.id,
                            sessionStatus: currentCountingSession.status,
                            totalItems: itemsForAdjustments.length,
                            itemsWithVariance: itemsWithVariance.length,
                            items: itemsWithVariance.map((it: any) => ({
                              code: it.itemCode,
                              name: it.itemName,
                              variance: it.variance,
                              value: it.totalVarianceValue
                            }))
                          });

                          // إنشاء تسوية لكل صنف له فرق (بدون تحقق من التسويات الموجودة)
                          let createdCount = 0;
                          for (const it of itemsWithVariance) {
                            try {
                              const variance = Number(it.variance) || 0;
                              const totalVarianceValue = Number(it.totalVarianceValue) || 0;
                              
                              // تجنب إنشاء تسوية إذا كانت القيم صفر
                              if (variance === 0) {
                                console.log(`⏭️ تخطي ${it.itemCode} - الفرق = 0`);
                                continue;
                              }
                              
                              const adjType = variance > 0 ? "زائد" : "أقفل";
                              const qty = Math.abs(Math.round(variance)); // تحويل إلى Integer
                              const val = Math.abs(totalVarianceValue);

                              console.log(`✅ إنشاء تسوية:`, {
                                itemCode: it.itemCode,
                                itemName: it.itemName,
                                adjustmentType: adjType,
                                quantity: qty,
                                value: val,
                                sessionId: currentCountingSession.id
                              });

                              await createAdjustment({
                                stockCountSessionId: currentCountingSession.id,
                                itemCode: String(it.itemCode),
                                itemName: String(it.itemName),
                                adjustmentType: adjType,
                                quantity: qty,
                                value: val,
                                reason: it.reason || "تسوية ناتجة عن فروقات الجرد",
                              }).unwrap();
                              
                              createdCount++;
                              console.log(`✅ تم إنشاء التسوية بنجاح`);
                            } catch (error: any) {
                              console.error(`❌ خطأ في إنشاء تسوية ${it.itemCode}:`, {
                                error: error,
                                data: error?.data,
                                message: error?.message
                              });
                            }
                          }

                          console.log(`✅ تم إنشاء ${createdCount} تسوية من أصل ${itemsWithVariance.length} صنف بفروقات`);
                        }

                        await updateSession({
                          id: currentCountingSession.id,
                          sessionData: {
                            ...currentCountingSession,
                            status: "مكتمل",
                          },
                        }).unwrap();
                        toast({
                          title: "تم إكمال الجلسة",
                          description: `تم إكمال جلسة الجرد رقم ${currentCountingSession.sessionNumber} وتم إنشاء التسويات للفروقات`,
                        });
                        setShowCountingInterface(false);
                        setCurrentCountingSession(null);
                        setActiveTab("adjustments");
                      } catch (error: any) {
                        console.error("❌ خطأ في إكمال الجلسة:", error);
                        toast({
                          title: "خطأ",
                          description: "فشل في إكمال جلسة الجرد",
                          variant: "destructive",
                        });
                      }
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 ml-2" />
                    إكمال الجرد
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StockTaking;