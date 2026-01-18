import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

import { cn } from "@/lib/utils";
import {
  Search,
  Filter,
  Clock,
  AlertTriangle,
  CheckCircle,
  Phone,
  User,
  Car,
  Receipt,
  CreditCard,
  Printer,
  FileText,
  Calendar,
  DollarSign,
  BarChart3,
  TrendingUp,
  AlertCircle,
  Crown,
  Star,
  Target,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Send,
  Download,
  Plus
} from 'lucide-react';

export default function OutstandingInvoices() {
  const navigate = useNavigate();
  // بيانات تجريبية للإيصالات المستحقة
  const [invoices, setInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('الكل');
  const [priorityFilter, setPriorityFilter] = useState('الكل');
  const [customerFilter, setCustomerFilter] = useState('الكل');
  const [dateFilter, setDateFilter] = useState('الكل');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showReminderDialog, setShowReminderDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [animatedCards, setAnimatedCards] = useState([]);
  const { toast } = useToast();

  // Animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedCards(invoices.map(inv => inv.id));
    }, 100);
    return () => clearTimeout(timer);
  }, [invoices]);

  // Filter invoices
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = searchTerm === '' || 
      invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customerPhone.includes(searchTerm) ||
      invoice.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'الكل' || invoice.status === statusFilter;
    const matchesPriority = priorityFilter === 'الكل' || invoice.priority === priorityFilter;
    const matchesCustomer = customerFilter === 'الكل' || invoice.customerName === customerFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'الكل') {
      const today = new Date();
      const dueDate = new Date(invoice.dueDate);
      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      switch (dateFilter) {
        case 'متأخرة':
          matchesDate = diffDays < 0;
          break;
        case 'تستحق اليوم':
          matchesDate = diffDays === 0;
          break;
        case 'تستحق خلال أسبوع':
          matchesDate = diffDays > 0 && diffDays <= 7;
          break;
        case 'تستحق خلال شهر':
          matchesDate = diffDays > 7 && diffDays <= 30;
          break;
        default:
          matchesDate = true;
      }
    }

    return matchesSearch && matchesStatus && matchesPriority && matchesCustomer && matchesDate;
  });

  // Statistics
  const stats = {
    total: invoices.length,
    overdue: invoices.filter(inv => new Date(inv.dueDate) < new Date()).length,
    partial: invoices.filter(inv => inv.status === 'جزئي').length,
    unpaid: invoices.filter(inv => inv.status === 'غير مدفوع').length,
    totalAmount: invoices.reduce((sum, inv) => sum + inv.remainingAmount, 0),
    overdueAmount: invoices.filter(inv => new Date(inv.dueDate) < new Date()).reduce((sum, inv) => sum + inv.remainingAmount, 0)
  };

  const getStatusConfig = (status) => {
    const configs = {
      'جزئي': { color: 'bg-yellow-500', textColor: 'text-yellow-800', bgColor: 'bg-yellow-50', icon: Clock },
      'غير مدفوع': { color: 'bg-red-500', textColor: 'text-red-800', bgColor: 'bg-red-50', icon: AlertTriangle },
      'متأخر': { color: 'bg-orange-500', textColor: 'text-orange-800', bgColor: 'bg-orange-50', icon: AlertCircle }
    };
    return configs[status] || configs['غير مدفوع'];
  };

  const getPriorityConfig = (priority) => {
    const configs = {
      'عالي': { color: 'text-red-600', bg: 'bg-red-100', icon: AlertTriangle },
      'متوسط': { color: 'text-yellow-600', bg: 'bg-yellow-100', icon: Clock },
      'عادي': { color: 'text-green-600', bg: 'bg-green-100', icon: CheckCircle }
    };
    return configs[priority] || configs['عادي'];
  };

  const getMembershipIcon = (level) => {
    const icons = {
      'بلاتيني': Crown,
      'ذهبي': Star,
      'فضي': Target,
      'برونزي': Target
    };
    return icons[level] || Target;
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleMarkAsPaid = (invoice) => {
    setInvoices(prev => prev.map(inv => 
      inv.id === invoice.id 
        ? { ...inv, status: 'مدفوع', paidAmount: inv.totalAmount, remainingAmount: 0 }
        : inv
    ));
    
    toast({
      title: "تم تحديث الايصال",
      description: `تم وضع علامة مدفوع على الايصال ${invoice.id}`
    });
  };

  const handleSendReminder = (invoice) => {
    toast({
      title: "تم إرسال التذكير",
      description: `تم إرسال تذكير للعميل ${invoice.customerName} على رقم ${invoice.customerPhone}`
    });
    setShowReminderDialog(false);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "تم تحديث البيانات",
        description: "تم تحديث قائمة الإيصالات غير المسددة"
      });
    }, 1500);
  };

  const handleExport = () => {
    const csvContent = [
      ['رقم الايصال', 'اسم العميل', 'رقم الهاتف', 'المبلغ المستحق', 'الحالة', 'تاريخ الاستحقاق'].join(','),
      ...filteredInvoices.map(inv => [
        inv.id,
        inv.customerName,
        inv.customerPhone,
        inv.remainingAmount,
        inv.status,
        format(new Date(inv.dueDate), 'yyyy-MM-dd')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `outstanding-invoices-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();

    toast({
      title: "تم التصدير بنجاح",
      description: `تم تصدير ${filteredInvoices.length} ايصال`
    });
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('الكل');
    setPriorityFilter('الكل');
    setCustomerFilter('الكل');
    setDateFilter('الكل');
    toast({
      title: "تم إعادة تعيين الفلاتر",
      description: "تم حذف جميع معايير البحث والفلترة"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">
              الإيصالات غير المسددة
            </h1>
            <p className="text-gray-600 mt-1">متابعة وإدارة الإيصالات المستحقة والمتأخرة</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className={cn("w-4 h-4 ml-2", isLoading && "animate-spin")} />
              تحديث
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 ml-2" />
              تصدير
            </Button>
            <Button onClick={() => navigate('/pos/customer-payments')}>
              <Plus className="w-4 h-4 ml-2" />
              تسجيل دفعة
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">إجمالي الإيصالات</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <Receipt className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm">متأخرة</p>
                  <p className="text-3xl font-bold">{stats.overdue}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm">دفع جزئي</p>
                  <p className="text-3xl font-bold">{stats.partial}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">إجمالي المستحق</p>
                  <p className="text-2xl font-bold">{stats.totalAmount.toFixed(0)} جنيه مصري</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="بحث بالاسم، الهاتف، اللوحة، أو رقم الايصال..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="الكل">جميع الحالات</SelectItem>
                  <SelectItem value="غير مدفوع">غير مدفوع</SelectItem>
                  <SelectItem value="جزئي">دفع جزئي</SelectItem>
                  <SelectItem value="متأخر">متأخر</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="الأولوية" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="الكل">جميع الأولويات</SelectItem>
                  <SelectItem value="عالي">عالية</SelectItem>
                  <SelectItem value="متوسط">متوسطة</SelectItem>
                  <SelectItem value="عادي">عادية</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="تاريخ الاستحقاق" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="الكل">جميع التواريخ</SelectItem>
                  <SelectItem value="متأخرة">متأخرة</SelectItem>
                  <SelectItem value="تستحق اليوم">تستحق اليوم</SelectItem>
                  <SelectItem value="تستحق خلال أسبوع">خلال أسبوع</SelectItem>
                  <SelectItem value="تستحق خلال شهر">خلال شهر</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={resetFilters}>
                <Filter className="w-4 h-4 ml-2" />
                إعادة تعيين
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Invoices Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              الإيصالات المستحقة ({filteredInvoices.length})
            </h2>
            <div className="flex gap-2">
              <Badge variant="destructive">
                متأخرة: {filteredInvoices.filter(inv => getDaysUntilDue(inv.dueDate) < 0).length}
              </Badge>
              <Badge variant="secondary">
                مستحقة قريباً: {filteredInvoices.filter(inv => {
                  const days = getDaysUntilDue(inv.dueDate);
                  return days >= 0 && days <= 7;
                }).length}
              </Badge>
            </div>
          </div>

          {filteredInvoices.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredInvoices.map((invoice, index) => {
                const customer = { id: "1", customerType: "VIP" }; // بيانات تجريبية للعميل
                const statusConfig = getStatusConfig(invoice.status);
                const priorityConfig = getPriorityConfig(invoice.priority);
                const daysUntilDue = getDaysUntilDue(invoice.dueDate);
                const isOverdue = daysUntilDue < 0;
                const MembershipIcon = getMembershipIcon(customer?.customerType);

                return (
                  <Card 
                    key={invoice.id}
                    className={cn(
                      "border-0 shadow-lg transition-all duration-300 hover:shadow-xl transform hover:scale-[1.02] animate-fade-in",
                      isOverdue ? "border-l-4 border-l-red-500" : "border-l-4 border-l-blue-500",
                      animatedCards.includes(invoice.id) ? "opacity-100" : "opacity-0"
                    )}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {invoice.id}
                          </Badge>
                          <Badge className={cn("text-xs", statusConfig.bgColor, statusConfig.textColor)}>
                            {invoice.status}
                          </Badge>
                          {invoice.priority === 'عالي' && (
                            <Badge variant="destructive" className="text-xs">
                              أولوية عالية
                            </Badge>
                          )}
                        </div>
                        <div className={cn("p-1 rounded-full", priorityConfig.bg)}>
                          <priorityConfig.icon className={cn("w-4 h-4", priorityConfig.color)} />
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Customer Info */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">{invoice.customerName}</span>
                          {customer?.customerType === 'VIP' && <Crown className="w-4 h-4 text-yellow-600" />}
                          <MembershipIcon className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-3 h-3" />
                          <span>{invoice.customerPhone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Car className="w-3 h-3" />
                          <span>{invoice.plateNumber}</span>
                        </div>
                      </div>

                      {/* Amount Info */}
                      <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>المبلغ الإجمالي:</span>
                          <span className="font-medium">{invoice.totalAmount} جنيه مصري</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>المدفوع:</span>
                          <span className="text-green-600">{invoice.paidAmount} جنيه مصري</span>
                        </div>
                        <div className="flex justify-between text-sm font-bold">
                          <span>المتبقي:</span>
                          <span className="text-red-600">{invoice.remainingAmount} جنيه مصري</span>
                        </div>
                      </div>

                      {/* Services */}
                      <div>
                        <p className="text-xs text-gray-500 mb-1">الخدمات:</p>
                        <div className="flex flex-wrap gap-1">
                          {invoice.services.map((service, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Dates */}
                      <div className="space-y-1 text-xs text-gray-500">
                        <div className="flex justify-between">
                          <span>تاريخ الإنشاء:</span>
                          <span>{format(new Date(invoice.issueDate), 'yyyy-MM-dd', { locale: ar })}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>تاريخ الاستحقاق:</span>
                          <span className={cn(
                            "font-medium",
                            isOverdue ? "text-red-600" : daysUntilDue <= 7 ? "text-yellow-600" : "text-gray-600"
                          )}>
                            {format(new Date(invoice.dueDate), 'yyyy-MM-dd', { locale: ar })}
                            {isOverdue && ` (متأخر ${Math.abs(daysUntilDue)} يوم)`}
                            {!isOverdue && daysUntilDue <= 7 && ` (${daysUntilDue} يوم متبقي)`}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2 border-t">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedInvoice(invoice)}
                          className="flex-1"
                        >
                          <Eye className="w-3 h-3 ml-1" />
                          عرض
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            const customer = { id: "1", customerType: "VIP" }; // بيانات تجريبية
                            const queryParams = new URLSearchParams({
                              customerId: invoice.customerId,
                              customerName: invoice.customerName,
                              customerPhone: invoice.customerPhone,
                              plateNumber: invoice.plateNumber,
                              invoiceId: invoice.id,
                              amount: invoice.remainingAmount.toString(),
                              services: invoice.services.join(','),
                              isVIP: customer?.customerType === 'VIP' ? 'true' : 'false',
                              membershipLevel: customer?.customerType || 'Regular'
                            });
                            navigate(`/pos/customer-payments?${queryParams.toString()}`);
                          }}
                          className="flex-1"
                        >
                          <CreditCard className="w-3 h-3 ml-1" />
                          دفع
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedInvoice(invoice);
                            setShowReminderDialog(true);
                          }}
                        >
                          <Send className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12">
                <div className="text-center text-gray-500">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-xl font-medium mb-2">لا توجد إيصالات مستحقة</h3>
                  <p>لا توجد إيصالات تطابق معايير البحث المحددة</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>تسجيل دفعة للايصال {selectedInvoice?.id}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 p-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-lg font-bold text-blue-600">
                المبلغ المستحق: {selectedInvoice?.remainingAmount} جنيه مصري
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => {
                  navigate(`/pos/customer-payments?invoice=${selectedInvoice?.id}`);
                }}
                className="flex-1"
              >
                انتقال لشاشة الدفع
              </Button>
              <Button 
                variant="outline"
                onClick={() => handleMarkAsPaid(selectedInvoice)}
                className="flex-1"
              >
                وضع علامة مدفوع
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reminder Dialog */}
      <Dialog open={showReminderDialog} onOpenChange={setShowReminderDialog}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>إرسال تذكير للعميل</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 p-4">
            <div className="text-sm text-gray-600">
              <p>العميل: {selectedInvoice?.customerName}</p>
              <p>رقم الهاتف: {selectedInvoice?.customerPhone}</p>
              <p>المبلغ المستحق: {selectedInvoice?.remainingAmount} جنيه مصري</p>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => handleSendReminder(selectedInvoice)}
                className="flex-1"
              >
                <Send className="w-4 h-4 ml-2" />
                إرسال رسالة نصية
              </Button>
              <Button 
                variant="outline"
                onClick={() => setShowReminderDialog(false)}
                className="flex-1"
              >
                إلغاء
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}