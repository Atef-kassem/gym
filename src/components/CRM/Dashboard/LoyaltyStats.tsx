import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface LoyaltyStatsProps {
  totalPoints: number;
  redeemedPoints: number;
  activeCoupons: number;
  campaigns: number;
}

const loyaltyData = [
  {
    title: "إجمالي النقاط",
    value: 245678,
    color: "blue",
    route: "/crm/loyalty"
  },
  {
    title: "النقاط المستبدلة",
    value: 45230,
    color: "green",
    route: "/crm/loyalty"
  },
  {
    title: "الكوبونات النشطة",
    value: 89,
    color: "purple",
    route: "/crm/coupons"
  },
  {
    title: "الحملات الجارية",
    value: 12,
    color: "orange",
    route: "/crm/campaigns"
  }
];

const getColorClasses = (color: string) => {
  const colorMap = {
    blue: {
      bg: "bg-gradient-to-br from-blue-50/50 to-white",
      border: "border-l-blue-500",
      text: "text-blue-800",
      valueText: "text-blue-600",
      hoverText: "group-hover:text-blue-600"
    },
    green: {
      bg: "bg-gradient-to-br from-green-50/50 to-white",
      border: "border-l-green-500",
      text: "text-green-800",
      valueText: "text-green-600",
      hoverText: "group-hover:text-green-600"
    },
    purple: {
      bg: "bg-gradient-to-br from-purple-50/50 to-white",
      border: "border-l-purple-500",
      text: "text-purple-800",
      valueText: "text-purple-600",
      hoverText: "group-hover:text-purple-600"
    },
    orange: {
      bg: "bg-gradient-to-br from-orange-50/50 to-white",
      border: "border-l-orange-500",
      text: "text-orange-800",
      valueText: "text-orange-600",
      hoverText: "group-hover:text-orange-600"
    }
  };
  return colorMap[color as keyof typeof colorMap] || colorMap.blue;
};

export function LoyaltyStats() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {loyaltyData.map((item, index) => {
        const colors = getColorClasses(item.color);
        return (
            <Card 
            key={item.title}
            className={`hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${colors.bg} border-l-4 ${colors.border} group cursor-pointer animate-scale-in`}
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => navigate(item.route)}
          >
            <CardHeader className="pb-2">
              <CardTitle className={`text-sm ${colors.text} ${colors.hoverText}`}>
                {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${colors.valueText} group-hover:scale-105 transition-transform duration-200`}>
                {item.value.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}