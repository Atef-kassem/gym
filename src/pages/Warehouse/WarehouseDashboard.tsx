import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, Boxes, TrendingUp, AlertCircle, Warehouse, DollarSign, 
  ArrowUp, ArrowDown, Activity, Filter, Download, BarChart3, PieChart,
  CheckCircle, Clock, ShoppingCart, Truck, PackageSearch, AlertTriangle
} from "lucide-react";

const WarehouseDashboard = () => {
  const stats = {
    totalWarehouses: 8,
    activeWarehouses: 7,
    totalProducts: 1245,
    availableProducts: 1180,
    lowStockProducts: 65,
    outOfStockProducts: 23,
    totalValue: 2500000,
    avgValuePerProduct: 2008,
    totalMovements: 245,
    pendingMovements: 12,
    completedMovements: 233,
    stockAccuracy: 96.5
  };

  const warehouses = [
    { name: "المستودع الرئيسي", products: 450, value: 900000, utilization: 85, status: "نشط" },
    { name: "مستودع الشمال", products: 320, value: 640000, utilization: 75, status: "نشط" },
    { name: "مستودع الجنوب", products: 280, value: 560000, utilization: 70, status: "نشط" },
    { name: "مستودع الشرق", products: 195, value: 400000, utilization: 65, status: "نشط" }
  ];

  const recentMovements = [
    { id: 1, type: "دخول", product: "منتج أ", quantity: 100, warehouse: "المستودع الرئيسي", date: "2024-01-25", status: "مكتمل" },
    { id: 2, type: "خروج", product: "منتج ب", quantity: 50, warehouse: "مستودع الشمال", date: "2024-01-25", status: "قيد المعالجة" },
    { id: 3, type: "تحويل", product: "منتج ج", quantity: 25, warehouse: "مستودع الجنوب", date: "2024-01-24", status: "مكتمل" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* العنوان والأزرار */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">لوحة تحكم المستودعات</h1>
            <p className="text-gray-600 mt-1">نظرة شاملة على المستودعات والمخزون والحركات</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              فلتر
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              تصدير
            </Button>
          </div>
        </div>

        {/* البطاقات الإحصائية الرئيسية */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>إجمالي المستودعات</span>
                <Warehouse className="w-5 h-5 text-purple-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{stats.totalWarehouses}</div>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-green-500">{stats.activeWarehouses} نشط</Badge>
                <Badge variant="outline">{stats.totalWarehouses - stats.activeWarehouses} غير نشط</Badge>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                <TrendingUp className="w-3 h-3 inline ml-1" />
                زيادة مستودع واحد هذا الشهر
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>المنتجات</span>
                <Package className="w-5 h-5 text-blue-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.totalProducts.toLocaleString()}</div>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-green-500">{stats.availableProducts} متوفر</Badge>
                <Badge variant="destructive">{stats.lowStockProducts + stats.outOfStockProducts} ناقص</Badge>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                <AlertCircle className="w-3 h-3 inline ml-1" />
                {stats.outOfStockProducts} منتج غير متوفر
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>القيمة الإجمالية</span>
                <DollarSign className="w-5 h-5 text-green-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{(stats.totalValue / 1000000).toFixed(1)}M ج.م</div>
              <p className="text-sm text-gray-500 mt-1">متوسط: {stats.avgValuePerProduct.toLocaleString()} ج.م/منتج</p>
              <p className="text-xs text-gray-500 mt-2">
                <TrendingUp className="w-3 h-3 inline ml-1 text-green-500" />
                زيادة 5.2% عن الشهر الماضي
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>نواقص المخزون</span>
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{stats.outOfStockProducts}</div>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="destructive">{stats.outOfStockProducts} غير متوفر</Badge>
                <Badge className="bg-amber-500">{stats.lowStockProducts} قليل</Badge>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                <Clock className="w-3 h-3 inline ml-1" />
                يحتاج إلى إعادة تموين
              </p>
            </CardContent>
          </Card>
        </div>

        {/* بطاقات إضافية */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-l-4 border-l-cyan-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>الحركات</span>
                <Activity className="w-5 h-5 text-cyan-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cyan-600">{stats.totalMovements}</div>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-green-500">{stats.completedMovements} مكتمل</Badge>
                <Badge className="bg-amber-500">{stats.pendingMovements} قيد المعالجة</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-indigo-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>دقة المخزون</span>
                <CheckCircle className="w-5 h-5 text-indigo-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-600">{stats.stockAccuracy}%</div>
              <Progress value={stats.stockAccuracy} className="h-2 mt-2" />
              <p className="text-xs text-gray-500 mt-2">معدل دقة الجرد</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>متوسط الاستخدام</span>
                <BarChart3 className="w-5 h-5 text-amber-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">73.75%</div>
              <Progress value={73.75} className="h-2 mt-2" />
              <p className="text-xs text-gray-500 mt-2">متوسط استخدام المستودعات</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* حالة المستودعات */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Warehouse className="w-5 h-5 text-purple-500" />
                حالة المستودعات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {warehouses.map((warehouse, index) => (
                  <div key={index} className="space-y-2 p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{warehouse.name}</h4>
                        <p className="text-sm text-gray-500">{warehouse.products} منتج • {warehouse.value.toLocaleString()} ج.م</p>
                      </div>
                      <Badge className={warehouse.status === "نشط" ? "bg-green-500" : "bg-gray-500"}>
                        {warehouse.status}
                      </Badge>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>معدل الاستخدام</span>
                        <span>{warehouse.utilization}%</span>
                      </div>
                      <Progress value={warehouse.utilization} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* الحركات الأخيرة */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-500" />
                الحركات الأخيرة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentMovements.map((movement) => (
                  <div key={movement.id} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      movement.type === "دخول" ? "bg-green-100" :
                      movement.type === "خروج" ? "bg-red-100" : "bg-blue-100"
                    }`}>
                      {movement.type === "دخول" ? <ArrowDown className="w-5 h-5 text-green-600" /> :
                       movement.type === "خروج" ? <ArrowUp className="w-5 h-5 text-red-600" /> :
                       <Truck className="w-5 h-5 text-blue-600" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm">{movement.product}</span>
                        <span className="text-xs text-gray-500">{movement.date}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {movement.type} • {movement.quantity} وحدة • {movement.warehouse}
                      </p>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {movement.status === "مكتمل" ? (
                          <><CheckCircle className="w-3 h-3 ml-1" /> {movement.status}</>
                        ) : (
                          <><Clock className="w-3 h-3 ml-1" /> {movement.status}</>
                        )}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">عرض جميع الحركات</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WarehouseDashboard;

