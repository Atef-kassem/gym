import { useState } from "react";
import {
  Calendar,
  BarChart3,
  PieChart,
  Home,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell } from 'recharts';
import { Pie } from 'recharts';
import { format } from "date-fns";
import { ar } from "date-fns/locale";

export default function Dashboard() {
  console.log("🎯 Dashboard component is loading...");
  // تعيين التاريخ والوقت الحالي
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59);
  
  const [startDateTime, setStartDateTime] = useState<string>(
    startOfDay.toISOString().slice(0, 16)
  );
  const [endDateTime, setEndDateTime] = useState<string>(
    endOfDay.toISOString().slice(0, 16)
  );

  // بيانات الأداء اليومي للفروع
  const dailyData = [
    { name: 'السبت', cars: 245, revenue: 32000, branches: 11 },
    { name: 'الأحد', cars: 298, revenue: 41500, branches: 12 },
    { name: 'الاثنين', cars: 367, revenue: 48300, branches: 12 },
    { name: 'الثلاثاء', cars: 421, revenue: 55200, branches: 12 },
    { name: 'الأربعاء', cars: 312, revenue: 39800, branches: 11 },
    { name: 'الخميس', cars: 389, revenue: 50100, branches: 12 },
    { name: 'الجمعة', cars: 334, revenue: 43700, branches: 12 },
  ];

  // بيانات الرسم البياني العمودي
  const serviceData = [
    { name: 'ال  الخارجي', value: 120 },
    { name: 'ال  الداخلي', value: 80 },
    { name: 'التلميع', value: 60 },
    { name: 'تغيير الزيت', value: 40 },
  ];

  // بيانات الرسم البياني الدائري  
  const branchData = [
    { name: 'فرع الرياض', value: 40, color: '#3b82f6' },
    { name: 'فرع جدة', value: 30, color: '#06b6d4' },
    { name: 'فرع الدمام', value: 20, color: '#8b5cf6' },
    { name: 'فرع الخبر', value: 10, color: '#f59e0b' },
  ];

  // بيانات الأداء التفصيلي للفروع
  const detailedStats = [
    {
      branch: 'فرع الرياض الرئيسي',
      cars: 1247,
      revenue: 187500,
      satisfaction: 4.9,
      efficiency: 94,
      staff: 24
    },
    {
      branch: 'فرع جدة كورنيش', 
      cars: 892,
      revenue: 134600,
      satisfaction: 4.7,
      efficiency: 89,
      staff: 18
    },
    {
      branch: 'فرع الدمام الخليج',
      cars: 708,
      revenue: 165250,
      satisfaction: 4.8,
      efficiency: 91,
      staff: 16
    },
    {
      branch: 'فرع الخبر المدينة',
      cars: 623,
      revenue: 98750,
      satisfaction: 4.6,
      efficiency: 87,
      staff: 14
    }
  ];

  return (
    <div className="space-y-6">
      {/* Enhanced Tabs with Advanced Visual Effects */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-background/80 via-muted/60 to-background/80 backdrop-blur-md shadow-elegant border border-border/40 rounded-2xl p-2 gap-1 overflow-hidden">
          <TabsTrigger 
            value="overview" 
            className="group relative flex items-center gap-2 text-sm px-3 py-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-glow transition-all duration-500 hover:scale-105 data-[state=active]:scale-105 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 group-data-[state=active]:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-data-[state=active]:translate-x-full transition-transform duration-1000"></div>
            <div className="absolute top-1 right-1 w-1 h-1 bg-blue-400/60 rounded-full opacity-0 group-data-[state=active]:opacity-100 group-data-[state=active]:animate-ping"></div>
            <Home className="w-4 h-4 relative z-10 group-data-[state=active]:animate-pulse" />
            <span className="relative z-10">نظرة عامة</span>
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 scale-x-0 group-data-[state=active]:scale-x-100 transition-transform duration-500 origin-center"></div>
          </TabsTrigger>
          <TabsTrigger 
            value="analytics" 
            className="group relative flex items-center gap-2 text-sm px-3 py-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-glow transition-all duration-500 hover:scale-105 data-[state=active]:scale-105 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 group-data-[state=active]:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-data-[state=active]:translate-x-full transition-transform duration-1000"></div>
            <div className="absolute top-1 right-1 w-1 h-1 bg-green-400/60 rounded-full opacity-0 group-data-[state=active]:opacity-100 group-data-[state=active]:animate-ping"></div>
            <BarChart3 className="w-4 h-4 relative z-10 group-data-[state=active]:animate-pulse" />
            <span className="relative z-10">التحليلات</span>
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 scale-x-0 group-data-[state=active]:scale-x-100 transition-transform duration-500 origin-center"></div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* نظرة عامة - الرسوم البيانية */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* المبيعات حسب الفترة */}
            <Card className="group shadow-card hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-primary/5 border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <PieChart className="w-4 h-4 text-primary" />
                  </div>
                  المبيعات حسب أوقات الذروة
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  {startDateTime && endDateTime 
                    ? `من ${format(new Date(startDateTime), 'dd/MM/yyyy HH:mm', { locale: ar })} إلى ${format(new Date(endDateTime), 'dd/MM/yyyy HH:mm', { locale: ar })}`
                    : "يرجى تحديد الفترة الزمنية لعرض توزيع أوقات الذروة"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {startDateTime && endDateTime ? (
                  <div className="h-48 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={[
                            { name: 'أوقات الذروة', value: 65, color: '#ef4444' },
                            { name: 'أوقات عادية', value: 35, color: '#22c55e' }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={30}
                          outerRadius={70}
                          dataKey="value"
                        >
                          {[
                            { name: 'أوقات الذروة', value: 65, color: '#ef4444' },
                            { name: 'أوقات عادية', value: 35, color: '#22c55e' }
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [`${value}%`, 'النسبة']}
                          labelFormatter={(label) => label}
                        />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-48 flex flex-col items-center justify-center text-muted-foreground">
                    <Calendar className="h-16 w-16 mb-4 opacity-50" />
                    <p className="text-sm text-center">
                      يرجى تحديد التاريخ والوقت في الأعلى<br />
                      لعرض توزيع المبيعات حسب أوقات الذروة
                    </p>
                  </div>
                )}
                {startDateTime && endDateTime && (
                  <>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="flex-1">
                          <span className="text-sm font-medium text-red-700 dark:text-red-300">أوقات الذروة</span>
                          <p className="text-xs text-red-600 dark:text-red-400">65% - 8,087 جنيه</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <div className="flex-1">
                          <span className="text-sm font-medium text-green-700 dark:text-green-300">أوقات عادية</span>
                          <p className="text-xs text-green-600 dark:text-green-400">35% - 4,363 جنيه</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 p-3 bg-background/50 rounded-lg border">
                      <div className="text-center">
                        <span className="text-sm font-medium text-muted-foreground">إجمالي المبيعات للفترة</span>
                        <p className="text-xl font-bold text-primary mt-1">12,450 جنيه</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          أوقات الذروة: 10:00-14:00 و 18:00-22:00
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* المبيعات الشهرية */}
            <Card className="group shadow-card hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-secondary-blue/5 border-l-4 border-l-secondary-blue">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-secondary-blue/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <PieChart className="w-4 h-4 text-secondary-blue" />
                  </div>
                  المبيعات الشهرية
                </CardTitle>
                <CardDescription className="text-center text-sm font-bold text-primary">
                  Jul : 94794.14
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={[
                          { name: 'أبريل', value: 30, color: '#3b82f6' },
                          { name: 'يونيو', value: 35, color: '#10b981' },
                          { name: 'مايو', value: 35, color: '#8b5cf6' }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={70}
                        dataKey="value"
                      >
                        {[
                          { name: 'أبريل', value: 30, color: '#3b82f6' },
                          { name: 'يونيو', value: 35, color: '#10b981' },
                          { name: 'مايو', value: 35, color: '#8b5cf6' }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 grid grid-cols-1 gap-1">
                  {[
                    { name: 'أبريل', color: '#3b82f6' },
                    { name: 'يونيو', color: '#10b981' },
                    { name: 'مايو', color: '#8b5cf6' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-1 text-xs">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* المبيعات حسب الفرع */}
            <Card className="group shadow-card hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-success/5 border-l-4 border-l-success">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <BarChart3 className="w-4 h-4 text-success" />
                  </div>
                  المبيعات حسب الفرع
                </CardTitle>
                <CardDescription className="text-center text-sm font-bold text-success">
                  0.00
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-center justify-center">
                  <div className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: 'فرع الرياض', value: 1250000, color: '#3b82f6' },
                          { name: 'فرع جدة', value: 950000, color: '#10b981' },
                          { name: 'فرع الدمام', value: 750000, color: '#8b5cf6' },
                          { name: 'فرع الخبر', value: 450000, color: '#f59e0b' },
                          { name: 'فرع مكة', value: 650000, color: '#ef4444' }
                        ]}
                        margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={60} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip 
                          formatter={(value) => [`${Number(value).toLocaleString()} جنيه`, 'المبيعات']}
                          labelStyle={{ textAlign: 'right' }}
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                            fontSize: '12px'
                          }}
                        />
                        <Bar 
                          dataKey="value" 
                          fill="#10b981"
                          radius={[2, 2, 0, 0]}
                          className="hover:opacity-80 transition-opacity duration-200"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-1">
                  {[
                    { name: 'فرع الرياض', amount: '1.25M', color: '#3b82f6' },
                    { name: 'فرع جدة', amount: '950K', color: '#10b981' },
                    { name: 'فرع الدمام', amount: '750K', color: '#8b5cf6' },
                    { name: 'فرع الخبر', amount: '450K', color: '#f59e0b' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-xs p-1 rounded bg-muted/30">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-muted-foreground text-[10px]">{item.name}</span>
                      </div>
                      <span className="font-medium text-[10px]">{item.amount}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* التحليلات */}
        <TabsContent value="analytics" className="space-y-6">
          {/* Charts Section - المبيعات فقط */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* المبيعات اليومية */}
            <Card className="group shadow-card hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-primary/5 border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <BarChart3 className="w-4 h-4 text-primary" />
                  </div>
                  المبيعات اليومية
                </CardTitle>
                <CardDescription>إيرادات المبيعات الأسبوعية</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dailyData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="name" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip 
                        formatter={(value) => [`${Number(value).toLocaleString()} جنيه`, 'الإيرادات']}
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={3}
                        dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* المبيعات حسب الخدمة */}
            <Card className="group shadow-card hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-secondary-blue/5 border-l-4 border-l-secondary-blue">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-secondary-blue/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <BarChart3 className="w-4 h-4 text-secondary-blue" />
                  </div>
                  المبيعات حسب الخدمة
                </CardTitle>
                <CardDescription>توزيع المبيعات حسب أنواع الخدمات</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={serviceData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="name" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip 
                        formatter={(value) => [`${Number(value).toLocaleString()} جنيه`, 'المبيعات']}
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                      />
                      <Bar 
                        dataKey="value" 
                        fill="hsl(var(--secondary-blue))" 
                        radius={[4, 4, 0, 0]}
                        className="hover:opacity-80 transition-opacity duration-200"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Statistics Table and Pie Chart */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Statistics Table - المبيعات فقط */}
            <Card className="shadow-card lg:col-span-2">
              <CardHeader>
                <CardTitle>المبيعات حسب الفروع</CardTitle>
                <CardDescription>إحصائيات مبيعات مفصلة حسب الفروع</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-right py-2">الفرع</th>
                        <th className="text-right py-2">الإيرادات</th>
                        <th className="text-right py-2">عدد  الكافية</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailedStats.map((row, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="py-3 font-medium">{row.branch}</td>
                          <td className="py-3 font-semibold text-primary">{row.revenue.toLocaleString()} جنيه</td>
                          <td className="py-3">{row.cars.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Pie Chart - توزيع المبيعات حسب الفرع */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-primary" />
                  توزيع المبيعات
                </CardTitle>
                <CardDescription>توزيع المبيعات حسب الفروع</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={branchData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={100}
                        dataKey="value"
                      >
                        {branchData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'نسبة المبيعات']}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {branchData.map((item, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span>{item.name}</span>
                        <span className="mr-auto font-semibold">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
