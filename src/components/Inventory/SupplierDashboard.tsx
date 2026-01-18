import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  TrendingUp, 
  Package, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  MapPin,
  Star,
  Activity
} from "lucide-react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const DashboardCard = ({ title, value, subtitle, icon, color, trend }: DashboardCardProps) => (
  <Card className={`hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 bg-gradient-to-br from-white/50 to-gray-50/30 backdrop-blur-sm ${color}`}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-gray-700">
        {title}
      </CardTitle>
      <div className="p-2 rounded-lg bg-gradient-to-br from-white/80 to-gray-100/50">
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-gray-900 mb-1">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      <div className="flex items-center gap-2">
        <p className="text-xs text-gray-600">{subtitle}</p>
        {trend && (
          <Badge 
            variant={trend.isPositive ? "default" : "destructive"}
            className="text-xs"
          >
            <TrendingUp className={`w-3 h-3 mr-1 ${trend.isPositive ? '' : 'rotate-180'}`} />
            {trend.value}%
          </Badge>
        )}
      </div>
    </CardContent>
  </Card>
);

const SupplierDashboard = () => {
  return (
    <div className="space-y-6 mb-8">
      {/* Dashboard Header */}
      <div className="bg-gradient-to-r from-primary/10 via-secondary-blue/10 to-primary/5 rounded-xl p-6 border border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary-blue bg-clip-text text-transparent">
              لوحة تحكم الموردين
            </h2>
            <p className="text-muted-foreground mt-1">نظرة شاملة على حالة الموردين والعمليات</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              <Activity className="w-4 h-4" />
              تحديث البيانات
            </Button>
            <Badge variant="secondary" className="gap-1">
              <CheckCircle className="w-3 h-3" />
              محدث
            </Badge>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="إجمالي الموردين"
          value={147}
          subtitle="مورد نشط"
          icon={<Users className="w-5 h-5 text-blue-600" />}
          color="border-l-blue-500"
          trend={{ value: 12, isPositive: true }}
        />
        
        <DashboardCard
          title="الموردين الجدد"
          value={8}
          subtitle="هذا الشهر"
          icon={<TrendingUp className="w-5 h-5 text-green-600" />}
          color="border-l-green-500"
          trend={{ value: 25, isPositive: true }}
        />
        
        <DashboardCard
          title="إجمالي المشتريات"
          value="1.2M جنيه مصري"
          subtitle="هذا الشهر"
          icon={<DollarSign className="w-5 h-5 text-purple-600" />}
          color="border-l-purple-500"
          trend={{ value: 8, isPositive: true }}
        />
        
        <DashboardCard
          title="طلبات معلقة"
          value={23}
          subtitle="تحتاج موافقة"
          icon={<Clock className="w-5 h-5 text-orange-600" />}
          color="border-l-orange-500"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-emerald-50/50 to-green-50/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              الموردين المميزين
            </CardTitle>
            <Star className="w-5 h-5 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 mb-1">42</div>
            <p className="text-xs text-gray-600">تقييم 4+ نجوم</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-red-50/50 to-pink-50/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              تنبيهات مهمة
            </CardTitle>
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 mb-1">5</div>
            <p className="text-xs text-gray-600">تحتاج متابعة فورية</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-indigo-50/50 to-blue-50/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              المناطق المغطاة
            </CardTitle>
            <MapPin className="w-5 h-5 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 mb-1">13</div>
            <p className="text-xs text-gray-600">منطقة جغرافية</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-gray-50/50 to-white/80 border-2 border-dashed border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">الإجراءات السريعة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm" className="gap-2 hover:bg-primary hover:text-white transition-colors">
              <Users className="w-4 h-4" />
              إضافة مورد جديد
            </Button>
            <Button variant="outline" size="sm" className="gap-2 hover:bg-secondary-blue hover:text-white transition-colors">
              <Package className="w-4 h-4" />
              إنشاء طلب شراء
            </Button>
            <Button variant="outline" size="sm" className="gap-2 hover:bg-green-600 hover:text-white transition-colors">
              <Star className="w-4 h-4" />
              تقييم الموردين
            </Button>
            <Button variant="outline" size="sm" className="gap-2 hover:bg-purple-600 hover:text-white transition-colors">
              <DollarSign className="w-4 h-4" />
              مراجعة المدفوعات
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupplierDashboard;