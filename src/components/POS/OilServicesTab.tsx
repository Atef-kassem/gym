import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Wrench, Info, Zap, AlertTriangle } from 'lucide-react';

interface OilServicesTabProps {
  addToOrder: (item: any, type: 'service' | 'product') => void;
  vehicleData?: any;
}

const oilTypes = [
  { 
    id: '5w30', 
    name: '5W30 - زيت اصطناعي بالكامل', 
    price: 120, 
    recommended: ['سيدان', 'هاتشباك'],
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=300&h=200&fit=crop'
  },
  { 
    id: '10w40', 
    name: '10W40 - زيت شبه اصطناعي', 
    price: 85, 
    recommended: ['SUV', 'شاحنة صغيرة'],
    image: 'https://images.unsplash.com/photo-1465379944081-7f47de8d74ac?w=300&h=200&fit=crop'
  },
  { 
    id: '0w20', 
    name: '0W20 - زيت اصطناعي متطور', 
    price: 150, 
    recommended: ['كوبيه'],
    image: 'https://images.unsplash.com/photo-1501286353178-1ec881214838?w=300&h=200&fit=crop'
  },
  { 
    id: '15w40', 
    name: '15W40 - زيت معدني', 
    price: 60, 
    recommended: ['شاحنة صغيرة'],
    image: 'https://images.unsplash.com/photo-1485833077593-4278bba3f11f?w=300&h=200&fit=crop'
  },
  { 
    id: '5w20', 
    name: '5W20 - زيت اصطناعي خفيف', 
    price: 110, 
    recommended: ['سيدان', 'هاتشباك'],
    image: 'https://images.unsplash.com/photo-1438565434616-3ef039228b15?w=300&h=200&fit=crop'
  }
];

const additionalServices = [
  { id: 'oil-filter', name: 'فلتر زيت', price: 35, duration: 5, essential: true },
  { id: 'air-filter', name: 'فلتر هواء', price: 45, duration: 10, essential: false },
  { id: 'cabin-filter', name: 'فلتر مكيف', price: 55, duration: 15, essential: false },
  { id: 'gasket', name: 'جوان تصريف', price: 15, duration: 5, essential: true },
  { id: 'engine-flush', name: '  المحرك', price: 80, duration: 20, essential: false }
];

const OilServicesTab: React.FC<OilServicesTabProps> = ({ addToOrder, vehicleData }) => {
  const [selectedOilType, setSelectedOilType] = useState('');
  const [oilQuantity, setOilQuantity] = useState(4);
  const [selectedServices, setSelectedServices] = useState<string[]>(['oil-filter', 'gasket']);

  // تحديد الزيت المناسب حسب نوع المشروب
  const getRecommendedOil = () => {
    if (!vehicleData?.vehicleType) return null;
    return oilTypes.find(oil => 
      oil.recommended.includes(vehicleData.vehicleType)
    );
  };

  // تحديد الكمية المناسبة حسب نوع المشروب
  const getRecommendedQuantity = () => {
    if (!vehicleData?.vehicleType) return 4;
    
    const quantityMap: { [key: string]: number } = {
      'سيدان': 4,
      'هاتشباك': 3.5,
      'SUV': 6,
      'كوبيه': 4.5,
      'شاحنة صغيرة': 7
    };
    
    return quantityMap[vehicleData.vehicleType] || 4;
  };

  const recommendedOil = getRecommendedOil();
  const recommendedQuantity = getRecommendedQuantity();

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleAddOilService = () => {
    const selectedOil = oilTypes.find(oil => oil.id === selectedOilType);
    if (!selectedOil) return;

    // إضافة خدمة تغيير الزيت
    const oilService = {
      id: Date.now(),
      name: `تغيير زيت ${selectedOil.name}`,
      price: selectedOil.price * oilQuantity,
      quantity: 1,
      type: 'service',
      duration: 30,
      description: `${oilQuantity} لتر من ${selectedOil.name}`
    };

    addToOrder(oilService, 'service');

    // إضافة الخدمات الإضافية المختارة
    selectedServices.forEach(serviceId => {
      const service = additionalServices.find(s => s.id === serviceId);
      if (service) {
        const additionalService = {
          id: Date.now() + Math.random(),
          name: service.name,
          price: service.price,
          quantity: 1,
          type: 'service',
          duration: service.duration
        };
        addToOrder(additionalService, 'service');
      }
    });
  };

  React.useEffect(() => {
    setOilQuantity(recommendedQuantity);
  }, [recommendedQuantity]);

  return (
    <div className="space-y-6" dir="rtl">
      {/* معلومات المشروب والتوصيات */}
      {vehicleData && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <div className="flex justify-between items-center">
              <span>
                نوع المشروب: <strong>{vehicleData.vehicleType}</strong>
                {vehicleData.vehicleModel && ` - ${vehicleData.vehicleModel}`}
              </span>
              {recommendedOil && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  يُنصح بـ {recommendedOil.name}
                </Badge>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* قسم اختيار الزيت */}
        <Card>
          <CardHeader className="bg-blue-50">
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Wrench className="h-5 w-5" />
              اختيار نوع الزيت
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {/* نوع الزيت */}
            <div className="space-y-2">
              <Label>نوع الزيت ولزوجته</Label>
              <Select value={selectedOilType} onValueChange={setSelectedOilType}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع الزيت" />
                </SelectTrigger>
                <SelectContent>
                  {oilTypes.map((oil) => (
                    <SelectItem key={oil.id} value={oil.id}>
                      <div className="flex items-center gap-3 w-full">
                        {oil.image && (
                          <img 
                            src={oil.image} 
                            alt={oil.name}
                            className="w-8 h-8 rounded object-cover"
                          />
                        )}
                        <div className="flex justify-between items-center w-full">
                          <span>{oil.name}</span>
                          <span className="text-green-600 font-bold mr-4">{oil.price} رس/لتر</span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedOilType && recommendedOil && selectedOilType === recommendedOil.id && (
                <div className="flex items-center gap-2 text-green-600 text-sm">
                  <Zap className="h-4 w-4" />
                  <span>اختيار موصى به لنوع سيارتك</span>
                </div>
              )}
            </div>

            {/* الكمية */}
            <div className="space-y-2">
              <Label>الكمية (باللتر)</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="1"
                  max="10"
                  step="0.5"
                  value={oilQuantity}
                  onChange={(e) => setOilQuantity(parseFloat(e.target.value) || 1)}
                  className="w-24"
                />
                <span className="text-sm text-gray-600">لتر</span>
                {oilQuantity === recommendedQuantity && (
                  <Badge variant="outline" className="text-green-600 border-green-300">
                    الكمية الموصى بها
                  </Badge>
                )}
              </div>
            </div>

            {/* التكلفة */}
            {selectedOilType && (
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">تكلفة الزيت:</span>
                  <span className="font-bold text-green-600 text-lg">
                    {(oilTypes.find(oil => oil.id === selectedOilType)?.price || 0) * oilQuantity} جنيه مصري
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* قسم الخدمات الإضافية */}
        <Card>
          <CardHeader className="bg-orange-50">
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <Plus className="h-5 w-5" />
              خدمات إضافية
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {additionalServices.map((service) => (
              <div key={service.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedServices.includes(service.id)}
                    onChange={() => handleServiceToggle(service.id)}
                    className="rounded"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{service.name}</span>
                      {service.essential && (
                        <Badge variant="secondary" className="bg-red-100 text-red-800 text-xs">
                          <AlertTriangle className="h-3 w-3 ml-1" />
                          ضروري
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-gray-600">{service.duration} دقيقة</div>
                  </div>
                </div>
                <span className="font-bold text-orange-600">{service.price} جنيه مصري</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* ملخص وتأكيد */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <h3 className="font-bold text-lg">ملخص خدمة تغيير الزيت</h3>
            
            {selectedOilType && (
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span>نوع الزيت:</span>
                  <span className="font-medium">
                    {oilTypes.find(oil => oil.id === selectedOilType)?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>الكمية:</span>
                  <span className="font-medium">{oilQuantity} لتر</span>
                </div>
                <div className="flex justify-between">
                  <span>الخدمات الإضافية:</span>
                  <span className="font-medium">{selectedServices.length} خدمة</span>
                </div>
                
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>التكلفة الإجمالية:</span>
                    <span className="text-green-600">
                      {(
                        (oilTypes.find(oil => oil.id === selectedOilType)?.price || 0) * oilQuantity +
                        selectedServices.reduce((sum, serviceId) => {
                          const service = additionalServices.find(s => s.id === serviceId);
                          return sum + (service?.price || 0);
                        }, 0)
                      ).toFixed(2)} جنيه مصري
                    </span>
                  </div>
                </div>
              </div>
            )}

            <Button
              onClick={handleAddOilService}
              disabled={!selectedOilType}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
              size="lg"
            >
              <Plus className="h-4 w-4 ml-2" />
              إضافة خدمة تغيير الزيت للطلب
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OilServicesTab;