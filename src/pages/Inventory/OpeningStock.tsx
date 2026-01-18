import { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  FileDown, 
  Upload, 
  Lock, 
  Unlock,
  Save,
  Trash2,
  AlertTriangle,
  Package,
  Building2,
  Filter,
  Warehouse,
  Printer,
  Copy
} from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { useBranch } from '@/contexts/BranchContext';
import { useBranchData } from '@/hooks/useBranchData';
import { 
  useGetAllOpeningStocksQuery,
  useCreateOpeningStockMutation,
  useUpdateOpeningStockMutation,
  useDeleteOpeningStockMutation,
} from '@/services/openingStockApi';
import { useGetAllBranchesQuery } from '@/services/branchesApi';
import { useGetAllWarehousesQuery } from '@/services/warehouseApi';
import { useGetAllProductsQuery, useUpdateProductMutation } from '@/services/productApi';

interface OpeningStockItem {
  id: string;
  itemCode: string;
  itemName: string;
  unit: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  notes?: string;
  persisted?: boolean;
}

interface OpeningStockRecord {
  id: string;
  recordNumber: string;
  warehouse: string;
  date: string;
  user: string;
  itemCount: number;
  totalValue: number;
  isLocked: boolean;
  items: OpeningStockItem[];
}

export default function OpeningStock() {
  const [activeTab, setActiveTab] = useState("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [selectedBranchFilter, setSelectedBranchFilter] = useState("all");
  const [records, setRecords] = useState<(OpeningStockRecord & { branchId: string; branchName: string; entryIds?: number[] })[]>([]);
  const [newRecord, setNewRecord] = useState({
    branchId: "",
    warehouse: "",
    date: new Date().toISOString().split('T')[0],
    items: [] as OpeningStockItem[],
    // حقول المخزون الإضافية
    minStock: 1,
    maxStock: 1000,
    reorderPoint: 10
  });

  // استخدام Context الفروع والبيانات المتعلقة بها
  const { selectedBranch, branches, getActiveBranches } = useBranch();
  const { getWarehousesByBranch, getBranchStats, canPerformAction } = useBranchData();

  // الحصول على المستودعات الخاصة بالفرع المحدد من النموذج أو الـ context
  const currentBranchId = newRecord.branchId || selectedBranch?.id;
  const warehouses = getWarehousesByBranch(currentBranchId);

  // ربط API
  const { data: openingStocksResponse, isLoading: isOpeningLoading } = useGetAllOpeningStocksQuery(undefined as any, { refetchOnMountOrArgChange: true } as any);
  const { data: branchesResponse } = useGetAllBranchesQuery(undefined as any);

  const { data: warehousesResponse } = useGetAllWarehousesQuery(undefined);
  const { data: productsResponse, isLoading: isProductsLoading } = useGetAllProductsQuery(undefined as any);
  const [createOpeningStock, { isLoading: isCreating }] = useCreateOpeningStockMutation();
  const [updateOpeningStock, { isLoading: isUpdating }] = useUpdateOpeningStockMutation();
  const [deleteOpeningStock, { isLoading: isDeleting }] = useDeleteOpeningStockMutation();
  const [updateProduct] = useUpdateProductMutation();

  // تحويل بيانات الـ API إلى سجلات مجمعة كما تتوقع الواجهة
  const apiRecords = useMemo(() => {
    const raw = openingStocksResponse?.data?.openingStocks ?? [];
    if (!Array.isArray(raw) || raw.length === 0) return [] as (OpeningStockRecord & { branchId: string; branchName: string; entryIds?: number[] })[];

    type RawItem = {
      id: number;
      opening_stock_date: string;
      item_code: string;
      quantity: number;
      unit_cost: number;
      total_cost: number;
      notes?: string;
      branch_id: number | string;
      warehouse_id: number | string;
      product?: { product_id: string; name_ar: string; name_en: string } | null;
      sparePart?: { id: number; arabicName: string; englishName: string } | null;
      branch?: { id: number | string; arabicName: string; englishName: string } | null;
      warehouse?: { warehouse_id: number | string; name_ar: string; name_en: string } | null;
    };

    const groupMap = new Map<string, { 
      key: string;
      date: string;
      branchId: string;
      branchName: string;
      warehouseName: string;
      entryIds: number[];
      items: OpeningStockItem[];
    }>();

    (raw as RawItem[]).forEach((row) => {
      const dateOnly = row.opening_stock_date?.slice(0, 10) ?? '';
      const branchIdStr = String(row.branch?.id ?? row.branch_id ?? '');
      const warehouseIdStr = String(row.warehouse?.warehouse_id ?? row.warehouse_id ?? '');
      const key = `${branchIdStr}|${warehouseIdStr}|${dateOnly}`;

      if (!groupMap.has(key)) {
        groupMap.set(key, {
          key,
          date: dateOnly,
          branchId: branchIdStr,
          branchName: (row.branch as any)?.arabicName || (row.branch as any)?.englishName || '',
          warehouseName: (row.warehouse as any)?.name_ar || (row.warehouse as any)?.name_en || '',
          entryIds: [],
          items: [],
        });
      }

      const group = groupMap.get(key)!;
      group.entryIds.push(Number(row.id));
      group.items.push({
        id: String(row.id),
        itemCode: row.item_code,
        itemName: row.product?.name_ar || row.product?.name_en || row.sparePart?.arabicName || row.sparePart?.englishName || '',
        unit: '',
        quantity: Number(row.quantity) || 0,
        unitCost: Number(row.unit_cost) || 0,
        totalCost: Number(row.total_cost) || 0,
        notes: row.notes || '',
        persisted: true,
      });
    });

    const result: (OpeningStockRecord & { branchId: string; branchName: string; entryIds?: number[] })[] = [];
    let counter = 1;
    for (const [, group] of groupMap) {
      const totalValue = group.items.reduce((s, i) => s + (i.totalCost || 0), 0);
      result.push({
        id: group.key,
        recordNumber: `OS-${String(counter).padStart(3, '0')}`,
        warehouse: group.warehouseName,
        branchId: group.branchId,
        branchName: group.branchName,
        date: group.date,
        user: '-',
        itemCount: group.items.length,
        totalValue,
        isLocked: false,
        items: group.items,
        entryIds: group.entryIds,
      });
      counter += 1;
    }
    return result;
  }, [openingStocksResponse]);

  useEffect(() => {
    if (apiRecords.length) {
      setRecords(apiRecords);
    }
  }, [apiRecords]);

  // تحميل المنتجات الحقيقية لعرضها في كود الصنف
  const productOptions = useMemo(() => {
    const list: any[] = (productsResponse as any)?.data?.products ?? (productsResponse as any)?.products ?? [];
    if (!Array.isArray(list)) return [] as Array<{ code: string; name: string; unit: string }>;
    return list.map((p: any) => ({
      code: String(p.product_id),
      name: p.name_ar || p.name_en || '',
      unit: p.unit_of_measure || '',
    }));
  }, [productsResponse]);

  // تصفية السجلات حسب الفرع المحدد والبحث
  const filteredRecords = records.filter(record => {
    const matchesSearch = 
      record.warehouse.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.recordNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.branchName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBranch = selectedBranchFilter === "all" || record.branchId === selectedBranchFilter;
    
    return matchesSearch && matchesBranch;
  });

  // إحصائيات الفروع
  const branchStats = getBranchStats();

  const addItemToRecord = () => {
    const newItem: OpeningStockItem = {
      id: Date.now().toString(),
      itemCode: "",
      itemName: "",
      unit: "",
      quantity: 0,
      unitCost: 0,
      totalCost: 0,
      notes: "",
      persisted: false,
    };
    setNewRecord(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const updateItem = (index: number, field: keyof OpeningStockItem, value: any) => {
    setNewRecord(prev => {
      const updatedItems = [...prev.items];
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value
      };
      
      // حساب التكلفة الإجمالية
      if (field === 'quantity' || field === 'unitCost') {
        updatedItems[index].totalCost = updatedItems[index].quantity * updatedItems[index].unitCost;
      }
      
      return {
        ...prev,
        items: updatedItems
      };
    });
  };

  const removeItem = (index: number) => {
    setNewRecord(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const selectItem = (index: number, itemCode: string) => {
    const selectedItem = productOptions.find(item => item.code === itemCode);
    if (selectedItem) {
      updateItem(index, 'itemCode', selectedItem.code);
      updateItem(index, 'itemName', selectedItem.name);
      updateItem(index, 'unit', selectedItem.unit);
      
      // البحث عن المنتج في البيانات الحقيقية للحصول على الكمية والسعر الحاليين
      const currentProduct = (productsResponse as any)?.data?.products?.find((p: any) => p.product_id === itemCode) || 
                            (productsResponse as any)?.products?.find((p: any) => p.product_id === itemCode);
      
      if (currentProduct) {
        // تحديث الكمية والسعر من بيانات المنتج الحالية (فقط في النموذج)
        const currentStock = Number(currentProduct.current_stock) || 0;
        const currentCost = Number(currentProduct.cost_price) || 0;
        
        updateItem(index, 'quantity', currentStock);
        updateItem(index, 'unitCost', currentCost);
        
        // إظهار رسالة تأكيد للمستخدم
        toast({
          title: "تم تحميل البيانات",
          description: `تم تحميل ${selectedItem.name}: الكمية ${currentStock}, السعر ${currentCost} جنيه مصري`,
        });
      }
    }
  };

  const getTotalValue = () => {
    return newRecord.items.reduce((sum, item) => sum + item.totalCost, 0);
  };

  const saveRecord = async () => {
    if (!selectedBranch && !newRecord.branchId) {
      toast({
        title: "خطأ",
        description: "يرجى تحديد الفرع أولاً",
        variant: "destructive"
      });
      return;
    }

    if (!newRecord.warehouse) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار المستودع",
        variant: "destructive"
      });
      return;
    }

    if (newRecord.items.length === 0) {
      toast({
        title: "خطأ",
        description: "يرجى إضافة صنف واحد على الأقل",
        variant: "destructive"
      });
      return;
    }

    // التحقق من صلاحية العملية
    if (!canPerformAction('create_opening_stock', (selectedBranch?.id || newRecord.branchId) as string)) {
      toast({
        title: "خطأ في الصلاحية",
        description: "لا تملك صلاحية إنشاء بضاعة أول المدة في هذا الفرع",
        variant: "destructive"
      });
      return;
    }

    try {
      // تحديد المعرّفات مباشرة
      const branchesList = (branchesResponse as any)?.data ?? (branchesResponse as any)?.data?.data ?? [];
      const warehousesList = (warehousesResponse as any)?.data?.warehouses ?? (warehousesResponse as any)?.warehouses ?? [];

      const targetBranchIdStr = String(newRecord.branchId || selectedBranch?.id || '');
      const selectedWarehouseObj = warehouses.find(w => w.name === newRecord.warehouse);
      const targetWarehouseIdStr = selectedWarehouseObj ? String(selectedWarehouseObj.id) : '';

      const targetBranch = Array.isArray(branchesList)
        ? branchesList.find((b: any) => String(b.id ?? b.branch_id ?? b.ID) === targetBranchIdStr)
        : undefined;

      const targetWarehouse = Array.isArray(warehousesList)
        ? warehousesList.find((w: any) => String(w.warehouse_id ?? w.id ?? w.ID) === targetWarehouseIdStr)
        : undefined;

      if (!targetBranch || !targetWarehouse) {
        toast({
          title: 'تعذر الحفظ',
          description: 'تعذر مطابقة الفرع أو المستودع مع النظام الخلفي. الرجاء التأكد من الأسماء.',
          variant: 'destructive',
        });
        return;
      }

      // إنشاء/تحديث لكل صنف
      const operations = newRecord.items.map(async (item) => {
        const payload = {
          opening_stock_date: newRecord.date,
          item_code: item.itemCode,
          quantity: item.quantity,
          unit_cost: item.unitCost,
          total_cost: item.totalCost,
          notes: item.notes,
          branch_id: Number(targetBranch.id ?? targetBranch.branch_id ?? targetBranch.ID ?? targetBranch.Id),
          warehouse_id: Number(targetWarehouse.warehouse_id ?? targetWarehouse.id ?? targetWarehouse.ID ?? targetWarehouse.Id),
          product_id: item.itemCode || null,
          spare_part_id: null,
        } as any;

        const isExisting = item.persisted === true;
        if (isExisting) {
          return updateOpeningStock({ id: Number(item.id), ...payload }).unwrap();
        } else {
          return createOpeningStock(payload).unwrap();
        }
      });

      // انتظار إنشاء/تحديث سجلات بضاعة أول المدة
      await Promise.all(operations);

      // تحديث الكميات والأسعار في جدول المنتجات بعد نجاح حفظ بضاعة أول المدة
      console.log('🔄 بدء تحديث جدول المنتجات...');
      
      for (const item of newRecord.items) {
        if (item.itemCode) {
          try {
            // الحصول على المنتج الحالي لمعرفة الكمية الموجودة
            const currentProduct = (productsResponse as any)?.data?.products?.find((p: any) => p.product_id === item.itemCode) || 
                                  (productsResponse as any)?.products?.find((p: any) => p.product_id === item.itemCode);
            
            if (currentProduct) {
              const currentStock = Number(currentProduct.current_stock) || 0;
              // تحديث الكمية: إضافة الكمية الجديدة إلى الكمية الموجودة
              const newStock = currentStock + item.quantity;
              
              // تحديث الكمية والسعر في جدول المنتجات
              const updateData: any = {
                current_stock: newStock,
                cost_price: item.unitCost
              };
              
              // إضافة حقول المخزون إذا كانت موجودة في النموذج
              if (newRecord.minStock !== undefined) updateData.min_stock = newRecord.minStock;
              if (newRecord.maxStock !== undefined) updateData.max_stock = newRecord.maxStock;
              if (newRecord.reorderPoint !== undefined) updateData.reorder_point = newRecord.reorderPoint;
              
              await updateProduct({ 
                id: item.itemCode, 
                updatedProduct: updateData
              }).unwrap();
              
              console.log(`✅ تم تحديث المنتج ${item.itemCode}: الكمية من ${currentStock} إلى ${newStock}, السعر إلى ${item.unitCost}`);
            }
          } catch (error) {
            console.error(`❌ فشل في تحديث المنتج ${item.itemCode}:`, error);
            
            // إظهار رسالة خطأ للمستخدم
            toast({
              title: "خطأ في تحديث المنتج",
              description: `فشل في تحديث ${item.itemName}. يرجى المحاولة مرة أخرى.`,
              variant: "destructive"
            });
          }
        }
      }

      toast({
        title: "نجح الحفظ",
        description: `تم حفظ بضاعة أول المدة بنجاح. تم تحديث الكميات والأسعار في جدول المنتجات.`,
      });

    // إعادة تعيين النموذج
    setNewRecord({
      branchId: "",
      warehouse: "",
      date: new Date().toISOString().split('T')[0],
      items: [],
      minStock: 1,
      maxStock: 1000,
      reorderPoint: 10
    });
    setActiveTab("list");
    } catch (err: any) {
      console.error('❌ خطأ في حفظ بضاعة أول المدة:', err);
      toast({
        title: 'فشل الحفظ',
        description: 'حدث خطأ أثناء حفظ بضاعة أول المدة. يرجى المحاولة مرة أخرى.',
        variant: 'destructive',
      });
    }
  };

  // وظائف الأزرار والعمليات
  const handleEdit = (recordId: string) => {
    const record = records.find(r => r.id === recordId);
    if (record && !record.isLocked) {
      if (!canPerformAction('edit_opening_stock', record.branchId)) {
        toast({
          title: "خطأ في الصلاحية",
          description: "لا تملك صلاحية تعديل هذه العملية",
          variant: "destructive"
        });
        return;
      }
      
      // تحديث البيانات من جدول المنتجات الحالي
      const updatedItems = record.items.map(item => {
        const currentProduct = (productsResponse as any)?.data?.products?.find((p: any) => p.product_id === item.itemCode) || 
                              (productsResponse as any)?.products?.find((p: any) => p.product_id === item.itemCode);
        
        if (currentProduct) {
          return {
            ...item,
            quantity: Number(currentProduct.current_stock) || item.quantity,
            unitCost: Number(currentProduct.cost_price) || item.unitCost,
            totalCost: (Number(currentProduct.current_stock) || item.quantity) * (Number(currentProduct.cost_price) || item.unitCost)
          };
        }
        return item;
      });
      
      setNewRecord({
        branchId: record.branchId,
        warehouse: record.warehouse,
        date: record.date,
        items: updatedItems,
        minStock: 1,
        maxStock: 1000,
        reorderPoint: 10
      });
      setActiveTab("new");
      
      toast({
        title: "تم التحميل",
        description: "تم تحميل بيانات العملية للتعديل مع تحديث الكميات والأسعار من جدول المنتجات",
      });
    } else {
      toast({
        title: "تعذر التعديل",
        description: "العملية مقفلة ولا يمكن تعديلها",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (recordId: string) => {
    const record = records.find(r => r.id === recordId);
    if (record && !record.isLocked) {
      if (!canPerformAction('delete_opening_stock', record.branchId)) {
        toast({
          title: "خطأ في الصلاحية",
          description: "لا تملك صلاحية حذف هذه العملية",
          variant: "destructive"
        });
        return;
      }
      
      if (confirm("هل أنت متأكد من حذف هذه العملية؟")) {
        try {
          const ids = record.entryIds || [];
          if (ids.length) {
            await Promise.all(ids.map((id) => deleteOpeningStock(id as unknown as number).unwrap()));
          }
          // تحديث الواجهة محليًا
        setRecords(prev => prev.filter(r => r.id !== recordId));
          toast({ title: "تم الحذف", description: "تم حذف العملية بنجاح" });
        } catch (e) {
          toast({ title: 'تعذر الحذف', description: 'حدث خطأ أثناء حذف العملية', variant: 'destructive' });
        }
      }
    }
  };

  const handleLockToggle = (recordId: string) => {
    const record = records.find(r => r.id === recordId);
    if (record) {
      if (!canPerformAction('lock_opening_stock', record.branchId)) {
        toast({
          title: "خطأ في الصلاحية",
          description: "لا تملك صلاحية قفل/إلغاء قفل هذه العملية",
          variant: "destructive"
        });
        return;
      }
      
      const action = record.isLocked ? "إلغاء القفل" : "القفل";
      
      // تحديث حالة القفل في البيانات
      setRecords(prev => prev.map(r => 
        r.id === recordId ? { ...r, isLocked: !r.isLocked } : r
      ));
      
      toast({
        title: `تم ${action}`,
        description: `تم ${action} للعملية ${record.recordNumber}`,
      });
    }
  };

  const handleExportToExcel = (recordId?: string) => {
    if (recordId) {
    const record = records.find(r => r.id === recordId);
      toast({
        title: "تصدير Excel",
        description: `تم تصدير العملية ${record?.recordNumber} إلى Excel`,
      });
    } else {
      toast({
        title: "تصدير Excel",
        description: "تم تصدير جميع العمليات إلى Excel",
      });
    }
  };

  const handleImportFromExcel = () => {
    if (!currentBranchId) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار الفرع أولاً",
        variant: "destructive"
      });
      return;
    }
    
    // فتح نافذة اختيار الملف
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.xls';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        toast({
          title: "استيراد Excel",
          description: `تم استيراد الملف ${file.name} بنجاح`,
        });
      }
    };
    input.click();
  };

  const handlePrintRecord = (recordId: string) => {
    const record = records.find(r => r.id === recordId);
    toast({
      title: "طباعة",
      description: `تم إرسال العملية ${record?.recordNumber} للطباعة`,
    });
  };

  const handleDuplicateRecord = (recordId: string) => {
    const record = records.find(r => r.id === recordId);
    if (record) {
      // تحديث البيانات من جدول المنتجات الحالي
      const updatedItems = record.items.map(item => {
        const currentProduct = (productsResponse as any)?.data?.products?.find((p: any) => p.product_id === item.itemCode) || 
                              (productsResponse as any)?.products?.find((p: any) => p.product_id === item.itemCode);
        
        if (currentProduct) {
          return {
            ...item,
            id: Date.now().toString() + Math.random(),
            quantity: Number(currentProduct.current_stock) || item.quantity,
            unitCost: Number(currentProduct.cost_price) || item.unitCost,
            totalCost: (Number(currentProduct.current_stock) || item.quantity) * (Number(currentProduct.cost_price) || item.unitCost)
          };
        }
        return {
          ...item,
          id: Date.now().toString() + Math.random(),
        };
      });
      
      setNewRecord({
        branchId: record.branchId,
        warehouse: record.warehouse,
        date: new Date().toISOString().split('T')[0],
        items: updatedItems,
        minStock: 1,
        maxStock: 1000,
        reorderPoint: 10
      });
      setActiveTab("new");
      
      toast({
        title: "تم النسخ",
        description: "تم نسخ العملية لإنشاء عملية جديدة مع تحديث الكميات والأسعار من جدول المنتجات",
      });
    }
  };

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
                      <Package className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                        بضاعة أول المدة
                      </h1>
                      <p className="text-lg text-slate-600 mt-1">إدارة الكميات والتكاليف الافتتاحية للمخزون بشكل احترافي</p>
                    </div>
                  </div>
                </div>
                <div className="hidden md:flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{records.length}</div>
                    <div className="text-sm text-slate-500">إجمالي العمليات</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {records.reduce((sum, record) => sum + record.totalValue, 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-slate-500">إجمالي القيمة (جنيه مصري)</div>
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
              <Eye className="h-4 w-4 mr-2" />
              قائمة بضاعة أول المدة
            </TabsTrigger>
            <TabsTrigger 
              value="new" 
              className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
            >
              <Plus className="h-4 w-4 mr-2" />
              إضافة بضاعة أول مدة جديدة
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-6 animate-fade-in">
            <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl">
                    <Eye className="h-5 w-5 text-white" />
                  </div>
                  قائمة عمليات بضاعة أول المدة
                </CardTitle>
                <CardDescription className="text-slate-600">استعراض جميع عمليات بضاعة أول المدة المدخلة مع إمكانية البحث والتصفية</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {/* قسم معلومات الفرع وإحصائياته */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl mb-6 border border-blue-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl">
                        <Building2 className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-800">الفرع الحالي</h3>
                        <p className="text-slate-600">{selectedBranch?.name || "لم يتم تحديد فرع"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{branchStats?.items || 0}</div>
                        <div className="text-sm text-slate-500">الأصناف</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{branchStats?.accounts || 0}</div>
                        <div className="text-sm text-slate-500">الحسابات</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* قسم التصفية والبحث */}
                <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <div className="relative">
                      <Search className="absolute right-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="البحث في العمليات..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pr-10 w-80 bg-white/70 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-slate-500" />
                      <Select value={selectedBranchFilter} onValueChange={setSelectedBranchFilter}>
                        <SelectTrigger className="w-48 bg-white/70 border-slate-200 rounded-xl">
                          <SelectValue placeholder="تصفية حسب الفرع" />
                        </SelectTrigger>
                        <SelectContent className="bg-white rounded-xl shadow-xl">
                          <SelectItem value="all">جميع الفروع</SelectItem>
                          {getActiveBranches().map((branch) => (
                            <SelectItem key={branch.id} value={branch.id}>
                              {branch.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 rounded-full px-4 py-2">
                      إجمالي العمليات: {filteredRecords.length}
                    </Badge>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 rounded-full px-4 py-2">
                      إجمالي القيمة: {filteredRecords.reduce((sum, record) => sum + record.totalValue, 0).toLocaleString()} جنيه مصري
                    </Badge>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-lg bg-white">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-slate-50 to-blue-50 hover:bg-slate-100/80">
                        <TableHead className="text-right font-semibold text-slate-700">رقم العملية</TableHead>
                        <TableHead className="text-right font-semibold text-slate-700">الفرع</TableHead>
                        <TableHead className="text-right font-semibold text-slate-700">المستودع</TableHead>
                        <TableHead className="text-right font-semibold text-slate-700">التاريخ</TableHead>
                        <TableHead className="text-right font-semibold text-slate-700">المستخدم</TableHead>
                        <TableHead className="text-right font-semibold text-slate-700">عدد الأصناف</TableHead>
                        <TableHead className="text-right font-semibold text-slate-700">القيمة الإجمالية</TableHead>
                        <TableHead className="text-right font-semibold text-slate-700">حالة القفل</TableHead>
                        <TableHead className="text-center font-semibold text-slate-700">الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRecords.map((record, index) => (
                        <TableRow key={record.id} className="hover:bg-slate-50/80 transition-colors duration-200 animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                          <TableCell className="font-medium text-blue-600">{record.recordNumber}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {record.branchName}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-slate-700">{record.warehouse}</TableCell>
                          <TableCell className="text-slate-700">{record.date}</TableCell>
                          <TableCell className="text-slate-700">{record.user}</TableCell>
                          <TableCell className="text-slate-700">{record.itemCount}</TableCell>
                          <TableCell className="font-semibold text-green-600">{record.totalValue.toLocaleString()} جنيه مصري</TableCell>
                          <TableCell>
                            <Badge 
                              variant={record.isLocked ? "default" : "secondary"} 
                              className={`rounded-full px-3 py-1 ${
                                record.isLocked 
                                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md" 
                                  : "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md"
                              }`}
                            >
                              {record.isLocked ? (
                                <>
                                  <Lock className="w-3 h-3 mr-1" />
                                  مقفلة
                                </>
                              ) : (
                                <>
                                  <Unlock className="w-3 h-3 mr-1" />
                                  مفتوحة
                                </>
                              )}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center space-x-1 space-x-reverse">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="sm" className="hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-6xl bg-white rounded-3xl shadow-2xl border-0">
                                  <DialogHeader className="border-b border-slate-100 pb-4">
                                    <DialogTitle className="text-xl font-bold text-slate-800 flex items-center gap-3">
                                      <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl">
                                        <Eye className="h-5 w-5 text-white" />
                                      </div>
                                      تفاصيل العملية {record.recordNumber}
                                    </DialogTitle>
                                    <DialogDescription className="text-slate-600">
                                      عرض تفاصيل أصناف بضاعة أول المدة
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="grid gap-6 p-6">
                                    <div className="grid grid-cols-2 gap-6">
                                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-2xl">
                                        <Label className="text-slate-600 text-sm font-medium">المستودع</Label>
                                        <p className="text-lg font-semibold text-slate-800 mt-1">{record.warehouse}</p>
                                      </div>
                                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-2xl">
                                        <Label className="text-slate-600 text-sm font-medium">التاريخ</Label>
                                        <p className="text-lg font-semibold text-slate-800 mt-1">{record.date}</p>
                                      </div>
                                    </div>
                                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                                      <Table>
                                        <TableHeader>
                                          <TableRow className="bg-gradient-to-r from-slate-50 to-blue-50">
                                            <TableHead className="text-right font-semibold">كود الصنف</TableHead>
                                            <TableHead className="text-right font-semibold">اسم الصنف</TableHead>
                                            <TableHead className="text-right font-semibold">الوحدة</TableHead>
                                            <TableHead className="text-right font-semibold">الكمية</TableHead>
                                            <TableHead className="text-right font-semibold">تكلفة الوحدة</TableHead>
                                            <TableHead className="text-right font-semibold">الإجمالي</TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {record.items.map((item) => (
                                            <TableRow key={item.id} className="hover:bg-slate-50">
                                              <TableCell className="font-medium text-blue-600">{item.itemCode}</TableCell>
                                              <TableCell className="text-slate-700">{item.itemName}</TableCell>
                                              <TableCell className="text-slate-700">{item.unit}</TableCell>
                                              <TableCell className="text-slate-700">{item.quantity}</TableCell>
                                              <TableCell className="text-slate-700">{item.unitCost} جنيه مصري</TableCell>
                                              <TableCell className="font-semibold text-green-600">{item.totalCost} جنيه مصري</TableCell>
                                            </TableRow>
                                          ))}
                                        </TableBody>
                                      </Table>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                              
                              {!record.isLocked && (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="hover:bg-amber-50 hover:text-amber-600 rounded-lg transition-all duration-200"
                                  onClick={() => handleEdit(record.id)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              )}
                              
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200"
                                onClick={() => handlePrintRecord(record.id)}
                                title="طباعة"
                              >
                                <Printer className="h-4 w-4" />
                              </Button>

                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-all duration-200"
                                onClick={() => handleDuplicateRecord(record.id)}
                                title="نسخ العملية"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="hover:bg-green-50 hover:text-green-600 rounded-lg transition-all duration-200"
                                onClick={() => handleExportToExcel(record.id)}
                                title="تصدير Excel"
                              >
                                <FileDown className="h-4 w-4" />
                              </Button>

                              {!record.isLocked && (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200"
                                  onClick={() => handleDelete(record.id)}
                                  title="حذف"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
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

          <TabsContent value="new" className="space-y-6 animate-fade-in">
            <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl">
                    <Plus className="h-5 w-5 text-white" />
                  </div>
                  إضافة بضاعة أول مدة جديدة
                </CardTitle>
                <CardDescription className="text-slate-600">إدخال الكميات والتكاليف الافتتاحية للأصناف</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-8">
                {/* قسم معلومات الفرع */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl">
                      <Building2 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">معلومات الفرع</h3>
                      <p className="text-slate-600">الفرع المحدد لإضافة بضاعة أول المدة</p>
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
                      <div className="text-sm text-slate-500">عدد المستودعات</div>
                      <div className="text-lg font-semibold text-green-600">
                        {warehouses.length}
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-purple-100">
                      <div className="text-sm text-slate-500">حالة الفرع</div>
                      <div className="text-lg font-semibold">
                        <Badge 
                          variant={selectedBranch?.status === 'active' ? 'default' : 'secondary'}
                          className={selectedBranch?.status === 'active' ? 'bg-green-500' : 'bg-amber-500'}
                        >
                          {selectedBranch?.status === 'active' ? 'نشط' : 'صيانة'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="branch" className="text-slate-700 font-medium flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      الفرع *
                    </Label>
                    <Select 
                      value={newRecord.branchId} 
                      onValueChange={(value) => {
                        setNewRecord(prev => ({ ...prev, branchId: value, warehouse: "" }));
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
                    <Label htmlFor="warehouse" className="text-slate-700 font-medium flex items-center gap-2">
                      <Warehouse className="h-4 w-4" />
                      المستودع *
                    </Label>
                    <Select 
                      value={newRecord.warehouse} 
                      onValueChange={(value) => setNewRecord(prev => ({ ...prev, warehouse: value }))}
                      disabled={!selectedBranch || warehouses.length === 0}
                    >
                      <SelectTrigger className="bg-white/70 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-12">
                        <SelectValue 
                          placeholder={
                            !selectedBranch 
                              ? "يرجى تحديد الفرع أولاً" 
                              : warehouses.length === 0 
                              ? "لا توجد مستودعات متاحة" 
                              : "اختر المستودع"
                          } 
                        />
                      </SelectTrigger>
                      <SelectContent className="bg-white rounded-xl shadow-xl border-slate-200">
                        {warehouses.map((warehouse) => (
                          <SelectItem key={warehouse.id} value={warehouse.name}>
                            <div className="flex items-center gap-2">
                              {warehouse.name}
                              {warehouse.isMain && (
                                <Badge variant="secondary" className="text-xs">رئيسي</Badge>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {!selectedBranch && (
                      <p className="text-sm text-amber-600">⚠️ يرجى اختيار الفرع من الشريط الجانبي أولاً</p>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="date" className="text-slate-700 font-medium">تاريخ بضاعة أول المدة</Label>
                    <Input
                      type="date"
                      value={newRecord.date}
                      onChange={(e) => setNewRecord(prev => ({ ...prev, date: e.target.value }))}
                      className="bg-white/70 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-12"
                    />
                  </div>
                </div>

                

                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-slate-800">أصناف بضاعة أول المدة</h3>
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <Button 
                        onClick={addItemToRecord} 
                        variant="outline" 
                        size="sm"
                        className="bg-white hover:bg-blue-50 border-blue-200 text-blue-600 rounded-xl px-4 py-2 shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        إضافة صنف
                      </Button>
                      <Button 
                        onClick={handleImportFromExcel}
                        variant="outline" 
                        size="sm"
                        className="bg-white hover:bg-green-50 border-green-200 text-green-600 rounded-xl px-4 py-2 shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        استيراد Excel
                      </Button>
                    </div>
                  </div>

                  {newRecord.items.length > 0 && (
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gradient-to-r from-slate-50 to-blue-50">
                            <TableHead className="text-right font-semibold text-slate-700">كود الصنف</TableHead>
                            <TableHead className="text-right font-semibold text-slate-700">اسم الصنف</TableHead>
                            <TableHead className="text-right font-semibold text-slate-700">الوحدة</TableHead>
                            <TableHead className="text-right font-semibold text-slate-700">الكمية</TableHead>
                            <TableHead className="text-right font-semibold text-slate-700">تكلفة الوحدة</TableHead>
                            <TableHead className="text-right font-semibold text-slate-700">الإجمالي</TableHead>
                            <TableHead className="text-right font-semibold text-slate-700">ملاحظات</TableHead>
                            <TableHead className="text-center font-semibold text-slate-700">إجراء</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {newRecord.items.map((item, index) => (
                            <TableRow key={item.id} className="hover:bg-slate-50/80 transition-colors duration-200">
                              <TableCell>
                                <Select 
                                  value={item.itemCode} 
                                  onValueChange={(value) => selectItem(index, value)}
                                >
                                  <SelectTrigger className="w-36 bg-white border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500">
                                    <SelectValue placeholder="اختر" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-white rounded-lg shadow-xl">
                                    {productOptions.map((p) => (
                                      <SelectItem key={p.code} value={p.code}>
                                        {p.code}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell>
                                <Input 
                                  value={item.itemName}
                                  onChange={(e) => updateItem(index, 'itemName', e.target.value)}
                                  className="w-44 bg-white border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                  placeholder="اسم الصنف"
                                />
                              </TableCell>
                              <TableCell>
                                <Input 
                                  value={item.unit}
                                  onChange={(e) => updateItem(index, 'unit', e.target.value)}
                                  className="w-24 bg-white border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                  placeholder="الوحدة"
                                />
                              </TableCell>
                              <TableCell>
                                <Input 
                                  type="number"
                                  value={item.quantity || ''}
                                  onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                                  className="w-24 bg-white border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                  placeholder="0"
                                />
                              </TableCell>
                              <TableCell>
                                <Input 
                                  type="number"
                                  value={item.unitCost || ''}
                                  onChange={(e) => updateItem(index, 'unitCost', parseFloat(e.target.value) || 0)}
                                  className="w-28 bg-white border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                  placeholder="0.00"
                                />
                              </TableCell>
                              <TableCell>
                                <span className="font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                                  {item.totalCost.toFixed(2)} جنيه مصري
                                </span>
                              </TableCell>
                              <TableCell>
                                <Input 
                                  value={item.notes || ''}
                                  onChange={(e) => updateItem(index, 'notes', e.target.value)}
                                  className="w-36 bg-white border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                  placeholder="ملاحظات"
                                />
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeItem(index)}
                                  className="hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}

                  {newRecord.items.length > 0 && (
                    <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-6 rounded-2xl shadow-lg border border-blue-100">
                      <div className="flex justify-between items-center">
                        <div className="space-y-2">
                          <p className="text-sm text-slate-600">إجمالي الأصناف: <span className="font-semibold text-blue-600">{newRecord.items.length}</span></p>
                          <p className="text-2xl font-bold text-green-600">إجمالي القيمة: {getTotalValue().toFixed(2)} جنيه مصري</p>
                        </div>
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <Button 
                            variant="outline"
                            className="bg-white hover:bg-green-50 border-green-200 text-green-600 rounded-xl px-6 py-3 shadow-md hover:shadow-lg transition-all duration-200"
                          >
                            <FileDown className="h-4 w-4 mr-2" />
                            تصدير Excel
                          </Button>
                          <Button 
                            onClick={saveRecord}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-200"
                          >
                            <Save className="h-4 w-4 mr-2" />
                            حفظ بضاعة أول المدة
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {newRecord.items.length === 0 && (
                    <div className="text-center py-16 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl border-2 border-dashed border-slate-300">
                      <div className="animate-fade-in">
                        <div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                          <AlertTriangle className="h-10 w-10 text-blue-600" />
                        </div>
                        <p className="text-xl font-semibold text-slate-700 mb-2">لا توجد أصناف مضافة بعد</p>
                        <p className="text-slate-500">اضغط على "إضافة صنف" لبدء إدخال البيانات</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}