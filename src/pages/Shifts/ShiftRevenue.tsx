import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, 
  ArrowRight, 
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Calendar as CalendarIcon,
  Receipt,
  CreditCard,
  Wallet,
  Banknote,
  Package,
  Users,
  Percent,
  AlertCircle,
  CheckCircle,
  FileText
} from 'lucide-react';
import { useGetShiftByIdQuery, useGetShiftRevenueQuery } from '@/services/shiftApi';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

export default function ShiftRevenue() {
  const { shiftId } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  const dateString = format(selectedDate, 'yyyy-MM-dd');
  
  const { data: shiftResponse, isLoading: shiftLoading } = useGetShiftByIdQuery(shiftId!);
  const { data: revenueResponse, isLoading: revenueLoading, error: revenueError } = useGetShiftRevenueQuery(
    { shiftId: shiftId!, date: dateString },
    { skip: !shiftId }
  );
  
  const shift = shiftResponse?.data;
  const revenue = revenueResponse?.data;
  
  const formatTime = (time: string) => {
    if (!time) return '--:--';
    return time.substring(0, 5);
  };
  
  const paymentMethodIcons: any = {
    cash: <Banknote className="h-4 w-4" />,
    card: <CreditCard className="h-4 w-4" />,
    wallet: <Wallet className="h-4 w-4" />,
    transfer: <Receipt className="h-4 w-4" />
  };
  
  const paymentMethodNames: any = {
    cash: 'نقدي',
    card: 'بطاقة',
    wallet: 'محفظة',
    transfer: 'تحويل'
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="border-0 shadow-card bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: shift?.color || '#3b82f6' }}
                >
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    إيرادات {shift?.shiftName || 'الوردية'}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    من {formatTime(shift?.startTime)} إلى {formatTime(shift?.endTime)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* اختيار التاريخ */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      {format(selectedDate, 'PPP', { locale: ar })}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      initialFocus
                      locale={ar}
                    />
                  </PopoverContent>
                </Popover>
                
                <Button variant="outline" onClick={() => navigate('/shifts')}>
                  <ArrowRight className="h-4 w-4 ml-2" />
                  العودة
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {revenueLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-4">جاري تحميل البيانات...</p>
          </div>
        ) : revenueError ? (
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-8 w-8 text-red-600" />
                <div>
                  <p className="font-semibold text-red-800">خطأ في تحميل البيانات</p>
                  <p className="text-sm text-red-600">يرجى المحاولة مرة أخرى</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* الإحصائيات الرئيسية */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">إجمالي إيرادات الوردية</CardTitle>
                  <DollarSign className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    {revenue?.summary?.totalRevenue?.toFixed(2) || '0.00'}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">جنيه مصري - فقط لهذه الوردية</p>
                </CardContent>
              </Card>
              
              <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">مبيعات الوردية السريعة</CardTitle>
                  <ShoppingCart className="h-5 w-5 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {revenue?.summary?.quickSalesTotal?.toFixed(2) || '0.00'}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {revenue?.summary?.quickSalesCount || 0} عملية بيع - فقط في وقت الوردية
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">حجوزات الوردية</CardTitle>
                  <CalendarIcon className="h-5 w-5 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {revenue?.summary?.bookingsTotal?.toFixed(2) || '0.00'}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {revenue?.summary?.bookingsCount || 0} حجز - فقط في وقت الوردية
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">متوسط ايصال الوردية</CardTitle>
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {revenue?.summary?.averageTransaction?.toFixed(2) || '0.00'}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">جنيه مصري - فقط لهذه الوردية</p>
                </CardContent>
              </Card>
            </div>

            {/* إحصائيات إضافية */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Receipt className="h-4 w-4" />
                    إجمالي عمليات الوردية
                  </CardTitle>
                  <CardDescription className="text-xs">
                    فقط العمليات التي تمت خلال وقت هذه الوردية
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary mb-2">
                    {revenue?.summary?.totalTransactions || 0}
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">مبيعات سريعة:</span>
                      <span className="font-medium">{revenue?.summary?.quickSalesCount || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">حجوزات:</span>
                      <span className="font-medium">{revenue?.summary?.bookingsCount || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Percent className="h-4 w-4" />
                    خصومات وضرائب الوردية
                  </CardTitle>
                  <CardDescription className="text-xs">
                    فقط للعمليات التي تمت خلال وقت هذه الوردية
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                      <span className="text-muted-foreground">إجمالي الخصومات:</span>
                      <span className="font-bold text-red-600">
                        {revenue?.summary?.totalDiscount?.toFixed(2) || '0.00'} جنيه
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                      <span className="text-muted-foreground">إجمالي الضرائب:</span>
                      <span className="font-bold text-green-600">
                        {revenue?.summary?.totalTax?.toFixed(2) || '0.00'} جنيه
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    طرق الدفع في الوردية
                  </CardTitle>
                  <CardDescription className="text-xs">
                    فقط للعمليات التي تمت خلال وقت هذه الوردية
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {Object.entries(revenue?.paymentMethods || {}).map(([method, count]: any) => (
                      <div key={method} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          {paymentMethodIcons[method]}
                          <span className="text-muted-foreground">{paymentMethodNames[method]}:</span>
                        </div>
                        <Badge variant="secondary">{count} عملية</Badge>
                      </div>
                    ))}
                    {Object.keys(revenue?.paymentMethods || {}).length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-2">
                        لا توجد عمليات دفع في هذه الوردية
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* تفاصيل الإيصالات */}
            <Tabs defaultValue="sales" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="sales">
                  <ShoppingCart className="h-4 w-4 ml-2" />
                  المبيعات السريعة ({revenue?.quickSales?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="bookings">
                  <CalendarIcon className="h-4 w-4 ml-2" />
                  البيع ({revenue?.bookings?.length || 0})
                </TabsTrigger>
              </TabsList>

              {/* المبيعات السريعة */}
              <TabsContent value="sales" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>المبيعات السريعة للوردية</CardTitle>
                    <CardDescription>
                      فقط المبيعات السريعة التي تمت خلال وقت هذه الوردية ({formatTime(shift?.startTime)} - {formatTime(shift?.endTime)})
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!revenue?.quickSales || revenue.quickSales.length === 0 ? (
                      <div className="text-center py-12">
                        <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                        <p className="text-muted-foreground">لا توجد مبيعات في هذه الوردية</p>
                      </div>
                    ) : (
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>رقم البيع</TableHead>
                              <TableHead>الوقت</TableHead>
                              <TableHead>العميل</TableHead>
                              <TableHead>طريقة الدفع</TableHead>
                              <TableHead>عدد العناصر</TableHead>
                              <TableHead>المبلغ</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {revenue.quickSales.map((sale: any) => (
                              <TableRow key={sale.id}>
                                <TableCell className="font-mono font-medium">
                                  {sale.saleNumber}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    {formatTime(sale.time)}
                                  </div>
                                </TableCell>
                                <TableCell>{sale.customerName}</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    {paymentMethodIcons[sale.paymentMethod]}
                                    <span className="text-sm">
                                      {paymentMethodNames[sale.paymentMethod]}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="secondary">
                                    {Array.isArray(sale.items) ? sale.items.length : 0} عنصر
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <span className="font-bold text-green-600">
                                    {sale.totalAmount?.toFixed(2)} جنيه
                                  </span>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* البيع */}
              <TabsContent value="bookings" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>البيع للوردية</CardTitle>
                    <CardDescription>
                      فقط البيع التي تمت خلال وقت هذه الوردية ({formatTime(shift?.startTime)} - {formatTime(shift?.endTime)})
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!revenue?.bookings || revenue.bookings.length === 0 ? (
                      <div className="text-center py-12">
                        <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                        <p className="text-muted-foreground">لا توجد حجوزات في هذه الوردية</p>
                      </div>
                    ) : (
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>رقم الحجز</TableHead>
                              <TableHead>الوقت</TableHead>
                              <TableHead>العميل</TableHead>
                              <TableHead>الحالة</TableHead>
                              <TableHead>المبلغ</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {revenue.bookings.map((booking: any) => (
                              <TableRow key={booking.id}>
                                <TableCell className="font-mono font-medium">
                                  {booking.bookingNumber}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    {formatTime(booking.time)}
                                  </div>
                                </TableCell>
                                <TableCell>{booking.customerName}</TableCell>
                                <TableCell>
                                  <Badge className={
                                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                    booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                    'bg-gray-100 text-gray-800'
                                  }>
                                    {booking.status === 'confirmed' ? 'مؤكد' :
                                     booking.status === 'completed' ? 'مكتمل' : booking.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <span className="font-bold text-blue-600">
                                    {booking.totalAmount?.toFixed(2)} جنيه
                                  </span>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}

