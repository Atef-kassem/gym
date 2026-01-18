import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Car, 
  Calendar, 
  Fuel, 
  Wrench, 
  Palette, 
  Settings,
  FileText,
  Image as ImageIcon,
  Edit,
  X
} from "lucide-react";

interface VehicleDetailsDialogProps {
  vehicle: any;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (vehicle: any) => void;
}

export function VehicleDetailsDialog({ vehicle, isOpen, onClose, onEdit }: VehicleDetailsDialogProps) {
  if (!vehicle) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 bg-gradient-primary text-white rounded-t-lg">
          <DialogTitle className="text-xl font-bold flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Car className="h-6 w-6" />
            </div>
            تفاصيل المركبة
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute left-4 top-4 text-white hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* صورة المركبة */}
          {vehicle.image && (
            <Card>
              <CardContent className="p-4">
                <img 
                  src={vehicle.image} 
                  alt={`${vehicle.makeDisplayName} ${vehicle.modelDisplayName}`}
                  className="w-full h-64 object-cover rounded-lg border"
                />
              </CardContent>
            </Card>
          )}

          {/* المعلومات الأساسية */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Car className="h-5 w-5" />
                المعلومات الأساسية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">رقم اللوحة</p>
                  <p className="text-lg font-bold text-foreground">{vehicle.plateNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">الحالة</p>
                  <Badge 
                    variant={vehicle.status === 'نشط' ? 'default' : 'secondary'}
                    className={vehicle.status === 'نشط' ? 'bg-green-500 hover:bg-green-600' : ''}
                  >
                    {vehicle.status}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">الماركة</p>
                  <p className="text-lg font-semibold">{vehicle.makeDisplayName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">الموديل</p>
                  <p className="text-lg font-semibold">{vehicle.modelDisplayName}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">نوع المركبة</p>
                  <p className="flex items-center gap-2">
                    <Car className="h-4 w-4 text-muted-foreground" />
                    {vehicle.vehicleTypeDisplayName}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">سنة الصنع</p>
                  <p className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {vehicle.year || 'غير محدد'}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">اللون</p>
                <p className="flex items-center gap-2">
                  <Palette className="h-4 w-4 text-muted-foreground" />
                  {vehicle.colorDisplayName || 'غير محدد'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* المواصفات التقنية */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Settings className="h-5 w-5" />
                المواصفات التقنية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">نوع الوقود</p>
                  <p className="flex items-center gap-2">
                    <Fuel className="h-4 w-4 text-muted-foreground" />
                    {vehicle.fuelTypeDisplayName}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ناقل الحركة</p>
                  <p className="flex items-center gap-2">
                    <Wrench className="h-4 w-4 text-muted-foreground" />
                    {vehicle.transmissionDisplayName}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">سعة المحرك</p>
                  <p className="text-lg font-semibold">{vehicle.engineSize ? `${vehicle.engineSize}L` : 'غير محدد'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">كمية الزيت الموصى بها</p>
                  <p className="text-lg font-semibold">{vehicle.recommendedOilQuantity ? `${vehicle.recommendedOilQuantity} لتر` : 'غير محدد'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">رقم الهيكل (الشاصي)</p>
                  <p className="font-mono text-sm bg-gray-50 p-2 rounded border">
                    {vehicle.chassisNumber || 'غير محدد'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">عداد المسافة</p>
                  <p className="text-lg font-semibold">{vehicle.odometerReading ? `${vehicle.odometerReading} كم` : 'غير محدد'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* الملاحظات */}
          {vehicle.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <FileText className="h-5 w-5" />
                  الملاحظات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground whitespace-pre-wrap">{vehicle.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* معلومات إضافية */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">معلومات إضافية</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">تاريخ الإضافة</p>
                  <p>{new Date(vehicle.addedDate).toLocaleDateString('ar-SA')}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">معرف المركبة</p>
                  <p className="font-mono text-xs">{vehicle.id}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* أزرار العمليات */}
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={() => onEdit(vehicle)}
              className="flex-1 bg-gradient-primary hover:opacity-90"
            >
              <Edit className="h-4 w-4 mr-2" />
              تعديل المركبة
            </Button>
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              إغلاق
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}