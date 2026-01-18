import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, CreditCard, Clock, Star, Download, Plus, RefreshCw, FileText, Building2, GitBranch, BarChart3, ArrowLeftRight, Bot } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { BranchSelector } from "@/components/BranchSelector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import POSMain from "@/components/POS/POSMain";

// بيانات الفروع
const branchesData = {
  all: {
    name: "جميع الفروع",
    salesStats: [
      { title: "إجمالي المبيعات اليوم", value: "45,320", unit: "جنيه مصري", change: "+12.5%", trend: "up", icon: DollarSign },
      { title: "عدد الطلبات", value: "156", unit: "طلب", change: "+8.2%", trend: "up", icon: ShoppingCart },
      { title: "العملاء الجدد", value: "23", unit: "عميل", change: "-3.1%", trend: "down", icon: Users },
      { title: "متوسط قيمة الطلب", value: "290", unit: "جنيه مصري", change: "+15.3%", trend: "up", icon: CreditCard }
    ]
  },
  alolaya: {
    name: "فرع العليا",
    salesStats: [
      { title: "إجمالي المبيعات اليوم", value: "28,200", unit: "جنيه مصري", change: "+15.2%", trend: "up", icon: DollarSign },
      { title: "عدد الطلبات", value: "89", unit: "طلب", change: "+12.8%", trend: "up", icon: ShoppingCart },
      { title: "العملاء الجدد", value: "15", unit: "عميل", change: "+5.2%", trend: "up", icon: Users },
      { title: "متوسط قيمة الطلب", value: "317", unit: "جنيه مصري", change: "+18.3%", trend: "up", icon: CreditCard }
    ]
  },
  alshifa: {
    name: "فرع الشفا",
    salesStats: [
      { title: "إجمالي المبيعات اليوم", value: "12,420", unit: "جنيه مصري", change: "+8.7%", trend: "up", icon: DollarSign },
      { title: "عدد الطلبات", value: "42", unit: "طلب", change: "+3.2%", trend: "up", icon: ShoppingCart },
      { title: "العملاء الجدد", value: "6", unit: "عميل", change: "-1.5%", trend: "down", icon: Users },
      { title: "متوسط قيمة الطلب", value: "296", unit: "جنيه مصري", change: "+12.1%", trend: "up", icon: CreditCard }
    ]
  },
  alqaseem: {
    name: "فرع القصيم",
    salesStats: [
      { title: "إجمالي المبيعات اليوم", value: "4,700", unit: "جنيه مصري", change: "+5.1%", trend: "up", icon: DollarSign },
      { title: "عدد الطلبات", value: "25", unit: "طلب", change: "+2.8%", trend: "up", icon: ShoppingCart },
      { title: "العملاء الجدد", value: "2", unit: "عميل", change: "0%", trend: "up", icon: Users },
      { title: "متوسط قيمة الطلب", value: "188", unit: "جنيه مصري", change: "+8.5%", trend: "up", icon: CreditCard }
    ]
  }
};

// بيانات المقارنة بين الفروع
const branchComparisonData = [
  { branch: "العليا", sales: 28200, orders: 89, customers: 15 },
  { branch: "الشفا", sales: 12420, orders: 42, customers: 6 },
  { branch: "القصيم", sales: 4700, orders: 25, customers: 2 }
];

const recentTransactions = [
  { id: "TXN001", customer: "أحمد محمد", service: "  كامل + تلميع", amount: 250, time: "منذ 5 دقائق", status: "مكتمل" },
  { id: "TXN002", customer: "سارة أحمد", service: "  خارجي", amount: 80, time: "منذ 12 دقيقة", status: "مكتمل" },
  { id: "TXN003", customer: "محمد علي", service: "  + شمع", amount: 180, time: "منذ 18 دقيقة", status: "معلق" },
  { id: "TXN004", customer: "فاطمة سالم", service: "تنظيف داخلي", amount: 120, time: "منذ 25 دقيقة", status: "مكتمل" },
  { id: "TXN005", customer: "خالد عبدالله", service: "  كامل", amount: 150, time: "منذ 30 دقيقة", status: "مكتمل" }
];

