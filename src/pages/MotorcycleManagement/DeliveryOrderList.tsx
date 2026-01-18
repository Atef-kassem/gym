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
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  Bike,
  Package
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  useGetAllDeliveryOrdersQuery,
  useDeleteDeliveryOrderMutation,
  useUpdateOrderStatusMutation
} from '@/services/deliveryOrderApi';
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

interface DeliveryOrder {
  id: number;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  orderDate: string;
  scheduledDeliveryDate: string;
  status: string;
  paymentStatus: string;
  priority: string;
  deliveryType: string;
  totalAmount: number;
  driverName?: string;
  motorcycleCode?: string;
  branchName: string;
}

const DeliveryOrderList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<DeliveryOrder | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Build query params
  const queryParams: any = {};
  if (statusFilter !== 'all') queryParams.status = statusFilter;
  if (paymentStatusFilter !== 'all') queryParams.paymentStatus = paymentStatusFilter;
  if (priorityFilter !== 'all') queryParams.priority = priorityFilter;

  // RTK Query hooks
  const hasFilters = Object.keys(queryParams).length > 0;
  const { data: ordersData, isLoading, refetch } = useGetAllDeliveryOrdersQuery(
    hasFilters ? queryParams : undefined
  );
  const [deleteOrder] = useDeleteDeliveryOrderMutation();
  const [updateStatus] = useUpdateOrderStatusMutation();

  // Filter data based on search term
  const orders = useMemo(() => {
    const allOrders = ordersData?.data?.deliveryOrders || [];
    if (!searchTerm) return allOrders;

    return allOrders.filter((order: any) =>
      order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerPhone?.includes(searchTerm) ||
      order.deliveryAddress?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [ordersData, searchTerm]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'جديد': return 'bg-blue-100 text-blue-800';
      case 'قيد التحضير': return 'bg-yellow-100 text-yellow-800';
      case 'جاهز للتوصيل': return 'bg-purple-100 text-purple-800';
      case 'في الطريق': return 'bg-orange-100 text-orange-800';
      case 'تم التوصيل': return 'bg-green-100 text-green-800';
      case 'ملغي': return 'bg-red-100 text-red-800';
      case 'مؤجل': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'جديد': return <Clock className="h-4 w-4" />;
      case 'قيد التحضير': return <AlertTriangle className="h-4 w-4" />;
      case 'جاهز للتوصيل': return <Clock className="h-4 w-4" />;
      case 'في الطريق': return <MapPin className="h-4 w-4" />;
      case 'تم التوصيل': return <CheckCircle className="h-4 w-4" />;
      case 'ملغي': return <XCircle className="h-4 w-4" />;
      case 'مؤجل': return <Clock className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'مدفوع': return 'bg-green-100 text-green-800';
      case 'غير مدفوع': return 'bg-red-100 text-red-800';
      case 'مدفوع جزئياً': return 'bg-yellow-100 text-yellow-800';
      case 'مسترد': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'عادي': return 'bg-gray-100 text-gray-800';
      case 'عاجل': return 'bg-orange-100 text-orange-800';
      case 'فائق العجلة': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteOrder(id).unwrap();
      toast.success('تم حذف طلب التوصيل بنجاح');
      setDeleteDialogOpen(false);
      refetch();
    } catch (error: any) {
      const errorMessage = error?.data?.message || 'حدث خطأ في حذف طلب التوصيل';
      toast.error(errorMessage);
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await updateStatus({ id, status: newStatus }).unwrap();
      toast.success('تم تحديث حالة الطلب بنجاح');
      refetch();
    } catch (error: any) {
      const errorMessage = error?.data?.message || 'حدث خطأ في تحديث حالة الطلب';
      toast.error(errorMessage);
    }
  };

  const formatDate = (dateString: string) => {
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
          <h1 className="text-3xl font-bold text-gray-900">طلبات التوصيل</h1>
          <p className="text-gray-600 mt-2">إدارة جميع طلبات التوصيل في النظام</p>
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
          <Button onClick={() => navigate('/motorcycle-management/orders/new')}>
            <Plus className="h-4 w-4 mr-2" />
            طلب توصيل جديد
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
                placeholder="البحث في الطلبات..."
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
                <SelectItem value="جديد">جديد</SelectItem>
                <SelectItem value="قيد التحضير">قيد التحضير</SelectItem>
                <SelectItem value="جاهز للتوصيل">جاهز للتوصيل</SelectItem>
                <SelectItem value="في الطريق">في الطريق</SelectItem>
                <SelectItem value="تم التوصيل">تم التوصيل</SelectItem>
                <SelectItem value="ملغي">ملغي</SelectItem>
              </SelectContent>
            </Select>

            <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="فلترة حسب الدفع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع حالات الدفع</SelectItem>
                <SelectItem value="مدفوع">مدفوع</SelectItem>
                <SelectItem value="غير مدفوع">غير مدفوع</SelectItem>
                <SelectItem value="مدفوع جزئياً">مدفوع جزئياً</SelectItem>
                <SelectItem value="مسترد">مسترد</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="فلترة حسب الأولوية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأولويات</SelectItem>
                <SelectItem value="عادي">عادي</SelectItem>
                <SelectItem value="عاجل">عاجل</SelectItem>
                <SelectItem value="فائق العجلة">فائق العجلة</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="w-full">
              <Filter className="h-4 w-4 mr-2" />
              فلترة متقدمة
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>طلبات التوصيل ({orders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>رقم الطلب</TableHead>
                  <TableHead>العميل</TableHead>
                  <TableHead>عنوان التوصيل</TableHead>
                  <TableHead>تاريخ الطلب</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>حالة الدفع</TableHead>
                  <TableHead>الأولوية</TableHead>
                  <TableHead>المبلغ</TableHead>
                  <TableHead>السائق</TableHead>
                  <TableHead>الدراجة</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Package className="h-12 w-12 text-gray-400" />
                        <p className="text-gray-500 text-lg">لا يوجد طلبات توصيل حالياً</p>
                        <p className="text-gray-400 text-sm">قم بإضافة طلب توصيل جديد من زر "طلب توصيل جديد" أعلاه</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order:  DeliveryOrder | any) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.orderNumber}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.customerName}</div>
                        <div className="text-sm text-gray-500">{order.customerPhone}</div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{order.deliveryAddress}</TableCell>
                    <TableCell>{formatDate(order.orderDate)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(order.status)}
                          {order.status}
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                        {order.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(order.priority)}>
                        {order.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>{order.totalAmount ? Number(order.totalAmount).toFixed(2) : '0.00'} جنيه</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {order.driver?.name || '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Bike className="h-4 w-4" />
                        {order.motorcycle?.motorcycleCode || '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/motorcycle-management/orders/${order.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/motorcycle-management/orders/${order.id}/edit`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedOrder(order);
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
              هل أنت متأكد من حذف طلب التوصيل {selectedOrder?.orderNumber}؟
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
              onClick={() => selectedOrder && handleDelete(selectedOrder.id)}
            >
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeliveryOrderList;
