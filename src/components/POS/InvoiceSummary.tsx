import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, Banknote, Smartphone, Receipt, AlertTriangle, Gift, Percent, Tag } from 'lucide-react';
import { OrderItem } from '@/types/pos';
import { useToast } from '@/hooks/use-toast';

interface InvoiceSummaryProps {
  orderItems: OrderItem[];
  updateQuantity: (id: number, quantity: number) => void;
  removeItem: (id: number) => void;
  onCheckout: (paymentData: any) => void;
  customerData?: any;
  vehicleData?: any;
  appliedDiscounts?: any[];
  finalTotal?: number;
  onGoToDiscounts?: () => void;
}

const InvoiceSummary: React.FC<InvoiceSummaryProps> = ({
  orderItems,
  updateQuantity,
  removeItem,
  onCheckout,
  customerData,
  vehicleData,
  appliedDiscounts = [],
  finalTotal,
  onGoToDiscounts
}) => {
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState('');

  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = (subtotal * discount) / 100;
  const taxRate = 15; // 15% VAT
  const taxAmount = ((subtotal - discountAmount) * taxRate) / 100;
  const total = finalTotal !== undefined ? finalTotal : (subtotal - discountAmount + taxAmount);

  const paymentMethods = [
    { id: 'cash', name: 'نقداً', icon: Banknote },
    { id: 'card', name: 'مدى', icon: CreditCard },
    { id: 'apple-pay', name: 'Apple Pay', icon: Smartphone },
    { id: 'credit', name: 'آجل', icon: Receipt },
  ];

  const handleCheckout = () => {
    const paymentData = {
      orderItems,
      paymentMethod,
      subtotal,
      discount: discountAmount,
      tax: taxAmount,
      total,
      customerData,
      vehicleData,
      couponCode
    };
    onCheckout(paymentData);
  };

  // Handle item deletion with confirmation
  const handleDeleteItem = (item: OrderItem) => {
    if (window.confirm(`هل أنت متأكد من حذف "${item.name}" من الطلب؟`)) {
      removeItem(item.id);
      toast({
        title: "تم حذف العنصر",
        description: `تم حذف "${item.name}" من الطلب`,
        variant: "destructive"
      });
    }
  };

  // Clear all items with confirmation
  const handleClearAll = () => {
    if (orderItems.length === 0) return;
    
    if (window.confirm(`هل أنت متأكد من حذف جميع العناصر (${orderItems.length} عنصر) من الطلب؟`)) {
      orderItems.forEach(item => removeItem(item.id));
      toast({
        title: "تم مسح الطلب",
        description: "تم حذف جميع العناصر من الطلب",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="h-fit sticky top-6" dir="rtl">
      <CardHeader className="bg-green-50">
        <CardTitle className="flex items-center justify-between text-green-700">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            ملخص الطلب
          </div>
          {orderItems.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 ml-1" />
              مسح الكل
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4 space-y-4">

        {/* قائمة العناصر */}
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {orderItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              لا توجد عناصر في الطلب
            </div>
          ) : (
            <>
              {/* Header للجدول */}
              <div className="bg-gray-100 p-3 rounded-lg border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700 text-sm">الخدمة/المنتج</span>
                  <span className="font-medium text-gray-700 text-sm">القيمة</span>
                </div>
              </div>
              
              {orderItems.map((item) => (
                <div key={item.id} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-sm">{item.name}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteItem(item)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0"
                      title="حذف العنصر"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="h-6 w-6 p-0"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="font-medium min-w-[2ch] text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-6 w-6 p-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <div className="text-left">
                      <div className="font-bold text-green-600">
                        {(item.price * item.quantity).toFixed(2)} جنيه مصري
                      </div>
                      <div className="text-xs text-gray-500">
                        {item.price} × {item.quantity}
                      </div>
                    </div>
                  </div>
                  
                  {item.type === 'service' && item.duration && (
                    <Badge variant="secondary" className="mt-1 text-xs">
                      {item.duration} دقيقة
                    </Badge>
                  )}
                </div>
              ))}
            </>
          )}
        </div>

        {orderItems.length > 0 && (
          <>
            <Separator />

            {/* ملخص المبالغ */}
            <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between text-sm">
                <span>المجموع الفرعي:</span>
                <span>{subtotal.toFixed(2)} جنيه مصري</span>
              </div>
              
              {appliedDiscounts.length > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>إجمالي الخصومات:</span>
                  <span>-{(subtotal - (finalTotal || total)).toFixed(2)} جنيه مصري</span>
                </div>
              )}
              
              <div className="flex justify-between text-sm">
                <span>ضريبة القيمة المضافة ({taxRate}%):</span>
                <span>{taxAmount.toFixed(2)} جنيه مصري</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between font-bold text-lg">
                <span>الإجمالي:</span>
                <span className="text-green-600">{total.toFixed(2)} جنيه مصري</span>
              </div>
            </div>

            {/* زر الانتقال للخصومات والمزايا */}
            <div className="space-y-3">
              {onGoToDiscounts && (
                <Button
                  onClick={onGoToDiscounts}
                  variant="outline"
                  className="w-full bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 text-purple-700 hover:bg-purple-100 hover:border-purple-300 transition-all duration-200"
                >
                  <div className="flex items-center justify-center gap-2">
                    <div className="flex items-center gap-1">
                      <Gift className="h-4 w-4" />
                      <Percent className="h-3 w-3" />
                      <Tag className="h-4 w-4" />
                    </div>
                    <span className="font-medium">الخصومات والمزايا</span>
                  </div>
                </Button>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default InvoiceSummary;