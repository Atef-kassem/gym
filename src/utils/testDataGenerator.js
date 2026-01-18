// أداة لإنشاء بيانات تجريبية لاختبار مكون سجل المعاملات

export const generateTestInvoices = () => {
  const testInvoices = [
    {
      id: '1',
      number: 'INV-2024-001',
      customer: {
        name: 'أحمد محمد العلي',
        phone: '0501234567',
        email: 'ahmed@example.com'
      },
      vehicle: {
        plateNumber: 'أ ب ج 1234',
        make: 'تويوتا',
        model: 'كامري 2022',
        color: 'أبيض'
      },
      services: [
        { name: 'غسيل شامل', price: 25 },
        { name: 'تلميع خارجي', price: 30 },
        { name: 'حماية', price: 20 }
      ],
      total: 75,
      date: new Date('2024-01-20T10:30:00').toISOString(),
      timestamp: new Date('2024-01-20T10:30:00').toISOString(),
      status: 'paid',
      paymentMethod: 'cash',
      cashier: 'أحمد محمد',
      branch: 'فرع الرياض الرئيسي',
      notes: 'خدمة ممتازة'
    },
    {
      id: '2',
      number: 'INV-2024-002',
      customer: {
        name: 'فاطمة أحمد السعد',
        phone: '0501234567',
        email: 'fatima@example.com'
      },
      vehicle: {
        plateNumber: 'هـ و ز 5678',
        make: 'لكزس',
        model: 'LX 570 2021',
        color: 'أسود'
      },
      services: [
        { name: 'غسيل سريع', price: 15 }
      ],
      total: 15,
      date: new Date('2024-01-15T14:15:00').toISOString(),
      timestamp: new Date('2024-01-15T14:15:00').toISOString(),
      status: 'paid',
      paymentMethod: 'card',
      cashier: 'خالد علي',
      branch: 'فرع الرياض الرئيسي',
      notes: ''
    },
    {
      id: '3',
      number: 'INV-2024-003',
      customer: {
        name: 'محمد عبدالله النعيم',
        phone: '0501234567',
        email: 'mohammed@example.com'
      },
      vehicle: {
        plateNumber: 'أ ب ج 1234',
        make: 'تويوتا',
        model: 'كامري 2022',
        color: 'أبيض'
      },
      services: [
        { name: 'باقة VIP الشهرية', price: 200 }
      ],
      total: 200,
      date: new Date('2024-01-10T09:00:00').toISOString(),
      timestamp: new Date('2024-01-10T09:00:00').toISOString(),
      status: 'partial',
      paymentMethod: 'cash',
      cashier: 'سالم أحمد',
      branch: 'فرع الرياض الرئيسي',
      notes: 'دفعة أولى - المتبقي لاحقاً'
    },
    {
      id: '4',
      number: 'INV-2024-004',
      customer: {
        name: 'نورا سعد المطيري',
        phone: '0501234567',
        email: 'nora@example.com'
      },
      vehicle: {
        plateNumber: 'أ ب ج 1234',
        make: 'تويوتا',
        model: 'كامري 2022',
        color: 'أبيض'
      },
      services: [
        { name: 'تنظيف داخلي', price: 40 },
        { name: 'تعطير', price: 15 }
      ],
      total: 55,
      date: new Date('2024-01-05T16:45:00').toISOString(),
      timestamp: new Date('2024-01-05T16:45:00').toISOString(),
      status: 'pending',
      paymentMethod: '',
      cashier: 'محمد سعد',
      branch: 'فرع الرياض الرئيسي',
      notes: 'في انتظار الدفع'
    },
    {
      id: '5',
      number: 'INV-2024-005',
      customer: {
        name: 'عبدالرحمن خالد الغامدي',
        phone: '0509876543',
        email: 'abdulrahman@example.com'
      },
      vehicle: {
        plateNumber: 'د هـ و 9999',
        make: 'BMW',
        model: 'X5 2023',
        color: 'فضي'
      },
      services: [
        { name: 'غسيل شامل', price: 35 },
        { name: 'تلميع داخلي وخارجي', price: 50 },
        { name: 'حماية شمعية', price: 80 }
      ],
      total: 165,
      date: new Date('2024-01-18T11:20:00').toISOString(),
      timestamp: new Date('2024-01-18T11:20:00').toISOString(),
      status: 'paid',
      paymentMethod: 'card',
      cashier: 'أحمد محمد',
      branch: 'فرع الرياض الرئيسي',
      notes: 'عميل VIP - خصم 10%'
    }
  ];

  // حفظ البيانات في LocalStorage
  localStorage.setItem('pos_invoices', JSON.stringify(testInvoices));
  
  console.log('✅ تم إنشاء بيانات تجريبية للإيصالات:', testInvoices.length, 'ايصال');
  return testInvoices;
};

// دالة لمسح البيانات التجريبية
export const clearTestData = () => {
  localStorage.removeItem('pos_invoices');
  console.log('🗑️ تم مسح البيانات التجريبية');
};

// دالة لإضافة ايصال جديدة
export const addTestInvoice = (customerPhone = '0501234567') => {
  const existingInvoices = JSON.parse(localStorage.getItem('pos_invoices') || '[]');
  
  const newInvoice = {
    id: Date.now().toString(),
    number: `INV-${Date.now()}`,
    customer: {
      name: 'عميل تجريبي جديد',
      phone: customerPhone,
      email: 'test@example.com'
    },
    vehicle: {
      plateNumber: 'ت ج ر 0000',
      make: 'تويوتا',
      model: 'كورولا 2023',
      color: 'أزرق'
    },
    services: [
      { name: 'غسيل سريع', price: 15 }
    ],
    total: 15,
    date: new Date().toISOString(),
    timestamp: new Date().toISOString(),
    status: 'paid',
    paymentMethod: 'cash',
    cashier: 'موظف تجريبي',
    branch: 'فرع الرياض الرئيسي',
    notes: 'ايصال تجريبية'
  };

  const updatedInvoices = [newInvoice, ...existingInvoices];
  localStorage.setItem('pos_invoices', JSON.stringify(updatedInvoices));
  
  console.log('✅ تم إضافة ايصال تجريبية جديدة:', newInvoice.number);
  return newInvoice;
};

// دالة لعرض إحصائيات البيانات
export const showTestDataStats = () => {
  const invoices = JSON.parse(localStorage.getItem('pos_invoices') || '[]');
  
  console.log('📊 إحصائيات البيانات التجريبية:');
  console.log('- إجمالي الإيصالات:', invoices.length);
  
  const customers = [...new Set(invoices.map(inv => inv.customer.phone))];
  console.log('- عدد العملاء:', customers.length);
  
  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
  console.log('- إجمالي الإيرادات:', totalRevenue, 'جنيه');
  
  const statusCounts = invoices.reduce((acc, inv) => {
    acc[inv.status] = (acc[inv.status] || 0) + 1;
    return acc;
  }, {});
  console.log('- توزيع الحالات:', statusCounts);
  
  return {
    totalInvoices: invoices.length,
    uniqueCustomers: customers.length,
    totalRevenue,
    statusCounts
  };
};
