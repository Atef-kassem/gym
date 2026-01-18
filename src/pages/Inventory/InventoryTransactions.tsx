import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Search, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  ArrowRightLeft,
  Calendar,
  User,
  Package,
  Edit,
  Eye,
  MoreVertical,
  Filter,
  Save,
  Trash2,
  Upload,
  Scan,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle,
  Clock,
  X,
  XCircle,
  ArrowLeft,
  Settings,
  Building2,
  Warehouse,
  Activity,
  BarChart3,
  Download,
  Printer,
  RefreshCw
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useBranch } from '@/contexts/BranchContext';
import { useBranchData } from '@/hooks/useBranchData';
import { usePurchaseReturns } from '@/hooks/usePurchaseReturns';
import {
  useGetAllTransactionsQuery,
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
  useApproveTransactionMutation,
  useGetTransactionStatsQuery,
  useGetTransactionTypesQuery,
  useGetUnitsQuery,
  useGetWarehousesByBranchQuery,
  useGetUsersQuery
} from '@/services/inventoryTransactionsApi';
import { useGetAllProductsQuery } from '@/services/productApi';
import { useGetAllWarehousesQuery } from '@/services/warehouseApi';
import { useUpdateStockMutation } from '@/services/inventoryApi';

// Types
interface TransactionItem {
  id: string;
  itemCode: string;
  itemName: string;
  quantity: number;
  unit: string;
  price?: number;
  total?: number;
  notes?: string;
  productId?: string;
}

interface Transaction {
  id: string;
  type: string;
  date: string;
  time: string;
  sourceWarehouse: string; // sourceWarehouseId من قاعدة البيانات
  sourceWarehouseName?: string;
  targetWarehouse?: string; // targetWarehouseId من قاعدة البيانات
  targetWarehouseName?: string;
  reference: string;
  user: string;
  status: "approved" | "rejected" | "draft" | "معتمدة" | "غير معتمدة" | "مسودة";
  items: TransactionItem[];
  notes?: string;
  attachments?: string[];
  reason?: string;
  branchId: string;
  branchName: string;
}

