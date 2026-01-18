import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Clock,
  Power,
  DollarSign,
  TrendingUp,
  Activity,
  RefreshCw
} from 'lucide-react';
import { useShift } from '@/contexts/ShiftContext';
import { useGetCurrentSessionQuery } from '@/services/shiftSessionApi';
import { useCurrentUser } from '@/contexts/CurrentUserContext';
import { useBranch } from '@/contexts/BranchContext';
import { CloseShiftDialog } from './CloseShiftDialog';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

export const CurrentShiftIndicator: React.FC = () => {
  const { currentSession, setCurrentSession } = useShift();
  const { currentUser } = useCurrentUser();
  const { selectedBranch } = useBranch();
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);

  // جلب الجلسة الحالية من الخادم مع تحديث تلقائي كل 30 ثانية
  const { data: sessionData, refetch } = useGetCurrentSessionQuery(
    {
      branchId: selectedBranch?.id,
      userId: currentUser?.id
    },
    {
      pollingInterval: 30000, // تحديث كل 30 ثانية
      skip: !currentUser?.id
    }
  );

  // تحديث الجلسة في Context عند تحديث البيانات
  useEffect(() => {
    if (sessionData?.data) {
      setCurrentSession(sessionData.data);
    }
  }, [sessionData, setCurrentSession]);

  const session = sessionData?.data || currentSession;

  if (!session || session.status !== 'open') {
    return null;
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ar-EG', {
      style: 'currency',
      currency: 'EGP',
    }).format(value);
  };

  const getElapsedTime = () => {
    const start = new Date(session.startTime);
    const now = new Date();
    const diff = now.getTime() - start.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}س ${minutes}د`;
  };

  return (
    <>
      <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div 
              className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg animate-pulse"
              style={{ backgroundColor: session.shift?.color || '#3b82f6' }}
            >
              <Clock className="h-7 w-7 text-white" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-gray-900">
                  {session.shift?.shiftName}
                </h3>
                <Badge className="bg-green-500 text-white">
                  <Activity className="h-3 w-3 ml-1 animate-pulse" />
                  نشطة
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{session.shift?.startTime} - {session.shift?.endTime}</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-600">
                  <Activity className="h-4 w-4" />
                  <span>مدة العمل: {getElapsedTime()}</span>
                </div>
                
                <div className="flex items-center gap-2 text-green-600 font-semibold">
                  <DollarSign className="h-4 w-4" />
                  <span>افتتاحي: {formatCurrency(session.openingBalance)}</span>
                </div>
                
                {(session.totalSales || 0) > 0 && (
                  <div className="flex items-center gap-2 text-blue-600 font-semibold">
                    <TrendingUp className="h-4 w-4" />
                    <span>مبيعات: {formatCurrency(session.totalSales || 0)}</span>
                  </div>
                )}
                
                {(session.transactionsCount || 0) > 0 && (
                  <div className="flex items-center gap-2 text-purple-600 font-semibold">
                    <Activity className="h-4 w-4" />
                    <span>{session.transactionsCount} عملية</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => refetch()}
              variant="outline"
              size="sm"
              className="border-green-300 text-green-700 hover:bg-green-50"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            
            <Button
              onClick={() => setCloseDialogOpen(true)}
              variant="destructive"
              className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
            >
              <Power className="h-4 w-4 mr-2" />
              إيقاف الوردية
            </Button>
          </div>
        </div>
      </Card>

      {/* نافذة إغلاق الوردية */}
      <CloseShiftDialog
        open={closeDialogOpen}
        onOpenChange={setCloseDialogOpen}
        session={session}
      />
    </>
  );
};

