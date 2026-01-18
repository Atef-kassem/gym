export interface PurchaseReturnItem {
  id: string | number;
  name: string;
  itemCode?: string;
  returnedQty: string | number;
  maxQty: string | number;
  unit: string;
  batchNumber?: string;
  condition: string;
  reason: string;
  notes?: string;
  price?: number;
  total?: number;
}

export interface PurchaseReturn {
  id?: string | number;
  returnNumber: string;
  returnDate: string;
  poNumber: string;
  grnNumber: string;
  supplier: string;
  department: string;
  status: "بانتظار الموافقة" | "معتمد" | "مرفوض" | "مكتمل" | "تحت التسوية المالية" | "مسوى";
  notes?: string;
  approver?: string;
  supplierReceiptNumber?: string;
  items: PurchaseReturnItem[];
  attachments?: string[];
  branchId: string;
  branchName: string;
  totalItems?: number;
  totalValue?: number;
  approvedBy?: string | null;
  completedDate?: string | null;
  user?: string;
  time?: string;
}

export interface FinancialSettlement {
  id: string | number;
  returnNumber: string;
  supplier: string;
  returnValue: number;
  creditNoteNumber: string;
  settlementDate?: string | null;
  status: "مسوى" | "بانتظار التسوية";
  paymentMethod: string;
}

export interface PurchaseOrder {
  id: string;
  supplier: string;
  date: string;
}

export interface GoodsReceipt {
  id: string;
  poNumber: string;
  items: string[];
}