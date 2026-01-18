import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { cn } from "@/lib/utils";
import {
  Search,
  Filter,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  Activity,
  DollarSign,
  FileText,
  Settings,
  Download,
  Printer,
  RefreshCw,
  Eye,
  BarChart3,
  TrendingUp,
  Monitor,
  CreditCard,
  ShoppingCart,
  AlertCircle,
  CheckCircle2,
  Info,
  RotateCcw,
  Plus,
  Edit,
  Trash2,
  Building,
  Smartphone,
  Tablet,
  Car,
  Receipt,
  Ban,
  Percent,
  Users,
  Coins,
  Calculator,
  FileBarChart
} from 'lucide-react';

// POS-focused operations data
const mockPOSOperations = [
  {
    id: 'POS-001',
    timestamp: '2024-01-20T14:30:45',
    type: 'sale',
    category: 'transaction',
    action: 'إتمام بيع',
    description: 'تم إتمام عملية بيع خدمة   شامل بقيمة 180 جنيه مصري',
    user: 'أحمد محمد الكاشير',
    userId: 'USR-001',
    role: 'كاشير',
    status: 'مكتمل',
    severity: 'success',
    module: 'نقاط البيع',
    subModule: 'المبيعات',
    deviceId: 'POS-TERMINAL-01',
    deviceType: 'جهاز نقاط البيع',
    deviceName: 'جهاز نقاط البيع الرئيسي',
    ipAddress: '192.168.1.10',
    branchId: 'BR-001',
    branchName: 'فرع الرياض الرئيسي',
    customerName: 'خالد أحمد العتيبي',
    customerId: 'CUST-001',
    vehiclePlate: 'أ ب ج 1234',
    invoiceNumber: 'INV-2024-001',
    amount: 180.00,
    paymentMethod: 'نقدي',
    services: ['  خارجي', '  داخلي', 'تشميع'],
    duration: 120,
    notes: 'عملية بيع عادية',
    tags: ['sale', 'cash', 'car-wash']
  },
  {
    id: 'POS-002',
    timestamp: '2024-01-20T14:25:12',
    type: 'payment',
    category: 'transaction',
    action: 'معالجة دفع',
    description: 'تم استلام دفع بالبطاقة الائتمانية بقيمة 250 جنيه مصري',
    user: 'سارة علي الكاشير',
    userId: 'USR-002',
    role: 'كاشير',
    status: 'مكتمل',
    severity: 'success',
    module: 'نقاط البيع',
    subModule: 'المدفوعات',
    deviceId: 'POS-TERMINAL-02',
    deviceType: 'جهاز نقاط البيع',
    deviceName: 'جهاز نقاط البيع الثانوي',
    ipAddress: '192.168.1.11',
    branchId: 'BR-001',
    branchName: 'فرع الرياض الرئيسي',
    customerName: 'فاطمة محمد السعد',
    customerId: 'CUST-002',
    vehiclePlate: 'د ه و 5678',
    invoiceNumber: 'INV-2024-002',
    amount: 250.00,
    paymentMethod: 'بطاقة ائتمان',
    cardType: 'فيزا',
    cardLastFour: '4567',
    authCode: 'AUTH789',
    services: ['  VIP', 'تنظيف داخلي فاخر'],
    duration: 180,
    notes: 'عميلة VIP',
    tags: ['payment', 'credit-card', 'vip']
  },
  {
    id: 'POS-003',
    timestamp: '2024-01-20T14:20:30',
    type: 'order',
    category: 'service',
    action: 'إنشاء طلب',
    description: 'تم إنشاء طلب جديد لخدمة تنظيف سريع',
    user: 'محمد خالد الموظف',
    userId: 'USR-003',
    role: 'موظف استقبال',
    status: 'قيد التنفيذ',
    severity: 'info',
    module: 'نقاط البيع',
    subModule: 'الطلبات',
    deviceId: 'TABLET-01',
    deviceType: 'جهاز لوحي',
    deviceName: 'تابلت الاستقبال',
    ipAddress: '192.168.1.15',
    branchId: 'BR-001',
    branchName: 'فرع الرياض الرئيسي',
    customerName: 'عبدالعزيز سالم',
    customerId: 'CUST-003',
    vehiclePlate: 'ز ح ط 9012',
    orderNumber: 'ORD-2024-003',
    amount: 80.00,
    services: ['  سريع'],
    estimatedTime: 30,
    queuePosition: 3,
    notes: 'طلب سريع',
    tags: ['order', 'quick-wash', 'in-progress'],
    duration: 60
  },
  {
    id: 'POS-004',
    timestamp: '2024-01-20T14:15:22',
    type: 'refund',
    category: 'transaction',
    action: 'استرداد مبلغ',
    description: 'تم استرداد مبلغ 120 جنيه مصري للعميل بسبب عدم الرضا',
    user: 'نورا أحمد المشرف',
    userId: 'USR-004',
    role: 'مشرف نقاط البيع',
    status: 'مكتمل',
    severity: 'warning',
    module: 'نقاط البيع',
    subModule: 'الاستردادات',
    deviceId: 'POS-TERMINAL-01',
    deviceType: 'جهاز نقاط البيع',
    deviceName: 'جهاز نقاط البيع الرئيسي',
    ipAddress: '192.168.1.10',
    branchId: 'BR-001',
    branchName: 'فرع الرياض الرئيسي',
    customerName: 'راشد عبدالله',
    customerId: 'CUST-004',
    originalInvoice: 'INV-2024-004',
    refundAmount: 120.00,
    refundReason: 'عدم رضا العميل عن جودة الخدمة',
    approvedBy: 'مدير الفرع',
    notes: 'تم الاستجابة لشكوى العميل',
    tags: ['refund', 'customer-complaint', 'quality-issue'],
    duration: 300
  },
  {
    id: 'POS-005',
    timestamp: '2024-01-20T14:10:15',
    type: 'discount',
    category: 'promotion',
    action: 'تطبيق خصم',
    description: 'تم تطبيق خصم 15% على ايصال العميل VIP',
    user: 'علي حسن الكاشير',
    userId: 'USR-005',
    role: 'كاشير',
    status: 'مكتمل',
    severity: 'info',
    module: 'نقاط البيع',
    subModule: 'الخصومات',
    deviceId: 'POS-TERMINAL-03',
    deviceType: 'جهاز نقاط البيع',
    deviceName: 'جهاز نقاط البيع الثالث',
    ipAddress: '192.168.1.12',
    branchId: 'BR-001',
    branchName: 'فرع الرياض الرئيسي',
    customerName: 'مريم سعد الأمير',
    customerId: 'CUST-005',
    invoiceNumber: 'INV-2024-005',
    originalAmount: 200.00,
    discountPercent: 15,
    discountAmount: 30.00,
    finalAmount: 170.00,
    discountType: 'خصم VIP',
    notes: 'عميلة مميزة - خصم تلقائي',
    tags: ['discount', 'vip', 'automatic'],
    duration: 45
  },
  {
    id: 'POS-006',
    timestamp: '2024-01-20T14:05:08',
    type: 'void',
    category: 'transaction',
    action: 'إلغاء ايصال',
    description: 'تم إلغاء ايصال بسبب خطأ في الإدخال',
    user: 'ليلى محمد الكاشير',
    userId: 'USR-006',
    role: 'كاشير',
    status: 'ملغي',
    severity: 'warning',
    module: 'نقاط البيع',
    subModule: 'إلغاء المعاملات',
    deviceId: 'POS-TERMINAL-02',
    deviceType: 'جهاز نقاط البيع',
    deviceName: 'جهاز نقاط البيع الثانوي',
    ipAddress: '192.168.1.11',
    branchId: 'BR-001',
    branchName: 'فرع الرياض الرئيسي',
    invoiceNumber: 'INV-2024-006',
    voidReason: 'خطأ في اختيار الخدمة',
    originalAmount: 150.00,
    approvedBy: 'مشرف النقاط',
    notes: 'خطأ بشري - تم التصحيح',
    tags: ['void', 'error-correction', 'operator-error'],
    duration: 90
  },
  {
    id: 'POS-007',
    timestamp: '2024-01-20T14:00:33',
    type: 'shift-start',
    category: 'system',
    action: 'بداية وردية',
    description: 'تم بدء وردية جديدة للكاشير رقم 1',
    user: 'رانيا سالم الكاشير',
    userId: 'USR-007',
    role: 'كاشير',
    status: 'نشط',
    severity: 'info',
    module: 'نقاط البيع',
    subModule: 'إدارة الورديات',
    deviceId: 'POS-TERMINAL-01',
    deviceType: 'جهاز نقاط البيع',
    deviceName: 'جهاز نقاط البيع الرئيسي',
    ipAddress: '192.168.1.10',
    branchId: 'BR-001',
    branchName: 'فرع الرياض الرئيسي',
    shiftId: 'SHIFT-001',
    startingCash: 500.00,
    shiftStart: '14:00:00',
    expectedEnd: '22:00:00',
    notes: 'بداية وردية مسائية',
    tags: ['shift', 'start', 'cashier'],
    duration: 30
  },
  {
    id: 'POS-008',
    timestamp: '2024-01-20T13:55:41',
    type: 'system-error',
    category: 'technical',
    action: 'خطأ في النظام',
    description: 'حدث خطأ في اتصال جهاز قراءة البطاقات',
    user: 'النظام',
    userId: 'SYSTEM',
    role: 'نظام',
    status: 'خطأ',
    severity: 'error',
    module: 'نقاط البيع',
    subModule: 'الأجهزة الطرفية',
    deviceId: 'CARD-READER-01',
    deviceType: 'قارئ بطاقات',
    deviceName: 'قارئ البطاقات الرئيسي',
    ipAddress: '192.168.1.25',
    branchId: 'BR-001',
    branchName: 'فرع الرياض الرئيسي',
    errorCode: 'ERR-001',
    errorMessage: 'فقدان الاتصال مع قارئ البطاقات',
    resolvedAt: '2024-01-20T14:00:00',
    resolution: 'إعادة تشغيل الجهاز',
    notes: 'تم حل المشكلة بسرعة',
    tags: ['error', 'card-reader', 'resolved'],
    duration: 300
  },
  {
    id: 'POS-009',
    timestamp: '2024-01-20T13:50:17',
    type: 'loyalty',
    category: 'customer',
    action: 'إضافة نقاط ولاء',
    description: 'تم إضافة 18 نقطة ولاء لحساب العميل',
    user: 'محمد خالد الكاشير',
    userId: 'USR-003',
    role: 'كاشير',
    status: 'مكتمل',
    severity: 'info',
    module: 'نقاط البيع',
    subModule: 'برنامج الولاء',
    deviceId: 'POS-TERMINAL-01',
    deviceType: 'جهاز نقاط البيع',
    deviceName: 'جهاز نقاط البيع الرئيسي',
    ipAddress: '192.168.1.10',
    branchId: 'BR-001',
    branchName: 'فرع الرياض الرئيسي',
    customerName: 'عبدالله محمد الزهراني',
    customerId: 'CUST-006',
    invoiceNumber: 'INV-2024-007',
    purchaseAmount: 180.00,
    pointsEarned: 18,
    totalPoints: 245,
    notes: 'نقاط مكتسبة من الشراء',
    tags: ['loyalty', 'points', 'customer-reward'],
    duration: 60
  },
  {
    id: 'POS-010',
    timestamp: '2024-01-20T13:45:29',
    type: 'cash-count',
    category: 'financial',
    action: 'عد النقدية',
    description: 'تم إجراء عد دوري للنقدية في الدرج',
    user: 'أحمد محمد الكاشير',
    userId: 'USR-001',
    role: 'كاشير',
    status: 'مكتمل',
    severity: 'info',
    module: 'نقاط البيع',
    subModule: 'إدارة النقدية',
    deviceId: 'POS-TERMINAL-01',
    deviceType: 'جهاز نقاط البيع',
    deviceName: 'جهاز نقاط البيع الرئيسي',
    ipAddress: '192.168.1.10',
    branchId: 'BR-001',
    branchName: 'فرع الرياض الرئيسي',
    expectedAmount: 1250.00,
    actualAmount: 1245.00,
    variance: -5.00,
    countType: 'دوري',
    notes: 'فرق بسيط في العد - مقبول',
    tags: ['cash-count', 'routine', 'minor-variance'],
    duration: 240
  },
  {
    id: 'POS-011',
    timestamp: '2024-01-20T13:40:15',
    type: 'report',
    category: 'analytics',
    action: 'طباعة تقرير',
    description: 'تم طباعة تقرير المبيعات للوردية الحالية',
    user: 'نورا أحمد المشرف',
    userId: 'USR-004',
    role: 'مشرف نقاط البيع',
    status: 'مكتمل',
    severity: 'info',
    module: 'نقاط البيع',
    subModule: 'التقارير',
    deviceId: 'POS-TERMINAL-01',
    deviceType: 'جهاز نقاط البيع',
    deviceName: 'جهاز نقاط البيع الرئيسي',
    ipAddress: '192.168.1.10',
    branchId: 'BR-001',
    branchName: 'فرع الرياض الرئيسي',
    reportType: 'مبيعات الوردية',
    totalSales: 2450.00,
    transactionCount: 15,
    printTime: '13:40:15',
    notes: 'تقرير دوري للمتابعة',
    tags: ['report', 'shift-sales', 'printed'],
    duration: 120
  },
  {
    id: 'POS-012',
    timestamp: '2024-01-20T13:35:42',
    type: 'price-check',
    category: 'service',
    action: 'التحقق من السعر',
    description: 'تم التحقق من سعر خدمة التنظيف الداخلي المتقدم',
    user: 'سارة علي الكاشير',
    userId: 'USR-002',
    role: 'كاشير',
    status: 'مكتمل',
    severity: 'info',
    module: 'نقاط البيع',
    subModule: 'إدارة الأسعار',
    deviceId: 'POS-TERMINAL-02',
    deviceType: 'جهاز نقاط البيع',
    deviceName: 'جهاز نقاط البيع الثانوي',
    ipAddress: '192.168.1.11',
    branchId: 'BR-001',
    branchName: 'فرع الرياض الرئيسي',
    serviceCode: 'SRV-INT-ADV',
    serviceName: 'تنظيف داخلي متقدم',
    currentPrice: 150.00,
    customerInquiry: true,
    notes: 'استفسار من العميل عن السعر',
    tags: ['price-check', 'customer-inquiry', 'service'],
    duration: 30
  }
];

