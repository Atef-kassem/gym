import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  useGetAllTransfersQuery, 
  useCreateTransferMutation,
  useGetMemberSubscriptionHistoryQuery,
} from "@/services/subscriptionTransfersApi";
import { useGetAllSubscriptionsQuery, useGetSubscriptionTypesQuery } from "@/services/subscriptionsApi";
import {
  ArrowRightLeft, Plus, Search, Calendar, User, FileText, Eye,
  TrendingUp, RefreshCw, Filter
} from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface SubscriptionTransfer {
  id: number;
  subscriptionId: number;
  memberId?: number;
  customerName: string;
  fromSubscriptionType: string;
  toSubscriptionType: string;
  fromStartDate: string;
  fromEndDate: string;
  toStartDate: string;
  toEndDate: string;
  fromValue: number;
  toValue: number;
  transferDate: string;
  reason?: string;
  subscription?: {
    id: number;
    subscriptionNumber: string;
  };
  branch?: {
    id: number;
    arabicName: string;
  };
  member?: {
    id: number;
    name: string;
    memberCode: string;
  };
  creator?: {
    id: number;
    arabicName?: string;
    englinshName?: string;
  };
}

export default function SubscriptionTransfers() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [branchId, setBranchId] = useState<string>("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<number | null>(null);

  const [transferForm, setTransferForm] = useState({
    subscriptionId: "",
    toSubscriptionTypeId: "",
    toSubscriptionType: "",
    toStartDate: "",
    toEndDate: "",
    toValue: "",
    transferDate: new Date().toISOString().split('T')[0],
    reason: "",
  });

  const { 
    data: transfersData, 
    isLoading: transfersLoading, 
    error: transfersError,
    refetch 
  } = useGetAllTransfersQuery({
    search: searchTerm,
    branchId: branchId || undefined,
  });

  const { data: subscriptionsData } = useGetAllSubscriptionsQuery({});
  const { data: subscriptionTypesData } = useGetSubscriptionTypesQuery({});

  const { data: memberHistoryData } = useGetMemberSubscriptionHistoryQuery(
    selectedMemberId!,
    { skip: !selectedMemberId }
  );

  const [createTransfer, { isLoading: isCreating }] = useCreateTransferMutation();

  // البيانات الآن تأتي مباشرة بعد transformResponse
  const transfers: SubscriptionTransfer[] = Array.isArray(transfersData) ? transfersData : (transfersData?.data || []);
  const subscriptions = Array.isArray(subscriptionsData) ? subscriptionsData : (subscriptionsData?.data || []);
  const subscriptionTypes = Array.isArray(subscriptionTypesData) ? subscriptionTypesData : (subscriptionTypesData?.data || []);

  // Debug: Log data for troubleshooting
  useEffect(() => {
    console.log('📊 SubscriptionTransfers - Component Data:', {
      transfersData,
      transfersDataType: typeof transfersData,
      isTransfersDataArray: Array.isArray(transfersData),
      transfers,
      transfersCount: transfers.length,
      transfersLoading,
      transfersError,
      subscriptionsData,
      subscriptions,
      subscriptionTypesData,
      subscriptionTypes
    });
    
    if (transfersError) {
      console.error('❌ SubscriptionTransfers Error:', transfersError);
    }
  }, [transfersData, transfers, transfersLoading, transfersError, subscriptionsData, subscriptions, subscriptionTypesData, subscriptionTypes]);

  const handleCreateTransfer = async () => {
    if (!transferForm.subscriptionId || !transferForm.toSubscriptionType || 
        !transferForm.toStartDate || !transferForm.toEndDate || !transferForm.toValue) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    try {
      await createTransfer({
        subscriptionId: parseInt(transferForm.subscriptionId),
        toSubscriptionType: transferForm.toSubscriptionType,
        toStartDate: transferForm.toStartDate,
        toEndDate: transferForm.toEndDate,
        toValue: parseFloat(transferForm.toValue),
        transferDate: transferForm.transferDate,
        reason: transferForm.reason || undefined,
      }).unwrap();

      toast({
        title: "نجح",
        description: "تم إنشاء تحويل الاشتراك بنجاح",
      });

      setIsCreateDialogOpen(false);
      setTransferForm({
        subscriptionId: "",
        toSubscriptionTypeId: "",
        toSubscriptionType: "",
        toStartDate: "",
        toEndDate: "",
        toValue: "",
        transferDate: new Date().toISOString().split('T')[0],
        reason: "",
      });
      refetch();
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error?.data?.message || "فشل في إنشاء تحويل الاشتراك",
        variant: "destructive",
      });
    }
  };

  const handleSubscriptionSelect = (subscriptionId: string) => {
    const subscription = subscriptions.find((s: any) => s.id === parseInt(subscriptionId));
    if (subscription) {
      setTransferForm(prev => ({
        ...prev,
        subscriptionId,
        toStartDate: subscription.subscriptionStartDate,
        toEndDate: subscription.subscriptionEndDate,
      }));
      setSelectedMemberId(subscription.memberId || null);
    }
  };

  const handleSubscriptionTypeSelect = (subscriptionTypeId: string) => {
    const subscriptionType = subscriptionTypes.find((st: any) => st.id === parseInt(subscriptionTypeId));
    if (subscriptionType) {
      // حساب تاريخ النهاية بناءً على المدة
      const startDate = transferForm.toStartDate || new Date().toISOString().split('T')[0];
      const start = new Date(startDate);
      let endDate = new Date(start);
      
      // حساب المدة بناءً على نوع الاشتراك
      const duration = subscriptionType.duration || subscriptionType.durationInDays || 30;
      endDate.setDate(start.getDate() + duration);
      
      const typeName = subscriptionType.name || subscriptionType.arabicName || subscriptionType.typeName || subscriptionType.subscriptionType;
      const price = subscriptionType.price || subscriptionType.subscriptionValue || subscriptionType.value || 0;
      
      setTransferForm(prev => ({
        ...prev,
        toSubscriptionTypeId: subscriptionTypeId,
        toSubscriptionType: typeName,
        toValue: price.toString(),
        toEndDate: endDate.toISOString().split('T')[0],
      }));
    }
  };

  const filteredTransfers = transfers.filter((transfer) => {
    if (!searchTerm) return true; // إذا لم يكن هناك بحث، اعرض كل شيء
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      (transfer.customerName || "").toLowerCase().includes(searchLower) ||
      (transfer.fromSubscriptionType || "").toLowerCase().includes(searchLower) ||
      (transfer.toSubscriptionType || "").toLowerCase().includes(searchLower);
    return matchesSearch;
  });

  console.log('🔍 Filtered Transfers:', {
    totalTransfers: transfers.length,
    filteredCount: filteredTransfers.length,
    searchTerm
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <ArrowRightLeft className="w-8 h-8 text-blue-600" />
              تحويلات الاشتراكات
            </h1>
            <p className="text-gray-600 mt-2">
              إدارة وتحويل الاشتراكات بين الأنواع المختلفة
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              تحديث
            </Button>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  تحويل اشتراك جديد
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>تحويل اشتراك</DialogTitle>
                  <DialogDescription>
                    اختر الاشتراك المراد تحويله وأدخل بيانات الاشتراك الجديد
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>الاشتراك الحالي</Label>
                    <Select
                      value={transferForm.subscriptionId}
                      onValueChange={handleSubscriptionSelect}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الاشتراك" />
                      </SelectTrigger>
                      <SelectContent>
                        {subscriptions.map((sub: any) => (
                          <SelectItem key={sub.id} value={sub.id.toString()}>
                            {sub.subscriptionNumber} - {sub.customerName} ({sub.subscriptionType})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedMemberId && memberHistoryData && (
                    <Card className="p-4 bg-blue-50">
                      <CardHeader className="p-0 pb-2">
                        <CardTitle className="text-sm">سجل الاشتراكات</CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="space-y-2 text-sm">
                          {memberHistoryData.data.history.map((item: any, index: number) => (
                            <div key={index} className="flex items-center gap-2 text-xs">
                              <Badge variant={item.type === "subscription" ? "default" : "secondary"}>
                                {item.type === "subscription" ? "اشتراك" : "تحويل"}
                              </Badge>
                              <span>
                                {item.type === "subscription" 
                                  ? `${item.data.subscriptionType} - ${item.data.subscriptionNumber}`
                                  : `تحويل من ${item.data.fromSubscriptionType} إلى ${item.data.toSubscriptionType}`
                                }
                              </span>
                              <span className="text-gray-500">
                                {format(new Date(item.date), "yyyy-MM-dd", { locale: ar })}
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div>
                    <Label>نوع الاشتراك الجديد</Label>
                    <Select
                      value={transferForm.toSubscriptionTypeId}
                      onValueChange={handleSubscriptionTypeSelect}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر نوع الاشتراك" />
                      </SelectTrigger>
                      <SelectContent>
                        {subscriptionTypes.length > 0 ? (
                          subscriptionTypes.map((st: any) => {
                            const typeName = st.name || st.arabicName || st.typeName || st.subscriptionType || "غير محدد";
                            const price = st.price || st.subscriptionValue || st.value || 0;
                            const duration = st.duration || st.durationInDays || 30;
                            return (
                              <SelectItem key={st.id} value={st.id.toString()}>
                                {typeName} - {price} جم ({duration} يوم)
                              </SelectItem>
                            );
                          })
                        ) : (
                          <SelectItem value="no-types" disabled>
                            لا توجد أنواع اشتراكات متاحة
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    {transferForm.toSubscriptionType && (
                      <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                        <p className="text-gray-700">
                          <span className="font-medium">النوع:</span> {transferForm.toSubscriptionType}
                        </p>
                        {transferForm.toValue && (
                          <p className="text-gray-700">
                            <span className="font-medium">القيمة:</span> {transferForm.toValue} جم
                          </p>
                        )}
                        {transferForm.toEndDate && transferForm.toStartDate && (
                          <p className="text-gray-700">
                            <span className="font-medium">المدة:</span> من {transferForm.toStartDate} إلى {transferForm.toEndDate}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>تاريخ البداية الجديد</Label>
                      <Input
                        type="date"
                        value={transferForm.toStartDate}
                        onChange={(e) => setTransferForm(prev => ({ ...prev, toStartDate: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label>تاريخ النهاية الجديد</Label>
                      <Input
                        type="date"
                        value={transferForm.toEndDate}
                        onChange={(e) => setTransferForm(prev => ({ ...prev, toEndDate: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>قيمة الاشتراك الجديد</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={transferForm.toValue}
                      onChange={(e) => setTransferForm(prev => ({ ...prev, toValue: e.target.value }))}
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <Label>تاريخ التحويل</Label>
                    <Input
                      type="date"
                      value={transferForm.transferDate}
                      onChange={(e) => setTransferForm(prev => ({ ...prev, transferDate: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label>سبب التحويل (اختياري)</Label>
                    <Textarea
                      value={transferForm.reason}
                      onChange={(e) => setTransferForm(prev => ({ ...prev, reason: e.target.value }))}
                      placeholder="أدخل سبب التحويل..."
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      إلغاء
                    </Button>
                    <Button onClick={handleCreateTransfer} disabled={isCreating}>
                      {isCreating ? "جاري الحفظ..." : "إنشاء التحويل"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="ابحث بالاسم أو نوع الاشتراك..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transfers Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>قائمة التحويلات</CardTitle>
                <CardDescription>
                  جميع تحويلات الاشتراكات المسجلة في النظام
                </CardDescription>
              </div>
              {transfersData && (
                <Badge variant="outline" className="text-sm">
                  {transfers.length} تحويل
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {transfersLoading ? (
              <div className="text-center py-8">جاري التحميل...</div>
            ) : transfersError ? (
              <div className="text-center py-8 text-red-500">
                <p className="font-medium">خطأ في تحميل البيانات</p>
                <p className="text-sm text-gray-500 mt-2">
                  {transfersError?.data?.message || transfersError?.message || 'حدث خطأ غير معروف'}
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => refetch()} 
                  className="mt-4"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  إعادة المحاولة
                </Button>
              </div>
            ) : transfersData === undefined ? (
              <div className="text-center py-8 text-gray-500">
                <p>لم يتم تحميل البيانات بعد</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => refetch()} 
                  className="mt-4"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  إعادة المحاولة
                </Button>
              </div>
            ) : transfers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                لا توجد تحويلات مسجلة
                <br />
                <span className="text-xs text-gray-400 mt-2 block">
                  قم بإنشاء تحويل جديد من الزر أعلاه
                </span>
              </div>
            ) : filteredTransfers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                لا توجد نتائج للبحث "{searchTerm}"
                <br />
                <span className="text-xs text-gray-400 mt-2 block">
                  يوجد {transfers.length} تحويل مسجل
                </span>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>اسم العميل</TableHead>
                    <TableHead>من</TableHead>
                    <TableHead>إلى</TableHead>
                    <TableHead>القيمة السابقة</TableHead>
                    <TableHead>القيمة الجديدة</TableHead>
                    <TableHead>تاريخ التحويل</TableHead>
                    <TableHead>السبب</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransfers.map((transfer: any) => {
                    console.log('📋 Rendering transfer:', transfer);
                    return (
                      <TableRow key={transfer.id}>
                        <TableCell className="font-medium">
                          {transfer.customerName || 'غير محدد'}
                          {transfer.member && (
                            <Badge variant="outline" className="ml-2">
                              {transfer.member.memberCode || transfer.member.code}
                            </Badge>
                          )}
                        </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{transfer.fromSubscriptionType}</div>
                          <div className="text-xs text-gray-500">
                            {format(new Date(transfer.fromStartDate), "yyyy-MM-dd", { locale: ar })} - {format(new Date(transfer.fromEndDate), "yyyy-MM-dd", { locale: ar })}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-blue-600">{transfer.toSubscriptionType}</div>
                          <div className="text-xs text-gray-500">
                            {format(new Date(transfer.toStartDate), "yyyy-MM-dd", { locale: ar })} - {format(new Date(transfer.toEndDate), "yyyy-MM-dd", { locale: ar })}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-red-600">
                        {typeof transfer.fromValue === 'number' ? transfer.fromValue.toFixed(2) : (parseFloat(transfer.fromValue || 0).toFixed(2))} جم
                      </TableCell>
                      <TableCell className="font-medium text-green-600">
                        {typeof transfer.toValue === 'number' ? transfer.toValue.toFixed(2) : (parseFloat(transfer.toValue || 0).toFixed(2))} جم
                      </TableCell>
                      <TableCell>
                        {format(new Date(transfer.transferDate), "yyyy-MM-dd", { locale: ar })}
                      </TableCell>
                      <TableCell>
                        {transfer.reason ? (
                          <span className="text-sm text-gray-600">{transfer.reason}</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

