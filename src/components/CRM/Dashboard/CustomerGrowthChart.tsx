import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp } from "lucide-react";

interface GrowthData {
  month: string;
  customers: number;
  progress: number;
}

const growthData: GrowthData[] = [
  { month: "يناير", customers: 2450, progress: 85 },
  { month: "فبراير", customers: 2680, progress: 92 },
  { month: "مارس", customers: 2847, progress: 100 }
];

export function CustomerGrowthChart() {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-blue-50/50 to-white border-l-4 border-l-blue-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-500 animate-pulse" />
          نمو قاعدة العملاء
        </CardTitle>
        <CardDescription>إحصائيات نمو العملاء خلال الأشهر الماضية</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {growthData.map((data, index) => (
            <div key={data.month} className="group">
              <div className="flex justify-between items-center group hover:bg-blue-50/50 p-2 rounded transition-colors">
                <span className="text-sm text-muted-foreground">{data.month}</span>
                <span className="font-medium group-hover:text-blue-600 transition-colors">
                  {data.customers.toLocaleString()} عميل
                </span>
              </div>
              <Progress 
                value={data.progress} 
                className="h-3 hover:h-4 transition-all duration-200 bg-gradient-to-r from-blue-100 to-blue-200"
                style={{ animationDelay: `${index * 200}ms` }}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}