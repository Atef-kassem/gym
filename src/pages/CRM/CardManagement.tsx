import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  CreditCard, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  BarChart3,
  Wallet,
  ShoppingBag,
  Gift,
  CheckCircle,
  XCircle,
  Pause,
  Calendar,
  Eye,
  Edit,
  DollarSign,
  QrCode,
  Printer,
  Bell,
  Snowflake,
  Play,
  MoreHorizontal,
  Copy,
  Share,
  History,
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  Target,
  Users,
  Star,
  Trophy,
  Crown
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface MembershipCard {
  id: string;
  cardNumber: string;
  cardType: "gift" | "subscription" | "loyalty";
  status: "نشطة" | "منتهية" | "موقوفة" | "مجمدة";
  balance: number;
  initialValue?: number;
  issueDate: string;
  expiryDate: string;
  linkedTo: string;
  linkedName: string;
  linkType: "customer" | "employee" | "guest";
  lastUsed?: string;
  totalSpent: number;
  recharges: number;
  qrCode: string;
  isDigital: boolean;
  usageHistory: any[];
}

interface CardTemplate {
  id: string;
  name: string;
  description: string;
  cardType: "gift" | "subscription" | "loyalty";
  defaultValue: number;
  validityMonths: number;
  features: string[];
  active: boolean;
}

