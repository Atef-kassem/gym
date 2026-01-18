import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Car, 
  Users, 
  MapPin, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  Activity, 
  Calendar,
  Navigation,
  Truck,
  BarChart3,
  Star,
  Target,
  Fuel,
  Wrench,
  UserCheck,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Settings,
  Eye,
  Edit,
  Trash2,
  Plus,
  Filter,
  Search,
  Download,
  Upload,
  Bell,
  MessageSquare,
  Phone,
  Mail,
  Building,
  Gauge,
  Route,
  Timer,
  Zap,
  Shield,
  Award,
  TrendingDown,
  AlertCircle,
  PieChart,
  LineChart,
  MapPinIcon,
  UserX,
  FileText,
  Calendar as CalendarIcon,
  ClockIcon,
  CarIcon,
  DollarSignIcon
} from "lucide-react";
import { BranchSelector } from "@/components/BranchSelector";
import { Line, LineChart as RechartsLineChart, Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart as RechartsPieChart, Pie, Cell, Area, AreaChart } from "recharts";
import { useMobileWashData } from "@/hooks/useMobileWashData";
import { useToast } from "@/hooks/use-toast";
import SimpleTrackingMap from "@/components/MobileWash/SimpleTrackingMap";

export default function MobileWashDashboard() {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState("today");
  const [isAutoRefresh, setIsAutoRefresh] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isVehicleDialogOpen, setIsVehicleDialogOpen] = useState(false);
  const [isAnalyticsExpanded, setIsAnalyticsExpanded] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  const [mapboxToken, setMapboxToken] = useState('');
  
  const { 
    bookings, 
    fleet, 
    analytics, 
    loading, 
    error, 
    getPerformanceMetrics,
    refreshData 
  } = useMobileWashData();
  const { toast } = useToast();

  // Auto-refresh functionality
  useEffect(() => {
    if (isAutoRefresh) {
      const interval = setInterval(() => {
        handleRefresh(false);
      }, 30000); // Refresh every 30 seconds

      return () => clearInterval(interval);
    }
  }, [isAutoRefresh]);

  // Real-time notifications
  useEffect(() => {
    const checkForNotifications = () => {
      const lowFuelVehicles = fleet?.filter(v => v.vehicle.fuelLevel < 20) || [];
      const overdueBookings = bookings?.filter(b => 
        b.status === 'مجدول' && 
        new Date(b.scheduling.date + ' ' + b.scheduling.time) < new Date()
      ) || [];
      
      const newNotifications = [
        ...lowFuelVehicles.map(v => ({
          id: `fuel-${v.id}`,
          type: 'warning',
          title: 'مستوى وقود منخفض',
          message: `المركبة ${v.name} تحتاج لإعادة التزود بالوقود (${v.vehicle.fuelLevel}%)`,
          vehicleId: v.id
        })),
        ...overdueBookings.map(b => ({
          id: `overdue-${b.id}`,
          type: 'error',
          title: 'حجز متأخر',
          message: `الحجز ${b.id} للعميل ${b.customerName} متأخر عن موعده`,
          bookingId: b.id
        }))
      ];
      
      setNotifications(newNotifications);
    };

    if (fleet && bookings) {
      checkForNotifications();
    }
  }, [fleet, bookings]);

  // Calculate enhanced real-time metrics
  const metrics = useMemo(() => {
    if (!bookings || !fleet || !analytics) return null;
    
    const today = new Date().toISOString().split('T')[0];
    const activeVehicles = fleet.filter(v => v.status.operational === 'نشط').length;
    const completedToday = bookings.filter(b => 
      b.status === 'مكتمل' && 
      b.scheduling.date === today
    ).length;
    const pendingBookings = bookings.filter(b => 
      b.status === 'مجدول' || b.status === 'في الطريق'
    ).length;
    const inProgressBookings = bookings.filter(b => b.status === 'في التنفيذ').length;
    const totalRevenue = bookings
      .filter(b => b.status === 'مكتمل')
      .reduce((sum, b) => sum + (b.serviceDetails?.price || 0), 0);
    const todayRevenue = bookings
      .filter(b => b.status === 'مكتمل' && b.scheduling.date === today)
      .reduce((sum, b) => sum + (b.serviceDetails?.price || 0), 0);
    const averageRating = bookings
      .filter(b => b.rating)
      .reduce((sum, b, _, arr) => sum + (b.rating || 0) / arr.length, 0);
    const averageServiceTime = bookings
      .filter(b => b.status === 'مكتمل' && b.serviceDetails?.duration)
      .reduce((sum, b, _, arr) => sum + (b.serviceDetails?.duration || 0) / arr.length, 0);
    const averageFuel = fleet.reduce((sum, v, _, arr) => sum + v.vehicle.fuelLevel / arr.length, 0);
    const utilizationRate = (activeVehicles / fleet.length) * 100;
    const completionRate = bookings.length > 0 ? (bookings.filter(b => b.status === 'مكتمل').length / bookings.length) * 100 : 0;

    return {
      activeVehicles,
      totalBookings: bookings.length,
      completedToday,
      pendingBookings,
      inProgressBookings,
      totalRevenue,
      todayRevenue,
      customerSatisfaction: Number(averageRating.toFixed(1)) || 4.8,
      averageServiceTime: Math.round(averageServiceTime) || 45,
      fuelEfficiency: Math.round(averageFuel) || 85,
      utilizationRate: Math.round(utilizationRate),
      completionRate: Math.round(completionRate),
      totalFleet: fleet.length
    };
  }, [bookings, fleet, analytics]);

  // Enhanced recent bookings with filtering
  const recentBookings = useMemo(() => {
    let filtered = bookings.filter(b => 
      b.status === 'في التنفيذ' || b.status === 'في الطريق' || b.status === 'مجدول'
    );

    if (filterStatus !== 'all') {
      filtered = filtered.filter(b => b.status === filterStatus);
    }

    if (searchTerm) {
      filtered = filtered.filter(b => 
        b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.phoneNumber.includes(searchTerm) ||
        b.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered.slice(0, 10).map(booking => ({
      id: booking.id,
      customerName: booking.customerName,
      phoneNumber: booking.phoneNumber,
      location: booking.location.address,
      district: booking.location.district,
      serviceType: booking.serviceDetails.type,
      scheduledDate: booking.scheduling.date,
      scheduledTime: booking.scheduling.time,
      estimatedDuration: booking.serviceDetails.duration,
      price: booking.serviceDetails.price,
      status: booking.status,
      vehicleId: booking.assignment.vehicleId,
      technician: booking.assignment.technicianName,
      priority: booking.priority || 'normal',
      progress: booking.progress || 0
    }));
  }, [bookings, filterStatus, searchTerm]);

  // Enhanced fleet status with search and filter
  const fleetStatus = useMemo(() => {
    return fleet.map(vehicle => ({
      id: vehicle.id,
      name: vehicle.name,
      driver: vehicle.driver.name,
      driverPhone: vehicle.driver.phone,
      location: vehicle.location.current.address,
      coordinates: vehicle.location.current.coordinates,
      status: vehicle.status.availability,
      operational: vehicle.status.operational,
      currentBooking: vehicle.status.currentBooking,
      fuel: vehicle.vehicle.fuelLevel,
      mileage: vehicle.vehicle.mileage,
      speed: vehicle.vehicle.speed,
      lastMaintenance: vehicle.maintenance.lastService,
      nextMaintenance: vehicle.maintenance.nextService,
      maintenanceStatus: vehicle.maintenance.status,
      todayServices: vehicle.performance.todayServices,
      efficiency: vehicle.performance.efficiency,
      rating: vehicle.driver.rating,
      experience: vehicle.driver.experience
    }));
  }, [fleet]);

  // Enhanced performance data
  const performanceData = useMemo(() => {
    if (!analytics?.performance?.daily) return [];
    return analytics.performance.daily.slice(-7).map(day => ({
      date: day.date,
      bookings: day.bookings,
      revenue: day.revenue / 1000, // Convert to thousands
      satisfaction: day.satisfaction,
      efficiency: Math.random() * 20 + 80 // Mock efficiency data
    }));
  }, [analytics]);

  // Service distribution
  const serviceDistribution = useMemo(() => {
    if (!bookings.length) return [];
    
    const serviceCount = bookings.reduce((acc, booking) => {
      const service = booking.serviceDetails.type;
      acc[service] = (acc[service] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];
    return Object.entries(serviceCount).map(([name, count], index) => ({
      name,
      value: count,
      color: colors[index % colors.length],
      percentage: Math.round((count / bookings.length) * 100)
    }));
  }, [bookings]);

  const handleRefresh = async (showToast = true) => {
    setIsRefreshing(true);
    try {
      await refreshData();
      if (showToast) {
        toast({
          title: "🔄 تم تحديث البيانات",
          description: "تم تحديث جميع البيانات بنجاح",
          className: "bg-green-50 border-green-200"
        });
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
      if (showToast) {
        toast({
          title: "❌ خطأ في التحديث",
          description: "حدث خطأ أثناء تحديث البيانات",
          variant: "destructive"
        });
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleVehicleAction = (vehicleId: string, action: string) => {
    switch(action) {
      case 'تتبع':
        navigate('/mobile-wash/live-tracking', { state: { vehicleId } });
        break;
      case 'اتصال':
        const vehicle = fleet.find(v => v.id === vehicleId);
        if (vehicle) {
          window.open(`tel:${vehicle.driver.phone}`);
        }
        break;
      default:
        toast({
          title: `✅ تم ${action} المركبة`,
          description: `تم ${action} المركبة ${vehicleId} بنجاح`,
          className: "bg-blue-50 border-blue-200"
        });
    }
  };

  // Enhanced functions for all buttons
  const handleExportData = () => {
    const data = {
      bookings: recentBookings,
      fleet: fleetStatus,
      metrics,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mobile-wash-report-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "📊 تم تصدير البيانات",
      description: "تم تصدير تقرير شامل بنجاح",
      className: "bg-green-50 border-green-200"
    });
  };

  const handleCreateBooking = () => {
    navigate('/mobile-wash/booking-management', { state: { action: 'create' } });
  };

  const handleViewBookingDetails = (bookingId: string) => {
    navigate('/mobile-wash/booking-management', { state: { bookingId, action: 'view' } });
  };

  const handleEditBooking = (bookingId: string) => {
    navigate('/mobile-wash/booking-management', { state: { bookingId, action: 'edit' } });
  };

  const handleTrackBooking = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking?.assignment?.vehicleId) {
      navigate('/mobile-wash/live-tracking', { 
        state: { 
          vehicleId: booking.assignment.vehicleId,
          bookingId 
        } 
      });
    } else {
      toast({
        title: "❌ لا يمكن التتبع",
        description: "لم يتم تعيين مركبة لهذا الحجز بعد",
        variant: "destructive"
      });
    }
  };

  const handleAddVehicle = () => {
    navigate('/mobile-wash/fleet-management', { state: { action: 'add' } });
  };

  const handleFleetSettings = () => {
    navigate('/mobile-wash/fleet-management', { state: { action: 'settings' } });
  };

  const handleNotificationCenter = () => {
    toast({
      title: "📢 مركز الإشعارات",
      description: `يتم عرض ${notifications.length} إشعار حالياً`,
      className: "bg-blue-50 border-blue-200"
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "في التنفيذ": { color: "bg-blue-500 hover:bg-blue-600", text: "text-white" },
      "في الطريق": { color: "bg-yellow-500 hover:bg-yellow-600", text: "text-white" },
      "مجدول": { color: "bg-green-500 hover:bg-green-600", text: "text-white" },
      "مكتمل": { color: "bg-emerald-500 hover:bg-emerald-600", text: "text-white" },
      "ملغي": { color: "bg-red-500 hover:bg-red-600", text: "text-white" },
      "متاح": { color: "bg-blue-500 hover:bg-blue-600", text: "text-white" },
      "مشغول": { color: "bg-orange-500 hover:bg-orange-600", text: "text-white" },
      "صيانة": { color: "bg-red-500 hover:bg-red-600", text: "text-white" },
      "نشط": { color: "bg-green-500 hover:bg-green-600", text: "text-white" }
    };
    
    const config = statusConfig[status] || { color: "bg-gray-500", text: "text-white" };
    
    return (
      <Badge className={`${config.color} ${config.text} transition-all duration-200 hover:scale-105 shadow-sm`}>
        {status}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      "high": { color: "bg-red-100 text-red-800 border-red-200", icon: Zap },
      "normal": { color: "bg-blue-100 text-blue-800 border-blue-200", icon: Timer },
      "low": { color: "bg-gray-100 text-gray-800 border-gray-200", icon: Target }
    };
    const config = priorityConfig[priority] || priorityConfig.normal;
    const Icon = config.icon;
    
    return (
      <Badge variant="outline" className={`${config.color} transition-all duration-200 hover:scale-105`}>
        <Icon className="h-3 w-3 ml-1" />
        {priority === 'high' ? 'عالية' : priority === 'low' ? 'منخفضة' : 'عادية'}
      </Badge>
    );
  };

  if (loading && !metrics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-muted/30 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="text-center py-20 animate-fade-in">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-6"></div>
              <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-primary/20 mx-auto animate-pulse"></div>
            </div>
            <h3 className="text-2xl font-bold mb-2">جاري تحميل البيانات</h3>
            <p className="text-lg text-muted-foreground">يتم تحميل بيانات الكافية المتنقلة...</p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-muted/30 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="text-center py-20 animate-fade-in">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-red-600">حدث خطأ</h3>
            <p className="text-lg text-red-500 mb-6">{error}</p>
            <Button 
              onClick={() => handleRefresh()}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 hover:scale-105"
            >
              <RefreshCw className="h-4 w-4 ml-2" />
              إعادة المحاولة
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Professional Header */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Truck className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">
                  لوحة تحكم الكافية المتنقلة
                </h1>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>آخر تحديث: الآن</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>متصل مباشر</span>
                </div>
                {notifications.length > 0 && (
                  <div className="flex items-center gap-1 text-orange-600">
                    <Bell className="h-3 w-3" />
                    <span>{notifications.length} تنبيه</span>
                  </div>
                )}
              </div>
            </div>
            
            <BranchSelector />
          </div>
        </div>

        {/* Control Panel Section */}
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                <Switch
                  id="auto-refresh"
                  checked={isAutoRefresh}
                  onCheckedChange={setIsAutoRefresh}
                />
                <Label htmlFor="auto-refresh" className="text-sm text-gray-700">تحديث تلقائي</Label>
              </div>
              
              <Button
                onClick={() => handleRefresh()}
                disabled={isRefreshing}
                variant="outline"
                size="sm"
                className="border-gray-200 hover:bg-gray-50"
              >
                <RefreshCw className={`h-4 w-4 ml-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                تحديث
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="border-gray-200 hover:bg-gray-50"
                onClick={handleExportData}
              >
                <Download className="h-4 w-4 ml-2" />
                تصدير
              </Button>
            </div>
          </div>
          </div>
        </div>

        {/* Notifications Bar */}
        {notifications.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-orange-600" />
              <div className="flex-1">
                <h4 className="font-semibold text-orange-800">تنبيهات مهمة</h4>
                <div className="space-y-1">
                  {notifications.slice(0, 2).map(notification => (
                    <p key={notification.id} className="text-sm text-orange-700">
                      • {notification.message}
                    </p>
                  ))}
                  {notifications.length > 2 && (
                    <p className="text-xs text-orange-600">
                      و {notifications.length - 2} تنبيهات أخرى...
                    </p>
                  )}
                </div>
              </div>
              <Button size="sm" variant="outline" className="text-orange-600 border-orange-300 hover:bg-orange-100" onClick={handleNotificationCenter}>
                عرض الكل
              </Button>
            </div>
          </div>
        )}

        {/* Professional KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Truck className="h-6 w-6 text-blue-600" />
              </div>
              <Badge className="bg-blue-500 text-white">نشط</Badge>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-gray-900">{metrics.activeVehicles}</div>
              <div className="text-sm text-gray-600">المركبات المحدودة</div>
              <div className="text-xs text-gray-500">{metrics.totalFleet} جنيه</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <Badge className="bg-green-500 text-white">نشط</Badge>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-gray-900">{metrics.completedToday}</div>
              <div className="text-sm text-gray-600">جميع المركبات المحدودة</div>
              <div className="text-xs text-gray-500">{(metrics.completedToday * 150).toLocaleString()} جنيه</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
              <Badge className="bg-yellow-500 text-white">نشط</Badge>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-gray-900">2,847</div>
              <div className="text-sm text-gray-600"> الكافية المحدودة</div>
              <div className="text-xs text-gray-500">{metrics.todayRevenue.toLocaleString()} جنيه</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-all border-2 border-blue-500">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Star className="h-6 w-6 text-blue-600" />
              </div>
              <Badge className="bg-blue-500 text-white">نشط</Badge>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-gray-900">708</div>
              <div className="text-sm text-gray-600"> الكافية المحدودة</div>
              <div className="text-xs text-gray-500">165,250 جنيه</div>
            </div>
          </div>
        </div>

        {/* Enhanced Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-gradient-to-r from-gray-50 to-gray-100">
            <TabsTrigger value="overview" className="transition-all duration-200 hover:scale-105">
              <BarChart3 className="h-4 w-4 ml-2" />
              نظرة عامة
            </TabsTrigger>
            <TabsTrigger value="tracking-map" className="transition-all duration-200 hover:scale-105">
              <Navigation className="h-4 w-4 ml-2" />
              التتبع المباشر
            </TabsTrigger>
            <TabsTrigger value="bookings" className="transition-all duration-200 hover:scale-105">
              <Calendar className="h-4 w-4 ml-2" />
              البيع النشطة
            </TabsTrigger>
            <TabsTrigger value="fleet" className="transition-all duration-200 hover:scale-105">
              <Truck className="h-4 w-4 ml-2" />
              إدارة الأسطول
            </TabsTrigger>
            <TabsTrigger value="performance" className="transition-all duration-200 hover:scale-105">
              <TrendingUp className="h-4 w-4 ml-2" />
              الأداء والتحليلات
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="transition-all duration-200 hover:scale-105">
              <Wrench className="h-4 w-4 ml-2" />
              الصيانة
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Enhanced Revenue Chart */}
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <LineChart className="h-5 w-5 text-primary" />
                        الأداء اليومي
                      </CardTitle>
                      <CardDescription>تطور البيع والإيرادات خلال آخر 7 أيام</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="transition-all duration-200 hover:scale-105" onClick={() => setIsAnalyticsExpanded(!isAnalyticsExpanded)}>
                      <Eye className="h-4 w-4 ml-2" />
                      {isAnalyticsExpanded ? 'إخفاء' : 'تفاصيل'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={performanceData}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="date" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#3b82f6" 
                        fillOpacity={1} 
                        fill="url(#colorRevenue)"
                        name="الإيرادات (آلاف)"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="bookings" 
                        stroke="#10b981" 
                        fillOpacity={1} 
                        fill="url(#colorBookings)"
                        name="البيع"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Enhanced Service Distribution */}
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <PieChart className="h-5 w-5 text-primary" />
                        توزيع الخدمات
                      </CardTitle>
                      <CardDescription>نسب الخدمات المقدمة هذا الشهر</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="transition-all duration-200 hover:scale-105" onClick={() => navigate('/mobile-wash/quality-management')}>
                      <Settings className="h-4 w-4 ml-2" />
                      إعدادات
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col lg:flex-row items-center gap-6">
                    <div className="flex-1">
                      <ResponsiveContainer width="100%" height={250}>
                        <RechartsPieChart>
                          <Pie
                            data={serviceDistribution}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({name, percentage}) => `${name} (${percentage}%)`}
                          >
                            {serviceDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-3">
                      {serviceDistribution.map((service, index) => (
                        <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: service.color }}
                          ></div>
                          <div>
                            <p className="font-medium text-sm">{service.name}</p>
                            <p className="text-xs text-muted-foreground">{service.value} حجز ({service.percentage}%)</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-cyan-50 to-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-cyan-700">
                    <Clock className="h-5 w-5" />
                    متوسط زمن الخدمة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-cyan-800 animate-pulse">{metrics.averageServiceTime} دقيقة</div>
                  <Progress value={85} className="mt-2 h-2" />
                  <p className="text-xs text-cyan-600 mt-1">85% من الهدف (40 دقيقة)</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-emerald-50 to-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-emerald-700">
                    <Fuel className="h-5 w-5" />
                    كفاءة الوقود
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-emerald-800 animate-pulse">{metrics.fuelEfficiency}%</div>
                  <Progress value={metrics.fuelEfficiency} className="mt-2 h-2" />
                  <p className="text-xs text-emerald-600 mt-1">متوسط مستوى الوقود</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-orange-50 to-red-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-700">
                    <Target className="h-5 w-5" />
                    معدل الإنجاز
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-800 animate-pulse">{metrics.completionRate}%</div>
                  <Progress value={metrics.completionRate} className="mt-2 h-2" />
                  <p className="text-xs text-orange-600 mt-1">من إجمالي البيع</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-violet-50 to-purple-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-violet-700">
                    <Gauge className="h-5 w-5" />
                    كفاءة الأسطول
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-violet-800 animate-pulse">{metrics.utilizationRate}%</div>
                  <Progress value={metrics.utilizationRate} className="mt-2 h-2" />
                  <p className="text-xs text-violet-600 mt-1">معدل استخدام المركبات</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Interactive Tracking Map Tab */}
          <TabsContent value="tracking-map" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <SimpleTrackingMap
                vehicles={fleetStatus.map(vehicle => {
                  // Convert coordinates to [lng, lat] format
                  let coordinates: [number, number] = [45.0792, 23.8859]; // Default Saudi Arabia center
                  if (vehicle.coordinates) {
                    if (Array.isArray(vehicle.coordinates) && vehicle.coordinates.length >= 2) {
                      coordinates = [vehicle.coordinates[0], vehicle.coordinates[1]];
                    } else if (typeof vehicle.coordinates === 'object' && 'lat' in vehicle.coordinates && 'lng' in vehicle.coordinates) {
                      coordinates = [vehicle.coordinates.lng, vehicle.coordinates.lat];
                    }
                  }
                  
                  return {
                    id: vehicle.id,
                    name: vehicle.name,
                    driver: {
                      name: vehicle.driver,
                      phone: vehicle.driverPhone
                    },
                    location: {
                      current: {
                        coordinates,
                        address: vehicle.location
                      }
                    },
                    status: {
                      availability: vehicle.status,
                      operational: vehicle.operational
                    },
                    vehicle: {
                      fuelLevel: vehicle.fuel,
                      speed: vehicle.speed
                    }
                  };
                })}
                bookings={recentBookings.map(booking => ({
                  id: booking.id,
                  customerName: booking.customerName,
                  location: {
                    coordinates: [45.0792 + Math.random() * 2 - 1, 23.8859 + Math.random() * 2 - 1],
                    address: booking.location
                  },
                  status: booking.status,
                  assignment: booking.vehicleId ? { vehicleId: booking.vehicleId } : undefined
                }))}
                isFullscreen={isMapFullscreen}
                onToggleFullscreen={() => setIsMapFullscreen(!isMapFullscreen)}
              />
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            {/* Enhanced Bookings Section */}
            <div className="space-y-6">
              {/* Filters */}
              <Card className="border-dashed hover:border-solid transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Filter className="h-5 w-5 text-primary" />
                      تصفية البيع
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setFilterStatus("all");
                          setSearchTerm("");
                        }}
                        className="transition-all duration-200 hover:scale-105"
                      >
                        <RefreshCw className="h-4 w-4 ml-2" />
                        إعادة تعيين
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="البحث في البيع..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 transition-all duration-200 focus:scale-105"
                      />
                    </div>
                    
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="transition-all duration-200 hover:scale-105">
                        <SelectValue placeholder="تصفية بالحالة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع الحالات</SelectItem>
                        <SelectItem value="مجدول">مجدول</SelectItem>
                        <SelectItem value="في الطريق">في الطريق</SelectItem>
                        <SelectItem value="في التنفيذ">في التنفيذ</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Activity className="w-3 h-3" />
                        {recentBookings.length} حجز نشط
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Bookings List */}
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-primary" />
                        البيع النشطة
                      </CardTitle>
                      <CardDescription>البيع المجدولة وقيد التنفيذ</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="transition-all duration-200 hover:scale-105" onClick={handleCreateBooking}>
                        <Plus className="h-4 w-4 ml-2" />
                        حجز جديد
                      </Button>
                      <Button variant="outline" size="sm" className="transition-all duration-200 hover:scale-105" onClick={handleExportData}>
                        <Download className="h-4 w-4 ml-2" />
                        تصدير
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentBookings.map((booking) => (
                      <Card key={booking.id} className="transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            {/* Header */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="flex flex-col">
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-lg">{booking.customerName}</span>
                                    <Badge variant="outline" className="animate-pulse">#{booking.id}</Badge>
                                  </div>
                                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                    <div className="flex items-center gap-1">
                                      <Phone className="h-3 w-3" />
                                      {booking.phoneNumber}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <CalendarIcon className="h-3 w-3" />
                                      {booking.scheduledDate} - {booking.scheduledTime}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {getStatusBadge(booking.status)}
                                {getPriorityBadge(booking.priority)}
                              </div>
                            </div>

                            {/* Details */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4 text-muted-foreground" />
                                  <span className="truncate">{booking.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Building className="h-4 w-4 text-muted-foreground" />
                                  <span>{booking.district}</span>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Settings className="h-4 w-4 text-muted-foreground" />
                                  <span>{booking.serviceType}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <ClockIcon className="h-4 w-4 text-muted-foreground" />
                                  <span>{booking.estimatedDuration} دقيقة</span>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <CarIcon className="h-4 w-4 text-muted-foreground" />
                                  <span>{booking.vehicleId}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-bold text-green-600">{booking.price} جنيه مصري</span>
                                </div>
                              </div>
                            </div>

                            {/* Progress Bar */}
                            {booking.status === 'في التنفيذ' && (
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>تقدم العمل</span>
                                  <span>{booking.progress}%</span>
                                </div>
                                <Progress value={booking.progress} className="h-2" />
                              </div>
                            )}

                            {/* Actions */}
                            <div className="flex items-center justify-between pt-4 border-t">
                              <div className="flex items-center gap-2">
                                <Button size="sm" variant="outline" className="transition-all duration-200 hover:scale-105" onClick={() => handleViewBookingDetails(booking.id)}>
                                  <Eye className="h-4 w-4 ml-2" />
                                  عرض
                                </Button>
                                <Button size="sm" variant="outline" className="transition-all duration-200 hover:scale-105" onClick={() => handleEditBooking(booking.id)}>
                                  <Edit className="h-4 w-4 ml-2" />
                                  تعديل
                                </Button>
                                <Button size="sm" variant="outline" className="transition-all duration-200 hover:scale-105" onClick={() => handleTrackBooking(booking.id)}>
                                  <MapPin className="h-4 w-4 ml-2" />
                                  تتبع
                                </Button>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                الفني: {booking.technician}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {recentBookings.length === 0 && (
                      <div className="text-center py-12 animate-fade-in">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Calendar className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-600 mb-2">لا توجد حجوزات نشطة</h3>
                        <p className="text-gray-500 mb-4">لم يتم العثور على حجوزات تطابق معايير البحث</p>
                        <Button className="transition-all duration-200 hover:scale-105" onClick={handleCreateBooking}>
                          <Plus className="h-4 w-4 ml-2" />
                          إنشاء حجز جديد
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="fleet" className="space-y-6">
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5 text-primary" />
                      حالة الأسطول المباشرة
                    </CardTitle>
                    <CardDescription>متابعة مباشرة لجميع المركبات والفنيين</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="transition-all duration-200 hover:scale-105" onClick={handleAddVehicle}>
                      <Plus className="h-4 w-4 ml-2" />
                      إضافة مركبة
                    </Button>
                    <Button variant="outline" size="sm" className="transition-all duration-200 hover:scale-105" onClick={handleFleetSettings}>
                      <Settings className="h-4 w-4 ml-2" />
                      إعدادات الأسطول
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {fleetStatus.map((vehicle) => (
                    <Card key={vehicle.id} className="transition-all duration-300 hover:shadow-md hover:scale-105">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {/* Vehicle Header */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-100 rounded-full">
                                <Truck className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <h4 className="font-bold">{vehicle.name}</h4>
                                <p className="text-sm text-muted-foreground">{vehicle.id}</p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              {getStatusBadge(vehicle.status)}
                              {getStatusBadge(vehicle.operational)}
                            </div>
                          </div>

                          {/* Driver Info */}
                          <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">السائق/الفني:</span>
                              <span className="text-sm">{vehicle.driver}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">الهاتف:</span>
                              <span className="text-sm">{vehicle.driverPhone}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">التقييم:</span>
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                <span className="text-sm">{vehicle.rating}</span>
                              </div>
                            </div>
                          </div>

                          {/* Vehicle Stats */}
                          <div className="space-y-3">
                            <div className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span>مستوى الوقود</span>
                                <span className={vehicle.fuel < 20 ? 'text-red-600 font-bold' : ''}>{vehicle.fuel}%</span>
                              </div>
                              <Progress 
                                value={vehicle.fuel} 
                                className={`h-2 ${vehicle.fuel < 20 ? 'bg-red-100' : ''}`}
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">خدمات اليوم:</span>
                                <p className="font-bold text-blue-600">{vehicle.todayServices}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">الكفاءة:</span>
                                <p className="font-bold text-green-600">{vehicle.efficiency}%</p>
                              </div>
                            </div>
                          </div>

                          {/* Location */}
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-start gap-2">
                              <MapPin className="h-4 w-4 text-blue-600 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-blue-800">الموقع الحالي</p>
                                <p className="text-sm text-blue-600">{vehicle.location}</p>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 pt-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1 transition-all duration-200 hover:scale-105"
                              onClick={() => {
                                setSelectedVehicle(vehicle);
                                setIsVehicleDialogOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4 ml-2" />
                              تفاصيل
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="transition-all duration-200 hover:scale-105"
                              onClick={() => handleVehicleAction(vehicle.id, 'تتبع')}
                            >
                              <MapPin className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="transition-all duration-200 hover:scale-105"
                              onClick={() => handleVehicleAction(vehicle.id, 'اتصال')}
                            >
                              <Phone className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    تحليل الأداء المفصل
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsBarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="bookings" fill="#3b82f6" name="البيع" />
                      <Bar dataKey="satisfaction" fill="#10b981" name="الرضا" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle>المؤشرات الرئيسية</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {[
                      { label: "معدل رضا العملاء", value: metrics.customerSatisfaction, max: 5, color: "bg-green-500" },
                      { label: "كفاءة الأسطول", value: metrics.utilizationRate, max: 100, color: "bg-blue-500" },
                      { label: "معدل الإنجاز", value: metrics.completionRate, max: 100, color: "bg-purple-500" },
                      { label: "كفاءة الوقود", value: metrics.fuelEfficiency, max: 100, color: "bg-orange-500" }
                    ].map((metric, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{metric.label}</span>
                          <span className="font-bold">{metric.value}{metric.max === 5 ? '/5' : '%'}</span>
                        </div>
                        <Progress value={(metric.value / metric.max) * 100} className="h-3" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="maintenance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wrench className="h-5 w-5 text-primary" />
                    جدولة الصيانة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {fleetStatus.filter(v => v.maintenanceStatus !== 'جيد').map(vehicle => (
                      <div key={vehicle.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{vehicle.name}</h4>
                            <p className="text-sm text-muted-foreground">آخر صيانة: {vehicle.lastMaintenance}</p>
                          </div>
                          <Badge variant="destructive">صيانة مطلوبة</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle>تكاليف الصيانة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center p-8">
                    <DollarSign className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold">45,000 جنيه مصري</h3>
                    <p className="text-muted-foreground">إجمالي تكاليف الصيانة هذا الشهر</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Vehicle Details Dialog */}
        <Dialog open={isVehicleDialogOpen} onOpenChange={setIsVehicleDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                🚛 تفاصيل المركبة - {selectedVehicle?.name}
              </DialogTitle>
              <DialogDescription className="text-center">
                معلومات شاملة ومفصلة عن المركبة والفني
              </DialogDescription>
            </DialogHeader>
            
            {selectedVehicle && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-blue-700">معلومات المركبة</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">الرقم التعريفي:</span>
                      <span>{selectedVehicle.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">الاسم:</span>
                      <span>{selectedVehicle.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">الحالة التشغيلية:</span>
                      {getStatusBadge(selectedVehicle.operational)}
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">حالة التوفر:</span>
                      {getStatusBadge(selectedVehicle.status)}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-green-700">معلومات السائق</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">الاسم:</span>
                      <span>{selectedVehicle.driver}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">الهاتف:</span>
                      <span>{selectedVehicle.driverPhone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">الخبرة:</span>
                      <span>{selectedVehicle.experience}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">التقييم:</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span>{selectedVehicle.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  }