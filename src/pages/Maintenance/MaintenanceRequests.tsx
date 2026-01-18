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
  Wrench, Plus, Search, Edit, Trash2, Save, AlertCircle, CheckCircle, Clock, Building
} from "lucide-react";

const MaintenanceRequests = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [requests, setRequests] = useState([
    {
      id: 1,
      title: "صيانة مكيف الهواء",
      asset: "مكيف الهواء - الطابق الثاني",
      priority: "عادية",
      status: "قيد التنفيذ",
      requester: "أحمد محمد",
      date: "2024-01-25",
      technician: "محمد علي",
      cost: 500
    },
    {
      id: 2,
      title: "إصلاح المصعد",
      asset: "المصعد الرئيسي",
      priority: "طارئة",
      status: "مكتملة",
      requester: "فاطمة علي",
      date: "2024-01-24",
      technician: "سارة أحمد",
      cost: 1500
    },
    {
      id: 3,
      title: "صيانة دورية للأجهزة",
      asset: "أجهزة المكتب",
      priority: "عادية",
      status: "مكتملة",
      requester: "محمد حسن",
      date: "2024-01-23",
      technician: "أحمد محمود",
      cost: 300
    }
  ]);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    asset: "",
    priority: "",
    requester: "",
    date: "",
    description: "",
    technician: "",
    cost: ""
  });
  const { toast } = useToast();

  const handleAdd = () => {
    setFormData({
      title: "",
      asset: "",
      priority: "",
      requester: "",
      date: new Date().toISOString().split('T')[0],
      description: "",
      technician: "",
      cost: ""
    });
    setIsAddDialogOpen(true);
  };

  const handleEdit = (request: any) => {
    setSelectedRequest(request);
    setFormData({
      title: request.title,
      asset: request.asset,
      priority: request.priority,
      requester: request.requester,
      date: request.date,
      description: request.description || "",
      technician: request.technician || "",
      cost: request.cost.toString() || ""
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (request: any) => {
    setSelectedRequest(request);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveAdd = () => {
    if (!formData.title || !formData.asset || !formData.priority || !formData.requester) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    const newRequest = {
      id: requests.length + 1,
      title: formData.title,
      asset: formData.asset,
      priority: formData.priority,
      status: "قيد التنفيذ",
      requester: formData.requester,
      date: formData.date,
      technician: formData.technician || "-",
      cost: parseFloat(formData.cost) || 0
    };
    
    setRequests([...requests, newRequest]);
    setIsAddDialogOpen(false);
    toast({
      title: "نجح",
      description: "تم إضافة طلب الصيانة بنجاح"
    });
  };

  const handleSaveEdit = () => {
    if (!formData.title || !formData.asset || !formData.priority || !formData.requester) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    setRequests(requests.map(r => 
      r.id === selectedRequest.id 
        ? { 
            ...r, 
            title: formData.title,
            asset: formData.asset,
            priority: formData.priority,
            requester: formData.requester,
            date: formData.date,
            technician: formData.technician || r.technician,
            cost: parseFloat(formData.cost) || r.cost
          }
        : r
    ));
    
    setIsEditDialogOpen(false);
    setSelectedRequest(null);
    toast({
      title: "نجح",
      description: "تم تحديث طلب الصيانة بنجاح"
    });
  };

  const handleConfirmDelete = () => {
    setRequests(requests.filter(r => r.id !== selectedRequest.id));
    setIsDeleteDialogOpen(false);
    setSelectedRequest(null);
    toast({
      title: "نجح",
      description: "تم حذف طلب الصيانة بنجاح"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-amber-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">طلبات الصيانة</h1>
            <p className="text-gray-600 mt-1">إدارة طلبات الصيانة والإصلاحات</p>
          </div>
          <div className="flex gap-3">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="البحث عن طلب..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            <Button className="bg-orange-600 hover:bg-orange-700" onClick={handleAdd}>
              <Plus className="w-5 h-5 ml-2" />
              طلب صيانة جديد
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="w-5 h-5" />
              قائمة طلبات الصيانة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-right py-3 px-4 font-semibold">عنوان الطلب</th>
                    <th className="text-right py-3 px-4 font-semibold">الأصل/الجهاز</th>
                    <th className="text-right py-3 px-4 font-semibold">الأولوية</th>
                    <th className="text-right py-3 px-4 font-semibold">الطالب</th>
                    <th className="text-right py-3 px-4 font-semibold">الفني</th>
                    <th className="text-right py-3 px-4 font-semibold">التاريخ</th>
                    <th className="text-right py-3 px-4 font-semibold">التكلفة</th>
                    <th className="text-right py-3 px-4 font-semibold">الحالة</th>
                    <th className="text-right py-3 px-4 font-semibold">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-semibold">{request.title}</td>
                      <td className="py-3 px-4">{request.asset}</td>
                      <td className="py-3 px-4">
                        <Badge className={
                          request.priority === "طارئة" ? "bg-red-500" :
                          request.priority === "عالية" ? "bg-amber-500" : "bg-blue-500"
                        }>
                          {request.priority === "طارئة" ? <AlertCircle className="w-3 h-3 ml-1" /> : null}
                          {request.priority}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">{request.requester}</td>
                      <td className="py-3 px-4">{request.technician}</td>
                      <td className="py-3 px-4">{request.date}</td>
                      <td className="py-3 px-4 font-bold text-green-600">{request.cost.toLocaleString()} ج.م</td>
                      <td className="py-3 px-4">
                        <Badge className={
                          request.status === "مكتملة" ? "bg-green-500" :
                          request.status === "قيد التنفيذ" ? "bg-blue-500" : "bg-gray-500"
                        }>
                          {request.status === "مكتملة" ? <CheckCircle className="w-3 h-3 ml-1" /> :
                           request.status === "قيد التنفيذ" ? <Clock className="w-3 h-3 ml-1" /> : null}
                          {request.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2 justify-end">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(request)} title="تعديل">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(request)} title="حذف">
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
              <DialogTitle>طلب صيانة جديد</DialogTitle>
              <DialogDescription>أدخل بيانات طلب الصيانة</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">عنوان الطلب *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="عنوان طلب الصيانة"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="asset">الأصل/الجهاز *</Label>
                  <Input
                    id="asset"
                    value={formData.asset}
                    onChange={(e) => setFormData({...formData, asset: e.target.value})}
                    placeholder="اسم الأصل أو الجهاز"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">الأولوية *</Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الأولوية" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="طارئة">طارئة</SelectItem>
                      <SelectItem value="عالية">عالية</SelectItem>
                      <SelectItem value="عادية">عادية</SelectItem>
                      <SelectItem value="منخفضة">منخفضة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="requester">الطالب *</Label>
                  <Input
                    id="requester"
                    value={formData.requester}
                    onChange={(e) => setFormData({...formData, requester: e.target.value})}
                    placeholder="اسم الطالب"
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="technician">الفني</Label>
                  <Input
                    id="technician"
                    value={formData.technician}
                    onChange={(e) => setFormData({...formData, technician: e.target.value})}
                    placeholder="اسم الفني"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost">التكلفة (ج.م)</Label>
                  <Input
                    id="cost"
                    type="number"
                    value={formData.cost}
                    onChange={(e) => setFormData({...formData, cost: e.target.value})}
                    placeholder="التكلفة"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">الوصف</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="وصف المشكلة"
                  rows={3}
                />
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
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>تعديل طلب الصيانة</DialogTitle>
              <DialogDescription>قم بتعديل بيانات طلب الصيانة</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">عنوان الطلب *</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="عنوان طلب الصيانة"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-asset">الأصل/الجهاز *</Label>
                  <Input
                    id="edit-asset"
                    value={formData.asset}
                    onChange={(e) => setFormData({...formData, asset: e.target.value})}
                    placeholder="اسم الأصل أو الجهاز"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-priority">الأولوية *</Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الأولوية" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="طارئة">طارئة</SelectItem>
                      <SelectItem value="عالية">عالية</SelectItem>
                      <SelectItem value="عادية">عادية</SelectItem>
                      <SelectItem value="منخفضة">منخفضة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-requester">الطالب *</Label>
                  <Input
                    id="edit-requester"
                    value={formData.requester}
                    onChange={(e) => setFormData({...formData, requester: e.target.value})}
                    placeholder="اسم الطالب"
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-technician">الفني</Label>
                  <Input
                    id="edit-technician"
                    value={formData.technician}
                    onChange={(e) => setFormData({...formData, technician: e.target.value})}
                    placeholder="اسم الفني"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-cost">التكلفة (ج.م)</Label>
                  <Input
                    id="edit-cost"
                    type="number"
                    value={formData.cost}
                    onChange={(e) => setFormData({...formData, cost: e.target.value})}
                    placeholder="التكلفة"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">الوصف</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="وصف المشكلة"
                  rows={3}
                />
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
                هل أنت متأكد من حذف طلب الصيانة "{selectedRequest?.title}"؟ هذا الإجراء لا يمكن التراجع عنه.
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

export default MaintenanceRequests;

