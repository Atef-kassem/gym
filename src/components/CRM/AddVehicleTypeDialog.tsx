import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Save, X } from 'lucide-react';

interface AddVehicleTypeDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddVehicleTypeDialog({ isOpen, onClose }: AddVehicleTypeDialogProps) {
  const { toast } = useToast();
  const [typeId, setTypeId] = useState('');
  const [typeName, setTypeName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!typeId.trim() || !typeName.trim()) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "تم إضافة نوع المركبة بنجاح",
      description: `تمت إضافة نوع ${typeName} إلى النظام`,
    });
    
    // إعادة تعيين النموذج
    setTypeId('');
    setTypeName('');
    
    onClose();
  };

  const handleCancel = () => {
    setTypeId('');
    setTypeName('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader className="flex flex-row items-center justify-between pb-4">
          <DialogTitle className="text-lg font-bold text-gray-900">
            إضافة نوع مركبة جديد
          </DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* معرف النوع */}
            <div className="space-y-2">
              <Label htmlFor="typeId" className="text-right block font-medium text-gray-700">
                معرف النوع *
              </Label>
              <Input
                id="typeId"
                type="text"
                value={typeId}
                onChange={(e) => setTypeId(e.target.value.toLowerCase())}
                placeholder="sedan"
                className="text-left border border-gray-300 rounded-md px-3 py-2 w-full"
                dir="ltr"
                required
              />
            </div>

            {/* اسم النوع */}
            <div className="space-y-2">
              <Label htmlFor="typeName" className="text-right block font-medium text-gray-700">
                اسم النوع *
              </Label>
              <Input
                id="typeName"
                type="text"
                value={typeName}
                onChange={(e) => setTypeName(e.target.value)}
                placeholder="سيدان"
                className="text-right border border-gray-300 rounded-md px-3 py-2 w-full"
                required
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