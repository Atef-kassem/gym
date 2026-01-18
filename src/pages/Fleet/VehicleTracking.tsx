import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MapPin, Navigation, Clock, Fuel } from "lucide-react";

const VehicleTracking = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [vehicles] = useState([
    {
      id: 1,
      plateNumber: "أ ب ج 1234",
      driver: "أحمد محمد",
      location: "مدينة نصر",
      status: "في الطريق",
      speed: 60,
      destination: "المنطقة الصناعية",
      lastUpdate: "منذ 5 دقائق"
    },
    {
      id: 2,
      plateNumber: "د هـ و 5678",
      driver: "فاطمة علي",
      location: "المعادي",
      status: "متوقفة",
      speed: 0,
      destination: "المنطقة الصناعية",
      lastUpdate: "منذ 2 دقيقة"
    },
    {
      id: 3,
      plateNumber: "ز ح ط 9012",
      driver: "محمد حسن",
      location: "السادس من أكتوبر",
      status: "في الطريق",
      speed: 45,
      destination: "الشروق",
      lastUpdate: "منذ 10 دقائق"
    }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">تتبع المركبات</h1>
            <p className="text-gray-600 mt-1">تتبع موقع وحركة المركبات في الوقت الفعلي</p>
          </div>
          <div className="relative flex-1 md:w-64">
            <Input
              placeholder="البحث..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <Card key={vehicle.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Navigation className="w-5 h-5 text-emerald-600" />
                    {vehicle.plateNumber}
                  </CardTitle>
                  <Badge className={
                    vehicle.status === "في الطريق" ? "bg-blue-500" : "bg-gray-500"
                  }>
                    {vehicle.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="font-semibold">{vehicle.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>السائق: {vehicle.driver}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Navigation className="w-4 h-4 text-gray-500" />
                  <span>السرعة: {vehicle.speed} كم/س</span>
                </div>
                <div className="text-sm text-gray-600">
                  الوجهة: {vehicle.destination}
                </div>
                <div className="text-xs text-gray-500 pt-2 border-t">
                  آخر تحديث: {vehicle.lastUpdate}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VehicleTracking;

