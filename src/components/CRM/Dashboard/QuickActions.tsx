import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Car, Target, MessageSquare, Gift, CreditCard, Stars, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface QuickAction {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  route: string;
  colorClasses: {
    icon: string;
    hover: string;
    text: string;
  };
}

const quickActions: QuickAction[] = [
  {
    title: "إدارة العملاء",
    description: "عرض وتعديل بيانات العملاء",
    icon: Users,
    route: "/crm/customers",
    colorClasses: {
      icon: "text-blue-500",
      hover: "hover:border-blue-500 hover:bg-blue-50/50",
      text: "group-hover:text-blue-600"
    }
  },
  {
    title: "إدارة المركبات",
    description: "تسجيل وتتبع المركبات",
    icon: Car,
    route: "/crm/vehicles",
    colorClasses: {
      icon: "text-green-500",
      hover: "hover:border-green-500 hover:bg-green-50/50",
      text: "group-hover:text-green-600"
    }
  },
  {
    title: "الحملات التسويقية",
    description: "إطلاق ومتابعة الحملات",
    icon: Target,
    route: "/crm/campaigns",
    colorClasses: {
      icon: "text-orange-500",
      hover: "hover:border-orange-500 hover:bg-orange-50/50",
      text: "group-hover:text-orange-600"
    }
  },
  {
    title: "تقييمات العملاء",
    description: "جمع وتحليل التقييمات",
    icon: MessageSquare,
    route: "/crm/feedback",
    colorClasses: {
      icon: "text-pink-500",
      hover: "hover:border-pink-500 hover:bg-pink-50/50",
      text: "group-hover:text-pink-600"
    }
  },
  {
    title: "إدارة الكوبونات",
    description: "إنشاء وإدارة كوبونات الخصم",
    icon: Gift,
    route: "/crm/coupons",
    colorClasses: {
      icon: "text-indigo-500",
      hover: "hover:border-indigo-500 hover:bg-indigo-50/50",
      text: "group-hover:text-indigo-600"
    }
  },
  {
    title: "إدارة الاشتراكات",
    description: "إدارة اشتراكات العملاء",
    icon: CreditCard,
    route: "/crm/subscriptions",
    colorClasses: {
      icon: "text-emerald-500",
      hover: "hover:border-emerald-500 hover:bg-emerald-50/50",
      text: "group-hover:text-emerald-600"
    }
  },
  {
    title: "إدارة نقاط الولاء",
    description: "نظام نقاط الولاء والمكافآت",
    icon: Stars,
    route: "/crm/loyalty",
    colorClasses: {
      icon: "text-yellow-500",
      hover: "hover:border-yellow-500 hover:bg-yellow-50/50",
      text: "group-hover:text-yellow-600"
    }
  },
  {
    title: "إدارة البطاقات",
    description: "بطاقات الاشتراك والهدايا",
    icon: Award,
    route: "/crm/cards",
    colorClasses: {
      icon: "text-purple-500",
      hover: "hover:border-purple-500 hover:bg-purple-50/50",
      text: "group-hover:text-purple-600"
    }
  }
];

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-gray-50/30 to-white animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          إجراءات سريعة
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button 
                key={action.title}
                variant="outline" 
                className={`justify-start h-auto p-4 hover:shadow-lg hover:scale-105 transition-all duration-300 group animate-scale-in ${action.colorClasses.hover}`}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => navigate(action.route)}
              >
                <Icon className={`w-5 h-5 mr-3 ${action.colorClasses.icon} group-hover:scale-110 transition-transform duration-200`} />
                <div className="text-right">
                  <div className={`font-medium transition-colors ${action.colorClasses.text}`}>
                    {action.title}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {action.description}
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}