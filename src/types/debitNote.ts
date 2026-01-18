export interface DebitNoteItem {
  id: number;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  unit?: string;
  itemId?: number;
  purchaseOrderItemId?: number;
}

export interface DebitNote {
  id?: number;
  debitNumber: string;
  debitDate: string;
  supplier: string;
  supplierId?: number;
  poNumber?: string;
  purchaseOrderId?: number;
  invoiceNumber?: string;
  invoiceId?: number;
  reason: string;
  reasonDetails: string;
  debitAmount: number;
  status: 'مسودة' | 'بانتظار الموافقة' | 'معتمد' | 'مرفوض' | 'مرسل للمورد' | 'مكتمل';
  approver?: string;
  approvedBy?: string;
  approvedAt?: string;
  sentDate?: string;
  notes?: string;
  items: DebitNoteItem[];
  attachments?: string[];
  branchId?: string;
  branchName?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DebitNoteStats {
  totalDebits: number;
  totalAmount: number;
  pendingApproval: number;
  approved: number;
  rejected: number;
  sentToSupplier: number;
  averageAmount: number;
  averageProcessingTime: number;
  reasonBreakdown: {
    [key: string]: number;
  };
  supplierBreakdown: {
    [key: string]: number;
  };
}

export interface DebitNoteFilter {
  status?: string;
  supplier?: string;
  dateFrom?: string;
  dateTo?: string;
  reason?: string;
  amountFrom?: number;
  amountTo?: number;
  branchId?: string;
}

export interface DebitNoteStatusChange {
  id: number;
  status: string;
  approver?: string;
  notes?: string;
}

export interface DebitNoteSendRequest {
  id: number;
  email: string;
  cc?: string[];
  subject?: string;
  message?: string;
}
