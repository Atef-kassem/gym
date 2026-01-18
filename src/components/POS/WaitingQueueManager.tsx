import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Users, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WaitingItem {
  id: number;
  customer: {
    name: string;
    phone: string;
  };
  vehicle: {
    plate: string;
    type: string;
    model: string;
  };
  preferredPath: string;
  waitingSince: Date;
  estimatedWaitTime: number;
  assigned?: boolean;
  assignedAt?: Date;
}

interface ServicePath {
  id: string;
  name: string;
  status: 'available' | 'busy' | 'maintenance' | 'cleaning';
  waitTime: number | null;
  disabled: boolean;
}

interface WaitingQueueManagerProps {
  servicePaths: ServicePath[];
  onVehicleAssigned?: (item: WaitingItem) => void;
}

export const WaitingQueueManager: React.FC<WaitingQueueManagerProps> = ({
  servicePaths,
  onVehicleAssigned
}) => {
  const [waitingQueue, setWaitingQueue] = useState<WaitingItem[]>([]);
  const { toast } = useToast();

  // إضافة مشروب لقائمة الانتظار
  const addToWaitingQueue = (customer: any, vehicle: any, preferredPath: string) => {
    const waitingItem: WaitingItem = {
      id: Date.now(),
      customer,
      vehicle,
      preferredPath,
      waitingSince: new Date(),
      estimatedWaitTime: getEstimatedWaitTime(preferredPath)
    };
    
    setWaitingQueue(prev => [...prev, waitingItem]);
    
    toast({
      title: "تم إضافة المشروب لقائمة الانتظار",
      description: `سيتم إشعارك عند توفر ${servicePaths.find(p => p.id === preferredPath)?.name}`,
      duration: 5000
    });

    return waitingItem;
  };

  // حساب وقت الانتظار المتوقع
  const getEstimatedWaitTime = (pathId: string) => {
    const path = servicePaths.find(p => p.id === pathId);
    return path?.waitTime || 15;
  };

  // ربط تلقائي للمشروبات المنتظرة عند توفر مسار
  const checkAndAssignWaitingVehicles = () => {
    const availablePaths = servicePaths.filter(path => path.status === 'available');
    let updatedQueue = [...waitingQueue];
    
    availablePaths.forEach(path => {
      const waitingForThisPath = updatedQueue.find(item => 
        item.preferredPath === path.id && !item.assigned
      );
      
      if (waitingForThisPath) {
        waitingForThisPath.assigned = true;
        waitingForThisPath.assignedAt = new Date();
        
        toast({
          title: "🎉 مسار متاح الآن!",
          description: `تم ربط ${waitingForThisPath.customer.name} بـ ${path.name}`,
          duration: 5000
        });
        
        onVehicleAssigned?.(waitingForThisPath);
      }
    });
    
    setWaitingQueue(updatedQueue);
  };

  // فحص دوري للمسارات المتاحة
  useEffect(() => {
    const interval = setInterval(checkAndAssignWaitingVehicles, 10000);
    return () => clearInterval(interval);
  }, [waitingQueue, servicePaths]);

  // إزالة  الكافية المكتملة من القائمة
  const removeCompletedVehicles = () => {
    setWaitingQueue(prev => prev.filter(item => !item.assigned || 
      (item.assignedAt && Date.now() - item.assignedAt.getTime() < 60000)
    ));
  };

  // حساب وقت الانتظار الفعلي
  const getActualWaitTime = (item: WaitingItem) => {
    return Math.floor((Date.now() - item.waitingSince.getTime()) / 60000);
  };

  return (
    <div className="space-y-4">
      {/* قائمة الانتظار */}
      {waitingQueue.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Users className="h-5 w-5" />
              قائمة الانتظار ({waitingQueue.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {waitingQueue.slice(0, 5).map((item) => (
                <div 
                  key={item.id} 
                  className="flex justify-between items-center p-3 bg-white rounded-lg border border-blue-200"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-blue-900">
                      {item.customer.name}
                    </span>
                    <span className="text-sm text-blue-700">
                      {item.vehicle.plate} - {item.vehicle.type} {item.vehicle.model}
                    </span>
                    <span className="text-xs text-blue-600">
                      {servicePaths.find(p => p.id === item.preferredPath)?.name}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    {item.assigned ? (
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        تم الربط
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-orange-300 text-orange-700">
                        <Clock className="h-3 w-3 mr-1" />
                        {getActualWaitTime(item)} د
                      </Badge>
                    )}
                    <span className="text-xs text-gray-500 mt-1">
                      متوقع: {item.estimatedWaitTime} د
                    </span>
                  </div>
                </div>
              ))}
              {waitingQueue.length > 5 && (
                <p className="text-center text-sm text-blue-600">
                  وأكثر من {waitingQueue.length - 5} سيارات في الانتظار...
                </p>
              )}
            </div>
            <div className="mt-4 pt-3 border-t border-blue-200">
              <Button 
                onClick={removeCompletedVehicles}
                variant="outline"
                size="sm"
                className="text-blue-700 border-blue-300"
              >
                تنظيف القائمة
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Hook لاستخدام نظام قائمة الانتظار
export const useWaitingQueue = (servicePaths: ServicePath[]) => {
  const [waitingQueue, setWaitingQueue] = useState<WaitingItem[]>([]);
  const { toast } = useToast();

  const addToWaitingQueue = (customer: any, vehicle: any, preferredPath: string) => {
    const waitingItem: WaitingItem = {
      id: Date.now(),
      customer,
      vehicle,
      preferredPath,
      waitingSince: new Date(),
      estimatedWaitTime: servicePaths.find(p => p.id === preferredPath)?.waitTime || 15
    };
    
    setWaitingQueue(prev => [...prev, waitingItem]);
    
    toast({
      title: "تم إضافة المشروب لقائمة الانتظار",
      description: `سيتم إشعارك عند توفر ${servicePaths.find(p => p.id === preferredPath)?.name}`,
      duration: 5000
    });

    return waitingItem;
  };

  const isPathBusy = (pathId: string) => {
    const path = servicePaths.find(p => p.id === pathId);
    return path && (path.status === 'busy' || path.status === 'cleaning');
  };

  return {
    waitingQueue,
    addToWaitingQueue,
    isPathBusy
  };
};