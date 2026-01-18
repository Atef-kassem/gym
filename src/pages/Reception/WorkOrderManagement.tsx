import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  Clock, 
  Car, 
  CheckCircle2, 
  Pause, 
  Play,
  Search,
  Filter,
  FileText,
  DollarSign,
  Users,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

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
  branchId: string;
}

const WorkOrderManagement: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample work orders data
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([
    {
      id: "WO-001",
      ticketNumber: "A001",
      customerName: "أحمد محمد",
      customerPhone: "0501234567",
      vehicleModel: "تويوتا كامري 2023",
      plateNumber: "ب س د - 1234",
      services: ["  خارجي", "تجفيف"],
      totalAmount: 45,
      status: "in-progress",
      priority: "normal",
      startTime: "09:30",
      estimatedCompletion: "09:45",
      assignedEmployee: "محمد أحمد",
      assignedPath: "مسار ال  السريع 1",
      progress: 75,
      createdAt: "2024-01-15T09:30:00",
      branchId: "riyadh"
    },
    {
      id: "WO-002",
      ticketNumber: "A002",
      customerName: "فاطمة علي",
      customerPhone: "0509876543",
      vehicleModel: "هوندا أكورد 2021",
      plateNumber: "ج ك ل - 5678",
      services: ["  فاخر", "تلميع داخلي"],
      totalAmount: 120,
      status: "pending",
      priority: "high",
      startTime: null,
      estimatedCompletion: "10:30",
      assignedEmployee: null,
      assignedPath: "مسار ال  الفاخر",
      progress: 0,
      createdAt: "2024-01-15T09:45:00",
      branchId: "riyadh"
    },
    {
      id: "WO-003",
      ticketNumber: "A003",
      customerName: "سعد الخالد",
      customerPhone: "0551234567",
      vehicleModel: "لكزس ES 2022",
      plateNumber: "د ه و - 9876",
      services: ["تغيير زيت المحرك", "فحص عام"],
      totalAmount: 150,
      status: "in-progress",
      priority: "normal",
      startTime: "09:15",
      estimatedCompletion: "10:45",
      assignedEmployee: "عبدالرحمن سعد",
      assignedPath: "مسار تغيير الزيت",
      progress: 30,
      createdAt: "2024-01-15T09:15:00",
      branchId: "riyadh"
    },
    {
      id: "WO-004",
      ticketNumber: "A004",
      customerName: "نورا السعيد",
      customerPhone: "0533456789",
      vehicleModel: "بي إم دبليو X5 2020",
      plateNumber: "هـ و ز - 4321",
      services: ["  شامل", "تلميع خارجي", "حماية طلاء"],
      totalAmount: 280,
      status: "completed",
      priority: "high",
      startTime: "08:00",
      estimatedCompletion: "09:30",
      assignedEmployee: "خالد عبدالله",
      assignedPath: "مسار ال  الفاخر",
      progress: 100,
      createdAt: "2024-01-15T08:00:00",
      branchId: "riyadh"
    },
    {
      id: "WO-005",
      ticketNumber: "A005",
      customerName: "عبدالله المطيري",
      customerPhone: "0544567890",
      vehicleModel: "جي إم سي يوكون 2022",
      plateNumber: "ح ط ي - 7890",
      services: ["  سريع"],
      totalAmount: 35,
      status: "paused",
      priority: "low",
      startTime: "09:00",
      estimatedCompletion: "09:20",
      assignedEmployee: "أحمد محمد",
      assignedPath: "مسار ال  السريع 2",
      progress: 50,
      createdAt: "2024-01-15T09:00:00",
      branchId: "riyadh"
    }
  ]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter functions
  const getFilteredWorkOrders = () => {
    return workOrders.filter(order => {
      const matchesBranch = selectedBranch === 'all' || order.branchId === selectedBranch;
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      const matchesSearch = searchTerm === '' || 
        order.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.plateNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesBranch && matchesStatus && matchesSearch;
    });
  };

  // Helper functions
  const getWorkOrderStatusColor = (status: WorkOrder["status"]) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500 text-white';
      case 'in-progress': return 'bg-blue-500 text-white';
      case 'paused': return 'bg-orange-500 text-white';
      case 'completed': return 'bg-green-500 text-white';
      case 'cancelled': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getPriorityColor = (priority: WorkOrder["priority"]) => {
    switch (priority) {
      case 'high': return 'bg-red-500 text-white';
      case 'normal': return 'bg-blue-500 text-white';
      case 'low': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: WorkOrder["status"]) => {
    setWorkOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus, progress: newStatus === 'completed' ? 100 : order.progress }
        : order
    ));
    toast.success(`تم تحديث حالة أمر العمل إلى: ${
      newStatus === 'pending' ? 'انتظار' : 
      newStatus === 'in-progress' ? 'قيد التنفيذ' :
      newStatus === 'paused' ? 'متوقف' :
      newStatus === 'completed' ? 'مكتمل' : 'ملغي'
    }`);
  };

  // Calculate statistics
  const filteredOrders = getFilteredWorkOrders();
  const totalAmount = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const completedToday = filteredOrders.filter(order => order.status === 'completed').length;
  const inProgressCount = filteredOrders.filter(order => order.status === 'in-progress').length;
  const pendingCount = filteredOrders.filter(order => order.status === 'pending').length;

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-primary">أوامر العمل</h1>
          <p className="text-muted-foreground">
            متابعة وإدارة أوامر العمل في جميع المسارات - {currentTime.toLocaleTimeString('ar-SA')}
          </p>
        </div>
        <div className="flex items-center space-x-4 space-x-reverse">
          <Badge variant="outline" className="text-sm">
            إجمالي الأوامر: {filteredOrders.length}
          </Badge>
          <Badge variant="outline" className="text-sm">
            قيد التنفيذ: {inProgressCount}
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="البحث برقم التذكرة، اسم العميل، أو رقم اللوحة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedBranch} onValueChange={setSelectedBranch}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="اختر الفرع" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الفروع</SelectItem>
            <SelectItem value="riyadh">الرياض الرئيسي</SelectItem>
            <SelectItem value="jeddah">جدة التجاري</SelectItem>
            <SelectItem value="dammam">الدمام الصناعي</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="حالة الأمر" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الحالات</SelectItem>
            <SelectItem value="pending">في الانتظار</SelectItem>
            <SelectItem value="in-progress">قيد التنفيذ</SelectItem>
            <SelectItem value="paused">متوقف</SelectItem>
            <SelectItem value="completed">مكتمل</SelectItem>
            <SelectItem value="cancelled">ملغي</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">في الانتظار</p>
                <p className="text-2xl font-bold">{pendingCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Play className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">قيد التنفيذ</p>
                <p className="text-2xl font-bold">{inProgressCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">مكتملة اليوم</p>
                <p className="text-2xl font-bold">{completedToday}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">إجمالي المبلغ</p>
                <p className="text-2xl font-bold">{totalAmount.toLocaleString()} جنيه مصري</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Work Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">لا توجد أوامر عمل</h3>
              <p className="text-muted-foreground">لا توجد أوامر عمل تطابق المعايير المحددة</p>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.id} className="border-l-4 border-l-primary">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Order Info */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Badge variant="outline" className="font-mono text-xs">
                        {order.ticketNumber}
                      </Badge>
                      <Badge className={getPriorityColor(order.priority)}>
                        {order.priority === 'high' ? 'عالية' : order.priority === 'normal' ? 'عادية' : 'منخفضة'}
                      </Badge>
                      <Badge className={getWorkOrderStatusColor(order.status)}>
                        {order.status === 'pending' ? 'انتظار' : 
                         order.status === 'in-progress' ? 'تنفيذ' :
                         order.status === 'paused' ? 'متوقف' :
                         order.status === 'completed' ? 'مكتمل' : 'ملغي'}
                      </Badge>
                    </div>
                    <h4 className="font-semibold">{order.customerName}</h4>
                    <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
                  </div>

                  {/* Vehicle Info */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Car className="h-4 w-4 text-primary" />
                      <span className="font-medium">{order.plateNumber}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{order.vehicleModel}</p>
                    <p className="text-sm font-medium text-primary">
                      {order.totalAmount} جنيه مصري
                    </p>
                  </div>

                  {/* Services & Path */}
                  <div className="space-y-2">
                    <p className="font-medium text-sm">الخدمات:</p>
                    <div className="flex flex-wrap gap-1">
                      {order.services.map((service, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      المسار: {order.assignedPath}
                    </p>
                  </div>

                  {/* Progress & Actions */}
                  <div className="space-y-3">
                    {order.status === 'in-progress' && (
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>التقدم</span>
                          <span>{order.progress}%</span>
                        </div>
                        <Progress value={order.progress} className="h-2" />
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-2">
                      {order.status === 'pending' && (
                        <Button 
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, 'in-progress')}
                        >
                          <Play className="h-3 w-3 mr-1" />
                          بدء
                        </Button>
                      )}
                      
                      {order.status === 'in-progress' && (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateOrderStatus(order.id, 'paused')}
                          >
                            <Pause className="h-3 w-3 mr-1" />
                            إيقاف
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => updateOrderStatus(order.id, 'completed')}
                          >
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            إكمال
                          </Button>
                        </>
                      )}
                      
                      {order.status === 'paused' && (
                        <Button 
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, 'in-progress')}
                        >
                          <Play className="h-3 w-3 mr-1" />
                          استئناف
                        </Button>
                      )}
                    </div>
                    
                    {order.assignedEmployee && (
                      <p className="text-xs text-muted-foreground">
                        الموظف: {order.assignedEmployee}
                      </p>
                    )}
                    
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {order.startTime ? `بدأت: ${order.startTime}` : `متوقع: ${order.estimatedCompletion}`}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default WorkOrderManagement;