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
  useGetAllRefundsQuery, 
  useCreateRefundMutation,
  useUpdateRefundStatusMutation,
} from "@/services/subscriptionRefundsApi";
import { useGetAllSubscriptionsQuery } from "@/services/subscriptionsApi";
import {
  Undo2, Plus, Search, Calendar, User, FileText, Eye,
  TrendingUp, RefreshCw, Filter, CheckCircle, XCircle, Clock
} from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface SubscriptionRefund {
  id: number;
  subscriptionId: number;
  memberId?: number;
  customerName: string;
  subscriptionType: string;
  originalStartDate: string;
  originalEndDate: string;
  stopDate: string;
  remainingDays: number;
  originalValue: number;
  dailyRate: number;
  refundAmount: number;
  invoiceNumber: string;
  refundDate: string;
  reason?: string;
  status: "pending" | "completed" | "cancelled";
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
}

export default function SubscriptionRefunds() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<number | null>(null);

  const [refundForm, setRefundForm] = useState({
    subscriptionId: "",
    stopDate: new Date().toISOString().split('T')[0],
    reason: "",
  });

  const { 
    data: refundsData, 
    isLoading: refundsLoading, 
    error: refundsError,
    refetch 
  } = useGetAllRefundsQuery({
    search: searchTerm,
    status: statusFilter !== "all" ? statusFilter : undefined,
  });

  const { data: subscriptionsData } = useGetAllSubscriptionsQuery({
    status: "active",
  });

  const [createRefund, { isLoading: isCreating }] = useCreateRefundMutation();
  const [updateRefundStatus] = useUpdateRefundStatusMutation();

  // البيانات الآن تأتي مباشرة بعد transformResponse
  const refunds: SubscriptionRefund[] = Array.isArray(refundsData) ? refundsData : (refundsData?.data || []);
  const subscriptions = Array.isArray(subscriptionsData) ? subscriptionsData : (subscriptionsData?.data || []);

  // Debug: Log data for troubleshooting
  useEffect(() => {
    console.log('📊 SubscriptionRefunds - Component Data:', {
      refundsData,
      refundsDataType: typeof refundsData,
      isRefundsDataArray: Array.isArray(refundsData),
      refunds,
      refundsCount: refunds.length,
      refundsLoading,
      refundsError,
      subscriptionsData,
      subscriptions,
      hasData: !!refundsData
    });
    
    if (refundsError) {
      console.error('❌ SubscriptionRefunds Error:', refundsError);
    }
  }, [refundsData, refunds, refundsLoading, refundsError, subscriptionsData, subscriptions]);

  const handleCreateRefund = async () => {
    if (!refundForm.subscriptionId || !refundForm.stopDate) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    try {
      await createRefund({
        subscriptionId: parseInt(refundForm.subscriptionId),
        stopDate: refundForm.stopDate,
        reason: refundForm.reason || undefined,
      }).unwrap();

      toast({
        title: "نجح",
        description: "تم إنشاء مردود الاشتراك بنجاح",
      });

      setIsCreateDialogOpen(false);
      setRefundForm({
        subscriptionId: "",
        stopDate: new Date().toISOString().split('T')[0],
        reason: "",
      });
      refetch();
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error?.data?.message || "فشل في إنشاء مردود الاشتراك",
        variant: "destructive",
      });
    }
  };

  const handleStatusUpdate = async (refundId: number, newStatus: "pending" | "completed" | "cancelled") => {
    try {
      await updateRefundStatus({
        id: refundId,
        status: newStatus,
      }).unwrap();

      toast({
        title: "نجح",
        description: "تم تحديث حالة المردود بنجاح",
      });

      refetch();
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error?.data?.message || "فشل في تحديث حالة المردود",
        variant: "destructive",
      });
    }
  };

  const handleSubscriptionSelect = (subscriptionId: string) => {
    const subscription = subscriptions.find((s: any) => s.id === parseInt(subscriptionId));
    if (subscription) {
      setSelectedSubscriptionId(parseInt(subscriptionId));
      // Calculate default stop date (today)
      setRefundForm(prev => ({
        ...prev,
        subscriptionId,
        stopDate: new Date().toISOString().split('T')[0],
      }));
    }
  };

  const calculateRefundPreview = () => {
    if (!selectedSubscriptionId) return null;

    const subscription = subscriptions.find((s: any) => s.id === selectedSubscriptionId);
    if (!subscription) return null;

    const stopDate = new Date(refundForm.stopDate);
    const startDate = new Date(subscription.subscriptionStartDate);
    const endDate = new Date(subscription.subscriptionEndDate);

    if (stopDate < startDate || stopDate > endDate) {
      return { error: "تاريخ الإيقاف يجب أن يكون بين تاريخي البداية والنهاية" };
    }

    const remainingDays = Math.ceil((endDate.getTime() - stopDate.getTime()) / (1000 * 60 * 60 * 24));
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const subscriptionValue = parseFloat(subscription.subscriptionValue || 0);
    const discountValue = subscription.discountEnabled ? (parseFloat(subscription.discountValue || 0)) : 0;
    const netValue = subscriptionValue - discountValue;
    const dailyRate = totalDays > 0 ? netValue / totalDays : 0;
    const refundAmount = remainingDays * dailyRate;

    return {
      remainingDays,
      totalDays,
      dailyRate,
      refundAmount,
      netValue,
    };
  };

  const refundPreview = calculateRefundPreview();

  const filteredRefunds = refunds.filter((refund) => {
    if (!searchTerm) return true; // إذا لم يكن هناك بحث، اعرض كل شيء
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      (refund.customerName || "").toLowerCase().includes(searchLower) ||
      (refund.invoiceNumber || "").toLowerCase().includes(searchLower) ||
      (refund.subscriptionType || "").toLowerCase().includes(searchLower);
    return matchesSearch;
  });

  console.log('🔍 Filtered Refunds:', {
    totalRefunds: refunds.length,
    filteredCount: filteredRefunds.length,
    searchTerm,
    statusFilter
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" /> مكتمل</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500"><Clock className="w-3 h-3 mr-1" /> قيد الانتظار</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500"><XCircle className="w-3 h-3 mr-1" /> ملغي</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Undo2 className="w-8 h-8 text-blue-600" />
              مردودات الاشتراكات
            </h1>
            <p className="text-gray-600 mt-2">
              إدارة وإيقاف الاشتراكات وحساب المردودات
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => {
              console.log('🔄 Refreshing refunds data...');
              refetch();
            }}>
              <RefreshCw className="w-4 h-4 mr-2" />
              تحديث
            </Button>
            {/* Debug Info - يمكن إزالتها لاحقاً */}
            {refundsData && (
              <Badge variant="outline" className="text-xs">
                {refunds.length} مردود
              </Badge>
            )}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  مردود اشتراك جديد
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>مردود اشتراك</DialogTitle>
                  <DialogDescription>
                    اختر الاشتراك المراد إيقافه وحساب المردود
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>الاشتراك</Label>
                    <Select
                      value={refundForm.subscriptionId}
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

                  {selectedSubscriptionId && (
                    <Card className="p-4 bg-blue-50">
                      <CardHeader className="p-0 pb-2">
                        <CardTitle className="text-sm">معلومات الاشتراك</CardTitle>
                      </CardHeader>
                      <CardContent className="p-0 space-y-1 text-sm">
                        {(() => {
                          const sub = subscriptions.find((s: any) => s.id === selectedSubscriptionId);
                          if (!sub) return null;
                          return (
                            <>
                              <div className="flex justify-between">
                                <span className="text-gray-600">تاريخ البداية:</span>
                                <span>{format(new Date(sub.subscriptionStartDate), "yyyy-MM-dd", { locale: ar })}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">تاريخ النهاية:</span>
                                <span>{format(new Date(sub.subscriptionEndDate), "yyyy-MM-dd", { locale: ar })}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">القيمة:</span>
                                <span>{parseFloat(sub.subscriptionValue || 0).toFixed(2)} جم</span>
                              </div>
                            </>
                          );
                        })()}
                      </CardContent>
                    </Card>
                  )}

                  <div>
                    <Label>تاريخ إيقاف الاشتراك</Label>
                    <Input
                      type="date"
                      value={refundForm.stopDate}
                      onChange={(e) => setRefundForm(prev => ({ ...prev, stopDate: e.target.value }))}
                      min={selectedSubscriptionId ? subscriptions.find((s: any) => s.id === selectedSubscriptionId)?.subscriptionStartDate : undefined}
                      max={selectedSubscriptionId ? subscriptions.find((s: any) => s.id === selectedSubscriptionId)?.subscriptionEndDate : undefined}
                    />
                  </div>

                  {refundPreview && (
                    <Card className="p-4 bg-green-50 border-green-200">
                      <CardHeader className="p-0 pb-2">
                        <CardTitle className="text-sm">حساب المردود</CardTitle>
                      </CardHeader>
                      <CardContent className="p-0 space-y-2 text-sm">
                        {refundPreview.error ? (
                          <div className="text-red-600">{refundPreview.error}</div>
                        ) : (
                          <>
                            <div className="flex justify-between">
                              <span className="text-gray-600">الأيام المتبقية:</span>
                              <span className="font-medium">{refundPreview.remainingDays} يوم</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">السعر اليومي:</span>
                              <span className="font-medium">
                                {typeof refundPreview.dailyRate === 'number' 
                                  ? refundPreview.dailyRate.toFixed(2) 
                                  : parseFloat(refundPreview.dailyRate || 0).toFixed(2)} جم
                              </span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-green-300">
                              <span className="text-gray-700 font-semibold">قيمة المردود:</span>
                              <span className="font-bold text-green-700 text-lg">
                                {typeof refundPreview.refundAmount === 'number' 
                                  ? refundPreview.refundAmount.toFixed(2) 
                                  : parseFloat(refundPreview.refundAmount || 0).toFixed(2)} جم
                              </span>
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  <div>
                    <Label>سبب الإيقاف (اختياري)</Label>
                    <Textarea
                      value={refundForm.reason}
                      onChange={(e) => setRefundForm(prev => ({ ...prev, reason: e.target.value }))}
                      placeholder="أدخل سبب إيقاف الاشتراك..."
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      إلغاء
                    </Button>
                    <Button 
                      onClick={handleCreateRefund} 
                      disabled={isCreating || !refundPreview || !!refundPreview.error}
                    >
                      {isCreating ? "جاري الحفظ..." : "إنشاء المردود"}
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
                  placeholder="ابحث بالاسم أو رقم الايصال..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="حالة المردود" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="pending">قيد الانتظار</SelectItem>
                  <SelectItem value="completed">مكتمل</SelectItem>
                  <SelectItem value="cancelled">ملغي</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Refunds Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>قائمة المردودات</CardTitle>
                <CardDescription>
                  جميع مردودات الاشتراكات المسجلة في النظام
                </CardDescription>
              </div>
              {refundsData && (
                <Badge variant="outline" className="text-sm">
                  {refunds.length} مردود
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {refundsLoading ? (
              <div className="text-center py-8">جاري التحميل...</div>
            ) : refundsError ? (
              <div className="text-center py-8 text-red-500">
                <p className="font-medium">خطأ في تحميل البيانات</p>
                <p className="text-sm text-gray-500 mt-2">
                  {refundsError?.data?.message || refundsError?.message || 'حدث خطأ غير معروف'}
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
            ) : refundsData === undefined ? (
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
            ) : refunds.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-lg font-medium mb-2">لا توجد مردودات مسجلة</p>
                <p className="text-sm text-gray-400 mb-4">
                  قم بإنشاء مردود جديد من الزر أعلاه
                </p>
                <div className="text-xs text-gray-300 mt-4">
                  <p>Debug Info:</p>
                  <p>refundsData: {refundsData ? 'exists' : 'null'}</p>
                  <p>refunds.length: {refunds.length}</p>
                  <p>isArray: {Array.isArray(refundsData) ? 'yes' : 'no'}</p>
                </div>
              </div>
            ) : filteredRefunds.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                لا توجد نتائج للبحث "{searchTerm}"
                <br />
                <span className="text-xs text-gray-400 mt-2 block">
                  يوجد {refunds.length} مردود مسجل
                </span>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>اسم العميل</TableHead>
                    <TableHead>نوع الاشتراك</TableHead>
                    <TableHead>تاريخ الإيقاف</TableHead>
                    <TableHead>الأيام المتبقية</TableHead>
                    <TableHead>قيمة المردود</TableHead>
                    <TableHead>رقم الايصال</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRefunds.map((refund: any) => {
                    console.log('📋 Rendering refund:', refund);
                    return (
                      <TableRow key={refund.id}>
                        <TableCell className="font-medium">
                          {refund.customerName || 'غير محدد'}
                          {refund.member && (
                            <Badge variant="outline" className="ml-2">
                              {refund.member.memberCode || refund.member.code}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{refund.subscriptionType || 'غير محدد'}</TableCell>
                        <TableCell>
                          {refund.stopDate ? format(new Date(refund.stopDate), "yyyy-MM-dd", { locale: ar }) : '-'}
                        </TableCell>
                        <TableCell>{refund.remainingDays || 0} يوم</TableCell>
                        <TableCell className="font-medium text-green-600">
                          {typeof refund.refundAmount === 'number' ? refund.refundAmount.toFixed(2) : (parseFloat(refund.refundAmount || 0).toFixed(2))} جم
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{refund.invoiceNumber || 'غير محدد'}</Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(refund.status || 'pending')}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {refund.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusUpdate(refund.id, "completed")}
                              >
                                <CheckCircle className="w-3 h-3 mr-1" />
                                إكمال
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusUpdate(refund.id, "cancelled")}
                              >
                                <XCircle className="w-3 h-3 mr-1" />
                                إلغاء
                              </Button>
                            </>
                          )}
                        </div>
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

