import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Save, X, Zap, Settings, RotateCcw, Cog } from 'lucide-react';

interface AddTransmissionDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddTransmissionDialog({ isOpen, onClose }: AddTransmissionDialogProps) {
  const { toast } = useToast();
  const [transmissionId, setTransmissionId] = useState('');
  const [transmissionName, setTransmissionName] = useState('');
  const [iconType, setIconType] = useState('');

  const iconOptions = [
    { id: 'dual_clutch', name: 'ناقل مزدوج', icon: Zap },
    { id: 'cvt', name: 'CVT', icon: RotateCcw },
    { id: 'manual', name: 'يدوي', icon: Settings },
    { id: 'automatic', name: 'أوتوماتيك', icon: Cog }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!transmissionId.trim() || !transmissionName.trim() || !iconType) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "تم إضافة نوع ناقل الحركة بنجاح",
      description: `تمت إضافة نوع ${transmissionName} إلى النظام`,
    });
    
    // إعادة تعيين النموذج
    setTransmissionId('');
    setTransmissionName('');
    setIconType('');
    
    onClose();
  };

  const handleCancel = () => {
    setTransmissionId('');
    setTransmissionName('');
    setIconType('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader className="flex flex-row items-center justify-between pb-4">
          <DialogTitle className="text-lg font-bold text-gray-900">
            إضافة نوع ناقل حركة
          </DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* معرف نوع ناقل الحركة */}
            <div className="space-y-2">
              <Label htmlFor="transmissionId" className="text-right block font-medium text-gray-700">
                معرف نوع ناقل الحركة *
              </Label>
              <Input
                id="transmissionId"
                type="text"
                value={transmissionId}
                onChange={(e) => setTransmissionId(e.target.value.toLowerCase())}
                placeholder="dual_clutch"
                className="text-left border border-gray-300 rounded-md px-3 py-2 w-full"
                dir="ltr"
                required
              />
            </div>

            {/* اسم نوع ناقل الحركة */}
            <div className="space-y-2">
              <Label htmlFor="transmissionName" className="text-right block font-medium text-gray-700">
                اسم نوع ناقل الحركة *
              </Label>
              <Input
                id="transmissionName"
                type="text"
                value={transmissionName}
                onChange={(e) => setTransmissionName(e.target.value)}
                placeholder="ناقل مزدوج"
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