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
  DollarSign, Plus, Search, Edit, Trash2, Save, CheckCircle, XCircle, TrendingUp
} from "lucide-react";

const SalesManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sales, setSales] = useState([
    {
      id: 1,
      customerName: "أحمد محمد",
      product: "منتج أ",
      quantity: 10,
      unitPrice: 500,
      total: 5000,
      date: "2024-01-25",
      salesperson: "محمد علي",
      status: "مكتمل",
      paymentMethod: "نقدي"
    },
    {
      id: 2,
      customerName: "فاطمة علي",
      product: "منتج ب",
      quantity: 5,
      unitPrice: 750,
      total: 3750,
      date: "2024-01-24",
      salesperson: "سارة أحمد",
      status: "معلق",
      paymentMethod: "بطاقة"
    },
    {
      id: 3,
      customerName: "محمد حسن",
      product: "منتج ج",
      quantity: 15,
      unitPrice: 300,
      total: 4500,
      date: "2024-01-25",
      salesperson: "أحمد محمود",
      status: "ملغى",
      paymentMethod: "-"
    }
  ]);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<any>(null);
  const [formData, setFormData] = useState({
    customerName: "",
    product: "",
    quantity: "",
    unitPrice: "",
    date: "",
    salesperson: "",
    status: "",
    paymentMethod: ""
  });
  const { toast } = useToast();

  const handleAdd = () => {
    setFormData({
      customerName: "",
      product: "",
      quantity: "",
      unitPrice: "",
      date: new Date().toISOString().split('T')[0],
      salesperson: "",
      status: "معلق",
      paymentMethod: ""
    });
    setIsAddDialogOpen(true);
  };

  const handleEdit = (sale: any) => {
    setSelectedSale(sale);
    setFormData({
      customerName: sale.customerName,
      product: sale.product,
      quantity: sale.quantity.toString(),
      unitPrice: sale.unitPrice.toString(),
      date: sale.date,
      salesperson: sale.salesperson,
      status: sale.status,
      paymentMethod: sale.paymentMethod
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (sale: any) => {
    setSelectedSale(sale);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveAdd = () => {
    if (!formData.customerName || !formData.product || !formData.quantity || !formData.unitPrice) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    const quantity = parseFloat(formData.quantity) || 0;
    const unitPrice = parseFloat(formData.unitPrice) || 0;
    const total = quantity * unitPrice;

    const newSale = {
      id: sales.length + 1,
      customerName: formData.customerName,
      product: formData.product,
      quantity,
      unitPrice,
      total,
      date: formData.date,
      salesperson: formData.salesperson || "-",
      status: formData.status || "معلق",
      paymentMethod: formData.paymentMethod || "-"
    };
    
    setSales([...sales, newSale]);
    setIsAddDialogOpen(false);
    toast({
      title: "نجح",
      description: "تم إضافة عملية البيع بنجاح"
    });
  };

  const handleSaveEdit = () => {
    if (!formData.customerName || !formData.product || !formData.quantity || !formData.unitPrice) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    const quantity = parseFloat(formData.quantity) || 0;
    const unitPrice = parseFloat(formData.unitPrice) || 0;
    const total = quantity * unitPrice;

    setSales(sales.map(s => 
      s.id === selectedSale.id 
        ? { 
            ...s, 
            customerName: formData.customerName,
            product: formData.product,
            quantity,
            unitPrice,
            total,
            date: formData.date,
            salesperson: formData.salesperson || s.salesperson,
            status: formData.status || s.status,
            paymentMethod: formData.paymentMethod || s.paymentMethod
          }
        : s
    ));
    
    setIsEditDialogOpen(false);
    setSelectedSale(null);
    toast({
      title: "نجح",
      description: "تم تحديث عملية البيع بنجاح"
    });
  };

  const handleConfirmDelete = () => {
    setSales(sales.filter(s => s.id !== selectedSale.id));
    setIsDeleteDialogOpen(false);
    setSelectedSale(null);
    toast({
      title: "نجح",
      description: "تم حذف عملية البيع بنجاح"
    });
  };

  const totalSales = sales.filter(s => s.status === "مكتمل").reduce((sum, s) => sum + s.total, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50/30 to-rose-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">إدارة المبيعات</h1>
            <p className="text-gray-600 mt-1">إدارة وتتبع عمليات المبيعات</p>
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
            <Button className="bg-pink-600 hover:bg-pink-700" onClick={handleAdd}>
              <Plus className="w-5 h-5 ml-2" />
              عملية بيع جديدة
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">إجمالي المبيعات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{totalSales.toLocaleString()} ج.م</div>
              <p className="text-sm text-gray-500 mt-1">المبيعات المكتملة</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">عدد العمليات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{sales.length}</div>
              <p className="text-sm text-gray-500 mt-1">عملية بيع</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">المعلقة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">{sales.filter(s => s.status === "معلق").length}</div>
              <p className="text-sm text-gray-500 mt-1">عملية معلقة</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              قائمة عمليات البيع
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-right py-3 px-4 font-semibold">اسم العميل</th>
                    <th className="text-right py-3 px-4 font-semibold">المنتج</th>
                    <th className="text-right py-3 px-4 font-semibold">الكمية</th>
                    <th className="text-right py-3 px-4 font-semibold">سعر الوحدة</th>
                    <th className="text-right py-3 px-4 font-semibold">الإجمالي</th>
                    <th className="text-right py-3 px-4 font-semibold">التاريخ</th>
                    <th className="text-right py-3 px-4 font-semibold">البائع</th>
                    <th className="text-right py-3 px-4 font-semibold">الحالة</th>
                    <th className="text-right py-3 px-4 font-semibold">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map((sale) => (
                    <tr key={sale.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-semibold">{sale.customerName}</td>
                      <td className="py-3 px-4">{sale.product}</td>
                      <td className="py-3 px-4">{sale.quantity}</td>
                      <td className="py-3 px-4">{sale.unitPrice.toLocaleString()} ج.م</td>
                      <td className="py-3 px-4 font-bold text-green-600">{sale.total.toLocaleString()} ج.م</td>
                      <td className="py-3 px-4">{sale.date}</td>
                      <td className="py-3 px-4">{sale.salesperson}</td>
                      <td className="py-3 px-4">
                        <Badge className={
                          sale.status === "مكتمل" ? "bg-green-500" :
                          sale.status === "معلق" ? "bg-amber-500" : "bg-red-500"
                        }>
                          {sale.status === "مكتمل" ? <CheckCircle className="w-3 h-3 ml-1" /> :
                           sale.status === "معلق" ? <XCircle className="w-3 h-3 ml-1" /> :
                           <XCircle className="w-3 h-3 ml-1" />}
                          {sale.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2 justify-end">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(sale)} title="تعديل">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(sale)} title="حذف">
                            <Trash2 className="w-4 h-4 text-red-500" />
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

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>عملية بيع جديدة</DialogTitle>
              <DialogDescription>أدخل بيانات عملية البيع</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">اسم العميل *</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                    placeholder="اسم العميل"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product">المنتج *</Label>
                  <Input
                    id="product"
                    value={formData.product}
                    onChange={(e) => setFormData({...formData, product: e.target.value})}
                    placeholder="اسم المنتج"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
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
                  <Label htmlFor="unitPrice">سعر الوحدة (ج.م) *</Label>
                  <Input
                    id="unitPrice"
                    type="number"
                    value={formData.unitPrice}
                    onChange={(e) => setFormData({...formData, unitPrice: e.target.value})}
                    placeholder="السعر"
                  />
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
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="salesperson">البائع</Label>
                  <Input
                    id="salesperson"
                    value={formData.salesperson}
                    onChange={(e) => setFormData({...formData, salesperson: e.target.value})}
                    placeholder="اسم البائع"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">الحالة</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="مكتمل">مكتمل</SelectItem>
                      <SelectItem value="معلق">معلق</SelectItem>
                      <SelectItem value="ملغى">ملغى</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">طريقة الدفع</Label>
                  <Select value={formData.paymentMethod} onValueChange={(value) => setFormData({...formData, paymentMethod: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الطريقة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="نقدي">نقدي</SelectItem>
                      <SelectItem value="بطاقة">بطاقة</SelectItem>
                      <SelectItem value="تحويل">تحويل</SelectItem>
                      <SelectItem value="آجل">آجل</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>إلغاء</Button>
              <Button onClick={handleSaveAdd} className="bg-pink-600 hover:bg-pink-700">
                <Save className="w-4 h-4 ml-2" /> حفظ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>تعديل عملية البيع</DialogTitle>
              <DialogDescription>قم بتعديل بيانات عملية البيع</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-customerName">اسم العميل *</Label>
                  <Input
                    id="edit-customerName"
                    value={formData.customerName}
                    onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                    placeholder="اسم العميل"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-product">المنتج *</Label>
                  <Input
                    id="edit-product"
                    value={formData.product}
                    onChange={(e) => setFormData({...formData, product: e.target.value})}
                    placeholder="اسم المنتج"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-quantity">الكمية *</Label>
                  <Input
                    id="edit-quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    placeholder="الكمية"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-unitPrice">سعر الوحدة (ج.م) *</Label>
                  <Input
                    id="edit-unitPrice"
                    type="number"
                    value={formData.unitPrice}
                    onChange={(e) => setFormData({...formData, unitPrice: e.target.value})}
                    placeholder="السعر"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-date">التاريخ *</Label>
                  <Input
                    id="edit-date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-salesperson">البائع</Label>
                  <Input
                    id="edit-salesperson"
                    value={formData.salesperson}
                    onChange={(e) => setFormData({...formData, salesperson: e.target.value})}
                    placeholder="اسم البائع"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">الحالة</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="مكتمل">مكتمل</SelectItem>
                      <SelectItem value="معلق">معلق</SelectItem>
                      <SelectItem value="ملغى">ملغى</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-paymentMethod">طريقة الدفع</Label>
                  <Select value={formData.paymentMethod} onValueChange={(value) => setFormData({...formData, paymentMethod: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الطريقة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="نقدي">نقدي</SelectItem>
                      <SelectItem value="بطاقة">بطاقة</SelectItem>
                      <SelectItem value="تحويل">تحويل</SelectItem>
                      <SelectItem value="آجل">آجل</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>إلغاء</Button>
              <Button onClick={handleSaveEdit} className="bg-pink-600 hover:bg-pink-700">
                <Save className="w-4 h-4 ml-2" /> حفظ التغييرات
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>تأكيد الحذف</DialogTitle>
              <DialogDescription>
                هل أنت متأكد من حذف عملية البيع للعميل "{selectedSale?.customerName}"؟ هذا الإجراء لا يمكن التراجع عنه.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>إلغاء</Button>
              <Button variant="destructive" onClick={handleConfirmDelete}>
                <Trash2 className="w-4 h-4 ml-2" /> حذف
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default SalesManagement;

