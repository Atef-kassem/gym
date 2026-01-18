import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  ShoppingCart, Activity, TrendingUp, Award, Plus, Save,
  Search, Edit, Trash2
} from "lucide-react";

const ServicesAndMarketing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [spaServices, setSpaServices] = useState([
    { id: 1, name: "مساج الاسترخاء", price: 300, duration: "60 دقيقة", status: "نشط" },
    { id: 2, name: "مساج العلاجي", price: 400, duration: "90 دقيقة", status: "نشط" },
    { id: 3, name: "حمام بخار", price: 150, duration: "30 دقيقة", status: "نشط" }
  ]);
  
  const [sales, setSales] = useState([
    { id: 1, product: "بروتين بودرة", quantity: 25, revenue: 5000, date: "2024-01-25" },
    { id: 2, product: "مكملات غذائية", quantity: 15, revenue: 3000, date: "2024-01-25" },
    { id: 3, product: "ملابس رياضية", quantity: 10, revenue: 2500, date: "2024-01-24" }
  ]);
  
  const [campaigns, setCampaigns] = useState([
    { id: 1, name: "عرض الشتاء", discount: "20%", status: "نشط", participants: 150 },
    { id: 2, name: "اشتراك سنوي", discount: "15%", status: "نشط", participants: 80 },
    { id: 3, name: "عرض الصيف", discount: "25%", status: "منتهي", participants: 200 }
  ]);
  
  const [activeTab, setActiveTab] = useState("spa");
  const [isSpaAddDialogOpen, setIsSpaAddDialogOpen] = useState(false);
  const [isSpaEditDialogOpen, setIsSpaEditDialogOpen] = useState(false);
  const [isSalesAddDialogOpen, setIsSalesAddDialogOpen] = useState(false);
  const [isCampaignAddDialogOpen, setIsCampaignAddDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [spaFormData, setSpaFormData] = useState({
    name: "",
    price: "",
    duration: ""
  });
  const [salesFormData, setSalesFormData] = useState({
    product: "",
    quantity: "",
    revenue: "",
    date: new Date().toISOString().split('T')[0]
  });
  const [campaignFormData, setCampaignFormData] = useState({
    name: "",
    discount: "",
    startDate: "",
    endDate: "",
    maxParticipants: ""
  });
  const { toast } = useToast();

  const handleSpaAdd = () => {
    setSpaFormData({ name: "", price: "", duration: "" });
    setIsSpaAddDialogOpen(true);
  };

  const handleSpaEdit = (service: any) => {
    setSelectedItem(service);
    setSpaFormData({
      name: service.name,
      price: service.price.toString(),
      duration: service.duration
    });
    setIsSpaEditDialogOpen(true);
  };

  const handleSpaDelete = (service: any) => {
    setSpaServices(spaServices.filter(s => s.id !== service.id));
    toast({
      title: "نجح",
      description: "تم حذف الخدمة بنجاح"
    });
  };

  const handleSpaSaveAdd = () => {
    if (!spaFormData.name || !spaFormData.price || !spaFormData.duration) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }
    const newService = {
      id: spaServices.length + 1,
      name: spaFormData.name,
      price: parseFloat(spaFormData.price),
      duration: spaFormData.duration,
      status: "نشط"
    };
    setSpaServices([...spaServices, newService]);
    setIsSpaAddDialogOpen(false);
    toast({
      title: "نجح",
      description: "تم إضافة الخدمة بنجاح"
    });
  };

  const handleSpaSaveEdit = () => {
    if (!spaFormData.name || !spaFormData.price || !spaFormData.duration) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }
    setSpaServices(spaServices.map(s => 
      s.id === selectedItem.id 
        ? { ...s, name: spaFormData.name, price: parseFloat(spaFormData.price), duration: spaFormData.duration }
        : s
    ));
    setIsSpaEditDialogOpen(false);
    setSelectedItem(null);
    toast({
      title: "نجح",
      description: "تم تحديث الخدمة بنجاح"
    });
  };

  const handleSalesAdd = () => {
    setSalesFormData({
      product: "",
      quantity: "",
      revenue: "",
      date: new Date().toISOString().split('T')[0]
    });
    setIsSalesAddDialogOpen(true);
  };

  const handleSalesSaveAdd = () => {
    if (!salesFormData.product || !salesFormData.quantity || !salesFormData.revenue) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }
    const newSale = {
      id: sales.length + 1,
      product: salesFormData.product,
      quantity: parseInt(salesFormData.quantity),
      revenue: parseFloat(salesFormData.revenue),
      date: salesFormData.date
    };
    setSales([...sales, newSale]);
    setIsSalesAddDialogOpen(false);
    toast({
      title: "نجح",
      description: "تم إضافة البيع بنجاح"
    });
  };

  const handleCampaignAdd = () => {
    setCampaignFormData({
      name: "",
      discount: "",
      startDate: "",
      endDate: "",
      maxParticipants: ""
    });
    setIsCampaignAddDialogOpen(true);
  };

  const handleCampaignSaveAdd = () => {
    if (!campaignFormData.name || !campaignFormData.discount) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }
    const newCampaign = {
      id: campaigns.length + 1,
      name: campaignFormData.name,
      discount: campaignFormData.discount,
      status: "نشط",
      participants: 0,
      maxParticipants: parseInt(campaignFormData.maxParticipants) || 0
    };
    setCampaigns([...campaigns, newCampaign]);
    setIsCampaignAddDialogOpen(false);
    toast({
      title: "نجح",
      description: "تم إضافة الحملة بنجاح"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50/30 to-rose-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* العنوان */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">الخدمات والتسويق</h1>
            <p className="text-gray-600 mt-1">إدارة الخدمات والتسويق والمبيعات</p>
          </div>
          <div className="flex gap-3">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                placeholder="البحث..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* إحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-pink-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">خدمات SPA</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-pink-600">8</div>
              <p className="text-sm text-gray-500 mt-1">خدمة متاحة</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">مبيعات الشهر</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">45,000 ج.م</div>
              <p className="text-sm text-gray-500 mt-1">هذا الشهر</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">الحملات النشطة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">5</div>
              <p className="text-sm text-gray-500 mt-1">حملة نشطة</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">برامج الولاء</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">230</div>
              <p className="text-sm text-gray-500 mt-1">عضو في البرامج</p>
            </CardContent>
          </Card>
        </div>

        {/* التبويبات */}
        <Tabs defaultValue="spa" className="space-y-4">
          <TabsList>
            <TabsTrigger value="spa">خدمات SPA</TabsTrigger>
            <TabsTrigger value="sales">إدارة المبيعات</TabsTrigger>
            <TabsTrigger value="marketing">التسويق</TabsTrigger>
            <TabsTrigger value="loyalty">برامج الولاء</TabsTrigger>
          </TabsList>

          <TabsContent value="spa">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    خدمات SPA
                  </CardTitle>
                  <Button className="bg-pink-600 hover:bg-pink-700" onClick={handleSpaAdd}>
                    <Plus className="w-5 h-5 ml-2" />
                    إضافة خدمة
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {spaServices.map((service) => (
                    <Card key={service.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{service.name}</h3>
                            <div className="flex gap-4 mt-2 text-sm text-gray-600">
                              <span>{service.price} ج.م</span>
                              <span>{service.duration}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className="bg-green-500">{service.status}</Badge>
                            <Button variant="ghost" size="sm" onClick={() => handleSpaEdit(service)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleSpaDelete(service)}>
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sales">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    إدارة المبيعات
                  </CardTitle>
                  <Button className="bg-green-600 hover:bg-green-700" onClick={handleSalesAdd}>
                    <Plus className="w-5 h-5 ml-2" />
                    بيع جديد
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-right py-3 px-4 font-semibold">المنتج</th>
                        <th className="text-right py-3 px-4 font-semibold">الكمية</th>
                        <th className="text-right py-3 px-4 font-semibold">الإيراد</th>
                        <th className="text-right py-3 px-4 font-semibold">التاريخ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sales.map((sale) => (
                        <tr key={sale.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{sale.product}</td>
                          <td className="py-3 px-4">{sale.quantity}</td>
                          <td className="py-3 px-4 font-bold text-green-600">{sale.revenue.toLocaleString()} ج.م</td>
                          <td className="py-3 px-4">{sale.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="marketing">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    الحملات التسويقية
                  </CardTitle>
                  <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleCampaignAdd}>
                    <Plus className="w-5 h-5 ml-2" />
                    حملة جديدة
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaigns.map((campaign) => (
                    <Card key={campaign.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{campaign.name}</h3>
                            <div className="flex gap-4 mt-2 text-sm text-gray-600">
                              <span>خصم {campaign.discount}</span>
                              <span>{campaign.participants} مشارك</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className={campaign.status === "نشط" ? "bg-green-500" : "bg-gray-500"}>
                              {campaign.status}
                            </Badge>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="loyalty">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  برامج الولاء
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Award className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>برامج الولاء سيظهر هنا</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dialog إضافة خدمة SPA */}
        <Dialog open={isSpaAddDialogOpen} onOpenChange={setIsSpaAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>إضافة خدمة SPA</DialogTitle>
              <DialogDescription>أدخل بيانات الخدمة الجديدة</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="spa-name">اسم الخدمة *</Label>
                <Input
                  id="spa-name"
                  value={spaFormData.name}
                  onChange={(e) => setSpaFormData({...spaFormData, name: e.target.value})}
                  placeholder="اسم الخدمة"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="spa-price">السعر *</Label>
                  <Input
                    id="spa-price"
                    type="number"
                    value={spaFormData.price}
                    onChange={(e) => setSpaFormData({...spaFormData, price: e.target.value})}
                    placeholder="السعر بالجنيه"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="spa-duration">المدة *</Label>
                  <Input
                    id="spa-duration"
                    value={spaFormData.duration}
                    onChange={(e) => setSpaFormData({...spaFormData, duration: e.target.value})}
                    placeholder="مثال: 60 دقيقة"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsSpaAddDialogOpen(false)}>إلغاء</Button>
              <Button onClick={handleSpaSaveAdd} className="bg-pink-600 hover:bg-pink-700">
                <Save className="w-4 h-4 ml-2" /> حفظ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog تعديل خدمة SPA */}
        <Dialog open={isSpaEditDialogOpen} onOpenChange={setIsSpaEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>تعديل خدمة SPA</DialogTitle>
              <DialogDescription>قم بتعديل بيانات الخدمة</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-spa-name">اسم الخدمة *</Label>
                <Input
                  id="edit-spa-name"
                  value={spaFormData.name}
                  onChange={(e) => setSpaFormData({...spaFormData, name: e.target.value})}
                  placeholder="اسم الخدمة"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-spa-price">السعر *</Label>
                  <Input
                    id="edit-spa-price"
                    type="number"
                    value={spaFormData.price}
                    onChange={(e) => setSpaFormData({...spaFormData, price: e.target.value})}
                    placeholder="السعر بالجنيه"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-spa-duration">المدة *</Label>
                  <Input
                    id="edit-spa-duration"
                    value={spaFormData.duration}
                    onChange={(e) => setSpaFormData({...spaFormData, duration: e.target.value})}
                    placeholder="مثال: 60 دقيقة"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsSpaEditDialogOpen(false)}>إلغاء</Button>
              <Button onClick={handleSpaSaveEdit} className="bg-pink-600 hover:bg-pink-700">
                <Save className="w-4 h-4 ml-2" /> حفظ التغييرات
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog إضافة بيع */}
        <Dialog open={isSalesAddDialogOpen} onOpenChange={setIsSalesAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>إضافة بيع جديد</DialogTitle>
              <DialogDescription>أدخل بيانات البيع</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="product">المنتج *</Label>
                <Input
                  id="product"
                  value={salesFormData.product}
                  onChange={(e) => setSalesFormData({...salesFormData, product: e.target.value})}
                  placeholder="اسم المنتج"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">الكمية *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={salesFormData.quantity}
                    onChange={(e) => setSalesFormData({...salesFormData, quantity: e.target.value})}
                    placeholder="الكمية"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="revenue">الإيراد *</Label>
                  <Input
                    id="revenue"
                    type="number"
                    value={salesFormData.revenue}
                    onChange={(e) => setSalesFormData({...salesFormData, revenue: e.target.value})}
                    placeholder="الإيراد بالجنيه"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">التاريخ *</Label>
                <Input
                  id="date"
                  type="date"
                  value={salesFormData.date}
                  onChange={(e) => setSalesFormData({...salesFormData, date: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsSalesAddDialogOpen(false)}>إلغاء</Button>
              <Button onClick={handleSalesSaveAdd} className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 ml-2" /> حفظ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog إضافة حملة */}
        <Dialog open={isCampaignAddDialogOpen} onOpenChange={setIsCampaignAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>إضافة حملة جديدة</DialogTitle>
              <DialogDescription>أدخل بيانات الحملة التسويقية</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="campaign-name">اسم الحملة *</Label>
                <Input
                  id="campaign-name"
                  value={campaignFormData.name}
                  onChange={(e) => setCampaignFormData({...campaignFormData, name: e.target.value})}
                  placeholder="اسم الحملة"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discount">الخصم *</Label>
                  <Input
                    id="discount"
                    value={campaignFormData.discount}
                    onChange={(e) => setCampaignFormData({...campaignFormData, discount: e.target.value})}
                    placeholder="مثال: 20%"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-participants">الحد الأقصى للمشاركين</Label>
                  <Input
                    id="max-participants"
                    type="number"
                    value={campaignFormData.maxParticipants}
                    onChange={(e) => setCampaignFormData({...campaignFormData, maxParticipants: e.target.value})}
                    placeholder="الحد الأقصى"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">تاريخ البدء</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={campaignFormData.startDate}
                    onChange={(e) => setCampaignFormData({...campaignFormData, startDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">تاريخ الانتهاء</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={campaignFormData.endDate}
                    onChange={(e) => setCampaignFormData({...campaignFormData, endDate: e.target.value})}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCampaignAddDialogOpen(false)}>إلغاء</Button>
              <Button onClick={handleCampaignSaveAdd} className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 ml-2" /> حفظ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
};

export default ServicesAndMarketing;

