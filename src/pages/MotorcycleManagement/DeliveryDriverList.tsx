import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  RefreshCw,
  Edit,
  Trash2,
  Eye,
  Users,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Award,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  useGetAllDeliveryDriversQuery,
  useDeleteDeliveryDriverMutation
} from '@/services/deliveryDriverApi';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface DeliveryDriver {
  id: number;
  driverCode: string;
  name: string;
  phone: string;
  email: string;
  licenseNumber: string;
  licenseType: string;
  licenseExpiry: string;
  status: string;
  isAvailable: boolean;
  totalDeliveries: number;
  successfulDeliveries: number;
  averageRating: number;
  totalEarnings: number;
  lastActiveTime?: string;
  branch?: {
    arabicName?: string;
    englishName?: string;
  };
}

const DeliveryDriverList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [licenseTypeFilter, setLicenseTypeFilter] = useState('all');
  const [selectedDriver, setSelectedDriver] = useState<DeliveryDriver | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Build query params
  const queryParams: any = {};
  if (statusFilter !== 'all') queryParams.status = statusFilter;
  if (availabilityFilter !== 'all') queryParams.isAvailable = availabilityFilter === 'available';
  if (licenseTypeFilter !== 'all') queryParams.licenseType = licenseTypeFilter;

  // RTK Query hooks - pass undefined if no filters
  const hasFilters = Object.keys(queryParams).length > 0;
  const { data: driversData, isLoading, refetch } = useGetAllDeliveryDriversQuery(
    hasFilters ? queryParams : undefined
  );
  const [deleteDriver] = useDeleteDeliveryDriverMutation();

  // Filter data based on search term
  const drivers = React.useMemo(() => {
    const allDrivers = driversData?.data?.drivers || [];
    if (!searchTerm) return allDrivers;

    return allDrivers.filter((driver: any) =>
      driver.driverCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.phone?.includes(searchTerm) ||
      driver.licenseNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [driversData, searchTerm]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'نشط': return 'bg-green-100 text-green-800';
      case 'غير نشط': return 'bg-gray-100 text-gray-800';
      case 'إجازة': return 'bg-blue-100 text-blue-800';
      case 'معلق': return 'bg-yellow-100 text-yellow-800';
      case 'مستقيل': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'نشط': return <CheckCircle className="h-4 w-4" />;
      case 'غير نشط': return <XCircle className="h-4 w-4" />;
      case 'إجازة': return <Clock className="h-4 w-4" />;
      case 'معلق': return <AlertTriangle className="h-4 w-4" />;
      case 'مستقيل': return <XCircle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getAvailabilityColor = (isAvailable: boolean) => {
    return isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getAvailabilityIcon = (isAvailable: boolean) => {
    return isAvailable ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />;
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteDriver(id).unwrap();
      toast.success('تم حذف السائق بنجاح');
      setDeleteDialogOpen(false);
      refetch();
    } catch (error: any) {
      const errorMessage = error?.data?.message || 'حدث خطأ في حذف السائق';
      toast.error(errorMessage);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">سائقي التوصيل</h1>
          <p className="text-gray-600 mt-2">إدارة جميع سائقي التوصيل في النظام</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            تحديث
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            تصدير
          </Button>
          <Button onClick={() => navigate('/motorcycle-management/drivers/new')}>
            <Plus className="h-4 w-4 mr-2" />
            إضافة سائق
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="البحث في السائقين..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="فلترة حسب الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="نشط">نشط</SelectItem>
                <SelectItem value="غير نشط">غير نشط</SelectItem>
                <SelectItem value="إجازة">إجازة</SelectItem>
                <SelectItem value="معلق">معلق</SelectItem>
                <SelectItem value="مستقيل">مستقيل</SelectItem>
              </SelectContent>
            </Select>

            <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="فلترة حسب التوفر" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="available">متاح</SelectItem>
                <SelectItem value="unavailable">غير متاح</SelectItem>
              </SelectContent>
            </Select>

            <Select value={licenseTypeFilter} onValueChange={setLicenseTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="فلترة حسب نوع الرخصة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                <SelectItem value="دراجة نارية">دراجة نارية</SelectItem>
                <SelectItem value="مشروب">مشروب</SelectItem>
                <SelectItem value="شاحنة صغيرة">شاحنة صغيرة</SelectItem>
                <SelectItem value="شاحنة كبيرة">شاحنة كبيرة</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="w-full">
              <Filter className="h-4 w-4 mr-2" />
              فلترة متقدمة
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Drivers Table */}
      <Card>
        <CardHeader>
          <CardTitle>سائقي التوصيل ({drivers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الرمز</TableHead>
                  <TableHead>الاسم</TableHead>
                  <TableHead>رقم الهاتف</TableHead>
                  <TableHead>رقم الرخصة</TableHead>
                  <TableHead>نوع الرخصة</TableHead>
                  <TableHead>انتهاء الرخصة</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>التوفر</TableHead>
                  <TableHead>التوصيلات</TableHead>
                  <TableHead>التقييم</TableHead>
                  <TableHead>الأرباح</TableHead>
                  <TableHead>آخر نشاط</TableHead>
                  <TableHead>الفرع</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {drivers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={14} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Users className="h-12 w-12 text-gray-400" />
                        <p className="text-gray-500 text-lg">لا يوجد سائقين حالياً</p>
                        <p className="text-gray-400 text-sm">قم بإضافة سائق جديد من زر "إضافة سائق" أعلاه</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  drivers.map((driver: DeliveryDriver) => (
                  <TableRow key={driver.id}>
                    <TableCell className="font-medium">{driver.driverCode}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{driver.name}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {driver.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {driver.phone}
                      </div>
                    </TableCell>
                    <TableCell>{driver.licenseNumber}</TableCell>
                    <TableCell>{driver.licenseType}</TableCell>
                    <TableCell>{formatDate(driver.licenseExpiry)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(driver.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(driver.status)}
                          {driver.status}
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getAvailabilityColor(driver.isAvailable)}>
                        <div className="flex items-center gap-1">
                          {getAvailabilityIcon(driver.isAvailable)}
                          {driver.isAvailable ? 'متاح' : 'غير متاح'}
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{driver.successfulDeliveries || 0}/{driver.totalDeliveries || 0}</div>
                        <div className="text-sm text-gray-500">
                          {driver.totalDeliveries > 0 
                            ? ((driver.successfulDeliveries / driver.totalDeliveries) * 100).toFixed(1)
                            : '0.0'}%
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Award className="h-4 w-4" />
                        {driver.averageRating ? Number(driver.averageRating).toFixed(1) : '0.0'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        {(driver.totalEarnings || 0).toLocaleString()} جنيه
                      </div>
                    </TableCell>
                    <TableCell>{driver.lastActiveTime ? formatDateTime(driver.lastActiveTime) : '-'}</TableCell>
                    <TableCell>{driver.branch?.arabicName || driver.branch?.englishName || '-'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/motorcycle-management/drivers/${driver.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/motorcycle-management/drivers/${driver.id}/edit`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedDriver(driver);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من حذف السائق {selectedDriver?.name}؟
              <br />
              <span className="text-red-600 font-medium">هذا الإجراء لا يمكن التراجع عنه.</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              إلغاء
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => selectedDriver && handleDelete(selectedDriver.id)}
            >
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeliveryDriverList;
