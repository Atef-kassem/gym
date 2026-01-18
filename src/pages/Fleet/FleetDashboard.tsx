import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Truck, MapPin, AlertCircle, CheckCircle, Fuel, TrendingUp, 
  Filter, Download, Activity, Wrench, Users, DollarSign, Clock,
  Navigation, Gauge, AlertTriangle
} from "lucide-react";

const FleetDashboard = () => {
  const stats = {
    totalVehicles: 45,
    activeVehicles: 38,
    inRouteVehicles: 25,
    maintenanceVehicles: 7,
    idleVehicles: 6,
    totalDrivers: 42,
    activeDrivers: 38,
    totalFuelCost: 125000,
    avgFuelConsumption: 12.5,
    utilizationRate: 84.4,
    avgSpeed: 65
  };

  const vehicles = [
    { id: 1, name: "شاحنة 001", type: "شاحنة", status: "في الطريق", driver: "أحمد محمد", location: "القاهرة", fuel: 85 },
    { id: 2, name: "سيارة 002", type: "سيارة", status: "متاحة", driver: "-", location: "المستودع", fuel: 100 },
    { id: 3, name: "شاحنة 003", type: "شاحنة", status: "صيانة", driver: "-", location: "ورشة الصيانة", fuel: 0 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">لوحة تحكم المركبات</h1>
            <p className="text-gray-600 mt-1">نظرة شاملة على أسطول المركبات والتتبع</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              فلتر
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              تصدير
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-emerald-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>إجمالي المركبات</span>
                <Truck className="w-5 h-5 text-emerald-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600">{stats.totalVehicles}</div>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-green-500">{stats.activeVehicles} نشط</Badge>
                <Badge variant="outline">{stats.totalVehicles - stats.activeVehicles} غير نشط</Badge>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                <TrendingUp className="w-3 h-3 inline ml-1" />
                زيادة 3 مركبات هذا الشهر
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>في الطريق</span>
                <Navigation className="w-5 h-5 text-green-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.inRouteVehicles}</div>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-green-500">{stats.inRouteVehicles} في الخدمة</Badge>
                <Badge className="bg-amber-500">{stats.idleVehicles} متاحة</Badge>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                <Gauge className="w-3 h-3 inline ml-1" />
                متوسط السرعة: {stats.avgSpeed} كم/س
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>الصيانة</span>
                <Wrench className="w-5 h-5 text-red-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{stats.maintenanceVehicles}</div>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="destructive">{stats.maintenanceVehicles} تحتاج صيانة</Badge>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                <AlertTriangle className="w-3 h-3 inline ml-1" />
                يحتاج متابعة
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>السائقون</span>
                <Users className="w-5 h-5 text-blue-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.totalDrivers}</div>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-green-500">{stats.activeDrivers} نشط</Badge>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                <CheckCircle className="w-3 h-3 inline ml-1" />
                {stats.utilizationRate}% معدل الاستخدام
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-l-4 border-l-amber-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>تكلفة الوقود</span>
                <Fuel className="w-5 h-5 text-amber-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">{stats.totalFuelCost.toLocaleString()} ج.م</div>
              <p className="text-sm text-gray-500 mt-1">هذا الشهر</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-cyan-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>استهلاك الوقود</span>
                <Gauge className="w-5 h-5 text-cyan-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cyan-600">{stats.avgFuelConsumption} لتر/100كم</div>
              <Progress value={75} className="h-2 mt-2" />
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>معدل الاستخدام</span>
                <Activity className="w-5 h-5 text-purple-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.utilizationRate}%</div>
              <Progress value={stats.utilizationRate} className="h-2 mt-2" />
            </CardContent>
          </Card>
        </div>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-emerald-500" />
              حالة المركبات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {vehicles.map((vehicle) => (
                <div key={vehicle.id} className="p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{vehicle.name}</h4>
                    <Badge className={
                      vehicle.status === "في الطريق" ? "bg-green-500" :
                      vehicle.status === "متاحة" ? "bg-blue-500" : "bg-red-500"
                    }>
                      {vehicle.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{vehicle.type}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span>{vehicle.driver}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{vehicle.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Fuel className="w-4 h-4 text-gray-400" />
                      <span>الوقود: {vehicle.fuel}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FleetDashboard;

