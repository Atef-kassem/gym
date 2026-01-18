import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { CalendarIcon, Clock, Users, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetTimeSlotsQuery } from "@/services/bookingApi";

interface TimeSlot {
  time: string;
  available: boolean;
  bookedSlots: number;
  maxSlots: number;
}

interface TimeSlotPickerProps {
  selectedDate?: Date;
  selectedTime?: string;
  branchId?: string;
  onDateChange: (date: Date) => void;
  onTimeChange: (time: string) => void;
}

export function TimeSlotPicker({ 
  selectedDate, 
  selectedTime, 
  branchId,
  onDateChange, 
  onTimeChange 
}: TimeSlotPickerProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);

  // جلب الأوقات المتاحة من API
  const { 
    data: timeSlotsData, 
    isLoading: timeSlotsLoading, 
    error: timeSlotsError 
  } = useGetTimeSlotsQuery(
    { 
      branchId: branchId || '', 
      date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '' 
    },
    { 
      skip: !branchId || !selectedDate 
    }
  );

  const timeSlots = timeSlotsData?.data?.timeSlots || [];

  const getSlotStatus = (slot: any) => {
    if (slot.status === 'fully_booked') {
      return {
        color: "bg-red-100 text-red-800 border-red-200 hover:bg-red-200",
        icon: <XCircle className="h-4 w-4" />,
        label: "محجوز بالكامل",
        available: false
      };
    }
    
    if (slot.status === 'busy') {
      return {
        color: "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200",
        icon: <Users className="h-4 w-4" />,
        label: "مزدحم",
        available: true
      };
    } else if (slot.status === 'partially_available') {
      return {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200",
        icon: <Clock className="h-4 w-4" />,
        label: "متاح جزئياً",
        available: true
      };
    } else {
      return {
        color: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200",
        icon: <CheckCircle2 className="h-4 w-4" />,
        label: "متاح بالكامل",
        available: true
      };
    }
  };

  return (
    <div className="space-y-6">
      {/* اختيار التاريخ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            اختر التاريخ
          </CardTitle>
          <CardDescription>حدد التاريخ المطلوب للحجز</CardDescription>
        </CardHeader>
        <CardContent>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-right font-normal h-12",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="ml-2 h-4 w-4" />
                {selectedDate ? (
                  format(selectedDate, "PPP", { locale: ar })
                ) : (
                  <span>اختر التاريخ</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  if (date) {
                    onDateChange(date);
                    setCalendarOpen(false);
                  }
                }}
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
                locale={ar}
              />
            </PopoverContent>
          </Popover>
        </CardContent>
      </Card>

      {/* اختيار الوقت */}
      {selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              اختر الوقت
            </CardTitle>
            <CardDescription>
              حدد الوقت المناسب من الأوقات المتاحة
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* مفتاح الألوان */}
            <div className="mb-6 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-3">مفتاح الألوان:</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
                  <span>متاح بالكامل</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-100 border border-yellow-200 rounded"></div>
                  <span>متاح جزئياً</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-100 border border-orange-200 rounded"></div>
                  <span>مزدحم</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
                  <span>محجوز بالكامل</span>
                </div>
              </div>
            </div>

            {/* شبكة الأوقات */}
            {timeSlotsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-2">جاري تحميل الأوقات المتاحة...</p>
              </div>
            ) : timeSlotsError ? (
              <div className="text-center py-8">
                <p className="text-red-500">خطأ في تحميل الأوقات المتاحة</p>
                <p className="text-sm text-muted-foreground mt-2">
                  يرجى المحاولة مرة أخرى
                </p>
              </div>
            ) : timeSlots.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">لا توجد أوقات متاحة لهذا التاريخ</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {timeSlots.map((slot: any) => {
                  const status = getSlotStatus(slot);
                  const isSelected = selectedTime === slot.time;
                  
                  return (
                    <Button
                      key={slot.time}
                      variant="outline"
                      className={cn(
                        "h-auto p-3 flex flex-col items-center gap-2 transition-all duration-200",
                        status.color,
                        isSelected && "ring-2 ring-primary ring-offset-2 shadow-lg",
                        !status.available && "cursor-not-allowed opacity-60"
                      )}
                      disabled={!status.available}
                      onClick={() => status.available && onTimeChange(slot.time)}
                    >
                      <div className="flex items-center gap-1">
                        {status.icon}
                        <span className="font-medium">{slot.time}</span>
                      </div>
                      
                      <div className="text-xs text-center">
                        <div>{status.label}</div>
                        <div className="flex items-center gap-1 justify-center mt-1">
                          <Users className="h-3 w-3" />
                          <span>{slot.bookedTables}/{slot.totalTables}</span>
                        </div>
                      </div>
                      
                      {isSelected && (
                        <Badge variant="default" className="text-xs">
                          محدد
                        </Badge>
                      )}
                    </Button>
                  );
                })}
              </div>
            )}

            {/* معلومات إضافية */}
            {selectedTime && (
              <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-center gap-2 text-primary">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-medium">تم اختيار الموعد</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  التاريخ: {format(selectedDate, "PPP", { locale: ar })} | الوقت: {selectedTime}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}