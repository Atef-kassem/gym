import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Clock,
  CheckCircle,
  AlertCircle,
  Timer,
  Building2,
  PlayCircle
} from 'lucide-react';
import { useGetAllShiftsQuery } from '@/services/shiftApi';
import { useShift } from '@/contexts/ShiftContext';
import { StartShiftDialog } from '@/components/Shifts/StartShiftDialog';
import { CloseShiftDialog } from '@/components/Shifts/CloseShiftDialog';
import { toast } from 'sonner';

interface ShiftSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  branchId?: number;
}

export const ShiftSelectionDialog: React.FC<ShiftSelectionDialogProps> = ({
  open,
  onOpenChange,
  branchId
}) => {
  const { data: shiftsData, isLoading } = useGetAllShiftsQuery({
    isActive: true,
    ...(branchId && { branchId })
  });
  const { selectedShift, setSelectedShift, currentSession } = useShift();
  const [tempSelectedShift, setTempSelectedShift] = useState<any>(null);
  const [startDialogOpen, setStartDialogOpen] = useState(false);
  const [shiftToStart, setShiftToStart] = useState<any>(null);
  const [showShiftsList, setShowShiftsList] = useState(false);
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  const [closeAndStartNewShift, setCloseAndStartNewShift] = useState<any>(null);

  const shifts = shiftsData?.data || [];

  // إعادة تعيين الحالة عند فتح النافذة
  useEffect(() => {
    if (open) {
      setShowShiftsList(false);
      setTempSelectedShift(null);
    }
  }, [open]);

  const getCurrentTime = () => {
    const now = new Date();
    return now.toTimeString().split(' ')[0];
  };

  const isShiftActive = (shift: any) => {
    const currentTime = getCurrentTime();
    return currentTime >= shift.startTime && currentTime <= shift.endTime;
  };

  const handleSelectShift = (shift: any) => {
    setTempSelectedShift(shift);
  };

  const handleConfirm = () => {
    if (!tempSelectedShift) {
      toast.error('يرجى اختيار الوردية أولاً');
      return;
    }

    // إذا كان هناك جلسة مفتوحة، نطلب الإغلاق أولاً
    if (currentSession && currentSession.status === 'open' && showShiftsList) {
      setCloseAndStartNewShift(tempSelectedShift);
      setCloseDialogOpen(true);
      return;
    }

    // إذا لم تكن هناك جلسة مفتوحة، نبدأ مباشرة
    setShiftToStart(tempSelectedShift);
    setStartDialogOpen(true);
  };

  const handleCloseSuccess = () => {
    // بعد إغلاق الوردية بنجاح، نبدأ الوردية الجديدة
    if (closeAndStartNewShift) {
      setShiftToStart(closeAndStartNewShift);
      setStartDialogOpen(true);
      setCloseAndStartNewShift(null);
    }
  };

  const handleChangeShift = () => {
    setShowShiftsList(true);
    setTempSelectedShift(null);
    toast.info('اختر الوردية الجديدة من القائمة أدناه');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Clock className="h-6 w-6 text-primary" />
            اختيار وبدء الوردية
          </DialogTitle>
          <DialogDescription>
            اختر الوردية المناسبة لوقت عملك الحالي. سيتم ربط جميع المبيعات والبيع بجلسة هذه الوردية.
            <br />
            <span className="text-blue-600 font-medium">
              💡 يمكنك تغيير الوردية في أي وقت عن طريق زر "تغيير الوردية"
            </span>
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : shifts.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">لا توجد ورديات متاحة</h3>
            <p className="text-muted-foreground">يرجى إضافة ورديات أولاً من إعدادات النظام</p>
          </div>
        ) : (
          <>
            {currentSession && currentSession.status === 'open' && (
              <Card className="p-4 bg-green-50 border-green-200 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: currentSession.shift?.color || '#3b82f6' }}
                    >
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-900">الوردية الحالية المفتوحة</h4>
                      <p className="text-sm text-green-700">{currentSession.shift?.shiftName}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-green-600">
                        <Timer className="h-3 w-3" />
                        <span>{currentSession.shift?.startTime} - {currentSession.shift?.endTime}</span>
                      </div>
                      <div className="mt-1 text-xs text-green-600">
                        المبلغ الافتتاحي: {currentSession.openingBalance} ج.م
                      </div>
                    </div>
                  </div>
                  {!showShiftsList && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleChangeShift}
                      className="border-green-300 text-green-700 hover:bg-green-100"
                    >
                      تغيير الوردية
                    </Button>
                  )}
                  {showShiftsList && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowShiftsList(false)}
                      className="border-red-300 text-red-700 hover:bg-red-100"
                    >
                      إلغاء التغيير
                    </Button>
                  )}
                </div>
              </Card>
            )}

            {(!currentSession || currentSession.status !== 'open' || showShiftsList) && (
              <>
                {showShiftsList && currentSession && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800 font-medium">
                      ℹ️ اختر الوردية الجديدة التي تريد العمل عليها
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      سيتم إغلاق الوردية الحالية تلقائياً وبدء الوردية الجديدة
                    </p>
                  </div>
                )}
                <div className="grid gap-4">
                  {shifts.map((shift: any) => {
                    const isActive = isShiftActive(shift);
                    const isSelected = tempSelectedShift?.id === shift.id;

                    return (
                      <Card
                        key={shift.id}
                        className={`p-4 cursor-pointer transition-all duration-300 ${
                          isSelected
                            ? 'ring-2 ring-primary bg-primary/5'
                            : 'hover:shadow-md hover:border-primary/50'
                        }`}
                        onClick={() => handleSelectShift(shift)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-16 h-16 rounded-xl flex items-center justify-center transition-transform ${
                                isSelected ? 'scale-110' : ''
                              }`}
                              style={{ backgroundColor: shift.color || '#3b82f6' }}
                            >
                              <Clock className="h-8 w-8 text-white" />
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-semibold">{shift.shiftName}</h3>
                                {isActive && (
                                  <Badge className="bg-green-500 text-white">
                                    نشطة الآن
                                  </Badge>
                                )}
                                {isSelected && (
                                  <CheckCircle className="h-5 w-5 text-primary" />
                                )}
                              </div>

                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Timer className="h-4 w-4" />
                                  <span>{shift.startTime} - {shift.endTime}</span>
                                </div>
                                
                                {shift.branch && (
                                  <div className="flex items-center gap-1">
                                    <Building2 className="h-4 w-4" />
                                    <span>{shift.branch.arabicName || shift.branch.englishName}</span>
                                  </div>
                                )}
                              </div>

                              {shift.description && (
                                <p className="text-sm text-muted-foreground mt-2">
                                  {shift.description}
                                </p>
                              )}
                            </div>
                          </div>

                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                              isSelected
                                ? 'border-primary bg-primary'
                                : 'border-gray-300'
                            }`}
                          >
                            {isSelected && (
                              <CheckCircle className="h-4 w-4 text-white" />
                            )}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </>
            )}

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setShowShiftsList(false);
                  setTempSelectedShift(null);
                  onOpenChange(false);
                }}
              >
                إلغاء
              </Button>
              {(!currentSession || currentSession.status !== 'open' || showShiftsList) && (
                <Button
                  onClick={handleConfirm}
                  disabled={!tempSelectedShift}
                  className="bg-primary hover:bg-primary/90"
                >
                  <PlayCircle className="h-4 w-4 mr-2" />
                  {currentSession && currentSession.status === 'open' && showShiftsList 
                    ? 'إغلاق الحالية وبدء الجديدة'
                    : 'بدء الوردية'
                  }
                </Button>
              )}
            </div>
          </>
        )}
      </DialogContent>

      {/* نافذة إغلاق الوردية الحالية */}
      <CloseShiftDialog
        open={closeDialogOpen}
        onOpenChange={(open) => {
          setCloseDialogOpen(open);
          if (!open && !closeAndStartNewShift) {
            setTempSelectedShift(null);
            setShowShiftsList(false);
          }
        }}
        session={currentSession}
        onSuccess={handleCloseSuccess}
      />

      {/* نافذة بدء الوردية الجديدة */}
      {shiftToStart && (
        <StartShiftDialog
          open={startDialogOpen}
          onOpenChange={(open) => {
            setStartDialogOpen(open);
            if (!open) {
              setShiftToStart(null);
              setTempSelectedShift(null);
              setShowShiftsList(false);
              setCloseAndStartNewShift(null);
              onOpenChange(false);
            }
          }}
          shift={shiftToStart}
          branchId={branchId}
        />
      )}
    </Dialog>
  );
};
