import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Car, Award, Star, BarChart3, Gift, Target, Brain, MessageSquare, CreditCard, Stars } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BranchSelector } from "@/components/BranchSelector";

// Import existing dashboard components
import { StatisticsCard } from "@/components/CRM/Dashboard/StatisticsCard";
import { CustomerGrowthChart } from "@/components/CRM/Dashboard/CustomerGrowthChart";
import { RecentCustomersSection } from "@/components/CRM/Dashboard/RecentCustomersSection";
import { LoyaltyStats } from "@/components/CRM/Dashboard/LoyaltyStats";
import { ActiveCampaigns } from "@/components/CRM/Dashboard/ActiveCampaigns";
import { QuickActions } from "@/components/CRM/Dashboard/QuickActions";
import { CustomerSatisfactionSection } from "@/components/CRM/Dashboard/CustomerSatisfactionSection";
import { DashboardNotifications } from "@/components/CRM/Dashboard/DashboardNotifications";

// Import new AI-powered components
import { AIInsightsPanel } from "@/components/CRM/Dashboard/AIInsightsPanel";
import { AISentimentAnalysis } from "@/components/CRM/Dashboard/AISentimentAnalysis";
import { AIAssistantChat } from "@/components/CRM/Dashboard/AIAssistantChat";

export default function CRMDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for dashboard
  const customerStats = {
    total: 2847,
    new: 156,
    vip: 234,
    active: 1920,
    vehicles: 3521,
    satisfaction: 4.6,
    campaigns: 12,
    activeCampaigns: 4,
    coupons: 89,
    activeCoupons: 23,
    subscriptions: 156,
    loyaltyPoints: 45200,
    cards: 89,
    activeCards: 67
  };

  const statisticsData = [
    {
      title: "إجمالي العملاء",
      value: customerStats.total,
      subtitle: (
        <span>
          <span className="text-green-600 font-semibold">+{customerStats.new}</span> عميل جديد هذا الشهر
        </span>
      ),
      icon: Users,
      iconColor: "text-blue-600",
      borderColor: "border-l-blue-500",
      bgGradient: "bg-gradient-to-br from-blue-50 to-blue-100/50 hover:from-blue-100 hover:to-blue-200/50",
      onClick: () => navigate('/crm/customers')
    },
    {
      title: "المركبات المسجلة",
      value: customerStats.vehicles,
      subtitle: `متوسط ${(customerStats.vehicles / customerStats.total).toFixed(1)} مركبة لكل عميل`,
      icon: Car,
      iconColor: "text-green-600",
      borderColor: "border-l-green-500",
      bgGradient: "bg-gradient-to-br from-green-50 to-green-100/50 hover:from-green-100 hover:to-green-200/50",
      onClick: () => navigate('/crm/vehicles')
    },
    {
      title: "الحملات التسويقية",
      value: customerStats.campaigns,
      subtitle: `${customerStats.activeCampaigns} حملات نشطة حالياً`,
      icon: Target,
      iconColor: "text-orange-600",
      borderColor: "border-l-orange-500",
      bgGradient: "bg-gradient-to-br from-orange-50 to-orange-100/50 hover:from-orange-100 hover:to-orange-200/50",
      onClick: () => navigate('/crm/campaigns')
    },
    {
      title: "تقييمات العملاء",
      value: `${customerStats.satisfaction}/5`,
      subtitle: (
        <div className="flex items-center gap-1 mt-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star 
              key={star} 
              className={`h-4 w-4 transition-all duration-200 hover:scale-125 ${
                star <= customerStats.satisfaction 
                  ? 'text-yellow-500 fill-current' 
                  : 'text-gray-300'
              }`} 
            />
          ))}
        </div>
      ),
      icon: MessageSquare,
      iconColor: "text-pink-600",
      borderColor: "border-l-pink-500",
      bgGradient: "bg-gradient-to-br from-pink-50 to-pink-100/50 hover:from-pink-100 hover:to-pink-200/50",
      onClick: () => navigate('/crm/feedback')
    },
    {
      title: "الكوبونات",
      value: customerStats.coupons,
      subtitle: `${customerStats.activeCoupons} كوبون نشط`,
      icon: Gift,
      iconColor: "text-indigo-600",
      borderColor: "border-l-indigo-500",
      bgGradient: "bg-gradient-to-br from-indigo-50 to-indigo-100/50 hover:from-indigo-100 hover:to-indigo-200/50",
      onClick: () => navigate('/crm/coupons')
    },
    {
      title: "الاشتراكات",
      value: customerStats.subscriptions,
      subtitle: "اشتراك نشط هذا الشهر",
      icon: CreditCard,
      iconColor: "text-emerald-600",
      borderColor: "border-l-emerald-500",
      bgGradient: "bg-gradient-to-br from-emerald-50 to-emerald-100/50 hover:from-emerald-100 hover:to-emerald-200/50",
      onClick: () => navigate('/crm/subscriptions')
    },
    {
      title: "نقاط الولاء",
      value: customerStats.loyaltyPoints.toLocaleString(),
      subtitle: `${customerStats.vip} عميل VIP`,
      icon: Stars,
      iconColor: "text-yellow-600",
      borderColor: "border-l-yellow-500",
      bgGradient: "bg-gradient-to-br from-yellow-50 to-yellow-100/50 hover:from-yellow-100 hover:to-yellow-200/50",
      onClick: () => navigate('/crm/loyalty')
    },
    {
      title: "البطاقات",
      value: customerStats.cards,
      subtitle: `${customerStats.activeCards} بطاقة نشطة`,
      icon: CreditCard,
      iconColor: "text-purple-600",
      borderColor: "border-l-purple-500",
      bgGradient: "bg-gradient-to-br from-purple-50 to-purple-100/50 hover:from-purple-100 hover:to-purple-200/50",
      onClick: () => navigate('/crm/cards')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in">
          <div className="hover-scale">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              إدارة علاقات العملاء
            </h1>
            <p className="text-gray-600">نظرة شاملة على قاعدة العملاء وعلاقاتهم</p>
          </div>
        </div>

        {/* Notifications */}
        <DashboardNotifications />

        {/* Main Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statisticsData.map((stat, index) => (
            <div key={stat.title} style={{ animationDelay: `${index * 100}ms` }}>
              <StatisticsCard {...stat} />
            </div>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 animate-fade-in">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-9 bg-gradient-to-r from-background/80 via-muted/60 to-background/80 backdrop-blur-md shadow-elegant border border-border/40 rounded-2xl p-2 gap-1 overflow-hidden">
            <TabsTrigger 
              value="overview" 
              className="group relative flex items-center gap-1 text-xs px-3 py-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-glow transition-all duration-500 hover:scale-105 data-[state=active]:scale-105 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 group-data-[state=active]:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-data-[state=active]:translate-x-full transition-transform duration-1000"></div>
              <div className="absolute top-1 right-1 w-1 h-1 bg-blue-400/60 rounded-full opacity-0 group-data-[state=active]:opacity-100 group-data-[state=active]:animate-ping"></div>
              <BarChart3 className="w-3 h-3 relative z-10 group-data-[state=active]:animate-pulse" />
              <span className="relative z-10">نظرة عامة</span>
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 scale-x-0 group-data-[state=active]:scale-x-100 transition-transform duration-500 origin-center"></div>
            </TabsTrigger>
            <TabsTrigger 
              value="customers" 
              className="group relative flex items-center gap-1 text-xs px-3 py-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-glow transition-all duration-500 hover:scale-105 data-[state=active]:scale-105 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 group-data-[state=active]:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-data-[state=active]:translate-x-full transition-transform duration-1000"></div>
              <div className="absolute top-1 right-1 w-1 h-1 bg-green-400/60 rounded-full opacity-0 group-data-[state=active]:opacity-100 group-data-[state=active]:animate-ping"></div>
              <Users className="w-3 h-3 relative z-10 group-data-[state=active]:animate-pulse" />
              <span className="relative z-10">العملاء</span>
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 scale-x-0 group-data-[state=active]:scale-x-100 transition-transform duration-500 origin-center"></div>
            </TabsTrigger>
            <TabsTrigger 
              value="vehicles" 
              className="group relative flex items-center gap-1 text-xs px-3 py-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-glow transition-all duration-500 hover:scale-105 data-[state=active]:scale-105 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 group-data-[state=active]:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-data-[state=active]:translate-x-full transition-transform duration-1000"></div>
              <div className="absolute top-1 right-1 w-1 h-1 bg-purple-400/60 rounded-full opacity-0 group-data-[state=active]:opacity-100 group-data-[state=active]:animate-ping"></div>
              <Car className="w-3 h-3 relative z-10 group-data-[state=active]:animate-pulse" />
              <span className="relative z-10">المركبات</span>
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 scale-x-0 group-data-[state=active]:scale-x-100 transition-transform duration-500 origin-center"></div>
            </TabsTrigger>
            <TabsTrigger 
              value="campaigns" 
              className="group relative flex items-center gap-1 text-xs px-3 py-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-glow transition-all duration-500 hover:scale-105 data-[state=active]:scale-105 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 group-data-[state=active]:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-data-[state=active]:translate-x-full transition-transform duration-1000"></div>
              <div className="absolute top-1 right-1 w-1 h-1 bg-orange-400/60 rounded-full opacity-0 group-data-[state=active]:opacity-100 group-data-[state=active]:animate-ping"></div>
              <Target className="w-3 h-3 relative z-10 group-data-[state=active]:animate-pulse" />
              <span className="relative z-10">الحملات</span>
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-orange-500 to-red-500 scale-x-0 group-data-[state=active]:scale-x-100 transition-transform duration-500 origin-center"></div>
            </TabsTrigger>
            <TabsTrigger 
              value="feedback" 
              className="group relative flex items-center gap-1 text-xs px-3 py-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white data-[state=active]:shadow-glow transition-all duration-500 hover:scale-105 data-[state=active]:scale-105 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-rose-500/10 opacity-0 group-hover:opacity-100 group-data-[state=active]:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-data-[state=active]:translate-x-full transition-transform duration-1000"></div>
              <div className="absolute top-1 right-1 w-1 h-1 bg-pink-400/60 rounded-full opacity-0 group-data-[state=active]:opacity-100 group-data-[state=active]:animate-ping"></div>
              <MessageSquare className="w-3 h-3 relative z-10 group-data-[state=active]:animate-pulse" />
              <span className="relative z-10">التقييمات</span>
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-pink-500 to-rose-500 scale-x-0 group-data-[state=active]:scale-x-100 transition-transform duration-500 origin-center"></div>
            </TabsTrigger>
            <TabsTrigger 
              value="coupons" 
              className="group relative flex items-center gap-1 text-xs px-3 py-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-glow transition-all duration-500 hover:scale-105 data-[state=active]:scale-105 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 group-data-[state=active]:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-data-[state=active]:translate-x-full transition-transform duration-1000"></div>
              <div className="absolute top-1 right-1 w-1 h-1 bg-indigo-400/60 rounded-full opacity-0 group-data-[state=active]:opacity-100 group-data-[state=active]:animate-ping"></div>
              <Gift className="w-3 h-3 relative z-10 group-data-[state=active]:animate-pulse" />
              <span className="relative z-10">الكوبونات</span>
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 scale-x-0 group-data-[state=active]:scale-x-100 transition-transform duration-500 origin-center"></div>
            </TabsTrigger>
            <TabsTrigger 
              value="subscriptions" 
              className="group relative flex items-center gap-1 text-xs px-3 py-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-green-500 data-[state=active]:text-white data-[state=active]:shadow-glow transition-all duration-500 hover:scale-105 data-[state=active]:scale-105 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 group-data-[state=active]:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-data-[state=active]:translate-x-full transition-transform duration-1000"></div>
              <div className="absolute top-1 right-1 w-1 h-1 bg-emerald-400/60 rounded-full opacity-0 group-data-[state=active]:opacity-100 group-data-[state=active]:animate-ping"></div>
              <CreditCard className="w-3 h-3 relative z-10 group-data-[state=active]:animate-pulse" />
              <span className="relative z-10">الاشتراكات</span>
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-emerald-500 to-green-500 scale-x-0 group-data-[state=active]:scale-x-100 transition-transform duration-500 origin-center"></div>
            </TabsTrigger>
            <TabsTrigger 
              value="loyalty" 
              className="group relative flex items-center gap-1 text-xs px-3 py-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-glow transition-all duration-500 hover:scale-105 data-[state=active]:scale-105 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 group-data-[state=active]:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-data-[state=active]:translate-x-full transition-transform duration-1000"></div>
              <div className="absolute top-1 right-1 w-1 h-1 bg-yellow-400/60 rounded-full opacity-0 group-data-[state=active]:opacity-100 group-data-[state=active]:animate-ping"></div>
              <Stars className="w-3 h-3 relative z-10 group-data-[state=active]:animate-pulse" />
              <span className="relative z-10">الولاء</span>
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 scale-x-0 group-data-[state=active]:scale-x-100 transition-transform duration-500 origin-center"></div>
            </TabsTrigger>
            <TabsTrigger 
              value="cards" 
              className="group relative flex items-center gap-1 text-xs px-3 py-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-violet-500 data-[state=active]:text-white data-[state=active]:shadow-glow transition-all duration-500 hover:scale-105 data-[state=active]:scale-105 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-violet-500/10 opacity-0 group-hover:opacity-100 group-data-[state=active]:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-data-[state=active]:translate-x-full transition-transform duration-1000"></div>
              <div className="absolute top-1 right-1 w-1 h-1 bg-purple-400/60 rounded-full opacity-0 group-data-[state=active]:opacity-100 group-data-[state=active]:animate-ping"></div>
              <Award className="w-3 h-3 relative z-10 group-data-[state=active]:animate-pulse" />
              <span className="relative z-10">البطاقات</span>
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-purple-500 to-violet-500 scale-x-0 group-data-[state=active]:scale-x-100 transition-transform duration-500 origin-center"></div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CustomerGrowthChart />
              <CustomerSatisfactionSection />
            </div>
          </TabsContent>

          <TabsContent value="customers" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">إجمالي العملاء</h3>
                <p className="text-3xl font-bold">{customerStats.total.toLocaleString()}</p>
                <p className="text-blue-100 text-sm mt-2">+{customerStats.new} عميل جديد هذا الشهر</p>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">العملاء النشطون</h3>
                <p className="text-3xl font-bold">{customerStats.active.toLocaleString()}</p>
                <p className="text-green-100 text-sm mt-2">{((customerStats.active/customerStats.total)*100).toFixed(1)}% من إجمالي العملاء</p>
              </div>
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">عملاء VIP</h3>
                <p className="text-3xl font-bold">{customerStats.vip}</p>
                <p className="text-yellow-100 text-sm mt-2">عملاء مميزون</p>
              </div>
            </div>
            <RecentCustomersSection />
          </TabsContent>

          <TabsContent value="vehicles" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">إجمالي المركبات</h3>
                <p className="text-3xl font-bold">{customerStats.vehicles.toLocaleString()}</p>
                <p className="text-purple-100 text-sm mt-2">مركبة مسجلة</p>
              </div>
              <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">متوسط المركبات</h3>
                <p className="text-3xl font-bold">{(customerStats.vehicles/customerStats.total).toFixed(1)}</p>
                <p className="text-indigo-100 text-sm mt-2">مركبة لكل عميل</p>
              </div>
              <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-lg p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">مركبات نشطة</h3>
                <p className="text-3xl font-bold">{Math.floor(customerStats.vehicles * 0.85).toLocaleString()}</p>
                <p className="text-cyan-100 text-sm mt-2">85% من إجمالي المركبات</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">تفاصيل إدارة المركبات</h3>
              <p className="text-gray-600 mb-4">يمكنك إدارة جميع المركبات المسجلة في النظام، تتبع تاريخ الصيانة، والحصول على تقارير مفصلة.</p>
              <button 
                onClick={() => navigate('/crm/vehicles')} 
                className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors"
              >
                عرض جميع المركبات
              </button>
            </div>
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">إجمالي الحملات</h3>
                <p className="text-3xl font-bold">{customerStats.campaigns}</p>
                <p className="text-orange-100 text-sm mt-2">حملة تسويقية</p>
              </div>
              <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">الحملات النشطة</h3>
                <p className="text-3xl font-bold">{customerStats.activeCampaigns}</p>
                <p className="text-red-100 text-sm mt-2">حملة نشطة حالياً</p>
              </div>
              <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">معدل النجاح</h3>
                <p className="text-3xl font-bold">78%</p>
                <p className="text-pink-100 text-sm mt-2">معدل نجاح الحملات</p>
              </div>
            </div>
            <ActiveCampaigns />
          </TabsContent>

          <TabsContent value="feedback" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">متوسط التقييم</h3>
                <p className="text-3xl font-bold">{customerStats.satisfaction}/5</p>
                <p className="text-pink-100 text-sm mt-2">تقييم ممتاز</p>
              </div>
              <div className="bg-gradient-to-r from-rose-500 to-rose-600 rounded-lg p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">عدد التقييمات</h3>
                <p className="text-3xl font-bold">1,247</p>
                <p className="text-rose-100 text-sm mt-2">تقييم هذا الشهر</p>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">الرضا العام</h3>
                <p className="text-3xl font-bold">92%</p>
                <p className="text-purple-100 text-sm mt-2">عملاء راضون</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">إدارة تقييمات العملاء</h3>
              <p className="text-gray-600 mb-4">تتبع آراء العملاء وتقييماتهم للخدمات المقدمة والعمل على تحسين الجودة.</p>
              <button 
                onClick={() => navigate('/crm/feedback')} 
                className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors"
              >
                عرض جميع التقييمات
              </button>
            </div>
          </TabsContent>

          <TabsContent value="coupons" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">إجمالي الكوبونات</h3>
                <p className="text-3xl font-bold">{customerStats.coupons}</p>
                <p className="text-indigo-100 text-sm mt-2">كوبون متاح</p>
              </div>
              <div className="bg-gradient-to-r from-violet-500 to-violet-600 rounded-lg p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">الكوبونات النشطة</h3>
                <p className="text-3xl font-bold">{customerStats.activeCoupons}</p>
                <p className="text-violet-100 text-sm mt-2">كوبون نشط</p>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">معدل الاستخدام</h3>
                <p className="text-3xl font-bold">67%</p>
                <p className="text-blue-100 text-sm mt-2">من الكوبونات المتاحة</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">إدارة الكوبونات والخصومات</h3>
              <p className="text-gray-600 mb-4">إنشاء وإدارة كوبونات الخصم وبرامج الولاء لتحفيز العملاء وزيادة المبيعات.</p>
              <button 
                onClick={() => navigate('/crm/coupons')} 
                className="bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
              >
                عرض جميع الكوبونات
              </button>
            </div>
          </TabsContent>

          <TabsContent value="subscriptions" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">الاشتراكات النشطة</h3>
                <p className="text-3xl font-bold">{customerStats.subscriptions}</p>
                <p className="text-emerald-100 text-sm mt-2">اشتراك نشط</p>
              </div>
              <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">الإيرادات الشهرية</h3>
                <p className="text-3xl font-bold">45,200</p>
                <p className="text-teal-100 text-sm mt-2">جنيه مصري</p>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">معدل التجديد</h3>
                <p className="text-3xl font-bold">89%</p>
                <p className="text-green-100 text-sm mt-2">من الاشتراكات</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">إدارة اشتراكات العملاء</h3>
              <p className="text-gray-600 mb-4">متابعة وإدارة اشتراكات العملاء في الخدمات المختلفة وخطط الدفع.</p>
              <button 
                onClick={() => navigate('/crm/subscriptions')} 
                className="bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600 transition-colors"
              >
                عرض جميع الاشتراكات
              </button>
            </div>
          </TabsContent>

          <TabsContent value="loyalty" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">إجمالي النقاط</h3>
                <p className="text-3xl font-bold">{customerStats.loyaltyPoints.toLocaleString()}</p>
                <p className="text-yellow-100 text-sm mt-2">نقطة ولاء متاحة</p>
              </div>
              <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">عملاء VIP</h3>
                <p className="text-3xl font-bold">{customerStats.vip}</p>
                <p className="text-amber-100 text-sm mt-2">عميل مميز</p>
              </div>
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">المكافآت المستردة</h3>
                <p className="text-3xl font-bold">1,867</p>
                <p className="text-orange-100 text-sm mt-2">مكافأة هذا الشهر</p>
              </div>
            </div>
            <LoyaltyStats />
          </TabsContent>

          <TabsContent value="cards" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">إجمالي البطاقات</h3>
                <p className="text-3xl font-bold">{customerStats.cards}</p>
                <p className="text-purple-100 text-sm mt-2">بطاقة مصدرة</p>
              </div>
              <div className="bg-gradient-to-r from-violet-500 to-violet-600 rounded-lg p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">البطاقات النشطة</h3>
                <p className="text-3xl font-bold">{customerStats.activeCards}</p>
                <p className="text-violet-100 text-sm mt-2">بطاقة نشطة</p>
              </div>
              <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">معدل الاستخدام</h3>
                <p className="text-3xl font-bold">{Math.round((customerStats.activeCards/customerStats.cards)*100)}%</p>
                <p className="text-indigo-100 text-sm mt-2">من البطاقات المصدرة</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">إدارة البطاقات</h3>
              <p className="text-gray-600 mb-4">إدارة بطاقات الاشتراك والهدايا والولاء للعملاء مع تتبع حالة كل بطاقة.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800">بطاقات الاشتراك</h4>
                  <p className="text-blue-600 text-sm">35 بطاقة نشطة</p>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800">بطاقات الهدايا</h4>
                  <p className="text-green-600 text-sm">22 بطاقة نشطة</p>
                </div>
                <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-lg">
                  <h4 className="font-semibold text-yellow-800">بطاقات الولاء</h4>
                  <p className="text-yellow-600 text-sm">10 بطاقة نشطة</p>
                </div>
              </div>
              <button 
                onClick={() => navigate('/crm/cards')} 
                className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors"
              >
                عرض جميع البطاقات
              </button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <QuickActions />
      </div>
    </div>
  );
}