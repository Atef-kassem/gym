import React, { useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Printer,
  Download,
  CheckCircle,
  Receipt,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Building2,
  Package,
  DollarSign,
  Percent,
  FileText
} from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useReactToPrint } from 'react-to-print';

interface InvoiceItem {
  id: string;
  name: string;
  code?: string;
  quantity: number;
  price: number;
  discount: number;
  total: number;
  type?: 'product' | 'service';
}

interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: Date | string;
  type: 'sale' | 'booking';
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  branchName?: string;
  branchAddress?: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod?: string;
  notes?: string;
  // للحجوزات
  bookingDate?: string;
  bookingTime?: string;
  tableName?: string;
  tableNumber?: string;
}

interface InvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceData: InvoiceData | null;
}

export const InvoiceDialog: React.FC<InvoiceDialogProps> = ({
  open,
  onOpenChange,
  invoiceData,
}) => {
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef as any,
    documentTitle: `ايصال-${invoiceData?.invoiceNumber || 'invoice'}`,
  });

  if (!invoiceData) return null;

  const isBooking = invoiceData.type === 'booking';
  const invoiceTitle = isBooking ? 'ايصال حجز' : 'ايصال بيع سريع';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="h-6 w-6 text-primary" />
              {invoiceTitle}
            </DialogTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="flex items-center gap-2"
              >
                <Printer className="h-4 w-4" />
                طباعة
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
              >
                إغلاق
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* محتوى الايصال القابل للطباعة */}
        <div ref={componentRef} className="p-8 bg-white text-black">
          {/* ج.م الايصال */}
          <div className="border-b-4 border-primary pb-6 mb-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                {/* اللوجو */}
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                  <img 
                    src="/logo.jpeg" 
                    alt="Meta Codecx Logo" 
                    className="w-16 h-16 object-contain"
                    onError={(e) => {
                      // في حالة فشل تحميل الصورة، عرض حرف O
                      (e.target as HTMLImageElement).style.display = 'none';
                      const parent = (e.target as HTMLElement).parentElement;
                      if (parent && !parent.querySelector('.fallback-text')) {
                        const text = document.createElement('div');
                        text.className = 'fallback-text text-4xl font-bold text-white';
                        text.textContent = 'OM';
                        parent.appendChild(text);
                      }
                    }}
                  />
                </div>
                {/* اسم الكافيه */}
                <div>
                  <h1 className="text-3xl font-bold text-primary mb-2">
                    Meta Codecx
                  </h1>
                  <p className="text-sm text-gray-600">كافيه ون مليون</p>
                  <p className="text-xs text-gray-500 mt-1">☕ القهوة الفاخرة</p>
                </div>
              </div>
              <div className="text-right">
                <div className="bg-primary text-white px-6 py-3 rounded-lg">
                  <h2 className="text-xl font-bold mb-1">{invoiceTitle}</h2>
                  <p className="text-sm">رقم: {invoiceData.invoiceNumber}</p>
                </div>
              </div>
            </div>
          </div>

          {/* معلومات الايصال */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <Card className="p-4 bg-gray-50">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <User className="h-4 w-4" />
                معلومات العميل
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-3 w-3 text-gray-500" />
                  <span className="font-medium">الاسم:</span>
                  <span>{invoiceData.customerName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3 text-gray-500" />
                  <span className="font-medium">الجوال:</span>
                  <span>{invoiceData.customerPhone}</span>
                </div>
                {invoiceData.customerEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3 text-gray-500" />
                    <span className="font-medium">البريد:</span>
                    <span className="text-xs">{invoiceData.customerEmail}</span>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-4 bg-gray-50">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                تفاصيل الايصال
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3 text-gray-500" />
                  <span className="font-medium">التاريخ:</span>
                  <span>
                    {typeof invoiceData.invoiceDate === 'string'
                      ? invoiceData.invoiceDate
                      : format(invoiceData.invoiceDate, 'PPP', { locale: ar })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3 text-gray-500" />
                  <span className="font-medium">الوقت:</span>
                  <span>
                    {typeof invoiceData.invoiceDate === 'string'
                      ? new Date().toLocaleTimeString('ar-SA')
                      : format(invoiceData.invoiceDate, 'p', { locale: ar })}
                  </span>
                </div>
                {invoiceData.branchName && (
                  <div className="flex items-center gap-2">
                    <Building2 className="h-3 w-3 text-gray-500" />
                    <span className="font-medium">الفرع:</span>
                    <span>{invoiceData.branchName}</span>
                  </div>
                )}
                {invoiceData.paymentMethod && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-3 w-3 text-gray-500" />
                    <span className="font-medium">طريقة الدفع:</span>
                    <span>{invoiceData.paymentMethod}</span>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* معلومات الحجز (للحجوزات فقط) */}
          {isBooking && (invoiceData.bookingDate || invoiceData.tableName) && (
            <Card className="p-4 mb-6 bg-blue-50 border-blue-200">
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-blue-900">
                <Calendar className="h-4 w-4" />
                تفاصيل الحجز
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {invoiceData.bookingDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3 text-blue-600" />
                    <span className="font-medium">تاريخ الحجز:</span>
                    <span>{invoiceData.bookingDate}</span>
                  </div>
                )}
                {invoiceData.bookingTime && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3 text-blue-600" />
                    <span className="font-medium">وقت الحجز:</span>
                    <span>{invoiceData.bookingTime}</span>
                  </div>
                )}
                {invoiceData.tableName && (
                  <div className="flex items-center gap-2">
                    <Package className="h-3 w-3 text-blue-600" />
                    <span className="font-medium">الطاولة:</span>
                    <span>
                      {invoiceData.tableName}
                      {invoiceData.tableNumber && ` (رقم ${invoiceData.tableNumber})`}
                    </span>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* جدول العناصر */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Package className="h-4 w-4" />
              {isBooking ? 'الخدمات' : 'المنتجات والخدمات'}
            </h3>
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 p-3 text-right">الرمز</th>
                  <th className="border border-gray-300 p-3 text-right">الاسم</th>
                  <th className="border border-gray-300 p-3 text-center">النوع</th>
                  <th className="border border-gray-300 p-3 text-center">الكمية</th>
                  <th className="border border-gray-300 p-3 text-center">السعر</th>
                  <th className="border border-gray-300 p-3 text-center">الخصم</th>
                  <th className="border border-gray-300 p-3 text-center">الإجمالي</th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.items.map((item, index) => (
                  <tr key={item.id || index} className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-3 text-sm font-mono">
                      {item.code || '-'}
                    </td>
                    <td className="border border-gray-300 p-3">{item.name}</td>
                    <td className="border border-gray-300 p-3 text-center">
                      <Badge variant={item.type === 'service' ? 'default' : 'secondary'} className="text-xs">
                        {item.type === 'service' ? 'خدمة' : 'منتج'}
                      </Badge>
                    </td>
                    <td className="border border-gray-300 p-3 text-center">{item.quantity}</td>
                    <td className="border border-gray-300 p-3 text-center">{item.price.toFixed(2)} جنيه مصري</td>
                    <td className="border border-gray-300 p-3 text-center">{item.discount}%</td>
                    <td className="border border-gray-300 p-3 text-center font-semibold">
                      {item.total.toFixed(2)} جنيه مصري
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ملخص المبالغ */}
          <div className="flex justify-end mb-6">
            <Card className="w-96 p-4 bg-gray-50">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">المجموع الفرعي:</span>
                  <span className="font-medium">{invoiceData.subtotal.toFixed(2)} جنيه مصري</span>
                </div>
                <div className="flex justify-between text-sm text-red-600">
                  <span className="flex items-center gap-1">
                    <Percent className="h-3 w-3" />
                    الخصم:
                  </span>
                  <span className="font-medium">-{invoiceData.discount.toFixed(2)} جنيه مصري</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">الضريبة (15%):</span>
                  <span className="font-medium">+{invoiceData.tax.toFixed(2)} جنيه مصري</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>الإجمالي النهائي:</span>
                  <span className="text-primary">{invoiceData.total.toFixed(2)} جنيه مصري</span>
                </div>
              </div>
            </Card>
          </div>

          {/* ملاحظات */}
          {invoiceData.notes && (
            <Card className="p-4 mb-6 bg-yellow-50 border-yellow-200">
              <h3 className="font-semibold mb-2 text-yellow-900">ملاحظات:</h3>
              <p className="text-sm text-gray-700">{invoiceData.notes}</p>
            </Card>
          )}

          {/* رسالة النجاح */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-6 py-3 rounded-lg">
              <CheckCircle className="h-5 w-5" />
              <span className="font-semibold">
                {isBooking ? 'تم إنشاء الحجز بنجاح!' : 'تمت عملية البيع بنجاح!'}
              </span>
            </div>
          </div>

          {/* ذيل الايصال */}
          <Separator className="my-6" />
          <div className="text-center text-sm text-gray-600">
            <p className="mb-2">شكراً لتعاملكم معنا</p>
            <p className="text-xs">
              هذه ايصال إلكترونية صادرة من نظام  Meta Codecx
            </p>
            <p className="text-xs mt-2">
              تاريخ الطباعة: {format(new Date(), 'PPP p', { locale: ar })}
            </p>
          </div>
        </div>

        {/* أزرار الإجراءات في أسفل النافذة */}
        <div className="flex justify-center gap-3 pt-4 border-t print:hidden">
          <Button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90"
          >
            <Printer className="h-4 w-4" />
            طباعة الايصال
          </Button>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            إغلاق
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

