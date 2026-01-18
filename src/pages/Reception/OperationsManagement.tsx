import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Activity, 
  Car, 
  Clock, 
  Users, 
  Settings, 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Pause, 
  Play, 
  Eye,
  Search,
  Filter,
  Bell,
  Calendar,
  MapPin,
  Wrench,
  Droplets,
  Shield,
  Zap,
  Brain,
  Target,
  Star,
  AlertCircle,
  Timer,
  DollarSign,
  Award,
  FileText,
  Send,
  Smartphone,
  MessageSquare,
  RotateCcw,
  ArrowRight,
  CheckSquare,
  Home,
  Building2,
  MonitorSpeaker,
  Plus,
  Edit,
  Trash2,
  Save
} from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";

// Enhanced interfaces with comprehensive data structure
interface ServicePath {
  id: string;
  name: string;
  type: ' _سريع' | ' _فاخر' | 'تلميع_داخلي' | 'تلميع_خارجي' | 'تشحيم' | 'تغيير_زيت' | 'خدمات_إضافية';
  capacity: number;
  currentLoad: number;
  status: 'نشط' | 'معطل' | 'صيانة' | 'مغلق';
  averageTime: number;
  efficiency: number;
  assignedStaff: string[];
  equipment: string[];
  qualityScore: number;
  todayCompleted: number;
  revenue: number;
  branch: string;
}

interface Vehicle {
  id: string;
  plateNumber: string;
  customerName: string;
  phoneNumber: string;
  vehicleType: 'صغيرة' | 'متوسطة' | 'SUV' | 'فاخرة' | 'دراجة_نارية';
  services: string[];
  currentPath: string;
  currentStage: 'انتظار' | 'تحضير' | ' ' | 'تلميع' | 'تجفيف' | 'فحص_جودة' | 'جاهز' | 'تم_التسليم';
  priority: 'عادي' | 'سريع' | 'VIP';
  startTime: Date;
  estimatedCompletion: Date;
  actualCompletion?: Date;
  qrCode: string;
  notes: string;
  qualityChecks: QualityCheck[];
  customerRating?: number;
  totalAmount: number;
  branch: string;
}

interface QualityCheck {
  id: string;
  category: string;
  passed: boolean;
  notes: string;
  checkedBy: string;
  timestamp: Date;
}

interface AIInsight {
  id: string;
  type: 'تنبؤ_ازدحام' | 'توصية_موارد' | 'تحليل_جودة' | 'تحسين_أداء';
  message: string;
  priority: 'منخفض' | 'متوسط' | 'عالي' | 'حرج';
  action?: string;
  timestamp: Date;
}

interface BranchData {
  id: string;
  name: string;
  location: string;
  totalPaths: number;
  activePaths: number;
  dailyCapacity: number;
  currentUtilization: number;
  efficiency: number;
  revenue: number;
  customerSatisfaction: number;
  pathNames: PathConfig[];
}

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

interface PathConfig {
  id: string;
  pathNumber: number;
  name: string;
  type: string;
  services: string[]; // الخدمات المرتبطة بالمسار
  isActive: boolean;
  branchId: string;
}

const OperationsManagement: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedPathFilter, setSelectedPathFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [pathConfigs, setPathConfigs] = useState<PathConfig[]>([]);
  const [isPathDialogOpen, setIsPathDialogOpen] = useState(false);
  const [editingPath, setEditingPath] = useState<PathConfig | null>(null);
  const [newPathNumber, setNewPathNumber] = useState('');
  const [newPathName, setNewPathName] = useState('');
  const [newPathType, setNewPathType] = useState('');
  const [newPathServices, setNewPathServices] = useState<string[]>([]);

  // Work Orders State
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);

  // Sample data with comprehensive structure
  const [branches] = useState<BranchData[]>([
    {
      id: 'riyadh',
      name: 'فرع الرياض الرئيسي',
      location: 'شارع الملك فهد',
      totalPaths: 8,
      activePaths: 7,
      dailyCapacity: 240,
      currentUtilization: 75,
      efficiency: 88,
      revenue: 25000,
      customerSatisfaction: 4.6,
      pathNames: [
        { id: 'p1', pathNumber: 1, name: 'مسار ال  السريع 1', type: ' _سريع', services: ['  خارجي', 'شطف', 'تجفيف'], isActive: true, branchId: 'riyadh' },
        { id: 'p2', pathNumber: 2, name: 'مسار ال  السريع 2', type: ' _سريع', services: ['  خارجي', 'شطف', 'تجفيف'], isActive: true, branchId: 'riyadh' },
        { id: 'p3', pathNumber: 3, name: 'مسار ال  الفاخر', type: ' _فاخر', services: ['  خارجي', 'تلميع خارجي', 'تلميع داخلي', 'تجفيف'], isActive: true, branchId: 'riyadh' },
        { id: 'p4', pathNumber: 4, name: 'مسار التلميع الداخلي', type: 'تلميع_داخلي', services: ['تنظيف داخلي', 'تلميع فرش', 'تعطير'], isActive: true, branchId: 'riyadh' },
        { id: 'p5', pathNumber: 5, name: 'مسار تغيير الزيت', type: 'تغيير_زيت', services: ['تغيير زيت المحرك', 'فحص مستوى السوائل'], isActive: false, branchId: 'riyadh' }
      ]
    },
    {
      id: 'jeddah',
      name: 'فرع جدة التجاري',
      location: 'طريق الملك عبدالعزيز',
      totalPaths: 6,
      activePaths: 6,
      dailyCapacity: 180,
      currentUtilization: 82,
      efficiency: 92,
      revenue: 22000,
      customerSatisfaction: 4.8,
      pathNames: [
        { id: 'p6', pathNumber: 1, name: 'مسار ال  السريع جدة', type: ' _سريع', services: ['  خارجي', 'شطف', 'تجفيف'], isActive: true, branchId: 'jeddah' },
        { id: 'p7', pathNumber: 2, name: 'مسار ال  الفاخر جدة', type: ' _فاخر', services: ['  خارجي', 'تلميع خارجي', 'حماية طلاء'], isActive: true, branchId: 'jeddah' },
        { id: 'p8', pathNumber: 3, name: 'مسار التلميع الشامل', type: 'تلميع_داخلي', services: ['تنظيف داخلي شامل', 'تلميع جلود', 'تعطير مميز'], isActive: true, branchId: 'jeddah' }
      ]
    },
    {
      id: 'dammam',
      name: 'فرع الدمام الصناعي',
      location: 'الحي الصناعي الثاني',
      totalPaths: 5,
      activePaths: 4,
      dailyCapacity: 150,
      currentUtilization: 68,
      efficiency: 85,
      revenue: 18000,
      customerSatisfaction: 4.4,
      pathNames: [
        { id: 'p9', pathNumber: 1, name: 'مسار ال  الاقتصادي', type: ' _سريع', services: ['  خارجي أساسي', 'شطف'], isActive: true, branchId: 'dammam' },
        { id: 'p10', pathNumber: 2, name: 'مسار الصيانة السريعة', type: 'تغيير_زيت', services: ['تغيير زيت المحرك', 'فحص إطارات', 'فحص بطارية'], isActive: true, branchId: 'dammam' }
      ]
    }
  ]);

  // Work Orders Sample Data
  const [workOrdersData] = useState<WorkOrder[]>([
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
    }
  ]);

  const [servicePaths] = useState<ServicePath[]>([
    {
      id: 'path_1',
      name: 'مسار ال  السريع 1',
      type: ' _سريع',
      capacity: 12,
      currentLoad: 8,
      status: 'نشط',
      averageTime: 15,
      efficiency: 92,
      assignedStaff: ['أحمد محمد', 'سارة أحمد'],
      equipment: ['مضخة ضغط عالي', 'مجفف هوائي'],
      qualityScore: 94,
      todayCompleted: 45,
      revenue: 2250,
      branch: 'riyadh'
    },
    {
      id: 'path_2',
      name: 'مسار ال  الفاخر',
      type: ' _فاخر',
      capacity: 8,
      currentLoad: 6,
      status: 'نشط',
      averageTime: 35,
      efficiency: 88,
      assignedStaff: ['خالد عبدالله', 'نور فاطمة', 'محمد علي'],
      equipment: ['مضخة متقدمة', 'أدوات تلميع خاصة'],
      qualityScore: 98,
      todayCompleted: 28,
      revenue: 5600,
      branch: 'riyadh'
    },
    {
      id: 'path_3',
      name: 'مسار التلميع الداخلي',
      type: 'تلميع_داخلي',
      capacity: 6,
      currentLoad: 3,
      status: 'نشط',
      averageTime: 25,
      efficiency: 85,
      assignedStaff: ['علياء حسن'],
      equipment: ['مكنسة متخصصة', 'مواد تلميع'],
      qualityScore: 96,
      todayCompleted: 22,
      revenue: 1980,
      branch: 'riyadh'
    },
    {
      id: 'path_4',
      name: 'مسار تغيير الزيت',
      type: 'تغيير_زيت',
      capacity: 4,
      currentLoad: 2,
      status: 'صيانة',
      averageTime: 20,
      efficiency: 0,
      assignedStaff: ['عبدالرحمن سعد'],
      equipment: ['رافعة هيدروليكية', 'أدوات صيانة'],
      qualityScore: 90,
      todayCompleted: 0,
      revenue: 0,
      branch: 'riyadh'
    }
  ]);

  const [vehicles] = useState<Vehicle[]>([
    {
      id: 'v_1',
      plateNumber: 'أ ب ج 1234',
      customerName: 'محمد أحمد السعيد',
      phoneNumber: '0501234567',
      vehicleType: 'SUV',
      services: ['  فاخر', 'تلميع داخلي'],
      currentPath: 'path_2',
      currentStage: ' ',
      priority: 'VIP',
      startTime: new Date(Date.now() - 20 * 60000),
      estimatedCompletion: new Date(Date.now() + 15 * 60000),
      qrCode: 'QR_V1_ABC1234',
      notes: 'عميل VIP - اهتمام خاص بالتفاصيل',
      qualityChecks: [],
      totalAmount: 180,
      branch: 'riyadh'
    },
    {
      id: 'v_2',
      plateNumber: 'د هـ و 5678',
      customerName: 'فاطمة عبدالله',
      phoneNumber: '0509876543',
      vehicleType: 'صغيرة',
      services: ['  سريع'],
      currentPath: 'path_1',
      currentStage: 'تجفيف',
      priority: 'سريع',
      startTime: new Date(Date.now() - 10 * 60000),
      estimatedCompletion: new Date(Date.now() + 5 * 60000),
      qrCode: 'QR_V2_DHW5678',
      notes: '',
      qualityChecks: [],
      totalAmount: 45,
      branch: 'riyadh'
    },
    {
      id: 'v_3',
      plateNumber: 'ز ح ط 9012',
      customerName: 'عبدالرحمن خالد',
      phoneNumber: '0503456789',
      vehicleType: 'فاخرة',
      services: ['  فاخر', 'تلميع خارجي', 'حماية طلاء'],
      currentPath: 'path_3',
      currentStage: 'انتظار',
      priority: 'عادي',
      startTime: new Date(Date.now() - 5 * 60000),
      estimatedCompletion: new Date(Date.now() + 45 * 60000),
      qrCode: 'QR_V3_ZHT9012',
      notes: 'مشروب جديدة - حذر في التعامل',
      qualityChecks: [],
      totalAmount: 320,
      branch: 'riyadh'
    }
  ]);

  const [aiInsights] = useState<AIInsight[]>([
    {
      id: 'ai_1',
      type: 'تنبؤ_ازدحام',
      message: 'متوقع زيادة الطلب بنسبة 40% خلال الساعتين القادمتين (وقت الذروة المسائي)',
      priority: 'عالي',
      action: 'يُنصح بفتح مسار إضافي وإضافة موظفين',
      timestamp: new Date()
    },
    {
      id: 'ai_2',
      type: 'تحليل_جودة',
      message: 'انخفاض في تقييمات مسار التلميع الداخلي (من 4.8 إلى 4.3) خلال الأسبوع الماضي',
      priority: 'متوسط',
      action: 'مراجعة إجراءات الجودة وتدريب الفريق',
      timestamp: new Date(Date.now() - 30 * 60000)
    },
    {
      id: 'ai_3',
      type: 'توصية_موارد',
      message: 'مخزون مواد التلميع منخفض في فرع جدة (متبقي لـ3 أيام فقط)',
      priority: 'حرج',
      action: 'طلب إعادة تعبئة فورية',
      timestamp: new Date(Date.now() - 60 * 60000)
    }
  ]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Initialize path configs from all branches
    const allPaths = branches.flatMap(branch => branch.pathNames);
    setPathConfigs(allPaths);
    // Initialize work orders
    setWorkOrders(workOrdersData);
  }, [branches]);

  // Helper functions
  const getPathStatusColor = (status: string) => {
    switch (status) {
      case 'نشط': return 'bg-green-500';
      case 'معطل': return 'bg-red-500';
      case 'صيانة': return 'bg-yellow-500';
      case 'مغلق': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  const getVehiclePriorityColor = (priority: string) => {
    switch (priority) {
      case 'VIP': return 'bg-purple-500 text-white';
      case 'سريع': return 'bg-orange-500 text-white';
      case 'عادي': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'انتظار': return <Clock className="h-4 w-4" />;
      case 'تحضير': return <Settings className="h-4 w-4" />;
      case ' ': return <Droplets className="h-4 w-4" />;
      case 'تلميع': return <Star className="h-4 w-4" />;
      case 'تجفيف': return <Zap className="h-4 w-4" />;
      case 'فحص_جودة': return <CheckSquare className="h-4 w-4" />;
      case 'جاهز': return <CheckCircle2 className="h-4 w-4" />;
      case 'تم_التسليم': return <Award className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getAIPriorityColor = (priority: string) => {
    switch (priority) {
      case 'حرج': return 'border-red-500 bg-red-50';
      case 'عالي': return 'border-orange-500 bg-orange-50';
      case 'متوسط': return 'border-yellow-500 bg-yellow-50';
      case 'منخفض': return 'border-blue-500 bg-blue-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  // Filtered data
  const filteredPaths = servicePaths.filter(path => 
    (selectedBranch === 'all' || path.branch === selectedBranch) &&
    (selectedPathFilter === 'all' || path.type === selectedPathFilter) &&
    (selectedStatusFilter === 'all' || path.status === selectedStatusFilter)
  );

  const filteredVehicles = vehicles.filter(vehicle => 
    (selectedBranch === 'all' || vehicle.branch === selectedBranch) &&
    (searchTerm === '' || 
     vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
     vehicle.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Calculate overview statistics
  const totalVehicles = filteredVehicles.length;
  const completedToday = servicePaths.reduce((sum, path) => sum + path.todayCompleted, 0);
  const averageEfficiency = servicePaths.reduce((sum, path) => sum + path.efficiency, 0) / servicePaths.length;
  const totalRevenue = servicePaths.reduce((sum, path) => sum + path.revenue, 0);
  const utilization = (filteredPaths.reduce((sum, path) => sum + (path.currentLoad / path.capacity), 0) / filteredPaths.length) * 100;

  const handleSendNotification = (vehicleId: string) => {
    toast.success("تم إرسال إشعار للعميل بحالة المشروب");
  };

  const handleStartService = (vehicleId: string) => {
    toast.success("تم بدء الخدمة");
  };

  const handlePauseService = (vehicleId: string) => {
    toast.warning("تم إيقاف الخدمة مؤقتاً");
  };

  const handleCompleteService = (vehicleId: string) => {
    toast.success("تم إكمال الخدمة");
  };

  // Work Orders functions
  const getFilteredWorkOrders = () => {
    return workOrders.filter(order => 
      selectedBranch === 'all' || order.branchId === selectedBranch
    );
  };

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
        ? { ...order, status: newStatus }
        : order
    ));
    toast.success(`تم تحديث حالة أمر العمل إلى: ${
      newStatus === 'pending' ? 'انتظار' : 
      newStatus === 'in-progress' ? 'قيد التنفيذ' :
      newStatus === 'paused' ? 'متوقف' :
      newStatus === 'completed' ? 'مكتمل' : 'ملغي'
    }`);
  };

  // Path management functions
  const handleAddPath = () => {
    if (!newPathNumber || !newPathName.trim() || !newPathType || !selectedBranch || selectedBranch === 'all') {
      toast.error("يرجى ملء جميع الحقول واختيار فرع محدد");
      return;
    }

    // Check if path number already exists in the selected branch
    const existingPath = pathConfigs.find(path => 
      path.branchId === selectedBranch && path.pathNumber === parseInt(newPathNumber)
    );
    
    if (existingPath) {
      toast.error("رقم المسار موجود بالفعل في هذا الفرع");
      return;
    }

    const newPath: PathConfig = {
      id: `p_${Date.now()}`,
      pathNumber: parseInt(newPathNumber),
      name: newPathName,
      type: newPathType,
      services: newPathServices,
      isActive: true,
      branchId: selectedBranch
    };

    setPathConfigs([...pathConfigs, newPath]);
    setNewPathNumber('');
    setNewPathName('');
    setNewPathType('');
    setNewPathServices([]);
    setIsPathDialogOpen(false);
    toast.success("تم إضافة المسار بنجاح");
  };

  const handleEditPath = (path: PathConfig) => {
    setEditingPath(path);
    setNewPathNumber(path.pathNumber.toString());
    setNewPathName(path.name);
    setNewPathType(path.type);
    setNewPathServices(path.services);
    setIsPathDialogOpen(true);
  };

  const handleUpdatePath = () => {
    if (!editingPath || !newPathNumber || !newPathName.trim() || !newPathType) {
      toast.error("يرجى ملء جميع الحقول");
      return;
    }

    // Check if path number already exists in other paths (except current one)
    const existingPath = pathConfigs.find(path => 
      path.branchId === editingPath.branchId && 
      path.pathNumber === parseInt(newPathNumber) && 
      path.id !== editingPath.id
    );
    
    if (existingPath) {
      toast.error("رقم المسار موجود بالفعل في هذا الفرع");
      return;
    }

    setPathConfigs(pathConfigs.map(path => 
      path.id === editingPath.id 
        ? { 
            ...path, 
            pathNumber: parseInt(newPathNumber),
            name: newPathName, 
            type: newPathType,
            services: newPathServices
          }
        : path
    ));

    setEditingPath(null);
    setNewPathNumber('');
    setNewPathName('');
    setNewPathType('');
    setNewPathServices([]);
    setIsPathDialogOpen(false);
    toast.success("تم تحديث المسار بنجاح");
  };

  const handleDeletePath = (pathId: string) => {
    setPathConfigs(pathConfigs.filter(path => path.id !== pathId));
    toast.success("تم حذف المسار بنجاح");
  };

  const handleTogglePathStatus = (pathId: string) => {
    setPathConfigs(pathConfigs.map(path => 
      path.id === pathId 
        ? { ...path, isActive: !path.isActive }
        : path
    ));
    toast.success("تم تحديث حالة المسار");
  };

  const pathTypes = [
    { value: ' _سريع', label: '  سريع' },
    { value: ' _فاخر', label: '  فاخر' },
    { value: 'تلميع_داخلي', label: 'تلميع داخلي' },
    { value: 'تلميع_خارجي', label: 'تلميع خارجي' },
    { value: 'تشحيم', label: 'تشحيم' },
    { value: 'تغيير_زيت', label: 'تغيير زيت' },
    { value: 'خدمات_إضافية', label: 'خدمات إضافية' }
  ];

  const availableServices = [
    '  خارجي',
    '  داخلي',
    'تلميع خارجي',
    'تلميع داخلي',
    'تلميع فرش',
    'تلميع جلود',
    'حماية طلاء',
    'شطف',
    'تجفيف',
    'تنظيف داخلي',
    'تنظيف داخلي شامل',
    'تعطير',
    'تعطير مميز',
    'تغيير زيت المحرك',
    'فحص مستوى السوائل',
    'فحص إطارات',
    'فحص بطارية',
    'تشحيم عام'
  ];

  const getFilteredPathConfigs = () => {
    return pathConfigs.filter(path => 
      selectedBranch === 'all' || path.branchId === selectedBranch
    ).sort((a, b) => a.pathNumber - b.pathNumber);
  };


  return (
    <div className="flex-1 space-y-6 p-4 md:p-6">
      {/* Header with real-time clock and branch selector */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-primary">إدارة العمليات والمسارات</h1>
          <p className="text-muted-foreground">
            العمود الفقري لإدارة الكافية - {currentTime.toLocaleTimeString('ar-SA')}
          </p>
        </div>
        <div className="flex items-center space-x-4 space-x-reverse">
          <Select value={selectedBranch} onValueChange={setSelectedBranch}>
            <SelectTrigger className="w-48">
              <Building2 className="h-4 w-4 mr-2" />
              <SelectValue placeholder="اختر الفرع" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الفروع</SelectItem>
              {branches.map(branch => (
                <SelectItem key={branch.id} value={branch.id}>{branch.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* AI Insights Alert Panel */}
      {aiInsights.length > 0 && (
        <Alert className={`border-l-4 ${getAIPriorityColor(aiInsights[0].priority)}`}>
          <Brain className="h-4 w-4" />
          <AlertDescription className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold">توصيات الذكاء الاصطناعي</span>
              <Badge variant="outline" className="text-xs">
                {aiInsights.filter(insight => insight.priority === 'حرج').length} حرجة
              </Badge>
            </div>
            <div className="text-sm">{aiInsights[0].message}</div>
            {aiInsights[0].action && (
              <div className="text-xs text-muted-foreground">
                <strong>الإجراء المقترح:</strong> {aiInsights[0].action}
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Overview Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Car className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground"> الكافية النشطة</p>
                <p className="text-2xl font-bold">{totalVehicles}</p>
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
              <TrendingUp className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">متوسط الكفاءة</p>
                <p className="text-2xl font-bold">{averageEfficiency.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">معدل الاستغلال</p>
                <p className="text-2xl font-bold">{utilization.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-emerald-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">الإيرادات اليوم</p>
                <p className="text-2xl font-bold">{totalRevenue.toLocaleString()} جنيه مصري</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard" className="flex items-center space-x-2 space-x-reverse">
            <BarChart3 className="h-4 w-4" />
            <span>لوحة التحكم</span>
          </TabsTrigger>
          <TabsTrigger value="path-management" className="flex items-center space-x-2 space-x-reverse">
            <Settings className="h-4 w-4" />
            <span>إدارة المسارات</span>
          </TabsTrigger>
          <TabsTrigger value="paths" className="flex items-center space-x-2 space-x-reverse">
            <MapPin className="h-4 w-4" />
            <span>مراقبة المسارات</span>
          </TabsTrigger>
          <TabsTrigger value="vehicles" className="flex items-center space-x-2 space-x-reverse">
            <Car className="h-4 w-4" />
            <span>تتبع  الكافية</span>
          </TabsTrigger>
          <TabsTrigger value="quality" className="flex items-center space-x-2 space-x-reverse">
            <Shield className="h-4 w-4" />
            <span>مراقبة الجودة</span>
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center space-x-2 space-x-reverse">
            <Brain className="h-4 w-4" />
            <span>الذكاء الاصطناعي</span>
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Real-time Operations Map */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  خريطة العمليات المباشرة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredPaths.map((path) => (
                    <div key={path.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <div className={`w-3 h-3 rounded-full ${getPathStatusColor(path.status)}`} />
                        <div>
                          <p className="font-semibold">{path.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {path.currentLoad}/{path.capacity} مشروب
                          </p>
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="text-sm text-muted-foreground">الكفاءة</p>
                        <p className="font-bold text-lg">{path.efficiency}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Branch Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  مقارنة الفروع
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {branches.map((branch) => (
                    <div key={branch.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{branch.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {branch.activePaths}/{branch.totalPaths} مسار نشط
                        </span>
                      </div>
                      <Progress value={branch.currentUtilization} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>الاستغلال: {branch.currentUtilization}%</span>
                        <span>الرضا: {branch.customerSatisfaction}/5</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Work Orders Tab */}
        <TabsContent value="work-orders" className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold">أوامر العمل</h2>
              <p className="text-muted-foreground">متابعة وإدارة أوامر العمل في جميع المسارات</p>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <Badge variant="outline" className="text-sm">
                إجمالي الأوامر: {getFilteredWorkOrders().length}
              </Badge>
              <Badge variant="outline" className="text-sm">
                قيد التنفيذ: {getFilteredWorkOrders().filter(order => order.status === 'in-progress').length}
              </Badge>
            </div>
          </div>

          {/* Work Orders Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-l-4 border-l-yellow-500">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-yellow-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">في الانتظار</p>
                    <p className="text-2xl font-bold">
                      {getFilteredWorkOrders().filter(order => order.status === 'pending').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Play className="h-8 w-8 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">قيد التنفيذ</p>
                    <p className="text-2xl font-bold">
                      {getFilteredWorkOrders().filter(order => order.status === 'in-progress').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">مكتملة</p>
                    <p className="text-2xl font-bold">
                      {getFilteredWorkOrders().filter(order => order.status === 'completed').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Pause className="h-8 w-8 text-orange-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">متوقفة</p>
                    <p className="text-2xl font-bold">
                      {getFilteredWorkOrders().filter(order => order.status === 'paused').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Work Orders List */}
          <div className="space-y-4">
            {getFilteredWorkOrders().map((order) => (
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
                          <Progress value={order.progress} />
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-2 space-x-reverse text-xs text-muted-foreground">
                        <Timer className="h-3 w-3" />
                        <span>المتوقع: {order.estimatedCompletion}</span>
                      </div>
                      
                      {order.assignedEmployee && (
                        <div className="flex items-center space-x-2 space-x-reverse text-xs text-muted-foreground">
                          <Users className="h-3 w-3" />
                          <span>{order.assignedEmployee}</span>
                        </div>
                      )}

                      <div className="flex space-x-2 space-x-reverse">
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
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {getFilteredWorkOrders().length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">لا توجد أوامر عمل</h3>
                  <p className="text-muted-foreground">لا توجد أوامر عمل في الفرع المحدد</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Path Management Tab */}
        <TabsContent value="path-management" className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold">إدارة مسميات المسارات</h2>
              <p className="text-muted-foreground">تخصيص وإدارة مسميات المسارات لكل فرع</p>
            </div>
            <Dialog open={isPathDialogOpen} onOpenChange={setIsPathDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  onClick={() => {
                    setEditingPath(null);
                    setNewPathNumber('');
                    setNewPathName('');
                    setNewPathType('');
                    setNewPathServices([]);
                  }}
                  disabled={selectedBranch === 'all'}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  إضافة مسار جديد
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingPath ? 'تعديل المسار' : 'إضافة مسار جديد'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingPath ? 'تعديل بيانات المسار المحدد' : 'إضافة مسار جديد للفرع المحدد'}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="pathNumber">رقم المسار</Label>
                    <Input
                      id="pathNumber"
                      type="number"
                      value={newPathNumber}
                      onChange={(e) => setNewPathNumber(e.target.value)}
                      placeholder="أدخل رقم المسار"
                      min="1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pathName">اسم المسار</Label>
                    <Input
                      id="pathName"
                      value={newPathName}
                      onChange={(e) => setNewPathName(e.target.value)}
                      placeholder="أدخل اسم المسار"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pathType">نوع المسار</Label>
                    <Select value={newPathType} onValueChange={setNewPathType}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر نوع المسار" />
                      </SelectTrigger>
                      <SelectContent>
                        {pathTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>الخدمات المرتبطة</Label>
                    <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                      {availableServices.map((service) => (
                        <div key={service} className="flex items-center space-x-2 space-x-reverse">
                          <input
                            type="checkbox"
                            id={service}
                            checked={newPathServices.includes(service)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewPathServices([...newPathServices, service]);
                              } else {
                                setNewPathServices(newPathServices.filter(s => s !== service));
                              }
                            }}
                            className="h-4 w-4"
                          />
                          <Label htmlFor={service} className="text-sm">{service}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsPathDialogOpen(false)}>
                    إلغاء
                  </Button>
                  <Button onClick={editingPath ? handleUpdatePath : handleAddPath}>
                    <Save className="h-4 w-4 mr-2" />
                    {editingPath ? 'تحديث' : 'إضافة'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {selectedBranch === 'all' && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                يرجى اختيار فرع محدد لإدارة المسارات
              </AlertDescription>
            </Alert>
          )}

          {selectedBranch !== 'all' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  مسارات {branches.find(b => b.id === selectedBranch)?.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>رقم المسار</TableHead>
                      <TableHead>اسم المسار</TableHead>
                      <TableHead>نوع المسار</TableHead>
                      <TableHead>الخدمات المرتبطة</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>العمليات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getFilteredPathConfigs().map((path) => (
                      <TableRow key={path.id}>
                        <TableCell>
                          <Badge variant="outline" className="font-mono">
                            #{path.pathNumber}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          #{path.pathNumber} - {path.name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {pathTypes.find(t => t.value === path.type)?.label || path.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {path.services.slice(0, 3).map((service, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {service}
                              </Badge>
                            ))}
                            {path.services.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{path.services.length - 3}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={path.isActive ? "default" : "secondary"}
                            className={path.isActive ? "bg-green-500" : "bg-gray-500"}
                          >
                            {path.isActive ? 'نشط' : 'غير نشط'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2 space-x-reverse">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditPath(path)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleTogglePathStatus(path.id)}
                            >
                              {path.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeletePath(path.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {getFilteredPathConfigs().length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    لا توجد مسارات مضافة لهذا الفرع
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Paths Monitoring Tab */}
        <TabsContent value="paths" className="space-y-6">
          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <Select value={selectedPathFilter} onValueChange={setSelectedPathFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="نوع المسار" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المسارات</SelectItem>
                <SelectItem value=" _سريع">  سريع</SelectItem>
                <SelectItem value=" _فاخر">  فاخر</SelectItem>
                <SelectItem value="تلميع_داخلي">تلميع داخلي</SelectItem>
                <SelectItem value="تلميع_خارجي">تلميع خارجي</SelectItem>
                <SelectItem value="تشحيم">تشحيم</SelectItem>
                <SelectItem value="تغيير_زيت">تغيير زيت</SelectItem>
                <SelectItem value="خدمات_إضافية">خدمات إضافية</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatusFilter} onValueChange={setSelectedStatusFilter}>
              <SelectTrigger className="w-48">
                <Activity className="h-4 w-4 mr-2" />
                <SelectValue placeholder="حالة المسار" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="نشط">نشط</SelectItem>
                <SelectItem value="معطل">معطل</SelectItem>
                <SelectItem value="صيانة">صيانة</SelectItem>
                <SelectItem value="مغلق">مغلق</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Service Paths Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredPaths.map((path) => (
              <Card key={path.id} className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{path.name}</CardTitle>
                    <Badge className={getPathStatusColor(path.status) + ' text-white'}>
                      {path.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    متوسط الوقت: {path.averageTime} دقيقة
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">الحمولة الحالية</span>
                      <span className="font-semibold">{path.currentLoad}/{path.capacity}</span>
                    </div>
                    <Progress value={(path.currentLoad / path.capacity) * 100} />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">الكفاءة</p>
                      <p className="font-bold text-lg">{path.efficiency}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">نقاط الجودة</p>
                      <p className="font-bold text-lg">{path.qualityScore}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">مكتملة اليوم</p>
                      <p className="font-bold">{path.todayCompleted}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">الإيراد</p>
                      <p className="font-bold">{path.revenue.toLocaleString()} جنيه مصري</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <p className="text-sm font-medium">الموظفون المكلفون:</p>
                    <div className="flex flex-wrap gap-1">
                      {path.assignedStaff.map((staff, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {staff}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2 space-x-reverse">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="h-4 w-4 mr-1" />
                      تفاصيل
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Vehicle Tracking Tab */}
        <TabsContent value="vehicles" className="space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="البحث برقم اللوحة أو اسم العميل..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Vehicles List */}
          <div className="space-y-4">
            {filteredVehicles.map((vehicle) => (
              <Card key={vehicle.id} className="border-l-4 border-l-purple-500">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Vehicle Info */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Car className="h-5 w-5 text-primary" />
                        <span className="font-bold text-lg">{vehicle.plateNumber}</span>
                        <Badge className={getVehiclePriorityColor(vehicle.priority)}>
                          {vehicle.priority}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">{vehicle.customerName}</p>
                      <p className="text-sm text-muted-foreground">{vehicle.phoneNumber}</p>
                      <Badge variant="outline">{vehicle.vehicleType}</Badge>
                    </div>

                    {/* Current Status */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        {getStageIcon(vehicle.currentStage)}
                        <span className="font-medium">{vehicle.currentStage}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        المسار: {servicePaths.find(p => p.id === vehicle.currentPath)?.name}
                      </p>
                      <div className="text-xs text-muted-foreground">
                        <p>بدء الخدمة: {vehicle.startTime.toLocaleTimeString('ar-SA')}</p>
                        <p>التسليم المتوقع: {vehicle.estimatedCompletion.toLocaleTimeString('ar-SA')}</p>
                      </div>
                    </div>

                    {/* Services */}
                    <div className="space-y-2">
                      <p className="font-medium">الخدمات المطلوبة:</p>
                      <div className="flex flex-wrap gap-1">
                        {vehicle.services.map((service, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm font-medium">
                        المبلغ الإجمالي: {vehicle.totalAmount} جنيه مصري
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                      <div className="flex space-x-2 space-x-reverse">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleStartService(vehicle.id)}
                        >
                          <Play className="h-4 w-4 mr-1" />
                          بدء
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handlePauseService(vehicle.id)}
                        >
                          <Pause className="h-4 w-4 mr-1" />
                          إيقاف
                        </Button>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full"
                        onClick={() => handleSendNotification(vehicle.id)}
                      >
                        <Send className="h-4 w-4 mr-1" />
                        إشعار العميل
                      </Button>
                      <Button 
                        size="sm" 
                        className="w-full"
                        onClick={() => handleCompleteService(vehicle.id)}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        إكمال الخدمة
                      </Button>
                    </div>
                  </div>

                  {vehicle.notes && (
                    <div className="mt-4 p-3 bg-muted rounded-lg">
                      <p className="text-sm">
                        <strong>ملاحظات:</strong> {vehicle.notes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Quality Monitoring Tab */}
        <TabsContent value="quality" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quality Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  مؤشرات الجودة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {servicePaths.map((path) => (
                  <div key={path.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{path.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {path.qualityScore}/100
                      </span>
                    </div>
                    <Progress value={path.qualityScore} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quality Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  توصيات تحسين الجودة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>مسار التلميع الداخلي:</strong> يحتاج إلى مراجعة إجراءات التنظيف
                    </AlertDescription>
                  </Alert>
                  <Alert>
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>
                      <strong>مسار ال  الفاخر:</strong> أداء ممتاز - استمر على نفس المستوى
                    </AlertDescription>
                  </Alert>
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>مسار تغيير الزيت:</strong> متوقف للصيانة - يحتاج متابعة فنية
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="ai" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AI Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2" />
                  توصيات الذكاء الاصطناعي
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aiInsights.map((insight) => (
                    <Alert key={insight.id} className={getAIPriorityColor(insight.priority)}>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">{insight.type.replace('_', ' ')}</span>
                          <Badge variant="outline" className="text-xs">
                            {insight.priority}
                          </Badge>
                        </div>
                        <p className="text-sm">{insight.message}</p>
                        {insight.action && (
                          <p className="text-xs text-muted-foreground">
                            <strong>الإجراء المقترح:</strong> {insight.action}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {insight.timestamp.toLocaleString('ar-SA')}
                        </p>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Predictive Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  التحليل التنبؤي
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2">توقعات الأحمال لليوم</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>الفترة الصباحية (8-12)</span>
                        <span className="text-green-600">معتدل (70%)</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>فترة الظهيرة (12-4)</span>
                        <span className="text-yellow-600">متوسط (85%)</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>الفترة المسائية (4-8)</span>
                        <span className="text-red-600">مزدحم (120%)</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-2">توصيات التحسين</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• إضافة موظفين إضافيين في الفترة المسائية</li>
                      <li>• فتح مسار   سريع إضافي من 4-8 مساءً</li>
                      <li>• تحديث مخزون مواد التنظيف قبل الذروة</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OperationsManagement;