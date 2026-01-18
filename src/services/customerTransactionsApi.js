// API service لجلب معاملات العملاء من LocalStorage
import { useState, useEffect } from 'react';

export class CustomerTransactionsService {
  // جلب جميع الإيصالات المحفوظة
  static getAllInvoices() {
    try {
      const invoices = JSON.parse(localStorage.getItem('pos_invoices') || '[]');
      return invoices;
    } catch (error) {
      console.error('خطأ في جلب الإيصالات:', error);
      return [];
    }
  }

  // جلب إيصالات عميل محدد
  static getCustomerInvoices(customerPhone) {
    try {
      const allInvoices = this.getAllInvoices();
      return allInvoices.filter(invoice => 
        invoice.customer && 
        (invoice.customer.phone === customerPhone || 
         invoice.customerId === customerPhone)
      );
    } catch (error) {
      console.error('خطأ في جلب إيصالات العميل:', error);
      return [];
    }
  }

  // جلب معاملات عميل محدد مع تصفية
  static getCustomerTransactions(customerId, filters = {}) {
    try {
      const customerInvoices = this.getCustomerInvoices(customerId);
      
      // تحويل الإيصالات إلى تنسيق المعاملات
      const transactions = customerInvoices.map(invoice => ({
        id: invoice.id || `TXN-${invoice.number}`,
        date: invoice.date || invoice.timestamp,
        services: invoice.services ? 
          invoice.services.map(service => service.name) : 
          ['خدمة غير محددة'],
        amount: invoice.total || 0,
        paidAmount: invoice.total || 0, // افتراض أن الايصال مدفوعة بالكامل
        status: this.mapInvoiceStatus(invoice.status),
        carPlate: invoice.vehicle?.plateNumber || 'غير محدد',
        carModel: invoice.vehicle?.make && invoice.vehicle?.model ? 
          `${invoice.vehicle.make} ${invoice.vehicle.model}` : 'غير محدد',
        supervisor: invoice.cashier || invoice.supervisor || 'غير محدد',
        branch: invoice.branch || 'الفرع الرئيسي',
        paymentMethod: this.mapPaymentMethod(invoice.paymentMethod),
        notes: invoice.notes || '',
        invoiceNumber: invoice.number || invoice.id,
        customerName: invoice.customer?.name || 'غير محدد'
      }));

      // تطبيق الفلاتر
      return this.applyFilters(transactions, filters);
    } catch (error) {
      console.error('خطأ في جلب معاملات العميل:', error);
      return [];
    }
  }

  // تحويل حالة الايصال إلى حالة المعاملة
  static mapInvoiceStatus(status) {
    const statusMap = {
      'paid': 'مكتمل',
      'pending': 'معلق',
      'partial': 'جزئي',
      'cancelled': 'ملغي',
      'refunded': 'مسترد'
    };
    return statusMap[status] || 'مكتمل';
  }

  // تحويل طريقة الدفع
  static mapPaymentMethod(method) {
    const methodMap = {
      'cash': 'كاش',
      'card': 'بطاقة ائتمان',
      'bank_transfer': 'تحويل بنكي',
      'check': 'شيك',
      'wallet': 'محفظة إلكترونية'
    };
    return methodMap[method] || method || 'كاش';
  }

  // تطبيق الفلاتر
  static applyFilters(transactions, filters) {
    let filtered = [...transactions];

    // فلتر النص
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(transaction =>
        transaction.services.join(' ').toLowerCase().includes(searchTerm) ||
        transaction.carPlate.toLowerCase().includes(searchTerm) ||
        transaction.invoiceNumber.toLowerCase().includes(searchTerm) ||
        transaction.customerName.toLowerCase().includes(searchTerm)
      );
    }

