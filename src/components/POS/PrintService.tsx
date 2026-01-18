

import { OrderItem } from "@/types/pos";

interface PrintServiceProps {
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
  onPrint?: () => void;
}

export const PrintService = {
  print: (data: PrintServiceProps) => {
    const {
      orderItems,
      customerName,
      customerPhone,
      carPlate,
      carMake,
      carModel,
      discount,
      paymentMethod,
      orderId
    } = data;

    const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountAmount = subtotal * (discount / 100);
    const taxAmount = (subtotal - discountAmount) * 0.15;
    const total = subtotal - discountAmount + taxAmount;

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
      const vatNumber = "300001234512345";
      const timestamp = new Date().toISOString();
      const totalAmount = total.toFixed(2);
      const vatAmount = taxAmount.toFixed(2);
      
      const tlvData = [
        { tag: 1, value: companyName },
        { tag: 2, value: vatNumber },
        { tag: 3, value: timestamp },
        { tag: 4, value: totalAmount },
        { tag: 5, value: vatAmount }
      ];
      
      return tlvData.map(item => `${item.tag}:${item.value}`).join('|');
    };

    const qrData = generateQRData();

    const invoiceHtml = `
      <!DOCTYPE html>
      <html dir="rtl">
        <head>
          <meta charset="UTF-8">
          <title>ايصال رقم ${orderId}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Arial', 'Tahoma', sans-serif;
              font-size: 12px;
              line-height: 1.4;
              color: #000;
              background: #fff;
              width: 80mm;
              margin: 0 auto;
              padding: 5mm;
            }
            
            .header {
              text-align: center;
              margin-bottom: 15px;
              border-bottom: 2px dashed #ccc;
              padding-bottom: 10px;
            }
            
            .logo {
              width: 40mm;
              height: auto;
              margin-bottom: 8px;
            }
            
            .company-name {
              font-size: 16px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            
            .company-details {
              font-size: 10px;
              line-height: 1.3;
              margin-bottom: 8px;
            }
            
            .vat-box {
              background: #f5f5f5;
              border: 1px solid #ccc;
              padding: 5px;
              margin: 8px 0;
              text-align: center;
              font-size: 10px;
              font-weight: bold;
            }
            
            .invoice-type {
              background: #f0f0f0;
              border: 1px solid #999;
              padding: 8px;
              text-align: center;
              margin: 10px 0;
              font-weight: bold;
              font-size: 12px;
            }
            
            .section {
              margin-bottom: 12px;
              padding-bottom: 8px;
              border-bottom: 1px dashed #ddd;
            }
            
            .section-title {
              font-weight: bold;
              font-size: 11px;
              margin-bottom: 6px;
              text-decoration: underline;
            }
            
            .info-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 3px;
              font-size: 10px;
            }
            
            .info-row .label {
              font-weight: normal;
            }
            
            .info-row .value {
              font-weight: bold;
            }
            
            .items {
              margin-bottom: 15px;
            }
            
            .item {
              margin-bottom: 8px;
              padding-bottom: 5px;
              border-bottom: 1px solid #eee;
            }
            
            .item-name {
              font-weight: bold;
              margin-bottom: 2px;
              display: flex;
              justify-content: space-between;
            }
            
            .item-details {
              font-size: 9px;
              color: #666;
              display: flex;
              justify-content: space-between;
            }
            
            .totals {
              background: #fafafa;
              padding: 8px;
              border: 1px solid #ddd;
            }
            
            .total-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 3px;
              font-size: 10px;
            }
            
            .final-total {
              background: #e8e8e8;
              border: 1px solid #999;
              padding: 6px;
              margin-top: 8px;
              font-weight: bold;
              font-size: 12px;
            }
            
            .payment-status {
              background: #e8f5e8;
              border: 1px solid #4caf50;
              padding: 8px;
              text-align: center;
              margin: 10px 0;
              font-size: 10px;
            }
            
            .footer {
              text-align: center;
              font-size: 9px;
              margin-top: 15px;
              border-top: 2px dashed #ccc;
              padding-top: 10px;
            }
            
            .footer-section {
              margin-bottom: 8px;
              padding-bottom: 5px;
              border-bottom: 1px solid #eee;
            }
            
            @media print {
              body {
                width: 80mm !important;
                margin: 0 !important;
                padding: 3mm !important;
                font-size: 10px !important;
              }
              
              @page {
                size: 80mm auto;
                margin: 0;
              }
              
              .header {
                margin-bottom: 10px !important;
              }
              
              .section {
                margin-bottom: 8px !important;
              }
            }
          </style>
        </head>
        <body>
          <!-- ج.م الايصال مع QR Code -->
          <div class="header">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <div style="flex: 1;">
                <div class="company-name">رغوة - خبراء العناية ب الكافية</div>
                <div style="font-size: 11px; font-weight: 600;">Raghwa Car Care Experts</div>
                
                <div class="company-details">
                  شارع الملك فهد، الرياض 12345<br>
                  King Fahd Road, Riyadh 12345<br>
                  Kingdom of Saudi Arabia<br>
                  هاتف: +966 123 456 789<br>
                  البريد الإلكتروني: info@raghwa.sa
                </div>
              </div>
              
              <!-- QR Code -->
              <div style="width: 15mm; height: 15mm; border: 1px solid #ccc; display: flex; align-items: center; justify-content: center; margin-left: 5mm;">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=${encodeURIComponent(qrData)}" 
                     alt="QR Code" 
                     style="width: 100%; height: 100%; object-fit: contain;" />
              </div>
            </div>
            
            <div class="vat-box">
              الرقم الضريبي / VAT Number<br>
              <strong>300001234512345</strong>
            </div>
          </div>

          <!-- نوع الايصال -->
          <div class="invoice-type">
            ايصال ضريبية مبسطة<br>
            SIMPLIFIED TAX INVOICE
          </div>

          <!-- تفاصيل الايصال -->
          <div class="section">
            <div class="info-row">
              <span class="label">رقم الايصال / Invoice No.:</span>
              <span class="value">${orderId}</span>
            </div>
            <div class="info-row">
              <span class="label">تاريخ الإصدار / Issue Date:</span>
              <span class="value">${new Date().toLocaleDateString('ar-SA')}</span>
            </div>
            <div class="info-row">
              <span class="label">وقت الإصدار / Issue Time:</span>
              <span class="value">${new Date().toLocaleTimeString('ar-SA', { hour12: false })}</span>
            </div>
            <div class="info-row">
              <span class="label">طريقة الدفع / Payment Method:</span>
              <span class="value">${getPaymentMethodName(paymentMethod)}</span>
            </div>
          </div>

          ${(customerName || customerPhone) ? `
          <!-- بيانات العميل -->
          <div class="section">
            <div class="section-title">بيانات العميل / Customer Information</div>
            ${customerName ? `
            <div class="info-row">
              <span class="label">اسم العميل / Customer Name:</span>
              <span class="value">${customerName}</span>
            </div>
            ` : ''}
            ${customerPhone ? `
            <div class="info-row">
              <span class="label">رقم الجوال / Mobile:</span>
              <span class="value">${customerPhone}</span>
            </div>
            ` : ''}
            <div class="info-row">
              <span class="label">نوع العميل / Customer Type:</span>
              <span class="value">فرد / Individual</span>
            </div>
          </div>
          ` : ''}

          ${carPlate ? `
          <!-- بيانات المركبة -->
          <div class="section">
            <div class="section-title">بيانات المركبة / Vehicle Information</div>
            <div class="info-row">
              <span class="label">اللوحة / Plate:</span>
              <span class="value">${carPlate}</span>
            </div>
            ${carMake ? `
            <div class="info-row">
              <span class="label">الماركة / Make:</span>
              <span class="value">${carMake}</span>
            </div>
            ` : ''}
            ${carModel ? `
            <div class="info-row">
              <span class="label">الموديل / Model:</span>
              <span class="value">${carModel}</span>
            </div>
            ` : ''}
          </div>
          ` : ''}

          <!-- الخدمات والمنتجات -->
          <div class="section">
            <div class="section-title">الخدمات والمنتجات / Services & Products</div>
            <div class="items">
              ${orderItems.map(item => `
                <div class="item">
                  <div class="item-name">
                    <span>${item.name}</span>
                    <span>${(item.price * item.quantity).toFixed(2)} جنيه مصري</span>
                  </div>
                  <div class="item-details">
                    <span>${item.quantity} × ${item.price.toFixed(2)} جنيه مصري</span>
                    <span>${item.type === 'service' ? 'خدمة / Service' : 'منتج / Product'}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- ملخص المبالغ -->
          <div class="section">
            <div class="section-title">ملخص المبالغ / Amount Summary</div>
            <div class="totals">
              <div class="total-row">
                <span>المجموع قبل الضريبة / Subtotal:</span>
                <span>${(subtotal - discountAmount).toFixed(2)} جنيه مصري</span>
              </div>
              ${discount > 0 ? `
              <div class="total-row" style="color: #4caf50;">
                <span>خصم (${discount}%) / Discount:</span>
                <span>-${discountAmount.toFixed(2)} جنيه مصري</span>
              </div>
              ` : ''}
              <div class="total-row">
                <span>ضريبة القيمة المضافة (15%) / VAT:</span>
                <span>${taxAmount.toFixed(2)} جنيه مصري</span>
              </div>
              <div class="final-total">
                <div style="display: flex; justify-content: space-between;">
                  <span>المجموع الكلي / Total:</span>
                  <span>${total.toFixed(2)} جنيه مصري</span>
                </div>
              </div>
            </div>
          </div>

          <!-- حالة الدفع -->
          <div class="payment-status">
            <div style="font-weight: bold; color: #2e7d32;">
              حالة الدفع: مدفوع / Payment Status: Paid
            </div>
            <div style="margin-top: 3px; color: #4caf50;">
              الطريقة: ${getPaymentMethodName(paymentMethod)}
            </div>
          </div>

          <!-- التذييل -->
          <div class="footer">
            <div class="footer-section">
              <div style="font-weight: bold;">شكراً لثقتكم بخدماتنا</div>
              <div style="font-weight: bold;">Thank you for choosing our services</div>
            </div>
            
            <div class="footer-section">
              <div>هذه ايصال إلكترونية صادرة وفقاً لأنظمة هيئة الزكاة والضريبة والجمارك</div>
              <div>This is an electronic invoice issued according to ZATCA regulations</div>
            </div>
            
            <div class="footer-section">
              <div>تاريخ الطباعة: ${new Date().toLocaleString('ar-SA')}</div>
              <div>Print Date: ${new Date().toLocaleString('en-US')}</div>
            </div>
          </div>
        </body>
      </html>
    `;

    // فتح نافذة طباعة جديدة
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write(invoiceHtml);
      printWindow.document.close();
      
      // انتظار تحميل المحتوى ثم الطباعة
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.focus();
          printWindow.print();
          printWindow.close();
        }, 500);
      };
      
      return true;
    } else {
      return false;
    }
  }
};