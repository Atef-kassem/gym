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
  CreditCard, Plus, Search, CheckCircle, XCircle, Save,
  TrendingUp, DollarSign, Calendar
} from "lucide-react";

const OnlinePayments = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [payments, setPayments] = useState([
    {
      id: 1,
      memberName: "أحمد محمد",
      amount: 500,
      method: "فيزا",
      transactionId: "TXN-001-2024",
      status: "نجح",
      date: "2024-01-25",
      time: "10:30"
    },
    {
      id: 2,
      memberName: "فاطمة علي",
      amount: 4800,
      method: "ماستركارد",
      transactionId: "TXN-002-2024",
      status: "نجح",
      date: "2024-01-25",
      time: "11:15"
    },
    {
      id: 3,
      memberName: "محمد حسن",
      amount: 350,
      method: "فيزا",
      transactionId: "TXN-003-2024",
      status: "فشل",
      date: "2024-01-25",
      time: "14:20"
    }
  ]);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    memberName: "",
    amount: "",
    method: "",
    date: "",
    time: ""
  });
  const { toast } = useToast();

  const getStatusBadge = (status: string) => {
    if (status === "نجح") {
      return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 ml-1" /> {status}</Badge>;
    }
    return <Badge variant="destructive"><XCircle className="w-3 h-3 ml-1" /> {status}</Badge>;
  };

  const generateTransactionId = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `TXN-${random}-${year}`;
  };

  const handleAdd = () => {
    const now = new Date();
    setFormData({
      memberName: "",
      amount: "",
      method: "",
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().slice(0, 5)
    });
    setIsAddDialogOpen(true);
  };

  const handleSaveAdd = () => {
    if (!formData.memberName || !formData.amount || !formData.method) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    const newPayment = {
      id: payments.length + 1,
      memberName: formData.memberName,
      amount: parseFloat(formData.amount),
      method: formData.method,
      transactionId: generateTransactionId(),
      status: "نجح",
      date: formData.date,
      time: formData.time
    };
    
    setPayments([...payments, newPayment]);
    setIsAddDialogOpen(false);
    toast({
      title: "نجح",
      description: "تم إضافة المعاملة بنجاح"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/30 to-emerald-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* العنوان */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">الدفع الإلكتروني</h1>
            <p className="text-gray-600 mt-1">إدارة المدفوعات الإلكترونية</p>
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
              معاملة جديدة
            </Button>
          </div>
        </div>

        {/* إحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">إجمالي المدفوعات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">125,000 ج.م</div>
              <p className="text-sm text-gray-500 mt-1">هذا الشهر</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">المعاملات الناجحة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">245</div>
              <p className="text-sm text-gray-500 mt-1">معاملة ناجحة</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">المعاملات الفاشلة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">12</div>
              <p className="text-sm text-gray-500 mt-1">معاملة فاشلة</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">معدل النجاح</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">95.3%</div>
              <p className="text-sm text-gray-500 mt-1">نسبة النجاح</p>
            </CardContent>
          </Card>
        </div>

        {/* التبويبات */}
        <Tabs defaultValue="transactions" className="space-y-4">
          <TabsList>
            <TabsTrigger value="transactions">المعاملات</TabsTrigger>
            <TabsTrigger value="methods">طرق الدفع</TabsTrigger>
            <TabsTrigger value="settings">الإعدادات</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  المعاملات الأخيرة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-right py-3 px-4 font-semibold">اسم العضو</th>
                        <th className="text-right py-3 px-4 font-semibold">المبلغ</th>
                        <th className="text-right py-3 px-4 font-semibold">طريقة الدفع</th>
                        <th className="text-right py-3 px-4 font-semibold">رقم المعاملة</th>
                        <th className="text-right py-3 px-4 font-semibold">الحالة</th>
                        <th className="text-right py-3 px-4 font-semibold">التاريخ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((payment) => (
                        <tr key={payment.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-semibold">{payment.memberName}</td>
                          <td className="py-3 px-4 font-bold text-green-600">{payment.amount.toLocaleString()} ج.م</td>
                          <td className="py-3 px-4">{payment.method}</td>
                          <td className="py-3 px-4 font-mono text-sm">{payment.transactionId}</td>
                          <td className="py-3 px-4">{getStatusBadge(payment.status)}</td>
                          <td className="py-3 px-4">
                            <div className="text-sm">
                              <div>{payment.date}</div>
                              <div className="text-gray-500">{payment.time}</div>
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

          <TabsContent value="methods">
            <Card>
              <CardHeader>
                <CardTitle>طرق الدفع المتاحة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="border-l-4 border-l-blue-500">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                        فيزا / ماستركارد
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Badge className="bg-green-500">نشط</Badge>
                    </CardContent>
                  </Card>
                  <Card className="border-l-4 border-l-green-500">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-green-600" />
                        محافظ إلكترونية
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Badge className="bg-green-500">نشط</Badge>
                    </CardContent>
                  </Card>
                  <Card className="border-l-4 border-l-purple-500">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-purple-600" />
                        التحويل البنكي
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Badge className="bg-gray-500">غير نشط</Badge>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>إعدادات الدفع</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <CreditCard className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>إعدادات الدفع الإلكتروني سيظهر هنا</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dialog إضافة معاملة جديدة */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>إضافة معاملة جديدة</DialogTitle>
              <DialogDescription>أدخل بيانات المعاملة</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="memberName">اسم العضو *</Label>
                <Input
                  id="memberName"
                  value={formData.memberName}
                  onChange={(e) => setFormData({...formData, memberName: e.target.value})}
                  placeholder="اسم العضو"
                />
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
                  <Label htmlFor="method">طريقة الدفع *</Label>
                  <Select value={formData.method} onValueChange={(value) => setFormData({...formData, method: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الطريقة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="فيزا">فيزا</SelectItem>
                      <SelectItem value="ماستركارد">ماستركارد</SelectItem>
                      <SelectItem value="مدى">مدى</SelectItem>
                      <SelectItem value="محفظة إلكترونية">محفظة إلكترونية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">التاريخ *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">الوقت *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>إلغاء</Button>
              <Button onClick={handleSaveAdd} className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 ml-2" /> حفظ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
};

export default OnlinePayments;

