import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { 
  Clock, 
  Car, 
  User, 
  Phone, 
  MapPin, 
  Printer, 
  RotateCcw, 
  X,
  Search,
  Filter,
  Bell,
  AlertTriangle,
  CheckCircle2,
  PlayCircle,
  PauseCircle,
  RefreshCw,
  Brain,
  TrendingUp,
  Users,
  Zap,
  Target,
  AlertCircle,
  Lightbulb,
  BarChart3,
  ArrowRight
} from 'lucide-react';

// Mock data for active orders
const mockOrders = [
  {
    id: 'ORD-001',
    customer: { 
      name: 'أحمد محمد', 
      phone: '0501234567',
      email: 'ahmed.mohamed@email.com',
      vipLevel: 'ذهبي',
      visitCount: 15
    },
    car: { 
      plate: 'أ ب ج 1234', 
      type: 'كامري 2020',
      color: 'أبيض',
      model: 'تويوتا كامري SE'
    },
    services: ['  شامل', 'تعطير داخلي'],
    lane: 'المسار 1',
    status: 'في التنفيذ',
    startTime: '2024-01-15T10:30:00',
    estimatedTime: 45,
    elapsed: 15,
    total: 80,
    notes: 'تنظيف عميق للمقاعد',
    staff: {
      reception: 'محمد علي',
      washer: 'أحمد حسن',
      dryer: 'خالد محمود',
      quality: 'سعد عبدالله'
    },
    stages: [
      { name: 'الاستقبال', completed: true, staff: 'محمد علي', time: '10:30', duration: 5 },
      { name: 'ال ', completed: true, staff: 'أحمد حسن', time: '10:35', duration: 20 },
      { name: 'التجفيف', completed: false, staff: 'خالد محمود', time: '10:55', duration: 15 },
      { name: 'مراجعة الجودة', completed: false, staff: 'سعد عبدالله', time: '11:10', duration: 5 }
    ],
    paymentMethod: 'كاش',
    discount: 0,
    priority: 'عادي'
  },
  {
    id: 'ORD-002',
    customer: { 
      name: 'فاطمة أحمد', 
      phone: '0509876543',
      email: 'fatima.ahmed@email.com',
      vipLevel: 'بلاتيني',
      visitCount: 28
    },
    car: { 
      plate: 'د ه و 5678', 
      type: 'لكزس ES',
      color: 'أسود',
      model: 'لكزس ES 350'
    },
    services: ['  VIP', 'تلميع خارجي'],
    lane: 'المسار 2',
    status: 'بانتظار',
    startTime: '2024-01-15T11:00:00',
    estimatedTime: 120,
    elapsed: 0,
    total: 235,
    notes: '',
    staff: {
      reception: 'سارة محمد',
      washer: 'عبدالله أحمد',
      dryer: 'يوسف علي',
      quality: 'نورا خالد'
    },
    stages: [
      { name: 'الاستقبال', completed: true, staff: 'سارة محمد', time: '11:00', duration: 5 },
      { name: 'ال  الأولي', completed: false, staff: 'عبدالله أحمد', time: '11:05', duration: 30 },
      { name: 'التلميع', completed: false, staff: 'عبدالله أحمد', time: '11:35', duration: 45 },
      { name: 'التجفيف النهائي', completed: false, staff: 'يوسف علي', time: '12:20', duration: 30 },
      { name: 'مراجعة الجودة', completed: false, staff: 'نورا خالد', time: '12:50', duration: 10 }
    ],
    paymentMethod: 'بطاقة',
    discount: 15,
    priority: 'عالي'
  },
  {
    id: 'ORD-003',
    customer: { 
      name: 'محمد علي', 
      phone: '0551112233',
      email: 'mohamed.ali@email.com',
      vipLevel: 'فضي',
      visitCount: 8
    },
    car: { 
      plate: 'ز ح ط 9012', 
      type: 'BMW X5',
      color: 'رمادي',
      model: 'BMW X5 xDrive40i'
    },
    services: ['  سريع'],
    lane: 'المسار 3',
    status: 'جاهز',
    startTime: '2024-01-15T09:45:00',
    estimatedTime: 15,
    elapsed: 20,
    total: 25,
    notes: '',
    staff: {
      reception: 'علي حسن',
      washer: 'محمود سعد',
      dryer: 'أحمد فارس',
      quality: 'مها عبدالله'
    },
    stages: [
      { name: 'الاستقبال', completed: true, staff: 'علي حسن', time: '09:45', duration: 3 },
      { name: 'ال  السريع', completed: true, staff: 'محمود سعد', time: '09:48', duration: 10 },
      { name: 'التجفيف السريع', completed: true, staff: 'أحمد فارس', time: '09:58', duration: 5 },
      { name: 'التسليم', completed: true, staff: 'علي حسن', time: '10:03', duration: 2 }
    ],
    paymentMethod: 'تحويل',
    discount: 0,
    priority: 'عادي'
  },
  {
    id: 'ORD-004',
    customer: { 
      name: 'سارة خالد', 
      phone: '0544445555',
      email: 'sara.khalid@email.com',
      vipLevel: 'عادي',
      visitCount: 3
    },
    car: { 
      plate: 'ي ك ل 3456', 
      type: 'هوندا أكورد',
      color: 'أزرق',
      model: 'هوندا أكورد EX-L'
    },
    services: ['تغيير زيت المحرك', 'فحص شامل'],
    lane: 'المسار 4',
    status: 'في التنفيذ',
    startTime: '2024-01-15T10:15:00',
    estimatedTime: 75,
    elapsed: 45,
    total: 200,
    notes: 'استخدام زيت صناعي كامل',
    staff: {
      reception: 'ريم أحمد',
      technician: 'فهد عبدالله',
      quality: 'نايف محمد'
    },
    stages: [
      { name: 'الاستقبال والفحص', completed: true, staff: 'ريم أحمد', time: '10:15', duration: 10 },
      { name: 'تغيير الزيت', completed: true, staff: 'فهد عبدالله', time: '10:25', duration: 25 },
      { name: 'الفحص الشامل', completed: false, staff: 'فهد عبدالله', time: '10:50', duration: 35 },
      { name: 'مراجعة نهائية', completed: false, staff: 'نايف محمد', time: '11:25', duration: 5 }
    ],
    paymentMethod: 'كاش',
    discount: 10,
    priority: 'عادي'
  }
];

