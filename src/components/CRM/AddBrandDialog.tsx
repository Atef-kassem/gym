import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Save, X } from 'lucide-react';

interface AddBrandDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddBrandDialog({ isOpen, onClose }: AddBrandDialogProps) {
  const { toast } = useToast();
  const [brandId, setBrandId] = useState('');
  const [brandName, setBrandName] = useState('');
  const [logoPath, setLogoPath] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!brandId.trim() || !brandName.trim()) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "تم إضافة الماركة بنجاح",
      description: `تمت إضافة ماركة ${brandName} إلى النظام`,
    });
    
    // إعادة تعيين النموذج
    setBrandId('');
    setBrandName('');
    setLogoPath('');
    
    onClose();
  };

  const handleCancel = () => {
    setBrandId('');
    setBrandName('');
    setLogoPath('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader className="flex flex-row items-center justify-between pb-4">
          <DialogTitle className="text-lg font-bold text-gray-900">
            إضافة ماركة جديدة
          </DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* معرف الماركة (بالإنجليزية) */}
            <div className="space-y-2">
              <Label htmlFor="brandId" className="text-right block font-medium text-gray-700">
                معرف الماركة (بالإنجليزية) *
              </Label>
              <Input
                id="brandId"
                type="text"
                value={brandId}
                onChange={(e) => setBrandId(e.target.value.toLowerCase())}
                placeholder="toyota"
                className="text-left border border-gray-300 rounded-md px-3 py-2 w-full"
                dir="ltr"
                required
              />
            </div>

            {/* اسم الماركة */}
            <div className="space-y-2">
              <Label htmlFor="brandName" className="text-right block font-medium text-gray-700">
                اسم الماركة *
              </Label>
              <Input
                id="brandName"
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="تويوتا"
                className="text-right border border-gray-300 rounded-md px-3 py-2 w-full"
                required
              />
            </div>

            {/* رابط الشعار (اختياري) */}
            <div className="space-y-2">
              <Label htmlFor="logoPath" className="text-right block font-medium text-gray-700">
                رابط الشعار (اختياري)
              </Label>
              <Input
                id="logoPath"
                type="text"
                value={logoPath}
                onChange={(e) => setLogoPath(e.target.value)}
                placeholder="path/to/logo.png/"
                className="text-left border border-gray-300 rounded-md px-3 py-2 w-full"
                dir="ltr"
              />
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