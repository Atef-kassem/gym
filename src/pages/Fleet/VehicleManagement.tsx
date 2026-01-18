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
  Truck, Plus, Search, Edit, Trash2, Save, Car, Fuel, Calendar, MapPin
} from "lucide-react";

const VehicleManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [vehicles, setVehicles] = useState([
    {
      id: 1,
      plateNumber: "أ ب ج 1234",
      brand: "تويوتا",
      model: "كورولا",
      year: 2022,
      type: "سيارة",
      driver: "أحمد محمد",
      status: "متاحة",
      mileage: 45000,
      fuelType: "بنزين"
    },
    {
      id: 2,
      plateNumber: "د هـ و 5678",
      brand: "نيسان",
      model: "باترول",
      year: 2021,
      type: "سيارة نقل",
      driver: "فاطمة علي",
      status: "في الطريق",
      mileage: 78000,
      fuelType: "ديزل"
    },
    {
      id: 3,
      plateNumber: "ز ح ط 9012",
      brand: "فورد",
      model: "ترانزيت",
      year: 2023,
      type: "شاحنة",
      driver: "محمد حسن",
      status: "صيانة",
      mileage: 12000,
      fuelType: "ديزل"
    }
  ]);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [formData, setFormData] = useState({
    plateNumber: "",
    brand: "",
    model: "",
    year: "",
    type: "",
    driver: "",
    mileage: "",
    fuelType: "",
    notes: ""
  });
  const { toast } = useToast();

  const handleAdd = () => {
    setFormData({
      plateNumber: "",
      brand: "",
      model: "",
      year: "",
      type: "",
      driver: "",
      mileage: "",
      fuelType: "",
      notes: ""
    });
    setIsAddDialogOpen(true);
  };

  const handleEdit = (vehicle: any) => {
    setSelectedVehicle(vehicle);
    setFormData({
      plateNumber: vehicle.plateNumber,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year.toString(),
      type: vehicle.type,
      driver: vehicle.driver,
      mileage: vehicle.mileage.toString(),
      fuelType: vehicle.fuelType,
      notes: vehicle.notes || ""
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (vehicle: any) => {
    setSelectedVehicle(vehicle);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveAdd = () => {
    if (!formData.plateNumber || !formData.brand || !formData.model || !formData.type) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    const newVehicle = {
      id: vehicles.length + 1,
      plateNumber: formData.plateNumber,
      brand: formData.brand,
      model: formData.model,
      year: parseInt(formData.year) || new Date().getFullYear(),
      type: formData.type,
      driver: formData.driver || "-",
      status: "متاحة",
      mileage: parseInt(formData.mileage) || 0,
      fuelType: formData.fuelType || "بنزين"
    };
    
    setVehicles([...vehicles, newVehicle]);
    setIsAddDialogOpen(false);
    toast({
      title: "نجح",
      description: "تم إضافة المركبة بنجاح"
    });
  };

  const handleSaveEdit = () => {
    if (!formData.plateNumber || !formData.brand || !formData.model || !formData.type) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    setVehicles(vehicles.map(v => 
      v.id === selectedVehicle.id 
        ? { 
            ...v, 
            plateNumber: formData.plateNumber,
            brand: formData.brand,
            model: formData.model,
            year: parseInt(formData.year) || v.year,
            type: formData.type,
            driver: formData.driver || "-",
            mileage: parseInt(formData.mileage) || v.mileage,
            fuelType: formData.fuelType || v.fuelType
          }
        : v
    ));
    
    setIsEditDialogOpen(false);
    setSelectedVehicle(null);
    toast({
      title: "نجح",
      description: "تم تحديث بيانات المركبة بنجاح"
    });
  };

  const handleConfirmDelete = () => {
    setVehicles(vehicles.filter(v => v.id !== selectedVehicle.id));
    setIsDeleteDialogOpen(false);
    setSelectedVehicle(null);
    toast({
      title: "نجح",
      description: "تم حذف المركبة بنجاح"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">إدارة المركبات</h1>
            <p className="text-gray-600 mt-1">إدارة أسطول المركبات والمركبات</p>
          </div>
          <div className="flex gap-3">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="البحث عن مركبة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleAdd}>
              <Plus className="w-5 h-5 ml-2" />
              إضافة مركبة
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="w-5 h-5" />
              قائمة المركبات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-right py-3 px-4 font-semibold">رقم اللوحة</th>
                    <th className="text-right py-3 px-4 font-semibold">العلامة</th>
                    <th className="text-right py-3 px-4 font-semibold">الموديل</th>
                    <th className="text-right py-3 px-4 font-semibold">السنة</th>
                    <th className="text-right py-3 px-4 font-semibold">النوع</th>
                    <th className="text-right py-3 px-4 font-semibold">السائق</th>
                    <th className="text-right py-3 px-4 font-semibold">المسافة</th>
                    <th className="text-right py-3 px-4 font-semibold">الحالة</th>
                    <th className="text-right py-3 px-4 font-semibold">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-semibold font-mono">{vehicle.plateNumber}</td>
                      <td className="py-3 px-4">{vehicle.brand}</td>
                      <td className="py-3 px-4">{vehicle.model}</td>
                      <td className="py-3 px-4">{vehicle.year}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{vehicle.type}</Badge>
                      </td>
                      <td className="py-3 px-4">{vehicle.driver}</td>
                      <td className="py-3 px-4">{vehicle.mileage.toLocaleString()} كم</td>
                      <td className="py-3 px-4">
                        <Badge className={
                          vehicle.status === "متاحة" ? "bg-green-500" :
                          vehicle.status === "في الطريق" ? "bg-blue-500" : "bg-red-500"
                        }>
                          {vehicle.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2 justify-end">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(vehicle)} title="تعديل">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(vehicle)} title="حذف">
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
              <DialogTitle>إضافة مركبة جديدة</DialogTitle>
              <DialogDescription>أدخل بيانات المركبة الجديدة</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="plateNumber">رقم اللوحة *</Label>
                <Input
                  id="plateNumber"
                  value={formData.plateNumber}
                  onChange={(e) => setFormData({...formData, plateNumber: e.target.value})}
                  placeholder="رقم اللوحة"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">العلامة *</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => setFormData({...formData, brand: e.target.value})}
                    placeholder="العلامة التجارية"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">الموديل *</Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => setFormData({...formData, model: e.target.value})}
                    placeholder="الموديل"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">السنة</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: e.target.value})}
                    placeholder="السنة"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">النوع *</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر النوع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="سيارة">سيارة</SelectItem>
                      <SelectItem value="سيارة نقل">سيارة نقل</SelectItem>
                      <SelectItem value="شاحنة">شاحنة</SelectItem>
                      <SelectItem value="دراجة نارية">دراجة نارية</SelectItem>
                      <SelectItem value="أخرى">أخرى</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fuelType">نوع الوقود</Label>
                  <Select value={formData.fuelType} onValueChange={(value) => setFormData({...formData, fuelType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر النوع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="بنزين">بنزين</SelectItem>
                      <SelectItem value="ديزل">ديزل</SelectItem>
                      <SelectItem value="كهرباء">كهرباء</SelectItem>
                      <SelectItem value="هجين">هجين</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="driver">السائق</Label>
                  <Input
                    id="driver"
                    value={formData.driver}
                    onChange={(e) => setFormData({...formData, driver: e.target.value})}
                    placeholder="اسم السائق"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mileage">المسافة المقطوعة</Label>
                  <Input
                    id="mileage"
                    type="number"
                    value={formData.mileage}
                    onChange={(e) => setFormData({...formData, mileage: e.target.value})}
                    placeholder="بالكيلومتر"
                  />
                </div>
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
              <Button onClick={handleSaveAdd} className="bg-emerald-600 hover:bg-emerald-700">
                <Save className="w-4 h-4 ml-2" /> حفظ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>تعديل بيانات المركبة</DialogTitle>
              <DialogDescription>قم بتعديل بيانات المركبة</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-plateNumber">رقم اللوحة *</Label>
                <Input
                  id="edit-plateNumber"
                  value={formData.plateNumber}
                  onChange={(e) => setFormData({...formData, plateNumber: e.target.value})}
                  placeholder="رقم اللوحة"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-brand">العلامة *</Label>
                  <Input
                    id="edit-brand"
                    value={formData.brand}
                    onChange={(e) => setFormData({...formData, brand: e.target.value})}
                    placeholder="العلامة التجارية"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-model">الموديل *</Label>
                  <Input
                    id="edit-model"
                    value={formData.model}
                    onChange={(e) => setFormData({...formData, model: e.target.value})}
                    placeholder="الموديل"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-year">السنة</Label>
                  <Input
                    id="edit-year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: e.target.value})}
                    placeholder="السنة"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-type">النوع *</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر النوع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="سيارة">سيارة</SelectItem>
                      <SelectItem value="سيارة نقل">سيارة نقل</SelectItem>
                      <SelectItem value="شاحنة">شاحنة</SelectItem>
                      <SelectItem value="دراجة نارية">دراجة نارية</SelectItem>
                      <SelectItem value="أخرى">أخرى</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-fuelType">نوع الوقود</Label>
                  <Select value={formData.fuelType} onValueChange={(value) => setFormData({...formData, fuelType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر النوع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="بنزين">بنزين</SelectItem>
                      <SelectItem value="ديزل">ديزل</SelectItem>
                      <SelectItem value="كهرباء">كهرباء</SelectItem>
                      <SelectItem value="هجين">هجين</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-driver">السائق</Label>
                  <Input
                    id="edit-driver"
                    value={formData.driver}
                    onChange={(e) => setFormData({...formData, driver: e.target.value})}
                    placeholder="اسم السائق"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-mileage">المسافة المقطوعة</Label>
                  <Input
                    id="edit-mileage"
                    type="number"
                    value={formData.mileage}
                    onChange={(e) => setFormData({...formData, mileage: e.target.value})}
                    placeholder="بالكيلومتر"
                  />
                </div>
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
              <Button onClick={handleSaveEdit} className="bg-emerald-600 hover:bg-emerald-700">
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
                هل أنت متأكد من حذف المركبة "{selectedVehicle?.plateNumber}"؟ هذا الإجراء لا يمكن التراجع عنه.
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

export default VehicleManagement;

