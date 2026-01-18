import { useToast } from '@/hooks/use-toast';

interface Invoice {
  id: string;
  number: string;
  customer: {
    name: string;
    phone: string;
  };
  total: number;
  date: string;
  services: Array<{
    name: string;
    price: number;
  }>;
  status: 'pending' | 'paid' | 'cancelled';
}

export class InvoiceServices {
  private toast: any;

  constructor(toast: any) {
    this.toast = toast;
  }

  // إرسال الايصال عبر واتساب
  async sendWhatsApp(invoice: Invoice, customMessage?: string) {
    try {
      const message = customMessage || this.generateWhatsAppMessage(invoice);
      const phoneNumber = this.formatPhoneNumber(invoice.customer.phone);
      
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      
      // فتح واتساب
      const popup = window.open(whatsappUrl, '_blank', 'width=400,height=600');
      
      // إشعار نجاح
      this.toast({
        title: "📱 تم فتح واتساب",
        description: `إرسال الايصال ${invoice.number} إلى ${invoice.customer.name}`,
        duration: 4000
      });

      // تسجيل العملية
      this.logActivity('whatsapp_sent', invoice);
      
      return { success: true, url: whatsappUrl };
    } catch (error) {
      console.error('❌ خطأ في إرسال واتساب:', error);
      this.toast({
        title: "❌ خطأ في الإرسال",
        description: "فشل في إرسال رسالة واتساب",
        duration: 3000
      });
      return { success: false, error };
    }
  }

