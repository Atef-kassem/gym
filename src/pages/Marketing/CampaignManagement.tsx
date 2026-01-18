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
  Target, Plus, Search, Edit, Trash2, Save, Calendar, TrendingUp, Users, DollarSign
} from "lucide-react";

const CampaignManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      name: "حملة الصيف الكبرى",
      type: "تسويق رقمي",
      startDate: "2024-01-15",
      endDate: "2024-03-15",
      budget: 50000,
      spent: 35000,
      status: "نشط",
      impressions: 125000,
      clicks: 8500,
      conversions: 425
    },
    {
      id: 2,
      name: "عرض خاص للعملاء الجدد",
      type: "إعلان",
      startDate: "2024-01-20",
      endDate: "2024-02-20",
      budget: 25000,
      spent: 18000,
      status: "نشط",
      impressions: 75000,
      clicks: 4500,
      conversions: 225
    },
    {
      id: 3,
      name: "حملة العودة للمدرسة",
      type: "تسويق مباشر",
      startDate: "2024-02-01",
      endDate: "2024-02-28",
      budget: 30000,
      spent: 30000,
      status: "مكتملة",
      impressions: 95000,
      clicks: 6200,
      conversions: 310
    }
  ]);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    startDate: "",
    endDate: "",
    budget: "",
    description: ""
  });
  const { toast } = useToast();

  const handleAdd = () => {
    setFormData({
      name: "",
      type: "",
      startDate: "",
      endDate: "",
      budget: "",
      description: ""
    });
    setIsAddDialogOpen(true);
  };

  const handleEdit = (campaign: any) => {
    setSelectedCampaign(campaign);
    setFormData({
      name: campaign.name,
      type: campaign.type,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      budget: campaign.budget.toString(),
      description: campaign.description || ""
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (campaign: any) => {
    setSelectedCampaign(campaign);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveAdd = () => {
    if (!formData.name || !formData.type || !formData.startDate || !formData.endDate || !formData.budget) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    const newCampaign = {
      id: campaigns.length + 1,
      name: formData.name,
      type: formData.type,
      startDate: formData.startDate,
      endDate: formData.endDate,
      budget: parseFloat(formData.budget) || 0,
      spent: 0,
      status: "نشط",
      impressions: 0,
      clicks: 0,
      conversions: 0
    };
    
    setCampaigns([...campaigns, newCampaign]);
    setIsAddDialogOpen(false);
    toast({
      title: "نجح",
      description: "تم إضافة الحملة بنجاح"
    });
  };

  const handleSaveEdit = () => {
    if (!formData.name || !formData.type || !formData.startDate || !formData.endDate || !formData.budget) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    setCampaigns(campaigns.map(c => 
      c.id === selectedCampaign.id 
        ? { 
            ...c, 
            name: formData.name,
            type: formData.type,
            startDate: formData.startDate,
            endDate: formData.endDate,
            budget: parseFloat(formData.budget) || c.budget
          }
        : c
    ));
    
    setIsEditDialogOpen(false);
    setSelectedCampaign(null);
    toast({
      title: "نجح",
      description: "تم تحديث الحملة بنجاح"
    });
  };

  const handleConfirmDelete = () => {
    setCampaigns(campaigns.filter(c => c.id !== selectedCampaign.id));
    setIsDeleteDialogOpen(false);
    setSelectedCampaign(null);
    toast({
      title: "نجح",
      description: "تم حذف الحملة بنجاح"
    });
  };

  const getROI = (campaign: any) => {
    if (campaign.spent === 0) return 0;
    const revenue = campaign.conversions * 100; // تقدير متوسط قيمة التحويل
    return ((revenue - campaign.spent) / campaign.spent) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50/30 to-rose-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">إدارة الحملات</h1>
            <p className="text-gray-600 mt-1">إدارة الحملات التسويقية والإعلانية</p>
          </div>
          <div className="flex gap-3">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="البحث عن حملة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            <Button className="bg-pink-600 hover:bg-pink-700" onClick={handleAdd}>
              <Plus className="w-5 h-5 ml-2" />
              حملة جديدة
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              قائمة الحملات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-right py-3 px-4 font-semibold">اسم الحملة</th>
                    <th className="text-right py-3 px-4 font-semibold">النوع</th>
                    <th className="text-right py-3 px-4 font-semibold">من تاريخ</th>
                    <th className="text-right py-3 px-4 font-semibold">إلى تاريخ</th>
                    <th className="text-right py-3 px-4 font-semibold">الميزانية</th>
                    <th className="text-right py-3 px-4 font-semibold">المصروف</th>
                    <th className="text-right py-3 px-4 font-semibold">التحويلات</th>
                    <th className="text-right py-3 px-4 font-semibold">الحالة</th>
                    <th className="text-right py-3 px-4 font-semibold">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((campaign) => {
                    const spentPercent = (campaign.spent / campaign.budget) * 100;
                    const conversionRate = campaign.impressions > 0 ? (campaign.conversions / campaign.impressions) * 100 : 0;
                    return (
                      <tr key={campaign.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-semibold">{campaign.name}</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">{campaign.type}</Badge>
                        </td>
                        <td className="py-3 px-4">{campaign.startDate}</td>
                        <td className="py-3 px-4">{campaign.endDate}</td>
                        <td className="py-3 px-4 font-bold">{campaign.budget.toLocaleString()} ج.م</td>
                        <td className="py-3 px-4">
                          <div className="flex flex-col">
                            <span className="font-semibold">{campaign.spent.toLocaleString()} ج.م</span>
                            <Badge className={spentPercent > 90 ? "bg-red-500" : spentPercent > 70 ? "bg-amber-500" : "bg-green-500"} variant="outline">
                              {Math.round(spentPercent)}%
                            </Badge>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-col">
                            <span className="font-semibold">{campaign.conversions}</span>
                            <span className="text-xs text-gray-500">{Math.round(conversionRate * 100) / 100}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={campaign.status === "نشط" ? "bg-green-500" : "bg-gray-500"}>
                            {campaign.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2 justify-end">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(campaign)} title="تعديل">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(campaign)} title="حذف">
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
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>حملة جديدة</DialogTitle>
              <DialogDescription>أدخل بيانات الحملة الجديدة</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">اسم الحملة *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="اسم الحملة"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">نوع الحملة *</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر النوع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="تسويق رقمي">تسويق رقمي</SelectItem>
                      <SelectItem value="إعلان">إعلان</SelectItem>
                      <SelectItem value="تسويق مباشر">تسويق مباشر</SelectItem>
                      <SelectItem value="علاقات عامة">علاقات عامة</SelectItem>
                      <SelectItem value="أخرى">أخرى</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget">الميزانية (ج.م) *</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                    placeholder="الميزانية"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">من تاريخ *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">إلى تاريخ *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">الوصف</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="وصف الحملة"
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
              <DialogTitle>تعديل الحملة</DialogTitle>
              <DialogDescription>قم بتعديل بيانات الحملة</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">اسم الحملة *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="اسم الحملة"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-type">نوع الحملة *</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر النوع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="تسويق رقمي">تسويق رقمي</SelectItem>
                      <SelectItem value="إعلان">إعلان</SelectItem>
                      <SelectItem value="تسويق مباشر">تسويق مباشر</SelectItem>
                      <SelectItem value="علاقات عامة">علاقات عامة</SelectItem>
                      <SelectItem value="أخرى">أخرى</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-budget">الميزانية (ج.م) *</Label>
                  <Input
                    id="edit-budget"
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                    placeholder="الميزانية"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-startDate">من تاريخ *</Label>
                  <Input
                    id="edit-startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-endDate">إلى تاريخ *</Label>
                  <Input
                    id="edit-endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">الوصف</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="وصف الحملة"
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
                هل أنت متأكد من حذف الحملة "{selectedCampaign?.name}"؟ هذا الإجراء لا يمكن التراجع عنه.
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

export default CampaignManagement;

