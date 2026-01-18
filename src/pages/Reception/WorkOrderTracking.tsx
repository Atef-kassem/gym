import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Clock, 
  CheckCircle, 
  Play,
  Pause,
  StopCircle,
  User,
  Car,
  Timer,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  Activity
} from "lucide-react";

interface WorkOrder {
  id: string;
  ticketNumber: string;
  customerName: string;
  customerPhone: string;
  vehicleModel: string;
  plateNumber: string;
  services: string[];
  totalAmount: number;
  status: "pending" | "in-progress" | "paused" | "completed" | "cancelled";
  priority: "high" | "normal" | "low";
  startTime: string | null;
  estimatedCompletion: string;
  assignedEmployee: string | null;
  assignedPath: string;
  progress: number;
  createdAt: string;
}

interface ServicePath {
  id: number;
  name: string;
  capacity: number;
  current: number;
  efficiency: number;
  orders: WorkOrder[];
}

const mockServicePaths: ServicePath[] = [
  {
    id: 1,
    name: "مسار ال  السريع",
    capacity: 8,
    current: 5,
    efficiency: 85,
    orders: [
      {
        id: "WO-001",
        ticketNumber: "A001",
        customerName: "أحمد محمد",
        customerPhone: "0501234567",
        vehicleModel: "تويوتا كامري 2023",
        plateNumber: "ب س د - 1234",
        services: ["  خارجي"],
        totalAmount: 15,
        status: "in-progress",
        priority: "normal",
        startTime: "09:30",
        estimatedCompletion: "09:45",
        assignedEmployee: "محمد أحمد",
        assignedPath: "مسار ال  السريع",
        progress: 75,
        createdAt: "2024-01-15T09:30:00"
      },
      {
        id: "WO-002",
        ticketNumber: "A002",
        customerName: "فاطمة علي",
        customerPhone: "0509876543",
        vehicleModel: "هوندا أكورد 2021",
        plateNumber: "ج ك ل - 5678",
        services: ["  خارجي"],
        totalAmount: 15,
        status: "pending",
        priority: "normal",
        startTime: null,
        estimatedCompletion: "10:00",
        assignedEmployee: null,
        assignedPath: "مسار ال  السريع",
        progress: 0,
        createdAt: "2024-01-15T09:45:00"
      }
    ]
  },
  {
    id: 2,
    name: "مسار ال  الشامل",
    capacity: 6,
    current: 3,
    efficiency: 92,
    orders: [
      {
        id: "WO-003",
        ticketNumber: "A003",
        customerName: "سعد الخالد",
        customerPhone: "0551234567",
        vehicleModel: "لكزس ES 2022",
        plateNumber: "د ه و - 9876",
        services: ["  شامل", "تنظيف داخلي"],
        totalAmount: 45,
        status: "in-progress",
        priority: "high",
        startTime: "09:15",
        estimatedCompletion: "10:00",
        assignedEmployee: "علي محمد",
        assignedPath: "مسار ال  الشامل",
        progress: 60,
        createdAt: "2024-01-15T09:15:00"
      }
    ]
  },
  {
    id: 3,
    name: "مسار VIP",
    capacity: 4,
    current: 2,
    efficiency: 95,
    orders: [
      {
        id: "WO-004",
        ticketNumber: "A004",
        customerName: "نورا السعيد",
        customerPhone: "0561234567",
        vehicleModel: "BMW X5 2023",
        plateNumber: "ز ح ط - 1111",
        services: ["  VIP", "تنظيف داخلي", "تلميع"],
        totalAmount: 120,
        status: "in-progress",
        priority: "high",
        startTime: "09:00",
        estimatedCompletion: "10:15",
        assignedEmployee: "فهد الخالد",
        assignedPath: "مسار VIP",
        progress: 40,
        createdAt: "2024-01-15T09:00:00"
      }
    ]
  },
  {
    id: 4,
    name: "مسار الصيانة",
    capacity: 5,
    current: 1,
    efficiency: 88,
    orders: [
      {
        id: "WO-005",
        ticketNumber: "A005",
        customerName: "خالد الأحمد",
        customerPhone: "0571234567",
        vehicleModel: "فورد F-150 2021",
        plateNumber: "ي ك ل - 2222",
        services: ["تغيير زيت", "فحص عام"],
        totalAmount: 150,
        status: "pending",
        priority: "normal",
        startTime: null,
        estimatedCompletion: "11:00",
        assignedEmployee: "سارة محمد",
        assignedPath: "مسار الصيانة",
        progress: 0,
        createdAt: "2024-01-15T09:30:00"
      }
    ]
  }
];

