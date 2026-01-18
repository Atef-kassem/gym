import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Users,
  Clock,
  Star,
  Zap,
  TrendingUp,
  Play,
  Pause,
  SkipForward as Skip,
  MoreHorizontal,
  Bell,
  MessageSquare,
  Phone,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  CheckCircle,
  Timer,
  Activity,
  Target,
  BarChart3,
  Settings,
  Sparkles,
  UserCheck,
  Route
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QueueItem {
  id: string;
  ticketNumber: string;
  customer: {
    name: string;
    phone: string;
    avatar?: string;
    membershipType: 'عادي' | 'مميز' | 'VIP';
    loyaltyPoints: number;
    isReturning: boolean;
  };
  service: {
    name: string;
    duration: number;
    category: string;
    price: number;
  };
  priority: 'منخفض' | 'عادي' | 'مهم' | 'عاجل';
  estimatedWaitTime: number;
  actualWaitTime?: number;
  joinTime: Date;
  status: 'منتظر' | 'قيد المعالجة' | 'مكتمل' | 'ملغي';
  assignedTo?: string;
  notes?: string;
}

export function SmartQueueManager() {
  const { toast } = useToast();
  
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
  const [currentServing, setCurrentServing] = useState<QueueItem | null>(null);
  const [selectedItem, setSelectedItem] = useState<QueueItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [queueStats, setQueueStats] = useState({
    totalWaiting: 0,
    averageWaitTime: 0,
    currentEfficiency: 85,
    completedToday: 0,
    estimatedProcessingTime: 0
  });

  // Initialize sample queue data
  useEffect(() => {
    const sampleQueue: QueueItem[] = [
      {
        id: '1',
        ticketNumber: 'A001',
        customer: {
          name: 'أحمد محمد علي',
          phone: '0501234567',
          membershipType: 'VIP',
          loyaltyPoints: 1250,
          isReturning: true,
          avatar: '/avatars/ahmed.jpg'
        },
        service: {
          name: '  VIP شامل',
          duration: 45,
          category: ' ',
          price: 85
        },
        priority: 'عاجل',
        estimatedWaitTime: 5,
        joinTime: new Date(Date.now() - 10 * 60 * 1000),
        status: 'منتظر',
        assignedTo: 'محمد أحمد'
      },
      {
        id: '2',
        ticketNumber: 'A002',
        customer: {
          name: 'فاطمة سعد',
          phone: '0509876543',
          membershipType: 'مميز',
          loyaltyPoints: 650,
          isReturning: false
        },
        service: {
          name: '  خارجي + تلميع',
          duration: 30,
          category: ' ',
          price: 45
        },
        priority: 'مهم',
        estimatedWaitTime: 15,
        joinTime: new Date(Date.now() - 15 * 60 * 1000),
        status: 'منتظر'
      },
      {
        id: '3',
        ticketNumber: 'A003',
        customer: {
          name: 'محمد عبدالله',
          phone: '0507654321',
          membershipType: 'عادي',
          loyaltyPoints: 120,
          isReturning: true
        },
        service: {
          name: 'تنظيف داخلي',
          duration: 25,
          category: 'تنظيف',
          price: 35
        },
        priority: 'عادي',
        estimatedWaitTime: 25,
        joinTime: new Date(Date.now() - 8 * 60 * 1000),
        status: 'منتظر'
      }
    ];
    
    setQueueItems(sampleQueue);
    setCurrentServing(sampleQueue[0]);
  }, []);

  // Update queue statistics
  useEffect(() => {
    const waiting = queueItems.filter(item => item.status === 'منتظر').length;
    const totalTime = queueItems
      .filter(item => item.status === 'منتظر')
      .reduce((sum, item) => sum + item.estimatedWaitTime, 0);
    
    setQueueStats({
      totalWaiting: waiting,
      averageWaitTime: waiting > 0 ? Math.round(totalTime / waiting) : 0,
      currentEfficiency: 85 + Math.random() * 10,
      completedToday: queueItems.filter(item => item.status === 'مكتمل').length + 12,
      estimatedProcessingTime: totalTime
    });
  }, [queueItems]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'عاجل': return 'bg-red-500 text-white';
      case 'مهم': return 'bg-orange-500 text-white';
      case 'عادي': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getMembershipColor = (type: string) => {
    switch (type) {
      case 'VIP': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'مميز': return 'bg-purple-100 text-purple-800 border-purple-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const handleNextCustomer = () => {
    if (currentServing) {
      setQueueItems(prev => 
        prev.map(item => 
          item.id === currentServing.id 
            ? { ...item, status: 'مكتمل' as const }
            : item
        )
      );
    }
    
    const nextCustomer = queueItems.find(item => item.status === 'منتظر');
    setCurrentServing(nextCustomer || null);
    
    toast({
      title: "تم الانتهاء من العميل",
      description: nextCustomer ? `الآن يتم خدمة: ${nextCustomer.customer.name}` : "لا يوجد عملاء في الانتظار",
    });
  };

  const handleSkipCustomer = (itemId: string) => {
    setQueueItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, estimatedWaitTime: item.estimatedWaitTime + 10, priority: 'عاجل' as const }
          : item
      )
    );
    
    toast({
      title: "تم تأجيل العميل",
      description: "تم إعطاء العميل أولوية عالية",
      variant: "destructive"
    });
  };

  const handlePriorityChange = (itemId: string, newPriority: QueueItem['priority']) => {
    setQueueItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, priority: newPriority } : item
      )
    );
    
    // Re-sort queue based on priority
    setQueueItems(prev => [...prev].sort((a, b) => {
      const priorityOrder = { 'عاجل': 4, 'مهم': 3, 'عادي': 2, 'منخفض': 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }));
    
    toast({
      title: "تم تحديث الأولوية",
      description: `تم تغيير الأولوية إلى ${newPriority}`,
    });
  };

  const getWaitTimeColor = (waitTime: number) => {
    if (waitTime <= 10) return 'text-green-600';
    if (waitTime <= 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  const currentWaitingItems = queueItems
    .filter(item => item.status === 'منتظر')
    .sort((a, b) => {
      const priorityOrder = { 'عاجل': 4, 'مهم': 3, 'عادي': 2, 'منخفض': 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 animate-scale-in">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">في الانتظار</p>
                <p className="text-2xl font-bold text-blue-900">{queueStats.totalWaiting}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 animate-scale-in">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">متوسط الانتظار</p>
                <p className="text-2xl font-bold text-green-900">{queueStats.averageWaitTime} د</p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 animate-scale-in">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">الكفاءة</p>
                <p className="text-2xl font-bold text-purple-900">{queueStats.currentEfficiency.toFixed(0)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 animate-scale-in">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">مكتمل اليوم</p>
                <p className="text-2xl font-bold text-orange-900">{queueStats.completedToday}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 animate-scale-in">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">الوقت الإجمالي</p>
                <p className="text-2xl font-bold text-red-900">{queueStats.estimatedProcessingTime} د</p>
              </div>
              <Timer className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Customer */}
        <Card className="animate-slide-in-right">
          <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5 text-green-600" />
              العميل الحالي
              <Badge className="bg-green-600 text-white animate-pulse">
                <Activity className="h-3 w-3 mr-1" />
                قيد الخدمة
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {currentServing ? (
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16 ring-4 ring-green-200">
                    <AvatarImage src={currentServing.customer.avatar} />
                    <AvatarFallback className="bg-green-100 text-green-600 text-lg font-bold">
                      {currentServing.customer.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-lg">{currentServing.customer.name}</h3>
                      <Badge className={`${getMembershipColor(currentServing.customer.membershipType)} text-xs`}>
                        {currentServing.customer.membershipType}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">{currentServing.customer.phone}</p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">التذكرة:</span>
                        <Badge variant="outline" className="font-mono">
                          {currentServing.ticketNumber}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">الخدمة:</span>
                        <span className="text-sm">{currentServing.service.name}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">المدة المتوقعة:</span>
                        <span className="text-sm">{currentServing.service.duration} دقيقة</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={handleNextCustomer}
                    className="flex-1 bg-green-600 hover:bg-green-700 transition-all duration-300 hover:scale-105"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    إنهاء وانتقال للتالي
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="transition-all duration-300 hover:scale-105"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="transition-all duration-300 hover:scale-105"
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>لا يوجد عميل قيد الخدمة حالياً</p>
                <Button size="sm" className="mt-3">
                  <Play className="h-4 w-4 mr-2" />
                  بدء خدمة العميل التالي
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Queue List */}
        <div className="lg:col-span-2">
          <Card className="animate-slide-in-right">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  طابور الانتظار
                  <Badge variant="outline" className="animate-pulse">
                    {currentWaitingItems.length} عميل
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="transition-all duration-300 hover:scale-105">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="transition-all duration-300 hover:scale-105">
                    <Bell className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-6">
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {currentWaitingItems.length > 0 ? (
                  currentWaitingItems.map((item, index) => (
                    <div
                      key={item.id}
                      className={`p-4 rounded-lg border-2 transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer animate-scale-in ${
                        index === 0 ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white hover:border-blue-300'
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                      onClick={() => {
                        setSelectedItem(item);
                        setIsDialogOpen(true);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col items-center">
                            <Badge variant="outline" className="font-mono text-xs mb-1">
                              {item.ticketNumber}
                            </Badge>
                            <span className="text-xs text-muted-foreground">#{index + 1}</span>
                          </div>
                          
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={item.customer.avatar} />
                            <AvatarFallback className="text-sm">
                              {item.customer.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-sm">{item.customer.name}</h4>
                              <Badge className={`${getMembershipColor(item.customer.membershipType)} text-xs`}>
                                {item.customer.membershipType}
                              </Badge>
                              {item.customer.isReturning && (
                                <Badge variant="outline" className="text-xs">
                                  <UserCheck className="h-3 w-3 mr-1" />
                                  عائد
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">{item.service.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className={`text-xs font-medium ${getWaitTimeColor(item.estimatedWaitTime)}`}>
                                ~{item.estimatedWaitTime} دقيقة
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge className={`${getPriorityColor(item.priority)} text-xs`}>
                            {item.priority}
                          </Badge>
                          
                          <div className="flex flex-col gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePriorityChange(item.id, 'عاجل');
                              }}
                              className="h-6 w-6 p-0 transition-all duration-300 hover:scale-110"
                            >
                              <ArrowUp className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSkipCustomer(item.id);
                              }}
                              className="h-6 w-6 p-0 transition-all duration-300 hover:scale-110"
                            >
                              <Skip className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground animate-fade-in">
                    <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>الطابور فارغ حالياً</p>
                    <p className="text-sm">جميع العملاء تم خدمتهم!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Customer Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="animate-scale-in">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              تفاصيل العميل
            </DialogTitle>
          </DialogHeader>
          
          {selectedItem && (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedItem.customer.avatar} />
                  <AvatarFallback className="text-lg font-bold">
                    {selectedItem.customer.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-lg">{selectedItem.customer.name}</h3>
                    <Badge className={getMembershipColor(selectedItem.customer.membershipType)}>
                      {selectedItem.customer.membershipType}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">{selectedItem.customer.phone}</p>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <span>نقاط الولاء: <strong>{selectedItem.customer.loyaltyPoints}</strong></span>
                    {selectedItem.customer.isReturning && (
                      <Badge variant="outline" className="text-xs">
                        <UserCheck className="h-3 w-3 mr-1" />
                        عميل عائد
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">رقم التذكرة</label>
                  <p className="font-mono font-bold">{selectedItem.ticketNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">الخدمة</label>
                  <p className="font-semibold">{selectedItem.service.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">المدة المتوقعة</label>
                  <p className="font-semibold">{selectedItem.service.duration} دقيقة</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">السعر</label>
                  <p className="font-semibold">{selectedItem.service.price} جنيه</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-muted-foreground">الأولوية:</label>
                <Badge className={getPriorityColor(selectedItem.priority)}>
                  {selectedItem.priority}
                </Badge>
              </div>
              
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  onClick={() => {
                    setCurrentServing(selectedItem);
                    setQueueItems(prev => 
                      prev.map(item => 
                        item.id === selectedItem.id 
                          ? { ...item, status: 'قيد المعالجة' as const }
                          : item
                      )
                    );
                    setIsDialogOpen(false);
                    toast({
                      title: "تم بدء الخدمة",
                      description: `بدء خدمة العميل ${selectedItem.customer.name}`,
                    });
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700 transition-all duration-300 hover:scale-105"
                >
                  <Play className="h-4 w-4 mr-2" />
                  بدء الخدمة الآن
                </Button>
                <Button
                  onClick={() => handlePriorityChange(selectedItem.id, 'عاجل')}
                  variant="outline"
                  className="flex-1 transition-all duration-300 hover:scale-105"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  أولوية عالية
                </Button>
                <Button
                  onClick={() => {
                    setQueueItems(prev => prev.filter(item => item.id !== selectedItem.id));
                    setIsDialogOpen(false);
                    toast({
                      title: "تم إزالة العميل",
                      description: "تم إزالة العميل من الطابور",
                      variant: "destructive"
                    });
                  }}
                  variant="destructive"
                  className="transition-all duration-300 hover:scale-105"
                >
                  <AlertTriangle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}