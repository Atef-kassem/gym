import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  User, 
  Car, 
  Phone, 
  CheckCircle, 
  AlertTriangle, 
  X, 
  Plus,
  Eye,
  Edit,
  Trash2,
  Bell,
  MessageSquare,
  MapPin,
  Star,
  Timer,
  DollarSign,
  MoreHorizontal,
  ArrowUpDown,
  Download,
  RefreshCw,
  Settings,
  UserCheck,
  PlayCircle,
  PauseCircle,
  XCircle,
  Clock3,
  AlertCircle,
  CheckCircle2,
  UserX,
  Activity,
  TrendingUp,
  Target,
  BarChart3,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBookingSystem } from '@/hooks/useBookingSystem';
import { useToast } from '@/hooks/use-toast';
import { format, parseISO, isToday, isTomorrow } from 'date-fns';
import { ar } from 'date-fns/locale';

interface BookingStatus {
  status: string;
  label: string;
  color: string;
  bgColor: string;
  icon: any;
}

const bookingStatuses: BookingStatus[] = [
  { status: 'pending', label: 'في الانتظار', color: 'text-yellow-700', bgColor: 'bg-yellow-100 border-yellow-300', icon: Clock3 },
  { status: 'confirmed', label: 'مؤكد', color: 'text-blue-700', bgColor: 'bg-blue-100 border-blue-300', icon: CheckCircle },
  { status: 'in-progress', label: 'قيد التنفيذ', color: 'text-purple-700', bgColor: 'bg-purple-100 border-purple-300', icon: PlayCircle },
  { status: 'completed', label: 'مكتمل', color: 'text-green-700', bgColor: 'bg-green-100 border-green-300', icon: CheckCircle2 },
  { status: 'cancelled', label: 'ملغي', color: 'text-red-700', bgColor: 'bg-red-100 border-red-300', icon: XCircle },
  { status: 'no-show', label: 'لم يحضر', color: 'text-gray-700', bgColor: 'bg-gray-100 border-gray-300', icon: UserX },
];

const priorityLevels = [
  { value: 'high', label: 'عالية', color: 'text-red-600', bgColor: 'bg-red-50 border-red-200' },
  { value: 'normal', label: 'عادية', color: 'text-blue-600', bgColor: 'bg-blue-50 border-blue-200' },
  { value: 'low', label: 'منخفضة', color: 'text-gray-600', bgColor: 'bg-gray-50 border-gray-200' },
];

