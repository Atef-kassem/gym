import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useCustomerStore } from "@/hooks/useCustomerStore";
import { 
  useGetAllSubscriptionsQuery, 
  useCreateSubscriptionMutation, 
  useUpdateSubscriptionMutation, 
  useDeleteSubscriptionMutation, 
  useGetSubscriptionStatisticsQuery,
} from "@/services/subscriptionsApi";
import { 
  useGetPlansQuery, 
  useCreatePlanMutation, 
  useUpdatePlanMutation, 
  useDeletePlanMutation,
  useTogglePlanStatusMutation,
  useDuplicatePlanMutation
} from "@/services/plansApi";
import {
  CreditCard, Plus, Search, Filter, Edit, Eye, Crown, Star, Gift, Calendar,
  Users, DollarSign, TrendingUp, BarChart3, CheckCircle, XCircle, Clock,
  Award, Zap, Settings, Download, RefreshCw, AlertTriangle, Activity,
  Target, PieChart, Mail, Phone, MapPin, User, Bell
} from "lucide-react";

interface Subscription {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  planId: string;
  planName: string;
  planPrice: number;
  status: "نشط" | "منتهي" | "متوقف" | "تجربة";
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  paymentMethod: string;
  nextBillingDate: string;
  totalPaid: number;
  discountApplied?: string;
  createdAt: string;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  interval: "شهري" | "سنوي" | "أسبوعي";
  features: string[];
  popular?: boolean;
  color: string;
  description: string;
  maxUsers?: number;
  maxServices?: number;
}

