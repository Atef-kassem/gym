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
  Tag, Plus, Search, Edit, Trash2, Calendar, Save,
  Percent, CheckCircle, XCircle, DollarSign
} from "lucide-react";

const DiscountsOffers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [offers, setOffers] = useState([
    {
      id: 1,
      name: "عرض الشتاء",
      discount: "20%",
      type: "نسبة مئوية",
      status: "نشط",
      startDate: "2024-01-01",
      endDate: "2024-03-31",
      participants: 150,
      maxParticipants: 200
    },
    {
      id: 2,
      name: "اشتراك سنوي",
      discount: "15%",
      type: "نسبة مئوية",
      status: "نشط",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      participants: 80,
      maxParticipants: 100
    },
    {
      id: 3,
      name: "عرض الصيف",
      discount: "25%",
      type: "نسبة مئوية",
      status: "منتهي",
      startDate: "2023-06-01",
      endDate: "2023-08-31",
      participants: 200,
      maxParticipants: 200
    }
  ]);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    discount: "",
    type: "نسبة مئوية",
    startDate: "",
    endDate: "",
    maxParticipants: "",
    description: ""
  });
  const { toast } = useToast();

  const handleAdd = () => {
    setFormData({
      name: "",
      discount: "",
      type: "نسبة مئوية",
      startDate: "",
      endDate: "",
      maxParticipants: "",
      description: ""
    });
    setIsAddDialogOpen(true);
  };

  const handleEdit = (offer: any) => {
    setSelectedOffer(offer);
    setFormData({
      name: offer.name,
      discount: offer.discount,
      type: offer.type,
      startDate: offer.startDate,
      endDate: offer.endDate,
      maxParticipants: offer.maxParticipants.toString(),
      description: offer.description || ""
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (offer: any) => {
    setSelectedOffer(offer);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveAdd = () => {
    if (!formData.name || !formData.discount || !formData.endDate) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    const newOffer = {
      id: offers.length + 1,
      name: formData.name,
      discount: formData.discount,
      type: formData.type,
      status: "نشط",
      startDate: formData.startDate || new Date().toISOString().split('T')[0],
      endDate: formData.endDate,
      participants: 0,
      maxParticipants: parseInt(formData.maxParticipants) || 0
    };
    
    setOffers([...offers, newOffer]);
    setIsAddDialogOpen(false);
    toast({
      title: "نجح",
      description: "تم إضافة العرض بنجاح"
    });
  };

  const handleSaveEdit = () => {
    if (!formData.name || !formData.discount || !formData.endDate) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    setOffers(offers.map(o => 
      o.id === selectedOffer.id 
        ? { 
            ...o, 
            name: formData.name,
            discount: formData.discount,
            type: formData.type,
            startDate: formData.startDate,
            endDate: formData.endDate,
            maxParticipants: parseInt(formData.maxParticipants) || 0
          }
        : o
    ));
    
    setIsEditDialogOpen(false);
    setSelectedOffer(null);
    toast({
      title: "نجح",
      description: "تم تحديث العرض بنجاح"
    });
  };

  const handleConfirmDelete = () => {
    setOffers(offers.filter(o => o.id !== selectedOffer.id));
    setIsDeleteDialogOpen(false);
    setSelectedOffer(null);
    toast({
      title: "نجح",
      description: "تم حذف العرض بنجاح"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-yellow-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* العنوان */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">الخصومات والعروض</h1>
            <p className="text-gray-600 mt-1">إدارة العروض والخصومات</p>
          </div>
          <div className="flex gap-3">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="البحث عن عرض..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            <Button className="bg-amber-600 hover:bg-amber-700" onClick={handleAdd}>
              <Plus className="w-5 h-5 ml-2" />
              عرض جديد
            </Button>
          </div>
        </div>

        {/* إحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-amber-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">إجمالي العروض</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">15</div>
              <p className="text-sm text-gray-500 mt-1">عرض متاح</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">العروض النشطة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">8</div>
              <p className="text-sm text-gray-500 mt-1">عرض نشط</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">المشاركون</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">430</div>
              <p className="text-sm text-gray-500 mt-1">عضو مستفيد</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">إجمالي الخصومات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">45,000 ج.م</div>
              <p className="text-sm text-gray-500 mt-1">هذا الشهر</p>
            </CardContent>
          </Card>
        </div>

        {/* قائمة العروض */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="w-5 h-5" />
              قائمة العروض والخصومات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-right py-3 px-4 font-semibold">اسم العرض</th>
                    <th className="text-right py-3 px-4 font-semibold">الخصم</th>
                    <th className="text-right py-3 px-4 font-semibold">النوع</th>
                    <th className="text-right py-3 px-4 font-semibold">الحالة</th>
                    <th className="text-right py-3 px-4 font-semibold">تاريخ البدء</th>
                    <th className="text-right py-3 px-4 font-semibold">تاريخ الانتهاء</th>
                    <th className="text-right py-3 px-4 font-semibold">المشاركون</th>
                    <th className="text-right py-3 px-4 font-semibold">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {offers.map((offer) => (
                    <tr key={offer.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-semibold">{offer.name}</td>
                      <td className="py-3 px-4">
                        <Badge className="bg-green-500 flex items-center w-fit gap-1">
                          <Percent className="w-3 h-3" />
                          {offer.discount}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">{offer.type}</td>
                      <td className="py-3 px-4">
                        <Badge className={offer.status === "نشط" ? "bg-green-500" : "bg-gray-500"}>
                          {offer.status === "نشط" ? <CheckCircle className="w-3 h-3 ml-1" /> : <XCircle className="w-3 h-3 ml-1" />}
                          {offer.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">{offer.startDate}</td>
                      <td className="py-3 px-4">{offer.endDate}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <span>{offer.participants}/{offer.maxParticipants}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2 justify-end">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(offer)} title="تعديل">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(offer)} title="حذف">
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

        {/* قوالب العروض */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-green-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Percent className="w-5 h-5 text-green-600" />
                خصم نسبة مئوية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">عرض خصم بنسبة مئوية</p>
              <Button variant="outline" className="w-full">
                استخدام القالب
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-blue-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-blue-600" />
                خصم مبلغ ثابت
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">عرض خصم بمبلغ ثابت</p>
              <Button variant="outline" className="w-full">
                استخدام القالب
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-purple-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-purple-600" />
                عرض حزمة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">عرض على حزم الاشتراكات</p>
              <Button variant="outline" className="w-full">
                استخدام القالب
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Dialog إضافة عرض جديد */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>إضافة عرض جديد</DialogTitle>
              <DialogDescription>أدخل بيانات العرض أو الخصم</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">اسم العرض *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="اسم العرض"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discount">الخصم *</Label>
                  <Input
                    id="discount"
                    value={formData.discount}
                    onChange={(e) => setFormData({...formData, discount: e.target.value})}
                    placeholder="مثال: 20% أو 500 ج.م"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">نوع الخصم</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر النوع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="نسبة مئوية">نسبة مئوية</SelectItem>
                      <SelectItem value="مبلغ ثابت">مبلغ ثابت</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">تاريخ البدء</Label>
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
              <div className="space-y-2">
                <Label htmlFor="maxParticipants">الحد الأقصى للمشاركين</Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  value={formData.maxParticipants}
                  onChange={(e) => setFormData({...formData, maxParticipants: e.target.value})}
                  placeholder="الحد الأقصى (0 = غير محدود)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">الوصف</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="وصف العرض أو الخصم"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>إلغاء</Button>
              <Button onClick={handleSaveAdd} className="bg-amber-600 hover:bg-amber-700">
                <Save className="w-4 h-4 ml-2" /> حفظ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog تعديل عرض */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>تعديل العرض</DialogTitle>
              <DialogDescription>قم بتعديل بيانات العرض</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">اسم العرض *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="اسم العرض"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-discount">الخصم *</Label>
                  <Input
                    id="edit-discount"
                    value={formData.discount}
                    onChange={(e) => setFormData({...formData, discount: e.target.value})}
                    placeholder="مثال: 20% أو 500 ج.م"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-type">نوع الخصم</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر النوع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="نسبة مئوية">نسبة مئوية</SelectItem>
                      <SelectItem value="مبلغ ثابت">مبلغ ثابت</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-startDate">تاريخ البدء</Label>
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
              <div className="space-y-2">
                <Label htmlFor="edit-maxParticipants">الحد الأقصى للمشاركين</Label>
                <Input
                  id="edit-maxParticipants"
                  type="number"
                  value={formData.maxParticipants}
                  onChange={(e) => setFormData({...formData, maxParticipants: e.target.value})}
                  placeholder="الحد الأقصى (0 = غير محدود)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">الوصف</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="وصف العرض أو الخصم"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>إلغاء</Button>
              <Button onClick={handleSaveEdit} className="bg-amber-600 hover:bg-amber-700">
                <Save className="w-4 h-4 ml-2" /> حفظ التغييرات
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
                هل أنت متأكد من حذف العرض "{selectedOffer?.name}"؟ هذا الإجراء لا يمكن التراجع عنه.
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

export default DiscountsOffers;

