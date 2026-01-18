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
  Wrench,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Bike,
  MapPin
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  useGetAllMaintenancesQuery,
  useDeleteMaintenanceMutation,
  useUpdateMaintenanceStatusMutation
} from '@/services/maintenanceApi';
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

interface MaintenanceRecord {
  id: number;
  maintenanceCode: string;
  motorcycleCode: string;
  motorcycleBrand: string;
  motorcycleModel: string;
  maintenanceType: string;
  maintenanceDate: string;
  description: string;
  cost: number;
  laborCost: number;
  partsCost: number;
  workshopName: string;
  technicianName: string;
  status: string;
  nextMaintenanceDate: string;
  branchName: string;
}

const MaintenanceList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedMaintenance, setSelectedMaintenance] = useState<MaintenanceRecord | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Build query params
  const queryParams: any = {};
  if (statusFilter !== 'all') queryParams.status = statusFilter;
  if (typeFilter !== 'all') queryParams.maintenanceType = typeFilter;

  // RTK Query hooks
  const hasFilters = Object.keys(queryParams).length > 0;
  const { data: maintenancesData, isLoading, refetch } = useGetAllMaintenancesQuery(
    hasFilters ? queryParams : undefined
  );
  const [deleteMaintenance] = useDeleteMaintenanceMutation();
  const [updateStatus] = useUpdateMaintenanceStatusMutation();

  // Filter data based on search term
  const maintenances = useMemo(() => {
    const allMaintenances = maintenancesData?.data?.maintenances || [];
    if (!searchTerm) return allMaintenances;

    return allMaintenances.filter((maintenance: any) =>
      maintenance.maintenanceCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      maintenance.motorcycle?.motorcycleCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      maintenance.motorcycle?.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      maintenance.motorcycle?.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      maintenance.workshopName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      maintenance.technicianName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [maintenancesData, searchTerm]);


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'مجدولة': return 'bg-blue-100 text-blue-800';
      case 'قيد التنفيذ': return 'bg-yellow-100 text-yellow-800';
      case 'مكتملة': return 'bg-green-100 text-green-800';
      case 'ملغاة': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'مجدولة': return <Calendar className="h-4 w-4" />;
      case 'قيد التنفيذ': return <Clock className="h-4 w-4" />;
      case 'مكتملة': return <CheckCircle className="h-4 w-4" />;
      case 'ملغاة': return <XCircle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'صيانة دورية': return 'bg-green-100 text-green-800';
      case 'صيانة طارئة': return 'bg-red-100 text-red-800';
      case 'إصلاح': return 'bg-orange-100 text-orange-800';
      case 'فحص': return 'bg-blue-100 text-blue-800';
      case 'تنظيف': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMaintenance(id).unwrap();
      toast.success('تم حذف سجل الصيانة بنجاح');
      setDeleteDialogOpen(false);
      refetch();
    } catch (error: any) {
      const errorMessage = error?.data?.message || 'حدث خطأ في حذف سجل الصيانة';
      toast.error(errorMessage);
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await updateStatus({ id, status: newStatus }).unwrap();
      toast.success('تم تحديث حالة الصيانة بنجاح');
      refetch();
    } catch (error: any) {
      const errorMessage = error?.data?.message || 'حدث خطأ في تحديث حالة الصيانة';
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
          <h1 className="text-3xl font-bold text-gray-900">سجلات الصيانة</h1>
          <p className="text-gray-600 mt-2">إدارة جميع سجلات صيانة الدراجات النارية</p>
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
          <Button onClick={() => navigate('/motorcycle-management/maintenance/new')}>
            <Plus className="h-4 w-4 mr-2" />
            إضافة سجل صيانة
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
                placeholder="البحث في سجلات الصيانة..."
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
                <SelectItem value="مجدولة">مجدولة</SelectItem>
                <SelectItem value="قيد التنفيذ">قيد التنفيذ</SelectItem>
                <SelectItem value="مكتملة">مكتملة</SelectItem>
                <SelectItem value="ملغاة">ملغاة</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="فلترة حسب النوع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                <SelectItem value="صيانة دورية">صيانة دورية</SelectItem>
                <SelectItem value="صيانة طارئة">صيانة طارئة</SelectItem>
                <SelectItem value="إصلاح">إصلاح</SelectItem>
                <SelectItem value="فحص">فحص</SelectItem>
                <SelectItem value="تنظيف">تنظيف</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="w-full">
              <Filter className="h-4 w-4 mr-2" />
              فلترة متقدمة
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Maintenances Table */}
      <Card>
        <CardHeader>
          <CardTitle>سجلات الصيانة ({maintenances.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>رمز الصيانة</TableHead>
                  <TableHead>الدراجة النارية</TableHead>
                  <TableHead>نوع الصيانة</TableHead>
                  <TableHead>تاريخ الصيانة</TableHead>
                  <TableHead>الوصف</TableHead>
                  <TableHead>التكلفة</TableHead>
                  <TableHead>الورشة</TableHead>
                  <TableHead>الفني</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>الصيانة القادمة</TableHead>
                  <TableHead>الفرع</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {maintenances.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={12} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Wrench className="h-12 w-12 text-gray-400" />
                        <p className="text-gray-500 text-lg">لا يوجد سجلات صيانة حالياً</p>
                        <p className="text-gray-400 text-sm">قم بإضافة سجل صيانة جديد من زر "إضافة سجل صيانة" أعلاه</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  maintenances.map((maintenance: any) => (
                  <TableRow key={maintenance.id}>
                    <TableCell className="font-medium">{maintenance.maintenanceCode}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{maintenance.motorcycle?.motorcycleCode || '-'}</div>
                        <div className="text-sm text-gray-500">
                          {maintenance.motorcycle?.brand} {maintenance.motorcycle?.model}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(maintenance.maintenanceType)}>
                        {maintenance.maintenanceType}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(maintenance.maintenanceDate)}</TableCell>
                    <TableCell className="max-w-xs truncate">{maintenance.description}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {maintenance.cost ? Number(maintenance.cost).toFixed(2) : '0.00'} جنيه
                      </div>
                    </TableCell>
                    <TableCell>{maintenance.workshopName || '-'}</TableCell>
                    <TableCell>{maintenance.technicianName || '-'}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(maintenance.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(maintenance.status)}
                          {maintenance.status}
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell>{maintenance.nextMaintenanceDate ? formatDate(maintenance.nextMaintenanceDate) : '-'}</TableCell>
                    <TableCell>{maintenance.branch?.arabicName || maintenance.branch?.englishName || '-'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/motorcycle-management/maintenance/${maintenance.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/motorcycle-management/maintenance/${maintenance.id}/edit`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedMaintenance(maintenance);
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
              هل أنت متأكد من حذف سجل الصيانة {selectedMaintenance?.maintenanceCode}؟
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
              onClick={() => selectedMaintenance && handleDelete(selectedMaintenance.id)}
            >
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MaintenanceList;
