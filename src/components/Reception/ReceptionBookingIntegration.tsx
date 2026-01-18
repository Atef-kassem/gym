import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar,
  Clock,
  Users,
  CheckCircle,
  AlertTriangle,
  Phone,
  MessageSquare,
  Bell,
  Activity,
  ArrowRight,
  Play,
  Pause,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  Timer,
  TrendingUp,
  Zap,
  Target,
  Star,
  MapPin,
  Settings,
  MoreHorizontal,
  Eye,
  RefreshCw
} from 'lucide-react';
import { useBookingSystem } from '@/hooks/useBookingSystem';
import { useToast } from '@/hooks/use-toast';
import { format, parseISO, isToday } from 'date-fns';
import { ar } from 'date-fns/locale';

export function ReceptionBookingIntegration() {
  const { bookings, updateBooking, getBookingsByStatus, getBookingsByDate } = useBookingSystem();
  const { toast } = useToast();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const todayBookings = getBookingsByDate(today);
  const pendingBookings = getBookingsByStatus('pending');
  const confirmedBookings = getBookingsByStatus('confirmed');
  const inProgressBookings = getBookingsByStatus('in-progress');

  // Get next upcoming bookings
  const upcomingBookings = todayBookings
    .filter(b => b.status === 'confirmed' || b.status === 'pending')
    .sort((a, b) => a.time.localeCompare(b.time))
    .slice(0, 5);

  // Get current active bookings
  const activeBookings = inProgressBookings.slice(0, 3);

  const handleStartService = (bookingId: string) => {
    updateBooking(bookingId, { status: 'in-progress' });
    toast({
      title: "تم بدء الخدمة",
      description: "تم تحديث حالة الحجز إلى قيد التنفيذ",
    });
  };

  const handleCompleteService = (bookingId: string) => {
    updateBooking(bookingId, { status: 'completed' });
    toast({
      title: "تم إنجاز الخدمة",
      description: "تم تحديث حالة الحجز إلى مكتمل",
    });
  };

  const handleConfirmBooking = (bookingId: string) => {
    updateBooking(bookingId, { status: 'confirmed' });
    toast({
      title: "تم تأكيد الحجز",
      description: "تم تأكيد الحجز بنجاح",
    });
  };

  const getTimeStatus = (date: string, time: string) => {
    try {
      const bookingDateTime = parseISO(`${date}T${time}`);
      const now = new Date();
      const diffMinutes = Math.floor((bookingDateTime.getTime() - now.getTime()) / (1000 * 60));
      
      if (diffMinutes < 0) return { status: 'overdue', label: 'متأخر', color: 'text-red-600' };
      if (diffMinutes <= 15) return { status: 'soon', label: 'قريب', color: 'text-orange-600' };
      if (diffMinutes <= 60) return { status: 'upcoming', label: 'قادم', color: 'text-blue-600' };
      return { status: 'scheduled', label: 'مجدول', color: 'text-gray-600' };
    } catch {
      return { status: 'scheduled', label: 'مجدول', color: 'text-gray-600' };
    }
  };

  const stats = {
    todayTotal: todayBookings.length,
    pending: pendingBookings.length,
    confirmed: confirmedBookings.length,
    inProgress: inProgressBookings.length,
    completionRate: todayBookings.length > 0 ? 
      (todayBookings.filter(b => b.status === 'completed').length / todayBookings.length) * 100 : 0
  };

  return (
    <div className="space-y-6">
      {/* Professional Header */}
      <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50 p-6 rounded-2xl border shadow-lg">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              مركز التحكم المباشر
            </h2>
            <p className="text-slate-600">إدارة احترافية للحجوزات والعمليات النشطة</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
              <span className="text-green-700 font-medium text-sm">مباشر</span>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              تحديث
            </Button>
          </div>
        </div>
      </div>

      {/* Live Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-8 h-8 text-blue-100" />
            <Badge className="bg-white/20 text-white border-white/30 animate-pulse">مباشر</Badge>
          </div>
          <p className="text-blue-100 text-sm font-medium">حجوزات اليوم</p>
          <p className="text-3xl font-bold">{stats.todayTotal}</p>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-orange-500 p-6 rounded-xl text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 text-amber-100" />
            <Badge className="bg-white/20 text-white border-white/30">عاجل</Badge>
          </div>
          <p className="text-amber-100 text-sm font-medium">في الانتظار</p>
          <p className="text-3xl font-bold">{stats.pending}</p>
        </div>

        <div className="bg-gradient-to-br from-violet-500 to-purple-600 p-6 rounded-xl text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Activity className="w-8 h-8 text-violet-100 animate-pulse" />
            <Badge className="bg-white/20 text-white border-white/30">نشط</Badge>
          </div>
          <p className="text-violet-100 text-sm font-medium">قيد التنفيذ</p>
          <p className="text-3xl font-bold">{stats.inProgress}</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-6 rounded-xl text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Target className="w-8 h-8 text-emerald-100" />
            <Badge className="bg-white/20 text-white border-white/30">{stats.completionRate.toFixed(0)}%</Badge>
          </div>
          <p className="text-emerald-100 text-sm font-medium">معدل الإنجاز</p>
          <Progress value={stats.completionRate} className="h-2 bg-white/20 mt-3" />
        </div>
      </div>

      {/* Live Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Bookings */}
        <Card>
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              البيع القادمة اليوم
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {upcomingBookings.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">لا توجد حجوزات قادمة اليوم</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingBookings.slice(0, 3).map((booking) => {
                  const timeStatus = getTimeStatus(booking.date, booking.time);
                  return (
                    <div key={booking.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{booking.customerName}</h4>
                            <p className="text-sm text-gray-600">{booking.plateNumber}</p>
                          </div>
                        </div>
                        <Badge className={`${timeStatus.color} bg-white border`}>
                          {timeStatus.label}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{booking.time}</span>
                          <span>{booking.duration} دقيقة</span>
                        </div>
                        
                        <div className="flex gap-2">
                          {booking.status === 'pending' && (
                            <Button
                              size="sm"
                              onClick={() => handleConfirmBooking(booking.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              تأكيد
                            </Button>
                          )}
                          {booking.status === 'confirmed' && (
                            <Button
                              size="sm"
                              onClick={() => handleStartService(booking.id)}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              بدء
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active Services */}
        <Card>
          <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100">
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-600" />
              الخدمات النشطة
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {activeBookings.length === 0 ? (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">لا توجد خدمات نشطة حالياً</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeBookings.map((booking) => (
                  <div key={booking.id} className="p-4 border rounded-lg bg-purple-50 border-purple-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center">
                          <Activity className="w-5 h-5 text-purple-600 animate-pulse" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{booking.customerName}</h4>
                          <p className="text-sm text-gray-600">{booking.plateNumber}</p>
                        </div>
                      </div>
                      <Badge className="bg-purple-100 text-purple-700 border-purple-300">
                        قيد التنفيذ
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">المدة المقدرة</span>
                        <span className="font-medium">{booking.duration} دقيقة</span>
                      </div>
                      
                      <Progress value={65} className="h-2" />
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleCompleteService(booking.id)}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          إنجاز
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}