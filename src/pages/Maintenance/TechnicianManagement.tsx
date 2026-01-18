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
  UserCog, Plus, Search, Edit, Trash2, Save, Wrench, Phone, Mail, Star
} from "lucide-react";

const TechnicianManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [technicians, setTechnicians] = useState([
    {
      id: 1,
      name: "أحمد محمود",
      specialization: "كهرباء",
      phone: "01234567890",
      email: "ahmed@example.com",
      experience: "8 سنوات",
      rating: 4.8,
      status: "نشط",
      completedJobs: 245
    },
    {
      id: 2,
      name: "سارة أحمد",
      specialization: "ميكانيكا",
      phone: "01234567891",
      email: "sara@example.com",
      experience: "5 سنوات",
      rating: 4.9,
      status: "نشط",
      completedJobs: 180
    },
    {
      id: 3,
      name: "محمد علي",
      specialization: "أجهزة",
      phone: "01234567892",
      email: "mohamed@example.com",
      experience: "3 سنوات",
      rating: 4.6,
      status: "إجازة",
      completedJobs: 95
    }
  ]);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    phone: "",
    email: "",
    experience: "",
    notes: ""
  });
  const { toast } = useToast();

  const handleAdd = () => {
    setFormData({
      name: "",
      specialization: "",
      phone: "",
      email: "",
      experience: "",
      notes: ""
    });
    setIsAddDialogOpen(true);
  };

  const handleEdit = (technician: any) => {
    setSelectedTechnician(technician);
    setFormData({
      name: technician.name,
      specialization: technician.specialization,
      phone: technician.phone,
      email: technician.email,
      experience: technician.experience,
      notes: technician.notes || ""
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (technician: any) => {
    setSelectedTechnician(technician);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveAdd = () => {
    if (!formData.name || !formData.specialization || !formData.phone) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    const newTechnician = {
      id: technicians.length + 1,
      name: formData.name,
      specialization: formData.specialization,
      phone: formData.phone,
      email: formData.email || "-",
      experience: formData.experience || "-",
      rating: 0,
      status: "نشط",
      completedJobs: 0
    };
    
    setTechnicians([...technicians, newTechnician]);
    setIsAddDialogOpen(false);
    toast({
      title: "نجح",
      description: "تم إضافة الفني بنجاح"
    });
  };

  const handleSaveEdit = () => {
    if (!formData.name || !formData.specialization || !formData.phone) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    setTechnicians(technicians.map(t => 
      t.id === selectedTechnician.id 
        ? { ...t, ...formData, experience: formData.experience || t.experience }
        : t
    ));
    
    setIsEditDialogOpen(false);
    setSelectedTechnician(null);
    toast({
      title: "نجح",
      description: "تم تحديث بيانات الفني بنجاح"
    });
  };

  const handleConfirmDelete = () => {
    setTechnicians(technicians.filter(t => t.id !== selectedTechnician.id));
    setIsDeleteDialogOpen(false);
    setSelectedTechnician(null);
    toast({
      title: "نجح",
      description: "تم حذف الفني بنجاح"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-amber-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">إدارة الفنيين</h1>
            <p className="text-gray-600 mt-1">إدارة بيانات الفنيين والمختصين</p>
          </div>
          <div className="flex gap-3">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="البحث عن فني..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            <Button className="bg-orange-600 hover:bg-orange-700" onClick={handleAdd}>
              <Plus className="w-5 h-5 ml-2" />
              إضافة فني
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCog className="w-5 h-5" />
              قائمة الفنيين
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-right py-3 px-4 font-semibold">الاسم</th>
                    <th className="text-right py-3 px-4 font-semibold">التخصص</th>
                    <th className="text-right py-3 px-4 font-semibold">الهاتف</th>
                    <th className="text-right py-3 px-4 font-semibold">البريد</th>
                    <th className="text-right py-3 px-4 font-semibold">الخبرة</th>
                    <th className="text-right py-3 px-4 font-semibold">التقييم</th>
                    <th className="text-right py-3 px-4 font-semibold">الحالة</th>
                    <th className="text-right py-3 px-4 font-semibold">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {technicians.map((technician) => (
                    <tr key={technician.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-semibold">{technician.name}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{technician.specialization}</Badge>
                      </td>
                      <td className="py-3 px-4">{technician.phone}</td>
                      <td className="py-3 px-4">{technician.email}</td>
                      <td className="py-3 px-4">{technician.experience}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{technician.rating}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={technician.status === "نشط" ? "bg-green-500" : "bg-amber-500"}>
                          {technician.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2 justify-end">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(technician)} title="تعديل">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(technician)} title="حذف">
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
              <DialogTitle>إضافة فني جديد</DialogTitle>
              <DialogDescription>أدخل بيانات الفني الجديد</DialogDescription>
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
                  <Label htmlFor="specialization">التخصص *</Label>
                  <Select value={formData.specialization} onValueChange={(value) => setFormData({...formData, specialization: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر التخصص" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="كهرباء">كهرباء</SelectItem>
                      <SelectItem value="ميكانيكا">ميكانيكا</SelectItem>
                      <SelectItem value="أجهزة">أجهزة</SelectItem>
                      <SelectItem value="سباكة">سباكة</SelectItem>
                      <SelectItem value="نجارة">نجارة</SelectItem>
                      <SelectItem value="دهانات">دهانات</SelectItem>
                      <SelectItem value="أخرى">أخرى</SelectItem>
                    </SelectContent>
                  </Select>
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
                  <Label htmlFor="experience">الخبرة</Label>
                  <Input
                    id="experience"
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    placeholder="مثال: 5 سنوات"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>إلغاء</Button>
              <Button onClick={handleSaveAdd} className="bg-orange-600 hover:bg-orange-700">
                <Save className="w-4 h-4 ml-2" /> حفظ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>تعديل بيانات الفني</DialogTitle>
              <DialogDescription>قم بتعديل بيانات الفني</DialogDescription>
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
                  <Label htmlFor="edit-specialization">التخصص *</Label>
                  <Select value={formData.specialization} onValueChange={(value) => setFormData({...formData, specialization: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر التخصص" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="كهرباء">كهرباء</SelectItem>
                      <SelectItem value="ميكانيكا">ميكانيكا</SelectItem>
                      <SelectItem value="أجهزة">أجهزة</SelectItem>
                      <SelectItem value="سباكة">سباكة</SelectItem>
                      <SelectItem value="نجارة">نجارة</SelectItem>
                      <SelectItem value="دهانات">دهانات</SelectItem>
                      <SelectItem value="أخرى">أخرى</SelectItem>
                    </SelectContent>
                  </Select>
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
                  <Label htmlFor="edit-experience">الخبرة</Label>
                  <Input
                    id="edit-experience"
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    placeholder="مثال: 5 سنوات"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>إلغاء</Button>
              <Button onClick={handleSaveEdit} className="bg-orange-600 hover:bg-orange-700">
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
                هل أنت متأكد من حذف الفني "{selectedTechnician?.name}"؟ هذا الإجراء لا يمكن التراجع عنه.
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

export default TechnicianManagement;

