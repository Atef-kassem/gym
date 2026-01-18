import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  User, 
  Car, 
  Phone, 
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Navigation,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Loader2,
  Download,
  Upload,
  RefreshCw,
  Settings,
  BarChart3,
  TrendingUp,
  Star,
  MessageSquare,
  Send,
  Save,
  X,
  ChevronDown,
  ChevronUp,
  Timer,
  DollarSign,
  UserCheck,
  Zap,
  Target,
  Mail,
  Building,
  FileText
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { ar } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { useMobileWashData } from "@/hooks/useMobileWashData";
import LocationPicker from "@/components/MobileWash/LocationPicker";

export default function BookingManagement() {
  const { 
    bookings, 
    fleet, 
    services, 
    loading, 
    error,
    createBooking, 
    updateBooking, 
    deleteBooking,
    searchBookings 
  } = useMobileWashData();
  
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [viewMode, setViewMode] = useState("grid");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Dialog states
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
  const [isEditBookingOpen, setIsEditBookingOpen] = useState(false);
  const [isViewBookingOpen, setIsViewBookingOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isBulkActionsOpen, setIsBulkActionsOpen] = useState(false);
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");
  const [isNewVehicle, setIsNewVehicle] = useState(false);
  
  // Selection and operations
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [expandedBookings, setExpandedBookings] = useState(new Set());
  
  const { toast } = useToast();

  const [newBooking, setNewBooking] = useState({
    customerName: "",
    phoneNumber: "",
    email: "",
    location: {
      address: "",
      coordinates: { lat: 0, lng: 0 },
      district: ""
    },
    vehicleInfo: {
      make: "",
      model: "",
      year: "",
      color: "",
      plateNumber: ""
    },
    serviceDetails: {
      type: "",
      package: "",
      services: [],
      duration: 0,
      price: 0
    },
    scheduling: {
      date: "",
      time: "",
      estimatedEndTime: ""
    },
    assignment: {
      vehicleId: "",
      technicianId: "",
      technicianName: ""
    },
    priority: "normal" as 'high' | 'normal' | 'low',
    notes: ""
  });

  // Auto-refresh functionality
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading) {
        handleRefresh(false);
      }
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [loading]);

  // Enhanced filtering and sorting
  const filteredBookings = useMemo(() => {
    let filtered = searchBookings(searchTerm, { 
      status: statusFilter !== "all" ? statusFilter : undefined 
    });

    // Additional filters
    if (dateFilter !== "all") {
      const today = new Date().toISOString().split('T')[0];
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      switch (dateFilter) {
        case 'today':
          filtered = filtered.filter(booking => booking.scheduling.date === today);
          break;
        case 'tomorrow':
          filtered = filtered.filter(booking => booking.scheduling.date === tomorrow);
          break;
        case 'week':
          const weekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          filtered = filtered.filter(booking => 
            booking.scheduling.date >= today && booking.scheduling.date <= weekFromNow
          );
          break;
      }
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter(booking => 
        (booking.priority || "normal") === priorityFilter
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.scheduling.date + ' ' + a.scheduling.time).getTime() - 
                 new Date(b.scheduling.date + ' ' + b.scheduling.time).getTime();
        case 'customer':
          return a.customerName.localeCompare(b.customerName);
        case 'priority':
          const priorityOrder = { high: 3, normal: 2, low: 1 };
          return priorityOrder[b.priority || 'normal'] - priorityOrder[a.priority || 'normal'];
        case 'price':
          return (b.serviceDetails?.price || 0) - (a.serviceDetails?.price || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchBookings, searchTerm, statusFilter, dateFilter, priorityFilter, sortBy]);

  // Statistics calculation
  const statistics = useMemo(() => {
    const total = bookings.length;
    const completed = bookings.filter(b => b.status === 'مكتمل').length;
    const inProgress = bookings.filter(b => b.status === 'في التنفيذ').length;
    const scheduled = bookings.filter(b => b.status === 'مجدول').length;
    const cancelled = bookings.filter(b => b.status === 'ملغي').length;
    const totalRevenue = bookings.reduce((sum, b) => sum + (b.serviceDetails?.price || 0), 0);
    const avgBookingValue = total > 0 ? totalRevenue / total : 0;
    
    return {
      total,
      completed,
      inProgress,
      scheduled,
      cancelled,
      totalRevenue,
      avgBookingValue,
      completionRate: total > 0 ? (completed / total) * 100 : 0
    };
  }, [bookings]);

  // Get unique vehicles from existing bookings
  const existingVehicles = useMemo(() => {
    const vehiclesMap = new Map();
    bookings.forEach(booking => {
      const key = booking.vehicleInfo.plateNumber;
      if (!vehiclesMap.has(key)) {
        vehiclesMap.set(key, {
          id: key,
          ...booking.vehicleInfo,
          customerName: booking.customerName,
          lastUsed: booking.timestamps.created
        });
      }
    });
    return Array.from(vehiclesMap.values()).sort((a, b) => 
      new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime()
    );
  }, [bookings]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "مجدول": { 
        color: "bg-blue-500 hover:bg-blue-600", 
        textColor: "text-blue-700",
        bgColor: "bg-blue-50",
        icon: Clock 
      },
      "في الطريق": { 
        color: "bg-yellow-500 hover:bg-yellow-600", 
        textColor: "text-yellow-700",
        bgColor: "bg-yellow-50",
        icon: Navigation 
      },
      "في التنفيذ": { 
        color: "bg-orange-500 hover:bg-orange-600", 
        textColor: "text-orange-700",
        bgColor: "bg-orange-50",
        icon: AlertCircle 
      },
      "مكتمل": { 
        color: "bg-green-500 hover:bg-green-600", 
        textColor: "text-green-700",
        bgColor: "bg-green-50",
        icon: CheckCircle 
      },
      "ملغي": { 
        color: "bg-red-500 hover:bg-red-600", 
        textColor: "text-red-700",
        bgColor: "bg-red-50",
        icon: XCircle 
      }
    };
    const config = statusConfig[status] || { 
      color: "bg-gray-500 hover:bg-gray-600", 
      textColor: "text-gray-700",
      bgColor: "bg-gray-50",
      icon: Clock 
    };
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.color} text-white transition-all duration-200 hover:scale-105 shadow-sm`}>
        <Icon className="h-3 w-3 ml-1 animate-pulse" />
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

  const handleCreateBooking = async () => {
    setIsCreating(true);
    try {
      await createBooking({
        ...newBooking,
        priority: (newBooking.priority || 'normal') as 'high' | 'normal' | 'low'
      });
      setIsNewBookingOpen(false);
      resetNewBookingForm();
      toast({
        title: "✅ تم إنشاء الحجز",
        description: "تم إنشاء الحجز الجديد بنجاح",
        className: "bg-green-50 border-green-200"
      });
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "❌ خطأ في إنشاء الحجز",
        description: "حدث خطأ أثناء إنشاء الحجز",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const resetNewBookingForm = () => {
    setNewBooking({
      customerName: "",
      phoneNumber: "",
      email: "",
      location: {
        address: "",
        coordinates: { lat: 0, lng: 0 },
        district: ""
      },
      vehicleInfo: {
        make: "",
        model: "",
        year: "",
        color: "",
        plateNumber: ""
      },
      serviceDetails: {
        type: "",
        package: "",
        services: [],
        duration: 0,
        price: 0
      },
      scheduling: {
        date: "",
        time: "",
        estimatedEndTime: ""
      },
      assignment: {
        vehicleId: "",
        technicianId: "",
        technicianName: ""
      },
      priority: "normal" as 'high' | 'normal' | 'low',
      notes: ""
    });
    setSelectedVehicleId("none");
    setIsNewVehicle(false);
  };

  const handleUpdateBookingStatus = async (bookingId: string, newStatus: string) => {
    setIsUpdating(true);
    try {
      await updateBooking(bookingId, { status: newStatus as any });
      toast({
        title: "✅ تم تحديث حالة الحجز",
        description: `تم تغيير حالة الحجز إلى ${newStatus}`,
        className: "bg-blue-50 border-blue-200"
      });
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast({
        title: "❌ خطأ في تحديث الحجز",
        description: "حدث خطأ أثناء تحديث حالة الحجز",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    try {
      await deleteBooking(bookingId);
      setIsDeleteDialogOpen(false);
      setSelectedBooking(null);
      toast({
        title: "🗑️ تم حذف الحجز",
        description: "تم حذف الحجز بنجاح",
        className: "bg-red-50 border-red-200"
      });
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast({
        title: "❌ خطأ في حذف الحجز",
        description: "حدث خطأ أثناء حذف الحجز",
        variant: "destructive"
      });
    }
  };

  const handleRefresh = async (showToast = true) => {
    setIsRefreshing(true);
    try {
      // Simulate refresh delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (showToast) {
        toast({
          title: "🔄 تم تحديث البيانات",
          description: "تم تحديث قائمة البيع بنجاح",
          className: "bg-green-50 border-green-200"
        });
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedBookings.length === 0) {
      toast({
        title: "⚠️ لم يتم تحديد أي حجوزات",
        description: "يرجى تحديد حجز واحد على الأقل",
        variant: "destructive"
      });
      return;
    }

    try {
      for (const bookingId of selectedBookings) {
        if (action === 'delete') {
          await deleteBooking(bookingId);
        } else {
          await updateBooking(bookingId, { status: action as any });
        }
      }
      
      setSelectedBookings([]);
      setIsBulkActionsOpen(false);
      
      toast({
        title: "✅ تم تنفيذ العملية",
        description: `تم تطبيق العملية على ${selectedBookings.length} حجز`,
        className: "bg-green-50 border-green-200"
      });
    } catch (error) {
      console.error('Error executing bulk action:', error);
      toast({
        title: "❌ خطأ في تنفيذ العملية",
        description: "حدث خطأ أثناء تنفيذ العملية",
        variant: "destructive"
      });
    }
  };

  const toggleBookingSelection = (bookingId: string) => {
    setSelectedBookings(prev => 
      prev.includes(bookingId) 
        ? prev.filter(id => id !== bookingId)
        : [...prev, bookingId]
    );
  };

  const toggleBookingExpanded = (bookingId: string) => {
    setExpandedBookings(prev => {
      const newSet = new Set(prev);
      if (newSet.has(bookingId)) {
        newSet.delete(bookingId);
      } else {
        newSet.add(bookingId);
      }
      return newSet;
    });
  };

  const handleVehicleSelection = (vehicleId: string) => {
    setSelectedVehicleId(vehicleId);
    
    if (vehicleId === "new") {
      setIsNewVehicle(true);
      // Reset vehicle info for new vehicle
      setNewBooking({
        ...newBooking,
        vehicleInfo: {
          make: "",
          model: "",
          year: "",
          color: "",
          plateNumber: ""
        }
      });
    } else if (vehicleId === "none") {
      setIsNewVehicle(false);
      // Reset vehicle info
      setNewBooking({
        ...newBooking,
        vehicleInfo: {
          make: "",
          model: "",
          year: "",
          color: "",
          plateNumber: ""
        }
      });
    } else {
      setIsNewVehicle(false);
      // Fill vehicle info from selected vehicle
      const selectedVehicle = existingVehicles.find(v => v.id === vehicleId);
      if (selectedVehicle) {
        setNewBooking({
          ...newBooking,
          vehicleInfo: {
            make: selectedVehicle.make,
            model: selectedVehicle.model,
            year: selectedVehicle.year,
            color: selectedVehicle.color,
            plateNumber: selectedVehicle.plateNumber
          }
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-muted/30 p-6 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Enhanced Header with Statistics */}
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-blue-600 to-cyan-500 bg-clip-text text-transparent animate-pulse">
                🚗 إدارة حجوزات الكافية المتنقلة
              </h1>
              <p className="text-muted-foreground text-lg">
                إدارة شاملة للحجوزات والمواعيد مع التتبع المباشر والتحليلات الذكية
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>متصل</span>
                </div>
                <div className="flex items-center gap-1">
                  <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span>آخر تحديث: الآن</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={() => handleRefresh()}
                disabled={isRefreshing}
                variant="outline"
                size="sm"
                className="hover:bg-blue-50 transition-all duration-200 hover:scale-105"
              >
                <RefreshCw className={`h-4 w-4 ml-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                تحديث
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="hover:bg-green-50 transition-all duration-200 hover:scale-105"
              >
                <Download className="h-4 w-4 ml-2" />
                تصدير
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="hover:bg-purple-50 transition-all duration-200 hover:scale-105"
              >
                <Settings className="h-4 w-4 ml-2" />
                إعدادات
              </Button>

              <Dialog open={isNewBookingOpen} onOpenChange={setIsNewBookingOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl">
                    <Plus className="h-4 w-4 ml-2" />
                    حجز جديد
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                      ✨ إنشاء حجز جديد
                    </DialogTitle>
                    <DialogDescription className="text-center text-lg">
                      املأ بيانات العميل والخدمة المطلوبة لإنشاء حجز جديد
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
                    {/* Customer Information */}
                    <div className="space-y-6 p-6 border rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50">
                      <h3 className="text-xl font-bold flex items-center gap-2 text-blue-700">
                        <User className="h-5 w-5" />
                        بيانات العميل
                      </h3>
                        <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="customerName" className="text-sm font-medium">اسم العميل الكامل</Label>
                          <Input
                            id="customerName"
                            value={newBooking.customerName}
                            onChange={(e) => setNewBooking({...newBooking, customerName: e.target.value})}
                            placeholder="أدخل اسم العميل الكامل"
                            className="transition-all duration-200 focus:scale-105 focus:shadow-md"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phoneNumber" className="text-sm font-medium">رقم الهاتف</Label>
                          <Input
                            id="phoneNumber"
                            value={newBooking.phoneNumber}
                            onChange={(e) => setNewBooking({...newBooking, phoneNumber: e.target.value})}
                            placeholder="05xxxxxxxx"
                            className="transition-all duration-200 focus:scale-105 focus:shadow-md"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm font-medium">البريد الإلكتروني</Label>
                          <Input
                            id="email"
                            type="email"
                            value={newBooking.email}
                            onChange={(e) => setNewBooking({...newBooking, email: e.target.value})}
                            placeholder="example@email.com"
                            className="transition-all duration-200 focus:scale-105 focus:shadow-md"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location" className="text-sm font-medium">موقع الخدمة</Label>
                          <div className="space-y-2">
                            <Textarea
                              id="location"
                              value={newBooking.location.address}
                              onChange={(e) => setNewBooking({
                                ...newBooking, 
                                location: {...newBooking.location, address: e.target.value}
                              })}
                              placeholder="أدخل العنوان التفصيلي"
                              rows={3}
                              className="transition-all duration-200 focus:scale-105 focus:shadow-md"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setIsLocationPickerOpen(true)}
                              className="w-full transition-all duration-200 hover:scale-105"
                            >
                              <MapPin className="h-4 w-4 ml-2" />
                              تحديد الموقع من الخريطة
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="district" className="text-sm font-medium">الحي</Label>
                          <Input
                            id="district"
                            value={newBooking.location.district}
                            onChange={(e) => setNewBooking({
                              ...newBooking, 
                              location: {...newBooking.location, district: e.target.value}
                            })}
                            placeholder="أدخل اسم الحي"
                            className="transition-all duration-200 focus:scale-105 focus:shadow-md"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Vehicle Information */}
                    <div className="space-y-6 p-6 border rounded-xl bg-gradient-to-br from-green-50 to-emerald-50">
                      <h3 className="text-xl font-bold flex items-center gap-2 text-green-700">
                        <Car className="h-5 w-5" />
                        بيانات المركبة
                      </h3>
                      <div className="space-y-4">
                        {/* Vehicle Selection */}
                        <div className="space-y-2">
                          <Label htmlFor="vehicleSelection" className="text-sm font-medium">اختيار المركبة</Label>
                          <Select value={selectedVehicleId || "none"} onValueChange={handleVehicleSelection}>
                            <SelectTrigger className="transition-all duration-200 focus:scale-105 focus:shadow-md">
                              <SelectValue placeholder="اختر من المركبات الموجودة أو أضف جديدة" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">-- اختر مركبة --</SelectItem>
                              {existingVehicles.map((vehicle) => (
                                <SelectItem key={vehicle.id} value={vehicle.id}>
                                  <div className="flex items-center gap-3 w-full">
                                    <Car className="h-4 w-4 text-green-600" />
                                    <div className="flex-1">
                                      <div className="font-medium">
                                        {vehicle.make} {vehicle.model} ({vehicle.year})
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {vehicle.plateNumber} - {vehicle.color} - {vehicle.customerName}
                                      </div>
                                    </div>
                                  </div>
                                </SelectItem>
                              ))}
                              <SelectItem value="new">
                                <div className="flex items-center gap-2 text-blue-600">
                                  <Plus className="h-4 w-4" />
                                  إضافة مركبة جديدة
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Vehicle Details - Show only if new vehicle or no vehicle selected */}
                        {(isNewVehicle || selectedVehicleId === "none" || selectedVehicleId === "new") && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-2">
                                <Label htmlFor="vehicleMake" className="text-sm font-medium">الماركة</Label>
                                <Input
                                  id="vehicleMake"
                                  value={newBooking.vehicleInfo.make}
                                  onChange={(e) => setNewBooking({
                                    ...newBooking, 
                                    vehicleInfo: {...newBooking.vehicleInfo, make: e.target.value}
                                  })}
                                  placeholder="تويوتا، هوندا..."
                                  className="transition-all duration-200 focus:scale-105 focus:shadow-md"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="vehicleModel" className="text-sm font-medium">الموديل</Label>
                                <Input
                                  id="vehicleModel"
                                  value={newBooking.vehicleInfo.model}
                                  onChange={(e) => setNewBooking({
                                    ...newBooking, 
                                    vehicleInfo: {...newBooking.vehicleInfo, model: e.target.value}
                                  })}
                                  placeholder="كامري، أكورد..."
                                  className="transition-all duration-200 focus:scale-105 focus:shadow-md"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-2">
                                <Label htmlFor="vehicleYear" className="text-sm font-medium">السنة</Label>
                                <Input
                                  id="vehicleYear"
                                  value={newBooking.vehicleInfo.year}
                                  onChange={(e) => setNewBooking({
                                    ...newBooking, 
                                    vehicleInfo: {...newBooking.vehicleInfo, year: e.target.value}
                                  })}
                                  placeholder="2022"
                                  className="transition-all duration-200 focus:scale-105 focus:shadow-md"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="vehicleColor" className="text-sm font-medium">اللون</Label>
                                <Input
                                  id="vehicleColor"
                                  value={newBooking.vehicleInfo.color}
                                  onChange={(e) => setNewBooking({
                                    ...newBooking, 
                                    vehicleInfo: {...newBooking.vehicleInfo, color: e.target.value}
                                  })}
                                  placeholder="أبيض، أسود..."
                                  className="transition-all duration-200 focus:scale-105 focus:shadow-md"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="plateNumber" className="text-sm font-medium">رقم اللوحة</Label>
                              <Input
                                id="plateNumber"
                                value={newBooking.vehicleInfo.plateNumber}
                                onChange={(e) => setNewBooking({
                                  ...newBooking, 
                                  vehicleInfo: {...newBooking.vehicleInfo, plateNumber: e.target.value}
                                })}
                                placeholder="أ ب ج 1234"
                                className="transition-all duration-200 focus:scale-105 focus:shadow-md"
                              />
                            </div>
                          </div>
                        )}

                        {/* Show selected vehicle info as read-only if existing vehicle is selected */}
                        {selectedVehicleId && selectedVehicleId !== "new" && selectedVehicleId !== "none" && (
                          <div className="p-4 bg-green-100 rounded-lg border border-green-200">
                            <div className="flex items-center gap-2 mb-3">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <h4 className="font-medium text-green-800">المركبة المحددة</h4>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div>
                                <span className="font-medium text-green-700">الماركة:</span>
                                <span className="mr-2">{newBooking.vehicleInfo.make}</span>
                              </div>
                              <div>
                                <span className="font-medium text-green-700">الموديل:</span>
                                <span className="mr-2">{newBooking.vehicleInfo.model}</span>
                              </div>
                              <div>
                                <span className="font-medium text-green-700">السنة:</span>
                                <span className="mr-2">{newBooking.vehicleInfo.year}</span>
                              </div>
                              <div>
                                <span className="font-medium text-green-700">اللون:</span>
                                <span className="mr-2">{newBooking.vehicleInfo.color}</span>
                              </div>
                              <div className="col-span-2">
                                <span className="font-medium text-green-700">رقم اللوحة:</span>
                                <span className="mr-2">{newBooking.vehicleInfo.plateNumber}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                    {/* Service Information */}
                    <div className="space-y-6 p-6 border rounded-xl bg-gradient-to-br from-purple-50 to-violet-50">
                      <h3 className="text-xl font-bold flex items-center gap-2 text-purple-700">
                        <Settings className="h-5 w-5" />
                        تفاصيل الخدمة
                      </h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="serviceType" className="text-sm font-medium">نوع الخدمة</Label>
                          <Select 
                            value={newBooking.serviceDetails.type} 
                            onValueChange={(value) => setNewBooking({
                              ...newBooking, 
                              serviceDetails: {...newBooking.serviceDetails, type: value}
                            })}
                          >
                            <SelectTrigger className="transition-all duration-200 hover:scale-105 focus:shadow-md">
                              <SelectValue placeholder="اختر نوع الخدمة" />
                            </SelectTrigger>
                            <SelectContent>
                              {services?.map((service) => (
                                <SelectItem key={service.id} value={service.name}>{service.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="priority" className="text-sm font-medium">الأولوية</Label>
                          <Select 
                            value={newBooking.priority} 
                            onValueChange={(value: 'high' | 'normal' | 'low') => setNewBooking({
                              ...newBooking, 
                              priority: value
                            })}
                          >
                            <SelectTrigger className="transition-all duration-200 hover:scale-105 focus:shadow-md">
                              <SelectValue placeholder="اختر الأولوية" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="high">عالية</SelectItem>
                              <SelectItem value="normal">عادية</SelectItem>
                              <SelectItem value="low">منخفضة</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label htmlFor="scheduledDate" className="text-sm font-medium">تاريخ الموعد</Label>
                            <Input
                              id="scheduledDate"
                              type="date"
                              value={newBooking.scheduling.date}
                              onChange={(e) => setNewBooking({
                                ...newBooking, 
                                scheduling: {...newBooking.scheduling, date: e.target.value}
                              })}
                              className="transition-all duration-200 focus:scale-105 focus:shadow-md"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="scheduledTime" className="text-sm font-medium">وقت الموعد</Label>
                            <Input
                              id="scheduledTime"
                              type="time"
                              value={newBooking.scheduling.time}
                              onChange={(e) => setNewBooking({
                                ...newBooking, 
                                scheduling: {...newBooking.scheduling, time: e.target.value}
                              })}
                              className="transition-all duration-200 focus:scale-105 focus:shadow-md"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="price" className="text-sm font-medium">السعر (جنيه)</Label>
                          <Input
                            id="price"
                            type="number"
                            value={newBooking.serviceDetails.price}
                            onChange={(e) => setNewBooking({
                              ...newBooking, 
                              serviceDetails: {...newBooking.serviceDetails, price: Number(e.target.value)}
                            })}
                            placeholder="0"
                            className="transition-all duration-200 focus:scale-105 focus:shadow-md"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="assignedVehicle" className="text-sm font-medium">المركبة المخصصة</Label>
                          <Select 
                            value={newBooking.assignment.vehicleId} 
                            onValueChange={(value) => {
                              const selectedVehicle = fleet.find(v => v.id === value);
                              setNewBooking({
                                ...newBooking, 
                                assignment: {
                                  vehicleId: value,
                                  technicianId: selectedVehicle?.driver.id || "",
                                  technicianName: selectedVehicle?.driver.name || ""
                                }
                              });
                            }}
                          >
                            <SelectTrigger className="transition-all duration-200 hover:scale-105 focus:shadow-md">
                              <SelectValue placeholder="اختر المركبة" />
                            </SelectTrigger>
                            <SelectContent>
                              {fleet?.filter(v => v.status.availability !== "مشغول").map((vehicle) => (
                                <SelectItem key={vehicle.id} value={vehicle.id}>
                                  {vehicle.name} - {vehicle.driver.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Additional Notes */}
                    <div className="space-y-6 p-6 border rounded-xl bg-gradient-to-br from-orange-50 to-amber-50">
                      <h3 className="text-xl font-bold flex items-center gap-2 text-orange-700">
                        <MessageSquare className="h-5 w-5" />
                        ملاحظات إضافية
                      </h3>
                      <div className="space-y-2">
                        <Label htmlFor="notes" className="text-sm font-medium">ملاحظات خاصة</Label>
                        <Textarea
                          id="notes"
                          value={newBooking.notes}
                          onChange={(e) => setNewBooking({...newBooking, notes: e.target.value})}
                          placeholder="أي ملاحظات خاصة بالخدمة أو تعليمات للفني..."
                          rows={4}
                          className="transition-all duration-200 focus:scale-105 focus:shadow-md"
                        />
                      </div>
                    </div>
                  </div>
                  </div>

                  <DialogFooter className="flex justify-center gap-4 pt-6">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsNewBookingOpen(false)}
                      className="px-8 hover:bg-gray-50 transition-all duration-200"
                    >
                      <X className="h-4 w-4 ml-2" />
                      إلغاء
                    </Button>
                    <Button 
                      onClick={handleCreateBooking}
                      disabled={isCreating}
                      className="px-8 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transition-all duration-200 hover:scale-105"
                    >
                      {isCreating ? (
                        <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 ml-2" />
                      )}
                      {isCreating ? 'جاري الإنشاء...' : 'إنشاء الحجز'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Statistics Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">إجمالي البيع</p>
                    <p className="text-3xl font-bold text-blue-700 animate-pulse">{statistics.total}</p>
                    <p className="text-xs text-blue-500 mt-1">جميع البيع</p>
                  </div>
                  <div className="p-3 bg-blue-200 rounded-full">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">مكتملة</p>
                    <p className="text-3xl font-bold text-green-700 animate-pulse">{statistics.completed}</p>
                    <p className="text-xs text-green-500 mt-1">{statistics.completionRate.toFixed(1)}% معدل الإنجاز</p>
                  </div>
                  <div className="p-3 bg-green-200 rounded-full">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600">قيد التنفيذ</p>
                    <p className="text-3xl font-bold text-orange-700 animate-pulse">{statistics.inProgress}</p>
                    <p className="text-xs text-orange-500 mt-1">يجري العمل عليها</p>
                  </div>
                  <div className="p-3 bg-orange-200 rounded-full">
                    <AlertCircle className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">إجمالي الإيرادات</p>
                    <p className="text-2xl font-bold text-purple-700 animate-pulse">{statistics.totalRevenue.toLocaleString()}</p>
                    <p className="text-xs text-purple-500 mt-1">جنيه مصري</p>
                  </div>
                  <div className="p-3 bg-purple-200 rounded-full">
                    <DollarSign className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Enhanced Filters and Search */}
        <Card className="border-2 border-dashed border-gray-200 hover:border-primary/50 transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-primary" />
                  البحث والتصفية المتقدمة
                </CardTitle>
                <CardDescription>
                  استخدم الفلاتر المتقدمة للعثور على البيع المطلوبة بسرعة
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="transition-all duration-200 hover:scale-105"
                >
                  <Filter className="h-4 w-4 ml-2" />
                  {showAdvancedFilters ? 'إخفاء' : 'إظهار'} الفلاتر المتقدمة
                  {showAdvancedFilters ? <ChevronUp className="h-3 w-3 mr-1" /> : <ChevronDown className="h-3 w-3 mr-1" />}
                </Button>
                {selectedBookings.length > 0 && (
                  <Dialog open={isBulkActionsOpen} onOpenChange={setIsBulkActionsOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="bg-blue-50 border-blue-200 hover:bg-blue-100 transition-all duration-200"
                      >
                        <UserCheck className="h-4 w-4 ml-2" />
                        عمليات متعددة ({selectedBookings.length})
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>العمليات المتعددة</DialogTitle>
                        <DialogDescription>
                          اختر العملية المطلوب تطبيقها على {selectedBookings.length} حجز محدد
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid grid-cols-2 gap-4 py-4">
                        <Button 
                          onClick={() => handleBulkAction('مؤكد')}
                          className="bg-blue-500 hover:bg-blue-600"
                        >
                          <CheckCircle className="h-4 w-4 ml-2" />
                          تأكيد جميع البيع
                        </Button>
                        <Button 
                          onClick={() => handleBulkAction('ملغي')}
                          variant="destructive"
                        >
                          <XCircle className="h-4 w-4 ml-2" />
                          إلغاء جميع البيع
                        </Button>
                        <Button 
                          onClick={() => handleBulkAction('في التنفيذ')}
                          className="bg-orange-500 hover:bg-orange-600"
                        >
                          <Timer className="h-4 w-4 ml-2" />
                          بدء التنفيذ
                        </Button>
                        <Button 
                          onClick={() => handleBulkAction('delete')}
                          variant="destructive"
                        >
                          <Trash2 className="h-4 w-4 ml-2" />
                          حذف البيع
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Basic Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="البحث في البيع..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 transition-all duration-200 focus:scale-105 focus:shadow-md"
                  />
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="transition-all duration-200 hover:scale-105">
                    <SelectValue placeholder="الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الحالات</SelectItem>
                    <SelectItem value="مجدول">مجدول</SelectItem>
                    <SelectItem value="في الطريق">في الطريق</SelectItem>
                    <SelectItem value="في التنفيذ">في التنفيذ</SelectItem>
                    <SelectItem value="مكتمل">مكتمل</SelectItem>
                    <SelectItem value="ملغي">ملغي</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="transition-all duration-200 hover:scale-105">
                    <SelectValue placeholder="التاريخ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع التواريخ</SelectItem>
                    <SelectItem value="today">اليوم</SelectItem>
                    <SelectItem value="tomorrow">غداً</SelectItem>
                    <SelectItem value="week">هذا الأسبوع</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="transition-all duration-200 hover:scale-105">
                    <SelectValue placeholder="الأولوية" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الأولويات</SelectItem>
                    <SelectItem value="high">عالية</SelectItem>
                    <SelectItem value="normal">عادية</SelectItem>
                    <SelectItem value="low">منخفضة</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="transition-all duration-200 hover:scale-105">
                    <SelectValue placeholder="ترتيب حسب" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">التاريخ والوقت</SelectItem>
                    <SelectItem value="customer">اسم العميل</SelectItem>
                    <SelectItem value="priority">الأولوية</SelectItem>
                    <SelectItem value="price">السعر</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Advanced Filters */}
              {showAdvancedFilters && (
                <div className="p-4 border rounded-lg bg-gray-50 space-y-4 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Switch id="view-mode" />
                      <Label htmlFor="view-mode">عرض مضغوط</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch 
                        id="auto-refresh" 
                        defaultChecked 
                        onCheckedChange={(checked) => {
                          // Handle auto-refresh toggle
                        }}
                      />
                      <Label htmlFor="auto-refresh">تحديث تلقائي</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch id="notifications" defaultChecked />
                      <Label htmlFor="notifications">التنبيهات</Label>
                    </div>
                  </div>
                </div>
              )}

              {/* Results Summary */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1">
                    <Filter className="w-3 h-3" />
                    {filteredBookings.length} من {bookings.length} حجز
                  </Badge>
                  {selectedBookings.length > 0 && (
                    <Badge variant="outline" className="flex items-center gap-1 px-3 py-1 bg-blue-50 border-blue-200">
                      <UserCheck className="w-3 h-3" />
                      {selectedBookings.length} محدد
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("all");
                      setDateFilter("all");
                      setPriorityFilter("all");
                      setSortBy("date");
                      setSelectedBookings([]);
                    }}
                    className="transition-all duration-200 hover:scale-105"
                  >
                    <X className="h-3 w-3 ml-1" />
                    مسح الفلاتر
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Bookings List */}
        <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-primary" />
                  قائمة البيع ({filteredBookings.length})
                </CardTitle>
                <CardDescription>
                  جميع حجوزات الكافية المتنقلة مع إمكانيات التحكم الكامل
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedBookings(filteredBookings.map(b => b.id))}
                  className="transition-all duration-200 hover:scale-105"
                >
                  تحديد الكل
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedBookings([])}
                  className="transition-all duration-200 hover:scale-105"
                >
                  إلغاء التحديد
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {filteredBookings.map((booking) => {
                const isSelected = selectedBookings.includes(booking.id);
                const isExpanded = expandedBookings.has(booking.id);
                
                return (
                  <Card 
                    key={booking.id} 
                    className={`
                      border-l-4 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]
                      ${isSelected ? 'bg-blue-50 border-blue-500' : 'hover:bg-gray-50'}
                      ${booking.priority === 'high' ? 'border-l-red-500' : 
                        booking.status === 'مكتمل' ? 'border-l-green-500' : 
                        booking.status === 'في التنفيذ' ? 'border-l-orange-500' : 'border-l-blue-500'}
                    `}
                  >
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {/* Header Row */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => toggleBookingSelection(booking.id)}
                              className="transition-all duration-200 hover:scale-110"
                            />
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="font-semibold text-lg">{booking.customerName}</span>
                              </div>
                              <Badge variant="outline" className="animate-pulse">#{booking.id}</Badge>
                              {getStatusBadge(booking.status)}
                              {getPriorityBadge(booking.priority || 'normal')}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleBookingExpanded(booking.id)}
                              className="transition-all duration-200 hover:scale-110"
                            >
                              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>

                        {/* Quick Info Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{booking.phoneNumber}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="truncate">{booking.location.address}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Car className="h-4 w-4 text-muted-foreground" />
                            <span>{booking.vehicleInfo.make} {booking.vehicleInfo.model} - {booking.vehicleInfo.plateNumber}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                            <span>{booking.scheduling.date} - {booking.scheduling.time}</span>
                          </div>
                        </div>

                        {/* Expanded Details */}
                        {isExpanded && (
                          <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4 animate-fade-in">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-3">
                                <h4 className="font-semibold text-blue-700 flex items-center gap-2">
                                  <User className="h-4 w-4" />
                                  معلومات العميل
                                </h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex items-center gap-2">
                                    <Mail className="h-3 w-3 text-muted-foreground" />
                                    <span>{booking.email}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Building className="h-3 w-3 text-muted-foreground" />
                                    <span>{booking.location.district}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="space-y-3">
                                <h4 className="font-semibold text-green-700 flex items-center gap-2">
                                  <Settings className="h-4 w-4" />
                                  تفاصيل الخدمة
                                </h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex items-center gap-2">
                                    <Timer className="h-3 w-3 text-muted-foreground" />
                                    <span>{booking.serviceDetails.type}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <DollarSign className="h-3 w-3 text-muted-foreground" />
                                    <span className="font-medium">{booking.serviceDetails.price} جنيه مصري</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {booking.notes && (
                              <div className="space-y-2">
                                <h4 className="font-semibold text-orange-700 flex items-center gap-2">
                                  <MessageSquare className="h-4 w-4" />
                                  ملاحظات
                                </h4>
                                <p className="text-sm bg-white p-3 rounded border-l-4 border-orange-500">
                                  {booking.notes}
                                </p>
                              </div>
                            )}

                            {booking.progress !== undefined && (
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="font-medium">تقدم العمل</span>
                                  <span>{booking.progress}%</span>
                                </div>
                                <Progress value={booking.progress} className="h-2" />
                              </div>
                            )}
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedBooking(booking);
                                setIsViewBookingOpen(true);
                              }}
                              className="transition-all duration-200 hover:scale-105 hover:bg-blue-50"
                            >
                              <Eye className="h-4 w-4 ml-2" />
                              عرض التفاصيل
                            </Button>
                            
                            {booking.status !== "مكتمل" && booking.status !== "ملغي" && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedBooking(booking);
                                    setIsEditBookingOpen(true);
                                  }}
                                  className="transition-all duration-200 hover:scale-105 hover:bg-green-50"
                                >
                                  <Edit className="h-4 w-4 ml-2" />
                                  تعديل
                                </Button>
                                
                                <Select 
                                  value={booking.status} 
                                  onValueChange={(value) => handleUpdateBookingStatus(booking.id, value)}
                                  disabled={isUpdating}
                                >
                                  <SelectTrigger className="w-40 transition-all duration-200 hover:scale-105">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="مجدول">مجدول</SelectItem>
                                    <SelectItem value="في الطريق">في الطريق</SelectItem>
                                    <SelectItem value="في التنفيذ">في التنفيذ</SelectItem>
                                    <SelectItem value="مكتمل">مكتمل</SelectItem>
                                    <SelectItem value="ملغي">ملغي</SelectItem>
                                  </SelectContent>
                                </Select>
                              </>
                            )}
                          </div>
                          
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              setSelectedBooking(booking);
                              setIsDeleteDialogOpen(true);
                            }}
                            className="transition-all duration-200 hover:scale-105"
                          >
                            <Trash2 className="h-4 w-4 ml-2" />
                            حذف
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              
              {filteredBookings.length === 0 && (
                <div className="text-center py-12 animate-fade-in">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-600 mb-2">لا توجد حجوزات</h3>
                  <p className="text-gray-500">لم يتم العثور على حجوزات تطابق معايير البحث المحددة</p>
                  <Button 
                    variant="outline" 
                    className="mt-4 transition-all duration-200 hover:scale-105"
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("all");
                      setDateFilter("all");
                      setPriorityFilter("all");
                    }}
                  >
                    <X className="h-4 w-4 ml-2" />
                    مسح الفلاتر
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Booking Details Dialog */}
        <Dialog open={isViewBookingOpen} onOpenChange={setIsViewBookingOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                📋 تفاصيل الحجز #{selectedBooking?.id}
              </DialogTitle>
              <DialogDescription className="text-center">
                معلومات شاملة ومفصلة عن الحجز والخدمة المطلوبة
              </DialogDescription>
            </DialogHeader>
            
            {selectedBooking && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                <div className="space-y-6 p-4 border rounded-lg bg-blue-50">
                  <h3 className="text-lg font-bold flex items-center gap-2 text-blue-700">
                    <User className="h-5 w-5" />
                    بيانات العميل
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium min-w-[80px]">الاسم:</span>
                      <span>{selectedBooking.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium min-w-[80px]">الهاتف:</span>
                      <span>{selectedBooking.phoneNumber}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium min-w-[80px]">الإيميل:</span>
                      <span>{selectedBooking.email}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-medium min-w-[80px]">الموقع:</span>
                      <span className="flex-1">{selectedBooking.location.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium min-w-[80px]">الحي:</span>
                      <span>{selectedBooking.location.district}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6 p-4 border rounded-lg bg-green-50">
                  <h3 className="text-lg font-bold flex items-center gap-2 text-green-700">
                    <Car className="h-5 w-5" />
                    بيانات المركبة
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium min-w-[100px]">الماركة والموديل:</span>
                      <span>{selectedBooking.vehicleInfo.make} {selectedBooking.vehicleInfo.model}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium min-w-[100px]">السنة:</span>
                      <span>{selectedBooking.vehicleInfo.year}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium min-w-[100px]">اللون:</span>
                      <span>{selectedBooking.vehicleInfo.color}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium min-w-[100px]">رقم اللوحة:</span>
                      <span className="font-mono bg-white px-2 py-1 rounded border">
                        {selectedBooking.vehicleInfo.plateNumber}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6 p-4 border rounded-lg bg-purple-50">
                  <h3 className="text-lg font-bold flex items-center gap-2 text-purple-700">
                    <Settings className="h-5 w-5" />
                    تفاصيل الخدمة
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium min-w-[120px]">نوع الخدمة:</span>
                      <span>{selectedBooking.serviceDetails.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium min-w-[120px]">التاريخ والوقت:</span>
                      <span>{selectedBooking.scheduling.date} - {selectedBooking.scheduling.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium min-w-[120px]">المدة المتوقعة:</span>
                      <span>{selectedBooking.serviceDetails.duration} دقيقة</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium min-w-[120px]">المركبة المخصصة:</span>
                      <span>{selectedBooking.assignment.vehicleId}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium min-w-[120px]">الفني:</span>
                      <span>{selectedBooking.assignment.technicianName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium min-w-[120px]">الحالة:</span>
                      {getStatusBadge(selectedBooking.status)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium min-w-[120px]">الأولوية:</span>
                      {getPriorityBadge(selectedBooking.priority || 'normal')}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6 p-4 border rounded-lg bg-orange-50">
                  <h3 className="text-lg font-bold flex items-center gap-2 text-orange-700">
                    <DollarSign className="h-5 w-5" />
                    التفاصيل المالية
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium min-w-[120px]">المبلغ الإجمالي:</span>
                      <span className="text-lg font-bold text-green-600">
                        {selectedBooking.serviceDetails.price} جنيه مصري
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium min-w-[120px]">حالة الدفع:</span>
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        {selectedBooking.paymentStatus}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium min-w-[120px]">طريقة الدفع:</span>
                      <span>{selectedBooking.paymentMethod}</span>
                    </div>
                  </div>
                </div>
                
                {selectedBooking.notes && (
                  <div className="col-span-1 md:col-span-2 space-y-4 p-4 border rounded-lg bg-yellow-50">
                    <h3 className="text-lg font-bold flex items-center gap-2 text-yellow-700">
                      <MessageSquare className="h-5 w-5" />
                      ملاحظات
                    </h3>
                    <p className="bg-white p-4 rounded border-l-4 border-yellow-500">{selectedBooking.notes}</p>
                  </div>
                )}
                
                {selectedBooking.feedback && (
                  <div className="col-span-1 md:col-span-2 space-y-4 p-4 border rounded-lg bg-pink-50">
                    <h3 className="text-lg font-bold flex items-center gap-2 text-pink-700">
                      <Star className="h-5 w-5" />
                      التقييم والملاحظات
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">التقييم:</span>
                        <div className="flex items-center gap-1">
                          {Array.from({length: 5}).map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < selectedBooking.rating ? "text-yellow-500 fill-current" : "text-gray-300"}`}
                            />
                          ))}
                          <span className="ml-2">({selectedBooking.rating}/5)</span>
                        </div>
                      </div>
                      <p className="bg-white p-4 rounded border-l-4 border-pink-500">{selectedBooking.feedback}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <DialogFooter className="flex justify-center">
              <Button 
                onClick={() => setIsViewBookingOpen(false)}
                className="px-8 transition-all duration-200 hover:scale-105"
              >
                <X className="h-4 w-4 ml-2" />
                إغلاق
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-red-600 flex items-center gap-2">
                <Trash2 className="h-5 w-5" />
                تأكيد الحذف
              </DialogTitle>
              <DialogDescription>
                هل أنت متأكد من حذف الحجز #{selectedBooking?.id}؟ 
                هذا الإجراء لا يمكن التراجع عنه.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-4">
              <Button 
                variant="outline" 
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                إلغاء
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => handleDeleteBooking(selectedBooking?.id)}
              >
                حذف الحجز
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Location Picker Dialog */}
        <Dialog open={isLocationPickerOpen} onOpenChange={setIsLocationPickerOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                📍 تحديد موقع الخدمة
              </DialogTitle>
              <DialogDescription className="text-center">
                اختر الموقع المطلوب من الخريطة أو حدد الحي المناسب
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <LocationPicker
                selectedLocation={newBooking.location.address ? {
                  address: newBooking.location.address,
                  coordinates: newBooking.location.coordinates,
                  district: newBooking.location.district
                } : undefined}
                onLocationSelect={(location) => {
                  setNewBooking({
                    ...newBooking,
                    location: {
                      address: location.address,
                      coordinates: location.coordinates,
                      district: location.district
                    }
                  });
                }}
                onClose={() => setIsLocationPickerOpen(false)}
              />
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}