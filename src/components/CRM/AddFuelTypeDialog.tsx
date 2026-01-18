import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Save, X, Zap, Battery, Truck, Fuel, Gauge } from 'lucide-react';

interface AddFuelTypeDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddFuelTypeDialog({ isOpen, onClose }: AddFuelTypeDialogProps) {
  const { toast } = useToast();
  const [fuelId, setFuelId] = useState('');
  const [fuelName, setFuelName] = useState('');
  const [iconType, setIconType] = useState('');

  const iconOptions = [
    { id: 'electric', name: 'كهربائي', icon: Zap },
    { id: 'hybrid', name: 'هايبرد', icon: Battery },
    { id: 'diesel', name: 'ديزل', icon: Truck },
    { id: 'gasoline', name: 'بنزين', icon: Fuel },
    { id: 'lpg', name: 'غاز طبيعي', icon: Gauge }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fuelId.trim() || !fuelName.trim() || !iconType) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "تم إضافة نوع الوقود بنجاح",
      description: `تمت إضافة نوع ${fuelName} إلى النظام`,
    });
    
    // إعادة تعيين النموذج
    setFuelId('');
    setFuelName('');
    setIconType('');
    
    onClose();
  };

  const handleCancel = () => {
    setFuelId('');
    setFuelName('');
    setIconType('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader className="flex flex-row items-center justify-between pb-4">
          <DialogTitle className="text-lg font-bold text-gray-900">
            إضافة نوع وقود
          </DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* معرف نوع الوقود */}
            <div className="space-y-2">
              <Label htmlFor="fuelId" className="text-right block font-medium text-gray-700">
                معرف نوع الوقود *
              </Label>
              <Input
                id="fuelId"
                type="text"
                value={fuelId}
                onChange={(e) => setFuelId(e.target.value.toLowerCase())}
                placeholder="electric"
                className="text-left border border-gray-300 rounded-md px-3 py-2 w-full"
                dir="ltr"
                required
              />
            </div>

            {/* اسم نوع الوقود */}
            <div className="space-y-2">
              <Label htmlFor="fuelName" className="text-right block font-medium text-gray-700">
                اسم نوع الوقود *
              </Label>
              <Input
                id="fuelName"
                type="text"
                value={fuelName}
                onChange={(e) => setFuelName(e.target.value)}
                placeholder="كهربائي"
                className="text-right border border-gray-300 rounded-md px-3 py-2 w-full"
                required
              />
            </div>

            {/* نوع الأيقونة */}
            <div className="space-y-2">
              <Label htmlFor="iconType" className="text-right block font-medium text-gray-700">
                نوع الأيقونة *
              </Label>
              <Select value={iconType} onValueChange={setIconType}>
                <SelectTrigger className="text-right border border-gray-300">
                  <SelectValue placeholder="اختر نوع الأيقونة" />
                </SelectTrigger>
                <SelectContent className="bg-white border shadow-lg z-50">
                  {iconOptions.map((option) => {
                    const IconComponent = option.icon;
                    return (
                      <SelectItem key={option.id} value={option.id}>
                        <div className="flex items-center gap-2">
                          <IconComponent className="h-4 w-4" />
                          <span>{option.name}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
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