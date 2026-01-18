import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Crown, 
  Star, 
  Shield, 
  Phone, 
  Mail, 
  MapPin,
  Car,
  Calendar,
  Edit,
  Eye,
  TrendingUp,
  Award
} from 'lucide-react';

interface CustomerProfileCardProps {
  customer: any;
  onView: (customer: any) => void;
  onEdit: (customer: any) => void;
}

export function CustomerProfileCard({ customer, onView, onEdit }: CustomerProfileCardProps) {
  const getCustomerTypeConfig = (type: string) => {
    switch (type) {
      case 'Individual':
        return {
          icon: Shield,
          label: 'عميل فردي',
          gradient: 'from-blue-500 to-blue-600',
          bgColor: 'bg-gradient-to-r from-blue-50 to-blue-50',
          borderColor: 'border-blue-200'
        };
      case 'Company':
        return {
          icon: Star,
          label: 'شركة',
          gradient: 'from-green-500 to-green-600',
          bgColor: 'bg-gradient-to-r from-green-50 to-green-50',
          borderColor: 'border-green-200'
        };
      case 'Group':
        return {
          icon: Crown,
          label: 'مجموعة',
          gradient: 'from-purple-500 to-purple-600',
          bgColor: 'bg-gradient-to-r from-purple-50 to-purple-50',
          borderColor: 'border-purple-200'
        };
      default:
        return {
          icon: Shield,
          label: 'عميل فردي',
          gradient: 'from-blue-500 to-blue-600',
          bgColor: 'bg-gradient-to-r from-blue-50 to-blue-50',
          borderColor: 'border-blue-200'
        };
    }
  };

  const typeConfig = getCustomerTypeConfig(customer.customerType);
  const TypeIcon = typeConfig.icon;

  return (
    <Card className={`hover:shadow-xl transition-all duration-300 ${typeConfig.borderColor} border-2 ${typeConfig.bgColor} group`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={customer.avatar} 
              alt={customer.name}
              className="w-12 h-12 rounded-full border-3 border-white shadow-lg object-cover ring-2 ring-gray-100"
            />
            <div>
              <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-gray-900 transition-colors">
                {customer.name}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={`bg-gradient-to-r ${typeConfig.gradient} text-white shadow-md`}>
                  <TypeIcon className="w-3 h-3 mr-1" />
                  {typeConfig.label}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(customer)}
              className="hover:bg-blue-50 hover:border-blue-300"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(customer)}
              className="hover:bg-green-50 hover:border-green-300"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* معلومات الاتصال */}
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center gap-2 text-gray-600">
            <Phone className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium" dir="ltr">{customer.phone}</span>
          </div>
          {customer.email && (
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="h-4 w-4 text-green-500" />
              <span className="text-sm" dir="ltr">{customer.email}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="h-4 w-4 text-red-500" />
            <span className="text-sm">{customer.address?.split('،')[0] || 'غير محدد'}</span>
          </div>
        </div>

        {/* إحصائيات */}
        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-200">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">{customer.totalVisits}</div>
            <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
              <Award className="h-3 w-3" />
              زيارة
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">
              {customer.totalSpent.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
              <TrendingUp className="h-3 w-3" />
              جنيه
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600">{customer.cars?.length || 0}</div>
            <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
              <Car className="h-3 w-3" />
              مشروب
            </div>
          </div>
        </div>

        {/* تاريخ الانضمام */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>انضم في {new Date(customer.joinDate).toLocaleDateString('ar-SA')}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>آخر زيارة: {new Date(customer.lastVisit).toLocaleDateString('ar-SA')}</span>
          </div>
        </div>

        {/*  الكافية */}
        {customer.cars && customer.cars.length > 0 && (
          <div className="mt-3">
            <div className="text-xs font-medium text-gray-600 mb-2 flex items-center gap-1">
              <Car className="h-3 w-3" />
               الكافية المسجلة
            </div>
            <div className="space-y-1">
              {customer.cars.slice(0, 2).map((car: any) => (
                <div key={car.id} className="flex items-center justify-between text-xs bg-white bg-opacity-60 p-2 rounded-lg">
                  <span className="font-medium">{car.plate}</span>
                  <span className="text-gray-500">{car.make} {car.model}</span>
                </div>
              ))}
              {customer.cars.length > 2 && (
                <div className="text-xs text-gray-500 text-center py-1">
                  +{customer.cars.length - 2} مشروب أخرى
                </div>
              )}
            </div>
          </div>
        )}

        {/* الباقات النشطة */}
        {customer.packages && customer.packages.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {customer.packages.map((pkg: any) => (
              <Badge key={pkg.id} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                {pkg.name}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}