import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  MapPin,
  Star,
  Plus,
  Filter,
  Search,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Zap,
  TrendingUp,
  Activity,
  Bell
} from 'lucide-react';
import { format, isToday, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useAdvancedBookingSystem } from '@/hooks/useAdvancedBookingSystem';
import { useToast } from '@/hooks/use-toast';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  time: string;
  duration: number;
  customer: string;
  service: string;
  branch: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  color: string;
}

export function InteractiveBookingCalendar() {
  const { toast } = useToast();
  const { bookings, getBookingsByDate } = useAdvancedBookingSystem();
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);

  // Convert bookings to calendar events
  useEffect(() => {
    const events: CalendarEvent[] = bookings.map(booking => ({
      id: booking.id,
      title: `${booking.customerName} - ${booking.services[0]?.name || 'خدمة'}`,
      date: new Date(booking.date),
      time: booking.time,
      duration: booking.totalDuration,
      customer: booking.customerName,
      service: booking.services.map(s => s.name).join(', '),
      branch: booking.branchName,
      status: booking.status as any,
      priority: booking.priority as any,
      color: getStatusColor(booking.status)
    }));
    
    setCalendarEvents(events);
  }, [bookings]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'completed': return 'bg-blue-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <Zap className="h-3 w-3 text-red-500" />;
      case 'high': return <TrendingUp className="h-3 w-3 text-orange-500" />;
      case 'medium': return <Activity className="h-3 w-3 text-yellow-500" />;
      default: return <Bell className="h-3 w-3 text-gray-500" />;
    }
  };

  const getEventsForDate = (date: Date) => {
    return calendarEvents.filter(event => 
      isSameDay(event.date, date) &&
      (filterStatus === 'all' || event.status === filterStatus) &&
      (searchQuery === '' || 
       event.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
       event.service.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  };

  const getSelectedDateEvents = () => {
    return getEventsForDate(selectedDate).sort((a, b) => a.time.localeCompare(b.time));
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEventDialogOpen(true);
  };

  const handleStatusUpdate = (eventId: string, newStatus: string) => {
    setCalendarEvents(prev => 
      prev.map(event => 
        event.id === eventId 
          ? { ...event, status: newStatus as any, color: getStatusColor(newStatus) }
          : event
      )
    );
    
    toast({
      title: "تم تحديث الحالة",
      description: `تم تغيير حالة الحجز إلى ${newStatus}`,
    });
  };

  const renderCalendarDay = (date: Date) => {
    const events = getEventsForDate(date);
    const dayEvents = events.slice(0, 3); // Show max 3 events per day
    const hasMore = events.length > 3;

    return (
      <div className="w-full h-full min-h-[80px] p-1 relative">
        <div className={`text-sm font-medium mb-1 ${isToday(date) ? 'text-blue-600' : ''}`}>
          {date.getDate()}
        </div>
        
        <div className="space-y-1">
          {dayEvents.map((event) => (
            <div
              key={event.id}
              className={`text-xs p-1 rounded cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md animate-fade-in ${event.color} text-white`}
              onClick={() => handleEventClick(event)}
              title={`${event.time} - ${event.customer}`}
            >
              <div className="flex items-center gap-1">
                {getPriorityIcon(event.priority)}
                <span className="truncate">{event.time}</span>
              </div>
              <div className="truncate font-medium">{event.customer}</div>
            </div>
          ))}
          
          {hasMore && (
            <div className="text-xs text-center text-muted-foreground bg-gray-100 rounded p-1 animate-pulse">
              +{events.length - 3} أخرى
            </div>
          )}
        </div>
      </div>
    );
  };

  const selectedDateEvents = getSelectedDateEvents();
  const todayEvents = getEventsForDate(new Date());

  return (
    <div className="h-full space-y-6 animate-fade-in">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white animate-slide-in-right">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CalendarIcon className="h-6 w-6" />
              <div>
                <h2 className="text-2xl font-bold">تقويم البيع التفاعلي</h2>
                <p className="text-white/80 text-sm">
                  {format(selectedDate, 'EEEE، d MMMM yyyy', { locale: ar })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-white/20 text-white border-white/30 animate-bounce">
                <Activity className="h-3 w-3 mr-1" />
                {todayEvents.length} حجز اليوم
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-3">
          <Card className="animate-scale-in">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-blue-600" />
                  التقويم الشهري
                </CardTitle>
                
                <div className="flex items-center gap-3">
                  {/* View Mode Toggle */}
                  <div className="flex rounded-lg bg-gray-100 p-1">
                    {['month', 'week', 'day'].map((mode) => (
                      <Button
                        key={mode}
                        variant={viewMode === mode ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode(mode as any)}
                        className="transition-all duration-300 hover:scale-105"
                      >
                        {mode === 'month' ? 'شهر' : mode === 'week' ? 'أسبوع' : 'يوم'}
                      </Button>
                    ))}
                  </div>

                  {/* Filter */}
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-1 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">جميع الحالات</option>
                    <option value="confirmed">مؤكد</option>
                    <option value="pending">في الانتظار</option>
                    <option value="completed">مكتمل</option>
                    <option value="cancelled">ملغي</option>
                  </select>
                </div>
              </div>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="البحث في البيع..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                />
              </div>
            </CardHeader>
            
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                locale={ar}
                className="rounded-lg border animate-fade-in"
                components={{
                  Day: ({ date }) => (
                    <div 
                      className={`relative w-full h-full p-1 cursor-pointer transition-all duration-300 hover:bg-blue-50 rounded-lg ${
                        isSameDay(date, selectedDate) ? 'bg-blue-100 ring-2 ring-blue-500' : ''
                      } ${isToday(date) ? 'ring-1 ring-blue-300' : ''}`}
                      onClick={() => setSelectedDate(date)}
                    >
                      {renderCalendarDay(date)}
                    </div>
                  )
                }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Events Sidebar */}
        <div className="space-y-6">
          {/* Selected Date Events */}
          <Card className="animate-slide-in-right">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5 text-blue-600" />
                حجوزات {format(selectedDate, 'd MMMM', { locale: ar })}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-96 overflow-y-auto">
              {selectedDateEvents.length > 0 ? (
                selectedDateEvents.map((event, index) => (
                  <div
                    key={event.id}
                    className={`p-4 rounded-lg border-l-4 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-md animate-scale-in ${event.color.replace('bg-', 'border-l-')} bg-gray-50`}
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{event.time}</span>
                        {getPriorityIcon(event.priority)}
                      </div>
                      <Badge 
                        variant={event.status === 'confirmed' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {event.status === 'confirmed' ? 'مؤكد' :
                         event.status === 'pending' ? 'انتظار' :
                         event.status === 'completed' ? 'مكتمل' : 'ملغي'}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="font-medium text-sm">{event.customer}</p>
                      <p className="text-xs text-muted-foreground">{event.service}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {event.branch}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground animate-fade-in">
                  <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>لا توجد حجوزات في هذا التاريخ</p>
                  <Button size="sm" className="mt-3 transition-all duration-300 hover:scale-105">
                    <Plus className="h-4 w-4 mr-2" />
                    إضافة حجز
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="animate-bounce-in">
            <CardHeader>
              <CardTitle className="text-lg">إحصائيات سريعة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200 transition-all duration-300 hover:scale-105">
                  <div className="text-2xl font-bold text-green-600">
                    {calendarEvents.filter(e => e.status === 'confirmed').length}
                  </div>
                  <div className="text-xs text-green-600">مؤكد</div>
                </div>
                
                <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200 transition-all duration-300 hover:scale-105">
                  <div className="text-2xl font-bold text-yellow-600">
                    {calendarEvents.filter(e => e.status === 'pending').length}
                  </div>
                  <div className="text-xs text-yellow-600">انتظار</div>
                </div>
                
                <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200 transition-all duration-300 hover:scale-105">
                  <div className="text-2xl font-bold text-blue-600">
                    {calendarEvents.filter(e => e.status === 'completed').length}
                  </div>
                  <div className="text-xs text-blue-600">مكتمل</div>
                </div>
                
                <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200 transition-all duration-300 hover:scale-105">
                  <div className="text-2xl font-bold text-red-600">
                    {calendarEvents.filter(e => e.status === 'cancelled').length}
                  </div>
                  <div className="text-xs text-red-600">ملغي</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Event Details Dialog */}
      <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
        <DialogContent className="animate-scale-in">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-600" />
              تفاصيل الحجز
            </DialogTitle>
          </DialogHeader>
          
          {selectedEvent && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">العميل</label>
                  <p className="font-semibold">{selectedEvent.customer}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">الوقت</label>
                  <p className="font-semibold">{selectedEvent.time}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">الخدمة</label>
                  <p className="font-semibold">{selectedEvent.service}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">الفرع</label>
                  <p className="font-semibold">{selectedEvent.branch}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-muted-foreground">الحالة:</label>
                <Badge className={selectedEvent.color.replace('bg-', 'bg-') + ' text-white'}>
                  {selectedEvent.status === 'confirmed' ? 'مؤكد' :
                   selectedEvent.status === 'pending' ? 'في الانتظار' :
                   selectedEvent.status === 'completed' ? 'مكتمل' : 'ملغي'}
                </Badge>
                <label className="text-sm font-medium text-muted-foreground ml-4">الأولوية:</label>
                <div className="flex items-center gap-1">
                  {getPriorityIcon(selectedEvent.priority)}
                  <span className="text-sm">
                    {selectedEvent.priority === 'urgent' ? 'عاجل' :
                     selectedEvent.priority === 'high' ? 'مهم' :
                     selectedEvent.priority === 'medium' ? 'متوسط' : 'منخفض'}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  onClick={() => handleStatusUpdate(selectedEvent.id, 'confirmed')}
                  disabled={selectedEvent.status === 'confirmed'}
                  className="flex-1 bg-green-600 hover:bg-green-700 transition-all duration-300 hover:scale-105"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  تأكيد
                </Button>
                <Button
                  onClick={() => handleStatusUpdate(selectedEvent.id, 'completed')}
                  disabled={selectedEvent.status === 'completed'}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:scale-105"
                >
                  <Star className="h-4 w-4 mr-2" />
                  إتمام
                </Button>
                <Button
                  onClick={() => handleStatusUpdate(selectedEvent.id, 'cancelled')}
                  disabled={selectedEvent.status === 'cancelled'}
                  variant="destructive"
                  className="flex-1 transition-all duration-300 hover:scale-105"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  إلغاء
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}