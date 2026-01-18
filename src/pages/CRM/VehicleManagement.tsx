import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BranchSelector } from "@/components/BranchSelector";
import { 
  Car, 
  Search, 
  Plus, 
  Filter,
  Eye,
  Edit,
  Trash2,
  Settings,
  Download,
  Upload,
  Grid3X3,
  List,
  TrendingUp,
  Gauge,
  Wrench,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Palette,
  Truck,
  Calculator,
  Zap,
  Battery,
  Fuel,
  RotateCcw,
  Cog,
  Bot,
  Sparkles
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VehicleManagementCard } from "@/components/CRM/VehicleManagementCard";
import { VehicleDetailsDialog } from "@/components/CRM/VehicleDetailsDialog";
import { VehicleStatsCard } from "@/components/CRM/VehicleStatsCard";
import { AddVehicleDialog } from "@/components/CRM/AddVehicleDialog";
import { AddBrandDialog } from "@/components/CRM/AddBrandDialog";
import { AddModelDialog } from "@/components/CRM/AddModelDialog";
import { AddVehicleTypeDialog } from "@/components/CRM/AddVehicleTypeDialog";
import { AddColorDialog } from "@/components/CRM/AddColorDialog";
import { AddFuelTypeDialog } from "@/components/CRM/AddFuelTypeDialog";
import { AddTransmissionDialog } from "@/components/CRM/AddTransmissionDialog";
import { AIVehicleAssistant } from "@/components/CRM/AIVehicleAssistant";
import { useToast } from "@/hooks/use-toast";
import { useCustomerStore } from '@/hooks/useCustomerStore';
import { useGetVehiclesQuery } from '@/services/vehiclesApi';
import { Car as VehicleType } from '@/types/customer';

