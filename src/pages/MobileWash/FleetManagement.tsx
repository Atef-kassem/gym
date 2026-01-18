import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { EnhancedStatsCard } from "@/components/ui/enhanced-stats-card";
import { EnhancedTabs, TabsContent as EnhancedTabsContent } from "@/components/ui/enhanced-tabs";
import { 
  Truck, 
  MapPin, 
  Fuel, 
  Wrench, 
  User, 
  Phone, 
  Calendar,
  Plus,
  Search,
  Edit,
  Trash2,
  Navigation,
  AlertTriangle,
  CheckCircle,
  Activity,
  Clock,
  Target,
  DollarSign,
  TrendingUp,
  Eye,
  Loader2,
  BarChart3
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Line, LineChart, Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { useMobileWashData } from "@/hooks/useMobileWashData";
import FleetTrackingMap from "@/components/MobileWash/FleetTrackingMap";

export default function FleetManagement() {
  const { 
    fleet, 
    loading, 
    error,
    updateVehicleStatus,
    updateVehicleLocation,
    searchFleet 
  } = useMobileWashData();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isNewVehicleOpen, setIsNewVehicleOpen] = useState(false);
  const [isViewVehicleOpen, setIsViewVehicleOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const { toast } = useToast();

  const [newVehicle, setNewVehicle] = useState({
    name: "",
    make: "",
    model: "",
    year: "",
    plateNumber: "",
    driverName: "",
    driverPhone: "",
    driverLicense: ""
  });

  // Filter vehicles using the hook's search function
  const filteredVehicles = useMemo(() => {
    return searchFleet(searchTerm, { status: statusFilter });
  }, [searchFleet, searchTerm, statusFilter]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "نشط": { color: "bg-green-500", text: "نشط", icon: Activity },
      "متاح": { color: "bg-blue-500", text: "متاح", icon: CheckCircle },
      "صيانة": { color: "bg-red-500", text: "صيانة", icon: Wrench },
      "غير متصل": { color: "bg-gray-500", text: "غير متصل", icon: AlertTriangle }
    };
    const config = statusConfig[status] || { color: "bg-gray-500", text: "غير محدد", icon: AlertTriangle };
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.color} text-white`} variant="secondary">
        <Icon className="h-3 w-3 ml-1" />
        {config.text}
      </Badge>
    );
  };

  const getFuelLevelColor = (level: number) => {
    if (level > 50) return "text-green-500";
    if (level > 25) return "text-yellow-500";
    return "text-red-500";
  };

  const handleCreateVehicle = () => {
    // This would be implemented to add a new vehicle to the fleet
    toast({
      title: "ميزة قيد التطوير",
      description: "سيتم إضافة هذه الميزة قريباً",
    });
    setIsNewVehicleOpen(false);
  };

  const handleUpdateVehicleStatus = async (vehicleId: string, newStatus: string) => {
    try {
      await updateVehicleStatus(vehicleId, { operational: newStatus });
    } catch (error) {
      console.error('Error updating vehicle status:', error);
    }
  };

  const fleetStats = useMemo(() => {
    const totalVehicles = fleet.length;
    const activeVehicles = fleet.filter(v => v.status.operational === 'نشط').length;
    const maintenanceVehicles = fleet.filter(v => v.status.operational === 'صيانة').length;
    const averageFuel = fleet.reduce((sum, v) => sum + v.vehicle.fuelLevel, 0) / totalVehicles || 0;
    const totalRevenue = fleet.reduce((sum, v) => sum + v.performance.totalRevenue, 0);
    const totalServices = fleet.reduce((sum, v) => sum + v.performance.todayServices, 0);

    return {
      totalVehicles,
      activeVehicles,
      maintenanceVehicles,
      averageFuel: Math.round(averageFuel),
      totalRevenue,
      totalServices
    };
  }, [fleet]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              إدارة أسطول الكافية المتنقلة
            </h1>
            <p className="text-muted-foreground mt-2">
              إدارة شاملة للمركبات والسائقين مع التتبع المباشر
            </p>
          </div>

          <Dialog open={isNewVehicleOpen} onOpenChange={setIsNewVehicleOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                <Plus className="h-4 w-4 ml-2" />
                إضافة مركبة
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>إضافة مركبة جديدة</DialogTitle>
                <DialogDescription>
                  أدخل بيانات المركبة والسائق
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">بيانات المركبة</h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="vehicleName">اسم المركبة</Label>
                      <Input
                        id="vehicleName"
                        value={newVehicle.name}
                        onChange={(e) => setNewVehicle({...newVehicle, name: e.target.value})}
                        placeholder="مركبة الخدمة 5"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="make">الماركة</Label>
                        <Input
                          id="make"
                          value={newVehicle.make}
                          onChange={(e) => setNewVehicle({...newVehicle, make: e.target.value})}
                          placeholder="إسوزو"
                        />
                      </div>
                      <div>
                        <Label htmlFor="model">الموديل</Label>
                        <Input
                          id="model"
                          value={newVehicle.model}
                          onChange={(e) => setNewVehicle({...newVehicle, model: e.target.value})}
                          placeholder="NPR"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="year">السنة</Label>
                        <Input
                          id="year"
                          value={newVehicle.year}
                          onChange={(e) => setNewVehicle({...newVehicle, year: e.target.value})}
                          placeholder="2024"
                        />
                      </div>
                      <div>
                        <Label htmlFor="plateNumber">رقم اللوحة</Label>
                        <Input
                          id="plateNumber"
                          value={newVehicle.plateNumber}
                          onChange={(e) => setNewVehicle({...newVehicle, plateNumber: e.target.value})}
                          placeholder="أ ب ج 1234"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">بيانات السائق</h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="driverName">اسم السائق</Label>
                      <Input
                        id="driverName"
                        value={newVehicle.driverName}
                        onChange={(e) => setNewVehicle({...newVehicle, driverName: e.target.value})}
                        placeholder="أدخل اسم السائق"
                      />
                    </div>
                    <div>
                      <Label htmlFor="driverPhone">رقم الهاتف</Label>
                      <Input
                        id="driverPhone"
                        value={newVehicle.driverPhone}
                        onChange={(e) => setNewVehicle({...newVehicle, driverPhone: e.target.value})}
                        placeholder="05xxxxxxxx"
                      />
                    </div>
                    <div>
                      <Label htmlFor="driverLicense">رقم الرخصة</Label>
                      <Input
                        id="driverLicense"
                        value={newVehicle.driverLicense}
                        onChange={(e) => setNewVehicle({...newVehicle, driverLicense: e.target.value})}
                        placeholder="رقم رخصة القيادة"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNewVehicleOpen(false)}>
                  إلغاء
                </Button>
                <Button onClick={handleCreateVehicle}>
                  إضافة المركبة
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Enhanced Fleet Stats with Advanced Visual Effects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          <EnhancedStatsCard
            title="إجمالي المركبات"
            value={fleetStats.totalVehicles}
            icon={Truck}
            color="blue"
            index={0}
          />
          <EnhancedStatsCard
            title="المركبات النشطة"
            value={fleetStats.activeVehicles}
            subtitle={<span className="text-green-600 font-semibold">متصلة الآن</span>}
            icon={Activity}
            color="green"
            index={1}
          />
          <EnhancedStatsCard
            title="في الصيانة"
            value={fleetStats.maintenanceVehicles}
            subtitle="مركبات قيد الصيانة"
            icon={Wrench}
            color="orange"
            index={2}
          />
          <EnhancedStatsCard
            title="متوسط الوقود"
            value={`${fleetStats.averageFuel}%`}
            subtitle="مستوى الوقود العام"
            icon={Fuel}
            color="purple"
            index={3}
          />
          <EnhancedStatsCard
            title="إجمالي الإيرادات"
            value={`${fleetStats.totalRevenue.toLocaleString()} جنيه مصري`}
            subtitle={<span><span className="text-green-600 font-semibold">+15%</span> هذا الشهر</span>}
            icon={DollarSign}
            color="emerald"
            index={4}
          />
          <EnhancedStatsCard
            title="إجمالي الخدمات"
            value={fleetStats.totalServices}
            subtitle="خدمة اليوم"
            icon={Target}
            color="indigo"
            index={5}
          />
        </div>

        {/* Enhanced Main Fleet Management Tabs */}
        <EnhancedTabs
          items={[
            { value: "vehicles", label: "المركبات", icon: Truck, color: "blue" },
            { value: "tracking", label: "التتبع المباشر", icon: MapPin, color: "green" },
            { value: "performance", label: "الأداء والإحصائيات", icon: BarChart3, color: "purple" },
            { value: "maintenance", label: "الصيانة", icon: Wrench, color: "orange" }
          ]}
          defaultValue="vehicles"
          className="animate-fade-in"
        >

          <EnhancedTabsContent value="vehicles" className="space-y-6 animate-fade-in">
            {/* Search and Filters */}
            <Card>
              <CardHeader>
                <CardTitle>البحث والتصفية</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="البحث بالاسم، الرقم، السائق، أو لوحة المركبة..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pr-10"
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-48">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="جميع الحالات" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع الحالات</SelectItem>
                        <SelectItem value="نشط">نشط</SelectItem>
                        <SelectItem value="متاح">متاح</SelectItem>
                        <SelectItem value="صيانة">صيانة</SelectItem>
                        <SelectItem value="غير متصل">غير متصل</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Loading State */}
            {loading && (
              <Card>
                <CardContent className="flex items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin ml-2" />
                  <span>جاري تحميل بيانات الأسطول...</span>
                </CardContent>
              </Card>
            )}

            {/* Error State */}
            {error && (
              <Card>
                <CardContent className="flex items-center justify-center p-8 text-red-500">
                  <AlertTriangle className="h-8 w-8 ml-2" />
                  <span>حدث خطأ في تحميل البيانات: {error}</span>
                </CardContent>
              </Card>
            )}

            {/* Vehicles List */}
            {!loading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVehicles.map((vehicle) => (
                  <Card key={vehicle.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{vehicle.name}</CardTitle>
                        {getStatusBadge(vehicle.status.operational)}
                      </div>
                      <CardDescription>
                        السائق: {vehicle.driver.name} | اللوحة: {vehicle.details.plateNumber}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Location and Basic Info */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{vehicle.location.current.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4 text-muted-foreground" />
                          <span>{vehicle.details.make} {vehicle.details.model} ({vehicle.details.year})</span>
                        </div>
                      </div>

                      {/* Vehicle Stats */}
                      <div className="grid grid-cols-4 gap-4 text-center">
                        <div>
                          <div className={`text-lg font-bold ${getFuelLevelColor(vehicle.vehicle.fuelLevel)}`}>
                            {vehicle.vehicle.fuelLevel}%
                          </div>
                          <div className="text-xs text-muted-foreground">الوقود</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold">{vehicle.vehicle.speed}</div>
                          <div className="text-xs text-muted-foreground">كم/س</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold">{vehicle.performance.todayServices}</div>
                          <div className="text-xs text-muted-foreground">خدمات اليوم</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-yellow-500">{vehicle.performance.averageRating}</div>
                          <div className="text-xs text-muted-foreground">التقييم</div>
                        </div>
                      </div>

                      {/* Maintenance Info */}
                      <div className="border rounded-lg p-3 bg-muted/50">
                        <h4 className="font-medium text-sm mb-2">معلومات الصيانة</h4>
                        <div className="text-xs space-y-1">
                          <p><span className="font-medium">آخر صيانة:</span> {vehicle.maintenance.lastService}</p>
                          <p><span className="font-medium">الصيانة القادمة:</span> {vehicle.maintenance.nextService}</p>
                          <p><span className="font-medium">المسافة المقطوعة:</span> {vehicle.vehicle.mileage.toLocaleString()} كم</p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Phone className="h-4 w-4 ml-1" />
                          اتصال
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Navigation className="h-4 w-4 ml-1" />
                          تتبع
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => {
                            setSelectedVehicle(vehicle);
                            setIsViewVehicleOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4 ml-1" />
                          عرض
                        </Button>
                      </div>

                      {/* Status Update */}
                      <Select onValueChange={(value) => handleUpdateVehicleStatus(vehicle.id, value)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="تحديث الحالة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="نشط">نشط</SelectItem>
                          <SelectItem value="متاح">متاح</SelectItem>
                          <SelectItem value="صيانة">صيانة</SelectItem>
                          <SelectItem value="غير متصل">غير متصل</SelectItem>
                        </SelectContent>
                      </Select>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </EnhancedTabsContent>

          <EnhancedTabsContent value="tracking" className="space-y-6 animate-fade-in">
            <FleetTrackingMap />
          </EnhancedTabsContent>

          <EnhancedTabsContent value="performance" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>الإيرادات الشهرية</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={[]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>عدد الخدمات</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="services" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>استهلاك الوقود</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="fuel" fill="#ffc658" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>تكاليف الصيانة</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="maintenance" fill="#ff7300" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </EnhancedTabsContent>

          <EnhancedTabsContent value="maintenance" className="space-y-6 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>جدولة الصيانة</CardTitle>
                <CardDescription>متابعة صيانة المركبات والمعدات</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {fleet.map((vehicle) => (
                    <div key={vehicle.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Wrench className="h-5 w-5" />
                          <div>
                            <span className="font-medium">{vehicle.name}</span>
                            <p className="text-sm text-muted-foreground">
                              آخر صيانة: {vehicle.maintenance.lastService} | التالية: {vehicle.maintenance.nextService}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(vehicle.status.operational)}
                        <Button size="sm" variant="outline">
                          جدولة صيانة
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </EnhancedTabsContent>
        </EnhancedTabs>

        {/* Vehicle Details Dialog */}
        <Dialog open={isViewVehicleOpen} onOpenChange={setIsViewVehicleOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>تفاصيل المركبة - {selectedVehicle?.name}</DialogTitle>
              <DialogDescription>
                معلومات شاملة عن المركبة والأداء
              </DialogDescription>
            </DialogHeader>
            
            {selectedVehicle && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">معلومات أساسية</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">الرقم:</span> {selectedVehicle.id}</p>
                    <p><span className="font-medium">الاسم:</span> {selectedVehicle.name}</p>
                    <p><span className="font-medium">النوع:</span> {selectedVehicle.make} {selectedVehicle.model}</p>
                    <p><span className="font-medium">السنة:</span> {selectedVehicle.year}</p>
                    <p><span className="font-medium">رقم اللوحة:</span> {selectedVehicle.plateNumber}</p>
                    <p><span className="font-medium">الحالة:</span> {getStatusBadge(selectedVehicle.status)}</p>
                  </div>
                  
                  <h3 className="text-lg font-semibold">معلومات السائق</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">الاسم:</span> {selectedVehicle.driver.name}</p>
                    <p><span className="font-medium">الهاتف:</span> {selectedVehicle.driver.phone}</p>
                    <p><span className="font-medium">رقم الرخصة:</span> {selectedVehicle.driver.license}</p>
                    <p><span className="font-medium">الخبرة:</span> {selectedVehicle.driver.experience}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">الأداء والإحصائيات</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">عدد الخدمات المكتملة:</span> {selectedVehicle.servicesCompleted}</p>
                    <p><span className="font-medium">متوسط التقييم:</span> {selectedVehicle.averageRating}/5</p>
                    <p><span className="font-medium">إجمالي الإيرادات:</span> {selectedVehicle.totalRevenue.toLocaleString()} جنيه مصري</p>
                    <p><span className="font-medium">المسافة الشهرية:</span> {selectedVehicle.monthlyDistance} كم</p>
                    <p><span className="font-medium">المسافة اليومية:</span> {selectedVehicle.dailyDistance} كم</p>
                    <p><span className="font-medium">عداد المسافات:</span> {selectedVehicle.mileage.toLocaleString()} كم</p>
                  </div>
                  
                  <h3 className="text-lg font-semibold">الوقود والصيانة</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">مستوى الوقود:</span> {selectedVehicle.fuelLevel}%</p>
                    <p><span className="font-medium">آخر صيانة:</span> {selectedVehicle.lastMaintenance}</p>
                    <p><span className="font-medium">الصيانة التالية:</span> {selectedVehicle.nextMaintenance}</p>
                  </div>
                  
                  <h3 className="text-lg font-semibold">المعدات</h3>
                  <ul className="text-sm space-y-1">
                    {selectedVehicle.equipment.map((item, index) => (
                      <li key={index}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}