export default function ActiveOrders() {
  const { toast } = useToast();
  const [orders, setOrders] = useState(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [laneFilter, setLaneFilter] = useState('الكل');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [showAiInsights, setShowAiInsights] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [showRecommendationDialog, setShowRecommendationDialog] = useState(false);
  const [currentRecommendation, setCurrentRecommendation] = useState<any>(null);
  

  const getStatusColor = (status) => {
    switch (status) {
      case 'بانتظار': return 'bg-yellow-500';
      case 'في التنفيذ': return 'bg-blue-500';
      case 'جاهز': return 'bg-green-500';
      case 'ملغي': return 'bg-red-500';
      case 'متأخر': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'بانتظار': return 'secondary';
      case 'في التنفيذ': return 'default';
      case 'جاهز': return 'default';
      case 'ملغي': return 'destructive';
      case 'متأخر': return 'destructive';
      default: return 'secondary';
    }
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const cancelOrder = (orderId) => {
    setCancelOrderId(orderId);
    setShowCancelDialog(true);
  };

  const confirmCancelOrder = () => {
    if (cancelReason.trim()) {
      const canceledOrder = orders.find(order => order.id === cancelOrderId);
      updateOrderStatus(cancelOrderId, 'ملغي');
      
      // إنشاء إشعار مرتجع لضبط الوردية
      const refundNotification = {
        id: `REF-${Date.now()}`,
        orderId: cancelOrderId,
        amount: canceledOrder?.total || 0,
        reason: cancelReason,
        timestamp: new Date().toISOString(),
        shiftId: 'SHIFT-001', // معرف الوردية الحالية
        status: 'pending_adjustment'
      };
      
      // حفظ إشعار المرتجع (في قاعدة البيانات الفعلية)
      
      setShowCancelDialog(false);
      setCancelOrderId(null);
      setCancelReason('');
      
      // رسالة تأكيد مطورة مع معلومات المرتجع
      toast({
        title: "✅ تم إلغاء الطلب وإنشاء مرتجع",
        description: (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span>تم حفظ سبب الإلغاء لتحليل الجودة</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <span>تم إنشاء إشعار مرتجع بقيمة {canceledOrder?.total} جنيه مصري</span>
            </div>
            <div className="text-xs text-muted-foreground">
              سيتم ضبط إيرادات الوردية تلقائياً
            </div>
          </div>
        ),
        className: "border-green-200 bg-green-50 text-green-800",
        duration: 6000,
      });

      // إشعار إضافي لمدير الوردية
      setTimeout(() => {
        toast({
          title: "📊 تنبيه ضبط الوردية",
          description: (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-orange-600" />
                <span>مطلوب مراجعة إيرادات الوردية</span>
              </div>
              <div className="text-sm">
                المبلغ المرتجع: {canceledOrder?.total} جنيه مصري
              </div>
              <div className="text-xs text-muted-foreground">
                رقم الإشعار: {refundNotification.id}
              </div>
            </div>
          ),
          className: "border-orange-200 bg-orange-50 text-orange-800",
          duration: 8000,
        });
      }, 2000);
    }
  };

  const isOverdue = (order) => {
    return order.elapsed > order.estimatedTime && order.status !== 'جاهز';
  };

  const getTimeRemaining = (order) => {
    const remaining = order.estimatedTime - order.elapsed;
    return remaining > 0 ? remaining : 0;
  };

  // AI-powered functions
  const generateAiRecommendations = () => {
    const recommendations = [];
    
    // Analyze current orders for bottlenecks
    const inProgressOrders = orders.filter(order => order.status === 'في التنفيذ');
    const waitingOrders = orders.filter(order => order.status === 'بانتظار');
    const overdueOrders = orders.filter(order => isOverdue(order));
    
    // Staff workload analysis
    const staffWorkload = {};
    inProgressOrders.forEach(order => {
      order.stages.forEach(stage => {
        if (!stage.completed) {
          staffWorkload[stage.staff] = (staffWorkload[stage.staff] || 0) + 1;
        }
      });
    });
    
    // Generate recommendations
    if (overdueOrders.length > 0) {
      recommendations.push({
        type: 'urgent',
        icon: AlertTriangle,
        title: 'طلبات متأخرة تحتاج انتباه',
        description: `هناك ${overdueOrders.length} طلب متأخر. يُنصح بإعادة توزيع الموظفين أو تقديم تعويض للعملاء.`,
        action: 'عرض الطلبات المتأخرة',
        priority: 'high'
      });
    }
    
    if (waitingOrders.length > 3) {
      recommendations.push({
        type: 'optimization',
        icon: TrendingUp,
        title: 'تحسين توزيع الطلبات',
        description: `هناك ${waitingOrders.length} طلب في الانتظار. يمكن تحسين الكفاءة بإعادة ترتيب الطلبات حسب الأولوية.`,
        action: 'إعادة ترتيب الطلبات',
        priority: 'medium'
      });
    }
    
    // VIP customer recommendations
    const vipOrders = orders.filter(order => order.customer.vipLevel === 'بلاتيني' || order.customer.vipLevel === 'ذهبي');
    if (vipOrders.some(order => order.status === 'بانتظار')) {
      recommendations.push({
        type: 'vip',
        icon: Target,
        title: 'عملاء VIP في الانتظار',
        description: 'هناك عملاء من فئة VIP في قائمة الانتظار. يُنصح بإعطائهم الأولوية.',
        action: 'عرض عملاء VIP',
        priority: 'high'
      });
    }
    
    // Staff efficiency recommendations
    const heavilyLoaded = Object.entries(staffWorkload).filter(([_, load]) => (load as number) > 2);
    if (heavilyLoaded.length > 0) {
      recommendations.push({
        type: 'staff',
        icon: Users,
        title: 'إعادة توزيع أعباء العمل',
        description: `بعض الموظفين محملون بأكثر من طلبين. يُنصح بإعادة التوزيع لتحسين الكفاءة.`,
        action: 'عرض توزيع الموظفين',
        priority: 'medium'
      });
    }
    
    // Time prediction recommendations
    const avgServiceTime = orders.reduce((sum, order) => sum + order.estimatedTime, 0) / orders.length;
    const currentHour = new Date().getHours();
    if (currentHour >= 16 && currentHour <= 18 && avgServiceTime > 60) {
      recommendations.push({
        type: 'prediction',
        icon: BarChart3,
        title: 'توقع ذروة المساء',
        description: 'نتوقع زيادة في الطلبات خلال الساعات القادمة. يُنصح بتجهيز فرق إضافية.',
        action: 'تجهيز للذروة',
        priority: 'medium'
      });
    }
    
    setAiRecommendations(recommendations);
  };

  const optimizeOrderQueue = () => {
    // AI-powered queue optimization
    const optimizedOrders = [...orders].sort((a, b) => {
      // Priority factors
      let scoreA = 0, scoreB = 0;
      
      // VIP customers get higher priority
      if (a.customer.vipLevel === 'بلاتيني') scoreA += 10;
      else if (a.customer.vipLevel === 'ذهبي') scoreA += 5;
      
      if (b.customer.vipLevel === 'بلاتيني') scoreB += 10;
      else if (b.customer.vipLevel === 'ذهبي') scoreB += 5;
      
      // Urgent orders get priority
      if (a.priority === 'عالي') scoreA += 8;
      if (b.priority === 'عالي') scoreB += 8;
      
      // Shorter services get slight priority
      if (a.estimatedTime < 30) scoreA += 2;
      if (b.estimatedTime < 30) scoreB += 2;
      
      // Waiting time penalty
      if (a.status === 'بانتظار') scoreA += a.elapsed * 0.5;
      if (b.status === 'بانتظار') scoreB += b.elapsed * 0.5;
      
      return scoreB - scoreA;
    });
    
    setOrders(optimizedOrders);
    toast({ title: "تحسين الطلبات", description: "تم تحسين ترتيب الطلبات بناءً على الأولوية والكفاءة" });
  };

  const smartStaffAllocation = () => {
    // AI suggestion for staff allocation
    const staffSuggestions = [];
    
    orders.forEach(order => {
      if (order.status === 'في التنفيذ') {
        const currentStage = order.stages.find(stage => !stage.completed);
        if (currentStage && order.elapsed > order.estimatedTime * 0.8) {
          staffSuggestions.push({
            orderId: order.id,
            stage: currentStage.name,
            suggestion: 'يُنصح بإضافة موظف إضافي لتسريع العمل',
            staff: currentStage.staff
          });
        }
      }
    });
    
    if (staffSuggestions.length > 0) {
      toast({ title: "توصيات الموظفين", description: `تم اكتشاف ${staffSuggestions.length} توصية لتحسين توزيع الموظفين` });
    }
  };

  // Handle AI recommendation clicks
  const handleAIRecommendation = (recommendation: any) => {
    let recommendationData: any[] = [];
    let actions: any[] = [];

    switch (recommendation.type) {
      case 'urgent':
        const overdueOrders = orders.filter(order => isOverdue(order));
        recommendationData = overdueOrders.map(order => ({
          label: `${order.id} - ${order.customer.name}`,
          value: `متأخر ${order.elapsed - order.estimatedTime} دقيقة`
        }));
        actions = [
          {
            title: 'إعادة ترتيب الطلبات',
            description: 'ترتيب الطلبات حسب الأولوية والتأخير',
            icon: RefreshCw,
            type: 'primary' as const
          },
          {
            title: 'تنبيه المشرف',
            description: 'إرسال تنبيه فوري للمشرف المناوب',
            icon: Bell,
            type: 'warning' as const
          },
          {
            title: 'إعادة توزيع الموظفين',
            description: 'تخصيص موظفين إضافيين للطلبات المتأخرة',
            icon: Users,
            type: 'success' as const
          }
        ];
        break;
        
      case 'optimization':
        actions = [
          {
            title: 'تطبيق الترتيب الذكي',
            description: 'إعادة ترتيب الطلبات لزيادة الكفاءة بنسبة 15%',
            icon: TrendingUp,
            type: 'primary' as const
          },
          {
            title: 'تحسين المسارات',
            description: 'توزيع الطلبات على المسارات الأقل ازدحاماً',
            icon: Target,
            type: 'secondary' as const
          }
        ];
        break;
        
      case 'customer':
        const vipCustomers = orders.filter(order => 
          order.customer.vipLevel === 'بلاتيني' || order.customer.vipLevel === 'ذهبي'
        );
        recommendationData = vipCustomers.map(order => ({
          label: `${order.customer.name} (${order.customer.vipLevel})`,
          value: `${order.status} - ${order.elapsed} دقيقة`
        }));
        actions = [
          {
            title: 'إعطاء أولوية VIP',
            description: 'نقل عملاء VIP إلى مقدمة الطابور',
            icon: PlayCircle,
            type: 'primary' as const
          },
          {
            title: 'تقديم امتيازات خاصة',
            description: 'مشروبات مجانية وخدمة مميزة',
            icon: Target,
            type: 'success' as const
          }
        ];
        break;
        
      default:
        actions = [
          {
            title: 'تطبيق التوصية',
            description: 'تنفيذ الإجراء المقترح من المساعد الذكي',
            icon: CheckCircle2,
            type: 'primary' as const
          }
        ];
    }


    setCurrentRecommendation({
      ...recommendation,
      data: recommendationData,
      actions: actions
    });
    setShowRecommendationDialog(true);
  };

  const handleRecommendationAction = (action: any) => {
    switch (action.title) {
      case 'إعادة ترتيب الطلبات':
        optimizeOrderQueue();
        toast({
          title: "تم إعادة ترتيب الطلبات",
          description: "تم تطبيق الترتيب الذكي بناءً على الأولوية والتأخير",
          variant: "default"
        });
        break;
      case 'تنبيه المشرف':
        toast({
          title: "تم تنبيه المشرف",
          description: "تم إرسال تنبيه فوري للمشرف المناوب",
          variant: "default"
        });
        break;
      case 'إعادة توزيع الموظفين':
        smartStaffAllocation();
        toast({
          title: "تم إعادة توزيع الموظفين",
          description: "تم تخصيص موظفين إضافيين للطلبات المتأخرة",
          variant: "default"
        });
        break;
      case 'تطبيق الترتيب الذكي':
        optimizeOrderQueue();
        toast({
          title: "تم تطبيق الترتيب الذكي",
          description: "زيادة الكفاءة المتوقعة: 15%",
          variant: "default"
        });
        break;
      case 'إعطاء أولوية VIP':
        toast({
          title: "تم تحديث أولويات VIP",
          description: "تم نقل عملاء VIP إلى مقدمة الطابور",
          variant: "default"
        });
        break;
      default:
        toast({
          title: "تم تنفيذ الإجراء",
          description: "تم تطبيق التوصية بنجاح",
          variant: "default"
        });
    }
    
    setShowRecommendationDialog(false);
  };

  // Auto refresh functionality
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        setOrders(prevOrders => 
          prevOrders.map(order => ({
            ...order,
            elapsed: order.status === 'في التنفيذ' ? order.elapsed + 1 : order.elapsed
          }))
        );
        // Update AI recommendations every 5 minutes
        if (Date.now() % 300000 < 60000) {
          generateAiRecommendations();
        }
      }, 60000); // Update every minute
      
      return () => clearInterval(interval);
    }
  }, [autoRefresh, orders]);

  // Generate initial AI recommendations
  useEffect(() => {
    generateAiRecommendations();
  }, [orders]);

  const getFilteredOrdersByStatus = (status) => {
    return orders.filter(order => {
      const matchesSearch = 
        order.customer.phone.includes(searchTerm) ||
        order.car.plate.includes(searchTerm) ||
        order.customer.name.includes(searchTerm) ||
        order.id.includes(searchTerm);
      
      const matchesLane = laneFilter === 'الكل' || order.lane === laneFilter;
      const matchesStatus = status === 'all' || order.status === status;

      return matchesSearch && matchesLane && matchesStatus;
    });
  };

  const getStatusCount = (status) => {
    return status === 'all' ? orders.length : orders.filter(order => order.status === status).length;
  };

  const getTabIcon = (status) => {
    switch (status) {
      case 'بانتظار': return <PauseCircle className="h-4 w-4" />;
      case 'في التنفيذ': return <PlayCircle className="h-4 w-4" />;
      case 'جاهز': return <CheckCircle2 className="h-4 w-4" />;
      case 'ملغي': return <X className="h-4 w-4" />;
      default: return <Filter className="h-4 w-4" />;
    }
  };

  const printOrder = (order) => {
    // Simulate printing with better feedback
    const printData = {
      orderId: order.id,
      customer: order.customer,
      car: order.car,
      services: order.services,
      total: order.total,
      timestamp: new Date().toLocaleString('ar-SA')
    };
    
    // Simulate print delay
    setTimeout(() => {
      toast({ title: "طباعة الإيصال", description: `تم طباعة إيصال الطلب ${order.id} بنجاح` });
    }, 1000);
  };

  const renderOrderCard = (order) => (
    <Card 
      key={order.id} 
      className={`relative transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
        isOverdue(order) ? 'ring-2 ring-orange-500 animate-pulse' : ''
      }`}
    >
      {isOverdue(order) && (
        <div className="absolute -top-2 -right-2 z-10">
          <Badge variant="destructive" className="animate-bounce text-xs">
            <AlertTriangle className="h-3 w-3 mr-1" />
            متأخر
          </Badge>
        </div>
      )}
      
      <CardContent className="p-4">
        {/* Main Row - All info in one line */}
        <div className="flex items-center justify-between gap-4">
          
          {/* Order ID & Status */}
          <div className="flex items-center gap-3 min-w-0 flex-shrink-0">
            <CardTitle className="text-base font-bold">{order.id}</CardTitle>
            <div className={`w-2 h-2 rounded-full ${getStatusColor(order.status)} animate-pulse`}></div>
            <Badge variant={getStatusBadgeVariant(order.status)} className="text-xs px-2 py-1">
              {order.status}
            </Badge>
          </div>

          {/* Customer & Car Info */}
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <div className="flex items-center gap-2 min-w-0">
              <User className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              <span className="text-sm font-medium truncate">{order.customer.name}</span>
            </div>
            <div className="flex items-center gap-2 min-w-0">
              <Car className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              <span className="text-sm font-medium truncate">{order.car.plate}</span>
            </div>
            <div className="flex items-center gap-2 min-w-0">
              <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              <span className="text-sm truncate">{order.lane}</span>
            </div>
          </div>

          {/* Time & Progress */}
          <div className="flex items-center gap-3 min-w-0 flex-shrink-0">
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs">
                {order.status === 'جاهز' 
                  ? 'تم'
                  : `${getTimeRemaining(order)}د`
                }
              </span>
            </div>
            <div className="w-16 bg-muted rounded-full h-1.5">
              <div 
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  isOverdue(order) ? 'bg-destructive' : 'bg-primary'
                }`}
                style={{ 
                  width: `${Math.min((order.elapsed / order.estimatedTime) * 100, 100)}%` 
                }}
              ></div>
            </div>
          </div>

          {/* Price */}
          <div className="text-lg font-bold text-primary flex-shrink-0">
            {order.total} جنيه مصري
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => setSelectedOrder(order)}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl">تفاصيل الطلب {selectedOrder?.id}</DialogTitle>
                </DialogHeader>
                {selectedOrder && (
                  <div className="space-y-6">
                    {/* Customer Details */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <h4 className="font-semibold text-lg flex items-center gap-2">
                          <User className="h-5 w-5 text-primary" />
                          بيانات العميل
                        </h4>
                        <div className="space-y-2 text-sm">
                          <p><span className="font-medium">الاسم:</span> {selectedOrder.customer.name}</p>
                          <p><span className="font-medium">الجوال:</span> {selectedOrder.customer.phone}</p>
                          <p><span className="font-medium">البريد:</span> {selectedOrder.customer.email}</p>
                          <p><span className="font-medium">مستوى العضوية:</span> 
                            <Badge variant="outline" className="mr-2">{selectedOrder.customer.vipLevel}</Badge>
                          </p>
                          <p><span className="font-medium">عدد الزيارات:</span> {selectedOrder.customer.visitCount}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="font-semibold text-lg flex items-center gap-2">
                          <Car className="h-5 w-5 text-primary" />
                          بيانات المشروب
                        </h4>
                        <div className="space-y-2 text-sm">
                          <p><span className="font-medium">رقم اللوحة:</span> {selectedOrder.car.plate}</p>
                          <p><span className="font-medium">الطراز:</span> {selectedOrder.car.model}</p>
                          <p><span className="font-medium">اللون:</span> {selectedOrder.car.color}</p>
                          <p><span className="font-medium">المسار:</span> {selectedOrder.lane}</p>
                        </div>
                      </div>
                    </div>

                    {/* Services and Payment */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <h4 className="font-semibold text-lg">الخدمات المطلوبة</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedOrder.services.map((service, index) => (
                            <Badge key={index} variant="secondary" className="text-sm">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="font-semibold text-lg">تفاصيل الدفع</h4>
                        <div className="space-y-2 text-sm">
                          <p><span className="font-medium">المبلغ الإجمالي:</span> {selectedOrder.total} جنيه مصري</p>
                          <p><span className="font-medium">طريقة الدفع:</span> {selectedOrder.paymentMethod}</p>
                          <p><span className="font-medium">الخصم:</span> {selectedOrder.discount}%</p>
                          <p><span className="font-medium">الأولوية:</span> 
                            <Badge variant={selectedOrder.priority === 'عالي' ? 'destructive' : 'outline'} className="mr-2">
                              {selectedOrder.priority}
                            </Badge>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Work Stages */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-lg flex items-center gap-2">
                        <Clock className="h-5 w-5 text-primary" />
                        مراحل العمل والموظفين
                      </h4>
                      <div className="space-y-3">
                        {selectedOrder.stages.map((stage, index) => (
                          <div key={index} className={`flex items-center justify-between p-3 rounded-lg border ${
                            stage.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                          }`}>
                            <div className="flex items-center gap-3">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                stage.completed ? 'bg-green-500' : 'bg-gray-300'
                              }`}>
                                {stage.completed ? (
                                  <CheckCircle2 className="h-4 w-4 text-white" />
                                ) : (
                                  <span className="text-white text-xs font-bold">{index + 1}</span>
                                )}
                              </div>
                              <div>
                                <p className="font-medium">{stage.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  المسؤول: {stage.staff}
                                </p>
                              </div>
                            </div>
                            <div className="text-left text-sm text-muted-foreground">
                              <p>الوقت: {stage.time}</p>
                              <p>المدة: {stage.duration} دقيقة</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Notes */}
                    {selectedOrder.notes && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-lg">ملاحظات خاصة</h4>
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-sm">{selectedOrder.notes}</p>
                        </div>
                      </div>
                    )}

                    {/* Time Summary */}
                    <div className="grid grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">وقت البدء</p>
                        <p className="font-medium">{new Date(selectedOrder.startTime).toLocaleTimeString('ar-SA')}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">الوقت المستغرق</p>
                        <p className="font-medium">{selectedOrder.elapsed} دقيقة</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">الوقت المتوقع</p>
                        <p className="font-medium">{selectedOrder.estimatedTime} دقيقة</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t">
                      <Button onClick={() => printOrder(selectedOrder)} className="flex-1">
                        <Printer className="h-4 w-4 mr-2" />
                        طباعة الإيصال
                      </Button>
                      <Button variant="outline" className="flex-1">
                        تحديث البيانات
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>

            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => printOrder(order)}
            >
              <Printer className="h-4 w-4" />
            </Button>

            {order.status !== 'جاهز' && order.status !== 'ملغي' && (
              <Select 
                value={order.status} 
                onValueChange={(newStatus) => updateOrderStatus(order.id, newStatus)}
              >
                <SelectTrigger className="h-8 w-8 p-0 border-none hover:bg-muted">
                  <RotateCcw className="h-4 w-4" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="بانتظار">بانتظار</SelectItem>
                  <SelectItem value="في التنفيذ">في التنفيذ</SelectItem>
                  <SelectItem value="جاهز">جاهز</SelectItem>
                </SelectContent>
              </Select>
            )}

            {order.status !== 'ملغي' && order.status !== 'جاهز' && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => cancelOrder(order.id)}
                className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Services Row - Compact */}
        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-muted">
          <span className="text-xs text-muted-foreground">الخدمات:</span>
          <div className="flex flex-wrap gap-1">
            {order.services.slice(0, 3).map((service, index) => (
              <Badge key={index} variant="outline" className="text-xs px-1 py-0 h-5">
                {service}
              </Badge>
            ))}
            {order.services.length > 3 && (
              <Badge variant="outline" className="text-xs px-1 py-0 h-5">
                +{order.services.length - 3}
              </Badge>
            )}
          </div>
          {order.notes && (
            <Badge variant="secondary" className="text-xs px-1 py-0 h-5 mr-auto">
              ملاحظات
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">الطلبات الجارية</h1>
          <p className="text-gray-600">متابعة حالة جميع الطلبات النشطة في الوقت الفعلي</p>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-gradient-to-r from-primary/5 to-accent/5 backdrop-blur-sm border shadow-lg rounded-xl p-1 relative overflow-hidden">
            {/* Background glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-accent/20 opacity-50 blur-xl"></div>
            
            <TabsTrigger 
              value="orders" 
              className="relative z-10 flex items-center gap-2 transition-all duration-500 hover:scale-105 hover:shadow-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/90 data-[state=active]:text-white data-[state=active]:shadow-elegant data-[state=active]:scale-105 group"
            >
              <Clock className="h-4 w-4 transition-all duration-300 group-hover:rotate-12 group-data-[state=active]:animate-pulse" />
              الطلبات
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
            </TabsTrigger>
            
            <TabsTrigger 
              value="ai-assistant" 
              className="relative z-10 flex items-center gap-2 transition-all duration-500 hover:scale-105 hover:shadow-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-accent data-[state=active]:to-secondary-cyan data-[state=active]:text-white data-[state=active]:shadow-cyan data-[state=active]:scale-105 group"
            >
              <Brain className="h-4 w-4 transition-all duration-300 group-hover:scale-110 group-data-[state=active]:animate-pulse" />
              المساعد الذكي
              <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
            </TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">

        {/* Search and Filters */}
        <Card className="mb-6 animate-fade-in">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-gray-500" />
                <Input
                  placeholder="بحث برقم الجوال، اللوحة، أو رقم الطلب..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-80 transition-all focus:scale-105"
                />
              </div>

              <Select value={laneFilter} onValueChange={setLaneFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="المسار" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="الكل">جميع المسارات</SelectItem>
                  <SelectItem value="المسار 1">المسار 1</SelectItem>
                  <SelectItem value="المسار 2">المسار 2</SelectItem>
                  <SelectItem value="المسار 3">المسار 3</SelectItem>
                  <SelectItem value="المسار 4">المسار 4</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                variant={autoRefresh ? "default" : "outline"} 
                className="ml-auto transition-all hover:scale-105"
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                {autoRefresh ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Bell className="h-4 w-4 mr-2" />}
                {autoRefresh ? 'إيقاف التحديث' : 'تحديث تلقائي'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* AI Recommendations Panel */}
        {aiRecommendations.length > 0 && (
          <Card className="mb-6 animate-fade-in border-primary/20 bg-gradient-to-r from-blue-50 to-purple-50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  توصيات ذكية لتحسين العمليات
                </CardTitle>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={optimizeOrderQueue}
                    className="hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    تحسين الترتيب
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={smartStaffAllocation}
                    className="hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    توزيع الموظفين
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowAiInsights(!showAiInsights)}
                  >
                    <Lightbulb className="h-4 w-4 mr-2" />
                    {showAiInsights ? 'إخفاء' : 'عرض'} التحليلات
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {aiRecommendations.map((rec, index) => {
                const IconComponent = rec.icon;
                return (
                  <div 
                    key={index} 
                    className={`flex items-start gap-3 p-3 rounded-lg border transition-all hover:shadow-md ${
                      rec.priority === 'high' 
                        ? 'bg-red-50 border-red-200 hover:bg-red-100' 
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`p-2 rounded-full ${
                      rec.priority === 'high' ? 'bg-red-100' : 'bg-blue-100'
                    }`}>
                      <IconComponent className={`h-4 w-4 ${
                        rec.priority === 'high' ? 'text-red-600' : 'text-blue-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">{rec.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                      <Button variant="link" size="sm" className="p-0 h-auto text-primary">
                        {rec.action}
                      </Button>
                    </div>
                    <Badge variant={rec.priority === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                      {rec.priority === 'high' ? 'عاجل' : 'متوسط'}
                    </Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* AI Analytics Dashboard */}
        {showAiInsights && (
          <Card className="mb-6 animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                تحليلات ذكية في الوقت الفعلي
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">متوسط وقت الخدمة</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">
                    {Math.round(orders.reduce((sum, order) => sum + order.estimatedTime, 0) / orders.length)} دقيقة
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">معدل الإنجاز</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    {Math.round((orders.filter(o => o.status === 'جاهز').length / orders.length) * 100)}%
                  </p>
                </div>
                
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium">طلبات متأخرة</span>
                  </div>
                  <p className="text-2xl font-bold text-yellow-600">
                    {orders.filter(order => isOverdue(order)).length}
                  </p>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium">عملاء VIP</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-600">
                    {orders.filter(o => o.customer.vipLevel === 'بلاتيني' || o.customer.vipLevel === 'ذهبي').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Orders Status Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="animate-fade-in">
          <TabsList className="grid w-full grid-cols-5 mb-6 bg-white shadow-md">
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
            >
              <Filter className="h-4 w-4 mr-1" />
              الكل ({getStatusCount('all')})
            </TabsTrigger>
            <TabsTrigger 
              value="بانتظار"
              className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white transition-all"
            >
              <PauseCircle className="h-4 w-4 mr-1" />
              بانتظار ({getStatusCount('بانتظار')})
            </TabsTrigger>
            <TabsTrigger 
              value="في التنفيذ"
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all"
            >
              <PlayCircle className="h-4 w-4 mr-1" />
              في التنفيذ ({getStatusCount('في التنفيذ')})
            </TabsTrigger>
            <TabsTrigger 
              value="جاهز"
              className="data-[state=active]:bg-green-500 data-[state=active]:text-white transition-all"
            >
              <CheckCircle2 className="h-4 w-4 mr-1" />
              جاهز ({getStatusCount('جاهز')})
            </TabsTrigger>
            <TabsTrigger 
              value="ملغي"
              className="data-[state=active]:bg-red-500 data-[state=active]:text-white transition-all"
            >
              <X className="h-4 w-4 mr-1" />
              ملغي ({getStatusCount('ملغي')})
            </TabsTrigger>
          </TabsList>

          {['all', 'بانتظار', 'في التنفيذ', 'جاهز', 'ملغي'].map(status => (
            <TabsContent key={status} value={status} className="animate-fade-in">
              <div className="space-y-4">
                {getFilteredOrdersByStatus(status).map(order => renderOrderCard(order))}
              </div>
              
              {getFilteredOrdersByStatus(status).length === 0 && (
                <Card className="p-8 text-center animate-scale-in">
                  <div className="text-gray-500 text-lg">
                    {status === 'all' ? 'لا توجد طلبات' : `لا توجد طلبات ${status}`}
                  </div>
                </Card>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* Cancel Order Dialog */}
        <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                إلغاء الطلب
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                يرجى تحديد سبب إلغاء الطلب لتحليل المشاكل وتحسين جودة الخدمة:
              </p>
              
              <Select value={cancelReason} onValueChange={setCancelReason}>
                <SelectTrigger>
                  <SelectValue placeholder="اختج.مبب الإلغاء..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="عدم توفر المواد">عدم توفر المواد المطلوبة</SelectItem>
                  <SelectItem value="تأخير في الخدمة">تأخير في تقديم الخدمة</SelectItem>
                  <SelectItem value="عطل في المعدات">عطل في المعدات</SelectItem>
                  <SelectItem value="طلب العميل">طلب من العميل</SelectItem>
                  <SelectItem value="مشكلة فنية">مشكلة فنية</SelectItem>
                  <SelectItem value="ازدحام">ازدحام شديد</SelectItem>
                  <SelectItem value="مشكلة في الدفع">مشكلة في طريقة الدفع</SelectItem>
                  <SelectItem value="أخرى">سبب آخر</SelectItem>
                </SelectContent>
              </Select>

              {cancelReason === 'أخرى' && (
                <Input
                  placeholder="يرجى تحديد السبب..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                />
              )}

              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    setShowCancelDialog(false);
                    setCancelOrderId(null);
                    setCancelReason('');
                  }}
                >
                  إلغاء
                </Button>
                <Button 
                  variant="destructive" 
                  className="flex-1"
                  onClick={confirmCancelOrder}
                  disabled={!cancelReason.trim()}
                >
                  تأكيد الإلغاء
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
          
          </TabsContent>

          {/* AI Assistant Tab */}
          <TabsContent value="ai-assistant" className="space-y-6 animate-fade-in">
            
            {/* Smart Recommendations Header */}
            <Card className="bg-gradient-to-r from-accent/10 to-primary/10 border-accent/20 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className="p-3 bg-gradient-to-r from-accent to-secondary rounded-full shadow-elegant">
                    <Lightbulb className="h-6 w-6 text-white animate-pulse" />
                  </div>
                  <CardTitle className="text-2xl bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
                    التوصيات الذكية
                  </CardTitle>
                </div>
                <p className="text-muted-foreground">
                  اكتشف فرص التحسين وزيادة الكفاءة من خلال تحليل البيانات الذكي
                </p>
              </CardHeader>
            </Card>

            {/* Smart Insights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Peak Hours Analysis */}
              <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 border-primary/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">تحليل ساعات الذروة</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">الذروة الحالية</span>
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        2:00 - 4:00 م
                      </Badge>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-gradient-to-r from-primary to-primary-glow h-2 rounded-full w-4/5 animate-pulse"></div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      80% من الطلبات تتركز في هذا الوقت
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Order Efficiency */}
              <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 border-accent/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-accent" />
                    <CardTitle className="text-lg">كفاءة التنفيذ</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">متوسط وقت التنفيذ</span>
                      <Badge variant="secondary" className="bg-accent/10 text-accent">
                        15 دقيقة
                      </Badge>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-gradient-to-r from-accent to-secondary h-2 rounded-full w-3/5"></div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      تحسن بنسبة 25% عن الأسبوع الماضي
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Satisfaction */}
              <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 border-secondary/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-secondary" />
                    <CardTitle className="text-lg">رضا العملاء</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">التقييم الحالي</span>
                      <Badge variant="secondary" className="bg-secondary/10 text-secondary">
                        4.8/5
                      </Badge>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-gradient-to-r from-secondary to-secondary-foreground h-2 rounded-full w-5/6"></div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      96% من العملاء راضون عن الخدمة
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>


            {/* Action Recommendations */}
            <Card className="bg-gradient-to-r from-muted/50 to-background border-dashed border-2 border-muted-foreground/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowRight className="h-5 w-5" />
                  الإجراءات المقترحة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    className="justify-start h-auto p-4 hover:bg-primary/5 hover:border-primary/30 transition-all duration-300"
                  >
                    <div className="text-right">
                      <div className="font-medium">تحسين توزيع المهام</div>
                      <div className="text-sm text-muted-foreground">إعادة تنظيم الطلبات حسب الأولوية</div>
                    </div>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="justify-start h-auto p-4 hover:bg-accent/5 hover:border-accent/30 transition-all duration-300"
                  >
                    <div className="text-right">
                      <div className="font-medium">جدولة الموارد</div>
                      <div className="text-sm text-muted-foreground">تحسين استخدام الموظفين والمعدات</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

          </TabsContent>

        </Tabs>
      </div>
      <Toaster />
    </div>
  );
}