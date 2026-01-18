import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useGetAllBranchesQuery } from "@/services/branchesApi";
import {
  useGetAllLockersQuery,
  useCreateLockerMutation,
  useUpdateLockerMutation,
  useDeleteLockerMutation,
  useGetLockerSubscriptionTypesQuery,
  useCreateLockerSubscriptionTypeMutation,
  useUpdateLockerSubscriptionTypeMutation,
  useDeleteLockerSubscriptionTypeMutation,
} from "@/services/lockersApi";
import {
  Plus, Save, Search, Edit, Trash2, Settings,
  Filter, Download, Key, Lock, Building, XCircle
} from "lucide-react";

const LockerSettings = () => {
  const { toast } = useToast();
  const { data: branchesData, isLoading: branchesLoading } = useGetAllBranchesQuery(undefined as any);
  const branches = Array.isArray(branchesData?.data) ? branchesData.data : [];

  // جلب أرقام اللوكر من API
  const { data: lockersData, isLoading: lockersLoading, refetch: refetchLockers } = useGetAllLockersQuery({});
  const lockerNumbers = Array.isArray(lockersData?.data) ? lockersData.data : [];

  // جلب أنواع اشتراك اللوكر من API
  const { data: subscriptionTypesData, isLoading: subscriptionTypesLoading, refetch: refetchSubscriptionTypes } = useGetLockerSubscriptionTypesQuery();
  const subscriptionTypes = Array.isArray(subscriptionTypesData?.data) ? subscriptionTypesData.data : [];

  // Mutations للوكر
  const [createLocker] = useCreateLockerMutation();
  const [updateLocker] = useUpdateLockerMutation();
  const [deleteLocker] = useDeleteLockerMutation();

  // Mutations لأنواع الاشتراك
  const [createLockerSubscriptionType] = useCreateLockerSubscriptionTypeMutation();
  const [updateLockerSubscriptionType] = useUpdateLockerSubscriptionTypeMutation();
  const [deleteLockerSubscriptionType] = useDeleteLockerSubscriptionTypeMutation();

  const [isAddLockerNumberOpen, setIsAddLockerNumberOpen] = useState(false);
  const [isEditLockerNumberOpen, setIsEditLockerNumberOpen] = useState(false);
  const [isDeleteLockerNumberOpen, setIsDeleteLockerNumberOpen] = useState(false);
  const [selectedLockerNumber, setSelectedLockerNumber] = useState<any>(null);

  const [lockerNumberForm, setLockerNumberForm] = useState({
    mainBranchId: "",
    subBranchId: "",
    lockerNumber: ""
  });

  const [isAddSubscriptionTypeOpen, setIsAddSubscriptionTypeOpen] = useState(false);
  const [isEditSubscriptionTypeOpen, setIsEditSubscriptionTypeOpen] = useState(false);
  const [isDeleteSubscriptionTypeOpen, setIsDeleteSubscriptionTypeOpen] = useState(false);
  const [selectedSubscriptionType, setSelectedSubscriptionType] = useState<any>(null);

  const [subscriptionTypeForm, setSubscriptionTypeForm] = useState({
    name: "",
    metaValue: "",
    mtaValue: "",
    days: "",
    hasStop: false,
    stopDays: "",
    isTargetBased: false
  });

  // إضافة رقم لوكر
  const handleAddLockerNumber = async () => {
    if (!lockerNumberForm.mainBranchId || !lockerNumberForm.subBranchId || !lockerNumberForm.lockerNumber) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    try {
      await createLocker({
        mainBranchId: parseInt(lockerNumberForm.mainBranchId),
        subBranchId: parseInt(lockerNumberForm.subBranchId),
        lockerNumber: lockerNumberForm.lockerNumber,
        isAvailable: true,
      }).unwrap();
      
      setIsAddLockerNumberOpen(false);
      setLockerNumberForm({ mainBranchId: "", subBranchId: "", lockerNumber: "" });
      refetchLockers();
      toast({
        title: "نجح",
        description: "تم إضافة رقم اللوكر بنجاح"
      });
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error?.data?.message || "حدث خطأ أثناء إضافة رقم اللوكر",
        variant: "destructive"
      });
    }
  };

  // إضافة نوع اشتراك
  const handleAddSubscriptionType = async () => {
    if (!subscriptionTypeForm.name || !subscriptionTypeForm.metaValue || !subscriptionTypeForm.mtaValue || !subscriptionTypeForm.days) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    try {
      await createLockerSubscriptionType({
        name: subscriptionTypeForm.name,
        metaValue: parseFloat(subscriptionTypeForm.metaValue),
        mtaValue: parseFloat(subscriptionTypeForm.mtaValue),
        days: parseInt(subscriptionTypeForm.days),
        hasStop: subscriptionTypeForm.hasStop,
        stopDays: subscriptionTypeForm.hasStop ? parseInt(subscriptionTypeForm.stopDays || "0") : null,
        isTargetBased: subscriptionTypeForm.isTargetBased,
        isActive: true,
      }).unwrap();
      
      setIsAddSubscriptionTypeOpen(false);
      setSubscriptionTypeForm({
        name: "",
        metaValue: "",
        mtaValue: "",
        days: "",
        hasStop: false,
        stopDays: "",
        isTargetBased: false
      });
      refetchSubscriptionTypes();
      toast({
        title: "نجح",
        description: "تم إضافة نوع الاشتراك بنجاح"
      });
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error?.data?.message || "حدث خطأ أثناء إضافة نوع الاشتراك",
        variant: "destructive"
      });
    }
  };

  // تعديل رقم لوكر
  const handleEditLockerNumber = async () => {
    if (!lockerNumberForm.mainBranchId || !lockerNumberForm.subBranchId || !lockerNumberForm.lockerNumber) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    try {
      await updateLocker({
        id: selectedLockerNumber.id,
        data: {
          mainBranchId: parseInt(lockerNumberForm.mainBranchId),
          subBranchId: parseInt(lockerNumberForm.subBranchId),
          lockerNumber: lockerNumberForm.lockerNumber,
        },
      }).unwrap();

      setIsEditLockerNumberOpen(false);
      setSelectedLockerNumber(null);
      setLockerNumberForm({ mainBranchId: "", subBranchId: "", lockerNumber: "" });
      refetchLockers();
      toast({
        title: "نجح",
        description: "تم تحديث رقم اللوكر بنجاح"
      });
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error?.data?.message || "حدث خطأ أثناء تحديث رقم اللوكر",
        variant: "destructive"
      });
    }
  };

  // حذف رقم لوكر
  const handleDeleteLockerNumber = async () => {
    try {
      await deleteLocker(selectedLockerNumber.id).unwrap();
      setIsDeleteLockerNumberOpen(false);
      setSelectedLockerNumber(null);
      refetchLockers();
      toast({
        title: "نجح",
        description: "تم حذف رقم اللوكر بنجاح"
      });
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error?.data?.message || "حدث خطأ أثناء حذف رقم اللوكر",
        variant: "destructive"
      });
    }
  };

  // تعديل نوع اشتراك
  const handleEditSubscriptionType = async () => {
    if (!subscriptionTypeForm.name || !subscriptionTypeForm.metaValue || !subscriptionTypeForm.mtaValue || !subscriptionTypeForm.days) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    try {
      await updateLockerSubscriptionType({
        id: selectedSubscriptionType.id,
        data: {
          name: subscriptionTypeForm.name,
          metaValue: parseFloat(subscriptionTypeForm.metaValue),
          mtaValue: parseFloat(subscriptionTypeForm.mtaValue),
          days: parseInt(subscriptionTypeForm.days),
          hasStop: subscriptionTypeForm.hasStop,
          stopDays: subscriptionTypeForm.hasStop ? parseInt(subscriptionTypeForm.stopDays || "0") : null,
          isTargetBased: subscriptionTypeForm.isTargetBased,
        },
      }).unwrap();

      setIsEditSubscriptionTypeOpen(false);
      setSelectedSubscriptionType(null);
      setSubscriptionTypeForm({
        name: "",
        metaValue: "",
        mtaValue: "",
        days: "",
        hasStop: false,
        stopDays: "",
        isTargetBased: false
      });
      refetchSubscriptionTypes();
      toast({
        title: "نجح",
        description: "تم تحديث نوع الاشتراك بنجاح"
      });
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error?.data?.message || "حدث خطأ أثناء تحديث نوع الاشتراك",
        variant: "destructive"
      });
    }
  };

  // حذف نوع اشتراك
  const handleDeleteSubscriptionType = async () => {
    try {
      await deleteLockerSubscriptionType(selectedSubscriptionType.id).unwrap();
      setIsDeleteSubscriptionTypeOpen(false);
      setSelectedSubscriptionType(null);
      refetchSubscriptionTypes();
      toast({
        title: "نجح",
        description: "تم حذف نوع الاشتراك بنجاح"
      });
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error?.data?.message || "حدث خطأ أثناء حذف نوع الاشتراك",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* العنوان */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">إعدادات اللوكر</h1>
            <p className="text-gray-600 mt-1">إدارة إعدادات اللوكر وأنواع الاشتراكات</p>
          </div>
        </div>

        <Tabs defaultValue="locker-numbers" className="space-y-4">
          <TabsList>
            <TabsTrigger value="locker-numbers">
              <Key className="w-4 h-4 ml-2" />
              أرقام اللوكر
            </TabsTrigger>
            <TabsTrigger value="subscription-types">
              <Lock className="w-4 h-4 ml-2" />
              أنواع اشتراك اللوكر
            </TabsTrigger>
          </TabsList>

          {/* تبويب أرقام اللوكر */}
          <TabsContent value="locker-numbers" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>إعدادات رقم اللوكر</CardTitle>
                  <Button onClick={() => setIsAddLockerNumberOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 ml-2" />
                    إضافة رقم لوكر
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">الفرع الرئيسي</th>
                        <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">الفرع الفرعي</th>
                        <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">رقم اللوكر</th>
                        <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lockerNumbers.map((locker) => (
                        <tr key={locker.id} className="border-b hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4 whitespace-nowrap text-sm">
                            {branches.find((b: any) => b.id === locker.mainBranchId)?.arabicName ||
                             branches.find((b: any) => b.id === locker.mainBranchId)?.englishName ||
                             branches.find((b: any) => b.id === locker.mainBranchId)?.name || "-"}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap text-sm">
                            {branches.find((b: any) => b.id === locker.subBranchId)?.arabicName ||
                             branches.find((b: any) => b.id === locker.subBranchId)?.englishName ||
                             branches.find((b: any) => b.id === locker.subBranchId)?.name || "-"}
                          </td>
                          <td className="py-3 px-4 font-semibold whitespace-nowrap">{locker.lockerNumber}</td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="flex gap-2 justify-end">
                              <Button variant="ghost" size="sm" onClick={() => {
                                setSelectedLockerNumber(locker);
                                setLockerNumberForm({
                                  mainBranchId: locker.mainBranchId,
                                  subBranchId: locker.subBranchId,
                                  lockerNumber: locker.lockerNumber
                                });
                                setIsEditLockerNumberOpen(true);
                              }} title="تعديل" className="hover:bg-blue-50">
                                <Edit className="w-4 h-4 text-blue-600" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => {
                                setSelectedLockerNumber(locker);
                                setIsDeleteLockerNumberOpen(true);
                              }} title="حذف" className="hover:bg-red-50">
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {lockerNumbers.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Key className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p>لا توجد أرقام لوكر</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* تبويب أنواع اشتراك اللوكر */}
          <TabsContent value="subscription-types" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>إعدادات نوع اشتراك اللوكر</CardTitle>
                  <Button onClick={() => setIsAddSubscriptionTypeOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 ml-2" />
                    إضافة نوع اشتراك
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">إسم نوع الإشتراك</th>
                        <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">قيمة الاشتراك Meta</th>
                        <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">قيمة الاشتراك MTA</th>
                        <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">أيام الإشتراك</th>
                        <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">هل لديه وقف؟</th>
                        <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">عدد الأيام</th>
                        <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">تابع للتارجت</th>
                        <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscriptionTypes.map((type) => (
                        <tr key={type.id} className="border-b hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4 font-semibold whitespace-nowrap">{type.name}</td>
                          <td className="py-3 px-4 whitespace-nowrap text-sm">{type.metaValue}</td>
                          <td className="py-3 px-4 whitespace-nowrap text-sm">{type.mtaValue}</td>
                          <td className="py-3 px-4 whitespace-nowrap text-sm">{type.days}</td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            {type.hasStop ? <Badge className="bg-green-500">نعم</Badge> : <Badge variant="outline">لا</Badge>}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap text-sm">{type.stopDays || "-"}</td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            {type.isTargetBased ? <Badge className="bg-blue-500">نعم</Badge> : <Badge variant="outline">لا</Badge>}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="flex gap-2 justify-end">
                              <Button variant="ghost" size="sm" onClick={() => {
                                setSelectedSubscriptionType(type);
                                setSubscriptionTypeForm({
                                  name: type.name,
                                  metaValue: type.metaValue,
                                  mtaValue: type.mtaValue,
                                  days: type.days,
                                  hasStop: type.hasStop,
                                  stopDays: type.stopDays || "",
                                  isTargetBased: type.isTargetBased
                                });
                                setIsEditSubscriptionTypeOpen(true);
                              }} title="تعديل" className="hover:bg-blue-50">
                                <Edit className="w-4 h-4 text-blue-600" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => {
                                setSelectedSubscriptionType(type);
                                setIsDeleteSubscriptionTypeOpen(true);
                              }} title="حذف" className="hover:bg-red-50">
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {subscriptionTypes.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Lock className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p>لا توجد أنواع اشتراك</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dialog إضافة رقم لوكر */}
        <Dialog open={isAddLockerNumberOpen} onOpenChange={setIsAddLockerNumberOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>إضافة رقم لوكر</DialogTitle>
              <DialogDescription>
                أدخل بيانات رقم اللوكر الجديد
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mainBranch">الفرع الرئيسي *</Label>
                {branchesLoading ? (
                  <div className="text-sm text-muted-foreground">جاري تحميل الفروع...</div>
                ) : (
                  <Select
                    value={lockerNumberForm.mainBranchId}
                    onValueChange={(value) => setLockerNumberForm({ ...lockerNumberForm, mainBranchId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الفرع الرئيسي" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map((branch: any) => (
                        <SelectItem key={branch.id} value={branch.id}>
                          {branch.arabicName || branch.englishName || branch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="subBranch">الفرع الفرعي *</Label>
                <Select
                  value={lockerNumberForm.subBranchId}
                  onValueChange={(value) => setLockerNumberForm({ ...lockerNumberForm, subBranchId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الفرع الفرعي" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branch: any) => (
                      <SelectItem key={branch.id} value={branch.id}>
                        {branch.arabicName || branch.englishName || branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lockerNumber">رقم اللوكر *</Label>
                <Input
                  id="lockerNumber"
                  value={lockerNumberForm.lockerNumber}
                  onChange={(e) => setLockerNumberForm({ ...lockerNumberForm, lockerNumber: e.target.value })}
                  placeholder="أدخل رقم اللوكر"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddLockerNumberOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={handleAddLockerNumber} className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 ml-2" />
                حفظ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog إضافة نوع اشتراك */}
        <Dialog open={isAddSubscriptionTypeOpen} onOpenChange={setIsAddSubscriptionTypeOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>إضافة نوع اشتراك اللوكر</DialogTitle>
              <DialogDescription>
                أدخل بيانات نوع الاشتراك الجديد
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subscriptionName">إسم نوع الإشتراك *</Label>
                <Input
                  id="subscriptionName"
                  value={subscriptionTypeForm.name}
                  onChange={(e) => setSubscriptionTypeForm({ ...subscriptionTypeForm, name: e.target.value })}
                  placeholder="أدخل اسم نوع الاشتراك"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="metaValue">قيمة الاشتراك Meta *</Label>
                  <Input
                    id="metaValue"
                    type="number"
                    value={subscriptionTypeForm.metaValue}
                    onChange={(e) => setSubscriptionTypeForm({ ...subscriptionTypeForm, metaValue: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mtaValue">قيمة الاشتراك MTA *</Label>
                  <Input
                    id="mtaValue"
                    type="number"
                    value={subscriptionTypeForm.mtaValue}
                    onChange={(e) => setSubscriptionTypeForm({ ...subscriptionTypeForm, mtaValue: e.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="days">أيام الإشتراك *</Label>
                <Input
                  id="days"
                  type="number"
                  value={subscriptionTypeForm.days}
                  onChange={(e) => setSubscriptionTypeForm({ ...subscriptionTypeForm, days: e.target.value })}
                  placeholder="30"
                />
              </div>
              <div className="space-y-2 flex items-center gap-4 pt-2">
                <Switch
                  checked={subscriptionTypeForm.hasStop}
                  onCheckedChange={(checked) => setSubscriptionTypeForm({ ...subscriptionTypeForm, hasStop: checked })}
                />
                <Label htmlFor="hasStop">هل لديه وقف ؟</Label>
              </div>
              {subscriptionTypeForm.hasStop && (
                <div className="space-y-2">
                  <Label htmlFor="stopDays">عدد الأيام</Label>
                  <Input
                    id="stopDays"
                    type="number"
                    value={subscriptionTypeForm.stopDays}
                    onChange={(e) => setSubscriptionTypeForm({ ...subscriptionTypeForm, stopDays: e.target.value })}
                    placeholder="0"
                  />
                </div>
              )}
              <div className="space-y-2 flex items-center gap-4 pt-2">
                <Switch
                  checked={subscriptionTypeForm.isTargetBased}
                  onCheckedChange={(checked) => setSubscriptionTypeForm({ ...subscriptionTypeForm, isTargetBased: checked })}
                />
                <Label htmlFor="isTargetBased">هل الاشتراك تابع للتارجت ؟</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddSubscriptionTypeOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={handleAddSubscriptionType} className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 ml-2" />
                حفظ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog تعديل رقم لوكر */}
        <Dialog open={isEditLockerNumberOpen} onOpenChange={setIsEditLockerNumberOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>تعديل رقم لوكر</DialogTitle>
              <DialogDescription>
                قم بتعديل بيانات رقم اللوكر
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-mainBranch">الفرع الرئيسي *</Label>
                <Select
                  value={lockerNumberForm.mainBranchId}
                  onValueChange={(value) => setLockerNumberForm({ ...lockerNumberForm, mainBranchId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الفرع الرئيسي" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branch: any) => (
                      <SelectItem key={branch.id} value={branch.id}>
                        {branch.arabicName || branch.englishName || branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-subBranch">الفرع الفرعي *</Label>
                <Select
                  value={lockerNumberForm.subBranchId}
                  onValueChange={(value) => setLockerNumberForm({ ...lockerNumberForm, subBranchId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الفرع الفرعي" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branch: any) => (
                      <SelectItem key={branch.id} value={branch.id}>
                        {branch.arabicName || branch.englishName || branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-lockerNumber">رقم اللوكر *</Label>
                <Input
                  id="edit-lockerNumber"
                  value={lockerNumberForm.lockerNumber}
                  onChange={(e) => setLockerNumberForm({ ...lockerNumberForm, lockerNumber: e.target.value })}
                  placeholder="أدخل رقم اللوكر"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditLockerNumberOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={handleEditLockerNumber} className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 ml-2" />
                حفظ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog حذف رقم لوكر */}
        <Dialog open={isDeleteLockerNumberOpen} onOpenChange={setIsDeleteLockerNumberOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>تأكيد الحذف</DialogTitle>
              <DialogDescription>
                هل أنت متأكد من حذف رقم اللوكر {selectedLockerNumber?.lockerNumber}؟
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteLockerNumberOpen(false)}>
                إلغاء
              </Button>
              <Button variant="destructive" onClick={handleDeleteLockerNumber}>
                <Trash2 className="w-4 h-4 ml-2" />
                حذف
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog تعديل نوع اشتراك */}
        <Dialog open={isEditSubscriptionTypeOpen} onOpenChange={setIsEditSubscriptionTypeOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>تعديل نوع اشتراك اللوكر</DialogTitle>
              <DialogDescription>
                قم بتعديل بيانات نوع الاشتراك
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-subscriptionName">إسم نوع الإشتراك *</Label>
                <Input
                  id="edit-subscriptionName"
                  value={subscriptionTypeForm.name}
                  onChange={(e) => setSubscriptionTypeForm({ ...subscriptionTypeForm, name: e.target.value })}
                  placeholder="أدخل اسم نوع الاشتراك"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-metaValue">قيمة الاشتراك Meta *</Label>
                  <Input
                    id="edit-metaValue"
                    type="number"
                    value={subscriptionTypeForm.metaValue}
                    onChange={(e) => setSubscriptionTypeForm({ ...subscriptionTypeForm, metaValue: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-mtaValue">قيمة الاشتراك MTA *</Label>
                  <Input
                    id="edit-mtaValue"
                    type="number"
                    value={subscriptionTypeForm.mtaValue}
                    onChange={(e) => setSubscriptionTypeForm({ ...subscriptionTypeForm, mtaValue: e.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-days">أيام الإشتراك *</Label>
                <Input
                  id="edit-days"
                  type="number"
                  value={subscriptionTypeForm.days}
                  onChange={(e) => setSubscriptionTypeForm({ ...subscriptionTypeForm, days: e.target.value })}
                  placeholder="30"
                />
              </div>
              <div className="space-y-2 flex items-center gap-4 pt-2">
                <Switch
                  checked={subscriptionTypeForm.hasStop}
                  onCheckedChange={(checked) => setSubscriptionTypeForm({ ...subscriptionTypeForm, hasStop: checked })}
                />
                <Label htmlFor="edit-hasStop">هل لديه وقف ؟</Label>
              </div>
              {subscriptionTypeForm.hasStop && (
                <div className="space-y-2">
                  <Label htmlFor="edit-stopDays">عدد الأيام</Label>
                  <Input
                    id="edit-stopDays"
                    type="number"
                    value={subscriptionTypeForm.stopDays}
                    onChange={(e) => setSubscriptionTypeForm({ ...subscriptionTypeForm, stopDays: e.target.value })}
                    placeholder="0"
                  />
                </div>
              )}
              <div className="space-y-2 flex items-center gap-4 pt-2">
                <Switch
                  checked={subscriptionTypeForm.isTargetBased}
                  onCheckedChange={(checked) => setSubscriptionTypeForm({ ...subscriptionTypeForm, isTargetBased: checked })}
                />
                <Label htmlFor="edit-isTargetBased">هل الاشتراك تابع للتارجت ؟</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditSubscriptionTypeOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={handleEditSubscriptionType} className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 ml-2" />
                حفظ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog حذف نوع اشتراك */}
        <Dialog open={isDeleteSubscriptionTypeOpen} onOpenChange={setIsDeleteSubscriptionTypeOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>تأكيد الحذف</DialogTitle>
              <DialogDescription>
                هل أنت متأكد من حذف نوع الاشتراك {selectedSubscriptionType?.name}؟
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteSubscriptionTypeOpen(false)}>
                إلغاء
              </Button>
              <Button variant="destructive" onClick={handleDeleteSubscriptionType}>
                <Trash2 className="w-4 h-4 ml-2" />
                حذف
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default LockerSettings;