export default function CardManagement() {
  const [cards, setCards] = useState<MembershipCard[]>([]);
  const [filteredCards, setFilteredCards] = useState<MembershipCard[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isNewCardOpen, setIsNewCardOpen] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedCard, setSelectedCard] = useState<MembershipCard | null>(null);
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [showRechargeDialog, setShowRechargeDialog] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState("");

  const [newCard, setNewCard] = useState({
    cardType: "gift" as "gift" | "subscription" | "loyalty",
    initialValue: "",
    validityMonths: "12",
    quantity: "1",
    linkedName: "",
    linkType: "customer" as "customer" | "employee" | "guest",
    isDigital: true
  });

  const [templates] = useState<CardTemplate[]>([
    {
      id: "1",
      name: "بطاقة هدايا عادية",
      description: "بطاقة هدايا للاستخدام العام",
      cardType: "gift",
      defaultValue: 100,
      validityMonths: 12,
      features: ["قابلة للتحويل", "بدون رسوم إضافية"],
      active: true
    },
    {
      id: "2", 
      name: "اشتراك VIP",
      description: "اشتراك مميز مع خصومات حصرية",
      cardType: "subscription",
      defaultValue: 500,
      validityMonths: 12,
      features: ["خصم 20%", "أولوية في الحجز", "خدمات مجانية"],
      active: true
    }
  ]);

  // بيانات وهمية للبطاقات
  useEffect(() => {
    const savedCards = localStorage.getItem("membership_cards");
    if (!savedCards) {
      const sampleCards: MembershipCard[] = [
        {
          id: "1",
          cardNumber: "GC-2024-001234",
          cardType: "gift",
          status: "نشطة",
          balance: 250,
          initialValue: 500,
          issueDate: "2024-01-15",
          expiryDate: "2025-01-15",
          linkedTo: "customer1",
          linkedName: "أحمد محمد السالم",
          linkType: "customer",
          lastUsed: "2024-12-20",
          totalSpent: 250,
          recharges: 1,
          qrCode: "GC2024001234",
          isDigital: true,
          usageHistory: []
        },
        {
          id: "2",
          cardNumber: "SUB-2024-005678",
          cardType: "subscription",
          status: "نشطة",
          balance: 400,
          initialValue: 500,
          issueDate: "2024-02-10",
          expiryDate: "2025-02-10",
          linkedTo: "customer2",
          linkedName: "فاطمة علي الزهراني",
          linkType: "customer",
          lastUsed: "2024-12-18",
          totalSpent: 100,
          recharges: 0,
          qrCode: "SUB2024005678",
          isDigital: false,
          usageHistory: []
        }
      ];
      setCards(sampleCards);
      localStorage.setItem("membership_cards", JSON.stringify(sampleCards));
    } else {
      setCards(JSON.parse(savedCards));
    }
  }, []);

  useEffect(() => {
    const filtered = cards.filter(card => {
      const matchesSearch = card.cardNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           card.linkedName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === "all" || card.cardType === filterType;
      const matchesStatus = filterStatus === "all" || card.status === filterStatus;
      return matchesSearch && matchesType && matchesStatus;
    });
    setFilteredCards(filtered);
  }, [cards, searchTerm, filterType, filterStatus]);

  const getCardTypeIcon = (type: string) => {
    switch (type) {
      case "gift": return Gift;
      case "subscription": return Crown;
      case "loyalty": return Star;
      default: return CreditCard;
    }
  };

  const getCardTypeName = (type: string) => {
    switch (type) {
      case "gift": return "بطاقة هدايا";
      case "subscription": return "بطاقة اشتراك";
      case "loyalty": return "بطاقة ولاء";
      default: return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "نشطة": return "bg-green-500 text-white";
      case "منتهية": return "bg-red-500 text-white";
      case "موقوفة": return "bg-yellow-500 text-white";
      case "مجمدة": return "bg-blue-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const handleCreateCard = () => {
    const cardNumber = `${newCard.cardType.toUpperCase()}-2024-${Math.random().toString().substr(2, 6)}`;
    const newCardData: MembershipCard = {
      id: Date.now().toString(),
      cardNumber,
      cardType: newCard.cardType,
      status: "نشطة",
      balance: parseFloat(newCard.initialValue) || 0,
      initialValue: parseFloat(newCard.initialValue) || 0,
      issueDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + parseInt(newCard.validityMonths) * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      linkedTo: "new_customer",
      linkedName: newCard.linkedName || "عميل جديد",
      linkType: newCard.linkType,
      totalSpent: 0,
      recharges: 0,
      qrCode: cardNumber.replace(/-/g, ''),
      isDigital: newCard.isDigital,
      usageHistory: []
    };

    setCards(prev => [...prev, newCardData]);
    setIsNewCardOpen(false);
    toast({
      title: "تم إنشاء البطاقة بنجاح",
      description: `رقم البطاقة: ${cardNumber}`
    });
  };

  const handleRecharge = () => {
    if (!selectedCard || !rechargeAmount) return;
    
    const amount = parseFloat(rechargeAmount);
    setCards(prev => prev.map(card => 
      card.id === selectedCard.id 
        ? { ...card, balance: card.balance + amount, recharges: card.recharges + 1 }
        : card
    ));
    
    setShowRechargeDialog(false);
    setRechargeAmount("");
    toast({
      title: "تم شحن البطاقة بنجاح",
      description: `تم إضافة ${amount} جنيه إلى البطاقة`
    });
  };

  const handleToggleStatus = (card: MembershipCard) => {
    const newStatus = card.status === "نشطة" ? "مجمدة" : "نشطة";
    setCards(prev => prev.map(c => 
      c.id === card.id ? { ...c, status: newStatus } : c
    ));
    toast({
      title: `تم ${newStatus === "نشطة" ? "تفعيل" : "تجميد"} البطاقة`,
      description: `البطاقة ${card.cardNumber} الآن ${newStatus}`
    });
  };

  const metrics = {
    totalCards: cards.length,
    activeCards: cards.filter(c => c.status === "نشطة").length,
    totalBalance: cards.reduce((sum, c) => sum + c.balance, 0),
    totalSpent: cards.reduce((sum, c) => sum + c.totalSpent, 0),
    monthlyGrowth: 12.5
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                إدارة البطاقات الذكية
              </h1>
              <p className="text-gray-600 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-blue-500" />
                نظام شامل لإدارة بطاقات الاشتراك والهدايا والولاء
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Dialog open={isNewCardOpen} onOpenChange={setIsNewCardOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                    <Plus className="w-4 h-4 mr-2" />
                    بطاقة جديدة
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>إنشاء بطاقة جديدة</DialogTitle>
                    <DialogDescription>
                      إنشاء بطاقة هدايا أو اشتراك أو ولاء جديدة
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>نوع البطاقة</Label>
                        <Select value={newCard.cardType} onValueChange={(value: "gift" | "subscription" | "loyalty") => setNewCard(prev => ({ ...prev, cardType: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gift">بطاقة هدايا</SelectItem>
                            <SelectItem value="subscription">بطاقة اشتراك</SelectItem>
                            <SelectItem value="loyalty">بطاقة ولاء</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>القيمة الأولية (جنيه)</Label>
                        <Input
                          type="number"
                          value={newCard.initialValue}
                          onChange={(e) => setNewCard(prev => ({ ...prev, initialValue: e.target.value }))}
                          placeholder="100"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>اسم صاحب البطاقة</Label>
                      <Input
                        value={newCard.linkedName}
                        onChange={(e) => setNewCard(prev => ({ ...prev, linkedName: e.target.value }))}
                        placeholder="أدخل اسم العميل"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={newCard.isDigital}
                        onCheckedChange={(checked) => setNewCard(prev => ({ ...prev, isDigital: checked }))}
                      />
                      <Label>بطاقة رقمية</Label>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleCreateCard} className="flex-1">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      إنشاء البطاقة
                    </Button>
                    <Button variant="outline" onClick={() => setIsNewCardOpen(false)}>
                      إلغاء
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button variant="outline" onClick={() => setShowAnalytics(true)}>
                <BarChart3 className="w-4 h-4 mr-2" />
                التقارير
              </Button>
              
              <Button variant="outline" onClick={() => setShowTemplates(true)}>
                <Crown className="w-4 h-4 mr-2" />
                القوالب
              </Button>
            </div>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">البطاقات النشطة</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.activeCards}</div>
                <p className="text-xs text-muted-foreground">
                  من إجمالي {metrics.totalCards} بطاقة
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">إجمالي الأرصدة</CardTitle>
                <Wallet className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.totalBalance.toLocaleString()} جنيه مصري</div>
                <p className="text-xs text-muted-foreground">
                  في جميع البطاقات
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">المبلغ المستخدم</CardTitle>
                <ShoppingBag className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.totalSpent.toLocaleString()} جنيه مصري</div>
                <p className="text-xs text-muted-foreground">
                  إجمالي المبالغ المستخدمة
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-orange-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">النمو الشهري</CardTitle>
                <TrendingUp className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+{metrics.monthlyGrowth}%</div>
                <p className="text-xs text-muted-foreground">
                  مقارنة بالشهر الماضي
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>فلترة البطاقات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="البحث برقم البطاقة أو اسم العميل..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="نوع البطاقة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الأنواع</SelectItem>
                    <SelectItem value="gift">بطاقات الهدايا</SelectItem>
                    <SelectItem value="subscription">بطاقات الاشتراك</SelectItem>
                    <SelectItem value="loyalty">بطاقات الولاء</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="حالة البطاقة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الحالات</SelectItem>
                    <SelectItem value="نشطة">نشطة</SelectItem>
                    <SelectItem value="منتهية">منتهية</SelectItem>
                    <SelectItem value="موقوفة">موقوفة</SelectItem>
                    <SelectItem value="مجمدة">مجمدة</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Cards List */}
          <Card>
            <CardHeader>
              <CardTitle>قائمة البطاقات ({filteredCards.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredCards.map((card) => {
                  const CardIcon = getCardTypeIcon(card.cardType);
                  return (
                    <Card key={card.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="flex-1 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <CardIcon className="w-5 h-5 text-blue-500" />
                                <div>
                                  <div className="font-medium">{card.cardNumber}</div>
                                  <div className="text-sm text-gray-500">{card.linkedName}</div>
                                </div>
                              </div>
                              
                              <Badge className={getStatusColor(card.status)}>
                                {card.status}
                              </Badge>
                              
                              <div className="text-sm text-gray-600">
                                {getCardTypeName(card.cardType)}
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-4 gap-4 text-sm">
                              <div>
                                <div className="text-gray-500">الرصيد</div>
                                <div className="font-medium">{card.balance.toLocaleString()} جنيه مصري</div>
                              </div>
                              <div>
                                <div className="text-gray-500">المستخدم</div>
                                <div className="font-medium">{card.totalSpent.toLocaleString()} جنيه مصري</div>
                              </div>
                              <div>
                                <div className="text-gray-500">تاريخ الإصدار</div>
                                <div className="font-medium">{card.issueDate}</div>
                              </div>
                              <div>
                                <div className="text-gray-500">تاريخ الانتهاء</div>
                                <div className="font-medium">{card.expiryDate}</div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedCard(card);
                                      setShowCardDetails(true);
                                    }}
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>عرض التفاصيل</TooltipContent>
                              </Tooltip>
                              
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>تعديل</TooltipContent>
                              </Tooltip>
                              
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedCard(card);
                                      setShowRechargeDialog(true);
                                    }}
                                  >
                                    <DollarSign className="w-4 h-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>شحن البطاقة</TooltipContent>
                              </Tooltip>
                              
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <QrCode className="w-4 h-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>رمز QR</TooltipContent>
                              </Tooltip>
                              
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <Printer className="w-4 h-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>طباعة</TooltipContent>
                              </Tooltip>
                              
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <Bell className="w-4 h-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>إشعار</TooltipContent>
                              </Tooltip>
                              
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleToggleStatus(card)}
                                  >
                                    {card.status === "نشطة" ? 
                                      <Snowflake className="w-4 h-4" /> : 
                                      <Play className="w-4 h-4" />
                                    }
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {card.status === "نشطة" ? "تجميد" : "تفعيل"}
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recharge Dialog */}
          <Dialog open={showRechargeDialog} onOpenChange={setShowRechargeDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>شحن البطاقة</DialogTitle>
                <DialogDescription>
                  شحن البطاقة رقم: {selectedCard?.cardNumber}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>مبلغ الشحن (جنيه)</Label>
                  <Input
                    type="number"
                    value={rechargeAmount}
                    onChange={(e) => setRechargeAmount(e.target.value)}
                    placeholder="100"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleRecharge} className="flex-1">
                    <DollarSign className="w-4 h-4 mr-2" />
                    شحن البطاقة
                  </Button>
                  <Button variant="outline" onClick={() => setShowRechargeDialog(false)}>
                    إلغاء
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Analytics Dialog */}
          <Dialog open={showAnalytics} onOpenChange={setShowAnalytics}>
            <DialogContent className="max-w-6xl">
              <DialogHeader>
                <DialogTitle>تقارير وإحصائيات البطاقات</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">توزيع الحالات</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {["نشطة", "منتهية", "موقوفة", "مجمدة"].map(status => {
                          const count = cards.filter(c => c.status === status).length;
                          const percentage = cards.length > 0 ? (count / cards.length) * 100 : 0;
                          return (
                            <div key={status} className="space-y-1">
                              <div className="flex items-center justify-between text-sm">
                                <span>{status}</span>
                                <span>{count} ({percentage.toFixed(1)}%)</span>
                              </div>
                              <Progress value={percentage} className="h-2" />
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setShowAnalytics(false)}>
                  إغلاق
                </Button>
              </div>
            </DialogContent>
          </Dialog>

        </div>
      </div>
    </TooltipProvider>
  );
}