import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  RefreshCw,
  Bike,
  Wrench,
  MapPin,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { useGetMotorcycleStatsQuery } from '@/services/motorcycleApi';

interface MotorcycleStats {
  totalMotorcycles: number;
  availableMotorcycles: number;
  inServiceMotorcycles: number;
  maintenanceMotorcycles: number;
  totalDeliveries: number;
  activeDrivers: number;
  pendingMaintenance: number;
  averageRating: number;
}

interface StatusStats {
  status: string;
  count: number;
}

interface FuelTypeStats {
  fuelType: string;
  count: number;
}

const MotorcycleDashboard: React.FC = () => {
  const navigate = useNavigate();

  // RTK Query hook للحصول على الإحصائيات
  const { data: statsData, isLoading, refetch } = useGetMotorcycleStatsQuery({});

  // استخراج البيانات من الـ response
  const stats: MotorcycleStats = {
    totalMotorcycles: statsData?.data?.totalMotorcycles || 0,
    availableMotorcycles: statsData?.data?.availableMotorcycles || 0,
    inServiceMotorcycles: statsData?.data?.inServiceMotorcycles || 0,
    maintenanceMotorcycles: statsData?.data?.maintenanceMotorcycles || 0,
    totalDeliveries: statsData?.data?.totalDeliveries || 0,
    activeDrivers: statsData?.data?.activeDrivers || 0,
    pendingMaintenance: statsData?.data?.pendingMaintenance || 0,
    averageRating: statsData?.data?.averageRating || 0
  };

  const statusStats: StatusStats[] = statsData?.data?.statusStats || [];
  const fuelTypeStats: FuelTypeStats[] = statsData?.data?.fuelTypeStats || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'متاح': return 'bg-green-100 text-green-800';
      case 'في الخدمة': return 'bg-blue-100 text-blue-800';
      case 'صيانة': return 'bg-yellow-100 text-yellow-800';
      case 'معطل': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'متاح': return <CheckCircle className="h-4 w-4" />;
      case 'في الخدمة': return <Clock className="h-4 w-4" />;
      case 'صيانة': return <Wrench className="h-4 w-4" />;
      case 'معطل': return <XCircle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <p className="ml-3 text-gray-600">جارٍ تحميل الإحصائيات...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">إدارة الدراجات النارية</h1>
          <p className="text-gray-600 mt-2">نظام إدارة الدراجات النارية للتوصيل</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            تحديث
          </Button>
          <Button variant="outline" onClick={() => navigate('/motorcycle-management/maintenance')}>
            <Wrench className="h-4 w-4 mr-2" />
            الصيانة
          </Button>
          <Button variant="outline" onClick={() => navigate('/motorcycle-management/drivers')}>
            <Users className="h-4 w-4 mr-2" />
            السائقين
          </Button>
          <Button variant="outline" onClick={() => navigate('/motorcycle-management/orders')}>
            <MapPin className="h-4 w-4 mr-2" />
            الطلبات
          </Button>
          <Button onClick={() => navigate('/motorcycle-management/motorcycles/new')}>
            <Plus className="h-4 w-4 mr-2" />
            إضافة دراجة
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي الدراجات</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalMotorcycles}</p>
              </div>
              <Bike className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">متاحة</p>
                <p className="text-2xl font-bold text-green-600">{stats.availableMotorcycles}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">في الخدمة</p>
                <p className="text-2xl font-bold text-blue-600">{stats.inServiceMotorcycles}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">تحت الصيانة</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.maintenanceMotorcycles}</p>
              </div>
              <Wrench className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي التوصيلات</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDeliveries}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">السائقين النشطين</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeDrivers}</p>
              </div>
              <Users className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">صيانة مطلوبة</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pendingMaintenance}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">متوسط التقييم</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageRating ? Number(stats.averageRating).toFixed(1) : '0.0'}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>توزيع الحالات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {statusStats.map((stat) => (
                <div key={stat.status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(stat.status)}
                    <span className="text-sm font-medium">{stat.status}</span>
                  </div>
                  <Badge className={getStatusColor(stat.status)}>
                    {stat.count}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Fuel Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>توزيع أنواع الوقود</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fuelTypeStats.map((stat) => (
                <div key={stat.fuelType} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{stat.fuelType}</span>
                  <Badge variant="outline">{stat.count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>الإجراءات السريعة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center"
              onClick={() => navigate('/motorcycle-management/motorcycles')}
            >
              <Bike className="h-6 w-6 mb-2" />
              <span>إدارة الدراجات</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center"
              onClick={() => navigate('/motorcycle-management/maintenance')}
            >
              <Wrench className="h-6 w-6 mb-2" />
              <span>إدارة الصيانة</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center"
              onClick={() => navigate('/motorcycle-management/drivers')}
            >
              <Users className="h-6 w-6 mb-2" />
              <span>إدارة السائقين</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center"
              onClick={() => navigate('/motorcycle-management/orders')}
            >
              <MapPin className="h-6 w-6 mb-2" />
              <span>طلبات التوصيل</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MotorcycleDashboard;
