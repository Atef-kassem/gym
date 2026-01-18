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
  Building, Plus, Activity, Wrench, CheckCircle, Edit, Trash2, Save,
  XCircle, AlertCircle
} from "lucide-react";

const FacilityManagement = () => {
  const [facilities, setFacilities] = useState([
    {
      id: 1,
      name: "صالة 1",
      type: "صالة تمارين",
      capacity: 30,
      status: "متاح",
      equipment: 25,
      lastMaintenance: "2024-01-15"
    },
    {
      id: 2,
      name: "صالة 2",
      type: "صالة تمارين",
      capacity: 25,
      status: "مشغول",
      equipment: 20,
      lastMaintenance: "2024-01-10"
    },
    {
      id: 3,
      name: "قاعة اليوغا",
      type: "قاعة",
      capacity: 15,
      status: "صيانة",
      equipment: 10,
      lastMaintenance: "2024-01-05"
    },
    {
      id: 4,
      name: "مسبح",
      type: "مسبح",
      capacity: 20,
      status: "متاح",
      equipment: 5,
      lastMaintenance: "2024-01-20"
    }
  ]);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    capacity: "",
    equipment: "",
    lastMaintenance: "",
    notes: ""
  });
  const { toast } = useToast();

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      "متاح": "bg-green-500",
      "مشغول": "bg-blue-500",
      "صيانة": "bg-red-500"
    };
    return <Badge className={colors[status] || "bg-gray-500"}>{status}</Badge>;
  };

  const handleAdd = () => {
    setFormData({
      name: "",
      type: "",
      capacity: "",
      equipment: "",
      lastMaintenance: "",
      notes: ""
    });
    setIsAddDialogOpen(true);
  };

  const handleEdit = (facility: any) => {
    setSelectedFacility(facility);
    setFormData({
      name: facility.name,
      type: facility.type,
      capacity: facility.capacity.toString(),
      equipment: facility.equipment.toString(),
      lastMaintenance: facility.lastMaintenance,
      notes: facility.notes || ""
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (facility: any) => {
    setSelectedFacility(facility);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveAdd = () => {
    if (!formData.name || !formData.type || !formData.capacity) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    const newFacility = {
      id: facilities.length + 1,
      name: formData.name,
      type: formData.type,
      capacity: parseInt(formData.capacity),
      equipment: parseInt(formData.equipment) || 0,
      lastMaintenance: formData.lastMaintenance || new Date().toISOString().split('T')[0],
      status: "متاح"
    };
    
    setFacilities([...facilities, newFacility]);
    setIsAddDialogOpen(false);
    toast({
      title: "نجح",
      description: "تم إضافة المرفق بنجاح"
    });
  };

  const handleSaveEdit = () => {
    if (!formData.name || !formData.type || !formData.capacity) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    setFacilities(facilities.map(f => 
      f.id === selectedFacility.id 
        ? { 
            ...f, 
            name: formData.name,
            type: formData.type,
            capacity: parseInt(formData.capacity),
            equipment: parseInt(formData.equipment) || 0,
            lastMaintenance: formData.lastMaintenance
          }
        : f
    ));
    
    setIsEditDialogOpen(false);
    setSelectedFacility(null);
    toast({
      title: "نجح",
      description: "تم تحديث بيانات المرفق بنجاح"
    });
  };

  const handleConfirmDelete = () => {
    setFacilities(facilities.filter(f => f.id !== selectedFacility.id));
    setIsDeleteDialogOpen(false);
    setSelectedFacility(null);
    toast({
      title: "نجح",
      description: "تم حذف المرفق بنجاح"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50/30 to-slate-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* العنوان */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">المرافق والمعدات</h1>
            <p className="text-gray-600 mt-1">إدارة مرافق ومعدات النادي</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Activity className="w-5 h-5 ml-2" />
              جرد المعدات
            </Button>
            <Button className="bg-gray-600 hover:bg-gray-700" onClick={handleAdd}>
              <Plus className="w-5 h-5 ml-2" />
              إضافة مرفق
            </Button>
          </div>
        </div>

        {/* إحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-gray-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">إجمالي المرافق</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-600">8</div>
              <p className="text-sm text-gray-500 mt-1">مرفق متاح</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">المرافق المتاحة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">6</div>
              <p className="text-sm text-gray-500 mt-1">مرفق متاح</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">المعدات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">150</div>
              <p className="text-sm text-gray-500 mt-1">قطعة معدات</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">الصيانة المطلوبة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">3</div>
              <p className="text-sm text-gray-500 mt-1">يحتاج صيانة</p>
            </CardContent>
          </Card>
        </div>

        {/* قائمة المرافق */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {facilities.map((facility) => (
            <Card key={facility.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    {facility.name}
                  </CardTitle>
                  {getStatusBadge(facility.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">النوع</span>
                  <span className="font-semibold">{facility.type}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">السعة</span>
                  <span className="font-semibold">{facility.capacity} شخص</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">المعدات</span>
                  <span className="font-semibold">{facility.equipment} قطعة</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">آخر صيانة</span>
                  <span className="font-semibold">{facility.lastMaintenance}</span>
                </div>
                <div className="flex gap-2 pt-2 border-t">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(facility)}>
                    <Edit className="w-4 h-4 ml-2" />
                    تعديل
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleDelete(facility)}>
                    <Trash2 className="w-4 h-4 ml-2 text-red-500" />
                    حذف
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* خيارات إضافية */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                جرد المعدات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">إدارة معدات النادي</p>
              <Button variant="outline" className="mt-4 w-full">
                عرض المعدات
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-amber-600" />
                صيانة المعدات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">جدولة ومتابعة صيانة المعدات</p>
              <Button variant="outline" className="mt-4 w-full">
                عرض الصيانة
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                تنبيهات الصيانة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">المعدات التي تحتاج صيانة</p>
              <Badge className="bg-red-500 mt-4">3 تنبيهات</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Dialog إضافة مرفق جديد */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>إضافة مرفق جديد</DialogTitle>
              <DialogDescription>
                أدخل بيانات المرفق الجديد
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">اسم المرفق *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="اسم المرفق"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">النوع *</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر النوع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="صالة تمارين">صالة تمارين</SelectItem>
                      <SelectItem value="قاعة">قاعة</SelectItem>
                      <SelectItem value="مسبح">مسبح</SelectItem>
                      <SelectItem value="غرفة تغيير">غرفة تغيير</SelectItem>
                      <SelectItem value="كافيتريا">كافيتريا</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capacity">السعة *</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                    placeholder="السعة بالأشخاص"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="equipment">عدد المعدات</Label>
                  <Input
                    id="equipment"
                    type="number"
                    value={formData.equipment}
                    onChange={(e) => setFormData({...formData, equipment: e.target.value})}
                    placeholder="عدد المعدات"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastMaintenance">تاريخ آخر صيانة</Label>
                <Input
                  id="lastMaintenance"
                  type="date"
                  value={formData.lastMaintenance}
                  onChange={(e) => setFormData({...formData, lastMaintenance: e.target.value})}
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
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={handleSaveAdd} className="bg-gray-600 hover:bg-gray-700">
                <Save className="w-4 h-4 ml-2" />
                حفظ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog تعديل مرفق */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>تعديل بيانات المرفق</DialogTitle>
              <DialogDescription>
                قم بتعديل بيانات المرفق
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">اسم المرفق *</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="اسم المرفق"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-type">النوع *</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر النوع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="صالة تمارين">صالة تمارين</SelectItem>
                      <SelectItem value="قاعة">قاعة</SelectItem>
                      <SelectItem value="مسبح">مسبح</SelectItem>
                      <SelectItem value="غرفة تغيير">غرفة تغيير</SelectItem>
                      <SelectItem value="كافيتريا">كافيتريا</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-capacity">السعة *</Label>
                  <Input
                    id="edit-capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                    placeholder="السعة بالأشخاص"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-equipment">عدد المعدات</Label>
                  <Input
                    id="edit-equipment"
                    type="number"
                    value={formData.equipment}
                    onChange={(e) => setFormData({...formData, equipment: e.target.value})}
                    placeholder="عدد المعدات"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-lastMaintenance">تاريخ آخر صيانة</Label>
                <Input
                  id="edit-lastMaintenance"
                  type="date"
                  value={formData.lastMaintenance}
                  onChange={(e) => setFormData({...formData, lastMaintenance: e.target.value})}
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
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={handleSaveEdit} className="bg-gray-600 hover:bg-gray-700">
                <Save className="w-4 h-4 ml-2" />
                حفظ التغييرات
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog تأكيد الحذف */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>تأكيد الحذف</DialogTitle>
              <DialogDescription>
                هل أنت متأكد من حذف المرفق "{selectedFacility?.name}"؟ هذا الإجراء لا يمكن التراجع عنه.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                إلغاء
              </Button>
              <Button variant="destructive" onClick={handleConfirmDelete}>
                <Trash2 className="w-4 h-4 ml-2" />
                حذف
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
};

export default FacilityManagement;

