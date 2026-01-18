import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Save, X } from 'lucide-react';

interface AddModelDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddModelDialog({ isOpen, onClose }: AddModelDialogProps) {
  const { toast } = useToast();
  const [selectedBrand, setSelectedBrand] = useState('');
  const [modelId, setModelId] = useState('');
  const [modelName, setModelName] = useState('');
  const [vehicleType, setVehicleType] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedBrand || !modelId.trim() || !modelName.trim() || !vehicleType) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "تم إضافة الموديل بنجاح",
      description: `تمت إضافة موديل ${modelName} إلى النظام`,
    });
    
    // إعادة تعيين النموذج
    setSelectedBrand('');
    setModelId('');
    setModelName('');
    setVehicleType('');
    
    onClose();
  };

  const handleCancel = () => {
    setSelectedBrand('');
    setModelId('');
    setModelName('');
    setVehicleType('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader className="flex flex-row items-center justify-between pb-4">
          <DialogTitle className="text-lg font-bold text-gray-900">
            إضافة موديل جديد
          </DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* اختيار الماركة */}
            <div className="space-y-2">
              <Label htmlFor="brand" className="text-right block font-medium text-gray-700">
                اختيار الماركة *
              </Label>
              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger className="text-right border border-gray-300">
                  <SelectValue placeholder="اختيار الماركة" />
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

            {/* معرف الموديل */}
            <div className="space-y-2">
              <Label htmlFor="modelId" className="text-right block font-medium text-gray-700">
                معرف الموديل *
              </Label>
              <Input
                id="modelId"
                type="text"
                value={modelId}
                onChange={(e) => setModelId(e.target.value.toLowerCase())}
                placeholder="camry"
                className="text-left border border-gray-300 rounded-md px-3 py-2 w-full"
                dir="ltr"
                required
              />
            </div>

            {/* اسم الموديل */}
            <div className="space-y-2">
              <Label htmlFor="modelName" className="text-right block font-medium text-gray-700">
                اسم الموديل *
              </Label>
              <Input
                id="modelName"
                type="text"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                placeholder="كامري"
                className="text-right border border-gray-300 rounded-md px-3 py-2 w-full"
                required
              />
            </div>

            {/* نوع المركبة */}
            <div className="space-y-2">
              <Label htmlFor="vehicleType" className="text-right block font-medium text-gray-700">
                نوع المركبة *
              </Label>
              <Select value={vehicleType} onValueChange={setVehicleType}>
                <SelectTrigger className="text-right border border-gray-300">
                  <SelectValue placeholder="اختيار النوع" />
                </SelectTrigger>
                <SelectContent className="bg-white border shadow-lg z-50">
                  <SelectItem value="sedan">سيدان</SelectItem>
                  <SelectItem value="suv">دفع رباعي</SelectItem>
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
          </div>

          {/* أزرار الحفظ والإلغاء */}
          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              إلغاء
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              حفظ
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}