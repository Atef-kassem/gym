import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Percent, Gift, Crown } from 'lucide-react';

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  type: 'service' | 'product';
}

interface Discount {
  id: string;
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
  condition?: string;
}

interface Step3Props {
  customerData: any;
  vehicleData: any;
  orderItems: OrderItem[];
  onNext: (appliedDiscounts: Discount[]) => void;
  onBack: () => void;
}

const Step3Discounts: React.FC<Step3Props> = ({
  customerData,
  vehicleData,
  orderItems,
  onNext,
  onBack
}) => {
  const [appliedDiscounts, setAppliedDiscounts] = useState<Discount[]>([]);
  const [customDiscount, setCustomDiscount] = useState({
    type: 'percentage' as 'percentage' | 'fixed',
    value: 0
  });

  // Available discounts
  const availableDiscounts: Discount[] = [
    { id: 'loyalty', name: 'خصم العضوية الذهبية', type: 'percentage', value: 15, condition: 'للعملاء المميزين' },
    { id: 'first_time', name: 'خصم العميل الجديد', type: 'percentage', value: 10, condition: 'للعملاء الجدد' },
    { id: 'weekend', name: 'خصم نهاية الأسبوع', type: 'fixed', value: 20, condition: 'صالح خلال عطلة نهاية الأسبوع' },
    { id: 'bulk', name: 'خصم الكمية', type: 'percentage', value: 5, condition: 'عند شراء 3 خدمات أو أكثر' }
  ];

  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const calculateDiscountAmount = (discount: Discount) => {
    if (discount.type === 'percentage') {
      return (subtotal * discount.value) / 100;
    }
    return discount.value;
  };

  const calculateTotal = () => {
    let total = subtotal;
    appliedDiscounts.forEach(discount => {
      total -= calculateDiscountAmount(discount);
    });
    return Math.max(0, total);
  };

  const applyDiscount = (discount: Discount) => {
    if (!appliedDiscounts.find(d => d.id === discount.id)) {
      setAppliedDiscounts(prev => [...prev, discount]);
    }
  };

  const removeDiscount = (discountId: string) => {
    setAppliedDiscounts(prev => prev.filter(d => d.id !== discountId));
  };

  const addCustomDiscount = () => {
    if (customDiscount.value > 0) {
      const newDiscount: Discount = {
        id: 'custom-' + Date.now(),
        name: `خصم إداري ${customDiscount.value}${customDiscount.type === 'percentage' ? '%' : ' جنيه مصري'}`,
        type: customDiscount.type,
        value: customDiscount.value
      };
      setAppliedDiscounts(prev => [...prev, newDiscount]);
      setCustomDiscount({ type: 'percentage', value: 0 });
    }
  };

  const handleNext = () => {
    onNext(appliedDiscounts);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">الخصومات والمزايا</h1>
          <div className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
            الخطوة 3 من 4
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Available Discounts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Automatic Discounts */}
            <Card>
              <CardHeader className="bg-purple-50">
                <CardTitle className="flex items-center gap-2 text-purple-800">
                  <Gift className="h-5 w-5" />
                  الخصومات المتاحة
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableDiscounts.map(discount => (
                    <Card key={discount.id} className="border-2 border-gray-200 hover:border-purple-300 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">{discount.name}</h3>
                          <Badge variant="secondary">
                            {discount.type === 'percentage' ? `${discount.value}%` : `${discount.value} جنيه مصري`}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{discount.condition}</p>
                        <Button 
                          onClick={() => applyDiscount(discount)}
                          disabled={appliedDiscounts.some(d => d.id === discount.id)}
                          className="w-full"
                          size="sm"
                        >
                          {appliedDiscounts.some(d => d.id === discount.id) ? 'مُطبق' : 'تطبيق الخصم'}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Custom Discount */}
            <Card>
              <CardHeader className="bg-orange-50">
                <CardTitle className="flex items-center gap-2 text-orange-800">
                  <Percent className="h-5 w-5" />
                  خصم إداري مخصص
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div>
                    <Label htmlFor="discountType">نوع الخصم</Label>
                    <select 
                      id="discountType"
                      className="w-full p-2 border rounded-md"
                      value={customDiscount.type}
                      onChange={(e) => setCustomDiscount(prev => ({ ...prev, type: e.target.value as 'percentage' | 'fixed' }))}
                    >
                      <option value="percentage">نسبة مئوية (%)</option>
                      <option value="fixed">مبلغ ثابت (جنيه مصري)</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="discountValue">قيمة الخصم</Label>
                    <Input
                      id="discountValue"
                      type="number"
                      min="0"
                      max={customDiscount.type === 'percentage' ? 100 : subtotal}
                      value={customDiscount.value}
                      onChange={(e) => setCustomDiscount(prev => ({ ...prev, value: parseFloat(e.target.value) || 0 }))}
                      placeholder="0"
                    />
                  </div>
                  
                  <Button onClick={addCustomDiscount} disabled={customDiscount.value <= 0}>
                    إضافة خصم
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary with Discounts */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader className="bg-green-50">
                <CardTitle className="text-green-800">ملخص الطلب</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {/* Customer Info */}
                <div className="p-3 bg-gray-50 rounded">
                  <h3 className="font-medium text-sm">{customerData.name}</h3>
                  <p className="text-xs text-gray-600">{vehicleData.plateNumber}</p>
                </div>

                {/* Order Items */}
                <div className="space-y-2">
                  {orderItems.map(item => (
                    <div key={`${item.id}-${item.type}`} className="flex justify-between text-sm">
                      <span>{item.name} × {item.quantity}</span>
                      <span>{(item.price * item.quantity).toFixed(2)} جنيه مصري</span>
                    </div>
                  ))}
                </div>

                {/* Subtotal */}
                <div className="border-t pt-2">
                  <div className="flex justify-between">
                    <span>المجموع الفرعي:</span>
                    <span>{subtotal.toFixed(2)} جنيه مصري</span>
                  </div>
                </div>

                {/* Applied Discounts */}
                {appliedDiscounts.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-green-700">الخصومات المطبقة:</h4>
                    {appliedDiscounts.map(discount => (
                      <div key={discount.id} className="flex items-center justify-between text-sm bg-green-50 p-2 rounded">
                        <span className="flex-1">{discount.name}</span>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => removeDiscount(discount.id)}
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                        >
                          ×
                        </Button>
                        <span className="text-green-600 font-medium min-w-[60px] text-left">
                          -{calculateDiscountAmount(discount).toFixed(2)} جنيه مصري
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Total */}
                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>الإجمالي:</span>
                    <span className="text-green-600">{calculateTotal().toFixed(2)} جنيه مصري</span>
                  </div>
                  {appliedDiscounts.length > 0 && (
                    <div className="text-xs text-gray-600 mt-1">
                      وفرت: {(subtotal - calculateTotal()).toFixed(2)} جنيه مصري
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-6">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 ml-2" />
            السابق
          </Button>
          
          <Button 
            onClick={handleNext}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8"
          >
            التالي: الدفع
            <ArrowRight className="h-4 w-4 mr-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Step3Discounts;