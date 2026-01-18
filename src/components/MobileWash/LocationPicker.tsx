import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { 
  MapPin, 
  Search, 
  Navigation,
  Target,
  CheckCircle,
  X,
  Locate,
  Home,
  Building,
  MapPinIcon
} from "lucide-react";

interface LocationPickerProps {
  selectedLocation?: {
    address: string;
    coordinates: { lat: number; lng: number };
    district?: string;
  };
  onLocationSelect: (location: {
    address: string;
    coordinates: { lat: number; lng: number };
    district: string;
  }) => void;
  onClose?: () => void;
}

// مناطق الرياض المشهورة
const RIYADH_DISTRICTS = [
  { name: "العليا", lat: 24.7136, lng: 46.6753 },
  { name: "المربع", lat: 24.6408, lng: 46.7119 },
  { name: "الملز", lat: 24.6877, lng: 46.7219 },
  { name: "النسيم", lat: 24.7275, lng: 46.7718 },
  { name: "الشفا", lat: 24.7469, lng: 46.6281 },
  { name: "المونسية", lat: 24.7833, lng: 46.6167 },
  { name: "الحمراء", lat: 24.7000, lng: 46.8000 },
  { name: "الورود", lat: 24.8167, lng: 46.6333 },
  { name: "الملقا", lat: 24.7742, lng: 46.6398 },
  { name: "الدرعية", lat: 24.7394, lng: 46.5750 }
];

