import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useCustomerStore } from "@/hooks/useCustomerStore";
import {
  CreditCard, DollarSign, Receipt, User, Phone, Car, Calendar,
  CheckCircle, AlertCircle, ArrowLeft, Search, Filter, Download,
  Eye, Edit, Trash2, Plus, Clock, TrendingUp
} from "lucide-react";

interface Payment {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  plateNumber?: string;
  invoiceId?: string;
  amount: number;
  paymentMethod: string;
  paymentDate: string;
  status: "مكتمل" | "معلق" | "مرفوض";
  notes?: string;
  cashierName: string;
  services?: string[];
}

interface OutstandingInvoice {
  id: string;
  customerName: string;
  customerPhone: string;
  plateNumber: string;
  services: string[];
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  invoiceDate: string;
  dueDate: string;
  status: "مستحق" | "متأخر" | "مكتمل";
}

export default function CustomerPayments() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { customers, getCustomerById } = useCustomerStore();
  
  const [payments, setPayments] = useState<Payment[]>([]);
  const [outstandingInvoices, setOutstandingInvoices] = useState<OutstandingInvoice[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterMethod, setFilterMethod] = useState("all");
  const [isNewPaymentOpen, setIsNewPaymentOpen] = useState(false);

  const [newPayment, setNewPayment] = useState({
    customerId: "",
    customerName: "",
    customerPhone: "",
    plateNumber: "",
    invoiceId: "",
    amount: "",
    paymentMethod: "نقد",
    notes: "",
    services: ""
  });

  // Pre-fill from URL parameters
  useEffect(() => {
    console.log("💳 CustomerPayments component loaded");
    
    const customerName = searchParams.get('customerName');
    const customerPhone = searchParams.get('customerPhone');
    const plateNumber = searchParams.get('plateNumber');
    const invoiceId = searchParams.get('invoiceId');
    const amount = searchParams.get('amount');
    const services = searchParams.get('services');

    if (customerName || customerPhone || invoiceId) {
      setNewPayment(prev => ({
        ...prev,
        customerName: customerName || "",
        customerPhone: customerPhone || "",
        plateNumber: plateNumber || "",
        invoiceId: invoiceId || "",
        amount: amount || "",
        services: services || ""
      }));
      setIsNewPaymentOpen(true);
    }

    // Load data from localStorage
    const savedPayments = localStorage.getItem("customer_payments");
    const savedInvoices = localStorage.getItem("outstanding_invoices");

    if (savedPayments) {
      setPayments(JSON.parse(savedPayments));
    } else {
      // Sample data
      const samplePayments: Payment[] = [
        {
          id: "pay_001",
          customerId: "customer_1",
          customerName: "أحمد محمد السالم",
          customerPhone: "0501234567",
          plateNumber: "أ ب ج 1234",
          invoiceId: "INV-001",
          amount: 150,
          paymentMethod: "بطاقة ائتمان",
          paymentDate: new Date().toISOString(),
          status: "مكتمل",
          notes: "دفعة كاملة",
          cashierName: "محمد أحمد",
          services: ["  خارجي", "تنظيف داخلي"]
        }
      ];
      setPayments(samplePayments);
      localStorage.setItem("customer_payments", JSON.stringify(samplePayments));
    }

    if (savedInvoices) {
      setOutstandingInvoices(JSON.parse(savedInvoices));
    }
  }, [searchParams]);

  const handleCreatePayment = () => {
    if (!newPayment.customerName || !newPayment.amount || !newPayment.paymentMethod) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    const payment: Payment = {
      id: "pay_" + Date.now(),
      customerId: newPayment.customerId || "customer_" + Date.now(),
      customerName: newPayment.customerName,
      customerPhone: newPayment.customerPhone,
      plateNumber: newPayment.plateNumber,
      invoiceId: newPayment.invoiceId,
      amount: parseFloat(newPayment.amount),
      paymentMethod: newPayment.paymentMethod,
      paymentDate: new Date().toISOString(),
      status: "مكتمل",
      notes: newPayment.notes,
      cashierName: "الكاشير الحالي",
      services: newPayment.services ? newPayment.services.split(',') : undefined
    };

    setPayments(prev => [payment, ...prev]);
    localStorage.setItem("customer_payments", JSON.stringify([payment, ...payments]));

    // Update outstanding invoice if applicable
    if (newPayment.invoiceId) {
      // Logic to update the outstanding invoice
    }

    setIsNewPaymentOpen(false);
    setNewPayment({
      customerId: "",
      customerName: "",
      customerPhone: "",
      plateNumber: "",
      invoiceId: "",
      amount: "",
      paymentMethod: "نقد",
      notes: "",
      services: ""
    });

    toast({
      title: "تم بنجاح",
      description: "تم تسجيل الدفعة بنجاح",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "مكتمل":
        return <Badge className="bg-green-500 text-white">مكتمل</Badge>;
      case "معلق":
        return <Badge className="bg-yellow-500 text-white">معلق</Badge>;
      case "مرفوض":
        return <Badge variant="destructive">مرفوض</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "نقد":
        return <DollarSign className="w-4 h-4 text-green-500" />;
      case "بطاقة ائتمان":
      case "بطاقة مدى":
        return <CreditCard className="w-4 h-4 text-blue-500" />;
      default:
        return <Receipt className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.customerName.includes(searchTerm) ||
                         payment.customerPhone.includes(searchTerm) ||
                         (payment.plateNumber && payment.plateNumber.includes(searchTerm)) ||
                         (payment.invoiceId && payment.invoiceId.includes(searchTerm));
    const matchesStatus = filterStatus === "all" || payment.status === filterStatus;
    const matchesMethod = filterMethod === "all" || payment.paymentMethod === filterMethod;
    
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const calculateMetrics = () => {
    const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const todayPayments = payments.filter(p => 
      new Date(p.paymentDate).toDateString() === new Date().toDateString()
    );
    const todayAmount = todayPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const successfulPayments = payments.filter(p => p.status === "مكتمل").length;
    const successRate = payments.length > 0 ? (successfulPayments / payments.length) * 100 : 0;

    return {
      totalAmount,
      todayAmount,
      todayCount: todayPayments.length,
      successRate
    };
  };

  const metrics = calculateMetrics();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              رجوع
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
                تسديدات العملاء
              </h1>
              <p className="text-gray-600 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-green-500" />
                إدارة ومتابعة جميع مدفوعات العملاء
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              تصدير
            </Button>
            <Button onClick={() => setIsNewPaymentOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              تسجيل دفعة جديدة
            </Button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي المدفوعات</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalAmount.toLocaleString()} جنيه مصري</div>
              <p className="text-xs text-muted-foreground">
                من {payments.length} عملية دفع
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">دفعات اليوم</CardTitle>
              <Calendar className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.todayAmount.toLocaleString()} جنيه مصري</div>
              <p className="text-xs text-muted-foreground">
                {metrics.todayCount} عملية دفع اليوم
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">معدل النجاح</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.successRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                من إجمالي العمليات
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">متوسط الدفعة</CardTitle>
              <Receipt className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {payments.length > 0 ? (metrics.totalAmount / payments.length).toLocaleString() : 0} جنيه مصري
              </div>
              <p className="text-xs text-muted-foreground">
                لكل عملية دفع
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle>البحث والتصفية</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="البحث باسم العميل، رقم الجوال، لوحة المشروب، أو رقم الايصال..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="مكتمل">مكتمل</SelectItem>
                  <SelectItem value="معلق">معلق</SelectItem>
                  <SelectItem value="مرفوض">مرفوض</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterMethod} onValueChange={setFilterMethod}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="طريقة الدفع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الطرق</SelectItem>
                  <SelectItem value="نقد">نقد</SelectItem>
                  <SelectItem value="بطاقة ائتمان">بطاقة ائتمان</SelectItem>
                  <SelectItem value="بطاقة مدى">بطاقة مدى</SelectItem>
                  <SelectItem value="تحويل بنكي">تحويل بنكي</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Payments List */}
        <Card>
          <CardHeader>
            <CardTitle>قائمة المدفوعات ({filteredPayments.length})</CardTitle>
            <CardDescription>
              جميع عمليات الدفع والتسديدات المسجلة في النظام
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredPayments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CreditCard className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">لا توجد مدفوعات</h3>
                  <p>لم يتم العثور على أي مدفوعات تطابق معايير البحث</p>
                </div>
              ) : (
                filteredPayments.map((payment) => (
                  <Card key={payment.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            {getPaymentMethodIcon(payment.paymentMethod)}
                            <div>
                              <div className="font-medium flex items-center gap-2">
                                {payment.customerName}
                                {getStatusBadge(payment.status)}
                              </div>
                              <div className="text-sm text-gray-500">
                                {payment.customerPhone} • {payment.plateNumber}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <div className="text-xl font-bold text-green-600">
                              {payment.amount.toLocaleString()} جنيه مصري
                            </div>
                            <div className="text-sm text-gray-500">
                              {payment.paymentMethod}
                            </div>
                          </div>
                          
                          <div className="text-right text-sm text-gray-500">
                            <div>{new Date(payment.paymentDate).toLocaleDateString('ar-SA')}</div>
                            <div>{new Date(payment.paymentDate).toLocaleTimeString('ar-SA', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}</div>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Receipt className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      {payment.notes && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-sm text-gray-600">{payment.notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* New Payment Dialog */}
        {isNewPaymentOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>تسجيل دفعة جديدة</CardTitle>
                <CardDescription>
                  قم بإدخال تفاصيل الدفعة الجديدة
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customerName">اسم العميل *</Label>
                    <Input
                      id="customerName"
                      value={newPayment.customerName}
                      onChange={(e) => setNewPayment(prev => ({ ...prev, customerName: e.target.value }))}
                      placeholder="أحمد محمد السالم"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerPhone">رقم الجوال</Label>
                    <Input
                      id="customerPhone"
                      value={newPayment.customerPhone}
                      onChange={(e) => setNewPayment(prev => ({ ...prev, customerPhone: e.target.value }))}
                      placeholder="0501234567"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="plateNumber">لوحة المشروب</Label>
                    <Input
                      id="plateNumber"
                      value={newPayment.plateNumber}
                      onChange={(e) => setNewPayment(prev => ({ ...prev, plateNumber: e.target.value }))}
                      placeholder="أ ب ج 1234"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="invoiceId">رقم الايصال</Label>
                    <Input
                      id="invoiceId"
                      value={newPayment.invoiceId}
                      onChange={(e) => setNewPayment(prev => ({ ...prev, invoiceId: e.target.value }))}
                      placeholder="INV-001"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">المبلغ (جنيه) *</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={newPayment.amount}
                      onChange={(e) => setNewPayment(prev => ({ ...prev, amount: e.target.value }))}
                      placeholder="150"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>طريقة الدفع *</Label>
                    <Select value={newPayment.paymentMethod} onValueChange={(value) => setNewPayment(prev => ({ ...prev, paymentMethod: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر طريقة الدفع" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="نقد">نقد</SelectItem>
                        <SelectItem value="بطاقة ائتمان">بطاقة ائتمان</SelectItem>
                        <SelectItem value="بطاقة مدى">بطاقة مدى</SelectItem>
                        <SelectItem value="تحويل بنكي">تحويل بنكي</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">ملاحظات</Label>
                  <Textarea
                    id="notes"
                    value={newPayment.notes}
                    onChange={(e) => setNewPayment(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="أي ملاحظات إضافية..."
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsNewPaymentOpen(false)}>
                    إلغاء
                  </Button>
                  <Button onClick={handleCreatePayment}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    تسجيل الدفعة
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}