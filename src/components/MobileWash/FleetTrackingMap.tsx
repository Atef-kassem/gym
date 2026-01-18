import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { MapPin, Navigation, Truck, Eye, Car, Clock } from "lucide-react";
import { useMobileWashData } from "@/hooks/useMobileWashData";

const FleetTrackingMap: React.FC = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const { fleet } = useMobileWashData();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'نشط': return 'bg-green-500';
      case 'متاح': return 'bg-blue-500';
      case 'صيانة': return 'bg-red-500';
      case 'غير متصل': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      {/* Map Container */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            خريطة التتبع المباشر
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative h-[500px] bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg overflow-hidden">
            {/* Saudi Arabia Map Background */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full relative bg-gradient-to-br from-slate-100 to-blue-100">
                {/* Grid Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="grid grid-cols-20 grid-rows-15 h-full w-full">
                    {Array.from({ length: 300 }).map((_, i) => (
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
                {fleet.map((vehicle, index) => {
                  const x = 20 + (index % 4) * 20; // Distribute horizontally
                  const y = 30 + Math.floor(index / 4) * 15; // Distribute vertically
                  
                  return (
                    <div
                      key={vehicle.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                      style={{ 
                        left: `${x}%`, 
                        top: `${y}%`,
                      }}
                      onClick={() => setSelectedVehicle(vehicle.id)}
                    >
                      <div className="relative">
                        <div className={`w-12 h-12 rounded-full shadow-lg border-2 border-white ${getStatusColor(vehicle.status?.operational)} flex items-center justify-center group-hover:scale-110 transition-all duration-200`}>
                          <Truck className="w-6 h-6 text-white" />
                        </div>
                        <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${vehicle.status?.operational === 'نشط' ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}></div>
                        
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                          {vehicle.name} - {vehicle.driver?.name}
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
                  <span>{fleet.filter(v => v.status?.operational === 'نشط').length} نشط</span>
                </div>
                <div className="flex items-center gap-1">
                  <Car className="h-4 w-4 text-blue-500" />
                  <span>{fleet.filter(v => v.status?.operational === 'متاح').length} متاح</span>
                </div>
                <div className="flex items-center gap-1">
                  <Car className="h-4 w-4 text-red-500" />
                  <span>{fleet.filter(v => v.status?.operational === 'صيانة').length} صيانة</span>
                </div>
              </div>
            </div>

            {/* Map Legend */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
              <h4 className="font-semibold text-sm mb-2">دليل الرموز</h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <span>مركبة نشطة</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                  <span>مركبة متاحة</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-500"></div>
                  <span>في الصيانة</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gray-500"></div>
                  <span>غير متصلة</span>
                </div>
              </div>
            </div>

            {/* Instruction Note */}
            <div className="absolute top-4 right-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 max-w-sm">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-yellow-600 mt-1 flex-shrink-0" />
                <div className="text-xs text-yellow-800">
                  <p className="font-semibold mb-1">تطوير الخريطة</p>
                  <p>هذه نسخة مبسطة من خريطة التتبع. للحصول على خريطة تفاعلية كاملة مع Mapbox، يرجى إضافة مفتاح Mapbox في الإعدادات.</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle List for Quick Access */}
      <Card>
        <CardHeader>
          <CardTitle>المركبات النشطة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {fleet.map((vehicle) => (
              <div
                key={vehicle.id}
                className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedVehicle === vehicle.id 
                    ? 'bg-primary/10 border-primary' 
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => setSelectedVehicle(selectedVehicle === vehicle.id ? null : vehicle.id)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(vehicle.status?.operational)}`} />
                  <div>
                    <p className="font-medium text-sm">{vehicle.name}</p>
                    <p className="text-xs text-muted-foreground">{vehicle.driver?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {vehicle.vehicle?.speed || 0} كم/س
                  </Badge>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Details */}
      {selectedVehicle && (
        <Card>
          <CardHeader>
            <CardTitle>تفاصيل المركبة المحددة</CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const vehicle = fleet.find(v => v.id === selectedVehicle);
              if (!vehicle) return <p>لم يتم العثور على المركبة</p>;
              
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">معلومات أساسية</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>الاسم:</strong> {vehicle.name}</p>
                      <p><strong>السائق:</strong> {vehicle.driver?.name}</p>
                      <p><strong>الهاتف:</strong> {vehicle.driver?.phone}</p>
                      <p><strong>الحالة التشغيلية:</strong> 
                        <Badge className={`ml-2 ${getStatusColor(vehicle.status?.operational)} text-white`}>
                          {vehicle.status?.operational}
                        </Badge>
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">إحصائيات المركبة</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>السرعة الحالية:</strong> {vehicle.vehicle?.speed || 0} كم/س</p>
                      <p><strong>مستوى الوقود:</strong> {vehicle.vehicle?.fuelLevel || 0}%</p>
                      <p><strong>المسافة المقطوعة:</strong> {vehicle.vehicle?.mileage?.toLocaleString() || 0} كم</p>
                      <p><strong>الموقع:</strong> {vehicle.location?.current?.address || 'غير محدد'}</p>
                    </div>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FleetTrackingMap;