const InventoryTransactions = () => {
  const { toast } = useToast();
  const { selectedBranch } = useBranch();
  const { 
    purchaseOrders,
    goodsReceipts 
  } = usePurchaseReturns();
  const [activeTab, setActiveTab] = useState("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [warehouseFilter, setWarehouseFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [branchFilter, setBranchFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [userFilter, setUserFilter] = useState("all");
  
  // حالة مودال عرض التفاصيل
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  // حالة التعديل
  const [isEditing, setIsEditing] = useState(false);
  const [editingTransactionId, setEditingTransactionId] = useState<string | null>(null);

  // استخدام Context الفروع
  const { branches, getActiveBranches } = useBranch();
  const { getWarehousesByBranch, getBranchStats, canPerformAction } = useBranchData();

  // جلب البيانات من API
  const { 
    data: transactionsData, 
    isLoading: isLoadingTransactions, 
    error: transactionsError,
    refetch: refetchTransactions 
  } = useGetAllTransactionsQuery({
    branchId: selectedBranch?.id,
    type: typeFilter !== "all" ? typeFilter : undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
    warehouseId: warehouseFilter !== "all" ? warehouseFilter : undefined,
    userId: userFilter !== "all" ? userFilter : undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    search: searchTerm || undefined,
  });

  const { 
    data: statsData, 
    error: statsError 
  } = useGetTransactionStatsQuery({
    branchId: selectedBranch?.id,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
  });

  const { 
    data: transactionTypesData, 
    error: typesError 
  } = useGetTransactionTypesQuery();
  
  const { 
    data: unitsData, 
    error: unitsError 
  } = useGetUnitsQuery();
  
  const { 
    data: usersData, 
    error: usersError 
  } = useGetUsersQuery();

  const { 
    data: warehousesData, 
    isLoading: isLoadingWarehouses,
    error: warehousesError 
  } = useGetAllWarehousesQuery();

  // جلب جميع المنتجات بدون فلترة
  const { 
    data: allProductsData, 
    refetch: refetchAllProducts,
    isLoading: isLoadingProducts,
    error: productsError
  } = useGetAllProductsQuery();

  // تشخيص API
  useEffect(() => {
    console.log('🔍 تشخيص API المنتجات:', {
      allProductsData,
      isLoadingProducts,
      productsError,
      productsCount: allProductsData?.data?.products?.length || allProductsData?.products?.length || 0,
      hasData: !!allProductsData,
      dataKeys: allProductsData ? Object.keys(allProductsData) : [],
      timestamp: new Date().toISOString(),
      // إضافة تشخيص إضافي
      apiUrl: 'https://metagym.metacodecx.com/api/v1/products',
      errorDetails: productsError ? {
        status: (productsError as any)?.status,
        message: (productsError as any)?.data?.message,
        originalError: productsError
      } : null
    });
    
    // تشخيص إضافي للبيانات
    if (allProductsData) {
      console.log('📊 تفاصيل البيانات:', {
        dataType: typeof allProductsData,
        isArray: Array.isArray(allProductsData),
        hasProducts: !!(allProductsData.data?.products || allProductsData.products),
        productsType: typeof (allProductsData.data?.products || allProductsData.products),
        productsIsArray: Array.isArray(allProductsData.data?.products || allProductsData.products),
        firstProduct: (allProductsData.data?.products || allProductsData.products)?.[0] || 'لا توجد منتجات',
        dataStructure: {
          hasData: !!allProductsData.data,
          dataKeys: allProductsData.data ? Object.keys(allProductsData.data) : [],
          productsPath: 'allProductsData.data.products'
        }
      });
    }

    // تشخيص الأخطاء
    if (productsError) {
      console.error('❌ خطأ في جلب المنتجات:', {
        status: (productsError as any)?.status,
        message: (productsError as any)?.data?.message,
        originalError: productsError,
        suggestion: 'تأكد من أن الخادم الخلفي يعمل على المنفذ 4000'
      });
    }
  }, [allProductsData, isLoadingProducts, productsError]);

  // استخدام جميع المنتجات بدون فلترة حسب المستودع
  const allAvailableProducts = useMemo(() => {
    console.log('🔍 جلب جميع المنتجات:', {
      hasAllProductsData: !!allProductsData,
      hasProducts: !!(allProductsData?.data?.products || allProductsData?.products),
      productsLength: (allProductsData?.data?.products || allProductsData?.products)?.length || 0
    });
    
    if (!allProductsData) {
      console.log('❌ لا توجد بيانات منتجات');
      return [];
    }
    
    // جلب جميع المنتجات بدون فلترة
    const products = allProductsData.data?.products || allProductsData.products || [];
    
    console.log('🎯 جميع المنتجات المتاحة:', products.length);
    console.log('📊 تفاصيل المنتجات:', {
      totalProducts: products.length,
      firstProduct: products[0] || 'لا توجد منتجات'
    });
    
    return products;
  }, [allProductsData]);

  // إزالة المتغيرات المتعلقة بفلترة المستودعات
  const [searchTermForProducts, setSearchTermForProducts] = useState("");
  const [showProductsList, setShowProductsList] = useState(false);

  // New transaction form state
  const [newTransaction, setNewTransaction] = useState<Partial<Transaction>>({
    type: "",
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('en-GB', { hour12: false }).slice(0, 5),
    sourceWarehouse: "",
    targetWarehouse: "",
    reference: "",
    user: "المستخدم الحالي",
    status: "مسودة",
    items: [],
    notes: "",
    reason: "",
    branchId: selectedBranch?.id || "",
    branchName: selectedBranch?.name || ""
  });

  // API Mutations
  const [createTransaction, { isLoading: isCreating }] = useCreateTransactionMutation();
  const [updateTransaction, { isLoading: isUpdating }] = useUpdateTransactionMutation();
  const [deleteTransaction, { isLoading: isDeleting }] = useDeleteTransactionMutation();
  const [approveTransaction, { isLoading: isApproving }] = useApproveTransactionMutation();
  const [updateStock, { isLoading: isUpdatingStock, error: updateStockError }] = useUpdateStockMutation();

  // تشخيص updateStock
  useEffect(() => {
    console.log('🔍 تشخيص updateStock:', {
      isLoading: isUpdatingStock,
      error: updateStockError,
      mutation: updateStock,
      timestamp: new Date().toISOString()
    });
  }, [isUpdatingStock, updateStockError, updateStock]);

  // البيانات تأتي من API
  const transactions = transactionsData?.data?.transactions || transactionsData?.transactions || [];
  
  
  const transactionTypes = transactionTypesData?.data?.types || transactionTypesData?.types || [
    { value: "استلام", label: "استلام / توريد", icon: TrendingUp, color: "text-green-600" },
    { value: "صرف", label: "صرف / إخراج", icon: TrendingDown, color: "text-red-600" },
    { value: "تحويل", label: "تحويل بين المستودعات", icon: ArrowRightLeft, color: "text-blue-600" },
    { value: "جرد", label: "جرد وتعديل", icon: Package, color: "text-purple-600" },
    { value: "إتلاف", label: "إتلاف / شطب", icon: Trash2, color: "text-orange-600" },
    { value: "مرتجع مشتريات", label: "مرتجع مشتريات", icon: ArrowLeft, color: "text-indigo-600" },
    { value: "مرتجع مبيعات", label: "مرتجع مبيعات", icon: ArrowRightLeft, color: "text-teal-600" }
  ];
  const units = unitsData?.data?.units || unitsData?.units || ["  ", "لتر", "كيلو", "عبوة", "متر", "صندوق", "كرتون"];
  const users = usersData?.data?.users || usersData?.users || [];

  // استخدام المستودعات من API أو من Context كبديل
  const warehousesDataFromAPI = warehousesData?.warehouses || warehousesData?.data || warehousesData;
  const warehousesFromContext = getWarehousesByBranch(selectedBranch?.id || "main");
  const warehouses = Array.isArray(warehousesDataFromAPI) ? warehousesDataFromAPI : 
                   Array.isArray(warehousesFromContext) ? warehousesFromContext : [];

  const [newItem, setNewItem] = useState<Partial<TransactionItem>>({
    itemCode: "",
    itemName: "",
    quantity: 0,
    unit: "",
    price: 0,
    notes: "",
    productId: ""
  });

  // إحصائيات الفروع
  const branchStats = getBranchStats();

  // استخدام البيانات الحقيقية من API فقط
  const allTransactions = transactions;

  const filteredTransactions = allTransactions.filter((transaction: Transaction) => {
    const matchesSearch = transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.branchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.items.some((item: TransactionItem) => 
                           item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.itemCode.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    const matchesType = typeFilter === "all" || transaction.type === typeFilter;
    const matchesWarehouse = warehouseFilter === "all" || 
                            transaction.sourceWarehouse.includes(warehouseFilter) ||
                            (transaction.targetWarehouse && transaction.targetWarehouse.includes(warehouseFilter));
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter;
    const matchesBranch = branchFilter === "all" || transaction.branchId === branchFilter;
    const matchesUser = userFilter === "all" || transaction.user === userFilter;
    
    return matchesSearch && matchesType && matchesWarehouse && matchesStatus && matchesBranch && matchesUser;
  });

  const getTypeColor = (type: string) => {
    const typeConfig = transactionTypes.find((t: any) => t.value === type);
    return typeConfig?.color || "text-gray-600";
  };

  const getTypeIcon = (type: string) => {
    const typeConfig = transactionTypes.find((t: any) => t.value === type);
    const IconComponent = typeConfig?.icon || Package;
    return <IconComponent className="w-4 h-4" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
      case "معتمدة":
        return "bg-green-50 text-green-700 border-green-200";
      case "rejected":
      case "غير معتمدة":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "draft":
      case "مسودة":
        return "bg-gray-50 text-gray-700 border-gray-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "معتمدة";
      case "rejected":
        return "غير معتمدة";
      case "draft":
      case "مسودة":
        return "مسودة";
      default:
        return status;
    }
  };

  const addItemToTransaction = () => {
    if (!newItem.itemCode || !newItem.itemName || !newItem.quantity) {
      toast({
        title: "خطأ في الإدخال",
        description: "يرجى تعبئة جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    // التحقق من أن الصنف لم يتم إضافته من قبل
    const existingItem = newTransaction.items?.find(item => 
      item.itemCode === newItem.itemCode || item.productId === newItem.productId
    );
    
    if (existingItem) {
      toast({
        title: "صنف موجود مسبقاً",
        description: "هذا الصنف تم إضافته مسبقاً في الحركة",
        variant: "destructive"
      });
      return;
    }

    const item: TransactionItem = {
      id: Date.now().toString(),
      itemCode: newItem.itemCode!,
      itemName: newItem.itemName!,
      quantity: newItem.quantity!,
      unit: newItem.unit || "  ",
      price: newItem.price || 0,
      total: (newItem.quantity! * (newItem.price || 0)),
      notes: newItem.notes || "",
      productId: newItem.productId
    };

    setNewTransaction(prev => ({
      ...prev,
      items: [...(prev.items || []), item]
    }));

    // إعادة تعيين النموذج
    setNewItem({
      itemCode: "",
      itemName: "",
      quantity: 0,
      unit: "",
      price: 0,
      notes: "",
      productId: ""
    });
    
    // مسح البحث وحالة العرض
    setSearchTermForProducts("");
    setShowProductsList(false);
    
    toast({
      title: "تم إضافة الصنف",
      description: `تم إضافة ${item.itemName} بنجاح`,
    });
  };

  const removeItemFromTransaction = (itemId: string) => {
    setNewTransaction(prev => ({
      ...prev,
      items: prev.items?.filter((item: TransactionItem) => item.id !== itemId) || []
    }));
  };

  const saveTransaction = async () => {
    // تحديد نوع الحركة
    const isReceivingTransaction = newTransaction.type === "استلام" || newTransaction.type === "توريد" || newTransaction.type === "مرتجع مشتريات";
    const isExportTransaction = newTransaction.type === "صرف" || newTransaction.type === "إخراج" || newTransaction.type === "إتلاف" || newTransaction.type === "شطب" || newTransaction.type === "مرتجع مبيعات" || newTransaction.type === "جرد" || newTransaction.type === "تعديل";
    const isTransferTransaction = newTransaction.type === "تحويل";

    // فحص البيانات المطلوبة
    if (!newTransaction.type || !newTransaction.items?.length) {
      toast({
        title: "خطأ في الحفظ",
        description: "يرجى تعبئة جميع الحقول المطلوبة وإضافة صنف واحد على الأقل",
        variant: "destructive"
      });
      return;
    }

    if (!newTransaction.branchId) {
      toast({
        title: "خطأ في الحفظ",
        description: "يرجى تحديد الفرع",
        variant: "destructive"
      });
      return;
    }

    // فحص المستودعات المطلوبة حسب نوع الحركة
    if (isReceivingTransaction && !newTransaction.targetWarehouse) {
      toast({
        title: "خطأ في الحفظ",
        description: "يرجى تحديد المستودع المستهدف لحركة الاستلام",
        variant: "destructive"
      });
      return;
    }

    if (isExportTransaction && !newTransaction.sourceWarehouse) {
      toast({
        title: "خطأ في الحفظ",
        description: "يرجى تحديد المستودع المصدر لحركة الصرف",
        variant: "destructive"
      });
      return;
    }

    if (isTransferTransaction && (!newTransaction.sourceWarehouse || !newTransaction.targetWarehouse)) {
      toast({
        title: "خطأ في الحفظ",
        description: "يرجى تحديد المستودع المصدر والمستودع المستقبل للتحويل",
        variant: "destructive"
      });
      return;
    }

    // فحص صحة الأصناف
    for (const item of newTransaction.items!) {
      if (!item.itemCode || !item.itemName || !item.quantity) {
        toast({
          title: "خطأ في البيانات",
          description: "يرجى التأكد من صحة بيانات جميع الأصناف",
          variant: "destructive"
        });
        return;
      }
    }

    // فحص وجود المستودع حسب نوع الحركة
    if (isReceivingTransaction && newTransaction.targetWarehouse) {
      const targetWarehouseExists = warehouses.some(w => 
        (w.name_ar || w.name) === newTransaction.targetWarehouse
      );
      
      if (!targetWarehouseExists) {
        toast({
          title: "خطأ في البيانات",
          description: "المستودع المستهدف غير موجود",
          variant: "destructive"
        });
        return;
      }
    }

    if ((isExportTransaction || isTransferTransaction) && newTransaction.sourceWarehouse) {
      const sourceWarehouseExists = warehouses.some(w => 
        (w.name_ar || w.name) === newTransaction.sourceWarehouse
      );
      
      if (!sourceWarehouseExists) {
        toast({
          title: "خطأ في البيانات",
          description: "المستودع المصدر غير موجود",
          variant: "destructive"
        });
        return;
      }
    }

    if (isTransferTransaction && newTransaction.targetWarehouse) {
      const targetWarehouseExists = warehouses.some(w => 
        (w.name_ar || w.name) === newTransaction.targetWarehouse
      );
      
      if (!targetWarehouseExists) {
        toast({
          title: "خطأ في البيانات",
          description: "المستودع المستقبل غير موجود",
          variant: "destructive"
        });
        return;
      }
    }

    // فحص توفر الكميات للمبيعات والتحويل
    if (newTransaction.type === "صرف" || newTransaction.type === "تحويل") {
      for (const item of newTransaction.items!) {
        // البحث عن المنتج في المستودع المصدر
        const productInWarehouse = availableProductsByWarehouse.find((p: any) => 
          p.product_id === item.itemCode
        );
        
        if (!productInWarehouse) {
          toast({
            title: "خطأ في الكمية",
            description: `المنتج ${item.itemName} غير موجود في المستودع المصدر`,
            variant: "destructive"
          });
          return;
        }
        
        const availableStock = productInWarehouse.current_stock || 0;
        if (availableStock < item.quantity) {
          toast({
            title: "خطأ في الكمية",
            description: `الكمية المتوفرة من ${item.itemName} هي ${availableStock} فقط، والمطلوب ${item.quantity}`,
            variant: "destructive"
          });
          return;
        }
      }
    }

    try {
      // البحث عن معرفات المستودعات من الأسماء
      const sourceWarehouseObj = newTransaction.sourceWarehouse 
        ? warehouses.find(w => (w.name_ar || w.name) === newTransaction.sourceWarehouse)
        : null;
      
      const targetWarehouseObj = newTransaction.targetWarehouse
        ? warehouses.find(w => (w.name_ar || w.name) === newTransaction.targetWarehouse)
        : null;
      
      // تنظيف البيانات قبل الإرسال
      const transactionData = {
      type: newTransaction.type!,
      date: newTransaction.date!,
      time: newTransaction.time!,
      sourceWarehouse: sourceWarehouseObj?.id || null,
        sourceWarehouseName: sourceWarehouseObj?.name_ar || sourceWarehouseObj?.name || null,
        targetWarehouse: targetWarehouseObj?.id || null,
        targetWarehouseName: targetWarehouseObj?.name_ar || targetWarehouseObj?.name || null,
      reference: newTransaction.reference || `AUTO-${Date.now()}`,
        user: newTransaction.user!,
      status: "مسودة",
        items: newTransaction.items!.map((item: TransactionItem) => ({
          productId: item.productId || null,
          itemCode: item.itemCode,
          itemName: item.itemName,
          quantity: Number(item.quantity) || 0,
          unit: item.unit || "  ",
          price: Number(item.price) || 0,
          total: Number(item.total) || 0,
          notes: item.notes || null
        })),
        notes: newTransaction.notes || null,
        reason: newTransaction.reason || null,
      branchId: newTransaction.branchId!,
      branchName: newTransaction.branchName!
    };

      // طباعة البيانات للتصحيح
      console.log("بيانات الحركة المرسلة:", transactionData);
      
      // فحص تنسيق البيانات
      console.log("فحص البيانات:");
      console.log("- نوع الحركة:", typeof transactionData.type, transactionData.type);
      console.log("- التاريخ:", typeof transactionData.date, transactionData.date);
      console.log("- الوقت:", typeof transactionData.time, transactionData.time);
      console.log("- معرف المستودع المصدر:", typeof transactionData.sourceWarehouse, transactionData.sourceWarehouse);
      console.log("- اسم المستودع المصدر:", typeof transactionData.sourceWarehouseName, transactionData.sourceWarehouseName);
      console.log("- معرف المستودع المستهدف:", typeof transactionData.targetWarehouse, transactionData.targetWarehouse);
      console.log("- اسم المستودع المستهدف:", typeof transactionData.targetWarehouseName, transactionData.targetWarehouseName);
      console.log("- الفرع:", typeof transactionData.branchId, transactionData.branchId);
      console.log("- عدد الأصناف:", transactionData.items.length);
      
      // فحص الأصناف
      transactionData.items.forEach((item: any, index: number) => {
        console.log(`صنف ${index + 1}:`, {
          productId: item.productId,
          itemCode: item.itemCode,
          itemName: item.itemName,
          quantityType: typeof item.quantity,
          quantity: item.quantity,
          unit: item.unit,
          priceType: typeof item.price,
          price: item.price
        });
      });

      if (isEditing && editingTransactionId) {
        await updateTransaction({ id: editingTransactionId, transactionData }).unwrap();
        toast({
          title: "تم التعديل بنجاح",
          description: `تم تعديل الحركة ${editingTransactionId} بنجاح`,
        });
      } else {
        await createTransaction(transactionData).unwrap();
        toast({
          title: "تم الحفظ بنجاح",
          description: "تم إنشاء الحركة المخزنية بنجاح",
        });
      }
    
    // Reset form
    resetForm();
    setActiveTab("list");

      // إعادة جلب البيانات
      refetchTransactions();
      
    } catch (error: any) {
      console.error("خطأ في حفظ الحركة:", error);
      
      let errorMessage = "حدث خطأ أثناء حفظ الحركة";
      let errorTitle = "خطأ في الحفظ";
      
      if (error?.status === 500) {
        errorTitle = "خطأ في الخادم";
        errorMessage = "حدث خطأ داخلي في الخادم - يرجى المحاولة مرة أخرى أو التواصل مع الدعم الفني";
      } else if (error?.status === 400) {
        errorTitle = "بيانات غير صحيحة";
        errorMessage = error?.data?.message || "يرجى التحقق من صحة البيانات المدخلة";
      } else if (error?.status === 401) {
        errorTitle = "غير مصرح";
        errorMessage = "غير مصرح لك بإنشاء حركات مخزنية - يرجى تسجيل الدخول مرة أخرى";
      } else if (error?.status === 403) {
        errorTitle = "غير مصرح";
        errorMessage = "غير مصرح لك بإنشاء حركات مخزنية - لا تملك الصلاحيات المطلوبة";
      } else if (error?.status === 404) {
        errorTitle = "المورد غير موجود";
        errorMessage = "المورد المطلوب غير موجود في الخادم";
      } else if (error?.data?.message) {
        errorMessage = error.data.message;
      }
      
      // عرض تفاصيل أكثر في console للتصحيح
      console.error("تفاصيل الخطأ:", {
        status: error?.status,
        data: error?.data,
        message: error?.message,
        originalError: error
      });
      
    toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive"
      });
    }

    // تحديث الكميات حسب نوع الحركة
    try {
      console.log("🔄 بدء تحديث الكميات...");
      console.log("📊 تفاصيل الحركة:", {
        type: newTransaction.type,
        sourceWarehouse: newTransaction.sourceWarehouse,
        targetWarehouse: newTransaction.targetWarehouse,
        itemsCount: newTransaction.items?.length || 0
      });
      
      let successCount = 0;
      let errorCount = 0;
      
      for (const item of newTransaction.items!) {
        const productId = item.productId || item.itemCode;
        const quantity = Number(item.quantity) || 0;
        
        // البحث عن المستودع المصدر
        const sourceWarehouse = warehouses.find(w => 
          (w.name_ar || w.name) === newTransaction.sourceWarehouse
        );
        
        if (!sourceWarehouse) {
          console.error("❌ لم يتم العثور على المستودع المصدر:", newTransaction.sourceWarehouse);
          errorCount++;
          continue;
        }

        console.log(`📦 تحديث المنتج: ${item.itemName} (${productId})`);
        console.log(`🏪 المستودع المصدر: ${sourceWarehouse.name_ar || sourceWarehouse.name} (${sourceWarehouse.id})`);
        console.log(`📊 الكمية: ${quantity}`);

        try {
          // إنشاء بيانات التحديث
          const stockUpdateData = {
            productId: productId,
            warehouseId: sourceWarehouse.id,
            quantity: quantity,
            operation_type: "",
            notes: ""
          };

          switch (newTransaction.type) {
            case "استلام":
            case "توريد":
              stockUpdateData.operation_type = "add";
              stockUpdateData.notes = `إضافة من حركة ${newTransaction.type} - ${newTransaction.reference || 'غير محدد'}`;
              console.log(`➕ إضافة ${quantity} للمستودع المصدر`);
              break;
              
            case "صرف":
            case "إخراج":
              stockUpdateData.operation_type = "subtract";
              stockUpdateData.notes = `خصم من حركة ${newTransaction.type} - ${newTransaction.reference || 'غير محدد'}`;
              console.log(`➖ خصم ${quantity} من المستودع المصدر`);
              break;
              
            case "تحويل":
              // خصم من المستودع المصدر وإضافة للمستودع المستقبل
              if (newTransaction.targetWarehouse) {
                const targetWarehouse = warehouses.find(w => 
                  (w.name_ar || w.name) === newTransaction.targetWarehouse
                );
                
                if (targetWarehouse) {
                  console.log(`🔄 تحويل ${quantity} من ${sourceWarehouse.name_ar || sourceWarehouse.name} إلى ${targetWarehouse.name_ar || targetWarehouse.name}`);
                  
                  // خصم من المستودع المصدر
                  try {
                    await updateStock({
                      productId: productId,
                      warehouseId: sourceWarehouse.id,
                      quantity: quantity,
                      operation_type: "subtract",
                      notes: `تحويل إلى ${targetWarehouse.name_ar || targetWarehouse.name} - ${newTransaction.reference || 'غير محدد'}`
                    }).unwrap();
                    console.log(`✅ تم خصم ${quantity} من المستودع المصدر`);
                    
                    // إضافة للمستودع المستقبل
                    await updateStock({
                      productId: productId,
                      warehouseId: targetWarehouse.id,
                      quantity: quantity,
                      operation_type: "add",
                      notes: `تحويل من ${sourceWarehouse.name_ar || sourceWarehouse.name} - ${newTransaction.reference || 'غير محدد'}`
                    }).unwrap();
                    console.log(`✅ تم إضافة ${quantity} للمستودع المستقبل`);
                    successCount += 2; // عمليتان ناجحتان
                  } catch (transferError) {
                    console.error(`❌ خطأ في التحويل:`, transferError);
                    errorCount += 2;
                  }
                  continue; // تخطي العمليات الأخرى لهذا المنتج
                }
              }
              break;
              
            case "جرد":
            case "تعديل":
              stockUpdateData.operation_type = "set";
              stockUpdateData.notes = `جرد/تعديل من حركة ${newTransaction.type} - ${newTransaction.reference || 'غير محدد'}`;
              console.log(`🔄 تعيين كمية جديدة: ${quantity}`);
              break;
              
            case "إتلاف":
            case "شطب":
              stockUpdateData.operation_type = "subtract";
              stockUpdateData.notes = `إتلاف/شطب من حركة ${newTransaction.type} - ${newTransaction.reference || 'غير محدد'}`;
              console.log(`🗑️ إتلاف ${quantity}`);
              break;
              
            default:
              console.log(`❓ نوع حركة غير معروف: ${newTransaction.type}`);
              errorCount++;
              continue;
          }

          // تنفيذ تحديث المخزون
          if (stockUpdateData.operation_type) {
            console.log("📤 إرسال بيانات التحديث:", stockUpdateData);
            
            const result = await updateStock(stockUpdateData).unwrap();
            console.log("✅ نتيجة التحديث:", result);
            
            successCount++;
            console.log(`✅ تم تحديث ${item.itemName} بنجاح`);
          }
          
        } catch (itemError) {
          console.error(`❌ خطأ في تحديث المنتج ${item.itemName}:`, itemError);
          errorCount++;
          
          // عرض تفاصيل الخطأ
          if (itemError && typeof itemError === 'object') {
            console.error("تفاصيل الخطأ:", {
              status: (itemError as any)?.status,
              data: (itemError as any)?.data,
              message: (itemError as any)?.message
            });
          }
          
          toast({
            title: "خطأ في تحديث المنتج",
            description: `حدث خطأ في تحديث كمية ${item.itemName}: ${(itemError as any)?.data?.message || 'خطأ غير معروف'}`,
            variant: "destructive"
          });
        }
      }
      
      console.log("📊 إحصائيات التحديث:", { successCount, errorCount, total: newTransaction.items!.length });
      
      if (successCount > 0) {
        console.log("✅ تم تحديث بعض الكميات بنجاح");
        toast({
          title: "تم تحديث الكميات",
          description: `تم تحديث ${successCount} من ${newTransaction.items!.length} منتج بنجاح${errorCount > 0 ? `، ${errorCount} فشل` : ''}`,
        });
      } else {
        console.log("❌ لم يتم تحديث أي كمية");
        toast({
          title: "تحذير",
          description: "لم يتم تحديث أي كمية في المخزون - يرجى مراجعة البيانات",
          variant: "destructive"
        });
      }
      
      // إعادة جلب المنتجات لتحديث الكميات المعروضة
      console.log("🔄 إعادة جلب المنتجات...");
      await refetchAllProducts();
      console.log("✅ تم إعادة جلب المنتجات");
      
    } catch (stockError) {
      console.error("❌ خطأ عام في تحديث الكميات:", stockError);
      toast({
        title: "خطأ في تحديث الكميات",
        description: "حدث خطأ عام أثناء تحديث الكميات - يرجى مراجعة المخزون يدوياً",
        variant: "destructive"
      });
    }
  };

  // وظيفة إعادة تعيين النموذج
  const resetForm = () => {
    setNewTransaction({
      type: "",
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-GB', { hour12: false }).slice(0, 5),
      sourceWarehouse: "",
      targetWarehouse: "",
      reference: "",
      user: "المستخدم الحالي",
      status: "مسودة",
      items: [],
      notes: "",
      reason: "",
      branchId: selectedBranch?.id || "",
      branchName: selectedBranch?.name || ""
    });
    
    setNewItem({
      itemCode: "",
      itemName: "",
      quantity: 0,
      unit: "",
      price: 0,
      notes: "",
      productId: ""
    });
    
    setIsEditing(false);
    setEditingTransactionId(null);
  };

  // وظيفة إلغاء التعديل
  const cancelEdit = () => {
    if (isEditing && editingTransactionId && confirm("هل أنت متأكد من إلغاء التعديل؟ ستفقد جميع التغييرات.")) {
      resetForm();
      setActiveTab("list");
      
      toast({
        title: "تم إلغاء التعديل",
        description: "تم إلغاء التعديل وإعادة النموذج لحالته الأصلية",
      });
    }
  };

  const selectItem = (item: any) => {
    setNewItem(prev => ({
      ...prev,
      itemCode: item.product_id,
      itemName: item.name_ar || item.name_en,
      unit: item.unit_of_measure || "  ",
      price: item.cost_price || 0,
      productId: item.product_id
    }));
    
    // إعادة تعيين حالة عرض القائمة
    setShowProductsList(false);
    
    // إظهار رسالة تأكيد للمستخدم
    toast({
      title: "تم اختيار المنتج",
      description: `تم اختيار ${item.name_ar || item.name_en}`,
    });
  };

  // وظائف الأزرار المحدثة والفعالة
  const handleView = (transactionId: string) => {
    const transaction = allTransactions.find((t: Transaction) => t.id === transactionId);
    if (transaction) {
      setSelectedTransaction(transaction);
      setShowDetailsModal(true);
    }
  };

  const handleEdit = (transactionId: string) => {
    // البحث في جميع الحركات (العادية + مرتجعات المشتريات)
    const transaction = allTransactions.find((t: Transaction) => t.id === transactionId);
    
    if (!transaction) {
      toast({
        title: "خطأ",
        description: "لم يتم العثور على الحركة",
        variant: "destructive"
      });
      return;
    }

    if (transaction.status !== "مسودة") {
      toast({
        title: "لا يمكن التعديل",
        description: "يمكن تعديل الحركات في حالة المسودة فقط",
        variant: "destructive"
      });
      return;
    }
    
    // التأكد من أن هذه الحركة من الحركات العادية وليس مرتجعات المشتريات
    const isNormalTransaction = transactions.find((t: Transaction) => t.id === transactionId);
    if (!isNormalTransaction) {
      toast({
        title: "لا يمكن التعديل",
        description: "لا يمكن تعديل مرتجعات المشتريات من هنا",
        variant: "destructive"
      });
      return;
    }

    // تحميل بيانات الحركة في النموذج
    setNewTransaction({
      type: transaction.type,
      date: transaction.date,
      time: transaction.time,
      sourceWarehouse: transaction.sourceWarehouse,
      targetWarehouse: transaction.targetWarehouse || "",
      reference: transaction.reference,
      user: transaction.user,
      status: transaction.status,
      items: [...transaction.items], // نسخ الأصناف
      notes: transaction.notes || "",
      reason: transaction.reason || "",
      branchId: transaction.branchId,
      branchName: transaction.branchName
    });
    
    // تعيين حالة التعديل
    setIsEditing(true);
    setEditingTransactionId(transactionId);
    
    // لا حاجة لحذف الحركة من القائمة - سيتم تحديثها من API
    
    // الانتقال لتاب الإضافة
    setActiveTab("add");
    
    toast({
      title: "تم تحميل الحركة للتحرير",
      description: `يمكنك الآن تعديل الحركة ${transaction.id}`,
    });
  };

  const handleApprove = async (transactionId: string) => {
    try {
      // البحث عن الحركة المطلوب اعتمادها
      const transaction = allTransactions.find((t: Transaction) => t.id === transactionId);
      if (!transaction) {
        toast({
          title: "خطأ",
          description: "لم يتم العثور على الحركة",
          variant: "destructive"
        });
        return;
      }

      // فحص حالة الحركة
      if (transaction.status === "معتمدة" || transaction.status === "approved") {
        toast({
          title: "الحركة معتمدة بالفعل",
          description: `الحركة ${transactionId} معتمدة بالفعل ولا تحتاج لإعادة اعتماد`,
          variant: "destructive"
        });
        return;
      }

      console.log("🔄 بدء اعتماد الحركة:", transactionId);
      console.log("📊 تفاصيل الحركة الكاملة:", transaction);
      console.log("📊 تفاصيل الحركة:", {
        type: transaction.type,
        sourceWarehouse: transaction.sourceWarehouse,
        sourceWarehouseId: (transaction as any).sourceWarehouseId,
        source_warehouse_id: (transaction as any).source_warehouse_id,
        targetWarehouse: transaction.targetWarehouse,
        targetWarehouseId: (transaction as any).targetWarehouseId,
        target_warehouse_id: (transaction as any).target_warehouse_id,
        items: transaction.items.length,
        currentStatus: transaction.status
      });

      // اعتماد الحركة (Backend سيحدث الكميات تلقائياً)
      await approveTransaction(transactionId).unwrap();
      console.log("✅ تم اعتماد الحركة بنجاح وتحديث الكميات في المخزون");

      // إعادة جلب البيانات لتحديث القائمة
      await refetchTransactions();
      await refetchAllProducts();

      toast({
        title: "تم الاعتماد بنجاح",
        description: `تم اعتماد الحركة ${transactionId} وتحديث الكميات في المخزون`,
      });
      
      // الكود القديم - سيتم حذفه
      if (false) {
        console.log("🔄 بدء تحديث الكميات في المخزون...");
        
        // فحص البيانات الأساسية
        console.log("🔍 فحص بيانات الحركة:", {
          transactionId: transaction.id,
          type: transaction.type,
          sourceWarehouseId: transaction.sourceWarehouse,
          sourceWarehouseName: transaction.sourceWarehouseName,
          targetWarehouseId: transaction.targetWarehouse,
          targetWarehouseName: transaction.targetWarehouseName,
          itemsCount: transaction.items.length,
          warehousesCount: warehouses.length
        });
        
        // تحديد المستودع المطلوب بناءً على نوع الحركة
        const isReceivingTransaction = transaction.type === "استلام" || transaction.type === "توريد" || transaction.type === "مرتجع مشتريات";
        const isExportTransaction = transaction.type === "صرف" || transaction.type === "إخراج" || transaction.type === "إتلاف" || transaction.type === "شطب" || transaction.type === "مرتجع مبيعات";
        const isTransferTransaction = transaction.type === "تحويل";
        
        // التعامل مع كلا التنسيقين: camelCase و snake_case
        const sourceWarehouseId = transaction.sourceWarehouse || (transaction as any).sourceWarehouseId || (transaction as any).source_warehouse_id;
        const targetWarehouseId = transaction.targetWarehouse || (transaction as any).targetWarehouseId || (transaction as any).target_warehouse_id;
        
        // في حركات الاستلام: المستودع محفوظ في sourceWarehouse
        if (isReceivingTransaction && !sourceWarehouseId) {
          console.error("❌ المستودع غير محدد في حركة الاستلام");
          toast({
            title: "خطأ في البيانات",
            description: "المستودع غير محدد في حركة الاستلام",
            variant: "destructive"
          });
          return;
        }
        
        if (isExportTransaction && !sourceWarehouseId) {
          console.error("❌ المستودع المصدر غير محدد في الحركة");
          toast({
            title: "خطأ في البيانات",
            description: "المستودع المصدر غير محدد في الحركة",
            variant: "destructive"
          });
          return;
        }
        
        if (isTransferTransaction && (!sourceWarehouseId || !targetWarehouseId)) {
          console.error("❌ المستودع المصدر أو المستهدف غير محدد في حركة التحويل");
          toast({
            title: "خطأ في البيانات",
            description: "المستودع المصدر أو المستهدف غير محدد في حركة التحويل",
            variant: "destructive"
          });
          return;
        }
        
        try {
        let successCount = 0;
        let errorCount = 0;
        
        for (const item of transaction.items) {
          const productId = item.productId || item.itemCode;
          const quantity = Number(item.quantity) || 0;
          
          console.log(`📦 تحديث المنتج: ${item.itemName} (${productId})`);
          console.log(`📊 الكمية: ${quantity}`);
          console.log(`🏪 نوع الحركة: ${transaction.type}`);

          // تحديد المستودع المناسب بناءً على نوع الحركة
          let primaryWarehouse = null;
          let warehouseId = "";
          
          // في جميع الحالات نستخدم sourceWarehouse
          // التعامل مع كلا التنسيقين: camelCase و snake_case
          warehouseId = transaction.sourceWarehouse || 
                       (transaction as any).sourceWarehouseId || 
                       (transaction as any).source_warehouse_id || "";
          
          // البحث بالمعرف أو الاسم
          primaryWarehouse = warehouses.find(w => 
            String(w.id) === String(warehouseId) || 
            (w.name_ar || w.name) === warehouseId ||
            String(w.warehouse_id) === String(warehouseId)
          );
          
          if (!primaryWarehouse) {
            console.error("❌ لم يتم العثور على المستودع:", warehouseId);
            console.log("🏪 المستودعات المتاحة:", warehouses.map(w => ({ id: w.id, name: w.name_ar || w.name })));
            toast({
              title: "تحذير",
              description: `لم يتم العثور على المستودع: ${warehouseId}`,
              variant: "destructive"
            });
            errorCount++;
            continue;
          }

          try {
            // إنشاء بيانات التحديث
            const stockUpdateData = {
              productId: productId,
              warehouseId: primaryWarehouse.id,
              quantity: quantity,
              operation_type: "",
              notes: ""
            };

            switch (transaction.type) {
              case "استلام":
              case "توريد":
                stockUpdateData.operation_type = "add";
                stockUpdateData.notes = `إضافة من حركة ${transaction.type} معتمدة - ${transaction.reference || 'غير محدد'}`;
                console.log(`➕ إضافة ${quantity} للمستودع: ${primaryWarehouse.name_ar || primaryWarehouse.name}`);
                break;
                
              case "صرف":
              case "إخراج":
                stockUpdateData.operation_type = "subtract";
                stockUpdateData.notes = `خصم من حركة ${transaction.type} معتمدة - ${transaction.reference || 'غير محدد'}`;
                console.log(`➖ خصم ${quantity} من المستودع: ${primaryWarehouse.name_ar || primaryWarehouse.name}`);
                break;
                
              case "تحويل":
                // خصم من المستودع المصدر وإضافة للمستودع المستقبل
                const targetWarehouseIdForTransfer = transaction.targetWarehouse || 
                                                     (transaction as any).targetWarehouseId || 
                                                     (transaction as any).target_warehouse_id;
                
                if (targetWarehouseIdForTransfer) {
                  const targetWarehouse = warehouses.find(w => 
                    String(w.id) === String(targetWarehouseIdForTransfer) ||
                    (w.name_ar || w.name) === targetWarehouseIdForTransfer ||
                    String(w.warehouse_id) === String(targetWarehouseIdForTransfer)
                  );
                  
                  if (targetWarehouse) {
                    console.log(`🔄 تحويل ${quantity} من ${primaryWarehouse.name_ar || primaryWarehouse.name} إلى ${targetWarehouse.name_ar || targetWarehouse.name}`);
                    
                    try {
                      // خصم من المستودع المصدر
                      await updateStock({
                        productId: productId,
                        warehouseId: primaryWarehouse.id,
                        quantity: quantity,
                        operation_type: "subtract",
                        notes: `تحويل إلى ${targetWarehouse.name_ar || targetWarehouse.name} - ${transaction.reference || 'غير محدد'}`
                      }).unwrap();
                      console.log(`✅ تم خصم ${quantity} من المستودع المصدر`);
                      
                      // إضافة للمستودع المستقبل
                      await updateStock({
                        productId: productId,
                        warehouseId: targetWarehouse.id,
                        quantity: quantity,
                        operation_type: "add",
                        notes: `تحويل من ${primaryWarehouse.name_ar || primaryWarehouse.name} - ${transaction.reference || 'غير محدد'}`
                      }).unwrap();
                      console.log(`✅ تم إضافة ${quantity} للمستودع المستقبل`);
                      successCount += 2; // عمليتان ناجحتان
                    } catch (transferError) {
                      console.error(`❌ خطأ في التحويل:`, transferError);
                      errorCount += 2;
                    }
                    continue; // تخطي العمليات الأخرى لهذا المنتج
                  }
                }
                break;
                
              case "جرد":
              case "تعديل":
                stockUpdateData.operation_type = "set";
                stockUpdateData.notes = `جرد/تعديل من حركة ${transaction.type} معتمدة - ${transaction.reference || 'غير محدد'}`;
                console.log(`🔄 تعيين كمية جديدة: ${quantity}`);
                break;
                
              case "إتلاف":
              case "شطب":
                stockUpdateData.operation_type = "subtract";
                stockUpdateData.notes = `إتلاف/شطب من حركة ${transaction.type} معتمدة - ${transaction.reference || 'غير محدد'}`;
                console.log(`🗑️ إتلاف ${quantity}`);
                break;
                
              case "مرتجع مشتريات":
                stockUpdateData.operation_type = "add";
                stockUpdateData.notes = `مرتجع مشتريات معتمد - ${transaction.reference || 'غير محدد'}`;
                console.log(`➕ إضافة ${quantity} من مرتجع المشتريات`);
                break;
                
              case "مرتجع مبيعات":
                stockUpdateData.operation_type = "subtract";
                stockUpdateData.notes = `مرتجع مبيعات معتمد - ${transaction.reference || 'غير محدد'}`;
                console.log(`➖ خصم ${quantity} من مرتجع المبيعات`);
                break;
                
              default:
                console.log(`❓ نوع حركة غير معروف: ${transaction.type}`);
                errorCount++;
                continue;
            }

            // تنفيذ تحديث المخزون
            if (stockUpdateData.operation_type) {
              console.log("📤 إرسال بيانات التحديث:", stockUpdateData);
              
              // فحص إضافي للتأكد من وجود المنتج في المستودع
              console.log("🔍 فحص وجود المنتج في المستودع...");
              console.log("📦 المنتج:", {
                productId: stockUpdateData.productId,
                productName: item.itemName,
                warehouseId: stockUpdateData.warehouseId,
                warehouseName: primaryWarehouse.name_ar || primaryWarehouse.name
              });
              
              try {
                const result = await updateStock(stockUpdateData).unwrap();
                console.log("✅ نتيجة التحديث:", result);
                
                successCount++;
                console.log(`✅ تم تحديث ${item.itemName} بنجاح`);
                
                // تأخير قصير بين العمليات
                await new Promise(resolve => setTimeout(resolve, 100));
                
              } catch (updateError) {
                console.error(`❌ خطأ في تحديث ${item.itemName}:`, updateError);
                errorCount++;
                
                // عرض تفاصيل الخطأ
                if (updateError && typeof updateError === 'object') {
                  console.error("تفاصيل الخطأ:", {
                    status: (updateError as any)?.status,
                    data: (updateError as any)?.data,
                    message: (updateError as any)?.message
                  });
                  
                  // فحص نوع الخطأ
                  if ((updateError as any)?.data?.error?.includes("Inventory record not found")) {
                    console.error("🔍 المشكلة: المنتج غير موجود في المستودع");
                    console.log("💡 الحل: تأكد من أن المنتج موجود في المستودع قبل التحديث");
                    
                    toast({
                      title: "خطأ في تحديث المنتج",
                      description: `المنتج ${item.itemName} غير موجود في المستودع ${primaryWarehouse.name_ar || primaryWarehouse.name}`,
                      variant: "destructive"
                    });
                  } else {
                    toast({
                      title: "خطأ في تحديث المنتج",
                      description: `حدث خطأ في تحديث كمية ${item.itemName}: ${(updateError as any)?.data?.message || 'خطأ غير معروف'}`,
                      variant: "destructive"
                    });
                  }
                }
              }
            }
            
          } catch (itemError) {
            console.error(`❌ خطأ في معالجة المنتج ${item.itemName}:`, itemError);
            errorCount++;
          }
        }
        
        console.log("📊 إحصائيات التحديث:", { successCount, errorCount, total: transaction.items.length });
        
        if (successCount > 0) {
          console.log("✅ تم تحديث بعض الكميات بنجاح");
          toast({
            title: "تم الاعتماد وتحديث الكميات",
            description: `تم اعتماد الحركة ${transactionId} وتحديث ${successCount} منتج بنجاح${errorCount > 0 ? `، ${errorCount} فشل` : ''}`,
          });
        } else {
          console.log("❌ لم يتم تحديث أي كمية");
          toast({
            title: "تحذير",
            description: "تم اعتماد الحركة ولكن لم يتم تحديث أي كمية في المخزون",
            variant: "destructive"
          });
        }
        
        // إعادة جلب المنتجات لتحديث الكميات المعروضة
        console.log("🔄 إعادة جلب المنتجات...");
        
        try {
          // إعادة جلب المنتجات
          await refetchAllProducts();
          console.log("✅ تم إعادة جلب المنتجات");
          
          // إعادة جلب الحركات أيضاً
          await refetchTransactions();
          console.log("✅ تم إعادة جلب الحركات");
          
          // تأخير قصير للتأكد من تحديث البيانات
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // إعادة جلب المنتجات مرة أخرى للتأكد
          await refetchAllProducts();
          console.log("✅ تم إعادة جلب المنتجات مرة ثانية");
          
        } catch (refetchError) {
          console.error("❌ خطأ في إعادة جلب البيانات:", refetchError);
        }
        
      } catch (stockError) {
        console.error("❌ خطأ في تحديث الكميات:", stockError);
        toast({
          title: "تحذير",
          description: "تم اعتماد الحركة ولكن حدث خطأ في تحديث الكميات - يرجى مراجعة المخزون يدوياً",
          variant: "destructive"
        });
      }
      // نهاية if (false) - الكود القديم
      }
      
    } catch (error: any) {
      console.error("❌ خطأ في اعتماد الحركة:", error);
      
      let errorMessage = "حدث خطأ أثناء اعتماد الحركة";
      let errorTitle = "خطأ في الاعتماد";
      
      if (error?.data?.message?.includes("معتمدة بالفعل")) {
        errorTitle = "الحركة معتمدة بالفعل";
        errorMessage = "هذه الحركة معتمدة بالفعل ولا تحتاج لإعادة اعتماد";
      } else if (error?.data?.message) {
        errorMessage = error.data.message;
      }
      
      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const handleReject = async (transactionId: string) => {
    const reason = prompt("يرجى تحديد سبب الرفض:");
    if (!reason) return;

    try {
      // البحث عن الحركة المطلوب رفضها
      const transaction = allTransactions.find((t: Transaction) => t.id === transactionId);
      if (!transaction) {
        toast({
          title: "خطأ",
          description: "لم يتم العثور على الحركة",
          variant: "destructive"
        });
        return;
      }

      console.log("🔄 بدء رفض الحركة:", transactionId);
      console.log("📊 تفاصيل الحركة:", {
        type: transaction.type,
        sourceWarehouse: transaction.sourceWarehouse,
        targetWarehouse: transaction.targetWarehouse,
        items: transaction.items.length
      });

      // رفض الحركة أولاً
      await fetch(`/api/v1/inventory-transactions/${transactionId}/reject`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason })
      });

      console.log("✅ تم رفض الحركة بنجاح");

      // إذا كانت الحركة معتمدة مسبقاً، نقوم بإلغاء التغييرات في المخزون
      if (transaction.status === "معتمدة" || transaction.status === "approved") {
        try {
          console.log("🔄 بدء إلغاء التغييرات في المخزون...");
          
          for (const item of transaction.items) {
            const productId = item.productId || item.itemCode;
            const quantity = Number(item.quantity) || 0;
            
            console.log(`📦 إلغاء تغيير المنتج: ${item.itemName} (${productId})`);
            console.log(`📊 الكمية: ${quantity}`);
            console.log(`🏪 نوع الحركة: ${transaction.type}`);

            // البحث عن المستودع المصدر
            const sourceWarehouse = warehouses.find(w => 
              (w.name_ar || w.name) === transaction.sourceWarehouse
            );
            
            if (!sourceWarehouse) {
              console.error("❌ لم يتم العثور على المستودع المصدر:", transaction.sourceWarehouse);
              continue;
            }

            try {
              switch (transaction.type) {
                case "استلام":
                case "توريد":
                  // إلغاء الإضافة (خصم الكمية)
                  console.log(`➖ إلغاء إضافة ${quantity} من المستودع المصدر: ${sourceWarehouse.name_ar || sourceWarehouse.name}`);
                  await updateStock({
                    productId: productId,
                    warehouseId: sourceWarehouse.id,
                    quantity: quantity,
                    operation_type: "subtract",
                    notes: `إلغاء حركة ${transaction.type} مرفوضة - ${transaction.reference || 'غير محدد'}`
                  }).unwrap();
                  console.log(`✅ تم إلغاء إضافة ${quantity}`);
                  break;
                  
                case "صرف":
                case "إخراج":
                  // إلغاء الخصم (إضافة الكمية)
                  console.log(`➕ إلغاء خصم ${quantity} للمستودع المصدر: ${sourceWarehouse.name_ar || sourceWarehouse.name}`);
                  await updateStock({
                    productId: productId,
                    warehouseId: sourceWarehouse.id,
                    quantity: quantity,
                    operation_type: "add",
                    notes: `إلغاء حركة ${transaction.type} مرفوضة - ${transaction.reference || 'غير محدد'}`
                  }).unwrap();
                  console.log(`✅ تم إلغاء خصم ${quantity}`);
                  break;
                  
                case "تحويل":
                  // إلغاء التحويل (عكس العملية)
                  if (transaction.targetWarehouse) {
                    const targetWarehouse = warehouses.find(w => 
                      (w.name_ar || w.name) === transaction.targetWarehouse
                    );
                    
                    if (targetWarehouse) {
                      console.log(`🔄 إلغاء تحويل ${quantity} من ${sourceWarehouse.name_ar || sourceWarehouse.name} إلى ${targetWarehouse.name_ar || targetWarehouse.name}`);
                      
                      // إعادة الكمية للمستودع المصدر
                      await updateStock({
                        productId: productId,
                        warehouseId: sourceWarehouse.id,
                        quantity: quantity,
                        operation_type: "add",
                        notes: `إلغاء تحويل مرفوض - إعادة ${quantity} للمستودع المصدر`
                      }).unwrap();
                      
                      // خصم الكمية من المستودع المستقبل
                      await updateStock({
                        productId: productId,
                        warehouseId: targetWarehouse.id,
                        quantity: quantity,
                        operation_type: "subtract",
                        notes: `إلغاء تحويل مرفوض - خصم ${quantity} من المستودع المستقبل`
                      }).unwrap();
                      
                      console.log(`✅ تم إلغاء التحويل بنجاح`);
                    }
                  }
                  break;
                  
                case "جرد":
                case "تعديل":
                  // لا يمكن إلغاء الجرد بسهولة - يحتاج مراجعة يدوية
                  console.log(`⚠️ لا يمكن إلغاء الجرد/التعديل تلقائياً - يحتاج مراجعة يدوية`);
                  toast({
                    title: "تحذير",
                    description: `لا يمكن إلغاء حركة الجرد/التعديل تلقائياً - يرجى مراجعة المخزون يدوياً`,
                    variant: "destructive"
                  });
                  break;
                  
                case "إتلاف":
                case "شطب":
                  // إلغاء الإتلاف (إضافة الكمية)
                  console.log(`➕ إلغاء إتلاف ${quantity} للمستودع المصدر: ${sourceWarehouse.name_ar || sourceWarehouse.name}`);
                  await updateStock({
                    productId: productId,
                    warehouseId: sourceWarehouse.id,
                    quantity: quantity,
                    operation_type: "add",
                    notes: `إلغاء حركة إتلاف مرفوضة - ${transaction.reference || 'غير محدد'}`
                  }).unwrap();
                  console.log(`✅ تم إلغاء الإتلاف ${quantity}`);
                  break;
                  
                case "مرتجع مشتريات":
                  // إلغاء المرتجع (خصم الكمية)
                  console.log(`➖ إلغاء مرتجع مشتريات ${quantity}`);
                  await updateStock({
                    productId: productId,
                    warehouseId: sourceWarehouse.id,
                    quantity: quantity,
                    operation_type: "subtract",
                    notes: `إلغاء مرتجع مشتريات مرفوض - ${transaction.reference || 'غير محدد'}`
                  }).unwrap();
                  console.log(`✅ تم إلغاء مرتجع المشتريات ${quantity}`);
                  break;
                  
                case "مرتجع مبيعات":
                  // إلغاء المرتجع (إضافة الكمية)
                  console.log(`➕ إلغاء مرتجع مبيعات ${quantity}`);
                  await updateStock({
                    productId: productId,
                    warehouseId: sourceWarehouse.id,
                    quantity: quantity,
                    operation_type: "add",
                    notes: `إلغاء مرتجع مبيعات مرفوض - ${transaction.reference || 'غير محدد'}`
                  }).unwrap();
                  console.log(`✅ تم إلغاء مرتجع المبيعات ${quantity}`);
                  break;
                  
                default:
                  console.log(`❓ نوع حركة غير معروف: ${transaction.type}`);
              }
            } catch (itemError) {
              console.error(`❌ خطأ في إلغاء تغيير المنتج ${item.itemName}:`, itemError);
              toast({
                title: "خطأ في إلغاء التغيير",
                description: `حدث خطأ في إلغاء تغيير كمية ${item.itemName}`,
                variant: "destructive"
              });
            }
          }
          
          console.log("✅ تم إلغاء جميع التغييرات بنجاح");
          toast({
            title: "تم الرفض وإلغاء التغييرات",
            description: `تم رفض الحركة ${transactionId} وإلغاء جميع التغييرات في المخزون بنجاح`,
          });
          
          // إعادة جلب المنتجات لتحديث الكميات المعروضة
          refetchAllProducts();
          
        } catch (stockError) {
          console.error("❌ خطأ في إلغاء التغييرات:", stockError);
          toast({
            title: "تحذير",
            description: "تم رفض الحركة ولكن حدث خطأ في إلغاء التغييرات - يرجى مراجعة المخزون يدوياً",
            variant: "destructive"
          });
        }
      } else {
        // إذا كانت الحركة في حالة مسودة، لا نحتاج لإلغاء تغييرات
        toast({
          title: "تم الرفض",
          description: `تم رفض الحركة ${transactionId} بنجاح`,
        });
      }

      // إعادة جلب الحركات
      refetchTransactions();
      
    } catch (error: any) {
      console.error("❌ خطأ في رفض الحركة:", error);
      toast({
        title: "خطأ في الرفض",
        description: error?.data?.message || "حدث خطأ أثناء رفض الحركة",
        variant: "destructive"
      });
    }
  };

  const handlePrint = (transactionId: string) => {
    const transaction = allTransactions.find((t: Transaction) => t.id === transactionId);
    if (!transaction) return;

    // إنشاء محتوى الطباعة
    const printContent = `
      <html dir="rtl">
      <head>
        <title>حركة مخزنية - ${transaction.id}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
          .details { margin-bottom: 20px; }
          .details table { width: 100%; border-collapse: collapse; }
          .details td { padding: 8px; border: 1px solid #ddd; }
          .items table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          .items th, .items td { padding: 8px; border: 1px solid #ddd; text-align: center; }
          .items th { background-color: #f5f5f5; }
          .footer { margin-top: 30px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>حركة مخزنية</h1>
          <h2>${transaction.id}</h2>
        </div>
        
        <div class="details">
          <table>
            <tr><td><strong>نوع الحركة:</strong></td><td>${transaction.type}</td></tr>
            <tr><td><strong>التاريخ:</strong></td><td>${transaction.date} - ${transaction.time}</td></tr>
            <tr><td><strong>المستودع المرسل:</strong></td><td>${transaction.sourceWarehouse}</td></tr>
            ${transaction.targetWarehouse ? `<tr><td><strong>المستودع المستقبل:</strong></td><td>${transaction.targetWarehouse}</td></tr>` : ''}
            <tr><td><strong>المرجع:</strong></td><td>${transaction.reference}</td></tr>
            <tr><td><strong>المستخدم:</strong></td><td>${transaction.user}</td></tr>
            <tr><td><strong>الحالة:</strong></td><td>${transaction.status}</td></tr>
            <tr><td><strong>الفرع:</strong></td><td>${transaction.branchName}</td></tr>
            ${transaction.reason ? `<tr><td><strong>السبب:</strong></td><td>${transaction.reason}</td></tr>` : ''}
          </table>
        </div>
        
        <div class="items">
          <h3>الأصناف</h3>
          <table>
            <thead>
              <tr>
                <th>كود الصنف</th>
                <th>اسم الصنف</th>
                <th>الكمية</th>
                <th>الوحدة</th>
                ${transaction.items.some(item => item.price) ? '<th>السعر</th><th>الإجمالي</th>' : ''}
              </tr>
            </thead>
            <tbody>
              ${transaction.items.map(item => `
                <tr>
                  <td>${item.itemCode}</td>
                  <td>${item.itemName}</td>
                  <td>${item.quantity}</td>
                  <td>${item.unit}</td>
                  ${item.price ? `<td>${item.price}</td><td>${item.total || 0}</td>` : ''}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        ${transaction.notes ? `<div class="notes"><h3>ملاحظات</h3><p>${transaction.notes}</p></div>` : ''}
        
        <div class="footer">
          <p>تم الطباعة في: ${new Date().toLocaleDateString('ar-SA')} - ${new Date().toLocaleTimeString('ar-SA')}</p>
        </div>
      </body>
      </html>
    `;

    // فتح نافذة طباعة جديدة
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
      
      toast({
        title: "تم إرسال للطباعة",
        description: `تم إرسال الحركة ${transaction.id} للطباعة`,
      });
    }
  };

  const handleExport = (transactionId: string) => {
    const transaction = allTransactions.find((t: Transaction) => t.id === transactionId);
    if (!transaction) return;

    // إنشاء بيانات CSV
    const csvData = [
      ['حركة مخزنية', transaction.id],
      ['نوع الحركة', transaction.type],
      ['التاريخ', `${transaction.date} - ${transaction.time}`],
      ['المستودع المرسل', transaction.sourceWarehouse],
      ...(transaction.targetWarehouse ? [['المستودع المستقبل', transaction.targetWarehouse]] : []),
      ['المرجع', transaction.reference],
      ['المستخدم', transaction.user],
      ['الحالة', transaction.status],
      ['الفرع', transaction.branchName],
      ...(transaction.reason ? [['السبب', transaction.reason]] : []),
      [''], // سطر فارغ
      ['الأصناف'],
      ['كود الصنف', 'اسم الصنف', 'الكمية', 'الوحدة', ...(transaction.items.some(item => item.price) ? ['السعر', 'الإجمالي'] : [])],
      ...transaction.items.map(item => [
        item.itemCode,
        item.itemName,
        item.quantity.toString(),
        item.unit,
        ...(item.price ? [item.price.toString(), (item.total || 0).toString()] : [])
      ]),
      [''], // سطر فارغ
      ...(transaction.notes ? [['ملاحظات', transaction.notes]] : [])
    ];

    // تحويل البيانات لـ CSV
    const csvContent = csvData.map(row => 
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n');

    // إنشاء رابط التحميل
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `inventory_transaction_${transaction.id}_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "تم التصدير بنجاح",
      description: `تم تصدير الحركة ${transaction.id} كملف CSV`,
    });
  };

  const handleDelete = async (transactionId: string) => {
    const transaction = transactions.find((t: Transaction) => t.id === transactionId);
    if (transaction?.status === "مسودة" && confirm("هل أنت متأكد من حذف هذه الحركة؟")) {
      try {
        await deleteTransaction(transactionId).unwrap();
      toast({
        title: "تم الحذف",
        description: `تم حذف الحركة ${transactionId} بنجاح`,
      });
        refetchTransactions();
      } catch (error: any) {
        toast({
          title: "خطأ في الحذف",
          description: error?.data?.message || "حدث خطأ أثناء حذف الحركة",
          variant: "destructive"
        });
      }
    }
  };

  // استخدام المنتجات حسب المستودع المحدد
  const availableProductsByWarehouse = useMemo(() => {
    // تحديد المستودع المناسب حسب نوع الحركة
    const isReceivingTransaction = newTransaction.type === "استلام" || newTransaction.type === "توريد" || newTransaction.type === "مرتجع مشتريات";
    const selectedWarehouseName = isReceivingTransaction ? newTransaction.targetWarehouse : newTransaction.sourceWarehouse;
    
    console.log('🔍 فلترة المنتجات حسب المستودع:', {
      hasAllProductsData: !!allProductsData,
      hasProducts: !!(allProductsData?.data?.products || allProductsData?.products),
      productsLength: (allProductsData?.data?.products || allProductsData?.products)?.length || 0,
      transactionType: newTransaction.type,
      isReceivingTransaction,
      sourceWarehouse: newTransaction.sourceWarehouse,
      targetWarehouse: newTransaction.targetWarehouse,
      selectedWarehouseName,
      selectedBranch: newTransaction.branchId
    });
    
    if (!allProductsData) {
      console.log('❌ لا توجد بيانات منتجات');
      return [];
    }
    
    if (!selectedWarehouseName) {
      console.log('❌ لم يتم تحديد المستودع');
      return [];
    }
    
    // البحث عن المستودع المحدد في قائمة المستودعات
    const selectedWarehouseObj = warehouses.find(w => 
      (w.name_ar || w.name) === selectedWarehouseName
    );
    
    console.log('🏪 المستودع المحدد:', selectedWarehouseObj);
    
    // جلب جميع المنتجات
    const allProducts = allProductsData.data?.products || allProductsData.products || [];
    
    // فلترة المنتجات حسب المستودع
    const filteredProducts = allProducts.filter((product: any) => {
      // البحث في حقول المستودع المختلفة
      const productWarehouse = product.warehouse_id;
      const productBranch = product.branch_id;
      
      console.log('📦 منتج:', {
        id: product.product_id,
        name: product.name_ar || product.name_en,
        warehouse_id: productWarehouse,
        branch_id: productBranch,
        current_stock: product.current_stock,
        cost_price: product.cost_price
      });
      
      // إذا كان المنتج ينتمي للمستودع المحدد (مقارنة بالمعرف)
      if (selectedWarehouseObj && productWarehouse && String(productWarehouse) === String(selectedWarehouseObj.id)) {
        console.log('✅ منتج ينتمي للمستودع:', product.name_ar || product.name_en);
        return true;
      }
      
      // إذا كان المنتج ينتمي للفرع المحدد (كبديل)
      if (productBranch && newTransaction.branchId && String(productBranch) === String(newTransaction.branchId)) {
        console.log('✅ منتج ينتمي للفرع:', product.name_ar || product.name_en);
        return true;
      }
      
      return false;
    });
    
    console.log('🎯 المنتجات المفلترة حسب المستودع:', filteredProducts.length);
    console.log('📊 تفاصيل الفلترة:', {
      totalProducts: allProducts.length,
      selectedWarehouse: selectedWarehouseName,
      selectedWarehouseObj: selectedWarehouseObj,
      filteredCount: filteredProducts.length,
      firstProduct: filteredProducts[0] || 'لا توجد منتجات'
    });
    
    return filteredProducts;
  }, [allProductsData, newTransaction.type, newTransaction.sourceWarehouse, newTransaction.targetWarehouse, newTransaction.branchId, warehouses]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="container mx-auto space-y-8 animate-fade-in">
        {/* Header Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20 rounded-3xl blur-3xl opacity-30"></div>
          <Card className="relative backdrop-blur-sm bg-white/80 border-0 shadow-2xl rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-indigo-600/5"></div>
            <CardContent className="relative p-8">
              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
                      <Activity className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                        الحركات المخزنية
                      </h1>
                      <p className="text-lg text-slate-600 mt-1">تسجيل ومتابعة جميع حركات المخزون بشكل احترافي</p>
                    </div>
                  </div>
                </div>

                {/* معلومات الفرع والإحصائيات */}
                <div className="hidden md:flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{filteredTransactions.length}</div>
                    <div className="text-sm text-slate-500">إجمالي الحركات</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{branchStats?.items || 0}</div>
                    <div className="text-sm text-slate-500">الأصناف</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {isLoadingWarehouses ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto"></div>
                      ) : (
                        warehouses.length
                      )}
                    </div>
                    <div className="text-sm text-slate-500">
                      {isLoadingWarehouses ? "جاري التحميل..." : "المستودعات"}
                    </div>
                  </div>
                </div>
              </div>

              {/* معلومات الفرع الحالي */}
              <div className="mt-6 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-2xl border border-blue-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl">
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">الفرع الحالي</h3>
                    <p className="text-slate-600">{selectedBranch?.name || "لم يتم تحديد فرع"}</p>
                  </div>
                </div>
              </div>
                  
              
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/50 backdrop-blur-sm p-2 rounded-2xl shadow-lg border-0">
            <TabsTrigger 
              value="list" 
              className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
            >
              <Package className="w-4 h-4 mr-2" />
              قائمة الحركات
            </TabsTrigger>
            <TabsTrigger 
              value="add" 
              className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              {isEditing ? "تعديل حركة مخزنية" : "إضافة حركة جديدة"}
            </TabsTrigger>
          </TabsList>

          {/* قائمة الحركات */}
          <TabsContent value="list" className="space-y-6 animate-fade-in">
            {/* عرض حالة التحميل */}
            {isLoadingTransactions && (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-slate-600">جاري تحميل الحركات...</p>
              </div>
            )}

            {/* عرض الأخطاء */}
            {transactionsError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-700 mb-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="font-medium">خطأ في تحميل الحركات</span>
                </div>
                <p className="text-sm text-red-600">
                  {transactionsError?.data?.message || "حدث خطأ أثناء تحميل الحركات"}
                </p>
                <Button 
                  onClick={() => refetchTransactions()}
                  variant="outline" 
                  size="sm" 
                  className="mt-2 border-red-200 text-red-600 hover:bg-red-100"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  إعادة المحاولة
                </Button>
              </div>
            )}
            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4 mt-8">
              <Card className="backdrop-blur-sm bg-white/80 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">إجمالي الحركات</p>
                      <p className="text-3xl font-bold text-blue-600">{transactions.length}</p>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {transactionTypes.slice(0, 6).map((type, index) => (
                <Card key={type.value} className="backdrop-blur-sm bg-white/80 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl border-0 animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-500">{type.name_ar || type.label || type.value}</p>
                        <p className={`text-3xl font-bold ${type.color}`}>
                          {transactions.filter(t => t.type === (type.id || type.value)).length}
                        </p>
                      </div>
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${
                        type.color === 'text-green-600' ? 'from-green-500 to-emerald-500' :
                        type.color === 'text-red-600' ? 'from-red-500 to-rose-500' :
                        type.color === 'text-blue-600' ? 'from-blue-500 to-cyan-500' :
                        type.color === 'text-purple-600' ? 'from-purple-500 to-violet-500' :
                        type.color === 'text-orange-600' ? 'from-orange-500 to-amber-500' :
                        'from-indigo-500 to-purple-500'
                      }`}>
                        <type.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* البحث والفلترة */}
            <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      placeholder="البحث..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pr-10 bg-white/70 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="bg-white/70 border-slate-200 rounded-xl">
                      <SelectValue placeholder="نوع الحركة" />
                    </SelectTrigger>
                    <SelectContent className="bg-white rounded-xl shadow-xl">
                      <SelectItem value="all">جميع الأنواع</SelectItem>
                      {transactionTypes.map(type => {
                        const typeValue = type.id || type.value || `type-${type.id || Math.random()}`;
                        return (
                          <SelectItem key={type.id || type.value || Math.random()} value={typeValue}>
                            {type.name_ar || type.label || type.value || `نوع ${type.id}`}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>

                  <Select value={branchFilter} onValueChange={setBranchFilter}>
                    <SelectTrigger className="bg-white/70 border-slate-200 rounded-xl">
                      <SelectValue placeholder="الفرع" />
                    </SelectTrigger>
                    <SelectContent className="bg-white rounded-xl shadow-xl">
                      <SelectItem value="all">جميع الفروع</SelectItem>
                      {getActiveBranches().map(branch => (
                        <SelectItem key={branch.id} value={branch.id}>
                          {branch.name_ar || branch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
                    <SelectTrigger className="bg-white/70 border-slate-200 rounded-xl">
                      <SelectValue placeholder="المستودع" />
                    </SelectTrigger>
                    <SelectContent className="bg-white rounded-xl shadow-xl">
                      <SelectItem value="all">جميع المستودعات</SelectItem>
                      {warehouses.map(warehouse => (
                        <SelectItem key={warehouse.id} value={warehouse.id}>
                            {warehouse.name_ar || warehouse.name}
                          </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="bg-white/70 border-slate-200 rounded-xl">
                      <SelectValue placeholder="الحالة" />
                    </SelectTrigger>
                    <SelectContent className="bg-white rounded-xl shadow-xl">
                      <SelectItem value="all">جميع الحالات</SelectItem>
                      <SelectItem value="approved">معتمدة</SelectItem>
                      <SelectItem value="rejected">غير معتمدة</SelectItem>
                      <SelectItem value="مسودة">مسودة</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={userFilter} onValueChange={setUserFilter}>
                    <SelectTrigger className="bg-white/70 border-slate-200 rounded-xl">
                      <SelectValue placeholder="المستخدم" />
                    </SelectTrigger>
                    <SelectContent className="bg-white rounded-xl shadow-xl">
                      <SelectItem value="all">جميع المستخدمين</SelectItem>
                      {users.map(user => {
                        const userValue = user.id || user || `user-${Math.random()}`;
                        return (
                          <SelectItem key={user.id || user || Math.random()} value={String(userValue)}>
                            {user.name_ar || user.name || user || `مستخدم ${user.id}`}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>

                  <Button 
                    variant="outline" 
                    className="bg-white hover:bg-blue-50 border-blue-200 text-blue-600 rounded-xl px-4 py-2 shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    فلترة متقدمة
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="space-y-4">
                  {filteredTransactions.map((transaction, index) => (
                    <Card key={transaction.id} className="hover:shadow-xl transition-all duration-300 rounded-2xl border-l-4 border-l-blue-500 animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <Badge variant="outline" className="text-xs font-mono bg-blue-50 text-blue-700 border-blue-200">
                                {transaction.id}
                              </Badge>
                              <Badge className={`${getTypeColor(transaction.type)} bg-opacity-10 border rounded-full px-3 py-1`}>
                                <div className="flex items-center gap-1">
                                  {getTypeIcon(transaction.type)}
                                  {transactionTypes.find((t: any) => (t.id || t.value) === transaction.type)?.name_ar || transaction.type}
                                </div>
                              </Badge>
                              <Badge className={`${getStatusColor(transaction.status)} rounded-full px-3 py-1`}>
                                {getStatusText(transaction.status)}
                              </Badge>
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 rounded-full">
                                <Building2 className="w-3 h-3 mr-1" />
                                {transaction.branchName}
                              </Badge>
                            </div>
                            
                            <CardTitle className="text-lg flex items-center gap-2">
                              <Warehouse className="w-5 h-5 text-blue-600" />
                              {transaction.sourceWarehouse}
                              {transaction.targetWarehouse && (
                                <>
                                  <ArrowRightLeft className="w-4 h-4 text-slate-400" />
                                  {transaction.targetWarehouse}
                                </>
                              )}
                            </CardTitle>
                            
                            <CardDescription className="mt-1 flex items-center gap-4 text-sm flex-wrap">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {transaction.date} - {transaction.time}
                              </span>
                              <span className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {transaction.user}
                              </span>
                              {transaction.reference && (
                                <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-700">
                                  {transaction.reference}
                                </Badge>
                              )}
                            </CardDescription>
                          </div>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="hover:bg-blue-50 rounded-xl">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white rounded-xl shadow-xl border-0">
                              <DropdownMenuItem className="hover:bg-blue-50" onClick={() => handleView(transaction.id)}>
                                <Eye className="w-4 h-4 mr-2" />
                                عرض التفاصيل
                              </DropdownMenuItem>
                              {transaction.status === "مسودة" && (
                                <DropdownMenuItem className="hover:bg-amber-50" onClick={() => handleEdit(transaction.id)}>
                                  <Edit className="w-4 h-4 mr-2" />
                                  تعديل
                                </DropdownMenuItem>
                              )}
                              {transaction.status === "rejected" && (
                                <DropdownMenuItem className="hover:bg-green-50" onClick={() => handleApprove(transaction.id)}>
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  اعتماد
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem className="hover:bg-blue-50" onClick={() => handlePrint(transaction.id)}>
                                <Printer className="w-4 h-4 mr-2" />
                                طباعة
                              </DropdownMenuItem>
                              <DropdownMenuItem className="hover:bg-green-50" onClick={() => handleExport(transaction.id)}>
                                <Download className="w-4 h-4 mr-2" />
                                تصدير
                              </DropdownMenuItem>
                              {transaction.status === "مسودة" && (
                                <DropdownMenuItem className="hover:bg-red-50 text-red-600" onClick={() => handleDelete(transaction.id)}>
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  حذف
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        {transaction.reason && (
                          <div className="mb-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                            <p className="text-sm text-blue-700">السبب: {transaction.reason}</p>
                          </div>
                        )}
                        
                        <div className="pt-3 border-t border-slate-100">
                          <p className="text-sm font-medium text-slate-600 mb-2">الأصناف ({transaction.items.length}):</p>
                          <div className="space-y-2">
                            {transaction.items.slice(0, 3).map((item: TransactionItem, index: number) => (
                              <div key={index} className="flex justify-between items-center text-sm bg-slate-50 p-2 rounded-lg">
                                <span className="flex items-center gap-2">
                                  <code className="text-xs bg-white px-2 py-1 rounded border border-slate-200">{item.itemCode}</code>
                                  {item.itemName}
                                </span>
                                <span className={`font-medium px-2 py-1 rounded-full text-xs ${
                                  item.quantity > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                  {item.quantity > 0 ? '+' : ''}{item.quantity} {item.unit}
                                  {item.price && item.price > 0 && (
                                    <span className="text-slate-500 mr-2">
                                      ({item.total?.toLocaleString()} جنيه مصري)
                                    </span>
                                  )}
                                </span>
                              </div>
                            ))}
                            {transaction.items.length > 3 && (
                              <p className="text-xs text-slate-500 text-center py-2">
                                ... و {transaction.items.length - 3} أصناف أخرى
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-2 mt-4">
                          <Button size="sm" variant="outline" className="flex-1 bg-white hover:bg-blue-50 border-blue-200 text-blue-600 rounded-xl" onClick={() => handleView(transaction.id)}>
                            <Eye className="w-4 h-4 mr-2" />
                            عرض التفاصيل
                          </Button>
                          
                          {/* أزرار تغيير الحالة */}
                          {transaction.status === "مسودة" && (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="flex-1 bg-white hover:bg-green-50 border-green-200 text-green-600 rounded-xl" 
                                onClick={() => handleApprove(transaction.id)}
                                disabled={isApproving}
                              >
                                {isApproving ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mx-auto"></div>
                                ) : (
                                  <>
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    اعتماد
                                  </>
                                )}
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="flex-1 bg-white hover:bg-red-50 border-red-200 text-red-600 rounded-xl" 
                                onClick={() => handleReject(transaction.id)}
                                disabled={isApproving}
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                رفض
                              </Button>
                            </>
                          )}
                          
                          {transaction.status === "مسودة" && (
                            <Button size="sm" variant="outline" className="flex-1 bg-white hover:bg-amber-50 border-amber-200 text-amber-600 rounded-xl" onClick={() => handleEdit(transaction.id)}>
                              <Edit className="w-4 h-4 mr-2" />
                              تعديل
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {filteredTransactions.length === 0 && (
                  <div className="text-center py-16 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl border-2 border-dashed border-slate-300">
                    <div className="animate-fade-in">
                      <div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                        <Package className="h-10 w-10 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-700 mb-2">لا توجد حركات</h3>
                      <p className="text-slate-500">لم يتم العثور على حركات تطابق البحث</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* إضافة حركة جديدة */}
          <TabsContent value="add" className="space-y-6 animate-fade-in">
            <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl">
                    <Plus className="h-5 w-5 text-white" />
                  </div>
                  إضافة حركة مخزنية جديدة
                </CardTitle>
                <CardDescription className="text-slate-600">
                  املأ البيانات أدناه لإنشاء حركة مخزنية جديدة مع ربطها بالفرع المناسب
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-6 space-y-8">
                {/* معلومات الفرع */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl">
                      <Building2 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">معلومات الفرع</h3>
                      <p className="text-slate-600">الفرع المحدد لإنشاء الحركة المخزنية</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-blue-100">
                      <div className="text-sm text-slate-500">الفرع الحالي</div>
                      <div className="text-lg font-semibold text-blue-600">
                        {selectedBranch?.name || "لم يتم تحديد فرع"}
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-green-100">
                      <div className="text-sm text-slate-500">المستودعات المتاحة</div>
                      <div className="text-lg font-semibold text-green-600">
                        {warehouses.length}
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-purple-100">
                      <div className="text-sm text-slate-500">حالة الفرع</div>
                      <div className="text-lg font-semibold">
                        <Badge 
                          variant={selectedBranch?.status === 'active' ? 'default' : 'secondary'}
                          className={selectedBranch?.status === 'active' ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'}
                        >
                          {selectedBranch?.status === 'active' ? 'نشط' : 'صيانة'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* البيانات الأساسية */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="branchSelect" className="text-slate-700 font-medium flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      الفرع *
                    </Label>
                    <Select 
                      value={newTransaction.branchId}
                      onValueChange={(value) => {
                        const branch = branches.find(b => b.id === value);
                        setNewTransaction(prev => ({ 
                          ...prev, 
                          branchId: value,
                          branchName: branch?.name || "",
                          sourceWarehouse: "", // إعادة تعيين المستودع عند تغيير الفرع
                          targetWarehouse: ""
                        }));
                      }}
                    >
                      <SelectTrigger className="bg-white/70 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-12">
                        <SelectValue placeholder="اختر الفرع" />
                      </SelectTrigger>
                      <SelectContent className="bg-white rounded-xl shadow-xl border-slate-200">
                        {getActiveBranches().map((branch) => (
                          <SelectItem key={branch.id} value={branch.id}>
                            <div className="flex items-center gap-2">
                              {branch.name}
                              {branch.type === 'main' && (
                                <Badge variant="secondary" className="text-xs">رئيسي</Badge>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="transactionType" className="text-slate-700 font-medium">نوع الحركة *</Label>
                    <Select onValueChange={(value) => setNewTransaction(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger className="bg-white/70 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-12">
                        <SelectValue placeholder="اختر نوع الحركة" />
                      </SelectTrigger>
                      <SelectContent className="bg-white rounded-xl shadow-xl border-slate-200">
                        {transactionTypes.map(type => {
                          const typeValue = type.id || type.value || `type-${type.id || Math.random()}`;
                          return (
                            <SelectItem key={type.id || type.value || Math.random()} value={typeValue}>
                              <div className="flex items-center gap-2">
                                {type.icon && <type.icon className="w-4 h-4" />}
                                {type.name_ar || type.label || type.value || `نوع ${type.id}`}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* حقل المستودع يتغير حسب نوع الحركة */}
                  {(newTransaction.type === "استلام" || newTransaction.type === "توريد" || newTransaction.type === "مرتجع مشتريات") ? (
                    // حركات الاستلام تحتاج للمستودع المستهدف فقط
                    <div className="space-y-3">
                      <Label htmlFor="targetWarehouse" className="text-slate-700 font-medium flex items-center gap-2">
                        <Warehouse className="h-4 w-4" />
                        المستودع المستهدف *
                      </Label>
                      <Select 
                        value={newTransaction.targetWarehouse}
                        onValueChange={(value) => {
                          setNewTransaction(prev => ({ ...prev, targetWarehouse: value }));
                          // إعادة تعيين حالة عرض المنتجات عند تغيير المستودع
                          setShowProductsList(false);
                          setSearchTermForProducts("");
                        }}
                        disabled={!newTransaction.branchId || isLoadingWarehouses || warehouses.length === 0}
                      >
                        <SelectTrigger className="bg-white/70 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-12">
                          <SelectValue 
                            placeholder={
                              isLoadingWarehouses
                                ? "جاري التحميل..."
                                : !newTransaction.branchId 
                                ? "يرجى اختيار الفرع أولاً" 
                                : warehouses.length === 0 
                                ? "لا توجد مستودعات متاحة" 
                                : "اختر المستودع المستهدف"
                            } 
                          />
                        </SelectTrigger>
                        <SelectContent className="bg-white rounded-xl shadow-xl border-slate-200">
                          {isLoadingWarehouses ? (
                            <div className="p-4 text-center text-slate-500">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mx-auto mb-2"></div>
                              جاري تحميل المستودعات...
                            </div>
                          ) : (
                            warehouses.map(warehouse => {
                              const warehouseValue = warehouse.name_ar || warehouse.name || warehouse.id?.toString() || `warehouse-${warehouse.id || Math.random()}`;
                              return (
                                <SelectItem key={warehouse.id || Math.random()} value={warehouseValue}>
                                  <div className="flex items-center gap-2">
                                    {warehouse.name_ar || warehouse.name || `مستودع ${warehouse.id}`}
                                    {warehouse.type === 'main' && (
                                      <Badge variant="secondary" className="text-xs">رئيسي</Badge>
                                    )}
                                  </div>
                                </SelectItem>
                              );
                            })
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    // باقي الحركات تحتاج للمستودع المصدر
                    <div className="space-y-3">
                      <Label htmlFor="sourceWarehouse" className="text-slate-700 font-medium flex items-center gap-2">
                        <Warehouse className="h-4 w-4" />
                        المستودع المصدر *
                      </Label>
                      <Select 
                        value={newTransaction.sourceWarehouse}
                        onValueChange={(value) => {
                          setNewTransaction(prev => ({ ...prev, sourceWarehouse: value }));
                          // إعادة تعيين حالة عرض المنتجات عند تغيير المستودع
                          setShowProductsList(false);
                          setSearchTermForProducts("");
                        }}
                        disabled={!newTransaction.branchId || isLoadingWarehouses || warehouses.length === 0}
                      >
                        <SelectTrigger className="bg-white/70 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-12">
                          <SelectValue 
                            placeholder={
                              isLoadingWarehouses
                                ? "جاري التحميل..."
                                : !newTransaction.branchId 
                                ? "يرجى اختيار الفرع أولاً" 
                                : warehouses.length === 0 
                                ? "لا توجد مستودعات متاحة" 
                                : "اختر المستودع المصدر"
                            } 
                          />
                        </SelectTrigger>
                        <SelectContent className="bg-white rounded-xl shadow-xl border-slate-200">
                          {isLoadingWarehouses ? (
                            <div className="p-4 text-center text-slate-500">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mx-auto mb-2"></div>
                              جاري تحميل المستودعات...
                            </div>
                          ) : (
                            warehouses.map(warehouse => {
                              const warehouseValue = warehouse.name_ar || warehouse.name || warehouse.id?.toString() || `warehouse-${warehouse.id || Math.random()}`;
                              return (
                                <SelectItem key={warehouse.id || Math.random()} value={warehouseValue}>
                                  <div className="flex items-center gap-2">
                                    {warehouse.name_ar || warehouse.name || `مستودع ${warehouse.id}`}
                                    {warehouse.type === 'main' && (
                                      <Badge variant="secondary" className="text-xs">رئيسي</Badge>
                                    )}
                                  </div>
                                </SelectItem>
                              );
                            })
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* حركة التحويل تحتاج للمستودع المستهدف أيضاً */}
                  {newTransaction.type === "تحويل" && (
                    <div className="space-y-3">
                      <Label htmlFor="targetWarehouse" className="text-slate-700 font-medium flex items-center gap-2">
                        <Warehouse className="h-4 w-4" />
                        المستودع المستقبل *
                      </Label>
                      <Select 
                        value={newTransaction.targetWarehouse}
                        onValueChange={(value) => setNewTransaction(prev => ({ ...prev, targetWarehouse: value }))}
                      >
                        <SelectTrigger className="bg-white/70 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-12">
                          <SelectValue placeholder="اختر المستودع المستقبل" />
                        </SelectTrigger>
                        <SelectContent className="bg-white rounded-xl shadow-xl border-slate-200">
                          {warehouses
                            .filter(w => (w.name_ar || w.name) !== newTransaction.sourceWarehouse)
                            .map(warehouse => {
                              const warehouseValue = warehouse.name_ar || warehouse.name || warehouse.id?.toString() || `warehouse-${warehouse.id || Math.random()}`;
                              return (
                                <SelectItem key={warehouse.id || Math.random()} value={warehouseValue}>
                                  <div className="flex items-center gap-2">
                                    {warehouse.name_ar || warehouse.name || `مستودع ${warehouse.id}`}
                                    {warehouse.type === 'main' && (
                                      <Badge variant="secondary" className="text-xs">رئيسي</Badge>
                                    )}
                                  </div>
                                </SelectItem>
                              );
                            })}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* حقول خاصة بمرتجع المشتريات */}
                  {newTransaction.type === "مرتجع مشتريات" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200">
                      <div className="md:col-span-2">
                        <h4 className="text-lg font-semibold text-amber-800 mb-4 flex items-center gap-2">
                          <ArrowLeft className="w-5 h-5" />
                          بيانات أمر الشراء
                        </h4>
                      </div>
                      
                      <div className="space-y-3">
                        <Label htmlFor="purchaseOrder" className="text-slate-700 font-medium">رقم أمر الشراء *</Label>
                        <Select 
                          value={newTransaction.reference}
                          onValueChange={(value) => {
                            const selectedPO = purchaseOrders.find(po => po.id === value);
                            setNewTransaction(prev => ({ 
                              ...prev, 
                              reference: value,
                              notes: selectedPO ? `مرتجع من أمر الشراء: ${selectedPO.id} - المورد: ${selectedPO.supplier}` : prev.notes
                            }));
                          }}
                        >
                          <SelectTrigger className="bg-white border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent h-12">
                            <SelectValue placeholder="اختر أمر الشراء" />
                          </SelectTrigger>
                          <SelectContent className="bg-white rounded-xl shadow-xl border-slate-200">
                            {purchaseOrders.map(po => (
                              <SelectItem key={po.id} value={po.id}>
                                {po.id} - {po.supplier}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="grnNumber" className="text-slate-700 font-medium">رقم سند الاستلام</Label>
                        <Select 
                          value={newTransaction.notes?.split('GRN:')?.[1]?.split(' ')?.[0] || ""}
                          onValueChange={(value) => {
                            setNewTransaction(prev => ({ 
                              ...prev, 
                              notes: `${prev.notes} - GRN: ${value}`
                            }));
                          }}
                        >
                          <SelectTrigger className="bg-white border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent h-12">
                            <SelectValue placeholder="اختج.مند الاستلام" />
                          </SelectTrigger>
                          <SelectContent className="bg-white rounded-xl shadow-xl border-slate-200">
                            {goodsReceipts
                              .filter(grn => grn.poNumber === newTransaction.reference)
                              .map(grn => (
                                <SelectItem key={grn.id} value={grn.id}>
                                  {grn.id}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="supplier" className="text-slate-700 font-medium">اسم المورد</Label>
                        <Input
                          id="supplier"
                          value={purchaseOrders.find(po => po.id === newTransaction.reference)?.supplier || ""}
                          placeholder="سيتم سحبه تلقائياً من أمر الشراء"
                          className="bg-gray-50 border-slate-200 rounded-xl h-12"
                          disabled
                        />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="returnReason" className="text-slate-700 font-medium">سبب المرتجع *</Label>
                        <Select 
                          value={newTransaction.reason}
                          onValueChange={(value) => setNewTransaction(prev => ({ ...prev, reason: value }))}
                        >
                          <SelectTrigger className="bg-white border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent h-12">
                            <SelectValue placeholder="اختج.مبب المرتجع" />
                          </SelectTrigger>
                          <SelectContent className="bg-white rounded-xl shadow-xl border-slate-200">
                            <SelectItem value="عيب في التصنيع">عيب في التصنيع</SelectItem>
                            <SelectItem value="كمية زائدة">كمية زائدة</SelectItem>
                            <SelectItem value="عدم مطابقة المواصفات">عدم مطابقة المواصفات</SelectItem>
                            <SelectItem value="تلف أثناء النقل">تلف أثناء النقل</SelectItem>
                            <SelectItem value="انتهاء صلاحية">انتهاء صلاحية</SelectItem>
                            <SelectItem value="أخرى">أخرى</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <Label htmlFor="transactionDate" className="text-slate-700 font-medium">التاريخ *</Label>
                    <Input
                      id="transactionDate"
                      type="date"
                      value={newTransaction.date}
                      onChange={(e) => setNewTransaction(prev => ({ ...prev, date: e.target.value }))}
                      className="bg-white/70 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-12"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="transactionTime" className="text-slate-700 font-medium">الوقت *</Label>
                    <Input
                      id="transactionTime"
                      type="time"
                      value={newTransaction.time}
                      onChange={(e) => setNewTransaction(prev => ({ ...prev, time: e.target.value }))}
                      className="bg-white/70 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-12"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="reference" className="text-slate-700 font-medium">رقم المرجع</Label>
                    <Input
                      id="reference"
                      value={newTransaction.reference}
                      onChange={(e) => setNewTransaction(prev => ({ ...prev, reference: e.target.value }))}
                      placeholder="PO-1234 أو AUTO"
                      className="bg-white/70 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-12"
                    />
                  </div>
                </div>

                  {/* حقول الملاحظات - مخفية في حالة مرتجع المشتريات */}
                  {newTransaction.type !== "مرتجع مشتريات" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="reason" className="text-slate-700 font-medium">سبب الحركة</Label>
                        <Textarea
                          id="reason"
                          value={newTransaction.reason}
                          onChange={(e) => setNewTransaction(prev => ({ ...prev, reason: e.target.value }))}
                          placeholder="اكتب سبب الحركة..."
                          rows={3}
                          className="bg-white/70 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="notes" className="text-slate-700 font-medium">ملاحظات إضافية</Label>
                        <Textarea
                          id="notes"
                          value={newTransaction.notes}
                          onChange={(e) => setNewTransaction(prev => ({ ...prev, notes: e.target.value }))}
                          placeholder="ملاحظات اختيارية..."
                          rows={3}
                          className="bg-white/70 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}

                {/* إضافة الأصناف */}
                <div className="border-t pt-6 border-slate-200">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-slate-800">
                    <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl">
                      <Package className="h-5 w-5 text-white" />
                    </div>
                    إضافة الأصناف
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                    <div className="lg:col-span-2 space-y-3">
                      <Label htmlFor="itemSearch" className="text-slate-700 font-medium">البحث عن صنف</Label>
                      <div className="relative">
                        <Input
                          id="itemSearch"
                          value={newItem.itemCode}
                          onChange={(e) => {
                            const searchValue = e.target.value;
                            setNewItem(prev => ({ ...prev, itemCode: searchValue }));
                            setSearchTermForProducts(searchValue);
                          }}
                          onFocus={() => {
                            console.log('🔍 تم الضغط على حقل البحث');
                            console.log('📊 حالة البيانات:', {
                              allProducts: allProductsData?.data?.products?.length || allProductsData?.products?.length || 0,
                              allAvailableProducts: Array.isArray(allAvailableProducts) ? allAvailableProducts.length : 0,
                              showProductsList: showProductsList
                            });
                            setShowProductsList(true);
                          }}
                          placeholder="اضغط هنا لعرض جميع المنتجات"
                          className="bg-white border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                        />
                        <Button 
                          type="button" 
                          size="icon" 
                          variant="ghost" 
                          className="absolute left-1 top-1/2 transform -translate-y-1/2 hover:bg-blue-50"
                          title="مسح باركود"
                        >
                          <Scan className="w-4 h-4 text-blue-600" />
                        </Button>
                      </div>
                      
                      {/* زر عرض جميع المنتجات */}
                      <div className="flex gap-2">
                        <Button 
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const isReceivingTransaction = newTransaction.type === "استلام" || newTransaction.type === "توريد" || newTransaction.type === "مرتجع مشتريات";
                            const selectedWarehouse = isReceivingTransaction ? newTransaction.targetWarehouse : newTransaction.sourceWarehouse;
                            
                            if (!selectedWarehouse) {
                              toast({
                                title: "تحذير",
                                description: "يرجى اختيار المستودع أولاً لعرض المنتجات",
                                variant: "destructive"
                              });
                              return;
                            }
                            setShowProductsList(!showProductsList);
                            setSearchTermForProducts(""); // مسح البحث
                          }}
                          disabled={!newTransaction.sourceWarehouse && !newTransaction.targetWarehouse}
                          className={`flex-1 rounded-lg ${
                            (!newTransaction.sourceWarehouse && !newTransaction.targetWarehouse)
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-white hover:bg-blue-50 border-blue-200 text-blue-600'
                          }`}
                        >
                          {showProductsList ? (
                            <>
                              <X className="w-4 h-4 mr-2" />
                              إخفاء المنتجات
                            </>
                          ) : (
                            <>
                              <Package className="w-4 h-4 mr-2" />
                              عرض منتجات المستودع
                            </>
                          )}
                        </Button>
                        
                        <Button 
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSearchTermForProducts("");
                            setNewItem(prev => ({ ...prev, itemCode: "" }));
                          }}
                          className="bg-white hover:bg-red-50 border-red-200 text-red-600 rounded-lg"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      
                                            {/* رسالة حالة البحث */}
                      {!allProductsData && (
                        <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded-lg border border-blue-200">
                          جاري تحميل المنتجات...
                        </div>
                      )}
                      
                      {allProductsData && (!allProductsData.data?.products && !allProductsData.products) && (
                        <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded-lg border border-amber-200">
                          ⚠️ لا توجد منتجات في النظام
                        </div>
                      )}
                      
                      {/* رسالة تحذير إذا لم يتم تحديد المستودع */}
                      {allProductsData && (() => {
                        const isReceivingTransaction = newTransaction.type === "استلام" || newTransaction.type === "توريد" || newTransaction.type === "مرتجع مشتريات";
                        const selectedWarehouse = isReceivingTransaction ? newTransaction.targetWarehouse : newTransaction.sourceWarehouse;
                        return !selectedWarehouse;
                      })() && (
                        <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded-lg border border-amber-200">
                          ⚠️ يرجى اختيار المستودع أولاً لعرض المنتجات
                        </div>
                      )}

                      {/* رسالة خطأ جلب المنتجات */}
                      {productsError && (
                        <div className="text-xs text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
                          ❌ خطأ في جلب المنتجات: {(productsError as any)?.data?.message || 'خطأ غير معروف'}
                          <br />
                          <small>تأكد من أن الخادم الخلفي يعمل على المنفذ 4000</small>
                        </div>
                      )}
                      
                      {/* عرض الكميات الحالية للمنتجات */}
                      {allAvailableProducts.length > 0 && (
                        <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
                          <h4 className="text-sm font-semibold text-green-800 mb-3">📊 الكميات الحالية في المستودع</h4>
                          <div className="space-y-2 max-h-40 overflow-y-auto">
                            {allAvailableProducts.slice(0, 5).map((product: any, index: number) => (
                              <div key={product.product_id} className="flex justify-between items-center text-sm bg-white p-2 rounded-lg border border-green-100">
                                <span className="font-medium text-green-700">
                                  {product.name_ar || product.name_en}
                                </span>
                                <span className="font-bold text-green-600 bg-green-100 px-2 py-1 rounded">
                                  {product.current_stock || 0} متوفر
                                </span>
                              </div>
                            ))}
                            {allAvailableProducts.length > 5 && (
                              <div className="text-xs text-green-600 text-center">
                                ... و {allAvailableProducts.length - 5} منتج آخر
                              </div>
                            )}
                          </div>
                          <div className="mt-3 text-xs text-green-600">
                            آخر تحديث: {new Date().toLocaleTimeString('ar-SA')}
                          </div>
                        </div>
                      )}
                      
                                            {/* قائمة الأصناف المتاحة */}
                      {showProductsList && (
                        <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="text-xs text-gray-600 mb-2">
                            <strong>تشخيص:</strong> 
                            المستودع المحدد: {newTransaction.sourceWarehouse || 'لم يتم تحديد مستودع'} | 
                            المنتجات الكلية: {(allProductsData?.data?.products || allProductsData?.products)?.length || 0} | 
                            المنتجات في المستودع: {Array.isArray(availableProductsByWarehouse) ? availableProductsByWarehouse.length : 0} | 
                            عرض القائمة: {showProductsList ? 'نعم' : 'لا'}
                          </div>
                        </div>
                      )}
                      
                      {showProductsList && Array.isArray(availableProductsByWarehouse) && availableProductsByWarehouse.length > 0 && (
                        <div className="mt-2 max-h-96 overflow-y-auto border rounded-xl bg-white shadow-lg">
                          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200">
                            <div className="flex items-center justify-between">
                              <div>
                                {(() => {
                                  const isReceivingTransaction = newTransaction.type === "استلام" || newTransaction.type === "توريد" || newTransaction.type === "مرتجع مشتريات";
                                  const selectedWarehouse = isReceivingTransaction ? newTransaction.targetWarehouse : newTransaction.sourceWarehouse;
                                  return (
                                    <>
                                      <span className="text-lg font-semibold text-blue-700">
                                        المنتجات في المستودع: {selectedWarehouse || 'غير محدد'}
                                      </span>
                                      <p className="text-sm text-blue-600 mt-1">
                                        {selectedWarehouse 
                                          ? 'اضغط على أي منتج لاختياره' 
                                          : 'يرجى اختيار المستودع أولاً'
                                        }
                                      </p>
                                    </>
                                  );
                                })()}
                              </div>
                              <div className="text-xs text-blue-600 bg-blue-100 px-3 py-2 rounded-full font-medium">
                                {Array.isArray(availableProductsByWarehouse) ? availableProductsByWarehouse.length : 0} منتج
                              </div>
                            </div>
                          </div>
                          
                          {/* فلترة المنتجات حسب البحث */}
                          {availableProductsByWarehouse
                            .filter(item => {
                              if (!searchTermForProducts) return true; // عرض جميع المنتجات إذا لم يتم البحث
                              
                              const searchTerm = searchTermForProducts.toLowerCase();
                              const itemCode = item.product_id.toLowerCase();
                              const itemName = (item.name_ar || item.name_en || '').toLowerCase();
                              
                              return itemCode.includes(searchTerm) || itemName.includes(searchTerm);
                            })
                            .slice(0, 30) // عرض أول 30 نتيجة
                            .map((item, index) => (
                              <div 
                                key={item.product_id}
                                className={`p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 cursor-pointer border-b last:border-b-0 transition-all duration-200 ${
                                  index % 2 === 0 ? 'bg-white' : 'bg-slate-25'
                                }`}
                                onClick={() => {
                                  selectItem(item);
                                  setShowProductsList(false); // إخفاء القائمة بعد الاختيار
                                }}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <div className="font-semibold text-slate-800 text-lg mb-1">
                                      {item.name_ar || item.name_en}
                                    </div>
                                    <div className="text-sm text-slate-600 mb-2">
                                      <span className="font-mono bg-slate-100 px-2 py-1 rounded text-blue-600">
                                        {item.product_id}
                                      </span>
                                      <span className="mx-2">•</span>
                                      <span className="text-slate-500">
                                        {item.unit_of_measure || "  "}
                                      </span>
                                    </div>
                                    {item.cost_price && item.cost_price > 0 && (
                                      <div className="text-sm text-green-600 font-medium bg-green-50 px-2 py-1 rounded inline-block">
                                        💰 السعر: {item.cost_price} جنيه مصري
                                      </div>
                                    )}
                                  </div>
                                  <div className="text-right">
                                    <div className={`text-sm font-bold px-3 py-2 rounded-full ${
                                      (item.current_stock || 0) > 0 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'bg-red-100 text-red-700'
                                    }`}>
                                      📦 {(item.current_stock || 0)} متوفر
                                    </div>
                                    <div className="text-xs text-slate-500 mt-1">
                                      اضغط للاختيار
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          }
                          
                          {/* رسالة عند عدم وجود نتائج للبحث */}
                          {searchTermForProducts && availableProductsByWarehouse.filter(item => {
                            const searchTerm = searchTermForProducts.toLowerCase();
                            const itemCode = item.product_id.toLowerCase();
                            const itemName = (item.name_ar || item.name_en || '').toLowerCase();
                            return itemCode.includes(searchTerm) || itemName.includes(searchTerm);
                          }).length === 0 && (
                            <div className="p-8 text-center text-slate-500">
                              <Package className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                              <div className="text-lg font-medium mb-2">لا توجد منتجات تطابق البحث</div>
                              <div className="text-sm">جرب كلمات بحث مختلفة</div>
                            </div>
                          )}
                          
                          {/* رسالة عند عدم وجود منتجات */}
                          {!searchTermForProducts && Array.isArray(availableProductsByWarehouse) && availableProductsByWarehouse.length === 0 && (
                            <div className="p-8 text-center text-slate-500">
                              <Package className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                              {(() => {
                                const isReceivingTransaction = newTransaction.type === "استلام" || newTransaction.type === "توريد" || newTransaction.type === "مرتجع مشتريات";
                                const selectedWarehouse = isReceivingTransaction ? newTransaction.targetWarehouse : newTransaction.sourceWarehouse;
                                return (
                                  <>
                                    <div className="text-lg font-medium mb-2">
                                      لا توجد منتجات في المستودع: {selectedWarehouse || 'غير محدد'}
                                    </div>
                                    <div className="text-sm">
                                      {!selectedWarehouse 
                                        ? 'يرجى اختيار المستودع أولاً' 
                                        : 'تأكد من وجود منتجات في هذا المستودع'
                                      }
                                    </div>
                                  </>
                                );
                              })()}
                            </div>
                          )}
                          
                          {/* زر إغلاق القائمة */}
                          <div className="p-4 border-t border-slate-200 bg-slate-50">
                            <Button 
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setShowProductsList(false)}
                              className="w-full text-slate-600 hover:text-slate-800 bg-white"
                            >
                              <X className="w-4 h-4 mr-2" />
                              إغلاق قائمة المنتجات
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="itemName" className="text-slate-700 font-medium">اسم الصنف *</Label>
                      <Input
                        id="itemName"
                        value={newItem.itemName}
                        onChange={(e) => setNewItem(prev => ({ ...prev, itemName: e.target.value }))}
                        placeholder="اسم الصنف"
                        className="bg-white border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="quantity" className="text-slate-700 font-medium">الكمية *</Label>
                      <Input
                        id="quantity"
                        type="number"
                        value={newItem.quantity}
                        onChange={(e) => setNewItem(prev => ({ ...prev, quantity: parseFloat(e.target.value) || 0 }))}
                        placeholder="0"
                        className="bg-white border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="unit" className="text-slate-700 font-medium">الوحدة</Label>
                      <Select 
                        value={newItem.unit}
                        onValueChange={(value) => setNewItem(prev => ({ ...prev, unit: value }))}
                      >
                        <SelectTrigger className="bg-white border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <SelectValue placeholder="اختر الوحدة" />
                        </SelectTrigger>
                        <SelectContent className="bg-white rounded-xl shadow-xl">
                          {units.map(unit => {
                            const unitValue = unit.name_ar || unit.name || unit || unit.id?.toString() || `unit-${unit.id || Math.random()}`;
                            return (
                              <SelectItem key={unit.id || unit || Math.random()} value={String(unitValue)}>
                                {unit.name_ar || unit.name || unit || `وحدة ${unit.id}`}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="price" className="text-slate-700 font-medium">السعر</Label>
                      <Input
                        id="price"
                        type="number"
                        value={newItem.price}
                        onChange={(e) => setNewItem(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                        placeholder="0.00"
                        className="bg-white border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button 
                      type="button" 
                      onClick={addItemToTransaction} 
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      إضافة الصنف
                    </Button>
                                      <Button 
                    type="button" 
                    variant="outline" 
                    className="bg-white hover:bg-green-50 border-green-200 text-green-600 rounded-xl px-6 py-3 shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    استيراد من ملف
                  </Button>
                  
                  {/* زر اختبار تحديث المخزون */}
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={async () => {
                      try {
                        console.log("🧪 اختبار تحديث المخزون...");
                        
                        // اختبار بسيط - إضافة 1 للمنتج الأول
                        if (allAvailableProducts.length > 0) {
                          const testProduct = allAvailableProducts[0];
                          const testWarehouse = warehouses[0];
                          
                          if (testProduct && testWarehouse) {
                            console.log("📦 اختبار تحديث:", {
                              product: testProduct.name_ar || testProduct.name_en,
                              warehouse: testWarehouse.name_ar || testWarehouse.name,
                              currentStock: testProduct.current_stock
                            });
                            
                            const result = await updateStock({
                              productId: testProduct.product_id,
                              warehouseId: testWarehouse.id,
                              quantity: 1,
                              operation_type: "add",
                              notes: "اختبار تحديث المخزون"
                            }).unwrap();
                            
                            console.log("✅ نتيجة الاختبار:", result);
                            toast({
                              title: "اختبار ناجح",
                              description: "تم تحديث المخزون بنجاح - يرجى مراجعة الكميات",
                            });
                            
                            // إعادة جلب المنتجات
                            await refetchAllProducts();
                          } else {
                            toast({
                              title: "خطأ في الاختبار",
                              description: "لا توجد منتجات أو مستودعات متاحة للاختبار",
                              variant: "destructive"
                            });
                          }
                        } else {
                          toast({
                            title: "خطأ في الاختبار",
                            description: "لا توجد منتجات متاحة للاختبار",
                            variant: "destructive"
                          });
                        }
                      } catch (error) {
                        console.error("❌ خطأ في اختبار تحديث المخزون:", error);
                        toast({
                          title: "خطأ في الاختبار",
                          description: `فشل اختبار تحديث المخزون: ${(error as any)?.data?.message || 'خطأ غير معروف'}`,
                          variant: "destructive"
                        });
                      }
                    }}
                    className="bg-white hover:bg-purple-50 border-purple-200 text-purple-600 rounded-xl px-6 py-3 shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    اختبار تحديث المخزون
                  </Button>
                  
                  {/* زر تحديث الكميات يدوياً */}
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={async () => {
                      try {
                        console.log("🔄 تحديث الكميات يدوياً...");
                        
                        // إعادة جلب جميع البيانات
                        await Promise.all([
                          refetchAllProducts(),
                          refetchTransactions()
                        ]);
                        
                        console.log("✅ تم تحديث جميع البيانات");
                        toast({
                          title: "تم التحديث",
                          description: "تم تحديث جميع البيانات بنجاح",
                        });
                        
                        // عرض البيانات الحالية
                        console.log("📊 البيانات الحالية:", {
                          productsCount: allAvailableProducts.length,
                          firstProduct: allAvailableProducts[0] ? {
                            name: allAvailableProducts[0].name_ar || allAvailableProducts[0].name_en,
                            stock: allAvailableProducts[0].current_stock,
                            id: allAvailableProducts[0].product_id
                          } : 'لا توجد منتجات',
                          warehousesCount: warehouses.length,
                          transactionsCount: transactions.length
                        });
                        
                      } catch (error) {
                        console.error("❌ خطأ في التحديث اليدوي:", error);
                        toast({
                          title: "خطأ في التحديث",
                          description: "حدث خطأ أثناء تحديث البيانات",
                          variant: "destructive"
                        });
                      }
                    }}
                    className="bg-white hover:bg-green-50 border-green-200 text-green-600 rounded-xl px-6 py-3 shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    تحديث الكميات يدوياً
                  </Button>
                  </div>

                  {/* جدول الأصناف المضافة */}
                  {newTransaction.items && newTransaction.items.length > 0 && (
                    <div className="mt-8">
                      <h4 className="font-semibold mb-4 text-slate-800">الأصناف المضافة ({newTransaction.items.length})</h4>
                      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-gradient-to-r from-slate-50 to-blue-50">
                              <TableHead className="text-right font-semibold text-slate-700">كود الصنف</TableHead>
                              <TableHead className="text-right font-semibold text-slate-700">اسم الصنف</TableHead>
                              <TableHead className="text-right font-semibold text-slate-700">الكمية</TableHead>
                              <TableHead className="text-right font-semibold text-slate-700">الوحدة</TableHead>
                              <TableHead className="text-right font-semibold text-slate-700">السعر</TableHead>
                              <TableHead className="text-right font-semibold text-slate-700">الإجمالي</TableHead>
                              <TableHead className="text-right font-semibold text-slate-700">إجراء</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {newTransaction.items.map((item, index) => (
                              <TableRow key={item.id} className="hover:bg-slate-50 transition-colors duration-200">
                                <TableCell className="font-mono text-sm bg-blue-50 text-blue-700">{item.itemCode}</TableCell>
                                <TableCell className="font-medium">{item.itemName}</TableCell>
                                <TableCell className={`font-medium ${item.quantity > 0 ? "text-green-600" : "text-red-600"}`}>
                                  {item.quantity > 0 ? '+' : ''}{item.quantity}
                                </TableCell>
                                <TableCell>{item.unit}</TableCell>
                                <TableCell>{item.price?.toLocaleString()} جنيه مصري</TableCell>
                                <TableCell className="font-semibold text-green-600">{item.total?.toLocaleString()} جنيه مصري</TableCell>
                                <TableCell>
                                  <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => removeItemFromTransaction(item.id)}
                                    className="hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200"
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                      
                      <div className="flex justify-between items-center mt-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
                        <span className="text-lg font-semibold text-slate-700">إجمالي القيمة:</span>
                        <span className="text-2xl font-bold text-green-600">
                          {newTransaction.items.reduce((total, item) => total + (item.total || 0), 0).toLocaleString()} جنيه مصري
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* أزرار الحفظ */}
                <div className="flex gap-4 justify-end border-t pt-6 border-slate-200">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setActiveTab("list")}
                    className="bg-white hover:bg-red-50 border-red-200 text-red-600 rounded-xl px-6 py-3 shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <X className="w-4 h-4 mr-2" />
                    إلغاء
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="bg-white hover:bg-blue-50 border-blue-200 text-blue-600 rounded-xl px-6 py-3 shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    إرفاق مستند
                  </Button>
                  
                  {isEditing && (
                    <Button 
                      type="button" 
                      onClick={cancelEdit}
                      variant="outline"
                      className="border-red-200 text-red-600 hover:bg-red-50 rounded-xl px-6 py-3 shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      <X className="w-4 h-4 mr-2" />
                      إلغاء التعديل
                    </Button>
                  )}
                  
                  <Button 
                    type="button" 
                    onClick={saveTransaction} 
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isEditing ? "حفظ التعديلات" : "حفظ الحركة"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* مودال عرض تفاصيل الحركة */}
        <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl">
                  <Eye className="h-6 w-6 text-white" />
                </div>
                تفاصيل الحركة المخزنية
              </DialogTitle>
              <DialogDescription>
                عرض تفاصيل شامل للحركة المخزنية والأصناف المتضمنة
              </DialogDescription>
            </DialogHeader>

            {selectedTransaction && (
              <div className="space-y-6">
                {/* معلومات أساسية */}
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-slate-800">المعلومات الأساسية</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <Label className="text-sm font-medium text-slate-500">رقم الحركة</Label>
                        <div className="text-lg font-bold text-blue-600">{selectedTransaction.id}</div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-sm font-medium text-slate-500">نوع الحركة</Label>
                        <Badge className={`${getTypeColor(selectedTransaction.type)} bg-opacity-10 border rounded-full px-3 py-1 w-fit`}>
                          <div className="flex items-center gap-1">
                            {getTypeIcon(selectedTransaction.type)}
                            {selectedTransaction.type}
                          </div>
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-sm font-medium text-slate-500">الحالة</Label>
                        <Badge className={`${getStatusColor(selectedTransaction.status)} rounded-full px-3 py-1 w-fit`}>
                          {getStatusText(selectedTransaction.status)}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-sm font-medium text-slate-500">التاريخ والوقت</Label>
                        <div className="text-slate-800">{selectedTransaction.date} - {selectedTransaction.time}</div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-sm font-medium text-slate-500">المستخدم</Label>
                        <div className="text-slate-800">{selectedTransaction.user}</div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-sm font-medium text-slate-500">الفرع</Label>
                        <div className="text-slate-800">{selectedTransaction.branchName}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* معلومات المستودعات */}
                <Card className="border-l-4 border-l-green-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                      <Warehouse className="h-5 w-5" />
                      معلومات المستودعات
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-sm font-medium text-slate-500">المستودع المرسل</Label>
                        <div className="text-slate-800 font-medium">{selectedTransaction.sourceWarehouse}</div>
                      </div>
                      {selectedTransaction.targetWarehouse && (
                        <div className="space-y-1">
                          <Label className="text-sm font-medium text-slate-500">المستودع المستقبل</Label>
                          <div className="text-slate-800 font-medium">{selectedTransaction.targetWarehouse}</div>
                        </div>
                      )}
                      <div className="space-y-1">
                        <Label className="text-sm font-medium text-slate-500">المرجع</Label>
                        <div className="text-slate-800">{selectedTransaction.reference}</div>
                      </div>
                      {selectedTransaction.reason && (
                        <div className="space-y-1">
                          <Label className="text-sm font-medium text-slate-500">سبب الحركة</Label>
                          <div className="text-slate-800">{selectedTransaction.reason}</div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* الأصناف */}
                <Card className="border-l-4 border-l-purple-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      الأصناف ({selectedTransaction.items.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-slate-50">
                            <TableHead className="text-center text-slate-700 font-medium">كود الصنف</TableHead>
                            <TableHead className="text-center text-slate-700 font-medium">اسم الصنف</TableHead>
                            <TableHead className="text-center text-slate-700 font-medium">الكمية</TableHead>
                            <TableHead className="text-center text-slate-700 font-medium">الوحدة</TableHead>
                            {selectedTransaction.items.some(item => item.price) && (
                              <>
                                <TableHead className="text-center text-slate-700 font-medium">السعر</TableHead>
                                <TableHead className="text-center text-slate-700 font-medium">الإجمالي</TableHead>
                              </>
                            )}
                            <TableHead className="text-center text-slate-700 font-medium">ملاحظات</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedTransaction.items.map((item: TransactionItem, index) => (
                            <TableRow key={item.id} className={index % 2 === 0 ? "bg-white" : "bg-slate-25"}>
                              <TableCell className="text-center font-mono text-blue-600">{item.itemCode}</TableCell>
                              <TableCell className="text-center font-medium">{item.itemName}</TableCell>
                              <TableCell className="text-center font-bold text-green-600">{item.quantity}</TableCell>
                              <TableCell className="text-center">{item.unit}</TableCell>
                              {selectedTransaction.items.some((i: TransactionItem) => i.price) && (
                                <>
                                  <TableCell className="text-center font-medium">{item.price || '-'}</TableCell>
                                  <TableCell className="text-center font-bold text-purple-600">{item.total || '-'}</TableCell>
                                </>
                              )}
                              <TableCell className="text-center text-sm text-slate-500">{item.notes || '-'}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* إجمالي القيم */}
                    {selectedTransaction.items.some((item: TransactionItem) => item.total) && (
                      <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                        <div className="text-center">
                          <Label className="text-sm font-medium text-slate-500">إجمالي قيمة الحركة</Label>
                          <div className="text-2xl font-bold text-blue-600 mt-1">
                            {selectedTransaction.items.reduce((sum: number, item: TransactionItem) => sum + (item.total || 0), 0).toLocaleString()} جنيه
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* ملاحظات */}
                {selectedTransaction.notes && (
                  <Card className="border-l-4 border-l-amber-500">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-slate-800">ملاحظات</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                        <p className="text-slate-700">{selectedTransaction.notes}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* أزرار الإجراءات */}
                <div className="flex gap-3 pt-4 border-t border-slate-200">
                  <Button 
                    onClick={() => handlePrint(selectedTransaction.id)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    طباعة
                  </Button>
                  <Button 
                    onClick={() => handleExport(selectedTransaction.id)}
                    variant="outline"
                    className="border-green-200 text-green-600 hover:bg-green-50 rounded-xl px-6 py-2 shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    تصدير CSV
                  </Button>
                  {selectedTransaction.status === "مسودة" && (
                    <>
                    <Button 
                      onClick={() => {
                        handleEdit(selectedTransaction.id);
                        setShowDetailsModal(false);
                      }}
                      variant="outline"
                      className="border-amber-200 text-amber-600 hover:bg-amber-50 rounded-xl px-6 py-2 shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      تعديل
                    </Button>
                      <Button 
                        onClick={() => {
                          handleApprove(selectedTransaction.id);
                          setShowDetailsModal(false);
                        }}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-200"
                        disabled={isApproving}
                      >
                        {isApproving ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mx-auto"></div>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            اعتماد
                          </>
                        )}
                      </Button>
                      <Button 
                        onClick={() => {
                          handleReject(selectedTransaction.id);
                          setShowDetailsModal(false);
                        }}
                        variant="outline"
                        className="border-red-200 text-red-600 hover:bg-red-50 rounded-xl px-6 py-2 shadow-md hover:shadow-lg transition-all duration-200"
                        disabled={isApproving}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        رفض
                      </Button>
                    </>
                  )}
                  <Button 
                    onClick={() => setShowDetailsModal(false)}
                    variant="outline"
                    className="border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl px-6 py-2 shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <X className="w-4 h-4 mr-2" />
                    إغلاق
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
  };
  
  export default InventoryTransactions;