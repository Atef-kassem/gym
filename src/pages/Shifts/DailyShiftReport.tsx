import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Clock,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Users,
  ShoppingCart,
  CreditCard,
  Wallet,
  Banknote,
  Building2,
  FileText,
  Printer
} from 'lucide-react';
import { useGetDailyReportQuery } from '@/services/shiftSessionApi';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { toast } from 'sonner';
import { CurrentShiftIndicator } from '@/components/Shifts/CurrentShiftIndicator';

export default function DailyShiftReport() {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedBranchId, setSelectedBranchId] = useState<number | undefined>();

  const {
    data: reportData,
    isLoading,
    refetch,
    isFetching
  } = useGetDailyReportQuery({
    date: selectedDate,
    ...(selectedBranchId && { branchId: selectedBranchId })
  });

  const report = reportData?.data;

  const handlePrint = () => {
    window.print();
    toast.success('جاري طباعة التقرير...');
  };

  const handleExport = () => {
    // يمكن تطوير هذا لتصدير البيانات كـ Excel أو PDF
    toast.info('جاري تصدير التقرير...');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ar-EG', {
      style: 'currency',
      currency: 'EGP',
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-green-500">مفتوحة</Badge>;
      case 'closed':
        return <Badge className="bg-gray-500">مغلقة</Badge>;
      case 'auto_closed':
        return <Badge className="bg-blue-500">مغلقة تلقائياً</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* مؤشر الوردية الحالية */}
      <CurrentShiftIndicator />
      
      {/* الترويسة */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary" />
            تقرير الورديات اليومي
          </h1>
          <p className="text-gray-500 mt-1">
            عرض شامل لجميع الورديات وأداءها اليومي
          </p>
        </div>

        <div className="flex gap-2 print:hidden">
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
            تحديث
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            طباعة
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            تصدير
          </Button>
        </div>
      </div>

      {/* الفلاتر */}
      <Card className="p-4 print:hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="date">التاريخ</Label>
            <Input
              id="date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      </Card>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : !report ? (
        <Card className="p-12 text-center">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">لا توجد بيانات</h3>
          <p className="text-gray-500">لم يتم العثور على تقارير للتاريخ المحدد</p>
        </Card>
      ) : (
        <>
          {/* معلومات التقرير */}
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="h-6 w-6 text-primary" />
              <div>
                <h2 className="text-xl font-bold">
                  {format(new Date(report.date), 'EEEE، d MMMM yyyy', { locale: ar })}
                </h2>
                <p className="text-sm text-gray-600">
                  {report.summary.shiftsCount} وردية | {report.summary.transactionsCount} عملية
                </p>
              </div>
            </div>

            {/* الملخص العام */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-sm">إجمالي المبيعات</span>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(report.summary.totalSales)}
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <ShoppingCart className="h-4 w-4" />
                  <span className="text-sm">عدد العمليات</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  {report.summary.totalTransactions}
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm">متوسط العملية</span>
                </div>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(report.summary.averageTransaction)}
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  {report.summary.totalCashDifference >= 0 ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span className="text-sm">فرق النقدية</span>
                </div>
                <p className={`text-2xl font-bold ${
                  report.summary.totalCashDifference >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency(report.summary.totalCashDifference)}
                </p>
              </div>
            </div>
          </Card>

          {/* تفاصيل طرق الدفع */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              تفاصيل طرق الدفع
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                <Banknote className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">نقدي</p>
                  <p className="text-lg font-bold">{formatCurrency(report.summary.totalCash)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                <CreditCard className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">بطاقة</p>
                  <p className="text-lg font-bold">{formatCurrency(report.summary.totalCard)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                <Wallet className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">محفظة</p>
                  <p className="text-lg font-bold">{formatCurrency(report.summary.totalWallet)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg">
                <TrendingUp className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">تحويل</p>
                  <p className="text-lg font-bold">{formatCurrency(report.summary.totalTransfer)}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* تفاصيل كل وردية */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              تفاصيل الورديات ({report.sessions.length})
            </h3>

            {report.sessions.length === 0 ? (
              <Card className="p-8 text-center">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">لا توجد ورديات لهذا اليوم</p>
              </Card>
            ) : (
              report.sessions.map((session: any) => (
                <Card key={session.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: session.shift.color || '#3b82f6' }}
                      >
                        <Clock className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold">{session.shift.shiftName}</h4>
                        <p className="text-sm text-gray-600">
                          {session.shift.startTime} - {session.shift.endTime}
                        </p>
                        {session.user && (
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <Users className="h-3 w-3" />
                            {session.user.arabicName || session.user.name}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-left">
                      {getStatusBadge(session.status)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">المبلغ الافتتاحي</p>
                      <p className="font-bold">{formatCurrency(session.openingBalance)}</p>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">إجمالي المبيعات</p>
                      <p className="font-bold text-green-600">{formatCurrency(session.totalSales || 0)}</p>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">المبلغ المتوقع</p>
                      <p className="font-bold">{formatCurrency(session.expectedClosingBalance || 0)}</p>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">المبلغ الفعلي</p>
                      <p className="font-bold">{formatCurrency(session.closingBalance || 0)}</p>
                    </div>

                    <div className={`p-3 rounded-lg ${
                      (session.cashDifference || 0) >= 0 ? 'bg-green-50' : 'bg-red-50'
                    }`}>
                      <p className="text-xs text-gray-600 mb-1">الفرق</p>
                      <p className={`font-bold ${
                        (session.cashDifference || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatCurrency(session.cashDifference || 0)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mt-4">
                    <div className="text-center">
                      <p className="text-xs text-gray-600">العمليات</p>
                      <p className="text-lg font-bold">{session.transactionsCount || 0}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600">نقدي</p>
                      <p className="text-sm font-semibold text-green-600">
                        {formatCurrency(session.totalCash || 0)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600">بطاقة</p>
                      <p className="text-sm font-semibold text-blue-600">
                        {formatCurrency(session.totalCard || 0)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600">محفظة</p>
                      <p className="text-sm font-semibold text-purple-600">
                        {formatCurrency(session.totalWallet || 0)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600">تحويل</p>
                      <p className="text-sm font-semibold text-orange-600">
                        {formatCurrency(session.totalTransfer || 0)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600">خصومات</p>
                      <p className="text-sm font-semibold text-red-600">
                        {formatCurrency(session.totalDiscount || 0)}
                      </p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* إحصائيات إضافية */}
          <Card className="p-6 print:break-before-page">
            <h3 className="text-lg font-bold mb-4">إحصائيات إضافية</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">الورديات المفتوحة</p>
                <p className="text-2xl font-bold text-blue-600">
                  {report.summary.openShiftsCount}
                </p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">الورديات المغلقة</p>
                <p className="text-2xl font-bold text-green-600">
                  {report.summary.closedShiftsCount}
                </p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">إجمالي الخصومات</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(report.summary.totalDiscount)}
                </p>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">إجمالي الضرائب</p>
                <p className="text-2xl font-bold text-orange-600">
                  {formatCurrency(report.summary.totalTax)}
                </p>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

