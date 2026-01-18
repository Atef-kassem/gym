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
  Users, Plus, Search, Edit, Trash2, Save, Phone, Mail, UserCheck, TrendingUp
} from "lucide-react";

const LeadManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [leads, setLeads] = useState([
    {
      id: 1,
      name: "أحمد محمد",
      email: "ahmed@example.com",
      phone: "01234567890",
      company: "شركة أ",
      source: "موقع إلكتروني",
      status: "جديد",
      priority: "عالية",
      notes: "عميل محتمل مهتم بالخدمات"
    },
    {
      id: 2,
      name: "فاطمة علي",
      email: "fatima@example.com",
      phone: "01234567891",
      company: "شركة ب",
      source: "إعلان",
      status: "متابعة",
      priority: "متوسطة",
      notes: "في انتظار الرد"
    },
    {
      id: 3,
      name: "محمد حسن",
      email: "mohamed@example.com",
      phone: "01234567892",
      company: "شركة ج",
      source: "إحالة",
      status: "محول",
      priority: "عالية",
      notes: "تم التحويل لفريق المبيعات"
    }
  ]);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    source: "",
    status: "",
    priority: "",
    notes: ""
  });
  const { toast } = useToast();

  const handleAdd = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      source: "",
      status: "جديد",
      priority: "",
      notes: ""
    });
    setIsAddDialogOpen(true);
  };

  const handleEdit = (lead: any) => {
    setSelectedLead(lead);
    setFormData({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      source: lead.source,
      status: lead.status,
      priority: lead.priority,
      notes: lead.notes || ""
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (lead: any) => {
    setSelectedLead(lead);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveAdd = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.source) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    const newLead = {
      id: leads.length + 1,
      ...formData,
      status: formData.status || "جديد"
    };
    
    setLeads([...leads, newLead]);
    setIsAddDialogOpen(false);
    toast({
      title: "نجح",
      description: "تم إضافة العميل المحتمل بنجاح"
    });
  };

  const handleSaveEdit = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.source) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    setLeads(leads.map(l => 
      l.id === selectedLead.id 
        ? { ...l, ...formData }
        : l
    ));
    
    setIsEditDialogOpen(false);
    setSelectedLead(null);
    toast({
      title: "نجح",
      description: "تم تحديث بيانات العميل المحتمل بنجاح"
    });
  };

  const handleConfirmDelete = () => {
    setLeads(leads.filter(l => l.id !== selectedLead.id));
    setIsDeleteDialogOpen(false);
    setSelectedLead(null);
    toast({
      title: "نجح",
      description: "تم حذف العميل المحتمل بنجاح"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50/30 to-rose-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">إدارة العملاء المحتملين</h1>
            <p className="text-gray-600 mt-1">إدارة وتتبع العملاء المحتملين</p>
          </div>
          <div className="flex gap-3">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="البحث عن عميل محتمل..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            <Button className="bg-pink-600 hover:bg-pink-700" onClick={handleAdd}>
              <Plus className="w-5 h-5 ml-2" />
              عميل محتمل جديد
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              قائمة العملاء المحتملين
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-right py-3 px-4 font-semibold">الاسم</th>
                    <th className="text-right py-3 px-4 font-semibold">البريد</th>
                    <th className="text-right py-3 px-4 font-semibold">الهاتف</th>
                    <th className="text-right py-3 px-4 font-semibold">الشركة</th>
                    <th className="text-right py-3 px-4 font-semibold">المصدر</th>
                    <th className="text-right py-3 px-4 font-semibold">الحالة</th>
                    <th className="text-right py-3 px-4 font-semibold">الأولوية</th>
                    <th className="text-right py-3 px-4 font-semibold">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-semibold">{lead.name}</td>
                      <td className="py-3 px-4">{lead.email}</td>
                      <td className="py-3 px-4">{lead.phone}</td>
                      <td className="py-3 px-4">{lead.company}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{lead.source}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={
                          lead.status === "جديد" ? "bg-blue-500" :
                          lead.status === "متابعة" ? "bg-amber-500" :
                          lead.status === "محول" ? "bg-green-500" : "bg-gray-500"
                        }>
                          {lead.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={
                          lead.priority === "عالية" ? "bg-red-500" :
                          lead.priority === "متوسطة" ? "bg-amber-500" : "bg-blue-500"
                        }>
                          {lead.priority}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2 justify-end">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(lead)} title="تعديل">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(lead)} title="حذف">
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
              <DialogTitle>عميل محتمل جديد</DialogTitle>
              <DialogDescription>أدخل بيانات العميل المحتمل</DialogDescription>
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
                  <Label htmlFor="email">البريد الإلكتروني *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="البريد الإلكتروني"
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
                  <Label htmlFor="company">الشركة</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    placeholder="اسم الشركة"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="source">المصدر *</Label>
                  <Select value={formData.source} onValueChange={(value) => setFormData({...formData, source: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المصدر" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="موقع إلكتروني">موقع إلكتروني</SelectItem>
                      <SelectItem value="إعلان">إعلان</SelectItem>
                      <SelectItem value="إحالة">إحالة</SelectItem>
                      <SelectItem value="وسائل التواصل">وسائل التواصل</SelectItem>
                      <SelectItem value="مكالمة">مكالمة</SelectItem>
                      <SelectItem value="أخرى">أخرى</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">الحالة</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="جديد">جديد</SelectItem>
                      <SelectItem value="متابعة">متابعة</SelectItem>
                      <SelectItem value="محول">محول</SelectItem>
                      <SelectItem value="مرفوض">مرفوض</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">الأولوية</Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الأولوية" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="عالية">عالية</SelectItem>
                      <SelectItem value="متوسطة">متوسطة</SelectItem>
                      <SelectItem value="منخفضة">منخفضة</SelectItem>
                    </SelectContent>
                  </Select>
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
              <Button onClick={handleSaveAdd} className="bg-pink-600 hover:bg-pink-700">
                <Save className="w-4 h-4 ml-2" /> حفظ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>تعديل العميل المحتمل</DialogTitle>
              <DialogDescription>قم بتعديل بيانات العميل المحتمل</DialogDescription>
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
                  <Label htmlFor="edit-email">البريد الإلكتروني *</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="البريد الإلكتروني"
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
                  <Label htmlFor="edit-company">الشركة</Label>
                  <Input
                    id="edit-company"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    placeholder="اسم الشركة"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-source">المصدر *</Label>
                  <Select value={formData.source} onValueChange={(value) => setFormData({...formData, source: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المصدر" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="موقع إلكتروني">موقع إلكتروني</SelectItem>
                      <SelectItem value="إعلان">إعلان</SelectItem>
                      <SelectItem value="إحالة">إحالة</SelectItem>
                      <SelectItem value="وسائل التواصل">وسائل التواصل</SelectItem>
                      <SelectItem value="مكالمة">مكالمة</SelectItem>
                      <SelectItem value="أخرى">أخرى</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-status">الحالة</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="جديد">جديد</SelectItem>
                      <SelectItem value="متابعة">متابعة</SelectItem>
                      <SelectItem value="محول">محول</SelectItem>
                      <SelectItem value="مرفوض">مرفوض</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-priority">الأولوية</Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الأولوية" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="عالية">عالية</SelectItem>
                      <SelectItem value="متوسطة">متوسطة</SelectItem>
                      <SelectItem value="منخفضة">منخفضة</SelectItem>
                    </SelectContent>
                  </Select>
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
                هل أنت متأكد من حذف العميل المحتمل "{selectedLead?.name}"؟ هذا الإجراء لا يمكن التراجع عنه.
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

export default LeadManagement;

