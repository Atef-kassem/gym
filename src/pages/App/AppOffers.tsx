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
  useGetAllOffersQuery,
  useCreateOfferMutation,
  useUpdateOfferMutation,
  useDeleteOfferMutation,
  useUploadAppImageMutation,
} from "@/services/appManagementApi";
import {
  Plus, Search, Edit, Trash2, Tag, Filter, Download, Save
} from "lucide-react";

const AppOffers = () => {
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);

  // جلب العروض من API
  const { data: offersData, isLoading, refetch: refetchOffers } = useGetAllOffersQuery({
    search: searchQuery,
  });
  const offers = Array.isArray(offersData?.data) ? offersData.data : [];

  // Mutations
  const [createOffer] = useCreateOfferMutation();
  const [updateOffer] = useUpdateOfferMutation();
  const [deleteOffer] = useDeleteOfferMutation();
  const [uploadAppImage] = useUploadAppImageMutation();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    discount: "",
    startDate: "",
    endDate: "",
    isActive: true
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const filteredOffers = offers;

  const stats = useMemo(() => {
    const total = offers.length;
    const active = offers.filter((o: { isActive: any; }) => o.isActive).length;
    return { total, active };
  }, [offers]);

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
      let imageUrl = (formData as any).imageUrl || null;
      if (imageFile) {
        const uploadRes = await uploadAppImage(imageFile).unwrap();
        imageUrl = uploadRes?.data?.link || uploadRes?.link || imageUrl;
      }

      const offerData: any = {
        title: formData.title,
        description: formData.description,
        discount: formData.discount ? parseFloat(formData.discount) : null,
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
        isActive: formData.isActive,
      };
      if (imageUrl) {
        offerData.imageUrl = imageUrl;
      }

      if (selectedOffer) {
        await updateOffer({ id: selectedOffer.id, data: offerData }).unwrap();
        toast({
          title: "نجح",
          description: "تم تحديث العرض بنجاح"
        });
        setIsEditDialogOpen(false);
      } else {
        await createOffer(offerData).unwrap();
        toast({
          title: "نجح",
          description: "تم إضافة العرض بنجاح"
        });
        setIsAddDialogOpen(false);
      }
      
      setFormData({ title: "", description: "", discount: "", startDate: "", endDate: "", isActive: true });
      setSelectedOffer(null);
      setImageFile(null);
      setImagePreview(null);
      refetchOffers();
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error?.data?.message || `حدث خطأ أثناء ${selectedOffer ? 'تحديث' : 'إضافة'} العرض`,
        variant: "destructive"
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteOffer(selectedOffer.id).unwrap();
      toast({
        title: "نجح",
        description: "تم حذف العرض بنجاح"
      });
      setIsDeleteDialogOpen(false);
      setSelectedOffer(null);
      refetchOffers();
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error?.data?.message || "حدث خطأ أثناء حذف العرض",
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
              <Tag className="w-8 h-8 text-blue-600" />
              إدارة العروض
            </h1>
            <p className="text-gray-600 mt-1">إدارة عروض التطبيق</p>
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
              إضافة عرض
            </Button>
          </div>
        </div>

        {/* البطاقات الإحصائية */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">إجمالي العروض</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">العروض النشطة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.active}</div>
            </CardContent>
          </Card>
        </div>

        {/* الجدول */}
        <Card>
          <CardHeader>
            <CardTitle>قائمة العروض ({filteredOffers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">العنوان</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">الوصف</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">الخصم</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">من</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">إلى</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">الحالة</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOffers.map((offer: any) => (
                    <tr key={offer.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-semibold whitespace-nowrap">{offer.title}</td>
                      <td className="py-3 px-4 whitespace-nowrap max-w-xs truncate">{offer.description}</td>
                      <td className="py-3 px-4 whitespace-nowrap">{offer.discount}%</td>
                      <td className="py-3 px-4 whitespace-nowrap">{offer.startDate}</td>
                      <td className="py-3 px-4 whitespace-nowrap">{offer.endDate}</td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {offer.isActive ? <Badge className="bg-green-500">نشط</Badge> : <Badge variant="outline">غير نشط</Badge>}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex gap-2 justify-end">
                          <Button variant="ghost" size="sm" onClick={() => {
                            setSelectedOffer(offer);
                            setFormData(offer);
                            setImagePreview(offer.imageUrl || null);
                            setIsEditDialogOpen(true);
                          }} className="hover:bg-blue-50">
                            <Edit className="w-4 h-4 text-blue-600" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => {
                            setSelectedOffer(offer);
                            setFormData({
                              title: offer.title,
                              description: offer.description,
                              discount: offer.discount?.toString() || "",
                              startDate: offer.startDate || "",
                              endDate: offer.endDate || "",
                              isActive: offer.isActive
                            });
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
              {filteredOffers.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Tag className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p>لا توجد عروض</p>
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
            setFormData({ title: "", description: "", discount: "", startDate: "", endDate: "", isActive: true });
            setSelectedOffer(null);
            setImageFile(null);
            setImagePreview(null);
          }
        }}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedOffer ? "تعديل عرض" : "إضافة عرض جديد"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">العنوان *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="أدخل عنوان العرض"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">الوصف *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="أدخل وصف العرض"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="offerImage">صورة العرض (اختيارية)</Label>
                <Input
                  id="offerImage"
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
                      alt="معاينة صورة العرض"
                      className="max-h-40 rounded-md border"
                    />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discount">الخصم (%)</Label>
                  <Input
                    id="discount"
                    type="number"
                    value={formData.discount}
                    onChange={(e) => setFormData({...formData, discount: e.target.value})}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2 flex items-center gap-4 pt-6">
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                  />
                  <Label htmlFor="isActive">نشط</Label>
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
                هل أنت متأكد من حذف العرض "{selectedOffer?.title}"؟ هذا الإجراء لا يمكن التراجع عنه.
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

export default AppOffers;

