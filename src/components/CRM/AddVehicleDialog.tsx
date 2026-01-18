import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useCustomerStore } from "@/hooks/useCustomerStore";
import { Car, Save, X, Upload, Image, User, Search, Camera } from 'lucide-react';
import { LicensePlateAIReader } from './LicensePlateAIReader';
import { SaudiPlateInput } from './SaudiPlateInput';
import { CameraCapture } from './CameraCapture';

interface AddVehicleDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddVehicleDialog({ isOpen, onClose }: AddVehicleDialogProps) {
  const { toast } = useToast();
  const { customers, searchCustomer } = useCustomerStore();
  
  // حالات النموذج
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [chassisNumber, setChassisNumber] = useState('');
  const [year, setYear] = useState('');
  const [make, setMake] = useState(''); // العلامة التجارية
  const [model, setModel] = useState('');
  const [vehicleType, setVehicleType] = useState(''); // نوع المركبة
  const [color, setColor] = useState(''); // اللون
  const [fuelType, setFuelType] = useState(''); // نوع الوقود
  const [mileage, setMileage] = useState('');
  const [recommendedFuelQuantity, setRecommendedFuelQuantity] = useState('');
  const [vehicleImage, setVehicleImage] = useState<File | null>(null);
  const [diagnosticImage, setDiagnosticImage] = useState<File | null>(null);
  const [notes, setNotes] = useState('');
  
  // حالات التصوير بالكاميرا
  const [showVehicleCamera, setShowVehicleCamera] = useState(false);
  const [showDiagnosticCamera, setShowDiagnosticCamera] = useState(false);

