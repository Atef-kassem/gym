import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Search,
  ShoppingCart,
  DollarSign,
  Calendar,
  CreditCard,
  Receipt,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Filter,
  Download,
  Printer
} from 'lucide-react';
import { useGetAllQuickSalesQuery, useGetQuickSaleStatsQuery, useGetQuickSaleByIdQuery } from '@/services/quickSaleApi';
import { useGetAllBranchesQuery } from '@/services/branchesApi';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { InvoiceDialog } from './InvoiceDialog';
import { toast } from 'sonner';

export function QuickSalesList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  
  // حالة للايصال
  const [showInvoice, setShowInvoice] = useState(false);
  const [selectedSaleId, setSelectedSaleId] = useState<string | null>(null);

  // جلب البيانات
  const { data: branchesData } = useGetAllBranchesQuery(undefined as any);
  const branches = Array.isArray(branchesData?.data) ? branchesData.data : [];

  const { data: salesData, isLoading: salesLoading, error: salesError } = useGetAllQuickSalesQuery({
    branchId: branchFilter !== 'all' ? branchFilter : undefined,
    paymentMethod: paymentFilter !== 'all' ? paymentFilter : undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
  });

  const { data: statsData } = useGetQuickSaleStatsQuery({
    branchId: branchFilter !== 'all' ? branchFilter : undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
  });

  // جلب تفاصيل البيع المحدد
  const { data: saleDetailsData, isLoading: saleDetailsLoading } = useGetQuickSaleByIdQuery(
    selectedSaleId || '',
    { skip: !selectedSaleId }
  );

  const sales = Array.isArray(salesData?.data) ? salesData.data : [];
  const stats = statsData?.data || {
    totalSales: 0,
    completedSales: 0,
    refundedSales: 0,
    totalRevenue: 0,
    totalDiscount: 0,
    totalTax: 0,
    paymentMethods: { cash: 0, card: 0, wallet: 0, transfer: 0, mixed: 0 }
  };

  // تصفية المبيعات حسب البحث
  const filteredSales = sales.filter((sale: any) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      sale.saleNumber?.toLowerCase().includes(searchLower) ||
      sale.customerName?.toLowerCase().includes(searchLower) ||
      sale.customerPhone?.toLowerCase().includes(searchLower)
    );
  });


  // الحصول على لون حالة الدفع
  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case 'cash': return 'bg-green-100 text-green-800';
      case 'card': return 'bg-blue-100 text-blue-800';
      case 'wallet': return 'bg-purple-100 text-purple-800';
      case 'transfer': return 'bg-orange-100 text-orange-800';
      case 'mixed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'cash': return 'نقد';
      case 'card': return 'بطاقة';
      case 'wallet': return 'محفظة';
      case 'transfer': return 'تحويل';
      case 'mixed': return 'مختلط';
      default: return method;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'refunded': return 'bg-red-100 text-red-800 border-red-200';
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'مكتمل';
      case 'refunded': return 'مُرجع';
      case 'cancelled': return 'ملغي';
      default: return status;
    }
  };

  // تحويل بيانات البيع إلى تنسيق الايصال
  const convertSaleToInvoiceData = (sale: any) => {
    if (!sale) return null;

    const items = Array.isArray(sale.items) ? sale.items : [];
    const invoiceItems = items.map((item: any, index: number) => ({
      id: item.id || item.productId || item.serviceId || `item-${index}`,
      name: item.name || item.productName || item.serviceName || 'عنصر غير محدد',
      code: item.code || item.productCode || item.serviceCode || '-',
      quantity: parseFloat(item.quantity || 1),
      price: parseFloat(item.price || item.unitPrice || 0),
      discount: parseFloat(item.discount || item.discountPercentage || 0),
      total: parseFloat(item.total || item.subtotal || 0),
      type: item.type || (item.serviceId ? 'service' : 'product')
    }));

    const subtotal = items.reduce((sum: number, item: any) => 
      sum + parseFloat(item.subtotal || item.total || (item.price || 0) * (item.quantity || 1)), 0
    );
    const discountAmount = parseFloat(sale.discountAmount || 0);
    const taxAmount = parseFloat(sale.taxAmount || 0);
    const totalAmount = parseFloat(sale.totalAmount || subtotal);

    // تحديد طريقة الدفع بالعربية
    const paymentMethodMap: { [key: string]: string } = {
      'cash': 'نقدي',
      'card': 'بطاقة',
      'wallet': 'محفظة',
      'transfer': 'تحويل',
      'mixed': 'مختلط'
    };

    return {
      invoiceNumber: sale.saleNumber || `QS${sale.id}`,
      invoiceDate: sale.saleDate ? new Date(sale.saleDate) : new Date(),
      type: 'sale' as const,
      customerName: sale.customerName || 'عميل نقدي',
      customerPhone: sale.customerPhone || '-',
      customerEmail: sale.customerEmail,
      branchName: sale.branch?.arabicName || sale.branch?.englishName || '-',
      branchAddress: sale.branch?.address,
      items: invoiceItems,
      subtotal,
      discount: discountAmount,
      tax: taxAmount,
      total: totalAmount,
      paymentMethod: paymentMethodMap[sale.paymentMethod] || sale.paymentMethod || 'نقدي',
      notes: sale.notes
    };
  };

  // معالج عرض التفاصيل
  const handleViewDetails = (saleId: string) => {
    setSelectedSaleId(saleId);
    setShowInvoice(true);
  };

  // معالج الطباعة المباشرة
  const handlePrintInvoice = (sale: any) => {
    const invoiceData = convertSaleToInvoiceData(sale);
    if (!invoiceData) {
      toast.error('فشل في تحميل بيانات الايصال');
      return;
    }

    setSelectedSaleId(sale.id.toString());
    setShowInvoice(true);
    
    // ننتظر قليلاً ثم نفتح نافذة الطباعة
    setTimeout(() => {
      window.print();
    }, 300);
  };

  // بيانات الايصال الحالية
  const currentInvoiceData = selectedSaleId && saleDetailsData?.data
    ? convertSaleToInvoiceData(saleDetailsData.data)
    : selectedSaleId
    ? sales.find((s: any) => s.id.toString() === selectedSaleId)
      ? convertSaleToInvoiceData(sales.find((s: any) => s.id.toString() === selectedSaleId))
      : null
    : null;

  return (
    <div className="space-y-6">
      {/* عرض الأخطاء */}
      {salesError && (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-600">
              <XCircle className="h-5 w-5" />
              <span className="font-medium">خطأ في تحميل المبيعات</span>
            </div>
            <p className="text-sm text-red-500 mt-1">
              {(() => {
                if ('message' in salesError) return (salesError as any).message;
                if ('data' in salesError && salesError.data && typeof salesError.data === 'object' && 'message' in salesError.data) {
                  return (salesError.data as any).message;
                }
                return "حدث خطأ أثناء تحميل المبيعات";
              })()}
            </p>
          </CardContent>
        </Card>
      )}
      
      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المبيعات</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSales}</div>
            <p className="text-xs text-muted-foreground">عملية بيع</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الإيرادات</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">جنيه مصري</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الخصومات</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.totalDiscount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">جنيه مصري</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الضرائب</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalTax.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">جنيه مصري</p>
          </CardContent>
        </Card>
      </div>

      {/* الفلاتر والبحث */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة المبيعات السريعة</CardTitle>
          <CardDescription>عرض وإدارة جميع عمليات البيع السريع</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="البحث في المبيعات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
            
            <Select value={branchFilter} onValueChange={setBranchFilter}>
              <SelectTrigger className="w-full lg:w-[200px]">
                <SelectValue placeholder="جميع الفروع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الفروع</SelectItem>
                {branches.map((branch: any) => (
                  <SelectItem key={branch.id} value={branch.id.toString()}>
                    {branch.arabicName || branch.englishName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-full lg:w-[200px]">
                <SelectValue placeholder="طريقة الدفع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الطرق</SelectItem>
                <SelectItem value="cash">نقد</SelectItem>
                <SelectItem value="card">بطاقة</SelectItem>
                <SelectItem value="wallet">محفظة</SelectItem>
                <SelectItem value="transfer">تحويل</SelectItem>
                <SelectItem value="mixed">مختلط</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-[200px]">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="completed">مكتمل</SelectItem>
                <SelectItem value="refunded">مُرجع</SelectItem>
                <SelectItem value="cancelled">ملغي</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* جدول المبيعات */}
          <div className="rounded-md border">
            {salesLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Clock className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                  <p className="text-muted-foreground">جاري تحميل المبيعات...</p>
                </div>
              </div>
            ) : filteredSales.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-30" />
                  <p className="text-lg font-medium text-muted-foreground">لا توجد مبيعات</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {searchTerm ? 'لا توجد نتائج تطابق البحث' : 'لم يتم إضافة أي مبيعات بعد'}
                  </p>
                </div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>رقم البيع</TableHead>
                    <TableHead>التاريخ والوقت</TableHead>
                    <TableHead>العميل</TableHead>
                    <TableHead>الفرع</TableHead>
                    <TableHead>المبلغ</TableHead>
                    <TableHead>طريقة الدفع</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSales.map((sale: any) => (
                    <TableRow key={sale.id}>
                      <TableCell className="font-mono font-medium">{sale.saleNumber}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {sale.saleDate ? format(new Date(sale.saleDate), 'dd MMM yyyy', { locale: ar }) : '-'}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {sale.saleTime || '-'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{sale.customerName || 'عميل نقدي'}</span>
                          {sale.customerPhone && (
                            <span className="text-xs text-muted-foreground">{sale.customerPhone}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {sale.branch?.arabicName || sale.branch?.englishName || '-'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col items-end">
                          <span className="font-bold text-green-600">
                            {parseFloat(sale.totalAmount || 0).toFixed(2)} جنيه مصري
                          </span>
                          {sale.discountAmount > 0 && (
                            <span className="text-xs text-orange-600">
                              خصم: {parseFloat(sale.discountAmount).toFixed(2)} جنيه مصري
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPaymentMethodColor(sale.paymentMethod)}>
                          {getPaymentMethodText(sale.paymentMethod)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(sale.status)}>
                          {getStatusText(sale.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            title="عرض التفاصيل"
                            onClick={() => handleViewDetails(sale.id.toString())}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            title="طباعة الايصال"
                            onClick={() => handlePrintInvoice(sale)}
                          >
                            <Printer className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>

      {/* نافذة الايصال */}
      {showInvoice && (
        <>
          {saleDetailsLoading && !currentInvoiceData ? (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <Clock className="h-6 w-6 animate-spin text-primary" />
                  <span>جاري تحميل بيانات الايصال...</span>
                </div>
              </Card>
            </div>
          ) : (
            <InvoiceDialog
              open={showInvoice}
              onOpenChange={(open) => {
                setShowInvoice(open);
                if (!open) {
                  setSelectedSaleId(null);
                }
              }}
              invoiceData={currentInvoiceData}
            />
          )}
        </>
      )}
    </div>
  );
}