export default function VehicleManagement() {
  const { toast } = useToast();
  const { customers } = useCustomerStore();
  const { data: vehiclesResp } = useGetVehiclesQuery({ limit: 500 });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [isAddBrandOpen, setIsAddBrandOpen] = useState(false);
  const [isAddModelOpen, setIsAddModelOpen] = useState(false);
  const [isAddVehicleTypeOpen, setIsAddVehicleTypeOpen] = useState(false);
  const [isAddColorOpen, setIsAddColorOpen] = useState(false);
  const [isAddFuelTypeOpen, setIsAddFuelTypeOpen] = useState(false);
  const [isAddTransmissionOpen, setIsAddTransmissionOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('plate');
  const [viewMode, setViewMode] = useState('cards');

  // حالة لإدارة البيانات المحلية
  const [brands, setBrands] = useState([
    { id: 'toyota', name: 'تويوتا', logo: '/lovable-uploads/68798d48-6d3d-474b-88f2-7810b46a81cc.png' },
    { id: 'honda', name: 'هوندا', logo: null },
    { id: 'nissan', name: 'نيسان', logo: null },
    { id: 'hyundai', name: 'هيونداي', logo: null },
    { id: 'kia', name: 'كيا', logo: null },
    { id: 'chevrolet', name: 'شيفروليه', logo: null },
    { id: 'ford', name: 'فورد', logo: null },
    { id: 'bmw', name: 'بي إم دبليو', logo: null }
  ]);

  const [models, setModels] = useState([
    { id: 'camry', name: 'كامري', brand: 'تويوتا', type: 'سيدان' },
    { id: 'accord', name: 'أكورد', brand: 'هوندا', type: 'سيدان' },
    { id: 'altima', name: 'التيما', brand: 'نيسان', type: 'سيدان' },
    { id: 'elantra', name: 'النترا', brand: 'هيونداي', type: 'سيدان' },
    { id: 'optima', name: 'أوبتيما', brand: 'كيا', type: 'سيدان' },
    { id: 'cruze', name: 'كروز', brand: 'شيفروليه', type: 'سيدان' },
    { id: 'fusion', name: 'فيوجن', brand: 'فورد', type: 'سيدان' },
    { id: '320i', name: '320i', brand: 'بي إم دبليو', type: 'سيدان' }
  ]);

  const [vehicleTypes, setVehicleTypes] = useState([
    { id: 'sedan', name: 'سيدان' },
    { id: 'suv', name: 'دفع رباعي' },
    { id: 'hatchback', name: 'هاتشباك' },
    { id: 'pickup', name: 'بيك آب' },
    { id: 'coupe', name: 'كوبيه' },
    { id: 'convertible', name: 'كابريوليه' },
    { id: 'minivan', name: 'ميني فان' },
    { id: 'truck', name: 'شاحنة' }
  ]);

  const [colors, setColors] = useState([
    { id: 'white', name: 'أبيض', hex: '#FFFFFF' },
    { id: 'black', name: 'أسود', hex: '#000000' },
    { id: 'silver', name: 'فضي', hex: '#C0C0C0' },
    { id: 'gray', name: 'رمادي', hex: '#808080' },
    { id: 'red', name: 'أحمر', hex: '#FF0000' },
    { id: 'blue', name: 'أزرق', hex: '#0000FF' },
    { id: 'green', name: 'أخضر', hex: '#008000' },
    { id: 'brown', name: 'بني', hex: '#A52A2A' }
  ]);

  const [fuelTypes, setFuelTypes] = useState([
    { id: 'gasoline', name: 'بنزين' },
    { id: 'diesel', name: 'ديزل' },
    { id: 'hybrid', name: 'هايبرد' },
    { id: 'electric', name: 'كهربائي' },
    { id: 'lpg', name: 'غاز' },
    { id: 'cng', name: 'غاز طبيعي' }
  ]);

  const [transmissions, setTransmissions] = useState([
    { id: 'automatic', name: 'أوتوماتيك' },
    { id: 'manual', name: 'يدوي' },
    { id: 'cvt', name: 'CVT' },
    { id: 'dual-clutch', name: 'دبل كلاتش' }
  ]);

  // وظائف إدارة الماركات
  const handleEditBrand = (brand: any) => {
    console.log('🏷️ تعديل الماركة:', brand);
    setIsAddBrandOpen(true); // سيتم استخدام نفس النافذة للتعديل مؤقتاً
    toast({
      title: "تعديل الماركة",
      description: `سيتم فتح نموذج تعديل ماركة ${brand.name}`,
    });
  };

  const handleDeleteBrand = (brand: any) => {
    console.log('🗑️ حذف الماركة:', brand);
    setBrands(brands.filter(b => b.id !== brand.id));
    toast({
      title: "حذف الماركة",
      description: `تم حذف ماركة ${brand.name} بنجاح`,
      variant: "destructive"
    });
  };

  // وظائف إدارة الموديلات
  const handleEditModel = (model: any) => {
    console.log('📱 تعديل الموديل:', model);
    setIsAddModelOpen(true); // سيتم استخدام نفس النافذة للتعديل مؤقتاً
    toast({
      title: "تعديل الموديل",
      description: `سيتم فتح نموذج تعديل موديل ${model.name}`,
    });
  };

  const handleDeleteModel = (model: any) => {
    console.log('🗑️ حذف الموديل:', model);
    setModels(models.filter(m => m.id !== model.id));
    toast({
      title: "حذف الموديل",
      description: `تم حذف موديل ${model.name} بنجاح`,
      variant: "destructive"
    });
  };

  // وظائف إدارة أنواع المركبات
  const handleEditVehicleType = (type: any) => {
    console.log('🚛 تعديل نوع المركبة:', type);
    setIsAddVehicleTypeOpen(true); // سيتم استخدام نفس النافذة للتعديل مؤقتاً
    toast({
      title: "تعديل نوع المركبة",
      description: `سيتم فتح نموذج تعديل نوع ${type.name}`,
    });
  };

  const handleDeleteVehicleType = (type: any) => {
    console.log('🗑️ حذف نوع المركبة:', type);
    setVehicleTypes(vehicleTypes.filter(t => t.id !== type.id));
    toast({
      title: "حذف نوع المركبة",
      description: `تم حذف نوع ${type.name} بنجاح`,
      variant: "destructive"
    });
  };

  // وظائف إدارة الألوان
  const handleEditColor = (color: any) => {
    console.log('🎨 تعديل اللون:', color);
    setIsAddColorOpen(true); // سيتم استخدام نفس النافذة للتعديل مؤقتاً
    toast({
      title: "تعديل اللون",
      description: `سيتم فتح نموذج تعديل لون ${color.name}`,
    });
  };

  const handleDeleteColor = (color: any) => {
    console.log('🗑️ حذف اللون:', color);
    setColors(colors.filter(c => c.id !== color.id));
    toast({
      title: "حذف اللون",
      description: `تم حذف لون ${color.name} بنجاح`,
      variant: "destructive"
    });
  };

  // وظائف إدارة أنواع الوقود
  const handleEditFuelType = (fuel: any) => {
    console.log('⛽ تعديل نوع الوقود:', fuel);
    setIsAddFuelTypeOpen(true); // سيتم استخدام نفس النافذة للتعديل مؤقتاً
    toast({
      title: "تعديل نوع الوقود",
      description: `سيتم فتح نموذج تعديل نوع الوقود ${fuel.name}`,
    });
  };

  const handleDeleteFuelType = (fuel: any) => {
    console.log('🗑️ حذف نوع الوقود:', fuel);
    setFuelTypes(fuelTypes.filter(f => f.id !== fuel.id));
    toast({
      title: "حذف نوع الوقود",
      description: `تم حذف نوع الوقود ${fuel.name} بنجاح`,
      variant: "destructive"
    });
  };

  // وظائف إدارة أنواع ناقل الحركة
  const handleEditTransmission = (transmission: any) => {
    console.log('⚙️ تعديل ناقل الحركة:', transmission);
    setIsAddTransmissionOpen(true); // سيتم استخدام نفس النافذة للتعديل مؤقتاً
    toast({
      title: "تعديل ناقل الحركة",
      description: `سيتم فتح نموذج تعديل ناقل الحركة ${transmission.name}`,
    });
  };

  const handleDeleteTransmission = (transmission: any) => {
    console.log('🗑️ حذف ناقل الحركة:', transmission);
    setTransmissions(transmissions.filter(t => t.id !== transmission.id));
    toast({
      title: "حذف ناقل الحركة",
      description: `تم حذف ناقل الحركة ${transmission.name} بنجاح`,
      variant: "destructive"
    });
  };

  // استخراج جميع المركبات من العملاء
  const allVehicles = useMemo(() => {
    const apiVehicles = (vehiclesResp?.data as any[]) || [];
    return apiVehicles.map((v) => ({
      ...v,
      customerName: v?.customer?.name,
      customerId: v?.customer?.id,
      customerPhone: v?.customer?.phone,
      status: 'active',
      nextMaintenanceDate: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
      mileage: Math.floor(Math.random() * 200000),
      image: '/lovable-uploads/68798d48-6d3d-474b-88f2-7810b46a81cc.png'
    }));
  }, [vehiclesResp]);

  // إحصائيات المركبات
  const vehicleStats = useMemo(() => {
    const total = allVehicles.length;
    const active = allVehicles.filter(v => v.status === 'active').length;
    const maintenance = allVehicles.filter(v => v.status === 'maintenance').length;
    const brands = [...new Set(allVehicles.map(v => v.make))].length;
    const vehicleTypes = [...new Set(allVehicles.map(v => v.vehicleType || 'مشروب'))].length;

    return { total, active, maintenance, brands, vehicleTypes };
  }, [allVehicles]);

  // تصفية وترتيب المركبات
  const filteredVehicles = allVehicles
    .filter(vehicle => {
      const matchesSearch = 
        vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.customerName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterBy === 'all' || vehicle.status === filterBy;
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'plate':
          return a.plate.localeCompare(b.plate);
        case 'make':
          return a.make.localeCompare(b.make);
        case 'customer':
          return a.customerName.localeCompare(b.customerName, 'ar');
        case 'mileage':
          return b.mileage - a.mileage;
        default:
          return 0;
      }
    });

  const handleViewVehicle = (vehicle: any) => {
    console.log('🚗 عرض تفاصيل المركبة:', vehicle);
    console.log('🔍 حالة نافذة التفاصيل قبل:', isDetailsOpen);
    setSelectedVehicle(vehicle);
    setIsDetailsOpen(true);
    console.log('✅ تم تعيين نافذة التفاصيل للفتح');
  };

  const handleEditVehicle = (vehicle: any) => {
    console.log('✏️ تعديل المركبة:', vehicle);
    console.log('📝 فتح نافذة إضافة مركبة للتعديل (مؤقتاً)');
    setIsAddVehicleOpen(true); // سيتم استخدام نفس النافذة للتعديل مؤقتاً
    toast({
      title: "تعديل بيانات المركبة",
      description: `سيتم فتح نموذج تعديل بيانات المركبة ${vehicle.plate}`,
    });
  };

  const handleDeleteVehicle = (vehicle: any) => {
    console.log('🗑️ حذف المركبة:', vehicle);
    toast({
      title: "حذف المركبة",
      description: `تم حذف المركبة ${vehicle.plate} بنجاح`,
      variant: "destructive"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 p-6 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between animate-slide-down">
          <div className="group">
            <h1 className="text-3xl font-bold text-gray-900 text-right transition-all duration-300 group-hover:text-blue-600">
              نظام إدارة المركبات المتكامل
            </h1>
            <p className="text-gray-600 mt-2 text-right transition-all duration-300 group-hover:text-blue-500">إدارة شاملة للمركبات ومتابعة البيانات التقنية</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="default" 
              className="bg-gradient-to-r from-[hsl(217,85%,27%)] to-[hsl(195,100%,60%)] hover:from-[hsl(217,85%,22%)] hover:to-[hsl(195,100%,55%)] text-white shadow-[var(--shadow-elegant)] hover:shadow-[var(--shadow-cyan)] transition-all duration-300 hover:scale-105 hover-scale"
              onClick={() => setIsAddVehicleOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2 transition-transform group-hover:rotate-90" />
              إضافة مركبة جديدة
            </Button>
          </div>
        </div>

        {/* إحصائيات المركبات */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <VehicleStatsCard
            title="العلامات الأكثر شيوعاً"
            value={vehicleStats.brands > 0 ? `${vehicleStats.brands}` : "غير محدد"}
            icon={Palette}
            color="text-orange-600"
            subtitle="في النظام"
          />
          <VehicleStatsCard
            title="أنواع المركبات"
            value={vehicleStats.vehicleTypes}
            icon={Truck}
            color="text-purple-600"
            subtitle="أنواع مختلفة"
          />
          <VehicleStatsCard
            title="المركبات المتاحة"
            value={vehicleStats.active}
            icon={CheckCircle}
            color="text-green-600"
            subtitle="متوفر 360"
          />
          <VehicleStatsCard
            title="إجمالي المركبات"
            value={vehicleStats.total}
            icon={Car}
            color="text-blue-600"
            subtitle="0 مركبة نشطة"
            trend={{ value: 12, isPositive: true }}
          />
        </div>

        {/* التبويبات */}
        <Tabs defaultValue="vehicles" className="w-full animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <TabsList className="grid w-full grid-cols-7 bg-white border border-gray-200 shadow-lg rounded-xl p-1 gap-1">
            <TabsTrigger 
              value="vehicles" 
              className="text-center text-gray-700 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-gray-100 transition-all duration-300 rounded-lg"
            >
              المركبات
            </TabsTrigger>
            <TabsTrigger 
              value="brands" 
              className="text-center text-gray-700 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-gray-100 transition-all duration-300 rounded-lg"
            >
              الماركات
            </TabsTrigger>
            <TabsTrigger 
              value="models" 
              className="text-center text-gray-700 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-gray-100 transition-all duration-300 rounded-lg"
            >
              الموديلات
            </TabsTrigger>
            <TabsTrigger 
              value="types" 
              className="text-center text-gray-700 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-gray-100 transition-all duration-300 rounded-lg"
            >
              أنواع المركبات
            </TabsTrigger>
            <TabsTrigger 
              value="colors" 
              className="text-center text-gray-700 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-gray-100 transition-all duration-300 rounded-lg"
            >
              الألوان
            </TabsTrigger>
            <TabsTrigger 
              value="fuel" 
              className="text-center text-gray-700 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-gray-100 transition-all duration-300 rounded-lg"
            >
              أنواع الوقود
            </TabsTrigger>
            <TabsTrigger 
              value="transmission" 
              className="text-center text-gray-700 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-gray-100 transition-all duration-300 rounded-lg"
            >
              ناقل الحركة
            </TabsTrigger>
          </TabsList>

          <TabsContent value="vehicles" className="space-y-6">
            {/* أدوات البحث والتصفية */}
            <Card className="bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="البحث في المركبات (رقم اللوحة، الماركة، الموديل...)"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 border-2 focus:border-blue-500 bg-white text-right"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-3 w-full sm:w-auto">
                    <Select value={filterBy} onValueChange={setFilterBy}>
                      <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="جميع المركبات" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع المركبات</SelectItem>
                        <SelectItem value="active">نشطة</SelectItem>
                        <SelectItem value="maintenance">تحت الصيانة</SelectItem>
                        <SelectItem value="inactive">غير نشطة</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="جميع السنوات" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="plate">رقم اللوحة</SelectItem>
                        <SelectItem value="make">الماركة</SelectItem>
                        <SelectItem value="customer">اسم المالك</SelectItem>
                        <SelectItem value="mileage">المسافة المقطوعة</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select>
                      <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="جميع الأنواع" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedan">سيدان</SelectItem>
                        <SelectItem value="suv">دفع رباعي</SelectItem>
                        <SelectItem value="truck">شاحنة</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button 
                      variant="outline" 
                      size="default"
                      className="bg-gradient-to-r from-[hsl(217,85%,27%)] to-[hsl(195,100%,60%)] text-white border-[hsl(217,85%,40%)] hover:from-[hsl(217,85%,22%)] hover:to-[hsl(195,100%,55%)] hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      الأحدث أولاً ⬇️
                    </Button>

                    <div className="flex border border-[hsl(217,85%,40%)] rounded-lg overflow-hidden bg-gradient-to-r from-[hsl(217,85%,27%)] to-[hsl(195,100%,60%)]">
                      <Button
                        variant={viewMode === 'table' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('table')}
                        className={`rounded-none border-none ${viewMode === 'table' 
                          ? 'bg-white/20 text-white shadow-md' 
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                        } transition-all duration-300`}
                      >
                        <List className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === 'cards' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('cards')}
                        className={`rounded-none border-none ${viewMode === 'cards' 
                          ? 'bg-white/20 text-white shadow-md' 
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                        } transition-all duration-300`}
                      >
                        <Grid3X3 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-right text-gray-600">
              <span className="font-semibold">{filteredVehicles.length}</span> مركبة
            </div>

            {/* قائمة المركبات */}
            <Card className="bg-white shadow-sm">
              <CardContent className="p-6">
                {filteredVehicles.length === 0 ? (
                  <div className="text-center py-20">
                    <Car className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">لا توجد مركبات</h3>
                    <p className="text-gray-600 mb-6">لم يتم العثور على مركبات تطابق معايير البحث</p>
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => setIsAddVehicleOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      إضافة أول مركبة
                    </Button>
                  </div>
                ) : viewMode === 'cards' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredVehicles.map((vehicle) => (
                      <VehicleManagementCard
                        key={`${vehicle.customerId}-${vehicle.id}`}
                        vehicle={vehicle}
                        onView={handleViewVehicle}
                        onEdit={handleEditVehicle}
                        onDelete={handleDeleteVehicle}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-right py-3 px-4 font-semibold text-gray-700">رقم اللوحة</th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-700">الماركة والموديل</th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-700">المالك</th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-700">الحالة</th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-700">المسافة المقطوعة</th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-700">الصيانة القادمة</th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-700">الإجراءات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredVehicles.map((vehicle) => (
                          <tr key={`${vehicle.customerId}-${vehicle.id}`} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4 font-semibold text-blue-600" dir="ltr">{vehicle.plate}</td>
                            <td className="py-3 px-4">
                              <div>
                                <div className="font-semibold">{vehicle.make} {vehicle.model}</div>
                                <div className="text-sm text-gray-500">{vehicle.year} - {vehicle.color}</div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div>
                                <div className="font-semibold">{vehicle.customerName}</div>
                                <div className="text-sm text-gray-500" dir="ltr">{vehicle.customerPhone}</div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <Badge className={
                                vehicle.status === 'active' ? 'bg-green-100 text-green-800' :
                                vehicle.status === 'maintenance' ? 'bg-orange-100 text-orange-800' :
                                'bg-gray-100 text-gray-800'
                              }>
                                {vehicle.status === 'active' ? 'نشطة' :
                                 vehicle.status === 'maintenance' ? 'تحت الصيانة' : 'غير نشطة'}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 font-semibold">{vehicle.mileage?.toLocaleString()} كم</td>
                            <td className="py-3 px-4 text-gray-600">
                              {new Date(vehicle.nextMaintenanceDate).toLocaleDateString('ar-SA')}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewVehicle(vehicle)}
                                  className="hover:bg-blue-50 hover:border-blue-300"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditVehicle(vehicle)}
                                  className="hover:bg-green-50 hover:border-green-300"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteVehicle(vehicle)}
                                  className="hover:bg-red-50 hover:border-red-300"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* تبويب الماركات */}
          <TabsContent value="brands">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg text-blue-600">إدارة الماركات</CardTitle>
                  <Button 
                    onClick={() => setIsAddBrandOpen(true)}
                    className="bg-gradient-to-r from-[hsl(217,85%,27%)] to-[hsl(195,100%,60%)] hover:from-[hsl(217,85%,22%)] hover:to-[hsl(195,100%,55%)] text-white shadow-[var(--shadow-elegant)] hover:shadow-[var(--shadow-cyan)] transition-all duration-300 hover:scale-105"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    إضافة ماركة جديدة
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {/* ماركات افتراضية للعرض */}
                  {brands.map((brand) => (
                    <Card key={brand.id} className="hover:shadow-md transition-shadow border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex flex-col items-center space-y-3">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                            {brand.logo ? (
                              <img src={brand.logo} alt={brand.name} className="w-12 h-12 object-contain" />
                            ) : (
                              <Car className="h-8 w-8 text-gray-400" />
                            )}
                          </div>
                          <div className="text-center">
                            <h3 className="font-semibold text-gray-900">{brand.name}</h3>
                            <p className="text-sm text-gray-500" dir="ltr">{brand.id}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditBrand(brand)}
                              className="hover:bg-blue-50 hover:border-blue-300"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300"
                              onClick={() => handleDeleteBrand(brand)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* تبويب الموديلات */}
          <TabsContent value="models">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg text-blue-600">إدارة الموديلات</CardTitle>
                  <Button 
                    onClick={() => setIsAddModelOpen(true)}
                    className="bg-gradient-to-r from-[hsl(217,85%,27%)] to-[hsl(195,100%,60%)] hover:from-[hsl(217,85%,22%)] hover:to-[hsl(195,100%,55%)] text-white shadow-[var(--shadow-elegant)] hover:shadow-[var(--shadow-cyan)] transition-all duration-300 hover:scale-105"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    إضافة موديل جديد
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {/* موديلات افتراضية للعرض */}
                  {models.map((model) => (
                    <Card key={model.id} className="hover:shadow-md transition-shadow border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex flex-col items-center space-y-3">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Car className="h-8 w-8 text-gray-400" />
                          </div>
                          <div className="text-center">
                            <h3 className="font-semibold text-gray-900">{model.name}</h3>
                            <p className="text-sm text-gray-500">{model.brand}</p>
                            <p className="text-xs text-gray-400">{model.type}</p>
                            <p className="text-xs text-gray-400" dir="ltr">{model.id}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditModel(model)}
                              className="hover:bg-blue-50 hover:border-blue-300"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300"
                              onClick={() => handleDeleteModel(model)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* تبويب أنواع المركبات */}
          <TabsContent value="types">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg text-blue-600">إدارة أنواع المركبات</CardTitle>
                  <Button 
                    onClick={() => setIsAddVehicleTypeOpen(true)}
                    className="bg-gradient-to-r from-[hsl(217,85%,27%)] to-[hsl(195,100%,60%)] hover:from-[hsl(217,85%,22%)] hover:to-[hsl(195,100%,55%)] text-white shadow-[var(--shadow-elegant)] hover:shadow-[var(--shadow-cyan)] transition-all duration-300 hover:scale-105"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    إضافة نوع جديد
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {/* أنواع افتراضية للعرض */}
                  {vehicleTypes.map((type) => (
                    <Card key={type.id} className="hover:shadow-md transition-shadow border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex flex-col items-center space-y-3">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Truck className="h-8 w-8 text-gray-400" />
                          </div>
                          <div className="text-center">
                            <h3 className="font-semibold text-gray-900">{type.name}</h3>
                            <p className="text-sm text-gray-500" dir="ltr">{type.id}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditVehicleType(type)}
                              className="hover:bg-blue-50 hover:border-blue-300"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300"
                              onClick={() => handleDeleteVehicleType(type)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* تبويب الألوان */}
          <TabsContent value="colors">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg text-blue-600">إدارة الألوان</CardTitle>
                  <Button 
                    onClick={() => setIsAddColorOpen(true)}
                    className="bg-gradient-to-r from-[hsl(217,85%,27%)] to-[hsl(195,100%,60%)] hover:from-[hsl(217,85%,22%)] hover:to-[hsl(195,100%,55%)] text-white shadow-[var(--shadow-elegant)] hover:shadow-[var(--shadow-cyan)] transition-all duration-300 hover:scale-105"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    إضافة لون جديد
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {/* ألوان افتراضية للعرض */}
                  {colors.map((color) => (
                    <Card key={color.id} className="hover:shadow-md transition-shadow border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex flex-col items-center space-y-3">
                          <div 
                            className="w-16 h-16 rounded-lg border-2 border-gray-200 shadow-sm"
                            style={{ backgroundColor: color.hex }}
                          ></div>
                          <div className="text-center">
                            <h3 className="font-semibold text-gray-900">{color.name}</h3>
                            <p className="text-sm text-gray-500" dir="ltr">{color.id}</p>
                            <p className="text-xs text-gray-400" dir="ltr">{color.hex}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditColor(color)}
                              className="hover:bg-blue-50 hover:border-blue-300"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300"
                              onClick={() => handleDeleteColor(color)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* تبويب أنواع الوقود */}
          <TabsContent value="fuel">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg text-blue-600">إدارة أنواع الوقود</CardTitle>
                  <Button 
                    onClick={() => setIsAddFuelTypeOpen(true)}
                    className="bg-gradient-to-r from-[hsl(217,85%,27%)] to-[hsl(195,100%,60%)] hover:from-[hsl(217,85%,22%)] hover:to-[hsl(195,100%,55%)] text-white shadow-[var(--shadow-elegant)] hover:shadow-[var(--shadow-cyan)] transition-all duration-300 hover:scale-105"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    إضافة نوع وقود
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                  {/* أنواع الوقود الافتراضية */}
                  {fuelTypes.map((fuel) => (
                    <Card key={fuel.id} className="hover:shadow-md transition-shadow border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex flex-col items-center space-y-3">
                          <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Fuel className="h-8 w-8 text-blue-600" />
                          </div>
                          <div className="text-center">
                            <h3 className="font-semibold text-gray-900">{fuel.name}</h3>
                            <p className="text-sm text-gray-500" dir="ltr">ID: {fuel.id}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditFuelType(fuel)}
                              className="hover:bg-blue-50 hover:border-blue-300"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300"
                              onClick={() => handleDeleteFuelType(fuel)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* تبويب ناقل الحركة */}
          <TabsContent value="transmission">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg text-blue-600">إدارة أنواع ناقل الحركة</CardTitle>
                  <Button 
                    onClick={() => setIsAddTransmissionOpen(true)}
                    className="bg-gradient-to-r from-[hsl(217,85%,27%)] to-[hsl(195,100%,60%)] hover:from-[hsl(217,85%,22%)] hover:to-[hsl(195,100%,55%)] text-white shadow-[var(--shadow-elegant)] hover:shadow-[var(--shadow-cyan)] transition-all duration-300 hover:scale-105"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    إضافة نوع ناقل حركة
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {/* أنواع ناقل الحركة الافتراضية */}
                  {transmissions.map((transmission) => (
                    <Card key={transmission.id} className="hover:shadow-md transition-shadow border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex flex-col items-center space-y-3">
                          <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
                            <Cog className="h-8 w-8 text-green-600" />
                          </div>
                          <div className="text-center">
                            <h3 className="font-semibold text-gray-900">{transmission.name}</h3>
                            <p className="text-sm text-gray-500" dir="ltr">ID: {transmission.id}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditTransmission(transmission)}
                              className="hover:bg-blue-50 hover:border-blue-300"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300"
                              onClick={() => handleDeleteTransmission(transmission)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* نافذة تفاصيل المركبة */}
      <VehicleDetailsDialog
        vehicle={selectedVehicle}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onEdit={handleEditVehicle}
      />

      {/* نافذة إضافة مركبة جديدة */}
      <AddVehicleDialog
        isOpen={isAddVehicleOpen}
        onClose={() => setIsAddVehicleOpen(false)}
      />

      {/* نافذة إضافة ماركة جديدة */}
      <AddBrandDialog
        isOpen={isAddBrandOpen}
        onClose={() => setIsAddBrandOpen(false)}
      />

      {/* نافذة إضافة موديل جديد */}
      <AddModelDialog
        isOpen={isAddModelOpen}
        onClose={() => setIsAddModelOpen(false)}
      />

      {/* نافذة إضافة نوع مركبة جديد */}
      <AddVehicleTypeDialog
        isOpen={isAddVehicleTypeOpen}
        onClose={() => setIsAddVehicleTypeOpen(false)}
      />

      {/* نافذة إضافة لون جديد */}
      <AddColorDialog
        isOpen={isAddColorOpen}
        onClose={() => setIsAddColorOpen(false)}
      />

      {/* نافذة إضافة نوع وقود جديد */}
      <AddFuelTypeDialog
        isOpen={isAddFuelTypeOpen}
        onClose={() => setIsAddFuelTypeOpen(false)}
      />

      {/* نافذة إضافة نوع ناقل حركة جديد */}
      <AddTransmissionDialog
        isOpen={isAddTransmissionOpen}
        onClose={() => setIsAddTransmissionOpen(false)}
      />

      {/* الزر العائم للمساعد الذكي */}
      <div className="fixed bottom-6 left-6 z-40">
        <Button
          onClick={() => setIsAIAssistantOpen(true)}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 animate-pulse"
          style={{
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            boxShadow: '0 0 30px rgba(124, 58, 237, 0.5)'
          }}
        >
          <div className="relative">
            <Bot className="h-8 w-8" />
            <Sparkles className="h-4 w-4 absolute -top-2 -right-2 text-yellow-300 animate-bounce" />
          </div>
        </Button>
      </div>

      {/* المساعد الذكي */}
      <AIVehicleAssistant
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
      />
    </div>
  );
}