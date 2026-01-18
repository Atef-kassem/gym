import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { 
  CreditCard, 
  Banknote, 
  Smartphone, 
  QrCode, 
  Wallet,
  ArrowLeft, 
  Receipt,
  Calculator
} from 'lucide-react';

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
}

interface Step4Props {
  customerData: any;
  vehicleData: any;
  orderItems: OrderItem[];
  appliedDiscounts: Discount[];
  finalTotal: number;
  onBack: () => void;
  onPaymentComplete: (paymentData: any) => void;
}

const Step4Payment: React.FC<Step4Props> = ({
  customerData,
  vehicleData,
  orderItems,
  appliedDiscounts,
  finalTotal,
  onBack,
  onPaymentComplete
}) => {
  const [paymentMode, setPaymentMode] = useState<'unified' | 'split'>('unified');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cash');
  const [splitPayments, setSplitPayments] = useState([
    { method: 'cash', amount: 0, label: 'نقدي' },
    { method: 'card', amount: 0, label: 'بطاقة' }
  ]);

  const paymentMethods = [
    { id: 'cash', name: 'نقدي', icon: Banknote, color: 'bg-green-100 text-green-700' },
    { id: 'card', name: 'بطاقة ائتمان/مدى', icon: CreditCard, color: 'bg-blue-100 text-blue-700' },
    { id: 'apple_pay', name: 'Apple Pay', icon: Smartphone, color: 'bg-gray-100 text-gray-700' },
    { id: 'stc_pay', name: 'STC Pay', icon: QrCode, color: 'bg-purple-100 text-purple-700' },
    { id: 'mada', name: 'مدى Pay', icon: Wallet, color: 'bg-orange-100 text-orange-700' }
  ];

  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = subtotal - finalTotal;
  const taxAmount = finalTotal * 0.15;
  const totalWithTax = finalTotal + taxAmount;

  const handleSplitAmountChange = (index: number, amount: number) => {
    const newSplitPayments = [...splitPayments];
    newSplitPayments[index].amount = amount;
    setSplitPayments(newSplitPayments);
  };

  const getTotalSplitAmount = () => {
    return splitPayments.reduce((sum, payment) => sum + payment.amount, 0);
  };

  const handleProcessPayment = () => {
    console.log('Processing payment...');
    
    const paymentData = {
      mode: paymentMode,
      method: paymentMode === 'unified' ? selectedPaymentMethod : 'split',
      splitPayments: paymentMode === 'split' ? splitPayments : [],
      total: totalWithTax,
      orderItems,
      customerData,
      vehicleData,
      appliedDiscounts,
      invoiceNumber: `INV-${Date.now()}`,
      timestamp: new Date().toISOString(),
      success: true
    };
    
    console.log('Payment data:', paymentData);
    onPaymentComplete(paymentData);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">مراجعة الطلب والدفع</h1>
          <div className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
            الخطوة 4 من 4
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Summary */}
          <Card>
            <CardHeader className="bg-blue-50">
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Receipt className="h-5 w-5" />
                ملخص الطلب
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {/* Customer & Vehicle Info */}
              <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-800 mb-1">بيانات العميل</h3>
                  <p className="text-sm text-gray-600">{customerData.name}</p>
                  <p className="text-sm text-gray-600">{customerData.phone}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-1">بيانات المركبة</h3>
                  <p className="text-sm text-gray-600">{vehicleData.plateNumber}</p>
                  <p className="text-sm text-gray-600">{vehicleData.make} {vehicleData.model}</p>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-3 mb-4">
                <h3 className="font-medium text-gray-800">العناصر المطلوبة</h3>
                {orderItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div className="flex-1">
                      <span className="font-medium text-sm">{item.name}</span>
                      <div className="text-xs text-gray-500">
                        {item.price} × {item.quantity}
                      </div>
                    </div>
                    <span className="font-bold text-green-600">
                      {(item.price * item.quantity).toFixed(2)} جنيه مصري
                    </span>
                  </div>
                ))}
              </div>

              {/* Applied Discounts */}
              {appliedDiscounts.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-medium text-gray-800 mb-2">الخصومات المطبقة</h3>
                  {appliedDiscounts.map((discount, index) => (
                    <div key={index} className="flex justify-between text-sm bg-green-50 p-2 rounded border border-green-200">
                      <span className="text-green-700">{discount.name}</span>
                      <span className="text-green-600 font-medium">
                        -{discount.type === 'percentage' 
                          ? ((subtotal * discount.value) / 100).toFixed(2)
                          : discount.value.toFixed(2)
                        } جنيه مصري
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Total Summary */}
              <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span>المجموع الفرعي:</span>
                  <span>{subtotal.toFixed(2)} جنيه مصري</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>إجمالي الخصومات:</span>
                    <span>-{discountAmount.toFixed(2)} جنيه مصري</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span>المجموع بعد الخصم:</span>
                  <span>{finalTotal.toFixed(2)} جنيه مصري</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>ضريبة القيمة المضافة (15%):</span>
                  <span>{taxAmount.toFixed(2)} جنيه مصري</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>الإجمالي النهائي:</span>
                  <span className="text-green-600">{totalWithTax.toFixed(2)} جنيه مصري</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Section */}
          <Card>
            <CardHeader className="bg-green-50">
              <CardTitle className="flex items-center gap-2 text-green-800">
                <CreditCard className="h-5 w-5" />
                طريقة الدفع
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {/* Payment Mode Selection */}
              <div className="mb-6">
                <Label className="text-base font-medium mb-3 block">نوع الدفع</Label>
                <RadioGroup value={paymentMode} onValueChange={(value: 'unified' | 'split') => setPaymentMode(value)}>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="unified" id="unified" />
                    <Label htmlFor="unified" className="flex items-center gap-2 cursor-pointer">
                      <Receipt className="h-4 w-4" />
                      دفع موحد
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="split" id="split" />
                    <Label htmlFor="split" className="flex items-center gap-2 cursor-pointer">
                      <Calculator className="h-4 w-4" />
                      تقسيم الدفع
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Unified Payment */}
              {paymentMode === 'unified' && (
                <div className="space-y-4">
                  <Label className="text-base font-medium">اختر طريقة الدفع</Label>
                  <div className="grid grid-cols-1 gap-3">
                    {paymentMethods.map((method) => {
                      const Icon = method.icon;
                      return (
                        <Button
                          key={method.id}
                          variant={selectedPaymentMethod === method.id ? "default" : "outline"}
                          onClick={() => setSelectedPaymentMethod(method.id)}
                          className="justify-start h-auto p-4"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${method.color}`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <span className="font-medium">{method.name}</span>
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Split Payment */}
              {paymentMode === 'split' && (
                <div className="space-y-4">
                  <Label className="text-base font-medium">تقسيم المبلغ</Label>
                  {splitPayments.map((payment, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Label className="min-w-[80px] text-sm">{payment.label}:</Label>
                      <Input
                        type="number"
                        min="0"
                        max={totalWithTax}
                        step="0.01"
                        value={payment.amount}
                        onChange={(e) => handleSplitAmountChange(index, parseFloat(e.target.value) || 0)}
                        className="flex-1"
                        placeholder="0.00"
                      />
                      <span className="text-sm text-gray-500">جنيه مصري</span>
                    </div>
                  ))}
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between text-sm mb-1">
                      <span>المجموع المقسم:</span>
                      <span>{getTotalSplitAmount().toFixed(2)} جنيه مصري</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>المطلوب:</span>
                      <span>{totalWithTax.toFixed(2)} جنيه مصري</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium mt-2">
                      <span>المتبقي:</span>
                      <span className={`${(totalWithTax - getTotalSplitAmount()) > 0.01 ? 'text-red-600' : 'text-green-600'}`}>
                        {(totalWithTax - getTotalSplitAmount()).toFixed(2)} جنيه مصري
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Process Payment Button */}
              <Button
                onClick={handleProcessPayment}
                className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-4 text-lg font-bold"
                size="lg"
              >
                <Receipt className="h-5 w-5 ml-2" />
                إتمام الدفع وإصدار الايصال
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-6">
          <Button variant="outline" onClick={onBack} className="px-6">
            <ArrowLeft className="h-4 w-4 ml-2" />
            السابق
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Step4Payment;