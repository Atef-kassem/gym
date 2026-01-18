export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  type: 'service' | 'product';
  duration?: number;
}

export interface PaymentSplit {
  method: string;
  amount: number;
  methodName?: string;
}

export interface ServicePath {
  id: string;
  name: string;
  capacity: number;
  currentLoad: number;
  estimatedTime: number;
  status: 'available' | 'busy' | 'maintenance';
}

export interface POSInvoice {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  vehicleId: string;
  plateNumber: string;
  services: InvoiceService[];
  products: InvoiceProduct[];
  subtotal: number;
  discounts: number;
  tax: number;
  total: number;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  cashier: string;
  branch: string;
  timestamp: Date;
}

export interface InvoiceService {
  id: string;
  name: string;
  price: number;
  quantity: number;
  duration?: number;
}

export interface InvoiceProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
}