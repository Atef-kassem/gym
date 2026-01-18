import { useEffect, useState } from "react";
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
  Users, 
  Phone, 
  Mail, 
  MapPin,
  Building,
  Edit,
  Eye,
  MoreVertical,
  Filter,
  Star,
  Globe,
  CheckCircle,
  X
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

// Types
interface Supplier {
  id: number;
  name: string;
  activity: string;
  commercialRecord: string;
  taxNumber?: string;
  country: string;
  city: string;
  mobile: string;
  email: string;
  address: string;
  category: string;
  mainBranch: string;
  paymentTerms: string;
  paymentMethod: string;
  status: "نشط" | "معلق" | "موقوف";
  attachments: string[];
  contactPerson: string;
  totalOrders: number;
  totalValue: number;
  rating: number;
  createdAt: string;
}

// Backend supplier shape
interface BackendSupplier {
  supplier_id: number;
  name_ar: string;
  name_en: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  address?: string;
  tax_number?: string;
  website?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

  const API_BASE_URL = (import.meta as any)?.env?.VITE_API_BASE_URL || "https://metagym.metacodecx.com";

const isActiveToStatus = (isActive: boolean): Supplier["status"] => (isActive ? "نشط" : "موقوف");
const statusToIsActive = (status: Supplier["status"]): boolean => status === "نشط";

const mapBackendToUi = (b: BackendSupplier): Supplier => ({
  id: b.supplier_id,
  name: b.name_ar || b.name_en || "",
  activity: "",
  commercialRecord: "",
  taxNumber: b.tax_number || "",
  country: "",
  city: "",
  mobile: b.mobile || "",
  email: b.email || "",
  address: b.address || "",
  category: "",
  mainBranch: "",
  paymentTerms: "",
  paymentMethod: "",
  status: isActiveToStatus(b.is_active),
  attachments: [],
  contactPerson: b.contact_person || "",
  totalOrders: 0,
  totalValue: 0,
  rating: 0,
  createdAt: (b.created_at || "").toString().split("T")[0] || "",
});

const mapUiToBackend = (u: Partial<Supplier>): Partial<BackendSupplier> => ({
  // duplicate Arabic name into English if not provided elsewhere
  name_ar: u.name || "",
  name_en: u.name || "",
  contact_person: u.contactPerson || "",
  email: u.email || "",
  mobile: u.mobile || "",
  address: u.address || "",
  tax_number: u.taxNumber || "",
  is_active: statusToIsActive(u.status || "نشط"),
});

const SupplierManagement = () => {
  const { toast } = useToast();

  // State for Suppliers
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const [newSupplier, setNewSupplier] = useState<Partial<Supplier>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSuppliers = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/v1/suppliers`);
      if (!res.ok) throw new Error("فشل جلب بيانات الموردين");
      const json = await res.json();
      const list: BackendSupplier[] = json?.data?.suppliers || [];
      setSuppliers(list.map(mapBackendToUi));
    } catch (error: any) {
      toast({ title: "خطأ", description: error.message || "تعذر تحميل الموردين", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Functions
  const addSupplier = async () => {
    if (!newSupplier.name || !newSupplier.commercialRecord || !newSupplier.mobile || !newSupplier.email) {
      toast({
        title: "خطأ في التسجيل",
        description: "يرجى تعبئة جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }
    try {
      const payload = mapUiToBackend(newSupplier as Supplier);
      const res = await fetch(`${API_BASE_URL}/api/v1/suppliers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e?.message || "فشل إنشاء المورد");
      }
      const json = await res.json();
      const created: BackendSupplier = json?.data?.supplier;
      if (created) {
        setSuppliers(prev => [...prev, mapBackendToUi(created)]);
      }
      setNewSupplier({});
      setShowAddForm(false);
      toast({ title: "تم الإضافة بنجاح", description: "تم إضافة المورد الجديد" });
    } catch (error: any) {
      toast({ title: "خطأ", description: error.message || "تعذر إضافة المورد", variant: "destructive" });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "نشط":
        return "bg-success/10 text-success border-success/20";
      case "معلق":
        return "bg-warning/10 text-warning border-warning/20";
      case "موقوف":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  // Edit Supplier Function
  const editSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setNewSupplier({...supplier});
    setShowEditForm(true);
  };

  // Update Supplier Function
  const updateSupplier = async () => {
    if (!selectedSupplier || !newSupplier.name || !newSupplier.mobile || !newSupplier.email) {
      toast({
        title: "خطأ في التحديث",
        description: "يرجى تعبئة جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }
    try {
      const payload = mapUiToBackend(newSupplier as Supplier);
      const res = await fetch(`${API_BASE_URL}/api/v1/suppliers/${selectedSupplier.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e?.message || "فشل تحديث المورد");
      }
      const json = await res.json();
      const updated: BackendSupplier = json?.data?.supplier;
      setSuppliers(prev => prev.map(s => (s.id === selectedSupplier.id ? mapBackendToUi(updated) : s)));
      setNewSupplier({});
      setSelectedSupplier(null);
      setShowEditForm(false);
      toast({ title: "تم التحديث بنجاح", description: "تم تحديث بيانات المورد" });
    } catch (error: any) {
      toast({ title: "خطأ", description: error.message || "تعذر تحديث المورد", variant: "destructive" });
    }
  };

  // View Supplier Details Function
  const viewSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setShowViewDialog(true);
  };

  // Delete Supplier Function
  const deleteSupplier = async (supplierId: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/suppliers/${supplierId}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) throw new Error("فشل حذف المورد");
      setSuppliers(prev => prev.filter(supplier => supplier.id !== supplierId));
      toast({ title: "تم الحذف بنجاح", description: "تم حذف المورد من النظام" });
    } catch (error: any) {
      toast({ title: "خطأ", description: error.message || "تعذر حذف المورد", variant: "destructive" });
    }
  };

  // Cancel Edit Function
  const cancelEdit = () => {
    setNewSupplier({});
    setSelectedSupplier(null);
    setShowEditForm(false);
  };

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || supplier.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="space-y-8 p-6">
        {/* Enhanced Header with Add Supplier CTA */}
        <div className="relative overflow-hidden bg-gradient-to-r from-white/95 via-blue-50/80 to-indigo-50/70 p-8 rounded-3xl border border-white/60 shadow-2xl backdrop-blur-md">
          {/* Background decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-200/20 via-indigo-200/10 to-transparent rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-200/20 via-pink-200/10 to-transparent rounded-full blur-xl"></div>
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                <div className="relative p-4 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-2xl shadow-xl transform hover:scale-105 transition-transform duration-300">
                  <Users className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-2">
                  إدارة الموردين
                </h1>
                <p className="text-lg text-gray-600 font-medium">
                  تسجيل وإدارة بيانات الموردين والشركاء التجاريين
                </p>
              </div>
            </div>
            
            {/* Enhanced Add Supplier Button */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-500 animate-pulse"></div>
              <Button 
                onClick={() => setShowAddForm(!showAddForm)} 
                size="lg"
                className="relative gap-3 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 hover:from-green-600 hover:via-emerald-600 hover:to-teal-700 text-white font-bold py-4 px-8 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-0"
              >
                <div className="relative">
                  <Plus className="w-6 h-6" />
                  <div className="absolute inset-0 bg-white/20 rounded-full animate-ping"></div>
                </div>
                <span className="text-lg">إضافة مورد جديد</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="relative overflow-hidden bg-gradient-to-br from-white/90 to-blue-50/80 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardContent className="pt-6 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">إجمالي الموردين</p>
                  <p className="text-3xl font-bold text-gray-900 group-hover:scale-105 transition-transform duration-300">{suppliers.length}</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="text-sm text-gray-600 font-medium">مورد مسجل في النظام</div>
            </CardContent>
          </Card>
          
          <Card className="relative overflow-hidden bg-gradient-to-br from-white/90 to-green-50/80 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardContent className="pt-6 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">الموردين النشطين</p>
                  <p className="text-3xl font-bold text-green-700 group-hover:scale-105 transition-transform duration-300">{suppliers.filter(s => s.status === "نشط").length}</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Globe className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="text-sm text-gray-600 font-medium">يعملون حالياً</div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-white/90 to-purple-50/80 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardContent className="pt-6 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">إجمالي القيمة</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">{suppliers.reduce((acc, s) => acc + s.totalValue, 0).toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Building className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="text-sm text-gray-600 font-medium">جنيه مصري إجمالي المشتريات</div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-white/90 to-yellow-50/80 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 via-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardContent className="pt-6 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">متوسط التقييم</p>
                  <p className="text-3xl font-bold text-yellow-600 group-hover:scale-105 transition-transform duration-300">{(suppliers.reduce((acc, s) => acc + s.rating, 0) / suppliers.length).toFixed(1)}</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Star className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="text-sm text-gray-600 font-medium">من 5 نجوم</div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Add Supplier Form with Modern Design */}
        {showAddForm && (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-100/20 via-emerald-100/10 to-teal-100/20 rounded-3xl blur-xl"></div>
            <Card className="relative overflow-hidden bg-gradient-to-br from-white/95 to-green-50/80 backdrop-blur-md border-0 shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500"></div>
              <CardHeader className="bg-gradient-to-r from-green-50/80 to-emerald-50/60 backdrop-blur-sm p-8">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-500 rounded-2xl blur-md opacity-30 animate-pulse"></div>
                    <div className="relative p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg">
                      <Plus className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
                      إضافة مورد جديد
                    </CardTitle>
                    <CardDescription className="text-lg text-gray-600 font-medium mt-2">
                      تسجيل بيانات مورد جديد في النظام بطريقة احترافية ومتقدمة
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="supplierName">اسم المورد *</Label>
                <Input
                  id="supplierName"
                  value={newSupplier.name || ""}
                  onChange={(e) => setNewSupplier(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="اسم المؤسسة أو الشركة"
                />
              </div>
              
              <div>
                <Label htmlFor="activity">النشاط التجاري</Label>
                <Input
                  id="activity"
                  value={newSupplier.activity || ""}
                  onChange={(e) => setNewSupplier(prev => ({ ...prev, activity: e.target.value }))}
                  placeholder="نوع النشاط التجاري"
                />
              </div>

              <div>
                <Label htmlFor="commercialRecord">السجل التجاري *</Label>
                <Input
                  id="commercialRecord"
                  value={newSupplier.commercialRecord || ""}
                  onChange={(e) => setNewSupplier(prev => ({ ...prev, commercialRecord: e.target.value }))}
                  placeholder="رقم السجل التجاري"
                />
              </div>

              <div>
                <Label htmlFor="taxNumber">الرقم الضريبي</Label>
                <Input
                  id="taxNumber"
                  value={newSupplier.taxNumber || ""}
                  onChange={(e) => setNewSupplier(prev => ({ ...prev, taxNumber: e.target.value }))}
                  placeholder="الرقم الضريبي"
                />
              </div>

              <div>
                <Label htmlFor="mobile">رقم الجوال *</Label>
                <Input
                  id="mobile"
                  value={newSupplier.mobile || ""}
                  onChange={(e) => setNewSupplier(prev => ({ ...prev, mobile: e.target.value }))}
                  placeholder="05xxxxxxxx"
                />
              </div>

              <div>
                <Label htmlFor="email">البريد الإلكتروني *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newSupplier.email || ""}
                  onChange={(e) => setNewSupplier(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <Label htmlFor="country">الدولة</Label>
                <Input
                  id="country"
                  value={newSupplier.country || ""}
                  onChange={(e) => setNewSupplier(prev => ({ ...prev, country: e.target.value }))}
                  placeholder="المصرية"
                />
              </div>

              <div>
                <Label htmlFor="city">المدينة</Label>
                <Input
                  id="city"
                  value={newSupplier.city || ""}
                  onChange={(e) => setNewSupplier(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="الرياض"
                />
              </div>

              <div>
                <Label htmlFor="contactPerson">الشخص المسؤول</Label>
                <Input
                  id="contactPerson"
                  value={newSupplier.contactPerson || ""}
                  onChange={(e) => setNewSupplier(prev => ({ ...prev, contactPerson: e.target.value }))}
                  placeholder="اسم الشخص المسؤول"
                />
              </div>

              <div className="md:col-span-2 lg:col-span-3">
                <Label htmlFor="address">العنوان</Label>
                <Textarea
                  id="address"
                  value={newSupplier.address || ""}
                  onChange={(e) => setNewSupplier(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="العنوان التفصيلي"
                  rows={2}
                />
              </div>
            </div>

            <div className="flex gap-4 mt-8 p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100">
              <Button 
                onClick={addSupplier}
                size="lg"
                className="flex-1 gap-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                <CheckCircle className="w-5 h-5" />
                حفظ المورد
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowAddForm(false)}
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
        )}

        {/* Enhanced Search and Filters */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-white/95 to-gray-50/80 backdrop-blur-md border-0 shadow-xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-primary transition-colors duration-300" />
                  <Input
                    placeholder="البحث عن مورد..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-4 h-12 bg-gradient-to-r from-white to-gray-50/80 border-gray-200 hover:border-primary focus:border-primary transition-all duration-300 shadow-md hover:shadow-lg rounded-xl"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-48 h-12 bg-gradient-to-r from-white to-gray-50/80 border-gray-200 hover:border-primary transition-all duration-300 shadow-md hover:shadow-lg rounded-xl">
                    <Filter className="w-4 h-4 mr-2 text-gray-500" />
                    <SelectValue placeholder="الحالة" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl shadow-2xl border-0 bg-white/95 backdrop-blur-md">
                    <SelectItem value="all">جميع الحالات</SelectItem>
                    <SelectItem value="نشط">نشط</SelectItem>
                    <SelectItem value="معلق">معلق</SelectItem>
                    <SelectItem value="موقوف">موقوف</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Suppliers Table */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-white/95 to-gray-50/80 backdrop-blur-md border-0 shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500"></div>
          <CardHeader className="bg-gradient-to-r from-green-50/80 to-blue-50/60 backdrop-blur-sm">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-blue-600 shadow-lg">
                <Users className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-green-700 to-blue-700 bg-clip-text text-transparent">
                قائمة الموردين ({filteredSuppliers.length})
              </span>
            </CardTitle>
          </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>المورد</TableHead>
                <TableHead>النشاط</TableHead>
                <TableHead>الاتصال</TableHead>
                <TableHead>المنطقة</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>التقييم</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSuppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{supplier.name}</div>
                      <div className="text-sm text-muted-foreground">{supplier.id}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{supplier.activity}</div>
                      <div className="text-sm text-muted-foreground">{supplier.category}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="w-3 h-3" />
                        {supplier.mobile}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Mail className="w-3 h-3" />
                        {supplier.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span className="text-sm">{supplier.city}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(supplier.status)}>
                      {supplier.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-warning fill-current" />
                      <span>{supplier.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                       <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => viewSupplier(supplier)}>
                          <Eye className="mr-2 h-4 w-4" />
                          عرض التفاصيل
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => editSupplier(supplier)}>
                          <Edit className="mr-2 h-4 w-4" />
                          تعديل البيانات
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => deleteSupplier(supplier.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="mr-2 h-4 w-4" />
                          حذف المورد
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        </Card>

        {/* Edit Supplier Form */}
        {showEditForm && selectedSupplier && (
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
                          <Edit className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div>
                        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                          تعديل بيانات المورد
                        </CardTitle>
                        <CardDescription className="text-lg text-gray-600 font-medium mt-2">
                          تحديث بيانات المورد: {selectedSupplier.name}
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
                      <Input
                        id="editSupplierName"
                        value={newSupplier.name || ""}
                        onChange={(e) => setNewSupplier(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="اسم المؤسسة أو الشركة"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="editActivity">النشاط التجاري</Label>
                      <Input
                        id="editActivity"
                        value={newSupplier.activity || ""}
                        onChange={(e) => setNewSupplier(prev => ({ ...prev, activity: e.target.value }))}
                        placeholder="نوع النشاط التجاري"
                      />
                    </div>

                    <div>
                      <Label htmlFor="editCommercialRecord">السجل التجاري *</Label>
                      <Input
                        id="editCommercialRecord"
                        value={newSupplier.commercialRecord || ""}
                        onChange={(e) => setNewSupplier(prev => ({ ...prev, commercialRecord: e.target.value }))}
                        placeholder="رقم السجل التجاري"
                      />
                    </div>

                    <div>
                      <Label htmlFor="editTaxNumber">الرقم الضريبي</Label>
                      <Input
                        id="editTaxNumber"
                        value={newSupplier.taxNumber || ""}
                        onChange={(e) => setNewSupplier(prev => ({ ...prev, taxNumber: e.target.value }))}
                        placeholder="الرقم الضريبي"
                      />
                    </div>

                    <div>
                      <Label htmlFor="editMobile">رقم الجوال *</Label>
                      <Input
                        id="editMobile"
                        value={newSupplier.mobile || ""}
                        onChange={(e) => setNewSupplier(prev => ({ ...prev, mobile: e.target.value }))}
                        placeholder="05xxxxxxxx"
                      />
                    </div>

                    <div>
                      <Label htmlFor="editEmail">البريد الإلكتروني *</Label>
                      <Input
                        id="editEmail"
                        type="email"
                        value={newSupplier.email || ""}
                        onChange={(e) => setNewSupplier(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="email@example.com"
                      />
                    </div>

                    <div>
                      <Label htmlFor="editCountry">الدولة</Label>
                      <Input
                        id="editCountry"
                        value={newSupplier.country || ""}
                        onChange={(e) => setNewSupplier(prev => ({ ...prev, country: e.target.value }))}
                        placeholder="المصرية"
                      />
                    </div>

                    <div>
                      <Label htmlFor="editCity">المدينة</Label>
                      <Input
                        id="editCity"
                        value={newSupplier.city || ""}
                        onChange={(e) => setNewSupplier(prev => ({ ...prev, city: e.target.value }))}
                        placeholder="الرياض"
                      />
                    </div>

                    <div>
                      <Label htmlFor="editContactPerson">الشخص المسؤول</Label>
                      <Input
                        id="editContactPerson"
                        value={newSupplier.contactPerson || ""}
                        onChange={(e) => setNewSupplier(prev => ({ ...prev, contactPerson: e.target.value }))}
                        placeholder="اسم الشخص المسؤول"
                      />
                    </div>

                    <div>
                      <Label htmlFor="editStatus">الحالة</Label>
                      <Select 
                        value={newSupplier.status || "نشط"} 
                        onValueChange={(value) => setNewSupplier(prev => ({ ...prev, status: value as "نشط" | "معلق" | "موقوف" }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الحالة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="نشط">نشط</SelectItem>
                          <SelectItem value="معلق">معلق</SelectItem>
                          <SelectItem value="موقوف">موقوف</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="md:col-span-2 lg:col-span-3">
                      <Label htmlFor="editAddress">العنوان</Label>
                      <Textarea
                        id="editAddress"
                        value={newSupplier.address || ""}
                        onChange={(e) => setNewSupplier(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="العنوان التفصيلي"
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 mt-8 p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100">
                    <Button 
                      onClick={updateSupplier}
                      size="lg"
                      className="flex-1 gap-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                      <CheckCircle className="w-5 h-5" />
                      تحديث البيانات
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

        {/* View Supplier Details Dialog */}
        {showViewDialog && selectedSupplier && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="relative max-w-4xl w-full max-h-[90vh] overflow-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-green-100/20 via-emerald-100/10 to-teal-100/20 rounded-3xl blur-xl"></div>
              <Card className="relative overflow-hidden bg-gradient-to-br from-white/95 to-green-50/80 backdrop-blur-md border-0 shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500"></div>
                <CardHeader className="bg-gradient-to-r from-green-50/80 to-emerald-50/60 backdrop-blur-sm p-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-green-500 rounded-2xl blur-md opacity-30 animate-pulse"></div>
                        <div className="relative p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg">
                          <Eye className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div>
                        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
                          تفاصيل المورد
                        </CardTitle>
                        <CardDescription className="text-lg text-gray-600 font-medium mt-2">
                          معلومات شاملة عن المورد
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
                      <Label className="text-sm font-semibold text-gray-600">اسم المورد</Label>
                      <p className="text-lg font-medium">{selectedSupplier.name}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-600">رقم المورد</Label>
                      <p className="text-lg font-medium">{selectedSupplier.id}</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-600">النشاط التجاري</Label>
                      <p className="text-lg font-medium">{selectedSupplier.activity}</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-600">السجل التجاري</Label>
                      <p className="text-lg font-medium">{selectedSupplier.commercialRecord}</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-600">الرقم الضريبي</Label>
                      <p className="text-lg font-medium">{selectedSupplier.taxNumber || "غير محدد"}</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-600">الحالة</Label>
                      <Badge className={getStatusColor(selectedSupplier.status)}>
                        {selectedSupplier.status}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-600">رقم الجوال</Label>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <p className="text-lg font-medium">{selectedSupplier.mobile}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-600">البريد الإلكتروني</Label>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <p className="text-lg font-medium">{selectedSupplier.email}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-600">المنطقة</Label>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <p className="text-lg font-medium">{selectedSupplier.city}, {selectedSupplier.country}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-600">الشخص المسؤول</Label>
                      <p className="text-lg font-medium">{selectedSupplier.contactPerson}</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-600">التقييم</Label>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-warning fill-current" />
                        <span className="text-lg font-medium">{selectedSupplier.rating}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-600">إجمالي الطلبات</Label>
                      <p className="text-lg font-medium">{selectedSupplier.totalOrders}</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-600">إجمالي القيمة</Label>
                      <p className="text-lg font-medium">{selectedSupplier.totalValue.toLocaleString()} جنيه مصري</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-600">تاريخ التسجيل</Label>
                      <p className="text-lg font-medium">{selectedSupplier.createdAt}</p>
                    </div>

                    <div className="space-y-2 md:col-span-2 lg:col-span-3">
                      <Label className="text-sm font-semibold text-gray-600">العنوان</Label>
                      <p className="text-lg font-medium">{selectedSupplier.address}</p>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-8 p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100">
                    <Button 
                      onClick={() => editSupplier(selectedSupplier)}
                      size="lg"
                      className="flex-1 gap-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                      <Edit className="w-5 h-5" />
                      تعديل البيانات
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

export default SupplierManagement;