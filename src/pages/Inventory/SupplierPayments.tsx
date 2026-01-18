import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Search, 
  Plus, 
  CreditCard,
  DollarSign,
  Calendar,
  FileText,
  TrendingUp,
  Calculator,
  Activity,
  MoreVertical,
  Filter,
  Eye,
  Edit,
  Download,
  Clock,
  AlertTriangle,
  CheckCircle,
  Wallet,
  Receipt,
  Building,
  Target,
  ArrowUpDown,
  Zap,
  X,
  Loader2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  useGetSupplierPaymentsQuery, 
  useCreateSupplierPaymentMutation, 
  useUpdateSupplierPaymentMutation, 
  useDeleteSupplierPaymentMutation,
  type SupplierPayment,
  type CreateSupplierPaymentRequest,
  type UpdateSupplierPaymentRequest
} from "@/store/supplierPaymentsApi";
import { useGetSuppliersQuery, type Supplier } from "@/store/suppliersApi";
import { useGetSupplierInvoicesQuery, type SupplierInvoice } from "@/store/supplierInvoicesApi";

// Enhanced Types with additional fields
interface LocalSupplierPayment {
  id: string;
  supplierName: string;
  supplierId: string;
  invoiceId?: string;
  invoiceNumber: string;
  totalAmount: number;
  paidAmount: number;
  paymentDate: string;
  dueDate?: string;
  paymentMethod: string;
  transferNumber?: string;
  attachments: string[];
  notes: string;
  status: "مدفوع" | "جزئي" | "معلق" | "متأخر";
  priority: "عادي" | "عالي" | "عاجل";
  currency: string;
  exchangeRate?: number;
  bankAccount?: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

const SupplierPayments = () => {
  const { toast } = useToast();

  // API hooks
  const { data: paymentsData, isLoading: isLoadingPayments, error: paymentsError } = useGetSupplierPaymentsQuery({});
  const { data: suppliersData, isLoading: isLoadingSuppliers } = useGetSuppliersQuery({});
  const [createPayment, { isLoading: isCreating }] = useCreateSupplierPaymentMutation();
  const [updatePayment, { isLoading: isUpdating }] = useUpdateSupplierPaymentMutation();
  const [deletePayment, { isLoading: isDeleting }] = useDeleteSupplierPaymentMutation();

  // Local state
  const [payments, setPayments] = useState<LocalSupplierPayment[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const [newPayment, setNewPayment] = useState<Partial<LocalSupplierPayment>>({});
  const { data: invoicesData, isLoading: isLoadingInvoices } = useGetSupplierInvoicesQuery({ supplier_id: newPayment.supplierId ? parseInt(newPayment.supplierId) : undefined });
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [sortBy, setSortBy] = useState("paymentDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedPayment, setSelectedPayment] = useState<LocalSupplierPayment | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);

  // Functions
  const addPayment = async () => {
    if (!newPayment.supplierName || !newPayment.invoiceNumber || !newPayment.paidAmount || !newPayment.paymentDate) {
      toast({
        title: "خطأ في التسجيل",
        description: "يرجى تعبئة جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    try {
      const paymentData: CreateSupplierPaymentRequest = {
        supplier_id: parseInt(newPayment.supplierId || "1"),
        paymentAmount: newPayment.paidAmount || 0,
        paymentDate: newPayment.paymentDate || "",
        dueDate: newPayment.dueDate,
        paymentMethod: newPayment.paymentMethod || "تحويل بنكي",
        transferNumber: newPayment.transferNumber,
        bankAccount: newPayment.bankAccount,
        notes: newPayment.notes,
        status: newPayment.status || "مدفوع",
        priority: newPayment.priority || "عادي",
        currency: newPayment.currency || "SAR",
        exchangeRate: newPayment.exchangeRate,
        isRecurring: false,
      };

      await createPayment(paymentData).unwrap();
      
      setNewPayment({});
      setShowAddForm(false);
      
      toast({
        title: "تم التسجيل بنجاح",
        description: "تم تسجيل الدفعة الجديدة",
      });
    } catch (error) {
      toast({
        title: "خطأ في التسجيل",
        description: "فشل في تسجيل الدفعة",
        variant: "destructive",
      });
    }
  };

  // Enhanced status color function
  const getStatusColor = (status: string) => {
    switch (status) {
      case "مدفوع":
        return "bg-success/10 text-success border-success/20";
      case "جزئي":
        return "bg-warning/10 text-warning border-warning/20";
      case "معلق":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "متأخر":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "عاجل":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      case "عالي":
        return "bg-orange-500/10 text-orange-600 border-orange-500/20";
      case "عادي":
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  // Edit Payment Function
  const editPayment = (payment: LocalSupplierPayment) => {
    setSelectedPayment(payment);
    setNewPayment({...payment});
    setShowEditForm(true);
  };

  // Update Payment Function
  const handleUpdatePayment = async () => {
    if (!selectedPayment || !newPayment.supplierName || !newPayment.invoiceNumber || !newPayment.paidAmount || !newPayment.paymentDate) {
      toast({
        title: "خطأ في التحديث",
        description: "يرجى تعبئة جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    try {
      const updateData: UpdateSupplierPaymentRequest = {
        id: selectedPayment.id,
        supplier_id: parseInt(newPayment.supplierId || "1"),
        paymentAmount: newPayment.paidAmount || 0,
        paymentDate: newPayment.paymentDate || "",
        dueDate: newPayment.dueDate,
        paymentMethod: newPayment.paymentMethod || "تحويل بنكي",
        transferNumber: newPayment.transferNumber,
        bankAccount: newPayment.bankAccount,
        notes: newPayment.notes,
        status: newPayment.status || "مدفوع",
        priority: newPayment.priority || "عادي",
        currency: newPayment.currency || "SAR",
        exchangeRate: newPayment.exchangeRate,
      };

      await updatePayment(updateData).unwrap();

      setNewPayment({});
      setSelectedPayment(null);
      setShowEditForm(false);
      
      toast({
        title: "تم التحديث بنجاح",
        description: "تم تحديث بيانات الدفعة",
      });
    } catch (error) {
      toast({
        title: "خطأ في التحديث",
        description: "فشل في تحديث الدفعة",
        variant: "destructive",
      });
    }
  };

  // View Payment Details Function
  const viewPayment = (payment: LocalSupplierPayment) => {
    setSelectedPayment(payment);
    setShowViewDialog(true);
  };

  // Delete Payment Function
  const handleDeletePayment = async (paymentId: string) => {
    try {
      await deletePayment(paymentId).unwrap();
      toast({
        title: "تم الحذف بنجاح",
        description: "تم حذف الدفعة من النظام",
      });
    } catch (error) {
      toast({
        title: "خطأ في الحذف",
        description: "فشل في حذف الدفعة",
        variant: "destructive",
      });
    }
  };

  // Cancel Edit Function
  const cancelEdit = () => {
    setNewPayment({});
    setSelectedPayment(null);
    setShowEditForm(false);
  };

  // Enhanced filtering and sorting
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || payment.status === filterStatus;
    const matchesPriority = filterPriority === "all" || payment.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  }).sort((a, b) => {
    const aValue = a[sortBy as keyof LocalSupplierPayment];
    const bValue = b[sortBy as keyof LocalSupplierPayment];
    
    if (sortOrder === "asc") {
      return (aValue as any) > (bValue as any) ? 1 : -1;
    } else {
      return (aValue as any) < (bValue as any) ? 1 : -1;
    }
  });

  // Load data from API
  useEffect(() => {
    if (paymentsData?.data) {
      // Convert API data to local format
      const convertedPayments = paymentsData.data.map((apiPayment: SupplierPayment) => ({
        id: apiPayment.id,
        supplierName: apiPayment.supplierName || `المورد ${apiPayment.supplier_id}`,
        supplierId: apiPayment.supplier_id.toString(),
        invoiceNumber: apiPayment.invoiceNumber || `INV-${apiPayment.id}`,
        totalAmount: apiPayment.paymentAmount,
        paidAmount: apiPayment.paymentAmount,
        paymentDate: apiPayment.paymentDate,
        dueDate: apiPayment.dueDate,
        paymentMethod: apiPayment.paymentMethod,
        transferNumber: apiPayment.transferNumber,
        attachments: apiPayment.attachments || [],
        notes: apiPayment.notes || "",
        status: apiPayment.status,
        priority: apiPayment.priority,
        currency: apiPayment.currency,
        exchangeRate: apiPayment.exchangeRate,
        bankAccount: apiPayment.bankAccount,
        approvedBy: apiPayment.approvedBy,
        createdAt: apiPayment.createdAt,
        updatedAt: apiPayment.updatedAt
      }));
      setPayments(convertedPayments);
    } else {
      // No data available
      setPayments([]);
    }
  }, [paymentsData]);

  useEffect(() => {
    if (suppliersData?.data) {
      setSuppliers(suppliersData.data);
    }
  }, [suppliersData]);

  // Enhanced statistics with more metrics
  const totalPaid = payments.reduce((acc, payment) => acc + payment.paidAmount, 0);
  const totalDue = payments.reduce((acc, payment) => acc + (payment.totalAmount - payment.paidAmount), 0);
  const pendingPayments = payments.filter(p => p.status === "معلق").length;
  const overduePayments = payments.filter(p => p.status === "متأخر").length;
  const totalInvoices = payments.reduce((acc, payment) => acc + payment.totalAmount, 0);
  const avgPaymentAmount = payments.length > 0 ? totalPaid / payments.length : 0;

  // Show empty state when no data
  if (payments.length === 0 && !isLoadingPayments) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
        <div className="space-y-8 p-6">
          {/* Header */}
          <div className="relative overflow-hidden bg-gradient-to-r from-white/95 via-emerald-50/80 to-teal-50/70 p-8 rounded-3xl border border-white/60 shadow-2xl backdrop-blur-md">
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                  <div className="relative p-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 rounded-2xl shadow-xl transform hover:scale-105 transition-transform duration-300">
                    <Wallet className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-emerald-800 to-teal-800 bg-clip-text text-transparent mb-2">
                    مدفوعات الموردين
                  </h1>
                  <p className="text-lg text-gray-600 font-medium">
                    إدارة متقدمة وتتبع شامل لمدفوعات الموردين والإيصالات المالية
                  </p>
                </div>
              </div>
              
              {/* Add Payment Button */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-500 to-green-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-500 animate-pulse"></div>
                <Button 
                  onClick={() => setShowAddForm(true)}
                  size="lg"
                  className="relative gap-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 hover:from-emerald-600 hover:via-teal-600 hover:to-green-700 text-white font-bold py-4 px-8 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-0"
                >
                  <div className="relative">
                    <Plus className="w-6 h-6" />
                    <div className="absolute inset-0 bg-white/20 rounded-full animate-ping"></div>
                  </div>
                  <span className="text-lg">تسجيل دفعة جديدة</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Empty State */}
          <div className="flex items-center justify-center py-20">
            <div className="text-center max-w-md">
              <div className="relative mx-auto w-24 h-24 mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-200 to-teal-200 rounded-full blur-xl opacity-50"></div>
                <div className="relative w-24 h-24 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full flex items-center justify-center">
                  <Receipt className="w-12 h-12 text-emerald-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">لا توجد مدفوعات بعد</h3>
              <p className="text-gray-600 mb-6">
                ابدأ بإضافة أول دفعة للموردين لتنظيم وإدارة المدفوعات المالية
              </p>
              <Button 
                onClick={() => setShowAddForm(true)}
                size="lg"
                className="gap-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
              >
                <Plus className="w-5 h-5" />
                إضافة أول دفعة
              </Button>
            </div>
          </div>

          {/* Add Form */}
          {showAddForm && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>تسجيل دفعة جديدة</CardTitle>
                <CardDescription>تسجيل دفعة للموردين</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="supplierName">اسم المورد *</Label>
                    <Select 
                      value={newPayment.supplierId || ""} 
                      onValueChange={(value) => {
                        const supplier = suppliers.find(s => s.supplier_id.toString() === value);
                        setNewPayment(prev => ({ 
                          ...prev, 
                          supplierId: value,
                          supplierName: supplier?.name_ar || ""
                        }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المورد" />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers.map((supplier) => (
                          <SelectItem key={supplier.supplier_id} value={supplier.supplier_id.toString()}>
                            {supplier.name_ar}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="invoiceNumber">رقم الايصال *</Label>
                    <Select 
                      value={newPayment.invoiceId || ""}
                      onValueChange={(value) => {
                        const inv = invoicesData?.data?.find((i: SupplierInvoice) => i.id.toString() === value);
                        setNewPayment(prev => ({
                          ...prev,
                          invoiceId: value,
                          invoiceNumber: inv?.invoiceNumber || ""
                        }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingInvoices ? "...جاري التحميل" : "اختر الايصال"} />
                      </SelectTrigger>
                      <SelectContent>
                        {(invoicesData?.data || []).map((inv: SupplierInvoice) => (
                          <SelectItem key={inv.id} value={inv.id.toString()}>
                            {inv.invoiceNumber} - {new Date(inv.invoiceDate).toLocaleDateString('ar-SA')} - المتبقي: {inv.remainingAmount.toLocaleString()} جنيه مصري
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="totalAmount">إجمالي الايصال</Label>
                    <Input
                      id="totalAmount"
                      type="number"
                      value={newPayment.totalAmount || ""}
                      onChange={(e) => setNewPayment(prev => ({ ...prev, totalAmount: Number(e.target.value) }))}
                      placeholder="0"
                      disabled
                    />
                    <p className="text-xs text-gray-500 mt-1">سيتم حسابها تلقائياً من المبلغ المدفوع</p>
                  </div>

                  <div>
                    <Label htmlFor="paidAmount">المبلغ المدفوع *</Label>
                    <Input
                      id="paidAmount"
                      type="number"
                      value={newPayment.paidAmount || ""}
                      onChange={(e) => {
                        const amount = Number(e.target.value);
                        setNewPayment(prev => ({ 
                          ...prev, 
                          paidAmount: amount,
                          totalAmount: amount
                        }));
                      }}
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <Label htmlFor="paymentDate">تاريخ الدفع *</Label>
                    <Input
                      id="paymentDate"
                      type="date"
                      value={newPayment.paymentDate || ""}
                      onChange={(e) => setNewPayment(prev => ({ ...prev, paymentDate: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="paymentMethod">طريقة الدفع</Label>
                    <Select value={newPayment.paymentMethod || ""} onValueChange={(value) => setNewPayment(prev => ({ ...prev, paymentMethod: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر طريقة الدفع" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="تحويل بنكي">تحويل بنكي</SelectItem>
                        <SelectItem value="شيك">شيك</SelectItem>
                        <SelectItem value="نقد">نقد</SelectItem>
                        <SelectItem value="بطاقة ائتمان">بطاقة ائتمان</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="transferNumber">رقم التحويل/الشيك</Label>
                    <Input
                      id="transferNumber"
                      value={newPayment.transferNumber || ""}
                      onChange={(e) => setNewPayment(prev => ({ ...prev, transferNumber: e.target.value }))}
                      placeholder="رقم المرجع"
                    />
                  </div>

                  <div>
                    <Label htmlFor="status">حالة الدفع</Label>
                    <Select value={newPayment.status || ""} onValueChange={(value) => setNewPayment(prev => ({ ...prev, status: value as "مدفوع" | "جزئي" | "معلق" }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الحالة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="مدفوع">مدفوع</SelectItem>
                        <SelectItem value="جزئي">جزئي</SelectItem>
                        <SelectItem value="معلق">معلق</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2 lg:col-span-3">
                    <Label htmlFor="notes">ملاحظات</Label>
                    <Textarea
                      id="notes"
                      value={newPayment.notes || ""}
                      onChange={(e) => setNewPayment(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="ملاحظات إضافية..."
                      rows={2}
                    />
                  </div>
                </div>

                <div className="flex gap-2 mt-6">
                  <Button onClick={addPayment} disabled={isCreating}>
                    {isCreating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        جاري الحفظ...
                      </>
                    ) : (
                      "حفظ الدفعة"
                    )}
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddForm(false)} disabled={isCreating}>
                    إلغاء
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoadingPayments) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-emerald-600" />
          <p className="text-lg text-gray-600">جاري تحميل بيانات المدفوعات...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (paymentsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-600" />
          <p className="text-lg text-red-600">حدث خطأ في تحميل البيانات</p>
          <p className="text-sm text-gray-600 mt-2">يرجى المحاولة مرة أخرى</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="space-y-8 p-6">
        {/* Enhanced Header with Modern Design */}
        <div className="relative overflow-hidden bg-gradient-to-r from-white/95 via-emerald-50/80 to-teal-50/70 p-8 rounded-3xl border border-white/60 shadow-2xl backdrop-blur-md">
          {/* Background decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-200/20 via-teal-200/10 to-transparent rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-200/20 via-blue-200/10 to-transparent rounded-full blur-xl"></div>
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                <div className="relative p-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 rounded-2xl shadow-xl transform hover:scale-105 transition-transform duration-300">
                  <Wallet className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-emerald-800 to-teal-800 bg-clip-text text-transparent mb-2">
                  مدفوعات الموردين
                </h1>
                <p className="text-lg text-gray-600 font-medium">
                  إدارة متقدمة وتتبع شامل لمدفوعات الموردين والإيصالات المالية
                </p>
              </div>
            </div>
            
            {/* Enhanced Add Payment Button */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="lg"
                className="gap-2 bg-white/80 backdrop-blur-sm border-2 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300"
              >
                <Download className="w-5 h-5 text-emerald-600" />
                تصدير التقرير
              </Button>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-500 to-green-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-500 animate-pulse"></div>
                <Button 
                  onClick={() => setShowAddForm(!showAddForm)}
                  size="lg"
                  className="relative gap-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 hover:from-emerald-600 hover:via-teal-600 hover:to-green-700 text-white font-bold py-4 px-8 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-0"
                >
                  <div className="relative">
                    <Plus className="w-6 h-6" />
                    <div className="absolute inset-0 bg-white/20 rounded-full animate-ping"></div>
                  </div>
                  <span className="text-lg">تسجيل دفعة جديدة</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Statistics Cards with Better Design */}
        {payments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <Card className="relative overflow-hidden bg-gradient-to-br from-white/90 to-emerald-50/80 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardContent className="pt-6 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">إجمالي المدفوع</p>
                  <p className="text-2xl font-bold text-emerald-700 group-hover:scale-105 transition-transform duration-300">{totalPaid.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="text-sm text-gray-600 font-medium">جنيه مصري مدفوع بالكامل</div>
            </CardContent>
          </Card>
          
          <Card className="relative overflow-hidden bg-gradient-to-br from-white/90 to-red-50/80 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardContent className="pt-6 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">المبلغ المستحق</p>
                  <p className="text-2xl font-bold text-red-700 group-hover:scale-105 transition-transform duration-300">{totalDue.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="text-sm text-gray-600 font-medium">جنيه مصري متبقي للدفع</div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-white/90 to-blue-50/80 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardContent className="pt-6 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">معلقة</p>
                  <p className="text-2xl font-bold text-blue-700 group-hover:scale-105 transition-transform duration-300">{pendingPayments}</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Clock className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="text-sm text-gray-600 font-medium">ايصال معلقة</div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-white/90 to-purple-50/80 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardContent className="pt-6 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">متأخرة</p>
                  <p className="text-2xl font-bold text-purple-700 group-hover:scale-105 transition-transform duration-300">{overduePayments}</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Activity className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="text-sm text-gray-600 font-medium">ايصال متأخرة</div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-white/90 to-yellow-50/80 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 via-orange-500/5 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardContent className="pt-6 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">إجمالي الإيصالات</p>
                  <p className="text-2xl font-bold text-yellow-700 group-hover:scale-105 transition-transform duration-300">{totalInvoices.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Receipt className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="text-sm text-gray-600 font-medium">جنيه مصري قيمة إجمالية</div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-white/90 to-cyan-50/80 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardContent className="pt-6 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">متوسط الدفع</p>
                  <p className="text-2xl font-bold text-cyan-700 group-hover:scale-105 transition-transform duration-300">{avgPaymentAmount.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Target className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="text-sm text-gray-600 font-medium">جنيه مصري متوسط دفع</div>
            </CardContent>
          </Card>
        </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">لا توجد بيانات لعرض الإحصائيات</p>
          </div>
        )}

      {/* نموذج تسجيل دفعة جديدة */}
      {showAddForm && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>تسجيل دفعة جديدة</CardTitle>
            <CardDescription>تسجيل دفعة للموردين</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="supplierName">اسم المورد *</Label>
                <Select 
                  value={newPayment.supplierId || ""} 
                  onValueChange={(value) => {
                    const supplier = suppliers.find(s => s.supplier_id.toString() === value);
                    setNewPayment(prev => ({ 
                      ...prev, 
                      supplierId: value,
                      supplierName: supplier?.name_ar || ""
                    }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المورد" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier.supplier_id} value={supplier.supplier_id.toString()}>
                        {supplier.name_ar}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="invoiceNumber">رقم الايصال *</Label>
                <Input
                  id="invoiceNumber"
                  value={newPayment.invoiceNumber || ""}
                  onChange={(e) => setNewPayment(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                  placeholder="INV-2024-001"
                />
              </div>

              <div>
                <Label htmlFor="totalAmount">إجمالي الايصال</Label>
                <Input
                  id="totalAmount"
                  type="number"
                  value={newPayment.totalAmount || ""}
                  onChange={(e) => setNewPayment(prev => ({ ...prev, totalAmount: Number(e.target.value) }))}
                  placeholder="0"
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">سيتم حسابها تلقائياً من المبلغ المدفوع</p>
              </div>

              <div>
                <Label htmlFor="paidAmount">المبلغ المدفوع *</Label>
                <Input
                  id="paidAmount"
                  type="number"
                  value={newPayment.paidAmount || ""}
                  onChange={(e) => {
                    const amount = Number(e.target.value);
                    setNewPayment(prev => ({ 
                      ...prev, 
                      paidAmount: amount,
                      totalAmount: amount // إجمالي الايصال = المبلغ المدفوع
                    }));
                  }}
                  placeholder="0"
                />
              </div>

              <div>
                <Label htmlFor="paymentDate">تاريخ الدفع *</Label>
                <Input
                  id="paymentDate"
                  type="date"
                  value={newPayment.paymentDate || ""}
                  onChange={(e) => setNewPayment(prev => ({ ...prev, paymentDate: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="paymentMethod">طريقة الدفع</Label>
                <Select value={newPayment.paymentMethod || ""} onValueChange={(value) => setNewPayment(prev => ({ ...prev, paymentMethod: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر طريقة الدفع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="تحويل بنكي">تحويل بنكي</SelectItem>
                    <SelectItem value="شيك">شيك</SelectItem>
                    <SelectItem value="نقد">نقد</SelectItem>
                    <SelectItem value="بطاقة ائتمان">بطاقة ائتمان</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="transferNumber">رقم التحويل/الشيك</Label>
                <Input
                  id="transferNumber"
                  value={newPayment.transferNumber || ""}
                  onChange={(e) => setNewPayment(prev => ({ ...prev, transferNumber: e.target.value }))}
                  placeholder="رقم المرجع"
                />
              </div>

              <div>
                <Label htmlFor="status">حالة الدفع</Label>
                <Select value={newPayment.status || ""} onValueChange={(value) => setNewPayment(prev => ({ ...prev, status: value as "مدفوع" | "جزئي" | "معلق" }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="مدفوع">مدفوع</SelectItem>
                    <SelectItem value="جزئي">جزئي</SelectItem>
                    <SelectItem value="معلق">معلق</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2 lg:col-span-3">
                <Label htmlFor="notes">ملاحظات</Label>
                <Textarea
                  id="notes"
                  value={newPayment.notes || ""}
                  onChange={(e) => setNewPayment(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="ملاحظات إضافية..."
                  rows={2}
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button onClick={addPayment} disabled={isCreating}>
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  "حفظ الدفعة"
                )}
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)} disabled={isCreating}>
                إلغاء
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

        {/* Enhanced Search and Filters */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-white/95 to-gray-50/80 backdrop-blur-md border-0 shadow-xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500"></div>
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-emerald-600 transition-colors duration-300" />
                  <Input
                    placeholder="البحث عن مورد، رقم ايصال، أو رقم دفعة..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-4 h-12 bg-gradient-to-r from-white to-gray-50/80 border-gray-200 hover:border-emerald-500 focus:border-emerald-500 transition-all duration-300 shadow-md hover:shadow-lg rounded-xl"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-48 h-12 bg-gradient-to-r from-white to-gray-50/80 border-gray-200 hover:border-emerald-500 transition-all duration-300 shadow-md hover:shadow-lg rounded-xl">
                    <Filter className="w-4 h-4 mr-2 text-gray-500" />
                    <SelectValue placeholder="حالة الدفع" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl shadow-2xl border-0 bg-white/95 backdrop-blur-md">
                    <SelectItem value="all">جميع الحالات</SelectItem>
                    <SelectItem value="مدفوع">مدفوع</SelectItem>
                    <SelectItem value="جزئي">جزئي</SelectItem>
                    <SelectItem value="معلق">معلق</SelectItem>
                    <SelectItem value="متأخر">متأخر</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger className="w-48 h-12 bg-gradient-to-r from-white to-gray-50/80 border-gray-200 hover:border-emerald-500 transition-all duration-300 shadow-md hover:shadow-lg rounded-xl">
                    <Zap className="w-4 h-4 mr-2 text-gray-500" />
                    <SelectValue placeholder="الأولوية" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl shadow-2xl border-0 bg-white/95 backdrop-blur-md">
                    <SelectItem value="all">جميع الأولويات</SelectItem>
                    <SelectItem value="عاجل">عاجل</SelectItem>
                    <SelectItem value="عالي">عالي</SelectItem>
                    <SelectItem value="عادي">عادي</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  className="h-12 px-4 bg-gradient-to-r from-white to-gray-50/80 border-gray-200 hover:border-emerald-500 transition-all duration-300 shadow-md hover:shadow-lg rounded-xl"
                >
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  ترتيب {sortOrder === "asc" ? "تصاعدي" : "تنازلي"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

      {/* جدول المدفوعات */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            سجل المدفوعات ({filteredPayments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>رقم الدفعة</TableHead>
                <TableHead>المورد</TableHead>
                <TableHead>رقم الايصال</TableHead>
                <TableHead>إجمالي الايصال</TableHead>
                <TableHead>المبلغ المدفوع</TableHead>
                <TableHead>المتبقي</TableHead>
                <TableHead>تاريخ الدفع</TableHead>
                <TableHead>طريقة الدفع</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <Receipt className="w-12 h-12 text-gray-400" />
                      <p className="text-lg font-medium text-gray-600">لا توجد مدفوعات</p>
                      <p className="text-sm text-gray-500">قم بإضافة دفعة جديدة لتبدأ</p>
                      <Button 
                        onClick={() => setShowAddForm(true)}
                        className="mt-2"
                        size="sm"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        إضافة دفعة جديدة
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.id}</TableCell>
                    <TableCell>
                      <div className="font-medium">{payment.supplierName}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {payment.invoiceNumber}
                      </div>
                    </TableCell>
                    <TableCell>{payment.totalAmount.toLocaleString()} جنيه مصري</TableCell>
                    <TableCell className="text-success font-medium">{payment.paidAmount.toLocaleString()} جنيه مصري</TableCell>
                    <TableCell className="text-destructive font-medium">
                      {(payment.totalAmount - payment.paidAmount).toLocaleString()} جنيه مصري
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {payment.paymentDate}
                      </div>
                    </TableCell>
                    <TableCell>{payment.paymentMethod}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(payment.status)}>
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                         <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => viewPayment(payment)}>
                            <Eye className="mr-2 h-4 w-4" />
                            عرض التفاصيل
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => editPayment(payment)}>
                            <Edit className="mr-2 h-4 w-4" />
                            تعديل الدفعة
                          </DropdownMenuItem>
                                                  <DropdownMenuItem 
                          onClick={() => handleDeletePayment(payment.id)}
                          className="text-red-600 hover:text-red-700"
                          disabled={isDeleting}
                        >
                            {isDeleting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                جاري الحذف...
                              </>
                            ) : (
                              <>
                                <X className="mr-2 h-4 w-4" />
                                حذف الدفعة
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            تحميل الإيصال
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

        {/* Edit Payment Form */}
        {showEditForm && selectedPayment && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="relative max-w-4xl w-full max-h-[90vh] overflow-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-100/20 via-teal-100/10 to-green-100/20 rounded-3xl blur-xl"></div>
              <Card className="relative overflow-hidden bg-gradient-to-br from-white/95 to-emerald-50/80 backdrop-blur-md border-0 shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500"></div>
                <CardHeader className="bg-gradient-to-r from-emerald-50/80 to-teal-50/60 backdrop-blur-sm p-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-emerald-500 rounded-2xl blur-md opacity-30 animate-pulse"></div>
                        <div className="relative p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl shadow-lg">
                          <Edit className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div>
                        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                          تعديل بيانات الدفعة
                        </CardTitle>
                        <CardDescription className="text-lg text-gray-600 font-medium mt-2">
                          تحديث بيانات الدفعة: {selectedPayment.id}
                        </CardDescription>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={cancelEdit}
                      className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <Label htmlFor="editSupplierName">اسم المورد *</Label>
                      <Select 
                        value={newPayment.supplierId || ""} 
                        onValueChange={(value) => {
                          const supplier = suppliers.find(s => s.supplier_id.toString() === value);
                          setNewPayment(prev => ({ 
                            ...prev, 
                            supplierId: value,
                            supplierName: supplier?.name_ar || ""
                          }));
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر المورد" />
                        </SelectTrigger>
                        <SelectContent>
                          {suppliers.map((supplier) => (
                            <SelectItem key={supplier.supplier_id} value={supplier.supplier_id.toString()}>
                              {supplier.name_ar}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="editInvoiceNumber">رقم الايصال *</Label>
                      <Input
                        id="editInvoiceNumber"
                        value={newPayment.invoiceNumber || ""}
                        onChange={(e) => setNewPayment(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                        placeholder="INV-2024-001"
                      />
                    </div>

                    <div>
                      <Label htmlFor="editTotalAmount">إجمالي الايصال</Label>
                      <Input
                        id="editTotalAmount"
                        type="number"
                        value={newPayment.totalAmount || ""}
                        onChange={(e) => setNewPayment(prev => ({ ...prev, totalAmount: Number(e.target.value) }))}
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <Label htmlFor="editPaidAmount">المبلغ المدفوع *</Label>
                      <Input
                        id="editPaidAmount"
                        type="number"
                        value={newPayment.paidAmount || ""}
                        onChange={(e) => setNewPayment(prev => ({ ...prev, paidAmount: Number(e.target.value) }))}
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <Label htmlFor="editPaymentDate">تاريخ الدفع *</Label>
                      <Input
                        id="editPaymentDate"
                        type="date"
                        value={newPayment.paymentDate || ""}
                        onChange={(e) => setNewPayment(prev => ({ ...prev, paymentDate: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="editDueDate">تاريخ الاستحقاق</Label>
                      <Input
                        id="editDueDate"
                        type="date"
                        value={newPayment.dueDate || ""}
                        onChange={(e) => setNewPayment(prev => ({ ...prev, dueDate: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="editPaymentMethod">طريقة الدفع</Label>
                      <Select 
                        value={newPayment.paymentMethod || ""} 
                        onValueChange={(value) => setNewPayment(prev => ({ ...prev, paymentMethod: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر طريقة الدفع" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="تحويل بنكي">تحويل بنكي</SelectItem>
                          <SelectItem value="شيك">شيك</SelectItem>
                          <SelectItem value="نقد">نقد</SelectItem>
                          <SelectItem value="بطاقة ائتمان">بطاقة ائتمان</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="editTransferNumber">رقم التحويل/الشيك</Label>
                      <Input
                        id="editTransferNumber"
                        value={newPayment.transferNumber || ""}
                        onChange={(e) => setNewPayment(prev => ({ ...prev, transferNumber: e.target.value }))}
                        placeholder="رقم المرجع"
                      />
                    </div>

                    <div>
                      <Label htmlFor="editStatus">حالة الدفع</Label>
                      <Select 
                        value={newPayment.status || ""} 
                        onValueChange={(value) => setNewPayment(prev => ({ ...prev, status: value as "مدفوع" | "جزئي" | "معلق" | "متأخر" }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الحالة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="مدفوع">مدفوع</SelectItem>
                          <SelectItem value="جزئي">جزئي</SelectItem>
                          <SelectItem value="معلق">معلق</SelectItem>
                          <SelectItem value="متأخر">متأخر</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="editPriority">الأولوية</Label>
                      <Select 
                        value={newPayment.priority || ""} 
                        onValueChange={(value) => setNewPayment(prev => ({ ...prev, priority: value as "عادي" | "عالي" | "عاجل" }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الأولوية" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="عادي">عادي</SelectItem>
                          <SelectItem value="عالي">عالي</SelectItem>
                          <SelectItem value="عاجل">عاجل</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="editBankAccount">الحساب البنكي</Label>
                      <Input
                        id="editBankAccount"
                        value={newPayment.bankAccount || ""}
                        onChange={(e) => setNewPayment(prev => ({ ...prev, bankAccount: e.target.value }))}
                        placeholder="رقم الحساب البنكي"
                      />
                    </div>

                    <div className="md:col-span-2 lg:col-span-3">
                      <Label htmlFor="editNotes">ملاحظات</Label>
                      <Textarea
                        id="editNotes"
                        value={newPayment.notes || ""}
                        onChange={(e) => setNewPayment(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="ملاحظات إضافية..."
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 mt-8 p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100">
                    <Button 
                      onClick={() => handleUpdatePayment()}
                      size="lg"
                      disabled={isUpdating}
                      className="flex-1 gap-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                      {isUpdating ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          جاري التحديث...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          تحديث البيانات
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={cancelEdit}
                      size="lg"
                      className="flex-1 gap-3 border-2 border-gray-300 hover:bg-gray-50 font-bold py-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                      <X className="w-5 h-5" />
                      إلغاء
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* View Payment Details Dialog */}
        {showViewDialog && selectedPayment && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="relative max-w-4xl w-full max-h-[90vh] overflow-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 via-indigo-100/10 to-purple-100/20 rounded-3xl blur-xl"></div>
              <Card className="relative overflow-hidden bg-gradient-to-br from-white/95 to-blue-50/80 backdrop-blur-md border-0 shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
                <CardHeader className="bg-gradient-to-r from-blue-50/80 to-indigo-50/60 backdrop-blur-sm p-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-md opacity-30 animate-pulse"></div>
                        <div className="relative p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                          <Eye className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div>
                        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                          تفاصيل الدفعة
                        </CardTitle>
                        <CardDescription className="text-lg text-gray-600 font-medium mt-2">
                          معلومات شاملة عن الدفعة
                        </CardDescription>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => setShowViewDialog(false)}
                      className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-600">رقم الدفعة</Label>
                      <p className="text-lg font-medium">{selectedPayment.id}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-600">المورد</Label>
                      <p className="text-lg font-medium">{selectedPayment.supplierName}</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-600">رقم الايصال</Label>
                      <p className="text-lg font-medium">{selectedPayment.invoiceNumber}</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-600">إجمالي الايصال</Label>
                      <p className="text-lg font-medium">{selectedPayment.totalAmount.toLocaleString()} جنيه مصري</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-600">المبلغ المدفوع</Label>
                      <p className="text-lg font-medium text-green-600">{selectedPayment.paidAmount.toLocaleString()} جنيه مصري</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-600">المبلغ المتبقي</Label>
                      <p className="text-lg font-medium text-red-600">{(selectedPayment.totalAmount - selectedPayment.paidAmount).toLocaleString()} جنيه مصري</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-600">تاريخ الدفع</Label>
                      <p className="text-lg font-medium">{selectedPayment.paymentDate}</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-600">تاريخ الاستحقاق</Label>
                      <p className="text-lg font-medium">{selectedPayment.dueDate || "غير محدد"}</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-600">طريقة الدفع</Label>
                      <p className="text-lg font-medium">{selectedPayment.paymentMethod}</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-600">رقم التحويل/الشيك</Label>
                      <p className="text-lg font-medium">{selectedPayment.transferNumber || "غير محدد"}</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-600">الحالة</Label>
                      <Badge className={getStatusColor(selectedPayment.status)}>
                        {selectedPayment.status}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-600">الأولوية</Label>
                      <Badge className={getPriorityColor(selectedPayment.priority)}>
                        {selectedPayment.priority}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-600">الحساب البنكي</Label>
                      <p className="text-lg font-medium">{selectedPayment.bankAccount || "غير محدد"}</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-600">معتمد من</Label>
                      <p className="text-lg font-medium">{selectedPayment.approvedBy || "غير محدد"}</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-600">تاريخ الإنشاء</Label>
                      <p className="text-lg font-medium">{new Date(selectedPayment.createdAt).toLocaleDateString('ar-SA')}</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-600">آخر تحديث</Label>
                      <p className="text-lg font-medium">{new Date(selectedPayment.updatedAt).toLocaleDateString('ar-SA')}</p>
                    </div>

                    <div className="space-y-2 md:col-span-2 lg:col-span-3">
                      <Label className="text-sm font-semibold text-gray-600">ملاحظات</Label>
                      <p className="text-lg font-medium">{selectedPayment.notes || "لا توجد ملاحظات"}</p>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-8 p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100">
                    <Button 
                      onClick={() => editPayment(selectedPayment)}
                      size="lg"
                      className="flex-1 gap-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                      <Edit className="w-5 h-5" />
                      تعديل البيانات
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="flex-1 gap-3 border-2 border-emerald-300 hover:bg-emerald-50 font-bold py-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                      <Download className="w-5 h-5" />
                      تحميل الإيصال
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowViewDialog(false)}
                      size="lg"
                      className="flex-1 gap-3 border-2 border-gray-300 hover:bg-gray-50 font-bold py-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                      <X className="w-5 h-5" />
                      إغلاق
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierPayments;