import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Receipt, CheckCircle, Phone, Printer, MessageCircle } from 'lucide-react';

const WorkingPOSSystem: React.FC = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedServices, setSelectedServices] = useState<any[]>([]);

  // Sample services
  const services = [
    { id: 1, name: '  خارجي', price: 25 },
    { id: 2, name: '  داخلي', price: 35 },
    { id: 3, name: 'تلميع المشروب', price: 40 },
  ];

  const addService = (service: any) => {
    setSelectedServices(prev => [...prev, service]);
  };

  const total = selectedServices.reduce((sum, service) => sum + service.price, 0);

  const handlePayment = () => {
    console.log('🚀 Payment button clicked - WORKING!');
    setShowSuccess(true);
  };

  const handleNewCustomer = () => {
    setShowSuccess(false);
    setCustomerName('');
    setCustomerPhone('');
    setSelectedServices([]);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center p-4" dir="rtl">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center bg-green-100">
            <CardTitle className="flex items-center justify-center gap-3 text-green-800 text-2xl">
              <CheckCircle className="h-8 w-8" />
              تم الدفع بنجاح!
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 text-center">
            {/* Invoice Details */}
            <div className="bg-white border-2 border-green-200 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-bold mb-4">ايصال رقم: INV-{Date.now()}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>العميل:</span>
                  <span>{customerName || 'عميل'}</span>
                </div>
                <div className="flex justify-between">
                  <span>الجوال:</span>
                  <span>{customerPhone || '050xxxxxxx'}</span>
                </div>
                <Separator className="my-3" />
                {selectedServices.map((service, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{service.name}</span>
                    <span>{service.price} جنيه مصري</span>
                  </div>
                ))}
                <Separator className="my-3" />
                <div className="flex justify-between font-bold text-lg">
                  <span>الإجمالي:</span>
                  <span className="text-green-600">{total} جنيه مصري</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Printer className="h-5 w-5 ml-2" />
                طباعة الايصال
              </Button>
              
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <MessageCircle className="h-5 w-5 ml-2" />
                إرسال واتساب
              </Button>
              
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <Phone className="h-5 w-5 ml-2" />
                إشعار SMS
              </Button>
            </div>

            <Button 
              onClick={handleNewCustomer}
              size="lg"
              className="bg-orange-600 hover:bg-orange-700 text-white px-8"
            >
              عميل جديد
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">نظام نقاط البيع المبسط</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Customer & Services */}
          <div className="space-y-6">
            {/* Customer Info */}
            <Card>
              <CardHeader className="bg-blue-50">
                <CardTitle className="text-blue-800">بيانات العميل</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <Label>اسم العميل</Label>
                  <Input 
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="أدخل اسم العميل"
                  />
                </div>
                <div>
                  <Label>رقم الجوال</Label>
                  <Input 
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="05xxxxxxxx"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Services */}
            <Card>
              <CardHeader className="bg-green-50">
                <CardTitle className="text-green-800">الخدمات المتاحة</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 gap-3">
                  {services.map(service => (
                    <Button
                      key={service.id}
                      variant="outline"
                      onClick={() => addService(service)}
                      className="justify-between h-auto p-4"
                    >
                      <span className="font-medium">{service.name}</span>
                      <Badge variant="secondary">{service.price} جنيه مصري</Badge>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary & Payment */}
          <div>
            <Card className="sticky top-4">
              <CardHeader className="bg-orange-50">
                <CardTitle className="text-orange-800">ملخص الطلب</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {selectedServices.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">لم يتم اختيار خدمات بعد</p>
                ) : (
                  <div className="space-y-4">
                    {/* Services List */}
                    <div className="space-y-3">
                      {selectedServices.map((service, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <span className="font-medium">{service.name}</span>
                          <span className="text-green-600 font-bold">{service.price} جنيه مصري</span>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    {/* Total */}
                    <div className="flex justify-between items-center text-xl font-bold">
                      <span>الإجمالي:</span>
                      <span className="text-green-600">{total} جنيه مصري</span>
                    </div>

                    {/* Payment Button */}
                    <Button 
                      onClick={handlePayment}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-4 text-lg font-bold"
                      size="lg"
                    >
                      <Receipt className="h-6 w-6 ml-2" />
                      إتمام الدفع وإصدار الايصال
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkingPOSSystem;