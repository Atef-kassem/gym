import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  Phone, 
  Car, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Wrench,
  Timer,
  Users,
  TrendingUp,
  Shield,
  Star,
  Crown
} from 'lucide-react';
import { InteractiveCard, StatusBadge } from '../ui/animated-components';

interface CustomerPathSummaryProps {
  customerData?: {
    name: string;
    phone: string;
    customerType: 'VIP' | 'Premium' | 'Regular';
    avatar?: string;
    totalVisits: number;
    totalSpent: number;
  };
  vehicleData?: {
    plateNumber: string;
    vehicleType: string;
    vehicleModel: string;
    year?: string;
    color?: string;
  };
  selectedPath?: {
    id: string;
    name: string;
    status: 'available' | 'busy' | 'maintenance' | 'cleaning';
    waitTime: number | null;
    supervisor: {
      name: string;
      phone: string;
      avatar: string;
    };
    currentLoad: number;
    capacity: number;
    efficiency: number;
    currentCustomer?: {
      name: string;
      plate: string;
      estimatedEnd: string;
    };
  };
  className?: string;
}

export function CustomerPathSummary({ 
  customerData, 
  vehicleData, 
  selectedPath, 
  className = "" 
}: CustomerPathSummaryProps) {
  const getCustomerTypeIcon = (type: string) => {
    switch (type) {
      case 'VIP': return <Crown className="h-4 w-4 text-yellow-500" />;
      case 'Premium': return <Star className="h-4 w-4 text-blue-500" />;
      case 'Regular': return <Shield className="h-4 w-4 text-gray-500" />;
      default: return <User className="h-4 w-4 text-gray-400" />;
    }
  };

  const getCustomerTypeBadge = (type: string) => {
    switch (type) {
      case 'VIP': return { variant: 'default', className: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white' };
      case 'Premium': return { variant: 'default', className: 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' };
      case 'Regular': return { variant: 'outline', className: 'border-gray-300 text-gray-700' };
      default: return { variant: 'outline', className: 'border-gray-300 text-gray-700' };
    }
  };

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle className="h-4 w-4" />;
      case 'busy': return <Timer className="h-4 w-4" />;
      case 'maintenance': return <Wrench className="h-4 w-4" />;
      case 'cleaning': return <Car className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* ملخص بيانات العميل والمركبة */}
      {(customerData || vehicleData) && (
        <InteractiveCard hover={true} className="animate-fade-in-up">
          <CardHeader className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg animate-float">
                <Users className="h-5 w-5" />
              </div>
              <span>ملخص بيانات العميل والمركبة</span>
              {customerData && (
              <Badge 
                variant={getCustomerTypeBadge(customerData.customerType).variant as "default" | "outline"}
                className={getCustomerTypeBadge(customerData.customerType).className}
              >
                {getCustomerTypeIcon(customerData.customerType)}
                <span className="mr-1">{customerData.customerType}</span>
              </Badge>
              )}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* بيانات العميل */}
              {customerData && (
                <div className="space-y-4 animate-slide-in-right">
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200">
                    {customerData.avatar && (
                      <img 
                        src={customerData.avatar} 
                        alt={customerData.name}
                        className="w-12 h-12 rounded-full border-2 border-white shadow-md object-cover animate-bounce-in"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-blue-900">{customerData.name}</h4>
                        {getCustomerTypeIcon(customerData.customerType)}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-blue-700">
                        <Phone className="h-3 w-3" />
                        {customerData.phone}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white rounded-lg border-2 border-green-200 text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-xs text-green-700 font-medium">إجمالي الزيارات</span>
                      </div>
                      <p className="text-xl font-bold text-green-800">{customerData.totalVisits}</p>
                    </div>
                    
                    <div className="p-3 bg-white rounded-lg border-2 border-purple-200 text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Star className="h-4 w-4 text-purple-600" />
                        <span className="text-xs text-purple-700 font-medium">إجمالي الإنفاق</span>
                      </div>
                      <p className="text-xl font-bold text-purple-800">{customerData.totalSpent.toLocaleString()} جنيه مصري</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* بيانات المركبة */}
              {vehicleData && (
                <div className="space-y-4 animate-slide-in-left" style={{ animationDelay: '0.1s' }}>
                  <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Car className="h-5 w-5 text-indigo-600" />
                      <h4 className="font-bold text-indigo-900">بيانات المركبة</h4>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-indigo-700">رقم اللوحة:</span>
                        <span className="font-bold text-indigo-900 font-mono bg-indigo-100 px-2 py-1 rounded">
                          {vehicleData.plateNumber}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-indigo-700">النوع:</span>
                        <span className="font-semibold text-indigo-900">{vehicleData.vehicleType}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-indigo-700">الموديل:</span>
                        <span className="font-semibold text-indigo-900">{vehicleData.vehicleModel}</span>
                      </div>
                      
                      {vehicleData.year && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-indigo-700">السنة:</span>
                          <span className="font-semibold text-indigo-900">{vehicleData.year}</span>
                        </div>
                      )}
                      
                      {vehicleData.color && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-indigo-700">اللون:</span>
                          <span className="font-semibold text-indigo-900">{vehicleData.color}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </InteractiveCard>
      )}

      {/* معلومات حالة المسار */}
      {selectedPath && (
        <InteractiveCard 
          hover={true} 
          glow={selectedPath.status === 'available'} 
          className="animate-fade-in-up"
        >
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg text-white animate-float">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-xl">حالة مسار الخدمة</span>
                  <p className="text-sm text-gray-600 font-normal">{selectedPath.name}</p>
                </div>
              </div>
              
              <StatusBadge 
                status={getStatusColor(selectedPath.status) as any}
                pulse={selectedPath.status === 'busy'}
                glow={true}
              >
                {getStatusIcon(selectedPath.status)}
                <span className="mr-1">{getStatusText(selectedPath.status)}</span>
              </StatusBadge>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* معلومات الحالة العامة */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-blue-900">السعة</span>
                </div>
                <p className="text-2xl font-bold text-blue-800">{selectedPath.currentLoad}/{selectedPath.capacity}</p>
                <div className="mt-2">
                  <Progress 
                    value={(selectedPath.currentLoad / selectedPath.capacity) * 100} 
                    className="h-2 bg-blue-100"
                  />
                </div>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-green-900">الكفاءة</span>
                </div>
                <p className="text-2xl font-bold text-green-800">{selectedPath.efficiency}%</p>
                <div className="mt-2">
                  <Progress 
                    value={selectedPath.efficiency} 
                    className="h-2 bg-green-100"
                  />
                </div>
              </div>
              
              {selectedPath.waitTime !== null && selectedPath.waitTime > 0 && (
                <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-orange-600" />
                    <span className="font-semibold text-orange-900">وقت الانتظار</span>
                  </div>
                  <p className="text-2xl font-bold text-orange-800">{selectedPath.waitTime} دقيقة</p>
                </div>
              )}
            </div>

            {/* العميل الحالي */}
            {selectedPath.currentCustomer && (
              <div className="p-4 bg-gradient-to-r from-yellow-50 via-orange-50 to-red-50 rounded-xl border-2 border-yellow-200 animate-pulse">
                <div className="flex items-center gap-2 mb-3">
                  <Timer className="h-5 w-5 text-yellow-600 animate-spin" />
                  <h4 className="font-bold text-yellow-900">العميل الحالي في الخدمة</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-yellow-700">الاسم:</span>
                    <span className="font-semibold text-yellow-900">{selectedPath.currentCustomer.name}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-yellow-700">رقم اللوحة:</span>
                    <span className="font-mono font-semibold text-yellow-900 bg-yellow-100 px-2 py-1 rounded">
                      {selectedPath.currentCustomer.plate}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-yellow-700">الانتهاء المتوقع:</span>
                    <Badge className="bg-yellow-600 text-white animate-pulse">
                      <Clock className="h-3 w-3 mr-1" />
                      {selectedPath.currentCustomer.estimatedEnd}
                    </Badge>
                  </div>
                </div>
              </div>
            )}

            {/* معلومات المشرف */}
            <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border-2 border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <User className="h-5 w-5 text-gray-600" />
                <h4 className="font-bold text-gray-900">مشرف المسار</h4>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img 
                    src={selectedPath.supervisor.avatar} 
                    alt={selectedPath.supervisor.name}
                    className="w-10 h-10 rounded-full border-2 border-white shadow-md object-cover"
                  />
                  <div>
                    <h5 className="font-semibold text-gray-900">{selectedPath.supervisor.name}</h5>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Phone className="h-3 w-3" />
                      {selectedPath.supervisor.phone}
                    </div>
                  </div>
                </div>
                
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  onClick={() => window.open(`tel:${selectedPath.supervisor.phone}`)}
                >
                  <Phone className="h-3 w-3 mr-1" />
                  اتصال
                </Button>
              </div>
            </div>

            {/* رسائل الحالة */}
            {selectedPath.status === 'maintenance' && (
              <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border-2 border-red-200">
                <div className="flex items-center gap-2 text-red-800">
                  <Wrench className="h-5 w-5" />
                  <span className="font-semibold">المسار في وضع الصيانة</span>
                </div>
                <p className="text-sm text-red-700 mt-1">لا يمكن تخصيص عملاء جدد حالياً</p>
              </div>
            )}

            {selectedPath.status === 'available' && (
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                <div className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-semibold">المسار متاح للخدمة</span>
                </div>
                <p className="text-sm text-green-700 mt-1">يمكن تخصيص العميل لهذا المسار فوراً</p>
              </div>
            )}
          </CardContent>
        </InteractiveCard>
      )}
    </div>
  );
}