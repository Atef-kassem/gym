import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Crown, 
  Star, 
  Shield, 
  Calendar, 
  Award, 
  Phone, 
  Mail, 
  MapPin,
  Car,
  Receipt,
  Ticket,
  Gift,
  Heart,
  History,
  TrendingUp,
  Clock,
  CheckCircle,
  DollarSign
} from 'lucide-react';
import { CustomerLoyaltyCard } from "@/components/CRM/CustomerLoyaltyCard";
import { CustomerTransactionHistory } from "@/components/CRM/CustomerTransactionHistory";

interface CustomerDetailsPopupProps {
  customer: any;
  isOpen: boolean;
  onClose: () => void;
}

export function CustomerDetailsPopup({ customer, isOpen, onClose }: CustomerDetailsPopupProps) {
  if (!customer) return null;

  // Mock transaction history
  const transactionHistory = [
    {
      id: 1,
      date: '2024-01-15',
      services: ['  شامل', 'تلميع خارجي'],
      amount: 165,
      status: 'مكتمل',
      carPlate: 'أبج1234',
      supervisor: 'أحمد محمد'
    },
    {
      id: 2,
      date: '2024-01-10',
      services: ['  سريع'],
      amount: 25,
      status: 'مكتمل',
      carPlate: 'أبج1234',
      supervisor: 'خالد علي'
    },
    {
      id: 3,
      date: '2024-01-05',
      services: ['باقة VIP'],
      amount: 300,
      status: 'مكتمل',
      carPlate: 'أبج1234',
      supervisor: 'سالم أحمد'
    }
  ];

  // Mock cars data
  const customerCars = [
    {
      id: 1,
      plate: 'أبج1234',
      make: 'تويوتا',
      model: 'كامري',
      year: '2020',
      color: 'أبيض',
      lastService: '2024-01-15',
      totalServices: 25
    },
    {
      id: 2,
      plate: 'دهو5678',
      make: 'لكزس',
      model: 'ES 350',
      year: '2021',
      color: 'أسود',
      lastService: '2024-01-12',
      totalServices: 8
    }
  ];

  const getCustomerTypeIcon = (type: string) => {
    switch (type) {
      case 'VIP': return <Crown className="h-5 w-5 text-yellow-600" />;
      case 'Premium': return <Star className="h-5 w-5 text-purple-600" />;
      default: return <Shield className="h-5 w-5 text-gray-600" />;
    }
  };

  const getCustomerTypeBadge = (type: string) => {
    switch (type) {
      case 'VIP': return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 'Premium': return 'bg-gradient-to-r from-purple-500 to-purple-700 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
          <div className="flex items-center gap-4">
            <img 
              src={customer.avatar} 
              alt={customer.name}
              className="w-16 h-16 rounded-full border-4 border-white shadow-lg object-cover"
            />
            <div className="flex-1">
              <DialogTitle className="text-xl font-bold flex items-center gap-3">
                {customer.name}
                {getCustomerTypeIcon(customer.customerType)}
              </DialogTitle>
              <div className="flex items-center gap-4 mt-2">
                <Badge className={`${getCustomerTypeBadge(customer.customerType)} shadow-lg`}>
                  {customer.customerType === 'Individual' && '👤 عميل فردي'}
                  {customer.customerType === 'Company' && '🏢 شركة'}
                  {customer.customerType === 'Group' && '👥 مجموعة'}
                </Badge>
                <span className="text-blue-100 text-sm" dir="ltr">{customer.phone}</span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6">
          {/* إحصائيات سريعة */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-800">{customer.totalSpent.toLocaleString()}</div>
                <div className="text-sm text-green-600">إجمالي الإنفاق</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Award className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-blue-800">{customer.totalVisits}</div>
                <div className="text-sm text-blue-600">إجمالي الزيارات</div>
              </CardContent>
            </Card>

            {/* <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Car className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-purple-800">{customerCars.length}</div>
                <div className="text-sm text-purple-600">عدد  الكافية</div>
              </CardContent>
            </Card> */}

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Calendar className="h-6 w-6 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-orange-800">
                  {Math.floor((Date.now() - new Date(customer.joinDate).getTime()) / (1000 * 60 * 60 * 24))}
                </div>
                <div className="text-sm text-orange-600">يوماً منذ الانضمام</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-6 mb-6 bg-gradient-to-r from-gray-100 to-blue-50 p-1 rounded-xl">
              <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:shadow-md">
                نظرة عامة
              </TabsTrigger>
              {/* <TabsTrigger value="cars" className="data-[state=active]:bg-white data-[state=active]:shadow-md">
                 الكافية
              </TabsTrigger> */}
              <TabsTrigger value="history" className="data-[state=active]:bg-white data-[state=active]:shadow-md">
                سجل العمليات
              </TabsTrigger>
              <TabsTrigger value="loyalty" className="data-[state=active]:bg-white data-[state=active]:shadow-md">
                الولاء والمكافآت
              </TabsTrigger>
              <TabsTrigger value="benefits" className="data-[state=active]:bg-white data-[state=active]:shadow-md">
                المزايا والباقات
              </TabsTrigger>
              <TabsTrigger value="relations" className="data-[state=active]:bg-white data-[state=active]:shadow-md">
                العلاقات
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    المعلومات الشخصية
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span className="text-sm">رقم الجوال</span>
                      </div>
                      <div className="font-semibold" dir="ltr">{customer.phone}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">تاريخ الانضمام</span>
                      </div>
                      <div className="font-semibold">{new Date(customer.joinDate).toLocaleDateString('ar-SA')}</div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="text-sm text-gray-600">متوسط قيمة الطلب</div>
                      <div className="font-semibold text-green-600">
                        {Math.round(customer.totalSpent / customer.totalVisits)} جنيه
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-gray-600">آخر زيارة</div>
                      <div className="font-semibold text-blue-600">15 يناير 2024</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cars" className="space-y-4">
              <div className="grid gap-4">
                {customerCars.map((car) => (
                  <Card key={car.id} className="hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                            <Car className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <div className="font-bold text-lg">{car.plate}</div>
                            <div className="text-sm text-gray-600">{car.make} {car.model} - {car.year}</div>
                            <div className="text-xs text-gray-500">اللون: {car.color}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">آخر خدمة</div>
                          <div className="font-semibold">{new Date(car.lastService).toLocaleDateString('ar-SA')}</div>
                          <Badge variant="outline" className="mt-1">
                            {car.totalServices} خدمة
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <CustomerTransactionHistory customerId={customer.id} />
            </TabsContent>

            <TabsContent value="loyalty" className="space-y-4">
              <CustomerLoyaltyCard customer={customer} />
            </TabsContent>

            <TabsContent value="benefits" className="space-y-4">
              {/* الكوبونات */}
              {customer.coupons && customer.coupons.length > 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-800">
                      <Ticket className="h-5 w-5" />
                      الكوبونات المتاحة
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {customer.coupons.map((coupon: any) => (
                      <div key={coupon.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                        <div>
                          <div className="font-semibold text-green-800">{coupon.code}</div>
                          <div className="text-sm text-green-600">{coupon.description}</div>
                          <div className="text-xs text-green-500">صالح حتى: {new Date(coupon.validUntil).toLocaleDateString('ar-SA')}</div>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          {coupon.discount}%
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Ticket className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <div className="text-gray-600">لا توجد كوبونات متاحة</div>
                  </CardContent>
                </Card>
              )}

              {/* الباقات */}
              {customer.packages && customer.packages.length > 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-800">
                      <Gift className="h-5 w-5" />
                      الباقات النشطة
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {customer.packages.map((pkg: any) => (
                      <div key={pkg.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div>
                          <div className="font-semibold text-blue-800">{pkg.name}</div>
                          <div className="text-sm text-blue-600">
                            متبقي: {pkg.remaining} من {pkg.total}
                          </div>
                          <div className="text-xs text-blue-500">صالحة حتى: {new Date(pkg.validUntil).toLocaleDateString('ar-SA')}</div>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">
                          {pkg.remaining}/{pkg.total}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Gift className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <div className="text-gray-600">لا توجد باقات نشطة</div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="relations" className="space-y-4">
              {customer.relatedCustomers && customer.relatedCustomers.length > 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-purple-800">
                      <Heart className="h-5 w-5" />
                      الأقارب والأصدقاء
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {customer.relatedCustomers.map((related: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <div>
                          <div className="font-semibold text-purple-800">{related.name}</div>
                          <div className="text-sm text-purple-600" dir="ltr">{related.phone}</div>
                        </div>
                        <Badge className="bg-purple-100 text-purple-800">
                          {related.relation}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Heart className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <div className="text-gray-600">لا توجد علاقات مسجلة</div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="p-6 pt-0">
          <Button onClick={onClose} className="w-full">
            إغلاق
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}