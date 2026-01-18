import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Clock, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  DollarSign,
  Building2,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { useGetAllShiftsQuery, useDeleteShiftMutation } from '@/services/shiftApi';
import shiftApi from '@/services/shiftApi';
import { useGetAllSessionsQuery } from '@/services/shiftSessionApi';
import shiftSessionApi from '@/services/shiftSessionApi';
import { useDispatch } from 'react-redux';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { CurrentShiftIndicator } from '@/components/Shifts/CurrentShiftIndicator';
import { CloseShiftDialog } from '@/components/Shifts/CloseShiftDialog';

export default function ShiftsList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: shiftsResponse, isLoading, error, refetch } = useGetAllShiftsQuery({});
  const { data: sessionsResponse, isLoading: sessionsLoading, refetch: refetchSessions } = useGetAllSessionsQuery({ status: 'open' });
  const [deleteShift] = useDeleteShiftMutation();
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState<any>(null);
  const [closeShiftDialogOpen, setCloseShiftDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  
  const shifts = Array.isArray(shiftsResponse?.data) ? shiftsResponse.data : [];
  const activeSessions = Array.isArray(sessionsResponse?.data) ? sessionsResponse.data : [];
  
  // دالة لمسح الـ cache وإعادة تحميل البيانات
  const handleRefreshAll = () => {
    dispatch(shiftApi.util.resetApiState());
    dispatch(shiftSessionApi.util.resetApiState());
    refetch();
    refetchSessions();
    toast.success('تم تحديث البيانات بنجاح');
  };
  
  const handleDelete = async () => {
    try {
      await deleteShift(selectedShift.id).unwrap();
      toast.success('تم حذف الوردية بنجاح');
      setDeleteDialogOpen(false);
      setSelectedShift(null);
    } catch (error: any) {
      toast.error(error?.data?.message || 'حدث خطأ أثناء حذف الوردية');
    }
  };
  
  const formatTime = (time: string) => {
    if (!time) return '--:--';
    return time.substring(0, 5); // HH:MM
  };
  
  const calculateDuration = (start: string, end: string) => {
    if (!start || !end) return '--';
    
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);
    
    let duration = (endH * 60 + endM) - (startH * 60 + startM);
    
    // إذا كانت النهاية أصغر من البداية (وردية ليلية تعبر منتصف الليل)
    if (duration < 0) {
      duration += 24 * 60;
    }
    
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    
    return `${hours} ساعة${minutes > 0 ? ` و ${minutes} دقيقة` : ''}`;
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="border-0 shadow-card bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">إدارة الورديات</h1>
                  <p className="text-sm text-muted-foreground">عرض وإدارة جميع الورديات في النظام</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleRefreshAll} 
                  variant="outline"
                  title="تحديث البيانات ومسح الذاكرة المؤقتة"
                >
                  <RefreshCw className="h-4 w-4 ml-2" />
                  تحديث
                </Button>
                <Button onClick={() => navigate('/shifts/add')} className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة وردية جديدة
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* مؤشر الوردية الحالية */}
        <CurrentShiftIndicator />

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">جلسات الورديات النشطة</CardTitle>
              <Clock className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activeSessions.length}</div>
              <p className="text-xs text-muted-foreground mt-1">جلسة مفتوحة حالياً</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">تعريفات الورديات</CardTitle>
              <CheckCircle className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {shifts.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">وردية معرّفة في النظام</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الورديات النشطة</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {shifts.filter((s: any) => s.isActive).length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">قيد التفعيل</p>
            </CardContent>
          </Card>
        </div>

        {/* قسم الجلسات النشطة */}
        {activeSessions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-500" />
                جلسات الورديات المفتوحة ({activeSessions.length})
              </CardTitle>
              <CardDescription>الجلسات النشطة التي لم يتم إغلاقها بعد</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeSessions.map((session: any) => (
                  <div key={session.id} className="p-4 border rounded-lg bg-green-50 border-green-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: session.shift?.color || '#3b82f6' }}
                          >
                            <Clock className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold text-lg">{session.shift?.shiftName}</h4>
                            <p className="text-sm text-gray-600">
                              {session.user?.arabicName} - {session.branch?.arabicName || 'جميع الفروع'}
                            </p>
                          </div>
                          <Badge className="bg-green-500 text-white animate-pulse">
                            مفتوحة
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                          <div>
                            <p className="text-xs text-gray-500">المبلغ الافتتاحي</p>
                            <p className="font-semibold">{new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(session.openingBalance || 0)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">إجمالي المبيعات</p>
                            <p className="font-semibold text-green-600">{new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(session.totalSales || 0)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">عدد العمليات</p>
                            <p className="font-semibold text-blue-600">{session.transactionsCount || 0}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">تاريخ البدء</p>
                            <p className="font-semibold">{session.sessionDate}</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setSelectedSession(session);
                            setCloseShiftDialogOpen(true);
                          }}
                          className="w-full"
                        >
                          <Clock className="h-4 w-4 mr-2" />
                          إغلاق هذه الوردية
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* نافذة إغلاق الوردية */}
        <CloseShiftDialog
          open={closeShiftDialogOpen}
          onOpenChange={setCloseShiftDialogOpen}
          session={selectedSession}
        />

        {/* جدول الورديات */}
        <Card>
          <CardHeader>
            <CardTitle>تعريفات الورديات</CardTitle>
            <CardDescription>
              إعدادات وتعريفات الورديات المختلفة (صباحية، مسائية، ليلية، إلخ)
              <br />
              <span className="text-blue-600 font-medium mt-1 inline-block">
                📌 ملاحظة: هذه تعريفات الورديات فقط. لبدء وردية جديدة، انتقل إلى صفحة البيع أو POS
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-2">جاري تحميل الورديات...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-600 font-medium">خطأ في تحميل الورديات</p>
                <p className="text-sm text-muted-foreground mt-1">يرجى المحاولة مرة أخرى</p>
              </div>
            ) : shifts.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium text-muted-foreground mb-2">لا توجد ورديات</p>
                <p className="text-sm text-muted-foreground mb-4">ابدأ بإضافة وردية جديدة</p>
                <Button onClick={() => navigate('/shifts/add')}>
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة وردية
                </Button>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>اللون</TableHead>
                      <TableHead>اسم الوردية</TableHead>
                      <TableHead>وقت البداية</TableHead>
                      <TableHead>وقت النهاية</TableHead>
                      <TableHead>المدة</TableHead>
                      <TableHead>الفرع</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shifts.map((shift: any) => (
                      <TableRow key={shift.id}>
                        <TableCell>
                          <div
                            className="w-6 h-6 rounded-full"
                            style={{ backgroundColor: shift.color }}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{shift.shiftName}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            {formatTime(shift.startTime)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            {formatTime(shift.endTime)}
                          </div>
                        </TableCell>
                        <TableCell>
                          {calculateDuration(shift.startTime, shift.endTime)}
                        </TableCell>
                        <TableCell>
                          {shift.branch ? (
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                              {shift.branch.arabicName || shift.branch.englishName}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">جميع الفروع</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={shift.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {shift.isActive ? 'نشطة' : 'معطلة'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/shifts/${shift.id}/revenue`)}
                              title="عرض الإيرادات"
                            >
                              <DollarSign className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/shifts/edit/${shift.id}`)}
                              title="تعديل الوردية"
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedShift(shift);
                                setDeleteDialogOpen(true);
                              }}
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
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* نافذة تأكيد الحذف */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف الوردية "{selectedShift?.shiftName}"؟
              <br />
              لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

