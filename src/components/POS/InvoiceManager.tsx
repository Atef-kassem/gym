import React, { useState, useEffect } from 'react';
import { PaymentSuccessScreen } from './PaymentSuccessScreen';

interface Invoice {
  id: string;
  number: string;
  customer: {
    name: string;
    phone: string;
  };
  total: number;
  date: string;
  services: Array<{
    name: string;
    price: number;
  }>;
  status: 'pending' | 'paid' | 'cancelled';
}

interface InvoiceManagerProps {
  customerData?: any;
  vehicleData?: any;
  selectedServices?: any[];
  onNewOrder?: () => void;
}

export const InvoiceManager: React.FC<InvoiceManagerProps> = ({
  customerData,
  vehicleData,
  selectedServices = [],
  onNewOrder
}) => {
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);

  // إنشاء ايصال جديدة
  const generateInvoice = (paymentAmount: number) => {
    const invoiceNumber = `INV-${Date.now()}`;
    
    const invoice: Invoice = {
      id: Date.now().toString(),
      number: invoiceNumber,
      customer: {
        name: customerData?.name || 'عميل غير محدد',
        phone: customerData?.phone || 'غير محدد'
      },
      total: paymentAmount,
      date: new Date().toISOString(),
      services: selectedServices.length > 0 ? selectedServices : [
        { name: '  خارجي', price: 25 },
        { name: '  داخلي', price: 35 },
        { name: 'تلميع', price: 40 }
      ],
      status: 'paid'
    };

    setCurrentInvoice(invoice);
    setShowSuccessScreen(true);

    // حفظ الايصال في التخزين المحلي
    saveInvoice(invoice);

    return invoice;
  };

  // حفظ الايصال
  const saveInvoice = (invoice: Invoice) => {
    try {
      const existingInvoices = JSON.parse(localStorage.getItem('pos_invoices') || '[]');
      const updatedInvoices = [invoice, ...existingInvoices];
      localStorage.setItem('pos_invoices', JSON.stringify(updatedInvoices));
      
      console.log('✅ تم حفظ الايصال:', invoice.number);
    } catch (error) {
      console.error('❌ خطأ في حفظ الايصال:', error);
    }
  };

  // استرجاع الإيصالات المحفوظة
  const getSavedInvoices = (): Invoice[] => {
    try {
      return JSON.parse(localStorage.getItem('pos_invoices') || '[]');
    } catch (error) {
      console.error('❌ خطأ في استرجاع الإيصالات:', error);
      return [];
    }
  };

  // معالج النجاح في الدفع
  const handlePaymentSuccess = (paymentAmount: number) => {
    const invoice = generateInvoice(paymentAmount);
    console.log('💰 تم الدفع بنجاح - الايصال:', invoice.number);
  };

  // معالج عميل جديد
  const handleNewCustomer = () => {
    setShowSuccessScreen(false);
    setCurrentInvoice(null);
    onNewOrder?.();
  };

  // عرض آخر ايصال للاختبار
  const showLastInvoiceForTesting = () => {
    const testInvoice: Invoice = {
      id: 'test',
      number: 'INV-1754117867522',
      customer: {
        name: 'أحمد محمد علي الشهراني',
        phone: '0501234567'
      },
      total: 100,
      date: new Date().toISOString(),
      services: [
        { name: '  خارجي', price: 25 },
        { name: '  داخلي', price: 35 },
        { name: 'تلميع المشروب', price: 40 }
      ],
      status: 'paid'
    };

    setCurrentInvoice(testInvoice);
    setShowSuccessScreen(true);
  };

  return (
    <div>
      {/* شاشة النجاح */}
      {showSuccessScreen && currentInvoice && (
        <PaymentSuccessScreen
          invoice={currentInvoice}
          onNewCustomer={handleNewCustomer}
          onClose={() => setShowSuccessScreen(false)}
        />
      )}

      {/* يمكن إضافة واجهة إدارة الإيصالات هنا */}
    </div>
  );
};

// Hook لاستخدام إدارة الإيصالات
export const useInvoiceManager = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = () => {
    try {
      const savedInvoices = JSON.parse(localStorage.getItem('pos_invoices') || '[]');
      setInvoices(savedInvoices);
    } catch (error) {
      console.error('❌ خطأ في تحميل الإيصالات:', error);
    }
  };

  const createInvoice = (customerData: any, services: any[], total: number) => {
    const invoice: Invoice = {
      id: Date.now().toString(),
      number: `INV-${Date.now()}`,
      customer: customerData,
      total,
      date: new Date().toISOString(),
      services,
      status: 'paid'
    };

    const updatedInvoices = [invoice, ...invoices];
    setInvoices(updatedInvoices);
    
    try {
      localStorage.setItem('pos_invoices', JSON.stringify(updatedInvoices));
    } catch (error) {
      console.error('❌ خطأ في حفظ الايصال:', error);
    }

    return invoice;
  };

  const getInvoiceById = (id: string) => {
    return invoices.find(inv => inv.id === id);
  };

  const getInvoicesByCustomer = (customerPhone: string) => {
    return invoices.filter(inv => inv.customer.phone === customerPhone);
  };

  return {
    invoices,
    createInvoice,
    getInvoiceById,
    getInvoicesByCustomer,
    loadInvoices
  };
};