const dailySalesData = [
  { time: "09:00", sales: 1200 },
  { time: "10:00", sales: 1800 },
  { time: "11:00", sales: 2400 },
  { time: "12:00", sales: 3200 },
  { time: "13:00", sales: 4100 },
  { time: "14:00", sales: 3800 },
  { time: "15:00", sales: 4600 },
  { time: "16:00", sales: 5200 },
  { time: "17:00", sales: 4800 },
  { time: "18:00", sales: 3600 }
];

const serviceTypeData = [
  { name: "  كامل", value: 40, color: "hsl(var(--primary))" },
  { name: "  خارجي", value: 25, color: "hsl(var(--secondary))" },
  { name: "تلميع", value: 20, color: "hsl(var(--accent))" },
  { name: "تنظيف داخلي", value: 15, color: "hsl(var(--muted))" }
];

const weeklyPerformance = [
  { day: "السبت", orders: 120, revenue: 15600 },
  { day: "الأحد", orders: 98, revenue: 12800 },
  { day: "الاثنين", orders: 156, revenue: 20400 },
  { day: "الثلاثاء", orders: 142, revenue: 18500 },
  { day: "الأربعاء", orders: 178, revenue: 23200 },
  { day: "الخميس", orders: 165, revenue: 21500 },
  { day: "الجمعة", orders: 134, revenue: 17400 }
];

const topServices = [
  { name: "  كامل + تلميع", orders: 45, revenue: 11250, rating: 4.8 },
  { name: "  خارجي", orders: 38, revenue: 3040, rating: 4.6 },
  { name: "تنظيف داخلي فاخر", orders: 28, revenue: 8400, rating: 4.9 },
  { name: "شمع + حماية", orders: 22, revenue: 6600, rating: 4.7 },
  { name: "  سريع", orders: 35, revenue: 1750, rating: 4.5 }
];

