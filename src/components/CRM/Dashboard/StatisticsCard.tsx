import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface StatisticsCardProps {
  title: string;
  value: string | number;
  subtitle: string | ReactNode;
  icon: LucideIcon;
  iconColor: string;
  borderColor: string;
  bgGradient: string;
  onClick?: () => void;
}

export function StatisticsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor,
  borderColor,
  bgGradient,
  onClick
}: StatisticsCardProps) {
  return (
    <Card 
      className={`hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-l-4 ${borderColor} ${bgGradient} group cursor-pointer animate-scale-in`}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className={`text-sm font-medium ${iconColor.replace('text-', 'text-').replace('-500', '-800')}`}>
          {title}
        </CardTitle>
        <Icon className={`h-5 w-5 ${iconColor} group-hover:scale-110 transition-transform duration-200`} />
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${iconColor.replace('-600', '-900')} group-hover:scale-105 transition-transform duration-200`}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        <p className={`text-xs ${iconColor.replace('-600', '-700')} mt-2`}>
          {subtitle}
        </p>
      </CardContent>
    </Card>
  );
}