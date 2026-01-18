import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Navigation, 
  MapPin, 
  Car, 
  Clock, 
  User, 
  Phone, 
  Settings,
  Maximize2,
  Minimize2,
  RefreshCw,
  Filter,
  Eye,
  Route,
  Locate,
  Activity
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface Vehicle {
  id: string;
  name: string;
  driver: {
    name: string;
    phone: string;
  };
  location: {
    current: {
      coordinates: [number, number];
      address: string;
    };
  };
  status: {
    availability: string;
    operational: string;
  };
  vehicle: {
    fuelLevel: number;
    speed: number;
  };
}

interface Booking {
  id: string;
  customerName: string;
  location: {
    coordinates: [number, number];
    address: string;
  };
  status: string;
  assignment?: {
    vehicleId: string;
  };
}

interface SimpleTrackingMapProps {
  vehicles: Vehicle[];
  bookings: Booking[];
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

const SimpleTrackingMap: React.FC<SimpleTrackingMapProps> = ({
  vehicles = [],
  bookings = [],
  isFullscreen = false,
  onToggleFullscreen
}) => {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isLiveTracking, setIsLiveTracking] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [refreshKey, setRefreshKey] = useState(0);

  // Live tracking simulation
  useEffect(() => {
    if (!isLiveTracking) return;

    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1);
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [isLiveTracking]);

  const filteredVehicles = filterStatus === 'all' 
    ? vehicles 
    : vehicles.filter(v => v.status.availability === filterStatus);

