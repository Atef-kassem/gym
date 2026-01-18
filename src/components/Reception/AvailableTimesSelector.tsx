import { useState, useMemo, useEffect } from "react";
import { format, addMinutes, parseISO, isSameDay, startOfDay } from "date-fns";
import { ar } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  Users,
  Timer,
  MapPin 
} from "lucide-react";

interface ServicePath {
  id: string;
  name: string;
  capacity: number;
  duration: number;
}

interface Booking {
  id: string;
  date: string;
  time: string;
  duration: number;
  servicePath: string;
  branch: string;
  status: string;
}

interface AvailableTimesSelectorProps {
  selectedDate?: Date;
  selectedBranch?: string;
  selectedServicePath?: string;
  serviceDuration: number;
  existingBookings: Booking[];
  servicePaths: ServicePath[];
  branches: Array<{id: string, name: string}>;
  onTimeSelect: (time: string) => void;
  onDateSelect: (date: Date) => void;
  onBranchSelect: (branch: string) => void;
  onServicePathSelect: (path: string) => void;
  selectedTime?: string;
}

const AvailableTimesSelector = ({
  selectedDate,
  selectedBranch,
  selectedServicePath,
  serviceDuration,
  existingBookings,
  servicePaths,
  branches,
  onTimeSelect,
  onDateSelect,
  onBranchSelect,
  onServicePathSelect,
  selectedTime
}: AvailableTimesSelectorProps) => {
  const [workingHours] = useState({
    start: "08:00",
    end: "20:00"
  });

  // Generate time slots for the day (every 15 minutes)
  const generateTimeSlots = () => {
    const slots = [];
    const [startHour, startMinute] = workingHours.start.split(':').map(Number);
    const [endHour, endMinute] = workingHours.end.split(':').map(Number);
    
    let currentTime = new Date();
    currentTime.setHours(startHour, startMinute, 0, 0);
    
    const endTime = new Date();
    endTime.setHours(endHour, endMinute, 0, 0);
    
    while (currentTime < endTime) {
      slots.push(format(currentTime, 'HH:mm'));
      currentTime = addMinutes(currentTime, 15);
    }
    
    return slots;
  };

  // Check if a time slot is available
  const isTimeSlotAvailable = (timeSlot: string, date: Date, pathId: string, branchId: string) => {
    if (!date || !pathId || !branchId) return false;

    const path = servicePaths.find(p => p.id === pathId);
    if (!path) return false;

    // Get bookings for the selected date, branch, and service path
    const dayBookings = existingBookings.filter(booking => {
      const bookingDate = parseISO(booking.date);
      return isSameDay(bookingDate, date) && 
             booking.servicePath === pathId && 
             booking.branch === branchId &&
             booking.status !== 'cancelled' &&
             booking.status !== 'no-show';
    });

    // Convert time slot to minutes for easier calculation
    const [hours, minutes] = timeSlot.split(':').map(Number);
    const slotStartMinutes = hours * 60 + minutes;
    const slotEndMinutes = slotStartMinutes + serviceDuration;

    // Check if this slot overlaps with any existing booking
    const hasOverlap = dayBookings.some(booking => {
      const [bookingHours, bookingMinutes] = booking.time.split(':').map(Number);
      const bookingStartMinutes = bookingHours * 60 + bookingMinutes;
      const bookingEndMinutes = bookingStartMinutes + booking.duration;

      // Check for overlap
      return (slotStartMinutes < bookingEndMinutes && slotEndMinutes > bookingStartMinutes);
    });

    // Check capacity constraints
    const simultaneousBookings = dayBookings.filter(booking => {
      const [bookingHours, bookingMinutes] = booking.time.split(':').map(Number);
      const bookingStartMinutes = bookingHours * 60 + bookingMinutes;
      const bookingEndMinutes = bookingStartMinutes + booking.duration;

      // Check if booking runs during this time slot
      return (bookingStartMinutes <= slotStartMinutes && bookingEndMinutes > slotStartMinutes) ||
             (bookingStartMinutes < slotEndMinutes && bookingEndMinutes >= slotEndMinutes) ||
             (bookingStartMinutes >= slotStartMinutes && bookingEndMinutes <= slotEndMinutes);
    });

    return !hasOverlap && simultaneousBookings.length < path.capacity;
  };

  // Get availability status for a time slot
  const getTimeSlotStatus = (timeSlot: string, date: Date, pathId: string, branchId: string) => {
    if (!date || !pathId || !branchId) return 'unavailable';

    const path = servicePaths.find(p => p.id === pathId);
    if (!path) return 'unavailable';

    const dayBookings = existingBookings.filter(booking => {
      const bookingDate = parseISO(booking.date);
      return isSameDay(bookingDate, date) && 
             booking.servicePath === pathId && 
             booking.branch === branchId &&
             booking.status !== 'cancelled' &&
             booking.status !== 'no-show';
    });

    const [hours, minutes] = timeSlot.split(':').map(Number);
    const slotStartMinutes = hours * 60 + minutes;

    const simultaneousBookings = dayBookings.filter(booking => {
      const [bookingHours, bookingMinutes] = booking.time.split(':').map(Number);
      const bookingStartMinutes = bookingHours * 60 + bookingMinutes;
      const bookingEndMinutes = bookingStartMinutes + booking.duration;

      return (bookingStartMinutes <= slotStartMinutes && bookingEndMinutes > slotStartMinutes);
    });

    const availability = path.capacity - simultaneousBookings.length;

    if (availability <= 0) return 'full';
    if (availability <= path.capacity * 0.3) return 'limited';
    return 'available';
  };

  const timeSlots = useMemo(() => generateTimeSlots(), [workingHours]);

  const availableSlots = useMemo(() => {
    if (!selectedDate || !selectedServicePath || !selectedBranch) return [];
    
    return timeSlots.filter(slot => 
      isTimeSlotAvailable(slot, selectedDate, selectedServicePath, selectedBranch)
    );
  }, [selectedDate, selectedServicePath, selectedBranch, serviceDuration, existingBookings, timeSlots]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200';
      case 'limited': return 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200';
      case 'full': return 'bg-red-100 text-red-800 border-red-200 cursor-not-allowed';
      default: return 'bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle className="h-3 w-3" />;
      case 'limited': return <AlertCircle className="h-3 w-3" />;
      case 'full': return <Users className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Selection Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Date Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">تاريخ الحجز</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP", { locale: ar }) : "اختر التاريخ"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && onDateSelect(date)}
                disabled={(date) => date < startOfDay(new Date())}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Branch Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">الفرع</Label>
          <Select value={selectedBranch} onValueChange={onBranchSelect}>
            <SelectTrigger>
              <SelectValue placeholder="اختر الفرع" />
            </SelectTrigger>
            <SelectContent>
              {branches.map((branch) => (
                <SelectItem key={branch.id} value={branch.id}>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {branch.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Service Path Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">مسار الخدمة</Label>
          <Select value={selectedServicePath} onValueChange={onServicePathSelect}>
            <SelectTrigger>
              <SelectValue placeholder="اختر المسار" />
            </SelectTrigger>
            <SelectContent>
              {servicePaths.map((path) => (
                <SelectItem key={path.id} value={path.id}>
                  <div className="flex items-center gap-2">
                    <Timer className="h-4 w-4" />
                    <span>{path.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {path.capacity} متاح
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Available Times Grid */}
      {selectedDate && selectedBranch && selectedServicePath && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              الأوقات المتاحة
              <Badge variant="outline" className="mr-auto">
                {availableSlots.length} وقت متاح
              </Badge>
            </CardTitle>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-green-500"></div>
                <span>متاح</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-yellow-500"></div>
                <span>محدود</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-red-500"></div>
                <span>ممتلئ</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
              {timeSlots.map((slot) => {
                const status = getTimeSlotStatus(slot, selectedDate, selectedServicePath, selectedBranch);
                const isAvailable = status === 'available' || status === 'limited';
                const isSelected = selectedTime === slot;
                
                return (
                  <Button
                    key={slot}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    disabled={!isAvailable}
                    onClick={() => isAvailable && onTimeSelect(slot)}
                    className={cn(
                      "h-12 flex flex-col items-center justify-center p-2",
                      !isSelected && getStatusColor(status),
                      isSelected && "ring-2 ring-primary"
                    )}
                  >
                    <div className="flex items-center gap-1">
                      {getStatusIcon(status)}
                      <span className="text-xs font-medium">{slot}</span>
                    </div>
                    {status === 'limited' && (
                      <span className="text-xs opacity-70">محدود</span>
                    )}
                  </Button>
                );
              })}
            </div>
            
            {availableSlots.length === 0 && (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <h3 className="font-medium text-muted-foreground">لا توجد أوقات متاحة</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  جرب يوماً آخر أو مساراً مختلفاً
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Service Duration Info */}
      {selectedServicePath && (
        <Card className="bg-muted/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">مدة الخدمة المتوقعة</span>
              </div>
              <Badge variant="secondary">
                {serviceDuration} دقيقة
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AvailableTimesSelector;