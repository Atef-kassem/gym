import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Warehouse, Plus, Search, Edit, Trash2, Save, MapPin, Building, Package
} from "lucide-react";

const WarehouseManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [warehouses, setWarehouses] = useState([
    {
      id: 1,
      name: "مستودع الرئيسي",
      location: "القاهرة - المقطم",
      type: "رئيسي",
      capacity: 5000,
      currentStock: 3200,
      status: "نشط",
      manager: "أحمد محمد"
    },
    {
      id: 2,
      name: "مستودع الفرع 1",
      location: "الإسكندرية",
      type: "فرعي",
      capacity: 3000,
      currentStock: 1800,
      status: "نشط",
      manager: "فاطمة علي"
    },
    {
      id: 3,
      name: "مستودع التوزيع",
      location: "الجيزة",
      type: "توزيع",
      capacity: 2500,
      currentStock: 2100,
      status: "نشط",
      manager: "محمد حسن"
    }
  ]);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    type: "",
    capacity: "",
    manager: "",
    notes: ""
  });
  const { toast } = useToast();

  const handleAdd = () => {
    setFormData({
      name: "",
      location: "",
      type: "",
      capacity: "",
      manager: "",
      notes: ""
    });
    setIsAddDialogOpen(true);
  };

  const handleEdit = (warehouse: any) => {
    setSelectedWarehouse(warehouse);
    setFormData({
      name: warehouse.name,
      location: warehouse.location,
      type: warehouse.type,
      capacity: warehouse.capacity.toString(),
      manager: warehouse.manager,
      notes: warehouse.notes || ""
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (warehouse: any) => {
    setSelectedWarehouse(warehouse);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveAdd = () => {
    if (!formData.name || !formData.location || !formData.type || !formData.capacity) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    const newWarehouse = {
      id: warehouses.length + 1,
      name: formData.name,
      location: formData.location,
      type: formData.type,
      capacity: parseInt(formData.capacity),
      currentStock: 0,
      status: "نشط",
      manager: formData.manager
    };
    
    setWarehouses([...warehouses, newWarehouse]);
    setIsAddDialogOpen(false);
    toast({
      title: "نجح",
      description: "تم إضافة المستودع بنجاح"
    });
  };

  const handleSaveEdit = () => {
    if (!formData.name || !formData.location || !formData.type || !formData.capacity) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    setWarehouses(warehouses.map(w => 
      w.id === selectedWarehouse.id 
        ? { ...w, ...formData, capacity: parseInt(formData.capacity) }
        : w
    ));
    
    setIsEditDialogOpen(false);
    setSelectedWarehouse(null);
    toast({
      title: "نجح",
      description: "تم تحديث المستودع بنجاح"
    });
  };

  const handleConfirmDelete = () => {
    setWarehouses(warehouses.filter(w => w.id !== selectedWarehouse.id));
    setIsDeleteDialogOpen(false);
    setSelectedWarehouse(null);
    toast({
      title: "نجح",
      description: "تم حذف المستودع بنجاح"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">إدارة المستودعات</h1>
            <p className="text-gray-600 mt-1">إدارة المستودعات والمخازن</p>
          </div>
          <div className="flex gap-3">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="البحث عن مستودع..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleAdd}>
              <Plus className="w-5 h-5 ml-2" />
              إضافة مستودع
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Warehouse className="w-5 h-5" />
              قائمة المستودعات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-right py-3 px-4 font-semibold">اسم المستودع</th>
                    <th className="text-right py-3 px-4 font-semibold">الموقع</th>
                    <th className="text-right py-3 px-4 font-semibold">النوع</th>
                    <th className="text-right py-3 px-4 font-semibold">السعة</th>
                    <th className="text-right py-3 px-4 font-semibold">المخزون الحالي</th>
                    <th className="text-right py-3 px-4 font-semibold">المسؤول</th>
                    <th className="text-right py-3 px-4 font-semibold">الحالة</th>
                    <th className="text-right py-3 px-4 font-semibold">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {warehouses.map((warehouse) => {
                    const usagePercent = (warehouse.currentStock / warehouse.capacity) * 100;
                    return (
                      <tr key={warehouse.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-semibold">{warehouse.name}</td>
                        <td className="py-3 px-4">{warehouse.location}</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">{warehouse.type}</Badge>
                        </td>
                        <td className="py-3 px-4">{warehouse.capacity.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span>{warehouse.currentStock.toLocaleString()}</span>
                            <Badge className={usagePercent > 80 ? "bg-red-500" : usagePercent > 60 ? "bg-amber-500" : "bg-green-500"}>
                              {Math.round(usagePercent)}%
                            </Badge>
                          </div>
                        </td>
                        <td className="py-3 px-4">{warehouse.manager}</td>
                        <td className="py-3 px-4">
                          <Badge className={warehouse.status === "نشط" ? "bg-green-500" : "bg-gray-500"}>
                            {warehouse.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2 justify-end">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(warehouse)} title="تعديل">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(warehouse)} title="حذف">
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>إضافة مستودع جديد</DialogTitle>
              <DialogDescription>أدخل بيانات المستودع الجديد</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">اسم المستودع *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="اسم المستودع"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">الموقع *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="موقع المستودع"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">النوع *</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر النوع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="رئيسي">رئيسي</SelectItem>
                      <SelectItem value="فرعي">فرعي</SelectItem>
                      <SelectItem value="توزيع">توزيع</SelectItem>
                      <SelectItem value="مؤقت">مؤقت</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">السعة *</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                    placeholder="السعة"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="manager">المسؤول</Label>
                <Input
                  id="manager"
                  value={formData.manager}
                  onChange={(e) => setFormData({...formData, manager: e.target.value})}
                  placeholder="اسم المسؤول"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">ملاحظات</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="ملاحظات إضافية"
                  rows={3}
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
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>تعديل المستودع</DialogTitle>
              <DialogDescription>قم بتعديل بيانات المستودع</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">اسم المستودع *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="اسم المستودع"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-location">الموقع *</Label>
                <Input
                  id="edit-location"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="موقع المستودع"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-type">النوع *</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر النوع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="رئيسي">رئيسي</SelectItem>
                      <SelectItem value="فرعي">فرعي</SelectItem>
                      <SelectItem value="توزيع">توزيع</SelectItem>
                      <SelectItem value="مؤقت">مؤقت</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-capacity">السعة *</Label>
                  <Input
                    id="edit-capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                    placeholder="السعة"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-manager">المسؤول</Label>
                <Input
                  id="edit-manager"
                  value={formData.manager}
                  onChange={(e) => setFormData({...formData, manager: e.target.value})}
                  placeholder="اسم المسؤول"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-notes">ملاحظات</Label>
                <Textarea
                  id="edit-notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="ملاحظات إضافية"
                  rows={3}
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
                هل أنت متأكد من حذف المستودع "{selectedWarehouse?.name}"؟ هذا الإجراء لا يمكن التراجع عنه.
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

export default WarehouseManagement;

