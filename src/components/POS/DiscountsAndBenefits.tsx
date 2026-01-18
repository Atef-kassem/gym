import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Gift, 
  CreditCard, 
  Star, 
  Users, 
  Percent, 
  Calendar,
  CheckCircle,
  XCircle,
  Ticket
} from 'lucide-react';

interface DiscountsAndBenefitsProps {
  orderTotal: number;
  customerData: any;
  onApplyDiscount: (discount: any) => void;
  onNext: () => void;
  onBack: () => void;
  appliedDiscounts: any[];
}

const DiscountsAndBenefits: React.FC<DiscountsAndBenefitsProps> = ({
  orderTotal,
  customerData,
  onApplyDiscount,
  onNext,
  onBack,
  appliedDiscounts
}) => {
  const [activeTab, setActiveTab] = useState<'coupons' | 'subscriptions' | 'cards' | 'loyalty'>('coupons');
  const [couponCode, setCouponCode] = useState('');
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);

  // Mock data - في التطبيق الحقيقي ستأتي من قاعدة البيانات
  const mockCoupons = [
    { id: 1, code: 'WASH20', discount: 20, type: 'percentage', description: 'خصم 20% على خدمات ال ' },
    { id: 2, code: 'NEWCUSTOMER', discount: 50, type: 'fixed', description: 'خصم 50 جنيه للعملاء الجدد' },
    { id: 3, code: 'VIP30', discount: 30, type: 'percentage', description: 'خصم 30% للعملاء المميزين' }
  ];

  const mockSubscriptions = [
    { id: 1, name: 'اشتراك ال  الشهري', discount: 25, type: 'percentage', status: 'active', remaining: 8 },
    { id: 2, name: 'باقة العائلة', discount: 15, type: 'percentage', status: 'active', remaining: 12 },
    { id: 3, name: 'اشتراك الصيانة', discount: 20, type: 'percentage', status: 'expired', remaining: 0 }
  ];

  const mockCards = [
    { id: 1, name: 'بطاقة العضوية الذهبية', discount: 15, type: 'percentage', balance: 8, status: 'active' },
    { id: 2, name: 'بطاقة العضوية الفضية', discount: 10, type: 'percentage', balance: 5, status: 'active' },
    { id: 3, name: 'بطاقة مسبقة الدفع', discount: 0, type: 'prepaid', balance: 350, status: 'active' }
  ];

  const customerLoyaltyPoints = 1250;
  const pointValue = 0.1; // كل نقطة = 0.1 جنيه

  const handleApplyCoupon = () => {
    const coupon = mockCoupons.find(c => c.code.toLowerCase() === couponCode.toLowerCase());
    if (coupon) {
      onApplyDiscount({
        type: 'coupon',
        id: coupon.id,
        name: coupon.code,
        discount: coupon.discount,
        discountType: coupon.type,
        description: coupon.description
      });
      setCouponCode('');
    }
  };

  const handleApplyLoyaltyPoints = () => {
    if (loyaltyPoints > 0 && loyaltyPoints <= customerLoyaltyPoints) {
      const discountAmount = loyaltyPoints * pointValue;
      onApplyDiscount({
        type: 'loyalty',
        id: 'loyalty-points',
        name: `${loyaltyPoints} نقطة ولاء`,
        discount: discountAmount,
        discountType: 'fixed',
        description: `استخدام ${loyaltyPoints} نقطة ولاء`
      });
      setLoyaltyPoints(0);
    }
  };

  const tabs = [
    { id: 'coupons', name: 'الكوبونات', icon: Ticket },
    { id: 'subscriptions', name: 'الاشتراكات', icon: Calendar },
    { id: 'cards', name: 'البطاقات', icon: CreditCard },
    { id: 'loyalty', name: 'نقاط الولاء', icon: Star }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardTitle className="text-center text-xl">الكوبونات والخصومات والمزايا</CardTitle>
            <p className="text-center text-blue-100">اختر الخصومات والمزايا المتاحة قبل إتمام الدفع</p>
          </CardHeader>

          <CardContent className="p-6">
            {/* Applied Discounts Summary */}
            {appliedDiscounts.length > 0 && (
              <div className="mb-6">
                <h3 className="font-medium text-gray-800 mb-3">الخصومات المطبقة:</h3>
                <div className="space-y-2">
                  {appliedDiscounts.map((discount, index) => (
                    <div key={index} className="flex justify-between items-center bg-green-50 p-3 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">{discount.name}</span>
                        <Badge variant="secondary" className="text-xs">{discount.type}</Badge>
                      </div>
                      <span className="text-green-600 font-bold">
                        {discount.discountType === 'percentage' ? `${discount.discount}%` : `${discount.discount} جنيه مصري`}
                      </span>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
              </div>
            )}

            {/* Tabs */}
            <div className="flex justify-center mb-6">
              <div className="bg-gray-100 p-1 rounded-lg flex">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        activeTab === tab.id
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {tab.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
              {/* Coupons Tab */}
              {activeTab === 'coupons' && (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-medium text-blue-800 mb-3">إدخال كود الكوبون</h3>
                    <div className="flex gap-3">
                      <Input
                        placeholder="أدخل كود الكوبون"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1"
                      />
                      <Button onClick={handleApplyCoupon} className="bg-blue-600 hover:bg-blue-700">
                        تطبيق
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-800 mb-3">الكوبونات المتاحة:</h3>
                    <div className="grid gap-3">
                      {mockCoupons.map((coupon) => (
                        <div key={coupon.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <Ticket className="h-4 w-4 text-blue-600" />
                                <span className="font-medium">{coupon.code}</span>
                                <Badge variant="outline" className="text-xs">
                                  {coupon.type === 'percentage' ? `${coupon.discount}%` : `${coupon.discount} جنيه مصري`}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">{coupon.description}</p>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => {
                                setCouponCode(coupon.code);
                                handleApplyCoupon();
                              }}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              تطبيق
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Subscriptions Tab */}
              {activeTab === 'subscriptions' && (
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-800">الاشتراكات النشطة:</h3>
                  <div className="grid gap-3">
                    {mockSubscriptions.map((subscription) => (
                      <div key={subscription.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Calendar className="h-4 w-4 text-purple-600" />
                              <span className="font-medium">{subscription.name}</span>
                              <Badge 
                                variant={subscription.status === 'active' ? 'default' : 'destructive'}
                                className="text-xs"
                              >
                                {subscription.status === 'active' ? 'نشط' : 'منتهي'}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">
                              خصم {subscription.discount}% - متبقي {subscription.remaining} استخدام
                            </p>
                          </div>
                          <Button
                            size="sm"
                            disabled={subscription.status !== 'active' || subscription.remaining === 0}
                            onClick={() => onApplyDiscount({
                              type: 'subscription',
                              id: subscription.id,
                              name: subscription.name,
                              discount: subscription.discount,
                              discountType: 'percentage',
                              description: `اشتراك - ${subscription.remaining} استخدام متبقي`
                            })}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            تطبيق
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cards Tab */}
              {activeTab === 'cards' && (
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-800">بطاقات العضوية:</h3>
                  <div className="grid gap-3">
                    {mockCards.map((card) => (
                      <div key={card.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <CreditCard className="h-4 w-4 text-yellow-600" />
                              <span className="font-medium">{card.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {card.type === 'prepaid' ? `رصيد: ${card.balance} جنيه مصري` : `خصم ${card.discount}%`}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">
                              {card.type === 'prepaid' 
                                ? `رصيد متاح: ${card.balance} جنيه`
                                : `خصم ${card.discount}% على جميع الخدمات - ${card.balance} استخدام متبقي`
                              }
                            </p>
                          </div>
                          <Button
                            size="sm"
                            disabled={card.status !== 'active' || card.balance === 0}
                            onClick={() => onApplyDiscount({
                              type: 'card',
                              id: card.id,
                              name: card.name,
                              discount: card.type === 'prepaid' ? Math.min(card.balance, orderTotal) : card.discount,
                              discountType: card.type === 'prepaid' ? 'fixed' : 'percentage',
                              description: card.type === 'prepaid' ? 'دفع من الرصيد المسبق' : `بطاقة عضوية - خصم ${card.discount}%`
                            })}
                            className="bg-yellow-600 hover:bg-yellow-700"
                          >
                            تطبيق
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Loyalty Points Tab */}
              {activeTab === 'loyalty' && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg border border-orange-200">
                    <div className="flex items-center gap-3 mb-3">
                      <Star className="h-6 w-6 text-orange-600" />
                      <div>
                        <h3 className="font-medium text-orange-800">نقاط الولاء المتاحة</h3>
                        <p className="text-sm text-orange-600">لديك {customerLoyaltyPoints} نقطة</p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 mb-3">
                      كل نقطة = {pointValue} جنيه • الحد الأقصى للاستخدام: {Math.min(customerLoyaltyPoints, Math.floor(orderTotal / pointValue))} نقطة
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <Label className="block mb-2">عدد النقاط المراد استخدامها:</Label>
                    <div className="flex gap-3 items-center">
                      <Input
                        type="number"
                        min="0"
                        max={Math.min(customerLoyaltyPoints, Math.floor(orderTotal / pointValue))}
                        value={loyaltyPoints}
                        onChange={(e) => setLoyaltyPoints(parseInt(e.target.value) || 0)}
                        placeholder="عدد النقاط"
                        className="flex-1"
                      />
                      <span className="text-sm text-gray-600 min-w-[100px]">
                        = {(loyaltyPoints * pointValue).toFixed(2)} جنيه مصري
                      </span>
                      <Button
                        onClick={handleApplyLoyaltyPoints}
                        disabled={loyaltyPoints === 0 || loyaltyPoints > customerLoyaltyPoints}
                        className="bg-orange-600 hover:bg-orange-700"
                      >
                        تطبيق
                      </Button>
                    </div>
                    
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setLoyaltyPoints(Math.min(100, customerLoyaltyPoints))}
                      >
                        100 نقطة
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setLoyaltyPoints(Math.min(500, customerLoyaltyPoints))}
                      >
                        500 نقطة
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setLoyaltyPoints(Math.min(customerLoyaltyPoints, Math.floor(orderTotal / pointValue)))}
                      >
                        الحد الأقصى
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t">
              <Button variant="outline" onClick={onBack} className="px-6">
                ← السابق
              </Button>
              
              <div className="text-center">
                <div className="text-sm text-gray-600">المجموع بعد الخصم</div>
                <div className="text-2xl font-bold text-green-600">
                  {orderTotal.toFixed(2)} جنيه مصري
                </div>
              </div>
              
              <Button onClick={onNext} className="bg-blue-600 hover:bg-blue-700 px-6">
                المتابعة للدفع ←
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DiscountsAndBenefits;