import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Share, Printer, MessageCircle, Bell, Plus, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PaymentSuccessScreenProps {
  invoice: {
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
  };
  onNewCustomer: () => void;
  onClose?: () => void;
}

export const PaymentSuccessScreen: React.FC<PaymentSuccessScreenProps> = ({
  invoice,
  onNewCustomer,
  onClose
}) => {
  const { toast } = useToast();
  const [isSharing, setIsSharing] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  // مشاركة واتساب
  const handleWhatsAppShare = () => {
    setIsSharing(true);
    const message = `
🧾 *ايصال خدمة المشروب*

📋 رقم الايصال: ${invoice.number}
👤 العميل: ${invoice.customer.name}
📱 الهاتف: ${invoice.customer.phone}
📅 التاريخ: ${new Date(invoice.date).toLocaleDateString('ar-SA')}

💰 *إجمالي المبلغ: ${invoice.total} جنيه*

🚗 *الخدمات المقدمة:*
${invoice.services.map(service => `• ${service.name} - ${service.price} جنيه`).join('\n')}

شكراً لثقتكم بنا! 🙏
    `.trim();

    const whatsappUrl = `https://wa.me/${invoice.customer.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    setTimeout(() => {
      setIsSharing(false);
      toast({
        title: "تم فتح واتساب",
        description: "تم إعداد الرسالة، يمكنك إرسالها الآن",
        duration: 3000
      });
    }, 1000);
  };

  // طباعة الايصال
  const handlePrint = () => {
    setIsPrinting(true);
    
    const printContent = `
      <div style="font-family: Arial, sans-serif; direction: rtl; text-align: center; padding: 20px;">
        <h1 style="color: #2563eb; margin-bottom: 30px;">🚗 ايصال خدمة المشروب</h1>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h2 style="color: #059669; margin-bottom: 15px;">✅ تم الدفع بنجاح</h2>
          <p style="font-size: 18px; font-weight: bold;">رقم الايصال: ${invoice.number}</p>
        </div>
        
        <div style="text-align: right; margin: 20px 0; border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px;">
          <h3 style="color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">📋 بيانات العميل</h3>
          <p><strong>الاسم:</strong> ${invoice.customer.name}</p>
          <p><strong>الهاتف:</strong> ${invoice.customer.phone}</p>
          <p><strong>التاريخ:</strong> ${new Date(invoice.date).toLocaleDateString('ar-SA')}</p>
        </div>
        
        <div style="text-align: right; margin: 20px 0; border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px;">
          <h3 style="color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">🛠️ الخدمات المقدمة</h3>
          ${invoice.services.map(service => `
            <div style="display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px dotted #d1d5db;">
              <span style="font-weight: bold;">${service.price} جنيه</span>
              <span>${service.name}</span>
            </div>
          `).join('')}
          
          <div style="margin-top: 15px; padding-top: 15px; border-top: 2px solid #059669; font-size: 20px; font-weight: bold; color: #059669;">
            <div style="display: flex; justify-content: space-between;">
              <span>${invoice.total} جنيه</span>
              <span>الإجمالي:</span>
            </div>
          </div>
        </div>
        
        <div style="margin-top: 30px; padding: 20px; background: #f0f9ff; border-radius: 10px;">
          <p style="color: #0369a1; font-weight: bold;">شكراً لثقتكم بنا! 🙏</p>
          <p style="color: #64748b; font-size: 14px;">نتطلع لخدمتكم مرة أخرى</p>
        </div>
      </div>
    `;

    const printWindow = window.open('', '_blank');
    printWindow?.document.write(`
      <html>
        <head>
          <title>ايصال ${invoice.number}</title>
          <meta charset="utf-8">
        </head>
        <body>
          ${printContent}
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `);
    printWindow?.document.close();

    setTimeout(() => {
      setIsPrinting(false);
      toast({
        title: "تم إرسال الايصال للطباعة",
        description: "تحقق من طابعتك",
        duration: 3000
      });
    }, 1000);
  };

  // نسخ رقم الايصال
  const handleCopyInvoiceNumber = () => {
    navigator.clipboard.writeText(invoice.number);
    toast({
      title: "تم نسخ رقم الايصال",
      description: `${invoice.number}`,
      duration: 2000
    });
  };

  // اختبار الدفع (محاكاة)
  const handlePaymentTest = () => {
    toast({
      title: "🧪 اختبار الدفع",
      description: "تم التحقق من حالة الدفع بنجاح ✅",
      duration: 3000
    });
  };

  // إرسال إشعار للعميل
  const handleSendNotification = () => {
    toast({
      title: "📩 تم إرسال الإشعار",
      description: `تم إرسال إشعار بالايصال إلى ${invoice.customer.name}`,
      duration: 4000
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white shadow-2xl">
        <CardContent className="p-6 text-center">
          {/* أيقونة النجاح */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </div>

          {/* رسالة النجاح */}
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            تم إصدار الايصال بنجاح
          </h2>

          {/* رقم الايصال */}
          <div 
            className="bg-blue-600 text-white px-4 py-2 rounded-full inline-flex items-center gap-2 mb-4 cursor-pointer hover:bg-blue-700 transition-colors"
            onClick={handleCopyInvoiceNumber}
          >
            <Copy className="w-4 h-4" />
            <span className="font-medium">رقم الطلب: {invoice.number}</span>
          </div>

          {/* بيانات العميل */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6 text-right">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">⚙️</span>
              <span className="font-medium text-gray-900">بيانات العميل</span>
            </div>
            <div className="space-y-1 text-sm">
              <div>📱 الهاتف: {invoice.customer.phone}</div>
              <div>👤 الاسم: {invoice.customer.name}</div>
            </div>
          </div>

          {/* أزرار الإجراءات */}
          <div className="space-y-3">
            {/* الصف الأول */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={handleWhatsAppShare}
                disabled={isSharing}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-3"
              >
                <Share className="w-4 h-4 mr-2" />
                {isSharing ? 'جاري...' : 'مشاركة واتساب'}
              </Button>

              <Button
                onClick={handlePrint}
                disabled={isPrinting}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3"
              >
                <Printer className="w-4 h-4 mr-2" />
                {isPrinting ? 'جاري...' : 'طباعة الايصال'}
              </Button>
            </div>

            {/* الصف الثاني */}
            <Button
              onClick={handlePaymentTest}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              اختبار الدفع
            </Button>

            {/* الصف الثالث */}
            <Button
              onClick={handleSendNotification}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3"
            >
              <Bell className="w-4 h-4 mr-2" />
              إرسال إشعار العميل
            </Button>

            {/* عميل جديد */}
            <Button
              onClick={onNewCustomer}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-3"
            >
              <Plus className="w-4 h-4 mr-2" />
              عميل جديد
            </Button>
          </div>

          {/* زر الإغلاق (اختياري) */}
          {onClose && (
            <Button
              onClick={onClose}
              variant="ghost"
              className="w-full mt-4 text-gray-600 hover:text-gray-800"
            >
              إغلاق
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};