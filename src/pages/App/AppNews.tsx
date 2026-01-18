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
  useGetAllNewsQuery,
  useCreateNewsMutation,
  useUpdateNewsMutation,
  useDeleteNewsMutation,
  useUploadAppImageMutation,
} from "@/services/appManagementApi";
import {
  Plus, Search, Edit, Trash2, Newspaper, Download, Save
} from "lucide-react";

const AppNews = () => {
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<any>(null);

  // جلب الأخبار من API
  const { data: newsData, isLoading, refetch: refetchNews } = useGetAllNewsQuery({
    search: searchQuery,
  });
  const news = Array.isArray(newsData?.data) ? newsData.data : [];

  // Mutations
  const [createNews] = useCreateNewsMutation();
  const [updateNews] = useUpdateNewsMutation();
  const [deleteNews] = useDeleteNewsMutation();
  const [uploadAppImage] = useUploadAppImageMutation();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    publishDate: "",
    isPublished: false
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const filteredNews = news;

  const stats = {
    total: news.length,
    published: news.filter((n: any) => n.isPublished).length,
  };

  const handleSave = async () => {
    if (!formData.title || !formData.content) {
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

      const newsData: any = {
        title: formData.title,
        content: formData.content,
        publishDate: formData.publishDate || null,
        isPublished: formData.isPublished,
      };
      if (imageUrl) {
        newsData.imageUrl = imageUrl;
      }

      if (selectedNews) {
        await updateNews({ id: selectedNews.id, data: newsData }).unwrap();
        toast({
          title: "نجح",
          description: "تم تحديث الخبر بنجاح"
        });
        setIsEditDialogOpen(false);
      } else {
        await createNews(newsData).unwrap();
        toast({
          title: "نجح",
          description: "تم إضافة الخبر بنجاح"
        });
        setIsAddDialogOpen(false);
      }
      
      setFormData({ title: "", content: "", publishDate: "", isPublished: false });
      setSelectedNews(null);
      setImageFile(null);
      setImagePreview(null);
      refetchNews();
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error?.data?.message || `حدث خطأ أثناء ${selectedNews ? 'تحديث' : 'إضافة'} الخبر`,
        variant: "destructive"
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteNews(selectedNews.id).unwrap();
      toast({
        title: "نجح",
        description: "تم حذف الخبر بنجاح"
      });
      setIsDeleteDialogOpen(false);
      setSelectedNews(null);
      refetchNews();
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error?.data?.message || "حدث خطأ أثناء حذف الخبر",
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
              <Newspaper className="w-8 h-8 text-blue-600" />
              إدارة الأخبار
            </h1>
            <p className="text-gray-600 mt-1">إدارة أخبار التطبيق</p>
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
              إضافة خبر
            </Button>
          </div>
        </div>

        {/* البطاقات الإحصائية */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">إجمالي الأخبار</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">الأخبار المنشورة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.published}</div>
            </CardContent>
          </Card>
        </div>

        {/* الجدول */}
        <Card>
          <CardHeader>
            <CardTitle>قائمة الأخبار ({filteredNews.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">العنوان</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">المحتوى</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">تاريخ النشر</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">الحالة</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNews.map((item: any) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-semibold whitespace-nowrap">{item.title}</td>
                      <td className="py-3 px-4 whitespace-nowrap max-w-xs truncate">{item.content}</td>
                      <td className="py-3 px-4 whitespace-nowrap">{item.publishDate || "-"}</td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {item.isPublished ? <Badge className="bg-green-500">منشور</Badge> : <Badge variant="outline">مسودة</Badge>}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex gap-2 justify-end">
                          <Button variant="ghost" size="sm" onClick={() => {
                            setSelectedNews(item);
                            setFormData(item);
                            setImagePreview(item.imageUrl || null);
                            setIsEditDialogOpen(true);
                          }} className="hover:bg-blue-50">
                            <Edit className="w-4 h-4 text-blue-600" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => {
                            setSelectedNews(item);
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
              {filteredNews.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Newspaper className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p>لا توجد أخبار</p>
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
            setFormData({ title: "", content: "", publishDate: "", isPublished: false });
            setSelectedNews(null);
            setImageFile(null);
            setImagePreview(null);
          }
        }}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedNews ? "تعديل خبر" : "إضافة خبر جديد"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">العنوان *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="أدخل عنوان الخبر"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">المحتوى *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  placeholder="أدخل محتوى الخبر"
                  rows={8}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newsImage">صورة الخبر (اختيارية)</Label>
                <Input
                  id="newsImage"
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
                      alt="معاينة صورة الخبر"
                      className="max-h-40 rounded-md border"
                    />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="publishDate">تاريخ النشر</Label>
                  <Input
                    id="publishDate"
                    type="date"
                    value={formData.publishDate}
                    onChange={(e) => setFormData({...formData, publishDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2 flex items-center gap-4 pt-6">
                  <Switch
                    checked={formData.isPublished}
                    onCheckedChange={(checked) => setFormData({...formData, isPublished: checked})}
                  />
                  <Label htmlFor="isPublished">نشر</Label>
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
                هل أنت متأكد من حذف الخبر "{selectedNews?.title}"؟ هذا الإجراء لا يمكن التراجع عنه.
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

export default AppNews;

