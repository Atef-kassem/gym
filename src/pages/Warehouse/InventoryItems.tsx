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
  Package, Plus, Search, Edit, Trash2, Save, Box, AlertCircle
} from "lucide-react";

const InventoryItems = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState([
    {
      id: 1,
      name: "منتج أ",
      code: "PRD-001",
      category: "إلكترونيات",
      quantity: 150,
      minQuantity: 20,
      maxQuantity: 200,
      warehouse: "مستودع الرئيسي",
      unitPrice: 250,
      status: "متوفر"
    },
    {
      id: 2,
      name: "منتج ب",
      code: "PRD-002",
      category: "ملابس",
      quantity: 45,
      minQuantity: 30,
      maxQuantity: 100,
      warehouse: "مستودع الفرع 1",
      unitPrice: 150,
      status: "متوفر"
    },
    {
      id: 3,
      name: "منتج ج",
      code: "PRD-003",
      category: "إلكترونيات",
      quantity: 8,
      minQuantity: 15,
      maxQuantity: 50,
      warehouse: "مستودع التوزيع",
      unitPrice: 500,
      status: "ناقص"
    }
  ]);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    category: "",
    quantity: "",
    minQuantity: "",
    maxQuantity: "",
    warehouse: "",
    unitPrice: ""
  });
  const { toast } = useToast();

  const handleAdd = () => {
    setFormData({
      name: "",
      code: "",
      category: "",
      quantity: "",
      minQuantity: "",
      maxQuantity: "",
      warehouse: "",
      unitPrice: ""
    });
    setIsAddDialogOpen(true);
  };

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      code: item.code,
      category: item.category,
      quantity: item.quantity.toString(),
      minQuantity: item.minQuantity.toString(),
      maxQuantity: item.maxQuantity.toString(),
      warehouse: item.warehouse,
      unitPrice: item.unitPrice.toString()
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (item: any) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveAdd = () => {
    if (!formData.name || !formData.code || !formData.category || !formData.quantity) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    const quantity = parseInt(formData.quantity) || 0;
    const minQuantity = parseInt(formData.minQuantity) || 0;

    const newItem = {
      id: items.length + 1,
      name: formData.name,
      code: formData.code,
      category: formData.category,
      quantity,
      minQuantity,
      maxQuantity: parseInt(formData.maxQuantity) || 0,
      warehouse: formData.warehouse || "مستودع الرئيسي",
      unitPrice: parseFloat(formData.unitPrice) || 0,
      status: quantity < minQuantity ? "ناقص" : "متوفر"
    };
    
    setItems([...items, newItem]);
    setIsAddDialogOpen(false);
    toast({
      title: "نجح",
      description: "تم إضافة المنتج بنجاح"
    });
  };

  const handleSaveEdit = () => {
    if (!formData.name || !formData.code || !formData.category || !formData.quantity) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    const quantity = parseInt(formData.quantity) || 0;
    const minQuantity = parseInt(formData.minQuantity) || 0;

    setItems(items.map(i => 
      i.id === selectedItem.id 
        ? { 
            ...i, 
            name: formData.name,
            code: formData.code,
            category: formData.category,
            quantity,
            minQuantity,
            maxQuantity: parseInt(formData.maxQuantity) || 0,
            warehouse: formData.warehouse,
            unitPrice: parseFloat(formData.unitPrice) || 0,
            status: quantity < minQuantity ? "ناقص" : "متوفر"
          }
        : i
    ));
    
    setIsEditDialogOpen(false);
    setSelectedItem(null);
    toast({
      title: "نجح",
      description: "تم تحديث المنتج بنجاح"
    });
  };

  const handleConfirmDelete = () => {
    setItems(items.filter(i => i.id !== selectedItem.id));
    setIsDeleteDialogOpen(false);
    setSelectedItem(null);
    toast({
      title: "نجح",
      description: "تم حذف المنتج بنجاح"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">إدارة المنتجات</h1>
            <p className="text-gray-600 mt-1">إدارة المنتجات والعناصر في المخزون</p>
          </div>
          <div className="flex gap-3">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="البحث عن منتج..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleAdd}>
              <Plus className="w-5 h-5 ml-2" />
              إضافة منتج
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              قائمة المنتجات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-right py-3 px-4 font-semibold">الاسم</th>
                    <th className="text-right py-3 px-4 font-semibold">الكود</th>
                    <th className="text-right py-3 px-4 font-semibold">الفئة</th>
                    <th className="text-right py-3 px-4 font-semibold">الكمية</th>
                    <th className="text-right py-3 px-4 font-semibold">المستودع</th>
                    <th className="text-right py-3 px-4 font-semibold">سعر الوحدة</th>
                    <th className="text-right py-3 px-4 font-semibold">الحالة</th>
                    <th className="text-right py-3 px-4 font-semibold">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-semibold">{item.name}</td>
                      <td className="py-3 px-4 font-mono">{item.code}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{item.category}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span>{item.quantity}</span>
                          {item.quantity < item.minQuantity && (
                            <AlertCircle className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">{item.warehouse}</td>
                      <td className="py-3 px-4">{item.unitPrice.toLocaleString()} ج.م</td>
                      <td className="py-3 px-4">
                        <Badge className={item.status === "متوفر" ? "bg-green-500" : "bg-red-500"}>
                          {item.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2 justify-end">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(item)} title="تعديل">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(item)} title="حذف">
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
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>إضافة منتج جديد</DialogTitle>
              <DialogDescription>أدخل بيانات المنتج</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">اسم المنتج *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="اسم المنتج"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">كود المنتج *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                    placeholder="كود المنتج"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">الفئة *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الفئة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="إلكترونيات">إلكترونيات</SelectItem>
                      <SelectItem value="ملابس">ملابس</SelectItem>
                      <SelectItem value="أثاث">أثاث</SelectItem>
                      <SelectItem value="مواد غذائية">مواد غذائية</SelectItem>
                      <SelectItem value="أخرى">أخرى</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="warehouse">المستودع</Label>
                  <Select value={formData.warehouse} onValueChange={(value) => setFormData({...formData, warehouse: value})}>
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
                  <Label htmlFor="minQuantity">الحد الأدنى</Label>
                  <Input
                    id="minQuantity"
                    type="number"
                    value={formData.minQuantity}
                    onChange={(e) => setFormData({...formData, minQuantity: e.target.value})}
                    placeholder="الحد الأدنى"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxQuantity">الحد الأقصى</Label>
                  <Input
                    id="maxQuantity"
                    type="number"
                    value={formData.maxQuantity}
                    onChange={(e) => setFormData({...formData, maxQuantity: e.target.value})}
                    placeholder="الحد الأقصى"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="unitPrice">سعر الوحدة</Label>
                <Input
                  id="unitPrice"
                  type="number"
                  value={formData.unitPrice}
                  onChange={(e) => setFormData({...formData, unitPrice: e.target.value})}
                  placeholder="سعر الوحدة بالجنيه"
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

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>تعديل المنتج</DialogTitle>
              <DialogDescription>قم بتعديل بيانات المنتج</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">اسم المنتج *</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="اسم المنتج"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-code">كود المنتج *</Label>
                  <Input
                    id="edit-code"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                    placeholder="كود المنتج"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-category">الفئة *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الفئة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="إلكترونيات">إلكترونيات</SelectItem>
                      <SelectItem value="ملابس">ملابس</SelectItem>
                      <SelectItem value="أثاث">أثاث</SelectItem>
                      <SelectItem value="مواد غذائية">مواد غذائية</SelectItem>
                      <SelectItem value="أخرى">أخرى</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-warehouse">المستودع</Label>
                  <Select value={formData.warehouse} onValueChange={(value) => setFormData({...formData, warehouse: value})}>
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
                  <Label htmlFor="edit-minQuantity">الحد الأدنى</Label>
                  <Input
                    id="edit-minQuantity"
                    type="number"
                    value={formData.minQuantity}
                    onChange={(e) => setFormData({...formData, minQuantity: e.target.value})}
                    placeholder="الحد الأدنى"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-maxQuantity">الحد الأقصى</Label>
                  <Input
                    id="edit-maxQuantity"
                    type="number"
                    value={formData.maxQuantity}
                    onChange={(e) => setFormData({...formData, maxQuantity: e.target.value})}
                    placeholder="الحد الأقصى"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-unitPrice">سعر الوحدة</Label>
                <Input
                  id="edit-unitPrice"
                  type="number"
                  value={formData.unitPrice}
                  onChange={(e) => setFormData({...formData, unitPrice: e.target.value})}
                  placeholder="سعر الوحدة بالجنيه"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>إلغاء</Button>
              <Button onClick={handleSaveEdit} className="bg-purple-600 hover:bg-purple-700">
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
                هل أنت متأكد من حذف المنتج "{selectedItem?.name}"؟ هذا الإجراء لا يمكن التراجع عنه.
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

export default InventoryItems;

