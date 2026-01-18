import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Receipt, 
  Calendar, 
  Car, 
  User, 
  Search,
  Filter,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Eye,
  RefreshCw,
  FileText
} from 'lucide-react';
import { CustomerTransactionsService } from '@/services/customerTransactionsApi';
import { generateTestInvoices, addTestInvoice, showTestDataStats } from '@/utils/testDataGenerator';

interface Transaction {
  id: string;
  date: string;
  services: string[];
  amount: number;
  paidAmount: number;
  status: string;
  carPlate: string;
  carModel: string;
  supervisor: string;
  branch: string;
  paymentMethod: string;
  notes: string;
  invoiceNumber: string;
  customerName?: string;
}

interface CustomerStats {
  totalTransactions: number;
  totalAmount: number;
  totalPaid: number;
  pendingAmount: number;
  statusStats: Record<string, number>;
  averageTransactionValue: number;
  lastTransaction: Transaction | null;
  currency: string;
}

interface CustomerTransactionHistoryProps {
  customerId: string;
}

export function CustomerTransactionHistory({ customerId }: CustomerTransactionHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<CustomerStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'مكتمل':
        return { 
          color: 'bg-green-100 text-green-800 border-green-200', 
          icon: CheckCircle,
          iconColor: 'text-green-600'
        };
      case 'جزئي':
        return { 
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
          icon: Clock,
          iconColor: 'text-yellow-600'
        };
      case 'معلق':
        return { 
          color: 'bg-red-100 text-red-800 border-red-200', 
          icon: AlertCircle,
          iconColor: 'text-red-600'
        };
      default:
        return { 
          color: 'bg-gray-100 text-gray-800 border-gray-200', 
          icon: Clock,
          iconColor: 'text-gray-600'
        };
    }
  };

  // تحميل المعاملات عند تغيير الفلاتر أو العميل
  useEffect(() => {
    const loadTransactions = async () => {
      setLoading(true);
      try {
        const filters = {
          search: searchTerm,
          status: statusFilter,
          dateRange: dateRange
        };
        
        const customerTransactions = CustomerTransactionsService.getCustomerTransactions(customerId, filters) as Transaction[];
        const customerStats = CustomerTransactionsService.getCustomerStats(customerId) as CustomerStats;
        
        setTransactions(customerTransactions);
        setStats(customerStats);
      } catch (error) {
        console.error('خطأ في تحميل معاملات العميل:', error);
        setTransactions([]);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    if (customerId) {
      loadTransactions();
    }
  }, [customerId, searchTerm, statusFilter, dateRange]);

  // تحديث البيانات
  const handleRefresh = () => {
    setRefreshing(true);
    try {
      const filters = {
        search: searchTerm,
        status: statusFilter,
        dateRange: dateRange
      };
      
      const customerTransactions = CustomerTransactionsService.getCustomerTransactions(customerId, filters) as Transaction[];
      const customerStats = CustomerTransactionsService.getCustomerStats(customerId) as CustomerStats;
      
      setTransactions(customerTransactions);
      setStats(customerStats);
    } catch (error) {
      console.error('خطأ في تحديث المعاملات:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // تصدير المعاملات
  const handleExport = () => {
    try {
      const exportData = CustomerTransactionsService.exportCustomerTransactions(customerId, 'json');
      if (exportData) {
        const url = URL.createObjectURL(exportData);
        const link = document.createElement('a');
        link.href = url;
        link.download = `customer-transactions-${customerId}-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('خطأ في تصدير المعاملات:', error);
    }
  };

  // إنشاء بيانات تجريبية للاختبار
  const handleGenerateTestData = () => {
    generateTestInvoices();
    showTestDataStats();
    handleRefresh();
  };

  // إضافة ايصال تجريبية جديدة
  const handleAddTestInvoice = () => {
    addTestInvoice(customerId);
    handleRefresh();
  };

  // استخدام الإحصائيات المحسوبة أو القيم الافتراضية
  const totalTransactions = stats?.totalTransactions || transactions.length;
  const totalAmount = stats?.totalAmount || transactions.reduce((sum, txn) => sum + txn.amount, 0);
  const totalPaid = stats?.totalPaid || transactions.reduce((sum, txn) => sum + txn.paidAmount, 0);
  const pendingAmount = stats?.pendingAmount || (totalAmount - totalPaid);

  return (
    <div className="space-y-6">
      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-800">{totalTransactions}</div>
            <div className="text-sm text-blue-600">إجمالي المعاملات</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-800">{totalAmount.toLocaleString()}</div>
            <div className="text-sm text-green-600">إجمالي المبلغ</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-800">{totalPaid.toLocaleString()}</div>
            <div className="text-sm text-purple-600">المبلغ المدفوع</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-800">{pendingAmount.toLocaleString()}</div>
            <div className="text-sm text-orange-600">المتبقي</div>
          </CardContent>
        </Card>
      </div>

      {/* أدوات التصفية والبحث */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              سجل المعاملات
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                تحديث
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleExport}
                disabled={transactions.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                تصدير
              </Button>
              {/* أزرار للاختبار - يمكن إزالتها في الإنتاج */}
              {process.env.NODE_ENV === 'development' && (
                <>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={handleGenerateTestData}
                  >
                    إنشاء بيانات تجريبية
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={handleAddTestInvoice}
                  >
                    إضافة ايصال تجريبية
                  </Button>
                </>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="البحث في المعاملات، رقم اللوحة، أو رقم الايصال..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="تصفية بالحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="مكتمل">مكتمل</SelectItem>
                <SelectItem value="جزئي">جزئي</SelectItem>
                <SelectItem value="معلق">معلق</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-48">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="الفترة الزمنية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الفترات</SelectItem>
                <SelectItem value="today">اليوم</SelectItem>
                <SelectItem value="week">هذا الأسبوع</SelectItem>
                <SelectItem value="month">هذا الشهر</SelectItem>
                <SelectItem value="quarter">هذا الربع</SelectItem>
                <SelectItem value="year">هذا العام</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* قائمة المعاملات */}
          <div className="space-y-4">
            {loading ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <RefreshCw className="h-8 w-8 mx-auto mb-4 text-blue-500 animate-spin" />
                  <div className="text-gray-600">جاري تحميل المعاملات...</div>
                </CardContent>
              </Card>
            ) : transactions.map((transaction) => {
              const statusConfig = getStatusConfig(transaction.status);
              const StatusIcon = statusConfig.icon;
              
              return (
                <Card key={transaction.id} className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                          <Receipt className="h-6 w-6 text-white" />
                        </div>
                        
                        <div>
                          <div className="font-bold text-lg text-gray-800">
                            {transaction.services.join(' + ')}
                          </div>
                          <div className="text-sm text-gray-600 space-x-2">
                            <span className="flex items-center gap-1">
                              <Car className="h-3 w-3" />
                              {transaction.carPlate} - {transaction.carModel}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500 mt-1 space-x-2">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(transaction.date).toLocaleString('ar-SA')}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              المشرف: {transaction.supervisor}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right space-y-2">
                        <div className="font-bold text-xl text-green-600">
                          {transaction.amount.toLocaleString()} جنيه مصري
                        </div>
                        
                        <Badge className={`${statusConfig.color} border`}>
                          <StatusIcon className={`h-3 w-3 mr-1 ${statusConfig.iconColor}`} />
                          {transaction.status}
                        </Badge>
                        
                        {transaction.status === 'جزئي' && (
                          <div className="text-sm text-orange-600">
                            مدفوع: {transaction.paidAmount.toLocaleString()} جنيه مصري
                            <br />
                            متبقي: {(transaction.amount - transaction.paidAmount).toLocaleString()} جنيه مصري
                          </div>
                        )}
                        
                        <div className="flex gap-2 mt-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-3 w-3 mr-1" />
                            عرض
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {transaction.notes && (
                      <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600">
                          <strong>ملاحظات:</strong> {transaction.notes}
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-3 flex items-center justify-between text-xs text-gray-500 border-t pt-2">
                      <span>الفرع: {transaction.branch}</span>
                      <span>رقم الايصال: {transaction.invoiceNumber}</span>
                      <span>طريقة الدفع: {transaction.paymentMethod}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            {!loading && transactions.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <div className="text-gray-600 mb-2">
                    {searchTerm || statusFilter !== 'all' || dateRange !== 'all' 
                      ? 'لا توجد معاملات تطابق البحث' 
                      : 'لا توجد معاملات لهذا العميل'}
                  </div>
                  {!searchTerm && statusFilter === 'all' && dateRange === 'all' && (
                    <div className="text-sm text-gray-500">
                      سيتم عرض المعاملات هنا عند قيام العميل بعملية شراء
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}