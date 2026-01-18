import { useState } from "react";
import { Car, Wrench, Droplets, Sparkles, Clock, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const servicePaths = [
  {
    id: 1,
    name: "مسار ال  الخارجي",
    icon: Droplets,
    capacity: 4,
    occupied: 3,
    status: "busy",
    services: [
      { car: "أ ب ج 1234", service: "  خارجي", time: "15 دقيقة", status: "progress" },
      { car: "ه و ز 5678", service: "  خارجي", time: "10 دقائق", status: "progress" },
      { car: "ح ط ي 9012", service: "  خارجي", time: "5 دقائق", status: "finishing" },
      { car: "", service: "", time: "", status: "available" },
    ]
  },
  {
    id: 2,
    name: "مسار ال  الداخلي",
    icon: Sparkles,
    capacity: 3,
    occupied: 2,
    status: "normal",
    services: [
      { car: "ك ل م 3456", service: "  داخلي", time: "25 دقيقة", status: "progress" },
      { car: "ن س ع 7890", service: "تنظيف شامل", time: "40 دقيقة", status: "progress" },
      { car: "", service: "", time: "", status: "available" },
    ]
  },
  {
    id: 3,
    name: "مسار تغيير الزيت",
    icon: Wrench,
    capacity: 2,
    occupied: 1,
    status: "low",
    services: [
      { car: "ف ص ق 1122", service: "تغيير زيت", time: "20 دقيقة", status: "progress" },
      { car: "", service: "", time: "", status: "available" },
    ]
  },
  {
    id: 4,
    name: "مسار التلميع والحماية",
    icon: Car,
    capacity: 2,
    occupied: 2,
    status: "full",
    services: [
      { car: "ر ش ت 3344", service: "تلميع وحماية", time: "60 دقيقة", status: "progress" },
      { car: "ث خ ذ 5566", service: "تلميع", time: "45 دقيقة", status: "progress" },
    ]
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "available": return "bg-muted";
    case "progress": return "bg-warning";
    case "finishing": return "bg-success";
    default: return "bg-muted";
  }
};

const getPathStatusColor = (status: string) => {
  switch (status) {
    case "low": return "default";
    case "normal": return "secondary";
    case "busy": return "outline";
    case "full": return "destructive";
    default: return "secondary";
  }
};

export function ServicePathsStatus() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Car className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-bold">حالة المسارات</h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {servicePaths.map((path) => (
          <Card key={path.id} className="shadow-card hover-lift">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <path.icon className="w-5 h-5 text-primary" />
                  {path.name}
                </CardTitle>
                <Badge variant={getPathStatusColor(path.status)}>
                  {path.occupied}/{path.capacity}
                </Badge>
              </div>
              <Progress 
                value={(path.occupied / path.capacity) * 100} 
                className="h-2"
              />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {path.services.map((service, index) => (
                  <div 
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all duration-200 ${
                      service.status === "available" 
                        ? "border-dashed border-muted bg-muted/20" 
                        : "border-solid border-border bg-card"
                    }`}
                  >
                    {service.status === "available" ? (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <div className="w-2 h-2 rounded-full bg-success"></div>
                        <span className="text-sm">متاح</span>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(service.status)}`}></div>
                          <div>
                            <p className="font-medium text-sm">{service.car}</p>
                            <p className="text-xs text-muted-foreground">{service.service}</p>
                          </div>
                        </div>
                        <div className="text-left">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{service.time}</span>
                          </div>
                          {service.status === "finishing" && (
                            <CheckCircle className="w-4 h-4 text-success mt-1" />
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}