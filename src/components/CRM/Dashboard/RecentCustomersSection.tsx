import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetCustomersQuery } from "@/services/customersApi";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  customerType: 'Individual' | 'Company' | 'Group';
  totalVisits: number;
  totalSpent: number;
  lastVisit?: string;
  createdAt: string;
}

const getStatusBadge = (customer: Customer) => {
  // Determine status based on customer data
  if (customer.totalSpent > 10000) {
    return <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">VIP</Badge>;
  } else if (customer.totalVisits <= 3) {
    return <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">جديد</Badge>;
  } else {
    return <Badge variant="outline">عادي</Badge>;
  }
};

const getCustomerTypeBadge = (customerType: string) => {
  switch (customerType) {
    case "Individual":
      return <Badge variant="secondary" className="text-xs">فرد</Badge>;
    case "Company":
      return <Badge variant="secondary" className="text-xs">شركة</Badge>;
    case "Group":
      return <Badge variant="secondary" className="text-xs">مجموعة</Badge>;
    default:
      return <Badge variant="outline" className="text-xs">{customerType}</Badge>;
  }
};

export function RecentCustomersSection() {
  const navigate = useNavigate();
  const { data: customersData, isLoading, error } = useGetCustomersQuery({ 
    limit: 4, 
    offset: 0 
  });

  const recentCustomers = customersData?.data || [];

  if (isLoading) {
    return (
      <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-gray-50/50 to-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500 animate-pulse" />
            العملاء الحديثون
          </CardTitle>
          <CardDescription>آخر العملاء المضافين والمحدثين</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-gray-50/50 to-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-red-500" />
            العملاء الحديثون
          </CardTitle>
          <CardDescription>خطأ في تحميل البيانات</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600">حدث خطأ في تحميل العملاء</p>
            <p className="text-sm text-muted-foreground mt-2">يرجى المحاولة مرة أخرى</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (recentCustomers.length === 0) {
    return (
      <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-gray-50/50 to-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            العملاء الحديثون
          </CardTitle>
          <CardDescription>لا يوجد عملاء في النظام</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">لا يوجد عملاء مسجلين في النظام</p>
            <p className="text-sm text-muted-foreground mt-2">ابدأ بإضافة عملاء جدد</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-gray-50/50 to-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-500 animate-pulse" />
          العملاء الحديثون
        </CardTitle>
        <CardDescription>آخر العملاء المضافين والمحدثين</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentCustomers.map((customer: Customer, index: number) => (
            <div 
              key={customer.id} 
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 hover:shadow-md hover:scale-[1.02] transition-all duration-300 cursor-pointer group animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => navigate('/crm/customers')}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-medium group-hover:scale-110 transition-transform duration-200 shadow-lg">
                  {customer.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-medium group-hover:text-blue-600 transition-colors">{customer.name}</h4>
                  <p className="text-sm text-muted-foreground">{customer.phone}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {getCustomerTypeBadge(customer.customerType)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center group-hover:scale-105 transition-transform duration-200">
                  <p className="text-sm font-medium">{customer.totalVisits}</p>
                  <p className="text-xs text-muted-foreground">زيارة</p>
                </div>
                <div className="text-center group-hover:scale-105 transition-transform duration-200">
                  <p className="text-sm font-medium">{customer.totalSpent} جنيه مصري</p>
                  <p className="text-xs text-muted-foreground">إجمالي</p>
                </div>
                <div className="text-center group-hover:scale-105 transition-transform duration-200">
                  <p className="text-sm">
                    {customer.lastVisit 
                      ? formatDistanceToNow(new Date(customer.lastVisit), { addSuffix: true, locale: ar })
                      : 'لم يزر بعد'
                    }
                  </p>
                  <p className="text-xs text-muted-foreground">آخر زيارة</p>
                </div>
                <div className="group-hover:scale-110 transition-transform duration-200">
                  {getStatusBadge(customer)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}