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
  CreditCard, Plus, Search, Edit, Trash2, Download, Save,
  Printer, QrCode, CheckCircle
} from "lucide-react";

const MembershipCards = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [cards, setCards] = useState([
    {
      id: 1,
      memberName: "أحمد محمد",
      cardNumber: "GYM-001-2024",
      type: "ذهبي",
      membershipType: "شهري",
      status: "نشط",
      issueDate: "2024-01-15",
      expiryDate: "2025-01-15"
    },
    {
      id: 2,
      memberName: "فاطمة علي",
      cardNumber: "GYM-002-2024",
      type: "فضي",
      membershipType: "ربع سنوي",
      status: "نشط",
      issueDate: "2023-12-01",
      expiryDate: "2024-12-01"
    },
    {
      id: 3,
      memberName: "محمد حسن",
      cardNumber: "GYM-003-2023",
      type: "برونزي",
      membershipType: "سنوي",
      status: "منتهي",
      issueDate: "2023-01-01",
      expiryDate: "2024-01-01"
    }
  ]);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [formData, setFormData] = useState({
    memberName: "",
    type: "",
    membershipType: "",
    issueDate: "",
    expiryDate: ""
  });
  const { toast } = useToast();

  const getTypeBadge = (type: string, membershipType?: string) => {
    const colors: Record<string, string> = {
      "ذهبي": "bg-yellow-500",
      "فضي": "bg-gray-400",
      "برونزي": "bg-orange-600"
    };
    const displayText = membershipType ? `${type} (${membershipType})` : type;
    return <Badge className={colors[type] || "bg-gray-500"}>{displayText}</Badge>;
  };

  const generateCardNumber = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `GYM-${random}-${year}`;
  };

  const handleAdd = () => {
    setFormData({
      memberName: "",
      type: "",
      membershipType: "",
      issueDate: new Date().toISOString().split('T')[0],
      expiryDate: ""
    });
    setIsAddDialogOpen(true);
  };

  const handleEdit = (card: any) => {
    setSelectedCard(card);
    setFormData({
      memberName: card.memberName,
      type: card.type,
      membershipType: card.membershipType || "",
      issueDate: card.issueDate,
      expiryDate: card.expiryDate
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (card: any) => {
    setSelectedCard(card);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveAdd = () => {
    if (!formData.memberName || !formData.type || !formData.membershipType || !formData.expiryDate) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    const newCard = {
      id: cards.length + 1,
      memberName: formData.memberName,
      cardNumber: generateCardNumber(),
      type: formData.type,
      membershipType: formData.membershipType,
      status: "نشط",
      issueDate: formData.issueDate,
      expiryDate: formData.expiryDate
    };
    
    setCards([...cards, newCard]);
    setIsAddDialogOpen(false);
    toast({
      title: "نجح",
      description: "تم إصدار البطاقة بنجاح"
    });
  };

  const handleSaveEdit = () => {
    if (!formData.memberName || !formData.type || !formData.membershipType || !formData.expiryDate) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    setCards(cards.map(c => 
      c.id === selectedCard.id 
        ? { ...c, memberName: formData.memberName, type: formData.type, membershipType: formData.membershipType, expiryDate: formData.expiryDate }
        : c
    ));
    
    setIsEditDialogOpen(false);
    setSelectedCard(null);
    toast({
      title: "نجح",
      description: "تم تحديث البطاقة بنجاح"
    });
  };

  const handleConfirmDelete = () => {
    setCards(cards.filter(c => c.id !== selectedCard.id));
    setIsDeleteDialogOpen(false);
    setSelectedCard(null);
    toast({
      title: "نجح",
      description: "تم حذف البطاقة بنجاح"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/30 to-emerald-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* العنوان */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">بطاقات العضوية</h1>
            <p className="text-gray-600 mt-1">إصدار وإدارة بطاقات العضوية</p>
          </div>
          <div className="flex gap-3">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="البحث عن بطاقة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            <Button className="bg-green-600 hover:bg-green-700" onClick={handleAdd}>
              <Plus className="w-5 h-5 ml-2" />
              إصدار بطاقة جديدة
            </Button>
          </div>
        </div>

        {/* إحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">إجمالي البطاقات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">1,250</div>
              <p className="text-sm text-gray-500 mt-1">بطاقة صادرة</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">البطاقات النشطة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">890</div>
              <p className="text-sm text-gray-500 mt-1">بطاقة نشطة</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">بطاقات ذهبية</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">120</div>
              <p className="text-sm text-gray-500 mt-1">عضو ذهبي</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">بطاقات منتهية</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">45</div>
              <p className="text-sm text-gray-500 mt-1">تحتاج تجديد</p>
            </CardContent>
          </Card>
        </div>

        {/* قائمة البطاقات */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              قائمة بطاقات العضوية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-right py-3 px-4 font-semibold">اسم العضو</th>
                    <th className="text-right py-3 px-4 font-semibold">رقم البطاقة</th>
                    <th className="text-right py-3 px-4 font-semibold">النوع</th>
                    <th className="text-right py-3 px-4 font-semibold">الحالة</th>
                    <th className="text-right py-3 px-4 font-semibold">تاريخ الإصدار</th>
                    <th className="text-right py-3 px-4 font-semibold">تاريخ الانتهاء</th>
                    <th className="text-right py-3 px-4 font-semibold">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {cards.map((card) => (
                    <tr key={card.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-semibold">{card.memberName}</td>
                      <td className="py-3 px-4 font-mono">{card.cardNumber}</td>
                      <td className="py-3 px-4">{getTypeBadge(card.type, card.membershipType)}</td>
                      <td className="py-3 px-4">
                        <Badge className={card.status === "نشط" ? "bg-green-500" : "bg-gray-500"}>
                          {card.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">{card.issueDate}</td>
                      <td className="py-3 px-4">{card.expiryDate}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2 justify-end">
                          <Button variant="ghost" size="sm" title="طباعة">
                            <Printer className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" title="تحميل">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" title="QR Code">
                            <QrCode className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(card)} title="تعديل">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(card)} title="حذف">
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

        {/* قوالب البطاقات */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-yellow-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-yellow-600" />
                بطاقة ذهبية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-40 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                GYM GOLD
              </div>
              <Button variant="outline" className="mt-4 w-full">
                استخدام القالب
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-gray-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-gray-600" />
                بطاقة فضية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-40 bg-gradient-to-br from-gray-400 to-gray-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                GYM SILVER
              </div>
              <Button variant="outline" className="mt-4 w-full">
                استخدام القالب
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-orange-600">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-orange-600" />
                بطاقة برونزية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-40 bg-gradient-to-br from-orange-500 to-orange-700 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                GYM BRONZE
              </div>
              <Button variant="outline" className="mt-4 w-full">
                استخدام القالب
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Dialog إصدار بطاقة جديدة */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>إصدار بطاقة عضوية جديدة</DialogTitle>
              <DialogDescription>
                أدخل بيانات البطاقة الجديدة
              </DialogDescription>
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
                  <Label htmlFor="type">نوع البطاقة *</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر النوع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ذهبي">ذهبي</SelectItem>
                      <SelectItem value="فضي">فضي</SelectItem>
                      <SelectItem value="برونزي">برونزي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="membershipType">نوع الاشتراك *</Label>
                  <Select value={formData.membershipType} onValueChange={(value) => setFormData({...formData, membershipType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر نوع الاشتراك" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="شهري">شهري</SelectItem>
                      <SelectItem value="ربع سنوي">ربع سنوي</SelectItem>
                      <SelectItem value="نصف سنوي">نصف سنوي</SelectItem>
                      <SelectItem value="سنوي">سنوي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="issueDate">تاريخ الإصدار</Label>
                  <Input
                    id="issueDate"
                    type="date"
                    value={formData.issueDate}
                    onChange={(e) => setFormData({...formData, issueDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">تاريخ الانتهاء *</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>إلغاء</Button>
              <Button onClick={handleSaveAdd} className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 ml-2" /> إصدار
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog تعديل بطاقة */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>تعديل بطاقة العضوية</DialogTitle>
              <DialogDescription>قم بتعديل بيانات البطاقة</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-memberName">اسم العضو *</Label>
                <Input
                  id="edit-memberName"
                  value={formData.memberName}
                  onChange={(e) => setFormData({...formData, memberName: e.target.value})}
                  placeholder="اسم العضو"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-type">نوع البطاقة *</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر النوع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ذهبي">ذهبي</SelectItem>
                      <SelectItem value="فضي">فضي</SelectItem>
                      <SelectItem value="برونزي">برونزي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-membershipType">نوع الاشتراك *</Label>
                  <Select value={formData.membershipType} onValueChange={(value) => setFormData({...formData, membershipType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر نوع الاشتراك" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="شهري">شهري</SelectItem>
                      <SelectItem value="ربع سنوي">ربع سنوي</SelectItem>
                      <SelectItem value="نصف سنوي">نصف سنوي</SelectItem>
                      <SelectItem value="سنوي">سنوي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-issueDate">تاريخ الإصدار</Label>
                  <Input
                    id="edit-issueDate"
                    type="date"
                    value={formData.issueDate}
                    onChange={(e) => setFormData({...formData, issueDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-expiryDate">تاريخ الانتهاء *</Label>
                  <Input
                    id="edit-expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>إلغاء</Button>
              <Button onClick={handleSaveEdit} className="bg-green-600 hover:bg-green-700">
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
                هل أنت متأكد من حذف بطاقة "{selectedCard?.memberName}"؟ هذا الإجراء لا يمكن التراجع عنه.
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

export default MembershipCards;

