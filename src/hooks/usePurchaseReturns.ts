import { useState, useCallback } from "react";
import { PurchaseReturn, FinancialSettlement, PurchaseOrder, GoodsReceipt } from "@/types/purchaseReturn";
import { useToast } from "@/hooks/use-toast";

export const usePurchaseReturns = () => {
  const { toast } = useToast();

  const [purchaseReturns, setPurchaseReturns] = useState<PurchaseReturn[]>([
    {
      id: 1,
      returnNumber: "PR-2024-001",
      supplier: "شركة التوريدات المتقدمة",
      poNumber: "PO-2024-001",
      grnNumber: "GRN-2024-001",
      returnDate: "2024-01-25",
      department: "warehouse",
      totalItems: 2,
      totalValue: 2400,
      status: "مكتمل",
      approvedBy: "أحمد السعدون",
      completedDate: "2024-01-28",
      branchId: "branch-1",
      branchName: "فرع الرياض الرئيسي",
      user: "أحمد السعدون",
      time: "10:30 ص",
      items: [
        {
          id: 1,
          name: "زيت شل 5W-30",
          itemCode: "OIL-001",
          returnedQty: 10,
          maxQty: 50,
          unit: "لتر",
          batchNumber: "B001",
          condition: "تالف",
          reason: "عيب في التصنيع",
          price: 120,
          total: 1200
        },
        {
          id: 2,
          name: "فلاتر زيت",
          itemCode: "FIL-001",
          returnedQty: 20,
          maxQty: 100,
          unit: "  ",
          batchNumber: "B002",
          condition: "معيب",
          reason: "عيب في التصنيع",
          price: 60,
          total: 1200
        }
      ]
    },
    {
      id: 2,
      returnNumber: "PR-2024-002",
      supplier: "مؤسسة الخليج للمواد",
      poNumber: "PO-2024-002",
      grnNumber: "GRN-2024-002",
      returnDate: "2024-01-26",
      department: "maintenance",
      totalItems: 1,
      totalValue: 850,
      status: "بانتظار الموافقة",
      approvedBy: null,
      completedDate: null,
      branchId: "branch-2",
      branchName: "فرع جدة",
      user: "سارة الأحمدي",
      time: "02:15 م",
      items: [
        {
          id: 1,
          name: "صابون مركز",
          itemCode: "CLN-001",
          returnedQty: 10,
          maxQty: 50,
          unit: "لتر",
          batchNumber: "B003",
          condition: "زائد عن الحاجة",
          reason: "كمية زائدة",
          price: 85,
          total: 850
        }
      ]
    },
    {
      id: 3,
      returnNumber: "PR-2024-003",
      supplier: "شركة الرياض التجارية",
      poNumber: "PO-2024-003",
      grnNumber: "GRN-2024-003",
      returnDate: "2024-01-27",
      department: "operations",
      totalItems: 3,
      totalValue: 1200,
      status: "تحت التسوية المالية",
      approvedBy: "فاطمة الزهراني",
      completedDate: null,
      branchId: "branch-1",
      branchName: "فرع الرياض الرئيسي",
      user: "محمد الفيصل",
      time: "11:45 ص",
      items: [
        {
          id: 1,
          name: "ملمع زجاج",
          itemCode: "POL-001",
          returnedQty: 15,
          maxQty: 30,
          unit: "  ",
          batchNumber: "B004",
          condition: "غير مطابق",
          reason: "عدم مطابقة المواصفات",
          price: 40,
          total: 600
        },
        {
          id: 2,
          name: "فوط تنظيف",
          itemCode: "CLN-002",
          returnedQty: 20,
          maxQty: 100,
          unit: "  ",
          batchNumber: "B005",
          condition: "غير مطابق",
          reason: "عدم مطابقة المواصفات",
          price: 15,
          total: 300
        },
        {
          id: 3,
          name: "شامبو سيارات",
          itemCode: "SHP-001",
          returnedQty: 10,
          maxQty: 25,
          unit: "لتر",
          batchNumber: "B006",
          condition: "غير مطابق",
          reason: "عدم مطابقة المواصفات",
          price: 30,
          total: 300
        }
      ]
    }
  ]);

  const [financialSettlements] = useState<FinancialSettlement[]>([
    {
      id: 1,
      returnNumber: "PR-2024-001",
      supplier: "شركة التوريدات المتقدمة",
      returnValue: 2400,
      creditNoteNumber: "CN-2024-001",
      settlementDate: "2024-01-30",
      status: "مسوى",
      paymentMethod: "خصم من ايصال مستقبلية"
    },
    {
      id: 2,
      returnNumber: "PR-2024-003",
      supplier: "شركة الرياض التجارية",
      returnValue: 1200,
      creditNoteNumber: "CN-2024-002",
      settlementDate: null,
      status: "بانتظار التسوية",
      paymentMethod: "استرداد نقدي"
    }
  ]);

  const [purchaseOrders] = useState<PurchaseOrder[]>([
    { id: "PO-2024-001", supplier: "شركة التوريدات المتقدمة", date: "2024-01-15" },
    { id: "PO-2024-002", supplier: "مؤسسة الخليج للمواد", date: "2024-01-16" },
    { id: "PO-2024-003", supplier: "شركة الرياض التجارية", date: "2024-01-17" }
  ]);

  const [goodsReceipts] = useState<GoodsReceipt[]>([
    { id: "GRN-2024-001", poNumber: "PO-2024-001", items: ["زيت شل 5W-30", "فلاتر زيت"] },
    { id: "GRN-2024-002", poNumber: "PO-2024-002", items: ["صابون مركز", "ملمع زجاج"] },
    { id: "GRN-2024-003", poNumber: "PO-2024-003", items: ["ملمع زجاج", "فوط تنظيف", "شامبو سيارات"] }
  ]);

  // دالة لإضافة مرتجع جديد
  const addPurchaseReturn = useCallback((newReturn: Omit<PurchaseReturn, 'id'>) => {
    const returnWithId = {
      ...newReturn,
      id: Date.now(),
      user: "المستخدم الحالي",
      time: new Date().toLocaleTimeString('ar-SA', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
    };
    
    setPurchaseReturns(prev => [returnWithId, ...prev]);
    
    toast({
      title: "تم إنشاء مرتجع المشتريات",
      description: `تم إنشاء مرتجع رقم ${newReturn.returnNumber} بنجاح`,
    });
    
    return returnWithId;
  }, [toast]);

  // دالة لتحديث حالة المرتجع
  const updateReturnStatus = useCallback((returnId: string | number, status: PurchaseReturn['status']) => {
    setPurchaseReturns(prev => prev.map(returnItem => 
      returnItem.id === returnId 
        ? { ...returnItem, status, approvedBy: status === "معتمد" ? "المستخدم الحالي" : returnItem.approvedBy }
        : returnItem
    ));
    
    toast({
      title: "تم تحديث حالة المرتجع",
      description: `تم تغيير الحالة إلى: ${status}`,
    });
  }, [toast]);

  // دالة للحصول على مرتجعات فرع معين
  const getReturnsByBranch = useCallback((branchId: string) => {
    return purchaseReturns.filter(returnItem => returnItem.branchId === branchId);
  }, [purchaseReturns]);

  // دالة للحصول على إحصائيات المرتجعات
  const getReturnsStats = useCallback(() => {
    const totalReturns = purchaseReturns.length;
    const pendingReturns = purchaseReturns.filter(r => r.status === "بانتظار الموافقة").length;
    const approvedReturns = purchaseReturns.filter(r => r.status === "معتمد" || r.status === "مكتمل").length;
    const totalValue = purchaseReturns.reduce((sum, r) => sum + (r.totalValue || 0), 0);
    
    return {
      totalReturns,
      pendingReturns,
      approvedReturns,
      totalValue
    };
  }, [purchaseReturns]);

  // تحويل مرتجعات المشتريات إلى تنسيق الحركات المخزنية
  const getPurchaseReturnsAsInventoryTransactions = useCallback(() => {
    return purchaseReturns.map(returnItem => ({
      id: `PR-${returnItem.id}`,
      type: "مرتجع مشتريات",
      date: returnItem.returnDate,
      time: returnItem.time || "00:00",
      sourceWarehouse: "المستودع الرئيسي",
      targetWarehouse: "مورد خارجي",
      reference: returnItem.returnNumber,
      user: returnItem.user || "غير محدد",
      status: returnItem.status === "مكتمل" ? "معتمدة" as const : 
               returnItem.status === "بانتظار الموافقة" ? "غير معتمدة" as const : 
               "مسودة" as const,
      items: returnItem.items.map(item => ({
        id: `${returnItem.id}-${item.id}`,
        itemCode: item.itemCode || "",
        itemName: item.name,
        quantity: typeof item.returnedQty === 'string' ? parseInt(item.returnedQty) || 0 : item.returnedQty,
        unit: item.unit,
        price: item.price,
        total: item.total,
        notes: `${item.condition} - ${item.reason}`
      })),
      notes: `مرتجع إلى المورد: ${returnItem.supplier}. ${returnItem.notes || ""}`,
      reason: returnItem.items[0]?.reason || "",
      branchId: returnItem.branchId,
      branchName: returnItem.branchName,
      attachments: returnItem.attachments
    }));
  }, [purchaseReturns]);

  return {
    purchaseReturns,
    financialSettlements,
    purchaseOrders,
    goodsReceipts,
    addPurchaseReturn,
    updateReturnStatus,
    getReturnsByBranch,
    getReturnsStats,
    getPurchaseReturnsAsInventoryTransactions
  };
};