export default function POSDashboard() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [activeTab, setActiveTab] = useState("overview");
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [isAssistantMinimized, setIsAssistantMinimized] = useState(false);

  // الحصول على بيانات الفرع المحدد
  const getCurrentBranchData = () => {
    return branchesData[selectedBranch as keyof typeof branchesData] || branchesData.all;
  };

  const handleSendMessage = (message: string) => {
    setShowAIAssistant(true);
    setIsAssistantMinimized(false);
    // The AIAssistant component will handle the message
  };

  const handleExportReport = () => {
    toast({
      title: "تصدير التقرير",
      description: "جاري تحضير وتصدير التقرير اليومي...",
    });
  };

  const handleAddNewOrder = () => {
    navigate('/pos');
    toast({
      title: "انتقال إلى نظام البيع",
      description: "تم الانتقال إلى شاشة إضافة طلب جديد",
    });
  };

  const handleRefreshData = () => {
    setIsRefreshing(true);
    toast({
      title: "تحديث البيانات",
      description: "جاري تحديث البيانات الحالية...",
    });
    
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "تم التحديث بنجاح",
        description: "تم تحديث جميع البيانات والإحصائيات",
      });
    }, 1500);
  };

  const handleViewTransaction = (transactionId: string) => {
    toast({
      title: "عرض تفاصيل المعاملة",
      description: `عرض تفاصيل المعاملة رقم: ${transactionId}`,
    });
  };

  const handleViewServiceDetails = (serviceName: string) => {
    toast({
      title: "تفاصيل الخدمة",
      description: `عرض تفاصيل خدمة: ${serviceName}`,
    });
  };

  const currentBranchData = getCurrentBranchData();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between p-6 rounded-xl border shadow-lg bg-card hover-scale transition-all duration-500 hover:shadow-2xl hover:border-primary/30 group">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold flex items-center gap-3 group-hover:text-primary transition-colors duration-300">
            <Building2 className="h-8 w-8 text-primary animate-pulse group-hover:scale-110 transition-transform duration-300" />
            لوحة تحكم نقاط البيع - {currentBranchData.name}
          </h1>
          <p className="text-muted-foreground group-hover:text-primary/70 transition-colors duration-300">
            إحصائيات وتقاريج.مريعة لعمليات نقاط البيع
          </p>
        </div>
        <div className="flex gap-3 z-10">
          <Button 
            variant="outline" 
            onClick={handleRefreshData}
            disabled={isRefreshing}
            className="group/btn hover:scale-105 transition-all duration-300 hover:shadow-lg hover:border-primary/50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 transition-transform duration-300 ${isRefreshing ? 'animate-spin' : 'group-hover/btn:rotate-180'}`} />
            <span className="group-hover/btn:text-primary transition-colors duration-300">
              {isRefreshing ? "جاري التحديث..." : "تحديث البيانات"}
            </span>
          </Button>
          <Button 
            variant="outline" 
            onClick={handleExportReport}
            className="group/btn hover:scale-105 transition-all duration-300 hover:shadow-lg hover:border-secondary/50"
          >
            <Download className="h-4 w-4 mr-2 group-hover/btn:animate-bounce transition-transform duration-300" />
            <span className="group-hover/btn:text-secondary transition-colors duration-300">تصدير التقرير</span>
          </Button>
          <Button 
            onClick={handleAddNewOrder}
            className="group/btn hover:scale-105 transition-all duration-300 hover:shadow-lg relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 group-hover/btn:scale-110 transition-transform duration-300" />
            <Plus className="h-4 w-4 mr-2 relative z-10 group-hover/btn:rotate-90 transition-transform duration-300" />
            <span className="relative z-10">إضافة طلب جديد</span>
          </Button>
          <Button 
            onClick={() => setShowAIAssistant(true)}
            variant="outline"
            className="group/btn hover:scale-105 transition-all duration-300 hover:shadow-lg hover:border-accent/50 bg-gradient-to-r from-accent/10 to-accent/5"
          >
            <Bot className="h-4 w-4 mr-2 group-hover/btn:animate-pulse transition-transform duration-300" />
            <span className="group-hover/btn:text-accent transition-colors duration-300">المساعد الذكي</span>
          </Button>
        </div>
      </div>


      {/* Tabs للتنقل بين الأقسام المختلفة */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full animate-scale-in">
        <TabsList className="grid w-full grid-cols-6 lg:grid-cols-6 bg-gradient-to-r from-muted to-muted/80 p-1 rounded-xl shadow-lg">
          <TabsTrigger 
            value="overview" 
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 hover:scale-105 data-[state=active]:shadow-lg"
          >
            <BarChart3 className="h-4 w-4 transition-transform duration-300 data-[state=active]:animate-pulse" />
            نظرة عامة
          </TabsTrigger>
          <TabsTrigger 
            value="branches" 
            className="flex items-center gap-2 data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground transition-all duration-300 hover:scale-105 data-[state=active]:shadow-lg"
          >
            <Building2 className="h-4 w-4 transition-transform duration-300 data-[state=active]:animate-pulse" />
            إدارة الفروع
          </TabsTrigger>
          <TabsTrigger 
            value="comparison" 
            className="flex items-center gap-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground transition-all duration-300 hover:scale-105 data-[state=active]:shadow-lg"
          >
            <ArrowLeftRight className="h-4 w-4 transition-transform duration-300 data-[state=active]:animate-pulse" />
            مقارنة الفروع
          </TabsTrigger>
          <TabsTrigger 
            value="analytics" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-primary-foreground transition-all duration-300 hover:scale-105 data-[state=active]:shadow-lg"
          >
            <GitBranch className="h-4 w-4 transition-transform duration-300 data-[state=active]:animate-pulse" />
            تحليلات متقدمة
          </TabsTrigger>
          <TabsTrigger 
            value="pos" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white transition-all duration-300 hover:scale-105 data-[state=active]:shadow-lg"
          >
            <Monitor className="h-4 w-4 transition-transform duration-300 data-[state=active]:animate-pulse" />
            إدارة POS
          </TabsTrigger>
          <TabsTrigger 
            value="ai-assistant" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-accent data-[state=active]:to-accent/80 data-[state=active]:text-accent-foreground transition-all duration-300 hover:scale-105 data-[state=active]:shadow-lg"
          >
            <Bot className="h-4 w-4 transition-transform duration-300 data-[state=active]:animate-pulse" />
            المساعد الذكي
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 animate-fade-in">
          {/* Statistics Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {currentBranchData.salesStats.map((stat, index) => (
              <Card 
                key={stat.title} 
                className="group relative overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl border-2 hover:border-primary/30 cursor-pointer animate-fade-in hover-scale"
                style={{ animationDelay: `${index * 150}ms` }}
                onClick={() => toast({
                  title: "تفاصيل الإحصائية",
                  description: `عرض تفاصيل ${stat.title}`,
                })}
              >
                {/* Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-all duration-700" />
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                  <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors duration-300">{stat.title}</CardTitle>
                  <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 group-hover:shadow-lg">
                    <stat.icon className="h-5 w-5 text-primary group-hover:text-primary transition-all duration-300 group-hover:scale-110" />
                  </div>
                </CardHeader>
                
                <CardContent className="relative z-10">
                  <div className="text-3xl font-bold group-hover:scale-105 transition-transform duration-300 bg-gradient-to-r from-foreground to-primary bg-clip-text">
                    {stat.value} <span className="text-lg opacity-80">{stat.unit}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-3">
                    <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full backdrop-blur-sm transition-all duration-300 ${
                      stat.trend === "up" 
                        ? "bg-green-500/10 group-hover:bg-green-500/20 border border-green-500/20" 
                        : "bg-red-500/10 group-hover:bg-red-500/20 border border-red-500/20"
                    }`}>
                      {stat.trend === "up" ? (
                        <TrendingUp className="h-3 w-3 text-green-500 group-hover:animate-bounce" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-500 group-hover:animate-bounce" />
                      )}
                      <span className={`font-semibold transition-colors duration-300 ${
                        stat.trend === "up" ? "text-green-600 group-hover:text-green-500" : "text-red-600 group-hover:text-red-500"
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                    <span className="group-hover:text-foreground transition-colors duration-300">من البارحة</span>
                  </div>
                  
                  {/* Animated Progress Indicator */}
                  <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden relative">
                    <div 
                      className={`h-full transition-all duration-1000 rounded-full ${
                        stat.trend === "up" 
                          ? "bg-gradient-to-r from-green-400 to-green-600" 
                          : "bg-gradient-to-r from-red-400 to-red-600"
                      } transform origin-left group-hover:animate-pulse`}
                      style={{ 
                        width: stat.trend === "up" ? "75%" : "40%",
                        animationDelay: `${index * 100}ms`
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-slide-in-right transition-opacity duration-500" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid gap-6 md:grid-cols-2 animate-fade-in" style={{ animationDelay: "600ms" }}>
            {/* Daily Sales Chart */}
            <Card className="group overflow-hidden transition-all duration-700 hover:shadow-2xl border-2 hover:border-primary/20 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-700" />
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-2 transition-colors group-hover:text-primary">
                  <div className="w-3 h-3 bg-primary rounded-full animate-pulse group-hover:scale-125 transition-transform duration-300" />
                  <span className="story-link">مبيعات اليوم بالساعة</span>
                </CardTitle>
                <CardDescription className="transition-colors group-hover:text-primary/70">
                  تتبع المبيعات على مدار اليوم مع التحديث المباشر
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="h-[250px] transition-transform group-hover:scale-[1.02] duration-500">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dailySalesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="sales" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={3}
                        dot={{ fill: "hsl(var(--primary))", r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Service Types Distribution */}
            <Card className="group overflow-hidden transition-all duration-700 hover:shadow-2xl border-2 hover:border-secondary/20 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-secondary/10 rounded-full translate-y-8 -translate-x-8 group-hover:scale-150 transition-transform duration-700" />
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-2 transition-colors group-hover:text-secondary">
                  <div className="w-3 h-3 bg-secondary rounded-full animate-pulse group-hover:scale-125 transition-transform duration-300" />
                  <span className="story-link">توزيع أنواع الخدمات</span>
                </CardTitle>
                <CardDescription className="transition-colors group-hover:text-secondary/70">
                  نسبة الطلبات حسب نوع الخدمة مع الإحصائيات التفاعلية
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="h-[250px] transition-transform group-hover:scale-[1.02] duration-500">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={serviceTypeData}
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {serviceTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions & Top Services */}
          <div className="grid gap-6 md:grid-cols-2 animate-fade-in" style={{ animationDelay: "900ms" }}>
            <Card className="group overflow-hidden transition-all duration-700 hover:shadow-2xl border-2 hover:border-primary/20 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent rounded-full -translate-y-12 -translate-x-12 group-hover:scale-150 transition-transform duration-700" />
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-2 transition-colors group-hover:text-primary">
                  <Clock className="h-5 w-5 transition-transform group-hover:rotate-12 duration-300" />
                  <span className="story-link">المعاملات الأخيرة</span>
                </CardTitle>
                <CardDescription className="transition-colors group-hover:text-primary/70">
                  آخر العمليات المنجزة مع التحديث المباشر
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="space-y-3">
                  {recentTransactions.slice(0, 5).map((transaction, index) => (
                    <div 
                      key={transaction.id} 
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-md animate-fade-in group/item"
                      style={{ animationDelay: `${index * 100}ms` }}
                      onClick={() => handleViewTransaction(transaction.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover/item:bg-primary/20 transition-colors duration-300">
                          <Users className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium group-hover/item:text-primary transition-colors duration-300">{transaction.customer}</p>
                          <p className="text-sm text-muted-foreground group-hover/item:text-foreground transition-colors duration-300">{transaction.service}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg group-hover/item:text-primary transition-colors duration-300">{transaction.amount} جنيه مصري</p>
                        <Badge 
                          variant={transaction.status === "مكتمل" ? "default" : "secondary"}
                          className="group-hover/item:animate-pulse transition-all duration-300"
                        >
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="group overflow-hidden transition-all duration-700 hover:shadow-2xl border-2 hover:border-secondary/20 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-yellow-400/10 to-transparent rounded-full translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-700" />
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-2 transition-colors group-hover:text-yellow-600">
                  <Star className="h-5 w-5 text-yellow-400 fill-current group-hover:animate-spin transition-transform duration-500" />
                  <span className="story-link">أفضل الخدمات</span>
                </CardTitle>
                <CardDescription className="transition-colors group-hover:text-yellow-600/70">
                  الخدمات الأكثر طلباً مع تقييمات العملاء
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="space-y-4">
                  {topServices.slice(0, 5).map((service, index) => (
                    <div 
                      key={service.name} 
                      className="space-y-2 p-3 rounded-lg hover:bg-gradient-to-r hover:from-yellow-50/50 hover:to-orange-50/50 transition-all duration-300 cursor-pointer animate-fade-in group/service"
                      style={{ animationDelay: `${index * 100}ms` }}
                      onClick={() => handleViewServiceDetails(service.name)}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium group-hover/service:text-yellow-700 transition-colors duration-300">{service.name}</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 group-hover/service:animate-pulse" />
                          <span className="text-sm font-medium group-hover/service:text-yellow-600 transition-colors duration-300">{service.rating}</span>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="group-hover/service:text-foreground transition-colors duration-300">{service.orders} طلب</span>
                        <span className="font-semibold group-hover/service:text-primary transition-colors duration-300">{service.revenue.toLocaleString()} جنيه مصري</span>
                      </div>
                      <div className="relative">
                        <Progress 
                          value={(service.orders / 50) * 100} 
                          className="h-2 group-hover/service:h-3 transition-all duration-300" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover/service:opacity-100 group-hover/service:animate-slide-in-right transition-opacity duration-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="branches" className="space-y-6 animate-fade-in">
          <BranchSelector />
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(branchesData).filter(([key]) => key !== 'all').map(([branchId, branch]) => (
              <Card key={branchId} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    {branch.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {branch.salesStats.map((stat, index) => (
                      <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                        <div className="flex items-center gap-2">
                          <stat.icon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{stat.title}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{stat.value} {stat.unit}</div>
                          <div className={`text-xs flex items-center gap-1 ${
                            stat.trend === "up" ? "text-green-600" : "text-red-600"
                          }`}>
                            {stat.trend === "up" ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                            {stat.change}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6 animate-scale-in">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowLeftRight className="h-5 w-5 text-primary" />
                مقارنة أداء الفروع
              </CardTitle>
              <CardDescription>مقارنة المبيعات والطلبات بين الفروع المختلفة</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={branchComparisonData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="branch" stroke="hsl(var(--muted-foreground))" />
                    <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" />
                    <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" />
                    <Tooltip />
                    <Bar yAxisId="left" dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="right" dataKey="orders" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-3">
            {branchComparisonData.map((branch, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <CardTitle className="flex items-center justify-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    فرع {branch.branch}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg bg-primary/10">
                    <div className="text-2xl font-bold text-primary">{branch.sales.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">جنيه مصري</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-secondary/10">
                      <div className="text-lg font-semibold text-secondary">{branch.orders}</div>
                      <div className="text-xs text-muted-foreground">طلب</div>
                    </div>
                    <div className="p-3 rounded-lg bg-accent/10">
                      <div className="text-lg font-semibold text-accent">{branch.customers}</div>
                      <div className="text-xs text-muted-foreground">عميل</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6 animate-fade-in">
          {/* ... keep existing code (analytics content) */}
        </TabsContent>

        <TabsContent value="pos" className="space-y-6 animate-fade-in">
          <POSMain />
        </TabsContent>

        <TabsContent value="ai-assistant" className="space-y-6 animate-fade-in">
          <div className="text-center p-12">
            <div className="max-w-md mx-auto space-y-6">
              <div className="w-24 h-24 mx-auto bg-gradient-to-r from-accent to-accent/80 rounded-full flex items-center justify-center animate-pulse">
                <Bot className="h-12 w-12 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">المساعد الذكي</h3>
                <p className="text-muted-foreground">
                  احصل على تحليلات ذكية ونصائح مخصصة لتحسين أداء مبيعاتك
                </p>
              </div>
              <div className="grid gap-3">
                <Button 
                  onClick={() => {
                    setShowAIAssistant(true);
                    setIsAssistantMinimized(false);
                  }}
                  className="w-full hover:scale-105 transition-all duration-300 bg-gradient-to-r from-accent to-accent/80"
                >
                  <Bot className="h-4 w-4 mr-2" />
                  بدء المحادثة
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => handleSendMessage("تحليل المبيعات اليوم")}
                    className="text-sm hover:scale-105 transition-all duration-300"
                  >
                    📊 تحليل سريع
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleSendMessage("نصائح لزيادة المبيعات")}
                    className="text-sm hover:scale-105 transition-all duration-300"
                  >
                    💡 نصائح ذكية
                  </Button>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-muted/30 rounded-lg border">
                <h4 className="font-semibold mb-3 text-accent">✨ مميزات المساعد الذكي</h4>
                <div className="grid gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    <span>تحليل البيانات في الوقت الفعلي</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span>توقعات المبيعات والتوصيات</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span>تحليل سلوك العملاء</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-purple-500" />
                    <span>مقارنة أداء الفروع</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}