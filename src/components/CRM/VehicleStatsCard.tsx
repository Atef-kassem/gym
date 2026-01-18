import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface VehicleStatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color: string;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function VehicleStatsCard({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  subtitle, 
  trend 
}: VehicleStatsCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-500 border-0 bg-gradient-to-br from-background to-muted/30 hover:scale-105 animate-fade-in group cursor-pointer">
      <CardContent className="p-6 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-blue-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="flex items-center justify-between relative z-10">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground transition-colors duration-300 group-hover:text-blue-600">{title}</p>
            <div className="flex items-end gap-2">
              <p className={`text-3xl font-bold transition-all duration-300 group-hover:scale-110 ${color}`}>{value}</p>
              {trend && (
                <span className={`text-xs font-medium transition-all duration-300 animate-bounce ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {trend.isPositive ? '+' : ''}{trend.value}%
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-muted-foreground transition-colors duration-300 group-hover:text-blue-500">{subtitle}</p>
            )}
          </div>
          <div className={`p-3 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 bg-blue-100 ${color}`}>
            <Icon className="h-6 w-6 transition-transform duration-300 group-hover:scale-125" />
          </div>
        </div>
        
        {/* شعاع ضوئي متحرك */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-full h-0.5 bg-gradient-to-l from-transparent via-purple-400 to-transparent animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        </div>
      </CardContent>
    </Card>
  );
}