  const activeBookings = bookings.filter(b => b.status !== 'مكتمل');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'متاح': return 'bg-green-500';
      case 'مشغول': return 'bg-orange-500';
      case 'صيانة': return 'bg-red-500';
      case 'مجدول': return 'bg-blue-500';
      case 'في الطريق': return 'bg-yellow-500';
      case 'في التنفيذ': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'متاح': case 'نشط': case 'مجدول': return 'bg-green-100 text-green-800';
      case 'مشغول': case 'في الطريق': return 'bg-yellow-100 text-yellow-800';
      case 'في التنفيذ': return 'bg-purple-100 text-purple-800';
      case 'صيانة': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'relative w-full'}`}>
      <Card className="h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5" />
              خريطة التتبع التفاعلية
              <Badge variant="outline" className="mr-2">
                مباشر {isLiveTracking && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse ml-1" />}
              </Badge>
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Switch
                  checked={isLiveTracking}
                  onCheckedChange={setIsLiveTracking}
                  id="live-tracking"
                />
                <Label htmlFor="live-tracking" className="text-sm">التحديث المباشر</Label>
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  <SelectItem value="متاح">متاح</SelectItem>
                  <SelectItem value="مشغول">مشغول</SelectItem>
                  <SelectItem value="صيانة">صيانة</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={() => setRefreshKey(prev => prev + 1)}>
                <RefreshCw className="h-4 w-4" />
              </Button>
              {onToggleFullscreen && (
                <Button variant="outline" size="sm" onClick={onToggleFullscreen}>
                  {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Map Container */}
          <div 
            className={`${isFullscreen ? 'h-[calc(100vh-120px)]' : 'h-[600px]'} w-full bg-gradient-to-br from-blue-50 to-cyan-50 relative overflow-hidden rounded-b-lg`}
          >
            {/* Saudi Arabia Map Background */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full relative bg-gradient-to-br from-slate-100 to-blue-100">
                {/* Grid Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="grid grid-cols-10 grid-rows-10 h-full w-full">
                    {Array.from({ length: 100 }).map((_, i) => (
                      <div key={i} className="border border-gray-300"></div>
                    ))}
                  </div>
                </div>
                
                {/* Saudi Map Outline */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-80 h-60 relative">
                    <svg viewBox="0 0 400 300" className="w-full h-full opacity-20">
                      <path
                        d="M50 150 Q100 100 200 120 Q300 140 350 160 Q340 200 300 220 Q200 240 100 220 Q60 200 50 150 Z"
                        fill="currentColor"
                        className="text-primary"
                      />
                    </svg>
                  </div>
                </div>

                {/* Vehicle Markers */}
                {filteredVehicles.map((vehicle, index) => {
                  const x = 20 + (index % 4) * 20; // Distribute horizontally
                  const y = 30 + Math.floor(index / 4) * 15; // Distribute vertically
                  
                  return (
                    <div
                      key={vehicle.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                      style={{ 
                        left: `${x}%`, 
                        top: `${y}%`,
                        animation: isLiveTracking ? `pulse 2s infinite ${index * 0.2}s` : 'none'
                      }}
                      onClick={() => setSelectedVehicle(vehicle)}
                    >
                      <div className="relative">
                        <div className={`w-12 h-12 rounded-full shadow-lg border-2 border-white ${getStatusColor(vehicle.status.availability)} flex items-center justify-center group-hover:scale-110 transition-all duration-200`}>
                          <Car className="w-6 h-6 text-white" />
                        </div>
                        <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${vehicle.status.operational === 'نشط' ? 'bg-green-400' : 'bg-red-400'} ${isLiveTracking ? 'animate-ping' : ''}`}></div>
                        
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                          {vehicle.name} - {vehicle.driver.name}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Booking Markers */}
                {activeBookings.map((booking, index) => {
                  const x = 60 + (index % 3) * 15; // Different distribution for bookings
                  const y = 50 + Math.floor(index / 3) * 20;
                  
                  return (
                    <div
                      key={booking.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                      style={{ left: `${x}%`, top: `${y}%` }}
                      onClick={() => setSelectedBooking(booking)}
                    >
                      <div className="relative">
                        <div className={`w-8 h-8 rounded-full shadow-lg border-2 border-white ${getStatusColor(booking.status)} flex items-center justify-center group-hover:scale-110 transition-all duration-200`}>
                          <MapPin className="w-4 h-4 text-white" />
                        </div>
                        {booking.status === 'مجدول' && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 border border-white animate-ping"></div>
                        )}
                        
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                          {booking.customerName} - {booking.status}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live Stats Overlay */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Car className="h-4 w-4 text-green-500" />
                  <span>{vehicles.filter(v => v.status.availability === 'متاح').length} متاح</span>
                </div>
                <div className="flex items-center gap-1">
                  <Car className="h-4 w-4 text-orange-500" />
                  <span>{vehicles.filter(v => v.status.availability === 'مشغول').length} مشغول</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  <span>{activeBookings.length} حجز نشط</span>
                </div>
              </div>
            </div>

            {/* Map Legend */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
              <h4 className="font-semibold text-sm mb-2">دليل الرموز</h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <span>مركبة متاحة</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                  <span>مركبة مشغولة</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                  <span>حجز مجدول</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                  <span>قيد التنفيذ</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Details Dialog */}
      {selectedVehicle && (
        <Dialog open={!!selectedVehicle} onOpenChange={() => setSelectedVehicle(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>تفاصيل المركبة - {selectedVehicle.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>السائق</Label>
                  <p className="text-sm">{selectedVehicle.driver.name}</p>
                </div>
                <div>
                  <Label>رقم الهاتف</Label>
                  <p className="text-sm" dir="ltr">{selectedVehicle.driver.phone}</p>
                </div>
                <div>
                  <Label>الحالة</Label>
                  <Badge className={getStatusBadgeClass(selectedVehicle.status.availability)}>
                    {selectedVehicle.status.availability}
                  </Badge>
                </div>
                <div>
                  <Label>الوقود</Label>
                  <p className="text-sm">{selectedVehicle.vehicle.fuelLevel}%</p>
                </div>
                <div>
                  <Label>السرعة</Label>
                  <p className="text-sm">{selectedVehicle.vehicle.speed} كم/س</p>
                </div>
                <div>
                  <Label>حالة التشغيل</Label>
                  <Badge className={selectedVehicle.status.operational === 'نشط' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {selectedVehicle.status.operational}
                  </Badge>
                </div>
              </div>
              <div>
                <Label>الموقع الحالي</Label>
                <p className="text-sm">{selectedVehicle.location.current.address}</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => window.open(`tel:${selectedVehicle.driver.phone}`)}
                  className="flex-1"
                >
                  <Phone className="h-4 w-4 ml-1" />
                  اتصال
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedVehicle(null)}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 ml-1" />
                  إغلاق
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Booking Details Dialog */}
      {selectedBooking && (
        <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>تفاصيل الحجز - {selectedBooking.customerName}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>رقم الحجز</Label>
                  <p className="text-sm">{selectedBooking.id}</p>
                </div>
                <div>
                  <Label>الحالة</Label>
                  <Badge className={getStatusBadgeClass(selectedBooking.status)}>
                    {selectedBooking.status}
                  </Badge>
                </div>
              </div>
              <div>
                <Label>الموقع</Label>
                <p className="text-sm">{selectedBooking.location.address}</p>
              </div>
              {selectedBooking.assignment?.vehicleId && (
                <div>
                  <Label>المركبة المعينة</Label>
                  <p className="text-sm">{selectedBooking.assignment.vehicleId}</p>
                </div>
              )}
              <Button 
                onClick={() => setSelectedBooking(null)}
                className="w-full"
              >
                <Eye className="h-4 w-4 ml-1" />
                إغلاق
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default SimpleTrackingMap;