export default function SubscriptionManagement() {
  console.log("💳 Loading SubscriptionManagement component");
  const { toast } = useToast();
  const { customers, getCustomerById } = useCustomerStore();
  
  // Local state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPlan, setFilterPlan] = useState("all");
  const [isNewSubscriptionOpen, setIsNewSubscriptionOpen] = useState(false);
  const [isNewPlanOpen, setIsNewPlanOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");

  const [newSubscription, setNewSubscription] = useState({
    customerId: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    planId: "",
    paymentMethod: "بطاقة ائتمان",
    autoRenew: true,
    discountCode: ""
  });

  const [newPlan, setNewPlan] = useState({
    name: "",
    price: "",
    interval: "شهري" as "شهري" | "سنوي" | "أسبوعي",
    description: "",
    features: "",
    maxUsers: "",
    maxServices: "",
    color: "blue"
  });

  // API hooks
  const { data: subscriptionsData, isLoading: subscriptionsLoading, refetch: refetchSubscriptions } = useGetAllSubscriptionsQuery({
    search: searchTerm,
    status: filterStatus,
    planId: filterPlan
  });
  
  const { data: plansData, isLoading: plansLoading, refetch: refetchPlans } = useGetPlansQuery({});
  
  const { data: statsData } = useGetSubscriptionStatisticsQuery();
  
  // Mutations
  const [createSubscription, { isLoading: isCreatingSubscription }] = useCreateSubscriptionMutation();
  const [updateSubscription, { isLoading: isUpdatingSubscription }] = useUpdateSubscriptionMutation();
  const [deleteSubscription, { isLoading: isDeletingSubscription }] = useDeleteSubscriptionMutation();
  // Note: Using updateSubscriptionMutation for status toggle since toggle mutation doesn't exist
  
  const [createPlan, { isLoading: isCreatingPlan }] = useCreatePlanMutation();
  const [updatePlan, { isLoading: isUpdatingPlan }] = useUpdatePlanMutation();
  const [deletePlan, { isLoading: isDeletingPlan }] = useDeletePlanMutation();
  const [togglePlanStatus, { isLoading: isTogglingPlanStatus }] = useTogglePlanStatusMutation();
  const [duplicatePlan, { isLoading: isDuplicatingPlan }] = useDuplicatePlanMutation();

  // Extract data from API responses
  const subscriptions = subscriptionsData?.data?.subscriptions || [];
  const plans = plansData?.data?.plans || [];
  const stats = statsData?.data?.summary || {};

  useEffect(() => {
    console.log("💳 SubscriptionManagement useEffect running");
    console.log("📊 Current subscriptions from API:", subscriptions);
    console.log("📊 Current plans from API:", plans);
    console.log("📊 Current stats from API:", stats);
  }, [subscriptions, plans, stats]);

  useEffect(() => {
    // حفظ البيانات عند التغيير
    localStorage.setItem("subscriptions", JSON.stringify(subscriptions));
  }, [subscriptions]);

  useEffect(() => {
    localStorage.setItem("subscription_plans", JSON.stringify(plans));
  }, [plans]);

  const generateId = () => {
    return 'sub_' + Math.random().toString(36).substr(2, 9);
  };

  const handleCreateSubscription = async () => {
    if (!newSubscription.customerId || !newSubscription.planId) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى اختيار العميل والخطة",
        variant: "destructive"
      });
      return;
    }

    const selectedPlan = plans.find((p: Plan) => p.id === newSubscription.planId);
    if (!selectedPlan) {
      toast({
        title: "خطأ في البيانات",
        description: "الخطة المحددة غير موجودة",
        variant: "destructive"
      });
      return;
    }

    const startDate = new Date();
    const endDate = new Date();
    
    if (selectedPlan.interval === "شهري") {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (selectedPlan.interval === "سنوي") {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      endDate.setDate(endDate.getDate() + 7);
    }

    try {
      const subscriptionData = {
        customerId: newSubscription.customerId,
        customerName: newSubscription.customerName,
        customerEmail: newSubscription.customerEmail,
        customerPhone: newSubscription.customerPhone,
        planId: selectedPlan.id,
        planName: selectedPlan.name,
        planPrice: selectedPlan.price,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        autoRenew: newSubscription.autoRenew,
        paymentMethod: newSubscription.paymentMethod,
        discountCode: newSubscription.discountCode
      };

      await createSubscription(subscriptionData).unwrap();
      
      setIsNewSubscriptionOpen(false);
      setNewSubscription({
        customerId: "",
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        planId: "",
        paymentMethod: "بطاقة ائتمان",
        autoRenew: true,
        discountCode: ""
      });

      toast({
        title: "تم الإنشاء بنجاح",
        description: `تم إنشاء اشتراك جديد للعميل: ${newSubscription.customerName}`,
      });
    } catch (error) {
      console.error('Error creating subscription:', error);
      toast({
        title: "خطأ في الإنشاء",
        description: "حدث خطأ أثناء إنشاء الاشتراك",
        variant: "destructive"
      });
    }
  };

  const handleCreatePlan = async () => {
    if (!newPlan.name || !newPlan.price || !newPlan.features) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    try {
      const planData = {
        name: newPlan.name,
        price: parseFloat(newPlan.price),
        interval: newPlan.interval,
        description: newPlan.description,
        features: newPlan.features.split('\n').filter(f => f.trim()),
        color: newPlan.color,
        maxUsers: parseInt(newPlan.maxUsers) || 1,
        maxServices: parseInt(newPlan.maxServices) || 5,
        popular: false
      };

      await createPlan(planData).unwrap();
      
      setIsNewPlanOpen(false);
      setNewPlan({
        name: "",
        price: "",
        interval: "شهري",
        description: "",
        features: "",
        maxUsers: "",
        maxServices: "",
        color: "blue"
      });

      toast({
        title: "تم الإنشاء بنجاح",
        description: `تم إنشاء خطة جديدة: ${newPlan.name}`,
      });
    } catch (error) {
      console.error('Error creating plan:', error);
      toast({
        title: "خطأ في الإنشاء",
        description: "حدث خطأ أثناء إنشاء الخطة",
        variant: "destructive"
      });
    }
  };

  const handleToggleSubscriptionStatus = async (id: string) => {
    try {
      const subscription = subscriptions.find((sub: Subscription) => sub.id === id);
      if (!subscription) return;
      
      const newStatus = subscription.status === "نشط" ? "متوقف" : "نشط";
      await updateSubscription({ 
        id, 
        data: { ...subscription, status: newStatus } 
      }).unwrap();
      
      toast({
        title: "تم التحديث",
        description: "تم تغيير حالة الاشتراك بنجاح",
      });
    } catch (error) {
      console.error('Error toggling subscription status:', error);
      toast({
        title: "خطأ في التحديث",
        description: "حدث خطأ أثناء تغيير حالة الاشتراك",
        variant: "destructive"
      });
    }
  };

  const handleRenewSubscription = async (id: string) => {
    try {
      const subscription = subscriptions.find((sub: Subscription) => sub.id === id);
      if (!subscription) return;
      
      const endDate = new Date(subscription.endDate);
      const plan = plans.find((p: Plan) => p.id === subscription.planId);
      if (plan) {
        if (plan.interval === "شهري") {
          endDate.setMonth(endDate.getMonth() + 1);
        } else if (plan.interval === "سنوي") {
          endDate.setFullYear(endDate.getFullYear() + 1);
        } else {
          endDate.setDate(endDate.getDate() + 7);
        }
        
        const updateData = {
          endDate: endDate.toISOString().split('T')[0],
          nextBillingDate: endDate.toISOString().split('T')[0],
          totalPaid: subscription.totalPaid + subscription.planPrice,
          status: "نشط" as const
        };
        
        await updateSubscription({ id, ...updateData }).unwrap();
        
        toast({
          title: "تم التجديد",
          description: "تم تجديد الاشتراك بنجاح",
        });
      }
    } catch (error) {
      console.error('Error renewing subscription:', error);
      toast({
        title: "خطأ في التجديد",
        description: "حدث خطأ أثناء تجديد الاشتراك",
        variant: "destructive"
      });
    }
  };

  const handleEditSubscription = (subscription: Subscription) => {
    setNewSubscription({
      customerId: subscription.customerId,
      customerName: subscription.customerName,
      customerEmail: subscription.customerEmail,
      customerPhone: subscription.customerPhone,
      planId: subscription.planId,
      paymentMethod: subscription.paymentMethod,
      autoRenew: subscription.autoRenew,
      discountCode: subscription.discountApplied || ""
    });
    setIsNewSubscriptionOpen(true);
  };

  const handleSendNotification = (customerId: string, message: string) => {
    toast({
      title: "تم الإرسال",
      description: "تم إرسال الإشعار للعميل",
    });
  };

  const handleExportData = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "اسم العميل,البريد الإلكتروني,الجوال,الخطة,السعر,الحالة,تاريخ البداية,تاريخ الانتهاء,إجمالي المدفوع\n"
      + subscriptions.map((sub: Subscription) => 
          `${sub.customerName},${sub.customerEmail},${sub.customerPhone},${sub.planName},${sub.planPrice},${sub.status},${sub.startDate},${sub.endDate},${sub.totalPaid}`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `subscriptions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "تم التصدير",
      description: "تم تصدير بيانات الاشتراكات بنجاح",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "نشط":
        return <Badge className="bg-green-500 text-white">نشط</Badge>;
      case "تجربة":
        return <Badge className="bg-blue-500 text-white">تجربة</Badge>;
      case "منتهي":
        return <Badge variant="outline">منتهي</Badge>;
      case "متوقف":
        return <Badge variant="destructive">متوقف</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPlanColor = (color: string) => {
    switch (color) {
      case "blue": return "from-blue-500 to-cyan-500";
      case "purple": return "from-purple-500 to-indigo-500";
      case "gold": return "from-yellow-500 to-orange-500";
      case "green": return "from-green-500 to-emerald-500";
      default: return "from-gray-500 to-slate-500";
    }
  };

  const calculateMetrics = () => {
    const activeSubscriptions = subscriptions.filter((s: Subscription) => s.status === "نشط").length;
    const totalRevenue = subscriptions.reduce((sum: number, s: Subscription) => sum + s.totalPaid, 0);
    const avgRevenue = subscriptions.length > 0 ? totalRevenue / subscriptions.length : 0;
    const renewalRate = subscriptions.filter((s: Subscription) => s.autoRenew).length / Math.max(subscriptions.length, 1) * 100;

    return {
      activeSubscriptions,
      totalRevenue,
      avgRevenue,
      renewalRate
    };
  };

  const metrics = calculateMetrics();

  const filteredSubscriptions = subscriptions.filter((subscription: Subscription) => {
    const matchesSearch = subscription.customerName.includes(searchTerm) ||
                         subscription.customerEmail.includes(searchTerm) ||
                         subscription.planName.includes(searchTerm);
    const matchesStatus = filterStatus === "all" || subscription.status === filterStatus;
    const matchesPlan = filterPlan === "all" || subscription.planId === filterPlan;
    
    return matchesSearch && matchesStatus && matchesPlan;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              إدارة الاشتراكات الذكية
            </h1>
            <p className="text-gray-600 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-500" />
              نظام شامل لإدارة اشتراكات العملاء وخطط الخدمات
              {(subscriptionsLoading || plansLoading) && (
                <div className="flex items-center gap-2 text-blue-500">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  جاري التحميل...
                </div>
              )}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportData}>
              <Download className="w-4 h-4 mr-2" />
              تصدير البيانات
            </Button>
            <Dialog open={isNewPlanOpen} onOpenChange={setIsNewPlanOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Crown className="w-4 h-4 mr-2" />
                  خطة جديدة
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>إنشاء خطة جديدة</DialogTitle>
                  <DialogDescription>
                    قم بتحديد تفاصيل الخطة الجديدة والخدمات المتاحة
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="planName">اسم الخطة *</Label>
                      <Input
                        id="planName"
                        value={newPlan.name}
                        onChange={(e) => setNewPlan(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="الخطة الأساسية"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="planPrice">السعر (جنيه) *</Label>
                      <Input
                        id="planPrice"
                        type="number"
                        value={newPlan.price}
                        onChange={(e) => setNewPlan(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="99"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="planFeatures">المميزات (سطر لكل ميزة) *</Label>
                    <textarea
                      id="planFeatures"
                      className="w-full p-2 border rounded-md min-h-[100px]"
                      value={newPlan.features}
                      onChange={(e) => setNewPlan(prev => ({ ...prev, features: e.target.value }))}
                      placeholder="5 غسلات شهرياً&#10;تنظيف داخلي أساسي&#10;دعم فني"
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleCreatePlan} className="flex-1">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    إنشاء الخطة
                  </Button>
                  <Button variant="outline" onClick={() => setIsNewPlanOpen(false)}>
                    إلغاء
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isNewSubscriptionOpen} onOpenChange={setIsNewSubscriptionOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                  <Plus className="w-4 h-4 mr-2" />
                  اشتراك جديد
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>إنشاء اشتراك جديد</DialogTitle>
                  <DialogDescription>
                    قم بإدخال بيانات العميل واختيار الخطة المناسبة
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  {/* اختيار العميل */}
                  <div className="space-y-2">
                    <Label>اختيار العميل *</Label>
                    <div className="space-y-2">
                      <div className="relative">
                        <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="البحث عن عميل بالاسم أو الجوال..."
                          value={customerSearchTerm}
                          onChange={(e) => setCustomerSearchTerm(e.target.value)}
                          className="pr-10"
                        />
                      </div>
                      <Select 
                        value={newSubscription.customerId} 
                        onValueChange={(customerId) => {
                          const customer = customers.find(c => c.id === customerId);
                          if (customer) {
                            setNewSubscription(prev => ({
                              ...prev,
                              customerId: customer.id,
                              customerName: customer.name,
                              customerEmail: customer.email || "",
                              customerPhone: customer.phone
                            }));
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر عميل موجود" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border shadow-lg z-50 max-h-60">
                          {customers
                            .filter(customer => 
                              customerSearchTerm === "" ||
                              customer.name.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
                              customer.phone.includes(customerSearchTerm)
                            )
                            .map(customer => (
                              <SelectItem key={customer.id} value={customer.id}>
                                <div className="flex items-center gap-2">
                                  <User className="w-4 h-4" />
                                  <div>
                                    <div className="font-medium">{customer.name}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {customer.phone} • {customer.email}
                                    </div>
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* عرض بيانات العميل المختار */}
                  {newSubscription.customerId && (
                    <Card className="bg-blue-50 border-blue-200">
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2 text-blue-900">بيانات العميل المختار</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <Label className="text-blue-700">الاسم</Label>
                            <p className="font-medium">{newSubscription.customerName}</p>
                          </div>
                          <div>
                            <Label className="text-blue-700">البريد الإلكتروني</Label>
                            <p className="font-medium">{newSubscription.customerEmail}</p>
                          </div>
                          <div>
                            <Label className="text-blue-700">رقم الجوال</Label>
                            <p className="font-medium">{newSubscription.customerPhone}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="planSelect">اختيار الخطة *</Label>
                    <Select value={newSubscription.planId} onValueChange={(value) => setNewSubscription(prev => ({ ...prev, planId: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الخطة" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border shadow-lg z-50">
                        {plans.map((plan: Plan) => (
                          <SelectItem key={plan.id} value={plan.id}>
                            {plan.name} - {plan.price} جنيه مصري/{plan.interval}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="paymentMethod">طريقة الدفع</Label>
                      <Select value={newSubscription.paymentMethod} onValueChange={(value) => setNewSubscription(prev => ({ ...prev, paymentMethod: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border shadow-lg z-50">
                          <SelectItem value="بطاقة ائتمان">بطاقة ائتمان</SelectItem>
                          <SelectItem value="بطاقة خصم">بطاقة خصم</SelectItem>
                          <SelectItem value="تحويل بنكي">تحويل بنكي</SelectItem>
                          <SelectItem value="نقداً">نقداً</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="discountCode">كود الخصم</Label>
                      <Input
                        id="discountCode"
                        value={newSubscription.discountCode}
                        onChange={(e) => setNewSubscription(prev => ({ ...prev, discountCode: e.target.value }))}
                        placeholder="WELCOME10"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="autoRenew"
                      checked={newSubscription.autoRenew}
                      onCheckedChange={(checked) => setNewSubscription(prev => ({ ...prev, autoRenew: checked }))}
                    />
                    <Label htmlFor="autoRenew" className="mr-2">التجديد التلقائي</Label>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleCreateSubscription} className="flex-1">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    إنشاء الاشتراك
                  </Button>
                  <Button variant="outline" onClick={() => setIsNewSubscriptionOpen(false)}>
                    إلغاء
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">الاشتراكات النشطة</p>
                  <p className="text-2xl font-bold text-blue-900">{metrics.activeSubscriptions}</p>
                </div>
                <div className="p-3 bg-blue-500 rounded-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">إجمالي الإيرادات</p>
                  <p className="text-2xl font-bold text-green-900">{metrics.totalRevenue.toLocaleString()} جنيه مصري</p>
                </div>
                <div className="p-3 bg-green-500 rounded-lg">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">متوسط الإيرادات</p>
                  <p className="text-2xl font-bold text-purple-900">{metrics.avgRevenue.toFixed(0)} جنيه مصري</p>
                </div>
                <div className="p-3 bg-purple-500 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">معدل التجديد</p>
                  <p className="text-2xl font-bold text-orange-900">{metrics.renewalRate.toFixed(1)}%</p>
                </div>
                <div className="p-3 bg-orange-500 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="البحث بالاسم، البريد الإلكتروني أو الخطة..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="الحالة" />
                </SelectTrigger>
                <SelectContent className="bg-white border shadow-lg z-50">
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="نشط">نشط</SelectItem>
                  <SelectItem value="متوقف">متوقف</SelectItem>
                  <SelectItem value="منتهي">منتهي</SelectItem>
                  <SelectItem value="تجربة">تجربة</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterPlan} onValueChange={setFilterPlan}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="الخطة" />
                </SelectTrigger>
                <SelectContent className="bg-white border shadow-lg z-50">
                  <SelectItem value="all">جميع الخطط</SelectItem>
                  {plans.map((plan: Plan) => (
                    <SelectItem key={plan.id} value={plan.id}>{plan.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="subscriptions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white">
            <TabsTrigger value="subscriptions" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              الاشتراكات
            </TabsTrigger>
            <TabsTrigger value="plans" className="flex items-center gap-2">
              <Crown className="w-4 h-4" />
              خطط الخدمات
            </TabsTrigger>
          </TabsList>

          <TabsContent value="subscriptions" className="space-y-6">
            <div className="grid gap-4">
              {filteredSubscriptions.map((subscription: Subscription) => (
                <Card key={subscription.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{subscription.customerName}</h3>
                          {getStatusBadge(subscription.status)}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {subscription.customerEmail}
                          </div>
                          <div className="flex items-center gap-1">
                            <Crown className="w-3 h-3" />
                            {subscription.planName}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            {subscription.planPrice} جنيه مصري
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-4" />
                            حتى {new Date(subscription.endDate).toLocaleDateString('ar-SA')}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedSubscription(subscription)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEditSubscription(subscription)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleRenewSubscription(subscription.id)}
                          disabled={subscription.status === "منتهي"}
                        >
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant={subscription.status === "نشط" ? "destructive" : "default"}
                          onClick={() => handleToggleSubscriptionStatus(subscription.id)}
                        >
                          {subscription.status === "نشط" ? (
                            <XCircle className="w-4 h-4" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleSendNotification(subscription.customerId, "تذكير بالفوترة القادمة")}
                        >
                          <Bell className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="plans" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {plans.map((plan: Plan) => (
                <Card 
                  key={plan.id} 
                  className={`relative overflow-hidden ${plan.popular ? 'border-purple-500 border-2' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-purple-500 text-white px-3 py-1 text-xs font-medium">
                      الأكثر شعبية
                    </div>
                  )}
                  <div className={`h-2 bg-gradient-to-r ${getPlanColor(plan.color)}`} />
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                      <div className="text-3xl font-bold text-blue-600 mb-1">
                        {plan.price} جنيه مصري
                      </div>
                      <p className="text-sm text-muted-foreground">/{plan.interval}</p>
                      {plan.description && (
                        <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                      )}
                    </div>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Subscription Details Dialog */}
        <Dialog open={!!selectedSubscription} onOpenChange={() => setSelectedSubscription(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>تفاصيل الاشتراك</DialogTitle>
              <DialogDescription>
                معلومات شاملة عن اشتراك العميل
              </DialogDescription>
            </DialogHeader>
            
            {selectedSubscription && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">معلومات العميل</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span>{selectedSubscription.customerName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span>{selectedSubscription.customerEmail}</span>
                      </div>
                      {selectedSubscription.customerPhone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span>{selectedSubscription.customerPhone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">معلومات الاشتراك</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">الخطة:</span>
                        <span className="font-medium">{selectedSubscription.planName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">السعر:</span>
                        <span className="font-medium">{selectedSubscription.planPrice} جنيه مصري</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">الحالة:</span>
                        {getStatusBadge(selectedSubscription.status)}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">التجديد التلقائي:</span>
                        <span className={selectedSubscription.autoRenew ? "text-green-600" : "text-red-600"}>
                          {selectedSubscription.autoRenew ? "مفعل" : "غير مفعل"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">التواريخ والمدفوعات</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">تاريخ البداية:</span>
                        <span>{new Date(selectedSubscription.startDate).toLocaleDateString('ar-SA')}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">تاريخ الانتهاء:</span>
                        <span>{new Date(selectedSubscription.endDate).toLocaleDateString('ar-SA')}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">الفوترة القادمة:</span>
                        <span>{new Date(selectedSubscription.nextBillingDate).toLocaleDateString('ar-SA')}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">طريقة الدفع:</span>
                        <span>{selectedSubscription.paymentMethod}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">إجمالي المدفوع:</span>
                        <span className="font-medium text-green-600">{selectedSubscription.totalPaid.toLocaleString()} جنيه مصري</span>
                      </div>
                      {selectedSubscription.discountApplied && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">كود الخصم:</span>
                          <span className="text-green-600">{selectedSubscription.discountApplied}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => selectedSubscription && handleEditSubscription(selectedSubscription)}
              >
                <Edit className="w-4 h-4 mr-2" />
                تعديل
              </Button>
              <Button 
                variant="outline" 
                onClick={() => selectedSubscription && handleSendNotification(selectedSubscription.customerId, "إشعار خاص بالاشتراك")}
              >
                <Bell className="w-4 h-4 mr-2" />
                إرسال إشعار
              </Button>
              <Button variant="outline" onClick={() => setSelectedSubscription(null)}>
                إغلاق
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}