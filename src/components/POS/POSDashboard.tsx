import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Monitor, 
  CreditCard, 
  FileText, 
  Bell, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Activity,
  Loader2
} from 'lucide-react';
// import { useGetPosDashboardQuery } from '@/services/posApi';

interface DashboardStats {
  totalDevices: number;
  activeDevices: number;
  totalPaymentMethods: number;
  activePaymentMethods: number;
  totalInvoices: number;
  totalRevenue: number;
  totalNotifications: number;
  pendingNotifications: number;
  recentTransactions: Array<{
    id: number;
    amount: number;
    paymentMethod: string;
    deviceName: string;
    timestamp: string;
    status: string;
  }>;
  deviceStatuses: Array<{
    id: number;
    name: string;
    status: string;
    lastActivity: string;
  }>;
}

const POSDashboard = () => {
  // بيانات ثابتة للوحة التحكم
  const stats: DashboardStats = {
    totalDevices: 12,
    activeDevices: 8,
    totalPaymentMethods: 6,
    activePaymentMethods: 5,
    totalInvoices: 156,
    totalRevenue: 45230,
    totalNotifications: 23,
    pendingNotifications: 5,
    recentTransactions: [
      {
        id: 1,
        amount: 250,
        paymentMethod: "بطاقة ائتمان",
        deviceName: "جهاز 1",
        timestamp: "2025-01-20T10:30:00Z",
        status: "مكتمل"
      },
      {
        id: 2,
        amount: 180,
        paymentMethod: "نقدي",
        deviceName: "جهاز 2",
        timestamp: "2025-01-20T10:15:00Z",
        status: "مكتمل"
      },
      {
        id: 3,
        amount: 320,
        paymentMethod: "محفظة إلكترونية",
        deviceName: "جهاز 1",
        timestamp: "2025-01-20T10:00:00Z",
        status: "معلق"
      }
    ],
    deviceStatuses: [
      {
        id: 1,
        name: "جهاز 1",
        status: "نشط",
        lastActivity: "2025-01-20T10:30:00Z"
      },
      {
        id: 2,
        name: "جهاز 2",
        status: "نشط",
        lastActivity: "2025-01-20T10:15:00Z"
      },
      {
        id: 3,
        name: "جهاز 3",
        status: "غير نشط",
        lastActivity: "2025-01-20T09:45:00Z"
      }
    ]
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR'
    }).format(amount);
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

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'completed':
      case 'success':
        return 'default';
      case 'inactive':
      case 'pending':
        return 'secondary';
      case 'error':
      case 'failed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusLabel = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'active': 'نشط',
      'inactive': 'غير نشط',
      'completed': 'مكتمل',
      'pending': 'معلق',
      'success': 'نجح',
      'error': 'خطأ',
      'failed': 'فشل'
    };
    return statusMap[status.toLowerCase()] || status;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">لوحة تحكم نقاط البيع</h2>
          <p className="text-muted-foreground">نظرة عامة على أداء النظام</p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          النظام يعمل بشكل طبيعي
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الأجهزة</CardTitle>
            <Monitor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDevices}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeDevices} جهاز نشط
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">طرق الدفع</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPaymentMethods}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activePaymentMethods} طريقة مفعلة
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المبيعات</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalInvoices} ايصال
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الإشعارات</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalNotifications}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingNotifications} معلقة
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              المعاملات الحديثة
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentTransactions.length > 0 ? (
              <div className="space-y-3">
                {stats.recentTransactions.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <DollarSign className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{formatCurrency(transaction.amount)}</div>
                        <div className="text-sm text-muted-foreground">
                          {transaction.paymentMethod} • {transaction.deviceName}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={getStatusBadgeVariant(transaction.status)}>
                        {getStatusLabel(transaction.status)}
                      </Badge>
                      <div className="text-xs text-muted-foreground mt-1">
                        {formatDate(transaction.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                لا توجد معاملات حديثة
              </div>
            )}
          </CardContent>
        </Card>

        {/* Device Statuses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              حالة الأجهزة
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.deviceStatuses.length > 0 ? (
              <div className="space-y-3">
                {stats.deviceStatuses.slice(0, 5).map((device) => (
                  <div key={device.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        device.status === 'active' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        <Monitor className={`h-4 w-4 ${
                          device.status === 'active' ? 'text-green-600' : 'text-red-600'
                        }`} />
                      </div>
                      <div>
                        <div className="font-medium">{device.name}</div>
                        <div className="text-sm text-muted-foreground">
                          آخر نشاط: {formatDate(device.lastActivity)}
                        </div>
                      </div>
                    </div>
                    <Badge variant={getStatusBadgeVariant(device.status)}>
                      {getStatusLabel(device.status)}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                لا توجد أجهزة مسجلة
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>إجراءات سريعة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors cursor-pointer">
              <Monitor className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="font-medium">إدارة الأجهزة</div>
              <div className="text-sm text-muted-foreground">إضافة/تعديل الأجهزة</div>
            </div>
            
            <div className="text-center p-4 bg-blue-500/5 rounded-lg hover:bg-blue-500/10 transition-colors cursor-pointer">
              <CreditCard className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <div className="font-medium">طرق الدفع</div>
              <div className="text-sm text-muted-foreground">إعداد طرق الدفع</div>
            </div>
            
            <div className="text-center p-4 bg-green-500/5 rounded-lg hover:bg-green-500/10 transition-colors cursor-pointer">
              <FileText className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <div className="font-medium">قوالب الإيصالات</div>
              <div className="text-sm text-muted-foreground">تخصيص الإيصالات</div>
            </div>
            
            <div className="text-center p-4 bg-orange-500/5 rounded-lg hover:bg-orange-500/10 transition-colors cursor-pointer">
              <Bell className="h-8 w-8 mx-auto mb-2 text-orange-500" />
              <div className="font-medium">الإشعارات</div>
              <div className="text-sm text-muted-foreground">إعداد التنبيهات</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            صحة النظام
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-600">98%</div>
              <div className="text-sm text-green-700">صحة النظام</div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">24/7</div>
              <div className="text-sm text-blue-700">وقت التشغيل</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-2xl font-bold text-purple-600">99.9%</div>
              <div className="text-sm text-purple-700">موثوقية النظام</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default POSDashboard;
