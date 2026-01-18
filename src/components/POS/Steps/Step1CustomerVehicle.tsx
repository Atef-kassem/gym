import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Car, ArrowRight } from 'lucide-react';

interface Step1Props {
  onNext: (customerData: any, vehicleData: any) => void;
  onCancel: () => void;
}

const Step1CustomerVehicle: React.FC<Step1Props> = ({ onNext, onCancel }) => {
  const [customerData, setCustomerData] = useState({
    name: '',
    phone: '',
    email: ''
  });

  const [vehicleData, setVehicleData] = useState({
    plateNumber: '',
    make: '',
    model: '',
    color: '',
    year: ''
  });

  const handleNext = () => {
    onNext(customerData, vehicleData);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4" dir="rtl">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">بيانات العميل والمركبة</h1>
          <div className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
            الخطوة 1 من 4
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customer Data */}
          <Card>
            <CardHeader className="bg-blue-50">
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <User className="h-5 w-5" />
                بيانات العميل
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <Label htmlFor="customerName">اسم العميل *</Label>
                <Input
                  id="customerName"
                  value={customerData.name}
                  onChange={(e) => setCustomerData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="أدخل اسم العميل"
                />
              </div>
              
              <div>
                <Label htmlFor="customerPhone">رقم الجوال *</Label>
                <Input
                  id="customerPhone"
                  value={customerData.phone}
                  onChange={(e) => setCustomerData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="05xxxxxxxx"
                />
              </div>
              
              <div>
                <Label htmlFor="customerEmail">البريد الإلكتروني</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={customerData.email}
                  onChange={(e) => setCustomerData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="example@email.com"
                />
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Data */}
          <Card>
            <CardHeader className="bg-green-50">
              <CardTitle className="flex items-center gap-2 text-green-800">
                <Car className="h-5 w-5" />
                بيانات المركبة
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <Label htmlFor="plateNumber">رقم اللوحة *</Label>
                <Input
                  id="plateNumber"
                  value={vehicleData.plateNumber}
                  onChange={(e) => setVehicleData(prev => ({ ...prev, plateNumber: e.target.value }))}
                  placeholder="أ ب ج 1234"
                />
              </div>
              
              <div>
                <Label htmlFor="make">نوع المركبة</Label>
                <Input
                  id="make"
                  value={vehicleData.make}
                  onChange={(e) => setVehicleData(prev => ({ ...prev, make: e.target.value }))}
                  placeholder="تويوتا، هونداي، إلخ"
                />
              </div>
              
              <div>
                <Label htmlFor="model">الموديل</Label>
                <Input
                  id="model"
                  value={vehicleData.model}
                  onChange={(e) => setVehicleData(prev => ({ ...prev, model: e.target.value }))}
                  placeholder="كامري، النترا، إلخ"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="color">اللون</Label>
                  <Input
                    id="color"
                    value={vehicleData.color}
                    onChange={(e) => setVehicleData(prev => ({ ...prev, color: e.target.value }))}
                    placeholder="أبيض، أسود، إلخ"
                  />
                </div>
                
                <div>
                  <Label htmlFor="year">سنة الصنع</Label>
                  <Input
                    id="year"
                    value={vehicleData.year}
                    onChange={(e) => setVehicleData(prev => ({ ...prev, year: e.target.value }))}
                    placeholder="2023"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-6">
          <Button variant="outline" onClick={onCancel}>
            إلغاء
          </Button>
          
          <Button 
            onClick={handleNext}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8"
            disabled={!customerData.name || !customerData.phone || !vehicleData.plateNumber}
          >
            التالي: اختيار الخدمات
            <ArrowRight className="h-4 w-4 mr-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Step1CustomerVehicle;