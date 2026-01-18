import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Save, X } from 'lucide-react';

interface AddColorDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddColorDialog({ isOpen, onClose }: AddColorDialogProps) {
  const { toast } = useToast();
  const [colorId, setColorId] = useState('');
  const [colorName, setColorName] = useState('');
  const [colorCode, setColorCode] = useState('#000000');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!colorId.trim() || !colorName.trim()) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "تم إضافة اللون بنجاح",
      description: `تمت إضافة لون ${colorName} إلى النظام`,
    });
    
    // إعادة تعيين النموذج
    setColorId('');
    setColorName('');
    setColorCode('#000000');
    
    onClose();
  };

  const handleCancel = () => {
    setColorId('');
    setColorName('');
    setColorCode('#000000');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader className="flex flex-row items-center justify-between pb-4">
          <DialogTitle className="text-lg font-bold text-gray-900">
            إضافة لون جديد
          </DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* معرف اللون */}
            <div className="space-y-2">
              <Label htmlFor="colorId" className="text-right block font-medium text-gray-700">
                معرف اللون *
              </Label>
              <Input
                id="colorId"
                type="text"
                value={colorId}
                onChange={(e) => setColorId(e.target.value.toLowerCase())}
                placeholder="blue"
                className="text-left border border-gray-300 rounded-md px-3 py-2 w-full"
                dir="ltr"
                required
              />
            </div>

            {/* اسم اللون */}
            <div className="space-y-2">
              <Label htmlFor="colorName" className="text-right block font-medium text-gray-700">
                اسم اللون *
              </Label>
              <Input
                id="colorName"
                type="text"
                value={colorName}
                onChange={(e) => setColorName(e.target.value)}
                placeholder="أزرق"
                className="text-right border border-gray-300 rounded-md px-3 py-2 w-full"
                required
              />
            </div>

            {/* كود اللون */}
            <div className="space-y-2">
              <Label htmlFor="colorCode" className="text-right block font-medium text-gray-700">
                كود اللون *
              </Label>
              <div className="flex gap-2 items-center">
                <Input
                  id="colorCode"
                  type="text"
                  value={colorCode}
                  onChange={(e) => setColorCode(e.target.value)}
                  placeholder="#000000"
                  className="text-left border border-gray-300 rounded-md px-3 py-2 flex-1"
                  dir="ltr"
                  pattern="^#[0-9A-Fa-f]{6}$"
                  required
                />
                <div className="relative">
                  <input
                    type="color"
                    value={colorCode}
                    onChange={(e) => setColorCode(e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                    title="اختيار اللون"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 text-right">
                يمكنك استخدام منتقي الألوان أو كتابة الكود مباشرة
              </p>
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