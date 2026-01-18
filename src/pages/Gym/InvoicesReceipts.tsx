import { useState, useEffect, useMemo, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  FileText, Plus, Search, Download, Printer, Eye, Save,
  CheckCircle, XCircle, DollarSign, Loader2, Receipt, User, Calendar, Building2
} from "lucide-react";
import { useReactToPrint } from 'react-to-print';
import {
  useGetInvoicesQuery,
  useCreateInvoiceMutation,
  useUpdateInvoiceStatusMutation,
  useGetInvoiceStatisticsQuery,
  useLazyDownloadInvoiceQuery,
  useLazyPrintInvoiceQuery,
} from "@/services/invoicesReceiptsApi";

const InvoicesReceipts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    memberName: "",
    memberId: "",
    amount: "",
    type: "",
    date: new Date().toISOString().split('T')[0],
    status: "معلقة",
    description: "",
  });

  // جلب الإيصالات من API
  const {
    data: invoicesData,
    isLoading: isLoadingInvoices,
    error: invoicesError,
    refetch: refetchInvoices,
  } = useGetInvoicesQuery({
    search: searchQuery,
    status: statusFilter === "all" ? undefined : statusFilter,
    type: typeFilter === "all" ? undefined : typeFilter,
    limit: 1000,
  });

  // جلب الإحصائيات
  const {
    data: statisticsData,
    isLoading: isLoadingStats,
  } = useGetInvoiceStatisticsQuery({
    period: "month",
  });

  // Mutations
  const [createInvoice, { isLoading: isCreating }] = useCreateInvoiceMutation();
  const [updateInvoiceStatus] = useUpdateInvoiceStatusMutation();
  const [downloadInvoice] = useLazyDownloadInvoiceQuery();
  const [printInvoice] = useLazyPrintInvoiceQuery();

  // معالجة البيانات المستلمة من API
  const invoices = useMemo(() => {
    if (!invoicesData?.data) return [];
    // إذا كانت البيانات عبارة عن مصفوفة مباشرة
    if (Array.isArray(invoicesData.data)) {
      return invoicesData.data;
    }
    // إذا كانت البيانات محتوية على مصفوفة داخل خاصية
    return invoicesData.data.invoices || invoicesData.data || [];
  }, [invoicesData]);

  // حساب الإحصائيات من البيانات المحلية إذا لم تكن متوفرة من API
  const statistics = useMemo(() => {
    if (statisticsData?.data) {
      // تحويل إحصائيات الاشتراكات إلى صيغة الإيصالات
      return {
        total: statisticsData.data.total || 0,
        paid: statisticsData.data.active || 0,
        pending: statisticsData.data.upcoming || 0,
        totalAmount: statisticsData.data.totalPaid || statisticsData.data.totalValue || 0,
      };
    }
    
    // حساب الإحصائيات محلياً من البيانات المتاحة
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const monthInvoices = invoices.filter((inv: any) => {
      const invoiceDate = new Date(inv.registrationDate || inv.subscriptionStartDate || inv.createdAt);
      return invoiceDate.getMonth() === currentMonth && 
             invoiceDate.getFullYear() === currentYear;
    });

    const paid = monthInvoices.filter((inv: any) => 
      inv.status === "active" || inv.status === "مدفوعة" || inv.paidAmount > 0
    );
    const pending = monthInvoices.filter((inv: any) => 
      inv.status === "upcoming" || inv.status === "معلقة" || inv.status === "pending"
    );
    const totalAmount = monthInvoices.reduce((sum: number, inv: any) => 
      sum + (parseFloat(inv.subscriptionValue || inv.paidAmount || 0)), 0
    );

    return {
      total: monthInvoices.length,
      paid: paid.length,
      pending: pending.length,
      totalAmount: totalAmount,
    };
  }, [statisticsData, invoices]);

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { text: string; color: string } } = {
      'active': { text: 'نشط', color: 'bg-green-500' },
      'paid': { text: 'مدفوعة', color: 'bg-green-500' },
      'مدفوعة': { text: 'مدفوعة', color: 'bg-green-500' },
      'pending': { text: 'معلقة', color: 'bg-orange-500' },
      'معلقة': { text: 'معلقة', color: 'bg-orange-500' },
      'upcoming': { text: 'قادمة', color: 'bg-blue-500' },
      'قادمة': { text: 'قادمة', color: 'bg-blue-500' },
      'expired': { text: 'منتهية', color: 'bg-red-500' },
      'منتهية': { text: 'منتهية', color: 'bg-red-500' },
    };

    const statusInfo = statusMap[status] || { text: status, color: 'bg-gray-500' };
    
    return (
      <Badge className={statusInfo.color}>
        {statusInfo.color.includes('green') ? (
          <CheckCircle className="w-3 h-3 ml-1" />
        ) : (
          <XCircle className="w-3 h-3 ml-1" />
        )}
        {statusInfo.text}
      </Badge>
    );
  };

  // تحويل البيانات من API إلى الشكل المطلوب للعرض
  const getInvoiceDisplayData = (invoice: any) => {
    // تحويل بيانات الاشتراك إلى صيغة الايصال
    const subscription = invoice;
    const statusMap: { [key: string]: string } = {
      'active': 'مدفوعة',
      'expired': 'منتهية',
      'upcoming': 'قادمة',
      'paid': 'مدفوعة',
      'pending': 'معلقة',
    };

    return {
      id: subscription.id,
      invoiceNumber: subscription.receiptNumber || subscription.subscriptionNumber || `SUB-${subscription.id}`,
      memberName: subscription.customerName || "غير محدد",
      amount: subscription.subscriptionValue || subscription.paidAmount || 0,
      status: statusMap[subscription.status] || subscription.status || "معلقة",
      date: subscription.registrationDate || subscription.subscriptionStartDate || subscription.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
      type: subscription.subscriptionType || subscription.type || (subscription.isSpecial ? "اشتراك خاص" : "اشتراك عادي"),
      isSpecial: subscription.isSpecial || false,
      paidAmount: subscription.paidAmount || 0,
      remainingAmount: subscription.remainingAmount || 0,
    };
  };

  const handleAdd = () => {
    setFormData({
      memberName: "",
      memberId: "",
      amount: "",
      type: "",
      date: new Date().toISOString().split('T')[0],
      status: "معلقة",
      description: "",
    });
    setIsAddDialogOpen(true);
  };

  const handleSaveAdd = async () => {
    if (!formData.memberName || !formData.amount || !formData.type || !formData.date) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    try {
      const invoiceData = {
        memberName: formData.memberName,
        memberId: formData.memberId || null,
        amount: parseFloat(formData.amount),
        type: formData.type,
        status: formData.status,
        date: formData.date,
        description: formData.description || "",
      };

      await createInvoice(invoiceData).unwrap();
      
      setIsAddDialogOpen(false);
      setFormData({
        memberName: "",
        memberId: "",
        amount: "",
        type: "",
        date: new Date().toISOString().split('T')[0],
        status: "معلقة",
        description: "",
      });
      
      toast({
        title: "نجح",
        description: "تم إضافة الايصال بنجاح"
      });
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error?.data?.message || "فشل إضافة الايصال",
        variant: "destructive"
      });
    }
  };

  // وظيفة الطباعة
  const handlePrint = useReactToPrint({
    contentRef: printRef as any,
    documentTitle: selectedInvoice ? `ايصال-${getInvoiceDisplayData(selectedInvoice).invoiceNumber}` : 'ايصال',
  });

  const handleViewInvoice = (invoice: any) => {
    setSelectedInvoice(invoice);
    setIsViewDialogOpen(true);
  };

  const handleDownload = async (invoiceId: number) => {
    try {
      // البحث عن الايصال في القائمة
      const invoice = invoices.find((inv: any) => inv.id === invoiceId);
      if (!invoice) {
        toast({
          title: "خطأ",
          description: "لم يتم العثور على الايصال",
          variant: "destructive"
        });
        return;
      }

      setSelectedInvoice(invoice);
      
      // إنشاء محتوى HTML للتحميل
      const displayData = getInvoiceDisplayData(invoice);
      const invoiceHtml = generateInvoiceHTML(displayData, invoice);
      
      // إنشاء blob وتحفيز التحميل
      const blob = new Blob([invoiceHtml], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ايصال-${displayData.invoiceNumber}-${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "نجح",
        description: "تم تحميل الايصال بنجاح"
      });
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error?.message || "فشل تحميل الايصال",
        variant: "destructive"
      });
    }
  };

  const handlePrintClick = (invoice: any) => {
    setSelectedInvoice(invoice);
    setTimeout(() => {
      handlePrint();
    }, 100);
  };

  // توليد HTML للايصال
  const generateInvoiceHTML = (displayData: any, invoice: any) => {
    return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ايصال ${displayData.invoiceNumber}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Arial', sans-serif;
      padding: 20px;
      background: white;
      color: #000;
    }
    .invoice-container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      padding: 30px;
      border: 2px solid #e5e7eb;
    }
    .invoice-header {
      text-align: center;
      border-bottom: 3px solid #3b82f6;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .invoice-header h1 {
      color: #3b82f6;
      font-size: 32px;
      margin-bottom: 10px;
    }
    .invoice-info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 30px;
    }
    .info-section {
      background: #f9fafb;
      padding: 15px;
      border-radius: 8px;
    }
    .info-section h3 {
      color: #3b82f6;
      margin-bottom: 10px;
      font-size: 18px;
    }
    .info-item {
      margin: 8px 0;
      display: flex;
      justify-content: space-between;
    }
    .invoice-details {
      margin: 30px 0;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 12px;
      border-bottom: 1px solid #e5e7eb;
    }
    .detail-row:last-child {
      border-bottom: none;
    }
    .detail-label {
      font-weight: bold;
      color: #6b7280;
    }
    .detail-value {
      color: #111827;
      font-weight: 600;
    }
    .total-section {
      background: #3b82f6;
      color: white;
      padding: 20px;
      border-radius: 8px;
      margin-top: 30px;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      font-size: 20px;
      font-weight: bold;
      margin: 10px 0;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
      color: #6b7280;
    }
    @media print {
      body {
        padding: 0;
      }
      .invoice-container {
        border: none;
        padding: 0;
      }
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <div class="invoice-header">
      <h1>ايصال / Invoice</h1>
      <p>رقم الايصال: ${displayData.invoiceNumber}</p>
    </div>
    
    <div class="invoice-info">
      <div class="info-section">
        <h3>معلومات العميل</h3>
        <div class="info-item">
          <span>الاسم:</span>
          <span>${displayData.memberName}</span>
        </div>
        <div class="info-item">
          <span>التاريخ:</span>
          <span>${displayData.date}</span>
        </div>
      </div>
      
      <div class="info-section">
        <h3>معلومات الايصال</h3>
        <div class="info-item">
          <span>النوع:</span>
          <span>${displayData.type}</span>
        </div>
        <div class="info-item">
          <span>الحالة:</span>
          <span>${displayData.status}</span>
        </div>
      </div>
    </div>
    
    <div class="invoice-details">
      <div class="detail-row">
        <span class="detail-label">المبلغ الإجمالي:</span>
        <span class="detail-value">${parseFloat(displayData.amount).toLocaleString()} ج.م</span>
      </div>
      ${displayData.paidAmount > 0 ? `
      <div class="detail-row">
        <span class="detail-label">المبلغ المدفوع:</span>
        <span class="detail-value">${parseFloat(displayData.paidAmount).toLocaleString()} ج.م</span>
      </div>
      ` : ''}
      ${displayData.remainingAmount > 0 ? `
      <div class="detail-row">
        <span class="detail-label">المبلغ المتبقي:</span>
        <span class="detail-value">${parseFloat(displayData.remainingAmount).toLocaleString()} ج.م</span>
      </div>
      ` : ''}
    </div>
    
    <div class="total-section">
      <div class="total-row">
        <span>المجموع الكلي:</span>
        <span>${parseFloat(displayData.amount).toLocaleString()} ج.م</span>
      </div>
    </div>
    
    <div class="footer">
      <p>شكراً لاستخدام خدماتنا</p>
      <p>تاريخ الطباعة: ${new Date().toLocaleDateString('ar-SA')}</p>
    </div>
  </div>
</body>
</html>
    `;
  };

  const handleStatusChange = async (invoiceId: number, newStatus: string) => {
    try {
      await updateInvoiceStatus({ id: invoiceId, status: newStatus }).unwrap();
      toast({
        title: "نجح",
        description: "تم تحديث حالة الايصال"
      });
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error?.data?.message || "فشل تحديث الحالة",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* العنوان */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">الإيصالات</h1>
            <p className="text-gray-600 mt-1">إدارة الإيصالات المالية</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="البحث عن ايصال..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            <Select value={statusFilter || "all"} onValueChange={(value) => setStatusFilter(value === "all" ? undefined : value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="مدفوعة">مدفوعة</SelectItem>
                <SelectItem value="معلقة">معلقة</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter || "all"} onValueChange={(value) => setTypeFilter(value === "all" ? undefined : value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="النوع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                <SelectItem value="اشتراك عادي">اشتراك عادي</SelectItem>
                <SelectItem value="اشتراك خاص">اشتراك خاص</SelectItem>
                <SelectItem value="اشتراك">اشتراك</SelectItem>
                <SelectItem value="اشتراك سنوي">اشتراك سنوي</SelectItem>
                <SelectItem value="خدمة">خدمة</SelectItem>
                <SelectItem value="معدات">معدات</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAdd} disabled={isCreating}>
              <Plus className="w-5 h-5 ml-2" />
              ايصال جديدة
            </Button>
          </div>
        </div>

        {/* إحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">إجمالي الإيصالات</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingStats ? (
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              ) : (
                <>
                  <div className="text-3xl font-bold text-blue-600">
                    {statistics?.total?.toLocaleString() || invoices.length.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">ايصال هذا الشهر</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">المدفوعة</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingStats ? (
                <Loader2 className="w-8 h-8 animate-spin text-green-600" />
              ) : (
                <>
                  <div className="text-3xl font-bold text-green-600">
                    {statistics?.paid?.toLocaleString() || "0"}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">ايصال مدفوعة</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">المعلقة</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingStats ? (
                <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
              ) : (
                <>
                  <div className="text-3xl font-bold text-orange-600">
                    {statistics?.pending?.toLocaleString() || "0"}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">ايصال معلقة</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">إجمالي المبلغ</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingStats ? (
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
              ) : (
                <>
                  <div className="text-3xl font-bold text-purple-600">
                    {statistics?.totalAmount?.toLocaleString() || "0"} ج.م
                  </div>
                  <p className="text-sm text-gray-500 mt-1">هذا الشهر</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* قائمة الإيصالات */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              قائمة الإيصالات
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingInvoices ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="mr-3 text-gray-600">جاري تحميل الإيصالات...</span>
              </div>
            ) : invoicesError ? (
              <div className="flex flex-col items-center justify-center py-12">
                <XCircle className="w-12 h-12 text-red-500 mb-3" />
                <p className="text-red-600 mb-4">
                  {(() => {
                    if ('data' in invoicesError && invoicesError.data && typeof invoicesError.data === 'object' && 'message' in invoicesError.data) {
                      return (invoicesError.data as { message?: string }).message;
                    }
                    if ('message' in invoicesError) {
                      return String(invoicesError.message);
                    }
                    return "حدث خطأ أثناء جلب الإيصالات";
                  })()}
                </p>
                <Button onClick={() => refetchInvoices()} variant="outline">
                  إعادة المحاولة
                </Button>
              </div>
            ) : invoices.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mb-3" />
                <p className="text-gray-600">لا توجد إيصالات</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-right py-3 px-4 font-semibold">رقم الايصال</th>
                      <th className="text-right py-3 px-4 font-semibold">اسم العضو</th>
                      <th className="text-right py-3 px-4 font-semibold">النوع</th>
                      <th className="text-right py-3 px-4 font-semibold">المبلغ</th>
                      <th className="text-right py-3 px-4 font-semibold">الحالة</th>
                      <th className="text-right py-3 px-4 font-semibold">التاريخ</th>
                      <th className="text-right py-3 px-4 font-semibold">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((invoice: any) => {
                      const displayData = getInvoiceDisplayData(invoice);
                      return (
                        <tr key={invoice.id || displayData.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-mono font-semibold">{displayData.invoiceNumber}</td>
                          <td className="py-3 px-4">{displayData.memberName}</td>
                          <td className="py-3 px-4">
                            <Badge variant="outline">{displayData.type}</Badge>
                          </td>
                          <td className="py-3 px-4 font-bold text-green-600">
                            {parseFloat(displayData.amount).toLocaleString()} ج.م
                            {displayData.remainingAmount > 0 && (
                              <span className="text-xs text-gray-500 block mt-1">
                                متبقي: {parseFloat(displayData.remainingAmount).toLocaleString()} ج.م
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">{getStatusBadge(displayData.status)}</td>
                          <td className="py-3 px-4">{displayData.date}</td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2 justify-end">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                title="عرض"
                                onClick={() => handleViewInvoice(invoice)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                title="تحميل"
                                onClick={() => handleDownload(displayData.id)}
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                title="طباعة"
                                onClick={() => handlePrintClick(invoice)}
                              >
                                <Printer className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* قوالب الإيصالات */}
        <Card>
          <CardHeader>
            <CardTitle>قوالب الإيصالات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle>ايصال اشتراك</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    استخدام القالب
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle>ايصال خدمة</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    استخدام القالب
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle>إيصال استلام</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    استخدام القالب
                  </Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Dialog إضافة ايصال جديدة */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>إضافة ايصال جديدة</DialogTitle>
              <DialogDescription>أدخل بيانات الايصال</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="memberName">اسم العضو *</Label>
                <Input
                  id="memberName"
                  value={formData.memberName}
                  onChange={(e) => setFormData({...formData, memberName: e.target.value})}
                  placeholder="اسم العضو"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">المبلغ *</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    placeholder="المبلغ بالجنيه"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">النوع *</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر النوع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="اشتراك">اشتراك</SelectItem>
                      <SelectItem value="اشتراك سنوي">اشتراك سنوي</SelectItem>
                      <SelectItem value="خدمة">خدمة</SelectItem>
                      <SelectItem value="معدات">معدات</SelectItem>
                      <SelectItem value="أخرى">أخرى</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">التاريخ *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">الحالة</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="مدفوعة">مدفوعة</SelectItem>
                      <SelectItem value="معلقة">معلقة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isCreating}>
                إلغاء
              </Button>
              <Button 
                onClick={handleSaveAdd} 
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isCreating}
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" /> جاري الحفظ...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 ml-2" /> حفظ
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog عرض الايصال */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="flex items-center gap-2">
                  <Receipt className="h-6 w-6 text-blue-600" />
                  عرض الايصال
                </DialogTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => selectedInvoice && handlePrintClick(selectedInvoice)}
                    className="flex items-center gap-2"
                  >
                    <Printer className="h-4 w-4" />
                    طباعة
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => selectedInvoice && handleDownload(selectedInvoice?.id || getInvoiceDisplayData(selectedInvoice).id)}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    تحميل
                  </Button>
                </div>
              </div>
            </DialogHeader>

            {selectedInvoice && (
              <div className="p-6">
                {/* محتوى الايصال القابل للطباعة */}
                <div ref={printRef} className="bg-white text-black p-8 rounded-lg border-2 border-gray-200">
                  <div className="text-center border-b-4 border-blue-600 pb-6 mb-6">
                    <h1 className="text-4xl font-bold text-blue-600 mb-2">ايصال / Invoice</h1>
                    <p className="text-xl text-gray-700">رقم الايصال: {getInvoiceDisplayData(selectedInvoice).invoiceNumber}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <Card className="bg-gray-50 p-4">
                      <h3 className="text-lg font-semibold text-blue-600 mb-4 flex items-center gap-2">
                        <User className="w-5 h-5" />
                        معلومات العميل
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">الاسم:</span>
                          <span className="font-semibold">{getInvoiceDisplayData(selectedInvoice).memberName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">التاريخ:</span>
                          <span className="font-semibold">{getInvoiceDisplayData(selectedInvoice).date}</span>
                        </div>
                      </div>
                    </Card>

                    <Card className="bg-gray-50 p-4">
                      <h3 className="text-lg font-semibold text-blue-600 mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        معلومات الايصال
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">النوع:</span>
                          <span className="font-semibold">{getInvoiceDisplayData(selectedInvoice).type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">الحالة:</span>
                          <span>{getStatusBadge(getInvoiceDisplayData(selectedInvoice).status)}</span>
                        </div>
                      </div>
                    </Card>
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="text-lg font-semibold text-gray-700">المبلغ الإجمالي:</span>
                      <span className="text-2xl font-bold text-green-600">
                        {parseFloat(getInvoiceDisplayData(selectedInvoice).amount).toLocaleString()} ج.م
                      </span>
                    </div>
                    
                    {getInvoiceDisplayData(selectedInvoice).paidAmount > 0 && (
                      <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                        <span className="text-lg font-semibold text-gray-700">المبلغ المدفوع:</span>
                        <span className="text-xl font-bold text-blue-600">
                          {parseFloat(getInvoiceDisplayData(selectedInvoice).paidAmount).toLocaleString()} ج.م
                        </span>
                      </div>
                    )}
                    
                    {getInvoiceDisplayData(selectedInvoice).remainingAmount > 0 && (
                      <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg">
                        <span className="text-lg font-semibold text-gray-700">المبلغ المتبقي:</span>
                        <span className="text-xl font-bold text-orange-600">
                          {parseFloat(getInvoiceDisplayData(selectedInvoice).remainingAmount).toLocaleString()} ج.م
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="bg-blue-600 text-white p-6 rounded-lg mt-6">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold">المجموع الكلي:</span>
                      <span className="text-3xl font-bold">
                        {parseFloat(getInvoiceDisplayData(selectedInvoice).amount).toLocaleString()} ج.م
                      </span>
                    </div>
                  </div>

                  <div className="text-center mt-8 pt-6 border-t-2 border-gray-200">
                    <p className="text-gray-600 mb-2">شكراً لاستخدام خدماتنا</p>
                    <p className="text-sm text-gray-500">
                      تاريخ الطباعة: {new Date().toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                إغلاق
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
};

export default InvoicesReceipts;

