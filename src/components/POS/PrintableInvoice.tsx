import { forwardRef } from "react";
import { Separator } from "@/components/ui/separator";
import { OrderItem, PaymentSplit } from "@/types/pos";
import daglwaLogo from '../../assets/daglwa-logo-transparent.png';


interface PrintableInvoiceProps {
  orderItems: OrderItem[];
  customerName: string;
  customerPhone: string;
  carPlate: string;
  carMake: string;
  carModel: string;
  carYear: string;
  carColor: string;
  discount: number;
  paymentMethod: string;
  orderId: string;
  printDate: string;
  enableSplitPayment?: boolean;
  paymentSplits?: Array<PaymentSplit & { methodName?: string }>;
}

export const PrintableInvoice = forwardRef<HTMLDivElement, PrintableInvoiceProps>(({
  orderItems,
  customerName,
  customerPhone,
  carPlate,
  carMake,
  carModel,
  carYear,
  carColor,
  discount,
  paymentMethod,
  orderId,
  printDate,
  enableSplitPayment = false,
  paymentSplits = []
}, ref) => {
  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = subtotal * (discount / 100);
  const taxAmount = (subtotal - discountAmount) * 0.15;
  const total = subtotal - discountAmount + taxAmount;

  const totalDuration = orderItems
    .filter(item => item.type === 'service')
    .reduce((sum, item) => sum + ((item.duration || 0) * item.quantity), 0);

  const getPaymentMethodName = (method: string) => {
    const methods: { [key: string]: string } = {
      'cash': 'نقدي',
      'mada': 'مدى',
      'visa': 'فيزا',
      'mastercard': 'ماستركارد',
      'apple_pay': 'Apple Pay',
      'stc_pay': 'STC Pay',
      'credit': 'آجل'
    };
    return methods[method] || method;
  };

  // Generate ZATCA compliant QR code data (TLV format)
  const generateQRData = () => {
    const companyName = "رغوة - خبراء العناية ب الكافية";
    const vatNumber = "300001234512345"; // 15-digit VAT number
    const timestamp = new Date().toISOString();
    const totalAmount = total.toFixed(2);
    const vatAmount = taxAmount.toFixed(2);
    
    // ZATCA QR Code format (TLV - Tag Length Value)
    // Tag 1: Seller Name
    // Tag 2: VAT Registration Number  
    // Tag 3: Timestamp
    // Tag 4: Invoice Total (including VAT)
    // Tag 5: VAT Total
    const tlvData = [
      { tag: 1, value: companyName },
      { tag: 2, value: vatNumber },
      { tag: 3, value: timestamp },
      { tag: 4, value: totalAmount },
      { tag: 5, value: vatAmount }
    ];
    
    return tlvData.map(item => `${item.tag}:${item.value}`).join('|');
  };

  return (
    <div ref={ref} className="printable-invoice bg-white text-black p-4" style={{ width: '80mm', fontSize: '12px', fontFamily: 'Arial, sans-serif' }}>
      {/* Header - Company Information */}
      <div className="text-center mb-4">
        <img 
          src={daglwaLogo} 
          alt="رغوة - خبراء العناية ب الكافية" 
          className="h-12 mx-auto mb-2"
        />
        <h1 className="text-base font-bold mb-1">رغوة - خبراء العناية ب الكافية</h1>
        <p className="text-sm font-medium mb-1">Raghwa Car Care Experts</p>
        <div className="text-xs space-y-0.5">
          <p>شارع الملك فهد، الرياض 12345</p>
          <p>King Fahd Road, Riyadh 12345</p>
          <p>Kingdom of Saudi Arabia</p>
          <p>هاتف: +966 123 50 9664 / +966 50 123 4567</p>
          <p>البريد الإلكتروني: info@raghwa.sa</p>
        </div>
        <div className="bg-gray-100 border border-gray-300 p-2 mt-2 text-xs">
          <p className="font-bold">الرقم الضريبي / VAT Number</p>
          <p className="font-bold">300001234512345</p>
        </div>
      </div>

      <div className="border-t-2 border-dashed border-gray-400 my-3"></div>

      {/* Invoice Type */}
      <div className="text-center mb-3">
        <div className="bg-gray-100 border border-gray-400 p-2">
          <p className="text-sm font-bold">ايصال ضريبية مبسطة</p>
          <p className="text-sm font-bold">SIMPLIFIED TAX INVOICE</p>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="mb-3 text-xs space-y-1">
        <div className="flex justify-between">
          <span>رقم الايصال / Invoice No.:</span>
          <span className="font-bold">{orderId}</span>
        </div>
        <div className="flex justify-between">
          <span>تاريخ الإصدار / Issue Date:</span>
          <span>{new Date().toLocaleDateString('ar-SA')}</span>
        </div>
        <div className="flex justify-between">
          <span>وقت الإصدار / Issue Time:</span>
          <span>{new Date().toLocaleTimeString('ar-SA', { hour12: false })}</span>
        </div>
        <div className="flex justify-between">
          <span>طريقة الدفع / Payment Method:</span>
          <span>{getPaymentMethodName(paymentMethod)}</span>
        </div>
      </div>

      <div className="border-t border-dashed border-gray-400 my-3"></div>

      {/* Customer Information */}
      {(customerName || customerPhone) && (
        <div className="mb-3">
          <p className="text-sm font-bold mb-2 underline">
            بيانات العميل / Customer Information
          </p>
          <div className="text-xs space-y-1">
            {customerName && (
              <div className="flex justify-between">
                <span>اسم العميل / Customer Name:</span>
                <span className="font-bold">{customerName}</span>
              </div>
            )}
            {customerPhone && (
              <div className="flex justify-between">
                <span>رقم الجوال / Mobile:</span>
                <span className="font-bold">{customerPhone}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>نوع العميل / Customer Type:</span>
              <span>فرد / Individual</span>
            </div>
          </div>
        </div>
      )}

      {/* Vehicle Info */}
      {carPlate && (
        <div className="mb-3">
          <p className="text-sm font-bold mb-2">بيانات المركبة</p>
          <div className="text-xs space-y-1">
            <div className="flex justify-between">
              <span>اللوحة:</span>
              <span className="font-bold">{carPlate}</span>
            </div>
            {carMake && (
              <div className="flex justify-between">
                <span>الماركة:</span>
                <span>{carMake}</span>
              </div>
            )}
            {carModel && (
              <div className="flex justify-between">
                <span>الموديل:</span>
                <span>{carModel}</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="border-t border-dashed border-gray-400 my-3"></div>

      {/* Items */}
      <div className="mb-3">
        <p className="text-sm font-bold mb-2">الخدمات والمنتجات</p>
        <div className="space-y-2">
          {orderItems.map((item, index) => (
            <div key={index} className="text-xs border-b border-gray-200 pb-1">
              <div className="flex justify-between font-semibold">
                <span className="flex-1">{item.name}</span>
                <span>{(item.price * item.quantity).toFixed(2)} جنيه مصري</span>
              </div>
              <div className="flex justify-between text-gray-600 mt-0.5">
                <span>{item.quantity} × {item.price.toFixed(2)} جنيه مصري</span>
                <span>{item.type === 'service' ? 'خدمة' : 'منتج'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-dashed border-gray-400 my-3"></div>

      {/* Totals */}
      <div className="mb-3">
        <p className="text-sm font-bold mb-2 underline">
          ملخص المبالغ / Amount Summary
        </p>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span>المجموع قبل الضريبة / Subtotal:</span>
            <span>{(subtotal - discountAmount).toFixed(2)} جنيه مصري</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>خصم ({discount}%) / Discount:</span>
              <span>-{discountAmount.toFixed(2)} جنيه مصري</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>ضريبة القيمة المضافة (15%) / VAT:</span>
            <span>{taxAmount.toFixed(2)} جنيه مصري</span>
          </div>
          <div className="bg-gray-100 border border-gray-400 p-2 mt-2">
            <div className="flex justify-between font-bold text-sm">
              <span>المجموع الكلي / Total:</span>
              <span>{total.toFixed(2)} جنيه مصري</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-dashed border-gray-400 my-3"></div>

      {/* Payment Status */}
      <div className="text-center mb-3">
        <div className="bg-green-50 border border-green-300 p-2 text-xs">
          <p className="font-bold text-green-800">حالة الدفع: مدفوع</p>
          <p className="font-bold text-green-800">Payment Status: Paid</p>
          <p className="text-green-600 mt-1">
            الطريقة: {getPaymentMethodName(paymentMethod)}
          </p>
        </div>
      </div>

      <div className="border-t-2 border-dashed border-gray-400 my-3"></div>

      {/* Footer */}
      <div className="text-center text-xs space-y-2">
        <div>
          <p className="font-bold">شكراً لثقتكم بخدماتنا</p>
          <p className="font-bold">Thank you for choosing our services</p>
        </div>
        
        <div className="border-t border-gray-300 pt-2">
          <p>هذه ايصال إلكترونية صادرة وفقاً لأنظمة هيئة الزكاة والضريبة والجمارك</p>
          <p>This is an electronic invoice issued according to ZATCA regulations</p>
        </div>
        
        <div className="border-t border-gray-300 pt-2">
          <p>تاريخ الطباعة: {new Date().toLocaleString('ar-SA')}</p>
          <p>Print Date: {new Date().toLocaleString('en-US')}</p>
        </div>
      </div>

      {/* Print CSS */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @media print {
          .printable-invoice {
            width: 80mm !important;
            max-width: 80mm !important;
            margin: 0 !important;
            padding: 5mm !important;
            font-size: 10px !important;
            line-height: 1.3 !important;
            box-shadow: none !important;
            border: none !important;
            background: white !important;
            color: black !important;
          }
          
          .printable-invoice * {
            font-family: 'Arial', sans-serif !important;
          }
          
          .printable-invoice h1 {
            font-size: 14px !important;
            margin: 3px 0 !important;
          }
          
          .printable-invoice .text-sm {
            font-size: 11px !important;
          }
          
          .printable-invoice .text-xs {
            font-size: 9px !important;
          }
          
          .printable-invoice img {
            height: 20mm !important;
            width: auto !important;
          }
          
          @page {
            margin: 0 !important;
            size: 80mm auto !important;
          }
          
          body {
            margin: 0 !important;
            padding: 0 !important;
          }
        }
      `}} />
    </div>
  );
});

PrintableInvoice.displayName = 'PrintableInvoice';