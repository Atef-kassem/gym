import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  RefreshCw,
  CheckCircle,
  AlertCircle,
  DollarSign,
  ShoppingCart,
  Calendar as CalendarIcon,
  Download,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';
import { useSyncRevenuesMutation } from '@/store/revenuesApi';

export const SalesRevenueSync: React.FC = () => {
  const [startDate, setStartDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [lastSyncResult, setLastSyncResult] = useState<any>(null);

  const [syncRevenues, { isLoading: isSyncing }] = useSyncRevenuesMutation();

  const handleSync = async () => {
    try {
      const response = await syncRevenues({
        startDate,
        endDate
      }).unwrap();

      if (response.status === 'success') {
        setLastSyncResult(response.data);
        toast.success(response.message, {
          description: `تم مزامنة ${response.data.syncedCount} إيراد`
        });
      }
    } catch (error: any) {
      console.error('Error syncing revenues:', error);
      toast.error('فشل في المزامنة', {
        description: error?.data?.message || 'حدث خطأ أثناء المزامنة'
      });
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            مزامنة الإيرادات من المبيعات والبيع
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            يتم استيراد جميع إيصالات البيع والبيع المكتملة كإيرادات تلقائياً
          </p>
        </div>
        {lastSyncResult && (
          <Badge className="bg-green-500">
            <CheckCircle className="h-3 w-3 ml-1" />
            آخر مزامنة: {lastSyncResult.syncedCount} إيراد
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <Label htmlFor="startDate" className="text-sm">من تاريخ</Label>
          <Input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="endDate" className="text-sm">إلى تاريخ</Label>
          <Input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1"
          />
        </div>

        <div className="flex items-end">
          <Button
            onClick={handleSync}
            disabled={isSyncing}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isSyncing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                جاري المزامنة...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                مزامنة الإيرادات
              </>
            )}
          </Button>
        </div>
      </div>

      {lastSyncResult && (
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-blue-200">
          <div className="bg-white rounded-lg p-3 text-center">
            <p className="text-xs text-gray-600 mb-1">إيصالات البيع</p>
            <p className="text-lg font-bold text-blue-600">{lastSyncResult.quickSalesCount}</p>
          </div>
          <div className="bg-white rounded-lg p-3 text-center">
            <p className="text-xs text-gray-600 mb-1">البيع</p>
            <p className="text-lg font-bold text-green-600">{lastSyncResult.bookingsCount}</p>
          </div>
          <div className="bg-white rounded-lg p-3 text-center">
            <p className="text-xs text-gray-600 mb-1">تم المزامنة</p>
            <p className="text-lg font-bold text-purple-600">{lastSyncResult.syncedCount}</p>
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-blue-100 rounded-lg text-sm text-blue-800">
        <AlertCircle className="h-4 w-4 inline ml-2" />
        يتم استيراد فقط العمليات التي لم يتم تسجيلها مسبقاً لتجنب التكرار
      </div>
    </Card>
  );
};

