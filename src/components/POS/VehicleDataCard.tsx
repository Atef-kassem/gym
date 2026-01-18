import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Car, Settings, Eye, Edit3, CheckCircle } from 'lucide-react';
import { InteractiveCard, StatusBadge, FloatingParticles } from "@/components/ui/animated-components";

interface VehicleDataCardProps {
  vehicleData?: {
    plateNumber?: string;
    vehicleType?: string;
    vehicleModel?: string;
    year?: string;
    color?: string;
  };
  onEdit?: () => void;
  className?: string;
}

export function VehicleDataCard({ vehicleData, onEdit, className = "" }: VehicleDataCardProps) {
  const hasData = vehicleData && (vehicleData.plateNumber || vehicleData.vehicleType);

  return (
    <InteractiveCard 
      className={`relative ${className}`}
      hover={true}
      glow={!!hasData}
    >
      {/* فقاعات متحركة */}
      <FloatingParticles count={3} />

      <CardContent className="relative p-4 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white shadow-lg animate-float">
              <Car className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 animate-slide-in-right">البيانات المركبة</h3>
              <p className="text-sm text-gray-600 animate-slide-in-right" style={{ animationDelay: '0.1s' }}>
                معلومات المركبة المختارة
              </p>
            </div>
          </div>
          
          {hasData && (
            <StatusBadge status="success" pulse={true} glow={true}>
              <CheckCircle className="h-3 w-3 mr-1" />
              مكتملة
            </StatusBadge>
          )}
        </div>

        {hasData ? (
          <div className="space-y-3">
            {/* رقم اللوحة */}
            {vehicleData.plateNumber && (
              <div className="flex items-center justify-between p-3 bg-white/80 rounded-lg border border-blue-100 shadow-sm animate-slide-in-left hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                  <span className="text-sm text-gray-600">رقم اللوحة:</span>
                </div>
                <span className="font-bold text-blue-900 text-lg font-mono bg-blue-50 px-3 py-1 rounded-md border animate-glow-pulse">
                  {vehicleData.plateNumber}
                </span>
              </div>
            )}

            {/* نوع المشروب والموديل */}
            {(vehicleData.vehicleType || vehicleData.vehicleModel) && (
              <div className="flex items-center justify-between p-3 bg-white/80 rounded-lg border border-indigo-100 shadow-sm animate-slide-in-left hover:shadow-md transition-all duration-300" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                  <span className="text-sm text-gray-600">النوع والموديل:</span>
                </div>
                <span className="font-semibold text-indigo-900">
                  {vehicleData.vehicleType} {vehicleData.vehicleModel}
                </span>
              </div>
            )}

            {/* السنة واللون */}
            {(vehicleData.year || vehicleData.color) && (
              <div className="grid grid-cols-2 gap-2 animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
                {vehicleData.year && (
                  <div className="p-2 bg-white/80 rounded-lg border border-purple-100 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                    <div className="flex items-center gap-1 mb-1">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                      <span className="text-xs text-gray-600">السنة:</span>
                    </div>
                    <span className="font-semibold text-purple-900">{vehicleData.year}</span>
                  </div>
                )}
                
                {vehicleData.color && (
                  <div className="p-2 bg-white/80 rounded-lg border border-teal-100 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                    <div className="flex items-center gap-1 mb-1">
                      <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
                      <span className="text-xs text-gray-600">اللون:</span>
                    </div>
                    <span className="font-semibold text-teal-900">{vehicleData.color}</span>
                  </div>
                )}
              </div>
            )}

            {/* زر التعديل */}
            {onEdit && (
              <Button
                onClick={onEdit}
                variant="outline"
                size="sm"
                className="w-full mt-3 border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 hover:scale-105 animate-fade-in-up"
                style={{ animationDelay: '0.3s' }}
              >
                <Edit3 className="h-4 w-4 mr-2" />
                تعديل البيانات
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center py-6 animate-fade-in">
            <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center animate-float">
              <Car className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm mb-3 animate-pulse">لم يتم تحديد مركبة بعد</p>
            {onEdit && (
              <Button
                onClick={onEdit}
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-bounce-in"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                إضافة بيانات المركبة
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </InteractiveCard>
  );
}