import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SaudiPlateInput } from "@/components/SaudiPlateInput";
import { LicensePlateReader } from "@/components/LicensePlateReader";
import { CustomerDetailsPopup } from "@/components/POS/CustomerDetailsPopup";
import { UnifiedCustomerForm } from "@/components/CustomerManagement/UnifiedCustomerForm";
import { useToast } from "@/hooks/use-toast";
import { useCustomerStore } from '@/hooks/useCustomerStore';
import { Customer } from '@/types/customer';
import { 
  User, 
  Phone, 
  Car, 
  MapPin, 
  Camera, 
  Plus, 
  UserPlus, 
  CarFront, 
  Search, 
  CheckCircle,
  UserCheck,
  Users,
  Settings,
  Crown,
  Gift,
  Ticket,
  Star,
  Calendar,
  Shield,
  Award,
  Heart
} from 'lucide-react';
import { PlateReaderButton } from './PlateReaderButton';
import { VehicleDataCard } from './VehicleDataCard';
import { ServicePathManager } from './ServicePathManager';
import { CustomerPathSummary } from './CustomerPathSummary';

interface CustomerInfoSectionProps {
  customerPhone: string;
  setCustomerPhone: (phone: string) => void;
  customerName: string;
  setCustomerName: (name: string) => void;
  carPlate: string;
  setCarPlate: (plate: string) => void;
  carMake: string;
  setCarMake: (make: string) => void;
  carModel: string;
  setCarModel: (model: string) => void;
  carYear: string;
  setCarYear: (year: string) => void;
  carColor: string;
  setCarColor: (color: string) => void;
  selectedPath: string;
  setSelectedPath: (path: string) => void;
  showPlateReader: boolean;
  setShowPlateReader: (show: boolean) => void;
  onPlateDetected: (plateData: any, customerData?: any) => void;
}

// Mock data
const carMakes = [
  'تويوتا', 'نيسان', 'هيونداي', 'كيا', 'هوندا', 'فورد', 'شفروليه', 'BMW', 'مرسيدس', 'أودي', 'لكزس', 'انفينيتي'
];

const carColors = [
  'أبيض', 'أسود', 'فضي', 'رمادي', 'أحمر', 'أزرق', 'أخضر', 'بني', 'ذهبي', 'بيج'
];

const servicePaths = [
  { id: '1', name: 'المسار 1', status: 'available', waitTime: 0 },
  { id: '2', name: 'المسار 2', status: 'busy', waitTime: 15 },
  { id: '3', name: 'المسار 3', status: 'available', waitTime: 0 },
  { id: '4', name: 'المسار 4', status: 'maintenance', waitTime: null }
];

// Mock customer database with advanced features
const mockCustomers = [
  { 
    id: 1, 
    name: 'أحمد محمد علي', 
    phone: '0501234567', 
    customerType: 'VIP',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    joinDate: '2022-01-15',
    totalVisits: 45,
    totalSpent: 15500,
    cars: [
      { id: 1, plate: 'أبج1234', make: 'تويوتا', model: 'كامري', year: '2020', color: 'أبيض' },
      { id: 2, plate: 'دهو5678', make: 'لكزس', model: 'ES 350', year: '2021', color: 'أسود' }
    ],
    coupons: [
      { id: 1, code: 'VIP20', discount: 20, description: 'خصم VIP 20%', validUntil: '2024-12-31' },
      { id: 2, code: 'WASH15', discount: 15, description: 'خصم   15%', validUntil: '2024-06-30' }
    ],
    packages: [
      { id: 1, name: 'باقة الملك الشهرية', remaining: 3, total: 5, validUntil: '2024-03-15' },
      { id: 2, name: 'باقة التلميع', remaining: 1, total: 2, validUntil: '2024-02-28' }
    ],
    relatedCustomers: [
      { name: 'محمد علي (الأخ)', phone: '0501234568', relation: 'أخ' },
      { name: 'سارة أحمد (الزوجة)', phone: '0501234569', relation: 'زوجة' }
    ]
  },
  { 
    id: 2, 
    name: 'فاطمة أحمد السعد', 
    phone: '0509876543', 
    customerType: 'Premium',
    avatar: 'https://images.unsplash.com/photo-1494010108755-2616b332e234?w=100&h=100&fit=crop&crop=face',
    joinDate: '2023-03-20',
    totalVisits: 28,
    totalSpent: 8200,
    cars: [
      { id: 3, plate: 'زحط9012', make: 'BMW', model: 'X5', year: '2019', color: 'أزرق' }
    ],
    coupons: [
      { id: 3, code: 'PREMIUM10', discount: 10, description: 'خصم العضوية المميزة', validUntil: '2024-08-15' }
    ],
    packages: [
      { id: 3, name: 'باقة العائلة', remaining: 2, total: 4, validUntil: '2024-04-10' }
    ],
    relatedCustomers: [
      { name: 'خالد أحمد (الأب)', phone: '0509876544', relation: 'والد' }
    ]
  },
  { 
    id: 3, 
    name: 'محمد علي الشمري', 
    phone: '0551112233', 
    customerType: 'Regular',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    joinDate: '2023-11-05',
    totalVisits: 12,
    totalSpent: 2800,
    cars: [
      { id: 4, plate: 'يكل3456', make: 'هوندا', model: 'أكورد', year: '2018', color: 'فضي' },
      { id: 5, plate: 'منس7890', make: 'نيسان', model: 'التيما', year: '2017', color: 'أحمر' }
    ],
    coupons: [],
    packages: [],
    relatedCustomers: []
  },
];

// Mock supervisors data
const pathSupervisors = [
  { pathId: '1', name: 'أحمد محمد', phone: '0501111111', avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=50&h=50&fit=crop&crop=face' },
  { pathId: '2', name: 'خالد علي', phone: '0502222222', avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=50&h=50&fit=crop&crop=face' },
  { pathId: '3', name: 'سالم أحمد', phone: '0503333333', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face' },
  { pathId: '4', name: 'فهد سعد', phone: '0504444444', avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=50&h=50&fit=crop&crop=face' }
];

export function CustomerInfoSection({
  customerPhone,
  setCustomerPhone,
  customerName,
  setCustomerName,
  carPlate,
  setCarPlate,
  carMake,
  setCarMake,
  carModel,
  setCarModel,
  carYear,
  setCarYear,
  carColor,
  setCarColor,
  selectedPath,
  setSelectedPath,
  showPlateReader,
  setShowPlateReader,
  onPlateDetected
}: CustomerInfoSectionProps) {
  const [showNewCustomer, setShowNewCustomer] = useState(false);
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);
  const [searchCustomer, setSearchCustomer] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedCar, setSelectedCar] = useState<any>(null);
  
  const { toast } = useToast();
  const { searchCustomer: searchCustomerStore } = useCustomerStore();

  // Customer search functionality
  const searchCustomers = () => {
    const found = searchCustomerStore(customerPhone || searchCustomer);
    
    if (found && found.length > 0) {
      const customer = found[0];
      setCustomerName(customer.name);
      setCustomerPhone(customer.phone);
      setSelectedCustomer(customer);
      // إعادة تعيين المشروب المختارة عند تغيير العميل
      setSelectedCar(null);
      setCarPlate('');
      setCarMake('');
      setCarModel('');
      setCarYear('');
      setCarColor('');
      toast({
        title: "تم العثور على العميل",
        description: `العميل: ${customer.name} (${customer.customerType})`,
        variant: "default"
      });
    } else {
      toast({
        title: "لم يتم العثور على العميل",
        description: "يمكنك إضافة عميل جديد",
        variant: "destructive"
      });
    }
  };

  const handleSaveNewCustomer = (customer: Customer) => {
    setCustomerName(customer.name);
    setCustomerPhone(customer.phone);
    setSelectedCustomer(customer);
    setShowNewCustomer(false);
  };

  const handleSaveNewVehicle = (vehicleData: any) => {
    setCarPlate(vehicleData.plateNumber);
    setCarMake(vehicleData.make);
    setCarModel(vehicleData.model);
    setCarYear(vehicleData.year || '');
    setCarColor(vehicleData.color || '');
    setShowAddVehicle(false);
    
    toast({
      title: "تم ربط المركبة",
      description: `تم ربط ${vehicleData.make} ${vehicleData.model} بالعميل الحالي`,
      variant: "default"
    });
  };

  const handleViewCustomerDetails = () => {
    if (selectedCustomer) {
      setShowCustomerDetails(true);
    }
  };

  const handleSelectCar = (car: any) => {
    // تجنب إعادة التحديد للمشروب نفسها
    if (selectedCar?.id === car.id) {
      return;
    }
    
    setSelectedCar(car);
    setCarPlate(car.plate);
    setCarMake(car.make);
    setCarModel(car.model);
    setCarYear(car.year);
    setCarColor(car.color);
    
    toast({
      title: "تم اختيار المركبة",
      description: `${car.make} ${car.model} - ${car.plate}`,
      variant: "default"
    });
  };

  const handlePlateReaderClose = () => {
    setShowPlateReader(false);
  };

  return (
    <div className="space-y-4">
      <Card className="animate-fade-in hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/30 bg-gradient-card shadow-elegant">
        <CardHeader className="pb-6 bg-gradient-raghwa text-white rounded-t-lg relative overflow-hidden">
          {/* خلفية ديكوراتيف متحركة */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-white/20 animate-float"></div>
            <div className="absolute bottom-2 left-6 w-16 h-16 rounded-full bg-white/10 animate-float" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/3 w-12 h-12 rounded-full bg-white/15 animate-float" style={{ animationDelay: '2s' }}></div>
          </div>
          
          <CardTitle className="flex items-center justify-between text-xl relative z-10">
            <div className="flex items-center gap-3 animate-slide-in-right">
              <div className="p-3 bg-white/20 rounded-xl shadow-lg hover:scale-110 transition-transform duration-300">
                <Users className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-xl font-bold">إدارة العملاء والمركبات</h2>
                <p className="text-white/80 text-sm font-normal mt-1">نظام متطور لإدارة بيانات العملاء ومركباتهم</p>
              </div>
            </div>
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm px-3 py-1 animate-pulse">
              نظام متطور
            </Badge>
          </CardTitle>
        </CardHeader>
      
        <CardContent className="p-4 sm:p-6 lg:p-8">
          {/* بطاقة البيانات المركبة - تظهر في الأعلى */}
          <div className="mb-6">
            <VehicleDataCard 
              vehicleData={{
                plateNumber: carPlate,
                vehicleType: carMake,
                vehicleModel: carModel,
                year: carYear,
                color: carColor
              }}
              onEdit={() => {
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            
            {/* قسم المركبة */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-primary flex items-center gap-2">
                  <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</span>
                  <CarFront className="h-5 w-5" />
                  بيانات المركبة
                </h3>
                <PlateReaderButton 
                  onPlateDetected={onPlateDetected}
                  className="text-sm"
                />
              </div>
              
              <div className="space-y-4 p-4 bg-white rounded-lg border-2 border-gray-100 shadow-sm">
                <div>
                  <Label>رقم اللوحة</Label>
                  <SaudiPlateInput
                    value={carPlate}
                    onChange={setCarPlate}
                    placeholder="أدخل رقم اللوحة"
                    className="border-2 focus:border-primary"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label>نوع المشروب</Label>
                    <Select value={carMake} onValueChange={setCarMake}>
                      <SelectTrigger className="border-2 focus:border-primary">
                        <SelectValue placeholder="اختر النوع" />
                      </SelectTrigger>
                      <SelectContent>
                        {carMakes.map((make) => (
                          <SelectItem key={make} value={make}>{make}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>الموديل</Label>
                    <Input
                      value={carModel}
                      onChange={(e) => setCarModel(e.target.value)}
                      placeholder="مثال: كامري"
                      className="border-2 focus:border-primary"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* قسم العميل - التصميم المحدث */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-primary flex items-center gap-2">
                  <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</span>
                  <User className="h-5 w-5" />
                  العميل
                </h3>
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2"
                  onClick={() => setShowNewCustomer(true)}
                >
                  <UserPlus className="h-4 w-4 ml-2" />
                  عميل جديد
                </Button>
              </div>
              
              <div className="space-y-4 p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
                <div>
                  <Label className="text-sm font-medium mb-2 block">رقم الجوال</Label>
                  <Input
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="أدخل رقم الجوال للبحث"
                    className="w-full"
                    dir="ltr"
                  />
                </div>
                
                <div>
                  <Label className="text-sm font-medium mb-2 block">اسم العميل</Label>
                  <Input
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="اسم العميل (سيظهر تلقائياً أو أدخل يدوياً)"
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* قسم مسار الخدمة - أسفل بيانات العميل */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-primary flex items-center gap-2">
                <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</span>
                <Settings className="h-5 w-5" />
                مسار الخدمة
              </h3>
              <Badge className="bg-gradient-raghwa text-white border-0 shadow-lg">
                اختيار المسار المناسب
              </Badge>
            </div>
            
            <ServicePathManager 
              selectedPath={selectedPath}
              onPathChange={setSelectedPath}
            />
          </div>

          {/* ملخص العميل والمسار */}
          <CustomerPathSummary 
            customerData={selectedCustomer ? {
              name: selectedCustomer.name,
              phone: selectedCustomer.phone,
              customerType: selectedCustomer.customerType as 'VIP' | 'Premium' | 'Regular',
              avatar: selectedCustomer.avatar,
              totalVisits: selectedCustomer.totalVisits,
              totalSpent: selectedCustomer.totalSpent
            } : undefined}
            vehicleData={carPlate || carMake || carModel ? {
              plateNumber: carPlate,
              vehicleType: carMake,
              vehicleModel: carModel,
              year: carYear,
              color: carColor
            } : undefined}
            selectedPath={selectedPath ? {
              id: selectedPath,
              name: servicePaths.find(p => p.id === selectedPath)?.name || '',
              status: (servicePaths.find(p => p.id === selectedPath)?.status || 'available') as 'available' | 'busy' | 'maintenance' | 'cleaning',
              waitTime: servicePaths.find(p => p.id === selectedPath)?.waitTime || 0,
              supervisor: pathSupervisors.find(s => s.pathId === selectedPath) ? {
                name: pathSupervisors.find(s => s.pathId === selectedPath)!.name,
                phone: pathSupervisors.find(s => s.pathId === selectedPath)!.phone,
                avatar: pathSupervisors.find(s => s.pathId === selectedPath)!.avatar
              } : {
                name: 'غير محدد',
                phone: '',
                avatar: ''
              },
              currentLoad: Math.floor(Math.random() * 5) + 1,
              capacity: 8,
              efficiency: Math.floor(Math.random() * 20) + 80,
              currentCustomer: servicePaths.find(p => p.id === selectedPath)?.status === 'busy' ? {
                name: 'عميل حالي',
                plate: 'أبج1234',
                estimatedEnd: '15:30'
              } : undefined
            } : undefined}
          />
        </CardContent>
      </Card>
      
      {/* Modals */}
      <UnifiedCustomerForm
        isOpen={showNewCustomer}
        onClose={() => setShowNewCustomer(false)}
        mode="add"
        onSuccess={handleSaveNewCustomer}
      />

      <CustomerDetailsPopup
        isOpen={showCustomerDetails}
        onClose={() => setShowCustomerDetails(false)}
        customer={selectedCustomer}
      />
    </div>
  );
}