    // فلتر الحالة
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(transaction => transaction.status === filters.status);
    }

    // فلتر التاريخ
    if (filters.dateRange && filters.dateRange !== 'all') {
      const now = new Date();
      let startDate;

      switch (filters.dateRange) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'quarter':
          const quarterStart = Math.floor(now.getMonth() / 3) * 3;
          startDate = new Date(now.getFullYear(), quarterStart, 1);
          break;
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          startDate = null;
      }

      if (startDate) {
        filtered = filtered.filter(transaction => {
          const transactionDate = new Date(transaction.date);
          return transactionDate >= startDate;
        });
      }
    }

    // فلتر نطاق التاريخ المخصص
    if (filters.startDate && filters.endDate) {
      const startDate = new Date(filters.startDate);
      const endDate = new Date(filters.endDate);
      filtered = filtered.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= startDate && transactionDate <= endDate;
      });
    }

    return filtered;
  }

  // جلب إحصائيات العميل
  static getCustomerStats(customerId) {
    try {
      const transactions = this.getCustomerTransactions(customerId);
      
      const totalTransactions = transactions.length;
      const totalAmount = transactions.reduce((sum, txn) => sum + txn.amount, 0);
      const totalPaid = transactions.reduce((sum, txn) => sum + txn.paidAmount, 0);
      const pendingAmount = totalAmount - totalPaid;

      // إحصائيات حسب الحالة
      const statusStats = transactions.reduce((acc, txn) => {
        acc[txn.status] = (acc[txn.status] || 0) + 1;
        return acc;
      }, {});

      // متوسط قيمة المعاملة
      const averageTransactionValue = totalTransactions > 0 ? totalAmount / totalTransactions : 0;

      // آخر معاملة
      const lastTransaction = transactions.length > 0 ? 
        transactions.sort((a, b) => new Date(b.date) - new Date(a.date))[0] : null;

      return {
        totalTransactions,
        totalAmount,
        totalPaid,
        pendingAmount,
        statusStats,
        averageTransactionValue,
        lastTransaction,
        currency: 'SAR'
      };
    } catch (error) {
      console.error('خطأ في جلب إحصائيات العميل:', error);
      return {
        totalTransactions: 0,
        totalAmount: 0,
        totalPaid: 0,
        pendingAmount: 0,
        statusStats: {},
        averageTransactionValue: 0,
        lastTransaction: null,
        currency: 'SAR'
      };
    }
  }

  // تصدير معاملات العميل
  static exportCustomerTransactions(customerId, format = 'json') {
    try {
      const transactions = this.getCustomerTransactions(customerId);
      const stats = this.getCustomerStats(customerId);

      const exportData = {
        customerId,
        exportDate: new Date().toISOString(),
        summary: stats,
        transactions
      };

      if (format === 'json') {
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        return dataBlob;
      }

      // يمكن إضافة تنسيقات أخرى مثل CSV أو Excel هنا
      return null;
    } catch (error) {
      console.error('خطأ في تصدير معاملات العميل:', error);
      return null;
    }
  }

  // البحث في جميع المعاملات
  static searchAllTransactions(searchTerm) {
    try {
      const allInvoices = this.getAllInvoices();
      const transactions = allInvoices.map(invoice => ({
        id: invoice.id || `TXN-${invoice.number}`,
        date: invoice.date || invoice.timestamp,
        services: invoice.services ? 
          invoice.services.map(service => service.name) : 
          ['خدمة غير محددة'],
        amount: invoice.total || 0,
        paidAmount: invoice.total || 0,
        status: this.mapInvoiceStatus(invoice.status),
        carPlate: invoice.vehicle?.plateNumber || 'غير محدد',
        carModel: invoice.vehicle?.make && invoice.vehicle?.model ? 
          `${invoice.vehicle.make} ${invoice.vehicle.model}` : 'غير محدد',
        supervisor: invoice.cashier || invoice.supervisor || 'غير محدد',
        branch: invoice.branch || 'الفرع الرئيسي',
        paymentMethod: this.mapPaymentMethod(invoice.paymentMethod),
        notes: invoice.notes || '',
        invoiceNumber: invoice.number || invoice.id,
        customerName: invoice.customer?.name || 'غير محدد',
        customerPhone: invoice.customer?.phone || 'غير محدد'
      }));

      if (!searchTerm) return transactions;

      const term = searchTerm.toLowerCase();
      return transactions.filter(transaction =>
        transaction.services.join(' ').toLowerCase().includes(term) ||
        transaction.carPlate.toLowerCase().includes(term) ||
        transaction.invoiceNumber.toLowerCase().includes(term) ||
        transaction.customerName.toLowerCase().includes(term) ||
        transaction.customerPhone.includes(searchTerm)
      );
    } catch (error) {
      console.error('خطأ في البحث في المعاملات:', error);
      return [];
    }
  }
}

// Hook للاستخدام في React components

export const useCustomerTransactions = (customerId, filters = {}) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const loadTransactions = async () => {
      setLoading(true);
      try {
        const customerTransactions = CustomerTransactionsService.getCustomerTransactions(customerId, filters);
        const customerStats = CustomerTransactionsService.getCustomerStats(customerId);
        
        setTransactions(customerTransactions);
        setStats(customerStats);
      } catch (error) {
        console.error('خطأ في تحميل معاملات العميل:', error);
      } finally {
        setLoading(false);
      }
    };

    if (customerId) {
      loadTransactions();
    }
  }, [customerId, JSON.stringify(filters)]);

  const refreshTransactions = () => {
    if (customerId) {
      const customerTransactions = CustomerTransactionsService.getCustomerTransactions(customerId, filters);
      const customerStats = CustomerTransactionsService.getCustomerStats(customerId);
      
      setTransactions(customerTransactions);
      setStats(customerStats);
    }
  };

  const exportTransactions = (format = 'json') => {
    return CustomerTransactionsService.exportCustomerTransactions(customerId, format);
  };

  return {
    transactions,
    stats,
    loading,
    refreshTransactions,
    exportTransactions
  };
};