  // طباعة الايصال مع تصميم احترافي
  async printInvoice(invoice: Invoice, options = {}) {
    try {
      const printContent = this.generatePrintableInvoice(invoice, options);
      
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      
      if (!printWindow) {
        throw new Error('تم حظر النوافذ المنبثقة');
      }

      printWindow.document.write(printContent);
      printWindow.document.close();

      // انتظار تحميل المحتوى ثم الطباعة
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          printWindow.onafterprint = () => {
            printWindow.close();
          };
        }, 500);
      };

      this.toast({
        title: "🖨️ تم إرسال للطباعة",
        description: `الايصال ${invoice.number}`,
        duration: 3000
      });

      this.logActivity('printed', invoice);
      
      return { success: true };
    } catch (error) {
      console.error('❌ خطأ في الطباعة:', error);
      this.toast({
        title: "❌ خطأ في الطباعة",
        description: "تأكد من إعدادات الطابعة",
        duration: 3000
      });
      return { success: false, error };
    }
  }

  // إرسال إشعار SMS للعميل
  async sendSMSNotification(invoice: Invoice) {
    try {
      // محاكاة إرسال SMS (في التطبيق الحقيقي يتم ربطه بخدمة SMS)
      const message = `
تم إصدار فاتورتك بنجاح
رقم الايصال: ${invoice.number}
المبلغ: ${invoice.total} جنيه
شكراً لثقتكم بنا
      `.trim();

      // محاكاة تأخير الإرسال
      await new Promise(resolve => setTimeout(resolve, 1500));

      this.toast({
        title: "📩 تم إرسال الإشعار",
        description: `إشعار SMS إلى ${invoice.customer.phone}`,
        duration: 4000
      });

      this.logActivity('sms_sent', invoice);
      
      return { success: true, message };
    } catch (error) {
      console.error('❌ خطأ في إرسال SMS:', error);
      this.toast({
        title: "❌ خطأ في الإرسال",
        description: "فشل في إرسال الإشعار",
        duration: 3000
      });
      return { success: false, error };
    }
  }

  // إنشاء رسالة واتساب
  private generateWhatsAppMessage(invoice: Invoice): string {
    const servicesText = invoice.services
      .map(service => `• ${service.name} - ${service.price} جنيه`)
      .join('\n');

    return `
🧾 *ايصال خدمة المشروب*

✅ تم إتمام الخدمة بنجاح

📋 *رقم الايصال:* ${invoice.number}
👤 *العميل:* ${invoice.customer.name}
📱 *الهاتف:* ${invoice.customer.phone}
📅 *التاريخ:* ${new Date(invoice.date).toLocaleDateString('ar-SA')}

🛠️ *الخدمات المقدمة:*
${servicesText}

💰 *إجمالي المبلغ: ${invoice.total} جنيه*

━━━━━━━━━━━━━━━━━━━━━
🙏 شكراً لثقتكم بنا!
نتطلع لخدمتكم مرة أخرى

🚗 مركز خدمة  الكافية الممتاز
    `.trim();
  }

  // إنشاء محتوى قابل للطباعة
  private generatePrintableInvoice(invoice: Invoice, options: any = {}): string {
    const {
      showLogo = true,
      showQR = false,
      companyInfo = {
        name: 'مركز خدمة  الكافية الممتاز',
        address: 'الرياض، المملكة العربية المصرية',
        phone: '+966 11 123 4567',
        email: 'info@carservice.sa'
      }
    } = options;

    const servicesHTML = invoice.services.map(service => `
      <tr>
        <td style="text-align: center; padding: 8px; border-bottom: 1px solid #e5e7eb;">${service.price} جنيه</td>
        <td style="text-align: right; padding: 8px; border-bottom: 1px solid #e5e7eb;">${service.name}</td>
      </tr>
    `).join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>ايصال ${invoice.number}</title>
        <style>
          @page { 
            size: A4; 
            margin: 0.5in; 
          }
          body { 
            font-family: 'Arial', sans-serif; 
            direction: rtl; 
            line-height: 1.6;
            color: #374151;
          }
          .header { 
            text-align: center; 
            border-bottom: 3px solid #2563eb; 
            padding-bottom: 20px; 
            margin-bottom: 30px; 
          }
          .company-name { 
            font-size: 24px; 
            font-weight: bold; 
            color: #2563eb; 
            margin-bottom: 10px; 
          }
          .invoice-title { 
            font-size: 20px; 
            color: #059669; 
            margin: 20px 0; 
          }
          .invoice-number { 
            background: #2563eb; 
            color: white; 
            padding: 10px 20px; 
            border-radius: 25px; 
            display: inline-block; 
            font-weight: bold; 
          }
          .info-section { 
            background: #f8fafc; 
            padding: 20px; 
            border-radius: 8px; 
            margin: 20px 0; 
            border-left: 4px solid #2563eb; 
          }
          .services-table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 20px 0; 
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); 
          }
          .services-table th { 
            background: #2563eb; 
            color: white; 
            padding: 12px; 
            text-align: center; 
          }
          .total-section { 
            background: #059669; 
            color: white; 
            padding: 15px; 
            border-radius: 8px; 
            text-align: center; 
            font-size: 18px; 
            font-weight: bold; 
            margin: 20px 0; 
          }
          .footer { 
            text-align: center; 
            margin-top: 40px; 
            padding-top: 20px; 
            border-top: 2px solid #e5e7eb; 
            color: #6b7280; 
          }
          .status-badge { 
            background: #dcfce7; 
            color: #059669; 
            padding: 5px 15px; 
            border-radius: 20px; 
            font-weight: bold; 
            display: inline-block; 
          }
        </style>
      </head>
      <body>
        <div class="header">
          ${showLogo ? `<div class="company-name">${companyInfo.name}</div>` : ''}
          <div style="color: #6b7280; font-size: 14px;">${companyInfo.address}</div>
          <div style="color: #6b7280; font-size: 14px;">📱 ${companyInfo.phone} | 📧 ${companyInfo.email}</div>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <h1 class="invoice-title">🧾 ايصال خدمة المشروب</h1>
          <div class="status-badge">✅ تم الدفع</div>
          <br><br>
          <div class="invoice-number">رقم الايصال: ${invoice.number}</div>
        </div>

        <div class="info-section">
          <h3 style="color: #374151; margin-bottom: 15px;">📋 بيانات العميل</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div><strong>الاسم:</strong> ${invoice.customer.name}</div>
            <div><strong>الهاتف:</strong> ${invoice.customer.phone}</div>
            <div><strong>التاريخ:</strong> ${new Date(invoice.date).toLocaleDateString('ar-SA')}</div>
            <div><strong>الوقت:</strong> ${new Date(invoice.date).toLocaleTimeString('ar-SA')}</div>
          </div>
        </div>

        <div style="margin: 30px 0;">
          <h3 style="color: #374151; margin-bottom: 15px;">🛠️ الخدمات المقدمة</h3>
          <table class="services-table">
            <thead>
              <tr>
                <th style="width: 100px;">السعر</th>
                <th>الخدمة</th>
              </tr>
            </thead>
            <tbody>
              ${servicesHTML}
            </tbody>
          </table>
        </div>

        <div class="total-section">
          💰 إجمالي المبلغ: ${invoice.total} جنيه مصري
        </div>

        <div class="footer">
          <p style="font-size: 16px; color: #2563eb; font-weight: bold;">🙏 شكراً لثقتكم بنا!</p>
          <p>نتطلع لخدمتكم مرة أخرى</p>
          <p style="font-size: 12px; margin-top: 20px;">
            تم إنشاء هذه الايصال إلكترونياً في ${new Date().toLocaleString('ar-SA')}
          </p>
        </div>

        <script>
          window.onload = function() {
            setTimeout(() => {
              window.print();
            }, 500);
          };
        </script>
      </body>
      </html>
    `;
  }

  // تنسيق رقم الهاتف
  private formatPhoneNumber(phone: string): string {
    // إزالة كل شيء عدا الأرقام
    const cleaned = phone.replace(/[^0-9]/g, '');
    
    // إضافة كود المصرية إذا لم يكن موجوداً
    if (cleaned.startsWith('05')) {
      return '966' + cleaned.substring(1);
    } else if (cleaned.startsWith('5')) {
      return '966' + cleaned;
    } else if (cleaned.startsWith('966')) {
      return cleaned;
    }
    
    return cleaned;
  }

  // تسجيل الأنشطة
  private logActivity(action: string, invoice: Invoice) {
    const activity = {
      action,
      invoiceId: invoice.id,
      invoiceNumber: invoice.number,
      customerName: invoice.customer.name,
      timestamp: new Date().toISOString()
    };

    try {
      const existingLogs = JSON.parse(localStorage.getItem('invoice_activities') || '[]');
      const updatedLogs = [activity, ...existingLogs.slice(0, 99)]; // الاحتفاظ بآخر 100 نشاط
      localStorage.setItem('invoice_activities', JSON.stringify(updatedLogs));
    } catch (error) {
      console.error('❌ خطأ في تسجيل النشاط:', error);
    }
  }
}

// Hook لاستخدام خدمات الايصال
export const useInvoiceServices = () => {
  const { toast } = useToast();
  const services = new InvoiceServices(toast);

  return {
    sendWhatsApp: (invoice: Invoice, customMessage?: string) => 
      services.sendWhatsApp(invoice, customMessage),
    printInvoice: (invoice: Invoice, options?: any) => 
      services.printInvoice(invoice, options),
    sendSMSNotification: (invoice: Invoice) => 
      services.sendSMSNotification(invoice)
  };
};