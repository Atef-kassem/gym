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
import { useToast } from "@/hooks/use-toast";
import {
  User, Plus, Search, Edit, Trash2, Save, Phone, Mail, IdCard, Car
} from "lucide-react";

const DriverManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [drivers, setDrivers] = useState([
    {
      id: 1,
      name: "أحمد محمد",
      licenseNumber: "123456789",
      phone: "01234567890",
      email: "ahmed@example.com",
      vehicle: "أ ب ج 1234",
      status: "نشط",
      experience: "5 سنوات"
    },
    {
      id: 2,
      name: "فاطمة علي",
      licenseNumber: "987654321",
      phone: "01234567891",
      email: "fatima@example.com",
      vehicle: "د هـ و 5678",
      status: "نشط",
      experience: "3 سنوات"
    },
    {
      id: 3,
      name: "محمد حسن",
      licenseNumber: "456789123",
      phone: "01234567892",
      email: "mohamed@example.com",
      vehicle: "ز ح ط 9012",
      status: "إجازة",
      experience: "7 سنوات"
    }
  ]);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    licenseNumber: "",
    phone: "",
    email: "",
    vehicle: "",
    experience: ""
  });
  const { toast } = useToast();

  const handleAdd = () => {
    setFormData({
      name: "",
      licenseNumber: "",
      phone: "",
      email: "",
      vehicle: "",
      experience: ""
    });
    setIsAddDialogOpen(true);
  };

  const handleEdit = (driver: any) => {
    setSelectedDriver(driver);
    setFormData({
      name: driver.name,
      licenseNumber: driver.licenseNumber,
      phone: driver.phone,
      email: driver.email,
      vehicle: driver.vehicle,
      experience: driver.experience
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (driver: any) => {
    setSelectedDriver(driver);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveAdd = () => {
    if (!formData.name || !formData.licenseNumber || !formData.phone) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    const newDriver = {
      id: drivers.length + 1,
      ...formData,
      status: "نشط"
    };
    
    setDrivers([...drivers, newDriver]);
    setIsAddDialogOpen(false);
    toast({
      title: "نجح",
      description: "تم إضافة السائق بنجاح"
    });
  };

  const handleSaveEdit = () => {
    if (!formData.name || !formData.licenseNumber || !formData.phone) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    setDrivers(drivers.map(d => 
      d.id === selectedDriver.id 
        ? { ...d, ...formData }
        : d
    ));
    
    setIsEditDialogOpen(false);
    setSelectedDriver(null);
    toast({
      title: "نجح",
      description: "تم تحديث بيانات السائق بنجاح"
    });
  };

  const handleConfirmDelete = () => {
    setDrivers(drivers.filter(d => d.id !== selectedDriver.id));
    setIsDeleteDialogOpen(false);
    setSelectedDriver(null);
    toast({
      title: "نجح",
      description: "تم حذف السائق بنجاح"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">إدارة السائقين</h1>
            <p className="text-gray-600 mt-1">إدارة بيانات السائقين والتصاريح</p>
          </div>
          <div className="flex gap-3">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="البحث عن سائق..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleAdd}>
              <Plus className="w-5 h-5 ml-2" />
              إضافة سائق
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              قائمة السائقين
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-right py-3 px-4 font-semibold">الاسم</th>
                    <th className="text-right py-3 px-4 font-semibold">رقم الرخصة</th>
                    <th className="text-right py-3 px-4 font-semibold">الهاتف</th>
                    <th className="text-right py-3 px-4 font-semibold">البريد</th>
                    <th className="text-right py-3 px-4 font-semibold">المركبة</th>
                    <th className="text-right py-3 px-4 font-semibold">الخبرة</th>
                    <th className="text-right py-3 px-4 font-semibold">الحالة</th>
                    <th className="text-right py-3 px-4 font-semibold">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {drivers.map((driver) => (
                    <tr key={driver.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-semibold">{driver.name}</td>
                      <td className="py-3 px-4 font-mono">{driver.licenseNumber}</td>
                      <td className="py-3 px-4">{driver.phone}</td>
                      <td className="py-3 px-4">{driver.email}</td>
                      <td className="py-3 px-4 font-mono">{driver.vehicle}</td>
                      <td className="py-3 px-4">{driver.experience}</td>
                      <td className="py-3 px-4">
                        <Badge className={driver.status === "نشط" ? "bg-green-500" : "bg-amber-500"}>
                          {driver.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2 justify-end">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(driver)} title="تعديل">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(driver)} title="حذف">
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
              <DialogTitle>إضافة سائق جديد</DialogTitle>
              <DialogDescription>أدخل بيانات السائق الجديد</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">الاسم الكامل *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="الاسم الكامل"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">رقم الرخصة *</Label>
                  <Input
                    id="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
                    placeholder="رقم رخصة القيادة"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">رقم الهاتف *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="رقم الهاتف"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="البريد الإلكتروني"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicle">المركبة</Label>
                  <Input
                    id="vehicle"
                    value={formData.vehicle}
                    onChange={(e) => setFormData({...formData, vehicle: e.target.value})}
                    placeholder="رقم لوحة المركبة"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">سنوات الخبرة</Label>
                <Input
                  id="experience"
                  value={formData.experience}
                  onChange={(e) => setFormData({...formData, experience: e.target.value})}
                  placeholder="مثال: 5 سنوات"
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
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>تعديل بيانات السائق</DialogTitle>
              <DialogDescription>قم بتعديل بيانات السائق</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">الاسم الكامل *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="الاسم الكامل"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-licenseNumber">رقم الرخصة *</Label>
                  <Input
                    id="edit-licenseNumber"
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
                    placeholder="رقم رخصة القيادة"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">رقم الهاتف *</Label>
                  <Input
                    id="edit-phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="رقم الهاتف"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-email">البريد الإلكتروني</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="البريد الإلكتروني"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-vehicle">المركبة</Label>
                  <Input
                    id="edit-vehicle"
                    value={formData.vehicle}
                    onChange={(e) => setFormData({...formData, vehicle: e.target.value})}
                    placeholder="رقم لوحة المركبة"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-experience">سنوات الخبرة</Label>
                <Input
                  id="edit-experience"
                  value={formData.experience}
                  onChange={(e) => setFormData({...formData, experience: e.target.value})}
                  placeholder="مثال: 5 سنوات"
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
                هل أنت متأكد من حذف السائق "{selectedDriver?.name}"؟ هذا الإجراء لا يمكن التراجع عنه.
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

export default DriverManagement;

