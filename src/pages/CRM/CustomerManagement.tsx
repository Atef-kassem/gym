import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BranchSelector } from "@/components/BranchSelector";
import { 
  Users, 
  Search, 
  Plus, 
  Filter,
  Eye,
  Edit,
  Crown,
  Star,
  Shield,
  Phone,
  Mail,
  MapPin,
  Car,
  Calendar,
  TrendingUp,
  Award,
  DollarSign,
  UserPlus,
  Download,
  Upload,
  Grid3X3,
  List
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UnifiedCustomerForm } from "@/components/CustomerManagement/UnifiedCustomerForm";
import { CustomerDetailsPopup } from "@/components/POS/CustomerDetailsPopup";
import { CustomerProfileCard } from "@/components/CRM/CustomerProfileCard";
import { CustomerTransactionHistory } from "@/components/CRM/CustomerTransactionHistory";
import { useToast } from "@/hooks/use-toast";
import { useCustomerStore } from '@/hooks/useCustomerStore';
import { Customer } from '@/types/customer';

export default function CustomerManagement() {
  const { toast } = useToast();
  const { customers, addCustomer, updateCustomer } = useCustomerStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [customerTypeFilter, setCustomerTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'

  // حساب الإحصائيات
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(customer => {
    if (!customer.lastVisit) return false;
    const lastVisit = new Date(customer.lastVisit);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return lastVisit > thirtyDaysAgo;
  }).length;
  
  const vipCustomers = customers.filter(customer => 
    customer.customerType === 'Individual' || customer.customerType === 'Company'
  ).length;
  
  const totalRevenue = customers.reduce((sum, customer) => sum + customer.totalSpent, 0);

  // تصفية وترتيب العملاء
  const filteredCustomers = customers
    .filter(customer => {
      const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.phone.includes(searchTerm) ||
                           customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.cars?.some(car => car.plate.includes(searchTerm));
      
      const matchesType = customerTypeFilter === 'all' || customer.customerType === customerTypeFilter;
      
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name, 'ar');
        case 'joinDate':
          return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
        case 'totalSpent':
          return b.totalSpent - a.totalSpent;
        case 'totalVisits':
          return b.totalVisits - a.totalVisits;
        default:
          return 0;
      }
    });

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setIsDetailsOpen(true);
  };

  const handleEditCustomer = (customer) => {
    setSelectedCustomer(customer);
    setIsEditDialogOpen(true);
  };

  const handleSaveCustomer = (customer: Customer) => {
    toast({
      title: "تم إضافة العميل بنجاح",
      description: `تم إضافة ${customer.name} كعميل جديد`,
    });
  };

  const handleUpdateCustomer = (customer: Customer) => {
    toast({
      title: "تم تحديث بيانات العميل",
      description: `تم تحديث بيانات ${customer.name} بنجاح`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              إدارة العملاء
            </h1>
            <p className="text-gray-600 mt-2">إدارة وتتبع بيانات العملاء ومعاملاتهم</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              استيراد
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              تصدير
            </Button>
            <Button 
              onClick={() => setIsAddCustomerOpen(true)}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              إضافة عميل (فرد/شركة/مجموعة)
            </Button>
          </div>
        </div>

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">إجمالي العملاء</p>
                  <p className="text-3xl font-bold text-blue-900">{totalCustomers}</p>
                  <p className="text-blue-500 text-xs mt-1">+5% من الشهر الماضي</p>
                </div>
                <div className="p-3 bg-blue-200 rounded-full">
                  <Users className="h-6 w-6 text-blue-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">العملاء النشطون</p>
                  <p className="text-3xl font-bold text-green-900">{activeCustomers}</p>
                  <p className="text-green-500 text-xs mt-1">هذا الشهر</p>
                </div>
                <div className="p-3 bg-green-200 rounded-full">
                  <TrendingUp className="h-6 w-6 text-green-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">العملاء المميزون</p>
                  <p className="text-3xl font-bold text-purple-900">{vipCustomers}</p>
                  <p className="text-purple-500 text-xs mt-1">شركات + مجموعات</p>
                </div>
                <div className="p-3 bg-purple-200 rounded-full">
                  <Crown className="h-6 w-6 text-purple-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">إجمالي الإيرادات</p>
                  <p className="text-3xl font-bold text-orange-900">{totalRevenue.toLocaleString()}</p>
                  <p className="text-orange-600 text-xs">جنيه مصري</p>
                </div>
                <div className="p-3 bg-orange-200 rounded-full">
                  <DollarSign className="h-6 w-6 text-orange-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* أدوات البحث والتصفية */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="البحث عن عميل (الاسم، الجوال، رقم اللوحة...)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-2 focus:border-blue-500 bg-white"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 w-full sm:w-auto">
                <Select value={customerTypeFilter} onValueChange={setCustomerTypeFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="نوع العضوية" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع العملاء</SelectItem>
                    <SelectItem value="Individual">عملاء أفراد</SelectItem>
                    <SelectItem value="Company">شركات</SelectItem>
                    <SelectItem value="Group">مجموعات</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="ترتيب حسب" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">الاسم</SelectItem>
                    <SelectItem value="joinDate">تاريخ الانضمام</SelectItem>
                    <SelectItem value="totalSpent">إجمالي الإنفاق</SelectItem>
                    <SelectItem value="totalVisits">عدد الزيارات</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex border rounded-lg overflow-hidden">
                  <Button
                    variant={viewMode === 'cards' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('cards')}
                    className="rounded-none"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'table' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('table')}
                    className="rounded-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* قائمة العملاء */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            {viewMode === 'cards' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCustomers.map((customer) => (
                  <CustomerProfileCard
                    key={customer.id}
                    customer={customer}
                    onView={handleViewCustomer}
                    onEdit={handleEditCustomer}
                  />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">العميل</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">رقم الجوال</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">نوع العضوية</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">الزيارات</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">الإنفاق</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">آخر زيارة</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map((customer) => (
                      <tr key={customer.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img 
                              src={customer.avatar} 
                              alt={customer.name}
                              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                            />
                            <div>
                              <div className="font-semibold text-gray-900">{customer.name}</div>
                              <div className="text-sm text-gray-500">{customer.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4" dir="ltr">{customer.phone}</td>
                        <td className="py-3 px-4">
                          <Badge className={
                            customer.customerType === 'Individual' ? 'bg-blue-100 text-blue-800' :
                            customer.customerType === 'Company' ? 'bg-green-100 text-green-800' :
                            'bg-purple-100 text-purple-800'
                          }>
                            {customer.customerType === 'Individual' ? 'عميل فردي' :
                             customer.customerType === 'Company' ? 'شركة' : 'مجموعة'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 font-semibold text-blue-600">{customer.totalVisits}</td>
                        <td className="py-3 px-4 font-semibold text-green-600">{customer.totalSpent.toLocaleString()}</td>
                        <td className="py-3 px-4 text-gray-600">{customer.lastVisit ? new Date(customer.lastVisit).toLocaleDateString('ar-SA') : 'لا توجد زيارات'}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewCustomer(customer)}
                              className="hover:bg-blue-50 hover:border-blue-300"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditCustomer(customer)}
                              className="hover:bg-green-50 hover:border-green-300"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {filteredCustomers.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد نتائج</h3>
                <p className="text-gray-600">لم يتم العثور على عملاء يطابقون معايير البحث</p>
                <Button 
                  className="mt-4" 
                  onClick={() => setIsAddCustomerOpen(true)}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  إضافة أول عميل
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* نوافذ التفاعل */}
      <UnifiedCustomerForm
        isOpen={isAddCustomerOpen}
        onClose={() => setIsAddCustomerOpen(false)}
        onSuccess={(customer) => {
          setIsAddCustomerOpen(false);
          handleSaveCustomer(customer);
        }}
        mode="add"
      />

      <UnifiedCustomerForm
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSuccess={(customer) => {
          setIsEditDialogOpen(false);
          setSelectedCustomer(null);
          handleUpdateCustomer(customer);
        }}
        customer={selectedCustomer}
        mode="edit"
      />
      <CustomerDetailsPopup
        customer={selectedCustomer}
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedCustomer(null);
        }}
      />
    </div>
  );
}