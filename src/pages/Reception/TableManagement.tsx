import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table as TableIcon, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  MapPin,
  Users,
  Clock,
  Settings,
  CheckCircle,
  AlertCircle,
  Eye,
  MoreHorizontal,
  Building2,
  User,
  Square
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useTableManagement } from '@/hooks/useTableManagement';
import { useGetAllBranchesQuery } from '@/services/branchesApi';

// أنواع البيانات
interface TableData {
  id: string;
  tableNumber: string;
  name: string;
  branchId: string;
  branchName: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  location: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface Branch {
  id: string;
  name: string;
  arabicName?: string;
  englishName?: string;
  address: string;
  status: 'active' | 'inactive';
}

// البيانات التجريبية (تم إزالتها - نستخدم البيانات الحقيقية من API)

const mockTables: TableData[] = [
  {
    id: '1',
    tableNumber: 'T001',
    name: 'طاولة VIP 1',
    branchId: '1',
    branchName: 'الفرع الرئيسي',
    capacity: 6,
    status: 'available',
    location: 'الطابق الأول - منطقة VIP',
    description: 'طاولة VIP مع إطلالة مميزة',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    tableNumber: 'T002',
    name: 'طاولة عائلية 1',
    branchId: '1',
    branchName: 'الفرع الرئيسي',
    capacity: 8,
    status: 'occupied',
    location: 'الطابق الأرضي - المنطقة العائلية',
    description: 'طاولة مناسبة للعائلات الكبيرة',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '3',
    tableNumber: 'T003',
    name: 'طاولة فردية 1',
    branchId: '2',
    branchName: 'فرع الخبر',
    capacity: 2,
    status: 'available',
    location: 'الطابق الأول - منطقة الأفراد',
    description: 'طاولة مناسبة للأفراد والأزواج',
    createdAt: '2024-01-16',
    updatedAt: '2024-01-16'
  },
  {
    id: '4',
    tableNumber: 'T004',
    name: 'طاولة جماعية 1',
    branchId: '3',
    branchName: 'فرع جدة',
    capacity: 10,
    status: 'reserved',
    location: 'الطابق الثاني - المنطقة الجماعية',
    description: 'طاولة مناسبة للمجموعات الكبيرة',
    createdAt: '2024-01-17',
    updatedAt: '2024-01-17'
  }
];

export default function TableManagement() {
  // استخدام hook إدارة الطاولات
  const {
    tables: rawTables,
    loading,
    error,
    fetchTables,
    addTable,
    updateTable,
    deleteTable,
    fetchTableStats
  } = useTableManagement();

  // تحويل البيانات إلى النوع الصحيح
  const tables: TableData[] = Array.isArray(rawTables) ? rawTables : [];

  // جلب الفروع من API
  const { data: branchesData, isLoading: branchesLoading, error: branchesError } = useGetAllBranchesQuery(undefined as any);
  const branches = Array.isArray(branchesData?.data) ? [...branchesData.data] : [];

  // Debug: Log branches and tables data
  console.log("🔍 TableManagement - Branches API Response:", branchesData);
  console.log("🔍 TableManagement - Branches:", branches);
  console.log("🔍 TableManagement - Branches Loading:", branchesLoading);
  console.log("🔍 TableManagement - Branches Error:", branchesError);
  console.log("🔍 TableManagement - Raw Tables:", rawTables);
  console.log("🔍 TableManagement - Tables:", tables);
  console.log("🔍 TableManagement - Tables Loading:", loading);
  console.log("🔍 TableManagement - Tables Error:", error);

  // State management
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<TableData | null>(null);
  const [editingTable, setEditingTable] = useState<Partial<TableData>>({});
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    occupied: 0,
    reserved: 0,
    maintenance: 0
  });

  // تحميل الإحصائيات
  useEffect(() => {
    const loadStats = async () => {
      try {
        const statsData = await fetchTableStats(null); 
        setStats(statsData);
      } catch (err) {
        console.error('Error loading stats:', err);
      }
    };
    loadStats();
  }, [tables]);

  // تحميل جميع الطاولات عند فتح الصفحة
  useEffect(() => {
    console.log('🔄 Loading all tables...');
    fetchTables({}); // جلب جميع الطاولات بدون فلاتر
  }, [fetchTables]);

  // استخدام الطاولات مباشرة من API (الفلترة تتم في الـ Backend)
  const filteredTables = tables;
  
  console.log("🔍 TableManagement - Final Tables to Display:", filteredTables);
  console.log("🔍 TableManagement - Number of Tables:", filteredTables.length);

  // إضافة طاولة جديدة
  const handleAddTable = async () => {
    if (!editingTable.tableNumber || !editingTable.name || !editingTable.branchId || !editingTable.capacity) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    try {
      const newTable = await addTable({
        tableNumber: editingTable.tableNumber!,
        name: editingTable.name!,
        branchId: editingTable.branchId!,
        capacity: editingTable.capacity!,
        status: editingTable.status as TableData['status'] || 'available',
        location: editingTable.location || '',
        description: editingTable.description || ''
      });

      setIsAddDialogOpen(false);
      setEditingTable({});
      toast({
        title: "تم إضافة الطاولة بنجاح",
        description: `تم إضافة طاولة ${newTable.name} بنجاح`
      });
    } catch (error) {
      toast({
        title: "خطأ في إضافة الطاولة",
        description: error instanceof Error ? error.message : "حدث خطأ غير متوقع",
        variant: "destructive"
      });
    }
  };

  // تعديل طاولة
  const handleEditTable = async () => {
    if (!editingTable.tableNumber || !editingTable.name || !editingTable.branchId || !editingTable.capacity) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    try {
      const updatedTable = await updateTable(selectedTable!.id, {
        tableNumber: editingTable.tableNumber!,
        name: editingTable.name!,
        branchId: editingTable.branchId!,
        capacity: editingTable.capacity!,
        status: editingTable.status as TableData['status'] || selectedTable!.status,
        location: editingTable.location || selectedTable!.location,
        description: editingTable.description || selectedTable!.description
      });

      setIsEditDialogOpen(false);
      setSelectedTable(null);
      setEditingTable({});
      toast({
        title: "تم تعديل الطاولة بنجاح",
        description: `تم تعديل طاولة ${updatedTable.name} بنجاح`
      });
    } catch (error) {
      toast({
        title: "خطأ في تعديل الطاولة",
        description: error instanceof Error ? error.message : "حدث خطأ غير متوقع",
        variant: "destructive"
      });
    }
  };

  // حذف طاولة
  const handleDeleteTable = async () => {
    try {
      await deleteTable(selectedTable!.id);
      setIsDeleteDialogOpen(false);
      setSelectedTable(null);
      toast({
        title: "تم حذف الطاولة بنجاح",
        description: `تم حذف طاولة ${selectedTable?.name} بنجاح`
      });
    } catch (error) {
      toast({
        title: "خطأ في حذف الطاولة",
        description: error instanceof Error ? error.message : "حدث خطأ غير متوقع",
        variant: "destructive"
      });
    }
  };

  // فتح نموذج التعديل
  const openEditDialog = (table: TableData) => {
    setSelectedTable(table);
    setEditingTable({
      tableNumber: table.tableNumber,
      name: table.name,
      branchId: table.branchId,
      capacity: table.capacity,
      status: table.status,
      location: table.location,
      description: table.description
    });
    setIsEditDialogOpen(true);
  };

  // فتح نموذج الحذف
  const openDeleteDialog = (table: TableData) => {
    setSelectedTable(table);
    setIsDeleteDialogOpen(true);
  };

  // الحصول على لون الحالة
  const getStatusColor = (status: TableData['status']) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 border-green-200';
      case 'occupied': return 'bg-red-100 text-red-800 border-red-200';
      case 'reserved': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'maintenance': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // الحصول على نص الحالة
  const getStatusText = (status: TableData['status']) => {
    switch (status) {
      case 'available': return 'متاحة';
      case 'occupied': return 'مشغولة';
      case 'reserved': return 'محجوزة';
      case 'maintenance': return 'صيانة';
      default: return 'غير محدد';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="p-6 rounded-xl border shadow-lg bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-full">
              <TableIcon className="h-6 w-6 text-primary" />
              <User className="h-5 w-5 text-primary/70" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                إدارة الطاولات
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">
                إدارة شاملة لجميع الطاولات في الفروع مع إمكانية إضافة وتعديل وحذف الطاولات
              </p>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  <span>ربط بالفروع</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>عدد الكج.مي</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Settings className="h-4 w-4" />
                  <span>إدارة متقدمة</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display for Branches */}
        {branchesError && (
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium">خطأ في تحميل الفروع</span>
              </div>
              <p className="text-sm text-red-500 mt-1">
                {(() => {
                  if ('message' in branchesError) return branchesError.message;
                  if ('data' in branchesError && branchesError.data && typeof branchesError.data === 'object' && 'message' in branchesError.data) {
                    return (branchesError.data as any).message;
                  }
                  return "حدث خطأ أثناء تحميل الفروع";
                })()}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Loading Display for Branches */}
        {branchesLoading && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-blue-600">
                <Clock className="h-5 w-5 animate-spin" />
                <span className="font-medium">جاري تحميل الفروع...</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* الإحصائيات السريعة */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي الطاولات</CardTitle>
              <TableIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">متاحة</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.available}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">مشغولة</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.occupied}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">محجوزة</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.reserved}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">صيانة</CardTitle>
              <Settings className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">{stats.maintenance}</div>
            </CardContent>
          </Card>
        </div>

        {/* الفلاتر والإجراءات */}
        <Card>
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <CardTitle>إدارة الطاولات</CardTitle>
                <CardDescription>
                  عرض وإدارة جميع الطاولات في النظام
                </CardDescription>
              </div>
              <Button onClick={() => setIsAddDialogOpen(true)} className="w-fit">
                <Plus className="h-4 w-4 ml-2" />
                إضافة طاولة جديدة
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* جدول الطاولات */}
            <div className="rounded-md border">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Clock className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                    <p className="text-muted-foreground">جاري تحميل الطاولات...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                    <p className="text-red-600 font-medium">خطأ في تحميل الطاولات</p>
                    <p className="text-sm text-muted-foreground mt-1">{error}</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => fetchTables({})}
                    >
                      إعادة المحاولة
                    </Button>
                  </div>
                </div>
              ) : filteredTables.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <TableIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-30" />
                    <p className="text-lg font-medium text-muted-foreground">لا توجد طاولات</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {tables.length === 0 
                        ? "لم يتم إضافة أي طاولات بعد. ابدأ بإضافة طاولة جديدة."
                        : "لا توجد نتائج تطابق الفلاتر المحددة."
                      }
                    </p>
                    <Button 
                      variant="default" 
                      className="mt-4"
                      onClick={() => setIsAddDialogOpen(true)}
                    >
                      <Plus className="h-4 w-4 ml-2" />
                      إضافة طاولة جديدة
                    </Button>
                  </div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>رقم الطاولة</TableHead>
                      <TableHead>اسم الطاولة</TableHead>
                      <TableHead>الفرع</TableHead>
                      <TableHead>الموقع</TableHead>
                      <TableHead>عدد الكج.مي</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTables.map((table: any) => (
                      <TableRow key={table.id}>
                        <TableCell className="font-medium">{table.tableNumber}</TableCell>
                        <TableCell>{table.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            {table.branchName}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            {table.location}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Square className="h-4 w-4 text-muted-foreground" />
                            {table.capacity} كرسي
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(table.status)}>
                            {getStatusText(table.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditDialog(table)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openDeleteDialog(table)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </CardContent>
        </Card>

        {/* نموذج إضافة طاولة جديدة */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>إضافة طاولة جديدة</DialogTitle>
              <DialogDescription>
                أدخل بيانات الطاولة الجديدة
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="tableNumber">رقم الطاولة *</Label>
                <Input
                  id="tableNumber"
                  value={editingTable.tableNumber || ''}
                  onChange={(e) => setEditingTable({ ...editingTable, tableNumber: e.target.value })}
                  placeholder="T001"
                />
              </div>
              <div>
                <Label htmlFor="tableName">اسم الطاولة *</Label>
                <Input
                  id="tableName"
                  value={editingTable.name || ''}
                  onChange={(e) => setEditingTable({ ...editingTable, name: e.target.value })}
                  placeholder="طاولة VIP 1"
                />
              </div>
              <div>
                <Label htmlFor="branch">الفرع *</Label>
                <Select value={String(editingTable.branchId || '')} onValueChange={(value) => setEditingTable({ ...editingTable, branchId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الفرع" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branch) => (
                      <SelectItem key={branch.id} value={String(branch.id)}>
                        {branch.arabicName || branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="capacity">عدد الكج.مي *</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={editingTable.capacity || ''}
                  onChange={(e) => setEditingTable({ ...editingTable, capacity: parseInt(e.target.value) })}
                  placeholder="6"
                  min="1"
                  max="20"
                />
              </div>
              <div>
                <Label htmlFor="location">الموقع</Label>
                <Input
                  id="location"
                  value={editingTable.location || ''}
                  onChange={(e) => setEditingTable({ ...editingTable, location: e.target.value })}
                  placeholder="الطابق الأول - منطقة VIP"
                />
              </div>
              <div>
                <Label htmlFor="description">الوصف</Label>
                <Input
                  id="description"
                  value={editingTable.description || ''}
                  onChange={(e) => setEditingTable({ ...editingTable, description: e.target.value })}
                  placeholder="وصف الطاولة"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={handleAddTable}>
                إضافة الطاولة
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* نموذج تعديل الطاولة */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>تعديل الطاولة</DialogTitle>
              <DialogDescription>
                تعديل بيانات الطاولة
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="editTableNumber">رقم الطاولة *</Label>
                <Input
                  id="editTableNumber"
                  value={editingTable.tableNumber || ''}
                  onChange={(e) => setEditingTable({ ...editingTable, tableNumber: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="editTableName">اسم الطاولة *</Label>
                <Input
                  id="editTableName"
                  value={editingTable.name || ''}
                  onChange={(e) => setEditingTable({ ...editingTable, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="editBranch">الفرع *</Label>
                <Select value={String(editingTable.branchId || '')} onValueChange={(value) => setEditingTable({ ...editingTable, branchId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الفرع" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branch) => (
                      <SelectItem key={branch.id} value={String(branch.id)}>
                        {branch.arabicName || branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="editCapacity">عدد الكج.مي *</Label>
                <Input
                  id="editCapacity"
                  type="number"
                  value={editingTable.capacity || ''}
                  onChange={(e) => setEditingTable({ ...editingTable, capacity: parseInt(e.target.value) })}
                  min="1"
                  max="20"
                />
              </div>
              <div>
                <Label htmlFor="editLocation">الموقع</Label>
                <Input
                  id="editLocation"
                  value={editingTable.location || ''}
                  onChange={(e) => setEditingTable({ ...editingTable, location: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="editStatus">الحالة</Label>
                <Select value={editingTable.status || 'available'} onValueChange={(value) => setEditingTable({ ...editingTable, status: value as TableData['status'] })}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">متاحة</SelectItem>
                    <SelectItem value="occupied">مشغولة</SelectItem>
                    <SelectItem value="reserved">محجوزة</SelectItem>
                    <SelectItem value="maintenance">صيانة</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="editDescription">الوصف</Label>
                <Input
                  id="editDescription"
                  value={editingTable.description || ''}
                  onChange={(e) => setEditingTable({ ...editingTable, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={handleEditTable}>
                حفظ التغييرات
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* نموذج تأكيد الحذف */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
              <AlertDialogDescription>
                هل أنت متأكد من حذف الطاولة "{selectedTable?.name}"؟ 
                <br />
                لا يمكن التراجع عن هذا الإجراء.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>إلغاء</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteTable} className="bg-red-600 hover:bg-red-700">
                حذف
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
