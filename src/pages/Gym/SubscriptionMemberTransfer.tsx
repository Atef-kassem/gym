import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useGetAllMembersQuery } from "@/services/membersApi";
import { 
  useGetAllSubscriptionsQuery, 
  useUpdateSubscriptionMutation,
  useGetAllSubscriptionTransfersQuery,
  useCreateSubscriptionTransferMutation,
} from "@/services/subscriptionsApi";
import { RefreshCw, User, ArrowRightLeft, CheckCircle2, History, Calendar, Search } from "lucide-react";

const SubscriptionMemberTransfer = () => {
  const { toast } = useToast();
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<string>("");
  const [targetMemberId, setTargetMemberId] = useState<string>("");
  const [activeTab, setActiveTab] = useState("transfer");
  const [transferSearchTerm, setTransferSearchTerm] = useState("");

  const { data: subscriptionsData, refetch: refetchSubscriptions, isLoading: subsLoading } = useGetAllSubscriptionsQuery({}) as any;
  const { data: membersData, isLoading: membersLoading, refetch: refetchMembers } = useGetAllMembersQuery({} as any);
  const { data: transfersData, refetch: refetchTransfers, isLoading: transfersLoading } = useGetAllSubscriptionTransfersQuery({}) as any;
  const [updateSubscription, { isLoading: isTransferring }] = useUpdateSubscriptionMutation();
  const [createTransfer, { isLoading: isCreatingTransfer }] = useCreateSubscriptionTransferMutation();

  const subscriptions = useMemo(() => {
    if (Array.isArray(subscriptionsData?.data)) return subscriptionsData.data;
    if (Array.isArray(subscriptionsData)) return subscriptionsData;
    return [];
  }, [subscriptionsData]);

  const members = useMemo(() => {
    if (Array.isArray(membersData?.data)) return membersData.data;
    if (Array.isArray(membersData)) return membersData;
    return [];
  }, [membersData]);

  const selectedSubscription = useMemo(
    () => subscriptions.find((s: any) => s.id === (selectedSubscriptionId ? parseInt(selectedSubscriptionId, 10) : undefined)),
    [subscriptions, selectedSubscriptionId]
  );

  const targetMember = useMemo(
    () => members.find((m: any) => m.id === (targetMemberId ? parseInt(targetMemberId, 10) : undefined)),
    [members, targetMemberId]
  );

  const transfers = useMemo(() => {
    if (!transfersData) return [];
    if (Array.isArray(transfersData?.data)) return transfersData.data;
    if (Array.isArray(transfersData)) return transfersData;
    return [];
  }, [transfersData]);

  const filteredTransfers = useMemo(() => {
    if (!transferSearchTerm.trim()) return transfers;
    
    const searchLower = transferSearchTerm.toLowerCase();
    return transfers.filter((transfer: any) =>
      transfer.customerName?.toLowerCase().includes(searchLower) ||
      transfer.fromSubscriptionType?.toLowerCase().includes(searchLower) ||
      transfer.toSubscriptionType?.toLowerCase().includes(searchLower) ||
      transfer.subscription?.subscriptionNumber?.toLowerCase().includes(searchLower) ||
      transfer.member?.memberCode?.toLowerCase().includes(searchLower)
    );
  }, [transfers, transferSearchTerm]);

  const handleTransfer = async () => {
    if (!selectedSubscription || !targetMember) {
      toast({
        title: "تنبيه",
        description: "اختر الاشتراك والعضو المستهدف أولاً",
        variant: "destructive",
      });
      return;
    }

    try {
      // تحديث الاشتراك
      const payload = {
        registrationDate: selectedSubscription.registrationDate || "",
        branchId: selectedSubscription.branchId || "",
        customerName: targetMember.name,
        memberId: targetMember.id,
        subscriptionType: selectedSubscription.subscriptionType || "",
        subscriptionStartDate: selectedSubscription.subscriptionStartDate || "",
        subscriptionEndDate: selectedSubscription.subscriptionEndDate || "",
        subscriptionValue: selectedSubscription.subscriptionValue || "",
        discountEnabled: selectedSubscription.discountEnabled || false,
        discountValue: selectedSubscription.discountValue || "0",
        gender: selectedSubscription.gender || "",
        employeeId: selectedSubscription.employeeId || null,
        paymentMethod: selectedSubscription.paymentMethod || "",
        paidAmount: selectedSubscription.paidAmount || "0",
        remainingAmount: selectedSubscription.remainingAmount || "0",
        receiptNumber: selectedSubscription.receiptNumber || "",
      };

      await updateSubscription({ id: selectedSubscription.id, data: payload }).unwrap();

      // إنشاء سجل التحويل
      try {
        await createTransfer({
          subscriptionId: selectedSubscription.id,
          memberId: targetMember.id,
          customerName: targetMember.name,
          fromSubscriptionType: selectedSubscription.subscriptionType || "",
          toSubscriptionType: selectedSubscription.subscriptionType || "",
          fromStartDate: selectedSubscription.subscriptionStartDate || "",
          fromEndDate: selectedSubscription.subscriptionEndDate || "",
          toStartDate: selectedSubscription.subscriptionStartDate || "",
          toEndDate: selectedSubscription.subscriptionEndDate || "",
          fromValue: selectedSubscription.subscriptionValue || 0,
          toValue: selectedSubscription.subscriptionValue || 0,
          branchId: selectedSubscription.branchId || "",
          reason: `تم نقل الاشتراك من ${selectedSubscription.customerName || selectedSubscription.member?.name || "عضو غير معروف"} إلى ${targetMember.name}`,
        }).unwrap();
      } catch (transferError: any) {
        console.error("خطأ في إنشاء سجل التحويل:", transferError);
        // لا نوقف العملية إذا فشل إنشاء السجل
      }

      toast({
        title: "تم التحويل",
        description: `تم نقل الاشتراك إلى ${targetMember.name}`,
      });

      setSelectedSubscriptionId("");
      setTargetMemberId("");
      refetchSubscriptions();
      refetchMembers();
      refetchTransfers();
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error?.data?.message || "تعذر تنفيذ التحويل",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <ArrowRightLeft className="w-7 h-7 text-blue-600" />
              تحويل الاشتراكات بين الأعضاء
            </h1>
            <p className="text-gray-600 mt-1">نقل اشتراك عضو إلى عضو آخر مع الحفاظ على تفاصيل الاشتراك</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => { refetchSubscriptions(); refetchMembers(); refetchTransfers(); }}>
              <RefreshCw className="w-4 h-4 ml-2" />
              تحديث البيانات
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="transfer">تنفيذ التحويل</TabsTrigger>
            <TabsTrigger value="history">سجل التحويلات</TabsTrigger>
          </TabsList>

          <TabsContent value="transfer" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>اختيار الاشتراك والعضو المستهدف</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>الاشتراك الحالي</Label>
                <Select
                  value={selectedSubscriptionId}
                  onValueChange={setSelectedSubscriptionId}
                  disabled={subsLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={subsLoading ? "جاري التحميل..." : "اختر الاشتراك"} />
                  </SelectTrigger>
                  <SelectContent>
                    {subscriptions.map((sub: any) => (
                      <SelectItem key={sub.id} value={sub.id.toString()}>
                        {sub.subscriptionNumber || sub.id} - {sub.customerName} ({sub.member?.memberCode || sub.memberCode || "بدون كود"})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedSubscription && (
                  <div className="mt-2 p-3 rounded border bg-slate-50 text-sm space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge>{selectedSubscription.subscriptionType || "غير محدد"}</Badge>
                      <span className="text-gray-700">{selectedSubscription.customerName}</span>
                    </div>
                    <div className="text-gray-600 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>العضو الحالي: {selectedSubscription.member?.name || selectedSubscription.customerName || "غير معروف"}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>العضو المستهدف</Label>
                <Select
                  value={targetMemberId}
                  onValueChange={setTargetMemberId}
                  disabled={membersLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={membersLoading ? "جاري التحميل..." : "اختر العضو المستهدف"} />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((member: any) => (
                      <SelectItem key={member.id} value={member.id.toString()}>
                        {member.name} {member.memberCode ? `(${member.memberCode})` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {targetMember && (
                  <div className="mt-2 p-3 rounded border bg-emerald-50 text-sm space-y-1">
                    <div className="flex items-center gap-2 text-emerald-700">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{targetMember.name}</span>
                    </div>
                    <div className="text-gray-700">{targetMember.memberCode ? `الكود: ${targetMember.memberCode}` : "لا يوجد كود"}</div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleTransfer}
                disabled={!selectedSubscription || !targetMember || isTransferring}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <ArrowRightLeft className="w-4 h-4 ml-2" />
                {isTransferring ? "جاري التحويل..." : "تنفيذ التحويل"}
              </Button>
            </div>
          </CardContent>
        </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <History className="w-5 h-5" />
                    سجل التحويلات
                  </CardTitle>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="البحث في التحويلات..."
                        value={transferSearchTerm}
                        onChange={(e) => setTransferSearchTerm(e.target.value)}
                        className="pr-10 w-64"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {transfersLoading ? (
                  <div className="text-center py-12">
                    <RefreshCw className="h-8 w-8 mx-auto animate-spin text-blue-500 mb-4" />
                    <p className="text-gray-600">جاري تحميل سجل التحويلات...</p>
                  </div>
                ) : filteredTransfers.length === 0 ? (
                  <div className="text-center py-12">
                    <History className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-bold text-gray-600 mb-2">
                      {transferSearchTerm ? "لا توجد نتائج للبحث" : "لا توجد تحويلات مسجلة"}
                    </h3>
                    <p className="text-gray-500">
                      {transferSearchTerm ? "جرب البحث بكلمات أخرى" : "لم يتم تسجيل أي تحويلات بعد"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredTransfers.map((transfer: any) => (
                      <Card key={transfer.id} className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <Label className="text-xs text-gray-500">رقم الاشتراك</Label>
                              <p className="font-semibold">
                                {transfer.subscription?.subscriptionNumber || transfer.subscriptionId || "غير متاح"}
                              </p>
                            </div>
                            <div>
                              <Label className="text-xs text-gray-500">اسم العميل</Label>
                              <p className="font-semibold">{transfer.customerName || "غير معروف"}</p>
                            </div>
                            <div>
                              <Label className="text-xs text-gray-500">تاريخ التحويل</Label>
                              <p className="font-semibold flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                {transfer.transferDate ? new Date(transfer.transferDate).toLocaleDateString('ar-SA') : "غير محدد"}
                              </p>
                            </div>
                            <div>
                              <Label className="text-xs text-gray-500">نوع الاشتراك السابق</Label>
                              <Badge variant="outline" className="mt-1">
                                {transfer.fromSubscriptionType || "غير محدد"}
                              </Badge>
                            </div>
                            <div>
                              <Label className="text-xs text-gray-500">نوع الاشتراك الجديد</Label>
                              <Badge className="mt-1 bg-blue-100 text-blue-800">
                                {transfer.toSubscriptionType || "غير محدد"}
                              </Badge>
                            </div>
                            <div>
                              <Label className="text-xs text-gray-500">الفرع</Label>
                              <p className="text-sm mt-1">
                                {transfer.branch?.arabicName || transfer.branch?.englishName || "غير محدد"}
                              </p>
                            </div>
                          </div>
                          {transfer.reason && (
                            <div className="mt-3 pt-3 border-t">
                              <Label className="text-xs text-gray-500">سبب التحويل</Label>
                              <p className="text-sm text-gray-700 mt-1">{transfer.reason}</p>
                            </div>
                          )}
                          {transfer.member && (
                            <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                              <User className="w-4 h-4" />
                              <span>العضو: {transfer.member.name} {transfer.member.memberCode ? `(${transfer.member.memberCode})` : ""}</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SubscriptionMemberTransfer;

