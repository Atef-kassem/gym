import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SaudiPlateInput } from "@/components/SaudiPlateInput";
import { User, Car, MapPin, ChevronLeft, X, Search, Plus } from 'lucide-react';
import { CustomerSearchInput } from "../CustomerSearchInput";

interface CustomerVehicleStepProps {
  customerPhone: string;
  setCustomerPhone: (phone: string) => void;
  customerName: string;
  setCustomerName: (name: string) => void;
  carPlate: string;
  setCarPlate: (plate: string) => void;
  carMake: string;
  setCarMake: (make: string) => void;
  carModel: string;
  setCarModel: (model: string) => void;
  carYear: string;
  setCarYear: (year: string) => void;
  carColor: string;
  setCarColor: (color: string) => void;
  selectedPath: string;
  setSelectedPath: (path: string) => void;
  showPlateReader: boolean;
  setShowPlateReader: (show: boolean) => void;
  onPlateDetected: (plateData: any) => void;
  onNext: () => void;
  onCancel: () => void;
  canProceed: boolean;
}

export function CustomerVehicleStep({
  customerPhone,
  setCustomerPhone,
  customerName,
  setCustomerName,
  carPlate,
  setCarPlate,
  carMake,
  setCarMake,
  carModel,
  setCarModel,
  carYear,
  setCarYear,
  carColor,
  setCarColor,
  selectedPath,
  setSelectedPath,
  showPlateReader,
  setShowPlateReader,
  onPlateDetected,
  onNext,
  onCancel,
  canProceed
}: CustomerVehicleStepProps) {
  
  const handleCustomerSelect = (customer: any) => {
    setCustomerName(customer.name);
    setCustomerPhone(customer.phone);
  };

  const handleAddNewCustomer = () => {
    // يمكن إضافة منطق لفتح نموذج إضافة عميل جديد
    console.log('إضافة عميل جديد');
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      {/* Header with Steps */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
          <div className="w-8 h-0.5 bg-blue-600"></div>
          <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm">2</div>
          <div className="w-8 h-0.5 bg-gray-300"></div>
          <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm">3</div>
        </div>
        
        <div className="flex items-center gap-2 text-blue-600">
          <User className="h-5 w-5" />
          <span className="font-semibold">بيانات العميل والمركبة</span>
        </div>
      </div>

      {/* Main Card */}
      <Card className="bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold">إدارة العملاء والمركبات</CardTitle>
            <Button variant="outline" size="sm" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
              نظام متطور
            </Button>
          </div>
          <p className="text-blue-100 text-sm">نظام متطور لإدارة بيانات العملاء ومركباتهم</p>
        </CardHeader>
        
        <CardContent className="bg-white text-gray-900 rounded-t-3xl p-6 space-y-6">
          {/* Service Path Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-blue-600">مسار الخدمة</h3>
              <Button variant="outline" size="sm" className="text-blue-600 border-blue-600">
                اختياري
              </Button>
            </div>
            
            <Select value={selectedPath} onValueChange={setSelectedPath}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="اختر مسار الخدمة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="path1">المسار الأول -   سريع</SelectItem>
                <SelectItem value="path2">المسار الثاني -   شامل</SelectItem>
                <SelectItem value="path3">المسار الثالث - صيانة عامة</SelectItem>
                <SelectItem value="path4">المسار الرابع - تغيير زيت</SelectItem>
                <SelectItem value="path5">المسار الخامس - خدمة VIP</SelectItem>
              </SelectContent>
            </Select>

            {/* Path Numbers Visual */}
            <div className="flex gap-2 justify-center">
              {[1, 2, 3, 4, 5].map((num) => (
                <div
                  key={num}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold cursor-pointer transition-all ${
                    selectedPath === `path${num}`
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                  onClick={() => setSelectedPath(`path${num}`)}
                >
                  {num}
                </div>
              ))}
            </div>
          </div>

          {/* Customer Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">رقم الجوال أو البحث</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="رقم الجوال أو البحث"
                  className="pl-10"
                  dir="rtl"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">اسم العميل</label>
              <CustomerSearchInput
                value={customerName}
                onChange={setCustomerName}
                placeholder="البحث عن عميل بالاسم أو الهاتف"
                onCustomerSelect={handleCustomerSelect}
                onAddNew={handleAddNewCustomer}
              />
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-blue-600 flex items-center gap-2">
                <Car className="h-5 w-5" />
                بيانات المركبة
              </h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-green-600 border-green-600">
                  قراءة اللوحة
                </Button>
                <Button variant="outline" size="sm" className="text-gray-600">
                  عميل جديد
                </Button>
              </div>
            </div>

            {/* License Plate */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">رقم اللوحة</label>
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <SaudiPlateInput
                  value={carPlate}
                  onChange={setCarPlate}
                  placeholder="أدخل رقم اللوحة"
                />
                <p className="text-xs text-yellow-700 mt-1 flex items-center gap-1">
                  <span>⚠️</span>
                  يجب إدخال 3 حروف و 4 أرقام
                </p>
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">الموديل</label>
                <Select value={carModel} onValueChange={setCarModel}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختار الموديل" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="camry">كامري</SelectItem>
                    <SelectItem value="corolla">كورولا</SelectItem>
                    <SelectItem value="accord">أكورد</SelectItem>
                    <SelectItem value="civic">سيفيك</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">نوع المشروب</label>
                <Select value={carMake} onValueChange={setCarMake}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختار النوع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="toyota">تويوتا</SelectItem>
                    <SelectItem value="honda">هوندا</SelectItem>
                    <SelectItem value="nissan">نيسان</SelectItem>
                    <SelectItem value="hyundai">هيونداي</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Add New Vehicle Button */}
            <Button variant="default" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              إضافة مركبة جديدة
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-center gap-4 mt-6">
        <Button
          onClick={onCancel}
          variant="destructive"
          className="px-8"
        >
          <X className="h-4 w-4 mr-2" />
          إلغاء الطلب
        </Button>
        
        <Button
          onClick={onNext}
          disabled={!canProceed}
          className="px-8 bg-blue-600 hover:bg-blue-700"
        >
          اختيار الخدمات
          <ChevronLeft className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}