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
import {
  Clock,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Calculator,
  FileText,
  X
} from 'lucide-react';
import { useCloseShiftSessionMutation } from '@/services/shiftSessionApi';
import { useShift } from '@/contexts/ShiftContext';
import { useCurrentUser } from '@/contexts/CurrentUserContext';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface CloseShiftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: any;
  onSuccess?: () => void;
}

export const CloseShiftDialog: React.FC<CloseShiftDialogProps> = ({
  open,
  onOpenChange,
  session,
  onSuccess
}) => {
  const [closingBalance, setClosingBalance] = useState<string>('');
  const [closingNotes, setClosingNotes] = useState<string>('');
  const { currentUser } = useCurrentUser();
  const { clearSession } = useShift();
  
  const [closeShiftSession, { isLoading: isClosing }] = useCloseShiftSessionMutation();

  // حساب المبلغ المتوقع
  const expectedBalance = session
    ? parseFloat(session.openingBalance || 0) + parseFloat(session.totalCash || 0)
    : 0;

  // حساب الفرق
  const difference = closingBalance
    ? parseFloat(closingBalance) - expectedBalance
    : 0;

  useEffect(() => {
    if (open && session) {
      setClosingBalance(expectedBalance.toFixed(2));
      setClosingNotes('');
    }
  }, [open, session, expectedBalance]);

  const handleCloseShift = async () => {
    if (!currentUser) {
      toast.error('لم يتم العثور على بيانات المستخدم');
      return;
    }

    const balanceValue = parseFloat(closingBalance);
    if (isNaN(balanceValue) || balanceValue < 0) {
      toast.error('يرجى إدخال مبلغ صحيح');
      return;
    }

    try {
      const response = await closeShiftSession({
        id: session.id,
        closingBalance: balanceValue,
        closedBy: currentUser.id,
        closingNotes: closingNotes.trim() || null
      }).unwrap();

      if (response.success) {
        clearSession();
        toast.success('تم إغلاق الوردية بنجاح', {
          description: `الفرق: ${formatCurrency(difference)}`
        });
        onOpenChange(false);
        
        // استدعاء callback عند النجاح إذا كان موجوداً
        if (onSuccess) {
          setTimeout(() => onSuccess(), 500);
        }
      }
    } catch (error: any) {
      console.error('Error closing shift:', error);
      
      // إذا كانت الجلسة مغلقة بالفعل، نتخطى الإغلاق وننتقل مباشرة لفتح جلسة جديدة
      if (error?.status === 400 && error?.data?.message === 'الجلسة مغلقة بالفعل') {
        clearSession();
        toast.info('الجلسة مغلقة بالفعل', {
          description: 'سيتم الانتقال لفتح جلسة جديدة'
        });
        onOpenChange(false);
        
        // استدعاء callback لفتح جلسة جديدة
        if (onSuccess) {
          setTimeout(() => onSuccess(), 500);
        }
      } else {
        toast.error('فشل في إغلاق الوردية', {
          description: error?.data?.message || 'حدث خطأ أثناء إغلاق الوردية'
        });
      }
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ar-EG', {
      style: 'currency',
      currency: 'EGP',
    }).format(value);
  };

  if (!session) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Clock className="h-6 w-6 text-primary" />
            إغلاق الوردية
          </DialogTitle>
          <DialogDescription>
            راجع تفاصيل الوردية وأدخل المبلغ النقدي الفعلي عند الإغلاق
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* معلومات الوردية */}
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
            <h3 className="font-bold text-lg mb-3">{session.shift?.shiftName}</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-600">التاريخ:</span>{' '}
                <span className="font-semibold">
                  {format(new Date(session.sessionDate), 'd MMMM yyyy', { locale: ar })}
                </span>
              </div>
              <div>
                <span className="text-gray-600">الوقت:</span>{' '}
                <span className="font-semibold">
                  {session.shift?.startTime} - {session.shift?.endTime}
                </span>
              </div>
              <div>
                <span className="text-gray-600">عدد العمليات:</span>{' '}
                <span className="font-semibold">{session.transactionsCount || 0}</span>
              </div>
              <div>
                <span className="text-gray-600">إجمالي المبيعات:</span>{' '}
                <span className="font-semibold text-green-600">
                  {formatCurrency(session.totalSales || 0)}
                </span>
              </div>
            </div>
          </Card>

          {/* تفاصيل طرق الدفع */}
          <Card className="p-4">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              تفاصيل طرق الدفع
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="bg-green-50 p-3 rounded">
                <p className="text-gray-600 text-xs mb-1">نقدي</p>
                <p className="font-bold text-green-600">
                  {formatCurrency(session.totalCash || 0)}
                </p>
              </div>
              <div className="bg-blue-50 p-3 rounded">
                <p className="text-gray-600 text-xs mb-1">بطاقة</p>
                <p className="font-bold text-blue-600">
                  {formatCurrency(session.totalCard || 0)}
                </p>
              </div>
              <div className="bg-purple-50 p-3 rounded">
                <p className="text-gray-600 text-xs mb-1">محفظة</p>
                <p className="font-bold text-purple-600">
                  {formatCurrency(session.totalWallet || 0)}
                </p>
              </div>
              <div className="bg-orange-50 p-3 rounded">
                <p className="text-gray-600 text-xs mb-1">تحويل</p>
                <p className="font-bold text-orange-600">
                  {formatCurrency(session.totalTransfer || 0)}
                </p>
              </div>
            </div>
          </Card>

          {/* حسابات الإغلاق */}
          <Card className="p-4 bg-gray-50">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              حسابات الإغلاق
            </h4>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">المبلغ الافتتاحي:</span>
                <span className="font-semibold">{formatCurrency(session.openingBalance)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">المبيعات النقدية:</span>
                <span className="font-semibold text-green-600">
                  + {formatCurrency(session.totalCash || 0)}
                </span>
              </div>
              <div className="border-t pt-3 flex justify-between items-center">
                <span className="font-semibold">المبلغ المتوقع:</span>
                <span className="text-lg font-bold text-blue-600">
                  {formatCurrency(expectedBalance)}
                </span>
              </div>
            </div>

            {/* إدخال المبلغ الفعلي */}
            <div className="space-y-3">
              <Label htmlFor="closingBalance" className="text-base font-semibold">
                المبلغ النقدي الفعلي
              </Label>
              <div className="relative">
                <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="closingBalance"
                  type="number"
                  step="0.01"
                  min="0"
                  value={closingBalance}
                  onChange={(e) => setClosingBalance(e.target.value)}
                  className="pr-10 text-xl font-bold text-center h-14"
                  placeholder="0.00"
                  autoFocus
                />
              </div>

              {/* عرض الفرق */}
              {closingBalance && (
                <Card className={`p-4 ${
                  difference === 0 
                    ? 'bg-green-50 border-green-200' 
                    : difference > 0 
                    ? 'bg-blue-50 border-blue-200' 
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {difference === 0 ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : difference > 0 ? (
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-red-600" />
                      )}
                      <span className="font-semibold">
                        {difference === 0 
                          ? 'متطابق - لا يوجد فرق' 
                          : difference > 0 
                          ? 'زيادة في النقدية' 
                          : 'نقص في النقدية'}
                      </span>
                    </div>
                    <span className={`text-2xl font-bold ${
                      difference === 0 
                        ? 'text-green-600' 
                        : difference > 0 
                        ? 'text-blue-600' 
                        : 'text-red-600'
                    }`}>
                      {formatCurrency(Math.abs(difference))}
                    </span>
                  </div>
                </Card>
              )}
            </div>
          </Card>

          {/* الملاحظات */}
          <div className="space-y-3">
            <Label htmlFor="closingNotes" className="text-base font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4" />
              ملاحظات الإغلاق (اختياري)
            </Label>
            <Textarea
              id="closingNotes"
              value={closingNotes}
              onChange={(e) => setClosingNotes(e.target.value)}
              placeholder="أضف أي ملاحظات حول إغلاق الوردية أو الفروقات..."
              rows={3}
              className="resize-none"
            />
          </div>

          {/* تحذير إذا كان هناك فرق كبير */}
          {Math.abs(difference) > 100 && (
            <Card className="p-4 bg-yellow-50 border-yellow-200">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-yellow-900 mb-1">تنبيه: فرق كبير في النقدية</h4>
                  <p className="text-sm text-yellow-700">
                    يوجد فرق كبير بين المبلغ المتوقع والفعلي. يرجى التحقق من العد مرة أخرى وإضافة ملاحظات توضيحية.
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
            disabled={isClosing}
          >
            <X className="h-4 w-4 mr-2" />
            إلغاء
          </Button>
          <Button
            onClick={handleCloseShift}
            disabled={isClosing || !closingBalance}
            className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
          >
            {isClosing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                جاري الإغلاق...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                إغلاق الوردية
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