export function BookingManagementSystem() {
  const { bookings, updateBooking, deleteBooking, getBookingsByStatus, getBookingsByDate } = useBookingSystem();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [branchFilter, setBranchFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('list');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter and sort bookings
  const filteredBookings = useMemo(() => {
    let filtered = bookings;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(booking =>
        booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.customerPhone.includes(searchQuery) ||
        booking.plateNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.notes.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter as any);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const today = new Date().toISOString().split('T')[0];
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      switch (dateFilter) {
        case 'today':
          filtered = filtered.filter(booking => booking.date === today);
          break;
        case 'tomorrow':
          filtered = filtered.filter(booking => booking.date === tomorrow);
          break;
        case 'week':
          const weekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          filtered = filtered.filter(booking => booking.date >= today && booking.date <= weekFromNow);
          break;
      }
    }

    // Branch filter
    if (branchFilter !== 'all') {
      filtered = filtered.filter(booking => booking.branch === branchFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime();
        case 'customer':
          return a.customerName.localeCompare(b.customerName);
        case 'priority':
          const priorityOrder = { high: 3, normal: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'price':
          return b.totalPrice - a.totalPrice;
        default:
          return 0;
      }
    });

    return filtered;
  }, [bookings, searchQuery, statusFilter, dateFilter, branchFilter, sortBy]);

  // Statistics
  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayBookings = bookings.filter(b => b.date === today);
    
    return {
      total: bookings.length,
      pending: getBookingsByStatus('pending').length,
      confirmed: getBookingsByStatus('confirmed').length,
      inProgress: getBookingsByStatus('in-progress').length,
      completed: getBookingsByStatus('completed').length,
      todayTotal: todayBookings.length,
      todayRevenue: todayBookings.reduce((sum, b) => sum + b.totalPrice, 0),
      avgBookingValue: bookings.length > 0 ? bookings.reduce((sum, b) => sum + b.totalPrice, 0) / bookings.length : 0,
      completionRate: bookings.length > 0 ? (getBookingsByStatus('completed').length / bookings.length) * 100 : 0
    };
  }, [bookings, getBookingsByStatus]);

  const getStatusConfig = (status: string) => {
    return bookingStatuses.find(s => s.status === status) || bookingStatuses[0];
  };

  const getPriorityConfig = (priority: string) => {
    return priorityLevels.find(p => p.value === priority) || priorityLevels[1];
  };

  const handleStatusChange = (bookingId: string, newStatus: string) => {
    updateBooking(bookingId, { status: newStatus as any });
    toast({
      title: "تم تحديث حالة الحجز",
      description: `تم تغيير حالة الحجز إلى ${getStatusConfig(newStatus).label}`,
    });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
    toast({
      title: "تم تحديث البيانات",
      description: "تم تحديث قائمة البيع بنجاح",
    });
  };

  const formatDateTime = (date: string, time: string) => {
    try {
      const dateTime = parseISO(`${date}T${time}`);
      return format(dateTime, 'dd/MM/yyyy - HH:mm', { locale: ar });
    } catch {
      return `${date} - ${time}`;
    }
  };

  const getDateLabel = (date: string) => {
    try {
      const bookingDate = parseISO(date);
      if (isToday(bookingDate)) return 'اليوم';
      if (isTomorrow(bookingDate)) return 'غداً';
      return format(bookingDate, 'dd/MM/yyyy', { locale: ar });
    } catch {
      return date;
    }
  };


  return (
    <div className="space-y-6">
      {/* Enhanced Statistics Cards with Advanced Visual Effects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Bookings Card */}
        <Card className="group relative bg-gradient-to-br from-blue-50 via-blue-100 to-blue-150 border-0 shadow-elegant hover:shadow-glow transition-all duration-500 hover:-translate-y-3 overflow-hidden animate-fade-in cursor-pointer">
          {/* Animated Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-blue-400/5 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-500"></div>
          
          {/* Floating Particles */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
            <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400/60 rounded-full animate-ping"></div>
            <div className="absolute bottom-6 left-6 w-1 h-1 bg-blue-500/80 rounded-full animate-pulse"></div>
            <div className="absolute top-1/2 left-4 w-1.5 h-1.5 bg-blue-300/70 rounded-full animate-bounce"></div>
          </div>
          
          <CardContent className="relative p-6 z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 group-hover:text-blue-700 transition-colors duration-300">إجمالي البيع</p>
                <p className="text-3xl font-bold text-blue-700 group-hover:text-blue-800 transition-all duration-300 group-hover:scale-105">{stats.total}</p>
                <p className="text-xs text-blue-500 mt-1 group-hover:text-blue-600 transition-colors duration-300">جميع البيع</p>
              </div>
              <div className="relative">
                <div className="p-3 bg-blue-200 rounded-full group-hover:bg-blue-300 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-md group-hover:shadow-lg">
                  <Calendar className="w-6 h-6 text-blue-600 group-hover:text-blue-700 group-hover:animate-pulse transition-colors duration-300" />
                </div>
                {/* Rotating Ring */}
                <div className="absolute inset-0 rounded-full border-2 border-blue-400 opacity-0 group-hover:opacity-100 group-hover:animate-spin transition-opacity duration-500"></div>
              </div>
            </div>
            {/* Progress Bar Animation */}
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-400 to-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
          </CardContent>
        </Card>

        {/* Today's Bookings Card */}
        <Card className="group relative bg-gradient-to-br from-green-50 via-green-100 to-green-150 border-0 shadow-elegant hover:shadow-glow transition-all duration-500 hover:-translate-y-3 overflow-hidden animate-fade-in cursor-pointer" style={{ animationDelay: '100ms' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-green-400/5 to-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div className="absolute -inset-1 bg-gradient-to-br from-green-500 to-green-600 rounded-lg opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-500"></div>
          
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
            <div className="absolute top-4 right-4 w-2 h-2 bg-green-400/60 rounded-full animate-ping"></div>
            <div className="absolute bottom-6 left-6 w-1 h-1 bg-green-500/80 rounded-full animate-pulse"></div>
            <div className="absolute top-1/2 left-4 w-1.5 h-1.5 bg-green-300/70 rounded-full animate-bounce"></div>
          </div>
          
          <CardContent className="relative p-6 z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 group-hover:text-green-700 transition-colors duration-300">حجوزات اليوم</p>
                <p className="text-3xl font-bold text-green-700 group-hover:text-green-800 transition-all duration-300 group-hover:scale-105">{stats.todayTotal}</p>
                <p className="text-xs text-green-500 mt-1 group-hover:text-green-600 transition-colors duration-300">{stats.todayRevenue.toLocaleString()} جنيه</p>
              </div>
              <div className="relative">
                <div className="p-3 bg-green-200 rounded-full group-hover:bg-green-300 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-md group-hover:shadow-lg">
                  <Target className="w-6 h-6 text-green-600 group-hover:text-green-700 group-hover:animate-pulse transition-colors duration-300" />
                </div>
                <div className="absolute inset-0 rounded-full border-2 border-green-400 opacity-0 group-hover:opacity-100 group-hover:animate-spin transition-opacity duration-500"></div>
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-green-400 to-green-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
          </CardContent>
        </Card>

        {/* In Progress Card */}
        <Card className="group relative bg-gradient-to-br from-purple-50 via-purple-100 to-purple-150 border-0 shadow-elegant hover:shadow-glow transition-all duration-500 hover:-translate-y-3 overflow-hidden animate-fade-in cursor-pointer" style={{ animationDelay: '200ms' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-purple-400/5 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div className="absolute -inset-1 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-500"></div>
          
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
            <div className="absolute top-4 right-4 w-2 h-2 bg-purple-400/60 rounded-full animate-ping"></div>
            <div className="absolute bottom-6 left-6 w-1 h-1 bg-purple-500/80 rounded-full animate-pulse"></div>
            <div className="absolute top-1/2 left-4 w-1.5 h-1.5 bg-purple-300/70 rounded-full animate-bounce"></div>
          </div>
          
          <CardContent className="relative p-6 z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 group-hover:text-purple-700 transition-colors duration-300">قيد التنفيذ</p>
                <p className="text-3xl font-bold text-purple-700 group-hover:text-purple-800 transition-all duration-300 group-hover:scale-105">{stats.inProgress}</p>
                <p className="text-xs text-purple-500 mt-1 group-hover:text-purple-600 transition-colors duration-300">يجري العمل عليها</p>
              </div>
              <div className="relative">
                <div className="p-3 bg-purple-200 rounded-full group-hover:bg-purple-300 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-md group-hover:shadow-lg">
                  <Activity className="w-6 h-6 text-purple-600 group-hover:text-purple-700 group-hover:animate-pulse transition-colors duration-300" />
                </div>
                <div className="absolute inset-0 rounded-full border-2 border-purple-400 opacity-0 group-hover:opacity-100 group-hover:animate-spin transition-opacity duration-500"></div>
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-purple-400 to-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
          </CardContent>
        </Card>

        {/* Completion Rate Card */}
        <Card className="group relative bg-gradient-to-br from-orange-50 via-orange-100 to-orange-150 border-0 shadow-elegant hover:shadow-glow transition-all duration-500 hover:-translate-y-3 overflow-hidden animate-fade-in cursor-pointer" style={{ animationDelay: '300ms' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-orange-400/5 to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div className="absolute -inset-1 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-500"></div>
          
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
            <div className="absolute top-4 right-4 w-2 h-2 bg-orange-400/60 rounded-full animate-ping"></div>
            <div className="absolute bottom-6 left-6 w-1 h-1 bg-orange-500/80 rounded-full animate-pulse"></div>
            <div className="absolute top-1/2 left-4 w-1.5 h-1.5 bg-orange-300/70 rounded-full animate-bounce"></div>
          </div>
          
          <CardContent className="relative p-6 z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 group-hover:text-orange-700 transition-colors duration-300">معدل الإنجاز</p>
                <p className="text-3xl font-bold text-orange-700 group-hover:text-orange-800 transition-all duration-300 group-hover:scale-105">{stats.completionRate.toFixed(0)}%</p>
                <Progress value={stats.completionRate} className="mt-2 h-2 group-hover:h-3 transition-all duration-300" />
              </div>
              <div className="relative">
                <div className="p-3 bg-orange-200 rounded-full group-hover:bg-orange-300 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-md group-hover:shadow-lg">
                  <TrendingUp className="w-6 h-6 text-orange-600 group-hover:text-orange-700 group-hover:animate-pulse transition-colors duration-300" />
                </div>
                <div className="absolute inset-0 rounded-full border-2 border-orange-400 opacity-0 group-hover:opacity-100 group-hover:animate-spin transition-opacity duration-500"></div>
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-orange-400 to-orange-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-primary" />
              إدارة البيع المتقدمة
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => navigate('/reception/booking-calendar')}
                variant="default"
                size="sm"
                className="flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <ExternalLink className="w-4 h-4" />
                التقويم
              </Button>
              <Button
                onClick={handleRefresh}
                disabled={isRefreshing}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                تحديث
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                تصدير
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Enhanced TabsList with Advanced Visual Effects */}
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-gradient-to-r from-muted/50 to-muted/30 p-1 rounded-xl shadow-elegant border border-border/40 backdrop-blur-sm">
              <TabsTrigger 
                value="list" 
                className="group relative flex items-center gap-2 px-6 py-3 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-white data-[state=active]:shadow-glow transition-all duration-500 hover:scale-105 data-[state=active]:scale-105 overflow-hidden"
              >
                {/* Tab Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 group-data-[state=active]:opacity-100 transition-opacity duration-500"></div>
                
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-data-[state=active]:translate-x-full transition-transform duration-1000"></div>
                
                <Activity className="w-4 h-4 relative z-10 group-data-[state=active]:animate-pulse" />
                <span className="relative z-10 font-medium">قائمة البيع</span>
                
                {/* Active Indicator */}
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-primary to-primary/60 scale-x-0 group-data-[state=active]:scale-x-100 transition-transform duration-500 origin-center"></div>
              </TabsTrigger>
              
              <TabsTrigger 
                value="stats" 
                className="group relative flex items-center gap-2 px-6 py-3 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-secondary data-[state=active]:to-secondary/80 data-[state=active]:text-white data-[state=active]:shadow-glow transition-all duration-500 hover:scale-105 data-[state=active]:scale-105 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-secondary/5 opacity-0 group-hover:opacity-100 group-data-[state=active]:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-data-[state=active]:translate-x-full transition-transform duration-1000"></div>
                
                <BarChart3 className="w-4 h-4 relative z-10 group-data-[state=active]:animate-pulse" />
                <span className="relative z-10 font-medium">الإحصائيات</span>
                
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-secondary to-secondary/60 scale-x-0 group-data-[state=active]:scale-x-100 transition-transform duration-500 origin-center"></div>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-6">
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="البحث في البيع..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الحالات</SelectItem>
                    {bookingStatuses.map(status => (
                      <SelectItem key={status.status} value={status.status}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="التاريخ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع التواريخ</SelectItem>
                    <SelectItem value="today">اليوم</SelectItem>
                    <SelectItem value="tomorrow">غداً</SelectItem>
                    <SelectItem value="week">هذا الأسبوع</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="ترتيب حسب" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">التاريخ والوقت</SelectItem>
                    <SelectItem value="customer">اسم العميل</SelectItem>
                    <SelectItem value="priority">الأولوية</SelectItem>
                    <SelectItem value="price">السعر</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Filter className="w-3 h-3" />
                    {filteredBookings.length} حجز
                  </Badge>
                </div>
              </div>

              {/* Bookings List */}
              <div className="space-y-4">
                {filteredBookings.length === 0 ? (
                  <Card className="p-12 text-center">
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                        <Calendar className="w-8 h-8 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-600">لا توجد حجوزات</h3>
                        <p className="text-gray-500">لا توجد حجوزات تطابق المعايير المحددة</p>
                      </div>
                    </div>
                  </Card>
                ) : (
                  filteredBookings.map((booking) => {
                    const statusConfig = getStatusConfig(booking.status);
                    const priorityConfig = getPriorityConfig(booking.priority);
                    const StatusIcon = statusConfig.icon;
                    
                    return (
                      <Card key={booking.id} className="hover:shadow-lg transition-all duration-300 border-l-4" style={{ borderLeftColor: statusConfig.color.replace('text-', '').replace('-700', '') }}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 space-y-4">
                              {/* Header */}
                              <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-3">
                                    <h3 className="text-lg font-bold text-gray-900">{booking.customerName}</h3>
                                    <Badge className={`${statusConfig.bgColor} ${statusConfig.color} border`}>
                                      <StatusIcon className="w-3 h-3 mr-1" />
                                      {statusConfig.label}
                                    </Badge>
                                    <Badge className={`${priorityConfig.bgColor} ${priorityConfig.color} border`}>
                                      {priorityConfig.label}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                      <Phone className="w-4 h-4" />
                                      {booking.customerPhone}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Car className="w-4 h-4" />
                                      {booking.plateNumber} - {booking.vehicleModel}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right space-y-1">
                                  <div className="text-sm text-gray-500">
                                    {getDateLabel(booking.date)}
                                  </div>
                                  <div className="text-lg font-bold text-primary">
                                    {booking.totalPrice.toLocaleString()} جنيه
                                  </div>
                                </div>
                              </div>

                              {/* Details */}
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    <span className="font-medium">{formatDateTime(booking.date, booking.time)}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Timer className="w-4 h-4 text-gray-400" />
                                    <span>{booking.duration} دقيقة</span>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    <span>الفرع الرئيسي</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-gray-400" />
                                    <span>{booking.assignedEmployee || 'غير محدد'}</span>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex flex-wrap gap-1">
                                    {booking.services.map((service, index) => (
                                      <Badge key={index} variant="outline" className="text-xs">
                                        {service}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {booking.notes && (
                                <div className="p-3 bg-gray-50 rounded-lg">
                                  <div className="flex items-start gap-2">
                                    <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5" />
                                    <p className="text-sm text-gray-700">{booking.notes}</p>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-2 ml-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  setIsDetailOpen(true);
                                }}
                                className="flex items-center gap-2"
                              >
                                <Eye className="w-4 h-4" />
                                عرض
                              </Button>
                              
                              <Select
                                value={booking.status}
                                onValueChange={(value) => handleStatusChange(booking.id, value)}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {bookingStatuses.map(status => (
                                    <SelectItem key={status.status} value={status.status}>
                                      {status.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            </TabsContent>


            <TabsContent value="stats">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>توزيع حالات البيع</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {bookingStatuses.map(status => {
                        const count = getBookingsByStatus(status.status as any).length;
                        const percentage = bookings.length > 0 ? (count / bookings.length) * 100 : 0;
                        return (
                          <div key={status.status} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="flex items-center gap-2">
                                <status.icon className={`w-4 h-4 ${status.color}`} />
                                {status.label}
                              </span>
                              <span className="font-medium">{count} ({percentage.toFixed(0)}%)</span>
                            </div>
                            <Progress value={percentage} className="h-2" />
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>الإحصائيات المالية</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-600">إجمالي الإيرادات</p>
                        <p className="text-3xl font-bold text-green-700">
                          {bookings.reduce((sum, b) => sum + b.totalPrice, 0).toLocaleString()} جنيه
                        </p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-600">متوسط قيمة الحجز</p>
                        <p className="text-2xl font-bold text-blue-700">
                          {stats.avgBookingValue.toLocaleString()} جنيه
                        </p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <p className="text-sm text-purple-600">إيرادات اليوم</p>
                        <p className="text-2xl font-bold text-purple-700">
                          {stats.todayRevenue.toLocaleString()} جنيه
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Booking Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              تفاصيل الحجز - {selectedBooking?.customerName}
            </DialogTitle>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="space-y-6">
              {/* Customer Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    معلومات العميل
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>اسم العميل</Label>
                      <Input value={selectedBooking.customerName} readOnly />
                    </div>
                    <div>
                      <Label>رقم الهاتف</Label>
                      <Input value={selectedBooking.customerPhone} readOnly />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Vehicle Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="w-5 h-5" />
                    معلومات المركبة
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>رقم اللوحة</Label>
                      <Input value={selectedBooking.plateNumber} readOnly />
                    </div>
                    <div>
                      <Label>نوع المركبة</Label>
                      <Input value={selectedBooking.vehicleModel} readOnly />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Service Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    تفاصيل الخدمة
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>التاريخ</Label>
                      <Input value={getDateLabel(selectedBooking.date)} readOnly />
                    </div>
                    <div>
                      <Label>الوقت</Label>
                      <Input value={selectedBooking.time} readOnly />
                    </div>
                    <div>
                      <Label>المدة المتوقعة</Label>
                      <Input value={`${selectedBooking.duration} دقيقة`} readOnly />
                    </div>
                  </div>
                  <div>
                    <Label>الخدمات المطلوبة</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedBooking.services.map((service, index) => (
                        <Badge key={index} variant="secondary">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>الملاحظات</Label>
                    <Textarea value={selectedBooking.notes} readOnly />
                  </div>
                </CardContent>
              </Card>

              {/* Status & Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>إدارة الحجز</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>الحالة الحالية</Label>
                      <Select
                        value={selectedBooking.status}
                        onValueChange={(value) => {
                          handleStatusChange(selectedBooking.id, value);
                          setSelectedBooking({...selectedBooking, status: value as any});
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {bookingStatuses.map(status => (
                            <SelectItem key={status.status} value={status.status}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>الأولوية</Label>
                      <Select value={selectedBooking.priority}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {priorityLevels.map(priority => (
                            <SelectItem key={priority.value} value={priority.value}>
                              {priority.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>المبلغ الإجمالي</Label>
                      <Input value={`${selectedBooking.totalPrice.toLocaleString()} جنيه`} readOnly />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}