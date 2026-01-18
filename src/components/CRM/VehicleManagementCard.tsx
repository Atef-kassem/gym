import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Car, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  Fuel,
  Wrench,
  Palette,
  MoreVertical
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface VehicleManagementCardProps {
  vehicle: any;
  onEdit: (vehicle: any) => void;
  onDelete: (vehicleId: string) => void;
  onView: (vehicle: any) => void;
}

export function VehicleManagementCard({ vehicle, onEdit, onDelete, onView }: VehicleManagementCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <Car className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-foreground">
                {vehicle.make} {vehicle.model}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{vehicle.plate}</p>
              <p className="text-xs text-primary font-medium">{vehicle.customerName}</p>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(vehicle)}>
                <Eye className="h-4 w-4 mr-2" />
                عرض التفاصيل
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(vehicle)}>
                <Edit className="h-4 w-4 mr-2" />
                تعديل
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(vehicle.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                حذف
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* صورة المركبة */}
        {vehicle.image && (
          <div className="relative">
            <img 
              src={vehicle.image} 
              alt={`${vehicle.make} ${vehicle.model}`}
              className="w-full h-32 object-cover rounded-lg border"
            />
            <Badge 
              variant="secondary" 
              className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
            >
              {vehicle.vehicleType}
            </Badge>
          </div>
        )}
        
        {/* معلومات المركبة */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{vehicle.year || 'غير محدد'}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-muted-foreground" />
            <span>{vehicle.color || 'غير محدد'}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Fuel className="h-4 w-4 text-muted-foreground" />
            <span>{vehicle.fuelType}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Wrench className="h-4 w-4 text-muted-foreground" />
            <span>{vehicle.transmission}</span>
          </div>

          {/* الحقول الجديدة */}
          {vehicle.chassisNumber && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">الهيكل:</span>
              <span className="font-mono text-xs">{vehicle.chassisNumber}</span>
            </div>
          )}

          {vehicle.odometerReading && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">العداد:</span>
              <span>{vehicle.odometerReading} كم</span>
            </div>
          )}
        </div>
        
        {/* حالة المركبة */}
        <div className="flex items-center justify-between pt-2">
          <Badge 
            variant={vehicle.status === 'نشط' ? 'default' : 'secondary'}
            className={vehicle.status === 'نشط' ? 'bg-green-500 hover:bg-green-600' : ''}
          >
            {vehicle.status}
          </Badge>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {vehicle.engineSize && (
              <span>{vehicle.engineSize}L</span>
            )}
            {vehicle.recommendedOilQuantity && (
              <span>زيت: {vehicle.recommendedOilQuantity}L</span>
            )}
          </div>
        </div>
        
        {/* الملاحظات */}
        {vehicle.notes && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground truncate" title={vehicle.notes}>
              {vehicle.notes}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}