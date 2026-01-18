import { AlertTriangle, Clock, Wrench, Package, Car, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const alerts = [
  {
    id: 1,
    type: "delay",
    priority: "high",
    title: "تأخير في المسار 1",
    description: "المشروب أ ب ج 1234 تنتظر منذ 25 دقيقة",
    time: "منذ 5 دقائق",
    icon: Clock,
    action: "متابعة"
  },
  {
    id: 2,
    type: "maintenance",
    priority: "medium",
    title: "صيانة مطلوبة",
    description: "جهاز   المسار 3 يحتاج فحص فوري",
    time: "منذ 10 دقائق",
    icon: Wrench,
    action: "فحص"
  },
  {
    id: 3,
    type: "inventory",
    priority: "medium",
    title: "نقص في المخزون",
    description: "شامبو  الكافية أقل من الحد الأدنى",
    time: "منذ 15 دقيقة",
    icon: Package,
    action: "طلب"
  },
  {
    id: 4,
    type: "queue",
    priority: "low",
    title: "ازدحام في الانتظار",
    description: "8 سيارات في طابور فرع العليا",
    time: "منذ 20 دقيقة",
    icon: Car,
    action: "عرض"
  }
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high": return "destructive";
    case "medium": return "secondary";
    case "low": return "outline";
    default: return "secondary";
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "delay": return "text-destructive";
    case "maintenance": return "text-warning";
    case "inventory": return "text-secondary-blue";
    case "queue": return "text-primary";
    default: return "text-muted-foreground";
  }
};

export function ActiveAlerts() {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            التنبيهات النشطة
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {alerts.length} تنبيه
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div 
              key={alert.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-all duration-200"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className={`w-10 h-10 rounded-full bg-muted flex items-center justify-center ${getTypeColor(alert.type)}`}>
                  <alert.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">{alert.title}</h4>
                    <Badge variant={getPriorityColor(alert.priority)} className="text-xs">
                      {alert.priority === "high" ? "عاجل" : alert.priority === "medium" ? "متوسط" : "منخفض"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{alert.description}</p>
                  <p className="text-xs text-muted-foreground">{alert.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="text-xs">
                  {alert.action}
                </Button>
                <Button size="sm" variant="ghost" className="w-6 h-6 p-0">
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}