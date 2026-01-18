import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  itemName?: string;
  type?: 'warning' | 'danger';
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  itemName,
  type = 'warning'
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-right">
            <AlertTriangle className={`h-5 w-5 ${type === 'danger' ? 'text-red-600' : 'text-yellow-600'}`} />
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-gray-700 text-right">
            {description}
          </p>
          
          {itemName && (
            <div className={`mt-3 p-3 rounded-lg ${type === 'danger' ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'}`}>
              <p className={`text-sm font-medium ${type === 'danger' ? 'text-red-800' : 'text-yellow-800'}`}>
                العنصر المحدد: <span className="font-bold">{itemName}</span>
              </p>
            </div>
          )}
          
          <div className={`mt-4 p-3 rounded-lg ${type === 'danger' ? 'bg-red-50' : 'bg-yellow-50'}`}>
            <p className={`text-sm ${type === 'danger' ? 'text-red-700' : 'text-yellow-700'}`}>
              ⚠️ هذا الإجراء لا يمكن التراجع عنه
            </p>
          </div>
        </div>

        <DialogFooter className="flex gap-2 justify-start">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 ml-2" />
            إلغاء
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            <Trash2 className="h-4 w-4 ml-2" />
            تأكيد الحذف
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;