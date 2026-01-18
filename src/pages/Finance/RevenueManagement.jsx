import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus, Save, Trash2, Edit, Eye, CheckCircle, Clock,
  DollarSign, TrendingUp, Calendar, Filter, Search,
  FileText, Users, Award
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  useGetRevenuesQuery,
  useCreateRevenueMutation,
  useUpdateRevenueMutation,
  useDeleteRevenueMutation,
  useGetRevenueStatisticsQuery,
  useGetTopCustomersQuery,
} from "@/store/revenuesApi";
import { SalesRevenueSync } from "@/components/Finance/SalesRevenueSync";

const RevenueManagement = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRevenue, setSelectedRevenue] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    source: "all",
    paymentStatus: "all",
    startDate: "",
    endDate: ""
  });

  const [formData, setFormData] = useState({
    revenueDate: new Date().toISOString().split('T')[0],
    source: "",
    subSource: "",
    amount: "",
    paymentMethod: "نقدي",
    paymentStatus: "مدفوع",
    description: "",
    customerName: "",
    invoiceNumber: "",
    receiptNumber: "",
    taxAmount: "",
    discountAmount: "",
    notes: ""
  });

  const { data: revenuesData, isLoading, refetch } = useGetRevenuesQuery({
    search: filters.search,
    source: filters.source !== "all" ? filters.source : undefined,
    paymentStatus: filters.paymentStatus !== "all" ? filters.paymentStatus : undefined,
    startDate: filters.startDate,
    endDate: filters.endDate,
    page: 1,
    limit: 100
  }, {
    skip: !localStorage.getItem("authToken")
  });

  const { data: statsData } = useGetRevenueStatisticsQuery({
    startDate: filters.startDate,
    endDate: filters.endDate
  }, {
    skip: !localStorage.getItem("authToken")
  });

  const { data: topCustomersData } = useGetTopCustomersQuery({
    limit: 5
  }, {
    skip: !localStorage.getItem("authToken")
  });

  const [createRevenue, { isLoading: isCreating }] = useCreateRevenueMutation();
  const [updateRevenue, { isLoading: isUpdating }] = useUpdateRevenueMutation();
  const [deleteRevenue] = useDeleteRevenueMutation();

  const revenues = revenuesData?.data?.revenues || [];
  const stats = statsData?.data || {};
  const topCustomers = topCustomersData?.data || [];

  const sources = [
    'مبيعات منتجات', 'مبيعات خدمات', 'اشتراكات', 'عمولات',
    'استثمارات', 'إيجارات', 'تبرعات', 'فوائد', 'مردودات', 'أخرى'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      revenueDate: new Date().toISOString().split('T')[0],
      source: "",
      subSource: "",
      amount: "",
      paymentMethod: "نقدي",
      paymentStatus: "مدفوع",
      description: "",
      customerName: "",
      invoiceNumber: "",
      receiptNumber: "",
      taxAmount: "",
      discountAmount: "",
      notes: ""
    });
    setEditMode(false);
    setSelectedRevenue(null);
    setDialogOpen(false);
    setViewMode(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.source || !formData.amount) {
      toast({
        title: "خطأ",
        description: "يجب إدخال المصدر والمبلغ",
        variant: "destructive"
      });
      return;
    }

    try {
      const revenueData = {
        ...formData,
        amount: parseFloat(formData.amount),
        taxAmount: parseFloat(formData.taxAmount) || 0,
        discountAmount: parseFloat(formData.discountAmount) || 0,
      };

      if (editMode && selectedRevenue) {
        await updateRevenue({ id: selectedRevenue.id, data: revenueData }).unwrap();
        toast({
          title: "تم التحديث",
          description: "تم تحديث الإيراد بنجاح"
        });
      } else {
        await createRevenue(revenueData).unwrap();
        toast({
          title: "تم الحفظ",
          description: "تم إنشاء الإيراد بنجاح"
        });
      }

      resetForm();
      refetch();
    } catch (error) {
      toast({
        title: "خطأ",
        description: error?.data?.message || "حدث خطأ أثناء حفظ الإيراد",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (revenue) => {
    setFormData({
      revenueDate: revenue.revenueDate || new Date().toISOString().split('T')[0],
      source: revenue.source || "",
      subSource: revenue.subSource || "",
      amount: revenue.amount?.toString() || "",
      paymentMethod: revenue.paymentMethod || "نقدي",
      paymentStatus: revenue.paymentStatus || "مدفوع",
      description: revenue.description || "",
      customerName: revenue.customerName || "",
      invoiceNumber: revenue.invoiceNumber || "",
      receiptNumber: revenue.receiptNumber || "",
      taxAmount: revenue.taxAmount?.toString() || "",
      discountAmount: revenue.discountAmount?.toString() || "",
      notes: revenue.notes || ""
    });
    setSelectedRevenue(revenue);
    setEditMode(true);
    setDialogOpen(true);
  };

  const handleView = (revenue) => {
    setSelectedRevenue(revenue);
    setViewMode(true);
    setDialogOpen(true);
  };

  const handleDelete = async (revenueId) => {
    if (window.confirm("هل أنت متأكد من حذف هذا الإيراد؟")) {
      try {
        await deleteRevenue(revenueId).unwrap();
        toast({
          title: "تم الحذف",
          description: "تم حذف الإيراد بنجاح"
        });
        refetch();
      } catch (error) {
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء الحذف",
          variant: "destructive"
        });
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'مدفوع': 'bg-green-100 text-green-800',
      'معلق': 'bg-yellow-100 text-yellow-800',
      'مؤجل': 'bg-blue-100 text-blue-800',
      'ملغي': 'bg-red-100 text-red-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredRevenues = revenues.filter(revenue => {
    if (activeTab === "all") return true;
    if (activeTab === "paid") return revenue.paymentStatus === "مدفوع";
    if (activeTab === "pending") return revenue.paymentStatus === "معلق";
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/30 to-emerald-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* مزامنة الإيرادات من المبيعات */}
        <SalesRevenueSync />
        
        {/* الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                إجمالي الإيرادات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {(stats.totalAmount || 0).toLocaleString()} ج.م
              </div>
              <p className="text-sm text-gray-500 mt-1">{stats.totalRevenues || 0} إيراد</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                الضرائب
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {(stats.totalTax || 0).toLocaleString()} ج.م
              </div>
              <p className="text-sm text-gray-500 mt-1">إجمالي الضرائب</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Award className="w-4 h-4" />
                الخصومات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">
                {(stats.totalDiscount || 0).toLocaleString()} ج.م
              </div>
              <p className="text-sm text-gray-500 mt-1">إجمالي الخصومات</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                مدفوعة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {revenues.filter(r => r.paymentStatus === "مدفوع").length}
              </div>
              <p className="text-sm text-gray-500 mt-1">إيرادات مستلمة</p>
            </CardContent>
          </Card>
        </div>

        {/* الفلاتر */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              تصفية الإيرادات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>بحث</Label>
                <div className="relative">
                  <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="رقم الإيراد، العميل..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="pr-10"
                  />
                </div>
              </div>
              <div>
                <Label>المصدر</Label>
                <Select value={filters.source} onValueChange={(value) => setFilters(prev => ({ ...prev, source: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="جميع المصادر" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع المصادر</SelectItem>
                    {sources.map(src => (
                      <SelectItem key={src} value={src}>{src}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>حالة الدفع</Label>
                <Select value={filters.paymentStatus} onValueChange={(value) => setFilters(prev => ({ ...prev, paymentStatus: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="جميع الحالات" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الحالات</SelectItem>
                    <SelectItem value="مدفوع">مدفوع</SelectItem>
                    <SelectItem value="معلق">معلق</SelectItem>
                    <SelectItem value="مؤجل">مؤجل</SelectItem>
                    <SelectItem value="ملغي">ملغي</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>من تاريخ</Label>
                <Input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div>
                <Label>إلى تاريخ</Label>
                <Input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={refetch} className="w-full" variant="outline">
                  تطبيق الفلتر
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* قائمة الإيرادات */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>إدارة الإيرادات</CardTitle>
              <Button onClick={() => {
                resetForm();
                setDialogOpen(true);
              }}>
                <Plus className="w-4 h-4 ml-2" />
                إضافة إيراد
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">الكل ({revenues.length})</TabsTrigger>
                <TabsTrigger value="paid">مدفوعة ({revenues.filter(r => r.paymentStatus === "مدفوع").length})</TabsTrigger>
                <TabsTrigger value="pending">معلقة ({revenues.filter(r => r.paymentStatus === "معلق").length})</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-6">
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">جاري التحميل...</p>
                  </div>
                ) : filteredRevenues.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">لا توجد إيرادات</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>رقم الإيراد</TableHead>
                          <TableHead>التاريخ</TableHead>
                          <TableHead>المصدر</TableHead>
                          <TableHead>المبلغ</TableHead>
                          <TableHead>العميل</TableHead>
                          <TableHead>حالة الدفع</TableHead>
                          <TableHead>الإجراءات</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredRevenues.map((revenue) => (
                          <TableRow key={revenue.id}>
                            <TableCell className="font-medium">{revenue.revenueNumber}</TableCell>
                            <TableCell>{new Date(revenue.revenueDate).toLocaleDateString('ar-EG')}</TableCell>
                            <TableCell>{revenue.source}</TableCell>
                            <TableCell className="font-semibold text-green-600">{revenue.netAmount?.toLocaleString()} ج.م</TableCell>
                            <TableCell>{revenue.customerName || '-'}</TableCell>
                            <TableCell>
                              <Badge className={getStatusBadge(revenue.paymentStatus)}>
                                {revenue.paymentStatus}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button size="sm" variant="ghost" onClick={() => handleView(revenue)}>
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => handleEdit(revenue)}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => handleDelete(revenue.id)}>
                                  <Trash2 className="w-4 h-4 text-red-600" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* أفضل العملاء */}
        {topCustomers && topCustomers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                أفضل العملاء
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topCustomers.map((customer, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold">{customer.customerName || 'غير محدد'}</p>
                      <p className="text-sm text-gray-500">{customer.count} معاملة</p>
                    </div>
                    <div className="text-lg font-bold text-green-600">
                      {parseFloat(customer.total || 0).toLocaleString()} ج.م
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* مودال الإضافة/التعديل */}
      <Dialog open={dialogOpen && !viewMode} onOpenChange={() => resetForm()}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editMode ? "تعديل إيراد" : "إضافة إيراد جديد"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>تاريخ الإيراد *</Label>
                <Input
                  type="date"
                  value={formData.revenueDate}
                  onChange={(e) => handleInputChange('revenueDate', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>المصدر *</Label>
                <Select value={formData.source} onValueChange={(value) => handleInputChange('source', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المصدر" />
                  </SelectTrigger>
                  <SelectContent>
                    {sources.map(src => (
                      <SelectItem key={src} value={src}>{src}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>المبلغ *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>الضريبة</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.taxAmount}
                  onChange={(e) => handleInputChange('taxAmount', e.target.value)}
                />
              </div>
              <div>
                <Label>الخصم</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.discountAmount}
                  onChange={(e) => handleInputChange('discountAmount', e.target.value)}
                />
              </div>
              <div>
                <Label>طريقة الدفع</Label>
                <Select value={formData.paymentMethod} onValueChange={(value) => handleInputChange('paymentMethod', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="نقدي">نقدي</SelectItem>
                    <SelectItem value="شيك">شيك</SelectItem>
                    <SelectItem value="تحويل بنكي">تحويل بنكي</SelectItem>
                    <SelectItem value="بطاقة ائتمان">بطاقة ائتمان</SelectItem>
                    <SelectItem value="آجل">آجل</SelectItem>
                    <SelectItem value="أخرى">أخرى</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>اسم العميل</Label>
                <Input
                  value={formData.customerName}
                  onChange={(e) => handleInputChange('customerName', e.target.value)}
                />
              </div>
              <div>
                <Label>رقم الايصال</Label>
                <Input
                  value={formData.invoiceNumber}
                  onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <Label>الوصف</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={resetForm}>
                إلغاء
              </Button>
              <Button type="submit" disabled={isCreating || isUpdating}>
                <Save className="w-4 h-4 ml-2" />
                {editMode ? "تحديث" : "حفظ"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* مودال العرض */}
      <Dialog open={viewMode} onOpenChange={() => resetForm()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>تفاصيل الإيراد</DialogTitle>
          </DialogHeader>
          {selectedRevenue && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-600">رقم الإيراد</Label>
                  <p className="font-semibold">{selectedRevenue.revenueNumber}</p>
                </div>
                <div>
                  <Label className="text-gray-600">التاريخ</Label>
                  <p className="font-semibold">{new Date(selectedRevenue.revenueDate).toLocaleDateString('ar-EG')}</p>
                </div>
                <div>
                  <Label className="text-gray-600">المصدر</Label>
                  <p className="font-semibold">{selectedRevenue.source}</p>
                </div>
                <div>
                  <Label className="text-gray-600">صافي المبلغ</Label>
                  <p className="font-semibold text-green-600">{selectedRevenue.netAmount?.toLocaleString()} ج.م</p>
                </div>
                <div>
                  <Label className="text-gray-600">العميل</Label>
                  <p className="font-semibold">{selectedRevenue.customerName || '-'}</p>
                </div>
                <div>
                  <Label className="text-gray-600">حالة الدفع</Label>
                  <Badge className={getStatusBadge(selectedRevenue.paymentStatus)}>
                    {selectedRevenue.paymentStatus}
                  </Badge>
                </div>
                {selectedRevenue.description && (
                  <div className="col-span-2">
                    <Label className="text-gray-600">الوصف</Label>
                    <p className="mt-1">{selectedRevenue.description}</p>
                  </div>
                )}
              </div>
              <Button variant="outline" onClick={() => resetForm()} className="w-full">
                إغلاق
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RevenueManagement;