  // إضافة متغيرات البحث المفلترة
  const filteredCustomers = customerSearchTerm 
    ? searchCustomer(customerSearchTerm)
    : customers;

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCustomerId) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى اختيار العميل مالك المشروب",
        variant: "destructive"
      });
      return;
    }
    
    const fullPlateNumber = plateNumber;
    
    toast({
      title: "تم إضافة المركبة بنجاح",
      description: `تمت إضافة المركبة ${fullPlateNumber} للعميل ${selectedCustomer?.name}`,
    });
    
    // إعادة تعيين النموذج
    setSelectedCustomerId('');
    setCustomerSearchTerm('');
    setPlateNumber('');
    setChassisNumber('');
    setYear('');
    setMake('');
    setModel('');
    setVehicleType('');
    setColor('');
    setFuelType('');
    setMileage('');
    setRecommendedFuelQuantity('');
    setVehicleImage(null);
    setDiagnosticImage(null);
    setNotes('');
    
    onClose();
  };

  const handlePlateDetected = (plateValue: string) => {
    setPlateNumber(plateValue);
  };

  const handleFileUpload = (type: 'vehicle' | 'diagnostic', event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (type === 'vehicle') {
        setVehicleImage(file);
      } else {
        setDiagnosticImage(file);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader className="bg-gradient-to-r from-[hsl(217,85%,27%)] to-[hsl(195,100%,60%)] text-white p-4 -m-6 mb-6">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Car className="h-6 w-6" />
              إضافة مركبة جديدة
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* اختيار العميل */}
          <Card className="border-green-200 bg-green-50/30">
            <CardHeader>
              <CardTitle className="text-lg text-green-600 text-right flex items-center gap-2">
                <User className="h-5 w-5" />
                👤 اختيار العميل (مالك المشروب)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* بحث العميل */}
              <div className="space-y-2">
                <Label className="text-right block font-semibold">البحث عن العميل *</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    value={customerSearchTerm}
                    onChange={(e) => setCustomerSearchTerm(e.target.value)}
                    placeholder="ابحث بالاسم أو رقم الجوال أو البريد الإلكتروني..."
                    className="pl-10 text-right border-2 border-green-300 focus:border-green-500 bg-white"
                  />
                </div>
              </div>

              {/* اختيار العميل */}
              <div className="space-y-2">
                <Label className="text-right block font-semibold">اختر العميل *</Label>
                <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
                  <SelectTrigger className="text-right border-2 border-green-300 focus:border-green-500 bg-white">
                    <SelectValue placeholder="اختر العميل من القائمة" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-2 border-green-200 shadow-xl z-[100] max-h-60">
                    {filteredCustomers.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        {customerSearchTerm ? 'لا توجد نتائج للبحث' : 'لا يوجد عملاء'}
                      </div>
                    ) : (
                      filteredCustomers.map(customer => (
                        <SelectItem 
                          key={customer.id} 
                          value={customer.id}
                          className="text-right hover:bg-green-50"
                        >
                          <div className="flex items-center gap-3 w-full">
                            <div className="flex-1 text-right">
                              <div className="font-semibold text-gray-900">{customer.name}</div>
                              <div className="text-sm text-gray-500" dir="ltr">{customer.phone}</div>
                              <div className="text-xs text-gray-400">
                                {customer.customerType === 'Individual' ? 'فرد' : 
                                 customer.customerType === 'Company' ? 'شركة' : 'مجموعة'}
                              </div>
                            </div>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* عرض بيانات العميل المختار */}
              {selectedCustomer && (
                <div className="mt-4 p-4 bg-green-100 rounded-lg border border-green-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                      {selectedCustomer.name.charAt(0)}
                    </div>
                    <div className="flex-1 text-right">
                      <h3 className="font-bold text-green-800">{selectedCustomer.name}</h3>
                      <p className="text-sm text-green-600" dir="ltr">{selectedCustomer.phone}</p>
                      <p className="text-xs text-green-500">
                        {selectedCustomer.cars.length} مركبة مسجلة • {selectedCustomer.totalVisits} زيارة
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* قراءة رقم اللوحة بالذكاء الاصطناعي */}
          <LicensePlateAIReader onPlateDetected={handlePlateDetected} />

          {/* البيانات الأساسية للمركبة */}
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg text-blue-600 text-right">
                📋 البيانات الأساسية للمركبة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* رقم اللوحة بالتصميم المصري */}
              <SaudiPlateInput
                value={plateNumber}
                onChange={setPlateNumber}
                required
              />

              {/* باقي الحقول بالترتيب المطلوب - كل صف حقلين */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. العلامة التجارية (الماركة) */}
                <div className="space-y-2">
                  <Label className="text-right block font-semibold">العلامة التجارية (الماركة) *</Label>
                  <Select value={make} onValueChange={setMake}>
                    <SelectTrigger className="text-right border-2 border-gray-300 focus:border-blue-500 bg-white">
                      <SelectValue placeholder="اختر العلامة التجارية" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border shadow-lg z-50">
                      <SelectItem value="toyota">تويوتا</SelectItem>
                      <SelectItem value="honda">هوندا</SelectItem>
                      <SelectItem value="nissan">نيسان</SelectItem>
                      <SelectItem value="hyundai">هيونداي</SelectItem>
                      <SelectItem value="kia">كيا</SelectItem>
                      <SelectItem value="chevrolet">شيفروليه</SelectItem>
                      <SelectItem value="ford">فورد</SelectItem>
                      <SelectItem value="bmw">بي إم دبليو</SelectItem>
                      <SelectItem value="mercedes">مرسيدس</SelectItem>
                      <SelectItem value="audi">أودي</SelectItem>
                      <SelectItem value="lexus">لكزس</SelectItem>
                      <SelectItem value="infiniti">انفينيتي</SelectItem>
                      <SelectItem value="mazda">مازدا</SelectItem>
                      <SelectItem value="mitsubishi">متسوبيشي</SelectItem>
                      <SelectItem value="volkswagen">فولكس واجن</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 2. الموديل */}
                <div className="space-y-2">
                  <Label className="text-right block font-semibold">الموديل *</Label>
                  <Select value={model} onValueChange={setModel}>
                    <SelectTrigger className="text-right border-2 border-gray-300 focus:border-blue-500 bg-white">
                      <SelectValue placeholder="اختر الموديل" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border shadow-lg z-50">
                      {/* موديلات تويوتا */}
                      {make === 'toyota' && (
                        <>
                          <SelectItem value="camry">كامري</SelectItem>
                          <SelectItem value="corolla">كورولا</SelectItem>
                          <SelectItem value="prado">برادو</SelectItem>
                          <SelectItem value="hilux">هايلكس</SelectItem>
                          <SelectItem value="fortuner">فورتونر</SelectItem>
                          <SelectItem value="avalon">أفالون</SelectItem>
                        </>
                      )}
                      {/* موديلات هوندا */}
                      {make === 'honda' && (
                        <>
                          <SelectItem value="accord">أكورد</SelectItem>
                          <SelectItem value="civic">سيفيك</SelectItem>
                          <SelectItem value="crv">CR-V</SelectItem>
                          <SelectItem value="pilot">بايلوت</SelectItem>
                        </>
                      )}
                      {/* موديلات نيسان */}
                      {make === 'nissan' && (
                        <>
                          <SelectItem value="altima">التيما</SelectItem>
                          <SelectItem value="patrol">باترول</SelectItem>
                          <SelectItem value="navara">نافارا</SelectItem>
                          <SelectItem value="xtrail">اكس تريل</SelectItem>
                        </>
                      )}
                      {/* إذا لم يتم اختيار ماركة */}
                      {!make && (
                        <SelectItem value="no-brand-selected" disabled>اختر العلامة التجارية أولاً</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* 3. نوع المركبة */}
                <div className="space-y-2">
                  <Label className="text-right block font-semibold">نوع المركبة *</Label>
                  <Select value={vehicleType} onValueChange={setVehicleType}>
                    <SelectTrigger className="text-right border-2 border-gray-300 focus:border-blue-500 bg-white">
                      <SelectValue placeholder="اختر نوع المركبة" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border shadow-lg z-50">
                      <SelectItem value="sedan">سيدان</SelectItem>
                      <SelectItem value="suv">دفع رباعي (SUV)</SelectItem>
                      <SelectItem value="hatchback">هاتشباك</SelectItem>
                      <SelectItem value="pickup">بيك آب</SelectItem>
                      <SelectItem value="coupe">كوبيه</SelectItem>
                      <SelectItem value="convertible">كابريوليه</SelectItem>
                      <SelectItem value="minivan">ميني فان</SelectItem>
                      <SelectItem value="truck">شاحنة</SelectItem>
                      <SelectItem value="crossover">كج.م أوفر</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 4. سنة الصنع */}
                <div className="space-y-2">
                  <Label className="text-right block font-semibold">سنة الصنع *</Label>
                  <Select value={year} onValueChange={setYear}>
                    <SelectTrigger className="text-right border-2 border-gray-300 focus:border-blue-500 bg-white">
                      <SelectValue placeholder="اختر السنة" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border shadow-lg z-50 max-h-60 overflow-y-auto">
                      {Array.from({ length: 25 }, (_, i) => 2024 - i).map(year => (
                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 5. اللون */}
                <div className="space-y-2">
                  <Label className="text-right block font-semibold">اللون *</Label>
                  <Select value={color} onValueChange={setColor}>
                    <SelectTrigger className="text-right border-2 border-gray-300 focus:border-blue-500 bg-white">
                      <SelectValue placeholder="اختر اللون" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border shadow-lg z-50">
                      <SelectItem value="white">أبيض</SelectItem>
                      <SelectItem value="black">أسود</SelectItem>
                      <SelectItem value="silver">فضي</SelectItem>
                      <SelectItem value="gray">رمادي</SelectItem>
                      <SelectItem value="red">أحمر</SelectItem>
                      <SelectItem value="blue">أزرق</SelectItem>
                      <SelectItem value="green">أخضر</SelectItem>
                      <SelectItem value="brown">بني</SelectItem>
                      <SelectItem value="gold">ذهبي</SelectItem>
                      <SelectItem value="beige">بيج</SelectItem>
                      <SelectItem value="yellow">أصفر</SelectItem>
                      <SelectItem value="orange">برتقالي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 6. رقم الهيكل (VIN) */}
                <div className="space-y-2">
                  <Label className="text-right block font-semibold">رقم الهيكل (VIN)</Label>
                  <Input
                      value={chassisNumber}
                      onChange={(e) => setChassisNumber(e.target.value)}
                      placeholder="أدخل رقم الهيكل (اختياري)"
                      className="text-right border-2 border-gray-300 focus:border-blue-500"
                      maxLength={17}
                      dir="ltr"
                    />
                  </div>

                {/* 7. نوع الوقود */}
                <div className="space-y-2">
                  <Label className="text-right block font-semibold">نوع الوقود</Label>
                  <Select value={fuelType} onValueChange={setFuelType}>
                    <SelectTrigger className="text-right border-2 border-gray-300 focus:border-blue-500 bg-white">
                      <SelectValue placeholder="اختر نوع الوقود" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border shadow-lg z-50">
                      <SelectItem value="gasoline">بنزين</SelectItem>
                      <SelectItem value="diesel">ديزل</SelectItem>
                      <SelectItem value="hybrid">هجين</SelectItem>
                      <SelectItem value="electric">كهربائي</SelectItem>
                      <SelectItem value="lpg">غاز البترول المسال</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* المواصفات التقنية */}
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg text-blue-600 text-right">
                ⚙️ المواصفات التقنية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-right block font-semibold">عدد الكيلومترات</Label>
                  <Input
                    type="number"
                    value={mileage}
                    onChange={(e) => setMileage(e.target.value)}
                    placeholder="100000"
                    className="text-right border-2 border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-right block font-semibold">كمية الوقود الموصى بها (ليتر)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={recommendedFuelQuantity}
                    onChange={(e) => setRecommendedFuelQuantity(e.target.value)}
                    placeholder="60.17"
                    className="text-right border-2 border-gray-300"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* صورة المركبة والملاحظات */}
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg text-blue-600 text-right">
                🖼️ صورة المركبة والملاحظات
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* صورة المركبة الخارجية */}
                <div className="space-y-2">
                  <Label className="text-right block font-semibold">صورة المركبة الخارجية</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    {vehicleImage ? (
                      <div className="space-y-2">
                        <Image className="h-12 w-12 mx-auto text-green-600" />
                        <p className="text-sm text-green-600">{vehicleImage.name}</p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setVehicleImage(null)}
                        >
                          إزالة الصورة
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Camera className="h-12 w-12 mx-auto text-blue-500" />
                        <p className="text-sm text-gray-600">تصوير المركبة بالكاميرا مباشرة</p>
                        <div className="flex gap-2 justify-center">
                          <Button
                            type="button"
                            onClick={() => setShowVehicleCamera(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <Camera className="h-4 w-4 mr-2" />
                            تصوير المركبة
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById('vehicle-image')?.click()}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            رفع صورة
                          </Button>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload('vehicle', e)}
                          className="hidden"
                          id="vehicle-image"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* صورة العداد التشخيصي */}
                <div className="space-y-2">
                  <Label className="text-right block font-semibold">صورة العداد التشخيصي</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    {diagnosticImage ? (
                      <div className="space-y-2">
                        <Image className="h-12 w-12 mx-auto text-green-600" />
                        <p className="text-sm text-green-600">{diagnosticImage.name}</p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setDiagnosticImage(null)}
                        >
                          إزالة الصورة
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Camera className="h-12 w-12 mx-auto text-purple-500" />
                        <p className="text-sm text-gray-600">تصوير العداد بالكاميرا مباشرة</p>
                        <div className="flex gap-2 justify-center">
                          <Button
                            type="button"
                            onClick={() => setShowDiagnosticCamera(true)}
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                          >
                            <Camera className="h-4 w-4 mr-2" />
                            تصوير العداد
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById('diagnostic-image')?.click()}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            رفع صورة
                          </Button>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload('diagnostic', e)}
                          className="hidden"
                          id="diagnostic-image"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ملاحظات */}
              <div className="space-y-2">
                <Label className="text-right block font-semibold">ملاحظات إضافية</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="ملاحظات إضافية للمركبة - معلومات التشخيص - تغييرات مطلوبة..."
                  rows={4}
                  className="text-right border-2 border-gray-300"
                />
              </div>
            </CardContent>
          </Card>

          {/* أزرار الحفظ */}
          <div className="flex gap-3 justify-center pt-6 border-t">
            <Button type="button" variant="outline" onClick={onClose} className="px-8 border-gray-300 hover:bg-gray-50">
              إلغاء
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-[hsl(217,85%,27%)] to-[hsl(195,100%,60%)] hover:from-[hsl(217,85%,22%)] hover:to-[hsl(195,100%,55%)] text-white px-8 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Save className="h-4 w-4 mr-2" />
              حفظ المركبة
            </Button>
          </div>
        </form>
      </DialogContent>
      
      {/* كاميرا تصوير المركبة */}
      {showVehicleCamera && (
        <Dialog open={showVehicleCamera} onOpenChange={setShowVehicleCamera}>
          <DialogContent className="max-w-3xl">
            <CameraCapture
              title="تصوير المركبة الخارجية"
              onCapture={(file) => {
                setVehicleImage(file);
                setShowVehicleCamera(false);
              }}
              onClose={() => setShowVehicleCamera(false)}
            />
          </DialogContent>
        </Dialog>
      )}
      
      {/* كاميرا تصوير العداد */}
      {showDiagnosticCamera && (
        <Dialog open={showDiagnosticCamera} onOpenChange={setShowDiagnosticCamera}>
          <DialogContent className="max-w-3xl">
            <CameraCapture
              title="تصوير العداد التشخيصي"
              onCapture={(file) => {
                setDiagnosticImage(file);
                setShowDiagnosticCamera(false);
              }}
              onClose={() => setShowDiagnosticCamera(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  );
}