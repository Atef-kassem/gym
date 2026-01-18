import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
  useGetAllAdsQuery,
  useCreateAdMutation,
  useUpdateAdMutation,
  useDeleteAdMutation,
  useUploadAppImageMutation,
} from "@/services/appManagementApi";
import {
  Plus, Search, Edit, Trash2, Megaphone, Download, Save
} from "lucide-react";

const AppAds = () => {
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAd, setSelectedAd] = useState<any>(null);

  // جلب الإعلانات من API
  const { data: adsData, isLoading, refetch: refetchAds } = useGetAllAdsQuery({
    search: searchQuery,
  });
  const ads = Array.isArray(adsData?.data) ? adsData.data : [];

  // Mutations
  const [createAd] = useCreateAdMutation();
  const [updateAd] = useUpdateAdMutation();
  const [deleteAd] = useDeleteAdMutation();
  const [uploadAppImage] = useUploadAppImageMutation();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    linkUrl: "",
    startDate: "",
    endDate: "",
    isActive: false
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const filteredAds = ads;

  const stats = {
    total: ads.length,
    active: ads.filter((a: any) => a.isActive).length,
  };

  const handleSave = async () => {
    if (!formData.title || !formData.description) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    try {
      // رفع الصورة إذا تم اختيار ملف
      let imageUrl = formData.imageUrl || null;
      if (imageFile) {
        const uploadRes = await uploadAppImage(imageFile).unwrap();
        imageUrl = uploadRes?.data?.link || uploadRes?.link || imageUrl;
      }

      const adData = {
        title: formData.title,
        description: formData.description,
        imageUrl,
        linkUrl: formData.linkUrl || null,
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
        isActive: formData.isActive,
      };

      if (selectedAd) {
        await updateAd({ id: selectedAd.id, data: adData }).unwrap();
        toast({
          title: "نجح",
          description: "تم تحديث الإعلان بنجاح"
        });
        setIsEditDialogOpen(false);
      } else {
        await createAd(adData).unwrap();
        toast({
          title: "نجح",
          description: "تم إضافة الإعلان بنجاح"
        });
        setIsAddDialogOpen(false);
      }
      
      setFormData({ title: "", description: "", imageUrl: "", linkUrl: "", startDate: "", endDate: "", isActive: false });
      setSelectedAd(null);
      setImageFile(null);
      setImagePreview(null);
      refetchAds();
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error?.data?.message || `حدث خطأ أثناء ${selectedAd ? 'تحديث' : 'إضافة'} الإعلان`,
        variant: "destructive"
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAd(selectedAd.id).unwrap();
      toast({
        title: "نجح",
        description: "تم حذف الإعلان بنجاح"
      });
      setIsDeleteDialogOpen(false);
      setSelectedAd(null);
      refetchAds();
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error?.data?.message || "حدث خطأ أثناء حذف الإعلان",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Megaphone className="w-8 h-8 text-blue-600" />
              إدارة الإعلانات
            </h1>
            <p className="text-gray-600 mt-1">إدارة إعلانات التطبيق</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="البحث..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              تصدير
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="w-5 h-5 ml-2" />
              إضافة إعلان
            </Button>
          </div>
        </div>

        {/* البطاقات الإحصائية */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">إجمالي الإعلانات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">الإعلانات النشطة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.active}</div>
            </CardContent>
          </Card>
        </div>

        {/* الجدول */}
        <Card>
          <CardHeader>
            <CardTitle>قائمة الإعلانات ({filteredAds.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">العنوان</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">الوصف</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">من</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">إلى</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">الحالة</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAds.map((ad: any) => (
                    <tr key={ad.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-semibold whitespace-nowrap">{ad.title}</td>
                      <td className="py-3 px-4 whitespace-nowrap max-w-xs truncate">{ad.description}</td>
                      <td className="py-3 px-4 whitespace-nowrap">{ad.startDate || "-"}</td>
                      <td className="py-3 px-4 whitespace-nowrap">{ad.endDate || "-"}</td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {ad.isActive ? <Badge className="bg-green-500">نشط</Badge> : <Badge variant="outline">غير نشط</Badge>}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex gap-2 justify-end">
                          <Button variant="ghost" size="sm" onClick={() => {
                            setSelectedAd(ad);
                            setFormData(ad);
                            setImagePreview(ad.imageUrl || null);
                            setIsEditDialogOpen(true);
                          }} className="hover:bg-blue-50">
                            <Edit className="w-4 h-4 text-blue-600" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => {
                            setSelectedAd(ad);
                            setIsDeleteDialogOpen(true);
                          }} className="hover:bg-red-50">
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredAds.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Megaphone className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p>لا توجد إعلانات</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Dialog إضافة/تعديل */}
        <Dialog open={isAddDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          setIsEditDialogOpen(open);
          if (!open) {
            setFormData({ title: "", description: "", imageUrl: "", linkUrl: "", startDate: "", endDate: "", isActive: false });
            setSelectedAd(null);
            setImageFile(null);
            setImagePreview(null);
          }
        }}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedAd ? "تعديل إعلان" : "إضافة إعلان جديد"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">العنوان *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="أدخل عنوان الإعلان"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">الوصف *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="أدخل وصف الإعلان"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adImage">صورة الإعلان (اختيارية)</Label>
                <Input
                  id="adImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setImageFile(file);
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setImagePreview(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    } else {
                      setImagePreview(null);
                    }
                  }}
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="معاينة صورة الإعلان"
                      className="max-h-40 rounded-md border"
                    />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">رابط الصورة</Label>
                  <Input
                    id="imageUrl"
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkUrl">رابط الإعلان</Label>
                  <Input
                    id="linkUrl"
                    type="url"
                    value={formData.linkUrl}
                    onChange={(e) => setFormData({...formData, linkUrl: e.target.value})}
                    placeholder="https://example.com"
                  />
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
                  <Label htmlFor="endDate">تاريخ الانتهاء</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2 flex items-center gap-4 pt-2">
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                />
                <Label htmlFor="isActive">نشط</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsAddDialogOpen(false);
                setIsEditDialogOpen(false);
              }}>
                إلغاء
              </Button>
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 ml-2" />
                حفظ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog حذف */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>تأكيد الحذف</DialogTitle>
              <DialogDescription>
                هل أنت متأكد من حذف الإعلان "{selectedAd?.title}"؟ هذا الإجراء لا يمكن التراجع عنه.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                إلغاء
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
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

export default AppAds;

