import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Car, User, Phone, Calendar, Check, Trash2, Edit } from 'lucide-react';
import { useCustomerStore } from '@/hooks/useCustomerStore';
import { useToast } from '@/hooks/use-toast';

interface VehicleSearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectVehicle: (vehicle: any, customer: any) => void;
}

const VehicleSearchDialog: React.FC<VehicleSearchDialogProps> = ({ 
  isOpen, 
  onClose, 
  onSelectVehicle 
 }) => {
  const { customers } = useCustomerStore();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredVehicles, setFilteredVehicles] = useState<any[]>([]);

  // استخراج جميع المركبات من العملاء
  const allVehicles = React.useMemo(() => {
    const vehicles: any[] = [];
    customers.forEach(customer => {
      customer.cars.forEach(car => {
        vehicles.push({
          ...car,
          customerName: customer.name,
          customerId: customer.id,
          customerPhone: customer.phone,
          lastVisit: customer.lastVisit,
          customer: customer
        });
      });
    });
    return vehicles;
  }, [customers]);

  // تصفية المركبات بناءً على البحث
  useEffect(() => {
    if (!searchTerm) {
      setFilteredVehicles(allVehicles.slice(0, 10)); // عرض أول 10 نتائج فقط
      return;
    }

    const filtered = allVehicles.filter(vehicle => 
      vehicle.plate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.make?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.customerPhone?.includes(searchTerm)
    );

    setFilteredVehicles(filtered.slice(0, 20));
  }, [searchTerm, allVehicles]);

  const handleSelectVehicle = (vehicle: any) => {
    onSelectVehicle(vehicle, vehicle.customer);
    onClose();
  };

  const handleDeleteVehicle = (vehicle: any, e: React.MouseEvent) => {
    e.stopPropagation(); // منع تشغيل handleSelectVehicle
    
    if (window.confirm(`هل أنت متأكد من حذف المركبة ${vehicle.plate}؟`)) {
      // هنا يمكن إضافة منطق الحذف الفعلي من قاعدة البيانات
      toast({
        title: "تم حذف المركبة",
        description: `تم حذف المركبة ${vehicle.plate} بنجاح`,
        variant: "destructive"
      });
      
      // إعادة تصفية النتائج لإزالة المركبة المحذوفة
      setFilteredVehicles(prev => prev.filter(v => v.plate !== vehicle.plate));
    }
  };

  const handleEditVehicle = (vehicle: any, e: React.MouseEvent) => {
    e.stopPropagation(); // منع تشغيل handleSelectVehicle
    
    toast({
      title: "تعديل المركبة",
      description: `سيتم فتح نموذج تعديل المركبة ${vehicle.plate}`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-right">
            <Search className="h-5 w-5 text-blue-600" />
            البحث عن مركبة موجودة
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* شريط البحث */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="البحث برقم اللوحة، نوع المشروب، اسم العميل، أو رقم الجوال..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10 text-right"
            />
          </div>

          {/* نتائج البحث */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredVehicles.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? (
                  <div>
                    <Car className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>لا توجد مركبات تطابق البحث "{searchTerm}"</p>
                  </div>
                ) : (
                  <div>
                    <Car className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>ابدأ بكتابة رقم اللوحة أو اسم العميل للبحث</p>
                  </div>
                )}
              </div>
            ) : (
              filteredVehicles.map((vehicle, index) => (
                <Card 
                  key={index} 
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-blue-300"
                  onClick={() => handleSelectVehicle(vehicle)}
                >
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      {/* بيانات المركبة */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Car className="h-4 w-4 text-blue-600" />
                          <span className="font-bold text-lg">{vehicle.plate}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>{vehicle.make} {vehicle.model}</p>
                          <p>سنة {vehicle.year}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {vehicle.color || 'لون غير محدد'}
                        </Badge>
                      </div>

                      {/* بيانات العميل */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-green-600" />
                          <span className="font-medium">{vehicle.customerName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="h-3 w-3" />
                          <span>{vehicle.customerPhone}</span>
                        </div>
                        {vehicle.lastVisit && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-3 w-3" />
                            <span>آخر زيارة: {new Date(vehicle.lastVisit).toLocaleDateString('ar-SA')}</span>
                          </div>
                        )}
                      </div>

                      {/* أزرار الإجراءات */}
                      <div className="flex justify-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                        >
                          <Check className="h-4 w-4 ml-2" />
                          اختيار
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => handleEditVehicle(vehicle, e)}
                          className="bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100"
                        >
                          <Edit className="h-4 w-4 ml-2" />
                          تعديل
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => handleDeleteVehicle(vehicle, e)}
                          className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4 ml-2" />
                          حذف
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {filteredVehicles.length > 0 && (
            <div className="text-center text-sm text-gray-500">
              عرض {filteredVehicles.length} من {allVehicles.length} مركبة
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleSearchDialog;