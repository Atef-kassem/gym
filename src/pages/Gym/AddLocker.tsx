import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useGetAllBranchesQuery } from "@/services/branchesApi";
import { useGetAllMembersQuery } from "@/services/membersApi";
import {
  useGetLockerSubscriptionTypesQuery,
  useGetAllLockersQuery,
  useCreateLockerSubscriptionMutation,
} from "@/services/lockersApi";
import { useGetTrainersQuery } from "@/services/employeesApi";
import {
  Plus, Save, Lock, Calendar
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AddLocker = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { data: branchesData, isLoading: branchesLoading } = useGetAllBranchesQuery(undefined as any);
  const branches = Array.isArray(branchesData?.data) ? branchesData.data : [];

  // جلب أنواع اشتراك اللوكر
  const { data: subscriptionTypesData } = useGetLockerSubscriptionTypesQuery();
  const subscriptionTypes = Array.isArray(subscriptionTypesData?.data) ? subscriptionTypesData.data : [];

  // جلب الأعضاء لاستخدامهم كعملاء للاشتراك
  const { data: membersData } = useGetAllMembersQuery({} as any);
  const members = Array.isArray(membersData?.data) ? membersData.data : [];

  // جلب اللوكر المتاحة
  const { data: lockersData } = useGetAllLockersQuery({ isAvailable: true });
  const availableLockers = Array.isArray(lockersData?.data) ? lockersData.data : [];

  // جلب المدربين/الموظفين
  const { data: trainersData } = useGetTrainersQuery();
  const trainers = Array.isArray(trainersData?.data) ? trainersData.data : [];

  // Mutation
  const [createLockerSubscription] = useCreateLockerSubscriptionMutation();

  const [formData, setFormData] = useState({
    subscriptionNumber: "",
    mainBranchId: "",
    subBranchId: "",
    customerName: "",
    memberId: "",
    subscriptionType: "",
    subscriptionDays: "",
    subscriptionStartDate: "",
    subscriptionEndDate: "",
    subscriptionValue: "",
    discountEnabled: false,
    discountValue: "0",
    paidAmount: "0.00",
    lockerId: "",
    paymentMethod: "",
    gender: "",
    recommendedEmployeeId: "",
    receiptNumber: ""
  });

  const [startDateInput, setStartDateInput] = useState("");
  const [endDateInput, setEndDateInput] = useState("");

  // تحويل التاريخ من dd/mm/yyyy إلى yyyy-mm-dd
  const convertDateToISO = (dateStr: string): string => {
    if (!dateStr) return "";
    const parts = dateStr.split("/");
    if (parts.length !== 3) return "";
    const [day, month, year] = parts;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

  const handleSave = async () => {
    // التحقق من الحقول المطلوبة
    if (!formData.mainBranchId || !formData.subBranchId || !formData.memberId || 
        !formData.subscriptionType || !formData.subscriptionStartDate || 
        !formData.subscriptionEndDate || !formData.subscriptionValue || 
        !formData.paymentMethod || !formData.lockerId) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    try {
      const lockerSubscriptionData = {
        subscriptionNumber: formData.subscriptionNumber,
        mainBranchId: formData.mainBranchId,
        subBranchId: formData.subBranchId,
        customerName: formData.customerName,
        subscriptionTypeId: formData.subscriptionType,
        subscriptionDays: formData.subscriptionDays ? parseInt(formData.subscriptionDays) : null,
        subscriptionStartDate: formData.subscriptionStartDate,
        subscriptionEndDate: formData.subscriptionEndDate,
        subscriptionValue: formData.subscriptionValue,
        discountEnabled: formData.discountEnabled,
        discountValue: formData.discountValue,
        paidAmount: formData.paidAmount || "0",
        lockerId: formData.lockerId,
        paymentMethod: formData.paymentMethod,
        gender: formData.gender || null,
        recommendedEmployeeId: formData.recommendedEmployeeId || null,
        receiptNumber: formData.receiptNumber,
      };

      await createLockerSubscription(lockerSubscriptionData).unwrap();
      toast({
        title: "نجح",
        description: "تم إضافة اشتراك اللوكر بنجاح"
      });

      // إعادة تعيين النموذج
      setFormData({
        subscriptionNumber: "",
        mainBranchId: "",
        subBranchId: "",
        customerName: "",
        memberId: "",
        subscriptionType: "",
        subscriptionDays: "",
        subscriptionStartDate: "",
        subscriptionEndDate: "",
        subscriptionValue: "",
        discountEnabled: false,
        discountValue: "0",
        paidAmount: "0.00",
        lockerId: "",
        paymentMethod: "",
        gender: "",
        recommendedEmployeeId: "",
        receiptNumber: ""
      });
      setStartDateInput("");
      setEndDateInput("");
      
      // الانتقال إلى قائمة اللوكر
      navigate("/gym/lockers");
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error?.data?.message || "حدث خطأ أثناء إضافة اشتراك اللوكر",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* العنوان */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">إضافة اشتراك اللوكر</h1>
            <p className="text-muted-foreground mt-1">إضافة اشتراك جديد للوكر</p>
          </div>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4 ml-2" />
            حفظ
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>بيانات الاشتراك</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* رقم الإشتراك */}
              <div className="space-y-2">
                <Label htmlFor="subscriptionNumber">رقم الإشتراك</Label>
                <Input
                  id="subscriptionNumber"
                  value={formData.subscriptionNumber}
                  onChange={(e) => setFormData({...formData, subscriptionNumber: e.target.value})}
                  placeholder="99"
                />
              </div>

              {/* الفرع الرئيسي */}
              <div className="space-y-2">
                <Label htmlFor="mainBranchId">الفرع الرئيسي *</Label>
                {branchesLoading ? (
                  <div className="text-sm text-muted-foreground">جاري تحميل الفروع...</div>
                ) : (
                  <Select
                    value={formData.mainBranchId}
                    onValueChange={(value) => setFormData({...formData, mainBranchId: value})}
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

              {/* الفرع الفرعي */}
              <div className="space-y-2">
                <Label htmlFor="subBranchId">الفرع الفرعي *</Label>
                <Select
                  value={formData.subBranchId}
                  onValueChange={(value) => setFormData({...formData, subBranchId: value})}
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

              {/* إسم العميل (من جدول الأعضاء) */}
              <div className="space-y-2">
                <Label htmlFor="memberId">إسم العميل *</Label>
                <Select
                  value={formData.memberId}
                  onValueChange={(value) => {
                    const selectedMember = members.find((m: any) => m.id === value);
                    setFormData({
                      ...formData,
                      memberId: value,
                      customerName: selectedMember?.name || "",
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر العضو" />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((member: any) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name} {member.memberCode ? `(${member.memberCode})` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* نوع الاشتراك */}
              <div className="space-y-2">
                <Label htmlFor="subscriptionType">نوع الاشتراك *</Label>
                <Select
                  value={formData.subscriptionType}
                  onValueChange={(value) => {
                    const selectedType = subscriptionTypes.find((t: any) => t.id === value);
                    setFormData({
                      ...formData,
                      subscriptionType: value,
                      subscriptionDays: selectedType?.days?.toString() || "",
                      subscriptionValue: selectedType?.metaValue?.toString() || formData.subscriptionValue,
                    });

                    // في حال كان تاريخ البداية محدداً، نحسب تاريخ النهاية تلقائياً
                    if (startDateInput && selectedType?.days) {
                      const [day, month, year] = startDateInput.split("/").map((p) => parseInt(p, 10));
                      const start = new Date(year, month - 1, day);
                      start.setDate(start.getDate() + selectedType.days);
                      const endDay = String(start.getDate()).padStart(2, "0");
                      const endMonth = String(start.getMonth() + 1).padStart(2, "0");
                      const endYear = start.getFullYear();
                      const endFormatted = `${endDay}/${endMonth}/${endYear}`;
                      setEndDateInput(endFormatted);
                      setFormData((prev) => ({
                        ...prev,
                        subscriptionEndDate: convertDateToISO(endFormatted),
                      }));
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع الاشتراك" />
                  </SelectTrigger>
                  <SelectContent>
                    {subscriptionTypes.map((type: any) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* عدد أيام الاشتراك */}
              <div className="space-y-2">
                <Label htmlFor="subscriptionDays">عدد أيام الاشتراك</Label>
                <Input
                  id="subscriptionDays"
                  type="number"
                  value={formData.subscriptionDays}
                  onChange={(e) => setFormData({...formData, subscriptionDays: e.target.value})}
                  placeholder="30"
                />
              </div>

              {/* مدة الإشتراك من */}
              <div className="space-y-2">
                <Label htmlFor="subscriptionStartDate">مدة الإشتراك من *</Label>
                <Input
                  id="subscriptionStartDate"
                  type="date"
                  value={formData.subscriptionStartDate}
                  onChange={(e) => {
                    const isoDate = e.target.value; // yyyy-mm-dd
                    setFormData({ ...formData, subscriptionStartDate: isoDate });
                    // تحديث الحالة النصية فقط للعرض إذا احتجنا
                    const [year, month, day] = isoDate.split("-");
                    const formatted = `${day}/${month}/${year}`;
                    setStartDateInput(formatted);

                    // إذا كان نوع الاشتراك له عدد أيام، احسب تاريخ النهاية تلقائياً
                    const selectedType = subscriptionTypes.find((t: any) => t.id === formData.subscriptionType);
                    if (selectedType?.days) {
                      const start = new Date(Number(year), Number(month) - 1, Number(day));
                      start.setDate(start.getDate() + selectedType.days);
                      const endDay = String(start.getDate()).padStart(2, "0");
                      const endMonth = String(start.getMonth() + 1).padStart(2, "0");
                      const endYear = start.getFullYear();
                      const endIso = `${endYear}-${endMonth}-${endDay}`;
                      setFormData((prev) => ({
                        ...prev,
                        subscriptionEndDate: endIso,
                      }));
                      setEndDateInput(`${endDay}/${endMonth}/${endYear}`);
                    }
                  }}
                />
              </div>

              {/* مدة الإشتراك إلى */}
              <div className="space-y-2">
                <Label htmlFor="subscriptionEndDate">مدة الإشتراك إلى *</Label>
                <Input
                  id="subscriptionEndDate"
                  type="date"
                  value={formData.subscriptionEndDate}
                  onChange={(e) => {
                    const isoDate = e.target.value;
                    setFormData({ ...formData, subscriptionEndDate: isoDate });
                    const [year, month, day] = isoDate.split("-");
                    setEndDateInput(`${day}/${month}/${year}`);
                  }}
                />
              </div>

              {/* قيمة الإشتراك */}
              <div className="space-y-2">
                <Label htmlFor="subscriptionValue">قيمة الإشتراك *</Label>
                <Input
                  id="subscriptionValue"
                  type="number"
                  value={formData.subscriptionValue}
                  onChange={(e) => {
                    setFormData({...formData, subscriptionValue: e.target.value});
                  }}
                  placeholder="0"
                />
              </div>

              {/* حالة الخصم */}
              <div className="space-y-2 flex items-center gap-4 pt-6">
                <Switch
                  checked={formData.discountEnabled}
                  onCheckedChange={(checked) => {
                    setFormData({...formData, discountEnabled: checked});
                  }}
                />
                <Label htmlFor="discountEnabled">حالة الخصم</Label>
              </div>

              {/* قيمة الخصم */}
              <div className="space-y-2">
                <Label htmlFor="discountValue">قيمة الخصم</Label>
                <Input
                  id="discountValue"
                  type="number"
                  value={formData.discountValue}
                  onChange={(e) => {
                    setFormData({...formData, discountValue: e.target.value});
                  }}
                  placeholder="0"
                  disabled={!formData.discountEnabled}
                />
              </div>

              {/* المدفوع */}
              <div className="space-y-2">
                <Label htmlFor="paidAmount">المدفوع</Label>
                <Input
                  id="paidAmount"
                  type="number"
                  value={formData.paidAmount}
                  onChange={(e) => {
                    setFormData({...formData, paidAmount: e.target.value});
                  }}
                  placeholder="0.00"
                />
              </div>

              {/* إختر رقم اللوكر */}
              <div className="space-y-2">
                <Label htmlFor="lockerId">إختر رقم اللوكر *</Label>
                <Select
                  value={formData.lockerId}
                  onValueChange={(value) => setFormData({...formData, lockerId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر رقم اللوكر" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableLockers.map((locker: any) => (
                      <SelectItem key={locker.id} value={locker.id}>
                        {locker.lockerNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* طريقة الدفع */}
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">طريقة الدفع *</Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(value) => setFormData({...formData, paymentMethod: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر طريقة الدفع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">نقدي</SelectItem>
                    <SelectItem value="card">بطاقة</SelectItem>
                    <SelectItem value="bank">تحويل بنكي</SelectItem>
                    <SelectItem value="online">دفع إلكتروني</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* رجالي - حريمي */}
              <div className="space-y-2">
                <Label htmlFor="gender">رجالي - حريمي</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => setFormData({...formData, gender: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">رجالي</SelectItem>
                    <SelectItem value="female">حريمي</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* الموظف الموصي به */}
              <div className="space-y-2">
                <Label htmlFor="recommendedEmployeeId">الموظف الموصي به</Label>
                <Select
                  value={formData.recommendedEmployeeId}
                  onValueChange={(value) => setFormData({...formData, recommendedEmployeeId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الموظف" />
                  </SelectTrigger>
                  <SelectContent>
                    {trainers.map((trainer: any) => (
                      <SelectItem key={trainer.id} value={trainer.id}>
                        {trainer.arabicName || trainer.englishName || trainer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* رقم الايصال */}
              <div className="space-y-2 md:col-span-3">
                <Label htmlFor="receiptNumber">رقم الايصال</Label>
                <Input
                  id="receiptNumber"
                  value={formData.receiptNumber}
                  onChange={(e) => setFormData({...formData, receiptNumber: e.target.value})}
                  placeholder="أدخل رقم الإيصال"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddLocker;

