import React, { useState, useMemo } from 'react';
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
  Bike,
  MapPin,
  Wrench,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  useGetAllMotorcyclesQuery,
  useDeleteMotorcycleMutation,
  useUpdateMotorcycleStatusMutation
} from '@/services/motorcycleApi';
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
  DialogTrigger,
} from '@/components/ui/dialog';

interface Motorcycle {
  id: number;
  motorcycleCode: string;
  plateNumber: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  fuelType: string;
  status: string;
  mileage: number;
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  driverName?: string;
  branchName: string;
}

const MotorcycleList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [fuelTypeFilter, setFuelTypeFilter] = useState('all');
  const [selectedMotorcycle, setSelectedMotorcycle] = useState<Motorcycle | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // RTK Query hooks
  const { data: motorcyclesData, isLoading, refetch } = useGetAllMotorcyclesQuery({
    page: 1,
    limit: 100
  });
  const [deleteMotorcycle] = useDeleteMotorcycleMutation();
  const [updateStatus] = useUpdateMotorcycleStatusMutation();

  // Filter motorcycles based on search and filters
  const motorcycles = useMemo(() => {
    const rawMotorcycles = motorcyclesData?.data?.motorcycles || motorcyclesData?.motorcycles || [];
    
    let filteredData = rawMotorcycles.map((m: any) => ({
      id: m.id,
      motorcycleCode: m.motorcycleCode,
      plateNumber: m.plateNumber,
      brand: m.brand,
      model: m.model,
      year: m.year,
      color: m.color || '-',
      fuelType: m.fuelType,
      status: m.status,
      mileage: m.mileage || 0,
      lastMaintenanceDate: m.lastMaintenanceDate || '-',
      nextMaintenanceDate: m.nextMaintenanceDate || '-',
      driverName: m.driver?.name || '-',
      branchName: m.branch?.arabicName || '-'
    }));

    if (searchTerm) {
      filteredData = filteredData.filter((motorcycle: Motorcycle) =>
        motorcycle.motorcycleCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        motorcycle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        motorcycle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        motorcycle.model.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filteredData = filteredData.filter((motorcycle: Motorcycle) => motorcycle.status === statusFilter);
    }

    if (fuelTypeFilter !== 'all') {
      filteredData = filteredData.filter((motorcycle: Motorcycle) => motorcycle.fuelType === fuelTypeFilter);
    }

    return filteredData;
  }, [motorcyclesData, searchTerm, statusFilter, fuelTypeFilter]);

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

  const handleDelete = async (id: number) => {
    try {
      await deleteMotorcycle(id).unwrap();
      toast.success('تم حذف الدراجة النارية بنجاح');
      setDeleteDialogOpen(false);
      refetch();
    } catch (error: any) {
      console.error('Error deleting motorcycle:', error);
      const errorMessage = error.data?.message || 'خطأ في حذف الدراجة النارية';
      toast.error(errorMessage);
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await updateStatus({ id, status: newStatus }).unwrap();
      toast.success('تم تحديث حالة الدراجة النارية بنجاح');
      refetch();
    } catch (error: any) {
      console.error('Error updating status:', error);
      const errorMessage = error.data?.message || 'خطأ في تحديث الحالة';
      toast.error(errorMessage);
    }
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
          <h1 className="text-3xl font-bold text-gray-900">قائمة الدراجات النارية</h1>
          <p className="text-gray-600 mt-2">إدارة جميع الدراجات النارية في النظام</p>
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
          <Button onClick={() => navigate('/motorcycle-management/motorcycles/new')}>
            <Plus className="h-4 w-4 mr-2" />
            إضافة دراجة
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="البحث في الدراجات..."
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
                <SelectItem value="متاح">متاح</SelectItem>
                <SelectItem value="في الخدمة">في الخدمة</SelectItem>
                <SelectItem value="صيانة">صيانة</SelectItem>
                <SelectItem value="معطل">معطل</SelectItem>
              </SelectContent>
            </Select>

            <Select value={fuelTypeFilter} onValueChange={setFuelTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="فلترة حسب نوع الوقود" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                <SelectItem value="بنزين">بنزين</SelectItem>
                <SelectItem value="ديزل">ديزل</SelectItem>
                <SelectItem value="كهربائي">كهربائي</SelectItem>
                <SelectItem value="هجين">هجين</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="w-full">
              <Filter className="h-4 w-4 mr-2" />
              فلترة متقدمة
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Motorcycles Table */}
      <Card>
        <CardHeader>
          <CardTitle>الدراجات النارية ({motorcycles.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الرمز</TableHead>
                  <TableHead>رقم اللوحة</TableHead>
                  <TableHead>الماركة/الموديل</TableHead>
                  <TableHead>السنة</TableHead>
                  <TableHead>اللون</TableHead>
                  <TableHead>نوع الوقود</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>المسافة</TableHead>
                  <TableHead>السائق</TableHead>
                  <TableHead>الفرع</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {motorcycles.map((motorcycle) => (
                  <TableRow key={motorcycle.id}>
                    <TableCell className="font-medium">{motorcycle.motorcycleCode}</TableCell>
                    <TableCell>{motorcycle.plateNumber}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{motorcycle.brand}</div>
                        <div className="text-sm text-gray-500">{motorcycle.model}</div>
                      </div>
                    </TableCell>
                    <TableCell>{motorcycle.year}</TableCell>
                    <TableCell>{motorcycle.color}</TableCell>
                    <TableCell>{motorcycle.fuelType}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(motorcycle.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(motorcycle.status)}
                          {motorcycle.status}
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell>{motorcycle.mileage.toLocaleString()} كم</TableCell>
                    <TableCell>{motorcycle.driverName || '-'}</TableCell>
                    <TableCell>{motorcycle.branchName}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/motorcycle-management/motorcycles/${motorcycle.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/motorcycle-management/motorcycles/${motorcycle.id}/edit`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedMotorcycle(motorcycle);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
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
              هل أنت متأكد من حذف الدراجة النارية {selectedMotorcycle?.motorcycleCode}؟
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
              onClick={() => selectedMotorcycle && handleDelete(selectedMotorcycle.id)}
            >
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MotorcycleList;
