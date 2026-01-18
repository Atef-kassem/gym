import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  ShoppingCart, 
  Calendar, 
  Clock, 
  DollarSign, 
  Car, 
  User, 
  Phone, 
  MapPin,
  Search,
  Plus,
  Settings,
  Activity,
  TrendingUp,
  BarChart3,
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Filter,
  Download,
  Bell,
  Star,
  Zap,
  Target,
  Award
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useBookingSystem } from "@/hooks/useBookingSystem";
import { useCustomerStore } from "@/hooks/useCustomerStore";

export default function IntegratedDesk() {
  const { toast } = useToast();
  const { bookings, addBooking, updateBooking } = useBookingSystem();
  const { customers, addCustomer } = useCustomerStore();
  
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<any>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);
  
  // Mock data for integrated desk
  const todayStats = {
    totalCustomers: 45,
    completedServices: 38,
    pendingBookings: 12,
    totalRevenue: 8450,
    averageServiceTime: 35,
    customerSatisfaction: 4.8
  };

  const recentTransactions = [
    {
      id: "T001",
      customerName: "أحمد محمد",
      service: "  شامل",
      amount: 150,
      time: "10:30",
      status: "completed"
    },
    {
      id: "T002", 
      customerName: "سارة أحمد",
      service: "تلميع +  ",
      amount: 220,
      time: "11:15",
      status: "in-progress"
    },
    {
      id: "T003",
      customerName: "محمد خالد", 
      service: "  سريع",
      amount: 80,
      time: "12:00",
      status: "pending"
    }
  ];

  const services = [
    { id: "S001", name: "  خارجي", price: 50, duration: 20 },
    { id: "S002", name: "  داخلي", price: 60, duration: 25 },
    { id: "S003", name: "  شامل", price: 150, duration: 45 },
    { id: "S004", name: "تلميع", price: 120, duration: 40 },
    { id: "S005", name: "تعقيم", price: 80, duration: 30 }
  ];

  const upcomingBookings = bookings.filter(booking => 
    booking.date === new Date().toISOString().split('T')[0]
  ).slice(0, 5);

  const handleAddToCart = (service: any) => {
    setCartItems([...cartItems, { ...service, quantity: 1 }]);
    toast({
      title: "تم إضافة الخدمة",
      description: `تم إضافة ${service.name} إلى السلة`,
    });
  };

  const handleProcessPayment = async () => {
    setIsProcessingPayment(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessingPayment(false);
      setCartItems([]);
      toast({
        title: "تم الدفع بنجاح",
        description: "تم معالجة المعاملة وطباعة الايصال",
      });
    }, 2000);
  };

  const totalCartAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Enhanced Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 p-8 text-white">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="space-y-3">
              <h1 className="text-4xl font-bold animate-fade-in">
                الاستقبال المتكامل
              </h1>
              <p className="text-blue-100 text-lg animate-fade-in">
                نظام متكامل للاستقبال مع نقاط البيع وإدارة العملاء والبيع
              </p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>النظام متصل</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  <span>{todayStats.totalCustomers} عميل اليوم</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 transition-all duration-300 hover-scale">
                <Bell className="h-4 w-4 ml-2" />
                الإشعارات
              </Button>
              <Button className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 transition-all duration-300 hover-scale">
                <Settings className="h-4 w-4 ml-2" />
                إعدادات المكتب
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 hover-scale transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200 dark:bg-blue-800 rounded-full -mr-10 -mt-10 opacity-20"></div>
            <CardHeader className="pb-2 relative z-10">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">عملاء اليوم</CardTitle>
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-blue-900 dark:text-blue-100 animate-fade-in">
                {todayStats.totalCustomers}
              </div>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600 font-medium">+15% عن الأمس</span>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 hover-scale transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-200 dark:bg-green-800 rounded-full -mr-10 -mt-10 opacity-20"></div>
            <CardHeader className="pb-2 relative z-10">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">خدمات مكتملة</CardTitle>
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-green-900 dark:text-green-100 animate-fade-in">
                {todayStats.completedServices}
              </div>
              <div className="flex items-center gap-1 mt-2">
                <Target className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600 font-medium">معدل إنجاز 95%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 hover-scale transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-200 dark:bg-yellow-800 rounded-full -mr-10 -mt-10 opacity-20"></div>
            <CardHeader className="pb-2 relative z-10">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-yellow-700 dark:text-yellow-300">حجوزات منتظرة</CardTitle>
                <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-yellow-900 dark:text-yellow-100 animate-fade-in">
                {todayStats.pendingBookings}
              </div>
              <div className="flex items-center gap-1 mt-2">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-yellow-600 font-medium">يحتاج متابعة</span>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 hover-scale transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-200 dark:bg-purple-800 rounded-full -mr-10 -mt-10 opacity-20"></div>
            <CardHeader className="pb-2 relative z-10">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">إيرادات اليوم</CardTitle>
                <DollarSign className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-purple-900 dark:text-purple-100 animate-fade-in">
                {todayStats.totalRevenue.toLocaleString()} جنيه مصري
              </div>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600 font-medium">+22% عن الأمس</span>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-950 dark:to-cyan-900 hover-scale transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-200 dark:bg-cyan-800 rounded-full -mr-10 -mt-10 opacity-20"></div>
            <CardHeader className="pb-2 relative z-10">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-cyan-700 dark:text-cyan-300">متوسط الخدمة</CardTitle>
                <Clock className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-cyan-900 dark:text-cyan-100 animate-fade-in">
                {todayStats.averageServiceTime} دقيقة
              </div>
              <div className="flex items-center gap-1 mt-2">
                <Zap className="h-4 w-4 text-cyan-500" />
                <span className="text-sm text-cyan-600 font-medium">وقت ممتاز</span>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900 hover-scale transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-200 dark:bg-indigo-800 rounded-full -mr-10 -mt-10 opacity-20"></div>
            <CardHeader className="pb-2 relative z-10">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-indigo-700 dark:text-indigo-300">رضا العملاء</CardTitle>
                <Star className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-indigo-900 dark:text-indigo-100 animate-fade-in">
                {todayStats.customerSatisfaction}/5
              </div>
              <div className="flex items-center gap-1 mt-2">
                <Award className="h-4 w-4 text-indigo-500" />
                <span className="text-sm text-indigo-600 font-medium">تقييم ممتاز</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 bg-white dark:bg-gray-900 shadow-lg rounded-xl border-0 p-2">
            <TabsTrigger value="overview" className="text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white transition-all duration-300">
              <BarChart3 className="h-4 w-4 ml-2" />
              نظرة عامة
            </TabsTrigger>
            <TabsTrigger value="pos" className="text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-teal-500 data-[state=active]:text-white transition-all duration-300">
              <ShoppingCart className="h-4 w-4 ml-2" />
              نقطة البيع
            </TabsTrigger>
            <TabsTrigger value="bookings" className="text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white transition-all duration-300">
              <Calendar className="h-4 w-4 ml-2" />
              البيع
            </TabsTrigger>
            <TabsTrigger value="customers" className="text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white transition-all duration-300">
              <Users className="h-4 w-4 ml-2" />
              العملاء
            </TabsTrigger>
            <TabsTrigger value="transactions" className="text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white transition-all duration-300">
              <DollarSign className="h-4 w-4 ml-2" />
              المعاملات
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Upcoming Bookings */}
              <Card className="shadow-lg border-0">
                <CardHeader className="border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">البيع القادمة</CardTitle>
                      <CardDescription>حجوزات اليوم والساعات القادمة</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {upcomingBookings.map((booking, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:shadow-lg transition-all duration-300 hover-scale">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                            {booking.customerName.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-semibold">{booking.customerName}</h4>
                            <p className="text-sm text-muted-foreground">{booking.services?.[0] || 'خدمة عامة'}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{booking.time}</div>
                          <Badge variant="outline" className="text-xs mt-1">
                            {booking.vehicleType}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Transactions */}
              <Card className="shadow-lg border-0">
                <CardHeader className="border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                      <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">المعاملات الأخيرة</CardTitle>
                      <CardDescription>آخر المدفوعات والمعاملات</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {recentTransactions.map((transaction, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:shadow-lg transition-all duration-300 hover-scale">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                            جنيه مصري
                          </div>
                          <div>
                            <h4 className="font-semibold">{transaction.customerName}</h4>
                            <p className="text-sm text-muted-foreground">{transaction.service}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">{transaction.amount} جنيه مصري</div>
                          <div className="text-sm text-muted-foreground">{transaction.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="pos" className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Services Selection */}
              <Card className="lg:col-span-2 shadow-lg border-0">
                <CardHeader className="border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <ShoppingCart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">الخدمات المتاحة</CardTitle>
                        <CardDescription>اختر الخدمات لإضافتها للايصال</CardDescription>
                      </div>
                    </div>
                    <Button variant="outline">
                      <Filter className="h-4 w-4 ml-2" />
                      تصفية
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((service) => (
                      <div key={service.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:shadow-lg transition-all duration-300 hover-scale">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-lg">{service.name}</h4>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-600">{service.price} جنيه مصري</div>
                            <div className="text-sm text-muted-foreground">{service.duration} دقيقة</div>
                          </div>
                        </div>
                        <Button 
                          onClick={() => handleAddToCart(service)}
                          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                        >
                          <Plus className="h-4 w-4 ml-2" />
                          إضافة للسلة
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Shopping Cart */}
              <Card className="shadow-lg border-0">
                <CardHeader className="border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                      <ShoppingCart className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">السلة</CardTitle>
                      <CardDescription>{cartItems.length} عنصر</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {cartItems.length === 0 ? (
                      <div className="text-center py-8">
                        <ShoppingCart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-muted-foreground">السلة فارغة</p>
                      </div>
                    ) : (
                      <>
                        {cartItems.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <div>
                              <h5 className="font-medium">{item.name}</h5>
                              <p className="text-sm text-muted-foreground">الكمية: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <div className="font-bold">{item.price * item.quantity} جنيه مصري</div>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => setCartItems(cartItems.filter((_, i) => i !== index))}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        
                        <div className="border-t pt-4">
                          <div className="flex items-center justify-between text-lg font-bold">
                            <span>الإجمالي:</span>
                            <span>{totalCartAmount} جنيه مصري</span>
                          </div>
                        </div>
                        
                        <Button 
                          onClick={handleProcessPayment}
                          disabled={isProcessingPayment}
                          className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                        >
                          {isProcessingPayment ? (
                            <>
                              <RefreshCw className="h-4 w-4 ml-2 animate-spin" />
                              جاري المعالجة...
                            </>
                          ) : (
                            <>
                              <DollarSign className="h-4 w-4 ml-2" />
                              تأكيد الدفع
                            </>
                          )}
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-8 animate-fade-in">
            <Card className="shadow-lg border-0">
              <CardHeader className="border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                      <Calendar className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">إدارة البيع</CardTitle>
                      <CardDescription>عرض وإدارة جميع البيع</CardDescription>
                    </div>
                  </div>
                  <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                    <Plus className="h-4 w-4 ml-2" />
                    حجز جديد
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex-1">
                      <Input
                        placeholder="البحث في البيع..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                    <Select value={selectedService} onValueChange={setSelectedService}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="نوع الخدمة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع الخدمات</SelectItem>
                        <SelectItem value="wash"> </SelectItem>
                        <SelectItem value="polish">تلميع</SelectItem>
                        <SelectItem value="sterilize">تعقيم</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {bookings.slice(0, 8).map((booking, index) => (
                    <div key={index} className="flex items-center justify-between p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:shadow-lg transition-all duration-300 hover-scale">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                          {booking.customerName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">{booking.customerName}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Car className="h-4 w-4" />
                              {booking.vehicleType}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {booking.time}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-semibold">{booking.services?.[0] || 'خدمة عامة'}</div>
                          <Badge variant="outline" className="mt-1">
                            {booking.status}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="hover-scale">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="hover-scale">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers" className="space-y-8 animate-fade-in">
            <Card className="shadow-lg border-0">
              <CardHeader className="border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-pink-100 dark:bg-pink-900 rounded-lg">
                      <Users className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">إدارة العملاء</CardTitle>
                      <CardDescription>عرض وإدارة بيانات العملاء</CardDescription>
                    </div>
                  </div>
                  <Button className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600">
                    <Plus className="h-4 w-4 ml-2" />
                    عميل جديد
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {customers.slice(0, 8).map((customer, index) => (
                    <div key={index} className="flex items-center justify-between p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:shadow-lg transition-all duration-300 hover-scale">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white font-bold">
                          {customer.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">{customer.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              {customer.phone}
                            </span>
                            <span className="flex items-center gap-1">
                              <Star className="h-4 w-4" />
                              نقاط الولاء: {(customer as any).loyaltyPoints || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-semibold">{customer.totalVisits || 0} زيارة</div>
                          <Badge variant="outline" className="mt-1">
                            {(customer as any).membershipLevel || "عادي"}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="hover-scale">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="hover-scale">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-8 animate-fade-in">
            <Card className="shadow-lg border-0">
              <CardHeader className="border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                      <DollarSign className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">سجل المعاملات</CardTitle>
                      <CardDescription>جميع المدفوعات والمعاملات المالية</CardDescription>
                    </div>
                  </div>
                  <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600">
                    <Download className="h-4 w-4 ml-2" />
                    تصدير التقرير
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {recentTransactions.map((transaction, index) => (
                    <div key={index} className="flex items-center justify-between p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:shadow-lg transition-all duration-300 hover-scale">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          #{transaction.id.slice(-2)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">{transaction.customerName}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{transaction.service}</span>
                            <span>{transaction.time}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">{transaction.amount} جنيه مصري</div>
                          <Badge 
                            variant={transaction.status === 'completed' ? 'default' : 'secondary'}
                            className="mt-1"
                          >
                            {transaction.status === 'completed' ? 'مكتمل' : 
                             transaction.status === 'in-progress' ? 'قيد التنفيذ' : 'منتظر'}
                          </Badge>
                        </div>
                        <Button size="sm" variant="outline" className="hover-scale">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}