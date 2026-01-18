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
  Plus, Save, Trash2, Edit, Eye, CheckCircle, XCircle, Clock,
  DollarSign, TrendingUp, TrendingDown, Calendar, Filter,
  Download, Upload, FileText, BarChart3, PieChart, Search
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  useGetExpensesQuery,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
  useApproveExpenseMutation,
  useRejectExpenseMutation,
  useGetExpenseStatisticsQuery,
} from "@/store/expensesApi";

const ExpenseManagement = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    paymentStatus: "all",
    approvalStatus: "all",
    startDate: "",
    endDate: ""
  });

  const [formData, setFormData] = useState({
    expenseDate: new Date().toISOString().split('T')[0],
    category: "",
    subCategory: "",
    amount: "",
    paymentMethod: "نقدي",
    paymentStatus: "معلق",
    description: "",
    vendor: "",
    invoiceNumber: "",
    receiptNumber: "",
    taxAmount: "",
    notes: ""
  });

  const { data: expensesData, isLoading, refetch } = useGetExpensesQuery({
    search: filters.search,
    category: filters.category !== "all" ? filters.category : undefined,
    paymentStatus: filters.paymentStatus !== "all" ? filters.paymentStatus : undefined,
    approvalStatus: filters.approvalStatus !== "all" ? filters.approvalStatus : undefined,
    startDate: filters.startDate,
    endDate: filters.endDate,
    page: 1,
    limit: 100
  }, {
    skip: !localStorage.getItem("authToken")
  });

  const { data: statsData } = useGetExpenseStatisticsQuery({
    startDate: filters.startDate,
    endDate: filters.endDate
  }, {
    skip: !localStorage.getItem("authToken")
  });

  const [createExpense, { isLoading: isCreating }] = useCreateExpenseMutation();
  const [updateExpense, { isLoading: isUpdating }] = useUpdateExpenseMutation();
  const [deleteExpense] = useDeleteExpenseMutation();
  const [approveExpense] = useApproveExpenseMutation();
  const [rejectExpense] = useRejectExpenseMutation();

  const expenses = expensesData?.data?.expenses || [];
  const stats = statsData?.data || {};

  const categories = [
    'رواتب', 'إيجار', 'مرافق', 'صيانة', 'تسويق', 'مشتريات',
    'نقل وشحن', 'ضرائب ورسوم', 'تأمينات', 'قرطاسية',
    'اتصالات', 'ضيافة', 'تدريب', 'أخرى'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      expenseDate: new Date().toISOString().split('T')[0],
      category: "",
      subCategory: "",
      amount: "",
      paymentMethod: "نقدي",
      paymentStatus: "معلق",
      description: "",
      vendor: "",
      invoiceNumber: "",
      receiptNumber: "",
      taxAmount: "",
      notes: ""
    });
    setEditMode(false);
    setSelectedExpense(null);
    setDialogOpen(false);
    setViewMode(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category || !formData.amount) {
      toast({
        title: "خطأ",
        description: "يجب إدخال الفئة والمبلغ",
        variant: "destructive"
      });
      return;
    }

    try {
      const expenseData = {
        ...formData,
        amount: parseFloat(formData.amount),
        taxAmount: parseFloat(formData.taxAmount) || 0,
      };

      if (editMode && selectedExpense) {
        await updateExpense({ id: selectedExpense.id, data: expenseData }).unwrap();
        toast({
          title: "تم التحديث",
          description: "تم تحديث المصروف بنجاح"
        });
      } else {
        await createExpense(expenseData).unwrap();
        toast({
          title: "تم الحفظ",
          description: "تم إنشاء المصروف بنجاح"
        });
      }

      resetForm();
      refetch();
    } catch (error) {
      toast({
        title: "خطأ",
        description: error?.data?.message || "حدث خطأ أثناء حفظ المصروف",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (expense) => {
    setFormData({
      expenseDate: expense.expenseDate || new Date().toISOString().split('T')[0],
      category: expense.category || "",
      subCategory: expense.subCategory || "",
      amount: expense.amount?.toString() || "",
      paymentMethod: expense.paymentMethod || "نقدي",
      paymentStatus: expense.paymentStatus || "معلق",
      description: expense.description || "",
      vendor: expense.vendor || "",
      invoiceNumber: expense.invoiceNumber || "",
      receiptNumber: expense.receiptNumber || "",
      taxAmount: expense.taxAmount?.toString() || "",
      notes: expense.notes || ""
    });
    setSelectedExpense(expense);
    setEditMode(true);
    setDialogOpen(true);
  };

  const handleView = (expense) => {
    setSelectedExpense(expense);
    setViewMode(true);
    setDialogOpen(true);
  };

  const handleDelete = async (expenseId) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المصروف؟")) {
      try {
        await deleteExpense(expenseId).unwrap();
        toast({
          title: "تم الحذف",
          description: "تم حذف المصروف بنجاح"
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

  const handleApprove = async (expenseId) => {
    try {
      await approveExpense(expenseId).unwrap();
      toast({
        title: "تم الموافقة",
        description: "تم الموافقة على المصروف بنجاح"
      });
      refetch();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء الموافقة",
        variant: "destructive"
      });
    }
  };

  const handleReject = async (expenseId) => {
    try {
      await rejectExpense(expenseId).unwrap();
      toast({
        title: "تم الرفض",
        description: "تم رفض المصروف"
      });
      refetch();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء الرفض",
        variant: "destructive"
      });
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

  const getApprovalBadge = (status) => {
    const statusColors = {
      'موافق عليه': 'bg-green-100 text-green-800',
      'معلق': 'bg-yellow-100 text-yellow-800',
      'مرفوض': 'bg-red-100 text-red-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredExpenses = expenses.filter(expense => {
    if (activeTab === "all") return true;
    if (activeTab === "pending") return expense.approvalStatus === "معلق";
    if (activeTab === "approved") return expense.approvalStatus === "موافق عليه";
    if (activeTab === "paid") return expense.paymentStatus === "مدفوع";
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                إجمالي المصروفات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {(stats.totalAmount || 0).toLocaleString()} ج.م
              </div>
              <p className="text-sm text-gray-500 mt-1">{stats.totalExpenses || 0} مصروف</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                معلقة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">
                {expenses.filter(e => e.paymentStatus === "معلق").length}
              </div>
              <p className="text-sm text-gray-500 mt-1">تحتاج دفع</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                مدفوعة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {expenses.filter(e => e.paymentStatus === "مدفوع").length}
              </div>
              <p className="text-sm text-gray-500 mt-1">مصروفات مكتملة</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                تحتاج موافقة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {expenses.filter(e => e.approvalStatus === "معلق").length}
              </div>
              <p className="text-sm text-gray-500 mt-1">للمراجعة</p>
            </CardContent>
          </Card>
        </div>

        {/* الفلاتر */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              تصفية المصروفات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>بحث</Label>
                <div className="relative">
                  <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="رقم المصروف، المورد..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="pr-10"
                  />
                </div>
              </div>
              <div>
                <Label>الفئة</Label>
                <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="جميع الفئات" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الفئات</SelectItem>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
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
                <Button 
                  onClick={refetch}
                  className="w-full"
                  variant="outline"
                >
                  تطبيق الفلتر
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* قائمة المصروفات */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>إدارة المصروفات</CardTitle>
              <Button onClick={() => {
                resetForm();
                setDialogOpen(true);
              }}>
                <Plus className="w-4 h-4 ml-2" />
                إضافة مصروف
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">الكل ({expenses.length})</TabsTrigger>
                <TabsTrigger value="pending">معلقة ({expenses.filter(e => e.approvalStatus === "معلق").length})</TabsTrigger>
                <TabsTrigger value="approved">موافق عليها ({expenses.filter(e => e.approvalStatus === "موافق عليه").length})</TabsTrigger>
                <TabsTrigger value="paid">مدفوعة ({expenses.filter(e => e.paymentStatus === "مدفوع").length})</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-6">
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">جاري التحميل...</p>
                  </div>
                ) : filteredExpenses.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">لا توجد مصروفات</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>رقم المصروف</TableHead>
                          <TableHead>التاريخ</TableHead>
                          <TableHead>الفئة</TableHead>
                          <TableHead>المبلغ</TableHead>
                          <TableHead>المورد</TableHead>
                          <TableHead>حالة الدفع</TableHead>
                          <TableHead>حالة الموافقة</TableHead>
                          <TableHead>الإجراءات</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredExpenses.map((expense) => (
                          <TableRow key={expense.id}>
                            <TableCell className="font-medium">{expense.expenseNumber}</TableCell>
                            <TableCell>{new Date(expense.expenseDate).toLocaleDateString('ar-EG')}</TableCell>
                            <TableCell>{expense.category}</TableCell>
                            <TableCell className="font-semibold">{expense.totalAmount?.toLocaleString()} ج.م</TableCell>
                            <TableCell>{expense.vendor || '-'}</TableCell>
                            <TableCell>
                              <Badge className={getStatusBadge(expense.paymentStatus)}>
                                {expense.paymentStatus}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={getApprovalBadge(expense.approvalStatus)}>
                                {expense.approvalStatus}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button size="sm" variant="ghost" onClick={() => handleView(expense)}>
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => handleEdit(expense)}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                                {expense.approvalStatus === "معلق" && (
                                  <>
                                    <Button size="sm" variant="ghost" onClick={() => handleApprove(expense.id)}>
                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                    </Button>
                                    <Button size="sm" variant="ghost" onClick={() => handleReject(expense.id)}>
                                      <XCircle className="w-4 h-4 text-red-600" />
                                    </Button>
                                  </>
                                )}
                                <Button size="sm" variant="ghost" onClick={() => handleDelete(expense.id)}>
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
      </div>

      {/* مودال الإضافة/التعديل */}
      <Dialog open={dialogOpen && !viewMode} onOpenChange={() => resetForm()}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editMode ? "تعديل مصروف" : "إضافة مصروف جديد"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>تاريخ المصروف *</Label>
                <Input
                  type="date"
                  value={formData.expenseDate}
                  onChange={(e) => handleInputChange('expenseDate', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>الفئة *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الفئة" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
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
                    <SelectItem value="أخرى">أخرى</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>حالة الدفع</Label>
                <Select value={formData.paymentStatus} onValueChange={(value) => handleInputChange('paymentStatus', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="مدفوع">مدفوع</SelectItem>
                    <SelectItem value="معلق">معلق</SelectItem>
                    <SelectItem value="مؤجل">مؤجل</SelectItem>
                    <SelectItem value="ملغي">ملغي</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>المورد</Label>
                <Input
                  value={formData.vendor}
                  onChange={(e) => handleInputChange('vendor', e.target.value)}
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
            <DialogTitle>تفاصيل المصروف</DialogTitle>
          </DialogHeader>
          {selectedExpense && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-600">رقم المصروف</Label>
                  <p className="font-semibold">{selectedExpense.expenseNumber}</p>
                </div>
                <div>
                  <Label className="text-gray-600">التاريخ</Label>
                  <p className="font-semibold">{new Date(selectedExpense.expenseDate).toLocaleDateString('ar-EG')}</p>
                </div>
                <div>
                  <Label className="text-gray-600">الفئة</Label>
                  <p className="font-semibold">{selectedExpense.category}</p>
                </div>
                <div>
                  <Label className="text-gray-600">المبلغ</Label>
                  <p className="font-semibold text-red-600">{selectedExpense.totalAmount?.toLocaleString()} ج.م</p>
                </div>
                <div>
                  <Label className="text-gray-600">المورد</Label>
                  <p className="font-semibold">{selectedExpense.vendor || '-'}</p>
                </div>
                <div>
                  <Label className="text-gray-600">طريقة الدفع</Label>
                  <p className="font-semibold">{selectedExpense.paymentMethod}</p>
                </div>
                <div>
                  <Label className="text-gray-600">حالة الدفع</Label>
                  <Badge className={getStatusBadge(selectedExpense.paymentStatus)}>
                    {selectedExpense.paymentStatus}
                  </Badge>
                </div>
                <div>
                  <Label className="text-gray-600">حالة الموافقة</Label>
                  <Badge className={getApprovalBadge(selectedExpense.approvalStatus)}>
                    {selectedExpense.approvalStatus}
                  </Badge>
                </div>
                {selectedExpense.description && (
                  <div className="col-span-2">
                    <Label className="text-gray-600">الوصف</Label>
                    <p className="mt-1">{selectedExpense.description}</p>
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

export default ExpenseManagement;

