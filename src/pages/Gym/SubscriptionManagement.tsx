import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  CreditCard, Plus, Search, DollarSign, Receipt, Edit, Trash2, Save,
  TrendingUp, Calendar, CheckCircle
} from "lucide-react";

const SubscriptionManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [subscriptions, setSubscriptions] = useState([
    {
      id: 1,
      memberName: "أحمد محمد",
      planType: "شهري",
      amount: 500,
      status: "نشط",
      startDate: "2024-01-15",
      endDate: "2024-02-15",
      paymentMethod: "فيزا"
    },
    {
      id: 2,
      memberName: "فاطمة علي",
      planType: "سنوي",
      amount: 4800,
      status: "نشط",
      startDate: "2023-12-01",
      endDate: "2024-12-01",
      paymentMethod: "نقدي"
    },
    {
      id: 3,
      memberName: "محمد حسن",
      planType: "ربع سنوي",
      amount: 1350,
      status: "منتهي",
      startDate: "2023-10-01",
      endDate: "2024-01-01",
      paymentMethod: "ماستركارد"
    }
  ]);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<any>(null);
  const [formData, setFormData] = useState({
    memberName: "",
    planType: "",
    amount: "",
    paymentMethod: "",
    startDate: "",
    endDate: "",
    notes: ""
  });
  const { toast } = useToast();

  const getStatusBadge = (status: string) => {
    if (status === "نشط") {
      return <Badge className="bg-green-500">نشط</Badge>;
    }
    return <Badge variant="destructive">منتهي</Badge>;
  };

  const handleAdd = () => {
    setFormData({
      memberName: "",
      planType: "",
      amount: "",
      paymentMethod: "",
      startDate: "",
      endDate: "",
      notes: ""
    });
    setIsAddDialogOpen(true);
  };

  const handleEdit = (subscription: any) => {
    setSelectedSubscription(subscription);
    setFormData({
      memberName: subscription.memberName,
      planType: subscription.planType,
      amount: subscription.amount.toString(),
      paymentMethod: subscription.paymentMethod,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      notes: subscription.notes || ""
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveAdd = () => {
    if (!formData.memberName || !formData.planType || !formData.amount || !formData.paymentMethod) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    const newSubscription = {
      id: subscriptions.length + 1,
      memberName: formData.memberName,
      planType: formData.planType,
      amount: parseFloat(formData.amount),
      paymentMethod: formData.paymentMethod,
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: "نشط"
    };
    
    setSubscriptions([...subscriptions, newSubscription]);
    setIsAddDialogOpen(false);
    toast({
      title: "نجح",
      description: "تم إضافة الاشتراك بنجاح"
    });
  };

  const handleSaveEdit = () => {
    if (!formData.memberName || !formData.planType || !formData.amount || !formData.paymentMethod) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    setSubscriptions(subscriptions.map(s => 
      s.id === selectedSubscription.id 
        ? { 
            ...s, 
            memberName: formData.memberName,
            planType: formData.planType,
            amount: parseFloat(formData.amount),
            paymentMethod: formData.paymentMethod,
            startDate: formData.startDate,
            endDate: formData.endDate
          }
        : s
    ));
    
    setIsEditDialogOpen(false);
    setSelectedSubscription(null);
    toast({
      title: "نجح",
      description: "تم تحديث الاشتراك بنجاح"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/30 to-emerald-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* العنوان */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">إدارة الاشتراكات والمدفوعات</h1>
            <p className="text-gray-600 mt-1">إدارة الاشتراكات والمدفوعات المالية</p>
          </div>
          <div className="flex gap-3">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="البحث..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            <Button className="bg-green-600 hover:bg-green-700" onClick={handleAdd}>
              <Plus className="w-5 h-5 ml-2" />
              اشتراك جديد
            </Button>
          </div>
        </div>

        {/* إحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">إجمالي الإيرادات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">250,000 ج.م</div>
              <p className="text-sm text-gray-500 mt-1">هذا الشهر</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">الاشتراكات النشطة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">890</div>
              <p className="text-sm text-gray-500 mt-1">اشتراك نشط</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">المدفوعات المعلقة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">12</div>
              <p className="text-sm text-gray-500 mt-1">في انتظار الدفع</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">متوسط القيمة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">550 ج.م</div>
              <p className="text-sm text-gray-500 mt-1">للاشتراك الواحد</p>
            </CardContent>
          </Card>
        </div>

        {/* التبويبات */}
        <Tabs defaultValue="subscriptions" className="space-y-4">
          <TabsList>
            <TabsTrigger value="subscriptions">الاشتراكات</TabsTrigger>
            <TabsTrigger value="payments">المدفوعات</TabsTrigger>
            <TabsTrigger value="invoices">الإيصالات</TabsTrigger>
          </TabsList>

          <TabsContent value="subscriptions">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  قائمة الاشتراكات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-right py-3 px-4 font-semibold">اسم العضو</th>
                        <th className="text-right py-3 px-4 font-semibold">نوع الخطة</th>
                        <th className="text-right py-3 px-4 font-semibold">المبلغ</th>
                        <th className="text-right py-3 px-4 font-semibold">الحالة</th>
                        <th className="text-right py-3 px-4 font-semibold">تاريخ البدء</th>
                        <th className="text-right py-3 px-4 font-semibold">تاريخ الانتهاء</th>
                        <th className="text-right py-3 px-4 font-semibold">طريقة الدفع</th>
                        <th className="text-right py-3 px-4 font-semibold">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscriptions.map((sub) => (
                        <tr key={sub.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{sub.memberName}</td>
                          <td className="py-3 px-4">{sub.planType}</td>
                          <td className="py-3 px-4 font-bold">{sub.amount.toLocaleString()} ج.م</td>
                          <td className="py-3 px-4">{getStatusBadge(sub.status)}</td>
                          <td className="py-3 px-4">{sub.startDate}</td>
                          <td className="py-3 px-4">{sub.endDate}</td>
                          <td className="py-3 px-4">{sub.paymentMethod}</td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2 justify-end">
                              <Button variant="ghost" size="sm" onClick={() => handleEdit(sub)} title="تعديل">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" title="إيصال">
                                <Receipt className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" title="دفع">
                                <DollarSign className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>المدفوعات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <DollarSign className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>قائمة المدفوعات سيظهر هنا</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invoices">
            <Card>
              <CardHeader>
                <CardTitle>الإيصالات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Receipt className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>قائمة الإيصالات سيظهر هنا</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dialog إضافة اشتراك جديد */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>إضافة اشتراك جديد</DialogTitle>
              <DialogDescription>
                أدخل بيانات الاشتراك الجديد
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="memberName">اسم العضو *</Label>
                  <Input
                    id="memberName"
                    value={formData.memberName}
                    onChange={(e) => setFormData({...formData, memberName: e.target.value})}
                    placeholder="اسم العضو"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="planType">نوع الخطة *</Label>
                  <Select value={formData.planType} onValueChange={(value) => setFormData({...formData, planType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر نوع الخطة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="شهري">شهري</SelectItem>
                      <SelectItem value="ربع سنوي">ربع سنوي</SelectItem>
                      <SelectItem value="نصف سنوي">نصف سنوي</SelectItem>
                      <SelectItem value="سنوي">سنوي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">المبلغ *</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    placeholder="المبلغ بالجنيه"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">طريقة الدفع *</Label>
                  <Select value={formData.paymentMethod} onValueChange={(value) => setFormData({...formData, paymentMethod: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر طريقة الدفع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="نقدي">نقدي</SelectItem>
                      <SelectItem value="فيزا">فيزا</SelectItem>
                      <SelectItem value="ماستركارد">ماستركارد</SelectItem>
                      <SelectItem value="محفظة إلكترونية">محفظة إلكترونية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">تاريخ البدء *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">تاريخ الانتهاء *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={handleSaveAdd} className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 ml-2" />
                حفظ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog تعديل اشتراك */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>تعديل بيانات الاشتراك</DialogTitle>
              <DialogDescription>
                قم بتعديل بيانات الاشتراك
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-memberName">اسم العضو *</Label>
                  <Input
                    id="edit-memberName"
                    value={formData.memberName}
                    onChange={(e) => setFormData({...formData, memberName: e.target.value})}
                    placeholder="اسم العضو"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-planType">نوع الخطة *</Label>
                  <Select value={formData.planType} onValueChange={(value) => setFormData({...formData, planType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر نوع الخطة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="شهري">شهري</SelectItem>
                      <SelectItem value="ربع سنوي">ربع سنوي</SelectItem>
                      <SelectItem value="نصف سنوي">نصف سنوي</SelectItem>
                      <SelectItem value="سنوي">سنوي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-amount">المبلغ *</Label>
                  <Input
                    id="edit-amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    placeholder="المبلغ بالجنيه"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-paymentMethod">طريقة الدفع *</Label>
                  <Select value={formData.paymentMethod} onValueChange={(value) => setFormData({...formData, paymentMethod: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر طريقة الدفع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="نقدي">نقدي</SelectItem>
                      <SelectItem value="فيزا">فيزا</SelectItem>
                      <SelectItem value="ماستركارد">ماستركارد</SelectItem>
                      <SelectItem value="محفظة إلكترونية">محفظة إلكترونية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-startDate">تاريخ البدء *</Label>
                  <Input
                    id="edit-startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-endDate">تاريخ الانتهاء *</Label>
                  <Input
                    id="edit-endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={handleSaveEdit} className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 ml-2" />
                حفظ التغييرات
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
};

export default SubscriptionManagement;

