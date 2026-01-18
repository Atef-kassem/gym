import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { EnhancedStatsCard } from "@/components/ui/enhanced-stats-card";
import { EnhancedTabs, TabsContent as EnhancedTabsContent } from "@/components/ui/enhanced-tabs";
import { 
  Navigation2, 
  MapPin, 
  Clock, 
  Truck, 
  User, 
  Phone,
  Activity,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Play,
  Pause,
  Square,
  Route,
  Timer,
  Fuel,
  Target,
  Loader2,
  Battery,
  Gauge,
  Zap,
  Eye,
  Filter,
  Search,
  BarChart3,
  TrendingUp,
  Calendar,
  Users
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMobileWashData } from "@/hooks/useMobileWashData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import FleetTrackingMap from "@/components/MobileWash/FleetTrackingMap";

export default function LiveTracking() {
  const { 
    fleet, 
    bookings,
    loading, 
    error,
    updateVehicleLocation
  } = useMobileWashData();
  
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState("all");
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [autoRefreshTime, setAutoRefreshTime] = useState(0);
  const { toast } = useToast();

  // Auto refresh timer
  useEffect(() => {
    if (isLiveMode) {
      const interval = setInterval(() => {
        setAutoRefreshTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isLiveMode]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "في التنفيذ": { color: "from-orange-500 to-orange-600", icon: Activity, pulse: true },
      "في الطريق": { color: "from-blue-500 to-blue-600", icon: Navigation2, pulse: true },
      "متاح": { color: "from-green-500 to-green-600", icon: CheckCircle, pulse: false },
      "صيانة": { color: "from-red-500 to-red-600", icon: AlertTriangle, pulse: true },
      "مجدول": { color: "from-purple-500 to-purple-600", icon: Clock, pulse: false },
      "نشط": { color: "from-emerald-500 to-emerald-600", icon: Zap, pulse: true }
    };
    const config = statusConfig[status] || { color: "from-gray-500 to-gray-600", icon: Clock, pulse: false };
    const Icon = config.icon;
    
    return (
      <Badge className={`bg-gradient-to-r ${config.color} text-white border-0 shadow-lg ${config.pulse ? 'animate-pulse' : ''}`}>
        <Icon className="h-3 w-3 ml-1" />
        {status}
      </Badge>
    );
  };

  const handleRefreshData = () => {
    setAutoRefreshTime(0);
    toast({
      title: "🔄 تم تحديث البيانات",
      description: "تم تحديث بيانات التتبع المباشر بنجاح",
    });
  };

  const handleEmergencyStop = (vehicleId: string) => {
    toast({
      title: "🚨 إيقاف طارئ",
      description: `تم إرسال إشارة إيقاف طارئ للمركبة ${vehicleId}`,
      variant: "destructive"
    });
  };

  const handleVehicleCall = (phone: string, vehicleName: string) => {
    toast({
      title: "📞 جاري الاتصال",
      description: `يتم الاتصال بسائق ${vehicleName}...`,
    });
  };

  // Filter vehicles based on search and status
  const filteredVehicles = useMemo(() => {
    let vehicles = selectedVehicle === "all" ? fleet : fleet.filter(v => v.id === selectedVehicle);
    
    if (filterStatus !== "all") {
      vehicles = vehicles.filter(v => v.status.operational === filterStatus);
    }
    
    if (searchQuery) {
      vehicles = vehicles.filter(v => 
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.driver.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return vehicles;
  }, [fleet, selectedVehicle, filterStatus, searchQuery]);

  const activeVehicles = fleet.filter(v => v.status.operational === "نشط");
  const availableVehicles = fleet.filter(v => v.status.availability === "متاح");
  const maintenanceVehicles = fleet.filter(v => v.status.operational === "صيانة");
  
  // Get upcoming bookings (next 2 hours)
  const upcomingBookings = bookings.filter(booking => {
    const now = new Date();
    const bookingTime = new Date(`${booking.scheduling.date}T${booking.scheduling.time}`);
    const diffHours = (bookingTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    return diffHours >= 0 && diffHours <= 2 && booking.status === "مجدول";
  });

  // Calculate fleet performance metrics
  const fleetMetrics = useMemo(() => {
    const totalVehicles = fleet.length;
    const averageFuel = fleet.reduce((sum, v) => sum + v.vehicle.fuelLevel, 0) / totalVehicles || 0;
    const averageSpeed = fleet.filter(v => v.vehicle.speed > 0).reduce((sum, v) => sum + v.vehicle.speed, 0) / 
                        fleet.filter(v => v.vehicle.speed > 0).length || 0;
    const totalServices = fleet.reduce((sum, v) => sum + v.performance.todayServices, 0);
    
    return {
      totalVehicles,
      averageFuel: Math.round(averageFuel),
      averageSpeed: Math.round(averageSpeed),
      totalServices,
      efficiency: Math.round((activeVehicles.length / totalVehicles) * 100)
    };
  }, [fleet, activeVehicles]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Enhanced Header with Live Indicators */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-background border border-primary/20 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-50" />
          <div className="relative p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Navigation2 className="h-8 w-8 text-primary" />
                    {isLiveMode && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping" />
                    )}
                  </div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    التتبع المباشر للأسطول
                  </h1>
                  {isLiveMode && (
                    <Badge className="bg-green-500/20 text-green-700 border-green-500/30 animate-pulse">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
                      مباشر
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground">
                  متابعة حية لجميع المركبات والخدمات في الوقت الفعلي
                </p>
                {isLiveMode && (
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <RefreshCw className="h-3 w-3" />
                    آخر تحديث منذ {Math.floor(autoRefreshTime / 60)}:{(autoRefreshTime % 60).toString().padStart(2, '0')} دقيقة
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant={isLiveMode ? "default" : "outline"}
                  onClick={() => setIsLiveMode(!isLiveMode)}
                  className={`flex items-center gap-2 transition-all duration-300 ${
                    isLiveMode 
                      ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg shadow-green-500/25' 
                      : 'hover:scale-105'
                  }`}
                >
                  {isLiveMode ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {isLiveMode ? "إيقاف التحديث" : "تشغيل التحديث"}
                </Button>
                
                <Button 
                  onClick={handleRefreshData} 
                  variant="outline"
                  className="hover:scale-105 transition-all duration-300 hover:shadow-lg"
                >
                  <RefreshCw className="h-4 w-4 ml-2" />
                  تحديث
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <Card className="animate-fade-in">
            <CardContent className="flex items-center justify-center p-12">
              <div className="text-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
                <div className="space-y-2">
                  <p className="text-lg font-medium">جاري تحميل بيانات التتبع</p>
                  <p className="text-sm text-muted-foreground">يرجى الانتظار...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Card className="border-red-200 bg-red-50/50 animate-fade-in">
            <CardContent className="flex items-center justify-center p-8">
              <div className="text-center space-y-4">
                <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
                <div className="space-y-2">
                  <p className="text-lg font-medium text-red-700">حدث خطأ في تحميل البيانات</p>
                  <p className="text-sm text-red-600">{error}</p>
                  <Button onClick={handleRefreshData} variant="outline" className="mt-4">
                    إعادة المحاولة
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Live Stats with Advanced Visual Effects */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <EnhancedStatsCard
              title="المركبات النشطة"
              value={activeVehicles.length}
              subtitle={<span className="text-green-600 font-semibold">متصلة الآن</span>}
              icon={Activity}
              color="green"
              index={0}
            />
            <EnhancedStatsCard
              title="المركبات المتاحة"
              value={availableVehicles.length}
              subtitle="جاهزة للخدمة"
              icon={CheckCircle}
              color="blue"
              index={1}
            />
            <EnhancedStatsCard
              title="في الصيانة"
              value={maintenanceVehicles.length}
              subtitle="تحتاج صيانة"
              icon={AlertTriangle}
              color="orange"
              index={2}
            />
            <EnhancedStatsCard
              title="معدل الوقود"
              value={`${fleetMetrics.averageFuel}%`}
              subtitle={<span><span className="text-blue-600 font-semibold">{fleetMetrics.averageSpeed}</span> كم/س متوسط</span>}
              icon={Fuel}
              color="purple"
              index={3}
            />
            <EnhancedStatsCard
              title="الخدمات اليوم"
              value={fleetMetrics.totalServices}
              subtitle={<span><span className="text-green-600 font-semibold">{fleetMetrics.efficiency}%</span> كفاءة</span>}
              icon={Target}
              color="emerald"
              index={4}
            />
          </div>
        )}

        {/* Enhanced Search and Filter Controls */}
        {!loading && !error && (
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                البحث والتصفية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="البحث بالاسم، السائق، أو رقم المركبة..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="تصفية حسب الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الحالات</SelectItem>
                    <SelectItem value="نشط">نشط</SelectItem>
                    <SelectItem value="متاح">متاح</SelectItem>
                    <SelectItem value="في التنفيذ">في التنفيذ</SelectItem>
                    <SelectItem value="في الطريق">في الطريق</SelectItem>
                    <SelectItem value="صيانة">صيانة</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="اختر المركبة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع المركبات</SelectItem>
                    {fleet.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Main Tracking Interface */}
        {!loading && !error && (
          <EnhancedTabs
            items={[
              { value: "map", label: "الخريطة المباشرة", icon: MapPin, color: "blue" },
              { value: "vehicles", label: "حالة المركبات", icon: Truck, color: "green" },
              { value: "routes", label: "المسارات والأوقات", icon: Route, color: "purple" },
              { value: "upcoming", label: "البيع القادمة", icon: Calendar, color: "orange" },
              { value: "analytics", label: "الإحصائيات", icon: BarChart3, color: "indigo" }
            ]}
            defaultValue="map"
            className="animate-fade-in"
          >

            <EnhancedTabsContent value="map" className="space-y-6">
              <FleetTrackingMap />
            </EnhancedTabsContent>

            <EnhancedTabsContent value="vehicles" className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredVehicles.map((vehicle, index) => (
                  <Card 
                    key={vehicle.id} 
                    className="group hover:shadow-xl transition-all duration-500 hover:scale-[1.02] border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                              <Truck className="h-6 w-6 text-white" />
                            </div>
                            <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                              vehicle.status.operational === 'نشط' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                            }`} />
                          </div>
                          <div>
                            <CardTitle className="text-lg group-hover:text-primary transition-colors">
                              {vehicle.name}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2">
                              <User className="h-3 w-3" />
                              {vehicle.driver.name}
                            </CardDescription>
                          </div>
                        </div>
                        {getStatusBadge(vehicle.status.operational)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Enhanced Location Display */}
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">{vehicle.location.current.address}</span>
                      </div>

                      {/* Current Booking with Enhanced Styling */}
                      {vehicle.status.currentBooking && (
                        <div className="border-l-4 border-primary rounded-lg p-3 bg-primary/5 backdrop-blur-sm">
                          <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                            <Activity className="h-4 w-4 text-primary" />
                            الخدمة الحالية
                          </h4>
                          <div className="space-y-1 text-xs">
                            <p><span className="font-medium">رقم الحجز:</span> {vehicle.status.currentBooking}</p>
                            <p><span className="font-medium">الحالة:</span> {vehicle.status.operational}</p>
                          </div>
                        </div>
                      )}

                      {/* Enhanced Vehicle Stats with Progress Bars */}
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center space-y-2">
                          <div className="relative">
                            <Progress value={vehicle.vehicle.fuelLevel} className="h-2" />
                            <Fuel className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-3 w-3 text-white" />
                          </div>
                          <div className="text-lg font-bold">{vehicle.vehicle.fuelLevel}%</div>
                          <div className="text-xs text-muted-foreground">الوقود</div>
                        </div>
                        <div className="text-center space-y-2">
                          <div className="flex items-center justify-center h-8 w-8 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-blue-600">
                            <Gauge className="h-4 w-4 text-white" />
                          </div>
                          <div className="text-lg font-bold">{vehicle.vehicle.speed}</div>
                          <div className="text-xs text-muted-foreground">كم/س</div>
                        </div>
                        <div className="text-center space-y-2">
                          <div className="flex items-center justify-center h-8 w-8 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-purple-600">
                            <BarChart3 className="h-4 w-4 text-white" />
                          </div>
                          <div className="text-lg font-bold">{vehicle.vehicle.mileage.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">كم إجمالي</div>
                        </div>
                      </div>

                      {/* Enhanced Action Buttons */}
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 hover:scale-105 transition-all duration-300 hover:shadow-lg"
                          onClick={() => handleVehicleCall(vehicle.driver.phone, vehicle.name)}
                        >
                          <Phone className="h-4 w-4 ml-1" />
                          اتصال
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 hover:scale-105 transition-all duration-300 hover:shadow-lg"
                        >
                          <Eye className="h-4 w-4 ml-1" />
                          تتبع
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          className="flex-1 hover:scale-105 transition-all duration-300 hover:shadow-lg"
                          onClick={() => handleEmergencyStop(vehicle.id)}
                        >
                          <Square className="h-4 w-4 ml-1" />
                          إيقاف طارئ
                        </Button>
                      </div>

                      <div className="text-xs text-muted-foreground flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        آخر تحديث: {vehicle.location.lastUpdate}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </EnhancedTabsContent>

            <EnhancedTabsContent value="routes" className="space-y-6 animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Route className="h-5 w-5" />
                    المسارات والأوقات
                  </CardTitle>
                  <CardDescription>تفاصيل مسارات المركبات وأوقات الوصول المتوقعة</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredVehicles.map((vehicle, index) => (
                      <div 
                        key={vehicle.id} 
                        className="border rounded-xl p-4 hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-card to-card/50 animate-fade-in"
                        style={{ animationDelay: `${index * 150}ms` }}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                              <Truck className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <span className="font-medium text-lg">{vehicle.name}</span>
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {vehicle.driver.name}
                              </p>
                            </div>
                          </div>
                          {getStatusBadge(vehicle.status.operational)}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                            <MapPin className="h-5 w-5 text-primary" />
                            <div>
                              <p className="font-medium text-sm">الموقع الحالي</p>
                              <p className="text-muted-foreground text-xs">{vehicle.location.current.address}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                            <Target className="h-5 w-5 text-green-500" />
                            <div>
                              <p className="font-medium text-sm">الحالة</p>
                              <p className="text-muted-foreground text-xs">{vehicle.status.availability}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                            <Fuel className="h-5 w-5 text-blue-500" />
                            <div>
                              <p className="font-medium text-sm">الوقود المتبقي</p>
                              <div className="flex items-center gap-2">
                                <Progress value={vehicle.vehicle.fuelLevel} className="h-1 flex-1" />
                                <span className="text-xs">{vehicle.vehicle.fuelLevel}%</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                            <Gauge className="h-5 w-5 text-purple-500" />
                            <div>
                              <p className="font-medium text-sm">السرعة الحالية</p>
                              <p className="text-muted-foreground text-xs">{vehicle.vehicle.speed} كم/س</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </EnhancedTabsContent>

            <EnhancedTabsContent value="upcoming" className="space-y-6 animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    البيع القادمة
                  </CardTitle>
                  <CardDescription>البيع المجدولة خلال الساعات القادمة</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingBookings.length > 0 ? (
                      upcomingBookings.map((booking, index) => (
                        <div 
                          key={booking.id} 
                          className="flex items-center justify-between p-4 border rounded-xl hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-card to-card/50 animate-fade-in"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3 bg-primary/10 p-3 rounded-lg">
                              <Clock className="h-5 w-5 text-primary" />
                              <div>
                                <span className="font-medium text-lg">{booking.scheduling.time}</span>
                                <p className="text-xs text-muted-foreground">{booking.scheduling.date}</p>
                              </div>
                            </div>
                            <div>
                              <span className="font-medium text-lg">{booking.customerName}</span>
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {booking.location.address}
                              </p>
                            </div>
                            <div className="hidden md:block">
                              <span className="text-sm font-medium">{booking.serviceDetails.type}</span>
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Truck className="h-3 w-3" />
                                المركبة: {booking.assignment.vehicleId}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {getStatusBadge(booking.status)}
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="hover:scale-105 transition-all duration-300"
                            >
                              تفاصيل
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-lg font-medium text-muted-foreground">لا توجد حجوزات قادمة</p>
                        <p className="text-sm text-muted-foreground">جميع المركبات متاحة للحجوزات الجديدة</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </EnhancedTabsContent>

            <EnhancedTabsContent value="analytics" className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      أداء الأسطول
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>كفاءة التشغيل</span>
                        <span className="font-bold">{fleetMetrics.efficiency}%</span>
                      </div>
                      <Progress value={fleetMetrics.efficiency} className="h-2" />
                      
                      <div className="flex items-center justify-between">
                        <span>متوسط استهلاك الوقود</span>
                        <span className="font-bold">{fleetMetrics.averageFuel}%</span>
                      </div>
                      <Progress value={fleetMetrics.averageFuel} className="h-2" />
                      
                      <div className="flex items-center justify-between">
                        <span>متوسط السرعة</span>
                        <span className="font-bold">{fleetMetrics.averageSpeed} كم/س</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      إحصائيات اليوم
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>إجمالي الخدمات</span>
                        <span className="font-bold text-green-600">{fleetMetrics.totalServices}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>المركبات النشطة</span>
                        <span className="font-bold text-blue-600">{activeVehicles.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>في الصيانة</span>
                        <span className="font-bold text-orange-600">{maintenanceVehicles.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>إجمالي المركبات</span>
                        <span className="font-bold">{fleet.length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </EnhancedTabsContent>
          </EnhancedTabs>
        )}
      </div>
    </div>
  );
}