import { BookingAnalyticsDashboard } from "@/components/Reception/BookingAnalyticsDashboard";
import { BarChart3, TrendingUp, PieChart } from "lucide-react";

export default function BookingAnalytics() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="p-6 rounded-xl border shadow-lg bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-primary animate-pulse" />
            <div>
              <h1 className="text-3xl font-bold">التحليلات والتقارير</h1>
              <p className="text-muted-foreground mt-2">
                تحليلات شاملة ومفصلة لأداء نظام البيع مع رؤى استراتيجية لاتخاذ القرارات
              </p>
            </div>
          </div>
        </div>

        {/* Analytics Dashboard Component */}
        <BookingAnalyticsDashboard />
      </div>
    </div>
  );
}