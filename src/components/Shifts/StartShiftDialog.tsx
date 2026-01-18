import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Clock,
  DollarSign,
  Calendar,
  User,
  Building2,
  CheckCircle,
  AlertCircle,
  Loader2,
  Coins
} from 'lucide-react';
import { useStartShiftSessionMutation, useGetCurrentSessionQuery } from '@/services/shiftSessionApi';
import { useShift } from '@/contexts/ShiftContext';
import { useCurrentUser } from '@/contexts/CurrentUserContext';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface StartShiftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shift: any;
  branchId?: number;
}

export const StartShiftDialog: React.FC<StartShiftDialogProps> = ({
  open,
  onOpenChange,
  shift,
  branchId
}) => {
  const [openingBalance, setOpeningBalance] = useState<string>('0');
  const [notes, setNotes] = useState<string>('');
  const { currentUser } = useCurrentUser();
  const { setCurrentSession } = useShift();
  
  const [startShiftSession, { isLoading: isStarting }] = useStartShiftSessionMutation();
  const { data: currentSessionData, refetch: refetchCurrentSession } = useGetCurrentSessionQuery({
    branchId,
    userId: currentUser?.id
  });

  // إعادة تعيين القيم عند فتح الحوار
  useEffect(() => {
    if (open) {
      setOpeningBalance('0');
      setNotes('');
    }
  }, [open]);

  const handleStartShift = async () => {
    if (!currentUser) {
      toast.error('لم يتم العثور على بيانات المستخدم');
      return;
    }

    const balanceValue = parseFloat(openingBalance);
    if (isNaN(balanceValue) || balanceValue < 0) {
      toast.error('يرجى إدخال مبلغ صحيح');
      return;
    }

    try {
      const response = await startShiftSession({
        shiftId: shift.id,
        branchId: branchId || null,
        userId: currentUser.id,
        openingBalance: balanceValue,
        notes: notes.trim() || null
      }).unwrap();

      if (response.success) {
        setCurrentSession(response.data);
        const formattedBalance = new Intl.NumberFormat('ar-EG', {
          style: 'currency',
          currency: 'EGP',
        }).format(balanceValue);
        toast.success('تم بدء الوردية بنجاح', {
          description: `الوردية: ${shift.shiftName} | المبلغ الافتتاحي: ${formattedBalance}`
        });
        refetchCurrentSession();
        onOpenChange(false);
      }
    } catch (error: any) {
      console.error('Error starting shift:', error);
      toast.error('فشل في بدء الوردية', {
        description: error?.data?.message || 'حدث خطأ أثناء بدء الوردية'
      });
    }
  };

  const today = new Date();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Clock className="h-6 w-6 text-primary" />
            بدء الوردية
          </DialogTitle>
          <DialogDescription>
            أدخل المبلغ النقدي المتاح في بداية الوردية وأي ملاحظات إضافية
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* معلومات الوردية */}
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <div className="flex items-center gap-4">
              <div 
                className="w-16 h-16 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: shift?.color || '#3b82f6' }}
              >
                <Clock className="h-8 w-8 text-white" />
              </div>
              
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">{shift?.shiftName}</h3>
                
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{format(today, 'EEEE، d MMMM yyyy', { locale: ar })}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{shift?.startTime} - {shift?.endTime}</span>
                  </div>
                  
                  {currentUser && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="h-4 w-4" />
                      <span>{(currentUser as any).arabicName || (currentUser as any).name}</span>
                    </div>
                  )}
                  
                  {shift?.branch && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Building2 className="h-4 w-4" />
                      <span>{shift.branch.arabicName || shift.branch.englishName}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* المبلغ الافتتاحي */}
          <div className="space-y-3">
            <Label htmlFor="openingBalance" className="text-base font-semibold flex items-center gap-2">
              <Coins className="h-5 w-5 text-green-600" />
              المبلغ النقدي في بداية الوردية
            </Label>
            <div className="relative">
              <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="openingBalance"
                type="number"
                step="0.01"
                min="0"
                value={openingBalance}
                onChange={(e) => setOpeningBalance(e.target.value)}
                className="pr-10 text-xl font-bold text-center h-14"
                placeholder="0.00"
                autoFocus
              />
            </div>
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              أدخل المبلغ النقدي الموجود في الدرج في بداية الوردية
            </p>
          </div>

          {/* الملاحظات */}
          <div className="space-y-3">
            <Label htmlFor="notes" className="text-base font-semibold">
              ملاحظات (اختياري)
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="أضف أي ملاحظات حول بداية الوردية..."
              rows={3}
              className="resize-none"
            />
          </div>

          {/* تحذير إذا كانت هناك جلسة مفتوحة */}
          {currentSessionData?.data && (
            <Card className="p-4 bg-yellow-50 border-yellow-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-yellow-900 mb-1">تنبيه: يوجد جلسة مفتوحة</h4>
                  <p className="text-sm text-yellow-700">
                    لديك جلسة وردية مفتوحة بالفعل. يرجى إغلاقها قبل بدء جلسة جديدة.
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isStarting}
          >
            إلغاء
          </Button>
          <Button
            onClick={handleStartShift}
            disabled={isStarting || !!currentSessionData?.data}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            {isStarting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                جاري البدء...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                بدء الوردية
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