const statusConfig = {
  pending: { label: "في الانتظار", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  "in-progress": { label: "قيد التنفيذ", color: "bg-blue-100 text-blue-800", icon: Play },
  paused: { label: "متوقف مؤقتاً", color: "bg-orange-100 text-orange-800", icon: Pause },
  completed: { label: "مكتمل", color: "bg-green-100 text-green-800", icon: CheckCircle },
  cancelled: { label: "ملغي", color: "bg-red-100 text-red-800", icon: StopCircle }
};

const priorityConfig = {
  high: { label: "عالية", color: "bg-red-100 text-red-800" },
  normal: { label: "عادية", color: "bg-gray-100 text-gray-800" },
  low: { label: "منخفضة", color: "bg-green-100 text-green-800" }
};

export default function WorkOrderTracking() {
  const [servicePaths, setServicePaths] = useState<ServicePath[]>(mockServicePaths);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { toast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate overall statistics
  const totalOrders = servicePaths.reduce((sum, path) => sum + path.orders.length, 0);
  const totalCapacity = servicePaths.reduce((sum, path) => sum + path.capacity, 0);
  const totalCurrent = servicePaths.reduce((sum, path) => sum + path.current, 0);
  const averageEfficiency = servicePaths.reduce((sum, path) => sum + path.efficiency, 0) / servicePaths.length;
  const activeOrders = servicePaths.reduce((sum, path) => 
    sum + path.orders.filter(order => order.status === "in-progress").length, 0
  );

  const getPathUtilization = (path: ServicePath) => {
    return Math.round((path.current / path.capacity) * 100);
  };

  const updateOrderStatus = (pathId: number, orderId: string, newStatus: WorkOrder["status"]) => {
    setServicePaths(prev => prev.map(path => 
      path.id === pathId 
        ? {
            ...path,
            orders: path.orders.map(order => 
              order.id === orderId 
                ? { ...order, status: newStatus }
                : order
            )
          }
        : path
    ));

    toast({
      title: "تم تحديث الحالة",
      description: `تم تغيير حالة الطلب إلى ${statusConfig[newStatus].label}`
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center animate-slide-in-right">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            تتبع أوامر العمل
          </h1>
          <p className="text-muted-foreground animate-fade-in" style={{animationDelay: '200ms'}}>
            مراقبة تقدم العمل في جميع المسارات
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{currentTime.toLocaleTimeString('ar-SA')}</span>
            </div>
          </div>
          
          <Button variant="outline" size="sm" className="hover-scale">
            <RefreshCw className="h-4 w-4 ml-2" />
            تحديث
          </Button>
        </div>
      </div>

      {/* Overall Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in" style={{animationDelay: '300ms'}}>
        <Card className="hover:shadow-lg transition-all duration-300 hover-scale">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Activity className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{totalOrders}</p>
                <p className="text-sm text-muted-foreground">إجمالي الطلبات</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-all duration-300 hover-scale">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Play className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{activeOrders}</p>
                <p className="text-sm text-muted-foreground">قيد التنفيذ</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-all duration-300 hover-scale">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">{Math.round(averageEfficiency)}%</p>
                <p className="text-sm text-muted-foreground">متوسط الكفاءة</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-all duration-300 hover-scale">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertCircle className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">{Math.round((totalCurrent / totalCapacity) * 100)}%</p>
                <p className="text-sm text-muted-foreground">الاستغلال العام</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Paths */}
      <div className="grid gap-6 animate-fade-in" style={{animationDelay: '400ms'}}>
        {servicePaths.map((path, index) => (
          <Card key={path.id} className="hover:shadow-lg transition-all duration-300 animate-slide-in-up" style={{animationDelay: `${500 + index * 100}ms`}}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    {path.name}
                    <Badge variant="outline" className="text-xs">
                      {path.current}/{path.capacity}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    كفاءة المسار: {path.efficiency}% | الاستغلال: {getPathUtilization(path)}%
                  </CardDescription>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">معدل الاستغلال</p>
                    <Progress value={getPathUtilization(path)} className="w-24" />
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {path.orders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                  <p>لا توجد أوامر عمل في هذا المسار</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {path.orders.map((order) => {
                    const statusInfo = statusConfig[order.status];
                    const priorityInfo = priorityConfig[order.priority];
                    const StatusIcon = statusInfo.icon;
                    
                    return (
                      <Card key={order.id} className="border-l-4 border-l-primary">
                        <CardContent className="p-4">
                          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                            {/* Order Basic Info */}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="text-xs font-mono">
                                  {order.ticketNumber}
                                </Badge>
                                <Badge className={priorityInfo.color}>
                                  {priorityInfo.label}
                                </Badge>
                                <Badge className={statusInfo.color}>
                                  <StatusIcon className="h-3 w-3 ml-1" />
                                  {statusInfo.label}
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <h4 className="font-semibold">{order.customerName}</h4>
                                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                                    <Car className="h-3 w-3" />
                                    {order.vehicleModel}
                                  </p>
                                  <p className="text-xs text-muted-foreground">{order.plateNumber}</p>
                                </div>
                                
                                <div>
                                  <h5 className="font-medium text-sm mb-1">الخدمات</h5>
                                  <div className="flex flex-wrap gap-1">
                                    {order.services.map((service, i) => (
                                      <Badge key={i} variant="secondary" className="text-xs">
                                        {service}
                                      </Badge>
                                    ))}
                                  </div>
                                  <p className="text-sm font-medium text-primary mt-1">
                                    {order.totalAmount} جنيه
                                  </p>
                                </div>
                                
                                <div>
                                  <div className="flex items-center gap-1 text-sm mb-1">
                                    <Timer className="h-3 w-3" />
                                    <span>الإنتهاء المتوقع: {order.estimatedCompletion}</span>
                                  </div>
                                  {order.assignedEmployee && (
                                    <div className="flex items-center gap-1 text-sm">
                                      <User className="h-3 w-3" />
                                      <span>{order.assignedEmployee}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            {/* Progress & Actions */}
                            <div className="lg:w-48 space-y-3">
                              {order.status === "in-progress" && (
                                <div>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span>التقدم</span>
                                    <span>{order.progress}%</span>
                                  </div>
                                  <Progress value={order.progress} />
                                </div>
                              )}
                              
                              <div className="flex gap-2">
                                {order.status === "pending" && (
                                  <Button 
                                    size="sm" 
                                    onClick={() => updateOrderStatus(path.id, order.id, "in-progress")}
                                    className="flex-1"
                                  >
                                    <Play className="h-3 w-3 ml-1" />
                                    بدء
                                  </Button>
                                )}
                                
                                {order.status === "in-progress" && (
                                  <>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => updateOrderStatus(path.id, order.id, "paused")}
                                    >
                                      <Pause className="h-3 w-3 ml-1" />
                                      توقف
                                    </Button>
                                    <Button 
                                      size="sm"
                                      onClick={() => updateOrderStatus(path.id, order.id, "completed")}
                                    >
                                      <CheckCircle className="h-3 w-3 ml-1" />
                                      إنهاء
                                    </Button>
                                  </>
                                )}
                                
                                {order.status === "paused" && (
                                  <Button 
                                    size="sm"
                                    onClick={() => updateOrderStatus(path.id, order.id, "in-progress")}
                                    className="flex-1"
                                  >
                                    <Play className="h-3 w-3 ml-1" />
                                    استكمال
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}