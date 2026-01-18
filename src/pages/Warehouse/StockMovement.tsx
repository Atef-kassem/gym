import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  ArrowLeftRight, Plus, Search, Save, Package, Warehouse, TrendingUp, TrendingDown
} from "lucide-react";

const StockMovement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [movements, setMovements] = useState([
    {
      id: 1,
      product: "منتج أ",
      fromWarehouse: "مستودع الرئيسي",
      toWarehouse: "مستودع الفرع 1",
      quantity: 50,
      date: "2024-01-25",
      type: "نقل",
      status: "مكتمل"
    },
    {
      id: 2,
      product: "منتج ب",
      fromWarehouse: "مستودع التوزيع",
      toWarehouse: "مستودع الرئيسي",
      quantity: 30,
      date: "2024-01-24",
      type: "استرجاع",
      status: "مكتمل"
    },
    {
      id: 3,
      product: "منتج ج",
      fromWarehouse: "مستودع الفرع 1",
      toWarehouse: "مستودع التوزيع",
      quantity: 75,
      date: "2024-01-25",
      type: "نقل",
      status: "قيد المعالجة"
    }
  ]);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    product: "",
    fromWarehouse: "",
    toWarehouse: "",
    quantity: "",
    type: "",
    date: ""
  });
  const { toast } = useToast();

  const handleAdd = () => {
    setFormData({
      product: "",
      fromWarehouse: "",
      toWarehouse: "",
      quantity: "",
      type: "",
      date: new Date().toISOString().split('T')[0]
    });
    setIsAddDialogOpen(true);
  };

  const handleSaveAdd = () => {
    if (!formData.product || !formData.fromWarehouse || !formData.toWarehouse || !formData.quantity) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    const newMovement = {
      id: movements.length + 1,
      product: formData.product,
      fromWarehouse: formData.fromWarehouse,
      toWarehouse: formData.toWarehouse,
      quantity: parseInt(formData.quantity),
      date: formData.date,
      type: formData.type || "نقل",
      status: "قيد المعالجة"
    };
    
    setMovements([...movements, newMovement]);
    setIsAddDialogOpen(false);
    toast({
      title: "نجح",
      description: "تم إضافة حركة المخزون بنجاح"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">حركة المخزون</h1>
            <p className="text-gray-600 mt-1">إدارة نقل وتحويل المخزون بين المستودعات</p>
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
            <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleAdd}>
              <Plus className="w-5 h-5 ml-2" />
              حركة جديدة
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowLeftRight className="w-5 h-5" />
              سجل حركات المخزون
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-right py-3 px-4 font-semibold">المنتج</th>
                    <th className="text-right py-3 px-4 font-semibold">من مستودع</th>
                    <th className="text-right py-3 px-4 font-semibold">إلى مستودع</th>
                    <th className="text-right py-3 px-4 font-semibold">الكمية</th>
                    <th className="text-right py-3 px-4 font-semibold">النوع</th>
                    <th className="text-right py-3 px-4 font-semibold">التاريخ</th>
                    <th className="text-right py-3 px-4 font-semibold">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {movements.map((movement) => (
                    <tr key={movement.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-semibold">{movement.product}</td>
                      <td className="py-3 px-4">{movement.fromWarehouse}</td>
                      <td className="py-3 px-4">{movement.toWarehouse}</td>
                      <td className="py-3 px-4">{movement.quantity}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{movement.type}</Badge>
                      </td>
                      <td className="py-3 px-4">{movement.date}</td>
                      <td className="py-3 px-4">
                        <Badge className={movement.status === "مكتمل" ? "bg-green-500" : "bg-amber-500"}>
                          {movement.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>حركة مخزون جديدة</DialogTitle>
              <DialogDescription>أدخل بيانات حركة المخزون</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="product">المنتج *</Label>
                <Input
                  id="product"
                  value={formData.product}
                  onChange={(e) => setFormData({...formData, product: e.target.value})}
                  placeholder="اسم المنتج"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fromWarehouse">من مستودع *</Label>
                  <Select value={formData.fromWarehouse} onValueChange={(value) => setFormData({...formData, fromWarehouse: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المستودع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="مستودع الرئيسي">مستودع الرئيسي</SelectItem>
                      <SelectItem value="مستودع الفرع 1">مستودع الفرع 1</SelectItem>
                      <SelectItem value="مستودع التوزيع">مستودع التوزيع</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="toWarehouse">إلى مستودع *</Label>
                  <Select value={formData.toWarehouse} onValueChange={(value) => setFormData({...formData, toWarehouse: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المستودع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="مستودع الرئيسي">مستودع الرئيسي</SelectItem>
                      <SelectItem value="مستودع الفرع 1">مستودع الفرع 1</SelectItem>
                      <SelectItem value="مستودع التوزيع">مستودع التوزيع</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">الكمية *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    placeholder="الكمية"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">النوع</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر النوع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="نقل">نقل</SelectItem>
                      <SelectItem value="استرجاع">استرجاع</SelectItem>
                      <SelectItem value="تعديل">تعديل</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">التاريخ *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>إلغاء</Button>
              <Button onClick={handleSaveAdd} className="bg-purple-600 hover:bg-purple-700">
                <Save className="w-4 h-4 ml-2" /> حفظ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default StockMovement;

