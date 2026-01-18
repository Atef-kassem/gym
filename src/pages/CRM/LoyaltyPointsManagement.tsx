import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useCustomerStore } from "@/hooks/useCustomerStore";
import {
  useGetLoyaltyMembersQuery,
  useCreateLoyaltyMemberMutation,
  useUpdateLoyaltyMemberMutation,
  useDeleteLoyaltyMemberMutation,
  useToggleMemberStatusMutation,
  useUpdateMemberPointsMutation,
  useGetMemberStatsQuery,
  useGetPointsTransactionsQuery,
  useCreateTransactionMutation,
  useGetLoyaltyRulesQuery,
  useCreateRuleMutation,
  useUpdateRuleMutation,
  useToggleRuleStatusMutation,
  useGetLoyaltyRewardsQuery,
  useCreateRewardMutation,
  useUpdateRewardMutation,
  useToggleRewardStatusMutation
} from "@/services/loyaltyApi";
import {
  Star,
  Plus,
  Search,
  Filter,
  Edit,
  Eye,
  Crown,
  Gift,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  BarChart3,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  Zap,
  Settings,
  Download,
  RefreshCw,
  AlertTriangle,
  Activity,
  Target,
  PieChart,
  Mail,
  Phone,
  MapPin,
  User,
  Coins,
  Trophy,
  Sparkles,
  History,
  ArrowUpDown,
  Bell,
  Calculator,
  CreditCard,
  PartyPopper,
  MessageSquare
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface LoyaltyMember {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  joinDate: string;
  totalEarned: number;
  totalSpent: number;
  currentBalance: number;
  membershipLevel: "Bronze" | "Silver" | "Gold" | "Platinum";
  lastActivity: string;
  pointsExpiring: number;
  expiryDate: string;
  status: "نشط" | "مجمد" | "منتهي";
  birthdayBonus?: boolean;
  nationalDayBonus?: boolean;
}

interface PointsTransaction {
  id: string;
  customerId: string;
  customerName: string;
  type: "earned" | "redeemed" | "expired" | "bonus";
  points: number;
  reason: string;
  date: string;
  relatedOrderId?: string;
  expiryDate?: string;
}

interface LoyaltyRule {
  id: string;
  name: string;
  description: string;
  earnRate: number; // نقاط لكل جنيه
  redeemRate: number; // جنيه لكل نقطة
  minPurchase: number;
  maxPoints: number;
  expiryMonths: number;
  active: boolean;
  levelMultiplier?: Record<string, number>;
}

interface LoyaltyReward {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  discountValue: number;
  discountType: "percentage" | "fixed";
  category: string;
  expiryDays: number;
  active: boolean;
  maxRedemptions?: number;
  currentRedemptions: number;
}

export default function LoyaltyPointsManagement() {
  const { toast } = useToast();
  const { customers, getCustomerById } = useCustomerStore();
  
  // Local state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedMember, setSelectedMember] = useState<LoyaltyMember | null>(null);
  const [editingMember, setEditingMember] = useState<LoyaltyMember | null>(null);
  const [isNewMemberOpen, setIsNewMemberOpen] = useState(false);
  const [isEditMemberOpen, setIsEditMemberOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isNewRuleOpen, setIsNewRuleOpen] = useState(false);
  const [isRewardsOpen, setIsRewardsOpen] = useState(false);
  const [isNewRewardOpen, setIsNewRewardOpen] = useState(false);
  const [isAddPointsOpen, setIsAddPointsOpen] = useState(false);
  const [isRedeemOpen, setIsRedeemOpen] = useState(false);
  const [zapierWebhook, setZapierWebhook] = useState("");
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");
  
  // API Hooks
  const { data: membersData, isLoading: membersLoading, refetch: refetchMembers } = useGetLoyaltyMembersQuery({
    search: searchTerm,
    level: filterLevel,
    status: filterStatus
  });
  const { data: transactionsData, isLoading: transactionsLoading } = useGetPointsTransactionsQuery({});
  const { data: rulesData, isLoading: rulesLoading } = useGetLoyaltyRulesQuery();
  const { data: rewardsData, isLoading: rewardsLoading } = useGetLoyaltyRewardsQuery();
  const { data: statsData, isLoading: statsLoading } = useGetMemberStatsQuery();
  
  // Mutations
  const [createMember, { isLoading: isCreatingMember }] = useCreateLoyaltyMemberMutation();
  const [updateMember, { isLoading: isUpdatingMember }] = useUpdateLoyaltyMemberMutation();
  const [deleteMember, { isLoading: isDeletingMember }] = useDeleteLoyaltyMemberMutation();
  const [toggleStatus, { isLoading: isTogglingStatus }] = useToggleMemberStatusMutation();
  const [updatePoints, { isLoading: isUpdatingPoints }] = useUpdateMemberPointsMutation();
  const [createTransaction, { isLoading: isCreatingTransaction }] = useCreateTransactionMutation();
  const [createRule, { isLoading: isCreatingRule }] = useCreateRuleMutation();
  const [updateRule, { isLoading: isUpdatingRule }] = useUpdateRuleMutation();
  const [toggleRuleStatus, { isLoading: isTogglingRuleStatus }] = useToggleRuleStatusMutation();
  const [createReward, { isLoading: isCreatingReward }] = useCreateRewardMutation();
  const [updateReward, { isLoading: isUpdatingReward }] = useUpdateRewardMutation();
  const [toggleRewardStatus, { isLoading: isTogglingRewardStatus }] = useToggleRewardStatusMutation();
  
  // Extract data from API responses
  const members = membersData?.data?.members || [];
  const transactions = transactionsData?.data?.transactions || [];
  const rules = rulesData?.data?.rules || [];
  const rewards = rewardsData?.data?.rewards || [];
  const stats = statsData?.data || {};



  const [newMember, setNewMember] = useState({
    customerId: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    initialPoints: "0"
  });

  const [pointsAction, setPointsAction] = useState({
    customerId: "",
    points: "",
    reason: "",
    type: "earned" as "earned" | "redeemed" | "bonus"
  });

  const [newRule, setNewRule] = useState({
    name: "",
    description: "",
    earnRate: "1",
    redeemRate: "0.1",
    minPurchase: "0",
    maxPoints: "1000",
    expiryMonths: "12"
  });

  const [newReward, setNewReward] = useState({
    name: "",
    description: "",
    pointsRequired: "",
    discountValue: "",
    discountType: "percentage" as "percentage" | "fixed",
    category: "",
    expiryDays: "30"
  });

  // تحميل webhook من localStorage
  useEffect(() => {
    const savedWebhook = localStorage.getItem("zapier_webhook");
    if (savedWebhook) setZapierWebhook(savedWebhook);
  }, []);

  // حفظ webhook في localStorage
  useEffect(() => {
    localStorage.setItem("zapier_webhook", zapierWebhook);
  }, [zapierWebhook]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const getMembershipLevel = (totalEarned: number): LoyaltyMember["membershipLevel"] => {
    if (totalEarned >= 2000) return "Platinum";
    if (totalEarned >= 1000) return "Gold";
    if (totalEarned >= 500) return "Silver";
    return "Bronze";
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Bronze": return "from-amber-600 to-yellow-600";
      case "Silver": return "from-gray-400 to-gray-600";
      case "Gold": return "from-yellow-400 to-yellow-600";
      case "Platinum": return "from-purple-500 to-indigo-600";
      default: return "from-gray-400 to-gray-600";
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "Bronze": return Award;
      case "Silver": return Star;
      case "Gold": return Crown;
      case "Platinum": return Trophy;
      default: return Award;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "نشط":
        return <Badge className="bg-green-500 text-white">نشط</Badge>;
      case "مجمد":
        return <Badge className="bg-yellow-500 text-white">مجمد</Badge>;
      case "منتهي":
        return <Badge variant="outline">منتهي</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleCreateRule = async () => {
    if (!newRule.name || !newRule.description) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    try {
      const ruleData = {
        name: newRule.name,
        description: newRule.description,
        earnRate: parseFloat(newRule.earnRate),
        redeemRate: parseFloat(newRule.redeemRate),
        minPurchase: parseFloat(newRule.minPurchase),
        maxPoints: parseFloat(newRule.maxPoints),
        expiryMonths: parseInt(newRule.expiryMonths),
        active: true
      };

      await createRule(ruleData).unwrap();

      setIsNewRuleOpen(false);
      setNewRule({
        name: "",
        description: "",
        earnRate: "1",
        redeemRate: "0.1",
        minPurchase: "0",
        maxPoints: "1000",
        expiryMonths: "12"
      });

      toast({
        title: "تم الإنشاء بنجاح",
        description: "تم إضافة قاعدة الولاء الجديدة",
      });
    } catch (error) {
      toast({
        title: "خطأ في الإنشاء",
        description: "حدث خطأ أثناء إنشاء قاعدة الولاء",
        variant: "destructive"
      });
    }
  };

  const handleCreateReward = async () => {
    if (!newReward.name || !newReward.description || !newReward.pointsRequired) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    try {
      const rewardData = {
        name: newReward.name,
        description: newReward.description,
        pointsRequired: parseInt(newReward.pointsRequired),
        discountValue: parseFloat(newReward.discountValue),
        discountType: newReward.discountType,
        category: newReward.category,
        expiryDays: parseInt(newReward.expiryDays),
        active: true,
        maxRedemptions: 100,
        currentRedemptions: 0
      };

      await createReward(rewardData).unwrap();

      setIsNewRewardOpen(false);
      setNewReward({
        name: "",
        description: "",
        pointsRequired: "",
        discountValue: "",
        discountType: "percentage",
        category: "",
        expiryDays: "30"
      });

      toast({
        title: "تم الإنشاء بنجاح",
        description: "تم إضافة المكافأة الجديدة",
      });
    } catch (error) {
      toast({
        title: "خطأ في الإنشاء",
        description: "حدث خطأ أثناء إنشاء المكافأة",
        variant: "destructive"
      });
    }
  };

  const handleCreateMember = async () => {
    console.log('Current newMember state:', newMember);
    
    if (!newMember.customerId) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى اختيار العميل",
        variant: "destructive"
      });
      return;
    }

    if (!newMember.customerEmail || !newMember.customerEmail.includes('@')) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى التأكد من أن البريد الإلكتروني صحيح",
        variant: "destructive"
      });
      return;
    }

    if (!newMember.customerPhone || newMember.customerPhone.trim().length < 8) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى التأكد من أن رقم الجوال صحيح",
        variant: "destructive"
      });
      return;
    }

    if (!newMember.customerName || newMember.customerName.trim().length < 2) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى التأكد من أن اسم العميل صحيح",
        variant: "destructive"
      });
      return;
    }

    try {
      const memberData = {
        customerId: newMember.customerId,
        customerName: newMember.customerName,
        customerEmail: newMember.customerEmail,
        customerPhone: newMember.customerPhone,
        initialPoints: parseFloat(newMember.initialPoints) || 0
      };

      console.log('Sending member data:', memberData);

      await createMember(memberData).unwrap();

      triggerZapierWebhook("new_loyalty_member", {
        memberName: memberData.customerName,
        email: memberData.customerEmail,
        level: "Bronze",
        initialPoints: memberData.initialPoints
      });

      setIsNewMemberOpen(false);
      setNewMember({
        customerId: "",
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        initialPoints: "0"
      });

      toast({
        title: "تم الإنشاء بنجاح",
        description: `تم إضافة العضو ${memberData.customerName} لبرنامج الولاء`,
      });
    } catch (error) {
      toast({
        title: "خطأ في الإنشاء",
        description: "حدث خطأ أثناء إنشاء العضو",
        variant: "destructive"
      });
    }
  };

  const handleAddPoints = async () => {
    console.log('handleAddPoints called with:', pointsAction);
    
    if (!pointsAction.customerId || !pointsAction.points || !pointsAction.reason) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    try {
      const points = parseFloat(pointsAction.points);
      const member = members.find(m => m.id === pointsAction.customerId);
      if (!member) {
        console.error('Member not found:', pointsAction.customerId);
        return;
      }

      console.log('Updating points for member:', member);
      console.log('Points data:', { points, type: pointsAction.type, reason: pointsAction.reason });

      // تحديث نقاط العضو
      const updateResult = await updatePoints({
        id: pointsAction.customerId,
        points: points,
        type: pointsAction.type,
        reason: pointsAction.reason
      }).unwrap();

      console.log('Update result:', updateResult);

      // إنشاء معاملة جديدة
      const transactionData = {
        customerId: pointsAction.customerId,
        customerName: member.customerName,
        type: pointsAction.type,
        points: points,
        reason: pointsAction.reason,
        date: new Date().toISOString(),
        expiryDate: pointsAction.type === "earned" ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined
      };

      console.log('Creating transaction with data:', transactionData);

      const transactionResult = await createTransaction(transactionData).unwrap();
      console.log('Transaction created:', transactionResult);

      triggerZapierWebhook("loyalty_points_updated", {
        memberName: member.customerName,
        action: pointsAction.type,
        points: points,
        reason: pointsAction.reason,
        newBalance: pointsAction.type === "redeemed" ? member.currentBalance - points : member.currentBalance + points
      });

      setIsAddPointsOpen(false);
      setPointsAction({
        customerId: "",
        points: "",
        reason: "",
        type: "earned"
      });

      toast({
        title: "تم التحديث بنجاح",
        description: `تم ${pointsAction.type === "earned" ? "إضافة" : "خصم"} ${points} نقطة للعضو ${member.customerName}`,
      });

      // تحديث البيانات
      refetchMembers();
    } catch (error) {
      console.error('Error updating points:', error);
      toast({
        title: "خطأ في التحديث",
        description: `حدث خطأ أثناء تحديث النقاط: ${(error as any)?.data?.message || (error as any)?.message || 'خطأ غير معروف'}`,
        variant: "destructive"
      });
    }
  };

  const triggerZapierWebhook = async (eventType: string, data: any) => {
    if (!zapierWebhook) return;

    try {
      await fetch(zapierWebhook, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({
          eventType,
          timestamp: new Date().toISOString(),
          ...data
        }),
      });
    } catch (error) {
      console.error("Error triggering Zapier webhook:", error);
    }
  };

  // وظائف إضافية مطلوبة
  const handleEditMember = (member: LoyaltyMember) => {
    setEditingMember(member);
    setNewMember({
      customerId: member.customerId,
      customerName: member.customerName,
      customerEmail: member.customerEmail,
      customerPhone: member.customerPhone,
      initialPoints: member.currentBalance.toString()
    });
    setIsEditMemberOpen(true);
  };

  const handleUpdateMember = async () => {
    if (!editingMember) return;
    
    try {
      await updateMember({
        id: editingMember.id,
        ...newMember
      }).unwrap();
      
      setIsEditMemberOpen(false);
      setEditingMember(null);
      setNewMember({
        customerId: "",
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        initialPoints: "0"
      });
      
      toast({
        title: "تم التحديث بنجاح",
        description: "تم تحديث بيانات العضو بنجاح"
      });
      
      refetchMembers();
    } catch (error) {
      toast({
        title: "خطأ في التحديث",
        description: "حدث خطأ أثناء تحديث بيانات العضو",
        variant: "destructive"
      });
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    try {
      await deleteMember(memberId).unwrap();
      toast({
        title: "تم الحذف",
        description: "تم حذف العضو من برنامج الولاء",
      });
    } catch (error) {
      toast({
        title: "خطأ في الحذف",
        description: "حدث خطأ أثناء حذف العضو",
        variant: "destructive"
      });
    }
  };

  const handleExportData = () => {
    // استخدام البيانات من API
    if (!members || members.length === 0) {
      toast({
        title: "لا توجد بيانات",
        description: "لا توجد بيانات للتصدير",
        variant: "destructive"
      });
      return;
    }
    
    const csvData = members.map((member: any) => ({
      اسم_العضو: member.customerName,
      البريد_الإلكتروني: member.customerEmail,
      الجوال: member.customerPhone,
      المستوى: member.membershipLevel,
      الرصيد_الحالي: member.currentBalance,
      إجمالي_المكتسب: member.totalEarned,
      إجمالي_المستخدم: member.totalSpent,
      تاريخ_الانضمام: member.joinDate,
      آخر_نشاط: member.lastActivity,
      الحالة: member.status
    }));
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + "اسم العضو,البريد الإلكتروني,الجوال,المستوى,الرصيد الحالي,إجمالي المكتسب,إجمالي المستخدم,تاريخ الانضمام,آخر نشاط,الحالة\n"
      + csvData.map(row => Object.values(row).join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `loyalty_members_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "تم التصدير",
      description: "تم تصدير بيانات أعضاء الولاء بنجاح",
    });
  };

  const handleExportTransactions = () => {
    if (!transactions || transactions.length === 0) {
      toast({
        title: "لا توجد بيانات",
        description: "لا توجد معاملات للتصدير",
        variant: "destructive"
      });
      return;
    }
    
    const csvData = transactions.map((transaction: any) => ({
      العضو: transaction.customerName,
      النوع: transaction.type,
      النقاط: transaction.points,
      السبب: transaction.reason,
      التاريخ: transaction.date
    }));
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + "العضو,النوع,النقاط,السبب,التاريخ\n"
      + csvData.map(row => Object.values(row).join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `loyalty_transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "تم التصدير",
      description: "تم تصدير بيانات المعاملات بنجاح",
    });
  };

  const handleExportStats = () => {
    const statsData = {
      الأعضاء_النشطين: metrics.activeMembers,
      إجمالي_النقاط: metrics.totalPoints,
      النقاط_المستردة: metrics.totalRedeemed,
      متوسط_النقاط: metrics.avgPoints,
      إجمالي_الأعضاء: members ? members.length : 0,
      تاريخ_التصدير: new Date().toLocaleDateString('ar-SA')
    };
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + "المقياس,القيمة\n"
      + Object.entries(statsData).map(([key, value]) => `${key},${value}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `loyalty_stats_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "تم التصدير",
      description: "تم تصدير الإحصائيات بنجاح",
    });
  };

  const handleToggleMemberStatus = async (memberId: string) => {
    try {
      await toggleStatus(memberId).unwrap();
      toast({
        title: "تم التحديث",
        description: "تم تغيير حالة العضو بنجاح",
      });
      refetchMembers(); // تحديث البيانات
    } catch (error) {
      toast({
        title: "خطأ في التحديث",
        description: "حدث خطأ أثناء تغيير حالة العضو",
        variant: "destructive"
      });
    }
  };





  const handleSendNotification = (memberId: string, message: string) => {
    if (!members) return;
    
    const member = members.find(m => m.id === memberId);
    if (member) {
      triggerZapierWebhook("loyalty_notification_sent", {
        memberName: member.customerName,
        message: message,
        memberLevel: member.membershipLevel
      });
      
      toast({
        title: "تم الإرسال",
        description: `تم إرسال الإشعار للعضو ${member.customerName}`,
      });
    }
  };

  const handleBulkAction = async (action: string, selectedIds: string[]) => {
    try {
      if (action === "activate") {
        // تفعيل جميع الأعضاء المحددين
        for (const id of selectedIds) {
          await toggleStatus(id).unwrap();
        }
        toast({
          title: "تم التحديث",
          description: `تم تفعيل ${selectedIds.length} عضو`,
        });
      } else if (action === "freeze") {
        // تجميد جميع الأعضاء المحددين
        for (const id of selectedIds) {
          await toggleStatus(id).unwrap();
        }
        toast({
          title: "تم التحديث",
          description: `تم تجميد ${selectedIds.length} عضو`,
        });
      }
    } catch (error) {
      toast({
        title: "خطأ في التحديث",
        description: "حدث خطأ أثناء تحديث حالة الأعضاء",
        variant: "destructive"
      });
    }
  };

  // استخدام البيانات من API
  const metrics = {
    activeMembers: stats?.activeMembers || 0,
    totalPoints: stats?.totalPoints || 0,
    totalRedeemed: stats?.totalRedeemed || 0,
    avgPoints: stats?.avgPoints || 0
  };

  // Debug logging
  console.log('API Data:', {
    membersData,
    members,
    membersLoading,
    stats,
    transactions,
    rules,
    rewards
  });

  const filteredMembers = members ? members.filter((member: LoyaltyMember) => {
    const matchesSearch = member.customerName.includes(searchTerm) ||
                         member.customerEmail.includes(searchTerm) ||
                         member.customerPhone.includes(searchTerm);
    const matchesLevel = filterLevel === "all" || member.membershipLevel === filterLevel;
    const matchesStatus = filterStatus === "all" || member.status === filterStatus;
    
    return matchesSearch && matchesLevel && matchesStatus;
  }) : [];

  // Show loading state only while data is being fetched
  if (membersLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50/30 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">جاري تحميل بيانات الولاء...</p>
          </div>
        </div>
      </div>
    );
  }





  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              إدارة نقاط الولاء الذكية
            </h1>
            <p className="text-gray-600 flex items-center gap-2">
              <Star className="w-3 h-3 text-purple-500" />
              نظام شامل لإدارة برامج الولاء ومكافآت العملاء
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportData}>
              <Download className="w-3 h-3 mr-1" />
              تصدير البيانات
            </Button>
            <Dialog open={isRulesOpen} onOpenChange={setIsRulesOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Settings className="w-3 h-3 mr-1" />
                  القواعد
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>إعدادات قواعد الولاء</DialogTitle>
                  <DialogDescription>
                    تحديد آليات كسب واستخدام النقاط
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Zapier Webhook URL</Label>
                      <Input
                        value={zapierWebhook}
                        onChange={(e) => setZapierWebhook(e.target.value)}
                        placeholder="https://hooks.zapier.com/hooks/catch/..."
                      />
                      <p className="text-xs text-muted-foreground">
                        لإرسال إشعارات آلية عند تحديث النقاط
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Button 
                        onClick={() => {
                          setIsRulesOpen(false);
                          setIsNewRuleOpen(true);
                        }}
                        className="w-full"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        إضافة قاعدة جديدة
                      </Button>
                    </div>
                  </div>
                  {Array.isArray(rules) && rules.map((rule: any) => (
                    <Card key={rule.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{rule.name}</h4>
                            <p className="text-sm text-muted-foreground">{rule.description}</p>
                            <div className="flex gap-4 text-xs text-muted-foreground mt-2">
                              <span>الكسب: {rule.earnRate} نقطة/جنيه</span>
                              <span>الاستخدام: {rule.redeemRate} جنيه/نقطة</span>
                              <span>انتهاء: {rule.expiryMonths} شهر</span>
                            </div>
                          </div>
                          <Switch checked={rule.active} />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isNewMemberOpen} onOpenChange={setIsNewMemberOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600">
                  <Plus className="w-3 h-3 mr-1" />
                  عضو جديد
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>إضافة عضو جديد لبرنامج الولاء</DialogTitle>
                  <DialogDescription>
                    قم بإدخال بيانات العميل لإضافته لبرنامج الولاء
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  {/* اختيار العميل */}
                  <div className="space-y-2">
                    <Label>اختيار العميل *</Label>
                    <div className="space-y-2">
                      <div className="relative">
                        <Search className="absolute right-3 top-3 h-3 w-3 text-muted-foreground" />
                        <Input
                          placeholder="البحث عن عميل بالاسم أو الجوال..."
                          value={customerSearchTerm}
                          onChange={(e) => setCustomerSearchTerm(e.target.value)}
                          className="pr-10"
                        />
                      </div>
                      <Select 
                        value={newMember.customerId} 
                        onValueChange={(customerId) => {
                          const customer = customers.find(c => c.id === customerId);
                          if (customer) {
                            console.log('Selected customer:', customer);
                            setNewMember(prev => ({
                              ...prev,
                              customerId: customer.id,
                              customerName: customer.name,
                              customerEmail: customer.email || `customer_${customer.id}@example.com`,
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
                  {newMember.customerId && (
                    <Card className="bg-blue-50 border-blue-200">
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2 text-blue-900">بيانات العميل المختار</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <Label className="text-blue-700">الاسم</Label>
                            <p className="font-medium">{newMember.customerName}</p>
                          </div>
                          <div>
                            <Label className="text-blue-700">البريد الإلكتروني</Label>
                            <p className="font-medium">{newMember.customerEmail}</p>
                          </div>
                          <div>
                            <Label className="text-blue-700">رقم الجوال</Label>
                            <p className="font-medium">{newMember.customerPhone}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="initialPoints">النقاط الترحيبية</Label>
                    <Input
                      id="initialPoints"
                      type="number"
                      value={newMember.initialPoints}
                      onChange={(e) => setNewMember(prev => ({ ...prev, initialPoints: e.target.value }))}
                      placeholder="100"
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleCreateMember} className="flex-1">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    إضافة العضو
                  </Button>
                  <Button variant="outline" onClick={() => setIsNewMemberOpen(false)}>
                    إلغاء
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* نافذة تعديل العضو */}
            <Dialog open={isEditMemberOpen} onOpenChange={setIsEditMemberOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>تعديل بيانات العضو</DialogTitle>
                  <DialogDescription>
                    قم بتعديل بيانات العضو في برنامج الولاء
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  {/* عرض بيانات العضو الحالية */}
                  {editingMember && (
                    <Card className="bg-blue-50 border-blue-200">
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2 text-blue-900">بيانات العضو الحالية</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <Label className="text-blue-700">الاسم</Label>
                            <p className="font-medium">{editingMember.customerName}</p>
                          </div>
                          <div>
                            <Label className="text-blue-700">البريد الإلكتروني</Label>
                            <p className="font-medium">{editingMember.customerEmail}</p>
                          </div>
                          <div>
                            <Label className="text-blue-700">رقم الجوال</Label>
                            <p className="font-medium">{editingMember.customerPhone}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* حقول التعديل */}
                  <div className="space-y-2">
                    <Label htmlFor="editCustomerName">اسم العميل</Label>
                    <Input
                      id="editCustomerName"
                      value={newMember.customerName}
                      onChange={(e) => setNewMember(prev => ({ ...prev, customerName: e.target.value }))}
                      placeholder="اسم العميل"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="editCustomerEmail">البريد الإلكتروني</Label>
                    <Input
                      id="editCustomerEmail"
                      type="email"
                      value={newMember.customerEmail}
                      onChange={(e) => setNewMember(prev => ({ ...prev, customerEmail: e.target.value }))}
                      placeholder="example@email.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="editCustomerPhone">رقم الجوال</Label>
                    <Input
                      id="editCustomerPhone"
                      value={newMember.customerPhone}
                      onChange={(e) => setNewMember(prev => ({ ...prev, customerPhone: e.target.value }))}
                      placeholder="05xxxxxxxx"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="editInitialPoints">النقاط الترحيبية</Label>
                    <Input
                      id="editInitialPoints"
                      type="number"
                      value={newMember.initialPoints}
                      onChange={(e) => setNewMember(prev => ({ ...prev, initialPoints: e.target.value }))}
                      placeholder="100"
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleUpdateMember} className="flex-1">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    تحديث البيانات
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setIsEditMemberOpen(false);
                    setEditingMember(null);
                    setNewMember({
                      customerId: "",
                      customerName: "",
                      customerEmail: "",
                      customerPhone: "",
                      initialPoints: "0"
                    });
                  }}>
                    إلغاء
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الأعضاء النشطين</CardTitle>
              <Users className="h-3 w-3 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.activeMembers}</div>
              <p className="text-xs text-muted-foreground">
                من إجمالي {members ? members.length : 0} عضو
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي النقاط</CardTitle>
              <Coins className="h-3 w-3 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalPoints.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                نقطة في النظام
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-orange-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">النقاط المستردة</CardTitle>
              <Gift className="h-3 w-3 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalRedeemed.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                نقطة تم استردادها
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">متوسط النقاط</CardTitle>
              <TrendingUp className="h-3 w-3 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.avgPoints.toFixed(0)}</div>
              <p className="text-xs text-muted-foreground">
                نقطة لكل عضو
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Export Buttons */}
        <div className="flex gap-2 justify-center">
          <Button variant="outline" onClick={handleExportData}>
            <Download className="w-4 h-4 mr-2" />
            تصدير الأعضاء
          </Button>
          <Button variant="outline" onClick={handleExportTransactions}>
            <Download className="w-4 h-4 mr-2" />
            تصدير المعاملات
          </Button>
          <Button variant="outline" onClick={handleExportStats}>
            <Download className="w-4 h-4 mr-2" />
            تصدير الإحصائيات
          </Button>
        </div>

        <Tabs defaultValue="members" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="members">الأعضاء</TabsTrigger>
            <TabsTrigger value="transactions">المعاملات</TabsTrigger>
            <TabsTrigger value="rewards">المكافآت</TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute right-3 top-3 h-3 w-3 text-muted-foreground" />
                    <Input
                      placeholder="البحث في الأعضاء..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pr-10"
                    />
                  </div>
                  
                  <Select value={filterLevel} onValueChange={setFilterLevel}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="المستوى" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border shadow-lg z-50">
                      <SelectItem value="all">جميع المستويات</SelectItem>
                      <SelectItem value="Bronze">Bronze</SelectItem>
                      <SelectItem value="Silver">Silver</SelectItem>
                      <SelectItem value="Gold">Gold</SelectItem>
                      <SelectItem value="Platinum">Platinum</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="الحالة" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border shadow-lg z-50">
                      <SelectItem value="all">جميع الحالات</SelectItem>
                      <SelectItem value="نشط">نشط</SelectItem>
                      <SelectItem value="مجمد">مجمد</SelectItem>
                      <SelectItem value="منتهي">منتهي</SelectItem>
                    </SelectContent>
                  </Select>

                  <Dialog open={isAddPointsOpen} onOpenChange={setIsAddPointsOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Plus className="w-3 h-3 mr-1" />
                        إدارة النقاط
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>إدارة نقاط العضو</DialogTitle>
                        <DialogDescription>
                          إضافة أو خصم نقاط من رصيد العضو
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>العضو</Label>
                          <div className="space-y-2">
                            <div className="relative">
                              <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="البحث عن عميل..."
                                value={customerSearchTerm}
                                onChange={(e) => setCustomerSearchTerm(e.target.value)}
                                className="pr-10"
                              />
                            </div>
                            <Select 
                              value={pointsAction.customerId} 
                              onValueChange={(customerId) => {
                                const customer = customers.find(c => c.id === customerId);
                                if (customer) {
                                  setPointsAction(prev => ({ ...prev, customerId }));
                                }
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="اختر عميل" />
                              </SelectTrigger>
                              <SelectContent className="bg-white border shadow-lg z-50 max-h-60">
                                {customers
                                  .filter(customer => 
                                    customerSearchTerm === "" ||
                                    customer.name.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
                                    customer.phone.includes(customerSearchTerm)
                                  )
                                                                      .map(customer => {
                                      if (!members) return null;
                                     
     const member = members.find((m: any) => m.customerId === customer.id);
                                    return (
                                      <SelectItem key={customer.id} value={customer.id}>
                                        <div className="flex items-center gap-2">
                                          <User className="w-4 h-4" />
                                          <div>
                                            <div className="font-medium">{customer.name}</div>
                                            <div className="text-xs text-muted-foreground">
                                              {customer.phone} • {member ? `${member.currentBalance} نقطة` : 'غير مسجل'}
                                            </div>
                                          </div>
                                        </div>
                                      </SelectItem>
                                    );
                                  })}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>نوع العملية</Label>
                          <Select value={pointsAction.type} onValueChange={(value: "earned" | "redeemed" | "bonus") => setPointsAction(prev => ({ ...prev, type: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-white border shadow-lg z-50">
                              <SelectItem value="earned">كسب نقاط</SelectItem>
                              <SelectItem value="redeemed">استرداد نقاط</SelectItem>
                              <SelectItem value="bonus">نقاط إضافية</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>عدد النقاط</Label>
                          <Input
                            type="number"
                            value={pointsAction.points}
                            onChange={(e) => setPointsAction(prev => ({ ...prev, points: e.target.value }))}
                            placeholder="100"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>السبب</Label>
                          <Input
                            value={pointsAction.reason}
                            onChange={(e) => setPointsAction(prev => ({ ...prev, reason: e.target.value }))}
                            placeholder="شراء بقيمة 500 جنيه"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 pt-4">
                        <Button onClick={handleAddPoints} className="flex-1">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          تطبيق
                        </Button>
                        <Button variant="outline" onClick={() => setIsAddPointsOpen(false)}>
                          إلغاء
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            {/* Members List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-purple-500" />
                  أعضاء برنامج الولاء
                </CardTitle>
                <CardDescription>
                  {filteredMembers.length} عضو من أصل {members ? members.length : 0}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {membersLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-2 text-muted-foreground">جاري تحميل الأعضاء...</p>
                  </div>
                ) : filteredMembers && filteredMembers.length > 0 ? (
                  <div className="space-y-4">
                    {filteredMembers.map((member: any) => {
                      const LevelIcon = getLevelIcon(member.membershipLevel);
                      return (
                        <Card key={member.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                              {/* معلومات العضو */}
                              <div className="flex-1 flex items-center justify-between gap-4">
                                {/* اسم العضو ومعلومات الاتصال */}
                                <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 bg-gradient-to-r ${getLevelColor(member.membershipLevel)} rounded-lg flex items-center justify-center text-white flex-shrink-0`}>
                                    {(() => {
                                      const LevelIcon = getLevelIcon(member.membershipLevel);
                                      return <LevelIcon className="w-5 h-5" />;
                                    })()}
                                  </div>
                                  <div className="min-w-0">
                                    <h4 className="font-semibold text-sm">{member.customerName}</h4>
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                      <span className="flex items-center gap-1">
                                        <Mail className="w-3 h-3" />
                                        {member.customerEmail}
                                      </span>
                                      {member.customerPhone && (
                                        <span className="flex items-center gap-1">
                                          <Phone className="w-3 h-3" />
                                          {member.customerPhone}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* إحصائيات النقاط */}
                                <div className="grid grid-cols-4 gap-4 text-center text-xs">
                                  <div>
                                    <p className="text-muted-foreground">الرصيد الحالي</p>
                                    <p className="font-semibold text-green-600">{member.currentBalance.toLocaleString()}</p>
                                    <p className="text-xs text-muted-foreground">نقطة</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">إجمالي المكتسب</p>
                                    <p className="font-semibold">{member.totalEarned.toLocaleString()}</p>
                                    <p className="text-xs text-muted-foreground">نقطة</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">إجمالي المستخدم</p>
                                    <p className="font-semibold">{member.totalSpent.toLocaleString()}</p>
                                    <p className="text-xs text-muted-foreground">نقطة</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">تاريخ الانضمام</p>
                                    <p className="font-semibold">{new Date(member.joinDate).toLocaleDateString('ar-SA')}</p>
                                  </div>
                                </div>

                                {/* الحالة والمستوى */}
                                <div className="flex flex-col items-end gap-2">
                                  <div className="flex items-center gap-2">
                                    {getStatusBadge(member.status)}
                                    <Badge className={`bg-gradient-to-r ${getLevelColor(member.membershipLevel)} text-white text-xs`}>
                                      {member.membershipLevel}
                                    </Badge>
                                    {member.birthdayBonus && (
                                      <Badge variant="outline" className="text-pink-600 text-xs">
                                        <PartyPopper className="w-3 h-3 mr-1" />
                                        عيد ميلاد
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* قسم الأيقونات */}
                              <div className="flex items-center gap-1">
                                <TooltipProvider>
                                  <div className="flex items-center gap-1">
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button 
                                          size="sm"
                                          variant="ghost"
                                          className="h-8 w-8 p-0 hover:bg-gray-100" 
                                          onClick={() => setSelectedMember(member)}
                                        >
                                          <Eye className="w-4 h-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>عرض التفاصيل</p>
                                      </TooltipContent>
                                    </Tooltip>
                                    
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button 
                                          size="sm"
                                          variant="ghost"
                                          className="h-8 w-8 p-0 hover:bg-gray-100"
                                          onClick={() => handleEditMember(member)}
                                        >
                                          <Edit className="w-4 h-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>تعديل العضو</p>
                                      </TooltipContent>
                                    </Tooltip>

                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button 
                                          size="sm"
                                          variant="ghost"
                                          className="h-8 w-8 p-0 hover:bg-gray-100"
                                          onClick={() => {
                                            setPointsAction({
                                              customerId: member.id,
                                              points: "",
                                              reason: "",
                                              type: "earned"
                                            });
                                            setIsAddPointsOpen(true);
                                          }}
                                        >
                                          <Coins className="w-4 h-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>إضافة نقاط</p>
                                      </TooltipContent>
                                    </Tooltip>

                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button 
                                          size="sm"
                                          variant="ghost"
                                          className="h-8 w-8 p-0 hover:bg-gray-100"
                                          onClick={() => {
                                            setPointsAction({
                                              customerId: member.id,
                                              points: "",
                                              reason: "",
                                              type: "redeemed"
                                            });
                                            setIsRedeemOpen(true);
                                          }}
                                        >
                                          <Gift className="w-4 h-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>استخدام نقاط</p>
                                      </TooltipContent>
                                    </Tooltip>

                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button 
                                          size="sm"
                                          variant="ghost"
                                          className="h-8 w-8 p-0 hover:bg-gray-100"
                                          onClick={() => handleSendNotification(member.id, "إشعار خاص ببرنامج الولاء")}
                                        >
                                          <Bell className="w-4 h-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>إرسال إشعار</p>
                                      </TooltipContent>
                                    </Tooltip>

                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button 
                                          size="sm"
                                          variant="ghost"
                                          className={`h-8 w-8 p-0 ${member.status === "نشط" ? "hover:bg-red-100" : "hover:bg-green-100"}`}
                                          onClick={() => handleToggleMemberStatus(member.id)}
                                        >
                                          {member.status === "نشط" ? (
                                            <XCircle className="w-4 h-4 text-red-500" />
                                          ) : (
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                          )}
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>{member.status === "نشط" ? "تجميد العضو" : "تفعيل العضو"}</p>
                                      </TooltipContent>
                                    </Tooltip>

                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button 
                                          size="sm"
                                          variant="ghost"
                                          className="h-8 w-8 p-0 hover:bg-red-100"
                                          onClick={() => handleDeleteMember(member.id)}
                                        >
                                          <XCircle className="w-4 h-4 text-red-500" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>حذف العضو</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </div>
                                </TooltipProvider>
                              </div>
                            </div>

                            {/* تحذير النقاط المنتهية الصلاحية */}
                            {member.pointsExpiring > 0 && (
                              <div className="flex items-center gap-2 mt-3 p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                                <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                                <span className="text-sm text-yellow-800">
                                  {member.pointsExpiring} نقطة ستنتهي في {new Date(member.expiryDate).toLocaleDateString('ar-SA')}
                                </span>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}

                    {filteredMembers.length === 0 && searchTerm && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p>لا توجد نتائج للبحث</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>لا توجد أعضاء في برنامج الولاء</p>
                    <p className="text-sm mt-2">ابدأ بإضافة عضو جديد</p>
                  </div>
                )}
                </CardContent>
              </Card>
            </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <History className="w-5 h-5 text-blue-500" />
                    سجل معاملات النقاط
                  </CardTitle>
                  <Button variant="outline" onClick={handleExportTransactions}>
                    <Download className="w-4 h-4 mr-2" />
                    تصدير المعاملات
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>العضو</TableHead>
                      <TableHead>النوع</TableHead>
                      <TableHead>النقاط</TableHead>
                      <TableHead>السبب</TableHead>
                      <TableHead>التاريخ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.isArray(transactions) && transactions.slice(0, 10).map((transaction: PointsTransaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.customerName}</TableCell>
                        <TableCell>
                          <Badge className={
                            transaction.type === "earned" ? "bg-green-500 text-white" :
                            transaction.type === "redeemed" ? "bg-red-500 text-white" :
                            transaction.type === "bonus" ? "bg-blue-500 text-white" :
                            "bg-gray-500 text-white"
                          }>
                            {transaction.type === "earned" ? "كسب" :
                             transaction.type === "redeemed" ? "استرداد" :
                             transaction.type === "bonus" ? "مكافأة" : "منتهي"}
                          </Badge>
                        </TableCell>
                        <TableCell className={transaction.type === "redeemed" ? "text-red-600" : "text-green-600"}>
                          {transaction.type === "redeemed" ? "-" : "+"}{transaction.points.toLocaleString()}
                        </TableCell>
                        <TableCell>{transaction.reason}</TableCell>
                        <TableCell>{new Date(transaction.date).toLocaleDateString('ar-SA')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rewards" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Gift className="w-5 h-5 text-purple-500" />
                      كتالوج المكافآت
                    </CardTitle>
                    <CardDescription>
                      المكافآت المتاحة للاسترداد بالنقاط
                    </CardDescription>
                  </div>
                  <Button onClick={() => setIsNewRewardOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    مكافأة جديدة
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      name: "خصم 10%",
                      description: "خصم 10% على الخدمة التالية",
                      points: 100,
                      category: "خصومات",
                      color: "from-green-500 to-emerald-500"
                    },
                    {
                      name: "غسلة مجانية",
                      description: "غسلة أساسية مجانية",
                      points: 250,
                      category: "خدمات",
                      color: "from-blue-500 to-cyan-500"
                    },
                    {
                      name: "تلميع مجاني",
                      description: "خدمة تلميع مجانية",
                      points: 400,
                      category: "خدمات",
                      color: "from-purple-500 to-indigo-500"
                    }
                  ].map((reward, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className={`w-12 h-12 bg-gradient-to-r ${reward.color} rounded-lg flex items-center justify-center text-white mb-4`}>
                          <Gift className="w-6 h-6" />
                        </div>
                        <h4 className="font-semibold mb-2">{reward.name}</h4>
                        <p className="text-sm text-muted-foreground mb-4">{reward.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Coins className="w-4 h-4 text-purple-500" />
                            <span className="font-bold text-purple-600">{reward.points} نقطة</span>
                          </div>
                          <Badge variant="outline">{reward.category}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Member Details Dialog */}
        <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>تفاصيل عضوية الولاء</DialogTitle>
              <DialogDescription>
                معلومات شاملة عن العضو وحركة النقاط
              </DialogDescription>
            </DialogHeader>
            
            {selectedMember && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">معلومات العضو</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span>{selectedMember.customerName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span>{selectedMember.customerEmail}</span>
                      </div>
                      {selectedMember.customerPhone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span>{selectedMember.customerPhone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>عضو منذ {new Date(selectedMember.joinDate).toLocaleDateString('ar-SA')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">إحصائيات النقاط</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">الرصيد الحالي:</span>
                        <span className="font-bold text-green-600">{selectedMember.currentBalance.toLocaleString()} نقطة</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">إجمالي المكتسب:</span>
                        <span className="font-medium">{selectedMember.totalEarned.toLocaleString()} نقطة</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">إجمالي المستخدم:</span>
                        <span className="font-medium">{selectedMember.totalSpent.toLocaleString()} نقطة</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">المستوى:</span>
                        <Badge className={`bg-gradient-to-r ${getLevelColor(selectedMember.membershipLevel)} text-white`}>
                          {selectedMember.membershipLevel}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">آخر المعاملات</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {Array.isArray(transactions) && transactions
                      .filter((t: PointsTransaction) => t.customerId === selectedMember.id)
                      .slice(0, 5)
                      .map((transaction: PointsTransaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-2 border rounded">
                          <div>
                            <span className="text-sm font-medium">{transaction.reason}</span>
                            <p className="text-xs text-muted-foreground">
                              {new Date(transaction.date).toLocaleDateString('ar-SA')}
                            </p>
                          </div>
                          <span className={`font-medium ${transaction.type === "redeemed" ? "text-red-600" : "text-green-600"}`}>
                            {transaction.type === "redeemed" ? "-" : "+"}{transaction.points}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => selectedMember && handleEditMember(selectedMember)}
              >
                <Edit className="w-4 h-4 mr-2" />
                تعديل
              </Button>
              <Button 
                variant="outline" 
                onClick={() => selectedMember && handleSendNotification(selectedMember.id, "إشعار خاص بالنقاط")}
              >
                <Bell className="w-4 h-4 mr-2" />
                إرسال إشعار
              </Button>
              <Button variant="outline" onClick={() => setSelectedMember(null)}>
                إغلاق
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}