const LocationPicker: React.FC<LocationPickerProps> = ({
  selectedLocation,
  onLocationSelect,
  onClose
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(
    selectedLocation?.coordinates || null
  );
  const [selectedAddress, setSelectedAddress] = useState(selectedLocation?.address || "");
  const [selectedDistrict, setSelectedDistrict] = useState(selectedLocation?.district || "");
  const [mapClick, setMapClick] = useState<{ x: number; y: number } | null>(null);

  const filteredDistricts = RIYADH_DISTRICTS.filter(district =>
    district.name.includes(searchTerm)
  );

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Convert click position to approximate coordinates (simplified)
    const lat = 24.7136 + (50 - y) * 0.01; // Approximate mapping
    const lng = 46.6753 + (x - 50) * 0.015; // Approximate mapping
    
    setSelectedCoords({ lat, lng });
    setMapClick({ x, y });
    
    // Find nearest district
    const nearestDistrict = RIYADH_DISTRICTS.reduce((prev, curr) => {
      const prevDistance = Math.sqrt(Math.pow(prev.lat - lat, 2) + Math.pow(prev.lng - lng, 2));
      const currDistance = Math.sqrt(Math.pow(curr.lat - lat, 2) + Math.pow(curr.lng - lng, 2));
      return currDistance < prevDistance ? curr : prev;
    });
    
    setSelectedDistrict(nearestDistrict.name);
    setSelectedAddress(`${nearestDistrict.name}، الرياض`);
  };

  const handleDistrictSelect = (district: typeof RIYADH_DISTRICTS[0]) => {
    setSelectedCoords({ lat: district.lat, lng: district.lng });
    setSelectedDistrict(district.name);
    setSelectedAddress(`${district.name}، الرياض`);
    
    // Calculate map position for visual feedback
    const x = ((district.lng - 46.5) / 0.4) * 100; // Approximate mapping
    const y = 50 - ((district.lat - 24.6) / 0.3) * 100; // Approximate mapping
    setMapClick({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setSelectedCoords({ lat, lng });
          
          // Find nearest district
          const nearestDistrict = RIYADH_DISTRICTS.reduce((prev, curr) => {
            const prevDistance = Math.sqrt(Math.pow(prev.lat - lat, 2) + Math.pow(prev.lng - lng, 2));
            const currDistance = Math.sqrt(Math.pow(curr.lat - lat, 2) + Math.pow(curr.lng - lng, 2));
            return currDistance < prevDistance ? curr : prev;
          });
          
          setSelectedDistrict(nearestDistrict.name);
          setSelectedAddress(`${nearestDistrict.name}، الرياض - الموقع الحالي`);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  const handleConfirm = () => {
    if (selectedCoords && selectedAddress) {
      onLocationSelect({
        address: selectedAddress,
        coordinates: selectedCoords,
        district: selectedDistrict
      });
      onClose?.();
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Districts */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="البحث عن حي أو منطقة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" onClick={getCurrentLocation} className="shrink-0">
            <Locate className="h-4 w-4" />
          </Button>
        </div>

        {/* Popular Districts */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">الأحياء المشهورة</Label>
          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
            {filteredDistricts.map((district) => (
              <Button
                key={district.name}
                variant={selectedDistrict === district.name ? "default" : "outline"}
                size="sm"
                onClick={() => handleDistrictSelect(district)}
                className="justify-start h-auto p-2"
              >
                <Building className="h-3 w-3 ml-2" />
                {district.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            تحديد الموقع من الخريطة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            className="relative w-full h-80 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border-2 border-dashed border-gray-300 cursor-crosshair overflow-hidden"
            onClick={handleMapClick}
          >
            {/* Riyadh Map Background */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full relative">
                {/* Grid */}
                <div className="absolute inset-0 opacity-20">
                  <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
                    {Array.from({ length: 48 }).map((_, i) => (
                      <div key={i} className="border border-gray-300"></div>
                    ))}
                  </div>
                </div>
                
                {/* City Outline */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 300 200" className="w-3/4 h-3/4 opacity-30">
                    <path
                      d="M50 100 Q80 60 150 80 Q220 100 250 120 Q240 150 200 160 Q150 170 100 160 Q60 140 50 100 Z"
                      fill="currentColor"
                      className="text-primary"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </div>

                {/* District Markers */}
                {RIYADH_DISTRICTS.map((district, index) => {
                  const x = ((district.lng - 46.5) / 0.4) * 100;
                  const y = 50 - ((district.lat - 24.6) / 0.3) * 100;
                  
                  return (
                    <div
                      key={district.name}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                      style={{ 
                        left: `${Math.max(5, Math.min(95, x))}%`, 
                        top: `${Math.max(5, Math.min(95, y))}%` 
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDistrictSelect(district);
                      }}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 border-white shadow-lg ${
                        selectedDistrict === district.name 
                          ? 'bg-blue-500 scale-125' 
                          : 'bg-gray-400 hover:bg-blue-400'
                      } transition-all duration-200`}></div>
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs bg-black text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {district.name}
                      </div>
                    </div>
                  );
                })}

                {/* Selected Location Marker */}
                {mapClick && (
                  <div
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-bounce"
                    style={{ left: `${mapClick.x}%`, top: `${mapClick.y}%` }}
                  >
                    <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                      <MapPinIcon className="h-3 w-3 text-white" />
                    </div>
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent border-t-red-500"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Instructions */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 text-xs">
              <p className="font-medium">انقر على الخريطة لتحديد الموقع</p>
            </div>
          </div>

          {/* Selected Location Info */}
          {selectedCoords && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-blue-800">الموقع المحدد</h4>
                  <p className="text-sm text-blue-600 mt-1">{selectedAddress}</p>
                  <p className="text-xs text-blue-500 mt-1">
                    خط العرض: {selectedCoords.lat.toFixed(6)}, خط الطول: {selectedCoords.lng.toFixed(6)}
                  </p>
                </div>
                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                  محدد
                </Badge>
              </div>
            </div>
          )}

          {/* Manual Address Input */}
          <div className="mt-4 space-y-2">
            <Label>العنوان التفصيلي (اختياري)</Label>
            <Input
              placeholder="أدخل العنوان التفصيلي..."
              value={selectedAddress}
              onChange={(e) => setSelectedAddress(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <Button 
          onClick={handleConfirm}
          disabled={!selectedCoords || !selectedAddress}
          className="flex-1"
        >
          <CheckCircle className="h-4 w-4 ml-2" />
          تأكيد الموقع
        </Button>
        <Button variant="outline" onClick={onClose}>
          <X className="h-4 w-4 ml-2" />
          إلغاء
        </Button>
      </div>
    </div>
  );
};

export default LocationPicker;