export default function OperationsLog() {
  const [operations, setOperations] = useState(mockPOSOperations);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('الكل');
  const [statusFilter, setStatusFilter] = useState('الكل');
  const [severityFilter, setSeverityFilter] = useState('الكل');
  const [userFilter, setUserFilter] = useState('الكل');
  const [moduleFilter, setModuleFilter] = useState('الكل');
  const [dateFilter, setDateFilter] = useState('اليوم');
  const [selectedOperation, setSelectedOperation] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showStatsDialog, setShowStatsDialog] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [animatedCards, setAnimatedCards] = useState([]);
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const { toast } = useToast();

  // Animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedCards(operations.map(op => op.id));
    }, 100);
    return () => clearTimeout(timer);
  }, [operations]);

  // Filter operations
  const filteredOperations = operations.filter(operation => {
    const matchesSearch = searchTerm === '' || 
      operation.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      operation.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      operation.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      operation.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'الكل' || operation.type === typeFilter;
    const matchesStatus = statusFilter === 'الكل' || operation.status === statusFilter;
    const matchesSeverity = severityFilter === 'الكل' || operation.severity === severityFilter;
    const matchesUser = userFilter === 'الكل' || operation.user === userFilter;
    const matchesModule = moduleFilter === 'الكل' || operation.module === moduleFilter;

    return matchesSearch && matchesType && matchesStatus && matchesSeverity && matchesUser && matchesModule;
  });

  // Get statistics
  const stats = {
    total: operations.length,
    success: operations.filter(op => op.severity === 'success').length,
    warning: operations.filter(op => op.severity === 'warning').length,
    error: operations.filter(op => op.severity === 'error').length,
    info: operations.filter(op => op.severity === 'info').length,
    totalAmount: operations.filter(op => op.amount).reduce((sum, op) => sum + (op.amount || 0), 0),
    avgDuration: operations.filter(op => op.duration).reduce((sum, op) => sum + (op.duration || 0), 0) / operations.filter(op => op.duration).length || 0
  };

  // Get unique values for filters
  const uniqueTypes = [...new Set(operations.map(op => op.type))];
  const uniqueStatuses = [...new Set(operations.map(op => op.status))];
  const uniqueSeverities = [...new Set(operations.map(op => op.severity))];
  const uniqueUsers = [...new Set(operations.map(op => op.user))];
  const uniqueModules = [...new Set(operations.map(op => op.module))];

  // Utility functions
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('ar-SA', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDuration = (seconds) => {
    if (!seconds) return 'غير محدد';
    if (seconds < 60) return `${seconds} ثانية`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0 ? `${minutes} دقيقة ${remainingSeconds} ثانية` : `${minutes} دقيقة`;
  };

  const getTypeIcon = (type) => {
    const icons = {
      'sale': ShoppingCart,
      'payment': CreditCard,
      'order': Receipt,
      'refund': RotateCcw,
      'discount': Percent,
      'void': Ban,
      'shift-start': Users,
      'system-error': XCircle,
      'loyalty': Coins,
      'cash-count': Calculator,
      'report': FileBarChart,
      'price-check': Eye
    };
    return icons[type] || Activity;
  };

  const getSeverityColor = (severity) => {
    const colors = {
      'success': 'text-green-600 bg-green-50 border-green-200',
      'info': 'text-blue-600 bg-blue-50 border-blue-200',
      'warning': 'text-yellow-600 bg-yellow-50 border-yellow-200',
      'error': 'text-red-600 bg-red-50 border-red-200'
    };
    return colors[severity] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getStatusColor = (status) => {
    const colors = {
      'مكتمل': 'bg-green-100 text-green-800',
      'قيد التنفيذ': 'bg-blue-100 text-blue-800',
      'نشط': 'bg-blue-100 text-blue-800',
      'ملغي': 'bg-red-100 text-red-800',
      'خطأ': 'bg-red-100 text-red-800',
      'نجح': 'bg-green-100 text-green-800',
      'فشل': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getDeviceIcon = (deviceType) => {
    const icons = {
      'جهاز نقاط البيع': Monitor,
      'جهاز لوحي': Tablet,
      'قارئ بطاقات': CreditCard,
      'طابعة': Printer
    };
    return icons[deviceType] || Monitor;
  };

  // Export functionality
  const exportData = (format) => {
    setIsLoading(true);
    
    setTimeout(() => {
      const exportData = filteredOperations.map(op => ({
        'رقم العملية': op.id,
        'التاريخ والوقت': formatTimestamp(op.timestamp),
        'النوع': op.type,
        'الإجراء': op.action,
        'الوصف': op.description,
        'المستخدم': op.user,
        'الدور': op.role,
        'الحالة': op.status,
        'الأهمية': op.severity,
        'الوحدة': op.module,
        'الجهاز': op.deviceName,
        'عنوان IP': op.ipAddress,
        'الفرع': op.branchName,
        'المدة': op.duration ? formatDuration(op.duration) : 'غير محدد'
      }));

      if (format === 'csv') {
        const csvContent = [
          Object.keys(exportData[0]).join(','),
          ...exportData.map(row => Object.values(row).join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `operations-log-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      setIsLoading(false);
      toast({
        title: "تم التصدير بنجاح",
        description: `تم تصدير ${filteredOperations.length} عملية`,
      });
    }, 1500);
  };

  // Print functionality
  const printReport = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>سجل العمليات - نقاط البيع</title>
            <style>
              body { font-family: Arial, sans-serif; direction: rtl; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }
              th { background-color: #f2f2f2; }
              .header { text-align: center; margin-bottom: 20px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>سجل العمليات والأنشطة - نقاط البيع</h1>
              <p>تاريخ التقرير: ${new Date().toLocaleDateString('ar-SA')}</p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>رقم العملية</th>
                  <th>التاريخ والوقت</th>
                  <th>النوع</th>
                  <th>الإجراء</th>
                  <th>المستخدم</th>
                  <th>الحالة</th>
                </tr>
              </thead>
              <tbody>
                ${filteredOperations.map(op => `
                  <tr>
                    <td>${op.id}</td>
                    <td>${formatTimestamp(op.timestamp)}</td>
                    <td>${op.type}</td>
                    <td>${op.action}</td>
                    <td>${op.user}</td>
                    <td>${op.status}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
      
      setIsLoading(false);
      toast({
        title: "تم إرسال التقرير للطابعة",
        description: "يتم الآن طباعة سجل العمليات",
      });
    }, 1000);
  };

  // Refresh data
  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setOperations([...mockPOSOperations]);
      setAnimatedCards([]);
      setTimeout(() => {
        setAnimatedCards(mockPOSOperations.map(op => op.id));
      }, 100);
      setIsLoading(false);
      toast({
        title: "تم تحديث البيانات",
        description: "تم تحديث سجل العمليات بأحدث البيانات",
      });
    }, 1000);
  };

  const viewDetails = (operation) => {
    setSelectedOperation(operation);
    setShowDetailsDialog(true);
  };

  const DeviceIcon = getDeviceIcon(selectedOperation?.deviceType);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">سجل العمليات - نقاط البيع</h1>
          <p className="text-gray-600">متابعة وتسجيل جميع العمليات والأنشطة الخاصة بنقاط البيع</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={refreshData}
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            تحديث
          </Button>
          <Button
            onClick={() => setShowStatsDialog(true)}
            variant="outline"
            size="sm"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            الإحصائيات
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">إجمالي العمليات</p>
                <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">عمليات ناجحة</p>
                <p className="text-2xl font-bold text-green-900">{stats.success}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">تحذيرات</p>
                <p className="text-2xl font-bold text-orange-900">{stats.warning}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">إجمالي المبلغ</p>
                <p className="text-2xl font-bold text-purple-900">{stats.totalAmount.toLocaleString()} جنيه مصري</p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              الفلاتر والبحث
            </CardTitle>
            <div className="flex gap-2">
              <Button
                onClick={printReport}
                disabled={isLoading}
                variant="outline"
                size="sm"
              >
                <Printer className="w-4 h-4 mr-2" />
                طباعة
              </Button>
              <Button
                onClick={() => exportData('csv')}
                disabled={isLoading}
                variant="outline"
                size="sm"
              >
                <Download className="w-4 h-4 mr-2" />
                تصدير CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="البحث في العمليات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>

          {/* Basic Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="نوع العملية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="الكل">جميع الأنواع</SelectItem>
                {uniqueTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="الكل">جميع الحالات</SelectItem>
                {uniqueStatuses.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="الأهمية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="الكل">جميع المستويات</SelectItem>
                {uniqueSeverities.map(severity => (
                  <SelectItem key={severity} value={severity}>{severity}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={userFilter} onValueChange={setUserFilter}>
              <SelectTrigger>
                <SelectValue placeholder="المستخدم" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="الكل">جميع المستخدمين</SelectItem>
                {uniqueUsers.map(user => (
                  <SelectItem key={user} value={user}>{user}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={moduleFilter} onValueChange={setModuleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="الوحدة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="الكل">جميع الوحدات</SelectItem>
                {uniqueModules.map(module => (
                  <SelectItem key={module} value={module}>{module}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={() => {
                setSearchTerm('');
                setTypeFilter('الكل');
                setStatusFilter('الكل');
                setSeverityFilter('الكل');
                setUserFilter('الكل');
                setModuleFilter('الكل');
                setDateFilter('اليوم');
              }}
              variant="outline"
              className="w-full"
            >
              مسح الفلاتر
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Operations List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
            <span className="mr-2 text-gray-600">جاري التحديث...</span>
          </div>
        ) : filteredOperations.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد عمليات</h3>
              <p className="text-gray-600">لم يتم العثور على عمليات تطابق معايير البحث المحددة</p>
            </CardContent>
          </Card>
        ) : (
          filteredOperations.map((operation) => {
            const TypeIcon = getTypeIcon(operation.type);
            const isAnimated = animatedCards.includes(operation.id);
            
            return (
              <Card 
                key={operation.id} 
                className={cn(
                  "transition-all duration-300 hover:shadow-lg cursor-pointer border-r-4",
                  getSeverityColor(operation.severity),
                  isAnimated ? "animate-fade-in" : "opacity-0"
                )}
                onClick={() => viewDetails(operation)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 space-x-reverse flex-1">
                      <div className={cn(
                        "p-3 rounded-lg",
                        getSeverityColor(operation.severity)
                      )}>
                        <TypeIcon className="w-6 h-6" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{operation.action}</h3>
                          <Badge className={getStatusColor(operation.status)}>
                            {operation.status}
                          </Badge>
                          {operation.amount && (
                            <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                              {operation.amount.toLocaleString()} جنيه مصري
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-gray-600 mb-3">{operation.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{formatTimestamp(operation.timestamp)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>{operation.user} ({operation.role})</span>
                          </div>
                          {operation.duration && (
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>المدة: {formatDuration(operation.duration)}</span>
                            </div>
                          )}
                        </div>

                        {(operation.customerName || operation.vehiclePlate || operation.invoiceNumber) && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                              {operation.customerName && (
                                <div className="flex items-center gap-2">
                                  <User className="w-3 h-3" />
                                  <span>{operation.customerName}</span>
                                </div>
                              )}
                              {operation.vehiclePlate && (
                                <div className="flex items-center gap-2">
                                  <Car className="w-3 h-3" />
                                  <span>{operation.vehiclePlate}</span>
                                </div>
                              )}
                              {operation.invoiceNumber && (
                                <div className="flex items-center gap-2">
                                  <Receipt className="w-3 h-3" />
                                  <span>{operation.invoiceNumber}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <span className="text-xs text-gray-400">{operation.id}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              تفاصيل العملية: {selectedOperation?.id}
            </DialogTitle>
          </DialogHeader>
          
          {selectedOperation && (
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="general">معلومات عامة</TabsTrigger>
                <TabsTrigger value="technical">معلومات تقنية</TabsTrigger>
                <TabsTrigger value="financial">معلومات مالية</TabsTrigger>
                <TabsTrigger value="additional">معلومات إضافية</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">رقم العملية</Label>
                    <p className="mt-1 text-sm text-gray-900">{selectedOperation.id}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">التاريخ والوقت</Label>
                    <p className="mt-1 text-sm text-gray-900">{formatTimestamp(selectedOperation.timestamp)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">نوع العملية</Label>
                    <p className="mt-1 text-sm text-gray-900">{selectedOperation.type}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">الإجراء</Label>
                    <p className="mt-1 text-sm text-gray-900">{selectedOperation.action}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-sm font-medium text-gray-700">الوصف</Label>
                    <p className="mt-1 text-sm text-gray-900">{selectedOperation.description}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">المستخدم</Label>
                    <p className="mt-1 text-sm text-gray-900">{selectedOperation.user}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">الدور</Label>
                    <p className="mt-1 text-sm text-gray-900">{selectedOperation.role}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">الحالة</Label>
                    <Badge className={getStatusColor(selectedOperation.status)}>
                      {selectedOperation.status}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">مستوى الأهمية</Label>
                    <Badge className={getSeverityColor(selectedOperation.severity)}>
                      {selectedOperation.severity}
                    </Badge>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="technical" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">الوحدة</Label>
                    <p className="mt-1 text-sm text-gray-900">{selectedOperation.module}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">الوحدة الفرعية</Label>
                    <p className="mt-1 text-sm text-gray-900">{selectedOperation.subModule}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">معرف الجهاز</Label>
                    <p className="mt-1 text-sm text-gray-900">{selectedOperation.deviceId}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">نوع الجهاز</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <DeviceIcon className="w-4 h-4" />
                      <span className="text-sm text-gray-900">{selectedOperation.deviceType}</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">اسم الجهاز</Label>
                    <p className="mt-1 text-sm text-gray-900">{selectedOperation.deviceName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">عنوان IP</Label>
                    <p className="mt-1 text-sm text-gray-900">{selectedOperation.ipAddress}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">الفرع</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Building className="w-4 h-4" />
                      <span className="text-sm text-gray-900">{selectedOperation.branchName}</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">المدة</Label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedOperation.duration ? formatDuration(selectedOperation.duration) : 'غير محدد'}
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="financial" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {selectedOperation.amount && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">المبلغ</Label>
                      <p className="mt-1 text-lg font-semibold text-green-600">
                        {selectedOperation.amount.toLocaleString()} جنيه مصري
                      </p>
                    </div>
                  )}
                  {selectedOperation.paymentMethod && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">طريقة الدفع</Label>
                      <p className="mt-1 text-sm text-gray-900">{selectedOperation.paymentMethod}</p>
                    </div>
                  )}
                  {selectedOperation.invoiceNumber && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">رقم الايصال</Label>
                      <p className="mt-1 text-sm text-gray-900">{selectedOperation.invoiceNumber}</p>
                    </div>
                  )}
                  {selectedOperation.discountAmount && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">مبلغ الخصم</Label>
                      <p className="mt-1 text-sm text-red-600">
                        -{selectedOperation.discountAmount.toLocaleString()} جنيه مصري
                      </p>
                    </div>
                  )}
                  {selectedOperation.refundAmount && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">مبلغ الاسترداد</Label>
                      <p className="mt-1 text-sm text-orange-600">
                        {selectedOperation.refundAmount.toLocaleString()} جنيه مصري
                      </p>
                    </div>
                  )}
                  {selectedOperation.startingCash && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">رصيد بداية الوردية</Label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedOperation.startingCash.toLocaleString()} جنيه مصري
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="additional" className="space-y-4">
                <div className="space-y-4">
                  {selectedOperation.customerName && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">اسم العميل</Label>
                      <p className="mt-1 text-sm text-gray-900">{selectedOperation.customerName}</p>
                    </div>
                  )}
                  {selectedOperation.vehiclePlate && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">رقم اللوحة</Label>
                      <p className="mt-1 text-sm text-gray-900">{selectedOperation.vehiclePlate}</p>
                    </div>
                  )}
                  {selectedOperation.services && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">الخدمات</Label>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {selectedOperation.services.map((service, index) => (
                          <Badge key={index} variant="outline">{service}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedOperation.notes && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">ملاحظات</Label>
                      <Textarea 
                        value={selectedOperation.notes} 
                        readOnly 
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                  )}
                  {selectedOperation.tags && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">العلامات</Label>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {selectedOperation.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Statistics Dialog */}
      <Dialog open={showStatsDialog} onOpenChange={setShowStatsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              إحصائيات سجل العمليات
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                <p className="text-sm text-blue-800">إجمالي العمليات</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{stats.success}</p>
                <p className="text-sm text-green-800">عمليات ناجحة</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600">{stats.warning}</p>
                <p className="text-sm text-yellow-800">تحذيرات</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-2xl font-bold text-red-600">{stats.error}</p>
                <p className="text-sm text-red-800">أخطاء</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">{stats.totalAmount.toLocaleString()} جنيه مصري</p>
                <p className="text-sm text-purple-800">إجمالي المبالغ المالية</p>
              </div>
              <div className="text-center p-4 bg-indigo-50 rounded-lg">
                <p className="text-2xl font-bold text-indigo-600">{Math.round(stats.avgDuration)} ثانية</p>
                <p className="text-sm text-indigo-800">متوسط مدة العمليات</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}