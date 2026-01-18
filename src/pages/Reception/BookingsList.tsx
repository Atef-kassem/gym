import { useState } from "react";
import { AdvancedBookingManagement } from "@/components/Reception/AdvancedBookingManagement";
import { QuickSalesList } from "@/components/Reception/QuickSalesList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { List, Search, Filter, Calendar, Activity, BarChart3, ShoppingCart, Zap } from "lucide-react";

export default function BookingsList() {
  const [activeTab, setActiveTab] = useState("bookings");

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="p-6 rounded-xl border shadow-lg bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-full">
              <List className="h-6 w-6 text-primary" />
              <Activity className="h-5 w-5 text-primary/70" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                إدارة البيع والمبيعات
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">
                نظام شامل لإدارة البيع والمبيعات السريعة مع إمكانيات البحث والتصفية المتقدمة
              </p>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>عرض تقويمي</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ShoppingCart className="h-4 w-4" />
                  <span>بيع سريع</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BarChart3 className="h-4 w-4" />
                  <span>تحليلات مفصلة</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Activity className="h-4 w-4" />
                  <span>متابعة مباشرة</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-12">
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              البيع
            </TabsTrigger>
            <TabsTrigger value="quick-sales" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              البيع السريع
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="mt-6">
            <AdvancedBookingManagement />
          </TabsContent>

          <TabsContent value="quick-sales" className="mt-6">
            <QuickSalesList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}