import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, ArrowRight, Plus, Minus, Car, Package, Droplet } from 'lucide-react';

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  type: 'service' | 'product';
}

interface Step2Props {
  customerData: any;
  vehicleData: any;
  onNext: (orderItems: OrderItem[]) => void;
  onBack: () => void;
}

const Step2ServicesSelection: React.FC<Step2Props> = ({ 
  customerData, 
  vehicleData, 
  onNext, 
  onBack 
}) => {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [activeTab, setActiveTab] = useState('services');

  // Sample services data
  const services = [
    { id: 1, name: '  خارجي', price: 25, duration: '15 دقيقة' },
    { id: 2, name: '  داخلي', price: 35, duration: '20 دقيقة' },
    { id: 3, name: 'تلميع المشروب', price: 40, duration: '30 دقيقة' },
    { id: 4, name: 'تنظيف المحرك', price: 50, duration: '25 دقيقة' },
    { id: 5, name: '  شامل', price: 80, duration: '45 دقيقة' }
  ];

  const products = [
    { id: 101, name: 'معطر مشروب', price: 15 },
    { id: 102, name: 'منظف زجاج', price: 20 },
    { id: 103, name: 'شامبو مشروب', price: 25 },
    { id: 104, name: 'ملمع إطارات', price: 30 }
  ];

  const addToOrder = (item: any, type: 'service' | 'product') => {
    const orderItem: OrderItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      type
    };

    setOrderItems(prev => {
      const existingIndex = prev.findIndex(i => i.id === item.id && i.type === type);
      if (existingIndex >= 0) {
        const newItems = [...prev];
        newItems[existingIndex].quantity += 1;
        return newItems;
      }
      return [...prev, orderItem];
    });
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      setOrderItems(prev => prev.filter(item => item.id !== id));
    } else {
      setOrderItems(prev => 
        prev.map(item => 
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleNext = () => {
    if (orderItems.length === 0) {
      alert('يرجى اختيار خدمة واحدة على الأقل');
      return;
    }
    onNext(orderItems);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">اختيار الخدمات والمنتجات</h1>
          <div className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
            الخطوة 2 من 4
          </div>
        </div>

        {/* Customer Info Summary */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{customerData.name}</h3>
                <p className="text-sm text-gray-600">{customerData.phone}</p>
              </div>
              <div>
                <h3 className="font-medium">{vehicleData.plateNumber}</h3>
                <p className="text-sm text-gray-600">{vehicleData.make} {vehicleData.model}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Services Selection */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>اختر الخدمات والمنتجات</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="services" className="flex items-center gap-2">
                      <Car className="h-4 w-4" />
                      الخدمات
                    </TabsTrigger>
                    <TabsTrigger value="products" className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      المنتجات
                    </TabsTrigger>
                    <TabsTrigger value="oils" className="flex items-center gap-2">
                      <Droplet className="h-4 w-4" />
                      الزيوت
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="services" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {services.map(service => (
                        <Card key={service.id} className="cursor-pointer hover:bg-gray-50">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-medium">{service.name}</h3>
                              <span className="text-green-600 font-bold">{service.price} جنيه مصري</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{service.duration}</p>
                            <Button 
                              onClick={() => addToOrder(service, 'service')}
                              className="w-full"
                              size="sm"
                            >
                              <Plus className="h-4 w-4 ml-2" />
                              إضافة
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="products" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {products.map(product => (
                        <Card key={product.id} className="cursor-pointer hover:bg-gray-50">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-medium">{product.name}</h3>
                              <span className="text-green-600 font-bold">{product.price} جنيه مصري</span>
                            </div>
                            <Button 
                              onClick={() => addToOrder(product, 'product')}
                              className="w-full"
                              size="sm"
                            >
                              <Plus className="h-4 w-4 ml-2" />
                              إضافة
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="oils" className="mt-4">
                    <div className="text-center py-8">
                      <p className="text-gray-500">قسم الزيوت قيد التطوير</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader className="bg-green-50">
                <CardTitle className="text-green-800">ملخص الطلب</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {orderItems.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">لم يتم اختيار أي عناصر بعد</p>
                ) : (
                  <div className="space-y-3">
                    {orderItems.map(item => (
                      <div key={`${item.id}-${item.type}`} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{item.name}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {item.type === 'service' ? 'خدمة' : 'منتج'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm w-8 text-center">{item.quantity}</span>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-sm font-medium text-green-600 min-w-[60px] text-left">
                          {(item.price * item.quantity).toFixed(2)} جنيه مصري
                        </div>
                      </div>
                    ))}
                    
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between font-bold text-lg">
                        <span>المجموع:</span>
                        <span className="text-green-600">{calculateTotal().toFixed(2)} جنيه مصري</span>
                      </div>
                    </div>
                  </div>
                )}
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
            disabled={orderItems.length === 0}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8"
          >
            التالي: الخصومات والمزايا
            <ArrowRight className="h-4 w-4 mr-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Step2ServicesSelection;