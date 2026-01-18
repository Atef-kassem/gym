import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetAllBranchesQuery } from "@/services/branchesApi";
import {
  useGetSubscriptionTypesQuery,
  useCreateSubscriptionTypeMutation,
  useUpdateSubscriptionTypeMutation,
  useDeleteSubscriptionTypeMutation,
} from "@/services/subscriptionsApi";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, Plus, Trash2, Edit, Save, Search, Filter, TrendingUp, Package, DollarSign, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SubscriptionType {
  id?: number;
  name: string;
  branchId: number | string;
  price: number;
  days: number;
  isTarget: boolean;
  availableAppeals: number;
  availableBody: number;
  isSpecialOffer: boolean;
  isForStudents: boolean;
  showInApp: boolean;
  sendNotificationToCustomers: boolean;
  notifyOnExpiry: boolean;
  walletPoints: number;
  offerValidity: string;
  isLinkedToSessions: boolean;
  sessionsCount?: number;
  isLinkedToFreeze: boolean;
  freezeDays?: number;
  includesSpa: boolean;
  spaCount?: number;
}

interface Branch {
  id: string;
  arabicName?: string;
  englishName?: string;
  name?: string;
}

const SubscriptionPaymentSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // جلب أنواع الاشتراكات من الـ API
  const {
    data: subscriptionTypesData,
    isLoading: subscriptionTypesLoading,
    refetch: refetchSubscriptionTypes,
  } = useGetSubscriptionTypesQuery(undefined);
  const subscriptions: SubscriptionType[] = Array.isArray(subscriptionTypesData?.data)
    ? (subscriptionTypesData.data as SubscriptionType[])
    : [];

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<SubscriptionType | null>(null);
  // الفلاتر
  const [searchTerm, setSearchTerm] = useState("");
  const [branchFilter, setBranchFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  
  // جلب الفروع
  const { data: branchesData, isLoading: branchesLoading } = useGetAllBranchesQuery(undefined as any);
  const branches: Branch[] = Array.isArray(branchesData?.data) ? (branchesData.data as Branch[]) : [];

  // Mutations لأنواع الاشتراكات
  const [createSubscriptionType] = useCreateSubscriptionTypeMutation();
  const [updateSubscriptionType] = useUpdateSubscriptionTypeMutation();
  const [deleteSubscriptionType] = useDeleteSubscriptionTypeMutation();

  // حالة النموذج
  const [formData, setFormData] = useState<SubscriptionType>({
    name: "",
    branchId: "",
    price: 0,
    days: 0,
    isTarget: false,
    availableAppeals: 0,
    availableBody: 0,
    isSpecialOffer: false,
    isForStudents: false,
    showInApp: false,
    sendNotificationToCustomers: false,
    notifyOnExpiry: false,
    walletPoints: 0,
    offerValidity: "",
    isLinkedToSessions: false,
    sessionsCount: 0,
    isLinkedToFreeze: false,
    freezeDays: 0,
    includesSpa: false,
    spaCount: 0,
  });

  // تحديث حقل في النموذج
  const handleInputChange = (field: keyof SubscriptionType, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // فتح نافذة التعديل/الإضافة
  const handleOpenDialog = (subscription?: SubscriptionType) => {
    if (subscription) {
      setEditingSubscription(subscription);
      setFormData({
        ...subscription,
        branchId: subscription.branchId?.toString() ?? "",
      } as SubscriptionType);
    } else {
      setEditingSubscription(null);
      setFormData({
        name: "",
        branchId: "",
        price: 0,
        days: 0,
        isTarget: false,
        availableAppeals: 0,
        availableBody: 0,
        isSpecialOffer: false,
        isForStudents: false,
        showInApp: false,
        sendNotificationToCustomers: false,
        notifyOnExpiry: false,
        walletPoints: 0,
        offerValidity: "",
        isLinkedToSessions: false,
        sessionsCount: 0,
        isLinkedToFreeze: false,
        freezeDays: 0,
        includesSpa: false,
        spaCount: 0,
      });
    }
    setIsEditDialogOpen(true);
  };

  // حفظ الاشتراك
  const handleSave = async () => {
    if (!formData.name || !formData.branchId) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    try {
      if (editingSubscription && editingSubscription.id) {
        // تحديث نوع اشتراك موجود
        await updateSubscriptionType({
          id: editingSubscription.id,
          data: {
            ...formData,
            branchId: parseInt(formData.branchId as string, 10),
          },
        }).unwrap();
        toast({
          title: "تم التحديث",
          description: "تم تحديث نوع الاشتراك بنجاح",
        });
      } else {
        // إضافة نوع اشتراك جديد
        await createSubscriptionType({
          ...formData,
          branchId: parseInt(formData.branchId as string, 10),
        }).unwrap();
        toast({
          title: "تم الإضافة",
          description: "تم إضافة نوع الاشتراك بنجاح",
        });
      }

      await refetchSubscriptionTypes();
      setIsEditDialogOpen(false);
      setEditingSubscription(null);
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error?.data?.message || "حدث خطأ أثناء حفظ نوع الاشتراك",
        variant: "destructive",
      });
    }
  };

  // حذف الاشتراك
  const handleDelete = async (id: number) => {
    try {
      await deleteSubscriptionType(id).unwrap();
      await refetchSubscriptionTypes();
      toast({
        title: "تم الحذف",
        description: "تم حذف نوع الاشتراك بنجاح",
      });
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error?.data?.message || "حدث خطأ أثناء حذف نوع الاشتراك",
        variant: "destructive",
      });
    }
  };

  // حساب الإحصائيات
  const statistics = useMemo(() => {
    const totalSubscriptions = subscriptions.length;
    const totalValue = subscriptions.reduce((sum, sub) => {
      const price = typeof sub.price === 'string' ? parseFloat(sub.price) : (sub.price || 0);
      return sum + (isNaN(price) ? 0 : price);
    }, 0);
    const specialOffers = subscriptions.filter(sub => sub.isSpecialOffer).length;
    const forStudents = subscriptions.filter(sub => sub.isForStudents).length;
    const showInApp = subscriptions.filter(sub => sub.showInApp).length;
    
    return {
      totalSubscriptions,
      totalValue,
      specialOffers,
      forStudents,
      showInApp
    };
  }, [subscriptions]);

  // فلترة الاشتراكات
  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter(sub => {
      // فلترة حسب البحث
      const matchesSearch = !searchTerm || 
        sub.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      // فلترة حسب الفرع
      const matchesBranch =
        branchFilter === "all" || sub.branchId?.toString() === branchFilter;
      
      // فلترة حسب النوع
      let matchesType = true;
      if (typeFilter === "special") {
        matchesType = sub.isSpecialOffer;
      } else if (typeFilter === "students") {
        matchesType = sub.isForStudents;
      } else if (typeFilter === "target") {
        matchesType = sub.isTarget;
      } else if (typeFilter === "app") {
        matchesType = sub.showInApp;
      }
      
      return matchesSearch && matchesBranch && matchesType;
    });
  }, [subscriptions, searchTerm, branchFilter, typeFilter]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/gym/subscriptions")}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">إعدادات أنواع الاشتراكات</h1>
          <p className="text-muted-foreground">إدارة أنواع الاشتراكات والإعدادات</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 ml-2" />
          إضافة نوع اشتراك جديد
        </Button>
      </div>

      {/* كروت الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الاشتراكات</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalSubscriptions}</div>
            <p className="text-xs text-muted-foreground">نوع اشتراك</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي القيمة</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {typeof statistics.totalValue === 'number' 
                ? statistics.totalValue.toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                : parseFloat(statistics.totalValue || 0).toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">جنية</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">عروض خاصة</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.specialOffers}</div>
            <p className="text-xs text-muted-foreground">اشتراك</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">للطلبة</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.forStudents}</div>
            <p className="text-xs text-muted-foreground">اشتراك</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">في التطبيق</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.showInApp}</div>
            <p className="text-xs text-muted-foreground">اشتراك</p>
          </CardContent>
        </Card>
      </div>

      {/* الفلاتر */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            الفلاتر
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>البحث</Label>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="ابحث عن نوع الاشتراك..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>الفرع</Label>
              <Select value={branchFilter} onValueChange={setBranchFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="جميع الفروع" />
                </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الفروع</SelectItem>
                    {branches.map((branch) => (
                      <SelectItem key={branch.id} value={branch.id}>
                        {branch.arabicName || branch.englishName || branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>النوع</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="جميع الأنواع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأنواع</SelectItem>
                  <SelectItem value="special">عروض خاصة</SelectItem>
                  <SelectItem value="students">للطلبة</SelectItem>
                  <SelectItem value="target">تابع للتارجت</SelectItem>
                  <SelectItem value="app">يظهر في التطبيق</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* جدول الاشتراكات */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة أنواع الاشتراكات</CardTitle>
          <CardDescription>
            عرض {filteredSubscriptions.length} من {subscriptions.length} نوع اشتراك
          </CardDescription>
        </CardHeader>
        <CardContent>
          {subscriptionTypesLoading ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">جاري تحميل بيانات أنواع الاشتراكات...</p>
            </div>
          ) : filteredSubscriptions.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">
                {subscriptions.length === 0 
                  ? "لا توجد أنواع اشتراكات" 
                  : "لا توجد نتائج للبحث"}
              </p>
              {subscriptions.length === 0 && (
                <Button onClick={() => handleOpenDialog()} className="mt-4">
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة نوع اشتراك جديد
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>إسم الاشتراك</TableHead>
                    <TableHead>الفرع</TableHead>
                    <TableHead>القيمة (جنية)</TableHead>
                    <TableHead>عدد الأيام</TableHead>
                    <TableHead>الدعاوى</TableHead>
                    <TableHead>الانبودي</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead className="text-center">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubscriptions.map((subscription) => (
                    <TableRow key={subscription.id}>
                      <TableCell className="font-medium">{subscription.name}</TableCell>
                      <TableCell>
                        {branches.find(
                          (b: Branch) => b.id.toString() === subscription.branchId?.toString()
                        )?.arabicName ||
                          branches.find(
                            (b: Branch) => b.id.toString() === subscription.branchId?.toString()
                          )?.englishName ||
                          "غير محدد"}
                      </TableCell>
                      <TableCell>{subscription.price.toLocaleString()}</TableCell>
                      <TableCell>{subscription.days}</TableCell>
                      <TableCell>{subscription.availableAppeals}</TableCell>
                      <TableCell>{subscription.availableBody}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {subscription.isSpecialOffer && (
                            <Badge variant="secondary" className="text-xs">عرض خاص</Badge>
                          )}
                          {subscription.isForStudents && (
                            <Badge variant="outline" className="text-xs">للطلبة</Badge>
                          )}
                          {subscription.isTarget && (
                            <Badge variant="default" className="text-xs">تارجت</Badge>
                          )}
                          {subscription.showInApp && (
                            <Badge variant="secondary" className="text-xs">في التطبيق</Badge>
                          )}
                          {subscription.includesSpa && (
                            <Badge variant="outline" className="text-xs">سبا</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDialog(subscription)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => subscription.id && handleDelete(subscription.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* نافذة التعديل/الإضافة */}
      {isEditDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>
                {editingSubscription ? "تعديل نوع الاشتراك" : "إضافة نوع اشتراك جديد"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* الصف الأول: إسم الاشتراك، الفرع، قيمة الاشتراك */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">إسم الاشتراك *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="أدخل اسم الاشتراك"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="branchId">الفرع *</Label>
                  {branchesLoading ? (
                    <div className="text-sm text-muted-foreground">جاري تحميل الفروع...</div>
                  ) : (
                    <Select
                      value={formData.branchId ? formData.branchId.toString() : ""}
                      onValueChange={(value) => handleInputChange("branchId", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الفرع" />
                      </SelectTrigger>
                      <SelectContent>
                        {branches.map((branch) => (
                          <SelectItem key={branch.id} value={branch.id}>
                            {branch.arabicName || branch.englishName || branch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">قيمة الاشتراك (جنية) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", parseFloat(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
              </div>

              {/* الصف الثاني: عدد أيام الاشتراك، هل تابع للتارجت، عدد الدعاوى */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="days">عدد أيام الإشتراك (يوم) *</Label>
                  <Input
                    id="days"
                    type="number"
                    value={formData.days}
                    onChange={(e) => handleInputChange("days", parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="isTarget">هل الاشتراك تابع للتارجت؟</Label>
                  <Switch
                    id="isTarget"
                    checked={formData.isTarget}
                    onCheckedChange={(checked) => handleInputChange("isTarget", checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="availableAppeals">عدد الدعاوى المتاحة</Label>
                  <Input
                    id="availableAppeals"
                    type="number"
                    value={formData.availableAppeals}
                    onChange={(e) => handleInputChange("availableAppeals", parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
              </div>

              {/* الصف الثالث: عدد الانبودي، هل عرض خاص، هل يخص الطلبة */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="availableBody">عدد الانبودي</Label>
                  <Input
                    id="availableBody"
                    type="number"
                    value={formData.availableBody}
                    onChange={(e) => handleInputChange("availableBody", parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="isSpecialOffer">هل الاشتراك عرض خاص؟</Label>
                  <Switch
                    id="isSpecialOffer"
                    checked={formData.isSpecialOffer}
                    onCheckedChange={(checked) => handleInputChange("isSpecialOffer", checked)}
                  />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="isForStudents">هل الاشتراك يخص الطلبة؟</Label>
                  <Switch
                    id="isForStudents"
                    checked={formData.isForStudents}
                    onCheckedChange={(checked) => handleInputChange("isForStudents", checked)}
                  />
                </div>
              </div>

              {/* الصف الرابع: هل يظهر في التطبيق، إرسال إشعار للعملاء، إشعار عند الانتهاء */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="showInApp">هل يظهر في التطبيق؟</Label>
                  <Switch
                    id="showInApp"
                    checked={formData.showInApp}
                    onCheckedChange={(checked) => handleInputChange("showInApp", checked)}
                  />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="sendNotificationToCustomers">إرسال إشعار للعملاء؟</Label>
                  <Switch
                    id="sendNotificationToCustomers"
                    checked={formData.sendNotificationToCustomers}
                    onCheckedChange={(checked) => handleInputChange("sendNotificationToCustomers", checked)}
                  />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="notifyOnExpiry">إشعار عند الانتهاء؟</Label>
                  <Switch
                    id="notifyOnExpiry"
                    checked={formData.notifyOnExpiry}
                    onCheckedChange={(checked) => handleInputChange("notifyOnExpiry", checked)}
                  />
                </div>
              </div>

              {/* الصف الخامس: تقاط المحفظة، صلاحية الاشتراك في العرض، هل مرتبط بحصص */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="walletPoints">تقاط المحفظة</Label>
                  <Input
                    id="walletPoints"
                    type="number"
                    value={formData.walletPoints}
                    onChange={(e) => handleInputChange("walletPoints", parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="offerValidity">صلاحية الاشتراك في العرض</Label>
                  <Input
                    id="offerValidity"
                    type="date"
                    value={formData.offerValidity}
                    onChange={(e) => handleInputChange("offerValidity", e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="isLinkedToSessions">هل مرتبط بحصص؟</Label>
                  <Switch
                    id="isLinkedToSessions"
                    checked={formData.isLinkedToSessions}
                    onCheckedChange={(checked) => {
                      handleInputChange("isLinkedToSessions", checked);
                      if (!checked) {
                        handleInputChange("sessionsCount", 0);
                      }
                    }}
                  />
                </div>
              </div>

              {/* حقل عدد الحصص - يظهر فقط عند تفعيل "مرتبط بحصص" */}
              {formData.isLinkedToSessions && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sessionsCount">عدد الحصص *</Label>
                    <Input
                      id="sessionsCount"
                      type="number"
                      min="0"
                      value={formData.sessionsCount || 0}
                      onChange={(e) => handleInputChange("sessionsCount", parseInt(e.target.value) || 0)}
                      placeholder="أدخل عدد الحصص"
                    />
                  </div>
                </div>
              )}

              {/* الصف السادس: هل مرتبط بوقف، هل يشمل سبا */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="isLinkedToFreeze">هل مرتبط بوقف؟</Label>
                  <Switch
                    id="isLinkedToFreeze"
                    checked={formData.isLinkedToFreeze}
                    onCheckedChange={(checked) => {
                      handleInputChange("isLinkedToFreeze", checked);
                      if (!checked) {
                        handleInputChange("freezeDays", 0);
                      }
                    }}
                  />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="includesSpa">هل يشمل سبا؟</Label>
                  <Switch
                    id="includesSpa"
                    checked={formData.includesSpa}
                    onCheckedChange={(checked) => {
                      handleInputChange("includesSpa", checked);
                      if (!checked) {
                        handleInputChange("spaCount", 0);
                      }
                    }}
                  />
                </div>
              </div>

              {/* حقل عدد أيام الوقف - يظهر فقط عند تفعيل "مرتبط بوقف" */}
              {formData.isLinkedToFreeze && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="freezeDays">عدد أيام الوقف *</Label>
                    <Input
                      id="freezeDays"
                      type="number"
                      min="0"
                      value={formData.freezeDays || 0}
                      onChange={(e) => handleInputChange("freezeDays", parseInt(e.target.value) || 0)}
                      placeholder="أدخل عدد أيام الوقف"
                    />
                  </div>
                </div>
              )}

              {/* حقل عدد مرات السبا - يظهر فقط عند تفعيل "يشمل سبا" */}
              {formData.includesSpa && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="spaCount">عدد مرات استخدام السبا *</Label>
                    <Input
                      id="spaCount"
                      type="number"
                      min="0"
                      value={formData.spaCount || 0}
                      onChange={(e) => handleInputChange("spaCount", parseInt(e.target.value) || 0)}
                      placeholder="أدخل عدد مرات استخدام السبا"
                    />
                  </div>
                </div>
              )}

              {/* أزرار الحفظ والإلغاء */}
              <div className="flex justify-end gap-4 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setEditingSubscription(null);
                  }}
                >
                  إلغاء
                </Button>
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 ml-2" />
                  حفظ
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPaymentSettings;
