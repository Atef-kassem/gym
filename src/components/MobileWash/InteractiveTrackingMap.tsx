import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  Route
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

interface InteractiveTrackingMapProps {
  vehicles: Vehicle[];
  bookings: Booking[];
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  mapboxToken?: string;
}

const InteractiveTrackingMap: React.FC<InteractiveTrackingMapProps> = ({
  vehicles = [],
  bookings = [],
  isFullscreen = false,
  onToggleFullscreen,
  mapboxToken
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [mapboxKey, setMapboxKey] = useState(mapboxToken || '');
  const [showTokenDialog, setShowTokenDialog] = useState(!mapboxToken);
  const [isLiveTracking, setIsLiveTracking] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [isMapInitialized, setIsMapInitialized] = useState(false);

  // Saudi Arabia coordinates (center)
  const SAUDI_CENTER: [number, number] = [45.0792, 23.8859];

  useEffect(() => {
    if (!mapContainer.current || !mapboxKey) return;

    // Initialize map
    mapboxgl.accessToken = mapboxKey;
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: SAUDI_CENTER,
        zoom: 6,
        bearing: 0,
        pitch: 0,
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );

      // Add geolocation control
      map.current.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          trackUserLocation: true,
          showUserHeading: true
        })
      );

      // Add scale control
      map.current.addControl(new mapboxgl.ScaleControl());

      map.current.on('load', () => {
        setIsMapInitialized(true);
        updateMapMarkers();
      });

      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        setShowTokenDialog(true);
      });

    } catch (error) {
      console.error('Error initializing map:', error);
      setShowTokenDialog(true);
    }

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [mapboxKey]);

  useEffect(() => {
    if (isMapInitialized) {
      updateMapMarkers();
    }
  }, [vehicles, bookings, filterStatus, isMapInitialized]);

  // Live tracking update
  useEffect(() => {
    if (!isLiveTracking) return;

    const interval = setInterval(() => {
      if (isMapInitialized) {
        updateMapMarkers();
      }
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [isLiveTracking, isMapInitialized]);

  const updateMapMarkers = () => {
    if (!map.current) return;

    // Clear existing markers
    const existingMarkers = document.querySelectorAll('.custom-marker');
    existingMarkers.forEach(marker => marker.remove());

    // Add vehicle markers
    const filteredVehicles = filterStatus === 'all' 
      ? vehicles 
      : vehicles.filter(v => v.status.availability === filterStatus);

    filteredVehicles.forEach(vehicle => {
      const el = document.createElement('div');
      el.className = 'custom-marker vehicle-marker';
      el.innerHTML = `
        <div class="relative group cursor-pointer transform hover:scale-110 transition-all duration-200">
          <div class="w-10 h-10 rounded-full shadow-lg border-2 ${getVehicleMarkerColor(vehicle.status.availability)} flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
              <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z"/>
            </svg>
          </div>
          <div class="absolute -top-1 -right-1 w-4 h-4 rounded-full ${getStatusDotColor(vehicle.status.operational)} border-2 border-white shadow-sm animate-pulse"></div>
        </div>
      `;

      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        className: 'vehicle-popup'
      }).setHTML(`
        <div class="p-3 min-w-[250px]">
          <div class="flex items-center justify-between mb-2">
            <h3 class="font-bold text-lg">${vehicle.name}</h3>
            <span class="px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(vehicle.status.availability)}">${vehicle.status.availability}</span>
          </div>
          <div class="space-y-2 text-sm">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
              </svg>
              <span>${vehicle.driver.name}</span>
            </div>
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
              </svg>
              <span dir="ltr">${vehicle.driver.phone}</span>
            </div>
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
              </svg>
              <span class="text-xs">${vehicle.location.current.address}</span>
            </div>
            <div class="flex justify-between items-center pt-2 border-t">
              <span class="text-xs text-gray-600">الوقود: ${vehicle.vehicle.fuelLevel}%</span>
              <span class="text-xs text-gray-600">السرعة: ${vehicle.vehicle.speed} كم/س</span>
            </div>
          </div>
          <div class="flex gap-2 mt-3">
            <button onclick="window.selectVehicle('${vehicle.id}')" class="flex-1 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors">
              تفاصيل
            </button>
            <button onclick="window.trackVehicle('${vehicle.id}')" class="flex-1 px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors">
              تتبع
            </button>
          </div>
        </div>
      `);

      new mapboxgl.Marker(el)
        .setLngLat(vehicle.location.current.coordinates)
        .setPopup(popup)
        .addTo(map.current!);
    });

    // Add booking markers
    bookings.forEach(booking => {
      if (booking.status === 'مكتمل') return; // Skip completed bookings

      const el = document.createElement('div');
      el.className = 'custom-marker booking-marker';
      el.innerHTML = `
        <div class="relative group cursor-pointer transform hover:scale-110 transition-all duration-200">
          <div class="w-8 h-8 rounded-full shadow-lg border-2 ${getBookingMarkerColor(booking.status)} flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
            </svg>
          </div>
          <div class="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 border border-white shadow-sm ${booking.status === 'مجدول' ? 'animate-ping' : ''}"></div>
        </div>
      `;

      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        className: 'booking-popup'
      }).setHTML(`
        <div class="p-3 min-w-[200px]">
          <div class="flex items-center justify-between mb-2">
            <h3 class="font-bold">${booking.customerName}</h3>
            <span class="px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(booking.status)}">${booking.status}</span>
          </div>
          <div class="space-y-2 text-sm">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
              </svg>
              <span class="text-xs">${booking.location.address}</span>
            </div>
            <div class="text-xs text-gray-600">رقم الحجز: ${booking.id}</div>
          </div>
          <div class="flex gap-2 mt-3">
            <button onclick="window.selectBooking('${booking.id}')" class="flex-1 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors">
              تفاصيل
            </button>
          </div>
        </div>
      `);

      new mapboxgl.Marker(el)
        .setLngLat(booking.location.coordinates)
        .setPopup(popup)
        .addTo(map.current!);
    });
  };

  const getVehicleMarkerColor = (status: string) => {
    switch (status) {
      case 'متاح': return 'bg-green-500 border-green-600';
      case 'مشغول': return 'bg-orange-500 border-orange-600';
      case 'صيانة': return 'bg-red-500 border-red-600';
      default: return 'bg-gray-500 border-gray-600';
    }
  };

  const getBookingMarkerColor = (status: string) => {
    switch (status) {
      case 'مجدول': return 'bg-blue-500 border-blue-600';
      case 'في الطريق': return 'bg-yellow-500 border-yellow-600';
      case 'في التنفيذ': return 'bg-purple-500 border-purple-600';
      default: return 'bg-gray-500 border-gray-600';
    }
  };

  const getStatusDotColor = (status: string) => {
    switch (status) {
      case 'نشط': return 'bg-green-400';
      case 'غير نشط': return 'bg-red-400';
      default: return 'bg-gray-400';
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

  const handleTokenSubmit = () => {
    if (mapboxKey.trim()) {
      setShowTokenDialog(false);
    }
  };

  const centerOnSaudi = () => {
    if (map.current) {
      map.current.flyTo({
        center: SAUDI_CENTER,
        zoom: 6,
        duration: 1500
      });
    }
  };

  const centerOnVehicles = () => {
    if (!map.current || vehicles.length === 0) return;

    const bounds = new mapboxgl.LngLatBounds();
    vehicles.forEach(vehicle => {
      bounds.extend(vehicle.location.current.coordinates);
    });

    map.current.fitBounds(bounds, {
      padding: 50,
      duration: 1500
    });
  };

  // Global functions for marker callbacks
  React.useEffect(() => {
    (window as any).selectVehicle = (vehicleId: string) => {
      const vehicle = vehicles.find(v => v.id === vehicleId);
      setSelectedVehicle(vehicle || null);
    };

    (window as any).selectBooking = (bookingId: string) => {
      const booking = bookings.find(b => b.id === bookingId);
      setSelectedBooking(booking || null);
    };

    (window as any).trackVehicle = (vehicleId: string) => {
      const vehicle = vehicles.find(v => v.id === vehicleId);
      if (vehicle && map.current) {
        map.current.flyTo({
          center: vehicle.location.current.coordinates,
          zoom: 15,
          duration: 1500
        });
      }
    };

    return () => {
      delete (window as any).selectVehicle;
      delete (window as any).selectBooking;
      delete (window as any).trackVehicle;
    };
  }, [vehicles, bookings]);

  if (showTokenDialog) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            خريطة التتبع التفاعلية
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-8">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">مطلوب مفتاح Mapbox</h3>
            <p className="text-gray-600 mb-4">يرجى إدخال مفتاح Mapbox العام لعرض الخريطة</p>
            <div className="max-w-md mx-auto space-y-3">
              <Input
                type="text"
                placeholder="أدخل مفتاح Mapbox العام..."
                value={mapboxKey}
                onChange={(e) => setMapboxKey(e.target.value)}
                className="text-center"
              />
              <Button onClick={handleTokenSubmit} className="w-full">
                تفعيل الخريطة
              </Button>
              <p className="text-xs text-gray-500">
                يمكنك الحصول على مفتاح مجاني من{' '}
                <a 
                  href="https://mapbox.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  mapbox.com
                </a>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

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
              <Button variant="outline" size="sm" onClick={centerOnSaudi}>
                <MapPin className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={centerOnVehicles}>
                <Route className="h-4 w-4" />
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
          <div 
            ref={mapContainer} 
            className={`${isFullscreen ? 'h-[calc(100vh-100px)]' : 'h-[500px]'} w-full rounded-b-lg`}
            style={{ minHeight: '400px' }}
          />
          
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

          {/* Live Stats */}
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
                <span>{bookings.filter(b => b.status !== 'مكتمل').length} حجز نشط</span>
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
                  onClick={() => {
                    if (map.current) {
                      map.current.flyTo({
                        center: selectedVehicle.location.current.coordinates,
                        zoom: 15,
                        duration: 1500
                      });
                    }
                    setSelectedVehicle(null);
                  }}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 ml-1" />
                  عرض على الخريطة
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
              <Button 
                onClick={() => {
                  if (map.current) {
                    map.current.flyTo({
                      center: selectedBooking.location.coordinates,
                      zoom: 15,
                      duration: 1500
                    });
                  }
                  setSelectedBooking(null);
                }}
                className="w-full"
              >
                <Eye className="h-4 w-4 ml-1" />
                عرض على الخريطة
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default InteractiveTrackingMap;