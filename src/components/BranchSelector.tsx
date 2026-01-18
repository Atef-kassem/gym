import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Building2, ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const branches = [
  { 
    id: "all", 
    name: "جميع الفروع", 
    cars: 2847, 
    revenue: "487,350", 
    employees: 125,
    items: 347,
    assets: 28,
    accounts: 156,
    status: "active" 
  },
  { 
    id: "riyadh", 
    name: "فرع الرياض الرئيسي", 
    cars: 1247, 
    revenue: "187,500", 
    employees: 45,
    items: 120,
    assets: 12,
    accounts: 67,
    status: "active" 
  },
  { 
    id: "jeddah", 
    name: "فرع جدة كورنيش", 
    cars: 892, 
    revenue: "134,600", 
    employees: 38,
    items: 98,
    assets: 8,
    accounts: 45,
    status: "active" 
  },
  { 
    id: "dammam", 
    name: "فرع الدمام الخليج", 
    cars: 708, 
    revenue: "165,250", 
    employees: 42,
    items: 129,
    assets: 8,
    accounts: 44,
    status: "maintenance" 
  },
];

export function BranchSelector() {
  const [selectedBranch, setSelectedBranch] = useState("all");
  const location = useLocation();
  
  // تحديد نوع الإحصائيات حسب الصفحة
  const getStatsForPage = (branch: typeof branches[0]) => {
    const path = location.pathname;
    
    if (path.includes("/inventory")) {
      return [
        { label: "الأصناف", value: branch.items.toLocaleString() },
        { label: "المعاملات", value: "24" }
      ];
    }
    
    if (path.includes("/hcm")) {
      return [
        { label: "الموظفين", value: branch.employees.toLocaleString() },
        { label: "الحضور", value: "95%" }
      ];
    }
    
    if (path.includes("/accounts") || path.includes("/financial")) {
      return [
        { label: "الحسابات", value: branch.accounts.toLocaleString() },
        { label: "الرصيد", value: "324,500 جنيه مصري" }
      ];
    }
    
    if (path.includes("/fixed-assets")) {
      return [
        { label: "الأصول", value: branch.assets.toLocaleString() },
        { label: "القيمة", value: "1,250,000 جنيه مصري" }
      ];
    }
    
    if (path.includes("/administration") || path.includes("/quality")) {
      return [
        { label: "المستندات", value: "156" },
        { label: "المهام", value: "23" }
      ];
    }
    
    // الصفحات المتعلقة بالخدمات (POS, CRM, Reception, etc.)
    return [
      { label: " الكافية المخدومة", value: branch.cars.toLocaleString() },
      { label: "الإيرادات", value: `${branch.revenue} جنيه` }
    ];
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">اختيار الفرع</h3>
        </div>
        <Select value={selectedBranch} onValueChange={setSelectedBranch}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="اختر الفرع" />
          </SelectTrigger>
          <SelectContent>
            {branches.map((branch) => (
              <SelectItem key={branch.id} value={branch.id}>
                {branch.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {branches.map((branch) => {
          const stats = getStatsForPage(branch);
          return (
            <Card 
              key={branch.id} 
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedBranch === branch.id ? "ring-2 ring-primary bg-primary/5" : ""
              }`}
              onClick={() => setSelectedBranch(branch.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-sm">{branch.name}</h4>
                  <Badge 
                    variant={branch.status === "active" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {branch.status === "active" ? "نشط" : "صيانة"}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {stats.map((stat, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{stat.label}</span>
                      <span className="font-medium">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}