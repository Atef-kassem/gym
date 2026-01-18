import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  MapPin, 
  Clock, 
  Users, 
  Car, 
  Wrench, 
  CheckCircle, 
  AlertCircle, 
  Timer, 
  User,
  Phone,
  Settings,
  TrendingUp,
  Activity,
  Target,
  Zap
} from 'lucide-react';
import { InteractiveCard, StatusBadge, AnimatedButton } from '../ui/animated-components';

interface ServicePath {
  id: string;
  name: string;
  status: 'available' | 'busy' | 'maintenance' | 'cleaning';
  waitTime: number | null;
  currentCustomer?: {
    name: string;
    plate: string;
    serviceType: string;
    startTime: string;
    estimatedEnd: string;
  };
  supervisor: {
    name: string;
    phone: string;
    avatar: string;
  };
  services: string[];
  capacity: number;
  currentLoad: number;
  efficiency: number;
  todayRevenue: number;
  todayCustomers: number;
}

interface ServicePathManagerProps {
  selectedPath: string;
  onPathChange: (pathId: string) => void;
  className?: string;
}

// بيانات المسارات المتقدمة
const servicePaths: ServicePath[] = [
  {
    id: '1',
    name: 'المسار السريع',
    status: 'available',
    waitTime: 0,
    supervisor: {
      name: 'أحمد محمد',
      phone: '0501111111',
      avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=50&h=50&fit=crop&crop=face'
    },
    services: ['  خارجي', 'تنظيف داخلي', 'تلميع'],
    capacity: 8,
    currentLoad: 2,
    efficiency: 95,
    todayRevenue: 1200,
    todayCustomers: 15
  },
  {
    id: '2',
    name: 'المسار المتكامل',
    status: 'busy',
    waitTime: 15,
    currentCustomer: {
      name: 'فاطمة أحمد',
      plate: 'أبج1234',
      serviceType: '  متكامل + تلميع',
      startTime: '14:30',
      estimatedEnd: '15:15'
    },
    supervisor: {
      name: 'خالد علي',
      phone: '0502222222',
      avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=50&h=50&fit=crop&crop=face'
    },
    services: ['  شامل', 'تنظيف محرك', 'تلميع', 'حماية طلاء'],
    capacity: 5,
    currentLoad: 4,
    efficiency: 88,
    todayRevenue: 2150,
    todayCustomers: 8
  },
  {
    id: '3',
    name: 'مسار VIP',
    status: 'available',
    waitTime: 0,
    supervisor: {
      name: 'سالم أحمد',
      phone: '0503333333',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face'
    },
    services: ['خدمة VIP شاملة', 'تنظيف بالبخار', 'حماية متقدمة'],
    capacity: 3,
    currentLoad: 1,
    efficiency: 92,
    todayRevenue: 850,
    todayCustomers: 3
  },
  {
    id: '4',
    name: 'مسار الصيانة السريعة',
    status: 'maintenance',
    waitTime: null,
    supervisor: {
      name: 'فهد سعد',
      phone: '0504444444',
      avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=50&h=50&fit=crop&crop=face'
    },
    services: ['صيانة دورية', 'فحص شامل'],
    capacity: 4,
    currentLoad: 0,
    efficiency: 0,
    todayRevenue: 0,
    todayCustomers: 0
  }
];

export function ServicePathManager({ selectedPath, onPathChange, className = "" }: ServicePathManagerProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const selectedPathData = servicePaths.find(p => p.id === selectedPath);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'success';
      case 'busy': return 'warning';
      case 'maintenance': return 'error';
      case 'cleaning': return 'info';
      default: return 'info';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'متاح';
      case 'busy': return 'مشغول';
      case 'maintenance': return 'صيانة';
      case 'cleaning': return 'تنظيف';
      default: return 'غير معروف';
    }
  };

  const calculateProgress = (currentLoad: number, capacity: number) => {
    return (currentLoad / capacity) * 100;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* عنوان القسم */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 animate-slide-in-right">
          <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl text-white shadow-lg animate-float">
            <MapPin className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              إدارة مسارات الخدمة
            </h2>
            <p className="text-gray-600 text-sm">نظام متقدم لمراقبة وإدارة مسارات الخدمة</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <StatusBadge status="info" pulse={true}>
            <Activity className="h-3 w-3 mr-1" />
            {servicePaths.filter(p => p.status === 'available').length} متاح
          </StatusBadge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="transition-all duration-300 hover:scale-105"
          >
            <Settings className="h-4 w-4 mr-2" />
            {viewMode === 'grid' ? 'عرض قائمة' : 'عرض شبكة'}
          </Button>
        </div>
      </div>

      {/* شريط الإحصائيات السريع */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center animate-fade-in-up border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="flex items-center justify-center gap-2 mb-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="font-bold text-green-900">متاح</span>
          </div>
          <p className="text-2xl font-bold text-green-700">
            {servicePaths.filter(p => p.status === 'available').length}
          </p>
        </Card>
        
        <Card className="p-4 text-center animate-fade-in-up border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Timer className="h-5 w-5 text-orange-600" />
            <span className="font-bold text-orange-900">مشغول</span>
          </div>
          <p className="text-2xl font-bold text-orange-700">
            {servicePaths.filter(p => p.status === 'busy').length}
          </p>
        </Card>
        
        <Card className="p-4 text-center animate-fade-in-up border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <span className="font-bold text-blue-900">الإيرادات</span>
          </div>
          <p className="text-2xl font-bold text-blue-700">
            {servicePaths.reduce((sum, p) => sum + p.todayRevenue, 0).toLocaleString()} جنيه مصري
          </p>
        </Card>
        
        <Card className="p-4 text-center animate-fade-in-up border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Users className="h-5 w-5 text-purple-600" />
            <span className="font-bold text-purple-900">العملاء</span>
          </div>
          <p className="text-2xl font-bold text-purple-700">
            {servicePaths.reduce((sum, p) => sum + p.todayCustomers, 0)}
          </p>
        </Card>
      </div>

      {/* اختيار المسار */}
      <InteractiveCard hover={true} className="animate-slide-in-left">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Target className="h-5 w-5 text-blue-600" />
            اختيار مسار الخدمة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedPath} onValueChange={onPathChange}>
            <SelectTrigger className="border-2 focus:border-primary bg-white text-lg h-12">
              <SelectValue placeholder="اختر مسار الخدمة" />
            </SelectTrigger>
            <SelectContent className="bg-white border-2 shadow-xl z-50">
              {servicePaths.map((path) => (
                <SelectItem 
                  key={path.id} 
                  value={path.id}
                  disabled={path.status === 'maintenance'}
                  className="hover:bg-primary/5 cursor-pointer transition-all duration-200 p-4"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        path.status === 'available' ? 'bg-green-500 animate-pulse' :
                        path.status === 'busy' ? 'bg-orange-500 animate-pulse' :
                        path.status === 'maintenance' ? 'bg-red-500' : 'bg-gray-500'
                      }`} />
                      <span className="font-semibold">{path.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge 
                        status={getStatusColor(path.status) as any} 
                        pulse={path.status === 'busy'}
                      >
                        {getStatusText(path.status)}
                      </StatusBadge>
                      {path.waitTime !== null && path.waitTime > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {path.waitTime} دقيقة
                        </Badge>
                      )}
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </InteractiveCard>

      {/* تفاصيل المسار المختار */}
      {selectedPathData && (
        <InteractiveCard 
          hover={true} 
          glow={selectedPathData.status === 'available'} 
          className="animate-fade-in-up"
        >
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white">
                  <Car className="h-5 w-5" />
                </div>
                <span>{selectedPathData.name}</span>
              </div>
              <StatusBadge 
                status={getStatusColor(selectedPathData.status) as any}
                pulse={selectedPathData.status === 'busy'}
                glow={true}
              >
                {getStatusText(selectedPathData.status)}
              </StatusBadge>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* معلومات الحالة الحالية */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <Activity className="h-4 w-4 text-blue-600" />
                  حالة التشغيل
                </h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">السعة:</span>
                    <span className="font-semibold">{selectedPathData.capacity} مركبة</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">الحمولة الحالية:</span>
                    <span className="font-semibold">{selectedPathData.currentLoad} مركبة</span>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">نسبة الاستخدام:</span>
                      <span className="font-semibold">{calculateProgress(selectedPathData.currentLoad, selectedPathData.capacity).toFixed(0)}%</span>
                    </div>
                    <Progress 
                      value={calculateProgress(selectedPathData.currentLoad, selectedPathData.capacity)} 
                      className="h-2"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">الكفاءة:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{selectedPathData.efficiency}%</span>
                      <Zap className={`h-4 w-4 ${selectedPathData.efficiency >= 90 ? 'text-green-500' : 'text-orange-500'}`} />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  إحصائيات اليوم
                </h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">الإيرادات:</span>
                    <span className="font-semibold text-green-600">{selectedPathData.todayRevenue.toLocaleString()} جنيه مصري</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">عدد العملاء:</span>
                    <span className="font-semibold">{selectedPathData.todayCustomers} عميل</span>
                  </div>
                  
                  {selectedPathData.waitTime !== null && selectedPathData.waitTime > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">وقت الانتظار:</span>
                      <Badge variant="outline" className="bg-orange-50 text-orange-700">
                        <Clock className="h-3 w-3 mr-1" />
                        {selectedPathData.waitTime} دقيقة
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* العميل الحالي */}
            {selectedPathData.currentCustomer && (
              <Alert className="border-2 border-blue-200 bg-blue-50 animate-pulse">
                <Car className="h-4 w-4 text-blue-600" />
                <AlertDescription>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-blue-900">العميل الحالي:</span>
                      <span className="text-blue-700">{selectedPathData.currentCustomer.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-700">رقم اللوحة:</span>
                      <span className="font-mono font-semibold text-blue-900">{selectedPathData.currentCustomer.plate}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-700">نوع الخدمة:</span>
                      <span className="text-blue-900">{selectedPathData.currentCustomer.serviceType}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-700">وقت الانتهاء المتوقع:</span>
                      <Badge className="bg-blue-600 text-white">
                        {selectedPathData.currentCustomer.estimatedEnd}
                      </Badge>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* معلومات المشرف */}
            <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border-2 border-gray-200">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <User className="h-4 w-4 text-gray-600" />
                مشرف المسار
              </h4>
              <div className="flex items-center gap-3">
                <img 
                  src={selectedPathData.supervisor.avatar} 
                  alt={selectedPathData.supervisor.name}
                  className="w-12 h-12 rounded-full border-2 border-white shadow-md object-cover"
                />
                <div className="flex-1">
                  <h5 className="font-semibold text-gray-900">{selectedPathData.supervisor.name}</h5>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Phone className="h-3 w-3" />
                    {selectedPathData.supervisor.phone}
                  </div>
                </div>
                <AnimatedButton
                  variant="primary"
                  size="sm"
                  animation="glow"
                  onClick={() => window.open(`tel:${selectedPathData.supervisor.phone}`)}
                >
                  <Phone className="h-3 w-3 mr-1" />
                  اتصال
                </AnimatedButton>
              </div>
            </div>

            {/* الخدمات المتاحة */}
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Wrench className="h-4 w-4 text-orange-600" />
                الخدمات المتاحة
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedPathData.services.map((service, index) => (
                  <Badge 
                    key={service} 
                    variant="outline" 
                    className="px-3 py-1 bg-white border-2 border-gray-200 hover:border-primary transition-colors duration-200 animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {service}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </InteractiveCard>
      )}

      {/* عرض جميع المسارات */}
      <InteractiveCard hover={true} className="animate-slide-in-up">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Activity className="h-5 w-5 text-purple-600" />
            نظرة عامة على جميع المسارات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
            {servicePaths.map((path, index) => (
              <Card 
                key={path.id} 
                className={`
                  cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105
                  ${selectedPath === path.id ? 'ring-2 ring-primary bg-primary/5' : ''}
                  ${path.status === 'maintenance' ? 'opacity-60' : ''}
                  animate-fade-in-up
                `}
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => onPathChange(path.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-semibold">{path.name}</h5>
                    <StatusBadge 
                      status={getStatusColor(path.status) as any}
                      pulse={path.status === 'busy'}
                    >
                      {getStatusText(path.status)}
                    </StatusBadge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">السعة:</span>
                      <span className="font-semibold ml-2">{path.currentLoad}/{path.capacity}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">الكفاءة:</span>
                      <span className="font-semibold ml-2">{path.efficiency}%</span>
                    </div>
                    <div>
                      <span className="text-gray-600">الإيرادات:</span>
                      <span className="font-semibold ml-2 text-green-600">{path.todayRevenue} جنيه مصري</span>
                    </div>
                    <div>
                      <span className="text-gray-600">العملاء:</span>
                      <span className="font-semibold ml-2">{path.todayCustomers}</span>
                    </div>
                  </div>
                  
                  {path.waitTime !== null && path.waitTime > 0 && (
                    <div className="mt-3 text-center">
                      <Badge variant="outline" className="bg-orange-50 text-orange-700">
                        <Timer className="h-3 w-3 mr-1" />
                        انتظار {path.waitTime} دقيقة
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </InteractiveCard>
    </div>
  );
}